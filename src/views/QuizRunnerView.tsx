import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.js';
import { speakJapanese } from '../lib/tts.js';
import { saveSrsItemReview, getSrsState, SrsItemState } from '../lib/srs.js';
import { QuizQuestion } from '../types.js';
import {
  Award,
  ArrowLeft,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Calendar,
  Layers,
  Brain
} from 'lucide-react';

interface QuizRunnerViewProps {
  quizId?: string;
  lessonId?: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const QuizRunnerView: React.FC<QuizRunnerViewProps> = ({ quizId, lessonId, onNavigate }) => {
  const { user, refreshProgress } = useAuth();
  const [quiz, setQuiz] = useState<any | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    attempt: any;
    results: any[];
    message: string;
  } | null>(null);
  const [scheduledSrsItems, setScheduledSrsItems] = useState<{
    id: string;
    question: string;
    intervalDays: number;
    stage: string;
    isCorrect: boolean;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadQuizData() {
      setIsLoading(true);
      try {
        let targetQuizId = quizId;
        if (!targetQuizId && lessonId) {
          const lesRes = await apiRequest<{ quizSummary: any }>(`/api/lessons/${lessonId}`);
          targetQuizId = lesRes.quizSummary?.id;
        }

        if (targetQuizId) {
          const res = await apiRequest<{ quiz: any; userPastAttempts: any[] }>(`/api/quizzes/${targetQuizId}`);
          setQuiz(res.quiz);
        }
      } catch (err) {
        console.error('Failed to load quiz:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadQuizData();
  }, [quizId, lessonId]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submissionResult) return; // Prevent change after submit
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    if (!quiz || !user) return;
    setIsSubmitting(true);
    try {
      const answersPayload = quiz.questions.map((q: any) => ({
        questionId: q.id,
        selectedIndex: selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : -1
      }));

      const res = await apiRequest<{
        attempt: any;
        results: any[];
        message: string;
      }>(`/api/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers: answersPayload })
      });

      setSubmissionResult(res);

      // Spaced Repetition (SRS) SM-2 Algorithm Integration
      const scheduled: {
        id: string;
        question: string;
        intervalDays: number;
        stage: string;
        isCorrect: boolean;
      }[] = [];

      if (res.results && Array.isArray(res.results)) {
        res.results.forEach((r: any) => {
          const rating = r.isCorrect ? 'good' : 'again';
          const qData = quiz.questions.find((q: any) => q.id === r.questionId);
          const srsResult = saveSrsItemReview(r.questionId, rating);
          scheduled.push({
            id: r.questionId,
            question: qData?.questionJa || qData?.question || r.questionId,
            intervalDays: srsResult.intervalDays,
            stage: srsResult.stage,
            isCorrect: r.isCorrect
          });
        });
      }
      setScheduledSrsItems(scheduled);

      await refreshProgress();
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmissionResult(null);
    setScheduledSrsItems([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] flex items-center justify-center p-8">
        <div className="text-center space-y-3 bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-stone-500 font-bold">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] flex items-center justify-center p-8">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 max-w-md text-center space-y-4 shadow-sm">
          <p className="text-base font-bold text-stone-800">Quiz not found or not published.</p>
          <button
            onClick={() => onNavigate('quizzes')}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalCount = quiz.questions.length;

  return (
    <div id="nihomi-quiz-runner-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate(quiz.lessonId ? 'lesson' : 'quizzes', { lessonId: quiz.lessonId })}
            className="inline-flex items-center space-x-2 text-xs font-bold text-stone-600 hover:text-red-600 transition-colors bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{quiz.lessonId ? 'Back to Lesson' : 'Back to Quizzes'}</span>
          </button>

          <div className="text-xs font-bold text-stone-600 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm">
            Answered: {answeredCount}/{totalCount}
          </div>
        </div>

        {/* Bento Hero Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
              JLPT {quiz.level}
            </span>
            <span className="text-xs text-stone-500 font-semibold">
              Passing threshold: {quiz.passingScore}%
            </span>
          </div>

          <h1 className="text-2xl font-bold font-serif text-stone-900">{quiz.title}</h1>
          <p className="text-xs sm:text-sm text-stone-600">{quiz.description}</p>
        </div>

        {/* Results Banner if submitted */}
        {submissionResult && (
          <div
            className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
              submissionResult.attempt.passed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  {submissionResult.attempt.passed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600" />
                  )}
                  <h2 className="text-xl font-bold font-serif">
                    {submissionResult.attempt.passed ? 'Quiz Passed! 合格！' : 'Quiz Not Passed (不合格)'}
                  </h2>
                </div>
                <p className="text-xs font-medium">{submissionResult.message}</p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold font-serif">
                  {submissionResult.attempt.score}%
                </div>
                <p className="text-[11px] font-semibold text-stone-500">
                  {submissionResult.attempt.correctCount} of {submissionResult.attempt.totalQuestions} correct
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleRetake}
                className="px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-900 text-xs font-bold border border-stone-300 transition-colors shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>

              <button
                onClick={() => onNavigate('memory-os')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Review in MemoryOS™</span>
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>

            {/* SRS Spaced Repetition Auto-Scheduling Grid */}
            {scheduledSrsItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-stone-200/60 dark:border-stone-700/60 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold flex items-center gap-1.5 text-stone-900">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>MemoryOS™ Spaced Repetition (SRS) Scheduled:</span>
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">SM-2 Algorithm</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {scheduledSrsItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                        item.isCorrect
                          ? 'bg-white/80 border-emerald-300 text-emerald-950'
                          : 'bg-white/90 border-rose-300 text-rose-950 shadow-xs'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="font-bold truncate text-[11px]">{item.question}</p>
                        <p className="text-[10px] text-stone-500 capitalize">
                          {item.stage} &bull; {item.isCorrect ? 'Mastered' : 'Needs Practice'}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold shrink-0 ${
                          item.intervalDays <= 1
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {item.intervalDays <= 1 ? 'Review Tomorrow' : `In ${item.intervalDays} Days`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {quiz.questions.map((q: any, qIdx: number) => {
            const selectedOpt = selectedAnswers[q.id];
            const resultItem = submissionResult?.results?.find((r) => r.questionId === q.id);

            return (
              <div
                key={q.id}
                className={`bg-white border rounded-2xl p-6 shadow-sm space-y-4 transition-all ${
                  resultItem
                    ? resultItem.isCorrect
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                    : 'border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-red-600">Question {qIdx + 1}</span>
                    {q.audioText && (
                      <button
                        onClick={() => speakJapanese(q.audioText || q.questionJa)}
                        className="p-1.5 rounded-lg bg-stone-50 hover:bg-red-50 text-stone-500 hover:text-red-600 border border-stone-200"
                        title="Listen to Japanese prompt"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {resultItem && (
                    <span
                      className={`text-xs font-bold flex items-center space-x-1 ${
                        resultItem.isCorrect ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {resultItem.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {q.questionJa && (
                    <p className="text-base sm:text-lg font-serif font-bold text-stone-900">
                      {q.questionJa}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-stone-700">{q.question}</p>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {q.options.map((opt: string, optIdx: number) => {
                    const isSelected = selectedOpt === optIdx;
                    const isCorrectAnswer = resultItem && resultItem.correctIndex === optIdx;
                    const isWrongSelection = resultItem && isSelected && !resultItem.isCorrect;

                    return (
                      <button
                        key={optIdx}
                        disabled={!!submissionResult}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between ${
                          isCorrectAnswer
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold'
                            : isWrongSelection
                            ? 'bg-rose-100 border-rose-500 text-rose-950 line-through'
                            : isSelected
                            ? 'bg-red-50 border-red-600 text-red-900 shadow-sm'
                            : 'bg-stone-50 border-stone-200 text-stone-800 hover:border-stone-300'
                        }`}
                      >
                        <span>{opt}</span>
                        {isCorrectAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Question Explanation if submitted */}
                {resultItem && resultItem.explanation && (
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 space-y-1">
                    <p className="font-bold text-stone-900">Explanation:</p>
                    <p className="text-[11px] leading-relaxed">{resultItem.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Bar */}
        {!submissionResult && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-500">
              {answeredCount < totalCount
                ? `You have answered ${answeredCount} of ${totalCount} questions.`
                : 'All questions answered! Ready to submit.'}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || answeredCount === 0}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Evaluating...' : 'Submit Quiz'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
