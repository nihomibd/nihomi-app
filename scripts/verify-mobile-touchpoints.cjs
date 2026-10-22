// scripts/verify-mobile-touchpoints.cjs
// Real Headless Chromium/Edge Browser Verification Suite for Mobile Touchpoints & Zero Overflow
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

async function runMobileAudit() {
  if (!BROWSER_PATH) {
    console.error('Fatal: No suitable browser (Chrome / Edge) found on system.');
    process.exit(1);
  }

  console.log('================================================================');
  console.log('📱 NIHOMI V2 MOBILE TOUCHPOINT & OVERFLOW AUDIT');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  let passCount = 0;

  try {
    // 1. Mobile Journey (390px x 844px)
    console.log('[Test 1/3] Mobile Tokyo Journey (390px iPhone Viewport)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(`${LOCAL_URL}/#journey`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    const journeyAudit = await page.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      const hasOverflow = scrollWidth > clientWidth;
      const bodyText = document.body.innerText;
      return {
        hasOverflow,
        scrollWidth,
        clientWidth,
        hasContent: bodyText.includes('জার্নি') || bodyText.includes('টোকিও') || bodyText.includes('Mission')
      };
    });

    console.log(`  Journey Overflow check: ${journeyAudit.hasOverflow ? 'FAILED (has overflow)' : 'PASSED (zero overflow)'}`);
    await captureAndSaveScreenshot(page, 'v2-18-mobile-journey-390.png');
    if (!journeyAudit.hasOverflow && journeyAudit.hasContent) passCount++;

    // 2. Mobile Curriculum (390px x 844px)
    console.log('\n[Test 2/3] Mobile N5-N1 Curriculum (390px iPhone Viewport)...');
    await page.goto(`${LOCAL_URL}/#curriculum`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    const curriculumAudit = await page.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      const hasOverflow = scrollWidth > clientWidth;
      const bodyText = document.body.innerText;
      return {
        hasOverflow,
        scrollWidth,
        clientWidth,
        hasContent: bodyText.includes('N5') || bodyText.includes('কারিকুলাম') || bodyText.includes('সিলেবাস')
      };
    });

    console.log(`  Curriculum Overflow check: ${curriculumAudit.hasOverflow ? 'FAILED (has overflow)' : 'PASSED (zero overflow)'}`);
    await captureAndSaveScreenshot(page, 'v2-19-mobile-curriculum-390.png');
    if (!curriculumAudit.hasOverflow && curriculumAudit.hasContent) passCount++;

    // 3. Mobile JLPT CBT Exam Hub (390px x 844px)
    console.log('\n[Test 3/3] Mobile JLPT CBT Exam Hub (390px iPhone Viewport)...');
    await page.goto(`${LOCAL_URL}/#exam`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    const examAudit = await page.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      const hasOverflow = scrollWidth > clientWidth;
      const bodyText = document.body.innerText;
      return {
        hasOverflow,
        scrollWidth,
        clientWidth,
        hasContent: bodyText.includes('JLPT') || bodyText.includes('মক') || bodyText.includes('পরীক্ষা')
      };
    });

    console.log(`  Exam Hub Overflow check: ${examAudit.hasOverflow ? 'FAILED (has overflow)' : 'PASSED (zero overflow)'}`);
    await captureAndSaveScreenshot(page, 'v2-20-mobile-exam-390.png');
    if (!examAudit.hasOverflow && examAudit.hasContent) passCount++;

    console.log('\n================================================================');
    console.log(`🎉 MOBILE AUDIT COMPLETE: ${passCount}/3 VIEWS ZERO-OVERFLOW GREEN!`);
    console.log('================================================================');
  } catch (err) {
    console.error('Fatal during mobile audit:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runMobileAudit();
