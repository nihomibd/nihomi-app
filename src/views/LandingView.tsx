import React, { useState } from 'react';
import {
  Mic,
  Camera,
  PenTool,
  ArrowRight,
  Loader2,
  Sparkles,
  Headphones,
  BookOpen,
  CheckCircle2,
  X,
  Volume2,
  Layers,
  GraduationCap,
  Building2,
  Plane,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Target,
  Compass,
  Check,
  Award,
  Zap,
  Globe2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
  const { user, openAuthModal } = useAuth();
  
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
  const [showEcosystemDetails, setShowEcosystemDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'live' | 'academy'>('ai');

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
        // High-precision pedagogical fallback
        setAiResponse({
          reply: '日本語の質問をありがとうございます！(Thank you for your question!)\n\n「は (wa)」 marks the topic of the sentence (what we are talking about), while 「が (ga)」 specifies the grammatical subject or introduces new crucial information.\nExample: わたしは 田中 です (As for me, I am Tanaka) vs だれが きましたか (Who came?).',
          romaji: 'Watashi wa Tanaka desu / Dare ga kimashita ka?',
          bengaliTranslation: '「は (wa)」বাক্যের মূল বিষয় (টপিক) এবং「が (ga)」নির্দিষ্ট কর্তা বা নতুন তথ্য প্রকাশের ক্ষেত্রে ব্যবহৃত হয়। যেমন: わたしは 田中 です (আমি তানাকা) বনাম だれが きましたか (কে এসেছে?)।',
        });
      }
    } catch (err) {
      setAiResponse({
        reply: 'こんにちは！(Konnichiwa!) Nihomi Sensei is active and ready to teach.',
        romaji: 'Konnichiwa! Nihomi Sensei desu.',
        bengaliTranslation: 'হ্যালো! নিহোমি সেনসেই আপনাকে জাপানি ভাষা ও সংস্কৃতি শেখাতে সম্পূর্ণ প্রস্তুত।',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (q: string) => {
    setPrompt(q);
  };

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] text-stone-900 dark:text-stone-100 sepia:text-amber-950 min-h-[calc(100vh-64px)] flex flex-col justify-between font-sans antialiased selection:bg-red-500 selection:text-white transition-colors">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: APPLE / MUJI-INSPIRED MINIMALIST LEARNING INTERFACE       */}
      {/* ========================================================================= */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-16 max-w-5xl mx-auto w-full text-center space-y-8">
        
        {/* Brand Core Identity Pill & Heading */}
        <div className="space-y-3 select-none max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-white dark:bg-stone-900 sepia:bg-[#f0e4cc] text-stone-700 dark:text-stone-300 sepia:text-amber-950 text-xs font-semibold rounded-full border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-rose-500 animate-pulse"></span>
            <span className="font-mono tracking-wider text-[11px] font-bold">NIHOMI • 日本語学習オペレーティングシステム</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-stone-950 dark:text-white sepia:text-amber-950 tracking-tight leading-[1.15]">
            What would you like <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-600">to learn today?</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-stone-500 dark:text-stone-400 sepia:text-stone-700 max-w-xl mx-auto font-normal leading-relaxed">
            From your first <span className="font-japanese font-semibold text-red-600 dark:text-rose-400">ひらがな</span> to workplace fluency and Japan visa readiness. Nihomi coordinates every step.
          </p>
        </div>

        {/* Central Cognitive Prompt Hub */}
        <div className="w-full max-w-2xl space-y-4">
          <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] rounded-3xl border border-stone-200/90 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-sm hover:shadow-md focus-within:border-stone-900 dark:focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-stone-900/10 transition-all p-5 sm:p-6 text-left">
            <form onSubmit={handleAskNihomi} className="space-y-4">
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
                placeholder="Ask Nihomi Sensei in English, বাংলা, or 日本語..."
                rows={2}
                className="w-full bg-transparent text-sm sm:text-base text-stone-900 dark:text-white sepia:text-amber-950 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-hidden resize-none leading-relaxed font-sans"
              />

              {/* Action Buttons inside Input */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800 sepia:border-[#ebdcc3]">
                <div className="flex items-center space-x-2 text-stone-600 dark:text-stone-300">
                  <button
                    id="btn-trigger-voice-modal"
                    type="button"
                    onClick={() => setIsVoiceActive(true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-50 dark:bg-stone-800/80 sepia:bg-[#f0e4cc] hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 sepia:text-amber-950 text-xs font-semibold rounded-xl border border-stone-200/80 dark:border-stone-700 sepia:border-[#d9cbaf] transition-colors cursor-pointer"
                    title="Voice Sensei Accent & Pitch Coach"
                  >
                    <Mic className="w-3.5 h-3.5 text-red-600 dark:text-rose-400" />
                    <span>Voice</span>
                  </button>

                  <button
                    id="btn-trigger-photo-ocr-modal"
                    type="button"
                    onClick={() => setIsCameraActive(true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-50 dark:bg-stone-800/80 sepia:bg-[#f0e4cc] hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 sepia:text-amber-950 text-xs font-semibold rounded-xl border border-stone-200/80 dark:border-stone-700 sepia:border-[#d9cbaf] transition-colors cursor-pointer"
                    title="Vision Sensei Photo OCR"
                  >
                    <Camera className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Photo OCR</span>
                  </button>

                  <button
                    id="btn-trigger-kanji-grid-modal"
                    type="button"
                    onClick={() => setIsWritingActive(true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-50 dark:bg-stone-800/80 sepia:bg-[#f0e4cc] hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 sepia:text-amber-950 text-xs font-semibold rounded-xl border border-stone-200/80 dark:border-stone-700 sepia:border-[#d9cbaf] transition-colors cursor-pointer"
                    title="Kanji Stroke Grid"
                  >
                    <PenTool className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Kanji Grid</span>
                  </button>
                </div>

                <button
                  id="btn-submit-prompt"
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-red-600 hover:bg-stone-800 dark:hover:bg-red-700 disabled:opacity-40 text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs cursor-pointer shrink-0"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 text-red-400 dark:text-rose-200" />}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Suggestions Chips */}
          {!aiResponse && (
            <div className="flex items-center justify-center flex-wrap gap-2 text-[11px] text-stone-500 dark:text-stone-400 pt-1">
              <span className="font-bold text-stone-400 dark:text-stone-500 font-mono">Suggestions:</span>
              {[
                'Explain は (wa) vs が (ga)',
                'Difference between ください and ちょうだい',
                'How to introduce myself in Tokyo interview',
              ].map((q, idx) => (
                <button
                  key={idx}
                  id={`quick-suggestion-chip-${idx}`}
                  type="button"
                  onClick={() => handleQuickPrompt(q)}
                  className="px-3 py-1 bg-white dark:bg-stone-800 sepia:bg-[#fff9ed] hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] text-stone-700 dark:text-stone-200 sepia:text-amber-950 rounded-full transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Live AI Response Card */}
          {aiResponse && (
            <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-red-600 text-white font-bold text-xs flex items-center justify-center font-japanese">
                    日
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-white sepia:text-amber-950 block">Nihomi Sensei</span>
                    <span className="text-[10px] text-stone-400 font-mono">Gemini 2.5 Multimodal Engine</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => speakJapanese(aiResponse.reply)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                    title="Play Native Pronunciation"
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
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 sepia:bg-[#f0e4cc] rounded-2xl border border-stone-200/80 dark:border-stone-700 sepia:border-[#d9cbaf] text-xs text-stone-700 dark:text-stone-300 sepia:text-amber-950 leading-relaxed">
                  <strong className="text-stone-900 dark:text-white sepia:text-amber-950 block text-[10px] uppercase font-bold tracking-wider mb-1 font-mono">বাংলা অনুবাদ ও ব্যাখ্যা:</strong>
                  {aiResponse.bengaliTranslation}
                </div>
              )}
            </div>
          )}

          {/* Next Best Step Card */}
          <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] rounded-3xl p-5 border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs text-left flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-rose-950/60 sepia:bg-[#ebdcc3] border border-red-200/80 dark:border-rose-900 sepia:border-[#d9cbaf] text-red-600 dark:text-rose-400 sepia:text-amber-900 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="inline-flex items-center space-x-1 text-[10px] font-bold text-red-600 dark:text-rose-400 sepia:text-amber-900 uppercase tracking-wider font-mono">
                  <Sparkles className="w-3 h-3" />
                  <span>Your Next Best Step</span>
                </div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-white sepia:text-amber-950">
                  Listening • Minna no Nihongo Lesson 12
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 sepia:text-stone-700">
                  5 min spaced repetition review due today based on your Learning DNA
                </p>
              </div>
            </div>

            <button
              id="btn-continue-next-best-step"
              type="button"
              onClick={() => onNavigate('portal')}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-red-600 dark:hover:bg-red-700 sepia:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1 cursor-pointer shrink-0"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 text-red-400 dark:text-rose-200" />
            </button>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {user ? (
            <button
              type="button"
              onClick={() => onNavigate('portal')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Open My Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigate('auth', { mode: 'register' })}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('auth', { mode: 'login' })}
                className="px-5 py-3 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-white text-xs font-bold rounded-2xl border border-stone-300 dark:border-stone-700 shadow-2xs transition-all cursor-pointer"
              >
                Student Log in
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="px-5 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-2xl border border-stone-200 dark:border-stone-700 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-red-600" />
            <span>Explore Full Curriculum (N5–N1)</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PROGRESS TRACKER & JLPT MASTERY RADAR                                  */}
      {/* ========================================================================= */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <LanguageProgressTracker
          initialLevel="N5"
          onNavigate={onNavigate}
        />
      </section>

      {/* ========================================================================= */}
      {/* 3. THE 3 CONNECTED PATHWAYS (BENTO GRID ARCHITECTURE)                     */}
      {/* ========================================================================= */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 dark:text-rose-400 font-mono">
            UNIFIED LEARNING ECOSYSTEM
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 dark:text-white sepia:text-amber-950">
            3 Connected Japanese Learning Pathways
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            Nihomi coordinates 24/7 autonomous AI, live Tokyo masterclasses, and physical academy classrooms into a single passport.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Pathway 1 */}
          <div className="p-6 bg-white dark:bg-stone-900 sepia:bg-[#f0e4cc] rounded-3xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-xs hover:border-red-500/50 transition-all space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-rose-950/60 border border-red-200 dark:border-rose-900 text-red-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-stone-900 dark:text-white sepia:text-amber-950">
                01. NIHOMI AI Sensei
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 sepia:text-stone-800 leading-relaxed">
                Multimodal Gemini 2.5 tutor with camera photo OCR, real-time Tokyo pitch waveform analysis, and automated MemoryOS™ error tracking.
              </p>
            </div>
            <ul className="text-[11px] text-stone-500 dark:text-stone-400 space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>24/7 Instant Voice & Photo Help</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Ebbinghaus SRS Memory Recovery</span>
              </li>
            </ul>
          </div>

          {/* Pathway 2 */}
          <div className="p-6 bg-white dark:bg-stone-900 sepia:bg-[#f0e4cc] rounded-3xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-xs hover:border-blue-500/50 transition-all space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-stone-900 dark:text-white sepia:text-amber-950">
                02. NIHOMI LIVE Masterclasses
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 sepia:text-stone-800 leading-relaxed">
                Interactive weekend live cohorts with Founder Tanvir Kabir Biplob & certified native Tokyo instructors. Skype interview simulations.
              </p>
            </div>
            <ul className="text-[11px] text-stone-500 dark:text-stone-400 space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Live Interactive Cohorts</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Japanese Visa Interview Drills</span>
              </li>
            </ul>
          </div>

          {/* Pathway 3 */}
          <div className="p-6 bg-white dark:bg-stone-900 sepia:bg-[#f0e4cc] rounded-3xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-xs hover:border-emerald-500/50 transition-all space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-stone-900 dark:text-white sepia:text-amber-950">
                03. DILS Academy & Visa Desk
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 sepia:text-stone-800 leading-relaxed">
                Dhaka International Language School (Farmgate & Banani) physical multimedia classrooms + 6-stage end-to-end Japan Student Visa & COE support.
              </p>
            </div>
            <ul className="text-[11px] text-stone-500 dark:text-stone-400 space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
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

        {/* Logistics & Ebook Store Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-left text-xs">
          <div className="p-5 bg-white dark:bg-stone-900 sepia:bg-[#f0e4cc] rounded-2xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-red-600 dark:text-rose-400 font-bold">
                <Plane className="w-4 h-4" />
                <span>bdTrip24.com Student Flight Logistics</span>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-[11px]">46 KG baggage allowance & Tokyo/Osaka airport pickup support.</p>
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

          <div className="p-5 bg-white dark:bg-stone-900 sepia:bg-[#f0e4cc] rounded-2xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-stone-900 dark:text-white font-bold">
                <ShoppingBag className="w-4 h-4 text-amber-500" />
                <span>Official Nihomi Master Ebook Store</span>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-[11px]">Download verified N5–N1 workbooks & workplace Keigo handbooks.</p>
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
      {/* 4. MULTIMODAL MODALS (VOICE SENSEI, CAMERA OCR, KANJI CANVAS, SRS FLASHCARDS) */}
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
