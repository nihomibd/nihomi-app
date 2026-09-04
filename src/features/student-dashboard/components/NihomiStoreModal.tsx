import React, { useEffect, useState } from 'react';
import { CheckCircle2, Coins, CreditCard, Sparkles, X } from 'lucide-react';

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
    if (!isOpen) { setSelectedPack(null); setReceipt(null); setIsProcessing(false); }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const handleCheckout = async () => {
    if (!selectedPack) return;
    setIsProcessing(true);
    await onPurchase(selectedPack);
    setReceipt(`BKASH-SIM-${Date.now().toString().slice(-8)}`);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/70 p-0 sm:items-center sm:p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-[#fffdf8] shadow-2xl sm:rounded-3xl" role="dialog" aria-modal="true" aria-labelledby="nihomi-store-title">
        <header className="flex items-center justify-between border-b border-stone-200 bg-white px-5 py-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-600">Nihomi Store</p><h2 id="nihomi-store-title" className="mt-1 text-lg font-bold text-stone-950">Coins & AI Credits Top-Up</h2><p className="text-xs font-medium text-stone-500">নিরাপদ simulated bKash checkout</p></div><button type="button" aria-label="Store বন্ধ করুন" onClick={onClose} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500"><X size={20} aria-hidden="true" /></button></header>
        <div className="px-5 py-5"><div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800"><CreditCard size={16} aria-hidden="true" /> bKash verified student checkout • BDT</div>
          <div className="space-y-3">{PACKAGES.map((pack) => <button key={pack.id} type="button" onClick={() => { setSelectedPack(pack); setReceipt(null); }} className={`w-full rounded-2xl border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 ${selectedPack?.id === pack.id ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-200' : 'border-stone-200 bg-white hover:border-rose-300'}`}><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-bold text-stone-950">{pack.name}</h3><p className="mt-1 text-xs text-stone-500">{pack.description}</p></div><span className="text-lg font-black text-rose-700">৳{pack.price}</span></div><div className="mt-3 flex gap-3 text-xs font-bold text-stone-700">{pack.coins > 0 && <span className="flex items-center gap-1"><Coins size={14} className="text-amber-600" aria-hidden="true" />+{pack.coins} Coins</span>}<span className="flex items-center gap-1"><Sparkles size={14} className="text-indigo-600" aria-hidden="true" />+{pack.credits} AI Credits</span></div></button>)}</div>
          {receipt ? <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center"><CheckCircle2 className="mx-auto text-emerald-600" size={28} aria-hidden="true" /><p className="mt-2 text-sm font-bold text-emerald-900">Top-up successful!</p><p className="mt-1 text-xs text-emerald-800">রসিদ: {receipt}</p><button type="button" onClick={onClose} className="mt-4 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400">ড্যাশবোর্ডে ফিরুন</button></div> : <button type="button" disabled={!selectedPack || isProcessing} onClick={() => void handleCheckout()} className="mt-5 w-full rounded-xl bg-[#e2136e] px-4 py-3.5 text-sm font-bold text-white hover:bg-[#c90f61] focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:cursor-not-allowed disabled:bg-stone-300">{isProcessing ? 'bKash যাচাই হচ্ছে...' : selectedPack ? `Pay ৳${selectedPack.price} with bKash` : 'একটি প্যাকেজ বেছে নিন'}</button>}
        </div>
      </section>
    </div>
  );
};

export default NihomiStoreModal;
