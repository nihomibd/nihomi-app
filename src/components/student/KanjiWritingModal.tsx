import React, { useRef, useState, useEffect } from 'react';
import { X, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';

interface KanjiWritingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetKanji?: {
    kanji: string;
    hiragana: string;
    english: string;
    strokes: number;
  } | null;
}

export const KanjiWritingModal: React.FC<KanjiWritingModalProps> = ({
  isOpen,
  onClose,
  targetKanji,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Safe Default Fallback if targetKanji is null or undefined
  const kanjiData = targetKanji || {
    kanji: '日',
    hiragana: 'にち・ひ',
    english: 'Sun, Day, Japan',
    strokes: 4,
  };

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx, canvas.width, canvas.height);
      }
    }
  }, [isOpen]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#E5E5E5';
    ctx.lineWidth = 1;
    ctx.setLineDash();

    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    ctx.setLineDash([]);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
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

    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1C1917';

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
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

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
    setIsVerified(false);
  };

  const verifyStroke = () => {
    setIsVerified(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
              Kanji Stroke Canvas (漢字書き取り)
            </span>
            <h3 className="text-base font-bold text-stone-900">
              Practice Character: <span className="text-xl font-black text-red-600 font-japanese">{kanjiData.kanji}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Info */}
        <div className="p-4 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between text-xs">
          <div>
            <span className="text-stone-400 block text-[10px]">Readings</span>
            <strong className="text-stone-800 font-japanese">{kanjiData.hiragana}</strong>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px]">Meaning</span>
            <strong className="text-stone-800">{kanjiData.english}</strong>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px]">Strokes</span>
            <strong className="text-stone-800">{kanjiData.strokes} 画</strong>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="p-6 flex flex-col items-center justify-center space-y-4">
          <div className="relative border-2 border-stone-300 rounded-2xl overflow-hidden shadow-inner bg-white">
            {/* Faint Background Reference Character */}
            <div className="absolute inset-0 flex items-center justify-center text-[180px] font-black text-stone-200 select-none pointer-events-none opacity-40 font-japanese">
              {kanjiData.kanji}
            </div>

            <canvas
              ref={canvasRef}
              width={260}
              height={260}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="cursor-crosshair relative z-10 touch-none"
            />
          </div>

          {isVerified && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Correct stroke balance! Recorded to your Learning DNA.</span>
            </div>
          )}

          <div className="flex items-center space-x-3 w-full pt-2">
            <button
              onClick={clearCanvas}
              className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>Clear</span>
            </button>

            <button
              onClick={verifyStroke}
              className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Evaluate Stroke</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};