// src/components/simulation/conbini/ConbiniCustomerTablet.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Smartphone, Coins, Radio, Check, Scan, Zap } from 'lucide-react';
import { soundEffects } from '../../../lib/soundEffects';

interface ConbiniCustomerTabletProps {
  totalAmountYen: number;
  customerPreferredMethod: 'cash' | 'suica' | 'paypay' | 'credit';
  activeMethod: 'cash' | 'suica' | 'paypay' | 'credit' | null;
  onSelectMethod: (method: 'cash' | 'suica' | 'paypay' | 'credit') => void;
  isApproved: boolean;
  brandCardNameJa: string;
}

export const ConbiniCustomerTablet: React.FC<ConbiniCustomerTabletProps> = ({
  totalAmountYen,
  customerPreferredMethod,
  activeMethod,
  onSelectMethod,
  isApproved,
  brandCardNameJa
}) => {
  const [isNfcTapping, setIsNfcTapping] = useState(false);
  const [isBarcodeScanning, setIsBarcodeScanning] = useState(false);

  const handleNfcTap = () => {
    setIsNfcTapping(true);
    soundEffects.playBarcodeBeep();
    setTimeout(() => {
      soundEffects.playRegisterSettlement();
      setIsNfcTapping(false);
      onSelectMethod('suica');
    }, 700);
  };

  const handleBarcodeScan = () => {
    setIsBarcodeScanning(true);
    soundEffects.playBarcodeBeep();
    setTimeout(() => {
      soundEffects.playPayPaySound();
      setIsBarcodeScanning(false);
      onSelectMethod('paypay');
    }, 600);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-indigo-500/50 shadow-2xl p-4 flex flex-col justify-between">
      {/* Tablet Bezel & Camera Notch Header */}
      <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
          <span className="text-xs font-black text-indigo-300">
            客側タッチパネル (Customer Semi-Self Tablet)
          </span>
        </div>

        <div className="px-2 py-0.5 rounded-lg bg-black font-mono text-[10px] text-indigo-300 border border-indigo-500/30">
          合計: ¥{totalAmountYen.toLocaleString()}
        </div>
      </div>

      {/* Screen Display: Authentic Japanese Touch Selection */}
      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
        <div className="space-y-0.5">
          <h4 className="text-sm font-black text-slate-100">
            お支払い方法をタッチしてください
          </h4>
          <p className="text-[10px] text-slate-400 font-mono">
            Please touch payment method on the screen
          </p>
        </div>

        {/* 4 Interactive Payment Method Tiles */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* 1. 現金 (Cash) */}
          <button
            type="button"
            onClick={() => onSelectMethod('cash')}
            className={`p-3 rounded-2xl border transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
              activeMethod === 'cash'
                ? 'bg-blue-600/30 border-blue-400 text-blue-200 ring-2 ring-blue-500/50 scale-[1.02]'
                : 'bg-slate-900 border-slate-800 hover:border-blue-500/40 text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xl">
              💴
            </div>
            <div className="font-black text-xs">現金 (Cash)</div>
            <div className="text-[9px] text-slate-400">紙幣・硬貨</div>
          </button>

          {/* 2. 交通系IC (Suica / Pasmo) */}
          <button
            type="button"
            onClick={() => {
              onSelectMethod('suica');
              handleNfcTap();
            }}
            className={`p-3 rounded-2xl border transition flex flex-col items-center justify-center gap-1.5 cursor-pointer relative overflow-hidden ${
              activeMethod === 'suica'
                ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/50 scale-[1.02]'
                : 'bg-slate-900 border-slate-800 hover:border-emerald-500/40 text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl">
              🐧
            </div>
            <div className="font-black text-xs">交通系IC (Suica)</div>
            <div className="text-[9px] text-slate-400">Suica / PASMO</div>

            {/* Glowing NFC Tap indicator */}
            {isNfcTapping && (
              <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center">
                <span className="text-xs font-black text-white animate-ping">タッチ中...</span>
              </div>
            )}
          </button>

          {/* 3. バーコード決済 (PayPay / Brand Pay) */}
          <button
            type="button"
            onClick={() => {
              onSelectMethod('paypay');
              handleBarcodeScan();
            }}
            className={`p-3 rounded-2xl border transition flex flex-col items-center justify-center gap-1.5 cursor-pointer relative overflow-hidden ${
              activeMethod === 'paypay'
                ? 'bg-rose-600/30 border-rose-400 text-rose-200 ring-2 ring-rose-500/50 scale-[1.02]'
                : 'bg-slate-900 border-slate-800 hover:border-rose-500/40 text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-xl">
              📱
            </div>
            <div className="font-black text-xs">バーコード決済</div>
            <div className="text-[9px] text-slate-400">PayPay / {brandCardNameJa}</div>

            {/* Red Laser Scanning Effect */}
            {isBarcodeScanning && (
              <div className="absolute inset-0 bg-rose-500/40 flex items-center justify-center">
                <span className="text-xs font-black text-white">スキャン中...</span>
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-red-500 shadow-lg shadow-red-500 animate-pulse"></div>
              </div>
            )}
          </button>

          {/* 4. クレジットカード (Touch / Chip) */}
          <button
            type="button"
            onClick={() => onSelectMethod('credit')}
            className={`p-3 rounded-2xl border transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
              activeMethod === 'credit'
                ? 'bg-amber-600/30 border-amber-400 text-amber-200 ring-2 ring-amber-500/50 scale-[1.02]'
                : 'bg-slate-900 border-slate-800 hover:border-amber-500/40 text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
              💳
            </div>
            <div className="font-black text-xs">クレジットカード</div>
            <div className="text-[9px] text-slate-400">Visa / JCB / Touch</div>
          </button>
        </div>
      </div>

      {/* Terminal Contactless NFC Pad Reader Graphic */}
      <div className="mt-3 pt-2.5 border-t border-indigo-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Glowing NFC Ring Reader */}
          <div className="w-7 h-7 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/40">
            <Radio className="w-4 h-4 text-blue-300 animate-pulse" />
          </div>
          <div className="text-[11px] font-bold text-slate-300">
            マルチ電子マネー読み取り部 (NFC Pad)
          </div>
        </div>

        {isApproved ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <Check className="w-3 h-3" />
            <span>認証完了</span>
          </span>
        ) : (
          <span className="text-[10px] text-slate-400 font-mono">
            タッチ待機中
          </span>
        )}
      </div>
    </div>
  );
};
