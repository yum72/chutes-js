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

/**
 * Validation error for invalid parameters
 * @example
 * try { await client.image({ model: 'flux', prompt: '', steps: 200 }) }
 * catch (e) { if (e.name === 'ValidationError') console.log(e.errors) }
 */
export class ValidationError extends Error {
    /**
     * @param {string} model - Model that was being used
     * @param {string[]} errors - Array of validation error messages
     */
    constructor(model, errors) {
        const message = `Invalid parameters for "${model}":\n  - ${errors.join('\n  - ')}`;
        super(message);
        this.name = 'ValidationError';
        this.model = model;
        this.errors = errors;
    }
}
