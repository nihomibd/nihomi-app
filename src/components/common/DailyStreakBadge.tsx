import React, { useState } from 'react';
import { Flame, CheckCircle2, Trophy, Sparkles, Calendar, Zap, ArrowRight } from 'lucide-react';
import { useStudyStreak } from '../../hooks/useStudyStreak';

interface DailyStreakBadgeProps {
  onNavigateStreak?: () => void;
}

export const DailyStreakBadge: React.FC<DailyStreakBadgeProps> = ({ onNavigateStreak }) => {
  const { currentStreak, longestStreak, todayCompleted, totalActiveDays, recordActivity } = useStudyStreak();
  const [showPopover, setShowPopover] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        id="btn-header-daily-streak"
        type="button"
        onClick={() => setShowPopover(!showPopover)}
        aria-expanded={showPopover}
        title={`Daily Study Streak: ${currentStreak} Days (${todayCompleted ? 'Completed Today' : 'Pending Today'})`}
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer select-none ${
          todayCompleted
            ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:border-amber-500/60 shadow-xs'
            : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-amber-400'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <Flame
            className={`w-4 h-4 transition-transform ${
              todayCompleted
                ? 'text-amber-500 fill-amber-500 animate-pulse scale-110'
                : 'text-stone-400 hover:text-amber-500'
            }`}
          />
          {todayCompleted && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-stone-900" />
          )}
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-xs font-black tracking-tight">{currentStreak}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">
            {currentStreak === 1 ? 'Day' : 'Days'}
          </span>
        </div>
      </button>

      {/* Interactive Details Popover */}
      {showPopover && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPopover(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl z-50 p-4 space-y-3.5 animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <Flame className="w-4 h-4 fill-amber-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white">Daily Study Streak</h4>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">Nihomi Active Habit</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                todayCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
              }`}>
                {todayCompleted ? 'Active Today' : 'Pending'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-100 dark:border-stone-800">
                <span className="text-[10px] text-stone-400 block font-medium">Current Streak</span>
                <span className="text-lg font-black text-amber-500">{currentStreak} Days</span>
              </div>
              <div className="p-2 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-100 dark:border-stone-800">
                <span className="text-[10px] text-stone-400 block font-medium">Record Best</span>
                <span className="text-lg font-black text-stone-800 dark:text-stone-200">{longestStreak} Days</span>
              </div>
            </div>

            <div className="text-[11px] text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800 flex items-start space-x-2">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                {todayCompleted
                  ? 'Great job! You maintained your streak today with active lesson or quiz practice.'
                  : 'Complete 1 lesson or quiz review today to protect your 18-day streak!'}
              </span>
            </div>

            {!todayCompleted && (
              <button
                type="button"
                onClick={() => {
                  recordActivity('general');
                  setShowPopover(false);
                }}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Today Studied</span>
              </button>
            )}

            {onNavigateStreak && (
              <button
                type="button"
                onClick={() => {
                  setShowPopover(false);
                  onNavigateStreak();
                }}
                className="w-full py-1.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-[11px] font-bold text-center transition cursor-pointer"
              >
                View Analytics & Calendar &rarr;
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
