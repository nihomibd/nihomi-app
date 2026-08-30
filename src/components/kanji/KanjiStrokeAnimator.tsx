import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
  Layers,
  Award,
  PenTool,
  CheckCircle2,
  Maximize2,
  Eye,
  Zap,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getKanjiStrokeInfo, KanjiStrokeInfo } from '../../data/kanjiStrokeData';
import { speakJapanese } from '../../lib/tts';

interface KanjiStrokeAnimatorProps {
  kanji: string;
  fallbackData?: {
    onyomi?: string[];
    kunyomi?: string[];
    meaningEnglish?: string;
    meaningBengali?: string;
    strokeCount?: number;
  };
  onClose?: () => void;
  inline?: boolean;
}

export const KanjiStrokeAnimator: React.FC<KanjiStrokeAnimatorProps> = ({
  kanji,
  fallbackData,
  onClose,
  inline = false
}) => {
  const strokeInfo: KanjiStrokeInfo = getKanjiStrokeInfo(kanji, fallbackData);

  const [currentStep, setCurrentStep] = useState<number>(strokeInfo.strokes.length);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5, 1, 1.5
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showNumbers, setShowNumbers] = useState<boolean>(true);
  const [showGhost, setShowGhost] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'animator' | 'practice'>('animator');
  const [userDrawingPaths, setUserDrawingPaths] = useState<{ x: number; y: number }[][]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const timerRef = useRef<any>(null);
  const canvasRef = useRef<SVGSVGElement | null>(null);

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      const delay = (1200 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= strokeInfo.strokes.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, strokeInfo.strokes.length]);

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentStep >= strokeInfo.strokes.length) {
        setCurrentStep(1);
      }
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(1);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(strokeInfo.strokes.length, prev + 1));
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleAudioPlay = (text: string) => {
    speakJapanese(text);
  };

  // Practice Canvas drawing handlers
  const handleStartDraw = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (activeTab !== 'practice' || !canvasRef.current) return;
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setUserDrawingPaths((prev) => [...prev, [{ x, y }]]);
  };

  const handleMoveDraw = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!isDrawing || activeTab !== 'practice' || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    setUserDrawingPaths((prev) => {
      if (prev.length === 0) return [[{ x, y }]];
      const updated = [...prev];
      updated[updated.length - 1] = [...updated[updated.length - 1], { x, y }];
      return updated;
    });
  };

  const handleEndDraw = () => {
    setIsDrawing(false);
  };

  const handleClearDraw = () => {
    setUserDrawingPaths([]);
  };

  return (
    <div
      className={`rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/95 sepia:bg-[#f6ebd4] p-5 sm:p-6 shadow-xl space-y-6 ${
        inline ? 'w-full' : 'max-w-2xl mx-auto'
      }`}
    >
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center text-2xl font-black font-japanese shadow-md">
            {kanji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-stone-950 dark:text-white">
                {kanji} Stroke Order Guide
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                {strokeInfo.strokeCount} Strokes (画)
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              <span className="font-semibold text-stone-700 dark:text-stone-300">{strokeInfo.meaningEn}</span> •{' '}
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">{strokeInfo.meaningBn}</span>
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-stone-100 dark:bg-stone-800 p-1 border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setActiveTab('animator')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'animator'
                  ? 'bg-white dark:bg-stone-900 text-red-600 dark:text-red-400 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Animated</span>
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'practice'
                  ? 'bg-white dark:bg-stone-900 text-red-600 dark:text-red-400 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Draw & Trace</span>
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. Interactive Japanese Tianzige Grid (田字格) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Visual Stage (Left) */}
        <div className="md:col-span-6 flex flex-col items-center justify-center space-y-3">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-amber-50/40 dark:bg-stone-950 border-2 border-stone-300 dark:border-stone-700 overflow-hidden shadow-inner flex items-center justify-center select-none">
            {/* Japanese Traditional 4-Quadrant Guidelines (田字格) */}
            {showGrid && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                {/* Horizontal Center Line */}
                <line x1="0" y1="50" x2="100" y2="50" stroke="#ef4444" strokeWidth="0.6" strokeDasharray="2,2" />
                {/* Vertical Center Line */}
                <line x1="50" y1="0" x2="50" y2="100" stroke="#ef4444" strokeWidth="0.6" strokeDasharray="2,2" />
                {/* Diagonal Guidelines */}
                <line x1="0" y1="0" x2="100" y2="100" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="3,3" />
                <line x1="100" y1="0" x2="0" y2="100" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="3,3" />
              </svg>
            )}

            {/* Background Ghost Template */}
            {showGhost && (
              <span className="absolute inset-0 flex items-center justify-center text-8xl sm:text-9xl font-black font-japanese text-stone-200/50 dark:text-stone-800/60 pointer-events-none select-none">
                {kanji}
              </span>
            )}

            {/* SVG Vector Stroke Renderer */}
            <svg
              ref={canvasRef}
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
              onMouseDown={handleStartDraw}
              onMouseMove={handleMoveDraw}
              onMouseUp={handleEndDraw}
              onTouchStart={handleStartDraw}
              onTouchMove={handleMoveDraw}
              onTouchEnd={handleEndDraw}
            >
              {/* Render Completed & Active Strokes */}
              {activeTab === 'animator' &&
                strokeInfo.strokes.slice(0, currentStep).map((stroke, index) => {
                  const isLatest = index === currentStep - 1;
                  return (
                    <g key={stroke.strokeNumber}>
                      {/* Stroke Path Line */}
                      <motion.path
                        d={stroke.path}
                        fill="none"
                        stroke={isLatest ? '#dc2626' : '#1e293b'}
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="dark:stroke-stone-200"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6 / playbackSpeed, ease: 'easeInOut' }}
                      />

                      {/* Numbered Indicator Bubble */}
                      {showNumbers && (
                        <g>
                          <circle
                            cx={stroke.startPoint.x}
                            cy={stroke.startPoint.y}
                            r="4.5"
                            fill={isLatest ? '#ef4444' : '#64748b'}
                            className="shadow-sm"
                          />
                          <text
                            x={stroke.startPoint.x}
                            y={stroke.startPoint.y + 1.5}
                            fill="#ffffff"
                            fontSize="4"
                            fontWeight="bold"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                          >
                            {stroke.strokeNumber}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

              {/* Freehand User Traced Paths */}
              {activeTab === 'practice' &&
                userDrawingPaths.map((pathPts, idx) => {
                  if (pathPts.length < 2) return null;
                  const d = `M ${pathPts[0].x} ${pathPts[0].y} ` + pathPts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
                  return (
                    <path
                      key={idx}
                      d={d}
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  );
                })}
            </svg>

            {/* Current Stroke Label Overlay */}
            {activeTab === 'animator' && (
              <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-stone-900/80 text-white rounded-lg text-[10px] font-mono font-bold backdrop-blur-xs flex items-center gap-1.5">
                <span>Stroke {currentStep} of {strokeInfo.strokes.length}</span>
              </div>
            )}
          </div>

          {/* Grid & Visibility Utility Toggles */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
                showGrid
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-transparent'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setShowNumbers(!showNumbers)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
                showNumbers
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-transparent'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700'
              }`}
            >
              Numbers
            </button>
            <button
              onClick={() => setShowGhost(!showGhost)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
                showGhost
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-transparent'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700'
              }`}
            >
              Ghost
            </button>
            {activeTab === 'practice' && (
              <button
                onClick={handleClearDraw}
                className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-[11px] font-bold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Playback Controls & Stroke Details (Right) */}
        <div className="md:col-span-6 space-y-4 text-left">
          {/* Animator Playback Bar */}
          {activeTab === 'animator' ? (
            <div className="p-4 rounded-2xl bg-stone-100/70 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Step Controller
                </span>
                {/* Speed selector */}
                <div className="flex items-center gap-1">
                  {[0.5, 1, 1.5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        playbackSpeed === spd
                          ? 'bg-red-600 text-white'
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="1"
                  max={strokeInfo.strokes.length}
                  value={currentStep}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setCurrentStep(parseInt(e.target.value, 10));
                  }}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>Stroke 1</span>
                  <span>Stroke {strokeInfo.strokes.length}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={handleStepBackward}
                  disabled={currentStep <= 1}
                  className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 disabled:opacity-40 cursor-pointer"
                  title="Previous Stroke"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handlePlayToggle}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>{currentStep >= strokeInfo.strokes.length ? 'Replay' : 'Play'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleStepForward}
                  disabled={currentStep >= strokeInfo.strokes.length}
                  className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 disabled:opacity-40 cursor-pointer"
                  title="Next Stroke"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 cursor-pointer"
                  title="Reset to Stroke 1"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                <PenTool className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Tracing & Muscle Memory Mode</span>
              </div>
              <p className="text-xs text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed">
                Use your finger or mouse to trace the strokes of 「{kanji}」 over the Tianzige grid guidelines. Pay close attention to starting dots and release direction.
              </p>
            </div>
          )}

          {/* Stroke Instruction Description */}
          {strokeInfo.strokes[currentStep - 1] && (
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Active Stroke #{currentStep} • {strokeInfo.strokes[currentStep - 1].type}
              </span>
              <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                {strokeInfo.strokes[currentStep - 1].descriptionEn}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {strokeInfo.strokes[currentStep - 1].descriptionBn}
              </p>
            </div>
          )}

          {/* Readings & Radical Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Onyomi */}
            <div className="p-3 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Onyomi (音読み)</span>
                <button
                  onClick={() => handleAudioPlay(strokeInfo.onyomi[0] || kanji)}
                  className="text-stone-400 hover:text-red-500 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="font-bold text-stone-900 dark:text-white font-japanese">
                {strokeInfo.onyomi.join(', ') || '-'}
              </p>
            </div>

            {/* Kunyomi */}
            <div className="p-3 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Kunyomi (訓読み)</span>
                <button
                  onClick={() => handleAudioPlay(strokeInfo.kunyomi[0] || kanji)}
                  className="text-stone-400 hover:text-red-500 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="font-bold text-stone-900 dark:text-white font-japanese">
                {strokeInfo.kunyomi.join(', ') || '-'}
              </p>
            </div>
          </div>

          {/* Writing Tip */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-start gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-stone-800 dark:text-stone-200">
              <p className="font-semibold">{strokeInfo.writingTipEn}</p>
              <p className="text-stone-600 dark:text-stone-400 text-[11px]">{strokeInfo.writingTipBn}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
