import React from 'react';
import { JLPTProgressData } from '../types';

interface JLPTProgressProps {
  progress: JLPTProgressData;
  onTakeMockExam?: () => void;
}

export const JLPTProgress: React.FC<JLPTProgressProps> = ({ progress, onTakeMockExam }) => {
  const modules = [
    { key: 'vocabulary', label: 'Vocabulary', labelJa: '語彙 (Goi)', percent: progress.modules.vocabulary, color: 'bg-rose-500' },
    { key: 'grammar', label: 'Grammar', labelJa: '文法 (Bunpou)', percent: progress.modules.grammar, color: 'bg-indigo-500' },
    { key: 'kanji', label: 'Kanji', labelJa: '漢字 (Kanji)', percent: progress.modules?.kanji, color: 'bg-amber-500' },
    { key: 'listening', label: 'Listening', labelJa: '聴解 (Choukai)', percent: progress.modules.listening, color: 'bg-emerald-500' },
    { key: 'reading', label: 'Reading', labelJa: '読解 (Dokkai)', percent: progress.modules.reading, color: 'bg-sky-500' },
  ];

  return (
    <section aria-labelledby="jlpt-progress-heading" className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 id="jlpt-progress-heading" className="text-base font-bold text-stone-900 tracking-tight">
            JLPT {progress.level} Core
          </h2>
          <p className="text-xs text-stone-500 font-medium">Syllabus Mastery</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-rose-600 font-mono">{progress.overallPercent}%</span>
        </div>
      </div>

      <div className="space-y-3">
        {modules.map((m) => (
          <div key={m.key} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="text-stone-800">{m.label}</span>
                <span className="text-[10px] text-stone-400 font-sans">{m.labelJa}</span>
              </div>
              <span className="text-stone-600 font-semibold">{m.percent}%</span>
            </div>

            <div 
              role="progressbar" 
              aria-valuenow={m.percent} 
              aria-valuemin={0} 
              aria-valuemax={100}
              className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden"
            >
              <div
                className={`${m.color} h-1.5 rounded-full transition-all duration-500`}
                style={{ width: `${m.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onTakeMockExam}
        aria-label="Take N5 Mock Exam"
        className="btn-haptic mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-xs font-bold text-white transition-all hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer shadow-xs"
      >
        <span>Take N5 Mock Exam ➔</span>
      </button>
    </section>
  );
};