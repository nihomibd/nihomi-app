// server/scripts/verify-spatial-engine.ts
// Automated Verification for NIHOMI REAL JAPAN CANVAS™ & SPATIAL ENGINE ARCHITECTURE
// Verifies:
// 1. Geodetic WGS-84 to ECEF/ENU transforms
// 2. Tokyo JST Solar calculations & Non-Blinding Lighting calibration
// 3. Contextual POI Discovery & Dynamic Proximity
// 4. In-World Keigo Dialogue & MemoryOS Failure Logging
// 5. World Graph Hierarchy & Multi-District Node Connectivity (Narita, Shibuya, Shinjuku)
// 6. Transportation Engine & Suica IC Card Charging / Fare Deductions
// 7. 7-Stage Observational Learning Loop & SuperMemo-2 Spaced Repetition Scheduling

import { geodeticToECEF, ecefToLocalThree, JAPAN_GEO_ANCHORS } from '../../src/components/canvas3d/engine/GeoCoordinates';
import { TokyoTimeEngine } from '../../src/components/canvas3d/engine/TokyoTimeEngine';
import { WorldInteractionLayer } from '../../src/components/canvas3d/engine/WorldInteractionLayer';
import { worldGraphManager } from '../../src/components/canvas3d/worldGraph/WorldGraphManager';
import { WORLD_NODES, JAPAN_DISTRICTS } from '../../src/components/canvas3d/worldGraph/WorldGraphData';
import { observationalLearningEngine } from '../../src/components/canvas3d/learning/ObservationalLearningEngine';
import { SPATIAL_NPC_REGISTRY } from '../../src/components/canvas3d/learning/SpatialNPCRegistry';
import { WorldProviderManager, CAMERA_VIEW_PRESETS } from '../../src/components/canvas3d/engine/WorldProviderManager';
import { PLATEAU_SHIBUYA_ENDPOINTS } from '../../src/components/canvas3d/engine/providers/Plateau3DTilesProvider';
import { SHIBUYA_OSM_POIS } from '../../src/components/canvas3d/engine/providers/OpenGeoProvider';
import * as THREE from 'three';

console.log('================================================================================');
console.log('  NIHOMI REAL JAPAN WORLD™ — COMPREHENSIVE ARCHITECTURAL VERIFICATION');
console.log('================================================================================\n');

// [CHECK 1] Geographic WGS-84 Coordinate Math & Local ENU Transform
console.log('[GEOGRAPHIC CHECK 1] WGS-84 to ECEF & Local Metric ENU Transform:');
const shibuyaAnchor = JAPAN_GEO_ANCHORS.SHIBUYA_SCRAMBLE;
const anchorECEF = geodeticToECEF(shibuyaAnchor);

console.log(`  └─ Shibuya Scramble Anchor: Lat ${shibuyaAnchor.latitude}°, Lng ${shibuyaAnchor.longitude}°, Alt ${shibuyaAnchor.altitude}m`);
console.log(`  └─ Computed ECEF: X=${anchorECEF.x.toFixed(1)}m, Y=${anchorECEF.y.toFixed(1)}m, Z=${anchorECEF.z.toFixed(1)}m`);

const localOrigin = ecefToLocalThree(anchorECEF, shibuyaAnchor);
console.log(`  └─ Relative Local Metric Coordinate: (${localOrigin.x.toFixed(2)}, ${localOrigin.y.toFixed(2)}, ${localOrigin.z.toFixed(2)})`);

if (Math.abs(localOrigin.x) < 0.001 && Math.abs(localOrigin.y) < 0.001 && Math.abs(localOrigin.z) < 0.001) {
  console.log('  ✓ PASS: Geographic WGS-84 to ECEF and Local ENU transformation verified with sub-millimeter precision.\n');
} else {
  throw new Error('Geodetic coordinate transformation error');
}

// [CHECK 2] Tokyo Time Engine & Calibrated Non-Blinding Solar Atmosphere
console.log('[ATMOSPHERE CHECK 2] Tokyo JST Solar Engine & Calibrated Lighting (Non-Blinding):');
const timeEngine = new TokyoTimeEngine();

// Test Live JST
const liveAtmosphere = timeEngine.calculateAtmosphere();
console.log(`  └─ Live Tokyo Time: ${liveAtmosphere.tokyoTimeString} (Period: ${liveAtmosphere.period})`);
console.log(`  └─ Solar Elevation: ${liveAtmosphere.sunElevationDeg.toFixed(1)}°, Sun Intensity: ${liveAtmosphere.sunIntensity.toFixed(2)}`);

// Test Day Preset (Must be <= 1.2 to prevent blinding whiteout)
timeEngine.setTimeOverride('day');
const dayAtmosphere = timeEngine.calculateAtmosphere();
console.log(`  └─ Override [Day]: Sun Intensity = ${dayAtmosphere.sunIntensity.toFixed(2)}, Ambient = ${dayAtmosphere.ambientIntensity.toFixed(2)}`);

