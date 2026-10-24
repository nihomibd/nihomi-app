// src/v2/pages/V2DashboardPage.tsx
// NIHOMI V3 — UNIFIED STUDENT COCKPIT, JAPAN READINESS RADAR, 25-LESSON PATHWAY & SRS STUDIO
// Version 3 Architecture: Incorporates premier legacy features into modern interactive shell
import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Compass,
  CheckCircle2,
  Store,
  FileText,
  Clock,
  RotateCcw,
  Zap,
  Target,
  Sliders,
  Coins,
  Brain,
  Layers,
  Lock,
  Unlock,
  Volume2,
  Check,
  ChevronRight,
  Play,
  TrendingUp,
  ShieldCheck,
  Headphones,
  Eye,
  MessageSquare,
  ShoppingBag,
  HelpCircle,
  GraduationCap,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { V2Route, V2NavigationParams } from '../types';
import { useAuth } from '../../context/AuthContext';
import { loadLearnerKnowledgeState, hydrateKnowledgeStateFromServer } from '../../core/curriculum/learnerKnowledgeState';
import { getNextBestMission, isGrammarEligible } from '../../core/curriculum/journeyEngine';
import { BengaliQuickCalibrationModal } from '../../components/learning/BengaliQuickCalibrationModal';
import { loopOrchestrator } from '../../core/loop';
import { calculateJapanReadinessReport, JapanReadinessReport } from '../../core/learning/japanReadinessEngine';
import { getSrsState, getSrsSummaryStats, saveSrsItemReview, SrsRating, SrsItemState } from '../../lib/srs';
import { speakJapanese } from '../../lib/tts';

interface V2DashboardPageProps {
  onNavigate: (route: V2Route, params?: V2NavigationParams) => void;
}

interface LessonPathwayNode {
  num: number;
  id: string;
  titleJa: string;
  titleBn: string;
  topic: string;
  estimatedMinutes: number;
  milestoneTitle?: string;
  isMilestoneGate?: boolean;
}

