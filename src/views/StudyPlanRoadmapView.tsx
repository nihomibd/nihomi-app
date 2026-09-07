import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import { apiRequest } from '../lib/api.js';
import { JLPTStudyPlan, DailyStudySessionRecord, JLPTLevel, LearningPace } from '../types.js';
import { HanabiBackground } from '../components/HanabiBackground.js';
import { StudyPlanConfigModal } from '../components/studyPlan/StudyPlanConfigModal.js';
import { DailyMissionChecklist } from '../components/studyPlan/DailyMissionChecklist.js';
import {
  Calendar,
  Clock,
  Target,
  Flame,
  Zap,
  Sparkles,
  Award,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Headphones,
  RotateCcw,
  Layers,
  Settings,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

// Built-in 30-Day JLPT N5 Master Study Roadmap & SRS Failsafe Baseline
export const DEFAULT_JLPT_N5_ROADMAP: JLPTStudyPlan = {
  id: 'plan-default-n5-master',
  userId: 'usr-student-01',
  targetLevel: 'N5' as JLPTLevel,
  targetExamDate: '2026-12-06',
  examSessionName: 'Official JLPT December 2026 Exam',
  targetScore: 140,
  dailyTimeMinutes: 30,
  learningPace: 'moderate' as LearningPace,
  focusAreas: ['Particles (は vs が)', 'Te-Form Conjugation', 'Tokyo Conbini Keigo', 'Essential 120 Kanji'],
  daysRemaining: 90,
  weeksRemaining: 12,
  currentSprintPhase: {
    phaseNumber: 1,
    totalPhases: 4,
    name: 'Foundational Immersion & Kana/Kanji Strokes',
    nameJa: '第1期：基礎定着と漢字・語彙ビルド',
    goalDescription: 'Build core hiragana/katakana fluency, master first 40 Essential Kanji, and solidify basic particles (は, が, を, に).',
    goalDescriptionBn: 'প্রাথমিক হিরাগানা/কাতাকানা দক্ষতা অর্জন, প্রথম ৪০টি কাঞ্জি ও মূল পার্টিকেলগুলোর (は, が, を, に) শতভাগ ভিত্তি তৈরি।',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    progressPercent: 45,
    status: 'active',
    keyMilestones: [
      'Master Lessons 1-8 Vocab & Grammar',
      '40 N5 Kanji 3D Stroke Animations',
      'MemoryOS は vs が Zero-Error Baseline'
    ]
  },
  sprintPhases: [
    {
      phaseNumber: 1,
      totalPhases: 4,
      name: 'Foundational Immersion & Kana/Kanji Strokes',
      nameJa: '第1期：基礎定着と漢字・語彙ビルド',
      goalDescription: 'Build core hiragana/katakana fluency, master first 40 Essential Kanji, and solidify basic particles (は, が, を, に).',
      goalDescriptionBn: 'প্রাথমিক হিরাগানা/কাতাকানা দক্ষতা অর্জন, প্রথম ৪০টি কাঞ্জি ও মূল পার্টিকেলগুলোর (は, が, を, に) শতভাগ ভিত্তি তৈরি।',
      startDate: '2026-09-01',
      endDate: '2026-09-30',
      progressPercent: 45,
      status: 'active',
      keyMilestones: [
        'Master Lessons 1-8 Vocab & Grammar',
        '40 N5 Kanji 3D Stroke Animations',
        'MemoryOS は vs が Zero-Error Baseline'
      ]
    },
    {
      phaseNumber: 2,
      totalPhases: 4,
      name: 'Minna no Nihongo Curriculum Acceleration & Verb Conjugations',
      nameJa: '第2期：文法加速と動詞活用マスター',
      goalDescription: 'Accelerate through Minna no Nihongo lessons 9-20. Master te-form, ta-form, nai-form conjugations and polite requests.',
      goalDescriptionBn: 'মিন্না নো নিহোঙ্গো পাঠ ৯-২০ সম্পন্ন। তে-ফর্ম, তা-ফর্ম ও নাই-ফর্ম সহ প্রয়োজনীয় ব্যাকরণ স্ট্রাকচারে পূর্ণ দক্ষতা।',
      startDate: '2026-10-01',
      endDate: '2026-10-31',
      progressPercent: 15,
      status: 'upcoming',
      keyMilestones: [
        'Complete Lessons 9-20 Grammar Deck',
        '120 Kanji Mastered in Flashcards',
        'Verb Form Switching Speed Drills'
      ]
    },
    {
      phaseNumber: 3,
      totalPhases: 4,
      name: 'Deep Reading Passages & Tokyo Listening Comprehension',
      nameJa: '第3期：長文読解と東京リアル聴解ドリル',
      goalDescription: 'Solve authentic JLPT reading passages (Dokkai) and train ear with authentic Tokyo multi-speaker speed audios.',
      goalDescriptionBn: 'বাস্তবসম্মত রিডিং অনুচ্ছেদ পাঠ ও স্পিচ সিন্থেসাইজার যোগে দ্রুতগতির টোকিও অডিও লিসেনিং ড্রিল।',
      startDate: '2026-11-01',
      endDate: '2026-11-20',
      progressPercent: 0,
      status: 'upcoming',
      keyMilestones: [
        '10 Authentic Reading Passages (読解)',
        '30 Tokyo Speed Listening Sessions (聴解)',
        'Solve Star Sentence Scrambles (★)'
      ]
    },
    {
      phaseNumber: 4,
      totalPhases: 4,
      name: 'Official JLPT Mock Marathon & Ghost Weakness Eradication',
      nameJa: '第4期：公式模試マラソンと弱点克服',
      goalDescription: 'Take 3 full-length timed mock exams under official condition. Eliminate all remaining particle errors in MemoryOS™ Ghost Mode.',
      goalDescriptionBn: 'পূর্ণাঙ্গ অফিসিয়াল টাইমারযুক্ত ৩টি মক পরীক্ষা এবং মেমরি ওএস-এ সমস্ত দুর্বল পার্টিকেল ও কাঞ্জির ১০০% রিকভারি।',
      startDate: '2026-11-21',
      endDate: '2026-12-06',
      progressPercent: 0,
      status: 'upcoming',
      keyMilestones: [
        'Score 140+/180 on Full JLPT Mock Exam',
        'Zero Ghost Weaknesses in Ghost Mode',
        'Official Scaled Certificate Generation'
      ]
    }
  ],
  dailyQuota: {
    newVocabTarget: 10,
    vocabSrsReviewTarget: 25,
    kanjiStrokeTarget: 5,
    grammarPatternsTarget: 2,
    particleWeakSpotsTarget: 3,
    listeningMinutesTarget: 10,
    totalDailyMinutes: 30
  },
  weeklySchedule: [
    {
      weekNumber: 1,
      weekRange: 'Week 1',
      milestoneTitle: 'Week 1: Lessons 1–3 & Hiragana Solidification (12 Kanji)',
      milestoneTitleBn: 'সপ্তাহ ১: পাঠ ১–৩ এবং হিরাগানা রিভিও (১২টি কাঞ্জি)',
      targetLessons: 'Lessons 1–3',
      targetKanjiCount: 12,
      isCompleted: true,
      isCurrent: false
    },
    {
      weekNumber: 2,
      weekRange: 'Week 2',
      milestoneTitle: 'Week 2: Lessons 4–6 & Time/Date Counters (24 Kanji)',
      milestoneTitleBn: 'সপ্তাহ ২: পাঠ ৪–৬ এবং সময়/তারিখ গণনা (২৪টি কাঞ্জি)',
      targetLessons: 'Lessons 4–6',
      targetKanjiCount: 24,
      isCompleted: false,
      isCurrent: true
    },
    {
      weekNumber: 3,
      weekRange: 'Week 3',
      milestoneTitle: 'Week 3: Lessons 7–9 & Adjective Conjugation (36 Kanji)',
      milestoneTitleBn: 'সপ্তাহ ৩: পাঠ ৭–৯ এবং বিশেষণ রূপান্তর (৩৬টি কাঞ্জি)',
      targetLessons: 'Lessons 7–9',
      targetKanjiCount: 36,
      isCompleted: false,
      isCurrent: false
    },
    {
      weekNumber: 4,
      weekRange: 'Week 4',
      milestoneTitle: 'Week 4: Lessons 10–12 & Existence Verbs (います/あります) (48 Kanji)',
      milestoneTitleBn: 'সপ্তাহ ৪: পাঠ ১০–১২ এবং অস্তিত্ববাচক ক্রিয়া (৪৮টি কাঞ্জি)',
      targetLessons: 'Lessons 10–12',
      targetKanjiCount: 48,
      isCompleted: false,
      isCurrent: false
    }
  ],
  readinessScore: 78,
  projectedScore: 142,
  passProbability: 86,
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-07T00:00:00.000Z'
};

export const DEFAULT_DAILY_SESSION: DailyStudySessionRecord = {
  id: 'session-default-01',
  userId: 'usr-student-01',
  date: new Date().toISOString().split('T')[0],
  completedItems: {
    vocabSrsDone: 15,
    kanjiDone: 5,
    grammarDone: 2,
    ghostsResolved: 3,
    listeningMinutesDone: 10,
    quizzesDone: 1
  },
  totalMinutesSpent: 25,
  dailyQuotaMet: false,
  earnedXp: 120,
  checklist: [
    {
      id: 'task-1',
      taskType: 'vocab_srs',
      title: 'SRS Vocabulary Review',
      titleJa: '語彙SRS復習 (25語)',
      titleBn: '২৫টি ভোকাবুলারি এসআরএস রিভিশন',
      targetCount: 25,
      completedCount: 15,
      estimatedMinutes: 10,
      isCompleted: false,
      xpReward: 40,
      linkView: 'srs'
    },
    {
      id: 'task-2',
      taskType: 'kanji_drill',
      title: 'Kanji 3D Stroke Animations',
      titleJa: '漢字書き順ドリル (5字)',
      titleBn: '৫টি কাঞ্জির ৩ডি স্ট্রোক এনিমেশন ও ড্রিল',
      targetCount: 5,
      completedCount: 5,
      estimatedMinutes: 8,
      isCompleted: true,
      xpReward: 30,
      linkView: 'kanji'
    },
    {
      id: 'task-3',
      taskType: 'ghost_recovery',
      title: 'MemoryOS™ Ghost Recovery',
      titleJa: 'ゴースト弱点撲滅',
      titleBn: 'পার্টিকেল কনফিউশন দূরীকরণ (は vs が)',
      targetCount: 3,
      completedCount: 3,
      estimatedMinutes: 7,
      isCompleted: true,
      xpReward: 50,
      linkView: 'memory-os'
    }
  ],
  updatedAt: new Date().toISOString()
};

export const DEFAULT_GHOST_STATS = {
  totalGhostItems: 14,
  recoveredItems: 11,
  activeWeakspots: 3,
  recoveryRatePercent: 78
};

interface StudyPlanRoadmapViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
  openDailyMission?: boolean;
}

