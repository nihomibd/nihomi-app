import React from 'react';
import { StreakInfo } from '../types';

interface StreakCardProps {
  streak: StreakInfo;
}

export const StreakCard: React.FC<StreakCardProps> = ({ streak }) => {
  return (
    <section aria-labelledby="streak-heading" className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🔥</span>
          <div>
            <h2 id="streak-heading" className="text-base font-bold text-stone-900 tracking-tight">
              {streak.currentStreak} Day Streak
            </h2>
            <p className="text-xs text-stone-500">
              Personal Best: {streak.bestStreak} days
            </p>
          </div>
        </div>

        <span className="text-[11px] font-medium text-stone-500 px-2.5 py-1 rounded-full bg-stone-100">
          ধারাবাহিকতা
        </span>
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
    </section>
  );
};