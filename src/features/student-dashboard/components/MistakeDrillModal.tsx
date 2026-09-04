import React, { useEffect, useState } from 'react';
import { CheckCircle2, CircleX, Target, X } from 'lucide-react';
import { ReviewMistake } from '../types';

interface DrillQuestion {
  prompt: string;
  promptBangla: string;
  options: string[];
  answer: number;
}

interface MistakeDrillModalProps {
  mistake: ReviewMistake;
  isOpen: boolean;
  onClose: () => void;
  onCleared: (mistakeId: string) => void;
}

const getDrillQuestions = (mistake: ReviewMistake): DrillQuestion[] => {
  if (mistake.pattern.includes('は')) {
    return [
      { prompt: 'わたし ___ 会社員です。', promptBangla: 'নিজের সাধারণ পরিচয় দিতে কোন particle?', options: ['は', 'が', 'に', 'で'], answer: 0 },
      { prompt: 'だれ ___ 来ましたか。', promptBangla: '“কে এসেছে?” নির্দিষ্ট subject-এর জন্য কোনটি?', options: ['は', 'が', 'に', 'で'], answer: 1 },
    ];
  }
  if (mistake.pattern.includes('に')) {
    return [
      { prompt: '図書館 ___ 行きます。', promptBangla: '“লাইব্রেরিতে যাই” বাক্যে গন্তব্যের particle?', options: ['は', 'が', 'に', 'で'], answer: 2 },
      { prompt: '学校 ___ 勉強します。', promptBangla: '“স্কুলে পড়াশোনা করি” বাক্যে কাজের স্থান?', options: ['は', 'が', 'に', 'で'], answer: 3 },
    ];
  }
  if (mistake.pattern.includes('です')) {
    return [
      { prompt: 'わたしは学生 ___ 。', promptBangla: 'বিশেষ্যের ভদ্র বাক্য কীভাবে শেষ হবে?', options: ['です', 'ます', 'でしたい', 'ません'], answer: 0 },
      { prompt: '毎日、日本語を勉強し ___ 。', promptBangla: 'ক্রিয়ার ভদ্র বর্তমান রূপ বেছে নিন।', options: ['です', 'ます', 'でした', 'でしたい'], answer: 1 },
    ];
  }
  return [
    { prompt: `${mistake.patternJapanese || mistake.pattern} — সঠিক উত্তরটি বেছে নিন।`, promptBangla: mistake.hintBn, options: ['সঠিক নিয়ম', 'বিপরীত নিয়ম', 'অন্য একটি নিয়ম', 'কোনোটিই নয়'], answer: 0 },
    { prompt: 'もう一度、正しい答えを選んでください。', promptBangla: 'আগের নিয়মটি মনে করে আবার বেছে নিন।', options: ['সঠিক নিয়ম', 'ভুল নিয়ম', 'শুধু কথ্য রূপ', 'শুধু লিখিত রূপ'], answer: 0 },
  ];
};

const removeMistake = (mistake: ReviewMistake) => {
  try {
    const stored = localStorage.getItem('nihomi_memory_mistakes');
    const mistakes: ReviewMistake[] = stored ? JSON.parse(stored) : [];
    localStorage.setItem(
      'nihomi_memory_mistakes',
      JSON.stringify(mistakes.filter((item) => item.id !== mistake.id && item.pattern !== mistake.pattern)),
    );
  } catch {
    // A missing local record is already equivalent to a cleared mistake.
  }
};

