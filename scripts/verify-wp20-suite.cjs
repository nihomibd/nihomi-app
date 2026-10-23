// scripts/verify-wp20-suite.cjs
// Headless Chromium/Edge Browser Verification Suite for NIHOMI WP20
// Tests: Student Dashboard Live Data, Founder Cockpit MRR, RBAC Gate, and Dynamic Recalculation
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BROWSER_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];
const BROWSER_PATH = BROWSER_CANDIDATES.find((p) => fs.existsSync(p));

const EVIDENCE_DIR = path.join(__dirname, '..', 'evidence', 'v2-preview');
const ARTIFACT_DIR = 'C:\\Users\\bdtri\\.gemini\\antigravity\\brain\\638b6452-e297-4f06-b5fe-7e3295c58ed1\\evidence\\v2-preview';

if (!fs.existsSync(EVIDENCE_DIR)) fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function saveScreenshot(page, filename) {
  const localPath = path.join(EVIDENCE_DIR, filename);
  const destPath = path.join(ARTIFACT_DIR, filename);
  try {
    const buffer = await page.screenshot({ fullPage: false });
    fs.writeFileSync(localPath, buffer);
    fs.writeFileSync(destPath, buffer);
    console.log(`  [SCREENSHOT SAVED]: ${filename}`);
  } catch (err) {
    console.warn(`  [Screenshot Warning]: ${filename}:`, err.message);
  }
}

const LOCAL_URL = 'http://127.0.0.1:3000';

