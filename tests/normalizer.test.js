/**
 * Unit tests for normalizer.js
 * Run: node tests/normalizer.test.js
 */

import { normalizeParams, buildUrl, resolveModelAlias } from '../src/normalizer.js';
import { IMAGE_MODELS, IMAGE_MODEL_ALIASES } from '../src/models/image.js';
import { VIDEO_MODELS, VIDEO_MODEL_ALIASES } from '../src/models/video.js';
import { AUDIO_MODELS, AUDIO_MODEL_ALIASES } from '../src/models/audio.js';
import { ValidationError } from '../src/errors.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
    return (async () => {
        try {
            await fn();
            console.log(`  ✅ ${name}`);
            passed++;
        } catch (e) {
            console.log(`  ❌ ${name}`);
            console.log(`     ${e.message}`);
            failed++;
        }
    })();
}

function assertEqual(actual, expected, msg = '') {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr !== expectedStr) {
        throw new Error(`${msg ? msg + ': ' : ''}Expected ${expectedStr}, got ${actualStr}`);
    }
}

function assertThrows(fn, expectedType, expectedMessage) {
    try {
        const result = fn();
        if (result && typeof result.then === 'function') {
            return result.then(
                () => { throw new Error(`Expected function to throw, but it didn't`); },
                (e) => {
                    if (expectedType && !(e instanceof expectedType)) {
                        throw new Error(`Expected ${expectedType.name}, got ${e.constructor.name}`);
                    }
                    if (expectedMessage && !e.message.includes(expectedMessage)) {
                        throw new Error(`Expected error containing "${expectedMessage}", got "${e.message}"`);
                    }
                }
            );
        }
        throw new Error(`Expected function to throw, but it didn't`);
    } catch (e) {
        if (expectedType && !(e instanceof expectedType)) {
            throw new Error(`Expected ${expectedType.name}, got ${e.constructor.name}`);
        }
        if (expectedMessage && !e.message.includes(expectedMessage)) {
            throw new Error(`Expected error containing "${expectedMessage}", got "${e.message}"`);
        }
    }
}

async function assertThrowsAsync(fn, expectedType, expectedMessage) {
    try {
        await fn();
        throw new Error(`Expected function to throw, but it didn't`);
    } catch (e) {
        if (e.message === `Expected function to throw, but it didn't`) {
            throw e;
        }
        if (expectedType && !(e instanceof expectedType)) {
            throw new Error(`Expected ${expectedType.name}, got ${e.constructor.name}`);
        }
        if (expectedMessage && !e.message.includes(expectedMessage)) {
            throw new Error(`Expected error containing "${expectedMessage}", got "${e.message}"`);
        }
    }
}

console.log('\n🧪 Normalizer Unit Tests\n');

// ============================================
// resolveModelAlias
// ============================================
console.log('resolveModelAlias:');

await test('resolves flux to FLUX.1-schnell', () => {
    assertEqual(resolveModelAlias('flux', IMAGE_MODEL_ALIASES), 'FLUX.1-schnell');
});

await test('resolves qwen to qwen-image', () => {
    assertEqual(resolveModelAlias('qwen', IMAGE_MODEL_ALIASES), 'qwen-image');
});

await test('passes through unknown model', () => {
    assertEqual(resolveModelAlias('unknown-model', IMAGE_MODEL_ALIASES), 'unknown-model');
});

await test('resolves wan to wan-2-2-i2v-14b-fast', () => {
    assertEqual(resolveModelAlias('wan', VIDEO_MODEL_ALIASES), 'wan-2-2-i2v-14b-fast');
});

await test('resolves tts to kokoro', () => {
    assertEqual(resolveModelAlias('tts', AUDIO_MODEL_ALIASES), 'kokoro');
});

// ============================================
// normalizeParams - basic functionality
// ============================================
console.log('\nnormalizeParams - basic:');

await test('normalizes basic image params', async () => {
    const { payload, resolvedModel, config } = await normalizeParams(
        'qwen-image',
        { prompt: 'a cat' },
        IMAGE_MODELS,
        IMAGE_MODEL_ALIASES
    );
    
    assertEqual(payload.prompt, 'a cat');
    assertEqual(resolvedModel, 'qwen-image');
    assertEqual(config.type, 'centralized');
});

await test('uses model alias', async () => {
    const { resolvedModel } = await normalizeParams(
        'flux',
        { prompt: 'a cat' },
        IMAGE_MODELS,
        IMAGE_MODEL_ALIASES
    );
    
    assertEqual(resolvedModel, 'FLUX.1-schnell');
});

await test('applies defaults', async () => {
    const { payload } = await normalizeParams(
        'qwen-image',
        { prompt: 'a cat' },
        IMAGE_MODELS,
        IMAGE_MODEL_ALIASES
    );
    
    assertEqual(payload.width, 1024);
    assertEqual(payload.height, 1024);
    assertEqual(payload.num_inference_steps, 50);
    assertEqual(payload.true_cfg_scale, 4);
});

await test('maps camelCase to snake_case', async () => {
    const { payload } = await normalizeParams(
        'qwen-image',
        { prompt: 'a cat', negativePrompt: 'blur', cfgScale: 5 },
        IMAGE_MODELS,
        IMAGE_MODEL_ALIASES
    );
    
    assertEqual(payload.negative_prompt, 'blur');
    assertEqual(payload.true_cfg_scale, 5);
});

// ============================================
// normalizeParams - aspectRatio conversion
// ============================================
console.log('\nnormalizeParams - aspectRatio:');

