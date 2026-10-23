// src/v2/components/common/ProFeatureGate.tsx
// NIHOMI V2 — ELEGANT PRO FEATURE PAYWALL & COMMERCIAL UPGRADE GATE
import React from 'react';
import {
  Lock,
  Crown,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Zap,
  Store,
  Award,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface ProFeatureGateProps {
  featureName: string;
  featureSubtitle?: string;
  featureDescription: string;
  featureBenefits?: string[];
  onOpenCheckout: (planId?: string) => void;
  onBack: () => void;
  backLabel?: string;
}

export const ProFeatureGate: React.FC<ProFeatureGateProps> = ({
  featureName,
  featureSubtitle,
  featureDescription,
  featureBenefits = [
    'JLPT N5 থেকে N1 সম্পূর্ণ ২১০টি মাস্টার পাঠ্যক্রম ও কুইজ',
    'টাইমড CBT মক এক্সাম ওএস, ডিজিটাল হল টিকেট ও অফিসিয়াল মার্কশিট',
    'বাস্তব টোকিও ৭-ইলেভেন, লসন ও ফ্যামিলিমার্ট কনবিনি ক্যাশিয়ার সিমুলেশন',
    'নমি সেন্সেই আনলিমিটেড এআই ভয়েস ডায়ালগ ও তাৎক্ষণিক ব্যাখ্যা'
  ],
  onOpenCheckout,
  onBack,
  backLabel = 'ফ্রি পাঠে ফিরে যান'
}) => {
  const { openAuthModal, user } = useAuth();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fadeIn">
      <div className="bg-[#141726] border-2 border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-red-950/20 relative overflow-hidden text-left">
        
        {/* Subtle Ambient Japanese Grid Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 via-red-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black tracking-wider uppercase">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Nihomi PRO এক্সক্লুসিভ ফিচার</span>
          </div>

          <div className="text-xs text-stone-400 font-mono flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>সাবস্ক্রিপশন প্রয়োজন (PRO Required)</span>
          </div>
        </div>

        {/* Feature Headline & Intro */}
        <div className="pt-6 space-y-3 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>{featureName}</span>
          </h2>
          {featureSubtitle && (
            <p className="text-sm font-semibold text-amber-300/90">{featureSubtitle}</p>
          )}
          <p className="text-stone-300 text-sm leading-relaxed max-w-2xl">
            {featureDescription}
          </p>
        </div>

        {/* Free Tier vs PRO Tier Comparison Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 relative z-10">
          
          {/* Free Tier Box */}
          <div className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>আপনার ফ্রি টিয়ারে অন্তর্ভুক্ত:</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                ১০০% ফ্রি
              </span>
            </div>
            <ul className="space-y-2 text-xs text-stone-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>হিরাগানা ও কাতাকানা সম্পূর্ণ ক্যানভাস</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>টোকিও জার্নি ফাউন্ডেশন (あ → い → あい)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>JLPT N5 প্রাথমিক ৫টি সম্পূর্ণ পাঠ (Lessons 1–5)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>অফিসিয়াল JIS রিলোকেশন CV বিল্ডার টুল</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>১০টি প্রিন্টযোগ্য A4 ক্যালিগ্রাফি শিট</span>
              </li>
            </ul>
          </div>

          {/* PRO Tier Box */}
          <div className="bg-gradient-to-br from-[#1E2338] to-[#17192A] border-2 border-amber-500/40 rounded-2xl p-5 space-y-3 shadow-lg shadow-amber-500/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>PRO সাবস্ক্রিপশনে আনলক হবে:</span>
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/40">
                PRO PLAN
              </span>
            </div>
            <ul className="space-y-2 text-xs text-white">
              {featureBenefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pricing & High-Converting Upgrade Action Strip */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">১,৯৯০</span>
              <span className="text-xs text-stone-400 font-bold uppercase">BDT / মাস</span>
              <span className="text-[11px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full ml-1">
                সবচেয়ে জনপ্রিয়
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              বিকাশ, নগদ বা কার্ডে তাত্ক্ষণিক সক্রিয়করণ • যেকোনো সময় বাতিলযোগ্য
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onBack}
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white font-bold text-xs border border-white/10 transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{backLabel}</span>
            </button>

            <button
              id="btn-gate-upgrade-pro"
              onClick={() => onOpenCheckout('pro')}
              className="btn-haptic flex-1 sm:flex-initial px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#E45147] to-[#DC2626] hover:from-[#c93b32] hover:to-[#B91C1C] text-white font-extrabold text-sm shadow-xl shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>PRO সাবস্ক্রাইব করুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Unauthenticated Quick Login Note */}
        {!user && (
          <div className="mt-4 pt-3 border-t border-white/5 text-center text-xs text-stone-400 flex items-center justify-center gap-1.5">
            <span>ইতিমধ্যে প্রো মেম্বার?</span>
            <button
              onClick={() => openAuthModal('login')}
              className="text-amber-400 font-bold hover:underline cursor-pointer"
            >
              এখানে লগইন করুন
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
