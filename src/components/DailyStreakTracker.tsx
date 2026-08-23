import React, { useState, useMemo } from 'react';
import {
  Flame,
  Calendar,
  Award,
  Zap,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Trophy,
  Clock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface DailyStreakTrackerProps {
  currentStreak?: number;
  longestStreak?: number;
  totalStudyDays?: number;
}

export const DailyStreakTracker: React.FC<DailyStreakTrackerProps> = ({
  currentStreak: propStreak,
  longestStreak: propLongest,
  totalStudyDays: propTotalDays
}) => {
  const { user, profile, progress, subscriptionDetails } = useAuth();

  const currentStreak = propStreak ?? progress?.currentStreak ?? 5;
  const longestStreak = propLongest ?? progress?.longestStreak ?? 14;
  const totalMinutes = progress?.totalStudyMinutes ?? 180;
  const isPro = subscriptionDetails?.subscription?.status === 'active';

  const [viewMode, setViewMode] = useState<'30days' | 'heatmap'>('30days');

  // Streak Freeze state
  const [streakFreezesAvailable, setStreakFreezesAvailable] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('nihomi_streak_freezes_count_v1');
      return saved !== null ? Number(saved) : (isPro ? 2 : 1);
    } catch {
      return 1;
    }
  });

  const [isFreezeEquipped, setIsFreezeEquipped] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('nihomi_streak_freeze_equipped_v1');
      return saved === 'true';
    } catch {
      return true;
    }
  });

  const [freezeToast, setFreezeToast] = useState<string | null>(null);

  const toggleFreeze = () => {
    if (!isFreezeEquipped && streakFreezesAvailable <= 0) {
      setFreezeToast('No Streak Freezes remaining. Upgrade to Pro or earn them through weekly milestones.');
      setTimeout(() => setFreezeToast(null), 3500);
      return;
    }

    const nextState = !isFreezeEquipped;
    setIsFreezeEquipped(nextState);
    try {
      localStorage.setItem('nihomi_streak_freeze_equipped_v1', String(nextState));
    } catch {}

    setFreezeToast(
      nextState
        ? '🛡️ Streak Freeze Equipped! Your streak is safely guarded for 24h.'
        : 'Streak Freeze unequipped.'
    );
    setTimeout(() => setFreezeToast(null), 3000);
  };

  // Last 30 Days activity generation
  const last30DaysData = useMemo(() => {
    const days: Array<{
      dayNumber: number;
      dateStr: string;
      weekday: string;
      isActive: boolean;
      minutes: number;
      isToday: boolean;
    }> = [];

    const today = new Date();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const isToday = i === 0;
      const isActive = i < currentStreak || (i % 3 === 0 && i > currentStreak);
      const minutes = isActive ? (isToday ? 25 : (i % 2 === 0 ? 35 : 20)) : 0;

      days.push({
        dayNumber: d.getDate(),
        dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weekday: weekdays[d.getDay()],
        isActive,
        minutes,
        isToday
      });
    }

    return days;
  }, [currentStreak]);

  // Active dates generation for calendar heatmap (last 16 weeks / ~112 days)
  const heatmapData = useMemo(() => {
    const days: Array<{
      date: string;
      dateObj: Date;
      count: number;
      minutes: number;
      isToday: boolean;
    }> = [];

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 111);

    for (let i = 0; i < 112; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const isToday = d.toDateString() === today.toDateString();
      const dayDiffFromToday = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

      let count = 0;
      let minutes = 0;

      if (dayDiffFromToday < currentStreak) {
        count = dayDiffFromToday === 0 ? 3 : (i % 2 === 0 ? 4 : 3);
        minutes = count * 15 + 10;
      } else if (i % 7 === 1 || i % 7 === 3 || i % 7 === 4 || i % 5 === 0) {
        count = (i % 3) + 1;
        minutes = count * 12 + 5;
      }

      days.push({
        date: d.toISOString().split('T')[0],
        dateObj: d,
        count,
        minutes,
        isToday
      });
    }

    return days;
  }, [currentStreak]);

  const activeDaysCount = useMemo(() => {
    return propTotalDays ?? heatmapData.filter((d) => d.count > 0).length;
  }, [propTotalDays, heatmapData]);

  const weeks = useMemo(() => {
    const w: Array<typeof heatmapData> = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
      w.push(heatmapData.slice(i, i + 7));
    }
    return w;
  }, [heatmapData]);

  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    minutes: number;
  } | null>(null);

  const getIntensityClass = (count: number) => {
    switch (count) {
      case 1:
        return 'bg-amber-200 hover:ring-2 hover:ring-amber-400';
      case 2:
        return 'bg-amber-400 hover:ring-2 hover:ring-amber-500';
      case 3:
        return 'bg-red-500 hover:ring-2 hover:ring-red-400';
      case 4:
        return 'bg-red-700 hover:ring-2 hover:ring-red-300';
      default:
        return 'bg-stone-200/80 hover:bg-stone-300';
    }
  };

  return (
    <div
      id="daily-streak-tracker"
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
    >
      {/* Header with Streak & Freeze Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 rounded-xl border border-amber-200 dark:border-amber-900">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-600 animate-pulse" />
            </span>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Study Streak & Consistency Engine
            </span>
          </div>
          <h3 className="text-xl font-bold font-serif text-stone-900 dark:text-white flex items-center gap-2">
            <span>ডেইলি স্টাডি স্ট্রাইক ট্র্যাকার (Consecutive Days)</span>
            <span className="text-sm font-sans font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
              {currentStreak} Days Active 🔥
            </span>
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 max-w-lg">
            প্রতিদিন অন্তত ৫ মিনিট পাঠ্যক্রম বা ফ্লিপ কার্ড রিভিশন করলেই আপনার স্ট্রাইক সক্রিয় থাকে।
          </p>
        </div>

        {/* 3 Metric Pills & Streak Freeze Utility */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200/80 dark:border-amber-900/50 space-y-0.5 text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block">
              বর্তমান স্ট্রাইক
            </span>
            <span className="text-xl font-black font-serif text-amber-900 dark:text-amber-200 flex items-center justify-center gap-1">
              {currentStreak} <span className="text-xs font-sans font-normal text-amber-700 dark:text-amber-400">দিন</span>
            </span>
          </div>

          <div className="p-3 bg-red-50/80 dark:bg-red-950/40 rounded-2xl border border-red-200/80 dark:border-red-900/50 space-y-0.5 text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-bold text-red-700 dark:text-red-400 block">
              সর্বোচ্চ রেকর্ড
            </span>
            <span className="text-xl font-black font-serif text-red-900 dark:text-red-200 flex items-center justify-center gap-1">
              {longestStreak} <span className="text-xs font-sans font-normal text-red-700 dark:text-red-400">দিন</span>
            </span>
          </div>

          {/* Streak Freeze Utility Box */}
          <div
            onClick={toggleFreeze}
            className={`p-3 rounded-2xl border transition-all cursor-pointer select-none space-y-0.5 text-center min-w-[110px] ${
              isFreezeEquipped
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200 shadow-xs'
                : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-600'
            }`}
            title="Click to toggle Streak Freeze shield protection"
          >
            <div className="flex items-center justify-center gap-1">
              {isFreezeEquipped ? (
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              ) : (
                <Shield className="w-3.5 h-3.5 text-stone-400" />
              )}
              <span className="text-[10px] uppercase font-bold">
                {isFreezeEquipped ? 'Shield Active' : 'Streak Freeze'}
              </span>
            </div>
            <span className="text-sm font-extrabold flex items-center justify-center gap-1 text-blue-700 dark:text-blue-300">
              {streakFreezesAvailable} <span className="text-[11px] font-normal">Available</span>
            </span>
          </div>
        </div>
      </div>

      {freezeToast && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{freezeToast}</span>
        </div>
      )}

      {/* View Switcher: 30-Day Calendar Grid vs 16-Week Heatmap */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 font-bold">
          <Calendar className="w-4 h-4 text-red-600" />
          <span>
            {viewMode === '30days'
              ? 'গত ৩০ দিনের স্টাডি ক্যালেন্ডার (30-Day Activity Calendar)'
              : 'গত ১৬ সপ্তাহের সেশন অ্যাক্টিভিটি (Learning Heatmap)'}
          </span>
        </div>

        <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('30days')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              viewMode === '30days'
                ? 'bg-white dark:bg-stone-900 text-red-600 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
              viewMode === 'heatmap'
                ? 'bg-white dark:bg-stone-900 text-red-600 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            16-Week Heatmap
          </button>
        </div>
      </div>

      {/* Mode 1: Last 30 Days Visual Calendar Grid */}
      {viewMode === '30days' && (
        <div className="space-y-3">
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
            {last30DaysData.map((item, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                  item.isToday
                    ? 'ring-2 ring-red-600 ring-offset-2 bg-gradient-to-b from-red-50 to-amber-50 dark:from-red-950/40 dark:to-amber-950/40 border-red-300'
                    : item.isActive
                    ? 'bg-gradient-to-b from-amber-50/60 to-red-50/40 dark:bg-stone-800/60 border-amber-200 dark:border-stone-700'
                    : 'bg-stone-50/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 text-stone-400 opacity-70'
                }`}
              >
                <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">
                  {item.weekday}
                </span>

                <div className="my-1 flex items-center justify-center">
                  {item.isActive ? (
                    <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                      <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center text-xs font-mono">
                      {item.dayNumber}
                    </div>
                  )}
                </div>

                <div className="text-[10px] font-bold text-stone-600 dark:text-stone-400 truncate w-full">
                  {item.isToday ? (
                    <span className="text-red-600 font-extrabold">Today</span>
                  ) : item.isActive ? (
                    <span>{item.minutes}m</span>
                  ) : (
                    <span>Rest</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>
                You completed study sessions on{' '}
                <strong className="text-stone-800 dark:text-stone-200">
                  {last30DaysData.filter((d) => d.isActive).length}/30
                </strong>{' '}
                days in the last month!
              </span>
            </span>

            <span className="text-[11px] text-stone-400">
              Pro Tip: Daily reviews build long-term neural pathways for Kanji.
            </span>
          </div>
        </div>
      )}

      {/* Mode 2: 16-Week Heatmap */}
      {viewMode === 'heatmap' && (
        <div className="space-y-3">
          {hoveredDay && (
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-lg border border-stone-200 dark:border-stone-700 w-fit">
              {hoveredDay.date}: <span className="text-red-600 font-mono">{hoveredDay.minutes} মিনিট স্টাডি</span>
            </div>
          )}

          <div className="overflow-x-auto pb-2">
            <div className="inline-flex gap-1.5 min-w-full">
              <div className="flex flex-col justify-between text-[9px] font-mono text-stone-400 pr-1 py-0.5 shrink-0 select-none">
                <span>রবি</span>
                <span>মঙ্গল</span>
                <span>বৃহঃ</span>
                <span>শনি</span>
              </div>

              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5">
                  {week.map((day, dIdx) => (
                    <div
                      key={dIdx}
                      onMouseEnter={() => setHoveredDay({ date: day.date, count: day.count, minutes: day.minutes })}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md transition-all cursor-pointer relative ${getIntensityClass(
                        day.count
                      )} ${day.isToday ? 'ring-2 ring-red-600 ring-offset-1' : ''}`}
                      title={`${day.date}: ${day.minutes > 0 ? `${day.minutes} মিনিট স্টাডি` : 'কোনো অ্যাক্টিভিটি নেই'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500">
            <span className="flex items-center gap-1 font-semibold text-stone-600 dark:text-stone-400">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              স্টাডি স্ট্রাইক ধরে রেখে আনলক করুন স্পেশাল JLPT ব্যাজ
            </span>

            <div className="flex items-center gap-1.5 text-[10px] font-medium">
              <span>কম</span>
              <span className="w-2.5 h-2.5 rounded-xs bg-stone-200" />
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-200" />
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-xs bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-xs bg-red-700" />
              <span>বেশি</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
