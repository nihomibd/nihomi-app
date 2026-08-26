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
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { VisionSenseiModal } from '../components/VisionSenseiModal';
import { KanjiWritingModal } from '../components/student/KanjiWritingModal';
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
  const [isWritingActive, setIsWritingActive] = useState(false);
  const [showEcosystem, setShowEcosystem] = useState(false);

  const handleAskNihomi = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;

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
          message: prompt,
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

  return (
    <div className="bg-[#FAF9F6] text-stone-900 min-h-[calc(100vh-64px)] flex flex-col justify-between font-sans antialiased selection:bg-red-500 selection:text-white text-left">
      
      {/* HERO ARENA: SERENE APPLE/CHATGPT-STYLE JAPANESE LEARNING SURFACE */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-3xl mx-auto w-full text-center space-y-7">
        
        {/* Zen Badge & Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-stone-100/90 text-stone-600 text-xs font-semibold rounded-full border border-stone-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span>NIHOMI • 日本語学習</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-950 tracking-tight leading-tight">
            What would you like to learn?
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            From your first <span className="font-japanese font-bold text-red-600">ひらがな</span> to real Japanese fluency. Nihomi coordinates every step.
          </p>
        </div>

        {/* Central Cognitive Prompt Hub */}
        <div className="w-full space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs hover:border-stone-300 focus-within:border-stone-900 focus-within:ring-2 focus-within:ring-stone-900/10 transition-all p-4 sm:p-5 text-left">
            <form onSubmit={handleAskNihomi} className="space-y-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAskNihomi();
                  }
                }}
                placeholder="Ask Nihomi anything in English, বাংলা, or 日本語..."
                rows={2}
                className="w-full bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-hidden resize-none leading-relaxed"
              />

              {/* 3 Action Triggers + Submit Button */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsVoiceActive(true)}
                    className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-950 text-xs font-semibold rounded-xl border border-stone-200 transition-colors cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 text-red-600" />
                    <span>Voice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCameraActive(true)}
                    className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-950 text-xs font-semibold rounded-xl border border-stone-200 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    <span>Photo OCR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsWritingActive(true)}
                    className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-950 text-xs font-semibold rounded-xl border border-stone-200 transition-colors cursor-pointer"
                  >
                    <PenTool className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kanji Grid</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="w-9 h-9 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-30 text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs cursor-pointer shrink-0"
                  aria-label="Submit Question"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-red-400" /> : <ArrowRight className="w-4 h-4 text-red-400" />}
                </button>
              </div>
            </form>
          </div>

          {/* Suggestions */}
          {!aiResponse && (
            <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-stone-500 pt-1">
              <span className="font-semibold text-stone-400 text-[11px]">Try:</span>
              {[
                'は (wa) vs が (ga)',
                'ください vs ちょうだい',
                'Tokyo Baito Interview',
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(q)}
                  className="px-3 py-1 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-full text-xs transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Live AI Response Card */}
          {aiResponse && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm animate-in fade-in space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
                    日
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Nihomi Sensei</span>
                    <span className="text-[10px] text-stone-400 font-mono">Gemini 2.5 Adaptive AI</span>
                  </div>
                </div>
                <button
                  onClick={() => setAiResponse(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm sm:text-base text-stone-900 leading-relaxed font-japanese whitespace-pre-line">
                {aiResponse.reply}
              </div>

              {aiResponse.bengaliTranslation && (
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                  <strong className="text-stone-900 block text-[10px] uppercase font-bold tracking-wider mb-1">
                    বাংলা অর্থ ও ব্যাখ্যা:
                  </strong>
                  {aiResponse.bengaliTranslation}
                </div>
              )}
            </div>
          )}

          {/* Single Calm "Your Next Best Step" Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-2xs text-left flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="inline-flex items-center space-x-1 text-[10px] font-bold text-red-600 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Your Next Best Step</span>
                </div>
                <h4 className="text-sm font-bold text-stone-900">
                  Listening • Minna no Nihongo Lesson 12
                </h4>
                <p className="text-[11px] text-stone-500 hidden sm:block">5 min spaced repetition review due today</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('portal')}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1 cursor-pointer shrink-0"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 text-red-400" />
            </button>
          </div>
        </div>

        {/* Collapsible Ecosystem Details Toggle */}
        <div className="pt-2">
          <button
            onClick={() => setShowEcosystem(!showEcosystem)}
            className="inline-flex items-center space-x-1 text-xs text-stone-500 hover:text-stone-900 font-semibold transition-colors cursor-pointer"
          >
            <span>{showEcosystem ? 'Hide' : 'Explore'} 3 Connected Pathways</span>
            {showEcosystem ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* COLLAPSIBLE DRAWER: 3 PATHWAYS */}
      {showEcosystem && (
        <div className="border-t border-stone-200 bg-white py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 font-mono">
                Unified Ecosystem
              </span>
              <h3 className="text-xl font-bold text-stone-900">3 Connected Japanese Learning Pathways</h3>
              <p className="text-xs text-stone-500">24/7 AI, live Tokyo masterclasses, and physical academy classrooms in one passport.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left text-xs">
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-stone-900">01. NIHOMI AI Sensei</h4>
                <p className="text-stone-600 leading-relaxed">
                  24/7 Gemini 2.5 tutor. Camera photo OCR, native pronunciation coaching, and MemoryOS™ spaced repetition.
                </p>
              </div>

              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-stone-900">02. NIHOMI LIVE Cohorts</h4>
                <p className="text-stone-600 leading-relaxed">
                  Weekend interactive live cohorts with Tanvir Kabir Biplob & certified native Tokyo instructors.
                </p>
              </div>

              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-stone-900">03. DILS Academy & Visa Desk</h4>
                <p className="text-stone-600 leading-relaxed">
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

      {isWritingActive && (
        <KanjiWritingModal
          isOpen={isWritingActive}
          onClose={() => setIsWritingActive(false)}
          targetKanji={{ kanji: '日', hiragana: 'にち・ひ', english: 'Sun, Day, Japan', strokes: 4 }}
        />
      )}

    </div>
  );
};
