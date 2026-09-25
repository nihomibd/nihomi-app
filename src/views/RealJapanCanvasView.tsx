// src/views/RealJapanCanvasView.tsx
// NIHOMI WORLD™: SHIBUYA V2 — 3D/360° Real Japan Canvas™, Coin Economy & In-Canvas Auth
// Full immersive spatial WebGL Street View, Gamified Test-to-Earn, and Zero-Redirect Auth

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Globe,
  Coins,
  Send,
  Loader2,
  LogIn,
  Eye,
  Lock,
  Plane,
  Gamepad2
} from 'lucide-react';
import {
  SHIBUYA_HOTSPOTS,
  ShibuyaHotspot,
  TOKYO_SURVIVAL_DIAGNOSTIC,
  TokyoSurvivalQuestion
} from '../data/shibuyaWorldData';
import { Shibuya3DCanvas, HotspotScreenPosition } from '../components/canvas3d/Shibuya3DCanvas';
import { ShibuyaPlayableWorld } from '../components/canvas3d/ShibuyaPlayableWorld';
import { InCanvasAuthModal } from '../components/canvas3d/InCanvasAuthModal';
import { ContextualPaywallModal, PaywallMode } from '../components/canvas3d/ContextualPaywallModal';
import { speakJapanese } from '../lib/tts';
import { worldAudio } from '../lib/worldAudio';
import { triggerCelebrationConfetti } from '../lib/gamificationService';
import { useAuth } from '../context/AuthContext';

interface RealJapanCanvasViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const RealJapanCanvasView: React.FC<RealJapanCanvasViewProps> = ({ onNavigate }) => {
  const { user, coinWallet } = useAuth();

  // Active Experience Mode: Flagship 3D Playable Reality Canvas vs 360° Photo Panorama
  const [experienceMode, setExperienceMode] = useState<'playable_3d' | 'panorama_360'>('playable_3d');

  // GATE 1: Premium Landing Hero State (Hide the void until student clicks Start Journey)
  const [isJourneyStarted, setIsJourneyStarted] = useState<boolean>(() => {
    try {
      const search = new URLSearchParams(window.location.search);
      return search.get('explore') === 'true' || search.get('start') === 'true';
    } catch {
      return false;
    }
  });

