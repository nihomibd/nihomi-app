import assert from 'assert';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('====================================================');
  console.log('🚀 NIHOMI CANONICAL 2-ROLE CONTROL PLANE & PAYMENT TEST');
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
  const studentAEmail = `learner_alpha_${timestamp}@gmail.com`;
  const studentBEmail = `learner_beta_${timestamp}@gmail.com`;
  const password = 'Password123!';

  let studentAToken = '';
  let studentAId = '';
  let studentBToken = '';
  let studentBId = '';
  let adminToken = '';

  // ----------------------------------------------------
  // TEST 1: Other Gmail => STUDENT with strict zero state
  // ----------------------------------------------------
  await test('Test 1: Non-admin Gmail automatically becomes STUDENT with zero state', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: studentAEmail,
        password,
        name: 'Learner Alpha',
        // Client tampering attempt: must be strictly ignored!
        role: 'admin',
        isAdmin: true
      })
    });
    assert.strictEqual(res.status, 201, `Registration returned status ${res.status}`);
    const data = await res.json();
    assert.ok(data.token, 'Token must be returned');
    assert.ok(data.user, 'User object must be returned');
    assert.strictEqual(data.user.role, 'student', 'Role MUST be strictly student despite client tampering');
    assert.strictEqual(data.user.planId, 'free', 'Plan must be strictly free');

    studentAToken = data.token;
    studentAId = data.user.id;

    // Verify Zero-State Invariants
    assert.strictEqual(data.progress?.currentStreak, 0, 'currentStreak must be strictly 0');
    assert.strictEqual(data.progress?.longestStreak, 0, 'longestStreak must be strictly 0');
    assert.strictEqual(data.progress?.totalStudyMinutes, 0, 'totalStudyMinutes must be strictly 0');
    assert.strictEqual(data.progress?.completedLessonIds?.length || 0, 0, 'completedLessonIds must be empty');

    // Wallet Zero-State Invariants
    assert.strictEqual(data.wallet?.coinBalance, 0, 'coinBalance must be strictly 0');
    assert.strictEqual(data.wallet?.lifetimeEarned, 0, 'lifetimeEarned must be strictly 0');
    assert.strictEqual(data.wallet?.aiCredits, 0, 'aiCredits must be strictly 0');

    // Student Dashboard
    const dashRes = await fetch(`${BASE_URL}/api/me/dashboard`, {
      headers: { Authorization: `Bearer ${studentAToken}` }
    });
    assert.strictEqual(dashRes.status, 200, 'Student dashboard must return 200');
    const dashData = await dashRes.json();
    assert.strictEqual(dashData.learningStats?.coins, 0, 'Dashboard coins must be 0');
    assert.strictEqual(dashData.learningStats?.currentStreak, 0, 'Dashboard streak must be 0');
    assert.strictEqual(dashData.learningStats?.completedLessonsCount, 0, 'Dashboard completed lessons must be 0');
    assert.strictEqual(dashData.profile?.japanReadinessScore, 0, 'Readiness score must be 0');
  });

  // ----------------------------------------------------
  // TEST 2: Existing student persistence across re-login
  // ----------------------------------------------------
  await test('Test 2: Student persistence across re-login (no state reset)', async () => {
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

  // ----------------------------------------------------
  // TEST 3: Register Student B for isolation testing
  // ----------------------------------------------------
  await test('Test 3: Setup second student account', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: studentBEmail,
        password,
        name: 'Learner Beta'
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    studentBToken = data.token;
    studentBId = data.user.id;
    assert.strictEqual(data.user.role, 'student', 'Student B must also be strictly student');
  });

  // ----------------------------------------------------
  // TEST 4: Exact Admin Email => ADMIN role
  // ----------------------------------------------------
  await test('Test 4: Exact admin email (mdtanvirkabirbiplob@gmail.com) => ADMIN role', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'mdtanvirkabirbiplob@gmail.com',
        password: 'nihomiFounder2026!'
      })
    });
    assert.strictEqual(res.status, 200, `Admin login returned status ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.user.role, 'admin', 'Exact admin email MUST resolve strictly to admin');
    adminToken = data.token;

    // Verify Admin Control Center summary
    const sumRes = await fetch(`${BASE_URL}/api/founder/summary`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(sumRes.status, 200, 'Admin summary must return 200');
    const sumData = await sumRes.json();
    assert.ok(sumData.students, 'Cohort metrics must be present');
    assert.ok(sumData.students.totalStudents >= 2, 'Total students should include registered learners');

    // Verify Admin Student Search
    const listRes = await fetch(`${BASE_URL}/api/founder/students?search=Alpha`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(listRes.status, 200, 'Students list must return 200');
    const listData = await listRes.json();
    const found = listData.students.find((s: any) => s.id === studentAId);
    assert.ok(found, 'Student Alpha must be found in student list');
    assert.strictEqual(found.role, 'student', 'Listed role must be student');

    // Verify Admin authorized student dashboard snapshot
    const snapRes = await fetch(`${BASE_URL}/api/founder/students/${studentAId}/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(snapRes.status, 200, 'Authorized dashboard snapshot must return 200');
    const snapData = await snapRes.json();
    assert.strictEqual(snapData.data.user.id, studentAId);
    assert.strictEqual(snapData.data.learningStats.coins, 0);
  });

  // ----------------------------------------------------
  // TEST 5: Student isolation & RBAC protection (403 Forbidden)
  // ----------------------------------------------------
  await test('Test 5: Student isolation - cannot access admin endpoints or another student', async () => {
    // 5.1 Student attempting Admin summary => 403
    const sumRes = await fetch(`${BASE_URL}/api/founder/summary`, {
      headers: { Authorization: `Bearer ${studentAToken}` }
    });
    assert.strictEqual(sumRes.status, 403, 'Student must receive 403 on admin summary');
    const sumData = await sumRes.json();
    assert.strictEqual(sumData.code, 'FORBIDDEN_FOUNDER_ONLY');

    // 5.2 Student attempting Admin student list => 403
    const listRes = await fetch(`${BASE_URL}/api/founder/students`, {
      headers: { Authorization: `Bearer ${studentAToken}` }
    });
    assert.strictEqual(listRes.status, 403, 'Student must receive 403 on admin students list');

    // 5.3 Student A accessing Student B's dashboard => 403
    const idorRes = await fetch(`${BASE_URL}/api/dashboard/student/${studentBId}`, {
      headers: { Authorization: `Bearer ${studentAToken}` }
    });
    assert.strictEqual(idorRes.status, 403, 'Student A requesting Student B must receive 403');
    const idorData = await idorRes.json();
    assert.strictEqual(idorData.code, 'FORBIDDEN_STUDENT_ISOLATION');
  });

  // ----------------------------------------------------
  // TEST 6: Session persistence via /api/auth/me
  // ----------------------------------------------------
  await test('Test 6: Session verification via /api/auth/me', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${studentAToken}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.authenticated, true);
    assert.strictEqual(data.user.id, studentAId);
    assert.strictEqual(data.user.role, 'student');
  });

  // ----------------------------------------------------
  // TEST 7: Payment Flow, Webhook Verification & Entitlement
  // ----------------------------------------------------
  await test('Test 7: Payment verification & entitlement upgrade for Student A', async () => {
    const tranId = `TEST_TRAN_${Date.now()}`;
    const valId = `VAL_${Date.now()}_MOCK`;

    // 7.1 Verify initial plan is free
    const initialSubRes = await fetch(`${BASE_URL}/api/payment/subscription`, {
      headers: { Authorization: `Bearer ${studentAToken}` }
    });
    const initialSub = await initialSubRes.json();
    assert.strictEqual(initialSub.tier, 'free', 'Initial plan must be free');

    // 7.2 Simulate SSLCommerz verified payment success callback for Student A
    const payRes = await fetch(`${BASE_URL}/api/payment/sslcommerz/success`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        tran_id: tranId,
        val_id: valId,
        amount: '499',
        currency: 'BDT',
        card_type: 'VISA-Nagad',
        userId: studentAId,
        userEmail: studentAEmail,
        planId: 'n5_pro'
      })
    });
    assert.strictEqual(payRes.status, 200, `Payment callback must return 200. Got: ${payRes.status}`);
    const payData = await payRes.json();
    assert.strictEqual(payData.success, true);
    assert.strictEqual(payData.tier, 'n5_pro');

    // 7.3 Verify Student A subscription is now ACTIVE with n5_pro
    const updatedSubRes = await fetch(`${BASE_URL}/api/payment/subscription`, {
      headers: { Authorization: `Bearer ${studentAToken}` }
    });
    const updatedSub = await updatedSubRes.json();
    assert.strictEqual(updatedSub.tier, 'n5_pro', 'Subscription tier must be upgraded to n5_pro');
    assert.strictEqual(updatedSub.status, 'active', 'Subscription status must be active');
    assert.strictEqual(updatedSub.limits?.mockExamsAllowed, true, 'Paid features must be unlocked');

    // 7.4 Idempotency Check: Resending the exact same callback must not crash or duplicate
    const dupeRes = await fetch(`${BASE_URL}/api/payment/sslcommerz/success`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        tran_id: tranId,
        val_id: valId,
        amount: '499',
        currency: 'BDT',
        userId: studentAId,
        userEmail: studentAEmail,
        planId: 'n5_pro'
      })
    });
    assert.strictEqual(dupeRes.status, 200, 'Duplicate payment callback must return 200 safely');
    const dupeData = await dupeRes.json();
    assert.strictEqual(dupeData.success, true, 'Duplicate payment callback must succeed idempotently');

    // 7.5 Failed Payment simulation does not grant paid access
    const failTranId = `TEST_FAIL_${Date.now()}`;
    const failRes = await fetch(`${BASE_URL}/api/payment/sslcommerz/fail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        tran_id: failTranId,
        error: 'Insufficient funds in customer wallet',
        userId: studentBId
      })
    });
    assert.strictEqual(failRes.status, 400, 'Failed payment must return 400');

    // Student B must still remain free
    const subBRes = await fetch(`${BASE_URL}/api/payment/subscription`, {
      headers: { Authorization: `Bearer ${studentBToken}` }
    });
    const subB = await subBRes.json();
    assert.strictEqual(subB.tier, 'free', 'Failed payment must NOT upgrade Student B');

    // 7.6 Cancelled Payment simulation does not grant paid access
    const cancelTranId = `TEST_CANCEL_${Date.now()}`;
    const cancelRes = await fetch(`${BASE_URL}/api/payment/sslcommerz/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        tran_id: cancelTranId,
        userId: studentBId
      })
    });
    assert.strictEqual(cancelRes.status, 200, 'Cancelled payment endpoint responds');
    const cancelData = await cancelRes.json();
    assert.strictEqual(cancelData.status, 'cancelled');

    // Student B remains free
    const subBAfterCancel = await (await fetch(`${BASE_URL}/api/payment/subscription`, {
      headers: { Authorization: `Bearer ${studentBToken}` }
    })).json();
    assert.strictEqual(subBAfterCancel.tier, 'free', 'Cancelled payment must NOT upgrade Student B');
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
