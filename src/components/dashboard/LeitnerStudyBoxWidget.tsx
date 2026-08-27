import React, { useState, useEffect, useMemo } from 'react';
import {
  Boxes,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Flame,
  TrendingUp,
  BrainCircuit,
  Layers,
  Award
} from 'lucide-react';
import {
  getSrsState,
  saveSrsItemReview,
  SrsItemState,
  SrsRating,
  calculateRetentionLevel
} from '../../lib/srs';
import { speakJapanese } from '../../lib/tts';

export interface LeitnerCard {
  id: string;
  type: 'vocabulary' | 'grammar' | 'kanji';
  prompt: string; // e.g. 食べる or 〜てはいけません
  reading?: string;
  meaningEn: string;
  meaningBn: string;
  jlpt: string;
  struggleReason?: string;
}

// Curated pool of core foundational Leitner items for active daily queue
const DEFAULT_LEITNER_CARDS: LeitnerCard[] = [
  {
    id: 'leit-v1',
    type: 'vocabulary',
    prompt: '約束',
    reading: 'やくそく (yakusoku)',
    meaningEn: 'Promise / Appointment',
    meaningBn: 'প্রতিশ্রুতি / নির্দিষ্ট সময়',
    jlpt: 'N4',
    struggleReason: 'Lapsed in previous session • Particle を confusion'
  },
  {
    id: 'leit-g1',
    type: 'grammar',
    prompt: '〜てはいけません',
    reading: '~te wa ikemasen',
    meaningEn: 'Must not / Prohibited',
    meaningBn: 'করা যাবে না / নিষেধ',
    jlpt: 'N5',
    struggleReason: 'Te-form mutation errors'
  },
  {
    id: 'leit-v2',
    type: 'vocabulary',
    prompt: '準備',
    reading: 'じゅんび (junbi)',
    meaningEn: 'Preparation',
    meaningBn: 'প্রস্তুতি',
    jlpt: 'N4',
    struggleReason: 'Low recall speed (<4s threshold)'
  },
  {
    id: 'leit-g2',
    type: 'grammar',
    prompt: 'は (wa) vs が (ga)',
    reading: 'wa vs ga',
    meaningEn: 'Topic Marker vs Subject Marker',
    meaningBn: 'টপিক বনাম নির্দিষ্ট সাবজেক্ট মার্কার',
    jlpt: 'N5',
    struggleReason: 'High error rate in JLPT mock drills'
  },
  {
    id: 'leit-v3',
    type: 'vocabulary',
    prompt: '敬語',
    reading: 'けいご (keigo)',
    meaningEn: 'Honorific Japanese',
    meaningBn: 'সম্মানসূচক জাপানি ভাষা',
    jlpt: 'N3',
    struggleReason: 'Sonkeigo vs Kenjougo distinction'
  },
  {
    id: 'leit-k1',
    type: 'kanji',
    prompt: '食',
    reading: 'ショク / た.べる',
    meaningEn: 'Eat / Food / Meal',
    meaningBn: 'খাওয়া / খাদ্য',
    jlpt: 'N5',
    struggleReason: 'Stroke order check'
  }
];

interface LeitnerStudyBoxWidgetProps {
  onNavigateStudy?: (mode: string) => void;
}

