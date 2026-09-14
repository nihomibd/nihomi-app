import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Volume2,
  BookOpen,
  Award,
  Search,
  CheckCircle2,
  Filter,
  Layers,
  ChevronRight,
  HelpCircle,
  X,
  Compass,
  Calendar,
  Hash,
  Trees,
  Users,
  Activity,
  Briefcase
} from 'lucide-react';
import {
  KanjiEntry,
  KanjiCategory,
  JLPT_N5_KANJI_100,
  getMasteredKanjiList,
  toggleMasteredKanji
} from '../data/kanji100Data';
import { KanjiStrokeVisualizer } from '../components/kanji/KanjiStrokeVisualizer';
import { speakJapanese } from '../lib/tts';

const CATEGORIES: { id: KanjiCategory | 'all'; labelBn: string; icon: any }[] = [
  { id: 'all', labelBn: 'সকল কাঞ্জি (১০০)', icon: Layers },
  { id: 'numbers', labelBn: 'সংখ্যা (Numbers)', icon: Hash },
  { id: 'calendar', labelBn: 'সময় ও পঞ্জিকা (Time)', icon: Calendar },
  { id: 'directions', labelBn: 'দিক ও অবস্থান (Directions)', icon: Compass },
  { id: 'nature', labelBn: 'প্রকৃতি (Nature)', icon: Trees },
  { id: 'people', labelBn: 'মানুষ ও পরিবার (People)', icon: Users },
  { id: 'body', labelBn: 'দেহ ও ইন্দ্রিয় (Body)', icon: Activity },
  { id: 'actions', labelBn: 'ক্রিয়া ও কাজ (Verbs)', icon: Sparkles },
  { id: 'daily', labelBn: 'দৈনন্দিন জীবন (Daily Life)', icon: Briefcase }
];

