// src/components/canvas3d/ShibuyaPlayableWorld.tsx
// NIHOMI WORLD™ V7: HYPER-REALISM & PHOTOREALISTIC ASSET SWAP
// Photorealistic Japanese Vehicles, Anatomically Articulated Pedestrians, JR Shibuya Station, IBL Reflections & UnrealBloom Post-Processing

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
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
// HIGH-RESOLUTION PROCEDURAL TEXTURE GENERATORS (Zero network latency, 4K crisp)
// ============================================================================

function createAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#14161f';
    ctx.fillRect(0, 0, 1024, 1024);

    // Micro-grit noise
    for (let i = 0; i < 40000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const shade = Math.floor(Math.random() * 40) + 18;
      ctx.fillStyle = `rgb(${shade}, ${shade + 2}, ${shade + 6})`;
      ctx.fillRect(x, y, Math.random() > 0.8 ? 2 : 1, Math.random() > 0.8 ? 2 : 1);
    }

    // Subtle tar sealant cracks and road wear
    ctx.strokeStyle = '#0d0f17';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(120, 0);
    ctx.bezierCurveTo(180, 320, 240, 680, 210, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(780, 0);
    ctx.bezierCurveTo(720, 400, 840, 720, 810, 1024);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(12, 12);
  return tex;
}

function createCrosswalkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle paint wear and aggregate flecks
    for (let i = 0; i < 6000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const shade = Math.floor(Math.random() * 50) + 190;
      ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }
  return new THREE.CanvasTexture(canvas);
}

function createTileFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    for (let i = 0; i <= 512; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);
  return tex;
}

function createTokyoLicensePlateTexture(plateNumber: string, isCommercial: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Commercial taxis in Japan have green plates with white text. Civilian cars have white plates with green text.
    ctx.fillStyle = isCommercial ? '#14532d' : '#f8fafc';
    ctx.fillRect(0, 0, 256, 128);

    // Outer border
    ctx.strokeStyle = isCommercial ? '#22c55e' : '#15803d';
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 248, 120);

    // Mounting bolt holes
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(36, 24, 5, 0, Math.PI * 2);
    ctx.arc(220, 24, 5, 0, Math.PI * 2);
    ctx.fill();

    // Top text: Regional office & class code (e.g. 品川 500)
    ctx.fillStyle = isCommercial ? '#ffffff' : '#14532d';
    ctx.font = 'bold 24px "Hiragino Kaku Gothic Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('品川 500', 128, 38);

    // Bottom text: Hiragana + 4-digit number (e.g. あ 77-16)
    ctx.font = '900 48px sans-serif';
    ctx.fillText(plateNumber, 128, 96);
  }
  return new THREE.CanvasTexture(canvas);
}

function createTaxiAndonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 128);

    // Green illuminated taxi branding
    ctx.fillStyle = '#15803d';
    ctx.font = '900 38px "Hiragino Kaku Gothic Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('東京 TAXI', 128, 54);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('空車 (VACANT)', 128, 98);
  }
  return new THREE.CanvasTexture(canvas);
}

function createManholeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(128, 128, 110, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(128, 128, 80, 0, Math.PI * 2);
    ctx.stroke();

    // Tokyo Tokyo Waterworks Ginkgo leaf motif in center
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(128, 128, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#334155';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('東京都 下水道', 128, 134);
  }
  return new THREE.CanvasTexture(canvas);
}

function createStationTimetableTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 256);

    // Header bar
    ctx.fillStyle = '#059669';
    ctx.fillRect(0, 0, 512, 44);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('JR SHIBUYA STATION • 発車標 (DEPARTURES)', 16, 30);

    // Row 1: Yamanote Line
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('15:42  山手線 (外回り) 新宿・池袋方面  10両', 16, 95);

    // Row 2: Saikyo Line
    ctx.fillStyle = '#06b6d4';
    ctx.fillText('15:45  埼京線 (快速) 川越・大宮方面    10両', 16, 150);

    // Row 3: Shonan Shinjuku Line
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('15:50  湘南新宿ライン (特別快速) 小田原 15両', 16, 205);
  }
  return new THREE.CanvasTexture(canvas);
}

function createConbiniSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1024, 256);

    ctx.fillStyle = '#ff7700';
    ctx.fillRect(0, 0, 1024, 40);
    ctx.fillStyle = '#008844';
    ctx.fillRect(0, 40, 1024, 40);
    ctx.fillStyle = '#ee0000';
    ctx.fillRect(0, 80, 1024, 25);

    ctx.fillStyle = '#008844';
    ctx.font = '900 110px "Arial Black", Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('7-ELEVEN', 440, 175);

    ctx.fillStyle = '#ff7700';
    ctx.font = 'bold 50px "Hiragino Kaku Gothic Pro", sans-serif';
    ctx.fillText('セブン-イレブン', 820, 175);
  }
  return new THREE.CanvasTexture(canvas);
}

function createJRStationSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0b6623';
    ctx.fillRect(0, 0, 1024, 256);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 110px "Hiragino Kaku Gothic Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('JR 渋谷駅', 512, 115);

    ctx.fillStyle = '#bbf7d0';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('SHIBUYA STATION • HACHIKO PLAZA', 512, 195);
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

