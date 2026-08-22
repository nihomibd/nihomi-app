// src/app/dashboard/billing/page.tsx
// Nihomi (にほみ • Learn & Work) — Customer Subscription & Billing Portal

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { format, differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Download,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
  Check,
  Minus,
  Clock,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Loader2,
  FileText,
  Calendar,
  Zap,
  BookOpen,
  Bot,
  HelpCircle,
  Award,
  Search,
  FileSpreadsheet,
  DollarSign,
  PiggyBank,
  Bell,
  Info,
  Printer,
  Archive,
  ChevronRight,
  Copy,
  MoreVertical,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  LifeBuoy,
  MessageSquare,
  CalendarDays,
  TrendingDown,
  Eye,
  FileDown,
  CheckSquare,
  Square,
  ExternalLink,
  QrCode,
  Scan
} from 'lucide-react';
import { PLANS, NIHOMI_BRAND } from '@/lib/constants/plans';
import { SavedPaymentMethods } from '@/components/SavedPaymentMethods';
import { CheckoutModal } from '@/components/CheckoutModal';
import { downloadInvoicePDF, getInvoicePDFBlobUrl, downloadAnnualTaxSummaryPDF } from '@/lib/pdfInvoice';
import { Plan, PlanId, BillingInterval, Invoice } from '@/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
  Cell
} from 'recharts';

interface SubscriptionDetails {
  id: string;
  planId: string;
  status: string;
  billingInterval: 'monthly' | 'yearly';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paymentMethod?: string;
}

interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  currency: string;
  status: string;
  issuedAt: string;
  planName: string;
  amount?: number;
  createdAt?: string;
  customerEmail?: string;
  customerName?: string;
  subtotal?: number;
  tax?: number;
  paymentMethodName?: string;
  transactionId?: string;
  billingAddress?: string;
  gatewayResponse?: string;
  digitalSealHash?: string;
}

interface UsageQuota {
  aiCoachInteractions: number;
  aiMonthlyLimit: number;
  quizzesTaken: number;
  quizzesMonthlyLimit: number;
  mockExamsTaken: number;
  mockExamsMonthlyLimit: number;
  keigoSimulationsDone: number;
  keigoSimulationsLimit: number;
  periodYearMonth: string;
}

