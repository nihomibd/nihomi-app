// src/views/InterviewLabView.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Award,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Building,
  GraduationCap,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { apiRequest } from '../lib/api';
import { speakJapanese } from '../lib/tts';
import { useAuth } from '../context/AuthContext';

interface InterviewLabViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const InterviewLabView: React.FC<InterviewLabViewProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const [sessionType, setSessionType] = useState<'school_principal' | 'embassy_visa' | 'part_time_baito'>('school_principal');
  const [messages, setMessages] = useState<Array<{ role: 'principal' | 'student'; content: string; ja?: string; romaji?: string }>>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [readinessScore, setReadinessScore] = useState<number | null>(82);

  // Initial greeting from Tokyo Principal
  useEffect(() => {
    setMessages([
      {
        role: 'principal',
        content: 'こんにちは。東京国際アカデミーの校長です。本日は面接にお越しいただきありがとうございます。まず、簡単に自己紹介をお願いできますか？',
        ja: 'Konnichiwa. Tokyo Kokusai Academy no kouchou desu. Honjitsu wa mensetsu ni okoshi itadaki arigatou gozaimasu. Mazu, kantan ni jikoshoukai o onegai dekimasu ka?',
        romaji: 'Hello. I am the Principal of Tokyo International Academy. Thank you for coming to the interview today. First, could you please give a brief self-introduction?'
      }
    ]);
  }, [sessionType]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const studentMsg = inputText.trim();
    setInputText('');
    setMessages((prev) => [...prev, { role: 'student', content: studentMsg }]);
    setIsLoading(true);

    try {
      // Simulate / process AI Principal Voice & Evaluation
      await new Promise((r) => setTimeout(r, 1000));
      setMessages((prev) => [
        ...prev,
        {
          role: 'principal',
          content: '素晴らしいですね！日本語を勉強しようと思ったきっかけは何ですか？また、将来日本で何をしたいですか？',
          ja: 'Subarashii desu ne! Nihongo o benkyou shiyou to omotta kikkake wa nan desu ka? Mata, shourai Nihon de nani o shitai desu ka?',
          romaji: 'That is wonderful! What inspired you to study Japanese? And what do you hope to do in Japan in the future?'
        }
      ]);
      setReadinessScore(88);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-10 px-4 sm:px-6 lg:px-8" id="interview-lab-view">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
              <GraduationCap className="w-4 h-4" />
              <span>Nihomi Interview Lab™ &bull; AI Principal Simulation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mt-2">
              Tokyo Principal & Japan Visa Interview Simulator
            </h1>
            <p className="text-xs text-stone-500">
              Simulate high-stakes admissions interviews for Japanese Language Schools, Embassy Visa screenings, and jobs.
            </p>
          </div>

          {/* Readiness Score Indicator */}
          {readinessScore && (
            <div className="p-4 rounded-2xl bg-stone-900 text-white flex items-center gap-4 shrink-0 shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Interview Readiness</span>
                <span className="text-2xl font-extrabold text-emerald-400">{readinessScore}/100</span>
              </div>
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
          )}
        </div>

        {/* Simulation Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Scenarios Selector (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Select Interview Room</h3>
            <div className="space-y-2.5">
              {[
                { id: 'school_principal', title: 'Japanese Language School Admission', subtitle: 'Principal Interview (Tokyo/Osaka)' },
                { id: 'embassy_visa', title: 'Embassy of Japan / VFS Screening', subtitle: 'Study Purpose & Financial Sponsor Check' },
                { id: 'part_time_baito', title: 'Part-Time Job (Baito) Interview', subtitle: 'Conbini & Restaurant Oral Screening' }
              ].map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSessionType(s.id as any)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    sessionType === s.id
                      ? 'bg-white border-red-600 shadow-md ring-2 ring-red-500/20'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <p className="font-bold text-xs text-stone-900">{s.title}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">{s.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Active Live Dialogue Terminal (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-stone-200 rounded-3xl shadow-sm flex flex-col h-[580px] overflow-hidden">
            {/* Terminal Header */}
            <div className="p-4 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-stone-900">Virtual Principal: Yamada Sensei (Tokyo)</span>
              </div>
              <button
                onClick={() => setMessages([])}
                className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Session</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'student' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 space-y-2 shadow-xs ${
                      m.role === 'student'
                        ? 'bg-stone-900 text-white rounded-br-none'
                        : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-bl-none'
                    }`}
                  >
                    {m.role === 'principal' && (
                      <div className="flex items-center justify-between border-b border-stone-200/60 pb-1 mb-1">
                        <span className="text-[10px] font-bold text-red-600 uppercase">Interview Question</span>
                        <button
                          onClick={() => speakJapanese(m.content)}
                          className="text-stone-400 hover:text-red-600 cursor-pointer"
                          title="Listen to native voice"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <p className="text-xs sm:text-sm font-serif leading-relaxed">{m.content}</p>
                    {m.romaji && <p className="text-[11px] text-stone-500 font-sans">{m.romaji}</p>}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-500 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                    <span>Principal is analyzing your Keigo and pronunciation...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar with Voice Support */}
            <form onSubmit={handleSendMessage} className="p-3.5 border-t border-stone-100 bg-stone-50 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`p-3 rounded-xl transition-colors cursor-pointer ${
                  isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-white border border-stone-300 text-stone-600 hover:text-red-600'
                }`}
                title="Speak in Japanese"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or speak your answer in Japanese (e.g. 私の名前は...)"
                className="flex-1 px-4 py-3 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <span>Answer</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
