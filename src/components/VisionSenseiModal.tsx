import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  X,
  Sparkles,
  Volume2,
  AlertCircle,
  Loader2,
  Layers,
  BookOpen,
  Globe,
  RefreshCw
} from 'lucide-react';
import { apiRequest } from '../lib/api';
import { speakJapanese } from '../lib/tts';

interface VisionSenseiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisionSenseiModal: React.FC<VisionSenseiModalProps> = ({ isOpen, onClose }) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'camera'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen && activeMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, activeMode]);

  const startCamera = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setErrorMessage('Could not access camera. Please upload an image file instead.');
      setActiveMode('upload');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedImage(ev.target?.result as string);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const res = await apiRequest<{ success: boolean; analysis: any }>('/api/ai/vision-sensei', {
        method: 'POST',
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: 'image/jpeg',
          userPrompt: customPrompt.trim() || undefined
        })
      });
      if (res.success && res.analysis) {
        setAnalysisResult(res.analysis);
      } else {
        setErrorMessage('Failed to analyze image. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Vision Sensei was unable to process the image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50">
                  Nihomi Vision Sensei (AI Camera & OCR)
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 uppercase">
                  Gemini 3.7 Vision
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Snap or upload any Japanese sign, menu, manga, or textbook page for immediate translation & grammar breakdown.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!selectedImage && (
            <div className="flex justify-center">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-2xl flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('upload');
                    stopCamera();
                  }}
                  className={`px-5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                    activeMode === 'upload'
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-md'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('camera');
                    startCamera();
                  }}
                  className={`px-5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                    activeMode === 'camera'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>Live Camera</span>
                </button>
              </div>
            </div>
          )}

          {!selectedImage ? (
            <div>
              {activeMode === 'upload' ? (
                <label className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl p-12 text-center flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors bg-zinc-50/50 dark:bg-zinc-800/20">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center mb-3">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Click or drag Japanese photo here
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                    Photos of street signs, product labels, restaurant menus, JLPT test papers, or handwritten notes.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="relative rounded-3xl overflow-hidden bg-black max-w-md mx-auto aspect-4/3 shadow-inner">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg flex items-center gap-2 mx-auto"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Snapshot</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start gap-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                <div className="w-48 h-36 rounded-xl overflow-hidden bg-black shrink-0 border border-zinc-200 dark:border-zinc-700">
                  <img
                    src={selectedImage}
                    alt="Captured Japanese"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Photo Ready for AI Analysis
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setAnalysisResult(null);
                      }}
                      className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake Photo</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Optional: Ask a specific question about this image..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  />
                  {!analysisResult && (
                    <button
                      type="button"
                      onClick={handleAnalyzeImage}
                      disabled={isAnalyzing}
                      className="py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Vision Sensei is deciphering Kanji & Grammar...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Analyze Japanese Text with AI Sensei</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {analysisResult && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                          Extracted Japanese Text & Furigana
                        </span>
                        <h2 className="text-3xl font-extrabold font-serif text-zinc-900 dark:text-zinc-50">
                          {analysisResult.extractedJapanese}
                        </h2>
                        <p className="text-sm text-red-600 font-serif">
                          {analysisResult.furigana}
                        </p>
                        <p className="text-xs text-zinc-500 font-mono">
                          {analysisResult.romaji}
                        </p>
                      </div>
                      <button
                        onClick={() => speakJapanese(analysisResult.extractedJapanese)}
                        className="p-3 rounded-2xl bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-red-600 border border-zinc-200 dark:border-zinc-700 shadow-sm"
                        title="Listen to Japanese pronunciation"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-red-200/60 dark:border-red-900/40 text-xs">
                      <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                        <span className="font-bold text-zinc-500 flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-blue-600" />
                          English Meaning:
                        </span>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                          {analysisResult.englishMeaning}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                        <span className="font-bold text-zinc-500 flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-emerald-600" />
                          বাংলা অর্থ (Bengali Meaning):
                        </span>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm font-sans">
                          {analysisResult.bengaliMeaning}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-red-600" />
                      Grammar & Particle Breakdown
                    </h4>
                    <div className="space-y-2 text-xs">
                      {analysisResult.grammarBreakdown?.map((g: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-200 flex items-start gap-2"
                        >
                          <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{g}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-600" />
                      Vocabulary & Kanji Detected
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 uppercase font-bold text-[10px] border-b border-zinc-200 dark:border-zinc-700">
                          <tr>
                            <th className="p-2.5">Japanese</th>
                            <th className="p-2.5">Reading</th>
                            <th className="p-2.5">Meaning</th>
                            <th className="p-2.5">JLPT Level</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                          {analysisResult.vocabularyList?.map((v: any, idx: number) => (
                            <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                              <td className="p-2.5 font-bold font-serif text-zinc-900 dark:text-zinc-100 text-sm">
                                {v.word}
                              </td>
                              <td className="p-2.5 text-red-600 font-serif">{v.reading}</td>
                              <td className="p-2.5 text-zinc-700 dark:text-zinc-300 font-medium">
                                {v.meaning}
                              </td>
                              <td className="p-2.5">
                                <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-bold text-[10px] text-zinc-600 dark:text-zinc-400">
                                  {v.jlptLevel || 'N5'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between text-xs text-zinc-500">
          <span>Nihomi Multimodal Vision Sensei &bull; Gemini 3.7</span>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
