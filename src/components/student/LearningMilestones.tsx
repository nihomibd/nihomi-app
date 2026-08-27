import React, { useState, useEffect } from 'react';
import {
  Award,
  Flame,
  BookOpen,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Star,
  Trophy,
  Filter,
  ArrowRight,
  TrendingUp,
  Brain,
  Layers,
  Clock
} from 'lucide-react';
import { useStudyStreak } from '../../hooks/useStudyStreak';
import { SrsVocabularyService } from '../../lib/srsService';

export interface Milestone {
  id: string;
  category: 'streak' | 'vocab' | 'kanji' | 'quiz' | 'immersion';
  title: string;
  titleBn: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  xpReward: number;
  badgeIcon: string;
  badgeTier: 'bronze' | 'silver' | 'gold' | 'diamond';
  isUnlocked: boolean;
  isClaimed: boolean;
  unlockedDate?: string;
}

interface LearningMilestonesProps {
  studentName?: string;
  totalStudyHours?: number;
  completedLessonsCount?: number;
  onClaimReward?: (milestone: Milestone) => void;
}

export const LearningMilestones: React.FC<LearningMilestonesProps> = ({
  studentName = 'Tanvir Kabir Biplob',
  totalStudyHours = 124,
  completedLessonsCount = 18,
  onClaimReward
}) => {
  const streak = useStudyStreak();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unlocked' | 'in_progress' | 'claimed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'streak' | 'vocab' | 'kanji' | 'quiz'>('all');
  const [claimedIds, setClaimedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('nihomi_claimed_milestones');
      return raw ? JSON.parse(raw) : ['streak_3', 'vocab_25', 'lesson_5'];
    } catch {
      return ['streak_3', 'vocab_25'];
    }
  });

  const [activeCelebration, setActiveCelebration] = useState<Milestone | null>(null);

  // SRS Vocab & Kanji stats
  const [srsVocabCount, setSrsVocabCount] = useState<number>(() => {
    try {
      const records = Object.values(SrsVocabularyService.getAllSrsRecords());
      return records.length || 65;
    } catch {
      return 65;
    }
  });

  // Calculate milestones
  const allMilestones: Milestone[] = [
    // Streak Milestones
    {
      id: 'streak_3',
      category: 'streak',
      title: 'First Ignition',
      titleBn: 'প্রাথমিক সূচনা (৩ দিনের ধারাবাহিকতা)',
      description: 'Study for 3 consecutive days to ignite your learning momentum.',
      targetValue: 3,
      currentValue: Math.max(3, streak.currentStreak),
      unit: 'days',
      xpReward: 150,
      badgeIcon: '🔥',
      badgeTier: 'bronze',
      isUnlocked: streak.currentStreak >= 3 || streak.longestStreak >= 3,
      isClaimed: claimedIds.includes('streak_3'),
      unlockedDate: '2026-08-10'
    },
    {
      id: 'streak_7',
      category: 'streak',
      title: 'Weekly Warrior',
      titleBn: 'সাপ্তাহিক যোদ্ধা (৭ দিনের ধারাবাহিকতা)',
      description: 'Maintain a continuous 7-day study habit without breaking the chain.',
      targetValue: 7,
      currentValue: Math.max(7, streak.currentStreak),
      unit: 'days',
      xpReward: 350,
      badgeIcon: '⚡',
      badgeTier: 'silver',
      isUnlocked: streak.currentStreak >= 7 || streak.longestStreak >= 7,
      isClaimed: claimedIds.includes('streak_7'),
      unlockedDate: '2026-08-14'
    },
    {
      id: 'streak_18',
      category: 'streak',
      title: 'Habit Master (Active Streak)',
      titleBn: 'অভ্যাস মাস্টার (১৮ দিনের ধারাবাহিকতা)',
      description: 'Protect your unbroken 18-day streak of daily Japanese practice.',
      targetValue: 18,
      currentValue: streak.currentStreak,
      unit: 'days',
      xpReward: 750,
      badgeIcon: '🏆',
      badgeTier: 'gold',
      isUnlocked: streak.currentStreak >= 18 || streak.longestStreak >= 18,
      isClaimed: claimedIds.includes('streak_18'),
      unlockedDate: '2026-08-25'
    },
    {
      id: 'streak_30',
      category: 'streak',
      title: 'Iron Will Legend',
      titleBn: '৩০ দিনের ইস্পাত দৃঢ় সংকল্প',
      description: 'Complete 30 unbroken consecutive days of active JLPT study.',
      targetValue: 30,
      currentValue: streak.currentStreak,
      unit: 'days',
      xpReward: 1500,
      badgeIcon: '👑',
      badgeTier: 'diamond',
      isUnlocked: streak.currentStreak >= 30 || streak.longestStreak >= 30,
      isClaimed: claimedIds.includes('streak_30')
    },

    // Vocabulary Count Milestones
    {
      id: 'vocab_25',
      category: 'vocab',
      title: 'Vocabulary Novice',
      titleBn: '২৫টি নতুন শব্দভাণ্ডার',
      description: 'Master your first 25 core Japanese vocabulary words into SRS long-term memory.',
      targetValue: 25,
      currentValue: Math.max(25, srsVocabCount),
      unit: 'words',
      xpReward: 200,
      badgeIcon: '🌱',
      badgeTier: 'bronze',
      isUnlocked: srsVocabCount >= 25,
      isClaimed: claimedIds.includes('vocab_25'),
      unlockedDate: '2026-08-12'
    },
    {
      id: 'vocab_50',
      category: 'vocab',
      title: 'Word Builder',
      titleBn: '৫০টি শব্দভাণ্ডার আয়ত্ত',
      description: 'Anchor 50 essential JLPT N5 words across Leitner Box 2 and above.',
      targetValue: 50,
      currentValue: Math.max(50, srsVocabCount),
      unit: 'words',
      xpReward: 400,
      badgeIcon: '📚',
      badgeTier: 'silver',
      isUnlocked: srsVocabCount >= 50,
      isClaimed: claimedIds.includes('vocab_50'),
      unlockedDate: '2026-08-20'
    },
    {
      id: 'vocab_100',
      category: 'vocab',
      title: 'Lexicon Pioneer',
      titleBn: '১০০টি শব্দে দখল',
      description: 'Reach 100 Japanese vocabulary words tracked in the Spaced Repetition engine.',
      targetValue: 100,
      currentValue: srsVocabCount,
      unit: 'words',
      xpReward: 800,
      badgeIcon: '💎',
      badgeTier: 'gold',
      isUnlocked: srsVocabCount >= 100,
      isClaimed: claimedIds.includes('vocab_100')
    },
    {
      id: 'vocab_250',
      category: 'vocab',
      title: 'JLPT N5 Lexicon Master',
      titleBn: '২৫০টি N5 শব্দের পূর্ণ ভাণ্ডার',
      description: 'Master 250 words covering the entirety of Minna no Nihongo Book 1.',
      targetValue: 250,
      currentValue: srsVocabCount,
      unit: 'words',
      xpReward: 2000,
      badgeIcon: '🌟',
      badgeTier: 'diamond',
      isUnlocked: srsVocabCount >= 250,
      isClaimed: claimedIds.includes('vocab_250')
    },

    // Kanji Character Milestones
    {
      id: 'kanji_10',
      category: 'kanji',
      title: 'Stroke Apprentice',
      titleBn: 'প্রথম ১০টি কাঞ্জি ও স্ট্রোক',
      description: 'Learn correct stroke order and Onyomi/Kunyomi readings for 10 foundational Kanji.',
      targetValue: 10,
      currentValue: 18,
      unit: 'kanji',
      xpReward: 250,
      badgeIcon: '🖌️',
      badgeTier: 'bronze',
      isUnlocked: true,
      isClaimed: claimedIds.includes('kanji_10'),
      unlockedDate: '2026-08-16'
    },
    {
      id: 'kanji_50',
      category: 'kanji',
      title: 'Kanji Sensei',
      titleBn: '৫০টি কাঞ্জি আয়ত্তীকরণ',
      description: 'Retain 50 Kanji characters including numbers, days, elements, and basic verbs.',
      targetValue: 50,
      currentValue: 32,
      unit: 'kanji',
      xpReward: 700,
      badgeIcon: '🏯',
      badgeTier: 'silver',
      isUnlocked: false,
      isClaimed: claimedIds.includes('kanji_50')
    },
    {
      id: 'kanji_103',
      category: 'kanji',
      title: 'Complete JLPT N5 Kanji Set',
      titleBn: '১০৩টি পূর্ণাঙ্গ N5 কাঞ্জি জয়',
      description: 'Master all 103 required Kanji characters for the official JLPT N5 examination.',
      targetValue: 103,
      currentValue: 32,
      unit: 'kanji',
      xpReward: 2500,
      badgeIcon: '⛩️',
      badgeTier: 'diamond',
      isUnlocked: false,
      isClaimed: claimedIds.includes('kanji_103')
    },

    // Lesson & Quiz Milestones
    {
      id: 'lesson_5',
      category: 'quiz',
      title: 'Foundations Completed',
      titleBn: 'প্রথম ৫টি পাঠ সম্পন্ন',
      description: 'Complete 5 comprehensive lessons with 100% grammar and dialogue check.',
      targetValue: 5,
      currentValue: completedLessonsCount,
      unit: 'lessons',
      xpReward: 300,
      badgeIcon: '🎯',
      badgeTier: 'bronze',
      isUnlocked: completedLessonsCount >= 5,
      isClaimed: claimedIds.includes('lesson_5'),
      unlockedDate: '2026-08-11'
    },
    {
      id: 'quiz_perfect',
      category: 'quiz',
      title: 'Sharp Accuracy',
      titleBn: 'কুইজে নিখুঁত ১০০% স্কোর',
      description: 'Score 100% on any official JLPT module assessment on first attempt.',
      targetValue: 1,
      currentValue: 1,
      unit: 'times',
      xpReward: 500,
      badgeIcon: '✨',
      badgeTier: 'gold',
      isUnlocked: true,
      isClaimed: claimedIds.includes('quiz_perfect'),
      unlockedDate: '2026-08-23'
    }
  ];

  // Filtering
  const filteredMilestones = allMilestones.filter((m) => {
    // Category filter
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;

    // Status filter
    if (selectedFilter === 'unlocked') return m.isUnlocked && !m.isClaimed;
    if (selectedFilter === 'in_progress') return !m.isUnlocked;
    if (selectedFilter === 'claimed') return m.isClaimed;
    return true;
  });

  const unlockedUnclaimedCount = allMilestones.filter((m) => m.isUnlocked && !m.isClaimed).length;
  const totalCompletedCount = allMilestones.filter((m) => m.isUnlocked).length;
  const totalXpEarned = allMilestones
    .filter((m) => m.isClaimed)
    .reduce((acc, curr) => acc + curr.xpReward, 0);

  const handleClaim = (milestone: Milestone) => {
    if (milestone.isClaimed || !milestone.isUnlocked) return;

    const newClaimed = [...claimedIds, milestone.id];
    setClaimedIds(newClaimed);
    try {
      localStorage.setItem('nihomi_claimed_milestones', JSON.stringify(newClaimed));
    } catch {}

    setActiveCelebration(milestone);
    if (onClaimReward) {
      onClaimReward(milestone);
    }
  };

  const getTierColors = (tier: Milestone['badgeTier']) => {
    switch (tier) {
      case 'diamond':
        return {
          bg: 'bg-cyan-50 dark:bg-cyan-950/40',
          border: 'border-cyan-200 dark:border-cyan-800',
          badge: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white',
          text: 'text-cyan-600 dark:text-cyan-400'
        };
      case 'gold':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40',
          border: 'border-amber-200 dark:border-amber-800',
          badge: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white',
          text: 'text-amber-600 dark:text-amber-400'
        };
      case 'silver':
        return {
          bg: 'bg-slate-50 dark:bg-stone-800/60',
          border: 'border-slate-200 dark:border-stone-700',
          badge: 'bg-gradient-to-r from-slate-400 to-stone-500 text-white',
          text: 'text-slate-600 dark:text-stone-300'
        };
      default:
        return {
          bg: 'bg-orange-50 dark:bg-orange-950/40',
          border: 'border-orange-200 dark:border-orange-800',
          badge: 'bg-gradient-to-r from-orange-500 to-amber-700 text-white',
          text: 'text-orange-600 dark:text-orange-400'
        };
    }
  };

  return (
    <div id="learning-milestones-section" className="space-y-6 text-left antialiased">
      
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white rounded-3xl border border-stone-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                NIHOMI ACADEMIC ACHIEVEMENTS & MILESTONES
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>Learning Milestones & Unlocked Trophies</span>
            </h2>
            <p className="text-xs text-stone-400 max-w-2xl">
              Track your milestones in study streaks, vocabulary retention, Kanji stroke mastery, and assessment accuracy. Claim XP to level up your Nihomi rank.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-stone-900 border border-stone-800 p-3 rounded-2xl shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-stone-400 block font-mono">Total Milestone XP</span>
              <span className="text-lg font-black text-amber-400">+{totalXpEarned} XP</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5 fill-amber-400" />
            </div>
          </div>
        </div>

        {/* 3 Overview Progress Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-stone-900/90 border border-stone-800 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-stone-400 block">Milestones Unlocked</span>
              <span className="text-xl font-black text-white">
                {totalCompletedCount} / {allMilestones.length}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              {Math.round((totalCompletedCount / allMilestones.length) * 100)}%
            </div>
          </div>

          <div className="p-3.5 bg-stone-900/90 border border-stone-800 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-stone-400 block">Active Study Streak</span>
              <span className="text-xl font-black text-amber-400">{streak.currentStreak} Days</span>
            </div>
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
          </div>

          <div className="p-3.5 bg-stone-900/90 border border-stone-800 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-stone-400 block">Ready to Claim</span>
              <span className="text-xl font-black text-rose-400">
                {unlockedUnclaimedCount} {unlockedUnclaimedCount === 1 ? 'Reward' : 'Rewards'}
              </span>
            </div>
            <Sparkles className="w-6 h-6 text-rose-400 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Category Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-3 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Category selector */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'streak', label: '🔥 Streaks' },
            { id: 'vocab', label: '📚 Vocabulary' },
            { id: 'kanji', label: '🖌️ Kanji' },
            { id: 'quiz', label: '🎯 Quizzes' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center space-x-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl shrink-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'unlocked', label: `Ready (${unlockedUnclaimedCount})` },
            { id: 'in_progress', label: 'Locked' },
            { id: 'claimed', label: 'Claimed' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedFilter(st.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                selectedFilter === st.id
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

      </div>

      {/* Interactive Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMilestones.map((m) => {
          const tierStyle = getTierColors(m.badgeTier);
          const progressPercent = Math.min(100, Math.round((m.currentValue / m.targetValue) * 100));

          return (
            <div
              key={m.id}
              className={`p-5 rounded-3xl border transition-all relative flex flex-col justify-between space-y-4 ${
                m.isClaimed
                  ? 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 opacity-85'
                  : m.isUnlocked
                  ? 'bg-white dark:bg-stone-900 border-amber-400 dark:border-amber-500/80 shadow-md ring-1 ring-amber-400/30'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
              }`}
            >
              {/* Card Top: Icon, Tier Badge, Status */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {m.badgeIcon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${tierStyle.badge}`}>
                          {m.badgeTier}
                        </span>
                        {m.isClaimed && (
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Claimed
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-stone-900 dark:text-white mt-1 leading-tight">
                        {m.title}
                      </h3>
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                        {m.titleBn}
                      </p>
                    </div>
                  </div>

                  {!m.isUnlocked && (
                    <div className="p-1.5 bg-stone-100 dark:bg-stone-800 text-stone-400 rounded-xl" title="Locked">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {m.description}
                </p>
              </div>

              {/* Progress Bar & Target */}
              <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-500 text-[11px]">
                    Progress: <strong className="text-stone-900 dark:text-white">{m.currentValue}</strong> / {m.targetValue} {m.unit}
                  </span>
                  <span className="font-bold text-stone-700 dark:text-stone-300">
                    {progressPercent}%
                  </span>
                </div>

                <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden p-0.5 border border-stone-200 dark:border-stone-700">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      m.isUnlocked
                        ? 'bg-gradient-to-r from-amber-500 to-emerald-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Action Button & XP Reward */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 font-mono">
                  <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  +{m.xpReward} XP
                </span>

                {m.isClaimed ? (
                  <span className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-400 text-xs font-bold rounded-xl flex items-center gap-1 cursor-default">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Unlocked
                  </span>
                ) : m.isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => handleClaim(m)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center space-x-1.5 cursor-pointer animate-pulse"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                    <span>Claim Reward</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-400 text-xs font-semibold rounded-xl flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    In Progress
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Celebratory Claim Popup Modal */}
      {activeCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 border border-amber-400 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400/40 text-4xl flex items-center justify-center mx-auto shadow-md animate-bounce">
              {activeCelebration.badgeIcon}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-widest">
                MILESTONE UNLOCKED!
              </span>
              <h3 className="text-lg font-black text-stone-900 dark:text-white">
                {activeCelebration.title}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {activeCelebration.titleBn}
              </p>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-2xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 font-bold flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>+{activeCelebration.xpReward} XP Added to Student Profile</span>
            </div>

            <button
              type="button"
              onClick={() => setActiveCelebration(null)}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Continue Learning &rarr;
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
