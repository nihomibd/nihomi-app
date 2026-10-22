// src/v2/pages/V2DashboardPage.tsx
// NIHOMI V2 — STUDENT COCKPIT & MISSION COMMAND
import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Compass,
  CheckCircle2,
  Store,
  FileText,
  Clock,
  RotateCcw,
  Zap,
  Target,
  Sliders
} from 'lucide-react';
import { V2Route, V2NavigationParams } from '../types';
import { useAuth } from '../../context/AuthContext';
import { loadLearnerKnowledgeState } from '../../core/curriculum/learnerKnowledgeState';
import { getNextBestMission, isGrammarEligible } from '../../core/curriculum/journeyEngine';
import { BengaliQuickCalibrationModal } from '../../components/learning/BengaliQuickCalibrationModal';
import { loopOrchestrator } from '../../core/loop';

interface V2DashboardPageProps {
  onNavigate: (route: V2Route, params?: V2NavigationParams) => void;
}

export const V2DashboardPage: React.FC<V2DashboardPageProps> = ({ onNavigate }) => {
  const { user, progress, openAuthModal } = useAuth();
  const [knowledgeState, setKnowledgeState] = useState(loadLearnerKnowledgeState());
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setKnowledgeState(loadLearnerKnowledgeState());
    window.addEventListener('nihomi:knowledge-state-updated', handleUpdate);
    window.addEventListener('nihomi:memory-updated', handleUpdate);
    return () => {
      window.removeEventListener('nihomi:knowledge-state-updated', handleUpdate);
      window.removeEventListener('nihomi:memory-updated', handleUpdate);
    };
  }, []);

    const nextMission = getNextBestMission(knowledgeState);
  const grammarStatus = isGrammarEligible(knowledgeState);

  // N.I.H.O.M.I Shared Loop Orchestrator Multi-domain Telemetry
  const japaneseBriefing = React.useMemo(() => {
    try {
      return loopOrchestrator.startLoopActivity({
        domain: 'japanese-learning',
        learnerState: knowledgeState
      });
    } catch {
      return null;
    }
  }, [knowledgeState]);

  const conbiniBriefing = React.useMemo(() => {
    try {
      return loopOrchestrator.startLoopActivity({
        domain: 'pos-simulation',
        learnerState: knowledgeState
      });
    } catch {
      return null;
    }
  }, [knowledgeState]);

  const examBriefing = React.useMemo(() => {
    try {
      return loopOrchestrator.startLoopActivity({
        domain: 'exam-os',
        learnerState: knowledgeState
      });
    } catch {
      return null;
    }
  }, [knowledgeState]);

  const cvBriefing = React.useMemo(() => {
    try {
      return loopOrchestrator.startLoopActivity({
        domain: 'cv-rirekisho',
        learnerState: knowledgeState
      });
    } catch {
      return null;
    }
  }, [knowledgeState]);

  const knownKanaCount = knowledgeState.knownHiragana.length + knowledgeState.knownKatakana.length;
  // Authentic learner progress telemetry — 0 fallback if new/unauthenticated, zero fake 5-day / 1240-XP mocks
  const streakDays = progress?.currentStreak ?? progress?.streakDays ?? (user?.streakDays ?? 0);
  const xpPoints = progress?.experiencePoints ?? ((user as any)?.xpPoints ?? 0);

  const handleStartMission = () => {
    if (nextMission.type === 'kana' || nextMission.type === 'word_unlock') {
      if (nextMission.targetChar) {
        onNavigate('kana', { char: nextMission.targetChar });
      } else {
        onNavigate('journey');
      }
    } else if (nextMission.type === 'grammar') {
      const targetLId = nextMission.targetLessonId || (nextMission.viewParams as any)?.lessonId || 'n5-l01';
      onNavigate('lesson', { lessonId: targetLId });
    } else {
      onNavigate('journey');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 animate-fadeIn">
      {/* 1. Header Greeting & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-red-600/20 text-red-400 border border-red-500/30">
              {user?.email?.trim().toLowerCase() === 'mdtanvirkabirbiplob@gmail.com' ? 'প্রতিষ্ঠাতা ভিউ' : 'শিক্ষার্থী ড্যাশবোর্ড'}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              こんにちは (Konnichiwa)
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            স্বাগতম, {user?.name || 'শিক্ষার্থী'} সান!
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            আপনার আজকের জাপান মিশনের লক্ষ্য পূরণ করতে প্রস্তুত তো?
          </p>
        </div>

        {/* Gamification Badges */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Streak */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#141726] border border-amber-500/30 shadow-lg shadow-amber-500/5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">দৈনিক স্ট্রিক</div>
              <div className="text-lg font-black text-amber-400 leading-none">{streakDays} দিন</div>
            </div>
          </div>

          {/* XP */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#141726] border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5 fill-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">অর্জিত পয়েন্ট</div>
              <div className="text-lg font-black text-emerald-400 leading-none">{xpPoints} XP</div>
            </div>
          </div>

          {/* Kana Mastered */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#141726] border border-red-500/30 shadow-lg shadow-red-500/5">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">জানা বর্ণমালা</div>
              <div className="text-lg font-black text-red-400 leading-none">{knownKanaCount} টি</div>
            </div>
          </div>

          {/* Recalibrate Button */}
          <button
            onClick={() => setIsCalibrationOpen(true)}
            className="p-2.5 rounded-2xl bg-[#141726] hover:bg-[#1a1f33] border border-white/10 text-stone-300 hover:text-white transition-all cursor-pointer"
            title="লার্নিং লেভেল রিক্যালিব্রেট করুন"
          >
            <Sliders className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Unauthenticated / Guest Learner Notice */}
      {!user && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs sm:text-sm">
              <strong className="text-white">গেস্ট মোড (Unauthenticated):</strong> স্ট্রিক এবং জাপানিজ লার্নিং ডিএনএ ক্লাউডে চিরস্থায়ীভাবে সংরক্ষণ করতে ফ্রি সাইন-আপ করুন।
            </p>
          </div>
          <button
            id="dashboard-guest-login-btn"
            onClick={() => openAuthModal('login')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E45147] to-[#F59E0B] hover:opacity-90 text-white font-bold text-xs shrink-0 cursor-pointer shadow-md shadow-red-600/20"
          >
            লগইন / সাইন-আপ
          </button>
        </div>
      )}

      {/* 2. Primary Next Best Mission Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E2338] via-[#141726] to-[#0A0A12] border-2 border-[#E45147]/40 p-6 sm:p-8 shadow-2xl shadow-red-600/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#E45147] text-white shadow-md shadow-red-600/30">
                <Sparkles className="w-3.5 h-3.5" />
                আপনার পরবর্তী গোল (Next Best Mission)
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {nextMission.phase.replace(/_/g, ' ')}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {nextMission.titleBn}
            </h2>

            <p className="text-sm text-stone-300 leading-relaxed">
              {nextMission.subTitleBn}
            </p>

            {nextMission.whyItMattersBn && (
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-stone-300 flex items-start gap-2.5">
                <Target className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-amber-400">কেন দরকার:</strong> {nextMission.whyItMattersBn}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={handleStartMission}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E45147] to-[#F59E0B] hover:brightness-110 text-white font-black text-base shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <span>{nextMission.actionLabelBn || 'মিশন শুরু করুন'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('journey')}
              className="px-6 py-3.5 rounded-2xl bg-[#141726] hover:bg-[#1f2438] border border-white/20 text-stone-300 hover:text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>সম্পূর্ণ ম্যাপ দেখুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Quick Feature Access Grid */}
      <div>
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-red-500" />
          <span>প্রোডাক্ট মডিউল ও স্টুডিও</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Card 1: Kana Studio */}
          <div
            onClick={() => onNavigate('kana')}
            className="group p-5 rounded-2xl bg-[#141726] hover:bg-[#191e30] border border-white/10 hover:border-red-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-serif text-xl font-black group-hover:scale-110 transition-transform">
                  あ
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                  {japaneseBriefing?.activity?.targetChar ? `বর্ণ: ${japaneseBriefing.activity.targetChar}` : 'সক্রিয় লুপ'}
                </span>
              </div>
              <h4 className="font-bold text-white text-base">কানা স্টুডিও (Kana Studio)</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                ভেক্টর স্ট্রোক এভালুয়েটর সহ হিরাগানা ও কাতাকানা সঠিক ক্রমে লেখার নির্ভুল ড্রিল।
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>অনুশীলন করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Curriculum N5-N1 */}
          <div
            onClick={() => onNavigate('curriculum')}
            className="group p-5 rounded-2xl bg-[#141726] hover:bg-[#191e30] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-sans text-lg font-black group-hover:scale-110 transition-transform">
                  N5
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${grammarStatus.eligible ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {grammarStatus.eligible ? 'লেসন ১ আনলকড' : 'ফাউন্ডেশন বাকি'}
                </span>
              </div>
              <h4 className="font-bold text-white text-base">মাস্টার কারিকুলাম (N5–N1)</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                মিন্না নো নিহোঙ্গো ও জেএলপিটি স্ট্যান্ডার্ড ৫০টি প্রামাণ্য চ্যাপ্টার ও ব্যাকরণ লেসন।
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>কারিকুলাম এক্সপ্লোর</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Konbini WorkOS */}
          <div
            onClick={() => onNavigate('workos')}
            className="group p-5 rounded-2xl bg-[#141726] hover:bg-[#191e30] border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Store className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {conbiniBriefing?.isEligible ? 'শিফট রেডি' : 'লুপ পেন্ডিং'}
                </span>
              </div>
              <h4 className="font-bold text-white text-base">কনবিনি WorkOS™</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                রিয়েল টোকিও ৭-ইলেভেন ও লসন ক্যাশিয়ার কাউন্টার ড্রিল ও ১০টি জাপান লাইফ সিনারিও।
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>সিমুলেশন চালান</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Relocation JIS CV */}
          <div
            onClick={() => onNavigate('rirekisho')}
            className="group p-5 rounded-2xl bg-[#141726] hover:bg-[#191e30] border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {cvBriefing?.isEligible ? 'JIS রেডি' : 'ড্রাফট মোড'}
                </span>
              </div>
              <h4 className="font-bold text-white text-base">JIS রিলোকেশন CV স্টুডিও</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                জাপানিজ স্ট্যান্ডার্ড A4 রিলোকেশন রিজিউমে ও কারিকুলাম ভাইটে তৈরি করে সরাসরি PDF ডাউনলোড।
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>CV প্রস্তুত করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
          {/* Card 5: JLPT Exam OS */}
          <div
            onClick={() => onNavigate('exam')}
            className="group p-5 rounded-2xl bg-[#141726] hover:bg-[#191e30] border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {examBriefing?.isEligible ? 'মক টেস্ট রেডি' : 'স্বরবর্ণ বাকি'}
                </span>
              </div>
              <h4 className="font-bold text-white text-base">JLPT মক এক্সাম ওএস</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                অফিসিয়াল সময়সীমা ও স্কোরকার্ড সহ N5, N4 ও N3 ফুল-লেংথ প্র্যাকটিস সিমুলেশন ও সার্টিফিকেট।
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>পরীক্ষা দিন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Pedagogical Gate Status Check */}
      <div className="p-6 rounded-3xl bg-[#141726] border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>N.I.H.O.M.I শেয়ার্ড লুপ ও পেডাগোজিক্যাল ল্যাটিস গেট স্ট্যাটাস</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-300">ভাওয়েল ফাউন্ডেশন (あ, い, う, え, お)</span>
              <span className={`px-2 py-0.5 rounded font-mono font-bold ${knowledgeState.knownHiragana.length >= 5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {knowledgeState.knownHiragana.length >= 5 ? 'MASTERED' : 'IN PROGRESS'}
              </span>
            </div>
            <p className="text-stone-400">
              হিরাগানা ৫টি মৌলিক স্বরবর্ণ আয়ত্ত করা ব্যাকরণ আনলক করার পূর্বশর্ত।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-300">গ্রামার লেসন ১ এলিজিবিলিটি</span>
              <span className={`px-2 py-0.5 rounded font-mono font-bold ${grammarStatus.eligible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {grammarStatus.eligible ? 'UNLOCKED' : 'PREREQUISITE REQUIRED'}
              </span>
            </div>
            <p className="text-stone-400">
              {grammarStatus.eligible
                ? 'অভিনন্দন! আপনি N5 লেসন ১ গ্রামার লুপে প্রবেশের যোগ্যতা অর্জন করেছেন।'
                : grammarStatus.unmetReasonBn}
            </p>
          </div>
        </div>
      </div>

      {/* Calibration Modal */}
      {isCalibrationOpen && (
        <BengaliQuickCalibrationModal
          isOpen={isCalibrationOpen}
          onClose={() => setIsCalibrationOpen(false)}
          onPlacementApplied={(_nodeId, _viewRoute, _viewParams) => {
            setIsCalibrationOpen(false);
            setKnowledgeState(loadLearnerKnowledgeState());
          }}
        />
      )}
    </div>
  );
};
