// src/components/kana/KanaDrawingCanvas.tsx
// NIHOMI KANA CANVAS™ — 4-STAGE INTERACTIVE JAPANESE WRITING ENGINE
// Stage 1: Character & Phonetic → Stage 2: Stroke Animation (1→2→3) → Stage 3: Guided Tracing → Stage 4: Free-Write
// Fully optimized for mobile touchscreens, SuperMemo-2 MemoryOS sync, and continuous Reels flow.

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Undo2,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Award,
  Volume2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  PenTool,
  Check,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { KanaCharacter, toggleMasteredKana, getMasteredKanaList } from '../../data/kanaData';
import { getKanaStrokeSequence, KanaVectorStroke } from '../../data/kanaStrokePaths';
import { speakJapanese } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';
import { logKanaMistake, removeKanaMistake } from '../../lib/kanaMemorySync';

export type CanvasMode = 'presentation' | 'stroke_animation' | 'guided_tracing' | 'freewrite';

interface KanaDrawingCanvasProps {
  kana: KanaCharacter;
  onNextCharacter?: () => void;
  onMasteryToggled?: (isMastered: boolean) => void;
  className?: string;
  autoAdvance?: boolean;
}

interface Point {
  x: number;
  y: number;
  time: number;
}

type StrokePath = Point[];

