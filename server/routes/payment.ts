import { Router, Request, Response } from 'express';
import { bKashService } from '../services/bKashService.js';
import { sslCommerzService } from '../services/sslCommerzService.js';
import { stripePaymentService } from '../services/stripePaymentService.js';
import { subscriptionService, SUBSCRIPTION_TIERS, SubscriptionTier } from '../services/subscriptionService.js';
import { optionalAuth } from '../middleware/auth.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { prisma, isDatabaseConfigured } from '../prisma.js';
import { db } from '../db.js';

export const paymentRouter = Router();

// ========================================================
// 1. PUBLIC PLAN CATALOG
// ========================================================
paymentRouter.get('/plans', (_req: Request, res: Response) => {
  try {
    const plans = subscriptionService.getCatalog();
    return res.json({
      success: true,
      plans,
    });
  } catch (err: any) {
    console.error('[PaymentRouter] Error fetching plans:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch plan catalog' });
  }
});

// ========================================================
// 2. CREATE BKASH CHECKOUT SESSION
// ========================================================
paymentRouter.post('/create', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { tier = 'n5_pro', callbackUrl } = req.body;
    const user = req.user;

    const selectedTier = (tier as SubscriptionTier);
    if (selectedTier !== 'n5_pro' && selectedTier !== 'n5_lifetime') {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan tier. Allowed options: "n5_pro", "n5_lifetime".',
      });
    }

    const planConfig = SUBSCRIPTION_TIERS[selectedTier];
    const amount = planConfig.priceBdt;
    const resolvedUserId = user?.id || req.body.userId || 'usr_guest_' + Math.random().toString(36).substring(2, 8);
    const resolvedEmail = user?.email || req.body.email || 'student@nihomi.com';

    const invoiceNumber = `INV_NHO_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
    const finalCallbackUrl = callbackUrl || `${appUrl}/api/payment/callback`;

    console.log(`[PaymentRouter] Initiating bKash checkout for ${resolvedEmail}, tier: ${selectedTier}, amount: ৳${amount}`);

    // Call bKash Tokenized Checkout Create API
    const bkashRes = await bKashService.createPayment({
      amount,
      invoiceNumber,
      payerReference: resolvedUserId,
      callbackUrl: finalCallbackUrl,
    });

    // Record pending transaction in Prisma PostgreSQL if configured (non-blocking fallback)
    if (isDatabaseConfigured()) {
      try {
        // Find or create user in prisma if missing
        let dbUser = await prisma.user.findFirst({
          where: { OR: [{ id: resolvedUserId }, { email: resolvedEmail }] },
        });

        if (!dbUser && resolvedEmail) {
          dbUser = await prisma.user.create({
            data: {
              id: resolvedUserId.startsWith('usr_') ? resolvedUserId : undefined,
              email: resolvedEmail,
              name: resolvedEmail.split('@')[0],
              subscriptionTier: 'free',
            },
          });
        }

        if (dbUser) {
          await prisma.payment.create({
            data: {
              userId: dbUser.id,
              paymentProvider: 'bkash',
              providerTransactionId: `PENDING_${bkashRes.paymentID}`,
              paymentID: bkashRes.paymentID,
              invoiceNumber,
              amount,
              currency: 'BDT',
              status: 'initiated',
              paymentMethod: 'bKash MFS',
              metadata: {
                tier: selectedTier,
                invoiceNumber,
                userEmail: resolvedEmail,
                initiatedAt: new Date().toISOString(),
              },
            },
          });
        }
      } catch (dbErr: any) {
        console.warn('[PaymentRouter] Prisma initial log warning (continuing):', dbErr?.message);
      }
    }

    // Also record in memory db for state synchronization
    try {
      const memPayment = db.createPayment({
        userId: resolvedUserId,
        planId: selectedTier as any,
        planName: planConfig.name,
        billingInterval: selectedTier === 'n5_lifetime' ? ('yearly' as any) : ('monthly' as any),
        amount,
        originalAmount: amount,
        discountAmount: 0,
        provider: 'bkash',
      });

      db.updatePayment(memPayment.id, {
        providerTransactionId: `PENDING_${bkashRes.paymentID}`,
        metadata: {
          paymentID: bkashRes.paymentID,
          invoiceNumber,
          tier: selectedTier,
          userEmail: resolvedEmail,
        },
      });
      db.save();
    } catch (memErr: any) {
      console.warn('[PaymentRouter] In-memory payment init log error:', memErr?.message);
    }

    return res.json({
      success: true,
      paymentID: bkashRes.paymentID,
      bkashURL: bkashRes.bkashURL,
      invoiceNumber,
      amount,
      currency: 'BDT',
      tier: selectedTier,
      planNameBn: planConfig.nameBn,
    });
  } catch (err: any) {
    console.error('[PaymentRouter] Checkout initiation failed:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to initiate bKash checkout session.',
    });
  }
});

// ========================================================
// 3. BKASH REDIRECT CALLBACK (BROWSER RETURN)
// ========================================================
paymentRouter.get('/callback', async (req: Request, res: Response) => {
  const { paymentID, status } = req.query as { paymentID?: string; status?: string };

  console.log(`[PaymentRouter Callback] Return from bKash: paymentID=${paymentID}, status=${status}`);

  if (!paymentID) {
    return res.redirect('/payment/callback?status=failed&error=missing_payment_id');
  }

  // Handle cancellation or failure returned directly from bKash gateway
  if (status !== 'success') {
    console.warn(`[PaymentRouter Callback] Payment status is '${status}' for paymentID ${paymentID}`);
    return res.redirect(`/payment/callback?status=${encodeURIComponent(status || 'failed')}&paymentID=${encodeURIComponent(paymentID)}`);
  }

  try {
    // 1. Execute payment with bKash API
    const execResult = await bKashService.executePayment(paymentID);

    // 2. Strict validation: transactionStatus must be 'Completed'
    if (execResult.transactionStatus !== 'Completed' || !execResult.trxID) {
      console.error(`[PaymentRouter Callback] Incomplete status: ${execResult.transactionStatus}`);
      return res.redirect(`/payment/callback?status=failed&error=incomplete_transaction&paymentID=${encodeURIComponent(paymentID)}`);
    }

    // 3. Resolve tier and user info from stored payment metadata
    let resolvedUserId = execResult.payerReference || 'usr_student';
    let resolvedEmail = 'student@nihomi.com';
    let resolvedTier: 'n5_pro' | 'n5_lifetime' = 'n5_pro';
    const amount = Number(execResult.amount) || 499;
    const invoiceNumber = execResult.merchantInvoiceNumber || `INV_${Date.now()}`;

    // Check Prisma Payment metadata if configured
    if (isDatabaseConfigured()) {
      try {
        const storedPayment = await prisma.payment.findFirst({
          where: { paymentID },
        });
        if (storedPayment) {
          resolvedUserId = storedPayment.userId;
          const meta = (storedPayment.metadata as any) || {};
          if (meta.tier === 'n5_lifetime') resolvedTier = 'n5_lifetime';
          if (meta.userEmail) resolvedEmail = meta.userEmail;
        }
      } catch (err: any) {
        console.warn('[PaymentRouter Callback] Prisma metadata lookup warning:', err?.message);
      }
    }

    // Check memory db if still needed
    const allMemPayments = db.getAllPayments();
    const memPayment = allMemPayments.find((p: any) => (p.metadata as any)?.paymentID === paymentID);
    if (memPayment) {
      resolvedUserId = memPayment.userId;
      if (memPayment.planId === 'n5_lifetime') resolvedTier = 'n5_lifetime';
      const user = db.findUserById(resolvedUserId);
      if (user?.email) resolvedEmail = user.email;
    }

    // Fallback tier detection based on amount paid
    if (amount >= 1400) {
      resolvedTier = 'n5_lifetime';
    }

    // 4. Atomically activate user subscription in Prisma & Memory DB
    const activation = await subscriptionService.activateSubscription({
      userId: resolvedUserId,
      userEmail: resolvedEmail,
      tier: resolvedTier,
      trxID: execResult.trxID,
      amount,
      paymentID,
      invoiceNumber,
    });

    console.log(`[PaymentRouter Callback] Subscription activated successfully for trxID: ${execResult.trxID}`);

    // 5. Redirect to frontend success page
    const redirectParams = new URLSearchParams({
      status: 'success',
      trxID: execResult.trxID,
      tier: resolvedTier,
      amount: String(amount),
      invoiceNumber,
    });

    return res.redirect(`/payment/callback?${redirectParams.toString()}`);
  } catch (err: any) {
    console.error('[PaymentRouter Callback] Execution error:', err);
    return res.redirect(`/payment/callback?status=failed&error=${encodeURIComponent(err?.message || 'Execution error')}&paymentID=${encodeURIComponent(paymentID)}`);
  }
});

// ========================================================
// 4. DIRECT EXECUTE ENDPOINT (API / SPA / MOBILE)
// ========================================================
paymentRouter.post('/execute', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { paymentID } = req.body;
  const user = req.user;

  if (!paymentID) {
    return res.status(400).json({ success: false, error: 'paymentID is required' });
  }

  try {
    const execResult = await bKashService.executePayment(paymentID);

    if (execResult.transactionStatus !== 'Completed' || !execResult.trxID) {
      return res.status(400).json({
        success: false,
        error: `Transaction status is '${execResult.transactionStatus || 'unknown'}'. Not completed.`,
      });
    }

    let resolvedUserId = user?.id || execResult.payerReference || 'usr_student';
    let resolvedEmail = user?.email || 'student@nihomi.com';
    let resolvedTier: 'n5_pro' | 'n5_lifetime' = 'n5_pro';
    const amount = Number(execResult.amount) || 499;
    const invoiceNumber = execResult.merchantInvoiceNumber || `INV_${Date.now()}`;

    if (amount >= 1400) {
      resolvedTier = 'n5_lifetime';
    }

    const activation = await subscriptionService.activateSubscription({
      userId: resolvedUserId,
      userEmail: resolvedEmail,
      tier: resolvedTier,
      trxID: execResult.trxID,
      amount,
      paymentID,
      invoiceNumber,
    });

    return res.json({
      success: true,
      trxID: execResult.trxID,
      tier: resolvedTier,
      expiresAt: activation.expiresAt,
      amount,
      invoiceNumber,
      message: activation.message,
    });
  } catch (err: any) {
    console.error('[PaymentRouter] Direct execute error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to execute payment with bKash API',
    });
  }
});

// ========================================================
// 5. QUERY PAYMENT STATUS DIRECTLY FROM BKASH
// ========================================================
paymentRouter.get('/query/:paymentID', async (req: Request, res: Response) => {
  try {
    const { paymentID } = req.params;
    const statusData = await bKashService.queryPayment(paymentID);
    return res.json({
      success: true,
      data: statusData,
    });
  } catch (err: any) {
    console.error('[PaymentRouter] Query error:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Failed to query payment' });
  }
});

// ========================================================
// 6. CURRENT USER'S SUBSCRIPTION TIER & LIMITS
// ========================================================
const getSubscriptionHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const identifier = user?.id || user?.email || (req.headers['x-user-id'] as string) || (req.query.userId as string);

    if (!identifier) {
      return res.json({
        success: true,
        tier: 'free',
        status: 'inactive',
        expiresAt: null,
        isLifetime: false,
        limits: SUBSCRIPTION_TIERS.free.limits,
      });
    }

    const sub = await subscriptionService.getUserSubscription(identifier);
    return res.json({
      success: true,
      ...sub,
      config: SUBSCRIPTION_TIERS[sub.tier],
    });
  } catch (err: any) {
    console.error('[PaymentRouter] Error fetching user subscription:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve subscription' });
  }
};

paymentRouter.get('/me', optionalAuth, getSubscriptionHandler);
paymentRouter.get('/subscription', optionalAuth, getSubscriptionHandler);

// ========================================================
// 7. MANUAL BKASH / NAGAD PAYMENT INSTRUCTIONS & SUBMISSION
// ========================================================
paymentRouter.get('/manual/instructions', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    accountInfo: {
      bkashNumber: process.env.MANUAL_PAY_BKASH_NUMBER || '01834348966',
      bkashNumberDisplay: '01834-348966',
      bkashAccountType: 'Personal / Send Money',
      nagadNumber: process.env.MANUAL_PAY_NAGAD_NUMBER || '01834348966',
      nagadNumberDisplay: '01834-348966',
      nagadAccountType: 'Personal / Send Money',
      helplinePhone: '01834348966',
      whatsappUrl: 'https://wa.me/8801834348966',
    },
    plans: [
      {
        id: 'n5_pro',
        nameBn: 'N5 প্রো (মাসিক)',
        amountBdt: 499,
        interval: 'monthly',
      },
      {
        id: 'n5_lifetime',
        nameBn: 'N5 লাইফটাইম পাস',
        amountBdt: 1499,
        interval: 'lifetime',
      },
    ],
    stepsBn: [
      'আপনার bKash বা Nagad অ্যাপে যান এবং "Send Money" নির্বাচন করুন।',
      'আমাদের অফিসিয়াল নম্বরে কাঙ্ক্ষিত প্ল্যানের সমপরিমাণ টাকা পাঠান (01834348966)।',
      'সফলভাবে টাকা পাঠানোর পর প্রাপ্ত এসএমএস থেকে TrxID এবং আপনার প্রেরক নম্বর নিচে দিয়ে সাবমিট করুন।',
      'অ্যাডমিন যাচাই করার সাথে সাথেই আপনার ড্যাশবোর্ডে Pro কোর্স আনলক হয়ে যাবে (সর্বোচ্চ ৫-১৫ মিনিট)।',
    ],
  });
});

paymentRouter.post('/manual/submit', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { senderPhone, trxID, selectedPlan, paymentMethod = 'bkash', studentName, note } = req.body;
    const user = req.user;

    const result = await subscriptionService.submitManualPayment({
      senderPhone,
      trxID,
      selectedPlan,
      paymentMethod,
      userId: user?.id || (req.headers['x-user-id'] as string),
      userEmail: user?.email || req.body.email,
      studentName: studentName || user?.name || user?.displayName,
      note,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (err: any) {
    console.error('[PaymentRouter] Manual payment submission error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'পেমেন্ট সাবমিশন প্রক্রিয়াকরণে ত্রুটি হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।',
    });
  }
});

// Student: Check own pending manual submission status
paymentRouter.get('/manual/my-pending', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const email = user?.email || (req.query.email as string);
    const userId = user?.id || (req.query.userId as string);
    if (!email && !userId) {
      return res.json({ success: true, pending: null });
    }

    const memSubmissions: any[] = (db.data as any).manualTrxSubmissions || [];
    const pending = memSubmissions.find(
      (s: any) =>
        s.status === 'pending' &&
        ((userId && s.userId === userId) || (email && s.studentEmail?.toLowerCase() === (email || '').toLowerCase()))
    );

    return res.json({
      success: true,
      pending: pending || null,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to query pending submission.' });
  }
});

// ========================================================
// 8. ADMIN PAYMENT VERIFICATION & 1-CLICK ACCESS GRANT
// ========================================================
const isFounderOrAdmin = (user: any) => {
  return (
    user?.role === 'admin' ||
    user?.role === 'founder' ||
    user?.email === 'mdtanvirkabirbiplob@gmail.com'
  );
};

paymentRouter.get('/admin/pending', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!isFounderOrAdmin(user)) {
      return res.status(403).json({ success: false, error: 'Unauthorized: Admin privileges required.' });
    }

    const memSubmissions = (db.data as any).manualTrxSubmissions || [];
    return res.json({
      success: true,
      submissions: memSubmissions,
    });
  } catch (err: any) {
    console.error('[PaymentRouter] Error fetching admin pending submissions:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve pending submissions.' });
  }
});

paymentRouter.post('/admin/verify', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!isFounderOrAdmin(user)) {
      return res.status(403).json({ success: false, error: 'Unauthorized: Admin privileges required.' });
    }

    const { transactionId, trxID, submissionId, action = 'approve', reason } = req.body;
    const lookupKey = (trxID || transactionId || submissionId || '').trim().toUpperCase();

    if (!lookupKey) {
      return res.status(400).json({ success: false, error: 'Transaction ID or TrxID is required.' });
    }

    if (action !== 'approve' && action !== 'reject') {
      return res.status(400).json({ success: false, error: 'Action must be "approve" or "reject".' });
    }

    // Find submission in memory
    if (!(db.data as any).manualTrxSubmissions) {
      (db.data as any).manualTrxSubmissions = [];
    }
    const submissions: any[] = (db.data as any).manualTrxSubmissions;
    let target = submissions.find(
      (s: any) =>
        s.id === transactionId ||
        s.id === submissionId ||
        s.trxId?.toUpperCase() === lookupKey
    );

    if (action === 'approve') {
      const planTier = (target?.planId === 'n5_lifetime' || req.body.planId === 'n5_lifetime') ? 'n5_lifetime' : 'n5_pro';
      const targetUserId = target?.userId || req.body.userId || 'usr_student';
      const targetEmail = target?.studentEmail || req.body.email || `${target?.studentPhone || 'student'}@nihomi.com`;
      const finalTrxID = target?.trxId || lookupKey;
      const amount = target?.amount || SUBSCRIPTION_TIERS[planTier].priceBdt;

      // 1. Activate subscription atomically
      const activation = await subscriptionService.activateSubscription({
        userId: targetUserId,
        userEmail: targetEmail,
        tier: planTier,
        trxID: finalTrxID,
        amount,
        paymentMethod: 'Manual bKash/Nagad (Admin Verified)',
      });

      // 2. Update memory submission record
      if (target) {
        target.status = 'approved';
        target.approvedAt = new Date().toISOString();
        target.approvedBy = user?.email || 'admin';
      } else {
        submissions.unshift({
          id: `subm_${Date.now()}_${finalTrxID}`,
          userId: targetUserId,
          studentName: req.body.studentName || 'Student',
          studentEmail: targetEmail,
          studentPhone: req.body.senderPhone || '018••••••66',
          trxId: finalTrxID,
          planId: planTier,
          planName: SUBSCRIPTION_TIERS[planTier].nameBn,
          amount,
          submittedAt: new Date().toISOString(),
          status: 'approved',
          approvedAt: new Date().toISOString(),
          approvedBy: user?.email || 'admin',
        });
      }

      // 3. Dispatch access notification to user
      try {
        db.createNotification({
          userId: targetUserId,
          type: 'achievement',
          title: '🎉 N5 Pro অ্যাক্সেস অনুমোদিত!',
          message: `আপনার পেমেন্ট (TrxID: ${finalTrxID}) ভেরিফাই সম্পন্ন হয়েছে। সকল লেসন ও ফুল মক টেস্ট এখন আনলক।`,
          link: '/study',
          priority: 'high',
        });
      } catch (e) {
        // quiet notification catch
      }

      db.save();

      return res.json({
        success: true,
        message: `✓ TrxID ${finalTrxID} সফলভাবে ভেরিফাই ও অ্যাক্টিভ করা হয়েছে!`,
        activation,
        submission: target,
      });
    } else {
      // Reject action
      if (target) {
        target.status = 'rejected';
        target.rejectedAt = new Date().toISOString();
        target.rejectedBy = user?.email || 'admin';
        target.rejectionReason = reason || 'অসঠিক বা অসম্পূর্ণ TrxID তথ্য।';
      }
      db.save();

      return res.json({
        success: true,
        message: `TrxID ${lookupKey} বাতিল করা হয়েছে।`,
        submission: target,
      });
    }
  } catch (err: any) {
    console.error('[PaymentRouter] Admin verify error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Verification failed.' });
  }
});

// ========================================================
// 9. SSLCOMMERZ GATEWAY INTEGRATION (MFS & CARDS)
// ========================================================
paymentRouter.post('/sslcommerz/init', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const {
      tier = 'n5_pro',
      planId,
      amount: requestedAmount,
      currency = 'BDT',
      callbackUrl,
      successUrl,
      failUrl,
      cancelUrl,
      name,
      phone
    } = req.body;

    const selectedTier = (planId || tier) as SubscriptionTier;
    const planConfig = SUBSCRIPTION_TIERS[selectedTier] || SUBSCRIPTION_TIERS.n5_pro;
    const amount = Number(requestedAmount) || planConfig.priceBdt || 499;

    const resolvedUserId = user?.id || req.body.userId || 'usr_guest_' + Math.random().toString(36).substring(2, 8);
    const resolvedEmail = user?.email || req.body.email || 'student@nihomi.com';
    const resolvedName = name || user?.name || resolvedEmail.split('@')[0];
    const resolvedPhone = phone || (user as any)?.phone || '+8801834-348966';

    const result = await sslCommerzService.initSession({
      amount,
      currency,
      planTier: selectedTier,
      userId: resolvedUserId,
      userEmail: resolvedEmail,
      userName: resolvedName,
      userPhone: resolvedPhone,
      callbackUrl,
      successUrl,
      failUrl,
      cancelUrl
    });

    return res.json(result);
  } catch (err: any) {
    console.error('[PaymentRouter] SSLCommerz init error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to initiate SSLCommerz session.'
    });
  }
});

const handleSslSuccess = async (req: Request, res: Response) => {
  try {
    const payload = { ...req.query, ...req.body };
    const tranId = payload.tran_id || payload.paymentId || (req.query.paymentId as string);
    const valId = payload.val_id;

    console.log(`[PaymentRouter] SSLCommerz success callback for tranId: ${tranId}, valId: ${valId}`);

    const result = await sslCommerzService.processPaymentSuccess(payload);

    // If client requested JSON (API / Mobile / Test), return JSON
    if (req.headers.accept?.includes('application/json') || req.is('json')) {
      return res.json(result);
    }

    // Otherwise redirect to frontend callback
    const redirectParams = new URLSearchParams({
      status: 'success',
      provider: 'sslcommerz',
      trxID: result.tranId,
      tier: result.tier,
      amount: String(result.amount),
      invoiceNumber: result.invoiceNumber
    });

    return res.redirect(`/payment/callback?${redirectParams.toString()}`);
  } catch (err: any) {
    console.error('[PaymentRouter] SSLCommerz success processing error:', err);
    return res.redirect(`/payment/callback?status=failed&error=${encodeURIComponent(err?.message || 'SSLCommerz processing error')}`);
  }
};

paymentRouter.post('/sslcommerz/success', handleSslSuccess);
paymentRouter.get('/sslcommerz/success', handleSslSuccess);

const handleSslFail = (req: Request, res: Response) => {
  const payload = { ...req.query, ...req.body };
  const tranId = payload.tran_id || payload.paymentId || '';
  const errorMsg = payload.error || payload.failedreason || 'Payment failed on SSLCommerz gateway.';

  if (tranId) {
    try {
      db.updatePayment(tranId, {
        status: 'failed',
        failedAt: new Date().toISOString(),
        failureReason: errorMsg
      });
      db.save();
    } catch {}
  }

  if (req.headers.accept?.includes('application/json')) {
    return res.status(400).json({ success: false, status: 'failed', error: errorMsg, tranId });
  }

  return res.redirect(`/payment/callback?status=failed&error=${encodeURIComponent(errorMsg)}&paymentID=${encodeURIComponent(tranId)}`);
};

paymentRouter.post('/sslcommerz/fail', handleSslFail);
paymentRouter.get('/sslcommerz/fail', handleSslFail);

const handleSslCancel = (req: Request, res: Response) => {
  const payload = { ...req.query, ...req.body };
  const tranId = payload.tran_id || payload.paymentId || '';

  if (tranId) {
    try {
      db.updatePayment(tranId, {
        status: 'cancelled',
        failureReason: 'Transaction cancelled by customer.'
      });
      db.save();
    } catch {}
  }

  if (req.headers.accept?.includes('application/json')) {
    return res.json({ success: true, status: 'cancelled', tranId });
  }

  return res.redirect(`/payment/callback?status=cancelled&paymentID=${encodeURIComponent(tranId)}`);
};

paymentRouter.post('/sslcommerz/cancel', handleSslCancel);
paymentRouter.get('/sslcommerz/cancel', handleSslCancel);

// SSLCommerz IPN (Instant Payment Notification) Webhook
paymentRouter.post('/sslcommerz/ipn', async (req: Request, res: Response) => {
  try {
    const payload = req.body || {};
    const signatureValid = sslCommerzService.verifyIpnSignature(payload);

    if (!signatureValid && process.env.NODE_ENV === 'production') {
      console.warn('[PaymentRouter] SSLCommerz IPN signature verification failed.');
      return res.status(400).send('IPN signature invalid');
    }

    await sslCommerzService.processPaymentSuccess(payload);
    return res.status(200).send('IPN OK');
  } catch (err: any) {
    console.error('[PaymentRouter] SSLCommerz IPN error:', err);
    return res.status(500).send('IPN processing error');
  }
});

// ========================================================
// 10. STRIPE GATEWAY INTEGRATION (GLOBAL CARDS / USD / JPY)
// ========================================================
paymentRouter.post('/stripe/create-checkout-session', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const {
      tier = 'n5_pro',
      planId,
      amount: requestedAmount,
      currency = 'usd',
      successUrl,
      cancelUrl
    } = req.body;

    const selectedTier = (planId || tier) as SubscriptionTier;
    const planConfig = SUBSCRIPTION_TIERS[selectedTier] || SUBSCRIPTION_TIERS.n5_pro;
    
    // Default international pricing: N5 Pro = $9.99 (or 499 BDT equivalent), Lifetime = $29.99
    let amount = Number(requestedAmount);
    if (!amount) {
      if (currency.toLowerCase() === 'usd') {
        amount = selectedTier === 'n5_lifetime' ? 29.99 : 9.99;
      } else if (currency.toLowerCase() === 'jpy') {
        amount = selectedTier === 'n5_lifetime' ? 4500 : 1500;
      } else {
        amount = planConfig.priceBdt || 499;
      }
    }

    const resolvedUserId = user?.id || req.body.userId || 'usr_guest_' + Math.random().toString(36).substring(2, 8);
    const resolvedEmail = user?.email || req.body.email || 'student@nihomi.com';

    const sessionResult = await stripePaymentService.createCheckoutSession({
      userId: resolvedUserId,
      userEmail: resolvedEmail,
      planTier: selectedTier,
      amount,
      currency,
      successUrl,
      cancelUrl
    });

    return res.json(sessionResult);
  } catch (err: any) {
    console.error('[PaymentRouter] Stripe session error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to create Stripe Checkout session.'
    });
  }
});

paymentRouter.post('/stripe/webhook', async (req: Request, res: Response) => {
  const sigHeader = (req.headers['stripe-signature'] || req.headers['x-stripe-signature']) as string | undefined;
  const rawBody = (req as any).rawBody || req.body;

  try {
    const signatureValid = stripePaymentService.verifyWebhookSignature(rawBody, sigHeader);

    if (!signatureValid && process.env.NODE_ENV === 'production' && stripePaymentService.isLiveConfigured) {
      console.warn('[PaymentRouter] Stripe webhook signature mismatch.');
      return res.status(400).json({ error: 'Webhook signature verification failed.' });
    }

    const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const processResult = await stripePaymentService.processWebhookEvent(
      event,
      req.headers as Record<string, any>,
      sigHeader
    );

    return res.json({ received: true, ...processResult });
  } catch (err: any) {
    console.error('[PaymentRouter] Stripe webhook handling exception:', err);
    return res.status(500).json({ error: 'Webhook processing exception.' });
  }
});


