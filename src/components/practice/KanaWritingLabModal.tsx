import React, { useState, useRef, useEffect } from 'react';
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
  PenTool
} from 'lucide-react';

interface KanaWritingLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  onNavigateToN5?: () => void;
}

interface KanaChar {
  kana: string;
  romaji: string;
  bangla: string;
  strokes: number;
}

const KANA_VOWELS: KanaChar[] = [
  { kana: 'あ', romaji: 'a', bangla: 'আ', strokes: 3 },
  { kana: 'い', romaji: 'i', bangla: 'ই', strokes: 2 },
  { kana: 'う', romaji: 'u', bangla: 'উ', strokes: 2 },
  { kana: 'え', romaji: 'e', bangla: 'এ', strokes: 2 },
  { kana: 'お', romaji: 'o', bangla: 'ও', strokes: 3 },
];

const KANA_WORDS = [
  { word: 'あい', romaji: 'ai', meaning: 'ভালোবাসা / প্রেম (Love)', chars: ['あ', 'い'] },
  { word: 'いえ', romaji: 'ie', meaning: 'বাড়ি / ঘর (House)', chars: ['い', 'え'] },
  { word: 'あお', romaji: 'ao', meaning: 'নীল রঙ (Blue)', chars: ['あ', 'お'] },
  { word: 'うえ', romaji: 'ue', meaning: 'উপরে (Above / Up)', chars: ['う', 'え'] },
];

