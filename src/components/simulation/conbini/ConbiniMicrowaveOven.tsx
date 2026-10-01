// src/components/simulation/conbini/ConbiniMicrowaveOven.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Clock, CheckCircle2, RotateCw } from 'lucide-react';
import { soundEffects } from '../../../lib/soundEffects';

interface ConbiniMicrowaveOvenProps {
  isRunning: boolean;
  secondsLeft: number;
  isCompleted: boolean;
  bentoNameJa?: string;
  onOpenMicrowave?: () => void;
}

export const ConbiniMicrowaveOven: React.FC<ConbiniMicrowaveOvenProps> = ({
  isRunning,
  secondsLeft,
  isCompleted,
  bentoNameJa = '特製幕の内弁当',
  onOpenMicrowave
}) => {
  useEffect(() => {
    if (isCompleted) {
      soundEffects.playMicrowaveBeep();
    }
  }, [isCompleted]);

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-700 shadow-2xl p-4 space-y-3">
      {/* Microwave Brand & Power Label */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
          <span className="text-xs font-black text-slate-200">
            業務用1500W 高速スチームレンジ
          </span>
        </div>

        {/* Digital LED Timer */}
        <div className="px-2.5 py-0.5 rounded-lg bg-black font-mono text-xs font-black border border-slate-800 text-amber-400 flex items-center gap-1.5 shadow-inner">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>
            {isRunning ? `00:0${secondsLeft}` : isCompleted ? 'END [完了]' : '1500W 待機'}
          </span>
        </div>
      </div>

      {/* Microwave Door & Chamber Window */}
      <div className="relative h-28 rounded-2xl bg-black border-4 border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
        {/* Amber Interior Light Glow when Heating */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-amber-500/25 flex items-center justify-center"
            >
              {/* Turntable Rotation Guide */}
              <div className="w-20 h-20 rounded-full border border-dashed border-amber-400/40 animate-spin"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bento inside chamber */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="text-3xl">
            {isCompleted ? '♨️ 🍱' : '🍱'}
          </div>
          <div className="text-[10px] font-mono text-slate-300 mt-1 font-bold">
            {bentoNameJa}
          </div>

          {/* Steaming Vapor Particle Effect */}
          {isCompleted && (
            <span className="text-xs text-amber-300 font-bold animate-bounce mt-0.5">
              熱々！取り出し可能 75°C
            </span>
          )}
        </div>

        {/* Door Latch Handle on right */}
        <div className="absolute right-2 top-3 bottom-3 w-2 rounded-full bg-slate-700 border border-slate-600 shadow-md"></div>
      </div>

      {/* Microwave Control Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-[9px] text-slate-500 font-mono">出力切替</div>
          <div className="text-[11px] font-bold text-amber-400">1500W 超高速</div>
        </div>

        <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-[9px] text-slate-500 font-mono">加熱目安</div>
          <div className="text-[11px] font-bold text-slate-300">お弁当 約20秒</div>
        </div>

        <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-[9px] text-slate-500 font-mono">安全機能</div>
          <div className="text-[11px] font-bold text-emerald-400">やけど防止</div>
        </div>
      </div>
    </div>
  );
};
