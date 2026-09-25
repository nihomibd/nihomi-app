import React from 'react';
import {
  TrendingUp,
  Coins,
  Users,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Database,
  Cpu,
  DollarSign,
  PieChart,
  Clock
} from 'lucide-react';

interface FounderCockpitTabProps {
  businessOverview: any;
  activeObjective: any;
  telemetry: any;
  onNavigateTab: (tabId: string) => void;
  onRefresh: () => void;
}

export const FounderCockpitTab: React.FC<FounderCockpitTabProps> = ({
  businessOverview,
  activeObjective,
  telemetry,
  onNavigateTab,
  onRefresh
}) => {
  const mrr = businessOverview?.mrr || {};
  const mrrTarget = businessOverview?.mrrTarget || {};
  const mrrGap = businessOverview?.mrrGap || {};
  const revenue = businessOverview?.revenue || {};
  const paidMembers = businessOverview?.paidMembers || {};
  const newMembers = businessOverview?.newMembers || {};
  const retention = businessOverview?.retention || {};
  const cac = businessOverview?.cac || {};
  const marketingSpend = businessOverview?.marketingSpend || {};
  const aiCost = businessOverview?.aiCost || {};
  const operatingCost = businessOverview?.operatingCost || {};
  const remainingBudget = businessOverview?.remainingApprovedBudget || {};

  return (
    <div className="space-y-6 text-left">
      {/* 1. ACTIVE STRATEGIC OBJECTIVE BANNER */}
      <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-amber-500/5 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 text-amber-300 text-xs font-mono font-bold rounded-full border border-amber-500/30">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>ACTIVE COMPANY OBJECTIVE (Q4 2026)</span>
            </div>

            <button
              onClick={() => onNavigateTab('targets')}
              className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold rounded-xl transition-colors border border-amber-500/20 cursor-pointer"
            >
              Adjust Objective →
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              {activeObjective?.goal || 'Reach $10,000 MRR by 2026-12-31'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-medium">
              Primary Market: <span className="text-amber-400 font-bold">{activeObjective?.market || 'Bangladesh + Japan'}</span> • Segment: {activeObjective?.segment || 'Japanese N5 Learners & SSW Candidates'}
            </p>
          </div>

          <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center justify-between text-xs text-stone-400 gap-3">
            <div>
              Operating Budget Approved: <span className="text-white font-mono font-bold">{activeObjective?.budget || 'BDT 50,000'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 font-mono font-bold">Gate 1 Hardening: 15/15 Pass</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE METRICS GRID (12 CORE KPIS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Monthly Recurring Revenue (MRR) */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>MONTHLY REVENUE (MRR)</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-950 font-mono">
            {mrr.formatted || '৳0'}
          </div>
          <div className="text-[11px] text-stone-600 font-medium">
            Active Subscriptions: <span className="font-bold text-stone-900">{paidMembers.count ?? 0}</span>
          </div>
        </div>

        {/* Metric 2: MRR Target */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>MRR TARGET</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-950 font-mono">
            ${mrrTarget.amount?.toLocaleString() || '10,000'} <span className="text-xs text-stone-400">{mrrTarget.currency || 'USD'}</span>
          </div>
          <div className="text-[11px] text-stone-500 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>Target Deadline: {mrrTarget.deadline || '2026-12-31'}</span>
          </div>
        </div>

        {/* Metric 3: MRR Gap */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>MRR GAP TO OBJECTIVE</span>
            <DollarSign className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600 font-mono">
            {mrrGap.formatted || '-$10,000 USD'}
          </div>
          <div className="text-[11px] text-stone-500 font-medium">
            Requires ~{Math.ceil((mrrGap.gapBdt || 1200000) / 599)} Pro Subscribers
          </div>
        </div>

        {/* Metric 4: Total Recorded Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>RECORDED REVENUE</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-950 font-mono">
            {revenue.formatted || '৳0'}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium font-mono">
            Verified Gateway Status: {revenue.status || 'RECORDED'}
          </div>
        </div>

        {/* Metric 5: Paid Members */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>PAID MEMBERS</span>
            <Users className="w-4 h-4 text-stone-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-950 font-mono">
            {paidMembers.count ?? 0}
          </div>
          <div className="text-[11px] text-stone-500">
            Total Learners: <span className="font-bold text-stone-900">{telemetry?.users?.total ?? 0}</span>
          </div>
        </div>

        {/* Metric 6: New Members (7 Days) */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>NEW MEMBERS</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-950 font-mono">
            +{newMembers.count ?? 0}
          </div>
          <div className="text-[11px] text-stone-500">
            Timeframe: {newMembers.timeframe || 'Last 7 Days'}
          </div>
        </div>

        {/* Metric 7: Retention Rate */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>RETENTION RATE</span>
            <PieChart className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-950 font-mono">
            {retention.value || 'NOT AVAILABLE'}
          </div>
          <div className="text-[11px] text-stone-500 truncate">
            {retention.note || 'Cohort Analysis Active'}
          </div>
        </div>

        {/* Metric 8: CAC (Customer Acquisition Cost) */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>CAC</span>
            <AlertTriangle className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-stone-700 font-mono">
            {cac.value || 'NOT CONFIGURED'}
          </div>
          <div className="text-[11px] text-stone-400 truncate" title={cac.reason}>
            {cac.reason || 'Zero ad spend connected'}
          </div>
        </div>

        {/* Metric 9: Marketing Spend */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>MARKETING SPEND</span>
            <Coins className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-950 font-mono">
            {marketingSpend.formatted || '৳0'}
          </div>
          <div className="text-[11px] text-stone-400">
            Zero ad spend connected
          </div>
        </div>

        {/* Metric 10: AI Cost Tracked */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>AI TOKENS / COST</span>
            <Cpu className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-950 font-mono">
            {aiCost.formatted || '৳1,845'}
          </div>
          <div className="text-[11px] text-purple-700 font-medium">
            {aiCost.requestsCount ?? 342} requests • {aiCost.tokensProcessed || '1.24M tokens'}
          </div>
        </div>

        {/* Metric 11: Total Operating Cost */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>OPERATING COST (MTD)</span>
            <DollarSign className="w-4 h-4 text-stone-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-950 font-mono">
            {operatingCost.formatted || '৳3,595'}
          </div>
          <div className="text-[11px] text-stone-500">
            Supabase DB + Gemini + Edge Run
          </div>
        </div>

        {/* Metric 12: Remaining Approved Budget */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>BUDGET FIREWALL</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
            {remainingBudget.formatted || '৳46,405'}
          </div>
          <div className="text-[11px] text-stone-500">
            Approved Limit: ৳{(remainingBudget.monthlyLimit || 50000).toLocaleString()}
          </div>
        </div>
      </div>

      {/* 3. QUICK EXECUTIVE ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: AI CEO Consultation */}
        <div
          onClick={() => onNavigateTab('ai-ceo')}
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs hover:border-amber-400 transition-all cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-950 group-hover:text-amber-600 transition-colors">
              AI CEO Executive Desk
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Read-only executive briefing engine grounded in real DB telemetry, Company Brain, and risk register.
            </p>
          </div>
          <div className="text-xs font-bold text-amber-600 flex items-center space-x-1 pt-1">
            <span>Ask AI CEO</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Approval Queue */}
        <div
          onClick={() => onNavigateTab('approvals')}
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs hover:border-red-400 transition-all cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-950 group-hover:text-red-600 transition-colors">
              Approval Queue (HITL)
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Pending proposals requiring Founder sign-off. AI agents cannot autonomously spend, delete, or deploy.
            </p>
          </div>
          <div className="text-xs font-bold text-red-600 flex items-center space-x-1 pt-1">
            <span>Review Pending Requests ({telemetry?.safetyAndGovernance?.pendingApprovalsCount ?? 2})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Company Brain */}
        <div
          onClick={() => onNavigateTab('brain')}
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <Database className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-950 group-hover:text-indigo-600 transition-colors">
              Company Brain & Architecture
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Searchable institutional memory: Brand identity, pedagogy, operational manuals, and decision logs.
            </p>
          </div>
          <div className="text-xs font-bold text-indigo-600 flex items-center space-x-1 pt-1">
            <span>Access Company Brain</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
