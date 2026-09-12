import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Volume2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Trophy,
  Award,
  BookOpen,
  Check,
  ChevronRight,
  Zap
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';
import { trackNihomiEvent } from '../../utils/analytics';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';

interface ZeroJapaneseGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (goalOrAction: string) => void;
}

interface KanaVowel {
  char: string;
  romaji: string;
  bn: string;
  strokes: number;
  strokeDirections: string[];
  exampleWord: string;
  exampleMeaningBn: string;
}

const FOUNDATIONAL_VOWELS: KanaVowel[] = [
  {
    char: 'あ',
    romaji: 'a',
    bn: 'আ',
    strokes: 3,
    strokeDirections: ['১. বাম থেকে ডানে আনুভূমিক দাগ', '২. উপর থেকে নিচে উল্লম্ব বাঁকা দাগ', '৩. বৃত্তাকার লুপ'],
    exampleWord: 'あさ (Asa)',
    exampleMeaningBn: 'সকাল'
  },
  {
    char: 'い',
    romaji: 'i',
    bn: 'ই',
    strokes: 2,
    strokeDirections: ['১. বামের দীর্ঘ বাঁকা দাগ ও হুক', '২. ডানের ছোট সমান্তরাল দাগ'],
    exampleWord: 'いぬ (Inu)',
    exampleMeaningBn: 'কুকুর'
  },
  {
    char: 'う',
    romaji: 'u',
    bn: 'উ',
    strokes: 2,
    strokeDirections: ['১. উপরের ছোট তির্যক বিন্দু', '২. নিচের বাঁকা খিলান'],
    exampleWord: 'うみ (Umi)',
    exampleMeaningBn: 'সমুদ্র'
  },
  {
    char: 'え',
    romaji: 'e',
    bn: 'এ',
    strokes: 2,
    strokeDirections: ['১. উপরের তির্যক টান', '২. জিগ-জ্যাগ ও নিচের সমতল টান'],
    exampleWord: 'えき (Eki)',
    exampleMeaningBn: 'রেলওয়ে স্টেশন'
  },
  {
    char: 'お',
    romaji: 'o',
    bn: 'ও',
    strokes: 3,
    strokeDirections: ['১. বাম থেকে ডানে আনুভূমিক টান', '২. উল্লম্ব টান ও বড় লুপ', '৩. উপরের ডানদিকের ফোঁটা'],
    exampleWord: 'おかね (Okane)',
    exampleMeaningBn: 'টাকা / অর্থ'
  }
];

interface RecognitionQuestion {
  id: number;
  promptBn: string;
  targetChar: string;
  options: { char: string; label: string }[];
  audioChar?: string;
  explanationBn: string;
}

