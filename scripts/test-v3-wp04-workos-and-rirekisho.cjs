// scripts/test-v3-wp04-workos-and-rirekisho.cjs
// Automated Puppeteer Verification Suite for NIHOMI V3 WP04:
// "Version 3 Tokyo Konbini WorkOS POS Simulator & Official JIS Rirekisho Studio"
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
  console.log('🚀 NIHOMI V3 WP04: TOKYO WORKOS & JIS RIREKISHO VERIFICATION');
  console.log('   "No Evidence = No Done"');
  console.log('============================================================\n');

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

    // STEP 1: Tokyo WorkOS POS Simulator
    console.log('--- Step 1: Testing Tokyo WorkOS POS Simulator (/#/workos) ---');
    await page.goto(`${LOCAL_URL}/#/workos`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));

    const workosContent = await page.content();
    assert('WorkOS page loaded with main title', workosContent.includes('রিয়েল জাপান কর্মক্ষেত্র ও কনবিনি সিমুলেশন'));
    assert('Top breadcrumb button to dashboard exists', (await page.$('#btn-back-from-workos')) !== null);
    assert('Cashier Drill tab button exists', (await page.$('#tab-btn-workos-cashier')) !== null);
    assert('Scenarios Pack tab button exists', (await page.$('#tab-btn-workos-scenarios')) !== null);
    assert('Cashier status banner shows READY TO SERVE', workosContent.includes('READY TO SERVE'));

    // Check POS simulator DOM elements
    const hasConbiniFigure = await page.evaluate(() => {
      return document.querySelector('.conbini-customer-figure') !== null ||
             document.body.innerText.includes('いらっしゃいませ') ||
             document.body.innerText.includes('7-Eleven') ||
             document.body.innerText.includes('セブン-イレブン') ||
             document.body.innerText.includes('7-Eleven Cashier');
    });
    assert('Conbini POS workstation elements are rendered in DOM', hasConbiniFigure);

    await saveScreenshot(page, 'v3-04-workos-pos-drill.png');

    // Switch to Scenarios tab
    console.log('\n--- Step 1.2: Testing WorkOS Scenarios Pack Tab ---');
    await page.click('#tab-btn-workos-scenarios');
    await new Promise((r) => setTimeout(r, 1500));

    const scenariosContent = await page.content();
    assert('Scenarios tab rendered without crash', scenariosContent.includes('জাপান লাইফ সিনারিও') || scenariosContent.includes('সিনারিও'));

    await saveScreenshot(page, 'v3-04-workos-scenarios.png');

    // STEP 2: JIS Rirekisho Studio
    console.log('\n--- Step 2: Testing JIS Rirekisho Studio (/#/rirekisho) ---');
    await page.goto(`${LOCAL_URL}/#/rirekisho`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));

    const rirekishoContent = await page.content();
    assert('Rirekisho page loaded with main title', rirekishoContent.includes('জাপান স্ট্যান্ডার্ড JIS রিলোকেশন CV স্টুডিও'));
    assert('Top breadcrumb button to dashboard exists', (await page.$('#btn-back-from-rirekisho')) !== null);
    assert('JIS Z 8303 standard indicator is present', rirekishoContent.includes('JIS Z 8303') || rirekishoContent.includes('JIS 규格'));
    assert('Japanese era conversion badge exists', rirekishoContent.includes('জাপানি সাল রূপান্তর'));
    assert('Visa work clause compliance badge exists', rirekishoContent.includes('ভিসা ও কাজের অনুমতি ক্লজ'));

    // Verify candidate data inputs inside editor
    const candidateDataPresent = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('TANVIR') || text.includes('履歴書') || text.includes('学歴') || text.includes('志望動機');
    });
    assert('JIS Rirekisho editor loaded Japanese resume fields (履歴書)', candidateDataPresent);

    await saveScreenshot(page, 'v3-04-jis-rirekisho-editor.png');

    // Test preview / toggle if available or inspect document preview
    const hasDownloadBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.innerText.includes('PDF') || b.innerText.includes('ডাউনলোড') || b.innerText.includes('প্রিন্ট') || b.innerText.includes('Print'));
    });
    assert('PDF / Print export action is available in Rirekisho Studio', hasDownloadBtn);

    await saveScreenshot(page, 'v3-04-jis-rirekisho-preview.png');

    // STEP 3: Master WP04 Proof
    console.log('\n--- Step 3: Capturing Master WP04 Proof ---');
    await page.goto(`${LOCAL_URL}/#/workos`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200));

    await saveScreenshot(page, 'v3-04-wp04-master-workos-rirekisho.png');

  } finally {
    await browser.close();
  }

  console.log('\n============================================================');
  console.log(`🎉 ALL ${passedAssertions}/${totalAssertions} ASSERTIONS PASSED GREEN (100%)!`);
  console.log('✅ NIHOMI V3 WP04: Tokyo WorkOS & JIS Rirekisho Studio Verified!');
  console.log('============================================================\n');
}

runSuite().catch((err) => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
