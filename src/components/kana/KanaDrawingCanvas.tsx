import React, { useRef, useState, useEffect } from 'react';
import {
  RotateCcw,
  Undo2,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Award,
  Volume2
} from 'lucide-react';
import { KanaCharacter, toggleMasteredKana, getMasteredKanaList } from '../../data/kanaData';
import { speakJapanese } from '../../lib/tts';

interface KanaDrawingCanvasProps {
  kana: KanaCharacter;
  onNextCharacter?: () => void;
  onMasteryToggled?: (isMastered: boolean) => void;
  className?: string;
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
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokesHistory, setStrokesHistory] = useState<StrokePath[]>([]);
  const [currentStroke, setCurrentStroke] = useState<StrokePath>([]);
  const [showGhost, setShowGhost] = useState<boolean>(true);
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [accuracyFeedback, setAccuracyFeedback] = useState<string>('');
  const [isMastered, setIsMastered] = useState<boolean>(false);

  // Check if character is already mastered
  useEffect(() => {
    const masteredList = getMasteredKanaList();
    setIsMastered(masteredList.includes(kana.char));
    handleClear();
  }, [kana.char]);

  // Set up canvas resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      redrawAllStrokes(strokesHistory);
    }
  }, []);

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

    // Dynamic calligraphy brush rendering
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

    // Calligraphy pressure simulation: faster stroke = thinner, slower = thicker
    const baseWidth = 8;
    const dynamicWidth = Math.max(4, Math.min(14, baseWidth - velocity * 1.5));

    ctx.strokeStyle = '#f43f5e'; // Vibrant Rose Neo-Tokyo ink
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

  const redrawAllStrokes = (history: StrokePath[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    history.forEach((stroke) => {
      if (stroke.length < 2) return;
      ctx.strokeStyle = '#f43f5e';
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
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setStrokesHistory([]);
    setCurrentStroke([]);
    setAccuracyScore(null);
    setAccuracyFeedback('');
  };

  const handleUndo = () => {
    if (strokesHistory.length === 0) return;
    const updated = strokesHistory.slice(0, -1);
    setStrokesHistory(updated);
    redrawAllStrokes(updated);
  };

  // Accuracy verification algorithm
  const checkAccuracy = () => {
    if (strokesHistory.length === 0) {
      setAccuracyFeedback('অনুগ্রহ করে ক্যানভাসে লিখে চেষ্টা করুন!');
      setAccuracyScore(0);
      return;
    }

    const strokeCount = strokesHistory.length;
    const targetStrokes = kana.strokes;

    // Calculate total points drawn and bounding area
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
    const coverageX = Math.min(1, drawnWidth / (w * 0.45));
    const coverageY = Math.min(1, drawnHeight / (h * 0.45));
    const coverageScore = ((coverageX + coverageY) / 2) * 40;

    // Stroke count accuracy penalty/bonus
    const strokeDiff = Math.abs(strokeCount - targetStrokes);
    const strokeScore = Math.max(10, 40 - strokeDiff * 10);

    // Complexity score
    const densityScore = Math.min(20, (totalPoints / 60) * 20);

    const calculated = Math.min(100, Math.round(coverageScore + strokeScore + densityScore));
    setAccuracyScore(calculated);

    if (calculated >= 88) {
      setAccuracyFeedback('চমৎকার! নিখুঁত ও পরিচ্ছন্ন স্ট্রোক হয়েছে!');
    } else if (calculated >= 75) {
      setAccuracyFeedback('দারুণ চেষ্টা! স্ট্রোকের বাঁকগুলো আরেকটু মসৃণ করুন।');
    } else if (calculated >= 55) {
      setAccuracyFeedback('ভালো শুরু! স্ট্রোক ক্রম ও দিক আরেকবার লক্ষ্য করুন।');
    } else {
      setAccuracyFeedback('আরেকটু অনুশীলন প্রয়োজন। গাইডের রেখা ট্রেস করে চেষ্টা করুন!');
    }
  };

  const handleToggleMastery = () => {
    const res = toggleMasteredKana(kana.char);
    setIsMastered(res.isMastered);
    onMasteryToggled?.(res.isMastered);
  };

  const playSound = () => {
    speakJapanese(kana.char, { rate: 0.85 });
  };

  return (
    <div className={`flex flex-col items-center bg-[#0d0d18] border border-slate-800 rounded-3xl p-4 sm:p-6 text-slate-100 shadow-xl ${className}`}>
      {/* Top action row */}
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            রাইটিং ল্যাব (Writing Lab)
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
            স্ট্রোক: {strokesHistory.length} / {kana.strokes}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowGhost((prev) => !prev)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
          title={showGhost ? 'গাইড লুকান' : 'গাইড দেখুন'}
        >
          {showGhost ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{showGhost ? 'গাইড লুকান' : 'গাইড দেখুন'}</span>
        </button>
      </div>

      {/* Writing Pad Container */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl bg-[#080811] border border-slate-800/90 shadow-inner flex items-center justify-center overflow-hidden touch-none">
        {/* Japanese 4-Quadrant Guidelines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="2,2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="2,2" />
          <line x1="0" y1="0" x2="100" y2="100" stroke="#0f172a" strokeWidth="0.5" strokeDasharray="3,3" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="#0f172a" strokeWidth="0.5" strokeDasharray="3,3" />
        </svg>

        {/* Ghost character trace outline */}
        {showGhost && (
          <span className="absolute text-7xl sm:text-8xl font-japanese font-black text-slate-700/35 select-none pointer-events-none transition-opacity duration-300">
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
          className="absolute inset-0 w-full h-full cursor-crosshair z-10"
        />
      </div>

      {/* Accuracy Feedback Banner */}
      {accuracyScore !== null && (
        <div className="w-full mt-4 p-3 rounded-2xl bg-[#121226] border border-rose-500/30 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${accuracyScore >= 75 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'}`}>
              {accuracyScore}%
            </div>
            <div>
              <p className="text-xs font-semibold text-white leading-tight">
                {accuracyFeedback}
              </p>
              <p className="text-[10px] text-slate-400">
                টার্গেট: {kana.strokes} স্ট্রোক • আপনি দিয়েছেন: {strokesHistory.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="w-full mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleClear}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="সব মুছুন"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleUndo}
            disabled={strokesHistory.length === 0}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="পূর্বাবস্থায় ফিরুন"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={playSound}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 transition-colors"
            title="উচ্চারণ"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={checkAccuracy}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>যাচাই করুন</span>
          </button>

          <button
            type="button"
            onClick={handleToggleMastery}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${isMastered ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'}`}
          >
            <Award className={`w-3.5 h-3.5 ${isMastered ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>{isMastered ? 'মাস্টারড' : 'মাস্টার করুন'}</span>
          </button>

          {onNextCharacter && (
            <button
              type="button"
              onClick={onNextCharacter}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
              title="পরবর্তী বর্ণ"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanaDrawingCanvas;
