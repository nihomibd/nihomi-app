// src/components/canvas3d/ShibuyaPlayableWorld.tsx
// NIHOMI WORLD™ V4: REALITY CANVAS™ — Playable 3D Shibuya World & In-World Learning Engine
// First-Person / Third-Person WASD Movement, 7-Eleven Conbini NPC Interaction, Spatial Audio & Zero-Buttonism HUD

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

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerMeshRef = useRef<THREE.Group | null>(null);
  const npcManagerRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Store coordinates (7-Eleven at x: -14, z: -6)
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
      // Correct Keigo response!
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
      // Tanaka AI Sensei Smooth Intervention
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
      // User retries with correct Keigo!
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

      // 'E' Key triggers in-world interaction if proximity prompt is visible
      if (key === 'e' && proximityPrompt.visible && !isDialogueOpenRef.current) {
        e.preventDefault();
        handleTriggerInteraction();
      }

      // Escape closes dialogue or releases pointer lock
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
    scene.fog = new THREE.FogExp2(0x0a0a14, 0.016);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 300);
    cameraRef.current = camera;

    // 3. Renderer with soft shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    // 4. Lighting Engine
    // Ambient moonlit night
    const ambientLight = new THREE.AmbientLight(0x282c3f, 1.4);
    scene.add(ambientLight);

    // Moonlight Directional
    const moonLight = new THREE.DirectionalLight(0x7080b0, 1.2);
    moonLight.position.set(20, 45, 25);
    scene.add(moonLight);

    // Warm Neon Streetlights along Shibuya
    const neonCyan = new THREE.PointLight(0x00e5ff, 2.5, 30);
    neonCyan.position.set(0, 8, 0);
    scene.add(neonCyan);

    const neonMagenta = new THREE.PointLight(0xff007f, 2.8, 35);
    neonMagenta.position.set(15, 12, -15);
    scene.add(neonMagenta);

    // 5. Environment Geometry: Shibuya Scramble Crossing
    // Asphalt Ground Plane
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x11131a,
      roughness: 0.5,
      metalness: 0.15
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);

    // Shibuya Scramble Crosswalk Zebra Stripes
    const crosswalkGroup = new THREE.Group();
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.05
    });

    // Diagonal crossing 1 (North-West to South-East)
    for (let i = -14; i <= 14; i += 2.2) {
      const stripeGeo = new THREE.BoxGeometry(0.8, 0.02, 18);
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(i, 0.015, -4);
      stripe.rotation.y = Math.PI / 5;
      crosswalkGroup.add(stripe);
    }
    // Diagonal crossing 2 (North-East to South-West)
    for (let i = -14; i <= 14; i += 2.2) {
      const stripeGeo = new THREE.BoxGeometry(0.8, 0.02, 18);
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(i, 0.015, -4);
      stripe.rotation.y = -Math.PI / 5;
      crosswalkGroup.add(stripe);
    }
    scene.add(crosswalkGroup);

    // Sidewalk slabs with concrete curbs
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x222634, roughness: 0.6 });
    const sidewalkGeo = new THREE.BoxGeometry(30, 0.25, 25);
    const westSidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
    westSidewalk.position.set(-18, 0.125, -10);
    scene.add(westSidewalk);

    const eastSidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
    eastSidewalk.position.set(18, 0.125, -10);
    scene.add(eastSidewalk);

    // 6. BUILD THE 3D 7-ELEVEN / CONBINI STOREFRONT
    const conbiniGroup = new THREE.Group();
    conbiniGroup.position.set(CONBINI_POS.x, 0.25, CONBINI_POS.z);

    // Store Floor
    const conbiniFloorGeo = new THREE.BoxGeometry(14, 0.05, 12);
    const conbiniFloorMat = new THREE.MeshStandardMaterial({ color: 0xe8e6df, roughness: 0.2 });
    const conbiniFloor = new THREE.Mesh(conbiniFloorGeo, conbiniFloorMat);
    conbiniFloor.position.set(0, 0.025, -2);
    conbiniGroup.add(conbiniFloor);

    // Store Walls (Rear and sides)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1f222e, roughness: 0.5 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(14, 5, 0.4), wallMat);
    backWall.position.set(0, 2.5, -8);
    conbiniGroup.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5, 12), wallMat);
    leftWall.position.set(-7, 2.5, -2);
    conbiniGroup.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5, 12), wallMat);
    rightWall.position.set(7, 2.5, -2);
    conbiniGroup.add(rightWall);

    // 7-Eleven Iconic 3-Color Horizontal Canopy Stripe (Orange, Green, Red)
    const canopyOrange = new THREE.Mesh(
      new THREE.BoxGeometry(14.4, 0.35, 1.2),
      new THREE.MeshBasicMaterial({ color: 0xff7700 })
    );
    canopyOrange.position.set(0, 4.8, 3.8);
    conbiniGroup.add(canopyOrange);

    const canopyGreen = new THREE.Mesh(
      new THREE.BoxGeometry(14.4, 0.35, 1.2),
      new THREE.MeshBasicMaterial({ color: 0x008844 })
    );
    canopyGreen.position.set(0, 4.45, 3.8);
    conbiniGroup.add(canopyGreen);

    const canopyRed = new THREE.Mesh(
      new THREE.BoxGeometry(14.4, 0.35, 1.2),
      new THREE.MeshBasicMaterial({ color: 0xee2222 })
    );
    canopyRed.position.set(0, 4.1, 3.8);
    conbiniGroup.add(canopyRed);

    // Illuminated 7-Eleven Storefront Sign
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512;
    signCanvas.height = 128;
    const ctx = signCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 512, 128);
      ctx.fillStyle = '#008844';
      ctx.font = 'bold 54px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('7-ELEVEN コンビニ', 256, 64);
    }
    const signTexture = new THREE.CanvasTexture(signCanvas);
    const signMesh = new THREE.Mesh(
      new THREE.BoxGeometry(10, 1.2, 0.2),
      new THREE.MeshBasicMaterial({ map: signTexture })
    );
    signMesh.position.set(0, 5.8, 3.8);
    conbiniGroup.add(signMesh);

    // Front Glass Window panels & Automatic Sliding Door
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.3,
      roughness: 0.05
    });
    const leftGlass = new THREE.Mesh(new THREE.BoxGeometry(4.8, 4, 0.1), glassMat);
    leftGlass.position.set(-4.5, 2, 3.8);
    conbiniGroup.add(leftGlass);

    const rightGlass = new THREE.Mesh(new THREE.BoxGeometry(4.8, 4, 0.1), glassMat);
    rightGlass.position.set(4.5, 2, 3.8);
    conbiniGroup.add(rightGlass);

    // Warm Interior Conbini Ceiling Light
    const conbiniInteriorLight = new THREE.PointLight(0xfff6dd, 3.2, 16);
    conbiniInteriorLight.position.set(0, 3.8, -2);
    conbiniGroup.add(conbiniInteriorLight);

    // Register Checkout Counter
    const counterMat = new THREE.MeshStandardMaterial({ color: 0xd0cfc9, roughness: 0.3 });
    const counterMesh = new THREE.Mesh(new THREE.BoxGeometry(5.5, 1.1, 1.4), counterMat);
    counterMesh.position.set(0, 0.55, -4.5);
    conbiniGroup.add(counterMesh);

    // POS Register Monitor Screen
    const posMonitor = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.6, 0.4),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    posMonitor.position.set(-0.8, 1.4, -4.5);
    conbiniGroup.add(posMonitor);

    // Product Shelves with Colorful Japanese Snacks/Drinks
    for (let s = -4.5; s <= 4.5; s += 3.0) {
      if (s === -1.5) continue; // Walkway
      const shelf = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 2.2, 5.5),
        new THREE.MeshStandardMaterial({ color: 0x3a3f52, roughness: 0.4 })
      );
      shelf.position.set(s, 1.1, 0.5);
      conbiniGroup.add(shelf);
    }

    // 7. 3D STORE MANAGER NPC (Tanaka-tencho / Yamada-san)
    const npcGroup = new THREE.Group();
    npcGroup.position.set(0, 0, -6.0); // Standing behind counter

    // NPC Body / Green 7-Eleven Uniform Apron
    const npcBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.45, 1.4, 16),
      new THREE.MeshStandardMaterial({ color: 0x008844, roughness: 0.5 })
    );
    npcBody.position.y = 1.1;
    npcGroup.add(npcBody);

    // NPC Head
    const npcHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffd1b3, roughness: 0.4 })
    );
    npcHead.position.y = 2.05;
    npcGroup.add(npcHead);

    // NPC Hair (Stylized Dark Anime Hair)
    const npcHair = new THREE.Mesh(
      new THREE.SphereGeometry(0.31, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x1a1a24, roughness: 0.6 })
    );
    npcHair.position.set(0, 2.15, -0.05);
    npcGroup.add(npcHair);

    // Overhead Floating Japanese Name Badge 「店長 田中」
    const nameBadgeCanvas = document.createElement('canvas');
    nameBadgeCanvas.width = 256;
    nameBadgeCanvas.height = 64;
    const badgeCtx = nameBadgeCanvas.getContext('2d');
    if (badgeCtx) {
      badgeCtx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      badgeCtx.roundRect(4, 4, 248, 56, 12);
      badgeCtx.fill();
      badgeCtx.strokeStyle = '#00ffcc';
      badgeCtx.lineWidth = 3;
      badgeCtx.stroke();
      badgeCtx.fillStyle = '#ffffff';
      badgeCtx.font = 'bold 26px sans-serif';
      badgeCtx.textAlign = 'center';
      badgeCtx.textBaseline = 'middle';
      badgeCtx.fillText('店長 田中 (Manager)', 128, 32);
    }
    const badgeTexture = new THREE.CanvasTexture(nameBadgeCanvas);
    const badgeSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: badgeTexture, transparent: true })
    );
    badgeSprite.scale.set(2.2, 0.6, 1);
    badgeSprite.position.set(0, 2.7, 0);
    npcGroup.add(badgeSprite);

    npcManagerRef.current = npcGroup;
    conbiniGroup.add(npcGroup);
    scene.add(conbiniGroup);

    // 8. SURROUNDING TOKYO LANDMARKS
    // Shibuya 109 Curved Tower (Iconic landmark at z: -45)
    const tower109 = new THREE.Mesh(
      new THREE.CylinderGeometry(9, 11, 45, 32),
      new THREE.MeshStandardMaterial({ color: 0x1e202e, roughness: 0.3 })
    );
    tower109.position.set(0, 22.5, -45);
    scene.add(tower109);

    // 109 Neon Billboard Header
    const towerSign = new THREE.Mesh(
      new THREE.CylinderGeometry(9.3, 9.3, 5, 32),
      new THREE.MeshBasicMaterial({ color: 0xff0066 })
    );
    towerSign.position.set(0, 36, -45);
    scene.add(towerSign);

    // QFRONT Building with Giant Video Screen (East side)
    const qfront = new THREE.Mesh(
      new THREE.BoxGeometry(26, 38, 18),
      new THREE.MeshStandardMaterial({ color: 0x161924, roughness: 0.2 })
    );
    qfront.position.set(28, 19, -20);
    scene.add(qfront);

    const qfrontScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 20),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff })
    );
    qfrontScreen.position.set(14.9, 18, -20);
    qfrontScreen.rotation.y = -Math.PI / 2;
    scene.add(qfrontScreen);

    // Tokyo Language Academy Building (West side)
    const academy = new THREE.Mesh(
      new THREE.BoxGeometry(20, 28, 22),
      new THREE.MeshStandardMaterial({ color: 0x181c2b, roughness: 0.4 })
    );
    academy.position.set(-28, 14, 15);
    scene.add(academy);

    // Japanese Vending Machines (Jidohanbaiki) along West Sidewalk
    const vendingGeo = new THREE.BoxGeometry(1.2, 2.2, 0.9);
    const blueVending = new THREE.Mesh(vendingGeo, new THREE.MeshStandardMaterial({ color: 0x0055ff }));
    blueVending.position.set(-8, 1.25, -2);
    blueVending.rotation.y = Math.PI / 2;
    scene.add(blueVending);

    const redVending = new THREE.Mesh(vendingGeo, new THREE.MeshStandardMaterial({ color: 0xdd1111 }));
    redVending.position.set(-8, 1.25, -3.4);
    redVending.rotation.y = Math.PI / 2;
    scene.add(redVending);

    // 9. PLAYER AVATAR MESH (for 3rd Person View)
    const playerGroup = new THREE.Group();
    const playerBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.38, 1.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.5 })
    );
    playerBody.position.y = 0.9;
    playerGroup.add(playerBody);

    const playerHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffd1b3, roughness: 0.4 })
    );
    playerHead.position.y = 1.75;
    playerGroup.add(playerHead);

    playerMeshRef.current = playerGroup;
    scene.add(playerGroup);

    // 10. GAME ENGINE LOOP (Movement, Camera, Physics & Proximity)
    let lastTime = performance.now();

    const animate = (now: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Subtle NPC Breathing & Idle Animation
      if (npcManagerRef.current) {
        npcManagerRef.current.position.y = 0.05 + Math.sin(now * 0.003) * 0.03;
      }

      // Movement Physics (WASD / Arrow Keys)
      if (!isDialogueOpenRef.current) {
        const keys = keysPressedRef.current;
        const moveVector = new THREE.Vector3();

        const moveForward = keys['w'] || keys['arrowup'] ? 1 : keys['s'] || keys['arrowdown'] ? -1 : 0;
        const moveRight = keys['d'] || keys['arrowright'] ? 1 : keys['a'] || keys['arrowleft'] ? -1 : 0;
        const isSprinting = !!keys['shift'];

        if (moveForward !== 0 || moveRight !== 0) {
          // Direction relative to camera yaw
          const forward = new THREE.Vector3(-Math.sin(cameraYawRef.current), 0, -Math.cos(cameraYawRef.current));
          const right = new THREE.Vector3(Math.cos(cameraYawRef.current), 0, -Math.sin(cameraYawRef.current));

          moveVector.addScaledVector(forward, moveForward);
          moveVector.addScaledVector(right, moveRight);
          moveVector.normalize();

          const baseSpeed = isSprinting ? 9.5 : 5.5;
          playerVelocityRef.current.copy(moveVector.multiplyScalar(baseSpeed));

          // Footstep audio synthesizer
          if (now - footstepCooldownRef.current > (isSprinting ? 280 : 420)) {
            worldAudio.playFootstepSound();
            footstepCooldownRef.current = now;
          }
        } else {
          // Damping deceleration
          playerVelocityRef.current.multiplyScalar(0.7);
        }

        // Apply velocity to player position with boundary clamp
        playerPosRef.current.x += playerVelocityRef.current.x * delta;
        playerPosRef.current.z += playerVelocityRef.current.z * delta;

        // Keep player inside playable Shibuya Crossing bounds
        playerPosRef.current.x = Math.max(-28, Math.min(28, playerPosRef.current.x));
        playerPosRef.current.z = Math.max(-30, Math.min(28, playerPosRef.current.z));

        // Sync player avatar mesh position & orientation
        if (playerMeshRef.current) {
          playerMeshRef.current.position.set(playerPosRef.current.x, 0, playerPosRef.current.z);
          playerMeshRef.current.rotation.y = cameraYawRef.current;
          playerMeshRef.current.visible = cameraMode === 'third_person';
        }

        // Update Camera Position & Rotation
        if (cameraMode === 'first_person') {
          // Head-bobbing effect while moving
          const isMoving = playerVelocityRef.current.lengthSq() > 0.1;
          const headBob = isMoving ? Math.sin(now * 0.012) * 0.05 : 0;

          camera.position.set(playerPosRef.current.x, playerPosRef.current.y + headBob, playerPosRef.current.z);
          camera.rotation.order = 'YXZ';
          camera.rotation.y = cameraYawRef.current;
          camera.rotation.x = cameraPitchRef.current;
        } else {
          // Third-person smooth over-the-shoulder chase camera
          const camDist = 3.6;
          const camHeight = 2.0;
          const camX = playerPosRef.current.x + Math.sin(cameraYawRef.current) * camDist;
          const camZ = playerPosRef.current.z + Math.cos(cameraYawRef.current) * camDist;

          camera.position.set(camX, playerPosRef.current.y + camHeight, camZ);
          camera.lookAt(playerPosRef.current.x, playerPosRef.current.y + 1.2, playerPosRef.current.z);
        }

        // 11. SPATIAL PROXIMITY DETECTION (7-Eleven & Store Manager NPC)
        const distToNpc = Math.hypot(
          playerPosRef.current.x - NPC_MANAGER_POS.x,
          playerPosRef.current.z - NPC_MANAGER_POS.z
        );
        const distToStoreFront = Math.hypot(
          playerPosRef.current.x - CONBINI_POS.x,
          playerPosRef.current.z - (CONBINI_POS.z + 4)
        );

        // Conbini Door Arrival Chime
        if (distToStoreFront < 5.5 && !hasTriggeredStoreChimeRef.current) {
          worldAudio.playConbiniDoorChime();
          hasTriggeredStoreChimeRef.current = true;
        } else if (distToStoreFront > 8.0) {
          hasTriggeredStoreChimeRef.current = false;
        }

        // Contextual Interaction Prompt (Zero-Buttonism)
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
