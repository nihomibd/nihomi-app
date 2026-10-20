// scripts/test-kana-stroke-evaluator.ts
// NIHOMI.COM — DETERMINISTIC KANA STROKE EVALUATOR TEST SUITE
// Verifies geometric vector evaluation: correct, incomplete, extra, reversed, misplaced, zero-length, empty, false-positive 3-lines, and missing loops.

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
// Stroke 3: M 60.2 40.5 -> loop -> 61 86.3 (loop)
const validAStrokes: DrawnStroke[] = [
  // Stroke 1: Left to right
  [{ x: 26, y: 31 }, { x: 50, y: 30 }, { x: 74, y: 30 }],
  // Stroke 2: Top to bottom
  [{ x: 47, y: 16 }, { x: 45, y: 50 }, { x: 46, y: 84 }],
  // Stroke 3: True loop
  [
    { x: 60.2, y: 40.5 },
    { x: 37.4, y: 78.9 },
    { x: 22.5, y: 71.2 },
    { x: 52.2, y: 46.7 },
    { x: 80.2, y: 58.4 },
    { x: 61.0, y: 86.3 }
  ]
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
  // Starts at right (74, 30) and moves leftwards
  [{ x: 74, y: 30 }, { x: 50, y: 30 }, { x: 26, y: 30 }],
  validAStrokes[1],
  validAStrokes[2]
];
const reversedResult = evaluateKanaStrokes('あ', 3, reversedStrokes, 100);
assert(!reversedResult.isCorrect, 'Reversed stroke direction is rejected');
assert(
  reversedResult.detailedMistake?.reason === 'wrong_direction' ||
  reversedResult.detailedMistake?.reason === 'wrong_start_position',
  'Identifies reversed stroke failure'
);

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

// 10. FALSE POSITIVE PREVENTION: Arbitrary 3 vertical lines for 'あ' MUST FAIL!
const arbitrary3VerticalLines: DrawnStroke[] = [
  // Stroke 1: Vertical line straight down (dx=0, dy=49) instead of horizontal
  [{ x: 26, y: 31 }, { x: 26, y: 80 }],
  // Stroke 2: Vertical line down
  [{ x: 47, y: 16 }, { x: 47, y: 84 }],
  // Stroke 3: Vertical line down instead of loop
  [{ x: 60, y: 41 }, { x: 60, y: 85 }]
];
const arbitraryResult = evaluateKanaStrokes('あ', 3, arbitrary3VerticalLines, 100);
assert(!arbitraryResult.isCorrect, 'Arbitrary 3 vertical lines are strictly rejected for あ');
assert(
  arbitraryResult.detailedMistake?.reason === 'wrong_direction' ||
  arbitraryResult.detailedMistake?.reason === 'wrong_end_position',
  'Arbitrary 3 lines correctly flagged with directional or endpoint mismatch'
);

// 11. FALSE POSITIVE PREVENTION: Straight line on Stroke 3 (missing loop) MUST FAIL!
const missingLoopStrokes: DrawnStroke[] = [
  validAStrokes[0],
  validAStrokes[1],
  // Stroke 3: Straight diagonal line from start to end without looping
  [{ x: 60.2, y: 40.5 }, { x: 61.0, y: 86.3 }]
];
const missingLoopResult = evaluateKanaStrokes('あ', 3, missingLoopStrokes, 100);
assert(!missingLoopResult.isCorrect, 'Missing loop on Stroke 3 is strictly rejected');
assert(
  missingLoopResult.detailedMistake?.reason === 'missing_loop' ||
  missingLoopResult.detailedMistake?.reason === 'wrong_direction',
  'Missing loop correctly identified'
);
assert(missingLoopResult.feedbackBn.includes('লুপ বা বৃত্ত'), 'Bengali feedback explicitly mentions loop/circle formation');

// 12. FALSE POSITIVE PREVENTION: Wrong End Position
const wrongEndStrokes: DrawnStroke[] = [
  // Starts at (26, 31) but ends at bottom-left (10, 85) instead of right (74, 30)
  [{ x: 26, y: 31 }, { x: 10, y: 85 }],
  validAStrokes[1],
  validAStrokes[2]
];
const wrongEndResult = evaluateKanaStrokes('あ', 3, wrongEndStrokes, 100);
assert(!wrongEndResult.isCorrect, 'Stroke terminating far from expected endpoint is rejected');
assert(
  wrongEndResult.detailedMistake?.reason === 'wrong_end_position' ||
  wrongEndResult.detailedMistake?.reason === 'wrong_direction',
  'Identifies wrong endpoint or direction'
);

console.log('\n================================================================');
console.log(`✅ KANA STROKE EVALUATOR SUITE: ${passedChecks}/${totalChecks} PASSED (${Math.round((passedChecks / totalChecks) * 100)}%)`);
console.log('================================================================\n');

if (passedChecks !== totalChecks) {
  process.exit(1);
}
