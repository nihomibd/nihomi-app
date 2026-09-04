import React, { useEffect, useState } from 'react';
import { CheckCircle2, Store, X } from 'lucide-react';
import { ConbiniPosCashierSimulator } from '../../../components/simulation/ConbiniPosCashierSimulator';

interface ConbiniSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => Promise<void>;
}

export const ConbiniSimulatorModal: React.FC<ConbiniSimulatorModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) { setLastScore(null); setIsSaving(false); }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const handleOrderComplete = (score: number) => setLastScore(score);
  const handleReward = async () => {
    if (lastScore === null) return;
    setIsSaving(true);
    await onComplete(lastScore);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#070912] p-2 text-white sm:p-5" role="presentation">
      <section className="mx-auto max-w-6xl" role="dialog" aria-modal="true" aria-labelledby="conbini-simulator-title">
        <header className="mb-4 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3"><div className="flex items-center gap-2"><Store className="text-amber-400" size={20} aria-hidden="true" /><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-400">レジ • BaitoOS™</p><h2 id="conbini-simulator-title" className="text-sm font-bold sm:text-base">Conbini POS Cashier Simulator</h2></div></div><button type="button" aria-label="Conbini simulator বন্ধ করুন" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"><X size={20} aria-hidden="true" /></button></header>
        <ConbiniPosCashierSimulator onCompleteOrder={handleOrderComplete} />
        {lastScore !== null && <div className="fixed inset-x-3 bottom-4 z-10 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-950/95 p-4 shadow-2xl"><CheckCircle2 className="shrink-0 text-emerald-400" size={24} aria-hidden="true" /><div className="min-w-0 flex-1"><p className="text-sm font-bold text-white">Transaction score: {lastScore}%</p><p className="text-xs text-emerald-200">সফল transaction-এ +40 XP এবং +10 Coins</p></div><button type="button" disabled={isSaving} onClick={() => void handleReward()} className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-stone-950 hover:bg-emerald-400 disabled:opacity-60">{isSaving ? 'Saving...' : 'Claim reward'}</button></div>}
      </section>
    </div>
  );
};

export default ConbiniSimulatorModal;
