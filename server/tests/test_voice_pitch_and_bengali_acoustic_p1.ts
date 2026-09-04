/**
 * Comprehensive Integration & Unit Test Suite for Tokyo Pitch-Accent System,
 * Bengali-Specific Acoustic Rule Engine, and Audio Telemetry AI Cost Guards.
 */

import { db } from '../db.js';
import { DrillSeedGeneratorService } from '../services/drillSeedGeneratorService.js';
import { TokyoPitchAccentService } from '../services/pitchAccentService.js';
import { aiCostGuard, recordAiCostUsage } from '../middleware/aiCostGuard.js';
import { AuthenticatedRequest } from '../authHelper.js';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

function createMockReqRes(userId: string, body: any = {}): {
  req: AuthenticatedRequest;
  res: any;
  status: number;
  jsonBody: any;
} {
  const events: Record<string, Function[]> = {};
  const mockRes: any = {
    statusCode: 200,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      this.jsonBody = data;
      this.emit('finish');
      return this;
    },
    on(event: string, listener: Function) {
      if (!events[event]) events[event] = [];
      events[event].push(listener);
    },
    removeListener(event: string, listener: Function) {
      if (events[event]) {
        events[event] = events[event].filter((l) => l !== listener);
      }
    },
    emit(event: string) {
      if (events[event]) {
        events[event].forEach((l) => l());
      }
    }
  };

  const mockReq: any = {
    user: { id: userId, email: `${userId}@nihomi.com`, role: 'user' },
    body
  };

  return { req: mockReq, res: mockRes, status: 200, jsonBody: null };
}

