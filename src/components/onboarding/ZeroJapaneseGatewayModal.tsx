import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Compass
} from 'lucide-react';

interface ZeroJapaneseGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onOpenLevelCheck?: () => void;
}

export const ZeroJapaneseGatewayModal: React.FC<ZeroJapaneseGatewayModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenLevelCheck,
}) => {
  const [step, setStep] = useState<'welcome' | 'first-character' | 'choose-path'>('welcome');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const playSound = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }
    } catch {}
  };

  useEffect(() => {
    if (step === 'first-character' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 14;
        ctx.strokeStyle = '#dc2626';
      }
    }
  }, [step]);

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
        setIsVerified(false);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (hasDrawn) {
      setIsVerified(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    if (e.type === 'mousedown' || e.type === 'touchstart') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
      setHasDrawn(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden text-left flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF9F6]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Nihomi Japanese Zero Gateway
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {step === 'welcome' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-200">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  <span>জাপানিজ ভাষা শুরু করতে চান? কোনো সমস্যা নেই!</span>
                </div>
                <h3 className="text-2xl font-black text-stone-950 tracking-tight">
                  Japanese Zero — No Problem.
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  জাপানিজ ভাষা দেখে অনেকেই ভয় পান কারণ এতে ৩ রকমের হরফ থাকে। কিন্তু নিহোমিতে এটি একদম সহজ লজিক্যাল অর্ডারে সাজানো:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                  <div className="text-lg font-black text-red-600 font-japanese">あ ひらがな</div>
                  <div className="text-xs font-bold text-stone-900">1. Hiragana (হিরাগানা)</div>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    জাপানিজ ব্যাকরণ ও নিজস্ব মৌলিক শব্দের ৪৬টি মূল বর্ণ।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                  <div className="text-lg font-black text-blue-600 font-japanese">ア カタカナ</div>
                  <div className="text-xs font-bold text-stone-900">2. Katakana (কাতাকানা)</div>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    বিদেশি ও আধুনিক শব্দ লেখার জন্য (যেমন: কফি, ক্যামেরা, বাংলাদেশ)।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                  <div className="text-lg font-black text-emerald-700 font-japanese">日 漢字</div>
                  <div className="text-xs font-bold text-stone-900">3. Kanji (কাঞ্জি)</div>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    অর্থ বহনকারী চিত্রলিপি (যেমন: 日 = সূর্য/দিন)।
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200/60 text-xs text-red-950 flex items-start space-x-3">
                <span className="text-lg">💡</span>
                <p className="leading-relaxed">
                  <strong>নিহোমি প্রিন্সিপাল:</strong> আপনাকে একদিনে সব মুখস্থ করতে হবে না। আমরা এখনই আপনাকে জীবনের প্রথম জাপানিজ অক্ষরটি আঁকা ও উচ্চারণ করা শেখাব!
                </p>
              </div>

              <button
                onClick={() => {
                  setStep('first-character');
                  playSound('あ');
                }}
                className="w-full py-3.5 bg-stone-950 hover:bg-stone-900 text-white font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>আপনার ১ম অক্ষর আঁকা শুরু করুন (Try Character あ)</span>
                <ArrowRight className="w-4 h-4 text-red-400" />
              </button>
            </div>
          )}

          {step === 'first-character' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                    Character #1 • Hiragana
                  </span>
                  <h4 className="text-lg font-black text-stone-950">
                    প্রথম অক্ষর: <span className="text-red-600 font-japanese text-xl">あ</span> (A)
                  </h4>
                </div>
                <button
                  onClick={() => playSound('あ')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-red-600" />
                  <span>শুনুন (Listen)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="p-5 rounded-3xl bg-[#FAF9F6] border border-stone-200 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
                  <div className="text-7xl font-black text-stone-900 font-japanese select-none tracking-tight">
                    あ
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-800">উচ্চারণ: 'আ' (Romaji: a)</div>
                    <div className="text-[11px] text-stone-500">মোট ৩টি স্ট্রোক (3 Strokes)</div>
                  </div>
                  <div className="text-[10px] text-stone-400 font-medium px-2 py-1 bg-white rounded-lg border border-stone-200/60">
                    ডানের সাদা বক্সে মাউস বা আঙুল দিয়ে আঁকুন ➔
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="relative w-full aspect-square max-w-[220px] rounded-3xl border-2 border-dashed border-stone-300 bg-white shadow-inner flex items-center justify-center overflow-hidden touch-none">
                    <div className="absolute inset-0 flex items-center justify-center text-7xl font-japanese text-stone-100 select-none pointer-events-none">
                      あ
                    </div>
                    <canvas
                      ref={canvasRef}
                      width={220}
                      height={220}
                      onMouseDown={startDrawing}
                      onMouseUp={stopDrawing}
                      onMouseMove={draw}
                      onTouchStart={startDrawing}
                      onTouchEnd={stopDrawing}
                      onTouchMove={draw}
                      className="relative z-10 w-full h-full cursor-crosshair"
                    />
                  </div>

                  <div className="flex items-center space-x-2 w-full max-w-[220px]">
                    <button
                      onClick={clearCanvas}
                      className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>মুছুন (Clear)</span>
                    </button>
                    <button
                      onClick={() => playSound('あ')}
                      className="py-1.5 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>

              {isVerified && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center space-x-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>অসাধারণ!</strong> আপনি জীবনের প্রথম জাপানিজ অক্ষর <strong>'あ'</strong> লিখে ফেলেছেন।
                  </span>
                </div>
              )}

              <button
                onClick={() => setStep('choose-path')}
                className="w-full py-3.5 bg-stone-950 hover:bg-stone-900 text-white font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>পরবর্তী ধাপে যান (Choose Your Learning Path)</span>
                <ArrowRight className="w-4 h-4 text-red-400" />
              </button>
            </div>
          )}

          {step === 'choose-path' && (
            <div className="space-y-5 animate-in fade-in text-left">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                  Nihomi Personal Pathway
                </span>
                <h4 className="text-xl font-black text-stone-950">
                  আপনার জন্য কোন পথটি সেরা?
                </h4>
                <p className="text-xs text-stone-500">
                  আপনার বর্তমান অবস্থা অনুযায়ী শুরু করুন—নিহোমি আপনার সব অগ্রগতি ট্র্যাক করবে:
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('portal-practice');
                  }}
                  className="w-full p-4 rounded-2xl bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-red-600 transition-all text-left flex items-start space-x-3.5 group cursor-pointer shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-base font-japanese shrink-0 group-hover:scale-105 transition-transform">
                    あ
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-stone-950">
                        Stage 0: Japanese Foundation
                      </span>
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
                        ১০০% ফ্রি
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      হিরাগানা ও কাতাকানার সব অক্ষরের স্ট্রোক ড্রয়িং, উচ্চারণ ও রিকল কুইজ প্র্যাকটিস।
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-red-600 self-center shrink-0" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onNavigate('courses');
                  }}
                  className="w-full p-4 rounded-2xl bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-stone-900 transition-all text-left flex items-start space-x-3.5 group cursor-pointer shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-900 flex items-center justify-center font-bold text-base font-japanese shrink-0 group-hover:scale-105 transition-transform">
                    N5
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-stone-950">
                        Minna no Nihongo JLPT N5 Master
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      বর্ণমালা জানা থাকলে সরাসরি লেসন ০১ থেকে ব্যাকরণ, শব্দভাণ্ডার ও লিসেনিং শুরু করুন।
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-950 self-center shrink-0" />
                </button>

                {onOpenLevelCheck && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenLevelCheck();
                    }}
                    className="w-full p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-all text-left flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Compass className="w-4 h-4 text-stone-600" />
                      <span className="text-xs font-bold text-stone-800">
                        নিশ্চিত নন কোন লেভেলে আছেন? ২ মিনিটের দ্রুত লেভেল চেক দিন ➔
                      </span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
