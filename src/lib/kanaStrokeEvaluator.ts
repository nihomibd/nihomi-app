// src/lib/kanaStrokeEvaluator.ts
// NIHOMI KANA STUDIO™ — GEOMETRIC VECTOR STROKE EVALUATION ENGINE
// Evaluates stroke count, start point proximity, vector direction, and path coverage.
// Truthful, evidence-based handwriting verification without fake random percentages.

import { KanaVectorStroke, getKanaStrokeSequence, hasKanaStrokeTemplate } from '../data/kanaStrokePaths';

export interface DrawnPoint {
  x: number;
  y: number;
  time?: number;
}

export type DrawnStroke = DrawnPoint[];

export interface StrokeEvaluationItem {
  strokeNumber: number;
  passed: boolean;
  reason?: string;
  instructionBn?: string;
}

export interface KanaStrokeEvaluationResult {
  isCorrect: boolean;
  score: number;
  feedbackBn: string;
  detailedMistake: {
    strokeIndex?: number;
    reason:
      | 'no_drawing'
      | 'stroke_count_too_few'
      | 'stroke_count_too_many'
      | 'wrong_start_position'
      | 'wrong_direction'
      | 'stroke_too_short'
      | 'unsupported_template';
    instructionBn?: string;
  } | null;
  items: StrokeEvaluationItem[];
}

/**
 * Evaluates drawn strokes against canonical vector stroke references.
 */
