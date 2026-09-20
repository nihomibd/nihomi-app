import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Volume2,
  BookOpen,
  Award,
  Search,
  CheckCircle2,
  Filter,
  PenTool,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Info,
  Layers,
  ChevronRight,
  HelpCircle,
  X
} from 'lucide-react';
import {
  KanaCharacter,
  KanaType,
  KanaSubType,
  HIRAGANA_SEION,
  KATAKANA_SEION,
  DAKUON_HANDAKUON_KANA,
  YOON_KANA,
  ALL_KANA,
  getMasteredKanaList,
  toggleMasteredKana
} from '../data/kanaData';
import { StrokeOrderGuide } from '../components/kana/StrokeOrderGuide';
import { KanaDrawingCanvas } from '../components/kana/KanaDrawingCanvas';
import { speakJapanese } from '../lib/tts';
import { retentionEngine } from '../lib/retentionEngine';

const ROWS_ORDER = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n'] as const;
const ROW_LABELS_BN: Record<string, string> = {
  a: 'আ-সারি (あ行)',
  ka: 'কা-সারি (か行)',
  sa: 'সা-সারি (さ行)',
  ta: 'তা-সারি (た行)',
  na: 'না-সারি (な行)',
  ha: 'হা-সারি (は行)',
  ma: 'মা-সারি (ま行)',
  ya: 'ইয়া-সারি (や行)',
  ra: 'রা-সারি (ら行)',
  wa: 'ওয়া-সারি (わ行)',
  n: 'ন্/ং (ん)'
};

