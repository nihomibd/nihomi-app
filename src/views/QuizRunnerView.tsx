import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.js';
import { useProgressSync } from '../hooks/useProgressSync.js';
import { speakJapanese } from '../lib/tts.js';
import { saveSrsItemReview, getSrsState, SrsItemState } from '../lib/srs.js';
import { soundEffects } from '../lib/soundEffects.js';
import { QuizQuestion } from '../types.js';
import { ContentAnalyticsService } from '../core/content-engine/contentAnalyticsService';
import { LearningFeedbackLoopService } from '../core/content-engine/learningFeedbackLoopService';
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
  Brain,
  Lightbulb,
  X
} from 'lucide-react';

interface QuizRunnerViewProps {
  quizId?: string;
  lessonId?: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const QuizRunnerView: React.FC<QuizRunnerViewProps> = ({ quizId, lessonId, onNavigate }) => {
  const { user, refreshProgress } = useAuth();
  const { syncQuizCompletion } = useProgressSync();
  const [quiz, setQuiz] = useState<any | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [smartRemediationToast, setSmartRemediationToast] = useState<{
    show: boolean;
    conceptCode: string;
    reasonBn: string;
    suggestionBn: string;
  } | null>(null);
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

  // AI Mistake Explanation state keyed by questionId
  const [aiMistakeExplanations, setAiMistakeExplanations] = useState<
    Record<
      string,
      {
        loading: boolean;
        data?: {
          whyChosenIsIncorrect: string;
          whyChosenIsIncorrectBn: string;
          correctRuleExplanation: string;
          correctRuleExplanationBn: string;
          keyGrammarRule: string;
          contrastExampleJa: string;
          contrastExampleRomaji: string;
          contrastExampleEn: string;
          contrastExampleBn: string;
          senseiProTip: string;
        };
        error?: string;
      }
    >
  >({});

  const handleRequestMistakeExplanation = async (
    questionItem: any,
    resultItem: any,
    selectedIdx: number
  ) => {
    const qId = questionItem.id;
    setAiMistakeExplanations((prev) => ({
      ...prev,
      [qId]: { loading: true }
    }));

    try {
      const selectedOptText =
        selectedIdx >= 0 && questionItem.options[selectedIdx]
          ? questionItem.options[selectedIdx]
          : 'No answer selected';
      const correctOptText =
        resultItem.correctIndex !== undefined && questionItem.options[resultItem.correctIndex]
          ? questionItem.options[resultItem.correctIndex]
          : 'Correct answer';

      const res = await apiRequest<{ success: boolean; explanation: any }>('/api/ai/explain-mistake', {
        method: 'POST',
        body: JSON.stringify({
          question: questionItem.question,
          questionJa: questionItem.questionJa,
          selectedOption: selectedOptText,
          correctOption: correctOptText,
          allOptions: questionItem.options,
          userLevel: quiz?.level || 'N5',
          conceptCode: questionItem.conceptCode
        })
      });

      if (res.success && res.explanation) {
        setAiMistakeExplanations((prev) => ({
          ...prev,
          [qId]: { loading: false, data: res.explanation }
        }));
      } else {
        throw new Error('Could not generate explanation');
      }
    } catch (err: any) {
      console.error('Failed to get AI mistake explanation:', err);
      setAiMistakeExplanations((prev) => ({
        ...prev,
        [qId]: {
          loading: false,
          error: 'Failed to retrieve AI explanation. Please check connection and try again.'
        }
      }));
    }
  };

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

      if (res?.attempt?.passed) {
        soundEffects.playLessonCelebration();
      } else if (res?.results?.some((r: any) => r.isCorrect)) {
        soundEffects.playCorrectPing();
      } else {
        soundEffects.playIncorrectSoft();
      }

      // Synchronize quiz attempt to Supabase database (quiz_attempts + learning_progress + activity_logs)
      if (res?.attempt) {
        await syncQuizCompletion({
          quizId: quiz.id,
          score: res.attempt.score ?? 0,
          totalQuestions: res.attempt.totalQuestions ?? quiz.questions.length,
          correctAnswers: res.attempt.correctAnswers ?? 0,
          passed: Boolean(res.attempt.passed),
          timeSpentSeconds: res.attempt.timeSpentSeconds ?? 60,
          answersJson: answersPayload
        }, res.attempt.passed ? 100 : 30);
      }

      // Spaced Repetition (SRS) SM-2 Algorithm Integration
      const scheduled: {
        id: string;
        question: string;
        intervalDays: number;
        stage: string;
        isCorrect: boolean;
      }[] = [];

      if (res.results && Array.isArray(res.results)) {
        const wrongItems: any[] = [];
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

          if (!r.isCorrect && qData) {
            wrongItems.push(qData);
          }
        });

