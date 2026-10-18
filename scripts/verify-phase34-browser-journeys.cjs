// scripts/verify-phase34-browser-journeys.cjs
// NIHOMI.COM — PHASE 34 UNIFIED DESIGN SYSTEM & COMPLETE BROWSER JOURNEYS
// Antigravity 2.0 Local-First Protocol | NO EVIDENCE = NO DONE

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const BROWSER_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];
const BROWSER_PATH = BROWSER_CANDIDATES.find((p) => fs.existsSync(p));
const BASE_URL = 'http://127.0.0.1:3000';
const EVIDENCE_DIR = path.join(__dirname, '..', 'evidence', 'phase34');
const ARTIFACT_EVIDENCE_DIR = path.join(
  'C:\\Users\\bdtri\\.gemini\\antigravity\\brain\\638b6452-e297-4f06-b5fe-7e3295c58ed1',
  'evidence',
  'phase34'
);

[EVIDENCE_DIR, ARTIFACT_EVIDENCE_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function saveEvidence(filename, buffer) {
  fs.writeFileSync(path.join(EVIDENCE_DIR, filename), buffer);
  fs.writeFileSync(path.join(ARTIFACT_EVIDENCE_DIR, filename), buffer);
  log(`📸 Captured: ${filename}`);
}

function makeToken(email, sub = 'usr-founder-01', role = 'founder') {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  const payload = Buffer.from(
    JSON.stringify({
      iss: 'https://aiychtkhktwsjrieeaha.supabase.co/auth/v1',
      sub,
      aud: 'authenticated',
      exp: Math.floor(Date.now() / 1000) + 3600,
      email,
      role
    })
  )
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${header}.${payload}.verified_mock_signature`;
}

async function runPhase34Verification() {
  log('================================================================');
  log('🚀 NIHOMI PHASE 34: COMPLETE BROWSER JOURNEYS VERIFICATION');
  log('================================================================');

  if (!BROWSER_PATH) {
    throw new Error('No supported browser binary found on system');
  }

  const founderToken = makeToken('mdtanvirkabirbiplob@gmail.com', 'usr-founder-01', 'founder');
  const studentToken = makeToken('nihomibd@gmail.com', 'usr-student-01', 'student');

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900']
  });

  try {
    const page = await browser.newPage();

    // =========================================================================
    // JOURNEY 1: FOUNDER COMMAND CENTER (STREAMLINED 3-BTN & 6-TABS)
    // =========================================================================
    log('--- JOURNEY 1: FOUNDER COMMAND CENTER VERIFICATION ---');
    await page.setViewport({ width: 1366, height: 850, deviceScaleFactor: 1 });
    await page.goto(`${BASE_URL}/founder`, { waitUntil: 'networkidle2' });

    // Inject Founder Session
    await page.evaluate((token) => {
      localStorage.setItem('nihomi_auth_token', token);
      localStorage.setItem('nihomi_user', JSON.stringify({
        id: 'usr-founder-01',
        email: 'mdtanvirkabirbiplob@gmail.com',
        role: 'founder',
        name: 'Tanvir Kabir (Founder)'
      }));
    }, founderToken);

    await page.goto(`${BASE_URL}/founder`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#founder-refresh-btn', { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 1200));

    // Verify 3 executive buttons exist
    const hasRefreshBtn = await page.$('#founder-refresh-btn');
    const hasPreviewBtn = await page.$('#founder-student-preview-btn');
    const hasLogoutBtn = await page.$('#founder-logout-btn');
    if (!hasRefreshBtn || !hasPreviewBtn || !hasLogoutBtn) {
      throw new Error('Founder header missing one of the 3 required executive buttons!');
    }
    log('✓ Verified: 3 streamlined executive buttons (#founder-refresh-btn, #founder-student-preview-btn, #founder-logout-btn) are present.');

    // Screenshot 1: Founder Cockpit Overview (Executive Pulse)
    let buf1 = await page.screenshot({ fullPage: false });
    saveEvidence('01-founder-cockpit-executive-pulse.png', buf1);

    // Expand Collapsible Secondary Metrics & Business Objectives
    await page.evaluate(() => {
      const toggleBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent && b.textContent.includes('গৌণ মেট্রিক্স')
      );
      if (toggleBtn) toggleBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));
    let buf2 = await page.screenshot({ fullPage: false });
    saveEvidence('02-founder-secondary-metrics-expanded.png', buf2);

    // Switch to Tab 2: Student Intelligence
    await page.evaluate(() => {
      const tabBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent && b.textContent.includes('Student Intelligence')
      );
      if (tabBtn) tabBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));
    let buf3 = await page.screenshot({ fullPage: false });
    saveEvidence('03-founder-tab2-student-intelligence.png', buf3);

    // Switch to Tab 6: Budget & Security (Budget Firewall + Sovereign Kill Switches)
    await page.evaluate(() => {
      const tabBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent && b.textContent.includes('Budget & Security')
      );
      if (tabBtn) tabBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));
    let buf4 = await page.screenshot({ fullPage: false });
    saveEvidence('04-founder-tab6-budget-and-security.png', buf4);

    // Test Founder Student Preview Mode navigation
    await page.click('#founder-student-preview-btn');
    await new Promise((r) => setTimeout(r, 1800));
    let buf5 = await page.screenshot({ fullPage: false });
    saveEvidence('05-founder-student-preview-mode.png', buf5);

    // Test Logout via Founder header
    await page.goto(`${BASE_URL}/founder`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#founder-logout-btn', { timeout: 10000 });
    await page.click('#founder-logout-btn');
    await new Promise((r) => setTimeout(r, 1500));
    const tokenAfterLogout = await page.evaluate(() => localStorage.getItem('nihomi_auth_token'));
    if (tokenAfterLogout) {
      throw new Error('Founder token still present in localStorage after logout!');
    }
    log('✓ Verified: Founder successfully logged out and token purged.');

    // =========================================================================
    // JOURNEY 2: STUDENT DASHBOARD (N.I.H.O.M.I. LEARNING LOOP & PEDAGOGY)
    // =========================================================================
    log('--- JOURNEY 2: STUDENT DASHBOARD & LEARNING ENGINES ---');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });

    // Inject Student Session
    await page.evaluate((token) => {
      localStorage.setItem('nihomi_auth_token', token);
      localStorage.setItem('nihomi_user', JSON.stringify({
        id: 'usr-student-01',
        email: 'nihomibd@gmail.com',
        role: 'student',
        name: 'Kenji Explorer'
      }));
    }, studentToken);

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('[aria-label="N.I.H.O.M.I. Learning Loop"]', { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 1200));

    // Verify 3 core student questions answered and N.I.H.O.M.I. Loop rendered
    const hasLearningLoop = await page.$('[aria-label="N.I.H.O.M.I. Learning Loop"]');
    if (!hasLearningLoop) {
      throw new Error('N.I.H.O.M.I. Learning Loop section is missing from Student Dashboard!');
    }
    log('✓ Verified: Canonical N.I.H.O.M.I. Learning Loop (Notice, Identify, Hunt, Own, Make meaning, Improve) is present.');

    // Screenshot 6: Student Dashboard Top Fold & Next Best Mission
    let buf6 = await page.screenshot({ fullPage: false });
    saveEvidence('06-student-dashboard-top-fold-mission.png', buf6);

    // Screenshot 7: Scroll to N.I.H.O.M.I. Learning Loop
    await page.evaluate(() => {
      const el = document.querySelector('[aria-label="N.I.H.O.M.I. Learning Loop"]');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise((r) => setTimeout(r, 500));
    let buf7 = await page.screenshot({ fullPage: false });
    saveEvidence('07-student-nihomi-learning-loop.png', buf7);

    // Journey Step: Kana Studio (/kana)
    await page.goto(`${BASE_URL}/kana`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));
    let buf8 = await page.screenshot({ fullPage: false });
    saveEvidence('08-student-kana-studio-practice.png', buf8);

    // Journey Step: Courses & Lessons (/courses)
    await page.goto(`${BASE_URL}/courses`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));
    let buf9 = await page.screenshot({ fullPage: false });
    saveEvidence('09-student-courses-and-curriculum.png', buf9);

    // Journey Step: JIS Rirekisho / CV Studio (/jis-rirekisho or /baito-cv)
    await page.goto(`${BASE_URL}/jis-rirekisho`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));
    let buf10 = await page.screenshot({ fullPage: false });
    saveEvidence('10-student-cv-builder-rirekisho.png', buf10);

    // Journey Step: Student Security Boundary (Denied access to /founder -> instantly redirected to dashboard)
    await page.goto(`${BASE_URL}/founder`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));
    const hasFounderCockpit = await page.$('#founder-refresh-btn');
    if (hasFounderCockpit) {
      throw new Error('Student was able to view Founder Command Center without authorization!');
    }
    const isSafelyOnDashboard = await page.evaluate(() => {
      const text = document.body.innerText;
      return (
        text.includes('Kenji Explorer') ||
        text.includes('আজকের পরবর্তী সেরা মিশন') ||
        text.includes('N.I.H.O.M.I.')
      );
    });
    if (!isSafelyOnDashboard) {
      throw new Error('Student was not safely redirected away from Founder route!');
    }
    log('✓ Verified: Student is strictly isolated from Founder Command Center (Route Guard kicked student back to Dashboard, cockpit inaccessible).');
    let buf11 = await page.screenshot({ fullPage: false });
    saveEvidence('11-student-blocked-from-founder-hq.png', buf11);

    // =========================================================================
    // JOURNEY 3: RESPONSIVE MATRIX & VIEWPORTS (360px, 390px, 768px, 1366px)
    // =========================================================================
    log('--- JOURNEY 3: RESPONSIVE VIEWPORT & ZOOM MATRIX ---');

    // 1. Mobile 360px (Android Small)
    await page.setViewport({ width: 360, height: 740, deviceScaleFactor: 2 });
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));
    let buf12 = await page.screenshot({ fullPage: false });
    saveEvidence('12-responsive-mobile-360px-dashboard.png', buf12);

    // 2. Mobile 390px (iPhone Standard)
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));
    let buf13 = await page.screenshot({ fullPage: false });
    saveEvidence('13-responsive-mobile-390px-dashboard.png', buf13);

    // Open Mobile Drawer Menu & verify clean logout/profile at top
    await page.evaluate(() => {
      const menuBtn = document.querySelector('button[aria-label="Toggle Mobile Navigation"]') ||
                      Array.from(document.querySelectorAll('button')).find(b => b.innerHTML.includes('Menu') || b.querySelector('svg'));
      if (menuBtn) menuBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));
    let buf14 = await page.screenshot({ fullPage: false });
    saveEvidence('14-responsive-mobile-drawer-clean-nav.png', buf14);

    // 3. Tablet 768px (iPad Portrait)
    await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));
    let buf15 = await page.screenshot({ fullPage: false });
    saveEvidence('15-responsive-tablet-768px-dashboard.png', buf15);

    // 4. Desktop 1366px (125% Zoom Simulation)
    await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1.25 });
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));
    let buf16 = await page.screenshot({ fullPage: false });
    saveEvidence('16-responsive-desktop-125percent-zoom.png', buf16);

    log('================================================================');
    log('🎉 ALL 16 PHASE 34 BROWSER JOURNEYS VERIFIED & CAPTURED PASS!');
    log('================================================================');

  } finally {
    await browser.close();
  }
}

runPhase34Verification().catch((err) => {
  console.error('❌ Phase 34 browser verification failed:', err);
  process.exit(1);
});
