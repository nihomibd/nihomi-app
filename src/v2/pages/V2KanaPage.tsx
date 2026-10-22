// src/v2/pages/V2KanaPage.tsx
// NIHOMI V2 — VECTOR KANA STUDIO & CALLIGRAPHY LAB
import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  BookOpen,
  Award,
  Search,
  CheckCircle2,
  Filter,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Layers,
  ChevronRight,
  Brain
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
} from '../../data/kanaData';
import { KanaDrawingCanvas } from '../../components/kana/KanaDrawingCanvas';
import { speakJapanese } from '../../lib/tts';
import { V2Route, V2NavigationParams } from '../types';

interface V2KanaPageProps {
  initialChar?: string;
  initialType?: KanaType;
  onNavigate: (route: V2Route, params?: V2NavigationParams) => void;
}

export const V2KanaPage: React.FC<V2KanaPageProps> = ({
  initialChar,
  initialType,
  onNavigate
}) => {
  const resolveKana = (char?: string | null): KanaCharacter => {
    if (!char) return HIRAGANA_SEION[0];
    const q = char.trim();
    const found = ALL_KANA.find((k) => k.char === q || k.romaji.toLowerCase() === q.toLowerCase());
    return found || HIRAGANA_SEION[0];
  };

  const [selectedKana, setSelectedKana] = useState<KanaCharacter>(() => resolveKana(initialChar));
  const [activeType, setActiveType] = useState<KanaType>(initialType || selectedKana.type || 'hiragana');
  const [activeSubType, setActiveSubType] = useState<KanaSubType>(selectedKana.subType || 'seion');
  const [searchQuery, setSearchQuery] = useState('');
  const [masteredList, setMasteredList] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'studio' | 'matrix'>('studio');

  useEffect(() => {
    setMasteredList(getMasteredKanaList());
    const handler = () => setMasteredList(getMasteredKanaList());
    window.addEventListener('nihomi:memory-updated', handler);
    window.addEventListener('nihomi:knowledge-state-updated', handler);
    return () => {
      window.removeEventListener('nihomi:memory-updated', handler);
      window.removeEventListener('nihomi:knowledge-state-updated', handler);
    };
  }, []);

  useEffect(() => {
    if (initialChar) {
      const match = resolveKana(initialChar);
      setSelectedKana(match);
      setActiveType(match.type);
      if (match.subType) setActiveSubType(match.subType);
    }
  }, [initialChar]);

  // Filtered Kana list
  const currentKanaPool = React.useMemo(() => {
    return ALL_KANA.filter((k) => {
      const matchType = k.type === activeType;
      const matchSub = activeSubType ? k.subType === activeSubType : true;
      const matchQuery = searchQuery
        ? k.char.includes(searchQuery) ||
          k.romaji.toLowerCase().includes(searchQuery.toLowerCase()) ||
          k.banglaPhonetic?.includes(searchQuery)
        : true;
      return matchType && matchSub && matchQuery;
    });
  }, [activeType, activeSubType, searchQuery]);

  const handleSelectChar = (kana: KanaCharacter) => {
    setSelectedKana(kana);
    setViewMode('studio');
    speakJapanese(kana.char);
  };

  const handleNextChar = () => {
    const idx = currentKanaPool.findIndex((k) => k.char === selectedKana.char);
    if (idx !== -1 && idx < currentKanaPool.length - 1) {
      setSelectedKana(currentKanaPool[idx + 1]);
    } else if (currentKanaPool.length > 0) {
      setSelectedKana(currentKanaPool[0]);
    }
  };

  const handlePrevChar = () => {
    const idx = currentKanaPool.findIndex((k) => k.char === selectedKana.char);
    if (idx > 0) {
      setSelectedKana(currentKanaPool[idx - 1]);
    }
  };

  const isCurrentMastered = masteredList.includes(selectedKana.char);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* 1. Page Header & Syllabary Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-red-600/20 text-red-400 border border-red-500/30">
              ভেক্টর ক্যালিগ্রাফি স্টুডিও
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Kana Writing Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            জাপানিজ বর্ণমালা ও ক্যালিগ্রাফি অনুশীলন
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            সঠিক স্ট্রোক ক্রম ও জ্যামিতিক দিক বজায় রেখে নিখুঁত হিরাগানা ও কাতাকানা লিখুন।
          </p>
        </div>

        {/* Syllabary Selector (Hiragana vs Katakana) */}
        <div className="flex items-center gap-2 p-1 bg-[#141726] rounded-2xl border border-white/10">
          <button
            onClick={() => {
              setActiveType('hiragana');
              const first = HIRAGANA_SEION[0];
              setSelectedKana(first);
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeType === 'hiragana'
                ? 'bg-[#E45147] text-white shadow-lg shadow-red-600/30'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            হিরাগানা (ひらがな)
          </button>
          <button
            onClick={() => {
              setActiveType('katakana');
              const first = KATAKANA_SEION[0];
              setSelectedKana(first);
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeType === 'katakana'
                ? 'bg-[#E45147] text-white shadow-lg shadow-red-600/30'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            কাতাকানা (カタカナ)
          </button>
        </div>
      </div>

      {/* 2. SubType Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <button
            onClick={() => setActiveSubType('seion')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubType === 'seion'
                ? 'bg-[#1E2338] text-white border border-[#E45147]/50 shadow-md'
                : 'bg-[#141726] text-stone-400 hover:text-white border border-white/5'
            }`}
          >
            মৌলিক বর্ণ (Seion)
          </button>
          <button
            onClick={() => setActiveSubType('dakuon')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubType === 'dakuon'
                ? 'bg-[#1E2338] text-white border border-[#E45147]/50 shadow-md'
                : 'bg-[#141726] text-stone-400 hover:text-white border border-white/5'
            }`}
          >
            দাকুওন (Dakuon)
          </button>
          <button
            onClick={() => setActiveSubType('yoon')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubType === 'yoon'
                ? 'bg-[#1E2338] text-white border border-[#E45147]/50 shadow-md'
                : 'bg-[#141726] text-stone-400 hover:text-white border border-white/5'
            }`}
          >
            যৌগিক বর্ণ (Yoon)
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="বর্ণ বা Romaji খুঁজুন (যেমন: a, ka)..."
              className="w-full bg-[#141726] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            onClick={() => setViewMode(viewMode === 'studio' ? 'matrix' : 'studio')}
            className="p-2 rounded-xl bg-[#141726] border border-white/10 text-stone-300 hover:text-white cursor-pointer"
            title="ভিউ পরিবর্তন করুন"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Main Workspace: Studio Mode vs Matrix Mode */}
      {viewMode === 'studio' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Quick Character Selector Rail */}
          <div className="lg:col-span-4 bg-[#141726] border border-white/10 rounded-3xl p-5 space-y-4 max-h-[640px] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-stone-300">
                বর্ণতালিকা ({currentKanaPool.length} টি)
              </span>
              <span className="text-[11px] text-stone-400 font-mono">
                মাস্টারড: {masteredList.filter((c) => currentKanaPool.some((k) => k.char === c)).length}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 overflow-y-auto pr-1 flex-1">
              {currentKanaPool.map((k) => {
                const isSelected = selectedKana.char === k.char;
                const isDone = masteredList.includes(k.char);
                return (
                  <button
                    key={k.char}
                    onClick={() => handleSelectChar(k)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-gradient-to-tr from-[#E45147] to-[#F59E0B] text-white shadow-lg shadow-red-600/30 scale-105'
                        : isDone
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/40'
                        : 'bg-black/30 text-stone-300 border border-white/5 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="font-serif text-lg font-black leading-none">{k.char}</span>
                    <span className="text-[10px] opacity-75 font-mono">{k.romaji}</span>
                    {isDone && !isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1.5 right-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Writing Studio Canvas */}
          <div className="lg:col-span-8 bg-[#141726] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            {/* Active Character Banner */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E45147] to-[#F59E0B] p-0.5 shadow-lg shadow-red-600/20">
                  <div className="w-full h-full bg-[#141726] rounded-[14px] flex items-center justify-center">
                    <span className="font-serif font-black text-3xl text-white">
                      {selectedKana.char}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">{selectedKana.romaji.toUpperCase()}</h2>
                    <button
                      onClick={() => speakJapanese(selectedKana.char)}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
                      title="উচ্চারণ শুনুন"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    {isCurrentMastered && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        আয়ত্ত হয়েছে
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    বাংলা উচ্চারণ: <strong className="text-white">{selectedKana.banglaPhonetic || selectedKana.romaji}</strong> • স্ট্রোক সংখ্যা: {selectedKana.strokes} টি
                  </p>
                </div>
              </div>

              {/* Prev / Next Character Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevChar}
                  className="p-2 rounded-xl bg-black/40 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white cursor-pointer"
                  title="পূর্ববর্তী বর্ণ"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextChar}
                  className="p-2 rounded-xl bg-black/40 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white cursor-pointer"
                  title="পরবর্তী বর্ণ"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Drawing Canvas */}
            <div className="flex justify-center">
              <KanaDrawingCanvas
                kana={selectedKana}
                onNextCharacter={handleNextChar}
                onMasteryToggled={() => setMasteredList(getMasteredKanaList())}
                autoAdvance={false}
              />
            </div>

            {/* Pedagogical Guidance Footer */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-stone-300 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">নিহোমি পেডাগোজিক্যাল নির্দেশিকা:</strong>{' '}
                প্রতিটি স্ট্রোক লাল রঙের গাইড পয়েন্ট থেকে শুরু করে সঠিক দিক ও দৈর্ঘ্যে টানুন। উল্টো দিকে টানলে বা এলোমেলো হিজিবিজি দাগ দিলে সিস্টেম তা স্বয়ংক্রিয়ভাবে প্রত্যাখ্যান করবে।
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Matrix View (Overview Grid of All Characters) */
        <div className="bg-[#141726] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="font-bold text-white text-lg">
              {activeType === 'hiragana' ? 'হিরাগানা' : 'কাতাকানা'} পূর্ণাঙ্গ বর্ণ তালিকা ({currentKanaPool.length} টি)
            </h3>
            <button
              onClick={() => setViewMode('studio')}
              className="px-4 py-2 rounded-xl bg-[#E45147] text-white font-bold text-xs cursor-pointer"
            >
              স্টুডিও ভিউতে ফিরুন
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {currentKanaPool.map((k) => {
              const isDone = masteredList.includes(k.char);
              return (
                <div
                  key={k.char}
                  onClick={() => handleSelectChar(k)}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer group hover:scale-105 ${
                    isDone
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                      : 'bg-black/30 border-white/10 text-white hover:border-red-500/50'
                  }`}
                >
                  <span className="font-serif text-2xl font-black group-hover:text-red-400 transition-colors">
                    {k.char}
                  </span>
                  <span className="text-xs font-mono text-stone-400">{k.romaji}</span>
                  <div className="text-[10px] text-stone-500 font-sans mt-0.5">
                    {k.strokes} স্ট্রোক
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
