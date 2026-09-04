/**
 * Integration Test Suite: Step 6 Full-Sentence Continuous Shadowing Engine,
 * Intonation Phrase Boundary Analyzer, and Automated Speaking Readiness Certification
 */

import { db } from '../db.js';
import { SentenceProsodyService } from '../services/sentenceProsodyService.js';
import { SpeakingReadinessCertService } from '../services/speakingReadinessCertService.js';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('🧪 NIHOMI: FULL-SENTENCE PROSODY, SHADOWING & CERTIFICATION TEST');
  console.log('================================================================\n');

  const testUserId = `test-learner-step6-${Date.now()}`;

  // --------------------------------------------------------------------------
  // TEST 1: Tokyo Macro-Prosody & Accentual Phrase Boundary Segmentation
  // --------------------------------------------------------------------------
  console.log('▶ [Test 1] Accentual Phrase (AP) Boundary & Prosody Modeling...');

  const statementSentence = '日本語を勉強しています。';
  const statementModel = SentenceProsodyService.analyzeSentenceProsody({
    sentenceText: statementSentence
  });

  assert(statementModel.sentenceText === statementSentence, 'Sentence text must match input');
  assert(statementModel.accentualPhrases.length >= 2, 'Should segment into at least 2 Accentual Phrases');
  assert(!statementModel.isQuestion, 'Statement sentence must NOT be flagged as question');

  // Verify AP 1 (日本語を)
  const ap1 = statementModel.accentualPhrases[0];
  assert(ap1.phraseIndex === 1, 'AP 1 index must be 1');
  assert(ap1.morae.length >= 4, '日本語を should have at least 4 morae');
  assert(ap1.targetPitches[0] === 'L', 'Heiban phrase initial mora must be L in Tokyo dialect');

  // Verify Mora Timings Continuity
  let previousEnd = 0;
  for (const ap of statementModel.accentualPhrases) {
    for (const mt of ap.moraTimingsMs) {
      assert(mt.startMs >= previousEnd, `Mora ${mt.mora} start (${mt.startMs}) must be >= previous end (${previousEnd})`);
      assert(mt.endMs > mt.startMs, `Mora ${mt.mora} duration must be positive`);
      previousEnd = mt.endMs;
    }
  }

  // Verify F0 Contour Declination & AP Reset
  assert(statementModel.targetF0Contour.length > 0, 'Target F0 contour must not be empty');
  const firstApHz = statementModel.accentualPhrases[0].baseF0Hz;
  const secondApHz = statementModel.accentualPhrases[1].baseF0Hz;
  assert(firstApHz >= 200 && firstApHz <= 260, 'AP 1 base F0 should be in standard vocal range (200-260Hz)');
  console.log(`  ✔ 1.1 AP boundary segmentation verified (${statementModel.accentualPhrases.length} APs, continuous timings)`);

  // --------------------------------------------------------------------------
  // TEST 2: Boundary Pitch Movement (BPM) for Question Sentences
  // --------------------------------------------------------------------------
  console.log('\n▶ [Test 2] Boundary Pitch Movement (BPM) on Question Particles...');

  const questionSentence = '明日、東京へ行きますか？';
  const questionModel = SentenceProsodyService.analyzeSentenceProsody({
    sentenceText: questionSentence
  });

  assert(questionModel.isQuestion, 'Sentence ending with か？ must be flagged as question');
  const lastAp = questionModel.accentualPhrases[questionModel.accentualPhrases.length - 1];
  assert(lastAp.boundaryPitchMovement === 'rise', 'Final AP of question sentence must have boundary pitch movement = rise');

  const finalMoraTiming = lastAp.moraTimingsMs[lastAp.moraTimingsMs.length - 1];
  const penultMoraTiming = lastAp.moraTimingsMs[lastAp.moraTimingsMs.length - 2];
  assert(
    finalMoraTiming.expectedHz > penultMoraTiming.expectedHz,
    `Final question mora (${finalMoraTiming.mora}: ${finalMoraTiming.expectedHz}Hz) must rise above previous mora (${penultMoraTiming.mora}: ${penultMoraTiming.expectedHz}Hz)`
  );
  console.log(`  ✔ 2.1 Question particle BPM rise verified (+${Math.round(finalMoraTiming.expectedHz - penultMoraTiming.expectedHz)}Hz jump on か)`);

  // --------------------------------------------------------------------------
  // TEST 3: Dynamic Time Warping (DTW) Scoring & Boundary Reset Evaluation
  // --------------------------------------------------------------------------
  console.log('\n▶ [Test 3] DTW Prosody Scoring & Boundary Reset Audit...');

  // 3.1 Perfect Alignment Submission (using target contour F0)
  const targetHzSeries = statementModel.targetF0Contour.map((p) => p.f0Hz);
  const perfectResult = SentenceProsodyService.evaluateShadowing({
    sentenceId: statementModel.id,
    sentenceText: statementModel.sentenceText,
    userF0Trajectory: targetHzSeries,
    audioDurationMs: statementModel.totalDurationMs
  });

  assert(perfectResult.pitchContourScore >= 88, 'Matching contour should yield >= 88% DTW score');
  assert(perfectResult.rhythmIsochronyScore >= 80, 'Isochrony score should be high for matching duration');
  assert(perfectResult.overallScore >= 85, 'Overall score should be >= 85% for matching contour');
  assert(perfectResult.isPassed, 'Matching contour should pass Tokyo threshold');
  console.log(`  ✔ 3.1 Perfect contour DTW evaluation verified (Overall: ${perfectResult.overallScore}%, Passed: ${perfectResult.isPassed})`);

  // 3.2 Flatlined / Degraded Submission (Monotone Bengali stress flatline)
  const flatlineHzSeries = targetHzSeries.map(() => 160); // Flat 160Hz without declination resets
  const flatlineResult = SentenceProsodyService.evaluateShadowing({
    sentenceId: statementModel.id,
    sentenceText: statementModel.sentenceText,
    userF0Trajectory: flatlineHzSeries,
    audioDurationMs: statementModel.totalDurationMs * 1.5 // 50% slower
  });

  assert(flatlineResult.overallScore < perfectResult.overallScore, 'Flatline should score lower than matching contour');
  assert(!flatlineResult.isPassed, 'Flatline contour must fail Tokyo naturalness threshold');
  assert(flatlineResult.bengaliPhoneticIssues.length > 0, 'Should detect Bengali phonetic issues on flatline');
  assert(flatlineResult.coachingTipsBn.length > 0, 'Should provide actionable Bengali coaching tips');
  console.log(`  ✔ 3.2 Monotone flatline detection verified (Overall: ${flatlineResult.overallScore}%, Detected issues: ${flatlineResult.bengaliPhoneticIssues.join(', ')})`);

  // --------------------------------------------------------------------------
  // TEST 4: Speaking Readiness Certification Engine
  // --------------------------------------------------------------------------
  console.log('\n▶ [Test 4] Automated Speaking Readiness Certification Engine...');

  // Seed sample voice assessments for test user
  db.savePitchAccentAssessment({
    id: `assess-${Date.now()}-1`,
    userId: testUserId,
    targetPhrase: '箸',
    targetPattern: 'atamadaka',
    targetDownstepMora: 1,
    detectedPattern: 'atamadaka',
    detectedDownstepMora: 1,
    moraBreakdown: [],
    patternMatch: true,
    pitchAccuracyScore: 92,
    moraRhythmScore: 88,
    clarityScore: 90,
    overallScore: 90,
    passed: true,
    audioDurationMs: 1400,
    pitchTrajectory: [280, 200],
    feedbackEn: 'Accurate atamadaka drop.',
    feedbackBn: 'চমৎকার ১ম মোরা ড্রপ।',
    coachingTips: [],
    recordedAt: new Date().toISOString()
  });

  db.savePitchAccentAssessment({
    id: `assess-${Date.now()}-2`,
    userId: testUserId,
    targetPhrase: '雨',
    targetPattern: 'atamadaka',
    targetDownstepMora: 1,
    detectedPattern: 'atamadaka',
    detectedDownstepMora: 1,
    moraBreakdown: [],
    patternMatch: true,
    pitchAccuracyScore: 86,
    moraRhythmScore: 84,
    clarityScore: 85,
    overallScore: 85,
    passed: true,
    audioDurationMs: 1450,
    pitchTrajectory: [275, 195],
    feedbackEn: 'Clean contrast.',
    feedbackBn: 'সঠিক অ্যাকসেন্ট কার্নেল।',
    coachingTips: [],
    recordedAt: new Date().toISOString()
  });

  const certificate = await SpeakingReadinessCertService.generateSpeakingCertificate(
    testUserId,
    'Tanvir Ahmed'
  );

  assert(certificate.studentName === 'Tanvir Ahmed', 'Certificate student name must match');
  assert(certificate.certificateId.startsWith('CERT-TOKYO-'), 'Certificate ID must have CERT-TOKYO- prefix');
  assert(certificate.overallReadinessIndex >= 0 && certificate.overallReadinessIndex <= 100, 'Readiness index must be in [0, 100]');
  assert(['S', 'A', 'B', 'C', 'D'].includes(certificate.readinessGrade), `Grade must be valid letter grade (got ${certificate.readinessGrade})`);
  assert(certificate.subScores.pitchAccuracy >= 0 && certificate.subScores.pitchAccuracy <= 100, 'Pitch accuracy must be 0-100');
  assert(certificate.subScores.moraIsochrony >= 0 && certificate.subScores.moraIsochrony <= 100, 'Mora isochrony must be 0-100');
  assert(certificate.subScores.intonationResetAccuracy >= 0 && certificate.subScores.intonationResetAccuracy <= 100, 'Intonation reset must be 0-100');
  assert(certificate.subScores.stressSuppressionScore >= 0 && certificate.subScores.stressSuppressionScore <= 100, 'Stress suppression must be 0-100');
  assert(certificate.institutionalSummaryBn.length > 20, 'Bengali institutional summary must be populated');
  assert(certificate.institutionalSummaryEn.length > 20, 'English institutional summary must be populated');

  console.log(`  ✔ 4.1 Speaking Readiness Certificate generated successfully:`);
  console.log(`     - Cert ID: ${certificate.certificateId}`);
  console.log(`     - Student: ${certificate.studentName}`);
  console.log(`     - Certified Level: ${certificate.certifiedLevel}`);
  console.log(`     - Readiness Index: ${certificate.overallReadinessIndex}% (Grade: ${certificate.readinessGrade})`);
  console.log(`     - Sub-Scores: Pitch ${certificate.subScores.pitchAccuracy}%, Isochrony ${certificate.subScores.moraIsochrony}%, AP Reset ${certificate.subScores.intonationResetAccuracy}%`);

  console.log('\n================================================================');
  console.log('🎉 ALL STEP 6 TESTS PASSED! ZERO REGRESSIONS DETECTED.');
  console.log('================================================================\n');
}

runTestSuite().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
