import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Award,
  HelpCircle,
  PenTool,
  ChevronRight,
  Search
} from 'lucide-react';
import {
  KanaCharacter,
  KanaType,
  HIRAGANA_SEION,
  KATAKANA_SEION,
  getMasteredKanaList,
  toggleMasteredKana
} from '../../data/kanaData';
import { StrokeOrderGuide } from '../kana/StrokeOrderGuide';
import { KanaDrawingCanvas } from '../kana/KanaDrawingCanvas';
import { speakJapanese } from '../../lib/tts';

interface KanaWritingLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  onNavigateToN5?: () => void;
}

const KANA_PRACTICE_WORDS = [
  { word: 'あい', romaji: 'ai', meaning: 'ভালোবাসা / প্রেম (Love)', chars: ['あ', 'い'] },
  { word: 'いえ', romaji: 'ie', meaning: 'বাড়ি / ঘর (House)', chars: ['い', 'え'] },
  { word: 'あお', romaji: 'ao', meaning: 'নীল রঙ (Blue)', chars: ['あ', 'お'] },
  { word: 'うえ', romaji: 'ue', meaning: 'উপরে (Above / Up)', chars: ['う', 'え'] },
  { word: 'かさ', romaji: 'kasa', meaning: 'ছাতা (Umbrella)', chars: ['か', 'さ'] },
  { word: 'ねこ', romaji: 'neko', meaning: 'বিড়াল (Cat)', chars: ['ね', 'こ'] },
  { word: 'いぬ', romaji: 'inu', meaning: 'কুকুর (Dog)', chars: ['い', 'ぬ'] },
  { word: 'さくら', romaji: 'sakura', meaning: 'চেরি ফুল (Cherry Blossom)', chars: ['さ', 'く', 'ら'] },
];