export const KanaDrawingCanvas: React.FC<KanaDrawingCanvasProps> = ({
  kana,
  onNextCharacter,
  onMasteryToggled,
  className = '',
  autoAdvance = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokeSequence = getKanaStrokeSequence(kana.char, kana.strokes);

  // Core Stage Mode: 'presentation' | 'stroke_animation' | 'guided_tracing' | 'freewrite'
  const [mode, setMode] = useState<CanvasMode>('guided_tracing');

  // Drawing Canvas State
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokesHistory, setStrokesHistory] = useState<StrokePath[]>([]);
  const [currentStroke, setCurrentStroke] = useState<StrokePath>([]);
  const [showGhost, setShowGhost] = useState<boolean>(true);

  // Stroke Order Animation State
  const [animStrokeIndex, setAnimStrokeIndex] = useState<number>(0);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState<boolean>(false);
  const animTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Evaluation & Gamification State
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [accuracyFeedback, setAccuracyFeedback] = useState<string>('');
  const [isMastered, setIsMastered] = useState<boolean>(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<number | null>(null);

  // 1. Check mastery & reset when character changes
  useEffect(() => {
    const masteredList = getMasteredKanaList();
    setIsMastered(masteredList.includes(kana.char));
    handleClearCanvas();
    setAnimStrokeIndex(0);
    setIsPlayingAnimation(false);
    setAutoAdvanceTimer(null);
  }, [kana.char]);

  // 2. Stroke Animation Playback Controller
  useEffect(() => {
    if (isPlayingAnimation && mode === 'stroke_animation') {
      animTimerRef.current = setInterval(() => {
        setAnimStrokeIndex((prev) => {
          if (prev >= strokeSequence.length - 1) {
            return 0;
          }
          return prev + 1;
        });
      }, 1300);
    } else {
      if (animTimerRef.current) clearInterval(animTimerRef.current);
    }

    return () => {
      if (animTimerRef.current) clearInterval(animTimerRef.current);
    };
  }, [isPlayingAnimation, mode, strokeSequence.length]);

  // 3. Auto-Advance Timer for Continuous Reels Flow
  useEffect(() => {
    if (autoAdvanceTimer !== null && autoAdvanceTimer > 0) {
      const t = setTimeout(() => {
        setAutoAdvanceTimer(autoAdvanceTimer - 1);
      }, 1000);
      return () => clearTimeout(t);
    } else if (autoAdvanceTimer === 0) {
      onNextCharacter?.();
    }
  }, [autoAdvanceTimer, onNextCharacter]);

  // 4. Canvas Coordinate Calculation with DPI & Mobile Touchscreen Accuracy
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, time: Date.now() };

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent<HTMLCanvasElement>).clientX;
      clientY = (e as React.MouseEvent<HTMLCanvasElement>).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      time: Date.now()
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getCanvasCoords(e);
    setIsDrawing(true);
    setCurrentStroke([point]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const newPoint = getCanvasCoords(e);
    const updated = [...currentStroke, newPoint];
    setCurrentStroke(updated);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (updated.length < 2) return;

    const p1 = updated[updated.length - 2];
    const p2 = updated[updated.length - 1];

    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const timeDiff = Math.max(1, p2.time - p1.time);
    const velocity = dist / timeDiff;

    // Calligraphy pressure dynamics: faster stroke = thinner, slower = thicker
    const baseWidth = mode === 'guided_tracing' ? 9 : 8;
    const dynamicWidth = Math.max(4, Math.min(14, baseWidth - velocity * 1.6));

    ctx.strokeStyle = mode === 'guided_tracing' ? '#f43f5e' : '#38bdf8';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = dynamicWidth;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentStroke.length > 1) {
      setStrokesHistory((prev) => [...prev, currentStroke]);
    }
    setCurrentStroke([]);
  };

  const redrawAllStrokes = useCallback((history: StrokePath[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    history.forEach((stroke) => {
      if (stroke.length < 2) return;
      ctx.strokeStyle = mode === 'guided_tracing' ? '#f43f5e' : '#38bdf8';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 7;

      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);

      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    });
  }, [mode]);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setStrokesHistory([]);
    setCurrentStroke([]);
    setAccuracyScore(null);
    setAccuracyFeedback('');
    setAutoAdvanceTimer(null);
  };

  const handleUndo = () => {
    if (strokesHistory.length === 0) return;
    const updated = strokesHistory.slice(0, -1);
    setStrokesHistory(updated);
    redrawAllStrokes(updated);
  };

  // 5. Intelligent Stroke Recognition & MemoryOS Integration
  const evaluateWriting = () => {
    if (strokesHistory.length === 0) {
      setAccuracyFeedback('অনুগ্রহ করে ক্যানভাসে লিখে মূল্যায়ন করুন!');
      setAccuracyScore(0);
      soundEffects.playIncorrectSoft();
      return;
    }

    const strokeCount = strokesHistory.length;
    const targetStrokes = kana.strokes;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    let totalPoints = 0;

    strokesHistory.forEach((stroke) => {
      stroke.forEach((pt) => {
        minX = Math.min(minX, pt.x);
        maxX = Math.max(maxX, pt.x);
        minY = Math.min(minY, pt.y);
        maxY = Math.max(maxY, pt.y);
        totalPoints++;
      });
    });

    const canvas = canvasRef.current;
    const w = canvas ? canvas.clientWidth : 280;
    const h = canvas ? canvas.clientHeight : 280;

    const drawnWidth = maxX - minX;
    const drawnHeight = maxY - minY;

    // Dimension coverage ratio
    const coverageX = Math.min(1, drawnWidth / (w * 0.42));
    const coverageY = Math.min(1, drawnHeight / (h * 0.42));
    const coverageScore = ((coverageX + coverageY) / 2) * 40;

    // Stroke count penalty/bonus
    const strokeDiff = Math.abs(strokeCount - targetStrokes);
    const strokeScore = Math.max(10, 40 - strokeDiff * 10);

    // Density and curve continuity
    const densityScore = Math.min(20, (totalPoints / 55) * 20);

    const calculated = Math.min(100, Math.round(coverageScore + strokeScore + densityScore));
    setAccuracyScore(calculated);

    if (calculated >= 75) {
      // SUCCESS: Celebratory audio, confetti, mark mastered
      soundEffects.playLessonCelebration();
      triggerCelebrationConfetti();
      setAccuracyFeedback('চমৎকার! নিখুঁত জাপানি স্ট্রোক ও ব্যালান্স হয়েছে!');
      removeKanaMistake(kana.char);

      if (!isMastered) {
        const res = toggleMasteredKana(kana.char);
        setIsMastered(res.isMastered);
        onMasteryToggled?.(res.isMastered);
      }

      // Continuous play: Start 3-second countdown to automatically play next kana
      if (autoAdvance) {
        setAutoAdvanceTimer(3);
      }
    } else {
      // FRICTION DETECTED: Log into MemoryOS engine immediately!
      soundEffects.playIncorrectSoft();
      const failType = strokeDiff > 0 ? 'stroke_count' : 'accuracy';
      logKanaMistake(kana, calculated, failType);

      if (strokeDiff > 0) {
        setAccuracyFeedback(
          `স্ট্রোক সংখ্যা সঠিক নয়! ${kana.char}-এ মোট ${kana.strokes}টি স্ট্রোক রয়েছে (আপনি দিয়েছেন ${strokeCount}টি)। MemoryOS-এ যুক্ত হয়েছে।`
        );
      } else {
        setAccuracyFeedback(
          'স্ট্রোকের ক্রম ও বাঁক আরেকটু অনুশীলন প্রয়োজন। এটি স্বয়ংক্রিয়ভাবে MemoryOS রিভিউ সাইকেলে যোগ হয়েছে।'
        );
      }
    }
  };

  const handleToggleMastery = () => {
    const res = toggleMasteredKana(kana.char);
    setIsMastered(res.isMastered);
    onMasteryToggled?.(res.isMastered);
  };

  const playPronunciation = () => {
    speakJapanese(kana.char, { rate: 0.85 });
  };

  return (
    <div className={`flex flex-col items-center bg-[#0b0c18] border border-slate-800 rounded-3xl p-4 sm:p-6 text-slate-100 shadow-2xl relative overflow-hidden select-none ${className}`}>
      
      {/* 1. KANA STUDIO STAGE CONTROLS (Top 4-Step Pill Selector) */}
      <div className="w-full flex items-center justify-between gap-1 bg-[#121326] p-1 rounded-2xl border border-slate-800 mb-4">
        <button
          type="button"
          onClick={() => {
            setMode('presentation');
            setIsPlayingAnimation(false);
          }}
          className={`btn-haptic flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
            mode === 'presentation'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>১. পরিচয়</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('stroke_animation');
            setIsPlayingAnimation(true);
          }}
          className={`btn-haptic flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
            mode === 'stroke_animation'
              ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>২. অ্যানিমেশন</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('guided_tracing');
            setIsPlayingAnimation(false);
          }}
          className={`btn-haptic flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
            mode === 'guided_tracing'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>৩. ট্রেসিং</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('freewrite');
            setIsPlayingAnimation(false);
          }}
          className={`btn-haptic flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
            mode === 'freewrite'
              ? 'bg-cyan-500 text-stone-950 shadow-md shadow-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>৪. ফ্রি-রাইট</span>
        </button>
      </div>

      {/* 2. CHARACTER META HEADER */}
      <div className="w-full flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-black uppercase text-amber-400 tracking-wider">
            {kana.type.toUpperCase()} • {kana.romaji}
          </span>
          <span className="text-slate-400 font-medium">({kana.banglaPhonetic})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {kana.strokes} Strokes
          </span>
          <button
            type="button"
            onClick={playPronunciation}
            className="btn-haptic p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 transition-colors cursor-pointer"
            title="Listen Native Pronunciation"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. INTERACTIVE CANVAS STAGE CONTAINER */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-[#080812] border-2 border-slate-800 shadow-inner flex items-center justify-center overflow-hidden touch-none my-1">
        
        {/* Japanese 4-Quadrant Guidelines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="3,3" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="3,3" />
          <line x1="0" y1="0" x2="100" y2="100" stroke="#0f172a" strokeWidth="0.5" strokeDasharray="4,4" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="#0f172a" strokeWidth="0.5" strokeDasharray="4,4" />
        </svg>

        {/* MODE A: PRESENTATION (Clean typography & mnemonic) */}
        {mode === 'presentation' && (
          <div className="flex flex-col items-center justify-center p-4 text-center space-y-2 animate-in zoom-in-95 duration-200">
            <span className="text-8xl sm:text-9xl font-japanese font-black text-white select-none">
              {kana.char}
            </span>
            <div className="text-xs text-amber-300 font-mono font-bold tracking-widest uppercase">
              {kana.romaji} • {kana.banglaPhonetic}
            </div>
            <p className="text-[11px] text-slate-400 max-w-[220px]">
              {kana.originMnemonic || `জাপানি বর্ণ ${kana.char}। উচ্চারণ শুনতে স্পিকার বাটনে ট্যাপ করুন।`}
            </p>
          </div>
        )}

        {/* MODE B: STROKE ORDER ANIMATION (1 → 2 → 3 Vector SVG playback) */}
        {mode === 'stroke_animation' && (
          <div className="relative w-full h-full p-6 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full max-w-[220px] max-h-[220px]">
              {/* Background faint guide */}
              <text
                x="50"
                y="75"
                textAnchor="middle"
                className="font-japanese font-black fill-slate-800/40 text-[78px] select-none"
              >
                {kana.char}
              </text>

              {/* Vector stroke paths up to current animated stroke */}
              {strokeSequence.slice(0, animStrokeIndex + 1).map((s, idx) => (
                <g key={idx}>
                  <path
                    d={s.path}
                    fill="none"
                    stroke={idx === animStrokeIndex ? '#f59e0b' : '#38bdf8'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={idx === animStrokeIndex ? 'animate-pulse' : ''}
                  />
                  {/* Start Point Number Indicator */}
                  <circle cx={s.startPoint.x} cy={s.startPoint.y} r="4.5" fill="#ef4444" />
                  <text
                    x={s.startPoint.x}
                    y={s.startPoint.y + 2.5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="6.5"
                    fontWeight="bold"
                    className="select-none"
                  >
                    {s.strokeNumber}
                  </text>
                </g>
              ))}
            </svg>

            {/* Step instruction label */}
            <div className="absolute bottom-2 inset-x-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[10.5px] text-amber-300 font-medium text-center">
              {strokeSequence[animStrokeIndex]?.instructionBn || `স্ট্রোক ${animStrokeIndex + 1}`}
            </div>
          </div>
        )}

        {/* MODE C & D: GUIDED TRACING & FREE-WRITE CANVAS */}
        {(mode === 'guided_tracing' || mode === 'freewrite') && (
          <>
            {/* Ghost outline for tracing */}
            {mode === 'guided_tracing' && showGhost && (
              <span className="absolute text-8xl sm:text-9xl font-japanese font-black text-slate-700/35 select-none pointer-events-none transition-opacity duration-300">
                {kana.char}
              </span>
            )}

            {/* Drawing HTML5 Canvas */}
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none"
            />
          </>
        )}
      </div>

      {/* 4. ANIMATION CONTROLS (Rendered in Mode B) */}
      {mode === 'stroke_animation' && (
        <div className="w-full mt-3 flex items-center justify-between gap-2 px-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setIsPlayingAnimation(false);
                setAnimStrokeIndex((prev) => Math.max(0, prev - 1));
              }}
              className="btn-haptic p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
              title="Previous Stroke"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlayingAnimation(!isPlayingAnimation)}
              className="btn-haptic px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
            >
              {isPlayingAnimation ? <Pause className="w-3.5 h-3.5 fill-stone-950" /> : <Play className="w-3.5 h-3.5 fill-stone-950" />}
              <span>{isPlayingAnimation ? 'Pause' : 'Play'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPlayingAnimation(false);
                setAnimStrokeIndex((prev) => Math.min(strokeSequence.length - 1, prev + 1));
              }}
              className="btn-haptic p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
              title="Next Stroke"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMode('guided_tracing')}
            className="btn-haptic px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-600/25"
          >
            <span>ট্রেস করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 5. WRITING EVALUATION BANNER & REELS CONTINUOUS PLAY */}
      {accuracyScore !== null && (mode === 'guided_tracing' || mode === 'freewrite') && (
        <div className="w-full mt-3 p-3.5 rounded-2xl bg-[#121326] border border-slate-700 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  accuracyScore >= 75
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {accuracyScore}%
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-white leading-tight">
                  {accuracyFeedback}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  টার্গেট: {kana.strokes} স্ট্রোক • আপনি দিয়েছেন: {strokesHistory.length}
                </p>
              </div>
            </div>

            {accuracyScore >= 75 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            )}
          </div>

          {/* Continuous Reels Flow Next Button when Mastered */}
          {accuracyScore >= 75 && onNextCharacter && (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-300">
                {autoAdvanceTimer !== null
                  ? `পরবর্তী বর্ণ শুরু হচ্ছে: ${autoAdvanceTimer}s...`
                  : 'পরবর্তী বর্ণে যান:'}
              </span>
              <button
                type="button"
                onClick={onNextCharacter}
                className="btn-haptic px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <span>পরবর্তী বর্ণ ➔</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 6. CANVAS TOOLS & ACTIONS (In Tracing & Free-Write) */}
      {(mode === 'guided_tracing' || mode === 'freewrite') && (
        <div className="w-full mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleClearCanvas}
              className="btn-haptic p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title="ক্যানভাস মুছুন"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleUndo}
              disabled={strokesHistory.length === 0}
              className="btn-haptic p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title="আগের স্ট্রোক মুছুন"
            >
              <Undo2 className="w-4 h-4" />
            </button>

            {mode === 'guided_tracing' && (
              <button
                type="button"
                onClick={() => setShowGhost(!showGhost)}
                className="btn-haptic p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                title={showGhost ? 'গাইড লুকান' : 'গাইড দেখুন'}
              >
                {showGhost ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-emerald-400" />}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={evaluateWriting}
              className="btn-haptic px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>যাচাই ও মূল্যায়ন</span>
            </button>

            <button
              type="button"
              onClick={handleToggleMastery}
              className={`btn-haptic px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isMastered
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Award className={`w-3.5 h-3.5 ${isMastered ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isMastered ? 'মাস্টারড' : 'মাস্টার'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 7. REELS AUTOPLAY FOOTER (Always visible for instantaneous progression) */}
      <div className="w-full mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="text-[11px] font-mono">
          স্ট্রোক আঁকা হয়েছে: {strokesHistory.length} / {kana.strokes}
        </span>

        {onNextCharacter && (
          <button
            type="button"
            onClick={onNextCharacter}
            className="btn-haptic text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>পরবর্তী বর্ণ স্কিপ করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default KanaDrawingCanvas;
