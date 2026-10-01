import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Volume2,
  CheckCircle2,
  X,
  Trophy,
  Award,
  BookOpen,
  Send,
  Store,
  Check,
  Sun
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';
import { trackNihomiEvent } from '../../utils/analytics';
import { ContextualSenseiCompanion } from '../ai/ContextualSenseiCompanion';
import { InteractiveKanaTraceCanvas } from './InteractiveKanaTraceCanvas';
import {
  IconSprout3D,
  IconBrush3D,
  IconSun3D,
  IconKonbini3D,
  IconTrophy3D,
  IconApple3D,
  IconTarget3D,
  IconRocket3D,
  IconCelebration3D,
  IconTokyoMap3D,
  IconLightbulb3D
} from './Journey3DIcons';

export interface LearnerJourneyEngineProps {
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: (view: string, params?: Record<string, any>) => void;
  isModal?: boolean;
}

// 5 Canonical Stages of Mandate v6.0 Blueprint
// Flow: START -> 'あ' KANA ENGINE -> FIRST WORD ('あさ') -> TOKYO KONBINI -> MISSION COMPLETE & WHATSAPP ACCOUNT
type GoldenJourneyStage =
  | 'start'             // 1. START (Welcome to Tokyo, Mt. Fuji Sunset Panorama)
  | 'kana_engine'       // 2. 'あ' KANA ENGINE (Touch, Hear, Trace on Hosho Paper Canvas)
  | 'word_asa'          // 3. FIRST REAL WORD ('あさ' - Asa • Pure Hiragana, NO kanji 朝!)
  | 'konbini'           // 4. TOKYO KONBINI SCENARIO (Zero Cut-Off, Widescreen 7-Eleven)
  | 'mission_complete'; // 5. MISSION 01 COMPLETE & WHATSAPP INSTANT ACCOUNT

interface StageMeta {
  id: GoldenJourneyStage;
  label: string;
  Icon: React.FC<{ className?: string; size?: number }>;
}

const GOLDEN_STAGES: StageMeta[] = [
  { id: 'start', label: 'শুরু', Icon: IconSprout3D },
  { id: 'kana_engine', label: "'あ' লেখা", Icon: IconBrush3D },
  { id: 'word_asa', label: 'প্রথম শব্দ', Icon: IconSun3D },
  { id: 'konbini', label: 'কনবিনি', Icon: IconKonbini3D },
  { id: 'mission_complete', label: 'সম্পন্ন', Icon: IconTrophy3D }
];

