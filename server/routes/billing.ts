import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { authenticateUser, optionalAuth } from '../middleware/auth.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { canAccess, getUserActivePlanId, getUserEntitlements, PLAN_LIMITS } from '../services/entitlements.js';
import { PaymentProviderFactory } from '../services/paymentProviders.js';
import { BillingInterval, PaymentProviderType, PlanId } from '../types.js';

export const billingRouter = Router();

// ==========================================
// 1. PUBLIC / AUTHENTICATED PLAN CATALOG
// ==========================================
billingRouter.get('/plans', (req: Request, res: Response) => {
  try {
    const plans = db.getPlans();
    const planPrices = db.getPlanPrices();

    const enrichedPlans = plans.map((plan) => {
      const prices = planPrices.filter((p) => p.planId === plan.id);
      const monthly = prices.find((p) => p.billingInterval === 'monthly');
      const yearly = prices.find((p) => p.billingInterval === 'yearly');

      return {
        ...plan,
        prices: {
          monthly: monthly || { amount: plan.monthlyPrice, currency: 'BDT' },
          yearly: yearly || {
            amount: plan.yearlyPrice,
            currency: 'BDT',
            savingsPercent: Math.round(((plan.monthlyPrice * 12 - plan.yearlyPrice) / (plan.monthlyPrice * 12 || 1)) * 100),
            savingsAmount: Math.max(0, plan.monthlyPrice * 12 - plan.yearlyPrice)
          }
        }
      };
    });

    res.json({
      success: true,
      plans: enrichedPlans
    });
  } catch (err: any) {
    console.error('Error fetching plans:', err);
    res.status(500).json({ error: 'Failed to retrieve plans' });
  }
});

// ==========================================
// 2. USER SUBSCRIPTION & ENTITLEMENT DETAILS
// ==========================================
billingRouter.get('/subscription', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = req.user!;
    const sub = db.getUserActiveSubscription(userId);
    const planId = getUserActivePlanId(userId);
    const plan = db.getPlanById(planId) || db.getPlanById('free')!;
    const entitlements = getUserEntitlements(userId);
    const usage = db.getAIUsageForCurrentMonth(userId);
    const invoices = db.getUserInvoices(userId);

    const aiLimit = plan.aiMonthlyLimit || PLAN_LIMITS[planId]?.aiMonthlyQuota || 10;
    const remainingQuota = Math.max(0, aiLimit - (usage.aiCoachInteractions || 0));

    let daysRemaining = 0;
    if (sub) {
      const end = new Date(sub.currentPeriodEnd).getTime();
      const now = Date.now();
      daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
    }

    res.json({
      success: true,
      subscription: sub || {
        id: 'free-tier',
        userId,
        planId: 'free',
        billingInterval: 'monthly',
        status: 'active',
        currentPeriodStart: user.createdAt,
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
        createdAt: user.createdAt,
        updatedAt: user.createdAt
      },
      plan,
      entitlements,
      usage: {
        aiCoachInteractions: usage.aiCoachInteractions || 0,
        aiMonthlyLimit: aiLimit,
        remainingQuota,
        periodYearMonth: usage.periodYearMonth
      },
      invoices,
      daysRemainingInPeriod: daysRemaining,
      isTrialActive: sub?.status === 'trialing',
      canCancelAtPeriodEnd: !!sub && sub.status === 'active' && !sub.cancelAtPeriodEnd
    });
  } catch (err: any) {
    console.error('Error fetching subscription:', err);
    res.status(500).json({ error: 'Failed to retrieve subscription details' });
  }
});

// ==========================================
// 3. COUPON VALIDATION
// ==========================================
billingRouter.post('/validate-coupon', authenticateUser, (req: Request, res: Response) => {
  try {
    const { code, planId, billingInterval } = req.body;
    if (!code || !planId || !billingInterval) {
      return res.status(400).json({ error: 'Coupon code, planId, and billingInterval are required.' });
    }

    const plan = db.getPlanById(planId as PlanId);
    if (!plan) {
      return res.status(404).json({ error: 'Selected plan not found.' });
    }

    const baseAmount = billingInterval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    const result = db.validateAndCalculateCoupon(code, planId as PlanId, billingInterval as BillingInterval, baseAmount);

    if (!result.valid) {
      return res.status(400).json({ error: result.error || 'Invalid coupon code.' });
    }

    res.json({
      success: true,
      code: result.coupon!.code,
      discountType: result.coupon!.discountType,
      discountValue: result.coupon!.discountValue,
      originalAmount: baseAmount,
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount,
      currency: 'BDT'
    });
  } catch (err: any) {
    console.error('Error validating coupon:', err);
    res.status(500).json({ error: 'Failed to validate coupon code' });
  }
});

