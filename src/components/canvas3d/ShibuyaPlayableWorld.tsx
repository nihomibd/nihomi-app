// src/components/canvas3d/ShibuyaPlayableWorld.tsx
// NIHOMI REAL JAPAN CANVAS™ — REAL WORLD SHIBUYA FOUNDATION & NIHOMI INTERACTIVE LAYER
// Reusable Geographic Architecture: RealWorldProvider (Google 3D Tiles) + TokyoTimeEngine (Live JST Solar) +
// UrbanSimulationEngine (Traffic & Pedestrians) + WorldInteractionLayer (POIs & Keigo Coaching) + MemoryOS

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import {
  Compass,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Eye,
  Camera,
  Coins,
  ChevronRight,
  GraduationCap,
  MapPin,
  Clock,
  Sun,
  Moon,
  CloudSun,
  ShieldAlert,
  Globe,
  Settings,
  X,
  Train,
  CreditCard,
  Plane,
  Navigation,
  ArrowRight,
  Ticket,
  Building2,
  Layers
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';

// Modular Nihomi World Engine Subsystems (Open Japan Geo Engine)
import { WorldProviderManager, CAMERA_VIEW_PRESETS } from './engine/WorldProviderManager';
import { WorldProviderStatus, GeoProviderType, CameraViewPreset } from './engine/providers/WorldProviderAdapter';
import { TokyoTimeEngine, TimeOverridePreset, SolarAtmosphereState } from './engine/TokyoTimeEngine';
import { UrbanSimulationEngine } from './engine/UrbanSimulationEngine';
import { WorldInteractionLayer, WorldPOI, SHIBUYA_POIS } from './engine/WorldInteractionLayer';
import { spatialAudio } from './engine/SpatialAudioEngine';
import { MemoryOSEngine } from './engine/MemoryOSEngine';
import { JAPAN_GEO_ANCHORS } from './engine/GeoCoordinates';

// Scalable World Graph & Transportation Subsystems
import { worldGraphManager } from './worldGraph/WorldGraphManager';
import { WORLD_NODES, JAPAN_DISTRICTS } from './worldGraph/WorldGraphData';
import { WorldGraphNode, TransitRoute } from './worldGraph/WorldGraphTypes';
import { TicketVendingMachineModal, TrainRideTransitModal } from './transport/RailwaySystem';
import { AirportImmigrationSim } from './transport/AirportImmigrationSim';
import { TaxiTransitSim } from './transport/TaxiTransitSim';
import { SPATIAL_NPC_REGISTRY } from './learning/SpatialNPCRegistry';
import { observationalLearningEngine } from './learning/ObservationalLearningEngine';

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
  const [activePOI, setActivePOI] = useState<WorldPOI | null>(null);
  const [questObjective, setQuestObjective] = useState<string>(
    'Explore Shibuya & Ask 7-Eleven Store Manager about a Part-Time Job (Baito)'
  );
  const [questProgress, setQuestProgress] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [xp, setXp] = useState<number>(350);

  // Time & Atmosphere Engine State
  const [timePreset, setTimePreset] = useState<TimeOverridePreset>('auto_jst');
  const [liveTokyoTime, setLiveTokyoTime] = useState<string>('20:15 JST');
  const [trafficSignalState, setTrafficSignalState] = useState<'walk_green' | 'traffic_green'>('walk_green');

  // Open Japan Geo Engine State (Project PLATEAU & OpenStreetMap — $0.00 / month Free Open Data)
  const [geoStatus, setGeoStatus] = useState<WorldProviderStatus>({
    providerName: 'Project PLATEAU (国土交通省 3D都市モデル)',
    providerType: 'plateau_3d_tiles',
    costModel: '$0.00 / month (Free Open Data)',
    license: 'Government of Japan Open Data Terms of Use (CC BY 4.0)',
    isStreaming: true,
    activeLayers: ['buildings_lod2', 'roads_lod3'],
    loadedTilesCount: 0,
    attributions: ['Project PLATEAU (国土交通省 3D都市モデル)', '© OpenStreetMap contributors'],
    anchor: JAPAN_GEO_ANCHORS.SHIBUYA_SCRAMBLE
  });
  const [isOpenGeoModalOpen, setIsOpenGeoModalOpen] = useState<boolean>(false);
  const [currentCameraPreset, setCurrentCameraPreset] = useState<CameraViewPreset>('street_scramble');

  // World Graph & Inter-District Transportation State
  const [currentNode, setCurrentNode] = useState<WorldGraphNode>(worldGraphManager.getCurrentNode());
  const [suicaBalance, setSuicaBalance] = useState<number>(worldGraphManager.getSuicaBalance());
  const [isWorldMapOpen, setIsWorldMapOpen] = useState<boolean>(false);
  const [isTicketMachineOpen, setIsTicketMachineOpen] = useState<boolean>(false);
  const [isAirportSimOpen, setIsAirportSimOpen] = useState<boolean>(false);
  const [isTaxiSimOpen, setIsTaxiSimOpen] = useState<boolean>(false);
  const [trainRideState, setTrainRideState] = useState<{
    isOpen: boolean;
    lineJa: string;
    lineEn: string;
    destJa: string;
    travelMin: number;
  }>({
    isOpen: false,
    lineJa: 'JR 山手線',
    lineEn: 'JR Yamanote Line',
    destJa: '新宿',
    travelMin: 7
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

  // World Graph Event Listener
  useEffect(() => {
    const unsubscribe = worldGraphManager.subscribe((event) => {
      if (event.type === 'NODE_CHANGED') {
        setCurrentNode(event.node);
        interactionLayerRef.current.loadFromGraphNode(event.node);
        setQuestObjective(`Arrived at ${event.node.nameEn}. Explore local POIs and transit connections.`);
      } else if (event.type === 'SUICA_CHARGED' || event.type === 'FARE_DEDUCTED') {
        setSuicaBalance(event.newBalanceYen);
      }
    });
    return unsubscribe;
  }, []);

  // Transit Execution Handlers
  const handleStartTransit = useCallback((route: TransitRoute) => {
    if (route.transitMode === 'taxi') {
      setIsTaxiSimOpen(true);
      return;
    }

    if (route.requiresICCardOrTicket && suicaBalance < route.fareYen) {
      alert(`ICカードの残高が不足しています (Insufficient Suica balance). Required: ¥${route.fareYen}. Please charge at ticket machine.`);
      setIsTicketMachineOpen(true);
      return;
    }

    setTrainRideState({
      isOpen: true,
      lineJa: route.routeLineNameJa,
      lineEn: route.routeLineNameEn,
      destJa: route.arrivalStationNameJa,
      travelMin: route.travelTimeMinutes
    });
  }, [suicaBalance]);

  const handleCompleteTrainRide = useCallback(() => {
    const route = currentNode.transitRoutes.find(
      (r) => r.arrivalStationNameJa === trainRideState.destJa || r.routeLineNameJa === trainRideState.lineJa
    ) || currentNode.transitRoutes[0];

    setTrainRideState((prev) => ({ ...prev, isOpen: false }));

    if (route) {
      worldGraphManager.travelRoute(route.id);
    }
  }, [currentNode, trainRideState]);

  // Engine Subsystem References (Provider-Agnostic Open Japan Geo Engine)
  const worldProviderManagerRef = useRef<WorldProviderManager | null>(null);
  const timeEngineRef = useRef<TokyoTimeEngine>(new TokyoTimeEngine());
  const simulationEngineRef = useRef<UrbanSimulationEngine | null>(null);
  const interactionLayerRef = useRef<WorldInteractionLayer>(new WorldInteractionLayer());

  // Three.js Core Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Player Avatar & Kinematics Refs (Calibrated 1.62m Natural Eye Height)
  const playerAvatarGroupRef = useRef<THREE.Group | null>(null);
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.62, 14));
  const playerVelocityRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const cameraYawRef = useRef<number>(Math.PI);
  const cameraPitchRef = useRef<number>(0);
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});
  const walkCycleTimeRef = useRef<number>(0);
  const footstepCooldownRef = useRef<number>(0);
  const lastChirpTimeRef = useRef<number>(0);
  const hasTriggeredChimeRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

  const isDialogueOpenRef = useRef<boolean>(false);
  isDialogueOpenRef.current = dialogue.isOpen;

  // Hierarchical limbs for natural character walk-cycle
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

  // Native Japanese TTS
  const playSpeech = useCallback((text: string) => {
    speakJapanese(text, { rate: 0.95 });
  }, []);

  // Open / Trigger Store Dialogue or Transport Modal
  const handleTriggerInteraction = useCallback(() => {
    if (!activePOI) return;

    if (activePOI.id === 'poi_narita_immigration') {
      setIsAirportSimOpen(true);
      return;
    }

    if (activePOI.id === 'poi_ticket_machine' || activePOI.id === 'poi_shibuya_station') {
      setIsTicketMachineOpen(true);
      return;
    }

    if (activePOI.id === 'poi_ticket_gates') {
      const route = currentNode.transitRoutes[0];
      if (route) {
        handleStartTransit(route);
      } else {
        setIsTicketMachineOpen(true);
      }
      return;
    }

    if (activePOI.id === 'poi_shibuya_taxi') {
      setIsTaxiSimOpen(true);
      return;
    }

    // Dynamic Spatial NPC Lookup
    if (activePOI.npcId && SPATIAL_NPC_REGISTRY[activePOI.npcId]) {
      const npc = SPATIAL_NPC_REGISTRY[activePOI.npcId];
      setDialogue({
        isOpen: true,
        step: 'greeting',
        speaker: 'manager',
        npcJapaneseText: npc.dialogueRoot.textJa,
        npcRomaji: npc.dialogueRoot.textRomaji,
        npcEnglish: npc.dialogueRoot.textEn,
        choices: npc.dialogueRoot.choices.map((c) => ({
          id: c.id,
          textJa: c.textJa,
          textRomaji: c.textRomaji,
          textEn: c.textEn,
          isCorrectKeigo: c.isCorrectKeigo
        }))
      });
      playSpeech(npc.dialogueRoot.textJa);
      return;
    }

    // Default 7-Eleven Dialogue
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
  }, [activePOI, currentNode, handleStartTransit, playSpeech]);

  // Handle Dialogue Choice Selection
  const handleSelectChoice = (choiceId: string) => {
    const poi = activePOI || SHIBUYA_POIS[0];

    if (choiceId === 'baito_keigo') {
      const evaluation = interactionLayerRef.current.evaluateDialogueResponse(
        poi,
        choiceId,
        'アルバイトの募集はありますか？',
        true
      );
      playSpeech('素晴らしい敬語ですね！はい、週3日から夜勤とレジスタッフを募集中です。履歴書をお持ちですか？');
      onAddCoins(evaluation.coinsGained);
      setXp((prev) => prev + evaluation.xpGained);
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
      interactionLayerRef.current.evaluateDialogueResponse(poi, choiceId, 'バイトありますか？', false);
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

      if (key === 'e' && activePOI && !isDialogueOpenRef.current) {
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
  }, [activePOI, handleTriggerInteraction]);

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

  // Time Preset Switcher
  const handleTimePresetChange = (preset: TimeOverridePreset) => {
    setTimePreset(preset);
    timeEngineRef.current.setTimeOverride(preset);
  };

  // Main Three.js Scene Setup (Mounts once strictly)
  useEffect(() => {
    const mountEl = canvasMountRef.current;
    if (!mountEl) return;

    const width = mountEl.clientWidth || window.innerWidth;
    const height = mountEl.clientHeight || window.innerHeight;

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera (far plane 2000m for complete Tokyo macro overview and district coverage)
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 2000);
    cameraRef.current = camera;

    // 3. WebGL Renderer with ACES Filmic Tone Mapping (Calibrated Exposure)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0; // Calibrated exposure for natural, physically accurate Tokyo daylight
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    // 4. Cinematic Post-Processing Pipeline (Strict Threshold to prevent daylight washout)
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    // Threshold 1.0 ensures standard daylight surfaces (<= 1.0) never bloom into full-screen glare; only HDR emissive > 1.0 glows
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.12, 0.2, 1.0);
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    composerRef.current = composer;

    // 5. Dynamic Solar Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.55);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight(0xfff7e6, 1.05);
    sunLight.position.set(30, 60, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 180;
    sunLight.shadow.camera.left = -45;
    sunLight.shadow.camera.right = 45;
    sunLight.shadow.camera.top = 45;
    sunLight.shadow.camera.bottom = -45;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // 6. OPEN JAPAN GEO ENGINE (Project PLATEAU 3D Tiles + OpenStreetMap)
    const providerManager = new WorldProviderManager(
      JAPAN_GEO_ANCHORS.SHIBUYA_SCRAMBLE,
      'plateau_3d_tiles',
      (status) => setGeoStatus(status)
    );
    providerManager.initialize(scene, camera, renderer);
    worldProviderManagerRef.current = providerManager;

    // 7. URBAN SIMULATION ENGINE (Traffic & Pedestrians)
    const simulation = new UrbanSimulationEngine((signalState) => {
      setTrafficSignalState(signalState);
    });
    simulation.initialize(scene);
    simulationEngineRef.current = simulation;

    // 8. NIHOMI SPATIAL ANCHOR (Zero cartoon primitives - Native First-Person View)
    const playerGroup = new THREE.Group();
    playerGroup.position.copy(playerPosRef.current);
    scene.add(playerGroup);
    playerAvatarGroupRef.current = playerGroup;

    playerLimbsRef.current = {};

    // 9. ANIMATION & RENDER LOOP
    let lastTime = performance.now();

    const animate = (now: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // 9A. Update Tokyo Solar Lighting & Time of Day
      const atmosphere = timeEngineRef.current.calculateAtmosphere();
      setLiveTokyoTime(atmosphere.tokyoTimeString);

      scene.background = atmosphere.skyColor;
      scene.fog = null; // Physically accurate clear atmosphere without blinding milky haze

      if (ambientLightRef.current) {
        ambientLightRef.current.color.copy(atmosphere.ambientColor);
        ambientLightRef.current.intensity = atmosphere.ambientIntensity;
      }

      if (sunLightRef.current) {
        sunLightRef.current.color.copy(atmosphere.sunColor);
        sunLightRef.current.intensity = atmosphere.sunIntensity;
        sunLightRef.current.position.copy(atmosphere.sunPosition);
      }

      // 9B. Update Open Japan Geo Engine & Cinematic Camera Transitions
      providerManager.update(camera, now);

      const flight = providerManager.stepCameraFlight(now);
      if (flight.inFlight && flight.pos) {
        camera.position.copy(flight.pos);
        if (flight.pitch !== undefined) cameraPitchRef.current = flight.pitch;
        if (flight.yaw !== undefined) cameraYawRef.current = flight.yaw;
        camera.rotation.order = 'YXZ';
        camera.rotation.y = cameraYawRef.current;
        camera.rotation.x = cameraPitchRef.current;
        playerPosRef.current.copy(flight.pos);
      }

      // 9C. Update Urban Simulation (Traffic & Pedestrians)
      simulation.update(delta, now, playerPosRef.current, atmosphere);

      // Tokyo Crosswalk Acoustic Signal ("Piyo-Piyo") during Walk Phase
      if (simulation.getSignalState() === 'walk_green' && !isAudioMuted && now - lastChirpTimeRef.current > 3800) {
        spatialAudio.playPedestrianSignal('piyo');
        lastChirpTimeRef.current = now;
      }

      // 9D. Player Movement Physics (WASD / Arrow Keys)
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

          // Articulated locomotion kinematics
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

          if (now - footstepCooldownRef.current > (isSprinting ? 280 : 420)) {
            spatialAudio.playFootstepSound();
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

        // Bounded within Shibuya Scramble geographic footprint
        playerPosRef.current.x = Math.max(-34, Math.min(34, playerPosRef.current.x));
        playerPosRef.current.z = Math.max(-36, Math.min(34, playerPosRef.current.z));

        if (playerAvatarGroupRef.current) {
          playerAvatarGroupRef.current.position.set(playerPosRef.current.x, 0, playerPosRef.current.z);
          playerAvatarGroupRef.current.rotation.y = cameraYawRef.current;
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

        // 9E. Proximity Detection (Nihomi Contextual POIs)
        const nearbyPOI = interactionLayerRef.current.checkProximity(playerPosRef.current);
        setActivePOI(nearbyPOI);

        if (nearbyPOI && nearbyPOI.category === 'conbini' && !hasTriggeredChimeRef.current) {
          spatialAudio.playConbiniDoorChime();
          hasTriggeredChimeRef.current = true;
        } else if (!nearbyPOI) {
          hasTriggeredChimeRef.current = false;
        }
      }

      // Render through Composer
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
      providerManager.handleResize(camera, renderer);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      providerManager.dispose();
      simulation.dispose();
      renderer.dispose();
      composerRef.current = null;
    };
  }, [cameraMode, isAudioMuted]);

  // Open Japan Geo Engine: Switch Provider
  const handleSwitchGeoProvider = async (type: GeoProviderType) => {
    if (worldProviderManagerRef.current) {
      await worldProviderManagerRef.current.switchProvider(type);
      setGeoStatus(worldProviderManagerRef.current.getStatus());
    }
  };

  // Open Japan Geo Engine: Cinematic Camera Scale Transition
  const handleTriggerCameraPreset = (preset: CameraViewPreset) => {
    setCurrentCameraPreset(preset);
    if (worldProviderManagerRef.current) {
      worldProviderManagerRef.current.triggerCameraPreset(
        preset,
        playerPosRef.current,
        cameraPitchRef.current,
        cameraYawRef.current
      );
    }
  };

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
        {/* Real World Geographic Foundation & Active World Node Pill */}
        <div className="flex items-center space-x-3 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-cyan-500/30 shadow-2xl pointer-events-auto">
          <div
            className={`w-3 h-3 rounded-full ${
              geoStatus.providerType === 'plateau_3d_tiles'
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-cyan-400'
            }`}
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                OPEN JAPAN GEO FOUNDATION
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  geoStatus.providerType === 'plateau_3d_tiles'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}
              >
                {geoStatus.providerType === 'plateau_3d_tiles' ? 'PLATEAU 3D (国土交通省)' : 'OPENSTREETMAP / OVERTURE'}
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-0.5">
              <p className="text-sm font-semibold text-white">{currentNode.nameJa}</p>
              <button
                onClick={() => setIsWorldMapOpen(true)}
                className="flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600 text-[11px] font-bold text-cyan-200 border border-cyan-400/40 transition-all shadow"
              >
                <Navigation className="w-3 h-3" />
                <span>路線図・移動 (World Map)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Tokyo Solar Time, Atmosphere & Controls */}
        <div className="flex items-center space-x-2.5 pointer-events-auto">
          {/* Suica IC Card Balance Pill */}
          <button
            onClick={() => setIsTicketMachineOpen(true)}
            className="flex items-center space-x-1.5 bg-emerald-950/80 hover:bg-emerald-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold shadow-lg transition-colors"
            title="Click to recharge Suica IC Card"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Suica: ¥{suicaBalance.toLocaleString()}</span>
          </button>

          {/* Dynamic Tokyo Time Pill */}
          <div className="flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-mono text-slate-200">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-white">{liveTokyoTime}</span>
          </div>

          {/* Dev Time-of-Day Quick Selector */}
          <div className="hidden md:flex items-center bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700 p-1 space-x-1 text-[11px] font-medium text-slate-300">
            <button
              onClick={() => handleTimePresetChange('auto_jst')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                timePreset === 'auto_jst' ? 'bg-cyan-600 text-white font-bold' : 'hover:bg-slate-800'
              }`}
            >
              Auto JST
            </button>
            <button
              onClick={() => handleTimePresetChange('day')}
              className={`px-2 py-1 rounded-lg transition-all ${
                timePreset === 'day' ? 'bg-cyan-600 text-white font-bold' : 'hover:bg-slate-800'
              }`}
            >
              <Sun className="w-3 h-3 inline mr-1" />Day
            </button>
            <button
              onClick={() => handleTimePresetChange('golden_hour')}
              className={`px-2 py-1 rounded-lg transition-all ${
                timePreset === 'golden_hour' ? 'bg-amber-600 text-white font-bold' : 'hover:bg-slate-800'
              }`}
            >
              <CloudSun className="w-3 h-3 inline mr-1" />Sunset
            </button>
            <button
              onClick={() => handleTimePresetChange('night')}
              className={`px-2 py-1 rounded-lg transition-all ${
                timePreset === 'night' ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-800'
              }`}
            >
              <Moon className="w-3 h-3 inline mr-1" />Night
            </button>
          </div>

          {/* Audio Toggle */}
          <button
            onClick={() => {
              const nextMuted = !isAudioMuted;
              setIsAudioMuted(nextMuted);
              spatialAudio.setMuted(nextMuted);
            }}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md transition-colors shadow-lg"
            title={isAudioMuted ? 'Unmute Tokyo Ambience' : 'Mute Audio'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Perspective Toggle */}
          <button
            onClick={() => setCameraMode((prev) => (prev === 'first_person' ? 'third_person' : 'first_person'))}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md transition-colors shadow-lg text-xs font-medium"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>{cameraMode === 'first_person' ? '1st Person' : '3rd Person'}</span>
          </button>

          {/* Cinematic Camera Flight Scale Selector */}
          <div className="flex items-center bg-slate-900/80 p-0.5 rounded-xl border border-slate-700 backdrop-blur-md">
            <button
              onClick={() => handleTriggerCameraPreset('aerial_tokyo')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentCameraPreset === 'aerial_tokyo'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tokyo Aerial Overview (260m)"
            >
              <Plane className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tokyo 260m</span>
            </button>
            <button
              onClick={() => handleTriggerCameraPreset('district_shibuya')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentCameraPreset === 'district_shibuya'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Shibuya District View (65m)"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Shibuya 65m</span>
            </button>
            <button
              onClick={() => handleTriggerCameraPreset('street_scramble')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentCameraPreset === 'street_scramble'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Street Level Scramble Crossing (1.62m)"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Street 1.62m</span>
            </button>
          </div>

          {/* Open Japan Geo Console Button */}
          <button
            onClick={() => setIsOpenGeoModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-emerald-500/40 backdrop-blur-md transition-colors shadow-lg text-xs font-semibold"
            title="Open Japan Geo Engine Console"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 font-bold hidden sm:inline">PLATEAU 3D</span>
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
      {activePOI && !dialogue.isOpen && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto z-20">
          <button
            onClick={handleTriggerInteraction}
            className="flex items-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.7)] border border-emerald-300/40 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="px-2 py-0.5 rounded-md bg-white/20 text-xs font-mono font-black">E</span>
            <span>{activePOI.promptText}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* DIALOGUE & LEARNING LOOP MODAL */}
      {dialogue.isOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center p-6 z-30 pointer-events-auto">
          <div className="w-full max-w-2xl bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-300">
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

            <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-2">
              <p className="text-xl font-bold text-white tracking-wide">{dialogue.npcJapaneseText}</p>
              <p className="text-xs font-medium text-cyan-300 font-mono">{dialogue.npcRomaji}</p>
              <p className="text-xs text-slate-400">{dialogue.npcEnglish}</p>
            </div>

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

      {/* WORLD GRAPH & INTER-DISTRICT TRANSIT ROUTE MAP MODAL */}
      {isWorldMapOpen && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-40 pointer-events-auto">
          <div className="w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg border border-cyan-500/30">
                  🗺️
                </div>
                <div>
                  <h3 className="text-base font-black text-white">日本全国ワールドグラフ (Japan World Graph)</h3>
                  <p className="text-[11px] text-slate-400">Select City, District, or Train Route to travel continuously</p>
                </div>
              </div>
              <button
                onClick={() => setIsWorldMapOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Region / Node List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
              {Object.values(WORLD_NODES).map((node) => {
                const isCurrent = node.id === currentNode.id;
                return (
                  <div
                    key={node.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300">
                        {node.nodeType.replace('_', ' ').toUpperCase()}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          CURRENT LOCATION
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white mt-2">{node.nameJa}</h4>
                    <p className="text-xs text-slate-300 font-medium">{node.nameEn}</p>
                    <p className="text-[11px] text-emerald-400/90 font-bengali mt-0.5">{node.nameBn}</p>

                    <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {node.pois.length} POIs • {node.transitRoutes.length} Routes
                      </span>
                      {!isCurrent && (
                        <button
                          onClick={() => {
                            worldGraphManager.setNodeDirect(node.id);
                            setIsWorldMapOpen(false);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center space-x-1"
                        >
                          <span>Travel (移動)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current Active Routes Drawer */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Direct Transit Connections from {currentNode.nameJa}:
              </h5>
              <div className="space-y-2">
                {currentNode.transitRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{route.routeLineNameJa}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {route.routeLineNameEn} • Fare: ¥{route.fareYen} • {route.travelTimeMinutes} min
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsWorldMapOpen(false);
                        handleStartTransit(route);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                    >
                      Board ({route.transitMode.toUpperCase()})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RAILWAY TICKET MACHINE MODAL */}
      <TicketVendingMachineModal
        isOpen={isTicketMachineOpen}
        onClose={() => setIsTicketMachineOpen(false)}
        onSuccess={(newBal) => setSuicaBalance(newBal)}
      />

      {/* TRAIN RIDE TRANSIT SIMULATION MODAL */}
      <TrainRideTransitModal
        isOpen={trainRideState.isOpen}
        lineNameJa={trainRideState.lineJa}
        lineNameEn={trainRideState.lineEn}
        destinationJa={trainRideState.destJa}
        travelMinutes={trainRideState.travelMin}
        onComplete={handleCompleteTrainRide}
      />

      {/* AIRPORT IMMIGRATION SIMULATION MODAL */}
      <AirportImmigrationSim
        isOpen={isAirportSimOpen}
        onClose={() => setIsAirportSimOpen(false)}
        onComplete={({ coins, xp }) => {
          onAddCoins(coins);
          setXp((p) => p + xp);
          setQuestObjective('Immigration passed! You have legally entered Japan.');
        }}
      />

      {/* TOKYO TAXI TRANSIT SIMULATION MODAL */}
      <TaxiTransitSim
        isOpen={isTaxiSimOpen}
        onClose={() => setIsTaxiSimOpen(false)}
        onArrival={() => {
          worldGraphManager.setNodeDirect('node_shibuya_scramble');
        }}
      />

      {/* OPEN JAPAN GEO ENGINE CONSOLE MODAL */}
      {isOpenGeoModalOpen && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-6 z-40 pointer-events-auto">
          <div className="w-full max-w-xl bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <Layers className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">オープンジャパン地理基盤 (Open Japan Geo Engine)</h3>
                  <p className="text-[11px] text-slate-400">Zero-API-Bill Open Geographic Foundation</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpenGeoModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
              {/* Cost & License Badges */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">API Billing Cost</span>
                  <p className="text-sm font-black text-emerald-300">$0.00 / month</p>
                  <p className="text-[10px] text-emerald-400/80 font-mono">Zero External API Billing Risk</p>
                </div>
                <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Open Data License</span>
                  <p className="text-xs font-bold text-cyan-200">CC BY 4.0 / ODbL</p>
                  <p className="text-[10px] text-cyan-400/80 font-mono">Government of Japan Open Data</p>
                </div>
              </div>

              {/* Active Provider Status */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Foundation:</span>
                  <span className="text-emerald-400 font-bold">{geoStatus.providerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Geographic Anchor:</span>
                  <span className="text-slate-300">Shibuya Scramble (35.6595° N, 139.7005° E)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Layers:</span>
                  <span className="text-cyan-400">{geoStatus.activeLayers.join(' • ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Loaded 3D Tiles:</span>
                  <span className="text-amber-400 font-bold">{geoStatus.loadedTilesCount} tiles loaded</span>
                </div>
              </div>

              {/* Provider Selection */}
              <div className="space-y-2 pt-1">
                <label className="font-semibold text-slate-200 text-xs">Switch Geographic Provider:</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleSwitchGeoProvider('plateau_3d_tiles')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      geoStatus.providerType === 'plateau_3d_tiles'
                        ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-lg'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <p className="text-xs font-bold text-emerald-400">Project PLATEAU</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">MLIT Japan 3D Tiles</p>
                  </button>

                  <button
                    onClick={() => handleSwitchGeoProvider('open_geo_osm')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      geoStatus.providerType === 'open_geo_osm'
                        ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-lg'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <p className="text-xs font-bold text-cyan-400">OpenStreetMap</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Roads & Rail Network</p>
                  </button>

                  <button
                    onClick={() => handleSwitchGeoProvider('photographic_fallback')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      geoStatus.providerType === 'photographic_fallback'
                        ? 'bg-amber-950/60 border-amber-400 text-white shadow-lg'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <p className="text-xs font-bold text-amber-400">360° Panorama</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Photographic Dome</p>
                  </button>
                </div>
              </div>

              {/* Camera Flyover Shortcuts */}
              <div className="space-y-2 pt-1">
                <label className="font-semibold text-slate-200 text-xs">Cinematic Geographic Flyovers:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      handleTriggerCameraPreset('aerial_tokyo');
                      setIsOpenGeoModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-center transition-colors"
                  >
                    <span className="text-xs font-bold text-white block">Tokyo Aerial</span>
                    <span className="text-[10px] text-slate-400">260m Altitude</span>
                  </button>
                  <button
                    onClick={() => {
                      handleTriggerCameraPreset('district_shibuya');
                      setIsOpenGeoModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-center transition-colors"
                  >
                    <span className="text-xs font-bold text-white block">Shibuya District</span>
                    <span className="text-[10px] text-slate-400">65m Altitude</span>
                  </button>
                  <button
                    onClick={() => {
                      handleTriggerCameraPreset('street_scramble');
                      setIsOpenGeoModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-center transition-colors"
                  >
                    <span className="text-xs font-bold text-white block">Street Level</span>
                    <span className="text-[10px] text-slate-400">1.62m Eye Height</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono">
                Attribution: {geoStatus.attributions.join(' • ')}
              </span>
              <button
                onClick={() => setIsOpenGeoModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OPEN DATA ATTRIBUTION & ZERO-COST STATUS BAR */}
      <div className="absolute bottom-16 left-4 flex items-center space-x-2 pointer-events-none z-20">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 font-mono flex items-center space-x-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold">PLATEAU 3D</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">{geoStatus.attributions[0]}</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-300 font-semibold">{geoStatus.costModel}</span>
        </div>
      </div>

      {/* BOTTOM CONTROLS & STATUS BAR */}
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
