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
  ChevronLeft
} from 'lucide-react';
import { speakJapanese, stopJapaneseSpeech } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';
import { getKanaStrokeSequence, KanaVectorStroke } from '../../data/kanaStrokePaths';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';

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
    practiceCoaching: "এবার আঙুল বা মাউস দিয়ে ওপর থেকে নিচে একটা সোজা দাগ টানো, তারপর পেটটা গোল করে দাও। খাতায় একবার লিখে দেখো! ভুল হলে কোনো সমস্যা নেই, আবার মুছে চেষ্টা করো!",
    feedbackPraise: "সাবাশ! চমৎকার হয়েছে!",
    realLifeWord: {
      ja: 'あい',
      romaji: 'Ai',
      meaningBn: 'ভালোবাসা'
    },
    realLifeQuote: "জাপানি ভাষায় 'Ai' (あい) মানে ভালোবাসা! দুটি খাঁটি স্বরবর্ণ 'あ' এবং 'い' মিলেই তৈরি হয়ে যায় চমৎকার এই অর্থপূর্ণ শব্দটি।"
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
      ja: 'いえ',
      romaji: 'Ie',
      meaningBn: 'বাড়ি / ঘর'
    },
    realLifeQuote: "জাপানি ভাষায় 'Ie' (いえ) মানে বাড়ি। কিংবা 'Ii' (いい) মানে ভালো। দুটি শব্দই খাঁটি স্বরবর্ণ দিয়ে গঠিত!"
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
      ja: 'うえ',
      romaji: 'Ue',
      meaningBn: 'উপরে / শীর্ষ'
    },
    realLifeQuote: "জাপানি ভাষায় 'Ue' (うえ) মানে উপরে বা শীর্ষ। 'উ' আর 'এ' মিলেই কোনো ব্যঞ্জনবর্ণ ছাড়া তৈরি এই শব্দ!"
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
      ja: 'え',
      romaji: 'E',
      meaningBn: 'ছবি / চিত্র'
    },
    realLifeQuote: "জাপানি ভাষায় 'E' (え) সরাসরি একটি একক বর্ণ যা একটি পূর্ণাঙ্গ শব্দ—যার অর্থ 'ছবি' বা পেইন্টিং!"
  },
  {
    char: 'お',
    romaji: 'o',
    soundBn: 'ও',
    strokeCount: 3,
    listenPrompt: "ভালো করে শোনো: 'ও' (お)।",
    watchPrompt: "সোজা ডানে দাগ, নিচে নেমে গোল লুপ ঘুরে ডানে বড় বাঁক, আর ওপরে একটা ফোঁটা।",
    practiceCoaching: "সোজা ডানে একটা দাগ টানো, তারপর নিচে নেমে গোল করে ডানে ঘুরিয়ে দাও। সবশেষে ওপরে ছোট্ট একটা ফোঁটা দাও। চেষ্টা করো!",
    feedbackPraise: "সাবাশ! তুমি করে দেখিয়েছো!",
    realLifeWord: {
      ja: 'おおい',
      romaji: 'Ooi',
      meaningBn: 'অনেক / প্রচুর'
    },
    realLifeQuote: "জাপানি ভাষায় 'Ooi' (おおい) মানে অনেক বা প্রচুর। 'অ' এবং 'ই' খাঁটি স্বরবর্ণের সমন্বয়ে তৈরি প্রতিদিনের শব্দ!"
  }
];

interface Point {
  x: number;
  y: number;
}

export interface ZenLearningCanvasProps {
  onBack?: () => void;
  onNextLesson?: () => void;
  className?: string;
}

export const ZenLearningCanvas: React.FC<ZenLearningCanvasProps> = ({
  onBack,
  onNextLesson,
  className = ''
}) => {
  const { user, refreshProgress } = useAuth();

  // Load persisted vowel index from localStorage if exists
  const [currentVowelIndex, setCurrentVowelIndex] = useState<number>(() => {
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
        } catch {}
      }

      // Check if this was the last vowel 'お'
      if (currentVowelIndex >= HIRAGANA_VOWELS.length - 1) {
        setIsMilestoneReached(true);
        soundEffects.playLessonCelebration();
        triggerCelebrationConfetti();
        markLessonComplete();
      } else {
        // Continuous flow: advance to next character instantly without page reload!
        setCurrentVowelIndex((prev) => prev + 1);
      }
    }
  };

  // Milestone Complete Card
  if (isMilestoneReached) {
    return (
      <div className={`w-full max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl bg-[#131926] border border-emerald-500/40 text-center shadow-2xl space-y-6 ${className}`}>
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
          <Award className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>মিশন ০১ সম্পন্ন • +৫০ XP অর্জিত</span>
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

        {/* 5 Vowel Step Indicator Beads */}
        <div className="flex items-center gap-1.5 shrink-0">
          {HIRAGANA_VOWELS.map((v, idx) => {
            const isCurrent = idx === currentVowelIndex;
            const isDone = completedVowels.includes(v.char) || idx < currentVowelIndex;

            return (
              <button
                key={v.char}
                onClick={() => setCurrentVowelIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition cursor-pointer font-japanese ${
                  isCurrent
                    ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400/40'
                    : isDone
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
                title={`${v.soundBn} (${v.char})`}
              >
                {isDone && !isCurrent ? <Check className="w-3.5 h-3.5" /> : v.char}
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
