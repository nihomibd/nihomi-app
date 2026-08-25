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
  Globe,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { VisionSenseiModal } from '../components/VisionSenseiModal.js';
import { KanjiWritingModal } from '../components/student/KanjiWritingModal.js';
import { SRSFlashcardSession } from '../components/practice/SRSFlashcardSession.js';
import { VoiceSenseiPractice } from '../components/practice/VoiceSenseiPractice.js';
import { LanguageProgressTracker } from '../components/LanguageProgressTracker.js';
import { speakJapanese } from '../lib/tts.js';

interface LandingViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  
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

  // Cyberpunk Neo-Tokyo Canvas Particle Background Effect
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const characters = '日日本語学習オペレーティングシステムあいうえおかきくけこサシスセソタチツテト1026⚡';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -height);
    }

    const render = () => {
      ctx.fillStyle = 'rgba(5, 5, 9, 0.12)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(220, 38, 38, 0.35)'; // Neo-Tokyo Vermilion Red glow
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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
          reply: data.reply || 'こんにちは！ Nihomi Neural Sensei is online and synchronized.',
          romaji: data.romaji,
          bengaliTranslation: data.bengaliTranslation,
        });
      } else {
        setAiResponse({
          reply: '日本語の質問をありがとうございます！\n\n「は (wa)」 marks the thematic focus of the sentence, whereas 「が (ga)」 highlights the specific grammatical subject or new vital information.',
          romaji: 'Watashi wa Nihomi desu / Kore ga saikō desu.',
          bengaliTranslation: '「は (wa)」 বাক্যের মূল টপিক বা বিষয় এবং「が (ga)」 নির্দিষ্ট কর্তা বা নতুন তথ্য চিহ্নিত করতে ব্যবহৃত হয়।',
        });
      }
    } catch (err) {
      setAiResponse({
        reply: 'こんにちは！ Nihomi Neural Core is ready for your query.',
        romaji: 'Konnichiwa! Nihomi Sensei desu.',
        bengaliTranslation: 'হ্যালো! নিহোমি সেনসেই আপনার জাপানি ভাষা শিক্ষার জন্য সম্পূর্ণরূপে প্রস্তুত।',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-[#050509] text-stone-100 font-sans antialiased overflow-x-hidden selection:bg-red-600 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. CINEMATIC CYBER-JAPANESE CANVAS BACKGROUND                             */}
      {/* ========================================================================= */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen"
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#050509]/80 via-[#050509]/60 to-[#050509] pointer-events-none z-0" />

      {/* ========================================================================= */}
      {/* 2. HERO SECTION & CENTRAL NEURAL AI PROMPT HUB                            */}
      {/* ========================================================================= */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-5xl mx-auto w-full text-center space-y-10">
        
        {/* Glowing Japanese OS Badge */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-2 bg-stone-900/80 backdrop-blur-xl text-stone-200 text-xs font-semibold rounded-full border border-red-500/30 shadow-[0_0_25px_rgba(220,38,38,0.2)] animate-pulse">
          <Cpu className="w-3.5 h-3.5 text-red-500" />
          <span className="font-mono tracking-wider text-[11px] font-bold">NIHOMI • 日本語学習オペレーティングシステム v2.6</span>
        </div>

        {/* Cinematic Title */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Master Japanese with <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 drop-shadow-[0_0_35px_rgba(220,38,38,0.4)]">
              Neural Precision
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-stone-400 max-w-2xl mx-auto font-light leading-relaxed">
            From your first <span className="font-japanese text-red-400 font-medium">ひらがな</span> to Tokyo workplace fluency and visa readiness. Powered by advanced multimodal intelligence.
          </p>
        </div>

        {/* Glassmorphic Central AI Prompt Hub */}
        <div className="w-full max-w-2xl space-y-4">
          <div className="bg-stone-900/70 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] hover:border-red-500/50 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all p-5 sm:p-6 text-left">
            <form onSubmit={handleAskNihomi} className="space-y-4">
              <textarea
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
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-stone-500 focus:outline-hidden resize-none leading-relaxed font-sans"
              />

              {/* Action Modals Triggers inside Box */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsVoiceActive(true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold rounded-xl border border-white/10 transition-colors cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 text-red-500" />
                    <span>Voice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCameraActive(true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold rounded-xl border border-white/10 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-blue-400" />
                    <span>Photo OCR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsWritingActive(true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold rounded-xl border border-white/10 transition-colors cursor-pointer"
                  >
                    <PenTool className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kanji Grid</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 text-white flex items-center justify-center transition-transform active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer shrink-0"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 text-white" />}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Suggestions Chips */}
          {!aiResponse && (
            <div className="flex items-center justify-center flex-wrap gap-2 text-[11px] text-stone-400 pt-1">
              <span className="font-mono text-stone-500">Quick Prompts:</span>
              {[
                'Explain は (wa) vs が (ga)',
                'Difference between ください and ちょうだい',
                'How to introduce myself in Tokyo interview',
              ].map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(q)}
                  className="px-3 py-1 bg-stone-900/60 backdrop-blur-md hover:bg-stone-800 border border-white/10 text-stone-300 rounded-full transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Live AI Response Card */}
          {aiResponse && (
            <div className="bg-stone-900/90 backdrop-blur-2xl rounded-3xl p-6 border border-red-500/40 shadow-[0_0_40px_rgba(220,38,38,0.2)] space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center font-japanese shadow-[0_0_15px_rgba(220,38,38,0.6)]">
                    日
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Nihomi Neural Sensei</span>
                    <span className="text-[10px] text-stone-400 font-mono">Gemini Multimodal Engine</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => speakJapanese(aiResponse.reply)}
                    className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
                    title="Play Audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiResponse(null)}
                    className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm sm:text-base text-stone-100 font-japanese whitespace-pre-line leading-relaxed">
                {aiResponse.reply}
              </div>

              {aiResponse.romaji && (
                <div className="text-xs font-mono text-rose-400 italic">
                  Reading: {aiResponse.romaji}
                </div>
              )}

              {aiResponse.bengaliTranslation && (
                <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10 text-xs text-stone-300 leading-relaxed">
                  <strong className="text-rose-400 block text-[10px] uppercase font-bold tracking-wider mb-1 font-mono">বাংলা অনুবাদ ও ব্যাখ্যা:</strong>
                  {aiResponse.bengaliTranslation}
                </div>
              )}
            </div>
          )}

          {/* Next Best Step Glass Card */}
          <div className="bg-stone-900/70 backdrop-blur-2xl rounded-3xl p-5 border border-white/10 shadow-lg text-left flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="inline-flex items-center space-x-1 text-[10px] font-bold text-red-400 uppercase tracking-wider font-mono">
                  <Sparkles className="w-3 h-3" />
                  <span>Your Next Best Step</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Listening • Minna no Nihongo Lesson 12
                </h4>
                <p className="text-[11px] text-stone-400">
                  5 min spaced repetition review due today based on your Learning DNA
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('portal')}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all flex items-center space-x-1 cursor-pointer shrink-0"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {user ? (
            <button
              type="button"
              onClick={() => onNavigate('portal')}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-2xl shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Open My Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigate('auth', { mode: 'register' })}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-2xl shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('auth', { mode: 'login' })}
                className="px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-2xl border border-white/10 shadow-lg transition-all cursor-pointer"
              >
                Student Log in
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="px-5 py-3 bg-stone-900/60 hover:bg-stone-800 text-stone-300 text-xs font-bold rounded-2xl border border-white/10 transition-all flex items-center space-x-2 cursor-pointer backdrop-blur-md"
          >
            <BookOpen className="w-4 h-4 text-red-500" />
            <span>Explore Full Curriculum (N5–N1)</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LANGUAGE PROGRESS TRACKER & MASTERY RADAR                              */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <LanguageProgressTracker
          initialLevel="N5"
          onNavigate={onNavigate}
        />
      </section>

      {/* ========================================================================= */}
      {/* 4. 3 CONNECTED PATHWAYS (BENTO GRID ARCHITECTURE)                         */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-500 font-mono">
            UNIFIED LEARNING ECOSYSTEM
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            3 Connected Japanese Learning Pathways
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
            Nihomi coordinates 24/7 autonomous AI, live Tokyo masterclasses, and physical academy classrooms into a single passport.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Pathway 1 */}
          <div className="p-6 bg-stone-900/70 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-xl hover:border-red-500/50 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white">
                01. NIHOMI AI Sensei
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Multimodal Gemini tutor with camera photo OCR, real-time Tokyo pitch waveform analysis, and automated MemoryOS error tracking.
              </p>
            </div>
            <ul className="text-[11px] text-stone-400 space-y-1.5 pt-2 border-t border-white/10">
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>24/7 Instant Voice & Photo Help</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Ebbinghaus SRS Memory Recovery</span>
              </li>
            </ul>
          </div>

          {/* Pathway 2 */}
          <div className="p-6 bg-stone-900/70 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-xl hover:border-blue-500/50 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white">
                02. NIHOMI LIVE Masterclasses
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Interactive weekend live cohorts with Founder Tanvir Kabir Biplob & certified native Tokyo instructors. Skype interview simulations.
              </p>
            </div>
            <ul className="text-[11px] text-stone-400 space-y-1.5 pt-2 border-t border-white/10">
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Live Interactive Cohorts</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Japanese Visa Interview Drills</span>
              </li>
            </ul>
          </div>

          {/* Pathway 3 */}
          <div className="p-6 bg-stone-900/70 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-xl hover:border-emerald-500/50 transition-all space-y-4 group">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white">
                03. DILS Academy & Visa Desk
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Dhaka International Language School physical multimedia classrooms + 6-stage end-to-end Japan Student Visa & COE support.
              </p>
            </div>
            <ul className="text-[11px] text-stone-400 space-y-1.5 pt-2 border-t border-white/10">
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>On-Campus Physical Classes</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>COE Document Legalization</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Logistics & Ebook Store Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-left text-xs">
          <div className="p-5 bg-stone-900/70 backdrop-blur-2xl rounded-2xl border border-white/10 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-red-400 font-bold">
                <Plane className="w-4 h-4" />
                <span>bdTrip24.com Student Flight Logistics</span>
              </div>
              <p className="text-stone-400 text-[11px]">46 KG baggage allowance & Tokyo/Osaka airport pickup support.</p>
            </div>
            <a
              href="https://bdtrip24.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 inline-flex items-center space-x-1 shrink-0 transition-colors"
            >
              <span>bdTrip24</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>

          <div className="p-5 bg-stone-900/70 backdrop-blur-2xl rounded-2xl border border-white/10 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <ShoppingBag className="w-4 h-4" />
                <span>Official Nihomi Master Ebook Store</span>
              </div>
              <p className="text-stone-400 text-[11px]">Download verified N5–N1 workbooks & workplace Keigo handbooks.</p>
            </div>
            <a
              href="https://shop.nihomi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 inline-flex items-center space-x-1 shrink-0 transition-colors"
            >
              <span>Ebook Store</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MULTIMODAL MODALS                                                      */}
      {/* ========================================================================= */}
      {isVoiceActive && (
        <VoiceSenseiPractice isOpen={isVoiceActive} onClose={() => setIsVoiceActive(false)} />
      )}
      {isCameraActive && (
        <VisionSenseiModal isOpen={isCameraActive} onClose={() => setIsCameraActive(false)} />
      )}
      {isWritingActive && (
        <KanjiWritingModal
          isOpen={isWritingActive}
          onClose={() => setIsWritingActive(false)}
          targetKanji={{ kanji: '日', hiragana: 'にち・ひ', english: 'Sun, Day, Japan', strokes: 4 }}
        />
      )}
      {isSRSActive && (
        <SRSFlashcardSession isOpen={isSRSActive} onClose={() => setIsSRSActive(false)} />
      )}

    </div>
  );
};
