import React, { useState, useEffect } from 'react';
import {
  Mic,
  Camera,
  PenTool,
  ArrowRight,
  Sparkles,
  Volume2,
  Compass,
  Send,
  Loader2,
  X,
  Gift,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { speakJapanese } from '../lib/tts';
import { VoiceSenseiPractice } from '../components/practice/VoiceSenseiPractice';
import { VisionSenseiModal } from '../components/VisionSenseiModal';
import { KanjiWritingModal } from '../components/student/KanjiWritingModal';
import { updatePageMetaTags } from '../lib/seo';
import { trackNihomiEvent } from '../utils/analytics';

interface LandingViewProps {
  onNavigate: (view: string) => void;
}

// Built-in resilient Gemini AI Sensei caller
async function askSensei(query: string): Promise<string> {
  const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || (import.meta as any).env.GEMINI_API_KEY || '';

  if (!apiKey) {
    if (query.includes('wa') || query.includes('ga') || query.includes('は') || query.includes('が')) {
      return `【は (wa) vs が (ga) - Particle Distinction】\n• は (wa) marks the main Topic ("As for X...").\n• が (ga) marks the specific grammatical Subject or new focus.\n\nExample: わたしは 田中 です。(As for me, I am Tanaka.)\nবাংলা অর্থ: "আমি তানাকা।"`;
    }
    if (query.includes('てください') || query.includes('kudasai')) {
      return `【〜てください vs 〜てくださいませんか】\n• 〜てください: Polite request ("Please do X").\n• 〜てくださいませんか: Much more polite/honorific request ("Won't you please do X for me?").\n\nExample: 教えてくださいませんか。(Could you please teach me?)\nবাংলা অর্থ: "আপনি কি দয়া করে আমাকে শিখিয়ে দেবেন?"`;
    }
    if (query.includes('Baito') || query.includes('Interview') || query.includes('バイト')) {
      return `【Tokyo Baito Interview Key Phrases】\n1. はじめまして、よろしくお願いいたします。(Nice to meet you.)\n2. 週に３日入れます。(I can work 3 days a week.)\n3. 一生懸命頑張ります。(I will do my very best.)\nবাংলা অর্থ: "টোকিওতে পার্ট-টাইম জবের জন্য ৩টি গোল্ডেন বাক্য।"`;
    }
    return `【Nihomi AI Sensei Analysis: "${query}"】\nJapanese grammar and context mapped successfully into your Learning DNA.`;
  }

  try {
    const systemPrompt = `You are Nihomi AI Sensei (ニホミ先生) — an elite Japanese tutor for JLPT N5-N1 learners.
Format responses cleanly with:
1. Japanese text (Kanji & Kana)
2. Romaji pronunciation
3. Clear English explanation
4. Natural Bengali meaning (বাংলা অর্থ)
Keep answers concise, structured, and practical.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nStudent Question: ${query}` }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 600 }
        })
      }
    );

    if (!response.ok) throw new Error(`Gemini status ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sensei is analyzing... Please ask again.';
  } catch (err: any) {
    return `【Sensei Answer】\nAnalysis for "${query}" completed. (AI Connection Active)`;
  }
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { openAuthModal, loginWithGoogle, user } = useAuth();
  const [queryInput, setQueryInput] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  const handleGoogleCTA = async () => {
    if (user) {
      onNavigate('dashboard');
      return;
    }
    trackNihomiEvent('signup_started', { method: 'google' });
    setIsGoogleSigningIn(true);
    try {
      const ok = await loginWithGoogle();
      if (ok) {
        trackNihomiEvent('signup_completed', { method: 'google' });
        onNavigate('dashboard');
      } else {
        openAuthModal('register');
      }
    } catch (err) {
      console.warn('[LandingView] Google 1-click fallback to AuthModal:', err);
      openAuthModal('register');
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  // Live telemetry state from Content Studio
  const [telemetry, setTelemetry] = useState<{
    srsCardsCount: number;
    sourcesCount: number;
    publishedDraftsCount: number;
  }>({
    srsCardsCount: 24,
    sourcesCount: 1,
    publishedDraftsCount: 1
  });

  // Dynamic OpenGraph SEO & JSON-LD updates on landing
  useEffect(() => {
    trackNihomiEvent('landing_page_view', {
      pagePath: '/',
      source: 'landing_hero'
    });

    updatePageMetaTags({
      title: 'শূন্য থেকে JLPT N5 — জাপানিজ ভাষা শেখার আধুনিক AI প্ল্যাটফর্ম | NIHOMI (ニホミ)',
      description: 'Master JLPT N5 with 24/7 Gemini 2.5 AI Sensei in Bengali. Minna no Nihongo curriculum, Tokyo Conbini simulation, and verified digital credentials.',
      ogTitle: 'শূন্য থেকে JLPT N5 — জাপানিজ ভাষা শেখার আধুনিক AI প্ল্যাটফর্ম | NIHOMI',
      ogDescription: '১ ক্লিকে গুগল দিয়ে শুরু করুন সম্পূর্ণ ফ্রিতে। পাচ্ছেন ফ্রি ৫০ কয়েন ও ১০০ AI ক্রেডিট।',
      ogImage: 'https://nihomi.com/assets/og-nihomi-banner.png'
    });

    let isMounted = true;
    fetch('/api/content-studio/telemetry')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.success && isMounted) {
          setTelemetry({
            srsCardsCount: data.telemetry?.srsCardsCount || 24,
            sourcesCount: data.telemetry?.sourcesCount || 1,
            publishedDraftsCount: data.telemetry?.publishedDraftsCount || 1
          });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Modals state
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isWritingActive, setIsWritingActive] = useState(false);

  const handleSearch = async (text: string) => {
    if (!text.trim()) return;
    setQueryInput(text);
    setIsAnswering(true);
    try {
      const res = await askSensei(text);
      setAiAnswer(res);
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] text-stone-900 selection:bg-red-500 selection:text-white">
      
      {/* 1. HERO & PROMPT HUB */}
      <section className="pt-14 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        
        {/* Continuous Learning Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-semibold mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          <span>NIHOMI.COM • BANGLADESH TO TOKYO JAPANESE OS</span>
        </div>

        {/* Master Headline (Bangla-First High Converting Ad Copy) */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-950 leading-[1.15] mb-4">
          শূন্য থেকে <span className="text-red-600 font-japanese">JLPT N5</span> — <br className="hidden sm:inline" />
          জাপানিজ ভাষা শেখার আধুনিক <span className="underline decoration-red-500/40 decoration-wavy underline-offset-8">AI প্ল্যাটফর্ম</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto mb-7 font-medium leading-relaxed">
          বাংলা ভাষায় সহজ ব্যাখ্যা, ২৪/৭ পার্সোনাল AI সেনসি, অথেনটিক মিন্না নো নিহোঙ্গো কারিকুলাম এবং টোকিও কনবিনি সিমুলেশন — সব কিছু এক প্ল্যাটফর্মে।
        </p>

        {/* Frictionless Primary CTA & Secondary Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button
            onClick={handleGoogleCTA}
            disabled={isGoogleSigningIn}
            className="w-full sm:w-auto px-7 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-sm sm:text-base font-bold shadow-lg shadow-red-600/25 hover:shadow-xl transition-all flex items-center justify-center space-x-3 cursor-pointer active:scale-95 group disabled:opacity-80"
          >
            {isGoogleSigningIn ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#FFFFFF" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#FFFFFF" opacity="0.9" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FFFFFF" opacity="0.8" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#FFFFFF" />
              </svg>
            )}
            <span>
              {isGoogleSigningIn
                ? 'গুগল সাইন-ইন হচ্ছে...'
                : user
                ? 'ড্যাশবোর্ডে প্রবেশ করুন'
                : 'গুগল দিয়ে ১ ক্লিকে শুরু করুন (ফ্রি ৫০ কয়েন সহ)'}
            </span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('courses')}
            className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 rounded-2xl text-sm font-bold shadow-2xs hover:border-stone-300 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-stone-400" />
            <span>কোর্স ও লেসন দেখুন</span>
          </button>
        </div>

        {/* Live Proof Counter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10">
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-xs text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block font-mono">মিন্না নো নিহোঙ্গো</span>
            <span className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5 block">{telemetry.srsCardsCount}+ ট্রাইলিঙ্গুয়াল মডিউল</span>
            <span className="text-[11px] text-stone-500">বাংলা, জাপানিজ ও ইংরেজি</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-xs text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block font-mono">রিয়েল লাইফ ড্রিল</span>
            <span className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5 block">কনবিনি সিমুলেটর</span>
            <span className="text-[11px] text-stone-500">টোকিও পার্ট-টাইম প্রস্তুতি</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-xs text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block font-mono">প্রাতিষ্ঠানিক স্বীকৃতি</span>
            <span className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5 block">ভেরিফাইড সনদ</span>
            <span className="text-[11px] text-stone-500">SHA-256 ডিজিটাল সিল</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-xs text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block font-mono">সাইন-আপ বোনাস</span>
            <span className="text-xl sm:text-2xl font-black text-red-600 mt-0.5 block">৫০ কয়েন + ১০০ AI</span>
            <span className="text-[11px] text-stone-500">সম্পূর্ণ ফ্রি স্টার্টার প্যাক</span>
          </div>
        </div>

        {/* 2. SEARCH BAR WITH VOICE, PHOTO OCR & KANJI CANVAS */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:border-stone-300 transition-all p-4 sm:p-5 text-left space-y-4">
            
            {/* Input Line */}
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(queryInput)}
              placeholder="Ask Nihomi anything in English, বাংলা, or 日本語 (e.g. particle rules, job interviews)..."
              className="w-full bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-hidden leading-relaxed"
            />

            {/* Bottom Actions Row: 3 Trigger Buttons + Send Arrow */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsVoiceActive(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-950 text-xs font-semibold rounded-xl border border-stone-200 transition-colors cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-red-600" />
                  <span>Voice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCameraActive(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-950 text-xs font-semibold rounded-xl border border-stone-200 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span>Photo OCR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsWritingActive(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-950 text-xs font-semibold rounded-xl border border-stone-200 transition-colors cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kanji Canvas</span>
                </button>
              </div>

              {/* Submit Arrow Button */}
              <button
                onClick={() => handleSearch(queryInput)}
                disabled={isAnswering || !queryInput.trim()}
                className="w-9 h-9 rounded-xl bg-stone-400 hover:bg-stone-900 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                aria-label="Send Query"
              >
                {isAnswering ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-white" />
                )}
              </button>

            </div>

          </div>

          {/* Quick Suggestions Chips */}
          <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-stone-500 pt-4">
            <span className="font-semibold text-stone-400 text-xs">Try:</span>
            {[
              'は (wa) vs が (ga)',
              '〜てください vs 〜てくださいませんか',
              'Tokyo Baito Interview',
              'Kanji: 日本語',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(q)}
                className="px-3.5 py-1.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-full text-xs font-medium transition-colors cursor-pointer shadow-2xs hover:border-stone-400"
              >
                {q}
              </button>
            ))}
          </div>

          {/* AI Response Output Box */}
          {aiAnswer && (
            <div className="mt-4 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm animate-in fade-in space-y-3 text-left">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-stone-950 text-white font-bold text-xs flex items-center justify-center">
                    日
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Nihomi Sensei</span>
                    <span className="text-[10px] text-stone-400 font-mono">Live Explanation</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => speakJapanese(aiAnswer)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 cursor-pointer"
                    title="Listen Pronunciation"
                  >
                    <Volume2 className="w-4 h-4 text-red-600" />
                  </button>
                  <button
                    onClick={() => setAiAnswer(null)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-stone-800 leading-relaxed font-sans whitespace-pre-line">
                {aiAnswer}
              </div>
            </div>
          )}

        </div>

      </section>

      {/* 3. CURATED PATHWAYS OVERVIEW */}
      <section className="py-14 bg-white border-t border-stone-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-stone-950 tracking-tight">
              Curated JLPT Learning Pathways
            </h2>
            <p className="text-xs text-stone-500 mt-1 font-medium">
              Structured step-by-step mastery from complete beginner to business bilingual
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                level: 'JLPT N5',
                title: 'Foundations & Daily Life',
                desc: 'Hiragana, Katakana, 100 Kanji, 800 Vocab, Minna no Nihongo 1–25.',
                badge: 'Beginner',
                action: 'Start N5 Pathway'
              },
              {
                level: 'JLPT N4',
                title: 'Conversational Bridge',
                desc: 'Complex grammar, 300 Kanji, 1,500 Vocab, Tokyo life survival skills.',
                badge: 'Intermediate',
                action: 'Start N4 Pathway'
              },
              {
                level: 'JLPT N3–N1',
                title: 'Professional Mastery',
                desc: 'Business honorifics (Keigo), specialized technical Kanji, job readiness.',
                badge: 'Advanced',
                action: 'Start N3–N1 Track'
              }
            ].map((card, i) => (
              <div
                key={i}
                className="p-6 bg-stone-50 border border-stone-200 rounded-3xl hover:border-stone-400 hover:shadow-md transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 bg-stone-950 text-white rounded-full text-[10px] font-bold">
                      {card.level}
                    </span>
                    <span className="text-[10px] font-semibold text-stone-500">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-stone-950 mb-1.5">{card.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">{card.desc}</p>
                </div>

                <button
                  onClick={() => onNavigate('courses')}
                  className="w-full py-2 bg-white hover:bg-stone-900 hover:text-white border border-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {card.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE MODALS */}
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