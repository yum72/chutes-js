/**
 * @typedef {import('../normalizer.js').ModelConfig} ModelConfig
 * @typedef {import('../normalizer.js').ModelConfigs} ModelConfigs
 * @typedef {import('../normalizer.js').ModelAliases} ModelAliases
 */

/**
 * Audio/TTS model configurations
 * @type {ModelConfigs}
 */
export const AUDIO_MODELS = /** @type {const} */ ({
  'kokoro': {
    type: 'subdomain',
    subdomain: 'chutes-kokoro',
    endpoint: '/speak',
    timeout: 120000, // 2 minutes
    params: {
      text: { required: true, target: 'text' },
      voice: { 
        target: 'voice', 
        default: 'af_heart',
        allowedValues: [
          'af_heart', 'af_alloy', 'af_aoede', 'af_bella', 'af_jessica', 'af_kore',
          'af_nicole', 'af_nova', 'af_river', 'af_sarah', 'af_sky',
          'am_adam', 'am_echo', 'am_eric', 'am_fenrir', 'am_liam', 'am_michael',
          'am_onyx', 'am_puck', 'am_santa',
          'bf_alice', 'bf_emma', 'bf_isabella', 'bf_lily',
          'bm_daniel', 'bm_fable', 'bm_george', 'bm_lewis',
          'ef_dora', 'em_alex', 'em_santa',
          'ff_siwis',
          'hf_alpha', 'hf_beta', 'hm_omega', 'hm_psi',
          'if_sara', 'im_nicola',
          'jf_alpha', 'jf_gongitsune', 'jf_nezumi', 'jf_tebukuro', 'jm_kumo',
          'pf_dora', 'pm_alex', 'pm_santa',
          'zf_xiaobei', 'zf_xiaoni', 'zf_xiaoxiao', 'zf_xiaoyi',
          'zm_yunjian', 'zm_yunxi', 'zm_yunxia', 'zm_yunyang'
        ]
      },
      speed: { target: 'speed', default: 1, min: 0.1, max: 3 }
    }
  },
  
  'csm-1b': {
    type: 'subdomain',
    subdomain: 'chutes-csm-1b',
    endpoint: '/speak',
    timeout: 120000,
    params: {
      text: { required: true, target: 'text' },
      speaker: { target: 'speaker', default: 1, min: 0, max: 1 },
      maxDuration: { 
        target: 'max_duration_ms', 
        converter: 'secondsToMs',
        default: 10000 
      },
      maxDurationMs: { target: 'max_duration_ms', default: 10000 },
      context: { target: 'context', default: [] }
    }
  }
});

/**
 * Model aliases
 * @type {ModelAliases}
 */
export const AUDIO_MODEL_ALIASES = /** @type {const} */ ({
  'tts': 'kokoro',
  'csm': 'csm-1b'
});
