import React from 'react';
import { ArrowRight, Briefcase, CheckCircle2 } from 'lucide-react';

interface BaitoReadinessCardProps {
  onLaunch?: () => void;
}

export const BaitoReadinessCard: React.FC<BaitoReadinessCardProps> = ({ onLaunch }) => {
  return (
    <section aria-labelledby="baito-readiness-heading" className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-amber-50 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <Briefcase size={21} aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-700">Japan Work Track</p>
            <h2 id="baito-readiness-heading" className="mt-1 text-base font-bold text-stone-950">BaitoOS™ Readiness</h2>
            <p className="mt-1 text-xs font-medium text-stone-500">জাপানে পার্ট-টাইম কাজের প্রস্তুতি</p>
          </div>
        </div>
        <span className="text-2xl font-black text-sky-700">74%</span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-sky-100" role="progressbar" aria-label="Japan job readiness" aria-valuenow={74} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full w-[74%] rounded-full bg-sky-600" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-stone-700">
        <div className="flex items-center gap-1.5 rounded-xl bg-white/80 px-3 py-2"><CheckCircle2 className="text-emerald-600" size={15} aria-hidden="true" /> Conbini POS ready</div>
        <div className="flex items-center gap-1.5 rounded-xl bg-white/80 px-3 py-2"><CheckCircle2 className="text-emerald-600" size={15} aria-hidden="true" /> Interview 4/5</div>
      </div>

      <button type="button" onClick={onLaunch} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
        Launch BaitoOS™ <ArrowRight size={17} aria-hidden="true" />
      </button>
    </section>
  );
};

export default BaitoReadinessCard;
