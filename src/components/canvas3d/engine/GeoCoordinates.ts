// src/components/canvas3d/engine/GeoCoordinates.ts
// NIHOMI REAL JAPAN CANVAS™ — GEOGRAPHIC COORDINATE ADAPTER
// Converts WGS-84 Geodetic Coordinates (Lat, Lng, Alt) to ECEF and Local ENU (East-North-Up) Metric Space
// Enables placing Three.js avatars, NPCs, and interactions accurately on top of real-world 3D geographic tiles

import * as THREE from 'three';

export interface GeodeticCoordinate {
  latitude: number;   // Degrees (-90 to +90)
  longitude: number;  // Degrees (-180 to +180)
  altitude: number;   // Meters above WGS-84 ellipsoid
}

// WGS-84 Earth Ellipsoid Constants (GPS / OGC 3D Tiles Standard)
const WGS84_A = 6378137.0;             // Semi-major axis in meters
const WGS84_F = 1 / 298.257223563;     // Flattening
const WGS84_B = WGS84_A * (1 - WGS84_F); // Semi-minor axis
const WGS84_E2 = (WGS84_A * WGS84_A - WGS84_B * WGS84_B) / (WGS84_A * WGS84_A); // First eccentricity squared

/**
 * Converts Geodetic coordinates (Lat, Lng, Alt) to Earth-Centered, Earth-Fixed (ECEF) Cartesian (X, Y, Z)
 */
export function geodeticToECEF(geo: GeodeticCoordinate): THREE.Vector3 {
  const latRad = THREE.MathUtils.degToRad(geo.latitude);
  const lngRad = THREE.MathUtils.degToRad(geo.longitude);

  const sinLat = Math.sin(latRad);
  const cosLat = Math.cos(latRad);
  const sinLng = Math.sin(lngRad);
  const cosLng = Math.cos(lngRad);

  // Prime vertical radius of curvature
  const N = WGS84_A / Math.sqrt(1 - WGS84_E2 * sinLat * sinLat);

  const x = (N + geo.altitude) * cosLat * cosLng;
  const y = (N + geo.altitude) * cosLat * sinLng;
  const z = (N * (1 - WGS84_E2) + geo.altitude) * sinLat;

  return new THREE.Vector3(x, y, z);
}

/**
 * Transforms an ECEF coordinate to a Local ENU (East, North, Up) metric coordinate
 * relative to a geographic reference origin (e.g., Shibuya Scramble Crossing).
 *
 * In Three.js coordinate system convention:
 *   X = East (meters)
 *   Y = Up (meters)
 *   Z = -North (meters, where -Z points forward / North)
 */
export function ecefToLocalThree(ecef: THREE.Vector3, anchorGeo: GeodeticCoordinate): THREE.Vector3 {
  const anchorECEF = geodeticToECEF(anchorGeo);
  const delta = new THREE.Vector3().subVectors(ecef, anchorECEF);

  const latRad = THREE.MathUtils.degToRad(anchorGeo.latitude);
  const lngRad = THREE.MathUtils.degToRad(anchorGeo.longitude);

  const sinLat = Math.sin(latRad);
  const cosLat = Math.cos(latRad);
  const sinLng = Math.sin(lngRad);
  const cosLng = Math.cos(lngRad);

  // ENU transformation matrix components
  const east = -sinLng * delta.x + cosLng * delta.y;
  const north = -sinLat * cosLng * delta.x - sinLat * sinLng * delta.y + cosLat * delta.z;
  const up = cosLat * cosLng * delta.x + cosLat * sinLng * delta.y + sinLat * delta.z;

  // Map ENU to Three.js Cartesian (X: East, Y: Up, Z: -North)
  return new THREE.Vector3(east, up, -north);
}

/**
 * Standard Japanese Geographic Anchors for Nihomi World Expansion
 */
export const JAPAN_GEO_ANCHORS = {
  SHIBUYA_SCRAMBLE: {
    name: 'Shibuya Scramble Crossing, Tokyo (渋谷スクランブル交差点)',
    latitude: 35.6595,
    longitude: 139.7005,
    altitude: 18.0
  },
  SHINJUKU_STATION: {
    name: 'Shinjuku Station East Exit, Tokyo (新宿駅東口)',
    latitude: 35.6896,
    longitude: 139.7006,
    altitude: 35.0
  },
  AKIHABARA_ELECTRIC_TOWN: {
    name: 'Akihabara Electric Town, Tokyo (秋葉原電気街)',
    latitude: 35.6983,
    longitude: 139.7731,
    altitude: 5.0
  },
  KYOTO_GION: {
    name: 'Gion District, Kyoto (京都 祇園)',
    latitude: 35.0037,
    longitude: 135.7772,
    altitude: 45.0
  },
  OSAKA_DOTONBORI: {
    name: 'Dotonbori Glico Sign, Osaka (大阪 道頓堀)',
    latitude: 34.6687,
    longitude: 135.5013,
    altitude: 3.0
  }
} as const;
