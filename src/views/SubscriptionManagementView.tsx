import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Cell,
  Legend
} from 'recharts';
import {
  CreditCard,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
  FileText,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Loader2,
  Tag,
  Gift,
  Download,
  Mail,
  Search,
  Lock,
  X,
  TrendingUp,
  DollarSign,
  FileSpreadsheet,
  Printer,
  Archive,
  Check,
  QrCode,
  Bell,
  BellRing,
  Filter,
  Layers,
  CheckSquare,
  Square,
  History,
  BookmarkPlus,
  BarChart3,
  SlidersHorizontal,
  TrendingDown,
  ChevronDown,
  Zap,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { billingApi } from '../lib/billingApi';
import { Invoice, UserSubscriptionDetails, PlanId, SavedPaymentMethod } from '../types';
import { InvoiceModal } from '../components/InvoiceModal';
import { NbrTaxModal } from '../components/NbrTaxModal';
import { CheckoutModal } from '../components/CheckoutModal';
import { SavedPaymentMethods } from '../components/SavedPaymentMethods';
import { BulkRefundModal } from '../components/BulkRefundModal';
import { CsvPreviewModal } from '../components/CsvPreviewModal';
import { MushakTaxLivePreview } from '../components/MushakTaxLivePreview';
import { EmbeddedInvoicePdfPreviewer, getInvoiceExpenseType } from '../components/EmbeddedInvoicePdfPreviewer';
import { downloadInvoicePDF, bulkDownloadInvoicesZip, downloadAnnualTaxSummaryPDF, downloadNbrTaxCertificatePDF, downloadFilteredInvoicesSinglePDF } from '../lib/pdfInvoice';

/**
 * Text Match Highlighter for invoice table results
 */
const HighlightMatch: React.FC<{ text: string | number | undefined | null; query: string; className?: string }> = ({
  text,
  query,
  className = ''
}) => {
  const str = text !== undefined && text !== null ? String(text) : '';
  if (!query || !query.trim() || !str) {
    return <span className={className}>{str}</span>;
  }
  const cleanQuery = query.trim();
  const escapedQuery = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  try {
    const parts = str.split(new RegExp(`(${escapedQuery})`, 'gi'));
    return (
      <span className={className}>
        {parts.map((part, i) =>
          part.toLowerCase() === cleanQuery.toLowerCase() ? (
            <mark
              key={i}
              className="bg-amber-200 dark:bg-amber-900/80 text-amber-950 dark:text-amber-100 font-bold px-0.5 rounded-xs"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  } catch (e) {
    return <span className={className}>{str}</span>;
  }
};

interface SubscriptionManagementViewProps {
  onNavigate?: (view: string) => void;
}

export const SubscriptionManagementView: React.FC<SubscriptionManagementViewProps> = ({ onNavigate }) => {
  const { user, profile, subscriptionDetails, refreshSubscription } = useAuth();
  const [details, setDetails] = useState<UserSubscriptionDetails | null>(subscriptionDetails as any);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedNbrInvoice, setSelectedNbrInvoice] = useState<Invoice | null>(null);
  const [isNbrModalOpen, setIsNbrModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<any>(null);

  // Cancellation modal/confirm
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Found another resource');
  const [isCancelling, setIsCancelling] = useState(false);
  const [isTogglingAutoRenew, setIsTogglingAutoRenew] = useState(false);

  // Push Notifications (3 days before due date)
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('nihomi_invoice_push_notifications');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [isTogglingPush, setIsTogglingPush] = useState(false);

  // Invoice filtering, Advanced Search chips, Status dropdown, Bulk Download & Email delivery
  const [invoiceFilter, setInvoiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'failed'>('all');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>('all');
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState<string>('all');
  const [selectedMethodFilter, setSelectedMethodFilter] = useState<string>('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [emailNotification, setEmailNotification] = useState<string | null>(null);
  const [showTaxTooltip, setShowTaxTooltip] = useState(false);
  const [hoveredAmountInvoiceId, setHoveredAmountInvoiceId] = useState<string | null>(null);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  // Saved Payment Methods & Contextual Expiry / Failed Auto-debit Alerts
  const [savedMethods, setSavedMethods] = useState<SavedPaymentMethod[]>([]);
  const [paymentWarningDismissed, setPaymentWarningDismissed] = useState<boolean>(false);

  // Spending View Mode: 6 Months Bar Breakdown vs 12 Months (Past Year) Trend vs 15% VAT Tax Contributions
  const [spendingViewMode, setSpendingViewMode] = useState<'6months-bar' | '12months-trend' | 'tax-vat-bar'>('6months-bar');
  const [showSpendingInsights, setShowSpendingInsights] = useState(true);

  // Search History State (Local storage-based, saves last 5 unique queries)
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nihomi_invoice_search_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isSearchHistoryOpen, setIsSearchHistoryOpen] = useState(false);

  // Multi-select & Bulk Refund Management
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [isBulkRefundModalOpen, setIsBulkRefundModalOpen] = useState(false);
  const [batchConfirmAction, setBatchConfirmAction] = useState<'download' | 'print' | null>(null);

  // Live CSV Preview Dialog
  const [isCsvPreviewModalOpen, setIsCsvPreviewModalOpen] = useState(false);
  const [csvPreviewInvoices, setCsvPreviewInvoices] = useState<Invoice[]>([]);
  const [csvPreviewFileName, setCsvPreviewFileName] = useState<string>('nihomi_tax_invoices.csv');

  // Column Visibility Toggle for #table-billing-invoices
  const [visibleColumns, setVisibleColumns] = useState<{
    transactionId: boolean;
    billingAddress: boolean;
    gatewayResponse: boolean;
  }>({
    transactionId: false,
    billingAddress: false,
    gatewayResponse: false,
  });
  const [showColumnVisibilityMenu, setShowColumnVisibilityMenu] = useState(false);

  // Popovers & Help Tooltips & Amount Search Mode
  const [isQuizPerformanceOpen, setIsQuizPerformanceOpen] = useState(false);
  const [searchByAmountMode, setSearchByAmountMode] = useState(false);
  const [showShortcutsTooltip, setShowShortcutsTooltip] = useState(false);

  // Hydrate saved filters on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nihomi_saved_invoice_filters');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.invoiceFilter !== undefined) setInvoiceFilter(parsed.invoiceFilter);
        if (parsed.statusFilter !== undefined) setStatusFilter(parsed.statusFilter);
        if (parsed.selectedPlanFilter !== undefined) setSelectedPlanFilter(parsed.selectedPlanFilter);
        if (parsed.selectedPeriodFilter !== undefined) setSelectedPeriodFilter(parsed.selectedPeriodFilter);
        if (parsed.selectedMethodFilter !== undefined) setSelectedMethodFilter(parsed.selectedMethodFilter);
        if (parsed.startDateFilter !== undefined) setStartDateFilter(parsed.startDateFilter);
        if (parsed.endDateFilter !== undefined) setEndDateFilter(parsed.endDateFilter);
      }
    } catch (err) {
      console.error('Failed to load saved invoice filters:', err);
    }
  }, []);

  const saveSearchQuery = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const next = [trimmed, ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem('nihomi_invoice_search_history', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const handleClearSearchHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('nihomi_invoice_search_history');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveFilters = () => {
    try {
      const filtersToSave = {
        invoiceFilter,
        statusFilter,
        selectedPlanFilter,
        selectedPeriodFilter,
        selectedMethodFilter,
        startDateFilter,
        endDateFilter
      };
      localStorage.setItem('nihomi_saved_invoice_filters', JSON.stringify(filtersToSave));
      setActionMessage('✓ Your current invoice search and filter preferences have been saved (Ctrl+S).');
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Keyboard shortcut listener (Ctrl+S / Cmd+S triggers Save Current Filters)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveFilters();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [invoiceFilter, statusFilter, selectedPlanFilter, selectedPeriodFilter, selectedMethodFilter, startDateFilter, endDateFilter]);

  const fetchDetails = async () => {
    setIsLoading(true);
    try {
      const data = await billingApi.getSubscriptionDetails();
      setDetails(data);
      try {
        const methodsRes = await billingApi.getPaymentMethods();
        setSavedMethods(methodsRes.paymentMethods || []);
      } catch (e) {
        console.error('Failed to load payment methods:', e);
      }
    } catch (err: any) {
      console.error('Error loading subscription details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    setActionError(null);
    setActionMessage(null);
    try {
      const res = await billingApi.cancelSubscription(cancelReason, false);
      setActionMessage(res.message);
      setShowCancelModal(false);
      await refreshSubscription();
      await fetchDetails();
    } catch (err: any) {
      setActionError(err.message || 'Failed to cancel subscription.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReactivate = async () => {
    setIsLoading(true);
    setActionError(null);
    setActionMessage(null);
    try {
      const res = await billingApi.reactivateSubscription();
      setActionMessage(res.message);
      await refreshSubscription();
      await fetchDetails();
    } catch (err: any) {
      setActionError(err.message || 'Failed to reactivate subscription.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenUpgrade = async () => {
    try {
      const res = await billingApi.getPlans();
      const nextPlan = res.plans.find((p) => p.id === (details?.plan.id === 'starter' ? 'pro' : 'japan_ready')) || res.plans.find((p) => p.id === 'pro');
      if (nextPlan) {
        setSelectedUpgradePlan(nextPlan);
        setIsUpgradeModalOpen(true);
      } else if (onNavigate) {
        onNavigate('pricing');
      }
    } catch (err) {
      if (onNavigate) onNavigate('pricing');
    }
  };

  const sub = details?.subscription;
  const plan = details?.plan;
  const usage = details?.usage;
  const invoices = details?.invoices || [];

  const isFree = !sub || sub.planId === 'free';
  const isPastDue = sub?.status === 'past_due';
  const isExpired = sub?.status === 'expired';
  const isCancelled = sub?.status === 'cancelled' || sub?.cancelAtPeriodEnd;
  const isTrialing = sub?.status === 'trialing';
  const autoRenewEnabled = !sub?.cancelAtPeriodEnd && sub?.status !== 'cancelled' && sub?.status !== 'expired';

  const currentPlanId = plan?.id || 'free';
  const isJapanReady = currentPlanId === 'japan_ready';

  const handleToggleAutoRenew = async () => {
    if (!sub || isFree) return;
    setIsTogglingAutoRenew(true);
    setActionError(null);
    setActionMessage(null);
    try {
      const nextState = !autoRenewEnabled;
      const res = await billingApi.toggleAutoRenew(nextState);
      setActionMessage(res.message);
      await refreshSubscription();
      await fetchDetails();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update auto-renewal setting.');
    } finally {
      setIsTogglingAutoRenew(false);
    }
  };

  const handleTogglePushNotifications = () => {
    setIsTogglingPush(true);
    try {
      const nextState = !pushNotificationsEnabled;
      setPushNotificationsEnabled(nextState);
      localStorage.setItem('nihomi_invoice_push_notifications', JSON.stringify(nextState));
      setActionMessage(
        nextState
          ? 'Push & recurring email notifications enabled. You will be alerted 3 days before your invoice due date.'
          : 'Invoice push & email notifications disabled.'
      );
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTogglingPush(false);
    }
  };

  // Monthly spending trend for the past 6 months (chronological)
  const monthlySpendingTrend = useMemo(() => {
    const monthsMap: { [key: string]: { monthKey: string; monthLabel: string; shortMonth: string; amount: number; count: number } } = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      const shortMonth = d.toLocaleString('en-US', { month: 'short' });
      monthsMap[monthKey] = {
        monthKey,
        monthLabel,
        shortMonth,
        amount: 0,
        count: 0
      };
    }

    invoices.forEach((inv) => {
      const dateStr = inv.createdAt || inv.billingPeriod;
      const invDate = dateStr ? new Date(dateStr) : now;
      const key = !isNaN(invDate.getTime())
        ? `${invDate.getFullYear()}-${String(invDate.getMonth() + 1).padStart(2, '0')}`
        : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      if (monthsMap[key]) {
        monthsMap[key].amount += inv.amount || 0;
        monthsMap[key].count += 1;
      }
    });

    return Object.values(monthsMap);
  }, [invoices]);

  // Monthly spending trend for the past 12 months (Past Year)
  const monthlySpendingTrend12 = useMemo(() => {
    const monthsMap: { [key: string]: { monthKey: string; monthLabel: string; shortMonth: string; amount: number; count: number } } = {};
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      const shortMonth = d.toLocaleString('en-US', { month: 'short' });
      monthsMap[monthKey] = {
        monthKey,
        monthLabel,
        shortMonth,
        amount: 0,
        count: 0
      };
    }

    invoices.forEach((inv) => {
      const dateStr = inv.createdAt || inv.billingPeriod;
      const invDate = dateStr ? new Date(dateStr) : now;
      const key = !isNaN(invDate.getTime())
        ? `${invDate.getFullYear()}-${String(invDate.getMonth() + 1).padStart(2, '0')}`
        : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      if (monthsMap[key]) {
        monthsMap[key].amount += inv.amount || 0;
        monthsMap[key].count += 1;
      }
    });

    return Object.values(monthsMap);
  }, [invoices]);

  // Renewal & 3-Day Notification Date Calculations
  const renewalDate = useMemo(() => {
    if (sub?.currentPeriodEnd) {
      const d = new Date(sub.currentPeriodEnd);
      if (!isNaN(d.getTime())) return d;
    }
    const next = new Date();
    next.setDate(next.getDate() + 24);
    return next;
  }, [sub]);

  const reminderDate = useMemo(() => {
    const r = new Date(renewalDate);
    r.setDate(r.getDate() - 3);
    return r;
  }, [renewalDate]);

  const daysUntilRenewal = useMemo(() => {
    const now = new Date();
    const diffTime = renewalDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, [renewalDate]);

  const handleSimulatePreRenewalAlert = () => {
    const recipient = user?.email || 'mdtanvirkabirbiplob@gmail.com';
    const planName = plan?.name || 'Pro AI Plan';
    const amount = (sub?.billingInterval === 'yearly' ? plan?.yearlyPrice : plan?.monthlyPrice) || 2990;
    setActionMessage(
      `🔔 [Push & Email Pre-Renewal Alert Triggered]: Alert scheduled 3 days before renewal (on ${reminderDate.toLocaleDateString()}). Dispatched test payload to ${recipient}: "Your ${planName} subscription will renew on ${renewalDate.toLocaleDateString()} for ৳${amount.toLocaleString()} BDT."`
    );
    setTimeout(() => setActionMessage(null), 9000);
  };

  // Lifetime summary statistics
  const totalLifetimePaid = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  }, [invoices]);

  const sixMonthTotal = useMemo(() => {
    return monthlySpendingTrend.reduce((sum, m) => sum + m.amount, 0);
  }, [monthlySpendingTrend]);

  const twelveMonthTotal = useMemo(() => {
    return monthlySpendingTrend12.reduce((sum, m) => sum + m.amount, 0);
  }, [monthlySpendingTrend12]);

  // Previous 6-Month Period (Months 7-12) vs Current 6-Month Period (Months 1-6)
  const previousSixMonthTotal = useMemo(() => {
    const prevMonths = monthlySpendingTrend12.slice(0, 6);
    return prevMonths.reduce((sum, m) => sum + m.amount, 0);
  }, [monthlySpendingTrend12]);

  const sixMonthPercentageChange = useMemo(() => {
    if (previousSixMonthTotal === 0) {
      return sixMonthTotal > 0 ? 100 : 0;
    }
    return Math.round(((sixMonthTotal - previousSixMonthTotal) / previousSixMonthTotal) * 100);
  }, [sixMonthTotal, previousSixMonthTotal]);

  // 15% VAT Breakdown Trend per month for the last 6 months
  const vatSpendingTrend = useMemo(() => {
    return monthlySpendingTrend.map((m) => {
      const gross = m.amount;
      const subtotal = Math.round(gross / 1.15);
      const vat = gross - subtotal;
      return {
        ...m,
        monthKey: m.monthKey || m.shortMonth,
        subtotal,
        vat,
        total: gross
      };
    });
  }, [monthlySpendingTrend]);

  const handleSelectMonthInvoices = (monthKey: string) => {
    const monthInvoices = invoices.filter((inv) => {
      const d = inv.createdAt ? new Date(inv.createdAt) : (inv.billingPeriod ? new Date(inv.billingPeriod) : new Date());
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return key === monthKey || inv.billingPeriod.includes(monthKey);
    });
    const ids = monthInvoices.map((inv) => inv.id);
    if (ids.length === 0) return;

    const allSelected = ids.every((id) => selectedInvoiceIds.includes(id));
    if (allSelected) {
      setSelectedInvoiceIds((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedInvoiceIds((prev) => Array.from(new Set([...prev, ...ids])));
    }
  };

  // Total 15% VAT Paid across last 6 months
  const sixMonthTotalVat = useMemo(() => {
    return vatSpendingTrend.reduce((sum, item) => sum + item.vat, 0);
  }, [vatSpendingTrend]);

  const activeMonthsSubscribed = useMemo(() => {
    if (!sub || isFree) {
      return invoices.length > 0 ? invoices.length : 0;
    }
    const start = new Date(sub.createdAt || sub.currentPeriodStart || Date.now());
    const now = new Date();
    const diffMonths = Math.max(1, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1);
    if (sub.billingInterval === 'yearly') {
      return Math.max(diffMonths, 12);
    }
    return Math.max(diffMonths, invoices.length || 1);
  }, [sub, isFree, invoices]);

  const averageInvoiceAmount = useMemo(() => {
    return invoices.length > 0 ? Math.round(totalLifetimePaid / invoices.length) : 0;
  }, [invoices, totalLifetimePaid]);

  // Computed unique billing months and quarters for dropdown filtering
  const uniqueInvoiceMonths = useMemo(() => {
    const map = new Map<string, { key: string; label: string; count: number; date: Date }>();
    invoices.forEach((inv) => {
      const rawDate = inv.createdAt || inv.issuedAt;
      const d = rawDate ? new Date(rawDate) : null;
      if (d && !isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        const existing = map.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(key, { key, label, count: 1, date: d });
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [invoices]);

  // Contextual check for expired payment methods or failed auto-debit attempts
  const expiredPaymentMethod = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    return savedMethods.find((m) => {
      if (m.tokenStatus === 'expired') return true;
      if (m.cardExpiry) {
        const parts = m.cardExpiry.split('/');
        if (parts.length === 2) {
          const expMonth = parseInt(parts[0], 10);
          let expYear = parseInt(parts[1], 10);
          if (expYear < 100) expYear += 2000;
          if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            return true;
          }
        }
      }
      return false;
    });
  }, [savedMethods]);

  const failedInvoice = useMemo(() => {
    return invoices.find((inv) => {
      const s = (inv.status || '').toLowerCase();
      return s === 'failed' || s === 'past_due' || s === 'unpaid';
    });
  }, [invoices]);

  const showPaymentWarningBanner = !paymentWarningDismissed && (isPastDue || !!expiredPaymentMethod || !!failedInvoice);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // Status filter
      if (statusFilter !== 'all') {
        const invStatus = (inv.status || 'paid').toLowerCase();
        if (invStatus !== statusFilter.toLowerCase()) {
          return false;
        }
      }

      // Plan chip filter
      if (selectedPlanFilter !== 'all') {
        const planName = (inv.planName || '').toLowerCase();
        if (selectedPlanFilter === 'free' && !planName.includes('free')) return false;
        if (selectedPlanFilter === 'starter' && !planName.includes('starter')) return false;
        if (selectedPlanFilter === 'pro' && !planName.includes('pro')) return false;
        if (selectedPlanFilter === 'japan_ready' && !planName.includes('japan') && !planName.includes('ready')) return false;
      }

      // Billing Period / Month / Quarter Filter
      if (selectedPeriodFilter !== 'all') {
        const rawDate = inv.createdAt || inv.issuedAt;
        const invDate = rawDate ? new Date(rawDate) : null;
        if (invDate && !isNaN(invDate.getTime())) {
          const year = invDate.getFullYear();
          const month = invDate.getMonth(); // 0 to 11
          if (selectedPeriodFilter.startsWith('Q1-')) {
            const targetYear = parseInt(selectedPeriodFilter.split('-')[1]);
            if (year !== targetYear || month < 0 || month > 2) return false;
          } else if (selectedPeriodFilter.startsWith('Q2-')) {
            const targetYear = parseInt(selectedPeriodFilter.split('-')[1]);
            if (year !== targetYear || month < 3 || month > 5) return false;
          } else if (selectedPeriodFilter.startsWith('Q3-')) {
            const targetYear = parseInt(selectedPeriodFilter.split('-')[1]);
            if (year !== targetYear || month < 6 || month > 8) return false;
          } else if (selectedPeriodFilter.startsWith('Q4-')) {
            const targetYear = parseInt(selectedPeriodFilter.split('-')[1]);
            if (year !== targetYear || month < 9 || month > 11) return false;
          } else {
            const invMonthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
            if (invMonthKey !== selectedPeriodFilter && !inv.billingPeriod?.toLowerCase().includes(selectedPeriodFilter.toLowerCase())) {
              return false;
            }
          }
        } else if (!inv.billingPeriod?.toLowerCase().includes(selectedPeriodFilter.toLowerCase())) {
          return false;
        }
      }

      // Payment method chip filter
      if (selectedMethodFilter !== 'all') {
        const method = (inv.paymentMethodName || '').toLowerCase();
        if (selectedMethodFilter === 'bkash' && !method.includes('bkash')) return false;
        if (selectedMethodFilter === 'nagad' && !method.includes('nagad')) return false;
        if (selectedMethodFilter === 'rocket' && !method.includes('rocket')) return false;
        if (selectedMethodFilter === 'card' && !method.includes('card') && !method.includes('ssl') && !method.includes('visa') && !method.includes('mastercard')) return false;
        if (selectedMethodFilter === 'apple_pay' && !method.includes('apple')) return false;
        if (selectedMethodFilter === 'google_pay' && !method.includes('google')) return false;
      }

      // Date range filter
      if (startDateFilter) {
        const invDate = new Date(inv.createdAt || inv.billingPeriod);
        const start = new Date(startDateFilter);
        if (!isNaN(invDate.getTime()) && !isNaN(start.getTime()) && invDate < start) {
          return false;
        }
      }
      if (endDateFilter) {
        const invDate = new Date(inv.createdAt || inv.billingPeriod);
        const end = new Date(endDateFilter);
        end.setHours(23, 59, 59, 999);
        if (!isNaN(invDate.getTime()) && !isNaN(end.getTime()) && invDate > end) {
          return false;
        }
      }

      if (!invoiceFilter.trim()) return true;
      const query = invoiceFilter.toLowerCase().trim();
      const amountVal = inv.amount || 0;

      // Check for price point / amount expression filters (e.g. "> 500 BDT", ">= 1499", "< 2000", "<= 3000", "= 1499", "500-2990")
      const cleanAmtQuery = query.replace(/bdt|tk|৳/gi, '').trim();
      const matchGte = cleanAmtQuery.match(/^>=\s*(\d+(?:\.\d+)?)/);
      const matchGt = cleanAmtQuery.match(/^>\s*(\d+(?:\.\d+)?)/);
      const matchLte = cleanAmtQuery.match(/^<=\s*(\d+(?:\.\d+)?)/);
      const matchLt = cleanAmtQuery.match(/^<\s*(\d+(?:\.\d+)?)/);
      const matchEq = cleanAmtQuery.match(/^={1,2}\s*(\d+(?:\.\d+)?)/);
      const matchRange = cleanAmtQuery.match(/^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);

      if (matchGte) return amountVal >= parseFloat(matchGte[1]);
      if (matchGt) return amountVal > parseFloat(matchGt[1]);
      if (matchLte) return amountVal <= parseFloat(matchLte[1]);
      if (matchLt) return amountVal < parseFloat(matchLt[1]);
      if (matchEq) return amountVal === parseFloat(matchEq[1]);
      if (matchRange) {
        const min = parseFloat(matchRange[1]);
        const max = parseFloat(matchRange[2]);
        return amountVal >= min && amountVal <= max;
      }

      // If in explicit Search by Amount mode and a raw number is typed
      if (searchByAmountMode && !isNaN(Number(cleanAmtQuery)) && cleanAmtQuery !== '') {
        return amountVal >= Number(cleanAmtQuery);
      }

      return (
        inv.id.toLowerCase().includes(query) ||
        inv.planName.toLowerCase().includes(query) ||
        inv.billingPeriod.toLowerCase().includes(query) ||
        inv.paymentMethodName.toLowerCase().includes(query) ||
        inv.amount.toString().includes(query) ||
        (inv.status && inv.status.toLowerCase().includes(query)) ||
        (inv.createdAt && new Date(inv.createdAt).toLocaleDateString().toLowerCase().includes(query))
      );
    });
  }, [invoices, statusFilter, selectedPlanFilter, selectedPeriodFilter, selectedMethodFilter, startDateFilter, endDateFilter, invoiceFilter, searchByAmountMode]);

  // Dynamic Total 15% VAT Paid calculation for currently filtered view
  const filteredTotalVat = useMemo(() => {
    return filteredInvoices.reduce((sum, inv) => {
      const vat = inv.tax || (inv.amount - Math.round(inv.amount / 1.15));
      return sum + vat;
    }, 0);
  }, [filteredInvoices]);

  // Current Month vs Previous Month Spend Comparison & MoM Growth Indicator
  const monthlyComparison = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const prevDate = new Date(currentYear, currentMonth - 1, 1);
    const prevYear = prevDate.getFullYear();
    const prevMonth = prevDate.getMonth();

    let currentMonthSpend = 0;
    let previousMonthSpend = 0;

    invoices.forEach((inv) => {
      const invStatus = (inv.status || 'paid').toLowerCase();
      if (invStatus === 'paid') {
        const d = inv.createdAt ? new Date(inv.createdAt) : (inv.billingPeriod ? new Date(inv.billingPeriod) : new Date());
        if (!isNaN(d.getTime())) {
          if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
            currentMonthSpend += (inv.amount || 0);
          } else if (d.getFullYear() === prevYear && d.getMonth() === prevMonth) {
            previousMonthSpend += (inv.amount || 0);
          }
        }
      }
    });

    let growthPercent = 0;
    if (previousMonthSpend === 0) {
      growthPercent = currentMonthSpend > 0 ? 100 : 0;
    } else {
      growthPercent = Math.round(((currentMonthSpend - previousMonthSpend) / previousMonthSpend) * 100);
    }

    const currentMonthName = now.toLocaleString('default', { month: 'short', year: 'numeric' });
    const prevMonthName = prevDate.toLocaleString('default', { month: 'short', year: 'numeric' });

    return {
      currentMonthSpend,
      previousMonthSpend,
      growthPercent,
      currentMonthName,
      prevMonthName
    };
  }, [invoices]);

  // Auto-persist active filters to localStorage on every change
  useEffect(() => {
    try {
      const filtersToSave = {
        invoiceFilter,
        statusFilter,
        selectedPlanFilter,
        selectedMethodFilter,
        startDateFilter,
        endDateFilter
      };
      localStorage.setItem('nihomi_saved_invoice_filters', JSON.stringify(filtersToSave));
    } catch (err) {
      console.error('Failed to auto-save invoice filters:', err);
    }
  }, [invoiceFilter, statusFilter, selectedPlanFilter, selectedMethodFilter, startDateFilter, endDateFilter]);

  // Direct CSV Downloader Utility
  const downloadInvoicesCSV = (invoicesList: Invoice[], filename: string) => {
    if (invoicesList.length === 0) {
      setActionMessage('No invoice records found to export.');
      setTimeout(() => setActionMessage(null), 3000);
      return;
    }

    const headers = [
      'Invoice Number',
      'Date',
      'Plan',
      'Billing Period',
      'Payment Method',
      'Subtotal (BDT)',
      '15% VAT (BDT)',
      'Total Amount (BDT)',
      'Status',
      'Transaction ID',
      'Customer Name',
      'Customer Email',
      'Billing Address',
      'Gateway Response'
    ];

    const rows = invoicesList.map((inv) => {
      const subtotal = inv.subtotal || Math.round(inv.amount / 1.15);
      const vat = inv.tax || (inv.amount - subtotal);
      const dateStr = inv.createdAt ? new Date(inv.createdAt).toISOString().split('T')[0] : (inv.billingPeriod || '');
      return [
        `"${inv.id}"`,
        `"${dateStr}"`,
        `"${(inv.planName || '').replace(/"/g, '""')}"`,
        `"${(inv.billingPeriod || '').replace(/"/g, '""')}"`,
        `"${(inv.paymentMethodName || '').replace(/"/g, '""')}"`,
        subtotal,
        vat,
        inv.amount,
        `"${(inv.status || 'paid').toUpperCase()}"`,
        `"${(inv.transactionId || 'TXN_' + inv.id).replace(/"/g, '""')}"`,
        `"${(inv.customerName || user?.name || 'Tanvir Kabir').replace(/"/g, '""')}"`,
        `"${(inv.customerEmail || user?.email || 'mdtanvirkabirbiplob@gmail.com').replace(/"/g, '""')}"`,
        `"${(inv.billingAddress || 'Gulshan-2, Dhaka, Bangladesh').replace(/"/g, '""')}"`,
        `"${(inv.gatewayResponse || '200 OK / SUCCESS').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionMessage(`✓ Exported ${invoicesList.length} invoice records to "${filename}".`);
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Export currently filtered invoices to downloadable CSV
  const handleExportFilteredCSV = () => {
    const targetList = filteredInvoices.length > 0 ? filteredInvoices : invoices;
    downloadInvoicesCSV(targetList, `nihomi_filtered_invoices_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Bulk Export Entire Billing History to CSV
  const handleBulkExportAllCSV = () => {
    downloadInvoicesCSV(invoices, `nihomi_all_billing_history_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Export invoices table data to CSV file with Live Preview Modal
  const handleExportCSV = () => {
    const targetList = selectedInvoiceIds.length > 0
      ? selectedInvoicesList
      : (filteredInvoices.length > 0 ? filteredInvoices : invoices);

    if (targetList.length === 0) {
      setActionMessage('No invoice records found to export.');
      setTimeout(() => setActionMessage(null), 3000);
      return;
    }

    setCsvPreviewInvoices(targetList);
    setCsvPreviewFileName(`nihomi_tax_invoices_${new Date().toISOString().split('T')[0]}.csv`);
    setIsCsvPreviewModalOpen(true);
  };

  const getMissingBenefits = (planId: PlanId | string) => {
    if (planId === 'free') {
      return [
        'Full JLPT N5, N4 & N3 Complete Grammar & Kanji Bank',
        '1,000 to Unlimited AI Sensei Coach Voice Queries (vs 10/mo)',
        'Full-Length JLPT Timed Mock Exams with Scoring Analytics',
        'Business Japanese & Keigo (敬語) Workplace Mastery',
        'Japan Living, Visa Guidance & Tokyo Interview Prep',
        'Verified Certificate of Japanese Language Completion'
      ];
    }
    if (planId === 'starter') {
      return [
        'Full JLPT N3 Advanced Modules & Specialized Reading Bank',
        '1,000 AI Sensei Monthly Quotas (10x your current 100/mo cap)',
        'Keigo (敬語) & Japanese Business Email Masterclass',
        'Interactive JLPT Mock Exam Simulations with AI Feedback',
        'Japan Workplace Etiquette & Native Mock Interviews'
      ];
    }
    if (planId === 'pro') {
      return [
        'Unlimited AI Sensei Coach Interactions (Zero monthly caps)',
        'Tokyo Workplace & Japanese Interview Simulation Lab',
        'Specialized Japan Job Placement & Visa Documentation Guides',
        'Official Verified Nihomi Japanese Academy Certificate'
      ];
    }
    return [];
  };

  const missingBenefits = getMissingBenefits(currentPlanId);

  const handleSendInvoiceEmail = async (inv: Invoice) => {
    setSendingEmailId(inv.id);
    setEmailNotification(null);
    setActionError(null);
    try {
      const recipient = user?.email || inv.customerEmail || 'mdtanvirkabirbiplob@gmail.com';
      const res = await billingApi.sendInvoiceEmail(inv.id, recipient);
      setEmailNotification(`Official Tax Invoice ${inv.id} has been delivered to ${res.sentTo || recipient}.`);
      setTimeout(() => setEmailNotification(null), 6000);
    } catch (err: any) {
      setActionError(err.message || 'Failed to dispatch invoice to email.');
      setTimeout(() => setActionError(null), 5000);
    } finally {
      setSendingEmailId(null);
    }
  };

  // Export single invoice to formatted CSV with Live Preview Modal
  const handleExportSingleInvoiceCSV = (inv: Invoice) => {
    setCsvPreviewInvoices([inv]);
    setCsvPreviewFileName(`nihomi_invoice_${inv.id}.csv`);
    setIsCsvPreviewModalOpen(true);
  };

  // Bulk Download all filtered invoices as ZIP of PDFs
  const handleBulkDownloadPDF = async () => {
    const targetList = selectedInvoiceIds.length > 0
      ? selectedInvoicesList
      : (filteredInvoices.length > 0 ? filteredInvoices : invoices);

    if (targetList.length === 0) {
      setActionMessage('No invoice records found to download.');
      setTimeout(() => setActionMessage(null), 3000);
      return;
    }

    setIsBulkDownloading(true);
    try {
      await bulkDownloadInvoicesZip(targetList);
      setActionMessage(`Successfully packaged and downloaded ${targetList.length} invoices in a ZIP archive.`);
      setTimeout(() => setActionMessage(null), 5000);
    } catch (err: any) {
      setActionError(err.message || 'Failed to generate bulk ZIP archive.');
      setTimeout(() => setActionError(null), 4000);
    } finally {
      setIsBulkDownloading(false);
    }
  };

  // Multi-select helpers
  const toggleSelectInvoice = (id: string) => {
    setSelectedInvoiceIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllInvoices = () => {
    if (selectedInvoiceIds.length === filteredInvoices.length && filteredInvoices.length > 0) {
      setSelectedInvoiceIds([]);
    } else {
      setSelectedInvoiceIds(filteredInvoices.map((inv) => inv.id));
    }
  };

  const selectedInvoicesList = useMemo(() => {
    return invoices.filter((inv) => selectedInvoiceIds.includes(inv.id));
  }, [invoices, selectedInvoiceIds]);

  const totalSelectedRefundAmount = useMemo(() => {
    return selectedInvoicesList.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  }, [selectedInvoicesList]);

  const isAllSelected = filteredInvoices.length > 0 && selectedInvoiceIds.length === filteredInvoices.length;
  const isSomeSelected = selectedInvoiceIds.length > 0 && !isAllSelected;

  const handleBulkRefundSuccess = async (result: {
    refundedCount: number;
    totalRefundAmount: number;
    message: string;
  }) => {
    setSelectedInvoiceIds([]);
    setActionMessage(result.message);
    setTimeout(() => setActionMessage(null), 6000);
    await fetchDetails();
  };

  // Print Table handler
  const handlePrintTable = () => {
    window.print();
  };

  const handleOpenCurrentPlanRenewal = async () => {
    try {
      const res = await billingApi.getPlans();
      const currentPlan = res.plans.find((p) => p.id === (sub?.planId || 'pro')) || res.plans.find((p) => p.id === 'pro');
      if (currentPlan) {
        setSelectedUpgradePlan(currentPlan);
        setIsUpgradeModalOpen(true);
      }
    } catch (err) {
      if (onNavigate) onNavigate('pricing');
    }
  };

  const usagePercent = usage ? Math.min(100, Math.round((usage.aiCoachInteractions / (usage.aiMonthlyLimit || 1)) * 100)) : 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-10 px-4 sm:px-6 lg:px-8" id="subscription-management-page">
      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        invoice={selectedInvoice}
      />

      {/* NBR Tax Verification Portal Modal */}
      <NbrTaxModal
        isOpen={isNbrModalOpen}
        onClose={() => setIsNbrModalOpen(false)}
        invoice={selectedNbrInvoice}
      />

      {/* Upgrade Checkout Modal */}
      {selectedUpgradePlan && (
        <CheckoutModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          selectedPlan={selectedUpgradePlan}
          initialInterval="yearly"
          onSuccess={() => {
            setIsUpgradeModalOpen(false);
            fetchDetails();
          }}
        />
      )}

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Cancel Subscription?</h3>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Your subscription will remain active until the end of your paid billing cycle (
              {sub ? new Date(sub.currentPeriodEnd).toLocaleDateString() : 'end of term'}). You won't be charged again.
            </p>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Please let us know why you're cancelling:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
              >
                <option value="Passed my JLPT exam">I passed my target JLPT exam!</option>
                <option value="Need a break from study">Taking a temporary study break</option>
                <option value="Financial reasons">Financial reasons</option>
                <option value="Found another resource">Using another platform</option>
                <option value="Other">Other feedback</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Keep My Plan
              </button>
              <button
                type="button"
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                {isCancelling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">My Subscription & Billing</h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Manage your plan, review invoices, check AI Sensei interaction quotas, and update payment settings.
            </p>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('pricing')}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
            id="btn-explore-all-plans"
          >
            <span>Explore All Plans</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Notices & Lifecycle Banners */}
        {isPastDue && (
          <div className="p-5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 rounded-2xl text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm" id="banner-grace-period">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-amber-900 dark:text-amber-100">
                  Payment Past Due — 5-Day Grace Period Active
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                  Your billing renewal date has passed. Your premium access remains active during the grace period until{' '}
                  <span className="font-semibold">{sub?.gracePeriodEnd ? new Date(sub.gracePeriodEnd).toLocaleDateString() : 'soon'}</span>.
                  Renew now to avoid service interruption.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleOpenCurrentPlanRenewal}
              className="shrink-0 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
              id="btn-grace-period-renew"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Renew Subscription</span>
            </button>
          </div>
        )}

        {isExpired && (
          <div className="p-5 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 rounded-2xl text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm" id="banner-subscription-expired">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-rose-900 dark:text-rose-100">
                  Subscription Expired — Premium Content Restricted
                </h4>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                  Your grace period has ended and premium JLPT modules/AI features are temporarily restricted. Your study progress, quizzes, and streak records are safely preserved!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleOpenCurrentPlanRenewal}
              className="shrink-0 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
              id="btn-expired-reactivate"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reactivate Plan</span>
            </button>
          </div>
        )}

        {actionMessage && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
        )}
        {actionError && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Top Summary Cards: Monthly Spend Comparison & Revenue Analytics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="section-billing-top-summary-cards">
          {/* Card 1: Monthly Spend & MoM Growth Indicator */}
          <div
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between"
            id="card-monthly-spend-comparison"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Monthly Spend & Growth
              </span>
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  monthlyComparison.growthPercent > 0
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : monthlyComparison.growthPercent < 0
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                }`}
                id="badge-monthly-growth-indicator"
              >
                {monthlyComparison.growthPercent > 0 ? (
                  <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                ) : monthlyComparison.growthPercent < 0 ? (
                  <TrendingDown className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                ) : null}
                <span>
                  {monthlyComparison.growthPercent > 0 ? `+${monthlyComparison.growthPercent}% MoM` : `${monthlyComparison.growthPercent}% MoM`}
                </span>
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 font-mono">
                ৳{monthlyComparison.currentMonthSpend.toLocaleString()}{' '}
                <span className="text-xs font-semibold text-zinc-500 font-sans">BDT</span>
              </div>
              <div className="text-[11px] text-zinc-500 flex items-center justify-between">
                <span>Current ({monthlyComparison.currentMonthName})</span>
                <span className="font-mono font-medium">Prev: ৳{monthlyComparison.previousMonthSpend.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Card 2: 12-Month Total & NBR VAT Settled */}
          <div
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between"
            id="card-lifetime-spend-vat"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                12-Month Spending
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                15% NBR Mushak
              </span>
            </div>
            <div className="mt-3 space-y-1">
              <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 font-mono">
                ৳{twelveMonthTotal.toLocaleString()}{' '}
                <span className="text-xs font-semibold text-zinc-500 font-sans">BDT</span>
              </div>
              <div className="text-[11px] text-zinc-500 flex items-center justify-between">
                <span>Cumulative Invoiced</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                  VAT: ৳{Math.round(twelveMonthTotal - (twelveMonthTotal / 1.15)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Active Subscription & Renewal Status */}
          <div
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between"
            id="card-quick-subscription-status"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Plan & Renewal
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  autoRenewEnabled
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {autoRenewEnabled ? 'Auto-Renew ON' : 'Auto-Renew OFF'}
              </span>
            </div>
            <div className="mt-3 space-y-1">
              <div className="text-xl font-black text-zinc-900 dark:text-zinc-100 truncate">
                {plan?.name || 'Free Tier'}{' '}
                <span className="text-xs font-semibold text-zinc-500 capitalize">({sub?.billingInterval || 'monthly'})</span>
              </div>
              <div className="text-[11px] text-zinc-500 flex items-center justify-between">
                <span>Next Billing:</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {sub?.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Active Plan + Quota Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Plan Card */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6" id="card-subscription-overview">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                    {plan?.displayNameJa || '日本語プラン'}
                  </span>
                  {isTrialing ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      7-Day Free Trial
                    </span>
                  ) : isPastDue ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Past Due (Grace Period)
                    </span>
                  ) : isExpired ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Expired (Restricted)
                    </span>
                  ) : isCancelled ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Cancels at Period End
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
                  {plan?.name || 'Free Tier'} Plan
                </h3>
                <p className="text-xs text-zinc-500">{plan?.tagline}</p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  {isFree ? '৳0' : `৳${(sub?.billingInterval === 'yearly' ? plan?.yearlyPrice : plan?.monthlyPrice)?.toLocaleString()}`}
                </span>
                <span className="text-xs text-zinc-500 block">
                  {isFree ? '/forever' : sub?.billingInterval === 'yearly' ? '/year' : '/month'}
                </span>
              </div>
            </div>

            {/* Subscription Dates & Status */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 text-xs">
              <div>
                <span className="text-zinc-500 block">Billing Cycle</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
                  {sub?.billingInterval || 'Monthly'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">Renewal / Expiry</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {sub?.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">Payment Method</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {sub?.paymentMethod || 'bKash / Card'}
                </span>
              </div>
            </div>

            {/* Embedded 6-Month Billing History Mini Chart in Overview Card */}
            <div className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/30 border border-zinc-200/80 dark:border-zinc-700/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  <TrendingUp className="w-3.5 h-3.5 text-red-600" />
                  <span>6-Month Billing & Spending Velocity</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-medium">Monthly Outlay Trend</span>
              </div>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlySpendingTrend} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="overviewSpendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" strokeOpacity={0.4} />
                    <XAxis dataKey="shortMonth" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} tickFormatter={(val) => `৳${val}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        borderColor: '#27272a',
                        borderRadius: '0.5rem',
                        fontSize: '11px',
                        color: '#fff'
                      }}
                      formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Billed Amount']}
                      labelFormatter={(label) => `Billing Period: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#dc2626"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#overviewSpendGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recurring Notifications & Due Date Push Alert Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60" id="card-due-date-push-notifications">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                    <BellRing className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Push Notifications & Due Date Reminder
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      pushNotificationsEnabled
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {pushNotificationsEnabled ? 'Alerts Active' : 'Muted'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 max-w-lg">
                  {pushNotificationsEnabled
                    ? `Automatic reminders scheduled: Push alert & billing receipt email will trigger 3 days before renewal on ${reminderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (Renewal due in ${daysUntilRenewal} days on ${renewalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}).`
                    : 'Upcoming due date alerts and recurring push notifications are currently disabled.'}
                </p>
                {pushNotificationsEnabled && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleSimulatePreRenewalAlert}
                      className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 text-[10px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                      id="btn-test-renewal-reminder"
                    >
                      <Bell className="w-3 h-3" />
                      <span>Test Pre-Renewal Alert (3-Day Simulation)</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                <button
                  type="button"
                  onClick={handleTogglePushNotifications}
                  disabled={isTogglingPush}
                  aria-checked={pushNotificationsEnabled}
                  role="switch"
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                    pushNotificationsEnabled ? 'bg-red-600' : 'bg-zinc-300 dark:bg-zinc-700'
                  } ${isTogglingPush ? 'opacity-60 cursor-not-allowed' : ''}`}
                  id="toggle-push-notifications-switch"
                >
                  <span className="sr-only">Toggle recurring push notifications for upcoming invoice due dates</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                      pushNotificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  >
                    {isTogglingPush ? (
                      <Loader2 className="w-2.5 h-2.5 text-zinc-600 animate-spin" />
                    ) : pushNotificationsEnabled ? (
                      <Check className="w-2.5 h-2.5 text-red-600 font-bold" />
                    ) : null}
                  </span>
                </button>
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 min-w-8">
                  {pushNotificationsEnabled ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>

            {/* Auto-Renewal Direct Dashboard Toggle */}
            {!isFree && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60" id="card-auto-renewal-toggle">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Automatic Subscription Renewal
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        autoRenewEnabled
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50'
                      }`}
                    >
                      {autoRenewEnabled ? 'Renewal Active' : 'Renewal Paused'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 max-w-lg">
                    {autoRenewEnabled
                      ? `Your subscription will automatically renew on ${sub?.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : 'period end'} to maintain uninterrupted AI Sensei and JLPT access.`
                      : `Auto-renewal is paused. Your premium benefits remain accessible until ${sub?.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : 'the end of your period'} without recurring charges.`}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={handleToggleAutoRenew}
                    disabled={isTogglingAutoRenew}
                    aria-checked={autoRenewEnabled}
                    role="switch"
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                      autoRenewEnabled ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'
                    } ${isTogglingAutoRenew ? 'opacity-60 cursor-not-allowed' : ''}`}
                    id="toggle-auto-renew-switch"
                  >
                    <span className="sr-only">Toggle automatic subscription renewal</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                        autoRenewEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    >
                      {isTogglingAutoRenew ? (
                        <Loader2 className="w-2.5 h-2.5 text-zinc-600 animate-spin" />
                      ) : autoRenewEnabled ? (
                        <Check className="w-2.5 h-2.5 text-emerald-600 font-bold" />
                      ) : null}
                    </span>
                  </button>
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 min-w-8">
                    {autoRenewEnabled ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            )}

            {/* Prominent Upgrade Benefits Highlight Section */}
            {!isJapanReady && missingBenefits.length > 0 && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500/10 via-amber-500/5 to-rose-500/10 dark:from-red-950/40 dark:via-zinc-900 dark:to-amber-950/30 border border-red-200/90 dark:border-red-900/60 space-y-3 shadow-xs" id="section-upgrade-benefits-highlight">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-200/50 dark:border-red-900/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                        Upgrade Benefits — Features You're Missing Out On
                      </h4>
                      <p className="text-[11px] text-zinc-500">
                        Unlock these premium JLPT & career features on {currentPlanId === 'free' ? 'Starter, Pro, or Japan Ready' : 'higher tiers'}:
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate ? onNavigate('pricing') : handleOpenUpgrade()}
                    className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 transition-colors shrink-0"
                    id="btn-view-pricing-from-benefits"
                  >
                    <span>View Pricing Plans</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  {missingBenefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <span className="font-medium text-[11px] leading-tight">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isJapanReady && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold">Maximum Tier Active: </span>
                  <span>You have unlocked all JLPT modules, unlimited AI Sensei interactions, live native interview prep, and career visa guidance.</span>
                </div>
              </div>
            )}

            {/* Actions Toolbar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {isFree ? (
                <button
                  type="button"
                  onClick={handleOpenUpgrade}
                  className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                  id="btn-upgrade-plan-action"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upgrade to Pro / Japan Ready</span>
                </button>
              ) : isPastDue || isExpired ? (
                <>
                  <button
                    type="button"
                    onClick={handleOpenCurrentPlanRenewal}
                    className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                    id="btn-pay-renew-now"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Pay & Renew Subscription</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenUpgrade}
                    className="py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Choose Different Plan
                  </button>
                </>
              ) : isCancelled ? (
                <button
                  type="button"
                  onClick={handleReactivate}
                  className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                  id="btn-reactivate-plan"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reactivate Subscription</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleOpenUpgrade}
                    className="py-2.5 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 text-white dark:text-zinc-900 font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Change / Upgrade Plan</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenCurrentPlanRenewal}
                    className="py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                    id="btn-manual-renew"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Manual Renewal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-red-600 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    id="btn-open-cancel-modal"
                  >
                    Cancel Subscription
                  </button>
                </>
              )}
            </div>
          </div>

          {/* AI Sensei Quota Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">AI Sensei Monthly Usage</span>
                  {usagePercent >= 90 && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 text-[10px] font-bold animate-pulse" title="Monthly quota has reached 90% or higher!">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500 inline-block animate-ping"></span>
                      <AlertTriangle className="w-2.5 h-2.5" />
                      90%+ Limit
                    </span>
                  )}
                </div>
                <Sparkles className="w-4 h-4 text-red-500" />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {usage?.aiCoachInteractions || 0} / {usage?.aiMonthlyLimit || 10} queries
              </h4>
              <p className="text-xs text-zinc-500 mt-0.5">
                {usage?.remainingQuota || 0} queries remaining this month ({usage?.periodYearMonth})
              </p>
            </div>

            {/* Progress bar and Quiz Breakdown Popover */}
            <div className="space-y-1.5 relative" id="component-subscription-usage-progress">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Usage & Learning Progress</span>
                <button
                  type="button"
                  onClick={() => setIsQuizPerformanceOpen((prev) => !prev)}
                  className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 border border-zinc-200 dark:border-zinc-700 text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                  id="btn-quiz-breakdown-popover"
                  title="View detailed breakdown of quiz performance"
                >
                  <BarChart3 className="w-3 h-3" />
                  <span>Quiz Breakdown</span>
                </button>
              </div>

              <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                <div
                  className={`h-full transition-all rounded-full ${
                    usagePercent >= 90 ? 'bg-red-600 animate-pulse' : usagePercent > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span className="flex items-center gap-1">
                  {usagePercent >= 90 && <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block"></span>}
                  {usagePercent}% utilized
                </span>
                <span>Resets on 1st of month</span>
              </div>

              {/* Quiz Performance Detailed Popover */}
              {isQuizPerformanceOpen && (
                <div
                  className="absolute right-0 bottom-full mb-2 z-50 w-72 sm:w-80 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 text-xs text-zinc-800 dark:text-zinc-200"
                  id="popover-quiz-performance-details"
                >
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-red-500" />
                      <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                        Quiz Performance Breakdown
                      </h5>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsQuizPerformanceOpen(false)}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-red-50/70 dark:bg-red-950/40 border border-red-200/70 dark:border-red-900/50">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                        Average Quiz Score
                      </span>
                      <div className="text-lg font-black text-red-600 dark:text-red-400 mt-0.5">
                        88.5%
                      </div>
                      <span className="text-[9px] text-zinc-500">Grade: A • JLPT N5 Mock</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/50">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                        Quizzes Completed
                      </span>
                      <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
                        42 Drills
                      </div>
                      <span className="text-[9px] text-zinc-500">128 practice cards</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                      Most Common Mistake Category
                    </span>
                    <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                      Particles (助詞: に vs で vs へ)
                    </div>
                    <p className="text-[10px] text-zinc-500">
                      Directional & time markers mistake frequency: 14.2% of drill attempts.
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                    <span>Mastery Level: <strong className="text-emerald-600 font-bold">91.2%</strong></span>
                    <span>Spaced Repetition: Active</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-[11px] text-zinc-600 dark:text-zinc-400">
              Need more queries? Upgrading to Pro gives 1,000 queries/mo and Japan Ready grants unlimited AI interactions.
            </div>
          </div>
        </div>

        {/* Saved Payment Methods Section */}
        <SavedPaymentMethods onMethodChanged={fetchDetails} />

        {/* Invoices & Payment History */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6" id="section-billing-invoices">
          {/* Contextual Warning Banner: Expired Payment Method or Failed Auto-Debit */}
          {showPaymentWarningBanner && (
            <div
              className="p-4 sm:p-5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2"
              id="banner-payment-alert-warning"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-rose-950 dark:text-rose-100">
                      {isPastDue
                        ? 'Auto-Debit Failed: Subscription Renewal Overdue'
                        : expiredPaymentMethod
                        ? `Payment Method Expired: ${expiredPaymentMethod.cardBrand ? `${expiredPaymentMethod.cardBrand} •••• ${expiredPaymentMethod.cardLast4}` : expiredPaymentMethod.type.toUpperCase()}`
                        : 'Recent Auto-Debit Attempt Failed'}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-600 text-white tracking-wider">
                      Action Required
                    </span>
                  </div>
                  <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed max-w-2xl">
                    {expiredPaymentMethod
                      ? `Your saved payment card (${expiredPaymentMethod.cardExpiry || 'Expired'}) needs immediate renewal. Update your card or bKash billing token to prevent subscription suspension and keep your unlimited AI Sensei access active.`
                      : `An automatic renewal debit of ৳${failedInvoice?.amount || 1499} was unsuccessful. Please check your card balance or billing credentials to avoid service interruptions.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('section-saved-payment-methods') || document.getElementById('section-billing-invoices');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  id="btn-banner-update-payment"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Update Payment</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    setActionMessage('Retrying automatic billing cycle with default payment gateway...');
                    try {
                      await billingApi.reactivateSubscription();
                      setActionMessage('✓ Payment gateway re-authorized successfully.');
                      setPaymentWarningDismissed(true);
                      await fetchDetails();
                    } catch (e: any) {
                      setActionError(e.message || 'Auto-debit retry failed. Please update payment method.');
                    }
                    setTimeout(() => {
                      setActionMessage(null);
                      setActionError(null);
                    }, 4000);
                  }}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/80 text-xs font-semibold transition-colors cursor-pointer"
                  id="btn-banner-retry-payment"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Auto-Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentWarningDismissed(true)}
                  className="p-2 rounded-xl bg-transparent hover:bg-rose-200/50 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                  title="Dismiss Alert"
                  id="btn-banner-dismiss-alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 12-Month Total Spending Summary Widget */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/70" id="widget-12mo-summary-history">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Past 12 Months Total Nihomi Investment
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Cumulative historical spending across all billed subscriptions with statutory 15% NBR tax breakdown.
              </p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
                ৳{twelveMonthTotal.toLocaleString()} <span className="text-xs text-zinc-500 font-sans font-semibold">BDT</span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">100% Tax Compliant (15% VAT Included)</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  Invoice & Billing History
                </h3>
                {/* Help Tooltip for Keyboard Shortcuts */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowShortcutsTooltip((prev) => !prev)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    id="btn-billing-shortcuts-help"
                    title="View Keyboard Shortcuts (Ctrl+S, Ctrl+P)"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                  {showShortcutsTooltip && (
                    <div
                      className="absolute left-0 top-full mt-1.5 z-50 w-64 p-3 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl text-white text-xs space-y-2 animate-in fade-in zoom-in-95"
                      id="tooltip-billing-shortcuts"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-1 font-bold text-red-400 text-[11px]">
                        <span>Billing Keyboard Shortcuts</span>
                        <button type="button" onClick={() => setShowShortcutsTooltip(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="space-y-1 text-[11px] text-zinc-300">
                        <div className="flex justify-between items-center">
                          <span>Save current filters:</span>
                          <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded font-mono text-[10px] text-amber-300 font-bold">Ctrl+S</kbd>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Print receipt / table:</span>
                          <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded font-mono text-[10px] text-amber-300 font-bold">Ctrl+P</kbd>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Search by amount:</span>
                          <span className="font-mono text-[10px] text-amber-300">&gt; 500 BDT</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-zinc-500">
                Official PDF tax receipts, email dispatch, search filters, bulk PDF archive, and CSV exports.
              </p>
            </div>

            {/* Controls: Summary Pill, Download All Invoices ZIP, Annual Tax Summary PDF, Single Filtered PDF, Bulk Filtered PDF, Export CSV, Bulk Export to CSV, Batch Print Table */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Dynamic 15% VAT Paid Summary Pill */}
              <div
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-bold shadow-2xs shrink-0"
                id="pill-filtered-vat-paid"
                title="Total 15% Statutory VAT Paid for the currently filtered view"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Total 15% VAT Paid:</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-300 font-extrabold">
                  ৳{filteredTotalVat.toLocaleString()} BDT
                </span>
              </div>

              {/* Annual Tax Summary PDF Button */}
              <button
                type="button"
                onClick={() => {
                  if (invoices.length === 0) {
                    setActionMessage('No invoice records found to compile annual tax summary.');
                    setTimeout(() => setActionMessage(null), 3000);
                    return;
                  }
                  try {
                    downloadAnnualTaxSummaryPDF(invoices);
                    setActionMessage('✓ Official Annual Tax Summary PDF for current fiscal year generated and downloaded.');
                    setTimeout(() => setActionMessage(null), 4000);
                  } catch (err: any) {
                    setActionError(err?.message || 'Failed to generate Annual Tax Summary PDF.');
                    setTimeout(() => setActionError(null), 4000);
                  }
                }}
                disabled={invoices.length === 0}
                className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold text-xs border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs disabled:opacity-50 cursor-pointer"
                id="btn-annual-tax-summary-pdf"
                title="Download consolidated Annual Tax Summary PDF for the current fiscal year"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Annual Tax Summary (PDF)</span>
              </button>

              {/* Export Filtered Single PDF Button */}
              <button
                type="button"
                onClick={() => {
                  if (filteredInvoices.length === 0) {
                    setActionMessage('No invoice records match current filters to export.');
                    setTimeout(() => setActionMessage(null), 3000);
                    return;
                  }
                  try {
                    downloadFilteredInvoicesSinglePDF(filteredInvoices);
                    setActionMessage(`✓ Exported ${filteredInvoices.length} filtered invoices into a single consolidated PDF document.`);
                    setTimeout(() => setActionMessage(null), 4000);
                  } catch (err: any) {
                    setActionError(err?.message || 'Failed to export filtered invoices to single PDF.');
                    setTimeout(() => setActionError(null), 4000);
                  }
                }}
                disabled={filteredInvoices.length === 0}
                className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 font-bold text-xs border border-red-200 dark:border-red-800 flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs disabled:opacity-50 cursor-pointer"
                id="btn-export-filtered-single-pdf"
                title="Export all currently filtered invoices directly into a single consolidated multi-page PDF document"
              >
                <FileText className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>Single Filtered PDF</span>
              </button>

              {/* Download All Invoices Button (Entire History ZIP) */}
              <button
                type="button"
                onClick={() => {
                  if (invoices.length === 0) {
                    setActionMessage('No invoice records found in history.');
                    setTimeout(() => setActionMessage(null), 3000);
                    return;
                  }
                  setIsBulkDownloading(true);
                  bulkDownloadInvoicesZip(invoices)
                    .then(() => {
                      setActionMessage(`Downloaded complete history of ${invoices.length} invoices as ZIP archive.`);
                      setTimeout(() => setActionMessage(null), 5000);
                    })
                    .catch((err) => {
                      setActionError(err.message || 'Failed to download all invoices ZIP.');
                      setTimeout(() => setActionError(null), 4000);
                    })
                    .finally(() => {
                      setIsBulkDownloading(false);
                    });
                }}
                disabled={isBulkDownloading || invoices.length === 0}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                id="btn-download-all-invoices"
                title="Download entire invoice history as a single ZIP file containing PDFs"
              >
                {isBulkDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>{isBulkDownloading ? 'Packaging Invoices...' : 'Download All Invoices'}</span>
              </button>

              {/* Bulk Download PDF Button */}
              <button
                type="button"
                onClick={handleBulkDownloadPDF}
                disabled={isBulkDownloading || filteredInvoices.length === 0}
                className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs disabled:opacity-50 cursor-pointer"
                id="btn-bulk-download-pdf"
                title="Download all currently filtered invoices as a compressed ZIP archive"
              >
                {isBulkDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-600" />
                ) : (
                  <Archive className="w-3.5 h-3.5" />
                )}
                <span>Filtered ZIP</span>
              </button>

              {/* Export Filtered CSV Button */}
              <button
                type="button"
                onClick={handleExportFilteredCSV}
                disabled={filteredInvoices.length === 0}
                className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs disabled:opacity-50 cursor-pointer"
                id="btn-export-billing-csv"
                title="Export currently filtered invoices as a CSV file"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Export Filtered CSV</span>
              </button>

              {/* Bulk Export Entire History to CSV Button */}
              <button
                type="button"
                onClick={handleBulkExportAllCSV}
                disabled={invoices.length === 0}
                className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold text-xs border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs disabled:opacity-50 cursor-pointer"
                id="btn-bulk-export-entire-history-csv"
                title="Bulk export entire invoice and billing history to CSV for accounting"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Bulk Export to CSV</span>
              </button>

              {/* Batch Print Button */}
              <button
                type="button"
                onClick={() => {
                  if (selectedInvoiceIds.length > 0) {
                    setBatchConfirmAction('print');
                  } else {
                    handlePrintTable();
                  }
                }}
                disabled={filteredInvoices.length === 0}
                className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs disabled:opacity-50 cursor-pointer"
                id="btn-batch-print-invoices"
                title={selectedInvoiceIds.length > 0 ? `Batch print ${selectedInvoiceIds.length} selected invoices` : 'Print full invoice table'}
              >
                <Printer className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
                <span>{selectedInvoiceIds.length > 0 ? `Batch Print (${selectedInvoiceIds.length})` : 'Batch Print'}</span>
              </button>
            </div>
          </div>

          {/* Search Bar & Status Dropdown & Date Range Filters */}
          <div className="space-y-3">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
              {/* Search input with LocalStorage History Dropdown */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={invoiceFilter}
                  onChange={(e) => setInvoiceFilter(e.target.value)}
                  onFocus={() => setIsSearchHistoryOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveSearchQuery(invoiceFilter);
                      setIsSearchHistoryOpen(false);
                    }
                  }}
                  onBlur={() => {
                    if (invoiceFilter.trim()) {
                      saveSearchQuery(invoiceFilter);
                    }
                    setTimeout(() => setIsSearchHistoryOpen(false), 200);
                  }}
                  placeholder={
                    searchByAmountMode
                      ? "Search price point (e.g. > 500 BDT, >= 1499, < 2000, 500-3000)..."
                      : "Filter by ID, date, amount, or plan name (e.g. Pro, bKash, 2990)..."
                  }
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all placeholder:text-zinc-400"
                  id="input-search-invoices"
                  name="search-invoices"
                />
                {invoiceFilter && (
                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceFilter('');
                      setIsSearchHistoryOpen(false);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 rounded-full cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* LocalStorage Search History Dropdown (5 unique queries) */}
                {isSearchHistoryOpen && searchHistory.length > 0 && (
                  <div
                    className="absolute left-0 right-0 top-full mt-1.5 z-40 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl space-y-1 animate-in fade-in zoom-in-95"
                    id="dropdown-search-history"
                  >
                    <div className="flex items-center justify-between px-2 py-1 border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <History className="w-3 h-3 text-red-500" />
                        Recent Searches
                      </span>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleClearSearchHistory();
                        }}
                        className="text-red-600 dark:text-red-400 hover:underline cursor-pointer lowercase"
                      >
                        Clear
                      </button>
                    </div>
                    {searchHistory.map((query, idx) => (
                      <button
                        key={`history-${idx}-${query}`}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setInvoiceFilter(query);
                          saveSearchQuery(query);
                          setIsSearchHistoryOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between group transition-colors cursor-pointer"
                        id={`btn-search-history-${idx}`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-zinc-400 group-hover:text-red-500" />
                          <span>{query}</span>
                        </div>
                        <ArrowUpRight className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search by Amount Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  setSearchByAmountMode((prev) => !prev);
                  if (!searchByAmountMode && !invoiceFilter) {
                    setInvoiceFilter('> 500 BDT');
                  }
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs ${
                  searchByAmountMode
                    ? 'bg-red-600 text-white border-red-600 shadow-red-500/20'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
                id="toggle-search-by-amount"
                title="Toggle Search by Amount (supports expressions like > 500 BDT, <= 2000, 1499)"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Search by Amount</span>
              </button>

              {/* Plan Type Dropdown Filter */}
              <div className="flex items-center gap-1.5 shrink-0">
                <select
                  value={selectedPlanFilter}
                  onChange={(e) => setSelectedPlanFilter(e.target.value)}
                  className="py-2 px-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all shrink-0 cursor-pointer"
                  id="select-filter-plan-type"
                  title="Filter invoices by subscription plan tier"
                >
                  <option value="all">All Plans</option>
                  <option value="starter">Starter Plan</option>
                  <option value="pro">Pro Plan</option>
                  <option value="japan_ready">Japan Ready Plan</option>
                  <option value="free">Free Tier</option>
                </select>
              </div>

              {/* Billing Period Dropdown Filter (Month / Quarter) */}
              <div className="flex items-center gap-1.5 shrink-0">
                <select
                  value={selectedPeriodFilter}
                  onChange={(e) => setSelectedPeriodFilter(e.target.value)}
                  className="py-2 px-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all shrink-0 cursor-pointer"
                  id="select-filter-billing-period"
                  title="Filter invoices by billing month or quarter for tax reconciliation"
                >
                  <option value="all">All Periods</option>
                  <optgroup label="Tax Reconciliation Quarters">
                    <option value="Q1-2026">Q1 2026 (Jan – Mar)</option>
                    <option value="Q4-2025">Q4 2025 (Oct – Dec)</option>
                    <option value="Q3-2025">Q3 2025 (Jul – Sep)</option>
                    <option value="Q2-2025">Q2 2025 (Apr – Jun)</option>
                    <option value="Q1-2025">Q1 2025 (Jan – Mar)</option>
                  </optgroup>
                  {uniqueInvoiceMonths.length > 0 && (
                    <optgroup label="Monthly Periods">
                      {uniqueInvoiceMonths.map((m) => (
                        <option key={m.key} value={m.key}>
                          {m.label} ({m.count})
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Status Dropdown Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="py-2 px-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all shrink-0 cursor-pointer"
                id="select-invoice-status"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              {/* Quick Filter: Pending Invoices Button */}
              <button
                type="button"
                onClick={() => setStatusFilter((prev) => (prev === 'pending' ? 'all' : 'pending'))}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer border flex items-center gap-1.5 ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-amber-600 dark:text-amber-400 border-zinc-200 dark:border-zinc-700'
                }`}
                id="btn-filter-pending-only"
                title="Filter to show only pending/unpaid invoices"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse"></span>
                <span>Pending Only</span>
              </button>

              {/* Column Visibility Toggle Menu */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowColumnVisibilityMenu((prev) => !prev)}
                  className="py-2 px-3 rounded-xl text-xs font-semibold bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  id="btn-column-visibility-toggle"
                  title="Toggle visibility of additional table columns"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                  <span>Columns</span>
                </button>

                {showColumnVisibilityMenu && (
                  <div
                    className="absolute right-0 top-full mt-1.5 z-40 w-56 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl space-y-2 animate-in fade-in zoom-in-95"
                    id="menu-column-visibility"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                        Table Columns
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowColumnVisibilityMenu(false)}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/60 p-1.5 rounded-lg">
                        <input
                          type="checkbox"
                          checked={visibleColumns.transactionId}
                          onChange={(e) =>
                            setVisibleColumns((prev) => ({ ...prev, transactionId: e.target.checked }))
                          }
                          className="rounded border-zinc-300 text-red-600 focus:ring-red-500 cursor-pointer"
                          id="checkbox-col-transaction-id"
                        />
                        <span>Transaction ID</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/60 p-1.5 rounded-lg">
                        <input
                          type="checkbox"
                          checked={visibleColumns.billingAddress}
                          onChange={(e) =>
                            setVisibleColumns((prev) => ({ ...prev, billingAddress: e.target.checked }))
                          }
                          className="rounded border-zinc-300 text-red-600 focus:ring-red-500 cursor-pointer"
                          id="checkbox-col-billing-address"
                        />
                        <span>Billing Address</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/60 p-1.5 rounded-lg">
                        <input
                          type="checkbox"
                          checked={visibleColumns.gatewayResponse}
                          onChange={(e) =>
                            setVisibleColumns((prev) => ({ ...prev, gatewayResponse: e.target.checked }))
                          }
                          className="rounded border-zinc-300 text-red-600 focus:ring-red-500 cursor-pointer"
                          id="checkbox-col-gateway-response"
                        />
                        <span>Gateway Response</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Date Range Start & End Inputs */}
              <div className="flex items-center gap-1.5 shrink-0 bg-zinc-50 dark:bg-zinc-800/60 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <span className="text-[10px] font-bold text-zinc-400 uppercase px-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Date:
                </span>
                <input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  className="py-1 px-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                  id="input-date-start"
                  title="Filter from Start Date"
                  aria-label="Filter from Start Date"
                />
                <span className="text-xs text-zinc-400">to</span>
                <input
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                  className="py-1 px-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                  id="input-date-end"
                  title="Filter to End Date"
                  aria-label="Filter to End Date"
                />
                {(startDateFilter || endDateFilter) && (
                  <button
                    type="button"
                    onClick={() => {
                      setStartDateFilter('');
                      setEndDateFilter('');
                    }}
                    className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    title="Clear Date Range"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Advanced Search: Toggleable Filter Chips & Save Filter Button */}
            <div className="p-3.5 rounded-2xl bg-zinc-50/90 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 space-y-2.5" id="section-advanced-search-filters">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <Filter className="w-3.5 h-3.5 text-red-600" />
                  <span>Advanced Search & Filter Chips</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveFilters}
                    className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 cursor-pointer bg-white dark:bg-zinc-800 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-2xs"
                    id="btn-save-filters"
                    title="Save current search and filter settings to local storage"
                  >
                    <BookmarkPlus className="w-3 h-3 text-red-600" />
                    <span>Save Current Filters</span>
                  </button>
                  {(selectedPlanFilter !== 'all' || selectedMethodFilter !== 'all' || invoiceFilter || statusFilter !== 'all' || startDateFilter || endDateFilter) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlanFilter('all');
                        setSelectedMethodFilter('all');
                        setInvoiceFilter('');
                        setStatusFilter('all');
                        setStartDateFilter('');
                        setEndDateFilter('');
                      }}
                      className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                      id="btn-reset-all-filters"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Plan Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mr-1 flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Plan:
                </span>
                {[
                  { id: 'all', label: 'All Plans' },
                  { id: 'free', label: 'Free Tier' },
                  { id: 'starter', label: 'Starter' },
                  { id: 'pro', label: 'Pro' },
                  { id: 'japan_ready', label: 'Japan Ready' }
                ].map((chip) => {
                  const isActive = selectedPlanFilter === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => setSelectedPlanFilter(chip.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-red-600 text-white font-bold shadow-xs'
                          : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-red-400'
                      }`}
                      id={`filter-chip-plan-${chip.id}`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>

              {/* Payment Method Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mr-1 flex items-center gap-1">
                  <CreditCard className="w-3 h-3" /> Method:
                </span>
                {[
                  { id: 'all', label: 'All Methods' },
                  { id: 'bkash', label: 'bKash' },
                  { id: 'nagad', label: 'Nagad' },
                  { id: 'rocket', label: 'Rocket' },
                  { id: 'card', label: 'Card / SSLCommerz' },
                  { id: 'apple_pay', label: 'Apple Pay' },
                  { id: 'google_pay', label: 'Google Pay' }
                ].map((chip) => {
                  const isActive = selectedMethodFilter === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => setSelectedMethodFilter(chip.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-red-600 text-white font-bold shadow-xs'
                          : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-red-400'
                      }`}
                      id={`filter-chip-method-${chip.id}`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lifetime Summary Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4" id="section-billing-summary-stats">
            <div className="p-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-[11px] font-bold uppercase tracking-wider">Lifetime Paid</span>
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                ৳{totalLifetimePaid.toLocaleString()}
              </div>
              <p className="text-[10px] text-zinc-500">Total BDT paid across all cycles</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-[11px] font-bold uppercase tracking-wider">Active Months</span>
                <Calendar className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {activeMonthsSubscribed} {activeMonthsSubscribed === 1 ? 'Month' : 'Months'}
              </div>
              <p className="text-[10px] text-zinc-500">Continuous Academy membership</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-[11px] font-bold uppercase tracking-wider">12-Mo. Past Year</span>
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                ৳{twelveMonthTotal.toLocaleString()}
              </div>
              <p className="text-[10px] text-zinc-500">Past year total spending</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Invoices</span>
                <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {invoices.length} {invoices.length === 1 ? 'Record' : 'Records'}
              </div>
              <p className="text-[10px] text-zinc-500">Tax invoices on file</p>
            </div>
          </div>

          {/* Spending Analytics (Recharts BarChart & 12-Month Past Year AreaChart) */}
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-50/60 dark:bg-zinc-800/30 border border-zinc-200/80 dark:border-zinc-800 space-y-3" id="section-monthly-spending-chart">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-red-600 dark:text-red-400" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    Spending Trends & Expense Analytics
                  </h4>
                  <p className="text-[10px] text-zinc-500">Visualize monthly spending trends over the past year using Recharts</p>
                </div>
              </div>

              {/* Toggle tabs for 6-Month Breakdown Bar Chart vs 12-Month Area Chart vs 15% VAT Tax Breakdown */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setSpendingViewMode('6months-bar')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    spendingViewMode === '6months-bar'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                  id="btn-view-6mo-bar"
                >
                  6-Month (Bar)
                </button>
                <button
                  type="button"
                  onClick={() => setSpendingViewMode('12months-trend')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    spendingViewMode === '12months-trend'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                  id="btn-view-12mo-trend"
                >
                  Past Year (12-Mo)
                </button>
                <button
                  type="button"
                  onClick={() => setSpendingViewMode('tax-vat-bar')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    spendingViewMode === 'tax-vat-bar'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                  id="btn-view-vat-tax-bar"
                >
                  15% VAT Breakdown (Bar)
                </button>
              </div>
            </div>

            <div className="h-48 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {spendingViewMode === '6months-bar' ? (
                  <BarChart data={monthlySpendingTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#71717a" opacity={0.15} />
                    <XAxis
                      dataKey="shortMonth"
                      tick={{ fontSize: 10, fill: '#71717a' }}
                      axisLine={{ stroke: '#71717a', opacity: 0.2 }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#71717a' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `৳${val}`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-3 py-2 rounded-lg shadow-lg text-xs space-y-0.5 border border-zinc-700/50">
                              <p className="font-bold">{data.monthLabel}</p>
                              <p className="text-red-400 dark:text-red-600 font-extrabold">
                                Total Billed: ৳{data.amount.toLocaleString()} BDT
                              </p>
                              <p className="text-[10px] text-zinc-400 dark:text-zinc-600">
                                {data.count} {data.count === 1 ? 'invoice record' : 'invoice records'}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {monthlySpendingTrend.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === monthlySpendingTrend.length - 1 ? '#dc2626' : '#f87171'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                ) : spendingViewMode === 'tax-vat-bar' ? (
                  <BarChart data={vatSpendingTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#71717a" opacity={0.15} />
                    <XAxis
                      dataKey="shortMonth"
                      tick={{ fontSize: 10, fill: '#71717a' }}
                      axisLine={{ stroke: '#71717a', opacity: 0.2 }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#71717a' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `৳${val}`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-3 py-2 rounded-lg shadow-lg text-xs space-y-1 border border-zinc-700/50">
                              <p className="font-bold border-b border-zinc-700 dark:border-zinc-300 pb-0.5">{data.monthLabel}</p>
                              <div className="text-[11px] space-y-0.5">
                                <p className="text-zinc-300 dark:text-zinc-700">Base Subtotal: ৳{data.subtotal.toLocaleString()} BDT</p>
                                <p className="text-emerald-400 dark:text-emerald-600 font-bold">15% VAT Paid: ৳{data.vat.toLocaleString()} BDT</p>
                                <p className="text-red-400 dark:text-red-600 font-extrabold">Total Settled: ৳{data.total.toLocaleString()} BDT</p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      wrapperStyle={{ fontSize: '11px', paddingBottom: '4px' }}
                    />
                    <Bar dataKey="subtotal" name="Assessable Base" fill="#64748b" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={42} />
                    <Bar dataKey="vat" name="15% Statutory VAT" fill="#059669" stackId="a" radius={[6, 6, 0, 0]} maxBarSize={42} />
                  </BarChart>
                ) : (
                  <AreaChart data={monthlySpendingTrend12} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="spendingGradient12" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#71717a" opacity={0.15} />
                    <XAxis
                      dataKey="shortMonth"
                      tick={{ fontSize: 10, fill: '#71717a' }}
                      axisLine={{ stroke: '#71717a', opacity: 0.2 }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#71717a' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `৳${val}`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-3 py-2 rounded-lg shadow-lg text-xs space-y-0.5 border border-zinc-700/50">
                              <p className="font-bold">{data.monthLabel}</p>
                              <p className="text-red-400 dark:text-red-600 font-extrabold">
                                Past Year Spending: ৳{data.amount.toLocaleString()}
                              </p>
                              <p className="text-[10px] text-zinc-400 dark:text-zinc-600">
                                {data.count} {data.count === 1 ? 'transaction' : 'transactions'}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#dc2626"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#spendingGradient12)"
                      activeDot={{ r: 5, fill: '#dc2626', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Month-Specific 'Select All' Interactive Toggles */}
            <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-700/60 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 flex items-center gap-1">
                <CheckSquare className="w-3 h-3 text-red-600 dark:text-red-400" />
                Select Invoices by Month:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {vatSpendingTrend.map((item) => {
                  const monthInvoices = invoices.filter((inv) => {
                    const d = inv.createdAt ? new Date(inv.createdAt) : (inv.billingPeriod ? new Date(inv.billingPeriod) : new Date());
                    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                    return key === item.monthKey || inv.billingPeriod.includes(item.monthKey);
                  });
                  const count = monthInvoices.length;
                  const monthIds = monthInvoices.map((inv) => inv.id);
                  const isMonthSelected = count > 0 && monthIds.every((id) => selectedInvoiceIds.includes(id));
                  return (
                    <button
                      key={item.monthKey}
                      type="button"
                      disabled={count === 0}
                      onClick={() => handleSelectMonthInvoices(item.monthKey)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                        isMonthSelected
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                      }`}
                      id={`btn-select-month-${item.monthKey}`}
                      title={`Select all ${count} invoice(s) from ${item.monthLabel}`}
                    >
                      <span>{item.shortMonth}</span>
                      <span className="text-[9px] opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggleable Spending & Tax Insights Summary Card */}
            <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-700/60" id="section-spending-insights">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  <TrendingUp className="w-3.5 h-3.5 text-red-600" />
                  <span>Period-over-Period Spending Insights</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSpendingInsights(!showSpendingInsights)}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer flex items-center gap-1"
                  id="btn-toggle-spending-insights"
                >
                  <span>{showSpendingInsights ? 'Hide Insights' : 'Show Insights'}</span>
                </button>
              </div>

              {showSpendingInsights && (
                <div className="mt-2.5 p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-2xs space-y-2.5 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/50">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">6-Month Change</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-base font-extrabold ${
                          sixMonthPercentageChange > 0
                            ? 'text-red-600 dark:text-red-400'
                            : sixMonthPercentageChange < 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-zinc-600 dark:text-zinc-400'
                        }`}>
                          {sixMonthPercentageChange > 0 ? `+${sixMonthPercentageChange}%` : `${sixMonthPercentageChange}%`}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {sixMonthPercentageChange >= 0 ? 'vs previous 6-mo' : 'decrease'}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/50">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Past 6-Mo Total</span>
                      <div className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mt-0.5">
                        ৳{sixMonthTotal.toLocaleString()} <span className="text-[10px] font-normal text-zinc-500">(Prev: ৳{previousSixMonthTotal.toLocaleString()})</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/50">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">6-Mo Tax Contribution</span>
                      <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5">
                        ৳{sixMonthTotalVat.toLocaleString()} <span className="text-[10px] font-normal text-zinc-500">(15% VAT)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {sixMonthPercentageChange === 0
                      ? 'Your subscription spending has remained completely stable across both consecutive 6-month cycles with predictable billing.'
                      : sixMonthPercentageChange > 0
                      ? `Your billing expenses increased by ${sixMonthPercentageChange}% compared to the prior 6-month period, reflecting active learning tier additions and statutory 15% NBR tax compliance.`
                      : `Your overall expenses decreased by ${Math.abs(sixMonthPercentageChange)}% compared to the prior 6-month period due to promotional credits and interval adjustments.`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Email dispatch feedback banner */}
          {emailNotification && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{emailNotification}</span>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotification(null)}
                className="text-emerald-600 hover:text-emerald-800 text-xs font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Bulk Floating Action Bar (Appears when 1+ invoices selected) */}
          {selectedInvoiceIds.length > 0 && (
            <div className="p-3 bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2" id="floating-invoice-action-bar">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-red-600 text-white flex items-center justify-center text-xs font-bold font-mono shadow-xs">
                  {selectedInvoiceIds.length}
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {selectedInvoiceIds.length} {selectedInvoiceIds.length === 1 ? 'Invoice' : 'Invoices'} Selected
                  </span>
                  <span className="text-[11px] text-zinc-500 ml-2">
                    (Total: <strong className="text-red-600 dark:text-red-400">৳{totalSelectedRefundAmount.toLocaleString()} BDT</strong>)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Download Selected (Prompts Confirmation Dialog) */}
                <button
                  type="button"
                  onClick={() => setBatchConfirmAction('download')}
                  disabled={isBulkDownloading}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  id="btn-download-selected-invoices"
                  title="Download all selected invoices as ZIP"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Selected ({selectedInvoiceIds.length})</span>
                </button>

                {/* Print Selected (Prompts Confirmation Dialog) */}
                <button
                  type="button"
                  onClick={() => setBatchConfirmAction('print')}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  id="btn-print-selected-invoices"
                  title="Print formatted table for selected invoices"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Selected ({selectedInvoiceIds.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBulkRefundModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  id="btn-bulk-refund-action"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Bulk Refund</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-emerald-50 dark:hover:bg-zinc-700 transition-colors shadow-2xs"
                  id="btn-bulk-export-csv"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>CSV Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedInvoiceIds([])}
                  className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-semibold px-2 py-1 cursor-pointer transition-colors"
                  id="btn-deselect-all-invoices"
                >
                  Deselect All
                </button>
              </div>
            </div>
          )}

          {/* Batch Action Confirmation Dialog for Download Selected & Print Selected */}
          {batchConfirmAction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in" id="dialog-batch-action-confirmation">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    {batchConfirmAction === 'download' ? <Download className="w-5 h-5" /> : <Printer className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      Confirm {batchConfirmAction === 'download' ? 'Batch Download' : 'Batch Print'}
                    </h4>
                    <p className="text-xs text-zinc-500">
                      {selectedInvoiceIds.length} {selectedInvoiceIds.length === 1 ? 'invoice record' : 'invoice records'} selected
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 text-xs space-y-1.5">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Total Invoices Selected:</span>
                    <strong className="text-zinc-900 dark:text-zinc-100 font-mono">{selectedInvoiceIds.length}</strong>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Aggregated Value:</span>
                    <strong className="text-red-600 dark:text-red-400 font-mono font-bold">৳{totalSelectedRefundAmount.toLocaleString()} BDT</strong>
                  </div>
                  <p className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-200 dark:border-zinc-700/40">
                    {batchConfirmAction === 'download'
                      ? 'This will package all selected receipts into a compressed ZIP file with individual PDF tax challans.'
                      : 'This will format and prepare a clean, printable summary sheet of the selected invoices for your accounting records.'}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setBatchConfirmAction(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    id="btn-cancel-batch-action"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const action = batchConfirmAction;
                      setBatchConfirmAction(null);
                      if (action === 'download') {
                        handleBulkDownloadPDF();
                      } else if (action === 'print') {
                        handlePrintTable();
                      }
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    id="btn-confirm-batch-action"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Proceed & {batchConfirmAction === 'download' ? 'Download' : 'Print'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {invoices.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
              <FileText className="w-8 h-8 mx-auto text-zinc-300 dark:text-zinc-700" />
              <p className="text-xs font-semibold text-zinc-500">No payment invoices yet.</p>
              <p className="text-[11px] text-zinc-400">Paid subscription invoices will appear here with full tax details.</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
              <Search className="w-6 h-6 mx-auto text-zinc-400" />
              <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                No invoices found matching "{invoiceFilter}"
              </p>
              <button
                type="button"
                onClick={() => setInvoiceFilter('')}
                className="text-xs text-red-600 hover:underline font-bold"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left" id="table-billing-invoices">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = isSomeSelected;
                        }}
                        onChange={toggleSelectAllInvoices}
                        className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-red-600 focus:ring-red-500 cursor-pointer accent-red-600"
                        aria-label="Select all invoices"
                        id="checkbox-select-all-invoices"
                      />
                    </th>
                    <th className="py-2.5 px-3 relative">
                      <div className="flex items-center gap-1.5">
                        <span>Invoice #</span>
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() => setShowTaxTooltip(!showTaxTooltip)}
                            onMouseEnter={() => setShowTaxTooltip(true)}
                            onMouseLeave={() => setShowTaxTooltip(false)}
                            className="p-0.5 rounded-full text-zinc-400 hover:text-red-500 transition-colors"
                            aria-label="Tax Information Details"
                            id="btn-tax-info-tooltip"
                          >
                            <HelpCircle className="w-3 h-3" />
                          </button>
                          {showTaxTooltip && (
                            <div className="absolute left-0 top-full mt-1.5 z-40 w-72 p-3 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl text-zinc-300 normal-case font-normal space-y-1.5 pointer-events-auto">
                              <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs">
                                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>Tax & VAT Compliance</span>
                              </div>
                              <p className="text-[11px] leading-relaxed text-zinc-300">
                                Receipts include <strong>15% VAT breakdown</strong> under NBR rules, registered BIN (<strong>004928192-0101</strong>), and digital cryptographic verification seals for official business expense claims.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                    <th className="py-2.5 px-3">Plan</th>
                    <th className="py-2.5 px-3">Period</th>
                    <th className="py-2.5 px-3">Payment Method</th>
                    {visibleColumns.transactionId && <th className="py-2.5 px-3">Transaction ID</th>}
                    {visibleColumns.billingAddress && <th className="py-2.5 px-3">Billing Address</th>}
                    {visibleColumns.gatewayResponse && <th className="py-2.5 px-3">Gateway Response</th>}
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Days Since Paid</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  <AnimatePresence mode="popLayout">
                    {filteredInvoices.map((inv, index) => {
                      const isSelected = selectedInvoiceIds.includes(inv.id);
                      const invoiceDate = new Date(inv.createdAt);
                      const now = new Date();
                      const diffTime = Math.max(0, now.getTime() - invoiceDate.getTime());
                      const daysSincePaid = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                      const isPaid = (inv.status || 'paid').toLowerCase() === 'paid';
                      return (
                        <React.Fragment key={inv.id}>
                          <motion.tr
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                            className={`transition-colors ${
                              isSelected
                                ? 'bg-red-50/60 dark:bg-red-950/25'
                                : 'hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30'
                            }`}
                          >
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectInvoice(inv.id)}
                                className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-red-600 focus:ring-red-500 cursor-pointer accent-red-600"
                                aria-label={`Select invoice ${inv.id}`}
                                id={`checkbox-invoice-${inv.id}`}
                              />
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                                  <HighlightMatch text={inv.id} query={invoiceFilter} />
                                </span>
                                <span
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0 shadow-2xs"
                                  title="Verified by NBR - Cryptographic compliance seal under NBR Mushak 6.3"
                                  id={`badge-nbr-verified-${inv.id}`}
                                >
                                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                                  Verified by NBR
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col gap-1 items-start">
                                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                  <HighlightMatch text={inv.planName} query={invoiceFilter} />
                                </span>
                                {getInvoiceExpenseType(inv) === 'subscription' ? (
                                  <span
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0 shadow-2xs"
                                    id={`tag-expense-type-${inv.id}`}
                                    title="Expense Type: Recurring Subscription"
                                  >
                                    <RefreshCw className="w-2.5 h-2.5 text-indigo-500 shrink-0" />
                                    <span>Subscription</span>
                                  </span>
                                ) : (
                                  <span
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0 shadow-2xs"
                                    id={`tag-expense-type-${inv.id}`}
                                    title="Expense Type: One-Time AI Credit Top-Up"
                                  >
                                    <Zap className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                                    <span>AI Credit Top-Up</span>
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-zinc-500">
                              <HighlightMatch text={inv.billingPeriod} query={invoiceFilter} />
                            </td>
                            <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400">
                              <HighlightMatch text={inv.paymentMethodName} query={invoiceFilter} />
                            </td>
                            {visibleColumns.transactionId && (
                              <td className="py-3 px-3 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                                <HighlightMatch text={inv.transactionId || `TXN_${inv.id}`} query={invoiceFilter} />
                              </td>
                            )}
                            {visibleColumns.billingAddress && (
                              <td className="py-3 px-3 text-[11px] text-zinc-500 max-w-xs truncate">
                                <HighlightMatch text={inv.billingAddress || 'Gulshan-2, Dhaka, Bangladesh'} query={invoiceFilter} />
                              </td>
                            )}
                            {visibleColumns.gatewayResponse && (
                              <td className="py-3 px-3 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                                <HighlightMatch text={inv.gatewayResponse || '200 OK / SUCCESS'} query={invoiceFilter} />
                              </td>
                            )}
                            <td className="py-3 px-3 relative">
                              {/* Amount Cell with 15% VAT & Subtotal Real-Time Breakdown Hover Tooltip */}
                              <div
                                className="inline-flex items-center gap-1 cursor-help font-bold text-zinc-900 dark:text-zinc-100 group relative"
                                onMouseEnter={() => setHoveredAmountInvoiceId(inv.id)}
                                onMouseLeave={() => setHoveredAmountInvoiceId(null)}
                                id={`cell-amount-${inv.id}`}
                              >
                                <span className="group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors underline decoration-dotted decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4">
                                  ৳{inv.amount.toLocaleString()}
                                </span>

                                {hoveredAmountInvoiceId === inv.id && (
                                  <div className="absolute left-0 top-full mt-2 z-50 w-64 p-3 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl text-white text-xs space-y-2 pointer-events-none animate-in fade-in zoom-in-95">
                                    <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                        15% VAT Breakdown
                                      </span>
                                      <span className="text-[10px] font-mono text-zinc-400">{inv.id}</span>
                                    </div>
                                    <div className="space-y-1 text-[11px]">
                                      <div className="flex justify-between">
                                        <span className="text-zinc-400">Base Subtotal:</span>
                                        <span className="font-semibold text-zinc-200">
                                          ৳{(inv.subtotal || Math.round(inv.amount / 1.15)).toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-emerald-400 font-semibold">
                                        <span>Statutory VAT (15%):</span>
                                        <span>
                                          ৳{(inv.tax || (inv.amount - Math.round(inv.amount / 1.15))).toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-xs font-bold border-t border-zinc-800 pt-1 text-white">
                                        <span>Total Settled:</span>
                                        <span className="text-red-400">৳{inv.amount.toLocaleString()}</span>
                                      </div>
                                    </div>
                                    <div className="text-[9px] text-zinc-400 pt-0.5 border-t border-zinc-800/80 flex items-center justify-between">
                                      <span>NBR Mushak 6.3</span>
                                      <span>BIN: 004928192-0101</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                            {/* Days Since Paid Column */}
                            <td className="py-3 px-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                  !isPaid
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                    : daysSincePaid === 0
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                    : daysSincePaid <= 14
                                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                                    : daysSincePaid <= 30
                                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                                    : 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20'
                                }`}
                                id={`badge-days-since-paid-${inv.id}`}
                                title={`Invoice issued ${daysSincePaid} days ago on ${invoiceDate.toLocaleDateString()}`}
                              >
                                <Clock className="w-2.5 h-2.5" />
                                <span>{daysSincePaid === 0 ? 'Today (0d)' : `${daysSincePaid}d ago`}</span>
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] border ${
                                (inv.status || 'paid').toLowerCase() === 'paid'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                  : (inv.status || '').toLowerCase() === 'pending'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                  : (inv.status || '').toLowerCase() === 'refunded'
                                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                              }`}>
                                {inv.status || 'PAID'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                {/* Embedded PDF Inspector / Row Expansion Button */}
                                <button
                                  type="button"
                                  onClick={() => setExpandedInvoiceId((prev) => (prev === inv.id ? null : inv.id))}
                                  className={`p-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                                    expandedInvoiceId === inv.id
                                      ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 shadow-2xs'
                                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-red-600 dark:hover:text-red-400'
                                  }`}
                                  title="Inspect Embedded Tax Invoice & PDF Document directly in table"
                                  id={`btn-expand-tax-preview-${inv.id}`}
                                >
                                  <Eye className="w-3.5 h-3.5 text-red-500" />
                                  <span className="text-[11px] font-bold">Inspect PDF</span>
                                  <ChevronDown
                                    className={`w-3 h-3 transition-transform duration-200 ${
                                      expandedInvoiceId === inv.id ? 'rotate-180 text-red-600' : 'text-zinc-400'
                                    }`}
                                  />
                                </button>

                                {/* QR Tax Verification Portal Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedNbrInvoice(inv);
                                    setIsNbrModalOpen(true);
                                  }}
                                  className="p-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Verify NBR Tax Portal Cryptographic Seal"
                                  id={`btn-qr-tax-${inv.id}`}
                                >
                                  <QrCode className="w-3.5 h-3.5" />
                                  <span className="text-[11px] font-bold">NBR QR</span>
                                </button>

                                {/* Send to Email Button */}
                                <button
                                  type="button"
                                  onClick={() => handleSendInvoiceEmail(inv)}
                                  disabled={sendingEmailId === inv.id}
                                  className="p-1.5 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Send invoice receipt to your registered email"
                                  id={`btn-email-invoice-${inv.id}`}
                                >
                                  {sendingEmailId === inv.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                                  ) : (
                                    <Mail className="w-3.5 h-3.5" />
                                  )}
                                  <span className="text-[11px]">Email</span>
                                </button>

                                {/* Row CSV Export Button */}
                                <button
                                  type="button"
                                  onClick={() => handleExportSingleInvoiceCSV(inv)}
                                  className="p-1.5 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Export this single invoice as CSV"
                                  id={`btn-export-csv-${inv.id}`}
                                >
                                  <FileSpreadsheet className="w-3.5 h-3.5" />
                                  <span className="text-[11px]">CSV</span>
                                </button>

                                {/* Download PDF Button */}
                                <button
                                  type="button"
                                  onClick={() => downloadInvoicePDF(inv)}
                                  className="p-1.5 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                                  title="Download PDF Invoice"
                                  id={`btn-download-invoice-${inv.id}`}
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>

                                {/* View Receipt Modal Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedInvoice(inv);
                                    setIsInvoiceModalOpen(true);
                                  }}
                                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 transition-colors cursor-pointer"
                                  id={`btn-view-invoice-${inv.id}`}
                                >
                                  View Receipt
                                </button>
                              </div>
                            </td>
                          </motion.tr>

                          {/* Embedded PDF Preview Row Expansion with Animated Entry/Exit */}
                          {expandedInvoiceId === inv.id && (
                            <motion.tr
                              key={`expansion-${inv.id}`}
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className="bg-zinc-50/90 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800"
                            >
                              <td
                                colSpan={8 + (visibleColumns.transactionId ? 1 : 0) + (visibleColumns.billingAddress ? 1 : 0) + (visibleColumns.gatewayResponse ? 1 : 0)}
                                className="p-3 sm:p-5"
                                id={`row-expansion-pdf-preview-${inv.id}`}
                              >
                                <EmbeddedInvoicePdfPreviewer
                                  invoice={inv}
                                  onClose={() => setExpandedInvoiceId(null)}
                                />
                              </td>
                            </motion.tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
          {/* Dynamic Mushak-6.3 Tax Invoice Live Preview Card */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <MushakTaxLivePreview />
          </div>
        </div>
      </div>

      {/* Bulk Refund Modal */}
      <BulkRefundModal
        isOpen={isBulkRefundModalOpen}
        onClose={() => setIsBulkRefundModalOpen(false)}
        selectedInvoices={selectedInvoicesList}
        onSuccess={handleBulkRefundSuccess}
      />

      {/* Live CSV Preview Modal */}
      <CsvPreviewModal
        isOpen={isCsvPreviewModalOpen}
        onClose={() => setIsCsvPreviewModalOpen(false)}
        invoices={csvPreviewInvoices}
        fileName={csvPreviewFileName}
      />
    </div>
  );
};
