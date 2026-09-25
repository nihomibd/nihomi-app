import { apiRequest } from './api';
import {
  Plan,
  PlanId,
  BillingInterval,
  PaymentProviderType,
  UserSubscriptionDetails,
  Invoice,
  Payment,
  SavedPaymentMethod,
  RevenueMetrics,
  Coupon,
  WebhookEvent,
  RevenueTrends
} from '../types';

export const billingApi = {
  // Public / User plans
  async getPlans(): Promise<{ success: boolean; plans: Plan[] }> {
    return apiRequest('/api/billing/plans');
  },

  // User subscription & entitlements
  async getSubscriptionDetails(): Promise<UserSubscriptionDetails> {
    return apiRequest('/api/billing/subscription');
  },

  // Validate coupon
  async validateCoupon(params: {
    code: string;
    planId: PlanId;
    billingInterval: BillingInterval;
  }): Promise<{
    success: boolean;
    code: string;
    discountType: 'percent' | 'fixed';
    discountValue: number;
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
    currency: 'BDT';
  }> {
    return apiRequest('/api/billing/validate-coupon', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  // Initiate checkout
  async initiateCheckout(params: {
    planId: PlanId;
    billingInterval: BillingInterval;
    provider: PaymentProviderType;
    couponCode?: string;
  }): Promise<{
    success: boolean;
    paymentId: string;
    provider: PaymentProviderType;
    providerReference: string;
    amount: number;
    originalAmount: number;
    discountAmount: number;
    currency: 'BDT';
    redirectUrl?: string;
    instructions?: string;
    fieldsNeeded?: string[];
    metadata?: Record<string, any>;
  }> {
    return apiRequest('/api/billing/checkout', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  // Verify server-side payment
  async verifyPayment(params: {
    paymentId: string;
    accountNumber?: string;
    otp?: string;
    pin?: string;
    providerTransactionId?: string;
    valId?: string;
    providerData?: Record<string, any>;
  }): Promise<{
    success: boolean;
    message: string;
    payment: Payment;
    subscription: any;
    invoice: Invoice;
  }> {
    return apiRequest('/api/billing/verify-payment', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  // Start 7-day trial
  async startTrial(planId: PlanId = 'pro'): Promise<{ success: boolean; message: string; subscription: any }> {
    return apiRequest('/api/billing/start-trial', {
      method: 'POST',
      body: JSON.stringify({ planId })
    });
  },

  // Cancel subscription
  async cancelSubscription(reason?: string, immediate = false): Promise<{ success: boolean; message: string; subscription: any }> {
    return apiRequest('/api/billing/cancel', {
      method: 'POST',
      body: JSON.stringify({ reason, immediate })
    });
  },

  // Reactivate subscription
  async reactivateSubscription(): Promise<{ success: boolean; message: string; subscription: any }> {
    return apiRequest('/api/billing/reactivate', {
      method: 'POST'
    });
  },

  // Toggle Auto Renewal
  async toggleAutoRenew(enabled: boolean): Promise<{ success: boolean; message: string; autoRenew: boolean; subscription: any }> {
    return apiRequest('/api/billing/toggle-auto-renew', {
      method: 'POST',
      body: JSON.stringify({ enabled })
    });
  },

  // Invoices
  async getInvoices(): Promise<{ success: boolean; invoices: Invoice[] }> {
    return apiRequest('/api/billing/invoices');
  },

  async getInvoice(id: string): Promise<{ success: boolean; invoice: Invoice }> {
    return apiRequest(`/api/billing/invoices/${id}`);
  },

  async sendInvoiceEmail(id: string, email?: string): Promise<{
    success: boolean;
    message: string;
    sentTo: string;
    invoiceId: string;
    sentAt: string;
  }> {
    return apiRequest(`/api/billing/invoices/${id}/send-email`, {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  // AI Usage
  async getAIUsage(): Promise<{
    success: boolean;
    planId: PlanId;
    planName: string;
    aiCoachInteractions: number;
    aiMonthlyLimit: number;
    remainingQuota: number;
    periodYearMonth: string;
  }> {
    return apiRequest('/api/billing/usage');
  },

  // Admin Revenue Metrics
  async getAdminRevenueMetrics(): Promise<{ success: boolean; metrics: RevenueMetrics }> {
    return apiRequest('/api/admin/revenue/metrics');
  },

  async getAdminSubscriptions(): Promise<{ success: boolean; subscriptions: any[] }> {
    return apiRequest('/api/admin/subscriptions');
  },

  async overrideSubscription(
    userId: string,
    params: { planId?: PlanId; status?: string; monthsToAdd?: number; note?: string }
  ): Promise<{ success: boolean; message: string; subscription: any }> {
    return apiRequest(`/api/admin/subscriptions/${userId}/override`, {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  async getAdminPayments(): Promise<{ success: boolean; payments: Payment[] }> {
    return apiRequest('/api/admin/payments');
  },

  async refundPayment(id: string, reason?: string): Promise<{ success: boolean; message: string }> {
    return apiRequest(`/api/admin/payments/${id}/refund`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  },

  async getAdminCoupons(): Promise<{ success: boolean; coupons: Coupon[] }> {
    return apiRequest('/api/admin/coupons');
  },

  async createCoupon(data: {
    code: string;
    discountType: 'percent' | 'fixed';
    discountValue: number;
    applicablePlans?: PlanId[];
    maxRedemptions?: number;
  }): Promise<{ success: boolean; coupon: Coupon }> {
    return apiRequest('/api/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getAdminAuditLogs(): Promise<{ success: boolean; logs: any[] }> {
    return apiRequest('/api/admin/audit-logs');
  },

  async getAdminWebhookEvents(): Promise<{ success: boolean; events: WebhookEvent[] }> {
    return apiRequest('/api/admin/webhook-events');
  },

  async retryWebhookEvent(id: string): Promise<{ success: boolean; message: string; event?: WebhookEvent }> {
    return apiRequest(`/api/admin/webhook-events/${id}/retry`, {
      method: 'POST'
    });
  },

  async getAdminRevenueTrends(): Promise<{ success: boolean; trends: RevenueTrends }> {
    return apiRequest('/api/admin/revenue-trends');
  },

  async triggerLifecycleCheck(): Promise<{ success: boolean; message: string }> {
    return apiRequest('/api/admin/lifecycle/trigger-check', {
      method: 'POST'
    });
  },

  // Saved Payment Methods & Token Management
  async getPaymentMethods(): Promise<{ success: boolean; paymentMethods: SavedPaymentMethod[] }> {
    return apiRequest('/api/billing/payment-methods');
  },

  async addPaymentMethod(data: {
    type: 'bkash' | 'card' | 'nagad' | 'rocket';
    bKashNumber?: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvc?: string;
    cardHolderName?: string;
    isDefault?: boolean;
  }): Promise<{ success: boolean; message: string; paymentMethod: SavedPaymentMethod }> {
    return apiRequest('/api/billing/payment-methods', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async refreshPaymentToken(id: string): Promise<{
    success: boolean;
    paymentMethod: SavedPaymentMethod;
    refreshedAt: string;
    tokenExpiresAt: string;
    message: string;
  }> {
    return apiRequest(`/api/billing/payment-methods/${id}/refresh`, {
      method: 'POST'
    });
  },

  async setDefaultPaymentMethod(id: string): Promise<{
    success: boolean;
    message: string;
    paymentMethod: SavedPaymentMethod;
  }> {
    return apiRequest(`/api/billing/payment-methods/${id}/set-default`, {
      method: 'POST'
    });
  },

  async deletePaymentMethod(id: string): Promise<{ success: boolean; message: string }> {
    return apiRequest(`/api/billing/payment-methods/${id}`, {
      method: 'DELETE'
    });
  },

  async bulkRefundInvoices(invoiceIds: string[], reason?: string): Promise<{
    success: boolean;
    message: string;
    refundedCount: number;
    refundedInvoices: string[];
    failedInvoices: string[];
    totalRefundAmount: number;
  }> {
    return apiRequest('/api/billing/invoices/bulk-refund', {
      method: 'POST',
      body: JSON.stringify({ invoiceIds, reason })
    });
  },

  // Submit manual bKash TrxID with instant activation
  async submitBkashTrxId(params: {
    trxId: string;
    planId?: 'pro' | 'starter' | 'japan_ready';
    billingInterval?: 'monthly' | 'yearly';
    studentName?: string;
    studentPhone?: string;
    userId?: string;
  }): Promise<{
    success: boolean;
    message: string;
    paymentId?: string;
    subscription?: any;
    invoice?: Invoice;
    trxId?: string;
    submission?: any;
  }> {
    return apiRequest('/api/billing/bkash/submit-manual-trxid', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  // Founder: Get pending manual bKash TrxID submissions
  async getPendingTrxSubmissions(): Promise<{
    success: boolean;
    submissions: Array<{
      id: string;
      userId?: string;
      studentName: string;
      studentEmail: string;
      studentPhone: string;
      trxId: string;
      planId: string;
      planName: string;
      billingInterval: string;
      amount: number;
      submittedAt: string;
      status: 'pending' | 'approved';
      approvedAt?: string;
      approvedBy?: string;
    }>;
  }> {
    return apiRequest('/api/billing/pending-trxids');
  },

  // Founder: 1-Click Approve TrxID and activate student Pro
  async approveTrxId(params: {
    trxId?: string;
    submissionId?: string;
    userId?: string;
    planId?: string;
    billingInterval?: string;
  }): Promise<{
    success: boolean;
    message: string;
    submission?: any;
    subscription?: any;
  }> {
    return apiRequest('/api/billing/approve-trxid', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  // Real bKash Tokenized Checkout Create
  async createBkashPayment(params: {
    tier: 'n5_pro' | 'n5_lifetime';
    couponCode?: string;
  }): Promise<{
    success: boolean;
    paymentID?: string;
    bkashURL?: string;
    amount?: number;
    currency?: string;
    invoiceNumber?: string;
    error?: string;
  }> {
    return apiRequest('/api/payment/create', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  // Real bKash Payment Me / Entitlements
  async getPaymentSubscription(): Promise<{
    success: boolean;
    subscription: any;
  }> {
    return apiRequest('/api/payment/me');
  },

  // Manual bKash / Nagad Send Money Payment Instructions
  async getManualPaymentInstructions(): Promise<{
    success: boolean;
    accountInfo: {
      bkashNumber: string;
      bkashNumberDisplay: string;
      bkashAccountType: string;
      nagadNumber: string;
      nagadNumberDisplay: string;
      nagadAccountType: string;
      helplinePhone: string;
      whatsappUrl: string;
    };
    plans: Array<{
      id: 'n5_pro' | 'n5_lifetime';
      nameBn: string;
      amountBdt: number;
      interval: string;
    }>;
    stepsBn: string[];
  }> {
    return apiRequest('/api/payment/manual/instructions');
  },

  // Student: Submit Manual Payment TrxID
  async submitManualPayment(params: {
    senderPhone: string;
    trxID: string;
    selectedPlan: 'n5_pro' | 'n5_lifetime';
    paymentMethod?: 'bkash' | 'nagad' | string;
    studentName?: string;
    note?: string;
  }): Promise<{
    success: boolean;
    duplicate?: boolean;
    error?: string;
    status?: string;
    transaction?: {
      id: string;
      trxID: string;
      senderPhone: string;
      amount: number;
      selectedPlan: 'n5_pro' | 'n5_lifetime';
      planName: string;
      paymentMethod: string;
      submittedAt: string;
      helplinePhone: string;
    };
  }> {
    return apiRequest('/api/payment/manual/submit', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Admin / Founder: 1-Click Verify Manual Payment
  async verifyAdminPayment(params: {
    transactionId?: string;
    trxID?: string;
    submissionId?: string;
    action: 'approve' | 'reject';
    reason?: string;
    planId?: string;
  }): Promise<{
    success: boolean;
    message: string;
    activation?: any;
    submission?: any;
    error?: string;
  }> {
    return apiRequest('/api/admin/payments/verify', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Admin / Founder: Get Pending Manual Payments
  async getAdminPendingPayments(): Promise<{
    success: boolean;
    submissions: Array<{
      id: string;
      userId: string;
      studentName: string;
      studentEmail: string;
      studentPhone: string;
      trxId: string;
      planId: string;
      planName: string;
      amount: number;
      submittedAt: string;
      status: 'pending' | 'approved' | 'rejected';
      paymentMethod: string;
      note?: string;
    }>;
  }> {
    return apiRequest('/api/admin/payments/pending');
  },

  // SSLCommerz Session Init (Cards, Internet Banking, MFS)
  async createSslCommerzPayment(params: {
    tier?: string;
    planId?: string;
    amount?: number;
    currency?: string;
    name?: string;
    phone?: string;
  }): Promise<{
    success: boolean;
    tranId: string;
    sessionkey: string;
    gatewayUrl: string;
    isSandbox: boolean;
    error?: string;
  }> {
    return apiRequest('/api/payment/sslcommerz/init', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Stripe International Checkout Session
  async createStripeCheckoutSession(params: {
    tier?: string;
    planId?: string;
    amount?: number;
    currency?: string;
    successUrl?: string;
    cancelUrl?: string;
  }): Promise<{
    success: boolean;
    sessionId: string;
    url: string;
    isMock: boolean;
    error?: string;
  }> {
    return apiRequest('/api/payment/stripe/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
};

