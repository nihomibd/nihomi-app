import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  X,
  BookOpen,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { apiRequest } from '../lib/api';
import { speakJapanese } from '../lib/tts';
import { SentenceDnaResponse } from '../types';

interface SentenceDnaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSentence?: string;
}

export const SentenceDnaModal: React.FC<SentenceDnaModalProps> = ({
  isOpen,
  onClose,
  initialSentence = '日本語を勉強しています。'
}) => {
  const [inputSentence, setInputSentence] = useState(initialSentence);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dnaResult, setDnaResult] = useState<SentenceDnaResponse | null>(null);

  useEffect(() => {
    if (initialSentence) {
      setInputSentence(initialSentence);
    }
  }, [initialSentence]);

  useEffect(() => {
    if (isOpen && inputSentence.trim()) {
      handleAnalyze(inputSentence.trim());
    }
  }, [isOpen]);

  const handleAnalyze = async (sentenceToAnalyze?: string) => {
    const text = (sentenceToAnalyze || inputSentence).trim();
    if (!text) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await apiRequest<{ success: boolean; sentenceDna: SentenceDnaResponse }>('/api/ai/sentence-dna', {
        method: 'POST',
        body: JSON.stringify({ sentence: text })
      });
      if (res.success && res.sentenceDna) {
        setDnaResult(res.sentenceDna);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to analyze Sentence DNA.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md font-serif font-bold">
              DNA
            </div>
            <div>
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50">
                Nihomi Sentence DNA™ Deep Breakdown
              </h3>
              <p className="text-xs text-zinc-500">
                Turn any single Japanese sentence into a complete, multilingual masterclass.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 rounded-xl cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputSentence}
              onChange={(e) => setInputSentence(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAnalyze();
              }}
              placeholder="Paste any Japanese sentence here (e.g. 日本語を勉強しています。)"
              className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-serif"
            />
            <button
              onClick={() => handleAnalyze()}
              disabled={isLoading || !inputSentence.trim()}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Analyze DNA</span>
            </button>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {dnaResult && (
            <div className="space-y-6 animate-in fade-in">
              {/* Main Sentence Card */}
              <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                      {dnaResult.jlptLevel} &bull; {dnaResult.formality}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-zinc-900 dark:text-zinc-50">
                      {dnaResult.japanese}
                    </h2>
                    <p className="text-sm text-red-600 font-serif">{dnaResult.furigana}</p>
                  </div>
                  <button
                    onClick={() => speakJapanese(dnaResult.japanese)}
                    className="p-3 rounded-2xl bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-red-600 shadow-sm"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Pronunciations Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="font-bold text-zinc-500 block text-[10px] uppercase">বাংলা উচ্চারণ:</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-sm font-sans">{dnaResult.banglaPronunciation}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="font-bold text-zinc-500 block text-[10px] uppercase">English Pronunciation:</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-sm">{dnaResult.englishPronunciation}</span>
                  </div>
                </div>

                {/* Meanings Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="font-bold text-emerald-600 block text-[10px] uppercase">বাংলা অর্থ:</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{dnaResult.banglaMeaning}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="font-bold text-blue-600 block text-[10px] uppercase">English Meaning:</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{dnaResult.englishMeaning}</span>
                  </div>
                </div>
              </div>

              {/* Particle Analysis */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-600" />
                  Particle Function Breakdown
                </h4>
                <div className="space-y-2 text-xs">
                  {dnaResult.particlesUsed?.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 text-zinc-800 dark:text-zinc-200 flex items-start gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold font-serif">{p.particle}</span>
                      <div>
                        <span className="font-bold">{p.role}:</span> <span>{p.explanation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Casual vs Polite Variations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 space-y-1">
                  <span className="font-bold text-zinc-500 text-[10px] uppercase">Casual Daily Version:</span>
                  <p className="font-serif text-sm font-semibold text-zinc-900 dark:text-zinc-100">{dnaResult.casualVersion}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 space-y-1">
                  <span className="font-bold text-zinc-500 text-[10px] uppercase">Formal / Business Polite:</span>
                  <p className="font-serif text-sm font-semibold text-zinc-900 dark:text-zinc-100">{dnaResult.politeVersion}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
