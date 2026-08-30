import React, { useState, useEffect, useMemo } from 'react';
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
  Trophy,
  Compass,
  Zap,
  Flame,
  AlertCircle
} from 'lucide-react';
import { QuizLeaderboard } from '../components/QuizLeaderboard.js';

interface QuizzesViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

interface RecommendedQuizItem {
  quiz: any;
  recommendationReason: string;
  recommendationReasonBn: string;
  tag: string;
  priority: number;
}

export const QuizzesView: React.FC<QuizzesViewProps> = ({ onNavigate }) => {
  const { profile, user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'All'>((profile?.targetLevel as JLPTLevel) || 'All');
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

  // Compute 3 dynamic personalized recommendations
  const recommendedQuizzes = useMemo<RecommendedQuizItem[]>(() => {
    if (!quizzes.length) return [];

    const recommendations: RecommendedQuizItem[] = [];

    quizzes.forEach((quiz) => {
      const attempt = history.find((h) => h.quizId === quiz.id);

      // Case 1: Attempted but scored under 80% (needs reinforcement)
      if (attempt && attempt.score < 80) {
        recommendations.push({
          quiz,
          recommendationReason: `Previous score was ${attempt.score}%. Retesting strengthens particle memory.`,
          recommendationReasonBn: `পূর্বের স্কোর ${attempt.score}% ছিল। পুনরায় পরীক্ষা দিলে দুর্বলতা দূর হবে।`,
          tag: 'Score Reinforcement',
          priority: 100 - attempt.score
        });
      }
      // Case 2: Specific particle or verb quiz not yet attempted
      else if (!attempt && (quiz.title.toLowerCase().includes('particle') || quiz.title.toLowerCase().includes('grammar'))) {
        recommendations.push({
          quiz,
          recommendationReason: 'Core JLPT foundation. Essential for passing the Grammar section.',
          recommendationReasonBn: 'মৌলিক ব্যাকরণ ও পার্টিকেল নিশ্চিত করতে এই টেস্টটি দেওয়া জরুরি।',
          tag: 'High JLPT Impact',
          priority: 70
        });
      }
      // Case 3: Other unattempted quizzes
      else if (!attempt) {
        recommendations.push({
          quiz,
          recommendationReason: 'Fresh untested module to expand your JLPT question coverage.',
          recommendationReasonBn: 'নতুন কুইজ মডিউল যা আপনার পরীক্ষার প্রস্তুতি যাচাই করবে।',
          tag: 'Recommended Module',
          priority: 50
        });
      }
    });

    // Sort by highest priority and return top 3
    return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 3);
  }, [quizzes, history]);

  return (
    <div id="nihomi-quizzes-view" className="min-h-screen bg-[#F8F9FA] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] text-stone-900 dark:text-stone-100 sepia:text-[#433422] py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Bento Hero Header */}
        <div className="bg-white dark:bg-[#12121e] sepia:bg-[#f4e5c3] border border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
              Verified Testing
            </span>
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              JLPT N5-N3 Verified Evaluation Engine & AI Mistake Diagnostics
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 dark:text-white sepia:text-[#382a17]">
              JLPT Quizzes & Mastery Assessments
            </h1>
            <p className="text-sm font-serif text-red-600 dark:text-red-400">
              日本語能力試験 総合確認テスト
            </p>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 sepia:text-[#7a6344] max-w-3xl leading-relaxed">
            Test your grammatical comprehension, particle mastery, vocabulary recognition, and listening intuition. All scores and attempts are permanently persisted to track your readiness.
          </p>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 pt-2">
            {(['All', 'N5', 'N4', 'N3'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-red-600 text-white shadow-red-600/20'
                    : 'bg-stone-50 dark:bg-stone-800 sepia:bg-[#ede0b9] border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                }`}
              >
                {lvl === 'All' ? 'All Quizzes' : `JLPT ${lvl}`}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic 'Recommended for You' Section */}
        {recommendedQuizzes.length > 0 && (
          <section id="quizzes-recommended-section" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-white sepia:text-[#382a17]">
                  Recommended for You
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  AI Targeted
                </span>
              </div>
              <span className="text-xs text-stone-500">Based on your learning history & weak spots</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recommendedQuizzes.map(({ quiz, recommendationReason, recommendationReasonBn, tag }, idx) => {
                const userAttempt = history.find((h) => h.quizId === quiz.id);
                return (
                  <div
                    key={quiz.id}
                    className="relative bg-gradient-to-b from-amber-500/5 via-white to-white dark:from-amber-950/20 dark:via-[#12121e] dark:to-[#12121e] sepia:from-[#ede0b9]/40 sepia:to-[#f4e5c3] border-2 border-amber-300/80 dark:border-amber-700/60 rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-4 group hover:border-amber-400 transition"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          {tag}
                        </span>
                        <span className="text-[11px] font-bold text-red-600 dark:text-red-400">
                          JLPT {quiz.level}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-stone-900 dark:text-white sepia:text-[#382a17]">
                          {quiz.title}
                        </h3>
                        <p className="text-xs text-stone-600 dark:text-stone-300 sepia:text-[#7a6344] mt-1 line-clamp-2 leading-relaxed">
                          {quiz.description}
                        </p>
                      </div>

                      {/* AI Diagnostic Reasoning Callout */}
                      <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200 space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold text-[11px] text-amber-700 dark:text-amber-400">
                          <Zap className="w-3.5 h-3.5" />
                          <span>Why Recommended:</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{recommendationReason}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('quiz-runner', { quizId: quiz.id })}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{userAttempt ? 'Retake & Reinforce' : 'Start Targeted Quiz'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Local Gamified Leaderboard */}
        <section id="quizzes-leaderboard-section">
          <QuizLeaderboard userAttempts={history} />
        </section>

        {/* Quizzes Bento Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-white sepia:text-[#382a17]">
              All Available Quizzes & Tests
            </h2>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              {quizzes.length} modules available
            </span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center bg-white dark:bg-[#12121e] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
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
                    className="bg-white dark:bg-[#12121e] sepia:bg-[#f4e5c3] border border-stone-200 dark:border-stone-800 sepia:border-[#d9c595] hover:border-red-400 dark:hover:border-red-600 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                          JLPT {quiz.level}
                        </span>
                        <span className="text-[11px] text-stone-400 font-semibold">
                          Passing: {quiz.passingScore}%
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-stone-900 dark:text-white sepia:text-[#382a17]">
                          {quiz.title}
                        </h3>
                        <p className="text-xs text-stone-600 dark:text-stone-300 sepia:text-[#7a6344] mt-1 line-clamp-2 leading-relaxed">
                          {quiz.description}
                        </p>
                      </div>

                      <div className="p-3 bg-stone-50 dark:bg-stone-900 sepia:bg-[#ede0b9] rounded-2xl border border-stone-200/80 dark:border-stone-800 text-xs flex items-center justify-between">
                        <span className="text-stone-500 dark:text-stone-400">{quiz.questionCount} Questions</span>
                        {userAttempt ? (
                          <span
                            className={`font-bold flex items-center space-x-1 ${
                              userAttempt.passed ? 'text-emerald-600' : 'text-rose-600'
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
                      className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
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
