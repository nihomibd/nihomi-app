import React from 'react';
import { AccountUsage } from '../types';

interface AIUsageSummaryProps {
  usage: AccountUsage;
  compact?: boolean;
  onOpenAiTutor?: () => void;
  onOpenStore?: () => void;
}

export const AIUsageSummary: React.FC<AIUsageSummaryProps> = ({ usage, compact = true, onOpenAiTutor, onOpenStore }) => {
  return (
    <div
      aria-label="Account currency and AI credits"
      className="flex items-center gap-2 text-xs font-medium"
    >
      <button type="button" onClick={onOpenStore} className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-800 shadow-sm hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500" title="Top up Nihomi Coins">
        <span className="text-amber-600 font-bold" aria-hidden="true">🪙</span>
        <span>{usage.nihomiCoins}</span>
        <span className="text-amber-700 font-black" aria-hidden="true">+</span>
        {!compact && <span className="text-amber-700/80 text-[10px]">Coins</span>}
      </button>

      {onOpenAiTutor || onOpenStore ? (
        <button
          type="button"
          onClick={onOpenStore || onOpenAiTutor}
          className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-slate-700 shadow-sm transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          title="Open AI Tutor"
        >
          <span className="text-indigo-600 font-bold" aria-hidden="true">✦</span>
          <span>{usage.aiCreditsRemaining}</span>
          <span className="text-slate-400 font-normal">/{usage.aiCreditsMax}</span>
          <span className="text-indigo-600 font-black" aria-hidden="true">+</span>
          {!compact && <span className="text-slate-500 text-[10px]">AI</span>}
        </button>
      ) : (
        <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-slate-700 shadow-sm" title="AI practice credits">
          <span className="text-indigo-600 font-bold" aria-hidden="true">✦</span>
          <span>{usage.aiCreditsRemaining}</span>
          <span className="text-slate-400 font-normal">/{usage.aiCreditsMax}</span>
          {!compact && <span className="text-slate-500 text-[10px]">AI</span>}
        </div>
      )}
    </div>
  );
};