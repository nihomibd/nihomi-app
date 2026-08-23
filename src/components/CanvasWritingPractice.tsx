import React, { useRef, useState, useEffect } from 'react';
import {
  RotateCcw,
  Volume2,
  Trash2,
  CheckCircle2,
  Sparkles,
  Palette,
  Eye,
  EyeOff,
  Layers,
  HelpCircle
} from 'lucide-react';
import { speakJapanese } from '../lib/tts.js';

interface CanvasWritingPracticeProps {
  initialCharacter?: string;
  characterList?: { char: string; reading?: string; meaning?: string; strokes?: number }[];
  onCompletePractice?: (char: string) => void;
}

const DEFAULT_CHARACTERS = [
  { char: '日', reading: 'ひ / にち', meaning: 'Sun / Day', strokes: 4 },
  { char: '本', reading: 'ほん', meaning: 'Book / Origin', strokes: 5 },
  { char: '語', reading: 'ご', meaning: 'Language', strokes: 14 },
  { char: '学', reading: 'がく', meaning: 'Study / Learn', strokes: 8 },
  { char: '生', reading: 'せい / なま', meaning: 'Life / Student', strokes: 5 },
  { char: '先', reading: 'せん', meaning: 'Previous / Ahead', strokes: 6 },
  { char: '私', reading: 'わたし', meaning: 'I / Me', strokes: 7 },
  { char: '食', reading: 'たべる / しょく', meaning: 'Eat / Food', strokes: 9 },
  { char: '行', reading: 'いく / こう', meaning: 'Go / Act', strokes: 6 },
  { char: '見', reading: 'みる / けん', meaning: 'See / Look', strokes: 7 }
];