const MINNA_25_LESSONS: LessonPathwayNode[] = [
  { num: 1, id: 'n5-l01', titleJa: '自己紹介', titleBn: 'নিজের পরিচয় ও সম্ভাষণ', topic: '~は ~です / ~じゃありません', estimatedMinutes: 15 },
  { num: 2, id: 'n5-l02', titleJa: '物の名前', titleBn: 'দৈনন্দিন বস্তু ও জিজ্ঞাসা', topic: 'これ・それ・あれ / この・その・あの', estimatedMinutes: 15 },
  { num: 3, id: 'n5-l03', titleJa: '場所案内', titleBn: 'স্থান ও দিকনির্দেশনা', topic: 'ここ・そこ・あそこ / どこですか', estimatedMinutes: 18 },
  { num: 4, id: 'n5-l04', titleJa: '時間と予定', titleBn: 'সময়, দিন ও দৈনন্দিন রুটিন', topic: '今何時ですか / 〜ます・〜ません', estimatedMinutes: 20 },
  { num: 5, id: 'n5-l05', titleJa: '移動と乗り物', titleBn: 'যাত্রা, স্টেশন ও গন্তব্য', topic: 'へ行きます / で行きます', estimatedMinutes: 20, isMilestoneGate: true, milestoneTitle: 'মাইলস্টোন ১: ভিত্তি সমাপ্ত (ফ্রি অ্যাক্সেস সমাপ্তি)' },
  { num: 6, id: 'n5-l06', titleJa: '食事と行動', titleBn: 'খাবার গ্রহণ ও কর্মবাচক বাক্য', topic: 'を 食べます / を 飲みます', estimatedMinutes: 22 },
  { num: 7, id: 'n5-l07', titleJa: '道具と授受', titleBn: 'উপকরণ ও উপহার আদানপ্রদান', topic: 'で 書きます / に あげます', estimatedMinutes: 20 },
  { num: 8, id: 'n5-l08', titleJa: '形容詞と特徴', titleBn: 'বিশেষণ ও গুণাবলি', topic: 'い形容詞 / な形容詞', estimatedMinutes: 22 },
  { num: 9, id: 'n5-l09', titleJa: '好き嫌いと能力', titleBn: 'পছন্দ, অপছন্দ ও দক্ষতা', topic: 'が 好きです / が 分かります', estimatedMinutes: 20 },
  { num: 10, id: 'n5-l10', titleJa: '存在と位置', titleBn: 'বস্তু ও প্রাণীর অবস্থান', topic: 'が あります / が います', estimatedMinutes: 20, isMilestoneGate: true, milestoneTitle: 'মাইলস্টোন ২: দৈনন্দিন জাপানি জীবন' },
  { num: 11, id: 'n5-l11', titleJa: '数量と助数詞', titleBn: 'গণনা ও পরিমাণবাচক শব্দ', topic: '〜つ / 〜人 / 〜台 / いくつ', estimatedMinutes: 25 },
  { num: 12, id: 'n5-l12', titleJa: '比較と過去', titleBn: 'তুলনা ও অতীতের রূপ', topic: 'より〜 / の方が〜 / でした', estimatedMinutes: 22 },
  { num: 13, id: 'n5-l13', titleJa: '願望と目的', titleBn: 'ইচ্ছা ও উদ্দেশ্য', topic: 'が 欲しいです / 〜に行きます', estimatedMinutes: 20 },
  { num: 14, id: 'n5-l14', titleJa: 'て形と依頼', titleBn: 'অনুরোধ ও তে-ফর্ম', topic: '〜てください / 〜ています', estimatedMinutes: 25 },
  { num: 15, id: 'n5-l15', titleJa: '許可と禁止', titleBn: 'অনুমতি ও নিষেধ', topic: '〜てもいいです / 〜てはいけません', estimatedMinutes: 22, isMilestoneGate: true, milestoneTitle: 'মাইলস্টোন ৩: তে-ফর্ম ও ইন্টারঅ্যাকশন' },
  { num: 16, id: 'n5-l16', titleJa: '行動順序と方法', titleBn: 'কাজের ধারাবাহিকতা ও উপায়', topic: '〜てから / どうやって', estimatedMinutes: 22 },
  { num: 17, id: 'n5-l17', titleJa: 'ない形と義務', titleBn: 'নাই-ফর্ম ও বাধ্যবাধকতা', topic: '〜なければなりません / 〜ないでください', estimatedMinutes: 25 },
  { num: 18, id: 'n5-l18', titleJa: '辞書形と可能', titleBn: 'অভিধান রূপ ও সামর্থ্য', topic: '〜ことができます / 趣味は〜', estimatedMinutes: 25 },
  { num: 19, id: 'n5-l19', titleJa: 'た形と経験', titleBn: 'অতীত অভিজ্ঞতা ও তা-ফর্ম', topic: '〜たことがあります / 〜たり〜たり', estimatedMinutes: 25 },
  { num: 20, id: 'n5-l20', titleJa: '普通体と日常会話', titleBn: 'কথ্য রূপ ও বন্ধুসুলভ ভাষা', topic: '普通体 (Casual Plain Form)', estimatedMinutes: 25, isMilestoneGate: true, milestoneTitle: 'মাইলস্টোন ৪: ক্যাজুয়াল ও ফ্রেন্ডলি স্পিকিং' },
  { num: 21, id: 'n5-l21', titleJa: '意見と推測', titleBn: 'মতামত ও ধারণা', topic: '〜と思います / 〜と言いました', estimatedMinutes: 25 },
  { num: 22, id: 'n5-l22', titleJa: '連体修飾', titleBn: 'বিশেষ্যকে বর্ণনা করা', topic: '名詞修飾節 (Noun Modification)', estimatedMinutes: 28 },
  { num: 23, id: 'n5-l23', titleJa: 'ときと条件', titleBn: 'সময় ও স্বাভাবিক শর্ত', topic: '〜とき / 〜と、〜', estimatedMinutes: 25 },
  { num: 24, id: 'n5-l24', titleJa: '授受表現', titleBn: 'উপকার আদান-প্রদান', topic: '〜てくれます / 〜てもらいます', estimatedMinutes: 28 },
  { num: 25, id: 'n5-l25', titleJa: '条件と仮定', titleBn: 'শর্ত ও সমাপ্তি', topic: '〜たら / 〜ても (Conditionals)', estimatedMinutes: 30, isMilestoneGate: true, milestoneTitle: 'মাইলস্টোন ৫: JLPT N5 গ্র্যাজুয়েশন ও সার্টিফিকেট' }
];

interface QuickSrsCard {
  id: string;
  kanji: string;
  reading: string;
  meaningBn: string;
  meaningEn: string;
  stage: string;
}

const DEFAULT_SRS_CARDS: QuickSrsCard[] = [
  { id: 'voc-1', kanji: '日本語', reading: 'にほんご', meaningBn: 'জাপানি ভাষা', meaningEn: 'Japanese language', stage: 'apprentice' },
  { id: 'voc-2', kanji: '食べる', reading: 'たべる', meaningBn: 'খাওয়া (খাবার গ্রহণ)', meaningEn: 'To eat', stage: 'apprentice' },
  { id: 'voc-3', kanji: '行く', reading: 'いく', meaningBn: 'যাওয়া (গমন করা)', meaningEn: 'To go', stage: 'guru' },
  { id: 'voc-4', kanji: '友達', reading: 'ともだち', meaningBn: 'বন্ধু / সহযোদ্ধা', meaningEn: 'Friend', stage: 'master' },
  { id: 'voc-5', kanji: '美味しい', reading: 'おいしい', meaningBn: 'সুস্বাদু / মজাদার', meaningEn: 'Delicious / Tasty', stage: 'apprentice' },
  { id: 'voc-6', kanji: 'いらっしゃいませ', reading: 'いらっしゃいませ', meaningBn: 'দোকানে স্বাগতম', meaningEn: 'Welcome to store', stage: 'guru' }
];

