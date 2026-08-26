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
  ArrowRight,
  X,
  BookOpen
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts.js';

export interface KanjiStrokeItem {
  kanji: string;
  onyomi: string;
  kunyomi: string;
  meaning: string;
  meaningBn: string;
  strokes: number;
  grade: string;
  jlpt: string;
}

export const ESSENTIAL_KANJI_BANK: KanjiStrokeItem[] = [
  {
    kanji: '日',
    onyomi: 'ニチ, ジツ',
    kunyomi: 'ひ, -び, -か',
    meaning: 'Sun, Day, Japan',
    meaningBn: 'সূর্য, দিন, জাপান',
    strokes: 4,
    grade: 'G1',
    jlpt: 'N5',
  },
  {
    kanji: '本',
    onyomi: 'ホン',
    kunyomi: 'もと',
    meaning: 'Book, Origin, Real',
    meaningBn: 'বই, উৎস, মূল',
    strokes: 5,
    grade: 'G1',
    jlpt: 'N5',
  },
  {
    kanji: '語',
    onyomi: 'ゴ',
    kunyomi: 'かた.る, かた.らう',
    meaning: 'Language, Word, Speech',
    meaningBn: 'ভাষা, শব্দ, কথন',
    strokes: 14,
    grade: 'G2',
    jlpt: 'N5',
  },
  {
    kanji: '学',
    onyomi: 'ガク',
    kunyomi: 'まな.ぶ',
    meaning: 'Study, Learning, Science',
    meaningBn: 'পড়াশোনা, শিক্ষা, জ্ঞান',
    strokes: 8,
    grade: 'G1',
    jlpt: 'N5',
  },
  {
    kanji: '生',
    onyomi: 'セイ, ショウ',
    kunyomi: 'い.きる, う.まれる, なま',
    meaning: 'Life, Birth, Student',
    meaningBn: 'জীবন, জন্ম, শিক্ষার্থী',
    strokes: 5,
    grade: 'G1',
    jlpt: 'N5',
  },
  {
    kanji: '先',
    onyomi: 'セン',
    kunyomi: 'さき, ま.ず',
    meaning: 'Before, Ahead, Previous',
    meaningBn: 'পূর্বে, আগে, অগ্রগামী',
    strokes: 6,
    grade: 'G1',
    jlpt: 'N5',
  },
  {
    kanji: '行',
    onyomi: 'コウ, ギョウ, アン',
    kunyomi: 'い.く, ゆ.く, おこな.う',
    meaning: 'Go, Act, Conduct, Line',
    meaningBn: 'যাওয়া, কাজ করা, সারি',
    strokes: 6,
    grade: 'G2',
    jlpt: 'N5',
  },
  {
    kanji: '来',
    onyomi: 'ライ, タイ',
    kunyomi: 'く.る, きた.る',
    meaning: 'Come, Next, Future',
    meaningBn: 'আসা, আগামী, পরবর্তী',
    strokes: 7,
    grade: 'G2',
    jlpt: 'N5',
  },
  {
    kanji: '食',
    onyomi: 'ショク, ジキ',
    kunyomi: 'た.べる, く.らう',
    meaning: 'Eat, Food, Meal',
    meaningBn: 'খাওয়া, খাদ্য, আহার',
    strokes: 9,
    grade: 'G2',
    jlpt: 'N5',
  },
  {
    kanji: '見',
    onyomi: 'ケン',
    kunyomi: 'み.る, み.える, み.せる',
    meaning: 'See, Look, View',
    meaningBn: 'দেখা, লক্ষ্য করা',
    strokes: 7,
    grade: 'G1',
    jlpt: 'N5',
  },
  {
    kanji: '人',
    onyomi: 'ジン, ニン',
    kunyomi: 'ひと',
    meaning: 'Person, Human',
    meaningBn: 'মানুষ, ব্যক্তি',
    strokes: 2,
    grade: 'G1',
    jlpt: 'N5',
  },
  {
    kanji: '何',
    onyomi: 'カ',
    kunyomi: 'なに, なん',
    meaning: 'What, Which, How many',
    meaningBn: 'কী, কোনটি, কত',
    strokes: 7,
    grade: 'G2',
    jlpt: 'N5',
  },
];

interface KanjiStrokeCanvasProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectKanji?: (kanji: string) => void;
  initialKanji?: string;
}

