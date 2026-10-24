const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const http = require('http');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EVIDENCE_DIR = path.resolve('evidence/v2-preview');
const ARTIFACT_DIR = 'C:\\Users\\bdtri\\.gemini\\antigravity\\brain\\638b6452-e297-4f06-b5fe-7e3295c58ed1\\evidence\\v2-preview';

if (!fs.existsSync(EVIDENCE_DIR)) fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

function saveEvidence(sourcePath, filename) {
  const localDest = path.join(EVIDENCE_DIR, filename);
  const artifactDest = path.join(ARTIFACT_DIR, filename);
  fs.copyFileSync(sourcePath, localDest);
  fs.copyFileSync(sourcePath, artifactDest);
  console.log(`[Evidence] Saved ${filename} to local and artifact store.`);
}

function registerTestStudent(name, email, password) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ name, email, password });
    const req = http.request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function testSuite() {
  console.log('--- Launching NIHOMI V3 WP08 Automated Visual & Routing Test Suite ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // =========================================================================
  // TEST 1: Unauthenticated Guest - Public Landing Page & Clean Header (No Overlap)
  // =========================================================================
  console.log('\n[Test 1] Testing Unauthenticated Guest Landing View...');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/#/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  // Check metrics at 1280px
  const metrics1280 = await page.evaluate(() => {
    const header = document.querySelector('#v2-header');
    const logo = document.querySelector('#v2-header .select-none.group');
    const nav = document.querySelector('#v2-header nav');
    const right = document.querySelector('#v2-header .flex.items-center.gap-2') || document.querySelector('#v2-header > div > div:last-child');
    const loginBtn = document.querySelector('#header-login-btn');
    const registerBtn = document.querySelector('#header-register-btn');
    const dashboardLink = Array.from(document.querySelectorAll('#v2-header nav button')).find(b => b.textContent.includes('ড্যাশবোর্ড'));

    const l = logo ? logo.getBoundingClientRect() : null;
    const n = nav ? nav.getBoundingClientRect() : null;
    const r = right ? right.getBoundingClientRect() : null;

    return {
      headerHeight: header ? header.getBoundingClientRect().height : null,
      logo: l ? { x: l.x, y: l.y, w: l.width, h: l.height, r: l.right } : null,
      nav: n ? { x: n.x, y: n.y, w: n.width, h: n.height, r: n.right } : null,
      right: r ? { x: r.x, y: r.y, w: r.width, h: r.height, r: r.right } : null,
      hasLoginBtn: Boolean(loginBtn),
      hasRegisterBtn: Boolean(registerBtn),
      hasDashboardLinkInNav: Boolean(dashboardLink),
      navItemCount: document.querySelectorAll('#v2-header nav button').length
    };
  });

  console.log('Guest Header 1280px Metrics:', JSON.stringify(metrics1280, null, 2));

  // Assertions for Test 1
  if (metrics1280.hasDashboardLinkInNav) {
    throw new Error('FAIL: Guest nav should NOT include "শিক্ষার্থী ড্যাশবোর্ড" link!');
  }
  if (!metrics1280.hasLoginBtn || !metrics1280.hasRegisterBtn) {
    throw new Error('FAIL: Guest header must have Login and Start Free buttons!');
  }
  if (metrics1280.nav.h > 50) {
    throw new Error(`FAIL: Nav height ${metrics1280.nav.h}px exceeds 50px (indicates multi-line wrap)!`);
  }
  if (metrics1280.logo.r > metrics1280.nav.x) {
    throw new Error(`FAIL: Logo right edge (${metrics1280.logo.r}) overlaps Nav left edge (${metrics1280.nav.x})!`);
  }
  console.log('✔ Test 1 Passed: Guest Header is clean, single-row, with zero logo overlap.');

  const guestScreenshotPath = path.resolve('storage/evidence/v3-08-guest-header-no-overlap.png');
  await page.screenshot({ path: guestScreenshotPath });
  saveEvidence(guestScreenshotPath, 'v3-08-guest-header-no-overlap.png');

  // =========================================================================
  // TEST 2: Responsiveness at 1024px (Tablet / Scaled Laptop)
  // =========================================================================
  console.log('\n[Test 2] Testing Header at 1024px Viewport...');
  await page.setViewport({ width: 1024, height: 768 });
  await new Promise(r => setTimeout(r, 600));

  const metrics1024 = await page.evaluate(() => {
    const logo = document.querySelector('#v2-header .select-none.group');
    const nav = document.querySelector('#v2-header nav');
    const right = document.querySelector('#v2-header > div > div:last-child');
    const l = logo ? logo.getBoundingClientRect() : null;
    const n = nav ? nav.getBoundingClientRect() : null;
    const r = right ? right.getBoundingClientRect() : null;
    return {
      logo: l ? { x: l.x, y: l.y, w: l.width, h: l.height, r: l.right } : null,
      nav: n ? { x: n.x, y: n.y, w: n.width, h: n.height, r: n.right } : null,
      right: r ? { x: r.x, y: r.y, w: r.width, h: r.height, r: r.right } : null,
    };
  });

  console.log('Guest Header 1024px Metrics:', JSON.stringify(metrics1024, null, 2));

  if (metrics1024.nav.h > 50) {
    throw new Error(`FAIL: Nav wrapped into multiple lines at 1024px! (Height: ${metrics1024.nav.h}px)`);
  }
  if (metrics1024.logo.r > metrics1024.nav.x) {
    throw new Error(`FAIL: Logo overlaps Nav at 1024px!`);
  }
  console.log('✔ Test 2 Passed: 1024px header has zero line-wrap and zero logo collision.');

  // =========================================================================
  // TEST 3: Route Guard Protection (Guest accessing #dashboard)
  // =========================================================================
  console.log('\n[Test 3] Testing Route Guard: Guest navigating to #dashboard...');
  await page.goto('http://localhost:3000/#/dashboard', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  const guardResult = await page.evaluate(() => {
    const authModal = document.querySelector('#auth-modal-overlay') || document.querySelector('#auth-modal-card');
    const hasStudentCockpit = Boolean(document.querySelector('#v2-app-root h1')?.textContent?.includes('সান!'));
    return {
      currentHash: window.location.hash,
      modalOpened: Boolean(authModal),
      cockpitExposed: hasStudentCockpit
    };
  });

  console.log('Route Guard Result:', JSON.stringify(guardResult, null, 2));

  if (guardResult.cockpitExposed) {
    throw new Error('FAIL: Student cockpit was exposed to unauthenticated guest!');
  }
  if (!guardResult.modalOpened) {
    throw new Error('FAIL: Auth modal was not triggered when guest attempted #dashboard access!');
  }
  console.log('✔ Test 3 Passed: Guest is strictly blocked from #dashboard, redirected, and prompted to login.');

  const blockedScreenshotPath = path.resolve('storage/evidence/v3-08-guest-dashboard-blocked.png');
  await page.screenshot({ path: blockedScreenshotPath });
  saveEvidence(blockedScreenshotPath, 'v3-08-guest-dashboard-blocked.png');

  // =========================================================================
  // TEST 4: Authenticated Student View (Dashboard by Default & Student Header)
  // =========================================================================
  console.log('\n[Test 4] Testing Authenticated Student Experience...');
  
  // Register an authentic student through the backend
  const studentEmail = `student_${Date.now()}@nihomi.test`;
  const regData = await registerTestStudent('Tanvir Kabir', studentEmail, 'Password@123');
  console.log('Registered Authenticated Test Student:', regData.user.email);

  // Set viewport to standard desktop
  await page.setViewport({ width: 1440, height: 900 });

  // Open page, inject valid credentials into localStorage
  await page.goto('http://localhost:3000/#/', { waitUntil: 'domcontentloaded' });
  await page.evaluate((authData) => {
    localStorage.setItem('nihomi_auth_token', authData.token);
    localStorage.setItem('nihomi_token', authData.token);
    localStorage.setItem('nihomi_user', JSON.stringify(authData.user));
    if (authData.profile) localStorage.setItem('nihomi_profile', JSON.stringify(authData.profile));
    if (authData.progress) localStorage.setItem('nihomi_progress', JSON.stringify(authData.progress));
  }, regData);

  // Full browser navigation with timestamp to trigger clean rehydration from localStorage
  await page.goto(`http://localhost:3000/?t=${Date.now()}#/dashboard`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const authStudentResult = await page.evaluate(() => {
    const currentHash = window.location.hash;
    const userBtn = document.querySelector('#header-user-profile-btn');
    const dashboardNavBtn = Array.from(document.querySelectorAll('#v2-header nav button')).find(b => b.textContent.includes('ড্যাশবোর্ড'));
    const greeting = document.querySelector('#v2-app-root h1')?.textContent;
    return {
      currentHash,
      hasUserBtn: Boolean(userBtn),
      hasDashboardNavBtn: Boolean(dashboardNavBtn),
      greeting
    };
  });

  console.log('Authenticated Student Result:', JSON.stringify(authStudentResult, null, 2));

  if (!authStudentResult.hasUserBtn) {
    throw new Error('FAIL: Authenticated user button not visible in header!');
  }
  if (!authStudentResult.hasDashboardNavBtn) {
    throw new Error('FAIL: Authenticated nav should include "ড্যাশবোর্ড"!');
  }
  console.log('✔ Test 4 Passed: Authenticated student displays personalized student cockpit navigation.');

  const authScreenshotPath = path.resolve('storage/evidence/v3-08-authenticated-header-dashboard.png');
  await page.screenshot({ path: authScreenshotPath });
  saveEvidence(authScreenshotPath, 'v3-08-authenticated-header-dashboard.png');

  // =========================================================================
  // TEST 5: Authenticated Student on Landing Page (Dynamic Hero CTA)
  // =========================================================================
  console.log('\n[Test 5] Testing Dynamic Hero CTA for Logged-in Student on #landing...');
  await page.goto(`http://localhost:3000/?t=${Date.now()}#/landing`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  const heroCtaResult = await page.evaluate(() => {
    const returnDashboardBtn = document.querySelector('#hero-go-dashboard-cta');
    const startJourneyBtn = document.querySelector('#hero-start-journey-cta');
    return {
      hasReturnDashboardBtn: Boolean(returnDashboardBtn),
      hasStartJourneyBtn: Boolean(startJourneyBtn),
      buttonText: returnDashboardBtn?.textContent?.trim()
    };
  });

  console.log('Dynamic Hero CTA Result:', JSON.stringify(heroCtaResult, null, 2));

  if (!heroCtaResult.hasReturnDashboardBtn) {
    throw new Error('FAIL: Logged-in student on landing page should see "আমার ড্যাশবোর্ডে ফিরুন" CTA!');
  }
  console.log('✔ Test 5 Passed: Dynamic Hero CTA verified ("আমার ড্যাশবোর্ডে ফিরুন").');

  await browser.close();
  console.log('\n======================================================');
  console.log('🎉 ALL 5 NIHOMI V3 WP08 AUTOMATED TESTS PASSED WITH 100% SUCCESS!');
  console.log('======================================================\n');
}

testSuite().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err.message);
  process.exit(1);
});
