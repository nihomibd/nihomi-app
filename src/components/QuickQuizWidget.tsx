import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, CheckCircle2, XCircle, ArrowRight, RefreshCw, Volume2, Flame, Award } from 'lucide-react';
import { speakJapanese } from '../lib/tts';

export const QuickQuizWidget: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(1);
  const [bestStreak, setBestStreak] = useState(1);

  const quizzes = [
    {
      sentenceJa: 'わたし ___ がくせいです。',
      romaji: 'Watashi ___ gakusei desu.',
      meaningBn: 'আমি ছাত্র। (টপিক মার্কার পার্টিকেল নির্বাচন করুন)',
      options: ['は (wa)', 'が (ga)', 'へ (e)', 'を (o)'],
      correctIdx: 0,
      explanationBn: 'বাক্যের মূল বিষয় বা টপিক নির্দেশ করতে は (wa) পার্টিকেল ব্যবহৃত হয়।'
    },
    {
      sentenceJa: 'あした とうきょう ___ 行きます。',
      romaji: 'Ashita Toukyou ___ ikimasu.',
      meaningBn: 'আগামীকাল টোকিও যাব। (দিক/গন্তব্য মার্কার নির্বাচন করুন)',
      options: ['で (de)', 'へ (e)', 'に (ni)', 'と (to)'],
      correctIdx: 1,
      explanationBn: 'যেকোনো স্থানে যাওয়া বা আসার গন্তব্য নির্দেশ করতে へ (e) বা に (ni) ব্যবহৃত হয়, এখানে দিকসূচক হিসেবে へ সঠিক।'
    },
    {
      sentenceJa: 'わたしは はし ___ ごはんを 食べます。',
      romaji: 'Watashi wa hashi ___ gohan o tabemasu.',
      meaningBn: 'আমি চপস্টিক দিয়ে ভাত খাই। (মাধ্যম মার্কার নির্বাচন করুন)',
      options: ['を (o)', 'で (de)', 'に (ni)', 'から (kara)'],
      correctIdx: 1,
      explanationBn: 'খাওয়ার হাতিয়ার, যানবাহন বা কোনো মাধ্যম বোঝাতে で (de) পার্টিকেল বসে।'
    },
    {
      sentenceJa: 'えき ___ ともだち ___ 会いました。',
      romaji: 'Eki ___ tomodachi ___ aimashita.',
      meaningBn: 'স্টেশনে বন্ধুর সাথে দেখা করেছি। (স্থান ও সঙ্গী মার্কার)',
      options: ['で / に (de / ni)', 'に / を (ni / o)', 'へ / で (e / de)', 'から / は (kara / wa)'],
      correctIdx: 0,
      explanationBn: 'দেখা করার স্থান নির্দেশ করতে で এবং যার সাথে দেখা হয় তার পরে に পার্টিকেল বসে (会う এর সাথে に)।'
    },
    {
      sentenceJa: 'これは だれ ___ かばんですか。',
      romaji: 'Kore wa dare ___ kaban desu ka.',
      meaningBn: 'এটি কার ব্যাগ? (মালিকানা মার্কার)',
      options: ['の (no)', 'も (mo)', 'か (ka)', 'よ (yo)'],
      correctIdx: 0,
      explanationBn: 'মালিকানা বা অধিকার প্রকাশ করতে の (no) পার্টিকেল ব্যবহৃত হয়।'
    }
  ];

  const q = quizzes[currentIdx];

  useEffect(() => {
    if (isAnswered) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsAnswered(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIdx, isAnswered]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === q.correctIdx) {
      setStreak(s => {
        const next = s + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(30);
    setCurrentIdx(prev => (prev + 1) % quizzes.length);
  };

  return (
    <div
      className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-white max-w-2xl mx-auto my-8 backdrop-blur-sm"
      id="component-quick-quiz-widget"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-1.5">
              <span>৩০ সেকেন্ডের লাইভ কুইজ ⚡</span>
            </h3>
            <p className="text-xs text-slate-400">ঝটপট সঠিক পার্টিকেল বা শব্দ বেছে নিন</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full font-bold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>{streak} Streak</span>
          </span>
          <div
            className={`w-10 h-10 rounded-full border flex items-center justify-center font-mono font-bold text-sm transition ${
              timeLeft <= 5
                ? 'bg-red-950/80 border-red-500 text-red-400 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-amber-400'
            }`}
          >
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="my-6 p-6 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white tracking-wide font-serif">
              {q.sentenceJa}
            </div>
            <div className="text-xs font-mono text-amber-400/90 mt-1">
              {q.romaji}
            </div>
          </div>
          <button
            type="button"
            onClick={() => speakJapanese(q.sentenceJa.replace('___', ''))}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition cursor-pointer"
            title="বাক্যটি শুনুন"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-slate-300 font-medium bg-slate-900/90 p-3 rounded-xl border border-slate-800/80">
          বাংলা: {q.meaningBn}
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.options.map((opt, idx) => {
          let btnStyle = 'bg-slate-800/90 hover:bg-slate-750 border-slate-700 text-slate-200 hover:border-red-500/50';
          if (isAnswered) {
            if (idx === q.correctIdx) {
              btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
            } else if (selectedOption === idx) {
              btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold';
            } else {
              btnStyle = 'bg-slate-900 border-slate-800 text-slate-600 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`p-4 rounded-2xl border text-center transition font-semibold text-sm cursor-pointer ${btnStyle}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation & Next Button */}
      {isAnswered && (
        <div className="mt-5 p-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-3 animate-in fade-in">
          <div className="text-xs text-slate-200 flex items-start space-x-2.5">
            {selectedOption === q.correctIdx ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <div className="font-bold text-white text-xs">
                {selectedOption === q.correctIdx ? 'সঠিক উত্তর! চমৎকার!' : 'ভুল উত্তর — ব্যাখ্যাটি জেনে নিন:'}
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{q.explanationBn}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-red-600/20 text-sm cursor-pointer"
          >
            <span>পরবর্তী প্রশ্ন &rarr;</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
export default QuickQuizWidget;
