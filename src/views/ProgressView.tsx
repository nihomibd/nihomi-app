import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { apiRequest } from '../lib/api.js';
import {
  BarChart3,
  Flame,
  Clock,
  Zap,
  CheckCircle2,
  Award,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface ProgressViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ onNavigate }) => {
  const { user, profile, progress } = useAuth();
  const [statsData, setStatsData] = useState<any | null>(null);
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      try {
        const [progRes, histRes] = await Promise.all([
          apiRequest<{ stats: any; profile: any; progress: any }>('/api/progress'),
          apiRequest<{ attempts: any[] }>('/api/quizzes/attempts/history').catch(() => ({ attempts: [] }))
        ]);
        setStatsData(progRes);
        setQuizHistory(histRes.attempts || []);
      } catch (err) {
        console.error('Failed to load progress data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const streak = progress?.currentStreak || 1;
  const longestStreak = progress?.longestStreak || streak;
  const totalMinutes = progress?.totalStudyMinutes || 0;
  const completedLessons = progress?.completedLessonIds?.length || 0;
  const xp = progress?.experiencePoints || 0;
  const targetLevel = profile?.targetLevel || 'N5';

  return (
    <div id="nihomi-progress-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Bento Hero Header */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
              Learning Analytics
            </span>
            <span className="text-xs text-stone-500 font-semibold">
              Real-time Database Progress Tracking
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
            {profile?.displayName || 'Learner'}'s Japanese Mastery
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            Track your continuous study momentum, verified quiz accuracy, JLPT level mastery, and historical milestones.
          </p>
        </div>

        {/* 4 Bento Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-1 hover:border-amber-400 transition-colors">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-bold uppercase">Study Streak</span>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-3xl font-bold text-stone-900 font-serif">
              {streak} <span className="text-xs font-sans font-normal text-stone-500">days</span>
            </p>
            <p className="text-[11px] text-stone-500">Longest: {longestStreak} consecutive days</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-1 hover:border-emerald-400 transition-colors">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-bold uppercase">Completed Lessons</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-stone-900 font-serif">
              {completedLessons} <span className="text-xs font-sans font-normal text-stone-500">lessons</span>
            </p>
            <p className="text-[11px] text-stone-500">Persisted in database</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-1 hover:border-blue-400 transition-colors">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-bold uppercase">Total Study Time</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-stone-900 font-serif">
              {totalMinutes} <span className="text-xs font-sans font-normal text-stone-500">mins</span>
            </p>
            <p className="text-[11px] text-stone-500">Goal: {profile?.dailyGoalMinutes || 20}m/day</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-1 hover:border-red-400 transition-colors">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-bold uppercase">Experience (XP)</span>
              <Zap className="w-4 h-4 text-red-600 fill-red-600" />
            </div>
            <p className="text-3xl font-bold text-stone-900 font-serif">
              {xp} <span className="text-xs font-sans font-normal text-stone-500">XP</span>
            </p>
            <p className="text-[11px] text-stone-500">Earned from study & quizzes</p>
          </div>
        </div>

        {/* JLPT Pathway Bento Box */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
            JLPT Level Trajectory & Progress
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* N5 */}
            <div className={`p-5 rounded-2xl border ${targetLevel === 'N5' ? 'bg-red-50/50 border-red-500' : 'bg-stone-50 border-stone-200'} space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                  JLPT N5
                </span>
                {targetLevel === 'N5' && (
                  <span className="text-[10px] uppercase font-bold text-red-600">Active Target</span>
                )}
              </div>
              <p className="text-sm font-bold text-stone-900">Foundations & Basic Daily Life</p>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (completedLessons / 3) * 100)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-stone-500">{completedLessons} lessons mastered</p>
            </div>

            {/* N4 */}
            <div className={`p-5 rounded-2xl border ${targetLevel === 'N4' ? 'bg-red-50/50 border-red-500' : 'bg-stone-50 border-stone-200'} space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                  JLPT N4
                </span>
                {targetLevel === 'N4' && (
                  <span className="text-[10px] uppercase font-bold text-red-600">Active Target</span>
                )}
              </div>
              <p className="text-sm font-bold text-stone-900">Elementary Mastery & Expressions</p>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: targetLevel === 'N4' ? '25%' : '0%' }}
                ></div>
              </div>
              <p className="text-[11px] text-stone-500">Agile complex forms & favors</p>
            </div>

            {/* N3 */}
            <div className={`p-5 rounded-2xl border ${targetLevel === 'N3' ? 'bg-red-50/50 border-red-500' : 'bg-stone-50 border-stone-200'} space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                  JLPT N3
                </span>
                {targetLevel === 'N3' && (
                  <span className="text-[10px] uppercase font-bold text-red-600">Active Target</span>
                )}
              </div>
              <p className="text-sm font-bold text-stone-900">Intermediate Fluency & Business</p>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: targetLevel === 'N3' ? '15%' : '0%' }}
                ></div>
              </div>
              <p className="text-[11px] text-stone-500">Workplace nuance & newspaper readings</p>
            </div>
          </div>
        </div>

        {/* Quiz History Logs Bento Box */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
              Verified Quiz History Logs ({quizHistory.length})
            </h2>
            <button
              onClick={() => onNavigate('quizzes')}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Browse All Quizzes &rarr;
            </button>
          </div>

          {quizHistory.length === 0 ? (
            <div className="p-8 text-center text-stone-400 space-y-2">
              <Award className="w-8 h-8 mx-auto text-stone-300" />
              <p className="text-xs">No quiz attempts yet. Start by taking an assessment!</p>
              <button
                onClick={() => onNavigate('quizzes')}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all"
              >
                Open Quizzes
              </button>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {quizHistory.map((att) => (
                <div
                  key={att.id}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-stone-900">{att.quizTitle || 'JLPT Quiz'}</p>
                    <p className="text-[11px] text-stone-400">
                      {new Date(att.createdAt).toLocaleDateString()} at{' '}
                      {new Date(att.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-stone-600 font-medium">
                      {att.correctCount}/{att.totalQuestions} ({att.score}%)
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                        att.passed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {att.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
