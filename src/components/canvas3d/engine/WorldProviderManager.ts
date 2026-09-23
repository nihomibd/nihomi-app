// src/components/canvas3d/engine/WorldProviderManager.ts
// NIHOMI OPEN JAPAN GEO ENGINE — MASTER PROVIDER MANAGER & CINEMATIC CAMERA SYSTEM
// Provider-agnostic coordinator for Project PLATEAU, OpenStreetMap, and camera flight paths

import * as THREE from 'three';
import { JAPAN_GEO_ANCHORS, GeodeticCoordinate } from './GeoCoordinates';
import {
  IWorldProvider,
  WorldProviderStatus,
  GeoProviderType,
  CameraViewPreset
} from './providers/WorldProviderAdapter';
import { Plateau3DTilesProvider } from './providers/Plateau3DTilesProvider';
import { OpenGeoProvider } from './providers/OpenGeoProvider';
import { PhotographicFallbackProvider } from './providers/PhotographicFallbackProvider';

export interface CameraPresetConfig {
  position: THREE.Vector3;
  pitch: number;
  yaw: number;
  labelEn: string;
  labelJa: string;
}

export const CAMERA_VIEW_PRESETS: Record<CameraViewPreset, CameraPresetConfig> = {
  aerial_tokyo: {
    position: new THREE.Vector3(0, 260, 280),
    pitch: -0.85, // Looking down at Tokyo skyline
    yaw: Math.PI,
    labelEn: 'Tokyo Aerial Overview (260m)',
    labelJa: '東京上空 俯瞰ビュー (260m)'
  },
  district_shibuya: {
    position: new THREE.Vector3(0, 65, 80),
    pitch: -0.45, // Angled district perspective
    yaw: Math.PI,
    labelEn: 'Shibuya District View (65m)',
    labelJa: '渋谷地区 全景ビュー (65m)'
  },
  street_scramble: {
    position: new THREE.Vector3(0, 1.62, 14),
    pitch: 0.0,   // Eye level
    yaw: Math.PI,
    labelEn: 'Scramble Street Level (1.62m)',
    labelJa: 'スクランブル交差点 ストリート (1.62m)'
  }
};

export class WorldProviderManager {
  public group: THREE.Group;
  private currentProvider: IWorldProvider;
  private osmLayer: OpenGeoProvider | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private anchor: GeodeticCoordinate;
  private onStatusChange?: (status: WorldProviderStatus) => void;

  // Camera Flight Transition State
  private isTransitioningCamera: boolean = false;
  private cameraStartPos: THREE.Vector3 = new THREE.Vector3();
  private cameraTargetPos: THREE.Vector3 = new THREE.Vector3();
  private cameraStartPitch: number = 0;
  private cameraTargetPitch: number = 0;
  private cameraStartYaw: number = 0;
  private cameraTargetYaw: number = 0;
  private transitionStartTime: number = 0;
  private transitionDuration: number = 2.2; // 2.2s cinematic ease
  private currentPreset: CameraViewPreset = 'street_scramble';

  constructor(
    anchor: GeodeticCoordinate = JAPAN_GEO_ANCHORS.SHIBUYA_SCRAMBLE,
    initialProviderType: GeoProviderType = 'plateau_3d_tiles',
    onStatusChange?: (status: WorldProviderStatus) => void
  ) {
    this.group = new THREE.Group();
    this.group.name = 'Nihomi_OpenJapanGeo_Manager';
    this.anchor = anchor;
    this.onStatusChange = onStatusChange;

    // Instantiate Default Primary Provider (Project PLATEAU)
    this.currentProvider = this.createProvider(initialProviderType);
  }

  private createProvider(type: GeoProviderType): IWorldProvider {
    switch (type) {
      case 'plateau_3d_tiles':
        return new Plateau3DTilesProvider(this.anchor, (status) => this.onStatusChange?.(status));
      case 'open_geo_osm':
        return new OpenGeoProvider(this.anchor, (status) => this.onStatusChange?.(status));
      case 'photographic_fallback':
      default:
        return new PhotographicFallbackProvider(this.anchor, (status) => this.onStatusChange?.(status));
    }
  }

