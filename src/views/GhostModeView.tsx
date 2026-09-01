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
  Ghost,
  BrainCircuit,
  Flame,
  Award,
  ChevronLeft
} from 'lucide-react';
import { apiRequest } from '../lib/api.js';
import { speakJapanese } from '../lib/tts.js';
import { useAuth } from '../context/AuthContext.js';
import { GhostModeSRSWidget } from '../components/practice/GhostModeSRSWidget.js';

interface GhostModeViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const GhostModeView: React.FC<GhostModeViewProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a12] text-stone-100 py-10 px-4 sm:px-6 lg:px-8 font-sans" id="ghost-mode-view">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('portal')}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>শিক্ষার্থী পোর্টালে ফিরুন</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold rounded-full">
              SM-2 Active Spaced Repetition
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-stone-950 via-[#121324] to-stone-950 text-white rounded-3xl p-8 shadow-2xl border border-stone-800 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/70 border border-red-500/40 text-red-400 text-xs font-bold font-mono">
            <Ghost className="w-4 h-4" />
            <span>NEVER REPEAT THE SAME MISTAKE™ &bull; MEMORYOS™</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            নিহোমি ঘোস্ট মোড™ রিকভারি ল্যাব (Ghost Mode Recovery)
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            আপনার অতীতের পার্টিকেল (は vs が, に vs で), ত-ফর্ম এবং ব্যাকরণগত ভুলগুলোকে ডাইনামিক বাস্তবসম্মত পরিস্থিতিতে টেস্ট করা হয়। SM-2 স্পেসড রিপিটেশনের মাধ্যমে প্রতিটি দুর্বলতা ১০০% আয়ত্ত না হওয়া পর্যন্ত Ghost Mode আপনাকে গাইড করবে।
          </p>
        </div>

        {/* Integrated Interactive Ghost Mode SRS Widget */}
        <GhostModeSRSWidget />
      </div>
    </div>
  );
};
