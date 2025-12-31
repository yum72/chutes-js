# chutes-js

A lightweight, functional JavaScript SDK for consuming [Chutes.ai](https://chutes.ai) APIs.

- **Zero dependencies** – Built on native `fetch` and `AsyncGenerator`
- **Streaming support** – First-class SSE parsing for chat/LLM responses
- **Universal** – Works in Node.js 18+, Cloudflare Workers, and browsers
- **TypeScript-ready** – Full JSDoc types for IntelliSense

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

// 2. Streaming Chat
const stream = client.chatStream({
  model: 'zai-org/GLM-4.7-TEE',
  messages: [{ role: 'user', content: 'Tell me a joke' }]
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}

// 3. Invoke a deployed chute (subdomain-based)
// Pattern: https://{chute}-{username}.chutes.ai/{path}
const result = await client.invoke(
  { name: 'Wan-2.2-I2V-14B-Fast', username: 'chutes' },
  '/run',
  { prompt: 'A cat playing piano', image_b64: '...' }
);
console.log('Job ID:', result.job_id);

// 4. Check job status
const status = await client.getJobStatus(result.job_id);
console.log('Status:', status.state);
```

## API Reference

### `createClient(config)`

Creates a new Chutes client.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | *required* | Your Chutes API key |
| `timeout` | `number` | `60000` | Request timeout in ms |

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

const blob = await client.video({
  model: 'wan-2-2-i2v-14b-fast',
  prompt: 'A cat playing piano',
  image: imageBase64,  // Required for I2V models
  resolution: '480p',
  fps: 16,
  frames: 81
});

await saveBlob(blob, './output.mp4');
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

---

### Invoke Methods (subdomain-based chutes)

For models using subdomain URLs (`chutes-{model}.chutes.ai`) not covered by built-in methods.

> **Note**: Some image models use subdomain URLs instead of `image.chutes.ai`. Use `invoke()` for these.

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

For streaming responses from custom chutes.

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
