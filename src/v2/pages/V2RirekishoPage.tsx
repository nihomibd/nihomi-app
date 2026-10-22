// src/v2/pages/V2RirekishoPage.tsx
// NIHOMI V2 — JIS RELOCATION CV & RIREKISHO STUDIO
import React from 'react';
import {
  FileText,
  Sparkles,
  Download,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { V2Route, V2NavigationParams } from '../types';
import { JisRirekishoStudio } from '../../components/simulation/JisRirekishoStudio';

interface V2RirekishoPageProps {
  onNavigate: (route: V2Route, params?: V2NavigationParams) => void;
}

export const V2RirekishoPage: React.FC<V2RirekishoPageProps> = ({ onNavigate }) => {
  const handleAdapterNavigate = (view: string, params?: Record<string, any>) => {
    let target: V2Route = 'dashboard';
    if (view === 'pricing') target = 'pricing';
    else if (view === 'courses') target = 'curriculum';
    else if (view === 'baito' || view === 'workos') target = 'workos';
    onNavigate(target, params);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              জাপানিজ কর্মসংস্থান মানদণ্ড
            </span>
            <span className="text-xs text-stone-400 font-mono">
              JIS Standard CV Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            জাপান স্ট্যান্ডার্ড JIS রিলোকেশন CV স্টুডিও
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            জাপানিজ অভিবাসন ও কোম্পানি স্ট্যান্ডার্ড A4 রিলোকেশন রিজিউমে তৈরি ও সরাসরি PDF এক্সপোর্ট।
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4" />
          <span>JIS Z 8303 STANDARD FORMAT</span>
        </div>
      </div>

      {/* 2. Embedded JIS Studio Engine */}
      <div className="bg-[#141726] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl">
        <JisRirekishoStudio
          onNavigate={handleAdapterNavigate}
        />
      </div>
    </div>
  );
};
