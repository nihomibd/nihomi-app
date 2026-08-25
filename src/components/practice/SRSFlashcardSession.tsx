import React, { useState } from 'react';
import {
  X,
  Volume2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Headphones,
  Mic,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Brain
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';

interface SRSFlashcardSessionProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FlashcardItem {
  id: string;
  kanji: string;
  hiragana: string;
  romaji: string;
  english: string;
  bengali: string;
  exampleJa: string;
  exampleEn: string;
}

const SRS_DECK: FlashcardItem[] = [
  {
    id: 'srs-1',
    kanji: '勉強',
    hiragana: 'べんきょう',
    romaji: 'benkyou',
    english: 'Study / Diligence',
    bengali: 'পড়াশোনা বা অধ্যয়ন',
    exampleJa: '毎日日本語を勉強します。',
    exampleEn: 'I study Japanese every day.'
  },
  {
    id: 'srs-2',
    kanji: '空港',
    hiragana: 'くうこう',
    romaji: 'kuukou',
    english: 'Airport',
    bengali: 'বিমানবন্দর (যেমন: নারিতা বা হানেদা)',
    exampleJa: '成田空港に到着しました。',
    exampleEn: 'Arrived at Narita Airport.'
  },
  {
    id: 'srs-3',
    kanji: '時間',
    hiragana: 'じかん',
    romaji: 'jikan',
    english: 'Time / Hours',
    bengali: 'সময় বা ঘণ্টার ব্যাপ্তি',
    exampleJa: '日本語の授業は何時ですか？',
    exampleEn: 'What time is the Japanese class?'
  },
  {
    id: 'srs-4',
    kanji: '約束',
    hiragana: 'やくそく',
    romaji: 'yakusoku',
    english: 'Promise / Appointment',
    bengali: 'প্রতিশ্রুতি বা পূর্বনির্ধারিত অ্যাপয়েন্টমেন্ট',
    exampleJa: '先生と面接の約束があります。',
    exampleEn: 'I have an interview appointment with the teacher.'
  }
];

export const SRSFlashcardSession: React.FC<SRSFlashcardSessionProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [isListening, setIsListening] = useState(false);

  if (!isOpen) return null;

  const currentCard = SRS_DECK[currentIndex] || SRS_DECK[0];

  const handleNext = (remembered: boolean) => {
    setIsFlipped(false);
    setCompletedCount((prev) => prev + 1);
    if (currentIndex < SRS_DECK.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleSpeak = (text: string) => {
    speakJapanese(text);
  };

  return (
    <div
      id="srs-flashcard-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="srs-flashcard-dialog"
        className="bg-white dark:bg-stone-900 sepia:bg-[#fbf0d9] border border-slate-200 dark:border-stone-800 sepia:border-[#d9cbaf] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-stone-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-rose-950/60 border border-red-200 dark:border-rose-800 text-red-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                SRS Memory OS & Voice Coach
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-stone-400">
                Card {currentIndex + 1} of {SRS_DECK.length} • Adaptive Spaced Repetition
              </p>
            </div>
          </div>
          <button
            id="close-srs-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Flip Card Area */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="cursor-pointer select-none min-h-[220px] rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/60 dark:from-stone-800/80 dark:to-stone-900 sepia:from-[#f5e9d2] sepia:to-[#ebdcc3] border-2 border-slate-200 dark:border-stone-700 sepia:border-[#d9cbaf] p-6 flex flex-col items-center justify-center text-center transition-all hover:border-red-400 dark:hover:border-rose-500 shadow-inner"
        >
          {!isFlipped ? (
            <div className="space-y-3">
              <div className="text-5xl font-black text-slate-900 dark:text-white tracking-wider font-japanese">
                {currentCard.kanji}
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-stone-400">
                {currentCard.hiragana} ({currentCard.romaji})
              </div>
              <div className="text-xs text-red-600 dark:text-rose-400 font-semibold pt-2">
                Click to flip & reveal meaning
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {currentCard.english}
              </div>
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 inline-block">
                {currentCard.bengali}
              </div>
              <div className="pt-2 text-xs text-slate-600 dark:text-stone-300 italic border-t border-slate-200 dark:border-stone-700">
                "{currentCard.exampleJa}"
              </div>
            </div>
          )}
        </div>

        {/* Audio & Voice Practice Buttons */}
        <div className="flex items-center justify-center space-x-3">
          <button
            type="button"
            onClick={() => handleSpeak(currentCard.kanji)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold border border-slate-200 dark:border-stone-700 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-red-600 dark:text-rose-400" />
            <span>Native Pronunciation</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsListening(true);
              setTimeout(() => {
                setIsListening(false);
                handleSpeak(currentCard.exampleJa);
              }, 1200);
            }}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isListening
                ? 'bg-red-50 text-red-600 border-red-300 animate-pulse'
                : 'bg-slate-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300 border-slate-200 dark:border-stone-700'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-red-600 dark:text-rose-400" />
            <span>{isListening ? 'Listening...' : 'Echo Test'}</span>
          </button>
        </div>

        {/* Rating Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-stone-800">
          <button
            type="button"
            onClick={() => handleNext(false)}
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-slate-700 dark:text-stone-300 font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <ThumbsDown className="w-3.5 h-3.5 text-amber-500" />
            <span>Need Review</span>
          </button>

          <button
            type="button"
            onClick={() => handleNext(true)}
            className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 dark:bg-rose-600 dark:hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Mastered (Next)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
