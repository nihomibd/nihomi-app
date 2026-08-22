import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Volume2,
  HelpCircle,
  Clock,
  History,
  Check
} from 'lucide-react';
import { apiRequest } from '../lib/api.js';
import { speakJapanese } from '../lib/tts.js';
import { useAuth } from '../context/AuthContext.js';

interface GhostModeViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const GhostModeView: React.FC<GhostModeViewProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const [ghosts, setGhosts] = useState<any[]>([]);
  const [activeGhostIndex, setActiveGhostIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isResolved, setIsResolved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGhosts() {
      setIsLoading(true);
      try {
        const res = await apiRequest<{ success: boolean; activeGhosts: any[] }>('/api/ghost-mode/active-ghosts');
        if (res.success && res.activeGhosts) {
          setGhosts(res.activeGhosts);
        }
      } catch (err) {
        console.error('Failed to load ghosts:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadGhosts();
  }, []);

  const currentGhost = ghosts[activeGhostIndex];

  const handleSelectAnswer = async (index: number) => {
    setSelectedOption(index);
    if (currentGhost?.options?.[index]?.isCorrect) {
      setIsResolved(true);
      await apiRequest('/api/ghost-mode/resolve-ghost', {
        method: 'POST',
        body: JSON.stringify({ ghostId: currentGhost.id, selectedAnswerIndex: index })
      });
    }
  };

  const handleNextGhost = () => {
    setSelectedOption(null);
    setIsResolved(false);
    setActiveGhostIndex((prev) => (prev + 1) % ghosts.length);
  };

  if (isLoading || !currentGhost) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-8">
        <div className="text-center space-y-2 bg-white p-8 rounded-3xl border border-stone-200">
          <p className="text-xs font-bold text-stone-600">Scanning Learning Memory™ for ghosts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-10 px-4 sm:px-6 lg:px-8" id="ghost-mode-view">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white rounded-3xl p-8 shadow-xl border border-stone-800 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-600/30 border border-purple-500/50 text-purple-300 text-xs font-bold">
            <History className="w-4 h-4" />
            <span>Never Repeat the Same Mistake™ &bull; Ghost Mode</span>
          </div>
          <h1 className="text-3xl font-extrabold font-serif tracking-tight">
            Nihomi Ghost Mode™ Recovery Lab
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            আপনার অতীতের ভুলগুলো নতুন বাস্তব পরিস্থিতিতে ফিরে এসেছে। এখানে সঠিক উত্তর দিয়ে আপনার দুর্বলতাকে চিরতরে <strong className="text-emerald-400 font-bold">"Mistake Resolved"</strong> স্ট্যাটাসে লক করুন।
          </p>
        </div>

        {/* Ghost Card */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">
                Weakness #{activeGhostIndex + 1} &bull; Failed {currentGhost.failureCount} Times in Past
              </span>
              <h3 className="text-xl font-bold font-serif text-stone-900 mt-1">
                {currentGhost.topic}
              </h3>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
              New Context: {currentGhost.newContextChallenge}
            </span>
          </div>

          {/* Scenario Challenge */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
            <span className="text-stone-500 uppercase font-bold text-[10px] block">New Situational Challenge:</span>
            <p className="font-semibold text-stone-900 text-sm leading-relaxed">{currentGhost.scenarioPrompt}</p>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentGhost.options.map((opt: any, idx: number) => {
              const isSelected = selectedOption === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  className={`p-4.5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="font-serif text-base font-bold text-stone-900">{opt.text}</p>
                    {isSelected && (
                      opt.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </div>
                  {isSelected && (
                    <p className={`text-xs ${opt.isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {opt.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Resolution Badge & Next Action */}
          {isResolved && (
            <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>🟢 Mistake Resolved — Permanently Recovered in Learning Memory™!</span>
              </div>
              <button
                type="button"
                onClick={handleNextGhost}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Next Ghost</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
