import React, { useState, useEffect } from 'react';
import {
  Flame,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Calendar as CalendarIcon,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Gift,
  Coins,
  ChevronRight,
  RotateCcw,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';
import { studentService } from '../../features/student-dashboard/studentService';

export interface DailyStreakTrackerProps {
  isOpen?: boolean;
  onClose?: () => void;
  inline?: boolean;
  onStreakUpdated?: (streak: number) => void;
}

export interface Milestone {
  days: number;
  gems: number;
  coins: number;
  xp: number;
  freezes: number;
  title: string;
  titleBn: string;
}

const MILESTONES: Milestone[] = [
  { days: 3, gems: 50, coins: 25, xp: 50, freezes: 0, title: '3-Day Kanji Spark', titleBn: '৩ দিনের কাঞ্জি সূচনা' },
  { days: 7, gems: 150, coins: 50, xp: 150, freezes: 1, title: '7-Day Samurai Rhythm', titleBn: '৭ দিনের সামুরাই ছন্দ (+১ ফ্রিজ)' },
  { days: 14, gems: 300, coins: 100, xp: 300, freezes: 1, title: '14-Day Tokyo Focus', titleBn: '১৪ দিনের টোকিও একাগ্রতা (+১ ফ্রিজ)' },
  { days: 30, gems: 750, coins: 250, xp: 750, freezes: 2, title: '30-Day Master Sensei', titleBn: '৩০ দিনের মাস্টার সেন্সেই (+২ ফ্রিজ)' },
];

export const DailyStreakTracker: React.FC<DailyStreakTrackerProps> = ({
  isOpen = true,
  onClose,
  inline = false,
  onStreakUpdated
}) => {
  const [streakData, setStreakData] = useState(() => studentService.getStreakStatus());
  const [coins, setCoins] = useState(() => studentService.getStudentCoins());
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Refresh status on mount
  useEffect(() => {
    const status = studentService.getStreakStatus();
    setStreakData(status);
    setCoins(studentService.getStudentCoins());
    if (status.freezeSavedNotice) {
      setFeedbackMsg(status.freezeSavedNotice);
    }
  }, [isOpen]);

  if (!isOpen && !inline) return null;

  const handleClaimMilestone = async (m: Milestone) => {
    if (streakData.currentStreak < m.days || streakData.claimedMilestones.includes(m.days)) return;

    const res = await studentService.claimStreakMilestone(m.days, {
      gems: m.gems,
      coins: m.coins,
      xp: m.xp,
      freezes: m.freezes
    });

    if (res.success) {
      setStreakData(studentService.getStreakStatus());
      setCoins(studentService.getStudentCoins());
      setFeedbackMsg(`🎉 পুরষ্কার আনলক! +${m.coins} কয়েন, +${m.gems} রত্ন এবং +${m.xp} XP অর্জিত!`);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const handleBuyFreeze = async () => {
    if (coins < 50) {
      setFeedbackMsg('⚠️ অপর্যাপ্ত কয়েন! ১টি স্ট্রিক ফ্রিজ কিনতে ৫০টি নিহোমি কয়েন প্রয়োজন।');
      setTimeout(() => setFeedbackMsg(null), 3500);
      return;
    }

    setIsPurchasing(true);
    try {
      const res = await studentService.purchaseStreakFreeze(50);
      if (res.success) {
        setStreakData(studentService.getStreakStatus());
        setCoins(res.updatedCoins);
        setFeedbackMsg('🛡️ স্ট্রিক ফ্রিজ শিল্ড সফলভাবে সজ্জিত করা হয়েছে! কোনো দিন মিস হলেও আপনার স্ট্রিক সুরক্ষিত থাকবে।');
        setTimeout(() => setFeedbackMsg(null), 4000);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  // 28-day calendar calculation
  const today = new Date();
  const calendarDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (27 - i));
    const dayStr = d.toISOString().split('T')[0];
    const isToday = i === 27;
    const isActive = i >= 28 - streakData.currentStreak;
    const isFrozen = streakData.frozenDates.includes(dayStr);
    return {
      date: d,
      dayOfMonth: d.getDate(),
      isToday,
      isActive,
      isFrozen
    };
  });

  const content = (
    <div
      id="daily-streak-tracker-content"
      className="space-y-6 text-left"
    >
      {/* Top Banner: Streak & Shield status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-13 h-13 rounded-2xl bg-linear-to-tr from-amber-500 via-red-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-red-600/30 shrink-0">
            <Flame className="w-7 h-7 fill-current animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h3 className="text-xl font-black text-stone-900 dark:text-white font-serif">
                {streakData.currentStreak} Day Study Streak
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[10px] font-mono border border-amber-300 dark:border-amber-800">
                Personal Best: {streakData.longestStreak}d 🔥
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              ধারাবাহিক অধ্যয়ন বজায় রাখুন ও স্ট্রিক ফ্রিজ শিল্ড দিয়ে মিস হওয়া দিন রক্ষা করুন।
            </p>
          </div>
        </div>

        {/* Shield Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {streakData.freezeCount > 0 ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <div>
                <span className="block leading-tight">{streakData.freezeCount} Shield{streakData.freezeCount > 1 ? 's' : ''} Armed</span>
                <span className="text-[10px] font-normal text-sky-600 dark:text-sky-400">Auto-Protection On</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <div>
                <span className="block leading-tight">No Freeze Shield</span>
                <span className="text-[10px] font-normal text-amber-600">Streak Vulnerable</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notice Banner if streak was preserved by freeze */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-xs flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="font-medium">{feedbackMsg}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-sky-500 hover:text-sky-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Dynamic Streak Freeze Inventory & Buy Action */}
      <div className="p-4.5 rounded-2xl bg-linear-to-r from-sky-50/70 via-blue-50/60 to-indigo-50/50 dark:from-sky-950/30 dark:via-blue-950/20 dark:to-indigo-950/20 border border-sky-200 dark:border-sky-900 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-950 dark:text-sky-200">
                Dynamic Streak Freeze System (স্ট্রিক সুরক্ষা শিল্ড)
              </h4>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md">
              কোনো জরুরি কাজে একদিন অনুশীলন মিস হলেও আপনার অর্জিত স্ট্রিক রিসেট হবে না। শিল্ড স্বয়ংক্রিয়ভাবে সক্রিয় হয়ে স্ট্রিক অক্ষুণ্ণ রাখবে।
            </p>
          </div>

          <button
            type="button"
            onClick={handleBuyFreeze}
            disabled={isPurchasing || coins < 50}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Coins className="w-4 h-4 text-amber-300" />
            <span>Equip Shield (50 Coins)</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-sky-800 dark:text-sky-300 border-t border-sky-100 dark:border-sky-900/60 pt-2 font-medium">
          <span>আপনার কয়েন ব্যালেন্স: <strong>{coins} নিহোমি কয়েন</strong></span>
          <span>&bull;</span>
          <span>মজুত শিল্ড: <strong>{streakData.freezeCount}টি</strong></span>
        </div>
      </div>

      {/* 28-Day Heatmap Activity Calendar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-400">
          <span className="flex items-center space-x-1.5 font-mono text-[11px]">
            <CalendarIcon className="w-3.5 h-3.5 text-red-600" />
            <span>4-Week Activity Heatmap (৪ সপ্তাহের অধ্যয়ন লগ)</span>
          </span>
          <span className="text-[10px] font-mono text-stone-400">
            {streakData.currentStreak} of 28 Days Active
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 p-3 bg-stone-50 dark:bg-stone-950/40 rounded-2xl border border-stone-200 dark:border-stone-800">
          {calendarDays.map((cd, idx) => (
            <div
              key={idx}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[10px] font-mono font-bold transition-all relative ${
                cd.isToday
                  ? 'ring-2 ring-red-500 bg-red-600 text-white shadow-xs'
                  : cd.isFrozen
                  ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700'
                  : cd.isActive
                  ? 'bg-amber-500/20 dark:bg-amber-500/30 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/50'
                  : 'bg-stone-200/50 dark:bg-stone-800/40 text-stone-400'
              }`}
              title={`${cd.date.toDateString()}: ${cd.isFrozen ? 'Saved by Freeze Shield' : cd.isActive ? 'Active' : 'Rest'}`}
            >
              <span>{cd.dayOfMonth}</span>
              {cd.isFrozen ? (
                <span className="text-[8px] leading-none">❄️</span>
              ) : cd.isActive && !cd.isToday ? (
                <span className="w-1 h-1 rounded-full bg-amber-500 mt-0.5" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-[10px] text-stone-400 px-1 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-red-600 inline-block" /> Today
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-amber-400 inline-block" /> Active Day
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs bg-sky-400 inline-block" /> ❄️ Shield Preserved
            </span>
          </div>
          <span>Study daily for continuous fluency</span>
        </div>
      </div>

      {/* Milestone Rewards Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-stone-900 dark:text-white flex items-center space-x-1.5">
            <Gift className="w-4 h-4 text-amber-500" />
            <span>Streak Milestones & Rewards (ধারাবাহিকতা পুরস্কার)</span>
          </span>
          <span className="text-[10px] text-stone-400 font-mono">
            {streakData.claimedMilestones.length} of {MILESTONES.length} Claimed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {MILESTONES.map((m) => {
            const isUnlocked = streakData.currentStreak >= m.days;
            const isClaimed = streakData.claimedMilestones.includes(m.days);

            return (
              <div
                key={m.days}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  isClaimed
                    ? 'bg-stone-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 opacity-80'
                    : isUnlocked
                    ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60 shadow-xs'
                    : 'bg-stone-50/50 dark:bg-stone-900/30 border-stone-200 dark:border-stone-800 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                      isClaimed
                        ? 'bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                        : isUnlocked
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-400 dark:bg-stone-800'
                    }`}
                  >
                    {isClaimed ? <CheckCircle2 className="w-4 h-4" /> : `${m.days}d`}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-white">
                      {m.title}
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">
                      +{m.gems} Gems • +{m.coins} Coins • +{m.xp} XP {m.freezes > 0 ? `• +${m.freezes} 🛡️` : ''}
                    </div>
                  </div>
                </div>

                <div>
                  {isClaimed ? (
                    <span className="text-[10px] font-bold text-stone-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg">
                      Claimed ✓
                    </span>
                  ) : isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => handleClaimMilestone(m)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      Claim
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs">
        {content}
      </div>
    );
  }

  return (
    <div
      id="daily-streak-tracker-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-600 fill-current" />
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Nihomi Streak & Freeze Engine
            </h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {content}
      </div>
    </div>
  );
};

export default DailyStreakTracker;
