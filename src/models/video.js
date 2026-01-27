/**
 * @typedef {import('../normalizer.js').ModelConfig} ModelConfig
 * @typedef {import('../normalizer.js').ModelConfigs} ModelConfigs
 * @typedef {import('../normalizer.js').ModelAliases} ModelAliases
 */

/**
 * Video model configurations
 * @type {ModelConfigs}
 */
export const VIDEO_MODELS = /** @type {const} */ ({
  'wan-2-2-i2v-14b-fast': {
    type: 'subdomain',
    subdomain: 'chutes-wan-2-2-i2v-14b-fast',
    endpoint: '/generate',
    timeout: 300000, // 5 minutes
    params: {
      prompt: { required: true, target: 'prompt', maxLength: 16384, minLength: 3 },
      image: { 
        required: true, 
        target: 'image'
        // Don't convert - API accepts both URL and base64 directly
      },
      negativePrompt: { 
        target: 'negative_prompt',
        default: '色调艳丽，过曝，静态，细节模糊不清，字幕，风格，作品，画作，画面，静止，整体发灰，最差质量，低质量，JPEG压缩残留，丑陋的，残缺的，多余的手指，画得不好的手部，画得不好的脸部，畸形的，毁容的，形态畸形的肢体，手指融合，静止不动的画面，杂乱的背景，三条腿，背景人很多，倒着走'
      },
      aspectRatio: {
        target: 'resolution',
        converter: 'aspectToVideoResolution',
        allowedValues: ['480p', '720p'],
        default: '480p'
      },
      resolution: { target: 'resolution', default: '480p' },
      duration: {
        target: 'frames',
        converter: 'durationToFrames',
        conflictsWith: ['frames']
      },
      frames: { target: 'frames', default: 81, min: 21, max: 140 },
      fps: { target: 'fps', default: 16, min: 16, max: 24 },
      cfgScale: { target: 'guidance_scale', default: 1, min: 0, max: 10 },
      cfgScale2: { target: 'guidance_scale_2', default: 1, min: 0, max: 10 },
      seed: { target: 'seed', default: null },
      fast: { target: 'fast', default: true }
    }
  }
});

/**
 * Model aliases
 * @type {ModelAliases}
 */
export const VIDEO_MODEL_ALIASES = /** @type {const} */ ({
  'wan': 'wan-2-2-i2v-14b-fast',
  'wan-i2v': 'wan-2-2-i2v-14b-fast',
  'i2v': 'wan-2-2-i2v-14b-fast'
});
