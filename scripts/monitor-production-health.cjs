/**
 * NIHOMI PRODUCTION HEALTH & LATENCY MONITOR
 * Automated Production Health Probe for Nihomi.com
 */

const dns = require('dns').promises;

const PRODUCTION_URL = 'https://www.nihomi.com';
const TIMEOUT_MS = 6000;

let passes = 0;
let fails = 0;

function assert(condition, testName) {
  if (condition) {
    passes++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    fails++;
    console.error(`  ❌ FAIL: ${testName}`);
  }
}

async function fetchProbe(url, options = {}) {
  const start = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Nihomi-Health-Monitor/2.0',
        ...(options.headers || {})
      }
    });
    clearTimeout(timer);
    return {
      status: res.status,
      durationMs: Date.now() - start,
      headers: Object.fromEntries(res.headers.entries()),
      res
    };
  } catch (err) {
    clearTimeout(timer);
    return {
      status: 'EXCEPTION',
      error: err.message,
      durationMs: Date.now() - start
    };
  }
}

async function runProductionHealthCheck() {
  console.log('================================================================');
  console.log('🩺 NIHOMI PRODUCTION PLATFORM HEALTH & UPTIME MONITOR');
  console.log(`   Target: ${PRODUCTION_URL} | Timestamp: ${new Date().toISOString()}`);
  console.log('================================================================\n');

  // 1. DNS Resolution
  console.log('[1. DNS RESOLUTION & IP HEALTH]');
  try {
    const records = await dns.resolve4('www.nihomi.com');
    assert(records && records.length > 0, `DNS resolution OK (${records.join(', ')})`);
  } catch (err) {
    assert(false, `DNS resolution failed: ${err.message}`);
  }

  // 2. Apex / WWW HTTPS Connectivity & Latency
  console.log('\n[2. HTTPS EDGE CONNECTIVITY & LATENCY]');
  const homeProbe = await fetchProbe(PRODUCTION_URL);
  assert(homeProbe.status === 200, `Home page responds with HTTP 200 (took ${homeProbe.durationMs}ms)`);
  assert(homeProbe.durationMs < 2000, `Latency within acceptable edge threshold (<2000ms: actual ${homeProbe.durationMs}ms)`);

  // 3. API Health & AI Provider Telemetry
  console.log('\n[3. BACKEND API & AI SENSEI HEALTH]');
  const apiProbe = await fetchProbe(`${PRODUCTION_URL}/api/health`);
  assert(apiProbe.status === 200, `API /api/health responds with HTTP 200 (took ${apiProbe.durationMs}ms)`);
  if (apiProbe.status === 200) {
    try {
      const data = await apiProbe.res.json();
      assert(data.status === 'ok', 'API payload status is "ok"');
      assert(data.aiEngine && data.aiEngine.keyConfigured === true, 'Sensei AI engine configured and operational');
      console.log(`     AI Provider: ${data.aiEngine?.provider || 'Unknown'}`);
    } catch (e) {
      assert(false, `Failed to parse /api/health JSON: ${e.message}`);
    }
  }

  // 4. Critical Metadata & Public Assets
  console.log('\n[4. CRITICAL PUBLIC METADATA ASSETS]');
  const assets = ['/robots.txt', '/sitemap.xml', '/llms.txt', '/indexnow-key.txt', '/manifest.json'];
  for (const asset of assets) {
    const probe = await fetchProbe(`${PRODUCTION_URL}${asset}`);
    assert(probe.status === 200, `Public asset ${asset} accessible with HTTP 200 (took ${probe.durationMs}ms)`);
  }

  // 5. Unauthenticated Founder Protection
  console.log('\n[5. ROLE ISOLATION & EXECUTIVE API SECURITY]');
  const founderProbe = await fetchProbe(`${PRODUCTION_URL}/api/founder/summary`);
  assert(founderProbe.status === 401, 'Unauthorized request to /api/founder/summary correctly blocked with 401');

  // Summary
  console.log('\n================================================================');
  console.log(`🎯 HEALTH CHECK SUMMARY: ${passes} / ${passes + fails} CHECKS PASSED`);
  if (fails === 0) {
    console.log('🏆 NIHOMI PRODUCTION INFRASTRUCTURE FULLY HEALTHY & OPERATIONAL');
  } else {
    console.log(`⚠️ DETECTED ${fails} WARNING(S) DURING HEALTH CHECK`);
  }
  console.log('================================================================\n');

  if (fails > 0) {
    process.exit(1);
  }
}

runProductionHealthCheck().catch((err) => {
  console.error('Fatal health monitor error:', err);
  process.exit(1);
});
