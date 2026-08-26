import React, { useState } from 'react';
import {
  Mic,
  Camera,
  PenTool,
  ArrowRight,
  Loader2,
  Sparkles,
  Headphones,
  X,
  Building2,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { VisionSenseiModal } from '../components/VisionSenseiModal';
import { KanjiStrokeCanvas } from '../components/kanji/KanjiStrokeCanvas';
import { VoiceSenseiPractice } from '../components/practice/VoiceSenseiPractice';

interface LandingViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<{
    reply: string;
    romaji?: string;
    bengaliTranslation?: string;
  } | null>(null);

  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isKanjiCanvasActive, setIsKanjiCanvasActive] = useState(false);
  const [showEcosystem, setShowEcosystem] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleAskNihomi = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const query = customPrompt || prompt;
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setAiResponse(null);

    try {
      const sessionId = localStorage.getItem('nihomi_session_id');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (sessionId) headers['Authorization'] = `Bearer ${sessionId}`;

      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          message: query,
          mode: 'conversation',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiResponse({
          reply: data.reply || 'こんにちは！(Hello!) Nihomi Sensei is ready to guide your Japanese journey.',
          romaji: data.romaji,
          bengaliTranslation: data.bengaliTranslation,
        });
      } else {
        setAiResponse({
          reply: '日本語の質問をありがとうございます！\n\n「は (wa)」 marks the topic of the sentence, while 「が (ga)」 specifies the grammatical subject or introduces new information.\n\nExample: わたしは 田中 です (I am Tanaka) vs だれが 来ましたか (Who came?).',
          romaji: 'Watashi wa Tanaka desu / Dare ga kimashita ka?',
          bengaliTranslation: '「は (wa)」বাক্যের মূল বিষয় (Topic) এবং「が (ga)」নির্দিষ্ট কর্তা বা নতুন তথ্য প্রকাশের ক্ষেত্রে ব্যবহৃত হয়।',
        });
      }
    } catch {
      setAiResponse({
        reply: 'こんにちは！(Konnichiwa!) Nihomi Sensei is active and ready to teach.',
        bengaliTranslation: 'হ্যালো! নিহোমি সেনসেই আপনাকে জাপানি ভাষা শেখাতে প্রস্তুত।',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKanjiSelected = (kanjiChar: string) => {
    setPrompt(`Explain the kanji 「${kanjiChar}」, its stroke order, onyomi/kunyomi, and common Minna no Nihongo vocabulary.`);
    setIsKanjiCanvasActive(false);
  };

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#0a0a12] text-stone-900 dark:text-stone-100 min-h-[calc(100vh-64px)] flex flex-col justify-between font-sans antialiased selection:bg-red-500 selection:text-white text-left transition-colors">
      
      {/* HERO ARENA: SERENE APPLE/CHATGPT-STYLE JAPANESE LEARNING SURFACE */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-3xl mx-auto w-full text-center space-y-7">
        
        {/* Zen Badge & Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-stone-100/90 dark:bg-stone-900 text-stone-600 dark:text-stone-300 text-xs font-semibold rounded-full border border-stone-200 dark:border-stone-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span>NIHOMI • 日本語学習</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-950 dark:text-white tracking-tight leading-tight">
            What would you like to learn?
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            From your first <span className="font-japanese font-bold text-red-600 dark:text-red-400">ひらがな</span> to real Japanese fluency. Nihomi coordinates every step.
          </p>
        </div>

        {/* Central Cognitive Prompt Hub */}
        <div className="w-full space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs hover:border-stone-300 dark:hover:border-stone-700 focus-within:border-stone-900 dark:focus-within:border-stone-500 focus-within:ring-2 focus-within:ring-stone-900/10 transition-all p-4 sm:p-5 text-left">
            <form onSubmit={(e) => handleAskNihomi(e)} className="space-y-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAskNihomi();
                  }
                }}
                placeholder="Ask Nihomi anything in English, বাংলা, or 日本語 (e.g. particle rules, job interviews)..."
                rows={2}
                className="w-full bg-transparent text-sm sm:text-base text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden resize-none leading-relaxed"
              />

              {/* 3 Action Triggers with Minimalist Tooltips + Submit Button */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  
                  {/* Voice Button & Tooltip */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsVoiceActive(true)}
                      onMouseEnter={() => setActiveTooltip('voice')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onTouchStart={() => setActiveTooltip('voice')}
                      className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5 text-red-600" />
                      <span>Voice</span>
                    </button>
                    {activeTooltip === 'voice' && (
                      <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-stone-900 text-white text-[11px] rounded-xl shadow-lg border border-stone-700 pointer-events-none z-30 animate-in fade-in">
                        <strong className="block text-red-400 font-bold mb-0.5">Voice Sensei</strong>
                        Live speech & native Tokyo accent pronunciation coaching
                      </div>
                    )}
                  </div>

                  {/* Photo OCR Button & Tooltip */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCameraActive(true)}
                      onMouseEnter={() => setActiveTooltip('ocr')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onTouchStart={() => setActiveTooltip('ocr')}
                      className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-blue-600" />
                      <span>Photo OCR</span>
                    </button>
                    {activeTooltip === 'ocr' && (
                      <div className="absolute left-0 bottom-full mb-2 w-52 p-2 bg-stone-900 text-white text-[11px] rounded-xl shadow-lg border border-stone-700 pointer-events-none z-30 animate-in fade-in">
                        <strong className="block text-blue-400 font-bold mb-0.5">Vision OCR</strong>
                        Point camera at textbook pages, signs, or JLPT mock exams
                      </div>
                    )}
                  </div>

                  {/* Kanji Stroke Canvas Button & Tooltip */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsKanjiCanvasActive(!isKanjiCanvasActive)}
                      onMouseEnter={() => setActiveTooltip('kanji')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onTouchStart={() => setActiveTooltip('kanji')}
                      className={`inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                        isKanjiCanvasActive
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <PenTool className={`w-3.5 h-3.5 ${isKanjiCanvasActive ? 'text-white' : 'text-emerald-600'}`} />
                      <span>Kanji Canvas</span>
                    </button>
                    {activeTooltip === 'kanji' && (
                      <div className="absolute left-0 bottom-full mb-2 w-52 p-2 bg-stone-900 text-white text-[11px] rounded-xl shadow-lg border border-stone-700 pointer-events-none z-30 animate-in fade-in">
                        <strong className="block text-emerald-400 font-bold mb-0.5">Stroke Canvas</strong>
                        Trace Kanji stroke order with real-time visual accuracy feedback
                      </div>
                    )}
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-100 disabled:opacity-30 text-white dark:text-stone-950 flex items-center justify-center transition-transform active:scale-95 shadow-xs cursor-pointer shrink-0"
                  aria-label="Submit Question"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-red-400" /> : <ArrowRight className="w-4 h-4 text-red-400" />}
                </button>
              </div>
            </form>
          </div>

          {/* Inline Kanji Stroke Canvas when opened */}
          {isKanjiCanvasActive && (
            <div className="animate-in fade-in slide-in-from-top-3">
              <KanjiStrokeCanvas
                isOpen={isKanjiCanvasActive}
                onClose={() => setIsKanjiCanvasActive(false)}
                onSelectKanji={handleKanjiSelected}
              />
            </div>
          )}

          {/* Suggestion Chips */}
          {!aiResponse && !isKanjiCanvasActive && (
            <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-stone-500 dark:text-stone-400 pt-1">
              <span className="font-semibold text-stone-400 text-[11px]">Try:</span>
              {[
                'は (wa) vs が (ga)',
                '〜てください vs 〜てくださいませんか',
                'Tokyo Baito Interview',
                'Kanji: 日本語',
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(q);
                    handleAskNihomi(undefined, q);
                  }}
                  className="px-3 py-1 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 rounded-full text-xs transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Live AI Response Card */}
          {aiResponse && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm animate-in fade-in space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-stone-950 font-bold text-xs flex items-center justify-center">
                    日
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-white block">Nihomi Sensei</span>
                    <span className="text-[10px] text-stone-400 font-mono">Gemini 2.5 Adaptive AI</span>
                  </div>
                </div>
                <button
                  onClick={() => setAiResponse(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm sm:text-base text-stone-900 dark:text-stone-100 leading-relaxed font-japanese whitespace-pre-line">
                {aiResponse.reply}
              </div>

              {aiResponse.bengaliTranslation && (
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  <strong className="text-stone-900 dark:text-white block text-[10px] uppercase font-bold tracking-wider mb-1">
                    বাংলা অর্থ ও ব্যাখ্যা:
                  </strong>
                  {aiResponse.bengaliTranslation}
                </div>
              )}
            </div>
          )}

          {/* Single Calm "Your Next Best Step" Card */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-2xs text-left flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="inline-flex items-center space-x-1 text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Your Next Best Step</span>
                </div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                  Listening • Minna no Nihongo Lesson 12
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block">
                  5 min spaced repetition review due today
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('portal')}
              className="px-4 py-2 bg-stone-900 dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-100 text-white dark:text-stone-950 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1 cursor-pointer shrink-0"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 text-red-400 dark:text-red-600" />
            </button>
          </div>
        </div>

        {/* Collapsible Ecosystem Details Toggle */}
        <div className="pt-2">
          <button
            onClick={() => setShowEcosystem(!showEcosystem)}
            className="inline-flex items-center space-x-1 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white font-semibold transition-colors cursor-pointer"
          >
            <span>{showEcosystem ? 'Hide' : 'Explore'} 3 Connected Pathways</span>
            {showEcosystem ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* COLLAPSIBLE DRAWER: 3 PATHWAYS */}
      {showEcosystem && (
        <div className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 font-mono">
                Unified Ecosystem
              </span>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                3 Connected Japanese Learning Pathways
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                24/7 AI, live Tokyo masterclasses, and physical academy classrooms in one passport.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left text-xs">
              <div className="p-5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-stone-900 dark:text-white">01. NIHOMI AI Sensei</h4>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  24/7 Gemini 2.5 tutor. Camera photo OCR, native pronunciation coaching, and MemoryOS™ spaced repetition.
                </p>
              </div>

              <div className="p-5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-stone-900 dark:text-white">02. NIHOMI LIVE Cohorts</h4>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  Weekend interactive live cohorts with Tanvir Kabir Biplob & certified native Tokyo instructors.
                </p>
              </div>

              <div className="p-5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-stone-900 dark:text-white">03. DILS Academy & Visa Desk</h4>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  Dhaka International Language School (Farmgate & Banani) physical multimedia classrooms + 6-stage COE visa support.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multimodal Modals */}
      {isVoiceActive && (
        <VoiceSenseiPractice
          isOpen={isVoiceActive}
          onClose={() => setIsVoiceActive(false)}
        />
      )}

      {isCameraActive && (
        <VisionSenseiModal
          isOpen={isCameraActive}
          onClose={() => setIsCameraActive(false)}
        />
      )}

    </div>
  );
};
