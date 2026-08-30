import React, { useState } from 'react';
import {
  Mic,
  Camera,
  PenTool,
  ArrowRight,
  Sparkles,
  Brain,
  Award,
  BookOpen,
  Volume2,
  CheckCircle2,
  Compass,
  Send,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { speakJapanese } from '../lib/tts';

interface LandingViewProps {
  onNavigate: (view: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { openAuthModal } = useAuth();
  const [demoQuery, setDemoQuery] = useState('');
  const [demoAnswer, setDemoAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const handleAskDemo = (query: string) => {
    setDemoQuery(query);
    setIsAnswering(true);
    setTimeout(() => {
      if (query.includes('wa') || query.includes('ga') || query.includes('は') || query.includes('が')) {
        setDemoAnswer('【は (wa) vs が (ga)】\n• は (wa) marks the overall Topic (What we are talking about).\n• が (ga) marks the grammatical Subject / Specific Focus.\nExample: 私はタレントが好きです (As for me, I like talent).');
      } else if (query.includes('Lesson 1') || query.includes('Grammar')) {
        setDemoAnswer('【Minna no Nihongo Lesson 1】\n1. N1 は N2 です (N1 is N2)\n2. N1 は N2 じゃありません (N1 is not N2)\n3. N1 は N2 ですか (Is N1 N2?)\n4. N1 も N2 です (N1 also is N2)');
      } else if (query.includes('coffee') || query.includes('Tokyo')) {
        setDemoAnswer('【Tokyo Cafe Order】\n「アイスコーヒーをひとつお願いします」\n(Aisu kōhī o hitotsu onegaishimasu)\nMeaning: "One iced coffee, please."');
      } else {
        setDemoAnswer(`【AI Sensei Analysis: "${query}"】\nJapanese grammar and context mapped successfully into your Learning DNA.`);
      }
      setIsAnswering(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 selection:bg-red-500 selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          <span>NIHOMI.COM • CONTINUOUS LEARNING OPERATING SYSTEM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-950 leading-[1.1] mb-6">
          AI-Powered Continuous <br className="hidden sm:inline" />
          <span className="text-stone-950">Japanese Learning</span> Companion
        </h1>

        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
          Your Japanese learning journey doesn't have a finish line—Nihomi continuously adapts, diagnoses, and guides every step from your first <span className="text-red-600 font-japanese font-bold">ひらがな</span> to real-world fluency.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button
            onClick={() => onNavigate('courses')}
            className="px-6 py-3 bg-stone-950 hover:bg-stone-800 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('portal')}
            className="px-6 py-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 rounded-xl text-sm font-bold shadow-2xs hover:border-stone-300 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-stone-500" />
            <span>Explore Dashboard</span>
          </button>
        </div>

        {/* 2. INTERACTIVE AI SENSEI DEMO WIDGET */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 text-left max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 font-extrabold flex items-center justify-center">
                日
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">Try Nihomi AI Sensei (Interactive Demo)</h3>
                <p className="text-[11px] text-stone-500">Gemini 2.5 Multi-turn Japanese Intelligence</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-[10px] font-mono font-bold rounded-lg">
              REAL-TIME
            </span>
          </div>

          <div className="relative mb-3">
            <input
              type="text"
              value={demoQuery}
              onChange={(e) => setDemoQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && demoQuery && handleAskDemo(demoQuery)}
              placeholder="Ask any Japanese grammar, kanji, vocabulary, or culture question in English, Bengali, or Japanese..."
              className="w-full pl-4 pr-12 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-medium focus:outline-hidden focus:border-stone-900 focus:bg-white transition-all"
            />
            <button
              onClick={() => demoQuery && handleAskDemo(demoQuery)}
              disabled={isAnswering || !demoQuery}
              className="absolute right-2 top-2 p-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
            >
              {isAnswering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-1.5 items-center mb-4">
            <span className="text-[11px] font-bold text-stone-400 mr-1">Try asking:</span>
            {[
              'は (wa) vs が (ga) difference',
              'Minna no Nihongo Lesson 1 Grammar',
              'How to order coffee in Tokyo cafe',
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleAskDemo(prompt)}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* AI Response Output */}
          {demoAnswer && (
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-800 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-red-500" />
                  <span>Sensei Answer</span>
                </span>
                <button
                  onClick={() => speakJapanese(demoAnswer)}
                  className="p-1 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-200 transition-colors"
                  title="Listen Pronunciation"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <pre className="font-sans whitespace-pre-wrap leading-relaxed text-stone-700">
                {demoAnswer}
              </pre>
            </div>
          )}
        </div>
      </section>

      {/* 3. PATHWAYS GRID */}
      <section className="py-12 bg-white border-t border-stone-200/80 px-4 sm:px-6 lg:px-8">
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

      {/* 4. FOOTER */}
      <footer className="py-8 bg-[#FAF9F6] border-t border-stone-200 text-center text-xs text-stone-500">
        <p className="font-semibold text-stone-700">NIHOMI (ニホミ) • Japanese Learning Platform</p>
        <p className="text-[11px] text-stone-400 mt-1">© 2026 Nihomi Academic Council. All rights reserved.</p>
      </footer>

    </div>
  );
};