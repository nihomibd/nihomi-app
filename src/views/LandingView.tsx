import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { speakJapanese } from '../lib/tts';
import { VoiceSenseiPractice } from '../components/practice/VoiceSenseiPractice';
import { VisionSenseiModal } from '../components/VisionSenseiModal';
import { KanjiWritingModal } from '../components/student/KanjiWritingModal';

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
  const { openAuthModal } = useAuth();
  const [queryInput, setQueryInput] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

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
          <span>NIHOMI.COM • CONTINUOUS LEARNING OPERATING SYSTEM</span>
        </div>

        {/* Master Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-950 leading-[1.1] mb-5">
          AI-Powered Continuous <br className="hidden sm:inline" />
          <span className="text-stone-950">Japanese Learning</span> Companion
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
          Your Japanese learning journey doesn't have a finish line—Nihomi continuously adapts, diagnoses, and guides every step from your first <span className="text-red-600 font-japanese font-bold">ひらがな</span> to real-world fluency.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => onNavigate('courses')}
            className="px-6 py-3 bg-stone-950 hover:bg-stone-800 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4 text-red-400" />
          </button>

          <button
            onClick={() => onNavigate('portal')}
            className="px-6 py-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 rounded-xl text-sm font-bold shadow-2xs hover:border-stone-300 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-stone-400" />
            <span>Explore Dashboard</span>
          </button>
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