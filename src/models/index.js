export { IMAGE_MODELS, IMAGE_MODEL_ALIASES } from './image.js';
export { VIDEO_MODELS, VIDEO_MODEL_ALIASES } from './video.js';
export { AUDIO_MODELS, AUDIO_MODEL_ALIASES } from './audio.js';

import { IMAGE_MODELS, IMAGE_MODEL_ALIASES } from './image.js';
import { VIDEO_MODELS, VIDEO_MODEL_ALIASES } from './video.js';
import { AUDIO_MODELS, AUDIO_MODEL_ALIASES } from './audio.js';

// Combined lookup
export const ALL_MODELS = {
  image: IMAGE_MODELS,
  video: VIDEO_MODELS,
  audio: AUDIO_MODELS
};

export const ALL_ALIASES = {
  image: IMAGE_MODEL_ALIASES,
  video: VIDEO_MODEL_ALIASES,
  audio: AUDIO_MODEL_ALIASES
};
