import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { getKanaStrokeSequence, KanaVectorStroke } from '../../data/kanaStrokePaths';
import { soundEffects } from '../../lib/soundEffects';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';
import { speakJapanese } from '../../lib/tts';
import { IconApple3D, IconBrush3D, IconLightbulb3D } from './Journey3DIcons';

interface Point {
  x: number;
  y: number;
}

export interface InteractiveKanaTraceCanvasProps {
  char?: string;
  romaji?: string;
  strokeCount?: number;
  strokeDirections?: string[];
  onComplete?: () => void;
  onAdvanceToNext?: () => void;
  onStrokeDrawn?: (count: number) => void;
  className?: string;
}

export const InteractiveKanaTraceCanvas: React.FC<InteractiveKanaTraceCanvasProps> = ({
  char = 'あ',
  romaji = 'a',
  strokeCount = 3,
  strokeDirections,
  onComplete,
  onAdvanceToNext,
  onStrokeDrawn,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const currentStrokeRef = useRef<Point[]>([]);
  const [drawnCount, setDrawnCount] = useState(0);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Audio-reactive waveform ripple state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlayAudio = () => {
    speakJapanese(char);
    setIsAudioPlaying(true);
    if (audioTimerRef.current) clearTimeout(audioTimerRef.current);
    audioTimerRef.current = setTimeout(() => {
      setIsAudioPlaying(false);
    }, 1300);
  };

  // Stroke animation state (WATCH mode)
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
  const [animStrokeIndex, setAnimStrokeIndex] = useState<number>(-1);
  const animTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  // Get vector paths for the character
  const vectorStrokes: KanaVectorStroke[] = getKanaStrokeSequence(char, strokeCount);

  // Reset when character changes
  useEffect(() => {
    handleClearCanvas();
    stopAnimation();
    setHasCelebrated(false);
  }, [char]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      animTimeoutRef.current.forEach(clearTimeout);
    };
  }, []);

  // Stop running animation
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

  // High-DPI canvas setup with 2x scale
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const size = Math.floor(Math.min(rect.width, 270));
    if (size <= 0) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 2);

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    redrawCanvas();
  }, [strokes]);

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, [setupCanvas]);

  // Render Japanese Hosho Paper background with sumi-e guidelines
  const drawBackground = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.clearRect(0, 0, size, size);

    // Subtle traditional calligraphy crosshair guidelines (dashed amber/gold)
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
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

    // Ghost Watermark Outline of the Character (14% opacity for natural tracing)
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.font = `900 ${Math.floor(size * 0.72)}px "Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, size / 2, size / 2 + size * 0.04);
    ctx.restore();
  };

  // Smooth calligraphy stroke rendering using Midpoint Quadratic Bezier curves
  // Draw authentic Japanese Sumi calligraphy brush stroke with tapered ends
  const drawSmoothPath = (ctx: CanvasRenderingContext2D, points: Point[], color = '#ff3b30', lineWidth = 9) => {
    if (points.length === 0) return;

    if (points.length === 1) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, lineWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = 'rgba(239, 68, 68, 0.5)';
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. Outer rich Sumi red glow
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = 'rgba(220, 38, 38, 0.45)';
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

    // 2. Inner liquid vermilion core for 3D calligraphy depth
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = Math.max(lineWidth * 0.45, 2.5);
    ctx.shadowBlur = 0;
    ctx.stroke();

    ctx.restore();
  };

  // Full canvas redraw
  const redrawCanvas = () => {
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

    // Draw all user strokes
    strokes.forEach((stroke) => {
      drawSmoothPath(ctx, stroke, '#ff3b30', 9);
    });

    // Draw active stroke
    if (currentStrokeRef.current.length > 0) {
      drawSmoothPath(ctx, currentStrokeRef.current, '#ff3b30', 9);
    }

    ctx.restore();
  };

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
        drawSmoothPath(ctx, [pt], '#ff3b30', 9);
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
        drawSmoothPath(ctx, currentStrokeRef.current, '#ff3b30', 9);
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
      onStrokeDrawn?.(nextCount);
      soundEffects.playCorrectPing();

      // Trigger celebration on completing all strokes
      if (nextCount >= strokeCount && !hasCelebrated) {
        setHasCelebrated(true);
        soundEffects.playLessonCelebration();
        triggerCelebrationConfetti();
        onComplete?.();
      }
    }

    currentStrokeRef.current = [];
    redrawCanvas();
  };

  const handleClearCanvas = () => {
    setStrokes([]);
    currentStrokeRef.current = [];
    setDrawnCount(0);
    setHasCelebrated(false);
    redrawCanvas();
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Responsive Living Studio Layout: 1 col on mobile, 2 cols on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-center">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: CHARACTER SPOTLIGHT, AUDIO & APPLE MEMORY CUE     */}
        {/* ============================================================== */}
        <div className="space-y-3 text-left">
          
          {/* Header & Character Spotlight */}
          <div className="p-3 sm:p-4 rounded-3xl bg-gradient-to-br from-[#16132b] via-[#1a1633] to-[#0e0c1f] border border-amber-500/25 shadow-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="relative flex items-center justify-center">
                {/* Audio-reactive radial waveform ripple */}
                {isAudioPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <span className="absolute w-16 h-16 rounded-full border-2 border-amber-400/80 animate-ping" />
                    <span className="absolute w-24 h-24 rounded-full border border-rose-500/60 animate-pulse" />
                    <span className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-red-600/15 via-amber-500/15 to-transparent blur-md" />
                  </div>
                )}
                <div className="absolute inset-0 bg-red-600/20 rounded-full blur-lg animate-pulse" />
                <span className="relative z-10 font-japanese font-black text-5xl sm:text-6xl text-white tracking-wider drop-shadow-md select-none">
                  {char}
                </span>
              </div>

              <div className="flex flex-col items-start gap-1">
                <button
                  type="button"
                  onClick={handlePlayAudio}
                  className="btn-haptic px-3 py-1.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 cursor-pointer active:scale-95 transition group"
                  title="শুনুন (Listen to authentic Japanese sound)"
                >
                  <Volume2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>শুনুন (Listen)</span>
                </button>
                <span className="text-xs font-mono text-stone-300 font-bold ml-0.5">
                  উচ্চারণ: <span className="text-amber-400 font-bold">{romaji}</span> (আ)
                </span>
              </div>
            </div>

            {/* Step-by-step Stroke Preview Button */}
            <button
              type="button"
              onClick={handlePlayAnimation}
              className={`btn-haptic px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border shrink-0 ${
                isPlayingAnimation
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-white/[0.06] hover:bg-white/[0.1] text-stone-200 border-white/10'
              }`}
              title="স্ট্রোকের ক্রম অ্যানিমেশন দেখুন"
            >
              <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{isPlayingAnimation ? 'দেখাচ্ছি...' : 'স্ট্রোক প্রিভিউ'}</span>
            </button>
          </div>

          {/* Apple Memory Cue (Mandate v7.0 3D Shaded Vector & Clean Copy) */}
          <div className="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-[#17142b] to-[#120f24] border border-red-500/25 shadow-md">
            {char === 'あ' ? (
              <div className="w-9 h-9 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0 shadow-sm">
                <IconApple3D className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-sm">
                <IconLightbulb3D className="w-5 h-5" />
              </div>
            )}

            <div>
              <div className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                <IconApple3D className="w-4 h-4 shrink-0" />
                <span>
                  {char === 'あ'
                    ? 'সহজ ছবি মনে রাখো: আপেলের গোল পেট আর ডাঁটা = আ (a)'
                    : `${char} এর সহজ মেমরি কিউ`}
                </span>
              </div>
              <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
                ভয় পাওয়ার কিচ্ছু নেই, চলো ডান পাশের ক্যানভাসে হাত ঘুরিয়ে লিখি!
              </p>
            </div>
          </div>

          {/* Stroke Directions Guidance */}
          {strokeDirections && strokeDirections.length > 0 && (
            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1 text-xs">
              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                <IconBrush3D className="w-3.5 h-3.5" />
                <span>স্ট্রোক ক্রম:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-stone-300 text-[11px]">
                {strokeDirections.map((dir, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-lg border border-white/5">
                    <span className="w-4 h-4 rounded-full bg-red-600/30 text-red-300 text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span>{dir}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: TACTILE JAPANESE HOSHO PAPER CANVAS               */}
        {/* ============================================================== */}
        <div className="space-y-2.5">
          
          {/* Canvas Top Bar */}
          <div className="flex items-center justify-between px-2 text-xs font-mono text-stone-300 font-bold">
            <span className="flex items-center gap-1.5">
              <span>টান:</span>
              <span className="text-amber-400 font-black text-sm">{drawnCount}</span>
              <span className="text-stone-500">/</span>
              <span>{strokeCount}</span>
            </span>
            <button
              type="button"
              onClick={handleClearCanvas}
              disabled={strokes.length === 0}
              className="px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-stone-300 hover:text-white transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-[11px] border border-white/10"
              title="মুছুন (Clear)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>মুছুন</span>
            </button>
          </div>

          {/* Japanese Hosho Paper Canvas Box */}
          <div className="relative mx-auto w-full max-w-[290px]">
            <div
              ref={containerRef}
              className="relative mx-auto rounded-3xl bg-gradient-to-br from-[#19162c] via-[#151226] to-[#0c0a1a] border-2 border-amber-500/30 shadow-2xl overflow-hidden flex items-center justify-center p-2.5"
              style={{ width: '100%', height: '270px' }}
            >
              {/* Decorative Traditional Japanese Sumi-e Corner Brackets */}
              <svg className="absolute top-2 left-2 w-5 h-5 pointer-events-none opacity-60" viewBox="0 0 20 20">
                <path d="M 2 12 L 2 2 L 12 2" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <svg className="absolute top-2 right-2 w-5 h-5 pointer-events-none opacity-60" viewBox="0 0 20 20">
                <path d="M 8 2 L 18 2 L 18 12" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <svg className="absolute bottom-2 left-2 w-5 h-5 pointer-events-none opacity-60" viewBox="0 0 20 20">
                <path d="M 2 8 L 2 18 L 12 18" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <svg className="absolute bottom-2 right-2 w-5 h-5 pointer-events-none opacity-60" viewBox="0 0 20 20">
                <path d="M 8 18 L 18 18 L 18 8" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
              </svg>

              {/* Japanese Rakkan Vermilion Artist Seal (落款) */}
              <div className="absolute bottom-4 right-4 pointer-events-none select-none opacity-75">
                <div className="w-6 h-6 rounded bg-red-700/80 border border-red-400/60 flex items-center justify-center text-[9px] font-japanese font-black text-white shadow-sm">
                  にほ
                </div>
              </div>

              {/* Interactive Tracing Canvas */}
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{ touchAction: 'none' }}
                className="touch-none select-none cursor-crosshair rounded-2xl"
              />

              {/* Vector Stroke Guide Overlay during Animation */}
              {isPlayingAnimation && (
                <div className="absolute inset-0 pointer-events-none p-4 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]">
                    {vectorStrokes.map((s, idx) => {
                      const isActive = animStrokeIndex === idx;
                      const isPast = animStrokeIndex > idx;
                      const strokeColor = isActive ? '#fbbf24' : isPast ? '#f43f5e' : 'rgba(255, 255, 255, 0.15)';
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
                </div>
              )}
            </div>
          </div>

          <p className="text-[11px] text-stone-400 text-center">
            হালকা জলছাপের উপর আঙুল বা মাউস দিয়ে ৩টি টানে হাত ঘোরান
          </p>

          {/* Celebratory Victory Message & First Win CTA */}
          {hasCelebrated && (
            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 shadow-lg">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-bounce" />
                <span>সাবাশ! তুমি প্রথম জাপানি বর্ণ লিখে ফেলেছ!</span>
              </div>

              {onAdvanceToNext && (
                <button
                  type="button"
                  onClick={onAdvanceToNext}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm shadow-xl shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
                >
                  <span>পরের ধাপে যাই (Next Step)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
