// src/components/canvas3d/worldGraph/WorldGraphTypes.ts
// NIHOMI WORLD™ — HIERARCHICAL WORLD GRAPH & LOCATION ENGINE
// Structure: Japan → Region → City → District → Street / Node → POI → Interior

export type JapanRegionId = 'kanto' | 'kansai' | 'chubu' | 'tohoku' | 'hokkaido' | 'kyushu';
export type JapanCityId = 'tokyo' | 'narita' | 'kyoto' | 'osaka' | 'yokohama';
export type JapanDistrictId = 'shibuya' | 'shinjuku' | 'narita_airport' | 'kyoto_gion' | 'osaka_dotonbori';

export type WorldNodeType = 
  | 'district_outdoor' 
  | 'station_platform' 
  | 'airport_terminal' 
  | 'train_interior' 
  | 'poi_interior';

export type TransitMode = 
  | 'walk' 
  | 'train_local' 
  | 'train_express' 
  | 'shinkansen' 
  | 'flight' 
  | 'taxi' 
  | 'bus';

export type POICategory = 
  | 'transport' 
  | 'retail' 
  | 'government' 
  | 'finance' 
  | 'dining' 
  | 'residence' 
  | 'medical';

export interface WorldRegion {
  id: JapanRegionId;
  nameJa: string;
  nameRomaji: string;
  nameEn: string;
  nameBn: string;
  descriptionJa: string;
  descriptionEn: string;
}

export interface WorldCity {
  id: JapanCityId;
  regionId: JapanRegionId;
  nameJa: string;
  nameRomaji: string;
  nameEn: string;
  nameBn: string;
  climateZone: string;
  prefectureJa: string;
}

export interface WorldDistrict {
  id: JapanDistrictId;
  cityId: JapanCityId;
  nameJa: string;
  nameRomaji: string;
  nameEn: string;
  nameBn: string;
  centerCoordinates: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  urbanDensity: 'high' | 'medium' | 'historic';
  atmosphereSummary: string;
}

export interface WorldGraphPOI {
  id: string;
  nameJa: string;
  nameRomaji: string;
  nameEn: string;
  nameBn: string;
  category: POICategory;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  npcId?: string;
  localCoordinates: [number, number, number];
  readinessObjective: string;
  promptText: string;
  interiorNodeId?: string;
}

export interface TransitRoute {
  id: string;
  targetNodeId: string;
  transitMode: TransitMode;
  routeLineNameJa: string;
  routeLineNameRomaji: string;
  routeLineNameEn: string;
  routeLineNameBn: string;
  departureStationNameJa: string;
  arrivalStationNameJa: string;
  fareYen: number;
  travelTimeMinutes: number;
  requiresICCardOrTicket: boolean;
  announcementAudioKey?: string;
  description: string;
}

export interface WorldGraphNode {
  id: string;
  districtId: JapanDistrictId;
  nameJa: string;
  nameRomaji: string;
  nameEn: string;
  nameBn: string;
  nodeType: WorldNodeType;
  geoCoordinates: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  pois: WorldGraphPOI[];
  transitRoutes: TransitRoute[];
  backgroundTextureFallback?: string;
  hasGoogle3DTilesSupport: boolean;
}
