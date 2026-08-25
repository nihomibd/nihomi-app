import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Camera,
  PenTool,
  ArrowRight,
  Loader2,
  Sparkles,
  Headphones,
  BookOpen,
  X,
  Volume2,
  GraduationCap,
  Building2,
  Plane,
  ShoppingBag,
  ExternalLink,
  Check,
  Zap,
  Globe2,
  ChevronRight,
  MessageSquare,
  Bot,
  Play,
  RotateCcw,
  Languages
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { VisionSenseiModal } from '../components/VisionSenseiModal';
import { KanjiWritingModal } from '../components/student/KanjiWritingModal';
import { SRSFlashcardSession } from '../components/practice/SRSFlashcardSession';
import { VoiceSenseiPractice } from '../components/practice/VoiceSenseiPractice';
import { LanguageProgressTracker } from '../components/LanguageProgressTracker';
import { speakJapanese } from '../lib/tts';

interface LandingViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  
  // Prompt & AI interaction state
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<{
    reply: string;
    romaji?: string;
    bengaliTranslation?: string;
  } | null>(null);

  // Modals state
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isWritingActive, setIsWritingActive] = useState(false);
  const [isSRSActive, setIsSRSActive] = useState(false);

  // Subtle Ambient Background Glow
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

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
        body: JSON.stringify({ message: prompt, mode: 'conversation' }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiResponse({
          reply: data.reply || 'こんにちは！ Nihomi Sensei is ready to assist your Japanese studies.',
          romaji: data.romaji,
          bengaliTranslation: data.bengaliTranslation,
        });
      } else {
        setAiResponse({
          reply: '日本語の質問をありがとうございます！\n\n「は (wa)」 marks the topic (what is being talked about), while 「が (ga)」 identifies the subject or new emphasis.',
          romaji: 'Watashi wa Tanaka desu. / Kore ga Nihon no bunka desu.',
          bengaliTranslation: '「は (wa)」মূল বিষয় বা টপিক চিহ্নিত করে, এবং「が (ga)」নির্দিষ্ট কর্তা বা নতুন গুরুত্ব বোঝায়। যেমন: わたしは 田中 です (আমি তানাকা)।',
        });
      }
    } catch (err) {
      setAiResponse({
        reply: 'こんにちは！ Nihomi AI Sensei is ready to assist you in English, বাংলা, and 日本語.',
        romaji: 'Konnichiwa! Nihomi Sensei desu.',
        bengaliTranslation: 'হ্যালো! নিহোমি সেনসেই আপনার যেকোনো জাপানি ভাষার প্রশ্নের উত্তর দিতে প্রস্তুত।',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    {
      label: 'は (wa) vs が (ga)',
      query: 'Explain the core difference between は (wa) and が (ga) with simple examples.',
    },
    {
      label: 'ください vs ちょうだい',
      query: 'Difference between ください (kudasai) and ちょうだい (choudai) in daily conversation.',
    },
    {
      label: 'Tokyo Baito Interview',
      query: 'Give me 3 essential self-introduction sentences for a Tokyo part-time job interview.',
    },
    {
      label: 'JLPT N5 Roadmap',
      query: 'What is the fastest 60-day plan to master JLPT N5 Kanji, Grammar and Vocab?',
    },
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-[calc(100vh-64px)] bg-[#FAF9F6] dark:bg-[#09090E] sepia:bg-[#fbf0d9] text-stone-900 dark:text-stone-100 sepia:text-amber-950 font-sans antialiased overflow-x-hidden selection:bg-red-500 selection:text-white transition-colors"
    >
      {/* Subtle Apple-style Ambient Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40 dark:opacity-25 transition-opacity duration-700"
        style={{
          background: `radial-gradient(650px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(220, 38, 38, 0.08), transparent 80%)`,
        }}
      />

      {/* ========================================================================= */}
      {/* 1. CHATGPT + APPLE INSPIRED HERO PROMPT INTERFACE                          */}
      {/* ========================================================================= */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 pb-8 sm:pt-20 sm:pb-12 max-w-4xl mx-auto w-full text-center space-y-8">
        
        {/* Minimalist Apple Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-white/80 dark:bg-stone-900/80 sepia:bg-[#fff9ed]/90 backdrop-blur-md text-stone-700 dark:text-stone-300 sepia:text-amber-900 text-xs font-semibold rounded-full border border-stone-200/80 dark:border-stone-800 sepia:border-[#ebdcc3] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-rose-500 animate-pulse"></span>
          <span className="font-mono text-[11px] tracking-wide font-medium">NIHOMI • 日本語学習OS v2.6</span>
          <span className="text-stone-300 dark:text-stone-700">|</span>
          <span className="text-[11px] text-stone-500 dark:text-stone-400">Multimodal Sensei</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-stone-950 dark:text-white sepia:text-amber-950 tracking-tight leading-[1.12]">
            What would you like <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 dark:from-red-500 dark:via-rose-400 dark:to-amber-300">
              to master today?
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-stone-500 dark:text-stone-400 sepia:text-stone-700 max-w-lg mx-auto font-normal leading-relaxed">
            Instant answers, pronunciation waveforms, stroke analysis, and visa guidance. In English, বাংলা, or 日本語.
          </p>
        </div>

        {/* ChatGPT Style Floating Prompt Hub */}
        <div className="w-full max-w-2xl space-y-4">
          <div className="bg-white dark:bg-stone-900/90 sepia:bg-[#fff9ed] rounded-3xl border border-stone-200 dark:border-stone-800 sepia:border-[#ebdcc3] shadow-lg shadow-stone-900/5 dark:shadow-black/40 focus-within:border-stone-900 dark:focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-stone-900/10 dark:focus-within:ring-rose-500/20 transition-all p-4 sm:p-5 text-left">
            <form onSubmit={handleAskNihomi} className="space-y-3">
              <textarea
                id="nihomi-central-prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAskNihomi();
                  }
                }}
                placeholder="Ask Nihomi anything... (e.g. 'How to use て-form', 'Bangla meaning of いただく', 'Job interview tips')"
                rows={2}
                className="w-full bg-transparent text-sm sm:text-base text-stone-900 dark:text-white sepia:text-amber-950 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-hidden resize-none leading-relaxed font-sans"
              />

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-2.5 border-t border-stone-100 dark:border-stone-800/80 sepia:border-[#ebdcc3]">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <button
                    id="btn-trigger-voice-modal"
                    type="button"
                    onClick={() => setIsVoiceActive(true)}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 sepia:bg-[#ebdcc3] text-stone-700 dark:text-stone-200 sepia:text-amber-950 text-xs font-semibold rounded-xl transition-all active:scale-95 cursor-pointer"
                    title="Voice Sensei Speech & Pitch Coach"
                  >
                    <Mic className="w-3.5 h-3.5 text-red-600 dark:text-rose-400" />
                    <span className="hidden sm:inline">Voice</span>
                  </button>

                  <button
                    id="btn-trigger-photo-ocr-modal"
                    type="button"
                    onClick={() => setIsCameraActive(true)}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 sepia:bg-[#ebdcc3] text-stone-700 dark:text-stone-200 sepia:text-amber-950 text-xs font-semibold rounded-xl transition-all active:scale-95 cursor-pointer"
                    title="Vision Sensei Photo OCR"
                  >
                    <Camera className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="hidden sm:inline">Photo OCR</span>
                  </button>

                  <button
                    id="btn-trigger-kanji-grid-modal"
                    type="button"
                    onClick={() => setIsWritingActive(true)}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 sepia:bg-[#ebdcc3] text-stone-700 dark:text-stone-200 sepia:text-amber-950 text-xs font-semibold rounded-xl transition-all active:scale-95 cursor-pointer"
                    title="Kanji Stroke Grid"
                  >
                    <PenTool className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="hidden sm:inline">Kanji Grid</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    id="btn-submit-prompt"
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="h-9 px-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-red-600 dark:hover:bg-red-500 text-white font-medium text-xs flex items-center space-x-1.5 transition-all active:scale-95 disabled:opacity-40 shadow-xs cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Ask</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Quick Suggestions Chips (ChatGPT Style) */}
          {!aiResponse && (
            <div className="flex items-center justify-center flex-wrap gap-2 text-[11px] text-stone-500 dark:text-stone-400 pt-1">
              <span className="font-semibold text-stone-400 dark:text-stone-500 font-mono text-[10px]">Try:</span>
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  id={`quick-prompt-${idx}`}
                  type="button"
                  onClick={() => {
                    setPrompt(item.query);
                  }}
                  className="px-3 py-1 bg-white/80 hover:bg-stone-100 dark:bg-stone-900/80 dark:hover:bg-stone-800 sepia:bg-[#fff9ed] border border-stone-200 dark:border-stone-800 sepia:border-[#ebdcc3] text-stone-700 dark:text-stone-300 sepia:text-amber-950 rounded-full transition-all active:scale-95 cursor-pointer shadow-2xs"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* Live AI Response Card */}
          {aiResponse && (
            <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 sepia:border-[#ebdcc3] shadow-md animate-in fade-in slide-in-from-top-2 duration-200 space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-red-600 text-white font-bold text-xs flex items-center justify-center font-japanese">
                    日
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-white sepia:text-amber-950 block">Nihomi Sensei</span>
                    <span className="text-[10px] text-stone-400 font-mono">Gemini Multimodal AI</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => speakJapanese(aiResponse.reply)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                    title="Play Audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    id="btn-close-ai-response"
                    type="button"
                    onClick={() => setAiResponse(null)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm sm:text-base text-stone-900 dark:text-stone-100 sepia:text-amber-950 leading-relaxed font-japanese whitespace-pre-line">
                {aiResponse.reply}
              </div>

              {aiResponse.romaji && (
                <div className="text-xs font-mono text-stone-500 dark:text-stone-400 italic">
                  Reading: {aiResponse.romaji}
                </div>
              )}

              {aiResponse.bengaliTranslation && (
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 sepia:bg-[#ebdcc3] rounded-2xl border border-stone-200/80 dark:border-stone-700 sepia:border-[#d9cbaf] text-xs text-stone-700 dark:text-stone-300 sepia:text-amber-950 leading-relaxed">
                  <strong className="text-stone-900 dark:text-white sepia:text-amber-950 block text-[10px] uppercase font-bold tracking-wider mb-1 font-mono">
                    বাংলা অনুবাদ ও ব্যাখ্যা:
                  </strong>
                  {aiResponse.bengaliTranslation}
                </div>
              )}
            </div>
          )}

          {/* Next Step Recommendation Pill */}
          <div className="bg-white/80 dark:bg-stone-900/80 sepia:bg-[#fff9ed] rounded-2xl p-4 border border-stone-200 dark:border-stone-800 sepia:border-[#ebdcc3] shadow-xs text-left flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-rose-950/60 sepia:bg-[#ebdcc3] border border-red-200/80 dark:border-rose-900 text-red-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center space-x-1 text-[10px] font-bold text-red-600 dark:text-rose-400 uppercase tracking-wider font-mono">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>Next Recommended Step</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white sepia:text-amber-950 truncate">
                  Minna no Nihongo • Lesson 12 Listening & Grammar
                </h4>
              </div>
            </div>

            <button
              id="btn-hero-continue-lesson"
              type="button"
              onClick={() => onNavigate('portal')}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 dark:bg-red-600 dark:hover:bg-red-500 text-white font-medium text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center space-x-1 cursor-pointer shrink-0"
            >
              <span>Continue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {user ? (
            <button
              type="button"
              onClick={() => onNavigate('portal')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all active:scale-95 flex items-center space-x-2 cursor-pointer"
            >
              <span>Open Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigate('auth', { mode: 'register' })}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all active:scale-95 flex items-center space-x-2 cursor-pointer"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('auth', { mode: 'login' })}
                className="px-5 py-3 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-white text-xs font-bold rounded-2xl border border-stone-300 dark:border-stone-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                Log In
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="px-5 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-2xl border border-stone-200 dark:border-stone-700 transition-all active:scale-95 flex items-center space-x-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-red-600" />
            <span>Curriculum (N5–N1)</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PROGRESS TRACKER & MASTERY RADAR                                       */}
      {/* ========================================================================= */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <LanguageProgressTracker
          initialLevel="N5"
          onNavigate={onNavigate}
        />
      </section>

      {/* ========================================================================= */}
      {/* 3. THE 3 CONNECTED PATHWAYS (APPLE BENTO GRID)                            */}
      {/* ========================================================================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 dark:text-rose-400 font-mono">
            UNIFIED LEARNING ECOSYSTEM
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 dark:text-white sepia:text-amber-950">
            3 Connected Learning Pathways
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            Autonomous AI guidance, live certified Tokyo masterclasses, and physical academy classrooms coordinated in one passport.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {/* Pathway 1 */}
          <div className="p-6 bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] rounded-3xl border border-stone-200/80 dark:border-stone-800 sepia:border-[#ebdcc3] shadow-xs hover:border-red-500/50 transition-all space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-rose-950/60 border border-red-200 dark:border-rose-900 text-red-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900 dark:text-white sepia:text-amber-950">
                01. NIHOMI AI Sensei
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 sepia:text-stone-800 leading-relaxed">
                24/7 multimodal tutor with camera OCR, pitch accent visualizer, and automated MemoryOS™ error recovery.
              </p>
            </div>
            <ul className="text-[11px] text-stone-500 dark:text-stone-400 space-y-1.5 pt-3 border-t border-stone-100 dark:border-stone-800">
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Instant Voice & Photo OCR Help</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Ebbinghaus Spaced Repetition</span>
              </li>
            </ul>
          </div>

          {/* Pathway 2 */}
          <div className="p-6 bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] rounded-3xl border border-stone-200/80 dark:border-stone-800 sepia:border-[#ebdcc3] shadow-xs hover:border-blue-500/50 transition-all space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900 dark:text-white sepia:text-amber-950">
                02. LIVE Masterclasses
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 sepia:text-stone-800 leading-relaxed">
                Weekend interactive live cohorts with Tanvir Kabir Biplob & certified Tokyo instructors. Real visa interview drills.
              </p>
            </div>
            <ul className="text-[11px] text-stone-500 dark:text-stone-400 space-y-1.5 pt-3 border-t border-stone-100 dark:border-stone-800">
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Interactive Weekend Cohorts</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Visa Skype Interview Simulations</span>
              </li>
            </ul>
          </div>

          {/* Pathway 3 */}
          <div className="p-6 bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] rounded-3xl border border-stone-200/80 dark:border-stone-800 sepia:border-[#ebdcc3] shadow-xs hover:border-emerald-500/50 transition-all space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900 dark:text-white sepia:text-amber-950">
                03. DILS Academy & Visa
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 sepia:text-stone-800 leading-relaxed">
                Dhaka International Language School physical multimedia classrooms + 6-stage end-to-end Japan Student Visa & COE support.
              </p>
            </div>
            <ul className="text-[11px] text-stone-500 dark:text-stone-400 space-y-1.5 pt-3 border-t border-stone-100 dark:border-stone-800">
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>On-Campus Physical Classes</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>COE Document Legalization</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Logistics & Ebook Integrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-left text-xs">
          <div className="p-5 bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] rounded-2xl border border-stone-200 dark:border-stone-800 sepia:border-[#ebdcc3] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-red-600 dark:text-rose-400 font-bold">
                <Plane className="w-4 h-4" />
                <span>bdTrip24.com Flight Logistics</span>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-[11px]">46 KG student luggage allowance & Tokyo/Osaka airport pickup support.</p>
            </div>
            <a
              href="https://bdtrip24.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-white text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 inline-flex items-center space-x-1 shrink-0"
            >
              <span>bdTrip24</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>

          <div className="p-5 bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] rounded-2xl border border-stone-200 dark:border-stone-800 sepia:border-[#ebdcc3] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-stone-900 dark:text-white font-bold">
                <ShoppingBag className="w-4 h-4 text-amber-500" />
                <span>Official Nihomi Ebook Store</span>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-[11px]">Verified N5–N1 digital workbooks & workplace Keigo handbooks.</p>
            </div>
            <a
              href="https://shop.nihomi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-white text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 inline-flex items-center space-x-1 shrink-0"
            >
              <span>Ebook Store</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MODALS (VOICE SENSEI, CAMERA OCR, KANJI WRITING CANVAS, SRS)            */}
      {/* ========================================================================= */}
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

      {isSRSActive && (
        <SRSFlashcardSession
          isOpen={isSRSActive}
          onClose={() => setIsSRSActive(false)}
        />
      )}
    </div>
  );
};
