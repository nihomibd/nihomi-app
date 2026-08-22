// src/lib/billing/providers/types.ts
// Nihomi (にほみ • Learn & Work) — Payment Provider Abstraction Layer

import { BillingInterval, PlanId } from '@/types/subscription';

export interface CreateCheckoutParams {
  userId: string;
  userEmail: string;
  userName?: string | null;
  userPhone?: string | null;
  planId: PlanId;
  planPriceId: string;
  billingInterval: BillingInterval;
  amount: number; // In BDT ৳
  currency: string;
  couponCode?: string;
  discountAmount?: number;
  redirectUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResult {
  sessionId: string;
  gatewayUrl: string; // The URL to redirect the student to
  provider: string;
  metadata?: Record<string, any>;
}

export interface PaymentVerificationResult {
  isVerified: boolean;
  status: 'paid' | 'failed' | 'cancelled' | 'pending';
  providerTransactionId: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  rawResponse: Record<string, any>;
  errorMessage?: string;
}

export interface WebhookProcessResult {
  handled: boolean;
  isDuplicate: boolean;
  eventType: string;
  transactionId?: string;
  status: 'paid' | 'failed' | 'cancelled' | 'ignored';
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
  error?: string;
}

export interface PaymentProvider {
  readonly providerName: string;

  /**
   * Generates a hosted checkout or tokenized payment session with the gateway
   */
  createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutSessionResult>;

  /**
   * Server-side verification of payment via direct Gateway query API
   */
  verifyPayment(transactionId: string, payload?: Record<string, any>): Promise<PaymentVerificationResult>;

  /**
   * Secure processing and verification of inbound asynchronous Webhooks
   */
  handleWebhook(
    rawBody: string,
    headers: Record<string, string>,
    parsedJson?: any
  ): Promise<WebhookProcessResult>;

  /**
   * Optional refund capability
   */
  refundPayment?(
    paymentId: string,
    amount: number,
    reason: string
  ): Promise<{ success: boolean; refundId?: string; error?: string }>;
}
