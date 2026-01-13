import { ChutesError } from './errors.js';

/**
 * Base URLs for Chutes.ai services
 */
export const ENDPOINTS = {
    LLM: 'https://llm.chutes.ai/v1',
    IMAGE: 'https://image.chutes.ai',
    API: 'https://api.chutes.ai'
};

/**
 * Constructs the URL for an LLM endpoint
 * @param {string} [path='/chat/completions'] - API path
 * @returns {string}
 */
export const constructLLMUrl = (path = '/chat/completions') => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${ENDPOINTS.LLM}${cleanPath}`;
};

/**
 * Constructs the URL for an Image endpoint
 * @param {string} [path='/generate'] - API path
 * @returns {string}
 */
export const constructImageUrl = (path = '/generate') => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${ENDPOINTS.IMAGE}${cleanPath}`;
};

/**
 * Constructs the URL for the platform API (jobs, etc)
 * @param {string} path - API path (e.g., '/jobs/123')
 * @returns {string}
 */
export const constructApiUrl = (path) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${ENDPOINTS.API}${cleanPath}`;
};

/**
 * Standardized error handling for Chutes responses
 * @param {Response} response
 * @throws {ChutesError}
 */
export const handleErrors = async (response) => {
    if (!response.ok) {
        let body = '';
        try {
            body = await response.text();
        } catch (_) { /* ignore parse error */ }

        throw new ChutesError(response.status, response.statusText, body);
    }
};
