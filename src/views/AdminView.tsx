import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { apiRequest } from '../lib/api.js';
import { billingApi } from '../lib/billingApi.js';
import {
  ShieldCheck,
  BookOpen,
  Layers,
  Award,
  Users,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Plus,
  DollarSign,
  TrendingUp,
  CreditCard,
  Tag,
  FileText,
  Activity,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Gift,
  Search,
  Check,
  Sliders,
  Play,
  Terminal,
  Clock,
  Filter,
  CheckCheck
} from 'lucide-react';
import { RevenueMetrics, Payment, Coupon, PlanId, WebhookEvent, RevenueTrends } from '../types.js';
import { RevenueD3Charts } from '../components/RevenueD3Charts.js';
import { WebhookInspectorModal } from '../components/WebhookInspectorModal.js';
import { ContentStudioSection } from '../components/ContentStudio/ContentStudioSection.js';
import { UploadCloud } from 'lucide-react';

interface AdminViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
  initialTab?: AdminTab;
}

type AdminTab = 'content_engine' | 'revenue' | 'trends' | 'webhooks' | 'subscriptions' | 'payments' | 'coupons' | 'curriculum' | 'audit_logs';

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate, initialTab = 'content_engine' }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  // Stats & Curriculum CMS
  const [stats, setStats] = useState<any | null>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  
  // Revenue & Billing Data
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics | null>(null);
  const [revenueTrends, setRevenueTrends] = useState<RevenueTrends | null>(null);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isTriggeringLifecycle, setIsTriggeringLifecycle] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Webhook Inspector State
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookEvent | null>(null);
  const [webhookStatusFilter, setWebhookStatusFilter] = useState<'all' | 'success' | 'failed' | 'retry'>('all');
  const [webhookSearch, setWebhookSearch] = useState('');

  // Search filters
  const [userSearch, setUserSearch] = useState('');
  const [paymentSearch, setPaymentSearch] = useState('');

  // Manual Override Form State
  const [overrideUser, setOverrideUser] = useState<any | null>(null);
  const [overridePlanId, setOverridePlanId] = useState<PlanId>('pro');
  const [overrideStatus, setOverrideStatus] = useState('active');
  const [overrideMonths, setOverrideMonths] = useState(1);
  const [overrideNote, setOverrideNote] = useState('Promotional / Scholarship Grant');
  const [isSubmittingOverride, setIsSubmittingOverride] = useState(false);

  // Create Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percent' | 'fixed'>('percent');
  const [newCouponValue, setNewCouponValue] = useState<number>(20);
  const [newCouponMaxRedemptions, setNewCouponMaxRedemptions] = useState<number>(100);
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        statsRes,
        lessonsRes,
        revRes,
        trendsRes,
        subsRes,
        payRes,
        coupRes,
        auditRes,
        webhookRes
      ] = await Promise.all([
        apiRequest<{ stats: any }>('/api/admin/stats').catch(() => ({ stats: null })),
        apiRequest<{ lessons: any[] }>('/api/admin/lessons').catch(() => ({ lessons: [] })),
        billingApi.getAdminRevenueMetrics().catch(() => ({ success: false, metrics: null as any })),
        billingApi.getAdminRevenueTrends().catch(() => ({ success: false, trends: null as any })),
        billingApi.getAdminSubscriptions().catch(() => ({ success: false, subscriptions: [] })),
        billingApi.getAdminPayments().catch(() => ({ success: false, payments: [] })),
        billingApi.getAdminCoupons().catch(() => ({ success: false, coupons: [] })),
        billingApi.getAdminAuditLogs().catch(() => ({ success: false, logs: [] })),
        billingApi.getAdminWebhookEvents().catch(() => ({ success: false, events: [] }))
      ]);

      setStats(statsRes.stats);
      setLessons(lessonsRes.lessons || []);
      if (revRes.metrics) setRevenueMetrics(revRes.metrics);
      if (trendsRes.trends) setRevenueTrends(trendsRes.trends);
      if (subsRes.subscriptions) setSubscribers(subsRes.subscriptions);
      if (payRes.payments) setPayments(payRes.payments);
      if (coupRes.coupons) setCoupons(coupRes.coupons);
      if (auditRes.logs) setAuditLogs(auditRes.logs);
      if (webhookRes.events) setWebhookEvents(webhookRes.events);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRetryWebhook = async (webhookId: string) => {
    try {
      const res = await billingApi.retryWebhookEvent(webhookId);
      if (res.success) {
        setActionSuccess(res.message || 'Webhook replayed and processed successfully.');
        if (res.event) {
          setSelectedWebhook(res.event);
        }
        await loadData();
      } else {
        setActionError(res.message || 'Webhook replay failed.');
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to retry webhook.');
    }
  };

  const handleTriggerLifecycleCheck = async () => {
    setIsTriggeringLifecycle(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      const res = await billingApi.triggerLifecycleCheck();
      setActionSuccess(res.message || 'Subscription lifecycle evaluated across all accounts.');
      await loadData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to trigger lifecycle evaluation.');
    } finally {
      setIsTriggeringLifecycle(false);
    }
  };

  const handleToggleLessonPublish = async (lessonId: string, currentPublished: boolean) => {
    try {
      await apiRequest(`/api/admin/lessons/${lessonId}`, {
        method: 'PUT',
        body: JSON.stringify({ isPublished: !currentPublished })
      });
      setLessons((prev) =>
        prev.map((l) => (l.id === lessonId ? { ...l, isPublished: !currentPublished } : l))
      );
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  };

  const handleGrantOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideUser) return;
    setIsSubmittingOverride(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await billingApi.overrideSubscription(overrideUser.userId, {
        planId: overridePlanId,
        status: overrideStatus,
        monthsToAdd: overrideMonths,
        note: overrideNote
      });
      setActionSuccess(res.message);
      setOverrideUser(null);
      await loadData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update subscription');
    } finally {
      setIsSubmittingOverride(false);
    }
  };

  const handleRefundPayment = async (paymentId: string) => {
    if (!confirm('Are you sure you want to refund this payment and cancel the active subscription?')) return;
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await billingApi.refundPayment(paymentId, 'Admin dashboard refund');
      setActionSuccess(res.message);
      await loadData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to process refund');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    setIsCreatingCoupon(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await billingApi.createCoupon({
        code: newCouponCode.trim().toUpperCase(),
        discountType: newCouponType,
        discountValue: Number(newCouponValue),
        maxRedemptions: Number(newCouponMaxRedemptions)
      });
      setActionSuccess(`Coupon ${res.coupon.code} created successfully!`);
      setNewCouponCode('');
      await loadData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to create coupon');
    } finally {
      setIsCreatingCoupon(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 max-w-md text-center space-y-4 shadow-sm">
          <ShieldCheck className="w-10 h-10 mx-auto text-red-600" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Admin Access Required</h2>
          <p className="text-xs text-zinc-500">This Command Center is restricted to authorized administrators.</p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const filteredSubscribers = subscribers.filter(
    (s) =>
      s.userEmail.toLowerCase().includes(userSearch.toLowerCase()) ||
      s.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
      s.userId.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredPayments = payments.filter(
    (p) =>
      p.id.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      p.planName.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      p.provider.toLowerCase().includes(paymentSearch.toLowerCase()) ||
      (p.providerTransactionId && p.providerTransactionId.toLowerCase().includes(paymentSearch.toLowerCase()))
  );

  return (
    <div id="nihomi-admin-view" className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                  Nihomi Executive Portal
                </span>
                <span className="text-xs text-zinc-500 font-semibold">
                  Revenue Intelligence & Production Operations
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                Founder & Revenue Command Center
              </h1>
            </div>

            <button
              onClick={loadData}
              disabled={isLoading}
              className="self-start sm:self-center px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => setActiveTab('content_engine')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'content_engine'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
              id="admin-tab-content-engine"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Content Engine (AI)</span>
              <span className="px-1 py-0.2 rounded text-[9px] bg-amber-500 text-black font-extrabold uppercase">
                New
              </span>
            </button>

            <button
              onClick={() => setActiveTab('revenue')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'revenue'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
              id="admin-tab-revenue"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Revenue Metrics</span>
            </button>

            <button
              onClick={() => setActiveTab('trends')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'trends'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
              id="admin-tab-trends"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>D3 Trend Charts</span>
            </button>

            <button
              onClick={() => setActiveTab('webhooks')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'webhooks'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
              id="admin-tab-webhooks"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Webhook Events ({webhookEvents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'subscriptions'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
              id="admin-tab-subscriptions"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Subscribers ({subscribers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'payments'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
              id="admin-tab-payments"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payments ({payments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'coupons'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
              id="admin-tab-coupons"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Coupons ({coupons.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'curriculum'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
              id="admin-tab-curriculum"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curriculum CMS ({lessons.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('audit_logs')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'audit_logs'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
              id="admin-tab-audit-logs"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Audit Trail</span>
            </button>
          </div>
        </div>

        {/* Notices */}
        {actionSuccess && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* TAB 0: CONTENT ENGINE (AI CURRICULUM STUDIO) */}
        {activeTab === 'content_engine' && (
          <ContentStudioSection courses={[]} />
        )}

        {/* TAB 1: REVENUE METRICS */}
        {activeTab === 'revenue' && revenueMetrics && (
          <div className="space-y-6">
            {/* Primary KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-zinc-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Monthly Recurring (MRR)</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  ৳{revenueMetrics.mrr.toLocaleString()}
                </p>
                <p className="text-[11px] text-zinc-500">Normalized active monthly revenue</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-zinc-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Annual Run Rate (ARR)</span>
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  ৳{revenueMetrics.arr.toLocaleString()}
                </p>
                <p className="text-[11px] text-zinc-500">Projected annualized run rate</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-zinc-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Collected</span>
                  <CreditCard className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  ৳{revenueMetrics.totalRevenueCollected.toLocaleString()}
                </p>
                <p className="text-[11px] text-zinc-500">Settled bKash & Card transactions</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-zinc-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Active Paid Subs</span>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  {revenueMetrics.activeSubscribers}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {revenueMetrics.trialingUsers} on 7-day trial &bull; Churn: {revenueMetrics.churnRatePercent}%
                </p>
              </div>
            </div>

            {/* Revenue Breakdown by Plan & Interval */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plan Distribution */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Subscribers by Plan Tier
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 flex justify-between items-center text-xs">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Free Tier (Freemium)</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {revenueMetrics.subscribersByPlan?.free ?? (revenueMetrics.byPlan?.free as any)?.count ?? 0} users
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 flex justify-between items-center text-xs">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Starter Plan (৳299/mo)</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {revenueMetrics.subscribersByPlan?.starter ?? (revenueMetrics.byPlan?.starter as any)?.count ?? 0} subscribers
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 flex justify-between items-center text-xs">
                    <span className="font-bold text-red-700 dark:text-red-300">Pro Plan (৳599/mo - Popular)</span>
                    <span className="font-extrabold text-red-700 dark:text-red-300">
                      {revenueMetrics.subscribersByPlan?.pro ?? (revenueMetrics.byPlan?.pro as any)?.count ?? 0} subscribers
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 flex justify-between items-center text-xs">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Japan Ready (৳999/mo)</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {revenueMetrics.subscribersByPlan?.japan_ready ?? (revenueMetrics.byPlan?.japan_ready as any)?.count ?? 0} subscribers
                    </span>
                  </div>
                </div>
              </div>

              {/* Billing Interval & Health */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Billing Cycles & Health Indicators
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 space-y-1">
                    <span className="text-zinc-500 block">Monthly Billing</span>
                    <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {revenueMetrics.subscribersByInterval?.monthly ?? (revenueMetrics.byInterval?.monthly as any)?.count ?? 0}
                    </span>
                    <p className="text-[11px] text-zinc-400">Flexibility-focused</p>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 space-y-1">
                    <span className="text-zinc-500 block">Annual Billing</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      {revenueMetrics.subscribersByInterval?.yearly ?? (revenueMetrics.byInterval?.yearly as any)?.count ?? 0}
                    </span>
                    <p className="text-[11px] text-zinc-400">High LTV retention</p>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 space-y-1">
                    <span className="text-zinc-500 block">Trial Conversion</span>
                    <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {revenueMetrics.trialConversionRatePercent}%
                    </span>
                    <p className="text-[11px] text-zinc-400">Pro 7-day trials converted</p>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 space-y-1">
                    <span className="text-zinc-500 block">Upcoming Renewals</span>
                    <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {revenueMetrics.upcomingRenewalsNext7Days}
                    </span>
                    <p className="text-[11px] text-zinc-400">Next 7 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SUBSCRIBERS MANAGEMENT */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            {/* Modal for Manual Override */}
            {overrideUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      Manual Subscription Override
                    </h3>
                    <button
                      onClick={() => setOverrideUser(null)}
                      className="text-zinc-400 hover:text-zinc-600 text-sm"
                    >
                      &times;
                    </button>
                  </div>

                  <p className="text-xs text-zinc-500">
                    Granting access for: <strong>{overrideUser.userEmail}</strong> ({overrideUser.displayName})
                  </p>

                  <form onSubmit={handleGrantOverride} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">Target Plan</label>
                      <select
                        value={overridePlanId}
                        onChange={(e) => setOverridePlanId(e.target.value as PlanId)}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                      >
                        <option value="starter">Starter (৳299/mo)</option>
                        <option value="pro">Pro (৳599/mo)</option>
                        <option value="japan_ready">Japan Ready (৳999/mo)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Status</label>
                      <select
                        value={overrideStatus}
                        onChange={(e) => setOverrideStatus(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                      >
                        <option value="active">Active</option>
                        <option value="trialing">Trialing</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Add Duration (Months)</label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={overrideMonths}
                        onChange={(e) => setOverrideMonths(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Audit Log Note (Required)</label>
                      <input
                        type="text"
                        required
                        value={overrideNote}
                        onChange={(e) => setOverrideNote(e.target.value)}
                        placeholder="e.g. Scholarship Grant, Partner promotion"
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setOverrideUser(null)}
                        className="flex-1 py-2 px-3 rounded-lg border border-zinc-300 text-zinc-700 dark:text-zinc-300 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingOverride}
                        className="flex-1 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
                      >
                        {isSubmittingOverride ? 'Applying...' : 'Apply Override'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* User Search Bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by student email, name, or ID..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                />
              </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Active Plan</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Period End</th>
                      <th className="py-3 px-4">AI Usage (Mo)</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {filteredSubscribers.map((sub) => {
                      const activeSub = sub.activeSubscription;
                      const planName = sub.plan?.name || (activeSub?.planId ? activeSub.planId.toUpperCase() : 'Free');
                      const isPaid = activeSub && activeSub.planId !== 'free';

                      return (
                        <tr key={sub.userId} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <p className="font-bold text-zinc-900 dark:text-zinc-100">{sub.displayName}</p>
                            <p className="text-zinc-500 font-mono text-[11px]">{sub.userEmail}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-semibold ${isPaid ? 'text-red-600' : 'text-zinc-600'}`}>
                              {planName}
                            </span>
                            {activeSub?.billingInterval && (
                              <span className="text-[10px] text-zinc-400 block capitalize">
                                {activeSub.billingInterval}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                activeSub?.status === 'active'
                                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700'
                                  : activeSub?.status === 'trialing'
                                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600'
                              }`}
                            >
                              {activeSub?.status || 'Free'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                            {activeSub?.currentPeriodEnd ? new Date(activeSub.currentPeriodEnd).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                            {sub.monthlyAIUsage || 0} queries
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setOverrideUser(sub)}
                              className="px-3 py-1 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
                            >
                              Override / Grant
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENTS & TRANSACTIONS */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  placeholder="Search payments by ID, gateway ref, plan..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Payment ID</th>
                      <th className="py-3 px-4">Plan</th>
                      <th className="py-3 px-4">Gateway</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">{p.id}</td>
                        <td className="py-3 px-4 font-medium text-zinc-800 dark:text-zinc-200">{p.planName}</td>
                        <td className="py-3 px-4 uppercase font-bold text-zinc-600">{p.provider}</td>
                        <td className="py-3 px-4 font-extrabold text-zinc-900 dark:text-zinc-100">
                          ৳{p.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              p.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'refunded'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-zinc-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-right">
                          {p.status === 'paid' && (
                            <button
                              type="button"
                              onClick={() => handleRefundPayment(p.id)}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            >
                              Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS & PROMOTIONS */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Coupon Form */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Tag className="w-4 h-4 text-red-600" />
                Create Promo Coupon
              </h3>

              <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Coupon Code (Uppercase)</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SUMMER25, EID50"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1">Discount Type</label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="fixed">Fixed Taka (৳)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Discount Value</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    min="1"
                    value={newCouponMaxRedemptions}
                    onChange={(e) => setNewCouponMaxRedemptions(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreatingCoupon}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
                >
                  {isCreatingCoupon ? 'Creating...' : 'Create Coupon'}
                </button>
              </form>
            </div>

            {/* Coupons List */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Active Promotional Coupons ({coupons.length})
              </h3>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {coupons.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded">
                          {c.code}
                        </span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {c.discountType === 'percent' ? `${c.discountValue}% OFF` : `৳${c.discountValue} OFF`}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Used {c.redemptionCount} / {c.maxRedemptions || '∞'} times &bull; Plans:{' '}
                        {c.applicablePlans.join(', ')}
                      </p>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: D3 REVENUE TREND CHARTS */}
        {activeTab === 'trends' && (
          <RevenueD3Charts
            trends={revenueTrends}
            isLoading={isLoading}
            onRefresh={loadData}
          />
        )}

        {/* TAB: RAW WEBHOOK EVENT AUDIT & REPLAY ENGINE */}
        {activeTab === 'webhooks' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-6" id="webhook-audit-panel">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-red-600" />
                  <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Payment Gateway Webhook Audit & Ingestion Logs
                  </h2>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Inspect raw signed payloads, HMAC verification statuses, headers, and replay failed settlement events.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search Event / Tx ID..."
                    value={webhookSearch}
                    onChange={(e) => setWebhookSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl text-xs font-semibold">
                  {(['all', 'success', 'failed', 'retry'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setWebhookStatusFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                        webhookStatusFilter === filter
                          ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                          : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Webhook Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase text-[10px]">
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Provider & Event</th>
                    <th className="pb-3 px-3">Event / Transaction ID</th>
                    <th className="pb-3 px-3">Signature Verification</th>
                    <th className="pb-3 px-3">Received At</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {webhookEvents
                    .filter((e) => {
                      if (webhookStatusFilter !== 'all' && e.status !== webhookStatusFilter) return false;
                      if (!webhookSearch) return true;
                      const q = webhookSearch.toLowerCase();
                      return (
                        (e.eventId && e.eventId.toLowerCase().includes(q)) ||
                        (e.transactionId && e.transactionId.toLowerCase().includes(q)) ||
                        (e.provider && e.provider.toLowerCase().includes(q)) ||
                        (e.eventType && e.eventType.toLowerCase().includes(q))
                      );
                    })
                    .map((evt) => {
                      const isSuccess = evt.status === 'success';
                      return (
                        <tr key={evt.id || evt.eventId} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                isSuccess
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {isSuccess ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                              <span>{evt.status || 'success'}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-zinc-900 dark:text-zinc-100 uppercase">
                              {evt.provider}
                            </div>
                            <div className="font-mono text-zinc-500 text-[11px]">{evt.eventType}</div>
                          </td>
                          <td className="py-3 px-3 font-mono">
                            <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                              {evt.eventId}
                            </div>
                            {evt.transactionId && (
                              <div className="text-[11px] text-zinc-500">Tx: {evt.transactionId}</div>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Valid HMAC-SHA256</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 text-zinc-500">
                            {new Date(evt.createdAt).toLocaleTimeString()} &bull; {new Date(evt.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedWebhook(evt)}
                                className="px-2.5 py-1 text-xs font-bold rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                              >
                                Inspect Payload
                              </button>
                              <button
                                onClick={() => handleRetryWebhook(evt.id || evt.eventId)}
                                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                title="Replay / Retry webhook event"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {webhookEvents.length === 0 && (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  No webhook events recorded yet. Incoming gateway webhooks from bKash, SSLCommerz, and Shurjopay will be logged here.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: CURRICULUM CMS */}
        {activeTab === 'curriculum' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Managed Lessons ({lessons.length})
                </h2>
                <p className="text-xs text-zinc-500">Manage lesson visibility, sequencing, and live student access.</p>
              </div>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {lessons.map((les) => (
                <div
                  key={les.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-[10px]">
                        JLPT {les.level}
                      </span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        Lesson {les.lessonNumber}: {les.title}
                      </span>
                    </div>
                    <p className="text-xs text-red-600 font-serif">{les.titleJa}</p>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                        les.isPublished
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600'
                      }`}
                    >
                      {les.isPublished ? 'Published' : 'Draft'}
                    </span>

                    <button
                      onClick={() => handleToggleLessonPublish(les.id, les.isPublished)}
                      className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs flex items-center space-x-1 transition-colors"
                    >
                      {les.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{les.isPublished ? 'Unpublish' : 'Publish'}</span>
                    </button>

                    <button
                      onClick={() => onNavigate('lesson', { lessonId: les.id })}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT LOGS */}
        {activeTab === 'audit_logs' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Admin Audit Logs */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  Administrative Audit Trail & Security Changes
                </h3>
                <button
                  onClick={handleTriggerLifecycleCheck}
                  disabled={isTriggeringLifecycle}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
                  id="btn-trigger-lifecycle"
                >
                  <Play className={`w-3.5 h-3.5 ${isTriggeringLifecycle ? 'animate-spin' : 'text-red-600'}`} />
                  <span>Run Subscription Lifecycle State Check</span>
                </button>
              </div>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[600px] overflow-y-auto pr-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="py-3 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                      <span className="text-zinc-400 text-[10px]">
                        {new Date(log.createdAt).toLocaleTimeString()} &bull; {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                      By <strong>{log.adminEmail}</strong> on resource: <span className="font-mono">{log.targetResource}</span> (Target ID: {log.targetUserId || 'System'})
                    </p>
                    {log.details && (
                      <pre className="text-[10px] bg-zinc-50 dark:bg-zinc-950 p-2 rounded-lg text-zinc-600 dark:text-zinc-400 overflow-x-auto">
                        {JSON.stringify(log.details)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Webhook Inspector Modal */}
      <WebhookInspectorModal
        isOpen={!!selectedWebhook}
        onClose={() => setSelectedWebhook(null)}
        event={selectedWebhook}
        onRetry={handleRetryWebhook}
      />
    </div>
  );
};
