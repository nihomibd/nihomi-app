import React, { useState } from 'react';
import { Volume2, Music, Mic, Sparkles, AlertCircle } from 'lucide-react';
import {
  TokyoPitchInfo,
  getTokyoPitchInfo,
  getPatternColorTheme
} from '../../lib/pitchAccentData';
import {
  playTokyoPitchMelody,
  playNativeTokyoSpeech
} from '../../lib/pitchAccentAudio';
import { PitchAccentPattern } from '../../types';

export interface TokyoPitchWaveformProps {
  word: string;
  reading?: string;
  pattern?: PitchAccentPattern;
  downstepMora?: number;
  morae?: string[];
  targetPitches?: ('H' | 'L')[];
  compact?: boolean;
  showControls?: boolean;
  onOpenPitchLab?: (word: string) => void;
}

export const TokyoPitchWaveform: React.FC<TokyoPitchWaveformProps> = ({
  word,
  reading,
  pattern: propPattern,
  downstepMora: propDownstep,
  morae: propMorae,
  targetPitches: propTargetPitches,
  compact = false,
  showControls = true,
  onOpenPitchLab
}) => {
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);

  // Derive pitch information
  const pitchInfo: TokyoPitchInfo = React.useMemo(() => {
    const derived = getTokyoPitchInfo(word, reading);
    return {
      ...derived,
      pattern: propPattern || derived.pattern,
      downstepMora: propDownstep !== undefined ? propDownstep : derived.downstepMora,
      morae: propMorae || derived.morae,
      targetPitches: propTargetPitches || derived.targetPitches
    };
  }, [word, reading, propPattern, propDownstep, propMorae, propTargetPitches]);

  const theme = getPatternColorTheme(pitchInfo.pattern);
  const morae = pitchInfo.morae;
  const pitches = pitchInfo.targetPitches;

  // Audio Playback Handlers
  const handlePlaySpeech = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isPlayingSpeech) return;
    setIsPlayingSpeech(true);
    playNativeTokyoSpeech(
      word || pitchInfo.reading,
      0.9,
      () => {},
      () => setIsPlayingSpeech(false)
    );
  };

  const handlePlayMelody = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isPlayingMelody) return;
    setIsPlayingMelody(true);
    try {
      await playTokyoPitchMelody(pitches, morae, 1.0);
    } finally {
      setTimeout(() => setIsPlayingMelody(false), 300);
    }
  };

  const handleOpenLabClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenPitchLab) {
      onOpenPitchLab(word);
    }
  };

  // SVG Waveform Geometry Calculations
  const svgWidth = Math.max(160, morae.length * 48 + 36);
  const svgHeight = compact ? 52 : 72;
  const highY = compact ? 14 : 18;
  const lowY = compact ? 38 : 52;

  const points = morae.map((mora, idx) => {
    const x = 24 + idx * 46;
    const isHigh = pitches[idx] === 'H';
    const y = isHigh ? highY : lowY;
    const isDrop =
      pitchInfo.downstepMora > 0 &&
      (pitchInfo.downstepMora === 1 ? idx === 0 : idx === pitchInfo.downstepMora - 1);
    return { x, y, isHigh, mora, isDrop, idx };
  });

  // Polyline coordinates
  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  return (
    <div
      id={`tokyo-pitch-waveform-${word}`}
      className={`rounded-2xl border transition-all text-left ${
        compact
          ? 'p-2.5 bg-stone-50/90 dark:bg-stone-900/90 border-stone-200 dark:border-stone-800'
          : 'p-4 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xs space-y-3'
      }`}
    >
      {/* Top Header: Pattern Badge & Quick Audio buttons */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{pitchInfo.patternNameJa}</span>
            <span className="opacity-75 font-normal">({pitchInfo.patternNameBn})</span>
          </span>

          {pitchInfo.downstepMora > 0 && (
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900">
              Downstep: Mora {pitchInfo.downstepMora} ⬇
            </span>
          )}
        </div>

        {showControls && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handlePlaySpeech}
              title="Native Tokyo Speech উচ্চারণ"
              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                isPlayingSpeech
                  ? 'bg-red-500 text-white border-red-600 ring-2 ring-red-300'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-red-600 dark:text-rose-400" />
            </button>

            <button
              type="button"
              onClick={handlePlayMelody}
              title="Tokyo Pitch Contour Melody (সিন্থেসাইজড সুর)"
              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                isPlayingMelody
                  ? 'bg-sky-500 text-white border-sky-600 ring-2 ring-sky-300'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            </button>

            {onOpenPitchLab && (
              <button
                type="button"
                onClick={handleOpenLabClick}
                title="Open in Tokyo Pitch Accent Lab"
                className="px-2 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Mic className="w-3 h-3" />
                <span className="hidden sm:inline">Pitch Lab</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Interactive Waveform SVG Canvas */}
      <div className="overflow-x-auto py-1">
        <div className="inline-block min-w-full">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full max-w-sm h-14 sm:h-16 overflow-visible"
          >
            {/* Guide Grid Lines */}
            <line
              x1="12"
              y1={highY}
              x2={svgWidth - 12}
              y2={highY}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
              strokeWidth="1"
              className="dark:stroke-stone-800"
            />
            <line
              x1="12"
              y1={lowY}
              x2={svgWidth - 12}
              y2={lowY}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
              strokeWidth="1"
              className="dark:stroke-stone-800"
            />

            {/* Pitch Contour Path */}
            <path
              d={pathD}
              fill="none"
              stroke={theme.lineColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Mora Nodes */}
            {points.map((pt) => (
              <g key={pt.idx}>
                {/* Outer halo */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="7"
                  fill="white"
                  stroke={pt.isDrop ? theme.accentDropColor : theme.lineColor}
                  strokeWidth="2.5"
                  className="dark:fill-stone-900"
                />

                {/* Inner center dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  fill={pt.isHigh ? (pt.isDrop ? theme.accentDropColor : theme.lineColor) : '#94a3b8'}
                />

                {/* Pitch Level Badge (H/L) */}
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="bold"
                  fill={pt.isHigh ? '#0284c7' : '#64748b'}
                >
                  {pt.isHigh ? 'H' : 'L'}
                </text>

                {/* Mora Kana Label underneath */}
                <text
                  x={pt.x}
                  y={lowY + 16}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="currentColor"
                  className="text-stone-800 dark:text-stone-200 font-japanese"
                >
                  {pt.mora}
                </text>

                {/* Downstep Drop Indicator Marker */}
                {pt.isDrop && (
                  <g>
                    <text
                      x={pt.x + 14}
                      y={pt.y + 4}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fill="#e11d48"
                    >
                      ▼
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Phonetic Coaching Note */}
      {!compact && (
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-300 space-y-1">
          <p className="font-semibold text-stone-900 dark:text-white flex items-center gap-1">
            <span className="text-red-600 dark:text-rose-400">💡 টোকিও অ্যাকসেন্ট টিপ:</span>
            <span>{pitchInfo.downstepTipBn}</span>
          </p>
          <p className="text-[10px] text-stone-500 dark:text-stone-400">
            {pitchInfo.particlePitchBehaviorBn}
          </p>
        </div>
      )}
    </div>
  );
};

export default TokyoPitchWaveform;
