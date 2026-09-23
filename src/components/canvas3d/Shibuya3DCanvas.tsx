// src/components/canvas3d/Shibuya3DCanvas.tsx
// NIHOMI WORLD™ V3.2 — Ultra-Stable 3D/360° Street View Panoramic Canvas Engine
// Zero-Flicker Architecture, Preloaded Panorama, Memory Leak Elimination & Direct DOM Pin Projections

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Compass,
  Store,
  UtensilsCrossed,
  Train,
  GraduationCap,
  MapPin,
  Lock,
  RotateCcw,
  Sparkles,
  Zap,
  Eye,
  Maximize2
} from 'lucide-react';
import { ShibuyaHotspot } from '../../data/shibuyaWorldData';
import { worldAudio } from '../../lib/worldAudio';

export interface HotspotScreenPosition {
  id: string;
  x: number;
  y: number;
  visible: boolean;
  scale: number;
}

interface Shibuya3DCanvasProps {
  hotspots: ShibuyaHotspot[];
  selectedHotspotId: string | null;
  onSelectHotspot: (hotspot: ShibuyaHotspot) => void;
  unlockedHotspots?: string[];
  userPlanId?: string;
  missionComplete?: boolean;
}

// Fixed spherical coordinates (yaw: -180 to +180 deg, pitch: -85 to +85 deg)
const HOTSPOT_SPHERICAL_COORDS: Record<string, { yaw: number; pitch: number }> = {
  'spot-crossing': { yaw: 0, pitch: -12 },
  'spot-conbini': { yaw: -50, pitch: -4 },
  'spot-restaurant': { yaw: 55, pitch: -5 },
  'spot-station': { yaw: 22, pitch: -22 },
  'spot-school': { yaw: -25, pitch: 18 },
};

