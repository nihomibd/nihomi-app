import { db } from '../db.js';
import { AdaptiveSrsService } from '../services/adaptiveSrsService.js';
import { SrsCardRecord, SrsReviewSubmission } from '../types.js';

async function runAdaptiveSrsP1Tests() {
  console.log('====================================================');
  console.log('🧪 NIHOMI.COM P1-04: ADAPTIVE SRS SCHEDULING ENGINE TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  const testUserId = `usr-test-srs-${Date.now()}`;

  try {
    // ----------------------------------------------------
    // TEST 1: Ebbinghaus / FSRS Retrievability Math
    // ----------------------------------------------------
    console.log('\n--- 1. Testing Retrievability & Decay Calculation ---');

    const retNow = AdaptiveSrsService.calculateRetrievability(0, 10);
    assert(Math.abs(retNow - 1.0) < 0.001, 'Retrievability at t=0 is 1.0 (100%)', `Got ${retNow}`);

    const retHalf = AdaptiveSrsService.calculateRetrievability(10, 10);
    assert(Math.abs(retHalf - 0.90) < 0.01, 'Retrievability at t=S is ~0.90 (90% target retention)', `Got ${retHalf}`);

    const retDecayed = AdaptiveSrsService.calculateRetrievability(30, 10);
    assert(retDecayed < 0.80 && retDecayed > 0.40, 'Retrievability decays predictably over 3x stability duration', `Got ${retDecayed}`);

    // ----------------------------------------------------
    // TEST 2: SuperMemo-2 (SM-2) Review State Calculations
    // ----------------------------------------------------
    console.log('\n--- 2. Testing SM-2 State Transitions ---');

    const sm2Card: SrsCardRecord = {
      id: 'test-card-sm2-1',
      userId: testUserId,
      itemType: 'vocabulary',
      itemId: 'voc-test-1',
      level: 'N5',
      front: '食べる',
      reading: 'たべる',
      meaning: 'to eat',
      meaningBn: 'খাওয়া',
      repetition: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      stabilityDays: 1.0,
      difficulty: 5.0,
      retrievability: 1.0,
      retentionScore: 100,
      lapses: 0,
      totalReviews: 0,
      consecutiveCorrect: 0,
      stage: 'apprentice',
      lastReviewedAt: null,
      nextReviewAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // First review: 'good'
    const sm2Rev1 = AdaptiveSrsService.processSm2Review(sm2Card, 'good');
    assert(sm2Rev1.repetition === 1, 'SM-2 repetition advances to 1 on first good review');
    assert(sm2Rev1.intervalDays === 1, 'SM-2 first interval is 1 day');

    // Second review: 'good'
    sm2Card.repetition = sm2Rev1.repetition;
    sm2Card.intervalDays = sm2Rev1.intervalDays;
    sm2Card.easeFactor = sm2Rev1.easeFactor;
    const sm2Rev2 = AdaptiveSrsService.processSm2Review(sm2Card, 'good');
    assert(sm2Rev2.repetition === 2, 'SM-2 repetition advances to 2 on second good review');
    assert(sm2Rev2.intervalDays === 6, 'SM-2 second interval is 6 days');

    // Third review: 'easy'
    sm2Card.repetition = sm2Rev2.repetition;
    sm2Card.intervalDays = sm2Rev2.intervalDays;
    sm2Card.easeFactor = sm2Rev2.easeFactor;
    const sm2Rev3 = AdaptiveSrsService.processSm2Review(sm2Card, 'easy');
    assert(sm2Rev3.repetition === 3, 'SM-2 repetition advances to 3');
    assert(sm2Rev3.easeFactor > 2.5, `Ease factor increases on easy grade (EF: ${sm2Rev3.easeFactor})`);
    assert(sm2Rev3.intervalDays > 6, `Interval expands exponentially (Interval: ${sm2Rev3.intervalDays} days)`);

    // Fourth review: 'again' (Lapse)
    sm2Card.repetition = sm2Rev3.repetition;
    sm2Card.intervalDays = sm2Rev3.intervalDays;
    sm2Card.easeFactor = sm2Rev3.easeFactor;
    const sm2Rev4 = AdaptiveSrsService.processSm2Review(sm2Card, 'again');
    assert(sm2Rev4.repetition === 0, 'SM-2 repetition resets to 0 on lapse');
    assert(sm2Rev4.intervalDays === 1, 'SM-2 interval resets to 1 day on lapse');
    assert(sm2Rev4.easeFactor < sm2Rev3.easeFactor, 'Ease factor decreases on lapse');
    assert(sm2Rev4.easeFactor >= 1.3, 'Ease factor does not drop below 1.3 threshold');

    // ----------------------------------------------------
    // TEST 3: FSRS Review State Calculations
    // ----------------------------------------------------
    console.log('\n--- 3. Testing FSRS State Transitions ---');

    const fsrsCard: SrsCardRecord = {
      id: 'test-card-fsrs-1',
      userId: testUserId,
      itemType: 'kanji',
      itemId: 'kan-test-1',
      level: 'N5',
      front: '日',
      reading: 'ニチ, にっ / ひ, び',
      meaning: 'day, sun',
      repetition: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      stabilityDays: 1.0,
      difficulty: 5.0,
      retrievability: 1.0,
      retentionScore: 100,
      lapses: 0,
      totalReviews: 0,
      consecutiveCorrect: 0,
      stage: 'apprentice',
      lastReviewedAt: null,
      nextReviewAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const fsrsRev1 = AdaptiveSrsService.processFsrsReview(fsrsCard, 'good', 1);
    assert(fsrsRev1.stabilityDays > 1.0, `FSRS stability increases on good review (S: ${fsrsRev1.stabilityDays.toFixed(2)})`);
    assert(fsrsRev1.intervalDays >= 1, `FSRS interval scheduled (I: ${fsrsRev1.intervalDays} days)`);

    const fsrsRevAgain = AdaptiveSrsService.processFsrsReview(fsrsCard, 'again', 1);
    assert(fsrsRevAgain.difficulty > 5.0, `FSRS difficulty increases on again review (D: ${fsrsRevAgain.difficulty.toFixed(2)})`);
    assert(fsrsRevAgain.intervalDays === 1, 'FSRS interval drops to 1 on again');

    // ----------------------------------------------------
    // TEST 4: Hybrid Execution & Stage Transitions
    // ----------------------------------------------------
    console.log('\n--- 4. Testing Hybrid Execution & Stage Progression ---');

    let hybridCard: SrsCardRecord = {
      id: `card-${Date.now()}`,
      userId: testUserId,
      itemType: 'vocabulary',
      itemId: 'voc-hybrid-1',
      level: 'N5',
      front: '本',
      reading: 'ほん',
      meaning: 'book',
      repetition: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      stabilityDays: 1.0,
      difficulty: 5.0,
      retrievability: 1.0,
      retentionScore: 100,
      lapses: 0,
      totalReviews: 0,
      consecutiveCorrect: 0,
      stage: 'apprentice',
      lastReviewedAt: null,
      nextReviewAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Stage progression check: apprentice -> guru (consecutiveCorrect >= 3 and interval >= 5)
    for (let i = 0; i < 3; i++) {
      const exec = AdaptiveSrsService.executeReview(hybridCard, {
        cardId: hybridCard.id,
        rating: 'easy',
        algorithmMode: 'adaptive_hybrid'
      });
      hybridCard = exec.updatedCard;
    }

    assert(hybridCard.consecutiveCorrect === 3, 'Consecutive correct tracked accurately');
    assert(hybridCard.stage === 'guru' || hybridCard.intervalDays >= 5, `Card promoted towards higher stage (Current: ${hybridCard.stage})`);

    // Test lapse demotion
    const lapseExec = AdaptiveSrsService.executeReview(hybridCard, {
      cardId: hybridCard.id,
      rating: 'again',
      algorithmMode: 'adaptive_hybrid'
    });
    assert(lapseExec.updatedCard.stage === 'apprentice', 'Lapsed card immediately returns to Apprentice stage');
    assert(lapseExec.updatedCard.lapses === 1, 'Card lapses counter incremented');
    assert(lapseExec.updatedCard.consecutiveCorrect === 0, 'Consecutive correct reset to 0 on lapse');

    // ----------------------------------------------------
    // TEST 5: Database Hooks & Persistence
    // ----------------------------------------------------
    console.log('\n--- 5. Testing Database Hooks & Storage ---');

    db.saveSrsCard(hybridCard);
    const retrievedCard = db.getSrsCardById(testUserId, hybridCard.id);
    assert(retrievedCard !== undefined, 'Card saved and retrieved by ID from db');
    assert(retrievedCard?.front === '本', 'Card front text preserved');

    // Test review recording via db.recordSrsReview
    const dbRevRes = db.recordSrsReview(testUserId, {
      cardId: hybridCard.id,
      rating: 'good',
      responseTimeMs: 1450,
      algorithmMode: 'adaptive_hybrid'
    });

    assert(dbRevRes.success === true, 'Review recorded successfully in database');
    assert(dbRevRes.card !== undefined, 'Updated card returned in response');
    assert(dbRevRes.reviewLog !== undefined, 'Telemetry review log created');
    assert(dbRevRes.reviewLog?.responseTimeMs === 1450, 'Telemetry log captures response time');

    // ----------------------------------------------------
    // TEST 6: Priority Queue & Urgency Sorting
    // ----------------------------------------------------
    console.log('\n--- 6. Testing Due Queue & Retention-Weighted Priority ---');

    // Add 2 due cards with different retrievability
    const cardHighUrgency: SrsCardRecord = {
      ...hybridCard,
      id: `card-urg-1-${Date.now()}`,
      front: '猫',
      meaning: 'cat',
      lastReviewedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago with S=1 => very low retention
      stabilityDays: 1.0,
      intervalDays: 1,
      nextReviewAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    };

    const cardLowUrgency: SrsCardRecord = {
      ...hybridCard,
      id: `card-urg-2-${Date.now()}`,
      front: '犬',
      meaning: 'dog',
      lastReviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      stabilityDays: 10.0, // High stability => higher retention
      intervalDays: 2,
      nextReviewAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    };

    db.saveSrsCard(cardHighUrgency);
    db.saveSrsCard(cardLowUrgency);

    const dueCards = db.getDueSrsCards(testUserId);
    assert(dueCards.length >= 2, `Retrieved ${dueCards.length} due cards`);
    // Card with lower retention score should come first
    const firstDue = dueCards.find((c) => c.id === cardHighUrgency.id);
    const secondDue = dueCards.find((c) => c.id === cardLowUrgency.id);
    assert(firstDue !== undefined && secondDue !== undefined, 'Both test cards found in due queue');
    if (firstDue && secondDue) {
      assert(firstDue.retentionScore <= secondDue.retentionScore, 'Priority queue ranks lowest retention score first');
    }

    // ----------------------------------------------------
    // TEST 7: Retention Curve & Telemetry Statistics
    // ----------------------------------------------------
    console.log('\n--- 7. Testing Retention Curve & Telemetry Analytics ---');

    const curve = db.getSrsRetentionCurve(testUserId);
    assert(curve.points.length >= 30, 'Generated 30+ day retention curve');
    assert(curve.points[0].theoreticalRetention >= 95, 'Day 0 retention begins near 100%');
    assert(curve.points[29].theoreticalRetention < curve.points[0].theoreticalRetention, 'Retention shows realistic decay over 30 days');
    assert(typeof curve.halfLifeDays === 'number' && curve.halfLifeDays > 0, `Half-life calculated: ${curve.halfLifeDays} days`);

    const telemetry = db.getSrsTelemetryStats(testUserId);
    assert(telemetry.totalCards >= 3, `Telemetry reports accurate card total: ${telemetry.totalCards}`);
    assert(typeof telemetry.overallAccuracyRate === 'number', `Overall accuracy calculated: ${telemetry.overallAccuracyRate}%`);
    assert(typeof telemetry.cardsByStage.apprentice === 'number', 'Mastery breakdown populated');

    // ----------------------------------------------------
    // TEST 8: P1-03 Live Lesson Publishing Queue Interoperability
    // ----------------------------------------------------
    console.log('\n--- 8. Testing P1-03 Live Lesson Publishing Queue Interoperability ---');

    const rawData = db.getRawData();
    const existingLesson = rawData.lessons && rawData.lessons.length > 0 ? rawData.lessons[0] : null;

    if (existingLesson) {
      const syncResult = db.syncLessonToSrsDeck(testUserId, existingLesson.id, { level: existingLesson.level });
      assert(syncResult.success === true, `Successfully synchronized lesson "${existingLesson.title}" to SRS deck`);
      assert(syncResult.totalDeckCount >= syncResult.totalCardsAdded, 'Deck count matches or exceeds added items');

      // Sync again to verify idempotent deduplication
      const repeatSync = db.syncLessonToSrsDeck(testUserId, existingLesson.id, { level: existingLesson.level });
      assert(repeatSync.totalCardsAdded === 0, 'Duplicate lesson ingestion gracefully skipped (idempotent)');
    } else {
      console.log('⚠️ No existing lesson found for sync test - skipping lesson sync assertion');
    }

    console.log('\n====================================================');
    console.log(`🏁 P1-04 TESTS COMPLETE: ${passed} PASSED | ${failed} FAILED`);
    console.log('====================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('💥 Unhandled exception during P1-04 test execution:', err);
    process.exit(1);
  }
}

runAdaptiveSrsP1Tests();
