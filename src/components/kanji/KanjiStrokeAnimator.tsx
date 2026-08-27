import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Volume2,
  PenTool,
  CheckCircle2,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  Eye,
  Eraser,
  HelpCircle,
  X
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';

export interface KanjiStrokeData {
  character: string;
  meaning: string;
  meaningBn?: string;
  onyomi: string[];
  kunyomi: string[];
  radical: string;
  radicalName: string;
  strokeCount: number;
  strokes: string[]; // SVG Path commands in 100x100 grid viewBox "0 0 100 100"
  strokeStartPoints?: { x: number; y: number; num: number; direction?: 'right' | 'down' | 'down-right' | 'hook' }[];
}

export const KANJI_STROKE_DATABASE: Record<string, KanjiStrokeData> = {
  '日': {
    character: '日',
    meaning: 'Sun / Day',
    meaningBn: 'সূর্য / দিন',
    onyomi: ['NICHI', 'JITSU'],
    kunyomi: ['hi', '-bi', '-ka'],
    radical: '日',
    radicalName: 'Hi / Nichi (Sun)',
    strokeCount: 4,
    strokes: [
      'M 25,20 L 25,80',
      'M 25,20 L 75,20 L 75,80',
      'M 25,50 L 75,50',
      'M 25,80 L 75,80'
    ],
    strokeStartPoints: [
      { x: 25, y: 20, num: 1, direction: 'down' },
      { x: 25, y: 20, num: 2, direction: 'right' },
      { x: 25, y: 50, num: 3, direction: 'right' },
      { x: 25, y: 80, num: 4, direction: 'right' }
    ]
  },
  '月': {
    character: '月',
    meaning: 'Moon / Month',
    meaningBn: 'চাঁদ / মাস',
    onyomi: ['GETSU', 'GATSU'],
    kunyomi: ['tsuki'],
    radical: '月',
    radicalName: 'Tsuki (Moon)',
    strokeCount: 4,
    strokes: [
      'M 30,15 C 28,45 25,75 18,85',
      'M 30,15 L 75,15 L 75,82 L 68,85',
      'M 30,40 L 75,40',
      'M 28,62 L 75,62'
    ],
    strokeStartPoints: [
      { x: 30, y: 15, num: 1, direction: 'down' },
      { x: 30, y: 15, num: 2, direction: 'right' },
      { x: 30, y: 40, num: 3, direction: 'right' },
      { x: 28, y: 62, num: 4, direction: 'right' }
    ]
  },
  '木': {
    character: '木',
    meaning: 'Tree / Wood',
    meaningBn: 'গাছ / কাঠ',
    onyomi: ['MOKU', 'BOKU'],
    kunyomi: ['ki', 'ko-'],
    radical: '木',
    radicalName: 'Ki (Tree)',
    strokeCount: 4,
    strokes: [
      'M 18,42 L 82,42',
      'M 50,15 L 50,85',
      'M 50,42 C 40,58 28,72 15,80',
      'M 50,42 C 60,58 72,72 85,80'
    ],
    strokeStartPoints: [
      { x: 18, y: 42, num: 1, direction: 'right' },
      { x: 50, y: 15, num: 2, direction: 'down' },
      { x: 50, y: 42, num: 3, direction: 'down-right' },
      { x: 50, y: 42, num: 4, direction: 'down-right' }
    ]
  },
  '本': {
    character: '本',
    meaning: 'Book / Origin',
    meaningBn: 'বই / মূল',
    onyomi: ['HON'],
    kunyomi: ['moto'],
    radical: '木',
    radicalName: 'Ki (Tree)',
    strokeCount: 5,
    strokes: [
      'M 18,38 L 82,38',
      'M 50,12 L 50,85',
      'M 50,38 C 40,55 28,70 15,78',
      'M 50,38 C 60,55 72,70 85,78',
      'M 28,68 L 72,68'
    ],
    strokeStartPoints: [
      { x: 18, y: 38, num: 1, direction: 'right' },
      { x: 50, y: 12, num: 2, direction: 'down' },
      { x: 50, y: 38, num: 3, direction: 'down-right' },
      { x: 50, y: 38, num: 4, direction: 'down-right' },
      { x: 28, y: 68, num: 5, direction: 'right' }
    ]
  },
  '人': {
    character: '人',
    meaning: 'Person / Human',
    meaningBn: 'মানুষ / ব্যক্তি',
    onyomi: ['JIN', 'NIN'],
    kunyomi: ['hito', '-ri'],
    radical: '人',
    radicalName: 'Hito (Person)',
    strokeCount: 2,
    strokes: [
      'M 50,15 C 45,45 32,70 15,85',
      'M 42,42 C 55,58 70,72 88,85'
    ],
    strokeStartPoints: [
      { x: 50, y: 15, num: 1, direction: 'down' },
      { x: 42, y: 42, num: 2, direction: 'down-right' }
    ]
  },
  '山': {
    character: '山',
    meaning: 'Mountain',
    meaningBn: 'পাহাড় / পর্বত',
    onyomi: ['SAN', 'ZAN'],
    kunyomi: ['yama'],
    radical: '山',
    radicalName: 'Yama (Mountain)',
    strokeCount: 3,
    strokes: [
      'M 50,15 L 50,85',
      'M 20,45 L 20,80 L 80,80',
      'M 80,45 L 80,80'
    ],
    strokeStartPoints: [
      { x: 50, y: 15, num: 1, direction: 'down' },
      { x: 20, y: 45, num: 2, direction: 'down' },
      { x: 80, y: 45, num: 3, direction: 'down' }
    ]
  },
  '川': {
    character: '川',
    meaning: 'River / Stream',
    meaningBn: 'নদী / স্রোতধারা',
    onyomi: ['SEN'],
    kunyomi: ['kawa', 'gawa'],
    radical: '川',
    radicalName: 'Kawa (River)',
    strokeCount: 3,
    strokes: [
      'M 25,25 C 25,50 20,70 15,80',
      'M 50,30 L 50,75',
      'M 75,18 L 75,85'
    ],
    strokeStartPoints: [
      { x: 25, y: 25, num: 1, direction: 'down' },
      { x: 50, y: 30, num: 2, direction: 'down' },
      { x: 75, y: 18, num: 3, direction: 'down' }
    ]
  },
  '田': {
    character: '田',
    meaning: 'Rice Field',
    meaningBn: 'ধানের ক্ষেত',
    onyomi: ['DEN'],
    kunyomi: ['ta'],
    radical: '田',
    radicalName: 'Ta (Rice field)',
    strokeCount: 5,
    strokes: [
      'M 22,20 L 22,80',
      'M 22,20 L 78,20 L 78,80',
      'M 50,20 L 50,80',
      'M 22,50 L 78,50',
      'M 22,80 L 78,80'
    ],
    strokeStartPoints: [
      { x: 22, y: 20, num: 1, direction: 'down' },
      { x: 22, y: 20, num: 2, direction: 'right' },
      { x: 50, y: 20, num: 3, direction: 'down' },
      { x: 22, y: 50, num: 4, direction: 'right' },
      { x: 22, y: 80, num: 5, direction: 'right' }
    ]
  },
  '学': {
    character: '学',
    meaning: 'Study / Learn',
    meaningBn: 'পড়াশোনা / শিক্ষা',
    onyomi: ['GAKU'],
    kunyomi: ['mana-bu'],
    radical: '子',
    radicalName: 'Ko (Child)',
    strokeCount: 8,
    strokes: [
      'M 30,15 L 35,25',
      'M 50,12 L 50,23',
      'M 70,15 L 65,25',
      'M 20,32 L 20,38 L 80,38 L 78,45',
      'M 42,42 L 58,42',
      'M 50,42 L 50,55',
      'M 32,58 L 68,58 L 48,78 C 65,75 75,80 75,88',
      'M 20,70 L 80,70'
    ],
    strokeStartPoints: [
      { x: 30, y: 15, num: 1, direction: 'down' },
      { x: 50, y: 12, num: 2, direction: 'down' },
      { x: 70, y: 15, num: 3, direction: 'down' },
      { x: 20, y: 32, num: 4, direction: 'right' },
      { x: 42, y: 42, num: 5, direction: 'right' },
      { x: 50, y: 42, num: 6, direction: 'down' },
      { x: 32, y: 58, num: 7, direction: 'right' },
      { x: 20, y: 70, num: 8, direction: 'right' }
    ]
  },
  '生': {
    character: '生',
    meaning: 'Life / Genuine / Birth',
    meaningBn: 'জীবন / জন্ম',
    onyomi: ['SEI', 'SHOU'],
    kunyomi: ['i-kiru', 'u-mareru', 'nama'],
    radical: '生',
    radicalName: 'Umare (Birth)',
    strokeCount: 5,
    strokes: [
      'M 35,20 C 30,30 25,40 18,48',
      'M 18,48 L 75,48',
      'M 50,20 L 50,85',
      'M 28,66 L 72,66',
      'M 12,85 L 88,85'
    ],
    strokeStartPoints: [
      { x: 35, y: 20, num: 1, direction: 'down' },
      { x: 18, y: 48, num: 2, direction: 'right' },
      { x: 50, y: 20, num: 3, direction: 'down' },
      { x: 28, y: 66, num: 4, direction: 'right' },
      { x: 12, y: 85, num: 5, direction: 'right' }
    ]
  },
  '先': {
    character: '先',
    meaning: 'Before / Ahead / Previous',
    meaningBn: 'পূর্বে / আগে',
    onyomi: ['SEN'],
    kunyomi: ['saki', 'ma-zu'],
    radical: '儿',
    radicalName: 'Hitoashi (Legs)',
    strokeCount: 6,
    strokes: [
      'M 45,15 C 38,25 30,35 22,40',
      'M 20,38 L 80,38',
      'M 50,20 L 50,55',
      'M 12,55 L 88,55',
      'M 42,55 C 38,70 30,82 15,88',
      'M 58,55 L 58,80 C 58,88 68,88 82,85'
    ],
    strokeStartPoints: [
      { x: 45, y: 15, num: 1, direction: 'down' },
      { x: 20, y: 38, num: 2, direction: 'right' },
      { x: 50, y: 20, num: 3, direction: 'down' },
      { x: 12, y: 55, num: 4, direction: 'right' },
      { x: 42, y: 55, num: 5, direction: 'down' },
      { x: 58, y: 55, num: 6, direction: 'down' }
    ]
  },
  '何': {
    character: '何',
    meaning: 'What / How many',
    meaningBn: 'কী / কত',
    onyomi: ['KA'],
    kunyomi: ['nani', 'nan'],
    radical: '亻',
    radicalName: 'Ninben (Person)',
    strokeCount: 7,
    strokes: [
      'M 30,15 C 25,30 20,45 12,58',
      'M 24,35 L 24,85',
      'M 38,32 L 88,32',
      'M 48,42 L 48,65',
      'M 48,42 L 78,42 L 78,65',
      'M 48,65 L 78,65',
      'M 75,32 L 75,82 C 75,88 70,88 62,85'
    ],
    strokeStartPoints: [
      { x: 30, y: 15, num: 1, direction: 'down' },
      { x: 24, y: 35, num: 2, direction: 'down' },
      { x: 38, y: 32, num: 3, direction: 'right' },
      { x: 48, y: 42, num: 4, direction: 'down' },
      { x: 48, y: 42, num: 5, direction: 'right' },
      { x: 48, y: 65, num: 6, direction: 'right' },
      { x: 75, y: 32, num: 7, direction: 'down' }
    ]
  }
};

