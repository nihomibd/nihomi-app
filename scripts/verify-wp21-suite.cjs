// scripts/verify-wp21-suite.cjs
// Headless Edge/Chrome Browser Verification Suite for NIHOMI WP21:
// JIS Standard Relocation CV Studio PDF Direct Download & Print Pipeline
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
const DOWNLOAD_DIR = path.join(__dirname, '..', 'storage', 'test-downloads-wp21');

if (!fs.existsSync(EVIDENCE_DIR)) fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

// Clean previous test downloads
fs.readdirSync(DOWNLOAD_DIR).forEach((f) => {
  try { fs.unlinkSync(path.join(DOWNLOAD_DIR, f)); } catch {}
});

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
  console.log('🚀 NIHOMI WP21: REAL BROWSER EVIDENCE AUDIT — JIS CV PDF ENGINE');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1280,900']
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
    await page.setViewport({ width: 1280, height: 900 });

    // Enable native download behavior via Chrome DevTools Protocol
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: DOWNLOAD_DIR
    });

    // Capture browser console warnings/errors
    const browserLogs = [];
    page.on('console', (msg) => {
      const txt = msg.text();
      browserLogs.push(txt);
      if (msg.type() === 'error') {
        console.error('  [BROWSER ERROR]:', txt);
      }
    });

    // --- TEST 1: Navigation to /rirekisho and Editor Mode Verification ---
    console.log('--- TEST 1: JIS Relocation CV Studio Editor Mode ---');
    await page.goto(`${LOCAL_URL}/rirekisho`, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2000));

    const pageContent = await page.content();
    assert(pageContent.includes('JIS Standard CV Studio') || pageContent.includes('JIS Rirekisho Studio'), 'JIS Studio header rendered');
    assert(pageContent.includes('履 歴 書') || pageContent.includes('履歴書'), 'Japanese Rirekisho branding present');

    const downloadBtn = await page.$('#jis-download-pdf-btn');
    assert(downloadBtn !== null, 'PDF download button (#jis-download-pdf-btn) is mounted');

    const saveDraftBtn = await page.$('#jis-save-draft-btn');
    assert(saveDraftBtn !== null, 'Save draft button (#jis-save-draft-btn) is mounted');

    await saveScreenshot(page, 'v2-43-wp21-jis-rirekisho-editor.png');

    // --- TEST 2: Toggle Preview Mode and Verify Japanese A4 Layout ---
    console.log('\n--- TEST 2: Toggle Preview Mode & Inspect Japanese A4 Paper ---');
    // Find Preview toggle button
    const buttons = await page.$$('button');
    let previewToggleBtn = null;
    for (const b of buttons) {
      const text = await (await b.getProperty('innerText')).jsonValue();
      if (text.includes('JIS様式プレビュー') || text.includes('プレビュー')) {
        previewToggleBtn = b;
        break;
      }
    }
    assert(previewToggleBtn !== null, 'JIS Style Preview toggle button found');

    if (previewToggleBtn) {
      await previewToggleBtn.click();
      await new Promise((r) => setTimeout(r, 1000));
    }

    const paper = await page.$('#jis-resume-paper');
    assert(paper !== null, 'A4 Resume Paper DOM element (#jis-resume-paper) is visible');

    const paperText = await page.$eval('#jis-resume-paper', (el) => el.innerText);
    assert(paperText.includes('履 歴 書'), 'A4 Paper contains official Japanese title "履 歴 書"');
    assert(paperText.includes('学歴') && paperText.includes('職歴'), 'Academic and Work history tables present');
    assert(paperText.includes('免許・資格'), 'Licenses & JLPT certifications section present');
    assert(paperText.includes('志望の動機') || paperText.includes('自己PR'), 'Motivation & Self PR statement present');

    await saveScreenshot(page, 'v2-44-wp21-jis-rirekisho-preview-mode.png');

    // --- TEST 3: Trigger PDF Download & Intercept Binary File ---
    console.log('\n--- TEST 3: Direct PDF Generation & File Interception ---');
    console.log('  Triggering #jis-download-pdf-btn click...');
    await page.click('#jis-download-pdf-btn');

    // Wait for PDF rendering and download
    let downloadedPdfPath = null;
    const startTime = Date.now();
    while (Date.now() - startTime < 15000) {
      const files = fs.readdirSync(DOWNLOAD_DIR);
      const pdfFile = files.find((f) => f.endsWith('.pdf'));
      if (pdfFile) {
        downloadedPdfPath = path.join(DOWNLOAD_DIR, pdfFile);
        break;
      }
      await new Promise((r) => setTimeout(r, 500));
    }

    assert(downloadedPdfPath !== null, 'PDF file successfully downloaded to local disk');

    if (downloadedPdfPath) {
      const stats = fs.statSync(downloadedPdfPath);
      console.log(`  [DOWNLOADED FILE]: ${path.basename(downloadedPdfPath)} (${(stats.size / 1024).toFixed(1)} KB)`);

      assert(stats.size > 20000, `PDF size is substantial (> 20KB): actual ${stats.size} bytes`);

      // Verify PDF magic header bytes
      const fileBuffer = fs.readFileSync(downloadedPdfPath);
      const header = fileBuffer.slice(0, 5).toString('ascii');
      assert(header === '%PDF-', `File has valid PDF header (%PDF-): actual "${header}"`);
    }

    // Verify no oklch parser errors in browser logs
    const hasOklchError = browserLogs.some((l) => l.includes('unsupported color function "oklch"'));
    assert(!hasOklchError, 'Zero unsupported color function "oklch" errors during rendering');

    await saveScreenshot(page, 'v2-45-wp21-jis-pdf-download-success.png');

    // --- TEST 4: Mobile Responsiveness Verification ---
    console.log('\n--- TEST 4: Mobile Viewport Responsiveness (390 x 844) ---');
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(`${LOCAL_URL}/rirekisho`, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1500));

    // Check horizontal scroll overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    assert(!hasHorizontalOverflow, 'Zero horizontal viewport overflow on mobile (390px)');

    const mobileDownloadBtn = await page.$('#jis-download-pdf-btn');
    assert(mobileDownloadBtn !== null, 'Mobile PDF download button clearly mounted and accessible');

    await saveScreenshot(page, 'v2-46-wp21-jis-rirekisho-mobile-download.png');

  } catch (err) {
    console.error('Test Suite Exception:', err);
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log(`🏁 WP21 TEST RESULTS: ${totalPassed} / ${totalTests} TESTS PASSED`);
  console.log('================================================================\n');

  if (totalPassed < totalTests) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
