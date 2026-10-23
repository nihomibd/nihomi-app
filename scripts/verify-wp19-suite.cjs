// scripts/verify-wp19-suite.cjs
// Headless Chromium/Edge Browser Verification Suite for NIHOMI WP19
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
  console.log('🚀 NIHOMI WP19: REAL BROWSER EVIDENCE AUDIT');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800']
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
    await page.setViewport({ width: 1280, height: 800 });

    // Clear all client auth state to ensure guest testing
    await page.goto(LOCAL_URL, { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload({ waitUntil: 'networkidle2' });

    console.log('\n--- TEST 1: Single Login Button in Header (No Duplicate Clutter) ---');
    const headerLoginBtn = await page.$('#header-login-btn');
    assert(headerLoginBtn !== null, 'Header login button exists');

    const heroLoginBtn = await page.$('#hero-mobile-login-cta');
    assert(heroLoginBtn === null, 'Hero duplicate login button is completely excised');

    // Test mobile bottom nav
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await page.reload({ waitUntil: 'networkidle2' });
    const mobileBottomLoginBtn = await page.$('#mobile-bottom-login-btn');
    assert(mobileBottomLoginBtn === null, 'Mobile bottom navigation duplicate login button is completely excised');
    await saveScreenshot(page, 'v2-29-wp19-single-header-login.png');

    // Restore desktop viewport
    await page.setViewport({ width: 1280, height: 800, isMobile: false });
    await page.reload({ waitUntil: 'networkidle2' });

    console.log('\n--- TEST 2: AuthModal Cryptographic Cleanliness (Zero Sandbox Stubs) ---');
    await page.click('#header-login-btn');
    await page.waitForSelector('#auth-modal-card', { visible: true });

    const googleBtn = await page.$('#btn-google-continue');
    assert(googleBtn !== null, 'Google OAuth 2.0 continue button is present');

    const emailInput = await page.$('#auth-input-email');
    assert(emailInput !== null, 'Direct email input field is present');

    const passwordInput = await page.$('#auth-input-password');
    assert(passwordInput !== null, 'Direct password input field is present');

    const quickFounderBtn = await page.$('#btn-quick-founder-preview');
    assert(quickFounderBtn === null, 'Founder sandbox stub button is completely excised');

    const quickStudentBtn = await page.$('#btn-quick-student-preview');
    assert(quickStudentBtn === null, 'Student sandbox stub button is completely excised');

    // Test Founder dynamic email detection
    await page.type('#auth-input-email', 'mdtanvirkabirbiplob@gmail.com');
    await new Promise((r) => setTimeout(r, 200));
    const modalContent = await page.evaluate(() => document.querySelector('#auth-modal-card')?.textContent || '');
    assert(modalContent.includes('ফাউন্ডার অ্যাকাউন্ট শনাক্ত'), 'Dynamic founder role detection badge appears when typing founder email');
    await saveScreenshot(page, 'v2-30-wp19-clean-auth-modal-founder-detected.png');

    // Close AuthModal
    await page.click('#btn-auth-modal-close');
    await new Promise((r) => setTimeout(r, 400));

    console.log('\n--- TEST 3: JLPT CBT Mock Exam OS PRO Gating (/#exam) ---');
    await page.goto(`${LOCAL_URL}/#exam`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 500));
    const examPageContent = await page.evaluate(() => document.body.textContent || '');
    assert(examPageContent.includes('JLPT ও NAT-TEST CBT মক এক্সাম ওএস'), 'Exam OS displays ProFeatureGate title');
    assert(examPageContent.includes('১,৯৯০') && examPageContent.includes('BDT / মাস'), 'Exam OS displays 1,990 BDT pricing');
    const examUpgradeBtn = await page.$('#btn-gate-upgrade-pro');
    assert(examUpgradeBtn !== null, 'Exam OS Pro Feature Gate upgrade button exists');
    await saveScreenshot(page, 'v2-31-wp19-pro-gate-exam.png');

    console.log('\n--- TEST 4: Tokyo Konbini WorkOS PRO Gating (/#workos) ---');
    await page.goto(`${LOCAL_URL}/#workos`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 500));
    const workosPageContent = await page.evaluate(() => document.body.textContent || '');
    assert(workosPageContent.includes('টোকিও কনবিনি WorkOS™ সিমুলেটর'), 'WorkOS displays ProFeatureGate title');
    assert(workosPageContent.includes('১,৯৯০') && workosPageContent.includes('BDT / মাস'), 'WorkOS displays 1,990 BDT pricing');
    await saveScreenshot(page, 'v2-32-wp19-pro-gate-workos.png');

    console.log('\n--- TEST 5: Free Tier vs PRO Gating on Lessons (L01 vs L08) ---');
    // Lesson 1 is 100% Free
    await page.goto(`${LOCAL_URL}/#lesson/n5-l01`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 500));
    const l1Content = await page.evaluate(() => document.body.textContent || '');
    assert(!l1Content.includes('PRO এক্সক্লুসিভ ফিচার'), 'Lesson 1 is NOT paywalled by ProFeatureGate');
    await saveScreenshot(page, 'v2-33-wp19-free-lesson-unlocked.png');

    // Lesson 8 is PRO tier
    await page.goto(`${LOCAL_URL}/#lesson/n5-l08`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 500));
    const l8Content = await page.evaluate(() => document.body.textContent || '');
    assert(l8Content.includes('N5-L08 সম্পূর্ণ পাঠ্যক্রম') && l8Content.includes('PRO এক্সক্লুসিভ ফিচার'), 'Lesson 8 is strictly gated by ProFeatureGate');
    await saveScreenshot(page, 'v2-34-wp19-pro-gate-lesson8.png');

    console.log('\n--- TEST 6: PRO Gate to Checkout Modal Connectivity ---');
    await page.click('#btn-gate-upgrade-pro');
    await new Promise((r) => setTimeout(r, 800));
    const checkoutModal = (await page.$('#checkout-modal')) || (await page.$('#nihomi-checkout-modal'));
    assert(checkoutModal !== null, 'CheckoutModal opens seamlessly from ProFeatureGate');
    const checkoutText = await page.evaluate(() => {
      const el = document.querySelector('#checkout-modal') || document.querySelector('#nihomi-checkout-modal');
      return el ? el.textContent : '';
    });
    assert(checkoutText.includes('Nihomi Pro') || checkoutText.includes('১,৯৯০') || checkoutText.includes('নিহোমি প্রিমিয়াম'), 'CheckoutModal displays Nihomi Pro checkout');
    await saveScreenshot(page, 'v2-35-wp19-checkout-modal-opened.png');

    // Close checkout modal
    const closeCheckoutBtn = await page.$('button[aria-label="চেকআউট বন্ধ করুন"]');
    if (closeCheckoutBtn) await closeCheckoutBtn.click();
    await new Promise((r) => setTimeout(r, 400));

    console.log('\n--- TEST 7: Version 1 (Legacy Mode) Lockdown for Non-Founders ---');
    await page.goto(`${LOCAL_URL}/legacy`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 800));
    const currentUrl = page.url();
    const isV1Present = await page.evaluate(() => Boolean(document.querySelector('#legacy-hero') || document.querySelector('#classic-view-root')));
    const isV2Present = await page.evaluate(() => Boolean(document.querySelector('#v2-app-shell') || document.querySelector('#learning-journey')));
    assert(!isV1Present && (isV2Present || !currentUrl.endsWith('/legacy')), 'Guest accessing /legacy is prevented from entering V1 and redirected to modern V2');
    
    // Check footer
    const footerText = await page.evaluate(() => document.querySelector('#v2-footer')?.textContent || '');
    assert(!footerText.includes('লেগ্যাসি ভিউ (Classic)'), 'Public footer does NOT show legacy mode link');
    await saveScreenshot(page, 'v2-36-wp19-legacy-locked-to-v2.png');

    console.log('\n--- TEST 8: N.I.H.O.M.I Shared Loop on Landing Page ---');
    await page.goto(`${LOCAL_URL}/#learning-journey`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 500));
    const loopSection = await page.$('#learning-journey');
    assert(loopSection !== null, 'Learning journey section exists');
    const loopText = await page.evaluate(() => document.querySelector('#learning-journey')?.textContent || '');
    assert(loopText.includes('N.I.H.O.M.I লার্নিং লুপ'), 'N.I.H.O.M.I loop title is visible');
    assert(loopText.includes('Notice') && loopText.includes('Imitate') && loopText.includes('Habituate') && loopText.includes('Orchestrate') && loopText.includes('Master') && loopText.includes('Integrate'), 'All 6 N-I-H-O-M-I stages are rendered');
    await saveScreenshot(page, 'v2-37-wp19-nihomi-loop-landing.png');

    console.log('\n================================================================');
    console.log(`AUDIT RESULTS: ${totalPassed} / ${totalTests} TESTS PASSED!`);
    console.log('================================================================');

    if (totalPassed !== totalTests) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal Test Suite Error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
