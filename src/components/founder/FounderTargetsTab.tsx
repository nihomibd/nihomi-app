import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Target,
  DollarSign,
  Calendar,
  Shield,
  Save,
  CheckCircle2,
  RefreshCw,
  Coins
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

export const FounderTargetsTab: React.FC = () => {
  const [mrrTarget, setMrrTarget] = useState<any>({
    targetAmount: 10000,
    currency: 'USD',
    deadline: '2026-12-31',
    operatingBudget: 50000,
    operatingBudgetCurrency: 'BDT',
    growthPriority: 'Balanced',
    riskLevel: 'Medium',
    notes: ''
  });

  const [marketTarget, setMarketTarget] = useState<any>({
    primaryMarket: 'Bangladesh',
    secondaryMarket: 'Japan',
    experimentalMarket: 'Global',
    geography: 'Dhaka, Chittagong, Sylhet, Tokyo',
    customerSegment: 'Japanese N5 Learners & SSW Candidates',
    language: 'Bangla, Japanese, English',
    priceRange: '৳299 - ৳999/mo',
    acquisitionChannels: ['Facebook Groups', 'YouTube Organic'],
    priority: 'P0',
    timeframe: 'Q4 2026 (30-90 Days)'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSavingMrr, setIsSavingMrr] = useState(false);
  const [isSavingMarket, setIsSavingMarket] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchTargets = async () => {
    setIsLoading(true);
    try {
      const [mrrRes, mktRes] = await Promise.all([
        apiRequest('/api/founder/mrr-target'),
        apiRequest('/api/founder/market-target')
      ]);

      if (mrrRes.success && mrrRes.target) {
        setMrrTarget(mrrRes.target);
      }
      if (mktRes.success && mktRes.target) {
        setMarketTarget(mktRes.target);
      }
    } catch {
      // quiet fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  const handleSaveMrr = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMrr(true);
    setFeedbackMsg(null);
    try {
      const res = await apiRequest('/api/founder/mrr-target', {
        method: 'POST',
        body: JSON.stringify(mrrTarget)
      });
      if (res.success) {
        setFeedbackMsg({ type: 'success', text: 'MRR Target & Operating Budget successfully saved and logged.' });
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to save MRR Target' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message });
    } finally {
      setIsSavingMrr(false);
    }
  };

  const handleSaveMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMarket(true);
    setFeedbackMsg(null);
    try {
      const res = await apiRequest('/api/founder/market-target', {
        method: 'POST',
        body: JSON.stringify(marketTarget)
      });
      if (res.success) {
        setFeedbackMsg({ type: 'success', text: 'Market Target & Customer Segments successfully updated.' });
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to save Market Target' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message });
    } finally {
      setIsSavingMarket(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-950">Strategic Objectives & Operating Ceiling</h2>
          <p className="text-xs text-stone-500">
            Define authoritative business targets that govern AI agent recommendations and budget firewalls.
          </p>
        </div>

        <button
          onClick={fetchTargets}
          disabled={isLoading}
          className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 w-fit cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Reload Targets</span>
        </button>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium flex items-center space-x-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* TWO COLUMN GRID: MRR & BUDGET vs MARKET TARGET */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FORM 1: MRR TARGET & BUDGET */}
        <form onSubmit={handleSaveMrr} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm border-b border-stone-100 pb-3">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>1. MRR Target & Operating Budget Ceiling</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">MRR Target Amount</label>
              <input
                type="number"
                min="100"
                value={mrrTarget.targetAmount}
                onChange={(e) => setMrrTarget({ ...mrrTarget, targetAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">Currency</label>
              <select
                value={mrrTarget.currency}
                onChange={(e) => setMrrTarget({ ...mrrTarget, currency: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
              >
                <option value="USD">USD ($)</option>
                <option value="BDT">BDT (৳)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-600">Target Deadline</label>
            <input
              type="date"
              value={mrrTarget.deadline}
              onChange={(e) => setMrrTarget({ ...mrrTarget, deadline: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">Monthly Operating Budget</label>
              <input
                type="number"
                min="0"
                value={mrrTarget.operatingBudget}
                onChange={(e) => setMrrTarget({ ...mrrTarget, operatingBudget: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">Budget Currency</label>
              <select
                value={mrrTarget.operatingBudgetCurrency}
                onChange={(e) => setMrrTarget({ ...mrrTarget, operatingBudgetCurrency: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
              >
                <option value="BDT">BDT (৳)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">Growth Priority</label>
              <select
                value={mrrTarget.growthPriority}
                onChange={(e) => setMrrTarget({ ...mrrTarget, growthPriority: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
              >
                <option value="Aggressive">Aggressive</option>
                <option value="Balanced">Balanced</option>
                <option value="Conservative">Conservative</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">Risk Profile</label>
              <select
                value={mrrTarget.riskLevel}
                onChange={(e) => setMrrTarget({ ...mrrTarget, riskLevel: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
              >
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-600">Strategic Founder Notes</label>
            <textarea
              rows={2}
              value={mrrTarget.notes || ''}
              onChange={(e) => setMrrTarget({ ...mrrTarget, notes: e.target.value })}
              placeholder="e.g. Focus on organic conversion of N5 students via YouTube and Facebook..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSavingMrr}
            className="w-full py-2.5 bg-stone-950 hover:bg-stone-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSavingMrr ? 'Saving MRR Target...' : 'Save MRR Target'}</span>
          </button>
        </form>

        {/* FORM 2: MARKET TARGET */}
        <form onSubmit={handleSaveMarket} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm border-b border-stone-100 pb-3">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>2. Target Market & Acquisition Strategy</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">Primary Market</label>
              <input
                type="text"
                value={marketTarget.primaryMarket}
                onChange={(e) => setMarketTarget({ ...marketTarget, primaryMarket: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">Secondary Market</label>
              <input
                type="text"
                value={marketTarget.secondaryMarket}
                onChange={(e) => setMarketTarget({ ...marketTarget, secondaryMarket: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-600">Customer Segment</label>
            <input
              type="text"
              value={marketTarget.customerSegment}
              onChange={(e) => setMarketTarget({ ...marketTarget, customerSegment: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">Price Range</label>
              <input
                type="text"
                value={marketTarget.priceRange}
                onChange={(e) => setMarketTarget({ ...marketTarget, priceRange: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-600">Timeframe</label>
              <input
                type="text"
                value={marketTarget.timeframe}
                onChange={(e) => setMarketTarget({ ...marketTarget, timeframe: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-600">Acquisition Channels (Comma-separated)</label>
            <input
              type="text"
              value={Array.isArray(marketTarget.acquisitionChannels) ? marketTarget.acquisitionChannels.join(', ') : marketTarget.acquisitionChannels}
              onChange={(e) => setMarketTarget({ ...marketTarget, acquisitionChannels: e.target.value.split(',').map((s: string) => s.trim()) })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-600">Target Geographies</label>
            <input
              type="text"
              value={marketTarget.geography}
              onChange={(e) => setMarketTarget({ ...marketTarget, geography: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isSavingMarket}
            className="w-full py-2.5 bg-stone-950 hover:bg-stone-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSavingMarket ? 'Saving Market Target...' : 'Save Market Target'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
