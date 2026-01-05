# chutes-js

A lightweight, functional JavaScript SDK for consuming [Chutes.ai](https://chutes.ai) APIs.

- **Zero dependencies** – Built on native `fetch` and `AsyncGenerator`
- **Streaming support** – First-class SSE parsing for chat/LLM responses
- **Universal** – Works in Node.js 18+, Cloudflare Workers, and browsers

## Installation

```bash
npm install chutes-js
```

## Quick Start

```javascript
import { createClient, saveBlob } from 'chutes-js';

const client = createClient({ apiKey: process.env.CHUTES_API_KEY });

// 1. Chat Completion (uses llm.chutes.ai)
const response = await client.chat({
  model: 'zai-org/GLM-4.7-TEE',
  messages: [{ role: 'user', content: 'Hello!' }]
});
console.log(response.choices[0].message.content);

// 2. Image Generation (uses image.chutes.ai)
const blob = await client.image({
  model: 'qwen-image',
  prompt: 'A beautiful sunset'
});

// 3. Video Generation (Hybrid: supports both Sync and Async)
const result = await client.video({
  model: 'wan-2-2-i2v-14b-fast',
  prompt: 'A cat playing piano',
  image: 'base64_data_here...'
});

// Check if we got a Blob (sync) or a Job ID (async)
if (result instanceof Blob) {
  await saveBlob(result, './video.mp4');
} else {
  // We got a Job ID, poll for status
  const status = await client.getJobStatus(result.job_id);
  console.log('Job Status:', status.state);
}
```

## API Reference

### `createClient(config)`

Creates a new Chutes client.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | *required* | Your Chutes API key |
| `timeout` | `number` | `60000` | Default timeout in ms (Note: Video/Audio have higher defaults) |

> [!TIP]
> You can access `client.endpoints` to see the base URLs being used by the client.

---

### LLM Methods (via `llm.chutes.ai`)

#### `client.chat(options)`

OpenAI-compatible chat completion.

```javascript
const response = await client.chat({
  model: 'zai-org/GLM-4.7-TEE',
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

#### `client.chatStream(options)`

Streaming chat completion. Returns an async generator.

```javascript
for await (const chunk of client.chatStream({ model, messages })) {
  console.log(chunk.choices[0]?.delta?.content);
}
```

### Image Methods (via `image.chutes.ai`)

#### `client.image(options)`

Generate an image.

```javascript
const blob = await client.image({
  model: 'qwen-image',
  prompt: 'A beautiful sunset over mountains'
});

// Save to file (Node.js)
import { saveBlob } from 'chutes-js';
await saveBlob(blob, './output.png');
```

> [!IMPORTANT]
> `saveBlob` is a Node.js utility. When using the SDK in browsers or Cloudflare Workers, handle the `Blob` response using native platform APIs.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `model` | `string` | *required* | Model ID (e.g., `qwen-image`) |
| `prompt` | `string` | *required* | Image generation prompt |
| `width` | `number` | `1024` | Image width |
| `height` | `number` | `1024` | Image height |
| `guidance_scale` | `number` | `7.5` | Guidance scale |
| `num_inference_steps` | `number` | `50` | Inference steps |

---

### Video Methods (via `chutes-{model}.chutes.ai`)

#### `client.video(options)`

Generate a video. I2V (Image-to-Video) models require a base64 image input.

```javascript
import { readFileSync } from 'fs';

// For I2V models, provide a base64 image
const imageBase64 = readFileSync('./input.png').toString('base64');

const result = await client.video({
  model: 'wan-2-2-i2v-14b-fast',
  prompt: 'A cat playing piano',
  image: imageBase64,
  resolution: '480p',
  fps: 16,
  frames: 81
});

if (result instanceof Blob) {
  // 1. Synchronous: Video returned directly
  await saveBlob(result, './output.mp4');
} else {
  // 2. Asynchronous: Job ID returned
  console.log('Job started:', result.job_id);
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `model` | `string` | *required* | Model slug (e.g., `wan-2-2-i2v-14b-fast`) |
| `prompt` | `string` | *required* | Video generation prompt |
| `image` | `string` | - | Base64 image (required for I2V models) |
| `resolution` | `string` | `'480p'` | Video resolution |
| `fps` | `number` | `16` | Frames per second |
| `frames` | `number` | `81` | Number of frames |
| `seed` | `number` | - | Random seed for reproducibility |
| `fast` | `boolean` | `true` | Use fast generation mode |
| `guidance_scale` | `number` | `1` | Guidance scale |
| `guidance_scale_2` | `number` | `1` | Secondary guidance scale |
| `negative_prompt` | `string` | - | Negative prompt |

> [!NOTE]
> Video generation has a default timeout of **5 minutes** (300,000ms).

> **Note**: All methods accept additional parameters via spread (`...extra`) for model-specific options.

---

### Audio Methods (via `chutes-{model}.chutes.ai/speak`)

#### `client.audio(options)`

Generate audio (Text-to-Speech). Supported parameters vary by model.

```javascript
// Example for CSM-1B model
const audio1 = await client.audio({
  model: 'csm-1b',
  text: 'Hello world!',
  speaker: 1,
  max_duration_ms: 10000
});

// Example for Kokoro model
const audio2 = await client.audio({
  model: 'kokoro',
  text: 'Hello world!',
  voice: 'af_heart',
  speed: 1.0
});

await saveBlob(audio2, './output.wav');
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `model` | `string` | *required* | Model slug (e.g., `kokoro`, `csm-1b`) |
| `text` | `string` | *required* | Text to speak |
| `speaker` | `number` | - | Speaker ID (CSM models) |
| `max_duration_ms` | `number` | - | Max duration in ms (CSM models) |
| `voice` | `string` | - | Voice ID (Kokoro models) |
| `speed` | `number` | `1.0` | Speaking speed (Kokoro models) |

> [!NOTE]
> Audio generation has a default timeout of **2 minutes** (120,000ms).

---

### Invoke Methods (subdomain-based chutes)

For models using subdomain URLs (`chutes-{model}.chutes.ai`) not covered by built-in methods.

> **Note**: Some image models use subdomain URLs instead of `image.chutes.ai`. Use `invoke()` for these.
>
> `invoke()` returns a `Blob` if the `Content-Type` is an image, `JSON` if it's `application/json`, or `string` otherwise.

#### `client.invoke(target, path, payload)`

```javascript
// Pattern: https://{name}-{username}.chutes.ai/{path}

// Example 1: Subdomain image model (Hunyuan)
const image = await client.invoke(
  { name: 'hunyuan-image-3', username: 'chutes' },
  '/generate',
  { prompt: 'A dog running on grass', size: '1024x1024' }
);

// Example 2: Subdomain image model (HiDream)
const image2 = await client.invoke(
  { name: 'hidream', username: 'chutes' },
  '/generate',
  { prompt: 'Cyberpunk city', resolution: '1024x1024', guidance_scale: 5 }
);

// Example 3: Text-to-Video (Wan 2.1)
const video = await client.invoke(
  { name: 'wan2-1-14b', username: 'chutes' },
  '/text2video',
  { prompt: 'Ocean waves crashing', fps: 24, frames: 81 }
);
```

#### `client.invokeStream(target, path, payload)`

For streaming responses from custom chutes. Returns an `AsyncGenerator`.

#### `parseSSE(stream)`

The internal SSE parser is exported for custom streaming implementations.

---

### Job Methods (via `api.chutes.ai`)

#### `client.getJobStatus(jobId)`

Check status of a long-running job.

```javascript
const status = await client.getJobStatus('job_abc123');
// { state: 'completed', result: {...} }
```

#### `client.deleteJob(jobId)`

Cancel/delete a job.

---

## Available Models

This SDK supports **all models** available on Chutes.ai. Below are some examples:

| Type | Example Model | Method | Notes |
|------|---------------|--------|-------|
| LLM | `zai-org/GLM-4.7-TEE` | `chat()` / `chatStream()` | OpenAI-compatible |
| Image | `qwen-image`, `FLUX.1-dev` | `image()` | Text-to-image |
| Image | `hunyuan-image-3`, `hidream` | `invoke()` | Subdomain models |
| Video | `wan-2-2-i2v-14b-fast` | `video()` | Image-to-video |
| Video | `wan2.1-14b` | `invoke()` | Text-to-video |
| Audio | `kokoro`, `csm-1b` | `audio()` | Text-to-speech |

> **Tip**: Use `image()`, `video()`, and `audio()` for common models. Use `invoke()` for any model with a subdomain URL pattern.

Browse all models at [chutes.ai/app](https://chutes.ai/app)


## Error Handling

```javascript
import { createClient, ChutesError } from 'chutes-js';

try {
  await client.chat({ ... });
} catch (e) {
  if (e instanceof ChutesError) {
    console.log('Status:', e.status);  // 429 = rate limited
    console.log('Body:', e.body);      // Raw error response
  }
}
```

## License

MIT
