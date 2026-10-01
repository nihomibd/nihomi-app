import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Volume2,
  Award,
  Crown,
  BookOpen,
  Keyboard,
  HelpCircle,
  Lightbulb,
  Check,
  Flame,
  Zap,
  ChevronRight,
  Play,
  VolumeX,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgressSync } from '../hooks/useProgressSync';
import { getMasterLesson } from '../data/lessons/n5MasterCurriculum';
import { N5MasterLesson, N5QuizItem, N5TypingItem } from '../types/n5Master';
import { FuriganaText, stripFurigana } from '../utils/furigana';
import { speakJapanese, stopJapaneseSpeech } from '../lib/tts';
import { soundEffects } from '../lib/soundEffects';
import { haptic } from '../lib/haptic';

interface LessonPracticeViewProps {
  lessonId?: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

type PracticeStep = 'quiz' | 'typing' | 'summary';

export const LessonPracticeView: React.FC<LessonPracticeViewProps> = ({
  lessonId: propLessonId = 'n5-l1',
  onNavigate
}) => {
  const { user } = useAuth();
  const { syncLessonCompletion } = useProgressSync();

  // Resolve Master Lesson
  const [currentLessonId, setCurrentLessonId] = useState<string>(propLessonId);
  const [lesson, setLesson] = useState<N5MasterLesson | null>(() => getMasterLesson(propLessonId));

  // Audio / Sound FX toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Workflow Step: 'quiz' | 'typing' | 'summary'
  const [activeStep, setActiveStep] = useState<PracticeStep>('quiz');

  // --- MCQ Quiz State ---
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [userQuizAnswers, setUserQuizAnswers] = useState<
    Array<{
      quiz: N5QuizItem;
      selectedOptionIndex: number;
      isCorrect: boolean;
    }>
  >([]);

  // --- Typing Practice State ---
  const [currentTypingIndex, setCurrentTypingIndex] = useState<number>(0);
  const [typingInput, setTypingInput] = useState<string>('');
  const [isTypingSubmitted, setIsTypingSubmitted] = useState<boolean>(false);
  const [isTypingCorrect, setIsTypingCorrect] = useState<boolean>(false);
  const [isHintRevealed, setIsHintRevealed] = useState<boolean>(false);
  const [typingScore, setTypingScore] = useState<number>(0);
  const typingInputRef = useRef<HTMLInputElement>(null);

  // Session Timing
  const [startTime] = useState<number>(() => Date.now());

  // Reload lesson if propLessonId changes
  useEffect(() => {
    setCurrentLessonId(propLessonId);
    const resolved = getMasterLesson(propLessonId);
    setLesson(resolved);

    // Reset drill states
    setActiveStep('quiz');
    setCurrentQuizIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setUserQuizAnswers([]);
    setCurrentTypingIndex(0);
    setTypingInput('');
    setIsTypingSubmitted(false);
    setIsTypingCorrect(false);
    setIsHintRevealed(false);
    setTypingScore(0);
  }, [propLessonId]);

  // Focus typing input when entering typing mode or changing index
  useEffect(() => {
    if (activeStep === 'typing') {
      setTimeout(() => {
        typingInputRef.current?.focus();
      }, 150);
    }
  }, [activeStep, currentTypingIndex]);

  // Fallback if lesson not found
  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#0a0a12] text-stone-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-3xl bg-[#14141e] border border-stone-800">
          <BookOpen className="w-12 h-12 mx-auto text-red-500 opacity-60" />
          <h2 className="text-xl font-bold">পাঠের তথ্য খুঁজে পাওয়া যায়নি</h2>
          <p className="text-sm text-stone-400">
            আইডি: <span className="font-mono text-amber-400">{currentLessonId}</span>
          </p>
          <button
            onClick={() => onNavigate('courses')}
            className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 font-bold text-white text-sm transition-all cursor-pointer shadow-lg shadow-red-600/30"
          >
            পাঠ্যক্রমে ফিরে যান (Return to Courses)
          </button>
        </div>
      </div>
    );
  }

  const meta = lesson.lesson_metadata;
  const quizzes: N5QuizItem[] = lesson.quizzes || [];
  const typingItems: N5TypingItem[] = lesson.typing_practice || [];

  const currentQuiz = quizzes[currentQuizIndex];
  const currentTyping = typingItems[currentTypingIndex];

  // Helper: Play pronunciation of current Japanese phrase
  const handleSpeak = (text: string) => {
    if (!text) return;
    stopJapaneseSpeech();
    speakJapanese(stripFurigana(text));
  };

  // --- Handlers: MCQ Quiz ---
  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionIndex(index);
    if (soundEnabled) soundEffects.playButtonTap();
    haptic.selection();
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedOptionIndex === null || isAnswerSubmitted || !currentQuiz) return;

    const isCorrect = selectedOptionIndex === currentQuiz.correct_index;
    setIsAnswerSubmitted(true);

    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      if (soundEnabled) soundEffects.playCorrectPing();
      haptic.correct();
    } else {
      if (soundEnabled) soundEffects.playIncorrectSoft();
      haptic.incorrect();
    }

    setUserQuizAnswers((prev) => [
      ...prev,
      {
        quiz: currentQuiz,
        selectedOptionIndex,
        isCorrect
      }
    ]);
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex + 1 < quizzes.length) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerSubmitted(false);
      if (soundEnabled) soundEffects.playClickSoft();
    } else {
      // Transition to typing practice or summary
      if (typingItems.length > 0) {
        setActiveStep('typing');
        setCurrentTypingIndex(0);
        setTypingInput('');
        setIsTypingSubmitted(false);
        setIsTypingCorrect(false);
        setIsHintRevealed(false);
        if (soundEnabled) soundEffects.playLevelUp();
      } else {
        handleFinishDrill();
      }
    }
  };

  // --- Handlers: Typing Practice ---
  const handleCheckTyping = () => {
    if (!currentTyping || isTypingSubmitted) return;

    const cleanInput = typingInput.trim().toLowerCase().replace(/[\s\-_]/g, '');
    const cleanTargetRomaji = (currentTyping.romaji_input || '').trim().toLowerCase().replace(/[\s\-_]/g, '');
    const cleanTargetJa = stripFurigana(currentTyping.prompt_ja || '').trim();
    const cleanDisplay = (currentTyping.target_display || '').trim();

    const isMatch =
      cleanInput === cleanTargetRomaji ||
      typingInput.trim() === cleanTargetJa ||
      typingInput.trim() === cleanDisplay;

    setIsTypingSubmitted(true);
    setIsTypingCorrect(isMatch);

    if (isMatch) {
      setTypingScore((prev) => prev + 1);
      if (soundEnabled) soundEffects.playCorrectPing();
      haptic.correct();
    } else {
      if (soundEnabled) soundEffects.playIncorrectSoft();
      haptic.incorrect();
    }
  };

  const handleNextTyping = () => {
    if (currentTypingIndex + 1 < typingItems.length) {
      setCurrentTypingIndex((prev) => prev + 1);
      setTypingInput('');
      setIsTypingSubmitted(false);
      setIsTypingCorrect(false);
      setIsHintRevealed(false);
      if (soundEnabled) soundEffects.playClickSoft();
    } else {
      handleFinishDrill();
    }
  };

  // --- Handlers: Finish Practice & Summary ---
  const handleFinishDrill = () => {
    setActiveStep('summary');
    if (soundEnabled) soundEffects.playLessonCelebration();
    haptic.pass();

    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
    const totalPossible = quizzes.length + typingItems.length;
    const earned = quizScore + (isTypingCorrect ? 1 : 0);
    const percent = totalPossible > 0 ? Math.round((earned / totalPossible) * 100) : 100;

    syncLessonCompletion(currentLessonId, percent, elapsedSeconds, 50).catch((err) =>
      console.warn('Sync completion error:', err)
    );
  };

  const handleRetry = () => {
    setActiveStep('quiz');
    setCurrentQuizIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setUserQuizAnswers([]);
    setCurrentTypingIndex(0);
    setTypingInput('');
    setIsTypingSubmitted(false);
    setIsTypingCorrect(false);
    setIsHintRevealed(false);
    setTypingScore(0);
  };

  // Determine Level badge details
  const levelCode = meta.lesson_id.split('-')[0].toUpperCase();
  const isHighLevel = levelCode === 'N1' || levelCode === 'N2';

  // Overall Score Calculation for Summary
  const totalQuestions = quizzes.length + typingItems.length;
  const totalScore = quizScore + typingScore;
  const scorePercent = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 100;

  return (
    <div className="min-h-screen bg-[#0a0a12] text-stone-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* TOP NAVIGATION / CONTROL BAR */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#0e0e18]/90 backdrop-blur-md border-b border-stone-800/80 px-4 sm:px-6 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Back button & Lesson Identity */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('courses')}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-all cursor-pointer"
              title="পাঠ্যক্রমে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                  {isHighLevel ? <Crown className="w-3 h-3 text-amber-400" /> : <GraduationCap className="w-3 h-3" />}
                  {meta.lesson_id}
                </span>
                <span className="text-[11px] font-medium text-stone-400 hidden sm:inline">
                  {meta.module_name_bn}
                </span>
              </div>
              <h1 className="text-xs sm:text-sm font-bold text-white font-japanese truncate max-w-xs sm:max-w-md">
                <FuriganaText text={meta.title_ja} />
              </h1>
            </div>
          </div>

          {/* Stepper Pill & Audio Toggle */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Steps indicator */}
            <div className="hidden sm:flex items-center bg-stone-900 border border-stone-800 rounded-xl p-1 text-[11px] font-semibold">
              <span
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeStep === 'quiz'
                    ? 'bg-red-600 text-white font-bold shadow-xs'
                    : userQuizAnswers.length > 0
                    ? 'text-emerald-400'
                    : 'text-stone-500'
                }`}
              >
                ১. কুইজ ({quizzes.length})
              </span>
              <span
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeStep === 'typing'
                    ? 'bg-red-600 text-white font-bold shadow-xs'
                    : typingScore > 0
                    ? 'text-emerald-400'
                    : 'text-stone-500'
                }`}
              >
                ২. টাইপিং ({typingItems.length})
              </span>
              <span
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeStep === 'summary' ? 'bg-red-600 text-white font-bold shadow-xs' : 'text-stone-500'
                }`}
              >
                ৩. স্কোর
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-stone-800/80 border-stone-700 text-stone-200'
                  : 'bg-stone-900 border-stone-800 text-stone-500'
              }`}
              title={soundEnabled ? 'সাউন্ড অন' : 'সাউন্ড অফ'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MAIN INTERACTIVE ENGINE VIEWPORT */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-grow max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        {/* ========================================================= */}
        {/* PHASE 1: MCQ QUIZ ENGINE */}
        {/* ========================================================= */}
        {activeStep === 'quiz' && currentQuiz && (
          <div className="space-y-6 animate-fadeIn">
            {/* Progress Bar & Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                <span className="flex items-center gap-1.5 font-bold text-red-400 uppercase tracking-wider">
                  <HelpCircle className="w-3.5 h-3.5" />
                  প্রশ্ন {currentQuizIndex + 1} / {quizzes.length}
                </span>
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  স্কোর: {quizScore}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-red-600 via-rose-500 to-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuizIndex + 1) / quizzes.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#13131e] border border-stone-800/90 shadow-2xl relative overflow-hidden space-y-4">
              <div className="pointer-events-none absolute -right-16 -top-16 w-48 h-48 bg-red-600/10 rounded-full blur-3xl" />

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-stone-800 text-stone-300">
                    JLPT {meta.difficulty} Drill
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-japanese leading-relaxed">
                    <FuriganaText text={currentQuiz.question_ja} />
                  </h2>
                  <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-medium">
                    {currentQuiz.question_bn}
                  </p>
                </div>

                {/* Pronunciation Speaker Button */}
                <button
                  onClick={() => handleSpeak(currentQuiz.question_ja)}
                  className="p-3 rounded-2xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-all cursor-pointer shrink-0 border border-stone-700/60 shadow-sm"
                  title="উচ্চারণ শুনুন"
                >
                  <Volume2 className="w-5 h-5 text-red-400" />
                </button>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                {currentQuiz.options.map((option, optIdx) => {
                  const isSelected = selectedOptionIndex === optIdx;
                  const isCorrectAnswer = optIdx === currentQuiz.correct_index;

                  let cardStyle =
                    'bg-[#191926] border-stone-800 text-stone-200 hover:border-stone-600 hover:bg-[#202030]';

                  if (isAnswerSubmitted) {
                    if (isCorrectAnswer) {
                      cardStyle =
                        'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30';
                    } else if (isSelected) {
                      cardStyle =
                        'bg-red-950/40 border-red-500 text-red-200 ring-2 ring-red-500/30';
                    } else {
                      cardStyle = 'bg-stone-900/40 border-stone-800/60 text-stone-500 opacity-60';
                    }
                  } else if (isSelected) {
                    cardStyle = 'bg-red-950/30 border-red-500 text-white ring-2 ring-red-500/30';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-4 rounded-2xl border text-left text-sm font-japanese transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-stone-800/80 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                          {optIdx + 1}
                        </span>
                        <span className="font-semibold text-base">
                          <FuriganaText text={option} />
                        </span>
                      </div>

                      {isAnswerSubmitted && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Feedback Banner */}
              {isAnswerSubmitted && (
                <div
                  className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-1.5 animate-fadeIn ${
                    selectedOptionIndex === currentQuiz.correct_index
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-red-950/30 border-red-500/40 text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px]">
                    {selectedOptionIndex === currentQuiz.correct_index ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>সঠিক উত্তর! (Correct Answer)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span>ভুল উত্তর। সঠিক উত্তর: {currentQuiz.options[currentQuiz.correct_index]}</span>
                      </>
                    )}
                  </div>
                  <p className="text-stone-300 font-sans text-xs sm:text-sm">
                    {currentQuiz.explanation_bn}
                  </p>
                </div>
              )}

              {/* Action Buttons: Check Answer / Next Question */}
              <div className="pt-2 flex items-center justify-end gap-3">
                {!isAnswerSubmitted ? (
                  <button
                    disabled={selectedOptionIndex === null}
                    onClick={handleSubmitQuizAnswer}
                    className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold text-sm transition-all shadow-lg shadow-red-600/30 cursor-pointer flex items-center gap-2"
                  >
                    <span>উত্তর নিশ্চিত করুন (Submit)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuiz}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-2"
                  >
                    <span>
                      {currentQuizIndex + 1 < quizzes.length
                        ? 'পরবর্তী প্রশ্ন (Next Question)'
                        : typingItems.length > 0
                        ? 'টাইপিং ড্রিল শুরু করুন (Go to Typing)'
                        : 'ফলাফল দেখুন (View Score)'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PHASE 2: TYPING & READING PRACTICE ENGINE */}
        {/* ========================================================= */}
        {activeStep === 'typing' && currentTyping && (
          <div className="space-y-6 animate-fadeIn">
            {/* Progress Bar & Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                <span className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider">
                  <Keyboard className="w-3.5 h-3.5" />
                  টাইপিং ও রিডিং ড্রিল {currentTypingIndex + 1} / {typingItems.length}
                </span>
                <span className="flex items-center gap-1 font-bold text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  সঠিক: {typingScore}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-amber-500 via-rose-500 to-red-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentTypingIndex + 1) / typingItems.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Prompt & Typing Box Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#13131e] border border-stone-800/90 shadow-2xl relative overflow-hidden space-y-6">
              <div className="pointer-events-none absolute -right-16 -top-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />

              {/* Japanese Prompt & Bengali Translation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#181825] border border-stone-800">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
                    লক্ষ্য অভিব্যক্তি (Target Expression)
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold text-white font-japanese tracking-wide">
                    <FuriganaText text={currentTyping.prompt_ja} />
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-rose-400">
                    অর্থ: {currentTyping.meaning_bn}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => handleSpeak(currentTyping.prompt_ja)}
                    className="p-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white transition-all cursor-pointer border border-stone-700/60 shadow-sm"
                    title="উচ্চারণ শুনুন"
                  >
                    <Volume2 className="w-5 h-5 text-amber-400" />
                  </button>

                  <button
                    onClick={() => setIsHintRevealed((prev) => !prev)}
                    className="px-3 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-300 hover:text-white transition-all cursor-pointer border border-stone-700/60 flex items-center gap-1.5"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isHintRevealed ? 'হিন্ট লুকান' : 'রোমাজি হিন্ট'}</span>
                  </button>
                </div>
              </div>

              {/* Hint Bar (If Toggled) */}
              {isHintRevealed && (
                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 font-mono flex items-center justify-between animate-fadeIn">
                  <span>
                    রোমাজি ইনপুট: <strong>{currentTyping.romaji_input}</strong>
                  </span>
                  <span>
                    হিরাগানা রূপ: <strong>{currentTyping.target_display}</strong>
                  </span>
                </div>
              )}

              {/* Input Field */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-stone-400 block font-mono">
                  নিচের ঘরে রোমাজি বা জাপানি হরফে লিখুন (Type Romaji or Japanese):
                </label>

                <div className="relative">
                  <input
                    ref={typingInputRef}
                    type="text"
                    disabled={isTypingSubmitted}
                    value={typingInput}
                    onChange={(e) => setTypingInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (!isTypingSubmitted) {
                          handleCheckTyping();
                        } else {
                          handleNextTyping();
                        }
                      }
                    }}
                    placeholder={`টাইপ করুন: ${currentTyping.romaji_input}`}
                    className={`w-full px-5 py-4 rounded-2xl bg-[#0a0a12] border text-lg font-mono text-white placeholder-stone-600 focus:outline-hidden transition-all ${
                      isTypingSubmitted
                        ? isTypingCorrect
                          ? 'border-emerald-500 bg-emerald-950/20 ring-2 ring-emerald-500/30'
                          : 'border-red-500 bg-red-950/20 ring-2 ring-red-500/30'
                        : 'border-stone-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-stone-500 hidden sm:inline">
                    Enter ↵ চাপুন
                  </span>
                </div>
              </div>

              {/* Result Feedback Banner */}
              {isTypingSubmitted && (
                <div
                  className={`p-4 rounded-2xl border text-sm space-y-1 animate-fadeIn ${
                    isTypingCorrect
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-red-950/30 border-red-500/40 text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                    {isTypingCorrect ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>চমৎকার! সঠিক টাইপিং। (Perfect Match!)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span>সঠিক রোমাজি হলো: {currentTyping.romaji_input}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-stone-300 font-mono">
                    প্রদর্শিত রূপ: {currentTyping.target_display} ({currentTyping.meaning_bn})
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                {!isTypingSubmitted ? (
                  <button
                    disabled={!typingInput.trim()}
                    onClick={handleCheckTyping}
                    className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-2"
                  >
                    <span>যাচাই করুন (Verify)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextTyping}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-2"
                  >
                    <span>
                      {currentTypingIndex + 1 < typingItems.length
                        ? 'পরবর্তী শব্দ (Next Word)'
                        : 'সার্বিক ফলাফল দেখুন (View Results)'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PHASE 3: SCORE SUMMARY SCREEN */}
        {/* ========================================================= */}
        {activeStep === 'summary' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-8 sm:p-10 rounded-3xl bg-linear-to-b from-[#181828] via-[#12121c] to-[#0c0c14] border border-stone-800 shadow-2xl relative overflow-hidden text-center space-y-6">
              <div className="pointer-events-none absolute -right-20 -top-20 w-64 h-64 bg-red-600/15 rounded-full blur-3xl" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl" />

              {/* Badge Icon */}
              <div className="relative inline-flex items-center justify-center">
                <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-red-600 via-rose-500 to-amber-500 p-0.5 shadow-xl shadow-red-600/20">
                  <div className="w-full h-full bg-[#0e0e18] rounded-[22px] flex items-center justify-center">
                    {scorePercent >= 80 ? (
                      <Crown className="w-10 h-10 text-amber-400" />
                    ) : (
                      <Award className="w-10 h-10 text-rose-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Heading & Congratulations */}
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>অনুশীলন সম্পন্ন • DRILL COMPLETED</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {meta.lesson_id}: {scorePercent >= 80 ? 'অসাধারণ দক্ষতা!' : 'অনুশীলন সম্পন্ন হয়েছে!'}
                </h2>
                <p className="text-stone-400 text-sm max-w-lg mx-auto">
                  {meta.module_name_bn} মডিউলের এই পাঠে আপনি কুইজ এবং টাইপিং ড্রিল সম্পন্ন করেছেন।
                </p>
              </div>

              {/* Metrics Score Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
                <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 text-center">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                    সার্বিক স্কোর
                  </span>
                  <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
                    {scorePercent}%
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 text-center">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                    MCQ কুইজ
                  </span>
                  <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                    {quizScore}/{quizzes.length}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 text-center">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                    টাইপিং ড্রিল
                  </span>
                  <span className="text-2xl font-black text-rose-400 font-mono mt-1 block">
                    {typingScore}/{typingItems.length}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 text-center">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                    অর্জিত XP
                  </span>
                  <span className="text-2xl font-black text-amber-300 font-mono mt-1 block flex items-center justify-center gap-1">
                    <Zap className="w-4 h-4 fill-amber-300" />
                    +50
                  </span>
                </div>
              </div>

              {/* Review of Quiz Answers Accordion */}
              {userQuizAnswers.length > 0 && (
                <div className="text-left space-y-3 pt-4 border-t border-stone-800/80 max-w-2xl mx-auto">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">
                    প্রশ্নের সঠিক পর্যালোচনা (Answer Breakdown)
                  </h4>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {userQuizAnswers.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                          item.isCorrect
                            ? 'bg-emerald-950/20 border-emerald-500/30'
                            : 'bg-red-950/20 border-red-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between font-japanese text-sm font-bold text-white">
                          <span>
                            {idx + 1}. <FuriganaText text={item.quiz.question_ja} />
                          </span>
                          {item.isCorrect ? (
                            <span className="text-emerald-400 font-sans text-xs font-bold flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" /> সঠিক
                            </span>
                          ) : (
                            <span className="text-red-400 font-sans text-xs font-bold flex items-center gap-1 shrink-0">
                              <XCircle className="w-3.5 h-3.5" /> ভুল
                            </span>
                          )}
                        </div>
                        <p className="text-stone-400 text-[11px]">{item.quiz.explanation_bn}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call-to-Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleRetry}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 border border-stone-700"
                >
                  <RotateCcw className="w-4 h-4 text-stone-400" />
                  <span>পুনরায় অনুশীলন করুন (Retry)</span>
                </button>

                <button
                  onClick={() => onNavigate('courses')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-red-600/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>পাঠ সমাপ্ত করুন ও পাঠ্যক্রমে ফিরুন (Finish & Return)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonPracticeView;
