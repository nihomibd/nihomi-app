// src/v2/pages/V2CurriculumPage.tsx
// NIHOMI V2 — MASTER JLPT N5–N1 CURRICULUM ROADMAP
import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Award,
  Zap,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { V2Route, V2NavigationParams } from '../types';
import { useAuth } from '../../context/AuthContext';
import n5MasterData from '../../data/n5_master.json';

interface V2CurriculumPageProps {
  onNavigate: (route: V2Route, params?: V2NavigationParams) => void;
}

type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export const V2CurriculumPage: React.FC<V2CurriculumPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');
  const [searchQuery, setSearchQuery] = useState('');

  const isProUser =
    user?.role === 'admin' ||
    user?.role === 'founder' ||
    user?.planId === 'pro' ||
    user?.planId === 'japan_ready';

  const n5Lessons = Array.isArray(n5MasterData) ? n5MasterData : [];

  const filteredLessons = n5Lessons.filter((item: any) => {
    const meta = item.lesson_metadata || {};
    const bridge = item.bengali_bridge || {};
    const q = searchQuery.toLowerCase();
    return (
      (meta.title_bn && meta.title_bn.toLowerCase().includes(q)) ||
      (meta.title_ja && meta.title_ja.toLowerCase().includes(q)) ||
      (meta.title_en && meta.title_en.toLowerCase().includes(q)) ||
      (bridge.core_concept_bn && bridge.core_concept_bn.toLowerCase().includes(q))
    );
  });

  const handleOpenLesson = (lessonNum: number, isLocked: boolean) => {
    if (isLocked) {
      onNavigate('pricing', { planId: 'pro' });
      return;
    }
    const formattedId = `n5-l${String(lessonNum).padStart(2, '0')}`;
    onNavigate('lesson', { lessonId: formattedId });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* 1. Header & Level Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
              মিন্না নো নিহোঙ্গো ও জেএলপিটি মানদণ্ড
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Curriculum Roadmap
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            মাস্টার জাপানিজ পাঠ্যক্রম (JLPT N5–N1)
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            জিরো লেভেল থেকে শুরু করে টোকিও কর্মক্ষেত্র ও উচ্চশিক্ষার জন্য প্রামাণ্য ধাপে ধাপে সিলেবাস।
          </p>
        </div>

        {/* Level Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#141726] rounded-2xl border border-white/10 overflow-x-auto">
          {(['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-gradient-to-r from-[#E45147] to-[#F59E0B] text-white shadow-lg shadow-red-600/20'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Free Tier Notice & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-stone-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            {isProUser ? (
              <strong className="text-emerald-400">Pro অ্যাক্টিভ: সমস্ত ৫০টি লেসন আনলক করা আছে</strong>
            ) : (
              <span>লেসন ১ থেকে ৫ <strong>ফ্রি ট্রায়াল</strong>; লেসন ৬–৫০ আনলক করতে Pro সাবস্ক্রিপশন প্রয়োজন।</span>
            )}
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="লেসনের বিষয় বা টাইটেল খুঁজুন..."
            className="w-full bg-[#141726] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* 3. Level Overview & Lesson Grid */}
      {selectedLevel === 'N5' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLessons.map((item: any, idx: number) => {
              const meta = item.lesson_metadata || {};
              const bridge = item.bengali_bridge || {};
              const lessonNum = meta.lesson_number || idx + 1;
              const isLocked = !isProUser && lessonNum > 5;

              return (
                <div
                  key={meta.lesson_id || idx}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative group ${
                    isLocked
                      ? 'bg-[#10121D]/80 border-white/5 opacity-80'
                      : 'bg-[#141726] border-white/10 hover:border-amber-500/40 hover:bg-[#181C2E]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-black text-xs flex items-center justify-center">
                          L{lessonNum}
                        </span>
                        <span className="text-[11px] font-mono text-stone-400">
                          {meta.module_name || 'Grammar Foundation'}
                        </span>
                      </div>

                      {isLocked ? (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" />
                          PRO
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                          <Unlock className="w-3 h-3" />
                          UNLOCKED
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-base leading-snug">
                        {meta.title_bn || `অধ্যায় ${lessonNum}`}
                      </h3>
                      <div className="text-xs text-amber-400/90 font-serif mt-0.5">
                        {meta.title_ja || ''}
                      </div>
                    </div>

                    {bridge.core_concept_bn && (
                      <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                        {bridge.core_concept_bn}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {meta.estimated_minutes || 20} মিনিট
                    </span>

                    <button
                      onClick={() => handleOpenLesson(lessonNum, isLocked)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        isLocked
                          ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
                          : 'bg-[#E45147] hover:bg-red-500 text-white shadow-md shadow-red-600/20'
                      }`}
                    >
                      <span>{isLocked ? 'আনলক করুন' : 'লেসন শুরু'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* N4-N1 Placeholder / Roadmap Showcase */
        <div className="bg-[#141726] border border-white/10 rounded-3xl p-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#E45147] to-[#F59E0B] p-0.5 mx-auto">
            <div className="w-full h-full bg-[#141726] rounded-[14px] flex items-center justify-center font-black text-2xl text-white">
              {selectedLevel}
            </div>
          </div>
          <h2 className="text-2xl font-black text-white">
            JLPT {selectedLevel} অ্যাডভান্সড কারিকুলাম
          </h2>
          <p className="text-sm text-stone-400 max-w-lg mx-auto">
            {selectedLevel} লেভেলের ফুল কারিকুলাম, লিসেনিং ল্যাব ও ইন্টারভিউ সিমুলেশন নিহোমি প্রো ও জাপান রেডি শিক্ষার্থীদের জন্য প্রস্তুত।
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('pricing', { planId: 'pro' })}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E45147] to-[#F59E0B] text-white font-bold text-xs cursor-pointer shadow-lg shadow-red-600/20"
            >
              Pro সাবস্ক্রিপশনে অ্যাক্সেস পান
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
