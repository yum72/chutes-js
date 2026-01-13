/**
 * Unit tests for converters.js
 * Run: node tests/converters.test.js
 */

import { CONVERTERS, ASPECT_DIMENSIONS, HIDREAM_RESOLUTIONS, VIDEO_RESOLUTIONS } from '../src/converters.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`  ✅ ${name}`);
        passed++;
    } catch (e) {
        console.log(`  ❌ ${name}`);
        console.log(`     ${e.message}`);
        failed++;
    }
}

function assertEqual(actual, expected, msg = '') {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr !== expectedStr) {
        throw new Error(`${msg ? msg + ': ' : ''}Expected ${expectedStr}, got ${actualStr}`);
    }
}

function assertThrows(fn, expectedMessage) {
    try {
        fn();
        throw new Error(`Expected function to throw, but it didn't`);
    } catch (e) {
        if (expectedMessage && !e.message.includes(expectedMessage)) {
            throw new Error(`Expected error containing "${expectedMessage}", got "${e.message}"`);
        }
    }
}

console.log('\n🧪 Converters Unit Tests\n');

// ============================================
// aspectToWidthHeight
// ============================================
console.log('aspectToWidthHeight:');

test('converts 1:1 to 1024x1024', () => {
    assertEqual(CONVERTERS.aspectToWidthHeight('1:1'), { width: 1024, height: 1024 });
});

test('converts 16:9 to 1360x768', () => {
    assertEqual(CONVERTERS.aspectToWidthHeight('16:9'), { width: 1360, height: 768 });
});

test('converts 9:16 to 768x1360', () => {
    assertEqual(CONVERTERS.aspectToWidthHeight('9:16'), { width: 768, height: 1360 });
});

test('converts 4:3 to 1168x880', () => {
    assertEqual(CONVERTERS.aspectToWidthHeight('4:3'), { width: 1168, height: 880 });
});

test('converts 3:4 to 880x1168', () => {
    assertEqual(CONVERTERS.aspectToWidthHeight('3:4'), { width: 880, height: 1168 });
});

test('converts 21:9 to 1536x656', () => {
    assertEqual(CONVERTERS.aspectToWidthHeight('21:9'), { width: 1536, height: 656 });
});

test('throws on unsupported aspect ratio', () => {
    assertThrows(() => CONVERTERS.aspectToWidthHeight('5:4'), 'Unsupported aspect ratio');
});

// ============================================
// aspectToResolutionEnum
// ============================================
console.log('\naspectToResolutionEnum:');

test('converts 1:1 to 1024x1024', () => {
    assertEqual(CONVERTERS.aspectToResolutionEnum('1:1'), '1024x1024');
});

test('converts 16:9 to 1360x768', () => {
    assertEqual(CONVERTERS.aspectToResolutionEnum('16:9'), '1360x768');
});

test('throws on unsupported ratio for HiDream', () => {
    assertThrows(() => CONVERTERS.aspectToResolutionEnum('21:9'), 'Unsupported aspect ratio for this model');
});

// ============================================
// aspectToSizeString
// ============================================
console.log('\naspectToSizeString:');

test('passes through aspect ratio directly', () => {
    assertEqual(CONVERTERS.aspectToSizeString('16:9'), '16:9');
});

test('passes through auto', () => {
    assertEqual(CONVERTERS.aspectToSizeString('auto'), 'auto');
});

// ============================================
// aspectToVideoResolution
// ============================================
console.log('\naspectToVideoResolution:');

test('converts 16:9 to 480p', () => {
    assertEqual(CONVERTERS.aspectToVideoResolution('16:9'), '480p');
});

test('converts hd to 720p', () => {
    assertEqual(CONVERTERS.aspectToVideoResolution('hd'), '720p');
});

test('defaults to 480p for unknown ratio', () => {
    assertEqual(CONVERTERS.aspectToVideoResolution('weird'), '480p');
});

// ============================================
// durationToFrames
// ============================================
console.log('\ndurationToFrames:');

test('converts 5 seconds at 16fps to 80 frames', () => {
    assertEqual(CONVERTERS.durationToFrames(5, 16), 80);
});

test('converts 3 seconds at 24fps to 72 frames', () => {
    assertEqual(CONVERTERS.durationToFrames(3, 24), 72);
});

test('uses default fps of 16', () => {
    assertEqual(CONVERTERS.durationToFrames(5), 80);
});

test('rounds to nearest frame', () => {
    assertEqual(CONVERTERS.durationToFrames(5.1, 16), 82);
});

// ============================================
// secondsToMs
// ============================================
console.log('\nsecondsToMs:');

test('converts 10 seconds to 10000ms', () => {
    assertEqual(CONVERTERS.secondsToMs(10), 10000);
});

test('converts 0.5 seconds to 500ms', () => {
    assertEqual(CONVERTERS.secondsToMs(0.5), 500);
});

test('rounds to nearest ms', () => {
    assertEqual(CONVERTERS.secondsToMs(1.5001), 1500);
});

// ============================================
// SUMMARY
// ============================================
console.log('\n' + '═'.repeat(50));
console.log(`📊 Results: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(50) + '\n');

process.exit(failed > 0 ? 1 : 0);
