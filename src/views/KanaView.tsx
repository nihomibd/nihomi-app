// src/views/KanaView.tsx
// NIHOMI KANA STUDIO™ — INTERACTIVE JAPANESE WRITING & REELS FLOW
// Combines interactive 4-stage canvas (Show → Stroke Order → Tracing → Free-write),
// seamless auto-advance Reels flow, and real-time MemoryOS mistake synchronization.

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
  X,
  Grid,
  Zap,
  Flame,
  ShieldCheck,
  Brain,
  Printer
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
import { KanaDrawingCanvas } from '../components/kana/KanaDrawingCanvas';
import { ConstitutionalKanaLabModal } from '../components/kana/ConstitutionalKanaLabModal';
import { speakJapanese } from '../lib/tts';
import { getKanaMistakes, KanaMistakeRecord } from '../lib/kanaMemorySync';
import { ContextualSenseiCompanion } from '../components/ai/ContextualSenseiCompanion';
import { KanaPracticeSheetDownloadCard } from '../components/kana/KanaPracticeSheetDownloadCard';

interface KanaViewProps {
  initialChar?: string;
  initialRow?: string;
  initialType?: KanaType;
  onNavigate?: (view: string, params?: Record<string, any>) => void;
}

export const KanaView: React.FC<KanaViewProps> = ({ initialChar: propChar, initialType: propType, onNavigate }) => {
  // Query param fallback support
  const queryChar = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('char') : null;
  const queryType = typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('type') as KanaType) : null;

  const targetChar = propChar || queryChar;
  const targetType = propType || queryType;

  // Resolve matching Kana character across all available syllabaries
  const resolveTargetKana = (charOrRomaji?: string | null): KanaCharacter => {
    if (!charOrRomaji) return HIRAGANA_SEION[0];
    const q = charOrRomaji.trim();
    const foundHiragana = HIRAGANA_SEION.find((k) => k.char === q || k.romaji.toLowerCase() === q.toLowerCase());
    if (foundHiragana) return foundHiragana;
    const foundKatakana = KATAKANA_SEION.find((k) => k.char === q || k.romaji.toLowerCase() === q.toLowerCase());
    if (foundKatakana) return foundKatakana;
    const foundDakuon = DAKUON_HANDAKUON_KANA.find((k) => k.char === q || k.romaji.toLowerCase() === q.toLowerCase());
    if (foundDakuon) return foundDakuon;
    const foundYoon = YOON_KANA.find((k) => k.char === q || k.romaji.toLowerCase() === q.toLowerCase());
    if (foundYoon) return foundYoon;
    return HIRAGANA_SEION[0];
  };

  const initialKana = resolveTargetKana(targetChar);

  const [activeType, setActiveType] = useState<KanaType>(
    targetType || initialKana.type || 'hiragana'
  );
  const [activeSubType, setActiveSubType] = useState<KanaSubType>(
    initialKana.subType || 'seion'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedKana, setSelectedKana] = useState<KanaCharacter>(initialKana);
  const [viewLayout, setViewLayout] = useState<'studio' | 'grid'>('studio');
  const [masteredList, setMasteredList] = useState<string[]>([]);
  const [recentMistakes, setRecentMistakes] = useState<KanaMistakeRecord[]>([]);
  const [isKanaLabOpen, setIsKanaLabOpen] = useState<boolean>(false);

  // Synchronize when propChar or targetChar changes dynamically
  useEffect(() => {
    if (targetChar) {
      const resolved = resolveTargetKana(targetChar);
      setSelectedKana(resolved);
      setActiveType(resolved.type);
      if (resolved.subType) {
        setActiveSubType(resolved.subType);
      }
    }
  }, [targetChar]);

  // Refresh mastery and memory-os logs
  const refreshMasteryAndLogs = () => {
    setMasteredList(getMasteredKanaList());
    setRecentMistakes(getKanaMistakes());
  };

  useEffect(() => {
    refreshMasteryAndLogs();
    const handleMemoryUpdate = () => refreshMasteryAndLogs();
    window.addEventListener('nihomi:memory-updated', handleMemoryUpdate);
    return () => window.removeEventListener('nihomi:memory-updated', handleMemoryUpdate);
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

  const totalCharacters = currentList.length;
  const masteredCount = currentList.filter((k) => masteredList.includes(k.char)).length;
  const progressPercent = totalCharacters > 0 ? Math.round((masteredCount / totalCharacters) * 100) : 0;

  // The Reels Principle: Instant Next Character Progression
  const handleNextInSequence = () => {
    const currentIndex = currentList.findIndex((k) => k.char === selectedKana.char);
    if (currentIndex !== -1 && currentIndex < currentList.length - 1) {
      const next = currentList[currentIndex + 1];
      setSelectedKana(next);
      speakJapanese(next.char, { rate: 0.85 });
    } else if (currentList.length > 0) {
      // Loop back to start for continuous endless drill
      const first = currentList[0];
      setSelectedKana(first);
      speakJapanese(first.char, { rate: 0.85 });
    }
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

  return (
    <div className="min-h-screen bg-[#FAF9FC] dark:bg-[#141726] text-slate-900 dark:text-slate-100 font-sans antialiased pb-24 selection:bg-[#E45147] selection:text-white overflow-x-hidden transition-colors">
      
      {/* 1. TOP HEADER & NAVIGATION */}
      <div className="bg-white/90 dark:bg-[#141726]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[11px] font-mono font-bold rounded-full border border-purple-500/30">
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>NIHOMI KANA STUDIO™ • 日本語文字</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>হিরাগানা ও কাতাকানা ক্যানভাস</span>
              <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-mono font-normal border border-slate-200 dark:border-slate-700">
                {masteredCount}/{totalCharacters} Mastered ({progressPercent}%)
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Switcher: Studio vs Grid */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setViewLayout('studio')}
                className={`btn-haptic px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewLayout === 'studio'
                    ? 'bg-[#E45147] text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>স্টুডিও মোড</span>
              </button>

              <button
                type="button"
                onClick={() => setViewLayout('grid')}
                className={`btn-haptic px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewLayout === 'grid'
                    ? 'bg-[#E45147] text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>চার্ট ভিউ</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('kana-offline-practice-sheets');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-haptic px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                title="A4 সাইজ প্র্যাকটিস শিট ডাউনলোড করুন"
              >
                <Printer className="w-3.5 h-3.5 text-rose-500" />
                <span>প্রিন্ট শিট</span>
              </button>
            </div>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="btn-haptic px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                ← ড্যাশবোর্ড
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* 2. MEMORYOS SYNC BANNER (Surfaces weak kana if any were logged) */}
        {recentMistakes.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-[#14101e] border border-purple-500/30 text-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <Brain className="w-5 h-5 text-purple-400 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white">MemoryOS™ Active Review Sync: </span>
                <span>
                  আপনার ক্যানভাস অনুশীলনে {recentMistakes.length}টি দুর্বল স্ট্রোক ও অক্ষর শনাক্ত হয়েছে এবং Spaced Repetition রিভিউতে যুক্ত রয়েছে।
                </span>
              </div>
            </div>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('memory-os')}
                className="btn-haptic shrink-0 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                ভুলের খাতা ও রিভিউ দেখুন ➔
              </button>
            )}
          </div>
        )}

        {/* Guided Foundation Mission Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#18121f] to-indigo-950/30 border border-purple-500/30 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md font-black shrink-0">
              あ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">গাইডেড ফাউন্ডেশন মিশন (LOCKED JOURNEY v1)</span>
                <span className="px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                  ৫ মিনিট
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                あ・い・う・え・お: ইন্টারেক্টিভ অডিও, অ্যাক্টিভ রিকল এবং টোকিও কনবিনি প্রয়োগসহ শিখুন।
              </p>
            </div>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('journey')}
              className="btn-haptic shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>গাইডেড মিশন শুরু করুন →</span>
            </button>
          )}
        </div>

        {/* 3. BEGINNER ROADMAP TIMELINE & PROGRESSION PATH */}
        <div className="bg-[#0b0c16] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>শূন্য থেকে কাঞ্জি — শিক্ষণ পথরেখা (Beginner Roadmap)</span>
            </span>
            <span className="text-[11px] text-slate-400">স্টেপ ১ থেকে ৫ ক্রমানুসারে শিখুন</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveSubType('seion');
              }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                activeSubType === 'seion'
                  ? 'bg-purple-950/40 border-purple-500/50 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] font-mono text-purple-400 font-bold">স্টেপ ১</div>
              <div className="font-bold text-slate-100">বেসিক ৪৬ বর্ণ</div>
              <div className="text-[10px] text-slate-500">Seion (あ〜ん)</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSubType('dakuon');
              }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                activeSubType === 'dakuon'
                  ? 'bg-amber-950/40 border-amber-500/50 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] font-mono text-amber-400 font-bold">স্টেপ ২</div>
              <div className="font-bold text-slate-100">তেনতেন (২০)</div>
              <div className="text-[10px] text-slate-500">Dakuon (が〜ぼ)</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSubType('handakuon');
              }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                activeSubType === 'handakuon'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] font-mono text-emerald-400 font-bold">স্টেপ ৩</div>
              <div className="font-bold text-slate-100">মারু বৃত্ত (৫)</div>
              <div className="text-[10px] text-slate-500">Handakuon (ぱ〜ぽ)</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSubType('yoon');
              }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                activeSubType === 'yoon'
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] font-mono text-cyan-400 font-bold">স্টেপ ৪</div>
              <div className="font-bold text-slate-100">যুক্তবর্ণ (৩৬)</div>
              <div className="text-[10px] text-slate-500">Yoon (きゃ〜ぴょ)</div>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('kanji');
              }}
              className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-950/20 text-left hover:bg-purple-900/30 transition-all cursor-pointer col-span-2 sm:col-span-1"
            >
              <div className="text-[10px] font-mono text-purple-400 font-bold">স্টেপ ৫ ➔</div>
              <div className="font-bold text-purple-200">১২০টি N5 কাঞ্জি</div>
              <div className="text-[10px] text-purple-400">Kanji Studio</div>
            </button>
          </div>
        </div>

        {/* 4. TYPE SELECTORS (Hiragana vs Katakana) & SUB-TYPES */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0d0e1a] p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
          {/* Main Type Toggle */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setActiveType('hiragana');
                setSelectedKana(HIRAGANA_SEION[0]);
              }}
              className={`btn-haptic px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeType === 'hiragana'
                  ? 'bg-[#E45147] text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>হিরাগানা (Hiragana)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveType('katakana');
                setSelectedKana(KATAKANA_SEION[0]);
              }}
              className={`btn-haptic px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeType === 'katakana'
                  ? 'bg-[#E45147] text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>কাতাকানা (Katakana)</span>
            </button>

            {/* Subtype quick pill buttons */}
            <div className="flex items-center gap-1 ml-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveSubType('seion')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  activeSubType === 'seion' ? 'bg-[#E45147] text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                Seion (৪৬)
              </button>
              <button
                type="button"
                onClick={() => setActiveSubType('dakuon')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  activeSubType === 'dakuon' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                Tenten (২০)
              </button>
              <button
                type="button"
                onClick={() => setActiveSubType('handakuon')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  activeSubType === 'handakuon' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                Maru (৫)
              </button>
              <button
                type="button"
                onClick={() => setActiveSubType('yoon')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  activeSubType === 'yoon' ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                }`}
              >
                Yoon (৩৬)
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="অক্ষর বা Romaji লিখুন (উদা: ka, あ, ga)..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* 4. REELS CAROUSEL / QUICK-JUMP STRIP */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span className="font-mono text-[11px] uppercase tracking-wider font-bold">
              ধারাবাহিক বর্ণ স্ক্রল ({currentList.length} Characters)
            </span>
            <span className="text-[10px]">ক্লিক করে সরাসরি নির্বাচন করুন</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {currentList.map((k) => {
              const isSelected = selectedKana.char === k.char;
              const isDone = masteredList.includes(k.char);
              return (
                <button
                  key={k.char}
                  type="button"
                  onClick={() => {
                    setSelectedKana(k);
                    speakJapanese(k.char, { rate: 0.85 });
                  }}
                  className={`btn-haptic shrink-0 w-11 h-12 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#E45147] border-purple-400 text-white shadow-lg shadow-purple-600/30 scale-105'
                      : isDone
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                      : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm font-black font-japanese leading-none">{k.char}</span>
                  <span className="text-[9px] font-mono opacity-80 leading-tight mt-0.5">{k.romaji}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. PRIMARY CONTENT AREA */}
        {viewLayout === 'studio' ? (
          /* ========================================================== */
          /* STUDIO CANVAS FIRST VIEW (The Interactive Writing Engine)  */
          /* ========================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Center Canvas (7 columns) */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2 px-1">
                <button
                  type="button"
                  onClick={handlePrevInSequence}
                  className="btn-haptic px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>আগের বর্ণ</span>
                </button>

                <div className="text-center">
                  <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                    {currentList.findIndex((k) => k.char === selectedKana.char) + 1} / {currentList.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleNextInSequence}
                  className="btn-haptic px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>পরের বর্ণ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Core Interactive Kana Canvas Component */}
              <KanaDrawingCanvas
                kana={selectedKana}
                onNextCharacter={handleNextInSequence}
                onMasteryToggled={() => refreshMasteryAndLogs()}
                className="w-full max-w-md mx-auto"
                autoAdvance={true}
              />

              {/* Constitutional 8-Stage Lab Trigger */}
              <button
                type="button"
                onClick={() => setIsKanaLabOpen(true)}
                className="btn-haptic mt-3 w-full max-w-md py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>সম্পূর্ণ ৮-ধাপ কন্সটিটিউশনাল ল্যাবে শিখি (8-Stage Lab) →</span>
              </button>
            </div>

            {/* Right Information & Guide Panel (5 columns) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Cultural Origin & Phonetic Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0b0c16] border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">
                    Phonetic & Mnemonic Details
                  </span>
                  <button
                    type="button"
                    onClick={() => speakJapanese(selectedKana.char, { rate: 0.85 })}
                    className="btn-haptic p-1.5 rounded-lg bg-purple-50 dark:bg-slate-900 hover:bg-purple-100 dark:hover:bg-slate-800 text-purple-600 dark:text-purple-400 transition-colors cursor-pointer"
                    title="Audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-slate-900 dark:text-white font-japanese">{selectedKana.char}</span>
                  <div>
                    <div className="text-sm font-black text-purple-600 dark:text-purple-300 font-mono">{selectedKana.romaji}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{selectedKana.banglaPhonetic}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-200 dark:border-slate-800/80">
                  {selectedKana.originMnemonic ||
                    `এই বর্ণটি জাপানি ভাষায় ${selectedKana.romaji} হিসেবে উচ্চারিত হয়। সঠিক স্ট্রোক অনুসরন করে লিখলে হাতের লেখা আকর্ষণীয় হবে।`}
                </p>

                {/* Example Vocabulary Word */}
                <div className="p-3 rounded-2xl bg-purple-50/50 dark:bg-slate-900/90 border border-purple-100 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold">
                    ব্যবহারিক উদাহরণ শব্দ (Example Word):
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white font-japanese">
                    {selectedKana.exampleWord || `${selectedKana.char}`}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    {selectedKana.exampleReading || selectedKana.romaji} — {selectedKana.exampleMeaning || 'জাপানি প্রাত্যহিক শব্দ'}
                  </div>
                </div>
              </div>

              {/* Sensei Companion in Kana Studio */}
              <ContextualSenseiCompanion
                currentConcept={{
                  symbol: selectedKana.char,
                  reading: selectedKana.romaji,
                  meaningBn: selectedKana.banglaPhonetic,
                  topic: `${activeType === 'hiragana' ? 'হিরাগানা' : 'কাতাকানা'} ক্যালিগ্রাফি`,
                  type: 'kana',
                  japanContext: selectedKana.originMnemonic
                }}
                docked={true}
              />

              {/* Japanese Calligraphy Golden Rules */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0b0c16] border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-sm">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>জাপানি ক্যালিগ্রাফির ৩টি মূল নীতি</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                    <span><strong>止め (Tome):</strong> স্ট্রোকের শেষে তুলি বা কলম দৃঢ়ভাবে থামানো।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                    <span><strong>はね (Hane):</strong> নিচে থেকে হালকা বাঁকিয়ে হুকের মতো উপরে তোলা।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                    <span><strong>はらい (Harai):</strong> চাপ কমাতে কমাতে হালকা টানে আলতো করে শেষ করা।</span>
                  </li>
                </ul>
              </div>

              {/* Quick Action: Take N5 Diagnostic */}
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('quizzes')}
                  className="btn-haptic w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-between transition-colors cursor-pointer shadow-sm"
                >
                  <span>N5 কুইজ ও শব্দভান্ডার প্র্যাকটিস</span>
                  <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================== */
          /* SYLLABARY CHART GRID (Full 46-card overview)              */
          /* ========================================================== */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {currentList.map((k) => {
              const isDone = masteredList.includes(k.char);
              const isSelected = selectedKana.char === k.char;

              return (
                <div
                  key={k.char}
                  onClick={() => {
                    setSelectedKana(k);
                    setViewLayout('studio');
                    speakJapanese(k.char, { rate: 0.85 });
                  }}
                  className={`btn-haptic p-3.5 rounded-2xl border flex flex-col items-center justify-between text-center min-h-[120px] select-none cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/20'
                      : isDone
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/30 hover:border-emerald-500/60'
                      : 'bg-white dark:bg-[#0d0e1a] border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="w-full flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-mono text-purple-600 dark:text-purple-300 font-bold">{k.romaji}</span>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />}
                  </div>

                  <span className="text-4xl font-black font-japanese text-slate-900 dark:text-white my-1">
                    {k.char}
                  </span>

                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{k.banglaPhonetic}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. OFFLINE HOME PRACTICE SHEETS (A4 PRINTABLE) */}
        <KanaPracticeSheetDownloadCard
          onReturnToCanvas={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="mt-8"
        />

      </div>

      <ConstitutionalKanaLabModal
        isOpen={isKanaLabOpen}
        kana={selectedKana}
        onClose={() => setIsKanaLabOpen(false)}
        onComplete={() => refreshMasteryAndLogs()}
        onNextKana={handleNextInSequence}
      />
    </div>
  );
};

export default KanaView;
