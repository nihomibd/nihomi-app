import React, { useEffect, useState } from 'react';
import { CheckCircle2, CircleX, Coins, Flame, Trophy, X } from 'lucide-react';
import { ReviewMistake } from '../types';

interface DailyChallengeQuestion {
  id: string;
  category: ReviewMistake['category'];
  categoryLabel: string;
  prompt: string;
  promptBangla: string;
  options: string[];
  answer: number;
  hintBangla: string;
  mistakePattern: string;
  patternJapanese: string;
}

interface DailyChallengeModalProps {
  isOpen: boolean;
  xpReward: number;
  coinReward: number;
  onComplete?: () => void;
  onClose: () => void;
}

const QUESTIONS: DailyChallengeQuestion[] = [
  {
    id: 'particle-wa',
    category: 'particle',
    categoryLabel: 'Particles',
    prompt: 'わたし ___ 学生です。',
    promptBangla: '“আমি একজন ছাত্র।” বাক্যে কোন particle হবে?',
    options: ['は', 'が', 'に', 'で'],
    answer: 0,
    hintBangla: 'সাধারণ বিষয় বা topic বোঝাতে は ব্যবহৃত হয়।',
    mistakePattern: 'は vs が',
    patternJapanese: 'わたしは vs わたしが',
  },
  {
    id: 'particle-de',
    category: 'particle',
    categoryLabel: 'Particles',
    prompt: '学校 ___ 日本語を勉強します。',
    promptBangla: '“স্কুলে জাপানি পড়ি।” কাজটি কোথায় হচ্ছে?',
    options: ['は', 'が', 'に', 'で'],
    answer: 3,
    hintBangla: 'কোনো কাজ করার স্থান বোঝাতে で ব্যবহৃত হয়।',
    mistakePattern: 'に vs で',
    patternJapanese: '学校に vs 学校で',
  },
  {
    id: 'vocabulary-water',
    category: 'vocabulary',
    categoryLabel: 'Vocabulary',
    prompt: '「みず」の意味は何ですか。',
    promptBangla: 'みず শব্দটির অর্থ কী?',
    options: ['ভাত', 'পানি', 'চা', 'দুধ'],
    answer: 1,
    hintBangla: 'みず (水) মানে পানি।',
    mistakePattern: 'みず (水)',
    patternJapanese: 'みず',
  },
  {
    id: 'greeting',
    category: 'politeness',
    categoryLabel: 'Greetings',
    prompt: 'সকালে দেখা হলে কোন অভিবাদনটি বলবেন?',
    promptBangla: 'সকালের শুভেচ্ছার সঠিক জাপানি রূপ বেছে নিন।',
    options: ['こんばんは', 'おやすみなさい', 'おはようございます', 'さようなら'],
    answer: 2,
    hintBangla: 'সকালে ভদ্রভাবে বলা হয় おはようございます।',
    mistakePattern: 'সকালের অভিবাদন',
    patternJapanese: 'おはようございます',
  },
  {
    id: 'kanji-yama',
    category: 'vocabulary',
    categoryLabel: 'Basic Kanji',
    prompt: '「山」の読み方は何ですか。',
    promptBangla: '山 কাঞ্জিটির সঠিক পড়া কোনটি?',
    options: ['かわ (kawa)', 'やま (yama)', 'そら (sora)', 'うみ (umi)'],
    answer: 1,
    hintBangla: '山 মানে পাহাড় এবং এর N5 পড়া やま (yama)।',
    mistakePattern: '山 (やま)',
    patternJapanese: '山の読み方',
  },
];

