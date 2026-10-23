// scripts/verify-wp22-suite.cjs
// Headless Edge/Chrome Browser Verification Suite for NIHOMI WP22:
// JLPT/NAT CBT Mock Exam OS, Brand Guidelines Color Palette & Automated Official Certificate/Marksheet Engine
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
const DOWNLOAD_DIR = path.join(__dirname, '..', 'storage', 'test-downloads-wp22');

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
  console.log('🚀 NIHOMI WP22: REAL BROWSER EVIDENCE AUDIT — JLPT CBT EXAM OS');
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
    const browserErrors = [];
    page.on('console', (msg) => {
      const txt = msg.text();
      if (msg.type() === 'error') {
        browserErrors.push(txt);
        console.error('  [BROWSER ERROR]:', txt);
      }
    });

    // Seed Pro Founder session in localStorage for full CBT access
    await page.goto(`${LOCAL_URL}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('nihomi_user', JSON.stringify({
        id: 'usr_founder_01',
        name: 'Md Tanvir Kabir Biplob',
        email: 'mdtanvirkabirbiplob@gmail.com',
        role: 'founder',
        planId: 'pro',
        subscription: { status: 'active', plan: 'pro' }
      }));
      localStorage.setItem('nihomi_auth_role', 'founder');
      localStorage.setItem('nihomi_version_override', 'v2');
    });

    // --- TEST 1: Navigate to /exam and verify CBT Exam Catalog ---
    console.log('--- TEST 1: CBT Exam Catalog & Nihomi Brand Palette ---');
    await page.goto(`${LOCAL_URL}/exam`, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2000));

    const catalogContent = await page.content();
    assert(catalogContent.includes('JLPT') && (catalogContent.includes('মক টেস্ট') || catalogContent.includes('PRACTICE MOCK')), 'CBT Exam catalog header loaded');
    assert(catalogContent.includes('NIHOMI EXAM OS™'), 'Nihomi Exam OS brand title present');
    assert(catalogContent.includes('N5'), 'JLPT N5 level selector available');

    const startBtn = await page.$('.cbt-start-exam-btn');
    assert(!!startBtn, 'CBT registration/start button mounted');
    await saveScreenshot(page, 'v2-47-wp22-cbt-exam-catalog.png');

    // --- TEST 2: Open Hall Ticket Registration Modal ---
    console.log('\n--- TEST 2: CBT Hall Ticket Candidate Registration ---');
    if (startBtn) {
      await startBtn.click();
      await new Promise((r) => setTimeout(r, 1200));
    }

    const regModalHeader = await page.$('h2');
    const modalContent = await page.content();
    assert(modalContent.includes('CBT 受験票') || modalContent.includes('প্রবেশপত্র'), 'Hall Ticket modal visible');
    assert(modalContent.includes('NIHOMI COMPUTER-BASED TESTING'), 'Nihomi CBT brand banner visible in modal');

    // Fill candidate details cleanly
    await page.waitForSelector('#cbt-candidate-name-input', { timeout: 3000 });
    await page.$eval('#cbt-candidate-name-input', (el) => { el.value = ''; });
    await page.type('#cbt-candidate-name-input', 'MD TANVIR KABIR');

    const submitRegBtn = await page.$('#cbt-submit-registration-btn');
    assert(!!submitRegBtn, 'CBT submit registration button present');
    await saveScreenshot(page, 'v2-48-wp22-cbt-hall-ticket-registration.png');

    // Proceed to Exam Simulation
    await submitRegBtn.click();
    await new Promise((r) => setTimeout(r, 2000));

    // --- TEST 3: Exam Runner Intro & Start Simulation ---
    console.log('\n--- TEST 3: Timed CBT Simulation Runner ---');
    const introContent = await page.content();
    assert(introContent.includes('SIMULATION') || introContent.includes('পরীক্ষা'), 'Exam runner intro mode rendered');

    const beginBtn = await page.$('#btn-start-simulation');
    assert(!!beginBtn, 'Begin Official Exam Simulation button found');
    if (beginBtn) {
      await beginBtn.click();
      await new Promise((r) => setTimeout(r, 1500));
    }

    // Verify Timer and Running Exam view
    const timerEl = await page.$('#cbt-section-timer');
    const timerDisplay = await page.$('#cbt-timer-display');
    assert(!!timerEl && !!timerDisplay, 'CBT Countdown Timer mounted');

    const timerText1 = await page.evaluate((el) => el.textContent, timerDisplay);
    console.log(`  [INITIAL TIMER]: ${timerText1}`);
    assert(timerText1 && timerText1.includes(':'), 'Timer display formatted as mm:ss');

    // Answer first question
    const optionBtns = await page.$$('.btn-haptic');
    if (optionBtns.length > 0) {
      await optionBtns[0].click();
      await new Promise((r) => setTimeout(r, 400));
    }

    await saveScreenshot(page, 'v2-49-wp22-cbt-timed-simulation-runner.png');

    // --- TEST 4: Submit Exam & Verify Official Scorecard ---
    console.log('\n--- TEST 4: Submit Simulation & Verify Scorecard ---');
    // If next section button exists, navigate to end or submit
    let submitBtn = await page.$('#btn-submit-exam');
    while (!submitBtn) {
      const nextSecBtn = await page.$('#btn-next-section');
      if (!nextSecBtn) break;
      await nextSecBtn.click();
      await new Promise((r) => setTimeout(r, 600));
      submitBtn = await page.$('#btn-submit-exam');
    }

    assert(!!submitBtn, 'Submit Exam (提出) button available');
    if (submitBtn) {
      await submitBtn.click();
      await new Promise((r) => setTimeout(r, 3000));
    }

    const scorecardContent = await page.content();
    assert(scorecardContent.includes('SCORECARD') || scorecardContent.includes('Total Scaled Score'), 'Official Scorecard rendered');
    assert(scorecardContent.includes('180'), '180-point aggregate scale displayed');
    assert(scorecardContent.includes('得点区分別得点') || scorecardContent.includes('Sectional Scaled Score'), 'Sectional scaled scores breakdown present');
    await saveScreenshot(page, 'v2-50-wp22-cbt-official-scorecard.png');

    // --- TEST 5: Official Certificate View & Direct PDF Interception ---
    console.log('\n--- TEST 5: Official Certificate & Marksheet PDF Export ---');
    const certTabBtn = await page.$('#btn-review-certificate-tab');
    assert(!!certTabBtn, 'Official Certificate tab button mounted');
    if (certTabBtn) {
      await certTabBtn.click();
      await new Promise((r) => setTimeout(r, 1500));
    }

    const certContainer = await page.$('#nihomi-official-certificate');
    assert(!!certContainer, 'Official Nihomi Certificate DOM element mounted');

    const certHtml = await page.content();
    assert(certHtml.includes('合格認定証') || certHtml.includes('CERTIFICATE OF ACHIEVEMENT'), 'Japanese Certificate title present');
    assert(certHtml.includes('MD TANVIR KABIR'), 'Candidate name rendered correctly on Certificate');
    assert(certHtml.includes('にほみ') && certHtml.includes('認定印'), 'Official Inkan Hanko seal present');

    await saveScreenshot(page, 'v2-51-wp22-cbt-official-certificate.png');

    // Trigger PDF Certificate Download
    const downloadCertBtn = await page.$('#download-official-certificate-btn');
    assert(!!downloadCertBtn, 'Download Official Certificate PDF button present');
    if (downloadCertBtn) {
      console.log('  Triggering #download-official-certificate-btn click...');
      await downloadCertBtn.click();
      await new Promise((r) => setTimeout(r, 2500));
    }

    // Trigger PDF Marksheet Download
    const downloadMarksheetBtn = await page.$('#download-official-marksheet-btn');
    assert(!!downloadMarksheetBtn, 'Download Official Marksheet PDF button present');
    if (downloadMarksheetBtn) {
      console.log('  Triggering #download-official-marksheet-btn click...');
      await downloadMarksheetBtn.click();
      await new Promise((r) => setTimeout(r, 2500));
    }

    // Inspect downloaded PDF files in DOWNLOAD_DIR
    const downloadedFiles = fs.readdirSync(DOWNLOAD_DIR);
    console.log(`  [DOWNLOADED FILES IN DISK]:`, downloadedFiles);

    assert(downloadedFiles.length >= 2, `At least 2 PDF files downloaded (actual: ${downloadedFiles.length})`);

    let certPdfFound = false;
    let marksheetPdfFound = false;

    for (const f of downloadedFiles) {
      const filePath = path.join(DOWNLOAD_DIR, f);
      const stat = fs.statSync(filePath);
      const buffer = fs.readFileSync(filePath);
      const header = buffer.slice(0, 5).toString('utf8');

      console.log(`    File: ${f} (${(stat.size / 1024).toFixed(1)} KB) - Header: "${header}"`);
      assert(stat.size > 20000, `${f} has substantial binary size (> 20KB): ${stat.size} bytes`);
      assert(header.startsWith('%PDF-'), `${f} has valid PDF magic header (%PDF-)`);

      if (f.includes('Certificate')) certPdfFound = true;
      if (f.includes('ScoreReport') || f.includes('Marksheet')) marksheetPdfFound = true;
    }

    assert(certPdfFound, 'Certificate PDF intercepted on local disk');
    assert(marksheetPdfFound, 'Marksheet ScoreReport PDF intercepted on local disk');

    // Verify zero fatal browser exceptions
    const fatalErrors = browserErrors.filter((e) => !e.includes('favicon') && !e.includes('net::ERR_') && !e.includes('401'));
    assert(fatalErrors.length === 0, `Zero fatal browser console errors (actual: ${fatalErrors.length})`);

    console.log('\n================================================================');
    console.log(`🏁 WP22 TEST RESULTS: ${totalPassed} / ${totalTests} TESTS PASSED`);
    console.log('================================================================\n');

    await browser.close();
    process.exit(totalPassed === totalTests ? 0 : 1);
  } catch (err) {
    console.error('Test execution exception:', err);
    await browser.close();
    process.exit(1);
  }
}

run();
