# chutes-js - Implementation Plan

A lightweight, functional JavaScript SDK for consuming Chutes.ai APIs (Image, Video, Chat) in Node.js, Cloudflare Workers, and browsers.

---

## Research Findings

> [!IMPORTANT]
> **Key discoveries from Chutes.ai documentation:**

| Finding | Details |
|---------|---------|
| **Official SDK exists** | `@chutes-ai/ai-sdk-provider` for Vercel AI SDK—our SDK targets **vanilla JS** users |
| **Two URL patterns** | Platform API: `https://api.chutes.ai/*`<br>Cord endpoints: `https://{chute}-{username}.chutes.ai/{path}` |
| **Job API** | `POST /jobs/{chute_id}/{method}` (Create), `GET /jobs/{job_id}` (Status), `DELETE /jobs/{job_id}` (Cancel) |
| **Auth methods** | `Authorization: Bearer {token}` or `X-API-Key: {key}` |

---

## Proposed Changes

### SDK Core

#### [NEW] package.json
```json
{
  "name": "chutes-js",
  "version": "1.0.0",
  "description": "A lightweight, functional Node.js client for consuming Chutes.ai models.",
  "type": "module",
  "main": "./index.js",
  "exports": { ".": "./index.js" },
  "engines": { "node": ">=18" },
  "files": ["src", "index.js", "README.md"],
  "keywords": ["chutes", "ai", "sdk", "inference", "llm", "image-generation"]
}
```

#### [NEW] jsconfig.json
```json
{
  "compilerOptions": {
    "checkJs": true,
    "strict": true,
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node"
  },
  "include": ["src/**/*.js", "index.js"]
}
```

---

### Source Files

#### [NEW] src/errors.js
Custom error class for better handling downstream.

```javascript
export class ChutesError extends Error {
  constructor(status, message, body) {
    super(`Chutes API Error (${status}): ${message}`);
    this.name = 'ChutesError';
    this.status = status;
    this.body = body;
  }
}
```

#### [NEW] src/utils.js
URL construction and error handling.

- `constructCordUrl(name, username, path)` → `https://{chute}-{username}.chutes.ai/{path}`
- `constructApiUrl(path)` → `https://api.chutes.ai/{path}`
- `handleErrors(response)` → throws `ChutesError`

#### [NEW] src/stream.js
SSE parser with multi-line data support.

- Handles concatenated `data:` lines
- Properly releases reader lock
- Ignores `event:`, `id:`, `retry:` fields

#### [NEW] src/client.js
Main factory with methods:

- `invoke(target, path, payload)` → sync calls (image/video)
- `invokeStream(target, path, payload)` → async generator for chat
- `getJobStatus(jobId)` → check async job status
- `deleteJob(jobId)` → cancel job

Config options:
- `apiKey` (required) - Your Chutes API key
- `timeout` (optional, default: `60000`) - Request timeout in ms, configurable per-client
- `authStyle` (optional, default: `'bearer'`) - `'bearer'` or `'x-api-key'`

#### [NEW] index.js
```javascript
export { createClient } from './src/client.js';
export { ChutesError } from './src/errors.js';
export { parseSSE } from './src/stream.js';
```

---

## Directory Structure

```
/chutes-js-sdk
  ├── package.json
  ├── jsconfig.json
  ├── index.js
  ├── README.md
  └── src/
      ├── client.js
      ├── stream.js
      ├── utils.js
      └── errors.js
```

---

## Implementation Order

1. **Phase 1: Core**
   - [ ] `src/errors.js`
   - [ ] `src/utils.js`
   - [ ] `src/stream.js`

2. **Phase 2: Client**
   - [ ] `src/client.js`
   - [ ] `index.js`

3. **Phase 3: Config & Docs**
   - [ ] `package.json`
   - [ ] `jsconfig.json`
   - [ ] `README.md`

4. **Phase 4: Verification**
   - [ ] Unit tests
   - [ ] Integration tests with live API
