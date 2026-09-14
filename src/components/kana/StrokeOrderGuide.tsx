import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { KanaCharacter } from '../../data/kanaData';
import { getKanaStrokeSequence, KanaVectorStroke } from '../../data/kanaStrokePaths';
import { speakJapanese } from '../../lib/tts';

interface StrokeOrderGuideProps {
  kana: KanaCharacter;
  onStrokeChange?: (strokeIndex: number) => void;
  className?: string;
}

export const StrokeOrderGuide: React.FC<StrokeOrderGuideProps> = ({
  kana,
  onStrokeChange,
  className = ''
}) => {
  const strokes: KanaVectorStroke[] = getKanaStrokeSequence(kana.char, kana.strokes);
  const [currentStroke, setCurrentStroke] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset to first stroke when character changes
  useEffect(() => {
    setCurrentStroke(0);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [kana.char]);

  // Handle animation play loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStroke((prev) => {
          if (prev >= strokes.length - 1) {
            return 0;
          }
          return prev + 1;
        });
      }, 1200);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, strokes.length]);

  useEffect(() => {
    onStrokeChange?.(currentStroke);
  }, [currentStroke, onStrokeChange]);

  const activeStroke = strokes[currentStroke] || strokes[0];

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStroke((prev) => Math.min(strokes.length - 1, prev + 1));
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStroke((prev) => Math.max(0, prev - 1));
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStroke(0);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const playAudio = () => {
    speakJapanese(kana.char, { rate: 0.85 });
  };

  const getReleaseLabel = (type: string) => {
    switch (type) {
      case 'tome':
        return { ja: '止め (Tome)', bn: 'দৃঢ়ভাবে থামুন (Stop)', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' };
      case 'hane':
        return { ja: 'はね (Hane)', bn: 'উপরে হুক তুলুন (Hook)', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' };
      case 'harai':
        return { ja: 'はらい (Harai)', bn: 'টান দিয়ে ছাড়ুন (Sweep)', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' };
      default:
        return { ja: '止め (Tome)', bn: 'থামুন', color: 'text-slate-400 border-slate-700 bg-slate-800' };
    }
  };

  const release = getReleaseLabel(activeStroke.releaseType);

  return (
    <div className={`flex flex-col items-center bg-[#0d0d18] border border-slate-800 rounded-3xl p-4 sm:p-6 text-slate-100 shadow-xl ${className}`}>
      {/* Header Info */}
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold">
            {kana.type === 'hiragana' ? 'হিরাগানা' : 'কাতাকানা'} স্ট্রোক গাইড
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
            {kana.strokes} স্ট্রোক
          </span>
        </div>

        <button
          type="button"
          onClick={playAudio}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-rose-300 text-xs font-semibold transition-colors"
          title="উচ্চারণ শুনুন"
        >
          <Volume2 className="w-3.5 h-3.5 text-rose-400" />
          <span>{kana.romaji} ({kana.banglaPhonetic})</span>
        </button>
      </div>

      {/* Traditional Japanese 4-Quadrant Guideline Canvas */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl bg-[#080811] border border-slate-800/90 shadow-inner flex items-center justify-center overflow-hidden">
        {/* Guideline Grid (Cross & Diagonals) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="2,2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="2,2" />
          <line x1="0" y1="0" x2="100" y2="100" stroke="#0f172a" strokeWidth="0.5" strokeDasharray="3,3" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="#0f172a" strokeWidth="0.5" strokeDasharray="3,3" />
        </svg>

        {/* Ghost background character for visual target */}
        <span className="absolute text-7xl sm:text-8xl font-japanese font-black text-slate-800/40 select-none pointer-events-none">
          {kana.char}
        </span>

        {/* Dynamic Vector Stroke Layer */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {/* Render already completed strokes */}
          {strokes.map((stroke, idx) => {
            if (idx > currentStroke) return null;
            const isCurrent = idx === currentStroke;

            return (
              <g key={stroke.strokeNumber}>
                {/* Glow layer for active stroke */}
                {isCurrent && (
                  <path
                    d={stroke.path}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.25"
                    className="animate-pulse"
                  />
                )}

                {/* Primary Stroke Path */}
                <path
                  d={stroke.path}
                  fill="none"
                  stroke={isCurrent ? '#f43f5e' : '#64748b'}
                  strokeWidth={isCurrent ? '5.5' : '4'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Start Point Indicator (Dot) */}
                <circle
                  cx={stroke.startPoint.x}
                  cy={stroke.startPoint.y}
                  r={isCurrent ? '3.5' : '2.5'}
                  fill={isCurrent ? '#fbbf24' : '#475569'}
                  stroke="#0f172a"
                  strokeWidth="1"
                />

                {/* Number Badge at Start Point */}
                <text
                  x={stroke.startPoint.x - (stroke.startPoint.x > 50 ? 6 : -6)}
                  y={stroke.startPoint.y - 4}
                  fontSize="5"
                  fontWeight="bold"
                  fill={isCurrent ? '#fbbf24' : '#94a3b8'}
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {stroke.strokeNumber}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Step Badge Overlay */}
        <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-300">
          ধাপ: <span className="text-rose-400 font-bold">{currentStroke + 1}</span> / {strokes.length}
        </div>
      </div>

      {/* Stroke Instruction & Release Type */}
      <div className="w-full mt-4 p-3 rounded-2xl bg-[#111122] border border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-rose-500/30">
            {activeStroke.strokeNumber}
          </span>
          <p className="text-xs text-slate-200 font-medium leading-tight">
            {activeStroke.instructionBn}
          </p>
        </div>

        <div className={`shrink-0 px-2 py-1 rounded-xl border text-[10px] font-bold ${release.color}`}>
          {release.ja}
        </div>
      </div>

      {/* Step Controls */}
      <div className="w-full mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleRestart}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          title="পুনরায় শুরু করুন"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStroke === 0}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1 transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">পূর্ববর্তী</span>
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-1.5 transition-all active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>থামান</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>অ্যানিমেশন</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentStroke === strokes.length - 1}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1 transition-colors"
          >
            <span className="hidden sm:inline">পরবর্তী</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrokeOrderGuide;
