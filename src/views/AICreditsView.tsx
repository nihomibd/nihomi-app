import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Tag,
  ArrowRight,
  Loader2,
  Lock,
  Gift,
  Bot,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import { CheckoutModal } from '../components/CheckoutModal';

interface AICreditsViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const AICreditsView: React.FC<AICreditsViewProps> = ({ onNavigate }) => {
  const { user, subscriptionDetails, refreshSubscription } = useAuth();
  const [selectedPackId, setSelectedPackId] = useState<string>('pack_1500');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<any | null>(null);

  const packs = [
    {
      id: 'pack_500',
      credits: 500,
      title: 'Starter AI Add-On',
      price: 150,
      description: 'Vision Sensei ছবি স্ক্যান, সাইনবোর্ড অনুবাদ ও ফুরিগানা চেকের জন্য আদর্শ।',
      features: ['500 AI Sensei Queries', 'Vision Sensei 📷 OCR Scans', 'Never Expires']
    },
    {
      id: 'pack_1500',
      credits: 1500,
      title: 'Power Learner Pack',
      price: 350,
      popular: true,
      description: 'অতিরিক্ত ভয়েস প্র্যাকটিস, কাঞ্জি ব্রেকডাউন এবং JLPT প্রশ্ন বিশ্লেষণের জন্য।',
      features: ['1,500 Voice & Text Interactions', 'Full Sentence DNA™ Access', 'High-Speed Priority', 'Never Expires']
    },
    {
      id: 'pack_5000',
      credits: 5000,
      title: 'Career & Interview Booster',
      price: 850,
      badge: 'Best Value',
      description: 'টোকিও প্রিন্সিপাল ইন্টারভিউ সিমুলেটর ও বাইতো কর্মক্ষেত্রের দীর্ঘ অনুশীলনের জন্য।',
      features: ['5,000 AI Queries', 'Tokyo Principal Interview Lab', 'BaitoOS™ Voice Practice', 'Never Expires']
    }
  ];

  const handleOpenCheckout = (pack: any) => {
    setSelectedPackId(pack.id);
    const mockPlan: any = {
      id: pack.id,
      name: pack.title,
      displayNameJa: 'AIクレジット追加',
      tagline: `${pack.credits} AI Sensei Credits Top-Up`,
      monthlyPrice: pack.price,
      yearlyPrice: pack.price,
      features: pack.features
    };
    setSelectedPlanForModal(mockPlan);
    setIsCheckoutOpen(true);
  };

  const usage = subscriptionDetails?.usage;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-10 px-4 sm:px-6 lg:px-8" id="ai-credits-view">
      {selectedPlanForModal && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          selectedPlan={selectedPlanForModal}
          initialInterval="monthly"
          onSuccess={() => {
            setIsCheckoutOpen(false);
            refreshSubscription();
          }}
        />
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            <Sparkles className="w-4 h-4" />
            <span>Nihomi AI Coach Quota & Credit Wallet</span>
          </div>
          <h1 className="text-3xl font-extrabold font-serif text-stone-900">
            Top-up AI Sensei Queries & Credits
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
            আপনার সাবস্ক্রিপশন কোটার বাইরে অতিরিক্ত ছবি অনুবাদ (Vision Sensei), ভয়েস মেসেজিং ও কাঞ্জি বিশ্লেষণের জন্য যেকোনো সময় EPS বা বিকাশ দিয়ে টপ-আপ করুন।
          </p>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
            <div>
              <span className="text-[11px] text-stone-400 font-bold uppercase block">Active Monthly Quota</span>
              <p className="text-xl font-bold text-stone-900">
                {usage?.remainingQuota ?? 10} queries remaining this month ({usage?.periodYearMonth})
              </p>
            </div>
            <button
              onClick={() => onNavigate('pricing')}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer"
            >
              Upgrade Subscription Tier
            </button>
          </div>
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packs.map((pack) => (
            <div
              key={pack.id}
              onClick={() => setSelectedPackId(pack.id)}
              className={`bg-white border rounded-3xl p-6 shadow-sm flex flex-col justify-between cursor-pointer transition-all ${
                selectedPackId === pack.id
                  ? 'border-red-600 ring-2 ring-red-500/20 shadow-md'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                    {pack.credits} Credits
                  </span>
                  {pack.popular && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white">
                      Popular
                    </span>
                  )}
                  {pack.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                      {pack.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-900">{pack.title}</h3>
                  <div className="text-3xl font-extrabold text-stone-900 mt-1 font-mono">৳{pack.price}</div>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">{pack.description}</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  {pack.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleOpenCheckout(pack)}
                className="w-full mt-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Instant Checkout (৳{pack.price})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
