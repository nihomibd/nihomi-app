// src/components/simulation/conbini/ConbiniThermalReceiptModal.tsx
// NIHOMI V2 — TOKYO CONBINI CASHIER AUTHENTIC JAPANESE THERMAL RECEIPT ENGINE
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Printer,
  X,
  Volume2,
  Copy,
  Check,
  Download,
  Receipt,
  Store,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ConbiniPosProduct } from '../../../types';
import { ConbiniBrandConfig } from '../../../data/conbiniBrands';
import { speakJapanese } from '../../../lib/tts';
import { soundEffects } from '../../../lib/soundEffects';

export interface ConbiniThermalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: ConbiniBrandConfig;
  items: ConbiniPosProduct[];
  totalAmount: number;
  paymentMethod: 'cash' | 'suica' | 'paypay' | 'credit';
  amountPaid: number;
  changeDue: number;
  hasBag: boolean;
  bagFee: number;
  scenarioTitle?: string;
  earnedXp?: number;
  cashierName?: string;
  onAdvanceNextCustomer?: () => void;
}

export const ConbiniThermalReceiptModal: React.FC<ConbiniThermalReceiptModalProps> = ({
  isOpen,
  onClose,
  brand,
  items,
  totalAmount,
  paymentMethod,
  amountPaid,
  changeDue,
  hasBag,
  bagFee,
  scenarioTitle,
  earnedXp = 50,
  cashierName = '研修生 タニビル (Trainee)',
  onAdvanceNextCustomer
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Format current Japanese receipt timestamp
  const now = new Date();
  const daysJa = ['日', '月', '火', '水', '木', '金', '土'];
  const formattedDateJa = `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日(${daysJa[now.getDay()]}) ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Tax calculation: Food is 8% reduced tax, Bag/Others is 10%
  const foodTotal = items.reduce((sum, item) => sum + (item.priceYen || 0), 0);
  const nonFoodTotal = hasBag ? bagFee : 0;
  const foodTax = Math.round(foodTotal - foodTotal / 1.08);
  const nonFoodTax = nonFoodTotal > 0 ? Math.round(nonFoodTotal - nonFoodTotal / 1.1) : 0;
  const totalTax = foodTax + nonFoodTax;
  const subtotal = totalAmount - totalTax;

  const paymentLabels: Record<string, { labelJa: string; labelBn: string; noteJa: string }> = {
    cash: {
      labelJa: '現　金',
      labelBn: 'নগদ ক্যাশ (Cash)',
      noteJa: `お預かり: ¥${amountPaid.toLocaleString()} / お釣り: ¥${changeDue.toLocaleString()}`
    },
    suica: {
      labelJa: '交通系IC (Suica)',
      labelBn: 'সুইকা আইসি কার্ড (Suica IC)',
      noteJa: `残高: ¥${(amountPaid > totalAmount ? amountPaid - totalAmount : 1850).toLocaleString()}`
    },
    paypay: {
      labelJa: 'コード決済 (PayPay)',
      labelBn: 'পেপে কিউআর কোড (PayPay)',
      noteJa: '承認番号: 849201'
    },
    credit: {
      labelJa: 'クレジット一括',
      labelBn: 'ক্রেডিট কার্ড (Credit)',
      noteJa: 'カード番号: ************8821'
    }
  };

  const handlePrint = () => {
    soundEffects.playReceiptPrinterSound();
    window.print();
  };

  const handleReadOut = () => {
    setIsSpeaking(true);
    const textJa = `合計、${totalAmount}円でございます。${paymentMethod === 'cash' ? `${amountPaid}円お預かりいたします。${changeDue}円のお釣りでございます。` : ''}ありがとうございました！またお越しくださいませ。`;
    speakJapanese(textJa, {
      rate: 0.95,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const handleCopyText = () => {
    soundEffects.playButtonTap();
    const receiptText = `
========================================
${brand.nameJa} ${brand.storeLocationJa}
登録番号: T1029384756102
TEL: 03-3461-7111  レジ: 01
日時: ${formattedDateJa}
責任者: ${cashierName}
----------------------------------------
${items.map((i) => `${(i.nameJa || i.nameBn || "").padEnd(16, ' ')} *¥${(i.priceYen || 0).toLocaleString()}`).join('\n')}
${hasBag ? `レジ袋（大サイズ）          ¥${bagFee}\n` : ''}----------------------------------------
小計 (税抜)                    ¥${subtotal.toLocaleString()}
(うち消費税等 8% 軽減税率)       ¥${foodTax.toLocaleString()}
${hasBag ? `(うち消費税等 10% 標準税率)     ¥${nonFoodTax.toLocaleString()}\n` : ''}合計 (税込)                    ¥${totalAmount.toLocaleString()}
----------------------------------------
支払方法: ${paymentLabels[paymentMethod]?.labelJa}
${paymentMethod === 'cash' ? `お預かり: ¥${amountPaid.toLocaleString()}\nお釣り:   ¥${changeDue.toLocaleString()}` : paymentLabels[paymentMethod]?.noteJa}
----------------------------------------
7iD / nanaco ポイント獲得:      +${Math.max(1, Math.round(totalAmount / 200))} pt
ポイント残高:                   1,425 pt
========================================
毎度ありがとうございます。
またのお越しをお待ちしております。
領収証（レシート）
========================================
    `.trim();

    navigator.clipboard.writeText(receiptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div
        id="conbini-thermal-receipt-modal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          className="relative w-full max-w-md my-auto space-y-4"
        >
          {/* Action Toolbar Header */}
          <div className="flex items-center justify-between bg-[#141726] border border-white/10 rounded-2xl p-3 px-4 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                <Receipt className="w-4 h-4 text-emerald-400" />
              </span>
              <div>
                <div className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>খাঁটি টোকিও ক্যাশিয়ার রসিদ</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono">
                    JAPAN POS
                  </span>
                </div>
                <div className="text-[10px] text-stone-400">
                  {brand.nameJa} • {scenarioTitle || 'লেনদেন সম্পন্ন'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="btn-voice-readout-receipt"
                onClick={handleReadOut}
                title="জাপানি কণ্ঠস্বরে রসিদ ও বিদায় সম্ভাষণ শুনুন"
                className={`p-2 rounded-xl transition cursor-pointer flex items-center justify-center ${
                  isSpeaking
                    ? 'bg-amber-500 text-stone-950 animate-pulse'
                    : 'bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                id="btn-copy-receipt-text"
                onClick={handleCopyText}
                title="রসিদ টেক্সট কপি করুন"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition cursor-pointer flex items-center justify-center"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                type="button"
                id="btn-print-conbini-receipt"
                onClick={handlePrint}
                title="ব্রাউজার থেকে সরাসরি প্রিন্ট করুন"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition cursor-pointer flex items-center justify-center"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                type="button"
                id="btn-close-receipt-modal"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* =========================================================================
              THE PHYSICAL THERMAL PAPER RECEIPT CANVAS
             ========================================================================= */}
          <div
            ref={receiptRef}
            id="conbini-printable-receipt"
            className="relative bg-[#FAFAF7] text-stone-900 rounded-lg p-6 sm:p-7 shadow-2xl font-mono text-xs select-text overflow-hidden border border-stone-300/80"
            style={{
              backgroundImage: 'radial-gradient(#e5e5dc 0.75px, transparent 0.75px)',
              backgroundSize: '8px 8px'
            }}
          >
            {/* Top Serrated Edge Decoration */}
            <div className="absolute top-0 left-0 right-0 h-1.5 flex justify-between overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#141726] rotate-45 -translate-y-2 shrink-0"></div>
              ))}
            </div>

            {/* Brand Logo & Store Header */}
            <div className="text-center space-y-1.5 pt-2 pb-3 border-b-2 border-dashed border-stone-400/80">
              <div className="flex justify-center items-center gap-1.5 py-1">
                {brand.fasciaStripe.map((color, idx) => (
                  <div
                    key={idx}
                    className="h-2 w-8 rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
              <h3 className="text-base font-black tracking-tight text-stone-950">
                {brand.nameJa}
              </h3>
              <div className="text-[11px] font-bold text-stone-700">
                {brand.storeLocationJa}
              </div>
              <div className="text-[10px] text-stone-600">
                登録番号 T1029384756102
              </div>
              <div className="text-[10px] text-stone-600 flex justify-between pt-1">
                <span>TEL 03-3461-7111</span>
                <span>レジ: 01</span>
              </div>
              <div className="text-[10px] text-stone-600 flex justify-between">
                <span>日時: {formattedDateJa}</span>
                <span>No. 0089</span>
              </div>
              <div className="text-[10px] text-stone-600 text-left">
                担当: {cashierName}
              </div>
            </div>

            {/* Items Table */}
            <div className="py-3 border-b-2 border-dashed border-stone-400/80 space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-stone-600 border-b border-stone-300 pb-1">
                <span>商品名 (*軽減税率)</span>
                <span>金額 (円)</span>
              </div>

              {items.map((item, index) => {
                const price = item.priceYen || 0;
                return (
                  <div key={index} className="flex justify-between items-start text-xs">
                    <span className="font-bold text-stone-900 pr-2 leading-tight">
                      {item.nameJa || item.nameBn}
                    </span>
                    <span className="font-bold text-stone-950 shrink-0">
                      *¥{price.toLocaleString()}
                    </span>
                  </div>
                );
              })}

              {hasBag && (
                <div className="flex justify-between items-start text-xs">
                  <span className="font-bold text-stone-900 pr-2">
                    レジ袋 (大サイズ 1枚)
                  </span>
                  <span className="font-bold text-stone-950 shrink-0">
                    ¥{bagFee.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Totals & Tax Breakdown */}
            <div className="py-3 border-b-2 border-dashed border-stone-400/80 space-y-1 text-xs">
              <div className="flex justify-between text-stone-700">
                <span>小計 (税抜)</span>
                <span>¥{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600 text-[11px]">
                <span>(うち消費税等 8% 軽減税率)</span>
                <span>¥{foodTax.toLocaleString()}</span>
              </div>
              {hasBag && (
                <div className="flex justify-between text-stone-600 text-[11px]">
                  <span>(うち消費税等 10% 標準税率)</span>
                  <span>¥{nonFoodTax.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-stone-300">
                <span className="text-sm font-black text-stone-950">合計 (税込)</span>
                <span className="text-xl font-black text-stone-950">
                  ¥{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment & Change Breakdown */}
            <div className="py-3 border-b-2 border-dashed border-stone-400/80 space-y-1 text-xs">
              <div className="flex justify-between font-bold text-stone-900">
                <span>支払方法:</span>
                <span>{paymentLabels[paymentMethod]?.labelJa}</span>
              </div>

              {paymentMethod === 'cash' ? (
                <>
                  <div className="flex justify-between text-stone-700">
                    <span>お預かり</span>
                    <span>¥{amountPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-950 pt-1 border-t border-stone-300">
                    <span>お釣り</span>
                    <span className="text-sm font-black">¥{changeDue.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div className="text-[11px] text-stone-600">
                  {paymentLabels[paymentMethod]?.noteJa}
                </div>
              )}
            </div>

            {/* Loyalty Point Program */}
            <div className="py-2.5 border-b border-stone-300 text-[10px] text-stone-600 space-y-0.5">
              <div className="flex justify-between font-bold text-stone-800">
                <span>{brand.loyaltyCardNameJa} ポイント獲得:</span>
                <span>+{Math.max(1, Math.round(totalAmount / 200))} pt</span>
              </div>
              <div className="flex justify-between">
                <span>今回ポイント残高:</span>
                <span>1,425 pt</span>
              </div>
            </div>

            {/* Barcode & Gratitude Footer */}
            <div className="pt-4 text-center space-y-2">
              <div className="text-xs font-bold text-stone-800 leading-relaxed">
                毎度ありがとうございます。<br />
                またのお越しをお待ちしております。
              </div>

              {/* Realistic CSS Barcode */}
              <div className="flex justify-center items-center py-2">
                <div className="h-10 flex items-center justify-center gap-[2px] bg-white p-2 rounded-xs border border-stone-300">
                  {Array.from({ length: 42 }).map((_, i) => {
                    const width = (i % 3 === 0) ? 'w-[3px]' : (i % 2 === 0) ? 'w-[1.5px]' : 'w-[2.5px]';
                    return <div key={i} className={`h-full ${width} bg-stone-900`}></div>;
                  })}
                </div>
              </div>
              <div className="text-[9px] text-stone-500 tracking-widest font-mono">
                *0089-20261024-0154-7E*
              </div>
              <div className="text-[10px] font-bold text-stone-600 border border-stone-400 inline-block px-2 py-0.5 rounded-xs">
                領収証（レシート）
              </div>
            </div>

            {/* Bottom Serrated Edge Decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 flex justify-between overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#141726] rotate-45 translate-y-2 shrink-0"></div>
              ))}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              id="btn-receipt-action-advance"
              onClick={() => {
                onClose();
                onAdvanceNextCustomer?.();
              }}
              className="btn-haptic flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>পরবর্তী কাস্টমার অথবা শিফট স্কোরকার্ড</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConbiniThermalReceiptModal;
