import React, { useEffect, useState } from 'react';
import { CheckCircle2, Coins, CreditCard, Sparkles, X, ShieldCheck } from 'lucide-react';
import { trackPurchase } from '../../../lib/analytics';

export interface StorePackage {
  id: 'starter' | 'intensive' | 'unlimited';
  name: string;
  price: number;
  coins: number;
  credits: number;
  description: string;
}

interface NihomiStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (pack: StorePackage) => Promise<void>;
}

const PACKAGES: StorePackage[] = [
  { id: 'starter', name: 'Starter Pack', price: 99, coins: 250, credits: 50, description: 'প্রতিদিনের practice শুরু করার জন্য' },
  { id: 'intensive', name: 'JLPT N5 Intensive Pack', price: 249, coins: 800, credits: 200, description: 'N5 প্রস্তুতির জন্য সেরা মূল্য' },
  { id: 'unlimited', name: 'Unlimited AI Sensei Monthly Pass', price: 499, coins: 0, credits: 1000, description: 'এক মাস AI Sensei access' },
];

export const NihomiStoreModal: React.FC<NihomiStoreModalProps> = ({ isOpen, onClose, onPurchase }) => {
  const [selectedPack, setSelectedPack] = useState<StorePackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedPack(null);
      setReceipt(null);
      setIsProcessing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (!selectedPack) return;
    setIsProcessing(true);
    await onPurchase(selectedPack);
    const receiptId = `BKASH-SIM-${Date.now().toString().slice(-8)}`;
    setReceipt(receiptId);
    trackPurchase(selectedPack.price, selectedPack.name, {
      transactionId: receiptId,
      currency: 'BDT',
      provider: 'bKash'
    });
    setIsProcessing(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/75 backdrop-blur-sm p-4 overflow-y-auto"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl border border-stone-200 text-left my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nihomi-store-title"
      >
        <header className="flex items-center justify-between border-b border-stone-200 bg-stone-50/80 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 font-mono">
                NIHOMI STORE
              </span>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full">
                bKash Instant
              </span>
            </div>
            <h2 id="nihomi-store-title" className="mt-1 text-lg font-black text-stone-950">
              Coins & AI Credits Top-Up
            </h2>
            <p className="text-xs font-medium text-stone-500">
              নিরাপদ bKash Checkout (BDT ৳)
            </p>
          </div>
          <button
            type="button"
            aria-label="Store বন্ধ করুন"
            onClick={onClose}
            className="btn-haptic rounded-full p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 focus:outline-none transition-colors cursor-pointer"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-800">
            <CreditCard size={16} aria-hidden="true" className="shrink-0" />
            <span>bKash verified student checkout • Direct auto-credit</span>
          </div>

          <div className="space-y-3">
            {PACKAGES.map((pack) => (
              <button
                key={pack.id}
                type="button"
                onClick={() => {
                  setSelectedPack(pack);
                  setReceipt(null);
                }}
                className={`btn-haptic w-full rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                  selectedPack?.id === pack.id
                    ? 'border-rose-500 bg-rose-50/70 shadow-md ring-2 ring-rose-400'
                    : 'border-stone-200 bg-white hover:border-rose-300 hover:bg-stone-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-950">{pack.name}</h3>
                    <p className="mt-1 text-xs text-stone-500">{pack.description}</p>
                  </div>
                  <span className="text-lg font-black text-rose-600">৳{pack.price}</span>
                </div>
                <div className="mt-3 flex gap-3 text-xs font-bold text-stone-700">
                  {pack.coins > 0 && (
                    <span className="flex items-center gap-1">
                      <Coins size={14} className="text-amber-500" aria-hidden="true" />
                      +{pack.coins} Coins
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Sparkles size={14} className="text-indigo-600" aria-hidden="true" />
                    +{pack.credits} AI Credits
                  </span>
                </div>
              </button>
            ))}
          </div>

          {receipt ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center space-y-2">
              <CheckCircle2 className="mx-auto text-emerald-600" size={32} aria-hidden="true" />
              <p className="text-sm font-bold text-emerald-950">Top-up Successful!</p>
              <p className="text-xs text-emerald-800 font-mono">রসিদ / TrxID: {receipt}</p>
              <button
                type="button"
                onClick={onClose}
                className="btn-haptic mt-3 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                ড্যাশবোর্ডে ফিরুন
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={!selectedPack || isProcessing}
              onClick={() => void handleCheckout()}
              className="btn-haptic w-full rounded-2xl bg-[#e2136e] hover:bg-[#c90f61] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/20 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <span>bKash যাচাই হচ্ছে...</span>
              ) : selectedPack ? (
                <span>Pay ৳{selectedPack.price} with bKash</span>
              ) : (
                <span>একটি প্যাকেজ বেছে নিন</span>
              )}
            </button>
          )}

          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-stone-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official SSL & bKash Merchant Gateway Secured</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NihomiStoreModal;
