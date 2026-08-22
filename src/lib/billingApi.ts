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
  }
};
