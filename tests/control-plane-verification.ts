import assert from 'assert';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('====================================================');
  console.log('🚀 NIHOMI IDENTITY + STATE + DASHBOARD VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => Promise<void>) {
    return fn()
      .then(() => {
        console.log(`✅ [PASS] ${name}`);
        passed++;
      })
      .catch((err) => {
        console.error(`❌ [FAIL] ${name}:`, err.message);
        failed++;
      });
  }

  const timestamp = Date.now();
  const studentAEmail = `student_a_${timestamp}@example.com`;
  const studentBEmail = `student_b_${timestamp}@example.com`;
  const password = 'Password123!';

  let studentAToken = '';
  let studentAId = '';
  let studentBToken = '';
  let studentBId = '';
  let founderToken = '';

  // ----------------------------------------------------
  // TEST A: New student zero state
  // ----------------------------------------------------
  await test('Test A: New student zero state (0 coins, 0 streak, 0 progress)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: studentAEmail,
        password,
        name: 'Student Alpha'
      })
    });
    assert.strictEqual(res.status, 201, `Registration returned status ${res.status}`);
    const data = await res.json();
    assert.ok(data.token, 'Token must be returned');
    assert.ok(data.user, 'User object must be returned');
    assert.strictEqual(data.user.role, 'student', 'Role must be strictly student');
    assert.strictEqual(data.user.planId, 'free', 'Plan must be strictly free');

    studentAToken = data.token;
    studentAId = data.user.id;

    // Check progress
    assert.strictEqual(data.progress?.currentStreak, 0, 'currentStreak must be strictly 0');
    assert.strictEqual(data.progress?.longestStreak, 0, 'longestStreak must be strictly 0');
    assert.strictEqual(data.progress?.completedLessonIds?.length || 0, 0, 'completedLessonIds must be empty');

    // Check wallet
    assert.strictEqual(data.wallet?.coinBalance, 0, 'coinBalance must be strictly 0 (no fake 50 or 420)');
    assert.strictEqual(data.wallet?.lifetimeEarned, 0, 'lifetimeEarned must be strictly 0');

    // Check /api/me/dashboard
    const dashRes = await fetch(`${BASE_URL}/api/me/dashboard`, {
      headers: { Authorization: `Bearer ${studentAToken}` }
    });
    assert.strictEqual(dashRes.status, 200, 'Student dashboard must return 200');
    const dashData = await dashRes.json();
    assert.strictEqual(dashData.learningStats?.coins, 0, 'Dashboard coins must be 0');
    assert.strictEqual(dashData.learningStats?.currentStreak, 0, 'Dashboard streak must be 0');
    assert.strictEqual(dashData.learningStats?.completedLessonsCount, 0, 'Dashboard completed lessons must be 0');
  });

  // ----------------------------------------------------
  // TEST B: Existing student persistence across re-login
  // ----------------------------------------------------
  await test('Test B: Existing student persistence across re-login', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: studentAEmail,
        password
      })
    });
    assert.strictEqual(res.status, 200, `Login returned status ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.user.id, studentAId, 'User ID must match across logins');
    assert.strictEqual(data.user.role, 'student', 'Role must remain student');
    assert.strictEqual(data.wallet?.coinBalance, 0, 'Wallet coins must persist as 0');
    assert.strictEqual(data.progress?.currentStreak, 0, 'Progress streak must persist as 0');
  });

  // Register Student B for tenant isolation tests
  await test('Setup: Register Student B', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: studentBEmail,
        password,
        name: 'Student Beta'
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    studentBToken = data.token;
    studentBId = data.user.id;
  });

  // ----------------------------------------------------
  // TEST C: Founder login & control center operations
  // ----------------------------------------------------
  await test('Test C: Founder login -> /founder capabilities', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'mdtanvirkabirbiplob@gmail.com',
        password: 'nihomiFounder2026!'
      })
    });
    assert.strictEqual(res.status, 200, `Founder login returned status ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.user.role, 'founder', 'Role must be strictly founder');
    founderToken = data.token;

    // 1. Founder Summary
    const sumRes = await fetch(`${BASE_URL}/api/founder/summary`, {
      headers: { Authorization: `Bearer ${founderToken}` }
    });
    assert.strictEqual(sumRes.status, 200, 'Founder summary must return 200');
    const sumData = await sumRes.json();
    assert.ok(sumData.students, 'Cohort metrics must be present');
    assert.ok(sumData.students.totalStudents >= 2, 'Total students should include registered test students');

    // 2. Founder Students Search
    const listRes = await fetch(`${BASE_URL}/api/founder/students?search=Alpha`, {
      headers: { Authorization: `Bearer ${founderToken}` }
    });
    assert.strictEqual(listRes.status, 200, 'Students list must return 200');
    const listData = await listRes.json();
    assert.ok(Array.isArray(listData.students), 'Students must be an array');
    const found = listData.students.find((s: any) => s.id === studentAId);
    assert.ok(found, 'Student Alpha must be found in student list');
    assert.strictEqual(found.coinBalance, 0, 'Found student coins must be 0');

    // 3. Founder Student Detail
    const detailRes = await fetch(`${BASE_URL}/api/founder/students/${studentAId}`, {
      headers: { Authorization: `Bearer ${founderToken}` }
    });
    assert.strictEqual(detailRes.status, 200, 'Student detail must return 200');
    const detailData = await detailRes.json();
    assert.strictEqual(detailData.student.id, studentAId);

    // 4. Founder Authorized Student Dashboard Snapshot
    const snapRes = await fetch(`${BASE_URL}/api/founder/students/${studentAId}/dashboard`, {
      headers: { Authorization: `Bearer ${founderToken}` }
    });
    assert.strictEqual(snapRes.status, 200, 'Authorized dashboard snapshot must return 200');
    const snapData = await snapRes.json();
    assert.strictEqual(snapData.data.user.id, studentAId);
    assert.strictEqual(snapData.data.learningStats.coins, 0);
  });

  // ----------------------------------------------------
  // TEST D: Multi-tenant Security & RBAC Isolation
  // ----------------------------------------------------
  await test('Test D: Student attempting Founder endpoints gets 403', async () => {
    const res = await fetch(`${BASE_URL}/api/founder/summary`, {
      headers: { Authorization: `Bearer ${studentAToken}` }
    });
    assert.strictEqual(res.status, 403, 'Student must receive 403 when requesting founder summary');
    const data = await res.json();
    assert.strictEqual(data.code, 'FORBIDDEN_FOUNDER_ONLY');
  });

  await test('Test D2: Student attempting /api/founder/students gets 403', async () => {
    const res = await fetch(`${BASE_URL}/api/founder/students`, {
      headers: { Authorization: `Bearer ${studentAToken}` }
    });
    assert.strictEqual(res.status, 403, 'Student must receive 403 when requesting founder students list');
  });

  await test('Test D3: Student A accessing Student B dashboard gets 403', async () => {
    const res = await fetch(`${BASE_URL}/api/dashboard/student/${studentBId}`, {
      headers: { Authorization: `Bearer ${studentAToken}` }
    });
    assert.strictEqual(res.status, 403, 'Student A requesting Student B must receive 403');
    const data = await res.json();
    assert.strictEqual(data.code, 'FORBIDDEN_STUDENT_ISOLATION');
  });

  // ----------------------------------------------------
  // TEST E: Session Persistence on Refresh via /api/auth/me
  // ----------------------------------------------------
  await test('Test E: Session persistence via /api/auth/me', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${studentAToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.authenticated, true);
    assert.strictEqual(data.user.id, studentAId);
    assert.strictEqual(data.user.role, 'student');
    assert.strictEqual(data.wallet.coinBalance, 0);
    assert.strictEqual(data.progress.currentStreak, 0);
  });

  // ----------------------------------------------------
  // TEST F: Zero-state integrity
  // ----------------------------------------------------
  await test('Test F: Zero-state integrity verification', async () => {
    const res = await fetch(`${BASE_URL}/api/me/dashboard`, {
      headers: { Authorization: `Bearer ${studentBToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.learningStats.coins, 0, 'Student B coins must be strictly 0');
    assert.strictEqual(data.learningStats.currentStreak, 0, 'Student B streak must be strictly 0');
    assert.strictEqual(data.learningStats.completedLessonsCount, 0, 'Student B completed lessons must be strictly 0');
  });

  console.log('\n====================================================');
  console.log(`🏁 RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
