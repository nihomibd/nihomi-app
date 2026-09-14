import React, { useState, useEffect, useMemo } from 'react';
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

  // Calculate mastery progress
  const hiraganaTotal = HIRAGANA_SEION.length;
  const katakanaTotal = KATAKANA_SEION.length;
  const hiraganaMastered = HIRAGANA_SEION.filter((k) => masteredList.includes(k.char)).length;
  const katakanaMastered = KATAKANA_SEION.filter((k) => masteredList.includes(k.char)).length;

  const handleSelectKana = (kana: KanaCharacter) => {
    setSelectedKana(kana);
    setIsDetailModalOpen(true);
    speakJapanese(kana.char, { rate: 0.85 });
  };

  const handleNextInSequence = () => {
    const currentIndex = currentList.findIndex((k) => k.char === selectedKana.char);
    if (currentIndex !== -1 && currentIndex < currentList.length - 1) {
      setSelectedKana(currentList[currentIndex + 1]);
    } else if (currentList.length > 0) {
      setSelectedKana(currentList[0]);
    }
  };

  const handleMasteryToggle = (isMastered: boolean) => {
    setMasteredList(getMasteredKanaList());
    if (isMastered) {
      retentionEngine.recordActivity('KANA').catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-slate-100 pt-24 pb-20 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#121226] via-[#0d0d1a] to-[#07070d] border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NIHOMI KANA MASTERY LAB (五十音図)</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                জাপানি বর্ণমালা ও স্ট্রোক অর্ডার ইঞ্জিন
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                ৪৬টি হিরাগানা এবং ৪৬টি কাতাকানা বর্ণ প্রতিটি স্ট্রোকের দিক, কলমের শুরু-শেষ পয়েন্ট এবং টোকিও ভয়েস উচ্চারণের মাধ্যমে হাতে-কলমে অনুশীলন করুন।
              </p>
            </div>

            {/* Overall Mastery Progress Widgets */}
            <div className="grid grid-cols-2 gap-3 shrink-0 sm:w-80">
              {/* Hiragana Progress */}
              <div className="p-3.5 rounded-2xl bg-[#0a0a14] border border-slate-800 flex flex-col justify-between">
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
              <div className="p-3.5 rounded-2xl bg-[#0a0a14] border border-slate-800 flex flex-col justify-between">
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
            
            {/* Primary Mode: Hiragana vs Katakana */}
            <div className="inline-flex p-1 rounded-2xl bg-[#0f0f1c] border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setActiveType('hiragana');
                  if (activeSubType === 'seion') {
                    setSelectedKana(HIRAGANA_SEION[0]);
                  }
                }}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeType === 'hiragana'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                হিরাগানা (Hiragana • 46)
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveType('katakana');
                  if (activeSubType === 'seion') {
                    setSelectedKana(KATAKANA_SEION[0]);
                  }
                }}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeType === 'katakana'
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                কাতাকানা (Katakana • 46)
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
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#0d0d1a] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          {/* Sub-Category Pills (Seion, Dakuon, Handakuon, Yoon) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveSubType('seion')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                activeSubType === 'seion'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              মূল বর্ণমালা (Seion 清音)
            </button>

            <button
              type="button"
              onClick={() => setActiveSubType('dakuon')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                activeSubType === 'dakuon'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              ডাকুওন (Dakuon 濁音 • が, ざ...)
            </button>

            <button
              type="button"
              onClick={() => setActiveSubType('handakuon')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                activeSubType === 'handakuon'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              হান্দাকুওন (Handakuon 半濁音 • ぱ, ぴ...)
            </button>

            <button
              type="button"
              onClick={() => setActiveSubType('yoon')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                activeSubType === 'yoon'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              যুক্তবর্ণ (Yōon 拗音 • きゃ, しゅ...)
            </button>
          </div>
        </div>

        {/* Kana Syllabary Grid Display */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
          {currentList.map((k) => {
            const isMastered = masteredList.includes(k.char);
            const isSelected = selectedKana.char === k.char;

            return (
              <div
                key={k.char}
                onClick={() => handleSelectKana(k)}
                className={`relative group p-4 rounded-3xl cursor-pointer border transition-all duration-200 flex flex-col items-center justify-between text-center min-h-[140px] select-none active:scale-95 ${
                  isSelected
                    ? 'bg-[#151528] border-rose-500 shadow-lg shadow-rose-500/20 ring-1 ring-rose-500'
                    : isMastered
                    ? 'bg-[#0a0f18] border-emerald-500/30 hover:border-emerald-500/60'
                    : 'bg-[#0c0c17] border-slate-800 hover:border-slate-700 hover:bg-[#111122]'
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
                  <span className="text-4xl sm:text-5xl font-black font-japanese text-white group-hover:scale-105 transition-transform">
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
                  className="absolute bottom-2 right-2 p-1 rounded-lg text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="উচ্চারণ"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Practice Modal / Interactive Engine Sheet */}
        {isDetailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-4xl bg-[#0b0b14] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              
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
                      {selectedKana.strokes}টি স্ট্রোক • {selectedKana.type === 'hiragana' ? 'হিরাগানা' : 'কাতাকানা'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => speakJapanese(selectedKana.char, { rate: 0.85 })}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-400 transition-colors"
                    title="উচ্চারণ"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDetailModalOpen(false)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mode Selector within Modal */}
              <div className="flex items-center justify-between px-6 pt-3 pb-2 border-b border-slate-800 bg-[#090912]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalTab('guide')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeModalTab === 'guide'
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ১. স্ট্রোক গাইড (Stroke Order Guide)
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModalTab('draw')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeModalTab === 'draw'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ২. রাইটিং ল্যাব (Freehand Writing Lab)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleNextInSequence}
                  className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors"
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanaView;
