import { constructLLMUrl, constructImageUrl, constructApiUrl, handleErrors, ENDPOINTS } from './utils.js';
import { parseSSE } from './stream.js';

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
    // IMAGE METHODS (use image.chutes.ai)
    // ========================================

    /**
     * Generate an image
     * @param {Object} options
     * @param {string} options.model - Model ID (e.g., 'qwen-image')
     * @param {string} options.prompt - Image prompt
     * @param {number} [options.width=1024] - Image width
     * @param {number} [options.height=1024] - Image height
     * @param {number} [options.guidance_scale=7.5] - Guidance scale
     * @param {number} [options.num_inference_steps=50] - Inference steps
     * @param {Object} [options.extra] - Additional parameters
     * @returns {Promise<Blob|Object>}
     */
    const image = async ({ model, prompt, width = 1024, height = 1024, guidance_scale = 7.5, num_inference_steps = 50, ...extra }) => {
        const url = 'https://image.chutes.ai/generate';
        const { signal, clear } = createTimeout();

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ model, prompt, width, height, guidance_scale, num_inference_steps, ...extra }),
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
     * Generate a video
     * @param {Object} options
     * @param {string} options.model - Model slug (e.g., 'wan-2-2-i2v-14b-fast')
     * @param {string} options.prompt - Video prompt
     * @param {string} [options.resolution='480p'] - Video resolution
     * @param {number} [options.fps=16] - Frames per second
     * @param {number} [options.frames=81] - Number of frames
     * @param {number} [options.seed] - Random seed
     * @param {boolean} [options.fast=true] - Use fast mode
     * @param {number} [options.guidance_scale=1] - Guidance scale
     * @param {number} [options.guidance_scale_2=1] - Secondary guidance scale
     * @param {string} [options.negative_prompt] - Negative prompt
     * @param {string} [options.image] - Base64 image for I2V models
     * @param {Object} [options.extra] - Additional parameters
     * @returns {Promise<Blob|Object>}
     */
    const video = async ({ model, prompt, resolution = '480p', fps = 16, frames = 81, seed, fast = true, guidance_scale = 1, guidance_scale_2 = 1, negative_prompt, image, ...extra }) => {
        const modelSlug = model.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const url = `https://chutes-${modelSlug}.chutes.ai/generate`;
        const { signal, clear } = createTimeout(300000); // 5 min timeout for video

        const payload = {
            prompt,
            resolution,
            fps,
            frames,
            fast,
            guidance_scale,
            guidance_scale_2,
            ...(seed !== undefined && { seed }),
            ...(negative_prompt && { negative_prompt }),
            ...(image && { image }),
            ...extra
        };

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
     * Generate audio (Text-to-Speech)
     * @param {Object} options
     * @param {string} options.model - Model slug (e.g., 'kokoro', 'csm-1b')
     * @param {string} options.text - Text to speak
     * @param {number} [options.speaker] - Speaker ID (for CSM models)
     * @param {number} [options.max_duration_ms] - Max duration (for CSM models)
     * @param {number} [options.speed=1] - Speed (for Kokoro models)
     * @param {string} [options.voice] - Voice ID (for Kokoro models)
     * @param {Object} [options.extra] - Additional parameters
     * @returns {Promise<Blob|Object>}
     */
    const audio = async ({ model, text, speaker, max_duration_ms, speed, voice, ...extra }) => {
        const modelSlug = model.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const url = `https://chutes-${modelSlug}.chutes.ai/speak`;
        const { signal, clear } = createTimeout(120000); // 2 min timeout for audio

        const payload = {
            text,
            ...(speaker !== undefined && { speaker }),
            ...(max_duration_ms !== undefined && { max_duration_ms }),
            ...(speed !== undefined && { speed }),
            ...(voice !== undefined && { voice }),
            ...extra
        };

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
