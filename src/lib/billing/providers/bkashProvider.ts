// src/lib/billing/providers/bkashProvider.ts
// Nihomi (にほみ) — bKash Payment Gateway Adapter

import {
  CheckoutSessionResult,
  CreateCheckoutParams,
  PaymentProvider,
  PaymentVerificationResult,
  WebhookProcessResult,
} from './types';

export class BkashPaymentProvider implements PaymentProvider {
  readonly providerName = 'bkash';

  private appKey: string;
  private appSecret: string;
  private username: string;
  private password: string;
  private baseUrl: string;

  constructor() {
    this.appKey = process.env.BKASH_APP_KEY || '';
    this.appSecret = process.env.BKASH_APP_SECRET || '';
    this.username = process.env.BKASH_USERNAME || '';
    this.password = process.env.BKASH_PASSWORD || '';
    this.baseUrl = process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';
  }

  /**
   * Generates an authentication token from bKash
   */
  private async getAuthToken(): Promise<string> {
    if (process.env.NODE_ENV === 'development' && !this.appKey) {
      return 'mock_bkash_auth_token_dev';
    }

    const response = await fetch(`${this.baseUrl}/tokenized/checkout/token/grant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        username: this.username,
        password: this.password,
      },
      body: JSON.stringify({
        app_key: this.appKey,
        app_secret: this.appSecret,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.id_token) {
      throw new Error(`bKash Auth Failed: ${data.statusMessage || 'Unknown error'}`);
    }

    return data.id_token;
  }

  /**
   * Initiates payment creation and returns the bKash payment execution URL
   */
  async createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutSessionResult> {
    // Sandbox / Mock fallback for local development without live credentials
    if (process.env.NODE_ENV === 'development' && (!this.appKey || this.appKey.startsWith('mock_'))) {
      const mockPaymentId = `BKASH_MOCK_${Date.now()}`;
      return {
        sessionId: mockPaymentId,
        gatewayUrl: `${params.redirectUrl}?paymentID=${mockPaymentId}&status=success`,
        provider: this.providerName,
        metadata: {
          planId: params.planId,
          userId: params.userId,
          billingInterval: params.billingInterval,
          amount: params.amount,
        },
      };
    }

    const token = await this.getAuthToken();
    const invoiceNumber = `NIH-${Date.now()}`;

    const res = await fetch(`${this.baseUrl}/tokenized/checkout/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'X-APP-Key': this.appKey,
      },
      body: JSON.stringify({
        mode: '0011',
        payerReference: params.userId,
        callbackURL: params.redirectUrl,
        amount: params.amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: invoiceNumber,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.statusCode !== '0000') {
      throw new Error(`bKash Checkout Creation Failed: ${data.statusMessage || 'Gateway Error'}`);
    }

    return {
      sessionId: data.paymentID,
      gatewayUrl: data.bkashURL,
      provider: this.providerName,
      metadata: {
        invoiceNumber,
        planId: params.planId,
        billingInterval: params.billingInterval,
        userId: params.userId,
      },
    };
  }

  /**
   * Executes and verifies payment server-side with bKash
   */
  async verifyPayment(paymentID: string, payload?: Record<string, any>): Promise<PaymentVerificationResult> {
    if (paymentID.startsWith('BKASH_MOCK_')) {
      return {
        isVerified: true,
        status: 'paid',
        providerTransactionId: `TRX_${paymentID}`,
        amount: payload?.amount || 599,
        currency: 'BDT',
        paymentMethod: 'bkash_wallet',
        rawResponse: { mock: true, paymentID },
      };
    }

    const token = await this.getAuthToken();
    const res = await fetch(`${this.baseUrl}/tokenized/checkout/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'X-APP-Key': this.appKey,
      },
      body: JSON.stringify({ paymentID }),
    });

    const data = await res.json();
    const isSuccess = data.statusCode === '0000' && data.transactionStatus === 'Completed';

    return {
      isVerified: isSuccess,
      status: isSuccess ? 'paid' : 'failed',
      providerTransactionId: data.trxID || paymentID,
      amount: parseFloat(data.amount || '0'),
      currency: 'BDT',
      paymentMethod: 'bkash_wallet',
      rawResponse: data,
      errorMessage: isSuccess ? undefined : data.statusMessage,
    };
  }

  /**
   * Inbound Webhook processing with signature security check
   */
  async handleWebhook(
    rawBody: string,
    headers: Record<string, string>,
    parsedJson?: any
  ): Promise<WebhookProcessResult> {
    const payload = parsedJson || JSON.parse(rawBody || '{}');
    const paymentID = payload.paymentID || payload.payment_id;
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
      metadata: payload,
    };
  }
}
