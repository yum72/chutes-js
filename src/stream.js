/**
 * Parses a ReadableStream of Server-Sent Events (SSE)
 * Handles multi-line data events by concatenating before parsing
 * 
 * @param {ReadableStream<Uint8Array>} stream
 * @returns {AsyncGenerator<any, void, unknown>}
 */
export async function* parseSSE(stream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // SSE messages are separated by double newlines
            const parts = buffer.split('\n\n');
            buffer = parts.pop() || ''; // Keep incomplete chunk in buffer

            for (const part of parts) {
                if (!part.trim()) continue;

                // Collect all data: lines and concatenate them
                const lines = part.split('\n');
                const dataLines = [];

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        dataLines.push(line.slice(6));
                    }
                    // Ignore event:, id:, retry: fields (SSE spec)
                }

                if (dataLines.length === 0) continue;

                const fullData = dataLines.join('').trim();

                if (fullData === '[DONE]') return; // OpenAI/Chutes standard end signal

                try {
                    yield JSON.parse(fullData);
                } catch (e) {
                    // If it's not JSON, return the raw string
                    yield fullData;
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}
