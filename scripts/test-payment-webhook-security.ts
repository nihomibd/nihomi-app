// scripts/test-payment-webhook-security.ts
// Automated Test Suite for NIHOMI WP12: Live Payment Gateway Cryptographic Webhook & Anti-Fraud Idempotency Hardening
// Governed by Law 7 (Commercial Fairness) & Law 10 (Production Rigor & Verification Evidence)

import crypto from 'crypto';
import assert from 'assert';
import { db } from '../server/db.js';
import {
  verifyHmacSignature,
  verifySSLCommerzIPN,
  verifySSLCommerzHash,
  verifyStripeSignature,
  PaymentProviderFactory
} from '../server/services/paymentProviders.js';

console.log('========================================================================');
console.log('🔒 NIHOMI WP12: PAYMENT SECURITY, HMAC WEBHOOK & IDEMPOTENCY SUITE');
console.log('========================================================================\n');

let totalTests = 0;
let passedTests = 0;
const failures: string[] = [];

async function runTest(name: string, fn: () => void | Promise<void>) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✅ [PASS] ${name}`);
  } catch (err: any) {
    failures.push(`${name}: ${err.message}`);
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function main() {
  const bkashSecret = process.env.BKASH_WEBHOOK_SECRET || process.env.BKASH_APP_SECRET || 'bkash_nihomi_webhook_secret_2026';
  const sslSecret = process.env.SSLCOMMERZ_STORE_PASSWORD || process.env.STORE_PASSWORD || 'sslcommerz_nihomi_live_store_pass_2026';
  const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_nihomi_production_webhook_secret';

  // -------------------------------------------------------------
  // Test Group 1: Cryptographic HMAC Signature Algorithms
  // -------------------------------------------------------------
  console.log('[1/5] Testing Cryptographic Signature Verifiers (HMAC SHA-256 & MD5)...');

  await runTest('verifyHmacSignature validates authentic HMAC SHA-256 signature', () => {
    const payload = { event: 'payment.success', amount: 499, trxId: 'BK12345678' };
    const raw = JSON.stringify(payload);
    const signature = crypto.createHmac('sha256', bkashSecret).update(raw).digest('hex');

    const isValid = verifyHmacSignature(raw, signature, bkashSecret, 'sha256');
    assert.strictEqual(isValid, true, 'Valid signature should verify successfully');
  });

  await runTest('verifyHmacSignature rejects tampered payload or forged signature', () => {
    const payload = { event: 'payment.success', amount: 499, trxId: 'BK12345678' };
    const raw = JSON.stringify(payload);
    const forgedSig = 'a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef';

    const isValid = verifyHmacSignature(raw, forgedSig, bkashSecret, 'sha256');
    assert.strictEqual(isValid, false, 'Forged signature must be rejected');

    const tamperedPayload = JSON.stringify({ ...payload, amount: 1 });
    const signature = crypto.createHmac('sha256', bkashSecret).update(raw).digest('hex');
    const isTamperedValid = verifyHmacSignature(tamperedPayload, signature, bkashSecret, 'sha256');
    assert.strictEqual(isTamperedValid, false, 'Tampered payload with valid original signature must be rejected');
  });

  await runTest('verifySSLCommerzIPN validates authentic MD5 IPN verify_sign hash', () => {
    const valId = `VALID_${Date.now()}`;
    const secretMd5 = crypto.createHash('md5').update(sslSecret).digest('hex');
    const verifySign = crypto.createHash('md5').update(`val_id=${valId}&${secretMd5}`).digest('hex');

    const payload = {
      val_id: valId,
      verify_sign: verifySign,
      verify_key: 'val_id',
      status: 'VALID',
      amount: '499.00'
    };

    const isValid = verifySSLCommerzIPN(payload, sslSecret);
    assert.strictEqual(isValid, true, 'Valid SSLCommerz IPN hash should pass');
  });

  await runTest('verifySSLCommerzIPN rejects invalid or forged hash', () => {
    const payload = {
      val_id: `VALID_${Date.now()}`,
      verify_sign: 'fake_md5_hash_000000000000000000000',
      verify_key: 'val_id',
      status: 'VALID'
    };
    const isValid = verifySSLCommerzIPN(payload, sslSecret);
    assert.strictEqual(isValid, false, 'Forged SSLCommerz IPN must be rejected');
  });

  await runTest('verifyStripeSignature validates official Stripe t=timestamp,v1=signature format', () => {
    const payload = JSON.stringify({ id: 'evt_stripe_test_1', type: 'payment_intent.succeeded' });
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signedPayload = `${timestamp}.${payload}`;
    const signature = crypto.createHmac('sha256', stripeSecret).update(signedPayload).digest('hex');
    const header = `t=${timestamp},v1=${signature}`;

    const isValid = verifyStripeSignature(payload, header, stripeSecret);
    assert.strictEqual(isValid, true, 'Stripe timestamped signature header should pass');
  });

  await runTest('verifyStripeSignature rejects missing or tampered Stripe signature', () => {
    const payload = JSON.stringify({ id: 'evt_stripe_test_2', type: 'payment_intent.succeeded' });
    assert.strictEqual(verifyStripeSignature(payload, undefined, stripeSecret), false);
    assert.strictEqual(verifyStripeSignature(payload, 't=123,v1=invalidsig', stripeSecret), false);
  });

  // -------------------------------------------------------------
  // Test Group 2: Provider Adapter Webhook Handlers
  // -------------------------------------------------------------
  console.log('\n[2/5] Testing Provider Adapter Webhook Verifications (bKash, SSLCommerz, Stripe)...');

  await runTest('bKash adapter handleWebhook rejects missing signature', async () => {
    const bkashAdapter = PaymentProviderFactory.getProvider('bkash');
    const payload = { paymentID: 'BK-TEST-001', transactionStatus: 'Completed', amount: '499.00' };
    const result = await bkashAdapter.handleWebhook(payload, undefined);
    assert.strictEqual(result.valid, false, 'Missing signature must result in valid=false');
  });

  await runTest('bKash adapter handleWebhook accepts authentic signature', async () => {
    const bkashAdapter = PaymentProviderFactory.getProvider('bkash');
    const payload = { paymentID: 'BK-TEST-002', transactionStatus: 'Completed', amount: '499.00' };
    const raw = JSON.stringify(payload);
    const sig = crypto.createHmac('sha256', bkashSecret).update(raw).digest('hex');

    const result = await bkashAdapter.handleWebhook(payload, sig, {}, raw);
    assert.strictEqual(result.valid, true, 'Valid signature must result in valid=true');
    assert.strictEqual(result.status, 'paid');
    assert.strictEqual(result.amount, 499);
  });

  await runTest('Stripe adapter handleWebhook validates authentic event payload', async () => {
    const stripeAdapter = PaymentProviderFactory.getProvider('stripe');
    const eventObj = {
      id: 'evt_stripe_valid_99',
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_test_99', amount: 49900, metadata: { paymentId: 'pay_test_99' } } }
    };
    const raw = JSON.stringify(eventObj);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const sig = crypto.createHmac('sha256', stripeSecret).update(`${timestamp}.${raw}`).digest('hex');
    const header = `t=${timestamp},v1=${sig}`;

    const result = await stripeAdapter.handleWebhook(eventObj, header, {}, raw);
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.status, 'paid');
    assert.strictEqual(result.amount, 499);
    assert.strictEqual(result.paymentId, 'pay_test_99');
  });

  // -------------------------------------------------------------
  // Test Group 3: Idempotency & Replay Defense
  // -------------------------------------------------------------
  console.log('\n[3/5] Testing Atomic Idempotency & Duplicate Webhook Replay Locks...');

  const idempotencyEventId = `bk-idemp-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  let testUserId = 'test_user_idempotency_1';

  // Seed user if not present
  if (!db.findUserById(testUserId)) {
    const seeded = db.createUser({
      email: 'idempotency_student@nihomi.com',
      password: 'testPassword123!',
      displayName: 'Idempotency Student'
    });
    testUserId = seeded.user.id;
  }

  // Create test payment for 499 BDT
  const testPayment = db.createPayment({
    userId: testUserId,
    planId: 'pro',
    planName: 'Nihomi Pro Monthly',
    billingInterval: 'monthly',
    amount: 499,
    originalAmount: 499,
    discountAmount: 0,
    provider: 'bkash'
  });

  await runTest('First webhook processing atomically marks payment as paid and event as success', () => {
    const res1 = db.processWebhookTransactionAtomic({
      eventId: idempotencyEventId,
      provider: 'bkash',
      eventType: 'bKash.PaymentSuccess',
      paymentId: testPayment.id,
      providerTransactionId: `TRX-${idempotencyEventId}`,
      amount: 499,
      signatureVerified: true
    });

    assert.strictEqual(res1.success, true);
    assert.strictEqual(res1.idempotent, false, 'First delivery should not be marked idempotent');
    assert.strictEqual(res1.event.status, 'success');
    assert.strictEqual(res1.event.processed, true);

    const updatedPayment = db.getPaymentById(testPayment.id);
    assert.strictEqual(updatedPayment?.status, 'paid');
  });

  await runTest('Duplicate webhook delivery with identical eventId returns idempotent=true without double-billing', () => {
    // Record user coin balance before duplicate webhook
    const initialWallet = db.getUserWallet(testUserId);
    const initialCoins = initialWallet.coinBalance;

    const res2 = db.processWebhookTransactionAtomic({
      eventId: idempotencyEventId,
      provider: 'bkash',
      eventType: 'bKash.PaymentSuccess',
      paymentId: testPayment.id,
      providerTransactionId: `TRX-${idempotencyEventId}`,
      amount: 499,
      signatureVerified: true
    });

    assert.strictEqual(res2.success, true);
    assert.strictEqual(res2.idempotent, true, 'Duplicate delivery MUST be marked idempotent: true');

    // Confirm coins did not increment a second time
    const postWallet = db.getUserWallet(testUserId);
    assert.strictEqual(postWallet.coinBalance, initialCoins, 'Duplicate webhook must NOT double-credit coins');
  });

  // -------------------------------------------------------------
  // Test Group 4: Anti-Fraud Price Tampering Defense
  // -------------------------------------------------------------
  console.log('\n[4/5] Testing Anti-Fraud Price Tampering Rejection...');

  const tamperPayment = db.createPayment({
    userId: testUserId,
    planId: 'japan_ready',
    planName: 'Nihomi Japan-Ready Premium',
    billingInterval: 'monthly',
    amount: 1499,
    originalAmount: 1499,
    discountAmount: 0,
    provider: 'bkash'
  });

  await runTest('Webhook with tampered price (1 BDT instead of 1499 BDT) is rejected immediately', () => {
    const tamperEventId = `bk-tamper-${Date.now()}`;
    const result = db.processWebhookTransactionAtomic({
      eventId: tamperEventId,
      provider: 'bkash',
      eventType: 'bKash.PaymentSuccess',
      paymentId: tamperPayment.id,
      providerTransactionId: `TRX-${tamperEventId}`,
      amount: 1, // Malicious forged amount!
      signatureVerified: true
    });

    assert.strictEqual(result.success, false, 'Tampered price must be rejected');
    assert(result.error?.includes('Price tampering rejected'), `Expected price tampering error, got: ${result.error}`);

    const refreshedPayment = db.getPaymentById(tamperPayment.id);
    assert.strictEqual(refreshedPayment?.status, 'failed', 'Tampered payment status must be marked failed');
  });

  // -------------------------------------------------------------
  // Test Group 5: Automated Pending Transaction Reconciliation
  // -------------------------------------------------------------
  console.log('\n[5/5] Testing Automated Pending Transaction Reconciliation...');

  // Create an orphaned pending payment with matching successful webhook event
  const orphanPayment = db.createPayment({
    userId: testUserId,
    planId: 'pro',
    planName: 'Nihomi Pro Monthly',
    billingInterval: 'monthly',
    amount: 499,
    originalAmount: 499,
    discountAmount: 0,
    provider: 'bkash'
  });

  const matchingEventId = `bk-match-${Date.now()}`;
  db.recordWebhookEvent({
    eventId: matchingEventId,
    provider: 'bkash',
    eventType: 'bKash.PaymentSuccess',
    status: 'success',
    payloadReference: orphanPayment.id
  });

  // Create an expired pending payment (> 25 hours old)
  const expiredPayment = db.createPayment({
    userId: testUserId,
    planId: 'pro',
    planName: 'Nihomi Pro Monthly',
    billingInterval: 'monthly',
    amount: 499,
    originalAmount: 499,
    discountAmount: 0,
    provider: 'bkash'
  });
  expiredPayment.createdAt = new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString();

  await runTest('reconcilePendingPayments resolves orphaned payments and marks expired ones', () => {
    const reconciliation = db.reconcilePendingPayments(24);

    assert(reconciliation.totalChecked >= 2, 'Should check at least the 2 pending payments');
    assert(reconciliation.reconciled >= 1, 'Should reconcile the payment with matched webhook');
    assert(reconciliation.expired >= 1, 'Should expire the 26-hour-old pending payment');

    const reconciledOrphan = db.getPaymentById(orphanPayment.id);
    assert.strictEqual(reconciledOrphan?.status, 'paid', 'Orphaned payment must be transitioned to paid');

    const reconciledExpired = db.getPaymentById(expiredPayment.id);
    assert.strictEqual(reconciledExpired?.status, 'failed', 'Expired payment must be transitioned to failed');
  });

  // -------------------------------------------------------------
  // Final Scorecard
  // -------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`🏁 TEST EXECUTION COMPLETE: ${passedTests}/${totalTests} PASSED`);
  console.log('========================================================================');

  if (failures.length > 0) {
    console.error(`\n❌ ${failures.length} Test(s) Failed:`);
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  } else {
    console.log('🎉 ALL PAYMENT SECURITY, CRYPTOGRAPHIC HMAC & IDEMPOTENCY TESTS PASSED (100%)!\n');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
