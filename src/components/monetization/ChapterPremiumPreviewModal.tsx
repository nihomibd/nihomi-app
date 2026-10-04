// src/components/monetization/ChapterPremiumPreviewModal.tsx
// Canonical Chapter 6+ Premium Preview Modal
// Law 7: Commercial Fairness — Chapters 1-5 Free, Chapter 6+ Pro Preview

import React from 'react';
import {
  X,
  Sparkles,
  Lock,
  Crown,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { MonetizationGateStatus } from '../../core/monetization/monetizationGate';
import { trackNihomiEvent } from '../../utils/analytics';

interface ChapterPremiumPreviewModalProps {
  isOpen: boolean;
  status: MonetizationGateStatus | null;
  onClose: () => void;
  onUpgrade: () => void;
}

export const ChapterPremiumPreviewModal: React.FC<ChapterPremiumPreviewModalProps> = ({
  isOpen,
  status,
  onClose,
  onUpgrade
}) => {
  if (!isOpen || !status || !status.isRestricted) return null;

  const handleUpgradeClick = () => {
    trackNihomiEvent('premium_upgrade_intent', {
      chapterNumber: status.chapterNumber,
      source: 'chapter_preview_modal'
    });
    onUpgrade();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0F141C] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl text-white overflow-hidden">
        {/* Amber Glow Accent */}
        <div className="absolute top-0 right-1/4 w-60 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge & Title */}
        <div className="text-center pt-2">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-4 shadow-lg shadow-amber-500/10">
            <Crown className="w-7 h-7" />
          </div>

          <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full mb-2">
            N5 Pro এক্সক্লুসিভ
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            {status.previewDetails?.titleBn || `অধ্যায় ০${status.chapterNumber}: প্রিমিয়াম প্রিভিউ`}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
            {status.reasonBn}
          </p>
        </div>

        {/* Feature List */}
        <div className="mt-6 bg-[#161D2B] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            N5 Pro মেম্বারশিপে যা অন্তর্ভুক্ত:
          </div>
          {(status.previewDetails?.featuresBn || [
            'অধ্যায় ০৬–২৫ এর সম্পূর্ণ লেসন ও অডিও',
            '২৪/৭ Nihomi Sensei AI™ স্পিকিং প্র্যাকটিস',
            'JLPT N5 রিয়েল মক টেস্ট'
          ]).map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto flex-1 px-5 py-3 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-semibold transition"
          >
            ফ্রি লেসনে ফিরে যাই
          </button>
          <button
            id="btn-upgrade-pro-modal"
            onClick={handleUpgradeClick}
            className="w-full sm:w-auto flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-rose-700 hover:from-amber-400 hover:to-rose-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-900/40 transition flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>N5 Pro আপগ্রেড করি</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>আপনার পূর্ববর্তী সকল প্রগ্রেস ও অর্জিত XP সম্পূর্ণ নিরাপদ ও সংরক্ষিত থাকবে</span>
        </div>
      </div>
    </div>
  );
};
