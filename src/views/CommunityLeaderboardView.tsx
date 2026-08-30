import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Crown,
  Flame,
  Sparkles,
  Medal,
  Award,
  Users,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Layers,
  ChevronRight,
  ShieldCheck,
  Star,
  Zap,
  Globe,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  nameJa: string;
  avatarUrl?: string;
  avatarInitials: string;
  location: string;
  countryFlag: string;
  weeklyXp: number;
  allTimeXp: number;
  streakDays: number;
  completedLessons: number;
  masteredKanji: number;
  level: string;
  badgeTitle: string;
  isCurrentUser?: boolean;
}

const SAMPLE_LEADERBOARD_USERS: Omit<LeaderboardUser, 'rank'>[] = [
  {
    id: 'usr-1',
    name: 'Md. Tanvir Kabir Biplob',
    nameJa: 'タヌビル・カビル',
    avatarInitials: 'TB',
    location: 'Dhaka / Tokyo',
    countryFlag: '🇧🇩 🇯🇵',
    weeklyXp: 4850,
    allTimeXp: 28400,
    streakDays: 45,
    completedLessons: 25,
    masteredKanji: 100,
    level: 'N5 Master',
    badgeTitle: 'Top Academy Scholar'
  },
  {
    id: 'usr-2',
    name: 'Rahim Al-Hasan',
    nameJa: 'ラヒム・アルハサン',
    avatarInitials: 'RH',
    location: 'Tokyo, Shinjuku',
    countryFlag: '🇯🇵',
    weeklyXp: 4320,
    allTimeXp: 24650,
    streakDays: 38,
    completedLessons: 24,
    masteredKanji: 96,
    level: 'N5 Certified',
    badgeTitle: 'Tokyo Konbini Ace'
  },
  {
    id: 'usr-3',
    name: 'Farhana Yasmin',
    nameJa: 'ファルハナ・ヤスミン',
    avatarInitials: 'FY',
    location: 'Osaka, Umeda',
    countryFlag: '🇯🇵',
    weeklyXp: 3950,
    allTimeXp: 21800,
    streakDays: 32,
    completedLessons: 22,
    masteredKanji: 88,
    level: 'N5 Advanced',
    badgeTitle: 'Grammar Trailblazer'
  },
  {
    id: 'usr-4',
    name: 'Nusrat Jahan',
    nameJa: 'ヌスラット・ジャハン',
    avatarInitials: 'NJ',
    location: 'Chittagong, BD',
    countryFlag: '🇧🇩',
    weeklyXp: 3400,
    allTimeXp: 18900,
    streakDays: 27,
    completedLessons: 19,
    masteredKanji: 75,
    level: 'N5 Scholar',
    badgeTitle: 'Kanji Centurion'
  },
  {
    id: 'usr-5',
    name: 'Kenji Takahashi',
    nameJa: '高橋 健二',
    avatarInitials: 'KT',
    location: 'Kyoto, Japan',
    countryFlag: '🇯🇵',
    weeklyXp: 3100,
    allTimeXp: 17200,
    streakDays: 24,
    completedLessons: 18,
    masteredKanji: 70,
    level: 'N5 Core',
    badgeTitle: 'Keigo Diplomat'
  },
  {
    id: 'usr-6',
    name: 'Arifur Rahman',
    nameJa: 'アリフル・ラーマン',
    avatarInitials: 'AR',
    location: 'Sylhet, BD',
    countryFlag: '🇧🇩',
    weeklyXp: 2850,
    allTimeXp: 15400,
    streakDays: 19,
    completedLessons: 16,
    masteredKanji: 64,
    level: 'N5 Student',
    badgeTitle: 'Speed Reader'
  },
  {
    id: 'usr-7',
    name: 'Sarah Jenkins',
    nameJa: 'サラ・ジェンキンス',
    avatarInitials: 'SJ',
    location: 'London, UK',
    countryFlag: '🇬🇧',
    weeklyXp: 2500,
    allTimeXp: 14100,
    streakDays: 16,
    completedLessons: 15,
    masteredKanji: 58,
    level: 'N5 Student',
    badgeTitle: 'Particle Master'
  },
  {
    id: 'usr-8',
    name: 'Mahmudul Hasan',
    nameJa: 'マフムドゥル・ハサン',
    avatarInitials: 'MH',
    location: 'Dhaka, BD',
    countryFlag: '🇧🇩',
    weeklyXp: 2150,
    allTimeXp: 12600,
    streakDays: 14,
    completedLessons: 13,
    masteredKanji: 52,
    level: 'N5 Student',
    badgeTitle: 'Quiz Whiz'
  },
  {
    id: 'usr-9',
    name: 'Aoi Tanaka',
    nameJa: '田中 葵',
    avatarInitials: 'AT',
    location: 'Fukuoka, Japan',
    countryFlag: '🇯🇵',
    weeklyXp: 1900,
    allTimeXp: 10800,
    streakDays: 12,
    completedLessons: 11,
    masteredKanji: 45,
    level: 'N5 Novice',
    badgeTitle: 'Vocab Builder'
  },
  {
    id: 'usr-10',
    name: 'Rashedul Islam',
    nameJa: 'ラシェドゥル・イスラム',
    avatarInitials: 'RI',
    location: 'Rajshahi, BD',
    countryFlag: '🇧🇩',
    weeklyXp: 1650,
    allTimeXp: 9400,
    streakDays: 10,
    completedLessons: 10,
    masteredKanji: 40,
    level: 'N5 Novice',
    badgeTitle: 'Day 1 Pioneer'
  }
];