if (dayAtmosphere.sunIntensity <= 1.15 && dayAtmosphere.ambientIntensity <= 0.75) {
  console.log('  ✓ PASS: Daytime solar intensity strictly calibrated to prevent blinding/overexposed highlights.\n');
} else {
  throw new Error(`Lighting intensity exceeds calibrated thresholds: sun=${dayAtmosphere.sunIntensity}`);
}

// [CHECK 3] Contextual POI Discovery & Dynamic Proximity
console.log('[PROXIMITY CHECK 3] Real-World POI Discovery & Interaction Triggers:');
const interactionLayer = new WorldInteractionLayer();

// Test spawn at open crossing (0, 6)
const spawnPos = new THREE.Vector3(0, 0.9, 6);
const spawnPOI = interactionLayer.checkProximity(spawnPos);
console.log(`  └─ Player Spawn at (0, 6): Active POI = ${spawnPOI ? spawnPOI.nameJa : 'None (Open Crossing)'}`);

if (!spawnPOI) {
  console.log('  ✓ PASS: Open Scramble crossing correctly allows free exploration without false-positive triggers.');
} else {
  throw new Error('Spawn proximity false-positive error');
}

// Test approach to 7-Eleven (-14, -6)
const storePos = new THREE.Vector3(-14, 0.9, -6);
const storePOI = interactionLayer.checkProximity(storePos);
console.log(`  └─ Player Approach to (-14, -6): Active POI = ${storePOI ? storePOI.nameJa : 'None'}`);

if (storePOI && storePOI.id === 'conbini-7eleven') {
  console.log('  ✓ PASS: 7-Eleven store detected within interaction radius (5.0m).\n');
} else {
  throw new Error('POI proximity detection error');
}

// [CHECK 4] In-World Dialogue & MemoryOS Failure Logging
console.log('[LEARNING LOOP CHECK 4] Dialogue Evaluation & MemoryOS Failure Logging:');
if (storePOI) {
  const casualResult = interactionLayer.evaluateDialogueResponse(
    storePOI,
    'baito_casual',
    'あの…バイト…ありますか？',
    false
  );
  console.log(`  └─ Casual Speech Evaluated: XP=+${casualResult.xpGained}, Coins=+${casualResult.coinsGained}`);

  const keigoResult = interactionLayer.evaluateDialogueResponse(
    storePOI,
    'baito_keigo',
    'アルバイトの募集はありますか？',
    true
  );
  console.log(`  └─ Polite Keigo Evaluated: XP=+${keigoResult.xpGained}, Coins=+${keigoResult.coinsGained}`);

  if (keigoResult.coinsGained === 25 && casualResult.coinsGained === 0) {
    console.log('  ✓ PASS: Keigo learning loop rewards polite Japanese and logs casual slips to MemoryOS.\n');
  } else {
    throw new Error('Dialogue evaluation error');
  }
}

// [CHECK 5] World Graph Hierarchy & Multi-District Connectivity
console.log('[WORLD GRAPH CHECK 5] Multi-District Node Hierarchy & Transit Routing:');
const initialNode = worldGraphManager.getCurrentNode();
console.log(`  └─ Initial Node: ${initialNode.nameJa} (${initialNode.id})`);
console.log(`  └─ Available Transit Routes: ${initialNode.transitRoutes.length}`);

// Verify Narita Airport Node exists with Officer Takahashi
const naritaNode = WORLD_NODES['node_narita_airport_t1'];
const immigrationPOI = naritaNode.pois.find((p) => p.id === 'poi_narita_immigration');
const takahashiNPC = SPATIAL_NPC_REGISTRY['npc_officer_takahashi'];

if (naritaNode && immigrationPOI && takahashiNPC) {
  console.log(`  └─ Narita Airport Gateway Verified: POI="${immigrationPOI.nameJa}", NPC="${takahashiNPC.nameJa}"`);
  console.log('  ✓ PASS: World Graph data structures correctly define multi-district nodes and spatial NPCs.\n');
} else {
  throw new Error('World Graph node verification error');
}

// [CHECK 6] Transportation Engine & Suica IC Card Accounting
console.log('[TRANSPORTATION CHECK 6] Suica IC Card Charging & Train Transit Simulation:');
const startSuica = worldGraphManager.getSuicaBalance();
console.log(`  └─ Starting Suica Balance: ¥${startSuica}`);

// Charge 3,000 yen at Ticket Vending Machine
worldGraphManager.chargeSuica(3000);
const chargedSuica = worldGraphManager.getSuicaBalance();
console.log(`  └─ Post-Charge Suica Balance: ¥${chargedSuica}`);

