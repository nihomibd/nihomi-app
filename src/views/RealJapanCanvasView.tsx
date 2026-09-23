// src/views/RealJapanCanvasView.tsx
// NIHOMI WORLD™: A Real Japan Canvas™ (Shibuya Crossing V1 Experience)
// Action-first, spatial Japanese learning and Tokyo WorkOS™ integration

import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Store,
  UtensilsCrossed,
  Train,
  GraduationCap,
  X,
  ChevronRight,
  RotateCcw,
  Award,
  Layers,
  HelpCircle,
  Clock,
  Play,
  Mic,
  Activity,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import {
  SHIBUYA_HOTSPOTS,
  ShibuyaHotspot,
  TOKYO_SURVIVAL_DIAGNOSTIC,
  TokyoSurvivalQuestion
} from '../data/shibuyaWorldData';
import { speakJapanese } from '../lib/tts';
import { worldAudio } from '../lib/worldAudio';
import { triggerCelebrationConfetti } from '../lib/gamificationService';
import { useAuth } from '../context/AuthContext';

interface RealJapanCanvasViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const RealJapanCanvasView: React.FC<RealJapanCanvasViewProps> = ({ onNavigate }) => {
  const { user, openAuthModal } = useAuth();

  // Active States
  const [selectedHotspot, setSelectedHotspot] = useState<ShibuyaHotspot | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [currentTimeJST, setCurrentTimeJST] = useState<string>('20:15');
  const [activeMission, setActiveMission] = useState<'none' | 'mission-001'>('none');
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isPronouncing, setIsPronouncing] = useState(false);
  const [missionComplete, setMissionComplete] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nihomi_mission_001_done') === 'true';
    } catch {
      return false;
    }
  });

  // Diagnostic state
  const [diagStep, setDiagStep] = useState(0);
  const [diagAnswers, setDiagAnswers] = useState<Record<number, number>>({});
  const [diagCompleted, setDiagCompleted] = useState(false);

  // Live JST Clock (Tokyo Time)
  useEffect(() => {
    const updateTime = () => {
      try {
        const tokyoDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
        const hours = String(tokyoDate.getHours()).padStart(2, '0');
        const minutes = String(tokyoDate.getMinutes()).padStart(2, '0');
        setCurrentTimeJST(`${hours}:${minutes}`);
      } catch {
        setCurrentTimeJST('20:15');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Show Welcome Dialog on first landing if Mission 001 is not yet completed
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('nihomi_shibuya_welcome_seen');
    if (!hasSeenWelcome && !missionComplete) {
      const timer = setTimeout(() => {
        setIsWelcomeModalOpen(true);
        sessionStorage.setItem('nihomi_shibuya_welcome_seen', 'true');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [missionComplete]);

  // Audio ambient toggle
  const toggleAmbientAudio = () => {
    if (isAudioMuted) {
      const started = worldAudio.startTokyoAmbient();
      if (started) {
        setIsAudioMuted(false);
        worldAudio.playTokyoChime();
      }
    } else {
      worldAudio.stopTokyoAmbient();
      setIsAudioMuted(true);
    }
  };

  // Speak phrase with safe wrapper
  const handlePlayVoice = (text: string, rate: number = 1.0) => {
    setIsPronouncing(true);
    speakJapanese(text, {
      rate,
      onEnd: () => setIsPronouncing(false),
      onError: () => setIsPronouncing(false)
    });
  };

  // Mission 001 Completion Handler
  const handleFinishMission001 = () => {
    triggerCelebrationConfetti();
    worldAudio.playTokyoChime();
    setMissionComplete(true);
    try {
      localStorage.setItem('nihomi_mission_001_done', 'true');
    } catch {}
    setActiveMission('none');
    // Set focus on Conbini hotspot as next best action
    const conbini = SHIBUYA_HOTSPOTS.find(h => h.id === 'spot-conbini');
    if (conbini) {
      setTimeout(() => setSelectedHotspot(conbini), 600);
    }
  };

  // Diagnostic Answer selection
  const handleSelectDiagOption = (questionId: number, optionIdx: number) => {
    const updated = { ...diagAnswers, [questionId]: optionIdx };
    setDiagAnswers(updated);
    if (diagStep < TOKYO_SURVIVAL_DIAGNOSTIC.length - 1) {
      setTimeout(() => setDiagStep(prev => prev + 1), 500);
    } else {
      setTimeout(() => {
        setDiagCompleted(true);
        triggerCelebrationConfetti();
      }, 500);
    }
  };

  // Hotspot Icon Resolver
  const renderCategoryIcon = (category: ShibuyaHotspot['category']) => {
    switch (category) {
      case 'crossing':
        return <Compass className="w-5 h-5 text-amber-400" />;
      case 'conbini':
        return <Store className="w-5 h-5 text-emerald-400" />;
      case 'restaurant':
        return <UtensilsCrossed className="w-5 h-5 text-orange-400" />;
      case 'station':
        return <Train className="w-5 h-5 text-cyan-400" />;
      case 'school':
        return <GraduationCap className="w-5 h-5 text-pink-400" />;
      default:
        return <MapPin className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#06060c] text-slate-100 overflow-hidden font-sans select-none flex flex-col justify-between">
      {/* 1. CINEMATIC SHIBUYA CROSSING BACKDROP */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/assets/shibuya-crossing.jpg"
          alt="Shibuya Crossing Tokyo"
          className="w-full h-full object-cover object-center scale-[1.03] transition-transform duration-10000 ease-out brightness-[0.78] contrast-[1.08]"
          loading="eager"
        />
        {/* Subtle Atmospheric Vignette & Color Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06060c] via-[#06060c]/40 to-[#06060c]/70 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#06060c]/20 to-[#06060c]/80" />

        {/* Ambient Neon Glow pulses in corners */}
        <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[32rem] h-[32rem] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. MINIMALIST CINEMATIC HUD / TOP BAR (No SaaS Buttonism) */}
      <header className="relative z-30 w-full px-4 sm:px-8 pt-5 pb-3 flex items-center justify-between border-b border-white/5 bg-[#06060c]/60 backdrop-blur-md">
        {/* Left: Brand & Telemetry */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setSelectedHotspot(null); setActiveMission('none'); }}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-900/30 ring-1 ring-white/20">
              <span className="text-white font-bold text-sm tracking-wider">に</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-sm text-white group-hover:text-amber-300 transition-colors">
                  NIHOMI WORLD™
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  SHIBUYA V1
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">Real Japan Canvas™</p>
            </div>
          </button>

          {/* Tokyo District Telemetry Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 backdrop-blur-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-zinc-200">東京都 渋谷区</span>
            <span className="text-zinc-500">•</span>
            <span className="font-mono text-amber-300 font-semibold">{currentTimeJST} JST</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">18°C 晴れ</span>
          </div>
        </div>

        {/* Center: Mission / Readiness Status */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/70 border border-amber-500/20 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span className="text-zinc-300">Active Objective:</span>
            {missionComplete ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mission 001 Complete (+50 XP)
              </span>
            ) : (
              <span className="text-amber-300 font-semibold">
                Mission 001: Tokyo First Words
              </span>
            )}
          </div>
        </div>

        {/* Right: Soundscape, Classic Courses Bridge, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Ambient Tokyo Sound Toggle */}
          <button
            onClick={toggleAmbientAudio}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium ${
              !isAudioMuted
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/10'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/10'
            }`}
            title={isAudioMuted ? 'Play Tokyo Ambient Soundscape' : 'Mute Ambient Soundscape'}
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{!isAudioMuted ? 'Tokyo Live' : 'Sound'}</span>
          </button>

          {/* Quick Bridge to Classic Courses & Dashboard */}
          <button
            onClick={() => onNavigate('courses')}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-semibold text-zinc-200 transition-all flex items-center gap-1.5"
            title="Access Minna no Nihongo 1-25 & Full Curriculum"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">কারিকুলাম ও কোর্স</span>
            <span className="sm:hidden">Courses</span>
          </button>

          {/* User Sign-in / Avatar */}
          {user ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-white/15 text-xs text-zinc-200 hover:border-amber-400/50 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-white">
                {user.name ? user.name[0].toUpperCase() : 'S'}
              </div>
              <span className="hidden md:inline font-medium max-w-[90px] truncate">{user.name || 'Student'}</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-md shadow-rose-900/30 hover:brightness-110 active:scale-95 transition-all"
            >
              লগইন / শুরু
            </button>
          )}
        </div>
      </header>

      {/* 3. INTERACTIVE SPATIAL CANVAS LAYER (SHIBUYA HOTSPOTS) */}
      <div className="relative z-10 flex-grow w-full h-[65vh] md:h-[72vh] flex items-center justify-center p-4">
        {/* Hotspots Container positioned across the screen */}
        <div className="relative w-full max-w-6xl h-full mx-auto">
          {SHIBUYA_HOTSPOTS.map((hotspot) => {
            const isSelected = selectedHotspot?.id === hotspot.id;
            return (
              <div
                key={hotspot.id}
                style={{
                  left: `${hotspot.coords.x}%`,
                  top: `${hotspot.coords.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute z-20 transition-all duration-300"
              >
                {/* Hotspot Pin Button */}
                <button
                  onClick={() => {
                    setSelectedHotspot(hotspot);
                    worldAudio.playTokyoChime();
                  }}
                  className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-2xl backdrop-blur-md transition-all duration-300 ${
                    isSelected
                      ? 'bg-zinc-900/95 border-2 border-amber-400 shadow-2xl shadow-amber-500/30 scale-110 ring-4 ring-amber-400/20'
                      : 'bg-zinc-900/80 hover:bg-zinc-900/95 border border-white/20 hover:border-amber-400/70 shadow-lg hover:scale-105'
                  }`}
                >
                  {/* Radar Pulse Ring */}
                  <span className="absolute -inset-1 rounded-2xl bg-amber-400/20 animate-ping pointer-events-none opacity-40 group-hover:opacity-75" />

                  {/* Hotspot Icon */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-amber-400/20 text-amber-300' : 'bg-white/10 group-hover:bg-amber-400/20'
                  }`}>
                    {renderCategoryIcon(hotspot.category)}
                  </div>

                  {/* Hotspot Name & Mini Tag */}
                  <div className="text-left pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">
                        {hotspot.nameJa}
                      </span>
                      {hotspot.nearbyJob && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          বাইট
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium block leading-none mt-0.5">
                      {hotspot.nameBn}
                    </span>
                  </div>

                  {/* Next Best Action Glow Indicator */}
                  {!missionComplete && hotspot.id === 'spot-crossing' && (
                    <span className="absolute -top-2.5 -right-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md animate-bounce">
                      START HERE
                    </span>
                  )}
                  {missionComplete && hotspot.id === 'spot-conbini' && (
                    <span className="absolute -top-2.5 -right-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md animate-pulse">
                      RECOMMENDED
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* 4. AI SENSEI ADAPTIVE WELCOME CARD (BOTTOM CENTER) */}
        {!selectedHotspot && activeMission === 'none' && (
          <div className="absolute bottom-5 inset-x-4 max-w-2xl mx-auto z-20">
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/80">
              <div className="flex items-start gap-3.5 mb-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white font-extrabold text-sm">田</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">Tanaka AI Sensei (田中先生)</h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live in Tokyo
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    "Welcome to Japan. 🇯🇵 You are at Shibuya Crossing. Learn by exploring places, speaking real phrases, and trying authentic jobs."
                  </p>
                </div>
              </div>

              {/* 3 Adaptive Action Cards (Apple / MUJI Standard) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1: Zero Japanese */}
                <button
                  onClick={() => {
                    worldAudio.playTokyoChime();
                    setActiveMission('mission-001');
                  }}
                  className="p-3 rounded-xl bg-gradient-to-b from-rose-500/15 to-rose-500/5 hover:from-rose-500/25 hover:to-rose-500/15 border border-rose-500/30 hover:border-rose-400 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                      はじめて • ZERO
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-12 transition-transform" />
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-rose-200">আমি কিছুই জানি না</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">১ম সম্ভাষণ শিখুন (Mission 001)</p>
                </button>

                {/* 2: Explore Shibuya & Jobs */}
                <button
                  onClick={() => {
                    const conbini = SHIBUYA_HOTSPOTS.find(h => h.id === 'spot-conbini');
                    if (conbini) setSelectedHotspot(conbini);
                    worldAudio.playTokyoChime();
                  }}
                  className="p-3 rounded-xl bg-gradient-to-b from-emerald-500/15 to-emerald-500/5 hover:from-emerald-500/25 hover:to-emerald-500/15 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                      東京探索 • EXPLORE
                    </span>
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-200">শিবুয়া এক্সপ্লোর ও চাকরি</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">কনবিনি ক্যাশিয়ার ও পার্ট-টাইম জব</p>
                </button>

                {/* 3: Test My Japanese */}
                <button
                  onClick={() => {
                    setIsDiagnosticOpen(true);
                    setDiagStep(0);
                    setDiagCompleted(false);
                    worldAudio.playTokyoChime();
                  }}
                  className="p-3 rounded-xl bg-gradient-to-b from-cyan-500/15 to-cyan-500/5 hover:from-cyan-500/25 hover:to-cyan-500/15 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                      実力判定 • TEST
                    </span>
                    <Activity className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-200">আমার দক্ষতা যাচাই</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">৩টি দ্রুত টোকিও সারভাইভাল প্রশ্ন</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. HOTSPOT DETAIL FLOATING DOSSIER (SLIDE DRAWER) */}
      {selectedHotspot && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-zinc-950/95 border-l border-white/10 backdrop-blur-2xl z-40 p-6 overflow-y-auto shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          <div>
            {/* Top Close Button & Category */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  {renderCategoryIcon(selectedHotspot.category)}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                    SHIBUYA LOCATION DOSSIER
                  </span>
                  <h3 className="text-sm font-bold text-white">{selectedHotspot.nameJa}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & Cultural Context */}
            <div className="mt-4">
              <h2 className="text-lg font-extrabold text-white">{selectedHotspot.name}</h2>
              <p className="text-xs text-amber-300 font-medium">{selectedHotspot.nameBn}</p>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                {selectedHotspot.descriptionBn}
              </p>

              {/* Cultural Context Tip */}
              <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  💡 জাপানিজ সামাজিক শিষ্টাচার (Cultural Etiquette)
                </span>
                <p className="text-xs text-zinc-300 mt-1">
                  {selectedHotspot.culturalContextBn}
                </p>
              </div>
            </div>

            {/* Key Phrases with Audio Buttons */}
            <div className="mt-6">
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                অপরিহার্য জাপানিজ বাক্য (Essential Phrases)
              </h4>
              <div className="space-y-2.5">
                {selectedHotspot.keyPhrases.map((phrase, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all flex items-start justify-between gap-3 group"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">{phrase.ja}</p>
                      <p className="text-[11px] text-zinc-400 font-mono">{phrase.romaji}</p>
                      <p className="text-xs text-emerald-300 mt-0.5">{phrase.bn}</p>
                    </div>
                    <button
                      onClick={() => handlePlayVoice(phrase.audioText)}
                      className="p-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 flex-shrink-0 transition-transform active:scale-90"
                      title="Listen to authentic Tokyo pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Survival Vocabulary Chips */}
            <div className="mt-6">
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-2.5">
                প্রয়োজনীয় শব্দভাণ্ডার (Vocabulary)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedHotspot.vocabulary.map((vocab, vIdx) => (
                  <button
                    key={vIdx}
                    onClick={() => handlePlayVoice(vocab.ja)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-left transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{vocab.ja}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{vocab.kana}</span>
                    </div>
                    <span className="text-[11px] text-amber-300 block mt-0.5 truncate">{vocab.bn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* WorkOS™ Nearby Job Readiness Card */}
            {selectedHotspot.nearbyJob && (
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-zinc-900 border border-emerald-500/30 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {selectedHotspot.nearbyJob.badge}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400 font-mono">
                    {selectedHotspot.nearbyJob.hourlyWage}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{selectedHotspot.nearbyJob.title}</h4>
                <p className="text-xs text-zinc-300 mt-0.5">{selectedHotspot.nearbyJob.titleBn}</p>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedHotspot.nearbyJob.hoursLimit}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger Button */}
          <div className="pt-6 mt-6 border-t border-white/10">
            <button
              onClick={() => {
                if (selectedHotspot.directAction.viewTarget === 'mission-001') {
                  setActiveMission('mission-001');
                  setSelectedHotspot(null);
                } else {
                  onNavigate(
                    selectedHotspot.directAction.viewTarget,
                    selectedHotspot.directAction.params
                  );
                }
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white font-bold text-sm shadow-xl shadow-rose-900/30 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>{selectedHotspot.directAction.labelBn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 6. MISSION 001 EXPERIENCE MODAL: ZERO JAPANESE TO FIRST GREETING */}
      {activeMission === 'mission-001' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveMission('none')}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Mission Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                MISSION 001: TOKYO FIRST WORDS
              </span>
              <span className="text-xs text-amber-400 font-semibold">+50 XP</span>
            </div>

            <h2 className="text-xl font-extrabold text-white">
              জাপানে আপনার প্রথম সম্ভাষণ
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              টোকিওতে পা রেখে প্রথম যে বাক্যটি আপনার মুখে আসবে: "こんにちは" (Konnichiwa)।
            </p>

            {/* High-Impact Japanese Card */}
            <div className="my-6 p-6 rounded-2xl bg-zinc-950 border border-white/10 text-center relative overflow-hidden group">
              <div className="text-5xl font-black text-white tracking-widest mb-2 font-japanese">
                こんにちは
              </div>
              <div className="text-sm font-mono text-zinc-400 tracking-wider">
                [kon-ni-chi-wa]
              </div>
              <div className="text-base font-bold text-amber-300 mt-2">
                "শুভ দিন / নমস্কার"
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                Universal Daytime Greeting (সকাল ১১টা থেকে সূর্যাস্ত পর্যন্ত)
              </div>

              {/* Native Voice Listen Buttons */}
              <div className="flex items-center justify-center gap-3 mt-5">
                <button
                  onClick={() => handlePlayVoice('こんにちは', 1.0)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>শুনুন (Native Speed)</span>
                </button>
                <button
                  onClick={() => handlePlayVoice('こんにちは', 0.8)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ধীরে শুনুন (0.8x)</span>
                </button>
              </div>
            </div>

            {/* Cultural Tip */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
              <strong className="text-amber-300">💡 টোকিও শিষ্টাচার:</strong> কথা বলার সময় সামান্য মাথা নিচু করে (১৫ ডিগ্রি বাউ) সম্মান প্রদর্শন করুন। এটি জাপানিজদের অন্তরে দ্রুত স্থান করে দেয়।
            </div>

            {/* Mission Completion Action */}
            <button
              onClick={handleFinishMission001}
              className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-900/30 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>আমি উচ্চারণ করেছি — Mission 001 সম্পন্ন করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* 7. TOKYO SURVIVAL DIAGNOSTIC MODAL */}
      {isDiagnosticOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsDiagnosticOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {!diagCompleted ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    TOKYO SURVIVAL DIAGNOSTIC ({diagStep + 1} / {TOKYO_SURVIVAL_DIAGNOSTIC.length})
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {TOKYO_SURVIVAL_DIAGNOSTIC[diagStep].location}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">
                  {TOKYO_SURVIVAL_DIAGNOSTIC[diagStep].scenario}
                </h3>
                <p className="text-xs text-zinc-400 mb-4">
                  {TOKYO_SURVIVAL_DIAGNOSTIC[diagStep].scenarioBn}
                </p>

                {/* Question Prompt with Audio Button */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-amber-300 font-japanese">
                    {TOKYO_SURVIVAL_DIAGNOSTIC[diagStep].japanesePrompt}
                  </span>
                  <button
                    onClick={() => handlePlayVoice(TOKYO_SURVIVAL_DIAGNOSTIC[diagStep].audioPrompt)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-300"
                    title="Play Audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5">
                  {TOKYO_SURVIVAL_DIAGNOSTIC[diagStep].options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectDiagOption(TOKYO_SURVIVAL_DIAGNOSTIC[diagStep].id, optIdx)}
                      className="w-full p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/50 text-left transition-all group flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-amber-300">
                          {opt.text}
                        </p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{opt.textBn}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Diagnostic Completed Screen */
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-black text-white">Tokyo Survival Assessment Complete</h3>
                <p className="text-xs text-emerald-300 font-semibold mt-1">
                  সারভাইভাল রেজাল্ট: Grade A (Tokyo Ready)
                </p>
                <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
                  আপনার জন্য সবচেয়ে উপযুক্ত পথ: মিন্না নো নিহোঙ্গো লেসন ১–৫ ফ্রি কারিকুলাম অথবা সরাসরি কনবিনি ক্যাশিয়ার ওয়ার্কওএস সিমুলেশন।
                </p>

                <div className="mt-6 space-y-2.5">
                  <button
                    onClick={() => {
                      setIsDiagnosticOpen(false);
                      onNavigate('baito', { scenarioId: 'sc-conbini-pos', tab: 'pos_terminal' });
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-xs shadow-lg hover:brightness-110 transition-all"
                  >
                    Start Conbini POS Simulator (WorkOS™)
                  </button>
                  <button
                    onClick={() => {
                      setIsDiagnosticOpen(false);
                      onNavigate('lesson', { lessonId: 'n5-l1' });
                    }}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 font-medium text-xs transition-all"
                  >
                    Open Minna no Nihongo Lesson 1 (Free)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. MINIMAL FOOTER TELEMETRY & COPYRIGHT */}
      <footer className="relative z-30 w-full px-4 sm:px-8 py-3 flex items-center justify-between border-t border-white/5 bg-[#06060c]/60 backdrop-blur-md text-[11px] text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-zinc-300">NIHOMI WORLD™</span>
          <span className="text-zinc-600">•</span>
          <span>Experience Japan. Before You Arrive.</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('baito')}
            className="hover:text-amber-300 transition-colors font-medium"
          >
            WorkOS™ Simulator
          </button>
          <span className="text-zinc-600">•</span>
          <button
            onClick={() => onNavigate('kana')}
            className="hover:text-amber-300 transition-colors font-medium"
          >
            Kana Studio
          </button>
          <span className="text-zinc-600">•</span>
          <button
            onClick={() => onNavigate('kanji')}
            className="hover:text-amber-300 transition-colors font-medium"
          >
            Kanji Lab
          </button>
          <span className="text-zinc-600">•</span>
          <button
            onClick={() => onNavigate('dashboard')}
            className="hover:text-amber-300 transition-colors font-medium"
          >
            Student Portal
          </button>
        </div>
      </footer>
    </div>
  );
};