export const KanaView: React.FC = () => {
  const [activeType, setActiveType] = useState<KanaType>('hiragana');
  const [activeSubType, setActiveSubType] = useState<KanaSubType>('seion');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedKana, setSelectedKana] = useState<KanaCharacter>(HIRAGANA_SEION[0]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [activeModalTab, setActiveModalTab] = useState<'guide' | 'draw'>('guide');
  const [masteredList, setMasteredList] = useState<string[]>([]);

  useEffect(() => {
    setMasteredList(getMasteredKanaList());
  }, []);

  // Filter kana according to selection
  const currentList = useMemo(() => {
    let source: KanaCharacter[] = [];
    if (activeSubType === 'seion') {
      source = activeType === 'hiragana' ? HIRAGANA_SEION : KATAKANA_SEION;
    } else if (activeSubType === 'dakuon' || activeSubType === 'handakuon') {
      source = DAKUON_HANDAKUON_KANA.filter(
        (k) => (activeSubType === 'dakuon' ? k.subType === 'dakuon' : k.subType === 'handakuon') && k.type === activeType
      );
      if (source.length === 0) {
        // Fallback to all dakuon/handakuon
        source = DAKUON_HANDAKUON_KANA.filter((k) => k.subType === activeSubType);
      }
    } else {
      source = YOON_KANA.filter((k) => k.type === activeType);
      if (source.length === 0) source = YOON_KANA;
    }

    if (!searchQuery.trim()) return source;

    const q = searchQuery.toLowerCase().trim();
    return source.filter(
      (k) =>
        k.char.includes(q) ||
        k.romaji.toLowerCase().includes(q) ||
        k.banglaPhonetic.includes(q)
    );
  }, [activeType, activeSubType, searchQuery]);

  // Keep selectedKana in sync with active list
  useEffect(() => {
    if (currentList.length > 0 && !currentList.some((k) => k.char === selectedKana.char)) {
      setSelectedKana(currentList[0]);
    }
  }, [currentList, selectedKana.char]);
  const hiraganaTotal = HIRAGANA_SEION.length;
  const katakanaTotal = KATAKANA_SEION.length;
  const hiraganaMastered = HIRAGANA_SEION.filter((k) => masteredList.includes(k.char)).length;
  const katakanaMastered = KATAKANA_SEION.filter((k) => masteredList.includes(k.char)).length;

  const handleSelectKana = (kana: KanaCharacter) => {
    setSelectedKana(kana);
    setIsDetailModalOpen(true);
    speakJapanese(kana.char, { rate: 0.85 });
  };

  const handlePrevInSequence = () => {
    const currentIndex = currentList.findIndex((k) => k.char === selectedKana.char);
    if (currentIndex > 0) {
      const prev = currentList[currentIndex - 1];
      setSelectedKana(prev);
      speakJapanese(prev.char, { rate: 0.85 });
    } else if (currentList.length > 0) {
      const last = currentList[currentList.length - 1];
      setSelectedKana(last);
      speakJapanese(last.char, { rate: 0.85 });
    }
  };

  const handleNextInSequence = () => {
    const currentIndex = currentList.findIndex((k) => k.char === selectedKana.char);
    if (currentIndex !== -1 && currentIndex < currentList.length - 1) {
      const next = currentList[currentIndex + 1];
      setSelectedKana(next);
      speakJapanese(next.char, { rate: 0.85 });
    } else if (currentList.length > 0) {
      const first = currentList[0];
      setSelectedKana(first);
      speakJapanese(first.char, { rate: 0.85 });
    }
  };

  const handleMasteryToggle = (isMastered: boolean) => {
    setMasteredList(getMasteredKanaList());
    if (isMastered) {
      retentionEngine.recordActivity('KANA').catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-slate-100 pt-28 md:pt-36 pb-20 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#121226]/90 via-[#0d0d1a]/95 to-[#07070d] backdrop-blur-md border border-slate-800/80 p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NIHOMI KANA MASTERY LAB (五十音図) • 100% FREE</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                জাপানি বর্ণমালা ও স্ট্রোক অর্ডার ইঞ্জিন
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                ৪৬টি হিরাগানা এবং ৪৬টি কাতাকানা বর্ণ প্রতিটি স্ট্রোকের দিক, কলমের শুরু-শেষ পয়েন্ট এবং টোকিও ভয়েস উচ্চারণের মাধ্যমে হাতে-কলমে অনুশীলন করুন। ফ্রি টিয়ারে কোনো সীমাবদ্ধতা নেই।
              </p>
            </div>

            {/* Overall Mastery Progress Widgets */}
            <div className="grid grid-cols-2 gap-3 shrink-0 sm:w-80">
              {/* Hiragana Progress */}
              <div className="p-3.5 rounded-2xl bg-[#0a0a14]/80 backdrop-blur-sm border border-slate-800 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow">
                <span className="text-[11px] font-bold text-rose-400">হিরাগানা মাস্টারি</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-mono font-black text-white">
                    {hiraganaMastered} <span className="text-xs text-slate-500">/ {hiraganaTotal}</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {Math.round((hiraganaMastered / hiraganaTotal) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${(hiraganaMastered / hiraganaTotal) * 100}%` }}
                  />
                </div>
              </div>

              {/* Katakana Progress */}
              <div className="p-3.5 rounded-2xl bg-[#0a0a14]/80 backdrop-blur-sm border border-slate-800 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow">
                <span className="text-[11px] font-bold text-amber-400">কাতাকানা মাস্টারি</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-mono font-black text-white">
                    {katakanaMastered} <span className="text-xs text-slate-500">/ {katakanaTotal}</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {Math.round((katakanaMastered / katakanaTotal) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${(katakanaMastered / katakanaTotal) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab & Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Primary Mode: Hiragana vs Katakana with sliding pill */}
            <div className="relative inline-flex p-1 rounded-2xl bg-[#0f0f1c]/90 backdrop-blur-md border border-slate-800 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setActiveType('hiragana');
                  if (activeSubType === 'seion') {
                    setSelectedKana(HIRAGANA_SEION[0]);
                  }
                }}
                className={`relative z-10 px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeType === 'hiragana'
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {activeType === 'hiragana' && (
                  <motion.div
                    layoutId="activeKanaTypeIndicator"
                    className="absolute inset-0 rounded-xl bg-rose-600 shadow-lg shadow-rose-600/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">হিরাগানা (Hiragana • 46)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveType('katakana');
                  if (activeSubType === 'seion') {
                    setSelectedKana(KATAKANA_SEION[0]);
                  }
                }}
                className={`relative z-10 px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeType === 'katakana'
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {activeType === 'katakana' && (
                  <motion.div
                    layoutId="activeKanaTypeIndicator"
                    className="absolute inset-0 rounded-xl bg-amber-600 shadow-lg shadow-amber-600/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">কাতাকানা (Katakana • 46)</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="বর্ণ, Romaji বা উচ্চারণ খুঁজুন..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#0d0d1a]/80 backdrop-blur-md border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* Sub-Category Pills (Seion, Dakuon, Handakuon, Yoon) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveSubType('seion')}
              className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                activeSubType === 'seion'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeSubType === 'seion' && (
                <motion.div
                  layoutId="activeKanaSubTypeIndicator"
                  className="absolute inset-0 rounded-xl bg-slate-800 border border-slate-700"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">মূল বর্ণমালা (Seion 清音 • 46)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubType('dakuon')}
              className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                activeSubType === 'dakuon'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeSubType === 'dakuon' && (
                <motion.div
                  layoutId="activeKanaSubTypeIndicator"
                  className="absolute inset-0 rounded-xl bg-slate-800 border border-slate-700"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">
                {activeType === 'hiragana'
                  ? 'ডাকুওন (Dakuon 濁音 • が, ざ...)'
                  : 'ডাকুওন (Dakuon 濁音 • ガ, ザ...)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubType('handakuon')}
              className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                activeSubType === 'handakuon'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeSubType === 'handakuon' && (
                <motion.div
                  layoutId="activeKanaSubTypeIndicator"
                  className="absolute inset-0 rounded-xl bg-slate-800 border border-slate-700"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">
                {activeType === 'hiragana'
                  ? 'হান্দাকুওন (Handakuon 半濁音 • ぱ, ぴ...)'
                  : 'হান্দাকুওন (Handakuon 半濁音 • パ, ピ...)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubType('yoon')}
              className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                activeSubType === 'yoon'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeSubType === 'yoon' && (
                <motion.div
                  layoutId="activeKanaSubTypeIndicator"
                  className="absolute inset-0 rounded-xl bg-slate-800 border border-slate-700"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">
                {activeType === 'hiragana'
                  ? 'যুক্তবর্ণ (Yōon 拗音 • きゃ, しゅ...)'
                  : 'যুক্তবর্ণ (Yōon 拗音 • キャ, シュ...)'}
              </span>
            </button>
          </div>
        </div>

        {/* Kana Syllabary Grid Display */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3.5">
          {currentList.map((k, index) => {
            const isMastered = masteredList.includes(k.char);
            const isSelected = selectedKana.char === k.char;

            return (
              <motion.div
                key={k.char}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.015, 0.3) }}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                onClick={() => handleSelectKana(k)}
                className={`relative group p-4 rounded-3xl cursor-pointer border transition-all duration-200 flex flex-col items-center justify-between text-center min-h-[140px] select-none backdrop-blur-md active:scale-95 ${
                  isSelected
                    ? 'bg-[#151528]/95 border-rose-500 shadow-xl shadow-rose-500/20 ring-1 ring-rose-500'
                    : isMastered
                    ? 'bg-[#0a0f18]/90 border-emerald-500/40 hover:border-emerald-500/70 shadow-sm hover:shadow-xl hover:shadow-emerald-950/20'
                    : 'bg-[#0c0c17]/80 border-slate-800/80 hover:border-slate-700 hover:bg-[#111122] shadow-sm hover:shadow-xl hover:shadow-slate-950/40'
                }`}
              >
                {/* Mastered Badge */}
                {isMastered && (
                  <div className="absolute top-2.5 right-2.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}

                {/* Main Character Glyph */}
                <div className="w-full flex items-center justify-center pt-1">
                  <span className="text-4xl sm:text-5xl font-black font-japanese text-white group-hover:scale-110 transition-transform duration-200">
                    {k.char}
                  </span>
                </div>

                {/* Subtitle Info */}
                <div className="w-full mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-slate-400">
                  <span className="font-mono text-xs font-bold text-rose-300">
                    {k.romaji}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {k.banglaPhonetic}
                  </span>
                </div>

                {/* Quick Pronounce Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakJapanese(k.char, { rate: 0.85 });
                  }}
                  className="absolute bottom-2 right-2 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  title="উচ্চারণ"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Practice Modal / Interactive Engine Sheet */}
        <AnimatePresence>
          {isDetailModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl bg-[#0b0b14] border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
              >
                
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d0d1a]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-600/20 text-rose-400 font-black text-2xl font-japanese flex items-center justify-center border border-rose-500/30">
                      {selectedKana.char}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{selectedKana.char}</span>
                        <span className="text-xs font-normal text-slate-400 font-mono">
                          ({selectedKana.romaji} • {selectedKana.banglaPhonetic})
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {selectedKana.strokes}টি স্ট্রোক • {selectedKana.type === 'hiragana' ? 'হিরাগানা' : 'কাতাকানা'} • ফ্রি আনলিমিটেড প্র্যাকটিস
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => speakJapanese(selectedKana.char, { rate: 0.85 })}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-400 transition-colors cursor-pointer"
                      title="উচ্চারণ"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsDetailModalOpen(false)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mode Selector within Modal with sliding tabs */}
                <div className="flex items-center justify-between px-6 pt-3 pb-2 border-b border-slate-800 bg-[#090912]">
                  <div className="relative inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setActiveModalTab('guide')}
                      className={`relative z-10 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        activeModalTab === 'guide'
                          ? 'text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {activeModalTab === 'guide' && (
                        <motion.div
                          layoutId="activeModalTabIndicator"
                          className="absolute inset-0 rounded-lg bg-rose-600 shadow-md shadow-rose-600/30"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10">১. স্ট্রোক গাইড (Stroke Order Guide)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveModalTab('draw')}
                      className={`relative z-10 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        activeModalTab === 'draw'
                          ? 'text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {activeModalTab === 'draw' && (
                        <motion.div
                          layoutId="activeModalTabIndicator"
                          className="absolute inset-0 rounded-lg bg-emerald-600 shadow-md shadow-emerald-600/30"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10">২. রাইটিং ল্যাব (Freehand Writing Lab)</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextInSequence}
                    className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>পরবর্তী বর্ণ</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Visualizer or Writing Canvas */}
                  <div className="lg:col-span-7 flex justify-center">
                    {activeModalTab === 'guide' ? (
                      <StrokeOrderGuide
                        kana={selectedKana}
                        className="w-full max-w-sm"
                      />
                    ) : (
                      <KanaDrawingCanvas
                        kana={selectedKana}
                        onNextCharacter={handleNextInSequence}
                        onMasteryToggled={handleMasteryToggle}
                        className="w-full max-w-sm"
                      />
                    )}
                  </div>

                  {/* Right Column: Mnemonics, Vocabulary, and Character Info */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Mnemonics Card */}
                    <div className="p-4 rounded-2xl bg-[#0f0f1f] border border-slate-800 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>মনে রাখার কৌশল (Mnemonic)</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {selectedKana.mnemonicBn}
                      </p>
                      <p className="text-[11px] text-slate-400 italic">
                        "{selectedKana.mnemonicEn}"
                      </p>
                    </div>

                    {/* Example Vocabulary Card */}
                    <div className="p-4 rounded-2xl bg-[#0f0f1f] border border-slate-800 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>ব্যবহারিক শব্দভাণ্ডার (Vocabulary)</span>
                      </div>

                      <div className="space-y-2">
                        {selectedKana.exampleVocab.map((v, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-[#090912] border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold font-japanese text-white">
                                  {v.word}
                                </span>
                                <span className="text-xs text-rose-400 font-mono">
                                  {v.reading}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {v.meaningBn}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => speakJapanese(v.word, { rate: 0.85 })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                              title="উচ্চারণ"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Switch Row */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const res = toggleMasteredKana(selectedKana.char);
                          handleMasteryToggle(res.isMastered);
                        }}
                        className={`w-full py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                          masteredList.includes(selectedKana.char)
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <Award className="w-4 h-4" />
                        <span>
                          {masteredList.includes(selectedKana.char)
                            ? 'মাস্টারি তালিকাভুক্ত ✓'
                            : 'মাস্টারড হিসেবে চিহ্নিত করুন'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Bottom Navigation Controls on Mobile & Desktop */}
              <div className="sticky bottom-0 z-20 px-4 py-3 bg-[#0d0d1a] border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handlePrevInSequence}
                  className="flex-1 min-h-[48px] px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-rose-950/50 border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"
                  aria-label="পূর্ববর্তী বর্ণ"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-400" />
                  <span>← পূর্ববর্তী</span>
                </button>

                {/* Tactile Pronunciation Trigger */}
                <button
                  type="button"
                  onClick={() => speakJapanese(selectedKana.char, { rate: 0.85 })}
                  className="min-h-[48px] min-w-[48px] px-3.5 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 active:bg-rose-600 active:text-white border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-90 cursor-pointer shadow-md"
                  title="উচ্চারণ শুনুন"
                  aria-label="উচ্চারণ শুনুন"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden xs:inline">উচ্চারণ</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextInSequence}
                  className="flex-1 min-h-[48px] px-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md shadow-rose-900/30"
                  aria-label="পরবর্তী বর্ণ"
                >
                  <span>পরবর্তী বর্ণ →</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default KanaView;
