// src/lib/billing/providers/bkashProvider.ts
// Nihomi (にほみ) — bKash Payment Gateway Client Proxy

import {
  CheckoutSessionResult,
  CreateCheckoutParams,
  PaymentProvider,
  PaymentVerificationResult,
  WebhookProcessResult,
} from './types';

export class BkashPaymentProvider implements PaymentProvider {
  readonly providerName = 'bkash';

  /**
   * Initiates payment creation via Nihomi secure billing API
   */
  async createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutSessionResult> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        planId: params.planId,
        billingInterval: params.billingInterval,
        provider: 'bkash',
        couponCode: params.couponCode,
        accountNumber: params.userPhone
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to initiate bKash payment session.');
    }

    return {
      sessionId: data.checkout?.paymentId || data.checkout?.providerReference || `BKASH-${Date.now()}`,
      gatewayUrl: data.checkout?.redirectUrl || data.checkout?.gatewayUrl || '',
      provider: this.providerName,
      metadata: {
        paymentId: data.checkout?.paymentId,
        planId: params.planId,
        billingInterval: params.billingInterval,
        userId: params.userId,
        amount: data.checkout?.amount
      }
    };
  }

  /**
   * Verifies payment via Nihomi secure billing API
   */
  async verifyPayment(paymentID: string, payload?: Record<string, any>): Promise<PaymentVerificationResult> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch('/api/billing/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        paymentId: paymentID,
        providerTransactionId: payload?.providerTransactionId || paymentID,
        accountNumber: payload?.accountNumber
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        isVerified: false,
        status: 'failed',
        providerTransactionId: paymentID,
        amount: payload?.amount || 0,
        currency: 'BDT',
        paymentMethod: 'bKash MFS',
        rawResponse: data,
        errorMessage: data.error || 'bKash payment verification failed.'
      };
    }

    return {
      isVerified: true,
      status: 'paid',
      providerTransactionId: data.payment?.providerTransactionId || paymentID,
      amount: data.payment?.amount || 0,
      currency: 'BDT',
      paymentMethod: data.payment?.paymentMethodDetails?.type || 'bKash MFS (Tokenized)',
      rawResponse: data
    };
  }

  /**
   * Webhook processing (delegated to backend /api/billing/webhook/bkash)
   */
  async handleWebhook(
    rawBody: string,
    headers: Record<string, string>,
    parsedJson?: any
  ): Promise<WebhookProcessResult> {
    const payload = parsedJson || JSON.parse(rawBody || '{}');
    const paymentID = payload.paymentID || payload.payment_id || payload.merchantInvoiceNumber;
    const trxID = payload.trxID || payload.transaction_id;
    const status = payload.transactionStatus || payload.status;

    const isSuccess = status === 'Completed' || status === 'Successful' || status === '0000';

    return {
      handled: true,
      isDuplicate: false,
      eventType: isSuccess ? 'payment.success' : 'payment.failed',
      transactionId: trxID || paymentID,
      status: isSuccess ? 'paid' : 'failed',
      amount: payload.amount ? parseFloat(payload.amount) : undefined,
      currency: 'BDT',
      paymentMethod: 'bkash_wallet',
      metadata: payload
    };
  }
}

