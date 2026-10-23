// src/v2/pages/V2WorkOsPage.tsx
// NIHOMI V2/V3 — TOKYO WORKOS™ & 7-ELEVEN POS CASHIER WORKSTATION
// Strictly adhering to Nihomi Pedagogical Law & Brand Guidelines

import React, { useState } from 'react';
import {
  Store,
  Sparkles,
  Play,
  Volume2,
  CheckCircle2,
  ShieldCheck,
  Compass,
  Building,
  GraduationCap,
  ArrowRight,
  Clock,
  Layers,
  Award,
  ArrowLeft,
  Scan,
  Coins
} from 'lucide-react';
import { V2Route, V2NavigationParams } from '../types';
import { ConbiniPosCashierSimulator } from '../../components/simulation/ConbiniPosCashierSimulator';
import { DEFAULT_BAITO_SCENARIOS } from '../../views/BaitoOsView';
import { speakJapanese } from '../../lib/tts';
import { loadLearnerKnowledgeState, saveLearnerKnowledgeState } from '../../core/curriculum/learnerKnowledgeState';
import { loopOrchestrator } from '../../core/loop';
import { useAuth } from '../../context/AuthContext';
import { isProUser } from '../utils/accessControl';
import { ProFeatureGate } from '../components/common/ProFeatureGate';
import { soundEffects } from '../../lib/soundEffects';

interface V2WorkOsPageProps {
  onNavigate: (route: V2Route, params?: V2NavigationParams) => void;
  onOpenCheckout?: (planId?: string) => void;
}

