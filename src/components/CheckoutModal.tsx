import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ArrowRight,
  Lock,
  Tag,
  Loader2,
  Check,
  Crown,
  ChevronRight,
  Bot,
  Brain,
  Store,
  FileText,
  Target,
  Compass,
  Zap,
  Phone,
  MessageCircle
} from 'lucide-react';
import { NIHOMI_CONTACT } from '../config/contact';
import { Plan, BillingInterval } from '../types';
import { billingApi } from '../lib/billingApi';
import { useAuth } from '../context/AuthContext';
import { trackNihomiEvent } from '../utils/analytics';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: Plan | null;
  plan?: Plan | null;
  initialInterval?: BillingInterval;
  defaultTab?: 'manual' | 'automated';
  onSuccess?: () => void;
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

export type PlanTierKey = 'starter' | 'pro' | 'japan_ready';

export interface PlanDefinition {
  id: PlanTierKey;
  name: string;
  nameJa: string;
  badge: string;
  badgeColor: string;
  monthlyPrice: number;
  yearlyPrice: number;
  tagline: string;
  features: string[];
}

export const CHECKOUT_PLANS: PlanDefinition[] = [
  {
    id: 'starter',
    name: 'Starter',
    nameJa: 'スターター',
    badge: 'ফাউন্ডেশন',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    monthlyPrice: 299,
    yearlyPrice: 2490,
    tagline: 'N5 ও N4 বেসিক ফাউন্ডেশন',
    features: [
      '২৫টি N5 ইন্টারঅ্যাক্টিভ লেসন',
      'ভোকাবুলারি ব্যাংক (৮০০+ শব্দ)',
      '১০০ AI Sensei ইন্টারঅ্যাকশন / মাস'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    nameJa: 'プロ',
    badge: 'সবচেয়ে জনপ্রিয়',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    monthlyPrice: 599,
    yearlyPrice: 4990,
    tagline: 'N5 থেকে N3 ফুল কারিকুলাম',
    features: [
      'N5, N4 ও N3 ফুল আনলক',
      '১,০০০ AI Coach চ্যাট / মাস',
      'JLPT ফুল মক এক্সাম ও SRS ডেক'
    ]
  },
  {
    id: 'japan_ready',
    name: 'Japan Ready',
    nameJa: '日本就労・移住特化',
    badge: 'সেরা মান',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    monthlyPrice: 999,
    yearlyPrice: 8490,
    tagline: 'চাকরি, ভিসা ও বাস্তব জাপান 🇯🇵',
    features: [
      'টোকিও কনবিনি ক্যাশিয়ার সিমুলেটর',
      'ভিসা ও জব ইন্টারভিউ সিমুলেশন',
      '৩,০০০ AI Coach ও সার্টিফিকেট'
    ]
  }
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  plan,
  initialInterval,
  onSuccess
}) => {
  const activePlan = selectedPlan || plan;
  const { user } = useAuth();

  const getInitialTier = (): PlanTierKey => {
    const pid = (activePlan?.id as string)?.toLowerCase();
    if (pid === 'starter') return 'starter';
    if (pid === 'japan_ready' || pid === 'career' || pid === 'n5_lifetime') return 'japan_ready';
    return 'pro';
  };

  const [tier, setTier] = useState<PlanTierKey>(getInitialTier());
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>(
    initialInterval === 'yearly' ? 'yearly' : 'monthly'
  );

  // Carousel Active Slide (0 to 5)
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // Processing state
  const [isProcessingBkash, setIsProcessingBkash] = useState<boolean>(false);
  const [isProcessingSsl, setIsProcessingSsl] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Connecting / Stub State
  const [isConnectingMode, setIsConnectingMode] = useState<boolean>(false);
  const [connectingMessage, setConnectingMessage] = useState<string>(
    'পেমেন্ট গেটওয়ে সংযোগ সম্পন্ন হচ্ছে (Live Gateway Connecting Tomorrow)'
  );

  // Coupon state
  const [couponCode, setCouponCode] = useState<string>('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    finalAmount: number;
  } | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  // Auto-advance Carousel every 3 seconds
  useEffect(() => {
    if (!isOpen) return;
    trackNihomiEvent('checkout_viewed', { planId: activePlan?.id || 'pro' });
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % NIHOMI_6_VALUES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen, activePlan?.id]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      window.dispatchEvent(new CustomEvent('nihomi:modal-toggle', { detail: { open: true, source: 'checkout-modal' } }));
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.dispatchEvent(new CustomEvent('nihomi:modal-toggle', { detail: { open: false, source: 'checkout-modal' } }));
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedPlanConfig = CHECKOUT_PLANS.find((p) => p.id === tier) || CHECKOUT_PLANS[1];
  const basePrice = billingInterval === 'yearly'
    ? selectedPlanConfig.yearlyPrice
    : selectedPlanConfig.monthlyPrice;
  const finalPrice = appliedCoupon ? appliedCoupon.finalAmount : basePrice;

  const currentSlide = NIHOMI_6_VALUES[activeSlide];
  const SlideIcon = currentSlide.icon;

  // Coupon apply
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponMessage(null);
    try {
      const res = await billingApi.validateCoupon({
        code: couponCode.trim(),
        planId: tier === 'starter' ? 'starter' : tier === 'japan_ready' ? 'japan_ready' : 'pro',
        billingInterval: billingInterval
      });
      if (res.success) {
        setAppliedCoupon({
          code: res.code,
          discountAmount: res.discountAmount || 50,
          finalAmount: Math.max(0, basePrice - (res.discountAmount || 50))
        });
        setCouponMessage(`কুপন প্রয়োগ হয়েছে! ৳${res.discountAmount || 50} ছাড়।`);
      } else {
        setCouponMessage('অবৈধ বা মেয়াদোত্তীর্ণ কুপন কোড।');
      }
    } catch {
      // Fallback local promo calculation for student convenience
      if (couponCode.trim().toUpperCase() === 'NIHOMI10') {
        const discount = Math.round(basePrice * 0.1);
        setAppliedCoupon({
          code: 'NIHOMI10',
          discountAmount: discount,
          finalAmount: basePrice - discount
        });
        setCouponMessage(`কুপন NIHOMI10 সফল! ৳${discount} ছাড়।`);
      } else {
        setCouponMessage('অবৈধ কুপন কোড।');
      }
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // 1-Click Automated bKash PGW Checkout
  const handleBkashCheckout = async () => {
    setIsProcessingBkash(true);
    setErrorMessage(null);
    try {
      trackNihomiEvent('subscription_checkout_started', {
        planId: tier,
        provider: 'bkash',
        amount: finalPrice,
        couponCode: appliedCoupon?.code
      });
      const res = await billingApi.createBkashPayment({
        tier: (tier === 'japan_ready' ? 'n5_lifetime' : 'n5_pro') as any,
        couponCode: appliedCoupon?.code
      });
      if ((res as any)?.connecting) {
        setIsConnectingMode(true);
        setConnectingMessage(
          (res as any).message || 'পেমেন্ট গেটওয়ে সংযোগ সম্পন্ন হচ্ছে (Live Gateway Connecting Tomorrow)'
        );
        return;
      }
      if (res.success && res.bkashURL) {
        window.location.href = res.bkashURL;
        return;
      }
      setIsConnectingMode(true);
      setConnectingMessage(
        'পেমেন্ট গেটওয়ে সংযোগ সম্পন্ন হচ্ছে (Live Gateway Connecting Tomorrow)। আজই ভর্তি হতে বা আসন সংরক্ষণ করতে সরাসরি আমাদের সাথে যোগাযোগ করুন:'
      );
    } catch {
      setIsConnectingMode(true);
      setConnectingMessage(
        'পেমেন্ট গেটওয়ে সংযোগ সম্পন্ন হচ্ছে (Live Gateway Connecting Tomorrow)। আজই নিশ্চিত আসন ও আর্লি-বার্ড সুবিধায় ভর্তি হতে সরাসরি আমাদের হেল্পলাইনে যোগাযোগ করুন:'
      );
    } finally {
      setIsProcessingBkash(false);
    }
  };

  // 1-Click Automated SSLCOMMERZ Hosted PGW Checkout
  const handleSslCheckout = async () => {
    setIsProcessingSsl(true);
    setErrorMessage(null);
    try {
      trackNihomiEvent('subscription_checkout_started', {
        planId: tier,
        provider: 'sslcommerz',
        amount: finalPrice,
        couponCode: appliedCoupon?.code
      });
      const res = await billingApi.createSslCommerzPayment({
        tier,
        planId: tier,
        amount: finalPrice,
        name: user?.name || user?.email?.split('@')[0] || 'Nihomi Learner'
      });
      if ((res as any)?.connecting) {
        setIsConnectingMode(true);
        setConnectingMessage(
          (res as any).message || 'পেমেন্ট গেটওয়ে সংযোগ সম্পন্ন হচ্ছে (Live Gateway Connecting Tomorrow)'
        );
        return;
      }
      if (res.success && res.gatewayUrl) {
        window.location.href = res.gatewayUrl;
        return;
      }
      setIsConnectingMode(true);
      setConnectingMessage(
        'কার্ড ও ইন্টারনেট ব্যাংকিং গেটওয়ে সংযোগ সম্পন্ন হচ্ছে (Live Gateway Connecting Tomorrow)। আজই নিশ্চিত আসন পেতে আমাদের সাথে যোগাযোগ করুন:'
      );
    } catch {
      setIsConnectingMode(true);
      setConnectingMessage(
        'কার্ড ও ইন্টারনেট ব্যাংকিং গেটওয়ে সংযোগ সম্পন্ন হচ্ছে (Live Gateway Connecting Tomorrow)। আজই নিশ্চিত আসন পেতে আমাদের সাথে যোগাযোগ করুন:'
      );
    } finally {
      setIsProcessingSsl(false);
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

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            
            {/* =================================================================== */}
            {/* LEFT COLUMN: Animated 3s Auto-Advancing Square Value Carousel      */}
            {/* =================================================================== */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-gradient-to-b from-[#14102c] via-[#100d24] to-[#0a0817] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between relative overflow-hidden">
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
                    নিহোমি প্রিমিয়াম এক্সপেরিয়েন্স
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
                  <span>পেমেন্ট সফল হওয়ামাত্রই তাৎক্ষণিক এক্সেস</span>
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
                    <span>AUTOMATED 1-CLICK GATEWAY</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
                    নিহোমি প্রিমিয়াম চেকআউট
                  </h2>
                  <p className="text-xs text-stone-300 mt-1">
                    কোনো ম্যানুয়াল নম্বর বা স্ক্রিনশট নয় — ১-ক্লিকে bKash বা কার্ড দিয়ে নিরাপদ পেমেন্ট করুন।
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center gap-2 text-red-300 text-xs font-medium">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Billing Interval Toggle */}
                <div className="flex items-center justify-between p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setBillingInterval('monthly')}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-center transition cursor-pointer ${
                      billingInterval === 'monthly'
                        ? 'bg-amber-500 text-stone-950 shadow-md'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    মাসিক (Monthly)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingInterval('yearly')}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      billingInterval === 'yearly'
                        ? 'bg-amber-500 text-stone-950 shadow-md'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <span>বাৎসরিক (Yearly)</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9px] font-black">২০% ছাড়</span>
                  </button>
                </div>

                {/* 3-Tier Professional Plan Selection Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {CHECKOUT_PLANS.map((p) => {
                    const isSelected = tier === p.id;
                    const price = billingInterval === 'yearly' ? p.yearlyPrice : p.monthlyPrice;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setTier(p.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-2 ${
                          isSelected
                            ? 'bg-gradient-to-b from-[#22183b] to-[#161129] border-amber-500 shadow-xl ring-1 ring-amber-500/50'
                            : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 opacity-75'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${p.badgeColor}`}>
                              {p.badge}
                            </span>
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-amber-400 bg-amber-400' : 'border-stone-500'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 text-stone-950 stroke-[3]" />}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-black text-white">{p.name}</h4>
                            <p className="text-[10px] text-stone-300 leading-tight">{p.tagline}</p>
                          </div>
                        </div>

                        <div className="pt-1 border-t border-white/10">
                          <div className="text-base font-black text-amber-300">৳{price.toLocaleString('en-US')}</div>
                          <span className="text-[9px] text-stone-400 font-mono">
                            {billingInterval === 'yearly' ? '/ বছর' : '/ মাস'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Optional Promo / Coupon code input */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="ডিসকাউন্ট কুপন (যেমন: NIHOMI10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-stone-500 uppercase tracking-wider focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-stone-200 font-bold text-xs cursor-pointer disabled:opacity-40"
                  >
                    {isApplyingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'প্রয়োগ'}
                  </button>
                </form>
                {couponMessage && (
                  <p className="text-[11px] text-amber-300 font-medium">
                    {couponMessage}
                  </p>
                )}

                {/* Connecting / Stub Mode Banner or 1-Click Gateway Buttons */}
                {isConnectingMode ? (
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-[#1e172e] to-[#140f21] border border-amber-500/40 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-amber-300">
                          পেমেন্ট গেটওয়ে সংযোগ সম্পন্ন হচ্ছে (Live Gateway Connecting Tomorrow)
                        </h4>
                        <p className="text-[11px] text-stone-300 mt-1 leading-relaxed">
                          {connectingMessage}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <a
                        href={`https://wa.me/${NIHOMI_CONTACT.whatsappNumber}?text=${encodeURIComponent(
                          `হ্যালো নিহোমি! আমি ${selectedPlanConfig.name} (${billingInterval === 'yearly' ? 'বাৎসরিক' : 'মাসিক'}) প্ল্যানে ভর্তি হতে চাই।`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp এ মেসেজ দিন</span>
                      </a>

                      <a
                        href={`tel:${NIHOMI_CONTACT.phone}`}
                        className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                      >
                        <Phone className="w-4 h-4 text-slate-300" />
                        <span>হটলাইন কল</span>
                      </a>
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => setIsConnectingMode(false)}
                        className="text-[10px] text-stone-400 hover:text-white underline cursor-pointer"
                      >
                        ← অন্য পেমেন্ট চ্যানেল ট্রাই করুন
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 pt-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                      নিরাপদ পেমেন্ট চ্যানেল নির্বাচন করুন:
                    </div>

                    {/* bKash / Nagad / Rocket MFS 1-Click Gateway Button */}
                    <button
                      type="button"
                      onClick={handleBkashCheckout}
                      disabled={isProcessingBkash || isProcessingSsl}
                      className="w-full py-3 px-5 rounded-2xl bg-[#E2136E] hover:bg-[#c90f61] text-white font-black text-sm shadow-xl shadow-[#E2136E]/25 transition flex items-center justify-between cursor-pointer active:scale-98 disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                          <span className="text-[#E2136E] font-black text-xs font-mono">bK</span>
                        </div>
                        <span className="text-left leading-tight text-xs sm:text-sm">
                          bKash / নগদ / রকেট দিয়ে পেমেন্ট (৳{finalPrice.toLocaleString('en-US')})
                        </span>
                      </div>
                      {isProcessingBkash ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ArrowRight className="w-5 h-5" />
                      )}
                    </button>

                    {/* SSLCOMMERZ Cards & Multi-Channel Button */}
                    <button
                      type="button"
                      onClick={handleSslCheckout}
                      disabled={isProcessingBkash || isProcessingSsl}
                      className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#1e293b] hover:border-amber-400/50 border border-white/15 text-white font-bold text-sm shadow-lg transition flex items-center justify-between cursor-pointer active:scale-98 disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-amber-400 shrink-0" />
                        <span className="text-left text-xs sm:text-sm">
                          কার্ড / ইন্টারনেট ব্যাংকিং (SSLCOMMERZ / Stripe)
                        </span>
                      </div>
                      {isProcessingSsl ? (
                        <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-stone-400" />
                      )}
                    </button>
                  </div>
                )}
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

export default CheckoutModal;
