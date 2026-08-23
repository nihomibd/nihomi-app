import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Trophy,
  Crown,
  Flame,
  Sparkles,
  Medal,
  Award,
  Users,
  MapPin,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface LeaderboardStudent {
  id: string;
  name: string;
  nameJa: string;
  avatarText: string;
  location: string;
  dailyXp: number;
  weeklyXp: number;
  allTimeXp: number;
  streakDays: number;
  targetLevel: string;
  badgeTitle: string;
  isCurrentUser?: boolean;
}

interface GlobalLeaderboardProps {
  currentUserXp?: number;
  currentUserStreak?: number;
}

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({
  currentUserXp = 450,
  currentUserStreak = 1
}) => {
  const { user, profile } = useAuth();
  const [filter, setFilter] = useState<'today' | 'week' | 'allTime'>('today');

  const rawStudents: LeaderboardStudent[] = [
    {
      id: 'st-1',
      name: 'Rahim Al-Hasan',
      nameJa: 'ラヒム・アルハサン',
      avatarText: 'RH',
      location: 'Tokyo, Japan 🇯🇵',
      dailyXp: 850,
      weeklyXp: 4200,
      allTimeXp: 18500,
      streakDays: 48,
      targetLevel: 'N4',
      badgeTitle: 'Tokyo Konbini Ace'
    },
    {
      id: 'st-2',
      name: 'Tanvir Hossain',
      nameJa: 'タンビル・ホセイン',
      avatarText: 'TH',
      location: 'Dhaka, Bangladesh 🇧🇩',
      dailyXp: 720,
      weeklyXp: 3850,
      allTimeXp: 15200,
      streakDays: 32,
      targetLevel: 'N5',
      badgeTitle: 'Grammar Trailblazer'
    },
    {
      id: 'st-3',
      name: 'Farhana Yasmin',
      nameJa: 'ファルハナ・ヤスミン',
      avatarText: 'FY',
      location: 'Osaka, Japan 🇯🇵',
      dailyXp: 690,
      weeklyXp: 3400,
      allTimeXp: 14100,
      streakDays: 29,
      targetLevel: 'N3',
      badgeTitle: 'Keigo Diplomat'
    },
    {
      id: 'st-4',
      name: 'Nusrat Jahan',
      nameJa: 'ヌスラット・ジャハン',
      avatarText: 'NJ',
      location: 'Chittagong, BD 🇧🇩',
      dailyXp: 540,
      weeklyXp: 2900,
      allTimeXp: 11800,
      streakDays: 21,
      targetLevel: 'N5',
      badgeTitle: 'Kanji Centurion'
    },
    {
      id: 'st-5',
      name: 'Arifur Rahman',
      nameJa: 'アリフル・ラフマン',
      avatarText: 'AR',
      location: 'Fukuoka, Japan 🇯🇵',
      dailyXp: 490,
      weeklyXp: 2600,
      allTimeXp: 9950,
      streakDays: 17,
      targetLevel: 'N4',
      badgeTitle: 'Particle Virtuoso'
    },
    {
      id: 'st-6',
      name: profile?.displayName || user?.name || 'Learner (You)',
      nameJa: 'あなた (You)',
      avatarText: profile?.displayName?.charAt(0) || 'U',
      location: 'Dhaka / Online',
      dailyXp: Math.max(currentUserXp, 420),
      weeklyXp: Math.max(currentUserXp * 3, 1950),
      allTimeXp: Math.max(currentUserXp * 7, 7200),
      streakDays: currentUserStreak,
      targetLevel: profile?.targetLevel || 'N5',
      badgeTitle: 'Active Aspirant',
      isCurrentUser: true
    },
    {
      id: 'st-7',
      name: 'Shakil Ahmed',
      nameJa: 'シャキル・アフメド',
      avatarText: 'SA',
      location: 'Kyoto, Japan 🇯🇵',
      dailyXp: 380,
      weeklyXp: 1800,
      allTimeXp: 6800,
      streakDays: 12,
      targetLevel: 'N5',
      badgeTitle: 'Kana Explorer'
    },
    {
      id: 'st-8',
      name: 'Sabrina Islam',
      nameJa: 'サブリナ・イスラム',
      avatarText: 'SI',
      location: 'Sylhet, BD 🇧🇩',
      dailyXp: 310,
      weeklyXp: 1550,
      allTimeXp: 5400,
      streakDays: 9,
      targetLevel: 'N5',
      badgeTitle: 'Voice Sensei Regular'
    }
  ];

  // Sort according to active filter
  const sortedStudents = [...rawStudents].sort((a, b) => {
    if (filter === 'today') return b.dailyXp - a.dailyXp;
    if (filter === 'week') return b.weeklyXp - a.weeklyXp;
    return b.allTimeXp - a.allTimeXp;
  });

  const currentUserRank = sortedStudents.findIndex((s) => s.isCurrentUser) + 1;
  const userXpForFilter = filter === 'today' ? Math.max(currentUserXp, 420) : filter === 'week' ? 1950 : 7200;
  const nextRankStudent = currentUserRank > 1 ? sortedStudents[currentUserRank - 2] : null;
  const xpNeededForNextRank = nextRankStudent
    ? (filter === 'today' ? nextRankStudent.dailyXp : filter === 'week' ? nextRankStudent.weeklyXp : nextRankStudent.allTimeXp) - userXpForFilter + 10
    : 0;

  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 font-extrabold flex items-center justify-center text-sm shadow-md ring-2 ring-amber-300">
          🥇
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-xl bg-stone-300 text-stone-900 font-extrabold flex items-center justify-center text-sm shadow-sm ring-2 ring-stone-200">
          🥈
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-700/80 text-white font-extrabold flex items-center justify-center text-sm shadow-sm ring-2 ring-amber-600/40">
          🥉
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-600 font-bold flex items-center justify-center text-xs border border-stone-200">
        #{rank}
      </div>
    );
  };

  return (
    <div id="global-student-leaderboard" className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              GLOBAL COMMUNITY &bull; REAL-TIME XP
            </span>
            <span className="text-xs font-bold text-stone-500">
              Tokyo &bull; Dhaka &bull; Worldwide
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Global Student Leaderboard (গ্লোবাল লিডারবোর্ড)</span>
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            Compete with fellow Nihomi Japanese learners across Bangladesh and Japan. Earn XP through daily quizzes, flashcards, and lesson completions.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200 self-start sm:self-center">
          <button
            onClick={() => setFilter('today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === 'today'
                ? 'bg-white text-red-600 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Today (আজ)
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === 'week'
                ? 'bg-white text-red-600 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setFilter('allTime')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === 'allTime'
                ? 'bg-white text-red-600 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Podium Cards for Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {sortedStudents.slice(0, 3).map((student, idx) => {
          const rank = idx + 1;
          const xp = filter === 'today' ? student.dailyXp : filter === 'week' ? student.weeklyXp : student.allTimeXp;
          return (
            <div
              key={student.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between space-y-3 relative overflow-hidden ${
                rank === 1
                  ? 'bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border-amber-300 shadow-md ring-2 ring-amber-400/30'
                  : 'bg-stone-50 border-stone-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {renderRankBadge(rank)}
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                      Rank #{rank}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 truncate max-w-[140px]">
                      {student.name}
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-amber-600 font-mono">
                    +{xp} XP
                  </span>
                  <span className="text-[10px] text-stone-400 block">{student.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200/60">
                <span className="text-[10px] px-2 py-0.5 bg-white border border-stone-200 rounded-md font-bold text-stone-700">
                  {student.badgeTitle}
                </span>
                <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-amber-500 text-amber-600" />
                  <span>{student.streakDays}d Streak</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Ranking Table (Ranks 4-8 + User Highlight) */}
      <div className="space-y-2 pt-2">
        {sortedStudents.slice(3).map((student, idx) => {
          const rank = idx + 4;
          const xp = filter === 'today' ? student.dailyXp : filter === 'week' ? student.weeklyXp : student.allTimeXp;
          const isMe = student.isCurrentUser;

          return (
            <div
              key={student.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isMe
                  ? 'bg-red-50/90 border-red-300 ring-2 ring-red-400/40 shadow-xs'
                  : 'bg-white hover:bg-stone-50 border-stone-200'
              }`}
            >
              {/* Left: Rank & User */}
              <div className="flex items-center gap-3">
                {renderRankBadge(rank)}

                <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-800 font-bold text-xs flex items-center justify-center border border-stone-200">
                  {student.avatarText}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-900">
                      {student.name}
                    </span>
                    {isMe && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-600 text-white">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span>{student.location}</span>
                    <span>&bull;</span>
                    <span className="text-stone-600 font-medium">JLPT {student.targetLevel}</span>
                  </div>
                </div>
              </div>

              {/* Right: XP & Streak */}
              <div className="flex items-center gap-4 text-right">
                <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                  <span>{student.streakDays}d</span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-stone-900 font-mono block">
                    {xp} XP
                  </span>
                  <span className="text-[10px] text-stone-400 block">{student.badgeTitle}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Standing Summary Gauge */}
      <div className="p-4 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-bold text-white shrink-0">
            #{currentUserRank}
          </div>
          <div>
            <p className="text-xs font-bold">
              Your Current Global Standing: Rank #{currentUserRank} of {sortedStudents.length}
            </p>
            <p className="text-[11px] text-stone-400">
              {xpNeededForNextRank > 0
                ? `Earn ${xpNeededForNextRank} more XP to overtake Rank #${currentUserRank - 1}!`
                : 'You are leading the pack! Keep up the daily practice.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <Sparkles className="w-4 h-4" />
          <span>Daily Reset in 6h 24m</span>
        </div>
      </div>
    </div>
  );
};
export default GlobalLeaderboard;
