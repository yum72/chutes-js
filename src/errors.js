/**
 * Custom error class for Chutes API errors
 * Allows consumers to programmatically handle specific status codes
 * @example
 * try { await client.invoke(...) }
 * catch (e) { if (e.status === 429) // rate limited }
 */
export class ChutesError extends Error {
    /**
     * @param {number} status - HTTP status code
     * @param {string} message - Error message
     * @param {string} [body] - Raw response body
     */
    constructor(status, message, body) {
        super(`Chutes API Error (${status}): ${message}`);
        this.name = 'ChutesError';
        this.status = status;
        this.body = body;
    }
}
