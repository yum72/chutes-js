/**
 * Integration test for chutes-js SDK
 * Tests chat, streaming, image, audio, video, and validation
 * 
 * Run: node tests/test-unified-api.js
 */

import 'dotenv/config';
import { createClient, saveBlob, ChutesError, ValidationError } from '../index.js';
import { readFileSync, existsSync } from 'fs';

const API_KEY = process.env.CHUTES_API_KEY;

if (!API_KEY) {
    console.error('Missing CHUTES_API_KEY in .env file');
    process.exit(1);
}

const client = createClient({ apiKey: API_KEY });

console.log('\n🧪 chutes-js SDK Integration Tests\n');
console.log('Endpoints:', client.endpoints, '\n');

// ============================================
// CHAT TESTS
// ============================================

async function testChat() {
    console.log('💬 Test: Chat Completion');
    console.log('   Model: deepseek-ai/DeepSeek-V3-0324');

    try {
        const response = await client.chat({
            model: 'deepseek-ai/DeepSeek-V3-0324',
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

async function testChatStreaming() {
    console.log('🌊 Test: Chat Streaming');
    console.log('   Model: deepseek-ai/DeepSeek-V3-0324');

    try {
        const stream = client.chatStream({
            model: 'deepseek-ai/DeepSeek-V3-0324',
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
// IMAGE TESTS
// ============================================

async function testImageWithAspectRatio() {
    console.log('📸 Test: Image with aspectRatio (centralized)');
    console.log('   Model: qwen-image, aspectRatio="16:9"');

    try {
        const result = await client.image({
            model: 'qwen-image',
            prompt: 'A serene mountain landscape at sunset',
            aspectRatio: '16:9',
            steps: 30,
            cfgScale: 4
        });

        if (result instanceof Blob) {
            await saveBlob(result, './test-unified-16x9.png');
            console.log(`   ✅ Success! Saved to test-unified-16x9.png (${(result.size / 1024).toFixed(1)} KB)\n`);
            return true;
        } else {
            console.log('   ✅ Response:', JSON.stringify(result).slice(0, 100), '\n');
            return true;
        }
    } catch (e) {
        console.log(`   ❌ Failed: ${e.message}\n`);
        return false;
    }
}

async function testImageWithAlias() {
    console.log('📸 Test: Image with alias (flux → FLUX.1-schnell)');
    console.log('   Model: flux, aspectRatio="1:1"');

    try {
        const result = await client.image({
            model: 'flux',  // alias for FLUX.1-schnell
            prompt: 'A cute robot playing chess',
            aspectRatio: '1:1',
            steps: 25
        });

        if (result instanceof Blob) {
            await saveBlob(result, './test-unified-flux.png');
            console.log(`   ✅ Success! Saved to test-unified-flux.png (${(result.size / 1024).toFixed(1)} KB)\n`);
            return true;
        } else {
            console.log('   ✅ Response:', JSON.stringify(result).slice(0, 100), '\n');
            return true;
        }
    } catch (e) {
        console.log(`   ❌ Failed: ${e.message}\n`);
        return false;
    }
}

async function testSubdomainImage() {
    console.log('📸 Test: Image with subdomain model (hidream)');
    console.log('   Using: aspectRatio="9:16" → resolution="768x1360"');

    try {
        const result = await client.image({
            model: 'hidream',
            prompt: 'A magical forest with glowing mushrooms',
            aspectRatio: '9:16',
            steps: 40,
            cfgScale: 5
        });

        if (result instanceof Blob) {
            await saveBlob(result, './test-unified-hidream.png');
            console.log(`   ✅ Success! Saved to test-unified-hidream.png (${(result.size / 1024).toFixed(1)} KB)\n`);
            return true;
        } else {
            console.log('   ✅ Response:', JSON.stringify(result).slice(0, 100), '\n');
            return true;
        }
    } catch (e) {
        console.log(`   ❌ Failed: ${e.message}\n`);
        return false;
    }
}

// ============================================
// AUDIO TESTS
// ============================================

async function testAudioTTS() {
    console.log('🔊 Test: Audio TTS (kokoro)');
    console.log('   Using: voice="af_bella", speed=1.1');

    try {
        const result = await client.audio({
            model: 'kokoro',
            text: 'Hello! This is a test of the unified API for audio generation.',
            voice: 'af_bella',
            speed: 1.1
        });

        if (result instanceof Blob) {
            await saveBlob(result, './test-unified-audio.wav');
            console.log(`   ✅ Success! Saved to test-unified-audio.wav (${(result.size / 1024).toFixed(1)} KB)\n`);
            return true;
        } else {
            console.log('   ✅ Response:', JSON.stringify(result).slice(0, 100), '\n');
            return true;
        }
    } catch (e) {
        console.log(`   ❌ Failed: ${e.message}\n`);
        return false;
    }
}

async function testAudioAlias() {
    console.log('🔊 Test: Audio with alias (tts → kokoro)');
    console.log('   Using: model="tts", voice="am_adam"');

    try {
        const result = await client.audio({
            model: 'tts',  // alias for kokoro
            text: 'Testing the TTS alias feature.',
            voice: 'am_adam'
        });

        if (result instanceof Blob) {
            await saveBlob(result, './test-unified-tts-alias.wav');
            console.log(`   ✅ Success! Saved to test-unified-tts-alias.wav (${(result.size / 1024).toFixed(1)} KB)\n`);
            return true;
        } else {
            console.log('   ✅ Response:', JSON.stringify(result).slice(0, 100), '\n');
            return true;
        }
    } catch (e) {
        console.log(`   ❌ Failed: ${e.message}\n`);
        return false;
    }
}

// ============================================
// VIDEO TESTS
// ============================================

async function testVideo() {
    console.log('🎬 Test: Video Generation (I2V)');
    
    // Check if we have an input image from previous test
    const imagePath = './test-unified-16x9.png';
    if (!existsSync(imagePath)) {
        console.log('   ⏭️  Skipped: No input image available');
        console.log('   💡 Run image tests first to generate input\n');
        return null; // Skip, not a failure
    }

    console.log('   Model: wan (alias for wan-2-2-i2v-14b-fast)');
    console.log('   Using: duration=3, cfgScale=1');

    try {
        const imageBase64 = readFileSync(imagePath).toString('base64');
        
        const result = await client.video({
            model: 'wan',
            prompt: 'gentle camera motion, smooth animation',
            image: imageBase64,
            duration: 3,          // 3 seconds
            cfgScale: 1,
            seed: 42
        });

        if (result instanceof Blob) {
            await saveBlob(result, './test-unified-video.mp4');
            console.log(`   ✅ Success! Saved to test-unified-video.mp4 (${(result.size / 1024).toFixed(1)} KB)\n`);
            return true;
        } else {
            console.log('   ✅ Job started:', result.job_id || JSON.stringify(result).slice(0, 100), '\n');
            return true;
        }
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
// VALIDATION TESTS
// ============================================

async function testValidationError() {
    console.log('🔴 Test: Validation error (conflicting params)');
    console.log('   Testing: aspectRatio + width conflict');

    try {
        await client.image({
            model: 'qwen-image',
            prompt: 'test',
            aspectRatio: '16:9',
            width: 512  // conflict!
        });
        console.log('   ❌ Should have thrown ValidationError\n');
        return false;
    } catch (e) {
        if (e instanceof ValidationError) {
            console.log(`   ✅ Caught ValidationError as expected`);
            console.log(`   📋 Message: ${e.message.split('\n')[0]}\n`);
            return true;
        }
        console.log(`   ⚠️ Caught different error: ${e.message}\n`);
        return false;
    }
}

async function testUnknownParamError() {
    console.log('🔴 Test: Unknown param error');
    console.log('   Testing: unsupported param "foobar"');

    try {
        await client.image({
            model: 'flux',
            prompt: 'test',
            foobar: 123  // unknown param
        });
        console.log('   ❌ Should have thrown ValidationError\n');
        return false;
    } catch (e) {
        if (e instanceof ValidationError) {
            console.log(`   ✅ Caught ValidationError as expected`);
            console.log(`   📋 Errors: ${e.errors.join(', ')}\n`);
            return true;
        }
        console.log(`   ⚠️ Caught different error: ${e.message}\n`);
        return false;
    }
}

async function testChutesError() {
    console.log('🔴 Test: ChutesError (invalid model)');

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
// RUN TESTS
// ============================================
async function runTests() {
    const results = {};
    
    // Chat tests
    results.chat = await testChat();
    results.chatStreaming = await testChatStreaming();
    
    // Image tests
    results.imageAspectRatio = await testImageWithAspectRatio();
    results.imageAlias = await testImageWithAlias();
    results.subdomainImage = await testSubdomainImage();
    
    // Audio tests
    results.audioTTS = await testAudioTTS();
    results.audioAlias = await testAudioAlias();
    
    // Video test (optional)
    const videoResult = await testVideo();
    if (videoResult !== null) {
        results.video = videoResult;
    }
    
    // Validation tests
    results.validationError = await testValidationError();
    results.unknownParamError = await testUnknownParamError();
    results.chutesError = await testChutesError();

    console.log('═'.repeat(50));
    console.log('📊 Results:');
    for (const [name, passed] of Object.entries(results)) {
        console.log(`   ${name}: ${passed ? '✅' : '❌'}`);
    }
    
    const passCount = Object.values(results).filter(v => v).length;
    const totalCount = Object.values(results).length;
    console.log(`\n   Total: ${passCount}/${totalCount} passed`);
    console.log('═'.repeat(50) + '\n');
    
    process.exit(passCount === totalCount ? 0 : 1);
}

runTests();