export const Shibuya3DCanvas: React.FC<Shibuya3DCanvasProps> = ({
  hotspots,
  selectedHotspotId,
  onSelectHotspot,
  unlockedHotspots = ['spot-crossing', 'spot-conbini'],
  userPlanId = 'free',
  missionComplete = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  // Mode: 3D WebGL vs High-Res Static Panorama
  const [viewMode, setViewMode] = useState<'3d' | 'static'>('3d');
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // References for Three.js instances to avoid re-creation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Spherical camera rotation angles (lon: horizontal yaw, lat: vertical pitch)
  const lonRef = useRef<number>(0);
  const latRef = useRef<number>(0);
  const targetLonRef = useRef<number>(0);
  const targetLatRef = useRef<number>(0);

  // Pointer drag state
  const isPointerDownRef = useRef(false);
  const pointerStartRef = useRef<{ x: number; y: number; lon: number; lat: number }>({
    x: 0,
    y: 0,
    lon: 0,
    lat: 0
  });

  // Touch pinch distance
  const touchDistanceRef = useRef<number | null>(null);

  // Direct DOM pin references to update positions without React re-render overhead
  const pinDOMElementsRef = useRef<Record<string, HTMLDivElement | null>>({});

  // Up-to-date props refs for the render loop
  const hotspotsRef = useRef(hotspots);
  hotspotsRef.current = hotspots;

  const onSelectRef = useRef(onSelectHotspot);
  onSelectRef.current = onSelectHotspot;

  // Icon Resolver
  const renderCategoryIcon = (category: ShibuyaHotspot['category']) => {
    switch (category) {
      case 'crossing':
        return <Compass className="w-4 h-4 text-amber-400" />;
      case 'conbini':
        return <Store className="w-4 h-4 text-emerald-400" />;
      case 'restaurant':
        return <UtensilsCrossed className="w-4 h-4 text-orange-400" />;
      case 'station':
        return <Train className="w-4 h-4 text-cyan-400" />;
      case 'school':
        return <GraduationCap className="w-4 h-4 text-pink-400" />;
      default:
        return <MapPin className="w-4 h-4 text-indigo-400" />;
    }
  };

  // Reset view to center crossing
  const handleResetOrientation = useCallback(() => {
    targetLonRef.current = 0;
    targetLatRef.current = 0;
    if (cameraRef.current) {
      cameraRef.current.fov = 72;
      cameraRef.current.updateProjectionMatrix();
    }
    worldAudio.playTokyoChime();
  }, []);

  // ---------------------------------------------------------------------------
  // WEBGL INITIALIZATION EFFECT (MOUNTS ONCE ONLY)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (viewMode !== '3d') return;

    const mount = canvasMountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // 1. SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(72, width / height, 0.1, 1200);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    // 3. RENDERER
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';

      mount.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (err) {
      console.warn('[Shibuya3DCanvas] WebGL init failed, switching to static panorama:', err);
      setViewMode('static');
      return;
    }

    // 4. PANORAMIC SPHERE
    const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
    sphereGeometry.scale(-1, 1, 1); // Invert so inside is visible

    // Preload texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/assets/shibuya-crossing.jpg',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        const sphereMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          color: 0xffffff
        });
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphereMesh);
        sphereMeshRef.current = sphereMesh;
        setIsTextureLoaded(true);
      },
      undefined,
      (err) => {
        console.warn('[Shibuya3DCanvas] Texture failed, using fallback:', err);
        setViewMode('static');
      }
    );

    // 5. VOLUMETRIC NIGHT EMBERS (Subtle Tokyo Cyber Atmosphere)
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const r = 80 + Math.random() * 320;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const isCyan = Math.random() > 0.45;
      colors[i * 3] = isCyan ? 0.15 : 0.98;
      colors[i * 3 + 1] = isCyan ? 0.85 : 0.65;
      colors[i * 3 + 2] = isCyan ? 0.95 : 0.2;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 2.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 6. RENDER LOOP (Direct DOM Pin Updates — 0 React Re-renders!)
    const tempVec = new THREE.Vector3();
    const camDir = new THREE.Vector3();

    const renderLoop = () => {
      animFrameRef.current = requestAnimationFrame(renderLoop);

      // Smooth camera interpolation
      latRef.current += (targetLatRef.current - latRef.current) * 0.12;
      lonRef.current += (targetLonRef.current - lonRef.current) * 0.12;
      latRef.current = Math.max(-75, Math.min(75, latRef.current));

      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetX, targetY, targetZ);
      camera.getWorldDirection(camDir);

      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0003;
      }

      // Update 3D projected pin positions directly in DOM
      const curMount = canvasMountRef.current;
      if (curMount) {
        const w = curMount.clientWidth || window.innerWidth;
        const h = curMount.clientHeight || window.innerHeight;

        hotspotsRef.current.forEach((spot) => {
          const domPin = pinDOMElementsRef.current[spot.id];
          if (!domPin) return;

          const spherical = HOTSPOT_SPHERICAL_COORDS[spot.id] || {
            yaw: (spot.coords.x - 50) * 1.8,
            pitch: (50 - spot.coords.y) * 0.6
          };

          const sPhi = THREE.MathUtils.degToRad(90 - spherical.pitch);
          const sTheta = THREE.MathUtils.degToRad(spherical.yaw);
          const radius = 420;

          tempVec.set(
            radius * Math.sin(sPhi) * Math.cos(sTheta),
            radius * Math.cos(sPhi),
            radius * Math.sin(sPhi) * Math.sin(sTheta)
          );

          // Facing dot product
          const norm = tempVec.clone().normalize();
          const dot = norm.dot(camDir);
          const isFacing = dot > 0.15;

          tempVec.project(camera);

          const screenX = (tempVec.x * 0.5 + 0.5) * w;
          const screenY = (-tempVec.y * 0.5 + 0.5) * h;
          const scale = THREE.MathUtils.clamp(dot, 0.75, 1.05);

          if (isFacing && tempVec.z < 1) {
            domPin.style.opacity = '1';
            domPin.style.pointerEvents = 'auto';
            domPin.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%) scale(${scale})`;
          } else {
            domPin.style.opacity = '0';
            domPin.style.pointerEvents = 'none';
          }
        });
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    // 7. WINDOW RESIZE HANDLER
    const handleResize = () => {
      if (!canvasMountRef.current || !cameraRef.current || !rendererRef.current) return;
      const newW = canvasMountRef.current.clientWidth;
      const newH = canvasMountRef.current.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // 8. CONTEXT LOSS SAFETY
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('[Shibuya3DCanvas] WebGL context lost. Gracefully falling back to static panorama.');
      setViewMode('static');
    };

    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    // CLEANUP
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.removeEventListener('webglcontextlost', handleContextLost);
        try {
          if (mount.contains(rendererRef.current.domElement)) {
            mount.removeChild(rendererRef.current.domElement);
          }
          rendererRef.current.dispose();
        } catch {}
      }
      sphereGeometry.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [viewMode]);

  // ---------------------------------------------------------------------------
  // INTERACTION HANDLERS (MOUSE & TOUCH DRAG)
  // ---------------------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    setIsInteracting(true);
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      lon: targetLonRef.current,
      lat: targetLatRef.current
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;

    targetLonRef.current = pointerStartRef.current.lon - deltaX * 0.18;
    targetLatRef.current = pointerStartRef.current.lat + deltaY * 0.18;
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
    setIsInteracting(false);
  };

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!cameraRef.current) return;
    const newFov = cameraRef.current.fov + e.deltaY * 0.04;
    cameraRef.current.fov = THREE.MathUtils.clamp(newFov, 45, 85);
    cameraRef.current.updateProjectionMatrix();
  };

  // Touch Pinch Zoom
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && cameraRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);

      if (touchDistanceRef.current !== null) {
        const delta = touchDistanceRef.current - dist;
        const newFov = cameraRef.current.fov + delta * 0.15;
        cameraRef.current.fov = THREE.MathUtils.clamp(newFov, 45, 85);
        cameraRef.current.updateProjectionMatrix();
      }
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    touchDistanceRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        // Guaranteed rock-solid background fallback: NEVER turns black under any circumstances
        backgroundImage: `url('/assets/shibuya-crossing.jpg')`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        touchAction: 'none'
      }}
      className="absolute inset-0 z-0 overflow-hidden select-none cursor-grab active:cursor-grabbing bg-[#090912]"
    >
      {/* 1. Three.js Canvas Mount Layer */}
      {viewMode === '3d' && (
        <div
          ref={canvasMountRef}
          className={`absolute inset-0 transition-opacity duration-700 ${
            isTextureLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* 2. Ambient Cinema Vignette Overlay (Enhanced Contrast & Depth) */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#06060c]/40 to-[#06060c]/80 pointer-events-none z-10" />

      {/* 3. TACTILE 3D SPATIAL LOCATION PINS OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {hotspots.map((hotspot) => {
          const isSelected = selectedHotspotId === hotspot.id;
          const isIzakaya = hotspot.id === 'spot-restaurant';
          const isSchool = hotspot.id === 'spot-school';
          const isLocked = isIzakaya && !unlockedHotspots.includes('spot-restaurant') && (userPlanId === 'free' || userPlanId === 'starter');
          const isProRequired = isSchool && userPlanId === 'free';

          // For static mode fallback, position using predefined coords
          const fallbackStyle: React.CSSProperties = viewMode === 'static' ? {
            left: `${hotspot.coords.x}%`,
            top: `${hotspot.coords.y}%`,
            transform: 'translate(-50%, -50%)',
            opacity: 1,
            pointerEvents: 'auto'
          } : {
            left: 0,
            top: 0,
            opacity: 0,
            pointerEvents: 'none',
            willChange: 'transform, opacity'
          };

          return (
            <div
              key={hotspot.id}
              ref={(el) => {
                pinDOMElementsRef.current[hotspot.id] = el;
              }}
              style={fallbackStyle}
              className="absolute transition-transform duration-75"
            >
              {/* Ultra-Tactile Interactive Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  worldAudio.playTokyoChime();
                  onSelectRef.current(hotspot);
                }}
                className={`group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl backdrop-blur-xl transition-all duration-200 active:scale-90 active:translate-y-0.5 shadow-2xl ${
                  isSelected
                    ? 'bg-zinc-900/95 border-2 border-amber-400 ring-4 ring-amber-400/25 shadow-amber-500/40 scale-105'
                    : 'bg-zinc-950/90 hover:bg-zinc-900 border border-white/20 hover:border-amber-400/80 shadow-black/90 hover:scale-105'
                }`}
                title={`Click to open ${hotspot.nameJa} (${hotspot.nameBn})`}
              >
                {/* Radar Pulse Effect */}
                <span className="absolute -inset-1 rounded-2xl bg-amber-400/20 animate-ping pointer-events-none opacity-40 group-hover:opacity-75" />

                {/* Hotspot Category Icon */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shadow-md ${
                    isSelected
                      ? 'bg-amber-400/25 text-amber-300'
                      : 'bg-white/10 group-hover:bg-amber-400/20'
                  }`}
                >
                  {renderCategoryIcon(hotspot.category)}
                </div>

                {/* Hotspot Titles & Badges */}
                <div className="text-left pr-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-white group-hover:text-amber-300 transition-colors">
                      {hotspot.nameJa}
                    </span>
                    {hotspot.nearbyJob && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/25 text-emerald-300 border border-emerald-500/40">
                        {hotspot.nearbyJob.hourlyWage.split('/')[0]}
                      </span>
                    )}
                    {isLocked && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/25 text-amber-300 border border-amber-500/40 flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> 20 🪙
                      </span>
                    )}
                    {isProRequired && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-indigo-500/25 text-indigo-300 border border-indigo-500/40">
                        PRO
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-semibold block leading-tight mt-0.5">
                    {hotspot.nameBn}
                  </span>
                </div>

                {/* Recommended Objective Badges */}
                {!missionComplete && hotspot.id === 'spot-crossing' && (
                  <span className="absolute -top-3 -right-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg animate-bounce">
                    START HERE
                  </span>
                )}
                {missionComplete && hotspot.id === 'spot-conbini' && (
                  <span className="absolute -top-3 -right-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg animate-pulse">
                    LEARN KEIGO
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* 4. TACTILE SPATIAL VIEW CONTROLS (BOTTOM LEFT) */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2">
        {/* Reset View Button */}
        <button
          onClick={handleResetOrientation}
          className="p-2.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-white/15 hover:border-amber-400/50 text-zinc-300 hover:text-white backdrop-blur-md shadow-xl active:scale-95 transition-all flex items-center gap-1.5 text-xs font-semibold"
          title="Reset View to Shibuya Crossing Center"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Reset View</span>
        </button>

        {/* View Mode Switcher (3D WebGL vs Stable Static) */}
        <button
          onClick={() => {
            setViewMode(prev => (prev === '3d' ? 'static' : '3d'));
            worldAudio.playTokyoChime();
          }}
          className="p-2.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-white/15 hover:border-cyan-400/50 text-zinc-300 hover:text-white backdrop-blur-md shadow-xl active:scale-95 transition-all flex items-center gap-1.5 text-xs font-semibold"
          title={viewMode === '3d' ? 'Switch to Static Panorama Mode' : 'Switch to 3D WebGL Mode'}
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>{viewMode === '3d' ? '3D WebGL' : 'Static Mode'}</span>
        </button>

        {/* Interaction Drag Indicator */}
        {!isInteracting && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/60 border border-white/10 text-[11px] text-zinc-400 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Drag anywhere to look around Tokyo 360°</span>
          </div>
        )}
      </div>
    </div>
  );
};
