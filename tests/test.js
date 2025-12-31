/**
 * Test file for chutes-js SDK
 * Tests: chat, streaming, invoke (subdomain chutes), jobs
 * 
 * Usage:
 *   1. Create .env file with CHUTES_API_KEY=your-key
 *   2. Run: node test.js
 */

import 'dotenv/config';
import { createClient, saveBlob, ChutesError } from '../index.js';

const API_KEY = process.env.CHUTES_API_KEY;

if (!API_KEY) {
    console.error('❌ Missing CHUTES_API_KEY in .env file');
    process.exit(1);
}

const client = createClient({ apiKey: API_KEY });

console.log('🚀 chutes-js SDK Test Suite\n');
console.log('Endpoints:', client.endpoints, '\n');

// ============================================
// TEST 1: Chat Completion (via llm.chutes.ai)
// ============================================
async function testChat() {
    console.log('💬 Test 1: Chat Completion');
    console.log('   Model: zai-org/GLM-4.7-TEE');

    try {
        const response = await client.chat({
            model: 'zai-org/GLM-4.7-TEE',
            messages: [{ role: 'user', content: 'Say hello in 5 words or less.' }]
        });

        const content = response.choices?.[0]?.message?.content;
        console.log(`   ✅ Response: ${content}`);
        console.log(`   📊 Tokens: ${response.usage?.total_tokens || 'N/A'}\n`);
        return true;
    } catch (e) {
        console.log(`   ❌ Failed: ${e.message}`);
        if (e instanceof ChutesError) {
            console.log(`   📋 Status: ${e.status}`);
        }
        console.log('');
        return false;
    }
}

// ============================================
// TEST 2: Chat Streaming
// ============================================
async function testChatStreaming() {
    console.log('🌊 Test 2: Chat Streaming');
    console.log('   Model: zai-org/GLM-4.7-TEE');

    try {
        const stream = client.chatStream({
            model: 'zai-org/GLM-4.7-TEE',
            messages: [{ role: 'user', content: 'Count from 1 to 5.' }]
        });

        process.stdout.write('   Response: ');
        let tokenCount = 0;

        for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content || '';
            process.stdout.write(content);
            tokenCount++;
        }

        console.log(`\n   ✅ Received ${tokenCount} chunks\n`);
        return true;
    } catch (e) {
        console.log(`\n   ❌ Failed: ${e.message}`);
        if (e instanceof ChutesError) {
            console.log(`   📋 Status: ${e.status}`);
        }
        console.log('');
        return false;
    }
}

// ============================================
// TEST 3: Image Generation (via image.chutes.ai)
// ============================================
async function testImage() {
    console.log('📸 Test 3: Image Generation');
    console.log('   Endpoint: image.chutes.ai/generate');
    console.log('   Model: qwen-image');

    try {
        const result = await client.image({
            model: 'qwen-image',
            prompt: 'A beautiful sunset over mountains'
        });

        if (result instanceof Blob) {
            await saveBlob(result, './test-output.png');
            console.log('   ✅ Image saved to test-output.png');
            console.log(`   📦 Size: ${(result.size / 1024).toFixed(1)} KB\n`);
        } else {
            console.log('   ✅ Response:', JSON.stringify(result).slice(0, 100));
            console.log('');
        }
        return true;
    } catch (e) {
        console.log(`   ❌ Failed: ${e.message}`);
        if (e instanceof ChutesError) {
            console.log(`   📋 Status: ${e.status}`);
        }
        console.log('');
        return false;
    }
}

// ============================================
// TEST 4: Video Generation (via chutes-{model}.chutes.ai)
// ============================================
async function testVideoJob() {
    console.log('🎬 Test 4: Video Generation');
    console.log('   Model: wan-2-2-i2v-14b-fast');

    // Check if input image exists (I2V models require an image)
    const fs = await import('fs');
    const imagePath = './test-output.png';

    if (!fs.existsSync(imagePath)) {
        console.log('   ⚠️ Skipped: I2V models require an input image');
        console.log('   💡 Run image test first, or provide test-output.png\n');
        return null; // Skip, not a failure
    }

    console.log('   This may take a few minutes...');

    try {
        const imageBase64 = fs.readFileSync(imagePath).toString('base64');

        const result = await client.video({
            model: 'wan-2-2-i2v-14b-fast',
            prompt: 'gentle camera motion, smooth animation',
            image: imageBase64,
            resolution: '480p',
            fps: 16,
            frames: 81,
            fast: true,
            seed: 42,
            guidance_scale: 1
        });

        if (result instanceof Blob) {
            await saveBlob(result, './test-video-output.mp4');
            console.log('   ✅ Video saved to test-video-output.mp4');
            console.log(`   📦 Size: ${(result.size / 1024).toFixed(1)} KB\n`);
        } else {
            console.log('   ✅ Response:', JSON.stringify(result).slice(0, 200));
            console.log('');
        }
        return true;
    } catch (e) {
        console.log(`   ❌ Failed: ${e.message}`);
        if (e instanceof ChutesError) {
            console.log(`   📋 Status: ${e.status}`);
            console.log(`   📋 Body: ${e.body?.slice(0, 200)}`);
        }
        console.log('');
        return false;
    }
}

// ============================================
// TEST 5: Error Handling
// ============================================
async function testErrorHandling() {
    console.log('🔴 Test 5: Error Handling');

    try {
        await client.chat({
            model: 'nonexistent-model-12345',
            messages: [{ role: 'user', content: 'test' }]
        });
        console.log('   ❌ Should have thrown an error\n');
        return false;
    } catch (e) {
        if (e instanceof ChutesError) {
            console.log(`   ✅ Caught ChutesError: status=${e.status}`);
            console.log(`   📋 Error properly typed\n`);
            return true;
        }
        console.log(`   ⚠️ Caught generic error: ${e.message}\n`);
        return true;
    }
}

// ============================================
// RUN ALL TESTS
// ============================================
async function runTests() {
    const results = {
        chat: await testChat(),
        streaming: await testChatStreaming(),
        image: await testImage(),
        video: await testVideoJob(),
        error: await testErrorHandling()
    };

    console.log('═'.repeat(50));
    console.log('📊 Results:');
    console.log(`   Chat:           ${results.chat ? '✅' : '❌'}`);
    console.log(`   Streaming:      ${results.streaming ? '✅' : '❌'}`);
    console.log(`   Image:          ${results.image ? '✅' : '❌'}`);
    console.log(`   Video Job:      ${results.video ? '✅' : '❌'}`);
    console.log(`   Error Handling: ${results.error ? '✅' : '❌'}`);
    console.log('═'.repeat(50));
}

runTests();
