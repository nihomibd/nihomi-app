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
  Play,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AiSenseiModal } from '../features/student-dashboard/components/AiSenseiModal';
import { MemoryOsView } from './MemoryOsView';
import { loadLearnerKnowledgeState } from '../core/curriculum/learnerKnowledgeState';
import { getNextBestMission, isGrammarEligible } from '../core/curriculum/journeyEngine';
import { PlacementDiagnosticModal } from '../components/learning/PlacementDiagnosticModal';
import { TokyoKonbiniFirstMissionModal, REAL_LIFE_MISSIONS } from '../components/missions/TokyoKonbiniFirstMissionModal';
import { calculateJapanReadiness, getSavedOnboardingAnswers } from '../core/onboarding/onboardingStorage';
import { trackNihomiEvent } from '../utils/analytics';

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

export const N5_CURRICULUM_PATHWAY: MilestoneLesson[] = [
  { num: 1, id: 'n5-l01', titleJa: '自己紹介', titleBn: 'নিজের পরিচয় ও সম্ভাষণ', topic: '~は ~です / ~じゃありません', estimatedMinutes: 15 },
  { num: 2, id: 'n5-l02', titleJa: '物の名前', titleBn: 'দৈনন্দিন বস্তু ও জিজ্ঞাসা', topic: 'これ・それ・あれ / この・その・あの', estimatedMinutes: 15 },
  { num: 3, id: 'n5-l03', titleJa: '場所案内', titleBn: 'স্থান ও দিকনির্দেশনা', topic: 'ここ・そこ・あそこ / どこですか', estimatedMinutes: 18 },
  { num: 4, id: 'n5-l04', titleJa: '時間と予定', titleBn: 'সময়, দিন ও দৈনন্দিন রুটিন', topic: '今何時ですか / 〜ます・〜ません', estimatedMinutes: 20 },
  { num: 5, id: 'n5-l05', titleJa: '移動と乗り物', titleBn: 'যাত্রা, স্টেশন ও গন্তব্য', topic: 'へ行きます / で行きます', estimatedMinutes: 20 },
  { num: 6, id: 'n5-l06', titleJa: '食事と行動', titleBn: 'খাবার গ্রহণ ও কর্মবাচক বাক্য', topic: 'を 食べます / を 飲みます', estimatedMinutes: 22 },
  { num: 7, id: 'n5-l07', titleJa: '道具と授受', titleBn: 'উপকরণ ও উপহার আদানপ্রদান', topic: 'で 書きます / に あげます', estimatedMinutes: 20 },
  { num: 8, id: 'n5-l08', titleJa: '形容詞と特徴', titleBn: 'বিশেষণ ও গুণাবলি', topic: 'い形容詞 / な形容詞', estimatedMinutes: 22 },
  { num: 9, id: 'n5-l09', titleJa: '好き嫌いと能力', titleBn: 'পছন্দ, অপছন্দ ও দক্ষতা', topic: 'が 好きです / が 分かります', estimatedMinutes: 20 },
  { num: 10, id: 'n5-l10', titleJa: '存在と位置', titleBn: 'বস্তু ও প্রাণীর অবস্থান', topic: 'が あります / が います', estimatedMinutes: 20 },
  { num: 11, id: 'n5-l11', titleJa: '数量と助数詞', titleBn: 'গণনা ও পরিমাণবাচক শব্দ', topic: '〜つ / 〜人 / 〜台 / いくつ', estimatedMinutes: 25 },
  { num: 12, id: 'n5-l12', titleJa: '比較と過去', titleBn: 'তুলনা ও অতীতের রূপ', topic: 'より〜 / の方が〜 / でした', estimatedMinutes: 22 },
  { num: 13, id: 'n5-l13', titleJa: '願望と目的', titleBn: 'ইচ্ছা ও উদ্দেশ্য', topic: 'が 欲しいです / 〜に行きます', estimatedMinutes: 20 },
  { num: 14, id: 'n5-l14', titleJa: 'て形と依頼', titleBn: 'অনুরোধ ও তে-ফর্ম', topic: '〜てください / 〜ています', estimatedMinutes: 25 },
  { num: 15, id: 'n5-l15', titleJa: '許可と禁止', titleBn: 'অনুমতি ও নিষেধ', topic: '〜てもいいです / 〜てはいけません', estimatedMinutes: 22 },
  { num: 16, id: 'n5-l16', titleJa: '行動順序と方法', titleBn: 'কাজের ধারাবাহিকতা ও উপায়', topic: '〜てから / どうやって', estimatedMinutes: 22 },
  { num: 17, id: 'n5-l17', titleJa: 'ない形と義務', titleBn: 'নাই-ফর্ম ও বাধ্যবাধকতা', topic: '〜なければなりません / 〜ないでください', estimatedMinutes: 25 },
  { num: 18, id: 'n5-l18', titleJa: '辞書形と可能', titleBn: 'অভিধান রূপ ও সামর্থ্য', topic: '〜ことができます / 趣味は〜', estimatedMinutes: 25 },
  { num: 19, id: 'n5-l19', titleJa: 'た形と経験', titleBn: 'অতীত অভিজ্ঞতা ও তা-ফর্ম', topic: '〜たことがあります / 〜たり〜たり', estimatedMinutes: 25 },
  { num: 20, id: 'n5-l20', titleJa: '普通体と日常会話', titleBn: 'কথ্য রূপ ও বন্ধুসুলভ ভাষা', topic: '普通体 (Casual Plain Form)', estimatedMinutes: 25 },
  { num: 21, id: 'n5-l21', titleJa: '意見と推測', titleBn: 'মতামত ও ধারণা', topic: '〜と思います / 〜と言いました', estimatedMinutes: 25 },
  { num: 22, id: 'n5-l22', titleJa: '連体修飾', titleBn: 'বিশেষ্যকে বর্ণনা করা', topic: '名詞修飾節 (Noun Modification)', estimatedMinutes: 28 },
  { num: 23, id: 'n5-l23', titleJa: 'ときと条件', titleBn: 'সময় ও স্বাভাবিক শর্ত', topic: '〜とき / 〜と、〜', estimatedMinutes: 25 },
  { num: 24, id: 'n5-l24', titleJa: '授受表現', titleBn: 'উপকার আদান-প্রদান', topic: '〜てくれます / 〜てもらいます', estimatedMinutes: 28 },
  { num: 25, id: 'n5-l25', titleJa: '条件と仮定', titleBn: 'শর্ত ও সমাপ্তি', topic: '〜たら / 〜ても (Conditionals)', estimatedMinutes: 30 }
];

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user, progress } = useAuth();
  const [isAiSenseiOpen, setIsAiSenseiOpen] = useState<boolean>(false);
  const [isPlacementOpen, setIsPlacementOpen] = useState<boolean>(false);
  const [isKonbiniModalOpen, setIsKonbiniModalOpen] = useState<boolean>(false);
  const [activeMissionId, setActiveMissionId] = useState<string>('tokyo_konbini_01');
  const [lessonFilter, setLessonFilter] = useState<'all' | 'stage1' | 'stage2'>('all');
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
  const currentLessonNum = Math.min(25, completedLessons.length + 1);
  const activeMission = N5_CURRICULUM_PATHWAY.find((l) => l.num === currentLessonNum) || N5_CURRICULUM_PATHWAY[0];
  const isKonbiniDone = typeof window !== 'undefined' && localStorage.getItem('nihomi_mission_konbini_completed') === 'true';
  const savedAnswers = getSavedOnboardingAnswers();
  const readiness = calculateJapanReadiness(savedAnswers);

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
                  <span>
                    {!isKonbiniDone ? 'TODAY’S MISSION • বাস্তব জাপান সিমুলেশন' : 'আজকের পরবর্তী মিশন • NEXT BEST MISSION'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-300 font-mono">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    ⏱️ {!isKonbiniDone ? '২ মিনিট' : `${activeMission.estimatedMinutes} মিনিট`}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">ফ্রি ও আনলকড</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-amber-400/90 font-japanese font-bold tracking-wider">
                  {!isKonbiniDone ? 'Tokyo Konbini • リアルコンビニ' : `JLPT N5 • ${canonicalMission.titleBn}`}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                  {!isKonbiniDone
                    ? 'Mission 01: Tokyo Konbini (কনবিনি চ্যালেঞ্জ)'
                    : canonicalMission.titleBn}
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl font-medium">
                  {!isKonbiniDone
                    ? 'টোকিওর সেভেন-ইলেভেন বা লসনে প্রথম কেনাকাটার অভিজ্ঞতা। প্লাস্টিক ব্যাগ ও ক্যাশিয়ারের প্রশ্নের দ্রুত সমাধান।'
                    : canonicalMission.whyItMattersBn}
                </p>
              </div>

              {/* ONE Prominent Hero CTA Button + Placement Fast-Track */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                {!isKonbiniDone ? (
                  <button
                    type="button"
                    id="btn-dashboard-start-first-mission"
                    onClick={() => {
                      trackNihomiEvent('mission_started', { source: 'dashboard_hero' });
                      setIsKonbiniModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm sm:text-base shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-3 cursor-pointer group active:scale-98"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Mission শুরু করি →</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </button>
                ) : (
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
                )}

                <button
                  type="button"
                  id="btn-dashboard-placement-test"
                  onClick={() => setIsPlacementOpen(true)}
                  className="px-5 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-amber-500/30 text-stone-300 hover:text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>আগে জাপানি জানা আছে? প্লেসমেন্ট টেস্ট দিন</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* JAPAN READINESS™ SCORE BREAKDOWN                                          */}
        {/* ========================================================================= */}
        <section aria-label="Japan Readiness Breakdown" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Japan Readiness Score™ (প্রস্তুতি সূচক)</span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                জাপানে উচ্চশিক্ষা, কাজ ও বসবাসের জন্য প্রয়োজনীয় ৪টি মূল দক্ষতার সমন্বিত স্কোর।
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-black text-sm shadow-lg shadow-emerald-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{readiness.overallScore}% রেডি</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. Foundation */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-300">Foundation (বর্ণ ও ব্যাকরণ)</span>
                <span className="font-mono font-bold text-red-400">{readiness.foundationScore}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${readiness.foundationScore}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-400 leading-snug">
                হিরাগানা, কাতাকানা ও মিন্না নো নিহোঙ্গো N5 ব্যাকরণ ভিত্তি।
              </p>
            </div>

            {/* 2. Speaking */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-300">Speaking (কথোপকথন)</span>
                <span className="font-mono font-bold text-amber-400">{readiness.speakingScore}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${readiness.speakingScore}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-400 leading-snug">
                টোকিও পিচ অ্যাকসেন্ট, স্বতঃস্ফূর্ত কথা বলা ও জড়তাহীন উচ্চারণ।
              </p>
            </div>

            {/* 3. Daily Life */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-300">Daily Life (দৈনন্দিন জীবন)</span>
                <span className="font-mono font-bold text-cyan-400">{readiness.dailyLifeScore}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${readiness.dailyLifeScore}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-400 leading-snug">
                কনবিনি কেনাকাটা, ট্রেন সাবওয়ে, দিকনির্দেশনা ও রেস্তোরাঁ অর্ডার।
              </p>
            </div>

            {/* 4. Survival */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-300">Survival (জরুরি পরিস্থিতি)</span>
                <span className="font-mono font-bold text-emerald-400">{readiness.survivalScore}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${readiness.survivalScore}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-400 leading-snug">
                জরুরি সাহায্য চাওয়া, ডাক্তারের কাছে সমস্যা বলা ও বিনয়ী কেইগো।
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5 REAL-LIFE MISSIONS SCENARIO HUB                                         */}
        {/* ========================================================================= */}
        <section aria-label="5 Real-Life Missions" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-400" />
                <span>বাস্তব জাপানের ৫টি মিশন (5 Real-Life Missions)</span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                কনবিনি, ট্রেন স্টেশন, রেস্তোরাঁ ও অফিস ইন্টারভিউ—বাস্তব পরিস্থিতিতে কথা বলার লাইভ সিমুলেশন।
              </p>
            </div>
            <div className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              সবগুলো ফ্রি ও আনলকড
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {REAL_LIFE_MISSIONS.map((m) => {
              const isDone = typeof window !== 'undefined' && (
                localStorage.getItem(`nihomi_mission_${m.id}_completed`) === 'true' ||
                (m.id === 'tokyo_konbini_01' && isKonbiniDone)
              );
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setActiveMissionId(m.id);
                    setIsKonbiniModalOpen(true);
                  }}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group ${
                    isDone
                      ? 'bg-white/[0.03] hover:bg-white/[0.06] border-emerald-500/30'
                      : 'bg-gradient-to-b from-[#1c1737] to-[#120f26] hover:from-[#231d45] hover:to-[#171330] border-amber-500/30 shadow-lg'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono font-black text-xs border border-amber-500/30">
                          {m.num}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-stone-400">
                          {m.tagBn}
                        </span>
                      </div>
                      {isDone ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>সম্পন্ন</span>
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600/20 text-red-300 font-bold border border-red-500/30 animate-pulse">
                          +৫০ XP
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-stone-400 font-japanese">
                        {m.titleJa}
                      </div>
                      <h3 className="text-sm font-bold text-white mt-0.5 leading-snug group-hover:text-amber-200 transition-colors">
                        {m.titleBn}
                      </h3>
                      <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">
                        {m.location} • {m.speaker}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-amber-400/90 font-mono">
                      ⏱️ ২ মিনিট
                    </span>
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>{isDone ? 'পুনরায় খেলুন' : 'মিশন শুরু করুন'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LINEAR N5 LEVEL MAP: [Completed] -> [Current (Active)] -> [Upcoming]      */}
        {/* ========================================================================= */}
        <section aria-label="N5 Linear Level Map" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-500" />
                <span>N5 লেভেল ম্যাপ (Minna no Nihongo ১–২৫)</span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                ধাপে ধাপে শূন্য থেকে সম্পূর্ণ N5 জয় করার রোডম্যাপ (২৫টি পূর্ণাঙ্গ পাঠ)
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setLessonFilter('all')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  lessonFilter === 'all' ? 'bg-rose-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
                }`}
              >
                সব পাঠ (১–২৫)
              </button>
              <button
                type="button"
                onClick={() => setLessonFilter('stage1')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  lessonFilter === 'stage1' ? 'bg-rose-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
                }`}
              >
                লেসন ১–১২
              </button>
              <button
                type="button"
                onClick={() => setLessonFilter('stage2')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  lessonFilter === 'stage2' ? 'bg-rose-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
                }`}
              >
                লেসন ১৩–২৫
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {N5_CURRICULUM_PATHWAY.filter((lesson) => {
              if (lessonFilter === 'stage1') return lesson.num <= 12;
              if (lessonFilter === 'stage2') return lesson.num > 12;
              return true;
            }).map((lesson) => {
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

      {/* Interactive Missions Modal */}
      <TokyoKonbiniFirstMissionModal
        isOpen={isKonbiniModalOpen}
        initialMissionId={activeMissionId}
        onClose={() => setIsKonbiniModalOpen(false)}
        onComplete={() => {
          setIsKonbiniModalOpen(false);
          setKnowledgeVersion((v) => v + 1);
        }}
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default DashboardView;