import React, { useState } from 'react';
import { Layers, Sparkles, Volume2, ChevronRight, Eye } from 'lucide-react';
import { speakJapanese } from '../../lib/tts';

// Accurate vector stroke path data for common foundational Kanji (KanjiVG-aligned SVG coordinates)
interface StrokeData {
  strokes: { d: string; labelPos: { x: number; y: number } }[];
  totalStrokes: number;
  radicals: string;
  jlpt: string;
}

const KANJI_STROKE_DATA: Record<string, StrokeData> = {
  '日': {
    totalStrokes: 4,
    radicals: '日 (Sun / Day)',
    jlpt: 'N5',
    strokes: [
      { d: 'M 25 20 L 25 88', labelPos: { x: 18, y: 30 } },
      { d: 'M 25 22 L 75 22 L 75 88', labelPos: { x: 45, y: 16 } },
      { d: 'M 25 54 L 75 54', labelPos: { x: 38, y: 50 } },
      { d: 'M 25 88 L 75 88', labelPos: { x: 45, y: 84 } }
    ]
  },
  '本': {
    totalStrokes: 5,
    radicals: '木 (Tree) + 一 (Base line)',
    jlpt: 'N5',
    strokes: [
      { d: 'M 15 42 L 85 42', labelPos: { x: 12, y: 36 } },
      { d: 'M 50 15 L 50 90', labelPos: { x: 54, y: 22 } },
      { d: 'M 50 42 Q 35 65 18 85', labelPos: { x: 30, y: 60 } },
      { d: 'M 50 42 Q 65 65 82 85', labelPos: { x: 68, y: 60 } },
      { d: 'M 30 74 L 70 74', labelPos: { x: 45, y: 70 } }
    ]
  },
  '語': {
    totalStrokes: 14,
    radicals: '言 (Speech) + 吾 (Myself)',
    jlpt: 'N5',
    strokes: [
      { d: 'M 22 18 L 26 24', labelPos: { x: 18, y: 16 } },
      { d: 'M 10 32 L 38 32', labelPos: { x: 6, y: 30 } },
      { d: 'M 14 44 L 34 44', labelPos: { x: 9, y: 42 } },
      { d: 'M 14 56 L 34 56', labelPos: { x: 9, y: 54 } },
      { d: 'M 14 68 L 14 88', labelPos: { x: 9, y: 75 } },
      { d: 'M 14 70 L 36 70 L 36 88 L 14 88', labelPos: { x: 38, y: 76 } },
      { d: 'M 48 30 L 88 30', labelPos: { x: 46, y: 24 } },
      { d: 'M 64 30 L 52 56', labelPos: { x: 50, y: 40 } },
      { d: 'M 52 42 L 84 42 L 80 58', labelPos: { x: 86, y: 38 } },
      { d: 'M 45 58 L 90 58', labelPos: { x: 40, y: 56 } },
      { d: 'M 52 70 L 52 90', labelPos: { x: 46, y: 76 } },
      { d: 'M 52 72 L 84 72 L 84 90', labelPos: { x: 86, y: 78 } },
      { d: 'M 52 90 L 84 90', labelPos: { x: 65, y: 96 } },
      { d: 'M 58 72 L 58 90', labelPos: { x: 60, y: 82 } }
    ]
  },
  '食': {
    totalStrokes: 9,
    radicals: '飠 (Food / Eating)',
    jlpt: 'N5',
    strokes: [
      { d: 'M 50 14 Q 30 35 15 48', labelPos: { x: 28, y: 26 } },
      { d: 'M 50 14 Q 70 35 85 48', labelPos: { x: 72, y: 26 } },
      { d: 'M 42 38 L 58 38', labelPos: { x: 46, y: 34 } },
      { d: 'M 35 50 L 65 50', labelPos: { x: 30, y: 48 } },
      { d: 'M 32 62 L 68 62', labelPos: { x: 26, y: 60 } },
      { d: 'M 30 74 L 70 74', labelPos: { x: 24, y: 72 } },
      { d: 'M 38 52 L 38 90', labelPos: { x: 34, y: 82 } },
      { d: 'M 50 74 L 50 90', labelPos: { x: 46, y: 86 } },
      { d: 'M 22 92 L 78 92', labelPos: { x: 18, y: 94 } }
    ]
  },
  '行': {
    totalStrokes: 6,
    radicals: '彳 (Step) + 亍 (Footstep)',
    jlpt: 'N5',
    strokes: [
      { d: 'M 36 18 Q 28 32 20 42', labelPos: { x: 24, y: 22 } },
      { d: 'M 38 38 Q 28 58 16 75', labelPos: { x: 22, y: 48 } },
      { d: 'M 32 60 L 32 92', labelPos: { x: 26, y: 78 } },
      { d: 'M 50 32 L 86 32', labelPos: { x: 55, y: 26 } },
      { d: 'M 46 54 L 92 54', labelPos: { x: 44, y: 48 } },
      { d: 'M 72 15 L 72 82 Q 72 92 62 90', labelPos: { x: 76, y: 24 } }
    ]
  },
  '友': {
    totalStrokes: 4,
    radicals: '又 (Right hand / Again)',
    jlpt: 'N5',
    strokes: [
      { d: 'M 20 32 L 80 32', labelPos: { x: 16, y: 26 } },
      { d: 'M 50 15 Q 40 45 18 78', labelPos: { x: 34, y: 24 } },
      { d: 'M 32 46 L 70 46 L 40 85', labelPos: { x: 50, y: 42 } },
      { d: 'M 36 54 Q 60 72 85 88', labelPos: { x: 62, y: 70 } }
    ]
  },
  '達': {
    totalStrokes: 12,
    radicals: '辶 (Road/Movement) + 幸 (Happiness/Reach)',
    jlpt: 'N5',
    strokes: [
      { d: 'M 45 20 L 78 20', labelPos: { x: 42, y: 16 } },
      { d: 'M 60 12 L 60 36', labelPos: { x: 64, y: 16 } },
      { d: 'M 40 36 L 82 36', labelPos: { x: 36, y: 32 } },
      { d: 'M 48 44 L 75 44', labelPos: { x: 44, y: 42 } },
      { d: 'M 42 54 L 80 54', labelPos: { x: 38, y: 52 } },
      { d: 'M 60 36 L 60 68', labelPos: { x: 64, y: 46 } },
      { d: 'M 46 68 L 76 68', labelPos: { x: 42, y: 66 } },
      { d: 'M 50 56 Q 44 76 36 86', labelPos: { x: 44, y: 78 } },
      { d: 'M 70 56 Q 74 76 80 86', labelPos: { x: 74, y: 78 } },
      { d: 'M 18 24 L 26 30', labelPos: { x: 12, y: 22 } },
      { d: 'M 12 48 L 26 44 L 14 65', labelPos: { x: 8, y: 45 } },
      { d: 'M 10 72 Q 22 76 45 80 L 88 88', labelPos: { x: 12, y: 84 } }
    ]
  },
  '時': {
    totalStrokes: 10,
    radicals: '日 (Sun) + 寺 (Temple / Time)',
    jlpt: 'N5',
    strokes: [
      { d: 'M 15 25 L 15 80', labelPos: { x: 10, y: 32 } },
      { d: 'M 15 27 L 42 27 L 42 80', labelPos: { x: 26, y: 22 } },
      { d: 'M 15 52 L 42 52', labelPos: { x: 22, y: 48 } },
      { d: 'M 15 80 L 42 80', labelPos: { x: 25, y: 76 } },
      { d: 'M 52 32 L 88 32', labelPos: { x: 48, y: 28 } },
      { d: 'M 68 15 L 68 45', labelPos: { x: 72, y: 18 } },
      { d: 'M 46 52 L 94 52', labelPos: { x: 44, y: 48 } },
      { d: 'M 76 42 L 76 85 Q 76 94 66 90', labelPos: { x: 80, y: 46 } },
      { d: 'M 56 65 L 64 74', labelPos: { x: 52, y: 64 } },
      { d: 'M 52 82 L 88 82', labelPos: { x: 50, y: 80 } }
    ]
  },
  '間': {
    totalStrokes: 12,
    radicals: '門 (Gate) + 日 (Sun)',
    jlpt: 'N5',
    strokes: [
      { d: 'M 18 20 L 18 85', labelPos: { x: 12, y: 25 } },
      { d: 'M 18 22 L 40 22 L 40 50', labelPos: { x: 26, y: 18 } },
      { d: 'M 18 36 L 40 36', labelPos: { x: 24, y: 32 } },
      { d: 'M 18 50 L 40 50', labelPos: { x: 24, y: 46 } },
      { d: 'M 60 18 L 60 48', labelPos: { x: 55, y: 22 } },
      { d: 'M 60 20 L 86 20 L 86 88 Q 86 94 76 90', labelPos: { x: 70, y: 16 } },
      { d: 'M 60 34 L 86 34', labelPos: { x: 68, y: 30 } },
      { d: 'M 60 48 L 86 48', labelPos: { x: 68, y: 44 } },
      { d: 'M 36 58 L 36 86', labelPos: { x: 30, y: 62 } },
      { d: 'M 36 60 L 66 60 L 66 86', labelPos: { x: 48, y: 56 } },
      { d: 'M 36 72 L 66 72', labelPos: { x: 46, y: 68 } },
      { d: 'M 36 86 L 66 86', labelPos: { x: 46, y: 84 } }
    ]
  },
  '先': {
    totalStrokes: 6,
    radicals: '儿 (Legs) + 𠂉 (Head)',
    jlpt: 'N5',
    strokes: [
      { d: 'M 50 14 Q 40 25 32 34', labelPos: { x: 36, y: 20 } },
      { d: 'M 20 36 L 80 36', labelPos: { x: 16, y: 32 } },
      { d: 'M 50 36 L 50 58', labelPos: { x: 54, y: 44 } },
      { d: 'M 15 58 L 85 58', labelPos: { x: 10, y: 54 } },
      { d: 'M 38 60 Q 32 78 20 90', labelPos: { x: 30, y: 72 } },
      { d: 'M 56 60 L 56 80 Q 56 92 78 90', labelPos: { x: 62, y: 68 } }
    ]
  },
  '生': {
    totalStrokes: 5,
    radicals: '生 (Life/Birth)',
    jlpt: 'N5',
    strokes: [
      { d: 'M 35 22 Q 28 35 20 45', labelPos: { x: 26, y: 26 } },
      { d: 'M 18 45 L 82 45', labelPos: { x: 12, y: 40 } },
      { d: 'M 50 15 L 50 88', labelPos: { x: 54, y: 20 } },
      { d: 'M 26 65 L 74 65', labelPos: { x: 20, y: 60 } },
      { d: 'M 12 88 L 88 88', labelPos: { x: 8, y: 84 } }
    ]
  }
};

