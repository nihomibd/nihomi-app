// src/components/learning/ZenLearningCanvas.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Check,
  Award,
  ChevronLeft,
  HelpCircle,
  X
} from 'lucide-react';
import { speakJapanese, stopJapaneseSpeech } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';
import { getKanaStrokeSequence, KanaVectorStroke } from '../../data/kanaStrokePaths';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { diagnoseMistake, MistakeDiagnostic } from '../../core/curriculum/mistakeRecoveryEngine';
import { loadLearnerKnowledgeState, saveLearnerKnowledgeState, addLearnedKana, addLearnedVocabulary, recordLearnerMistake, resolveLearnerMistake } from '../../core/curriculum/learnerKnowledgeState';

export type MicroStep = 'listen' | 'watch' | 'practice' | 'use';

export interface VowelData {
  char: string;
  romaji: string;
  soundBn: string;
  strokeCount: number;
  listenPrompt: string;
  watchPrompt: string;
  practiceCoaching: string;
  feedbackPraise: string;
  realLifeWord: {
    ja: string;
    romaji: string;
    meaningBn: string;
  };
  realLifeQuote: string;
}

export const HIRAGANA_VOWELS: VowelData[] = [
  {
    char: 'あ',
    romaji: 'a',
    soundBn: 'আ',
    strokeCount: 3,
    listenPrompt: "প্রথমে কান দিয়ে শোনো: 'আ' (あ)।",
    watchPrompt: "দেখো কীভাবে জাপানিরা ৩টি টানে 'আ' লিখে—উপর থেকে নিচে সোজা দাগ, আর পেট গোল!",
    practiceCoaching: "এবার আঙুল বা মাউস দিয়ে ওপর থেকে নিচে একটা সোজা দাগ টানো, তারপর পেটটা গোল করে দাও। ভুল হলে কোনো সমস্যা নেই, আবার মুছে চেষ্টা করো!",
    feedbackPraise: "সাবাশ! চমৎকার হয়েছে!",
    realLifeWord: {
      ja: 'あ',
      romaji: 'a',
      meaningBn: 'মৌলিক স্বরবর্ণ'
    },
    realLifeQuote: "জাপানি বর্ণমালার সর্বপ্রথম ও ভিত্তিমূল স্বরবর্ণ হলো 'あ' (আ)। এখনো কোনো দ্বিতীয় বর্ণ শেখা হয়নি, তাই কোনো মিশ্র শব্দ নয়—শুধু 'あ' ধ্বনিটি স্পষ্ট মুক্ত কণ্ঠে আত্মস্থ করো!"
  },
  {
    char: 'い',
    romaji: 'i',
    soundBn: 'ই',
    strokeCount: 2,
    listenPrompt: "মনোযোগ দিয়ে শোনো: 'ই' (い)।",
    watchPrompt: "বামে একটু লম্বা দাগ দিয়ে শেষে ছোট্ট হুক, আর ডানে ছোট সমান্তরাল দাগ।",
    practiceCoaching: "খুব সহজ! বামের দাগটা একটু বাঁকিয়ে নিচে নামিয়ে ওপরে তোলো, আর ডানে ছোট একটা দাগ দাও। চেষ্টা করে দেখো!",
    feedbackPraise: "দারুণ! একেবারে পারফেক্ট!",
    realLifeWord: {
      ja: 'あい',
      romaji: 'Ai',
      meaningBn: 'ভালোবাসা (Love)'
    },
    realLifeQuote: "প্রথম শব্দ আনলক! আগে শেখা 'あ' আর নতুন 'い' যুক্ত হয়ে তৈরি হলো তোমার জীবনের প্রথম সম্পূর্ণ জাপানি শব্দ: 'あい' (Ai - ভালোবাসা)! কোনো অপরিচিত ব্যঞ্জনবর্ণ ছাড়া খাঁটি স্বরবর্ণের মিলন!"
  },
  {
    char: 'う',
    romaji: 'u',
    soundBn: 'উ',
    strokeCount: 2,
    listenPrompt: "মন দিয়ে শোনো: 'উ' (う)।",
    watchPrompt: "উপরে ছোট্ট একটা ফোঁটা, আর নিচে বড় একটা ধনুকের মতো বাঁক।",
    practiceCoaching: "প্রথমে মাথায় ছোট একটা টান দাও, তারপর নিচে চাঁদের মতো গোল করে নামিয়ে দাও। একদম ইজি!",
    feedbackPraise: "অসাধারণ! দারুণ হাত ঘুরেছে!",
    realLifeWord: {
      ja: 'いう',
      romaji: 'Iu',
      meaningBn: 'বলা (To say)'
    },
    realLifeQuote: "নতুন শব্দ আনলক! আগে শেখা 'い' আর নতুন 'う' যুক্ত হয়ে তৈরি হলো দৈনন্দিন অত্যন্ত প্রয়োজনীয় শব্দ: 'いう' (Iu - বলা)। এছাড়াও 'あう' (Au - দেখা করা / মেলা)-ও তুমি পড়তে পারো!"
  },
  {
    char: 'え',
    romaji: 'e',
    soundBn: 'এ',
    strokeCount: 2,
    listenPrompt: "স্পষ্ট করে শোনো: 'এ' (え)।",
    watchPrompt: "উপরে ছোট টান, তারপর ইংরেজি 'Z' এর মতো এঁকে নিচে ঢেউ খেলানো।",
    practiceCoaching: "উপরে ছোট্ট একটা টান দিয়ে নিচে ইংরেজি 'Z' অক্ষরের মতো যাও, শেষে নিচে সুন্দর একটা ঢেউ খেলিয়ে দাও। তুমি পারবে!",
    feedbackPraise: "চমৎকার! দারুণ এগিয়ে যাচ্ছো!",
    realLifeWord: {
      ja: 'いえ',
      romaji: 'Ie',
      meaningBn: 'বাড়ি / ঘর (House)'
    },
    realLifeQuote: "আগে শেখা 'い' এবং নতুন 'え' যুক্ত হয়ে তৈরি হলো 'いえ' (Ie - বাড়ি)! এছাড়া আগে শেখা 'う' ও 'え' মিলে তৈরি 'うえ' (Ue - উপরে) শব্দটিও এখন তোমার চেনা!"
  },
  {
    char: 'お',
    romaji: 'o',
    soundBn: 'ও',
    strokeCount: 3,
    listenPrompt: "ভালো করে শোনো: 'ও' (お)।",
    watchPrompt: "সোজা ডানে দাগ, নিচে নেমে গোল লুপ ঘুরে ডানে বড় বাঁক, আর ওপরে একটা ফোঁটা।",
    practiceCoaching: "সোজা ডানে একটা দাগ টানো, তারপর নিচে নেমে গোল করে ডানে ঘুরিয়ে দাও। সবশেষে ওপরে ছোট্ট একটা ফোঁটা দাও। চেষ্টা করো!",
    feedbackPraise: "সাবাশ! তুমি ৫টি স্বরবর্ণই জয় করেছো!",
    realLifeWord: {
      ja: 'あお',
      romaji: 'Ao',
      meaningBn: 'নীল (Blue)'
    },
    realLifeQuote: "প্রথম শেখা 'あ' আর আজকের 'お' মিলে তৈরি হলো সুন্দর শব্দ 'あお' (Ao - নীল)! এছাড়াও 'おおい' (Ooi - অনেক / প্রচুর) শব্দটিও খাঁটি স্বরবর্ণ দিয়ে তৈরি!"
  }
];