export const V2WorkOsPage: React.FC<V2WorkOsPageProps> = ({ onNavigate, onOpenCheckout }) => {
  const { user } = useAuth();
  const hasAccess = isProUser(user);
  const [activeTab, setActiveTab] = useState<'cashier' | 'scenarios'>('cashier');
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);

  const activeScenario = DEFAULT_BAITO_SCENARIOS[selectedScenarioIndex] || DEFAULT_BAITO_SCENARIOS[0];
  const [completionNotice, setCompletionNotice] = useState<{ score: number; xp: number } | null>(null);

  const conbiniLoopBriefing = React.useMemo(() => {
    try {
      const state = loadLearnerKnowledgeState();
      return loopOrchestrator.startLoopActivity({
        domain: 'pos-simulation',
        learnerState: state,
        context: { scenarioId: activeScenario.id }
      });
    } catch {
      return null;
    }
  }, [activeScenario.id]);

  const handleCompleteOrder = (score: number, totalYen: number) => {
    const earnedXp = Math.max(30, Math.round(score * 5));
    try {
      const current = loadLearnerKnowledgeState();
      const briefing = loopOrchestrator.startLoopActivity({
        domain: 'pos-simulation',
        learnerState: current,
        context: { scenarioId: activeScenario.id }
      });

      const loopEval = loopOrchestrator.processAttempt({
        domain: 'pos-simulation',
        learnerState: current,
        activity: briefing.activity,
        attempt: {
          scenarioId: activeScenario.id,
          stepsCompleted: score >= 60 ? 5 : 3,
          step1GreetingCorrect: true,
          step2ItemsScanned: true,
          step3ServiceHandled: score >= 60,
          step4PaymentCalculated: true,
          step5ClosingPolite: score >= 80,
          timeSpentSeconds: 45
        }
      });

      const updated = {
        ...loopEval.stateDerivation.updatedState,
        totalXp: (loopEval.stateDerivation.updatedState.totalXp || 0) + earnedXp
      };
      saveLearnerKnowledgeState(updated);
      setCompletionNotice({ score, xp: earnedXp });
    } catch (e) {
      console.warn('[WorkOS] Could not process attempt via loopOrchestrator:', e);
      const current = loadLearnerKnowledgeState();
      const updatedSkills = Array.from(new Set([...(current.masteredSkills || []), 'baito_conbini_cashier']));
      saveLearnerKnowledgeState({
        ...current,
        totalXp: (current.totalXp || 0) + earnedXp,
        masteredSkills: updatedSkills
      });
      setCompletionNotice({ score, xp: earnedXp });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* 1. Top Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <button
          id="btn-back-from-workos"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ড্যাশবোর্ডে ফিরে যান</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
          <Store className="w-3.5 h-3.5" />
          <span>NIHOMI WORKOS™ • 7-Eleven POS Cashier Simulation</span>
        </div>
      </div>

      {/* 2. Header & Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              টোকিও ক্যারিয়ার ও প্রাত্যহিক জীবন
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Tokyo WorkOS™ Simulator
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            রিয়েল জাপান কর্মক্ষেত্র ও কনবিনি সিমুলেশন
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            টোকিওতে পৌঁছানোর আগেই ৭-ইলেভেন ক্যাশিয়ার শিফট এবং ভিসা-ইন্টারভিউয়ের সরাসরি অভিজ্ঞতা নিন।
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 p-1.5 bg-[#141726] rounded-2xl border border-white/10">
          <button
            id="tab-btn-workos-cashier"
            onClick={() => {
              setActiveTab('cashier');
              soundEffects.playButtonTap();
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'cashier'
                ? 'bg-[#E45147] text-white shadow-lg shadow-red-600/30'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            🏪 কনবিনি POS ক্যাশিয়ার ড্রিল
          </button>
          <button
            id="tab-btn-workos-scenarios"
            onClick={() => {
              setActiveTab('scenarios');
              soundEffects.playButtonTap();
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'scenarios'
                ? 'bg-[#E45147] text-white shadow-lg shadow-red-600/30'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            🇯🇵 জাপান লাইফ সিনারিও প্যাক
          </button>
        </div>
      </div>

      {/* 3. Tab Content */}
      {activeTab === 'cashier' ? (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#141726] border border-white/10 text-xs text-stone-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>৭-ইলেভেন / লসন ক্যাশিয়ার সিমুলেটর:</strong> বারকোড স্ক্যান, খাবার গরম, পয়েন্ট কার্ড ও বিনম্র জাপানিজ ডায়ালগ অনুশীলন করুন।
              </span>
            </div>
            <span className="text-emerald-400 font-mono font-bold">READY TO SERVE</span>
          </div>

          {/* Embedded Cashier Simulator Engine */}
          <div className="bg-[#141726] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl">
            {completionNotice && (
              <div id="workos-shift-completion-banner" className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center justify-between animate-fadeIn mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs sm:text-sm font-bold">
                    অভিনন্দন! আপনি সফলভাবে কনবিনি ক্যাশিয়ার শিফট সম্পন্ন করেছেন (স্কোর: {completionNotice.score}%)। +{completionNotice.xp} XP অর্জিত হয়েছে!
                  </span>
                </div>
                <button
                  onClick={() => setCompletionNotice(null)}
                  className="text-xs px-3 py-1 rounded-lg bg-emerald-800/40 hover:bg-emerald-700/50 text-white cursor-pointer"
                >
                  ঠিক আছে
                </button>
              </div>
            )}
            <ConbiniPosCashierSimulator
              onCompleteOrder={handleCompleteOrder}
            />
          </div>
        </div>
      ) : !hasAccess ? (
        <div className="space-y-6">
          <ProFeatureGate
            featureName="জাপান লাইফ সিনারিও প্যাক"
            featureSubtitle="টোকিও সাবওয়ে, অ্যাপার্টমেন্ট সাইনিং, ব্যাংক অ্যাকাউন্ট ও ভিসা ইন্টারভিউ"
            featureDescription="বাস্তব জাপান রিলোকেশন পরিস্থিতিতে জাপানি কথোপকথন ও কালচারাল কেইগো আয়ত্ত করতে Nihomi PRO সাবস্ক্রাইব করুন।"
            onOpenCheckout={() => {
              if (onOpenCheckout) {
                onOpenCheckout('pro');
              } else {
                onNavigate('pricing');
              }
            }}
            onBack={() => setActiveTab('cashier')}
            backLabel="কনবিনি ক্যাশিয়ারে ফিরে যান"
          />
        </div>
      ) : (
        /* Scenarios Catalog */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Scenario Rail */}
          <div className="lg:col-span-4 bg-[#141726] border border-white/10 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-stone-300 pb-2 border-b border-white/10">
              জাপান রিলোকেশন সিনারিও তালিকা
            </h3>

            <div className="space-y-2">
              {DEFAULT_BAITO_SCENARIOS.map((sc, index) => {
                const isSelected = selectedScenarioIndex === index;
                return (
                  <div
                    key={sc.id}
                    onClick={() => {
                      setSelectedScenarioIndex(index);
                      soundEffects.playButtonTap();
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-600/20 to-amber-500/20 border-red-500/50 text-white'
                        : 'bg-black/30 border-white/5 text-stone-400 hover:bg-white/5 hover:text-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-white">{sc.titleBn}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/10">
                        {sc.difficulty}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400 font-serif">
                      {sc.titleJa}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Scenario Details & Audio Player */}
          <div className="lg:col-span-8 bg-[#141726] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {activeScenario.location}
                </span>
                <h2 className="text-xl font-black text-white mt-2">
                  {activeScenario.titleBn}
                </h2>
                <p className="text-xs text-stone-400 mt-1 font-serif">
                  {activeScenario.titleJa} • {activeScenario.interlocutorName} ({activeScenario.interlocutorRole})
                </p>
              </div>

              <button
                onClick={() => speakJapanese(activeScenario.initialDialogue.ja)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 text-xs font-bold transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-[#E45147]" />
                <span>সংলাপ শুনুন</span>
              </button>
            </div>

            {/* Context Narrative */}
            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-xs text-stone-300 leading-relaxed">
              <strong className="text-white block mb-1">বাস্তব প্রেক্ষাপট:</strong>
              {activeScenario.contextDescription}
            </div>

            {/* Initial Dialogue Box */}
            <div className="p-4 rounded-2xl bg-[#0A0A12] border border-white/10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                {activeScenario.interlocutorRole} ({activeScenario.interlocutorName}):
              </span>
              <div className="text-base font-bold text-white font-japanese">
                {activeScenario.initialDialogue.ja}
              </div>
              <div className="text-xs text-stone-400 font-mono">
                {activeScenario.initialDialogue.romaji}
              </div>
              <div className="text-xs text-stone-300 pt-2 border-t border-white/10">
                <strong>বাংলা অর্থ:</strong> {activeScenario.initialDialogue.bn}
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                মিশনের প্রধান উদ্দেশ্যসমূহ:
              </h4>
              <div className="space-y-1.5">
                {activeScenario.objectives.map((obj, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-stone-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Vocabulary */}
            {activeScenario.keyVocabulary && (
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  প্রয়োজনীয় শব্দকোষ:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeScenario.keyVocabulary.map((v, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-serif font-bold text-white text-sm">{v.ja}</span>
                        <span className="text-xs text-stone-400 font-mono ml-2">({v.kana})</span>
                        <div className="text-[11px] text-stone-300 mt-0.5">{v.meaningBn}</div>
                      </div>
                      <button
                        onClick={() => speakJapanese(v.ja)}
                        className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default V2WorkOsPage;
