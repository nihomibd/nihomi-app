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
  Crown,
  ChevronRight,
  Zap,
  Phone,
  MessageCircle,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { NIHOMI_CONTACT } from '../config/contact';
import { Plan, BillingInterval } from '../types';
import { calculateDailyCost, getPlanPriceForInterval, JourneyInterval } from '../core/billing/priceCalculator';
import { billingApi } from '../lib/billingApi';
import { useAuth } from '../context/AuthContext';
import { trackNihomiEvent } from '../utils/analytics';

export type PlanTierKey = 'starter' | 'pro' | 'japan_ready';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: Plan | null;
  plan?: Plan | null;
  initialInterval?: BillingInterval | JourneyInterval;
  defaultTab?: 'manual' | 'automated';
  onSuccess?: () => void;
}

function toBengaliDigits(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
}

// Canonical Plan Details for Checkout Confirmation
const CANONICAL_PLANS: Record<PlanTierKey, {
  id: PlanTierKey;
  name: string;
  nameJa: string;
  badge: string;
  badgeColor: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  halfYearlyPrice: number;
  yearlyPrice: number;
  tagline: string;
  features: string[];
}> = {
  starter: {
    id: 'starter',
    name: 'Nihomi Starter',
    nameJa: 'スターター',
    badge: 'ফাউন্ডেশন',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    monthlyPrice: 990,
    quarterlyPrice: 2820,
    halfYearlyPrice: 5350,
    yearlyPrice: 10100,
    tagline: 'বেসিক ফাউন্ডেশন ও হিরাগানা/কাতাকানা ড্রিল',
    features: [
      '২৫টি N5 ইন্টারঅ্যাক্টিভ লেসন ও সম্পূর্ণ কারিকুলাম',
      'ভোকাবুলারি ব্যাংক (৮০০+ শব্দ) ও স্পেসড রিপিটেশন',
      '৫০০ Nomi Sensei কয়েন / মাস'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Nihomi Pro',
    nameJa: 'プロ',
    badge: 'সবচেয়ে জনপ্রিয়',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    monthlyPrice: 1990,
    quarterlyPrice: 5670,
    halfYearlyPrice: 10750,
    yearlyPrice: 20300,
    tagline: 'N5 থেকে N3 ফুল কারিকুলাম + Nomi Sensei',
    features: [
      'N5, N4 ও N3 ফুল আনলক ও আনলিমিটেড ড্রিল',
      '১,৫০০ Nomi Sensei কয়েন / মাস',
      'JLPT ফুল মক এক্সাম ও প্রোগ্রেস অ্যানালিটিক্স'
    ]
  },
  japan_ready: {
    id: 'japan_ready',
    name: 'Nihomi Japan Ready',
    nameJa: '日本就労・移住特化',
    badge: 'সেরা মান',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    monthlyPrice: 3990,
    quarterlyPrice: 11370,
    halfYearlyPrice: 21550,
    yearlyPrice: 40700,
    tagline: 'চাকরি, ভিসা ইন্টারভিউ ও কনবিনি সিমুলেটর',
    features: [
      'টোকিও কনবিনি ক্যাশিয়ার ও কেইগো সিমুলেটর',
      'ভিসা ও জব ইন্টারভিউ সিমুলেশন',
      '৪,০০০ Nomi Sensei কয়েন ও অফিশিয়াল সার্টিফিকেট'
    ]
  }
};

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

  // Determine active plan tier from props
  const getInitialTier = (): PlanTierKey => {
    const pid = (activePlan?.id as string)?.toLowerCase();
    if (pid === 'starter') return 'starter';
    if (pid === 'japan_ready' || pid === 'japanready' || pid === 'career') return 'japan_ready';
    return 'pro';
  };

  const tier = getInitialTier();
  const planConfig = CANONICAL_PLANS[tier];

  // Resolve interval
  const normalizeInterval = (iv?: string): JourneyInterval => {
    if (iv === 'yearly') return 'yearly';
    if (iv === 'half_yearly' || iv === 'half-yearly') return 'half_yearly';
    if (iv === 'quarterly') return 'quarterly';
    return 'monthly';
  };

  const [billingInterval, setBillingInterval] = useState<JourneyInterval>(
    normalizeInterval(initialInterval as string)
  );

  // Sync interval if prop changes
  useEffect(() => {
    if (initialInterval) {
      setBillingInterval(normalizeInterval(initialInterval as string));
    }
  }, [initialInterval]);

  // Processing state
  const [isProcessingBkash, setIsProcessingBkash] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Connecting / Not Configured State
  const [isConnectingMode, setIsConnectingMode] = useState<boolean>(false);
  const [connectingMessage, setConnectingMessage] = useState<string>(
    'বিকাশ অনলাইন পেমেন্ট এখনো কনফিগার করা হয়নি। আপনার কাছ থেকে কোনো টাকা নেওয়া হয়নি।'
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

  // Calculate pricing
  const basePrice = getPlanPriceForInterval(planConfig.monthlyPrice, planConfig.yearlyPrice, billingInterval);
  const finalPrice = appliedCoupon ? appliedCoupon.finalAmount : basePrice;
  const dailyCostReport = calculateDailyCost(finalPrice, billingInterval);

  // Track modal open
  useEffect(() => {
    if (!isOpen) return;
    trackNihomiEvent('checkout_viewed', { planId: tier, interval: billingInterval });
  }, [isOpen, tier, billingInterval]);

  // Handle ESC key and accessibility
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

  // Coupon apply
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponMessage(null);
    try {
      const res = await billingApi.validateCoupon({
        code: couponCode.trim(),
        planId: tier,
        billingInterval: billingInterval as BillingInterval
      });
      if (res.success) {
        const discount = res.discountAmount || Math.round(basePrice * 0.1);
        setAppliedCoupon({
          code: res.code || couponCode.trim(),
          discountAmount: discount,
          finalAmount: Math.max(0, basePrice - discount)
        });
        setCouponMessage(`কুপন প্রয়োগ হয়েছে! ৳${discount} ছাড়।`);
      } else {
        setCouponMessage('অবৈধ বা মেয়াদোত্তীর্ণ কুপন কোড।');
      }
    } catch {
      // Local promo fallback for students
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

      // Generate client-side idempotency token for resilience
      const idempotencyKey = `idemp_${user?.id || 'guest'}_${tier}_${billingInterval}_${Date.now()}`;

      const res = await billingApi.createBkashPayment({
        planId: tier,
        tier: tier,
        interval: billingInterval,
        amount: finalPrice,
        couponCode: appliedCoupon?.code,
        idempotencyKey
      } as any);

      if ((res as any)?.gatewayStatus === 'NOT_CONFIGURED' || (res as any)?.connecting) {
        setIsConnectingMode(true);
        setConnectingMessage(
          (res as any).messageBn || (res as any).message || 'বিকাশ অনলাইন পেমেন্ট এখনো কনফিগার করা হয়নি। আপনার কাছ থেকে কোনো টাকা নেওয়া হয়নি।'
        );
        return;
      }

      if (res.success && res.bkashURL) {
        window.location.href = res.bkashURL;
        return;
      }

      setIsConnectingMode(true);
      setConnectingMessage(
        'বিকাশ অনলাইন পেমেন্ট এখনো কনফিগার করা হয়নি। আপনার কাছ থেকে কোনো টাকা নেওয়া হয়নি।'
      );
    } catch (err: any) {
      console.warn('[CheckoutModal] Payment create response:', err?.message);
      setIsConnectingMode(true);
      setConnectingMessage(
        'বিকাশ অনলাইন পেমেন্ট এখনো কনফিগার করা হয়নি। আপনার কাছ থেকে কোনো টাকা নেওয়া হয়নি।'
      );
    } finally {
      setIsProcessingBkash(false);
    }
  };

  return (
    <AnimatePresence>
      <div id="checkout-modal" data-testid="nihomi-checkout-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-[#0A0A12] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto p-5 sm:p-7 space-y-5"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-stone-300 hover:text-white transition cursor-pointer"
            aria-label="চেকআউট বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="space-y-1.5 pr-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>NIHOMI CHECKOUT • প্ল্যান নিশ্চিতকরণ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              নিহোমি প্রিমিয়াম চেকআউট
            </h2>
            <p className="text-xs text-stone-300">
              বিকাশ (bKash) অনলাইন পেমেন্টের মাধ্যমে ১-ক্লিকে তাৎক্ষণিক ভর্তি সম্পন্ন করুন।
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center gap-2 text-red-300 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Chosen Plan Summary Box (Single Plan Confirmation) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#141726] via-[#101320] to-[#0A0A12] border border-white/15 space-y-3 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border mb-1 ${planConfig.badgeColor}`}>
                  {planConfig.badge}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>{planConfig.name}</span>
                  <span className="text-xs font-normal text-amber-400 font-japanese font-semibold">({planConfig.nameJa})</span>
                </h3>
                <p className="text-xs text-stone-300 mt-0.5">{planConfig.tagline}</p>
              </div>

              <div className="text-right">
                <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                  ৳{finalPrice.toLocaleString('en-US')}
                </div>
                <div className="text-[10px] text-stone-400 font-mono">
                  {billingInterval === 'yearly' ? '১২ মাসের ফি' :
                   billingInterval === 'half_yearly' ? '৬ মাসের ফি' :
                   billingInterval === 'quarterly' ? '৩ মাসের ফি' : '১ মাসের ফি'}
                </div>
              </div>
            </div>

            {/* Billing Interval Selector (Adjust term without leaving modal) */}
            <div className="pt-2 border-t border-white/10">
              <div className="text-[11px] text-stone-400 font-medium mb-1.5 flex items-center justify-between">
                <span>বিলিং মেয়াদ (Billing Term):</span>
                <span className="text-amber-400 font-bold text-[10px]">{dailyCostReport.dailyLabelBn}</span>
              </div>
              <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setBillingInterval('monthly')}
                  className={`py-1.5 rounded-lg font-bold text-center transition cursor-pointer ${
                    billingInterval === 'monthly'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  ১ মাস
                </button>
                <button
                  type="button"
                  onClick={() => setBillingInterval('quarterly')}
                  className={`py-1.5 rounded-lg font-bold text-center transition cursor-pointer flex flex-col items-center justify-center ${
                    billingInterval === 'quarterly'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span>৩ মাস</span>
                  <span className={`text-[8px] font-black ${billingInterval === 'quarterly' ? 'text-amber-950' : 'text-amber-400'}`}>৫% ছাড়</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBillingInterval('half_yearly')}
                  className={`py-1.5 rounded-lg font-bold text-center transition cursor-pointer flex flex-col items-center justify-center ${
                    billingInterval === 'half_yearly'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span>৬ মাস</span>
                  <span className={`text-[8px] font-black ${billingInterval === 'half_yearly' ? 'text-amber-950' : 'text-amber-400'}`}>১০% ছাড়</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBillingInterval('yearly')}
                  className={`py-1.5 rounded-lg font-bold text-center transition cursor-pointer flex flex-col items-center justify-center ${
                    billingInterval === 'yearly'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span>১২ মাস</span>
                  <span className={`text-[8px] font-black ${billingInterval === 'yearly' ? 'text-rose-950' : 'text-rose-400'}`}>১৫% ছাড়</span>
                </button>
              </div>
            </div>

            {/* Daily cost comparison badge */}
            {dailyCostReport.comparisonBadgeBn && (
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>☕ {dailyCostReport.comparisonBadgeBn}</span>
              </div>
            )}
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

          {/* Honest Connecting / Not Configured State or bKash 1-Click Gateway */}
          {isConnectingMode ? (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#141726] to-[#0A0A12] border border-amber-500/40 space-y-3">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-amber-300">
                    বিকাশ অনলাইন পেমেন্ট স্ট্যাটাস (bKash Payment Status)
                  </h4>
                  <p className="text-[11px] text-stone-300 mt-1 leading-relaxed">
                    {connectingMessage}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <a
                  href={`https://wa.me/${NIHOMI_CONTACT.whatsappNumber}?text=${encodeURIComponent(
                    `হ্যালো নিহোমি! আমি ${planConfig.name} (${billingInterval === 'yearly' ? 'বাৎসরিক' : billingInterval === 'quarterly' ? '৩ মাস' : 'মাসিক'}) প্ল্যানে ভর্তি হতে চাই।`
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
                  className="text-[11px] text-stone-400 hover:text-white underline cursor-pointer"
                >
                  ← আবার চেষ্টা করুন
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* bKash 1-Click Gateway Button */}
              <button
                type="button"
                id="btn-confirm-bkash-checkout"
                onClick={handleBkashCheckout}
                disabled={isProcessingBkash}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#E2136E] hover:bg-[#c90f61] text-white font-black text-sm shadow-xl shadow-[#E2136E]/25 transition flex items-center justify-between cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                    <span className="text-[#E2136E] font-black text-xs font-mono">bK</span>
                  </div>
                  <span className="text-left leading-tight text-xs sm:text-sm">
                    bKash দিয়ে পেমেন্ট করুন (৳{toBengaliDigits(finalPrice.toLocaleString('en-US'))})
                  </span>
                </div>
                {isProcessingBkash ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>

              {/* Trust & Reassurance Notice */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5 text-[11px] text-stone-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>bKash অনুমোদিত নিরাপদ গেটওয়ে • কোনো কার্ড বা হিডেন ফি নেই</span>
                </div>
                <div className="flex items-center gap-2 text-stone-400">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>সফল পেমেন্টের সাথে সাথেই সকল প্রিমিয়াম কোর্স তাৎক্ষণিক আনলক হবে</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation link to switch plan */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 text-stone-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>অন্য প্ল্যান দেখতে প্রাইসিং পেজে ফিরে যান</span>
            </button>
            <span className="text-[10px] font-mono text-stone-500">256-Bit SSL Encrypted</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
