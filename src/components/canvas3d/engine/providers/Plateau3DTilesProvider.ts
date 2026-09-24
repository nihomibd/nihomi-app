// src/components/canvas3d/engine/providers/Plateau3DTilesProvider.ts
// NIHOMI OPEN JAPAN GEO ENGINE — PROJECT PLATEAU 3D TILES PROVIDER
// Open 3D CityGML & 3D Tiles published by Japan's Ministry of Land, Infrastructure, Transport and Tourism (MLIT)
// Zero API Key • $0.00 / month Billing • CC BY 4.0 Open Data License

import * as THREE from 'three';
import { TilesRenderer } from '3d-tiles-renderer';
import { ReorientationPlugin, GLTFExtensionsPlugin } from '3d-tiles-renderer/plugins';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { JAPAN_GEO_ANCHORS, GeodeticCoordinate } from '../GeoCoordinates';
import { IWorldProvider, WorldProviderStatus, GeoProviderType } from './WorldProviderAdapter';

export const PLATEAU_SHIBUYA_ENDPOINTS = {
  // Shibuya Ward LOD2 Building Models with Photorealistic Facade Textures (Official MLIT 2025 Release)
  BUILDINGS_LOD2: 'https://assets.cms.plateau.reearth.io/assets/16/b016d3-42ef-4428-ad99-d229310b39fd/13113_shibuya-ku_pref_2025_citygml_1_op_bldg_3dtiles_13113_shibuya-ku_lod2/tileset.json',
  // Shibuya Ward LOD1 Massing Volume Models
  BUILDINGS_LOD1: 'https://assets.cms.plateau.reearth.io/assets/cf/26763c-faae-41b3-b110-2a4dd602f250/13113_shibuya-ku_pref_2025_citygml_1_op_bldg_3dtiles_13113_shibuya-ku_lod1/tileset.json',
  // Shibuya Transportation / Road Network LOD3
  ROADS_LOD3: 'https://assets.cms.plateau.reearth.io/assets/ba/3b3ca7-270b-4fd9-b355-27b1ea7d7df5/13113_shibuya-ku_pref_2025_citygml_1_op_tran_3dtiles_lod3/tileset.json',
  // Shibuya Bridges LOD2
  BRIDGES_LOD2: 'https://assets.cms.plateau.reearth.io/assets/37/acee1e-84d2-457d-a6a6-486d52cdb1a1/13113_shibuya-ku_pref_2025_citygml_1_op_brid_3dtiles_lod2/tileset.json'
};

export class Plateau3DTilesProvider implements IWorldProvider {
  public readonly name = 'Project PLATEAU (国土交通省 3D都市モデル)';
  public readonly type: GeoProviderType = 'plateau_3d_tiles';
  public group: THREE.Group;

  private buildingTiles: TilesRenderer | null = null;
  private roadTiles: TilesRenderer | null = null;
  private dracoLoader: DRACOLoader | null = null;
  private status: WorldProviderStatus;
  private onStatusChange?: (status: WorldProviderStatus) => void;
  private activeLayers: Set<string> = new Set(['buildings_lod2', 'roads_lod3']);
  private loadedTilesCount: number = 0;

  constructor(
    anchor: GeodeticCoordinate = JAPAN_GEO_ANCHORS.SHIBUYA_SCRAMBLE,
    onStatusChange?: (status: WorldProviderStatus) => void
  ) {
    this.group = new THREE.Group();
    this.group.name = 'Plateau_OpenGeo_Layer';
    this.onStatusChange = onStatusChange;

    this.status = {
      providerName: this.name,
      providerType: this.type,
      costModel: '$0.00 / month (Free Open Data)',
      license: 'Government of Japan Open Data Terms of Use (CC BY 4.0)',
      isStreaming: false,
      rootTilesetLoaded: false,
      childTilesLoadedCount: 0,
      activeLayers: Array.from(this.activeLayers),
      loadedTilesCount: 0,
      attributions: [
        'Project PLATEAU (国土交通省 3D都市モデル)',
        'G-Spatial Information Center (G空間センター)',
        'Shibuya Ward Urban Development Division'
      ],
      anchor
    };
  }