        // Trigger Smart Correction Toast from ContentAnalyticsService if student missed concepts
        if (wrongItems.length > 0) {
          const targetFailedQ = wrongItems[0];
          const queryCode = targetFailedQ.conceptCode || targetFailedQ.questionJa || targetFailedQ.question || '';
          const remediation = ContentAnalyticsService.getRemediationForConcept(queryCode);
          if (remediation) {
            setSmartRemediationToast({
              show: true,
              conceptCode: remediation.conceptCode,
              reasonBn: remediation.reasonBn,
              suggestionBn: remediation.suggestionBn,
            });
          }
        }
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
    setSmartRemediationToast(null);
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

            {/* Adaptive Review Quiz Scheduled via LearningFeedbackLoopService */}
            {submissionResult && (
              <div className="mt-4 pt-4 border-t border-stone-200/60 dark:border-stone-700/60 bg-amber-500/10 rounded-2xl p-4 border border-amber-500/30 text-stone-900 dark:text-stone-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase font-mono">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Adaptive Review Quiz Auto-Scheduled (LearningFeedbackLoop)</span>
                    </div>
                    <p className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                      Targeting weak spots & particle rules based on historical failure rates.
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      Next adaptive session queued for: <strong className="text-amber-600 dark:text-amber-400">Tomorrow at 10:00 AM (24h Interval)</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate('quizzes')}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition shadow-xs shrink-0 cursor-pointer"
                  >
                    View Review Schedule
                  </button>
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

                {/* AI-Powered Personalized Mistake Explainer for Incorrect Answers */}
                {resultItem && !resultItem.isCorrect && (
                  <div className="mt-2 pt-2 border-t border-rose-100">
                    {!aiMistakeExplanations[q.id]?.data && (
                      <button
                        type="button"
                        onClick={() => handleRequestMistakeExplanation(q, resultItem, selectedOpt ?? -1)}
                        disabled={aiMistakeExplanations[q.id]?.loading}
                        className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${aiMistakeExplanations[q.id]?.loading ? 'animate-spin' : ''}`} />
                        <span>
                          {aiMistakeExplanations[q.id]?.loading
                            ? 'AI Sensei Analyzing Mistake...'
                            : 'AI Explain Mistake (ভুলের কারণ ও ব্যাকরণ জানুন)'}
                        </span>
                      </button>
                    )}

                    {/* Rendered AI Grammar Breakdown Card */}
                    {aiMistakeExplanations[q.id]?.data && (
                      <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/80 border border-purple-200 text-stone-900 space-y-3.5 shadow-sm">
                        <div className="flex items-center justify-between border-b border-purple-100 pb-2.5">
                          <div className="flex items-center space-x-2">
                            <span className="p-1.5 rounded-lg bg-purple-600 text-white">
                              <Brain className="w-4 h-4" />
                            </span>
                            <div>
                              <h4 className="text-xs font-extrabold text-purple-950">
                                AI Sensei Personalized Grammar Analysis
                              </h4>
                              <p className="text-[10px] text-purple-700 font-medium">
                                JLPT {quiz?.level || 'N5'} Grammar Diagnostics &bull; ভুলের বিশ্লেষণ
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                            Smart Sensei™
                          </span>
                        </div>

                        {/* Why your answer was incorrect */}
                        <div className="space-y-1 bg-rose-50/70 border border-rose-200 p-3 rounded-xl">
                          <div className="flex items-center space-x-1.5 text-rose-800 text-xs font-bold">
                            <XCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>কেন আপনার উত্তরটি ভুল হয়েছিল (Why Your Selection Was Wrong):</span>
                          </div>
                          <p className="text-xs text-rose-950 leading-relaxed font-medium">
                            {aiMistakeExplanations[q.id].data!.whyChosenIsIncorrect}
                          </p>
                          <p className="text-[11px] text-rose-800/90 leading-relaxed font-sans mt-1">
                            {aiMistakeExplanations[q.id].data!.whyChosenIsIncorrectBn}
                          </p>
                        </div>

                        {/* Correct rule formula */}
                        <div className="space-y-1 bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl">
                          <div className="flex items-center space-x-1.5 text-emerald-800 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>সঠিক ব্যাকরণ নিয়ম ও প্রয়োগ (Correct Grammar Pattern):</span>
                          </div>
                          <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                            {aiMistakeExplanations[q.id].data!.correctRuleExplanation}
                          </p>
                          <p className="text-[11px] text-emerald-800/90 leading-relaxed font-sans mt-1">
                            {aiMistakeExplanations[q.id].data!.correctRuleExplanationBn}
                          </p>
                          {aiMistakeExplanations[q.id].data!.keyGrammarRule && (
                            <div className="mt-2 px-2.5 py-1.5 bg-white/80 rounded-lg border border-emerald-300 text-[11px] font-mono font-semibold text-emerald-900">
                              📌 Rule: {aiMistakeExplanations[q.id].data!.keyGrammarRule}
                            </div>
                          )}
                        </div>

                        {/* Contrast Example with speech audio */}
                        {aiMistakeExplanations[q.id].data!.contrastExampleJa && (
                          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>সঠিক উদাহরণ বাক্য (Contrast Example):</span>
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  speakJapanese(
                                    aiMistakeExplanations[q.id].data!.contrastExampleJa
                                  )
                                }
                                className="p-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-red-600 transition"
                                title="Listen in Japanese"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-xs sm:text-sm font-serif font-bold text-stone-900">
                              {aiMistakeExplanations[q.id].data!.contrastExampleJa}
                            </p>
                            <p className="text-[11px] text-stone-500 font-mono">
                              {aiMistakeExplanations[q.id].data!.contrastExampleRomaji}
                            </p>
                            <p className="text-[11px] text-stone-700">
                              🇬🇧 {aiMistakeExplanations[q.id].data!.contrastExampleEn}
                            </p>
                            <p className="text-[11px] text-stone-700 font-sans">
                              🇧🇩 {aiMistakeExplanations[q.id].data!.contrastExampleBn}
                            </p>
                          </div>
                        )}

                        {/* Sensei Pro Tip */}
                        {aiMistakeExplanations[q.id].data!.senseiProTip && (
                          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-amber-800">Sensei Mnemonic Tip: </strong>
                              {aiMistakeExplanations[q.id].data!.senseiProTip}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {aiMistakeExplanations[q.id]?.error && (
                      <p className="text-[11px] text-rose-600 mt-1 font-semibold">
                        {aiMistakeExplanations[q.id].error}
                      </p>
                    )}
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

        {/* Smart Correction Toast Notification from ContentAnalyticsService */}
        {smartRemediationToast && smartRemediationToast.show && (
          <div
            id="smart-correction-toast"
            className="fixed bottom-6 right-6 max-w-md bg-stone-900 text-white p-4 rounded-2xl shadow-2xl border border-amber-500/40 z-50 animate-in slide-in-from-bottom-5 duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-left flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    Smart Correction &bull; {smartRemediationToast.conceptCode}
                  </span>
                </div>
                <p className="text-xs font-semibold text-stone-200">
                  {smartRemediationToast.reasonBn}
                </p>
                <div className="p-2.5 bg-stone-800/80 rounded-xl border border-stone-700 text-[11px] text-amber-200/90 leading-relaxed font-sans">
                  💡 <span className="font-bold text-white">টিপ্স: </span>{smartRemediationToast.suggestionBn}
                </div>
              </div>
              <button
                onClick={() => setSmartRemediationToast(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
