import crypto from 'crypto';
import { prisma, isDatabaseConfigured } from '../prisma.js';
import { db } from '../db.js';
import { subscriptionService, SubscriptionTier } from './subscriptionService.js';

export interface StripeCheckoutParams {
  userId: string;
  userEmail: string;
  planTier: string;
  amount: number;
  currency?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface StripeCheckoutResult {
  success: boolean;
  sessionId: string;
  url: string;
  isMock: boolean;
  error?: string;
}

export class StripePaymentService {
  private static instance: StripePaymentService;

  public static getInstance(): StripePaymentService {
    if (!StripePaymentService.instance) {
      StripePaymentService.instance = new StripePaymentService();
    }
    return StripePaymentService.instance;
  }

  public get secretKey(): string {
    return process.env.STRIPE_SECRET_KEY || 'sk_test_nihomi_production_placeholder';
  }

  public get webhookSecret(): string {
    return process.env.STRIPE_WEBHOOK_SECRET || 'whsec_nihomi_production_webhook_secret';
  }

  public get isLiveConfigured(): boolean {
    const key = this.secretKey;
    return !!key && (key.startsWith('sk_live_') || (key.startsWith('sk_test_') && !key.includes('placeholder')));
  }

  /**
   * Creates a Stripe Checkout Session for international card payments
   */
  public async createCheckoutSession(params: StripeCheckoutParams): Promise<StripeCheckoutResult> {
    const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
    const successUrl = params.successUrl || `${appUrl}/payment/callback?status=success&provider=stripe&session_id={CHECKOUT_SESSION_ID}&tier=${encodeURIComponent(params.planTier)}`;
    const cancelUrl = params.cancelUrl || `${appUrl}/payment/callback?status=cancelled&provider=stripe`;
    const currency = (params.currency || 'usd').toLowerCase();
    
    // Convert to cents (smallest currency unit)
    const unitAmount = Math.round(params.amount * 100);

    // If live/sandbox Stripe API credentials are valid, call Stripe directly
    if (this.isLiveConfigured) {
      try {
        const formData = new URLSearchParams();
        formData.append('payment_method_types[0]', 'card');
        formData.append('mode', 'payment');
        formData.append('line_items[0][price_data][currency]', currency);
        formData.append('line_items[0][price_data][product_data][name]', `Nihomi Japanese Platform (${params.planTier})`);
        formData.append('line_items[0][price_data][product_data][description]', 'Official Japanese Language & SSW Visa Curriculum');
        formData.append('line_items[0][price_data][unit_amount]', String(unitAmount));
        formData.append('line_items[0][quantity]', '1');
        formData.append('customer_email', params.userEmail);
        formData.append('client_reference_id', params.userId);
        formData.append('metadata[userId]', params.userId);
        formData.append('metadata[userEmail]', params.userEmail);
        formData.append('metadata[planTier]', params.planTier);
        formData.append('success_url', successUrl);
        formData.append('cancel_url', cancelUrl);

        const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData.toString()
        });

        if (res.ok) {
          const session = (await res.json()) as any;
          await this.persistInitiatedStripePayment({
            sessionId: session.id,
            userId: params.userId,
            userEmail: params.userEmail,
            amount: params.amount,
            currency,
            planTier: params.planTier
          });

          return {
            success: true,
            sessionId: session.id,
            url: session.url || successUrl.replace('{CHECKOUT_SESSION_ID}', session.id),
            isMock: false
          };
        } else {
          const errText = await res.text();
          console.warn('[StripePaymentService] Stripe API error (falling back to sandbox simulator):', errText);
        }
      } catch (err: any) {
        console.warn('[StripePaymentService] Network error connecting to Stripe API:', err?.message);
      }
    }

    // Sandbox / Test Simulator Mode
    const mockSessionId = `cs_test_${crypto.randomBytes(16).toString('hex')}`;
    const redirectUrl = successUrl.replace('{CHECKOUT_SESSION_ID}', mockSessionId);

    await this.persistInitiatedStripePayment({
      sessionId: mockSessionId,
      userId: params.userId,
      userEmail: params.userEmail,
      amount: params.amount,
      currency,
      planTier: params.planTier
    });

