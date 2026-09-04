import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Volume2, X } from 'lucide-react';
import { speakJapanese } from '../../../lib/tts';

interface VocabFlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (reviewed: number) => Promise<void>;
}

const CARDS = [
  ['起きる', 'おきる', 'okiru', 'ঘুম থেকে ওঠা', '毎朝六時に起きます。'],
  ['食べる', 'たべる', 'taberu', 'খাওয়া', '朝ごはんを食べます。'],
  ['飲む', 'のむ', 'nomu', 'পান করা', '水を飲みます。'],
  ['行く', 'いく', 'iku', 'যাওয়া', '学校へ行きます。'],
  ['帰る', 'かえる', 'kaeru', 'ফিরে আসা', '五時に家へ帰ります。'],
  ['見る', 'みる', 'miru', 'দেখা', 'テレビを見ます。'],
  ['読む', 'よむ', 'yomu', 'পড়া', '本を読みます。'],
  ['書く', 'かく', 'kaku', 'লেখা', '名前を書きます。'],
  ['働く', 'はたらく', 'hataraku', 'কাজ করা', 'コンビニで働きます。'],
  ['勉強する', 'べんきょうする', 'benkyou suru', 'পড়াশোনা করা', '毎日勉強します。'],
] as const;

export const VocabFlashcardModal: React.FC<VocabFlashcardModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIndex(0); setIsFlipped(false); setReviewed(0); setIsSaving(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const card = CARDS[index];
  const rateCard = (rating: 'easy' | 'good' | 'hard') => {
    const nextReviewed = reviewed + (rating === 'hard' ? 0 : 1);
    setReviewed(nextReviewed);
    if (index === CARDS.length - 1) { setIsSaving(true); void onComplete(nextReviewed).then(() => { setIsSaving(false); onClose(); }); return; }
    setIndex((current) => current + 1); setIsFlipped(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/70 p-0 sm:items-center sm:p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="w-full max-w-md rounded-t-3xl bg-[#fffdf8] p-5 shadow-2xl sm:rounded-3xl" role="dialog" aria-modal="true" aria-labelledby="vocab-modal-title">
        <header className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-600">語彙 • Vocabulary SRS</p><h2 id="vocab-modal-title" className="mt-1 text-lg font-bold text-stone-950">Daily Actions Flashcards</h2><p className="text-xs font-medium text-stone-500">{index + 1} / {CARDS.length} cards reviewed</p></div><button type="button" aria-label="Vocabulary modal বন্ধ করুন" onClick={onClose} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500"><X size={20} aria-hidden="true" /></button></header>
        <div className="mt-5 min-h-64 cursor-pointer [perspective:1000px]" onClick={() => setIsFlipped((current) => !current)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setIsFlipped((current) => !current); }} aria-label="Flashcard flip করুন">
          <div className={`relative min-h-64 rounded-3xl border border-rose-100 bg-rose-50 p-6 text-center transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center [backface-visibility:hidden]"><p className="text-5xl font-bold text-stone-950" lang="ja">{card[0]}</p><p className="mt-3 text-xl font-semibold text-rose-700" lang="ja">{card[1]}</p><button type="button" onClick={(event) => { event.stopPropagation(); speakJapanese(card[1]); }} aria-label={`${card[1]} উচ্চারণ শুনুন`} className="mt-5 rounded-full bg-white p-3 text-rose-600 shadow-sm hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500"><Volume2 size={20} aria-hidden="true" /></button><p className="mt-5 text-xs font-bold text-stone-500">Tap to flip</p></div>
            <div className="absolute inset-0 flex rotate-y-180 flex-col items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]"><p className="text-xl font-bold text-stone-900">{card[2]}</p><p className="mt-3 text-lg font-bold text-rose-700">{card[3]}</p><p className="mt-4 text-sm font-medium leading-relaxed text-stone-700" lang="ja">{card[4]}</p><p className="mt-2 text-xs text-stone-500">উদাহরণ বাক্যটি জোরে পড়ুন</p></div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2"><button type="button" onClick={() => rateCard('hard')} className="rounded-xl border border-rose-200 bg-rose-50 px-2 py-3 text-xs font-bold text-rose-700 hover:bg-rose-100">Hard</button><button type="button" onClick={() => rateCard('good')} className="rounded-xl border border-amber-200 bg-amber-50 px-2 py-3 text-xs font-bold text-amber-800 hover:bg-amber-100">Good</button><button type="button" onClick={() => rateCard('easy')} disabled={isSaving} className="rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-3 text-xs font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50">Easy</button></div>
        <div className="mt-4 flex items-center justify-between text-[11px] font-semibold text-stone-500"><span>Easy/Good mastery: {reviewed}</span><span>শেষে +20 XP</span></div>
      </section>
    </div>
  );
};

export default VocabFlashcardModal;
