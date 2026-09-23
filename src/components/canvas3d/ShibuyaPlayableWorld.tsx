// src/components/canvas3d/ShibuyaPlayableWorld.tsx
// NIHOMI WORLD™ V5: REALITY CANVAS™ — AAA Stylized 3D Shibuya World & PBR Realism Engine
// Stylized Anime Characters, PBR Storefront, Dynamic Soft Shadows, Neon Glow & In-World Keigo Learning Loop

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
  MapPin
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
// PROCEDURAL PBR TEXTURE GENERATORS (Zero network latency, instant rendering)
// ============================================================================

function createAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#12141c';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle grain noise for road asphalt
    for (let i = 0; i < 35000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const brightness = 14 + Math.random() * 18;
      ctx.fillStyle = `rgb(${brightness}, ${brightness + 2}, ${brightness + 6})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    // Wet sheen reflection streaks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    for (let i = 0; i < 15; i++) {
      ctx.fillRect(Math.random() * 512, 0, 15 + Math.random() * 30, 512);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
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

    // Subtle road grit on paint
    ctx.fillStyle = 'rgba(18, 20, 28, 0.12)';
    for (let i = 0; i < 4000; i++) {
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
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

    // Top Orange Stripe & Bottom Green Stripe
    ctx.fillStyle = '#ff7700';
    ctx.fillRect(0, 0, 1024, 24);
    ctx.fillStyle = '#008844';
    ctx.fillRect(0, 232, 1024, 24);

    // 7-Eleven Japanese Logo
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

function createAnimeFaceTexture(type: 'manager' | 'player'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Skin Base
    ctx.fillStyle = '#ffd6ba';
    ctx.fillRect(0, 0, 512, 512);

    // Anime Eyes
    const eyeColor = type === 'manager' ? '#2e1f13' : '#1d4ed8';
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

    // Eyelashes & Brows
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

    // Gentle Smile
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

function createVendingMachineTexture(brand: 'boss' | 'cola'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = brand === 'boss' ? '#003399' : '#cc1111';
    ctx.fillRect(0, 0, 512, 768);

    // Header Logo
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brand === 'boss' ? 'BOSS COFFEE' : 'Coca-Cola', 256, 75);

    // Product Display Glass Area
    ctx.fillStyle = '#0a0d1a';
    ctx.fillRect(40, 130, 432, 280);
    ctx.strokeStyle = '#445577';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 130, 432, 280);

    // Display Drink Rows
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        const cx = 85 + col * 98;
        const cy = 180 + row * 120;
        ctx.fillStyle = col % 2 === 0 ? '#10b981' : '#f59e0b';
        ctx.fillRect(cx - 24, cy - 40, 48, 70);

        // Price badge
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 26, cy + 34, 52, 18);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('¥140', cx, cy + 48);
      }
    }

    // Push Buttons
    ctx.fillStyle = '#22d3ee';
    for (let col = 0; col < 4; col++) {
      ctx.fillRect(65 + col * 98, 430, 40, 22);
    }

    // Coin slot and change return
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(400, 485, 45, 12);
    ctx.fillRect(415, 510, 15, 30);

    // Bottom Dispenser Door
    ctx.fillStyle = '#1e2433';
    ctx.fillRect(60, 580, 392, 130);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 6;
    ctx.strokeRect(60, 580, 392, 130);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('PUSH 取り出し口', 256, 650);
  }
  return new THREE.CanvasTexture(canvas);
}

// ============================================================================
// MAIN PLAYABLE 3D COMPONENT
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
  const cameraYawRef = useRef<number>(Math.PI); // Facing north toward crossing
  const cameraPitchRef = useRef<number>(0);
  const keysPressedRef = useRef<Record<string, boolean>>({});
  const isDialogueOpenRef = useRef(false);
  isDialogueOpenRef.current = dialogue.isOpen;

  // Sound triggers state
  const hasTriggeredStoreChimeRef = useRef(false);
  const footstepCooldownRef = useRef(0);
  const walkCycleTimeRef = useRef(0);

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
      setQuestObjective('Completed: 7-Eleven Baito Application! Next: Head to Tokyo Language Academy');
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

    // 1. Scene & Cinematic Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a14);
    scene.fog = new THREE.FogExp2(0x0a0a14, 0.015);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 350);
    cameraRef.current = camera;

    // 3. Renderer with Dynamic Soft Shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    // 4. Cinematic Lighting Engine
    // Ambient moonlit night
    const ambientLight = new THREE.AmbientLight(0x222638, 1.2);
    scene.add(ambientLight);

    // Directional Moonlight with Soft Cast Shadows
    const moonLight = new THREE.DirectionalLight(0x8899cc, 1.4);
    moonLight.position.set(25, 45, 20);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 140;
    moonLight.shadow.camera.left = -35;
    moonLight.shadow.camera.right = 35;
    moonLight.shadow.camera.top = 35;
    moonLight.shadow.camera.bottom = -35;
    moonLight.shadow.bias = -0.0005;
    scene.add(moonLight);

    // Warm Neon Streetlights along Shibuya Crossing
    const neonCyan = new THREE.PointLight(0x00e5ff, 2.8, 32);
    neonCyan.position.set(0, 8, 2);
    scene.add(neonCyan);

    const neonMagenta = new THREE.PointLight(0xff007f, 3.2, 38);
    neonMagenta.position.set(16, 14, -18);
    scene.add(neonMagenta);

    // 5. PBR Environment Geometry: Shibuya Scramble Crossing
    // Asphalt Ground Plane with PBR procedural grit texture
    const asphaltTex = createAsphaltTexture();
    const groundGeo = new THREE.PlaneGeometry(160, 160);
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

    // Shibuya Scramble Crosswalk Zebra Stripes with Paint Texture
    const crosswalkGroup = new THREE.Group();
    const crosswalkTex = createCrosswalkTexture();
    const stripeMat = new THREE.MeshStandardMaterial({
      map: crosswalkTex,
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.05
    });

    // Diagonal crossing 1 (North-West to South-East)
    for (let i = -14; i <= 14; i += 2.2) {
      const stripeGeo = new THREE.BoxGeometry(0.85, 0.02, 18);
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(i, 0.015, -4);
      stripe.rotation.y = Math.PI / 5;
      stripe.receiveShadow = true;
      crosswalkGroup.add(stripe);
    }
    // Diagonal crossing 2 (North-East to South-West)
    for (let i = -14; i <= 14; i += 2.2) {
      const stripeGeo = new THREE.BoxGeometry(0.85, 0.02, 18);
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(i, 0.015, -4);
      stripe.rotation.y = -Math.PI / 5;
      stripe.receiveShadow = true;
      crosswalkGroup.add(stripe);
    }
    scene.add(crosswalkGroup);

    // Sidewalk slabs with concrete curbs & Yellow Tactile Tenji Blocks
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x272c3d, roughness: 0.65 });
    const sidewalkGeo = new THREE.BoxGeometry(32, 0.28, 26);

    const westSidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
    westSidewalk.position.set(-19, 0.14, -10);
    westSidewalk.receiveShadow = true;
    scene.add(westSidewalk);

    const eastSidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
    eastSidewalk.position.set(19, 0.14, -10);
    eastSidewalk.receiveShadow = true;
    scene.add(eastSidewalk);

    // Yellow Tenji Tactile Paving along Curb Edge
    const tenjiMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, emissive: 0x854d0e, emissiveIntensity: 0.2 });
    for (let tz = -22; tz <= 2; tz += 2) {
      const tenjiBlock = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 1.8), tenjiMat);
      tenjiBlock.position.set(-3.2, 0.3, tz);
      scene.add(tenjiBlock);
    }

    // 6. BUILD THE HIGH-FIDELITY PBR 7-ELEVEN / CONBINI STOREFRONT
    const conbiniGroup = new THREE.Group();
    conbiniGroup.position.set(CONBINI_POS.x, 0.28, CONBINI_POS.z);

    // Store Floor with Glossy Tiled Linoleum
    const tileFloorTex = createTileFloorTexture();
    const conbiniFloorGeo = new THREE.BoxGeometry(15, 0.05, 13);
    const conbiniFloorMat = new THREE.MeshStandardMaterial({
      map: tileFloorTex,
      roughness: 0.18,
      metalness: 0.1
    });
    const conbiniFloor = new THREE.Mesh(conbiniFloorGeo, conbiniFloorMat);
    conbiniFloor.position.set(0, 0.025, -2.5);
    conbiniFloor.receiveShadow = true;
    conbiniGroup.add(conbiniFloor);

    // Store Walls
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

    // 7-Eleven Iconic Glowing 3-Stripe Canopy (PBR with Emissive Glow)
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

    // High-Resolution Illuminated 7-Eleven Signboard
    const signTex = createSevenElevenSignTexture();
    const signMesh = new THREE.Mesh(
      new THREE.BoxGeometry(12, 1.4, 0.25),
      new THREE.MeshStandardMaterial({
        map: signTex,
        roughness: 0.2,
        emissive: 0xffffff,
        emissiveMap: signTex,
        emissiveIntensity: 0.7
      })
    );
    signMesh.position.set(0, 6.0, 3.8);
    signMesh.castShadow = true;
    conbiniGroup.add(signMesh);

    // Front Glass Window panels (PBR Glass with Reflections)
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.04,
      metalness: 0.15
    });
    const leftGlass = new THREE.Mesh(new THREE.BoxGeometry(5.2, 4.2, 0.1), glassMat);
    leftGlass.position.set(-4.8, 2.1, 3.8);
    conbiniGroup.add(leftGlass);

    const rightGlass = new THREE.Mesh(new THREE.BoxGeometry(5.2, 4.2, 0.1), glassMat);
    rightGlass.position.set(4.8, 2.1, 3.8);
    conbiniGroup.add(rightGlass);

    // Warm Interior Ceiling PointLight with Shadows
    const conbiniInteriorLight = new THREE.PointLight(0xfff5dd, 3.5, 18);
    conbiniInteriorLight.position.set(0, 4.2, -2.5);
    conbiniInteriorLight.castShadow = true;
    conbiniGroup.add(conbiniInteriorLight);

    // Register Checkout Counter
    const counterMat = new THREE.MeshStandardMaterial({ color: 0xc8c6be, roughness: 0.25, metalness: 0.1 });
    const counterMesh = new THREE.Mesh(new THREE.BoxGeometry(6.0, 1.15, 1.5), counterMat);
    counterMesh.position.set(0, 0.575, -5.0);
    counterMesh.castShadow = true;
    counterMesh.receiveShadow = true;
    conbiniGroup.add(counterMesh);

    // PBR POS Cashier Screen with Active Japanese Transaction
    const posScreenTex = createPosScreenTexture();
    const posMonitor = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.65, 0.1),
      new THREE.MeshStandardMaterial({
        map: posScreenTex,
        emissive: 0xffffff,
        emissiveMap: posScreenTex,
        emissiveIntensity: 0.85
      })
    );
    posMonitor.position.set(-1.0, 1.45, -5.0);
    posMonitor.rotation.y = 0.15;
    conbiniGroup.add(posMonitor);

    // Hot Food Warmer Showcase ("Hot Chef / Karaage-kun Display")
    const hotShowcaseGroup = new THREE.Group();
    hotShowcaseGroup.position.set(1.4, 1.45, -5.0);
    const warmerBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.8, 0.8),
      new THREE.MeshStandardMaterial({ color: 0xff8800, transparent: true, opacity: 0.45, roughness: 0.1 })
    );
    hotShowcaseGroup.add(warmerBox);
    const warmerLight = new THREE.PointLight(0xffaa33, 2.0, 4.5);
    warmerLight.position.set(0, 0, 0);
    hotShowcaseGroup.add(warmerLight);
    conbiniGroup.add(hotShowcaseGroup);

    // Realistic Product Shelves with Colorful Stock
    for (let s = -5.0; s <= 5.0; s += 3.2) {
      if (s === -1.8) continue; // aisle walkway
      const shelfGroup = new THREE.Group();
      shelfGroup.position.set(s, 1.15, 0.2);

      const shelfBase = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 2.3, 6.0),
        new THREE.MeshStandardMaterial({ color: 0x33384a, roughness: 0.4 })
      );
      shelfBase.castShadow = true;
      shelfBase.receiveShadow = true;
      shelfGroup.add(shelfBase);

      // Colorful merchandise layers
      for (let layer = 0; layer < 3; layer++) {
        const itemStrip = new THREE.Mesh(
          new THREE.BoxGeometry(1.65, 0.25, 5.8),
          new THREE.MeshStandardMaterial({
            color: layer === 0 ? 0x10b981 : layer === 1 ? 0xf59e0b : 0xef4444,
            roughness: 0.3
          })
        );
        itemStrip.position.set(0, -0.6 + layer * 0.65, 0);
        shelfGroup.add(itemStrip);
      }
      conbiniGroup.add(shelfGroup);
    }

    // 7. HIGH-FIDELITY STYLIZED 3D STORE MANAGER NPC ("Tanaka-tencho")
    const npcGroup = new THREE.Group();
    npcGroup.position.set(0, 0, -6.6); // Standing behind counter

    // Torso / White Shirt + 7-Eleven Uniform Apron
    const managerTorso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.44, 1.45, 16),
      new THREE.MeshStandardMaterial({ color: 0x008844, roughness: 0.45 })
    );
    managerTorso.position.y = 1.15;
    managerTorso.castShadow = true;
    npcGroup.add(managerTorso);

    // Orange Apron Neck Trim
    const apronTrim = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.04, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xff7700, roughness: 0.3 })
    );
    apronTrim.rotation.x = Math.PI / 2;
    apronTrim.position.y = 1.75;
    npcGroup.add(apronTrim);

    // Head with Anime Face Texture
    const managerFaceTex = createAnimeFaceTexture('manager');
    const managerHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 20, 20),
      new THREE.MeshStandardMaterial({
        map: managerFaceTex,
        roughness: 0.55
      })
    );
    managerHead.position.y = 2.15;
    managerHead.rotation.y = Math.PI; // Face forward toward player
    managerHead.castShadow = true;
    npcGroup.add(managerHead);

    // Multi-Layered Stylized Dark Anime Hair (Bangs & Volume)
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x161824, roughness: 0.5 });
    const hairCrown = new THREE.Mesh(new THREE.SphereGeometry(0.33, 16, 16), hairMat);
    hairCrown.position.set(0, 2.25, -0.05);
    npcGroup.add(hairCrown);

    for (let h = -2; h <= 2; h++) {
      const bang = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 4), hairMat);
      bang.position.set(h * 0.1, 2.22, 0.26);
      bang.rotation.x = Math.PI / 1.4;
      npcGroup.add(bang);
    }

    // Right Arm for Greeting Animation
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

    // Overhead Floating Japanese Name Badge 「店長 田中」
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
    const badgeTexture = new THREE.CanvasTexture(nameBadgeCanvas);
    const badgeSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: badgeTexture, transparent: true })
    );
    badgeSprite.scale.set(2.4, 0.65, 1);
    badgeSprite.position.set(0, 2.85, 0);
    npcGroup.add(badgeSprite);

    npcManagerGroupRef.current = npcGroup;
    conbiniGroup.add(npcGroup);
    scene.add(conbiniGroup);

    // 8. SURROUNDING TOKYO LANDMARKS (PBR Fidelity)
    // Shibuya 109 Curved Tower (Iconic landmark at z: -45)
    const tower109 = new THREE.Mesh(
      new THREE.CylinderGeometry(9, 11.5, 48, 36),
      new THREE.MeshStandardMaterial({ color: 0x181a26, roughness: 0.3, metalness: 0.35 })
    );
    tower109.position.set(0, 24, -45);
    tower109.castShadow = true;
    tower109.receiveShadow = true;
    scene.add(tower109);

    // 109 Neon Billboard Header with Glowing Emission
    const towerSign = new THREE.Mesh(
      new THREE.CylinderGeometry(9.4, 9.4, 5.5, 36),
      new THREE.MeshStandardMaterial({
        color: 0xff0066,
        emissive: 0xff0066,
        emissiveIntensity: 1.2,
        roughness: 0.2
      })
    );
    towerSign.position.set(0, 38, -45);
    scene.add(towerSign);

    // QFRONT Building with Giant Video Screen (East side)
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
      new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        emissive: 0x00e5ff,
        emissiveIntensity: 1.1,
        roughness: 0.1
      })
    );
    qfrontScreen.position.set(15.9, 19, -20);
    qfrontScreen.rotation.y = -Math.PI / 2;
    scene.add(qfrontScreen);

    // Tokyo Language Academy Building (West side)
    const academy = new THREE.Mesh(
      new THREE.BoxGeometry(22, 30, 24),
      new THREE.MeshStandardMaterial({ color: 0x161928, roughness: 0.4 })
    );
    academy.position.set(-30, 15, 15);
    academy.castShadow = true;
    academy.receiveShadow = true;
    scene.add(academy);

    // 9. HIGH-FIDELITY JAPANESE VENDING MACHINES (Jidohanbaiki)
    const bossTex = createVendingMachineTexture('boss');
    const blueVending = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 2.3, 0.95),
      new THREE.MeshStandardMaterial({
        map: bossTex,
        roughness: 0.25,
        metalness: 0.15,
        emissive: 0xffffff,
        emissiveMap: bossTex,
        emissiveIntensity: 0.4
      })
    );
    blueVending.position.set(-8.2, 1.35, -2);
    blueVending.rotation.y = Math.PI / 2;
    blueVending.castShadow = true;
    scene.add(blueVending);

    const colaTex = createVendingMachineTexture('cola');
    const redVending = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 2.3, 0.95),
      new THREE.MeshStandardMaterial({
        map: colaTex,
        roughness: 0.25,
        metalness: 0.15,
        emissive: 0xffffff,
        emissiveMap: colaTex,
        emissiveIntensity: 0.4
      })
    );
    redVending.position.set(-8.2, 1.35, -3.6);
    redVending.rotation.y = Math.PI / 2;
    redVending.castShadow = true;
    scene.add(redVending);

    // Recycling Bin for Cans & Bottles
    const recycleBin = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 1.1, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 })
    );
    recycleBin.position.set(-8.2, 0.75, -4.8);
    recycleBin.castShadow = true;
    scene.add(recycleBin);

    // 10. HIERARCHICAL STYLIZED PLAYER AVATAR RIG (for 3rd Person View & Shadows)
    const playerGroup = new THREE.Group();

    // Pelvis / Hips
    const playerPelvis = new THREE.Group();
    playerPelvis.position.y = 0.9;

    // Torso / Tokyo Streetwear Varsity Jacket
    const playerTorso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.38, 1.05, 14),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.45, metalness: 0.1 })
    );
    playerTorso.position.y = 0.52;
    playerTorso.castShadow = true;
    playerPelvis.add(playerTorso);

    // Commuter Backpack on Back
    const backpack = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.65, 0.26),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 })
    );
    backpack.position.set(0, 0.52, -0.28);
    backpack.castShadow = true;
    playerPelvis.add(backpack);

    // Head with Anime Face Texture & Spiky Hair
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

    // Limbs Hierarchical Rigging for Walking Animation
    // Left & Right Upper Arms
    const armMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5 });
    const handMat = new THREE.MeshStandardMaterial({ color: 0xffd6ba, roughness: 0.5 });

    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.46, 0.92, 0);
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.6, 8), armMat);
    leftArm.position.y = -0.3;
    leftArm.castShadow = true;
    leftArmGroup.add(leftArm);
    playerPelvis.add(leftArmGroup);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.46, 0.92, 0);
    const rightArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.6, 8), armMat);
    rightArmMesh.position.y = -0.3;
    rightArmMesh.castShadow = true;
    rightArmGroup.add(rightArmMesh);
    playerPelvis.add(rightArmGroup);

    // Left & Right Legs
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.18, 0, 0);
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.85, 8), pantsMat);
    leftLeg.position.y = -0.42;
    leftLeg.castShadow = true;
    leftLegGroup.add(leftLeg);
    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.3), shoeMat);
    leftShoe.position.set(0, -0.84, 0.06);
    leftLegGroup.add(leftShoe);
    playerPelvis.add(leftLegGroup);

    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.18, 0, 0);
    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.85, 8), pantsMat);
    rightLeg.position.y = -0.42;
    rightLeg.castShadow = true;
    rightLegGroup.add(rightLeg);
    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.3), shoeMat);
    rightShoe.position.set(0, -0.84, 0.06);
    rightLegGroup.add(rightShoe);
    playerPelvis.add(rightLegGroup);

    playerGroup.add(playerPelvis);
    playerAvatarGroupRef.current = playerGroup;
    playerLimbsRef.current = {
      leftLeg: leftLegGroup,
      rightLeg: rightLegGroup,
      leftArm: leftArmGroup,
      rightArm: rightArmGroup
    };
    scene.add(playerGroup);

    // 11. 60 FPS GAME ENGINE LOOP (Movement, Limbs Animation, Camera & Proximity)
    let lastTime = performance.now();

    const animate = (now: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Subtle NPC Breathing & Wave Animation
      if (npcManagerGroupRef.current) {
        npcManagerGroupRef.current.position.y = 0.05 + Math.sin(now * 0.0028) * 0.025;
      }

      // Check distance to NPC for wave reaction
      const distToNpc = Math.hypot(
        playerPosRef.current.x - NPC_MANAGER_POS.x,
        playerPosRef.current.z - NPC_MANAGER_POS.z
      );

      if (npcRightArmRef.current) {
        if (distToNpc < 5.0) {
          // Raise arm in friendly retail greeting
          npcRightArmRef.current.rotation.z = -0.8 + Math.sin(now * 0.008) * 0.2;
        } else {
          npcRightArmRef.current.rotation.z = -0.15;
        }
      }

      // Movement Physics (WASD / Arrow Keys)
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

          // Animate Limbs Walk Cycle
          walkCycleTimeRef.current += delta * (isSprinting ? 14 : 9);
          const walkPhase = walkCycleTimeRef.current;

          if (playerLimbsRef.current.leftLeg) {
            playerLimbsRef.current.leftLeg.rotation.x = Math.sin(walkPhase) * 0.65;
          }
          if (playerLimbsRef.current.rightLeg) {
            playerLimbsRef.current.rightLeg.rotation.x = -Math.sin(walkPhase) * 0.65;
          }
          if (playerLimbsRef.current.leftArm) {
            playerLimbsRef.current.leftArm.rotation.x = -Math.sin(walkPhase) * 0.55;
          }
          if (playerLimbsRef.current.rightArm) {
            playerLimbsRef.current.rightArm.rotation.x = Math.sin(walkPhase) * 0.55;
          }

          // Footstep audio synthesizer
          if (now - footstepCooldownRef.current > (isSprinting ? 280 : 420)) {
            worldAudio.playFootstepSound();
            footstepCooldownRef.current = now;
          }
        } else {
          // Smooth deceleration & return limbs to neutral pose
          playerVelocityRef.current.multiplyScalar(0.7);

          if (playerLimbsRef.current.leftLeg) playerLimbsRef.current.leftLeg.rotation.x *= 0.8;
          if (playerLimbsRef.current.rightLeg) playerLimbsRef.current.rightLeg.rotation.x *= 0.8;
          if (playerLimbsRef.current.leftArm) playerLimbsRef.current.leftArm.rotation.x *= 0.8;
          if (playerLimbsRef.current.rightArm) playerLimbsRef.current.rightArm.rotation.x *= 0.8;
        }

        // Apply velocity with boundary clamping
        playerPosRef.current.x += playerVelocityRef.current.x * delta;
        playerPosRef.current.z += playerVelocityRef.current.z * delta;

        playerPosRef.current.x = Math.max(-28, Math.min(28, playerPosRef.current.x));
        playerPosRef.current.z = Math.max(-30, Math.min(28, playerPosRef.current.z));

        // Sync player avatar mesh position & orientation
        if (playerAvatarGroupRef.current) {
          playerAvatarGroupRef.current.position.set(playerPosRef.current.x, 0, playerPosRef.current.z);
          playerAvatarGroupRef.current.rotation.y = cameraYawRef.current;
          playerAvatarGroupRef.current.visible = cameraMode === 'third_person';
        }

        // Update Camera Position & Rotation
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

        // 12. PROXIMITY DETECTION & CONTEXTUAL PROMPT
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

    // Resize Handler
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
  }, [cameraMode]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none bg-[#0a0a14] font-sans"
      onClick={requestPointerLock}
    >
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={canvasMountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* GAME HUD: Zero-Buttonism Minimalist UI Overlay */}
      {/* Top Bar: Vital Game Stats & Tokyo Quest Objective */}
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
              <span className="font-semibold text-emerald-400">LV. 3 Explorer</span>
              <span>•</span>
              <span>{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Center: Active Quest / Objective Banner */}
        <div className="hidden md:flex flex-col items-center pointer-events-auto max-w-lg">
          <div className="bg-black/70 backdrop-blur-xl border border-emerald-500/40 px-5 py-2 rounded-full shadow-2xl flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Active Quest</span>
            <span className="text-zinc-600">|</span>
            <span className="text-xs font-medium text-white truncate max-w-md">{questObjective}</span>
          </div>
        </div>

        {/* Right: Controls & Tokyo Live JST Clock */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Audio Ambient Toggle */}
          <button
            onClick={toggleAmbientAudio}
            className="px-3 py-2 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/30 rounded-xl text-zinc-300 hover:text-white transition flex items-center gap-2 text-xs font-semibold shadow-lg"
            title="Toggle Tokyo Ambient Audio"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
            <span className="hidden sm:inline">{isAudioMuted ? 'Muted' : 'Live Audio'}</span>
          </button>

          {/* Camera View Mode Toggle (1st vs 3rd Person) */}
          <button
            onClick={() => setCameraMode((prev) => (prev === 'first_person' ? 'third_person' : 'first_person'))}
            className="px-3 py-2 bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/30 rounded-xl text-zinc-300 hover:text-white transition flex items-center gap-2 text-xs font-semibold shadow-lg"
            title="Toggle First / Third Person Camera"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">{cameraMode === 'first_person' ? '1st Person' : '3rd Person'}</span>
          </button>

          {/* Tokyo Time Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>東京 {currentTimeJST} JST</span>
          </div>

          {/* Panorama View Toggle if requested */}
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
            {/* Header: Speaker Info & Badge */}
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

              {/* Audio Listen Button */}
              <button
                onClick={() => playSpeech(dialogue.npcJapaneseText)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition"
                title="Listen to native pronunciation"
              >
                <Volume2 className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            {/* Speech Dialogue Bubble */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5">
              <div className="text-lg md:text-xl font-bold text-white tracking-wide">
                {dialogue.npcJapaneseText}
              </div>
              <div className="text-xs text-emerald-400 font-mono">{dialogue.npcRomaji}</div>
              <div className="text-xs text-zinc-400 italic">{dialogue.npcEnglish}</div>
            </div>

            {/* Tanaka AI Sensei Coaching Card (Intervention Mode) */}
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

            {/* User Interaction Choices */}
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

            {/* Close / Resume Exploration */}
            <button
              onClick={() => setDialogue((prev) => ({ ...prev, isOpen: false }))}
              className="text-center text-xs text-zinc-500 hover:text-zinc-300 pt-1 transition"
            >
              Press ESC or click here to resume exploring Shibuya
            </button>
          </div>
        </div>
      )}

      {/* Bottom Bar: On-Screen Game Controls & Movement Hint */}
      <footer className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none z-20">
        {/* Keyboard Controls Legend */}
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

        {/* Mobile On-Screen Virtual Controls for Touchscreen / Browsers */}
        <div className="flex md:hidden items-center gap-2 pointer-events-auto bg-black/70 backdrop-blur-xl border border-white/10 p-2 rounded-2xl">
          <button
            onPointerDown={() => {
              keysPressedRef.current['w'] = true;
            }}
            onPointerUp={() => {
              keysPressedRef.current['w'] = false;
            }}
            className="w-11 h-11 rounded-xl bg-white/10 active:bg-white/30 flex items-center justify-center text-white font-bold text-sm"
          >
            W
          </button>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <button
                onPointerDown={() => {
                  keysPressedRef.current['a'] = true;
                }}
                onPointerUp={() => {
                  keysPressedRef.current['a'] = false;
                }}
                className="w-10 h-10 rounded-xl bg-white/10 active:bg-white/30 flex items-center justify-center text-white font-bold text-sm"
              >
                A
              </button>
              <button
                onPointerDown={() => {
                  keysPressedRef.current['s'] = true;
                }}
                onPointerUp={() => {
                  keysPressedRef.current['s'] = false;
                }}
                className="w-10 h-10 rounded-xl bg-white/10 active:bg-white/30 flex items-center justify-center text-white font-bold text-sm"
              >
                S
              </button>
              <button
                onPointerDown={() => {
                  keysPressedRef.current['d'] = true;
                }}
                onPointerUp={() => {
                  keysPressedRef.current['d'] = false;
                }}
                className="w-10 h-10 rounded-xl bg-white/10 active:bg-white/30 flex items-center justify-center text-white font-bold text-sm"
              >
                D
              </button>
            </div>
          </div>
        </div>

        {/* Tanaka AI Sensei Dock (Bottom Right) */}
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
