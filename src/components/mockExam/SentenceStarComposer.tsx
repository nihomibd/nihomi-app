import React, { useState, useEffect } from 'react';
import { Star, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';

interface SentenceStarComposerProps {
  questionTextJa?: string;
  scrambledParts: string[]; // e.g. ['1: 新しい', '2: デパートで', '3: かばんを', '4: きれいな']
  starPositionIndex: number; // 0, 1, 2, or 3
  selectedOptionIndex: number;
  onSelectOption: (optionIndex: number) => void;
  isReadOnly?: boolean;
}

export const SentenceStarComposer: React.FC<SentenceStarComposerProps> = ({
  questionTextJa,
  scrambledParts,
  starPositionIndex = 2,
  selectedOptionIndex,
  onSelectOption,
  isReadOnly = false
}) => {
  // Ordered slots: array of 4 indices (0, 1, 2, 3) pointing to scrambledParts, or -1 if empty
  const [slots, setSlots] = useState<number[]>([-1, -1, -1, -1]);

  useEffect(() => {
    // If selectedOptionIndex is already set from past choice, we can reflect it
    if (selectedOptionIndex >= 0 && selectedOptionIndex < scrambledParts.length) {
      if (slots[starPositionIndex] !== selectedOptionIndex) {
        const newSlots = [...slots];
        newSlots[starPositionIndex] = selectedOptionIndex;
        setSlots(newSlots);
      }
    }
  }, [selectedOptionIndex]);

  const handlePlacePart = (partIndex: number) => {
    if (isReadOnly) return;

    // Check if already placed in slots
    const existingSlotIndex = slots.indexOf(partIndex);
    if (existingSlotIndex >= 0) {
      // Remove from that slot
      const newSlots = [...slots];
      newSlots[existingSlotIndex] = -1;
      setSlots(newSlots);
      if (existingSlotIndex === starPositionIndex) {
        onSelectOption(-1);
      }
      return;
    }

    // Find first empty slot
    const firstEmpty = slots.indexOf(-1);
    if (firstEmpty >= 0) {
      const newSlots = [...slots];
      newSlots[firstEmpty] = partIndex;
      setSlots(newSlots);

      // If placed in star position, notify parent
      if (firstEmpty === starPositionIndex) {
        onSelectOption(partIndex);
      }
    }
  };

  const handleClearSlot = (slotIdx: number) => {
    if (isReadOnly) return;
    const newSlots = [...slots];
    newSlots[slotIdx] = -1;
    setSlots(newSlots);
    if (slotIdx === starPositionIndex) {
      onSelectOption(-1);
    }
  };

  const handleReset = () => {
    if (isReadOnly) return;
    setSlots([-1, -1, -1, -1]);
    onSelectOption(-1);
  };

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-slate-900/90 p-5 shadow-lg mb-6">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Star className="w-4 h-4 fill-amber-400" />
          </div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            JLPT Star Sentence Builder (文の組み立て ★)
          </span>
        </div>
        {!isReadOnly && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset Slots
          </button>
        )}
      </div>

      {questionTextJa && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4 text-center">
          <p className="font-japanese text-base md:text-lg font-bold text-slate-100">
            {questionTextJa}
          </p>
        </div>
      )}

      {/* 4 Interactive Drop Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        {[0, 1, 2, 3].map((slotIdx) => {
          const isStarSlot = slotIdx === starPositionIndex;
          const assignedPartIndex = slots[slotIdx];
          const hasPart = assignedPartIndex >= 0;
          const partText = hasPart ? scrambledParts[assignedPartIndex] : null;

          return (
            <div
              key={slotIdx}
              onClick={() => hasPart && handleClearSlot(slotIdx)}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer min-h-[76px] text-center ${
                isStarSlot
                  ? 'border-amber-500/60 bg-amber-500/10 ring-2 ring-amber-500/30 shadow-md shadow-amber-500/10'
                  : 'border-slate-700 bg-slate-950/60 hover:border-slate-600'
              }`}
            >
              <div className="absolute top-1.5 left-2 flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-500">Slot {slotIdx + 1}</span>
                {isStarSlot && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
              </div>

              {hasPart ? (
                <div className="mt-2 font-japanese font-semibold text-xs sm:text-sm text-slate-100">
                  {partText}
                </div>
              ) : (
                <span className="mt-2 text-xs text-slate-600 font-medium">
                  {isStarSlot ? '★ [Drop Star Target]' : '[Empty]'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Available Scrambled Tiles */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 block mb-2">
          Click tiles to place them into the sentence:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {scrambledParts.map((part, idx) => {
            const isPlaced = slots.includes(idx);
            const isSelectedStar = selectedOptionIndex === idx;

            return (
              <button
                key={idx}
                type="button"
                disabled={isReadOnly}
                onClick={() => handlePlacePart(idx)}
                className={`p-3 rounded-xl text-left border font-japanese font-medium text-xs sm:text-sm transition-all flex items-center justify-between ${
                  isPlaced
                    ? 'bg-slate-800/40 border-slate-700/50 text-slate-500 opacity-60'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-100 shadow-sm hover:border-amber-500/40'
                } ${isSelectedStar ? 'ring-2 ring-amber-500' : ''}`}
              >
                <span>{part}</span>
                {isPlaced ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                    Placed
                  </span>
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
