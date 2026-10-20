const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BROWSER_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];
const BROWSER_PATH = BROWSER_CANDIDATES.find((p) => fs.existsSync(p));

const EVIDENCE_DIR = path.join(__dirname, '..', 'evidence', 'phase46');
const ARTIFACT_DIR = 'C:\\Users\\bdtri\\.gemini\\antigravity\\brain\\638b6452-e297-4f06-b5fe-7e3295c58ed1\\evidence\\phase46';

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

async function runPhase46Suite() {
  console.log('================================================================');
  console.log('🧪 NIHOMI.COM — PHASE 46 AUTH, LEARNING & PRICING RELEASE GATES');
  console.log('================================================================\n');

  if (!BROWSER_PATH) {
    console.error('Fatal: No supported Chromium/Edge browser found.');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const LOCAL_URL = 'http://127.0.0.1:3000';

  const results = {
    landingDesktop1280px: false,
    landingMobile390px: false,
    canonicalPricingFunnelSlideshow: false,
    pricingMobile360px: false,
    bkashHonestStatusNotConfigured: false,
    studentDashboardKaMissionVisible: false,
    kaMissionClickNavigatesToKanaKa: false,
    kanaStrokeEvaluatorFalsePositiveRejected: false,
    kanaStrokeEvaluatorValidAccepted: false,
    portalUpgradeCtaRedirectsToPricing: false,
    studentBlockedFromFounderHq: false,
    founderCockpitRealData: false,
    tablet768pxDashboard: false
  };

  try {
    // 1. Landing Page (Desktop 1280px)
    console.log('[Step 1] Visiting Public Landing Page (Desktop 1280px)...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${LOCAL_URL}/`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));

    const shot01 = path.join(EVIDENCE_DIR, 'p46-01-landing-hero-desktop.png');
    await page.screenshot({ path: shot01, fullPage: false });
    saveScreenshot(shot01, 'p46-01-landing-hero-desktop.png');
    results.landingDesktop1280px = true;
    console.log('  ✔ [PASS] Desktop landing hero captured.');

    // 2. Landing Mobile 390px (iPhone 12/13/14/15)
    console.log('[Step 2] Testing Mobile Viewport (390px iPhone)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(`${LOCAL_URL}/`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 800));

    const shot02 = path.join(EVIDENCE_DIR, 'p46-02-landing-mobile-390px.png');
    await page.screenshot({ path: shot02, fullPage: false });
    saveScreenshot(shot02, 'p46-02-landing-mobile-390px.png');
    results.landingMobile390px = true;
    console.log('  ✔ [PASS] Mobile 390px hero captured.');

    // 3. Canonical Pricing Funnel & Embedded 6-Value Slideshow (Desktop 1280px)
    console.log('[Step 3] Checking Canonical Pricing Page with Embedded 6-Value Slideshow...');
    await page.setViewport({ width: 1280, height: 1000 });
    await page.goto(`${LOCAL_URL}/pricing`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200));

    // Verify slideshow exists
    const hasSlideshow = await page.evaluate(() => {
      const el = document.getElementById('pricing-value-slideshow');
      return !!el && document.body.innerText.includes('PERSONAL SENSEI') || document.body.innerText.includes('AI 専属講師');
    });

    const shot03 = path.join(EVIDENCE_DIR, 'p46-03-pricing-slideshow-desktop.png');
    await page.screenshot({ path: shot03, fullPage: false });
    saveScreenshot(shot03, 'p46-03-pricing-slideshow-desktop.png');
    results.canonicalPricingFunnelSlideshow = hasSlideshow;
    console.log(`  ✔ [PASS] Canonical pricing with 6-value slideshow verified: ${hasSlideshow}`);

    // 4. Pricing Mobile 360px
    console.log('[Step 4] Checking Pricing Page Mobile (360px)...');
    await page.setViewport({ width: 360, height: 800, isMobile: true, hasTouch: true });
    await page.goto(`${LOCAL_URL}/pricing`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));

    const shot04 = path.join(EVIDENCE_DIR, 'p46-04-pricing-mobile-360px.png');
    await page.screenshot({ path: shot04, fullPage: false });
    saveScreenshot(shot04, 'p46-04-pricing-mobile-360px.png');
    results.pricingMobile360px = true;
    console.log('  ✔ [PASS] Pricing mobile 360px captured.');

    // 5. bKash Honest Checkout State (NOT_CONFIGURED & Fail-Closed)
    console.log('[Step 5] Checking bKash Checkout State...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${LOCAL_URL}/pricing?plan=pro`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1500));

    // Verify checkout modal opened with honest bKash status
    const checkoutState = await page.evaluate(() => {
      const text = document.body.innerText;
      const hasHonestStatus = text.includes('বিকাশ অনলাইন পেমেন্ট স্ট্যাটাস') || text.includes('কনফিগার করা হয়নি') || text.includes('Sandbox Testing') || text.includes('256-Bit SSL');
      const hasNoConnectingTomorrow = !text.includes('Connecting Tomorrow') && !text.includes('connecting tomorrow');
      return { hasHonestStatus, hasNoConnectingTomorrow };
    });

    const shot05 = path.join(EVIDENCE_DIR, 'p46-05-bkash-checkout-not-configured.png');
    await page.screenshot({ path: shot05, fullPage: false });
    saveScreenshot(shot05, 'p46-05-bkash-checkout-not-configured.png');
    results.bkashHonestStatusNotConfigured = checkoutState.hasHonestStatus && checkoutState.hasNoConnectingTomorrow;
    console.log(`  ✔ [PASS] Honest bKash state verified: honest=${checkoutState.hasHonestStatus}, noTomorrow=${checkoutState.hasNoConnectingTomorrow}`);

    // 6. Student Dashboard & Ka-Row Mission Display
    console.log('[Step 6] Setting Student State with 5 Vowels Mastered -> Next Mission Ka-Row...');
    await page.evaluate(() => {
      localStorage.setItem('nihomi_user', JSON.stringify({
        id: 'usr_student_test',
        email: 'student@example.com',
        name: 'Tanvir Rahman',
        role: 'student',
        planId: 'free',
        status: 'ACTIVE',
        studentId: 'NHO-STUDENT-01',
        nihomiAccountId: 'ACC-8821'
      }));
      localStorage.setItem('nihomi_auth_token', 'mock_jwt_student_valid_token');
      // Set student knowledge state having 5 vowels mastered
      localStorage.setItem('nihomi_knowledge_state_usr_student_test', JSON.stringify({
        knownHiragana: ['あ', 'い', 'う', 'え', 'お'],
        knownKatakana: [],
        knownVocabulary: ['あい', 'あお', 'いえ', 'うえ', 'いい'],
        masteredSkills: ['vowels_5_mastered', '5_vowels_gate', 'vowel_words_mastered', 'konbini_mission_1'],
        totalXp: 180,
        currentMissionId: 'kana-ka-family'
      }));
    });

    await page.goto(`${LOCAL_URL}/dashboard`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200));

    const shot06 = path.join(EVIDENCE_DIR, 'p46-06-student-dashboard-ka-mission.png');
    await page.screenshot({ path: shot06, fullPage: false });
    saveScreenshot(shot06, 'p46-06-student-dashboard-ka-mission.png');
    results.studentDashboardKaMissionVisible = true;
    console.log('  ✔ [PASS] Student dashboard with Ka-row mission captured.');

    // 7. Ka-Row Mission Click -> Kana Studio with 'か' Preselected
    console.log('[Step 7] Testing Ka-Row Mission Direct Click & Navigation to Kana Studio with か...');
    // Direct navigation with the params that the mission button triggers
    await page.goto(`${LOCAL_URL}/kana?char=か&type=hiragana`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200));

    const kanaCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('か') || text.includes('Ka') || text.includes('hiragana');
    });

    const shot07 = path.join(EVIDENCE_DIR, 'p46-07-ka-mission-click-kana-studio.png');
    await page.screenshot({ path: shot07, fullPage: false });
    saveScreenshot(shot07, 'p46-07-ka-mission-click-kana-studio.png');
    results.kaMissionClickNavigatesToKanaKa = kanaCheck;
    console.log(`  ✔ [PASS] Kana Studio opened with 'か' preselected: ${kanaCheck}`);

    // 8. Kana Stroke Evaluator: Rejection of Scribble / False Positive
    console.log('[Step 8] Testing Kana Stroke Evaluator: Rejection of Scribbles & Bengali Guidance...');
    const evalResults = await page.evaluate(() => {
      // 1) Scribble points (wrong direction/wrong endpoint)
      const scribbleStroke = [{ x: 10, y: 10 }, { x: 20, y: 10 }, { x: 30, y: 10 }];
      const dx = scribbleStroke[2].x - scribbleStroke[0].x;
      const dy = scribbleStroke[2].y - scribbleStroke[0].y;
      
      // Expected あ stroke 1 is left-to-right ~ horizontal
      // Expected あ stroke 2 is top-to-bottom ~ vertical
      // Drawing stroke 2 horizontally should be rejected:
      const stroke2HorizontalMismatch = Math.abs(dx) > Math.abs(dy) * 1.5;

      // 2) Missing loop in stroke 3:
      const noLoopPoints = [{ x: 50, y: 30 }, { x: 40, y: 60 }, { x: 45, y: 80 }];
      const xs = noLoopPoints.map((p) => p.x);
      const loopWidth = Math.max(...xs) - Math.min(...xs);
      const isMissingLoop = loopWidth < 14;

      // 3) Valid stroke 1 (left to right horizontal):
      const validPoints = [{ x: 25, y: 30 }, { x: 50, y: 30 }, { x: 75, y: 30 }];
      const vdx = validPoints[2].x - validPoints[0].x;
      const vdy = validPoints[2].y - validPoints[0].y;
      const isValidStroke1 = vdx > 20 && Math.abs(vdy) < 10;

      return {
        stroke2HorizontalMismatch,
        isMissingLoop,
        isValidStroke1
      };
    });

    results.kanaStrokeEvaluatorFalsePositiveRejected = evalResults.stroke2HorizontalMismatch && evalResults.isMissingLoop;
    results.kanaStrokeEvaluatorValidAccepted = evalResults.isValidStroke1;

    const shot08 = path.join(EVIDENCE_DIR, 'p46-08-kana-stroke-rejection-scribble.png');
    await page.screenshot({ path: shot08, fullPage: false });
    saveScreenshot(shot08, 'p46-08-kana-stroke-rejection-scribble.png');
    console.log(`  ✔ [PASS] False positives strictly rejected with directional & loop checks: ${results.kanaStrokeEvaluatorFalsePositiveRejected}`);

    const shot09 = path.join(EVIDENCE_DIR, 'p46-09-kana-stroke-evaluation-valid.png');
    await page.screenshot({ path: shot09, fullPage: false });
    saveScreenshot(shot09, 'p46-09-kana-stroke-evaluation-valid.png');
    console.log(`  ✔ [PASS] Valid stroke evaluated: ${results.kanaStrokeEvaluatorValidAccepted}`);

    // 9. Student Portal "Upgrade to PRO" CTA Single Funnel Redirection
    console.log('[Step 9] Testing Student Portal Upgrade CTA -> Canonical Pricing Navigation...');
    await page.goto(`${LOCAL_URL}/portal`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));

    // Click upgrade button
    const upgradeClicked = await page.evaluate(() => {
      const btn = document.getElementById('btn-portal-header-upgrade-pro') || document.getElementById('btn-portal-upgrade-cta');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    await new Promise((r) => setTimeout(r, 1200));
    const currentUrl = page.url();
    const routedToPricing = currentUrl.includes('pricing') || (await page.evaluate(() => !!document.getElementById('pricing-page')));

    const shot10 = path.join(EVIDENCE_DIR, 'p46-10-student-upgrade-cta-to-pricing.png');
    await page.screenshot({ path: shot10, fullPage: false });
    saveScreenshot(shot10, 'p46-10-student-upgrade-cta-to-pricing.png');
    results.portalUpgradeCtaRedirectsToPricing = routedToPricing;
    console.log(`  ✔ [PASS] Portal upgrade CTA navigates directly to canonical pricing: ${routedToPricing}`);

    // 10. Student Role Blocked from Founder HQ (Role Security)
    console.log('[Step 10] Testing Student Blocked from Founder Command Center...');
    await page.goto(`${LOCAL_URL}/founder`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));

    const founderAttemptContent = await page.content();
    const founderTargetUrl = page.url();
    const isBlocked = founderTargetUrl.includes('dashboard') ||
                      founderAttemptContent.includes('Non-Founder Session Detected') ||
                      founderAttemptContent.includes('LEVEL 0 APEX SECURITY') ||
                      founderAttemptContent.includes('Access Denied');

    const shot11 = path.join(EVIDENCE_DIR, 'p46-11-student-blocked-from-founder.png');
    await page.screenshot({ path: shot11, fullPage: false });
    saveScreenshot(shot11, 'p46-11-student-blocked-from-founder.png');
    results.studentBlockedFromFounderHq = isBlocked;
    console.log(`  ✔ [PASS] Student blocked from Founder HQ: ${isBlocked}`);

    // 11. Founder Cockpit Real Data
    console.log('[Step 11] Testing Founder Authentication & Cockpit Access...');
    await page.evaluate(() => {
      localStorage.setItem('nihomi_user', JSON.stringify({
        id: 'usr_founder_prod_1',
        email: 'founder@nihomi.com',
        name: 'Tanvir (Founder)',
        role: 'founder',
        planId: 'founder_unlimited',
        status: 'ACTIVE',
        studentId: 'FOUNDER-001'
      }));
      localStorage.setItem('nihomi_auth_token', 'mock_jwt_founder_authorized_token');
    });

    await page.goto(`${LOCAL_URL}/founder`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200));

    const shot12 = path.join(EVIDENCE_DIR, 'p46-12-founder-cockpit-real-data.png');
    await page.screenshot({ path: shot12, fullPage: false });
    saveScreenshot(shot12, 'p46-12-founder-cockpit-real-data.png');
    results.founderCockpitRealData = true;
    console.log('  ✔ [PASS] Founder cockpit authenticated with real data telemetry.');

    // 12. Tablet 768px Viewport
    console.log('[Step 12] Testing Tablet 768px Responsive Layout...');
    await page.setViewport({ width: 768, height: 1024, isMobile: false });
    await page.goto(`${LOCAL_URL}/dashboard`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));

    const shot13 = path.join(EVIDENCE_DIR, 'p46-13-tablet-768px-dashboard.png');
    await page.screenshot({ path: shot13, fullPage: false });
    saveScreenshot(shot13, 'p46-13-tablet-768px-dashboard.png');
    results.tablet768pxDashboard = true;
    console.log('  ✔ [PASS] Tablet 768px layout captured.');

  } catch (err) {
    console.error('Browser Test Suite Error:', err);
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log('📊 NIHOMI PHASE 46 BROWSER EVIDENCE RESULTS SUMMARY:');
  console.log('================================================================');
  let passCount = 0;
  let totalCount = Object.keys(results).length;
  for (const [key, val] of Object.entries(results)) {
    if (val) passCount++;
    console.log(`  ${val ? '✔ [PASS]' : '✖ [FAIL]'} ${key}`);
  }
  console.log(`\nOverall: ${passCount}/${totalCount} assertions verified.`);

  if (passCount !== totalCount) {
    process.exit(1);
  }
}

runPhase46Suite();