export const CanvasWritingPractice: React.FC<CanvasWritingPracticeProps> = ({
  initialCharacter = '日',
  characterList = DEFAULT_CHARACTERS,
  onCompletePractice
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedCharObj, setSelectedCharObj] = useState(() => {
    const found = characterList.find((c) => c.char === initialCharacter);
    return found || characterList[0] || { char: initialCharacter, reading: '', meaning: '', strokes: 4 };
  });

  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuideWatermark, setShowGuideWatermark] = useState(true);
  const [brushColor, setBrushColor] = useState('#1A1A1A'); // Sumi black
  const [brushWidth, setBrushWidth] = useState(8);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);
  const [strokeCountDrawn, setStrokeCountDrawn] = useState(0);
  const [isEvaluated, setIsEvaluated] = useState(false);

  // Initialize Canvas Grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 340;
    canvas.height = 340;

    redrawCanvas();
  }, [selectedCharObj, showGuideWatermark]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    // Canvas background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, width - 8, height - 8);

    // Rice grid (米字格) dashed guidelines
    ctx.save();
    ctx.strokeStyle = '#F3F4F6';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    // Center vertical
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Center horizontal
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Diagonals
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(0, height);
    ctx.stroke();

    ctx.restore();

    // Guide watermark
    if (showGuideWatermark) {
      ctx.save();
      ctx.fillStyle = 'rgba(209, 213, 219, 0.45)';
      ctx.font = '220px "Noto Serif JP", "Yu Mincho", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedCharObj.char, width / 2, height / 2 + 10);
      ctx.restore();
    }
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawGrid(ctx, canvas.width, canvas.height);
    setStrokeHistory([]);
    setStrokeCountDrawn(0);
    setIsEvaluated(false);
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokeHistory((prev) => [...prev.slice(-15), snapshot]);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveState();
    setIsDrawing(true);
    setStrokeCountDrawn((prev) => prev + 1);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
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
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || strokeHistory.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prevSnapshot = strokeHistory[strokeHistory.length - 1];
    setStrokeHistory((prev) => prev.slice(0, -1));
    ctx.putImageData(prevSnapshot, 0, 0);
    setStrokeCountDrawn((prev) => Math.max(0, prev - 1));
  };

  const handleVerify = () => {
    setIsEvaluated(true);
    speakJapanese(selectedCharObj.char);
    if (onCompletePractice) {
      onCompletePractice(selectedCharObj.char);
    }
  };

  return (
    <div id="canvas-writing-practice" className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Header with Title and Speech */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
              Muscle Memory Writing Lab
            </span>
            <span className="text-xs text-stone-400 font-semibold">&bull; Kanji & Kana Tracing</span>
          </div>
          <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-white mt-1">
            Stroke Tracing & Canvas Writing (হাতে লেখার প্র্যাকটিস)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => speakJapanese(selectedCharObj.char)}
            className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 hover:bg-red-100 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-red-200 dark:border-red-900"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Listen Audio</span>
          </button>
        </div>
      </div>

      {/* Character Selector Pill Strip */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
          Select Character to Practice:
        </span>
        <div className="flex flex-wrap gap-2">
          {characterList.map((item) => {
            const isSelected = selectedCharObj.char === item.char;
            return (
              <button
                key={item.char}
                onClick={() => setSelectedCharObj(item)}
                className={`w-11 h-11 rounded-2xl font-serif text-lg font-bold flex items-center justify-center transition cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 scale-105'
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-red-400'
                }`}
              >
                {item.char}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Touch & Mouse Canvas */}
        <div className="md:col-span-7 flex flex-col items-center space-y-3">
          <div className="relative rounded-3xl overflow-hidden shadow-lg border-2 border-stone-300 dark:border-stone-700 bg-white">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="cursor-crosshair touch-none select-none block"
            />
          </div>

          {/* Stroke Count & Tool Bar */}
          <div className="flex flex-wrap items-center justify-between w-full max-w-[340px] text-xs font-bold gap-2">
            <div className="flex items-center gap-1.5 text-stone-500">
              <span>Strokes: {strokeCountDrawn}</span>
              {selectedCharObj.strokes && (
                <span className="text-[11px] font-mono text-stone-400">/ {selectedCharObj.strokes} target</span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleUndo}
                disabled={strokeHistory.length === 0}
                className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 disabled:opacity-40 transition cursor-pointer"
                title="Undo last stroke"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowGuideWatermark((prev) => !prev)}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  showGuideWatermark
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-800 dark:text-amber-300'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'
                }`}
                title="Toggle Guide Watermark"
              >
                {showGuideWatermark ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={redrawCanvas}
                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 transition cursor-pointer"
                title="Clear Canvas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Linguistic Meaning & Palette Control */}
        <div className="md:col-span-5 space-y-4">
          {/* Card Info */}
          <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-5 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-bold font-serif text-stone-900 dark:text-white">
                {selectedCharObj.char}
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                {selectedCharObj.strokes || 4} Strokes
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <p className="text-stone-600 dark:text-stone-300 font-semibold">
                <strong>Reading:</strong> {selectedCharObj.reading || '—'}
              </p>
              <p className="text-stone-600 dark:text-stone-300">
                <strong>Meaning:</strong> {selectedCharObj.meaning || '—'}
              </p>
            </div>
          </div>

          {/* Brush Customizer */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-stone-400" />
                <span>Ink Color</span>
              </span>
              <div className="flex items-center gap-2">
                {[
                  { label: 'Sumi Black', color: '#1A1A1A' },
                  { label: 'Crimson Red', color: '#DC2626' },
                  { label: 'Tokyo Indigo', color: '#2563EB' }
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() => setBrushColor(c.color)}
                    style={{ backgroundColor: c.color }}
                    className={`w-6 h-6 rounded-full border-2 transition cursor-pointer ${
                      brushColor === c.color ? 'border-amber-400 scale-110 shadow-xs' : 'border-white'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-stone-500">
                <span>Brush Width</span>
                <span>{brushWidth}px</span>
              </div>
              <input
                type="range"
                min="4"
                max="18"
                value={brushWidth}
                onChange={(e) => setBrushWidth(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Complete Practice & Verify Button */}
          <button
            onClick={handleVerify}
            className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-red-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verify & Complete Practice</span>
          </button>

          {isEvaluated && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Excellent stroke work!</strong> Stroke memory reinforced for {selectedCharObj.char}.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