// Fallback dynamic stroke generator for any unknown character
function getOrGenerateKanjiData(char: string, meaning = 'Kanji Character'): KanjiStrokeData {
  if (KANJI_STROKE_DATABASE[char]) {
    return KANJI_STROKE_DATABASE[char];
  }

  // Generative default stroke paths based on character box
  return {
    character: char,
    meaning: meaning || 'Japanese Character',
    onyomi: ['-'],
    kunyomi: ['-'],
    radical: char,
    radicalName: 'Standard Radical',
    strokeCount: 4,
    strokes: [
      'M 20,25 L 80,25',
      'M 50,15 L 50,85',
      'M 25,50 L 75,50',
      'M 20,85 L 80,85'
    ],
    strokeStartPoints: [
      { x: 20, y: 25, num: 1, direction: 'right' },
      { x: 50, y: 15, num: 2, direction: 'down' },
      { x: 25, y: 50, num: 3, direction: 'right' },
      { x: 20, y: 85, num: 4, direction: 'right' }
    ]
  };
}

interface KanjiStrokeAnimatorProps {
  character: string;
  meaning?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export const KanjiStrokeAnimator: React.FC<KanjiStrokeAnimatorProps> = ({
  character,
  meaning,
  onClose,
  isModal = false
}) => {
  const kanjiData = getOrGenerateKanjiData(character, meaning);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0); // 0.5x, 1.0x, 2.0x
  const [showGuideNumbers, setShowGuideNumbers] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [mode, setMode] = useState<'animate' | 'trace'>('animate');

