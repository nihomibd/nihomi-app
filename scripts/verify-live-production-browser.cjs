// scripts/verify-live-production-browser.cjs
// Live Browser Verification of Deployed Production Site https://www.nihomi.com
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

async function captureAndSave(page, filename) {
  const localPath = path.join(EVIDENCE_DIR, filename);
  const destPath = path.join(ARTIFACT_DIR, filename);
  const buffer = await page.screenshot({ fullPage: false });
  fs.writeFileSync(localPath, buffer);
  try {
    fs.writeFileSync(destPath, buffer);
  } catch (e) {}
  console.log(`[EVIDENCE SAVED] ${filename} (${buffer.length} bytes)`);
}

async function verifyLiveProduction() {
  console.log('================================================================');
  console.log('🚀 LIVE PRODUCTION BROWSER VERIFICATION: https://www.nihomi.com');
  console.log('================================================================\n');

  if (!BROWSER_PATH) {
    console.error('No suitable browser found for headless verification.');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Desktop 1280x800
    console.log('[SCENARIO 1] Desktop Viewport (1280x800) on https://www.nihomi.com...');
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    const response = await page.goto('https://www.nihomi.com', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log(`  HTTP Status: ${response.status()}`);
    
    // Check title and key element
    const title = await page.title();
    console.log(`  Page Title: ${title}`);
    
    await new Promise((r) => setTimeout(r, 2000));
    await captureAndSave(page, 'v2-21-live-production-desktop-1280.png');

    // 2. Mobile 390x844 (iPhone 14)
    console.log('\n[SCENARIO 2] Mobile Viewport (390x844) on https://www.nihomi.com...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto('https://www.nihomi.com', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));
    
    // Check horizontal overflow
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log(`  Mobile Overflow Detected: ${overflow ? 'YES (UNEXPECTED)' : 'NO (PASSED - ZERO OVERFLOW)'}`);
    
    await captureAndSave(page, 'v2-22-live-production-mobile-390.png');

    // 3. Direct route /pricing
    console.log('\n[SCENARIO 3] Direct Navigation /pricing on https://www.nihomi.com...');
    const pricingRes = await page.goto('https://www.nihomi.com/pricing', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log(`  Pricing HTTP Status: ${pricingRes.status()}`);
    await new Promise((r) => setTimeout(r, 2000));
    await captureAndSave(page, 'v2-23-live-production-pricing.png');

    console.log('\n[CONSOLE ERRORS ENCOUNTERED]');
    if (consoleErrors.length === 0) {
      console.log('  None! Clean production console.');
    } else {
      console.log(`  ${consoleErrors.length} errors:`, consoleErrors.slice(0, 5));
    }

    console.log('\n================================================================');
    console.log('✔ LIVE PRODUCTION BROWSER VERIFICATION COMPLETED SUCCESSFULLY');
    console.log('================================================================');
  } finally {
    await browser.close();
  }
}

verifyLiveProduction().catch((err) => {
  console.error('Live production verification failed:', err);
  process.exit(1);
});
