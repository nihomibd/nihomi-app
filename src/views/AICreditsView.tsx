import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Tag,
  ArrowRight,
  Loader2,
  Crown,
  Flame,
  Smartphone,
  Check,
  Lock,
  History,
  Bot,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AICreditsViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const AICreditsView: React.FC<AICreditsViewProps> = ({ onNavigate }) => {
  const { user, subscriptionDetails, topUpCredits, refreshSubscription } = useAuth();
  const [selectedPack, setSelectedPack] = useState<string>('pack-ai-1500');
  const [provider, setProvider] = useState<'bkash' | 'sslcommerz'>('bkash');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const packs = [
    {
      id: 'pack-ai-500',
      credits: 500,
      title: 'Starter AI Add-On',
      priceBDT: 150,
      description: 'Perfect for quick sign photo translations, Furigana checks & voice chats.',
      features: ['500 AI Sensei Queries', 'Vision Sensei 📷 OCR Scans', 'Never Expires', 'Voice Pitch Accent Check']
    },
    {
      id: 'pack-ai-1500',
      credits: 1500,
      title: 'Power Learner AI Add-On',
      priceBDT: 350,
      badge: 'Most Popular',
      description: 'Extensive voice notes practice, JLPT question breakdowns, and camera scans.',
      features: ['1,500 Voice & Text Interactions', 'Full Sentence DNA™ Access', 'High-Speed Priority Routing', 'Never Expires']
    },
    {
      id: 'pack-ai-5000',
      credits: 5000,
      title: 'Career & Interview Booster',
      priceBDT: 850,
      badge: 'Best Value',
      description: 'High-volume Japanese job interview prep and live voice dialogue coaching.',
      features: ['5,000 AI Queries', 'Tokyo Principal Interview Lab', 'BaitoOS™ Voice Practice Mode', 'Never Expires']
    },
  ];

  const currentActivePack = packs.find((p) => p.id === selectedPack) || packs[1];

  const remainingQuota =
    subscriptionDetails?.aiCreditsRemaining ??
    subscriptionDetails?.usage?.remainingQuota ??
    150;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    setPurchaseSuccess(null);
    setPurchaseError(null);
    try {
      // Simulate real-time bKash tokenized payment checkout or SSLCommerz gateway
      await new Promise((r) => setTimeout(r, 1200));
      
      topUpCredits(currentActivePack.credits);
      await refreshSubscription();
      
      setPurchaseSuccess(
        `Successfully added ${currentActivePack.credits.toLocaleString()} AI Credits to your account via ${
          provider === 'bkash' ? 'bKash MFS (Instant Tokenized)' : 'SSLCommerz Gateway'
        }!`
      );
    } catch (err: any) {
      setPurchaseError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div
      id="ai-credits-wallet-page"
      className="min-h-screen bg-[#FAF9F6] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] text-stone-900 dark:text-stone-100 sepia:text-amber-950 py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased text-left selection:bg-red-500 selection:text-white transition-colors"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Hero */}
        <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] rounded-3xl p-8 sm:p-10 shadow-2xs space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 dark:bg-rose-950/60 sepia:bg-[#f0e4cc] text-red-700 dark:text-rose-300 sepia:text-amber-900 text-xs font-bold border border-red-200 dark:border-rose-900 sepia:border-[#d9cbaf]">
            <Sparkles className="w-4 h-4 text-red-500 dark:text-rose-400" />
            <span>NIHOMI AI SENSEI CREDIT HUB</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-white sepia:text-amber-950">
            AI Credits & Instant Top-Up Packs
          </h1>
          <p className="text-stone-600 dark:text-stone-300 sepia:text-stone-800 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Your Nihomi subscription includes a generous monthly quota. If you need additional credits for extensive voice conversation, continuous camera photo OCR, or deep grammar inquiries, top up instantly with bKash.
          </p>

          {/* Current Quota Status Pill */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div className="space-y-1">
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider block">
                Active AI Voice & Vision Quota
              </span>
              <p className="text-2xl font-black text-stone-900 dark:text-white sepia:text-amber-950 flex items-center gap-2">
                <Zap className="w-6 h-6 text-amber-500" />
                <span>{remainingQuota.toLocaleString()} Queries Remaining</span>
              </p>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                Credits never expire and roll over automatically across billing cycles.
              </span>
            </div>
            <button
              id="btn-navigate-subscription-tier"
              type="button"
              onClick={() => onNavigate('pricing')}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-rose-600 dark:hover:bg-rose-700 sepia:bg-amber-900 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
            >
              Manage Subscription Plan
            </button>
          </div>
        </div>

        {purchaseSuccess && (
          <div
            id="alert-purchase-success"
            className="p-4 bg-emerald-50 dark:bg-emerald-950/60 sepia:bg-[#f0e4cc] border border-emerald-200 dark:border-emerald-800 sepia:border-[#d9cbaf] rounded-2xl text-xs text-emerald-950 dark:text-emerald-200 sepia:text-emerald-900 font-bold flex items-center space-x-2 animate-in fade-in"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{purchaseSuccess}</span>
          </div>
        )}

        {/* Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packs.map((p) => {
            const isSelected = selectedPack === p.id;
            return (
              <div
                key={p.id}
                id={`pack-card-${p.id}`}
                onClick={() => setSelectedPack(p.id)}
                className={`p-6 rounded-3xl border cursor-pointer transition-all relative flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] border-red-600 dark:border-rose-500 shadow-md ring-2 ring-red-500/20 dark:ring-rose-500/30'
                    : 'bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] hover:border-stone-300 dark:hover:border-stone-700 shadow-2xs'
                }`}
              >
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-red-600 dark:bg-rose-600 sepia:bg-amber-900 text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-2xs">
                    {p.badge}
                  </div>
                )}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-red-600 dark:text-rose-400 uppercase tracking-wider">
                    {p.credits.toLocaleString()} AI CREDITS
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white sepia:text-amber-950">{p.title}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">{p.description}</p>
                  
                  <div className="pt-2 space-y-1.5 border-t border-stone-100 dark:border-stone-800 sepia:border-[#d9cbaf]">
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-[11px] text-stone-600 dark:text-stone-300">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 sepia:border-[#d9cbaf] flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-stone-900 dark:text-white sepia:text-amber-950 font-mono">
                    ৳{p.priceBDT}
                  </span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-red-600 dark:text-rose-400' : 'text-stone-400'}`}>
                    {isSelected ? '✓ Selected' : 'Click to select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Method & Checkout */}
        <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-base font-bold text-stone-900 dark:text-white sepia:text-amber-950">
              Select Payment Method (Instant Activation)
            </h3>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Selected: <strong className="text-stone-900 dark:text-white">{currentActivePack.title} (৳{currentActivePack.priceBDT})</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              id="payment-method-bkash"
              type="button"
              onClick={() => setProvider('bkash')}
              className={`p-4 rounded-2xl border flex items-center space-x-3.5 transition-all cursor-pointer ${
                provider === 'bkash'
                  ? 'border-pink-500 bg-pink-50/60 dark:bg-pink-950/40 ring-2 ring-pink-500/20'
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50 dark:bg-stone-800/60'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#E2136E] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                bK
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-stone-900 dark:text-white sepia:text-amber-950">bKash Tokenized Checkout</p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400">Direct PIN / OTP & Instant Credit Wallet Top-Up</p>
              </div>
            </button>

            <button
              id="payment-method-sslcommerz"
              type="button"
              onClick={() => setProvider('sslcommerz')}
              className={`p-4 rounded-2xl border flex items-center space-x-3.5 transition-all cursor-pointer ${
                provider === 'sslcommerz'
                  ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50 dark:bg-stone-800/60'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-stone-900 dark:text-white sepia:text-amber-950">SSLCommerz / Cards / MFS</p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400">Nagad, Rocket, Visa, Mastercard, Internet Banking</p>
              </div>
            </button>
          </div>

          {purchaseSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center space-x-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{purchaseSuccess}</span>
            </div>
          )}

          {purchaseError && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-rose-950/40 border border-red-200 dark:border-rose-800 text-red-800 dark:text-rose-200 text-xs font-semibold flex items-center space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-rose-400 shrink-0" />
              <span>{purchaseError}</span>
            </div>
          )}

          <button
            id="btn-top-up-ai-credits"
            type="button"
            onClick={handlePurchase}
            disabled={isPurchasing}
            className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-rose-600 dark:hover:bg-rose-700 sepia:bg-amber-900 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {isPurchasing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-red-400 dark:text-rose-200" />
                <span>Processing Instant Top-Up with {provider === 'bkash' ? 'bKash' : 'SSLCommerz'}...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Top Up {currentActivePack.credits.toLocaleString()} AI Credits (৳{currentActivePack.priceBDT})</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