export const MistakeDrillModal: React.FC<MistakeDrillModalProps> = ({
  mistake,
  isOpen,
  onClose,
  onCleared,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const questions = getDrillQuestions(mistake);

  useEffect(() => {
    if (!isOpen) return;
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setIsFinished(false);
  }, [isOpen, mistake.id]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const question = questions[questionIndex];
  const hasAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.answer;

  const handleAnswer = (answerIndex: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(answerIndex);
    if (answerIndex === question.answer) setCorrectAnswers((current) => current + 1);
  };

  const handleNext = () => {
    if (!hasAnswered) return;
    if (questionIndex === questions.length - 1) {
      setIsFinished(true);
      if (correctAnswers + (isCorrect ? 1 : 0) === questions.length) {
        removeMistake(mistake);
        onCleared(mistake.id);
      }
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/60 p-0 sm:items-center sm:p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="w-full max-w-md overflow-y-auto rounded-t-3xl border border-rose-100 bg-white shadow-2xl sm:rounded-3xl" role="dialog" aria-modal="true" aria-labelledby="mistake-drill-title">
        <header className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-700"><Target size={21} aria-hidden="true" /></div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-rose-600">MemoryOS Drill</p>
              <h2 id="mistake-drill-title" className="text-base font-bold text-stone-950">{mistake.pattern}</h2>
            </div>
          </div>
          <button type="button" aria-label="ড্রিল বন্ধ করুন" onClick={onClose} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500"><X size={20} aria-hidden="true" /></button>
        </header>

        {isFinished ? (
          <div className="px-5 py-8 text-center">
            <Target className="mx-auto text-emerald-600" size={42} aria-hidden="true" />
            <h3 className="mt-4 text-xl font-bold text-stone-950">{correctAnswers === questions.length ? 'নিয়মটি পরিষ্কার!' : 'আরও একবার অনুশীলন করুন'}</h3>
            <p className="mt-2 text-sm text-stone-600">স্কোর: {correctAnswers} / {questions.length}</p>
            <p className="mt-2 text-xs font-medium text-stone-500">{correctAnswers === questions.length ? 'MemoryOS থেকে এই ভুলটি সরানো হয়েছে।' : 'ভুলটি MemoryOS-এ রাখা হয়েছে, পরে আবার চেষ্টা করুন।'}</p>
            <button type="button" onClick={onClose} className="mt-6 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400">ফিরে যান</button>
          </div>
        ) : (
          <div className="px-5 pb-6 pt-5">
            <div className="mb-5 flex items-center justify-between text-xs font-bold text-stone-500"><span>Quick Drill</span><span>Question {questionIndex + 1} of {questions.length}</span></div>
            <p className="text-center text-xl font-bold leading-relaxed text-stone-950" lang="ja">{question.prompt}</p>
            <p className="mt-3 text-center text-sm font-medium leading-relaxed text-stone-600">{question.promptBangla}</p>
            <div className="mt-6 space-y-2.5" role="radiogroup" aria-label="ড্রিলের উত্তরের বিকল্প">
              {question.options.map((option, optionIndex) => {
                const isSelected = selectedAnswer === optionIndex;
                const isAnswer = optionIndex === question.answer;
                const style = !hasAnswered ? 'border-stone-200 bg-white hover:border-rose-400 hover:bg-rose-50' : isAnswer ? 'border-emerald-500 bg-emerald-50' : isSelected ? 'border-rose-500 bg-rose-50' : 'border-stone-200 bg-stone-50 text-stone-400';
                return <button key={option} type="button" role="radio" aria-checked={isSelected} disabled={hasAnswered} onClick={() => handleAnswer(optionIndex)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 ${style}`}><span lang="ja">{option}</span>{hasAnswered && isAnswer && <CheckCircle2 size={18} aria-label="সঠিক" />}{hasAnswered && isSelected && !isAnswer && <CircleX size={18} aria-label="ভুল" />}</button>;
              })}
            </div>
            {hasAnswered && <div className={`mt-4 rounded-xl p-3 text-sm font-bold ${isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`} role="status" aria-live="polite">{isCorrect ? 'সঠিক! よくできました。' : `ভুল হয়েছে। সঠিক উত্তর: ${question.options[question.answer]}`}<p className="mt-1 text-xs font-medium text-stone-700">{mistake.hintBn}</p></div>}
            <button type="button" disabled={!hasAnswered} onClick={handleNext} className="mt-5 w-full rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400">{questionIndex === questions.length - 1 ? 'ফলাফল দেখুন' : 'পরের প্রশ্ন'}</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default MistakeDrillModal;
