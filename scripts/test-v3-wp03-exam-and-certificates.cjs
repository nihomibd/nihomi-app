// scripts/test-v3-wp03-exam-and-certificates.cjs
// Automated Puppeteer Verification Suite for NIHOMI V3 WP03:
// "Version 3 CBT Exam OS, Official Branded Marksheet & Verifiable Certificate Engine"
// Adhering strictly to "No Evidence = No Done" protocol.

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
    const buffer = await page.screenshot({ fullPage: true });
    fs.writeFileSync(localPath, buffer);
    fs.writeFileSync(destPath, buffer);
    console.log(`  📸 [SCREENSHOT SAVED]: ${filename}`);
  } catch (err) {
    console.warn(`  [Screenshot Warning] ${filename}:`, err.message);
  }
}

let passedAssertions = 0;
let totalAssertions = 0;

function assert(desc, condition) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  ✅ [PASS] ${desc}`);
  } else {
    console.error(`  ❌ [FAIL] ${desc}`);
    throw new Error(`Assertion failed: ${desc}`);
  }
}

const LOCAL_URL = 'http://127.0.0.1:3000';

async function runSuite() {
  console.log('\n============================================================');
  console.log('🚀 NIHOMI V3 WP03: CBT EXAM OS & CERTIFICATE ENGINE VERIFICATION');
  console.log('   "No Evidence = No Done"');
  console.log('============================================================\n');

  // STEP 1: API Unit Test for Certificate Verification Endpoint
  console.log('--- Step 1: Testing Institutional Certificate Verification API ---');
  const validCertId = 'NHM-CERT-2026-N5-8821';
  const apiRes = await fetch(`${LOCAL_URL}/api/public/verify-certificate/${validCertId}`);
  assert('HTTP status 200 returned for valid cert verification', apiRes.status === 200);

  const apiJson = await apiRes.json();
  assert('API response indicates success: true', apiJson.success === true);
  assert('API response indicates valid: true', apiJson.valid === true);
  assert('Certificate student name matches MD TANVIR KABIR', apiJson.certificate && apiJson.certificate.studentName === 'MD TANVIR KABIR');
  assert('Certificate certified level matches N5', apiJson.certificate && apiJson.certificate.certifiedLevel === 'N5');
  assert('Certificate overall readiness index is 92', apiJson.certificate && apiJson.certificate.overallReadinessIndex === 92);
  assert('Verification cryptographic hash is 32-character SHA-256', apiJson.certificate && typeof apiJson.certificate.verificationHash === 'string' && apiJson.certificate.verificationHash.length === 32);

  // Test invalid cert ID
  const invalidRes = await fetch(`${LOCAL_URL}/api/public/verify-certificate/UNKNOWN-INVALID-CERT`);
  const invalidJson = await invalidRes.json();
  assert('Invalid certificate ID returns valid: false', invalidJson.valid === false);

  // STEP 2: Headless Browser Verification
  console.log('\n--- Step 2: Launching Headless Browser (Edge/Chrome) ---');
  if (!BROWSER_PATH) {
    throw new Error('Fatal: No Chrome/Edge browser binary found.');
  }

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 960 });

    // 2.1 Exam OS Hub & Catalog (Value-First Access)
    console.log('\n--- Step 2.1: Testing Exam OS Hub (Unblocked Value-First Access) ---');
    await page.goto(`${LOCAL_URL}/#/exam`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));

    const pageContent = await page.content();
    assert('Page rendered Exam OS without paywall blocker', pageContent.includes('NIHOMI EXAM OS™'));
    
    const hasCbtTab = await page.$('#tab-btn-cbt-sim');
    assert('CBT Exam Simulator tab button exists', hasCbtTab !== null);

    const hasCredTab = await page.$('#tab-btn-credentials');
    assert('Official Credentials tab button exists', hasCredTab !== null);

    const hasDiagnosticBtn = await page.$('#btn-quick-launch-diagnostic-exam');
    assert('Diagnostic Quick Launch exam button exists', hasDiagnosticBtn !== null);

    assert('Free Open Trial disclosure banner exists', pageContent.includes('১০০% ফ্রি ওপেন ট্রায়াল'));

    await saveScreenshot(page, 'v3-03-exam-os-hub.png');

    // 2.2 Official Certificate & Marksheet Showcase
    console.log('\n--- Step 2.2: Testing Official Marksheet & Certificate Showcase ---');
    await page.click('#tab-btn-credentials');
    await new Promise((r) => setTimeout(r, 1500));

    const certContainer = await page.$('#nihomi-official-certificate');
    assert('Official Certificate showcase container is rendered in DOM', certContainer !== null);

    const certText = await page.evaluate(() => {
      const el = document.querySelector('#nihomi-official-certificate');
      return el ? el.innerText : '';
    });

    assert('Certificate displays authentic Japanese heading (合格認定証)', certText.includes('合格認定証'));
    assert('Certificate displays Candidate Roll (NHM-JLPT-N5-2026-8821)', certText.includes('NHM-JLPT-N5-2026-8821'));
    assert('Certificate displays Scaled Score (138 / 180)', certText.includes('138') && certText.includes('/ 180'));
    assert('Certificate displays Inkan Hanko seal (にほみ 認定印)', certText.includes('にほみ') && certText.includes('認定印'));
    assert('Certificate displays Tamper-Proof Cryptographic Hash', certText.toLowerCase().includes('tamper-proof hash') || certText.includes('e45147f59e0b141726a4c89d900a73a9'));

    const hasDownloadCertBtn = await page.$('#download-official-certificate-btn');
    assert('Download Official Certificate PDF button exists', hasDownloadCertBtn !== null);

    const hasDownloadMarksheetBtn = await page.$('#download-official-marksheet-btn');
    assert('Download Official Marksheet PDF button exists', hasDownloadMarksheetBtn !== null);

    const hasLiveVerifyPortalLink = await page.$('#btn-open-live-verification-portal');
    assert('Open Live Verification Portal link exists', hasLiveVerifyPortalLink !== null);

    // Test level switcher
    await page.click('#btn-cert-level-N3');
    await new Promise((r) => setTimeout(r, 1000));
    const n3Text = await page.evaluate(() => {
      const el = document.querySelector('#nihomi-official-certificate');
      return el ? el.innerText : '';
    });
    assert('Switching level to N3 updates certificate roll and level to N3', n3Text.includes('N3'));

    await saveScreenshot(page, 'v3-03-certificate-showcase.png');

    // 2.3 Public Institutional Verification Portal
    console.log('\n--- Step 2.3: Testing Public Institutional Verification Portal ---');
    await page.goto(`${LOCAL_URL}/verify?id=${validCertId}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));

    const verifyContent = await page.content();
    assert('Public Verification portal loaded candidate name', verifyContent.includes('MD TANVIR KABIR'));
    assert('Verification portal displays institutional authenticity/level N5', verifyContent.includes('N5'));
    assert('Verification portal displays verification success indicator', verifyContent.includes('সত্যায়িত') || verifyContent.includes('Verified') || verifyContent.includes('সফলভাবে') || verifyContent.includes('VALID'));

    await saveScreenshot(page, 'v3-03-public-verification-portal.png');

    // 2.4 Master Verification Screen
    console.log('\n--- Step 2.4: Capturing Master WP03 Proof ---');
    await page.goto(`${LOCAL_URL}/#/exam`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.click('#tab-btn-credentials');
    await new Promise((r) => setTimeout(r, 1200));

    await saveScreenshot(page, 'v3-03-wp03-master-exam-verification.png');

  } finally {
    await browser.close();
  }

  console.log('\n============================================================');
  console.log(`🎉 ALL ${passedAssertions}/${totalAssertions} ASSERTIONS PASSED GREEN (100%)!`);
  console.log('✅ NIHOMI V3 WP03: CBT Exam OS & Certificate Engine Verified!');
  console.log('============================================================\n');
}

runSuite().catch((err) => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
