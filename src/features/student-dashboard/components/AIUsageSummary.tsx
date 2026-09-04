import React from 'react';
import { AccountUsage } from '../types';

interface AIUsageSummaryProps {
  usage: AccountUsage;
  compact?: boolean;
}

export const AIUsageSummary: React.FC<AIUsageSummaryProps> = ({ usage, compact = true }) => {
  return (
    <div
      aria-label="Account currency and AI credits"
      className="flex items-center gap-2 text-xs font-medium"
    >
      <div 
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shadow-sm"
        title="Nihomi Coins"
      >
        <span className="text-amber-600 font-bold" aria-hidden="true">🪙</span>
        <span>{usage.nihomiCoins}</span>
        {!compact && <span className="text-amber-700/80 text-[10px]">Coins</span>}
      </div>

      <div 
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-sm"
        title="AI practice credits"
      >
        <span className="text-indigo-600 font-bold" aria-hidden="true">✦</span>
        <span>{usage.aiCreditsRemaining}</span>
        <span className="text-slate-400 font-normal">/{usage.aiCreditsMax}</span>
        {!compact && <span className="text-slate-500 text-[10px]">AI</span>}
      </div>
    </div>
  );
};