export interface MilestoneQuizQuestion {
  id: number;
  questionBn: string;
  subPrompt: string;
  audioPromptJa?: string;
  options: {
    textJa: string;
    subText: string;
    isCorrect: boolean;
  }[];
  explanationBn: string;
}

export const MILESTONE_VOWEL_QUIZ: MilestoneQuizQuestion[] = [
  {
    id: 1,
    questionBn: "ধ্বনি ও বর্ণ যাচাই: নিচের কোনটি 'あ' (আ) বর্ণের সঠিক রূপ?",
    subPrompt: "প্রথম শেখা ভিত্তিমূল স্বরবর্ণটি শনাক্ত করো",
    audioPromptJa: "あ",
    options: [
      { textJa: "あ", subText: "a (আ)", isCorrect: true },
      { textJa: "い", subText: "i (ই)", isCorrect: false },
      { textJa: "う", subText: "u (উ)", isCorrect: false },
      { textJa: "お", subText: "o (ও)", isCorrect: false }
    ],
    explanationBn: "সঠিক! 'あ' হলো জাপানি বর্ণমালার সর্বপ্রথম ও সবচেয়ে মৌলিক স্বরবর্ণ।"
  },
  {
    id: 2,
    questionBn: "প্রথম শব্দ গঠন: 'あ' (আ) এবং 'い' (ই) মিলে কোন আসল জাপানি শব্দটি গঠিত হয়?",
    subPrompt: "কোনো ব্যঞ্জনবর্ণ ছাড়া খাঁটি স্বরবর্ণের প্রথম শব্দ",
    audioPromptJa: "あい",
    options: [
      { textJa: "あい", subText: "Ai • ভালোবাসা (Love)", isCorrect: true },
      { textJa: "いう", subText: "Iu • বলা (Say)", isCorrect: false },
      { textJa: "いえ", subText: "Ie • বাড়ি (House)", isCorrect: false },
      { textJa: "あお", subText: "Ao • নীল (Blue)", isCorrect: false }
    ],
    explanationBn: "চমৎকার! 'あ' + 'い' মিলে তৈরি হয় 'あい' (Ai), যার অর্থ ভালোবাসা!"
  },
  {
    id: 3,
    questionBn: "অর্থ যাচাই: 'いえ' (Ie) শব্দটির সঠিক বাংলা অর্থ কোনটি?",
    subPrompt: "স্বরবর্ণ 'い' এবং 'え' এর সমন্বয়ে তৈরি শব্দ",
    audioPromptJa: "いえ",
    options: [
      { textJa: "いえ", subText: "বাড়ি / ঘর (House)", isCorrect: true },
      { textJa: "あお", subText: "নীল (Blue)", isCorrect: false },
      { textJa: "うえ", subText: "উপরে (Up / Above)", isCorrect: false },
      { textJa: "いう", subText: "বলা (Say)", isCorrect: false }
    ],
    explanationBn: "অসাধারণ! 'いえ' (Ie) অর্থ বাড়ি বা ঘর।"
  },
  {
    id: 4,
    questionBn: "রং যাচাই: জাপানি ভাষায় 'নীল' (Blue) বোঝাতে কোন শব্দটি ব্যবহৃত হয়?",
    subPrompt: "স্বরবর্ণ 'あ' এবং 'お' দিয়ে গঠিত শব্দ",
    audioPromptJa: "あお",
    options: [
      { textJa: "あお", subText: "Ao • নীল (Blue)", isCorrect: true },
      { textJa: "うえ", subText: "Ue • উপরে (Above)", isCorrect: false },
      { textJa: "あい", subText: "Ai • ভালোবাসা (Love)", isCorrect: false },
      { textJa: "いう", subText: "Iu • বলা (To say)", isCorrect: false }
    ],
    explanationBn: "একদম ঠিক! 'あお' (Ao) মানে নীল রঙ।"
  },
  {
    id: 5,
    questionBn: "দিক ও অবস্থান: 'うえ' (Ue) শব্দটির সঠিক বাংলা অর্থ কী?",
    subPrompt: "স্বরবর্ণ 'う' এবং 'え' দিয়ে গঠিত শব্দ",
    audioPromptJa: "うえ",
    options: [
      { textJa: "うえ", subText: "উপরে / শীর্ষ (Up / Above)", isCorrect: true },
      { textJa: "あい", subText: "ভালোবাসা (Love)", isCorrect: false },
      { textJa: "いえ", subText: "বাড়ি (House)", isCorrect: false },
      { textJa: "あお", subText: "নীল (Blue)", isCorrect: false }
    ],
    explanationBn: "সাবাশ! 'うえ' (Ue) মানে উপরে বা শীর্ষভাগ।"
  }
];

