/**
 * Parameter converters for translating common params to model-specific formats
 */

/** @type {number} */
const IMAGE_FETCH_TIMEOUT = 30000; // 30 seconds

/**
 * @typedef {{width: number, height: number}} Dimensions
 */

/**
 * Standard aspect ratio to width/height mapping
 * @type {Record<string, Dimensions>}
 */
const ASPECT_DIMENSIONS = {
  '1:1':  { width: 1024, height: 1024 },
  '16:9': { width: 1360, height: 768 },
  '9:16': { width: 768, height: 1360 },
  '4:3':  { width: 1168, height: 880 },
  '3:4':  { width: 880, height: 1168 },
  '3:2':  { width: 1248, height: 832 },
  '2:3':  { width: 832, height: 1248 },
  '21:9': { width: 1536, height: 656 },
  '9:21': { width: 656, height: 1536 }
};

/**
 * HiDream resolution enum mapping
 * @type {Record<string, string>}
 */
const HIDREAM_RESOLUTIONS = {
  '1:1':  '1024x1024',
  '16:9': '1360x768',
  '9:16': '768x1360',
  '4:3':  '1168x880',
  '3:4':  '880x1168',
  '3:2':  '1248x832',
  '2:3':  '832x1248'
};

/**
 * Video resolution mapping
 * @type {Record<string, string>}
 */
const VIDEO_RESOLUTIONS = {
  '16:9': '480p',
  '9:16': '480p',
  '4:3':  '480p',
  '1:1':  '480p',
  'hd':   '720p',
  '720p': '720p',
  '480p': '480p'
};

/**
 * Check if string is a URL
 * @param {string} str
 * @returns {boolean}
 */
function isUrl(str) {
  return typeof str === 'string' && (str.startsWith('http://') || str.startsWith('https://'));
}

/**
 * Convert ArrayBuffer to base64 string
 * Works in Node.js, browsers, and Workers
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function bufferToBase64(buffer) {
  // Node.js
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(buffer).toString('base64');
  }
  
  // Browser/Workers
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Fetch image from URL and convert to base64
 * @param {string} url
 * @param {number} [timeoutMs]
 * @returns {Promise<string>}
 */
async function fetchImageAsBase64(url, timeoutMs = IMAGE_FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image from ${url}: HTTP ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type') || '';
    
    // Warn if content-type doesn't look like an image
    // But still allow - some servers misconfigure headers
    if (!contentType.includes('image') && !contentType.includes('octet-stream')) {
      console.warn(
        `Warning: URL "${url}" returned Content-Type "${contentType}" ` +
        `(expected image/*). Proceeding anyway.`
      );
    }
    
    const buffer = await response.arrayBuffer();
    return bufferToBase64(buffer);
  } catch (err) {
    if (/** @type {Error} */ (err).name === 'AbortError') {
      throw new Error(`Timeout fetching image from ${url} (${timeoutMs}ms)`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Normalize single image input (for video I2V)
 * @param {string} input - base64 or URL
 * @returns {Promise<string>}
 */
export async function normalizeImage(input) {
  if (isUrl(input)) {
    return fetchImageAsBase64(input);
  }
  return input;
}

/**
 * Normalize images input to array of base64 strings (for image editing)
 * @param {string | string[]} input - Single image or array of images
 * @returns {Promise<string[]>}
 */
export async function normalizeImages(input) {
  const images = Array.isArray(input) ? input : [input];
  return Promise.all(images.map(normalizeImage));
}

/**
 * @typedef {(value: any, fps?: number) => any} ConverterFunction
 */

/**
 * Converter functions for parameter transformation
 * @type {Record<string, ConverterFunction>}
 */
export const CONVERTERS = {
  /**
   * Convert aspect ratio to width/height object
   * @param {string} aspectRatio - e.g., "16:9"
   * @returns {Dimensions}
   */
  aspectToWidthHeight: (aspectRatio) => {
    const dims = ASPECT_DIMENSIONS[aspectRatio];
    if (!dims) {
      throw new Error(`Unsupported aspect ratio: "${aspectRatio}". Supported: ${Object.keys(ASPECT_DIMENSIONS).join(', ')}`);
    }
    return dims;
  },

  /**
   * Convert aspect ratio to HiDream resolution enum
   * @param {string} aspectRatio
   * @returns {string}
   */
  aspectToResolutionEnum: (aspectRatio) => {
    const res = HIDREAM_RESOLUTIONS[aspectRatio];
    if (!res) {
      throw new Error(`Unsupported aspect ratio for this model: "${aspectRatio}". Supported: ${Object.keys(HIDREAM_RESOLUTIONS).join(', ')}`);
    }
    return res;
  },

  /**
   * Convert aspect ratio to Hunyuan size string (passes through directly)
   * Hunyuan accepts "16:9", "WxH", or "auto"
   * @param {string} aspectRatio
   * @returns {string}
   */
  aspectToSizeString: (aspectRatio) => {
    // Hunyuan accepts aspect ratios directly
    return aspectRatio;
  },

  /**
   * Convert aspect ratio to video resolution
   * @param {string} aspectRatio
   * @returns {string}
   */
  aspectToVideoResolution: (aspectRatio) => {
    const res = VIDEO_RESOLUTIONS[aspectRatio];
    if (!res) {
      // Default to 480p for unknown aspect ratios
      return '480p';
    }
    return res;
  },

  /**
   * Convert duration in seconds to frame count
   * @param {number} durationSeconds
   * @param {number} [fps]
   * @returns {number}
   */
  durationToFrames: (durationSeconds, fps = 16) => {
    return Math.round(durationSeconds * fps);
  },

  /**
   * Convert seconds to milliseconds
   * @param {number} seconds
   * @returns {number}
   */
  secondsToMs: (seconds) => {
    return Math.round(seconds * 1000);
  },

  /**
   * Normalize single image (async - for video I2V)
   * @param {string} input - base64 or URL
   * @returns {Promise<string>}
   */
  normalizeImage: normalizeImage,

  /**
   * Normalize images array (async - for image editing)
   * @param {string | string[]} input
   * @returns {Promise<string[]>}
   */
  normalizeImages: normalizeImages
};

// Export dimension mappings for reference
export { ASPECT_DIMENSIONS, HIDREAM_RESOLUTIONS, VIDEO_RESOLUTIONS };
