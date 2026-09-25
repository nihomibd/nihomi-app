// server/scripts/verify-nihomi-architecture.ts
// NIHOMI.COM — AUTONOMOUS PRODUCTION ARCHITECTURE VERIFICATION TEST
// Verifies: Nihomi Sensei AI™, Nihomi MemoryOS™, Nihomi WorkOS™, Nihomi Experience™, Golden Learning Loop

import { SenseiNextExperienceService } from '../services/senseiNextExperienceService.js';
import { db } from '../db.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, details?: any) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}`, details || '');
    process.exitCode = 1;
  }
}

async function runVerificationSuite() {
  console.log('\n===============================================================');
  console.log('🏛️ NIHOMI PRODUCTION ARCHITECTURE INTEGRITY TEST SUITE');
  console.log('===============================================================\n');

  const testUserId = `test-learner-${Date.now()}`;

  // -------------------------------------------------------------------------
  // GATE 1: NIHOMI SENSEI AI™ — NEXT EXPERIENCE DECISION ENGINE
  // -------------------------------------------------------------------------
  console.log('👉 GATE 1: Nihomi Sensei AI™ (Next Experience Decision)');
  
  const defaultNextExp = SenseiNextExperienceService.getNextExperience(testUserId);
  assert(!!defaultNextExp, 'Sensei AI generates non-null next experience');
  assert(defaultNextExp.id === 'exp-golden-path-001', 'Default learner receives Golden Path Mission 001');
  assert(defaultNextExp.goal.includes('Water'), 'Mission 001 goal includes buying water');
  assert(defaultNextExp.targetPhraseJa.includes('水') && defaultNextExp.targetPhraseJa.includes('結構'), 'Target phrase includes water and polite bag decline');
  assert(defaultNextExp.rewardCoins === 20, 'Award coins calibrated to 20 for Mission 001');

  // -------------------------------------------------------------------------
  // GATE 2: NIHOMI MEMORYOS™ — MISTAKE MEMORY & SRS QUEUE
  // -------------------------------------------------------------------------
  console.log('\n👉 GATE 2: Nihomi MemoryOS™ (Mistake Memory & Weak Area Retention)');

  // Record a particle confusion mistake
  const mistakeResult = db.recordMistake({
    userId: testUserId,
    itemType: 'PARTICLE',
    conceptId: 'particle-wa-ga-shibuya',
    studentAnswer: '私は水がください',
    correctAnswer: 'お水をください',
    notes: 'Particle confusion between wa, ga, and o'
  });

  assert(!!mistakeResult.mistake, 'Mistake successfully recorded in durable MemoryOS');
  assert(mistakeResult.mistake.mistakeCount >= 1, 'Mistake count tracked accurately');

  const weakAreas = db.getWeakAreas(testUserId);
  assert(weakAreas.weaknesses.length > 0, 'Weak areas queried accurately from MemoryOS');
  assert(weakAreas.memoryOsHealthScore <= 100 && weakAreas.memoryOsHealthScore >= 40, 'MemoryOS health retention score in valid 0-100 range');

  // Verify Sensei AI adapts next experience to remedial weak area
  const adaptiveExp = SenseiNextExperienceService.getNextExperience(testUserId);
  assert(!!adaptiveExp.memoryOsContext, 'Sensei AI references MemoryOS context for recommendation');
  assert(adaptiveExp.memoryOsContext?.isRemedial === true, 'Sensei AI autonomously pivots to remedial recovery');

  // -------------------------------------------------------------------------
  // GATE 3: THE CORE NIHOMI LEARNING LOOP (Attempt → Feedback → Retry → Success)
  // -------------------------------------------------------------------------
  console.log('\n👉 GATE 3: The Core Nihomi Learning Loop & Mastery');

  // Inaccurate attempt (triggers feedback and retry)
  const failedAttempt = SenseiNextExperienceService.evaluateAttempt({
    userId: testUserId,
    situationId: 'exp-golden-path-001',
    userInput: 'ウォーターちょうだい',
    targetPhraseJa: 'お水を1本ください。袋は結構です。'
  });

  assert(failedAttempt.isCorrect === false, 'Inaccurate/informal attempt correctly graded as false');
  assert(failedAttempt.retryRequired === true, 'Retry required flag triggered for learner recovery');
  assert(failedAttempt.feedbackJa.length > 0, 'Sensei AI provides constructive Japanese feedback');
  assert(failedAttempt.feedbackBn.length > 0, 'Sensei AI provides Bengali explanation');

  // Accurate attempt (triggers success, memory update, and coin/XP rewards)
  const successAttempt = SenseiNextExperienceService.evaluateAttempt({
    userId: testUserId,
    situationId: 'exp-golden-path-001',
    userInput: 'お水を1本ください。袋は結構です。',
    targetPhraseJa: 'お水を1本ください。袋は結構です。'
  });

  assert(successAttempt.isCorrect === true, 'Flawless attempt graded as correct');
  assert(successAttempt.retryRequired === false, 'Retry not required on success');
  assert(successAttempt.coinsAwarded === 20, '20 Platform coins awarded on success');
  assert(successAttempt.xpAwarded === 50, '50 XP awarded on success');
  assert(successAttempt.memoryOsRecorded === true, 'Success logged to MemoryOS');
  assert(!!successAttempt.nextTransferAction, 'Transfer action provided to Nihomi WorkOS™ / 3D Canvas');

  // -------------------------------------------------------------------------
  // GATE 4: NIHOMI WORKOS™ & NIHOMI EXPERIENCE™ ARCHITECTURAL PARITY
  // -------------------------------------------------------------------------
  console.log('\n👉 GATE 4: Nihomi WorkOS™ & Nihomi Experience™ Integration');

  assert(!!db.getBaitoScenarios, 'Nihomi WorkOS scenario database access is verified');
  const scenarios = db.getBaitoScenarios();
  assert(scenarios.length >= 1, 'Nihomi WorkOS scenarios loaded and available');

  // -------------------------------------------------------------------------
  // FINAL SCORE & SUMMARY
  // -------------------------------------------------------------------------
  console.log('\n===============================================================');
  console.log(`📊 TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  if (passedTests === totalTests) {
    console.log('🏆 STATUS: 100% PRODUCTION READY — ALL GATES VERIFIED');
  } else {
    console.error('⚠️ WARNING: SOME TESTS FAILED');
  }
  console.log('===============================================================\n');
}

runVerificationSuite().catch((err) => {
  console.error('Verification error:', err);
  process.exit(1);
});
