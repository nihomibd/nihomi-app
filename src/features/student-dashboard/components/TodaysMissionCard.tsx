// src/features/student-dashboard/components/TodaysMissionCard.tsx
// NIHOMI SENSEI AI™ — REELS-STYLE ADDICTIVE MISSION HERO CARD
// The Elevator & Reels Principle: Absolute focal point, frictionless continuous flow, zero text overload.
// Strictly governed by Strict Cumulative Lattice & getNextBestMission(state).

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  ArrowRight,
  Coins,
  Play,
  CheckCircle2,
  Zap,
  Repeat
} from 'lucide-react';
import { NextExperienceData } from '../../../components/learning/GoldenLearningLoopModal';
import { loadLearnerKnowledgeState } from '../../../core/curriculum/learnerKnowledgeState';
import { getNextBestMission, NextBestMission } from '../../../core/curriculum/journeyEngine';

interface TodaysMissionCardProps {
  onStartMission: (experience?: NextExperienceData) => void;
  userId?: string;
}

function mapMissionToExperience(mission: NextBestMission): NextExperienceData {
  if (mission.type === 'kana') {
    const char = mission.targetChar || 'あ';
    return {
      id: mission.id,
      situation: 'Tokyo Arrival • Tactile Hiragana Foundation',
      situationJa: `東京羽田空港・ひらがな「${char}」`,
      situationBn: `হিরাগানা '${char}' বর্ণ পরিচিতি`,
      goal: mission.titleBn,
      goalJa: `ひらがな「${char}」の書き順と発音を習得する`,
      goalBn: mission.subTitleBn,
      whyExplanation: mission.whyItMattersBn,
      targetPhraseJa: char,
      targetPhraseRomaji: char === 'あ' ? 'a' : char === 'い' ? 'i' : char === 'う' ? 'u' : char === 'え' ? 'e' : 'o',
      targetPhraseEn: `Vowel ${char}`,
      targetPhraseBn: `স্বরবর্ণ ${char}`,
      keigoRuleNote: mission.japanConnectionBn || 'সঠিক স্ট্রোক অর্ডার অনুসরণ করে লিখুন।',
      actionType: 'lesson',
      targetView: 'lesson',
      targetParams: mission.viewParams || { lessonId: 'n5-l1', char },
      rewardCoins: 20,
      rewardXp: mission.xpReward || 50
    };
  }

  if (mission.type === 'word_unlock') {
    const word = mission.targetWord || 'あい';
    return {
      id: mission.id,
      situation: 'First Pure Vowel Word Unlock (প্রথম আসল শব্দ আনলক)',
      situationJa: `初めての単語「${word}」`,
      situationBn: 'খাঁটি স্বরবর্ণ শব্দ আনলক',
      goal: mission.titleBn,
      goalJa: `「${word}」を正しく発音し、意味を理解する`,
      goalBn: mission.subTitleBn,
      whyExplanation: mission.whyItMattersBn,
      targetPhraseJa: word,
      targetPhraseRomaji: word === 'あい' ? 'Ai' : word,
      targetPhraseEn: word === 'あい' ? 'Love' : 'Word',
      targetPhraseBn: word === 'あい' ? 'ভালোবাসা (Love)' : 'শব্দ',
      keigoRuleNote: mission.japanConnectionBn || 'দুটি পরিচিত স্বরবর্ণ দিয়ে গঠিত প্রথম শব্দ।',
      actionType: 'lesson',
      targetView: 'lesson',
      targetParams: mission.viewParams || { lessonId: 'n5-l1', char: 'い', step: 'apply' },
      rewardCoins: 25,
      rewardXp: mission.xpReward || 60
    };
  }

  if (mission.type === 'milestone_quiz') {
    return {
      id: mission.id,
      situation: '5-Vowel Milestone Review Gate (৫-স্বরবর্ণ মাস্টার গেট)',
      situationJa: '5母音マスター総合審査',
      situationBn: '৫-স্বরবর্ণ মাইলস্টোন কুইজ',
      goal: mission.titleBn,
      goalJa: 'あ・い・う・え・おと関連単語の完全習得を確認する',
      goalBn: mission.subTitleBn,
      whyExplanation: mission.whyItMattersBn,
      targetPhraseJa: 'あいうえお',
      targetPhraseRomaji: 'a - i - u - e - o',
      targetPhraseEn: '5 Vowels Review Gate',
      targetPhraseBn: '৫টি মৌলিক স্বরবর্ণ গেট',
      keigoRuleNote: 'পরবর্তী কনসোন্যান্ট সেটে যাওয়ার আগে ৫টি প্রশ্নের নির্ভুল উত্তর দিন।',
      actionType: 'lesson',
      targetView: 'lesson',
      targetParams: mission.viewParams || { lessonId: 'n5-l1', quiz: 'vowels' },
      rewardCoins: 50,
      rewardXp: 100
    };
  }

  // Fallback for real-life / konbini or other advanced missions
  return {
    id: mission.id || 'exp-golden-path-001',
    situation: '7-Eleven Shibuya (渋谷スクランブル前)',
    situationJa: 'セブン-イレブン 渋谷スクランブル店',
    situationBn: 'শিবুয়া ক্রসিং সেভেন-ইলেভেন',
    goal: mission.titleBn || "Buy Water & Decline Plastic Bag",
    goalJa: '水を1本買い、レジ袋を丁寧に断る（袋は結構です）',
    goalBn: mission.subTitleBn || 'মিশন: ১ বোতল পানি কেনা ও শপিং ব্যাগ বিনম্রভাবে না বলা',
    whyExplanation: mission.whyItMattersBn || 'Real Tokyo survival phrase. Say it with confidence.',
    targetPhraseJa: 'お水を1本ください。袋は結構です。',
    targetPhraseRomaji: 'Omizu o ippon kudasai. Fukuro wa kekkou desu.',
    targetPhraseEn: 'One bottle of water, please. No bag needed, thank you.',
    targetPhraseBn: 'এক বোতল পানি দিন দয়া করে। ব্যাগ লাগবে না।',
    keigoRuleNote: 'Polite refusal: 『結構です (Kekkou desu)』',
    actionType: 'experience',
    targetView: 'landing',
    targetParams: { hotspotId: 'spot-conbini' },
    rewardCoins: 20,
    rewardXp: 50
  };
}

