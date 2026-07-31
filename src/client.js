import { constructLLMUrl, constructImageUrl, constructApiUrl, handleErrors, ENDPOINTS } from './utils.js';
import { parseSSE } from './stream.js';
import { normalizeParams, buildUrl } from './normalizer.js';
import { IMAGE_MODELS, IMAGE_MODEL_ALIASES } from './models/image.js';
import { VIDEO_MODELS, VIDEO_MODEL_ALIASES } from './models/video.js';
import { AUDIO_MODELS, AUDIO_MODEL_ALIASES } from './models/audio.js';

/**
 * @typedef {Object} ClientConfig
 * @property {string} apiKey - Your Chutes API Key
 * @property {number} [timeout=60000] - Request timeout in ms
 */

/**
 * @typedef {Object} ChuteTarget
 * @property {string} name - Chute name (e.g., 'flux-dev')
 * @property {string} username - Chute owner (e.g., 'chutes')
 */

/**
 * @typedef {Object} JobStatus
 * @property {string} id - Job ID
 * @property {'pending' | 'running' | 'completed' | 'failed'} state
 * @property {any} [result] - Result data if completed
 * @property {string} [error] - Error message if failed
 */

/**
 * Constructs subdomain URL for a specific chute
 * @param {string} name - Chute name
 * @param {string} username - Chute owner
 * @param {string} [path='/'] - Endpoint path
 * @returns {string}
 */
const constructChuteUrl = (name, username, path = '/') => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `https://${name}-${username}.chutes.ai${cleanPath}`;
};

/**
 * Creates a stateless Chutes client
 * @param {ClientConfig} config
 */
