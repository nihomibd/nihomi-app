// scripts/test-dual-persistence-sync.ts
// Automated Verification Suite for WP11: Dual-Persistence Sync & Reconciliation Engine
// Validates Law 1 & Law 3: Stable Core Durability & Zero Split-Brain Data Drift

import {
  resolveProgressConflict,
  dualPersistenceReconciler
} from '../server/services/dualPersistenceReconciler';

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` — ${detail}` : ''}`);
    failCount++;
  }
}

async function runDualPersistenceTests() {
  console.log('================================================================');
  console.log('🧪 NIHOMI WP11: DUAL-PERSISTENCE SYNC & RECONCILIATION TEST SUITE');
  console.log('================================================================\n');

  // -------------------------------------------------------------------------
  // [PART 1: DETERMINISTIC CONFLICT RESOLUTION RULES]
  // -------------------------------------------------------------------------
  console.log('[1/4] Verifying Deterministic Conflict Resolution Engine...');

  const localProg = {
    userId: 'usr_test_01',
    experiencePoints: 250,
    currentStreak: 5,
    completedLessonIds: ['n5-l01', 'n5-l02'],
    knowledgeState: {
      totalXp: 250,
      streakDays: 5,
      knownHiragana: ['あ', 'い', 'う'],
      knownVocabulary: ['あい', 'いう'],
      masteredSkills: ['kana_vowels_3']
    }
  };

  const remoteProg = {
    user_id: 'usr_test_01',
    experience_points: 180,
    current_streak: 4,
    completed_lessons: ['n5-l02', 'n5-l03'],
    knowledge_state: {
      totalXp: 180,
      streakDays: 4,
      knownHiragana: ['あ', 'い', 'え'],
      knownVocabulary: ['あい', 'いえ'],
      masteredSkills: ['kana_vowels_3', 'word_ie']
    }
  };

  const resolution1 = resolveProgressConflict(localProg, remoteProg);
  assert(resolution1.hadConflict === true, 'Detected divergence between local and remote records');
  assert(resolution1.merged.experiencePoints === 250, 'Highest XP wins rule: Local 250 vs Remote 180 -> Merged 250 XP');
  assert(resolution1.merged.currentStreak === 5, 'Highest streak wins rule: Local 5 vs Remote 4 -> Merged 5 days');

  // Check Set union for kana
  const mergedKana = resolution1.merged.knowledgeState.knownHiragana;
  assert(
    mergedKana.includes('あ') && mergedKana.includes('い') && mergedKana.includes('う') && mergedKana.includes('え'),
    'Set union for Hiragana: preserves all unlocked characters [あ, い, う, え]'
  );

  // Check Set union for vocabulary
  const mergedVocab = resolution1.merged.knowledgeState.knownVocabulary;
  assert(
    mergedVocab.includes('あい') && mergedVocab.includes('いう') && mergedVocab.includes('いえ'),
    'Set union for Vocabulary: preserves all unlocked words [あい, いう, いえ]'
  );

  // Check Set union for completed lessons
  const mergedLessons = resolution1.merged.completedLessonIds;
  assert(
    mergedLessons.includes('n5-l01') && mergedLessons.includes('n5-l02') && mergedLessons.includes('n5-l03'),
    'Set union for Completed Lessons: [n5-l01, n5-l02, n5-l03]'
  );

  // -------------------------------------------------------------------------
  // [PART 2: REVERSE XP DOMINANCE (REMOTE HIGHER)]
  // -------------------------------------------------------------------------
  console.log('\n[2/4] Verifying Remote Dominance when Cloud Progress is Newer...');

  const localBehind = {
    userId: 'usr_test_02',
    experiencePoints: 100,
    currentStreak: 1,
    completedLessonIds: ['n5-l01'],
    knowledgeState: { totalXp: 100, knownHiragana: ['あ'] }
  };

  const remoteAhead = {
    user_id: 'usr_test_02',
    experience_points: 420,
    current_streak: 8,
    completed_lessons: ['n5-l01', 'n5-l02', 'n5-l03', 'n5-l04'],
    knowledge_state: { totalXp: 420, knownHiragana: ['あ', 'い', 'う', 'え', 'お'] }
  };

  const resolution2 = resolveProgressConflict(localBehind, remoteAhead);
  assert(resolution2.merged.experiencePoints === 420, 'Remote 420 XP dominates Local 100 XP');
  assert(resolution2.merged.currentStreak === 8, 'Remote 8-day streak dominates Local 1-day streak');
  assert(resolution2.merged.knowledgeState.knownHiragana.length === 5, 'All 5 vowels retained from ahead cloud record');

  // -------------------------------------------------------------------------
  // [PART 3: PROBE CLOUD HEALTH & SAFE FAILOVER DEGRADATION]
  // -------------------------------------------------------------------------
  console.log('\n[3/4] Testing Cloud Health Probe & Resilient Local Failover...');

  const isConnected = await dualPersistenceReconciler.probeCloudHealth();
  const status = dualPersistenceReconciler.getStatus();
  assert(typeof isConnected === 'boolean', `Cloud health probe returned boolean (${isConnected})`);
  assert(
    status.mode === 'cloud_active' || status.mode === 'local_resilient_failover',
    `Reconciler operating in valid deterministic mode: ${status.mode}`
  );

  // Run a reconciliation cycle
  const cycleResult = await dualPersistenceReconciler.runReconciliationCycle();
  assert(cycleResult.success === true, 'Reconciliation cycle completed cleanly without unhandled exceptions');
  assert(typeof cycleResult.durationMs === 'number' && cycleResult.durationMs >= 0, `Cycle duration benchmarked (${cycleResult.durationMs}ms)`);

  // -------------------------------------------------------------------------
  // [PART 4: LIVE HTTP HEALTH ROUTE INTEGRATION]
  // -------------------------------------------------------------------------
  console.log('\n[4/4] Verifying /api/health Telemetry Integration...');

  try {
    const res = await fetch('http://localhost:3000/api/health');
    assert(res.ok, `GET /api/health returned HTTP 200 OK (${res.status})`);
    const data = await res.json();
    assert(data.database && typeof data.database === 'object', 'Health payload includes database health telemetry');
    assert(data.database.dualPersistence !== undefined, 'Health payload includes dualPersistence metrics block');
    assert(
      data.database.dualPersistence.mode === 'cloud_active' || data.database.dualPersistence.mode === 'local_resilient_failover',
      `Dual persistence mode reported: ${data.database.dualPersistence.mode}`
    );
  } catch (err: any) {
    console.error('    Error querying /api/health:', err?.message);
    assert(false, 'Local /api/health probe should succeed');
  }

  console.log('\n================================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passCount} PASSED | ${failCount} FAILED`);
  console.log('================================================================');

  if (failCount > 0) {
    process.exit(1);
  }
}

runDualPersistenceTests().catch((err) => {
  console.error('Unhandled dual-persistence test failure:', err);
  process.exit(1);
});
