import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Flame,
  Zap,
  Target,
  CheckCircle2,
  Trophy,
  Sparkles,
  Plus,
  BookOpen,
  Settings2
} from 'lucide-react';

interface DailyLearningGoalProps {
  currentStreak?: number;
  initialTodayXp?: number;
  completedLessonsToday?: number;
  onXpUpdated?: (newTotal: number) => void;
}

export const DailyLearningGoal: React.FC<DailyLearningGoalProps> = ({
  currentStreak = 1,
  initialTodayXp = 45,
  completedLessonsToday = 1,
  onXpUpdated
}) => {
  const [goalType, setGoalType] = useState<'xp' | 'lessons'>(() => {
    try {
      const saved = localStorage.getItem('nihomi_daily_goal_type_v1');
      return (saved as 'xp' | 'lessons') || 'xp';
    } catch {
      return 'xp';
    }
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('nihomi_streak_days_v1');
      return raw ? Number(raw) : currentStreak || 1;
    } catch {
      return currentStreak || 1;
    }
  });

  const [dailyGoalXp, setDailyGoalXp] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('nihomi_daily_goal_xp_v1');
      return raw ? Number(raw) : 100;
    } catch {
      return 100;
    }
  });

  const [dailyGoalLessons, setDailyGoalLessons] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('nihomi_daily_goal_lessons_v1');
      return raw ? Number(raw) : 3;
    } catch {
      return 3;
    }
  });

  const [todayXp, setTodayXp] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('nihomi_today_xp_v1');
      return raw ? Number(raw) : initialTodayXp;
    } catch {
      return initialTodayXp;
    }
  });

  const [todayLessons, setTodayLessons] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('nihomi_today_lessons_v1');
      return raw ? Number(raw) : completedLessonsToday;
    } catch {
      return completedLessonsToday;
    }
  });

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentVal = goalType === 'xp' ? todayXp : todayLessons;
  const targetVal = goalType === 'xp' ? dailyGoalXp : dailyGoalLessons;
  const percentage = Math.min(100, Math.round((currentVal / Math.max(1, targetVal)) * 100));

  // Circular SVG calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleSetGoalXp = (xp: number) => {
    setDailyGoalXp(xp);
    try {
      localStorage.setItem('nihomi_daily_goal_xp_v1', String(xp));
    } catch {}
    setIsEditingGoal(false);
  };

  const handleSetGoalLessons = (lessons: number) => {
    setDailyGoalLessons(lessons);
    try {
      localStorage.setItem('nihomi_daily_goal_lessons_v1', String(lessons));
    } catch {}
    setIsEditingGoal(false);
  };

  const toggleGoalType = (type: 'xp' | 'lessons') => {
    setGoalType(type);
    try {
      localStorage.setItem('nihomi_daily_goal_type_v1', type);
    } catch {}
  };

  const triggerConfettiCelebration = () => {
    try {
      // Fire left cannon
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0.2, y: 0.6 },
        colors: ['#DC2626', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']
      });
      // Fire right cannon
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 0.8, y: 0.6 },
        colors: ['#DC2626', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']
      });
    } catch (e) {
      console.warn('Confetti trigger note:', e);
    }
  };

  const handleAddXp = (amount: number) => {
    const updated = todayXp + amount;
    setTodayXp(updated);
    try {
      localStorage.setItem('nihomi_today_xp_v1', String(updated));
    } catch {}

    if (updated >= dailyGoalXp && todayXp < dailyGoalXp) {
      setShowCelebration(true);
      triggerConfettiCelebration();
      const nextStreak = streakDays + 1;
      setStreakDays(nextStreak);
      try {
        localStorage.setItem('nihomi_streak_days_v1', String(nextStreak));
      } catch {}
    }

    if (onXpUpdated) {
      onXpUpdated(updated);
    }
  };

  const handleAddLesson = () => {
    const updated = todayLessons + 1;
    setTodayLessons(updated);
    try {
      localStorage.setItem('nihomi_today_lessons_v1', String(updated));
    } catch {}

    if (updated >= dailyGoalLessons && todayLessons < dailyGoalLessons) {
      setShowCelebration(true);
      triggerConfettiCelebration();
      const nextStreak = streakDays + 1;
      setStreakDays(nextStreak);
      try {
        localStorage.setItem('nihomi_streak_days_v1', String(nextStreak));
      } catch {}
    }
  };


  return (
    <div
      id="daily-learning-goal-widget"
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-5"
    >
      {/* Header with Streak & Goal Toggle */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 flex items-center justify-center text-amber-600">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-600 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-stone-900 dark:text-white">
                Daily Learning Goal
              </span>
              <span className="text-xs font-serif font-extrabold text-amber-600 dark:text-amber-400">
                {streakDays}d Streak 🔥
              </span>
            </div>
            <p className="text-[11px] text-stone-400">Personal retention target</p>
          </div>
        </div>

        {/* Goal Type Switcher */}
        <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => toggleGoalType('xp')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              goalType === 'xp'
                ? 'bg-white dark:bg-stone-900 text-red-600 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            XP Mode
          </button>
          <button
            onClick={() => toggleGoalType('lessons')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              goalType === 'lessons'
                ? 'bg-white dark:bg-stone-900 text-red-600 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Lessons
          </button>
        </div>
      </div>

      {/* Main Circular Progress Body */}
      <div className="flex items-center justify-between gap-4">
        {/* Circular Progress Indicator */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-24 h-24 transform -rotate-90">
            {/* Background track */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="7"
              className="text-stone-100 dark:text-stone-800"
              fill="transparent"
            />
            {/* Animated progress ring */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-700 ${
                percentage >= 100 ? 'text-emerald-500' : 'text-red-600'
              }`}
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-sm font-extrabold font-mono text-stone-900 dark:text-white">
              {percentage}%
            </span>
            <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400">
              Done
            </span>
          </div>
        </div>

        {/* Goal Description & Quick Trigger */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
              {goalType === 'xp' ? 'Experience Points (XP)' : 'Lessons Completed'}
            </span>
            <button
              onClick={() => setIsEditingGoal(!isEditingGoal)}
              className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Settings2 className="w-3 h-3" />
              <span>Change</span>
            </button>
          </div>

          <p className="text-base font-extrabold font-serif text-stone-900 dark:text-white">
            {currentVal} / {targetVal} {goalType === 'xp' ? 'XP' : 'Lessons'}
          </p>

          <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
            {percentage >= 100
              ? '🎉 Today’s goal complete! High consistency.'
              : `${targetVal - currentVal} ${goalType === 'xp' ? 'XP' : 'more lessons'} to hit daily target.`}
          </p>
        </div>
      </div>

      {/* Goal Edit Dropdown */}
      {isEditingGoal && (
        <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2 animate-in fade-in">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Set Daily Target ({goalType === 'xp' ? 'XP' : 'Lessons'}):
          </span>
          <div className="flex items-center gap-2">
            {goalType === 'xp'
              ? [50, 100, 200, 350].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => handleSetGoalXp(goal)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      dailyGoalXp === goal
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {goal} XP
                  </button>
                ))
              : [1, 2, 3, 5].map((lessons) => (
                  <button
                    key={lessons}
                    onClick={() => handleSetGoalLessons(lessons)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      dailyGoalLessons === lessons
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {lessons} {lessons === 1 ? 'Lesson' : 'Lessons'}
                  </button>
                ))}
          </div>
        </div>
      )}

      {/* Quick Practice Increment Actions */}
      <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800">
        <span className="text-[11px] text-stone-500">
          Auto-syncs with quiz submissions & study timer.
        </span>

        <div className="flex items-center gap-2">
          {goalType === 'xp' ? (
            <button
              onClick={() => handleAddXp(25)}
              className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1 transition cursor-pointer border border-stone-200 dark:border-stone-700"
            >
              <Plus className="w-3.5 h-3.5 text-red-600" />
              <span>+25 XP</span>
            </button>
          ) : (
            <button
              onClick={handleAddLesson}
              className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1 transition cursor-pointer border border-stone-200 dark:border-stone-700"
            >
              <BookOpen className="w-3.5 h-3.5 text-red-600" />
              <span>+1 Lesson</span>
            </button>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">Goal complete! Streak updated to {streakDays} days!</span>
          </div>
          <button
            onClick={() => setShowCelebration(false)}
            className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
