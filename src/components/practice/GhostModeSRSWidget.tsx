import React, { useState, useEffect, useCallback } from 'react';
import {
  Ghost,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Flame,
  Award,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  BrainCircuit,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';

export interface GhostItem {
  id: string;
  topic: string;
  conceptCode: string;
  confusionType: string;
  level: string;
  targetJapanese: string;
  romaji: string;
  bangla: string;
  failureCount: number;
  successStreak: number;
  masteryPercentage: number;
  srsStage: 'apprentice' | 'guru' | 'master' | 'enlightened' | 'burned';
  intervalDays: number;
  easeFactor: number;
  lastFailedContext: string;
  newContextChallenge: string;
  scenarioPrompt: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  isResolved: boolean;
  nextReviewAt: string;
}

export interface GhostStats {
  totalWeaknesses: number;
  activeWeaknesses: number;
  resolvedCount: number;
  masteryRate: number;
  dueTodayCount: number;
  particleBreakdown: Record<string, { total: number; resolved: number; avgMastery: number }>;
}

export const GhostModeSRSWidget: React.FC = () => {
  const { refreshProgress } = useAuth();
  const [ghosts, setGhosts] = useState<GhostItem[]>([]);
  const [stats, setStats] = useState<GhostStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGhostIndex, setSelectedGhostIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [attemptResult, setAttemptResult] = useState<{
    isCorrect: boolean;
    explanation: string;
    message: string;
    srsStage: string;
    intervalDays: number;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const fetchGhosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest<{ success: boolean; activeGhosts?: GhostItem[]; stats?: GhostStats }>(
        '/api/ghost-mode/active-ghosts'
      );
      if (data && data.success) {
        setGhosts(data.activeGhosts || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.warn('[GhostModeSRS] Failed to fetch ghost items from API:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGhosts();
  }, [fetchGhosts]);

  const handleOptionSelect = (index: number) => {
    if (attemptResult || submitting) return;
    setSelectedOptionIndex(index);
  };

  const handleSubmitAttempt = async () => {
    if (selectedOptionIndex === null || !currentGhost || submitting) return;

    setSubmitting(true);
    const chosenOption = currentGhost.options[selectedOptionIndex];

    try {
      const data = await apiRequest<{
        success: boolean;
        isCorrect: boolean;
        ghost: GhostItem;
        message: string;
      }>('/api/ghost-mode/resolve-ghost', {
        method: 'POST',
        body: JSON.stringify({
          ghostId: currentGhost.id,
          selectedAnswerIndex: selectedOptionIndex
        })
      });

      if (data && data.success) {
        setAttemptResult({
          isCorrect: data.isCorrect,
          explanation: chosenOption?.explanation || (data.isCorrect ? 'সঠিক উত্তর!' : 'ভুল উত্তর।'),
          message: data.message,
          srsStage: data.ghost.srsStage,
          intervalDays: data.ghost.intervalDays
        });

        // Update local state
        setGhosts((prev) =>
          prev.map((g) => (g.id === currentGhost.id ? data.ghost : g))
        );
        if (refreshProgress) refreshProgress();
      }
    } catch (e) {
      console.error('Failed to submit ghost attempt:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextGhost = () => {
    setSelectedOptionIndex(null);
    setAttemptResult(null);
    if (selectedGhostIndex < activeFilteredGhosts.length - 1) {
      setSelectedGhostIndex(selectedGhostIndex + 1);
    } else {
      setSelectedGhostIndex(0);
    }
  };

  const filteredGhosts = ghosts.filter((g) => {
    if (filterType === 'all') return true;
    if (filterType === 'due') {
      return !g.isResolved && new Date(g.nextReviewAt).getTime() <= Date.now();
    }
    if (filterType === 'wa_vs_ga') return g.confusionType === 'wa_vs_ga';
    if (filterType === 'ni_vs_de') return g.confusionType === 'ni_vs_de';
    if (filterType === 'te_form') return g.confusionType === 'te_form';
    return true;
  });

  const activeFilteredGhosts = filteredGhosts.filter((g) => !g.isResolved);
  const currentGhost = activeFilteredGhosts[selectedGhostIndex] || activeFilteredGhosts[0];

  const getStageColor = (stage?: string) => {
    switch (stage) {
      case 'burned':
        return 'bg-purple-900/40 text-purple-300 border-purple-500/50';
      case 'enlightened':
        return 'bg-blue-900/40 text-blue-300 border-blue-500/50';
      case 'master':
        return 'bg-emerald-900/40 text-emerald-300 border-emerald-500/50';
      case 'guru':
        return 'bg-amber-900/40 text-amber-300 border-amber-500/50';
      default:
        return 'bg-rose-900/40 text-rose-300 border-rose-500/50';
    }
  };

  return (
    <div id="ghost-mode-srs-root" className="bg-[#0f101c] border border-stone-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl text-left relative overflow-hidden">
      {/* Background Neo-Tokyo Glow Accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-red-950/60 border border-red-500/30 text-red-400 font-mono text-[10px] font-bold tracking-wider rounded-full flex items-center space-x-1.5">
              <Ghost className="w-3.5 h-3.5" />
              <span>MEMORYOS™ GHOST MODE SRS</span>
            </span>
            <span className="text-xs text-stone-400 font-mono flex items-center space-x-1">
              <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
              <span>SM-2 Continuous Remediation</span>
            </span>
          </div>
          <h3 className="text-xl font-black tracking-tight text-white flex items-center space-x-2">
            <span>কঠিন পার্টিকেল ও ব্যাকরণ দুর্বলতা ওভারকামিং ড্রিল</span>
          </h3>
          <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
            আপনার অতীতের ভুল উত্তরের বিশ্লেষণ থেকে তৈরি ডাইনামিক স্পেসড রিপিটেশন ড্রিল। は বনাম が, に বনাম で সহ সকল কনফিউশন ১০০% দূর না হওয়া পর্যন্ত Ghost Mode আপনাকে রি-টেস্ট করতে থাকবে।
          </p>
        </div>

        {/* Global Mastery Stats Counter */}
        {stats && (
          <div className="flex items-center space-x-3 bg-stone-900/90 border border-stone-800 p-3 rounded-2xl shrink-0">
            <div className="text-center px-2">
              <div className="text-lg font-black text-amber-400 font-mono">{stats.masteryRate}%</div>
              <div className="text-[10px] text-stone-400 font-medium">Memory DNA</div>
            </div>
            <div className="h-8 w-px bg-stone-800" />
            <div className="text-center px-2">
              <div className="text-lg font-black text-emerald-400 font-mono">{stats.resolvedCount} / {stats.totalWeaknesses}</div>
              <div className="text-[10px] text-stone-400 font-medium">আয়ত্তকৃত</div>
            </div>
            <div className="h-8 w-px bg-stone-800" />
            <div className="text-center px-2">
              <div className="text-lg font-black text-red-400 font-mono">{stats.dueTodayCount}</div>
              <div className="text-[10px] text-stone-400 font-medium">আজকের ডিউ</div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => { setFilterType('all'); setSelectedGhostIndex(0); setSelectedOptionIndex(null); setAttemptResult(null); }}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filterType === 'all' ? 'bg-red-600 text-white shadow-sm' : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
          }`}
        >
          সব দুর্বলতা ({ghosts.length})
        </button>
        <button
          onClick={() => { setFilterType('due'); setSelectedGhostIndex(0); setSelectedOptionIndex(null); setAttemptResult(null); }}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1 ${
            filterType === 'due' ? 'bg-amber-600 text-white shadow-sm' : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>এখনই ডিউ (Due SRS)</span>
        </button>
        <button
          onClick={() => { setFilterType('wa_vs_ga'); setSelectedGhostIndex(0); setSelectedOptionIndex(null); setAttemptResult(null); }}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filterType === 'wa_vs_ga' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
          }`}
        >
          は vs が সাব-ক্লজ
        </button>
        <button
          onClick={() => { setFilterType('ni_vs_de'); setSelectedGhostIndex(0); setSelectedOptionIndex(null); setAttemptResult(null); }}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filterType === 'ni_vs_de' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
          }`}
        >
          に vs で লোকেশন
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-stone-400 flex flex-col items-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-red-500" />
          <p className="text-xs font-mono">MemoryOS™ দুর্বলতা লোড করা হচ্ছে...</p>
        </div>
      ) : activeFilteredGhosts.length === 0 ? (
        <div className="p-10 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h4 className="text-base font-bold text-emerald-300">কোনো মুলতবি Ghost দুর্বলতা নেই!</h4>
          <p className="text-xs text-emerald-400/80 max-w-md mx-auto">
            আপনার সকল পার্টিকেল ও কনজুগেশন ড্রিল মাস্টার্ড অবস্থায় আছে। নতুন কুইজ নিলে স্বয়ংক্রিয়ভাবে দুর্বলতাগুলো চিহ্নিত হবে।
          </p>
        </div>
      ) : currentGhost ? (
        <div className="space-y-6">
          {/* Active Weakness Metadata Card */}
          <div className="bg-stone-900/80 border border-stone-800 p-5 rounded-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md bg-stone-800 text-stone-200 text-xs font-mono font-bold">
                  {currentGhost.level} • {currentGhost.topic}
                </span>
                <span className={`px-2.5 py-0.5 rounded-md border text-[10px] font-mono font-bold uppercase ${getStageColor(currentGhost.srsStage)}`}>
                  SRS STAGE: {currentGhost.srsStage} ({currentGhost.intervalDays}d interval)
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono text-stone-400">
                <span className="text-rose-400 font-bold">ভুলের সংখ্যা: {currentGhost.failureCount} বার</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">মাস্টারি: {currentGhost.masteryPercentage}%</span>
              </div>
            </div>

            {/* Target Japanese & Bengali breakdown */}
            <div className="p-4 bg-stone-950/70 border border-stone-800/80 rounded-xl space-y-2">
              <div className="text-base sm:text-lg font-bold text-white font-japanese">
                {currentGhost.targetJapanese}
              </div>
              <div className="text-xs text-stone-400 font-mono">{currentGhost.romaji}</div>
              <div className="text-xs font-medium text-amber-300/90">{currentGhost.bangla}</div>
            </div>

            {/* Real World Tokyo Scenario Challenge */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-red-400">
                <Flame className="w-4 h-4 text-red-500" />
                <span>টোকিও রিয়েল-ওয়ার্ল্ড চ্যালেঞ্জ সিনারিও:</span>
                <span className="text-stone-400 font-normal">({currentGhost.newContextChallenge})</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 bg-stone-950 p-4 rounded-xl border border-stone-800 leading-relaxed font-sans">
                {currentGhost.scenarioPrompt}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-stone-300 block">সঠিক জাপানি বাক্যটি নির্বাচন করুন:</span>
              {currentGhost.options.map((option, idx) => {
                const isSelected = selectedOptionIndex === idx;
                let optionStyle = 'bg-stone-950/80 border-stone-800 text-stone-200 hover:border-stone-600';

                if (attemptResult) {
                  if (option.isCorrect) {
                    optionStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-bold';
                  } else if (isSelected && !option.isCorrect) {
                    optionStyle = 'bg-rose-950/50 border-rose-500 text-rose-200';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-red-950/40 border-red-500 text-white font-bold ring-1 ring-red-500';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOptionSelect(idx)}
                    disabled={Boolean(attemptResult) || submitting}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                  >
                    <div className="space-y-0.5">
                      <span className="font-japanese font-medium block">{option.text}</span>
                    </div>
                    <div className="shrink-0 ml-3">
                      {attemptResult && option.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                      {attemptResult && isSelected && !option.isCorrect && (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Attempt Result / Explanation Banner */}
            {attemptResult && (
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 animate-in fade-in ${
                  attemptResult.isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center space-x-2 font-bold">
                  {attemptResult.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{attemptResult.message}</span>
                </div>
                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  <strong className="text-white block mb-0.5">ব্যাকরণগত ব্যাখ্যা:</strong>
                  {attemptResult.explanation}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-800">
              <span className="text-[11px] text-stone-400 font-mono">
                আইটেম {selectedGhostIndex + 1} এর {activeFilteredGhosts.length}
              </span>

              <div className="flex items-center space-x-2">
                {!attemptResult ? (
                  <button
                    type="button"
                    onClick={handleSubmitAttempt}
                    disabled={selectedOptionIndex === null || submitting}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 shadow-md shadow-red-950"
                  >
                    {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>উত্তর সাবমিট করুন</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextGhost}
                    className="px-5 py-2.5 bg-stone-100 hover:bg-white text-stone-900 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 shadow-md"
                  >
                    <span>পরবর্তী দুর্বলতা ড্রিল</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