// ==========================================
// 4. CHECKOUT INITIATION
// ==========================================
billingRouter.post('/checkout', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = req.user!;
    const profile = db.getProfileByUserId(userId);
    const {
      planId,
      billingInterval = 'monthly',
      provider = 'bkash',
      couponCode
    }: {
      planId: PlanId;
      billingInterval: BillingInterval;
      provider: PaymentProviderType;
      couponCode?: string;
    } = req.body;

    if (!planId || planId === 'free') {
      return res.status(400).json({ error: 'Valid paid plan required for checkout.' });
    }

    const plan = db.getPlanById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }

    const baseAmount = billingInterval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    let discountAmount = 0;
    let finalAmount = baseAmount;
    let validatedCouponCode: string | undefined = undefined;

    if (couponCode && couponCode.trim()) {
      const couponCheck = db.validateAndCalculateCoupon(couponCode, planId, billingInterval, baseAmount);
      if (couponCheck.valid) {
        discountAmount = couponCheck.discountAmount;
        finalAmount = couponCheck.finalAmount;
        validatedCouponCode = couponCheck.coupon?.code;
      }
    }

    // Create initiated payment record
    const payment = db.createPayment({
      userId,
      planId,
      planName: `${plan.name} (${billingInterval === 'yearly' ? 'Annual' : 'Monthly'})`,
      billingInterval,
      amount: finalAmount,
      originalAmount: baseAmount,
      discountAmount,
      couponCode: validatedCouponCode,
      provider
    });

    // Invoke payment provider adapter
    const providerAdapter = PaymentProviderFactory.getProvider(provider);
    const checkoutResult = await providerAdapter.createCheckout({
      paymentId: payment.id,
      userId,
      userEmail: user.email,
      userName: profile?.displayName || 'Nihomi Student',
      planId,
      planName: plan.name,
      billingInterval,
      amount: finalAmount,
      currency: 'BDT'
    });

    // Update payment with provider reference
    db.updatePayment(payment.id, {
      providerReference: checkoutResult.providerReference
    });

    res.json({
      success: true,
      paymentId: payment.id,
      provider: checkoutResult.provider,
      providerReference: checkoutResult.providerReference,
      amount: finalAmount,
      originalAmount: baseAmount,
      discountAmount,
      currency: 'BDT',
      redirectUrl: checkoutResult.redirectUrl,
      instructions: checkoutResult.instructions,
      fieldsNeeded: checkoutResult.fieldsNeeded,
      metadata: checkoutResult.metadata
    });
  } catch (err: any) {
    console.error('Error during checkout initiation:', err);
    res.status(500).json({ error: 'Failed to initiate checkout session.' });
  }
});

// ==========================================
// 5. SERVER-SIDE PAYMENT VERIFICATION & ACTIVATION
// ==========================================
billingRouter.post('/verify-payment', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = req.user!;
    const profile = db.getProfileByUserId(userId);
    const {
      paymentId,
      accountNumber,
      otp,
      pin,
      providerTransactionId,
      valId,
      providerData
    } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required.' });
    }

    const payment = db.getPaymentById(paymentId);
    if (!payment || payment.userId !== userId) {
      return res.status(404).json({ error: 'Payment record not found or unauthorized.' });
    }

    if (payment.status === 'paid') {
      return res.json({
        success: true,
        message: 'Payment has already been verified and processed.',
        paymentId: payment.id,
        status: 'paid'
      });
    }

    const providerAdapter = PaymentProviderFactory.getProvider(payment.provider);
    const verification = await providerAdapter.verifyPayment(
      {
        paymentId: payment.id,
        accountNumber,
        otp,
        pin,
        providerTransactionId,
        valId,
        providerData
      },
      payment
    );

    if (!verification.success || verification.status !== 'paid') {
      db.updatePayment(payment.id, {
        status: 'failed',
        failedAt: new Date().toISOString(),
        failureReason: verification.errorMessage || 'Verification declined by payment provider.'
      });

      return res.status(400).json({
        success: false,
        error: verification.errorMessage || 'Payment verification failed. Please check your credentials.'
      });
    }

    // Payment Verified! Execute atomic activation
    const now = new Date();
    const paidAt = now.toISOString();

    // 1. Update payment to paid
    db.updatePayment(payment.id, {
      status: 'paid',
      providerTransactionId: verification.providerTransactionId,
      paymentMethodDetails: verification.paymentMethodDetails,
      paidAt
    });

    // 2. Check for active subscription or create a new one
    let activeSub = db.getUserActiveSubscription(userId);
    const monthsToAdd = payment.billingInterval === 'yearly' ? 12 : 1;

    if (activeSub && activeSub.planId === payment.planId) {
      // Renewal of existing subscription
      activeSub = db.extendSubscriptionPeriod(activeSub.id, monthsToAdd)!;
      db.updateSubscription(activeSub.id, {
        lastPaymentId: payment.id,
        paymentMethod: verification.paymentMethodDetails.type
      });
    } else {
      // Create new subscription or upgrade plan
      if (activeSub) {
        // Cancel prior subscription
        db.cancelSubscription(activeSub.id, true);
      }
      activeSub = db.createSubscription({
        userId,
        planId: payment.planId,
        billingInterval: payment.billingInterval,
        status: 'active',
        paymentMethod: verification.paymentMethodDetails.type,
        lastPaymentId: payment.id
      });
    }

    // Link subscription to payment
    db.updatePayment(payment.id, { subscriptionId: activeSub.id });

    // 3. Generate Official Invoice
    const invoice = db.createInvoice({
      userId,
      subscriptionId: activeSub.id,
      planId: payment.planId,
      planName: payment.planName,
      amount: payment.amount,
      billingPeriod: `${activeSub.currentPeriodStart.split('T')[0]} to ${activeSub.currentPeriodEnd.split('T')[0]}`,
      paymentId: payment.id,
      customerName: profile?.displayName || 'Nihomi Student',
      customerEmail: user.email,
      subtotal: payment.originalAmount,
      discount: payment.discountAmount,
      tax: 0,
      paymentMethodName: `${verification.paymentMethodDetails.type} (${verification.paymentMethodDetails.accountNumberMasked || 'Verified'})`
    });

    db.updatePayment(payment.id, { invoiceId: invoice.id });

    // 4. Record Coupon usage if applied
    if (payment.couponCode && payment.discountAmount > 0) {
      db.recordCouponRedemption(payment.couponCode, userId, payment.id, payment.discountAmount);
    }

    // 5. Record Subscription Event
    db.recordSubscriptionEvent(userId, activeSub.id, 'payment_succeeded', {
      amount: payment.amount,
      provider: payment.provider,
      transactionId: verification.providerTransactionId,
      invoiceId: invoice.id
    });

    res.json({
      success: true,
      message: 'Payment verified and premium subscription successfully activated!',
      payment: db.getPaymentById(payment.id),
      subscription: activeSub,
      invoice
    });
  } catch (err: any) {
    console.error('Error during payment verification:', err);
    res.status(500).json({ error: 'Server error during payment verification.' });
  }
});