export const StudyPlanRoadmapView: React.FC<StudyPlanRoadmapViewProps> = ({
  onNavigate,
  openDailyMission = false
}) => {
  const { user, profile, progress } = useAuth();
  const { t } = useLanguage();

  // Instant zero-lag hydration with built-in 30-Day Master Study Roadmap
  const [studyPlan, setStudyPlan] = useState<JLPTStudyPlan>(() => DEFAULT_JLPT_N5_ROADMAP);
  const [dailySession, setDailySession] = useState<DailyStudySessionRecord>(() => DEFAULT_DAILY_SESSION);
  const [ghostStats, setGhostStats] = useState<any>(() => DEFAULT_GHOST_STATS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'sprints' | 'weekly' | 'weakspots'>('daily');

  // Real-time countdown timer
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Failsafe 300ms Data Loader: Hydrates latest customized plan from API, never leaves screen blank
  useEffect(() => {
    let isMounted = true;
    const failsafeTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 300);

    const loadData = async () => {
      try {
        const res = await apiRequest<{
          success: boolean;
          studyPlan: JLPTStudyPlan;
          dailySession: DailyStudySessionRecord;
          ghostStats: any;
        }>('/api/study-plan');

        if (res && res.success && isMounted) {
          if (res.studyPlan) {
            setStudyPlan({
              ...DEFAULT_JLPT_N5_ROADMAP,
              ...res.studyPlan,
              sprintPhases: res.studyPlan.sprintPhases?.length ? res.studyPlan.sprintPhases : DEFAULT_JLPT_N5_ROADMAP.sprintPhases,
              weeklySchedule: res.studyPlan.weeklySchedule?.length ? res.studyPlan.weeklySchedule : DEFAULT_JLPT_N5_ROADMAP.weeklySchedule,
              dailyQuota: res.studyPlan.dailyQuota || DEFAULT_JLPT_N5_ROADMAP.dailyQuota,
              currentSprintPhase: res.studyPlan.currentSprintPhase || DEFAULT_JLPT_N5_ROADMAP.currentSprintPhase
            });
          }
          if (res.dailySession) setDailySession(res.dailySession);
          if (res.ghostStats) setGhostStats(res.ghostStats);
        }
      } catch (err) {
        console.warn('[StudyPlanRoadmapView] API offline or slow, using built-in 30-Day Master Study Roadmap:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          clearTimeout(failsafeTimer);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      clearTimeout(failsafeTimer);
    };
  }, []);

  // Ticking countdown
  useEffect(() => {
    if (!studyPlan?.targetExamDate) return;
    const targetTime = new Date(`${studyPlan.targetExamDate}T09:00:00Z`).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, targetTime - now);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [studyPlan?.targetExamDate]);

  const handleSavePlan = async (updatedParams: any) => {
    const res = await apiRequest<{
      success: boolean;
      studyPlan: JLPTStudyPlan;
      dailySession: DailyStudySessionRecord;
    }>('/api/study-plan/save', {
      method: 'POST',
      body: JSON.stringify(updatedParams)
    });
    if (res.success) {
      setStudyPlan(res.studyPlan);
      setDailySession(res.dailySession);
    }
  };

  const handleRecalculatePace = async (pace: LearningPace) => {
    try {
      const res = await apiRequest<{
        success: boolean;
        studyPlan: JLPTStudyPlan;
      }>('/api/study-plan/recalculate', {
        method: 'POST',
        body: JSON.stringify({ pace })
      });
      if (res.success) {
        setStudyPlan(res.studyPlan);
      }
    } catch (err) {
      console.error('Failed to recalculate:', err);
    }
  };

  if (isLoading && !studyPlan) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
          <p className="text-sm font-mono text-slate-400">
            Generating personalized JLPT study roadmap & daily SRS quotas...
          </p>
        </div>
      </div>
    );
  }

  const quota = studyPlan.dailyQuota;
  const currentPhase = studyPlan.currentSprintPhase;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 pb-20 pt-28 md:pt-36">
      {/* Hanabi Canvas Particle Background */}
      <HanabiBackground />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ========================================================================= */}
        {/* HERO BANNER: TARGET EXAM COUNTDOWN & ROADMAP OVERVIEW */}
        {/* ========================================================================= */}
        <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950/95 border border-slate-800/90 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left Info */}
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-extrabold text-xs shadow-md shadow-rose-950/50">
                  JLPT {studyPlan.targetLevel} TARGET
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700">
                  {studyPlan.learningPace.toUpperCase()} SPRINT
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Target: {studyPlan.targetExamDate}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
                Personalized JLPT Roadmap & Daily SRS Engine
              </h1>
              <p className="text-xs md:text-sm text-slate-300">
                {studyPlan.examSessionName} — আপনার কাঙ্ক্ষিত স্কোর অর্জন এবং মেমরি ওএস-এ পার্টিকেল দুর্বলতা দূরীকরণে এআই-চালিত অ্যাডাপটিভ শিডিউল।
              </p>

              <div className="pt-2 flex items-center gap-4 flex-wrap text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Target Score: <strong className="text-slate-200">{studyPlan.targetScore} / 180</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-400" />
                  Daily Commitment: <strong className="text-slate-200">{studyPlan.dailyTimeMinutes} mins</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Active Streak: <strong className="text-amber-400">{progress?.currentStreak || 1} Days</strong>
                </span>
              </div>
            </div>

            {/* Right: Live Ticking Countdown Box */}
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col items-center justify-center min-w-[280px]">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-rose-400" />
                Exam Countdown
              </div>
              <div className="flex items-center gap-2">
                <div className="text-center px-2 py-1 bg-slate-900/80 rounded-xl border border-slate-800/80 min-w-[50px]">
                  <div className="text-2xl font-black font-mono text-rose-400">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Days</div>
                </div>
                <span className="text-slate-600 font-bold text-xl mb-3">:</span>
                <div className="text-center px-2 py-1 bg-slate-900/80 rounded-xl border border-slate-800/80 min-w-[50px]">
                  <div className="text-2xl font-black font-mono text-amber-300">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Hours</div>
                </div>
                <span className="text-slate-600 font-bold text-xl mb-3">:</span>
                <div className="text-center px-2 py-1 bg-slate-900/80 rounded-xl border border-slate-800/80 min-w-[50px]">
                  <div className="text-2xl font-black font-mono text-slate-300">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Mins</div>
                </div>
                <span className="text-slate-600 font-bold text-xl mb-3">:</span>
                <div className="text-center px-2 py-1 bg-slate-900/80 rounded-xl border border-slate-800/80 min-w-[50px]">
                  <div className="text-2xl font-black font-mono text-slate-400">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Secs</div>
                </div>
              </div>

              <div className="mt-3 w-full flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfigOpen(true)}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Calibrate Plan & Date
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[11px] text-slate-400">Readiness Score</div>
              <div className="text-xl font-bold font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                {studyPlan.readinessScore}%
                <span className="text-xs text-slate-500 font-normal">Mastered</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[11px] text-slate-400">Projected Scaled Score</div>
              <div className="text-xl font-bold font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                {studyPlan.projectedScore} <span className="text-xs text-slate-500 font-normal">/180</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[11px] text-slate-400">Pass Probability</div>
              <div className="text-xl font-bold font-mono text-sky-400 mt-0.5">
                {studyPlan.passProbability}%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-[11px] text-slate-400">Current Phase</div>
              <div className="text-sm font-bold text-amber-300 truncate mt-1">
                Phase {currentPhase.phaseNumber}: {currentPhase.name.split('&')[0]}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NAVIGATION TABS */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'daily'
                ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            Today's Missions & SRS Quota
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sprints')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'sprints'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-400" />
            4-Phase Sprint Roadmap
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'weekly'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Calendar className="w-4 h-4 text-sky-400" />
            Weekly Milestones Timeline
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('weakspots')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'weakspots'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-indigo-400" />
            MemoryOS™ Weak-Spot Health
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: DAILY MISSION & SRS QUOTA SPRINT */}
        {/* ========================================================================= */}
        {activeTab === 'daily' && (
          <div className="space-y-6">
            {/* Daily Quota Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-emerald-400 mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Vocab SRS Cards</span>
                </div>
                <div className="text-2xl font-black font-mono text-slate-100">
                  {quota.vocabSrsReviewTarget} <span className="text-xs text-slate-500 font-normal">/day</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">SM-2 Spaced Repetition</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-rose-400 mb-1">
                  <Layers className="w-4 h-4" />
                  <span>Kanji Strokes</span>
                </div>
                <div className="text-2xl font-black font-mono text-slate-100">
                  {quota.kanjiStrokeTarget} <span className="text-xs text-slate-500 font-normal">/day</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">3D Flip & Onyomi/Kunyomi</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-amber-400 mb-1">
                  <Zap className="w-4 h-4" />
                  <span>Grammar Rules</span>
                </div>
                <div className="text-2xl font-black font-mono text-slate-100">
                  {quota.grammarPatternsTarget} <span className="text-xs text-slate-500 font-normal">/day</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Minna no Nihongo Lesson</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-indigo-400 mb-1">
                  <RotateCcw className="w-4 h-4" />
                  <span>Ghost Particles</span>
                </div>
                <div className="text-2xl font-black font-mono text-slate-100">
                  {quota.particleWeakSpotsTarget} <span className="text-xs text-slate-500 font-normal">/day</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">は vs が, に vs で Drills</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 text-xs text-sky-400 mb-1">
                  <Headphones className="w-4 h-4" />
                  <span>Tokyo Listening</span>
                </div>
                <div className="text-2xl font-black font-mono text-slate-100">
                  {quota.listeningMinutesTarget}m <span className="text-xs text-slate-500 font-normal">/day</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Multi-Speaker Speed Drill</p>
              </div>
            </div>

            {/* Interactive Daily Mission Checklist Component */}
            <DailyMissionChecklist
              session={dailySession}
              onNavigate={onNavigate}
              onTaskUpdated={(updated) => setDailySession(updated)}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 4-PHASE SPRINT STRATEGY ROADMAP */}
        {/* ========================================================================= */}
        {activeTab === 'sprints' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  Strategic 4-Phase Curriculum Sprints
                </h3>
                <p className="text-xs text-slate-400">
                  Step-by-step master progression from foundational basics to full-length JLPT timed mock exams
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRecalculatePace('moderate')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Standard Pace
                </button>
                <button
                  type="button"
                  onClick={() => handleRecalculatePace('turbo')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600/30 transition"
                >
                  Turbo Pace ⚡
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {studyPlan.sprintPhases.map((phase) => (
                <div
                  key={phase.phaseNumber}
                  className={`p-6 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
                    phase.status === 'active'
                      ? 'bg-slate-900/90 border-amber-500/50 shadow-xl shadow-amber-950/20'
                      : phase.status === 'completed'
                      ? 'bg-slate-950/60 border-emerald-500/30 text-slate-300'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                        Phase {phase.phaseNumber} of 4
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          phase.status === 'completed'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : phase.status === 'active'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-slate-800/80 border-slate-700 text-slate-400'
                        }`}
                      >
                        {phase.status === 'completed' ? 'Completed' : phase.status === 'active' ? `${phase.progressPercent}% Active` : 'Upcoming'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-100 mb-1">
                      {phase.name}
                    </h4>
                    <p className="text-xs font-japanese text-slate-400 mb-3">
                      {phase.nameJa}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {phase.goalDescriptionBn}
                    </p>

                    {/* Key Milestones Checklist */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Key Milestones
                      </div>
                      {phase.keyMilestones.map((m, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${phase.status === 'completed' ? 'text-emerald-400' : 'text-slate-600'}`} />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress Bar & Dates Footer */}
                  <div className="mt-5 pt-3 border-t border-slate-800/60">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
                      <span>{phase.startDate}</span>
                      <span>{phase.endDate}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          phase.status === 'completed'
                            ? 'bg-emerald-400'
                            : phase.status === 'active'
                            ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                            : 'bg-slate-700'
                        }`}
                        style={{ width: `${phase.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: WEEKLY MILESTONES GANTT SCHEDULE */}
        {/* ========================================================================= */}
        {activeTab === 'weekly' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Weekly Target Progression Timeline
              </h3>
              <p className="text-xs text-slate-400">
                Scheduled lesson blocks, kanji increments, and exam countdown milestones
              </p>
            </div>

            <div className="space-y-3">
              {studyPlan.weeklySchedule.map((week) => (
                <div
                  key={week.weekNumber}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    week.isCurrent
                      ? 'bg-slate-800/60 border-sky-500/50 shadow-md shadow-sky-950/20'
                      : week.isCompleted
                      ? 'bg-slate-950/40 border-emerald-500/30'
                      : 'bg-slate-950/20 border-slate-800/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                        week.isCurrent
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          : week.isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      W{week.weekNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-100">
                          {week.milestoneTitle}
                        </h4>
                        {week.isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30">
                            Current Sprint
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {week.milestoneTitleBn} • {week.weekRange}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto text-xs font-mono text-slate-300">
                    <span className="px-3 py-1 rounded-lg bg-slate-950/60 border border-slate-800">
                      {week.targetLessons}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-rose-300">
                      {week.targetKanjiCount} Kanji
                    </span>
                    {week.isCurrent && (
                      <button
                        type="button"
                        onClick={() => onNavigate('curriculum')}
                        className="px-3 py-1 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-200 hover:bg-sky-500/30 font-bold transition flex items-center gap-1"
                      >
                        Study <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MEMORYOS™ WEAK-SPOT HEALTH INTEGRATION */}
        {/* ========================================================================= */}
        {activeTab === 'weakspots' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
                  <RotateCcw className="w-4 h-4" />
                  MemoryOS™ Ghost Recovery Matrix
                </div>
                <h3 className="text-lg font-bold text-slate-100">
                  Adaptive Weak-Spot Eradication Engine
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  MemoryOS tracks student mistakes (specifically particle confusion like は vs が, に vs で) and feeds continuous Ghost Mode recovery drills until 100% mastered.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('ghost-mode')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/50 transition flex items-center gap-2 self-start md:self-auto whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                Launch Ghost Mode Drills
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Total Active Weaknesses</div>
                <div className="text-2xl font-black font-mono text-rose-400 mt-1">
                  {ghostStats?.totalGhosts || 4}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Logged from quizzes & mock exams</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Particle Mastery Rate</div>
                <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                  {ghostStats?.masteryScore || 88}%
                </div>
                <p className="text-[11px] text-slate-500 mt-1">は vs が & に vs で accuracy</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Burned Mastered Items</div>
                <div className="text-2xl font-black font-mono text-amber-300 mt-1">
                  {ghostStats?.stageCounts?.burned || 1}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">5+ consecutive flawless reviews</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Configuration Modal */}
      <StudyPlanConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        currentPlan={studyPlan}
        onSavePlan={handleSavePlan}
      />
    </div>
  );
};
