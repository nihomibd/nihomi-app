// src/components/dashboard/PastDueWarningBanner.tsx
// Nihomi (にほみ) — Student Dashboard Grace Period Alert

'use client';

import React, { useState } from 'react';
import { differenceInDays, differenceInHours } from 'date-fns';

interface SubscriptionNoticeProps {
  subscription: {
    id: string;
    status: string;
    planId: string;
    gracePeriodEnd: string | Date | null;
  } | null;
}

export const PastDueWarningBanner: React.FC<SubscriptionNoticeProps> = ({ subscription }) => {
  const [minimized, setMinimized] = useState(false);

  if (!subscription || subscription.status !== 'past_due') {
    return null;
  }

  const graceEnd = subscription.gracePeriodEnd ? new Date(subscription.gracePeriodEnd) : null;
  const now = new Date();

  const daysLeft = graceEnd ? Math.max(0, differenceInDays(graceEnd, now)) : 0;
  const hoursLeft = graceEnd ? Math.max(0, differenceInHours(graceEnd, now) % 24) : 0;

  if (minimized) {
    return (
      <div className="bg-amber-500 text-slate-950 px-4 py-2 flex justify-between items-center text-xs font-bold rounded-lg mb-4 shadow-lg">
        <span>⚠️ Subscription Renewal Past Due ({daysLeft}d {hoursLeft}h grace remaining)</span>
        <button onClick={() => setMinimized(false)} className="underline hover:opacity-80">
          View Notice
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-0.5 rounded-2xl shadow-xl mb-6">
      <div className="bg-slate-950/95 backdrop-blur-md rounded-[14px] p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl flex-shrink-0 text-xl border border-amber-500/30">
            ⏳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-white font-bold text-base tracking-tight">Subscription Renewal Required</h4>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] uppercase tracking-wider font-extrabold rounded-full">
                Grace Period Active
              </span>
            </div>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Your latest subscription payment did not go through. Your premium access is protected for the next{' '}
              <strong className="text-amber-400 font-semibold">{daysLeft} days and {hoursLeft} hours</strong>. Complete renewal to avoid disruption to your JLPT progress and AI Coach limits.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setMinimized(true)}
            className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
          >
            Dismiss
          </button>
          <a
            href={`/pricing?renew=${subscription.id}`}
            className="w-full md:w-auto text-center px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs md:text-sm rounded-xl shadow-lg shadow-orange-500/20 transition transform active:scale-95"
          >
            Renew Now →
          </a>
        </div>
      </div>
    </div>
  );
};
