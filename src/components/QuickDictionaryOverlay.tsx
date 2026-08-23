import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Volume2,
  Bookmark,
  BookmarkCheck,
  X,
  Sparkles,
  Layers,
  ArrowRight,
  BookOpen,
  Check
} from 'lucide-react';
import { speakJapanese } from '../lib/tts.js';

export interface DictionaryEntry {
  id: string;
  kanji: string;
  reading: string;
  romaji: string;
  english: string;
  bangla: string;
  jlpt: string;
  partOfSpeech: string;
  exampleJa?: string;
  exampleEn?: string;
}

const DICTIONARY_DATABASE: DictionaryEntry[] = [
  {
    id: 'dict-1',
    kanji: '日本語',
    reading: 'にほんご',
    romaji: 'nihongo',
    english: 'Japanese language',
    bangla: 'জাপানি ভাষা',
    jlpt: 'N5',
    partOfSpeech: 'Noun',
    exampleJa: '毎日日本語を勉強します。',
    exampleEn: 'I study Japanese every day.'
  },
  {
    id: 'dict-2',
    kanji: '食べる',
    reading: 'たべる',
    romaji: 'taberu',
    english: 'To eat',
    bangla: 'খাওয়া',
    jlpt: 'N5',
    partOfSpeech: 'Verb (Ichidan)',
    exampleJa: 'ラーメンを食べました。',
    exampleEn: 'I ate ramen.'
  },
  {
    id: 'dict-3',
    kanji: '行く',
    reading: 'いく',
    romaji: 'iku',
    english: 'To go',
    bangla: 'যাওয়া',
    jlpt: 'N5',
    partOfSpeech: 'Verb (Godan)',
    exampleJa: '東京へ行きます。',
    exampleEn: 'I will go to Tokyo.'
  },
  {
    id: 'dict-4',
    kanji: '友達',
    reading: 'ともだち',
    romaji: 'tomodachi',
    english: 'Friend',
    bangla: 'বন্ধু',
    jlpt: 'N5',
    partOfSpeech: 'Noun',
    exampleJa: '友達とカフェに行きました。',
    exampleEn: 'I went to a cafe with my friend.'
  },
  {
    id: 'dict-5',
    kanji: '時間',
    reading: 'じかん',
    romaji: 'jikan',
    english: 'Time / Hour',
    bangla: 'সময় / ঘণ্টা',
    jlpt: 'N5',
    partOfSpeech: 'Noun',
    exampleJa: '時間がありません。',
    exampleEn: 'I do not have time.'
  },
  {
    id: 'dict-6',
    kanji: '仕事',
    reading: 'しごと',
    romaji: 'shigoto',
    english: 'Work / Job',
    bangla: 'কাজ / চাকরি',
    jlpt: 'N5',
    partOfSpeech: 'Noun',
    exampleJa: '明日から新しい仕事が始まります。',
    exampleEn: 'A new job starts tomorrow.'
  },
  {
    id: 'dict-7',
    kanji: '先生',
    reading: 'せんせい',
    romaji: 'sensei',
    english: 'Teacher / Instructor',
    bangla: 'শিক্ষক / গুরু',
    jlpt: 'N5',
    partOfSpeech: 'Noun',
    exampleJa: '先生、質問があります。',
    exampleEn: 'Teacher, I have a question.'
  },
  {
    id: 'dict-8',
    kanji: '美味しい',
    reading: 'おいしい',
    romaji: 'oishii',
    english: 'Delicious / Tasty',
    bangla: 'সুস্বাদু / মজাদার',
    jlpt: 'N5',
    partOfSpeech: 'i-Adjective',
    exampleJa: 'この寿司はとても美味しいです。',
    exampleEn: 'This sushi is very delicious.'
  },
  {
    id: 'dict-9',
    kanji: '元気',
    reading: 'げんき',
    romaji: 'genki',
    english: 'Healthy / Energetic / Well',
    bangla: 'সুস্থ / প্রাণবন্ত / ভালো',
    jlpt: 'N5',
    partOfSpeech: 'na-Adjective',
    exampleJa: 'お元気ですか。',
    exampleEn: 'How are you? / Are you well?'
  },
  {
    id: 'dict-10',
    kanji: '電話',
    reading: 'でんわ',
    romaji: 'denwa',
    english: 'Telephone / Phone call',
    bangla: 'টেলিফোন / ফোন কল',
    jlpt: 'N5',
    partOfSpeech: 'Noun',
    exampleJa: 'あとで電話をかけます。',
    exampleEn: 'I will make a phone call later.'
  },
  {
    id: 'dict-11',
    kanji: '面接',
    reading: 'めんせつ',
    romaji: 'mensetsu',
    english: 'Job interview',
    bangla: 'চাকরির ইন্টারভিউ',
    jlpt: 'N4',
    partOfSpeech: 'Noun',
    exampleJa: '来週、東京で面接があります。',
    exampleEn: 'Next week I have an interview in Tokyo.'
  },
  {
    id: 'dict-12',
    kanji: '給料',
    reading: 'きゅうりょう',
    romaji: 'kyuuryou',
    english: 'Salary / Wage',
    bangla: 'বেতন',
    jlpt: 'N4',
    partOfSpeech: 'Noun',
    exampleJa: '毎月25日は給料日です。',
    exampleEn: 'The 25th of every month is payday.'
  },
  {
    id: 'dict-13',
    kanji: '敬語',
    reading: 'けいご',
    romaji: 'keigo',
    english: 'Honorific / Polite Japanese',
    bangla: 'সম্মানসূচক জাপানি ভাষা',
    jlpt: 'N3',
    partOfSpeech: 'Noun',
    exampleJa: '職場で敬語を正しく使います。',
    exampleEn: 'I use honorific language properly in the workplace.'
  },
  {
    id: 'dict-14',
    kanji: '準備',
    reading: 'じゅんび',
    romaji: 'junbi',
    english: 'Preparation / Readiness',
    bangla: 'প্রস্তুতি',
    jlpt: 'N4',
    partOfSpeech: 'Noun / Suru-verb',
    exampleJa: '試験の準備をしっかりしました。',
    exampleEn: 'I thoroughly prepared for the exam.'
  },
  {
    id: 'dict-15',
    kanji: '約束',
    reading: 'やくそく',
    romaji: 'yakusoku',
    english: 'Promise / Appointment',
    bangla: 'প্রতিশ্রুতি / অ্যাপয়েন্টমেন্ট',
    jlpt: 'N4',
    partOfSpeech: 'Noun / Suru-verb',
    exampleJa: '約束の時間を守りましょう。',
    exampleEn: 'Let us keep the appointment time.'
  }
];

