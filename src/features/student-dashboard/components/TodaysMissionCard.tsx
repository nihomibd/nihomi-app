// src/features/student-dashboard/components/TodaysMissionCard.tsx
// NIHOMI SENSEI AI™ — AUTONOMOUS MISSION HERO CARD
// Prioritizes the single major next action for the learner rather than forcing catalog browsing.

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  ArrowRight,
  Flame,
  CheckCircle2,
  Store,
  Coins,
  ShieldCheck,
  Play
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
        // Safe default Golden Path for zero-lag client hydration
        if (isMounted) {
          setMission({
            id: 'exp-golden-path-001',
            situation: '7-Eleven Shibuya Crossing (渋谷スクランブル交差点前)',
            situationJa: 'セブン-イレブン 渋谷スクランブル店',
            situationBn: 'শিবুয়া ক্রসিং সেভেন-ইলেভেন কনভেনিয়েন্স স্টোর',
            goal: "Today's Mission: Buy Bottled Water & Decline Plastic Bag",
            goalJa: '水を1本買い、レジ袋を丁寧に断る（袋は結構です）',
            goalBn: 'আজকের মিশন: এক বোতল পানি কেনা ও শপিং ব্যাগ বিনম্রভাবে না বলা',
            whyExplanation: 'You just arrived in Tokyo and need hydration. Practice real everyday Japanese without embarrassment.',
            targetPhraseJa: 'お水を1本ください。袋は結構です。',
            targetPhraseRomaji: 'Omizu o ippon kudasai. Fukuro wa kekkou desu.',
            targetPhraseEn: 'One bottle of water, please. No bag needed, thank you.',
            targetPhraseBn: 'এক বোতল পানি দিন দয়া করে। ব্যাগ লাগবে না।',
            keigoRuleNote: '『結構です (Kekkou desu)』is the polished, respectful way to decline optional items in Japanese shops.',
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
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-[#10101c] to-stone-900 border-2 border-amber-500/40 p-5 sm:p-6 shadow-xl text-white"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-rose-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-extrabold uppercase tracking-wide">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Nihomi Sensei AI™ • Priority Action</span>
            </span>

            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>{mission.situation}</span>
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
            {mission.goal}
          </h2>

          <p className="text-xs text-stone-300 leading-relaxed font-japanese">
            Target: <span className="text-amber-300 font-bold">{mission.targetPhraseJa}</span> ({mission.targetPhraseRomaji})
          </p>

          <p className="text-[11px] text-stone-400 leading-relaxed line-clamp-1">
            {mission.whyExplanation}
          </p>
        </div>

        <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row md:flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={() => onStartMission(mission)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-stone-950" />
            <span>Start Mission • শুরু করুন</span>
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>+{mission.rewardCoins} Coins &bull; +{mission.rewardXp} XP</span>
          </div>
        </div>
      </div>
    </section>
  );
};
