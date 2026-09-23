// src/components/canvas3d/engine/providers/PhotographicFallbackProvider.ts
// NIHOMI OPEN JAPAN GEO ENGINE — 360° PHOTOGRAPHIC REALITY FALLBACK PROVIDER
// Offline-resilient, photographic street panorama fallback

import * as THREE from 'three';
import { JAPAN_GEO_ANCHORS, GeodeticCoordinate } from '../GeoCoordinates';
import { IWorldProvider, WorldProviderStatus, GeoProviderType } from './WorldProviderAdapter';

export class PhotographicFallbackProvider implements IWorldProvider {
  public readonly name = 'Photographic Street Panorama (360° Shibuya)';
  public readonly type: GeoProviderType = 'photographic_fallback';
  public group: THREE.Group;

  private photoDomeMesh: THREE.Mesh | null = null;
  private status: WorldProviderStatus;
  private onStatusChange?: (status: WorldProviderStatus) => void;

  constructor(
    anchor: GeodeticCoordinate = JAPAN_GEO_ANCHORS.SHIBUYA_SCRAMBLE,
    onStatusChange?: (status: WorldProviderStatus) => void
  ) {
    this.group = new THREE.Group();
    this.group.name = 'Photographic_Reality_Fallback_Layer';
    this.onStatusChange = onStatusChange;

    this.status = {
      providerName: this.name,
      providerType: this.type,
      costModel: '$0.00 / month (Free Open Data)',
      license: 'Nihomi Reality Archive (Public Street Photography)',
      isStreaming: true,
      activeLayers: ['shibuya_360_dome'],
      loadedTilesCount: 1,
      attributions: ['Nihomi Street Archive', 'Photographic Shibuya Scramble'],
      anchor
    };
  }

  public async initialize(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ): Promise<void> {
    scene.add(this.group);

    const textureLoader = new THREE.TextureLoader();
    const photoTexture = textureLoader.load('/assets/shibuya-crossing.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
    });

    const sphereGeo = new THREE.SphereGeometry(350, 64, 40);
    sphereGeo.scale(-1, 1, 1);

    const sphereMat = new THREE.MeshBasicMaterial({
      map: photoTexture,
      side: THREE.DoubleSide,
      fog: false,
      toneMapped: false
    });

    const photoDome = new THREE.Mesh(sphereGeo, sphereMat);
    photoDome.position.set(0, 0, 0);
    this.photoDomeMesh = photoDome;
    this.group.add(photoDome);

    this.notifyStatus();
  }

  public update(camera: THREE.PerspectiveCamera, now: number): void {
    if (this.photoDomeMesh) {
      this.photoDomeMesh.position.copy(camera.position);
    }
  }

  public getStatus(): WorldProviderStatus {
    return { ...this.status };
  }

  private notifyStatus(): void {
    this.onStatusChange?.(this.getStatus());
  }

  public dispose(): void {
    this.group.clear();
    this.photoDomeMesh = null;
  }
}
