// src/components/canvas3d/engine/providers/WorldProviderAdapter.ts
// NIHOMI OPEN JAPAN GEO ENGINE — PROVIDER-AGNOSTIC ADAPTER ARCHITECTURE
// Decoupled, zero-API-cost geographic foundations using Japanese open data (Project PLATEAU & OSM)

import * as THREE from 'three';
import { GeodeticCoordinate } from '../GeoCoordinates';

export type GeoProviderType = 'plateau_3d_tiles' | 'open_geo_osm' | 'photographic_fallback';

export interface WorldProviderStatus {
  providerName: string;
  providerType: GeoProviderType;
  costModel: '$0.00 / month (Free Open Data)';
  license: string;
  isStreaming: boolean;
  rootTilesetLoaded?: boolean;
  childTilesLoadedCount?: number;
  activeLayers: string[];
  loadedTilesCount: number;
  attributions: string[];
  anchor: GeodeticCoordinate;
  errorMessage?: string;
}

export type CameraViewPreset = 'aerial_tokyo' | 'district_shibuya' | 'street_scramble';

export interface IWorldProvider {
  readonly name: string;
  readonly type: GeoProviderType;
  group: THREE.Group;

  initialize(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ): Promise<void>;

  update(camera: THREE.PerspectiveCamera, now: number): void;

  handleResize?(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void;

  dispose(): void;

  getStatus(): WorldProviderStatus;

  setLayerVisibility?(layerName: string, visible: boolean): void;
}
