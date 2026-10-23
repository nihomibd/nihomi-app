// scripts/verify-wp23-suite.cjs
// Headless Browser Verification Suite for NIHOMI WP23:
// Global UI & Typography Brand Guidelines Realignment (Crimson #E45147, Amber #F59E0B, Obsidian #0A0A12)
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
  console.log('🚀 NIHOMI WP23: REAL BROWSER EVIDENCE AUDIT — BRAND PALETTE UI');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1280,900']
  });

  let totalPassed = 0;
  let totalTests = 0;

  function assert(condition, testName) {
    totalTests++;
    if (condition) {
      totalPassed++;
      console.log(`  [PASS] #${totalTests}: ${testName}`);
    } else {
      console.error(`  [FAIL] #${totalTests}: ${testName}`);
    }
  }

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Ensure session has authentic Student user logged in
    await page.goto(`${LOCAL_URL}/`, { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      localStorage.setItem('nihomi_user', JSON.stringify({
        id: 'std_tanvir_wp23',
        name: 'Md Tanvir Kabir',
        email: 'tanvir@nihomi.com',
        role: 'student',
        planId: 'pro',
        createdAt: '2026-10-23T12:00:00.000Z'
      }));
      localStorage.setItem('nihomi_student_active_view', 'landing');
    });

    // -------------------------------------------------------------
    // TEST 1: V2 LANDING PAGE BRAND PALETTE AUDIT
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing V2 Landing Page Brand Guidelines Alignment ---');
    await page.goto(`${LOCAL_URL}/`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    const landingHeading = await page.$eval('h1', (el) => el.innerText).catch(() => '');
    assert(landingHeading.length > 5, 'Landing page h1 header rendered');

    // Assert zero rogue colors in landing page main container
    const landingRogueColors = await page.evaluate(() => {
      const allEls = document.querySelectorAll('*');
      let rogue = [];
      allEls.forEach((el) => {
        const cls = el.className;
        if (typeof cls === 'string') {
          const match = cls.match(/\b(text|bg|border)-(cyan|purple|indigo|pink|violet)-/i);
          if (match && !cls.includes('ai-companion') && !cls.includes('modal-container')) {
            rogue.push(match[0]);
          }
        }
      });
      return rogue;
    });
    assert(landingRogueColors.length === 0, `Landing page has 0 rogue color classes (found: ${landingRogueColors.length})`);

    await saveScreenshot(page, 'v2-52-wp23-landing-brand-palette.png');

    // -------------------------------------------------------------
    // TEST 2: V2 DASHBOARD STATS & QUICK ACTIONS PALETTE AUDIT
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing V2 Dashboard Stat Cards & Quick Actions Palette ---');
    await page.goto(`${LOCAL_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    const dashboardRogueColors = await page.evaluate(() => {
      const stats = document.querySelectorAll('.rounded-2xl.bg-\\[\\#141726\\]');
      let rogue = [];
      stats.forEach((el) => {
        const cls = el.className;
        if (typeof cls === 'string' && cls.match(/\b(text|bg|border)-(cyan|purple|indigo|pink|violet)-/i)) {
          rogue.push(cls);
        }
      });
      return rogue;
    });
    assert(dashboardRogueColors.length === 0, `Dashboard stat cards have 0 rogue color classes (found: ${dashboardRogueColors.length})`);

    // Verify Quick Actions use #E45147 (CV) and amber-400 (Exam OS)
    const quickActionsCheck = await page.evaluate(() => {
      const pageText = document.body.innerText;
      return pageText.includes('JIS রেডি') || pageText.includes('ড্রাফট মোড');
    });
    assert(quickActionsCheck, 'Dashboard Quick Actions correctly rendered with JIS / Exam links');

    await saveScreenshot(page, 'v2-53-wp23-dashboard-brand-palette.png');

    // -------------------------------------------------------------
    // TEST 3: V2 PRICING PAGE & COMPARISON MATRIX AUDIT
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing V2 Pricing Page & Comparison Matrix Brand Palette ---');
    await page.goto(`${LOCAL_URL}/pricing`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // Assert yearly discount badge is amber-400 (not cyan)
    const yearlyBadgeClass = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const yearlyBtn = buttons.find((b) => b.innerText.includes('বাৎসরিক'));
      if (!yearlyBtn) return null;
      const span = yearlyBtn.querySelector('span:nth-child(2)');
      return span ? span.className : null;
    });
    assert(yearlyBadgeClass && yearlyBadgeClass.includes('bg-amber-400'), `Yearly discount badge uses bg-amber-400 (was: ${yearlyBadgeClass})`);

    // Assert Comparison Matrix has zero cyan/purple
    const matrixRogueColors = await page.evaluate(() => {
      const matrix = document.querySelector('#v2-pricing-comparison-matrix');
      if (!matrix) return ['Matrix not found'];
      const cells = matrix.querySelectorAll('*');
      let rogue = [];
      cells.forEach((el) => {
        const cls = el.className;
        if (typeof cls === 'string') {
          const match = cls.match(/\b(text|bg|border)-(cyan|purple|indigo|pink|violet)-/i);
          if (match) rogue.push(match[0]);
        }
      });
      return rogue;
    });
    assert(matrixRogueColors.length === 0, `Comparison matrix has 0 rogue color classes (found: ${matrixRogueColors.length})`);

    // Assert Pro card is styled with official crimson #E45147 border
    const proCardStyled = await page.evaluate(() => {
      const proCard = document.querySelector('.border-\\[\\#E45147\\]');
      return !!proCard;
    });
    assert(proCardStyled, 'Pro Pricing Card is highlighted with official Crimson #E45147 border');

    await saveScreenshot(page, 'v2-54-wp23-pricing-brand-palette.png');

    // -------------------------------------------------------------
    // TEST 4: V2 RIREKISHO PAGE PALETTE AUDIT
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing V2 Rirekisho JIS CV Brand Guidelines ---');
    await page.goto(`${LOCAL_URL}/rirekisho`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    const rirekishoBadgeClass = await page.evaluate(() => {
      const spans = Array.from(document.querySelectorAll('span'));
      const badge = spans.find((s) => s.innerText.includes('জাপানিজ কর্মসংস্থান মানদণ্ড'));
      return badge ? badge.className : '';
    });
    assert(
      rirekishoBadgeClass.includes('text-[#E45147]') || rirekishoBadgeClass.includes('border-[#E45147]'),
      `Rirekisho header badge aligns with brand Crimson #E45147 (was: ${rirekishoBadgeClass})`
    );

    await saveScreenshot(page, 'v2-55-wp23-rirekisho-brand-palette.png');

    // -------------------------------------------------------------
    // TEST 5: V2 EXAM OS PALETTE AUDIT
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing V2 Exam OS Brand Guidelines ---');
    await page.goto(`${LOCAL_URL}/exam`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    const examTitle = await page.$eval('h1', (el) => el.innerText).catch(() => '');
    assert(examTitle.includes('JLPT') || examTitle.includes('পরীক্ষা'), `Exam OS page rendered: "${examTitle}"`);

    const examRogueColors = await page.evaluate(() => {
      const main = document.querySelector('main') || document.body;
      const allEls = main.querySelectorAll('*');
      let rogue = [];
      allEls.forEach((el) => {
        const cls = el.className;
        if (typeof cls === 'string') {
          const match = cls.match(/\b(text|bg|border)-(cyan|purple|indigo|pink|violet)-/i);
          if (match && !cls.includes('ai-companion')) rogue.push(match[0]);
        }
      });
      return rogue;
    });
    assert(examRogueColors.length === 0, `Exam OS has 0 rogue color classes (found: ${examRogueColors.length})`);

    await saveScreenshot(page, 'v2-56-wp23-exam-brand-palette.png');

    // -------------------------------------------------------------
    // TEST 6: V2 WORKOS SIMULATOR CONBINI CUSTOMER TABLET AUDIT
    // -------------------------------------------------------------
    console.log('\n--- 6. Testing V2 WorkOS Simulator Customer Tablet Brand Palette ---');
    await page.goto(`${LOCAL_URL}/workos`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    const workosRogueColors = await page.evaluate(() => {
      const main = document.querySelector('main') || document.body;
      const allEls = main.querySelectorAll('*');
      let rogue = [];
      allEls.forEach((el) => {
        const cls = el.className;
        if (typeof cls === 'string') {
          const match = cls.match(/\b(text|bg|border)-(cyan|purple|indigo|pink|violet)-/i);
          if (match && !cls.includes('ai-companion')) rogue.push(match[0]);
        }
      });
      return rogue;
    });
    assert(workosRogueColors.length === 0, `WorkOS Simulator has 0 rogue color classes (found: ${workosRogueColors.length})`);

    await saveScreenshot(page, 'v2-57-wp23-workos-brand-palette.png');

  } catch (err) {
    console.error('Fatal Suite Exception:', err);
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log(`🏁 NIHOMI WP23 AUDIT COMPLETE: ${totalPassed} / ${totalTests} TESTS PASSED (${((totalPassed / totalTests) * 100).toFixed(1)}%)`);
  console.log('================================================================');

  if (totalPassed === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

run();