export const KanjiStrokeCanvas: React.FC<KanjiStrokeCanvasProps> = ({
  isOpen = true,
  onClose,
  onSelectKanji,
  initialKanji = '日',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedKanji, setSelectedKanji] = useState<KanjiStrokeItem>(() => {
    const found = ESSENTIAL_KANJI_BANK.find((k) => k.kanji === initialKanji);
    return found || ESSENTIAL_KANJI_BANK[0];
  });

  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuideWatermark, setShowGuideWatermark] = useState(true);
  const [inkColor, setInkColor] = useState('#1c1917'); // Traditional Sumi charcoal
  const [brushWidth, setBrushWidth] = useState(9);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);
  const [strokeCount, setStrokeCount] = useState(0);
  const [accuracyFeedback, setAccuracyFeedback] = useState<{
    score: number;
    message: string;
    messageBn: string;
  } | null>(null);

  // Initialize and redraw grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;

    redrawGrid();
  }, [selectedKanji, showGuideWatermark]);

  const drawGridLines = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    // Clean Japanese Washi paper background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Subtle border
    ctx.strokeStyle = '#E7E5E4';
    ctx.lineWidth = 2;
    ctx.strokeRect(3, 3, width - 6, height - 6);

    // Rice grid (米字格) dashed guidelines for stroke alignment
    ctx.save();
    ctx.strokeStyle = '#F5F5F4';
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

    // Diagonal 1
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.stroke();

    // Diagonal 2
    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(0, height);
    ctx.stroke();

    ctx.restore();

    // Visual guide watermark
    if (showGuideWatermark) {
      ctx.save();
      ctx.fillStyle = 'rgba(214, 211, 209, 0.45)';
      ctx.font = '200px "Noto Serif JP", "Yu Mincho", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedKanji.kanji, width / 2, height / 2 + 8);
      ctx.restore();
    }
  };

  const redrawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawGridLines(ctx, canvas.width, canvas.height);
    setStrokeHistory([]);
    setStrokeCount(0);
    setAccuracyFeedback(null);
  };

  const saveCanvasState = () => {
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

    saveCanvasState();
    setIsDrawing(true);
    setStrokeCount((prev) => prev + 1);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = inkColor;
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
    setStrokeCount((prev) => Math.max(0, prev - 1));
  };

  const handleVerify = () => {
    speakJapanese(selectedKanji.kanji);
    const targetStrokes = selectedKanji.strokes;
    const diff = Math.abs(strokeCount - targetStrokes);

    let score = 96;
    let message = 'Flawless stroke flow and optical balance!';
    let messageBn = 'দারুণ স্ট্রোক সিকোয়েন্স ও ব্যালান্স!';

    if (diff === 1) {
      score = 88;
      message = `Close! Expected ${targetStrokes} strokes, you drew ${strokeCount}.`;
      messageBn = `খুব কাছাকাছি! লক্ষ্য ${targetStrokes} টি স্ট্রোক, আপনি এঁকেছেন ${strokeCount} টি।`;
    } else if (diff > 1) {
      score = 75;
      message = `Stroke count mismatch (${strokeCount}/${targetStrokes}). Try following the guide watermark.`;
      messageBn = `স্ট্রোক সংখ্যায় পার্থক্য রয়েছে (${strokeCount}/${targetStrokes})। ওয়াটারমার্ক অনুসরণ করে পুনরায় চেষ্টা করুন।`;
    }

    setAccuracyFeedback({ score, message, messageBn });
  };

  const handleUseKanji = () => {
    if (onSelectKanji) {
      onSelectKanji(selectedKanji.kanji);
    }
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-6 text-left space-y-5 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold text-xs">
            筆
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-1.5">
              <span>Kanji Stroke Canvas</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100/60 text-emerald-800 font-bold">
                JLPT {selectedKanji.jlpt}
              </span>
            </h3>
            <p className="text-[11px] text-stone-500">
              Interactive stroke memory tracing & visual feedback
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => speakJapanese(selectedKanji.kanji)}
            className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-950 border border-stone-200 text-xs transition cursor-pointer"
            title="Tokyo Native Audio"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              title="Close Canvas"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Kanji Selector Pill Strip */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
          Essential Kanji Bank:
        </span>
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {ESSENTIAL_KANJI_BANK.map((item) => {
            const isSelected = selectedKanji.kanji === item.kanji;
            return (
              <button
                key={item.kanji}
                onClick={() => setSelectedKanji(item)}
                className={`w-9 h-9 shrink-0 rounded-xl font-serif text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs scale-105'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                {item.kanji}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Canvas & Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Canvas & Controls */}
        <div className="md:col-span-6 flex flex-col items-center space-y-3">
          <div className="relative rounded-2xl overflow-hidden shadow-xs border border-stone-300 bg-white">
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

          {/* Stroke Count & Quick Tools */}
          <div className="flex items-center justify-between w-full max-w-[300px] text-xs font-bold">
            <div className="flex items-center space-x-1 text-stone-600">
              <span>Strokes: {strokeCount}</span>
              <span className="text-[11px] text-stone-400 font-mono">/ {selectedKanji.strokes}</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleUndo}
                disabled={strokeHistory.length === 0}
                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 transition cursor-pointer"
                title="Undo last stroke"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowGuideWatermark((prev) => !prev)}
                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                  showGuideWatermark
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-stone-100 border-stone-200 text-stone-500'
                }`}
                title="Toggle Guide Watermark"
              >
                {showGuideWatermark ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={redrawGrid}
                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
                title="Clear Canvas"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Linguistic Info & Actions */}
        <div className="md:col-span-6 space-y-3.5">
          {/* Card Info */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold font-serif text-stone-900">
                {selectedKanji.kanji}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                {selectedKanji.strokes} Strokes
              </span>
            </div>
            <div className="space-y-1 text-stone-600">
              <p>
                <strong className="text-stone-900">音読み (Onyomi):</strong> {selectedKanji.onyomi}
              </p>
              <p>
                <strong className="text-stone-900">訓読み (Kunyomi):</strong> {selectedKanji.kunyomi}
              </p>
              <p>
                <strong className="text-stone-900">English:</strong> {selectedKanji.meaning}
              </p>
              <p className="text-stone-800">
                <strong className="text-stone-900">বাংলা:</strong> {selectedKanji.meaningBn}
              </p>
            </div>
          </div>

          {/* Verification Feedback */}
          {accuracyFeedback && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-0.5 animate-in fade-in">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Accuracy Score: {accuracyFeedback.score}%</span>
              </div>
              <p>{accuracyFeedback.message}</p>
              <p className="text-[11px] text-emerald-700">{accuracyFeedback.messageBn}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleVerify}
              className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verify Strokes</span>
            </button>

            <button
              onClick={handleUseKanji}
              className="py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center justify-center space-x-1"
            >
              <span>Ask Sensei</span>
              <ArrowRight className="w-3.5 h-3.5 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
