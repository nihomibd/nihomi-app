import React, { useState, useEffect, useCallback } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  Zap,
  Flame,
  Clock,
  TrendingUp,
  Award,
  Sparkles,
  RefreshCw,
  Layers,
  BookOpen,
  CheckCircle2,
  Trophy,
  Crown,
  ChevronRight,
  ShieldCheck,
  BarChart3,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchLearnerAnalyticsOverview, refreshLearnerAnalytics, fetchLeaderboard } from '../../lib/analytics.js';
import { LearnerAnalyticsSummary, LeaderboardRankItem } from '../../types.js';

interface LearnerTelemetryDashboardProps {
  onNavigate?: (view: string, params?: Record<string, any>) => void;
}

export const LearnerTelemetryDashboard: React.FC<LearnerTelemetryDashboardProps> = ({ onNavigate }) => {
  const [analytics, setAnalytics] = useState<LearnerAnalyticsSummary | null>(null);
  const [leaderboardItems, setLeaderboardItems] = useState<LeaderboardRankItem[]>([]);
  const [leaderboardFilter, setLeaderboardFilter] = useState<'today' | 'week' | 'allTime'>('allTime');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'srs' | 'streak' | 'exam' | 'leaderboard'>('srs');

  const loadData = useCallback(async (force = false) => {
    try {
      if (force) setIsRefreshing(true);
      const [summary, lb] = await Promise.all([
        force ? refreshLearnerAnalytics() : fetchLearnerAnalyticsOverview(),
        fetchLeaderboard(leaderboardFilter)
      ]);

      if (summary) setAnalytics(summary);
      if (lb && lb.rankings) setLeaderboardItems(lb.rankings);
    } catch (err) {
      console.warn('[LearnerTelemetryDashboard] Fetch error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [leaderboardFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Re-fetch leaderboard when filter tab changes
  useEffect(() => {
    async function updateLeaderboard() {
      const lb = await fetchLeaderboard(leaderboardFilter);
      if (lb && lb.rankings) {
        setLeaderboardItems(lb.rankings);
      }
    }
    updateLeaderboard();
  }, [leaderboardFilter]);

  if (isLoading && !analytics) {
    return (
      <div className="rounded-3xl bg-[#0a0a12] border border-stone-800 p-8 text-center text-white shadow-2xl">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-stone-400">Loading Real-Time Learner Telemetry Engine...</p>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const { srsMetrics, streakMetrics, mockExamMetrics, leaderboardMetrics } = analytics;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0a0a12] border border-stone-800 text-white p-6 sm:p-8 shadow-2xl space-y-8 text-left">
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-red-600 via-amber-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-900/40 text-white">
              <Zap className="w-6 h-6 fill-current animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>Learner Analytics & Telemetry Engine</span>
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Materialized
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Real-time SM-2/FSRS retention curves, study pulse streaks, JLPT {analytics.targetLevel} mock telemetry & global XP rankings.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button & Metric Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="analytics-refresh-button"
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700/80 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            title="Recompute and refresh PostgreSQL materialized summary"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isRefreshing ? 'Computing...' : 'Refresh Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (4 Pillars) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {/* KPI 1: SRS Retention */}
        <button
          onClick={() => setActiveTab('srs')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'srs'
              ? 'bg-stone-900/90 border-amber-500/50 shadow-lg shadow-amber-950/20'
              : 'bg-stone-950/60 border-stone-800/80 hover:bg-stone-900/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              SRS Retention (7d)
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded font-bold">
              {srsMetrics.totalCards} Cards
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {srsMetrics.retentionRate7d}%
          </div>
          <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">{srsMetrics.overallAccuracyRate}%</span>
            <span>lifetime accuracy</span>
          </div>
        </button>

        {/* KPI 2: Study Streak */}
        <button
          onClick={() => setActiveTab('streak')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'streak'
              ? 'bg-stone-900/90 border-red-500/50 shadow-lg shadow-red-950/20'
              : 'bg-stone-950/60 border-stone-800/80 hover:bg-stone-900/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-red-500 fill-current animate-bounce" />
              Daily Streak
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-300 rounded font-bold">
              Best: {streakMetrics.longestStreak}d
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {streakMetrics.currentStreak} <span className="text-sm font-medium text-stone-400">days</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            <span className="text-amber-400 font-bold">{streakMetrics.consistencyScorePercent}%</span> 30-day consistency
          </div>
        </button>

        {/* KPI 3: JLPT Mock Exam Readiness */}
        <button
          onClick={() => setActiveTab('exam')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'exam'
              ? 'bg-stone-900/90 border-blue-500/50 shadow-lg shadow-blue-950/20'
              : 'bg-stone-950/60 border-stone-800/80 hover:bg-stone-900/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              JLPT {mockExamMetrics.targetLevel} Readiness
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded font-bold">
              {mockExamMetrics.totalAttempts} Exams
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {mockExamMetrics.readinessScorePercent}%
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            <span className="text-blue-400 font-bold">{mockExamMetrics.highestScaledScore}/180</span> highest scaled score
          </div>
        </button>

        {/* KPI 4: XP Leaderboard Rank */}
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'leaderboard'
              ? 'bg-stone-900/90 border-purple-500/50 shadow-lg shadow-purple-950/20'
              : 'bg-stone-950/60 border-stone-800/80 hover:bg-stone-900/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Global Standing
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded font-bold">
              Top {leaderboardMetrics.topPercentile}%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            #{leaderboardMetrics.allTimeRank} <span className="text-sm font-medium text-stone-400">/ {leaderboardMetrics.totalLearners}</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            <span className="text-purple-400 font-bold">{leaderboardMetrics.currentXp} XP</span> total earned
          </div>
        </button>
      </div>

      {/* Interactive Telemetry Details Section */}
      <div className="relative z-10 bg-stone-950/70 border border-stone-800/80 rounded-2xl p-5 sm:p-6">
        <AnimatePresence mode="wait">
          {/* TAB 1: SRS Retention Curve & Stages */}
          {activeTab === 'srs' && (
            <motion.div
              key="srs-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Daily SRS Retention Accuracy Trend</span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Calculated recall precision over the past 14 days using SuperMemo-2 / FSRS retention dynamics.
                  </p>
                </div>

                {/* Stage Badges */}
                <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                  <span className="px-2 py-1 rounded bg-stone-900 border border-stone-700 text-stone-300">
                    Apprentice: <strong className="text-amber-400">{srsMetrics.masteryBreakdown.apprentice}</strong>
                  </span>
                  <span className="px-2 py-1 rounded bg-stone-900 border border-stone-700 text-stone-300">
                    Guru: <strong className="text-purple-400">{srsMetrics.masteryBreakdown.guru}</strong>
                  </span>
                  <span className="px-2 py-1 rounded bg-stone-900 border border-stone-700 text-stone-300">
                    Master: <strong className="text-blue-400">{srsMetrics.masteryBreakdown.master}</strong>
                  </span>
                  <span className="px-2 py-1 rounded bg-stone-900 border border-stone-700 text-stone-300">
                    Enlightened: <strong className="text-emerald-400">{srsMetrics.masteryBreakdown.enlightened}</strong>
                  </span>
                  <span className="px-2 py-1 rounded bg-stone-900 border border-stone-700 text-stone-300">
                    Burned: <strong className="text-red-400">{srsMetrics.masteryBreakdown.burned}</strong>
                  </span>
                </div>
              </div>

              {/* Retention Area Chart */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={srsMetrics.dailyRetentionTrend}>
                    <defs>
                      <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="date" stroke="#737373" fontSize={11} />
                    <YAxis stroke="#737373" fontSize={11} domain={[50, 100]} unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#171717',
                        borderColor: '#404040',
                        borderRadius: '0.75rem',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="accuracyRate"
                      name="Recall Accuracy Rate (%)"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#retentionGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Metrics Footer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-stone-800">
                <div>
                  <span className="text-stone-400">Average Stability:</span>{' '}
                  <strong className="text-white">{srsMetrics.averageStabilityDays} days</strong>
                </div>
                <div>
                  <span className="text-stone-400">Average Difficulty:</span>{' '}
                  <strong className="text-white">{srsMetrics.averageDifficulty} / 10</strong>
                </div>
                <div>
                  <span className="text-stone-400">Response Speed:</span>{' '}
                  <strong className="text-white">{srsMetrics.averageResponseTimeMs} ms</strong>
                </div>
                <div>
                  <span className="text-stone-400">Due for Review:</span>{' '}
                  <strong className="text-amber-400">{srsMetrics.dueCards} cards</strong>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Study Streaks & Activity Pulse */}
          {activeTab === 'streak' && (
            <motion.div
              key="streak-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-500 fill-current" />
                    <span>Daily Study Minutes & Activity Pulse</span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Tracked learning time across lessons, SRS flashcards, and quizzes over the last 14 days.
                  </p>
                </div>
                <div className="text-xs text-stone-300">
                  Total Logged: <strong className="text-white">{streakMetrics.totalStudyMinutes} minutes</strong>
                  {' '}(Avg: <strong className="text-amber-400">{streakMetrics.averageDailyMinutes}m/day</strong>)
                </div>
              </div>

              {/* Minutes Bar Chart */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={streakMetrics.recentDailyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="date" stroke="#737373" fontSize={11} />
                    <YAxis stroke="#737373" fontSize={11} unit="m" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#171717',
                        borderColor: '#404040',
                        borderRadius: '0.75rem',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="studyMinutes"
                      name="Study Minutes"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Consistency Indicator */}
              <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Monthly Active Habit: {streakMetrics.activeDaysLast30d} of 30 Days</h4>
                    <p className="text-[11px] text-stone-400">
                      Target consistency of 80%+ guarantees steady progression to {analytics.targetLevel} exam readiness.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-amber-400">{streakMetrics.consistencyScorePercent}%</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: JLPT Mock Exam Completion Rates */}
          {activeTab === 'exam' && (
            <motion.div
              key="exam-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span>JLPT {mockExamMetrics.targetLevel} Mock Exam Competency Telemetry</span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Scaled score analytics (0-180 points) & official 3-section passing balance.
                  </p>
                </div>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('mock_exams')}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Launch Full Mock Exam</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Section Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(mockExamMetrics.sectionAverages).map((sec) => (
                  <div
                    key={sec.sectionType}
                    className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-300">{sec.sectionTitle}</span>
                      <span className="text-blue-400 font-bold">{sec.averageScaledScore} / {sec.maxScaledScore}</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.round((sec.averageScaledScore / sec.maxScaledScore) * 100))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <span>Threshold: 19 / 60</span>
                      <span className={sec.averageScaledScore >= 19 ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                        {sec.averageScaledScore >= 19 ? '✓ Passing Standard' : '⚠️ Deficit'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Attempts Log */}
              {mockExamMetrics.recentAttempts.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Recent Official Simulation Attempts
                  </h4>
                  <div className="space-y-2">
                    {mockExamMetrics.recentAttempts.map((att) => (
                      <div
                        key={att.attemptId}
                        className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2 h-2 rounded-full ${att.isPassed ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          <div>
                            <span className="font-bold text-white">{att.title}</span>
                            <span className="text-stone-500 ml-2 font-mono text-[11px]">({att.examCode})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-stone-400">
                            Score: <strong className="text-white">{att.totalScaledScore}</strong> / 180
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            att.letterGrade === 'A'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : att.letterGrade === 'B'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            Grade {att.letterGrade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-stone-900/50 border border-dashed border-stone-800 text-center text-xs text-stone-400">
                  No mock exams recorded yet. Launch your first JLPT {mockExamMetrics.targetLevel} simulation to establish your baseline scaled score.
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: XP Leaderboards */}
          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Global Learner Standings & XP Telemetry</span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Live ranks calculated across all active learners on NIHOMI.COM platform.
                  </p>
                </div>

                {/* Timeframe Filter Pills */}
                <div className="flex items-center bg-stone-900 rounded-xl p-1 border border-stone-800 text-xs">
                  {(['today', 'week', 'allTime'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setLeaderboardFilter(filter)}
                      className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                        leaderboardFilter === filter
                          ? 'bg-amber-500 text-stone-950 shadow'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : 'All-Time'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leaderboard Table List */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {leaderboardItems.map((item) => (
                  <div
                    key={item.userId}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                      item.isCurrentUser
                        ? 'bg-amber-950/30 border-amber-500/50 shadow-md'
                        : 'bg-stone-900/60 border-stone-800/80 hover:bg-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 text-center font-black">
                        {item.rank === 1 ? (
                          <Crown className="w-5 h-5 text-amber-400 mx-auto" />
                        ) : item.rank === 2 ? (
                          <Award className="w-5 h-5 text-slate-300 mx-auto" />
                        ) : item.rank === 3 ? (
                          <Award className="w-5 h-5 text-amber-600 mx-auto" />
                        ) : (
                          <span className="text-stone-400">#{item.rank}</span>
                        )}
                      </div>

                      <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center font-bold text-amber-300 text-[11px]">
                        {item.avatarText}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{item.name}</span>
                          {item.isCurrentUser && (
                            <span className="px-1.5 py-0.2 bg-amber-500 text-stone-950 text-[9px] font-black rounded">
                              YOU
                            </span>
                          )}
                          <span className="text-[10px] text-stone-500">{item.location}</span>
                        </div>
                        <span className="text-[10px] text-amber-400/90 font-medium">
                          {item.badgeTitle} • Level {item.targetLevel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-red-400 text-[11px]">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        {item.streakDays}d
                      </span>
                      <span className="font-mono font-bold text-white text-sm">
                        {item.xp.toLocaleString()} <span className="text-[10px] text-stone-400">XP</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LearnerTelemetryDashboard;
