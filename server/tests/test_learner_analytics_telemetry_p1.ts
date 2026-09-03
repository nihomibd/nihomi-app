import { db } from '../db.js';
import { LearnerAnalyticsService } from '../services/learnerAnalyticsService.js';
import {
  SrsCardRecord,
  SrsReviewLog,
  MockExamAttempt,
  User,
  UserProfile,
  UserProgress
} from '../types.js';

async function runLearnerAnalyticsTelemetryTests() {
  console.log('================================================================');
  console.log('🧪 NIHOMI.COM P1-05: LEARNER ANALYTICS & TELEMETRY ENGINE TESTS');
  console.log('================================================================\n');

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

  const testUserId = `usr-telemetry-test-${Date.now()}`;

  try {
    // ----------------------------------------------------
    // SETUP: Seed test user, profile, progress, SRS data & mock exam attempts
    // ----------------------------------------------------
    console.log('--- Setting up test data for Telemetry Engine ---');

    const testUser: User = {
      id: testUserId,
      email: `${testUserId}@example.com`,
      passwordHash: 'dummy_hash',
      passwordSalt: 'dummy_salt',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const testProfile: UserProfile = {
      userId: testUserId,
      displayName: 'Tanvir Analytics Tester',
      nativeLanguage: 'en',
      targetLevel: 'N5',
      dailyGoalMinutes: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const testProgress: UserProgress = {
      userId: testUserId,
      currentLevel: 'N5',
      completedLessonIds: ['les-1', 'les-2', 'les-3', 'les-4'],
      experiencePoints: 1250,
      currentStreak: 8,
      longestStreak: 12,
      lastActiveDate: new Date().toISOString().split('T')[0],
      totalStudyMinutes: 360,
      updatedAt: new Date().toISOString()
    };

    // Add user to DB
    const rawData = db.getRawData();
    if (!rawData.users) rawData.users = [];
    rawData.users.push(testUser);

    if (!rawData.profiles) rawData.profiles = [];
    rawData.profiles.push(testProfile);

    if (!rawData.progress) rawData.progress = [];
    rawData.progress.push(testProgress);

    // ----------------------------------------------------
    // TEST 1: SRS Retention Telemetry Calculation
    // ----------------------------------------------------
    console.log('\n--- 1. Testing SRS Retention Telemetry & Stage Distribution ---');

    // Create cards in different stages
    const testCards: SrsCardRecord[] = [
      {
        id: `card-srs-1-${testUserId}`,
        userId: testUserId,
        itemType: 'vocabulary',
        itemId: 'voc-1',
        level: 'N5',
        front: '犬',
        reading: 'いぬ',
        meaning: 'dog',
        repetition: 1,
        intervalDays: 1,
        easeFactor: 2.5,
        stabilityDays: 2.0,
        difficulty: 4.5,
        retrievability: 1.0,
        retentionScore: 95,
        lapses: 0,
        totalReviews: 1,
        consecutiveCorrect: 1,
        stage: 'apprentice',
        lastReviewedAt: new Date().toISOString(),
        nextReviewAt: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: `card-srs-2-${testUserId}`,
        userId: testUserId,
        itemType: 'vocabulary',
        itemId: 'voc-2',
        level: 'N5',
        front: '猫',
        reading: 'ねこ',
        meaning: 'cat',
        repetition: 4,
        intervalDays: 7,
        easeFactor: 2.6,
        stabilityDays: 8.0,
        difficulty: 4.2,
        retrievability: 0.95,
        retentionScore: 92,
        lapses: 0,
        totalReviews: 4,
        consecutiveCorrect: 4,
        stage: 'guru',
        lastReviewedAt: new Date().toISOString(),
        nextReviewAt: new Date(Date.now() + 7 * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: `card-srs-3-${testUserId}`,
        userId: testUserId,
        itemType: 'kanji',
        itemId: 'kan-1',
        level: 'N5',
        front: '日',
        reading: 'にち / ひ',
        meaning: 'day / sun',
        repetition: 7,
        intervalDays: 21,
        easeFactor: 2.7,
        stabilityDays: 24.0,
        difficulty: 3.8,
        retrievability: 0.92,
        retentionScore: 90,
        lapses: 0,
        totalReviews: 7,
        consecutiveCorrect: 7,
        stage: 'master',
        lastReviewedAt: new Date().toISOString(),
        nextReviewAt: new Date(Date.now() + 21 * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    if (!rawData.srsCards) rawData.srsCards = [];
    rawData.srsCards.push(...testCards);

    // Create telemetry logs (4 good, 1 again = 80% accuracy)
    const testLogs: SrsReviewLog[] = [
      {
        id: `log-1-${testUserId}`,
        userId: testUserId,
        cardId: testCards[0].id,
        itemId: 'voc-1',
        itemType: 'vocabulary',
        rating: 'good',
        algorithmUsed: 'sm2',
        scheduledDays: 1,
        actualElapsedDays: 1,
        responseTimeMs: 1100,
        retentionBeforeReview: 0.92,
        stageBefore: 'apprentice',
        stageAfter: 'apprentice',
        intervalDaysBefore: 1,
        intervalDaysAfter: 1,
        easeFactorBefore: 2.5,
        easeFactorAfter: 2.5,
        stabilityBefore: 2.0,
        stabilityAfter: 2.0,
        difficultyBefore: 4.5,
        difficultyAfter: 4.5,
        reviewedAt: new Date().toISOString()
      },
      {
        id: `log-2-${testUserId}`,
        userId: testUserId,
        cardId: testCards[1].id,
        itemId: 'voc-2',
        itemType: 'vocabulary',
        rating: 'easy',
        algorithmUsed: 'fsrs',
        scheduledDays: 6,
        actualElapsedDays: 6,
        responseTimeMs: 850,
        retentionBeforeReview: 0.95,
        stageBefore: 'guru',
        stageAfter: 'guru',
        intervalDaysBefore: 6,
        intervalDaysAfter: 12,
        easeFactorBefore: 2.6,
        easeFactorAfter: 2.7,
        stabilityBefore: 8.0,
        stabilityAfter: 14.0,
        difficultyBefore: 4.2,
        difficultyAfter: 3.9,
        reviewedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      },
      {
        id: `log-3-${testUserId}`,
        userId: testUserId,
        cardId: testCards[2].id,
        itemId: 'kan-1',
        itemType: 'kanji',
        rating: 'good',
        algorithmUsed: 'adaptive_hybrid',
        scheduledDays: 14,
        actualElapsedDays: 14,
        responseTimeMs: 1400,
        retentionBeforeReview: 0.90,
        stageBefore: 'master',
        stageAfter: 'master',
        intervalDaysBefore: 14,
        intervalDaysAfter: 28,
        easeFactorBefore: 2.7,
        easeFactorAfter: 2.7,
        stabilityBefore: 24.0,
        stabilityAfter: 38.0,
        difficultyBefore: 3.8,
        difficultyAfter: 3.8,
        reviewedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: `log-4-${testUserId}`,
        userId: testUserId,
        cardId: testCards[0].id,
        itemId: 'voc-1',
        itemType: 'vocabulary',
        rating: 'again',
        algorithmUsed: 'sm2',
        scheduledDays: 3,
        actualElapsedDays: 4,
        responseTimeMs: 2500,
        retentionBeforeReview: 0.75,
        stageBefore: 'guru',
        stageAfter: 'apprentice',
        intervalDaysBefore: 7,
        intervalDaysAfter: 1,
        easeFactorBefore: 2.5,
        easeFactorAfter: 2.3,
        stabilityBefore: 6.0,
        stabilityAfter: 1.5,
        difficultyBefore: 4.5,
        difficultyAfter: 5.5,
        reviewedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: `log-5-${testUserId}`,
        userId: testUserId,
        cardId: testCards[1].id,
        itemId: 'voc-2',
        itemType: 'vocabulary',
        rating: 'good',
        algorithmUsed: 'fsrs',
        scheduledDays: 2,
        actualElapsedDays: 2,
        responseTimeMs: 950,
        retentionBeforeReview: 0.93,
        stageBefore: 'apprentice',
        stageAfter: 'guru',
        intervalDaysBefore: 2,
        intervalDaysAfter: 5,
        easeFactorBefore: 2.5,
        easeFactorAfter: 2.6,
        stabilityBefore: 3.0,
        stabilityAfter: 7.0,
        difficultyBefore: 4.5,
        difficultyAfter: 4.3,
        reviewedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
      }
    ];

    if (!rawData.srsLogs) rawData.srsLogs = [];
    rawData.srsLogs.push(...testLogs);
    db.restoreRawData(rawData);

    const summary1 = LearnerAnalyticsService.computeLearnerAnalytics(testUserId);

    assert(summary1.srsMetrics.totalCards === 3, 'Calculates correct total cards count', `Got ${summary1.srsMetrics.totalCards}`);
    assert(summary1.srsMetrics.masteryBreakdown.apprentice === 1, 'Correctly tallies apprentice stage cards');
    assert(summary1.srsMetrics.masteryBreakdown.guru === 1, 'Correctly tallies guru stage cards');
    assert(summary1.srsMetrics.masteryBreakdown.master === 1, 'Correctly tallies master stage cards');
    assert(summary1.srsMetrics.overallAccuracyRate === 80, 'Accurately computes 80% recall accuracy (4/5 passed)', `Got ${summary1.srsMetrics.overallAccuracyRate}%`);
    assert(summary1.srsMetrics.dailyRetentionTrend.length === 14, 'Produces 14-day daily retention trend points', `Got ${summary1.srsMetrics.dailyRetentionTrend.length}`);
    assert(summary1.srsMetrics.averageStabilityDays > 0, 'Computes average card stability days');
    assert(summary1.srsMetrics.averageResponseTimeMs > 0, 'Computes average response time in milliseconds');

    // ----------------------------------------------------
    // TEST 2: Study Streak & Activity Pulse Telemetry
    // ----------------------------------------------------
    console.log('\n--- 2. Testing Study Streak & Activity Pulse ---');

    assert(summary1.streakMetrics.currentStreak === 8, 'Reflects user current streak', `Got ${summary1.streakMetrics.currentStreak}`);
    assert(summary1.streakMetrics.longestStreak === 12, 'Reflects longest streak record', `Got ${summary1.streakMetrics.longestStreak}`);
    assert(summary1.streakMetrics.totalStudyMinutes === 360, 'Tallies total lifetime study minutes', `Got ${summary1.streakMetrics.totalStudyMinutes}`);
    assert(summary1.streakMetrics.recentDailyActivity.length === 14, 'Produces 14-day daily activity time-series');
    assert(summary1.streakMetrics.consistencyScorePercent > 0 && summary1.streakMetrics.consistencyScorePercent <= 100, 'Calculates 30-day consistency percentage within [0, 100]');

    // ----------------------------------------------------
    // TEST 3: JLPT N5 Mock Exam Performance Telemetry
    // ----------------------------------------------------
    console.log('\n--- 3. Testing JLPT N5 Mock Exam Telemetry & Section Breakdown ---');

    // Seed mock exam attempt for test user
    const testAttempt: MockExamAttempt = {
      id: `mock-att-test-1`,
      userId: testUserId,
      mockExamId: 'mock-jlpt-n5-01',
      examCode: 'JLPT-N5-2026-MOCK1',
      level: 'N5',
      startedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      submittedAt: new Date().toISOString(),
      timeSpentSeconds: 3400,
      sectionTimesSpentSeconds: {
        vocabulary: 1200,
        grammar_reading: 1400,
        listening: 800
      },
      sectionScores: {
        vocabulary: {
          sectionType: 'vocabulary',
          sectionTitle: 'Language Knowledge (Vocabulary)',
          totalQuestions: 25,
          correctQuestions: 22,
          rawScorePercent: 88,
          scaledScore: 53,
          maxScaledScore: 60,
          passingThreshold: 19,
          isSectionPassed: true
        },
        grammar_reading: {
          sectionType: 'grammar_reading',
          sectionTitle: 'Language Knowledge (Grammar) & Reading',
          totalQuestions: 25,
          correctQuestions: 20,
          rawScorePercent: 80,
          scaledScore: 48,
          maxScaledScore: 60,
          passingThreshold: 19,
          isSectionPassed: true
        },
        listening: {
          sectionType: 'listening',
          sectionTitle: 'Listening Comprehension',
          totalQuestions: 20,
          correctQuestions: 17,
          rawScorePercent: 85,
          scaledScore: 51,
          maxScaledScore: 60,
          passingThreshold: 19,
          isSectionPassed: true
        }
      },
      totalScaledScore: 152, // out of 180 (passing threshold is 80)
      overallPassingScore: 80,
      isPassed: true,
      letterGrade: 'A',
      certificateId: 'cert-mock-test-1',
      userAnswers: [],
      strengthSummaryBn: 'শব্দার্থ ও ব্যাকরণে চমৎকার দক্ষতা।',
      weaknessSummaryBn: 'শ্রবণ দক্ষতায় আরো সামান্য উন্নতি সম্ভব।',
      actionableStudyPlanBn: ['অডিও ট্র্যাক শুনুন']
    };

    if (!rawData.mockExamAttempts) rawData.mockExamAttempts = [];
    rawData.mockExamAttempts.push(testAttempt);
    db.restoreRawData(rawData);

    const summary2 = LearnerAnalyticsService.computeLearnerAnalytics(testUserId);

    assert(summary2.mockExamMetrics.totalAttempts === 1, 'Records 1 total mock exam attempt');
    assert(summary2.mockExamMetrics.passedAttempts === 1, 'Records 1 passed attempt');
    assert(summary2.mockExamMetrics.passRatePercent === 100, 'Calculates 100% mock exam pass rate');
    assert(summary2.mockExamMetrics.highestScaledScore === 152, 'Identifies highest scaled score of 152/180', `Got ${summary2.mockExamMetrics.highestScaledScore}`);
    assert(summary2.mockExamMetrics.readinessScorePercent >= 80, 'Calculates high JLPT N5 readiness percentage (>= 80%)', `Got ${summary2.mockExamMetrics.readinessScorePercent}%`);

    const secVocab = summary2.mockExamMetrics.sectionAverages.vocabulary;
    assert(secVocab.averageScaledScore === 53, 'Accurately computes vocabulary section average scaled score (53/60)');
    assert(secVocab.passRatePercent === 100, 'Vocabulary section pass rate is 100%');

    const secGrammar = summary2.mockExamMetrics.sectionAverages.grammar_reading;
    assert(secGrammar.averageScaledScore === 48, 'Accurately computes grammar & reading section average scaled score (48/60)');

    const secListening = summary2.mockExamMetrics.sectionAverages.listening;
    assert(secListening.averageScaledScore === 51, 'Accurately computes listening section average scaled score (51/60)');

    // ----------------------------------------------------
    // TEST 4: Global XP Leaderboard & Ranking Engine
    // ----------------------------------------------------
    console.log('\n--- 4. Testing Global XP Leaderboard Engine & Percentiles ---');

    const lbAllTime = LearnerAnalyticsService.getLeaderboard('allTime', testUserId, 10);
    assert(lbAllTime.rankings.length > 0, 'Retrieves all-time leaderboard rankings list');
    assert(lbAllTime.totalLearners >= 1, 'Returns total active learners count');

    const userEntry = lbAllTime.rankings.find((r) => r.userId === testUserId) || lbAllTime.currentUserRank;
    assert(userEntry !== undefined, 'Includes current test user in leaderboard calculation');
    assert(typeof userEntry?.rank === 'number' && userEntry.rank > 0, 'Assigns a positive integer rank');
    assert(userEntry?.xp === 1250, 'Reflects accurate XP tally for user', `Got ${userEntry?.xp}`);

    // Test weekly timeframe
    const lbWeek = LearnerAnalyticsService.getLeaderboard('week', testUserId, 10);
    assert(lbWeek.timeframe === 'week', 'Correctly scopes to weekly timeframe');
    assert(lbWeek.rankings.length > 0, 'Generates non-empty weekly rankings');

    // Test today timeframe
    const lbToday = LearnerAnalyticsService.getLeaderboard('today', testUserId, 10);
    assert(lbToday.timeframe === 'today', 'Correctly scopes to today timeframe');

    // ----------------------------------------------------
    // TEST 5: PostgreSQL Materialized Summaries Caching & Refresh
    // ----------------------------------------------------
    console.log('\n--- 5. Testing PostgreSQL Materialized Summary Storage & Cache ---');

    // Cached retrieval should return pre-computed summary without re-computation
    const cachedSummary = LearnerAnalyticsService.getMaterializedSummary(testUserId, false);
    assert(cachedSummary.id === `analytics-summary-${testUserId}`, 'Retrieves materialized summary from database storage');
    assert(cachedSummary.computedAt === summary2.computedAt, 'Cached summary computedAt matches initial computation timestamp');

    // Forced refresh should re-compute and update computedAt
    const refreshedSummary = LearnerAnalyticsService.computeLearnerAnalytics(testUserId);
    assert(refreshedSummary.id === `analytics-summary-${testUserId}`, 'Recomputes materialized summary on demand');
    assert(new Date(refreshedSummary.computedAt).getTime() >= new Date(cachedSummary.computedAt).getTime(), 'Updates timestamp upon fresh materialization');

    // Test database helper method
    const dbSummary = db.getLearnerAnalyticsSummary(testUserId);
    assert(dbSummary.userId === testUserId, 'db.getLearnerAnalyticsSummary returns valid summary object');

    const refreshedCount = db.refreshAllMaterializedAnalytics();
    assert(refreshedCount >= 1, 'db.refreshAllMaterializedAnalytics successfully processes all registered learners', `Processed ${refreshedCount}`);

    // ----------------------------------------------------
    // TEST 6: Platform Cohort Analytics Aggregation
    // ----------------------------------------------------
    console.log('\n--- 6. Testing Platform-Wide Cohort Statistics ---');

    const cohort = LearnerAnalyticsService.getCohortAnalytics();
    assert(cohort.totalLearners >= 1, 'Platform cohort includes registered learners');
    assert(cohort.totalSrsCardsInSystem >= 3, 'Platform cohort aggregates total SRS cards');
    assert(cohort.averageCohortAccuracyPercent > 0, 'Platform cohort computes mean recall accuracy');
    assert(cohort.jlptN5MockPassRatePercent > 0, 'Platform cohort computes mean mock exam pass rate');

    // ----------------------------------------------------
    // TEST 7: Clean-up Test Data
    // ----------------------------------------------------
    console.log('\n--- Cleaning up temporary test artifacts ---');
    rawData.users = rawData.users.filter((u) => u.id !== testUserId);
    rawData.profiles = rawData.profiles.filter((p) => p.userId !== testUserId);
    rawData.progress = rawData.progress.filter((p) => p.userId !== testUserId);
    rawData.srsCards = (rawData.srsCards || []).filter((c) => c.userId !== testUserId);
    rawData.srsLogs = (rawData.srsLogs || []).filter((l) => l.userId !== testUserId);
    rawData.mockExamAttempts = (rawData.mockExamAttempts || []).filter((a) => a.userId !== testUserId);
    rawData.learnerAnalyticsSummaries = (rawData.learnerAnalyticsSummaries || []).filter((s) => s.userId !== testUserId);
    db.save();

    console.log('Test artifacts cleaned up successfully.');
  } catch (err: any) {
    console.error('Unhandled error during test execution:', err);
    failed++;
  }

  console.log('\n================================================================');
  console.log(`FINAL RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runLearnerAnalyticsTelemetryTests();