// ============================================================================
// FULL-BLEED JAPANESE PANORAMA: Mt. Fuji Sunset, Tokyo Skyline & Tanaka Sensei
// ============================================================================
const TokyoScenicPanorama: React.FC<{ isCompact?: boolean }> = ({ isCompact = false }) => (
  <div className={`relative w-full max-w-2xl lg:max-w-3xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-[#161233] via-[#241744] to-[#0e0a1c] border border-amber-500/25 shadow-2xl flex items-center justify-center ${isCompact ? 'h-36 sm:h-40 max-h-40' : 'h-36 sm:h-44 md:h-48 max-h-48 md:max-h-52'}`}>
    <svg viewBox="0 0 600 240" className="w-full h-full object-cover">
      <defs>
        <linearGradient id="panoSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#18133d" />
          <stop offset="50%" stopColor="#2e1a4d" />
          <stop offset="100%" stopColor="#4c1945" />
        </linearGradient>
        <radialGradient id="panoSunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff4d4f" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#f43f5e" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="panoFuji" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#e2e8f0" />
          <stop offset="55%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="panoTower" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff3b30" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <filter id="lanternGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Sky */}
      <rect width="600" height="240" fill="url(#panoSky)" />

      {/* Rising Sun Glow */}
      <circle cx="300" cy="105" r="85" fill="url(#panoSunGlow)" />
      <circle cx="300" cy="105" r="46" fill="#ff4d4f" opacity="0.92" />

      {/* Mt. Fuji Silhouette */}
      <polygon points="180,210 300,75 420,210" fill="url(#panoFuji)" opacity="0.96" />
      <polygon points="260,118 300,75 340,118 325,128 310,120 300,126 290,120 275,128" fill="#ffffff" />

      {/* Tokyo Skyline Silhouettes */}
      <rect x="30" y="160" width="40" height="70" fill="#0b0820" opacity="0.85" />
      <rect x="65" y="145" width="45" height="85" fill="#140f33" opacity="0.9" />
      <rect x="105" y="170" width="30" height="60" fill="#0b0820" />
      <rect x="440" y="150" width="50" height="80" fill="#140f33" opacity="0.9" />
      <rect x="485" y="165" width="40" height="65" fill="#0b0820" opacity="0.85" />
      <rect x="520" y="140" width="45" height="90" fill="#140f33" />

      {/* Tokyo Tower Vector with Pulsing Beacon */}
      <polygon points="205,210 207,105 211,105 213,210" fill="url(#panoTower)" />
      <polygon points="204,210 201,210 207,150 211,150 217,210 214,210 209,160" fill="url(#panoTower)" />
      <line x1="209" y1="105" x2="209" y2="80" stroke="#ff3b30" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="203" y1="160" x2="215" y2="160" stroke="#ffffff" strokeWidth="1.8" />
      <line x1="205" y1="135" x2="213" y2="135" stroke="#ffffff" strokeWidth="1.8" />

      {/* Subtle Pulsing Red Signal Beacon at Tokyo Tower Peak */}
      <circle cx="209" cy="80" r="3.5" fill="#ff3b30">
        <animate attributeName="r" values="2.5;5;2.5" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="209" cy="80" r="8" fill="none" stroke="#ff3b30" strokeWidth="1">
        <animate attributeName="r" values="3;14;3" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0;0.8" dur="1.6s" repeatCount="indefinite" />
      </circle>

      {/* Sakura Petals */}
      <path d="M80,65 C85,60 92,63 90,70 C88,75 80,77 78,73 Z" fill="#f472b6" opacity="0.75" />
      <path d="M130,95 C133,92 138,94 137,98 C135,102 130,103 128,100 Z" fill="#f472b6" opacity="0.65" />
      <path d="M460,55 C465,51 471,54 469,60 C467,64 461,66 459,62 Z" fill="#f472b6" opacity="0.75" />
      <path d="M510,85 C514,82 519,84 518,89 C516,92 512,94 510,91 Z" fill="#f472b6" opacity="0.6" />

      {/* Twin Hanging Japanese Paper Lanterns (提灯: にほ & 東京) with Gentle Floating Animation */}
      <g filter="url(#lanternGlow)">
        <g>
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,-3.5; 0,0" dur="3.2s" repeatCount="indefinite" />
          <path d="M57,18 L57,44 C57,54 38,54 38,44 L38,18 Z" fill="#ef4444" opacity="0.95" />
          <line x1="47.5" y1="8" x2="47.5" y2="18" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="47.5" cy="35" r="7" fill="#fef08a" opacity="0.7" />
          <text x="47.5" y="38" fill="#1e1b4b" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="'Noto Sans JP', sans-serif">にほ</text>
          <line x1="47.5" y1="50" x2="47.5" y2="60" stroke="#ef4444" strokeWidth="1.5" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,3.5; 0,0" dur="2.8s" repeatCount="indefinite" />
          <path d="M562,18 L562,44 C562,54 543,54 543,44 L543,18 Z" fill="#ef4444" opacity="0.95" />
          <line x1="552.5" y1="8" x2="552.5" y2="18" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="552.5" cy="35" r="7" fill="#fef08a" opacity="0.7" />
          <text x="552.5" y="38" fill="#1e1b4b" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="'Noto Sans JP', sans-serif">東京</text>
          <line x1="552.5" y1="50" x2="552.5" y2="60" stroke="#ef4444" strokeWidth="1.5" />
        </g>
      </g>

      {/* Cheerful Tanaka Sensei Character Vector (Friendly & Animated Waving) */}
      <g transform="translate(300, 100)">
        <rect x="-18" y="55" width="36" height="55" rx="10" fill="#1e1b4b" />
        <polygon points="-6,55 0,65 6,55 0,58" fill="#ffffff" />
        <polygon points="-2,62 2,62 0,78" fill="#ef4444" />
        <circle cx="0" cy="35" r="18" fill="#fed7aa" />
        <path d="M-18,32 Q0,18 18,32 Q12,20 0,20 Q-12,20 -18,32 Z" fill="#0f172a" />
        <rect x="-14" y="30" width="10" height="8" rx="2" fill="none" stroke="#0f172a" strokeWidth="1.8" />
        <rect x="4" y="30" width="10" height="8" rx="2" fill="none" stroke="#0f172a" strokeWidth="1.8" />
        <line x1="-4" y1="34" x2="4" y2="34" stroke="#0f172a" strokeWidth="1.8" />
        <path d="M-6,44 Q0,49 6,44" stroke="#dc2626" strokeWidth="1.8" fill="none" strokeLinecap="round" />

        {/* Animated Waving Arm */}
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 18 65; -14 18 65; 0 18 65; 10 18 65; 0 18 65" dur="2s" repeatCount="indefinite" />
          <path d="M18,65 Q30,50 25,35" stroke="#1e1b4b" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="25" cy="35" r="5" fill="#fed7aa" />
        </g>

        {/* Floating Speech Bubble with Soft Blinking Greeting Badge */}
        <g transform="translate(32, 20)">
          <animateTransform attributeName="transform" type="translate" values="32,20; 32,17; 32,20" dur="2.4s" repeatCount="indefinite" />
          <rect x="0" y="0" width="70" height="26" rx="8" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
            <animate attributeName="opacity" values="0.95;1;0.95" dur="2.4s" repeatCount="indefinite" />
          </rect>
          <polygon points="0,13 -6,17 0,20" fill="#ffffff" />
          <text x="35" y="17" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="'Noto Sans JP', sans-serif">
            こんにちは!
          </text>
        </g>
      </g>
    </svg>
  </div>
);

