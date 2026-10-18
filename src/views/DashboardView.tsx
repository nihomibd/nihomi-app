import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Flame,
  BookOpen,
  CheckCircle2,
  Clock,
  RotateCcw,
  Bot,
  Zap,
  Lock,
  Compass,
  Play,
  Target,
  Coins,
  Gift,
  Plus,
  ChevronRight,
  Award,
  LogOut,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AiSenseiModal } from '../features/student-dashboard/components/AiSenseiModal';
import { BadgeShareModal } from '../components/BadgeShareModal';
import { MemoryOsView } from './MemoryOsView';
import { loadLearnerKnowledgeState } from '../core/curriculum/learnerKnowledgeState';
import { getNextBestMission, isGrammarEligible } from '../core/curriculum/journeyEngine';
import { BengaliQuickCalibrationModal } from '../components/learning/BengaliQuickCalibrationModal';
import { TokyoKonbiniFirstMissionModal } from '../components/missions/TokyoKonbiniFirstMissionModal';
import { calculateJapanReadiness, getSavedOnboardingAnswers } from '../core/onboarding/onboardingStorage';
import { calculateJapanReadinessReport, READINESS_DIMENSIONS_META } from '../core/learning/japanReadinessEngine';
import { trackNihomiEvent } from '../utils/analytics';
import { MilestoneBadge } from '../lib/badgesData';

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
  const { user, progress, coinWallet, logout } = useAuth();
  const [isAiSenseiOpen, setIsAiSenseiOpen] = useState<boolean>(false);
  const [isPlacementOpen, setIsPlacementOpen] = useState<boolean>(false);
  const [isKonbiniModalOpen, setIsKonbiniModalOpen] = useState<boolean>(false);
  const [showMemoryOs, setShowMemoryOs] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Student metrics synced from authenticated state & user-scoped storage
  const studentName = user?.name || user?.email?.split('@')[0] || 'শিক্ষার্থী';
  const streakDays = progress?.currentStreak ?? progress?.streakDays ?? user?.streakDays ?? 0;

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    if (progress?.completedLessonIds && progress.completedLessonIds.length > 0) {
      return progress.completedLessonIds;
    }
    try {
      const storageKey = user?.id ? `nihomi_completed_lessons_${user.id}` : 'nihomi_completed_lessons';
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length > 0) return arr;
      }
    } catch {}
    return [];
  });

  const [studentXp, setStudentXp] = useState<number>(() => {
    if (typeof progress?.experiencePoints === 'number') {
      return progress.experiencePoints;
    }
    try {
      const storageKey = user?.id ? `nihomi_student_xp_${user.id}` : 'nihomi_student_xp';
      return parseInt(localStorage.getItem(storageKey) || '0', 10);
    } catch {
      return 0;
    }
  });

  // Sync state if authenticated progress updates
  useEffect(() => {
    if (progress?.completedLessonIds) {
      setCompletedLessons(progress.completedLessonIds);
    }
    if (typeof progress?.experiencePoints === 'number') {
      setStudentXp(progress.experiencePoints);
    }
  }, [progress]);

  // Listen for progress updates
  useEffect(() => {
    const handleProgressUpdated = () => {
      try {
        const storageKey = user?.id ? `nihomi_completed_lessons_${user.id}` : 'nihomi_completed_lessons';
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) setCompletedLessons(arr);
        }
        const xpKey = user?.id ? `nihomi_student_xp_${user.id}` : 'nihomi_student_xp';
        const xp = parseInt(localStorage.getItem(xpKey) || '0', 10);
        if (xp) setStudentXp(xp);
      } catch {}
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
  }, [user]);

  // Determine authoritative mission & curriculum status
  const kState = loadLearnerKnowledgeState();
  const canonicalMission = getNextBestMission(kState);
  const currentLessonNum = Math.min(25, completedLessons.length + 1);
  const activeMission = N5_CURRICULUM_PATHWAY.find((l) => l.num === currentLessonNum) || N5_CURRICULUM_PATHWAY[0];
  const isKonbiniDone = typeof window !== 'undefined' && localStorage.getItem('nihomi_mission_konbini_completed') === 'true';
  const savedAnswers = getSavedOnboardingAnswers();
  const readinessReport = calculateJapanReadinessReport(kState, isKonbiniDone ? 1 : 0);

  if (showMemoryOs) {
    return (
      <div className="min-h-screen bg-[#FAF9FC] dark:bg-[#141726] text-slate-900 dark:text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <button
            type="button"
            onClick={() => setShowMemoryOs(false)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-xs font-bold text-purple-700 dark:text-purple-300 transition-all cursor-pointer"
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

  const earnedMilestone: MilestoneBadge = {
    id: `milestone-${streakDays > 0 ? 'streak' : 'start'}`,
    title: streakDays >= 7 ? '7-Day Samurai Streak' : (streakDays >= 1 ? `${streakDays}-Day Focus Streak` : 'Hiragana Pioneer'),
    titleJa: streakDays >= 7 ? '7日間の継続達人' : (streakDays >= 1 ? `${streakDays}日連続学習` : '日本語の旅立ち'),
    description: streakDays >= 1
      ? `${streakDays} days of consistent Japanese practice on NIHOMI. Spaced repetition active.`
      : 'Began authentic JLPT journey on NIHOMI platform.',
    banglaDescription: streakDays >= 1
      ? `${streakDays} দিন নিয়মিত জাপানি ভাষা অনুশীলনের স্ট্রিক।`
      : 'নিহোমি প্ল্যাটফর্মে প্রামাণ্য JLPT যাত্রা শুরু হয়েছে।',
    category: 'Consistency',
    rarity: (streakDays >= 7 ? 'Epic' : streakDays >= 1 ? 'Rare' : 'Common') as 'Epic' | 'Rare' | 'Common',
    xpReward: studentXp,
    iconName: streakDays >= 7 ? 'flame' : 'award',
    targetValue: 7,
    unit: 'days',
    isUnlocked: true,
    unlockedAt: new Date().toISOString()
  };

  return (
    <div className="min-h-screen bg-[#FAF9FC] dark:bg-[#141726] text-slate-900 dark:text-stone-100 font-sans antialiased pb-24 selection:bg-[#E45147] selection:text-white">
      {/* Learner Context Ribbon */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-1 flex items-center justify-between text-xs text-slate-500 dark:text-stone-400">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-slate-700 dark:text-stone-200 truncate">স্বাগতম, {studentName}</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-[#E45147] font-mono font-bold border border-rose-500/20 text-[10px] shrink-0">
            JLPT N5
          </span>
          <span className="hidden sm:inline text-slate-400">• স্পেসড রিপিটেশন সক্রিয়</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span className="font-mono font-bold">{studentXp}</span>
            <span className="text-[10px]"> XP</span>
          </div>
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400 cursor-pointer transition-colors"
            title="শেয়ার করুন আপনার স্ট্রিক ও অর্জন"
          >
            <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span className="font-mono font-bold">{streakDays}d</span>
          </button>
          <button
            type="button"
            onClick={() => logout()}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-white/10 hover:bg-rose-500/15 hover:text-[#E45147] text-xs font-semibold text-slate-600 dark:text-stone-300 border border-slate-300/60 dark:border-white/10 cursor-pointer transition-colors"
            title="লগআউট"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">লগআউট</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        {/* Founder Preview Banner */}
        {(user?.role === 'admin' || user?.role === 'founder') && (
          <div className="bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-indigo-500/15 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500 text-lg shrink-0">
                👑
              </div>
              <div>
                <div className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  Founder Preview Mode (ফাউন্ডার প্রিভিউ মোড)
                </div>
                <p className="text-[11px] text-slate-600 dark:text-stone-300">
                  Viewing learner experience as Founder • শিক্ষার্থী ইন্টারফেস প্রিভিউ
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.('founder')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer shrink-0"
            >
              <span>Return to Founder HQ (ফাউন্ডার কমান্ড সেন্টার) →</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. GREETING CARD WITH NIHOMI SENSEI CHARACTER ARTWORK (POSTER 04 SPEC)    */}
        {/* ========================================================================= */}
        <section aria-label="Learner Welcome Banner">
          <div className="bg-gradient-to-r from-[#F6F0E6] via-amber-50/40 to-rose-50/30 dark:from-[#1B1E30] dark:via-[#17192A] dark:to-[#141726] border border-[#141726]/10 dark:border-[#E45147]/30 rounded-3xl p-6 sm:p-7 shadow-sm dark:shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-lg z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E45147]/10 dark:bg-[#E45147]/20 border border-[#E45147]/20 text-[#E45147] dark:text-rose-300 text-xs font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#E45147]" />
                <span>Good morning! 今日も一緒にがんばろう！</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                চলুন, আজকের মিশন শুরু করি!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-stone-300 leading-relaxed font-medium">
                প্রতিদিন মাত্র ৫ মিনিট সময় দিন। দেখতে দেখতে জাপানি ভাষার স্বরবর্ণ থেকে শুরু করে টোকিও কনবিনিতে কথা বলার সাবলীলতা অর্জন করবেন।
              </p>
              <div className="flex items-center gap-3 pt-1 text-xs text-slate-500 dark:text-stone-400 font-medium">
                <span className="flex items-center gap-1 font-bold text-[#E45147]">
                  <Target className="w-3.5 h-3.5" />
                  JLPT N5 রোডম্যাপ
                </span>
                <span>•</span>
                <span>বর্তমান স্ট্রিক: {streakDays} দিন</span>
              </div>
            </div>

            {/* Approved Nomi Character Illustration & Speech Bubble */}
            <div className="relative flex items-center justify-center md:justify-end shrink-0 z-10">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#E45147] to-amber-500 opacity-20 blur-md group-hover:opacity-30 transition-opacity" />
                <img
                  src="/brand/nomi/nomi-welcome.png"
                  alt="Nomi Sensei"
                  className="relative w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-2xl border-2 border-[#E45147]/60 shadow-xl shadow-[#E45147]/15 bg-[#F6F0E6]"
                />
                {/* Nomi Greeting Bubble */}
                <div className="absolute -bottom-2 -left-4 sm:-left-6 bg-white dark:bg-[#141726] border border-[#E45147]/40 rounded-xl px-2.5 py-1 shadow-md text-[10px] font-bold text-[#E45147] whitespace-nowrap flex items-center gap-1">
                  <span>一緒にがんばろう！ ✨</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. THE SINGLE "NEXT BEST MISSION" HERO CARD (POSTER 04 SPEC)              */}
        {/* ========================================================================= */}
        <section aria-label="Next Best Mission">
          <div className="rounded-3xl bg-white dark:bg-[#1B1E30] border border-slate-200 dark:border-white/10 p-6 sm:p-7 shadow-lg space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold font-mono">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>
                  {canonicalMission.id === 'konbini-mission-01'
                    ? 'TODAY’S MISSION • বাস্তব জাপান সিমুলেশন'
                    : 'আজকের পরবর্তী সেরা মিশন • NEXT BEST MISSION'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-stone-300 font-mono">
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  ⏱️ {canonicalMission.id === 'konbini-mission-01' ? '২ মিনিট' : `${activeMission.estimatedMinutes} মিনিট`}
                </span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {canonicalMission.id === 'konbini-mission-01' && isKonbiniDone ? '১০০% সম্পন্ন ✓' : 'আনলকড ও প্রস্তুত'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-[#E45147] dark:text-rose-400 font-japanese font-bold tracking-wider">
                {canonicalMission.id === 'konbini-mission-01'
                  ? 'Tokyo Konbini • リアルコンビニ'
                  : canonicalMission.phase === 'phase_1_hiragana_foundation'
                  ? 'হিরাগানা ভিত্তি • HIRAGANA FOUNDATION'
                  : `JLPT N5 • ${canonicalMission.titleBn}`}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                {canonicalMission.titleBn}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-stone-300 leading-relaxed font-medium">
                {canonicalMission.subTitleBn || canonicalMission.whyItMattersBn}
              </p>

              {/* Constitutional Explainable "Why this mission?" Box */}
              <div className="p-3.5 rounded-2xl bg-[#F6F0E6]/60 dark:bg-white/[0.04] border border-[#141726]/10 dark:border-white/10 text-xs text-slate-700 dark:text-stone-300 space-y-1.5 mt-2">
                <div className="text-[11px] font-mono text-[#E45147] dark:text-rose-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E45147]" />
                  <span>কেন এই মিশন? (Why this mission?):</span>
                </div>
                <p className="text-slate-600 dark:text-stone-300 leading-relaxed font-medium">
                  {canonicalMission.whyItMattersBn}
                </p>
                {canonicalMission.japanConnectionBn && (
                  <div className="text-[11px] text-[#6D7C55] dark:text-emerald-400 pt-1 border-t border-[#141726]/10 dark:border-white/5 font-semibold">
                    🇯🇵 বাস্তব সংযোগ: {canonicalMission.japanConnectionBn}
                  </div>
                )}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                id={canonicalMission.id === 'konbini-mission-01' ? 'btn-dashboard-start-first-mission' : 'btn-dashboard-start-next-mission'}
                onClick={() => {
                  trackNihomiEvent('mission_started', { source: 'dashboard_hero', missionId: canonicalMission.id });
                  if (canonicalMission.id === 'konbini-mission-01') {
                    setIsKonbiniModalOpen(true);
                  } else {
                    onNavigate?.(canonicalMission.viewRoute, canonicalMission.viewParams);
                  }
                }}
                className="flex-1 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#E45147] via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm shadow-xl shadow-[#E45147]/25 transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-98"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{canonicalMission.actionLabelBn || 'আজকের মিশন শুরু করুন'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                id="btn-dashboard-placement-test"
                onClick={() => setIsPlacementOpen(true)}
                className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Compass className="w-3.5 h-3.5 text-[#E45147]" />
                <span>প্লেসমেন্ট টেস্ট</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2.5 THE CANONICAL N.I.H.O.M.I. LEARNING LOOP (PEDAGOGICAL ENGINE)         */}
        {/* ========================================================================= */}
        <section aria-label="N.I.H.O.M.I. Learning Loop" className="rounded-3xl bg-white dark:bg-[#1B1E30] border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#E45147]/10 border border-[#E45147]/20 flex items-center justify-center text-[#E45147] font-black text-xs">
                N
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>N.I.H.O.M.I. লার্নিং লুপ (The Learning Method)</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#6D7C55]/15 border border-[#6D7C55]/30 text-[#6D7C55] dark:text-emerald-400 text-[10px] font-bold">
                    পেডাগজি গ্যারান্টি
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-stone-400">
                  প্রতিটি লেসনে ৬টি ধাপে জাপানিজ আয়ত্ত করার বৈজ্ঞানিক মেথডোলজি
                </p>
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400 dark:text-stone-500">
              ৬-ধাপ লার্নিং ফ্রেমওয়ার্ক
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { letter: 'N', title: 'Notice the scene', bn: 'দৃশ্য দেখো।', icon: Eye, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
              { letter: 'I', title: 'Identify the task', bn: 'কাজটি চেনো।', icon: Target, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
              { letter: 'H', title: 'Hunt for signals', bn: 'Clue খোঁজো।', icon: Compass, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
              { letter: 'O', title: 'Own your answer', bn: 'নিজে উত্তর দাও।', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { letter: 'M', title: 'Make meaning', bn: 'কারণ বোঝো।', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
              { letter: 'I', title: 'Improve & retry', bn: 'আবার চেষ্টা করো।', icon: RotateCcw, color: 'text-[#E45147]', bg: 'bg-[#E45147]/10 border-[#E45147]/20' },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#F6F0E6]/40 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`w-7 h-7 rounded-xl border flex items-center justify-center font-black text-xs ${step.bg} ${step.color}`}>
                      {step.letter}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${step.color} opacity-80`} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight">
                      {step.title}
                    </div>
                    <div className="text-[11px] font-medium text-[#E45147] dark:text-rose-300 mt-0.5">
                      {step.bn}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. POSTER 04 — 4 PRIMARY LEARNER QUICK SHORTCUTS (CLEAN 4-GRID)           */}
        {/* ========================================================================= */}
        <section aria-label="Quick Learner Shortcuts">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <button
              type="button"
              onClick={() => onNavigate?.('journey')}
              className="btn-haptic p-4 rounded-2xl bg-white dark:bg-[#1B1E30] hover:border-[#E45147]/50 border border-slate-200 dark:border-white/10 text-left transition-all flex flex-col justify-between gap-3 group cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-[#E45147]/10 border border-[#E45147]/20 flex items-center justify-center text-[#E45147] group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#E45147]">My Journey</div>
                <div className="text-[11px] text-slate-500 dark:text-stone-400">আমার লার্নিং ম্যাপ</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setShowMemoryOs(true)}
              className="btn-haptic p-4 rounded-2xl bg-white dark:bg-[#1B1E30] hover:border-amber-500/50 border border-slate-200 dark:border-white/10 text-left transition-all flex flex-col justify-between gap-3 group cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500">Review Queue</div>
                <div className="text-[11px] text-slate-500 dark:text-stone-400">মেমরি ওএস স্পেসড রিভিউ</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsAiSenseiOpen(true)}
              className="btn-haptic p-4 rounded-2xl bg-white dark:bg-[#1B1E30] hover:border-[#E45147]/50 border border-slate-200 dark:border-white/10 text-left transition-all flex flex-col justify-between gap-3 group cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-[#E45147]/10 border border-[#E45147]/20 flex items-center justify-center text-[#E45147] group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#E45147]">Nomi Sensei</div>
                <div className="text-[11px] text-slate-500 dark:text-stone-400">ব্যক্তিগত মেন্টর</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.('practice', { lessonId: 'n5-l1' })}
              className="btn-haptic p-4 rounded-2xl bg-white dark:bg-[#1B1E30] hover:border-emerald-500/50 border border-slate-200 dark:border-white/10 text-left transition-all flex flex-col justify-between gap-3 group cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500">Practice</div>
                <div className="text-[11px] text-slate-500 dark:text-stone-400">ইন্টারেক্টিভ ড্রিল</div>
              </div>
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CONTINUE YOUR JOURNEY — LOCKED ROADMAP TRACK (POSTER 04 SPEC)          */}
        {/* ========================================================================= */}
        <section aria-label="Visual Learning Journey Path" className="space-y-4">
          <div className="rounded-3xl bg-white dark:bg-[#1B1E30] border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-sm dark:shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/[0.06] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#E45147]" />
                  <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    Continue Your Journey (শেখার ধারাবাহিক পথরেখা)
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-stone-400 mt-0.5">
                  একটি ধাপ শেষ হলে স্বয়ংক্রিয়ভাবে পরবর্তী স্তর আনলক হয় (Strict Cumulative Lattice)
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-700 dark:text-purple-300 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#E45147] shrink-0" />
                <span>
                  পরবর্তী ধাপ: {!isKonbiniDone ? 'Tokyo Konbini চ্যালেঞ্জ' : 'JLPT N5 লেসন ০১'}
                </span>
              </div>
            </div>

            {/* Stepped Visual Journey Flow */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
              {[
                { step: '01', title: 'Calibration', labelBn: 'ক্যালিব্রেশন', state: 'completed' },
                { step: '02', title: 'Kana & Pitch', labelBn: 'হিরাগানা ও কাঞ্জি', state: 'completed' },
                { step: '03', title: 'Tokyo Konbini', labelBn: 'কনবিনি ক্যাশিয়ার', state: isKonbiniDone ? 'completed' : 'current' },
                { step: '04', title: 'Minna N5 (1-5)', labelBn: 'লেসন ০১–০৫', state: isKonbiniDone ? 'current' : 'next' },
                { step: '05', title: 'Tokyo Station', labelBn: 'স্টেশন ও ট্রেন', state: 'locked' },
                { step: '06', title: 'Japan Ready™', labelBn: '১০০% রেডি', state: 'locked' }
              ].map((stage, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2 transition-all ${
                    stage.state === 'completed'
                      ? 'bg-emerald-500/[0.08] border-emerald-500/30'
                      : stage.state === 'current'
                      ? 'bg-purple-500/[0.08] border-purple-500/50 shadow-sm ring-1 ring-purple-500/40'
                      : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-400 dark:text-stone-400">{stage.step}</span>
                    {stage.state === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : stage.state === 'current' ? (
                      <span className="w-2 h-2 rounded-full bg-[#E45147] animate-ping" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-stone-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-600 dark:text-stone-300 font-japanese">{stage.title}</div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">{stage.labelBn}</div>
                  </div>
                  <div className="text-[10px] font-mono pt-1 border-t border-slate-200/50 dark:border-white/5">
                    {stage.state === 'completed' && <span className="text-emerald-600 dark:text-emerald-400 font-bold">সম্পন্ন ✓</span>}
                    {stage.state === 'current' && <span className="text-[#E45147] font-bold animate-pulse">চলমান মিশন ▶</span>}
                    {stage.state === 'next' && <span className="text-blue-500 font-medium">পরবর্তী ধাপ</span>}
                    {stage.state === 'locked' && <span className="text-slate-400 dark:text-stone-500">লকড</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. DUAL SUPPORT PANELS: COINS/REWARD & JAPAN READINESS (2 COLUMNS)         */}
        {/* ========================================================================= */}
        <section aria-label="Learning Metrics and Readiness" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Nihomi Coins & Reward Tracker */}
          <div className="rounded-3xl bg-white dark:bg-[#1B1E30] border border-slate-200 dark:border-amber-500/20 p-5 sm:p-6 shadow-sm dark:shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" />
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">NIHOMI COINS & REWARDS</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold">
                1 Coin = 1 Nomi Sensei Turn
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  🪙 {coinWallet?.coinBalance ?? 10}
                </span>
                <span className="text-xs text-slate-500 dark:text-stone-400 font-medium ml-2">কয়েন ব্যালেন্স</span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                সক্রিয় ও ব্যবহারোপযোগী
              </span>
            </div>

            {/* Quick Coin Actions */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  trackNihomiEvent('lead_captured', { source: 'coin_earn_clicked' });
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-700 dark:text-stone-200 border border-slate-200 dark:border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Gift className="w-3.5 h-3.5 text-emerald-500" />
                <span>Earn</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAiSenseiOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-700 dark:text-stone-200 border border-slate-200 dark:border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-[#E45147]" />
                <span>Use</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.('pricing')}
                className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm shadow-amber-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Buy</span>
              </button>
            </div>
          </div>

          {/* Right: Japan Readiness™ Score Snapshot */}
          <div className="rounded-3xl bg-white dark:bg-[#1B1E30] border border-slate-200 dark:border-emerald-500/20 p-5 sm:p-6 shadow-sm dark:shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" />
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">JAPAN READINESS™</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                {readinessReport.readinessBadge}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  {readinessReport.overallScore}%
                </span>
                <span className="text-xs text-slate-500 dark:text-stone-400 font-medium ml-2">প্রস্তুতি সূচক</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-stone-400">
                {readinessReport.levelTitleBn}
              </span>
            </div>

            {/* 4 Dimension Progress Bars */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-stone-300 font-medium">ভিত্তি (Kana)</span>
                  <span className="font-mono font-bold text-[#E45147]">{readinessReport.dimensions.japaneseFoundation}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E45147] rounded-full"
                    style={{ width: `${readinessReport.dimensions.japaneseFoundation}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-stone-300 font-medium">লিসেনিং</span>
                  <span className="font-mono font-bold text-blue-500">{readinessReport.dimensions.listening}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${readinessReport.dimensions.listening}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-stone-300 font-medium">রিডিং</span>
                  <span className="font-mono font-bold text-purple-500">{readinessReport.dimensions.reading}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${readinessReport.dimensions.reading}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-stone-300 font-medium">স্পিকিং</span>
                  <span className="font-mono font-bold text-amber-500">{readinessReport.dimensions.speaking}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${readinessReport.dimensions.speaking}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Modals */}
      {isAiSenseiOpen && (
        <AiSenseiModal
          isOpen={isAiSenseiOpen}
          onClose={() => setIsAiSenseiOpen(false)}
        />
      )}

      {isPlacementOpen && (
        <BengaliQuickCalibrationModal
          isOpen={isPlacementOpen}
          onClose={() => setIsPlacementOpen(false)}
          onPlacementApplied={(nodeId, viewRoute, viewParams) => {
            setIsPlacementOpen(false);
            if (viewRoute) {
              onNavigate?.(viewRoute, viewParams);
            }
          }}
        />
      )}

      {isKonbiniModalOpen && (
        <TokyoKonbiniFirstMissionModal
          isOpen={isKonbiniModalOpen}
          onClose={() => setIsKonbiniModalOpen(false)}
          onComplete={() => {
            setIsKonbiniModalOpen(false);
            if (typeof window !== 'undefined') {
              localStorage.setItem('nihomi_mission_konbini_completed', 'true');
              window.dispatchEvent(new Event('nihomi:progress-updated'));
            }
          }}
        />
      )}

      {isShareModalOpen && (
        <BadgeShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          badge={earnedMilestone}
          userName={studentName}
        />
      )}
    </div>
  );
};