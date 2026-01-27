/**
 * Test for Image-to-Video generation with a prompt
 * 
 * Run: node tests/test-i2v.js
 */

import 'dotenv/config';
import { createClient, saveBlob } from '../index.js';

const API_KEY = process.env.CHUTES_API_KEY;

if (!API_KEY) {
    console.error('Missing CHUTES_API_KEY in .env file');
    process.exit(1);
}

const client = createClient({ apiKey: API_KEY });

async function testImageToVideo() {
    console.log('\n🎬 Test: Image-to-Video Generation\n');
    
    const imageUrl = 'https://fastly.picsum.photos/id/11/2500/1667.jpg?hmac=xxjFJtAPgshYkysU_aqx2sZir-kIOjNR9vx0te7GycQ';
    const prompt = 'a helicopter fly by the lake in a sunny day, cinematic, 8k';

    console.log('📸 Input image:', imageUrl);
    console.log('🤖 Model: wan (alias for wan-2-2-i2v-14b-fast)');
    console.log('📝 Prompt:', prompt, '\n');

    try {
        const result = await client.video({
            model: 'wan',
            prompt: prompt,
            image: imageUrl
        });

        if (result instanceof Blob) {
            const outputPath = './test-i2v-output.mp4';
            await saveBlob(result, outputPath);
            console.log(`✅ Success! Saved to ${outputPath} (${(result.size / 1024).toFixed(1)} KB)\n`);
            process.exit(0);
        } else {
            console.log('✅ Job started:', result.job_id || JSON.stringify(result).slice(0, 100), '\n');
            process.exit(0);
        }
    } catch (e) {
        console.log(`❌ Failed: ${e.message}`);
        if (e.status) {
            console.log(`📋 Status: ${e.status}`);
        }
        if (e.body) {
            console.log(`📋 Body: ${e.body}`);
        }
        console.log('');
        process.exit(1);
    }
}

testImageToVideo();