// ============================================================================
// WIDESCREEN TOKYO 7-ELEVEN STORE & CASHIER SCENARIO VECTOR (Zero Cut-Off)
// ============================================================================
const TokyoKonbiniWidescreenVector: React.FC<{ onCashierSpeak: () => void }> = ({ onCashierSpeak }) => (
  <div className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-[#17142d] via-[#1b1735] to-[#0c0a1a] border border-amber-500/30 shadow-2xl flex items-center justify-center h-36 sm:h-40 md:h-44 max-h-44">
    <svg viewBox="0 0 540 220" className="w-full h-full object-cover">
      <defs>
        <linearGradient id="konbiniWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e1840" />
          <stop offset="100%" stopColor="#0c091d" />
        </linearGradient>
        <linearGradient id="counterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
      </defs>

      {/* Wall */}
      <rect width="540" height="220" fill="url(#konbiniWall)" />

      {/* 7-Eleven Iconic Orange/Green/Red Stripes across the top */}
      <rect x="0" y="0" width="540" height="9" fill="#ff6700" />
      <rect x="0" y="9" width="540" height="9" fill="#008542" />
      <rect x="0" y="18" width="540" height="9" fill="#ea2825" />

      {/* Tokyo 7-Eleven Store Sign (Custom Vector Badge, 0 System Emoji) */}
      <rect x="25" y="42" width="135" height="34" rx="8" fill="#ffffff" opacity="0.95" />
      <circle cx="42" cy="59" r="8" fill="#ff6700" />
      <text x="42" y="63" fill="#ffffff" fontSize="10" fontWeight="900" textAnchor="middle">7</text>
      <text x="94" y="63" fill="#008542" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        TOKYO 7-ELEVEN
      </text>

      {/* Onigiri & Bento Shelves */}
      <rect x="25" y="88" width="130" height="60" rx="8" fill="#141126" stroke="#4b5563" strokeWidth="1.2" />
      <polygon points="40,118 47,104 54,118" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
      <rect x="44" y="112" width="6" height="6" fill="#0f172a" />
      <polygon points="60,118 67,104 74,118" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
      <rect x="64" y="112" width="6" height="6" fill="#0f172a" />
      <rect x="80" y="104" width="22" height="14" rx="3" fill="#ef4444" opacity="0.8" />
      <rect x="108" y="104" width="24" height="14" rx="3" fill="#10b981" opacity="0.8" />
      <rect x="35" y="128" width="18" height="12" rx="3" fill="#6366f1" opacity="0.75" />
      <rect x="58" y="128" width="18" height="12" rx="3" fill="#ec4899" opacity="0.75" />
      <rect x="81" y="128" width="18" height="12" rx="3" fill="#f59e0b" opacity="0.75" />
      <rect x="104" y="128" width="18" height="12" rx="3" fill="#14b8a6" opacity="0.75" />

      {/* Checkout Counter */}
      <rect x="175" y="152" width="365" height="68" fill="url(#counterGrad)" />
      <line x1="175" y1="152" x2="540" y2="152" stroke="#60a5fa" strokeWidth="2" opacity="0.4" />

      {/* POS Cash Register Screen showing glowing ¥540 */}
      <rect x="390" y="112" width="62" height="42" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
      <rect x="395" y="117" width="52" height="26" rx="4" fill="#0369a1" opacity="0.8" />
      <text x="421" y="134" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
        ¥540
        <animate attributeName="opacity" values="0.85;1;0.85" dur="2s" repeatCount="indefinite" />
      </text>
      <rect x="415" y="154" width="12" height="8" fill="#334155" />

      {/* Cashier Character (Kenji-san) in 7-Eleven Uniform */}
      <g transform="translate(290, 82)">
        <rect x="-24" y="58" width="48" height="62" rx="10" fill="#15803d" />
        <rect x="-10" y="58" width="20" height="62" fill="#ea580c" />
        <polygon points="-6,58 0,66 6,58 0,60" fill="#ffffff" />
        <circle cx="0" cy="38" r="19" fill="#fed7aa" />
        <path d="M-19,34 Q0,18 19,34 Q13,22 0,22 Q-13,22 -19,34 Z" fill="#0f172a" />
        <path d="M-18,22 Q0,15 18,22 L15,14 Q0,8 -15,14 Z" fill="#15803d" />
        <line x1="-16" y1="21" x2="16" y2="21" stroke="#ea580c" strokeWidth="2.5" />
        <circle cx="-6" cy="37" r="2.2" fill="#0f172a" />
        <circle cx="6" cy="37" r="2.2" fill="#0f172a" />
        <path d="M-6,44 Q0,49 6,44" stroke="#dc2626" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <rect x="-16" y="70" width="14" height="6" rx="2" fill="#ffffff" />
        <text x="-9" y="75" fill="#0f172a" fontSize="5" fontWeight="bold" textAnchor="middle">
          ケンジ
        </text>
      </g>

      {/* Cashier Speech Bubble: "ありがとうございます!" with Speaker Icon */}
      <g transform="translate(210, 42)" onClick={onCashierSpeak} className="cursor-pointer">
        <rect x="0" y="0" width="190" height="42" rx="10" fill="#ffffff" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.4))" />
        <polygon points="90,42 97,49 104,42" fill="#ffffff" />
        <text x="80" y="22" fill="#0f172a" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="'Noto Sans JP', sans-serif">
          ありがとうございます!
        </text>
        <text x="80" y="34" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle">
          Arigatou gozaimasu! (ধন্যবাদ!)
        </text>
        <circle cx="168" cy="21" r="12" fill="#fee2e2" />
        <path d="M164,17 L167,17 L171,14 L171,28 L167,25 L164,25 Z" fill="#ef4444" />
        <path d="M173,18 Q176,21 173,24" stroke="#ef4444" strokeWidth="1.5" fill="none" />
      </g>
    </svg>
  </div>
);

