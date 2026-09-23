// src/components/canvas3d/transport/TaxiTransitSim.tsx
// NIHOMI WORLD™ — TOKYO TAXI RIDE & CONVERSATION SIMULATION
// Interactive ride in classic Toyota Crown Comfort Green Cab with automated doors and polite driver dialog.

import React, { useState } from 'react';
import {
  Car,
  Volume2,
  CheckCircle2,
  Receipt,
  X
} from 'lucide-react';
import { speakJapanese } from '../../../lib/tts';
import { triggerCelebrationConfetti } from '../../../lib/gamificationService';

interface TaxiTransitSimProps {
  isOpen: boolean;
  onClose: () => void;
  onArrival: (destination: string) => void;
}

export const TaxiTransitSim: React.FC<TaxiTransitSimProps> = ({
  isOpen,
  onClose,
  onArrival
}) => {
  const [step, setStep] = useState<'destination' | 'in_transit' | 'payment' | 'done'>('destination');
  const [hasReceipt, setHasReceipt] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectDestination = (destJa: string, destRomaji: string) => {
    speakJapanese(`どちらまで行かれますか？`);
    setTimeout(() => {
      speakJapanese(`${destJa}までお願いします。`);
      setStep('in_transit');

      setTimeout(() => {
        setStep('payment');
        speakJapanese('到着いたしました。1,800円になります。');
      }, 3500);
    }, 1200);
  };

  const handlePayAndReceipt = (requestReceipt: boolean) => {
    if (requestReceipt) {
      setHasReceipt(true);
      speakJapanese('領収書をいただけますか？');
      setTimeout(() => {
        speakJapanese('はい、毎度ご乗車ありがとうございます。領収書です。');
        triggerCelebrationConfetti();
        setStep('done');
      }, 1200);
    } else {
      speakJapanese('お釣りは結構です。ありがとうございました。');
      setStep('done');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/40">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">東京無線タクシー (Tokyo Green Cab Taxi)</h2>
              <p className="text-[11px] text-slate-400">Driver: Suzuki-san (運転手 鈴木)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Destination Selection */}
        {step === 'destination' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <p className="text-xs text-emerald-400 font-bold">運転手 (Driver):</p>
              <p className="text-sm font-bold text-white">「ご乗車ありがとうございます。どちらまで行かれますか？」</p>
              <p className="text-[11px] text-slate-400">Thank you for riding with us. Where would you like to go?</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Practice Japanese Destination Phrases:
              </label>
              {[
                { ja: '渋谷駅のハチ公口までお願いします。', romaji: 'Shibuya-eki no Hachikou-guchi made onegai shimasu.', en: 'To Shibuya Station Hachiko Exit, please.' },
                { ja: '新宿駅の南口まで行ってください。', romaji: 'Shinjuku-eki no Minamiguchi made itte kudasai.', en: 'Please take me to Shinjuku Station South Exit.' },
                { ja: '急いでいるので、一番早い道でお願いします。', romaji: 'Isoide iru node, ichiban hayai michi de onegai shimasu.', en: 'I am in a hurry, please take the fastest route.' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectDestination(item.ja, item.romaji)}
                  className="w-full text-left p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-emerald-400/50 transition-all"
                >
                  <p className="text-xs font-bold text-white">{item.ja}</p>
                  <p className="text-[11px] text-emerald-400 font-mono mt-0.5">{item.romaji}</p>
                  <p className="text-[11px] text-slate-400">{item.en}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: In Transit */}
        {step === 'in_transit' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce text-2xl">
              🚕
            </div>
            <div>
              <h3 className="text-base font-bold text-white">走行中 (Driving through Tokyo streets...)</h3>
              <p className="text-xs text-slate-400 mt-1">Passing Meiji-dori Avenue towards Shibuya</p>
            </div>
          </div>
        )}

        {/* Step 3: Payment & Receipt Dialog */}
        {step === 'payment' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <p className="text-xs text-emerald-400 font-bold">運転手 (Driver):</p>
              <p className="text-sm font-bold text-white">「到着いたしました。1,800円になります。」</p>
              <p className="text-[11px] text-slate-400">We have arrived. That will be ¥1,800.</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handlePayAndReceipt(true)}
                className="w-full p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-lg transition-all"
              >
                <div className="text-left">
                  <p className="text-sm font-black">「領収書（レシート）をいただけますか？」</p>
                  <p className="text-[11px] text-emerald-100 font-mono">May I have a receipt, please? (Essential Business Japanese)</p>
                </div>
                <Receipt className="w-5 h-5 flex-shrink-0" />
              </button>

              <button
                onClick={() => handlePayAndReceipt(false)}
                className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs text-left transition-colors"
              >
                「Suicaで支払います。」 (Pay via Suica IC Card)
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Done */}
        {step === 'done' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Taxi Mission Complete!</h3>
              <p className="text-xs text-slate-400 mt-1">
                You successfully hailed a Tokyo taxi, communicated your destination in Keigo, and requested a receipt.
              </p>
            </div>
            <button
              onClick={() => {
                onArrival('shibuya');
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Exit Taxi to Shibuya Crossing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
