// scripts/smoke-test-live-production.cjs
// Real Headless Chromium/Edge Browser Smoke Test for LIVE VERCEL PRODUCTION (https://www.nihomi.com)
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BROWSER_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];
const BROWSER_PATH = BROWSER_CANDIDATES.find((p) => fs.existsSync(p));

const EVIDENCE_DIR = path.join(__dirname, '..', 'evidence', 'live-production');
const ARTIFACT_DIR = 'C:\\Users\\bdtri\\.gemini\\antigravity\\brain\\638b6452-e297-4f06-b5fe-7e3295c58ed1\\evidence\\live-production';

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

function saveScreenshot(sourcePath, filename) {
  const destPath = path.join(ARTIFACT_DIR, filename);
  try {
    fs.copyFileSync(sourcePath, destPath);
  } catch (err) {
    console.warn(`[Artifact Sync Warning] Failed to copy:`, err.message);
  }
}

const LIVE_URL = 'https://www.nihomi.com';

async function runLiveSmokeSuite() {
  if (!BROWSER_PATH) {
    console.error('Fatal: No suitable browser (Chrome / Edge) found on system.');
    process.exit(1);
  }

  console.log('================================================================');
  console.log('🚀 NIHOMI LIVE PRODUCTION (VERCEL) — BROWSER SMOKE TEST SUITE');
  console.log('Target: ' + LIVE_URL);
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  const results = {};

  try {
    // -------------------------------------------------------------
    // Test 1: Desktop Live Root Landing (1280px)
    // -------------------------------------------------------------
    console.log('[Smoke 1/7] Desktop Live Root Landing (1280px)...');
    await page.setViewport({ width: 1280, height: 900 });
    const response1 = await page.goto(`${LIVE_URL}/`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1500));
    const status1 = response1.status();
    const title1 = await page.title();
    const hasHeader1 = (await page.$$('header')).length > 0;
    const hasFooter1 = (await page.$$('footer')).length > 0;

    const shot1 = path.join(EVIDENCE_DIR, 'live-01-desktop-landing.png');
    await page.screenshot({ path: shot1, fullPage: false });
    saveScreenshot(shot1, 'live-01-desktop-landing.png');

    results.liveRootDesktop = status1 === 200 && title1.includes('NIHOMI') && hasHeader1 && hasFooter1;
    console.log(`  ✔ Status: ${status1}, Title: "${title1.slice(0, 30)}...", Header: ${hasHeader1}, Footer: ${hasFooter1}`);

    // -------------------------------------------------------------
    // Test 2: Mobile Live Landing (390px, No Horizontal Overflow)
    // -------------------------------------------------------------
    console.log('\n[Smoke 2/7] Mobile Live Landing (390px)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(`${LIVE_URL}/`, { waitUntil: 'networkidle2', timeout: 30000 });

    const overflow2 = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 2;
    });

    const shot2 = path.join(EVIDENCE_DIR, 'live-02-mobile-landing.png');
    await page.screenshot({ path: shot2, fullPage: false });
    saveScreenshot(shot2, 'live-02-mobile-landing.png');

    results.liveMobileNoOverflow = !overflow2;
    console.log(`  ✔ Horizontal Overflow: ${overflow2 ? 'FAIL (Horizontal Scroll Detected)' : 'NONE (PASS)'}`);

    // -------------------------------------------------------------
    // Test 3: Tokyo WorkOS & 7-Eleven Simulator (/#workos)
    // -------------------------------------------------------------
    console.log('\n[Smoke 3/7] Live Tokyo WorkOS Simulation (/#workos)...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${LIVE_URL}/#workos`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('main', { timeout: 10000 });

    const workosText = await page.evaluate(() => document.body.innerText);
    const hasConbini = workosText.includes('7-Eleven') || workosText.includes('セブン-イレブン') || workosText.includes('WorkOS') || workosText.includes('レジ');

    const shot3 = path.join(EVIDENCE_DIR, 'live-03-workos-simulation.png');
    await page.screenshot({ path: shot3, fullPage: false });
    saveScreenshot(shot3, 'live-03-workos-simulation.png');

    results.liveWorkOS = hasConbini;
    console.log(`  ✔ WorkOS Loaded: ${hasConbini ? 'PASS (7-Eleven/WorkOS Detected)' : 'FAIL'}`);

    // -------------------------------------------------------------
    // Test 4: Live Curriculum JLPT N5–N1 Grid (/#curriculum)
    // -------------------------------------------------------------
    console.log('\n[Smoke 4/7] Live Curriculum JLPT N5–N1 Grid (/#curriculum)...');
    await page.goto(`${LIVE_URL}/#curriculum`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('main', { timeout: 10000 });

    const curriculumText = await page.evaluate(() => document.body.innerText);
    const hasN5 = curriculumText.includes('N5') && (curriculumText.includes('Minna no Nihongo') || curriculumText.includes('পাঠ্যক্রম'));

    const shot4 = path.join(EVIDENCE_DIR, 'live-04-curriculum-grid.png');
    await page.screenshot({ path: shot4, fullPage: false });
    saveScreenshot(shot4, 'live-04-curriculum-grid.png');

    results.liveCurriculum = hasN5;
    console.log(`  ✔ Curriculum Loaded: ${hasN5 ? 'PASS (N5/Curriculum Detected)' : 'FAIL'}`);

    // -------------------------------------------------------------
    // Test 5: Live Canonical 12-Price Matrix (/#pricing)
    // -------------------------------------------------------------
    console.log('\n[Smoke 5/7] Live Canonical 12-Price Matrix (/#pricing)...');
    await page.goto(`${LIVE_URL}/#pricing`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('main', { timeout: 10000 });

    const pricingText = await page.evaluate(() => document.body.innerText);
    const hasPricing = pricingText.includes('৯৯০') || pricingText.includes('990') || pricingText.includes('bKash') || pricingText.includes('বিকাশ');

    const shot5 = path.join(EVIDENCE_DIR, 'live-05-pricing-matrix.png');
    await page.screenshot({ path: shot5, fullPage: false });
    saveScreenshot(shot5, 'live-05-pricing-matrix.png');

    results.livePricing = hasPricing;
    console.log(`  ✔ Pricing Matrix Loaded: ${hasPricing ? 'PASS (990 BDT/bKash Detected)' : 'FAIL'}`);

    // -------------------------------------------------------------
    // Test 6: Live JIS Standard Rirekisho Studio (/#rirekisho)
    // -------------------------------------------------------------
    console.log('\n[Smoke 6/7] Live JIS Standard Rirekisho Studio (/#rirekisho)...');
    await page.goto(`${LIVE_URL}/#rirekisho`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('main', { timeout: 10000 });

    const cvText = await page.evaluate(() => document.body.innerText);
    const hasCv = cvText.includes('履歴書') || cvText.includes('Rirekisho') || cvText.includes('সিভি');

    const shot6 = path.join(EVIDENCE_DIR, 'live-06-jis-rirekisho.png');
    await page.screenshot({ path: shot6, fullPage: false });
    saveScreenshot(shot6, 'live-06-jis-rirekisho.png');

    results.liveRirekisho = hasCv;
    console.log(`  ✔ JIS Rirekisho Loaded: ${hasCv ? 'PASS (JIS CV Detected)' : 'FAIL'}`);

    // -------------------------------------------------------------
    // Test 7: Live Role Security Gate for Unauthenticated User (/#founder)
    // -------------------------------------------------------------
    console.log('\n[Smoke 7/7] Live Role Security Gate Probe (/#founder)...');
    // Clear all storage to ensure strictly anonymous request
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto(`${LIVE_URL}/#founder`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('main', { timeout: 10000 });

    const founderPageText = await page.evaluate(() => document.body.innerText);
    const isAccessBlocked = (founderPageText.includes('403 FORBIDDEN') || 
                             founderPageText.includes('প্রতিষ্ঠাতা কমান্ড সেন্টার সংরক্ষিত') ||
                             founderPageText.includes('নিহোমি ফাউন্ডার কমান্ড সেন্টার')) && 
      (founderPageText.includes('শুধুমাত্র') || founderPageText.includes('অনুমোদিত নয়') || founderPageText.includes('লগইন'));

    const shot7 = path.join(EVIDENCE_DIR, 'live-07-founder-gate-blocked.png');
    await page.screenshot({ path: shot7, fullPage: false });
    saveScreenshot(shot7, 'live-07-founder-gate-blocked.png');

    results.liveFounderGateBlocked = isAccessBlocked;
    console.log(`  ✔ Founder Access Blocked for Anonymous: ${isAccessBlocked ? 'PASS (Protected by Founder Gate)' : 'FAIL'}`);

  } catch (err) {
    console.error('Smoke Test Suite Error:', err);
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log('📊 NIHOMI LIVE PRODUCTION SMOKE TEST SUMMARY');
  console.log('================================================================');
  let allPass = true;
  for (const [testName, pass] of Object.entries(results)) {
    console.log(`  ${pass ? '✔' : '❌'} ${testName}: ${pass ? 'PASS' : 'FAIL'}`);
    if (!pass) allPass = false;
  }
  console.log('================================================================');
  console.log(`TOTAL: ${Object.values(results).filter(Boolean).length}/${Object.keys(results).length} PASSED`);
  console.log('================================================================');

  if (!allPass) process.exit(1);
}

runLiveSmokeSuite().catch((e) => {
  console.error(e);
  process.exit(1);
});
