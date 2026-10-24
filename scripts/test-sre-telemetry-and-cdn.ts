// scripts/test-sre-telemetry-and-cdn.ts
// Automated Test Suite for NIHOMI WP13: Production SRE Deep Health Telemetry, Edge CDN Cache Purge & Traffic Telemetry
// Governed by Law 1 (Stable Core Durability) & Law 10 (Production Rigor & SRE Verification Evidence)

import assert from 'assert';
import { cdnPurgeService } from '../server/services/cdnPurgeService.js';

console.log('========================================================================');
console.log('📡 NIHOMI WP13: PRODUCTION SRE DEEP TELEMETRY & CDN PURGE TEST SUITE');
console.log('========================================================================\n');

let totalTests = 0;
let passedTests = 0;
const failures: string[] = [];

async function runTest(name: string, fn: () => void | Promise<void>) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✅ [PASS] ${name}`);
  } catch (err: any) {
    failures.push(`${name}: ${err.message}`);
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function main() {
  const SRE_KEY = process.env.INTERNAL_SRE_KEY || 'nihomi_sre_telemetry_2026';
  const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

  // -------------------------------------------------------------
  // Test Group 1: CDN Purge Adapter Unit & Fallback Tests
  // -------------------------------------------------------------
  console.log('[1/4] Testing Cloudflare CDN Edge Cache Purge Adapter...');

  await runTest('cdnPurgeService reports valid initial status and mode', () => {
    const status = cdnPurgeService.getStatus();
    assert(status !== undefined, 'Status should be defined');
    assert(typeof status.mode === 'string', 'Mode should be a string');
    assert(typeof status.totalPurgesExecuted === 'number', 'totalPurgesExecuted should be a number');
    assert(typeof status.successfulPurges === 'number', 'successfulPurges should be a number');
  });

  await runTest('cdnPurgeService.purgeUrls purges asset paths with graceful fallback', async () => {
    const res = await cdnPurgeService.purgeUrls(['/assets/index-test.js', '/assets/style-test.css']);
    assert.strictEqual(res.success, true, 'purgeUrls should return success');
    assert.strictEqual(res.purgedType, 'urls');
    assert.strictEqual(res.count, 2);
    assert(res.timestamp !== undefined, 'Timestamp must be recorded');
  });

  await runTest('cdnPurgeService.purgeTags purges cache by tags with graceful fallback', async () => {
    const res = await cdnPurgeService.purgeTags(['curriculum', 'kanji-strokes']);
    assert.strictEqual(res.success, true, 'purgeTags should return success');
    assert.strictEqual(res.purgedType, 'tags');
    assert.strictEqual(res.count, 2);
  });

  await runTest('cdnPurgeService.purgeEverything purges entire edge cache', async () => {
    const res = await cdnPurgeService.purgeEverything();
    assert.strictEqual(res.success, true, 'purgeEverything should return success');
    assert.strictEqual(res.purgedType, 'everything');
  });

  await runTest('cdnPurgeService telemetry records cumulative purge operations', () => {
    const status = cdnPurgeService.getStatus();
    assert(status.totalPurgesExecuted >= 3, `Expected at least 3 purges, got ${status.totalPurgesExecuted}`);
    assert(status.successfulPurges >= 3, `Expected at least 3 successful purges, got ${status.successfulPurges}`);
    assert.strictEqual(status.lastPurgeType, 'everything');
    assert(status.lastPurgeTimestamp !== null);
  });

  // -------------------------------------------------------------
  // Test Group 2: Live Deep SRE Health Probe (/api/health/deep)
  // -------------------------------------------------------------
  console.log('\n[2/4] Testing Live Deep SRE Health Telemetry (/api/health/deep)...');

  let deepResponse: any = null;
  let deepHeaders: any = null;

  await runTest('GET /api/health/deep returns HTTP 200 OK with zero-cache headers', async () => {
    const res = await fetch(`${BASE_URL}/api/health/deep`);
    assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);

    const cacheControl = res.headers.get('cache-control') || '';
    assert(cacheControl.includes('no-store'), 'Must include no-store in Cache-Control');
    assert(cacheControl.includes('no-cache'), 'Must include no-cache in Cache-Control');

    deepHeaders = res.headers;
    deepResponse = await res.json();
  });

  await runTest('Deep health telemetry contains high-precision Event Loop & performance metrics', () => {
    assert(deepResponse !== null, 'Response must be loaded');
    assert.strictEqual(deepResponse.status, 'ok');
    assert.strictEqual(deepResponse.system, 'healthy');
    assert(deepResponse.performance !== undefined, 'Performance block must be present');
    assert(typeof deepResponse.performance.eventLoopLagMs === 'number', 'eventLoopLagMs must be numeric');
    assert(deepResponse.performance.eventLoopLagMs >= 0, 'eventLoopLagMs cannot be negative');
    assert(typeof deepResponse.performance.dbLatencyMs === 'number', 'dbLatencyMs must be numeric');
  });

  await runTest('Deep health telemetry contains Process, CPU & Memory details', () => {
    assert(deepResponse.process !== undefined, 'Process block must be present');
    assert(deepResponse.process.pid > 0, 'PID must be greater than 0');
    assert(deepResponse.process.uptimeSeconds >= 0, 'Uptime must be non-negative');
    assert(deepResponse.process.cpuUsageUserMicroseconds >= 0, 'User CPU must be non-negative');

    assert(deepResponse.memory !== undefined, 'Memory block must be present');
    assert(deepResponse.memory.rssMb > 0, 'RSS memory must be greater than 0 MB');
    assert(deepResponse.memory.heapUsedMb > 0, 'Heap used must be greater than 0 MB');
    assert(deepResponse.memory.heapTotalMb >= deepResponse.memory.heapUsedMb, 'Heap total >= heap used');
  });

  await runTest('Deep health telemetry contains OS memory and CPU core count', () => {
    assert(deepResponse.os !== undefined, 'OS block must be present');
    assert(deepResponse.os.totalMemoryMb > 0, 'Total OS memory must be > 0');
    assert(deepResponse.os.freeMemoryMb > 0, 'Free OS memory must be > 0');
    assert(deepResponse.os.cpuCount > 0, 'CPU core count must be > 0');
    assert(Array.isArray(deepResponse.os.loadAvg), 'Load average must be an array');
  });

  await runTest('Deep health telemetry contains database entity inventory & dual-persistence', () => {
    assert(deepResponse.database !== undefined, 'Database block must be present');
    assert.strictEqual(deepResponse.database.status, 'healthy');
    const counts = deepResponse.database.entityCounts;
    assert(counts !== undefined, 'Entity counts must be present');
    assert(typeof counts.users === 'number');
    assert(typeof counts.lessons === 'number');
    assert(typeof counts.payments === 'number');
    assert(typeof counts.subscriptions === 'number');
    assert(deepResponse.database.dualPersistence !== undefined, 'Dual persistence state must be present');
  });

  await runTest('Deep health telemetry exposes Edge CDN cache status', () => {
    assert(deepResponse.edgeCdn !== undefined, 'edgeCdn block must be present');
    assert(typeof deepResponse.edgeCdn.mode === 'string');
    assert(typeof deepResponse.edgeCdn.totalPurgesExecuted === 'number');
  });

  // -------------------------------------------------------------
  // Test Group 3: Edge CDN Purge API Endpoint (/api/health/purge-cache)
  // -------------------------------------------------------------
  console.log('\n[3/4] Testing Edge CDN Purge Secured API Endpoint (/api/health/purge-cache)...');

  await runTest('POST /api/health/purge-cache rejects unauthenticated calls with HTTP 401', async () => {
    const res = await fetch(`${BASE_URL}/api/health/purge-cache`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls: ['/test.js'] })
    });
    assert.strictEqual(res.status, 401, 'Unauthenticated request must be rejected with 401');
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  await runTest('POST /api/health/purge-cache accepts valid Bearer SRE API Key', async () => {
    const res = await fetch(`${BASE_URL}/api/health/purge-cache`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SRE_KEY}`
      },
      body: JSON.stringify({ urls: ['/assets/main.js', '/assets/index.css'] })
    });

    assert.strictEqual(res.status, 200, `Expected 200 OK with SRE Key, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.result.purgedType, 'urls');
    assert.strictEqual(data.result.count, 2);
  });

  await runTest('POST /api/health/purge-cache supports purgeAll parameter', async () => {
    const res = await fetch(`${BASE_URL}/api/health/purge-cache`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sre-key': SRE_KEY
      },
      body: JSON.stringify({ purgeAll: true })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.result.purgedType, 'everything');
  });

  await runTest('POST /api/health/purge-cache rejects invalid empty body with HTTP 400', async () => {
    const res = await fetch(`${BASE_URL}/api/health/purge-cache`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sre-key': SRE_KEY
      },
      body: JSON.stringify({})
    });

    assert.strictEqual(res.status, 400, 'Empty purge body must return 400 Bad Request');
  });

  // -------------------------------------------------------------
  // Test Group 4: Standard Health Telemetry Regression Check
  // -------------------------------------------------------------
  console.log('\n[4/4] Verifying Standard /api/health Endpoint Integration...');

  await runTest('GET /api/health includes edge CDN telemetry block without breaking existing schema', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
    assert(data.cdn !== undefined, 'CDN block should be present in standard health');
    assert(typeof data.cdn.totalPurgesExecuted === 'number');
  });

  // -------------------------------------------------------------
  // Final Scorecard
  // -------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`🏁 TEST EXECUTION COMPLETE: ${passedTests}/${totalTests} PASSED`);
  console.log('========================================================================');

  if (failures.length > 0) {
    console.error(`\n❌ ${failures.length} Test(s) Failed:`);
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exitCode = 1;
  } else {
    console.log('🎉 ALL SRE DEEP TELEMETRY & EDGE CDN PURGE TESTS PASSED (100%)!\n');
    process.exitCode = 0;
  }
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