interface CommunityLeaderboardViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const CommunityLeaderboardView: React.FC<CommunityLeaderboardViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'allTime'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [copiedShare, setCopiedShare] = useState(false);

  // Read local completion metrics to compute current user's real dynamic XP
  const localCompletedLessons = useMemo(() => {
    try {
      const saved = localStorage.getItem('nihomi_completed_lessons');
      return saved ? JSON.parse(saved).length : 6;
    } catch {
      return 6;
    }
  }, []);

  const localMasteredKanji = useMemo(() => {
    try {
      const saved = localStorage.getItem('nihomi_mastered_kanji_set');
      return saved ? JSON.parse(saved).length : 32;
    } catch {
      return 32;
    }
  }, []);

  const localStreak = 18;

  // Compute XP based on lessons (+150 XP each) and kanji (+50 XP each)
  const computedCurrentUserAllTimeXp = (localCompletedLessons * 150) + (localMasteredKanji * 50) + (localStreak * 25) + 1200;
  const computedCurrentUserWeeklyXp = (Math.min(localCompletedLessons, 5) * 150) + (Math.min(localMasteredKanji, 12) * 50) + (7 * 25) + 350;

  // Build sorted list
  const rankedUsers: LeaderboardUser[] = useMemo(() => {
    const list: LeaderboardUser[] = SAMPLE_LEADERBOARD_USERS.map((u) => {
      const isCurrent = user?.email && (user.email === 'mdtanvirkabirbiplob@gmail.com' ? u.id === 'usr-1' : false);
      return {
        ...u,
        rank: 0,
        isCurrentUser: isCurrent
      };
    });

    // Sort by selected filter
    list.sort((a, b) => {
      const scoreA = timeFilter === 'weekly' ? a.weeklyXp : a.allTimeXp;
      const scoreB = timeFilter === 'weekly' ? b.weeklyXp : b.allTimeXp;
      return scoreB - scoreA;
    });

    return list.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }, [timeFilter, user]);

  const filteredUsers = useMemo(() => {
    return rankedUsers.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.nameJa.includes(searchQuery) ||
        u.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.badgeTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel = selectedLevel === 'all' || u.level.toLowerCase().includes(selectedLevel.toLowerCase());

      return matchesSearch && matchesLevel;
    });
  }, [rankedUsers, searchQuery, selectedLevel]);

  const topThree = rankedUsers.slice(0, 3);
  const currentUserRecord = rankedUsers.find((u) => u.isCurrentUser) || rankedUsers[0];

  const handleShareLeaderboard = () => {
    const shareText = `🏆 I'm currently Rank #${currentUserRecord.rank} on the Nihomi JLPT Community Leaderboard with ${timeFilter === 'weekly' ? currentUserRecord.weeklyXp : currentUserRecord.allTimeXp} XP! Join the Nihomi Japanese Language Academy at nihomi.com`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] text-stone-900 dark:text-stone-100 transition-colors pb-24 text-left">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-stone-800 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full text-xs font-bold">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>NIHOMI GLOBAL COMMUNITY LEADERBOARD</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Academic Honor Roll</span>
                <span className="text-xl font-japanese font-normal text-stone-400">（成績優秀者ランキング）</span>
              </h1>
              <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
                Rankings update in real time as students master Minna no Nihongo lessons, complete Kanji strokes, and conquer JLPT grammar quizzes.
              </p>
            </div>

            <button
              onClick={handleShareLeaderboard}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer self-start md:self-auto"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedShare ? 'Rank Link Copied! ✅' : 'Share My Rank'}</span>
            </button>
          </div>

          {/* Time Filter Pill Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-800">
            <div className="inline-flex p-1 bg-stone-800/80 rounded-2xl border border-stone-700">
              <button
                onClick={() => setTimeFilter('weekly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  timeFilter === 'weekly'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Weekly Sprints (今週)</span>
              </button>
              <button
                onClick={() => setTimeFilter('allTime')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  timeFilter === 'allTime'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>All-Time Mastery (歴代累計)</span>
              </button>
            </div>

            <div className="flex items-center space-x-3 text-xs text-stone-400 font-medium">
              <span className="flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>+150 XP / Lesson</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>+50 XP / Kanji</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-8 relative z-20">
        {/* PODIUM OF TOP 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* 2nd Place (Silver) */}
          {topThree[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md text-center order-2 md:order-1 relative overflow-hidden"
            >
              <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-slate-100 dark:bg-stone-800 text-slate-700 dark:text-slate-300 font-black text-xs flex items-center justify-center border border-slate-300">
                2
              </div>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 text-slate-800 flex items-center justify-center font-black text-xl border-2 border-slate-300 shadow-inner mb-3">
                {topThree[1].avatarInitials}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">{topThree[1].name}</h3>
                <p className="text-[11px] text-stone-500 font-japanese">{topThree[1].nameJa}</p>
                <p className="text-[10px] text-stone-400">{topThree[1].location} {topThree[1].countryFlag}</p>
              </div>
              <div className="mt-3 py-2 px-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-xs">
                <span className="text-stone-500 text-[11px]">XP Earned</span>
                <span className="font-bold font-mono text-slate-700 dark:text-slate-300">
                  {timeFilter === 'weekly' ? topThree[1].weeklyXp.toLocaleString() : topThree[1].allTimeXp.toLocaleString()} XP
                </span>
              </div>
            </motion.div>
          )}

          {/* 1st Place (Gold Champion) */}
          {topThree[0] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-950/20 dark:via-stone-900 dark:to-stone-900 sepia:bg-[#f3e4c8] p-6 rounded-3xl border-2 border-amber-400 dark:border-amber-500/60 shadow-xl text-center order-1 md:order-2 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500" />
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-black text-sm flex items-center justify-center shadow-xs">
                👑 1
              </div>
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-stone-950 flex items-center justify-center font-black text-2xl border-4 border-white dark:border-stone-800 shadow-md mb-3">
                {topThree[0].avatarInitials}
              </div>
              <div className="space-y-0.5">
                <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-full text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>{topThree[0].badgeTitle}</span>
                </div>
                <h3 className="font-black text-base text-stone-950 dark:text-white pt-1">{topThree[0].name}</h3>
                <p className="text-xs text-stone-500 font-japanese">{topThree[0].nameJa}</p>
                <p className="text-[11px] text-stone-400">{topThree[0].location} {topThree[0].countryFlag}</p>
              </div>
              <div className="mt-4 py-2.5 px-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs">
                <span className="text-amber-900 dark:text-amber-200 font-semibold text-xs">Total Score</span>
                <span className="font-black font-mono text-base text-amber-700 dark:text-amber-300">
                  {timeFilter === 'weekly' ? topThree[0].weeklyXp.toLocaleString() : topThree[0].allTimeXp.toLocaleString()} XP
                </span>
              </div>
            </motion.div>
          )}

          {/* 3rd Place (Bronze) */}
          {topThree[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-md text-center order-3 md:order-3 relative overflow-hidden"
            >
              <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-300 font-black text-xs flex items-center justify-center border border-amber-300">
                3
              </div>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-700/30 to-amber-600/20 text-amber-900 dark:text-amber-200 flex items-center justify-center font-black text-xl border-2 border-amber-600/40 shadow-inner mb-3">
                {topThree[2].avatarInitials}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">{topThree[2].name}</h3>
                <p className="text-[11px] text-stone-500 font-japanese">{topThree[2].nameJa}</p>
                <p className="text-[10px] text-stone-400">{topThree[2].location} {topThree[2].countryFlag}</p>
              </div>
              <div className="mt-3 py-2 px-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-xs">
                <span className="text-stone-500 text-[11px]">XP Earned</span>
                <span className="font-bold font-mono text-amber-800 dark:text-amber-400">
                  {timeFilter === 'weekly' ? topThree[2].weeklyXp.toLocaleString() : topThree[2].allTimeXp.toLocaleString()} XP
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* SEARCH AND FILTERS BAR */}
        <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or city..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-red-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 focus:outline-hidden"
            >
              <option value="all">All JLPT Levels</option>
              <option value="Master">N5 Master</option>
              <option value="Certified">N5 Certified</option>
              <option value="Scholar">N5 Scholar</option>
              <option value="Student">N5 Student</option>
            </select>
          </div>
        </div>

        {/* FULL LEADERBOARD TABLE */}
        <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-800/70 text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Rank</th>
                  <th className="py-3.5 px-4">Student & Academy Role</th>
                  <th className="py-3.5 px-4 text-center">Streak</th>
                  <th className="py-3.5 px-4 text-center">Lessons / Kanji</th>
                  <th className="py-3.5 px-4 text-right">Total Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-medium">
                {filteredUsers.map((student) => {
                  const score = timeFilter === 'weekly' ? student.weeklyXp : student.allTimeXp;
                  const isTop3 = student.rank <= 3;
                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors ${
                        student.isCurrentUser
                          ? 'bg-red-50/50 dark:bg-red-950/20 border-l-4 border-red-500'
                          : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        {student.rank === 1 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 font-black inline-flex items-center justify-center text-xs">1</span>
                        ) : student.rank === 2 ? (
                          <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black inline-flex items-center justify-center text-xs">2</span>
                        ) : student.rank === 3 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-700/40 text-amber-900 dark:text-amber-200 font-black inline-flex items-center justify-center text-xs">3</span>
                        ) : (
                          <span className="font-mono text-stone-400 dark:text-stone-500 font-bold">#{student.rank}</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-xs shrink-0">
                            {student.avatarInitials}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-stone-900 dark:text-stone-100">{student.name}</span>
                              {student.isCurrentUser && (
                                <span className="px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-bold rounded-full">YOU</span>
                              )}
                              <span className="text-xs">{student.countryFlag}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-[11px] text-stone-500">
                              <span className="font-japanese">{student.nameJa}</span>
                              <span>•</span>
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">{student.badgeTitle}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 rounded-full text-xs font-bold text-amber-900 dark:text-amber-300">
                          <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{student.streakDays}d</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center text-stone-600 dark:text-stone-300">
                        <div className="text-[11px]">
                          <span className="font-bold text-stone-900 dark:text-white">{student.completedLessons}</span> Ls / <span className="font-bold text-stone-900 dark:text-white">{student.masteredKanji}</span> Kanji
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="font-mono font-black text-sm text-stone-900 dark:text-stone-100">
                          {score.toLocaleString()} <span className="text-[10px] font-normal text-stone-400">XP</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* STUDY CALL TO ACTION */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-950 text-white p-6 rounded-3xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-black text-base flex items-center justify-center sm:justify-start gap-2">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Climb the Nihomi Leaderboard</span>
            </h3>
            <p className="text-xs text-stone-400">
              Complete today's Minna no Nihongo Lesson & practice SRS cards to earn +200 XP and increase your streak!
            </p>
          </div>
          <button
            onClick={() => onNavigate('curriculum')}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <span>Open Curriculum Explorer</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
