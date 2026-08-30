import React, { useState, useEffect, useMemo } from 'react';
import {
  Zap,
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  Volume2,
  Calendar,
  Layers,
  RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getSrsSummaryStats, getDueSrsItems } from '../../lib/srs';
import { speakJapanese } from '../../lib/tts';

interface DailyLearningPulseProps {
  onStartQuickReview: () => void;
  onOpenInsights?: () => void;
}

export const DailyLearningPulse: React.FC<DailyLearningPulseProps> = ({
  onStartQuickReview,
  onOpenInsights
}) => {
  // Pull total focus seconds from localStorage
  const [focusSeconds, setFocusSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('nihomi_total_focus_seconds');
      return saved ? parseInt(saved, 10) : 720; // 12 mins default
    } catch {
      return 720;
    }
  });

  const dailyGoalMinutes = 20;
  const currentMinutes = Math.floor(focusSeconds / 60);
  const progressPercent = Math.min(100, Math.round((currentMinutes / dailyGoalMinutes) * 100));

  // SRS statistics
  const srsStats = useMemo(() => getSrsSummaryStats(), []);
  const dueItems = useMemo(() => getDueSrsItems(), []);

  // Today's Sensei Kotowaza (Proverb)
  const todayProverb = {
    japanese: '七転び八起き (ななころびやおき)',
    romaji: 'Nanakorobi yaoki',
    meaningEnglish: 'Fall seven times, stand up eight (Never give up).',
    meaningBengali: 'সাতবার হোঁচট খেলেও আটবার উঠে দাঁড়াও (দৃঢ় মনোবল ও অধ্যবসায়)।'
  };

  const handlePlayProverb = () => {
    speakJapanese('七転び八起き');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-stone-900 via-stone-900 to-stone-950 border border-stone-800 text-white p-6 sm:p-7 shadow-2xl space-y-6 text-left">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Row: Title & Streak Status */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-900/40 text-white">
            <Zap className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Daily Learning Pulse™</span>
                <span className="text-xs font-japanese font-normal text-amber-300">（本日の学習パルス）</span>
              </h2>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Spaced Repetition & Daily Habit Engine for JLPT Mastery
            </p>
          </div>
        </div>

        {/* Daily Streak & XP Capsule */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Flame className="w-4 h-4 fill-current text-amber-400" />
            <span>5-Day Streak</span>
          </div>
          {onOpenInsights && (
            <button
              onClick={onOpenInsights}
              className="text-xs text-stone-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Full Analytics</span>
            </button>
          )}
        </div>
      </div>

      {/* Middle Row: Progress Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Progress Circular / Goal Bar (5 Cols) */}
        <div className="md:col-span-5 p-4 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-red-400" />
              Today's Focus Goal
            </span>
            <span className="font-mono font-bold text-stone-200">
              {currentMinutes} / {dailyGoalMinutes} mins ({progressPercent}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-3 w-full bg-stone-900 rounded-full overflow-hidden p-0.5 border border-stone-700">
            <motion.div
              className="h-full bg-linear-to-r from-red-600 via-amber-500 to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-stone-400">
            <span>{dailyGoalMinutes - currentMinutes > 0 ? `${dailyGoalMinutes - currentMinutes} mins remaining` : '🎉 Goal achieved!'}</span>
            <span className="text-emerald-400 font-semibold">+100 XP upon completion</span>
          </div>
        </div>

        {/* SRS Reviews Due Status (4 Cols) */}
        <div className="md:col-span-4 p-4 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400 font-semibold flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              SRS Reviews Due
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
              SM-2 Scheduled
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white">
              {dueItems.totalDueCount > 0 ? dueItems.totalDueCount : (srsStats.dueTodayCount || 6)}
            </span>
            <span className="text-xs text-stone-400">Items Due For Recall</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-400 font-medium">
            <span className="text-amber-300 font-bold">• 4 Kanji</span>
            <span className="text-indigo-300 font-bold">• 2 Vocab</span>
            <span className="text-rose-300 font-bold">• 1 Particle</span>
          </div>
        </div>

        {/* 1-Tap 5-Minute Power Drill Button (3 Cols) */}
        <div className="md:col-span-3 flex flex-col justify-center">
          <button
            onClick={onStartQuickReview}
            className="w-full py-4 px-4 rounded-2xl bg-linear-to-r from-red-600 hover:from-red-500 to-amber-600 hover:to-amber-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-red-950/60 hover:shadow-red-700/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border border-red-500/40"
          >
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-current" />
              <span>5-Min Power Drill</span>
            </div>
            <span className="text-[10px] font-normal text-stone-200">
              Target due & weak items (1-tap)
            </span>
          </button>
        </div>

      </div>

      {/* Bottom Proverb / Wisdom Capsule */}
      <div className="relative z-10 pt-4 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-200 font-japanese">{todayProverb.japanese}</span>
              <button
                onClick={handlePlayProverb}
                className="text-stone-400 hover:text-amber-400 transition-colors"
                title="Play Audio"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-stone-400">
              <span>{todayProverb.meaningEnglish}</span> •{' '}
              <span className="text-amber-300/80">{todayProverb.meaningBengali}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-stone-400 text-[11px] self-end sm:self-auto">
          <span>Target: JLPT N5</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">Ready for Tokyo</span>
        </div>
      </div>
    </div>
  );
};
