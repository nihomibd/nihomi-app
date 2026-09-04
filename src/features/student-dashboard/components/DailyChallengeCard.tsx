import React, { useState } from 'react';
import { DailyChallenge } from '../types';
import { DailyChallengeModal } from './DailyChallengeModal';

interface DailyChallengeCardProps {
  challenge: DailyChallenge | null;
  onCompleteChallenge?: (challengeId: string) => void | Promise<void>;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  challenge,
  onCompleteChallenge,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!challenge) {
    return (
      <section className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-center">
        <p className="text-xs text-stone-500 font-medium">আজকের কোনো নতুন দৈনিক চ্যালেঞ্জ নেই</p>
      </section>
    );
  }

  const isCompleted = challenge.isCompleted || challenge.status === 'completed';

  return (
    <section 
      aria-labelledby="daily-challenge-heading"
      className="rounded-2xl p-5 border border-amber-200 bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-stone-50 shadow-sm relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
              <span>⚡</span> Daily Challenge
            </span>
            <span className="text-[11px] font-semibold text-amber-800">
              🔥 {challenge.currentStreak} Day Streak
            </span>
          </div>

          <h2 id="daily-challenge-heading" className="text-base font-bold text-stone-900 tracking-tight">
            {challenge.title}
          </h2>
          {challenge.titleJapanese && (
            <p className="text-xs text-stone-600 font-medium font-sans">
              {challenge.titleJapanese}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2 text-xs text-stone-600 font-medium">
            <span>{challenge.questionCount} Questions</span>
            <span>•</span>
            <span className="text-rose-600 font-semibold">+{challenge.xpReward} XP</span>
            <span>•</span>
            <span className="text-amber-700 font-semibold">+{challenge.coinReward} Coins</span>
          </div>
        </div>

        <div className="shrink-0 pt-1">
          {isCompleted ? (
            <button
              disabled
              className="px-4 py-2 rounded-xl bg-stone-200 text-stone-500 text-xs font-semibold cursor-not-allowed"
            >
              Completed ✓
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 text-xs font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Start Challenge
            </button>
          )}
        </div>
      </div>
      <DailyChallengeModal
        isOpen={isModalOpen}
        xpReward={challenge.xpReward}
        coinReward={challenge.coinReward}
        onComplete={() => onCompleteChallenge?.(challenge.id)}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};