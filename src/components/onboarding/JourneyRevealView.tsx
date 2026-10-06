// src/components/onboarding/JourneyRevealView.tsx
import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Target,
  Compass,
  Calendar,
  Layers,
  Award,
  Store,
  CheckCircle2,
  Clock,
  Play,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { OnboardingAnswers, JapanReadinessBreakdown } from '../../core/onboarding/onboardingTypes';
import {
  getLabelForReason,
  getLabelForLevel,
  getLabelForTimeline,
  getLabelForSituation,
  calculateJapanReadiness
} from '../../core/onboarding/onboardingStorage';
import { TokyoKonbiniFirstMissionModal, REAL_LIFE_MISSIONS } from '../missions/TokyoKonbiniFirstMissionModal';
import { trackNihomiEvent } from '../../utils/analytics';
import { soundEffects } from '../../lib/soundEffects';

interface JourneyRevealViewProps {
  answers: OnboardingAnswers;
  onNavigate: (view: string, params?: Record<string, any>) => void;
  onStartFirstMission?: () => void;
}

export const JourneyRevealView: React.FC<JourneyRevealViewProps> = ({
  answers,
  onNavigate,
  onStartFirstMission
}) => {
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [activeMissionId, setActiveMissionId] = useState('tokyo_konbini_01');
  const readiness = calculateJapanReadiness(answers);

  const handleStartMission = (missionId: string = 'tokyo_konbini_01') => {
    setActiveMissionId(missionId);
    soundEffects.playButtonClick();
    trackNihomiEvent('mission_started', {
      missionId,
      scenario: 'real_life_simulation'
    });
    setIsMissionModalOpen(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 text-white">
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>তোমার পার্সোনালাইজড রোডম্যাপ প্রস্তুত</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Welcome to your Japan Journey! 🇯🇵
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto">
          তোমার লক্ষ্য এবং প্রস্তুতির সময়ের ওপর ভিত্তি করে তৈরি করা হয়েছে এই অপ্টিমাইজড পাথওয়ে।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: PERSONALIZED SUMMARY & READINESS (7 cols) */}
        <div className="md:col-span-7 space-y-5">
          {/* Summary Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#111022] border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-red-500" />
              <span>জার্নি প্রোফাইল সামারি</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-stone-400 block text-[11px]">মূল লক্ষ্য:</span>
                <span className="font-bold text-white text-xs sm:text-sm mt-0.5 block">
                  {getLabelForReason(answers.reason)}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-stone-400 block text-[11px]">বর্তমান স্তর:</span>
                <span className="font-bold text-amber-300 text-xs sm:text-sm mt-0.5 block">
                  {getLabelForLevel(answers.currentLevel)}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-stone-400 block text-[11px]">পরিকল্পিত সময়সীমা:</span>
                <span className="font-bold text-rose-300 text-xs sm:text-sm mt-0.5 block">
                  {getLabelForTimeline(answers.timeline)}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-stone-400 block text-[11px]">দৈনিক পড়ার কমিটমেন্ট:</span>
                <span className="font-bold text-emerald-400 text-xs sm:text-sm mt-0.5 block">
                  {answers.dailyMinutes} মিনিট / দিন
                </span>
              </div>
            </div>
          </div>

          {/* 5 Real-Life Missions List */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#111022] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>বাস্তব জাপানের ৫টি মিশন (Real-Life Missions)</span>
              </h3>
              <span className="text-[11px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                ৫টি আনলকড
              </span>
            </div>

            <div className="space-y-2.5">
              {REAL_LIFE_MISSIONS.map((m) => {
                const isCompleted = typeof window !== 'undefined' && (
                  localStorage.getItem(`nihomi_mission_${m.id}_completed`) === 'true' ||
                  (m.id === 'tokyo_konbini_01' && localStorage.getItem('nihomi_mission_konbini_completed') === 'true')
                );
                return (
                  <div
                    key={m.id}
                    onClick={() => handleStartMission(m.id)}
                    className="p-3.5 rounded-2xl border border-white/5 hover:border-red-500/30 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-red-600 text-stone-300 group-hover:text-white flex items-center justify-center font-mono font-black text-xs shrink-0 transition-colors">
                        {m.num}
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-200 transition-colors">
                          {m.titleBn}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          {m.location} • {m.speaker}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isCompleted ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>সম্পন্ন</span>
                        </span>
                      ) : (
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-red-600/20 text-red-300 font-bold group-hover:bg-red-600 group-hover:text-white transition-all flex items-center gap-1">
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>খেলুন</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: READINESS SCORE & NEXT BEST MISSION (5 cols) */}
        <div className="md:col-span-5 space-y-5">
          {/* Readiness Score Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#191630] to-[#100e21] border border-red-500/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Japan Readiness Score™
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                ক্যালিব্রেটেড
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                {readiness.overallScore}%
              </div>
              <div className="text-xs text-stone-300 leading-snug">
                তোমার প্রাথমিক প্রস্তুতি স্কোর। প্রতিটি মিশন সম্পন্ন করার সাথে সাথে এই স্কোর বাড়বে।
              </div>
            </div>

            {/* Score Breakdown Bars */}
            <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
              <div className="flex justify-between text-stone-400 text-[11px]">
                <span>Foundation (বর্ণমালা ও ব্যাকরণ):</span>
                <span className="text-white font-mono">{readiness.foundationScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${readiness.foundationScore}%` }}
                />
              </div>

              <div className="flex justify-between text-stone-400 text-[11px] pt-1">
                <span>Speaking & Conversation:</span>
                <span className="text-white font-mono">{readiness.speakingScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${readiness.speakingScore}%` }}
                />
              </div>

              <div className="flex justify-between text-stone-400 text-[11px] pt-1">
                <span>Daily Life & Konbini:</span>
                <span className="text-white font-mono">{readiness.dailyLifeScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full"
                  style={{ width: `${readiness.dailyLifeScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* NEXT BEST MISSION HERO CARD */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-red-950/40 via-[#181126] to-[#120f20] border-2 border-red-500/40 shadow-2xl space-y-4 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-600/20 rounded-full blur-2xl" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase">
                Next Best Mission
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Mission 01: Tokyo Konbini (কনবিনি চ্যালেঞ্জ)
              </h2>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                টোকিওর ৭-ইলেভেন বা লসনে প্রথম কেনাকাটার অভিজ্ঞতা। প্লাস্টিক ব্যাগ ও ক্যাশিয়ারের প্রশ্নের দ্রুত সমাধান।
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-stone-400 font-medium">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>২ মিনিট সময়</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-red-400" />
                <span>+৫০ XP রিওয়ার্ড</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleStartMission('tokyo_konbini_01')}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm sm:text-base shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mission শুরু করি →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Missions */}
      <TokyoKonbiniFirstMissionModal
        isOpen={isMissionModalOpen}
        initialMissionId={activeMissionId}
        onClose={() => setIsMissionModalOpen(false)}
        onComplete={() => {
          setIsMissionModalOpen(false);
          onNavigate('dashboard');
        }}
        onNavigate={onNavigate}
      />
    </div>
  );
};
