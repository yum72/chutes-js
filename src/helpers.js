import { writeFile } from 'node:fs/promises';

/**
 * Saves a Blob to a file (Node.js only)
 * @param {Blob} blob - The blob to save
 * @param {string} path - File path to save to
 * @returns {Promise<void>}
 */
export const saveBlob = async (blob, path) => {
    const buffer = Buffer.from(await blob.arrayBuffer());
    await writeFile(path, buffer);
};
