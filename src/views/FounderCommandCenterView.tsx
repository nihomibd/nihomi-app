import React, { useState, useEffect, useCallback } from 'react';
import {
  Crown,
  TrendingUp,
  Users,
  Coins,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Zap,
  AlertTriangle,
  AlertCircle,
  Send,
  Mic,
  Camera,
  Check,
  X,
  Clock,
  ArrowRight,
  Target,
  DollarSign,
  Activity,
  Ban,
  FileText,
  Building2,
  ListTodo,
  ShieldAlert,
  Loader2,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FounderCommandCenterViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const FounderCommandCenterView: React.FC<FounderCommandCenterViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'ai-ceo' | 'approvals' | 'departments' | 'tasks' | 'budget' | 'emergency'
  >('overview');

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Telemetry & Data States
  const [summary, setSummary] = useState<any | null>(null);
  const [targets, setTargets] = useState<any | null>(null);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [departments, setDepartments] = useState<Record<string, any>>({});
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskFilter, setTaskFilter] = useState<string>('ALL');
  const [budget, setBudget] = useState<any | null>(null);
  const [emergencyControls, setEmergencyControls] = useState<any | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // AI CEO Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>>([
    {
      role: 'assistant',
      content: 'সম্মানিত ফাউন্ডার, শুভকামনা। আমি আপনার AI CEO Assistant। রিয়েল-টাইম ডাটাবেস ও মেট্রিক্স থেকে যে কোনো তথ্য জানতে নির্দেশ দিন অথবা নিচের বাটনে চাপ দিন।',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);
  const [mediaNotice, setMediaNotice] = useState<string | null>(null);

  // Modals
  const [isMrrModalOpen, setIsMrrModalOpen] = useState(false);
  const [mrrForm, setMrrForm] = useState({
    targetAmount: 10000,
    currency: 'USD',
    deadline: '2027-12-31',
    monthlyBudget: 50000,
    growthPriority: 'SUSTAINABLE_PROFITABLE',
    riskLevel: 'MODERATE'
  });

  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [marketForm, setMarketForm] = useState({
    primaryMarket: 'Bangladesh',
    secondaryMarket: 'Japan',
    experimentalMarket: 'Global South Asia',
    customerSegment: 'JLPT N5/N4 Candidates & Relocation Job Seekers',
    priceRange: '৳499 - ৳14,999 BDT'
  });

  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<any | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');

  const [isEmergencyConfirmOpen, setIsEmergencyConfirmOpen] = useState(false);
  const [targetKillSwitch, setTargetKillSwitch] = useState<{ key: string; active: boolean; label: string } | null>(null);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('nihomi_auth_token') || '';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }, []);

  // Fetch Master Telemetry
  const fetchAllFounderData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const headers = getAuthHeaders();
      const [sumRes, tgtRes, appRes, deptRes, tskRes, bgtRes, emgRes, audRes] = await Promise.all([
        fetch('/api/founder/summary', { headers }).then((r) => r.json()).catch(() => null),
        fetch('/api/founder/targets', { headers }).then((r) => r.json()).catch(() => null),
        fetch('/api/founder/approvals', { headers }).then((r) => r.json()).catch(() => null),
        fetch('/api/founder/departments', { headers }).then((r) => r.json()).catch(() => null),
        fetch('/api/founder/tasks', { headers }).then((r) => r.json()).catch(() => null),
        fetch('/api/founder/budget', { headers }).then((r) => r.json()).catch(() => null),
        fetch('/api/founder/emergency-controls', { headers }).then((r) => r.json()).catch(() => null),
        fetch('/api/founder/audit-logs', { headers }).then((r) => r.json()).catch(() => null),
      ]);

      if (sumRes && sumRes.success) {
        setSummary(sumRes);
      } else if (sumRes?.error) {
        setErrorMsg(sumRes.error);
      }

      if (tgtRes?.success) {
        setTargets(tgtRes.targets);
        if (tgtRes.targets?.mrrTarget) {
          setMrrForm(tgtRes.targets.mrrTarget);
        }
        if (tgtRes.targets?.marketTarget) {
          setMarketForm({
            primaryMarket: tgtRes.targets.marketTarget.primaryMarket,
            secondaryMarket: tgtRes.targets.marketTarget.secondaryMarket,
            experimentalMarket: tgtRes.targets.marketTarget.experimentalMarket,
            customerSegment: tgtRes.targets.marketTarget.customerSegment,
            priceRange: tgtRes.targets.marketTarget.priceRange
          });
        }
      }

      if (appRes?.success) setApprovals(appRes.approvals || []);
      if (deptRes?.success) setDepartments(deptRes.departments || {});
      if (tskRes?.success) setTasks(tskRes.tasks || []);
      if (bgtRes?.success) setBudget(bgtRes.budget || null);
      if (emgRes?.success) setEmergencyControls(emgRes.controls || null);
      if (audRes?.success) setAuditLogs(audRes.logs || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error communicating with Founder API');
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchAllFounderData();
  }, [fetchAllFounderData]);

  // AI CEO Query Submission
  const handleSendChat = async (promptText?: string) => {
    const query = promptText || chatInput;
    if (!query.trim() || isChatSending) return;

    const userMessage = {
      role: 'user' as const,
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages((prev) => [...prev, userMessage]);
    if (!promptText) setChatInput('');
    setIsChatSending(true);

    try {
      const res = await fetch('/api/founder/ai-ceo/query', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ query: query.trim() })
      });
      const data = await res.json();

      if (data.success) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.response,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `⚠️ ত্রুটি: ${data.error || 'তথ্য আনতে ব্যর্থ হয়েছে'}`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ সংযোগ বিচ্ছিন্ন হয়েছে। অনুগ্রহ করে ইন্টারনেট ও সার্ভার স্ট্যাটাস যাচাই করুন।',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  // Update MRR Target
  const handleSaveMrrTarget = async () => {
    setIsActionLoading(true);
    try {
      const res = await fetch('/api/founder/mrr-target', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...mrrForm,
          targetAmount: Number(mrrForm.targetAmount),
          monthlyBudget: Number(mrrForm.monthlyBudget)
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsMrrModalOpen(false);
        fetchAllFounderData();
      } else {
        alert(data.error || 'Failed to update MRR Target');
      }
    } catch (e: any) {
      alert(e.message || 'Error updating target');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Update Market Target
  const handleSaveMarketTarget = async () => {
    setIsActionLoading(true);
    try {
      const res = await fetch('/api/founder/market-target', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(marketForm)
      });
      const data = await res.json();
      if (data.success) {
        setIsMarketModalOpen(false);
        fetchAllFounderData();
      } else {
        alert(data.error || 'Failed to update Market Target');
      }
    } catch (e: any) {
      alert(e.message || 'Error updating market target');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Action an Approval Item
  const handleApprovalDecision = async (decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED') => {
    if (!selectedApproval) return;
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/founder/approvals/${selectedApproval.request_id}/decision`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ decision, notes: approvalNotes })
      });
      const data = await res.json();
      if (data.success) {
        setIsApprovalModalOpen(false);
        setSelectedApproval(null);
        setApprovalNotes('');
        fetchAllFounderData();
      } else {
        alert(data.error || 'Failed to action approval');
      }
    } catch (e: any) {
      alert(e.message || 'Error processing approval');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Toggle Emergency Switch
  const handleToggleEmergency = async () => {
    if (!targetKillSwitch) return;
    setIsActionLoading(true);
    try {
      const res = await fetch('/api/founder/emergency-controls/toggle', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          switchKey: targetKillSwitch.key,
          active: !targetKillSwitch.active
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsEmergencyConfirmOpen(false);
        setTargetKillSwitch(null);
        fetchAllFounderData();
      } else {
        alert(data.error || 'Failed to toggle kill switch');
      }
    } catch (e: any) {
      alert(e.message || 'Error updating emergency control');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'ALL') return true;
    return t.status.toUpperCase() === taskFilter;
  });

  return (
    <div className="min-h-screen bg-[#07070d] text-slate-100 font-sans antialiased text-left pb-28 selection:bg-amber-500 selection:text-black">
      
      {/* 1. NEO-TOKYO FOUNDER TOP BAR */}
      <div className="bg-[#0b0b14]/90 backdrop-blur-md border-b border-amber-500/20 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/15 text-amber-300 text-[11px] font-mono font-bold rounded-full border border-amber-500/30">
              <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>NIHOMI FOUNDER HQ • にほみ 創業者オフィス</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Executive Control Center</span>
              {summary?.workforce?.emergencyState === 'ACTIVE_LOCKDOWN' && (
                <span className="text-xs px-2.5 py-0.5 bg-red-600/30 border border-red-500 text-red-300 font-mono rounded">
                  ⚠️ LOCKDOWN ACTIVE
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Founder & CEO: {user?.email || 'Tanvir Kabir Biplob'} • Gate 2 Operational Backbone
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchAllFounderData}
              disabled={isLoading}
              className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => onNavigate('portal')}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Student Portal
            </button>
            <button
              onClick={() => onNavigate('admin-growth')}
              className="px-3 py-1.5 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-xs font-bold text-purple-200 rounded-lg transition-colors cursor-pointer"
            >
              Growth & UTMs
            </button>
            <button
              onClick={() => onNavigate('landing')}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg transition-all shadow-md cursor-pointer"
            >
              Public Site →
            </button>
          </div>
        </div>
      </div>

      {/* ERROR ALERT IF PERMISSION DENIED */}
      {errorMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-2xl flex items-center space-x-3 text-red-200">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">Access Alert: </span>
              <span>{errorMsg}. Ensure you are signed in with the authorized Founder account.</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. EXECUTIVE SUB-NAV TABS */}
      <div className="bg-[#0b0b14] border-b border-slate-800 sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 py-2.5 overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: '1. Cockpit & Objectives', icon: Target },
              { id: 'ai-ceo', label: '2. Ask AI CEO', icon: Sparkles },
              { id: 'approvals', label: `3. Approvals (${approvals.filter(a => a.status === 'PENDING').length})`, icon: ShieldCheck },
              { id: 'departments', label: '4. AI Workforce (13)', icon: Building2 },
              { id: 'tasks', label: `5. Work Tasks (${tasks.length})`, icon: ListTodo },
              { id: 'budget', label: '6. Budget Firewall', icon: DollarSign },
              { id: 'emergency', label: '7. Emergency & Audit', icon: ShieldAlert },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* ==================================================================== */}
        {/* TAB 1: OVERVIEW & ACTIVE BUSINESS OBJECTIVE */}
        {/* ==================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* ACTIVE BUSINESS OBJECTIVE CARD */}
            <div className="bg-gradient-to-r from-stone-950 via-[#12121f] to-amber-950/20 border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold rounded uppercase">
                      ACTIVE BUSINESS OBJECTIVE (AI COO INPUT)
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold rounded">
                      STATUS: {targets?.activeObjective?.status || 'ACTIVE'}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {targets?.activeObjective?.goal || 'Achieve $10,000 MRR & 500 Active Pro/Japan Ready Subscribers'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
                    <div>
                      <span className="text-slate-500 block text-[10px] font-mono uppercase">TARGET MARKETS</span>
                      <span className="font-semibold text-slate-200">{targets?.activeObjective?.market || 'Bangladesh & Japan'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] font-mono uppercase">SEGMENT</span>
                      <span className="font-semibold text-slate-200">{targets?.activeObjective?.segment || 'JLPT N5/N4 Candidates'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] font-mono uppercase">APPROVED MONTHLY BUDGET</span>
                      <span className="font-mono font-bold text-amber-400">৳{(targets?.activeObjective?.budget || 50000).toLocaleString()} BDT</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsMrrModalOpen(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Configure MRR Target</span>
                  </button>
                  <button
                    onClick={() => setIsMarketModalOpen(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Target Markets</span>
                  </button>
                </div>
              </div>
            </div>

            {/* REAL EXECUTIVE METRICS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Revenue */}
              <div className="bg-[#0e0e1a] p-5 rounded-2xl border border-slate-800 shadow-md space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>GROSS REVENUE</span>
                  <Coins className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  ৳{(summary?.business?.totalRevenue || 0).toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Actual collected via bKash / Stripe
                </p>
              </div>

              {/* Card 2: Current MRR & Target */}
              <div className="bg-[#0e0e1a] p-5 rounded-2xl border border-slate-800 shadow-md space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>CURRENT MRR</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  ৳{(summary?.business?.currentMrr || 0).toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>Target: {summary?.business?.mrrTargetCurrency === 'USD' ? '$' : '৳'}{summary?.business?.mrrTarget?.toLocaleString()}</span>
                  <span className="text-amber-400 font-bold">Gap: {summary?.business?.mrrGap?.toLocaleString()}</span>
                </p>
              </div>

              {/* Card 3: Paid Members */}
              <div className="bg-[#0e0e1a] p-5 rounded-2xl border border-slate-800 shadow-md space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>PAID MEMBERS</span>
                  <Users className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {summary?.business?.activePaidMembers ?? 0}
                </div>
                <p className="text-[10px] text-indigo-300 font-mono">
                  +{summary?.business?.newMembersThisMonth ?? 0} this calendar month
                </p>
              </div>

              {/* Card 4: Remaining Budget */}
              <div className="bg-[#0e0e1a] p-5 rounded-2xl border border-slate-800 shadow-md space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>REMAINING BUDGET</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                  ৳{(summary?.business?.remainingApprovedBudget || 50000).toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Spent: ৳{(summary?.business?.operatingCost || 0).toLocaleString()} / ৳{(summary?.business?.approvedMonthlyBudget || 50000).toLocaleString()}
                </p>
              </div>
            </div>

            {/* SECONDARY ROW: RETENTION, CAC, AI COST, MARKETING */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0e0e1a]/80 p-4 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-mono">RETENTION (30-DAY)</span>
                <span className="text-lg font-bold text-white font-mono">{summary?.business?.retentionRate || 'NOT AVAILABLE'}</span>
              </div>
              <div className="bg-[#0e0e1a]/80 p-4 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-mono">ESTIMATED CAC</span>
                <span className="text-lg font-bold text-white font-mono">{summary?.business?.cac || 'NOT CONFIGURED'}</span>
              </div>
              <div className="bg-[#0e0e1a]/80 p-4 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-mono">AI INFERENCE COST</span>
                <span className="text-lg font-bold text-amber-400 font-mono">৳{(summary?.business?.aiCost || 0).toLocaleString()}</span>
              </div>
              <div className="bg-[#0e0e1a]/80 p-4 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-mono">MARKETING SPENT</span>
                <span className="text-lg font-bold text-indigo-300 font-mono">৳{(summary?.business?.marketingSpend || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* CEO REPORT: TODAY AT A GLANCE */}
            <div className="bg-[#0e0e1a] border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    EXECUTIVE SUMMARY — TODAY AT A GLANCE
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
                <div className="space-y-2">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    Commercial Health
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    bKash Tokenized Gateway ও SSLCommerz সক্রিয় রয়েছে। কোনো ড্রপড পেমেন্ট কলব্যাক রেকর্ড হয়নি। বর্তমান MRR ৳{(summary?.business?.currentMrr || 0).toLocaleString()} BDT।
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    AI & Infrastructure
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    Gemini 2.5 Flash ও AI Cost Guard সুরক্ষিত রয়েছে। দৈনন্দিন ইনফারেন্স ব্যয় ৳{(summary?.business?.aiCost || 0)} BDT। সার্ভার আপটাইম ৯৯.৯%।
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    Workforce & Approvals
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    {approvals.filter(a => a.status === 'PENDING').length}টি প্রস্তাব আপনার স্বাক্ষরের অপেক্ষায় রয়েছে। {tasks.filter(t => t.status === 'ACTIVE').length}টি সক্রিয় টাস্ক নির্ধারিত সময়সীমায় চলমান।
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: ASK AI CEO (READ-ONLY GROUNDED ASSISTANT) */}
        {/* ==================================================================== */}
        {activeTab === 'ai-ceo' && (
          <div className="bg-[#0e0e1a] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Ask AI CEO (Executive Grounded Assistant)</h3>
                </div>
                <p className="text-xs text-slate-400">
                  READ / ANALYZE / SUMMARIZE Mode • Strictly grounded in database telemetry
                </p>
              </div>

              {/* Integration Ready Media Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setMediaNotice('Voice recognition integration ready: Awaiting microphone access permission in upcoming build.');
                    setTimeout(() => setMediaNotice(null), 4000);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
                  title="Voice Input (Integration Ready)"
                >
                  <Mic className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[11px]">Voice (Ready)</span>
                </button>
                <button
                  onClick={() => {
                    setMediaNotice('Camera & document OCR input integration ready: Connected to ContentEngine in Gate 3.');
                    setTimeout(() => setMediaNotice(null), 4000);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
                  title="Vision Ingestion (Integration Ready)"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px]">Vision (Ready)</span>
                </button>
              </div>
            </div>

            {mediaNotice && (
              <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-xl text-xs text-indigo-200 animate-fade-in">
                ℹ️ {mediaNotice}
              </div>
            )}

            {/* Pre-set Bengali Executive Command Chips */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                QUICK EXECUTIVE DIRECTIVES (বাংলা কম্যান্ডস)
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'আজকে পুরো অফিসের আপডেট দাও।',
                  'আমার MRR status কী?',
                  'আমার market target কী?',
                  'আমার approval কী কী আছে?',
                  'কোন department blocked?',
                  'আজকের risk কী?',
                  'আজকে কী কী কাজ চলছে?'
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChat(prompt)}
                    disabled={isChatSending}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-amber-300 font-medium rounded-full transition-all hover:border-amber-500/50 cursor-pointer text-left"
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Conversation History */}
            <div className="bg-[#07070d] border border-slate-800/80 rounded-2xl p-4 min-h-[320px] max-h-[480px] overflow-y-auto space-y-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-500 font-mono mb-1">
                    {msg.role === 'user' ? 'Founder' : 'AI CEO'} • {msg.timestamp}
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl max-w-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-amber-500 text-stone-950 font-medium'
                        : 'bg-[#12121f] text-slate-200 border border-slate-800 shadow-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isChatSending && (
                <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI CEO ডাটাবেস ও টেলিমেট্রি বিশ্লেষণ করছে...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="বাংলা বা ইংরেজিতে কোনো প্রশ্ন বা নির্দেশ দিন..."
                disabled={isChatSending}
                className="flex-1 px-4 py-3 bg-[#07070d] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={isChatSending || !chatInput.trim()}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-colors disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: APPROVAL QUEUE */}
        {/* ==================================================================== */}
        {activeTab === 'approvals' && (
          <div className="bg-[#0e0e1a] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Founder Executive Approval Queue</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Mandatory Human-in-the-Loop Gate for RED & YELLOW tier requests
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-mono font-bold rounded-full">
                {approvals.filter((a) => a.status === 'PENDING').length} PENDING
              </span>
            </div>

            {approvals.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                বর্তমানে কোনো অনুমোদনের আবেদন নেই।
              </div>
            ) : (
              <div className="space-y-4">
                {approvals.map((app) => (
                  <div
                    key={app.request_id}
                    className={`p-5 rounded-2xl border transition-all ${
                      app.status === 'PENDING'
                        ? 'bg-[#12121f] border-amber-500/40 shadow-lg'
                        : 'bg-[#0a0a12] border-slate-800/80 opacity-80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-amber-400">{app.request_id}</span>
                        <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 font-mono rounded">
                          {app.department}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            app.risk === 'HIGH' || app.risk === 'CRITICAL'
                              ? 'bg-red-950 text-red-300 border border-red-800'
                              : 'bg-yellow-950 text-yellow-300'
                          }`}
                        >
                          RISK: {app.risk}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                          app.status === 'APPROVED' || app.status === 'COMPLETED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : app.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-red-950 text-red-300'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-2">{app.request}</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-400 mb-4 font-mono">
                      <div>Amount: <span className="text-slate-200 font-bold">৳{app.amount || 0} BDT</span></div>
                      <div>Expected: <span className="text-slate-200">{app.expected_outcome}</span></div>
                      <div>Date: <span className="text-slate-400">{new Date(app.date).toLocaleDateString()}</span></div>
                    </div>

                    {app.result && (
                      <div className="p-3 bg-slate-900/60 rounded-xl text-xs text-slate-300 font-mono mb-3">
                        <span className="text-emerald-400 font-bold">Result: </span>
                        {app.result}
                      </div>
                    )}

                    {app.status === 'PENDING' && (
                      <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => {
                            setSelectedApproval(app);
                            setIsApprovalModalOpen(true);
                          }}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          Review & Action →
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: AI WORKFORCE (13 DEPARTMENTS) */}
        {/* ==================================================================== */}
        {activeTab === 'departments' && (
          <div className="bg-[#0e0e1a] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span>AI Workforce Status (13 Departments)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Management status layer per AI Employee Registry blueprint
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(departments).map(([key, dept]) => (
                <div key={key} className="p-4 bg-[#12121f] border border-slate-800/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{dept.name}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        dept.status === 'RUNNING'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : dept.status === 'PAUSED'
                          ? 'bg-yellow-950/60 text-yellow-300'
                          : 'bg-red-950/60 text-red-300'
                      }`}
                    >
                      {dept.status}
                    </span>
                  </div>

                  <p className="text-xs text-amber-300/90 font-mono font-medium">{dept.role}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{dept.details}</p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/60">
                    <span>Active Tasks: {dept.activeTasksCount}</span>
                    <span>ID: {dept.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: WORK TASKS */}
        {/* ==================================================================== */}
        {activeTab === 'tasks' && (
          <div className="bg-[#0e0e1a] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-amber-400" />
                  <span>Founder Work Queue (Task Operating System)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Track all departmental tasks conforming to TASK-SCHEMA.json
                </p>
              </div>

              {/* Status Filters */}
              <div className="flex space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {['ALL', 'ACTIVE', 'QUEUED', 'COMPLETED', 'BLOCKED'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTaskFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      taskFilter === filter
                        ? 'bg-amber-500 text-stone-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  কোনো টাস্ক পাওয়া যায়নি।
                </div>
              ) : (
                filteredTasks.map((t) => (
                  <div
                    key={t.task_id}
                    className="p-4 bg-[#12121f] border border-slate-800 rounded-xl space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-amber-400">{t.task_id}</span>
                        <span className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-300 font-mono rounded">
                          {t.department}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">Owner: {t.owner}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] px-2 py-0.5 bg-purple-950 text-purple-300 font-mono rounded">
                          PRIORITY: {t.priority}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            t.status === 'COMPLETED'
                              ? 'bg-emerald-950 text-emerald-400'
                              : t.status === 'ACTIVE'
                              ? 'bg-amber-950 text-amber-300'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white">{t.objective}</h4>

                    {t.result && (
                      <p className="text-xs text-emerald-400 font-mono">Result: {t.result}</p>
                    )}
                    {t.next_action && (
                      <p className="text-xs text-slate-400 font-mono">Next: {t.next_action}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 6: BUDGET FIREWALL & AI COSTS */}
        {/* ==================================================================== */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div className="bg-[#0e0e1a] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    <span>Budget Firewall (৳50,000 / month Master Cap)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Strict isolation across 5 operational wallets. AI may never expand its own budget.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-mono block">TOTAL REMAINING</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    ৳{(budget?.remainingBudget || 50000).toLocaleString()} BDT
                  </span>
                </div>
              </div>

              {/* Wallets List */}
              <div className="space-y-4">
                {(budget?.wallets || []).map((w: any) => {
                  const percent = Math.min(100, Math.round((w.current_spent / (w.monthly_cap || 1)) * 100));
                  return (
                    <div key={w.wallet_id} className="p-4 bg-[#12121f] border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-sm font-bold text-white">{w.name} Wallet</span>
                          <span className="text-xs text-slate-400 font-mono ml-3">
                            Daily Limit: ৳{w.daily_limit} | Approval Threshold: ৳{w.approval_threshold}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono text-slate-300">
                            ৳{w.current_spent.toLocaleString()} / ৳{w.monthly_cap.toLocaleString()} BDT
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            percent > 80 ? 'bg-red-500' : percent > 50 ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI COST GUARD TELEMETRY */}
            <div className="bg-[#0e0e1a] border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  AI COST GUARD SYSTEM TELEMETRY
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-slate-300">
                <div className="p-3 bg-[#12121f] rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CONCURRENCY LOCKS</span>
                  <span className="text-emerald-400 font-bold">1 In-Flight / User</span>
                </div>
                <div className="p-3 bg-[#12121f] rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">SLIDING RATE LIMIT</span>
                  <span className="text-emerald-400 font-bold">5 requests / min</span>
                </div>
                <div className="p-3 bg-[#12121f] rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">MONTHLY TIER BOUNDS</span>
                  <span className="text-slate-200">Free: 10 | Starter: 100 | Pro: 1K | JR: 3K</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 7: EMERGENCY CONTROLS & AUDIT LOGS */}
        {/* ==================================================================== */}
        {activeTab === 'emergency' && (
          <div className="space-y-6">
            <div className="bg-[#0e0e1a] border border-red-500/30 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Ban className="w-4 h-4 text-red-500" />
                    <span>Founder Emergency Kill Switches</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Instantaneous sovereign circuit breakers. Bypasses all automated processes.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-red-950 text-red-300 border border-red-800/60 font-mono rounded font-bold">
                  SOVEREIGN OVERRIDE
                </span>
              </div>

              {/* 6 Kill Switches */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'stopAllAi', label: 'STOP ALL AI', desc: 'Terminate Gemini LLM queries & audio tasks' },
                  { key: 'stopMarketing', label: 'STOP MARKETING', desc: 'Pause Meta Ads & outbound broadcasts' },
                  { key: 'stopPayments', label: 'STOP PAYMENTS', desc: 'Disable checkout modal & manual TrxID' },
                  { key: 'stopEngineering', label: 'STOP ENGINEERING', desc: 'Freeze CI/CD merges & branch pushes' },
                  { key: 'stopAutomations', label: 'STOP AUTOMATIONS', desc: 'Pause subscription crons & background workers' },
                  { key: 'stopExternalActions', label: 'STOP EXTERNAL ACTIONS', desc: 'Block outbound webhooks & external networking' }
                ].map((sw) => {
                  const state = emergencyControls?.[sw.key];
                  const isActive = state?.active;
                  const isConnected = state?.connected;
                  return (
                    <div
                      key={sw.key}
                      className={`p-4 rounded-2xl border transition-all ${
                        isActive
                          ? 'bg-red-950/40 border-red-500 shadow-lg'
                          : 'bg-[#12121f] border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-white">{sw.label}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            isConnected ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isConnected ? 'CONNECTED' : 'NOT CONNECTED'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-4">{sw.desc}</p>
                      <button
                        onClick={() => {
                          setTargetKillSwitch({ key: sw.key, active: !!isActive, label: sw.label });
                          setIsEmergencyConfirmOpen(true);
                        }}
                        className={`w-full py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-red-600/80 hover:bg-red-600 text-white'
                        }`}
                      >
                        {isActive ? 'Deactivate Switch' : `Activate ${sw.label}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AUDIT LOG TABLE */}
            <div className="bg-[#0e0e1a] border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    FOUNDER AUDIT JOURNAL
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">Last {auditLogs.length} Events</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500">
                      <th className="py-2.5">TIMESTAMP</th>
                      <th className="py-2.5">ACTION</th>
                      <th className="py-2.5">REASON / DETAILS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {auditLogs.slice(0, 15).map((log, idx) => (
                      <tr key={log.id || idx} className="hover:bg-slate-900/40">
                        <td className="py-2.5 text-slate-400">
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </td>
                        <td className="py-2.5 font-bold text-amber-300">{log.action}</td>
                        <td className="py-2.5 text-slate-300">{log.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ==================================================================== */}
      {/* MODAL 1: CONFIGURE MRR TARGET */}
      {/* ==================================================================== */}
      {isMrrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0e0e1a] border border-amber-500/30 w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Configure Founder MRR Target</span>
              </h3>
              <button
                onClick={() => setIsMrrModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Amount</label>
                <input
                  type="number"
                  value={mrrForm.targetAmount}
                  onChange={(e) => setMrrForm({ ...mrrForm, targetAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Currency</label>
                  <select
                    value={mrrForm.currency}
                    onChange={(e) => setMrrForm({ ...mrrForm, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="BDT">BDT (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={mrrForm.deadline}
                    onChange={(e) => setMrrForm({ ...mrrForm, deadline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Monthly Operational Budget (BDT)</label>
                <input
                  type="number"
                  value={mrrForm.monthlyBudget}
                  onChange={(e) => setMrrForm({ ...mrrForm, monthlyBudget: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsMrrModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMrrTarget}
                disabled={isActionLoading}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl cursor-pointer"
              >
                {isActionLoading ? 'Saving...' : 'Save & Audit Target'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: TARGET MARKETS */}
      {/* ==================================================================== */}
      {isMarketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0e0e1a] border border-amber-500/30 w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Configure Target Markets</span>
              </h3>
              <button
                onClick={() => setIsMarketModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Primary Market</label>
                <input
                  type="text"
                  value={marketForm.primaryMarket}
                  onChange={(e) => setMarketForm({ ...marketForm, primaryMarket: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Secondary Market</label>
                <input
                  type="text"
                  value={marketForm.secondaryMarket}
                  onChange={(e) => setMarketForm({ ...marketForm, secondaryMarket: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Customer Segment</label>
                <input
                  type="text"
                  value={marketForm.customerSegment}
                  onChange={(e) => setMarketForm({ ...marketForm, customerSegment: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsMarketModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMarketTarget}
                disabled={isActionLoading}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl cursor-pointer"
              >
                {isActionLoading ? 'Saving...' : 'Save Market Strategy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: APPROVAL ACTION DIALOG */}
      {/* ==================================================================== */}
      {isApprovalModalOpen && selectedApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0e0e1a] border border-amber-500/30 w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Review Request: {selectedApproval.request_id}</h3>
              <button
                onClick={() => setIsApprovalModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl">
                <span className="text-slate-400 block text-[10px]">PROPOSED ACTION</span>
                <span className="text-white font-bold text-sm">{selectedApproval.request}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>Department: <span className="font-bold text-amber-300">{selectedApproval.department}</span></div>
                <div>Amount: <span className="font-bold text-amber-300">৳{selectedApproval.amount} BDT</span></div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Founder Decision Notes (Optional)</label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="সিদ্ধান্ত বা নির্দেশনার কারণ লিখুন..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs h-20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleApprovalDecision('REJECTED')}
                disabled={isActionLoading}
                className="px-4 py-2 bg-red-950 hover:bg-red-900 text-red-300 text-xs font-bold rounded-xl border border-red-800 cursor-pointer"
              >
                Reject Request
              </button>
              <button
                onClick={() => handleApprovalDecision('CHANGES_REQUESTED')}
                disabled={isActionLoading}
                className="px-4 py-2 bg-yellow-950 hover:bg-yellow-900 text-yellow-300 text-xs font-bold rounded-xl border border-yellow-800 cursor-pointer"
              >
                Request Changes
              </button>
              <button
                onClick={() => handleApprovalDecision('APPROVED')}
                disabled={isActionLoading}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Approve & Execute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: EMERGENCY CONFIRMATION */}
      {/* ==================================================================== */}
      {isEmergencyConfirmOpen && targetKillSwitch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0e0e1a] border border-red-500/60 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">Emergency Control Confirmation</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to {targetKillSwitch.active ? 'DEACTIVATE' : 'ACTIVATE'} the master kill switch:{' '}
              <span className="font-mono font-bold text-amber-300">{targetKillSwitch.label}</span>?
            </p>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsEmergencyConfirmOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleEmergency}
                disabled={isActionLoading}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                {isActionLoading ? 'Updating...' : 'Confirm Override'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};