// ==========================================
// 5b. bKash TOKENIZED CALLBACK ROUTE
// ==========================================
async function handleBkashCallback(req: Request, res: Response) {
  try {
    const paymentIdParam = (req.query.paymentId as string) || (req.body.paymentId as string);
    const paymentID = (req.query.paymentID as string) || (req.body.paymentID as string);
    const status = (req.query.status as string) || (req.body.status as string) || '';

    const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');

    // Look up payment
    const payment =
      (paymentIdParam ? db.getPaymentById(paymentIdParam) : undefined) ||
      (paymentID ? db.getPaymentByProviderReference(paymentID) : undefined);

    if (!payment) {
      return res.redirect(`${appUrl}/dashboard?payment=failed&error=Payment+record+not+found`);
    }

    if (status.toLowerCase() === 'cancel') {
      db.updatePayment(payment.id, {
        status: 'cancelled',
        failureReason: 'User cancelled transaction on bKash checkout page.'
      });
      return res.redirect(`${appUrl}/dashboard?payment=cancelled&paymentId=${encodeURIComponent(payment.id)}`);
    }

    if (status.toLowerCase() === 'failure') {
      db.updatePayment(payment.id, {
        status: 'failed',
        failedAt: new Date().toISOString(),
        failureReason: 'Transaction declined on bKash gateway.'
      });
      return res.redirect(`${appUrl}/dashboard?payment=failed&paymentId=${encodeURIComponent(payment.id)}`);
    }

    // Status is success (or user completed execution flow)
    if (payment.status === 'paid') {
      return res.redirect(`${appUrl}/dashboard?payment=success&paymentId=${encodeURIComponent(payment.id)}&plan=${encodeURIComponent(payment.planId)}`);
    }

    const providerAdapter = PaymentProviderFactory.getProvider('bkash');
    const verification = await providerAdapter.verifyPayment(
      {
        paymentId: payment.id,
        providerTransactionId: paymentID || payment.providerReference
      },
      payment
    );

    if (!verification.success || verification.status !== 'paid') {
      db.updatePayment(payment.id, {
        status: 'failed',
        failedAt: new Date().toISOString(),
        failureReason: verification.errorMessage || 'bKash payment execution was declined.'
      });
      return res.redirect(
        `${appUrl}/dashboard?payment=failed&paymentId=${encodeURIComponent(payment.id)}&error=${encodeURIComponent(verification.errorMessage || 'bKash verification failed')}`
      );
    }

    // Atomic activation
    const paidAt = new Date().toISOString();
    db.updatePayment(payment.id, {
      status: 'paid',
      providerTransactionId: verification.providerTransactionId,
      paymentMethodDetails: verification.paymentMethodDetails,
      paidAt
    });

    const user = db.findUserById(payment.userId);
    const profile = db.getProfileByUserId(payment.userId);
    let activeSub = db.getUserActiveSubscription(payment.userId);
    const monthsToAdd = payment.billingInterval === 'yearly' ? 12 : 1;

    if (activeSub && activeSub.planId === payment.planId) {
      activeSub = db.extendSubscriptionPeriod(activeSub.id, monthsToAdd)!;
      db.updateSubscription(activeSub.id, {
        lastPaymentId: payment.id,
        paymentMethod: verification.paymentMethodDetails.type
      });
    } else {
      if (activeSub) {
        db.cancelSubscription(activeSub.id, true);
      }
      activeSub = db.createSubscription({
        userId: payment.userId,
        planId: payment.planId,
        billingInterval: payment.billingInterval,
        status: 'active',
        paymentMethod: verification.paymentMethodDetails.type,
        lastPaymentId: payment.id
      });
    }

    db.updatePayment(payment.id, { subscriptionId: activeSub.id });

    const invoice = db.createInvoice({
      userId: payment.userId,
      subscriptionId: activeSub.id,
      planId: payment.planId,
      planName: payment.planName,
      amount: payment.amount,
      billingPeriod: `${activeSub.currentPeriodStart.split('T')[0]} to ${activeSub.currentPeriodEnd.split('T')[0]}`,
      paymentId: payment.id,
      customerName: profile?.displayName || 'Nihomi Student',
      customerEmail: user?.email || 'student@nihomi.com',
      subtotal: payment.originalAmount,
      discount: payment.discountAmount,
      tax: 0,
      paymentMethodName: `${verification.paymentMethodDetails.type} (${verification.paymentMethodDetails.accountNumberMasked || 'Verified'})`
    });

    db.updatePayment(payment.id, { invoiceId: invoice.id });

    if (payment.couponCode && payment.discountAmount > 0) {
      db.recordCouponRedemption(payment.couponCode, payment.userId, payment.id, payment.discountAmount);
    }

    db.recordSubscriptionEvent(payment.userId, activeSub.id, 'payment_succeeded', {
      amount: payment.amount,
      provider: payment.provider,
      transactionId: verification.providerTransactionId,
      invoiceId: invoice.id
    });

    res.redirect(`${appUrl}/dashboard?payment=success&paymentId=${encodeURIComponent(payment.id)}&plan=${encodeURIComponent(payment.planId)}`);
  } catch (err: any) {
    console.error('Error handling bKash callback:', err);
    const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
    res.redirect(`${appUrl}/dashboard?payment=failed&error=${encodeURIComponent(err.message || 'Callback error')}`);
  }
}

