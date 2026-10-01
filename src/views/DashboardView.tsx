import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Flame,
  BookOpen,
  CheckCircle2,
  PenTool,
  Brain,
  Bot,
  Target,
  Clock,
  ChevronRight,
  RotateCcw,
  Zap,
  BookmarkCheck,
  Compass,
  Store,
  Briefcase,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AiSenseiModal } from '../features/student-dashboard/components/AiSenseiModal';
import { MemoryOsView } from './MemoryOsView';

interface DashboardViewProps {
  onNavigate?: (view: string, params?: Record<string, any>) => void;
}

interface ProgressRingProps {
  percentage: number;
  label: string;
  labelBn: string;
  countText: string;
  color: string;
  bgColor: string;
  textColor: string;
  onClick?: () => void;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  label,
  labelBn,
  countText,
  color,
  bgColor,
  textColor,
  onClick
}) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div
      onClick={onClick}
      className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition-all duration-200 cursor-pointer flex flex-col items-center text-center group"
    >
      <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="7"
            className="text-white/[0.08]"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-base font-black tracking-tight ${textColor}`}>
            {percentage}%
          </span>
        </div>
      </div>

      <span className="text-xs font-bold text-white group-hover:text-stone-100 transition-colors">
        {label}
      </span>
      <span className="text-[11px] text-stone-400 mt-0.5">
        {labelBn}
      </span>
      <span className="text-[10px] font-mono text-stone-500 mt-1">
        {countText}
      </span>
    </div>
  );
};

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user, progress } = useAuth();
  const [isAiSenseiOpen, setIsAiSenseiOpen] = useState<boolean>(false);
  const [showMemoryOs, setShowMemoryOs] = useState<boolean>(false);

  // Reactive student metrics synced from localStorage & Auth state
  const studentName = user?.name || 'Nihomi Student';
  const streakDays = user?.streakDays || (progress as any)?.streakDays || 1;

  const [completedLessonsCount, setCompletedLessonsCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('nihomi_completed_lessons');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr.length;
      }
    } catch {}
    return (progress as any)?.completedLessonsCount || 1;
  });

  const [baitoShiftsCount, setBaitoShiftsCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('nihomi_baito_shifts_completed') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [baitoReadinessScore, setBaitoReadinessScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('nihomi_baito_readiness_score') || '75', 10);
    } catch {
      return 75;
    }
  });

  const [studentXp, setStudentXp] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('nihomi_student_xp') || '350', 10);
    } catch {
      return 350;
    }
  });

  // Listen for shift completion & lesson completion events across engines
  useEffect(() => {
    const handleShiftCompleted = (e: any) => {
      const detail = e.detail;
      if (detail?.shiftsCompleted !== undefined) {
        setBaitoShiftsCount(detail.shiftsCompleted);
      } else {
        setBaitoShiftsCount((prev) => prev + 1);
      }
      if (detail?.readinessScore !== undefined) {
        setBaitoReadinessScore(detail.readinessScore);
      }
      if (detail?.totalXp !== undefined) {
        setStudentXp(detail.totalXp);
      }
    };

    const handleProgressUpdated = (e: any) => {
      try {
        const raw = localStorage.getItem('nihomi_completed_lessons');
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) setCompletedLessonsCount(arr.length);
        }
        const xp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
        if (xp) setStudentXp(xp);
      } catch {}
    };

    window.addEventListener('nihomi:baito-shift-completed', handleShiftCompleted);
    window.addEventListener('nihomi:progress-updated', handleProgressUpdated);
    window.addEventListener('nihomi:lesson-completed', handleProgressUpdated);
    window.addEventListener('storage', handleProgressUpdated);

    return () => {
      window.removeEventListener('nihomi:baito-shift-completed', handleShiftCompleted);
      window.removeEventListener('nihomi:progress-updated', handleProgressUpdated);
      window.removeEventListener('nihomi:lesson-completed', handleProgressUpdated);
      window.removeEventListener('storage', handleProgressUpdated);
    };
  }, []);

  const kanaMasteredCount = 46; // Foundational
  const kanjiMasteredCount = 24; // N5 progress

  const kanaPercent = 100;
  const kanjiPercent = Math.round((kanjiMasteredCount / 100) * 100);
  const grammarPercent = Math.min(100, Math.round((completedLessonsCount / 40) * 100));

  // Spaced repetition review bank sample items
  const srsReviewItems = [
    {
      id: 'srs-1',
      pattern: 'は (wa) vs が (ga)',
      category: 'Particle Distinction',
      mistakeNote: 'সামগ্রিক টপিক নির্দেশ করতে "は" এবং সুনির্দিষ্ট নতুন কর্তা জোর দিতে "が" ব্যবহৃত হয়।',
      dueStatus: 'Due Today (আজকে পুনরাবৃত্তি)',
      color: 'border-red-500/30 bg-red-500/5'
    },
    {
      id: 'srs-2',
      pattern: 'あります vs います',
      category: 'Animacy Existence',
      mistakeNote: 'প্রাণী ও মানুষের ক্ষেত্রে "います" এবং জড়বস্তু বা উদ্ভিদে "あります" বসবে।',
      dueStatus: 'Due in 2h (২ ঘণ্টার মধ্যে)',
      color: 'border-amber-500/30 bg-amber-500/5'
    },
    {
      id: 'srs-3',
      pattern: '〜てください (te-form request)',
      category: 'Verb Conjugation',
      mistakeNote: 'অনুরোধমূলক নির্দেশ তৈরিতে ভার্বের て-ফর্ম রূপান্তর আবশ্যক (যেমন: 食べます -> 食べてください)।',
      dueStatus: 'Ready for Drill (রিভিউ প্রস্তুত)',
      color: 'border-emerald-500/30 bg-emerald-500/5'
    }
  ];

  if (showMemoryOs) {
    return (
      <div className="min-h-screen bg-[#0D0D11] text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <button
            type="button"
            onClick={() => setShowMemoryOs(false)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-bold text-white transition-all cursor-pointer"
          >
            ← ড্যাশবোর্ডে ফিরে যান (Return to Dashboard)
          </button>
          <MemoryOsView onNavigate={(view) => {
            if (view === 'dashboard') setShowMemoryOs(false);
            else onNavigate?.(view);
          }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D11] text-stone-100 font-sans antialiased pb-20 selection:bg-red-600 selection:text-white">
      {/* Top Header Bar */}
      <header className="border-b border-white/[0.08] bg-[#0D0D11]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-red-600/20 select-none">
              日
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white tracking-tight">NIHOMI STUDENT OS</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono font-bold border border-red-500/30">
                  JLPT N5
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-medium">
                ようこそ, {studentName} • Spaced Repetition Active
              </p>
            </div>
          </div>

          {/* Right: Quick Telemetry */}
          <div className="flex items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-bold text-amber-400">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{streakDays}d Streak</span>
            </div>

            <button
              onClick={() => setIsAiSenseiOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-all shadow-md shadow-red-600/20 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tanaka AI</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Streamlined 3-Zone Workspace */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* ZONE A: TODAY'S ACTION CARD (Clean next best step, zero visual clutter)   */}
        {/* ========================================================================= */}
        <section aria-label="Today's Action Card">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#13131c] via-[#161622] to-[#101018] border border-white/[0.12] p-6 sm:p-8 shadow-2xl">
            {/* Subtle red glowing accent */}
            <div className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 bg-red-600/15 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold font-mono">
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>ZONE A • TODAY'S NEXT BEST STEP</span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
                  Minna no Nihongo: Lesson 01 — 自己紹介 (Self-Introduction)
                </h1>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
                  আমি শিক্ষার্থী (~は ~です / ~じゃありません) • তোশিবা নেটিভ অডিও ডায়ালগ, ২৫টি মৌলিক ভোকাবুলারি ও ৩টি ব্যাকরণ স্ট্রাকচার।
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-stone-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    ~১৫ মিনিট
                  </span>
                  <span>•</span>
                  <span>২৫টি শব্দার্থ</span>
                  <span>•</span>
                  <span>৩টি ব্যাকরণ প্যাটার্ন</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">ফ্রি অ্যাক্সেস</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                <button
                  onClick={() => onNavigate?.('journey')}
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>গাইডেড জার্নি মিশন শুরু করুন</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => onNavigate?.('lesson', { lessonId: 'l01' })}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-stone-300 hover:text-white border border-white/[0.08] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>লেসন ০১</span>
                  </button>

                  <button
                    onClick={() => onNavigate?.('kana')}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-stone-300 hover:text-white border border-white/[0.08] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PenTool className="w-3.5 h-3.5 text-rose-400" />
                    <span>কানা ল্যাব</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ZONE B: COMPACT PROGRESS RINGS (Kana %, Kanji %, N5 Grammar %)             */}
        {/* ========================================================================= */}
        <section aria-label="Progress Overview" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-red-500" />
              <span>ZONE B • COMPACT PROGRESS METER (দক্ষতা ট্র্যাকার)</span>
            </h2>
            <button
              onClick={() => onNavigate?.('courses')}
              className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>সকল কোর্স দেখুন</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ProgressRing
              percentage={kanaPercent}
              label="Kana Foundations"
              labelBn="হিরাগানা ও কাতাকানা"
              countText="৪৬ / ৪৬ অক্ষর সম্পন্ন"
              color="#f43f5e"
              bgColor="#fda4af"
              textColor="text-rose-400"
              onClick={() => onNavigate?.('kana')}
            />

            <ProgressRing
              percentage={kanjiPercent}
              label="Kanji N5 Lab"
              labelBn="১০০ মৌলিক কাঞ্জি"
              countText={`${kanjiMasteredCount} / ১০০ কাঞ্জি মাস্টার্ড`}
              color="#fbbf24"
              bgColor="#fde68a"
              textColor="text-amber-400"
              onClick={() => onNavigate?.('kanji')}
            />

            <ProgressRing
              percentage={grammarPercent}
              label="N5 Master Grammar"
              labelBn="মিন্না নো নিহোঙ্গো"
              countText={`${completedLessonsCount} / ৪০টি ইন্টারঅ্যাক্টিভ পাঠ`}
              color="#10b981"
              bgColor="#a7f3d0"
              textColor="text-emerald-400"
              onClick={() => onNavigate?.('courses')}
            />

            <ProgressRing
              percentage={baitoReadinessScore}
              label="Workplace Readiness"
              labelBn="টোকিও কনবিনি ও বাইতো"
              countText={`${baitoShiftsCount}টি শিফট সম্পন্ন`}
              color="#f59e0b"
              bgColor="#fef3c7"
              textColor="text-amber-400"
              onClick={() => onNavigate?.('baito')}
            />
          </div>

          {/* NIHOMI WORKOS™ / CONBINI SHIFT BANNER */}
          <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#151322] to-amber-500/5 border border-amber-500/30 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <Store className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Workplace Readiness & Baito Skills</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                    {baitoShiftsCount > 0 ? `${baitoShiftsCount} Shift${baitoShiftsCount > 1 ? 's' : ''} Completed` : 'Shift Simulator Ready'}
                  </span>
                </div>
                <p className="text-xs text-stone-300">
                  টোকিও কনবিনি ক্যাশিয়ার সিমুলেটর — বারকোড স্ক্যানিং, কাস্টমার কেইগো ও সেমি-সেলফ রেজিস্টার মহড়া।
                </p>
                <div className="flex items-center gap-3 text-[11px] font-mono text-stone-400 pt-0.5">
                  <span className="text-amber-400 font-bold">Readiness Score: {baitoReadinessScore}%</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">Total Score: {studentXp} XP</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate?.('baito')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 shrink-0"
            >
              <Store className="w-4 h-4" />
              <span>{baitoShiftsCount > 0 ? 'পরের শিফটে যোগ দিন →' : 'কনবিনি শিফট শুরু করুন (+150 XP)'}</span>
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ZONE C: SRS MISTAKE REVIEW BANK (Mistakes saved for spaced repetition)    */}
        {/* ========================================================================= */}
        <section aria-label="SRS Mistake Bank" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono flex items-center gap-2">
              <Brain className="w-3.5 h-3.5 text-amber-400" />
              <span>ZONE C • SRS MISTAKE REVIEW BANK (স্পেসড রিপিটেশন ভুল ব্যাংক)</span>
            </h2>
            <button
              onClick={() => setShowMemoryOs(true)}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>MemoryOS™ খুলুন</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
              <div>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <span>অনুশীলন ও কুইজে চিহ্নিত দুর্বলতা ব্যাংক</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold">
                    ৩টি রিভিউ সক্রিয়
                  </span>
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  স্পেসড রিপিটেশন অ্যালগরিদম নিয়মিত বিরতিতে আপনার ভুল হওয়া ব্যাকরণ ও শব্দার্থ পুনরায় স্মরণ করিয়ে দেবে।
                </p>
              </div>

              <button
                onClick={() => setShowMemoryOs(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিভিউ সেশন শুরু করুন</span>
              </button>
            </div>

            {/* Mistake Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {srsReviewItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border ${item.color} space-y-2 flex flex-col justify-between`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                      <span>{item.category}</span>
                      <BookmarkCheck className="w-3.5 h-3.5 text-stone-500" />
                    </div>
                    <div className="text-sm font-bold text-white font-japanese">
                      {item.pattern}
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {item.mistakeNote}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-amber-400 font-semibold">{item.dueStatus}</span>
                    <button
                      onClick={() => setShowMemoryOs(true)}
                      className="text-stone-400 hover:text-white cursor-pointer underline"
                    >
                      ড্রিল করুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Tanaka AI Sensei Modal */}
      {isAiSenseiOpen && (
        <AiSenseiModal
          isOpen={isAiSenseiOpen}
          onClose={() => setIsAiSenseiOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardView;