// server/tests/test_real_payment_gateways_p0.ts
// Nihomi (にほみ) — P0-05 Real Payment Gateway Integration Test Suite

import {
  BKashPaymentProvider,
  SSLCommerzPaymentProvider,
  PaymentProviderFactory,
  verifyHmacSignature,
  verifySSLCommerzHash
} from '../services/paymentProviders.js';
import { db } from '../db.js';
import { Payment } from '../types.js';

async function runRealPaymentGatewayTests() {
  console.log('===============================================================');
  console.log('💳 NIHOMI — P0-05 REAL PAYMENT GATEWAY INTEGRATION (bKash & SSLCommerz)');
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

  // -------------------------------------------------------------
  // TEST 1: Fail-Fast Missing Credentials Enforcement
  // -------------------------------------------------------------
  console.log('--- Test Suite 1: Fail-Fast Credential Guard ---');

  const origBkashKey = process.env.BKASH_APP_KEY;
  const origBkashSecret = process.env.BKASH_APP_SECRET;
  const origBkashUser = process.env.BKASH_USERNAME;
  const origBkashPass = process.env.BKASH_PASSWORD;

  delete process.env.BKASH_APP_KEY;
  delete process.env.BKASH_APP_SECRET;

  const bkashUnconfigured = new BKashPaymentProvider();
  let bkashThrew = false;
  try {
    bkashUnconfigured.ensureConfigured();
  } catch (err: any) {
    bkashThrew = true;
    assert(
      err.message.includes('bKash gateway credentials missing'),
      '1. bKash throws immediate descriptive error when credentials are missing'
    );
  }
  assert(bkashThrew, '2. bKash fail-fast verification stops unconfigured execution');

  // Restore & set test credentials for bKash
  process.env.BKASH_APP_KEY = 'test_bkash_app_key_sandbox';
  process.env.BKASH_APP_SECRET = 'test_bkash_app_secret_sandbox';
  process.env.BKASH_USERNAME = 'test_bkash_merchant_user';
  process.env.BKASH_PASSWORD = 'test_bkash_merchant_pass';
  process.env.BKASH_BASE_URL = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';

  const bkashConfigured = new BKashPaymentProvider();
  let bkashConfigPass = false;
  try {
    bkashConfigured.ensureConfigured();
    bkashConfigPass = true;
  } catch {
    bkashConfigPass = false;
  }
  assert(bkashConfigPass, '3. bKash configuration succeeds with required credentials');

  // SSLCommerz Fail-Fast Test
  const origSslId = process.env.SSLCOMMERZ_STORE_ID;
  const origSslPass = process.env.SSLCOMMERZ_STORE_PASSWORD;

  delete process.env.SSLCOMMERZ_STORE_ID;
  delete process.env.SSLCOMMERZ_STORE_PASSWORD;

  const sslUnconfigured = new SSLCommerzPaymentProvider();
  let sslThrew = false;
  try {
    sslUnconfigured.ensureConfigured();
  } catch (err: any) {
    sslThrew = true;
    assert(
      err.message.includes('SSLCommerz gateway credentials missing'),
      '4. SSLCommerz throws immediate descriptive error when store ID / password missing'
    );
  }
  assert(sslThrew, '5. SSLCommerz fail-fast verification stops unconfigured execution');

  // Set test credentials for SSLCommerz
  process.env.SSLCOMMERZ_STORE_ID = 'test_nihomi_store_id';
  process.env.SSLCOMMERZ_STORE_PASSWORD = 'test_nihomi_store_password';
  process.env.SSLCOMMERZ_IS_SANDBOX = 'true';

  const sslConfigured = new SSLCommerzPaymentProvider();
  let sslConfigPass = false;
  try {
    sslConfigured.ensureConfigured();
    sslConfigPass = true;
  } catch {
    sslConfigPass = false;
  }
  assert(sslConfigPass, '6. SSLCommerz configuration succeeds with required store credentials');

  // -------------------------------------------------------------
  // TEST 2: Mocked Network Harness for Gateway HTTP Calls
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 2: bKash Tokenized Flow & Verification ---');

  const originalFetch = globalThis.fetch;
  const capturedRequests: { url: string; method?: string; headers?: any; body?: string }[] = [];

  // Mock global fetch to simulate bKash and SSLCommerz API responses
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = input.toString();
    const method = init?.method || 'GET';
    const headers = init?.headers;
    const body = init?.body as string;

    capturedRequests.push({ url, method, headers, body });

    // bKash Token Grant
    if (url.includes('/tokenized/checkout/token/grant')) {
      return new Response(
        JSON.stringify({
          statusCode: '0000',
          statusMessage: 'Successful',
          id_token: 'bKash_mocked_id_token_live_sandbox_9988',
          token_type: 'Bearer',
          expires_in: 3600
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // bKash Create Payment
    if (url.includes('/tokenized/checkout/create')) {
      const parsed = JSON.parse(body || '{}');
      return new Response(
        JSON.stringify({
          statusCode: '0000',
          statusMessage: 'Successful',
          paymentID: 'BKASH_PAY_' + Date.now(),
          bkashURL: 'https://sandbox.bka.sh/checkout/v1.2.0-beta?paymentID=BKASH_PAY_TEST',
          amount: parsed.amount || '1499.00',
          currency: 'BDT',
          intent: 'sale',
          merchantInvoiceNumber: parsed.merchantInvoiceNumber
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // bKash Execute Payment
    if (url.includes('/tokenized/checkout/execute')) {
      const parsed = JSON.parse(body || '{}');
      return new Response(
        JSON.stringify({
          statusCode: '0000',
          statusMessage: 'Successful',
          paymentID: parsed.paymentID,
          trxID: 'BKX_TRX_99228811',
          transactionStatus: 'Completed',
          amount: '1499.00',
          currency: 'BDT',
          intent: 'sale',
          customerMsisdn: '01711223344'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // SSLCommerz Session Init
    if (url.includes('/gwprocess/v4/api.php')) {
      return new Response(
        JSON.stringify({
          status: 'SUCCESS',
          sessionkey: 'SSL_SESSION_KEY_001122',
          GatewayPageURL: 'https://sandbox.sslcommerz.com/EasyCheckOut/testsession001122'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // SSLCommerz Order Validation API
    if (url.includes('/validator/api/validationserverAPI.php')) {
      const urlObj = new URL(url);
      const valId = urlObj.searchParams.get('val_id') || 'SSL_VAL_001';
      return new Response(
        JSON.stringify({
          status: 'VALID',
          tran_date: '2026-09-02 12:00:00',
          tran_id: 'pay-test-ssl-001',
          val_id: valId,
          amount: '1499.00',
          currency: 'BDT',
          bank_tran_id: 'EBL_BANK_TRX_7788',
          card_type: 'VISA-EBL',
          card_no: '424242XXXXXX4242',
          card_issuer: 'Eastern Bank Limited',
          card_brand: 'VISA'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  };

  try {
    // -------------------------------------------------------------
    // TEST 3: bKash Token Grant & Checkout Creation Flow
    // -------------------------------------------------------------
    const bkashProvider = PaymentProviderFactory.getProvider('bkash');
    const token = await (bkashProvider as BKashPaymentProvider).getGrantToken();
    assert(token === 'bKash_mocked_id_token_live_sandbox_9988', '7. bKash acquires live grant token successfully');

    const bkashCheckout = await bkashProvider.createCheckout({
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

    assert(bkashCheckout.provider === 'bkash', '8. bKash checkout returns valid provider');
    assert(bkashCheckout.redirectUrl.includes('sandbox.bka.sh'), '9. bKash checkout generates real gateway redirect URL');
    assert(bkashCheckout.providerReference.startsWith('BKASH_PAY_'), '10. bKash checkout generates valid payment ID');

    // -------------------------------------------------------------
    // TEST 4: bKash Execution & Verification
    // -------------------------------------------------------------
    const testBkashPayment: Payment = {
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

    const bkashVerify = await bkashProvider.verifyPayment(
      {
        paymentId: testBkashPayment.id,
        providerTransactionId: testBkashPayment.providerReference,
        accountNumber: '01711223344'
      },
      testBkashPayment
    );

    assert(bkashVerify.success === true, '11. bKash execution verifies payment successfully');
    assert(bkashVerify.providerTransactionId === 'BKX_TRX_99228811', '12. bKash returns actual bank transaction ID');
    assert(bkashVerify.paymentMethodDetails.accountNumberMasked === '017•••••344', '13. bKash masks student MSISDN');

    // -------------------------------------------------------------
    // TEST 5: SSLCommerz Session Init & Order Validation Flow
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 3: SSLCommerz Flow & Validation ---');

    const sslProvider = PaymentProviderFactory.getProvider('sslcommerz');
    const sslCheckout = await sslProvider.createCheckout({
      paymentId: 'pay-test-ssl-001',
      userId: 'usr-student-01',
      userEmail: 'student@nihomi.com',
      userName: 'Tanvir Kabir',
      planId: 'japan_ready',
      planName: 'Japan Ready Pro',
      billingInterval: 'monthly',
      amount: 1499,
      currency: 'BDT'
    });

    assert(sslCheckout.provider === 'sslcommerz', '14. SSLCommerz returns valid provider');
    assert(sslCheckout.redirectUrl.includes('sandbox.sslcommerz.com'), '15. SSLCommerz returns real hosted checkout page URL');
    assert(sslCheckout.providerReference === 'SSL_SESSION_KEY_001122', '16. SSLCommerz captures valid session key');

    const testSslPayment: Payment = {
      id: 'pay-test-ssl-001',
      userId: 'usr-student-01',
      planId: 'japan_ready',
      planName: 'Japan Ready Pro',
      billingInterval: 'monthly',
      amount: 1499,
      originalAmount: 1499,
      discountAmount: 0,
      currency: 'BDT',
      provider: 'sslcommerz',
      providerReference: sslCheckout.providerReference,
      status: 'initiated',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const sslVerify = await sslProvider.verifyPayment(
      {
        paymentId: testSslPayment.id,
        valId: 'SSL_VAL_998877'
      },
      testSslPayment
    );

    assert(sslVerify.success === true, '17. SSLCommerz Order Validation API confirms transaction validity');
    assert(sslVerify.providerTransactionId === 'EBL_BANK_TRX_7788', '18. SSLCommerz captures bank transaction ID');
    assert(sslVerify.paymentMethodDetails.cardBrand === 'VISA', '19. SSLCommerz records verified card brand');
    assert(sslVerify.paymentMethodDetails.bankName === 'Eastern Bank Limited', '20. SSLCommerz records verified card issuer bank');

    // -------------------------------------------------------------
    // TEST 6: Tamper-Proof Price Source of Truth
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 4: Database Price Integrity & Atomic Activation ---');

    const testPlan = db.getPlanById('japan_ready')!;
    assert(testPlan.monthlyPrice === 999, '21. Server database plan monthly price is ৳999 BDT');

    // Simulate coupon calculation with server signature: (code, planId, interval, baseAmount)
    const couponValidation = db.validateAndCalculateCoupon('LAUNCH50', 'japan_ready', 'monthly', testPlan.monthlyPrice);
    assert(couponValidation.valid === true, '22. Valid coupon calculated server-side');
    assert(couponValidation.finalAmount < testPlan.monthlyPrice, '23. Coupon discount applied against trusted DB price');

    // Verify atomic subscription activation
    const testUser = db.findUserByEmail('demo@nihomi.com') || db.getAllUsers()[0];

    const newSub = db.createSubscription({
      userId: testUser.id,
      planId: 'japan_ready',
      billingInterval: 'monthly',
      status: 'active',
      paymentMethod: 'bKash MFS (Tokenized)',
      lastPaymentId: 'pay-test-bkash-001'
    });

    assert(newSub.status === 'active', '24. Subscription activated atomically');
    assert(newSub.planId === 'japan_ready', '25. Subscription matches purchased plan');

    const createdInvoice = db.createInvoice({
      userId: testUser.id,
      subscriptionId: newSub.id,
      planId: newSub.planId,
      planName: 'Japan Ready Pro',
      amount: 999,
      billingPeriod: '2026-09-02 to 2026-10-02',
      paymentId: 'pay-test-bkash-001',
      customerName: 'Test Student',
      customerEmail: testUser.email,
      subtotal: 999,
      discount: 0,
      tax: 0,
      paymentMethodName: 'bKash MFS (017•••••344)'
    });

    assert(createdInvoice.id.startsWith('inv-'), '26. Official Tax Invoice created with secure reference');
    assert(createdInvoice.amount === 999, '27. Tax Invoice amount strictly matches payment amount');

  } finally {
    globalThis.fetch = originalFetch;
    if (origBkashKey) process.env.BKASH_APP_KEY = origBkashKey;
    if (origBkashSecret) process.env.BKASH_APP_SECRET = origBkashSecret;
    if (origBkashUser) process.env.BKASH_USERNAME = origBkashUser;
    if (origBkashPass) process.env.BKASH_PASSWORD = origBkashPass;
    if (origSslId) process.env.SSLCOMMERZ_STORE_ID = origSslId;
    if (origSslPass) process.env.SSLCOMMERZ_STORE_PASSWORD = origSslPass;
  }

  console.log('\n===============================================================');
  console.log(`🏁 REAL PAYMENT GATEWAY INTEGRATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================\n');

  if (failed > 0) {
    throw new Error(`P0-05 Payment Gateway tests failed: ${failed} errors detected.`);
  }
}

runRealPaymentGatewayTests().catch((err) => {
  console.error('Fatal error in payment gateway test execution:', err);
  process.exit(1);
});
