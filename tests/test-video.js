/**
 * Video-only test file for chutes-js SDK
 * Uses test-output.png as input image for I2V model
 */

import 'dotenv/config';
import { createClient, saveBlob, ChutesError } from '../index.js';
import { readFileSync } from 'fs';

const API_KEY = process.env.CHUTES_API_KEY;

if (!API_KEY) {
    console.error('❌ Missing CHUTES_API_KEY in .env file');
    process.exit(1);
}

const client = createClient({ apiKey: API_KEY });

// Read the test image and convert to base64
const imageBuffer = readFileSync('./test-output.png');
const imageBase64 = imageBuffer.toString('base64');

console.log('🎬 Video Generation Test\n');
console.log('   Model: wan-2-2-i2v-14b-fast (I2V = Image-to-Video)');
console.log(`   Image size: ${(imageBuffer.length / 1024).toFixed(1)} KB`);

// Build the payload matching the user's example
const payload = {
    model: 'wan-2-2-i2v-14b-fast',
    prompt: 'an apple on a table',
    resolution: '480p',
    fps: 16,
    fast: true,
    seed: 42,
    frames: 81,
    guidance_scale: 1,
    guidance_scale_2: 1,  // From user's example
    negative_prompt: '色调艳丽，过曝，静态，细节模糊不清，字幕，风格，作品，画作，画面，静止，整体发灰，最差质量，低质量，JPEG压缩残留，丑陋的，残缺的，多余的手指，画得不好的手部，画得不好的脸部，畸形的，毁容的，形态畸形的肢体，手指融合，静止不动的画面，杂乱的背景，三条腿，背景人很多，倒着走',
    image: imageBase64
};

console.log('\n📤 Request payload:');
console.log(JSON.stringify({
    ...payload,
    image: `[base64 string, ${imageBase64.length} chars]`,
    negative_prompt: `[${payload.negative_prompt.length} chars]`
}, null, 2));

async function testVideo() {
    try {
        console.log('\n⏳ Sending request...');

        const result = await client.video(payload);

        if (result instanceof Blob) {
            await saveBlob(result, './test-video-output.mp4');
            console.log('✅ Video saved to test-video-output.mp4');
            console.log(`📦 Size: ${(result.size / 1024).toFixed(1)} KB`);
        } else {
            console.log('✅ Response:', JSON.stringify(result, null, 2));
        }
    } catch (e) {
        console.log(`\n❌ Failed: ${e.message}`);
        if (e instanceof ChutesError) {
            console.log(`📋 Status: ${e.status}`);
            console.log(`📋 Body: ${e.body}`);
        }
    }
}

testVideo();
