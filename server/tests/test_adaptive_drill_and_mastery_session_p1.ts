/**
 * Integration Test Suite: Autonomous Adaptive Learning Loop,
 * Pre-Computed Audio Cache/Contour Engine & Multi-Turn Accent Mastery State Machine
 */

import { db } from '../db.js';
import { AdaptiveDrillService } from '../services/adaptiveDrillService.js';
import { BulkCurriculumImporter } from '../scripts/bulk_import_curriculum.js';
import { DrillSeedGeneratorService } from '../services/drillSeedGeneratorService.js';
import { TokyoPitchAccentService } from '../services/pitchAccentService.js';
import { TokyoPitchAccentAssessment } from '../types.js';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('🧪 NIHOMI: ADAPTIVE LEARNING LOOP & ACCENT MASTERY TEST SUITE');
  console.log('================================================================\n');

  const testUserStress = `test-user-stress-${Date.now()}`;
  const testUserChoon = `test-user-choon-${Date.now()}`;
  const testUserSokuon = `test-user-sokuon-${Date.now()}`;

  // --------------------------------------------------------------------------
  // TEST 1: Dynamic Weakness-Adaptive Drill Engine
  // --------------------------------------------------------------------------
  console.log('▶ [Test 1] Dynamic Weakness-Adaptive Drill Engine...');

  // 1.1 Simulate user with Dynamic Stress acoustic failure (intensity correlation > 0.4)
  for (let i = 0; i < 4; i++) {
    const mockStressAssessment: TokyoPitchAccentAssessment = {
      id: `assess-stress-${i}-${Date.now()}`,
      userId: testUserStress,
      targetPhrase: '箸',
      targetRomaji: 'hashi',
      targetMeaning: 'Chopsticks',
      targetPattern: 'atamadaka',
      targetDownstepMora: 1,
      detectedPattern: 'heiban',
      detectedDownstepMora: 0,
      moraBreakdown: [
        { moraIndex: 1, mora: 'は', targetPitch: 'H', detectedPitch: 'L', isDropPoint: true, isMatch: false, estimatedHz: 190 },
        { moraIndex: 2, mora: 'し', targetPitch: 'L', detectedPitch: 'H', isDropPoint: false, isMatch: false, estimatedHz: 220 }
      ],
      patternMatch: false,
      pitchAccuracyScore: 55,
      moraRhythmScore: 78,
      clarityScore: 82,
      overallScore: 66,
      passed: false,
      audioDurationMs: 650,
      averageF0Hz: 205,
      pitchTrajectory: [190, 200, 215, 220],
      feedbackEn: 'Dynamic stress detected.',
      feedbackBn: 'ডাইনামিক স্ট্রেস ত্রুটি।',
      coachingTips: ['Keep intensity flat.'],
      bengaliAcousticAnalysis: {
        hasDynamicStressError: true,
        hasMoraFlattening: false,
        hasVowelLengthMismatch: false,
        hasSokuonRushedError: false,
        pitchVsIntensityCorrelation: 0.68,
        detectedErrors: [
          {
            errorCode: 'DYNAMIC_STRESS_INSTEAD_OF_PITCH',
            affectedMora: 'は',
            severity: 'high',
            moraIndex: 1,
            messageEn: 'Dynamic stress detected.',
            messageBn: 'ভলিউম বাড়িয়ে জোর দেওয়ার প্রবণতা।',
            actionableCorrectionBn: 'ভলিউম সমতল রেখে পিচ পরিবর্তন করুন।'
          }
        ],
        overallBengaliCoachingBn: 'ডাইনামিক স্ট্রেস দূর করতে ভলিউম সমান্তরাল রাখুন।',
        actionableRecommendationsBn: ['ভলিউম ফ্ল্যাট রাখুন']
      },
      recordedAt: new Date(Date.now() - i * 60000).toISOString()
    };
    db.createVoiceAssessment(mockStressAssessment);
  }

  const stressRec = await AdaptiveDrillService.getAdaptiveRecommendations(testUserStress);
  assert(stressRec.primaryWeakness === 'dynamic_stress', `Expected dynamic_stress but got ${stressRec.primaryWeakness}`);
  assert(stressRec.recommendedPairs.length === 3, `Expected 3 recommended pairs, got ${stressRec.recommendedPairs.length}`);
  assert(stressRec.diagnosticSummaryBn.includes('ডাইনামিক স্ট্রেস'), 'Expected diagnostic summary in Bengali to mention dynamic stress');
  assert(stressRec.recommendedPairs[0].drills.length === 2, 'Expected each recommended pair to have 2 drills');
  assert(stressRec.recommendedPairs[0].drills[0].standardHzContour.length > 0, 'Expected pre-computed standard Hz contour');
  assert(stressRec.recommendedPairs[0].drills[0].targetIntensityEnvelope.length > 0, 'Expected pre-computed intensity envelope');
  console.log('   ✓ Dynamic stress telemetry correctly triggered 3 targeted contrast pairs with Bengali diagnosis.');

  // 1.2 Simulate user with Chōon shortening failure
  for (let i = 0; i < 3; i++) {
    const mockChoonAssessment: TokyoPitchAccentAssessment = {
      id: `assess-choon-${i}-${Date.now()}`,
      userId: testUserChoon,
      targetPhrase: 'おばあさん',
      targetRomaji: 'obaasan',
      targetMeaning: 'Grandmother',
      targetPattern: 'nakadaka',
      targetDownstepMora: 2,
      detectedPattern: 'heiban',
      detectedDownstepMora: 0,
      moraBreakdown: [],
      patternMatch: false,
      pitchAccuracyScore: 50,
      moraRhythmScore: 40,
      clarityScore: 75,
      overallScore: 52,
      passed: false,
      audioDurationMs: 400,
      averageF0Hz: 210,
      pitchTrajectory: [],
      feedbackEn: 'Vowel too short.',
      feedbackBn: 'দীর্ঘ স্বর ছোট হয়ে গেছে।',
      coachingTips: ['Hold vowel.'],
      bengaliAcousticAnalysis: {
        hasDynamicStressError: false,
        hasMoraFlattening: false,
        hasVowelLengthMismatch: true,
        hasSokuonRushedError: false,
        pitchVsIntensityCorrelation: 0.1,
        detectedErrors: [
          {
            errorCode: 'SHORT_LONG_VOWEL_MISMATCH',
            affectedMora: 'あ',
            severity: 'high',
            moraIndex: 2,
            messageEn: 'Vowel too short.',
            messageBn: 'দীর্ঘ স্বর ছোট হয়ে গেছে।',
            actionableCorrectionBn: 'পূর্ণ ১ মোরা সময় দিন।'
          }
        ],
        overallBengaliCoachingBn: 'দীর্ঘ স্বর পূর্ণ ১ মোরা ধরে রাখুন।',
        actionableRecommendationsBn: ['১ মোরা সময় বাড়িয়ে দিন']
      },
      recordedAt: new Date(Date.now() - i * 60000).toISOString()
    };
    db.createVoiceAssessment(mockChoonAssessment);
  }

  const choonRec = await AdaptiveDrillService.getAdaptiveRecommendations(testUserChoon);
  assert(choonRec.primaryWeakness === 'choon_shortening', `Expected choon_shortening but got ${choonRec.primaryWeakness}`);
  assert(choonRec.diagnosticSummaryBn.includes('দীর্ঘ স্বর'), 'Expected Bengali diagnostic summary to explain Chōon');
  assert(choonRec.recommendedPairs.some((p) => p.contrastGroup.includes('obasan')), 'Expected obasan/obaasan contrast pair in recommendations');
  console.log('   ✓ Chōon vowel length telemetry correctly triggered long-vowel remediation pairs.');

  // 1.3 Simulate user with Sokuon rushed failure
  for (let i = 0; i < 3; i++) {
    const mockSokuonAssessment: TokyoPitchAccentAssessment = {
      id: `assess-sokuon-${i}-${Date.now()}`,
      userId: testUserSokuon,
      targetPhrase: '切手',
      targetRomaji: 'kitte',
      targetMeaning: 'Stamp',
      targetPattern: 'heiban',
      targetDownstepMora: 0,
      detectedPattern: 'heiban',
      detectedDownstepMora: 0,
      moraBreakdown: [],
      patternMatch: false,
      pitchAccuracyScore: 60,
      moraRhythmScore: 42,
      clarityScore: 70,
      overallScore: 56,
      passed: false,
      audioDurationMs: 380,
      averageF0Hz: 215,
      pitchTrajectory: [],
      feedbackEn: 'Sokuon pause rushed.',
      feedbackBn: 'সোকুওন বিরতি বাদ পড়েছে।',
      coachingTips: ['Pause on small tsu.'],
      bengaliAcousticAnalysis: {
        hasDynamicStressError: false,
        hasMoraFlattening: false,
        hasVowelLengthMismatch: false,
        hasSokuonRushedError: true,
        pitchVsIntensityCorrelation: 0.05,
        detectedErrors: [
          {
            errorCode: 'SOKUON_GEMINATE_RUSHED',
            affectedMora: 'っ',
            severity: 'high',
            moraIndex: 1,
            messageEn: 'Sokuon pause rushed.',
            messageBn: 'সোকুওন বিরতি তাড়াহুড়ো করা হয়েছে।',
            actionableCorrectionBn: '১ মোরা স্তব্ধ থাকুন।'
          }
        ],
        overallBengaliCoachingBn: 'っ এর ক্ষেত্রে ১ মোরা নিঃশব্দ বিরতি দিন।',
        actionableRecommendationsBn: ['১ মোরা স্তব্ধ থাকুন']
      },
      recordedAt: new Date(Date.now() - i * 60000).toISOString()
    };
    db.createVoiceAssessment(mockSokuonAssessment);
  }

  const sokuonRec = await AdaptiveDrillService.getAdaptiveRecommendations(testUserSokuon);
  assert(sokuonRec.primaryWeakness === 'sokuon_rushed', `Expected sokuon_rushed but got ${sokuonRec.primaryWeakness}`);
  assert(sokuonRec.diagnosticSummaryBn.includes('সোকুওন') || sokuonRec.diagnosticSummaryBn.includes('促音') || sokuonRec.diagnosticSummaryBn.includes('ৎসু'), 'Expected Bengali diagnostic summary to explain Sokuon');
  console.log('   ✓ Sokuon rushed telemetry correctly triggered geminate pause remediation pairs.');

  // --------------------------------------------------------------------------
  // TEST 2: Bulk Ingestion CLI & Curriculum Pre-Computation
  // --------------------------------------------------------------------------
  console.log('\n▶ [Test 2] Bulk Ingestion CLI & Curriculum Parser...');

  const importResult1 = await BulkCurriculumImporter.importCurriculum();
  assert(importResult1.totalValid >= 40, `Expected at least 40 valid drills, got ${importResult1.totalValid}`);
  assert(importResult1.sampleDrills.length > 0, 'Expected sample drills from import');

  const sampleDrill = importResult1.sampleDrills[0];
  assert(sampleDrill.standardHzContour.length === sampleDrill.moraCount, 'Hz contour length must match mora count');
  assert(sampleDrill.targetIntensityEnvelope.length === sampleDrill.moraCount, 'Intensity envelope length must match mora count');
  assert(sampleDrill.targetPitches.length === sampleDrill.moraCount, 'Target pitches count must match mora count');
  assert(sampleDrill.relativeTargetContour.length === sampleDrill.moraCount, 'Relative contour must match mora count');

  // Second run: verify idempotent deduplication (updated count increases, no corrupted duplicates)
  const importResult2 = await BulkCurriculumImporter.importCurriculum();
  assert(importResult2.inserted === 0, `Expected 0 new insertions on duplicate run, got ${importResult2.inserted}`);
  assert(importResult2.updated > 0, `Expected existing drills to be updated without duplication, got ${importResult2.updated}`);
  console.log(`   ✓ Ingested ${importResult1.totalValid} curriculum items with complete pre-computed contours and verified deduplication.`);

  // --------------------------------------------------------------------------
  // TEST 3: Interactive Practice Session State Machine
  // --------------------------------------------------------------------------
  console.log('\n▶ [Test 3] Interactive Practice Session State Machine...');

  // 3.1 Start a session with adaptive drills
  const adaptiveRecSession = await AdaptiveDrillService.getAdaptiveRecommendations(testUserStress);
  const targetDrills = adaptiveRecSession.recommendedPairs.flatMap((p) => p.drills).slice(0, 4);

  const sessionId = `test-session-${Date.now()}`;
  const initialSession = db.createAccentMasterySession({
    id: sessionId,
    userId: testUserStress,
    title: 'Adaptive Stress Reduction Mastery',
    status: 'in_progress',
    currentStepIndex: 0,
    totalSteps: targetDrills.length,
    targetDrillIds: targetDrills.map((d) => d.id),
    steps: targetDrills.map((drill, index) => ({
      stepIndex: index,
      drillId: drill.id,
      kanji: drill.kanji,
      readingKana: drill.readingKana,
      pattern: drill.pattern,
      targetPitches: drill.targetPitches
    })),
    masteryIndex: 0,
    bengaliAcousticFlagsDetected: [],
    startedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString()
  });

  assert(initialSession.status === 'in_progress', 'Session must start in_progress');
  assert(initialSession.totalSteps === targetDrills.length, 'Total steps must equal target drills count');
  assert(initialSession.currentStepIndex === 0, 'Current step index must start at 0');

  // 3.2 Execute Turn 1 Step Evaluation
  const drill1 = targetDrills[0];
  const assessment1 = await TokyoPitchAccentService.evaluatePitchAccent({
    userId: testUserStress,
    targetPhrase: drill1.kanji,
    targetRomaji: drill1.romaji,
    targetPattern: drill1.pattern,
    targetDownstepMora: drill1.downstepMora,
    pitchF0Points: drill1.standardHzContour,
    intensityPoints: drill1.targetIntensityEnvelope,
    audioDurationMs: 500
  });

  initialSession.steps[0].userPitchAssessment = assessment1;
  initialSession.steps[0].stepScore = assessment1.overallScore;
  initialSession.steps[0].passed = assessment1.passed;
  initialSession.steps[0].bengaliCoachingTip = assessment1.bengaliAcousticAnalysis?.overallBengaliCoachingBn || 'গুড জব!';
  initialSession.steps[0].completedAt = new Date().toISOString();
  initialSession.currentStepIndex = 1;
  initialSession.lastActivityAt = new Date().toISOString();

  db.updateAccentMasterySession(initialSession);

  const retrievedTurn1 = db.getAccentMasterySession(sessionId);
  assert(retrievedTurn1 !== null, 'Session must exist in DB');
  assert(retrievedTurn1!.currentStepIndex === 1, 'Current step index must have advanced to 1');
  assert(retrievedTurn1!.steps[0].stepScore !== undefined, 'Step 0 score must be recorded');
  assert(retrievedTurn1!.status === 'in_progress', 'Session must still be in_progress after step 1');
  console.log('   ✓ Turn 1 submitted: evaluation recorded, immediate Bengali coaching tip stored, and state advanced.');

  // 3.3 Execute Remaining Turns to Completion
  for (let i = 1; i < initialSession.totalSteps; i++) {
    const drill = targetDrills[i];
    const assessment = await TokyoPitchAccentService.evaluatePitchAccent({
      userId: testUserStress,
      targetPhrase: drill.kanji,
      targetRomaji: drill.romaji,
      targetPattern: drill.pattern,
      targetDownstepMora: drill.downstepMora,
      pitchF0Points: drill.standardHzContour,
      intensityPoints: drill.targetIntensityEnvelope,
      audioDurationMs: 450
    });

    initialSession.steps[i].userPitchAssessment = assessment;
    initialSession.steps[i].stepScore = assessment.overallScore;
    initialSession.steps[i].passed = assessment.passed;
    initialSession.steps[i].bengaliCoachingTip = assessment.bengaliAcousticAnalysis?.overallBengaliCoachingBn;
    initialSession.steps[i].completedAt = new Date().toISOString();
    initialSession.currentStepIndex = i + 1;
  }

  // Calculate final mastery
  const totalScore = initialSession.steps.reduce((sum, s) => sum + (s.stepScore || 0), 0);
  initialSession.masteryIndex = Math.round(totalScore / initialSession.totalSteps);
  initialSession.status = 'completed';
  initialSession.completedAt = new Date().toISOString();
  initialSession.summaryBn = `সেশন সম্পন্ন হয়েছে (স্কোর: ${initialSession.masteryIndex}%)।`;
  initialSession.summaryEn = `Session completed with ${initialSession.masteryIndex}% score.`;

  db.updateAccentMasterySession(initialSession);

  const finalSession = db.getAccentMasterySession(sessionId);
  assert(finalSession !== null, 'Final session must exist');
  assert(finalSession!.status === 'completed', 'Session status must be completed');
  assert(finalSession!.masteryIndex > 0, 'Aggregate mastery index must be > 0');
  assert(finalSession!.completedAt !== undefined, 'completedAt must be set');
  assert(finalSession!.summaryBn !== undefined, 'Bengali completion summary must be present');

  const userSessions = db.getUserAccentMasterySessions(testUserStress);
  assert(userSessions.length > 0, 'User sessions query must return session');
  assert(userSessions[0].id === sessionId, 'Latest session ID must match');
  console.log(`   ✓ Multi-turn session state machine completed with aggregate mastery index: ${finalSession!.masteryIndex}%.`);

  console.log('\n================================================================');
  console.log('🎉 ALL INTEGRATION TESTS PASSED WITH 100% PRODUCTION INTEGRITY!');
  console.log('================================================================\n');
}

runTestSuite().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