billingRouter.get('/bkash/callback', handleBkashCallback);
billingRouter.post('/bkash/callback', handleBkashCallback);

// ==========================================
// 5c. SSLCOMMERZ REDIRECT CALLBACK ROUTES
// ==========================================
billingRouter.post('/sslcommerz/success', async (req: Request, res: Response) => {
  try {
    const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
    const { tran_id, val_id } = req.body;

    const paymentId = tran_id || (req.query.paymentId as string);
    if (!paymentId) {
      return res.redirect(`${appUrl}/dashboard?payment=failed&error=Missing+transaction+ID`);
    }

    const payment = db.getPaymentById(paymentId);
    if (!payment) {
      return res.redirect(`${appUrl}/dashboard?payment=failed&error=Payment+not+found`);
    }

    if (payment.status === 'paid') {
      return res.redirect(`${appUrl}/dashboard?payment=success&paymentId=${encodeURIComponent(payment.id)}&plan=${encodeURIComponent(payment.planId)}`);
    }

    const providerAdapter = PaymentProviderFactory.getProvider('sslcommerz');
    const verification = await providerAdapter.verifyPayment(
      {
        paymentId: payment.id,
        valId: val_id,
        providerData: req.body
      },
      payment
    );

    if (!verification.success || verification.status !== 'paid') {
      db.updatePayment(payment.id, {
        status: 'failed',
        failedAt: new Date().toISOString(),
        failureReason: verification.errorMessage || 'SSLCommerz order validation failed.'
      });
      return res.redirect(`${appUrl}/dashboard?payment=failed&paymentId=${encodeURIComponent(payment.id)}&error=${encodeURIComponent(verification.errorMessage || 'Validation failed')}`);
    }

    // Atomic activation
    const paidAt = new Date().toISOString();
    db.updatePayment(payment.id, {
      status: 'paid',
      providerTransactionId: verification.providerTransactionId,
      paymentMethodDetails: verification.paymentMethodDetails,
      paidAt
    });

    const user = db.findUserById(payment.userId);
    const profile = db.getProfileByUserId(payment.userId);
    let activeSub = db.getUserActiveSubscription(payment.userId);
    const monthsToAdd = payment.billingInterval === 'yearly' ? 12 : 1;

    if (activeSub && activeSub.planId === payment.planId) {
      activeSub = db.extendSubscriptionPeriod(activeSub.id, monthsToAdd)!;
      db.updateSubscription(activeSub.id, {
        lastPaymentId: payment.id,
        paymentMethod: verification.paymentMethodDetails.type
      });
    } else {
      if (activeSub) {
        db.cancelSubscription(activeSub.id, true);
      }
      activeSub = db.createSubscription({
        userId: payment.userId,
        planId: payment.planId,
        billingInterval: payment.billingInterval,
        status: 'active',
        paymentMethod: verification.paymentMethodDetails.type,
        lastPaymentId: payment.id
      });
    }

    db.updatePayment(payment.id, { subscriptionId: activeSub.id });

    const invoice = db.createInvoice({
      userId: payment.userId,
      subscriptionId: activeSub.id,
      planId: payment.planId,
      planName: payment.planName,
      amount: payment.amount,
      billingPeriod: `${activeSub.currentPeriodStart.split('T')[0]} to ${activeSub.currentPeriodEnd.split('T')[0]}`,
      paymentId: payment.id,
      customerName: profile?.displayName || 'Nihomi Student',
      customerEmail: user?.email || 'student@nihomi.com',
      subtotal: payment.originalAmount,
      discount: payment.discountAmount,
      tax: 0,
      paymentMethodName: `${verification.paymentMethodDetails.type} (${verification.paymentMethodDetails.accountNumberMasked || 'Verified'})`
    });

    db.updatePayment(payment.id, { invoiceId: invoice.id });

    if (payment.couponCode && payment.discountAmount > 0) {
      db.recordCouponRedemption(payment.couponCode, payment.userId, payment.id, payment.discountAmount);
    }

    db.recordSubscriptionEvent(payment.userId, activeSub.id, 'payment_succeeded', {
      amount: payment.amount,
      provider: payment.provider,
      transactionId: verification.providerTransactionId,
      invoiceId: invoice.id
    });

    res.redirect(`${appUrl}/dashboard?payment=success&paymentId=${encodeURIComponent(payment.id)}&plan=${encodeURIComponent(payment.planId)}`);
  } catch (err: any) {
    console.error('Error handling SSLCommerz success callback:', err);
    const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
    res.redirect(`${appUrl}/dashboard?payment=failed&error=${encodeURIComponent(err.message || 'SSLCommerz processing error')}`);
  }
});