  // Drawing Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnStrokesCount, setDrawnStrokesCount] = useState(0);

  // Auto-play animation timer
  useEffect(() => {
    if (!isPlaying || mode !== 'animate') return;

    const intervalTime = 1200 / speed;
    const timer = setInterval(() => {
      setCurrentStrokeIndex((prev) => {
        if (prev >= kanjiData.strokes.length) {
          return 0; // loop back
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, speed, mode, kanjiData.strokes.length]);

  // Handle Canvas Drawing for Trace Mode
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (mode !== 'trace') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#dc2626'; // Nihomi red
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || mode !== 'trace') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setDrawnStrokesCount((prev) => prev + 1);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawnStrokesCount(0);
  };

  const content = (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 text-stone-900 dark:text-white max-w-xl w-full">
      {/* Header Info */}
      <div className="flex items-start justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 font-bold text-[10px] uppercase font-mono">
              Stroke Order • 書き順 (Kakijun)
            </span>
            <span className="text-xs text-stone-500 font-mono">
              {kanjiData.strokeCount} Strokes
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <h3 className="text-2xl font-bold font-serif text-stone-900 dark:text-white">
              {kanjiData.character}
            </h3>
            <span className="text-sm font-semibold text-stone-600 dark:text-stone-300">
              {kanjiData.meaning}
            </span>
            {kanjiData.meaningBn && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                ({kanjiData.meaningBn})
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => speakJapanese(kanjiData.character)}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-red-50 text-stone-600 hover:text-red-600 transition cursor-pointer"
            title="Listen Pronunciation"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-between bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl text-xs font-bold">
        <button
          onClick={() => {
            setMode('animate');
            setIsPlaying(true);
          }}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === 'animate'
              ? 'bg-white dark:bg-stone-900 text-red-600 dark:text-red-400 shadow-xs'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Animated Stroke Order</span>
        </button>

        <button
          onClick={() => {
            setMode('trace');
            setIsPlaying(false);
          }}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === 'trace'
              ? 'bg-white dark:bg-stone-900 text-red-600 dark:text-red-400 shadow-xs'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Trace & Practice</span>
        </button>
      </div>

      {/* Main Canvas & SVG Viewer */}
      <div className="relative w-full aspect-square max-w-[320px] mx-auto bg-stone-50 dark:bg-stone-950 rounded-3xl border-2 border-stone-200 dark:border-stone-800 overflow-hidden shadow-inner flex items-center justify-center">
        
        {/* Japanese 4-Quadrant Rice Grid (米) */}
        {showGrid && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25">
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeDasharray="2 4" strokeWidth="0.5" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeDasharray="2 4" strokeWidth="0.5" />
          </svg>
        )}

        {/* Faint Background Reference Character (when tracing) */}
        {mode === 'trace' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-20 text-[180px] font-serif font-bold text-stone-400">
            {kanjiData.character}
          </div>
        )}

        {/* Animated Vector SVG Strokes */}
        {mode === 'animate' && (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full p-6 select-none"
            style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
          >
            {/* Background Completed Ghost Strokes */}
            {kanjiData.strokes.map((path, idx) => (
              <path
                key={`ghost-${idx}`}
                d={path}
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-stone-200 dark:text-stone-800"
              />
            ))}

            {/* Active Rendered Strokes up to currentStrokeIndex */}
            {kanjiData.strokes.slice(0, currentStrokeIndex).map((path, idx) => {
              const isLatest = idx === currentStrokeIndex - 1;
              return (
                <path
                  key={`stroke-${idx}`}
                  d={path}
                  fill="none"
                  stroke={isLatest ? '#dc2626' : '#1c1917'}
                  strokeWidth="8"
                  className={isLatest ? 'text-red-600 animate-pulse' : 'dark:stroke-stone-100'}
                />
              );
            })}

            {/* Number Guide Markers */}
            {showGuideNumbers &&
              kanjiData.strokeStartPoints?.map((pt, idx) => {
                const isCurrent = idx === currentStrokeIndex;
                const isDone = idx < currentStrokeIndex;

                return (
                  <g key={`num-${idx}`} transform={`translate(${pt.x}, ${pt.y})`}>
                    <circle
                      r="4.5"
                      fill={isCurrent ? '#dc2626' : isDone ? '#16a34a' : '#78716c'}
                      className="transition-colors duration-300"
                    />
                    <text
                      textAnchor="middle"
                      dy="2.5"
                      fill="#ffffff"
                      fontSize="5"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {pt.num}
                    </text>
                  </g>
                );
              })}
          </svg>
        )}

        {/* Freehand Trace Canvas */}
        {mode === 'trace' && (
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          />
        )}

        {/* Stroke Progress Badge Overlay */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 text-[10px] font-mono font-bold shadow-xs">
          {mode === 'animate' ? (
            <span>
              Stroke {Math.min(currentStrokeIndex, kanjiData.strokes.length)} / {kanjiData.strokes.length}
            </span>
          ) : (
            <span className="text-red-600 dark:text-red-400">
              {drawnStrokesCount} strokes drawn
            </span>
          )}
        </div>
      </div>

      {/* Animation Controls Bar */}
      {mode === 'animate' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Play / Step Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStrokeIndex((prev) => Math.max(0, prev - 1));
              }}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 text-xs font-bold transition cursor-pointer"
              title="Step Backward"
            >
              <Rewind className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStrokeIndex((prev) => Math.min(kanjiData.strokes.length, prev + 1));
              }}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 text-xs font-bold transition cursor-pointer"
              title="Step Forward"
            >
              <FastForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setCurrentStrokeIndex(0);
                setIsPlaying(true);
              }}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 text-xs font-bold transition cursor-pointer"
              title="Reset Animation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Selector & Toggle Switches */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl">
              {[0.5, 1.0, 2.0].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer ${
                    speed === s
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowGuideNumbers(!showGuideNumbers)}
              className={`px-2.5 py-1 rounded-xl border text-[10px] font-bold font-mono transition cursor-pointer ${
                showGuideNumbers
                  ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-stone-100 text-stone-500 border-stone-200 dark:bg-stone-800'
              }`}
            >
              ① Numbers: {showGuideNumbers ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {/* Trace Controls Bar */}
      {mode === 'trace' && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-stone-500">
            Trace the character strokes in correct order from top to bottom.
          </p>

          <button
            onClick={clearCanvas}
            className="px-3.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-red-50 hover:text-red-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Clear Canvas</span>
          </button>
        </div>
      )}

      {/* Radical & Readings Summary Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
        <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
          <span className="text-[10px] font-bold text-stone-400 font-mono block">Radical (部首)</span>
          <span className="font-bold text-stone-900 dark:text-white font-serif">{kanjiData.radical}</span>
          <span className="text-[10px] text-stone-500 block truncate">{kanjiData.radicalName}</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
          <span className="text-[10px] font-bold text-stone-400 font-mono block">Onyomi (音読み)</span>
          <span className="font-bold text-red-600 dark:text-red-400 font-mono text-xs">{kanjiData.onyomi.join(', ')}</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-stone-400 font-mono block">Kunyomi (訓読み)</span>
          <span className="font-bold text-stone-800 dark:text-stone-200 font-japanese text-xs">{kanjiData.kunyomi.join(', ')}</span>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div
        id="kanji-stroke-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
        onClick={onClose}
      >
        <div onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return content;
};