export const createClient = ({ apiKey, timeout = 60000 }) => {

    /** @returns {HeadersInit} */
    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    });

    /**
     * Creates an AbortController with timeout
     * @param {number} [ms]
     * @returns {{ signal: AbortSignal, clear: () => void }}
     */
    const createTimeout = (ms = timeout) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), ms);
        return {
            signal: controller.signal,
            clear: () => clearTimeout(id)
        };
    };

    // ========================================
    // LLM METHODS (use llm.chutes.ai)
    // ========================================

    /**
     * Chat completion (OpenAI-compatible)
     * @param {Object} options
     * @param {string} options.model - Model ID (e.g., 'zai-org/GLM-4.7-TEE')
     * @param {Array<{role: string, content: string}>} options.messages - Chat messages
     * @param {boolean} [options.stream=false] - Enable streaming
     * @param {Object} [options.extra] - Additional parameters
     * @returns {Promise<any>}
     */
    const chat = async ({ model, messages, stream = false, ...extra }) => {
        const url = constructLLMUrl('/chat/completions');
        const { signal, clear } = createTimeout();

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ model, messages, stream, ...extra }),
                signal
            });

            await handleErrors(response);
            return response.json();
        } finally {
            clear();
        }
    };

    /**
     * Lists the LLM models currently available to your key.
     *
     * Worth calling rather than hardcoding a model ID. Chutes retires and
     * renames models, so an ID that worked last month may return
     * 404 "model not found" today.
     *
     * @returns {Promise<Array<Object>>} Model entries, each with id, pricing,
     *   context_length, max_output_length and input_modalities
     */
    const models = async () => {
        const url = constructLLMUrl('/models');
        const { signal, clear } = createTimeout();

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders(),
                signal
            });

            await handleErrors(response);
            const body = await response.json();
            return body.data ?? body;
        } finally {
            clear();
        }
    };

    /**
     * Streaming chat completion
     * @param {Object} options
     * @param {string} options.model - Model ID
     * @param {Array<{role: string, content: string}>} options.messages - Chat messages
     * @param {Object} [options.extra] - Additional parameters
     * @returns {AsyncGenerator<any, void, unknown>}
     */
    const chatStream = async function* ({ model, messages, ...extra }) {
        const url = constructLLMUrl('/chat/completions');

        const response = await fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ model, messages, stream: true, ...extra })
        });

        await handleErrors(response);

        if (!response.body) {
            throw new Error('Response body is empty');
        }

        yield* parseSSE(response.body);
    };

    // ========================================
    // IMAGE METHODS (use image.chutes.ai or subdomain)
    // ========================================

    /**
     * Generate an image using unified parameters
     * @param {Object} options
     * @param {string} options.model - Model ID (e.g., 'qwen-image', 'flux', 'hidream')
     * @param {string} options.prompt - Image prompt
     * @param {string} [options.aspectRatio] - Aspect ratio (e.g., '16:9', '1:1')
     * @param {number} [options.width] - Image width (conflicts with aspectRatio)
     * @param {number} [options.height] - Image height (conflicts with aspectRatio)
     * @param {number} [options.steps] - Number of inference steps
     * @param {number} [options.cfgScale] - Guidance scale
     * @param {string} [options.negativePrompt] - Negative prompt
     * @param {number|null} [options.seed] - Random seed
     * @param {string|string[]} [options.images] - Reference images for editing models (base64 or URL)
     * @returns {Promise<Blob|Object>}
     */
    const image = async ({ model, ...userParams }) => {
        // Normalize params based on model config
        const { config, payload, resolvedModel } = await normalizeParams(
            model,
            userParams,
            IMAGE_MODELS,
            IMAGE_MODEL_ALIASES
        );

        // Build URL
        const url = buildUrl(config);

        // Add model ID for centralized API
        if (config.type === 'centralized') {
            payload.model = resolvedModel;
        }

        const { signal, clear } = createTimeout(config.timeout || timeout);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload),
                signal
            });

            await handleErrors(response);

            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('image')) {
                return response.blob();
            }
            return response.json();
        } finally {
            clear();
        }
    };

    // ========================================
    // VIDEO METHODS (use chutes-{model}.chutes.ai)
    // ========================================

    /**
     * Generate a video using unified parameters
     * @param {Object} options
     * @param {string} options.model - Model ID (e.g., 'wan-2-2-i2v-14b-fast', 'wan', 'i2v')
     * @param {string} options.prompt - Video prompt
     * @param {string} options.image - Reference image for I2V (base64 or URL)
     * @param {string} [options.aspectRatio] - Aspect ratio (e.g., '16:9')
     * @param {string} [options.resolution] - Video resolution ('480p', '720p')
     * @param {number} [options.duration] - Duration in seconds (conflicts with frames)
     * @param {number} [options.frames] - Number of frames (conflicts with duration)
     * @param {number} [options.fps] - Frames per second
     * @param {number} [options.cfgScale] - Guidance scale
     * @param {string} [options.negativePrompt] - Negative prompt
     * @param {number|null} [options.seed] - Random seed
     * @returns {Promise<Blob|Object>}
     */
    const video = async ({ model, ...userParams }) => {
        // Normalize params based on model config
        const { config, payload } = await normalizeParams(
            model,
            userParams,
            VIDEO_MODELS,
            VIDEO_MODEL_ALIASES
        );

        // Build URL
        const url = buildUrl(config);
        const timeoutMs = config.timeout || 300000;
        const { signal, clear } = createTimeout(timeoutMs);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload),
                signal
            });

            await handleErrors(response);

            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('video') || contentType.includes('octet-stream')) {
                return response.blob();
            }
            return response.json();
        } finally {
            clear();
        }
    };

    // ========================================
    // AUDIO METHODS (use chutes-{model}.chutes.ai)
    // ========================================

    /**
     * Generate audio (Text-to-Speech) using unified parameters
     * @param {Object} options
     * @param {string} options.model - Model ID (e.g., 'kokoro', 'csm-1b', 'tts')
     * @param {string} options.text - Text to speak
     * @param {string} [options.voice] - Voice ID (for Kokoro)
     * @param {number} [options.speed] - Playback speed (for Kokoro)
     * @param {number} [options.speaker] - Speaker ID (for CSM)
     * @param {number} [options.maxDuration] - Max duration in seconds (for CSM)
     * @returns {Promise<Blob|Object>}
     */
    const audio = async ({ model, ...userParams }) => {
        // Normalize params based on model config
        const { config, payload } = await normalizeParams(
            model,
            userParams,
            AUDIO_MODELS,
            AUDIO_MODEL_ALIASES
        );

        // Build URL
        const url = buildUrl(config);
        const timeoutMs = config.timeout || 120000;
        const { signal, clear } = createTimeout(timeoutMs);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload),
                signal
            });

            await handleErrors(response);

            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('audio') || contentType.includes('octet-stream')) {
                return response.blob();
            }
            return response.json();
        } finally {
            clear();
        }
    };

    // ========================================
    // INVOKE METHODS (use subdomain URLs)
    // For video/custom chutes
    // ========================================

    /**
     * Invoke a specific chute endpoint (subdomain-based)
     * Use for image generation, video, or custom deployments
     * @param {ChuteTarget} target - { name, username }
     * @param {string} path - Endpoint path (e.g., '/generate')
     * @param {Object} payload - Request body
     * @returns {Promise<any>}
     */
    const invoke = async (target, path, payload) => {
        const url = constructChuteUrl(target.name, target.username, path);
        const { signal, clear } = createTimeout();

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload),
                signal
            });

            await handleErrors(response);

            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                return response.json();
            }
            if (contentType.includes('image')) {
                return response.blob();
            }
            return response.text();
        } finally {
            clear();
        }
    };

    /**
     * Invoke a streaming chute endpoint
     * @param {ChuteTarget} target - { name, username }
     * @param {string} path - Endpoint path
     * @param {Object} payload - Request body
     * @returns {AsyncGenerator<any, void, unknown>}
     */
    const invokeStream = async function* (target, path, payload) {
        const url = constructChuteUrl(target.name, target.username, path);

        const response = await fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });

        await handleErrors(response);

        if (!response.body) {
            throw new Error('Response body is empty');
        }

        yield* parseSSE(response.body);
    };

    // ========================================
    // JOBS API (use api.chutes.ai with token)
    // ========================================

    /**
     * Get status of a job
     * @param {string} jobId
     * @returns {Promise<JobStatus>}
     */
    const getJobStatus = async (jobId) => {
        const url = `${constructApiUrl(`/jobs/${jobId}`)}?token=${encodeURIComponent(apiKey)}`;
        const { signal, clear } = createTimeout();

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders(),
                signal
            });
            await handleErrors(response);
            return response.json();
        } finally {
            clear();
        }
    };

    /**
     * Delete/cancel a job
     * @param {string} jobId
     * @returns {Promise<void>}
     */
    const deleteJob = async (jobId) => {
        const url = `${constructApiUrl(`/jobs/${jobId}`)}?token=${encodeURIComponent(apiKey)}`;
        const { signal, clear } = createTimeout();

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: getHeaders(),
                signal
            });
            await handleErrors(response);
        } finally {
            clear();
        }
    };

    return {
        // LLM (centralized endpoint)
        chat,
        chatStream,
        models,
        // Image (centralized endpoint)
        image,
        // Video (chutes-{model} subdomain)
        video,
        // Audio (chutes-{model} subdomain)
        audio,
        // Custom chutes (subdomain-based)
        invoke,
        invokeStream,
        // Jobs
        getJobStatus,
        deleteJob,
        // Expose for debugging
        endpoints: ENDPOINTS
    };
};