async function runTestSuite() {
  console.log('=== STARTING TOKYO PITCH ACCENT & BENGALI ACOUSTIC RULE ENGINE TEST SUITE ===');

  const testUserId = `test-learner-pitch-${Date.now()}`;

  // -------------------------------------------------------------------------
  // TEST 1: Dynamic Drill & Seed Generator Service
  // -------------------------------------------------------------------------
  console.log('\n[TEST 1] Dynamic Drill & Seed Generator Service');
  
  // 1.1 Decompose morae
  const moraeSensei = DrillSeedGeneratorService.decomposeMorae('せんせい');
  assert(moraeSensei.length === 4, `Expected 4 morae for せんせい, got ${moraeSensei.length}`);
  assert(moraeSensei[0] === 'せ' && moraeSensei[3] === 'い', 'Mora breakdown mismatch');

  const moraeTokyo = DrillSeedGeneratorService.decomposeMorae('とうきょう');
  assert(moraeTokyo.length === 4, `Expected 4 morae for とうきょう, got ${moraeTokyo.length}`);
  assert(moraeTokyo[2] === 'きょ', `Compound kana mora failed: ${moraeTokyo[2]}`);

  // 1.2 Generate Minimal Pair Drills (箸 vs 橋)
  const minimalPairs = DrillSeedGeneratorService.generateDrills([
    { word: '箸', readingKana: 'はし' },
    { word: '橋', readingKana: 'はし' },
    { word: '雨', readingKana: 'あめ' },
    { word: '飴', readingKana: 'あめ' }
  ]);

  assert(minimalPairs.totalProcessed === 4, 'Should process 4 words');
  const hashiChopsticks = minimalPairs.drills.find((d) => d.kanji === '箸');
  const hashiBridge = minimalPairs.drills.find((d) => d.kanji === '橋');

  assert(hashiChopsticks !== undefined, '箸 (Chopsticks) drill not generated');
  assert(hashiChopsticks!.pattern === 'atamadaka', '箸 must be Atamadaka ①');
  assert(hashiChopsticks!.targetPitches[0] === 'H' && hashiChopsticks!.targetPitches[1] === 'L', '箸 pitch mismatch');
  assert(hashiChopsticks!.relativeTargetContour[0] > hashiChopsticks!.relativeTargetContour[1], '箸 relative contour drop required');

  assert(hashiBridge !== undefined, '橋 (Bridge) drill not generated');
  assert(hashiBridge!.pattern === 'odaka', '橋 must be Odaka ②');
  assert(hashiBridge!.targetPitches[0] === 'L' && hashiBridge!.targetPitches[1] === 'H', '橋 pitch mismatch');

  // 1.3 Bulk upsert & query database
  db.bulkUpsertPitchDrills(minimalPairs.drills);
  const fetchedDrills = db.getPitchDrills({ contrastGroup: 'hashi' });
  assert(fetchedDrills.length >= 2, `Expected >= 2 drills in contrastGroup 'hashi', found ${fetchedDrills.length}`);
  console.log('✓ Dynamic Drill & Seed Generator verified successfully.');

  // -------------------------------------------------------------------------
  // TEST 2: Bengali Acoustic Rule Engine — Dynamic Stress vs Pitch
  // -------------------------------------------------------------------------
  console.log('\n[TEST 2] Bengali Acoustic Rule Engine — Dynamic Stress Detection');
  
  // Speaker speaks "箸" (Atamadaka - High then Low), but gives a massive volume spike on mora 2
  // while pitch frequency stays low.
  const dynamicStressAnalysis = TokyoPitchAccentService.analyzeBengaliAcousticErrors({
    morae: ['は', 'し'],
    targetPitches: ['H', 'L'],
    detectedPitches: ['H', 'L'],
    actualPattern: 'atamadaka',
    actualDownstep: 1,
    pitchF0Points: [280, 275, 200, 195],
    intensityPoints: [0.8, 0.8, 1.8, 1.9], // Loudness burst on Low mora 2
    audioDurationMs: 400,
    averageF0Hz: 235
  });

  assert(dynamicStressAnalysis.hasDynamicStressError === true, 'Failed to detect dynamic stress on Low mora');
  const stressErr = dynamicStressAnalysis.detectedErrors.find((e) => e.errorCode === 'DYNAMIC_STRESS_INSTEAD_OF_PITCH');
  assert(stressErr !== undefined, 'DYNAMIC_STRESS_INSTEAD_OF_PITCH error missing');
  assert(stressErr!.affectedMora === 'し', 'Should point to mora 2 (し)');
  assert(stressErr!.messageBn.includes('ভলিউম'), 'Bengali feedback should mention volume/stress');
  assert(stressErr!.actionableCorrectionBn.length > 0, 'Actionable Bengali correction required');
  console.log('✓ Dynamic Stress error detected with clear Bengali coaching string.');

  // -------------------------------------------------------------------------
  // TEST 3: Bengali Acoustic Rule Engine — Mora Flattening Detection
  // -------------------------------------------------------------------------
  console.log('\n[TEST 3] Bengali Acoustic Rule Engine — Mora Flattening Detection');

  // Speaker speaks "雨" (Atamadaka ① - High then Low), but speaks flat monotone
  const flatteningAnalysis = TokyoPitchAccentService.analyzeBengaliAcousticErrors({
    morae: ['あ', 'め'],
    targetPitches: ['H', 'L'],
    detectedPitches: ['L', 'L'], // Flattened Low-Low
    actualPattern: 'atamadaka',
    actualDownstep: 1,
    pitchF0Points: [200, 201, 199, 200], // Monotone ~200Hz
    intensityPoints: [1.0, 1.0, 1.0, 1.0],
    audioDurationMs: 400,
    averageF0Hz: 200
  });

  assert(flatteningAnalysis.hasMoraFlattening === true, 'Failed to detect mora flattening');
  const flatErr = flatteningAnalysis.detectedErrors.find((e) => e.errorCode === 'MORA_FLATTENING');
  assert(flatErr !== undefined, 'MORA_FLATTENING error missing');
  assert(flatErr!.messageBn.includes('সমতলকরণ') || flatErr!.messageBn.includes('ফ্ল্যাট'), 'Bengali message should indicate flattening');
  console.log('✓ Mora flattening error detected with actionable downstep guidance.');

  // -------------------------------------------------------------------------
  // TEST 4: Bengali Acoustic Rule Engine — Chōon (Long Vowel) Shortening
  // -------------------------------------------------------------------------
  console.log('\n[TEST 4] Bengali Acoustic Rule Engine — Long Vowel (Chōon) Shortening');

  // Word "先生" (せんせい) has 4 morae, expected duration >= 700ms (175ms/mora).
  // Rushed duration of 350ms (< 130ms/mora)
  const vowelShorteningAnalysis = TokyoPitchAccentService.analyzeBengaliAcousticErrors({
    morae: ['せ', 'ん', 'せ', 'い'],
    targetPitches: ['L', 'H', 'H', 'L'],
    detectedPitches: ['L', 'H', 'H', 'L'],
    actualPattern: 'nakadaka',
    actualDownstep: 3,
    pitchF0Points: [190, 270, 265, 195],
    intensityPoints: [1.0, 1.0, 1.0, 1.0],
    audioDurationMs: 380, // Rushed: ~95ms per mora
    averageF0Hz: 230
  });

  assert(vowelShorteningAnalysis.hasVowelLengthMismatch === true, 'Failed to detect long vowel shortening');
  const vowelErr = vowelShorteningAnalysis.detectedErrors.find((e) => e.errorCode === 'SHORT_LONG_VOWEL_MISMATCH');
  assert(vowelErr !== undefined, 'SHORT_LONG_VOWEL_MISMATCH error missing');
  assert(vowelErr!.messageBn.includes('দীর্ঘ স্বর'), 'Bengali message should specify Chōon');
  console.log('✓ Chōon long vowel mismatch accurately detected.');

  // -------------------------------------------------------------------------
  // TEST 5: Bengali Acoustic Rule Engine — Sokuon (っ) Geminate Rushed
  // -------------------------------------------------------------------------
  console.log('\n[TEST 5] Bengali Acoustic Rule Engine — Sokuon Rushed');

  // Word "学校" (がっこう) contains Sokuon っ.
  const sokuonAnalysis = TokyoPitchAccentService.analyzeBengaliAcousticErrors({
    morae: ['が', 'っ', 'こ', 'う'],
    targetPitches: ['L', 'H', 'H', 'H'],
    detectedPitches: ['L', 'H', 'H', 'H'],
    actualPattern: 'heiban',
    actualDownstep: 0,
    pitchF0Points: [190, 260, 260, 260],
    intensityPoints: [1.0, 1.0, 1.0, 1.0],
    audioDurationMs: 400, // < 135ms per mora
    averageF0Hz: 240
  });

  assert(sokuonAnalysis.hasSokuonRushedError === true, 'Failed to detect rushed Sokuon stop');
  const sokuonErr = sokuonAnalysis.detectedErrors.find((e) => e.errorCode === 'SOKUON_GEMINATE_RUSHED');
  assert(sokuonErr !== undefined, 'SOKUON_GEMINATE_RUSHED error missing');
  assert(sokuonErr!.messageBn.includes('ৎসু') || sokuonErr!.messageBn.includes('Sokuon'), 'Bengali text mentions Sokuon');
  console.log('✓ Sokuon rushed pause error verified.');

  // -------------------------------------------------------------------------
  // TEST 6: Perfect Native Pitch Accuracy & Zero False Positives
  // -------------------------------------------------------------------------
  console.log('\n[TEST 6] Tokyo Pitch Accent Evaluation — Native Profile Accuracy');

  const nativeAssessment = await TokyoPitchAccentService.evaluatePitchAccent({
    userId: testUserId,
    targetPhrase: '箸',
    targetRomaji: 'hashi',
    targetMeaning: 'Chopsticks',
    targetPattern: 'atamadaka',
    targetDownstepMora: 1,
    pitchF0Points: [285, 280, 205, 195], // Sharp drop: Mora 1 High, Mora 2 Low
    intensityPoints: [1.0, 1.0, 0.95, 0.9],
    audioDurationMs: 420
  });

  assert(nativeAssessment.patternMatch === true, 'Native profile must match pattern');
  assert(nativeAssessment.pitchAccuracyScore === 100, `Expected 100% accuracy, got ${nativeAssessment.pitchAccuracyScore}%`);
  assert(nativeAssessment.bengaliAcousticAnalysis !== undefined, 'Bengali acoustic analysis should be populated');
  assert(nativeAssessment.bengaliAcousticAnalysis!.detectedErrors.length === 0, 'Zero false positive errors expected on clean pronunciation');
  assert(nativeAssessment.bengaliAcousticAnalysis!.overallBengaliCoachingBn.includes('চমৎকার'), 'Congratulatory Bengali feedback expected');
  console.log('✓ Native pronunciation scored 100% with no false positive acoustic flags.');

  // -------------------------------------------------------------------------
  // TEST 7: AI Cost Guard & Rate Limiter Enforcement
  // -------------------------------------------------------------------------
  console.log('\n[TEST 7] AI Cost Guard & Telemetry Quota Enforcement');

  const costGuardMiddleware = aiCostGuard({
    operationType: 'pronunciation',
    estimatedTokens: 800
  });

  // Normal user request passing through Cost Guard
  const { req: req1, res: res1 } = createMockReqRes(testUserId);
  const state1 = { nextCalled: false };
  costGuardMiddleware(req1, res1, () => {
    state1.nextCalled = true;
  });
  assert(state1.nextCalled === true, 'Normal request should pass through AI Cost Guard');

  // Record usage up to the free tier quota limit (free tier = 20,000 tokens)
  recordAiCostUsage(testUserId, 21000, 'pronunciation');

  // Next request should be rejected with 429 Quota Exceeded
  const { req: req2, res: res2 } = createMockReqRes(testUserId);
  const state2 = { nextCalled: false };
  costGuardMiddleware(req2, res2, () => {
    state2.nextCalled = true;
  });

  assert(state2.nextCalled === false, 'Blocked request should not call next()');
  assert(res2.statusCode === 429, `Expected HTTP 429 Quota Exceeded, got ${res2.statusCode}`);
  assert(res2.jsonBody?.quotaExceeded === true || res2.jsonBody?.code?.includes('QUOTA') || res2.jsonBody?.code?.includes('TOKEN_CAP'), 'Quota flag or code expected in 429 body');
  console.log('✓ AI Cost Guard strictly enforced 429 upon monthly quota depletion.');

  console.log('\n========================================================================');
  console.log('✅ ALL INTEGRATION TESTS PASSED: TOKYO PITCH ACCENT & BENGALI ACOUSTIC ENGINE');
  console.log('========================================================================\n');
}

runTestSuite().catch((err) => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
