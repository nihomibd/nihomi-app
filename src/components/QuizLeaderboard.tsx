import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Trophy,
  Flame,
  Medal,
  Award,
  Crown,
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  Radio,
  Timer,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatarLetter: string;
  targetLevel: string;
  topScore: number;
  streakDays: number;
  quizzesTaken: number;
  totalXp: number;
  avgTimeSec: number;
  rankDelta?: number;
  isCurrentUser?: boolean;
}

interface QuizLeaderboardProps {
  userAttempts: any[];
}

export const QuizLeaderboard: React.FC<QuizLeaderboardProps> = ({ userAttempts }) => {
  const { user, profile, progress } = useAuth();
  const [activeTab, setActiveTab] = useState<'score' | 'streak' | 'speed'>('score');
  const [timeframe, setTimeframe] = useState<'weekly' | 'all-time'>('weekly');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [livePulse, setLivePulse] = useState<number>(0);

  // Calculate current user stats
  const bestUserScore = userAttempts.length > 0
    ? Math.max(...userAttempts.map((a) => a.score || 0))
    : (progress?.experiencePoints ? 88 : 0);

  const currentUserEntry: LeaderboardEntry = {
    id: user?.id || 'current-user',
    name: profile?.displayName || 'You (Current Learner)',
    avatarLetter: (profile?.displayName || 'U').charAt(0).toUpperCase(),
    targetLevel: profile?.targetLevel || 'N5',
    topScore: bestUserScore > 0 ? bestUserScore : 92,
    streakDays: progress?.currentStreak || 1,
    quizzesTaken: userAttempts.length || 1,
    totalXp: progress?.experiencePoints || 450,
    avgTimeSec: 18,
    rankDelta: 1,
    isCurrentUser: true
  };

  // Base community leaderboard seed with dynamic elements
  const [communityEntries, setCommunityEntries] = useState<LeaderboardEntry[]>([
    {
      id: 'usr-1',
      name: 'Rahim K. (Dhaka)',
      avatarLetter: 'R',
      targetLevel: 'N4',
      topScore: 100,
      streakDays: 42,
      quizzesTaken: 28,
      totalXp: 2840,
      avgTimeSec: 14,
      rankDelta: 0
    },
    {
      id: 'usr-2',
      name: 'Tanaka Kenji (Tokyo)',
      avatarLetter: 'T',
      targetLevel: 'N3',
      topScore: 98,
      streakDays: 35,
      quizzesTaken: 24,
      totalXp: 2450,
      avgTimeSec: 12,
      rankDelta: 2
    },
    {
      id: 'usr-3',
      name: 'Nusrat Jahan (Chittagong)',
      avatarLetter: 'N',
      targetLevel: 'N5',
      topScore: 96,
      streakDays: 28,
      quizzesTaken: 19,
      totalXp: 1920,
      avgTimeSec: 16,
      rankDelta: -1
    },
    {
      id: 'usr-4',
      name: 'Arif Hossain (Sylhet)',
      avatarLetter: 'A',
      targetLevel: 'N5',
      topScore: 94,
      streakDays: 14,
      quizzesTaken: 15,
      totalXp: 1480,
      avgTimeSec: 19,
      rankDelta: 1
    },
    {
      id: 'usr-5',
      name: 'Saki Yamada (Kyoto)',
      avatarLetter: 'S',
      targetLevel: 'N4',
      topScore: 90,
      streakDays: 12,
      quizzesTaken: 11,
      totalXp: 1120,
      avgTimeSec: 15,
      rankDelta: 0
    },
    {
      id: 'usr-6',
      name: 'Farhan Kabir (Rajshahi)',
      avatarLetter: 'F',
      targetLevel: 'N5',
      topScore: 88,
      streakDays: 9,
      quizzesTaken: 8,
      totalXp: 890,
      avgTimeSec: 21,
      rankDelta: 1
    }
  ]);

  // Real-time simulated score increment effect when live is active
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      setLivePulse((prev) => prev + 1);
      // Small random simulated XP activity among peers
      setCommunityEntries((prev) => {
        const copy = [...prev];
        const randomIdx = Math.floor(Math.random() * copy.length);
        if (copy[randomIdx]) {
          copy[randomIdx] = {
            ...copy[randomIdx],
            totalXp: copy[randomIdx].totalXp + 5
          };
        }
        return copy;
      });
    }, 12000);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  // Combine, filter, and sort
  const allEntries = [currentUserEntry, ...communityEntries];
  const filteredEntries = selectedLevel === 'All'
    ? allEntries
    : allEntries.filter((e) => e.targetLevel === selectedLevel || e.isCurrentUser);

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (activeTab === 'score') {
      return b.topScore - a.topScore || b.totalXp - a.totalXp;
    }
    if (activeTab === 'speed') {
      return a.avgTimeSec - b.avgTimeSec || b.topScore - a.topScore;
    }
    return b.streakDays - a.streakDays || b.topScore - a.topScore;
  });

  const top3 = sortedEntries.slice(0, 3);
  const userRank = sortedEntries.findIndex((e) => e.isCurrentUser) + 1;

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-bold text-sm shadow-xs">
          🥇
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 border border-slate-300 flex items-center justify-center font-bold text-sm shadow-xs">
          🥈
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center font-bold text-sm shadow-xs">
          🥉
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-xs font-mono">
        #{rank}
      </div>
    );
  };

  return (
    <div id="nihomi-quiz-leaderboard" className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Real-Time Community Arena</span>
            </span>
            {isLiveActive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Sync
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
            Real-Time Quiz Leaderboard & Speed Arena (লাইভ কুইজ লিডারবোর্ড)
          </h2>
          <p className="text-xs text-stone-500">
            Compete live against learners across Tokyo, Dhaka, and worldwide. Your current ranking: <strong>#{userRank}</strong>.
          </p>
        </div>

        {/* Timeframe & Mode Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-bold">
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                timeframe === 'weekly' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe('all-time')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                timeframe === 'all-time' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All-Time
            </button>
          </div>

          <button
            onClick={() => setIsLiveActive((prev) => !prev)}
            className={`px-3 py-2 rounded-2xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isLiveActive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-stone-50 text-stone-600 border-stone-200'
            }`}
            title="Toggle Live Real-Time Feed"
          >
            <Radio className={`w-3.5 h-3.5 ${isLiveActive ? 'text-emerald-600 animate-pulse' : 'text-stone-400'}`} />
            <span>{isLiveActive ? 'Live ON' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {top3.map((podiumUser, pIdx) => {
          const rank = pIdx + 1;
          const isGold = rank === 1;
          const isSilver = rank === 2;
          const isBronze = rank === 3;

          return (
            <div
              key={podiumUser.id}
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                isGold
                  ? 'bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-md ring-2 ring-amber-400/30 md:order-2 md:-translate-y-1'
                  : isSilver
                  ? 'bg-gradient-to-b from-slate-50 to-white border-slate-300 shadow-xs md:order-1'
                  : 'bg-gradient-to-b from-amber-50/40 to-white border-amber-200 shadow-xs md:order-3'
              } ${podiumUser.isCurrentUser ? 'ring-2 ring-red-500' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{rank === 1 ? '👑' : rank === 2 ? '🥈' : '🥉'}</div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700">
                      Rank #{rank} &bull; JLPT {podiumUser.targetLevel}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 mt-1 flex items-center gap-1.5">
                      <span className="truncate">{podiumUser.name}</span>
                      {podiumUser.isCurrentUser && (
                        <span className="px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-extrabold rounded">YOU</span>
                      )}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 bg-white/80 p-2.5 rounded-2xl border border-stone-200/60 text-center text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold block">Score</span>
                  <span className="font-extrabold text-stone-900">{podiumUser.topScore}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-bold block">Streak</span>
                  <span className="font-extrabold text-amber-600">{podiumUser.streakDays}d</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-bold block">Speed</span>
                  <span className="font-mono text-stone-700">{podiumUser.avgTimeSec}s</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs (Score, Streak, Speed) & JLPT Level Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('score')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'score' ? 'bg-red-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Top Accuracy</span>
          </button>
          <button
            onClick={() => setActiveTab('streak')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'streak' ? 'bg-red-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Streak</span>
          </button>
          <button
            onClick={() => setActiveTab('speed')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'speed' ? 'bg-red-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Speed Reflex</span>
          </button>
        </div>

        {/* JLPT Level Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs font-bold">
          {['All', 'N5', 'N4', 'N3'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 rounded-xl transition cursor-pointer border ${
                selectedLevel === lvl
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300'
              }`}
            >
              {lvl === 'All' ? 'All Levels' : `JLPT ${lvl}`}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table / Rows */}
      <div className="space-y-2.5">
        {sortedEntries.map((entry, index) => {
          const rank = index + 1;
          const isUser = entry.isCurrentUser;

          return (
            <div
              key={entry.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                isUser
                  ? 'bg-red-50/70 border-red-300 ring-2 ring-red-400/30 shadow-xs'
                  : 'bg-stone-50/70 border-stone-200/80 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {getRankBadge(rank)}

                <div className="w-9 h-9 rounded-xl bg-stone-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {entry.avatarLetter}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-stone-900 truncate">
                      {entry.name}
                    </p>
                    {isUser && (
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-red-600 text-white shadow-xs">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span className="font-semibold text-red-700">JLPT {entry.targetLevel}</span>
                    <span>&bull;</span>
                    <span>{entry.quizzesTaken} Quizzes Completed</span>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-4 shrink-0 text-right">
                <div>
                  <div className="flex items-center justify-end gap-1 text-sm font-extrabold text-stone-900">
                    {activeTab === 'score' ? (
                      <>
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>{entry.topScore}%</span>
                      </>
                    ) : activeTab === 'speed' ? (
                      <>
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>{entry.avgTimeSec}s avg</span>
                      </>
                    ) : (
                      <>
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                        <span>{entry.streakDays}d</span>
                      </>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono block">
                    {entry.totalXp} XP
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

