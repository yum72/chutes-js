/**
 * Audio-only test file for chutes-js SDK
 */

import 'dotenv/config';
import { createClient, saveBlob, ChutesError } from '../index.js';

const API_KEY = process.env.CHUTES_API_KEY;

if (!API_KEY) {
    console.error('❌ Missing CHUTES_API_KEY in .env file');
    process.exit(1);
}

const client = createClient({ apiKey: API_KEY });

async function testAudioCSM() {
    console.log('🎵 Test 1: Audio Generation (CSM-1B)');
    console.log('   Model: csm-1b');

    try {
        const result = await client.audio({
            model: 'csm-1b',
            text: 'Hello world! This is a test of the Chutes J S SDK audio support using CSM.',
            speaker: 1,
            max_duration_ms: 10000
        });

        if (result instanceof Blob) {
            await saveBlob(result, './test-audio-csm.wav');
            console.log('   ✅ Audio saved to test-audio-csm.wav');
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

async function testAudioKokoro() {
    console.log('🎵 Test 2: Audio Generation (Kokoro)');
    console.log('   Model: kokoro');

    try {
        const result = await client.audio({
            model: 'kokoro',
            text: 'Hello world! This is a test of the Chutes J S SDK audio support using Kokoro.',
            voice: 'af_heart',
            speed: 1.0
        });

        if (result instanceof Blob) {
            await saveBlob(result, './test-audio-kokoro.wav');
            console.log('   ✅ Audio saved to test-audio-kokoro.wav');
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

async function runTests() {
    console.log('🚀 Chutes Audio Test Suite\n');
    await testAudioCSM();
    await testAudioKokoro();
}

runTests();
