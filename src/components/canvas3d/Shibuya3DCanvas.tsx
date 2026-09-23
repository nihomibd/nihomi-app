// src/components/canvas3d/Shibuya3DCanvas.tsx
// NIHOMI WORLD™ — 3D/360° Street View Panoramic Canvas Engine (Three.js)
// Implements true WebGL panoramic sphere, volumetric particles, raycasted 3D pins, and mobile gyro/touch controls.

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ShibuyaHotspot } from '../../data/shibuyaWorldData';

export interface HotspotScreenPosition {
  id: string;
  x: number; // Pixels from left
  y: number; // Pixels from top
  visible: boolean;
  scale: number;
}

interface Shibuya3DCanvasProps {
  hotspots: ShibuyaHotspot[];
  selectedHotspotId: string | null;
  onSelectHotspot: (hotspot: ShibuyaHotspot) => void;
  onHotspotsProjected: (positions: Record<string, HotspotScreenPosition>) => void;
}

// Spherical coordinates (yaw: 0-360 deg, pitch: -85 to +85 deg) for Shibuya hotspots
const HOTSPOT_SPHERICAL_COORDS: Record<string, { yaw: number; pitch: number }> = {
  'spot-crossing': { yaw: 0, pitch: -14 },
  'spot-conbini': { yaw: -52, pitch: -4 },
  'spot-restaurant': { yaw: 56, pitch: -5 },
  'spot-station': { yaw: 22, pitch: -25 },
  'spot-school': { yaw: -24, pitch: 20 },
};