billingRouter.post('/sslcommerz/fail', (req: Request, res: Response) => {
  const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
  const { tran_id, error } = req.body;
  const paymentId = tran_id || (req.query.paymentId as string);

  if (paymentId) {
    db.updatePayment(paymentId, {
      status: 'failed',
      failedAt: new Date().toISOString(),
      failureReason: error || 'Payment failed on SSLCommerz gateway.'
    });
  }

  res.redirect(`${appUrl}/dashboard?payment=failed&paymentId=${encodeURIComponent(paymentId || '')}`);
});

billingRouter.post('/sslcommerz/cancel', (req: Request, res: Response) => {
  const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
  const { tran_id } = req.body;
  const paymentId = tran_id || (req.query.paymentId as string);

  if (paymentId) {
    db.updatePayment(paymentId, {
      status: 'cancelled',
      failureReason: 'Payment cancelled on SSLCommerz gateway.'
    });
  }

  res.redirect(`${appUrl}/dashboard?payment=cancelled&paymentId=${encodeURIComponent(paymentId || '')}`);
});

// ==========================================
// 6. ASYNCHRONOUS WEBHOOK & IPN HANDLER (Idempotent & Cryptographically Signed)
// ==========================================
billingRouter.post('/webhook/:provider', async (req: Request, res: Response) => {
  const providerParam = (req.params.provider || 'bkash').toLowerCase() as PaymentProviderType;
  const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || '127.0.0.1';
  const rawBody = (req as any).rawBody || (typeof req.body === 'string' ? req.body : undefined);
  const payload = req.body || {};

  const signature = (
    req.headers['stripe-signature'] ||
    req.headers['x-bkash-signature'] ||
    req.headers['x-sslcommerz-hash'] ||
    req.headers['x-shurjopay-signature'] ||
    req.headers['x-apple-signature'] ||
    req.headers['x-gpay-signature'] ||
    req.headers['x-webhook-signature'] ||
    req.headers['signature'] ||
    payload.verify_sign ||
    payload.verify_key
  ) as string | undefined;

  try {
    const providerAdapter = PaymentProviderFactory.getProvider(providerParam);
    const webhookResult = await providerAdapter.handleWebhook(
      payload,
      signature,
      req.headers as Record<string, any>,
      rawBody
    );

    // 1. Signature Verification Check
    if (!webhookResult.valid) {
      console.warn(`[Webhook] Signature verification failed for provider: ${providerParam}`);
      db.recordWebhookEvent({
        eventId: webhookResult.eventId || `err-${Date.now()}`,
        provider: providerParam,
        eventType: webhookResult.eventType || `${providerParam}.webhook_invalid_signature`,
        signature,
        signatureVerified: false,
        rawHeaders: req.headers as Record<string, string>,
        rawPayload: payload,
        status: 'failed',
        errorMessage: 'Invalid webhook signature or payload hash mismatch.',
        ipAddress
      });
      return res.status(400).json({ error: 'Invalid webhook signature or payload verification failed.' });
    }

    // 2. Strict Idempotency Check
    if (db.isWebhookProcessed(webhookResult.eventId, providerParam)) {
      console.log(`[Webhook] Duplicate event ignored for idempotency: ${webhookResult.eventId}`);
      return res.status(200).json({
        received: true,
        idempotent: true,
        eventId: webhookResult.eventId,
        message: 'Event already processed.'
      });
    }

    // 3. Atomic Webhook Processing (Event Logging -> Payment State -> Subscription Activation -> Tax Invoice)
    const processResult = db.processWebhookTransactionAtomic({
      eventId: webhookResult.eventId,
      provider: providerParam,
      eventType: webhookResult.eventType,
      paymentId: webhookResult.paymentId,
      providerTransactionId: webhookResult.providerTransactionId,
      amount: webhookResult.amount,
      signature,
      signatureVerified: true,
      rawHeaders: req.headers as Record<string, string>,
      rawPayload: payload,
      ipAddress
    });

    if (!processResult.success) {
      console.error(`[Webhook] Failed atomic processing for event ${webhookResult.eventId}:`, processResult.error);
      return res.status(500).json({ error: 'Webhook processing encountered a state error.' });
    }

    return res.status(200).json({
      received: true,
      success: true,
      idempotent: processResult.idempotent || false,
      eventId: webhookResult.eventId
    });
  } catch (err: any) {
    console.error(`[Webhook] Exception handling ${providerParam} webhook:`, err);
    return res.status(500).json({ error: 'Internal server error processing webhook.' });
  }
});

