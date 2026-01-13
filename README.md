# chutes-js

A lightweight, functional JavaScript SDK for consuming [Chutes.ai](https://chutes.ai) APIs.

- **Zero dependencies** – Built on native `fetch` and `AsyncGenerator`
- **Streaming support** – First-class SSE parsing for chat/LLM responses
- **Universal** – Works in Node.js 18+, Cloudflare Workers, and browsers
- **Unified API** – Normalized parameters across all models with auto-translation

## Installation

```bash
npm install chutes-js
```

## Quick Start

```javascript
import { createClient, saveBlob } from 'chutes-js';

const client = createClient({ apiKey: process.env.CHUTES_API_KEY });

// 1. Chat Completion (OpenAI-compatible)
const response = await client.chat({
  model: 'deepseek-ai/DeepSeek-V3-0324',
  messages: [{ role: 'user', content: 'Hello!' }]
});
console.log(response.choices[0].message.content);

// 2. Image Generation (unified params)
const image = await client.image({
  model: 'flux',                // alias for FLUX.1-schnell
  prompt: 'A beautiful sunset over mountains',
  aspectRatio: '16:9',          // auto-converted to width/height
  steps: 25,
  cfgScale: 7
});
await saveBlob(image, './sunset.png');

// 3. Video Generation (I2V with URL auto-fetch)
const video = await client.video({
  model: 'wan',                              // alias for wan-2-2-i2v-14b-fast
  prompt: 'A cat playing piano smoothly',
  image: 'https://example.com/cat.jpg',      // URL auto-fetched to base64
  duration: 5,                               // seconds → frames via fps
  aspectRatio: '16:9'
});
await saveBlob(video, './cat-piano.mp4');

// 4. Audio Generation (Text-to-Speech)
const audio = await client.audio({
  model: 'tts',                 // alias for kokoro
  text: 'Hello, welcome to Chutes!',
  voice: 'af_heart',
  speed: 1.0
});
await saveBlob(audio, './welcome.wav');
```

## API Reference

### `createClient(config)`

Creates a new Chutes client.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | *required* | Your Chutes API key |
| `timeout` | `number` | `60000` | Default timeout in ms (Video: 5min, Audio: 2min) |

> [!TIP]
> You can access `client.endpoints` to see the base URLs being used by the client.

---

### LLM Methods (via `llm.chutes.ai`)

#### `client.chat(options)`

OpenAI-compatible chat completion.

```javascript
const response = await client.chat({
  model: 'deepseek-ai/DeepSeek-V3-0324',
  messages: [{ role: 'user', content: 'Explain quantum computing' }]
});
```

#### `client.chatStream(options)`

Streaming chat completion. Returns an async generator.

```javascript
for await (const chunk of client.chatStream({ model, messages })) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```

---

### Image Methods

The SDK provides a **unified API** for image generation. Parameters are automatically translated to each model's native format.

#### `client.image(options)`

Generate an image using unified parameters.

```javascript
import { saveBlob } from 'chutes-js';

// Basic usage
const blob = await client.image({
  model: 'flux',
  prompt: 'A cyberpunk city at night'
});
await saveBlob(blob, './cyberpunk.png');

// With all options
const blob2 = await client.image({
  model: 'qwen-image',
  prompt: 'A serene Japanese garden',
  aspectRatio: '16:9',        // or use width/height directly
  steps: 50,
  cfgScale: 7.5,
  negativePrompt: 'blurry, low quality',
  seed: 42
});

// Image editing (requires reference images)
const edited = await client.image({
  model: 'qwen-edit',
  prompt: 'Add a rainbow to the sky',
  images: ['https://example.com/photo.jpg'],  // URLs auto-fetched
  aspectRatio: '1:1'
});
```

> [!IMPORTANT]
> `saveBlob` is a Node.js utility. In browsers or Cloudflare Workers, handle the `Blob` using platform APIs.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `model` | `string` | **Required.** Model ID or alias (e.g., `'flux'`, `'qwen-image'`, `'hidream'`) |
| `prompt` | `string` | **Required.** Image generation prompt |
| `aspectRatio` | `string` | Aspect ratio (e.g., `'16:9'`, `'1:1'`, `'9:16'`). Auto-converts to width/height. Conflicts with `width`/`height`. |
| `width` | `number` | Image width in pixels (default: 1024) |
| `height` | `number` | Image height in pixels (default: 1024) |
| `steps` | `number` | Number of inference steps (default varies by model: 25-50) |
| `cfgScale` | `number` | Guidance scale (default varies by model: 4-7.5) |
| `negativePrompt` | `string` | Negative prompt for content to avoid |
| `seed` | `number\|null` | Random seed for reproducibility |
| `images` | `string\|string[]` | Reference images for editing models (base64 or URL). URLs are auto-fetched. |

#### Alternative: Using `invoke()` for Raw API Access

For direct API access without parameter normalization:

```javascript
// Subdomain model (HiDream)
const image = await client.invoke(
  { name: 'hidream', username: 'chutes' },
  '/generate',
  { prompt: 'Cyberpunk city', resolution: '1024x1024', guidance_scale: 5 }
);

// Centralized model (requires model in payload)
const image2 = await client.invoke(
  'image.chutes.ai',
  '/generate',
  { model: 'qwen-image', prompt: 'A sunset', width: 1024, height: 1024 }
);
```

<details>
<summary><strong>Supported Image Models (18 models)</strong></summary>

#### Centralized API Models (`image.chutes.ai`)

| Model | Aliases | Notes |
|-------|---------|-------|
| `qwen-image` | `qwen` | Qwen image generation |
| `Qwen-Image-2512` | `qwen-2512` | Qwen 2512 variant |
| `FLUX.1-schnell` | `flux`, `flux-schnell` | Fast FLUX model |
| `JuggernautXL` | `juggernaut` | Juggernaut XL |
| `JuggernautXL-Ragnarok` | `juggernaut-ragnarok` | Ragnarok variant |
| `iLustMix` | - | Illustration style |
| `chroma` | - | Chroma model |
| `Illustrij` | - | Illustration focused |
| `Animij` | - | Anime style |
| `HassakuXL` | - | Hassaku XL |
| `NovaFurryXL` | - | Furry art style |
| `stabilityai/stable-diffusion-xl-base-1.0` | `sdxl` | Stable Diffusion XL |
| `Lykon/dreamshaper-xl-1-0` | `dreamshaper` | DreamShaper XL |
| `diagonalge/Booba` | - | Community model |
| `diagonalge/ConstShaper` | - | Community model |

#### Subdomain API Models

| Model | Aliases | Notes |
|-------|---------|-------|
| `hidream` | - | HiDream (uses resolution enum) |
| `hunyuan-image-3` | `hunyuan` | Hunyuan Image 3 (uses size string) |
| `z-image-turbo` | `z-turbo` | Z-Image Turbo (fast generation) |

#### Image Editing Models (require `images` parameter)

| Model | Aliases | Notes |
|-------|---------|-------|
| `Qwen-Image-Edit-2511` | `qwen-edit-2511` | Qwen image editing (latest) |
| `qwen-image-edit-2509` | `qwen-edit` | Qwen image editing |

</details>

---

### Video Methods

Generate videos with unified parameters. The SDK handles image URL fetching and frame calculation automatically.

#### `client.video(options)`

Generate a video using unified parameters.

```javascript
import { readFileSync } from 'fs';
import { saveBlob } from 'chutes-js';

// Using image URL (auto-fetched to base64)
const video = await client.video({
  model: 'wan',                              // alias for wan-2-2-i2v-14b-fast
  prompt: 'A cat playing piano elegantly',
  image: 'https://example.com/cat.jpg',      // URL auto-fetched
  duration: 5,                               // 5 seconds
  aspectRatio: '16:9'
});
await saveBlob(video, './output.mp4');

// Using local file (base64)
const imageBase64 = readFileSync('./input.png').toString('base64');
const video2 = await client.video({
  model: 'i2v',
  prompt: 'Ocean waves crashing on rocks',
  image: imageBase64,
  frames: 81,                   // or use duration in seconds
  fps: 16,
  cfgScale: 1,
  cfgScale2: 1,
  negativePrompt: 'blurry, static',
  seed: 12345
});

// Check for async job (some models return job ID)
if (video2 instanceof Blob) {
  await saveBlob(video2, './ocean.mp4');
} else {
  console.log('Job started:', video2.job_id);
  // Poll with client.getJobStatus(video2.job_id)
}
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `model` | `string` | **Required.** Model ID or alias (e.g., `'wan'`, `'i2v'`) |
| `prompt` | `string` | **Required.** Video generation prompt |
| `image` | `string` | **Required.** Reference image (base64 or URL). URLs are auto-fetched. |
| `aspectRatio` | `string` | Aspect ratio, converts to resolution (e.g., `'16:9'` → `'480p'`) |
| `resolution` | `string` | Video resolution (`'480p'`, `'720p'`) |
| `duration` | `number` | Duration in seconds. Converted to frames via fps. Conflicts with `frames`. |
| `frames` | `number` | Number of frames (default: 81, range: 21-140) |
| `fps` | `number` | Frames per second (default: 16, range: 16-24) |
| `cfgScale` | `number` | Primary guidance scale (default: 1) |
| `cfgScale2` | `number` | Secondary guidance scale (default: 1) |
| `negativePrompt` | `string` | Negative prompt (has sensible default) |
| `seed` | `number\|null` | Random seed for reproducibility |
| `fast` | `boolean` | Use fast generation mode (default: true) |

> [!NOTE]
> Video generation has a default timeout of **5 minutes** (300,000ms).

#### Alternative: Using `invoke()` for Raw API Access

```javascript
const video = await client.invoke(
  { name: 'wan-2-2-i2v-14b-fast', username: 'chutes' },
  '/generate',
  {
    prompt: 'A dog running',
    image: imageBase64,
    resolution: '480p',
    fps: 16,
    frames: 81,
    guidance_scale: 1,
    guidance_scale_2: 1
  }
);
```

<details>
<summary><strong>Supported Video Models (1 model)</strong></summary>

| Model | Aliases | Type | Notes |
|-------|---------|------|-------|
| `wan-2-2-i2v-14b-fast` | `wan`, `i2v`, `wan-i2v` | Image-to-Video | Requires reference image |

</details>

---

### Audio Methods

Generate audio (Text-to-Speech) with unified parameters.

#### `client.audio(options)`

Generate audio using unified parameters.

```javascript
import { saveBlob } from 'chutes-js';

// Kokoro TTS (50+ voices)
const audio = await client.audio({
  model: 'tts',                 // alias for kokoro
  text: 'Hello, welcome to Chutes AI!',
  voice: 'af_heart',            // American female
  speed: 1.0
});
await saveBlob(audio, './welcome.wav');

// CSM-1B (conversational)
const audio2 = await client.audio({
  model: 'csm',
  text: 'This is a test of the CSM model.',
  speaker: 0,
  maxDuration: 15              // 15 seconds (auto-converted to ms)
});
await saveBlob(audio2, './csm-test.wav');
```

#### Parameters

**Common:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `model` | `string` | **Required.** Model ID or alias (e.g., `'tts'`, `'kokoro'`, `'csm'`) |
| `text` | `string` | **Required.** Text to speak |

**Kokoro-specific:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `voice` | `string` | Voice ID (default: `'af_heart'`). See voice list below. |
| `speed` | `number` | Playback speed (default: 1.0, range: 0.1-3.0) |

**CSM-specific:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `speaker` | `number` | Speaker ID (0 or 1) |
| `maxDuration` | `number` | Max duration in **seconds** (auto-converted to ms) |
| `maxDurationMs` | `number` | Max duration in milliseconds directly |
| `context` | `array` | Conversation context for multi-turn |

> [!NOTE]
> Audio generation has a default timeout of **2 minutes** (120,000ms).

#### Alternative: Using `invoke()` for Raw API Access

```javascript
// Kokoro via invoke
const audio = await client.invoke(
  { name: 'kokoro', username: 'chutes' },
  '/speak',
  { text: 'Hello world', voice: 'af_heart', speed: 1.0 }
);

// CSM via invoke
const audio2 = await client.invoke(
  { name: 'csm-1b', username: 'chutes' },
  '/speak',
  { text: 'Hello', speaker: 0, max_duration_ms: 10000 }
);
```

<details>
<summary><strong>Supported Audio Models (2 models)</strong></summary>

| Model | Aliases | Notes |
|-------|---------|-------|
| `kokoro` | `tts` | 50+ voices, fast TTS |
| `csm-1b` | `csm` | Conversational speech model |

</details>

<details>
<summary><strong>Kokoro Voice List (50+ voices)</strong></summary>

**American English - Female (`af_*`)**
- `af_heart` (default), `af_alloy`, `af_aoede`, `af_bella`, `af_jessica`, `af_kore`, `af_nicole`, `af_nova`, `af_river`, `af_sarah`, `af_sky`

**American English - Male (`am_*`)**
- `am_adam`, `am_echo`, `am_eric`, `am_fenrir`, `am_liam`, `am_michael`, `am_onyx`, `am_puck`, `am_santa`

**British English - Female (`bf_*`)**
- `bf_alice`, `bf_emma`, `bf_isabella`, `bf_lily`

**British English - Male (`bm_*`)**
- `bm_daniel`, `bm_fable`, `bm_george`, `bm_lewis`

**Spanish (`ef_*`, `em_*`)**
- `ef_dora`, `em_alex`, `em_santa`

**French (`ff_*`)**
- `ff_siwis`

**Hindi (`hf_*`, `hm_*`)**
- `hf_alpha`, `hf_beta`, `hm_omega`, `hm_psi`

**Italian (`if_*`, `im_*`)**
- `if_sara`, `im_nicola`

**Japanese (`jf_*`, `jm_*`)**
- `jf_alpha`, `jf_gongitsune`, `jf_nezumi`, `jf_tebukuro`, `jm_kumo`

**Portuguese (`pf_*`, `pm_*`)**
- `pf_dora`, `pm_alex`, `pm_santa`

**Chinese (`zf_*`, `zm_*`)**
- `zf_xiaobei`, `zf_xiaoni`, `zf_xiaoxiao`, `zf_xiaoyi`, `zm_yunjian`, `zm_yunxi`, `zm_yunxia`, `zm_yunyang`

</details>

---

### Invoke Methods (Advanced)

For models not covered by built-in methods, or when you need raw API access.

#### `client.invoke(target, path, payload)`

```javascript
// Pattern: https://{name}-{username}.chutes.ai/{path}

// Subdomain model
const result = await client.invoke(
  { name: 'custom-model', username: 'myuser' },
  '/generate',
  { prompt: 'Hello', ...otherParams }
);

// Direct URL
const result2 = await client.invoke(
  'https://custom-endpoint.chutes.ai',
  '/api/v1/generate',
  { prompt: 'Hello' }
);
```

Returns: `Blob` (if image/video/audio), `Object` (if JSON), or `string` otherwise.

#### `client.invokeStream(target, path, payload)`

For streaming responses. Returns an `AsyncGenerator`.

#### `parseSSE(stream)`

The internal SSE parser is exported for custom streaming implementations.

---

### Job Methods (via `api.chutes.ai`)

For long-running async jobs.

#### `client.getJobStatus(jobId)`

```javascript
const status = await client.getJobStatus('job_abc123');
// { state: 'completed', result: {...} }
```

#### `client.deleteJob(jobId)`

Cancel or delete a job.

---

## Error Handling

```javascript
import { createClient, ChutesError, ValidationError } from 'chutes-js';

try {
  await client.image({
    model: 'flux',
    prompt: 'A sunset',
    steps: 500  // exceeds max
  });
} catch (e) {
  if (e instanceof ValidationError) {
    // Parameter validation failed
    console.log('Validation error:', e.message);
    // e.g., "steps exceeds maximum value of 100"
  } else if (e instanceof ChutesError) {
    // API error
    console.log('Status:', e.status);  // 429 = rate limited
    console.log('Body:', e.body);      // Raw error response
  }
}
```

| Error Class | When |
|-------------|------|
| `ValidationError` | Invalid parameters (missing required, out of range, conflicts) |
| `ChutesError` | API returned an error (auth, rate limit, server error) |

---

## Exports

```javascript
import {
  // Client
  createClient,
  
  // Errors
  ChutesError,
  ValidationError,
  
  // Utilities
  parseSSE,
  saveBlob,
  
  // Model configs (advanced)
  IMAGE_MODELS,
  IMAGE_MODEL_ALIASES,
  VIDEO_MODELS,
  VIDEO_MODEL_ALIASES,
  AUDIO_MODELS,
  AUDIO_MODEL_ALIASES,
  ALL_MODELS,
  ALL_ALIASES
} from 'chutes-js';
```

---

## License

MIT
