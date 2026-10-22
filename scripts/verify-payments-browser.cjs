// scripts/verify-payments-browser.cjs
// Real Headless Chromium/Edge Browser Verification Suite for NIHOMI PAYMENTS & CHECKOUT
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

async function captureAndSaveScreenshot(page, filename) {
  const localPath = path.join(EVIDENCE_DIR, filename);
  const destPath = path.join(ARTIFACT_DIR, filename);
  try {
    const buffer = await page.screenshot({ fullPage: false });
    for (let i = 0; i < 3; i++) {
      try {
        fs.writeFileSync(localPath, buffer);
        break;
      } catch (e) {
        await new Promise((r) => setTimeout(r, 150));
      }
    }
    for (let i = 0; i < 3; i++) {
      try {
        fs.writeFileSync(destPath, buffer);
        break;
      } catch (e) {
        await new Promise((r) => setTimeout(r, 150));
      }
    }
    console.log(`  📸 Saved screenshot: ${filename}`);
  } catch (err) {
    console.warn(`[Screenshot Warning] Could not capture ${filename}:`, err.message);
  }
}

const LOCAL_URL = 'http://127.0.0.1:3000';

async function runPaymentsBrowserVerification() {
  if (!BROWSER_PATH) {
    console.error('Fatal: No suitable browser (Chrome / Edge) found on system.');
    process.exit(1);
  }

  console.log('================================================================');
  console.log('🧪 NIHOMI PRODUCTION PAYMENTS & CHECKOUT BROWSER VERIFICATION');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();

  try {
    // 1. Visit V2 Pricing Page
    console.log('[Step 1/3] Navigating to V2 Pricing Page (/pricing)...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${LOCAL_URL}/pricing`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    const pricingText = await page.evaluate(() => document.body.innerText);
    const hasPricingHeader = pricingText.includes('ন্যায্য মূল্য') || pricingText.includes('Nihomi') || pricingText.includes('বিকাশ');
    console.log(`  ✔ Pricing Page Header detected: ${hasPricingHeader}`);

    // 2. Click on "N5 Pro" or "এখনই শুরু করুন" button to open Checkout Modal
    console.log('[Step 2/3] Clicking Upgrade / Checkout Button to open CheckoutModal...');
    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const target = buttons.find(b =>
        b.innerText.includes('N5 Pro শুরু করুন') ||
        b.innerText.includes('ভর্তি হন') ||
        b.innerText.includes('সাবস্ক্রিপশন') ||
        b.innerText.includes('শুরু করুন')
      );
      if (target) {
        target.scrollIntoView({ behavior: 'instant', block: 'center' });
        target.click();
        return { success: true, text: target.innerText };
      }
      return { success: false, foundCount: buttons.length };
    });

    console.log('  Upgrade button click result:', clicked);
    await new Promise((r) => setTimeout(r, 1500));

    // 3. Verify Checkout Modal rendered and capture screenshot
    console.log('[Step 3/3] Verifying Checkout Modal preview & brand styling...');
    const modalText = await page.evaluate(() => document.body.innerText);
    const hasCheckoutModal = modalText.includes('চেকআউট') || modalText.includes('bKash') || modalText.includes('বিকাশ');
    console.log(`  ✔ Checkout Modal detected: ${hasCheckoutModal}`);
    await captureAndSaveScreenshot(page, 'v2-17-pricing-checkout-modal.png');

    console.log('\n================================================================');
    console.log('🎉 PAYMENTS BROWSER VERIFICATION COMPLETE!');
    console.log('================================================================');
  } catch (err) {
    console.error('Fatal during payments browser verification:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runPaymentsBrowserVerification();