  // Active States
  const [selectedHotspot, setSelectedHotspot] = useState<ShibuyaHotspot | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [currentTimeJST, setCurrentTimeJST] = useState<string>('20:15');
  const [activeMission, setActiveMission] = useState<'none' | 'mission-001'>('none');
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isInCanvasAuthOpen, setIsInCanvasAuthOpen] = useState(false);
  const [isSenseiChatOpen, setIsSenseiChatOpen] = useState(false);
  const [isPronouncing, setIsPronouncing] = useState(false);

  // Contextual Paywall State (Zero-Buttonism MRR & Expansion Loop)
  const [paywallModalOpen, setPaywallModalOpen] = useState(false);
  const [paywallConfig, setPaywallConfig] = useState<{
    mode: PaywallMode;
    hotspotTitle?: string;
    hotspotTitleJa?: string;
    unlockCostCoins?: number;
    initialTrack?: 'continuous' | 'trip_pass';
    onUnlockSuccess?: () => void;
  }>({
    mode: 'coin_unlock',
    hotspotTitle: 'Izakaya Staff Roleplay',
    hotspotTitleJa: '居酒屋接客ロールプレイング',
    unlockCostCoins: 20
  });

  // Hotspot Unlocked State (Persistent)
  const [unlockedHotspots, setUnlockedHotspots] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nihomi_unlocked_hotspots');
      return stored ? JSON.parse(stored) : ['spot-crossing', 'spot-conbini'];
    } catch {
      return ['spot-crossing', 'spot-conbini'];
    }
  });

  const unlockHotspot = useCallback((spotId: string) => {
    setUnlockedHotspots((prev) => {
      if (prev.includes(spotId)) return prev;
      const updated = [...prev, spotId];
      try {
        localStorage.setItem('nihomi_unlocked_hotspots', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Nihomi Coin Economy State (Local + Cloud Synced)
  const [coins, setCoins] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('nihomi_student_coins');
      return stored ? parseInt(stored, 10) : (coinWallet?.coinBalance || 420);
    } catch {
      return 420;
    }
  });

  // Mission 001 Completion State
  const [missionComplete, setMissionComplete] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nihomi_mission_001_done') === 'true';
    } catch {
      return false;
    }
  });

  // Survival Diagnostic State
  const [diagStep, setDiagStep] = useState(0);
  const [diagAnswers, setDiagAnswers] = useState<Record<number, number>>({});
  const [diagCompleted, setDiagCompleted] = useState(false);

  // Tanaka AI Sensei Instant Voice Q&A state
  const [senseiQuery, setSenseiQuery] = useState('');
  const [senseiResponse, setSenseiResponse] = useState<string | null>(null);
  const [isSenseiThinking, setIsSenseiThinking] = useState(false);

  // Sync coins with auth wallet if updated
  useEffect(() => {
    if (coinWallet?.coinBalance && coinWallet.coinBalance > coins) {
      setCoins(coinWallet.coinBalance);
    }
  }, [coinWallet]);

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

  // Update coins helper
  const addCoins = useCallback((amount: number) => {
    setCoins((prev) => {
      const updated = prev + amount;
      try {
        localStorage.setItem('nihomi_student_coins', updated.toString());
      } catch {}
      return updated;
    });
  }, []);

  const deductCoins = useCallback((amount: number): boolean => {
    let success = false;
    setCoins((prev) => {
      if (prev >= amount) {
        success = true;
        const updated = prev - amount;
        try {
          localStorage.setItem('nihomi_student_coins', updated.toString());
        } catch {}
        return updated;
      }
      return prev;
    });
    return success;
  }, []);

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
    addCoins(50); // Reward 50 coins for Mission 001!
    try {
      localStorage.setItem('nihomi_mission_001_done', 'true');
    } catch {}
    setActiveMission('none');

    // Guide user to next best action (Conbini)
    const conbini = SHIBUYA_HOTSPOTS.find(h => h.id === 'spot-conbini');
    if (conbini) {
      setTimeout(() => setSelectedHotspot(conbini), 600);
    }
  };

  // Diagnostic Answer Selection & Coin Reward
  const handleSelectDiagOption = (questionId: number, optionIdx: number) => {
    const updated = { ...diagAnswers, [questionId]: optionIdx };
    setDiagAnswers(updated);
    if (diagStep < TOKYO_SURVIVAL_DIAGNOSTIC.length - 1) {
      setTimeout(() => setDiagStep(prev => prev + 1), 450);
    } else {
      setTimeout(() => {
        setDiagCompleted(true);
        triggerCelebrationConfetti();
        worldAudio.playTokyoChime();
        addCoins(50); // Reward +50 Nihomi Coins!
      }, 450);
    }
  };

  // Tanaka AI Sensei Instant Conversation (Redeem 10 Coins)
  const handleAskSensei = async () => {
    if (!senseiQuery.trim()) return;
    if (coins < 10) {
      setPaywallConfig({
        mode: 'coin_topup',
        hotspotTitle: 'Tanaka AI Sensei Voice Coaching',
        hotspotTitleJa: '田中先生 リアルタイム音声指導',
        onUnlockSuccess: () => {
          try {
            const stored = localStorage.getItem('nihomi_student_coins');
            if (stored) setCoins(parseInt(stored, 10));
          } catch {}
        }
      });
      setPaywallModalOpen(true);
      return;
    }

    const deducted = deductCoins(10);
    if (!deducted) return;

    setIsSenseiThinking(true);
    const query = senseiQuery.trim();
    setSenseiQuery('');

    // Pre-structured contextual responses for ultra-fast, offline-resilient immersion
    setTimeout(() => {
      let replyJa = 'はい、田中先生です。渋谷での生活とアルバイトで一番大切なのは、明るい挨拶と時間厳守です！';
      let replyBn = 'হ্যাঁ, তানাকা সেনসেই শুনছি। শিবুয়াতে কাজ ও দৈনন্দিন জীবনে সবচেয়ে জরুরি হলো প্রাণবন্ত অভিবাদন এবং সময়ানুবর্তিতা!';

      const qLower = query.toLowerCase();
      if (qLower.includes('conbini') || qLower.includes('7-eleven') || query.includes('コンビニ')) {
        replyJa = 'コンビニでは「いらっしゃいませ」「お弁当温めますか？」を一番よく使います。袋が必要かも必ず確認しましょう。';
        replyBn = 'কনবিনিতে "ইরাশশাইমাসে" এবং "ওবেন্তো গরম করব কি?" বাক্য দুটি সবচেয়ে বেশি ব্যবহৃত হয়। ব্যাগ লাগবে কিনা নিশ্চিত হোন।';
      } else if (qLower.includes('interview') || qLower.includes('baito') || query.includes('面接')) {
        replyJa = '面接では「はじめまして、よろしくお願いいたします」「週に28時間以内で働けます」と誠実に答えるのが合格の秘訣です。';
        replyBn = 'ইন্টারভিউতে "প্রথম সাক্ষাতে আনন্দিত" এবং "সপ্তাহে ২৮ ঘণ্টার মধ্যে কাজ করব" আন্তরিকভাবে বলাই সফলতার মূল চাবিকাঠি।';
      } else if (qLower.includes('restaurant') || qLower.includes('izakaya') || query.includes('居酒屋')) {
        replyJa = '居酒屋ではお客様が「すみません！」と呼んだら、全員で大きな声で「喜んで！」と即答します。';
        replyBn = 'ইজাকায়াতে কাস্টমার "সুমিমাসেন!" ডাকলে সাথে সাথে জোরে "ইয়োরোকোন্দে!" (আনন্দের সাথে!) উত্তর দিন।';
      }

      setSenseiResponse(`${replyJa}\n\n[বাংলা ব্যাখ্যা]: ${replyBn}`);
      setIsSenseiThinking(false);
      handlePlayVoice(replyJa);
    }, 600);
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

  // GATE 1: Premium Apple-Grade Landing Page / Hero Overlay (Hides 3D Canvas until student starts journey)
  if (!isJourneyStarted) {
    return (
      <div className="relative w-full min-h-screen bg-[#06060c] text-white overflow-hidden font-sans select-none flex flex-col justify-between" id="landing-hero-overlay">
        {/* Ambient Tokyo Aurora Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-red-600/25 via-rose-600/15 to-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Apple-grade Minimalist Top Header */}
        <header className="relative z-20 w-full px-6 sm:px-12 py-5 flex items-center justify-between border-b border-white/5 bg-[#06060c]/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-900/30 ring-1 ring-white/20">
              <span className="text-white font-bold text-sm tracking-wider">日</span>
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base text-white">Nihomi AI™</span>
              <p className="text-[10px] text-zinc-400 font-medium">Continuous Japanese Learning Companion</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 backdrop-blur-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-zinc-200">東京都 渋谷区</span>
              <span className="text-zinc-500">•</span>
              <span className="font-mono text-amber-300 font-semibold">{currentTimeJST} JST</span>
            </div>

            <button
              onClick={() => onNavigate('courses')}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 transition-all cursor-pointer"
            >
              কোর্স (Curriculum)
            </button>

            {user ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-md shadow-red-900/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Dashboard →
              </button>
            ) : (
              <button
                onClick={() => setIsInCanvasAuthOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 active:scale-95 transition-all cursor-pointer"
              >
                লগইন (Sign In)
              </button>
            )}
          </div>
        </header>

        {/* Center Hero Content (Apple-Grade Typography & Design) */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 py-12 sm:py-16 text-center space-y-8 my-auto">
          {/* Continuous Learning Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-zinc-300">
              NIHOMI AI™ • NEXT-GEN JAPANESE PLATFORM
            </span>
          </div>

          {/* Master Headline & Sub-headline */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none">
              Nihomi AI™
            </h1>
            <p className="text-2xl sm:text-4xl text-zinc-300 font-light max-w-2xl mx-auto leading-tight">
              You don't just learn Japanese.{' '}
              <br />
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300">
                You experience it.
              </span>
            </p>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed">
            টোকিও শহরের বাস্তব পরিবেশে মিন্না নো নিহোঙ্গো কারিকুলাম, ২৪/৭ তানাকা AI সেনসেই লাইভ টিউটর এবং কনবিনি জব সিমুলেশন — সব কিছু এক প্ল্যাটফর্মে।
          </p>

          {/* Action: Clear "Start Journey" button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                worldAudio.playTokyoChime();
                setIsJourneyStarted(true);
              }}
              className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-4.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-base sm:text-lg rounded-2xl shadow-2xl shadow-red-600/40 hover:shadow-red-500/60 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
              id="btn-start-journey"
            >
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>Start Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Student Dashboard</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>

          {/* 4 Apple-grade Feature Cards */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-lg block mb-1">🏙️</span>
              <p className="text-xs font-bold text-white">Tokyo Spatial World</p>
              <p className="text-[11px] text-zinc-400">শিবুয়া ক্রসিং ও কনবিনি</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-lg block mb-1">🤖</span>
              <p className="text-xs font-bold text-white">Tanaka AI Sensei</p>
              <p className="text-[11px] text-zinc-400">বাংলায় ২৪/৭ ব্যাকরণ টিউটর</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-lg block mb-1">🏪</span>
              <p className="text-xs font-bold text-white">Nihomi WorkOS™</p>
              <p className="text-[11px] text-zinc-400">৭-ইলেভেন ক্যাশিয়ার ড্রিল</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-lg block mb-1">📜</span>
              <p className="text-xs font-bold text-white">JLPT N5–N1</p>
              <p className="text-[11px] text-zinc-400">মিন্না নো নিহোঙ্গো ১–২৫</p>
            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <footer className="relative z-20 w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 border-t border-white/5 bg-[#06060c]/60 backdrop-blur-md gap-2">
          <span>© NIHOMI AI™ — Dhaka to Tokyo Japanese Language OS</span>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('courses')} className="hover:text-zinc-300 transition-colors">Courses</button>
            <button onClick={() => onNavigate('start')} className="hover:text-zinc-300 transition-colors">1-Min Test</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-zinc-300 transition-colors">Help & Contact</button>
          </div>
        </footer>

        {isInCanvasAuthOpen && (
          <InCanvasAuthModal
            isOpen={isInCanvasAuthOpen}
            onClose={() => setIsInCanvasAuthOpen(false)}
            onAuthSuccess={() => {
              setIsInCanvasAuthOpen(false);
              onNavigate('dashboard');
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-[#06060c] text-slate-100 overflow-hidden font-sans select-none flex flex-col justify-between">
      {experienceMode === 'playable_3d' ? (
        <div className="relative w-full h-screen">
          <button
            onClick={() => setIsJourneyStarted(false)}
            className="absolute top-4 left-4 z-40 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs border border-white/20 backdrop-blur-md shadow-2xl flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer pointer-events-auto"
            title="Return to Landing Overview"
          >
            <span>← Overview</span>
          </button>
          <ShibuyaPlayableWorld
            coins={coins}
            onAddCoins={addCoins}
            onNavigate={onNavigate}
            currentTimeJST={currentTimeJST}
            onSwitchToPanorama={() => setExperienceMode('panorama_360')}
          />
        </div>
      ) : (
        <>
          {/* 1. 3D/360° WEBGL STREET VIEW PANORAMIC CANVAS LAYER */}
          <Shibuya3DCanvas
            hotspots={SHIBUYA_HOTSPOTS}
            selectedHotspotId={selectedHotspot?.id || null}
            onSelectHotspot={(spot) => {
              setSelectedHotspot(spot);
              worldAudio.playTokyoChime();
            }}
            unlockedHotspots={unlockedHotspots}
            userPlanId={user?.planId || 'free'}
            missionComplete={missionComplete}
          />

          {/* Atmospheric Overlays for Readability & Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#06060c] via-transparent to-[#06060c]/70 pointer-events-none z-10" />

          {/* 2. MINIMALIST CINEMATIC HUD / TOP BAR (No Generic SaaS Buttonism) */}
          <header className="relative z-30 w-full px-4 sm:px-8 pt-5 pb-3 flex items-center justify-between border-b border-white/5 bg-[#06060c]/60 backdrop-blur-md">
            {/* Left: Brand & Telemetry */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsJourneyStarted(false)}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
                title="Return to Landing Overview"
              >
                <span>← Overview</span>
              </button>
              <button
                onClick={() => { setSelectedHotspot(null); setActiveMission('none'); }}
                className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-900/30 ring-1 ring-white/20">
                  <span className="text-white font-bold text-sm tracking-wider">に</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold tracking-tight text-sm text-white group-hover:text-amber-300 transition-colors">
                      Nihomi Experience™
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      SHIBUYA 360° V3
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExperienceMode('playable_3d');
                      }}
                      className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500/30 to-teal-500/20 hover:from-emerald-500/40 hover:to-teal-500/30 border border-emerald-400/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all active:scale-95"
                      title="Switch to Playable 3D Shibuya Crossing with WASD controls"
                    >
                      <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>🎮 Playable 3D</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-medium">Nihomi Experience™ • Real Japan Canvas™</p>
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

        {/* Right: Coin Economy HUD, Ambient Audio, AI Sensei Chat, Auth */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Nihomi Coin Balance Pill (Clickable -> In-Canvas Coin Vault & Top-Up) */}
          <button
            onClick={() => {
              setPaywallConfig({
                mode: 'coin_topup',
                hotspotTitle: 'Nihomi Coin Vault',
                hotspotTitleJa: 'ニホミコイン ウォレット',
                onUnlockSuccess: () => {
                  try {
                    const stored = localStorage.getItem('nihomi_student_coins');
                    if (stored) setCoins(parseInt(stored, 10));
                  } catch {}
                }
              });
              setPaywallModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-500/10 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-md shadow-amber-500/10 hover:border-amber-400 transition-all active:scale-95"
            title="Nihomi Coins — Click to Top Up or Redeem"
          >
            <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-mono tracking-tight">{coins}</span>
            <span className="text-[10px] text-amber-200/80 font-normal">Coins</span>
          </button>

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

          {/* Tanaka AI Sensei Instant Chat Launcher */}
          <button
            onClick={() => setIsSenseiChatOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-xs font-bold text-zinc-200 transition-all flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">AI সেনসেই</span>
            <span className="sm:hidden">Sensei</span>
          </button>

          {/* Quick Bridge to Classic Courses & Dashboard */}
          <button
            onClick={() => onNavigate('courses')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-semibold text-zinc-200 transition-all flex items-center gap-1.5"
            title="Access Minna no Nihongo 1-25 & Full Curriculum"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">কোর্স</span>
          </button>

          {/* In-Canvas User Sign-in / Avatar (Zero-Redirect) */}
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
              onClick={() => setIsInCanvasAuthOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-md shadow-rose-900/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>লগইন</span>
            </button>
          )}
        </div>
      </header>

      {/* 4. AI SENSEI ADAPTIVE WELCOME CARD (BOTTOM CENTER) */}
      {!selectedHotspot && activeMission === 'none' && !isSenseiChatOpen && (
        <div className="relative bottom-4 inset-x-4 max-w-2xl mx-auto z-20">
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/90 border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/90">
            <div className="flex items-start gap-3.5 mb-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-white font-extrabold text-sm">田</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">Tanaka Sensei • Nihomi Sensei AI™ (田中先生)</h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live in Tokyo 360°
                    </span>
                  </div>
                  {/* Coin prompt */}
                  <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> +50 Coins per Mission
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-1">
                  "Welcome to Japan. 🇯🇵 Drag anywhere to look around Shibuya Crossing. Learn by exploring places, speaking real phrases, and trying authentic jobs."
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
                <p className="text-[11px] text-zinc-400 mt-0.5">১ম সম্ভাষণ শিখুন (+50 Coins)</p>
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

              {/* 3: Test My Japanese (Test to Earn +50 Coins) */}
              <button
                onClick={() => {
                  setIsDiagnosticOpen(true);
                  setDiagStep(0);
                  setDiagCompleted(false);
                  worldAudio.playTokyoChime();
                }}
                className="p-3 rounded-xl bg-gradient-to-b from-cyan-500/15 to-cyan-500/5 hover:from-cyan-500/25 hover:to-cyan-500/15 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                    実力判定 • TEST TO EARN
                  </span>
                  <Coins className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-200">আমার দক্ষতা যাচাই</h4>
                <p className="text-[11px] text-amber-300 font-semibold mt-0.5">৩টি প্রশ্নে জিতে নিন +৫০ কয়েন</p>
              </button>
            </div>
          </div>
        </div>
      )}

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
            {/* Real Subscription Options for Tokyo Language Academy */}
            {selectedHotspot.id === 'spot-school' && (
              <div className="mt-6 p-4 rounded-2xl bg-zinc-900/90 border border-indigo-500/30 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      ল্যাঙ্গুয়েজ স্কুল মেম্বারশিপ প্ল্যান
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                    JLPT N5-N1
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Starter Tier */}
                  <div
                    onClick={() => {
                      setPaywallConfig({
                        mode: 'academy_upgrade',
                        initialTrack: 'continuous',
                        hotspotTitle: 'Tokyo Japanese Language Academy',
                        hotspotTitleJa: '東京渋谷日本語アカデミー'
                      });
                      setPaywallModalOpen(true);
                    }}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/50 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Starter Learner (N5)</span>
                        <span className="text-[10px] text-amber-300 font-mono">100 Coins/mo</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">লেসন ১-২৫ ও ডিজিটাল স্টুডেন্ট আইডি</p>
                    </div>
                    <span className="text-sm font-extrabold text-amber-300 font-mono">৳990<span className="text-[10px] text-zinc-400 font-normal">/mo</span></span>
                  </div>

                  {/* Pro Tier (Popular) */}
                  <div
                    onClick={() => {
                      setPaywallConfig({
                        mode: 'academy_upgrade',
                        initialTrack: 'continuous',
                        hotspotTitle: 'Tokyo Japanese Language Academy',
                        hotspotTitleJa: '東京渋谷日本語アカデミー'
                      });
                      setPaywallModalOpen(true);
                    }}
                    className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-indigo-500/10 hover:from-amber-500/25 border border-amber-400/50 cursor-pointer transition-all flex items-center justify-between relative"
                  >
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded text-[8px] font-black bg-amber-400 text-zinc-950">
                      POPULAR
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Nihomi PRO Learning (N5+N4)</span>
                        <span className="text-[10px] text-amber-300 font-mono">500 Coins/mo</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 mt-0.5">ভয়েস AI সেনসেই ও ফুল মক এক্সাম ইঞ্জিন</p>
                    </div>
                    <span className="text-sm font-extrabold text-amber-300 font-mono">৳1,990<span className="text-[10px] text-zinc-400 font-normal">/mo</span></span>
                  </div>

                  {/* Japan Trip Pass Option */}
                  <div
                    onClick={() => {
                      setPaywallConfig({
                        mode: 'academy_upgrade',
                        initialTrack: 'trip_pass',
                        hotspotTitle: 'Tokyo Japanese Language Academy',
                        hotspotTitleJa: '東京渋谷日本語アカデミー'
                      });
                      setPaywallModalOpen(true);
                    }}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-300">Japan Trip Pass (Tourist Track)</span>
                        <span className="text-[10px] text-cyan-200 font-mono">7–30 Days</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">টোকিও সারভাইভাল ও সাবওয়ে ডাইনিং নেভিগেশন</p>
                    </div>
                    <span className="text-sm font-extrabold text-cyan-300 font-mono">৳1,490<span className="text-[10px] text-zinc-400 font-normal"> থেকে</span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger Button */}
          <div className="pt-6 mt-6 border-t border-white/10">
            {selectedHotspot.id === 'spot-restaurant' && !unlockedHotspots.includes('spot-restaurant') && (!user?.planId || user.planId === 'free' || user.planId === 'starter') ? (
              <button
                onClick={() => {
                  setPaywallConfig({
                    mode: 'coin_unlock',
                    hotspotTitle: 'Izakaya Staff Roleplay (Torikizoku Center-Gai)',
                    hotspotTitleJa: '鳥貴族 居酒屋接客ロールプレイング',
                    unlockCostCoins: 20,
                    onUnlockSuccess: () => {
                      unlockHotspot('spot-restaurant');
                      try {
                        const stored = localStorage.getItem('nihomi_student_coins');
                        if (stored) setCoins(parseInt(stored, 10));
                      } catch {}
                      onNavigate(selectedHotspot.directAction.viewTarget, selectedHotspot.directAction.params);
                    }
                  });
                  setPaywallModalOpen(true);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Coins className="w-4 h-4 text-zinc-950" />
                <span>২০ নিহোমি কয়েন দিয়ে রেস্তোরাঁ রোলপ্লে আনলক করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : selectedHotspot.id === 'spot-school' && (!user?.planId || user.planId === 'free') ? (
              <button
                onClick={() => {
                  setPaywallConfig({
                    mode: 'academy_upgrade',
                    initialTrack: 'continuous',
                    hotspotTitle: 'Tokyo Japanese Language Academy',
                    hotspotTitleJa: '東京渋谷日本語アカデミー',
                    onUnlockSuccess: () => {
                      unlockHotspot('spot-school');
                      onNavigate('courses');
                    }
                  });
                  setPaywallModalOpen(true);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:brightness-110 text-white font-extrabold text-sm shadow-xl shadow-rose-900/30 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>নিহোমি প্রো / ট্রিপ পাস নিয়ে একাডেমিতে প্রবেশ করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
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
            )}
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
              <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" /> +50 Coins (+50 XP)
              </span>
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
              <span>উচ্চারণ সম্পন্ন করেছি — মিশন সম্পন্ন করুন (+৫০ কয়েন)</span>
            </button>
          </div>
        </div>
      )}

      {/* 7. TOKYO SURVIVAL DIAGNOSTIC MODAL (TEST TO EARN +50 NIHOMI COINS) */}
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
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    TEST TO EARN ({diagStep + 1} / {TOKYO_SURVIVAL_DIAGNOSTIC.length})
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
              /* Diagnostic Completed & Coin Reward Screen */
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/20">
                  <Coins className="w-9 h-9 text-zinc-950 animate-bounce" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> REWARD UNLOCKED: +50 NIHOMI COINS!
                </div>
                <h3 className="text-xl font-black text-white">অভিনন্দন! আপনি টোকিও সারভাইভাল পাস করেছেন</h3>
                <p className="text-xs text-emerald-300 font-semibold mt-1">
                  সারভাইভাল রেটিং: Grade A (Tokyo Workplace Ready)
                </p>
                <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
                  আপনার অর্জিত ৫০টি নিহোমি কয়েন দিয়ে আপনি সরাসরি তানাকা সেনসেইয়ের লাইভ এআই কোচিং ও কনবিনি সিমুলেশন আনলক করতে পারবেন।
                </p>

                {/* If user not logged in, prompt seamless in-canvas login to save */}
                {!user && (
                  <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10 text-left flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-white">কয়েন ক্লাউডে সংরক্ষণ করুন</p>
                      <p className="text-[11px] text-zinc-400">লগইন ছাড়াই অর্জিত, তবে একাউন্টে সেভ করা উত্তম</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsDiagnosticOpen(false);
                        setIsInCanvasAuthOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-zinc-950 text-xs font-bold whitespace-nowrap"
                    >
                      সেভ করুন
                    </button>
                  </div>
                )}

                <div className="mt-6 space-y-2.5">
                  <button
                    onClick={() => {
                      setIsDiagnosticOpen(false);
                      onNavigate('baito', { scenarioId: 'sc-conbini-pos', tab: 'pos_terminal' });
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-xs shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Start Conbini POS Simulator (WorkOS™)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsDiagnosticOpen(false);
                      setIsSenseiChatOpen(true);
                    }}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-amber-300 font-semibold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>কয়েন দিয়ে AI সেনসেইয়ের সাথে কথা বলুন</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. TANAKA AI SENSEI IN-CANVAS VOICE & CHAT DRAWER (COIN REDEMPTION UTILITY) */}
      {isSenseiChatOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-zinc-950/95 border-l border-white/10 backdrop-blur-2xl z-40 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-extrabold text-sm">
                  田
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Tanaka Sensei • Nihomi Sensei AI™ (田中先生)</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Tokyo Real-Time Coach</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsSenseiChatOpen(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Coin Utility Status Banner */}
            <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-amber-300 font-mono">{coins} Coins Available</span>
              </div>
              <span className="text-[10px] text-zinc-400">10 Coins / Query</span>
            </div>

            {/* Conversation Area */}
            <div className="mt-5 space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-300 leading-relaxed">
                こんにちは！田中先生です。渋谷でのアルバイトや日本語の挨拶、日常会話について何でも聞いてください。（1回の質問で10コイン消費）
              </div>

              {senseiResponse && (
                <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-500/15 to-zinc-900 border border-amber-400/40 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                    <span>NIHOMI SENSEI AI™ ANALYSIS</span>
                    <button
                      onClick={() => handlePlayVoice(senseiResponse.split('\n')[0])}
                      className="p-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300"
                      title="Replay Voice"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-white whitespace-pre-wrap leading-relaxed">{senseiResponse}</p>
                </div>
              )}

              {isSenseiThinking && (
                <div className="flex items-end gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 animate-in fade-in">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shrink-0 shadow-xs">
                    <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                      <span className="font-japanese font-black text-amber-400 text-[9px]">田中</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-300 font-medium">Tanaka Sensei is typing</span>
                    <div className="flex items-center gap-1 pt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-typing-dot" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-typing-dot" style={{ animationDelay: '200ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-typing-dot" style={{ animationDelay: '400ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompt Chips */}
            <div className="mt-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                দ্রুত প্রশ্ন (Quick Prompts)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'কনবিনিতে ব্যাগ চাওয়ার নিয়ম কী?',
                  'ইন্টারভিউতে কীভাবে সম্ভাষণ করব?',
                  'রেস্তোরাঁয় অর্ডার নেওয়ার নিয়ম'
                ].map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => setSenseiQuery(prompt)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] text-zinc-300 text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Query Input Box */}
          <div className="pt-4 border-t border-white/10">
            <div className="relative">
              <input
                type="text"
                value={senseiQuery}
                onChange={(e) => setSenseiQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAskSensei();
                }}
                placeholder="জাপানিজ বা বাইতো নিয়ে প্রশ্ন করুন..."
                className="w-full pl-3 pr-10 py-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60"
              />
              <button
                onClick={handleAskSensei}
                disabled={!senseiQuery.trim() || isSenseiThinking}
                className="absolute right-2 top-2 p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold disabled:opacity-40 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 text-center mt-2">
              🪙 10 Coins consumed per voice interaction • Instant native Tokyo pronunciation
            </p>
          </div>
        </div>
      )}

      {/* 9. IN-CANVAS AUTH MODAL (ZERO REDIRECTS) */}
      <InCanvasAuthModal
        isOpen={isInCanvasAuthOpen}
        onClose={() => setIsInCanvasAuthOpen(false)}
        coinsPending={50}
        onAuthSuccess={() => {
          addCoins(50);
          triggerCelebrationConfetti();
        }}
      />

      {/* 9.1 CONTEXTUAL PAYWALL & EXPANSION REVENUE MODAL (ZERO BUTTONISM) */}
      <ContextualPaywallModal
        isOpen={paywallModalOpen}
        onClose={() => setPaywallModalOpen(false)}
        mode={paywallConfig.mode}
        hotspotTitle={paywallConfig.hotspotTitle}
        hotspotTitleJa={paywallConfig.hotspotTitleJa}
        unlockCostCoins={paywallConfig.unlockCostCoins}
        initialTrack={paywallConfig.initialTrack}
        onUnlockSuccess={() => {
          try {
            const stored = localStorage.getItem('nihomi_student_coins');
            if (stored) setCoins(parseInt(stored, 10));
          } catch {}
          paywallConfig.onUnlockSuccess?.();
        }}
      />

      {/* 10. MINIMAL FOOTER TELEMETRY & 360° CONTROLS GUIDE */}
      <footer className="relative z-30 w-full px-4 sm:px-8 py-3 flex items-center justify-between border-t border-white/5 bg-[#06060c]/60 backdrop-blur-md text-[11px] text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-zinc-300">NIHOMI WORLD™ V3</span>
          <span className="text-zinc-600">•</span>
          <span className="hidden sm:inline">Experience Japan. Before You Arrive.</span>
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
        </>
      )}
    </div>
  );
};
