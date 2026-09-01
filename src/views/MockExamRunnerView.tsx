import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Send,
  RotateCcw,
  Sparkles,
  BookOpen,
  Headphones,
  FileText,
  Volume2,
  HelpCircle,
  BarChart3,
  Flame,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { MockExam, MockExamSection, MockExamQuestion, MockExamAttempt, MockExamSectionType } from '../types';
import { fetchMockExamById, submitMockExamAttempt } from '../services/mockExamApi';
import { TokyoListeningAudioPlayer } from '../components/mockExam/TokyoListeningAudioPlayer';
import { SentenceStarComposer } from '../components/mockExam/SentenceStarComposer';
import { MockExamOfficialCertificate } from '../components/mockExam/MockExamOfficialCertificate';
import { stopJapaneseSpeech } from '../lib/tts';

interface MockExamRunnerViewProps {
  examId: string;
  onNavigate: (view: string, params?: any) => void;
}

export const MockExamRunnerView: React.FC<MockExamRunnerViewProps> = ({ examId, onNavigate }) => {
  const [exam, setExam] = useState<MockExam | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [stage, setStage] = useState<'intro' | 'running' | 'submitting' | 'review'>('intro');

  // Exam Progress State
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0); // index inside current section

  // User answers map: { [questionId: string]: selectedOptionIndex }
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<Set<string>>(new Set());

  // Timing state
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState<number>(0); // in seconds
  const [sectionTimesSpent, setSectionTimesSpent] = useState<Record<MockExamSectionType, number>>({
    vocabulary: 0,
    grammar_reading: 0,
    listening: 0
  });
  const [totalTimeSpentSeconds, setTotalTimeSpentSeconds] = useState<number>(0);

  // Result state
  const [submissionResult, setSubmissionResult] = useState<{
    attempt: MockExamAttempt;
    reviewSections: any[];
    message: string;
  } | null>(null);
  const [reviewActiveTab, setReviewActiveTab] = useState<'score' | 'answers' | 'certificate'>('score');

  const timerIntervalRef = useRef<any>(null);

  // 1. Fetch Exam on load
  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetchMockExamById(examId);
      if (res && res.mockExam) {
        setExam(res.mockExam);
        if (res.mockExam.sections.length > 0) {
          setSectionTimeRemaining(res.mockExam.sections[0].timeLimitMinutes * 60);
        }
      }
      setLoading(false);
    }
    load();

    return () => {
      stopJapaneseSpeech();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [examId]);

  // 2. Section Countdown & Elapsed Timer
  useEffect(() => {
    if (stage !== 'running') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTotalTimeSpentSeconds((prev) => prev + 1);

      setSectionTimeRemaining((prevRemaining) => {
        if (prevRemaining <= 1) {
          // Time expired for this section!
          handleSectionTimeExpired();
          return 0;
        }
        return prevRemaining - 1;
      });

      if (exam) {
        const activeSec = exam.sections[currentSectionIndex];
        if (activeSec) {
          setSectionTimesSpent((prev) => ({
            ...prev,
            [activeSec.sectionType]: (prev[activeSec.sectionType] || 0) + 1
          }));
        }
      }
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [stage, currentSectionIndex, exam]);

  const handleStartSimulation = () => {
    if (!exam || exam.sections.length === 0) return;
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setSectionTimeRemaining(exam.sections[0].timeLimitMinutes * 60);
    setStage('running');
  };

  const handleSectionTimeExpired = () => {
    if (!exam) return;
    if (currentSectionIndex < exam.sections.length - 1) {
      // Auto advance to next section
      const nextSecIdx = currentSectionIndex + 1;
      setCurrentSectionIndex(nextSecIdx);
      setCurrentQuestionIndex(0);
      setSectionTimeRemaining(exam.sections[nextSecIdx].timeLimitMinutes * 60);
    } else {
      // Last section finished -> auto submit
      handleSubmitExam();
    }
  };

  const handleNextSectionManually = () => {
    if (!exam) return;
    if (currentSectionIndex < exam.sections.length - 1) {
      const nextSecIdx = currentSectionIndex + 1;
      setCurrentSectionIndex(nextSecIdx);
      setCurrentQuestionIndex(0);
      setSectionTimeRemaining(exam.sections[nextSecIdx].timeLimitMinutes * 60);
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const toggleBookmark = (qId: string) => {
    setBookmarkedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleSubmitExam = async () => {
    if (!exam) return;
    setStage('submitting');
    stopJapaneseSpeech();

    // Prepare payload
    const allQuestions: { questionId: string; sectionType: MockExamSectionType }[] = [];
    exam.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        allQuestions.push({ questionId: q.id, sectionType: sec.sectionType });
      });
    });

    const answersPayload = allQuestions.map((q) => ({
      questionId: q.questionId,
      sectionType: q.sectionType,
      selectedOptionIndex: userAnswers[q.questionId] !== undefined ? userAnswers[q.questionId] : -1,
      timeSpentSeconds: 15
    }));

    try {
      const result = await submitMockExamAttempt(exam.id, {
        answers: answersPayload,
        sectionTimesSpentSeconds: sectionTimesSpent,
        totalTimeSpentSeconds: Math.max(10, totalTimeSpentSeconds)
      });

      setSubmissionResult(result);
      setStage('review');
    } catch (err: any) {
      console.error('Failed to submit exam:', err);
      alert('Submission error: ' + (err.message || 'Network error'));
      setStage('running');
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || !exam) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl border-2 border-rose-500 border-t-transparent animate-spin mb-4" />
        <h3 className="text-lg font-bold text-slate-100">Loading Official JLPT Mock Engine...</h3>
        <p className="text-xs text-slate-400 mt-1">Preparing timed sections, audio drills & scoring matrix</p>
      </div>
    );
  }

  const currentSection: MockExamSection = exam.sections[currentSectionIndex] || exam.sections[0];
  const currentQuestion: MockExamQuestion | undefined = currentSection.questions[currentQuestionIndex];
  const totalQuestionsInSection = currentSection.questions.length;
  const isTimeCritical = sectionTimeRemaining <= 180; // 3 minutes warning

  // =========================================================================
  // STAGE: INTRO / INSTRUCTIONS
  // =========================================================================
  if (stage === 'intro') {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
        <button
          type="button"
          onClick={() => onNavigate('quizzes')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Quizzes & Exams
        </button>

        <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-b from-slate-900/90 via-[#0d0d18] to-[#0a0a14] p-6 md:p-10 shadow-2xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  JLPT {exam.level} OFFICIAL SIMULATION
                </span>
                <span className="font-mono text-xs text-slate-500">{exam.examCode}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white font-japanese">
                {exam.titleJa}
              </h1>
              <h2 className="text-base text-slate-300 font-medium mt-1">
                {exam.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Pass Threshold</span>
                <span className="text-xl font-bold text-amber-400 font-mono">{exam.overallPassingScore} / 180</span>
              </div>
            </div>
          </div>

          {/* Core Examination Rules & Scaled Scoring Notice */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-8 text-amber-200">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs md:text-sm">
                <h4 className="font-bold text-amber-300">
                  Official Sectional Scaled Scoring Rules (得点区分別基準点)
                </h4>
                <p className="text-amber-200/90 leading-relaxed">
                  পাস করার জন্য আপনাকে মোট <strong>{exam.overallPassingScore}/১৮০</strong> পয়েন্ট পাওয়ার পাশাপাশি প্রতি সেকশনে (Vocabulary, Grammar/Reading, Listening) ন্যূনতম <strong>১৯/৬০</strong> পয়েন্ট অর্জন করতে হবে। কোনো একটি সেকশনে ১৯ এর কম পেলে সামগ্রিক পরীক্ষা অনুত্তীর্ণ বিবেচিত হবে।
                </p>
              </div>
            </div>
          </div>

          {/* Section Breakdown cards */}
          <div className="space-y-3 mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Exam Sections & Time Allocations (試験構成)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {exam.sections.map((sec, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-300 font-japanese">
                        Part {idx + 1}: {sec.sectionType === 'vocabulary' ? '文字・語彙' : sec.sectionType === 'grammar_reading' ? '文法・読解' : '聴解'}
                      </span>
                      <span className="text-xs font-mono font-bold text-rose-400">{sec.timeLimitMinutes} min</span>
                    </div>
                    <h4 className="text-xs text-slate-300 font-medium mb-1">{sec.title}</h4>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{sec.questions.length} Questions</span>
                    <span className="text-amber-400 font-semibold">Min. 19 / 60</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Exam CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Full screen simulation with Tokyo speech synthesis and official certificates.</span>
            </div>

            <button
              type="button"
              onClick={handleStartSimulation}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Begin Official Exam Simulation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STAGE: RUNNING SIMULATION
  // =========================================================================
  if (stage === 'running' && currentQuestion) {
    const isAnswered = userAnswers[currentQuestion.id] !== undefined;
    const isBookmarked = bookmarkedQuestionIds.has(currentQuestion.id);

    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        {/* Top Floating Control Bar */}
        <div className="sticky top-16 z-30 mb-6 rounded-2xl border border-slate-800 bg-[#0d0d18]/95 backdrop-blur-md p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
          {/* Section Indicator */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold uppercase">
              Part {currentSectionIndex + 1} of {exam.sections.length}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-japanese">
                {currentSection.titleJa}
              </h3>
              <p className="text-xs text-slate-400">
                Question {currentQuestionIndex + 1} of {totalQuestionsInSection}
              </p>
            </div>
          </div>

          {/* Section Timer Countdown */}
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-sm transition-all ${
                isTimeCritical
                  ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 animate-pulse ring-2 ring-rose-500/30'
                  : 'bg-slate-900 border-slate-700 text-slate-200'
              }`}
            >
              <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-400' : 'text-amber-400'}`} />
              <span>{formatTime(sectionTimeRemaining)}</span>
              {isTimeCritical && <span className="text-[10px] uppercase font-bold text-rose-400">Hurry</span>}
            </div>

            {/* Finish Section / Submit Button */}
            {currentSectionIndex < exam.sections.length - 1 ? (
              <button
                type="button"
                onClick={handleNextSectionManually}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                Next Section ({currentSectionIndex + 2}/{exam.sections.length})
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitExam}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-rose-600/20"
              >
                <Send className="w-3.5 h-3.5" /> Submit Exam (提出)
              </button>
            )}
          </div>
        </div>

        {/* Section Tabs Switcher */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {exam.sections.map((sec, idx) => {
            const isActive = idx === currentSectionIndex;
            const answeredInSec = sec.questions.filter((q) => userAnswers[q.id] !== undefined).length;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setCurrentSectionIndex(idx);
                  setCurrentQuestionIndex(0);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>{sec.titleJa}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActive ? 'bg-rose-700 text-rose-100' : 'bg-slate-800 text-slate-400'}`}>
                  {answeredInSec}/{sec.questions.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Split Layout: Question View + Fast Navigator */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Display Column (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-[#0d0d18] p-6 md:p-8 shadow-xl">
              {/* Question Header & Type */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-extrabold flex items-center justify-center text-sm font-mono">
                    Q{currentQuestion.questionNumber}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {currentQuestion.type.replace(/_/g, ' ')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleBookmark(currentQuestion.id)}
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                    isBookmarked
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                  <span>{isBookmarked ? 'Bookmarked' : 'Review Later'}</span>
                </button>
              </div>

              {/* Question Instruction Text */}
              <p className="text-xs sm:text-sm text-slate-300 font-medium mb-4">
                {currentQuestion.questionText}
              </p>

              {/* Reading Passage if present */}
              {currentQuestion.readingPassage && (
                <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-5 mb-6 text-slate-200">
                  {currentQuestion.readingPassage.title && (
                    <h4 className="text-sm font-bold text-blue-300 mb-3 pb-2 border-b border-blue-500/20 font-japanese">
                      {currentQuestion.readingPassage.title}
                    </h4>
                  )}
                  <p className="font-japanese text-sm sm:text-base leading-relaxed whitespace-pre-line text-slate-100 mb-3">
                    {currentQuestion.readingPassage.passageJa}
                  </p>
                  {currentQuestion.readingPassage.contextNote && (
                    <p className="text-xs text-blue-300/80 italic">
                      💡 {currentQuestion.readingPassage.contextNote}
                    </p>
                  )}
                </div>
              )}

              {/* Tokyo Audio Listening Drill Player if present */}
              {currentQuestion.audioScript && (
                <TokyoListeningAudioPlayer audioScript={currentQuestion.audioScript} />
              )}

              {/* Star Sentence Composition interactive tool if present */}
              {currentQuestion.scrambledParts && currentQuestion.scrambledParts.length === 4 ? (
                <SentenceStarComposer
                  questionTextJa={currentQuestion.questionTextJa}
                  scrambledParts={currentQuestion.scrambledParts}
                  starPositionIndex={currentQuestion.starPositionIndex ?? 2}
                  selectedOptionIndex={userAnswers[currentQuestion.id] ?? -1}
                  onSelectOption={(idx) => handleSelectOption(currentQuestion.id, idx)}
                />
              ) : (
                /* Standard Japanese Question Prompts */
                currentQuestion.questionTextJa && (
                  <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 mb-6 text-center">
                    <p className="font-japanese text-lg sm:text-xl font-bold text-slate-100">
                      {currentQuestion.questionTextJa}
                    </p>
                    {currentQuestion.furigana && (
                      <p className="text-xs text-slate-400 mt-1 font-japanese">
                        {currentQuestion.furigana}
                      </p>
                    )}
                  </div>
                )
              )}

              {/* 4 Options Selection */}
              <div className="space-y-3 mt-6">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentQuestion.id] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                      className={`w-full p-4 rounded-2xl text-left border font-japanese font-medium text-sm sm:text-base transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-gradient-to-r from-rose-600/20 to-amber-600/20 border-rose-500 text-white shadow-lg ring-1 ring-rose-500'
                          : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`w-7 h-7 rounded-xl font-mono text-xs font-extrabold flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                              : 'bg-slate-900 text-slate-400 border-slate-800 group-hover:border-slate-700'
                          }`}
                        >
                          {optIdx + 1}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next Question Navigation Buttons */}
              <div className="flex items-center justify-between gap-3 pt-8 mt-8 border-t border-slate-800">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <span className="text-xs text-slate-500 font-mono">
                  {currentQuestionIndex + 1} / {totalQuestionsInSection}
                </span>

                <button
                  type="button"
                  disabled={currentQuestionIndex >= totalQuestionsInSection - 1}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestionsInSection - 1, prev + 1))}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Navigator Palette (1 col) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-[#0d0d18] p-5 shadow-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                <span>Section Navigator</span>
                <span className="text-[10px] text-rose-400 font-mono">{totalQuestionsInSection} Qs</span>
              </h4>

              {/* Grid of Question buttons */}
              <div className="grid grid-cols-5 gap-2">
                {currentSection.questions.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIndex;
                  const isQAnswered = userAnswers[q.id] !== undefined;
                  const isQBookmarked = bookmarkedQuestionIds.has(q.id);

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`relative h-9 rounded-xl font-mono text-xs font-bold border transition-all flex items-center justify-center ${
                        isCurrent
                          ? 'ring-2 ring-rose-500 border-rose-500 bg-rose-600/20 text-white'
                          : isQAnswered
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {isQBookmarked && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0d0d18]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-slate-950 border border-slate-800" />
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Bookmarked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STAGE: SUBMITTING SPINNER
  // =========================================================================
  if (stage === 'submitting') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl border-4 border-rose-500 border-t-transparent animate-spin mb-4" />
        <h3 className="text-xl font-bold text-white">Grading Official Simulation...</h3>
        <p className="text-xs text-slate-400 mt-2">
          Computing Sectional Scaled Scores (19/60 thresholds) & generating diagnostic review...
        </p>
      </div>
    );
  }

  // =========================================================================
  // STAGE: POST-EXAM DIAGNOSTIC REVIEW & SCALED SCORECARD
  // =========================================================================
  if (stage === 'review' && submissionResult) {
    const { attempt, reviewSections, message } = submissionResult;

    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
        {/* Top Summary Banner */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0f0f20] to-[#0a0a14] p-6 md:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6 mb-8 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  JLPT {attempt.level} SCORECARD
                </span>
                <span className="font-mono text-xs text-slate-500">{attempt.examCode}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                {attempt.isPassed ? '🎉 Official Simulation Passed (合格)' : 'Simulation Completed (不合格)'}
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1">{message}</p>
            </div>

            {/* Big Total Scaled Score */}
            <div className="flex flex-col items-center p-5 rounded-2xl bg-slate-950 border border-slate-800 min-w-[180px]">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Total Scaled Score</span>
              <div className="text-3xl md:text-4xl font-black text-white font-mono my-1">
                {attempt.totalScaledScore} <span className="text-sm font-normal text-slate-500">/ 180</span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                attempt.isPassed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {attempt.isPassed ? `PASSED (Grade ${attempt.letterGrade})` : 'FAILED'}
              </span>
            </div>
          </div>

          {/* If failed, explain sectional threshold failure */}
          {attempt.failReason && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 mb-6 text-rose-300 text-xs md:text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-rose-200">Official Pass Threshold Notice</h4>
                <p className="mt-0.5">{attempt.failReason}</p>
              </div>
            </div>
          )}

          {/* 3 Section Scaled Score Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {Object.values(attempt.sectionScores).map((secScore, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all ${
                  secScore.isSectionPassed
                    ? 'bg-slate-950/80 border-slate-800'
                    : 'bg-rose-950/20 border-rose-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">{secScore.sectionTitle}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      secScore.isSectionPassed
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {secScore.isSectionPassed ? 'Pass Met' : 'Under 19'}
                  </span>
                </div>

                <div className="text-2xl font-bold font-mono text-white mb-1">
                  {secScore.scaledScore} <span className="text-xs font-normal text-slate-500">/ 60</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>Accuracy: {secScore.rawScorePercent}%</span>
                  <span>{secScore.correctQuestions}/{secScore.totalQuestions} Qs</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Diagnostic Strengths & Weaknesses (Bengali) */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Student Diagnostic Summary & Action Plan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200">
                <span className="text-[11px] font-bold text-emerald-400 uppercase block mb-1">দক্ষতা (Strengths)</span>
                <p>{attempt.strengthSummaryBn}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200">
                <span className="text-[11px] font-bold text-rose-400 uppercase block mb-1">দুর্বলতা (Focus Area)</span>
                <p>{attempt.weaknessSummaryBn}</p>
              </div>
            </div>

            {attempt.actionableStudyPlanBn && attempt.actionableStudyPlanBn.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                <span className="font-bold block mb-1 text-amber-300">পরবর্তী উন্নতির জন্য করণীয়:</span>
                <ul className="list-disc list-inside space-y-1">
                  {attempt.actionableStudyPlanBn.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tab Switcher: Review Answers vs Official Certificate */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setReviewActiveTab('score')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              reviewActiveTab === 'score'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            Question by Question Review ({attempt.userAnswers.length} Qs)
          </button>

          {attempt.isPassed && (
            <button
              type="button"
              onClick={() => setReviewActiveTab('certificate')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                reviewActiveTab === 'certificate'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Official Digital Certificate</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigate('ghost-mode')}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-bold transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            <span>Drill Mistakes in MemoryOS™ Ghost Mode</span>
          </button>
        </div>

        {/* Certificate View */}
        {reviewActiveTab === 'certificate' && attempt.isPassed && (
          <MockExamOfficialCertificate attempt={attempt} />
        )}

        {/* Detailed Question Review List */}
        {reviewActiveTab === 'score' && (
          <div className="space-y-6">
            {reviewSections.map((sec: any) => (
              <div key={sec.id} className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                  {sec.title}
                </h3>

                <div className="space-y-4">
                  {sec.questions.map((q: any) => {
                    return (
                      <div
                        key={q.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          q.isCorrect
                            ? 'bg-slate-950/70 border-emerald-500/30'
                            : 'bg-slate-950/70 border-rose-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-400">Q{q.questionNumber}</span>
                            <span className="text-xs font-bold uppercase text-slate-500">{q.type}</span>
                          </span>

                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                              q.isCorrect
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {q.isCorrect ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3.5 h-3.5" /> Incorrect
                              </>
                            )}
                          </span>
                        </div>

                        {q.questionTextJa && (
                          <p className="font-japanese text-base font-bold text-slate-100 mb-3">
                            {q.questionTextJa}
                          </p>
                        )}

                        {/* Options breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                          {q.options.map((opt: string, optIdx: number) => {
                            const isUserChoice = q.selectedOptionIndex === optIdx;
                            const isCorrectChoice = q.correctOptionIndex === optIdx;

                            return (
                              <div
                                key={optIdx}
                                className={`p-3 rounded-xl border text-xs font-japanese flex items-center justify-between ${
                                  isCorrectChoice
                                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200 font-bold'
                                    : isUserChoice
                                    ? 'bg-rose-500/15 border-rose-500 text-rose-200'
                                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                                }`}
                              >
                                <span>{optIdx + 1}. {opt}</span>
                                {isCorrectChoice && <span className="text-[10px] text-emerald-400 font-bold">Correct</span>}
                                {isUserChoice && !isCorrectChoice && <span className="text-[10px] text-rose-400 font-bold">Your Choice</span>}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation Box */}
                        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                          {q.explanationJa && (
                            <p className="font-japanese text-slate-300 font-medium">{q.explanationJa}</p>
                          )}
                          {q.explanationBn && (
                            <p className="text-amber-300/90">{q.explanationBn}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={() => onNavigate('quizzes')}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Return to Exam Center
          </button>

          <button
            type="button"
            onClick={handleStartSimulation}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <RotateCcw className="w-4 h-4" /> Retake Simulation
          </button>
        </div>
      </div>
    );
  }

  return null;
};