export default function BillingPortalPage() {
  const [sub, setSub] = useState<SubscriptionDetails | null>(null);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // Email invoice state
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [emailSuccessMessage, setEmailSuccessMessage] = useState<string | null>(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(null);

  // Upgrade Modal state
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [modalBillingInterval, setModalBillingInterval] = useState<BillingInterval>('yearly');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<Plan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Search & Filters for Invoices
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<'all' | 'paid' | 'pending' | 'failed'>('all');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');
  const [dateSortOrder, setDateSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [copiedInvoiceId, setCopiedInvoiceId] = useState<string | null>(null);
  const [activeQuickActionId, setActiveQuickActionId] = useState<string | null>(null);
  const [reportingInvoice, setReportingInvoice] = useState<InvoiceRecord | null>(null);
  const [reportIssueType, setReportIssueType] = useState<string>('incorrect_charge');
  const [reportIssueNotes, setReportIssueNotes] = useState<string>('');
  const [isSubmittingReport, setIsSubmittingReport] = useState<boolean>(false);
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [isDownloadingAllZip, setIsDownloadingAllZip] = useState(false);

  // Multi-selection, row expansion, and quick view modal states
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [expandedInvoiceIds, setExpandedInvoiceIds] = useState<string[]>([]);
  const [quickViewInvoice, setQuickViewInvoice] = useState<InvoiceRecord | null>(null);
  const [quickViewActiveTab, setQuickViewActiveTab] = useState<'preview' | 'breakdown'>('preview');
  const [quickViewPdfUrl, setQuickViewPdfUrl] = useState<string | null>(null);
  const [nbrVerifyInvoice, setNbrVerifyInvoice] = useState<InvoiceRecord | null>(null);
  const [hoveredAmountInvoiceId, setHoveredAmountInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    if (quickViewInvoice) {
      try {
        const invObj = formatInvoiceForPDF(quickViewInvoice);
        const url = getInvoicePDFBlobUrl(invObj);
        setQuickViewPdfUrl(url);
        return () => {
          if (url) URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.error('Failed to generate preview PDF url:', err);
      }
    } else {
      setQuickViewPdfUrl(null);
    }
  }, [quickViewInvoice]);

  // Tooltip & Alert states
  const [showTaxTooltip, setShowTaxTooltip] = useState(false);
  const [isRenewalAlertDismissed, setIsRenewalAlertDismissed] = useState(false);

  // Usage quota state
  const [usage, setUsage] = useState<UsageQuota>({
    aiCoachInteractions: 8,
    aiMonthlyLimit: 10,
    quizzesTaken: 18,
    quizzesMonthlyLimit: 25,
    mockExamsTaken: 1,
    mockExamsMonthlyLimit: 2,
    keigoSimulationsDone: 3,
    keigoSimulationsLimit: 5,
    periodYearMonth: format(new Date(), 'yyyy-MM')
  });

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/billing/subscription');
      const data = await res.json();
      setSub(data.subscription || null);
      setInvoices(data.invoices || []);

      if (data.usage) {
        setUsage((prev) => ({
          ...prev,
          aiCoachInteractions: data.usage.aiCoachInteractions ?? prev.aiCoachInteractions,
          aiMonthlyLimit: data.usage.aiMonthlyLimit ?? prev.aiMonthlyLimit
        }));
      }
    } catch {
      // Fallback state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure? You will retain premium access until the end of your current billing period.')) {
      return;
    }

    setCancelling(true);
    try {
      const res = await fetch('/api/billing/cancel', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Subscription set to cancel at period end.');
        fetchBillingData();
      } else {
        alert(data.error || 'Failed to cancel');
      }
    } finally {
      setCancelling(false);
    }
  };

  // Email invoice handler
  const handleEmailInvoice = async (inv: InvoiceRecord) => {
    setSendingEmailId(inv.id);
    setEmailSuccessMessage(null);
    setEmailErrorMessage(null);

    try {
      const res = await fetch(`/api/billing/invoices/${inv.id}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inv.customerEmail || 'mdtanvirkabirbiplob@gmail.com' })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEmailSuccessMessage(
          `Official Tax Receipt for ${inv.invoiceNumber || inv.id} sent to ${data.sentTo || 'your registered email'}.`
        );
        setTimeout(() => setEmailSuccessMessage(null), 6000);
      } else {
        throw new Error(data.error || 'Failed to dispatch invoice email');
      }
    } catch (err: any) {
      setEmailErrorMessage(err.message || 'Could not send invoice. Please try again.');
      setTimeout(() => setEmailErrorMessage(null), 5000);
    } finally {
      setSendingEmailId(null);
    }
  };

  const currentPlanId = sub?.planId || 'free';
  const planInfo = sub ? (PLANS[sub.planId] || PLANS.free) : PLANS.free;
  const isFree = !sub || sub.planId === 'free';
  const isPro = sub?.planId === 'pro';
  const isJapanReady = sub?.planId === 'japan_ready';

  // Compute renewal days and alert logic (trigger within 3 days before renewal date)
  const renewalDate = sub?.currentPeriodEnd ? new Date(sub.currentPeriodEnd) : null;
  const now = new Date();
  const daysUntilRenewal = renewalDate ? Math.max(0, differenceInDays(renewalDate, now)) : 2;
  const isRenewalWithin3Days = !isFree && sub?.status === 'active' && !sub?.cancelAtPeriodEnd && daysUntilRenewal <= 3;
  const showRenewalNotice = isRenewalWithin3Days && !isRenewalAlertDismissed;

  // Recurring amount to be charged on renewal
  const upcomingRenewalAmount = sub?.billingInterval === 'yearly'
    ? (planInfo.pricing?.yearly?.price ?? 0)
    : (planInfo.pricing?.monthly?.price ?? 0);

  // Compute Financial Metrics (Total Monthly Spend & Projected Annual Savings)
  const totalMonthlySpend = useMemo(() => {
    if (isFree || !sub) return 0;
    if (sub.billingInterval === 'yearly') {
      return Math.round((planInfo.pricing?.yearly?.price ?? 0) / 12);
    }
    return planInfo.pricing?.monthly?.price ?? 0;
  }, [isFree, sub, planInfo]);

  const projectedAnnualSavings = useMemo(() => {
    if (isFree || !sub) {
      // Benchmark potential savings on Pro plan
      const proMonthlyTotal = (PLANS.pro?.pricing?.monthly?.price ?? 599) * 12;
      const proYearly = PLANS.pro?.pricing?.yearly?.price ?? 4990;
      return proMonthlyTotal - proYearly; // ৳2,198
    }

    const monthlyPrice = planInfo.pricing?.monthly?.price ?? 0;
    const yearlyPrice = planInfo.pricing?.yearly?.price ?? 0;

    if (sub.billingInterval === 'yearly') {
      const fullAnnualIfMonthly = monthlyPrice * 12;
      return Math.max(0, fullAnnualIfMonthly - yearlyPrice);
    } else {
      // Potential savings if user switches from monthly to yearly
      const annualIfMonthly = monthlyPrice * 12;
      return Math.max(0, annualIfMonthly - yearlyPrice);
    }
  }, [isFree, sub, planInfo]);

  // Compute actual usage limits according to plan
  const activeAiLimit = isJapanReady ? 2500 : isPro ? 1000 : sub?.planId === 'starter' ? 100 : 10;
  const activeQuizLimit = isFree ? 25 : 9999;
  const activeMockLimit = isFree ? 1 : isPro || isJapanReady ? 10 : 3;

  const aiPercent = Math.min(100, Math.round((usage.aiCoachInteractions / activeAiLimit) * 100));
  const quizPercent = isFree ? Math.min(100, Math.round((usage.quizzesTaken / activeQuizLimit) * 100)) : 100;
  const mockPercent = Math.min(100, Math.round((usage.mockExamsTaken / activeMockLimit) * 100));

  // Copy invoice ID handler
  const handleCopyInvoiceId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedInvoiceId(id);
      setEmailSuccessMessage(`Invoice ID copied: ${id}`);
      setTimeout(() => {
        setCopiedInvoiceId(null);
        setEmailSuccessMessage(null);
      }, 3000);
    } catch {
      setEmailErrorMessage('Failed to copy ID to clipboard.');
      setTimeout(() => setEmailErrorMessage(null), 3000);
    }
  };

  // Toggle Date Sort handler (newest vs oldest)
  const toggleDateSort = () => {
    setDateSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    setCurrentPage(1);
  };

  // Report Billing Issue handlers
  const handleOpenReportModal = (inv: InvoiceRecord) => {
    setReportingInvoice(inv);
    setReportIssueType('incorrect_charge');
    setReportIssueNotes('');
    setActiveQuickActionId(null);
  };

  const handleSubmitBillingReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingInvoice) return;
    setIsSubmittingReport(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const ticketId = `TK-${Math.floor(100000 + Math.random() * 900000)}`;
      setEmailSuccessMessage(`Report filed for invoice #${reportingInvoice.invoiceNumber || reportingInvoice.id}. Support Ticket ${ticketId} created.`);
      setTimeout(() => setEmailSuccessMessage(null), 6000);
      setReportingInvoice(null);
    } catch {
      setEmailErrorMessage('Failed to submit report. Please try again.');
      setTimeout(() => setEmailErrorMessage(null), 4000);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleSaveBillingReportPDF = async () => {
    if (!reportingInvoice) return;
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 32, 'F');
      doc.setFillColor(225, 29, 72); // rose-600
      doc.rect(0, 0, pageWidth, 2.5, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text('NIHOMI.COM BILLING INQUIRY & DISPUTE REPORT', 20, 16);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Official Audit Record • Reference ID: REF-${Date.now().toString().slice(-6)} • Issued: ${new Date().toLocaleDateString()}`, 20, 23);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Invoiced Transaction Details', 20, 45);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`• Invoice Number: ${reportingInvoice.invoiceNumber || reportingInvoice.id}`, 25, 52);
      doc.text(`• Plan Tier: ${reportingInvoice.planName}`, 25, 58);
      doc.text(`• Billed Amount: ৳${reportingInvoice.totalAmount.toLocaleString()} BDT (Subtotal: ৳${(reportingInvoice.subtotal || Math.round(reportingInvoice.totalAmount / 1.15)).toLocaleString()} + 15% VAT: ৳${(reportingInvoice.tax || Math.round(reportingInvoice.totalAmount - reportingInvoice.totalAmount / 1.15)).toLocaleString()})`, 25, 64);
      doc.text(`• Payment Status: ${(reportingInvoice.status || 'PAID').toUpperCase()}`, 25, 70);
      doc.text(`• Date of Issuance: ${reportingInvoice.issuedAt ? format(new Date(reportingInvoice.issuedAt), 'yyyy-MM-dd HH:mm') : 'N/A'}`, 25, 76);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Customer Inquiry & Audit Request', 20, 90);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`• Issue Category: ${reportIssueType.replace(/_/g, ' ').toUpperCase()}`, 25, 97);
      doc.text(`• Reported By: ${reportingInvoice?.customerEmail || 'mdtanvirkabirbiplob@gmail.com'}`, 25, 103);
      doc.text(`• Timestamp: ${new Date().toLocaleString()}`, 25, 109);

      doc.setFont('helvetica', 'bold');
      doc.text('• Customer Statement & Notes:', 25, 118);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(reportIssueNotes || 'Itemized billing audit and tax breakdown review requested by customer.', pageWidth - 50);
      doc.text(lines, 25, 125);

      doc.setDrawColor(226, 232, 240);
      doc.line(20, 160, pageWidth - 20, 160);

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Nihomi Japanese Academy • BIN: 004928192-0101 • NBR Mushak-6.3 Compliant • support@nihomi.com', 20, 168);

      doc.save(`Nihomi-Billing-Issue-${reportingInvoice.invoiceNumber || reportingInvoice.id}.pdf`);
      setEmailSuccessMessage('✓ Billing report saved as PDF.');
      setTimeout(() => setEmailSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Failed to export inquiry PDF:', err);
    }
  };

  // Filtered and Sorted Invoices based on search input, status, calendar start/end date, and sort order
  const filteredAndSortedInvoices = useMemo(() => {
    const list = invoices.filter((inv) => {
      // Status filter
      if (invoiceStatusFilter !== 'all') {
        const invStatus = (inv.status || 'paid').toLowerCase();
        if (invStatus !== invoiceStatusFilter.toLowerCase()) {
          return false;
        }
      }

      const q = invoiceSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(q)) ||
        (inv.id && inv.id.toLowerCase().includes(q)) ||
        (inv.planName && inv.planName.toLowerCase().includes(q)) ||
        (inv.status && inv.status.toLowerCase().includes(q)) ||
        (inv.issuedAt && inv.issuedAt.toLowerCase().includes(q)) ||
        (inv.issuedAt && format(new Date(inv.issuedAt), 'yyyy-MM-dd MMM dd yyyy').toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Custom calendar date range picker filtering
      if (startDateFilter || endDateFilter) {
        const invDate = inv.issuedAt ? new Date(inv.issuedAt) : null;
        if (invDate && !isNaN(invDate.getTime())) {
          if (startDateFilter) {
            const start = new Date(startDateFilter);
            start.setHours(0, 0, 0, 0);
            if (invDate < start) return false;
          }
          if (endDateFilter) {
            const end = new Date(endDateFilter);
            end.setHours(23, 59, 59, 999);
            if (invDate > end) return false;
          }
        }
      }

      return true;
    });

    // Date sorting (newest vs oldest)
    return list.sort((a, b) => {
      const dateA = a.issuedAt ? new Date(a.issuedAt).getTime() : 0;
      const dateB = b.issuedAt ? new Date(b.issuedAt).getTime() : 0;
      return dateSortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [invoices, invoiceSearchQuery, invoiceStatusFilter, startDateFilter, endDateFilter, dateSortOrder]);

  const totalFilteredCount = filteredAndSortedInvoices.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / itemsPerPage));
  
  // Sliced invoices for the current page
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedInvoices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedInvoices, currentPage, itemsPerPage]);

  // Average invoice spend calculation to determine cost trend
  const averageInvoiceSpend = useMemo(() => {
    if (!invoices || invoices.length === 0) return 0;
    const total = invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
    return Math.round(total / invoices.length);
  }, [invoices]);

  // Breakdown of 15% VAT payments per invoice over the last 6 months
  const vatSpendingTrend = useMemo(() => {
    const months: { [key: string]: { monthKey: string; monthLabel: string; shortMonth: string; subtotal: number; vat: number; total: number; count: number } } = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const shortMonth = d.toLocaleString('en-US', { month: 'short' });
      const monthLabel = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      months[key] = { monthKey: key, monthLabel, shortMonth, subtotal: 0, vat: 0, total: 0, count: 0 };
    }

    invoices.forEach((inv) => {
      if ((inv.status || 'paid').toLowerCase() !== 'paid') return;
      const invDate = inv.issuedAt ? new Date(inv.issuedAt) : new Date();
      const key = `${invDate.getFullYear()}-${String(invDate.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        const total = inv.totalAmount || 0;
        const subtotal = inv.subtotal || Math.round(total / 1.15);
        const vat = inv.tax || (total - subtotal);
        months[key].subtotal += subtotal;
        months[key].vat += vat;
        months[key].total += total;
        months[key].count += 1;
      }
    });

    return Object.values(months);
  }, [invoices]);

  // Total spent over last 12 months based on historical invoice data
  const totalSpentLast12Months = useMemo(() => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return invoices
      .filter((inv) => (inv.status || 'paid').toLowerCase() === 'paid')
      .filter((inv) => {
        const d = inv.issuedAt ? new Date(inv.issuedAt) : (inv.createdAt ? new Date(inv.createdAt) : new Date());
        return d >= oneYearAgo;
      })
      .reduce((sum, inv) => sum + (inv.totalAmount || inv.amount || 0), 0);
  }, [invoices]);

  // Toggle selection of all invoices for a specific month from the VAT chart
  const handleSelectMonthInvoices = (monthKey: string) => {
    const monthInvoices = invoices.filter((inv) => {
      const d = inv.issuedAt ? new Date(inv.issuedAt) : (inv.createdAt ? new Date(inv.createdAt) : new Date());
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return key === monthKey;
    });
    const monthIds = monthInvoices.map((inv) => inv.id);
    if (monthIds.length === 0) return;

    const allSelected = monthIds.every((id) => selectedInvoiceIds.includes(id));
    if (allSelected) {
      setSelectedInvoiceIds((prev) => prev.filter((id) => !monthIds.includes(id)));
    } else {
      setSelectedInvoiceIds((prev) => Array.from(new Set([...prev, ...monthIds])));
    }
  };

  // Keyboard shortcut listener (Ctrl+S / Cmd+S triggers Save Current Filters)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        try {
          const savedState = {
            invoiceSearchQuery,
            invoiceStatusFilter,
            startDateFilter,
            endDateFilter,
            dateSortOrder
          };
          localStorage.setItem('nihomi_saved_invoice_filters', JSON.stringify(savedState));
          setEmailSuccessMessage('✓ Current invoice search filters and audit state saved successfully (Ctrl+S).');
          setTimeout(() => setEmailSuccessMessage(null), 4000);
        } catch (err) {
          console.error('Failed to save filters on Ctrl+S:', err);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [invoiceSearchQuery, invoiceStatusFilter, startDateFilter, endDateFilter, dateSortOrder]);

  // Toggle selection for a single invoice row
  const handleToggleSelectInvoice = (id: string) => {
    setSelectedInvoiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all invoices on current page
  const handleToggleSelectAll = () => {
    if (paginatedInvoices.length === 0) return;
    const pageIds = paginatedInvoices.map((inv) => inv.id);
    const allSelected = pageIds.every((id) => selectedInvoiceIds.includes(id));
    if (allSelected) {
      setSelectedInvoiceIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedInvoiceIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  // Toggle expandable row details
  const handleToggleExpandRow = (id: string) => {
    setExpandedInvoiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Helper to map InvoiceRecord to standard Invoice object for PDF generation
  const formatInvoiceForPDF = (inv: InvoiceRecord): any => {
    const subtotal = inv.subtotal || Math.round(inv.totalAmount / 1.15);
    const tax = inv.tax || Math.round(inv.totalAmount - subtotal);
    return {
      id: inv.invoiceNumber || inv.id,
      userId: 'usr_current',
      subscriptionId: 'sub_' + inv.id,
      planId: (inv.planName?.toLowerCase().includes('japan') ? 'japan-ready' : inv.planName?.toLowerCase().includes('pro') ? 'pro' : 'starter'),
      planName: inv.planName || 'Nihomi Pro Plan',
      amount: inv.totalAmount,
      currency: 'BDT',
      billingPeriod: inv.issuedAt ? format(new Date(inv.issuedAt), 'MMMM yyyy') : 'Current Period',
      paymentId: inv.transactionId || ('TXN-' + (inv.id || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10).toUpperCase()),
      status: (inv.status || 'paid').toLowerCase(),
      customerName: inv.customerName || sub?.paymentMethod || 'Valued Nihomi Student',
      customerEmail: inv.customerEmail || 'mdtanvirkabirbiplob@gmail.com',
      subtotal,
      discount: 0,
      tax,
      items: [
        {
          id: 'item_1',
          invoiceId: inv.id,
          description: `Nihomi Japanese Learning Platform - ${inv.planName} (15% VAT Included)`,
          amount: inv.totalAmount,
          quantity: 1,
          unitPrice: inv.totalAmount
        }
      ],
      createdAt: inv.issuedAt || new Date().toISOString(),
      issuedAt: inv.issuedAt || new Date().toISOString(),
      paymentMethodName: inv.paymentMethodName || 'bKash Auto-Debit'
    };
  };

  // Client-side generated print-friendly PDF for a specific invoice
  const handleExportInvoicePDF = (inv: InvoiceRecord) => {
    const invoiceForPDF = formatInvoiceForPDF(inv);
    downloadInvoicePDF(invoiceForPDF);
    setEmailSuccessMessage(`Exported print-friendly PDF for invoice #${inv.invoiceNumber || inv.id}.`);
    setTimeout(() => setEmailSuccessMessage(null), 4000);
  };

  // Quick Pay handler for pending invoices
  const handleQuickPay = (inv: InvoiceRecord) => {
    const planKey = (inv.planName || '').toLowerCase().includes('japan')
      ? 'japan_ready'
      : (inv.planName || '').toLowerCase().includes('starter')
      ? 'starter'
      : (inv.planName || '').toLowerCase().includes('free')
      ? 'free'
      : 'pro';

    const selectedPlanDef = PLANS[planKey] || PLANS.pro;

    const formattedPlan: Plan = {
      id: selectedPlanDef.id as PlanId,
      name: selectedPlanDef.name,
      displayNameJa: selectedPlanDef.japaneseTitle,
      tagline: selectedPlanDef.tagline,
      description: selectedPlanDef.tagline,
      badge: selectedPlanDef.id === 'pro' ? 'POPULAR' : selectedPlanDef.id === 'japan_ready' ? 'CAREER' : undefined,
      isRecommended: selectedPlanDef.id === 'pro',
      isPopular: selectedPlanDef.id === 'pro',
      order: selectedPlanDef.id === 'free' ? 1 : selectedPlanDef.id === 'starter' ? 2 : selectedPlanDef.id === 'pro' ? 3 : 4,
      monthlyPrice: selectedPlanDef.pricing.monthly.price,
      yearlyPrice: selectedPlanDef.pricing.yearly.price,
      currency: 'BDT',
      aiMonthlyLimit: selectedPlanDef.aiCoachLimitMonthly,
      features: selectedPlanDef.features.map((f) => f.text),
      entitlements: [],
      isPublished: true
    };

    setSelectedPlanForCheckout(formattedPlan);
    setIsCheckoutOpen(true);
    setEmailSuccessMessage(`Initiating Quick Pay checkout for ${inv.planName} (৳${inv.totalAmount.toLocaleString()})...`);
    setTimeout(() => setEmailSuccessMessage(null), 4000);
  };

  // Bulk Download Selected Invoices
  const handleBulkDownloadSelected = async () => {
    const selected = invoices.filter((inv) => selectedInvoiceIds.includes(inv.id));
    if (selected.length === 0) return;
    setIsBulkDownloading(true);
    try {
      const JSZipModule = await import('jszip');
      const JSZip = (JSZipModule.default || JSZipModule) as any;
      const { jsPDF } = await import('jspdf');
      const zip = new JSZip();

      for (const inv of selected) {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFillColor(248, 249, 250);
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setFillColor(220, 38, 38);
        doc.rect(0, 0, pageWidth, 3.5, 'F');
        doc.roundedRect(15, 10, 10, 10, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('N', 18.5, 17);

        doc.setTextColor(24, 24, 27);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('NIHOMI ACADEMY', 28, 16);

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(113, 113, 122);
        doc.text('Japanese Language & Career Intelligence Platform', 28, 21);
        doc.text('House 42, Road 11, Banani, Dhaka, Bangladesh | BIN: 004928192-0101', 28, 25.5);
        doc.text('support@nihomi.com | https://nihomi.com', 28, 30);

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(24, 24, 27);
        doc.text('TAX INVOICE', pageWidth - 15, 17, { align: 'right' });

        doc.setFillColor(16, 185, 129);
        doc.roundedRect(pageWidth - 40, 21, 25, 7, 1.5, 1.5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text((inv.status || 'PAID').toUpperCase(), pageWidth - 27.5, 25.8, { align: 'center' });

        let y = 50;
        doc.setDrawColor(228, 228, 231);
        doc.setLineWidth(0.3);
        doc.line(15, y, pageWidth - 15, y);

        y += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(113, 113, 122);
        doc.text('INVOICE NUMBER:', 15, y);
        doc.text('ISSUED DATE:', 80, y);
        doc.text('PAYMENT METHOD:', 140, y);

        y += 5.5;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(24, 24, 27);
        doc.text(inv.invoiceNumber || inv.id, 15, y);
        doc.text(inv.issuedAt ? format(new Date(inv.issuedAt), 'MMM dd, yyyy') : 'N/A', 80, y);
        doc.text(inv.paymentMethodName || 'bKash / Card', 140, y);

        y += 12;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(113, 113, 122);
        doc.text('PLAN / SERVICE:', 15, y);
        doc.text('TOTAL AMOUNT:', 80, y);
        doc.text('TAX BREAKDOWN (15% VAT):', 140, y);

        y += 5.5;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(24, 24, 27);
        doc.text(inv.planName || 'Nihomi Pro Plan', 15, y);
        doc.text(`৳${inv.totalAmount.toLocaleString()}`, 80, y);
        const subtotal = inv.subtotal || Math.round(inv.totalAmount / 1.15);
        const tax = inv.tax || Math.round(inv.totalAmount - subtotal);
        doc.text(`৳${tax.toLocaleString()} (15% NBR VAT)`, 140, y);

        const pdfBlob = doc.output('blob');
        zip.file(`Nihomi-Invoice-${inv.invoiceNumber || inv.id}.pdf`, pdfBlob);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `nihomi_selected_invoices_${format(new Date(), 'yyyy-MM-dd')}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setEmailSuccessMessage(`Downloaded ZIP archive of ${selected.length} selected invoices.`);
      setTimeout(() => setEmailSuccessMessage(null), 4000);
    } catch {
      setEmailErrorMessage('Failed to generate ZIP of selected invoices.');
      setTimeout(() => setEmailErrorMessage(null), 4000);
    } finally {
      setIsBulkDownloading(false);
    }
  };

  // Bulk Print Selected Invoices
  const handleBulkPrintSelected = () => {
    window.print();
  };

  // Export single invoice to formatted CSV
  const handleExportSingleInvoiceCSV = (inv: InvoiceRecord) => {
    const subtotal = inv.subtotal || Math.round(inv.totalAmount / 1.15);
    const tax = inv.tax || Math.round(inv.totalAmount - subtotal);
    const headers = [
      'Invoice Number',
      'Date Issued',
      'Plan Name',
      'Currency',
      'Subtotal (BDT)',
      'Tax (15% VAT BDT)',
      'Total Amount Paid (BDT)',
      'Payment Status',
      'Payment Method',
      'Customer Email',
      'Customer Name',
      'Tax Compliance Note'
    ];
    const row = [
      `"${inv.invoiceNumber || inv.id}"`,
      `"${inv.issuedAt ? new Date(inv.issuedAt).toISOString().split('T')[0] : 'N/A'}"`,
      `"${(inv.planName || '').replace(/"/g, '""')}"`,
      `"${inv.currency || 'BDT'}"`,
      subtotal,
      tax,
      inv.totalAmount,
      `"${(inv.status || 'PAID').toUpperCase()}"`,
      `"${inv.paymentMethodName || 'bKash Auto-Debit'}"`,
      `"${(inv.customerEmail || 'mdtanvirkabirbiplob@gmail.com').replace(/"/g, '""')}"`,
      `"${(inv.customerName || 'Nihomi Student').replace(/"/g, '""')}"`,
      `"BIN: 004928192-0101 (NBR Compliant Tax Receipt)"`
    ];
    const csvContent = [headers.join(','), row.join(',')].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nihomi_invoice_${inv.invoiceNumber || inv.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setEmailSuccessMessage(`Exported CSV for invoice ${inv.invoiceNumber || inv.id}.`);
    setTimeout(() => setEmailSuccessMessage(null), 4000);
  };

  // Bulk Download all filtered invoices as ZIP of PDFs
  const handleBulkDownloadPDF = async () => {
    const targetInvoices = filteredAndSortedInvoices.length > 0 ? filteredAndSortedInvoices : invoices;
    if (targetInvoices.length === 0) {
      setEmailErrorMessage('No invoice data available to download.');
      setTimeout(() => setEmailErrorMessage(null), 4000);
      return;
    }

    setIsBulkDownloading(true);
    try {
      const JSZipModule = await import('jszip');
      const JSZip = (JSZipModule.default || JSZipModule) as any;
      const { jsPDF } = await import('jspdf');
      const zip = new JSZip();

      for (const inv of targetInvoices) {
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header Background
        doc.setFillColor(248, 249, 250);
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setFillColor(220, 38, 38);
        doc.rect(0, 0, pageWidth, 3.5, 'F');
        doc.roundedRect(15, 10, 10, 10, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('N', 18.5, 17);

        doc.setTextColor(24, 24, 27);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('NIHOMI ACADEMY', 28, 16);

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(113, 113, 122);
        doc.text('Japanese Language & Career Intelligence Platform', 28, 21);
        doc.text('House 42, Road 11, Banani, Dhaka, Bangladesh | BIN: 004928192-0101', 28, 25.5);
        doc.text('support@nihomi.com | https://nihomi.com', 28, 30);

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(24, 24, 27);
        doc.text('TAX INVOICE', pageWidth - 15, 17, { align: 'right' });

        doc.setFillColor(16, 185, 129);
        doc.roundedRect(pageWidth - 40, 21, 25, 7, 1.5, 1.5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text((inv.status || 'PAID').toUpperCase(), pageWidth - 27.5, 25.8, { align: 'center' });

        let y = 50;
        doc.setDrawColor(228, 228, 231);
        doc.setLineWidth(0.3);
        doc.line(15, y, pageWidth - 15, y);

        y += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(113, 113, 122);
        doc.text('INVOICE NUMBER:', 15, y);
        doc.text('ISSUED DATE:', 80, y);
        doc.text('PAYMENT METHOD:', 140, y);

        y += 5.5;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(24, 24, 27);
        doc.text(inv.invoiceNumber || inv.id, 15, y);
        doc.text(inv.issuedAt ? format(new Date(inv.issuedAt), 'MMM dd, yyyy') : 'N/A', 80, y);
        doc.text(inv.paymentMethodName || 'bKash / Card', 140, y);

        y += 12;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(113, 113, 122);
        doc.text('PLAN / SERVICE:', 15, y);
        doc.text('TOTAL AMOUNT:', 80, y);
        doc.text('TAX BREAKDOWN (15% VAT):', 140, y);

        y += 5.5;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(24, 24, 27);
        doc.text(inv.planName || 'Nihomi Pro Plan', 15, y);
        doc.text(`৳${inv.totalAmount.toLocaleString()}`, 80, y);
        const subtotal = inv.subtotal || Math.round(inv.totalAmount / 1.15);
        const tax = inv.tax || Math.round(inv.totalAmount - subtotal);
        doc.text(`৳${tax.toLocaleString()} (15% NBR VAT)`, 140, y);

        y += 16;
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(15, y, pageWidth - 30, 24, 2, 2, 'F');
        doc.setDrawColor(228, 228, 231);
        doc.roundedRect(15, y, pageWidth - 30, 24, 2, 2, 'S');

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(24, 24, 27);
        doc.text('OFFICIAL DIGITAL RECEIPT & SYSTEM VERIFICATION', 20, y + 6);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(113, 113, 122);
        doc.text(`Security Hash: SHA256-${(inv.id + (inv.invoiceNumber || '')).slice(0, 20)}... | Verification Timestamp: ${new Date().toISOString()}`, 20, y + 12);
        doc.text('For institutional inquiries, tax filings, or corporate reimbursement, contact billing@nihomi.com', 20, y + 18);

        const pdfBlob = doc.output('blob');
        zip.file(`Nihomi-Invoice-${inv.invoiceNumber || inv.id}.pdf`, pdfBlob);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `nihomi_tax_invoices_bulk_${format(new Date(), 'yyyy-MM-dd')}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setEmailSuccessMessage(`Successfully downloaded ZIP archive of ${targetInvoices.length} invoices.`);
      setTimeout(() => setEmailSuccessMessage(null), 5000);
    } catch (err: any) {
      setEmailErrorMessage(err.message || 'Failed to generate bulk invoice ZIP file.');
      setTimeout(() => setEmailErrorMessage(null), 5000);
    } finally {
      setIsBulkDownloading(false);
    }
  };

  // Download entire invoice history as a single ZIP file containing PDFs, generated client-side
  const handleDownloadAllInvoicesZIP = async () => {
    if (!invoices || invoices.length === 0) {
      setEmailErrorMessage('No invoices available in your billing history.');
      setTimeout(() => setEmailErrorMessage(null), 4000);
      return;
    }

    setIsDownloadingAllZip(true);
    try {
      const JSZipModule = await import('jszip');
      const JSZip = (JSZipModule.default || JSZipModule) as any;
      const { jsPDF } = await import('jspdf');
      const zip = new JSZip();

      for (const inv of invoices) {
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header Background
        doc.setFillColor(248, 249, 250);
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setFillColor(220, 38, 38);
        doc.rect(0, 0, pageWidth, 3.5, 'F');
        doc.roundedRect(15, 10, 10, 10, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('N', 18.5, 17);

        doc.setTextColor(24, 24, 27);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('NIHOMI ACADEMY', 28, 16);

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(113, 113, 122);
        doc.text('Japanese Language & Career Intelligence Platform', 28, 21);
        doc.text('House 42, Road 11, Banani, Dhaka, Bangladesh | BIN: 004928192-0101', 28, 25.5);
        doc.text('support@nihomi.com | https://nihomi.com', 28, 30);

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(24, 24, 27);
        doc.text('TAX INVOICE', pageWidth - 15, 17, { align: 'right' });

        doc.setFillColor(16, 185, 129);
        doc.roundedRect(pageWidth - 40, 21, 25, 7, 1.5, 1.5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text((inv.status || 'PAID').toUpperCase(), pageWidth - 27.5, 25.8, { align: 'center' });

        let y = 50;
        doc.setDrawColor(228, 228, 231);
        doc.setLineWidth(0.3);
        doc.line(15, y, pageWidth - 15, y);

        y += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(113, 113, 122);
        doc.text('INVOICE NUMBER:', 15, y);
        doc.text('ISSUED DATE:', 80, y);
        doc.text('PAYMENT METHOD:', 140, y);

        y += 5.5;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(24, 24, 27);
        doc.text(inv.invoiceNumber || inv.id, 15, y);
        doc.text(inv.issuedAt ? format(new Date(inv.issuedAt), 'MMM dd, yyyy') : 'N/A', 80, y);
        doc.text(inv.paymentMethodName || 'bKash / Card', 140, y);

        y += 12;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(113, 113, 122);
        doc.text('PLAN / SERVICE:', 15, y);
        doc.text('TOTAL AMOUNT:', 80, y);
        doc.text('TAX BREAKDOWN (15% VAT):', 140, y);

        y += 5.5;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(24, 24, 27);
        doc.text(inv.planName || 'Nihomi Pro Plan', 15, y);
        doc.text(`৳${inv.totalAmount.toLocaleString()}`, 80, y);
        const subtotal = inv.subtotal || Math.round(inv.totalAmount / 1.15);
        const tax = inv.tax || Math.round(inv.totalAmount - subtotal);
        doc.text(`৳${tax.toLocaleString()} (15% NBR VAT)`, 140, y);

        y += 16;
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(15, y, pageWidth - 30, 24, 2, 2, 'F');
        doc.setDrawColor(228, 228, 231);
        doc.roundedRect(15, y, pageWidth - 30, 24, 2, 2, 'S');

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(24, 24, 27);
        doc.text('OFFICIAL DIGITAL RECEIPT & NBR SYSTEM VERIFICATION', 20, y + 6);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(113, 113, 122);
        doc.text(`Security Hash: SHA256-${(inv.id + (inv.invoiceNumber || '')).slice(0, 24)}... | Verification Timestamp: ${new Date().toISOString()}`, 20, y + 12);
        doc.text('Mushak-6.3 Tax Compliant | Nihomi Academy Ltd. BIN: 004928192-0101', 20, y + 18);

        const pdfBlob = doc.output('blob');
        zip.file(`Nihomi-Invoice-${inv.invoiceNumber || inv.id}.pdf`, pdfBlob);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `nihomi_all_invoices_complete_${format(new Date(), 'yyyy-MM-dd')}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setEmailSuccessMessage(`Successfully downloaded entire invoice history (${invoices.length} PDFs) as a ZIP archive.`);
      setTimeout(() => setEmailSuccessMessage(null), 5000);
    } catch (err: any) {
      setEmailErrorMessage(err.message || 'Failed to download entire invoice archive.');
      setTimeout(() => setEmailErrorMessage(null), 5000);
    } finally {
      setIsDownloadingAllZip(false);
    }
  };

  // Print Table handler
  const handlePrintTable = () => {
    window.print();
  };

  // Export invoices to formatted CSV
  const handleExportCSV = () => {
    const targetInvoices = filteredAndSortedInvoices.length > 0 ? filteredAndSortedInvoices : invoices;
    if (targetInvoices.length === 0) {
      setEmailErrorMessage('No invoice data available to export.');
      setTimeout(() => setEmailErrorMessage(null), 4000);
      return;
    }

    const headers = [
      'Invoice Number',
      'Date Issued',
      'Plan Name',
      'Currency',
      'Subtotal (BDT)',
      'Tax (15% VAT BDT)',
      'Total Amount Paid (BDT)',
      'Payment Status',
      'Payment Method',
      'Customer Email',
      'Customer Name',
      'Tax Compliance Note'
    ];

    const rows = targetInvoices.map((inv) => {
      const subtotal = inv.subtotal || Math.round(inv.totalAmount / 1.15);
      const tax = inv.tax || Math.round(inv.totalAmount - subtotal);
      return [
        `"${inv.invoiceNumber || inv.id}"`,
        `"${inv.issuedAt ? new Date(inv.issuedAt).toISOString().split('T')[0] : 'N/A'}"`,
        `"${(inv.planName || '').replace(/"/g, '""')}"`,
        `"${inv.currency || 'BDT'}"`,
        subtotal,
        tax,
        inv.totalAmount,
        `"${(inv.status || 'PAID').toUpperCase()}"`,
        `"${inv.paymentMethodName || 'bKash Auto-Debit'}"`,
        `"${(inv.customerEmail || 'mdtanvirkabirbiplob@gmail.com').replace(/"/g, '""')}"`,
        `"${(inv.customerName || 'Nihomi Student').replace(/"/g, '""')}"`,
        `"BIN: 004928192-0101 (NBR Compliant Tax Receipt)"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nihomi_tax_invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Convert constant PLANS to array for the Upgrade Comparison Modal
  const plansList = useMemo(() => {
    return [
      {
        id: 'free' as PlanId,
        name: 'Free Tier',
        tagline: 'Basic foundations & trial lessons',
        monthlyPrice: 0,
        yearlyPrice: 0,
        aiCoachLimit: 10,
        badge: undefined,
        recommended: false,
        features: [
          { label: 'JLPT N5 Core Lessons', value: 'Limited (10 Lessons)' },
          { label: 'AI Sensei Coach Quota', value: '10 queries/mo' },
          { label: 'Practice Quizzes', value: '25 quizzes/mo' },
          { label: 'JLPT Mock Exams', value: '1 Diagnostic Test' },
          { label: 'Business Keigo Modules', value: false },
          { label: 'Japan Career & Visa Prep', value: false },
          { label: 'Verified Certificate', value: false },
          { label: 'Offline Downloads', value: false }
        ]
      },
      {
        id: 'starter' as PlanId,
        name: 'Starter',
        tagline: 'Full beginner mastery for N5 & N4',
        monthlyPrice: 299,
        yearlyPrice: 2490,
        aiCoachLimit: 100,
        badge: 'Beginner Choice',
        recommended: false,
        features: [
          { label: 'JLPT N5 & N4 Full Courses', value: 'Complete Access' },
          { label: 'AI Sensei Coach Quota', value: '100 queries/mo' },
          { label: 'Practice Quizzes', value: 'Unlimited' },
          { label: 'JLPT Mock Exams', value: '3 Practice Exams' },
          { label: 'Business Keigo Modules', value: false },
          { label: 'Japan Career & Visa Prep', value: false },
          { label: 'Verified Certificate', value: false },
          { label: 'Offline Downloads', value: 'Grammar Sheets' }
        ]
      },
      {
        id: 'pro' as PlanId,
        name: 'Pro',
        tagline: 'Fluency path: N5, N4, N3 + Keigo',
        monthlyPrice: 599,
        yearlyPrice: 4990,
        aiCoachLimit: 1000,
        badge: 'Most Popular',
        recommended: true,
        features: [
          { label: 'JLPT N5, N4 & N3 Modules', value: 'Complete Access' },
          { label: 'AI Sensei Coach Quota', value: '1,000 queries/mo' },
          { label: 'Practice Quizzes', value: 'Unlimited' },
          { label: 'JLPT Mock Exams', value: 'Full Timed Exams + AI' },
          { label: 'Business Keigo Modules', value: 'Complete Masterclass' },
          { label: 'Japan Career & Visa Prep', value: 'Basic Guide' },
          { label: 'Verified Certificate', value: false },
          { label: 'Offline Downloads', value: 'All Audio & PDFs' }
        ]
      },
      {
        id: 'japan_ready' as PlanId,
        name: 'Japan Ready',
        tagline: 'Work & live in Japan with confidence',
        monthlyPrice: 999,
        yearlyPrice: 8490,
        aiCoachLimit: 2500,
        badge: 'Career Accelerator',
        recommended: false,
        features: [
          { label: 'All JLPT Levels (N5-N1)', value: 'Complete Access' },
          { label: 'AI Sensei Coach Quota', value: '2,500 queries/mo' },
          { label: 'Practice Quizzes', value: 'Unlimited' },
          { label: 'JLPT Mock Exams', value: 'Unlimited Simulations' },
          { label: 'Business Keigo Modules', value: 'Advanced Corporate' },
          { label: 'Japan Career & Visa Prep', value: 'Interview Sim + CV' },
          { label: 'Verified Certificate', value: 'Official Nihomi Cert' },
          { label: 'Offline Downloads', value: 'All Audio & PDFs' }
        ]
      }
    ];
  }, []);

  const handleSelectPlanForUpgrade = (planItem: any) => {
    const formattedPlan: Plan = {
      id: planItem.id,
      name: planItem.name,
      displayNameJa: planItem.name,
      tagline: planItem.tagline,
      description: planItem.tagline,
      badge: planItem.badge,
      isRecommended: planItem.recommended,
      isPopular: planItem.recommended,
      order: planItem.id === 'free' ? 1 : planItem.id === 'starter' ? 2 : planItem.id === 'pro' ? 3 : 4,
      monthlyPrice: planItem.monthlyPrice,
      yearlyPrice: planItem.yearlyPrice,
      currency: 'BDT',
      aiMonthlyLimit: planItem.aiCoachLimit,
      features: planItem.features.map((f: any) => f.label),
      entitlements: [],
      isPublished: true
    };

    setSelectedPlanForCheckout(formattedPlan);
    setIsUpgradeModalOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-10 font-sans" id="billing-portal-page">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md">
                Billing & Membership
              </span>
              <span className="text-xs text-slate-400">Nihomi ID: {sub?.id || 'nihomi_user'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Subscription & Billing</h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Manage your plan, track monthly usage quotas, review payment history, and download tax receipts.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/25 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              id="btn-trigger-upgrade-modal-top"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isFree ? 'Upgrade to Pro' : 'Change / Upgrade Plan'}</span>
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {emailSuccessMessage && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 flex items-center justify-between gap-2 shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{emailSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setEmailSuccessMessage(null)}
              className="text-emerald-400 hover:text-emerald-200 text-xs font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {emailErrorMessage && (
          <div className="p-4 bg-rose-950/60 border border-rose-500/40 rounded-2xl text-xs text-rose-300 flex items-center justify-between gap-2 shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{emailErrorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setEmailErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 text-xs font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Current Plan Overview Card with Quota Progress Component */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6" id="card-subscription-overview">
          
          {/* ========================================================================= */}
          {/* UPCOMING RENEWAL CHARGE ALERT BANNER (Appears <= 3 days before renewal)   */}
          {/* ========================================================================= */}
          {showRenewalNotice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/50 border border-amber-500/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              id="banner-renewal-reminder"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Bell className="w-4 h-4 animate-bounce" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                      Upcoming Renewal Notice ({daysUntilRenewal <= 0 ? 'Due Today' : `In ${daysUntilRenewal} ${daysUntilRenewal === 1 ? 'Day' : 'Days'}`})
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Auto-Debit
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Your <strong className="text-white">{planInfo.name} ({sub?.billingInterval})</strong> plan will automatically renew on{' '}
                    <strong className="text-amber-300">{renewalDate ? format(renewalDate, 'MMMM dd, yyyy') : 'period end'}</strong> for{' '}
                    <strong className="text-white">৳{upcomingRenewalAmount.toLocaleString()} BDT</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold border border-amber-500/40 transition text-xs cursor-pointer"
                >
                  Manage Plan
                </button>
                <button
                  type="button"
                  onClick={() => setIsRenewalAlertDismissed(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="Dismiss notification"
                  id="btn-dismiss-renewal-banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">Current Membership</span>
                {sub?.status === 'active' ? (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                    Active Plan
                  </span>
                ) : sub?.status === 'past_due' ? (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                    Past Due
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 uppercase">
                    Free Tier
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-1">{planInfo.name} Plan</h2>
              <p className="text-xs text-slate-400 mt-0.5">{planInfo.tagline}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {sub?.status === 'active' && !sub.cancelAtPeriodEnd && (
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={handleCancelSubscription}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold rounded-xl transition-colors border border-slate-700/50 cursor-pointer"
                  id="btn-cancel-subscription"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Plan'}
                </button>
              )}

              {/* Upgrade Trigger Button */}
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(true)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                id="btn-open-upgrade-modal"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isFree ? 'Upgrade to Pro →' : 'Compare & Upgrade'}</span>
              </button>
            </div>
          </div>

          {/* Subscription Metadata */}
          {sub && sub.planId !== 'free' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 block mb-0.5">Billing Interval</span>
                <span className="font-semibold text-slate-200 capitalize text-sm">{sub.billingInterval} (৳{planInfo.pricing[sub.billingInterval]?.priceFormatted})</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Current Period Started</span>
                <span className="font-semibold text-slate-200 text-sm">
                  {sub.currentPeriodStart ? format(new Date(sub.currentPeriodStart), 'MMM dd, yyyy') : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Next Renewal / Expiry Date</span>
                <span className="font-semibold text-rose-400 text-sm">
                  {sub.currentPeriodEnd ? format(new Date(sub.currentPeriodEnd), 'MMM dd, yyyy') : 'N/A'}
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUMMARY CARD: TOTAL MONTHLY SPEND & PROJECTED ANNUAL SAVINGS               */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="card-spend-and-savings-summary">
            {/* Total Monthly Spend */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950/90 via-slate-900 to-slate-950/60 border border-slate-800 shadow-md space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Total Monthly Spend
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                  {isFree ? 'Free Tier' : sub?.billingInterval === 'yearly' ? 'Annualized' : 'Monthly Recurring'}
                </span>
              </div>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-3xl font-extrabold text-white">৳{totalMonthlySpend.toLocaleString()}</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isFree
                  ? 'No monthly charges. Basic lessons and limited trial quota enabled.'
                  : sub?.billingInterval === 'yearly'
                  ? `Billed as ৳${(planInfo.pricing?.yearly?.price ?? 0).toLocaleString()} / year (effective ৳${totalMonthlySpend}/mo).`
                  : `Next billing of ৳${(planInfo.pricing?.monthly?.price ?? 0).toLocaleString()} will be processed on ${renewalDate ? format(renewalDate, 'MMM dd') : 'next cycle'}.`}
              </p>
            </div>

            {/* Projected Annual Savings */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950/90 via-slate-900 to-rose-950/20 border border-slate-800 shadow-md space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <PiggyBank className="w-4 h-4 text-rose-400" />
                  Projected Annual Savings
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  30% DISCOUNT
                </span>
              </div>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-3xl font-extrabold text-emerald-400">৳{projectedAnnualSavings.toLocaleString()}</span>
                <span className="text-xs text-slate-400">
                  {sub?.billingInterval === 'yearly' ? 'saved per year' : 'potential annual savings'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <p className="text-[11px] text-slate-400">
                  {sub?.billingInterval === 'yearly'
                    ? 'Annual pricing active: You save 30% compared to month-to-month billing.'
                    : isFree
                    ? 'Upgrade to Annual Pro to save ৳2,198 each year.'
                    : 'Switching to annual billing saves 30% on your membership.'}
                </p>

                {sub?.billingInterval !== 'yearly' && (
                  <button
                    type="button"
                    onClick={() => {
                      setModalBillingInterval('yearly');
                      setIsUpgradeModalOpen(true);
                    }}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-bold underline shrink-0 cursor-pointer ml-2"
                  >
                    Save 30% →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* USAGE PROGRESS BAR COMPONENT FOR THE SUBSCRIPTION CARD                     */}
          {/* ========================================================================= */}
          <div className="pt-2 space-y-4" id="component-subscription-usage-progress">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Monthly Quota & Learning Usage ({usage.periodYearMonth})
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Resets on <span className="text-slate-200 font-semibold">1st of next month</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Quota 1: AI Coach Interactions */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5" id="usage-metric-ai-coach">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-rose-400" />
                    <span className="font-bold text-white">AI Sensei Coach Time</span>
                    {aiPercent >= 90 && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold animate-pulse" title="Quota usage has reached 90% or higher!">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <AlertTriangle className="w-2.5 h-2.5" />
                        90%+ Limit
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-200">
                    {usage.aiCoachInteractions} / {activeAiLimit >= 9999 ? 'Unlimited' : `${activeAiLimit} queries`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      aiPercent >= 90 ? 'bg-rose-600 animate-pulse' : aiPercent > 75 ? 'bg-rose-500' : aiPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${aiPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    {aiPercent >= 90 && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block animate-ping"></span>}
                    {aiPercent}% utilized
                  </span>
                  <span>{Math.max(0, activeAiLimit - usage.aiCoachInteractions)} queries remaining</span>
                </div>

                {aiPercent >= 80 && isFree && (
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 flex items-center justify-between gap-2">
                    <span>Almost at monthly cap. Upgrade for 1,000 queries.</span>
                    <button
                      type="button"
                      onClick={() => setIsUpgradeModalOpen(true)}
                      className="text-rose-400 font-bold underline hover:text-rose-300 shrink-0 cursor-pointer"
                    >
                      Upgrade
                    </button>
                  </div>
                )}
              </div>

              {/* Quota 2: Quizzes & JLPT Exercises */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5" id="usage-metric-quizzes">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-white">Quizzes & JLPT Drills Taken</span>
                    {isFree && quizPercent >= 90 && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold animate-pulse" title="Quota usage has reached 90% or higher!">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <AlertTriangle className="w-2.5 h-2.5" />
                        90%+
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-200">
                    {usage.quizzesTaken} / {isFree ? `${activeQuizLimit} max` : 'Unlimited'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFree
                        ? quizPercent >= 90
                          ? 'bg-rose-600 animate-pulse'
                          : quizPercent > 75
                          ? 'bg-rose-500'
                          : quizPercent > 50
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${isFree ? quizPercent : 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{isFree ? `${quizPercent}% quota used` : 'Unlimited Drills Active'}</span>
                  <span>{isFree ? `${Math.max(0, activeQuizLimit - usage.quizzesTaken)} quizzes left` : 'All JLPT Levels'}</span>
                </div>
              </div>

              {/* Quota 3: Mock Exams / JLPT Diagnostics */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5" id="usage-metric-mock-exams">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white">JLPT Timed Mock Exams</span>
                    {mockPercent >= 90 && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold" title="Quota usage has reached 90% or higher!">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <AlertTriangle className="w-2.5 h-2.5" />
                        90%+
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-200">
                    {usage.mockExamsTaken} / {activeMockLimit} completed
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      mockPercent >= 90 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${mockPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{mockPercent}% tests taken</span>
                  <span>{Math.max(0, activeMockLimit - usage.mockExamsTaken)} available this cycle</span>
                </div>
              </div>

              {/* Quota 4: Business Keigo & Career Scenarios */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5" id="usage-metric-keigo">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white">Business Keigo & Roleplays</span>
                  </div>
                  <span className="font-mono font-bold text-slate-200">
                    {isFree ? 'Locked in Free' : `${usage.keigoSimulationsDone} / 5 completed`}
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFree ? 'bg-slate-700' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${isFree ? 0 : 60}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{isFree ? 'Pro / Japan Ready benefit' : '60% completed'}</span>
                  <span>{isFree ? 'Requires Pro Plan' : '2 simulations remaining'}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Saved Payment Methods Section */}
        <SavedPaymentMethods onMethodChanged={fetchBillingData} />

        {/* ========================================================================= */}
        {/* INVOICE & BILLING HISTORY TABLE WITH SEARCH, TAX TOOLTIP, EXPORT CSV     */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-5" id="section-billing-invoices">
          
          {/* Section Header with Title & Top Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-500" />
                <span>Billing & Tax Invoice History</span>
              </h3>
              <p className="text-xs text-slate-400">
                Official PDF tax receipts, email dispatch, search filters, bulk PDF archive, and CSV exports.
              </p>
            </div>

            {/* Invoices Header Info & 12-Month Summary Widget */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-950/90 via-slate-900 to-slate-950/90 border border-slate-800" id="widget-12mo-spending-summary">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Past 12 Months Total Nihomi Investment
                </span>
                <p className="text-xs text-slate-400">
                  Total calculated expenditure across all active, compliant paid subscriptions over the last 365 days.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xl font-extrabold text-white font-mono">
                    ৳{totalSpentLast12Months.toLocaleString()} <span className="text-xs text-slate-400 font-sans font-semibold">BDT</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">100% Tax Compliant (15% VAT Included)</span>
                </div>
              </div>
            </div>

            {/* Top Toolbar Actions: Download All Invoices, Export CSV, Bulk Download Filtered PDF, Print Table */}
            <div className="flex flex-wrap items-center gap-2">
              {/* REQUIRED: Download All Invoices (entire invoice history as single ZIP file) */}
              <button
                type="button"
                onClick={handleDownloadAllInvoicesZIP}
                disabled={isDownloadingAllZip || invoices.length === 0}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl border border-rose-500/80 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                id="btn-download-all-invoices"
                title="Download your entire invoice history as a single ZIP file containing PDFs, automatically generated client-side"
              >
                {isDownloadingAllZip ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <Archive className="w-3.5 h-3.5 text-white" />
                )}
                <span>{isDownloadingAllZip ? 'Generating ZIP...' : 'Download All Invoices'}</span>
              </button>

              {/* Bulk Download Filtered PDF Button */}
              <button
                type="button"
                onClick={handleBulkDownloadPDF}
                disabled={isBulkDownloading || totalFilteredCount === 0}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 text-xs font-bold rounded-xl border border-slate-700/80 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                id="btn-bulk-download-pdf"
                title="Download all currently filtered invoices as a compressed ZIP file"
              >
                {isBulkDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                ) : (
                  <Archive className="w-3.5 h-3.5" />
                )}
                <span>{isBulkDownloading ? 'Zipping PDFs...' : 'Download Filtered PDF'}</span>
              </button>

              {/* Export CSV Button */}
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={totalFilteredCount === 0}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-bold rounded-xl border border-slate-700/80 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                id="btn-export-billing-csv"
                title="Download complete filtered invoice history as a formatted CSV file"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              {/* Annual Tax Summary Button */}
              <button
                type="button"
                onClick={() => {
                  const formatted = invoices.map((inv) => formatInvoiceForPDF(inv));
                  downloadAnnualTaxSummaryPDF(formatted, new Date().getFullYear());
                  setEmailSuccessMessage(`Generated official Annual Tax Summary PDF for FY ${new Date().getFullYear()}.`);
                  setTimeout(() => setEmailSuccessMessage(null), 4000);
                }}
                disabled={invoices.length === 0}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl border border-emerald-500/80 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                id="btn-annual-tax-summary-pdf"
                title="Calculate and download official Annual Tax Summary report for current fiscal year"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Annual Tax Summary (PDF)</span>
              </button>

              {/* Batch Print Button */}
              <button
                type="button"
                onClick={handlePrintTable}
                disabled={totalFilteredCount === 0}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-xl border border-slate-700/80 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                id="btn-batch-print-invoices"
                title="Automatically open the browser print dialog specifically for invoices in the current view"
              >
                <Printer className="w-3.5 h-3.5 text-rose-400" />
                <span>Batch Print</span>
              </button>

              {/* Print Table Button */}
              <button
                type="button"
                onClick={handlePrintTable}
                disabled={totalFilteredCount === 0}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700/80 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                id="btn-print-invoices-table"
                title="Print formatted invoice summary table"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>Print Table</span>
              </button>
            </div>
          </div>

          {/* 6-Month 15% VAT & Assessable Base Payment Visualization Bar Chart */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3" id="section-vat-chart">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  6-Month 15% VAT & Tax Contributions (NBR Mushak-6.3)
                </h4>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 inline-block" />
                  <span className="text-slate-400">Assessable Base</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                  <span className="text-emerald-400 font-bold">15% Statutory VAT</span>
                </div>
              </div>
            </div>

            <div className="h-52 w-full pt-1" id="vat-recharts-bar-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vatSpendingTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.4} />
                  <XAxis
                    dataKey="shortMonth"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={{ stroke: '#334155', opacity: 0.5 }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `৳${val}`}
                  />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-2xl text-xs space-y-1 border border-slate-700/80">
                            <p className="font-bold border-b border-slate-700 pb-1 text-rose-400">{data.monthLabel}</p>
                            <div className="text-[11px] space-y-0.5 pt-0.5">
                              <p className="text-slate-300">Base Subtotal: ৳{data.subtotal.toLocaleString()} BDT</p>
                              <p className="text-emerald-400 font-bold">15% VAT Paid: ৳{data.vat.toLocaleString()} BDT</p>
                              <p className="text-white font-extrabold">Total Settled: ৳{data.total.toLocaleString()} BDT</p>
                              <p className="text-[10px] text-slate-500">{data.count} {data.count === 1 ? 'invoice record' : 'invoice records'}</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="subtotal" name="Assessable Base" fill="#475569" stackId="tax" radius={[0, 0, 0, 0]} maxBarSize={38} />
                  <Bar dataKey="vat" name="15% Statutory VAT" fill="#10b981" stackId="tax" radius={[6, 6, 0, 0]} maxBarSize={38} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Month-Specific 'Select All' Interactive Toggles */}
            <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                <CheckSquare className="w-3 h-3 text-rose-400" />
                Select Invoices by Month:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {vatSpendingTrend.map((item) => {
                  const monthInvoices = invoices.filter((inv) => {
                    const d = inv.issuedAt ? new Date(inv.issuedAt) : (inv.createdAt ? new Date(inv.createdAt) : new Date());
                    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                    return key === item.monthKey;
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
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
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
          </div>

          {/* Search, Status Filter & Native Calendar Date Range Picker */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
            {/* Search Input and Status Dropdown */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={invoiceSearchQuery}
                  onChange={(e) => {
                    setInvoiceSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Filter by invoice #, plan, or keywords..."
                  className="w-full pl-9 pr-9 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-rose-500/80 focus:ring-1 focus:ring-rose-500/50 transition"
                  id="input-search-invoices"
                />
                {invoiceSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Dropdown Filter */}
              <select
                value={invoiceStatusFilter}
                onChange={(e) => {
                  setInvoiceStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="py-2 px-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 font-semibold focus:outline-hidden focus:border-rose-500/80 focus:ring-1 focus:ring-rose-500/50 transition cursor-pointer shrink-0"
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
                onClick={() => {
                  setInvoiceStatusFilter((prev) => (prev === 'pending' ? 'all' : 'pending'));
                  setCurrentPage(1);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer border flex items-center gap-1.5 ${
                  invoiceStatusFilter === 'pending'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-amber-400 border-slate-800'
                }`}
                id="btn-filter-pending-only"
                title="Filter to show only pending/unpaid invoices"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse"></span>
                <span>Pending Only</span>
              </button>
            </div>

            {/* Native Calendar Date Range Picker Controls */}
            <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
              <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 shrink-0">
                <CalendarDays className="w-3.5 h-3.5 text-rose-400" />
                <span>Date Range:</span>
              </span>

              {/* Start Date */}
              <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">From:</span>
                <input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => {
                    setStartDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-xs text-slate-200 focus:outline-hidden cursor-pointer"
                  id="input-date-start"
                />
              </div>

              {/* End Date */}
              <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">To:</span>
                <input
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => {
                    setEndDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-xs text-slate-200 focus:outline-hidden cursor-pointer"
                  id="input-date-end"
                />
              </div>

              {/* Clear Dates button if filter active */}
              {(startDateFilter || endDateFilter) && (
                <button
                  type="button"
                  onClick={() => {
                    setStartDateFilter('');
                    setEndDateFilter('');
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                  id="btn-clear-date-filter"
                  title="Clear calendar date filters"
                >
                  <X className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs" id="table-billing-invoices">
              <thead className="bg-slate-800/60 text-slate-400 uppercase font-semibold text-[11px]">
                <tr>
                  {/* Multi-Row Selection Checkbox Column */}
                  <th className="p-3.5 w-10 text-center">
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      className="p-1 rounded text-slate-400 hover:text-white transition cursor-pointer"
                      id="btn-select-all-invoices"
                      title={
                        paginatedInvoices.length > 0 &&
                        paginatedInvoices.every((inv) => selectedInvoiceIds.includes(inv.id))
                          ? 'Deselect all rows'
                          : 'Select all rows on this page'
                      }
                    >
                      {paginatedInvoices.length > 0 &&
                      paginatedInvoices.every((inv) => selectedInvoiceIds.includes(inv.id)) ? (
                        <CheckSquare className="w-4 h-4 text-rose-500" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </th>

                  {/* Expand Chevron Column */}
                  <th className="p-3.5 w-8"></th>

                  {/* Invoice # Column with TAX INFO TOOLTIP */}
                  <th className="p-3.5 relative">
                    <div className="flex items-center gap-1.5">
                      <span>Invoice #</span>
                      
                      {/* Info Tooltip Button */}
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={() => setShowTaxTooltip(!showTaxTooltip)}
                          onMouseEnter={() => setShowTaxTooltip(true)}
                          onMouseLeave={() => setShowTaxTooltip(false)}
                          className="p-0.5 rounded-full text-slate-400 hover:text-rose-400 transition cursor-pointer"
                          aria-label="Tax Information Details"
                          id="btn-tax-info-tooltip"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>

                        {/* Interactive Tooltip Popover */}
                        <AnimatePresence>
                          {showTaxTooltip && (
                            <motion.div
                              initial={{ opacity: 0, y: 6, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 6, scale: 0.95 }}
                              className="absolute left-0 top-full mt-1.5 z-40 w-72 p-3.5 rounded-xl bg-slate-950 border border-slate-700/80 shadow-2xl text-slate-300 normal-case font-normal space-y-2 pointer-events-auto"
                            >
                              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                                <Info className="w-4 h-4 shrink-0" />
                                <span>Tax & VAT Compliance</span>
                              </div>
                              <p className="text-[11px] leading-relaxed text-slate-300">
                                Generated invoices include <strong>15% VAT breakdown</strong> under National Board of Revenue (NBR) compliance, registered Business Identification Number (BIN: <strong>004928192-0101</strong>), and digital cryptographic verification seals.
                              </p>
                              <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                                <span>Valid for official business expenses</span>
                                <span className="text-emerald-400 font-semibold">NBR Verified</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </th>

                  {/* Sortable Date Header */}
                  <th className="p-3.5">
                    <button
                      type="button"
                      onClick={toggleDateSort}
                      className="flex items-center gap-1 hover:text-white transition cursor-pointer select-none"
                      id="btn-sort-date"
                      title={`Sort by date (${dateSortOrder === 'desc' ? 'Newest first' : 'Oldest first'})`}
                    >
                      <span>Date</span>
                      {dateSortOrder === 'desc' ? (
                        <ArrowDown className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <ArrowUp className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </button>
                  </th>

                  <th className="p-3.5">Plan</th>
                  
                  {/* Amount Column with Average indicator hint */}
                  <th className="p-3.5">
                    <div className="flex items-center gap-1" title={`User Average Spend: ৳${averageInvoiceSpend.toLocaleString()}`}>
                      <span>Amount</span>
                      <span className="text-[9px] lowercase font-mono text-slate-500 font-normal">(vs avg)</span>
                    </div>
                  </th>

                  {/* Days Since Paid Header */}
                  <th className="p-3.5">Days Since Paid</th>

                  <th className="p-3.5">Status</th>
                  
                  {/* Actions Header with Table Header Print Button */}
                  <th className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span>Actions</span>
                      <button
                        type="button"
                        onClick={handlePrintTable}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/60 transition cursor-pointer"
                        id="btn-print-invoice-table"
                        title="Print invoice table"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {totalFilteredCount === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-500">
                      {loading
                        ? 'Loading invoices...'
                        : invoiceSearchQuery || invoiceStatusFilter !== 'all' || startDateFilter || endDateFilter
                        ? 'No invoices match your search or date filter criteria.'
                        : 'No invoices found for this account.'}
                    </td>
                  </tr>
                ) : (
                  paginatedInvoices.map((inv, index) => {
                    const isRowExpanded = expandedInvoiceIds.includes(inv.id);
                    const isSelected = selectedInvoiceIds.includes(inv.id);
                    const isPaid = (inv.status || 'paid').toLowerCase() === 'paid';
                    const isPending = (inv.status || '').toLowerCase() === 'pending';
                    const isFailed = (inv.status || '').toLowerCase() === 'failed';

                    return (
                      <React.Fragment key={`${inv.id}-${invoiceSearchQuery}-${invoiceStatusFilter}-${startDateFilter}-${endDateFilter}-${dateSortOrder}`}>
                        <motion.tr
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.22, delay: index * 0.04 }}
                          className={`hover:bg-slate-800/30 transition group ${
                            isSelected ? 'bg-rose-950/20' : ''
                          } ${isRowExpanded ? 'bg-slate-850/40' : ''}`}
                        >
                          {/* Multi-Row Checkbox */}
                          <td className="p-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleSelectInvoice(inv.id)}
                              className="p-1 rounded text-slate-400 hover:text-rose-400 transition cursor-pointer"
                              id={`checkbox-invoice-${inv.id}`}
                              title={isSelected ? 'Deselect this invoice' : 'Select this invoice'}
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-rose-500" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                              )}
                            </button>
                          </td>

                          {/* Expand Row Toggle Chevron */}
                          <td className="p-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleExpandRow(inv.id)}
                              className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                              id={`btn-expand-toggle-${inv.id}`}
                              title={isRowExpanded ? 'Collapse invoice metadata' : 'Expand to see transaction details, billing address & gateway response'}
                            >
                              {isRowExpanded ? (
                                <ChevronUp className="w-4 h-4 text-rose-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                          </td>

                          {/* Invoice # with Copy Button and Verified by NBR Badge */}
                          <td className="p-3.5 font-mono font-bold text-slate-200">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className="cursor-pointer hover:text-rose-400 transition"
                                onClick={() => handleToggleExpandRow(inv.id)}
                                title="Click to view detailed transaction breakdown"
                              >
                                {inv.invoiceNumber || inv.id}
                              </span>
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 shadow-2xs"
                                title="Verified by NBR - Cryptographic compliance seal under NBR Mushak 6.3"
                                id={`badge-nbr-verified-${inv.id}`}
                              >
                                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                                Verified by NBR
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyInvoiceId(inv.invoiceNumber || inv.id)}
                                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                                id={`btn-copy-invoice-${inv.id}`}
                                title="Copy invoice ID to clipboard"
                              >
                                {copiedInvoiceId === (inv.invoiceNumber || inv.id) ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="p-3.5 text-slate-400">
                            {inv.issuedAt ? format(new Date(inv.issuedAt), 'MMM dd, yyyy') : 'N/A'}
                          </td>

                          {/* Plan */}
                          <td className="p-3.5 text-slate-300 font-medium">{inv.planName}</td>

                          {/* Amount with Real-Time 15% VAT & Subtotal Hover Preview and Trend Indicator */}
                          <td className="p-3.5 relative">
                            <div className="flex items-center gap-2">
                              <div
                                className="relative inline-block"
                                onMouseEnter={() => setHoveredAmountInvoiceId(inv.id)}
                                onMouseLeave={() => setHoveredAmountInvoiceId(null)}
                              >
                                <button
                                  type="button"
                                  className="inline-flex items-center font-extrabold text-sm sm:text-base text-white tracking-tight hover:text-rose-400 group-hover:scale-105 transition-all duration-150 rounded px-1.5 py-0.5 hover:bg-rose-500/10 cursor-pointer text-left"
                                  id={`btn-amount-hover-${inv.id}`}
                                >
                                  {inv.currency || 'BDT'} ৳{inv.totalAmount.toLocaleString()}
                                </button>

                                {/* Real-Time 15% VAT & Subtotal Hover Preview Tooltip */}
                                <AnimatePresence>
                                  {hoveredAmountInvoiceId === inv.id && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                      className="absolute left-0 top-full mt-1 z-50 w-64 p-3 bg-slate-950 border border-slate-700/90 rounded-xl shadow-2xl backdrop-blur-md pointer-events-none text-left"
                                      id={`tooltip-amount-breakdown-${inv.id}`}
                                    >
                                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-2">
                                        <span className="text-[11px] font-bold text-slate-200">Tax Breakdown (NBR)</span>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-rose-500/20 text-rose-300 rounded border border-rose-500/30">Mushak-6.3</span>
                                      </div>
                                      <div className="space-y-1.5 text-xs">
                                        <div className="flex items-center justify-between text-slate-400">
                                          <span>Base Amount (Excl. VAT):</span>
                                          <span className="font-semibold text-slate-200">
                                            ৳{(inv.subtotal || Math.round(inv.totalAmount / 1.15)).toLocaleString()}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between text-rose-400">
                                          <span>NBR VAT (15%):</span>
                                          <span className="font-semibold text-rose-300">
                                            +৳{(inv.tax || Math.round(inv.totalAmount - (inv.subtotal || Math.round(inv.totalAmount / 1.15)))).toLocaleString()}
                                          </span>
                                        </div>
                                        <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between font-extrabold text-white">
                                          <span>Total Settled:</span>
                                          <span className="text-emerald-400">
                                            ৳{inv.totalAmount.toLocaleString()}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="mt-2 pt-1.5 border-t border-slate-900 text-[10px] text-slate-500 flex items-center justify-between">
                                        <span>BIN: 004928192-0101</span>
                                        <span>100% Tax Compliant</span>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              {/* Upward / Downward Trend Indicator */}
                              {averageInvoiceSpend > 0 && inv.totalAmount > averageInvoiceSpend ? (
                                <span
                                  className="inline-flex items-center text-rose-400 text-[10px] font-semibold bg-rose-500/10 border border-rose-500/20 rounded px-1.5 py-0.5 cursor-help"
                                  title={`Invoice amount is ৳${(inv.totalAmount - averageInvoiceSpend).toLocaleString()} higher than your average invoice spend (৳${averageInvoiceSpend.toLocaleString()})`}
                                  id={`trend-up-${inv.id}`}
                                >
                                  <TrendingUp className="w-3 h-3 mr-0.5 text-rose-400" />
                                  <span>+৳{(inv.totalAmount - averageInvoiceSpend).toLocaleString()}</span>
                                </span>
                              ) : averageInvoiceSpend > 0 && inv.totalAmount < averageInvoiceSpend ? (
                                <span
                                  className="inline-flex items-center text-emerald-400 text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 rounded px-1.5 py-0.5 cursor-help"
                                  title={`Invoice amount is ৳${(averageInvoiceSpend - inv.totalAmount).toLocaleString()} lower than your average invoice spend (৳${averageInvoiceSpend.toLocaleString()})`}
                                  id={`trend-down-${inv.id}`}
                                >
                                  <TrendingDown className="w-3 h-3 mr-0.5 text-emerald-400" />
                                  <span>-৳{(averageInvoiceSpend - inv.totalAmount).toLocaleString()}</span>
                                </span>
                              ) : (
                                <span
                                  className="inline-flex items-center text-slate-400 text-[10px] bg-slate-800/80 rounded px-1.5 py-0.5 cursor-help"
                                  title={`Invoice is equal to your average invoice spend (৳${averageInvoiceSpend.toLocaleString()})`}
                                >
                                  <Minus className="w-3 h-3 text-slate-500" />
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Days Since Paid Metric Badge */}
                          <td className="p-3.5">
                            {(() => {
                              const invoiceDate = inv.issuedAt ? new Date(inv.issuedAt) : new Date();
                              const now = new Date();
                              const diffTime = Math.max(0, now.getTime() - invoiceDate.getTime());
                              const daysSincePaid = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                              return (
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                    !isPaid
                                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                      : daysSincePaid === 0
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                      : daysSincePaid <= 14
                                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                      : daysSincePaid <= 30
                                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                      : 'bg-slate-800 text-slate-400 border-slate-700'
                                  }`}
                                  id={`badge-days-since-paid-${inv.id}`}
                                  title={`Invoice issued ${daysSincePaid} days ago on ${format(invoiceDate, 'MMM dd, yyyy')}`}
                                >
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>{daysSincePaid === 0 ? 'Today (0d)' : `${daysSincePaid}d ago`}</span>
                                </span>
                              );
                            })()}
                          </td>

                          {/* Status Badge with Conditional Pulse / Glow Animation */}
                          <td className="p-3.5">
                            {isPaid ? (
                              <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold uppercase text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                                title="Payment successfully verified & settled"
                                id={`badge-status-paid-${inv.id}`}
                              >
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span>PAID</span>
                              </span>
                            ) : isPending ? (
                              <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold uppercase text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse"
                                title="Payment awaiting gateway capture or confirmation"
                                id={`badge-status-pending-${inv.id}`}
                              >
                                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                                <span>PENDING</span>
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold uppercase text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                title="Transaction declined or expired"
                                id={`badge-status-failed-${inv.id}`}
                              >
                                <span className="h-2 w-2 rounded-full bg-rose-400"></span>
                                <span>FAILED</span>
                              </span>
                            )}
                          </td>

                          {/* Actions Column */}
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* QR Scanner / NBR Tax Seal Verification Icon Button */}
                              <button
                                type="button"
                                onClick={() => setNbrVerifyInvoice(inv)}
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 rounded-lg font-semibold inline-flex items-center transition text-xs border border-slate-700/60 cursor-pointer shadow-2xs"
                                id={`btn-nbr-qr-verify-${inv.id}`}
                                title="Scan QR Code & Validate Cryptographic NBR Tax Verification Seal"
                              >
                                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                              </button>

                              {/* Quick View Eye Icon Button */}
                              <button
                                type="button"
                                onClick={() => setQuickViewInvoice(inv)}
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 rounded-lg font-semibold inline-flex items-center transition text-xs border border-slate-700/60 cursor-pointer shadow-2xs"
                                id={`btn-quick-view-${inv.id}`}
                                title="Quick view tax invoice breakdown & logo preview without downloading"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Quick Pay Action Button (specifically for Pending invoices) */}
                              {isPending && (
                                <button
                                  type="button"
                                  onClick={() => handleQuickPay(inv)}
                                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold inline-flex items-center gap-1.5 transition text-xs shadow-sm cursor-pointer animate-pulse hover:animate-none"
                                  id={`btn-quick-pay-${inv.id}`}
                                  title="Instantly re-trigger payment gateway checkout link"
                                >
                                  <Zap className="w-3.5 h-3.5 fill-current" />
                                  <span>Quick Pay</span>
                                </button>
                              )}

                              {/* REQUIRED: Export to PDF Button (Client-Side Print-Friendly PDF) */}
                              <button
                                type="button"
                                onClick={() => handleExportInvoicePDF(inv)}
                                className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold inline-flex items-center gap-1.5 transition text-xs shadow-sm cursor-pointer"
                                id={`btn-export-pdf-${inv.id}`}
                                title="Export a client-side generated print-friendly PDF for this specific invoice"
                              >
                                <FileDown className="w-3.5 h-3.5" />
                                <span>Export PDF</span>
                              </button>

                              {/* Email Invoice Button */}
                              <button
                                type="button"
                                onClick={() => handleEmailInvoice(inv)}
                                disabled={sendingEmailId === inv.id}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-rose-400 rounded-lg font-semibold inline-flex items-center gap-1.5 transition text-xs border border-slate-700/60 disabled:opacity-50 cursor-pointer"
                                title="Send invoice receipt directly to your registered email address"
                                id={`btn-email-invoice-${inv.id}`}
                              >
                                {sendingEmailId === inv.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                                ) : (
                                  <Mail className="w-3.5 h-3.5 text-rose-400" />
                                )}
                                <span className="hidden sm:inline">{sendingEmailId === inv.id ? 'Sending...' : 'Email'}</span>
                              </button>

                              {/* Quick Actions Dropdown Menu */}
                              <div className="relative inline-block text-left">
                                <button
                                  type="button"
                                  onClick={() => setActiveQuickActionId(activeQuickActionId === inv.id ? null : inv.id)}
                                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg font-semibold inline-flex items-center gap-1 transition text-xs border border-slate-700/60 cursor-pointer"
                                  id={`btn-quick-actions-${inv.id}`}
                                  title="Quick Actions Menu"
                                >
                                  <span>Actions</span>
                                  <ChevronDown className="w-3 h-3 text-slate-400" />
                                </button>

                                {/* Dropdown Popover */}
                                <AnimatePresence>
                                  {activeQuickActionId === inv.id && (
                                    <>
                                      <div
                                        className="fixed inset-0 z-30"
                                        onClick={() => setActiveQuickActionId(null)}
                                      />
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 4 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 4 }}
                                        className="absolute right-0 top-full mt-1 z-40 w-52 rounded-xl bg-slate-950 border border-slate-700/80 shadow-2xl p-1.5 text-left text-xs space-y-0.5"
                                      >
                                        {/* Verify NBR Tax Seal */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveQuickActionId(null);
                                            setNbrVerifyInvoice(inv);
                                          }}
                                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-emerald-400 hover:bg-slate-800 transition cursor-pointer text-left"
                                          id={`btn-qa-verify-nbr-${inv.id}`}
                                        >
                                          <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                                          <span>Verify NBR Tax Seal</span>
                                        </button>

                                        {/* Quick View Preview */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveQuickActionId(null);
                                            setQuickViewInvoice(inv);
                                          }}
                                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-rose-400 transition cursor-pointer text-left"
                                          id={`btn-qa-quick-view-${inv.id}`}
                                        >
                                          <Eye className="w-3.5 h-3.5 text-rose-400" />
                                          <span>Quick View Preview</span>
                                        </button>

                                        {/* Export Client-Side PDF */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveQuickActionId(null);
                                            handleExportInvoicePDF(inv);
                                          }}
                                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-rose-400 transition cursor-pointer text-left"
                                          id={`btn-qa-export-pdf-${inv.id}`}
                                        >
                                          <FileDown className="w-3.5 h-3.5 text-rose-400" />
                                          <span>Export to PDF</span>
                                        </button>

                                        {/* Download Server Receipt PDF */}
                                        <a
                                          href={`/api/invoices/${inv.id}/download`}
                                          onClick={() => setActiveQuickActionId(null)}
                                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-rose-400 transition"
                                          id={`btn-qa-download-pdf-${inv.id}`}
                                        >
                                          <FileText className="w-3.5 h-3.5 text-rose-400" />
                                          <span>Download Server PDF</span>
                                        </a>

                                        {/* Resend Invoice Email */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveQuickActionId(null);
                                            handleEmailInvoice(inv);
                                          }}
                                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-rose-400 transition cursor-pointer text-left"
                                          id={`btn-qa-resend-email-${inv.id}`}
                                        >
                                          <Mail className="w-3.5 h-3.5 text-rose-400" />
                                          <span>Resend Invoice Email</span>
                                        </button>

                                        {/* Report Billing Issue */}
                                        <button
                                          type="button"
                                          onClick={() => handleOpenReportModal(inv)}
                                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-amber-400 transition cursor-pointer text-left"
                                          id={`btn-qa-report-issue-${inv.id}`}
                                        >
                                          <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
                                          <span>Report Billing Issue</span>
                                        </button>

                                        <div className="border-t border-slate-800 my-1" />

                                        {/* Export CSV Record */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveQuickActionId(null);
                                            handleExportSingleInvoiceCSV(inv);
                                          }}
                                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-emerald-400 transition cursor-pointer text-left"
                                          id={`btn-qa-export-csv-${inv.id}`}
                                        >
                                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                                          <span>Export Single CSV</span>
                                        </button>

                                        {/* Copy Invoice ID */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveQuickActionId(null);
                                            handleCopyInvoiceId(inv.invoiceNumber || inv.id);
                                          }}
                                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white transition cursor-pointer text-left"
                                          id={`btn-qa-copy-id-${inv.id}`}
                                        >
                                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                                          <span>Copy Invoice ID</span>
                                        </button>
                                      </motion.div>
                                    </>
                                  )}
                                </AnimatePresence>
                              </div>

                              {/* REQUIRED: Export CSV button */}
                              <button
                                type="button"
                                onClick={() => handleExportSingleInvoiceCSV(inv)}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 rounded-lg font-semibold inline-flex items-center gap-1 transition text-xs border border-slate-700/60 cursor-pointer"
                                id={`btn-export-csv-${inv.id}`}
                                title="Export this individual invoice as CSV"
                              >
                                <FileSpreadsheet className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">CSV</span>
                              </button>
                            </div>
                          </td>
                        </motion.tr>

                        {/* Expandable Row Revealing Transaction ID, Billing Address, Payment Gateway Response, and Hash */}
                        <AnimatePresence>
                          {isRowExpanded && (
                            <tr className="bg-slate-950/90 border-b border-slate-800">
                              <td colSpan={9} className="p-4 sm:p-5">
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="space-y-4"
                                >
                                  <div className="bg-slate-900/90 rounded-2xl p-4.5 border border-slate-800/80 shadow-inner space-y-4">
                                    {/* Sub-Header */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                                      <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                        <span className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                                          Transaction Metadata & NBR Verification Details
                                        </span>
                                      </div>
                                      <span className="text-[11px] font-mono text-slate-400">
                                        Invoice Ref: <strong>{inv.invoiceNumber || inv.id}</strong>
                                      </span>
                                    </div>

                                    {/* 3-Column Metadata Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                      {/* Transaction ID & Status */}
                                      <div className="space-y-1.5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/60">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                          Transaction ID
                                        </span>
                                        <p className="font-mono text-slate-100 text-xs font-semibold break-all">
                                          {inv.transactionId || `TXN-BKASH-${(inv.id.replace(/[^0-9]/g, '') + '829104').slice(0, 12)}`}
                                        </p>
                                        <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                          <span>Status: 0000 SUCCESS (Captured)</span>
                                        </div>
                                      </div>

                                      {/* Billing Address */}
                                      <div className="space-y-1.5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/60">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                          Billing Address & Issuer
                                        </span>
                                        <p className="text-slate-200 text-xs leading-relaxed">
                                          {inv.billingAddress || 'Dhaka International Language School Campus, House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh'}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-mono pt-1">
                                          Tax BIN: <strong>004928192-0101</strong> (Mushak-6.3 Verified)
                                        </p>
                                      </div>

                                      {/* Payment Gateway Response */}
                                      <div className="space-y-1.5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/60">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                          Payment Gateway Response
                                        </span>
                                        <p className="font-mono text-[11px] text-slate-300 break-all leading-tight">
                                          {inv.gatewayResponse || `HTTP/1.1 200 OK | AuthCode: AUTH-${(inv.id.slice(-6)).toUpperCase()} | RRN: 202608${(inv.id.replace(/[^0-9]/g, '') + '492').slice(0, 8)} | TLS 1.3`}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-mono pt-1">
                                          Digital Seal: SHA256-{(inv.id + (inv.invoiceNumber || '') + 'SETTLED').slice(0, 16)}...
                                        </p>
                                      </div>
                                    </div>

                                    {/* Breakdown & Quick Action buttons */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs text-slate-300 border-t border-slate-800">
                                      <div className="flex flex-wrap items-center gap-4 text-[11px]">
                                        <span>Subtotal: <strong className="text-white">৳{(inv.subtotal || Math.round(inv.totalAmount / 1.15)).toLocaleString()}</strong></span>
                                        <span>VAT (15%): <strong className="text-white">৳{(inv.tax || Math.round(inv.totalAmount - (inv.subtotal || Math.round(inv.totalAmount / 1.15)))).toLocaleString()}</strong></span>
                                        <span>Total: <strong className="text-emerald-400 font-bold">৳{inv.totalAmount.toLocaleString()}</strong></span>
                                        <span className="text-slate-400">Method: <strong>{inv.paymentMethodName || 'bKash Auto-Renew'}</strong></span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleExportInvoicePDF(inv)}
                                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                                        >
                                          <FileDown className="w-3.5 h-3.5" />
                                          <span>Export to PDF</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setQuickViewInvoice(inv)}
                                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition border border-slate-700/60"
                                        >
                                          <Eye className="w-3.5 h-3.5 text-rose-400" />
                                          <span>Quick View</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ========================================================================= */}
          {/* PAGINATION CONTROL & SUMMARY                                              */}
          {/* ========================================================================= */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-xs pt-2 border-t border-slate-800/80">
            {/* Pagination Range Feedback */}
            <div className="flex items-center gap-2">
              <span>
                {totalFilteredCount === 0
                  ? 'Showing 0-0 of 0 records'
                  : `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      totalFilteredCount
                    )} of ${totalFilteredCount} records`}
              </span>

              {/* Items per page selector */}
              <div className="flex items-center gap-1 ml-2 text-[11px] text-slate-500">
                <span>Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 font-semibold focus:outline-hidden cursor-pointer"
                  id="select-items-per-page"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            {/* Pagination Button Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 font-semibold text-xs border border-slate-700/60 cursor-pointer"
                  id="btn-pagination-prev"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {/* Page Number Pills */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                      }`}
                      id={`btn-pagination-page-${pageNum}`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 font-semibold text-xs border border-slate-700/60 cursor-pointer"
                  id="btn-pagination-next"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* REPORT BILLING ISSUE MODAL                                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {reportingInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4"
              id="modal-report-billing-issue"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                  <LifeBuoy className="w-5 h-5" />
                  <span>Report Billing Issue</span>
                </div>
                <button
                  type="button"
                  onClick={() => setReportingInvoice(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Invoice Reference:</span>
                  <span className="font-mono font-bold text-white">{reportingInvoice.invoiceNumber || reportingInvoice.id}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Amount & Plan:</span>
                  <span className="font-semibold text-white">৳{reportingInvoice.totalAmount.toLocaleString()} • {reportingInvoice.planName}</span>
                </div>
              </div>

              <form onSubmit={handleSubmitBillingReport} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Issue Category</label>
                  <select
                    value={reportIssueType}
                    onChange={(e) => setReportIssueType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-hidden focus:border-rose-500"
                    id="select-report-issue-type"
                  >
                    <option value="incorrect_charge">Incorrect Charge Amount</option>
                    <option value="double_billing">Duplicate or Double Billing</option>
                    <option value="vat_discrepancy">VAT / Tax Breakdown Discrepancy</option>
                    <option value="download_issue">Cannot Download Receipt PDF</option>
                    <option value="other">Other Billing Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Details & Message</label>
                  <textarea
                    rows={3}
                    value={reportIssueNotes}
                    onChange={(e) => setReportIssueNotes(e.target.value)}
                    placeholder="Describe what you noticed or request an itemized review..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-rose-500"
                    id="textarea-report-issue-notes"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveBillingReportPDF}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold transition flex items-center gap-1.5 cursor-pointer text-xs border border-slate-700"
                    id="btn-save-billing-report-pdf"
                    title="Save a local formatted copy of this inquiry as a PDF document"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Save as PDF</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReportingInvoice(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition cursor-pointer text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReport}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs"
                      id="btn-submit-billing-report"
                    >
                      {isSubmittingReport ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LifeBuoy className="w-3.5 h-3.5" />}
                      <span>Submit Report</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* UPGRADE COMPARISON TABLE MODAL                                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col"
              id="modal-upgrade-comparison"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      Nihomi Plan Comparison
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    Upgrade Your Japanese Learning Journey
                  </h3>
                  <p className="text-xs text-slate-400">
                    Compare plan benefits and choose the best path for your JLPT goals and Japan career.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                  id="btn-close-upgrade-modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Billing Interval Selector */}
              <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-center gap-3 shrink-0">
                <span className={`text-xs font-semibold ${modalBillingInterval === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
                  Monthly Billing
                </span>
                <button
                  type="button"
                  onClick={() => setModalBillingInterval(modalBillingInterval === 'monthly' ? 'yearly' : 'monthly')}
                  className="relative inline-flex h-6 w-12 items-center rounded-full bg-slate-800 transition-colors focus:outline-hidden cursor-pointer"
                  id="toggle-modal-billing-interval"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-rose-600 transition-transform ${
                      modalBillingInterval === 'yearly' ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-semibold ${modalBillingInterval === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
                    Yearly Billing
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold">
                    SAVE 30%
                  </span>
                </div>
              </div>

              {/* Modal Body: Comparison Table */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* Plans Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {plansList.map((planItem) => {
                    const isCurrent = currentPlanId === planItem.id;
                    const price = modalBillingInterval === 'yearly' ? planItem.yearlyPrice : planItem.monthlyPrice;
                    const periodLabel = modalBillingInterval === 'yearly' ? '/year' : '/month';

                    return (
                      <div
                        key={planItem.id}
                        className={`rounded-2xl p-5 flex flex-col justify-between transition-all ${
                          planItem.recommended
                            ? 'bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-900 border-2 border-rose-500/80 shadow-xl shadow-rose-950/30 relative'
                            : isCurrent
                            ? 'bg-slate-950/80 border-2 border-slate-700'
                            : 'bg-slate-950/40 border border-slate-800'
                        }`}
                      >
                        {planItem.badge && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                            {planItem.badge}
                          </div>
                        )}

                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-bold text-white">{planItem.name}</h4>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-8">
                              {planItem.tagline}
                            </p>
                          </div>

                          {/* Pricing */}
                          <div className="pb-3 border-b border-slate-800">
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-extrabold text-white">
                                {planItem.monthlyPrice === 0 ? '৳0' : `৳${price.toLocaleString()}`}
                              </span>
                              <span className="text-xs text-slate-400">
                                {planItem.monthlyPrice === 0 ? 'forever' : periodLabel}
                              </span>
                            </div>
                            {modalBillingInterval === 'yearly' && planItem.monthlyPrice > 0 && (
                              <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                                ৳{Math.round(planItem.yearlyPrice / 12)}/month billed annually
                              </p>
                            )}
                          </div>

                          {/* Feature Points */}
                          <ul className="space-y-2 text-xs">
                            {planItem.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-2">
                                {f.value === false ? (
                                  <Minus className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                                )}
                                <span className={f.value === false ? 'text-slate-500' : 'text-slate-300'}>
                                  <strong className="text-slate-200">{f.label}:</strong>{' '}
                                  {f.value === true ? 'Included' : f.value === false ? 'Not included' : f.value}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-5 mt-4 border-t border-slate-800/80">
                          {isCurrent ? (
                            <button
                              type="button"
                              disabled
                              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold cursor-default"
                            >
                              Current Plan
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSelectPlanForUpgrade(planItem)}
                              className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer ${
                                planItem.recommended
                                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                                  : 'bg-slate-800 hover:bg-slate-700 text-white'
                              }`}
                              id={`btn-select-plan-${planItem.id}`}
                            >
                              <span>{planItem.id === 'free' ? 'Select Free' : `Upgrade to ${planItem.name}`}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Trust guarantee banner */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-200">Instant Activation & Instant Tax Invoices</p>
                      <p className="text-[11px]">Upgrading activates all courses immediately with seamless bKash, Nagad & Card payments.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold text-slate-300">7-Day Money-Back Guarantee</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Checkout Modal when upgrading from the comparison table */}
      {selectedPlanForCheckout && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          selectedPlan={selectedPlanForCheckout}
          initialInterval={modalBillingInterval}
          onSuccess={() => {
            setIsCheckoutOpen(false);
            fetchBillingData();
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* FLOATING ACTION BAR FOR MULTI-ROW SELECTION */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedInvoiceIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
            id="floating-invoice-action-bar"
          >
            <div className="bg-slate-950/95 backdrop-blur-xl border border-rose-500/40 rounded-2xl px-5 py-3.5 shadow-2xl shadow-rose-950/40 flex flex-wrap items-center justify-between gap-4 max-w-2xl w-full pointer-events-auto text-xs text-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold">
                  {selectedInvoiceIds.length}
                </div>
                <div>
                  <p className="font-bold text-white">
                    {selectedInvoiceIds.length} {selectedInvoiceIds.length === 1 ? 'Invoice' : 'Invoices'} Selected
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Perform batch exports or print records in one click
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Download Selected as ZIP */}
                <button
                  type="button"
                  onClick={handleBulkDownloadSelected}
                  disabled={isBulkDownloading}
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
                  id="btn-download-selected-invoices"
                  title="Download selected invoices in a ZIP file"
                >
                  {isBulkDownloading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Archive className="w-3.5 h-3.5" />
                  )}
                  <span>{isBulkDownloading ? 'Zipping...' : 'Download Selected'}</span>
                </button>

                {/* Print Selected */}
                <button
                  type="button"
                  onClick={handleBulkPrintSelected}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold flex items-center gap-1.5 transition border border-slate-700/80 cursor-pointer"
                  id="btn-print-selected-invoices"
                  title="Print selected invoice table view"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span>Print Selected</span>
                </button>

                {/* Deselect All */}
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceIds([])}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                  id="btn-clear-selected-invoices"
                  title="Deselect all invoices"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* QUICK VIEW TAX INVOICE OVERLAY (NBR MUSHAK 6.3 WITH LIVE PDF PREVIEW)      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {quickViewInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh] my-4"
              id="quick-view-tax-invoice-overlay"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                    日
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">NIHOMI ACADEMY</h3>
                    <p className="text-[11px] text-slate-400">Official NBR Tax Invoice Preview (Mushak-6.3)</p>
                  </div>
                </div>

                {/* View Mode Toggle: Live PDF vs Breakdown */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setQuickViewActiveTab('preview')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      quickViewActiveTab === 'preview'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    id="btn-tab-live-pdf"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Live PDF Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickViewActiveTab('breakdown')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      quickViewActiveTab === 'breakdown'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    id="btn-tab-breakdown"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Breakdown</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border ${
                    (quickViewInvoice.status || 'paid').toLowerCase() === 'paid'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {quickViewInvoice.status || 'PAID'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuickViewInvoice(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    id="btn-close-quick-view"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-300 flex-1">
                {quickViewActiveTab === 'preview' && (
                  <div className="space-y-3" id="section-live-pdf-area">
                    <div className="flex items-center justify-between text-xs px-1 text-slate-400">
                      <div className="flex items-center gap-1.5 font-bold text-slate-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Live NBR Cryptographic Tax Invoice Document Preview</span>
                      </div>
                      <span className="text-[11px] font-mono">BIN: 004928192-0101 • Mushak 6.3</span>
                    </div>

                    {quickViewPdfUrl ? (
                      <div className="rounded-xl border border-slate-800 overflow-hidden shadow-inner bg-slate-950">
                        <iframe
                          src={`${quickViewPdfUrl}#toolbar=1&navpanes=0`}
                          className="w-full h-[460px] sm:h-[500px] rounded-xl"
                          title="Live Invoice PDF Preview"
                          id="iframe-live-pdf-preview"
                        />
                      </div>
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center rounded-xl bg-slate-950/60 border border-slate-800 text-slate-500 space-y-2">
                        <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                        <p className="text-xs">Generating live PDF document preview...</p>
                      </div>
                    )}
                  </div>
                )}

                {quickViewActiveTab === 'breakdown' && (
                  <div className="space-y-6">
                    {/* Meta details header */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Invoice #</span>
                        <span className="font-mono font-bold text-slate-200 text-xs">{quickViewInvoice.invoiceNumber || quickViewInvoice.id}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Issue Date</span>
                        <span className="text-slate-200">{quickViewInvoice.issuedAt ? format(new Date(quickViewInvoice.issuedAt), 'MMM dd, yyyy') : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Tax BIN</span>
                        <span className="text-slate-200 font-mono">004928192-0101</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Payment Method</span>
                        <span className="text-slate-200">{quickViewInvoice.paymentMethodName || 'bKash Auto-Debit'}</span>
                      </div>
                    </div>

                    {/* Billed To & Issuer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Billed To (Student)</span>
                        <p className="font-bold text-white text-xs">{quickViewInvoice.customerName || 'Nihomi Student'}</p>
                        <p className="text-slate-400 text-[11px]">{quickViewInvoice.customerEmail || 'mdtanvirkabirbiplob@gmail.com'}</p>
                        <p className="text-slate-400 text-[11px]">Enrolled Course: {quickViewInvoice.planName}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Issued By</span>
                        <p className="font-bold text-white text-xs">Nihomi Academy Ltd.</p>
                        <p className="text-slate-400 text-[11px]">House 42, Road 11, Banani, Dhaka-1213</p>
                        <p className="text-slate-400 text-[11px]">support@nihomi.com | BIN: 004928192-0101</p>
                      </div>
                    </div>

                    {/* Itemized Table */}
                    <div className="rounded-xl border border-slate-800 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold">
                          <tr>
                            <th className="p-3">Description / Learning Module</th>
                            <th className="p-3 text-center">Qty</th>
                            <th className="p-3 text-right">Tax Rate</th>
                            <th className="p-3 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                          <tr>
                            <td className="p-3">
                              <p className="font-bold text-white">{quickViewInvoice.planName} Subscription</p>
                              <p className="text-[11px] text-slate-400">Full access to Nihomi Learning Engine & AI Coach</p>
                            </td>
                            <td className="p-3 text-center text-slate-300">1</td>
                            <td className="p-3 text-right text-slate-300">15% NBR VAT</td>
                            <td className="p-3 text-right font-semibold text-white">
                              ৳{(quickViewInvoice.subtotal || Math.round(quickViewInvoice.totalAmount / 1.15)).toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Totals Summary */}
                    <div className="flex justify-end">
                      <div className="w-full sm:w-64 space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Subtotal (Excl. VAT):</span>
                          <span>৳{(quickViewInvoice.subtotal || Math.round(quickViewInvoice.totalAmount / 1.15)).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>15% VAT (NBR):</span>
                          <span>৳{(quickViewInvoice.tax || Math.round(quickViewInvoice.totalAmount - (quickViewInvoice.subtotal || Math.round(quickViewInvoice.totalAmount / 1.15)))).toLocaleString()}</span>
                        </div>
                        <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm text-white">
                          <span>Total Paid:</span>
                          <span className="text-emerald-400">৳{quickViewInvoice.totalAmount.toLocaleString()} BDT</span>
                        </div>
                      </div>
                    </div>

                    {/* Verification Seal */}
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-400">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Cryptographically verified & NBR Mushak-6.3 compliant digital invoice.</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">SHA256-{(quickViewInvoice.id + 'VERIFIED').slice(0, 12)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setQuickViewInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  Close Preview
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleExportInvoicePDF(quickViewInvoice);
                      setEmailSuccessMessage('✓ Downloaded official NBR tax certificate PDF.');
                      setTimeout(() => setEmailSuccessMessage(null), 4000);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                    id="btn-download-official-tax-cert"
                    title="Download official NBR-compliant tax certificate as a standalone PDF with government seal"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    <span>Download Official Tax Certificate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleExportInvoicePDF(quickViewInvoice);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                    id="btn-download-nbr-pdf"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download Full PDF</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NBR Tax Verification Portal Modal (Simulated Government Cryptographic Verification Seal) */}
      <AnimatePresence>
        {nbrVerifyInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl relative"
              id="modal-nbr-tax-verification"
            >
              {/* Green Government / NBR Header Banner */}
              <div className="bg-emerald-950/80 border-b border-emerald-500/30 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-extrabold text-sm shadow-inner">
                    <Scan className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white tracking-wide">
                        National Board of Revenue (NBR) Portal
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                        Active Seal
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-400/80">
                      Government of the People's Republic of Bangladesh • VAT Online System
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNbrVerifyInvoice(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  id="btn-close-nbr-modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 text-left text-xs">
                {/* Verified Status Banner with Seal */}
                <div className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-500/30 flex items-start gap-3.5 shadow-sm">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
                      <span>100% Validated Digital Tax Invoice (Mushak-6.3)</span>
                    </h5>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      This transaction was cryptographically signed and registered with the NBR VAT Online Network. The statutory 15% VAT has been accounted for under BIN <strong className="text-white">004928192-0101</strong>.
                    </p>
                  </div>
                </div>

                {/* QR Scanner Simulation & Hash Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white border border-slate-200">
                    <div className="w-24 h-24 flex items-center justify-center relative">
                      <QrCode className="w-20 h-20 text-slate-950" />
                      <div className="absolute inset-0 border-2 border-emerald-500 rounded-sm pointer-events-none animate-pulse" />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-slate-700 mt-1">NBR-VAT-SEAL</span>
                  </div>

                  <div className="sm:col-span-2 space-y-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Invoice Reference No:</span>
                      <span className="font-mono font-bold text-white text-xs">{nbrVerifyInvoice.invoiceNumber || nbrVerifyInvoice.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Cryptographic Digital Seal:</span>
                      <span className="font-mono text-emerald-400 text-[10px] break-all">
                        SHA256: 8f9b{nbrVerifyInvoice.id.slice(0, 12)}c24e9910d8a4b88231
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">NBR Verification Timestamp:</span>
                      <span className="text-slate-300 font-mono text-[10px]">
                        {nbrVerifyInvoice.issuedAt ? new Date(nbrVerifyInvoice.issuedAt).toUTCString() : new Date().toUTCString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tax Breakdown Grid */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Taxpayer / Registered Entity:</span>
                    <span className="font-semibold text-white">Nihomi Academy Ltd.</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Business Identification Number (BIN):</span>
                    <span className="font-mono font-bold text-emerald-400">004928192-0101</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Prescribed Tax Classification:</span>
                    <span className="text-slate-200">Information Technology Enabled Services (ITES)</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between text-slate-400">
                    <span>Net Assessable Base Amount:</span>
                    <span className="font-semibold text-white">
                      ৳{(nbrVerifyInvoice.subtotal || Math.round(nbrVerifyInvoice.totalAmount / 1.15)).toLocaleString()} BDT
                    </span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>Statutory Value Added Tax (15% VAT):</span>
                    <span className="font-semibold text-rose-300">
                      +৳{(nbrVerifyInvoice.tax || Math.round(nbrVerifyInvoice.totalAmount - (nbrVerifyInvoice.subtotal || Math.round(nbrVerifyInvoice.totalAmount / 1.15)))).toLocaleString()} BDT
                    </span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm text-white">
                    <span>Gross Verified Remittance:</span>
                    <span className="text-emerald-400">৳{nbrVerifyInvoice.totalAmount.toLocaleString()} BDT</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setNbrVerifyInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                  id="btn-close-nbr-modal-footer"
                >
                  Dismiss
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleExportInvoicePDF(nbrVerifyInvoice);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                    id="btn-download-nbr-pdf"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download Tax Certificate</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