function createRealisticFaceTexture(type: 'manager' | 'player' | 'commuter_m' | 'commuter_f'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Realistic skin undertones
    ctx.fillStyle = type === 'commuter_f' ? '#fed7aa' : '#fcd34d';
    ctx.fillRect(0, 0, 512, 512);

    const eyeIrisColor = type === 'player' ? '#2563eb' : '#271b14';

    // Left Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(170, 240, 42, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = eyeIrisColor;
    ctx.beginPath();
    ctx.arc(172, 240, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(172, 240, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(166, 234, 6, 0, Math.PI * 2);
    ctx.fill();

    // Right Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(342, 240, 42, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = eyeIrisColor;
    ctx.beginPath();
    ctx.arc(340, 240, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(340, 240, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(334, 234, 6, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows
    ctx.strokeStyle = '#1e1b18';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(125, 200);
    ctx.quadraticCurveTo(170, 180, 215, 195);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(297, 195);
    ctx.quadraticCurveTo(342, 180, 387, 200);
    ctx.stroke();

    // Nose bridge and nostrils
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(256, 230);
    ctx.lineTo(252, 290);
    ctx.lineTo(262, 292);
    ctx.stroke();

    // Mouth / Lips
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(256, 350, 30, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();

    // Natural cheek warmth
    ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
    ctx.beginPath();
    ctx.ellipse(135, 300, 40, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(377, 300, 40, 22, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

// ============================================================================
// DATA STRUCTURES FOR URBAN DENSITY & LOCOMOTION
// ============================================================================

interface TrafficVehicle {
  mesh: THREE.Group;
  speed: number;
  axis: 'x' | 'z';
  minCoord: number;
  maxCoord: number;
  direction: number;
  wheels: THREE.Group[];
  headlights: THREE.SpotLight;
}

interface AmbientPedestrian {
  mesh: THREE.Group;
  torso: THREE.Group;
  speed: number;
  pathType: 'diagonal_northwest' | 'diagonal_northeast' | 'sidewalk_west' | 'sidewalk_east';
  progress: number;
  leftThigh: THREE.Group;
  rightThigh: THREE.Group;
  leftKnee: THREE.Group;
  rightKnee: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftForearm: THREE.Group;
  rightForearm: THREE.Group;
}

// ============================================================================
// MAIN PLAYABLE 3D COMPONENT WITH LIVING SHIBUYA DISTRICT V7
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
        id: 'baito_casual',
        textJa: 'バイトありますか？',
        textRomaji: 'Baito arimasuka?',
        textEn: 'Any part-time jobs? (Too casual)',
        isCorrectKeigo: false
      },
      {
        id: 'order_food',
        textJa: 'からあげクンとお茶をください。',
        textRomaji: 'Karaage-kun to ocha o kudasai.',
        textEn: 'Please give me Karaage-kun and green tea.',
        isCorrectKeigo: true
      }
    ]
  });

  // Gameplay Engine References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const playerAvatarGroupRef = useRef<THREE.Group | null>(null);
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.9, 14));
  const playerVelocityRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const cameraYawRef = useRef<number>(Math.PI);
  const cameraPitchRef = useRef<number>(0);
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});
  const walkCycleTimeRef = useRef<number>(0);
  const footstepCooldownRef = useRef<number>(0);
  const hasTriggeredStoreChimeRef = useRef<boolean>(false);
  const lastChirpTimeRef = useRef<number>(0);
  const isDialogueOpenRef = useRef<boolean>(false);
  isDialogueOpenRef.current = dialogue.isOpen;

  // Hierarchical Limbs for Natural Human Locomotion
  const playerLimbsRef = useRef<{
    leftThigh?: THREE.Group;
    rightThigh?: THREE.Group;
    leftKnee?: THREE.Group;
    rightKnee?: THREE.Group;
    leftArm?: THREE.Group;
    rightArm?: THREE.Group;
    leftForearm?: THREE.Group;
    rightForearm?: THREE.Group;
    torso?: THREE.Group;
    pelvis?: THREE.Group;
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

  // Handle Dialogue Choice Selection
  const handleSelectChoice = (choiceId: string) => {
    if (choiceId === 'baito_keigo') {
      playSpeech('素晴らしい敬語ですね！はい、週3日から夜勤とレジスタッフを募集中です。履歴書をお持ちですか？');
      onAddCoins(25);
      setXp((prev) => prev + 50);
      setQuestProgress('completed');
      setQuestObjective('Job Inquiry Mastered! 25 Coins & 50 XP awarded.');
      triggerCelebrationConfetti();

      setDialogue({
        isOpen: true,
        speaker: 'manager',
        step: 'success',
        npcJapaneseText: '素晴らしい敬語ですね！はい、週3日から夜勤とレジスタッフを募集中です。履歴書をお持ちですか？',
        npcRomaji: 'Subarashii keigo desu ne! Hai, shuu 3-ka kara yakin to reji sutaffu o boshuuchuu desu. Rirekisho o omochi desu ka?',
        npcEnglish: 'Splendid polite Japanese! Yes, we are hiring cashier & evening staff from 3 days/week. Do you have a resume?',
        choices: [
          {
            id: 'accept_interview',
            textJa: 'はい！面接をお願いできますでしょうか？',
            textRomaji: 'Hai! Mensetsu o onegai dekimasu deshou ka?',
            textEn: 'Yes! May I request an interview? (Master Keigo)',
            isCorrectKeigo: true
          }
        ]
      });
    } else if (choiceId === 'baito_casual') {
      playSpeech('アルバイトの募集はありますか、と言い直してみましょう！');
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
      const canvas = rendererRef.current?.domElement;
      setIsPointerLocked(document.pointerLockElement === canvas);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === rendererRef.current?.domElement && !isDialogueOpenRef.current) {
        const sens = 0.0022;
        cameraYawRef.current -= e.movementX * sens;
        cameraPitchRef.current -= e.movementY * sens;
        cameraPitchRef.current = Math.max(-0.65, Math.min(0.65, cameraPitchRef.current));
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

    // 1. Scene & Cinematic Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060710);
    scene.fog = new THREE.FogExp2(0x060710, 0.013);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 450);
    cameraRef.current = camera;

    // 3. High-Performance WebGL Renderer with ACES Filmic Tone Mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    // 4. Global Illumination & IBL Environment Reflections
    const pmremGen = new THREE.PMREMGenerator(renderer);
    pmremGen.compileEquirectangularShader();
    const envTexture = pmremGen.fromScene(new RoomEnvironment()).texture;
    scene.environment = envTexture;

    // 5. Cinematic Post-Processing Pipeline (UnrealBloomPass)
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.65, // bloom strength
      0.45, // bloom radius
      0.82  // bloom threshold
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    composerRef.current = composer;

    // 6. Lighting Engine
    const ambientLight = new THREE.AmbientLight(0x272c42, 1.35);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0x9db2e8, 1.55);
    moonLight.position.set(30, 55, 25);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 180;
    moonLight.shadow.camera.left = -45;
    moonLight.shadow.camera.right = 45;
    moonLight.shadow.camera.top = 45;
    moonLight.shadow.camera.bottom = -45;
    moonLight.shadow.bias = -0.0004;
    scene.add(moonLight);

    // Neon Ambient Point Lights
    const neonCyan = new THREE.PointLight(0x00e5ff, 3.2, 38);
    neonCyan.position.set(0, 9, 2);
    scene.add(neonCyan);

    const neonMagenta = new THREE.PointLight(0xff007f, 3.5, 42);
    neonMagenta.position.set(16, 15, -18);
    scene.add(neonMagenta);

    // 7. PBR Environment Geometry: Shibuya Scramble Crossing
    const asphaltTex = createAsphaltTexture();
    const groundGeo = new THREE.PlaneGeometry(220, 220);
    const groundMat = new THREE.MeshStandardMaterial({
      map: asphaltTex,
      roughness: 0.3,
      metalness: 0.22,
      envMapIntensity: 0.9
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
      roughness: 0.22,
      metalness: 0.08
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
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x222636, roughness: 0.65, metalness: 0.15 });
    const westSidewalk = new THREE.Mesh(new THREE.BoxGeometry(34, 0.28, 55), sidewalkMat);
    westSidewalk.position.set(-20, 0.14, 0);
    westSidewalk.receiveShadow = true;
    scene.add(westSidewalk);

    const eastSidewalk = new THREE.Mesh(new THREE.BoxGeometry(34, 0.28, 55), sidewalkMat);
    eastSidewalk.position.set(20, 0.14, 0);
    eastSidewalk.receiveShadow = true;
    scene.add(eastSidewalk);

    // Tokyo Tokyo Waterworks Sewer Manhole Covers
    const manholeTex = createManholeTexture();
    const manholeMat = new THREE.MeshStandardMaterial({ map: manholeTex, roughness: 0.4, metalness: 0.6 });
    const manhole1 = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.02, 24), manholeMat);
    manhole1.position.set(-8, 0.018, 5);
    scene.add(manhole1);

    const manhole2 = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.02, 24), manholeMat);
    manhole2.position.set(8, 0.018, -12);
    scene.add(manhole2);

    // Yellow Tenji Tactile Paving along Curb Edge
    const tenjiMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.38, emissive: 0x854d0e, emissiveIntensity: 0.25 });
    for (let tz = -24; tz <= 24; tz += 2.5) {
      const tenjiWest = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 2.2), tenjiMat);
      tenjiWest.position.set(-3.3, 0.3, tz);
      scene.add(tenjiWest);

      const tenjiEast = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 2.2), tenjiMat);
      tenjiEast.position.set(3.3, 0.3, tz);
      scene.add(tenjiEast);
    }

    // 8. BUILD THE 3D 7-ELEVEN / CONBINI STOREFRONT
    const conbiniGroup = new THREE.Group();
    conbiniGroup.position.set(CONBINI_POS.x, 0.28, CONBINI_POS.z);

    const tileFloorTex = createTileFloorTexture();
    const conbiniFloor = new THREE.Mesh(
      new THREE.BoxGeometry(15, 0.05, 13),
      new THREE.MeshStandardMaterial({ map: tileFloorTex, roughness: 0.16, metalness: 0.12 })
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
      new THREE.MeshStandardMaterial({ color: 0xff7700, emissive: 0xff6600, emissiveIntensity: 0.85, roughness: 0.3 })
    );
    canopyOrange.position.set(0, 5.0, 3.8);
    canopyOrange.castShadow = true;
    conbiniGroup.add(canopyOrange);

    const canopyGreen = new THREE.Mesh(
      new THREE.BoxGeometry(15.2, 0.35, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x008844, emissive: 0x007733, emissiveIntensity: 0.85, roughness: 0.3 })
    );
    canopyGreen.position.set(0, 4.65, 3.8);
    canopyGreen.castShadow = true;
    conbiniGroup.add(canopyGreen);

    const canopyRed = new THREE.Mesh(
      new THREE.BoxGeometry(15.2, 0.25, 1.4),
      new THREE.MeshStandardMaterial({ color: 0xdd1100, emissive: 0xcc0000, emissiveIntensity: 0.85, roughness: 0.3 })
    );
    canopyRed.position.set(0, 4.35, 3.8);
    conbiniGroup.add(canopyRed);

    // 7-Eleven Japanese Backlit Signboard
    const conbiniSignTex = createConbiniSignTexture();
    const signMat = new THREE.MeshStandardMaterial({
      map: conbiniSignTex,
      emissive: 0xffffff,
      emissiveMap: conbiniSignTex,
      emissiveIntensity: 0.88,
      roughness: 0.2
    });
    const mainSign = new THREE.Mesh(new THREE.BoxGeometry(11, 2.2, 0.3), signMat);
    mainSign.position.set(0, 6.2, 3.8);
    mainSign.castShadow = true;
    conbiniGroup.add(mainSign);

    // Glass Facade Windows
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      roughness: 0.04,
      metalness: 0.2,
      transparent: true,
      opacity: 0.38
    });
    const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(14.8, 3.8, 0.08), glassMat);
    frontGlass.position.set(0, 1.9, 3.8);
    conbiniGroup.add(frontGlass);

    // POS Cashier Counter & Register Screen
    const counterMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
    const counter = new THREE.Mesh(new THREE.BoxGeometry(5.5, 1.1, 1.6), counterMat);
    counter.position.set(0, 0.55, -1.8);
    counter.castShadow = true;
    counter.receiveShadow = true;
    conbiniGroup.add(counter);

    const posScreenTex = createPosScreenTexture();
    const posScreenMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.5, 0.06),
      new THREE.MeshStandardMaterial({ map: posScreenTex, emissive: 0xffffff, emissiveMap: posScreenTex, emissiveIntensity: 0.75 })
    );
    posScreenMesh.position.set(0.6, 1.35, -1.5);
    posScreenMesh.rotation.y = 0.15;
    conbiniGroup.add(posScreenMesh);

    // Warm Interior Point Light
    const conbiniLight = new THREE.PointLight(0xfff3d6, 3.5, 20);
    conbiniLight.position.set(0, 4.2, -2);
    conbiniLight.castShadow = true;
    conbiniGroup.add(conbiniLight);

    scene.add(conbiniGroup);

    // 9. EXPANDED DISTRICT: JR SHIBUYA STATION & DEPARTURE BOARD
    const jrStationGroup = new THREE.Group();
    jrStationGroup.position.set(0, 0.28, -35);

    const stationBuilding = new THREE.Mesh(
      new THREE.BoxGeometry(38, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0x1e2433, roughness: 0.35, metalness: 0.4 })
    );
    stationBuilding.position.set(0, 8, 0);
    stationBuilding.castShadow = true;
    stationBuilding.receiveShadow = true;
    jrStationGroup.add(stationBuilding);

    // JR Backlit Station Sign
    const jrSignTex = createJRStationSignTexture();
    const jrSignMesh = new THREE.Mesh(
      new THREE.BoxGeometry(16, 3.4, 0.4),
      new THREE.MeshStandardMaterial({ map: jrSignTex, emissive: 0xffffff, emissiveMap: jrSignTex, emissiveIntensity: 0.9 })
    );
    jrSignMesh.position.set(0, 14, 6.2);
    jrStationGroup.add(jrSignMesh);

    // Departure Timetable Display Screen
    const timetableTex = createStationTimetableTexture();
    const timetableMesh = new THREE.Mesh(
      new THREE.BoxGeometry(9, 3.2, 0.2),
      new THREE.MeshStandardMaterial({ map: timetableTex, emissive: 0xffffff, emissiveMap: timetableTex, emissiveIntensity: 0.85 })
    );
    timetableMesh.position.set(0, 8.5, 6.15);
    jrStationGroup.add(timetableMesh);

    // Ticket Gate Turnstiles with Glowing Suica/Pasmo IC Touch Pads
    for (let gx = -6; gx <= 6; gx += 3.2) {
      const gateTurnstile = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.1, 2.2),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 })
      );
      gateTurnstile.position.set(gx, 0.55, 4.5);
      gateTurnstile.castShadow = true;
      jrStationGroup.add(gateTurnstile);

      // Suica / Pasmo Glowing IC Reader Pad
      const icPad = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.04, 0.45),
        new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 1.8 })
      );
      icPad.position.set(gx + 0.15, 1.12, 4.2);
      jrStationGroup.add(icPad);
    }
    scene.add(jrStationGroup);

    // 10. RAMEN ICHIRAN STOREFRONT
    const ramenGroup = new THREE.Group();
    ramenGroup.position.set(24, 0.28, 2);

    const ramenStore = new THREE.Mesh(
      new THREE.BoxGeometry(14, 8, 12),
      new THREE.MeshStandardMaterial({ color: 0x241414, roughness: 0.45 })
    );
    ramenStore.position.set(0, 4, 0);
    ramenStore.castShadow = true;
    ramenStore.receiveShadow = true;
    ramenGroup.add(ramenStore);

    const ramenSignTex = createRamenSignTexture();
    const ramenSignMesh = new THREE.Mesh(
      new THREE.BoxGeometry(8, 2.4, 0.3),
      new THREE.MeshStandardMaterial({ map: ramenSignTex, emissive: 0xffffff, emissiveMap: ramenSignTex, emissiveIntensity: 0.85 })
    );
    ramenSignMesh.position.set(0, 5.8, 6.1);
    ramenGroup.add(ramenSignMesh);

    // Hanging Red Chochin Lantern
    const chochinMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xff2200, emissiveIntensity: 1.5, roughness: 0.3 });
    const chochin = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.9, 14), chochinMat);
    chochin.position.set(-3.2, 4.2, 6.4);
    ramenGroup.add(chochin);

    const chochinLight = new THREE.PointLight(0xff2200, 2.0, 10);
    chochinLight.position.set(-3.2, 3.8, 6.4);
    ramenGroup.add(chochinLight);
    scene.add(ramenGroup);

    // 11. IZAKAYA TORIKIZOKU
    const izakayaGroup = new THREE.Group();
    izakayaGroup.position.set(24, 0.28, -18);

    const izakayaStore = new THREE.Mesh(
      new THREE.BoxGeometry(14, 10, 12),
      new THREE.MeshStandardMaterial({ color: 0x1f1915, roughness: 0.4 })
    );
    izakayaStore.position.set(0, 5, 0);
    izakayaStore.castShadow = true;
    izakayaStore.receiveShadow = true;
    izakayaGroup.add(izakayaStore);

    const izakayaSignTex = createIzakayaSignTexture();
    const izakayaSignMesh = new THREE.Mesh(
      new THREE.BoxGeometry(7, 2.4, 0.3),
      new THREE.MeshStandardMaterial({ map: izakayaSignTex, emissive: 0xffffff, emissiveMap: izakayaSignTex, emissiveIntensity: 0.85 })
    );
    izakayaSignMesh.position.set(0, 7.2, 6.1);
    izakayaGroup.add(izakayaSignMesh);
    scene.add(izakayaGroup);

    // 12. DON QUIJOTE 24H
    const donkiGroup = new THREE.Group();
    donkiGroup.position.set(-20, 0.28, -22);

    const donkiStore = new THREE.Mesh(
      new THREE.BoxGeometry(18, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0x182030, roughness: 0.3 })
    );
    donkiStore.position.set(0, 7, 0);
    donkiStore.castShadow = true;
    donkiStore.receiveShadow = true;
    donkiGroup.add(donkiStore);

    const donkiSignTex = createDonkiSignTexture();
    const donkiSignMesh = new THREE.Mesh(
      new THREE.BoxGeometry(10, 3.2, 0.3),
      new THREE.MeshStandardMaterial({ map: donkiSignTex, emissive: 0xffffff, emissiveMap: donkiSignTex, emissiveIntensity: 0.9 })
    );
    donkiSignMesh.position.set(0, 11.0, 7.1);
    donkiGroup.add(donkiSignMesh);
    scene.add(donkiGroup);

    // 13. SHIBUYA 109 & QFRONT LANDMARKS
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
      new THREE.MeshStandardMaterial({ color: 0xff0066, emissive: 0xff0066, emissiveIntensity: 1.25, roughness: 0.2 })
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
      new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 1.15, roughness: 0.1 })
    );
    qfrontScreen.position.set(15.9, 19, -20);
    qfrontScreen.rotation.y = -Math.PI / 2;
    scene.add(qfrontScreen);

    // 14. FUNCTIONAL TRAFFIC LIGHTS (SHIBUYA PEDESTRIAN SIGNALS)
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

      // Silver Steel Cantilever Pole
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 4.4, 12),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 })
      );
      pole.position.y = 2.2;
      pole.castShadow = true;
      poleGroup.add(pole);

      // Cantilever Arm
      const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 })
      );
      arm.rotation.z = Math.PI / 2;
      arm.position.set(0.8, 4.1, 0);
      poleGroup.add(arm);

      // Signal Box with Anti-Glare Sun Visor
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.85, 0.38),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
      );
      box.position.set(1.4, 3.9, 0);
      poleGroup.add(box);

      // Signal Light Lenses (Top: Red Standing Person, Bottom: Green Walking Person)
      const redLight = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x440000, emissive: 0xff0000, emissiveIntensity: 0.2 })
      );
      redLight.position.set(1.4, 4.12, 0.2);
      redLight.name = 'red_light';
      poleGroup.add(redLight);
      trafficLightsMeshList.push(redLight);

      const greenLight = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x004411, emissive: 0x00ff66, emissiveIntensity: 1.8 })
      );
      greenLight.position.set(1.4, 3.7, 0.2);
      greenLight.name = 'green_light';
      poleGroup.add(greenLight);
      trafficLightsMeshList.push(greenLight);

      trafficLightPoles.push(poleGroup);
      scene.add(poleGroup);
    });

    trafficLightHeadsRef.current = trafficLightsMeshList;

    // ========================================================================
    // 15. PHOTOREALISTIC VEHICLES (TOYOTA CROWN TAXI, BLACK SEDAN, KEI TRUCK)
    // ========================================================================
    const vehicles: TrafficVehicle[] = [];

    const createPhotorealisticVehicle = (
      type: 'taxi' | 'sedan' | 'truck',
      color: number,
      startPos: THREE.Vector3,
      axis: 'x' | 'z',
      dir: number,
      spd: number,
      licenseNumber: string
    ) => {
      const vGroup = new THREE.Group();
      vGroup.position.copy(startPos);

      // Automotive Lacquer Finish with IBL Specular Reflection
      const carPaintMat = new THREE.MeshStandardMaterial({
        color,
        metalness: type === 'truck' ? 0.4 : 0.88,
        roughness: type === 'truck' ? 0.35 : 0.14,
        envMapIntensity: 1.5
      });
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.1 });
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.05,
        metalness: 0.25,
        transparent: true,
        opacity: 0.72
      });

      // 15A. Lower Chassis & Contoured Body
      const chassis = new THREE.Mesh(
        type === 'truck' ? new THREE.BoxGeometry(2.1, 1.4, 4.6) : new THREE.BoxGeometry(2.05, 0.85, 4.4),
        carPaintMat
      );
      chassis.position.y = type === 'truck' ? 0.9 : 0.6;
      chassis.castShadow = true;
      chassis.receiveShadow = true;
      vGroup.add(chassis);

      // Front Radiator Grille with Chrome Trim
      const grille = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.38, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8, roughness: 0.2 })
      );
      grille.position.set(0, 0.58, 2.22);
      vGroup.add(grille);

      // Chrome Grille Trim
      const grilleTrim = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.06, 0.1), chromeMat);
      grilleTrim.position.set(0, 0.78, 2.22);
      vGroup.add(grilleTrim);

      // 15B. Cabin / Greenhouse (Slanted Pillars & Window Glass)
      if (type !== 'truck') {
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.72, 2.3), carPaintMat);
        cabin.position.set(0, 1.35, -0.2);
        cabin.castShadow = true;
        vGroup.add(cabin);

        // Windshield Glass (Curved Angle)
        const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.68, 0.06), glassMat);
        windshield.position.set(0, 1.34, 0.96);
        windshield.rotation.x = -0.38;
        vGroup.add(windshield);

        // Rear Window Glass
        const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.65, 0.06), glassMat);
        rearGlass.position.set(0, 1.34, -1.36);
        rearGlass.rotation.x = 0.38;
        vGroup.add(rearGlass);

        // Side Mirrors with Chrome Housing & Reflective Glass
        const leftMirror = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.24), carPaintMat);
        leftMirror.position.set(-1.12, 1.15, 0.8);
        vGroup.add(leftMirror);

        const rightMirror = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.24), carPaintMat);
        rightMirror.position.set(1.12, 1.15, 0.8);
        vGroup.add(rightMirror);
      } else {
        // Kei Truck Corrugated Cargo Box
        const cargoBox = new THREE.Mesh(
          new THREE.BoxGeometry(2.1, 1.9, 2.9),
          new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.45, metalness: 0.3 })
        );
        cargoBox.position.set(0, 1.55, -0.75);
        cargoBox.castShadow = true;
        vGroup.add(cargoBox);
      }

      // 15C. Tokyo Taxi Signature Rooftop Andon (行灯)
      if (type === 'taxi') {
        const andonTex = createTaxiAndonTexture();
        const andonMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.35, 0.28, 16),
          new THREE.MeshStandardMaterial({
            map: andonTex,
            emissive: 0xffffff,
            emissiveMap: andonTex,
            emissiveIntensity: 2.2,
            roughness: 0.1
          })
        );
        andonMesh.position.set(0, 1.86, -0.2);
        vGroup.add(andonMesh);
      }

      // 15D. Japanese License Plates (Front & Rear)
      const plateTex = createTokyoLicensePlateTexture(licenseNumber, type === 'taxi');
      const plateMat = new THREE.MeshStandardMaterial({ map: plateTex, roughness: 0.3 });

      const frontPlate = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.32), plateMat);
      frontPlate.position.set(0, 0.38, 2.23);
      vGroup.add(frontPlate);

      const rearPlate = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.32), plateMat);
      rearPlate.position.set(0, 0.45, -2.23);
      rearPlate.rotation.y = Math.PI;
      vGroup.add(rearPlate);

      // 15E. High-Fidelity Wheels with Rubber Tread & Alloy Rims
      const wheels: THREE.Group[] = [];
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.88 });
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.92, roughness: 0.18 });

      const wheelOffsets = [
        { x: -1.08, z: 1.35 },
        { x: 1.08, z: 1.35 },
        { x: -1.08, z: -1.35 },
        { x: 1.08, z: -1.35 }
      ];

      wheelOffsets.forEach(({ x, z }) => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(x, 0.36, z);

        // Rubber Tire
        const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.28, 18), tireMat);
        tire.rotation.z = Math.PI / 2;
        tire.castShadow = true;
        wheelGroup.add(tire);

        // Multi-Spoke Alloy Rim
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.29, 14), rimMat);
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);

        vGroup.add(wheelGroup);
        wheels.push(wheelGroup);
      });

      // 15F. Multi-Element Headlights & Tail Lights
      const headLensMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xfff7d6,
        emissiveIntensity: 2.8,
        roughness: 0.05
      });
      const leftHeadlight = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), headLensMat);
      leftHeadlight.position.set(-0.72, 0.65, 2.2);
      vGroup.add(leftHeadlight);

      const rightHeadlight = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), headLensMat);
      rightHeadlight.position.set(0.72, 0.65, 2.2);
      vGroup.add(rightHeadlight);

      // Tail Lights (Red LED Clusters)
      const tailLensMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xff0000,
        emissiveIntensity: 2.2,
        roughness: 0.1
      });
      const leftTail = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.06), tailLensMat);
      leftTail.position.set(-0.72, 0.68, -2.2);
      vGroup.add(leftTail);

      const rightTail = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.06), tailLensMat);
      rightTail.position.set(0.72, 0.68, -2.2);
      vGroup.add(rightTail);

      // Projected Forward Spotlight Beams
      const spotLight = new THREE.SpotLight(0xfffae0, 5.0, 30, Math.PI / 5, 0.45);
      spotLight.position.set(0, 0.75, 2.3);
      spotLight.target.position.set(0, 0, 18);
      vGroup.add(spotLight);
      vGroup.add(spotLight.target);

      // Orientation based on axis and direction
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

    // Fleet Spawning: Toyota Crown Taxi, Black Executive Sedan, Kei Delivery Truck, White Sedan
    createPhotorealisticVehicle('taxi', 0x0a5c36, new THREE.Vector3(-45, 0, -11), 'x', 1, 14, 'あ 77-16');
    createPhotorealisticVehicle('sedan', 0x080a0f, new THREE.Vector3(45, 0, 11), 'x', -1, 12, 'つ 38-92');
    createPhotorealisticVehicle('truck', 0x94a3b8, new THREE.Vector3(-1.8, 0, 50), 'z', -1, 11, 'わ 10-04');
    createPhotorealisticVehicle('sedan', 0xf1f5f9, new THREE.Vector3(1.8, 0, -50), 'z', 1, 13, 'ほ 55-21');

    vehiclesRef.current = vehicles;

    // ========================================================================
    // 16. ANATOMICALLY ARTICULATED PEDESTRIANS & NATURAL LOCOMOTION
    // ========================================================================
    const pedestrians: AmbientPedestrian[] = [];

    const createPhotorealisticPedestrian = (
      type: AmbientPedestrian['pathType'],
      progressOffset: number,
      style: 'salaryman' | 'streetwear' | 'coat'
    ) => {
      const pGroup = new THREE.Group();

      const suitColor = style === 'salaryman' ? 0x1e293b : style === 'coat' ? 0x854d0e : 0x0f172a;
      const clothMat = new THREE.MeshStandardMaterial({ color: suitColor, roughness: 0.55 });
      const skinMat = new THREE.MeshStandardMaterial({
        map: createRealisticFaceTexture(style === 'coat' ? 'commuter_f' : 'commuter_m'),
        roughness: 0.5
      });
      const hairMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 });
      const shoeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35 });

      // Torso & Upper Garment
      const torso = new THREE.Group();
      torso.position.y = 0.88;

      const chestMesh = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.62, 0.28), clothMat);
      chestMesh.position.y = 0.31;
      chestMesh.castShadow = true;
      torso.add(chestMesh);

      // Dress Shirt & Tie / Hoodie Detail
      const tieMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.42, 0.04),
        new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 })
      );
      tieMesh.position.set(0, 0.32, 0.15);
      torso.add(tieMesh);

      // Proportional Human Cranium & Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), skinMat);
      head.position.y = 0.82;
      head.rotation.y = Math.PI;
      head.castShadow = true;
      torso.add(head);

      // 3D Styled Hair Mesh
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 14), hairMat);
      hair.position.set(0, 0.88, -0.04);
      torso.add(hair);

      // Commuter Accessory (Briefcase or Shoulder Bag)
      const bag = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.36, 0.44),
        new THREE.MeshStandardMaterial({ color: 0x271911, roughness: 0.4 })
      );
      bag.position.set(0.38, 0.15, 0);
      bag.castShadow = true;
      torso.add(bag);

      pGroup.add(torso);

      // Articulated Arms (Shoulder -> Upper Arm -> Forearm)
      const lArm = new THREE.Group();
      lArm.position.set(-0.32, 0.54, 0);
      const lArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.36, 8), clothMat);
      lArmMesh.position.y = -0.18;
      lArm.add(lArmMesh);

      const lForearm = new THREE.Group();
      lForearm.position.y = -0.36;
      const lForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.34, 8), skinMat);
      lForearmMesh.position.y = -0.17;
      lForearm.add(lForearmMesh);
      lArm.add(lForearm);
      torso.add(lArm);

      const rArm = new THREE.Group();
      rArm.position.set(0.32, 0.54, 0);
      const rArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.36, 8), clothMat);
      rArmMesh.position.y = -0.18;
      rArm.add(rArmMesh);

      const rForearm = new THREE.Group();
      rForearm.position.y = -0.36;
      const rForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.34, 8), skinMat);
      rForearmMesh.position.y = -0.17;
      rForearm.add(rForearmMesh);
      rArm.add(rForearm);
      torso.add(rArm);

      // Articulated Legs (Hip -> Thigh -> Knee -> Shin -> Shoe)
      const lThigh = new THREE.Group();
      lThigh.position.set(-0.14, 0.88, 0);
      const lThighMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.44, 8), clothMat);
      lThighMesh.position.y = -0.22;
      lThigh.add(lThighMesh);

      const lKnee = new THREE.Group();
      lKnee.position.y = -0.44;
      const lShinMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.44, 8), clothMat);
      lShinMesh.position.y = -0.22;
      lKnee.add(lShinMesh);
      const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.28), shoeMat);
      lShoe.position.set(0, -0.42, 0.06);
      lKnee.add(lShoe);
      lThigh.add(lKnee);
      pGroup.add(lThigh);

      const rThigh = new THREE.Group();
      rThigh.position.set(0.14, 0.88, 0);
      const rThighMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.44, 8), clothMat);
      rThighMesh.position.y = -0.22;
      rThigh.add(rThighMesh);

      const rKnee = new THREE.Group();
      rKnee.position.y = -0.44;
      const rShinMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.44, 8), clothMat);
      rShinMesh.position.y = -0.22;
      rKnee.add(rShinMesh);
      const rShoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.28), shoeMat);
      rShoe.position.set(0, -0.42, 0.06);
      rKnee.add(rShoe);
      rThigh.add(rKnee);
      pGroup.add(rThigh);

      scene.add(pGroup);

      pedestrians.push({
        mesh: pGroup,
        torso,
        speed: 1.8 + Math.random() * 0.6,
        pathType: type,
        progress: progressOffset,
        leftThigh: lThigh,
        rightThigh: rThigh,
        leftKnee: lKnee,
        rightKnee: rKnee,
        leftArm: lArm,
        rightArm: rArm,
        leftForearm: lForearm,
        rightForearm: rForearm
      });
    };

    // Spawn 8 Photorealistic Tokyo Commuter Pedestrians
    createPhotorealisticPedestrian('diagonal_northwest', 0.08, 'salaryman');
    createPhotorealisticPedestrian('diagonal_northwest', 0.58, 'coat');
    createPhotorealisticPedestrian('diagonal_northeast', 0.25, 'streetwear');
    createPhotorealisticPedestrian('diagonal_northeast', 0.75, 'salaryman');
    createPhotorealisticPedestrian('sidewalk_west', 0.18, 'coat');
    createPhotorealisticPedestrian('sidewalk_west', 0.68, 'streetwear');
    createPhotorealisticPedestrian('sidewalk_east', 0.35, 'salaryman');
    createPhotorealisticPedestrian('sidewalk_east', 0.85, 'coat');

    pedestriansRef.current = pedestrians;

    // ========================================================================
    // 17. PLAYER AVATAR (ARTICULATED RIG WITH DYNAMIC SHADOWS)
    // ========================================================================
    const playerGroup = new THREE.Group();
    const playerPelvis = new THREE.Group();
    playerPelvis.position.y = 0.9;

    const jacketMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.45, metalness: 0.15 });
    const pTorso = new THREE.Group();
    const playerTorso = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.66, 0.3), jacketMat);
    playerTorso.position.y = 0.33;
    playerTorso.castShadow = true;
    pTorso.add(playerTorso);

    const backpack = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.55, 0.24),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 })
    );
    backpack.position.set(0, 0.33, -0.25);
    backpack.castShadow = true;
    pTorso.add(backpack);

    const playerFaceTex = createRealisticFaceTexture('player');
    const playerHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.19, 16, 16),
      new THREE.MeshStandardMaterial({ map: playerFaceTex, roughness: 0.55 })
    );
    playerHead.position.y = 0.85;
    playerHead.rotation.y = Math.PI;
    playerHead.castShadow = true;
    pTorso.add(playerHead);

    const playerHairCrown = new THREE.Mesh(
      new THREE.SphereGeometry(0.21, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.5 })
    );
    playerHairCrown.position.set(0, 0.92, -0.04);
    pTorso.add(playerHairCrown);

    playerPelvis.add(pTorso);

    // Player Articulated Arms
    const pArmMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5 });
    const pLeftArmGroup = new THREE.Group();
    pLeftArmGroup.position.set(-0.35, 0.56, 0);
    const pLeftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.38, 8), pArmMat);
    pLeftArm.position.y = -0.19;
    pLeftArm.castShadow = true;
    pLeftArmGroup.add(pLeftArm);
    const pLeftForearm = new THREE.Group();
    pLeftForearm.position.y = -0.38;
    const pLeftForearmM = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.35, 8), jacketMat);
    pLeftForearmM.position.y = -0.17;
    pLeftForearm.add(pLeftForearmM);
    pLeftArmGroup.add(pLeftForearm);
    pTorso.add(pLeftArmGroup);

    const pRightArmGroup = new THREE.Group();
    pRightArmGroup.position.set(0.35, 0.56, 0);
    const pRightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.38, 8), pArmMat);
    pRightArm.position.y = -0.19;
    pRightArm.castShadow = true;
    pRightArmGroup.add(pRightArm);
    const pRightForearm = new THREE.Group();
    pRightForearm.position.y = -0.38;
    const pRightForearmM = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.35, 8), jacketMat);
    pRightForearmM.position.y = -0.17;
    pRightForearm.add(pRightForearmM);
    pRightArmGroup.add(pRightForearm);
    pTorso.add(pRightArmGroup);

    // Player Articulated Legs
    const pPantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const pShoeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

    const pLeftThighGroup = new THREE.Group();
    pLeftThighGroup.position.set(-0.16, 0, 0);
    const pLeftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.46, 8), pPantsMat);
    pLeftThigh.position.y = -0.23;
    pLeftThigh.castShadow = true;
    pLeftThighGroup.add(pLeftThigh);
    const pLeftKnee = new THREE.Group();
    pLeftKnee.position.y = -0.46;
    const pLeftShin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.46, 8), pPantsMat);
    pLeftShin.position.y = -0.23;
    pLeftKnee.add(pLeftShin);
    const pLeftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.11, 0.3), pShoeMat);
    pLeftShoe.position.set(0, -0.45, 0.06);
    pLeftKnee.add(pLeftShoe);
    pLeftThighGroup.add(pLeftKnee);
    playerPelvis.add(pLeftThighGroup);

    const pRightThighGroup = new THREE.Group();
    pRightThighGroup.position.set(0.16, 0, 0);
    const pRightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.46, 8), pPantsMat);
    pRightThigh.position.y = -0.23;
    pRightThigh.castShadow = true;
    pRightThighGroup.add(pRightThigh);
    const pRightKnee = new THREE.Group();
    pRightKnee.position.y = -0.46;
    const pRightShin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.46, 8), pPantsMat);
    pRightShin.position.y = -0.23;
    pRightKnee.add(pRightShin);
    const pRightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.11, 0.3), pShoeMat);
    pRightShoe.position.set(0, -0.45, 0.06);
    pRightKnee.add(pRightShoe);
    pRightThighGroup.add(pRightKnee);
    playerPelvis.add(pRightThighGroup);

    playerGroup.add(playerPelvis);
    playerGroup.position.copy(playerPosRef.current);
    scene.add(playerGroup);
    playerAvatarGroupRef.current = playerGroup;

    playerLimbsRef.current = {
      leftThigh: pLeftThighGroup,
      rightThigh: pRightThighGroup,
      leftKnee: pLeftKnee,
      rightKnee: pRightKnee,
      leftArm: pLeftArmGroup,
      rightArm: pRightArmGroup,
      leftForearm: pLeftForearm,
      rightForearm: pRightForearm,
      torso: pTorso,
      pelvis: playerPelvis
    };

    // ========================================================================
    // 18. STORE MANAGER NPC ("TANAKA-TENCHO") WITH RETAIL UNIFORM & BADGE
    // ========================================================================
    const npcGroup = new THREE.Group();
    npcGroup.position.set(NPC_MANAGER_POS.x, 0.28, NPC_MANAGER_POS.z);

    const uniformMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.5 });
    const shirtWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const redTieMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });

    const npcTorso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.66, 0.28), uniformMat);
    npcTorso.position.y = 1.15;
    npcTorso.castShadow = true;
    npcGroup.add(npcTorso);

    const npcShirt = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.66, 0.04), shirtWhiteMat);
    npcShirt.position.set(0, 1.15, 0.15);
    npcGroup.add(npcShirt);

    const npcTie = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.04), redTieMat);
    npcTie.position.set(0, 1.15, 0.18);
    npcGroup.add(npcTie);

    // Silver Name Badge [店長 田中 (Manager Tanaka)]
    const badge = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.08, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.9, roughness: 0.2 })
    );
    badge.position.set(0.16, 1.32, 0.18);
    npcGroup.add(badge);

    const managerFaceTex = createRealisticFaceTexture('manager');
    const npcHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.19, 16, 16),
      new THREE.MeshStandardMaterial({ map: managerFaceTex, roughness: 0.5 })
    );
    npcHead.position.set(0, 1.68, 0);
    npcHead.rotation.y = Math.PI;
    npcHead.castShadow = true;
    npcGroup.add(npcHead);

    const npcHair = new THREE.Mesh(
      new THREE.SphereGeometry(0.21, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.6 })
    );
    npcHair.position.set(0, 1.74, -0.04);
    npcGroup.add(npcHair);

    // Manager Right Arm for Retail Greeting Wave
    const npcRightArmGroup = new THREE.Group();
    npcRightArmGroup.position.set(0.32, 1.38, 0);
    const npcRightArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.55, 8), uniformMat);
    npcRightArmMesh.position.y = -0.27;
    npcRightArmMesh.castShadow = true;
    npcRightArmGroup.add(npcRightArmMesh);
    npcGroup.add(npcRightArmGroup);
    npcRightArmRef.current = npcRightArmGroup;

    scene.add(npcGroup);
    npcManagerGroupRef.current = npcGroup;

    // ========================================================================
    // 19. ANIMATION & RENDER ENGINE (Post-Processing + Kinematic Loops)
    // ========================================================================
    let lastTime = performance.now();
    let trafficTimer = 0;
    let isWalkSignalActive = true;

    const animate = (now: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // 19A. Traffic Light Simulation Cycle (14s Walk Green ↔ 12s Traffic Green)
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

      // 19B. Vehicle Traffic Movement & Wheel Physics
      vehiclesRef.current.forEach((veh) => {
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

      // 19C. Ambient Pedestrian Movement & Natural Kinematic Locomotion
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

        // Biomechanical walking kinematics: Pelvic bounce & knee bending
        const phase = now * 0.007 * ped.speed;
        ped.torso.position.y = 0.88 + Math.abs(Math.sin(phase)) * 0.035;
        ped.torso.rotation.y = Math.sin(phase) * 0.09;

        ped.leftThigh.rotation.x = Math.sin(phase) * 0.55;
        ped.rightThigh.rotation.x = -Math.sin(phase) * 0.55;

        // Knee flexes when leg swings back, straightens on forward step
        ped.leftKnee.rotation.x = Math.max(0, -Math.sin(phase) * 0.65);
        ped.rightKnee.rotation.x = Math.max(0, Math.sin(phase) * 0.65);

        // Arm counter-swing with natural forearm lag
        ped.leftArm.rotation.x = -Math.sin(phase) * 0.45;
        ped.rightArm.rotation.x = Math.sin(phase) * 0.45;
        ped.leftForearm.rotation.x = -Math.max(0, -Math.sin(phase) * 0.35) - 0.15;
        ped.rightForearm.rotation.x = -Math.max(0, Math.sin(phase) * 0.35) - 0.15;
      });

      // 19D. Store Manager NPC Idle Breathing & Customer Greeting
      if (npcManagerGroupRef.current) {
        npcManagerGroupRef.current.position.y = 0.28 + Math.sin(now * 0.0028) * 0.025;
      }
      const distToNpc = Math.hypot(
        playerPosRef.current.x - NPC_MANAGER_POS.x,
        playerPosRef.current.z - NPC_MANAGER_POS.z
      );
      if (npcRightArmRef.current) {
        if (distToNpc < 5.0) {
          npcRightArmRef.current.rotation.z = -0.85 + Math.sin(now * 0.008) * 0.2;
        } else {
          npcRightArmRef.current.rotation.z = -0.15;
        }
      }

      // 19E. Player Movement Physics (WASD / Arrow Keys)
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

          // Articulated player locomotion
          if (playerLimbsRef.current.pelvis) {
            playerLimbsRef.current.pelvis.position.y = 0.9 + Math.abs(Math.sin(walkPhase)) * 0.04;
          }
          if (playerLimbsRef.current.torso) {
            playerLimbsRef.current.torso.rotation.y = Math.sin(walkPhase) * 0.08;
          }
          if (playerLimbsRef.current.leftThigh) playerLimbsRef.current.leftThigh.rotation.x = Math.sin(walkPhase) * 0.65;
          if (playerLimbsRef.current.rightThigh) playerLimbsRef.current.rightThigh.rotation.x = -Math.sin(walkPhase) * 0.65;
          if (playerLimbsRef.current.leftKnee) playerLimbsRef.current.leftKnee.rotation.x = Math.max(0, -Math.sin(walkPhase) * 0.7);
          if (playerLimbsRef.current.rightKnee) playerLimbsRef.current.rightKnee.rotation.x = Math.max(0, Math.sin(walkPhase) * 0.7);

          if (playerLimbsRef.current.leftArm) playerLimbsRef.current.leftArm.rotation.x = -Math.sin(walkPhase) * 0.55;
          if (playerLimbsRef.current.rightArm) playerLimbsRef.current.rightArm.rotation.x = Math.sin(walkPhase) * 0.55;
          if (playerLimbsRef.current.leftForearm) playerLimbsRef.current.leftForearm.rotation.x = -Math.max(0, -Math.sin(walkPhase) * 0.4) - 0.15;
          if (playerLimbsRef.current.rightForearm) playerLimbsRef.current.rightForearm.rotation.x = -Math.max(0, Math.sin(walkPhase) * 0.4) - 0.15;

          if (now - footstepCooldownRef.current > (isSprinting ? 280 : 420)) {
            worldAudio.playFootstepSound();
            footstepCooldownRef.current = now;
          }
        } else {
          playerVelocityRef.current.multiplyScalar(0.7);
          if (playerLimbsRef.current.leftThigh) playerLimbsRef.current.leftThigh.rotation.x *= 0.8;
          if (playerLimbsRef.current.rightThigh) playerLimbsRef.current.rightThigh.rotation.x *= 0.8;
          if (playerLimbsRef.current.leftKnee) playerLimbsRef.current.leftKnee.rotation.x *= 0.8;
          if (playerLimbsRef.current.rightKnee) playerLimbsRef.current.rightKnee.rotation.x *= 0.8;
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

        // 19F. Proximity Detection (7-Eleven Store & Station)
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

      // Render through Cinematic Post-Processing Pipeline
      if (composerRef.current) {
        composerRef.current.render(delta);
      } else {
        renderer.render(scene, camera);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!mountEl) return;
      const w = mountEl.clientWidth || window.innerWidth;
      const h = mountEl.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composerRef.current?.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      pmremGen.dispose();
      renderer.dispose();
      composerRef.current = null;
    };
  }, [cameraMode, isAudioMuted]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[620px] bg-slate-950 select-none overflow-hidden font-sans"
      onClick={requestPointerLock}
    >
      {/* 3D Canvas Mount Point */}
      <div ref={canvasMountRef} className="w-full h-full absolute inset-0 cursor-crosshair" />

      {/* Crosshair (1st Person Mode) */}
      {cameraMode === 'first_person' && isPointerLocked && !dialogue.isOpen && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-2.5 h-2.5 rounded-full border border-cyan-400/80 bg-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        </div>
      )}

      {/* TOP HUD BAR */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        {/* District Title & Mode Status */}
        <div className="flex items-center space-x-3 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-cyan-500/30 shadow-2xl">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">NIHOMI WORLD™ V7</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                HYPER-REALISM
              </span>
            </div>
            <p className="text-sm font-semibold text-white">渋谷スクランブル交差点 (Shibuya Scramble)</p>
          </div>
        </div>

        {/* Traffic Signal & Audio Status */}
        <div className="flex items-center space-x-3">
          <div
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border backdrop-blur-md transition-all ${
              trafficSignalState === 'walk_green'
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
                : 'bg-rose-950/80 border-rose-500/40 text-rose-400'
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                trafficSignalState === 'walk_green' ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'
              }`}
            />
            <span className="text-xs font-bold font-mono">
              {trafficSignalState === 'walk_green' ? '🚶 歩行者 青 (WALK)' : '🚗 車両 青 (TRAFFIC)'}
            </span>
          </div>

          {/* Quick HUD Controls */}
          <div className="flex items-center space-x-2 pointer-events-auto">
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md transition-colors shadow-lg"
              title={isAudioMuted ? 'Unmute Tokyo Ambience' : 'Mute Audio'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => setCameraMode((prev) => (prev === 'first_person' ? 'third_person' : 'first_person'))}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md transition-colors shadow-lg text-xs font-medium"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>{cameraMode === 'first_person' ? '1st Person' : '3rd Person'}</span>
            </button>

            {onSwitchToPanorama && (
              <button
                onClick={onSwitchToPanorama}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md transition-colors shadow-lg text-xs font-medium"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>360° Panorama</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* QUEST / OBJECTIVE BANNER */}
      <div className="absolute top-20 left-4 pointer-events-none z-20 max-w-md">
        <div className="bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-amber-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> ACTIVE MISSION
            </span>
            <span className="text-xs font-bold text-amber-300 font-mono">
              {questProgress === 'completed' ? '✓ COMPLETED' : '+25 COINS'}
            </span>
          </div>
          <p className="text-xs font-medium text-slate-200">{questObjective}</p>
        </div>
      </div>

      {/* PROXIMITY INTERACTION PROMPT */}
      {proximityPrompt.visible && !dialogue.isOpen && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto z-20">
          <button
            onClick={handleTriggerInteraction}
            className="flex items-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.7)] border border-emerald-300/40 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="px-2 py-0.5 rounded-md bg-white/20 text-xs font-mono font-black">
              {proximityPrompt.actionKey}
            </span>
            <span>{proximityPrompt.text}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* DIALOGUE & LEARNING LOOP MODAL */}
      {dialogue.isOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center p-6 z-30 pointer-events-auto">
          <div className="w-full max-w-2xl bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-300">
            {/* Header: Speaker info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg ${
                    dialogue.speaker === 'manager'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {dialogue.speaker === 'manager' ? '🏪' : '💡'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {dialogue.speaker === 'manager'
                      ? 'Store Manager Tanaka (店長 田中)'
                      : 'Tanaka AI Sensei (Keigo Coach)'}
                  </h3>
                  <p className="text-[11px] text-slate-400">7-Eleven Shibuya Udagawacho Branch</p>
                </div>
              </div>

              <button
                onClick={() => playSpeech(dialogue.npcJapaneseText)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Repeat Audio</span>
              </button>
            </div>

            {/* NPC Spoken Dialogue Box */}
            <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-2">
              <p className="text-xl font-bold text-white tracking-wide">{dialogue.npcJapaneseText}</p>
              <p className="text-xs font-medium text-cyan-300 font-mono">{dialogue.npcRomaji}</p>
              <p className="text-xs text-slate-400">{dialogue.npcEnglish}</p>
            </div>

            {/* Sensei Educational Coaching Callout */}
            {dialogue.senseiGuidance && (
              <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase">
                  <GraduationCap className="w-4 h-4" />
                  <span>{dialogue.senseiGuidance.title}</span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">{dialogue.senseiGuidance.explanation}</p>
                <div className="p-2.5 rounded-xl bg-amber-900/30 border border-amber-600/30">
                  <p className="text-xs font-bold text-amber-300">{dialogue.senseiGuidance.keigoRule}</p>
                  <p className="text-[11px] text-amber-200/80 font-mono mt-0.5">
                    {dialogue.senseiGuidance.practicePhrase}
                  </p>
                </div>
              </div>
            )}

            {/* Interactive Choices */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select your response:</p>
              <div className="grid gap-2">
                {dialogue.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice.id)}
                    className="flex flex-col text-left p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 hover:border-cyan-500/50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {choice.textJa}
                      </span>
                      {choice.isCorrectKeigo && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          KEIGO ✓
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono mt-0.5">{choice.textRomaji}</span>
                    <span className="text-xs text-slate-500 mt-1">{choice.textEn}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CONTROLS & INSTRUCTIONS BAR */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center space-x-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono">
          <span className="text-cyan-400 font-bold">WASD / ARROWS</span>
          <span>= Move</span>
          <span className="mx-1">•</span>
          <span className="text-cyan-400 font-bold">SHIFT</span>
          <span>= Sprint</span>
          <span className="mx-1">•</span>
          <span className="text-cyan-400 font-bold">MOUSE</span>
          <span>= Look</span>
          <span className="mx-1">•</span>
          <span className="text-cyan-400 font-bold">E</span>
          <span>= Interact</span>
        </div>

        <div className="flex items-center space-x-4 bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300">
          <div className="flex items-center space-x-1.5 text-amber-400">
            <Coins className="w-4 h-4" />
            <span>{coins} Coins</span>
          </div>
          <div className="w-px h-3 bg-slate-700" />
          <div className="flex items-center space-x-1.5 text-cyan-400">
            <Zap className="w-4 h-4" />
            <span>{xp} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShibuyaPlayableWorld;
