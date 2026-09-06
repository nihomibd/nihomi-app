import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Headphones,
  Mic,
  ArrowRight,
  ArrowLeft,
  Brain,
  Layers,
  Award,
  Flame,
  Check
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';
import { SrsVocabularyService, VocabSrsRecord } from '../../lib/srsService';
import { SrsRating } from '../../lib/srs';
import { TokyoPitchWaveform } from '../voice/TokyoPitchWaveform';
import { TokyoPitchAccentLab } from '../voice/TokyoPitchAccentLab';
import { studentService } from '../../features/student-dashboard/studentService';

interface SRSFlashcardSessionProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: (totalReviewed: number) => void;
}

export const SRSFlashcardSession: React.FC<SRSFlashcardSessionProps> = ({
  isOpen,
  onClose,
  onCompleted
}) => {
  const [cards, setCards] = useState<VocabSrsRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [reviewedCount, setReviewedCount] = useState<number>(0);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [lastRatingFeedback, setLastRatingFeedback] = useState<string | null>(null);

  // Deep Dive Pitch Lab Modal State
  const [isPitchLabOpen, setIsPitchLabOpen] = useState(false);
  const [pitchLabTargetWord, setPitchLabTargetWord] = useState<string>('箸');

  // Load cards from SrsVocabularyService on modal open
  useEffect(() => {
    if (!isOpen) return;
    const allRecords = Object.values(SrsVocabularyService.getAllVocabRecords());
    if (allRecords.length > 0) {
      setCards(allRecords);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewedCount(0);
    setSessionCompleted(false);
    setLastRatingFeedback(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCard = cards[currentIndex] || {
    id: 'fallback-1',
    vocabId: 'fallback-1',
    word: '勉強',
    reading: 'べんきょう',
    meaningEn: 'Study / Diligence',
    meaningBn: 'পড়াশোনা বা অধ্যয়ন',
    jlptLevel: 'N5',
    leitnerBox: 1,
    intervalDays: 1,
    easeFactor: 2.5,
    stage: 'apprentice'
  };

  const handleSrsReview = (rating: SrsRating) => {
    const updated = SrsVocabularyService.reviewVocabulary(currentCard.id, rating);
    const newCount = reviewedCount + 1;
    setReviewedCount(newCount);

    // Feedback message
    const intervalMsg =
      rating === 'again'
        ? 'Box 1 এ রিসেট (আগামীকাল আবার প্র্যাকটিস)'
        : rating === 'hard'
        ? `Box ${updated.leitnerBox} (${updated.intervalDays} দিন পর)`
        : rating === 'good'
        ? `Box ${updated.leitnerBox} এ উন্নীত (+${updated.intervalDays} দিন)`
        : `Box ${updated.leitnerBox} এ দ্রুত মাস্টার (+${updated.intervalDays} দিন)`;

    setLastRatingFeedback(`স্মৃতি মান: ${rating.toUpperCase()} • ${intervalMsg}`);

    setTimeout(() => {
      setLastRatingFeedback(null);
      setIsFlipped(false);
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setSessionCompleted(true);
        // Award XP and coins
        studentService.completeVocabularyPractice(newCount);
        if (onCompleted) onCompleted(newCount);
      }
    }, 600);
  };

  const handleOpenVoiceLab = (wordToPractice: string) => {
    setPitchLabTargetWord(wordToPractice);
    setIsPitchLabOpen(true);
  };

  return (
    <>
      <div
        id="srs-flashcard-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in duration-200 text-left"
        onClick={onClose}
      >
        <div
          id="srs-flashcard-dialog"
          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-linear-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-red-600/20">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                    Tokyo Pitch & SRS Flashcard Engine
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-50 text-red-700 dark:bg-rose-950/50 dark:text-rose-300 border border-red-200 dark:border-rose-800">
                    JLPT {currentCard.jlptLevel || 'N5'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Card {currentIndex + 1} of {cards.length} • Leitner Box {currentCard.leitnerBox || 1} of 5
                </p>
              </div>
            </div>

            <button
              id="close-srs-modal"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {sessionCompleted ? (
            /* Session Completion View */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-stone-900 dark:text-white font-serif">
                  অসাধারণ অনুশীলন! SRS সেশন সম্পন্ন
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  আপনি আজ {reviewedCount}টি শব্দ Tokyo Pitch Accent সহ Leitner বাক্সে পর্যালোচনা করেছেন।
                </p>
              </div>

              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>+20 XP অর্জিত &bull; ডেইলি স্ট্রিক সংরক্ষিত</span>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-md transition-colors"
                >
                  ড্যাশবোর্ডে ফিরে যান
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Interactive Flashcard with 3D Flip */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer select-none rounded-3xl bg-linear-to-br from-stone-50 to-stone-100 dark:from-stone-800/90 dark:to-stone-900 border-2 border-stone-200 dark:border-stone-700 p-6 flex flex-col items-center justify-center text-center transition-all hover:border-red-400 dark:hover:border-rose-500 shadow-inner min-h-[220px]"
              >
                {!isFlipped ? (
                  /* Front: Word & Prompt */
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        Box {currentCard.leitnerBox || 1} • {currentCard.intervalDays || 1}d Interval
                      </span>
                    </div>

                    <div className="text-5xl font-black text-stone-900 dark:text-white tracking-wide font-japanese">
                      {currentCard.word}
                    </div>

                    <div className="text-base font-semibold text-rose-600 dark:text-rose-400">
                      {currentCard.reading}
                    </div>

                    <p className="text-xs text-stone-400 dark:text-stone-500 font-medium pt-2">
                      কার্ডটি উল্টাতে ক্লিক করুন (অর্থ ও পিচ অ্যাকসেন্ট তরঙ্গ দেখতে)
                    </p>
                  </div>
                ) : (
                  /* Back: Meaning & Pitch Waveform */
                  <div className="w-full space-y-3.5 animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-stone-900 dark:text-white">
                        {currentCard.meaningEn}
                      </div>
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                        {currentCard.meaningBn}
                      </div>
                    </div>

                    {/* Integrated Tokyo Pitch-Accent Waveform */}
                    <div className="pt-2 text-left" onClick={(e) => e.stopPropagation()}>
                      <TokyoPitchWaveform
                        word={currentCard.word}
                        reading={currentCard.reading}
                        compact={false}
                        showControls={true}
                        onOpenPitchLab={handleOpenVoiceLab}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Audio Pronunciation & Voice Lab */}
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => speakJapanese(currentCard.word)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-red-600 dark:text-rose-400" />
                  <span>Native Speech</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenVoiceLab(currentCard.word)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-red-700 dark:text-rose-300 text-xs font-semibold border border-red-200 dark:border-rose-900 transition-colors cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-red-600 dark:text-rose-400" />
                  <span>Test Voice in Pitch Lab</span>
                </button>
              </div>

              {/* Feedback toast during review */}
              {lastRatingFeedback && (
                <div className="text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                  {lastRatingFeedback}
                </div>
              )}

              {/* Leitner 5-Box SRS Spaced Repetition Rating Buttons */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 px-1">
                  <span>স্মৃতি recall রেটিং নির্বাচন করুন:</span>
                  <span className="font-mono text-stone-400">Leitner SM-2 Algorithm</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSrsReview('again')}
                    className="py-2 px-1 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-950/80 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 font-bold text-xs flex flex-col items-center gap-0.5 cursor-pointer transition-colors"
                  >
                    <span>Again</span>
                    <span className="text-[10px] text-red-500 font-mono">1 Day</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSrsReview('hard')}
                    className="py-2 px-1 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-950/80 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 font-bold text-xs flex flex-col items-center gap-0.5 cursor-pointer transition-colors"
                  >
                    <span>Hard</span>
                    <span className="text-[10px] text-amber-600 font-mono">Box {currentCard.leitnerBox || 1}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSrsReview('good')}
                    className="py-2 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex flex-col items-center gap-0.5 cursor-pointer transition-colors"
                  >
                    <span>Good</span>
                    <span className="text-[10px] text-emerald-600 font-mono">+1 Box</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSrsReview('easy')}
                    className="py-2 px-1 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 dark:hover:bg-sky-950/80 border border-sky-200 dark:border-sky-900 text-sky-800 dark:text-sky-300 font-bold text-xs flex flex-col items-center gap-0.5 cursor-pointer transition-colors"
                  >
                    <span>Easy</span>
                    <span className="text-[10px] text-sky-600 font-mono">Fast Boost</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Full Tokyo Pitch Accent Lab Modal for in-depth microphone pronunciation analysis */}
      <TokyoPitchAccentLab
        isOpen={isPitchLabOpen}
        onClose={() => setIsPitchLabOpen(false)}
        initialPresetId={pitchLabTargetWord}
      />
    </>
  );
};

export default SRSFlashcardSession;
