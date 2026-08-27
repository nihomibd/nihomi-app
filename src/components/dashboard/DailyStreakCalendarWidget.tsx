import React, { useState, useEffect } from 'react';
import {
  Flame,
  Sparkles,
  Calendar as CalendarIcon,
  Award,
  CheckCircle2,
  Lock,
  Gift,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface StreakMilestone {
  days: number;
  gems: number;
  title: string;
  claimed: boolean;
}

export const DailyStreakCalendarWidget: React.FC = () => {
  const [currentStreak, setCurrentStreak] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('nihomi_current_streak_days_v1');
      return raw ? parseInt(raw, 10) : 7;
    } catch {
      return 7;
    }
  });

  const [totalGems, setTotalGems] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('nihomi_user_gems_v1');
      return raw ? parseInt(raw, 10) : 320;
    } catch {
      return 320;
    }
  });

  const [claimedMilestones, setClaimedMilestones] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem('nihomi_claimed_streak_milestones_v1');
      return raw ? JSON.parse(raw) : [3];
    } catch {
      return [3];
    }
  });

  const [claimedRewardAnimation, setClaimedRewardAnimation] = useState<string | null>(null);

  const milestones: StreakMilestone[] = [
    { days: 3, gems: 50, title: '3-Day Kanji Spark', claimed: claimedMilestones.includes(3) },
    { days: 7, gems: 150, title: '7-Day Samurai Rhythm', claimed: claimedMilestones.includes(7) },
    { days: 14, gems: 300, title: '14-Day Tokyo Focus', claimed: claimedMilestones.includes(14) },
    { days: 30, gems: 750, title: '30-Day Master Sensei', claimed: claimedMilestones.includes(30) },
  ];

  const handleClaimReward = (m: StreakMilestone) => {
    if (currentStreak < m.days || m.claimed) return;

    const newClaimed = [...claimedMilestones, m.days];
    const newGems = totalGems + m.gems;

    setClaimedMilestones(newClaimed);
    setTotalGems(newGems);

    try {
      localStorage.setItem('nihomi_claimed_streak_milestones_v1', JSON.stringify(newClaimed));
      localStorage.setItem('nihomi_user_gems_v1', newGems.toString());
    } catch {}

    setClaimedRewardAnimation(`💎 +${m.gems} Nihomi Gems Claimed! Awesome discipline.`);
    setTimeout(() => setClaimedRewardAnimation(null), 3500);
  };

  // Generate 28-day calendar grid (last 4 weeks)
  const today = new Date();
  const calendarDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (27 - i));
    const dayOfMonth = d.getDate();
    const isToday = i === 27;
    // Active if within current streak window
    const isActive = i >= 28 - currentStreak;
    return {
      date: d,
      dayOfMonth,
      isToday,
      isActive,
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' })
    };
  });

  return (
    <div
      id="daily-streak-calendar-widget"
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs text-left space-y-6"
    >
      {/* Top Banner: Streak & Nihomi Gems balance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                {currentStreak} Day Study Streak
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px] font-mono">
                Active 🔥
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Study daily on Nihomi to maintain your habit & earn gems.
            </p>
          </div>
        </div>

        {/* Gems Wallet Display */}
        <div className="flex items-center space-x-2 bg-stone-50 dark:bg-stone-800/80 px-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700/80 shrink-0">
          <span className="text-lg">💎</span>
          <div>
            <span className="text-sm font-bold text-stone-900 dark:text-white block font-mono">
              {totalGems.toLocaleString()}
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-400">
              Nihomi Gems
            </span>
          </div>
        </div>
      </div>

      {/* 28-Day Heatmap Activity Calendar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-400">
          <span className="flex items-center space-x-1.5 font-mono text-[11px]">
            <CalendarIcon className="w-3.5 h-3.5 text-red-600" />
            <span>4-Week Activity Heatmap</span>
          </span>
          <span className="text-[10px] font-mono text-stone-400">
            {currentStreak} of 28 Days Active
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 p-3 bg-stone-50 dark:bg-stone-950/40 rounded-2xl border border-stone-200 dark:border-stone-800">
          {calendarDays.map((cd, idx) => (
            <div
              key={idx}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[10px] font-mono font-bold transition-all relative ${
                cd.isToday
                  ? 'ring-2 ring-red-500 bg-red-600 text-white shadow-xs'
                  : cd.isActive
                  ? 'bg-amber-500/20 dark:bg-amber-500/30 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/50'
                  : 'bg-stone-200/50 dark:bg-stone-800/40 text-stone-400'
              }`}
            >
              <span>{cd.dayOfMonth}</span>
              {cd.isActive && !cd.isToday && (
                <span className="w-1 h-1 rounded-full bg-amber-500 mt-0.5"></span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* STREAK MILESTONE AWARDS */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[11px]">
            Streak Rewards & Nihomi Gems
          </span>
          <span className="text-[10px] text-stone-400 font-mono">Unlock perks & mock tests</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {milestones.map((m) => {
            const isUnlocked = currentStreak >= m.days;
            return (
              <div
                key={m.days}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  m.claimed
                    ? 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-80'
                    : isUnlocked
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/70 shadow-xs'
                    : 'bg-stone-50 dark:bg-stone-800/30 border-stone-200 dark:border-stone-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                      m.claimed
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                        : isUnlocked
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-400'
                    }`}
                  >
                    {m.claimed ? <CheckCircle2 className="w-4 h-4" /> : isUnlocked ? <Gift className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-900 dark:text-white">
                      {m.title}
                    </h5>
                    <p className="text-[11px] font-mono text-amber-700 dark:text-amber-400">
                      💎 +{m.gems} Gems ({m.days} Days Streak)
                    </p>
                  </div>
                </div>

                <div>
                  {m.claimed ? (
                    <span className="px-2.5 py-1 text-[10px] font-bold text-stone-400 bg-stone-200 dark:bg-stone-800 rounded-lg">
                      Claimed
                    </span>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => handleClaimReward(m)}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer active:scale-95"
                    >
                      Claim
                    </button>
                  ) : (
                    <span className="text-[10px] text-stone-400 font-mono">
                      {m.days - currentStreak}d left
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Claim confirmation animation banner */}
      {claimedRewardAnimation && (
        <div className="p-3 text-center text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 rounded-2xl border border-amber-300 dark:border-amber-700 animate-in fade-in">
          {claimedRewardAnimation}
        </div>
      )}
    </div>
  );
};
