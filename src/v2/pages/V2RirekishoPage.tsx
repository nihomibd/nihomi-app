// src/v2/pages/V2RirekishoPage.tsx
// NIHOMI V2/V3 — JIS RELOCATION CV & RIREKISHO STUDIO (日本産業規格 履歴書)
// Strictly adhering to Nihomi Pedagogical Law & Japanese Employment Standards

import React from 'react';
import {
  FileText,
  Sparkles,
  Download,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Building,
  GraduationCap,
  Award
} from 'lucide-react';
import { V2Route, V2NavigationParams } from '../types';
import { JisRirekishoStudio } from '../../components/simulation/JisRirekishoStudio';
import { loopOrchestrator } from '../../core/loop';
import { loadLearnerKnowledgeState } from '../../core/curriculum/learnerKnowledgeState';

interface V2RirekishoPageProps {
  onNavigate: (route: V2Route, params?: V2NavigationParams) => void;
}

export const V2RirekishoPage: React.FC<V2RirekishoPageProps> = ({ onNavigate }) => {
  const cvLoopBriefing = React.useMemo(() => {
    try {
      const state = loadLearnerKnowledgeState();
      return loopOrchestrator.startLoopActivity({
        domain: 'cv-rirekisho',
        learnerState: state
      });
    } catch {
      return null;
    }
  }, []);

  const handleAdapterNavigate = (view: string, params?: Record<string, any>) => {
    let target: V2Route = 'dashboard';
    if (view === 'pricing') target = 'pricing';
    else if (view === 'courses') target = 'curriculum';
    else if (view === 'baito' || view === 'workos') target = 'workos';
    onNavigate(target, params);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* 1. Top Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <button
          id="btn-back-from-rirekisho"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ড্যাশবোর্ডে ফিরে যান</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>NIHOMI CAREER OS™ • {cvLoopBriefing?.briefingTitleBn || 'JIS Z 8303 Standard Resume'}</span>
        </div>
      </div>

      {/* 2. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#E45147]/10 text-[#E45147] border border-[#E45147]/30">
              জাপানিজ কর্মসংস্থান মানদণ্ড
            </span>
            <span className="text-xs text-stone-400 font-mono">
              JIS Standard CV Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            জাপান স্ট্যান্ডার্ড JIS রিলোকেশন CV স্টুডিও (履歴書)
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            জাপানিজ অভিবাসন ও কোম্পানি স্ট্যান্ডার্ড A4 রিলোকেশন রিজিউমে তৈরি ও সরাসরি PDF এক্সপোর্ট।
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-xl">
          <CheckCircle2 className="w-4 h-4" />
          <span>১০০% অফিসিয়াল ফরম্যাট (JIS 규格)</span>
        </div>
      </div>

      {/* 3. Japanese Resume Standard Principles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#141726]/60 border border-white/10 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white">জাপানি সাল রূপান্তর</h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              পশ্চিমী সাল স্বয়ংক্রিয়ভাবে রেইওয়া (令和), হেইসেই (平成) বা শোওয়া (昭和) অব্দে কনভার্ট হয়।
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141726]/60 border border-white/10 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white">ফুরিগানা ও কাঞ্জি সমর্থন</h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              কাঞ্জি নামের উপরে ফুরিগানা উচ্চারণ এবং অফিসিয়াল জাপানি অ্যাড্রেস ফরম্যাট অন্তর্ভুক্ত।
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#141726]/60 border border-white/10 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <Building className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white">ভিসা ও কাজের অনুমতি ক্লজ</h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              স্টুডেন্ট ভিসার ক্ষেত্রে সপ্তাহিক ২৮ ঘণ্টার কাজের নিয়ম এবং পারমিট স্ট্যাটাস স্বয়ংক্রিয় প্রদর্শিত।
            </p>
          </div>
        </div>
      </div>

      {/* 4. Embedded JIS Studio Engine */}
      <div className="bg-[#141726] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl">
        <JisRirekishoStudio
          onNavigate={handleAdapterNavigate}
        />
      </div>
    </div>
  );
};

export default V2RirekishoPage;