    return {
      success: true,
      sessionId: mockSessionId,
      url: redirectUrl,
      isMock: true
    };
  }

  /**
   * Verifies official Stripe Webhook Signature Header (t=timestamp,v1=signature)
   * Prevents replay attacks and verifies cryptographic integrity
   */
  public verifyWebhookSignature(
    rawBody: string | Buffer,
    signatureHeader?: string,
    secret?: string,
    toleranceSeconds = 300
  ): boolean {
    const key = secret || this.webhookSecret;
    if (!signatureHeader || !key) return false;

    try {
      const rawString = Buffer.isBuffer(rawBody)
        ? rawBody.toString('utf-8')
        : typeof rawBody === 'string'
        ? rawBody
        : JSON.stringify(rawBody);

      if (!signatureHeader.includes('t=') || !signatureHeader.includes('v1=')) {
        // Direct HMAC fallback
        const expected = crypto.createHmac('sha256', key).update(rawString).digest('hex').toLowerCase();
        const cleanSig = signatureHeader.replace(/^sha256=/i, '').trim().toLowerCase();
        const expectedBuf = Buffer.from(expected, 'utf-8');
        const sigBuf = Buffer.from(cleanSig, 'utf-8');
        return expectedBuf.length === sigBuf.length && crypto.timingSafeEqual(expectedBuf, sigBuf);
      }

      const parts = signatureHeader.split(',');
      let timestamp = '';
      const signatures: string[] = [];

      for (const part of parts) {
        const [k, v] = part.split('=').map((s) => s.trim());
        if (k === 't') {
          timestamp = v;
        } else if (k === 'v1') {
          signatures.push(v);
        }
      }

      if (!timestamp || signatures.length === 0) {
        return false;
      }

      // Check timestamp tolerance
      const parsedTime = parseInt(timestamp, 10);
      if (!isNaN(parsedTime) && toleranceSeconds > 0 && process.env.NODE_ENV === 'production') {
        const nowSeconds = Math.floor(Date.now() / 1000);
        if (Math.abs(nowSeconds - parsedTime) > toleranceSeconds) {
          return false;
        }
      }

      const signedPayload = `${timestamp}.${rawString}`;
      const expectedHmac = crypto.createHmac('sha256', key).update(signedPayload).digest('hex').toLowerCase();
      const expectedBuffer = Buffer.from(expectedHmac, 'utf-8');

      for (const sig of signatures) {
        const cleanSig = sig.trim().toLowerCase();
        const sigBuffer = Buffer.from(cleanSig, 'utf-8');
        if (sigBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
          return true;
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Processes a verified Stripe Webhook event atomically and idempotently
   */
  public async processWebhookEvent(
    event: Record<string, any>,
    rawHeaders: Record<string, any> = {},
    signature?: string
  ): Promise<{
    success: boolean;
    eventId: string;
    eventType: string;
    idempotent: boolean;
    message: string;
  }> {
    const eventId = event.id || `evt_${crypto.randomBytes(12).toString('hex')}`;
    const eventType = event.type || 'checkout.session.completed';

    // 1. Idempotency Check (Prisma + Memory DB)
    if (isDatabaseConfigured()) {
      try {
        const existingEvent = await prisma.webhookEvent.findUnique({
          where: { provider_eventId: { provider: 'stripe', eventId } }
        });
        if (existingEvent && existingEvent.processed) {
          console.log(`[StripePaymentService] Idempotency: Webhook ${eventId} already processed.`);
          return {
            success: true,
            eventId,
            eventType,
            idempotent: true,
            message: 'Webhook event already processed previously.'
          };
        }
      } catch (err: any) {
        console.warn('[StripePaymentService] Prisma idempotency check warning:', err?.message);
      }
    }

    if (db.isWebhookProcessed(eventId, 'stripe')) {
      return {
        success: true,
        eventId,
        eventType,
        idempotent: true,
        message: 'Webhook event already processed in durable store.'
      };
    }

    // 2. Handle relevant event types
    if (eventType === 'checkout.session.completed' || eventType === 'payment_intent.succeeded') {
      const sessionObj = event.data?.object || {};
      const metadata = sessionObj.metadata || {};
      
      const userId = metadata.userId || sessionObj.client_reference_id || 'usr_student';
      const userEmail = metadata.userEmail || sessionObj.customer_email || sessionObj.customer_details?.email || 'student@nihomi.com';
      const rawTier = metadata.planTier || metadata.tier || 'n5_pro';
      const tier: SubscriptionTier = rawTier === 'n5_lifetime' || rawTier === 'lifetime' ? 'n5_lifetime' : 'n5_pro';
      
      const amountPaid = sessionObj.amount_total ? sessionObj.amount_total / 100 : (sessionObj.amount ? sessionObj.amount / 100 : 499);
      const trxId = sessionObj.payment_intent || sessionObj.id || eventId;
      const invoiceNumber = `INV_STRIPE_${Date.now()}`;

      // Upgrade student account
      await subscriptionService.activateSubscription({
        userId,
        userEmail,
        tier,
        trxID: trxId,
        amount: amountPaid,
        paymentID: sessionObj.id,
        invoiceNumber,
        paymentMethod: 'Stripe International Card'
      });

      // Record in Prisma WebhookEvent
      if (isDatabaseConfigured()) {
        try {
          await prisma.webhookEvent.upsert({
            where: { provider_eventId: { provider: 'stripe', eventId } },
            update: {
              processed: true,
              processedAt: new Date(),
              signatureValid: true
            },
            create: {
              eventId,
              provider: 'stripe',
              eventType,
              transactionId: trxId,
              rawHeaders: rawHeaders || {},
              rawPayload: event,
              signature: signature || null,
              signatureValid: true,
              processed: true,
              processedAt: new Date()
            }
          });
        } catch (err: any) {
          console.warn('[StripePaymentService] Prisma WebhookEvent persistence warning:', err?.message);
        }
      }

      // Record in Memory DB Webhook audit
      try {
        db.recordWebhookEvent({
          eventId,
          provider: 'stripe',
          eventType,
          signature,
          signatureVerified: true,
          rawHeaders: rawHeaders as Record<string, string>,
          rawPayload: event,
          status: 'success',
          ipAddress: 'stripe.internal'
        });
        db.save();
      } catch {}

      return {
        success: true,
        eventId,
        eventType,
        idempotent: false,
        message: `Successfully processed Stripe ${eventType} and upgraded user ${userId}.`
      };
    }

    return {
      success: true,
      eventId,
      eventType,
      idempotent: false,
      message: `Ignored unhandled Stripe event type ${eventType}.`
    };
  }

  /**
   * Persists initiated Stripe Checkout Session
   */
  private async persistInitiatedStripePayment(params: {
    sessionId: string;
    userId: string;
    userEmail: string;
    amount: number;
    currency: string;
    planTier: string;
  }) {
    if (isDatabaseConfigured()) {
      try {
        let dbUser = await prisma.user.findFirst({
          where: { OR: [{ id: params.userId }, { email: params.userEmail }] }
        });

        if (!dbUser && params.userEmail) {
          dbUser = await prisma.user.create({
            data: {
              email: params.userEmail,
              name: params.userEmail.split('@')[0],
              subscriptionTier: 'free'
            }
          });
        }

        if (dbUser) {
          await prisma.payment.upsert({
            where: { providerTransactionId: params.sessionId },
            update: {
              status: 'initiated',
              amount: params.amount,
              currency: params.currency
            },
            create: {
              userId: dbUser.id,
              paymentProvider: 'stripe',
              providerTransactionId: params.sessionId,
              paymentID: params.sessionId,
              invoiceNumber: `INV_STRIPE_INIT_${params.sessionId}`,
              amount: params.amount,
              currency: params.currency.toUpperCase(),
              status: 'initiated',
              paymentMethod: 'Stripe Card Checkout',
              metadata: {
                sessionId: params.sessionId,
                planTier: params.planTier,
                userEmail: params.userEmail,
                initiatedAt: new Date().toISOString()
              }
            }
          });
        }
      } catch (err: any) {
        console.warn('[StripePaymentService] Prisma initiated log warning:', err?.message);
      }
    }

    try {
      const memPayment = db.createPayment({
        userId: params.userId,
        planId: (params.planTier as any) || 'n5_pro',
        planName: `Nihomi Japanese (${params.planTier})`,
        billingInterval: params.planTier === 'n5_lifetime' ? ('yearly' as any) : ('monthly' as any),
        amount: params.amount,
        originalAmount: params.amount,
        discountAmount: 0,
        provider: 'stripe'
      });

      db.updatePayment(memPayment.id, {
        providerTransactionId: params.sessionId,
        metadata: {
          sessionId: params.sessionId,
          planTier: params.planTier,
          userEmail: params.userEmail
        }
      });
      db.save();
    } catch {}
  }
}

export const stripePaymentService = StripePaymentService.getInstance();
