import React, { useState } from 'react';
import { ReviewMistake } from '../types';

interface RecentMistakesProps {
  mistakes: ReviewMistake[];
  onOpenMistakeBook?: () => void;
}

export const RecentMistakes: React.FC<RecentMistakesProps> = ({
  mistakes,
  onOpenMistakeBook,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (mistakes.length === 0) {
    return (
      <section className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
        <h2 className="text-base font-bold text-stone-900 tracking-tight mb-1">
          Review Your Mistakes <span className="text-xs font-medium text-stone-500 font-sans">| ভুলের খাতা</span>
        </h2>
        <p className="text-xs text-stone-500">
          অভিনন্দন! বর্তমানে কোনো ভুল জমে নেই।
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="mistakes-heading" className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <h2 id="mistakes-heading" className="text-base font-bold text-stone-900 tracking-tight">
            Review Your Mistakes <span className="text-xs font-medium text-stone-500 font-sans">| মেমোরি ও ভুলের খাতা</span>
          </h2>
          <p className="text-xs text-stone-500">
            {mistakes.length} items flagged by NIHOMI MemoryOS
          </p>
        </div>

        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
          Personal
        </span>
      </div>

      <div className="space-y-2 mt-2">
        {mistakes.map((item) => {
          const isExpanded = selectedId === item.id;
          return (
            <div
              key={item.id}
              className="border border-stone-200 rounded-xl p-3 hover:border-stone-300 transition-colors bg-stone-50/40"
            >
              <div 
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => setSelectedId(isExpanded ? null : item.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-stone-900 font-sans">
                    {item.pattern}
                  </span>
                  {item.patternJapanese && (
                    <span className="text-[11px] text-stone-400 font-sans">
                      ({item.patternJapanese})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-500">
                    Missed {item.missedCount}x
                  </span>
                  <span className="text-xs text-stone-400">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-2 pt-2 border-t border-stone-200 text-xs text-stone-700 space-y-1">
                  <p className="text-stone-600 font-medium leading-relaxed">
                    💡 <span className="font-semibold text-stone-800">সহজ ব্যাখ্যা:</span> {item.hintBn}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Last missed: {item.lastMissed}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-2 border-t border-stone-100">
        <button
          type="button"
          onClick={onOpenMistakeBook}
          className="w-full py-2.5 px-4 rounded-xl border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-50 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-stone-400"
        >
          <span>Open Personal Mistake Book</span>
          <span className="text-stone-400">→</span>
        </button>
      </div>
    </section>
  );
};