interface Point {
  x: number;
  y: number;
}

export interface ZenLearningCanvasProps {
  initialChar?: string;
  onBack?: () => void;
  onNextLesson?: () => void;
  className?: string;
}

export const ZenLearningCanvas: React.FC<ZenLearningCanvasProps> = ({
  initialChar,
  onBack,
  onNextLesson,
  className = ''
}) => {
  const { user, refreshProgress } = useAuth();

  // Load vowel index from initialChar, URL ?char param, or localStorage
  const [currentVowelIndex, setCurrentVowelIndex] = useState<number>(() => {
    if (initialChar) {
      const idx = HIRAGANA_VOWELS.findIndex(v => v.char === initialChar);
      if (idx >= 0) return idx;
    }
    if (typeof window !== 'undefined') {
      const charParam = new URLSearchParams(window.location.search).get('char');
      if (charParam) {
        const idx = HIRAGANA_VOWELS.findIndex(v => v.char === charParam);
        if (idx >= 0) return idx;
      }
    }
    try {
      const saved = localStorage.getItem('nihomi_zen_vowel_index');
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (parsed >= 0 && parsed < HIRAGANA_VOWELS.length) return parsed;
      }
    } catch {}
    return 0; // Default to 'あ'
  });

  const [activeStep, setActiveStep] = useState<MicroStep>('listen');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [completedVowels, setCompletedVowels] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nihomi_completed_vowels');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [isMilestoneReached, setIsMilestoneReached] = useState<boolean>(false);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizIsAnswerSubmitted, setQuizIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizDiagnostic, setQuizDiagnostic] = useState<MistakeDiagnostic | null>(null);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const currentStrokeRef = useRef<Point[]>([]);
  const [drawnCount, setDrawnCount] = useState(0);
  const [hasCelebratedTrace, setHasCelebratedTrace] = useState(false);

  // Stroke animation state (WATCH mode)
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
  const [animStrokeIndex, setAnimStrokeIndex] = useState<number>(-1);
  const animTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const currentVowel = HIRAGANA_VOWELS[currentVowelIndex];
  const vectorStrokes: KanaVectorStroke[] = getKanaStrokeSequence(currentVowel.char, currentVowel.strokeCount);

  // Play audio on step change or vowel change
  const playCurrentCharAudio = useCallback(() => {
    setIsAudioPlaying(true);
    speakJapanese(currentVowel.char);
    setTimeout(() => {
      setIsAudioPlaying(false);
    }, 1200);
  }, [currentVowel.char]);

  // Handle switching vowel
  useEffect(() => {
    setStrokes([]);
    currentStrokeRef.current = [];
    setDrawnCount(0);
    setHasCelebratedTrace(false);
    setActiveStep('listen');
    stopAnimation();

    // Auto-play audio on entering new vowel
    const t = setTimeout(() => {
      playCurrentCharAudio();
    }, 300);

    // Save index
    try {
      localStorage.setItem('nihomi_zen_vowel_index', currentVowelIndex.toString());
    } catch {}

    return () => clearTimeout(t);
  }, [currentVowelIndex, playCurrentCharAudio]);

  // Clean up animation timers on unmount
  useEffect(() => {
    return () => {
      stopJapaneseSpeech();
      animTimeoutRef.current.forEach(clearTimeout);
    };
  }, []);

  // Stop running stroke animation
  const stopAnimation = () => {
    animTimeoutRef.current.forEach(clearTimeout);
    animTimeoutRef.current = [];
    setIsPlayingAnimation(false);
    setAnimStrokeIndex(-1);
  };

  // Play step-by-step stroke animation
  const handlePlayAnimation = () => {
    stopAnimation();
    setIsPlayingAnimation(true);
    soundEffects.playButtonTap();

    const total = vectorStrokes.length;
    vectorStrokes.forEach((_, idx) => {
      const t = setTimeout(() => {
        setAnimStrokeIndex(idx);
        if (idx === total - 1) {
          const endT = setTimeout(() => {
            setIsPlayingAnimation(false);
            setAnimStrokeIndex(-1);
          }, 1200);
          animTimeoutRef.current.push(endT);
        }
      }, idx * 1100);
      animTimeoutRef.current.push(t);
    });
  };

  // Draw background guidelines on Hosho paper canvas
  const drawBackground = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.clearRect(0, 0, size, size);

    // Subtle traditional calligraphy crosshair guidelines (dashed amber/gold)
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(size / 2, 10);
    ctx.lineTo(size / 2, size - 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(10, size / 2);
    ctx.lineTo(size - 10, size / 2);
    ctx.stroke();

    ctx.strokeRect(14, 14, size - 28, size - 28);
    ctx.restore();

    // Watermark Outline of character (15% opacity)
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.font = `900 ${Math.floor(size * 0.72)}px "Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentVowel.char, size / 2, size / 2 + size * 0.04);
    ctx.restore();
  };

  // Smooth calligraphy stroke rendering using Midpoint Quadratic Bezier curves
  const drawSmoothPath = (ctx: CanvasRenderingContext2D, points: Point[], color = '#E11D48', lineWidth = 9) => {
    if (points.length === 0) return;

    if (points.length === 1) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, lineWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = 'rgba(225, 29, 72, 0.5)';
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = 'rgba(225, 29, 72, 0.45)';
    ctx.shadowBlur = 5;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 1; i++) {
      const midX = (points[i].x + points[i + 1].x) / 2;
      const midY = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }

    const last = points[points.length - 1];
    const prev = points[points.length - 2];
    ctx.quadraticCurveTo(prev.x, prev.y, last.x, last.y);
    ctx.stroke();

    // Inner bright vermilion highlight for depth
    ctx.strokeStyle = '#fda4af';
    ctx.lineWidth = Math.max(lineWidth * 0.35, 2);
    ctx.shadowBlur = 0;
    ctx.stroke();

    ctx.restore();
  };

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    const size = canvas.width / dpr;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    drawBackground(ctx, size);

    // Draw existing strokes
    strokes.forEach((stroke) => {
      drawSmoothPath(ctx, stroke, '#E11D48', 9);
    });

    // Draw active stroke
    if (currentStrokeRef.current.length > 0) {
      drawSmoothPath(ctx, currentStrokeRef.current, '#E11D48', 9);
    }

    ctx.restore();
  }, [strokes, currentVowel.char]);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const size = Math.floor(Math.min(rect.width, 260));
    if (size <= 0) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 2);

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    redrawCanvas();
  }, [redrawCanvas]);

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, [setupCanvas]);

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    setIsDrawing(true);
    const pt = getCanvasCoords(e);
    currentStrokeRef.current = [pt];

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const dpr = Math.max(window.devicePixelRatio || 1, 2);
      if (ctx) {
        ctx.save();
        ctx.scale(dpr, dpr);
        drawSmoothPath(ctx, [pt], '#E11D48', 9);
        ctx.restore();
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pt = getCanvasCoords(e);
    currentStrokeRef.current.push(pt);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const dpr = Math.max(window.devicePixelRatio || 1, 2);
      if (ctx) {
        ctx.save();
        ctx.scale(dpr, dpr);
        drawSmoothPath(ctx, currentStrokeRef.current, '#E11D48', 9);
        ctx.restore();
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (currentStrokeRef.current.length > 1) {
      const newStrokes = [...strokes, currentStrokeRef.current];
      setStrokes(newStrokes);
      const nextCount = newStrokes.length;
      setDrawnCount(nextCount);
      soundEffects.playCorrectPing();

      if (nextCount >= currentVowel.strokeCount && !hasCelebratedTrace) {
        setHasCelebratedTrace(true);
        soundEffects.playLessonCelebration();
        triggerCelebrationConfetti();
      }
    }

    currentStrokeRef.current = [];
    redrawCanvas();
  };

  const handleClearCanvas = () => {
    setStrokes([]);
    currentStrokeRef.current = [];
    setDrawnCount(0);
    setHasCelebratedTrace(false);
    redrawCanvas();
  };

  // Sync completion to storage and Supabase
  const markLessonComplete = async () => {
    try {
      localStorage.setItem('nihomi_foundation_completed', 'true');
      localStorage.setItem('nihomi_mission_001_done', 'true');
      const kState = loadLearnerKnowledgeState();
      if (!kState.masteredSkills.includes('vowels_5_mastered')) {
        kState.masteredSkills.push('vowels_5_mastered');
      }
      if (!kState.masteredSkills.includes('5_vowels_gate')) {
        kState.masteredSkills.push('5_vowels_gate');
      }
      saveLearnerKnowledgeState(kState);

      const raw = localStorage.getItem('nihomi_completed_lessons');
      const currentCompleted: string[] = raw ? JSON.parse(raw) : [];
      if (!currentCompleted.includes('n5-l1')) {
        currentCompleted.push('n5-l1');
        localStorage.setItem('nihomi_completed_lessons', JSON.stringify(currentCompleted));
      }

      const prevXp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
      const nextXp = prevXp + 50;
      localStorage.setItem('nihomi_student_xp', nextXp.toString());

      window.dispatchEvent(
        new CustomEvent('nihomi:progress-updated', {
          detail: { type: 'lesson', lessonId: 'n5-l1', xp: 50, totalXp: nextXp }
        })
      );
      window.dispatchEvent(
        new CustomEvent('nihomi:lesson-completed', {
          detail: { lessonId: 'n5-l1', xp: 50, totalXp: nextXp }
        })
      );

      if (user?.id) {
        await apiRequest('/api/progress/complete-lesson', {
          method: 'POST',
          body: JSON.stringify({ lessonId: 'n5-l1', studyMinutes: 10 })
        }).catch(() => {});
        refreshProgress?.();
      }
    } catch (err) {
      console.warn('[ZenCanvas] Completion sync warning:', err);
    }
  };

  // ADVANCE IN THE 4-STEP PSYCHOLOGICAL LOOP:
  // Step 1: Listen -> Step 2: Watch -> Step 3: Practice -> Step 4: Use -> Next Vowel!
  const handlePrimaryAdvance = () => {
    soundEffects.playButtonTap();

    if (activeStep === 'listen') {
      setActiveStep('watch');
      handlePlayAnimation();
      return;
    }

    if (activeStep === 'watch') {
      stopAnimation();
      setActiveStep('practice');
      return;
    }

    if (activeStep === 'practice') {
      setActiveStep('use');
      speakJapanese(currentVowel.realLifeWord.ja);
      return;
    }

    if (activeStep === 'use') {
      // Record completed vowel
      if (!completedVowels.includes(currentVowel.char)) {
        const nextList = [...completedVowels, currentVowel.char];
        setCompletedVowels(nextList);
        try {
          localStorage.setItem('nihomi_completed_vowels', JSON.stringify(nextList));
          const kState = loadLearnerKnowledgeState();
          addLearnedKana(kState, currentVowel.char);
          if (currentVowel.char === 'い') {
            addLearnedVocabulary(kState, 'あい');
          } else if (currentVowel.char === 'う') {
            addLearnedVocabulary(kState, 'いう');
            addLearnedVocabulary(kState, 'あう');
          } else if (currentVowel.char === 'え') {
            addLearnedVocabulary(kState, 'いえ');
            addLearnedVocabulary(kState, 'うえ');
          } else if (currentVowel.char === 'お') {
            addLearnedVocabulary(kState, 'あお');
          }
        } catch {}
      }

      // Check if this was the last vowel 'お'
      if (currentVowelIndex >= HIRAGANA_VOWELS.length - 1) {
        // Trigger 5-Vowel Milestone Review Quiz before milestone completion
        setIsQuizActive(true);
        setQuizQuestionIndex(0);
        setQuizSelectedOption(null);
        setQuizIsAnswerSubmitted(false);
        setQuizScore(0);
        soundEffects.playButtonTap();
      } else {
        // Continuous flow: advance to next character instantly without page reload!
        setCurrentVowelIndex((prev) => prev + 1);
      }
    }
  };

  // =========================================================================
  // 5-VOWEL MILESTONE REVIEW QUIZ RENDERER
  // =========================================================================
  if (isQuizActive) {
    const currentQ = MILESTONE_VOWEL_QUIZ[quizQuestionIndex];
    const isLastQuestion = quizQuestionIndex === MILESTONE_VOWEL_QUIZ.length - 1;

    const handleSelectQuizOption = (optIdx: number) => {
      if (quizIsAnswerSubmitted) return;
      setQuizSelectedOption(optIdx);
      setQuizIsAnswerSubmitted(true);

      const selected = currentQ.options[optIdx];
      const isCorrect = selected.isCorrect;
      const correctOpt = currentQ.options.find(o => o.isCorrect);
      const targetText = correctOpt ? correctOpt.textJa : currentQ.audioPromptJa || '';
      const chosenText = selected.textJa;

      if (isCorrect) {
        setQuizScore((prev) => prev + 1);
        setQuizDiagnostic(null);
        soundEffects.playCorrectPing();
        try {
          const kState = loadLearnerKnowledgeState();
          resolveLearnerMistake(kState, targetText);
        } catch {}
      } else {
        soundEffects.playButtonTap();
        const diag = diagnoseMistake(targetText, chosenText, 'quiz');
        setQuizDiagnostic(diag);
        try {
          const kState = loadLearnerKnowledgeState();
          recordLearnerMistake(kState, targetText, diag.category, diag.diagnosisBn);
        } catch {}
      }
    };

    const handleAdvanceQuiz = () => {
      soundEffects.playButtonTap();
      if (isLastQuestion) {
        setIsQuizActive(false);
        setIsMilestoneReached(true);
        soundEffects.playLessonCelebration();
        triggerCelebrationConfetti();
        markLessonComplete();
      } else {
        setQuizQuestionIndex((prev) => prev + 1);
        setQuizSelectedOption(null);
        setQuizIsAnswerSubmitted(false);
        setQuizDiagnostic(null);
      }
    };

    return (
      <div className={`w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#131926] border border-amber-500/35 text-center shadow-2xl space-y-6 ${className}`}>
        {/* Quiz Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>৫-স্বরবর্ণ মাস্টার রিভিউ কুইজ</span>
          </div>

          <div className="text-xs font-mono font-bold text-slate-400">
            প্রশ্ন <span className="text-amber-400 text-sm font-black">{quizQuestionIndex + 1}</span> / {MILESTONE_VOWEL_QUIZ.length}
          </div>
        </div>

        {/* Question Prompt */}
        <div className="space-y-2 text-left">
          <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
            {currentQ.questionBn}
          </h2>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{currentQ.subPrompt}</span>
            {currentQ.audioPromptJa && (
              <button
                type="button"
                onClick={() => speakJapanese(currentQ.audioPromptJa!)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold flex items-center gap-1 border border-slate-700 cursor-pointer"
                title="উচ্চারণ শুনুন"
              >
                <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                <span>শুনুন</span>
              </button>
            )}
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {currentQ.options.map((opt, idx) => {
            const isSelected = quizSelectedOption === idx;
            let btnStyle = "bg-[#161D2B] border-slate-800 text-slate-200 hover:border-slate-700";

            if (quizIsAnswerSubmitted) {
              if (opt.isCorrect) {
                btnStyle = "bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/20";
              } else if (isSelected && !opt.isCorrect) {
                btnStyle = "bg-rose-950/70 border-rose-500 text-rose-200";
              } else {
                btnStyle = "bg-[#161D2B] border-slate-800 text-slate-400 opacity-60";
              }
            } else if (isSelected) {
              btnStyle = "bg-amber-500/15 border-amber-500 text-amber-200";
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuizOption(idx)}
                disabled={quizIsAnswerSubmitted}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${btnStyle} ${!quizIsAnswerSubmitted ? 'active:scale-98' : ''}`}
              >
                <div className="space-y-0.5">
                  <div className="font-japanese font-black text-2xl tracking-wide text-white">
                    {opt.textJa}
                  </div>
                  <div className="text-xs font-medium text-slate-300">
                    {opt.subText}
                  </div>
                </div>

                {quizIsAnswerSubmitted && (
                  <div>
                    {opt.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : isSelected ? (
                      <X className="w-5 h-5 text-rose-400 shrink-0" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Diagnostic Recovery Coaching Box if mistake was made */}
        {quizIsAnswerSubmitted && quizDiagnostic && (
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-left text-xs leading-relaxed text-slate-200 space-y-2.5 animate-in fade-in duration-200 shadow-lg shadow-amber-500/5">
            <div className="flex items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
              <div className="flex items-center gap-2 font-black text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>নিহোমি সেনসেই AI • ডায়াগনস্টিক কোচিং</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-300">
                {quizDiagnostic.category === 'visual_confusion' ? 'আকৃতিগত পার্থক্য' : 'অর্থ ও ধ্বনি সংযোগ'}
              </span>
            </div>
            
            <p className="text-slate-100 font-medium">{quizDiagnostic.diagnosisBn}</p>
            <p className="text-amber-200/90 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">{quizDiagnostic.recoveryPromptBn}</p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-slate-400 text-[11px]">{quizDiagnostic.recommendedNextStep}</span>
              {quizDiagnostic.audioReplayChar && (
                <button
                  type="button"
                  onClick={() => speakJapanese(quizDiagnostic.audioReplayChar!)}
                  className="px-3 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                >
                  <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>সঠিক উচ্চারণ শুনুন ({quizDiagnostic.audioReplayChar})</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Feedback explanation box after submission if correct */}
        {quizIsAnswerSubmitted && !quizDiagnostic && (
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs leading-relaxed text-slate-200 space-y-1 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>চমৎকার! সঠিক ব্যাখ্যা:</span>
            </div>
            <p>{currentQ.explanationBn}</p>
          </div>
        )}

        {/* Advance Button */}
        {quizIsAnswerSubmitted && (
          <div className="pt-2 animate-in fade-in duration-200">
            <button
              type="button"
              onClick={handleAdvanceQuiz}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{isLastQuestion ? 'ফলাফল দেখুন ও মিশন সম্পন্ন করুন →' : 'পরবর্তী প্রশ্ন →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Milestone Complete Card
  if (isMilestoneReached) {
    return (
      <div className={`w-full max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl bg-[#131926] border border-emerald-500/40 text-center shadow-2xl space-y-6 ${className}`}>
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
          <Award className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>মিশন ০১ সম্পন্ন • +৫০ XP অর্জিত</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>রিভিউ কুইজ স্কোর: {quizScore}/5</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            অভিনন্দন! তুমি জাপানিজ ভাষার প্রথম ৫টি মৌলিক স্বরবর্ণ শিখে ফেলেছো!
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            তুমি এখন 'あ', 'い', 'う', 'え', 'お' পড়তে, লিখতে এবং উচ্চারণ করতে পারো। তোমার প্রথম জাপানি শব্দ তৈরির যাত্রা শুরু হলো!
          </p>
        </div>

        {/* Mastered Vowels Showcase Pills */}
        <div className="flex items-center justify-center gap-3 py-3">
          {HIRAGANA_VOWELS.map((v) => (
            <button
              key={v.char}
              onClick={() => speakJapanese(v.char)}
              className="w-12 h-14 rounded-2xl bg-[#161D2B] border border-emerald-500/30 hover:border-emerald-400 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition shadow-md group"
              title={`${v.soundBn} শুনুন`}
            >
              <span className="font-japanese font-black text-lg text-white group-hover:text-emerald-400">
                {v.char}
              </span>
              <span className="text-[10px] text-emerald-300 font-bold">{v.soundBn}</span>
            </button>
          ))}
        </div>

        {/* Next Action Button */}
        <div className="pt-2 space-y-3">
          <button
            onClick={() => {
              if (onNextLesson) {
                onNextLesson();
              } else if (onBack) {
                onBack();
              }
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>পরবর্তী ধাপে যাই (লেসন ০২ / শব্দ গঠন) →</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-4 pt-1">
            <button
              onClick={() => {
                setIsMilestoneReached(false);
                setIsQuizActive(true);
                setQuizQuestionIndex(0);
                setQuizSelectedOption(null);
                setQuizIsAnswerSubmitted(false);
                setQuizScore(0);
              }}
              className="text-xs text-amber-300 hover:text-amber-200 font-bold transition cursor-pointer"
            >
              রিভিউ কুইজ আবার দিই 🎯
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => {
                setIsMilestoneReached(false);
                setCurrentVowelIndex(0);
              }}
              className="text-xs text-slate-400 hover:text-white font-medium transition cursor-pointer"
            >
              আবার 'あ' থেকে রিভিশন করি 🔄
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-3xl mx-auto space-y-6 ${className}`}>
      
      {/* ===================================================================== */}
      {/* TOP PROGRESS PILL: Minimalist indicator: হিরাগানা মিশন ০১ • স্বরবর্ণ [১/৫] • あ */}
      {/* ===================================================================== */}
      <div className="flex items-center justify-between gap-3 px-2">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>কোর্স</span>
          </button>
        )}

        {/* Minimalist Progress Pill */}
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131926] border border-slate-800 text-xs font-bold shadow-md">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <span className="text-slate-300 font-medium">হিরাগানা মিশন ০১ • স্বরবর্ণ</span>
            <span className="text-amber-400 font-mono font-black">[{currentVowelIndex + 1}/5]</span>
            <span className="text-slate-500">•</span>
            <span className="font-japanese text-sm font-black text-white">{currentVowel.char}</span>
          </div>
        </div>

        {/* 5 Vowel Step Indicator Beads (Strict Lattice: untaught vowels are locked & masked) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {HIRAGANA_VOWELS.map((v, idx) => {
            const isCurrent = idx === currentVowelIndex;
            const isDone = completedVowels.includes(v.char);
            const isLocked = !isCurrent && !isDone;

            return (
              <button
                key={v.char}
                disabled={isLocked}
                onClick={() => {
                  if (!isLocked) setCurrentVowelIndex(idx);
                }}
                className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition font-japanese ${
                  isCurrent
                    ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400/40 cursor-default'
                    : isDone
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 cursor-pointer hover:bg-emerald-900/60'
                    : 'bg-slate-900/60 text-slate-600 border border-slate-800/80 cursor-not-allowed opacity-50'
                }`}
                title={isLocked ? `ধাপ ${idx + 1} (লক করা)` : `${v.soundBn} (${v.char})`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : isCurrent ? v.char : '•'}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ZEN LEARNING CANVAS (Washi paper textured card bg-[#131926])          */}
      {/* ===================================================================== */}
      <div className="rounded-3xl bg-[#131926] border border-slate-800/90 p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl space-y-6">
        
        {/* Subtle Japanese Washi textured decorative seal */}
        <div className="absolute top-4 right-4 pointer-events-none select-none opacity-40">
          <div className="w-8 h-8 rounded-lg bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-[10px] font-japanese font-black text-rose-300">
            和
          </div>
        </div>

        {/* 4-Step Flow State Loop Navigation */}
        <div className="grid grid-cols-4 gap-2 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveStep('listen')}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeStep === 'listen'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🔊 শোনো</span>
          </button>

          <button
            onClick={() => {
              setActiveStep('watch');
              handlePlayAnimation();
            }}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeStep === 'watch'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>👁️ দেখো</span>
          </button>

          <button
            onClick={() => {
              stopAnimation();
              setActiveStep('practice');
            }}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeStep === 'practice'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>✍️ লেখো</span>
          </button>

          <button
            onClick={() => setActiveStep('use')}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeStep === 'use'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💡 প্রয়োগ</span>
          </button>
        </div>

        {/* Dynamic Micro-Step Viewport */}
        <div className="min-h-[300px] flex flex-col justify-center">

          {/* ----------------------------------------------------------------- */}
          {/* STEP 1: শোনো (LISTEN)                                             */}
          {/* ----------------------------------------------------------------- */}
          {activeStep === 'listen' && (
            <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Massive Center Character with Ripple */}
              <div className="relative inline-flex items-center justify-center">
                {isAudioPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="w-28 h-28 rounded-full border-2 border-rose-500/80 animate-ping" />
                    <span className="w-36 h-36 rounded-full border border-amber-400/50 animate-pulse" />
                  </div>
                )}
                <div className="w-32 h-32 rounded-3xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-xl">
                  <span className="font-japanese font-black text-7xl text-white select-none drop-shadow-lg">
                    {currentVowel.char}
                  </span>
                </div>
              </div>

              {/* Pronunciation & Romaji Sound */}
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-xl text-amber-400 font-black">{currentVowel.romaji}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xl text-white font-bold">{currentVowel.soundBn}</span>
                </div>
                <p className="text-sm sm:text-base text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
                  {currentVowel.listenPrompt}
                </p>
              </div>

              {/* Sound Playback Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={playCurrentCharAudio}
                  className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-white text-xs font-bold border border-slate-700 transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                  <Volume2 className="w-4 h-4 text-rose-400" />
                  <span>উচ্চারণ আবার শুনুন</span>
                </button>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* STEP 2: দেখো (WATCH - SVG STROKE ORDER ANIMATION)                 */}
          {/* ----------------------------------------------------------------- */}
          {activeStep === 'watch' && (
            <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Stroke Order Display Box */}
              <div className="relative mx-auto w-48 h-48 rounded-3xl bg-slate-900 border-2 border-amber-500/40 flex items-center justify-center shadow-xl overflow-hidden p-4">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {vectorStrokes.map((s, idx) => {
                    const isActive = animStrokeIndex === idx;
                    const isPast = animStrokeIndex > idx;
                    const strokeColor = isActive ? '#fbbf24' : isPast ? '#E11D48' : 'rgba(255, 255, 255, 0.18)';
                    const strokeWidth = isActive ? 8 : isPast ? 7 : 4;

                    return (
                      <g key={s.strokeNumber}>
                        <path
                          d={s.path}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={isActive ? 'animate-pulse' : ''}
                        />
                        <circle
                          cx={s.startPoint.x}
                          cy={s.startPoint.y}
                          r={isActive ? 6 : 4}
                          fill={isActive ? '#fbbf24' : '#ef4444'}
                        />
                        <text
                          x={s.startPoint.x}
                          y={s.startPoint.y - 6}
                          fill="#ffffff"
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {s.strokeNumber}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Stroke progress label */}
                <div className="absolute bottom-2 right-3 text-[10px] font-mono text-amber-300 font-bold">
                  {animStrokeIndex >= 0 ? `টান ${animStrokeIndex + 1}/${vectorStrokes.length}` : `${vectorStrokes.length}টি টান`}
                </div>
              </div>

              {/* Coaching Copy */}
              <div className="space-y-2 max-w-md mx-auto">
                <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                  {currentVowel.watchPrompt}
                </p>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handlePlayAnimation}
                    className="px-5 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isPlayingAnimation ? 'দেখাচ্ছি...' : 'অ্যানিমেশন আবার দেখুন'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* STEP 3: লেখো (PRACTICE - INTERACTIVE CANVAS TRACE)                */}
          {/* ----------------------------------------------------------------- */}
          {activeStep === 'practice' && (
            <div className="space-y-4 py-2 animate-in fade-in duration-200">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
                <div className="text-left">
                  <div className="text-xs font-bold text-emerald-400">
                    টান সম্পন্ন: <span className="text-white font-mono">{drawnCount}</span> / {currentVowel.strokeCount}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    জলছাপের ওপর মাউস বা আঙুল ঘুরিয়ে আঁকো
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClearCanvas}
                  disabled={strokes.length === 0}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>মুছে আবার লিখো</span>
                </button>
              </div>

              {/* Japanese Hosho Paper Drawing Box */}
              <div className="relative mx-auto w-full max-w-[280px]">
                <div
                  ref={containerRef}
                  className="relative mx-auto rounded-3xl bg-slate-900 border-2 border-amber-500/30 shadow-2xl overflow-hidden flex items-center justify-center p-2"
                  style={{ width: '100%', height: '260px' }}
                >
                  <canvas
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    style={{ touchAction: 'none' }}
                    className="touch-none select-none cursor-crosshair rounded-2xl"
                  />
                </div>
              </div>

              {/* Coaching & Praise Banner */}
              <div className="text-center max-w-md mx-auto">
                {hasCelebratedTrace ? (
                  <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 shadow-lg animate-in fade-in">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-bounce" />
                    <span>{currentVowel.feedbackPraise}</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {currentVowel.practiceCoaching}
                  </p>
                )}
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* STEP 4: প্রয়োগ (USE - REAL LIFE CONNECTION)                       */}
          {/* ----------------------------------------------------------------- */}
          {activeStep === 'use' && (
            <div className="space-y-5 py-4 text-left max-w-lg mx-auto animate-in zoom-in-95 duration-200">
              
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">বাস্তব শব্দ সংযোগ</span>
                  <button
                    type="button"
                    onClick={() => speakJapanese(currentVowel.realLifeWord.ja)}
                    className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>শব্দটি শুনুন</span>
                  </button>
                </div>

                {/* Word display */}
                <div className="flex items-baseline gap-3 py-1">
                  <span className="font-japanese font-black text-4xl sm:text-5xl text-white tracking-wide">
                    {currentVowel.realLifeWord.ja}
                  </span>
                  <span className="font-mono text-sm text-slate-400 font-bold">
                    {currentVowel.realLifeWord.romaji}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-black text-lg">
                    {currentVowel.realLifeWord.meaningBn}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {currentVowel.realLifeQuote}
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>অক্ষরটি শেখা সফল হয়েছে! এখন পরের ধাপে যাওয়ার জন্য প্রস্তুত।</span>
              </div>

            </div>
          )}

        </div>

        {/* ===================================================================== */}
        {/* EXACTLY ONE PRIMARY BUTTON AT THE BOTTOM: "হয়ে গেছে! পরের ধাপে যাই →" */}
        {/* ===================================================================== */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            id="btn-zen-next-step"
            type="button"
            onClick={handlePrimaryAdvance}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
          >
            <span>হয়ে গেছে! পরের ধাপে যাই →</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

    </div>
  );
};
export default ZenLearningCanvas;
