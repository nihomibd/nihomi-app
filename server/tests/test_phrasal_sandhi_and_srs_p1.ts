/**
 * Integration Test Suite: Step 5 Phrasal Particle Sandhi Engine,
 * Accent-Specific Spaced Repetition (SRS), and Autonomous Student Audit Generator
 */

import { db } from '../db.js';
import { PhrasalAccentService } from '../services/phrasalAccentService.js';
import { AccentSRSService } from '../services/accentSRSService.js';
import { SenseiAuditReportService } from '../services/senseiAuditReportService.js';
import { TokyoPitchAccentAssessment } from '../types.js';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('🧪 NIHOMI: PHRASAL SANDHI, ACCENT SRS & SENSEI AUDIT TEST SUITE');
  console.log('================================================================\n');

  const testUserId = `test-learner-step5-${Date.now()}`;

  // --------------------------------------------------------------------------
  // TEST 1: Phrasal Accent & Particle Sandhi Concatenation Rules
  // --------------------------------------------------------------------------
  console.log('▶ [Test 1] Phrasal Accent & Particle Sandhi Rules...');

  // 1.1 平板 (Heiban ⓪): Word はな (花 - Flower) + が -> L-H + H = L-H-H, downstep 0
  const heibanPreview = PhrasalAccentService.computePhrasalPitchContour({
    word: '花',
    readingKana: 'はな',
    romaji: 'hana',
    pattern: 'heiban',
    downstepMora: 0,
    particle: 'が',
    meaningEn: 'Flower',
    meaningBn: 'ফুল'
  });

  assert(heibanPreview.phraseKana === 'はなが', 'Phrase kana should be はなが');
  assert(heibanPreview.totalMoraCount === 3, 'Total morae should be 3 (は, な, が)');
  assert(heibanPreview.targetPitches[0] === 'L', 'Heiban mora 1 should be L');
  assert(heibanPreview.targetPitches[1] === 'H', 'Heiban mora 2 should be H');
  assert(heibanPreview.targetPitches[2] === 'H', 'Particle が attached to Heiban must remain H');
  assert(heibanPreview.downstepMora === 0, 'Heiban phrase downstep locus must be 0');
  assert(!heibanPreview.hasDownstepAtParticleBoundary, 'Heiban must NOT have boundary drop');
  assert(heibanPreview.sandhiRule === 'heiban_high_propagation', 'Rule must be heiban_high_propagation');
  console.log('  ✔ 1.1 Heiban high-pitch propagation verified (L-H-H, downstep=0)');

  // 1.2 尾高 (Odaka): Word はな (鼻 - Nose) + が -> L-H + L = L-H-L, downstep 2, boundary drop = true
  const odakaPreview = PhrasalAccentService.computePhrasalPitchContour({
    word: '鼻',
    readingKana: 'はな',
    romaji: 'hana',
    pattern: 'odaka',
    downstepMora: 2,
    particle: 'が',
    meaningEn: 'Nose',
    meaningBn: 'নাক'
  });

  assert(odakaPreview.phraseKana === 'はなが', 'Odaka phrase kana should be はなが');
  assert(odakaPreview.targetPitches[0] === 'L', 'Odaka mora 1 should be L');
  assert(odakaPreview.targetPitches[1] === 'H', 'Odaka mora 2 should be H');
  assert(odakaPreview.targetPitches[2] === 'L', 'Particle が attached to Odaka MUST drop to L');
  assert(odakaPreview.downstepMora === 2, 'Odaka downstep locus is on mora 2');
  assert(odakaPreview.hasDownstepAtParticleBoundary === true, 'Odaka must have boundary drop right at particle boundary');
  assert(odakaPreview.sandhiRule === 'odaka_boundary_drop', 'Rule must be odaka_boundary_drop');
  console.log('  ✔ 1.2 Odaka boundary drop verified (L-H-L, boundary drop=true, downstep=2)');

  // 1.3 頭高 (Atamadaka ①): Word はし (箸 - Chopsticks) + が -> H-L + L = H-L-L, downstep 1
  const atamadakaPreview = PhrasalAccentService.computePhrasalPitchContour({
    word: '箸',
    readingKana: 'はし',
    romaji: 'hashi',
    pattern: 'atamadaka',
    downstepMora: 1,
    particle: 'が',
    meaningEn: 'Chopsticks',
    meaningBn: 'চপস্টিক'
  });

  assert(atamadakaPreview.targetPitches[0] === 'H', 'Atamadaka mora 1 should be H');
  assert(atamadakaPreview.targetPitches[1] === 'L', 'Atamadaka mora 2 should be L');
  assert(atamadakaPreview.targetPitches[2] === 'L', 'Particle が attached to Atamadaka must remain L');
  assert(atamadakaPreview.downstepMora === 1, 'Atamadaka downstep locus must be 1');
  assert(!atamadakaPreview.hasDownstepAtParticleBoundary, 'Boundary drop is false for Atamadaka (drop occurs inside word)');
  console.log('  ✔ 1.3 Atamadaka catathesis propagation verified (H-L-L, downstep=1)');

  // 1.4 Multi-mora particle: Word にほん (日本 - Japan, Heiban) + から (from) -> L-H-H-H-H
  const multiMoraPreview = PhrasalAccentService.computePhrasalPitchContour({
    word: '日本',
    readingKana: 'にほん',
    romaji: 'nihon',
    pattern: 'heiban',
    downstepMora: 0,
    particle: 'から',
    meaningEn: 'Japan',
    meaningBn: 'জাপান'
  });

  assert(multiMoraPreview.wordMoraCount === 3, 'Word にほん is 3 morae (に, ほ, ん)');
  assert(multiMoraPreview.particleMoraCount === 2, 'Particle から is 2 morae (か, ら)');
  assert(multiMoraPreview.totalMoraCount === 5, 'Total morae must be 5');
  assert(multiMoraPreview.targetPitches.join('') === 'LHHHH', 'Target pitches must be LHHHH for heiban + から');
  console.log('  ✔ 1.4 Multi-mora particle (から) sandhi verified (LHHHH)');

  // --------------------------------------------------------------------------
  // TEST 2: Accent-Specific Spaced Repetition (SRS) Engine
  // --------------------------------------------------------------------------
  console.log('\n▶ [Test 2] Accent-Specific Spaced Repetition (SRS) Engine...');

  // 2.1 Initialize new SRS card
  const newCard = await AccentSRSService.initializeCard(
    testUserId,
    'drill-hashi-odaka',
    '橋',
    'はし',
    'odaka',
    2,
    'hashi',
    'সেতু',
    'Bridge',
    'minimal_pair'
  );

  assert(newCard.id.startsWith('asrs-'), 'Card ID must be generated');
  assert(newCard.stabilityDays === 1.0, 'Initial stability should be 1.0 days');
  assert(newCard.difficulty === 0.45, 'Initial difficulty should be 0.45');
  assert(newCard.stage === 'apprentice', 'Initial stage should be apprentice');
  assert(newCard.intervalHours === 0, 'New card should be immediately due (interval 0)');
  console.log('  ✔ 2.1 Initialized new Accent SRS card successfully');

  // 2.2 Review successful evaluation without dynamic stress (Good - Grade 3)
  const goodAssessment: TokyoPitchAccentAssessment = {
    id: `assess-${Date.now()}`,
    userId: testUserId,
    targetPhrase: '橋',
    targetRomaji: 'hashi',
    targetMeaning: 'Bridge',
    targetPattern: 'odaka',
    targetDownstepMora: 2,
    detectedPattern: 'odaka',
    detectedDownstepMora: 2,
    moraBreakdown: [
      { moraIndex: 1, mora: 'は', targetPitch: 'L', detectedPitch: 'L', isMatch: true },
      { moraIndex: 2, mora: 'し', targetPitch: 'H', detectedPitch: 'H', isDropPoint: true, isMatch: true }
    ],
    overallScore: 88,
    pitchAccuracyScore: 92,
    moraRhythmScore: 86,
    clarityScore: 85,
    passed: true,
    patternMatch: true,
    audioDurationMs: 1200,
    averageF0Hz: 230,
    pitchTrajectory: [200, 290, 210],
    feedbackEn: 'Pitch contour accurate',
    feedbackBn: 'সঠিক টোকিও পিচ অ্যাকসেন্ট',
    coachingTips: [],
    recordedAt: new Date().toISOString()
  };

  const review1 = await AccentSRSService.processReview({
    cardId: newCard.id,
    drillId: newCard.drillId,
    assessment: goodAssessment
  });

  assert(review1.card.repetition === 1, 'Repetition count should increment to 1');
  assert(review1.card.stabilityDays > 1.0, 'Stability days should increase after good review');
  assert(review1.card.intervalHours > 0, 'Interval hours should be greater than 0');
  console.log(`  ✔ 2.2 Good review processed: stability=${review1.card.stabilityDays.toFixed(2)}d, interval=${review1.card.intervalHours}h`);

  // 2.3 Acoustic Risk Adjustment: Simulate dynamic stress failure (volume spike without pitch drop)
  const stressAssessment: TokyoPitchAccentAssessment = {
    id: `assess-stress-${Date.now()}`,
    userId: testUserId,
    targetPhrase: '橋',
    targetRomaji: 'hashi',
    targetMeaning: 'Bridge',
    targetPattern: 'odaka',
    targetDownstepMora: 2,
    detectedPattern: 'heiban',
    detectedDownstepMora: 0,
    moraBreakdown: [
      { moraIndex: 1, mora: 'は', targetPitch: 'L', detectedPitch: 'H', isMatch: false },
      { moraIndex: 2, mora: 'し', targetPitch: 'H', detectedPitch: 'H', isDropPoint: true, isMatch: false }
    ],
    overallScore: 55,
    pitchAccuracyScore: 48,
    moraRhythmScore: 60,
    clarityScore: 70,
    passed: false,
    patternMatch: false,
    audioDurationMs: 1400,
    averageF0Hz: 250,
    pitchTrajectory: [220, 240, 250],
    feedbackEn: 'Dynamic stress detected on particle',
    feedbackBn: 'বাংলা স্ট্রেস ট্রান্সফার ত্রুটি',
    coachingTips: ['ভলিউম না বাড়িয়ে সুর নিচে নামান'],
    recordedAt: new Date().toISOString()
  };

  const review2 = await AccentSRSService.processReview({
    cardId: newCard.id,
    drillId: newCard.drillId,
    assessment: stressAssessment,
    hasDynamicStressError: true
  });

  assert(review2.card.lapses === 1, 'Lapse count should increment to 1');
  assert(review2.card.chronicDynamicStressCount === 1, 'Chronic dynamic stress count should be 1');
  assert(review2.card.acousticRiskLevel === 'medium' || review2.card.acousticRiskLevel === 'high', 'Acoustic risk level should be flagged');
  assert(review2.card.difficulty > review1.card.difficulty, 'Difficulty should increase due to dynamic stress penalty');
  console.log(`  ✔ 2.3 Dynamic stress penalty applied: lapses=${review2.card.lapses}, difficulty=${review2.card.difficulty.toFixed(2)}, risk=${review2.card.acousticRiskLevel}`);

  // 2.4 Query due reviews & summary
  const srsQuery = await AccentSRSService.getDueReviews(testUserId);
  assert(typeof srsQuery.summary.totalDue === 'number', 'Summary should include totalDue count');
  assert(typeof srsQuery.summary.highAcousticRiskCount === 'number', 'Summary should include highAcousticRiskCount');
  console.log(`  ✔ 2.4 Due review query verified: totalDue=${srsQuery.summary.totalDue}, highRisk=${srsQuery.summary.highAcousticRiskCount}`);

  // --------------------------------------------------------------------------
  // TEST 3: Autonomous Sensei Diagnostic Telemetry & Audit Report Generator
  // --------------------------------------------------------------------------
  console.log('\n▶ [Test 3] Autonomous Sensei Diagnostic Audit Generator...');

  // 3.1 Seed 6 diverse assessments for user
  const patterns = ['heiban', 'odaka', 'atamadaka', 'nakadaka', 'heiban', 'odaka'] as const;
  for (let i = 0; i < patterns.length; i++) {
    const pat = patterns[i];
    const score = i === 1 ? 62 : i === 5 ? 68 : 86 + i;
    const a: TokyoPitchAccentAssessment = {
      id: `audit-assess-${i}-${Date.now()}`,
      userId: testUserId,
      targetPhrase: pat === 'odaka' ? '橋' : pat === 'atamadaka' ? '箸' : pat === 'nakadaka' ? '卵' : '花',
      targetRomaji: 'kotoba',
      targetMeaning: 'Word',
      targetPattern: pat,
      targetDownstepMora: pat === 'heiban' ? 0 : pat === 'atamadaka' ? 1 : 2,
      detectedPattern: pat,
      detectedDownstepMora: pat === 'heiban' ? 0 : pat === 'atamadaka' ? 1 : 2,
      moraBreakdown: [
        { moraIndex: 1, mora: 'こ', targetPitch: 'L', detectedPitch: 'L', isMatch: true },
        { moraIndex: 2, mora: 'と', targetPitch: 'H', detectedPitch: 'H', isMatch: true }
      ],
      overallScore: score,
      pitchAccuracyScore: score,
      moraRhythmScore: 84,
      clarityScore: 88,
      passed: score >= 70,
      patternMatch: score >= 75,
      audioDurationMs: 1250,
      averageF0Hz: 230,
      pitchTrajectory: [210, 280, 210],
      feedbackEn: 'Audit test assessment',
      feedbackBn: 'অডিট টেস্ট মূল্যায়ন',
      coachingTips: [],
      recordedAt: new Date(Date.now() - (i * 24 * 3600 * 1000)).toISOString()
    };
    await db.savePitchAccentAssessment(a);
  }

  // 3.2 Generate Sensei Diagnostic Report for past 30 days
  const report = await SenseiAuditReportService.generateReport(testUserId, 30);

  assert(report.studentId === testUserId, 'Report student ID must match');
  assert(report.evaluationsAnalyzed >= 6, 'Should analyze at least 6 evaluations');
  assert(report.readinessScore > 0 && report.readinessScore <= 100, 'Readiness score must be between 0 and 100');
  assert(['S', 'A', 'B', 'C', 'D'].includes(report.readinessGrade), `Readiness grade must be valid letter grade (was ${report.readinessGrade})`);
  assert(report.readinessGradeTitleBn.length > 0, 'Bengali readiness title must not be empty');
  assert(typeof report.moraConsistencyIndex === 'number', 'Mora consistency index must be a number');
  assert(report.patternMastery.heiban.evaluationsCount > 0, 'Heiban evaluations count should be > 0');
  assert(report.patternMastery.odaka.evaluationsCount > 0, 'Odaka evaluations count should be > 0');
  assert(report.highRiskInterferenceAreas.length > 0, 'Must produce actionable high-risk interference areas');
  assert(report.institutionalTeacherSummaryBn.includes('স্কোর') || report.institutionalTeacherSummaryBn.length > 20, 'Bengali institutional summary must be rich');
  assert(report.institutionalTeacherSummaryEn.length > 20, 'English institutional summary must be rich');

  console.log(`  ✔ 3.1 Sensei report generated: Grade=${report.readinessGrade} (${report.readinessScore}/100), Title="${report.readinessGradeTitleBn}"`);
  console.log(`  ✔ 3.2 Chronic interference: stressTransfer=${report.chronicInterferenceMetrics.dynamicStressTransferRate}%, moraFlattening=${report.chronicInterferenceMetrics.moraFlatteningRate}%`);
  console.log(`  ✔ 3.3 Actionable clinical areas generated: ${report.highRiskInterferenceAreas.length} area(s) identified`);
  console.log(`  ✔ 3.4 Institutional teacher summary:\n      "${report.institutionalTeacherSummaryBn.slice(0, 100)}..."`);

  console.log('\n================================================================');
  console.log('🎉 ALL STEP 5 INTEGRATION TESTS PASSED WITH 100% INTEGRITY!');
  console.log('================================================================\n');
}

runTestSuite().catch((err) => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