export const V2DashboardPage: React.FC<V2DashboardPageProps> = ({ onNavigate }) => {
  const { user, progress, openAuthModal, coinWallet, refreshAuth } = useAuth();
  const [knowledgeState, setKnowledgeState] = useState(loadLearnerKnowledgeState());
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);
  const [selectedMilestoneTab, setSelectedMilestoneTab] = useState<'all' | '1-5' | '6-10' | '11-15' | '16-20' | '21-25'>('all');
  const [activeSrsIndex, setActiveSrsIndex] = useState(0);
  const [isSrsFlipped, setIsSrsFlipped] = useState(false);
  const [srsSuccessToast, setSrsSuccessToast] = useState<string | null>(null);

  // Authenticated state hydration
  useEffect(() => {
    const handleUpdate = () => setKnowledgeState(loadLearnerKnowledgeState());
    window.addEventListener('nihomi:knowledge-state-updated', handleUpdate);
    window.addEventListener('nihomi:memory-updated', handleUpdate);
    if (user) {
      refreshAuth();
      hydrateKnowledgeStateFromServer(user.id);
    }
    return () => {
      window.removeEventListener('nihomi:knowledge-state-updated', handleUpdate);
      window.removeEventListener('nihomi:memory-updated', handleUpdate);
    };
  }, [user, refreshAuth]);

  // Telemetry & Knowledge Engine
  const nextMission = getNextBestMission(knowledgeState);
  const grammarStatus = isGrammarEligible(knowledgeState);
  const isFounder = user?.email?.trim().toLowerCase() === 'mdtanvirkabirbiplob@gmail.com' || user?.role === 'founder' || user?.role === 'admin';
  const isProUser = isFounder || user?.planId === 'pro' || user?.planId === 'japan_ready';

  // Dynamic Japan Readiness Report
  const readinessReport: JapanReadinessReport = useMemo(() => {
    try {
      return calculateJapanReadinessReport(knowledgeState);
    } catch {
      return {
        overallScore: 12,
        levelTitleBn: 'প্রারম্ভিক অনুসন্ধানকারী',
        levelTitleJa: '日本準備・入門',
        dimensions: {
          japaneseFoundation: 15,
          listening: 10,
          reading: 10,
          speaking: 8,
          dailyLife: 10,
          japanSurvival: 8,
          studyReadiness: 15,
          workReadiness: 12,
          communicationConfidence: 10
        },
        strongestDimensionBn: 'পড়াশোনার প্রস্তুতি (স্টাডি)',
        focusAreaBn: 'কাজের প্রস্তুতি (বাইতো/জব)',
        nextReadinessMilestoneBn: 'হিরাগানা ৫টি স্বরবর্ণ ও প্রথম বাস্তব কনবিনি মিশন সম্পন্ন করা',
        readinessBadge: 'Beginner Ready 🇯🇵'
      };
    }
  }, [knowledgeState]);

  // Loop Orchestrator Multi-domain Briefings
  const japaneseBriefing = useMemo(() => {
    try {
      return loopOrchestrator.startLoopActivity({ domain: 'japanese-learning', learnerState: knowledgeState });
    } catch { return null; }
  }, [knowledgeState]);

  const conbiniBriefing = useMemo(() => {
    try {
      return loopOrchestrator.startLoopActivity({ domain: 'pos-simulation', learnerState: knowledgeState });
    } catch { return null; }
  }, [knowledgeState]);

  const examBriefing = useMemo(() => {
    try {
      return loopOrchestrator.startLoopActivity({ domain: 'exam-os', learnerState: knowledgeState });
    } catch { return null; }
  }, [knowledgeState]);

  const cvBriefing = useMemo(() => {
    try {
      return loopOrchestrator.startLoopActivity({ domain: 'cv-rirekisho', learnerState: knowledgeState });
    } catch { return null; }
  }, [knowledgeState]);

  // Gamification Metrics
  const knownKanaCount = knowledgeState.knownHiragana.length + knowledgeState.knownKatakana.length;
  const reviewDueCount = knowledgeState.reviewQueue?.length ?? 0;
  const coinBalance = coinWallet?.coinBalance ?? ((user as any)?.coinBalance ?? 10);
  const totalStudyMinutes = progress?.totalStudyMinutes ?? ((progress?.totalHours ?? 0) * 60);
  const streakDays = progress?.currentStreak ?? progress?.streakDays ?? (user?.streakDays ?? 0);
  const xpPoints = progress?.experiencePoints ?? ((user as any)?.xpPoints ?? 0);
  const completedLessonsCount = progress?.completedLessonIds?.length ?? (progress as any)?.completedLessonCount ?? 0;
  const n5ProgressPct = Math.min(100, Math.round((completedLessonsCount / 25) * 100));

  // Handler for Next Best Mission Hero
  const handleStartMission = () => {
    if (nextMission.type === 'kana' || nextMission.type === 'word_unlock') {
      if (nextMission.targetChar) {
        onNavigate('kana', { char: nextMission.targetChar });
      } else {
        onNavigate('journey');
      }
    } else if (nextMission.type === 'grammar') {
      const targetLId = nextMission.targetLessonId || (nextMission.viewParams as any)?.lessonId || 'n5-l01';
      onNavigate('lesson', { lessonId: targetLId });
    } else {
      onNavigate('journey');
    }
  };

  // Handler for Lesson Nodes in 25 Minna no Nihongo Pathway
  const handleOpenLesson = (lessonId: string, isLocked: boolean) => {
    if (isLocked) {
      onNavigate('pricing', { planId: 'pro' });
      return;
    }
    onNavigate('lesson', { lessonId });
  };

  // SRS Rating action in dashboard drawer
  const handleRateCard = (rating: SrsRating) => {
    const card = DEFAULT_SRS_CARDS[activeSrsIndex];
    if (card) {
      try {
        saveSrsItemReview(card.id, rating, undefined, 'vocabulary');
      } catch {}
      setSrsSuccessToast(`"${card.kanji}" রিভিউ সম্পন্ন! (${rating.toUpperCase()})`);
      setTimeout(() => setSrsSuccessToast(null), 2500);
    }
    setIsSrsFlipped(false);
    setActiveSrsIndex((prev) => (prev + 1) % DEFAULT_SRS_CARDS.length);
  };

  const handlePlayCardAudio = (text: string) => {
    try {
      speakJapanese(text);
    } catch {}
  };

  // Filtered Minna Lessons based on tab selection
  const filteredPathwayLessons = useMemo(() => {
    if (selectedMilestoneTab === '1-5') return MINNA_25_LESSONS.slice(0, 5);
    if (selectedMilestoneTab === '6-10') return MINNA_25_LESSONS.slice(5, 10);
    if (selectedMilestoneTab === '11-15') return MINNA_25_LESSONS.slice(10, 15);
    if (selectedMilestoneTab === '16-20') return MINNA_25_LESSONS.slice(15, 20);
    if (selectedMilestoneTab === '21-25') return MINNA_25_LESSONS.slice(20, 25);
    return MINNA_25_LESSONS;
  }, [selectedMilestoneTab]);

  // Pentagon Vertices for Japan Readiness Radar
  const radarAxes = [
    { key: 'japaneseFoundation', labelBn: 'জাপানি ভিত্তি', score: readinessReport.dimensions.japaneseFoundation, angle: -90 },
    { key: 'listening', labelBn: 'লিসেনিং', score: readinessReport.dimensions.listening, angle: -18 },
    { key: 'reading', labelBn: 'রিডিং', score: readinessReport.dimensions.reading, angle: 54 },
    { key: 'speaking', labelBn: 'স্পিকিং', score: readinessReport.dimensions.speaking, angle: 126 },
    { key: 'workReadiness', labelBn: 'কনবিনি ও কাজ', score: readinessReport.dimensions.workReadiness, angle: 198 }
  ];

  const radarPoints = radarAxes.map((axis) => {
    const rad = (axis.angle * Math.PI) / 180;
    const radius = Math.max(12, Math.min(90, (axis.score / 100) * 85 + 10));
    const x = 110 + radius * Math.cos(rad);
    const y = 110 + radius * Math.sin(rad);
    return `${x},${y}`;
  }).join(' ');

  if (!user) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-24 text-center">
        <div className="p-8 rounded-3xl bg-[#141726] border border-white/10 shadow-2xl space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#E45147]/15 border border-[#E45147]/30 flex items-center justify-center text-[#E45147]">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">শিক্ষার্থী ড্যাশবোর্ডে স্বাগতম</h2>
          <p className="text-stone-300 text-sm leading-relaxed">
            আপনার ব্যক্তিগত লার্নিং প্রোগ্রেস, জাপানিজ রিভিশন স্ট্রীক এবং ২৪টি লেসনের রিপোর্ট দেখতে অনুগ্রহ করে লগইন করুন।
          </p>
          <div className="pt-2">
            <button
              onClick={() => openAuthModal('login')}
              className="btn-haptic px-6 py-3 rounded-xl bg-[#E45147] hover:bg-[#D43E34] text-white text-sm font-extrabold shadow-lg shadow-red-600/30 transition cursor-pointer"
            >
              লগইন / সাইন-আপ করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="v2-app-root" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10 animate-fadeIn text-slate-100">
      
      {/* 1. Header Greeting & Quick Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-red-600/20 text-red-400 border border-red-500/30">
              {isFounder ? '👑 প্রতিষ্ঠাতা ভিউ (Founder HQ)' : '🇯🇵 শিক্ষার্থী ককপিট (Student Cockpit)'}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              こんにちは (Konnichiwa)
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            স্বাগতম, {user?.name || (user?.email ? user.email.split('@')[0] : 'শিক্ষার্থী')} সান!
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            আজকের জাপান মিশনের মাইলস্টোন পূরণ করতে প্রস্তুত তো?
          </p>
        </div>

        {/* Telemetry Strip */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Daily Streak */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#141726] border border-amber-500/30 shadow-lg shadow-amber-500/5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <div className="text-[9px] text-stone-400 uppercase font-bold tracking-wider">দৈনিক স্ট্রিক</div>
              <div className="text-base font-black text-amber-400 leading-none">{streakDays} দিন</div>
            </div>
          </div>

          {/* Lessons Completed */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#141726] border border-blue-500/30 shadow-lg shadow-blue-500/5" id="student-metric-completed-lessons">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-stone-400 uppercase font-bold tracking-wider">লেসন সম্পন্ন</div>
              <div className="text-base font-black text-blue-400 leading-none">{completedLessonsCount} / ২৫</div>
            </div>
          </div>

          {/* XP */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#141726] border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4 fill-emerald-400" />
            </div>
            <div>
              <div className="text-[9px] text-stone-400 uppercase font-bold tracking-wider">অর্জিত পয়েন্ট</div>
              <div className="text-base font-black text-emerald-400 leading-none">{xpPoints} XP</div>
            </div>
          </div>

          {/* Mastered Kana */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#141726] border border-[#E45147]/30 shadow-lg shadow-red-500/5">
            <div className="w-8 h-8 rounded-xl bg-[#E45147]/20 flex items-center justify-center text-[#E45147]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-stone-400 uppercase font-bold tracking-wider">জানা বর্ণমালা</div>
              <div className="text-base font-black text-[#E45147] leading-none">{knownKanaCount} টি</div>
            </div>
          </div>

          {/* Review Due */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#141726] border border-amber-500/30 shadow-lg shadow-amber-500/5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-stone-400 uppercase font-bold tracking-wider">রিভিশন বাকি</div>
              <div className="text-base font-black text-amber-400 leading-none">{reviewDueCount} টি</div>
            </div>
          </div>

          {/* Coin Wallet */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#141726] border border-amber-500/30 shadow-lg shadow-amber-500/5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-stone-400 uppercase font-bold tracking-wider">নিহোমি কয়েন</div>
              <div className="text-base font-black text-amber-400 leading-none">{coinBalance} কয়েন</div>
            </div>
          </div>

          {/* Total Study Time */}
          <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#141726] border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-stone-400 uppercase font-bold tracking-wider">স্টাডি সময়</div>
              <div className="text-base font-black text-emerald-400 leading-none">
                {totalStudyMinutes >= 60 ? `${(totalStudyMinutes / 60).toFixed(1)} ঘণ্টা` : `${totalStudyMinutes} মিনিট`}
              </div>
            </div>
          </div>

          {/* Recalibrate Button */}
          <button
            onClick={() => setIsCalibrationOpen(true)}
            className="p-2.5 rounded-2xl bg-[#141726] hover:bg-[#1a1f33] border border-white/10 text-stone-300 hover:text-white transition-all cursor-pointer shadow-md"
            title="লার্নিং লেভেল রিক্যালিব্রেট করুন"
          >
            <Sliders className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Guest Mode Banner */}
      {!user && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs sm:text-sm">
              <strong className="text-white">গেস্ট মোড (Unauthenticated):</strong> স্ট্রিক এবং জাপানিজ লার্নিং ডিএনএ ক্লাউডে চিরস্থায়ীভাবে সংরক্ষণ করতে ফ্রি সাইন-আপ করুন।
            </p>
          </div>
          <button
            id="dashboard-guest-login-btn"
            onClick={() => openAuthModal('login')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E45147] to-[#F59E0B] hover:opacity-90 text-white font-bold text-xs shrink-0 cursor-pointer shadow-md shadow-red-600/20"
          >
            লগইন / সাইন-আপ করুন
          </button>
        </div>
      )}

      {/* 2. Primary Next Best Mission Hero */}
      <div id="dashboard-todays-mission-card" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E2338] via-[#141726] to-[#0A0A12] border-2 border-[#E45147]/40 p-6 sm:p-8 shadow-2xl shadow-red-600/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#E45147] text-white shadow-md shadow-red-600/30">
                <Sparkles className="w-3.5 h-3.5" />
                আপনার পরবর্তী গোল (Next Best Mission)
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {nextMission.phase.replace(/_/g, ' ')}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {nextMission.titleBn}
            </h2>

            <p className="text-sm text-stone-300 leading-relaxed">
              {nextMission.subTitleBn}
            </p>

            {nextMission.whyItMattersBn && (
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-stone-300 flex items-start gap-2.5">
                <Target className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-amber-400">কেন দরকার:</strong> {nextMission.whyItMattersBn}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={handleStartMission}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E45147] to-[#F59E0B] hover:brightness-110 text-white font-black text-base shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <span>{nextMission.actionLabelBn || 'মিশন শুরু করুন'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('journey')}
              className="px-6 py-3.5 rounded-2xl bg-[#141726] hover:bg-[#1f2438] border border-white/20 text-stone-300 hover:text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>সম্পূর্ণ ম্যাপ দেখুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. DUAL POWER SUITE: JAPAN READINESS RADAR™ & MEMORY OS SRS DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT (7 COLS): JAPAN READINESS RADAR™ TELEMETRY */}
        <div id="dashboard-japan-readiness-radar" className="lg:col-span-7 rounded-3xl bg-[#141726] border border-white/10 p-6 sm:p-7 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#E45147]" />
                <h3 className="text-lg font-black text-white">JAPAN READINESS RADAR™</h3>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                JLPT সনদের চেয়েও বিস্তৃত — বাস্তব টোকিও জীবন ও কাজের সমন্বিত প্রস্তুতি সূচক
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold self-start sm:self-auto">
              {readinessReport.readinessBadge}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* SVG Interactive Radar Chart */}
            <div className="sm:col-span-6 flex flex-col items-center justify-center relative">
              <svg width="220" height="220" viewBox="0 0 220 220" className="overflow-visible">
                {/* Background Concentric Webs */}
                {[0.25, 0.5, 0.75, 1.0].map((level, i) => {
                  const points = radarAxes.map((axis) => {
                    const rad = (axis.angle * Math.PI) / 180;
                    const r = 85 * level;
                    return `${110 + r * Math.cos(rad)},${110 + r * Math.sin(rad)}`;
                  }).join(' ');
                  return (
                    <polygon
                      key={i}
                      points={points}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Radar Web Axis Spokes */}
                {radarAxes.map((axis, i) => {
                  const rad = (axis.angle * Math.PI) / 180;
                  const x = 110 + 85 * Math.cos(rad);
                  const y = 110 + 85 * Math.sin(rad);
                  return (
                    <line
                      key={i}
                      x1="110"
                      y1="110"
                      x2={x}
                      y2={y}
                      stroke="rgba(255, 255, 255, 0.12)"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  );
                })}

                {/* Filled Dynamic Learner Polygon */}
                <polygon
                  points={radarPoints}
                  fill="rgba(228, 81, 71, 0.28)"
                  stroke="#E45147"
                  strokeWidth="2.5"
                  className="transition-all duration-700 ease-out"
                />

                {/* Vertex Point Nodes */}
                {radarAxes.map((axis, i) => {
                  const rad = (axis.angle * Math.PI) / 180;
                  const radius = Math.max(12, Math.min(90, (axis.score / 100) * 85 + 10));
                  const cx = 110 + radius * Math.cos(rad);
                  const cy = 110 + radius * Math.sin(rad);
                  return (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r="4"
                      fill="#F59E0B"
                      stroke="#fff"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </svg>

              {/* Overall Score Center Badge */}
              <div className="mt-3 text-center">
                <span className="text-3xl font-black text-white font-mono tracking-tight">
                  {readinessReport.overallScore}%
                </span>
                <span className="block text-[11px] text-stone-400 font-medium">সামগ্রিক প্রস্তুতি স্কোর</span>
              </div>
            </div>

            {/* 5 Pillar Progress Bars */}
            <div className="sm:col-span-6 space-y-3">
              {radarAxes.map((axis) => (
                <div key={axis.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-300 font-medium">{axis.labelBn}</span>
                    <span className="font-mono font-bold text-amber-400">{axis.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-[#E45147] to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, axis.score)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Strengths & Focus Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-black/30 border border-emerald-500/20 space-y-1">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                আপনার শীর্ষ দক্ষতা:
              </span>
              <p className="text-stone-300 font-medium">{readinessReport.strongestDimensionBn}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/30 border border-amber-500/20 space-y-1">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                পরবর্তী মাইলস্টোন ফোকাস:
              </span>
              <p className="text-stone-300 font-medium">{readinessReport.nextReadinessMilestoneBn}</p>
            </div>
          </div>
        </div>

        {/* RIGHT (5 COLS): MEMORY OS SPACED REPETITION (SRS) STUDIO */}
        <div id="dashboard-srs-summary-widget" className="lg:col-span-5 rounded-3xl bg-[#141726] border border-white/10 p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-black text-white">Memory OS™ ফ্ল্যাশকার্ড</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-xs font-bold">
              SM-2 Spaced Repetition
            </span>
          </div>

          {/* Success Toast */}
          {srsSuccessToast && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-fadeIn">
              {srsSuccessToast}
            </div>
          )}

          {/* Interactive Card Drawer */}
          {(() => {
            const card = DEFAULT_SRS_CARDS[activeSrsIndex];
            return (
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4 text-center">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="font-mono">কার্ড #{activeSrsIndex + 1} / {DEFAULT_SRS_CARDS.length}</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 font-mono text-[10px] uppercase text-stone-300">
                    স্টেজ: {card.stage}
                  </span>
                </div>

                {/* Card Target */}
                <div className="py-4 space-y-1">
                  <div className="text-3xl sm:text-4xl font-black text-white font-serif tracking-wide">
                    {card.kanji}
                  </div>
                  <div className="text-sm font-japanese text-amber-400 font-bold">
                    {card.reading}
                  </div>
                </div>

                {/* Flip Reveal */}
                {isSrsFlipped ? (
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-1 animate-fadeIn">
                    <div className="text-stone-300 font-bold">{card.meaningBn}</div>
                    <div className="text-stone-400 font-mono text-[11px]">{card.meaningEn}</div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSrsFlipped(true)}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-bold border border-white/10 transition-colors"
                  >
                    অর্থ প্রকাশ করুন (Reveal Meaning) 👁️
                  </button>
                )}

                {/* Voice Pronunciation & Rating Buttons */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => handlePlayCardAudio(card.kanji)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
                    title="উচ্চারণ শুনুন"
                  >
                    <Volume2 className="w-4 h-4 text-[#E45147]" />
                  </button>

                  {isSrsFlipped && (
                    <div className="flex items-center gap-1.5 flex-1 justify-end">
                      <button
                        onClick={() => handleRateCard('again')}
                        className="px-2.5 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 font-bold text-[11px] border border-red-500/30"
                      >
                        আবার
                      </button>
                      <button
                        onClick={() => handleRateCard('hard')}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 font-bold text-[11px] border border-amber-500/30"
                      >
                        কঠিন
                      </button>
                      <button
                        onClick={() => handleRateCard('good')}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold text-[11px] border border-blue-500/30"
                      >
                        ভালো
                      </button>
                      <button
                        onClick={() => handleRateCard('easy')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-[11px] border border-emerald-500/30"
                      >
                        সহজ
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Full Memory OS Navigation Link */}
          <button
            onClick={() => onNavigate('journey')}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 cursor-pointer transition-transform active:scale-95"
          >
            <Brain className="w-4 h-4" />
            <span>সম্পূর্ণ মেমোরি ওএস রিভিশন শুরু করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. THE 25-LESSON MINNA NO NIHONGO INTERACTIVE PATHWAY (CONSOLIDATED) */}
      <div id="dashboard-25-lesson-pathway" className="rounded-3xl bg-[#141726] border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-black text-white">২৫টি মিন্না নো নিহোঙ্গো মাস্টার লেসন পাথওয়ে</h3>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              স্বাগতম থেকে N5 ফাইনাল পরীক্ষা — প্রতিটি লেসনে ব্যাকরণ, কাঞ্জি ও বাস্তব বাক্য গঠন
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs text-stone-400 font-mono">
              সম্পন্ন: <strong className="text-white font-bold">{completedLessonsCount} / ২৫</strong> ({n5ProgressPct}%)
            </span>
            <button
              onClick={() => onNavigate('curriculum')}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-stone-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>সিলেবাস দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Milestone Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'সব ২৫টি লেসন' },
            { id: '1-5', label: 'ভিত্তি (লেসন ০১–০৫) [ফ্রি]' },
            { id: '6-10', label: 'দৈনন্দিন জীবন (০৬–১০)' },
            { id: '11-15', label: 'তে-ফর্ম (১১–১৫)' },
            { id: '16-20', label: 'ক্যাজুয়াল কথ্য (১৬–২০)' },
            { id: '21-25', label: 'N5 ফাইনাল (২১–২৫)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedMilestoneTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedMilestoneTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : 'bg-black/30 text-stone-400 hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Interactive Lesson Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 pt-2">
          {filteredPathwayLessons.map((lesson) => {
            const isCompleted = progress?.completedLessonIds?.includes(lesson.id) || false;
            const isCurrent = !isCompleted && (lesson.num === completedLessonsCount + 1);
            const isLocked = lesson.num > 5 && !isProUser;

            return (
              <div
                key={lesson.id}
                onClick={() => handleOpenLesson(lesson.id, isLocked)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60'
                    : isCurrent
                    ? 'bg-amber-950/20 border-amber-500/50 hover:border-amber-400 ring-1 ring-amber-500/30'
                    : isLocked
                    ? 'bg-black/30 border-white/5 opacity-70 hover:opacity-100 hover:border-white/20'
                    : 'bg-[#191E30] border-white/10 hover:border-amber-500/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-stone-400">
                      #{String(lesson.num).padStart(2, '0')}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-stone-500" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>

                  <div>
                    <div className="text-[11px] font-japanese font-bold text-stone-400 group-hover:text-amber-400 transition-colors">
                      {lesson.titleJa}
                    </div>
                    <div className="text-sm font-bold text-white leading-snug">
                      {lesson.titleBn}
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                    {lesson.topic}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono mt-3">
                  <span className="text-stone-500">⏱️ {lesson.estimatedMinutes} মি.</span>
                  {isCompleted ? (
                    <span className="text-emerald-400 font-bold">সম্পন্ন ✓</span>
                  ) : isCurrent ? (
                    <span className="text-amber-400 font-bold animate-pulse">চালান ▶</span>
                  ) : isLocked ? (
                    <span className="text-stone-500">প্রো গেট 🔒</span>
                  ) : (
                    <span className="text-blue-400 font-bold">প্রস্তুত</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. QUICK STUDIO GATEWAYS & CAREER ENGINES */}
      <div>
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-red-500" />
          <span>প্রোডাক্ট মডিউল ও ক্যারিয়ার স্টুডিও</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Card 1: Kana Studio */}
          <div
            onClick={() => onNavigate('kana')}
            className="group p-5 rounded-2xl bg-[#141726] hover:bg-[#191e30] border border-white/10 hover:border-red-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-serif text-xl font-black group-hover:scale-110 transition-transform">
                  あ
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                  {japaneseBriefing?.activity?.targetChar ? `বর্ণ: ${japaneseBriefing.activity.targetChar}` : 'সক্রিয় লুপ'}
                </span>
              </div>
              <h4 className="font-bold text-white text-base">কানা স্টুডিও (Kana Studio)</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                ভেক্টর স্ট্রোক এভালুয়েটর সহ হিরাগানা ও কাতাকানা সঠিক ক্রমে লেখার ড্রিল।
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>অনুশীলন করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Curriculum N5-N1 */}
          <div
            onClick={() => onNavigate('curriculum')}
            className="group p-5 rounded-2xl bg-[#141726] hover:bg-[#191e30] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-sans text-lg font-black group-hover:scale-110 transition-transform">
                  N5
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${grammarStatus.eligible ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {grammarStatus.eligible ? 'লেসন ১ আনলকড' : 'ফাউন্ডেশন বাকি'}
                </span>
              </div>
              <h4 className="font-bold text-white text-base">মাস্টার কারিকুলাম (N5–N1)</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                মিন্না নো নিহোঙ্গো ও জেএলপিটি স্ট্যান্ডার্ড ৫০টি প্রামাণ্য চ্যাপ্টার ও ব্যাকরণ নোট।
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>কারিকুলাম এক্সপ্লোর</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Konbini WorkOS */}
          <div
            onClick={() => onNavigate('workos')}
            className="group p-5 rounded-2xl bg-[#141726] hover:bg-[#191e30] border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Store className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {conbiniBriefing?.isEligible ? 'শিফট রেডি' : 'লুপ পেন্ডিং'}
                </span>
              </div>
              <h4 className="font-bold text-white text-base">কনবিনি WorkOS™</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                রিয়েল টোকিও ৭-ইলেভেন ও লসন ক্যাশিয়ার কাউন্টার ড্রিল ও ১০টি জাপান লাইফ সিনারিও।
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>সিমুলেশন চালান</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Relocation JIS CV */}
          <div
            onClick={() => onNavigate('rirekisho')}
            className="group p-5 rounded-2xl bg-[#141726] hover:bg-[#191e30] border border-white/10 hover:border-[#E45147]/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#E45147]/20 text-[#E45147] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E45147]/10 text-[#E45147] border border-[#E45147]/20">
                  {cvBriefing?.isEligible ? 'JIS রেডি' : 'ড্রাফট মোড'}
                </span>
              </div>
              <h4 className="font-bold text-white text-base">JIS রিলোকেশন CV স্টুডিও</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                জাপানিজ স্ট্যান্ডার্ড A4 রিলোকেশন কারিকুলাম ভাইটে তৈরি করে সরাসরি PDF ডাউনলোড।
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E45147] mt-4 group-hover:translate-x-1 transition-transform">
              <span>CV প্রস্তুত করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: JLPT Exam OS */}
          <div
            onClick={() => onNavigate('exam')}
            className="group p-5 rounded-2xl bg-[#141726] hover:bg-[#191e30] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {examBriefing?.isEligible ? 'মক টেস্ট রেডি' : 'স্বরবর্ণ বাকি'}
                </span>
              </div>
              <h4 className="font-bold text-white text-base">JLPT মক এক্সাম ওএস</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                অফিসিয়াল সময়সীমা ও স্কোরকার্ড সহ N5, N4 ও N3 ফুল-লেংথ পরীক্ষা ও সার্টিফিকেট।
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>পরীক্ষা দিন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 6. N.I.H.O.M.I 6-STEP LEARNING LOOP GUARANTEE */}
      <div className="p-6 rounded-3xl bg-[#141726] border border-white/10 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#E45147]/10 border border-[#E45147]/20 flex items-center justify-center text-[#E45147] font-black text-xs">
              N
            </span>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>N.I.H.O.M.I. লার্নিং লুপ (The Learning Method)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  পেডাগজি গ্যারান্টি
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                প্রতিটি জাপানিজ দক্ষতায় ৬টি ধাপে আয়ত্ত করার বৈজ্ঞানিক মেথডোলজি
              </p>
            </div>
          </div>
          <div className="text-[11px] font-mono text-stone-400">
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
              <div key={idx} className="p-3.5 rounded-2xl bg-black/30 border border-white/5 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`w-7 h-7 rounded-xl border flex items-center justify-center font-black text-xs ${step.bg} ${step.color}`}>
                    {step.letter}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${step.color} opacity-80`} />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white leading-tight">
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
      </div>

      {/* Calibration Modal */}
      {isCalibrationOpen && (
        <BengaliQuickCalibrationModal
          isOpen={isCalibrationOpen}
          onClose={() => setIsCalibrationOpen(false)}
          onPlacementApplied={(_nodeId, _viewRoute, _viewParams) => {
            setIsCalibrationOpen(false);
            setKnowledgeState(loadLearnerKnowledgeState());
          }}
        />
      )}
    </div>
  );
};
