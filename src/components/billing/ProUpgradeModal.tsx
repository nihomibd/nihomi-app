import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Bot,
  Brain,
  Store,
  FileText,
  Target,
  Compass,
  Crown,
  Lock,
  Loader2,
  CreditCard,
  ChevronRight,
  Check
} from 'lucide-react';
import { billingApi } from '../../lib/billingApi';
import { useAuth } from '../../context/AuthContext';
import { trackNihomiEvent } from '../../utils/analytics';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultPlanInterval?: 'monthly' | 'yearly';
}

interface ValueSlide {
  id: string;
  badge: string;
  title: string;
  titleJa: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentGradient: string;
  badgeColor: string;
  highlightText: string;
}

const NIHOMI_6_VALUES: ValueSlide[] = [
  {
    id: 'sensei',
    badge: 'PERSONAL SENSEI',
    title: '২৪/৭ সার্বক্ষণিক পার্সোনাল শিক্ষক',
    titleJa: 'AI 専属講師',
    description: 'বাংলা ভাষায় জটিল জাপানি ব্যাকরণ বিশ্লেষণ ও যেকোনো সময় নির্ভুল কেইগো ও উচ্চারণ সহায়তা।',
    icon: Bot,
    accentGradient: 'from-red-600/25 via-[#1a1228] to-[#0d0918]',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    highlightText: '১০০% বাংলায় প্রাঞ্জল ব্যাকরণ ব্যাখ্যা'
  },
  {
    id: 'memoryos',
    badge: 'MEMORYOS™ SRS',
    title: 'স্পেসড রিপিটেশন স্মৃতি ইঞ্জিন',
    titleJa: '記憶定着エンジン',
    description: 'বৈজ্ঞানিক ইন্টারভালে আপনার ভুল হওয়া শব্দ ও ব্যাকরণ রিভিশন করিয়ে আজীবন মনে রাখা নিশ্চিত করে।',
    icon: Brain,
    accentGradient: 'from-amber-600/25 via-[#1a1528] to-[#0d0918]',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    highlightText: '৯৫%+ দীর্ঘমেয়াদী মনে রাখার হার'
  },
  {
    id: 'conbini',
    badge: 'CONBINI SHIFT POS',
    title: 'জাপানে যাওয়ার আগেই কাজের মহড়া',
    titleJa: '現場レジ訓練',
    description: 'টোকিও সেভেন-ইলেভেন ক্যাশিয়ার, বারকোড স্ক্যানার, সেমি-সেলফ রেজিস্টার ও কাস্টমার কেইগো সিমুলেশন।',
    icon: Store,
    accentGradient: 'from-emerald-600/25 via-[#121c22] to-[#0d0918]',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    highlightText: 'বাস্তব টোকিও স্টোর অডিও ও রিয়েল শিফট'
  },
  {
    id: 'jis_cv',
    badge: 'JIS CV STUDIO',
    title: 'জাপান স্ট্যান্ডার্ড JIS সিভি এক্সপোর্ট',
    titleJa: '履歴書・職務経歴書',
    description: 'জাপানি কোম্পানি ও ভিসা অনুমোদিত স্ট্যান্ডার্ড JIS 履歴書 এবং 職務経歴書 সরাসরি A4 PDF এক্সপোর্ট।',
    icon: FileText,
    accentGradient: 'from-blue-600/25 via-[#12162a] to-[#0d0918]',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    highlightText: 'A4 প্রিন্ট পারফেক্ট জাপানি ফরম্যাট'
  },
  {
    id: 'zero_n1',
    badge: 'ZERO TO N1 ROADMAP',
    title: 'সম্পূর্ণ ভাষা ও ক্যারিয়ার রোডম্যাপ',
    titleJa: 'N5からN1完全制覇',
    description: 'শূন্য থেকে শুরু করে JLPT N1 পর্যন্ত বাস্তব সিলেবাস, ৫০+ মক টেস্ট ও মিনিমাম টাইমে সর্বোচ্চ প্রোগ্রেস।',
    icon: Target,
    accentGradient: 'from-purple-600/25 via-[#1a122e] to-[#0d0918]',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    highlightText: '১,০০০+ বাস্তব অডিও ডায়ালগ ও কুইজ'
  },
  {
    id: 'japan_readiness',
    badge: 'JAPAN LIFE READINESS',
    title: 'জাপান লিভিং সারভাইভাল গাইড',
    titleJa: '日本生活完全ガイド',
    description: 'সিটি হল রেজিস্ট্রেশন, ব্যাংক অ্যাকাউন্ট খোলা, ময়লা ফেলার নিয়ম ও জাপানে বসবাসের সব বাস্তব কলাকৌশল।',
    icon: Compass,
    accentGradient: 'from-amber-600/25 via-[#1d1520] to-[#0d0918]',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    highlightText: 'বাস্তব জীবনযাপনে শতভাগ প্রস্তুতি'
  }
];

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  
  // Selected Plan: 'quarterly' (3-Month Nihomi Pro ৳5,670) vs 'yearly' (12-Month Nihomi Pro ৳20,300)
  const [selectedPlan, setSelectedPlan] = useState<'quarterly' | 'yearly'>('quarterly');

  // Carousel Active Slide (0 to 5)
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // Gateway Processing State
  const [isProcessingBkash, setIsProcessingBkash] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-advance Carousel every 3 seconds
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % NIHOMI_6_VALUES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      window.dispatchEvent(new CustomEvent('nihomi:modal-toggle', { detail: { open: true, source: 'pro-upgrade-modal' } }));
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.dispatchEvent(new CustomEvent('nihomi:modal-toggle', { detail: { open: false, source: 'pro-upgrade-modal' } }));
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentSlide = NIHOMI_6_VALUES[activeSlide];
  const SlideIcon = currentSlide.icon;

  // 1-Click Automated bKash PGW Checkout
  const handleBkashCheckout = async () => {
    setIsProcessingBkash(true);
    setErrorMessage(null);
    try {
      const planId = 'pro';
      const interval = selectedPlan;
      const amount = selectedPlan === 'quarterly' ? 5670 : 20300;
      trackNihomiEvent('subscription_checkout_started', { planId, provider: 'bkash', amount });
      
      const res = await billingApi.createBkashPayment({ planId, interval, amount });
      if (res.success && res.bkashURL) {
        window.location.href = res.bkashURL;
        return;
      }
      if (res.error) {
        throw new Error(res.error);
      }
      throw new Error('bKash গেটওয়ে চালু করতে সমস্যা হয়েছে।');
    } catch (err: any) {
      console.error('bKash error:', err);
      setErrorMessage(err.message || 'bKash গেটওয়ে চালু করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsProcessingBkash(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-[#0d0b1a] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-stone-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 2-Column Responsive Layout: Left Carousel, Right Automated Checkout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            
            {/* =================================================================== */}
            {/* LEFT COLUMN: Animated 3s Auto-Advancing Square Value Carousel      */}
            {/* =================================================================== */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-gradient-to-b from-[#14102c] via-[#100d24] to-[#0a0817] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between relative overflow-hidden">
              {/* Subtle Tokyo Neon Ambient Bloom */}
              <div className="pointer-events-none absolute -left-16 -top-16 w-52 h-52 bg-red-600/15 rounded-full blur-3xl" />
              <div className="pointer-events-none absolute -right-16 -bottom-16 w-52 h-52 bg-amber-500/15 rounded-full blur-3xl" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                    日
                  </div>
                  <span className="text-xs font-black tracking-wider text-amber-300 font-mono">
                    NIHOMI 6-CORE VALUES
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                    কেন নিহোমি প্রিমিয়াম?
                  </h3>
                  <p className="text-xs text-stone-300">
                    জাপানে পদার্পণ ও ক্যারিয়ার গড়ার পূর্ণাঙ্গ ডিজিটাল ইকোসিস্টেম।
                  </p>
                </div>

                {/* Animated Square Carousel Card */}
                <div className="relative min-h-[220px] sm:min-h-[240px] flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide.id}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.98 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className={`w-full p-5 rounded-2xl bg-gradient-to-br ${currentSlide.accentGradient} border border-white/15 shadow-xl space-y-3`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border ${currentSlide.badgeColor}`}>
                          {currentSlide.badge}
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
                          <SlideIcon className="w-5 h-5 text-amber-300" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[11px] font-japanese text-amber-400 font-bold">
                          {currentSlide.titleJa}
                        </div>
                        <h4 className="text-base font-black text-white leading-snug">
                          {currentSlide.title}
                        </h4>
                        <p className="text-xs text-stone-200 leading-relaxed font-medium">
                          {currentSlide.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-bold text-amber-300 font-mono">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{currentSlide.highlightText}</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* 6-Dot Carousel Indicator */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  {NIHOMI_6_VALUES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeSlide === idx
                          ? 'w-6 bg-gradient-to-r from-red-500 to-amber-500'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="relative z-10 pt-4 mt-4 border-t border-white/10 space-y-2 text-[11px] text-stone-400 font-medium">
                <div className="flex items-center gap-2 text-stone-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>SSLCOMMERZ ও bKash অনুমোদিত নিরাপদ গেটওয়ে</span>
                </div>
                <div className="flex items-center gap-2 text-stone-300">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>পেমেন্ট সফল হওয়ামাত্রই তাৎক্ষণিক সাবস্ক্রিপশন অ্যাক্টিভেশন</span>
                </div>
              </div>
            </div>

            {/* =================================================================== */}
            {/* RIGHT COLUMN: Automated 1-Click Gateway Checkout                    */}
            {/* =================================================================== */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
              
              <div className="space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
                    <Crown className="w-3.5 h-3.5" />
                    <span>AUTOMATED SECURE CHECKOUT</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
                    প্ল্যান নির্বাচন ও ইনস্ট্যান্ট অ্যাক্টিভেশন
                  </h2>
                  <p className="text-xs text-stone-300 mt-1">
                    কোনো ম্যানুয়াল অপেক্ষা নয় — ১-ক্লিকে bKash বা কার্ড দিয়ে শুরু করুন।
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center gap-2 text-red-300 text-xs font-medium">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Plan Selection Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Plan 1: ৳5,670 Nihomi Pro 3-Month Plan */}
                  <div
                    onClick={() => setSelectedPlan('quarterly')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative space-y-2.5 ${
                      selectedPlan === 'quarterly'
                        ? 'bg-gradient-to-b from-[#22183b] to-[#161129] border-amber-500 shadow-xl ring-1 ring-amber-500/50'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                        ৩ মাসের মাইলস্টোন
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedPlan === 'quarterly' ? 'border-amber-400 bg-amber-400' : 'border-stone-500'
                      }`}>
                        {selectedPlan === 'quarterly' && <Check className="w-3 h-3 text-stone-950 stroke-[3]" />}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-white">Nihomi Pro (৩ মাস)</h4>
                      <p className="text-[11px] text-stone-300 mt-0.5">JLPT N5-N3 ফুল মাস্টার কারিকুলাম</p>
                    </div>

                    <div className="pt-1">
                      <div className="text-2xl font-black text-amber-300">৳৫,৬৭০</div>
                      <span className="text-[10px] text-amber-400 font-mono">প্রতি মাসে ৳১,৮৯০ • সাশ্রয় ৳৩০০</span>
                    </div>

                    <ul className="text-[11px] text-stone-300 space-y-1 pt-1 border-t border-white/10">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>৫০+ N5-N3 ইন্টারঅ্যাক্টিভ লেসন</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Nomi Sensei (নমি সেন্সেই) ১,৫০০ কয়েন</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>JIS Rirekisho A4 PDF এক্সপোর্ট</span>
                      </li>
                    </ul>
                  </div>

                  {/* Plan 2: ৳20,300 Nihomi Pro 12-Month Plan */}
                  <div
                    onClick={() => setSelectedPlan('yearly')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative space-y-2.5 ${
                      selectedPlan === 'yearly'
                        ? 'bg-gradient-to-b from-[#22183b] to-[#161129] border-red-500 shadow-xl ring-1 ring-red-500/50'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold">
                        বাৎসরিক সেরা মান
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedPlan === 'yearly' ? 'border-red-400 bg-red-400' : 'border-stone-500'
                      }`}>
                        {selectedPlan === 'yearly' && <Check className="w-3 h-3 text-stone-950 stroke-[3]" />}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-white">Nihomi Pro (১২ মাস)</h4>
                      <p className="text-[11px] text-stone-300 mt-0.5">১ বছর সম্পূর্ণ নিশ্চিন্ত আনলিমিটেড</p>
                    </div>

                    <div className="pt-1">
                      <div className="text-2xl font-black text-rose-300">৳২০,৩০০</div>
                      <span className="text-[10px] text-stone-400 font-mono">প্রতি মাসে ৳১,৬৯২ • সাশ্রয় ৳৩,৫৮০</span>
                    </div>

                    <ul className="text-[11px] text-stone-300 space-y-1 pt-1 border-t border-white/10">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>N5, N4, N3, N2, N1 ফুল আনলক</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>WorkOS কনবিনি শিফট সিমুলেটর</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Shokumu Keirekisho Pro এক্সপোর্ট</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Automated Gateway Action Buttons: bKash Only */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-mono flex items-center justify-between">
                    <span>পেমেন্ট মাধ্যম: শুধুমাত্র বিকাশ (bKash Only)</span>
                    <span className="text-[#E2136E] text-[10px]">কার্ডের প্রয়োজন নেই</span>
                  </div>

                  {/* bKash 1-Click Gateway Button */}
                  <button
                    type="button"
                    onClick={handleBkashCheckout}
                    disabled={isProcessingBkash}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#E2136E] hover:bg-[#c90f61] text-white font-black text-sm shadow-xl shadow-[#E2136E]/25 transition flex items-center justify-between cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                        <span className="text-[#E2136E] font-black text-xs font-mono">bK</span>
                      </div>
                      <span className="text-left leading-tight">
                        bKash দিয়ে ১-ক্লিকে পেমেন্ট করুন ({selectedPlan === 'quarterly' ? '৳৫,৬৭০' : '৳২০,৩০০'})
                      </span>
                    </div>
                    {isProcessingBkash ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </button>

                  <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300 text-[11px] text-center font-medium">
                    অনলাইন পেমেন্ট গেটওয়ে সংযোগ প্রক্রিয়াধীন (Sandbox Testing)
                  </div>
                </div>
              </div>

              {/* Bottom Guarantee Note */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>কোনো লুকানো চার্জ নেই • ৭ দিনের মানিব্যাক গ্যারান্টি</span>
                </span>
                <span className="font-mono text-stone-500">256-Bit SSL Encrypted</span>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProUpgradeModal;
