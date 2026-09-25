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
  Compass,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FounderCommandCenterViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const FounderCommandCenterView: React.FC<FounderCommandCenterViewProps> = ({ onNavigate }) => {
  const { user, login, loginWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'ai-ceo' | 'approvals' | 'departments' | 'tasks' | 'budget' | 'emergency'
  >('overview');

  // Executive Login & Gatekeeper State
  const [founderEmailInput, setFounderEmailInput] = useState('mdtanvirkabirbiplob@gmail.com');
  const [founderPasscodeInput, setFounderPasscodeInput] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const isAuthorizedFounder = Boolean(
    user &&
    (user.role === 'founder' || user.email?.toLowerCase() === 'mdtanvirkabirbiplob@gmail.com')
  );

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

  // Gate 3: AI COO Modals & Telemetry
  const [isDailyBriefModalOpen, setIsDailyBriefModalOpen] = useState(false);
  const [dailyBriefData, setDailyBriefData] = useState<any | null>(null);
  const [isBriefLoading, setIsBriefLoading] = useState(false);

  const [isDecomposeModalOpen, setIsDecomposeModalOpen] = useState(false);
  const [decomposeForm, setDecomposeForm] = useState({
    goal: 'Scale NIHOMI N5 Japanese Acquisition & Baito Relocation',
    targetMrr: 10000,
    market: 'Bangladesh',
    customerSegment: 'University Engineers & Nursing Candidates',
    timeframe: '30 days',
    budget: 50000
  });
  const [decomposedPlan, setDecomposedPlan] = useState<any | null>(null);
  const [isDecomposing, setIsDecomposing] = useState(false);

  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [isLedgerLoading, setIsLedgerLoading] = useState(false);

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
    if (isAuthorizedFounder) {
      fetchAllFounderData();
    } else {
      setIsLoading(false);
    }
  }, [fetchAllFounderData, isAuthorizedFounder]);

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

  // Gate 3: Generate Daily CEO Brief
  const handleGenerateDailyBrief = async () => {
    setIsBriefLoading(true);
    setIsDailyBriefModalOpen(true);
    try {
      const res = await fetch('/api/founder/ai-coo/daily-brief', {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success && data.brief) {
        setDailyBriefData(data.brief);
      }
    } catch (err) {
      console.error('Error generating daily brief:', err);
    } finally {
      setIsBriefLoading(false);
    }
  };

  // Gate 3: Decompose Strategic Objective
  const handleDecomposeObjective = async () => {
    setIsDecomposing(true);
    try {
      const res = await fetch('/api/founder/ai-coo/decompose-objective', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(decomposeForm)
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setDecomposedPlan(data.plan);
      }
    } catch (err) {
      console.error('Error decomposing objective:', err);
    } finally {
      setIsDecomposing(false);
    }
  };

  // Gate 3: Fetch AI Action Ledger
  const handleFetchLedger = async () => {
    setIsLedgerLoading(true);
    setIsLedgerModalOpen(true);
    try {
      const res = await fetch('/api/founder/ai-coo/action-ledger?limit=50', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success && data.ledger) {
        setLedgerEntries(data.ledger);
      }
    } catch (err) {
      console.error('Error fetching action ledger:', err);
    } finally {
      setIsLedgerLoading(false);
    }
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'ALL') return true;
    return t.status.toUpperCase() === taskFilter;
  });

  const handleFounderLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!founderEmailInput.trim() || !founderPasscodeInput) {
      setAuthError('Email and executive passcode are required.');
      return;
    }
    setIsAuthorizing(true);
    setAuthError(null);
    try {
      const ok = await login(founderEmailInput.trim(), founderPasscodeInput);
      if (!ok) {
        setAuthError('Authentication failed. Invalid founder credentials.');
      } else {
        fetchAllFounderData();
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication error connecting to server');
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleGoogleFounderLogin = async () => {
    setIsAuthorizing(true);
    setAuthError(null);
    try {
      const ok = await loginWithGoogle();
      if (!ok) {
        setAuthError('Google sign-in was canceled or failed.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Google sign-in error');
    } finally {
      setIsAuthorizing(false);
    }
  };

  // EXECUTIVE GATEKEEPER (Rendered when unauthenticated or unauthorized)
  if (!isAuthorizedFounder) {
    return (
      <div className="min-h-screen bg-[#07070d] text-slate-100 font-sans antialiased flex items-center justify-center p-4 relative overflow-hidden selection:bg-amber-500 selection:text-black">
        {/* Background glow & subtle ambient styling */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.12),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#0e0e18]/95 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.14)] backdrop-blur-2xl relative z-10">
          {/* Header Badge */}
          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-xl shadow-amber-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0b14] rounded-2xl flex items-center justify-center">
                <Crown className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
            </div>

            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/15 text-amber-300 text-[11px] font-mono font-bold rounded-full border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>LEVEL 0 APEX SECURITY</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white">
              Founder Command HQ
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              にほみ 創業者統括本部 • Executive Terminal
            </p>
          </div>

          {/* Contextual Warning / Account status */}
          {user ? (
            <div className="mb-5 p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-xl text-left space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Non-Founder Session Detected</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Signed in as <span className="font-mono text-white font-bold">{user.email}</span> ({user.role}). This account does not possess Level 0 Executive clearance.
              </p>
              <button
                type="button"
                onClick={() => logout()}
                className="btn-haptic w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400" />
                <span>Switch to Founder Account</span>
              </button>
            </div>
          ) : (
            <div className="mb-5 p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-left">
              <p className="text-xs text-slate-400 leading-relaxed">
                Executive authentication required to access real-time financial telemetry, AI department orchestrators, and kill-switches.
              </p>
            </div>
          )}

          {/* Error Alert */}
          {authError && (
            <div className="mb-5 p-3 bg-red-950/60 border border-red-500/50 rounded-xl flex items-center space-x-2 text-red-200 text-xs text-left">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* 1-Click Google Sign-In */}
          <div className="space-y-4">
            <button
              type="button"
              disabled={isAuthorizing}
              onClick={handleGoogleFounderLogin}
              className="btn-haptic w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google (Founder)</span>
            </button>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#0e0e18] px-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                or executive passcode
              </span>
            </div>

            {/* Email + Passcode Form */}
            <form onSubmit={handleFounderLogin} className="space-y-3 text-left">
              <div>
                <label className="block text-[11px] font-mono font-medium text-slate-300 mb-1">
                  Founder Email
                </label>
                <input
                  type="email"
                  value={founderEmailInput}
                  onChange={(e) => setFounderEmailInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="mdtanvirkabirbiplob@gmail.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-medium text-slate-300 mb-1">
                  Executive Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    value={founderPasscodeInput}
                    onChange={(e) => setFounderPasscodeInput(e.target.value)}
                    required
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Enter founder passcode"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthorizing}
                className="btn-haptic w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50 mt-1"
              >
                {isAuthorizing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Authorize Executive Session</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={() => onNavigate('portal')}
              className="hover:text-amber-400 flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Public Site →
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                  <h3 className="text-base font-bold text-white">AI COO Command & Orchestration Hub</h3>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold rounded">
                    NHO-AI-001
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  READ / ANALYZE / PLAN / DELEGATE / REPORT • Sovereign Gated • Reports to Founder
                </p>
              </div>

              {/* Executive Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleGenerateDailyBrief}
                  disabled={isBriefLoading}
                  className="px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isBriefLoading ? 'Generating...' : 'Daily CEO Brief'}</span>
                </button>

                <button
                  onClick={() => setIsDecomposeModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Decompose Objective</span>
                </button>

                <button
                  onClick={handleFetchLedger}
                  disabled={isLedgerLoading}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-300 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>Action Ledger</span>
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
                EXECUTIVE DIRECTIVES (বাংলা কম্যান্ডস — ভেরিফাইড ডাটা সোর্স)
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'আজকে পুরো অফিসের আপডেট দাও।',
                  'আজকে কী কী কাজ চলছে?',
                  'কোন department blocked?',
                  'আমার MRR status কী?',
                  'আমার target-এর gap কত?',
                  'আজকের biggest business risk কী?',
                  'আমার approval কী কী?',
                  'এই সপ্তাহের priority কী হওয়া উচিত?',
                  'Marketing department-এর current work কী?',
                  'Content pipeline-এর অবস্থা কী?',
                  'Product-এর biggest bottleneck কী?'
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChat(prompt)}
                    disabled={isChatSending}
                    className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-amber-300 font-medium rounded-full transition-all hover:border-amber-500/50 cursor-pointer text-left"
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

      {/* ==================================================================== */}
      {/* MODAL 5: DAILY CEO BRIEF */}
      {/* ==================================================================== */}
      {isDailyBriefModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#0e0e1a] border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Daily CEO Executive Brief</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Generated by AI COO (NHO-AI-001) • Verified Telemetry
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDailyBriefModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isBriefLoading ? (
              <div className="p-12 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <p className="text-sm text-slate-300">Synthesizing 21-section executive brief from database tables...</p>
              </div>
            ) : dailyBriefData ? (
              <div className="space-y-6 text-xs text-slate-300">
                {/* Executive Summary */}
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-amber-400 block">EXECUTIVE SUMMARY</span>
                  <p className="text-slate-100 text-sm leading-relaxed">{dailyBriefData.executive_summary}</p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#12121f] rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">CURRENT MRR</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">৳{dailyBriefData.sections?.mrr?.current_mrr?.toLocaleString()} BDT</span>
                  </div>
                  <div className="p-3 bg-[#12121f] rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">MRR TARGET</span>
                    <span className="text-base font-bold text-white font-mono">${dailyBriefData.sections?.mrr?.target_mrr?.toLocaleString()} USD</span>
                  </div>
                  <div className="p-3 bg-[#12121f] rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">ACTIVE SUBSCRIBERS</span>
                    <span className="text-base font-bold text-indigo-300 font-mono">{dailyBriefData.sections?.paid_members?.active_count} members</span>
                  </div>
                  <div className="p-3 bg-[#12121f] rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">REMAINING BUDGET</span>
                    <span className="text-base font-bold text-amber-300 font-mono">৳{dailyBriefData.sections?.budget?.remaining?.toLocaleString()} BDT</span>
                  </div>
                </div>

                {/* Status Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#12121f] rounded-2xl border border-slate-800 space-y-2">
                    <span className="font-bold text-slate-200 block text-xs flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-400" /> Target Market & Customer Segment
                    </span>
                    <p className="text-slate-400">
                      Primary: <span className="text-white">{dailyBriefData.sections?.market_status?.primary}</span> | Secondary: <span className="text-white">{dailyBriefData.sections?.market_status?.secondary}</span>
                    </p>
                    <p className="text-slate-400">
                      Segment: <span className="text-white">{dailyBriefData.sections?.market_status?.segment}</span>
                    </p>
                  </div>

                  <div className="p-4 bg-[#12121f] rounded-2xl border border-slate-800 space-y-2">
                    <span className="font-bold text-slate-200 block text-xs flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" /> AI Cost Guard & Marketing
                    </span>
                    <p className="text-slate-400">
                      AI Cost: ৳{dailyBriefData.sections?.ai_cost?.spend_mtd} / ৳{dailyBriefData.sections?.ai_cost?.cap}
                    </p>
                    <p className="text-slate-400">
                      Marketing: ৳{dailyBriefData.sections?.marketing?.spend_mtd} / ৳{dailyBriefData.sections?.marketing?.cap}
                    </p>
                  </div>
                </div>

                {/* Priorities & Next Actions */}
                <div className="p-4 bg-[#12121f] rounded-2xl border border-slate-800 space-y-3">
                  <span className="font-bold text-amber-300 block text-xs uppercase tracking-wider font-mono">
                    TODAY'S EXECUTIVE PRIORITIES & NEXT ACTIONS
                  </span>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                    {dailyBriefData.sections?.todays_priorities?.map((p: string, i: number) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(dailyBriefData, null, 2));
                  alert('Brief copied to clipboard!');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
              >
                Copy JSON
              </button>
              <button
                onClick={() => setIsDailyBriefModalOpen(false)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 6: DECOMPOSE STRATEGIC OBJECTIVE */}
      {/* ==================================================================== */}
      {isDecomposeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#0e0e1a] border border-slate-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Decompose Strategic Objective</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    AI COO Objective Breakdown: Goal → Initiatives → Department Tasks
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsDecomposeModalOpen(false);
                  setDecomposedPlan(null);
                }}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Strategic Goal Statement</label>
                  <input
                    type="text"
                    value={decomposeForm.goal}
                    onChange={(e) => setDecomposeForm({ ...decomposeForm, goal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Target MRR (USD)</label>
                  <input
                    type="number"
                    value={decomposeForm.targetMrr}
                    onChange={(e) => setDecomposeForm({ ...decomposeForm, targetMrr: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Target Geography / Market</label>
                  <input
                    type="text"
                    value={decomposeForm.market}
                    onChange={(e) => setDecomposeForm({ ...decomposeForm, market: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Allocated Budget (BDT)</label>
                  <input
                    type="number"
                    value={decomposeForm.budget}
                    onChange={(e) => setDecomposeForm({ ...decomposeForm, budget: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleDecomposeObjective}
                  disabled={isDecomposing}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center space-x-2 transition-all cursor-pointer shadow-md"
                >
                  {isDecomposing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                  <span>{isDecomposing ? 'Decomposing...' : 'Generate Department Assignments'}</span>
                </button>
              </div>

              {decomposedPlan && (
                <div className="p-5 bg-[#12121f] rounded-2xl border border-emerald-500/30 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-emerald-300">Generated Work Breakdown ({decomposedPlan.tasks?.length} Tasks)</span>
                    <span className="text-[10px] font-mono text-slate-400">Zero External Autonomous Execution</span>
                  </div>

                  <div className="space-y-3">
                    {decomposedPlan.tasks?.map((tsk: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-emerald-400 font-bold text-[11px]">{tsk.task_id}</span>
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded font-mono">{tsk.department}</span>
                            <span className={`px-2 py-0.5 text-[10px] rounded font-mono font-bold ${tsk.authority === 'RED' ? 'bg-red-950 text-red-300' : 'bg-emerald-950 text-emerald-300'}`}>
                              {tsk.authority}
                            </span>
                          </div>
                          <p className="text-slate-200 text-xs">{tsk.objective}</p>
                          <p className="text-[10px] text-slate-400">Owner: {tsk.owner} • Success Metric: {tsk.success_metric}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsDecomposeModalOpen(false);
                  setDecomposedPlan(null);
                }}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 7: AI ACTION LEDGER */}
      {/* ==================================================================== */}
      {isLedgerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#0e0e1a] border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <Activity className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Immutable AI Action Ledger</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Durable Append-Only Record of AI Agent Operations & Decisions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLedgerModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLedgerLoading ? (
              <div className="p-12 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <p className="text-sm text-slate-300">Loading AI action ledger from disk...</p>
              </div>
            ) : ledgerEntries.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                বর্তমানে কোনো এআই অ্যাকশন রেকর্ড নেই।
              </div>
            ) : (
              <div className="space-y-3">
                {ledgerEntries.map((act: any) => (
                  <div key={act.action_id} className="p-4 bg-[#12121f] rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-amber-400 font-bold">{act.action_id}</span>
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-mono rounded text-[10px]">{act.employee_id}</span>
                        <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 font-mono rounded text-[10px]">{act.action_type}</span>
                        <span className={`px-2 py-0.5 font-mono rounded text-[10px] font-bold ${act.authority === 'RED' ? 'bg-red-950 text-red-300' : act.authority === 'YELLOW' ? 'bg-yellow-950 text-yellow-300' : 'bg-emerald-950 text-emerald-300'}`}>
                          {act.authority}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{new Date(act.timestamp).toLocaleTimeString()}</span>
                    </div>

                    <p className="text-white font-medium">{act.goal}</p>
                    <p className="text-slate-400 text-[11px]">{act.decision}</p>
                    <p className="text-emerald-300 text-[10px] font-mono">Outcome: {act.result}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsLedgerModalOpen(false)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};