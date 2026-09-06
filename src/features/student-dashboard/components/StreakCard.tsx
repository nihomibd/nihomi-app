import React, { useState } from 'react';
import { StreakInfo } from '../types';
import { Trophy, Shield, ShieldCheck } from 'lucide-react';
import { DailyStreakTracker } from '../../../components/dashboard/DailyStreakTracker';
import { studentService } from '../studentService';

interface StreakCardProps {
  streak: StreakInfo;
  onOpenLeaderboard?: () => void;
}

export const StreakCard: React.FC<StreakCardProps> = ({ streak, onOpenLeaderboard }) => {
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const streakStatus = studentService.getStreakStatus();

  return (
    <section aria-labelledby="streak-heading" className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm text-left">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🔥</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 id="streak-heading" className="text-base font-bold text-stone-900 tracking-tight">
                {streakStatus.currentStreak || streak.currentStreak} Day Streak
              </h2>
              {streakStatus.freezeCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-200">
                  <ShieldCheck className="w-3 h-3 text-sky-600" />
                  <span>{streakStatus.freezeCount} Shield Armed</span>
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500">
              Personal Best: {streakStatus.longestStreak || streak.bestStreak} days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsTrackerOpen(true)}
            className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-800 transition-colors hover:bg-sky-100 border border-sky-200 cursor-pointer"
            title="Manage Streak Freeze & Rewards"
          >
            <Shield size={13} className="text-sky-600" />
            <span>Freeze</span>
          </button>
          <button type="button" onClick={onOpenLeaderboard} className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 transition-colors hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer" title="Open Dhaka community ranking">
            <Trophy size={14} aria-hidden="true" /> Rank #7
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 pt-2 border-t border-stone-100">
        {streak.weeklyActivity.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1 text-center">
            <span className="text-[10px] text-stone-400 font-medium">
              {day.dayNameBn || day.dayName}
            </span>

            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${
                day.completed
                  ? 'bg-rose-500 text-white shadow-sm'
                  : day.isToday
                  ? 'border-2 border-dashed border-rose-400 text-rose-600 bg-rose-50'
                  : 'bg-stone-100 text-stone-400'
              }`}
              title={`${day.dayName}: ${day.completed ? 'Completed' : day.isToday ? 'Today' : 'Missed'}`}
            >
              {day.completed ? '✓' : day.isToday ? '•' : ''}
            </div>
          </div>
        ))}
      </div>

      <DailyStreakTracker
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />
    </section>
  );
};