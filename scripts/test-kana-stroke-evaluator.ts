// scripts/test-kana-stroke-evaluator.ts
// NIHOMI.COM — DETERMINISTIC KANA STROKE EVALUATOR TEST SUITE
// Verifies geometric vector evaluation: correct, incomplete, extra, reversed, misplaced, zero-length, empty, and unsupported.

import { evaluateKanaStrokes, DrawnStroke } from '../src/lib/kanaStrokeEvaluator';
import { getKanaStrokeSequence, hasKanaStrokeTemplate } from '../src/data/kanaStrokePaths';

let passedChecks = 0;
let totalChecks = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✔ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` (${detail})` : ''}`);
    process.exitCode = 1;
  }
}

console.log('\n================================================================');
console.log('🧪 NIHOMI KANA STUDIO™ — VECTOR STROKE EVALUATION TEST SUITE');
console.log('================================================================\n');

// 1. Template presence
assert(hasKanaStrokeTemplate('あ'), 'Hiragana あ has verified template');
assert(hasKanaStrokeTemplate('ア'), 'Katakana ア has verified template');
assert(hasKanaStrokeTemplate('が'), 'Dakuten が has verified template');
assert(hasKanaStrokeTemplate('ぱ'), 'Handakuten ぱ has verified template');
assert(hasKanaStrokeTemplate('きゃ'), 'Yoon きゃ has verified template');
assert(!hasKanaStrokeTemplate('猫'), 'Kanji 猫 correctly reports NO kana template');
assert(!hasKanaStrokeTemplate('Z'), 'Latin letter Z correctly reports NO kana template');

// 2. Empty Drawing
const emptyResult = evaluateKanaStrokes('あ', 3, [], 300);
assert(!emptyResult.isCorrect, 'Empty drawing is not correct');
assert(emptyResult.detailedMistake?.reason === 'no_drawing', 'Empty drawing reports reason: no_drawing');
assert(emptyResult.score === 0, 'Empty drawing score is 0');

// 3. Unsupported Template
const unsupportedResult = evaluateKanaStrokes('猫', 11, [[{ x: 10, y: 10 }, { x: 50, y: 50 }]], 300);
assert(!unsupportedResult.isCorrect, 'Unsupported character is not marked correct');
assert(unsupportedResult.detailedMistake?.reason === 'unsupported_template', 'Reports unsupported_template reason');
assert(unsupportedResult.feedbackBn.includes('এই অক্ষরের যাচাই এখনো প্রস্তুত নয়'), 'Bengali guidance clearly states verification not ready');

// 4. Correct Strokes for 'あ' (canvas size 100)
// Stroke 1: M 26 31 -> 74 30 (right)
// Stroke 2: M 47 16 -> 46 84 (down)
// Stroke 3: M 60.2 40.5 -> loop -> 61 86 (loop)
const validAStrokes: DrawnStroke[] = [
  // Stroke 1: Left to right
  [{ x: 26, y: 31 }, { x: 50, y: 30 }, { x: 74, y: 30 }],
  // Stroke 2: Top to bottom
  [{ x: 47, y: 16 }, { x: 45, y: 50 }, { x: 46, y: 84 }],
  // Stroke 3: Loop
  [{ x: 60, y: 41 }, { x: 30, y: 70 }, { x: 25, y: 65 }, { x: 61, y: 86 }]
];
const validAResult = evaluateKanaStrokes('あ', 3, validAStrokes, 100);
assert(validAResult.isCorrect, 'Correctly drawn Hiragana あ passes evaluation', `Score: ${validAResult.score}`);
assert(validAResult.score >= 75, `Passing score is >= 75 (got ${validAResult.score})`);
assert(validAResult.detailedMistake === null, 'No mistake recorded for valid drawing');

// 5. Incomplete Strokes (Too Few)
const incompleteStrokes: DrawnStroke[] = [
  [{ x: 26, y: 31 }, { x: 50, y: 30 }, { x: 74, y: 30 }]
];
const incompleteResult = evaluateKanaStrokes('あ', 3, incompleteStrokes, 100);
assert(!incompleteResult.isCorrect, 'Incomplete drawing is rejected');
assert(incompleteResult.detailedMistake?.reason === 'stroke_count_too_few', 'Identifies stroke_count_too_few');
assert(incompleteResult.feedbackBn.includes('অসম্পূর্ণ লেখা'), 'Bengali feedback explains incomplete writing');

// 6. Too Many Strokes
const extraStrokes: DrawnStroke[] = [
  ...validAStrokes,
  [{ x: 10, y: 10 }, { x: 20, y: 20 }]
];
const extraResult = evaluateKanaStrokes('あ', 3, extraStrokes, 100);
assert(!extraResult.isCorrect, 'Drawing with extra strokes is rejected');
assert(extraResult.detailedMistake?.reason === 'stroke_count_too_many', 'Identifies stroke_count_too_many');
assert(extraResult.feedbackBn.includes('অতিরিক্ত স্ট্রোক'), 'Bengali feedback explains extra strokes');

// 7. Reversed Stroke Direction (Stroke 1 drawn leftwards instead of rightwards)
const reversedStrokes: DrawnStroke[] = [
  // Starts at canonical start (26, 31) but moves leftwards (dx = 10 - 26 = -16 < -12)
  [{ x: 26, y: 31 }, { x: 18, y: 31 }, { x: 10, y: 31 }],
  validAStrokes[1],
  validAStrokes[2]
];
const reversedResult = evaluateKanaStrokes('あ', 3, reversedStrokes, 100);
assert(!reversedResult.isCorrect, 'Reversed stroke direction is rejected');
assert(reversedResult.detailedMistake?.reason === 'wrong_direction', 'Identifies wrong_direction');
assert(reversedResult.feedbackBn.includes('উল্টো দিকে'), 'Bengali feedback explicitly flags reversed direction');

// 8. Wrong Start Position
const wrongStartStrokes: DrawnStroke[] = [
  // Started at bottom right (85, 85) instead of (26, 31)
  [{ x: 85, y: 85 }, { x: 95, y: 85 }],
  validAStrokes[1],
  validAStrokes[2]
];
const wrongStartResult = evaluateKanaStrokes('あ', 3, wrongStartStrokes, 100);
assert(!wrongStartResult.isCorrect, 'Wrong start position is rejected');
assert(wrongStartResult.detailedMistake?.reason === 'wrong_start_position', 'Identifies wrong_start_position');
assert(wrongStartResult.feedbackBn.includes('ভুল জায়গা থেকে'), 'Bengali feedback explains incorrect starting point');

// 9. Zero-Length / Dot Stroke
const zeroLengthStrokes: DrawnStroke[] = [
  // Single point or minimal displacement
  [{ x: 26, y: 31 }, { x: 26.5, y: 31.2 }],
  validAStrokes[1],
  validAStrokes[2]
];
const zeroLengthResult = evaluateKanaStrokes('あ', 3, zeroLengthStrokes, 100);
assert(!zeroLengthResult.isCorrect, 'Dot / zero-length stroke is rejected');
assert(zeroLengthResult.detailedMistake?.reason === 'stroke_too_short', 'Identifies stroke_too_short');

console.log('\n================================================================');
console.log(`✅ KANA STROKE EVALUATOR SUITE: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks / totalChecks) * 100)}%)`);
console.log('================================================================\n');

if (passedChecks !== totalChecks) {
  process.exit(1);
}
