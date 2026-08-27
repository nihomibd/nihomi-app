import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  Brush,
  Eraser,
  CheckCircle2,
  Sparkles,
  Info,
  Layers,
  Search,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { speakJapanese } from '../../lib/tts';

export interface KanjiStrokeData {
  kanji: string;
  meaningEn: string;
  meaningBn: string;
  onyomi: string[];
  kunyomi: string[];
  jlptLevel: string;
  radical: string;
  radicalName: string;
  totalStrokes: number;
  strokePaths: {
    path: string;
    startPoint: [number, number];
    labelPoint?: [number, number];
    directionDescription?: string;
  }[];
  compounds: {
    word: string;
    reading: string;
    meaning: string;
  }[];
}

// Built-in vector stroke definitions for essential Kanji
const KANJI_DICTIONARY: Record<string, KanjiStrokeData> = {
  '日': {
    kanji: '日',
    meaningEn: 'Sun, Day, Japan',
    meaningBn: 'সূর্য, দিন, জাপান',
    onyomi: ['ニチ (nichi)', 'ジツ (jitsu)'],
    kunyomi: ['ひ (hi)', '-び (-bi)', '-か (-ka)'],
    jlptLevel: 'N5',
    radical: '日 (sun)',
    radicalName: 'ひへん (hihen)',
    totalStrokes: 4,
    strokePaths: [
      { path: 'M 25 20 L 25 80', startPoint: [25, 20], directionDescription: 'Vertical down stroke' },
      { path: 'M 25 20 L 75 20 L 75 80', startPoint: [25, 20], directionDescription: 'Horizontal right then sharp vertical down' },
      { path: 'M 25 50 L 75 50', startPoint: [25, 50], directionDescription: 'Horizontal middle bar' },
      { path: 'M 25 80 L 75 80', startPoint: [25, 80], directionDescription: 'Horizontal bottom seal' }
    ],
    compounds: [
      { word: '日本', reading: 'にほん (Nihon)', meaning: 'Japan' },
      { word: '今日', reading: 'きょう (Kyou)', meaning: 'Today' },
      { word: '日曜日', reading: 'にちようび (Nichiyoubi)', meaning: 'Sunday' }
    ]
  },
  '月': {
    kanji: '月',
    meaningEn: 'Moon, Month',
    meaningBn: 'চাঁদ, মাস',
    onyomi: ['ゲツ (getsu)', 'ガツ (gatsu)'],
    kunyomi: ['つき (tsuki)'],
    jlptLevel: 'N5',
    radical: '月 (moon)',
    radicalName: 'つき (tsuki)',
    totalStrokes: 4,
    strokePaths: [
      { path: 'M 30 18 Q 28 55 20 85', startPoint: [30, 18], directionDescription: 'Left sweeping vertical curve' },
      { path: 'M 30 20 L 75 20 L 75 82 Q 73 88 65 85', startPoint: [30, 20], directionDescription: 'Right vertical with inward hook' },
      { path: 'M 30 42 L 75 42', startPoint: [30, 42], directionDescription: 'Upper horizontal crossbar' },
      { path: 'M 30 62 L 75 62', startPoint: [30, 62], directionDescription: 'Lower horizontal crossbar' }
    ],
    compounds: [
      { word: '今月', reading: 'こんげつ (Kongetsu)', meaning: 'This month' },
      { word: '月曜日', reading: 'げつようび (Getsuyoubi)', meaning: 'Monday' },
      { word: '満月', reading: 'まんげつ (Mangetsu)', meaning: 'Full moon' }
    ]
  },
  '木': {
    kanji: '木',
    meaningEn: 'Tree, Wood',
    meaningBn: 'গাছ, কাঠ',
    onyomi: ['ボク (boku)', 'モク (moku)'],
    kunyomi: ['き (ki)', 'こ- (ko-)'],
    jlptLevel: 'N5',
    radical: '木 (tree)',
    radicalName: 'きへん (kihen)',
    totalStrokes: 4,
    strokePaths: [
      { path: 'M 18 36 L 82 36', startPoint: [18, 36], directionDescription: 'Horizontal crossbar' },
      { path: 'M 50 14 L 50 88', startPoint: [50, 14], directionDescription: 'Central vertical pillar with slight hook' },
      { path: 'M 50 36 Q 32 58 18 78', startPoint: [50, 36], directionDescription: 'Left diagonal falling branch' },
      { path: 'M 50 36 Q 68 58 82 78', startPoint: [50, 36], directionDescription: 'Right diagonal falling branch' }
    ],
    compounds: [
      { word: '木曜日', reading: 'もくようび (Mokuyoubi)', meaning: 'Thursday' },
      { word: '大木', reading: 'たいぼく (Taiboku)', meaning: 'Large majestic tree' }
    ]
  },
  '水': {
    kanji: '水',
    meaningEn: 'Water',
    meaningBn: 'পানি / জল',
    onyomi: ['スイ (sui)'],
    kunyomi: ['みず (mizu)'],
    jlptLevel: 'N5',
    radical: '水 (water)',
    radicalName: 'みず (mizu)',
    totalStrokes: 4,
    strokePaths: [
      { path: 'M 50 14 L 50 86 Q 48 90 42 85', startPoint: [50, 14], directionDescription: 'Central vertical hook' },
      { path: 'M 35 34 L 20 44 L 38 60', startPoint: [35, 34], directionDescription: 'Left folding stroke' },
      { path: 'M 78 28 L 52 50', startPoint: [78, 28], directionDescription: 'Right downward short slant' },
      { path: 'M 52 50 Q 68 68 84 84', startPoint: [52, 50], directionDescription: 'Right sweeping tail' }
    ],
    compounds: [
      { word: '水曜日', reading: 'すいようび (Suiyoubi)', meaning: 'Wednesday' },
      { word: 'お水', reading: 'おみず (Omizu)', meaning: 'Water (polite)' },
      { word: '水泳', reading: 'すいえい (Suiei)', meaning: 'Swimming' }
    ]
  },
  '人': {
    kanji: '人',
    meaningEn: 'Person, Human',
    meaningBn: 'মানুষ, ব্যক্তি',
    onyomi: ['ジン (jin)', 'ニン (nin)'],
    kunyomi: ['ひと (hito)'],
    jlptLevel: 'N5',
    radical: '人 (human)',
    radicalName: 'ひと (hito)',
    totalStrokes: 2,
    strokePaths: [
      { path: 'M 50 15 Q 40 55 18 85', startPoint: [50, 15], directionDescription: 'Left sweeping diagonal' },
      { path: 'M 42 45 Q 60 65 82 85', startPoint: [42, 45], directionDescription: 'Right supporting leg' }
    ],
    compounds: [
      { word: '日本人', reading: 'にほんじん (Nihonjin)', meaning: 'Japanese person' },
      { word: '三人', reading: 'さんにん (Sannin)', meaning: 'Three people' }
    ]
  },
  '学': {
    kanji: '学',
    meaningEn: 'Study, Learning, Science',
    meaningBn: 'শিক্ষা, পড়াশোনা',
    onyomi: ['ガク (gaku)'],
    kunyomi: ['まな・ぶ (mana-bu)'],
    jlptLevel: 'N5',
    radical: '子 (child)',
    radicalName: 'こ (ko)',
    totalStrokes: 8,
    strokePaths: [
      { path: 'M 30 15 L 25 28', startPoint: [30, 15], directionDescription: 'Top left dot' },
      { path: 'M 50 12 L 50 26', startPoint: [50, 12], directionDescription: 'Top center dot' },
      { path: 'M 70 15 L 75 28', startPoint: [70, 15], directionDescription: 'Top right dot' },
      { path: 'M 20 32 L 20 40 L 80 40 L 80 45 Q 78 48 70 45', startPoint: [20, 32], directionDescription: 'Crown roof radical' },
      { path: 'M 35 52 L 65 52 L 40 72', startPoint: [35, 52], directionDescription: 'Child radical top horizontal and slant' },
      { path: 'M 40 72 Q 65 72 65 86 Q 62 90 52 88', startPoint: [40, 72], directionDescription: 'Child hook stroke' },
      { path: 'M 25 65 L 75 65', startPoint: [25, 65], directionDescription: 'Child bottom crossbar' },
      { path: 'M 48 52 L 48 88', startPoint: [48, 52], directionDescription: 'Child stabilizing center' }
    ],
    compounds: [
      { word: '学生', reading: 'がくせい (Gakusei)', meaning: 'Student' },
      { word: '学校', reading: 'がっこう (Gakkou)', meaning: 'School' },
      { word: '大学', reading: 'だいがく (Daigaku)', meaning: 'University' }
    ]
  }
};

