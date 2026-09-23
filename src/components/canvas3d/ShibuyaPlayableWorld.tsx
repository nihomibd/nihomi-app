// src/components/canvas3d/ShibuyaPlayableWorld.tsx
// NIHOMI WORLD™ V6: LIVING SHIBUYA EXPANSION & URBAN DENSITY
// Real Dynamic Vehicles, Ambient Pedestrians, JR Shibuya Station, Ramen & Izakaya Storefronts, Functional Traffic Lights & Crosswalk Acoustic Audio

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Compass,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Eye,
  Camera,
  Coins,
  Award,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  HelpCircle,
  Play,
  RotateCcw,
  ArrowRight,
  User,
  Shield,
  Store,
  GraduationCap,
  MapPin,
  Car,
  Users,
  Train
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';
import { worldAudio } from '../../lib/worldAudio';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';

interface ShibuyaPlayableWorldProps {
  coins: number;
  onAddCoins: (amount: number) => void;
  onNavigate: (view: string, params?: Record<string, any>) => void;
  currentTimeJST: string;
  onSwitchToPanorama?: () => void;
}

interface DialogueState {
  isOpen: boolean;
  speaker: 'manager' | 'sensei' | 'player';
  npcJapaneseText: string;
  npcRomaji: string;
  npcEnglish: string;
  choices: {
    id: string;
    textJa: string;
    textRomaji: string;
    textEn: string;
    isCorrectKeigo?: boolean;
    isHelp?: boolean;
  }[];
  senseiGuidance?: {
    title: string;
    explanation: string;
    keigoRule: string;
    practicePhrase: string;
  };
  step: 'greeting' | 'sensei_coaching' | 'success';
}

// ============================================================================
// PROCEDURAL PBR TEXTURE GENERATORS (Zero latency, instant high-res canvas)
// ============================================================================

function createAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#12141c';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 35000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const brightness = 14 + Math.random() * 18;
      ctx.fillStyle = `rgb(${brightness}, ${brightness + 2}, ${brightness + 6})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    for (let i = 0; i < 15; i++) {
      ctx.fillRect(Math.random() * 512, 0, 15 + Math.random() * 30, 512);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(14, 14);
  return texture;
}

function createCrosswalkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = 'rgba(18, 20, 28, 0.12)';
    for (let i = 0; i < 4000; i++) {
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    }
  }
  return new THREE.CanvasTexture(canvas);
}

function createTileFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#eae7df';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#c8c5bc';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 128, 128);
    ctx.strokeRect(128, 0, 128, 128);
    ctx.strokeRect(0, 128, 128, 128);
    ctx.strokeRect(128, 128, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

function createSevenElevenSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1024, 256);

    ctx.fillStyle = '#ff7700';
    ctx.fillRect(0, 0, 1024, 24);
    ctx.fillStyle = '#008844';
    ctx.fillRect(0, 232, 1024, 24);

    ctx.fillStyle = '#dd1111';
    ctx.font = '900 110px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('7-ELEVEN', 380, 128);

    ctx.fillStyle = '#008844';
    ctx.font = 'bold 74px "Hiragino Kaku Gothic Pro", sans-serif';
    ctx.fillText('セブン-イレブン', 820, 128);
  }
  return new THREE.CanvasTexture(canvas);
}

function createJRStationSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1024, 256);

    // JR Green Band
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, 1024, 30);
    ctx.fillRect(0, 226, 1024, 30);

    ctx.fillStyle = '#10b981';
    ctx.font = '900 90px "Arial Black", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('JR', 40, 150);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 78px sans-serif';
    ctx.fillText('渋谷駅 (ハチ公口)', 210, 140);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('Shibuya Station • Hachiko Exit', 215, 195);
  }
  return new THREE.CanvasTexture(canvas);
}

function createRamenSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#fef08a';
    ctx.font = '900 70px "Hiragino Mincho Pro", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('特製 豚骨拉麺', 256, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('SHIBUYA RAMEN ICHIRAN', 256, 185);
  }
  return new THREE.CanvasTexture(canvas);
}

function createIzakayaSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#1e1b18';
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, 492, 236);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 70px "Hiragino Kaku Gothic Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('大衆居酒屋 鳥貴族', 256, 105);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('やきとり 全品均一 ¥360', 256, 180);
  }
  return new THREE.CanvasTexture(canvas);
}

function createDonkiSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#facc15';
    ctx.font = '900 68px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ドン・キホーテ', 256, 95);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('DON QUIJOTE 24H', 256, 175);
  }
  return new THREE.CanvasTexture(canvas);
}

function createPosScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#091321';
    ctx.fillRect(0, 0, 512, 384);

    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(0, 0, 512, 54);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('NIHOMI CONBINI POS SYSTEM • レジ1', 20, 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = '24px sans-serif';
    ctx.fillText('からあげクン (レギュラー)', 24, 110);
    ctx.fillText('お～いお茶 (500ml)', 24, 150);
    ctx.fillText('おにぎり (ツナマヨ)', 24, 190);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('¥240', 410, 110);
    ctx.fillText('¥160', 410, 150);
    ctx.fillText('¥150', 410, 190);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, 240, 472, 110);
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 38px sans-serif';
    ctx.fillText('合計 (TOTAL): ¥1,350', 40, 310);
  }
  return new THREE.CanvasTexture(canvas);
}

function createAnimeFaceTexture(type: 'manager' | 'player' | 'citizen'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffd6ba';
    ctx.fillRect(0, 0, 512, 512);

    const eyeColor = type === 'manager' ? '#2e1f13' : type === 'player' ? '#1d4ed8' : '#334155';
    // Left Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(170, 240, 48, 62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.ellipse(176, 244, 32, 46, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(164, 224, 12, 0, Math.PI * 2);
    ctx.fill();

    // Right Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(342, 240, 48, 62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.ellipse(336, 244, 32, 46, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(326, 224, 12, 0, Math.PI * 2);
    ctx.fill();

    // Brows
    ctx.strokeStyle = '#181924';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(120, 185);
    ctx.quadraticCurveTo(170, 160, 225, 180);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(287, 180);
    ctx.quadraticCurveTo(342, 160, 392, 185);
    ctx.stroke();

    // Smile
    ctx.strokeStyle = '#a84c32';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(256, 340, 34, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    // Soft Blush
    ctx.fillStyle = 'rgba(255, 110, 120, 0.28)';
    ctx.beginPath();
    ctx.ellipse(135, 305, 38, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(377, 305, 38, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

// ============================================================================
// DATA STRUCTURES FOR URBAN DENSITY (Vehicles, Pedestrians, Traffic Lights)
// ============================================================================

interface TrafficVehicle {
  mesh: THREE.Group;
  speed: number;
  axis: 'x' | 'z';
  minCoord: number;
  maxCoord: number;
  direction: number; // 1 or -1
  wheels: THREE.Mesh[];
  headlights: THREE.SpotLight;
}

interface AmbientPedestrian {
  mesh: THREE.Group;
  speed: number;
  pathType: 'diagonal_northwest' | 'diagonal_northeast' | 'sidewalk_west' | 'sidewalk_east';
  progress: number;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
}

// ============================================================================
// MAIN PLAYABLE 3D COMPONENT WITH LIVING SHIBUYA DISTRICT
// ============================================================================

export const ShibuyaPlayableWorld: React.FC<ShibuyaPlayableWorldProps> = ({
  coins,
  onAddCoins,
  onNavigate,
  currentTimeJST,
  onSwitchToPanorama
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  // Gameplay HUD states
  const [cameraMode, setCameraMode] = useState<'first_person' | 'third_person'>('first_person');
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [questObjective, setQuestObjective] = useState<string>(
    'Walk to 7-Eleven & Ask the Store Manager about a Part-Time Job (Baito)'
  );
  const [questProgress, setQuestProgress] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [xp, setXp] = useState<number>(350);
  const [proximityPrompt, setProximityPrompt] = useState<{
    visible: boolean;
    text: string;
    actionKey: string;
    targetName: string;
  }>({
    visible: false,
    text: "Press 'E' to Talk to Store Manager",
    actionKey: 'E',
    targetName: '7-Eleven Store Manager'
  });

  // Traffic Light Signal State
  const [trafficSignalState, setTrafficSignalState] = useState<'walk_green' | 'traffic_green'>('walk_green');

  // Dialogue & Learning Loop State
  const [dialogue, setDialogue] = useState<DialogueState>({
    isOpen: false,
    speaker: 'manager',
    npcJapaneseText: 'いらっしゃいませ！こんにちは。今日はどうしましたか？',
    npcRomaji: 'Irasshaimase! Konnichiwa. Kyou wa dou shimashitaka?',
    npcEnglish: 'Welcome! Hello. How can I help you today?',
    step: 'greeting',
    choices: [
      {
        id: 'baito_keigo',
        textJa: 'アルバイトの募集はありますか？',
        textRomaji: 'Arubaito no boshuu wa arimasuka?',
        textEn: 'Are you hiring part-time staff? (Polite Keigo)',
        isCorrectKeigo: true
      },
      {
        id: 'order_food',
        textJa: 'からあげクンとお茶をください。',
        textRomaji: 'Karaage-kun to ocha o kudasai.',
        textEn: 'A Karaage-kun and green tea, please.',
        isCorrectKeigo: false
      },
      {
        id: 'baito_casual',
        textJa: 'あの…バイト…ありますか？',
        textRomaji: 'Ano... baito... arimasuka?',
        textEn: 'Um... do you have a job? (Casual / Hesitant)',
        isCorrectKeigo: false
      },
      {
        id: 'ask_sensei',
        textJa: '💡 田中先生に相談する (Ask Tanaka Sensei)',
        textRomaji: 'Tanaka-sensei ni soudan suru',
        textEn: 'Get instant AI coaching on workplace etiquette',
        isHelp: true
      }
    ]
  });

  // Player spatial state refs
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.6, 6));
  const playerVelocityRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const cameraYawRef = useRef<number>(Math.PI);
  const cameraPitchRef = useRef<number>(0);
  const keysPressedRef = useRef<Record<string, boolean>>({});
  const isDialogueOpenRef = useRef(false);
  isDialogueOpenRef.current = dialogue.isOpen;

  // Sound triggers state
  const hasTriggeredStoreChimeRef = useRef(false);
  const footstepCooldownRef = useRef(0);
  const walkCycleTimeRef = useRef(0);
  const lastChirpTimeRef = useRef(0);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerAvatarGroupRef = useRef<THREE.Group | null>(null);
  const playerLimbsRef = useRef<{
    leftLeg?: THREE.Group;
    rightLeg?: THREE.Group;
    leftArm?: THREE.Group;
    rightArm?: THREE.Group;
  }>({});
  const npcManagerGroupRef = useRef<THREE.Group | null>(null);
  const npcRightArmRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Living City Simulation Refs
  const vehiclesRef = useRef<TrafficVehicle[]>([]);
  const pedestriansRef = useRef<AmbientPedestrian[]>([]);
  const trafficLightHeadsRef = useRef<THREE.Mesh[]>([]);

  // Coordinates
  const CONBINI_POS = { x: -14, y: 0, z: -6 };
  const NPC_MANAGER_POS = { x: -14, y: 0.9, z: -8.5 };

  // Native Japanese TTS
  const playSpeech = useCallback((text: string) => {
    speakJapanese(text, { rate: 0.95 });
  }, []);

  // Open / Trigger Store Dialogue
  const handleTriggerInteraction = useCallback(() => {
    setDialogue((prev) => ({
      ...prev,
      isOpen: true,
      step: 'greeting',
      speaker: 'manager',
      npcJapaneseText: 'いらっしゃいませ！こんにちは。今日はどうしましたか？',
      npcRomaji: 'Irasshaimase! Konnichiwa. Kyou wa dou shimashitaka?',
      npcEnglish: 'Welcome! Hello. How can I help you today?'
    }));
    playSpeech('いらっしゃいませ！こんにちは。今日はどうしましたか？');
  }, [playSpeech]);

  // Audio Toggle
  const toggleAmbientAudio = useCallback(() => {
    if (isAudioMuted) {
      const ok = worldAudio.startTokyoAmbient();
      if (ok) {
        setIsAudioMuted(false);
        worldAudio.playTokyoChime();
      }
    } else {
      worldAudio.stopTokyoAmbient();
      setIsAudioMuted(true);
    }
  }, [isAudioMuted]);

  // Handle Dialogue Choices
  const handleSelectChoice = (choiceId: string) => {
    if (choiceId === 'baito_keigo') {
      playSpeech('はい！ちょうど夕方と夜勤のスタッフを募集していますよ。面接の日程を決めましょうか？');
      worldAudio.playSuccessRewardChime();
      triggerCelebrationConfetti();
      onAddCoins(25);
      setXp((prev) => prev + 50);
      setQuestObjective('Completed: 7-Eleven Baito Application! Next: Head to JR Shibuya Station Ticket Gates');
      setQuestProgress('completed');

      setDialogue({
        isOpen: true,
        speaker: 'manager',
        step: 'success',
        npcJapaneseText: 'はい！ちょうど夕方と夜勤のスタッフを募集していますよ。面接の日程を決めましょうか？',
        npcRomaji: 'Hai! Choudo yuugata to yakin no sutaffu o boshuu shite imasu yo. Mensetsu no nittei o kimemashou ka?',
        npcEnglish: 'Yes! We are actually looking for evening and night-shift staff right now. Shall we schedule an interview?',
        choices: [
          {
            id: 'accept_interview',
            textJa: 'ありがとうございます！ぜひよろしくお願いいたします。',
            textRomaji: 'Arigatou gozaimasu! Zehi yoroshiku onegai itashimasu.',
            textEn: 'Thank you very much! I look forward to working with you. (Perfect Keigo)',
            isCorrectKeigo: true
          }
        ]
      });
    } else if (choiceId === 'baito_casual' || choiceId === 'ask_sensei') {
      playSpeech('田中先生です。日本のアルバイト応募では「バイトありますか」は失礼にあたります。「アルバイトの募集はありますか」と丁寧に尋ねましょう。');
      setDialogue((prev) => ({
        ...prev,
        isOpen: true,
        speaker: 'sensei',
        step: 'sensei_coaching',
        npcJapaneseText: '💡 田中AI先生の敬語ワンポイントレッスン',
        npcRomaji: 'Tanaka AI Sensei Keigo One-Point Lesson',
        npcEnglish: 'In Japanese workplace culture, asking 「バイトありますか？」 directly is too blunt and informal. Use the polite business structure:',
        senseiGuidance: {
          title: 'Workplace Etiquette: Part-Time Job Inquiry',
          explanation: 'Store managers look for politeness (丁寧語) and readiness to interact with customers.',
          keigoRule: '「アルバイトの募集（ぼしゅう）はありますか？」',
          practicePhrase: 'Arubaito no boshuu wa arimasuka? (Are you currently recruiting part-time workers?)'
        },
        choices: [
          {
            id: 'retry_keigo',
            textJa: '「アルバイトの募集はありますか？」と練習して言い直す',
            textRomaji: 'Arubaito no boshuu wa arimasuka? to renshuu shite iinaosu',
            textEn: 'Practice and repeat with correct Keigo (+25 Coins on success)',
            isCorrectKeigo: true
          }
        ]
      }));
    } else if (choiceId === 'retry_keigo') {
      handleSelectChoice('baito_keigo');
    } else if (choiceId === 'order_food') {
      playSpeech('はい！からあげクンとお茶ですね。温めますので少々お待ちください。');
      onAddCoins(10);
      setDialogue({
        isOpen: true,
        speaker: 'manager',
        step: 'success',
        npcJapaneseText: 'はい！からあげクンとお茶ですね。温めますので少々お待ちください。',
        npcRomaji: 'Hai! Karaage-kun to ocha desu ne. Atatamemasu node shoushou omachi kudasai.',
        npcEnglish: 'Right! A Karaage-kun and green tea. I will warm it up for you, please wait a moment.',
        choices: [
          {
            id: 'thank_you',
            textJa: 'ありがとうございます！',
            textRomaji: 'Arigatou gozaimasu!',
            textEn: 'Thank you very much!'
          }
        ]
      });
    } else if (choiceId === 'accept_interview' || choiceId === 'thank_you') {
      setDialogue((prev) => ({ ...prev, isOpen: false }));
    }
  };

  // Keyboard Event Listeners for WASD + E interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressedRef.current[key] = true;

      if (key === 'e' && proximityPrompt.visible && !isDialogueOpenRef.current) {
        e.preventDefault();
        handleTriggerInteraction();
      }

      if (e.key === 'Escape' && isDialogueOpenRef.current) {
        setDialogue((prev) => ({ ...prev, isOpen: false }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressedRef.current[key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [proximityPrompt.visible, handleTriggerInteraction]);

  // Pointer Lock & Mouse Look
  const requestPointerLock = useCallback(() => {
    const canvas = rendererRef.current?.domElement;
    if (canvas && document.pointerLockElement !== canvas) {
      canvas.requestPointerLock?.();
    }
  }, []);

  useEffect(() => {
    const handlePointerLockChange = () => {
      const locked = document.pointerLockElement === rendererRef.current?.domElement;
      setIsPointerLocked(locked);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === rendererRef.current?.domElement && !isDialogueOpenRef.current) {
        const sensitivity = 0.0022;
        cameraYawRef.current -= e.movementX * sensitivity;
        cameraPitchRef.current -= e.movementY * sensitivity;
        cameraPitchRef.current = Math.max(-Math.PI / 2.6, Math.min(Math.PI / 2.6, cameraPitchRef.current));
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Main Three.js Scene Setup (Mounts once strictly)
  useEffect(() => {
    const mountEl = canvasMountRef.current;
    if (!mountEl) return;

    const width = mountEl.clientWidth || window.innerWidth;
    const height = mountEl.clientHeight || window.innerHeight;

    // 1. Scene & Cinematic Night Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080912);
    scene.fog = new THREE.FogExp2(0x080912, 0.014);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 400);
    cameraRef.current = camera;

    // 3. Renderer with Soft Shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    // 4. Lighting Engine
    const ambientLight = new THREE.AmbientLight(0x24283b, 1.25);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0x8fa3d4, 1.45);
    moonLight.position.set(25, 50, 20);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 160;
    moonLight.shadow.camera.left = -40;
    moonLight.shadow.camera.right = 40;
    moonLight.shadow.camera.top = 40;
    moonLight.shadow.camera.bottom = -40;
    moonLight.shadow.bias = -0.0005;
    scene.add(moonLight);

    // Neon Ambient Point Lights
    const neonCyan = new THREE.PointLight(0x00e5ff, 2.8, 34);
    neonCyan.position.set(0, 8, 2);
    scene.add(neonCyan);

    const neonMagenta = new THREE.PointLight(0xff007f, 3.2, 40);
    neonMagenta.position.set(16, 14, -18);
    scene.add(neonMagenta);

    // 5. PBR Environment Geometry: Shibuya Scramble Crossing
    const asphaltTex = createAsphaltTexture();
    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const groundMat = new THREE.MeshStandardMaterial({
      map: asphaltTex,
      roughness: 0.35,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Crosswalk Zebra Stripes
    const crosswalkGroup = new THREE.Group();
    const crosswalkTex = createCrosswalkTexture();
    const stripeMat = new THREE.MeshStandardMaterial({
      map: crosswalkTex,
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.05
    });

    for (let i = -16; i <= 16; i += 2.2) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.02, 20), stripeMat);
      stripe.position.set(i, 0.015, -4);
      stripe.rotation.y = Math.PI / 5;
      stripe.receiveShadow = true;
      crosswalkGroup.add(stripe);
    }
    for (let i = -16; i <= 16; i += 2.2) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.02, 20), stripeMat);
      stripe.position.set(i, 0.015, -4);
      stripe.rotation.y = -Math.PI / 5;
      stripe.receiveShadow = true;
      crosswalkGroup.add(stripe);
    }
    scene.add(crosswalkGroup);

    // Sidewalk slabs with concrete curbs & Tenji Blocks
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x272c3d, roughness: 0.65 });
    const westSidewalk = new THREE.Mesh(new THREE.BoxGeometry(34, 0.28, 55), sidewalkMat);
    westSidewalk.position.set(-20, 0.14, 0);
    westSidewalk.receiveShadow = true;
    scene.add(westSidewalk);

    const eastSidewalk = new THREE.Mesh(new THREE.BoxGeometry(34, 0.28, 55), sidewalkMat);
    eastSidewalk.position.set(20, 0.14, 0);
    eastSidewalk.receiveShadow = true;
    scene.add(eastSidewalk);

    // Yellow Tenji Tactile Paving along Curb Edge
    const tenjiMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, emissive: 0x854d0e, emissiveIntensity: 0.2 });
    for (let tz = -24; tz <= 24; tz += 2.5) {
      const tenjiWest = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 2.2), tenjiMat);
      tenjiWest.position.set(-3.3, 0.3, tz);
      scene.add(tenjiWest);

      const tenjiEast = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 2.2), tenjiMat);
      tenjiEast.position.set(3.3, 0.3, tz);
      scene.add(tenjiEast);
    }

    // 6. BUILD THE 3D 7-ELEVEN / CONBINI STOREFRONT
    const conbiniGroup = new THREE.Group();
    conbiniGroup.position.set(CONBINI_POS.x, 0.28, CONBINI_POS.z);

    const tileFloorTex = createTileFloorTexture();
    const conbiniFloor = new THREE.Mesh(
      new THREE.BoxGeometry(15, 0.05, 13),
      new THREE.MeshStandardMaterial({ map: tileFloorTex, roughness: 0.18, metalness: 0.1 })
    );
    conbiniFloor.position.set(0, 0.025, -2.5);
    conbiniFloor.receiveShadow = true;
    conbiniGroup.add(conbiniFloor);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1f2330, roughness: 0.5 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(15, 5.2, 0.4), wallMat);
    backWall.position.set(0, 2.6, -9);
    backWall.receiveShadow = true;
    conbiniGroup.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5.2, 13), wallMat);
    leftWall.position.set(-7.5, 2.6, -2.5);
    leftWall.receiveShadow = true;
    conbiniGroup.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5.2, 13), wallMat);
    rightWall.position.set(7.5, 2.6, -2.5);
    rightWall.receiveShadow = true;
    conbiniGroup.add(rightWall);

    // 7-Eleven Canopy & Sign
    const canopyOrange = new THREE.Mesh(
      new THREE.BoxGeometry(15.2, 0.35, 1.4),
      new THREE.MeshStandardMaterial({ color: 0xff7700, emissive: 0xff6600, emissiveIntensity: 0.8, roughness: 0.3 })
    );
    canopyOrange.position.set(0, 5.0, 3.8);
    canopyOrange.castShadow = true;
    conbiniGroup.add(canopyOrange);

    const canopyGreen = new THREE.Mesh(
      new THREE.BoxGeometry(15.2, 0.35, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x008844, emissive: 0x007733, emissiveIntensity: 0.8, roughness: 0.3 })
    );
    canopyGreen.position.set(0, 4.65, 3.8);
    conbiniGroup.add(canopyGreen);

    const canopyRed = new THREE.Mesh(
      new THREE.BoxGeometry(15.2, 0.35, 1.4),
      new THREE.MeshStandardMaterial({ color: 0xee2222, emissive: 0xcc1111, emissiveIntensity: 0.8, roughness: 0.3 })
    );
    canopyRed.position.set(0, 4.3, 3.8);
    conbiniGroup.add(canopyRed);

    const signTex = createSevenElevenSignTexture();
    const signMesh = new THREE.Mesh(
      new THREE.BoxGeometry(12, 1.4, 0.25),
      new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.2, emissive: 0xffffff, emissiveMap: signTex, emissiveIntensity: 0.7 })
    );
    signMesh.position.set(0, 6.0, 3.8);
    signMesh.castShadow = true;
    conbiniGroup.add(signMesh);

    const glassMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.35, roughness: 0.04, metalness: 0.15 });
    const leftGlass = new THREE.Mesh(new THREE.BoxGeometry(5.2, 4.2, 0.1), glassMat);
    leftGlass.position.set(-4.8, 2.1, 3.8);
    conbiniGroup.add(leftGlass);

    const rightGlass = new THREE.Mesh(new THREE.BoxGeometry(5.2, 4.2, 0.1), glassMat);
    rightGlass.position.set(4.8, 2.1, 3.8);
    conbiniGroup.add(rightGlass);

    const conbiniInteriorLight = new THREE.PointLight(0xfff5dd, 3.5, 18);
    conbiniInteriorLight.position.set(0, 4.2, -2.5);
    conbiniInteriorLight.castShadow = true;
    conbiniGroup.add(conbiniInteriorLight);

    const counterMesh = new THREE.Mesh(
      new THREE.BoxGeometry(6.0, 1.15, 1.5),
      new THREE.MeshStandardMaterial({ color: 0xc8c6be, roughness: 0.25, metalness: 0.1 })
    );
    counterMesh.position.set(0, 0.575, -5.0);
    counterMesh.castShadow = true;
    counterMesh.receiveShadow = true;
    conbiniGroup.add(counterMesh);

    const posScreenTex = createPosScreenTexture();
    const posMonitor = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.65, 0.1),
      new THREE.MeshStandardMaterial({ map: posScreenTex, emissive: 0xffffff, emissiveMap: posScreenTex, emissiveIntensity: 0.85 })
    );
    posMonitor.position.set(-1.0, 1.45, -5.0);
    posMonitor.rotation.y = 0.15;
    conbiniGroup.add(posMonitor);

    // 7. STORE MANAGER NPC ("Tanaka-tencho")
    const npcGroup = new THREE.Group();
    npcGroup.position.set(0, 0, -6.6);

    const managerTorso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.44, 1.45, 16),
      new THREE.MeshStandardMaterial({ color: 0x008844, roughness: 0.45 })
    );
    managerTorso.position.y = 1.15;
    managerTorso.castShadow = true;
    npcGroup.add(managerTorso);

    const managerFaceTex = createAnimeFaceTexture('manager');
    const managerHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 20, 20),
      new THREE.MeshStandardMaterial({ map: managerFaceTex, roughness: 0.55 })
    );
    managerHead.position.y = 2.15;
    managerHead.rotation.y = Math.PI;
    managerHead.castShadow = true;
    npcGroup.add(managerHead);

    const hairMat = new THREE.MeshStandardMaterial({ color: 0x161824, roughness: 0.5 });
    const hairCrown = new THREE.Mesh(new THREE.SphereGeometry(0.33, 16, 16), hairMat);
    hairCrown.position.set(0, 2.25, -0.05);
    npcGroup.add(hairCrown);

    const npcRightArmGroup = new THREE.Group();
    npcRightArmGroup.position.set(0.48, 1.65, 0);
    const rightArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.08, 0.65, 8),
      new THREE.MeshStandardMaterial({ color: 0x008844 })
    );
    rightArm.position.y = -0.32;
    npcRightArmGroup.add(rightArm);
    npcRightArmRef.current = npcRightArmGroup;
    npcGroup.add(npcRightArmGroup);

    const nameBadgeCanvas = document.createElement('canvas');
    nameBadgeCanvas.width = 280;
    nameBadgeCanvas.height = 70;
    const badgeCtx = nameBadgeCanvas.getContext('2d');
    if (badgeCtx) {
      badgeCtx.fillStyle = 'rgba(7, 10, 20, 0.9)';
      badgeCtx.roundRect(4, 4, 272, 62, 14);
      badgeCtx.fill();
      badgeCtx.strokeStyle = '#10b981';
      badgeCtx.lineWidth = 3.5;
      badgeCtx.stroke();
      badgeCtx.fillStyle = '#ffffff';
      badgeCtx.font = 'bold 28px sans-serif';
      badgeCtx.textAlign = 'center';
      badgeCtx.textBaseline = 'middle';
      badgeCtx.fillText('店長 田中 (Manager)', 140, 35);
    }
    const badgeSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(nameBadgeCanvas), transparent: true })
    );
    badgeSprite.scale.set(2.4, 0.65, 1);
    badgeSprite.position.set(0, 2.85, 0);
    npcGroup.add(badgeSprite);

    npcManagerGroupRef.current = npcGroup;
    conbiniGroup.add(npcGroup);
    scene.add(conbiniGroup);

    // 8. NEW EXPANDED LANDMARKS: JR SHIBUYA STATION, RAMEN SHOP, IZAKAYA, DONKI
    // 8A. JR SHIBUYA STATION (HACHIKO ENTRANCE & TICKET GATES)
    const stationGroup = new THREE.Group();
    stationGroup.position.set(18, 0.28, 16);

    const stationBuilding = new THREE.Mesh(
      new THREE.BoxGeometry(20, 9, 14),
      new THREE.MeshStandardMaterial({ color: 0x1a1e2e, roughness: 0.3, metalness: 0.4 })
    );
    stationBuilding.position.set(0, 4.5, 0);
    stationBuilding.castShadow = true;
    stationBuilding.receiveShadow = true;
    stationGroup.add(stationBuilding);

    // Large JR Station Sign
    const jrSignTex = createJRStationSignTexture();
    const jrSignMesh = new THREE.Mesh(
      new THREE.BoxGeometry(14, 2.2, 0.3),
      new THREE.MeshStandardMaterial({ map: jrSignTex, emissive: 0xffffff, emissiveMap: jrSignTex, emissiveIntensity: 0.8 })
    );
    jrSignMesh.position.set(0, 8.0, -7.1);
    stationGroup.add(jrSignMesh);

    // Suica/Pasmo Automatic Ticket Gate Turnstiles
    for (let g = -4; g <= 4; g += 2) {
      const gate = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 1.1, 2.6),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.2 })
      );
      gate.position.set(g, 0.55, -6.0);
      gate.castShadow = true;
      stationGroup.add(gate);

      // Glowing IC Card touch circle (Green/Blue Suica LED)
      const icCardPad = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.04, 16),
        new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 1.5 })
      );
      icCardPad.position.set(g, 1.12, -5.6);
      stationGroup.add(icCardPad);
    }
    scene.add(stationGroup);

    // 8B. RAMEN ICHIRAN STOREFRONT (West side at z: 14)
    const ramenGroup = new THREE.Group();
    ramenGroup.position.set(-15, 0.28, 14);

    const ramenStore = new THREE.Mesh(
      new THREE.BoxGeometry(14, 5.5, 10),
      new THREE.MeshStandardMaterial({ color: 0x221a1a, roughness: 0.5 })
    );
    ramenStore.position.set(0, 2.75, 0);
    ramenStore.castShadow = true;
    ramenStore.receiveShadow = true;
    ramenGroup.add(ramenStore);

    const ramenSignTex = createRamenSignTexture();
    const ramenSignMesh = new THREE.Mesh(
      new THREE.BoxGeometry(8, 2.0, 0.2),
      new THREE.MeshStandardMaterial({ map: ramenSignTex, emissive: 0xffffff, emissiveMap: ramenSignTex, emissiveIntensity: 0.7 })
    );
    ramenSignMesh.position.set(0, 4.8, -5.1);
    ramenGroup.add(ramenSignMesh);

    // Hanging Glowing Red Paper Lantern (Chochin)
    const lanternMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xff2222, emissiveIntensity: 1.2 });
    const lanternMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.6, 12), lanternMat);
    lanternMesh.position.set(-3.2, 3.4, -5.3);
    ramenGroup.add(lanternMesh);
    const lanternLight = new THREE.PointLight(0xff3333, 1.8, 6);
    lanternLight.position.set(-3.2, 3.2, -5.3);
    ramenGroup.add(lanternLight);

    scene.add(ramenGroup);

    // 8C. IZAKAYA TORIKIZOKU (East side at z: -4)
    const izakayaGroup = new THREE.Group();
    izakayaGroup.position.set(16, 0.28, -6);

    const izakayaStore = new THREE.Mesh(
      new THREE.BoxGeometry(12, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0x261e18, roughness: 0.6 })
    );
    izakayaStore.position.set(0, 3, 0);
    izakayaStore.castShadow = true;
    izakayaStore.receiveShadow = true;
    izakayaGroup.add(izakayaStore);

    const izakayaSignTex = createIzakayaSignTexture();
    const izakayaSignMesh = new THREE.Mesh(
      new THREE.BoxGeometry(7, 2.2, 0.2),
      new THREE.MeshStandardMaterial({ map: izakayaSignTex, emissive: 0xffffff, emissiveMap: izakayaSignTex, emissiveIntensity: 0.75 })
    );
    izakayaSignMesh.position.set(0, 5.0, 6.1);
    izakayaGroup.add(izakayaSignMesh);
    scene.add(izakayaGroup);

    // 8D. DON QUIJOTE 24H (North-West side at z: -22)
    const donkiGroup = new THREE.Group();
    donkiGroup.position.set(-20, 0.28, -22);

    const donkiStore = new THREE.Mesh(
      new THREE.BoxGeometry(18, 12, 14),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 })
    );
    donkiStore.position.set(0, 6, 0);
    donkiStore.castShadow = true;
    donkiStore.receiveShadow = true;
    donkiGroup.add(donkiStore);

    const donkiSignTex = createDonkiSignTexture();
    const donkiSignMesh = new THREE.Mesh(
      new THREE.BoxGeometry(10, 3.0, 0.3),
      new THREE.MeshStandardMaterial({ map: donkiSignTex, emissive: 0xffffff, emissiveMap: donkiSignTex, emissiveIntensity: 0.85 })
    );
    donkiSignMesh.position.set(0, 10.0, 7.1);
    donkiGroup.add(donkiSignMesh);
    scene.add(donkiGroup);

    // 9. SHIBUYA 109 & QFRONT LANDMARKS
    const tower109 = new THREE.Mesh(
      new THREE.CylinderGeometry(9, 11.5, 48, 36),
      new THREE.MeshStandardMaterial({ color: 0x181a26, roughness: 0.3, metalness: 0.35 })
    );
    tower109.position.set(0, 24, -45);
    tower109.castShadow = true;
    tower109.receiveShadow = true;
    scene.add(tower109);

    const towerSign = new THREE.Mesh(
      new THREE.CylinderGeometry(9.4, 9.4, 5.5, 36),
      new THREE.MeshStandardMaterial({ color: 0xff0066, emissive: 0xff0066, emissiveIntensity: 1.2, roughness: 0.2 })
    );
    towerSign.position.set(0, 38, -45);
    scene.add(towerSign);

    const qfront = new THREE.Mesh(
      new THREE.BoxGeometry(28, 40, 20),
      new THREE.MeshStandardMaterial({ color: 0x141620, roughness: 0.2, metalness: 0.5 })
    );
    qfront.position.set(30, 20, -20);
    qfront.castShadow = true;
    qfront.receiveShadow = true;
    scene.add(qfront);

    const qfrontScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 22),
      new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 1.1, roughness: 0.1 })
    );
    qfrontScreen.position.set(15.9, 19, -20);
    qfrontScreen.rotation.y = -Math.PI / 2;
    scene.add(qfrontScreen);

    // 10. FUNCTIONAL TRAFFIC LIGHTS (SHIBUYA PEDESTRIAN SIGNALS)
    const trafficLightPoles: THREE.Group[] = [];
    const trafficLightsMeshList: THREE.Mesh[] = [];

    const polePositions = [
      { x: -5, z: -16 },
      { x: 5, z: -16 },
      { x: -5, z: 8 },
      { x: 5, z: 8 }
    ];

    polePositions.forEach(({ x, z }) => {
      const poleGroup = new THREE.Group();
      poleGroup.position.set(x, 0.28, z);

      // Silver Steel Pole
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 4.2, 12),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 })
      );
      pole.position.y = 2.1;
      pole.castShadow = true;
      poleGroup.add(pole);

      // Signal Box
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.75, 0.35),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
      );
      box.position.y = 3.6;
      poleGroup.add(box);

      // Signal Light Lenses (Top: Red Standing Person, Bottom: Green Walking Person)
      const redLight = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x330000, emissive: 0xff0000, emissiveIntensity: 0.2 })
      );
      redLight.position.set(0, 3.8, 0.18);
      redLight.name = 'red_light';
      poleGroup.add(redLight);
      trafficLightsMeshList.push(redLight);

      const greenLight = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x003311, emissive: 0x00ff66, emissiveIntensity: 1.5 })
      );
      greenLight.position.set(0, 3.45, 0.18);
      greenLight.name = 'green_light';
      poleGroup.add(greenLight);
      trafficLightsMeshList.push(greenLight);

      trafficLightPoles.push(poleGroup);
      scene.add(poleGroup);
    });

    trafficLightHeadsRef.current = trafficLightsMeshList;

    // 11. DYNAMIC MOVING TOKYO VEHICLES (TAXI, SEDAN, KEI TRUCK)
    const vehicles: TrafficVehicle[] = [];

    // Helper to create detailed vehicle
    const createVehicle = (type: 'taxi' | 'sedan' | 'truck', color: number, startPos: THREE.Vector3, axis: 'x' | 'z', dir: number, spd: number) => {
      const vGroup = new THREE.Group();
      vGroup.position.copy(startPos);

      // Car Body
      const bodyGeo = type === 'truck' ? new THREE.BoxGeometry(2.1, 1.8, 4.4) : new THREE.BoxGeometry(2.0, 1.0, 4.2);
      const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.25, metalness: 0.4 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = type === 'truck' ? 1.0 : 0.65;
      body.castShadow = true;
      body.receiveShadow = true;
      vGroup.add(body);

      // Roof / Cabin
      if (type !== 'truck') {
        const cabin = new THREE.Mesh(
          new THREE.BoxGeometry(1.7, 0.75, 2.2),
          new THREE.MeshStandardMaterial({ color: 0x181e28, roughness: 0.1, metalness: 0.8 })
        );
        cabin.position.set(0, 1.35, -0.2);
        cabin.castShadow = true;
        vGroup.add(cabin);

        // Windshield Glass
        const windshield = new THREE.Mesh(
          new THREE.BoxGeometry(1.68, 0.68, 0.05),
          new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.45, roughness: 0.05 })
        );
        windshield.position.set(0, 1.35, 0.9);
        windshield.rotation.x = -0.3;
        vGroup.add(windshield);
      }

      // If Taxi: Iconic Tokyo Roof Vacancy Sign (空車)
      if (type === 'taxi') {
        const taxiSign = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 0.25, 0.35),
          new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x22c55e, emissiveIntensity: 1.6 })
        );
        taxiSign.position.set(0, 1.85, -0.2);
        vGroup.add(taxiSign);
      }

      // Wheels
      const wheels: THREE.Mesh[] = [];
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
      const wheelOffsets = [
        { x: -1.05, z: 1.2 },
        { x: 1.05, z: 1.2 },
        { x: -1.05, z: -1.2 },
        { x: 1.05, z: -1.2 }
      ];
      wheelOffsets.forEach(({ x, z }) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.25, 12), wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, 0.35, z);
        wheel.castShadow = true;
        vGroup.add(wheel);
        wheels.push(wheel);
      });

      // Headlights (Warm White LED) & Tail Lights (Red)
      const headLightLeft = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2.0 })
      );
      headLightLeft.position.set(-0.7, 0.7, 2.12);
      vGroup.add(headLightLeft);

      const headLightRight = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2.0 })
      );
      headLightRight.position.set(0.7, 0.7, 2.12);
      vGroup.add(headLightRight);

      // Tail lights
      const tailLeft = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.12, 0.05),
        new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xff0000, emissiveIntensity: 1.8 })
      );
      tailLeft.position.set(-0.7, 0.7, -2.12);
      vGroup.add(tailLeft);

      const tailRight = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.12, 0.05),
        new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xff0000, emissiveIntensity: 1.8 })
      );
      tailRight.position.set(0.7, 0.7, -2.12);
      vGroup.add(tailRight);

      // Projected Headlight Spot
      const spotLight = new THREE.SpotLight(0xfff7d6, 4.0, 26, Math.PI / 6, 0.4);
      spotLight.position.set(0, 0.8, 2.2);
      spotLight.target.position.set(0, 0, 16);
      vGroup.add(spotLight);
      vGroup.add(spotLight.target);

      // Rotate group according to axis and direction
      if (axis === 'z') {
        if (dir < 0) vGroup.rotation.y = Math.PI;
      } else {
        vGroup.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      }

      scene.add(vGroup);

      vehicles.push({
        mesh: vGroup,
        speed: spd,
        axis,
        minCoord: -55,
        maxCoord: 55,
        direction: dir,
        wheels,
        headlights: spotLight
      });
    };

    // 1. Tokyo Green Cab Taxi (East-West Road, driving East)
    createVehicle('taxi', 0x15803d, new THREE.Vector3(-45, 0, -11), 'x', 1, 14);

    // 2. Black Executive Sedan (East-West Road, driving West)
    createVehicle('sedan', 0x0f172a, new THREE.Vector3(45, 0, 11), 'x', -1, 12);

    // 3. Silver Kei Delivery Van (North-South Road, driving North)
    createVehicle('truck', 0x94a3b8, new THREE.Vector3(-1.8, 0, 50), 'z', -1, 11);

    // 4. White Commuter Car (North-South Road, driving South)
    createVehicle('sedan', 0xf1f5f9, new THREE.Vector3(1.8, 0, -50), 'z', 1, 13);

    vehiclesRef.current = vehicles;

    // 12. AMBIENT PEDESTRIAN NPCS WALKING THROUGH SHIBUYA
    const pedestrians: AmbientPedestrian[] = [];
    const citizenFaceTex = createAnimeFaceTexture('citizen');

    const createPedestrian = (type: AmbientPedestrian['pathType'], progressOffset: number) => {
      const pGroup = new THREE.Group();

      // Torso
      const isSuit = Math.random() > 0.5;
      const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.35, 1.0, 12),
        new THREE.MeshStandardMaterial({ color: isSuit ? 0x1e293b : 0xd97706, roughness: 0.5 })
      );
      torso.position.y = 0.5;
      torso.castShadow = true;
      pGroup.add(torso);

      // Head
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 14, 14),
        new THREE.MeshStandardMaterial({ map: citizenFaceTex, roughness: 0.5 })
      );
      head.position.y = 1.25;
      head.castShadow = true;
      pGroup.add(head);

      // Hair
      const hair = new THREE.Mesh(
        new THREE.SphereGeometry(0.26, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.6 })
      );
      hair.position.set(0, 1.32, -0.04);
      pGroup.add(hair);

      // Limbs
      const armMat = new THREE.MeshStandardMaterial({ color: isSuit ? 0x1e293b : 0xd97706 });
      const pantsMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });

      const lArm = new THREE.Group();
      lArm.position.set(-0.38, 0.85, 0);
      const lArmM = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.5, 6), armMat);
      lArmM.position.y = -0.25;
      lArm.add(lArmM);
      pGroup.add(lArm);

      const rArm = new THREE.Group();
      rArm.position.set(0.38, 0.85, 0);
      const rArmM = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.5, 6), armMat);
      rArmM.position.y = -0.25;
      rArm.add(rArmM);
      pGroup.add(rArm);

      const lLeg = new THREE.Group();
      lLeg.position.set(-0.16, 0, 0);
      const lLegM = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.75, 6), pantsMat);
      lLegM.position.y = -0.37;
      lLeg.add(lLegM);
      pGroup.add(lLeg);

      const rLeg = new THREE.Group();
      rLeg.position.set(0.16, 0, 0);
      const rLegM = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.75, 6), pantsMat);
      rLegM.position.y = -0.37;
      rLeg.add(rLegM);
      pGroup.add(rLeg);

      scene.add(pGroup);

      pedestrians.push({
        mesh: pGroup,
        speed: 1.8 + Math.random() * 0.7,
        pathType: type,
        progress: progressOffset,
        leftLeg: lLeg,
        rightLeg: rLeg,
        leftArm: lArm,
        rightArm: rArm
      });
    };

    // Spawn 8 pedestrian agents on varied crossing and sidewalk routes
    createPedestrian('diagonal_northwest', 0.1);
    createPedestrian('diagonal_northwest', 0.6);
    createPedestrian('diagonal_northeast', 0.3);
    createPedestrian('diagonal_northeast', 0.8);
    createPedestrian('sidewalk_west', 0.2);
    createPedestrian('sidewalk_west', 0.7);
    createPedestrian('sidewalk_east', 0.4);
    createPedestrian('sidewalk_east', 0.9);

    pedestriansRef.current = pedestrians;

    // 13. PLAYER AVATAR MESH (for 3rd Person View & Shadows)
    const playerGroup = new THREE.Group();
    const playerPelvis = new THREE.Group();
    playerPelvis.position.y = 0.9;

    const playerTorso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.38, 1.05, 14),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.45, metalness: 0.1 })
    );
    playerTorso.position.y = 0.52;
    playerTorso.castShadow = true;
    playerPelvis.add(playerTorso);

    const backpack = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.65, 0.26),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 })
    );
    backpack.position.set(0, 0.52, -0.28);
    backpack.castShadow = true;
    playerPelvis.add(backpack);

    const playerFaceTex = createAnimeFaceTexture('player');
    const playerHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 16, 16),
      new THREE.MeshStandardMaterial({ map: playerFaceTex, roughness: 0.55 })
    );
    playerHead.position.y = 1.32;
    playerHead.rotation.y = Math.PI;
    playerHead.castShadow = true;
    playerPelvis.add(playerHead);

    const playerHairCrown = new THREE.Mesh(
      new THREE.SphereGeometry(0.31, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.5 })
    );
    playerHairCrown.position.set(0, 1.42, -0.05);
    playerPelvis.add(playerHairCrown);

    const armMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5 });
    const pLeftArmGroup = new THREE.Group();
    pLeftArmGroup.position.set(-0.46, 0.92, 0);
    const pLeftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.6, 8), armMat);
    pLeftArm.position.y = -0.3;
    pLeftArm.castShadow = true;
    pLeftArmGroup.add(pLeftArm);
    playerPelvis.add(pLeftArmGroup);

    const pRightArmGroup = new THREE.Group();
    pRightArmGroup.position.set(0.46, 0.92, 0);
    const pRightArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.6, 8), armMat);
    pRightArmMesh.position.y = -0.3;
    pRightArmMesh.castShadow = true;
    pRightArmGroup.add(pRightArmMesh);
    playerPelvis.add(pRightArmGroup);

    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

    const pLeftLegGroup = new THREE.Group();
    pLeftLegGroup.position.set(-0.18, 0, 0);
    const pLeftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.85, 8), pantsMat);
    pLeftLeg.position.y = -0.42;
    pLeftLeg.castShadow = true;
    pLeftLegGroup.add(pLeftLeg);
    const pLeftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.3), shoeMat);
    pLeftShoe.position.set(0, -0.84, 0.06);
    pLeftLegGroup.add(pLeftShoe);
    playerPelvis.add(pLeftLegGroup);

    const pRightLegGroup = new THREE.Group();
    pRightLegGroup.position.set(0.18, 0, 0);
    const pRightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.85, 8), pantsMat);
    pRightLeg.position.y = -0.42;
    pRightLeg.castShadow = true;
    pRightLegGroup.add(pRightLeg);
    const pRightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.3), shoeMat);
    pRightShoe.position.set(0, -0.84, 0.06);
    pRightLegGroup.add(pRightShoe);
    playerPelvis.add(pRightLegGroup);

    playerGroup.add(playerPelvis);
    playerAvatarGroupRef.current = playerGroup;
    playerLimbsRef.current = {
      leftLeg: pLeftLegGroup,
      rightLeg: pRightLegGroup,
      leftArm: pLeftArmGroup,
      rightArm: pRightArmGroup
    };
    scene.add(playerGroup);

    // 14. 60 FPS GAME & CITY SIMULATION LOOP
    let lastTime = performance.now();
    let trafficTimer = 0;
    let isWalkSignalActive = true;

    const animate = (now: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // 14A. Traffic Light Simulation Cycle (14s Walk Green ↔ 12s Traffic Green)
      trafficTimer += delta;
      if (trafficTimer > 13.0) {
        trafficTimer = 0;
        isWalkSignalActive = !isWalkSignalActive;
        setTrafficSignalState(isWalkSignalActive ? 'walk_green' : 'traffic_green');

        // Update traffic light mesh emissives
        trafficLightHeadsRef.current.forEach((mesh) => {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mesh.name === 'green_light') {
            mat.emissiveIntensity = isWalkSignalActive ? 1.8 : 0.15;
          } else if (mesh.name === 'red_light') {
            mat.emissiveIntensity = isWalkSignalActive ? 0.15 : 1.8;
          }
        });
      }

      // Tokyo Crossing Acoustic Bird Chirp ("Piyo-Piyo") during Green Walk Signal
      if (isWalkSignalActive && !isAudioMuted && now - lastChirpTimeRef.current > 3800) {
        worldAudio.playPedestrianSignal('piyo');
        lastChirpTimeRef.current = now;
      }

      // 14B. Vehicle Traffic Movement & Physics
      vehiclesRef.current.forEach((veh) => {
        // Stop before zebra line if pedestrian walk light is green and car is approaching crossing
        let shouldStop = false;
        if (isWalkSignalActive) {
          if (veh.axis === 'x') {
            if (veh.direction > 0 && veh.mesh.position.x > -18 && veh.mesh.position.x < -14) shouldStop = true;
            if (veh.direction < 0 && veh.mesh.position.x < 18 && veh.mesh.position.x > 14) shouldStop = true;
          } else {
            if (veh.direction > 0 && veh.mesh.position.z > -18 && veh.mesh.position.z < -14) shouldStop = true;
            if (veh.direction < 0 && veh.mesh.position.z < 18 && veh.mesh.position.z > 14) shouldStop = true;
          }
        }

        if (!shouldStop) {
          const dist = veh.speed * veh.direction * delta;
          if (veh.axis === 'x') {
            veh.mesh.position.x += dist;
            if (veh.direction > 0 && veh.mesh.position.x > veh.maxCoord) veh.mesh.position.x = veh.minCoord;
            if (veh.direction < 0 && veh.mesh.position.x < veh.minCoord) veh.mesh.position.x = veh.maxCoord;
          } else {
            veh.mesh.position.z += dist;
            if (veh.direction > 0 && veh.mesh.position.z > veh.maxCoord) veh.mesh.position.z = veh.minCoord;
            if (veh.direction < 0 && veh.mesh.position.z < veh.minCoord) veh.mesh.position.z = veh.maxCoord;
          }

          // Rotate wheels
          veh.wheels.forEach((w) => {
            w.rotation.x += dist * 1.5;
          });
        }
      });

      // 14C. Ambient Pedestrian Movement & Walk Cycle
      pedestriansRef.current.forEach((ped) => {
        ped.progress += (ped.speed * delta) / 30;
        if (ped.progress > 1) ped.progress = 0;

        const p = ped.progress;
        let x = 0;
        let z = 0;
        let angle = 0;

        if (ped.pathType === 'diagonal_northwest') {
          x = -16 + p * 32;
          z = -16 + p * 32;
          angle = Math.PI / 4;
        } else if (ped.pathType === 'diagonal_northeast') {
          x = 16 - p * 32;
          z = -16 + p * 32;
          angle = -Math.PI / 4;
        } else if (ped.pathType === 'sidewalk_west') {
          x = -10;
          z = -20 + p * 40;
          angle = 0;
        } else {
          x = 10;
          z = 20 - p * 40;
          angle = Math.PI;
        }

        ped.mesh.position.set(x, 0.28, z);
        ped.mesh.rotation.y = angle;

        // Animate pedestrian limbs
        const phase = now * 0.007 * ped.speed;
        ped.leftLeg.rotation.x = Math.sin(phase) * 0.55;
        ped.rightLeg.rotation.x = -Math.sin(phase) * 0.55;
        ped.leftArm.rotation.x = -Math.sin(phase) * 0.45;
        ped.rightArm.rotation.x = Math.sin(phase) * 0.45;
      });

      // 14D. Store Manager NPC Idle Breathing & Wave
      if (npcManagerGroupRef.current) {
        npcManagerGroupRef.current.position.y = 0.05 + Math.sin(now * 0.0028) * 0.025;
      }
      const distToNpc = Math.hypot(
        playerPosRef.current.x - NPC_MANAGER_POS.x,
        playerPosRef.current.z - NPC_MANAGER_POS.z
      );
      if (npcRightArmRef.current) {
        if (distToNpc < 5.0) {
          npcRightArmRef.current.rotation.z = -0.8 + Math.sin(now * 0.008) * 0.2;
        } else {
          npcRightArmRef.current.rotation.z = -0.15;
        }
      }

      // 14E. Player Movement Physics (WASD / Arrow Keys)
      if (!isDialogueOpenRef.current) {
        const keys = keysPressedRef.current;
        const moveVector = new THREE.Vector3();

        const moveForward = keys['w'] || keys['arrowup'] ? 1 : keys['s'] || keys['arrowdown'] ? -1 : 0;
        const moveRight = keys['d'] || keys['arrowright'] ? 1 : keys['a'] || keys['arrowleft'] ? -1 : 0;
        const isSprinting = !!keys['shift'];
        const isMoving = moveForward !== 0 || moveRight !== 0;

        if (isMoving) {
          const forward = new THREE.Vector3(-Math.sin(cameraYawRef.current), 0, -Math.cos(cameraYawRef.current));
          const right = new THREE.Vector3(Math.cos(cameraYawRef.current), 0, -Math.sin(cameraYawRef.current));

          moveVector.addScaledVector(forward, moveForward);
          moveVector.addScaledVector(right, moveRight);
          moveVector.normalize();

          const baseSpeed = isSprinting ? 9.5 : 5.5;
          playerVelocityRef.current.copy(moveVector.multiplyScalar(baseSpeed));

          walkCycleTimeRef.current += delta * (isSprinting ? 14 : 9);
          const walkPhase = walkCycleTimeRef.current;

          if (playerLimbsRef.current.leftLeg) playerLimbsRef.current.leftLeg.rotation.x = Math.sin(walkPhase) * 0.65;
          if (playerLimbsRef.current.rightLeg) playerLimbsRef.current.rightLeg.rotation.x = -Math.sin(walkPhase) * 0.65;
          if (playerLimbsRef.current.leftArm) playerLimbsRef.current.leftArm.rotation.x = -Math.sin(walkPhase) * 0.55;
          if (playerLimbsRef.current.rightArm) playerLimbsRef.current.rightArm.rotation.x = Math.sin(walkPhase) * 0.55;

          if (now - footstepCooldownRef.current > (isSprinting ? 280 : 420)) {
            worldAudio.playFootstepSound();
            footstepCooldownRef.current = now;
          }
        } else {
          playerVelocityRef.current.multiplyScalar(0.7);
          if (playerLimbsRef.current.leftLeg) playerLimbsRef.current.leftLeg.rotation.x *= 0.8;
          if (playerLimbsRef.current.rightLeg) playerLimbsRef.current.rightLeg.rotation.x *= 0.8;
          if (playerLimbsRef.current.leftArm) playerLimbsRef.current.leftArm.rotation.x *= 0.8;
          if (playerLimbsRef.current.rightArm) playerLimbsRef.current.rightArm.rotation.x *= 0.8;
        }

        playerPosRef.current.x += playerVelocityRef.current.x * delta;
        playerPosRef.current.z += playerVelocityRef.current.z * delta;

        // Expanded boundaries for Living Shibuya District
        playerPosRef.current.x = Math.max(-32, Math.min(32, playerPosRef.current.x));
        playerPosRef.current.z = Math.max(-34, Math.min(32, playerPosRef.current.z));

        if (playerAvatarGroupRef.current) {
          playerAvatarGroupRef.current.position.set(playerPosRef.current.x, 0, playerPosRef.current.z);
          playerAvatarGroupRef.current.rotation.y = cameraYawRef.current;
          playerAvatarGroupRef.current.visible = cameraMode === 'third_person';
        }

        if (cameraMode === 'first_person') {
          const headBob = isMoving ? Math.sin(now * 0.012) * 0.045 : 0;
          camera.position.set(playerPosRef.current.x, playerPosRef.current.y + headBob, playerPosRef.current.z);
          camera.rotation.order = 'YXZ';
          camera.rotation.y = cameraYawRef.current;
          camera.rotation.x = cameraPitchRef.current;
        } else {
          const camDist = 3.6;
          const camHeight = 2.0;
          const camX = playerPosRef.current.x + Math.sin(cameraYawRef.current) * camDist;
          const camZ = playerPosRef.current.z + Math.cos(cameraYawRef.current) * camDist;

          camera.position.set(camX, playerPosRef.current.y + camHeight, camZ);
          camera.lookAt(playerPosRef.current.x, playerPosRef.current.y + 1.2, playerPosRef.current.z);
        }

        // 14F. Proximity Detection (7-Eleven Store & Station)
        const distToStoreFront = Math.hypot(
          playerPosRef.current.x - CONBINI_POS.x,
          playerPosRef.current.z - (CONBINI_POS.z + 4)
        );

        if (distToStoreFront < 5.5 && !hasTriggeredStoreChimeRef.current) {
          worldAudio.playConbiniDoorChime();
          hasTriggeredStoreChimeRef.current = true;
        } else if (distToStoreFront > 8.0) {
          hasTriggeredStoreChimeRef.current = false;
        }

        if (distToNpc < 5.0) {
          setProximityPrompt({
            visible: true,
            text: "Press 'E' or Tap to Talk to Store Manager",
            actionKey: 'E',
            targetName: '7-Eleven Store Manager (店長 田中)'
          });
        } else {
          setProximityPrompt((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        }
      }

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!mountEl) return;
      const w = mountEl.clientWidth || window.innerWidth;
      const h = mountEl.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (mountEl) mountEl.innerHTML = '';
    };
  }, [cameraMode, isAudioMuted]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none bg-[#080912] font-sans"
      onClick={requestPointerLock}
    >
      <div ref={canvasMountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* GAME HUD: Living Shibuya District Status */}
      <header className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-start justify-between pointer-events-none z-30">
        {/* Left: Player Stats (Coins, XP, Level) */}
        <div className="flex items-center gap-3 pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-2xl shadow-2xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
            <Coins className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 font-extrabold text-base tracking-tight">{coins}</span>
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Coins</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="font-semibold text-emerald-400">LV. 4 Tokyo Resident</span>
              <span>•</span>
              <span>{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Center: District Status & Traffic Signal Indicator */}
        <div className="hidden md:flex flex-col items-center pointer-events-auto max-w-lg gap-2">
          <div className="bg-black/70 backdrop-blur-xl border border-emerald-500/40 px-5 py-2 rounded-full shadow-2xl flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Active Quest</span>
            <span className="text-zinc-600">|</span>
            <span className="text-xs font-medium text-white truncate max-w-md">{questObjective}</span>
          </div>

          {/* Traffic Signal Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/10 text-[11px] text-zinc-300">
            <span
              className={`w-2 h-2 rounded-full ${
                trafficSignalState === 'walk_green' ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
              }`}
            />
            <span className="font-semibold">
              {trafficSignalState === 'walk_green' ? '🚶 歩行者青信号 (Pedestrian Walk)' : '🚗 車両青信号 (Vehicles Moving)'}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-cyan-400" /> 8 Citizens Walking
            </span>
          </div>
        </div>

        {/* Right: Controls & Tokyo Live JST Clock */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleAmbientAudio}
            className="px-3 py-2 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/30 rounded-xl text-zinc-300 hover:text-white transition flex items-center gap-2 text-xs font-semibold shadow-lg"
            title="Toggle Tokyo Soundscape (Traffic, Chimes & Chirps)"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
            <span className="hidden sm:inline">{isAudioMuted ? 'Muted' : 'Tokyo Live'}</span>
          </button>

          <button
            onClick={() => setCameraMode((prev) => (prev === 'first_person' ? 'third_person' : 'first_person'))}
            className="px-3 py-2 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/30 rounded-xl text-zinc-300 hover:text-white transition flex items-center gap-2 text-xs font-semibold shadow-lg"
            title="Toggle First / Third Person Camera"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">{cameraMode === 'first_person' ? '1st Person' : '3rd Person'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>東京 渋谷 {currentTimeJST} JST</span>
          </div>

          {onSwitchToPanorama && (
            <button
              onClick={onSwitchToPanorama}
              className="px-3 py-2 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/30 rounded-xl text-zinc-300 hover:text-white transition text-xs font-semibold"
            >
              360° Photo
            </button>
          )}
        </div>
      </header>

      {/* Crosshair for First-Person Immersive Aim */}
      {cameraMode === 'first_person' && !dialogue.isOpen && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-white/50 ring-2 ring-white/20" />
        </div>
      )}

      {/* Proximity Interaction Prompt [ Press 'E' or Tap to Talk ] */}
      {proximityPrompt.visible && !dialogue.isOpen && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 pointer-events-auto z-40 animate-bounce" id="conbini-proximity-prompt">
          <button
            onClick={handleTriggerInteraction}
            id="talk-manager-button"
            className="flex items-center gap-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.5)] border border-emerald-300/40 transition-transform active:scale-95"
          >
            <span className="w-8 h-8 rounded-lg bg-black/40 border border-white/30 flex items-center justify-center font-black text-amber-300 text-sm shadow-inner">
              E
            </span>
            <div className="text-left">
              <div className="text-xs font-extrabold tracking-wider uppercase text-emerald-100">
                Talk with Store Manager
              </div>
              <div className="text-[11px] text-emerald-200/80 font-medium">7-Eleven 店長 田中 • Baito Interview</div>
            </div>
            <MessageSquare className="w-5 h-5 ml-1 text-emerald-200" />
          </button>
        </div>
      )}

      {/* IN-WORLD DIALOGUE & CONTEXTUAL LEARNING LOOP PANEL */}
      {dialogue.isOpen && (
        <div className="absolute inset-x-4 bottom-6 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[720px] max-w-full pointer-events-auto z-50 animate-in fade-in slide-in-from-bottom-8 duration-300" id="in-world-dialogue-panel">
          <div className="bg-[#0e101a]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg ${
                    dialogue.speaker === 'manager'
                      ? 'bg-emerald-600 border border-emerald-400'
                      : dialogue.speaker === 'sensei'
                      ? 'bg-amber-600 border border-amber-400'
                      : 'bg-cyan-600 border border-cyan-400'
                  }`}
                >
                  {dialogue.speaker === 'manager' ? (
                    <Store className="w-5 h-5" />
                  ) : dialogue.speaker === 'sensei' ? (
                    <GraduationCap className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    {dialogue.speaker === 'manager'
                      ? '店長 田中 (7-Eleven Store Manager)'
                      : dialogue.speaker === 'sensei'
                      ? '田中AI先生 (Tanaka Sensei — AI Etiquette Coach)'
                      : 'You (Student Explorer)'}
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                      Shibuya Crossing
                    </span>
                  </h4>
                  <p className="text-xs text-zinc-400">Authentic Japanese Workplace Interaction</p>
                </div>
              </div>

              <button
                onClick={() => playSpeech(dialogue.npcJapaneseText)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition"
                title="Listen to native pronunciation"
              >
                <Volume2 className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5">
              <div className="text-lg md:text-xl font-bold text-white tracking-wide">
                {dialogue.npcJapaneseText}
              </div>
              <div className="text-xs text-emerald-400 font-mono">{dialogue.npcRomaji}</div>
              <div className="text-xs text-zinc-400 italic">{dialogue.npcEnglish}</div>
            </div>

            {dialogue.step === 'sensei_coaching' && dialogue.senseiGuidance && (
              <div className="bg-gradient-to-br from-amber-950/40 to-yellow-950/20 border border-amber-500/30 rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  {dialogue.senseiGuidance.title}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{dialogue.senseiGuidance.explanation}</p>
                <div className="bg-black/50 border border-amber-500/30 rounded-xl p-3 flex flex-col gap-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Standard Keigo Pattern:</span>
                  <span className="text-sm font-extrabold text-amber-200">{dialogue.senseiGuidance.keigoRule}</span>
                  <span className="text-[11px] text-zinc-400 font-mono">{dialogue.senseiGuidance.practicePhrase}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Choose your response:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {dialogue.choices.map((choice) => (
                  <button
                    key={choice.id}
                    id={`choice-${choice.id}`}
                    onClick={() => handleSelectChoice(choice.id)}
                    className={`text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group active:scale-[0.98] ${
                      choice.isCorrectKeigo
                        ? 'bg-emerald-950/20 hover:bg-emerald-900/30 border-emerald-500/40 hover:border-emerald-400 text-emerald-100'
                        : choice.isHelp
                        ? 'bg-amber-950/20 hover:bg-amber-900/30 border-amber-500/40 hover:border-amber-400 text-amber-100'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-zinc-200'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {choice.textJa}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">{choice.textRomaji}</span>
                      <span className="text-[11px] text-zinc-400">{choice.textEn}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setDialogue((prev) => ({ ...prev, isOpen: false }))}
              className="text-center text-xs text-zinc-500 hover:text-zinc-300 pt-1 transition"
            >
              Press ESC or click here to resume exploring Shibuya
            </button>
          </div>
        </div>
      )}

      {/* Bottom Bar: Game Controls & Landmark Radar */}
      <footer className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none z-20">
        <div className="hidden md:flex items-center gap-2 pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl text-xs text-zinc-400 shadow-xl">
          <span className="font-bold text-zinc-200">[WASD]</span>
          <span>Move</span>
          <span>•</span>
          <span className="font-bold text-zinc-200">[Shift]</span>
          <span>Sprint</span>
          <span>•</span>
          <span className="font-bold text-zinc-200">[Mouse]</span>
          <span>Look</span>
          <span>•</span>
          <span className="font-bold text-amber-300">[E]</span>
          <span>Interact</span>
        </div>

        {/* District Landmark Quick Radar Pills */}
        <div className="hidden lg:flex items-center gap-2 pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl text-xs text-zinc-400">
          <span className="flex items-center gap-1 font-semibold text-emerald-400">
            <Store className="w-3.5 h-3.5" /> 7-Eleven
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-semibold text-emerald-400">
            <Train className="w-3.5 h-3.5" /> JR 渋谷駅
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-semibold text-amber-400">
            🍜 拉麺 一蘭
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-semibold text-rose-400">
            🏮 居酒屋 鳥貴族
          </span>
        </div>

        {/* Mobile On-Screen Virtual Controls */}
        <div className="flex md:hidden items-center gap-2 pointer-events-auto bg-black/70 backdrop-blur-xl border border-white/10 p-2 rounded-2xl">
          <button
            onPointerDown={() => { keysPressedRef.current['w'] = true; }}
            onPointerUp={() => { keysPressedRef.current['w'] = false; }}
            className="w-11 h-11 rounded-xl bg-white/10 active:bg-white/30 flex items-center justify-center text-white font-bold text-sm"
          >
            W
          </button>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <button
                onPointerDown={() => { keysPressedRef.current['a'] = true; }}
                onPointerUp={() => { keysPressedRef.current['a'] = false; }}
                className="w-10 h-10 rounded-xl bg-white/10 active:bg-white/30 flex items-center justify-center text-white font-bold text-sm"
              >
                A
              </button>
              <button
                onPointerDown={() => { keysPressedRef.current['s'] = true; }}
                onPointerUp={() => { keysPressedRef.current['s'] = false; }}
                className="w-10 h-10 rounded-xl bg-white/10 active:bg-white/30 flex items-center justify-center text-white font-bold text-sm"
              >
                S
              </button>
              <button
                onPointerDown={() => { keysPressedRef.current['d'] = true; }}
                onPointerUp={() => { keysPressedRef.current['d'] = false; }}
                className="w-10 h-10 rounded-xl bg-white/10 active:bg-white/30 flex items-center justify-center text-white font-bold text-sm"
              >
                D
              </button>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto">
          <button
            onClick={() => handleSelectChoice('ask_sensei')}
            className="bg-black/70 hover:bg-black/90 backdrop-blur-xl border border-amber-500/40 hover:border-amber-400 text-amber-200 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-2xl transition-all group"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>Tanaka AI Sensei</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
