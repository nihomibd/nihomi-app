// src/components/simulation/conbini/ConbiniCartoneTray.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Check, ArrowRight, Volume2 } from 'lucide-react';
import { soundEffects } from '../../../lib/soundEffects';
import { speakJapanese } from '../../../lib/tts';

interface ConbiniCartoneTrayProps {
  totalAmountYen: number;
  tenderedAmountYen: number;
  isDrawerOpen: boolean;
  isPaymentApproved: boolean;
  onOpenDrawerAndTender: () => void;
  onCompleteChangeHandover: () => void;
}

export const ConbiniCartoneTray: React.FC<ConbiniCartoneTrayProps> = ({
  totalAmountYen,
  tenderedAmountYen,
  isDrawerOpen,
  isPaymentApproved,
  onOpenDrawerAndTender,
  onCompleteChangeHandover
}) => {
  const changeDueYen = Math.max(0, tenderedAmountYen - totalAmountYen);
  const isTenThousand = tenderedAmountYen >= 10000;
  const isFiveThousand = tenderedAmountYen >= 5000 && tenderedAmountYen < 10000;
  const isOneThousand = tenderedAmountYen >= 1000 && tenderedAmountYen < 5000;

  const handleDepositClick = () => {
    soundEffects.playCashDrawerPop();
    speakJapanese(`${tenderedAmountYen}円、お預かりいたします。`);
    onOpenDrawerAndTender();
  };

  const handleHandoverChange = () => {
    soundEffects.playCoinDrop();
    speakJapanese(`お釣り、${changeDueYen}円のお返しと、レシートでございます。ありがとうございました。`);
    onCompleteChangeHandover();
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 border-2 border-blue-500/50 shadow-2xl p-4 flex flex-col justify-between">
      {/* Tray Header */}
      <div className="flex items-center justify-between border-b border-blue-500/30 pb-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-black text-sky-300">
          <Coins className="w-4 h-4 text-sky-400" />
          <span>現金受け渡しトレイ (カルトン - Cartone Tray)</span>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-900/60 text-sky-200 border border-blue-500/40">
          お会計台直置
        </span>
      </div>

      {/* The Physical Blue Acrylic Mat with Raised Rubber Nubs */}
      <div className="relative min-h-[140px] rounded-2xl bg-gradient-to-br from-blue-700 via-sky-800 to-blue-950 border-4 border-blue-400/80 shadow-inner p-3 flex flex-col items-center justify-center select-none overflow-hidden">
        {/* Raised Rubber Grips Grid Simulation */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-40 pointer-events-none"></div>

        {/* Japanese Banknote & Yen Coins Resting on Tray */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          {/* Banknote */}
          {tenderedAmountYen >= 1000 && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`w-44 h-20 rounded-lg p-2 border-2 shadow-2xl flex flex-col justify-between transform rotate-[-2deg] ${
                isTenThousand
                  ? 'bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 border-amber-500 text-amber-950'
                  : isFiveThousand
                  ? 'bg-gradient-to-r from-purple-100 via-purple-200 to-purple-100 border-purple-500 text-purple-950'
                  : 'bg-gradient-to-r from-sky-100 via-sky-200 to-sky-100 border-sky-500 text-sky-950'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] font-serif font-black tracking-wider">
                <span>日本銀行券</span>
                <span className="font-mono font-bold">NIPPON GINKO</span>
              </div>

              <div className="text-center font-serif font-black text-base tracking-widest">
                {isTenThousand ? '壱 万円 (¥10,000)' : isFiveThousand ? '五 千円 (¥5,000)' : '千 円 (¥1,000)'}
              </div>

              <div className="flex justify-between items-center text-[9px] font-mono font-bold">
                <span>国立印刷局製造</span>
                <span>{tenderedAmountYen.toLocaleString()} YEN</span>
              </div>
            </motion.div>
          )}

          {/* Yen Coins Clustered on Mat */}
          <div className="flex items-center gap-2 mt-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 border border-amber-600 shadow-md flex items-center justify-center font-black text-[10px] text-amber-950">
              500
            </div>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 border border-slate-500 shadow-md flex items-center justify-center font-black text-[9px] text-slate-900">
              100
            </div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border border-amber-900 shadow-md flex items-center justify-center font-black text-[8px] text-amber-100">
              10
            </div>
          </div>
        </div>
      </div>

      {/* Cashier Verbal Announcement & Drawer Action Controls */}
      <div className="mt-3 space-y-2">
        {!isDrawerOpen && !isPaymentApproved ? (
          <button
            type="button"
            onClick={handleDepositClick}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white font-black text-xs transition shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2"
          >
            <span>💰 「{tenderedAmountYen}円お預かりいたします」 (レジ開閉)</span>
          </button>
        ) : isDrawerOpen && !isPaymentApproved ? (
          <div className="space-y-2">
            {/* Change Breakdown */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold">お釣り (Change Due):</span>
              <span className="font-mono text-base font-black text-emerald-400">
                ¥{changeDueYen.toLocaleString()}
              </span>
            </div>

            <button
              type="button"
              onClick={handleHandoverChange}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>「お釣り{changeDueYen}円のお返しとレシートです」</span>
            </button>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-center text-xs text-emerald-300 font-bold flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>現金決済・お釣り受け渡し完了</span>
          </div>
        )}
      </div>
    </div>
  );
};
