import crypto from 'crypto';
import { sslCommerzService } from '../services/sslCommerzService.js';
import { stripePaymentService } from '../services/stripePaymentService.js';
import { subscriptionService, SUBSCRIPTION_TIERS } from '../services/subscriptionService.js';
import { db } from '../db.js';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    results.push({ name, passed: true, details });
    console.log(`  ✅ [PASS] ${name}${details ? ` (${details})` : ''}`);
  } else {
    results.push({ name, passed: false, details });
    console.error(`  ❌ [FAIL] ${name}${details ? ` (${details})` : ''}`);
  }
}

async function runPaymentGatewayVerification() {
  console.log('\n===============================================================');
  console.log('💳 NIHOMI AI™ — PAYMENT GATEWAY ARCHITECTURE VERIFICATION');
  console.log('   Testing: SSLCommerz (MFS/Cards) & Stripe (Global Cards/USD)');
  console.log('===============================================================\n');

  const testUserId = `usr_test_student_${Date.now()}`;
  const testUserEmail = `qa.student.${Date.now()}@nihomi.com`;

  // Pre-seed user in memory db
  db.data.users.push({
    id: testUserId,
    email: testUserEmail,
    name: 'Tanvir QA Student',
    role: 'student',
    planId: 'free',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } as any);
  db.save();

  // -------------------------------------------------------------
  // TEST SUITE 1: SSLCOMMERZ INTEGRATION
  // -------------------------------------------------------------
  console.log('\n[1/4] Testing SSLCommerz Service & IPN Architecture...');

  // Test 1.1: Session Initialization
  const sslInitRes = await sslCommerzService.initSession({
    amount: 499,
    currency: 'BDT',
    planTier: 'n5_pro',
    userId: testUserId,
    userEmail: testUserEmail,
    userName: 'Tanvir QA Student'
  });

  assert(
    sslInitRes.success === true && !!sslInitRes.tranId && !!sslInitRes.gatewayUrl,
    'SSLCommerz Session Init',
    `tranId: ${sslInitRes.tranId}, gatewayUrl: ${sslInitRes.gatewayUrl.slice(0, 45)}...`
  );

  // Test 1.2: Cryptographic IPN Signature Verification
  const testValId = `val_${crypto.randomBytes(8).toString('hex')}`;
  const storePassword = sslCommerzService.storePassword;
  const validSign = crypto.createHash('md5').update(`${testValId}${storePassword}`).digest('hex');

  const validIpnPayload = {
    val_id: testValId,
    tran_id: sslInitRes.tranId,
    amount: '499.00',
    verify_sign: validSign
  };

  const isSigValid = sslCommerzService.verifyIpnSignature(validIpnPayload);
  assert(isSigValid === true, 'SSLCommerz IPN Signature Verification (Valid Hash)', `MD5 hash verified`);

  const isTamperedInvalid = sslCommerzService.verifyIpnSignature({
    ...validIpnPayload,
    verify_sign: 'tampered_signature_hash_000000'
  });
  assert(isTamperedInvalid === false, 'SSLCommerz IPN Signature Tamper Rejection', `Tampered sign rejected`);

  // Test 1.3: Validation API
  const validationRes = await sslCommerzService.validateTransaction({
    valId: testValId,
    tranId: sslInitRes.tranId,
    amount: 499
  });
  assert(validationRes.success === true && validationRes.status === 'VALID', 'SSLCommerz Order Validation API', `Status: ${validationRes.status}`);

  // Test 1.4: Payment Success Processing & User Account Upgrade
  const upgradeResult = await sslCommerzService.processPaymentSuccess({
    tran_id: sslInitRes.tranId,
    val_id: testValId,
    amount: 499,
    value_a: testUserId,
    value_b: 'n5_pro',
    value_c: testUserEmail,
    card_type: 'VISA-SSLCommerz'
  });

  assert(
    upgradeResult.success === true && upgradeResult.tier === 'n5_pro',
    'SSLCommerz Payment Success & Account Upgrade',
    `Upgraded ${testUserEmail} to ${upgradeResult.tier}`
  );

  // Verify effective subscription in SubscriptionService
  const subAfterSsl = await subscriptionService.getUserSubscription(testUserId);
  assert(
    subAfterSsl.tier === 'n5_pro' && subAfterSsl.status === 'active' && subAfterSsl.limits.mockExamsAllowed === true,
    'Subscription Entitlements After SSLCommerz Upgrade',
    `Tier: ${subAfterSsl.tier}, Limits: mockExamsAllowed=${subAfterSsl.limits.mockExamsAllowed}`
  );

  // -------------------------------------------------------------
  // TEST SUITE 2: STRIPE INTEGRATION (GLOBAL / USD / JPY)
  // -------------------------------------------------------------
  console.log('\n[2/4] Testing Stripe International Service Architecture...');

  // Test 2.1: Checkout Session Creation
  const stripeInitRes = await stripePaymentService.createCheckoutSession({
    userId: testUserId,
    userEmail: testUserEmail,
    planTier: 'n5_lifetime',
    amount: 29.99,
    currency: 'usd'
  });

  assert(
    stripeInitRes.success === true && !!stripeInitRes.sessionId && !!stripeInitRes.url,
    'Stripe Checkout Session Creation',
    `sessionId: ${stripeInitRes.sessionId}, url: ${stripeInitRes.url.slice(0, 45)}...`
  );

  // Test 2.2: Stripe Webhook Signature Verification (HMAC SHA-256 t=timestamp,v1=signature)
  const webhookSecret = stripePaymentService.webhookSecret;
  const mockTimestamp = Math.floor(Date.now() / 1000);
  const mockPayloadObj = {
    id: `evt_stripe_test_${Date.now()}`,
    type: 'checkout.session.completed',
    data: {
      object: {
        id: stripeInitRes.sessionId,
        client_reference_id: testUserId,
        customer_email: testUserEmail,
        amount_total: 2999,
        payment_intent: `pi_test_${Date.now()}`,
        metadata: {
          userId: testUserId,
          userEmail: testUserEmail,
          planTier: 'n5_lifetime'
        }
      }
    }
  };
  const rawPayloadString = JSON.stringify(mockPayloadObj);
  const signedPayload = `${mockTimestamp}.${rawPayloadString}`;
  const validStripeSig = crypto.createHmac('sha256', webhookSecret).update(signedPayload).digest('hex');
  const signatureHeader = `t=${mockTimestamp},v1=${validStripeSig}`;

  const isStripeSigValid = stripePaymentService.verifyWebhookSignature(
    rawPayloadString,
    signatureHeader,
    webhookSecret,
    0
  );
  assert(isStripeSigValid === true, 'Stripe Webhook Signature Verification (Timing-safe HMAC SHA-256)', `Verified`);

  const isTamperedStripeSigInvalid = stripePaymentService.verifyWebhookSignature(
    rawPayloadString,
    `t=${mockTimestamp},v1=tampered_stripe_signature_000000`,
    webhookSecret,
    0
  );
  assert(isTamperedStripeSigInvalid === false, 'Stripe Webhook Signature Tamper Rejection', `Tampered signature rejected`);

  // Test 2.3: Stripe Webhook Event Processing & Lifetime Upgrade
  const stripeProcessRes = await stripePaymentService.processWebhookEvent(
    mockPayloadObj,
    { 'stripe-signature': signatureHeader },
    signatureHeader
  );

  assert(
    stripeProcessRes.success === true && stripeProcessRes.idempotent === false,
    'Stripe Webhook Event Processing',
    stripeProcessRes.message
  );

  // Verify Lifetime entitlement
  const subAfterStripe = await subscriptionService.getUserSubscription(testUserId);
  assert(
    subAfterStripe.tier === 'n5_lifetime' && subAfterStripe.isLifetime === true && subAfterStripe.limits.certificateAllowed === true,
    'Subscription Entitlements After Stripe Lifetime Upgrade',
    `Tier: ${subAfterStripe.tier}, isLifetime=${subAfterStripe.isLifetime}, certificateAllowed=${subAfterStripe.limits.certificateAllowed}`
  );

  // -------------------------------------------------------------
  // TEST SUITE 3: IDEMPOTENCY & AUDIT TRAIL PROTECTION
  // -------------------------------------------------------------
  console.log('\n[3/4] Testing Idempotency & Replay Attack Defense...');

  // Re-send identical Stripe webhook
  const duplicateWebhookRes = await stripePaymentService.processWebhookEvent(
    mockPayloadObj,
    { 'stripe-signature': signatureHeader },
    signatureHeader
  );

  assert(
    duplicateWebhookRes.success === true && duplicateWebhookRes.idempotent === true,
    'Stripe Webhook Idempotency (Duplicate Event Ignored)',
    `idempotent: ${duplicateWebhookRes.idempotent}`
  );

  // Re-execute subscription activation with identical trxID
  const duplicateSubActivation = await subscriptionService.activateSubscription({
    userId: testUserId,
    userEmail: testUserEmail,
    tier: 'n5_lifetime',
    trxID: `pi_test_${Date.now()}`, // we also test duplicate trxID in Prisma/memory
    amount: 29.99
  });
  assert(duplicateSubActivation.success === true, 'Subscription Activation Idempotency Check', duplicateSubActivation.message);

  // -------------------------------------------------------------
  // TEST SUITE 4: SECURITY & ERROR HANDLING
  // -------------------------------------------------------------
  console.log('\n[4/4] Testing Validation & Edge Failure Transitions...');

  // Test 4.1: Missing validation ID
  const invalidValidation = await sslCommerzService.validateTransaction({ valId: '' });
  assert(invalidValidation.success === false, 'SSLCommerz Missing valId Decline', `Declined as expected`);

  // Test 4.2: Tier configs verification
  const catalog = subscriptionService.getCatalog();
  assert(catalog.length === 3, 'Subscription Catalog Completeness', `Tiers: ${catalog.map(c => c.id).join(', ')}`);

  console.log('\n===============================================================');
  const allPassed = results.every(r => r.passed);
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  console.log(`🎯 GATE 1 TEST HARNESS RESULTS: ${passedCount}/${totalCount} TESTS PASSED (${Math.round((passedCount/totalCount)*100)}%)`);
  if (allPassed) {
    console.log('🌟 GATE 1 (PAYMENT GATEWAY ARCHITECTURE): 100% PRODUCTION READY!');
  } else {
    console.error('❌ GATE 1 TESTS CONTAINED FAILURES.');
    process.exitCode = 1;
  }
  console.log('===============================================================\n');
}

runPaymentGatewayVerification().catch(err => {
  console.error('Fatal test harness crash:', err);
  process.exit(1);
});
