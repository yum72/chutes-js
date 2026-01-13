/**
 * @typedef {import('../normalizer.js').ModelConfig} ModelConfig
 * @typedef {import('../normalizer.js').ModelConfigs} ModelConfigs
 * @typedef {import('../normalizer.js').ModelAliases} ModelAliases
 */

/**
 * Image model configurations
 * Each model defines:
 * - type: 'centralized' (image.chutes.ai) or 'subdomain' (chutes-{name}.chutes.ai)
 * - subdomain: (if type='subdomain') the subdomain prefix
 * - endpoint: API path (usually '/generate')
 * - params: mapping of common params to model-specific params
 * @type {ModelConfigs}
 */
export const IMAGE_MODELS = /** @type {const} */ ({
  // ============================================
  // CENTRALIZED API MODELS (image.chutes.ai)
  // ============================================
  
  'qwen-image': {
    type: 'centralized',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      negativePrompt: { target: 'negative_prompt', default: '' },
      width: { target: 'width', default: 1024, min: 128, max: 2048 },
      height: { target: 'height', default: 1024, min: 128, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 50, min: 5, max: 100 },
      cfgScale: { target: 'true_cfg_scale', default: 4, min: 0, max: 10 },
      seed: { target: 'seed', default: null }
    }
  },
  
  'Qwen-Image-2512': {
    type: 'centralized',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      negativePrompt: { target: 'negative_prompt', default: '' },
      width: { target: 'width', default: 1024, min: 128, max: 2048 },
      height: { target: 'height', default: 1024, min: 128, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 50, min: 5, max: 100 },
      cfgScale: { target: 'guidance_scale', default: 7.5, min: 1, max: 20 },
      seed: { target: 'seed', default: null }
    }
  },
  
  'FLUX.1-schnell': {
    type: 'centralized',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      negativePrompt: { target: 'negative_prompt', default: '' },
      width: { target: 'width', default: 1024, min: 128, max: 2048 },
      height: { target: 'height', default: 1024, min: 128, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 50, min: 1, max: 100 },
      cfgScale: { target: 'guidance_scale', default: 7.5, min: 1, max: 20 },
      seed: { target: 'seed', default: null }
    }
  },
  
  'JuggernautXL': {
    type: 'centralized',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      negativePrompt: { target: 'negative_prompt', default: '' },
      width: { target: 'width', default: 1024, min: 128, max: 2048 },
      height: { target: 'height', default: 1024, min: 128, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 25, min: 1, max: 50 },
      cfgScale: { target: 'guidance_scale', default: 7.5, min: 1, max: 20 },
      seed: { target: 'seed', default: null }
    }
  },
  
  'JuggernautXL-Ragnarok': {
    type: 'centralized',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      negativePrompt: { target: 'negative_prompt', default: '' },
      width: { target: 'width', default: 1024, min: 128, max: 2048 },
      height: { target: 'height', default: 1024, min: 128, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 50, min: 1, max: 100 },
      cfgScale: { target: 'guidance_scale', default: 7.5, min: 1, max: 20 },
      seed: { target: 'seed', default: null }
    }
  },
  
  'iLustMix': {
    type: 'centralized',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      negativePrompt: { target: 'negative_prompt', default: '' },
      width: { target: 'width', default: 1024, min: 128, max: 2048 },
      height: { target: 'height', default: 1024, min: 128, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 25, min: 1, max: 50 },
      cfgScale: { target: 'guidance_scale', default: 7.5, min: 1, max: 20 },
      seed: { target: 'seed', default: null }
    }
  },
  
  'chroma': {
    type: 'centralized',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      width: { target: 'width', default: 1024, min: 200, max: 2048 },
      height: { target: 'height', default: 1024, min: 200, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'steps', default: 30, min: 5, max: 50 },
      cfgScale: { target: 'cfg', default: 4.5, min: 1, max: 7.5 },
      seed: { target: 'seed', default: 0 }
    }
  },
  
  'Illustrij': {
    type: 'centralized',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      negativePrompt: { target: 'negative_prompt', default: '' },
      width: { target: 'width', default: 1024, min: 128, max: 2048 },
      height: { target: 'height', default: 1024, min: 128, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 25, min: 1, max: 50 },
      cfgScale: { target: 'guidance_scale', default: 7.5, min: 1, max: 20 },
      seed: { target: 'seed', default: null }
    }
  },
  
  'Animij': {
    type: 'centralized',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      negativePrompt: { target: 'negative_prompt', default: '' },
      width: { target: 'width', default: 1024, min: 128, max: 2048 },
      height: { target: 'height', default: 1024, min: 128, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 25, min: 1, max: 50 },
      cfgScale: { target: 'guidance_scale', default: 7.5, min: 1, max: 20 },
      seed: { target: 'seed', default: null }
    }
  },
  
  'HassakuXL': {
    type: 'centralized',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      negativePrompt: { target: 'negative_prompt', default: '' },
      width: { target: 'width', default: 1024, min: 128, max: 2048 },
      height: { target: 'height', default: 1024, min: 128, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 25, min: 1, max: 50 },
      cfgScale: { target: 'guidance_scale', default: 7.5, min: 1, max: 20 },
      seed: { target: 'seed', default: null }
    }
  },
  
  'NovaFurryXL': {
    type: 'centralized',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      negativePrompt: { target: 'negative_prompt', default: '' },
      width: { target: 'width', default: 1024, min: 128, max: 2048 },
      height: { target: 'height', default: 1024, min: 128, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 50, min: 1, max: 100 },
      cfgScale: { target: 'guidance_scale', default: 7.5, min: 1, max: 20 },
      seed: { target: 'seed', default: null }
    }
  },
  
  'stabilityai/stable-diffusion-xl-base-1.0': {
    type: 'centralized',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      negativePrompt: { target: 'negative_prompt', default: '' },
      width: { target: 'width', default: 1024, min: 128, max: 2048 },
      height: { target: 'height', default: 1024, min: 128, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 50, min: 1, max: 100 },
      cfgScale: { target: 'guidance_scale', default: 7.5, min: 1, max: 20 },
      seed: { target: 'seed', default: null }
    }
  },
  
  'Lykon/dreamshaper-xl-1-0': {
    type: 'centralized',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      negativePrompt: { target: 'negative_prompt', default: '' },
      width: { target: 'width', default: 1024, min: 128, max: 2048 },
      height: { target: 'height', default: 1024, min: 128, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 50, min: 1, max: 100 },
      cfgScale: { target: 'guidance_scale', default: 7.5, min: 1, max: 20 },
      seed: { target: 'seed', default: null }
    }
  },
  
  'diagonalge/Booba': {
    type: 'centralized',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      negativePrompt: { target: 'negative_prompt', default: '' },
      width: { target: 'width', default: 1024, min: 128, max: 2048 },
      height: { target: 'height', default: 1024, min: 128, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 50, min: 1, max: 100 },
      cfgScale: { target: 'guidance_scale', default: 7.5, min: 1, max: 20 },
      seed: { target: 'seed', default: null }
    }
  },
  
  'diagonalge/ConstShaper': {
    type: 'centralized',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      negativePrompt: { target: 'negative_prompt', default: '' },
      width: { target: 'width', default: 1024, min: 128, max: 2048 },
      height: { target: 'height', default: 1024, min: 128, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 50, min: 1, max: 100 },
      cfgScale: { target: 'guidance_scale', default: 7.5, min: 1, max: 20 },
      seed: { target: 'seed', default: null }
    }
  },
  
  // ============================================
  // SUBDOMAIN API MODELS (chutes-{name}.chutes.ai)
  // ============================================
  
  'hidream': {
    type: 'subdomain',
    subdomain: 'chutes-hidream',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      aspectRatio: {
        target: 'resolution',
        converter: 'aspectToResolutionEnum',
        allowedValues: ['1024x1024', '768x1360', '1360x768', '880x1168', '1168x880', '1248x832', '832x1248'],
        default: '1024x1024'
      },
      resolution: { target: 'resolution', default: '1024x1024' },
      steps: { target: 'num_inference_steps', default: 50, min: 5, max: 75 },
      cfgScale: { target: 'guidance_scale', default: 5, min: 0, max: 10 },
      seed: { target: 'seed', default: null }
    }
  },
  
  'hunyuan-image-3': {
    type: 'subdomain',
    subdomain: 'chutes-hunyuan-image-3',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      aspectRatio: { target: 'size', converter: 'aspectToSizeString', default: 'auto' },
      size: { target: 'size', default: 'auto' },
      steps: { target: 'steps', default: 50, min: 10, max: 100 },
      seed: { target: 'seed', default: null }
    }
  },
  
  'z-image-turbo': {
    type: 'subdomain',
    subdomain: 'chutes-z-image-turbo',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt', minLength: 3, maxLength: 1200 },
      width: { target: 'width', default: 1024, min: 576, max: 2048 },
      height: { target: 'height', default: 1024, min: 576, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 9, min: 1, max: 100 },
      cfgScale: { target: 'guidance_scale', default: 0, min: 0, max: 5 },
      seed: { target: 'seed', default: null },
      shift: { target: 'shift', default: 3, min: 1, max: 10 },
      maxSequenceLength: { target: 'max_sequence_length', default: 512, min: 256, max: 2048 }
    }
  },
  
  // ============================================
  // IMAGE EDITING MODELS (require reference images)
  // ============================================
  
  'Qwen-Image-Edit-2511': {
    type: 'subdomain',
    subdomain: 'chutes-qwen-image-edit-2511',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      images: { 
        required: true, 
        target: 'image_b64s',
        converter: 'normalizeImages',
        minItems: 1,
        maxItems: 3
      },
      negativePrompt: { target: 'negative_prompt', default: '' },
      width: { target: 'width', default: 1024, min: 128, max: 2048 },
      height: { target: 'height', default: 1024, min: 128, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 40, min: 5, max: 100 },
      cfgScale: { target: 'true_cfg_scale', default: 4, min: 0, max: 10 },
      seed: { target: 'seed', default: null }
    }
  },
  
  'qwen-image-edit-2509': {
    type: 'subdomain',
    subdomain: 'chutes-qwen-image-edit-2509',
    endpoint: '/generate',
    params: {
      prompt: { required: true, target: 'prompt' },
      images: { 
        required: true, 
        target: 'image_b64s',
        converter: 'normalizeImages',
        minItems: 1,
        maxItems: 3
      },
      negativePrompt: { target: 'negative_prompt', default: '' },
      width: { target: 'width', default: 1024, min: 128, max: 2048 },
      height: { target: 'height', default: 1024, min: 128, max: 2048 },
      aspectRatio: { 
        target: ['width', 'height'],
        converter: 'aspectToWidthHeight',
        conflictsWith: ['width', 'height']
      },
      steps: { target: 'num_inference_steps', default: 40, min: 5, max: 100 },
      cfgScale: { target: 'true_cfg_scale', default: 4, min: 0, max: 10 },
      seed: { target: 'seed', default: null }
    }
  }
});

/**
 * Model aliases for convenience
 * @type {ModelAliases}
 */
export const IMAGE_MODEL_ALIASES = /** @type {const} */ ({
  'flux': 'FLUX.1-schnell',
  'flux-schnell': 'FLUX.1-schnell',
  'juggernaut': 'JuggernautXL',
  'juggernaut-ragnarok': 'JuggernautXL-Ragnarok',
  'hunyuan': 'hunyuan-image-3',
  'qwen': 'qwen-image',
  'qwen-2512': 'Qwen-Image-2512',
  'sdxl': 'stabilityai/stable-diffusion-xl-base-1.0',
  'dreamshaper': 'Lykon/dreamshaper-xl-1-0',
  'z-turbo': 'z-image-turbo',
  'qwen-edit': 'qwen-image-edit-2509',
  'qwen-edit-2511': 'Qwen-Image-Edit-2511'
});