await test('converts aspectRatio to width/height', async () => {
    const { payload } = await normalizeParams(
        'qwen-image',
        { prompt: 'a cat', aspectRatio: '16:9' },
        IMAGE_MODELS,
        IMAGE_MODEL_ALIASES
    );
    
    assertEqual(payload.width, 1360);
    assertEqual(payload.height, 768);
});

await test('aspectRatio overrides defaults', async () => {
    const { payload } = await normalizeParams(
        'flux',
        { prompt: 'a cat', aspectRatio: '9:16' },
        IMAGE_MODELS,
        IMAGE_MODEL_ALIASES
    );
    
    assertEqual(payload.width, 768);
    assertEqual(payload.height, 1360);
});

await test('converts aspectRatio to resolution enum for hidream', async () => {
    const { payload } = await normalizeParams(
        'hidream',
        { prompt: 'a cat', aspectRatio: '16:9' },
        IMAGE_MODELS,
        IMAGE_MODEL_ALIASES
    );
    
    assertEqual(payload.resolution, '1360x768');
});

// ============================================
// normalizeParams - validation errors
// ============================================
console.log('\nnormalizeParams - validation:');

await test('throws on unknown model', async () => {
    await assertThrowsAsync(
        () => normalizeParams('unknown-model', { prompt: 'a cat' }, IMAGE_MODELS, IMAGE_MODEL_ALIASES),
        Error,
        'Unknown model'
    );
});

await test('throws on missing required param', async () => {
    await assertThrowsAsync(
        () => normalizeParams('qwen-image', {}, IMAGE_MODELS, IMAGE_MODEL_ALIASES),
        ValidationError,
        'Missing required parameter: "prompt"'
    );
});

await test('throws on unsupported param', async () => {
    await assertThrowsAsync(
        () => normalizeParams('qwen-image', { prompt: 'cat', unknownParam: 123 }, IMAGE_MODELS, IMAGE_MODEL_ALIASES),
        ValidationError,
        'is not supported by model'
    );
});

await test('throws on conflicting params', async () => {
    await assertThrowsAsync(
        () => normalizeParams('qwen-image', { prompt: 'cat', aspectRatio: '16:9', width: 512 }, IMAGE_MODELS, IMAGE_MODEL_ALIASES),
        ValidationError,
        'they conflict'
    );
});

await test('throws on value below min', async () => {
    await assertThrowsAsync(
        () => normalizeParams('qwen-image', { prompt: 'cat', steps: 1 }, IMAGE_MODELS, IMAGE_MODEL_ALIASES),
        ValidationError,
        'must be >='
    );
});

await test('throws on value above max', async () => {
    await assertThrowsAsync(
        () => normalizeParams('qwen-image', { prompt: 'cat', steps: 200 }, IMAGE_MODELS, IMAGE_MODEL_ALIASES),
        ValidationError,
        'must be <='
    );
});

await test('throws on invalid aspect ratio', async () => {
    await assertThrowsAsync(
        () => normalizeParams('qwen-image', { prompt: 'cat', aspectRatio: '5:4' }, IMAGE_MODELS, IMAGE_MODEL_ALIASES),
        ValidationError,
        'Unsupported aspect ratio'
    );
});

// ============================================
// normalizeParams - video
// ============================================
console.log('\nnormalizeParams - video:');

await test('normalizes video params with duration', async () => {
    const { payload } = await normalizeParams(
        'wan',
        { prompt: 'cat walking', image: 'base64data', duration: 5 },
        VIDEO_MODELS,
        VIDEO_MODEL_ALIASES
    );
    
    assertEqual(payload.frames, 80); // 5 * 16fps
    assertEqual(payload.prompt, 'cat walking');
});

await test('throws on duration and frames conflict', async () => {
    await assertThrowsAsync(
        () => normalizeParams('wan', { prompt: 'cat', image: 'data', duration: 5, frames: 100 }, VIDEO_MODELS, VIDEO_MODEL_ALIASES),
        ValidationError,
        'they conflict'
    );
});

// ============================================
// normalizeParams - audio
// ============================================
console.log('\nnormalizeParams - audio:');

await test('normalizes audio params', async () => {
    const { payload } = await normalizeParams(
        'kokoro',
        { text: 'Hello world', voice: 'af_bella' },
        AUDIO_MODELS,
        AUDIO_MODEL_ALIASES
    );
    
    assertEqual(payload.text, 'Hello world');
    assertEqual(payload.voice, 'af_bella');
});

await test('converts maxDuration to ms', async () => {
    const { payload } = await normalizeParams(
        'csm-1b',
        { text: 'Hello', maxDuration: 5 },
        AUDIO_MODELS,
        AUDIO_MODEL_ALIASES
    );
    
    assertEqual(payload.max_duration_ms, 5000);
});

// ============================================
// buildUrl
// ============================================
console.log('\nbuildUrl:');

await test('builds centralized URL', () => {
    const config = { type: 'centralized', endpoint: '/generate' };
    assertEqual(buildUrl(config), 'https://image.chutes.ai/generate');
});

await test('builds subdomain URL', () => {
    const config = { type: 'subdomain', subdomain: 'chutes-hidream', endpoint: '/generate' };
    assertEqual(buildUrl(config), 'https://chutes-hidream.chutes.ai/generate');
});

await test('uses custom base URL', () => {
    const config = { type: 'centralized', endpoint: '/generate' };
    assertEqual(buildUrl(config, 'https://custom.api.com'), 'https://custom.api.com/generate');
});

// ============================================
// SUMMARY
// ============================================
console.log('\n' + '═'.repeat(50));
console.log(`📊 Results: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(50) + '\n');

process.exit(failed > 0 ? 1 : 0);
