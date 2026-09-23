// src/components/canvas3d/ContextualPaywallModal.tsx
// NIHOMI WORLD™ V3 — Contextual Spatial Paywall & Expansion Revenue Engine
// Zero-Buttonism In-Canvas Monetization, MRR Subscription Tiers, Japan Trip Pass & Coin Economy

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Coins,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Zap,
  GraduationCap,
  Plane,
  Compass,
  Check,
  Loader2,
  Calendar,
  Layers
} from 'lucide-react';
import {
  CONTINUOUS_MEMBERSHIPS,
  JAPAN_TRIP_PASSES,
  COIN_TOPUP_PACKAGES,
  ContinuousMembershipPlan,
  JapanTripPassPlan,
  CoinTopUpPackage,
  formatBDT
} from '../../config/mrrPlans';
import { useAuth } from '../../context/AuthContext';
import { worldAudio } from '../../lib/worldAudio';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';

export type PaywallMode = 'coin_unlock' | 'academy_upgrade' | 'coin_topup';

export interface ContextualPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: PaywallMode;
  hotspotTitle?: string;
  hotspotTitleJa?: string;
  unlockCostCoins?: number;
  onUnlockSuccess?: () => void;
  initialTrack?: 'continuous' | 'trip_pass';
}

export const ContextualPaywallModal: React.FC<ContextualPaywallModalProps> = ({
  isOpen,
  onClose,
  mode: initialMode,
  hotspotTitle = 'Izakaya Staff Roleplay',
  hotspotTitleJa = '居酒屋接客ロールプレイング',
  unlockCostCoins = 20,
  onUnlockSuccess,
  initialTrack = 'continuous'
}) => {
  const { user, updateSubscriptionPlan, purchaseCoinPack } = useAuth();

  // Active modal mode (can switch to topup if coins insufficient)
  const [currentMode, setCurrentMode] = useState<PaywallMode>(initialMode);
  const [selectedTrack, setSelectedTrack] = useState<'continuous' | 'trip_pass'>(initialTrack);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('pro');
  const [selectedTripPassId, setSelectedTripPassId] = useState<string>('trip_14d');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bkash' | 'nagad' | 'card'>('bkash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dynamic user coin balance from localStorage
  const [currentCoins, setCurrentCoins] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('nihomi_student_coins');
      return stored ? parseInt(stored, 10) : 420;
    } catch {
      return 420;
    }
  });

  // Sync mode with props when reopened
  React.useEffect(() => {
    if (isOpen) {
      setCurrentMode(initialMode);
      setSelectedTrack(initialTrack);
      setSuccessMessage(null);
      setIsProcessing(false);
      try {
        const stored = localStorage.getItem('nihomi_student_coins');
        if (stored) setCurrentCoins(parseInt(stored, 10));
      } catch {}
    }
  }, [isOpen, initialMode, initialTrack]);

  if (!isOpen) return null;

  // 1. Handle Hotspot Coin Unlock
  const handleCoinUnlock = () => {
    if (currentCoins < unlockCostCoins) {
      // Coins insufficient -> switch seamlessly to topup mode
      setCurrentMode('coin_topup');
      return;
    }

    setIsProcessing(true);
    worldAudio.playTokyoChime();

    setTimeout(() => {
      const newCoins = currentCoins - unlockCostCoins;
      try {
        localStorage.setItem('nihomi_student_coins', newCoins.toString());
      } catch {}
      setCurrentCoins(newCoins);
      triggerCelebrationConfetti();
      setIsProcessing(false);
      setSuccessMessage(`সফলভাবে ${unlockCostCoins} কয়েন দিয়ে আনলক করা হয়েছে!`);

      setTimeout(() => {
        onUnlockSuccess?.();
        onClose();
      }, 1000);
    }, 600);
  };

  // 2. Handle Subscription Plan / Trip Pass Upgrade (Simulated Sandbox Checkout)
  const handleUpgradePlan = async (planId: string) => {
    setIsProcessing(true);
    worldAudio.playTokyoChime();

    try {
      await updateSubscriptionPlan(planId, selectedPaymentMethod);
      triggerCelebrationConfetti();
      const planName = CONTINUOUS_MEMBERSHIPS[planId]?.name || JAPAN_TRIP_PASSES[planId]?.name || planId;
      setSuccessMessage(`অভিনন্দন! আপনার ${planName} সক্রিয় হয়েছে।`);

      setTimeout(() => {
        setIsProcessing(false);
        onUnlockSuccess?.();
        onClose();
      }, 1200);
    } catch (e) {
      setIsProcessing(false);
    }
  };

  // 3. Handle Coin Top-Up Purchase (Expansion Revenue)
  const handlePurchaseCoins = async (pkg: CoinTopUpPackage) => {
    setIsProcessing(true);
    worldAudio.playTokyoChime();

    try {
      await purchaseCoinPack(pkg.id);
      const totalCoinsGained = pkg.coins + pkg.bonusCoins;
      const updatedBalance = currentCoins + totalCoinsGained;
      setCurrentCoins(updatedBalance);
      triggerCelebrationConfetti();
      setSuccessMessage(`+${totalCoinsGained} নিহোমি কয়েন একাউন্টে যোগ হয়েছে!`);

      setTimeout(() => {
        setIsProcessing(false);
        // If originally came from coin_unlock, switch back to complete unlock
        if (initialMode === 'coin_unlock') {
          setCurrentMode('coin_unlock');
          setSuccessMessage(null);
        } else {
          onClose();
        }
      }, 1200);
    } catch (e) {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 select-none overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#090912]/95 border border-white/15 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-2xl my-auto text-slate-100 ring-1 ring-white/10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Global Success Banner */}
        {successMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* MODE A: HOTSPOT COIN UNLOCK (IZAKAYA / CONBINI ROLEPLAY)        */}
        {/* --------------------------------------------------------------- */}
        {currentMode === 'coin_unlock' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5" /> NIHOMI COIN UTILITY
              </span>
              <span className="text-[11px] text-zinc-400">Simulation Access Control</span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {hotspotTitle}
                </h2>
                <p className="text-xs font-japanese text-amber-400 mt-0.5 font-bold">
                  {hotspotTitleJa}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-right">
                  <span className="text-[10px] text-zinc-400 block uppercase font-semibold">আমার কয়েন ব্যালেন্স</span>
                  <span className="text-sm font-black text-amber-300 font-mono flex items-center justify-end gap-1">
                    <Coins className="w-3.5 h-3.5" /> {currentCoins} Coins
                  </span>
                </div>
              </div>
            </div>

            {/* Premium Simulation Showcase Card */}
            <div className="my-5 p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-zinc-950 font-bold shadow-md shadow-amber-500/20">
                  <Zap className="w-5 h-5 text-zinc-950" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">WorkOS™ লাইভ রোলপ্লে সিমুলেটর</h4>
                  <p className="text-xs text-zinc-400">টোকিওর কাস্টমারদের সাথে ইন্টার‍্যাক্টিভ জাপানিজ ডায়ালগ</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>গ্রাহকের দ্রুত গতিতে দেওয়া অর্ডার শোনা ও বিনম্র রিপিট (Keigo)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>বিল ও ক্যাশ ম্যানেজমেন্ট হিসাব (会計・お釣り)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>টোকিও বাস্তব কাজের পরিবেশে তাৎক্ষণিক ফিডব্যাক স্কোরিং</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-zinc-400">প্রবেশ ফি (Unlock Cost):</span>
                <span className="text-base font-extrabold text-amber-300 font-mono flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" /> {unlockCostCoins} Nihomi Coins
                </span>
              </div>
            </div>

            {/* Action Buttons depending on coin balance */}
            {currentCoins >= unlockCostCoins ? (
              <div className="space-y-3">
                <button
                  onClick={handleCoinUnlock}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      <span>{unlockCostCoins} কয়েন দিয়ে সিমুলেশন আনলক করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => setCurrentMode('academy_upgrade')}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>অথবা নিহোমি প্রো সাবস্ক্রাইব করে সকল রোলপ্লে আনলিমিটেড উপভোগ করুন</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between">
                  <span>পর্যাপ্ত কয়েন নেই (প্রয়োজন {unlockCostCoins} কয়েন, আপনার আছে {currentCoins})</span>
                  <span className="font-bold text-white">স্বল্প ব্যালেন্স</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setCurrentMode('coin_topup')}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950 font-bold text-xs shadow-lg active:scale-98 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Coins className="w-4 h-4" />
                    <span>কয়েন টপ-আপ করুন (৳৯৯ থেকে শুরু)</span>
                  </button>

                  <button
                    onClick={() => setCurrentMode('academy_upgrade')}
                    className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                  >
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    <span>প্রো / ট্রিপ পাস আনলক</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* MODE B: CONTEXTUAL IN-WORLD UPGRADES (ACADEMY / LESSON 6+)      */}
        {/* --------------------------------------------------------------- */}
        {currentMode === 'academy_upgrade' && (
          <div>
            {/* Header: AI Sensei Contextual Interruption */}
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-rose-900/30 flex-shrink-0">
                田
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    TANAKA AI SENSEI RECOMMENDATION
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">Shibuya Campus Gateway</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-1">
                  "টোকিও ল্যাঙ্গুয়েজ একাডেমিতে স্বাগতম!"
                </h3>
                <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                  মিন্না নো নিহোঙ্গো লেসন ৬ থেকে ২৫, অফিসিয়াল JLPT N5 মক টেস্ট এবং ভিসা ডিফেন্স সিমুলেটরে প্রবেশ করতে আপনার সুবিধাজনক ট্র্যাকটি নির্বাচন করুন।
                </p>
              </div>
            </div>

            {/* Track Switcher Tabs (Zero-Buttonism Contextual Navigation) */}
            <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-2xl border border-white/10 mb-4">
              <button
                onClick={() => setSelectedTrack('continuous')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedTrack === 'continuous'
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>ক্যারিয়ার ও JLPT মেম্বারশিপ (মাসিক)</span>
              </button>

              <button
                onClick={() => setSelectedTrack('trip_pass')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedTrack === 'trip_pass'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Plane className="w-4 h-4" />
                <span>জাপান ট্রিপ পাস (৭–৩০ দিন ট্যুরিস্ট)</span>
              </button>
            </div>

            {/* TRACK 1: CONTINUOUS MEMBERSHIP CARDS */}
            {selectedTrack === 'continuous' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
                {(['starter', 'pro', 'japan_ready'] as const).map((tierKey) => {
                  const plan = CONTINUOUS_MEMBERSHIPS[tierKey];
                  const isSelected = selectedPlanId === tierKey;

                  return (
                    <button
                      key={tierKey}
                      onClick={() => setSelectedPlanId(tierKey)}
                      className={`p-3.5 rounded-2xl text-left border transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-zinc-900/95 border-amber-400 ring-2 ring-amber-400/20 shadow-xl shadow-amber-500/10'
                          : 'bg-zinc-950/70 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-amber-500 to-rose-500 text-zinc-950 shadow">
                          POPULAR
                        </span>
                      )}

                      <div>
                        <h4 className="text-xs font-black text-white">{plan.nameBn}</h4>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-base font-black text-amber-300 font-mono">
                            {formatBDT(plan.priceBDT)}
                          </span>
                          <span className="text-[10px] text-zinc-400">/মাস</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">
                          {plan.taglineBn}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <Coins className="w-3 h-3" /> +{plan.coinsMonthly} Coins
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-amber-400 border-amber-400 text-zinc-950' : 'border-zinc-600'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TRACK 2: JAPAN TRIP PASS CARDS */}
            {selectedTrack === 'trip_pass' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
                {(['trip_7d', 'trip_14d', 'trip_30d'] as const).map((passKey) => {
                  const pass = JAPAN_TRIP_PASSES[passKey];
                  const isSelected = selectedTripPassId === passKey;

                  return (
                    <button
                      key={passKey}
                      onClick={() => setSelectedTripPassId(passKey)}
                      className={`p-3.5 rounded-2xl text-left border transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-zinc-900/95 border-cyan-400 ring-2 ring-cyan-400/20 shadow-xl shadow-cyan-500/10'
                          : 'bg-zinc-950/70 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {pass.popular && (
                        <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-cyan-400 text-zinc-950 shadow">
                          RECOMMENDED
                        </span>
                      )}

                      <div>
                        <h4 className="text-xs font-black text-white">{pass.nameBn}</h4>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-base font-black text-cyan-300 font-mono">
                            {formatBDT(pass.priceBDT)}
                          </span>
                          <span className="text-[10px] text-zinc-400">/{pass.durationDays} দিন</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">
                          {pass.taglineBn}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                        <span className="text-cyan-300 font-bold flex items-center gap-1">
                          <Coins className="w-3 h-3" /> +{pass.coinsGranted} Coins
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-cyan-400 border-cyan-400 text-zinc-950' : 'border-zinc-600'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Payment Method Selector & Instant Activation Button */}
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-medium">পেমেন্ট মেথড:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedPaymentMethod('bkash')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedPaymentMethod === 'bkash'
                        ? 'bg-rose-600 text-white shadow'
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    bKash
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod('nagad')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedPaymentMethod === 'nagad'
                        ? 'bg-orange-600 text-white shadow'
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Nagad
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod('card')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedPaymentMethod === 'card'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Card
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  const targetPlan = selectedTrack === 'continuous' ? selectedPlanId : selectedTripPassId;
                  handleUpgradePlan(targetPlan);
                }}
                disabled={isProcessing}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:brightness-110 text-white font-extrabold text-xs shadow-lg shadow-rose-900/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>সরাসরি সক্রিয় করুন (ইনস্ট্যান্ট অ্যাক্সেস)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* MODE C: EXPANSION REVENUE COIN TOP-UP STORE                     */}
        {/* --------------------------------------------------------------- */}
        {currentMode === 'coin_topup' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5" /> NIHOMI COIN VAULT
                </span>
                <span className="text-[11px] text-zinc-400">Expansion Revenue Top-Up</span>
              </div>
              <span className="text-xs font-bold text-amber-300 font-mono">
                বর্তমান ব্যালেন্স: {currentCoins}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              নিহোমি কয়েন টপ-আপ করুন
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5 mb-5">
              তানাকা সেনসেইয়ের রিয়েল-টাইম ভয়েস কোচিং, রেস্তোরাঁ ও কনবিনি সিমুলেশন সরাসরি আনলক করতে কয়েন প্যাক রিচার্জ করুন।
            </p>

            {/* 3 Coin Packages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {COIN_TOPUP_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-4 rounded-2xl border text-center relative flex flex-col justify-between transition-all ${
                    pkg.popular
                      ? 'bg-zinc-900/90 border-amber-400 ring-2 ring-amber-400/20 shadow-xl shadow-amber-500/10'
                      : pkg.bestValue
                      ? 'bg-zinc-900/90 border-cyan-400 ring-2 ring-cyan-400/20 shadow-xl shadow-cyan-500/10'
                      : 'bg-zinc-950/70 border-white/10'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2.5 inset-x-0 mx-auto w-fit px-2.5 py-0.5 rounded-full text-[9px] font-black bg-amber-400 text-zinc-950 shadow">
                      MOST POPULAR
                    </span>
                  )}
                  {pkg.bestValue && (
                    <span className="absolute -top-2.5 inset-x-0 mx-auto w-fit px-2.5 py-0.5 rounded-full text-[9px] font-black bg-cyan-400 text-zinc-950 shadow">
                      BEST VALUE (SAVE 40%)
                    </span>
                  )}

                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-2 text-amber-300">
                      <Coins className="w-6 h-6 animate-pulse" />
                    </div>
                    <h4 className="text-sm font-black text-white">{pkg.nameBn}</h4>
                    <p className="text-base font-extrabold text-amber-300 font-mono mt-1">
                      {formatBDT(pkg.priceBDT)}
                    </p>
                    {pkg.bonusCoins > 0 && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                        +{pkg.bonusCoins} বোনাস কয়েন
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handlePurchaseCoins(pkg)}
                    disabled={isProcessing}
                    className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 text-zinc-950 font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>ক্রয় করুন ({formatBDT(pkg.priceBDT)})</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-white/10">
              <span>🪙 ১টি প্রশ্ন = ১০ কয়েন • ১টি সিমুলেশন = ২০ কয়েন</span>
              <button
                onClick={() => setCurrentMode('academy_upgrade')}
                className="text-amber-400 hover:underline font-bold"
              >
                অথবা মেম্বারশিপ প্ল্যান দেখুন →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