export const KanaWritingLabModal: React.FC<KanaWritingLabModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onNavigateToN5,
}) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'quiz' | 'words'>('draw');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  // Quiz State
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<string | null>(null);

  // Word Formation State
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [assembledWord, setAssembledWord] = useState<string[]>([]);
  const [wordSuccess, setWordSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentChar = KANA_VOWELS[currentCharIndex];
  const currentWord = KANA_WORDS[activeWordIndex];

  const playSound = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }
    } catch {}
  };

  useEffect(() => {
    if (activeTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 14;
        ctx.strokeStyle = '#dc2626';
      }
    }
  }, [activeTab, currentCharIndex]);

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
        setIsVerified(false);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (hasDrawn) {
      setIsVerified(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    if (e.type === 'mousedown' || e.type === 'touchstart') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
      setHasDrawn(true);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden text-left flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF9F6]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
              あ
            </div>
            <div>
              <h3 className="text-sm font-black text-stone-950 uppercase tracking-tight">
                Nihomi Hands-on Kana Lab
              </h3>
              <p className="text-[10px] text-stone-500 font-medium">
                হাতে-কলমে বর্ণমালা আঁকা • উচ্চারণ • কুইজ • শব্দ গঠন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('draw')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors ${
              activeTab === 'draw'
                ? 'bg-white text-red-600 border-t-2 border-red-600 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            ১. ক্যানভাসে আঁকা (Draw)
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors ${
              activeTab === 'quiz'
                ? 'bg-white text-red-600 border-t-2 border-red-600 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            ২. র‍্যান্ডম কুইজ (Quiz)
          </button>
          <button
            onClick={() => setActiveTab('words')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors ${
              activeTab === 'words'
                ? 'bg-white text-red-600 border-t-2 border-red-600 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            ৩. শব্দ গঠন ড্রিল (Words)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: DRAW & LISTEN */}
          {activeTab === 'draw' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {KANA_VOWELS.map((k, idx) => (
                    <button
                      key={k.kana}
                      onClick={() => {
                        setCurrentCharIndex(idx);
                        clearCanvas();
                        playSound(k.kana);
                      }}
                      className={`w-10 h-10 rounded-xl font-bold text-base font-japanese transition-all ${
                        currentCharIndex === idx
                          ? 'bg-red-600 text-white shadow-xs scale-105'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {k.kana}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => playSound(currentChar.kana)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-red-600" />
                  <span>উচ্চারণ শুনুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-stone-200 text-center space-y-3">
                  <div className="text-8xl font-black text-stone-900 font-japanese select-none">
                    {currentChar.kana}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-stone-800">
                      Romaji: <span className="text-red-600">{currentChar.romaji}</span> • বাংলা: {currentChar.bangla}
                    </div>
                    <div className="text-xs text-stone-500">{currentChar.strokes}টি স্ট্রোক (Strokes)</div>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="relative w-full aspect-square max-w-[220px] rounded-3xl border-2 border-dashed border-stone-300 bg-white shadow-inner flex items-center justify-center overflow-hidden touch-none">
                    <div className="absolute inset-0 flex items-center justify-center text-7xl font-japanese text-stone-100 select-none pointer-events-none">
                      {currentChar.kana}
                    </div>
                    <canvas
                      ref={canvasRef}
                      width={220}
                      height={220}
                      onMouseDown={startDrawing}
                      onMouseUp={stopDrawing}
                      onMouseMove={draw}
                      onTouchStart={startDrawing}
                      onTouchEnd={stopDrawing}
                      onTouchMove={draw}
                      className="relative z-10 w-full h-full cursor-crosshair"
                    />
                  </div>

                  <div className="flex items-center space-x-2 w-full max-w-[220px]">
                    <button
                      onClick={clearCanvas}
                      className="flex-1 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>মুছুন</span>
                    </button>
                    <button
                      onClick={() => playSound(currentChar.kana)}
                      className="py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>

              {isVerified && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>অসাধারণ! আপনি <strong>'{currentChar.kana}'</strong> নিখুঁতভাবে লিখেছেন।</span>
                  </div>
                  <button
                    onClick={() => {
                      if (currentCharIndex < KANA_VOWELS.length - 1) {
                        setCurrentCharIndex(currentCharIndex + 1);
                        clearCanvas();
                        playSound(KANA_VOWELS[currentCharIndex + 1].kana);
                      } else {
                        setActiveTab('quiz');
                      }
                    }}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                  >
                    {currentCharIndex < KANA_VOWELS.length - 1 ? 'পরবর্তী বর্ণ →' : 'কুইজে যান →'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RANDOM RECALL QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-6 animate-in fade-in text-center sm:text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                  প্রশ্ন {quizQuestionIndex + 1} / 5
                </span>
                <h4 className="text-base font-bold text-stone-900">
                  নিচের সাউন্ড শুনে সঠিক বর্ণটি চিহ্নিত করুন:
                </h4>
              </div>

              <div className="flex items-center justify-center p-6 bg-stone-50 rounded-3xl border border-stone-200">
                <button
                  onClick={() => playSound(KANA_VOWELS[quizQuestionIndex % KANA_VOWELS.length].kana)}
                  className="w-16 h-16 rounded-2xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                >
                  <Volume2 className="w-8 h-8" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {KANA_VOWELS.map((k) => (
                  <button
                    key={k.kana}
                    onClick={() => {
                      setQuizSelectedAnswer(k.kana);
                      const isCorrect = k.kana === KANA_VOWELS[quizQuestionIndex % KANA_VOWELS.length].kana;
                      if (isCorrect) setQuizScore(quizScore + 1);
                      playSound(k.kana);
                    }}
                    className={`py-4 rounded-2xl text-2xl font-black font-japanese border-2 transition-all ${
                      quizSelectedAnswer === k.kana
                        ? k.kana === KANA_VOWELS[quizQuestionIndex % KANA_VOWELS.length].kana
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : 'bg-red-50 border-red-500 text-red-700'
                        : 'bg-white border-stone-200 hover:border-stone-400 text-stone-900'
                    }`}
                  >
                    {k.kana}
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
                        playSound(KANA_VOWELS[(quizQuestionIndex + 1) % KANA_VOWELS.length].kana);
                      } else {
                        setActiveTab('words');
                      }
                    }}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5"
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
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                  Word Formation Drill
                </span>
                <h4 className="text-base font-bold text-stone-900">
                  শেখা বর্ণগুলো সাজিয়ে শব্দ তৈরি করুন:
                </h4>
                <p className="text-xs text-stone-500">
                  অর্থ: <strong>{currentWord.meaning}</strong> (Romaji: {currentWord.romaji})
                </p>
              </div>

              {/* Assembled Word Slot */}
              <div className="flex items-center justify-center p-6 bg-stone-50 rounded-3xl border border-stone-200 gap-3 min-h-[90px]">
                {assembledWord.length === 0 ? (
                  <span className="text-xs text-stone-400">নিচের বর্ণগুলোতে ক্লিক করে শব্দ সাজান</span>
                ) : (
                  assembledWord.map((ch, i) => (
                    <div
                      key={i}
                      className="w-14 h-14 rounded-2xl bg-white border-2 border-stone-300 flex items-center justify-center font-black text-2xl font-japanese text-stone-900 shadow-xs"
                    >
                      {ch}
                    </div>
                  ))
                )}
              </div>

              {/* Character Bank Tiles */}
              <div className="flex items-center justify-center gap-3">
                {KANA_VOWELS.map((k) => (
                  <button
                    key={k.kana}
                    onClick={() => handleWordTileClick(k.kana)}
                    className="w-12 h-12 rounded-2xl bg-white hover:bg-stone-100 border border-stone-300 font-bold text-xl font-japanese text-stone-800 shadow-2xs hover:scale-105 transition-all"
                  >
                    {k.kana}
                  </button>
                ))}
                <button
                  onClick={resetWordAssembly}
                  className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-2xl"
                  title="রিসেট"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {wordSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-3 animate-in fade-in">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      অভিনন্দন! আপনি সঠিকভাবে শব্দ তৈরি করেছেন: <strong>{currentWord.word}</strong> ({currentWord.meaning})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    {activeWordIndex < KANA_WORDS.length - 1 ? (
                      <button
                        onClick={() => {
                          setActiveWordIndex(activeWordIndex + 1);
                          resetWordAssembly();
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                      >
                        পরবর্তী শব্দ →
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onClose();
                          if (onNavigateToN5) onNavigateToN5();
                        }}
                        className="w-full py-3 bg-stone-950 hover:bg-stone-900 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md"
                      >
                        <span>ফাউন্ডেশন সম্পন্ন! এবার Minna no Nihongo Lesson 01 শুরু করুন →</span>
                        <ArrowRight className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
