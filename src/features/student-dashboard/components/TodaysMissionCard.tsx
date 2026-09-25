// src/features/student-dashboard/components/TodaysMissionCard.tsx
// NIHOMI SENSEI AI™ — REELS-STYLE ADDICTIVE MISSION HERO CARD
// The Elevator & Reels Principle: Absolute focal point, frictionless continuous flow, zero text overload.

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

interface TodaysMissionCardProps {
  onStartMission: (experience?: NextExperienceData) => void;
  userId?: string;
}

export const TodaysMissionCard: React.FC<TodaysMissionCardProps> = ({
  onStartMission,
  userId
}) => {
  const [mission, setMission] = useState<NextExperienceData | null>(null);
  const [isCompletedToday, setIsCompletedToday] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/ai/next-experience')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.nextExperience) {
          setMission(data.nextExperience);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMission({
            id: 'exp-golden-path-001',
            situation: '7-Eleven Shibuya (渋谷スクランブル前)',
            situationJa: 'セブン-イレブン 渋谷スクランブル店',
            situationBn: 'শিবুয়া ক্রসিং সেভেন-ইলেভেন',
            goal: "Buy Water & Decline Plastic Bag",
            goalJa: '水を1本買い、レジ袋を丁寧に断る（袋は結構です）',
            goalBn: 'মিশন: ১ বোতল পানি কেনা ও শপিং ব্যাগ বিনম্রভাবে না বলা',
            whyExplanation: 'Real Tokyo survival phrase. Say it with confidence.',
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
          });
        }
      });

    return () => {
      isMounted = false;
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
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
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