// ==========================================
// 7. START 7-DAY FREE TRIAL
// ==========================================
billingRouter.post('/start-trial', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { planId = 'pro' }: { planId: PlanId } = req.body;

    const existingSub = db.getUserActiveSubscription(userId);
    if (existingSub && existingSub.status === 'active') {
      return res.status(400).json({ error: 'You already have an active subscription.' });
    }

    const pastSubs = db.getUserSubscriptions(userId);
    const hasUsedTrial = pastSubs.some((s) => !!s.trialStart);
    if (hasUsedTrial) {
      return res.status(400).json({ error: 'A free trial has already been redeemed on this account.' });
    }

    const trialSub = db.createSubscription({
      userId,
      planId,
      billingInterval: 'monthly',
      status: 'trialing',
      trialDays: 7,
      paymentMethod: 'Free 7-Day Trial'
    });

    res.json({
      success: true,
      message: '7-day Pro free trial successfully activated!',
      subscription: trialSub
    });
  } catch (err: any) {
    console.error('Error starting free trial:', err);
    res.status(500).json({ error: 'Failed to start free trial.' });
  }
});

// ==========================================
// 8. CANCEL SUBSCRIPTION (At period end)
// ==========================================
billingRouter.post('/cancel', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { reason, immediate = false } = req.body;

    const sub = db.getUserActiveSubscription(userId);
    if (!sub) {
      return res.status(404).json({ error: 'No active subscription found to cancel.' });
    }

    const updated = db.cancelSubscription(sub.id, immediate);
    if (reason) {
      db.recordSubscriptionEvent(userId, sub.id, 'cancellation_reason_survey', { reason });
    }

    res.json({
      success: true,
      message: immediate
        ? 'Subscription cancelled immediately.'
        : `Your subscription will remain active until the end of your billing cycle on ${new Date(sub.currentPeriodEnd).toLocaleDateString()}.`,
      subscription: updated
    });
  } catch (err: any) {
    console.error('Error cancelling subscription:', err);
    res.status(500).json({ error: 'Failed to cancel subscription.' });
  }
});

// ==========================================
// 9. REACTIVATE CANCELLED SUBSCRIPTION
// ==========================================
billingRouter.post('/reactivate', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const sub = db.getUserSubscriptions(userId).find((s) => s.cancelAtPeriodEnd || s.status === 'cancelled');

    if (!sub) {
      return res.status(404).json({ error: 'No cancellable subscription found to reactivate.' });
    }

    const reactivated = db.reactivateSubscription(sub.id);
    db.recordSubscriptionEvent(userId, sub.id, 'subscription_reactivated');

    res.json({
      success: true,
      message: 'Subscription reactivated successfully!',
      subscription: reactivated
    });
  } catch (err: any) {
    console.error('Error reactivating subscription:', err);
    res.status(500).json({ error: 'Failed to reactivate subscription.' });
  }
});

