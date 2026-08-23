import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.js';
import { JLPTLevel } from '../types.js';
import {
  Award,
  CheckCircle2,
  XCircle,
  Play,
  ArrowRight,
  Clock,
  HelpCircle,
  Layers,
  Sparkles,
  Trophy
} from 'lucide-react';
import { QuizLeaderboard } from '../components/QuizLeaderboard.js';

interface QuizzesViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const QuizzesView: React.FC<QuizzesViewProps> = ({ onNavigate }) => {
  const { profile, user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'All'>(profile?.targetLevel || 'All');
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadQuizzes() {
      setIsLoading(true);
      try {
        const query = selectedLevel !== 'All' ? `?level=${selectedLevel}` : '';
        const [quizRes, histRes] = await Promise.all([
          apiRequest<{ quizzes: any[] }>(`/api/quizzes${query}`),
          user ? apiRequest<{ attempts: any[] }>('/api/quizzes/attempts/history').catch(() => ({ attempts: [] })) : Promise.resolve({ attempts: [] })
        ]);
        setQuizzes(quizRes.quizzes || []);
        setHistory(histRes.attempts || []);
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadQuizzes();
  }, [selectedLevel, user]);

  return (
    <div id="nihomi-quizzes-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Bento Hero Header */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
              Verified Testing
            </span>
            <span className="text-xs font-semibold text-stone-500">
              JLPT N5-N3 Verified Evaluation Engine
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              JLPT Quizzes & Mastery Assessments
            </h1>
            <p className="text-sm font-serif text-red-600">
              日本語能力試験 総合確認テスト
            </p>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
            Test your grammatical comprehension, particle mastery, vocabulary recognition, and listening intuition. All scores and attempts are permanently persisted to track your readiness.
          </p>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 pt-2">
            {(['All', 'N5', 'N4', 'N3'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-red-600 text-white'
                    : 'bg-stone-50 border border-stone-200 text-stone-700 hover:border-stone-300'
                }`}
              >
                {lvl === 'All' ? 'All Quizzes' : `JLPT ${lvl}`}
              </button>
            ))}
          </div>
        </div>

        {/* Local Gamified Leaderboard */}
        <section id="quizzes-leaderboard-section">
          <QuizLeaderboard userAttempts={history} />
        </section>

        {/* Quizzes Bento Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-serif text-stone-900">Available Quizzes & Tests</h2>
            <span className="text-xs text-stone-500">
              {quizzes.length} modules available
            </span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-sm">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-stone-500 font-bold">Loading quizzes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => {
                const userAttempt = history.find((h) => h.quizId === quiz.id);
                return (
                  <div
                    key={quiz.id}
                    className="bg-white border border-stone-200 hover:border-red-400 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
                          JLPT {quiz.level}
                        </span>
                        <span className="text-[11px] text-stone-400 font-semibold">
                          Passing: {quiz.passingScore}%
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-stone-900">{quiz.title}</h3>
                        <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                          {quiz.description}
                        </p>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs flex items-center justify-between">
                        <span className="text-stone-500">{quiz.questionCount} Questions</span>
                        {userAttempt ? (
                          <span
                            className={`font-bold flex items-center space-x-1 ${
                              userAttempt.passed ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {userAttempt.passed ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            <span>Best: {userAttempt.score}%</span>
                          </span>
                        ) : (
                          <span className="text-stone-400">Not attempted</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('quiz-runner', { quizId: quiz.id })}
                      className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{userAttempt ? 'Retake Quiz' : 'Start Quiz'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