export const KanaWritingLabModal: React.FC<KanaWritingLabModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onNavigateToN5,
}) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'quiz' | 'words'>('draw');
  const [activeKanaType, setActiveKanaType] = useState<KanaType>('hiragana');
  const [selectedKana, setSelectedKana] = useState<KanaCharacter>(HIRAGANA_SEION[0]);
  const [drawSubTab, setDrawSubTab] = useState<'guide' | 'canvas'>('guide');
  
  // Quiz State
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<string | null>(null);

  // Word Formation State
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [assembledWord, setAssembledWord] = useState<string[]>([]);
  const [wordSuccess, setWordSuccess] = useState(false);

  const currentList = activeKanaType === 'hiragana' ? HIRAGANA_SEION : KATAKANA_SEION;
  const currentWord = KANA_PRACTICE_WORDS[activeWordIndex % KANA_PRACTICE_WORDS.length];

  const playSound = (text: string) => {
    speakJapanese(text, { rate: 0.85 });
  };

  const handleNextInSequence = () => {
    const currentIndex = currentList.findIndex((k) => k.char === selectedKana.char);
    if (currentIndex !== -1 && currentIndex < currentList.length - 1) {
      setSelectedKana(currentList[currentIndex + 1]);
    } else if (currentList.length > 0) {
      setSelectedKana(currentList[0]);
    }
  };

  const handleWordTileClick = (char: string) => {
    const nextAssembled = [...assembledWord, char];
    setAssembledWord(nextAssembled);
    playSound(char);

    if (nextAssembled.join('') === currentWord.word) {
      setWordSuccess(true);
      setTimeout(() => playSound(currentWord.word), 400);
    }
  };

  const resetWordAssembly = () => {
    setAssembledWord([]);
    setWordSuccess(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-left flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-[#0d0d1a]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 font-black text-base flex items-center justify-center font-japanese">
              {selectedKana.char}
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">
                Nihomi Kana Mastery Lab (五十音図)
              </h3>
              <p className="text-[10px] text-stone-400 font-medium">
                হাতে-কলমে বর্ণমালা আঁকা • স্ট্রোক অর্ডার • কুইজ • শব্দ গঠন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 bg-stone-950 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('draw')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors ${
              activeTab === 'draw'
                ? 'bg-stone-900 text-rose-400 border-t-2 border-rose-500 shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            ১. স্ট্রোক ও ক্যানভাস (Draw)
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors ${
              activeTab === 'quiz'
                ? 'bg-stone-900 text-rose-400 border-t-2 border-rose-500 shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            ২. র‍্যান্ডম কুইজ (Quiz)
          </button>
          <button
            onClick={() => setActiveTab('words')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors ${
              activeTab === 'words'
                ? 'bg-stone-900 text-rose-400 border-t-2 border-rose-500 shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            ৩. শব্দ গঠন ড্রিল (Words)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: DRAW & STROKE GUIDE */}
          {activeTab === 'draw' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Syllabary Switch & Character Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="inline-flex p-1 rounded-xl bg-stone-950 border border-stone-800">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveKanaType('hiragana');
                      setSelectedKana(HIRAGANA_SEION[0]);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeKanaType === 'hiragana'
                        ? 'bg-rose-600 text-white'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    হিরাগানা (Hiragana)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveKanaType('katakana');
                      setSelectedKana(KATAKANA_SEION[0]);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeKanaType === 'katakana'
                        ? 'bg-amber-600 text-white'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    কাতাকানা (Katakana)
                  </button>
                </div>

                <div className="inline-flex p-1 rounded-xl bg-stone-950 border border-stone-800">
                  <button
                    type="button"
                    onClick={() => setDrawSubTab('guide')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      drawSubTab === 'guide'
                        ? 'bg-stone-800 text-white'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    স্ট্রোক অ্যানিমেশন
                  </button>
                  <button
                    type="button"
                    onClick={() => setDrawSubTab('canvas')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      drawSubTab === 'canvas'
                        ? 'bg-stone-800 text-white'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    হাতে আঁকার ক্যানভাস
                  </button>
                </div>
              </div>

              {/* Horizontal Scrollable Character Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                {currentList.map((k) => (
                  <button
                    key={k.char}
                    onClick={() => {
                      setSelectedKana(k);
                      playSound(k.char);
                    }}
                    className={`w-9 h-9 rounded-xl font-bold text-sm font-japanese shrink-0 transition-all ${
                      selectedKana.char === k.char
                        ? 'bg-rose-600 text-white shadow-sm scale-105'
                        : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    {k.char}
                  </button>
                ))}
              </div>

              {/* Character Details & Practice Core */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-7 flex justify-center">
                  {drawSubTab === 'guide' ? (
                    <StrokeOrderGuide kana={selectedKana} className="w-full max-w-sm" />
                  ) : (
                    <KanaDrawingCanvas
                      kana={selectedKana}
                      onNextCharacter={handleNextInSequence}
                      className="w-full max-w-sm"
                    />
                  )}
                </div>

                <div className="md:col-span-5 space-y-4">
                  {/* Mnemonic Card */}
                  <div className="p-4 rounded-2xl bg-[#0d0d1a] border border-stone-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>মনে রাখার কৌশল (Mnemonic)</span>
                    </div>
                    <p className="text-xs text-stone-200 leading-relaxed">
                      {selectedKana.mnemonicBn}
                    </p>
                    <p className="text-[11px] text-stone-400 italic">
                      "{selectedKana.mnemonicEn}"
                    </p>
                  </div>

                  {/* Vocabulary Card */}
                  <div className="p-4 rounded-2xl bg-[#0d0d1a] border border-stone-800 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>উদাহরণ শব্দ (Example Vocab)</span>
                    </div>

                    <div className="space-y-1.5">
                      {selectedKana.exampleVocab.map((v, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-xl bg-stone-900/90 border border-stone-800 flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold font-japanese text-white">{v.word}</span>
                              <span className="text-xs text-rose-400 font-mono">({v.reading})</span>
                            </div>
                            <p className="text-[11px] text-stone-400">{v.meaningBn}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => playSound(v.word)}
                            className="p-1 rounded-lg text-stone-400 hover:text-rose-400"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Character Trigger */}
                  <button
                    type="button"
                    onClick={handleNextInSequence}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <span>পরবর্তী বর্ণ অনুশীলন</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RANDOM RECALL QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-6 animate-in fade-in text-center sm:text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                  প্রশ্ন {quizQuestionIndex + 1} / 5
                </span>
                <h4 className="text-base font-bold text-white">
                  নিচের সাউন্ড শুনে সঠিক বর্ণটি চিহ্নিত করুন:
                </h4>
              </div>

              <div className="flex items-center justify-center p-6 bg-stone-950 rounded-3xl border border-stone-800">
                <button
                  onClick={() => playSound(currentList[quizQuestionIndex % currentList.length].char)}
                  className="w-16 h-16 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                >
                  <Volume2 className="w-8 h-8" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentList.slice(0, 8).map((k) => (
                  <button
                    key={k.char}
                    onClick={() => {
                      setQuizSelectedAnswer(k.char);
                      const isCorrect = k.char === currentList[quizQuestionIndex % currentList.length].char;
                      if (isCorrect) setQuizScore(quizScore + 1);
                      playSound(k.char);
                    }}
                    className={`py-4 rounded-2xl text-2xl font-black font-japanese border-2 transition-all ${
                      quizSelectedAnswer === k.char
                        ? k.char === currentList[quizQuestionIndex % currentList.length].char
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400'
                          : 'bg-rose-950/40 border-rose-500 text-rose-400'
                        : 'bg-stone-950 border-stone-800 hover:border-stone-700 text-white'
                    }`}
                  >
                    {k.char}
                  </button>
                ))}
              </div>

              {quizSelectedAnswer && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setQuizSelectedAnswer(null);
                      if (quizQuestionIndex < 4) {
                        setQuizQuestionIndex(quizQuestionIndex + 1);
                        playSound(currentList[(quizQuestionIndex + 1) % currentList.length].char);
                      } else {
                        setActiveTab('words');
                      }
                    }}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5"
                  >
                    <span>{quizQuestionIndex < 4 ? 'পরবর্তী প্রশ্ন →' : 'শব্দ গঠনে যান →'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WORD FORMATION */}
          {activeTab === 'words' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                  Word Formation Drill
                </span>
                <h4 className="text-base font-bold text-white">
                  শেখা বর্ণগুলো সাজিয়ে জাপানি শব্দ গঠন করুন:
                </h4>
                <p className="text-xs text-stone-400">
                  অর্থ: <strong className="text-rose-300">{currentWord.meaning}</strong> (Romaji: {currentWord.romaji})
                </p>
              </div>

              {/* Assembled Word Slot */}
              <div className="flex items-center justify-center p-6 bg-stone-950 rounded-3xl border border-stone-800 gap-3 min-h-[90px]">
                {assembledWord.length === 0 ? (
                  <span className="text-xs text-stone-500">নিচের বর্ণগুলোতে ক্লিক করে শব্দ সাজান</span>
                ) : (
                  assembledWord.map((ch, i) => (
                    <div
                      key={i}
                      className="w-14 h-14 rounded-2xl bg-stone-900 border-2 border-stone-700 flex items-center justify-center font-black text-2xl font-japanese text-white shadow-xs"
                    >
                      {ch}
                    </div>
                  ))
                )}
              </div>

              {/* Character Bank Tiles */}
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {['あ', 'い', 'う', 'え', 'お', 'か', 'さ', 'ね', 'こ', 'ぬ', 'ら'].map((char) => (
                  <button
                    key={char}
                    onClick={() => handleWordTileClick(char)}
                    className="w-12 h-12 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-stone-700 font-bold text-xl font-japanese text-white shadow-sm hover:scale-105 transition-all"
                  >
                    {char}
                  </button>
                ))}
                <button
                  onClick={resetWordAssembly}
                  className="px-3.5 py-2.5 rounded-2xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-xs font-semibold text-stone-400 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>রিসেট</span>
                </button>
              </div>

              {/* Success Banner */}
              {wordSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>চমৎকার! আপনি সফলভাবে <strong>'{currentWord.word}'</strong> গঠন করেছেন।</span>
                  </div>
                  <button
                    onClick={() => {
                      resetWordAssembly();
                      setActiveWordIndex((prev) => prev + 1);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
                  >
                    পরবর্তী শব্দ →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanaWritingLabModal;