export const TodaysMissionCard: React.FC<TodaysMissionCardProps> = ({
  onStartMission,
  userId
}) => {
  const resolveCurrentMission = (): NextExperienceData => {
    const state = loadLearnerKnowledgeState(userId);
    const next = getNextBestMission(state);
    return mapMissionToExperience(next);
  };

  const [mission, setMission] = useState<NextExperienceData>(() => resolveCurrentMission());

  useEffect(() => {
    const updateMission = () => {
      setMission(resolveCurrentMission());
    };

    window.addEventListener('nihomi:knowledge-state-updated', updateMission);
    window.addEventListener('nihomi:memory-updated', updateMission);
    window.addEventListener('storage', updateMission);

    // Also fetch server-side state if available
    let isMounted = true;
    fetch('/api/ai/next-experience')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.nextExperience) {
          setMission(data.nextExperience);
        }
      })
      .catch(() => {
        // Fallback remains the locally resolved lattice-compliant mission
      });

    return () => {
      isMounted = false;
      window.removeEventListener('nihomi:knowledge-state-updated', updateMission);
      window.removeEventListener('nihomi:memory-updated', updateMission);
      window.removeEventListener('storage', updateMission);
    };
  }, [userId]);

  if (!mission) return null;

  return (
    <section
      id="dashboard-todays-mission-card"
      aria-label="Today's Priority Mission"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-[#101024] to-stone-950 border-2 border-amber-400/50 p-6 sm:p-7 shadow-[0_16px_50px_rgba(245,158,11,0.12)] text-white"
    >
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 blur-3xl pointer-events-none rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-rose-500/15 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Main Mission Focus */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-black uppercase tracking-wider shadow-xs">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>REELS FLOW • TODAY'S MISSION</span>
            </span>

            <span className="text-xs text-stone-300 flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{mission.situation}</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {mission.goal}
          </h2>

          {/* Karaoke / Lyric Style Target Phrase Display */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md space-y-1">
            <div className="text-base sm:text-lg font-bold text-amber-300 font-japanese tracking-wide">
              {mission.targetPhraseJa}
            </div>
            <div className="text-xs text-stone-300 font-mono">
              {mission.targetPhraseRomaji}
            </div>
          </div>

          <p className="text-xs text-stone-400 font-medium">
            {mission.whyExplanation}
          </p>
        </div>

        {/* Immediate CTA Section (Continuous Play / Elevator Principle) */}
        <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-center gap-3">
          <button
            type="button"
            id="btn-start-todays-priority-mission"
            onClick={() => onStartMission(mission)}
            className="btn-haptic w-full sm:w-auto min-h-[52px] px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-stone-950" />
            <span>START MISSION ➔</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>+{mission.rewardCoins} Coins &bull; +{mission.rewardXp} XP</span>
          </div>
        </div>
      </div>
    </section>
  );
};