export const LeitnerStudyBoxWidget: React.FC<LeitnerStudyBoxWidgetProps> = ({
  onNavigateStudy
}) => {
  const [srsState, setSrsState] = useState<Record<string, SrsItemState>>({});
  const [selectedBox, setSelectedBox] = useState<number>(1);
  const [activeReviewCardIndex, setActiveReviewCardIndex] = useState<number>(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [recentActionToast, setRecentActionToast] = useState<string | null>(null);

  // Load SRS state on mount
  useEffect(() => {
    const loaded = getSrsState();
    setSrsState(loaded);
  }, []);

  // Map each card to a Leitner Box (1 to 5) based on repetition/interval
  const categorizedCards = useMemo(() => {
    const boxes: Record<number, (LeitnerCard & { state?: SrsItemState; box: number })[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: []
    };

    DEFAULT_LEITNER_CARDS.forEach((card) => {
      const state = srsState[card.id];
      let box = 1;
      if (state) {
        if (state.intervalDays >= 30) box = 5;
        else if (state.intervalDays >= 14) box = 4;
        else if (state.intervalDays >= 7) box = 3;
        else if (state.intervalDays >= 3) box = 2;
        else box = 1;
      }
      boxes[box].push({ ...card, state, box });
    });

    // Prioritize struggling items within each box
    Object.keys(boxes).forEach((key) => {
      const num = Number(key);
      boxes[num].sort((a, b) => {
        const lapsesA = a.state?.lapses || 0;
        const lapsesB = b.state?.lapses || 0;
        return lapsesB - lapsesA;
      });
    });

    return boxes;
  }, [srsState]);

  const activeBoxCards = categorizedCards[selectedBox] || [];
  const currentCard = activeBoxCards[activeReviewCardIndex % (activeBoxCards.length || 1)];

  const handleRate = (rating: SrsRating) => {
    if (!currentCard) return;

    const updated = saveSrsItemReview(currentCard.id, rating, currentCard.state, currentCard.type);
    setSrsState((prev) => ({ ...prev, [currentCard.id]: updated }));
    setIsAnswerRevealed(false);

    let message = '';
    if (rating === 'again') {
      message = `⚠️ Moved back to Leitner Box 1 (Daily Review)`;
    } else if (rating === 'easy' || rating === 'good') {
      message = `✨ Promoted! Next review in ${updated.intervalDays} days`;
    } else {
      message = `🔄 Retained in current interval (${updated.intervalDays}d)`;
    }

    setRecentActionToast(message);
    setTimeout(() => setRecentActionToast(null), 3000);

    if (activeReviewCardIndex + 1 < activeBoxCards.length) {
      setActiveReviewCardIndex((prev) => prev + 1);
    } else {
      setActiveReviewCardIndex(0);
    }
  };

  const totalDueToday = (categorizedCards[1]?.length || 0) + (categorizedCards[2]?.length || 0);

  return (
    <div
      id="leitner-study-box-widget"
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs text-left space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-[10px] font-bold uppercase rounded-md font-mono">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Leitner SRS Spaced Repetition Engine</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">
            Daily Adaptive Leitner Review Deck
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Intelligently schedules struggling grammar particles & vocabulary items based on lapse history.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="px-3 py-1 bg-red-600 text-white font-mono font-bold text-xs rounded-xl shadow-2xs">
            {totalDueToday} Due Today
          </span>
        </div>
      </div>

      {/* 5 LEITNER BOXES SELECTOR */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {[
          { box: 1, label: 'Box 1: Daily', interval: '1 Day', color: 'border-red-500', count: categorizedCards[1]?.length || 0 },
          { box: 2, label: 'Box 2: 3-Day', interval: '3 Days', color: 'border-amber-500', count: categorizedCards[2]?.length || 0 },
          { box: 3, label: 'Box 3: Weekly', interval: '7 Days', color: 'border-blue-500', count: categorizedCards[3]?.length || 0 },
          { box: 4, label: 'Box 4: Bi-Weekly', interval: '14 Days', color: 'border-purple-500', count: categorizedCards[4]?.length || 0 },
          { box: 5, label: 'Box 5: Mastered', interval: '30+ Days', color: 'border-emerald-500', count: categorizedCards[5]?.length || 0 },
        ].map((item) => {
          const isSelected = selectedBox === item.box;
          return (
            <button
              key={item.box}
              onClick={() => {
                setSelectedBox(item.box);
                setActiveReviewCardIndex(0);
                setIsAnswerRevealed(false);
              }}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm ring-2 ring-red-500/20'
                  : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
                  {item.label}
                </span>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                    isSelected
                      ? 'bg-red-600 text-white'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200'
                  }`}
                >
                  {item.count}
                </span>
              </div>
              <div className="text-[10px] opacity-70 font-mono mt-1">
                Cycle: {item.interval}
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE CARD REVIEW INTERACTIVE PANEL */}
      {currentCard ? (
        <div className="bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-6 space-y-4">
          
          {/* Card Meta & Badges */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-[10px] font-bold font-mono uppercase">
                {currentCard.type}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-[10px] font-bold font-mono">
                JLPT {currentCard.jlpt}
              </span>
              {currentCard.struggleReason && (
                <span className="inline-flex items-center space-x-1 text-[10px] text-amber-700 dark:text-amber-400 font-semibold bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                  <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                  <span className="truncate max-w-[200px]">{currentCard.struggleReason}</span>
                </span>
              )}
            </div>

            <button
              onClick={() => speakJapanese(currentCard.prompt)}
              className="p-2 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition cursor-pointer"
              title="Speak Term"
            >
              <Volume2 className="w-4 h-4 text-red-600" />
            </button>
          </div>

          {/* Flash Prompt */}
          <div className="text-center py-4 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-white">
              {currentCard.prompt}
            </h2>
            {currentCard.reading && (
              <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                {currentCard.reading}
              </p>
            )}
          </div>

          {/* Revealed Answer or Reveal Trigger */}
          {!isAnswerRevealed ? (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsAnswerRevealed(true)}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-stone-950 font-bold text-xs rounded-2xl shadow-xs transition cursor-pointer"
              >
                Reveal Meaning & Leitner Options
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in pt-2 border-t border-stone-200 dark:border-stone-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">English</span>
                  <p className="font-bold text-stone-900 dark:text-white mt-0.5">{currentCard.meaningEn}</p>
                </div>
                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">বাংলা অর্থ</span>
                  <p className="font-bold text-red-600 dark:text-red-400 mt-0.5">{currentCard.meaningBn}</p>
                </div>
              </div>

              {/* SM-2 / Leitner Recall Rating Buttons */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block font-mono text-center">
                  How well did you recall this item?
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleRate('again')}
                    className="p-2.5 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/80 dark:hover:bg-red-900 text-red-700 dark:text-red-300 text-xs font-bold transition cursor-pointer border border-red-300 dark:border-red-800 text-center"
                  >
                    <div className="text-[10px] opacity-70">Forgot</div>
                    <div>Again (Box 1)</div>
                  </button>
                  <button
                    onClick={() => handleRate('hard')}
                    className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold transition cursor-pointer border border-amber-300 dark:border-amber-800 text-center"
                  >
                    <div className="text-[10px] opacity-70">Struggled</div>
                    <div>Hard</div>
                  </button>
                  <button
                    onClick={() => handleRate('good')}
                    className="p-2.5 rounded-xl bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/80 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold transition cursor-pointer border border-blue-300 dark:border-blue-800 text-center"
                  >
                    <div className="text-[10px] opacity-70">Recalled</div>
                    <div>Good</div>
                  </button>
                  <button
                    onClick={() => handleRate('easy')}
                    className="p-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition cursor-pointer border border-emerald-300 dark:border-emerald-800 text-center"
                  >
                    <div className="text-[10px] opacity-70">Instant</div>
                    <div>Easy (+1 Box)</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action toast confirmation */}
          {recentActionToast && (
            <div className="p-2 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 rounded-xl border border-emerald-300 dark:border-emerald-800 animate-in fade-in">
              {recentActionToast}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-stone-50 dark:bg-stone-950/20 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <h4 className="text-sm font-bold text-stone-900 dark:text-white">
            Box {selectedBox} is Clean & Up to Date!
          </h4>
          <p className="text-xs text-stone-500">
            No items due for review in this Leitner bucket today.
          </p>
        </div>
      )}

      {/* Quick Footer Action */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-stone-500 dark:text-stone-400">
          Prioritizes items with high lapse rates & weak particle mastery
        </span>
        {onNavigateStudy && (
          <button
            type="button"
            onClick={() => onNavigateStudy('flashcards')}
            className="inline-flex items-center space-x-1 text-red-600 dark:text-red-400 font-bold hover:underline cursor-pointer"
          >
            <span>Open Full Flashcards Deck</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
