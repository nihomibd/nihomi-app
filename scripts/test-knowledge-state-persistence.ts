// scripts/test-knowledge-state-persistence.ts
// NIHOMI.COM — LEARNER KNOWLEDGE STATE SERVER PERSISTENCE & MULTI-USER ISOLATION TEST SUITE

import express from 'express';
import http from 'http';
import { progressRouter } from '../server/routes/progress.ts';
import { signStatelessJwt } from '../server/authHelper.ts';
import { db } from '../server/db.ts';

const app = express();
app.use(express.json());
app.use('/api/progress', progressRouter);

async function runPersistenceTests() {
  console.log('================================================================');
  console.log('🧪 NIHOMI.COM — LEARNER KNOWLEDGE STATE SERVER PERSISTENCE TEST');
  console.log('================================================================\n');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const port = (server.address() as any).port;
  const baseUrl = `http://127.0.0.1:${port}/api/progress`;

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${desc}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // Test 1: Unauthenticated GET rejected
    // -------------------------------------------------------------
    console.log('[Test 1] Unauthenticated GET rejection...');
    const res1 = await fetch(`${baseUrl}/knowledge-state`);
    assert(res1.status === 401, 'Unauthenticated GET rejected with HTTP 401');

    // -------------------------------------------------------------
    // Test 2: Unauthenticated POST rejected
    // -------------------------------------------------------------
    console.log('[Test 2] Unauthenticated POST rejection...');
    const res2 = await fetch(`${baseUrl}/knowledge-state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ knowledgeState: { totalXp: 50 } })
    });
    assert(res2.status === 401, 'Unauthenticated POST rejected with HTTP 401');

    // -------------------------------------------------------------
    // Test 3: Authenticated user saves knowledge state
    // -------------------------------------------------------------
    console.log('[Test 3] Authenticated user saves knowledge state...');
    const userAId = `usr_test_a_${Date.now()}`;
    const tokenA = signStatelessJwt({
      userId: userAId,
      email: `${userAId}@nihomi.student`,
      role: 'student'
    });

    const testStateA = {
      version: '1.0.0',
      knownHiragana: ['あ', 'い', 'う'],
      knownKatakana: ['ア'],
      knownDakuten: [],
      knownHandakuten: [],
      knownCombinationKana: [],
      knownReadingRules: [],
      knownVocabulary: ['あい', 'いう'],
      knownKanji: [],
      knownGrammar: [],
      masteredSkills: ['baito_conbini_cashier'],
      currentMissionId: 'mission-001-vowels',
      currentLevel: 'N5',
      recentMistakes: [],
      reviewQueue: [],
      totalXp: 180,
      streakDays: 3,
      lastActiveDate: '2026-10-22'
    };

    const res3 = await fetch(`${baseUrl}/knowledge-state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({ knowledgeState: testStateA })
    });
    const data3 = await res3.json();
    assert(res3.status === 200 && data3.success === true, 'Authenticated POST succeeded with HTTP 200');
    assert(data3.knowledgeState?.totalXp === 180, 'Returned saved totalXp: 180');
    assert(data3.knowledgeState?.masteredSkills?.includes('baito_conbini_cashier'), 'Saved WorkOS skill in database');

    // -------------------------------------------------------------
    // Test 4: Authenticated user retrieves knowledge state
    // -------------------------------------------------------------
    console.log('[Test 4] Authenticated user retrieves saved state via GET...');
    const res4 = await fetch(`${baseUrl}/knowledge-state`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    const data4 = await res4.json();
    assert(res4.status === 200 && data4.success === true, 'GET /knowledge-state succeeded with HTTP 200');
    assert(data4.knowledgeState?.knownHiragana?.length === 3, 'Retrieved all 3 unlocked Hiragana from server');
    assert(data4.knowledgeState?.knownVocabulary?.includes('あい'), 'Retrieved unlocked vocabulary from server');

    // -------------------------------------------------------------
    // Test 5: DB User Progress synchronization
    // -------------------------------------------------------------
    console.log('[Test 5] DB User Progress synchronization...');
    const dbProgress = db.getProgressByUserId(userAId);
    assert(dbProgress.experiencePoints === 180, `User progress experiencePoints synced to ${dbProgress.experiencePoints}`);
    assert(dbProgress.currentStreak === 3, `User progress currentStreak synced to ${dbProgress.currentStreak}`);

    // -------------------------------------------------------------
    // Test 6: Cross-user tenant data isolation
    // -------------------------------------------------------------
    console.log('[Test 6] Multi-user cryptographic isolation...');
    const userBId = `usr_test_b_${Date.now()}`;
    const tokenB = signStatelessJwt({
      userId: userBId,
      email: `${userBId}@nihomi.student`,
      role: 'student'
    });

    const res6 = await fetch(`${baseUrl}/knowledge-state`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    const data6 = await res6.json();
    assert(data6.knowledgeState === null, 'User B sees null state (isolated from User A)');

    // -------------------------------------------------------------
    // Test 7: Invalid payload rejection
    // -------------------------------------------------------------
    console.log('[Test 7] Invalid payload defense...');
    const res7 = await fetch(`${baseUrl}/knowledge-state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`
      },
      body: JSON.stringify({ knowledgeState: 'not_an_object' })
    });
    assert(res7.status === 400, 'Invalid string payload rejected with HTTP 400');

  } catch (err: any) {
    console.error('Fatal test execution error:', err);
    failed++;
  } finally {
    server.close();
  }

  console.log('\n================================================================');
  console.log(`📊 KNOWLEDGE STATE PERSISTENCE: Passed: ${passed} | Failed: ${failed}`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPersistenceTests();