async function run() {
  if (!BROWSER_PATH) {
    console.error('Fatal: No Chrome/Edge browser binary found.');
    process.exit(1);
  }

  console.log('================================================================');
  console.log('🚀 NIHOMI WP20: REAL BROWSER EVIDENCE AUDIT — LIVE DASHBOARDS & MRR');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1280,900']
  });

  let totalPassed = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      totalPassed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Step 0: Clear state
    await page.goto(LOCAL_URL, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload({ waitUntil: 'domcontentloaded' });

    // --- TEST 1: Student Login & Student Dashboard Live Metrics ---
    console.log('\n--- TEST 1: Student Login & Live Metrics Sync ---');
    // Login as student
    const studentLoginRes = await fetch(`${LOCAL_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nihomibd@gmail.com', password: 'nihomiStudent2026!' })
    });
    const studentAuth = await studentLoginRes.json();
    assert(studentAuth.success !== false && studentAuth.token, 'Student authentication token acquired');

    // Inject student session into browser
    await page.evaluate((auth) => {
      localStorage.setItem('nihomi_token', auth.token);
      localStorage.setItem('nihomi_user', JSON.stringify(auth.user));
      localStorage.setItem('nihomi_profile', JSON.stringify(auth.profile));
      localStorage.setItem('nihomi_progress', JSON.stringify(auth.progress));
    }, studentAuth);

    // Navigate to student dashboard
    await page.goto(`${LOCAL_URL}/dashboard`, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2000));

    // Verify completed lessons badge
    const completedBadge = await page.$('#student-metric-completed-lessons');
    assert(completedBadge !== null, 'Completed Lessons metric card is rendered');

    // Verify curriculum & tier overview card
    const curriculumOverview = await page.$('#curriculum-tier-overview');
    assert(curriculumOverview !== null, 'Curriculum Roadmap & Tier Transparency card rendered');

    const overviewText = await page.$eval('#curriculum-tier-overview', (el) => el.innerText);
    assert(overviewText.includes('JLPT N5 কারিকুলাম ট্র্যাকার'), 'N5 Curriculum tracker badge visible');
    assert(overviewText.includes('১০০% ফ্রি উপাদান') && overviewText.includes('প্রো সাবস্ক্রিপশন'), 'Clear Free vs Pro Tier distinctions explained');

    await saveScreenshot(page, 'v2-38-wp20-student-dashboard-live-metrics.png');

    // --- TEST 2: Student Blocked from Founder Cockpit (RBAC 403) ---
    console.log('\n--- TEST 2: Student Attempting Founder Cockpit Access ---');
    await page.goto(`${LOCAL_URL}/founder`, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1500));

    const securityGate = await page.$('#founder-security-gate');
    assert(securityGate !== null, 'Founder Security Gate (403) active for student role');

    const gateText = await page.$eval('#founder-security-gate', (el) => el.innerText);
    assert(gateText.includes('403 Forbidden') || gateText.includes('সংরক্ষিত'), 'Security Gate clearly shows 403 Forbidden access denial');

    await saveScreenshot(page, 'v2-39-wp20-founder-security-gate-blocked.png');

    // --- TEST 3: Founder Authenticated Cockpit & Real Dynamic MRR ---
    console.log('\n--- TEST 3: Founder Executive Login & Live Database MRR Telemetry ---');
    // Login as Founder
    const founderLoginRes = await fetch(`${LOCAL_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'mdtanvirkabirbiplob@gmail.com', password: 'nihomiAdmin2026!' })
    });
    const founderAuth = await founderLoginRes.json();
    assert(founderAuth.success !== false && founderAuth.token, 'Founder authentication token acquired');
    assert(founderAuth.user?.role === 'founder' || founderAuth.user?.role === 'admin', 'Founder role validated');

    // Inject founder session into browser
    await page.evaluate((auth) => {
      localStorage.setItem('nihomi_auth_token', auth.token);
      localStorage.setItem('nihomi_token', auth.token);
      localStorage.setItem('nihomi_user', JSON.stringify(auth.user));
      localStorage.setItem('nihomi_profile', JSON.stringify(auth.profile));
    }, founderAuth);

    // Reload page to re-render authenticated Founder Cockpit
    await page.reload({ waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2000));

    const founderCockpit = await page.$('#founder-cockpit');
    assert(founderCockpit !== null, 'Founder Cockpit loaded successfully');

    // Check MRR and metrics
    const cockpitText = await page.$eval('#founder-cockpit', (el) => el.innerText);
    assert(cockpitText.includes('বর্তমান বাস্তব MRR'), 'Real MRR KPI card present');
    assert(!cockpitText.includes('1,699'), 'Fake 1,699 MRR figure is completely absent');
    assert(cockpitText.includes('৳0 BDT') || cockpitText.includes('০ পেইড সাবস্ক্রিপশন'), 'Authentic 0-subscriber baseline rendered truthfully');

    // Verify Financial Ledger
    const ledger = await page.$('#founder-financial-ledger');
    assert(ledger !== null, 'Executive Operations Ledger card rendered');

    await saveScreenshot(page, 'v2-40-wp20-founder-live-telemetry-mrr.png');

    // --- TEST 4: Real Dynamic Subscription Upgrade & Instant MRR Recalculation ---
    console.log('\n--- TEST 4: Real Dynamic Subscription Upgrade & Instant Telemetry Pipeline ---');
    // Fetch live founder summary via API to verify baseline
    const baselineSummaryRes = await fetch(`${LOCAL_URL}/api/founder/summary`, {
      headers: { 'Authorization': `Bearer ${founderAuth.token}` }
    });
    const baselineSummary = await baselineSummaryRes.json();
    const baselineMrr = baselineSummary.business?.currentMrr || 0;
    console.log(`  [TELEMETRY AUDIT]: Baseline MRR = ৳${baselineMrr} BDT`);

    // Dynamically activate a Pro Subscription for a test student in the database
    const subOverrideRes = await fetch(`${LOCAL_URL}/api/admin/subscriptions/usr-student-01/override`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${founderAuth.token}`
      },
      body: JSON.stringify({
        planId: 'pro',
        status: 'active',
        monthsToAdd: 1,
        note: 'WP20 Real Telemetry Verification Audit'
      })
    });
    const subOverride = await subOverrideRes.json();
    assert(subOverride.success === true, 'Admin subscription override executed successfully in durable database');

    // Re-query founder summary API
    const upgradedSummaryRes = await fetch(`${LOCAL_URL}/api/founder/summary`, {
      headers: { 'Authorization': `Bearer ${founderAuth.token}` }
    });
    const upgradedSummary = await upgradedSummaryRes.json();
    const updatedMrr = upgradedSummary.business?.currentMrr || 0;
    const updatedArr = upgradedSummary.business?.arr || 0;
    const proSubscribers = upgradedSummary.business?.subscribersByPlan?.pro || 0;
    console.log(`  [TELEMETRY AUDIT]: Updated MRR = ৳${updatedMrr} BDT (ARR: ৳${updatedArr} BDT), Pro Subs: ${proSubscribers}`);

    assert(updatedMrr === 1990, 'MRR recalculated dynamically to exactly ৳1,990 BDT (Pro plan monthly price)');
    assert(updatedArr === 1990 * 12, 'ARR recalculated dynamically to exactly ৳23,880 BDT');
    assert(proSubscribers === 1, 'Pro subscriber count updated to 1');

    // Refresh Founder Cockpit in browser to verify live DOM reflection
    await page.reload({ waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2000));

    const refreshedText = await page.$eval('#founder-cockpit', (el) => el.innerText);
    assert(refreshedText.includes('1,990'), 'Founder Cockpit UI displays dynamic ৳1,990 BDT MRR');
    assert(refreshedText.includes('23,880'), 'Founder Cockpit UI displays dynamic ৳23,880 BDT ARR');
    assert(refreshedText.includes('1 জন মেম্বার'), 'Founder Cockpit UI displays 1 Pro member');

    await saveScreenshot(page, 'v2-41-wp20-founder-live-mrr-updated-after-sub.png');

    // --- TEST 5: Clean Rollback / State Preservation ---
    console.log('\n--- TEST 5: Clean Rollback & Zero Corruption Preservation ---');
    // Cancel the test subscription back to baseline
    const cancelRes = await fetch(`${LOCAL_URL}/api/admin/subscriptions/usr-student-01/override`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${founderAuth.token}`
      },
      body: JSON.stringify({
        planId: 'free',
        status: 'cancelled',
        monthsToAdd: 0,
        note: 'WP20 Audit Clean Reset'
      })
    });
    const cancelData = await cancelRes.json();
    assert(cancelData.success === true, 'Subscription cleanly reset to maintain uncorrupted production state');

    // Verify MRR returns to 0
    const resetSummaryRes = await fetch(`${LOCAL_URL}/api/founder/summary`, {
      headers: { 'Authorization': `Bearer ${founderAuth.token}` }
    });
    const resetSummary = await resetSummaryRes.json();
    assert((resetSummary.business?.currentMrr || 0) === 0, 'MRR cleanly returns to authentic ৳0 BDT baseline');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1500));
    await saveScreenshot(page, 'v2-42-wp20-founder-live-mrr-restored-clean.png');

  } catch (err) {
    console.error('Test Suite Exception:', err);
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log(`🏁 WP20 TEST RESULTS: ${totalPassed} / ${totalTests} TESTS PASSED`);
  console.log('================================================================\n');

  if (totalPassed < totalTests) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