  public async initialize(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ): Promise<void> {
    scene.add(this.group);

    try {
      // 1. Configure Shared DRACO Loader for Compressed CityGML Geometry
      const draco = new DRACOLoader();
      draco.setDecoderPath('/draco/gltf/');
      draco.setDecoderConfig({ type: 'wasm' });
      this.dracoLoader = draco;

      // 2. Initialize PLATEAU LOD2 Buildings Tileset
      const bldgTiles = new TilesRenderer(PLATEAU_SHIBUYA_ENDPOINTS.BUILDINGS_LOD2);

      // Register GLTF Extensions Plugin with Draco and CESIUM_RTC Support
      const gltfPlugin = new GLTFExtensionsPlugin({
        dracoLoader: draco,
        rtc: true, // Crucial for CESIUM_RTC translation math in CityGML b3dm
        metadata: false
      });
      bldgTiles.registerPlugin(gltfPlugin);

      // Convert Anchor Lat/Lon to Radians for local tangent orientation (ENU)
      const latRad = (this.status.anchor.latitude * Math.PI) / 180;
      const lonRad = (this.status.anchor.longitude * Math.PI) / 180;
      const heightMeters = this.status.anchor.altitude || 18;

      const reorientPlugin = new ReorientationPlugin({
        lat: latRad,
        lon: lonRad,
        height: heightMeters,
        up: '+y',
        recenter: true
      });
      bldgTiles.registerPlugin(reorientPlugin);

      bldgTiles.setCamera(camera);
      bldgTiles.setResolutionFromRenderer(camera, renderer);
      bldgTiles.errorTarget = 6; // Standard detail target
      bldgTiles.maxDepth = 15;
      bldgTiles.loadSiblings = true;

      // Model Loading & PBR Material Realism Hook
      bldgTiles.addEventListener('load-model', (e: any) => {
        this.loadedTilesCount++;
        this.status.childTilesLoadedCount = this.loadedTilesCount;
        this.status.loadedTilesCount = this.loadedTilesCount;
        this.status.isStreaming = true; // Streaming strictly verified once a tile model arrives

        if (e.scene) {
          e.scene.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;

              // Ensure geometry has valid surface normals for lighting
              if (child.geometry && !child.geometry.attributes.normal) {
                child.geometry.computeVertexNormals();
              }

              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((m: any) => this.enhancePBRMaterial(m));
                } else {
                  this.enhancePBRMaterial(child.material);
                }
              }
            }
          });
        }
        this.notifyStatus();
      });

      bldgTiles.addEventListener('load-root-tileset', () => {
        console.log('[PlateauProvider] Connected to MLIT PLATEAU Shibuya 3D Tiles root.');
        this.status.rootTilesetLoaded = true;
        this.status.errorMessage = undefined;
        this.notifyStatus();
      });

      bldgTiles.addEventListener('load-error', (e: any) => {
        console.warn('[PlateauProvider] Building tileset load warning:', e.error?.message || e);
        this.status.errorMessage = e.error?.message;
        this.notifyStatus();
      });

      this.group.add(bldgTiles.group);
      this.buildingTiles = bldgTiles;

      // 3. Ground Reference Plane for Baseline Alignment (Visible Slate Road Asphalt)
      const groundGeo = new THREE.PlaneGeometry(600, 600);
      const groundMat = new THREE.MeshStandardMaterial({
        color: 0x475569, // Visible slate road surface
        roughness: 0.8,
        metalness: 0.1
      });
      const groundMesh = new THREE.Mesh(groundGeo, groundMat);
      groundMesh.rotation.x = -Math.PI / 2;
      groundMesh.position.y = -0.05;
      groundMesh.receiveShadow = true;
      this.group.add(groundMesh);

      this.notifyStatus();
    } catch (err: any) {
      console.error('[PlateauProvider] Failed to initialize PLATEAU 3D Tiles:', err);
      this.status.errorMessage = err?.message || 'Failed to initialize PLATEAU 3D Tiles';
      this.notifyStatus();
    }
  }

  private enhancePBRMaterial(material: any): void {
    if (!material) return;
    material.side = THREE.DoubleSide; // Ensure both front and back faces of building walls are always rendered
    material.transparent = false;
    material.opacity = 1.0;
    material.depthWrite = true;

    if (material.map) {
      // Textured LOD2 building facade
      material.color = new THREE.Color(0xffffff); // Pure white base to let facade textures shine with full vibrance
      material.roughness = 0.45;
      material.metalness = 0.1;
      material.emissive = new THREE.Color(0x334155); // Subtle ambient glow so shadow sides never vanish into black
      material.emissiveIntensity = 0.25;
    } else {
      // Untextured massing surfaces / roofs - force solid visible light architectural stone
      material.color = new THREE.Color(0xd1d5db); // Light concrete/stone grey (#d1d5db) - high visibility
      material.roughness = 0.45;
      material.metalness = 0.1;
      material.emissive = new THREE.Color(0x1e293b);
      material.emissiveIntensity = 0.2;
    }
    material.needsUpdate = true;
  }

  public update(camera: THREE.PerspectiveCamera, now: number): void {
    if (this.buildingTiles) {
      this.buildingTiles.update();
    }
    if (this.roadTiles) {
      this.roadTiles.update();
    }
  }

  public handleResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void {
    if (this.buildingTiles) {
      this.buildingTiles.setResolutionFromRenderer(camera, renderer);
    }
    if (this.roadTiles) {
      this.roadTiles.setResolutionFromRenderer(camera, renderer);
    }
  }

  public setLayerVisibility(layerName: string, visible: boolean): void {
    if (visible) {
      this.activeLayers.add(layerName);
    } else {
      this.activeLayers.delete(layerName);
    }

    if (layerName === 'buildings_lod2' && this.buildingTiles) {
      this.buildingTiles.group.visible = visible;
    }
    if (layerName === 'roads_lod3' && this.roadTiles) {
      this.roadTiles.group.visible = visible;
    }

    this.status.activeLayers = Array.from(this.activeLayers);
    this.notifyStatus();
  }

  public getStatus(): WorldProviderStatus {
    return { ...this.status };
  }

  private notifyStatus(): void {
    this.onStatusChange?.(this.getStatus());
  }

  public dispose(): void {
    if (this.buildingTiles) {
      this.buildingTiles.dispose();
      this.buildingTiles = null;
    }
    if (this.roadTiles) {
      this.roadTiles.dispose();
      this.roadTiles = null;
    }
    if (this.dracoLoader) {
      this.dracoLoader.dispose();
      this.dracoLoader = null;
    }
    this.group.clear();
  }
}
