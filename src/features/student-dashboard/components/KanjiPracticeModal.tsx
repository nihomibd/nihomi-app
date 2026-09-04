import React, { useEffect, useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { KanjiStrokeCanvas } from '../../../components/kanji/KanjiStrokeCanvas';

interface KanjiPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessfulTrace: () => Promise<void>;
}

const DAILY_KANJI = ['本', '語', '学'];

export const KanjiPracticeModal: React.FC<KanjiPracticeModalProps> = ({ isOpen, onClose, onSuccessfulTrace }) => {
  const [kanjiIndex, setKanjiIndex] = useState(0);
  const [hasVerified, setHasVerified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setKanjiIndex(0);
    setHasVerified(false);
    setIsSaving(false);
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

  const handleVerified = (score: number) => {
    if (score >= 88) setHasVerified(true);
  };

  const handleNextKanji = () => {
    setKanjiIndex((current) => (current + 1) % DAILY_KANJI.length);
    setHasVerified(false);
  };

  const handleReward = async () => {
    setIsSaving(true);
    await onSuccessfulTrace();
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/70 p-0 sm:items-center sm:p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-[#fffdf8] shadow-2xl sm:rounded-3xl" role="dialog" aria-modal="true" aria-labelledby="kanji-practice-title">
        <header className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">漢字 • N5 Daily Practice</p>
            <h2 id="kanji-practice-title" className="mt-1 text-lg font-bold text-stone-950">Kanji of the Day</h2>
            <p className="text-xs font-medium text-stone-500">আঙুল দিয়ে tracing করুন, তারপর Verify Strokes চাপুন</p>
          </div>
          <button type="button" aria-label="Kanji practice বন্ধ করুন" onClick={onClose} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"><X size={20} aria-hidden="true" /></button>
        </header>
        <div className="px-3 pb-5 pt-3 sm:px-5">
          <div className="mb-3 flex items-center justify-between text-xs font-bold text-stone-500"><span>আজকের সেট: 本 / 語 / 学</span><span>{kanjiIndex + 1} / {DAILY_KANJI.length}</span></div>
          <KanjiStrokeCanvas key={DAILY_KANJI[kanjiIndex]} isOpen initialKanji={DAILY_KANJI[kanjiIndex]} onVerified={handleVerified} />
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={handleNextKanji} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-bold text-stone-800 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-500">Next Kanji <ChevronRight size={17} aria-hidden="true" /></button>
            <button type="button" disabled={!hasVerified || isSaving} onClick={handleReward} className="flex flex-1 items-center justify-center rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-stone-950 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400">{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'Practice Complete (+10 XP)'}</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KanjiPracticeModal;
