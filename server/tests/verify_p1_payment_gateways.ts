import crypto from 'crypto';
import {
  BKashPaymentProvider,
  SSLCommerzPaymentProvider,
  StripePaymentProvider,
  PaymentProviderFactory,
  verifyHmacSignature,
  verifySSLCommerzHash
} from '../services/paymentProviders.js';
import { db } from '../db.js';
import { Payment } from '../types.js';

async function runPaymentTests() {
  console.log('===============================================================');
  console.log('💳 NIHOMI — P1-PAY-01 PAYMENT GATEWAYS & WEBHOOK VERIFICATION');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // Set test credentials for sandbox
  process.env.BKASH_APP_KEY = 'test_app_key';
  process.env.BKASH_APP_SECRET = 'test_app_secret';
  process.env.BKASH_USERNAME = 'test_user';
  process.env.BKASH_PASSWORD = 'test_pass';
  process.env.BKASH_WEBHOOK_SECRET = 'bkash_nihomi_webhook_secret_key_2026';
  process.env.SSLCOMMERZ_STORE_ID = 'nihomi_store';
  process.env.SSLCOMMERZ_STORE_PASSWORD = 'sslcommerz_nihomi_live_store_pass_2026';

  const origFetch = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = input.toString();
    const body = (init?.body as string) || '';

    if (url.includes('/tokenized/checkout/token/grant')) {
      return new Response(JSON.stringify({ statusCode: '0000', id_token: 'bkash_test_token', expires_in: 3600 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.includes('/tokenized/checkout/create')) {
      return new Response(
        JSON.stringify({
          statusCode: '0000',
          paymentID: 'BKASH-PAY-001',
          bkashURL: 'https://sandbox.bka.sh/checkout?paymentID=BKASH-PAY-001'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (url.includes('/tokenized/checkout/execute')) {
      const parsed = JSON.parse(body || '{}');
      return new Response(
        JSON.stringify({
          statusCode: '0000',
          transactionStatus: 'Completed',
          paymentID: parsed.paymentID,
          trxID: 'BKX_TRX_99228811',
          amount: '1499.00',
          customerMsisdn: '01812345678'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (url.includes('/gwprocess/v4/api.php')) {
      return new Response(
        JSON.stringify({
          status: 'SUCCESS',
          sessionkey: 'SSL-SESSION-KEY-001',
          GatewayPageURL: 'https://sandbox.sslcommerz.com/gw?session=SSL-SESSION-KEY-001'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (url.includes('/validator/api/validationserverAPI.php')) {
      return new Response(
        JSON.stringify({
          status: 'VALID',
          tran_id: 'pay-test-ssl-002',
          bank_tran_id: 'BANK-TX-99',
          amount: '499.00',
          card_type: 'VISA',
          card_brand: 'VISA'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  };

  try {
  // -------------------------------------------------------------
  // TEST 1: Payment Provider Factory Resolution
  // -------------------------------------------------------------
  const bkash = PaymentProviderFactory.getProvider('bkash');
  const ssl = PaymentProviderFactory.getProvider('sslcommerz');
  const stripe = PaymentProviderFactory.getProvider('stripe');

  assert(bkash instanceof BKashPaymentProvider, '1. bKash provider instantiated properly');
  assert(ssl instanceof SSLCommerzPaymentProvider, '2. SSLCommerz provider instantiated properly');
  assert(stripe instanceof StripePaymentProvider, '3. Stripe provider instantiated properly');

  // -------------------------------------------------------------
  // TEST 2: bKash Tokenized Checkout Initialization
  // -------------------------------------------------------------
  const bkashCheckout = await bkash.createCheckout({
    paymentId: 'pay-test-bkash-001',
    userId: 'usr-student-01',
    userEmail: 'student@nihomi.com',
    userName: 'Tanvir Kabir',
    planId: 'japan_ready',
    planName: 'Japan Ready Pro (Monthly)',
    billingInterval: 'monthly',
    amount: 1499,
    currency: 'BDT'
  });

  assert(bkashCheckout.provider === 'bkash', '4. bKash checkout returns valid provider name');
  assert(bkashCheckout.providerReference.startsWith('BKASH-'), '5. bKash checkout generates unique payment reference ID');
  assert(bkashCheckout.fieldsNeeded?.includes('accountNumber'), '6. bKash checkout requests required MFS fields');

  // -------------------------------------------------------------
  // TEST 3: bKash Verification with Valid & Invalid BD Mobile Numbers
  // -------------------------------------------------------------
  const testPayment: Payment = {
    id: 'pay-test-bkash-001',
    userId: 'usr-student-01',
    planId: 'japan_ready',
    planName: 'Japan Ready Pro',
    billingInterval: 'monthly',
    amount: 1499,
    originalAmount: 1499,
    discountAmount: 0,
    currency: 'BDT',
    provider: 'bkash',
    providerReference: bkashCheckout.providerReference,
    status: 'initiated',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const validVerification = await bkash.verifyPayment({
    paymentId: testPayment.id,
    accountNumber: '01812345678',
    otp: '123456',
    pin: '12345'
  }, testPayment);

  assert(validVerification.success && validVerification.status === 'paid', '7. Valid 11-digit BD mobile number verified successfully');
  assert(validVerification.paymentMethodDetails.accountNumberMasked === '018•••••678', '8. bKash account number properly masked for PCI/security compliance');

  const invalidPayment: Payment = {
    ...testPayment,
    providerReference: ''
  };

  const invalidVerification = await bkash.verifyPayment({
    paymentId: '', // invalid
    providerTransactionId: '',
    accountNumber: '12345', // invalid
    otp: '123456'
  }, invalidPayment);

  assert(!invalidVerification.success && invalidVerification.status === 'failed', '9. Missing/invalid payment ID rejected by bKash verification logic');

  // -------------------------------------------------------------
  // TEST 4: Timing-Safe HMAC-SHA256 Signature Verification
  // -------------------------------------------------------------
  const secretKey = 'bkash_nihomi_webhook_secret_key_2026';
  const payload = {
    paymentID: 'BK-100234',
    trxID: 'TRX998811',
    transactionStatus: 'Completed',
    amount: 1499,
    merchantInvoiceNumber: 'pay-test-bkash-001'
  };

  const rawJson = JSON.stringify(payload);
  const correctSig = crypto.createHmac('sha256', secretKey).update(rawJson).digest('hex');
  const tamperedSig = crypto.createHmac('sha256', 'wrong_secret').update(rawJson).digest('hex');

  assert(verifyHmacSignature(payload, correctSig, secretKey), '10. Valid HMAC-SHA256 signature authenticates payload');
  assert(!verifyHmacSignature(payload, tamperedSig, secretKey), '11. Tampered / wrong secret signature is rejected immediately');
  assert(!verifyHmacSignature(payload, undefined, secretKey), '12. Missing signature rejected in secure environment');

  // -------------------------------------------------------------
  // TEST 5: bKash Webhook Processing & Idempotency
  // -------------------------------------------------------------
  const webhookResult = await bkash.handleWebhook(payload, correctSig);
  assert(webhookResult.valid && webhookResult.signatureVerified, '13. bKash webhook handler validates signature');
  assert(webhookResult.status === 'paid' && webhookResult.paymentId === 'pay-test-bkash-001', '14. bKash webhook extracts paymentId and paid status');

  // -------------------------------------------------------------
  // TEST 6: SSLCommerz Session Generation & IPN Hash Verification
  // -------------------------------------------------------------
  const sslCheckout = await ssl.createCheckout({
    paymentId: 'pay-test-ssl-002',
    userId: 'usr-student-02',
    userEmail: 'student2@nihomi.com',
    userName: 'Akira Tanaka',
    planId: 'starter',
    planName: 'Starter (Monthly)',
    billingInterval: 'monthly',
    amount: 499,
    currency: 'BDT'
  });

  assert(sslCheckout.provider === 'sslcommerz', '15. SSLCommerz checkout returns correct provider');
  assert(sslCheckout.providerReference.startsWith('SSL-SESSION-'), '16. SSLCommerz generates valid session token');

  const valId = 'VAL-123456789';
  const storePassword = 'sslcommerz_nihomi_live_store_pass_2026';
  const sslHash = crypto.createHash('md5').update(`${valId}${storePassword}`).digest('hex');

  assert(verifySSLCommerzHash(valId, sslHash, storePassword), '17. SSLCommerz MD5 IPN verification hash validated');
  assert(!verifySSLCommerzHash(valId, 'fake_hash_123', storePassword), '18. Forged SSLCommerz IPN hash rejected');

  // -------------------------------------------------------------
  // TEST 7: SSLCommerz Webhook Execution
  // -------------------------------------------------------------
  const sslPayload = {
    val_id: valId,
    tran_id: 'pay-test-ssl-002',
    bank_tran_id: 'BANK-TX-99',
    amount: '499.00',
    status: 'VALID',
    verify_key: sslHash
  };

  const sslWebhookResult = await ssl.handleWebhook(sslPayload);
  assert(sslWebhookResult.valid && sslWebhookResult.status === 'paid', '19. SSLCommerz IPN payload verified and status mapped to paid');

  // -------------------------------------------------------------
  // TEST 8: Database Webhook Idempotency Check
  // -------------------------------------------------------------
  const eventId = `test-evt-${Date.now()}`;
  assert(!db.isWebhookProcessed(eventId), '20. New webhook event is marked unprocessed');

  db.recordWebhookEvent({
    eventId,
    provider: 'bkash',
    eventType: 'PaymentSuccess',
    signature: correctSig,
    signatureVerified: true,
    rawHeaders: { 'x-webhook-signature': correctSig },
    rawPayload: payload,
    status: 'success'
  });

  assert(db.isWebhookProcessed(eventId), '21. Processed webhook event is recognized as idempotent');

  } finally {
    globalThis.fetch = origFetch;
  }

  console.log('\n===============================================================');
  console.log(`🎯 PAYMENT AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runPaymentTests().catch((e) => {
  console.error('Fatal error during payment test run:', e);
  process.exit(1);
});