// ==========================================
// 9b. TOGGLE AUTO-RENEWAL
// ==========================================
billingRouter.post('/toggle-auto-renew', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { enabled } = req.body;
    const sub = db.getUserActiveSubscription(userId);

    if (!sub) {
      return res.status(404).json({ error: 'No active subscription found to configure renewal.' });
    }

    let updated;
    if (enabled) {
      updated = db.reactivateSubscription(sub.id);
      db.recordSubscriptionEvent(userId, sub.id, 'auto_renewal_enabled');
    } else {
      updated = db.cancelSubscription(sub.id, false);
      db.recordSubscriptionEvent(userId, sub.id, 'auto_renewal_disabled');
    }

    res.json({
      success: true,
      autoRenew: !updated?.cancelAtPeriodEnd,
      message: enabled
        ? 'Automatic subscription renewal has been enabled.'
        : `Automatic renewal disabled. Your subscription will remain active until ${new Date(sub.currentPeriodEnd).toLocaleDateString()}.`,
      subscription: updated
    });
  } catch (err: any) {
    console.error('Error toggling auto-renew:', err);
    res.status(500).json({ error: 'Failed to update auto-renewal setting.' });
  }
});

// ==========================================
// 10. INVOICES
// ==========================================
billingRouter.get('/invoices', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const invoices = db.getUserInvoices(userId);
    res.json({
      success: true,
      invoices
    });
  } catch (err: any) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ error: 'Failed to retrieve invoices.' });
  }
});

billingRouter.get('/invoices/:id', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const invoice = db.getInvoiceById(req.params.id);

    if (!invoice || (invoice.userId !== userId && req.user?.role !== 'admin')) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }

    res.json({
      success: true,
      invoice
    });
  } catch (err: any) {
    console.error('Error fetching invoice:', err);
    res.status(500).json({ error: 'Failed to retrieve invoice.' });
  }
});

