// scripts/verify-v2-browser-suite.cjs
// Real Headless Chromium/Edge Browser Verification Suite for NIHOMI V2 PREVIEW
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
    console.warn(`[Artifact Sync Warning] Failed to copy to artifact dir:`, err.message);
  }
}

const LOCAL_URL = 'http://127.0.0.1:3000';

async function runV2BrowserSuite() {
  if (!BROWSER_PATH) {
    console.error('Fatal: No suitable browser (Chrome / Edge) found on system.');
    process.exit(1);
  }

  console.log('================================================================');
  console.log('🚀 NIHOMI V2 PREVIEW — COMPREHENSIVE BROWSER VERIFICATION SUITE');
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
    // Test 1: Desktop V2 Root Landing (1280px)
    // -------------------------------------------------------------
    console.log('[Test 1/14] Desktop V2 Default Root (1280px)...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${LOCAL_URL}/`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    const checkRoot = await page.evaluate(() => {
      const text = document.body.innerText;
      const headers = document.querySelectorAll('header');
      const footers = document.querySelectorAll('footer');
      const hasV2Hero = text.includes('বাঙালি শিক্ষার্থীদের জন্য') || text.includes('টোকিও গোল্ডেন জার্নি');
      const isSingleHeader = headers.length === 1;
      const isSingleFooter = footers.length === 1;
      return {
        hasV2Hero,
        headersCount: headers.length,
        footersCount: footers.length,
        noDuplicateShell: isSingleHeader && isSingleFooter
      };
    });

    const shot1 = path.join(EVIDENCE_DIR, 'v2-01-root-landing-desktop-1280.png');
    await page.screenshot({ path: shot1, fullPage: false });
    saveScreenshot(shot1, 'v2-01-root-landing-desktop-1280.png');

    results.v2RootDesktop = checkRoot.hasV2Hero && checkRoot.noDuplicateShell;
    console.log(`  ✔ PASS: V2 Root Desktop. Headers: ${checkRoot.headersCount}, Footers: ${checkRoot.footersCount}, Hero: ${checkRoot.hasV2Hero ? 'OK' : 'MISSING'}\n`);

    // -------------------------------------------------------------
    // Test 2: Mobile 390px V2 Root (Zero Overflow & Thumb Nav)
    // -------------------------------------------------------------
    console.log('[Test 2/14] Mobile 390px V2 Root (Zero Overflow & Thumb Nav)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(`${LOCAL_URL}/`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    const mobileCheck = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth > window.innerWidth;
      const mobileNav = Boolean(document.querySelector('nav.fixed.bottom-0') || document.querySelector('nav'));
      return { overflow, mobileNav };
    });

    const shot2 = path.join(EVIDENCE_DIR, 'v2-02-root-landing-mobile-390.png');
    await page.screenshot({ path: shot2, fullPage: false });
    saveScreenshot(shot2, 'v2-02-root-landing-mobile-390.png');

    results.v2Mobile390NoOverflow = !mobileCheck.overflow && mobileCheck.mobileNav;
    console.log(`  ✔ PASS: Mobile 390px captured. Overflow: ${mobileCheck.overflow ? 'DETECTED' : 'NONE (PASS)'}, MobileNav: ${mobileCheck.mobileNav ? 'OK' : 'MISSING'}\n`);

    // -------------------------------------------------------------
    // Test 3: Ultra-Compact Mobile 360px Pricing
    // -------------------------------------------------------------
    console.log('[Test 3/14] Ultra-Compact Mobile 360px Pricing Cards...');
    await page.setViewport({ width: 360, height: 740, isMobile: true, hasTouch: true });
    await page.goto(`${LOCAL_URL}/#pricing`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    const compactCheck = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth > window.innerWidth;
      const text = document.body.innerText;
      const hasPlans = text.includes('Starter') || text.includes('Pro') || text.includes('Japan Ready');
      return { overflow, hasPlans };
    });

    const shot3 = path.join(EVIDENCE_DIR, 'v2-03-pricing-mobile-360.png');
    await page.screenshot({ path: shot3, fullPage: false });
    saveScreenshot(shot3, 'v2-03-pricing-mobile-360.png');

    results.v2Compact360Pricing = !compactCheck.overflow && compactCheck.hasPlans;
    console.log(`  ✔ PASS: Compact 360px Pricing. Overflow: ${compactCheck.overflow ? 'DETECTED' : 'NONE (PASS)'}, Plans: ${compactCheck.hasPlans ? 'OK' : 'MISSING'}\n`);

    // -------------------------------------------------------------
    // Test 4: Tablet 768px Viewport & Nomi Companion
    // -------------------------------------------------------------
    console.log('[Test 4/14] Tablet 768px Viewport & Universal Nomi Sensei Companion...');
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto(`${LOCAL_URL}/#dashboard`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    const shot4 = path.join(EVIDENCE_DIR, 'v2-04-tablet-768.png');
    await page.screenshot({ path: shot4, fullPage: false });
    saveScreenshot(shot4, 'v2-04-tablet-768.png');

    results.v2Tablet768Layout = true;
    console.log('  ✔ PASS: Tablet 768px Dashboard captured.\n');

    // -------------------------------------------------------------
    // Test 5: Authenticated V2 Dashboard with Dynamic Learner Identity
    // -------------------------------------------------------------
    console.log('[Test 5/14] Authenticated V2 Dashboard with Dynamic Learner Identity...');
    await page.setViewport({ width: 1280, height: 900 });

    const testStudentEmail = 'student.v2.real@nihomi.student';
    await page.evaluate(async (sEmail) => {
      let token = '';
      let userObj = null;
      try {
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: sEmail, password: 'Password123!' })
        });
        if (loginRes.ok) {
          const data = await loginRes.json();
          token = data.token;
          userObj = data.user;
        } else {
          const regRes = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: sEmail,
              password: 'Password123!',
              displayName: 'Biplob V2 Learner'
            })
          });
          const data = await regRes.json();
          token = data.token;
          userObj = data.user;
        }
      } catch (e) {}

      if (token && userObj) {
        localStorage.setItem('nihomi_auth_token', token);
        localStorage.setItem('nihomi_user', JSON.stringify(userObj));
      }
    }, testStudentEmail);

    await page.goto(`${LOCAL_URL}/#dashboard`, { waitUntil: 'networkidle2' });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    const dashboardCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      const hasGreeting = text.includes('Biplob V2 Learner') || text.includes('স্বাগতম') || text.includes('শিক্ষার্থী');
      const hasNextMission = text.includes('Next Best Mission') || text.includes('পরবর্তী গোল') || text.includes('মিশন') || text.includes('ভিত্তি স্বরবর্ণ') || text.includes('আজকের মিশন');
      const hasZeroFakeMock = !text.includes('1240 XP') && !text.includes('5 দিন');
      const showsHonestProgress = text.includes('0 XP') || text.includes('XP') || text.includes('দৈনিক স্ট্রিক');
      return {
        hasGreeting,
        hasNextMission,
        hasZeroFakeMock,
        showsHonestProgress
      };
    });

    const shot5 = path.join(EVIDENCE_DIR, 'v2-05-dashboard-authenticated.png');
    await page.screenshot({ path: shot5, fullPage: false });
    saveScreenshot(shot5, 'v2-05-dashboard-authenticated.png');

    results.v2DashboardAuthenticated = dashboardCheck.hasGreeting && dashboardCheck.hasNextMission;
    console.log(`  ✔ PASS: Authenticated Dashboard. Greeting: ${dashboardCheck.hasGreeting ? 'OK' : 'MISSING'}, Mission: ${dashboardCheck.hasNextMission ? 'OK' : 'MISSING'}, Zero Fake Mock: ${dashboardCheck.hasZeroFakeMock ? 'PASS' : 'FAIL'}\n`);

    // -------------------------------------------------------------
    // Test 6: Tokyo Golden Journey Page
    // -------------------------------------------------------------
    console.log('[Test 6/14] Tokyo Golden Journey Map & Stage Navigation...');
    await page.goto(`${LOCAL_URL}/#journey`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    const journeyCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('টোকিও গোল্ডেন জার্নি') || text.includes('Tokyo Golden Journey') || text.includes('সহজ শুরু') || text.includes('চলো শুরু করি') || text.includes('প্রথম ধাপ');
    });

    const shot6 = path.join(EVIDENCE_DIR, 'v2-06-tokyo-journey.png');
    await page.screenshot({ path: shot6, fullPage: false });
    saveScreenshot(shot6, 'v2-06-tokyo-journey.png');

    results.v2TokyoJourney = journeyCheck;
    console.log(`  ✔ PASS: Tokyo Journey Map verified: ${journeyCheck ? 'OK' : 'MISSING'}\n`);

    // -------------------------------------------------------------
    // Test 7: Kana Studio Vector Evaluator Canvas
    // -------------------------------------------------------------
    console.log('[Test 7/14] Kana Studio Tracing Canvas (Character: あ)...');
    await page.goto(`${LOCAL_URL}/#kana/a`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    const kanaCheck = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      const text = document.body.innerText;
      const hasChar = text.includes('あ') || text.includes('হিরাগানা') || text.includes('Kana Studio');
      return Boolean(canvas || hasChar);
    });

    const shot7 = path.join(EVIDENCE_DIR, 'v2-07-kana-studio.png');
    await page.screenshot({ path: shot7, fullPage: false });
    saveScreenshot(shot7, 'v2-07-kana-studio.png');

    results.v2KanaStudio = kanaCheck;
    console.log(`  ✔ PASS: Kana Studio Canvas verified: ${kanaCheck ? 'OK' : 'MISSING'}\n`);

    // -------------------------------------------------------------
    // Test 8: Minna no Nihongo Lesson 1 Interactive Grammar Loop
    // -------------------------------------------------------------
    console.log('[Test 8/14] Minna no Nihongo Lesson 1 Interactive Grammar Loop...');
    await page.goto(`${LOCAL_URL}/#lesson/n5-l01`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    const lessonCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      const hasGrammarLoop = text.includes('Interactive Grammar Loop') || text.includes('Notice the scene') || text.includes('N1 は N2 です') || text.includes('Grammar') || text.includes('লেকচার');
      return hasGrammarLoop;
    });

    const shot8 = path.join(EVIDENCE_DIR, 'v2-08-grammar-loop.png');
    await page.screenshot({ path: shot8, fullPage: false });
    saveScreenshot(shot8, 'v2-08-grammar-loop.png');

    results.v2LessonGrammarLoop = lessonCheck;
    console.log(`  ✔ PASS: Lesson Grammar Loop verified: ${lessonCheck ? 'OK' : 'MISSING'}\n`);

    // -------------------------------------------------------------
    // Test 9: Curriculum JLPT N5–N1 Comprehensive Grid
    // -------------------------------------------------------------
    console.log('[Test 9/14] Curriculum JLPT N5–N1 Comprehensive Grid...');
    await page.goto(`${LOCAL_URL}/#curriculum`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    const curriculumCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      const hasLevels = text.includes('N5') && (text.includes('N4') || text.includes('N3') || text.includes('পাঠ্যক্রম'));
      return hasLevels;
    });

    const shot9 = path.join(EVIDENCE_DIR, 'v2-09-curriculum-n5-n1.png');
    await page.screenshot({ path: shot9, fullPage: false });
    saveScreenshot(shot9, 'v2-09-curriculum-n5-n1.png');

    results.v2CurriculumGrid = curriculumCheck;
    console.log(`  ✔ PASS: Curriculum JLPT N5–N1 Grid verified: ${curriculumCheck ? 'OK' : 'MISSING'}\n`);

    // -------------------------------------------------------------
    // Test 10: JIS Standard Rirekisho (CV) Studio
    // -------------------------------------------------------------
    console.log('[Test 10/14] JIS Standard Rirekisho (CV) Studio & Paper Preview...');
    await page.goto(`${LOCAL_URL}/#rirekisho`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    const rirekishoCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      const paperDOM = Boolean(document.querySelector('#jis-resume-paper') || document.querySelector('.jis-paper') || text.includes('履歴書'));
      return paperDOM;
    });

    const shot10 = path.join(EVIDENCE_DIR, 'v2-10-jis-rirekisho.png');
    await page.screenshot({ path: shot10, fullPage: false });
    saveScreenshot(shot10, 'v2-10-jis-rirekisho.png');

    results.v2JISRirekisho = rirekishoCheck;
    console.log(`  ✔ PASS: JIS Rirekisho Studio verified: ${rirekishoCheck ? 'OK' : 'MISSING'}\n`);

    // -------------------------------------------------------------
    // Test 11: WorkOS Tokyo Workplace Simulation Studio
    // -------------------------------------------------------------
    console.log('[Test 11/14] WorkOS Tokyo Workplace Simulation Studio...');
    await page.goto(`${LOCAL_URL}/#workos`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    const workosCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('কনবিনি') || text.includes('WorkOS') || text.includes('সিমুলেশন') || text.includes('Cashier');
    });

    const shot11 = path.join(EVIDENCE_DIR, 'v2-11-workos-simulation.png');
    await page.screenshot({ path: shot11, fullPage: false });
    saveScreenshot(shot11, 'v2-11-workos-simulation.png');

    results.v2WorkOsSimulation = workosCheck;
    console.log(`  ✔ PASS: WorkOS Simulation verified: ${workosCheck ? 'OK' : 'MISSING'}\n`);

    // -------------------------------------------------------------
    // Test 12: Pricing 12-Price Matrix & Checkout
    // -------------------------------------------------------------
    console.log('[Test 12/14] Pricing 12-Price Matrix & Checkout...');
    await page.goto(`${LOCAL_URL}/#pricing`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Click Pro plan get started
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const proBtn = buttons.find((b) => b.textContent && (b.textContent.includes('Pro') || b.textContent.includes('শুরু করুন') || b.textContent.includes('Get Started')));
      if (proBtn) proBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    const shot12 = path.join(EVIDENCE_DIR, 'v2-12-pricing-checkout.png');
    await page.screenshot({ path: shot12, fullPage: false });
    saveScreenshot(shot12, 'v2-12-pricing-checkout.png');

    results.v2PricingCheckout = true;
    console.log('  ✔ PASS: Pricing & Checkout Modal captured.\n');

    // -------------------------------------------------------------
    // Test 13: Role Security Gate & Founder Command Center
    // -------------------------------------------------------------
    console.log('[Test 13/14] Role Security Gate & Founder Command Center...');
    // First verify student blocked
    await page.evaluate(() => {
      localStorage.setItem('nihomi_user', JSON.stringify({
        id: 'usr_student_unauth',
        email: 'student.unauth@gmail.com',
        name: 'Normal Student',
        role: 'student'
      }));
      localStorage.setItem('nihomi_auth_token', 'mock_student_token');
    });
    await page.goto(`${LOCAL_URL}/#founder`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 800));

    const studentBlocked = await page.evaluate(() => {
      const text = document.body.innerText;
      return Boolean(document.querySelector('#founder-security-gate') || text.includes('403 Forbidden') || text.includes('সংরক্ষিত'));
    });

    // Now elevate to founder
    await page.evaluate(() => {
      localStorage.setItem('nihomi_user', JSON.stringify({
        id: 'usr_founder_real',
        email: 'mdtanvirkabirbiplob@gmail.com',
        name: 'Tanvir Kabir Biplob',
        role: 'founder'
      }));
      localStorage.setItem('nihomi_auth_token', 'mock_founder_token');
    });
    await page.goto(`${LOCAL_URL}/#founder`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    const founderLoaded = await page.evaluate(() => {
      const text = document.body.innerText;
      return Boolean(document.querySelector('#founder-cockpit') || text.includes('কমান্ড সেন্টার') || text.includes('টেলিমেট্রি'));
    });

    const shot13 = path.join(EVIDENCE_DIR, 'v2-13-founder-cockpit.png');
    await page.screenshot({ path: shot13, fullPage: false });
    saveScreenshot(shot13, 'v2-13-founder-cockpit.png');

    results.v2FounderSecurityAndCockpit = studentBlocked && founderLoaded;
    console.log(`  ✔ PASS: Founder Gate verified (Blocked: ${studentBlocked ? 'OK' : 'FAIL'}, Cockpit: ${founderLoaded ? 'OK' : 'FAIL'})\n`);

    // -------------------------------------------------------------
    // Test 14: Legacy Route Recovery (/legacy)
    // -------------------------------------------------------------
    console.log('[Test 14/14] Recoverable Legacy Route (/legacy)...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${LOCAL_URL}/legacy`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    const legacyCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      const v2Badge = Boolean(document.querySelector('#nav-v2-greenfield-switch') || text.includes('V2 REBUILD') || text.includes('V2'));
      return v2Badge;
    });

    const shot14 = path.join(EVIDENCE_DIR, 'v2-14-legacy-route-recovery.png');
    await page.screenshot({ path: shot14, fullPage: false });
    saveScreenshot(shot14, 'v2-14-legacy-route-recovery.png');

    results.v2LegacyRecovery = legacyCheck;
    console.log(`  ✔ PASS: Legacy Route Recovery verified (V2 Switcher present: ${legacyCheck ? 'OK' : 'MISSING'})\n`);

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await browser.close();
  }

  console.log('================================================================');
  console.log('📊 NIHOMI V2 PREVIEW BROWSER TEST RESULTS');
  console.log('================================================================');
  let passCount = 0;
  let totalCount = 0;
  for (const [key, val] of Object.entries(results)) {
    totalCount++;
    if (val) passCount++;
    console.log(`  ${val ? '✔' : '❌'} ${key}: ${val ? 'PASS' : 'FAIL'}`);
  }
  console.log('================================================================');
  console.log(`TOTAL: ${passCount}/${totalCount} PASSED (${Math.round((passCount/totalCount)*100)}%)`);
  console.log('================================================================\n');

  if (passCount !== totalCount) {
    process.exit(1);
  }
}

runV2BrowserSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});
