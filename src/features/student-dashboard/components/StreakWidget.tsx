import React, { useState, useEffect } from 'react';
import {
  Flame,
  ShieldCheck,
  Award,
  Zap,
  CheckCircle2,
  Circle,
  Sparkles,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import {
  retentionEngine,
  StudentRetentionState,
  RetentionActivityType,
} from '../../../lib/retentionEngine';

interface StreakWidgetProps {
  onActivityClick?: (type: RetentionActivityType) => void;
  className?: string;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({
  onActivityClick,
  className = '',
}) => {
  const [state, setState] = useState<StudentRetentionState>(() =>
    retentionEngine.getRetentionState()
  );
  const [showFreezeModal, setShowFreezeModal] = useState<boolean>(false);

  useEffect(() => {
    // Refresh on mount or window focus
    const refresh = () => {
      setState(retentionEngine.getRetentionState());
    };
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);

  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        ((state.totalXp - state.currentLevelXp) /
          Math.max(1, state.nextLevelXp - state.currentLevelXp)) *
          100
      )
    )
  );

  const dailyTasks = [
    {
      id: 'KANA' as RetentionActivityType,
      title: 'হিরাগানা / কাতাকানা প্র্যাকটিস',
      xp: 10,
      completed: state.todayCompletedActivities.includes('KANA'),
    },
    {
      id: 'LISTENING' as RetentionActivityType,
      title: 'মিন্না নো নিহোঙ্গো লিসেনিং ড্রিল',
      xp: 15,
      completed: state.todayCompletedActivities.includes('LISTENING'),
    },
    {
      id: 'QUIZ' as RetentionActivityType,
      title: 'লেসন কুইজ সমাধান',
      xp: 25,
      completed: state.todayCompletedActivities.includes('QUIZ'),
    },
    {
      id: 'AI_CHAT' as RetentionActivityType,
      title: 'সেনসেই এআই কনভারসেশন',
      xp: 15,
      completed: state.todayCompletedActivities.includes('AI_CHAT'),
    },
  ];

  return (
    <div
      className={`bg-gradient-to-b from-[#11111d] to-[#0c0c16] border border-stone-800/90 rounded-2xl p-5 sm:p-6 shadow-xl text-stone-100 flex flex-col gap-5 ${className}`}
    >
      {/* Top Banner: Fire Counter & Shields */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-red-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Flame
                size={28}
                className="text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse"
              />
            </div>
            {/* Small fire particle accent */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {state.currentStreak} দিন
              </span>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                চলমান স্ট্রিক
              </span>
            </div>
            <p className="text-xs text-stone-400 font-medium">
              সর্বোচ্চ ধারাবাহিকতা: {state.longestStreak} দিন
            </p>
          </div>
        </div>

        {/* Freeze Shield indicator */}
        <div className="flex items-center gap-2">
          <div
            onClick={() => setShowFreezeModal(true)}
            className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 px-3 py-1.5 rounded-xl cursor-pointer transition-all"
            title="স্ট্রিক ফ্রিজ শিল্ড স্ট্যাটাস"
          >
            <ShieldCheck size={16} className="text-blue-400" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-blue-300">
                ফ্রিজ শিল্ড ({state.freezeCount})
              </span>
              <span className="text-[10px] text-blue-400/80">সক্রিয় রয়েছে</span>
            </div>
          </div>
        </div>
      </div>

      {/* Freeze Saved Alert if recently triggered */}
      {state.recentNotice && (
        <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-3 text-xs text-blue-200 flex items-center gap-2">
          <ShieldCheck size={16} className="text-blue-400 shrink-0" />
          <span>{state.recentNotice}</span>
        </div>
      )}

      {/* Weekly History Dots */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-stone-400 flex items-center gap-1.5">
          <TrendingUp size={13} className="text-amber-400" />
          চলতি সপ্তাহের অগ্রগতি:
        </span>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {state.weeklyHistory.map((day, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                day.isToday
                  ? 'bg-amber-500/15 border-amber-500/40'
                  : day.isCompleted
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-stone-900/50 border-stone-800'
              }`}
            >
              <span className="text-[11px] text-stone-400 font-medium mb-1">
                {day.dayLabel}
              </span>
              {day.isCompleted ? (
                <CheckCircle2 size={16} className="text-emerald-400" />
              ) : (
                <Circle size={16} className="text-stone-600" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Level & XP Progress Bar */}
      <div className="bg-stone-900/60 border border-stone-800/80 rounded-xl p-3.5 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Award size={14} className="text-amber-400" />
            <span className="font-bold text-white">লেভেল {state.level}:</span>
            <span className="text-amber-300 font-medium">{state.levelTitle}</span>
          </div>
          <span className="font-mono text-stone-400">
            {state.totalXp} / {state.nextLevelXp} XP
          </span>
        </div>

        {/* Visual progress bar */}
        <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-red-500 to-rose-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Today's Learning Tasks Checklist */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-400">
          <span>আজকের লক্ষ্যমাত্রা (Daily Quests):</span>
          <span className="text-stone-500 text-[11px]">
            যেকোনো ১টি সম্পন্ন করলেই স্ট্রিক রক্ষা পাবে
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {dailyTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onActivityClick?.(task.id)}
              className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                task.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30 shadow-xs'
                  : 'bg-stone-900/40 border-stone-800 hover:border-stone-700 hover:bg-stone-900/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {task.completed ? (
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                ) : (
                  <Circle size={16} className="text-stone-600 shrink-0" />
                )}
                <span
                  className={`text-xs font-medium ${
                    task.completed ? 'text-stone-200 line-through' : 'text-stone-300'
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                +{task.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Freeze Shield Info Modal */}
      {showFreezeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#151522] border border-stone-700 rounded-2xl max-w-md w-full p-6 text-stone-100 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">স্ট্রিক ফ্রিজ শিল্ড প্রোটেকশন</h4>
                <p className="text-xs text-stone-400">নিহোমি N5 প্রো সুরক্ষা বৈশিষ্ট্য</p>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              কোনো কারণে একদিন পড়াশোনা মিস হয়ে গেলে স্ট্রিক ফ্রিজ শিল্ড স্বয়ংক্রিয়ভাবে আপনার স্ট্রিক কাউন্টারকে শূন্য হতে দেয় না। N5 Pro ব্যবহারকারীরা মাসিক আনলিমিটেড ফ্রিজ শিল্ড উপভোগ করেন।
            </p>

            <div className="p-3 bg-stone-900/80 rounded-xl border border-stone-800 text-xs flex justify-between items-center">
              <span className="text-stone-400">বর্তমানে মজুত শিল্ড:</span>
              <span className="font-bold text-blue-400 text-sm">{state.freezeCount} টি শিল্ড</span>
            </div>

            <button
              onClick={() => setShowFreezeModal(false)}
              className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              বন্ধ করুন (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