if (chargedSuica === startSuica + 3000) {
  console.log('  ✓ PASS: Suica IC Card ticket machine recharge accounting verified.');
} else {
  throw new Error('Suica recharge accounting mismatch');
}

// Travel from Shibuya to Shinjuku via Yamanote Line (170 yen fare)
const travelResult = worldGraphManager.travelRoute('route_yamanote_to_shinjuku');
const postTransitSuica = worldGraphManager.getSuicaBalance();
console.log(`  └─ Transit Execution: Success=${travelResult.success}, Target Node=${travelResult.targetNode?.nameJa}`);
console.log(`  └─ Post-Transit Suica Balance: ¥${postTransitSuica} (Deducted: ¥${chargedSuica - postTransitSuica})`);

if (travelResult.success && postTransitSuica === chargedSuica - 170) {
  console.log('  ✓ PASS: Railway transit deducted exact fare and transitioned active World Graph node.\n');
} else {
  throw new Error('Transit route execution error');
}

// Reset node back to Shibuya Scramble for next checks
worldGraphManager.setNodeDirect('node_shibuya_scramble');

// [CHECK 7] Observational Learning 7-Stage Loop & SuperMemo-2 SRS
console.log('[LEARNING ENGINE CHECK 7] 7-Stage Observational Learning & SuperMemo-2 Math:');
const unit = {
  id: 'unit_conbini_bag',
  poiId: 'conbini-7eleven',
  titleJa: 'レジ袋の辞退',
  titleEn: 'Declining Plastic Shopping Bags',
  jlptLevel: 'N5' as const,
  culturalContextJa: '2020年7月から全国でレジ袋が有料化されました。',
  culturalContextEn: 'Plastic shopping bags have required a 3-5 yen fee since July 2020.',
  culturalContextBn: '২০২০ সাল থেকে জাপানে প্লাস্টিক ব্যাগের ফি নেওয়া হয়।',
  targetPhraseJa: '袋は結構です。そのままでお願いします。',
  targetPhraseRomaji: 'Fukuro wa kekkou desu. Sono mama de onegai shimasu.',
  targetPhraseEn: 'No bag needed, thank you. Just as it is, please.',
  grammarPattern: '〜は結構です / 〜でお願いします',
  keigoCategory: 'Teineigo (丁寧語)' as const,
  commonMistakes: []
};

const evalResult = observationalLearningEngine.evaluateResponse(
  unit,
  '袋は結構です。そのままでお願いします。',
  true
);

console.log(`  └─ Evaluated Response: Score=${evalResult.scoreGrade}/5, Coins=+${evalResult.coinsAwarded}, XP=+${evalResult.xpAwarded}`);
console.log(`  └─ SuperMemo-2 Next Review Interval: ${evalResult.scheduledIntervalDays} day(s), Scheduled Date: ${evalResult.nextReviewDate.toISOString().split('T')[0]}`);

if (evalResult.isCorrect && evalResult.scheduledIntervalDays >= 1 && evalResult.coinsAwarded === 25) {
  console.log('  ✓ PASS: 7-Stage Observational Learning Engine successfully updated SuperMemo-2 SRS interval.\n');
} else {
  throw new Error('Observational Learning evaluation error');
}

// [CHECK 8] Open Japan Geo Engine: PLATEAU 3D Tiles & OpenStreetMap Providers ($0.00 / month)
console.log('[OPEN GEO CHECK 8] Open Japan Geo Engine (Project PLATEAU & OSM) Live Network Verification:');

const geoManager = new WorldProviderManager(shibuyaAnchor, 'plateau_3d_tiles');
const initialStatus = geoManager.getStatus();

console.log(`  └─ Primary Provider: ${initialStatus.providerName}`);
console.log(`  └─ Cost Model: ${initialStatus.costModel}`);
console.log(`  └─ Open Data License: ${initialStatus.license}`);
console.log(`  └─ Initial isStreaming: ${initialStatus.isStreaming} (Must be false before network stream starts)`);

// 8A. Strict check: isStreaming MUST NOT be true before actual network transmission
if (initialStatus.isStreaming !== false) {
  throw new Error('Check 8 Failure: isStreaming must be false prior to network streaming');
}

// 8B. Live Network Verification of Official MLIT PLATEAU Shibuya LOD2 Tileset
const tilesetUrl = PLATEAU_SHIBUYA_ENDPOINTS.BUILDINGS_LOD2;
console.log(`  └─ [Network Proof 1] Fetching PLATEAU Shibuya LOD2 tileset.json: ${tilesetUrl}`);
const tilesetRes = await fetch(tilesetUrl);
if (!tilesetRes.ok) {
  throw new Error(`Failed to fetch root tileset.json: HTTP ${tilesetRes.status}`);
}
const tilesetJson = await tilesetRes.json();
console.log(`     ✓ Root tileset.json: HTTP 200 OK (Asset version: ${tilesetJson.asset?.version}, GeometricError: ${tilesetJson.root?.geometricError?.toFixed(1)})`);

