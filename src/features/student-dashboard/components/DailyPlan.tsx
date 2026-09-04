import React from 'react';
import { DailyPlanItem } from '../types';

interface DailyPlanProps {
  planItems: DailyPlanItem[];
  onSelectTask?: (taskId: string) => void;
  onOpenVocabulary?: () => void;
  onOpenListening?: () => void;
}

export const DailyPlan: React.FC<DailyPlanProps> = ({ planItems, onSelectTask, onOpenVocabulary, onOpenListening }) => {
  const completedCount = planItems.filter((i) => i.status === 'completed').length;
  const totalCount = planItems.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section aria-labelledby="daily-plan-heading" className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <h2 id="daily-plan-heading" className="text-base font-bold text-stone-900 tracking-tight">
            Today's Goal <span className="text-xs font-medium text-stone-500 font-sans">| আজকের লক্ষ্য</span>
          </h2>
          <p className="text-xs text-stone-500">
            {completedCount} of {totalCount} completed ({percent}%)
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
          <span className={percent === 100 ? "text-emerald-600" : "text-stone-700"}>
            {percent}%
          </span>
        </div>
      </div>

      <ul className="space-y-2.5 mt-2" role="list">
        {planItems.map((item) => {
          const isDone = item.status === 'completed';
          const isInProgress = item.status === 'in_progress';

          return (
            <li
              key={item.id}
              onClick={() => {
                if (item.type === 'vocabulary') onOpenVocabulary?.();
                else if (item.type === 'listening') onOpenListening?.();
                else onSelectTask?.(item.id);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  if (item.type === 'vocabulary') onOpenVocabulary?.();
                  else if (item.type === 'listening') onOpenListening?.();
                  else onSelectTask?.(item.id);
                }
              }}
              className={`group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                isDone
                  ? 'bg-stone-50 border-stone-200 opacity-80'
                  : isInProgress
                  ? 'bg-rose-50/40 border-rose-200 ring-1 ring-rose-200'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                ) : isInProgress ? (
                  <span className="w-5 h-5 rounded-full border-2 border-rose-500 flex items-center justify-center text-[10px] text-rose-600 font-bold animate-pulse">
                    ●
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full border border-stone-300 flex items-center justify-center text-stone-400 text-xs">
                    ○
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className={`text-xs font-semibold truncate ${isDone ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                    {item.title}
                  </p>
                  {isInProgress && (
                    <span className="text-[10px] uppercase font-bold text-rose-600 px-1.5 py-0.5 rounded bg-rose-100 shrink-0">
                      Next Up
                    </span>
                  )}
                </div>

                {item.titleBangla && (
                  <p className="text-[11px] text-stone-500 truncate mt-0.5">
                    {item.titleBangla}
                  </p>
                )}

                <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                  <span>{item.detail}</span>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};