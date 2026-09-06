import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Volume2, X, Mic, Brain } from 'lucide-react';
import { speakJapanese } from '../../../lib/tts';
import { TokyoPitchWaveform } from '../../../components/voice/TokyoPitchWaveform';
import { TokyoPitchAccentLab } from '../../../components/voice/TokyoPitchAccentLab';
import { SrsVocabularyService } from '../../../lib/srsService';
import { SrsRating } from '../../../lib/srs';

interface VocabFlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (reviewed: number) => Promise<void>;
}

const CARDS = [
  { word: '起きる', reading: 'おきる', romaji: 'okiru', meaningBn: 'ঘুম থেকে ওঠা', example: '毎朝六時に起きます。' },
  { word: '食べる', reading: 'たべる', romaji: 'taberu', meaningBn: 'খাওয়া', example: '朝ごはんを食べます。' },
  { word: '飲む', reading: 'のむ', romaji: 'nomu', meaningBn: 'পান করা', example: '水を飲みます。' },
  { word: '行く', reading: 'いく', romaji: 'iku', meaningBn: 'যাওয়া', example: '学校へ行きます。' },
  { word: '帰る', reading: 'かえる', romaji: 'kaeru', meaningBn: 'ফিরে আসা', example: '五時に家へ帰ります。' },
  { word: '見る', reading: 'みる', romaji: 'miru', meaningBn: 'দেখা', example: 'テレビを見ます。' },
  { word: '読む', reading: 'よむ', romaji: 'yomu', meaningBn: 'পড়া', example: '本を読みます。' },
  { word: '書く', reading: 'かく', romaji: 'kaku', meaningBn: 'লেখা', example: '名前を書きます。' },
  { word: '働く', reading: 'はたらく', romaji: 'hataraku', meaningBn: 'কাজ করা', example: 'コンビニで働きます。' },
  { word: '勉強', reading: 'べんきょう', romaji: 'benkyou', meaningBn: 'পড়াশোনা করা', example: '毎日日本語を勉強します。' },
] as const;

