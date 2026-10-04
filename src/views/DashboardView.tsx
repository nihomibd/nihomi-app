import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Flame,
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronRight,
  RotateCcw,
  Bot,
  Zap,
  Lock,
  Compass,
  Store,
  Layers,
  Award,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AiSenseiModal } from '../features/student-dashboard/components/AiSenseiModal';
import { MemoryOsView } from './MemoryOsView';
import { loadLearnerKnowledgeState } from '../core/curriculum/learnerKnowledgeState';
import { getNextBestMission, isGrammarEligible } from '../core/curriculum/journeyEngine';
import { PlacementDiagnosticModal } from '../components/learning/PlacementDiagnosticModal';

interface DashboardViewProps {
  onNavigate?: (view: string, params?: Record<string, any>) => void;
}

interface MilestoneLesson {
  num: number;
  id: string;
  titleJa: string;
  titleBn: string;
  topic: string;
  estimatedMinutes: number;
}

const N5_CURRICULUM_PATHWAY: MilestoneLesson[] = [
  { num: 1, id: 'n5-l1', titleJa: '自己紹介', titleBn: 'নিজের পরিচয় ও সম্ভাষণ', topic: '~は ~です / ~じゃありません', estimatedMinutes: 15 },
  { num: 2, id: 'n5-l2', titleJa: '物の名前', titleBn: 'দৈনন্দিন বস্তু ও জিজ্ঞাসা', topic: 'これ・それ・あれ / この・その・あの', estimatedMinutes: 15 },
  { num: 3, id: 'n5-l3', titleJa: '場所案内', titleBn: 'স্থান ও দিকনির্দেশনা', topic: 'ここ・そこ・あそこ / どこですか', estimatedMinutes: 18 },
  { num: 4, id: 'n5-l4', titleJa: '時間と予定', titleBn: 'সময়, দিন ও দৈনন্দিন রুটিন', topic: '今何時ですか / 〜ます・〜ません', estimatedMinutes: 20 },
  { num: 5, id: 'n5-l5', titleJa: '移動と乗り物', titleBn: 'যাত্রা, স্টেশন ও গন্তব্য', topic: 'へ行きます / で行きます', estimatedMinutes: 20 },
  { num: 6, id: 'n5-l6', titleJa: '食事と行動', titleBn: 'খাবার গ্রহণ ও কর্মবাচক বাক্য', topic: 'を 食べます / を 飲みます', estimatedMinutes: 22 },
];

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user, progress } = useAuth();
  const [isAiSenseiOpen, setIsAiSenseiOpen] = useState<boolean>(false);
  const [isPlacementOpen, setIsPlacementOpen] = useState<boolean>(false);
  const [knowledgeVersion, setKnowledgeVersion] = useState<number>(0);
  const [showMemoryOs, setShowMemoryOs] = useState<boolean>(false);

  // Student metrics synced from localStorage & Auth state
  const studentName = user?.name || user?.email?.split('@')[0] || 'শিক্ষার্থী';
  const streakDays = user?.streakDays || (progress as any)?.streakDays || 1;

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('nihomi_completed_lessons');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length > 0) return arr;
      }
    } catch {}
    return [];
  });

  const [studentXp, setStudentXp] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [baitoReadinessScore, setBaitoReadinessScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('nihomi_baito_readiness_score') || '0', 10);
    } catch {
      return 0;
    }
  });

  // Listen for progress updates
  useEffect(() => {
    const handleProgressUpdated = () => {
      try {
        const raw = localStorage.getItem('nihomi_completed_lessons');
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) setCompletedLessons(arr);
        }
        const xp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
        if (xp) setStudentXp(xp);
      } catch {}
      setKnowledgeVersion(v => v + 1);
    };

    window.addEventListener('nihomi:progress-updated', handleProgressUpdated);
    window.addEventListener('nihomi:lesson-completed', handleProgressUpdated);
    window.addEventListener('nihomi:knowledge-state-updated', handleProgressUpdated);
    window.addEventListener('storage', handleProgressUpdated);

    return () => {
      window.removeEventListener('nihomi:progress-updated', handleProgressUpdated);
      window.removeEventListener('nihomi:lesson-completed', handleProgressUpdated);
      window.removeEventListener('nihomi:knowledge-state-updated', handleProgressUpdated);
      window.removeEventListener('storage', handleProgressUpdated);
    };
  }, []);

  // Determine authoritative mission & curriculum status
  const kState = loadLearnerKnowledgeState();
  const canonicalMission = getNextBestMission(kState);
  const grammarStatus = isGrammarEligible(kState);
  const currentLessonNum = Math.min(6, completedLessons.length + 1);
  const activeMission = N5_CURRICULUM_PATHWAY.find((l) => l.num === currentLessonNum) || N5_CURRICULUM_PATHWAY[0];

  if (showMemoryOs) {
    return (
      <div className="min-h-screen bg-[#090814] text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <button
            type="button"
            onClick={() => setShowMemoryOs(false)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-bold text-white transition-all cursor-pointer"
          >
            ← ড্যাশবোর্ডে ফিরে যান (Return to Dashboard)
          </button>
          <MemoryOsView
            onNavigate={(view) => {
              if (view === 'dashboard') setShowMemoryOs(false);
              else onNavigate?.(view);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080711] text-stone-100 font-sans antialiased pb-24 selection:bg-red-600 selection:text-white">
      {/* Sleek Minimal Header */}
      <header className="border-b border-white/[0.06] bg-[#090814]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-red-600/30">
              日
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-white tracking-wide">LEARNING CANVAS</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-mono font-bold border border-red-500/20">
                  N5 FOUNDATION
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-medium hidden sm:block">
                ようこそ, {studentName} • Spaced Repetition Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{streakDays} দিন স্ট্রিক</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{studentXp} XP</span>
            </div>
            <button
              onClick={() => setIsAiSenseiOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-all shadow-md shadow-red-600/20 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sensei AI</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Learning Canvas */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* HERO CTA: ONE PROMINENT NEXT BEST MISSION CARD                            */}
        {/* ========================================================================= */}
        <section aria-label="Hero Next Best Mission">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#16122d] via-[#141226] to-[#0c0a18] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
            {/* Ambient Tokyo Neon Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 w-72 h-72 bg-red-600/15 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
                  <Zap className="w-3.5 h-3.5 fill-amber-300" />
                  <span>আজকের পরবর্তী মিশন • NEXT BEST MISSION</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-300 font-mono">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    ⏱️ {activeMission.estimatedMinutes} মিনিট
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">ফ্রি ও আনলকড</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-amber-400/90 font-japanese font-bold tracking-wider">
                  JLPT N5 • {canonicalMission.titleBn}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                  {canonicalMission.titleBn}
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl font-medium">
                  {canonicalMission.whyItMattersBn}
                </p>
              </div>

              {/* ONE Prominent Hero CTA Button + Placement Fast-Track */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  id="btn-dashboard-start-next-mission"
                  onClick={() => onNavigate?.(canonicalMission.viewRoute, canonicalMission.viewParams)}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm sm:text-base shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-3 cursor-pointer group active:scale-98"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{canonicalMission.actionLabelBn || 'আজকের মিশন শুরু করুন'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>

                <button
                  type="button"
                  id="btn-dashboard-placement-test"
                  onClick={() => setIsPlacementOpen(true)}
                  className="px-5 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-amber-500/30 text-stone-300 hover:text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>আগে জাপানি জানা আছে? প্লেসমেন্ট টেস্ট দিন</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LINEAR N5 LEVEL MAP: [Completed] -> [Current (Active)] -> [Upcoming]      */}
        {/* ========================================================================= */}
        <section aria-label="N5 Linear Level Map" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-500" />
                <span>N5 লেভেল ম্যাপ (Linear Progression Map)</span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                ধাপে ধাপে শূন্য থেকে সম্পূর্ণ N5 জয় করার রোডম্যাপ
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.('courses')}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer transition"
            >
              <span>সকল পাঠ ({N5_CURRICULUM_PATHWAY.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {N5_CURRICULUM_PATHWAY.map((lesson) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isGrammarBlocked = lesson.num > 1 && !grammarStatus.eligible;
              const isUpcoming = isGrammarBlocked || (!isCompleted && lesson.num > completedLessons.length + 1);
              const isActive = !isCompleted && !isGrammarBlocked && (lesson.num === 1 || lesson.num === completedLessons.length + 1);

              return (
                <div
                  key={lesson.id}
                  onClick={() => {
                    onNavigate?.('lesson', { lessonId: lesson.id });
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between ${
                    isActive
                      ? 'bg-gradient-to-b from-[#1c1737] to-[#120f26] border-amber-500/50 shadow-xl shadow-amber-950/30 ring-1 ring-amber-500/40 cursor-pointer'
                      : isCompleted
                      ? 'bg-white/[0.03] hover:bg-white/[0.06] border-emerald-500/30 cursor-pointer'
                      : 'bg-white/[0.02] border-white/[0.06] opacity-60 cursor-pointer'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          </span>
                        ) : isActive ? (
                          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-black border border-amber-500/40 animate-pulse">
                            ▶
                          </span>
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-stone-800 text-stone-500 flex items-center justify-center text-xs">
                            <Lock className="w-3 h-3" />
                          </span>
                        )}
                        <span className="text-[11px] font-mono font-bold text-stone-400">
                          লেসন ০{lesson.num}
                        </span>
                      </div>

                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 animate-pulse">
                          চলমান মিশন
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          সম্পন্ন
                        </span>
                      )}
                      {isUpcoming && (
                        <span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-stone-500 text-[10px] font-bold">
                          পরবর্তী ধাপ
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-xs text-stone-400 font-japanese">
                        {lesson.titleJa}
                      </div>
                      <h3 className="text-sm font-bold text-white mt-0.5 leading-snug">
                        {lesson.titleBn}
                      </h3>
                      <p className="text-[11px] text-stone-400 mt-1 line-clamp-1 font-mono">
                        {lesson.topic}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-stone-500" />
                      ~{lesson.estimatedMinutes} মি.
                    </span>

                    {isActive ? (
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                        <span>শুরু করুন</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    ) : isCompleted ? (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <span>পুনরায় পড়ুন</span>
                        <RotateCcw className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[11px] text-stone-500">লকড</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* DECLUTTERED TELEMETRY PILLS & MEMORYOS LAUNCHER                           */}
        {/* ========================================================================= */}
        <section aria-label="Progress & Spaced Repetition" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Kana & Kanji Mastery */}
          <div
            onClick={() => onNavigate?.('kanji')}
            className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-rose-400" />
                <span>কাঞ্জি ও কানা দখল</span>
              </span>
              <span className="text-[11px] text-rose-400 font-mono font-bold">১০০% কানা</span>
            </div>
            <p className="text-xs text-stone-400">
              হিরাগানা ও কাতাকানা সম্পূর্ণ। ২৪টি N5 কাঞ্জি অনুশীলনে মাস্টার্ড।
            </p>
            <div className="pt-1 text-[11px] text-stone-300 font-semibold group-hover:text-rose-300 flex items-center gap-1">
              <span>কাঞ্জি ল্যাব খুলুন →</span>
            </div>
          </div>

          {/* Card 2: Workplace Conbini Readiness */}
          <div
            onClick={() => onNavigate?.('baito')}
            className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Store className="w-4 h-4 text-amber-400" />
                <span>কনবিনি ও কর্মজীবন</span>
              </span>
              <span className="text-[11px] text-amber-400 font-mono font-bold">{baitoReadinessScore}% রেডি</span>
            </div>
            <p className="text-xs text-stone-400">
              টোকিও ৭-ইলেভেন ক্যাশিয়ার ও কাস্টমার কেইগো শিফট সিমুলেটর।
            </p>
            <div className="pt-1 text-[11px] text-stone-300 font-semibold group-hover:text-amber-300 flex items-center gap-1">
              <span>WorkOS সিমুলেটর খুলুন →</span>
            </div>
          </div>

          {/* Card 3: MemoryOS Spaced Repetition Drill */}
          <div
            onClick={() => setShowMemoryOs(true)}
            className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-red-500/10 border border-amber-500/30 hover:border-amber-500/50 transition-all cursor-pointer space-y-2 group shadow-lg"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>MemoryOS™ স্পেসড রিভিউ</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                ৩টি ভুল চিহ্নিত
              </span>
            </div>
            <p className="text-xs text-stone-300">
              দুর্বল ব্যাকরণ ও শব্দার্থগুলো ভুলে যাওয়ার আগেই স্বয়ংক্রিয়ভাবে ঝালিয়ে নিন।
            </p>
            <div className="pt-1 text-[11px] text-amber-400 font-bold group-hover:text-amber-300 flex items-center gap-1">
              <span>রিভিউ সেশন শুরু করুন →</span>
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

      {/* Placement Diagnostic Modal */}
      <PlacementDiagnosticModal
        isOpen={isPlacementOpen}
        onClose={() => setIsPlacementOpen(false)}
        onPlacementApplied={(nodeId, viewRoute, viewParams) => {
          setIsPlacementOpen(false);
          onNavigate?.(viewRoute, viewParams);
        }}
      />
    </div>
  );
};

export default DashboardView;