interface QuickDictionaryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToFlashcards?: () => void;
}

export const QuickDictionaryOverlay: React.FC<QuickDictionaryOverlayProps> = ({
  isOpen,
  onClose,
  onNavigateToFlashcards
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('nihomi_pinned_vocabulary_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const togglePin = (entry: DictionaryEntry) => {
    setPinnedIds((prev) => {
      const exists = prev.includes(entry.id);
      const next = exists ? prev.filter((id) => id !== entry.id) : [...prev, entry.id];
      try {
        localStorage.setItem('nihomi_pinned_vocabulary_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const filteredEntries = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return DICTIONARY_DATABASE;
    return DICTIONARY_DATABASE.filter(
      (e) =>
        e.kanji.toLowerCase().includes(q) ||
        e.reading.toLowerCase().includes(q) ||
        e.romaji.toLowerCase().includes(q) ||
        e.english.toLowerCase().includes(q) ||
        e.bangla.toLowerCase().includes(q) ||
        e.jlpt.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  useEffect(() => {
    if (filteredEntries.length > 0 && !selectedEntry) {
      setSelectedEntry(filteredEntries[0]);
    }
  }, [filteredEntries, selectedEntry]);

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="quick-dictionary-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden text-stone-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Search Input */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3 bg-stone-50/70 dark:bg-stone-950/40">
          <Search className="w-5 h-5 text-red-600 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Kanji, Kana, Romaji, English, or Bengali (e.g. taberu, 食べる, friend, বেতন)..."
            className="flex-1 bg-transparent text-sm sm:text-base font-serif outline-hidden text-stone-900 dark:text-stone-100 placeholder-stone-400"
            autoFocus
          />
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-[10px] font-mono text-stone-500">
            ESC to close
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split List & Detail View */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden min-h-[380px]">
          {/* Left Column: Results List */}
          <div className="md:col-span-5 border-r border-stone-200 dark:border-stone-800 overflow-y-auto p-3 space-y-1.5 max-h-[480px]">
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              <span>Results ({filteredEntries.length})</span>
              <span>JLPT Reference</span>
            </div>

            {filteredEntries.map((entry) => {
              const isSelected = selectedEntry?.id === entry.id;
              const isPinned = pinnedIds.includes(entry.id);

              return (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`p-3 rounded-2xl cursor-pointer transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-100'
                      : 'hover:bg-stone-100 dark:hover:bg-stone-800/60 border border-transparent'
                  }`}
                >
                  <div className="space-y-0.5 overflow-hidden">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif font-bold text-base text-stone-900 dark:text-white">
                        {entry.kanji}
                      </span>
                      <span className="text-xs text-red-600 dark:text-red-400 font-sans font-medium">
                        {entry.reading}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                      {entry.english} &bull; {entry.bangla}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[10px] font-bold text-stone-600 dark:text-stone-300">
                      {entry.jlpt}
                    </span>
                    {isPinned && <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Card Preview */}
          <div className="md:col-span-7 p-6 overflow-y-auto bg-stone-50/40 dark:bg-stone-950/20 flex flex-col justify-between space-y-6">
            {selectedEntry ? (
              <div className="space-y-6">
                {/* Kanji Hero Card */}
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-bold font-mono">
                          JLPT {selectedEntry.jlpt}
                        </span>
                        <span className="text-xs font-semibold text-stone-400">
                          {selectedEntry.partOfSpeech}
                        </span>
                      </div>
                      <h2 className="text-4xl sm:text-5xl font-bold font-serif text-stone-900 dark:text-white mt-2">
                        {selectedEntry.kanji}
                      </h2>
                      <p className="text-lg text-red-600 dark:text-red-400 font-sans font-medium mt-1">
                        {selectedEntry.reading}{' '}
                        <span className="text-xs text-stone-400 font-mono">({selectedEntry.romaji})</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakJapanese(selectedEntry.kanji)}
                        className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 border border-red-200 dark:border-red-900 transition cursor-pointer"
                        title="উচ্চারণ শুনুন (Listen)"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => togglePin(selectedEntry)}
                        className={`p-3 rounded-2xl border transition cursor-pointer ${
                          pinnedIds.includes(selectedEntry.id)
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                            : 'bg-white dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700 hover:text-amber-600'
                        }`}
                        title="Pin to Flashcards"
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Meanings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        English Meaning
                      </span>
                      <p className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                        {selectedEntry.english}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        বাংলা অর্থ (Bengali)
                      </span>
                      <p className="text-sm font-bold text-red-700 dark:text-red-400 mt-0.5">
                        {selectedEntry.bangla}
                      </p>
                    </div>
                  </div>

                  {/* Example Sentence */}
                  {selectedEntry.exampleJa && (
                    <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          Context Example
                        </span>
                        <button
                          onClick={() => speakJapanese(selectedEntry.exampleJa!)}
                          className="text-stone-400 hover:text-red-600 transition"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100">
                        {selectedEntry.exampleJa}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {selectedEntry.exampleEn}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-stone-400 py-12">
                <BookOpen className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                <p className="text-xs font-semibold">Select a vocabulary item to view full linguistic details.</p>
              </div>
            )}

            {/* Bottom Action Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800 text-xs">
              <span className="text-stone-500 dark:text-stone-400">
                {pinnedIds.length} vocabulary terms pinned to custom study shelf
              </span>
              {onNavigateToFlashcards && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToFlashcards();
                  }}
                  className="inline-flex items-center gap-1.5 font-bold text-red-600 hover:text-red-700 cursor-pointer"
                >
                  <span>Study in Flashcards</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