export const VocabFlashcardModal: React.FC<VocabFlashcardModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Pitch Accent Lab Modal
  const [isPitchLabOpen, setIsPitchLabOpen] = useState(false);
  const [pitchLabTargetWord, setPitchLabTargetWord] = useState('起きる');

  useEffect(() => {
    if (!isOpen) return;
    setIndex(0);
    setIsFlipped(false);
    setReviewed(0);
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
  const card = CARDS[index];

  const rateCard = (rating: SrsRating) => {
    // Record in Leitner SRS service
    SrsVocabularyService.reviewVocabulary(card.word, rating);

    const nextReviewed = reviewed + (rating === 'again' ? 0 : 1);
    setReviewed(nextReviewed);
    if (index === CARDS.length - 1) {
      setIsSaving(true);
      void onComplete(nextReviewed).then(() => {
        setIsSaving(false);
        onClose();
      });
      return;
    }
    setIndex((current) => current + 1);
    setIsFlipped(false);
  };

  const handleOpenPitchLab = (wordToPractice: string) => {
    setPitchLabTargetWord(wordToPractice);
    setIsPitchLabOpen(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/70 p-0 sm:items-center sm:p-4 backdrop-blur-xs"
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <section
          className="w-full max-w-lg rounded-t-3xl bg-[#fffdf8] p-5 shadow-2xl sm:rounded-3xl max-h-[92vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="vocab-modal-title"
        >
          <header className="flex items-start justify-between border-b border-stone-200 pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-600 flex items-center gap-1">
                <Brain className="w-3.5 h-3.5" />
                <span>語彙 • Unified Tokyo Pitch SRS</span>
              </p>
              <h2 id="vocab-modal-title" className="mt-0.5 text-lg font-bold text-stone-950">
                N5 Action Verbs & Pitch Contours
              </h2>
              <p className="text-xs font-medium text-stone-500">
                {index + 1} / {CARDS.length} cards &bull; {reviewed} mastered
              </p>
            </div>
            <button
              type="button"
              aria-label="Vocabulary modal বন্ধ করুন"
              onClick={onClose}
              className="rounded-full p-2 text-stone-500 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          {/* Flashcard Container */}
          <div
            className="mt-4 min-h-64 cursor-pointer select-none"
            onClick={() => setIsFlipped((current) => !current)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') setIsFlipped((current) => !current);
            }}
            aria-label="Flashcard flip করুন"
          >
            <div className="rounded-3xl border border-rose-200 bg-rose-50/60 p-5 text-center shadow-xs transition-all hover:border-rose-400">
              {!isFlipped ? (
                <div className="py-6 flex flex-col items-center justify-center space-y-3">
                  <p className="text-5xl font-black text-stone-950 font-japanese tracking-wide" lang="ja">
                    {card.word}
                  </p>
                  <p className="text-xl font-semibold text-rose-700 font-japanese" lang="ja">
                    {card.reading}
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        speakJapanese(card.word);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-rose-600 text-xs font-bold shadow-xs hover:bg-rose-100 transition-colors"
                    >
                      <Volume2 size={16} />
                      <span>উচ্চারণ শুনুন</span>
                    </button>
                  </div>
                  <p className="pt-2 text-xs font-bold text-stone-400">
                    💡 অর্থ ও Tokyo Pitch Accent তরঙ্গ দেখতে ক্লিক করুন
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-left animate-in fade-in" onClick={(e) => e.stopPropagation()}>
                  <div className="text-center space-y-1">
                    <p className="text-xs font-mono font-bold text-stone-500">{card.romaji}</p>
                    <p className="text-2xl font-bold text-rose-700">{card.meaningBn}</p>
                    <p className="text-xs font-medium text-stone-700 font-japanese pt-1" lang="ja">
                      {card.example}
                    </p>
                  </div>

                  {/* Native Tokyo Pitch-Accent Waveform */}
                  <div className="pt-2">
                    <TokyoPitchWaveform
                      word={card.word}
                      reading={card.reading}
                      compact={false}
                      showControls={true}
                      onOpenPitchLab={handleOpenPitchLab}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4-level Leitner SRS Rating Controls */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 px-1">
              <span>স্মৃতি পর্যালোচনা রেটিং (Leitner 5-Box):</span>
              <span className="text-amber-600 font-semibold">ক্লিক করে কার্ড এগিয়ে নিন</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => rateCard('again')}
                className="rounded-xl border border-red-200 bg-red-50 px-2 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors flex flex-col items-center"
              >
                <span>Again</span>
                <span className="text-[10px] font-mono text-red-500">&lt; 1 Day</span>
              </button>
              <button
                type="button"
                onClick={() => rateCard('hard')}
                className="rounded-xl border border-amber-200 bg-amber-50 px-2 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors flex flex-col items-center"
              >
                <span>Hard</span>
                <span className="text-[10px] font-mono text-amber-600">Repeat</span>
              </button>
              <button
                type="button"
                onClick={() => rateCard('good')}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors flex flex-col items-center"
              >
                <span>Good</span>
                <span className="text-[10px] font-mono text-emerald-600">+1 Box</span>
              </button>
              <button
                type="button"
                onClick={() => rateCard('easy')}
                disabled={isSaving}
                className="rounded-xl border border-sky-200 bg-sky-50 px-2 py-2.5 text-xs font-bold text-sky-700 hover:bg-sky-100 disabled:opacity-50 transition-colors flex flex-col items-center"
              >
                <span>Easy</span>
                <span className="text-[10px] font-mono text-sky-600">Fast Box</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] font-semibold text-stone-500 border-t border-stone-100 pt-3">
            <span>Easy/Good নির্ভুলতা: {reviewed}</span>
            <span className="text-emerald-700 font-bold">সেশন শেষে +20 XP ও কয়েন</span>
          </div>
        </section>
      </div>

      {/* Tokyo Pitch Accent Lab Modal */}
      <TokyoPitchAccentLab
        isOpen={isPitchLabOpen}
        onClose={() => setIsPitchLabOpen(false)}
        initialPresetId={pitchLabTargetWord}
      />
    </>
  );
};

export default VocabFlashcardModal;
