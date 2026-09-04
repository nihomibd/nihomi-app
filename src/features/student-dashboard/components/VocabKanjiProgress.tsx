import React from 'react';
import { MasteryStat } from '../types';

interface VocabKanjiProgressProps {
  vocabulary: MasteryStat;
  kanji: MasteryStat;
  onPracticeKanji?: () => void;
  onPracticeVocabulary?: () => void;
}

export const VocabKanjiProgress: React.FC<VocabKanjiProgressProps> = ({
  vocabulary,
  kanji,
  onPracticeKanji,
  onPracticeVocabulary,
}) => {
  const vocabPercent = Math.round((vocabulary.completed / vocabulary.total) * 100);
  const kanjiPercent = Math.round((kanji.completed / kanji.total) * 100);

  return (
    <div className="grid grid-cols-2 gap-3">
      <button type="button" onClick={onPracticeVocabulary} aria-label="Review daily vocabulary flashcards" className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-2 text-left transition-all hover:border-rose-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Vocabulary
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold font-sans">
            単語
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-stone-900">{vocabulary.completed}</span>
            <span className="text-xs text-stone-400">/{vocabulary.total}</span>
          </div>
          <p className="text-[11px] text-stone-500 font-medium">
            {vocabPercent}% JLPT N5 words
          </p>
        </div>

        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-rose-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${vocabPercent}%` }}
          />
        </div>
        <p className="text-[10px] font-bold text-rose-700">Tap to review daily action words</p>
      </button>

      <button type="button" onClick={onPracticeKanji} aria-label="Tap to Practice Kanji of the Day" className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-2 text-left transition-all hover:border-amber-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Kanji
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold font-sans">
            漢字
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-stone-900">{kanji.completed}</span>
            <span className="text-xs text-stone-400">/{kanji.total}</span>
          </div>
          <p className="text-[11px] text-stone-500 font-medium">
            {kanjiPercent}% target kanji
          </p>
        </div>

        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${kanjiPercent}%` }}
          />
        </div>
        <p className="text-[10px] font-bold text-amber-700">Tap to Practice Kanji of the Day</p>
      </button>
    </div>
  );
};