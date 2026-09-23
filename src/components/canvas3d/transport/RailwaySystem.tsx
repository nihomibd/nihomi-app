// src/components/canvas3d/transport/RailwaySystem.tsx
// NIHOMI WORLD™ — JAPANESE RAILWAY SIMULATION ENGINE
// Interactive Multi-Function Ticket Vending Machine (自動券売機),
// Automatic IC Ticket Gates (自動改札機), and Train Riding Simulation.

import React, { useState } from 'react';
import {
  CreditCard,
  Train,
  CheckCircle2,
  Volume2,
  X,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { worldGraphManager } from '../worldGraph/WorldGraphManager';
import { speakJapanese } from '../../../lib/tts';

interface TicketMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newBalance: number) => void;
}

export const TicketVendingMachineModal: React.FC<TicketMachineModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [lang, setLang] = useState<'ja' | 'en'>('ja');
  const [selectedAmount, setSelectedAmount] = useState<number>(2000);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentBalance = worldGraphManager.getSuicaBalance();

  const handleCharge = (amount: number) => {
    setIsProcessing(true);
    speakJapanese(`${amount}円 チャージします。`);

    setTimeout(() => {
      const newBal = worldGraphManager.chargeSuica(amount);
      setIsProcessing(false);
      setSuccessMessage(`チャージ完了！ (Charged ¥${amount.toLocaleString()})`);
      speakJapanese('チャージが完了しました。カードをお取りください。');
      onSuccess(newBal);

      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1800);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/50 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden">
        {/* Ticket Machine Top Header (Authentic JR Green/Blue Machine Style) */}
        <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between text-white border-b border-emerald-400/30">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <Train className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wide">
                {lang === 'ja' ? 'JR東日本 多機能券売機' : 'JR East Multi-Function Ticket Machine'}
              </h2>
              <p className="text-[11px] text-emerald-100 font-medium">
                {lang === 'ja' ? 'きっぷ購入・Suica/PASMOチャージ' : 'Tickets & IC Card Recharge'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
              className="px-3 py-1 rounded-lg bg-black/30 hover:bg-black/40 text-xs font-bold border border-white/30 transition-colors"
            >
              {lang === 'ja' ? 'English' : '日本語'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Machine Screen Body */}
        <div className="p-6 space-y-6">
          {/* Suica Card Visual Display */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center font-black text-xs text-emerald-300">
                Suica
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">
                  {lang === 'ja' ? '現在のカード残高' : 'Current IC Balance'}
                </p>
                <p className="text-2xl font-black text-white font-mono">
                  ¥{currentBalance.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {lang === 'ja' ? 'カード挿入済' : 'Card Inserted'}
              </span>
            </div>
          </div>

          {/* Charge Amount Selection Grid */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {lang === 'ja' ? 'チャージ金額を選択してください' : 'Select Recharge Amount'}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[1000, 2000, 3000, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSelectedAmount(amt)}
                  className={`p-4 rounded-xl font-bold text-center border transition-all ${
                    selectedAmount === amt
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-[1.02]'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                >
                  <p className="text-lg font-mono">¥{amt.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {lang === 'ja' ? `${amt / 1000}千円` : `¥${amt}`}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center text-sm font-bold flex items-center justify-center space-x-2 animate-in zoom-in-95">
              <Sparkles className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'ja' ? '現金投入・お釣り自動排出' : 'Cash or digital charge'}</span>
            </div>

            <button
              disabled={isProcessing}
              onClick={() => handleCharge(selectedAmount)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {isProcessing
                ? (lang === 'ja' ? 'チャージ中...' : 'Processing...')
                : (lang === 'ja' ? `¥${selectedAmount.toLocaleString()} をチャージする` : `Charge ¥${selectedAmount.toLocaleString()}`)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TrainRideTransitModalProps {
  isOpen: boolean;
  lineNameJa: string;
  lineNameEn: string;
  destinationJa: string;
  travelMinutes: number;
  onComplete: () => void;
}

export const TrainRideTransitModal: React.FC<TrainRideTransitModalProps> = ({
  isOpen,
  lineNameJa,
  lineNameEn,
  destinationJa,
  onComplete
}) => {
  const [progress, setProgress] = React.useState<number>(0);

  React.useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    speakJapanese(`まもなく、${destinationJa}に到着いたします。お忘れ物のないようご注意ください。`);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 10;
      });
    }, 280);

    return () => clearInterval(interval);
  }, [isOpen, destinationJa, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
          🚆
        </div>

        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
            乗車中 (In Transit)
          </span>
          <h2 className="text-xl font-black text-white">{lineNameJa}</h2>
          <p className="text-xs text-slate-400 mt-1">{lineNameEn}</p>
        </div>

        {/* Route Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>発車 (Departed)</span>
            <span>{progress}%</span>
            <span>{destinationJa} 到着</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-left">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-1">
            <Volume2 className="w-4 h-4" />
            <span>車内放送 (Conductor Announcement)</span>
          </div>
          <p className="text-xs text-slate-200 font-medium">
            「次は、{destinationJa}、{destinationJa}。お出口は左側です。」
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Next stop is {destinationJa}. The doors on the left side will open.
          </p>
        </div>

        <button
          onClick={onComplete}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 flex items-center justify-center space-x-2 transition-colors"
        >
          <span>Skip Animation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