const RECOGNITION_QUESTIONS: RecognitionQuestion[] = [
  {
    id: 1,
    promptBn: "বাংলা 'আ' (a) উচ্চারণের সঠিক হিরাগানা কোনটি?",
    targetChar: 'あ',
    options: [
      { char: 'あ', label: 'あ (a)' },
      { char: 'い', label: 'い (i)' },
      { char: 'う', label: 'う (u)' },
      { char: 'お', label: 'お (o)' }
    ],
    explanationBn: "সঠিক! 'あ' হলো জাপানি বর্ণমালার প্রথম ও প্রধান স্বরবর্ণ।"
  },
  {
    id: 2,
    promptBn: "উচ্চারণটি শুনুন এবং সঠিক বর্ণ নির্বাচন করুন:",
    targetChar: 'い',
    audioChar: 'い',
    options: [
      { char: 'え', label: 'え (e)' },
      { char: 'い', label: 'い (i)' },
      { char: 'あ', label: 'あ (a)' },
      { char: 'お', label: 'お (o)' }
    ],
    explanationBn: "চমৎকার! আপনি 'い' (i / ই) নিখুঁতভাবে চিহ্নিত করেছেন।"
  },
  {
    id: 3,
    promptBn: "নিচের কোন বর্ণটির উচ্চারণ 'উ' (u)?",
    targetChar: 'う',
    options: [
      { char: 'お', label: 'お (o)' },
      { char: 'う', label: 'う (u)' },
      { char: 'え', label: 'え (e)' },
      { char: 'い', label: 'い (i)' }
    ],
    explanationBn: "দারুণ! 'う' হলো জাপানি ৩য় স্বরবর্ণ, বাংলায় 'উ'। "
  },
  {
    id: 4,
    promptBn: "অডিও শুনে বলুন কোন বর্ণ উচ্চারিত হয়েছে:",
    targetChar: 'え',
    audioChar: 'え',
    options: [
      { char: 'う', label: 'う (u)' },
      { char: 'お', label: 'お (o)' },
      { char: 'え', label: 'え (e)' },
      { char: 'あ', label: 'あ (a)' }
    ],
    explanationBn: "অসাধারণ! 'え' (e / এ) যেমন 'えき' (Eki - স্টেশন)।"
  },
  {
    id: 5,
    promptBn: "'お' (o) বর্ণের সঠিক ধ্বনি কোনটি?",
    targetChar: 'o',
    options: [
      { char: 'o', label: 'ও (o) যেমন おかね' },
      { char: 'a', label: 'আ (a) যেমন あさ' },
      { char: 'u', label: 'উ (u) যেমন うみ' },
      { char: 'i', label: 'ই (i) যেমন いぬ' }
    ],
    explanationBn: "১০০% নির্ভুল! 'お' উচ্চারিত হয় 'ও' (o) হিসেবে।"
  }
];

interface SynthesisWord {
  id: string;
  romaji: string;
  meaningBn: string;
  targetTiles: string[];
  options: string[];
}

const SYNTHESIS_WORDS: SynthesisWord[] = [
  {
    id: 'w1',
    romaji: 'Ai (あい)',
    meaningBn: 'ভালোবাসা (Love)',
    targetTiles: ['あ', 'い'],
    options: ['い', 'う', 'あ', 'え']
  },
  {
    id: 'w2',
    romaji: 'Ie (いえ)',
    meaningBn: 'বাড়ি / ঘর (House)',
    targetTiles: ['い', 'え'],
    options: ['え', 'あ', 'い', 'お']
  },
  {
    id: 'w3',
    romaji: 'Ao (あお)',
    meaningBn: 'নীল রঙ (Blue)',
    targetTiles: ['あ', 'お'],
    options: ['お', 'い', 'あ', 'う']
  },
  {
    id: 'w4',
    romaji: 'Ee (ええ)',
    meaningBn: 'হ্যাঁ (Yes / সম্মতি)',
    targetTiles: ['え', 'え'],
    options: ['え', 'お', 'い', 'あ']
  }
];

