import React, { useEffect } from 'react';
import { PenLine, X } from 'lucide-react';
import { CanvasWritingPractice } from '../../../components/CanvasWritingPractice';

interface WritingPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (character: string) => void;
}

export const WritingPracticeModal: React.FC<WritingPracticeModalProps> = ({ isOpen, onClose, onComplete }) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 p-2 sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="relative mx-auto max-w-5xl rounded-3xl bg-[#fffdf8]" role="dialog" aria-modal="true" aria-labelledby="writing-practice-title"><header className="flex items-center justify-between border-b border-stone-200 px-4 py-3"><div className="flex items-center gap-2"><PenLine className="text-rose-600" size={19} aria-hidden="true" /><h2 id="writing-practice-title" className="text-sm font-bold text-stone-950">Kana & Kanji Writing Practice</h2></div><button type="button" aria-label="Writing practice বন্ধ করুন" onClick={onClose} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500"><X size={19} aria-hidden="true" /></button></header><CanvasWritingPractice onCompletePractice={onComplete} /></section>
    </div>
  );
};

export default WritingPracticeModal;