export const LearnerJourneyEngine: React.FC<LearnerJourneyEngineProps> = ({
  isOpen = true,
  onClose,
  onNavigate,
  isModal = false
}) => {
  // Current Golden Journey Stage (Mandate v6.0 Blueprint: 5 stages)
  const [currentStage, setCurrentStage] = useState<GoldenJourneyStage>('start');

  // Konbini scenario state
  const [selectedKonbiniChar, setSelectedKonbiniChar] = useState<string | null>(null);
  const [isKonbiniSolved, setIsKonbiniSolved] = useState<boolean>(false);
  const [konbiniFeedback, setKonbiniFeedback] = useState<string | null>(null);

  // WhatsApp Instant Account Form state
  const [leadName, setLeadName] = useState<string>('');
  const [leadWhatsapp, setLeadWhatsapp] = useState<string>('');
  const [isLeadSaved, setIsLeadSaved] = useState<boolean>(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  // Auto-record REAL local learning progress upon arriving at Stage 5
  useEffect(() => {
    if (currentStage === 'mission_complete') {
      try {
        const progressPayload = {
          mission: 'mission-01',
          char: 'あ',
          word: 'あさ',
          completedAt: new Date().toISOString()
        };
        localStorage.setItem('nihomi_learning_progress', JSON.stringify(progressPayload));
        soundEffects.playLessonCelebration();
        triggerCelebrationConfetti();
        trackNihomiEvent('first_lesson_completed', {
          lessonId: 'mission-01',
          title: 'Mission 01: Hiragana A',
          studyMinutes: 3,
          xpReward: 50
        });
      } catch (err) {
        console.error('Failed to save learning progress to localStorage:', err);
      }
    }
  }, [currentStage]);

  if (!isOpen) return null;

  const currentStageIndex = GOLDEN_STAGES.findIndex((s) => s.id === currentStage);

  // Handle cashier Japanese audio playback
  const handleCashierSpeak = () => {
    speakJapanese('ありがとうございます');
    soundEffects.playButtonTap();
  };

  // Konbini Challenge: Tap 'あ' in [あ, り, が, と, う]
  const handleKonbiniCharTap = (char: string) => {
    soundEffects.playButtonTap();
    setSelectedKonbiniChar(char);

    if (char === 'あ') {
      setIsKonbiniSolved(true);
      setKonbiniFeedback("অসাধারণ! তুমি জাপানের দোকানে 'あ' চিনে ফেলেছ।");
      soundEffects.playLessonCelebration();
      triggerCelebrationConfetti();
      speakJapanese('あ');
    } else {
      setIsKonbiniSolved(false);
      setKonbiniFeedback(`এটি '${char}' — আমাদের চেনা 'あ' (A) অক্ষরটি আবার খুঁজে বের করো!`);
      soundEffects.playIncorrectSoft();
      speakJapanese(char);
    }
  };

  // Handle WhatsApp Instant Account Submission (MOCK Lead)
  const handleSaveDemoLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadWhatsapp.trim()) {
      setLeadError('দয়া করে তোমার নাম ও হোয়াটসঅ্যাপ নম্বর দাও।');
      return;
    }

    try {
      const demoLeadPayload = {
        name: leadName.trim(),
        whatsapp: leadWhatsapp.trim(),
        mission: 'mission-01',
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('nihomi_demo_lead', JSON.stringify(demoLeadPayload));
      localStorage.setItem('nihomi_foundation_completed', 'true');
      localStorage.setItem('nihomi_mission_001_done', 'true');

      // Sync lesson completion for Lesson 1
      try {
        const raw = localStorage.getItem('nihomi_completed_lessons');
        const currentCompleted: string[] = raw ? JSON.parse(raw) : [];
        if (!currentCompleted.includes('n5-l1')) {
          currentCompleted.push('n5-l1');
          localStorage.setItem('nihomi_completed_lessons', JSON.stringify(currentCompleted));
        }

        const prevXp = parseInt(localStorage.getItem('nihomi_student_xp') || '0', 10);
        const nextXp = prevXp + 100;
        localStorage.setItem('nihomi_student_xp', nextXp.toString());

        window.dispatchEvent(new CustomEvent('nihomi:progress-updated', {
          detail: { type: 'journey', lessonId: 'n5-l1', xp: 100, totalXp: nextXp }
        }));
        window.dispatchEvent(new CustomEvent('nihomi-foundation-unlocked'));
      } catch (syncErr) {
        console.warn('[JourneySync] Progress sync failed:', syncErr);
      }

      setIsLeadSaved(true);
      setLeadError(null);
      soundEffects.playLessonCelebration();
      triggerCelebrationConfetti();
      trackNihomiEvent('lead_captured', demoLeadPayload);
    } catch (err) {
      console.error('Failed to save demo lead to localStorage:', err);
      setLeadError('লোকাল স্টোরেজ সেভ করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div
      className={`${isModal ? 'fixed inset-0 z-50' : 'relative'} min-h-screen w-full flex flex-col justify-between overflow-x-hidden overflow-y-auto bg-[#080711] text-stone-100 selection:bg-red-500/30`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.15) 0%, transparent 60%),
          radial-gradient(circle at 100% 100%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
          linear-gradient(to bottom, #090814 0%, #120f26 50%, #080711 100%)
        `
      }}
    >
      {/* Decorative Hanging Japanese Paper Lanterns (提灯) in corners with gentle floating animation */}
      <div className="hidden lg:block absolute top-0 left-8 pointer-events-none z-40 opacity-85 animate-bounce" style={{ animationDuration: '3.6s' }}>
        <div className="w-10 h-16 rounded-xl bg-gradient-to-b from-red-600 to-rose-700 border border-amber-400/50 shadow-lg shadow-red-600/40 flex items-center justify-center font-japanese text-[11px] font-black text-amber-200">
          にほ
        </div>
      </div>
      <div className="hidden lg:block absolute top-0 right-8 pointer-events-none z-40 opacity-85 animate-bounce" style={{ animationDuration: '4.2s' }}>
        <div className="w-10 h-16 rounded-xl bg-gradient-to-b from-red-600 to-rose-700 border border-amber-400/50 shadow-lg shadow-red-600/40 flex items-center justify-center font-japanese text-[11px] font-black text-amber-200">
          東京
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MISSION WORLD TRACKER HEADER                                              */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-[#0a0916]/95 border-b border-white/10 px-4 sm:px-8 py-2 sm:py-2.5 backdrop-blur-md">
        <div className="max-w-5xl xl:max-w-6xl mx-auto space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center font-black text-white text-xs shadow-md">
                日
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-red-600/30 to-amber-600/30 border border-red-500/40 text-amber-300 text-xs font-black flex items-center gap-1.5 shadow-sm">
                  <IconTokyoMap3D className="w-3.5 h-3.5" />
                  <span>টোকিও জার্নি • মিশন ০১</span>
                </span>
                <span className="hidden sm:inline text-xs text-stone-400">
                  জিরো জাপানিজ → টোকিও কমপ্যানিয়ন
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer"
              aria-label="Exit Journey"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Glowing Milestone Dots Progress Bar with 3D Vector Icons */}
          <div className="flex items-center justify-between gap-1.5 pt-0.5">
            {GOLDEN_STAGES.map((s, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const IconComp = s.Icon;
              return (
                <div key={s.id} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full flex items-center">
                    <div
                      className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                        isPast
                          ? 'bg-emerald-500'
                          : isCurrent
                          ? 'bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 shadow-md shadow-amber-500/50'
                          : 'bg-white/10'
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <IconComp className="w-3.5 h-3.5 shrink-0" />
                    <span className={isCurrent ? 'text-amber-300 font-black' : isPast ? 'text-emerald-400' : 'text-stone-500 hidden sm:inline'}>
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN GOLDEN JOURNEY CONTENT (FULL-BLEED WIDESCREEN LIVING STUDIO)         */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 flex flex-col justify-center">

        {/* ----------------------------------------------------------------------- */}
        {/* STAGE 1: START (Welcome to Tokyo - Full-Bleed Scenic Living World)         */}
        {/* ----------------------------------------------------------------------- */}
        {currentStage === 'start' && (
          <div className="space-y-3 sm:space-y-4 text-center animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* Widescreen Scenic Tokyo Panorama with Mt. Fuji & Lanterns */}
            <TokyoScenicPanorama />

            {/* Reassurance Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-300 text-[11px] sm:text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>সহজ শুরু • ৩ মিনিটে প্রথম জয়</span>
            </div>

            {/* Grounded & Trustworthy Bengali Headline */}
            <div className="space-y-1.5 max-w-xl mx-auto">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                জাপানিজের প্রথম ধাপটা আজই সহজ করে শুরু করি।
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                আজ শুধু একটা জিনিস শিখব। মুখস্থ নয়—দেখে, শুনে, করে শিখি। মাত্র ৫ মিনিটে তুমি নিজের হাতে প্রথম জাপানি শব্দ লিখবে!
              </p>
            </div>

            {/* Primary Action Button -> DIRECT TO FIRST INTERACTION (NO DELAY) */}
            <div className="pt-1 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  trackNihomiEvent('journey_start_clicked', { stage: 'kana_engine' });
                  soundEffects.playButtonTap();
                  setCurrentStage('kana_engine');
                }}
                className="w-full sm:w-auto px-8 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm sm:text-base shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
              >
                <span>চলো শুরু করি →</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* STAGE 2: 'あ' KANA ENGINE (Touch, Hear, Trace on Hosho Paper Canvas)        */}
        {/* ----------------------------------------------------------------------- */}
        {currentStage === 'kana_engine' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <InteractiveKanaTraceCanvas
              char="あ"
              romaji="a"
              strokeCount={3}
              strokeDirections={[
                '১. বাম থেকে ডানে হালকা দাগ',
                '২. উপর থেকে নিচে খাড়া দাগ',
                '৩. নিচে সুন্দর গোল লুপ'
              ]}
              onAdvanceToNext={() => {
                soundEffects.playButtonTap();
                setCurrentStage('word_asa');
              }}
            />

            {/* Collapsible Sensei Companion Pill */}
            <div className="pt-1">
              <ContextualSenseiCompanion
                currentConcept={{
                  symbol: 'あ',
                  reading: 'a',
                  meaningBn: 'আ',
                  japanContext: 'Tokyo 7-Eleven: ありがとう (Arigatou - ধন্যবাদ)',
                  type: 'kana'
                }}
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* STAGE 3: FIRST REAL WORD ('あさ' - Asa • Pure Hiragana, NO kanji 朝!)    */}
        {/* ----------------------------------------------------------------------- */}
        {currentStage === 'word_asa' && (
          <div className="space-y-3 sm:space-y-4 max-w-lg mx-auto text-center animate-in zoom-in-95 duration-200 my-auto">
            {/* Real Word Card with Morning Sunrise Warmth */}
            <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-[#1a1532] via-[#201940] to-[#120f26] border border-amber-500/35 text-left space-y-3.5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1.5">
                  <IconSun3D className="w-3.5 h-3.5" />
                  <span>বাস্তব জাপানি শব্দ (First Real Word)</span>
                </span>
                <button
                  type="button"
                  onClick={() => speakJapanese('あさ')}
                  className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition border border-amber-500/30"
                  title="শব্দটি শুনুন (Asa!)"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Asa!</span>
                </button>
              </div>

              {/* Pure Hiragana Word Display (Strictly NO Kanji 朝) */}
              <div className="flex items-center gap-4 py-1">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-lg p-2">
                  <IconSun3D className="w-10 h-10" size={40} />
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-japanese font-black text-4xl sm:text-5xl text-white tracking-wide">
                      あさ
                    </span>
                    <span className="font-mono text-sm text-stone-300 font-bold">asa</span>
                    <span className="text-stone-500">•</span>
                    <span className="text-emerald-400 font-black text-base sm:text-lg">সকাল (Morning)</span>
                  </div>
                  <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                    এখানে আমাদের চেনা <span className="text-amber-300 font-bold">'あ'</span> আর 'さ' মিলে হয়েছে <span className="font-japanese font-bold text-white">あさ</span>।
                  </p>
                </div>
              </div>

              {/* Emotional Outcome Banner (Mandate v6.0 Blueprint copy) */}
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-stone-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>আমি শুধু একটা অক্ষর না — একটা আসল জাপানি শব্দ বুঝতে শুরু করেছি!</span>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playButtonTap();
                    setCurrentStage('konbini');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
                >
                  <span>টোকিও কনবিনিতে ব্যবহার করি (Use in Tokyo)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* STAGE 4: TOKYO KONBINI SCENARIO (Zero Cut-Off, Widescreen 7-Eleven)       */}
        {/* ----------------------------------------------------------------------- */}
        {currentStage === 'konbini' && (
          <div className="space-y-3 sm:space-y-4 animate-in zoom-in-95 duration-200 my-auto">
            {/* Widescreen 2-column on desktop to guarantee zero vertical scroll */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
              
              {/* Left/Top: 7-Eleven Storefront & Register Vector */}
              <div className="lg:col-span-6">
                <TokyoKonbiniWidescreenVector onCashierSpeak={handleCashierSpeak} />
              </div>

              {/* Right: Challenge Prompt & Interactive Character Chips */}
              <div className="lg:col-span-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#16132d] via-[#1a1634] to-[#0d0b1a] border border-amber-500/30 text-left space-y-3 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                    <IconKonbini3D className="w-3.5 h-3.5" />
                    <span>টোকিও বাস্তব পরিস্থিতি (Tokyo Reality)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCashierSpeak}
                    className="px-2.5 py-1 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition border border-red-500/30"
                    title="শুনুন"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>শুনুন</span>
                  </button>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    টোকিওর সেভেন-ইলেভেনে বিল দেওয়ার পর ক্যাশিয়ার বললেন:
                  </h3>
                  <div className="mt-1 p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-stone-200 text-xs sm:text-sm">
                    <span className="font-japanese font-bold text-white text-sm sm:text-base">"ありがとう ございます!"</span>{' '}
                    <span className="text-stone-400">(Arigatou gozaimasu! — ধন্যবাদ!)</span>
                  </div>
                </div>

                {/* The Active Challenge: Tap 'あ' inside ありがとう */}
                <div className="space-y-1.5 pt-0.5">
                  <label className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5">
                    <IconTarget3D className="w-4 h-4" />
                    <span>আমাদের চেনা 'あ' কোথায়? ট্যাপ করো!</span>
                  </label>

                  <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
                    {['あ', 'り', 'が', 'と', 'う'].map((c, idx) => {
                      const isSelected = selectedKonbiniChar === c;
                      const isTarget = c === 'あ';

                      let btnStyle = 'bg-white/[0.05] border-white/15 text-white hover:bg-white/[0.1]';
                      if (isSelected) {
                        btnStyle = isTarget
                          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400 shadow-lg shadow-emerald-900/40'
                          : 'bg-red-950/60 border-red-500 text-red-200';
                      } else if (isKonbiniSolved && isTarget) {
                        btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400';
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleKonbiniCharTap(c)}
                          className={`py-2.5 sm:py-3 rounded-2xl border font-japanese text-xl sm:text-2xl font-black transition-all cursor-pointer active:scale-95 flex items-center justify-center ${btnStyle}`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>

                  {konbiniFeedback && (
                    <div
                      className={`p-2.5 rounded-2xl text-xs sm:text-sm font-bold animate-in fade-in ${
                        isKonbiniSolved
                          ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                          : 'bg-amber-950/40 border border-amber-500/30 text-amber-300'
                      }`}
                    >
                      {konbiniFeedback}
                    </div>
                  )}
                </div>

                {/* Progress to Stage 5 once solved */}
                {isKonbiniSolved && (
                  <div className="pt-1 space-y-2 animate-in fade-in">
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playButtonTap();
                        setCurrentStage('mission_complete');
                      }}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>মিশন ০১ সম্পন্ন করো</span>
                      <IconRocket3D className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playButtonTap();
                        if (onNavigate) onNavigate('baito');
                        onClose?.();
                      }}
                      className="w-full py-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Store className="w-3.5 h-3.5 text-amber-400" />
                      <span>টোকিও কনবিনি ক্যাশিয়ার সিমুলেটর ট্রাই করো (Experience Conbini Shift)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* STAGE 5: MISSION 01 COMPLETE & WHATSAPP INSTANT ACCOUNT                 */}
        {/* ----------------------------------------------------------------------- */}
        {currentStage === 'mission_complete' && (
          <div className="space-y-4 max-w-lg mx-auto text-center animate-in zoom-in-95 duration-200 my-auto">
            {/* Celebration Trophy 3D Icon with ambient glow */}
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-500/25 rounded-full blur-xl animate-pulse" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-500 p-0.5 shadow-2xl flex items-center justify-center">
                <div className="w-full h-full bg-[#0d0d15] rounded-[14px] flex items-center justify-center p-2.5">
                  <IconTrophy3D className="w-10 h-10" size={40} />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 inline-flex items-center gap-1.5">
                <IconTrophy3D className="w-3.5 h-3.5" />
                <span>মিশন ০১ সম্পন্ন!</span>
              </span>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-white flex items-center justify-center gap-2">
                <IconCelebration3D className="w-6 h-6 inline-block" />
                <span>দারুণ! তুমি প্রথম সিঁড়ি জয় করে ফেলেছ!</span>
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                তুমি 'あ' চিনেছ, লিখেছ এবং জাপানের বাস্তব শব্দে এটি খুঁজে পেয়েছ।
              </p>
            </div>

            {/* REAL Local Progress Save Notice */}
            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-left space-y-0.5 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>তোমার আজকের শেখাটা সেভ হয়েছে</span>
              </div>
              <p className="text-[11px] text-stone-300">
                লোকাল ডিভাইসে সংরক্ষিত: বর্ণ 'あ', শব্দ 'あさ', মিশন ০১।
              </p>
            </div>

            {/* Instant WhatsApp Account Form (Direct, Frictionless Funnel with Emerald Accent) */}
            {!isLeadSaved && (
              <form
                onSubmit={handleSaveDemoLead}
                className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#16132d] via-[#1a1634] to-[#0d0b1a] border border-emerald-500/30 text-left space-y-3 shadow-2xl animate-in fade-in"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>তোমার শেখাটা হারিয়ে যেতে দিও না।</span>
                  </h4>
                  <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5 leading-relaxed">
                    আজকের অগ্রগতি সেভ হয়েছে। ফোনে পরের মিশন পেতে তোমার নাম ও WhatsApp নম্বর দিয়ে Nihomi-তে যুক্ত হও।
                  </p>
                </div>

                {leadError && (
                  <p className="text-xs text-red-400 font-bold bg-red-950/40 p-2 rounded-xl border border-red-500/30">
                    {leadError}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="তোমার নাম (e.g. রাকিব হাসান)"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="হোয়াটসঅ্যাপ নম্বর (e.g. 017XXXXXXXX)"
                    value={leadWhatsapp}
                    onChange={(e) => setLeadWhatsapp(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-0.5">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>পরের মিশন আনলক করো</span>
                    <IconRocket3D className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLeadSaved(true)}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-stone-300 text-xs font-bold border border-white/10 cursor-pointer transition active:scale-95"
                  >
                    এখন না, পরে করব
                  </button>
                </div>
              </form>
            )}

            {/* Mission 02 Preview Card (Strictly labeled 'মিশন ০২' or 'পরের মিশন') */}
            {isLeadSaved && (
              <div className="space-y-3 animate-in fade-in">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-[#181432] to-[#0d0b1a] border border-amber-500/40 text-left space-y-2 shadow-2xl">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <IconKonbini3D className="w-4 h-4" />
                      <span>মিশন ০২: জাপানের দোকানে নিজের প্রথম কথা</span>
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                      পরের মিশন
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    পরবর্তী মিশন: 'い' (i) শেখা এবং টোকিও সাবওয়েতে কথা বলার গোপন রহস্য!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) onNavigate('kana');
                      onClose?.();
                    }}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>পরের মিশন শুরু করো (Mission 02)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) onNavigate('baito');
                      onClose?.();
                    }}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Store className="w-4 h-4" />
                    <span>কনবিনি শিফট সিমুলেটর</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) onNavigate('dashboard');
                      onClose?.();
                    }}
                    className="px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-stone-200 text-xs sm:text-sm font-bold cursor-pointer"
                  >
                    ড্যাশবোর্ড
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="py-2.5 text-center text-[10px] text-stone-500 font-mono tracking-wider border-t border-white/5">
        NIHOMI.COM • JAPANESE LEARNING & RELOCATION ECOSYSTEM • 10X NEO-TOKYO ENGINE
      </footer>
    </div>
  );
};