export const ZeroJapaneseGatewayModal: React.FC<ZeroJapaneseGatewayModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  // 4 Steps: 1: STROKE, 2: RECOGNITION, 3: SYNTHESIS, 4: UNLOCK
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Canvas Stroke State
  const [activeVowelIndex, setActiveVowelIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnStroke, setHasDrawnStroke] = useState(false);

  // Step 2: Recognition Test State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizAnswerStatus, setQuizAnswerStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);

  // Step 3: Word Synthesis State
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [assembledTiles, setAssembledTiles] = useState<string[]>([]);
  const [wordAssemblyStatus, setWordAssemblyStatus] = useState<'in_progress' | 'success'>('in_progress');

  // Active Vowel
  const activeVowel = FOUNDATIONAL_VOWELS[activeVowelIndex];
  const activeQuestion = RECOGNITION_QUESTIONS[currentQuestionIndex];
  const activeWord = SYNTHESIS_WORDS[currentWordIndex];

  // Initialize and clear canvas when active vowel changes
  useEffect(() => {
    if (currentStep === 1) {
      clearCanvas();
    }
  }, [activeVowelIndex, currentStep]);

  // Audio auto-play for recognition questions with audio prompt
  useEffect(() => {
    if (currentStep === 2 && activeQuestion?.audioChar) {
      const timer = setTimeout(() => {
        speakJapanese(activeQuestion.audioChar!);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep, currentQuestionIndex]);

  // Trigger confetti and update persistence when entering Step 4
  useEffect(() => {
    if (currentStep === 4) {
      triggerCelebrationConfetti();
      try {
        localStorage.setItem('nihomi_foundation_completed', 'true');
        localStorage.setItem('nihomi_badge_kana_pioneer', 'true');
        
        // Add 50 Nihomi Coins bonus
        const existingCoins = parseInt(localStorage.getItem('nihomi_student_coins') || '50', 10);
        localStorage.setItem('nihomi_student_coins', (existingCoins + 50).toString());

        // Dispatch storage event to sync badges across app
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('nihomi-foundation-unlocked'));
      } catch {}
    }
  }, [currentStep]);

  if (!isOpen) return null;

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawnStroke(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#EF4444';
    ctx.shadowColor = '#EF4444';
    ctx.shadowBlur = 4;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnStroke(false);
  };

  // Step 2: Answer Submission
  const handleSelectAnswer = (char: string) => {
    if (quizAnswerStatus !== 'idle') return;
    setSelectedAnswer(char);

    const isCorrect = char === activeQuestion.targetChar;
    if (isCorrect) {
      setQuizAnswerStatus('correct');
      setScore((s) => s + 1);
      speakJapanese(activeQuestion.targetChar);
    } else {
      setQuizAnswerStatus('wrong');
      speakJapanese(char);
    }

    setTimeout(() => {
      if (currentQuestionIndex < RECOGNITION_QUESTIONS.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setQuizAnswerStatus('idle');
      } else {
        // Proceed to Step 3
        setCurrentStep(3);
      }
    }, 1400);
  };

  // Step 3: Tile assembly
  const handleAddTile = (tile: string) => {
    if (assembledTiles.length >= activeWord.targetTiles.length) return;
    speakJapanese(tile);

    const updated = [...assembledTiles, tile];
    setAssembledTiles(updated);

    if (updated.length === activeWord.targetTiles.length) {
      const isMatch = updated.every((t, idx) => t === activeWord.targetTiles[idx]);
      if (isMatch) {
        setWordAssemblyStatus('success');
        speakJapanese(updated.join(''));
        setTimeout(() => {
          if (currentWordIndex < SYNTHESIS_WORDS.length - 1) {
            setCurrentWordIndex((i) => i + 1);
            setAssembledTiles([]);
            setWordAssemblyStatus('in_progress');
          } else {
            setCurrentStep(4);
          }
        }, 1200);
      } else {
        // Mismatch, reset after quick shake
        setTimeout(() => {
          setAssembledTiles([]);
        }, 800);
      }
    }
  };

  const handleLaunchLesson01 = () => {
    trackNihomiEvent('zero_gateway_completed', { score, action: 'launch_l1' });
    onComplete('lesson-01');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0d0d15] border border-stone-800 text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Header Bar */}
        <div className="relative px-6 py-4 border-b border-stone-800/80 bg-gradient-to-r from-red-950/30 via-stone-900/50 to-stone-900/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
                  STAGE 0: FOUNDATION JOURNEY
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-semibold">
                  হাতে-কলমে কানা ল্যাব
                </span>
              </div>
              <h2 className="text-sm font-semibold text-stone-200">
                {currentStep === 1 && 'ধাপ ১: স্ট্রোক রাইটিং ও উচ্চারণ প্র্যাকটিস'}
                {currentStep === 2 && 'ধাপ ২: দ্রুত রিকগনিশন ও লিসেনিং কুইজ'}
                {currentStep === 3 && 'ধাপ ৩: শব্দ গঠন ড্রিল (Word Synthesis)'}
                {currentStep === 4 && 'ধাপ ৪: লেভেল-আপ ও এন৫ আনলক'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800/60 hover:bg-stone-700/80 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="px-6 py-2.5 bg-stone-950 border-b border-stone-800/50 flex items-center justify-between text-xs font-semibold">
          {[
            { num: 1, label: 'স্ট্রোক অনুশীলন' },
            { num: 2, label: 'রিকগনিশন কুইজ' },
            { num: 3, label: 'শব্দ গঠন' },
            { num: 4, label: 'এন৫ আনলক' }
          ].map((s) => (
            <div key={s.num} className="flex items-center space-x-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === s.num
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                    : currentStep > s.num
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-stone-800 text-stone-500'
                }`}
              >
                {currentStep > s.num ? <Check className="w-3 h-3" /> : s.num}
              </div>
              <span
                className={`hidden sm:inline text-[11px] ${
                  currentStep === s.num ? 'text-red-300 font-bold' : currentStep > s.num ? 'text-stone-400' : 'text-stone-600'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Modal Body: Render Current Step */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-grow space-y-6">
          
          {/* ========================================================================= */}
          {/* STEP 1: INTERACTIVE STROKE WRITING & AUDIO */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Vowel Switcher Bar */}
              <div className="flex items-center justify-between bg-stone-900/80 p-1.5 rounded-2xl border border-stone-800">
                {FOUNDATIONAL_VOWELS.map((vowel, idx) => (
                  <button
                    key={vowel.char}
                    onClick={() => {
                      setActiveVowelIndex(idx);
                      speakJapanese(vowel.char);
                    }}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                      activeVowelIndex === idx
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                    }`}
                  >
                    <span className="text-base font-japanese leading-none">{vowel.char}</span>
                    <span className="text-[10px] font-mono opacity-80">{vowel.romaji} ({vowel.bn})</span>
                  </button>
                ))}
              </div>

              {/* Main Workspace: Canvas on left, Guides on right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                
                {/* Drawing Stage Container */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative w-[240px] h-[240px] rounded-2xl bg-[#141420] border-2 border-dashed border-stone-700 overflow-hidden shadow-inner flex items-center justify-center select-none">
                    
                    {/* Genkouyoushi Japanese Manuscript Crosshairs */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-full h-px bg-stone-800/80 border-b border-dashed border-stone-700/60"></div>
                    </div>
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="h-full w-px bg-stone-800/80 border-r border-dashed border-stone-700/60"></div>
                    </div>

                    {/* Faint Silhouette Guideline */}
                    <span className="absolute text-[160px] font-japanese font-black text-stone-800/40 select-none pointer-events-none leading-none">
                      {activeVowel.char}
                    </span>

                    {/* Drawing Canvas */}
                    <canvas
                      ref={canvasRef}
                      width={240}
                      height={240}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="absolute inset-0 cursor-crosshair touch-none"
                    />

                    {/* Stroke Helper Badge */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-mono text-stone-400">
                      {activeVowel.strokes} টি স্ট্রোক
                    </div>
                  </div>

                  {/* Canvas Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={clearCanvas}
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>মুছুন (Reset)</span>
                    </button>
                    <button
                      onClick={() => speakJapanese(activeVowel.char)}
                      className="px-3.5 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600/40 text-red-300 border border-red-500/40 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-red-400" />
                      <span>উচ্চারণ শুনুন</span>
                    </button>
                  </div>
                </div>

                {/* Right Instruction & Native Example Panel */}
                <div className="space-y-4 text-left">
                  <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2">
                    <div className="text-xs font-bold text-red-400 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>স্ট্রোকের দিকনির্দেশনা:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-stone-300">
                      {activeVowel.strokeDirections.map((dir, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-stone-500 font-mono">•</span>
                          <span>{dir}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Vocabulary Connection Card */}
                  <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                        প্রাত্যহিক জাপানি শব্দ
                      </span>
                      <div className="text-base font-bold text-white font-japanese mt-0.5">
                        {activeVowel.exampleWord}
                      </div>
                      <div className="text-xs text-stone-300">
                        অর্থ: <span className="text-red-300 font-semibold">{activeVowel.exampleMeaningBn}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => speakJapanese(activeVowel.exampleWord.split(' ')[0])}
                      className="p-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 transition-all cursor-pointer"
                      title="শব্দের অডিও শুনুন"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    পর্দায় ক্যানভাসে আঙুল বা মাউস দিয়ে বর্ণটি আঁকুন। ৫টি স্বরবর্ণ চিনে পরবর্তী কুইজে অংশ নিন।
                  </p>
                </div>

              </div>

              {/* Bottom Next Step Button */}
              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-red-600/25 transition-all cursor-pointer"
                >
                  <span>ধাপ ২: রিকগনিশন টেস্টে যান</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: RAPID-FIRE RECOGNITION TEST */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in text-left">
              
              {/* Question Header & Score */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="text-xs font-bold text-stone-400">
                  প্রশ্ন {currentQuestionIndex + 1} / {RECOGNITION_QUESTIONS.length}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  স্কোর: {score} পয়েন্ট
                </span>
              </div>

              {/* Question Prompt */}
              <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {activeQuestion.promptBn}
                </h3>

                {/* Audio Button if question includes sound prompt */}
                {activeQuestion.audioChar && (
                  <button
                    onClick={() => speakJapanese(activeQuestion.audioChar!)}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-500 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>পুনরায় অডিও শুনুন</span>
                  </button>
                )}
              </div>

              {/* Multiple Choice Options Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                {activeQuestion.options.map((opt) => {
                  const isChosen = selectedAnswer === opt.char;
                  const isTarget = opt.char === activeQuestion.targetChar;

                  let styleClass = 'bg-[#141420] border-stone-800 text-stone-200 hover:border-stone-700';
                  if (quizAnswerStatus !== 'idle') {
                    if (isTarget) {
                      styleClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20';
                    } else if (isChosen && !isTarget) {
                      styleClass = 'bg-rose-950/40 border-rose-500 text-rose-300';
                    }
                  }

                  return (
                    <button
                      key={opt.char}
                      disabled={quizAnswerStatus !== 'idle'}
                      onClick={() => handleSelectAnswer(opt.char)}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${styleClass}`}
                    >
                      <span className="text-xl font-japanese font-bold">{opt.label}</span>
                      {quizAnswerStatus !== 'idle' && isTarget && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Alert */}
              {quizAnswerStatus !== 'idle' && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-semibold ${
                    quizAnswerStatus === 'correct'
                      ? 'bg-emerald-950/30 border border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/30 border border-rose-500/40 text-rose-300'
                  }`}
                >
                  {quizAnswerStatus === 'correct' ? activeQuestion.explanationBn : 'ভুল উত্তর! সঠিক বিকল্পটি খেয়াল করুন।'}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: WORD SYNTHESIS DRILL */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in text-left">
              
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="text-xs font-bold text-stone-400">
                  শব্দ গঠন ড্রিল: {currentWordIndex + 1} / {SYNTHESIS_WORDS.length}
                </span>
                <span className="text-xs text-stone-400">টাইল ট্যাপ করে শব্দ তৈরি করুন</span>
              </div>

              {/* Target Meaning Banner */}
              <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 text-center space-y-2">
                <span className="text-xs uppercase font-bold text-red-400 tracking-wider">
                  টার্গেট শব্দ গঠন করুন
                </span>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {activeWord.meaningBn}
                </div>
                <div className="text-xs font-mono text-stone-400">
                  রোমাজি ইঙ্গিত: {activeWord.romaji}
                </div>
              </div>

              {/* Word Assembly Slots */}
              <div className="flex items-center justify-center space-x-3 py-4">
                {activeWord.targetTiles.map((_, idx) => {
                  const filledChar = assembledTiles[idx];
                  return (
                    <div
                      key={idx}
                      className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-japanese text-3xl font-bold transition-all ${
                        filledChar
                          ? wordAssemblyStatus === 'success'
                            ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 scale-105'
                            : 'bg-red-950/40 border-red-500 text-white'
                          : 'bg-[#141420] border-dashed border-stone-700 text-stone-600'
                      }`}
                    >
                      {filledChar || (idx + 1)}
                    </div>
                  );
                })}
              </div>

              {/* Kana Tile Options Tray */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-stone-400">
                  নিচের টাইলগুলো থেকে বেছে নিন:
                </span>
                <div className="flex items-center justify-center gap-3">
                  {activeWord.options.map((char, i) => (
                    <button
                      key={i}
                      onClick={() => handleAddTile(char)}
                      className="w-14 h-14 rounded-2xl bg-stone-800 hover:bg-stone-700 active:scale-95 text-white font-japanese text-2xl font-bold border border-stone-700 shadow-md transition-all flex items-center justify-center cursor-pointer"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Success Feedback */}
              {wordAssemblyStatus === 'success' && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center text-xs font-bold text-emerald-300 animate-in zoom-in-95">
                  ✓ চমৎকার! &quot;{activeWord.romaji}&quot; সফলভাবে গঠিত হয়েছে!
                </div>
              )}

              {/* Reset Tiles Button */}
              {assembledTiles.length > 0 && wordAssemblyStatus !== 'success' && (
                <div className="text-center">
                  <button
                    onClick={() => setAssembledTiles([])}
                    className="text-xs text-stone-400 hover:text-stone-200 underline cursor-pointer"
                  >
                    টাইল মুছুন (Clear Tiles)
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: AUTOMATIC LEVEL-UP & N5 UNLOCK CELEBRATION */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in zoom-in-95 text-center py-4">
              
              {/* Glowing Medal / Hanabi Trophy Icon */}
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl animate-pulse"></div>
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full bg-[#0d0d15] rounded-[22px] flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Congratulations Text */}
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  🎉 স্টেজ ০: ভিত্তি পর্যায় সম্পন্ন!
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  অভিনন্দন! আপনি জাপানি স্বরবর্ণ আয়ত্ত করেছেন
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                  আপনার নিহোমি অ্যাকাউন্টে প্রাথমিক ভিত্তি প্রোফাইল তৈরি হয়েছে এবং কানজি/গ্রামারের প্রথম আনুষ্ঠানিক পাঠ উন্মুক্ত হয়েছে।
                </p>
              </div>

              {/* Milestone Unlocks Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left">
                <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Kana Pioneer ব্যাজ</div>
                    <div className="text-[11px] text-stone-400">অর্জিত ও প্রোফাইলে যুক্ত</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">+50 নিহোমি কয়েন</div>
                    <div className="text-[11px] text-stone-400">ওয়ালেটে জমা হয়েছে</div>
                  </div>
                </div>
              </div>

              {/* Unlocked Lesson 1 Teaser */}
              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/40 max-w-md mx-auto text-left flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold font-japanese shrink-0">
                    第1課
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                      পরবর্তী ধাপ আনলকড
                    </span>
                    <h4 className="text-xs font-bold text-white">
                      Minna no Nihongo Lesson 01: Self-Introduction
                    </h4>
                    <p className="text-[10px] text-stone-300 font-japanese">
                      ~は ~です (আমি অমুক, পরিচয় প্রদান)
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              </div>

              {/* Primary Launch Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleLaunchLesson01}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl shadow-red-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>লেসন ০১ শুরু করুন (Launch Lesson 01)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
