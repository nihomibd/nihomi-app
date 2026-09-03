import express from 'express';
import { analyticsRouter } from '../routes/analytics.js';
import { db } from '../db.js';
import { signStatelessJwt } from '../authHelper.js';
import { User, UserProfile, UserProgress } from '../types.js';

async function runAnalyticsApiEndpointTests() {
  console.log('================================================================');
  console.log('🧪 NIHOMI.COM P1-05: ANALYTICS REST API ENDPOINT TESTS');
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

  // Setup express app
  const app = express();
  app.use(express.json());

  const testUserId = `usr-api-test-${Date.now()}`;
  const testUserEmail = `${testUserId}@example.com`;

  // Generate genuine stateless JWT
  const validToken = signStatelessJwt({
    userId: testUserId,
    email: testUserEmail,
    role: 'user'
  });

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${validToken}`
  };

  app.use('/api/analytics', analyticsRouter);

  // Start temporary server
  const server = app.listen(0);
  const address = server.address() as any;
  const port = address.port;
  const baseUrl = `http://127.0.0.1:${port}/api/analytics`;

  try {
    // Seed user into database
    const rawData = db.getRawData();
    if (!rawData.users) rawData.users = [];
    rawData.users.push({
      id: testUserId,
      email: testUserEmail,
      passwordHash: 'dummy_hash',
      passwordSalt: 'dummy_salt',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    if (!rawData.profiles) rawData.profiles = [];
    rawData.profiles.push({
      userId: testUserId,
      displayName: 'API Test Student',
      nativeLanguage: 'en',
      targetLevel: 'N5',
      dailyGoalMinutes: 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    if (!rawData.progress) rawData.progress = [];
    rawData.progress.push({
      userId: testUserId,
      currentLevel: 'N5',
      completedLessonIds: ['les-1', 'les-2'],
      experiencePoints: 950,
      currentStreak: 5,
      longestStreak: 9,
      lastActiveDate: new Date().toISOString().split('T')[0],
      totalStudyMinutes: 210,
      updatedAt: new Date().toISOString()
    });

    db.restoreRawData(rawData);

    // ----------------------------------------------------
    // TEST 1: GET /api/analytics/overview
    // ----------------------------------------------------
    console.log('--- 1. Testing GET /api/analytics/overview ---');
    const resOverview = await fetch(`${baseUrl}/overview`, { headers: authHeaders });
    assert(resOverview.status === 200, 'GET /overview returns HTTP 200 OK', `Status: ${resOverview.status}`);
    const dataOverview = await resOverview.json();
    assert(dataOverview.success === true, 'GET /overview responds with success: true');
    assert(dataOverview.analytics !== undefined, 'GET /overview contains analytics object');
    assert(dataOverview.analytics?.userId === testUserId, 'Analytics summary matches authenticated user ID');
    assert(dataOverview.analytics?.srsMetrics !== undefined, 'Contains SRS metrics');
    assert(dataOverview.analytics?.streakMetrics !== undefined, 'Contains streak metrics');
    assert(dataOverview.analytics?.mockExamMetrics !== undefined, 'Contains mock exam metrics');
    assert(dataOverview.analytics?.leaderboardMetrics !== undefined, 'Contains leaderboard metrics');

    // ----------------------------------------------------
    // TEST 2: GET /api/analytics/retention-trend
    // ----------------------------------------------------
    console.log('\n--- 2. Testing GET /api/analytics/retention-trend ---');
    const resRetention = await fetch(`${baseUrl}/retention-trend`, { headers: authHeaders });
    assert(resRetention.status === 200, 'GET /retention-trend returns HTTP 200 OK');
    const dataRetention = await resRetention.json();
    assert(dataRetention.success === true, 'GET /retention-trend responds with success: true');
    assert(Array.isArray(dataRetention.dailyRetentionTrend), 'Returns dailyRetentionTrend array');
    assert(dataRetention.dailyRetentionTrend.length === 14, 'Returns 14-day retention points');

    // ----------------------------------------------------
    // TEST 3: GET /api/analytics/mock-exams
    // ----------------------------------------------------
    console.log('\n--- 3. Testing GET /api/analytics/mock-exams ---');
    const resMock = await fetch(`${baseUrl}/mock-exams`, { headers: authHeaders });
    assert(resMock.status === 200, 'GET /mock-exams returns HTTP 200 OK');
    const dataMock = await resMock.json();
    assert(dataMock.success === true, 'GET /mock-exams responds with success: true');
    assert(dataMock.mockExamMetrics.targetLevel === 'N5', 'Scopes to user target level N5');
    assert(dataMock.mockExamMetrics.sectionAverages !== undefined, 'Contains section averages');

    // ----------------------------------------------------
    // TEST 4: GET /api/analytics/study-pulse
    // ----------------------------------------------------
    console.log('\n--- 4. Testing GET /api/analytics/study-pulse ---');
    const resPulse = await fetch(`${baseUrl}/study-pulse`, { headers: authHeaders });
    assert(resPulse.status === 200, 'GET /study-pulse returns HTTP 200 OK');
    const dataPulse = await resPulse.json();
    assert(dataPulse.success === true, 'GET /study-pulse responds with success: true');
    assert(dataPulse.streakMetrics.currentStreak === 5, 'Reflects 5-day study streak');
    assert(Array.isArray(dataPulse.streakMetrics.recentDailyActivity), 'Includes recent daily activity');

    // ----------------------------------------------------
    // TEST 5: GET /api/analytics/leaderboard
    // ----------------------------------------------------
    console.log('\n--- 5. Testing GET /api/analytics/leaderboard ---');
    const resLb = await fetch(`${baseUrl}/leaderboard?timeframe=allTime&limit=10`, { headers: authHeaders });
    assert(resLb.status === 200, 'GET /leaderboard returns HTTP 200 OK');
    const dataLb = await resLb.json();
    assert(dataLb.success === true, 'GET /leaderboard responds with success: true');
    assert(Array.isArray(dataLb.rankings), 'Returns rankings array');
    assert(dataLb.rankings.length > 0, 'Rankings are populated');
    assert(dataLb.currentUserRank !== undefined, 'Includes current user rank details');

    // ----------------------------------------------------
    // TEST 6: POST /api/analytics/refresh
    // ----------------------------------------------------
    console.log('\n--- 6. Testing POST /api/analytics/refresh ---');
    const resRefresh = await fetch(`${baseUrl}/refresh`, { method: 'POST', headers: authHeaders });
    assert(resRefresh.status === 200, 'POST /refresh returns HTTP 200 OK');
    const dataRefresh = await resRefresh.json();
    assert(dataRefresh.success === true, 'POST /refresh responds with success: true');
    assert(dataRefresh.refreshed === true, 'Confirms refresh operation completed');
    assert(dataRefresh.analytics.id === `analytics-summary-${testUserId}`, 'Returns newly materialized summary');

    // ----------------------------------------------------
    // TEST 7: GET /api/analytics/cohort
    // ----------------------------------------------------
    console.log('\n--- 7. Testing GET /api/analytics/cohort ---');
    const resCohort = await fetch(`${baseUrl}/cohort`, { headers: authHeaders });
    assert(resCohort.status === 200, 'GET /cohort returns HTTP 200 OK');
    const dataCohort = await resCohort.json();
    assert(dataCohort.success === true, 'GET /cohort responds with success: true');
    assert(dataCohort.cohort.totalLearners >= 1, 'Reflects cohort learner count');

    // ----------------------------------------------------
    // TEST 8: Authorization Rejection on Missing Token
    // ----------------------------------------------------
    console.log('\n--- 8. Testing 401 Unauthorized Guard ---');
    const resUnauth = await fetch(`${baseUrl}/overview`);
    assert(resUnauth.status === 401, 'Unauthenticated request to /overview is rejected with HTTP 401');

    // Clean up test data
    const cleanData = db.getRawData();
    cleanData.users = cleanData.users.filter((u) => u.id !== testUserId);
    cleanData.profiles = cleanData.profiles.filter((p) => p.userId !== testUserId);
    cleanData.progress = cleanData.progress.filter((p) => p.userId !== testUserId);
    if (cleanData.learnerAnalyticsSummaries) {
      cleanData.learnerAnalyticsSummaries = cleanData.learnerAnalyticsSummaries.filter((s) => s.userId !== testUserId);
    }
    db.restoreRawData(cleanData);
  } finally {
    server.close();
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

runAnalyticsApiEndpointTests();