interface KanjiStrokeVisualizerProps {
  initialKanji?: string;
  onKanjiSelect?: (kanji: string) => void;
}

export const KanjiStrokeVisualizer: React.FC<KanjiStrokeVisualizerProps> = ({
  initialKanji = '日',
  onKanjiSelect
}) => {
  const [selectedKanji, setSelectedKanji] = useState<string>(initialKanji);
  const [activeStrokeIndex, setActiveStrokeIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 0.5, 1, 1.5, 2
  const [isTracingMode, setIsTracingMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const currentData = KANJI_DICTIONARY[selectedKanji] || KANJI_DICTIONARY['日'];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Auto-play stroke sequence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const intervalMs = Math.round(1200 / speed);
      timer = setInterval(() => {
        setActiveStrokeIndex((prev) => {
          if (prev >= currentData.strokePaths.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, currentData]);

  // Reset active stroke when changing kanji
  useEffect(() => {
    setActiveStrokeIndex(currentData.strokePaths.length - 1);
    setIsPlaying(false);
    clearCanvas();
  }, [selectedKanji]);

  // Freehand Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

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
    ctx.strokeStyle = '#DC2626'; // Deep crimson ink
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
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

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
    setHasDrawn(false);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setActiveStrokeIndex((prev) => Math.min(currentData.strokePaths.length - 1, prev + 1));
  };

  const handleStepBack = () => {
    setIsPlaying(false);
    setActiveStrokeIndex((prev) => Math.max(0, prev - 1));
  };

  const handleReplay = () => {
    setActiveStrokeIndex(0);
    setIsPlaying(true);
  };

  const handleSelectKanji = (k: string) => {
    setSelectedKanji(k);
    if (onKanjiSelect) onKanjiSelect(k);
  };

  const filteredKanjiList = Object.keys(KANJI_DICTIONARY).filter((k) => {
    if (!searchTerm) return true;
    const item = KANJI_DICTIONARY[k];
    return (
      item.kanji.includes(searchTerm) ||
      item.meaningEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaningBn.includes(searchTerm) ||
      item.onyomi.some((o) => o.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div
      id="kanji-stroke-visualizer-container"
      className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-stone-900"
    >
      {/* Top Header & Character Quick Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="flex items-center space-x-3">
          <span className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-serif font-bold text-lg border border-red-200">
            書
          </span>
          <div>
            <h3 className="text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
              <span>Kanji Stroke Order Visualizer (書き順)</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-200">
                JLPT {currentData.jlptLevel}
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Interactive vector stroke animations, sequential step tracing, and traditional calligraphy practice
            </p>
          </div>
        </div>

        {/* Kanji Switcher Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filteredKanjiList.map((k) => (
            <button
              key={k}
              onClick={() => handleSelectKanji(k)}
              className={`w-9 h-9 rounded-xl font-serif text-base font-bold transition-all flex items-center justify-center shrink-0 ${
                selectedKanji === k
                  ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-600 ring-offset-2'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid: Left SVG Canvas & Tracing / Right Linguistic Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visualizer Stage & Controller (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Stage (280x280 rice-grid box) */}
          <div className="relative w-full aspect-square max-w-[340px] mx-auto bg-[#FCFBF8] rounded-3xl border-2 border-stone-300 p-4 shadow-inner flex items-center justify-center overflow-hidden">
            {/* Traditional 4-Quadrant Rice Grid (米字格) Guide Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
              viewBox="0 0 100 100"
            >
              {/* Horizontal line */}
              <line x1="0" y1="50" x2="100" y2="50" stroke="#DC2626" strokeWidth="0.8" strokeDasharray="2,2" />
              {/* Vertical line */}
              <line x1="50" y1="0" x2="50" y2="100" stroke="#DC2626" strokeWidth="0.8" strokeDasharray="2,2" />
              {/* Diagonals */}
              <line x1="0" y1="0" x2="100" y2="100" stroke="#DC2626" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="100" y1="0" x2="0" y2="100" stroke="#DC2626" strokeWidth="0.5" strokeDasharray="3,3" />
            </svg>

            {/* Background Watermark Faint Outline of the Whole Kanji */}
            <svg className="w-full h-full max-w-[260px] max-h-[260px] opacity-15" viewBox="0 0 100 100">
              {currentData.strokePaths.map((s, idx) => (
                <path
                  key={`bg-${idx}`}
                  d={s.path}
                  fill="none"
                  stroke="#1A1A1A"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </svg>

            {/* Active Rendered Animated Strokes */}
            <svg
              className="absolute inset-0 w-full h-full max-w-[260px] max-h-[260px] m-auto pointer-events-none z-10"
              viewBox="0 0 100 100"
            >
              {currentData.strokePaths.map((s, idx) => {
                const isDrawn = idx <= activeStrokeIndex;
                const isCurrent = idx === activeStrokeIndex;

                if (!isDrawn) return null;

                return (
                  <g key={`stroke-${idx}`}>
                    <path
                      d={s.path}
                      fill="none"
                      stroke={isCurrent ? '#DC2626' : '#1C1917'}
                      strokeWidth={isCurrent ? '11' : '10'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={isCurrent ? 'transition-all duration-300' : ''}
                    />

                    {/* Start point badge for active/highlighted strokes */}
                    {isCurrent && (
                      <g>
                        <circle
                          cx={s.startPoint[0]}
                          cy={s.startPoint[1]}
                          r="4.5"
                          fill="#DC2626"
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />
                        <text
                          x={s.startPoint[0]}
                          y={s.startPoint[1] + 2}
                          fontSize="5"
                          fontWeight="bold"
                          fill="#FFFFFF"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {idx + 1}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Interactive Freehand Tracing Canvas Layer */}
            {isTracingMode && (
              <canvas
                ref={canvasRef}
                width={340}
                height={340}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="absolute inset-0 w-full h-full cursor-crosshair z-20 touch-none"
              />
            )}

            {/* Stroke count pill indicator */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs border border-stone-200 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold text-stone-700 shadow-xs z-30">
              Stroke {activeStrokeIndex + 1} of {currentData.totalStrokes}
            </div>

            {/* Mode badge */}
            <div className="absolute top-3 right-3 z-30">
              {isTracingMode ? (
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold flex items-center gap-1">
                  <Brush className="w-3 h-3" /> Tracing Active
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200 text-[10px] font-bold">
                  Vector Mode
                </span>
              )}
            </div>
          </div>

          {/* Interactive Playback Control Bar */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Play / Step Controls */}
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={handleStepBack}
                  disabled={activeStrokeIndex === 0}
                  className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 disabled:opacity-40 transition shadow-xs"
                  title="Previous Stroke"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-xs"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Order</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleStepForward}
                  disabled={activeStrokeIndex === currentData.strokePaths.length - 1}
                  className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 disabled:opacity-40 transition shadow-xs"
                  title="Next Stroke"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleReplay}
                  className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 transition shadow-xs"
                  title="Restart Animation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Tracing Toggle & Canvas Clear */}
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setIsTracingMode(!isTracingMode)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center space-x-1.5 shadow-xs ${
                    isTracingMode
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Brush className="w-3.5 h-3.5" />
                  <span>{isTracingMode ? 'Exit Tracing' : 'Trace Freehand'}</span>
                </button>

                {isTracingMode && (
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="p-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-600 transition shadow-xs"
                    title="Clear Canvas"
                  >
                    <Eraser className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Speed Multiplier & Step Progress Slider */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-200/60">
              <div className="flex items-center space-x-1">
                <span className="text-[11px] text-stone-500 font-semibold">Speed:</span>
                {[0.5, 1, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition ${
                      speed === s
                        ? 'bg-stone-900 text-white'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-stone-500 font-sans">
                {currentData.strokePaths[activeStrokeIndex]?.directionDescription || 'Follow stroke direction'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Linguistic Character Breakdown & Compounds (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Hero Character Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-3xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-4xl sm:text-5xl font-serif font-bold text-stone-900">
                  {currentData.kanji}
                </span>
                <p className="text-base font-bold text-red-600 mt-1">{currentData.meaningEn}</p>
                <p className="text-xs text-stone-600 font-sans">{currentData.meaningBn}</p>
              </div>

              <button
                type="button"
                onClick={() => speakJapanese(currentData.kanji)}
                className="p-2.5 rounded-2xl bg-white border border-stone-200 hover:bg-red-50 text-stone-600 hover:text-red-600 transition shadow-xs"
                title="Pronounce Character"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Readings Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-white rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 font-mono block">
                  音読み (On'yomi)
                </span>
                <p className="font-bold text-stone-900 font-serif">
                  {currentData.onyomi.join(', ')}
                </p>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 font-mono block">
                  訓読み (Kun'yomi)
                </span>
                <p className="font-bold text-stone-900 font-serif">
                  {currentData.kunyomi.join(', ')}
                </p>
              </div>
            </div>

            {/* Radical & Stroke Meta */}
            <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-stone-400 font-semibold block">部首 (Radical)</span>
                <span className="font-bold text-stone-800">{currentData.radical}</span>
                <span className="text-[10px] text-stone-500 ml-1">({currentData.radicalName})</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 font-semibold block">Total Strokes</span>
                <span className="font-mono font-bold text-stone-900">{currentData.totalStrokes} 画</span>
              </div>
            </div>
          </div>

          {/* High-Frequency Compound Words (Jukugo 熟語) */}
          <div className="bg-stone-50 border border-stone-200 rounded-3xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5 font-mono">
              <BookOpen className="w-3.5 h-3.5 text-red-600" />
              <span>Essential Compound Words (熟語)</span>
            </h4>

            <div className="space-y-2">
              {currentData.compounds.map((cmp, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-2xl bg-white border border-stone-200/80 flex items-center justify-between hover:border-red-300 transition"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold font-serif text-stone-900">{cmp.word}</span>
                      <span className="text-xs text-stone-500 font-mono">{cmp.reading}</span>
                    </div>
                    <p className="text-[11px] text-stone-600">{cmp.meaning}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => speakJapanese(cmp.word)}
                    className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