export const KanjiView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<KanjiCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedKanji, setSelectedKanji] = useState<KanjiEntry>(JLPT_N5_KANJI_100[0]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [masteredList, setMasteredList] = useState<string[]>([]);

  useEffect(() => {
    setMasteredList(getMasteredKanjiList());
  }, []);

  const filteredKanji = useMemo(() => {
    let list = JLPT_N5_KANJI_100;
    if (selectedCategory !== 'all') {
      list = list.filter((k) => k.category === selectedCategory);
    }
    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (k) =>
        k.kanji.includes(q) ||
        k.meaningBn.toLowerCase().includes(q) ||
        k.meaningEn.toLowerCase().includes(q) ||
        k.onyomi.some((o) => o.toLowerCase().includes(q)) ||
        k.kunyomi.some((u) => u.toLowerCase().includes(q))
    );
  }, [selectedCategory, searchQuery]);

  const totalKanji = JLPT_N5_KANJI_100.length;
  const masteredCount = JLPT_N5_KANJI_100.filter((k) => masteredList.includes(k.kanji)).length;

  const handleSelectKanji = (k: KanjiEntry) => {
    setSelectedKanji(k);
    setIsModalOpen(true);
    speakJapanese(k.kanji, { rate: 0.8 });
  };

  const handleToggleMastery = (kanjiChar: string) => {
    toggleMasteredKanji(kanjiChar);
    setMasteredList(getMasteredKanjiList());
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-slate-100 pt-24 pb-20 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#121226] via-[#0d0d1a] to-[#07070d] border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NIHOMI JLPT N5 KANJI MASTER LAB (漢字100選)</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                অফিসিয়াল JLPT N5 ১০০টি কাঞ্জি মাস্টার গাইড
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                অন-ইওমি (Onyomi), কুন-ইওমি (Kunyomi), বাংলা অর্থ, রিয়েলটাইম স্ট্রোক অর্ডার অ্যানিমেশন এবং ক্যালিগ্রাফি অনুশীলনের মাধ্যমে ১০০টি N5 কাঞ্জি আয়ত্ত করুন।
              </p>
            </div>

            {/* Kanji Mastery Progress */}
            <div className="p-4 rounded-2xl bg-[#0a0a14] border border-slate-800 flex flex-col justify-between sm:w-80 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400">N5 কাঞ্জি মাস্টারি অগ্রগতি</span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {Math.round((masteredCount / totalKanji) * 100)}%
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-mono font-black text-white">
                  {masteredCount} <span className="text-sm text-slate-500 font-normal">/ {totalKanji} টি কাঞ্জি</span>
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${(masteredCount / totalKanji) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="কাঞ্জি, অর্থ বা উচ্চারণ দিয়ে খুঁজুন..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#0d0d1a] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-[#0e0e1a] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.labelBn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kanji 100 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
          {filteredKanji.map((k) => {
            const isMastered = masteredList.includes(k.kanji);
            const isSelected = selectedKanji.kanji === k.kanji;

            return (
              <div
                key={k.kanji}
                onClick={() => handleSelectKanji(k)}
                className={`relative group p-4 rounded-3xl cursor-pointer border transition-all duration-200 flex flex-col justify-between select-none active:scale-95 ${
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

                {/* Stroke Count Pill */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                  {k.strokeCount}画
                </div>

                {/* Main Glyph */}
                <div className="w-full flex items-center justify-center pt-5 pb-2">
                  <span className="text-4xl sm:text-5xl font-black font-japanese text-white group-hover:scale-105 transition-transform">
                    {k.kanji}
                  </span>
                </div>

                {/* Info and Meanings */}
                <div className="w-full pt-2 border-t border-slate-800/60 space-y-1">
                  <div className="text-center font-bold text-xs text-rose-300 truncate">
                    {k.meaningBn}
                  </div>
                  
                  <div className="text-center text-[10px] text-slate-400 truncate">
                    {k.kunyomi[0] || k.onyomi[0] || '-'}
                  </div>
                </div>

                {/* Audio Pronounce Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakJapanese(k.kanji, { rate: 0.8 });
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

        {/* Practice & Visualizer Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-4xl bg-[#0b0b14] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d0d1a]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-600/20 text-rose-400 font-black text-2xl font-japanese flex items-center justify-center border border-rose-500/30">
                    {selectedKanji.kanji}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{selectedKanji.kanji}</span>
                      <span className="text-xs font-normal text-slate-400">
                        ({selectedKanji.meaningBn})
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {selectedKanji.strokeCount}টি স্ট্রোক • {selectedKanji.categoryNameBn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => speakJapanese(selectedKanji.kanji, { rate: 0.8 })}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-400 transition-colors"
                    title="উচ্চারণ"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Embedded Kanji Stroke Visualizer Component */}
                <KanjiStrokeVisualizer
                  initialKanji={selectedKanji.kanji}
                  onKanjiSelect={(k) => {
                    const match = JLPT_N5_KANJI_100.find((item) => item.kanji === k);
                    if (match) setSelectedKanji(match);
                  }}
                />

                {/* Compound Words Section */}
                <div className="p-4 rounded-2xl bg-[#0f0f1f] border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>N5 প্রয়োজনীয় শব্দভাণ্ডার (Jukugo 熟語)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {selectedKanji.compounds.map((cmp, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#090912] border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold font-japanese text-white">
                              {cmp.word}
                            </span>
                            <span className="text-xs text-rose-400 font-mono">
                              {cmp.reading}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {cmp.meaningBn}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => speakJapanese(cmp.word, { rate: 0.85 })}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="উচ্চারণ"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toggle Mastery Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => handleToggleMastery(selectedKanji.kanji)}
                    className={`px-6 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                      masteredList.includes(selectedKanji.kanji)
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>
                      {masteredList.includes(selectedKanji.kanji)
                        ? 'মাস্টারি তালিকাভুক্ত ✓'
                        : 'মাস্টারড হিসেবে চিহ্নিত করুন'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanjiView;