billingRouter.post('/invoices/:id/send-email', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = req.user!;
    const invoice = db.getInvoiceById(req.params.id);

    if (!invoice || (invoice.userId !== userId && req.user?.role !== 'admin')) {
      return res.status(404).json({ error: 'Invoice not found or does not belong to your account.' });
    }

    const recipientEmail = req.body.email || user.email || invoice.customerEmail;

    // Record audit event for invoice dispatch
    db.recordSubscriptionEvent(userId, invoice.subscriptionId || 'sub_manual', 'invoice_email_dispatched', {
      invoiceId: invoice.id,
      amount: invoice.amount,
      recipientEmail,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Tax Invoice ${invoice.id} (৳${invoice.amount.toLocaleString()}) has been sent to ${recipientEmail}.`,
      sentTo: recipientEmail,
      invoiceId: invoice.id,
      sentAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Error sending invoice email:', err);
    res.status(500).json({ error: 'Failed to deliver invoice email receipt.' });
  }
});

billingRouter.post('/invoices/bulk-refund', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { invoiceIds, reason } = req.body;

    if (!Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of invoiceIds to refund.' });
    }

    const refundedInvoices: string[] = [];
    const failedInvoices: string[] = [];
    let totalRefundAmount = 0;

    for (const invId of invoiceIds) {
      const invoice = db.getInvoiceById(invId);
      if (!invoice) {
        failedInvoices.push(invId);
        continue;
      }

      // Check ownership or admin
      if (invoice.userId !== userId && req.user?.role !== 'admin') {
        failedInvoices.push(invId);
        continue;
      }

      // Mark invoice as refunded
      invoice.status = 'refunded' as any;
      totalRefundAmount += invoice.amount || 0;
      refundedInvoices.push(invId);

      // Audit log
      db.recordSubscriptionEvent(invoice.userId, invoice.subscriptionId || 'sub_manual', 'invoice_bulk_refunded', {
        invoiceId: invId,
        amount: invoice.amount,
        reason: reason || 'Customer / Admin Bulk Refund Request',
        processedBy: req.user!.email,
        timestamp: new Date().toISOString()
      });
    }

    db.save();

    res.json({
      success: true,
      message: `Successfully processed bulk refund for ${refundedInvoices.length} ${refundedInvoices.length === 1 ? 'invoice' : 'invoices'} (Total ৳${totalRefundAmount.toLocaleString()}).`,
      refundedCount: refundedInvoices.length,
      refundedInvoices,
      failedInvoices,
      totalRefundAmount
    });
  } catch (err: any) {
    console.error('Error processing bulk refund:', err);
    res.status(500).json({ error: 'Failed to process bulk refund.' });
  }
});

// ==========================================
// 11. AI USAGE QUOTA
// ==========================================
billingRouter.get('/usage', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const planId = getUserActivePlanId(userId);
    const plan = db.getPlanById(planId) || db.getPlanById('free')!;
    const usage = db.getAIUsageForCurrentMonth(userId);
    const aiLimit = plan.aiMonthlyLimit || PLAN_LIMITS[planId]?.aiMonthlyQuota || 10;

    res.json({
      success: true,
      planId,
      planName: plan.name,
      aiCoachInteractions: usage.aiCoachInteractions,
      aiMonthlyLimit: aiLimit,
      remainingQuota: Math.max(0, aiLimit - usage.aiCoachInteractions),
      periodYearMonth: usage.periodYearMonth
    });
  } catch (err: any) {
    console.error('Error fetching usage record:', err);
    res.status(500).json({ error: 'Failed to fetch AI usage.' });
  }
});

// ==========================================
// 12. SAVED PAYMENT METHODS & TOKEN REFRESH
// ==========================================
billingRouter.get('/payment-methods', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const paymentMethods = db.getUserPaymentMethods(userId);
    res.json({
      success: true,
      paymentMethods
    });
  } catch (err: any) {
    console.error('Error fetching payment methods:', err);
    res.status(500).json({ error: 'Failed to retrieve saved payment methods.' });
  }
});

billingRouter.post('/payment-methods', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { type, bKashNumber, cardNumber, cardExpiry, cardCvc, cardHolderName, isDefault } = req.body;

    if (!type || (type !== 'bkash' && type !== 'card' && type !== 'nagad' && type !== 'rocket')) {
      return res.status(400).json({ error: 'Invalid payment method type. Must be "bkash" or "card".' });
    }

    if (type === 'bkash') {
      const cleanBkash = (bKashNumber || '').replace(/\D/g, '');
      if (!cleanBkash || cleanBkash.length !== 11 || !cleanBkash.startsWith('01')) {
        return res.status(400).json({ error: 'Please enter a valid 11-digit Bangladesh bKash mobile number (e.g. 01712345678).' });
      }

      const masked = `${cleanBkash.slice(0, 3)}*****${cleanBkash.slice(8)}`;
      const savedMethod = db.addSavedPaymentMethod({
        userId,
        type: 'bkash',
        bKashNumberMasked: masked,
        isDefault: isDefault !== undefined ? isDefault : true
      });

      return res.json({
        success: true,
        message: `bKash payment agreement successfully linked and tokenized for ${masked}.`,
        paymentMethod: savedMethod
      });
    }

    if (type === 'card') {
      const cleanCard = (cardNumber || '').replace(/\D/g, '');
      if (!cleanCard || cleanCard.length < 13 || cleanCard.length > 19) {
        return res.status(400).json({ error: 'Please enter a valid card number (13-19 digits).' });
      }

      if (!cardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry.trim())) {
        return res.status(400).json({ error: 'Please enter a valid expiration date in MM/YY format.' });
      }

      const cleanCvc = (cardCvc || '').replace(/\D/g, '');
      if (!cleanCvc || cleanCvc.length < 3 || cleanCvc.length > 4) {
        return res.status(400).json({ error: 'Please enter a valid 3 or 4 digit CVV/CVC code.' });
      }

      const cleanHolder = (cardHolderName || '').trim();
      if (!cleanHolder || cleanHolder.length < 2) {
        return res.status(400).json({ error: 'Please enter the cardholder full name as printed on the card.' });
      }

      // Identify brand
      let cardBrand = 'visa';
      if (/^5[1-5]/.test(cleanCard)) cardBrand = 'mastercard';
      else if (/^3[47]/.test(cleanCard)) cardBrand = 'amex';
      else if (/^6011|^65/.test(cleanCard)) cardBrand = 'discover';

      const last4 = cleanCard.slice(-4);
      const savedMethod = db.addSavedPaymentMethod({
        userId,
        type: 'card',
        cardLast4: last4,
        cardBrand,
        cardExpiry: cardExpiry.trim(),
        cardHolderName: cleanHolder,
        isDefault: isDefault !== undefined ? isDefault : true
      });

      return res.json({
        success: true,
        message: `${cardBrand.toUpperCase()} ending in •••• ${last4} linked and encrypted securely.`,
        paymentMethod: savedMethod
      });
    }
  } catch (err: any) {
    console.error('Error saving payment method:', err);
    res.status(500).json({ error: err.message || 'Failed to save payment method.' });
  }
});

billingRouter.post('/payment-methods/:id/refresh', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const pmId = req.params.id;

    const result = db.refreshPaymentMethodToken(userId, pmId);
    res.json(result);
  } catch (err: any) {
    console.error('Error refreshing payment token:', err);
    res.status(500).json({ error: err.message || 'Failed to refresh payment method token.' });
  }
});

billingRouter.post('/payment-methods/:id/set-default', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const pmId = req.params.id;

    const updated = db.setDefaultPaymentMethod(userId, pmId);
    if (!updated) {
      return res.status(404).json({ error: 'Payment method not found.' });
    }

    res.json({
      success: true,
      message: 'Default payment method updated for recurring subscription billing.',
      paymentMethod: updated
    });
  } catch (err: any) {
    console.error('Error setting default payment method:', err);
    res.status(500).json({ error: err.message || 'Failed to set default payment method.' });
  }
});

billingRouter.delete('/payment-methods/:id', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const pmId = req.params.id;

    const success = db.deletePaymentMethod(userId, pmId);
    if (!success) {
      return res.status(404).json({ error: 'Payment method not found or could not be removed.' });
    }

    res.json({
      success: true,
      message: 'Payment method removed successfully.'
    });
  } catch (err: any) {
    console.error('Error deleting payment method:', err);
    res.status(500).json({ error: err.message || 'Failed to delete payment method.' });
  }
});