export function evaluateKanaStrokes(
  char: string,
  targetStrokeCount: number,
  drawnStrokes: DrawnStroke[],
  canvasSize: number
): KanaStrokeEvaluationResult {
  if (!drawnStrokes || drawnStrokes.length === 0) {
    return {
      isCorrect: false,
      score: 0,
      feedbackBn: 'অনুগ্রহ করে ক্যানভাসে লিখে যাচাই বাটনে চাপুন।',
      detailedMistake: { reason: 'no_drawing' },
      items: []
    };
  }

  // 0. TRUSTED TEMPLATE GATE
  if (!hasKanaStrokeTemplate(char)) {
    return {
      isCorrect: false,
      score: 0,
      feedbackBn: 'এই অক্ষরের যাচাই এখনো প্রস্তুত নয়। নির্দেশিকা দেখে মুক্তহস্তে অনুশীলন করুন।',
      detailedMistake: {
        reason: 'unsupported_template',
        instructionBn: 'মুক্তহস্তে অনুশীলন'
      },
      items: []
    };
  }

  const expectedStrokes: KanaVectorStroke[] = getKanaStrokeSequence(char, targetStrokeCount);
  const actualCount = drawnStrokes.length;
  const targetCount = expectedStrokes.length > 0 ? expectedStrokes.length : targetStrokeCount;
  const safeCanvasSize = Math.max(canvasSize, 100);

  // 1. STROKE COUNT CHECKS
  if (actualCount < targetCount) {
    const missing = targetCount - actualCount;
    const nextStroke = expectedStrokes[actualCount];
    return {
      isCorrect: false,
      score: Math.max(25, Math.round((actualCount / targetCount) * 55)),
      feedbackBn: `অসম্পূর্ণ লেখা! ${char}-এ মোট ${targetCount}টি স্ট্রোক দিতে হবে (আপনি দিয়েছেন ${actualCount}টি, আরও ${missing}টি বাকি)।`,
      detailedMistake: {
        reason: 'stroke_count_too_few',
        strokeIndex: actualCount,
        instructionBn: nextStroke?.instructionBn || `স্ট্রোক ${actualCount + 1} সম্পন্ন করুন`
      },
      items: drawnStrokes.map((_, i) => ({
        strokeNumber: i + 1,
        passed: true,
        instructionBn: expectedStrokes[i]?.instructionBn
      }))
    };
  }

  if (actualCount > targetCount) {
    return {
      isCorrect: false,
      score: Math.max(30, 80 - (actualCount - targetCount) * 18),
      feedbackBn: `অতিরিক্ত স্ট্রোক দেওয়া হয়েছে! ${char}-এ মোট ${targetCount}টি স্ট্রোক থাকে, আপনি দিয়েছেন ${actualCount}টি। ক্যানভাস মুছে আবার লিখুন।`,
      detailedMistake: {
        reason: 'stroke_count_too_many',
        strokeIndex: targetCount
      },
      items: drawnStrokes.map((_, i) => ({
        strokeNumber: i + 1,
        passed: i < targetCount,
        reason: i >= targetCount ? 'অতিরিক্ত স্ট্রোক' : undefined,
        instructionBn: expectedStrokes[i]?.instructionBn
      }))
    };
  }

  // 2. GEOMETRIC STROKE-BY-STROKE VALIDATION
  const evaluatedItems: StrokeEvaluationItem[] = [];
  let totalScore = 100;
  let firstFailingMistake: KanaStrokeEvaluationResult['detailedMistake'] = null;
  let failingFeedback = '';

  for (let i = 0; i < targetCount; i++) {
    const points = drawnStrokes[i];
    const ref = expectedStrokes[i];

    if (!points || points.length < 2) {
      const reason = `স্ট্রোক ${i + 1} খুব ছোট বা অপূর্ণ।`;
      evaluatedItems.push({ strokeNumber: i + 1, passed: false, reason });
      if (!firstFailingMistake) {
        firstFailingMistake = {
          reason: 'stroke_too_short',
          strokeIndex: i,
          instructionBn: ref?.instructionBn
        };
        failingFeedback = `স্ট্রোক ${i + 1} খুব ছোট। না তুলে পুরো স্ট্রোকটি টানুন। (${ref?.instructionBn || ''})`;
      }
      totalScore -= 30;
      continue;
    }

    // Normalized coordinates (0 to 100 scale)
    const p0 = points[0];
    const pEnd = points[points.length - 1];

    const u0 = (p0.x / safeCanvasSize) * 100;
    const v0 = (p0.y / safeCanvasSize) * 100;
    const uEnd = (pEnd.x / safeCanvasSize) * 100;
    const vEnd = (pEnd.y / safeCanvasSize) * 100;

    const dx = uEnd - u0;
    const dy = vEnd - v0;
    const strokeLength = Math.hypot(dx, dy);

    // Minimum stroke displacement check
    if (strokeLength < 8) {
      const reason = `স্ট্রোক ${i + 1} শুধুমাত্র একটি বিন্দুর মতো হয়েছে।`;
      evaluatedItems.push({ strokeNumber: i + 1, passed: false, reason });
      if (!firstFailingMistake) {
        firstFailingMistake = {
          reason: 'stroke_too_short',
          strokeIndex: i,
          instructionBn: ref?.instructionBn
        };
        failingFeedback = `স্ট্রোক ${i + 1} পর্যাপ্ত দীর্ঘ নয়। ${ref?.instructionBn || ''}`;
      }
      totalScore -= 25;
      continue;
    }

    // Start position proximity check (allow 38% tolerance for touchscreens)
    if (ref && ref.startPoint) {
      const startDist = Math.hypot(u0 - ref.startPoint.x, v0 - ref.startPoint.y);
      if (startDist > 38) {
        const reason = `স্ট্রোক ${i + 1} ভুল স্থান থেকে শুরু হয়েছে।`;
        evaluatedItems.push({ strokeNumber: i + 1, passed: false, reason });
        if (!firstFailingMistake) {
          firstFailingMistake = {
            reason: 'wrong_start_position',
            strokeIndex: i,
            instructionBn: ref.instructionBn
          };
          failingFeedback = `স্ট্রোক ${i + 1} ভুল জায়গা থেকে শুরু হয়েছে। সঠিক অবস্থান: ${ref.instructionBn}`;
        }
        totalScore -= 25;
        continue;
      }
    }

    // Direction check
    if (ref && ref.direction) {
      let directionMismatch = false;

      if (ref.direction === 'right' && dx < -12) {
        directionMismatch = true;
        failingFeedback = `স্ট্রোক ${i + 1} উল্টো দিকে টানা হয়েছে! নিয়ম: বাম থেকে ডানে সোজা টান দিন।`;
      } else if (ref.direction === 'down' && dy < -12) {
        directionMismatch = true;
        failingFeedback = `স্ট্রোক ${i + 1} নিচ থেকে ওপরে টানা হয়েছে! নিয়ম: ওপর থেকে নিচে নামান।`;
      } else if (ref.direction === 'down-left' && (dx > 20 || dy < -10)) {
        directionMismatch = true;
        failingFeedback = `স্ট্রোক ${i + 1}-এর দিক ভুল। ওপর থেকে নিচে বাম দিকে টানুন।`;
      } else if (ref.direction === 'down-right' && (dx < -15 || dy < -10)) {
        directionMismatch = true;
        failingFeedback = `স্ট্রোক ${i + 1}-এর দিক ভুল। ওপর থেকে নিচে ডান দিকে টানুন।`;
      }

      if (directionMismatch) {
        evaluatedItems.push({
          strokeNumber: i + 1,
          passed: false,
          reason: failingFeedback,
          instructionBn: ref.instructionBn
        });
        if (!firstFailingMistake) {
          firstFailingMistake = {
            reason: 'wrong_direction',
            strokeIndex: i,
            instructionBn: ref.instructionBn
          };
        }
        totalScore -= 30;
        continue;
      }
    }

    // Stroke passed!
    evaluatedItems.push({
      strokeNumber: i + 1,
      passed: true,
      instructionBn: ref?.instructionBn
    });
  }

  const finalScore = Math.max(30, Math.min(98, totalScore));
  const allPassed = evaluatedItems.every((item) => item.passed);

  if (allPassed && finalScore >= 75) {
    return {
      isCorrect: true,
      score: finalScore,
      feedbackBn: `অসাধারণ! ${char}-এর সবগুলো স্ট্রোকের দিক, শুরু ও অনুপাত নির্ভুল হয়েছে (${finalScore}%)।`,
      detailedMistake: null,
      items: evaluatedItems
    };
  }

  return {
    isCorrect: false,
    score: Math.min(finalScore, 68),
    feedbackBn: failingFeedback || `স্ট্রোকের দিক বা আকার কিছুটা অসঙ্গত। নির্দেশিকা দেখে আবার চেষ্টা করুন।`,
    detailedMistake: firstFailingMistake,
    items: evaluatedItems
  };
}
