import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Award,
  Layers
} from 'lucide-react';
import { speakJapanese } from '../lib/tts.js';

interface KanjiItem {
  char: string;
  onyomi: string;
  kunyomi: string;
  meaningEn: string;
  meaningBn: string;
  strokes: number;
  jlpt: string;
  examples: { word: string; reading: string; meaning: string }[];
}

const KANJI_BANK: KanjiItem[] = [
  {
    char: '日',
    onyomi: 'ニチ, ジツ (nichi, jitsu)',
    kunyomi: 'ひ, -び, -か (hi, bi, ka)',
    meaningEn: 'Day, Sun, Japan',
    meaningBn: 'দিন, সূর্য, জাপান',
    strokes: 4,
    jlpt: 'N5',
    examples: [
      { word: '日本', reading: 'にほん (nihon)', meaning: 'Japan' },
      { word: '今日', reading: 'きょう (kyou)', meaning: 'Today' }
    ]
  },
  {
    char: '語',
    onyomi: 'ゴ (go)',
    kunyomi: 'かた.る (kataru)',
    meaningEn: 'Language, Word, Speech',
    meaningBn: 'ভাষা, শব্দ, বাক্য',
    strokes: 14,
    jlpt: 'N5',
    examples: [
      { word: '日本語', reading: 'にほんご (nihongo)', meaning: 'Japanese language' },
      { word: '英語', reading: 'えいご (eigo)', meaning: 'English language' }
    ]
  },
  {
    char: '食',
    onyomi: 'ショク, ジキ (shoku, jiki)',
    kunyomi: 'た.べる, く.う (taberu, kuu)',
    meaningEn: 'Eat, Food, Meal',
    meaningBn: 'খাওয়া, খাদ্য, আহার',
    strokes: 9,
    jlpt: 'N5',
    examples: [
      { word: '食べ物', reading: 'たべもの (tabemono)', meaning: 'Food' },
      { word: '食堂', reading: 'しょくどう (shokudou)', meaning: 'Cafeteria' }
    ]
  },
  {
    char: '学',
    onyomi: 'ガク (gaku)',
    kunyomi: 'まな.ぶ (manabu)',
    meaningEn: 'Study, Learn, Science',
    meaningBn: 'পড়াশোনা, শিক্ষা, জ্ঞান',
    strokes: 8,
    jlpt: 'N5',
    examples: [
      { word: '学生', reading: 'がくせい (gakusei)', meaning: 'Student' },
      { word: '大学', reading: 'だいがく (daigaku)', meaning: 'University' }
    ]
  },
  {
    char: '新',
    onyomi: 'シン (shin)',
    kunyomi: 'あたら.しい, あら.た (atarashii, arata)',
    meaningEn: 'New, Fresh',
    meaningBn: 'নতুন, তাজা',
    strokes: 13,
    jlpt: 'N4',
    examples: [
      { word: '新聞', reading: 'しんぶん (shinbun)', meaning: 'Newspaper' },
      { word: '新年', reading: 'しんねん (shinnen)', meaning: 'New Year' }
    ]
  },
  {
    char: '心',
    onyomi: 'シン (shin)',
    kunyomi: 'こころ (kokoro)',
    meaningEn: 'Heart, Mind, Spirit',
    meaningBn: 'হৃদয়, মন, আত্মা',
    strokes: 4,
    jlpt: 'N4',
    examples: [
      { word: '安心', reading: 'あんしん (anshin)', meaning: 'Relief / Peace of mind' },
      { word: '心配', reading: 'しんぱい (shinpai)', meaning: 'Worry / Anxiety' }
    ]
  },
  {
    char: '電',
    onyomi: 'デン (den)',
    kunyomi: '—',
    meaningEn: 'Electricity, Electronic',
    meaningBn: 'বিদ্যুৎ, ইলেকট্রনিক',
    strokes: 13,
    jlpt: 'N5',
    examples: [
      { word: '電車', reading: 'でんしゃ (densha)', meaning: 'Train' },
      { word: '電話', reading: 'でんわ (denwa)', meaning: 'Telephone' }
    ]
  }
];

export const KanjiOfTheDay: React.FC = () => {
  const [kanjiIndex, setKanjiIndex] = useState(() => {
    // Seed by today's date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return dayOfYear % KANJI_BANK.length;
  });

  const [isRevealed, setIsRevealed] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const currentKanji = KANJI_BANK[kanjiIndex];

  const handleNextRandom = () => {
    setIsRevealed(false);
    setKanjiIndex((prev) => (prev + 1) % KANJI_BANK.length);
  };

  const handleTogglePin = () => {
    setIsPinned((prev) => {
      const next = !prev;
      try {
        const raw = localStorage.getItem('nihomi_pinned_vocabulary_v1');
        const list: string[] = raw ? JSON.parse(raw) : [];
        const updated = next
          ? Array.from(new Set([...list, `kanji-${currentKanji.char}`]))
          : list.filter((id) => id !== `kanji-${currentKanji.char}`);
        localStorage.setItem('nihomi_pinned_vocabulary_v1', JSON.stringify(updated));
      } catch {}
      return next;
    });
  };

  return (
    <div id="kanji-of-the-day-card" className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
            Kanji of the Day
          </span>
          <span className="text-xs text-stone-400 font-semibold">&bull; JLPT {currentKanji.jlpt}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleTogglePin}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isPinned
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700 hover:text-amber-600'
            }`}
            title="Pin Kanji to Flashcards"
          >
            {isPinned ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
          <button
            onClick={handleNextRandom}
            className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white transition cursor-pointer"
            title="Next Kanji"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Kanji Display */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center space-x-5">
          <div className="w-20 h-20 rounded-2xl bg-stone-900 dark:bg-stone-950 text-white flex items-center justify-center font-serif text-5xl font-bold shadow-md shadow-stone-900/20">
            {currentKanji.char}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-stone-500">
                {currentKanji.strokes} Strokes
              </span>
              <button
                onClick={() => speakJapanese(currentKanji.char)}
                className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Pronounce"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs font-sans text-stone-600 dark:text-stone-300 font-semibold mt-1">
              On: <span className="font-serif text-stone-900 dark:text-white">{currentKanji.onyomi}</span>
            </p>
            <p className="text-xs font-sans text-stone-600 dark:text-stone-300 font-semibold">
              Kun: <span className="font-serif text-stone-900 dark:text-white">{currentKanji.kunyomi}</span>
            </p>
          </div>
        </div>

        {/* Reveal Button */}
        <button
          onClick={() => setIsRevealed(!isRevealed)}
          className="px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span>{isRevealed ? 'Hide Meaning' : 'See Meaning'}</span>
          {isRevealed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Smooth CSS Transition Container for Revealed Meaning */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isRevealed ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                English
              </span>
              <p className="font-bold text-stone-900 dark:text-white text-sm mt-0.5">
                {currentKanji.meaningEn}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                বাংলা অর্থ (Bengali)
              </span>
              <p className="font-bold text-red-700 dark:text-red-400 text-sm mt-0.5">
                {currentKanji.meaningBn}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-200 dark:border-stone-700 text-xs space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Essential Compounds
            </span>
            <div className="flex flex-wrap gap-2">
              {currentKanji.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5"
                >
                  <span className="font-serif font-bold text-stone-900 dark:text-white">{ex.word}</span>
                  <span className="text-[11px] text-stone-500">({ex.reading})</span>
                  <span className="text-[11px] text-red-600 font-semibold">&bull; {ex.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
