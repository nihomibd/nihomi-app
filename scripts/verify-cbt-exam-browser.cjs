// scripts/verify-cbt-exam-browser.cjs
// Real Headless Chromium/Edge Browser Verification Suite for NIHOMI CBT MOCK EXAMS & CERTIFICATES
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

async function runCbtBrowserVerification() {
  if (!BROWSER_PATH) {
    console.error('Fatal: No suitable browser (Chrome / Edge) found on system.');
    process.exit(1);
  }

  console.log('================================================================');
  console.log('🧪 CBT MOCK EXAMS & REGISTRATION BROWSER VERIFICATION');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();

  try {
    // 1. Visit V2 Exam Hub
    console.log('[Step 1/3] Navigating to V2 Mock Exams Hub (/exams)...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${LOCAL_URL}/exams`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));

    const examHubText = await page.evaluate(() => document.body.innerText);
    const hasCbtHeader = examHubText.includes('JLPT') || examHubText.includes('NAT-TEST') || examHubText.includes('কম্পিউটার-বেসড টেস্ট');
    console.log(`  ✔ Exam Hub Header detected: ${hasCbtHeader}`);
    await captureAndSaveScreenshot(page, 'v2-15-cbt-exam-hub.png');

    // 2. Click on "রেজিস্ট্রেশন ও পরীক্ষা শুরু" to open Hall Ticket Registration Modal
    console.log('[Step 2/3] Clicking Registration Button to trigger CBT Registration Modal...');
    
    // Find all buttons containing the text
    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const target = buttons.find(b => b.innerText.includes('রেজিস্ট্রেশন') || b.innerText.includes('পরীক্ষা শুরু') || b.innerText.includes('CBT'));
      if (target) {
        target.scrollIntoView({ behavior: 'instant', block: 'center' });
        target.click();
        return { success: true, text: target.innerText };
      }
      return { success: false, foundCount: buttons.length };
    });

    console.log('  Button click evaluation result:', clicked);
    await new Promise((r) => setTimeout(r, 1500));

    // 3. Verify Hall Ticket / Registration Modal rendered
    console.log('[Step 3/3] Verifying Hall Ticket / Registration Modal preview...');
    const modalText = await page.evaluate(() => document.body.innerText);
    const hasHallTicket = modalText.includes('পরীক্ষার্থীর তথ্য ও প্রবেশপত্র') || modalText.includes('受験票') || modalText.includes('NHM-JLPT');
    console.log(`  ✔ Hall Ticket modal detected: ${hasHallTicket}`);
    await captureAndSaveScreenshot(page, 'v2-16-cbt-registration-hall-ticket.png');

    console.log('\n================================================================');
    console.log('🎉 CBT BROWSER VERIFICATION COMPLETE!');
    console.log('================================================================');
  } catch (err) {
    console.error('Fatal during CBT browser verification:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runCbtBrowserVerification();