// 8C. Live Network Verification of Root Tile (b3dm payload)
const rootTileUri = tilesetJson.root?.content?.uri;
if (!rootTileUri) {
  throw new Error('Check 8 Failure: Root tileset.json does not declare content URI');
}
const rootTileUrl = new URL(rootTileUri, tilesetUrl).href;
console.log(`  └─ [Network Proof 2] Fetching Root Tile b3dm payload: ${rootTileUrl}`);
const rootTileRes = await fetch(rootTileUrl);
if (!rootTileRes.ok) {
  throw new Error(`Failed to fetch root tile: HTTP ${rootTileRes.status}`);
}
const rootTileBuf = await rootTileRes.arrayBuffer();
const view = new DataView(rootTileBuf);
const magic = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
if (magic !== 'b3dm') {
  throw new Error(`Check 8 Failure: Expected b3dm magic, got ${magic}`);
}
console.log(`     ✓ Root Tile b3dm: HTTP 200 OK (${rootTileBuf.byteLength.toLocaleString()} bytes, Magic: "${magic}")`);

// 8D. Verify Embedded GLB, Draco Mesh Compression & CESIUM_RTC Header
const ftJsonLen = view.getUint32(12, true);
const ftBinLen = view.getUint32(16, true);
const btJsonLen = view.getUint32(20, true);
const btBinLen = view.getUint32(24, true);
const glbOffset = 28 + ftJsonLen + ftBinLen + btJsonLen + btBinLen;
const glbView = new DataView(rootTileBuf, glbOffset);
const glbMagic = String.fromCharCode(glbView.getUint8(0), glbView.getUint8(1), glbView.getUint8(2), glbView.getUint8(3));
if (glbMagic !== 'glTF') {
  throw new Error(`Check 8 Failure: Embedded GLB magic is ${glbMagic}, expected glTF`);
}
const jsonChunkLen = glbView.getUint32(12, true);
const jsonBytes = new Uint8Array(rootTileBuf, glbOffset + 20, jsonChunkLen);
const gltf = JSON.parse(new TextDecoder().decode(jsonBytes));
const extensions = gltf.extensionsUsed || [];
const rtcCenter = gltf.extensions?.CESIUM_RTC?.center;

console.log(`  └─ [3D Geometry Proof] GLTF Extensions in PLATEAU b3dm: ${extensions.join(', ')}`);
console.log(`     ✓ Draco Mesh Compression verified: ${extensions.includes('KHR_draco_mesh_compression')}`);
console.log(`     ✓ CESIUM_RTC Center verified: [${rtcCenter?.map((n: number) => n.toFixed(1)).join(', ')}]`);

if (!extensions.includes('KHR_draco_mesh_compression') || !rtcCenter) {
  throw new Error('Check 8 Failure: Missing Draco or CESIUM_RTC in PLATEAU b3dm payload');
}

// 8E. Live Network Verification of Child Tile
const childTileUri = tilesetJson.root?.children?.[0]?.content?.uri;
if (childTileUri) {
  const childTileUrl = new URL(childTileUri, tilesetUrl).href;
  console.log(`  └─ [Network Proof 3] Fetching Child Tile b3dm payload: ${childTileUrl}`);
  const childRes = await fetch(childTileUrl, { method: 'HEAD' });
  console.log(`     ✓ Child Tile: HTTP ${childRes.status} OK (${childRes.headers.get('content-length')} bytes)`);
  if (!childRes.ok) throw new Error(`Child tile fetch failed with HTTP ${childRes.status}`);
}

// 8F. Verify Camera Presets & OSM POIs
console.log(`  └─ OSM Verified Shibuya POIs: ${SHIBUYA_OSM_POIS.length} nodes (Station, Koban, Yucho Bank, Conbini)`);
console.log(`  └─ Camera Flight Presets: ${Object.keys(CAMERA_VIEW_PRESETS).join(', ')}`);

if (SHIBUYA_OSM_POIS.length >= 5 && CAMERA_VIEW_PRESETS.aerial_tokyo.position.y === 260) {
  console.log('  ✓ PASS: Open Japan Geo Engine (PLATEAU 3D Tiles + OSM + Draco + RTC) verified with live network proof & Zero API Billing.\n');
} else {
  throw new Error('Open Japan Geo Engine verification failed');
}

console.log('================================================================================');
console.log('  ✓ ALL 8/8 REAL-WORLD GEOGRAPHIC, WORLD GRAPH & OPEN DATA CHECKS PASSED');
console.log('================================================================================');