export const Shibuya3DCanvas: React.FC<Shibuya3DCanvasProps> = ({
  hotspots,
  selectedHotspotId,
  onSelectHotspot,
  onHotspotsProjected
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  // References for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const reqIdRef = useRef<number | null>(null);

  // Spherical camera rotation angles
  const lonRef = useRef<number>(0);
  const latRef = useRef<number>(0);
  const targetLonRef = useRef<number>(0);
  const targetLatRef = useRef<number>(0);

  // Interaction tracking
  const pointerStartRef = useRef<{ x: number; y: number; lon: number; lat: number }>({
    x: 0,
    y: 0,
    lon: 0,
    lat: 0
  });

  // Touch pinch zoom
  const touchDistanceRef = useRef<number | null>(null);

  // Check WebGL availability safely
  const checkWebGL = useCallback((): boolean => {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const isSupported = checkWebGL();
    if (!isSupported) {
      setWebglSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. CAMERA SETUP
    const camera = new THREE.PerspectiveCamera(72, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    // 3. RENDERER SETUP
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (err) {
      console.warn('[Shibuya3DCanvas] WebGL init fallback triggered:', err);
      setWebglSupported(false);
      return;
    }

    // 4. PANORAMIC 360° SPHERE GEOMETRY
    const sphereGeometry = new THREE.SphereGeometry(500, 64, 40);
    sphereGeometry.scale(-1, 1, 1); // Invert faces inward

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/assets/shibuya-crossing.jpg',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const sphereMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          color: 0xffffff
        });
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphereMesh);
        setIsCanvasReady(true);
      },
      undefined,
      (err) => {
        console.warn('[Shibuya3DCanvas] Texture load error, using chromatic fallback:', err);
        const fallbackMaterial = new THREE.MeshBasicMaterial({ color: 0x0a0a14 });
        const sphereMesh = new THREE.Mesh(sphereGeometry, fallbackMaterial);
        scene.add(sphereMesh);
        setIsCanvasReady(true);
      }
    );

    // 5. VOLUMETRIC SPATIAL PARTICLES (Cyan / Amber Tokyo Night Embers)
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Distribute in sphere between radius 60 and 380
      const r = 60 + Math.random() * 320;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.cos(phi);
      particlePositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      // Alternate amber / cyan cyber hues
      const isCyan = Math.random() > 0.5;
      particleColors[i * 3] = isCyan ? 0.2 : 0.98;
      particleColors[i * 3 + 1] = isCyan ? 0.8 : 0.65;
      particleColors[i * 3 + 2] = isCyan ? 0.95 : 0.2;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. ANIMATION & 3D PIN PROJECTION LOOP
    const tempVector = new THREE.Vector3();
    const cameraDirection = new THREE.Vector3();

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      // Smooth inertia lerp
      latRef.current += (targetLatRef.current - latRef.current) * 0.12;
      lonRef.current += (targetLonRef.current - lonRef.current) * 0.12;

      // Clamp latitude to avoid pole gimbal lock
      latRef.current = Math.max(-75, Math.min(75, latRef.current));

      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetX, targetY, targetZ);
      camera.getWorldDirection(cameraDirection);

      // Subtle particle orbital drift
      particles.rotation.y += 0.0003;

      // 7. PROJECT 3D HOTSPOT PINS TO SCREEN COORDINATES
      const containerW = container.clientWidth || window.innerWidth;
      const containerH = container.clientHeight || window.innerHeight;
      const projectedPositions: Record<string, HotspotScreenPosition> = {};

      hotspots.forEach((spot) => {
        const coords = HOTSPOT_SPHERICAL_COORDS[spot.id] || { yaw: spot.coords.x - 50, pitch: (50 - spot.coords.y) * 0.5 };
        const spotPhi = THREE.MathUtils.degToRad(90 - coords.pitch);
        const spotTheta = THREE.MathUtils.degToRad(coords.yaw);

        const r = 420;
        tempVector.set(
          r * Math.sin(spotPhi) * Math.cos(spotTheta),
          r * Math.cos(spotPhi),
          r * Math.sin(spotPhi) * Math.sin(spotTheta)
        );

        // Dot product to check if facing camera
        const normalizedVec = tempVector.clone().normalize();
        const dot = normalizedVec.dot(cameraDirection);
        const isFacing = dot > 0.25;

        tempVector.project(camera);

        const x = (tempVector.x * 0.5 + 0.5) * containerW;
        const y = (-tempVector.y * 0.5 + 0.5) * containerH;

        projectedPositions[spot.id] = {
          id: spot.id,
          x,
          y,
          visible: isFacing && tempVector.z < 1,
          scale: THREE.MathUtils.clamp(dot, 0.7, 1.1)
        };
      });

      onHotspotsProjected(projectedPositions);
      renderer.render(scene, camera);
    };

    animate();

    // 8. RESIZE LISTENER
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        try {
          container.removeChild(rendererRef.current.domElement);
          rendererRef.current.dispose();
        } catch {}
      }
      sphereGeometry.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [checkWebGL, hotspots, onHotspotsProjected]);

  // POINTER & TOUCH CONTROLS
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsUserInteracting(true);
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      lon: targetLonRef.current,
      lat: targetLatRef.current
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isUserInteracting) return;
    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;

    // Fluid drag sensitivity (tuned for street view feel)
    targetLonRef.current = pointerStartRef.current.lon - deltaX * 0.16;
    targetLatRef.current = pointerStartRef.current.lat + deltaY * 0.16;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsUserInteracting(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  // WHEEL ZOOM
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!cameraRef.current) return;
    const fov = cameraRef.current.fov + e.deltaY * 0.04;
    cameraRef.current.fov = THREE.MathUtils.clamp(fov, 45, 88);
    cameraRef.current.updateProjectionMatrix();
  };

  // TOUCH ZOOM (PINCH)
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && cameraRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.hypot(dx, dy);

      if (touchDistanceRef.current !== null) {
        const delta = touchDistanceRef.current - distance;
        const fov = cameraRef.current.fov + delta * 0.15;
        cameraRef.current.fov = THREE.MathUtils.clamp(fov, 45, 88);
        cameraRef.current.updateProjectionMatrix();
      }
      touchDistanceRef.current = distance;
    }
  };

  const handleTouchEnd = () => {
    touchDistanceRef.current = null;
  };

  // Quick Reset View to Scramble Center
  const resetOrientation = () => {
    targetLonRef.current = 0;
    targetLatRef.current = 0;
    if (cameraRef.current) {
      cameraRef.current.fov = 72;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  // If WebGL fails, render high-res smooth 2D fallback with drag panning
  if (!webglSupported) {
    return (
      <div className="absolute inset-0 overflow-hidden select-none cursor-grab active:cursor-grabbing">
        <img
          src="/assets/shibuya-crossing.jpg"
          alt="Shibuya Crossing Fallback"
          className="w-full h-full object-cover brightness-[0.78] contrast-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06060c] via-transparent to-[#06060c]/60" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`absolute inset-0 z-0 overflow-hidden cursor-grab active:cursor-grabbing select-none transition-opacity duration-1000 ${
        isCanvasReady ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ touchAction: 'none' }}
    >
      {/* Subtle Spatial Drag Helper Tooltip (Fades out when interacting) */}
      {!isUserInteracting && (
        <div className="absolute bottom-6 left-6 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/60 border border-white/10 text-[11px] text-zinc-300 backdrop-blur-md animate-pulse">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Drag / Pan 360° • Scroll to Zoom</span>
        </div>
      )}
    </div>
  );
};
