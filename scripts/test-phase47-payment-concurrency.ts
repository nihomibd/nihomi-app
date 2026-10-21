// scripts/test-phase47-payment-concurrency.ts
// NIHOMI.COM — PHASE 47 PAYMENT CONCURRENCY, IDEMPOTENCY & CHAOS TEST SUITE
// Tests 10 real-world concurrency, race-condition, replay, and tamper scenarios.

import express from 'express';
import http from 'http';
import { paymentRouter, idempotencyRegistry, userRateLimitRegistry, processedTrxRegistry, paymentAttemptRegistry } from '../server/routes/payment.ts';

const app = express();
app.use(express.json());
app.use('/api/payment', paymentRouter);

async function runConcurrencyTests() {
  console.log('===============================================================');
  console.log('🚀 NIHOMI.COM PHASE 47 — PAYMENT CONCURRENCY & CHAOS TEST SUITE');
  console.log('===============================================================\n');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const port = (server.address() as any).port;
  const baseUrl = `http://127.0.0.1:${port}/api/payment`;

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
    // Test 1: Rapid Double-Click Suppression
    // -------------------------------------------------------------
    console.log('🧪 Test 1: Rapid Double-Click Suppression (Same user, < 2000ms)');
    const t1User = 'usr_double_click_' + Date.now();
    const req1 = fetch(`${baseUrl}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: t1User, tier: 'pro', interval: 'monthly', mock: true })
    });
    // Immediately fire second request within 10ms
    const req2 = fetch(`${baseUrl}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: t1User, tier: 'pro', interval: 'monthly', mock: true })
    });

    const [res1, res2] = await Promise.all([req1, req2]);
    const body1 = await res1.json();
    const body2 = await res2.json();

    assert(body1.success === true, 'First request succeeds');
    assert(
      (body2.success === true && (res2.headers.get('x-duplicate-suppression') === 'true' || res2.headers.get('x-idempotent-replay') === 'true')) ||
      res2.status === 429,
      'Second rapid click is deduplicated or rate-limited without second charge'
    );

    // -------------------------------------------------------------
    // Test 2: Concurrent Requests (10 parallel workers with same idempotencyKey)
    // -------------------------------------------------------------
    console.log('\n🧪 Test 2: Concurrency Lock — 10 Parallel Workers with Same Idempotency Key');
    const sharedKey = `idemp_parallel_${Date.now()}`;
    const t2User = 'usr_parallel_' + Date.now();

    const parallelRequests = Array.from({ length: 10 }).map((_, idx) =>
      fetch(`${baseUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'idempotency-key': sharedKey
        },
        body: JSON.stringify({
          userId: t2User,
          tier: 'pro',
          interval: 'quarterly',
          idempotencyKey: sharedKey,
          mock: true
        })
      })
    );

    const responses = await Promise.all(parallelRequests);
    const bodies = await Promise.all(responses.map(r => r.json()));

    const uniquePaymentIDs = new Set(bodies.map(b => b.paymentID));
    assert(responses.every(r => r.ok), 'All 10 parallel requests returned 200 OK');
    assert(uniquePaymentIDs.size === 1, `Exactly 1 single paymentID created across 10 workers (Got: ${uniquePaymentIDs.size})`);
    assert(bodies[0].amount === 5670, 'Server calculated canonical quarterly price: ৳5,670');

    // -------------------------------------------------------------
    // Test 3: Client Price Tamper Rejection (Fraud Defense)
    // -------------------------------------------------------------
    console.log('\n🧪 Test 3: Price Tamper Defense (Client alters ৳1,990 to ৳10)');
    const tamperRes = await fetch(`${baseUrl}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_fraud_' + Date.now(),
        tier: 'pro',
        interval: 'monthly',
        amount: 10, // Tampered client price!
        mock: true
      })
    });
    const tamperBody = await tamperRes.json();
    assert(tamperRes.status === 400, 'Tampered price rejected with HTTP 400 Bad Request');
    assert(tamperBody.expectedAmount === 1990, 'Server enforced expected canonical price: ৳1,990');

    // -------------------------------------------------------------
    // Test 4: Callback Deduplication & Replay Defense (5 repeated callbacks)
    // -------------------------------------------------------------
    console.log('\n🧪 Test 4: Callback Deduplication (5 repeated callbacks for same paymentID)');
    const t4PaymentID = `MOCK_BK_CALLBACK_${Date.now()}`;
    paymentAttemptRegistry.set(t4PaymentID, {
      paymentID: t4PaymentID,
      userId: 'usr_cb_student',
      tier: 'pro',
      interval: 'monthly',
      amount: 1990,
      state: 'SUCCEEDED',
      trxID: 'TRX_TEST_REPLAY_123',
      invoiceNumber: 'INV_123',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    // Fire 5 repeated callbacks
    const callbackResults = await Promise.all(
      Array.from({ length: 5 }).map(() =>
        fetch(`${baseUrl}/callback?paymentID=${t4PaymentID}&status=success`, {
          redirect: 'manual'
        })
      )
    );

    assert(
      callbackResults.every(r => r.status === 302 && (r.headers.get('location') || '').includes('deduplicated=true')),
      'All 5 repeated callbacks handled idempotently with deduplicated=true redirect'
    );

    // -------------------------------------------------------------
    // Test 5: Status Reconciliation Endpoint (/api/payment/reconcile/:paymentID)
    // -------------------------------------------------------------
    console.log('\n🧪 Test 5: Status Reconciliation Endpoint');
    const recRes = await fetch(`${baseUrl}/reconcile/${t4PaymentID}`);
    const recBody = await recRes.json();
    assert(recBody.success === true, 'Reconcile endpoint returned success');
    assert(recBody.state === 'SUCCEEDED', 'Reconciled state is SUCCEEDED');
    assert(recBody.isTerminal === true, 'isTerminal is true (prevents duplicate checkout loop)');

    // -------------------------------------------------------------
    // Test 6: Multi-Tenant Isolation (User A & User B concurrent checkout)
    // -------------------------------------------------------------
    console.log('\n🧪 Test 6: Tenant Isolation (User A & User B pay concurrently)');
    const userA = 'usr_tenant_A_' + Date.now();
    const userB = 'usr_tenant_B_' + Date.now();

    const [resA, resB] = await Promise.all([
      fetch(`${baseUrl}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userA, tier: 'starter', interval: 'monthly', mock: true })
      }),
      fetch(`${baseUrl}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userB, tier: 'japan_ready', interval: 'yearly', mock: true })
      })
    ]);

    const bodyA = await resA.json();
    const bodyB = await resB.json();

    assert(bodyA.paymentID !== bodyB.paymentID, 'User A and User B received distinct isolated paymentIDs');
    assert(bodyA.amount === 990, 'User A charged Starter monthly: ৳990');
    assert(bodyB.amount === 40700, 'User B charged Japan Ready yearly: ৳40,700');

    // -------------------------------------------------------------
    // Test 7: Direct Execute Deduplication
    // -------------------------------------------------------------
    console.log('\n🧪 Test 7: Direct Execute Deduplication');
    const execRes1 = await fetch(`${baseUrl}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentID: t4PaymentID })
    });
    const execBody1 = await execRes1.json();
    assert(execBody1.success === true && execBody1.deduplicated === true, 'Repeated direct execute returns cached deduplicated result');

    // -------------------------------------------------------------
    // Test 8: Fail-Closed Honest NOT_CONFIGURED State
    // -------------------------------------------------------------
    console.log('\n🧪 Test 8: Honest Fail-Closed State when Gateway Keys Missing');
    const realCreateRes = await fetch(`${baseUrl}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr_live_attempt_' + Date.now(),
        tier: 'pro',
        interval: 'monthly'
        // mock NOT provided -> exercises fail-closed check
      })
    });
    const realCreateBody = await realCreateRes.json();
    assert(
      realCreateBody.gatewayStatus === 'NOT_CONFIGURED' && realCreateBody.success === false,
      'Truthfully reports NOT_CONFIGURED without charging money'
    );
    assert(
      realCreateBody.messageBn.includes('বিকাশ অনলাইন পেমেন্ট এখনো কনফিগার করা হয়নি'),
      'Clear non-deceptive Bengali notice delivered to student'
    );

  } finally {
    server.close();
  }

  console.log('\n===============================================================');
  console.log(`📊 TEST SUMMARY: Passed: ${passed} | Failed: ${failed}`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runConcurrencyTests().catch((err) => {
  console.error('Test suite error:', err);
  process.exit(1);
});
