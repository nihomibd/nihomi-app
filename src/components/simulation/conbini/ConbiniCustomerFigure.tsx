// src/components/simulation/conbini/ConbiniCustomerFigure.tsx
import React from 'react';
import { motion } from 'motion/react';
import { Volume2, Sparkles, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { speakJapanese } from '../../../lib/tts';

interface ConbiniCustomerFigureProps {
  customerType: 'student' | 'salaryman' | 'grandma' | 'foreigner' | 'rush_hour';
  customerName: string;
  roleTitleJa: string;
  roleTitleBn: string;
  dialogueText: {
    ja: string;
    romaji: string;
    bn: string;
  };
  mode: 'training' | 'shift';
  isHotSnackWanted?: boolean;
  hotSnackNameJa?: string;
  paymentMethod?: 'cash' | 'suica' | 'paypay' | 'credit';
  isPaying?: boolean;
  patienceRemainingSeconds?: number;
}

export const ConbiniCustomerFigure: React.FC<ConbiniCustomerFigureProps> = ({
  customerType,
  customerName,
  roleTitleJa,
  roleTitleBn,
  dialogueText,
  mode,
  isHotSnackWanted,
  hotSnackNameJa,
  paymentMethod,
  isPaying,
  patienceRemainingSeconds
}) => {
  // Distinct SVG visual character illustrations for Tokyo conbini regulars
  const renderCustomerIllustration = () => {
    switch (customerType) {
      case 'student':
        return (
          <div className="relative w-40 sm:w-48 h-56 sm:h-64 flex flex-col items-center justify-end select-none">
            {/* Student Hoodie & Cap */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Head / Face */}
              <div className="relative w-20 h-22 rounded-full bg-amber-100 border-2 border-amber-300 shadow-md flex flex-col items-center justify-center">
                {/* Hair */}
                <div className="absolute -top-2 w-22 h-10 bg-stone-800 rounded-t-full"></div>
                {/* Cap Visor */}
                <div className="absolute top-2 w-16 h-3 bg-indigo-600 rounded-full shadow-xs"></div>
                {/* Eyes & Smile */}
                <div className="flex gap-4 mt-4">
                  <div className="w-2.5 h-2.5 bg-stone-800 rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-stone-800 rounded-full animate-bounce"></div>
                </div>
                {/* Smile */}
                <div className="w-4 h-2 border-b-2 border-stone-800 rounded-b-full mt-1.5"></div>
                {/* Earphones */}
                <div className="absolute -left-1 top-7 w-2 h-4 bg-white rounded-full border border-stone-300"></div>
                <div className="absolute -right-1 top-7 w-2 h-4 bg-white rounded-full border border-stone-300"></div>
              </div>

              {/* Torso: Navy Blue Tokyo Uni Hoodie */}
              <div className="relative w-36 h-32 bg-indigo-700 rounded-t-3xl border-t-2 border-indigo-400 shadow-lg flex flex-col items-center p-2">
                {/* White Hoodie Drawstrings */}
                <div className="flex gap-4 mt-1">
                  <div className="w-1 h-6 bg-white rounded-full"></div>
                  <div className="w-1 h-6 bg-white rounded-full"></div>
                </div>
                {/* Tokyo College Graphic */}
                <span className="text-[10px] font-black tracking-widest text-indigo-200 uppercase mt-2">
                  TOKYO 24
                </span>

                {/* Hand holding Smartphone */}
                <div className="absolute -right-4 bottom-2 bg-amber-100 w-8 h-10 rounded-xl border border-amber-300 flex items-center justify-center shadow-md rotate-[-12deg]">
                  <div className="w-6 h-9 bg-slate-950 rounded-lg p-0.5 border border-slate-700">
                    <div className="w-full h-full bg-emerald-500/30 rounded flex items-center justify-center text-[7px] font-mono text-emerald-300">
                      Pay
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'salaryman':
        return (
          <div className="relative w-40 sm:w-48 h-56 sm:h-64 flex flex-col items-center justify-end select-none">
            {/* Japanese Businessman (Charcoal Suit & Blue Tie) */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Head */}
              <div className="relative w-20 h-22 rounded-full bg-amber-100 border-2 border-amber-300 shadow-md flex flex-col items-center justify-center">
                {/* Neat Business Parted Hair */}
                <div className="absolute -top-2 w-22 h-9 bg-stone-900 rounded-t-full"></div>
                {/* Glasses */}
                <div className="absolute top-8 flex gap-3">
                  <div className="w-4 h-3 border border-stone-700 rounded-sm"></div>
                  <div className="w-4 h-3 border border-stone-700 rounded-sm"></div>
                </div>
                {/* Eyes */}
                <div className="flex gap-4 mt-3">
                  <div className="w-2 h-2 bg-stone-800 rounded-full"></div>
                  <div className="w-2 h-2 bg-stone-800 rounded-full"></div>
                </div>
                {/* Polite business mouth */}
                <div className="w-3.5 h-1 bg-stone-800 rounded-full mt-2"></div>
              </div>

              {/* Torso: Charcoal Suit & Crisp Blue Tie */}
              <div className="relative w-38 h-34 bg-slate-800 rounded-t-3xl border-t-2 border-slate-600 shadow-xl flex flex-col items-center">
                {/* White Shirt Collar */}
                <div className="w-12 h-6 bg-white clip-triangle flex justify-center">
                  {/* Blue Striped Tie */}
                  <div className="w-3 h-14 bg-blue-600 rounded-b shadow-sm"></div>
                </div>
                {/* Pocket Square */}
                <div className="absolute left-4 top-4 w-4 h-1.5 bg-white rounded-xs"></div>

                {/* Hand holding Leather Commuter Pass / Wallet */}
                <div className="absolute -right-3 bottom-3 bg-amber-100 w-8 h-8 rounded-xl border border-amber-300 flex items-center justify-center shadow-md">
                  <div className="w-6 h-5 bg-stone-900 rounded border border-amber-500/40 text-[6px] text-amber-300 text-center font-bold">
                    IC
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'grandma':
        return (
          <div className="relative w-40 sm:w-48 h-56 sm:h-64 flex flex-col items-center justify-end select-none">
            {/* Kind Tokyo Neighborhood Grandma (Cardigan & Coin Purse) */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Head */}
              <div className="relative w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 shadow-md flex flex-col items-center justify-center">
                {/* Silver Wavy Hair */}
                <div className="absolute -top-3 w-23 h-12 bg-slate-300 rounded-t-full shadow-inner"></div>
                {/* Kind Smiling Eyes (Curved arcs) */}
                <div className="flex gap-4 mt-3">
                  <div className="w-3 h-1.5 border-t-2 border-stone-700 rounded-t-full"></div>
                  <div className="w-3 h-1.5 border-t-2 border-stone-700 rounded-t-full"></div>
                </div>
                {/* Rosy Cheeks */}
                <div className="absolute top-10 flex justify-between w-14">
                  <div className="w-2.5 h-1.5 bg-rose-300/60 rounded-full blur-[0.5px]"></div>
                  <div className="w-2.5 h-1.5 bg-rose-300/60 rounded-full blur-[0.5px]"></div>
                </div>
                {/* Gentle Smile */}
                <div className="w-3.5 h-1.5 border-b-2 border-rose-600 rounded-b-full mt-2"></div>
              </div>

              {/* Torso: Floral Scarf & Lavender Knit Cardigan */}
              <div className="relative w-36 h-30 bg-purple-800 rounded-t-3xl border-t-2 border-purple-400 shadow-lg flex flex-col items-center">
                {/* Floral Silk Scarf */}
                <div className="w-14 h-5 bg-rose-200 rounded-full border border-rose-300 shadow-xs flex items-center justify-center text-[8px] text-rose-800">
                  🌸
                </div>
                {/* Knit Buttons */}
                <div className="flex flex-col gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-amber-200 border border-amber-400"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-200 border border-amber-400"></div>
                </div>

                {/* Hand holding Traditional Gamaguchi Metal Coin Purse */}
                <div className="absolute -left-3 bottom-2 bg-amber-50 w-8 h-8 rounded-xl border border-amber-200 flex items-center justify-center shadow-md">
                  <div className="w-6 h-6 bg-red-700 rounded-full border-2 border-amber-400 flex items-center justify-center text-[8px] text-amber-200 font-bold">
                    👛
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'foreigner':
        return (
          <div className="relative w-40 sm:w-48 h-56 sm:h-64 flex flex-col items-center justify-end select-none">
            {/* Foreign Tourist with Camera & Travel Backpack */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Head */}
              <div className="relative w-20 h-22 rounded-full bg-orange-50 border-2 border-orange-200 shadow-md flex flex-col items-center justify-center">
                {/* Blonde / Brown Curly Hair */}
                <div className="absolute -top-3 w-22 h-10 bg-amber-600 rounded-t-full"></div>
                {/* Eyes */}
                <div className="flex gap-4 mt-3">
                  <div className="w-2.5 h-2.5 bg-sky-700 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-sky-700 rounded-full"></div>
                </div>
                {/* Big Smile */}
                <div className="w-5 h-2.5 border-b-2 border-stone-800 rounded-b-full mt-2"></div>
              </div>

              {/* Torso: Olive Outdoor Jacket + Camera Strap */}
              <div className="relative w-38 h-32 bg-emerald-800 rounded-t-3xl border-t-2 border-emerald-500 shadow-xl flex flex-col items-center">
                {/* Camera Strap diagonal */}
                <div className="absolute w-28 h-1 bg-stone-900 rotate-[35deg] top-6 shadow-sm"></div>
                {/* Camera Box */}
                <div className="absolute left-3 bottom-3 w-7 h-5 bg-stone-900 rounded border border-stone-600 flex items-center justify-center text-[7px] text-amber-300">
                  📷
                </div>
                {/* Souvenir Bag in Hand */}
                <div className="absolute -right-3 bottom-2 bg-orange-50 w-7 h-9 rounded-md border border-orange-300 flex items-center justify-center shadow-md">
                  <div className="text-[10px]">🛍️</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'rush_hour':
      default:
        return (
          <div className="relative w-40 sm:w-48 h-56 sm:h-64 flex flex-col items-center justify-end select-none">
            {/* Sato Section Chief (Rush Hour - In a Hurry) */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Head */}
              <div className="relative w-20 h-22 rounded-full bg-amber-100 border-2 border-amber-300 shadow-md flex flex-col items-center justify-center">
                {/* Hair */}
                <div className="absolute -top-2 w-22 h-9 bg-stone-800 rounded-t-full"></div>
                {/* Sweat Drop on Forehead (Rush pressure!) */}
                <div className="absolute top-2 right-2 text-sky-400 text-xs animate-ping">
                  💧
                </div>
                {/* Hurried Eyes */}
                <div className="flex gap-4 mt-2">
                  <div className="w-2.5 h-2 bg-stone-800 rounded-full"></div>
                  <div className="w-2.5 h-2 bg-stone-800 rounded-full"></div>
                </div>
                {/* Fast Urging Mouth */}
                <div className="w-4 h-2 bg-stone-800 rounded-md mt-1.5"></div>
              </div>

              {/* Torso: Dark Trenchcoat & Watch */}
              <div className="relative w-40 h-34 bg-amber-950 rounded-t-3xl border-t-2 border-amber-700 shadow-2xl flex flex-col items-center">
                {/* Coat Lapels */}
                <div className="w-14 h-8 border-x-4 border-b-2 border-amber-800"></div>

                {/* Left hand holding IC card / checking wristwatch */}
                <div className="absolute -left-3 bottom-4 bg-amber-100 w-8 h-8 rounded-xl border border-amber-300 flex items-center justify-center shadow-md">
                  <div className="w-4 h-4 rounded-full bg-slate-900 border border-amber-400 text-[6px] text-amber-300 flex items-center justify-center">
                    ⌚
                  </div>
                </div>
                {/* Right hand with commuter pass */}
                <div className="absolute -right-3 bottom-4 bg-amber-100 w-8 h-8 rounded-xl border border-amber-300 flex items-center justify-center shadow-md">
                  <div className="text-xs">💳</div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-end w-full">
      {/* Speech Bubble Floating directly above the customer */}
      <motion.div
        key={dialogueText.ja}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg mb-2 relative z-20"
      >
        <div className="bg-gradient-to-br from-slate-900/95 via-slate-900 to-slate-950 border-2 border-amber-400/80 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-md relative">
          {/* Header pill with Customer Name & Speaker Audio */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold border border-amber-500/40">
                {roleTitleJa}
              </span>
              <span className="text-xs font-bold text-slate-200 truncate max-w-[160px]">
                {customerName}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {patienceRemainingSeconds !== undefined && patienceRemainingSeconds <= 15 && (
                <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 animate-pulse mr-1">
                  <Clock className="w-3 h-3" />
                  {patienceRemainingSeconds}s
                </span>
              )}
              <button
                type="button"
                onClick={() => speakJapanese(dialogueText.ja)}
                className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs transition flex items-center gap-1 shadow-md shadow-amber-500/20"
                title="音声再生 (Listen)"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>再生</span>
              </button>
            </div>
          </div>

          {/* Large, High-Contrast Japanese Dialogue */}
          <div className="text-base sm:text-lg font-black text-amber-200 leading-snug tracking-wide">
            「{dialogueText.ja}」
          </div>

          {/* Subtitles: Romaji & Bengali (Training Mode) */}
          {mode === 'training' && (
            <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1">
              <div className="text-xs font-mono text-cyan-300/90 font-medium">
                {dialogueText.romaji}
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                {dialogueText.bn}
              </div>
            </div>
          )}

          {/* Hot Snack Order Callout Tag */}
          {isHotSnackWanted && hotSnackNameJa && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-bold animate-pulse">
              <span>🍗</span>
              <span>ホットスナック注文: 「{hotSnackNameJa}」</span>
            </div>
          )}

          {/* Speech Bubble Tail Pointing to Customer Head */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-amber-400"></div>
        </div>
      </motion.div>

      {/* Customer Illustrated Character Figure */}
      <div className="relative flex flex-col items-center">
        {renderCustomerIllustration()}

        {/* Shadow on counter surface */}
        <div className="w-36 h-3 bg-slate-950/70 rounded-full blur-xs -mt-1"></div>
      </div>
    </div>
  );
};