  public async initialize(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ): Promise<void> {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    scene.add(this.group);
    this.group.add(this.currentProvider.group);

    // Initialize Active Provider
    await this.currentProvider.initialize(scene, camera, renderer);

    // Overlay OSM Roads & Railway Corridors Alongside PLATEAU 3D Tiles for Full Urban Fidelity
    if (this.currentProvider.type === 'plateau_3d_tiles') {
      const osm = new OpenGeoProvider(this.anchor);
      await osm.initialize(scene, camera, renderer);
      this.group.add(osm.group);
      this.osmLayer = osm;
    }
  }

  public async switchProvider(type: GeoProviderType): Promise<void> {
    if (!this.scene || !this.camera || !this.renderer) return;
    if (this.currentProvider.type === type) return;

    // Dispose old provider
    this.group.remove(this.currentProvider.group);
    this.currentProvider.dispose();

    if (this.osmLayer) {
      this.group.remove(this.osmLayer.group);
      this.osmLayer.dispose();
      this.osmLayer = null;
    }

    // Instantiate and initialize new provider
    this.currentProvider = this.createProvider(type);
    this.group.add(this.currentProvider.group);
    await this.currentProvider.initialize(this.scene, this.camera, this.renderer);

    if (type === 'plateau_3d_tiles') {
      const osm = new OpenGeoProvider(this.anchor);
      await osm.initialize(this.scene, this.camera, this.renderer);
      this.group.add(osm.group);
      this.osmLayer = osm;
    }

    this.onStatusChange?.(this.getStatus());
  }

  public update(camera: THREE.PerspectiveCamera, now: number): void {
    this.currentProvider.update(camera, now);
    if (this.osmLayer) {
      this.osmLayer.update(camera, now);
    }
  }

  public handleResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void {
    this.currentProvider.handleResize?.(camera, renderer);
  }

  public getStatus(): WorldProviderStatus {
    return this.currentProvider.getStatus();
  }

  public getCurrentPreset(): CameraViewPreset {
    return this.currentPreset;
  }

  /**
   * Smoothly animates camera along the requested geographic scale:
   * aerial_tokyo (260m) ↔ district_shibuya (65m) ↔ street_scramble (1.62m)
   */
  public triggerCameraPreset(
    preset: CameraViewPreset,
    currentPos: THREE.Vector3,
    currentPitch: number,
    currentYaw: number
  ): void {
    const target = CAMERA_VIEW_PRESETS[preset];
    if (!target) return;

    this.currentPreset = preset;
    this.isTransitioningCamera = true;
    this.transitionStartTime = performance.now();
    this.cameraStartPos.copy(currentPos);
    this.cameraTargetPos.copy(target.position);
    this.cameraStartPitch = currentPitch;
    this.cameraTargetPitch = target.pitch;
    this.cameraStartYaw = currentYaw;
    this.cameraTargetYaw = target.yaw;
  }

  /**
   * Updates camera flight kinematics. Returns updated position, pitch, and yaw if in flight.
   */
  public stepCameraFlight(now: number): {
    inFlight: boolean;
    pos?: THREE.Vector3;
    pitch?: number;
    yaw?: number;
  } {
    if (!this.isTransitioningCamera) {
      return { inFlight: false };
    }

    const elapsed = (now - this.transitionStartTime) / 1000;
    const t = Math.min(1.0, elapsed / this.transitionDuration);

    // Smooth cubic easeInOut curve
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const currentPos = new THREE.Vector3().lerpVectors(this.cameraStartPos, this.cameraTargetPos, ease);
    const currentPitch = THREE.MathUtils.lerp(this.cameraStartPitch, this.cameraTargetPitch, ease);
    const currentYaw = THREE.MathUtils.lerp(this.cameraStartYaw, this.cameraTargetYaw, ease);

    if (t >= 1.0) {
      this.isTransitioningCamera = false;
    }

    return {
      inFlight: true,
      pos: currentPos,
      pitch: currentPitch,
      yaw: currentYaw
    };
  }

  public dispose(): void {
    if (this.currentProvider) {
      this.currentProvider.dispose();
    }
    if (this.osmLayer) {
      this.osmLayer.dispose();
      this.osmLayer = null;
    }
    this.group.clear();
  }
}
