import React from 'react';
import { ArrowRight, Briefcase, CheckCircle2 } from 'lucide-react';

interface BaitoReadinessCardProps {
  onLaunch?: () => void;
  onLaunchConbini?: () => void;
  readinessScore?: number;
}

export const BaitoReadinessCard: React.FC<BaitoReadinessCardProps> = ({ onLaunch, onLaunchConbini, readinessScore = 74 }) => {
  return (
    <section aria-labelledby="workos-readiness-heading" className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-sky-50 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <Briefcase size={21} aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">Nihomi WorkOS™</p>
            <h2 id="workos-readiness-heading" className="mt-1 text-base font-bold text-stone-950">WorkOS™ Readiness</h2>
            <p className="mt-1 text-xs font-medium text-stone-500">Experience Japan. Before You Arrive.</p>
          </div>
        </div>
        <span className="text-2xl font-black text-amber-700">{readinessScore}%</span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-amber-100" role="progressbar" aria-label="Japan workplace readiness" aria-valuenow={readinessScore} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-amber-600" style={{ width: `${readinessScore}%` }} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-stone-700">
        <button type="button" onClick={onLaunchConbini} className="flex items-center gap-1.5 rounded-xl bg-white/80 px-3 py-2 text-left hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer">
          <CheckCircle2 className="text-emerald-600" size={15} aria-hidden="true" /> Conbini POS
        </button>
        <button type="button" onClick={onLaunch} className="flex items-center gap-1.5 rounded-xl bg-white/80 px-3 py-2 text-left hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer">
          <CheckCircle2 className="text-emerald-600" size={15} aria-hidden="true" /> Work Passport
        </button>
      </div>

      <button type="button" onClick={onLaunch} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer">
        Enter WorkOS™ Simulator <ArrowRight size={17} aria-hidden="true" />
      </button>
    </section>
  );
};

export const NihomiWorkOsReadinessCard = BaitoReadinessCard;
export default BaitoReadinessCard;