interface KanjiStrokeSvgDiagramProps {
  kanjiChar: string;
  size?: number;
}

export const KanjiStrokeSvgDiagram: React.FC<KanjiStrokeSvgDiagramProps> = ({
  kanjiChar,
  size = 180
}) => {
  const [activeStep, setActiveStep] = useState<number | 'ALL'>('ALL');
  const strokeData = KANJI_STROKE_DATA[kanjiChar];

  if (!strokeData) {
    // Elegant fallback SVG for Kanji not in hardcoded vector table
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-700">
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs"
        >
          {/* Grid lines */}
          <line x1="50" y1="0" x2="50" y2="100" stroke="#E7E5E4" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#E7E5E4" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="0" y1="0" x2="100" y2="100" stroke="#F5F5F4" strokeWidth="0.8" strokeDasharray="3,3" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="#F5F5F4" strokeWidth="0.8" strokeDasharray="3,3" />
          <text
            x="50"
            y="65"
            fontSize="54"
            textAnchor="middle"
            fontFamily="'Noto Serif JP', serif"
            className="fill-stone-900 dark:fill-white font-bold"
          >
            {kanjiChar}
          </text>
        </svg>
        <div className="mt-2 text-center text-[10px] text-stone-500 font-mono">
          Standard Stroke Grid: {kanjiChar}
        </div>
      </div>
    );
  }

  const visibleStrokes =
    activeStep === 'ALL'
      ? strokeData.strokes
      : strokeData.strokes.slice(0, activeStep);

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 font-serif font-bold text-lg flex items-center justify-center border border-red-200 dark:border-red-900">
            {kanjiChar}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                Kanji Stroke Vector Order
              </h4>
              <span className="text-[10px] px-1.5 py-0.2 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold rounded font-mono">
                {strokeData.totalStrokes} Strokes
              </span>
            </div>
            <p className="text-[10px] text-stone-500 font-mono">
              Radical: {strokeData.radicals}
            </p>
          </div>
        </div>

        <button
          onClick={() => speakJapanese(kanjiChar)}
          className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300 transition cursor-pointer"
          title="Pronounce Kanji"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main SVG Vector Diagram */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="relative">
          <svg
            viewBox="0 0 100 100"
            width={size}
            height={size}
            className="bg-white dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs"
          >
            {/* Traditional 米字格 (Rice Character Grid) dashed guidelines */}
            <line x1="50" y1="0" x2="50" y2="100" stroke="#E7E5E4" strokeWidth="0.8" strokeDasharray="3,3" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#E7E5E4" strokeWidth="0.8" strokeDasharray="3,3" />
            <line x1="0" y1="0" x2="100" y2="100" stroke="#F5F5F4" strokeWidth="0.5" strokeDasharray="4,4" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="#F5F5F4" strokeWidth="0.5" strokeDasharray="4,4" />

            {/* Background watermark of full kanji for tracing guide */}
            {strokeData.strokes.map((st, i) => (
              <path
                key={`bg-${i}`}
                d={st.d}
                fill="none"
                stroke="#E7E5E4"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* Active Rendered Strokes */}
            {visibleStrokes.map((st, i) => {
              const isLast = i === visibleStrokes.length - 1 && activeStep !== 'ALL';
              return (
                <g key={`st-${i}`}>
                  <path
                    d={st.d}
                    fill="none"
                    stroke={isLast ? '#DC2626' : '#1C1917'}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />
                  {/* Numbered stroke order node */}
                  <circle
                    cx={st.labelPos.x}
                    cy={st.labelPos.y}
                    r="4.5"
                    fill={isLast ? '#DC2626' : '#EF4444'}
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />
                  <text
                    x={st.labelPos.x}
                    y={st.labelPos.y + 1.8}
                    fontSize="5"
                    fill="#FFFFFF"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Step-by-Step Mini Thumbnails */}
        <div className="flex sm:flex-col flex-wrap gap-1.5 max-h-[180px] overflow-y-auto pr-1">
          <button
            onClick={() => setActiveStep('ALL')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono transition cursor-pointer ${
              activeStep === 'ALL'
                ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            Show All ({strokeData.totalStrokes})
          </button>
          {strokeData.strokes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx + 1)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono transition cursor-pointer flex items-center justify-between gap-2 ${
                activeStep === idx + 1
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <span>Step {idx + 1}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
