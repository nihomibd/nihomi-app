// scripts/test-payment-durability-database.ts
// NIHOMI.COM — PAYMENT DATABASE-BACKED DURABILITY & RESTART RESILIENCE TEST SUITE
// Proves that idempotency, transaction deduplication, and payment state survive
// complete process-local memory resets (wiped Maps/Sets simulating server restart or multi-instance load balancing).

import express from 'express';
import http from 'http';
import {
  paymentRouter,
  idempotencyRegistry,
  paymentAttemptRegistry,
  processedTrxRegistry,
  getDurableIdempotency,
  getDurablePaymentAttempt,
  isDurableTrxProcessed
} from '../server/routes/payment.ts';
import { db } from '../server/db.ts';

const app = express();
app.use(express.json());
app.use('/api/payment', paymentRouter);

async function runDurabilityTests() {
  console.log('================================================================');
  console.log('🧪 NIHOMI.COM — PAYMENT DATABASE DURABILITY & RESTART RESILIENCE');
  console.log('================================================================\n');

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
    // Test 1: Idempotency Created and Persisted to Durable Database
    // -------------------------------------------------------------
    console.log('[Test 1] Idempotency creation and durable persistence...');
    const testIdempKey = `idemp_durable_${Date.now()}`;
    const testUser = `usr_dur_${Date.now()}`;

    const createRes = await fetch(`${baseUrl}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'idempotency-key': testIdempKey
      },
      body: JSON.stringify({
        userId: testUser,
        tier: 'pro',
        interval: 'monthly',
        idempotencyKey: testIdempKey,
        mock: true
      })
    });

    const createBody = await createRes.json();
    assert(createBody.success === true, 'Initial payment session creation succeeded');
    const paymentID = createBody.paymentID;
    assert(Boolean(paymentID), 'Received paymentID: ' + paymentID);

    // -------------------------------------------------------------
    // Test 2: In-Memory Wipe (Simulating Server Restart / Multi-Worker)
    // -------------------------------------------------------------
    console.log('\n[Test 2] Simulating server restart (Wiping all process-local Maps)...');
    idempotencyRegistry.clear();
    paymentAttemptRegistry.clear();
    processedTrxRegistry.clear();
    assert(idempotencyRegistry.size === 0, 'idempotencyRegistry completely emptied');
    assert(paymentAttemptRegistry.size === 0, 'paymentAttemptRegistry completely emptied');
    assert(processedTrxRegistry.size === 0, 'processedTrxRegistry completely emptied');

    // -------------------------------------------------------------
    // Test 3: getDurableIdempotency recovers from durable database
    // -------------------------------------------------------------
    console.log('\n[Test 3] Recovering idempotency record from durable database...');
    const recoveredIdemp = await getDurableIdempotency(testIdempKey);
    assert(recoveredIdemp !== null, 'Idempotency record recovered from database after in-memory wipe');
    assert(recoveredIdemp?.response?.paymentID === paymentID, 'Recovered matching paymentID: ' + recoveredIdemp?.response?.paymentID);

    // HTTP Replay test with wiped memory
    const replayRes = await fetch(`${baseUrl}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'idempotency-key': testIdempKey
      },
      body: JSON.stringify({
        userId: testUser,
        tier: 'pro',
        interval: 'monthly',
        idempotencyKey: testIdempKey,
        mock: true
      })
    });
    const replayBody = await replayRes.json();
    assert(replayRes.headers.get('x-idempotent-replay') === 'true', 'Server responded with X-Idempotent-Replay header from database');
    assert(replayBody.paymentID === paymentID, 'Replayed identical paymentID from database storage');

    // -------------------------------------------------------------
    // Test 4: Complete Payment and Wipe Memory Again
    // -------------------------------------------------------------
    console.log('\n[Test 4] Completing payment and wiping memory to test replay defense...');
    const mockTrxID = `TRX_DUR_${Date.now()}`;
    const cbRes = await fetch(`${baseUrl}/callback?paymentID=${paymentID}&status=success&mock=true`, {
      redirect: 'manual'
    });
    // In mock mode callback activates subscription or redirects
    console.log('  Payment callback completed with status: ' + cbRes.status);

    // Wipe memory again
    idempotencyRegistry.clear();
    paymentAttemptRegistry.clear();
    processedTrxRegistry.clear();

    // -------------------------------------------------------------
    // Test 5: Replay Callback Defense with Wiped In-Memory Registry
    // -------------------------------------------------------------
    console.log('\n[Test 5] Replay callback defense against duplicate charge with cold/wiped memory...');
    const replayCbRes = await fetch(`${baseUrl}/callback?paymentID=${paymentID}&status=success`, {
      redirect: 'manual'
    });
    const loc = replayCbRes.headers.get('location') || '';
    assert(loc.includes('deduplicated=true'), 'Callback correctly identified deduplicated=true from database persistence');

    // -------------------------------------------------------------
    // Test 6: Direct Execute Deduplication with Cold Memory
    // -------------------------------------------------------------
    console.log('\n[Test 6] Direct execute deduplication with cold memory...');
    idempotencyRegistry.clear();
    paymentAttemptRegistry.clear();
    processedTrxRegistry.clear();

    const execRes = await fetch(`${baseUrl}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentID })
    });
    const execBody = await execRes.json();
    assert(execBody.success === true && execBody.deduplicated === true, 'Direct execute safely recovered payment state and returned deduplicated=true');

    // -------------------------------------------------------------
    // Test 7: Reconcile Endpoint with Cold Memory
    // -------------------------------------------------------------
    console.log('\n[Test 7] Status reconciliation endpoint with cold memory...');
    idempotencyRegistry.clear();
    paymentAttemptRegistry.clear();
    processedTrxRegistry.clear();

    const recRes = await fetch(`${baseUrl}/reconcile/${paymentID}`);
    const recBody = await recRes.json();
    assert(recBody.success === true, 'Reconciliation endpoint succeeded from persistent DB');
    assert(recBody.state === 'SUCCEEDED', 'Reconciliation retrieved SUCCEEDED state from database');
    assert(recBody.isTerminal === true, 'isTerminal is true, locking state against re-charge');

  } finally {
    server.close();
  }

  console.log('\n================================================================');
  console.log(`📊 DATABASE DURABILITY SUMMARY: Passed: ${passed} | Failed: ${failed}`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runDurabilityTests().catch((err) => {
  console.error('Durability test error:', err);
  process.exit(1);
});
