// src/components/simulation/conbini/ConbiniHotSnackCase.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Sparkles, Plus, Check } from 'lucide-react';
import { HotSnackMenuItem } from '../../../data/conbiniBrands';
import { soundEffects } from '../../../lib/soundEffects';

interface ConbiniHotSnackCaseProps {
  brandNameJa: string;
  brandCaseTitleJa: string;
  hotSnacks: HotSnackMenuItem[];
  targetHotSnackId?: string;
  onSelectHotSnack: (item: HotSnackMenuItem) => void;
  packagedSnacks: string[];
}

export const ConbiniHotSnackCase: React.FC<ConbiniHotSnackCaseProps> = ({
  brandNameJa,
  brandCaseTitleJa,
  hotSnacks,
  targetHotSnackId,
  onSelectHotSnack,
  packagedSnacks
}) => {
  const [activeTongItem, setActiveTongItem] = useState<string | null>(null);

  const handleGrabSnack = (item: HotSnackMenuItem) => {
    soundEffects.playHotSnackTong();
    setActiveTongItem(item.id);

    setTimeout(() => {
      onSelectHotSnack(item);
      setActiveTongItem(null);
    }, 600);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900/90 to-stone-950 border-2 border-amber-500/40 shadow-2xl p-4 flex flex-col justify-between">
      {/* Warm Halogen Heat Lamp Glow Effect */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-72 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>

      {/* Case Header: Brand Title & Digital LED Thermometer */}
      <div className="relative z-10 flex items-center justify-between border-b border-amber-500/30 pb-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
          <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
          <span>{brandCaseTitleJa}</span>
        </div>

        {/* Digital Thermometer */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/80 border border-amber-500/40 font-mono text-[10px] text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>74.8°C 保温適温</span>
        </div>
      </div>

      {/* Glass Showcase Chamber with Metallic Wire Racks */}
      <div className="relative z-10 space-y-2.5">
        {hotSnacks.map((snack) => {
          const isTarget = snack.id === targetHotSnackId;
          const isGrabbed = packagedSnacks.includes(snack.id);
          const isAnimating = activeTongItem === snack.id;

          return (
            <div
              key={snack.id}
              className={`relative p-3 rounded-2xl border transition-all overflow-hidden flex items-center justify-between ${
                isTarget
                  ? 'bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-stone-900 border-amber-400 shadow-lg ring-1 ring-amber-400/50'
                  : 'bg-stone-950/80 border-stone-800 hover:border-amber-500/40'
              }`}
            >
              {/* Hot Food Item Details */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shadow-inner relative">
                  <span>{snack.imageEmoji}</span>
                  {/* Subtle steam icon */}
                  <span className="absolute -top-1 right-0 text-[10px] animate-bounce">♨️</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-amber-100">
                      {snack.nameJa}
                    </span>
                    {isTarget && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500 text-white animate-pulse">
                        注文品
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-amber-400 font-bold mt-0.5">
                    ¥{snack.priceYen} (税込)
                  </div>
                </div>
              </div>

              {/* Tongs Grab Action Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => handleGrabSnack(snack)}
                  disabled={isGrabbed || isAnimating}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-md ${
                    isGrabbed
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : isTarget
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black scale-105 shadow-orange-500/30'
                      : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {isGrabbed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>袋詰済</span>
                    </>
                  ) : isAnimating ? (
                    <span className="animate-spin">🥢 トング</span>
                  ) : (
                    <>
                      <span>🥢</span>
                      <span>トングで取る</span>
                    </>
                  )}
                </button>
              </div>

              {/* Animated Pouch Sliding Overlay */}
              <AnimatePresence>
                {isAnimating && (
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    className="absolute inset-0 bg-amber-500/90 flex items-center justify-center gap-2 text-slate-950 font-black text-xs z-20"
                  >
                    <span>♨️ 専用ペーパーバッグに包装中...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Tongs Holder Stand Bottom Bar */}
      <div className="relative z-10 mt-3 pt-2 border-t border-stone-800 text-[10px] text-stone-400 flex items-center justify-between font-mono">
        <span>🥢 専用トング滅菌ケース備付</span>
        <span className="text-amber-400">{brandNameJa} ホットデリカ</span>
      </div>
    </div>
  );
};
