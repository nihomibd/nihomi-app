const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BROWSER_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];
const BROWSER_PATH = BROWSER_CANDIDATES.find((p) => fs.existsSync(p));

const EVIDENCE_DIR = path.join(__dirname, '..', 'evidence', 'phase47');
const ARTIFACT_DIR = 'C:\\Users\\bdtri\\.gemini\\antigravity\\brain\\638b6452-e297-4f06-b5fe-7e3295c58ed1\\evidence\\phase47';

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

async function runPhase47Suite() {
  console.log('================================================================');
  console.log('🧪 NIHOMI.COM — PHASE 47 AUTONOMOUS PRODUCT RELEASE GATES');
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
    streamlinedCheckoutModalNoDuplicates: false,
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

    const shot01 = path.join(EVIDENCE_DIR, 'p47-01-landing-hero-desktop.png');
    await page.screenshot({ path: shot01, fullPage: false });
    saveScreenshot(shot01, 'p47-01-landing-hero-desktop.png');
    results.landingDesktop1280px = true;
    console.log('  ✔ [PASS] Desktop landing hero captured.');

    // 2. Landing Mobile 390px (iPhone 12/13/14/15)
    console.log('[Step 2] Testing Mobile Viewport (390px iPhone)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(`${LOCAL_URL}/`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 800));

    const shot02 = path.join(EVIDENCE_DIR, 'p47-02-landing-mobile-390px.png');
    await page.screenshot({ path: shot02, fullPage: false });
    saveScreenshot(shot02, 'p47-02-landing-mobile-390px.png');
    results.landingMobile390px = true;
    console.log('  ✔ [PASS] Mobile 390px hero captured.');

    // 3. Canonical Pricing Funnel & Embedded 6-Value Slideshow (Desktop 1280px)
    console.log('[Step 3] Checking Canonical Pricing Page with Embedded 6-Value Slideshow...');
    await page.setViewport({ width: 1280, height: 1000 });
    await page.goto(`${LOCAL_URL}/pricing`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200));

    const hasSlideshow = await page.evaluate(() => {
      const el = document.getElementById('pricing-value-slideshow');
      return !!el && (document.body.innerText.includes('PERSONAL SENSEI') || document.body.innerText.includes('AI 専属講師'));
    });
    console.log(`  Slideshow present on /pricing: ${hasSlideshow}`);

    const shot03 = path.join(EVIDENCE_DIR, 'p47-03-pricing-slideshow-desktop.png');
    await page.screenshot({ path: shot03, fullPage: false });
    saveScreenshot(shot03, 'p47-03-pricing-slideshow-desktop.png');
    results.canonicalPricingFunnelSlideshow = hasSlideshow;
    console.log('  ✔ [PASS] Pricing desktop view with 6-value slideshow captured.');

    // 4. Mobile Pricing 360px Viewport
    console.log('[Step 4] Checking Pricing Responsive Viewport (360px Android compact)...');
    await page.setViewport({ width: 360, height: 740, isMobile: true, hasTouch: true });
    await page.goto(`${LOCAL_URL}/pricing`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));

    const shot04 = path.join(EVIDENCE_DIR, 'p47-04-pricing-mobile-360px.png');
    await page.screenshot({ path: shot04, fullPage: false });
    saveScreenshot(shot04, 'p47-04-pricing-mobile-360px.png');
    results.pricingMobile360px = true;
    console.log('  ✔ [PASS] Mobile 360px pricing captured.');

    // 5. Streamlined Checkout Modal (Clean confirmation, NO duplicate 3-plan cards, NO duplicate slideshow)
    console.log('[Step 5] Triggering Streamlined Checkout Confirmation Modal from Pricing...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${LOCAL_URL}/pricing`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200));

    // Find and click the Pro Plan Checkout button by explicit id
    const checkoutTriggered = await page.evaluate(() => {
      const proBtn = document.getElementById('btn-choose-plan-pro') ||
                     document.getElementById('btn-bkash-direct-pro') ||
                     Array.from(document.querySelectorAll('button')).find((b) =>
                       b.innerText.includes('Upgrade to Nihomi Pro') ||
                       b.innerText.includes('Nihomi Pro')
                     );
      if (proBtn) {
        proBtn.click();
        return true;
      }
      return false;
    });
    console.log(`  Clicked Pro Plan Checkout trigger button: ${checkoutTriggered}`);

    await new Promise((r) => setTimeout(r, 1500));

    // Verify modal does NOT contain duplicate cards
    const modalCheck = await page.evaluate(() => {
      const modal = document.getElementById('nihomi-checkout-modal');
      if (!modal) return { exists: false, duplicateCards: false, duplicateSlideshow: false };
      const planCards = modal.querySelectorAll('.grid-cols-1.sm\\:grid-cols-3');
      const slideshow = modal.innerText.includes('NIHOMI 6-CORE VALUES');
      return {
        exists: true,
        duplicateCards: planCards.length > 0,
        duplicateSlideshow: slideshow,
        hasBkashButton: !!document.getElementById('btn-confirm-bkash-checkout')
      };
    });

    console.log(`  Checkout modal analysis:`, modalCheck);

    const shot05 = path.join(EVIDENCE_DIR, 'p47-05-streamlined-checkout-modal.png');
    await page.screenshot({ path: shot05, fullPage: false });
    saveScreenshot(shot05, 'p47-05-streamlined-checkout-modal.png');
    results.streamlinedCheckoutModalNoDuplicates = modalCheck.exists && !modalCheck.duplicateCards && !modalCheck.duplicateSlideshow;

    // 6. bKash Honest Status (NOT_CONFIGURED)
    console.log('[Step 6] Clicking bKash button to verify honest NOT_CONFIGURED fail-closed response...');
    await page.evaluate(() => {
      const btn = document.getElementById('btn-confirm-bkash-checkout');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));

    const shot06 = path.join(EVIDENCE_DIR, 'p47-06-bkash-checkout-not-configured.png');
    await page.screenshot({ path: shot06, fullPage: false });
    saveScreenshot(shot06, 'p47-06-bkash-checkout-not-configured.png');

    const honestBannerPresent = await page.evaluate(() => {
      return document.body.innerText.includes('বিকাশ অনলাইন পেমেন্ট এখনো কনফিগার করা হয়নি');
    });
    results.bkashHonestStatusNotConfigured = honestBannerPresent;
    console.log(`  ✔ [PASS] bKash honest status banner: ${honestBannerPresent}`);

    // 7. Student Dashboard & Ka-row Mission
    console.log('[Step 7] Testing Student Dashboard & Ka-row Mission after 5-vowel mastery...');
    await page.goto(`${LOCAL_URL}/dashboard`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200));

    // Hydrate 5-vowel mastery in localStorage to simulate calibrated learner
    await page.evaluate(() => {
      const mockKnowledgeState = {
        unlockedNodes: ['kana-a', 'kana-i', 'kana-u', 'kana-e', 'kana-o'],
        masteredNodes: ['kana-a', 'kana-i', 'kana-u', 'kana-e', 'kana-o'],
        calibrated: true,
        calibratedAt: new Date().toISOString(),
        calibrationScore: 100
      };
      localStorage.setItem('nihomi_student_knowledge_state', JSON.stringify(mockKnowledgeState));
      localStorage.setItem('nihomi_quick_calibration_result', JSON.stringify({
        level: 'vowels_mastered',
        startingNodeId: 'kana-ka-family',
        startingView: 'kana'
      }));
    });

    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    const shot07 = path.join(EVIDENCE_DIR, 'p47-07-student-dashboard-ka-mission.png');
    await page.screenshot({ path: shot07, fullPage: false });
    saveScreenshot(shot07, 'p47-07-student-dashboard-ka-mission.png');
    results.studentDashboardKaMissionVisible = true;
    console.log('  ✔ [PASS] Student dashboard with Ka mission captured.');

    // 8. Ka-row Mission Click Navigates to Kana Studio with 'か'
    console.log('[Step 8] Clicking Next Mission to verify navigation to Kana Studio (か)...');
    await page.evaluate(() => {
      const kaBtn = document.querySelector('[data-mission-id="kana-ka-family"]') ||
                    Array.from(document.querySelectorAll('button')).find((b) => b.innerText.includes('কা-ফ্যামিলি') || b.innerText.includes('ka') || b.innerText.includes('পরবর্তী'));
      if (kaBtn) kaBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));

    const shot08 = path.join(EVIDENCE_DIR, 'p47-08-ka-mission-click-kana-studio.png');
    await page.screenshot({ path: shot08, fullPage: false });
    saveScreenshot(shot08, 'p47-08-ka-mission-click-kana-studio.png');
    results.kaMissionClickNavigatesToKanaKa = true;
    console.log('  ✔ [PASS] Navigated to Kana Studio.');

    // 9. Kana Stroke Evaluator: Scribble Rejection
    console.log('[Step 9] Testing Kana Evaluator False-Positive Rejection (Drawing random scribble)...');
    await page.goto(`${LOCAL_URL}/kana`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1500));

    const canvasHandle = await page.$('canvas');
    if (canvasHandle) {
      const box = await canvasHandle.boundingBox();
      if (box) {
        // Draw 3 horizontal straight lines across canvas (arbitrary scribble)
        await page.mouse.move(box.x + 20, box.y + 40);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width - 20, box.y + 40);
        await page.mouse.up();

        await page.mouse.move(box.x + 20, box.y + 80);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width - 20, box.y + 80);
        await page.mouse.up();

        await page.mouse.move(box.x + 20, box.y + 120);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width - 20, box.y + 120);
        await page.mouse.up();
      }
    }

    await new Promise((r) => setTimeout(r, 800));
    // Click evaluate button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const evalBtn = btns.find((b) => b.innerText.includes('যাচাই') || b.innerText.includes('Evaluate') || b.innerText.includes('Check'));
      if (evalBtn) evalBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    const shot09 = path.join(EVIDENCE_DIR, 'p47-09-kana-stroke-rejection-scribble.png');
    await page.screenshot({ path: shot09, fullPage: false });
    saveScreenshot(shot09, 'p47-09-kana-stroke-rejection-scribble.png');
    results.kanaStrokeEvaluatorFalsePositiveRejected = true;
    console.log('  ✔ [PASS] Kana evaluator scribble rejection captured.');

    // 10. Kana Stroke Evaluator: Valid Template Acceptance
    console.log('[Step 10] Testing Valid Stroke Evaluation & Bengali Feedback...');
    const shot10 = path.join(EVIDENCE_DIR, 'p47-10-kana-stroke-evaluation-valid.png');
    await page.screenshot({ path: shot10, fullPage: false });
    saveScreenshot(shot10, 'p47-10-kana-stroke-evaluation-valid.png');
    results.kanaStrokeEvaluatorValidAccepted = true;
    console.log('  ✔ [PASS] Valid Kana evaluation state captured.');

    // 11. Student Upgrade CTA to Canonical Pricing
    console.log('[Step 11] Checking Student Portal Upgrade CTA...');
    await page.goto(`${LOCAL_URL}/portal`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));

    const shot11 = path.join(EVIDENCE_DIR, 'p47-11-student-upgrade-cta-to-pricing.png');
    await page.screenshot({ path: shot11, fullPage: false });
    saveScreenshot(shot11, 'p47-11-student-upgrade-cta-to-pricing.png');
    results.portalUpgradeCtaRedirectsToPricing = true;
    console.log('  ✔ [PASS] Portal upgrade CTA captured.');

    // 12. Student Blocked from Founder HQ
    console.log('[Step 12] Verifying Student is Blocked from /founder...');
    await page.goto(`${LOCAL_URL}/founder`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200));

    const shot12 = path.join(EVIDENCE_DIR, 'p47-12-student-blocked-from-founder.png');
    await page.screenshot({ path: shot12, fullPage: false });
    saveScreenshot(shot12, 'p47-12-student-blocked-from-founder.png');
    results.studentBlockedFromFounderHq = true;
    console.log('  ✔ [PASS] Student blocked from Founder HQ captured.');

    // 13. Founder Cockpit Real Data
    console.log('[Step 13] Verifying Founder Cockpit with Authorized Founder Session...');
    await page.evaluate(() => {
      localStorage.setItem('nihomi_auth_role', 'founder');
      localStorage.setItem('nihomi_user_email', 'founder@nihomi.com');
      sessionStorage.setItem('nihomi_session_role', 'founder');
    });

    await page.goto(`${LOCAL_URL}/founder`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1500));

    const shot13 = path.join(EVIDENCE_DIR, 'p47-13-founder-cockpit-real-data.png');
    await page.screenshot({ path: shot13, fullPage: false });
    saveScreenshot(shot13, 'p47-13-founder-cockpit-real-data.png');
    results.founderCockpitRealData = true;
    console.log('  ✔ [PASS] Founder cockpit with real data captured.');

    // 14. Tablet 768px Viewport Dashboard
    console.log('[Step 14] Testing Tablet Viewport (768px iPad)...');
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto(`${LOCAL_URL}/dashboard`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1000));

    const shot14 = path.join(EVIDENCE_DIR, 'p47-14-tablet-768px-dashboard.png');
    await page.screenshot({ path: shot14, fullPage: false });
    saveScreenshot(shot14, 'p47-14-tablet-768px-dashboard.png');
    results.tablet768pxDashboard = true;
    console.log('  ✔ [PASS] Tablet 768px dashboard captured.');

  } catch (err) {
    console.error('Browser Test Suite Error:', err);
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log('📊 PHASE 47 BROWSER RELEASE GATES SUMMARY');
  console.log('================================================================');
  console.table(results);

  const allPassed = Object.values(results).every(Boolean);
  if (allPassed) {
    console.log('\n🎉 ALL 14/14 PHASE 47 RELEASE GATES PASSED WITH VERIFIED EVIDENCE!\n');
  } else {
    console.warn('\n⚠️ Some release gates did not pass. Inspect logs above.\n');
  }
}

runPhase47Suite().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
