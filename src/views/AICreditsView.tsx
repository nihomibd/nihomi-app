import React, { useState } from 'react';
import {
  Coins,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AICreditsViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const AICreditsView: React.FC<AICreditsViewProps> = ({ onNavigate }) => {
  const { coinWallet, user, setUserData } = useAuth();
  const [selectedPack, setSelectedPack] = useState<string>('pack-coins-750');
  const [provider, setProvider] = useState<'card' | 'eps' | 'bkash'>('bkash');
  const [currency, setCurrency] = useState<'USD' | 'JPY' | 'BDT'>('BDT');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const packs = [
    {
      id: 'pack-coins-250',
      coins: 250,
      title: 'Starter Pack',
      priceUSD: 4,
      priceJPY: 600,
      priceBDT: 480,
      description: 'Ideal for extra voice coaching and daily photo OCR scans.',
    },
    {
      id: 'pack-coins-750',
      coins: 750,
      title: 'Power Learner',
      priceUSD: 10,
      priceJPY: 1500,
      priceBDT: 1200,
      badge: 'MOST POPULAR',
      description: 'Extensive voice notes, JLPT question breakdowns, and Kanji canvas evaluation.',
    },
    {
      id: 'pack-coins-2000',
      coins: 2000,
      title: 'Career Booster',
      priceUSD: 24,
      priceJPY: 3600,
      priceBDT: 2880,
      badge: 'BEST VALUE',
      description: 'High-volume Japanese job interview prep and unlimited Gemini AI Sensei coaching.',
    },
  ];

  const handlePurchase = () => {
    setIsPurchasing(true);
    setPurchaseSuccess(null);

    const pack = packs.find((p) => p.id === selectedPack);
    const addedCoins = pack?.coins || 250;

    setTimeout(() => {
      if (coinWallet) {
        coinWallet.coinBalance += addedCoins;
        coinWallet.lifetimeEarned += addedCoins;
      }
      if (user) {
        setUserData({ ...user });
      }
      setPurchaseSuccess(`✓ Successfully added ${addedCoins} Nihomi Coins to your wallet!`);
      setIsPurchasing(false);
    }, 1000);
  };

  const currentCoins = coinWallet?.coinBalance ?? 500;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased text-left selection:bg-red-500 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Hero */}
        <div className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-10 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>NIHOMI COINS ECONOMY</span>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center space-x-1 text-xs font-bold bg-stone-100 p-1 rounded-xl">
              {(['BDT', 'USD', 'JPY'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    currency === curr ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {curr === 'USD' ? '$ USD' : curr === 'JPY' ? '¥ JPY' : '৳ BDT'}
                </button>
              ))}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-950">
            Nihomi Coins & Learning Credits
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Your Nihomi account includes regular monthly coins. Top up flexible prepaid Nihomi Coins anytime for voice speech coaching, book page OCR parsing, and personalized mock exam simulations.
          </p>

          {/* Current Balance */}
          <div className="p-5 rounded-2xl bg-stone-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div className="space-y-0.5">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block font-mono">
                Active Wallet Balance
              </span>
              <p className="text-3xl font-black text-white font-mono flex items-center space-x-2">
                <Coins className="w-6 h-6 text-amber-400" />
                <span>{currentCoins} Coins</span>
              </p>
            </div>
            <button
              onClick={() => onNavigate('courses')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
            >
              Explore Japanese Curriculum →
            </button>
          </div>
        </div>

        {purchaseSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 font-bold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
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
                onClick={() => setSelectedPack(p.id)}
                className={`p-6 rounded-3xl border cursor-pointer transition-all relative flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-white border-stone-950 shadow-md ring-2 ring-stone-900/20'
                    : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                }`}
              >
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-stone-950 text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-2xs">
                    {p.badge}
                  </div>
                )}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider font-mono">
                    {p.coins} NIHOMI COINS
                  </span>
                  <h3 className="text-lg font-bold text-stone-950">{p.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{p.description}</p>
                </div>
                <div className="pt-4 border-t border-stone-100 flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-stone-950 font-mono">
                    {currency === 'USD' && `$${p.priceUSD}`}
                    {currency === 'JPY' && `¥${p.priceJPY}`}
                    {currency === 'BDT' && `৳${p.priceBDT}`}
                  </span>
                  <span className="text-xs font-bold text-stone-900">
                    {isSelected ? '✓ Selected' : 'Select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Methods */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
          <h3 className="text-base font-bold text-stone-950">
            Select Payment Method
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setProvider('bkash')}
              className={`p-4 rounded-2xl border flex items-center space-x-3 transition-all cursor-pointer ${
                provider === 'bkash'
                  ? 'border-pink-500 bg-pink-50/60 ring-2 ring-pink-500/10'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-pink-600 text-white font-black text-xs flex items-center justify-center">
                bK
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-stone-900">bKash MFS</p>
                <p className="text-[10px] text-stone-500">Instant Local Activation</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setProvider('card')}
              className={`p-4 rounded-2xl border flex items-center space-x-3 transition-all cursor-pointer ${
                provider === 'card'
                  ? 'border-stone-950 bg-stone-50 ring-2 ring-stone-900/10'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-stone-950 text-white font-bold flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-stone-900">International Cards</p>
                <p className="text-[10px] text-stone-500">Visa, Mastercard, Amex</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setProvider('eps')}
              className={`p-4 rounded-2xl border flex items-center space-x-3 transition-all cursor-pointer ${
                provider === 'eps'
                  ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/10'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                EPS
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-stone-900">EPS & Global Bank</p>
                <p className="text-[10px] text-stone-500">Japan & Overseas Gateway</p>
              </div>
            </button>
          </div>

          <button
            onClick={handlePurchase}
            disabled={isPurchasing}
            className="w-full py-3.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {isPurchasing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                <span>Processing Payment Securely...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Authorize & Top Up Coins</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};