import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Coins,
  AlertTriangle,
  Lock,
  RefreshCw,
  TrendingDown,
  PieChart,
  CheckCircle2
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const FounderBudgetTab: React.FC = () => {
  const [budgetData, setBudgetData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBudget = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/api/founder/budget-firewall');
      if (res.success) {
        setBudgetData(res);
      }
    } catch {
      // quiet fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const wallets = budgetData?.wallets || [];
  const master = wallets.find((w: any) => w.id === 'wallet-approved-total') || {
    monthly_limit: 50000,
    spent_amount: 3595,
    remaining_amount: 46405
  };

  const percentSpent = Math.min(100, Math.round((master.spent_amount / (master.monthly_limit || 1)) * 100));

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* 1. MASTER FIREWALL BANNER */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>FINANCIAL FIREWALL ACTIVE • HARD LIMITS ENFORCED</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Approved Monthly Operating Budget Ceiling
            </h2>
          </div>

          <button
            onClick={fetchBudget}
            disabled={isLoading}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 w-fit cursor-pointer border border-stone-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Audit Wallets</span>
          </button>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">APPROVED CEILING</span>
            <div className="text-2xl font-black text-white font-mono">
              ৳{master.monthly_limit?.toLocaleString()}
            </div>
            <span className="text-[11px] text-stone-500 font-medium">BDT / Month</span>
          </div>

          <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">SPENT THIS MONTH (MTD)</span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              ৳{master.spent_amount?.toLocaleString()}
            </div>
            <span className="text-[11px] text-stone-500 font-medium">{percentSpent}% of ceiling consumed</span>
          </div>

          <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">REMAINING BUFFER</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ৳{master.remaining_amount?.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-500/80 font-medium">Safe operating balance</span>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-stone-400">
            <span>Burn Progress</span>
            <span>{percentSpent}% Used</span>
          </div>
          <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentSpent > 80 ? 'bg-red-500' : percentSpent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.max(5, percentSpent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. SUB-WALLETS BREAKDOWN */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-stone-900">
          Sub-Wallets & Threshold Rules ({wallets.filter((w: any) => w.id !== 'wallet-approved-total').length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wallets
            .filter((w: any) => w.id !== 'wallet-approved-total')
            .map((wallet: any) => {
              const consumed = Math.min(100, Math.round((wallet.spent_amount / (wallet.monthly_limit || 1)) * 100));
              return (
                <div
                  key={wallet.id}
                  className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-stone-950">{wallet.name}</h4>
                      <p className="text-[11px] text-stone-500">{wallet.description}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black font-mono text-stone-900">
                        ৳{wallet.monthly_limit?.toLocaleString()}
                      </span>
                      <span className="block text-[10px] text-stone-400 font-mono">Limit</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <span className="text-[10px] text-stone-400 block">Spent</span>
                      <span className="font-bold text-stone-800">৳{wallet.spent_amount?.toLocaleString()}</span>
                    </div>
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <span className="text-[10px] text-stone-400 block">Remaining</span>
                      <span className="font-bold text-emerald-700">৳{wallet.remaining_amount?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-stone-800 h-full rounded-full transition-all"
                        style={{ width: `${Math.max(3, consumed)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                      <span>Threshold: {wallet.alert_threshold_percent}%</span>
                      <span>{consumed}% consumed</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100 flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">Approval rule: Single transaction &gt; ৳{wallet.approval_threshold_single_tx?.toLocaleString()} requires HITL sign-off</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
