import React from 'react';
import { X, Sparkles, PenTool } from 'lucide-react';
import { CanvasWritingPractice } from '../CanvasWritingPractice';

interface KanjiWritingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetKanji?: {
    kanji: string;
    hiragana?: string;
    english?: string;
    strokes?: number;
  };
}

export const KanjiWritingModal: React.FC<KanjiWritingModalProps> = ({
  isOpen,
  onClose,
  targetKanji = { kanji: '日', hiragana: 'にち・ひ', english: 'Sun, Day, Japan', strokes: 4 }
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="kanji-writing-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="kanji-writing-modal-dialog"
        className="bg-white dark:bg-stone-900 sepia:bg-[#fbf0d9] border border-slate-200 dark:border-stone-800 sepia:border-[#d9cbaf] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-stone-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Kanji Stroke Canvas (漢字練習)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-stone-400">
                Practice stroke orders with real-time digital brush feedback
              </p>
            </div>
          </div>
          <button
            id="close-kanji-writing-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <CanvasWritingPractice
          initialCharacter={targetKanji.kanji}
          characterList={[
            { char: targetKanji.kanji, reading: targetKanji.hiragana, meaning: targetKanji.english, strokes: targetKanji.strokes },
            { char: '本', reading: 'ほん', meaning: 'Book / Origin', strokes: 5 },
            { char: '語', reading: 'ご', meaning: 'Language', strokes: 14 },
            { char: '学', reading: 'がく', meaning: 'Study / Learn', strokes: 8 },
            { char: '生', reading: 'せい / なま', meaning: 'Life / Student', strokes: 5 }
          ]}
        />
      </div>
    </div>
  );
};