const saveMistake = (question: DailyChallengeQuestion) => {
  const mistake: ReviewMistake = {
    id: `challenge-${question.id}`,
    pattern: question.mistakePattern,
    patternJapanese: question.patternJapanese,
    category: question.category,
    missedCount: 1,
    lastMissed: 'আজ',
    hintBn: question.hintBangla,
  };

  try {
    const stored = localStorage.getItem('nihomi_memory_mistakes');
    const mistakes: ReviewMistake[] = stored ? JSON.parse(stored) : [];
    const existing = mistakes.find((item) => item.id === mistake.id || item.pattern === mistake.pattern);
    const updatedMistakes = existing
      ? mistakes.map((item) => item.id === existing.id
        ? { ...item, missedCount: item.missedCount + 1, lastMissed: mistake.lastMissed, hintBn: mistake.hintBn }
        : item)
      : [mistake, ...mistakes];
    localStorage.setItem('nihomi_memory_mistakes', JSON.stringify(updatedMistakes));
  } catch {
    localStorage.setItem('nihomi_memory_mistakes', JSON.stringify([mistake]));
  }
};

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  xpReward,
  coinReward,
  onComplete,
  onClose,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setIsFinished(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const question = QUESTIONS[questionIndex];
  const hasAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.answer;
  const progress = ((questionIndex + (hasAnswered ? 1 : 0)) / QUESTIONS.length) * 100;

  const handleAnswer = (answerIndex: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(answerIndex);
    if (answerIndex === question.answer) {
      setCorrectAnswers((current) => current + 1);
    } else {
      saveMistake(question);
    }
  };

  const handleNext = () => {
    if (!hasAnswered) return;
    if (questionIndex === QUESTIONS.length - 1) {
      setIsFinished(true);
      onComplete?.();
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/65 p-0 sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="daily-challenge-modal-title"
        aria-modal="true"
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-amber-200 bg-[#fffdf7] shadow-2xl sm:rounded-3xl"
        role="dialog"
      >
        <div className="sticky top-0 z-10 border-b border-amber-100 bg-[#fffdf7]/95 px-5 pb-4 pt-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-700">N5 今日の挑戦</p>
              <h2 id="daily-challenge-modal-title" className="mt-1 text-xl font-bold tracking-tight text-stone-950">
                N5 Daily Challenge
              </h2>
              <p className="mt-1 text-xs font-medium text-stone-500">৫টি সহজ প্রশ্নে আজকের অনুশীলন</p>
            </div>
            <button
              type="button"
              aria-label="চ্যালেঞ্জ বন্ধ করুন"
              onClick={onClose}
              className="rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {!isFinished && (
            <div className="mt-4" aria-label={`Question ${questionIndex + 1} of ${QUESTIONS.length}`}>
              <div className="mb-2 flex items-center justify-between text-xs font-bold text-stone-600">
                <span>Question {questionIndex + 1} of {QUESTIONS.length}</span>
                <span>{correctAnswers} সঠিক</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-amber-100">
                <div className="h-full rounded-full bg-amber-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        {isFinished ? (
          <div className="px-5 pb-7 pt-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Trophy size={32} aria-hidden="true" />
            </div>
            <p className="mt-5 text-sm font-bold text-amber-700">チャレンジ完了!</p>
            <h3 className="mt-1 text-2xl font-bold text-stone-950">আজকের চ্যালেঞ্জ সম্পন্ন!</h3>
            <p className="mt-2 text-sm text-stone-600">আপনার N5 অনুশীলন আজ আরও এক ধাপ এগিয়ে গেল।</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                <Flame className="mx-auto text-rose-600" size={22} aria-hidden="true" />
                <p className="mt-2 text-lg font-bold text-rose-700">+{xpReward} XP</p>
                <p className="text-[11px] font-semibold text-rose-600">অভিজ্ঞতা</p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <Coins className="mx-auto text-amber-700" size={22} aria-hidden="true" />
                <p className="mt-2 text-lg font-bold text-amber-800">+{coinReward} Coins</p>
                <p className="text-[11px] font-semibold text-amber-700">Nihomi Coins</p>
              </div>
            </div>
            <p className="mt-5 text-xs font-semibold text-stone-500">স্কোর: {correctAnswers} / {QUESTIONS.length}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
            >
              ড্যাশবোর্ডে ফিরে যান
            </button>
          </div>
        ) : (
          <div className="px-5 pb-7 pt-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold text-stone-600">{question.categoryLabel}</span>
              <span className="text-[11px] font-semibold text-stone-400">N5 Beginner</span>
            </div>
            <p className="text-center text-2xl font-bold leading-relaxed text-stone-950" lang="ja">{question.prompt}</p>
            <p className="mt-3 text-center text-sm font-medium leading-relaxed text-stone-600">{question.promptBangla}</p>

            <div className="mt-6 space-y-2.5" role="radiogroup" aria-label="উত্তরের বিকল্প">
              {question.options.map((option, optionIndex) => {
                const isSelected = selectedAnswer === optionIndex;
                const isAnswer = optionIndex === question.answer;
                const optionClass = !hasAnswered
                  ? 'border-stone-200 bg-white hover:border-amber-400 hover:bg-amber-50'
                  : isAnswer
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : isSelected
                      ? 'border-rose-500 bg-rose-50 text-rose-900'
                      : 'border-stone-200 bg-stone-50 text-stone-400';
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={hasAnswered}
                    onClick={() => handleAnswer(optionIndex)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:cursor-default ${optionClass}`}
                  >
                    <span lang="ja">{option}</span>
                    {hasAnswered && isAnswer && <CheckCircle2 size={19} aria-label="সঠিক উত্তর" />}
                    {hasAnswered && isSelected && !isAnswer && <CircleX size={19} aria-label="ভুল উত্তর" />}
                  </button>
                );
              })}
            </div>

            {hasAnswered && (
              <div className={`mt-4 rounded-xl border p-3 ${isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`} role="status" aria-live="polite">
                <p className={`text-sm font-bold ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {isCorrect ? 'সঠিক! よくできました。' : `ভুল হয়েছে। সঠিক উত্তর: ${question.options[question.answer]}`}
                </p>
                <p className="mt-1 text-xs font-medium leading-relaxed text-stone-700">{question.hintBangla}</p>
              </div>
            )}

            <button
              type="button"
              disabled={!hasAnswered}
              onClick={handleNext}
              className="mt-5 w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-stone-950 transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
            >
              {questionIndex === QUESTIONS.length - 1 ? 'ফলাফল দেখুন' : 'পরের প্রশ্ন'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default DailyChallengeModal;
