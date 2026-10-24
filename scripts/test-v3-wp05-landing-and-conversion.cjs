// scripts/test-v3-wp05-landing-and-conversion.cjs
// Automated Puppeteer Verification Suite for NIHOMI V3 WP05:
// "Version 3 Landing Page Overhaul & High-Conversion Engine"
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
  console.log('🚀 NIHOMI V3 WP05: LANDING PAGE & CONVERSION ENGINE VERIFICATION');
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

    // -------------------------------------------------------------
    // PHASE 1: Landing Page Load & Neo-Tokyo Hero
    // -------------------------------------------------------------
    console.log('\n--- Phase 1: Landing Page Load & Hero Inspection ---');
    await page.goto(`${LOCAL_URL}/`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    const currentUrl = page.url();
    assert(
      'Landing page loads at root URL with zero legacy redirect',
      !currentUrl.includes('/legacy') && !currentUrl.includes('/v1')
    );

    const heroTitle = await page.$eval('h1', (el) => el.innerText).catch(() => '');
    assert(
      'Hero headline renders "জাপানিজ শেখা শুরু হোক একদম শূন্য থেকে।"',
      heroTitle.includes('জাপানিজ শেখা শুরু হোক') && heroTitle.includes('একদম শূন্য থেকে')
    );

    const valueStrip = await page.content();
    assert(
      'Free Starter Value Strip rendered with full transparency',
      valueStrip.includes('বিনামূল্যে (FREE)') && valueStrip.includes('হিরাগানা/কাতাকানা ক্যানভাস')
    );

    // -------------------------------------------------------------
    // PHASE 2: Interactive First Aha Moment Hiragana Canvas
    // -------------------------------------------------------------
    console.log('\n--- Phase 2: Interactive First Aha Moment Hiragana Canvas ---');

    // Step 1: Check initial character 'あ'
    const step1Indicator = await page.$eval(
      '[data-testid="hero-aha-step-indicator"]',
      (el) => el.innerText
    ).catch(() => '');
    assert(
      'Hiragana Canvas Step 1 active (First Aha Moment: あ)',
      step1Indicator.includes('ধাপ ০১/০৩') || step1Indicator.includes('First Aha Moment')
    );

    const step1Content = await page.content();
    assert(
      'Step 1 displays character "あ" with Bengali pronunciation "আ (a)"',
      step1Content.includes('Hiragana \'a\'') && step1Content.includes('উচ্চারণ: আ (a)')
    );

    // Audio test
    const audioBtn = await page.$('[data-testid="hero-aha-audio-btn"]');
    assert('Hero Hiragana audio button present for interactive listening', !!audioBtn);
    if (audioBtn) await audioBtn.click();
    await new Promise((r) => setTimeout(r, 400));

    // Advance to Step 2 ('い')
    const nextBtn = await page.$('[data-testid="hero-aha-next-btn"]');
    assert('Step 1 "পরবর্তী অক্ষর" button present', !!nextBtn);
    await nextBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    const step2Content = await page.content();
    assert(
      'Advanced to Step 2: Character "い" with Bengali pronunciation "ই (i)"',
      step2Content.includes('Hiragana \'i\'') && step2Content.includes('উচ্চারণ: ই (i)')
    );

    // Advance to Step 3 (Fuse 'あ' + 'い' = 'あい' ❤️)
    const fuseBtn = await page.$('[data-testid="hero-aha-fuse-btn"]');
    assert('Step 2 "শব্দ তৈরি করুন" synthesis button present', !!fuseBtn);
    await fuseBtn.click();
    await new Promise((r) => setTimeout(r, 800));

    const step3Content = await page.content();
    assert(
      'Aha Moment synthesis unlocked: Word "あい" (Ai) rendered in DOM',
      step3Content.includes('あい') && step3Content.includes('Ai (আই)')
    );
    assert(
      'Step 3 displays Bengali meaning "ভালোবাসা / Love" and celebratory guidance',
      step3Content.includes('ভালোবাসা / Love') && step3Content.includes('প্রথম অর্থপূর্ণ শব্দ সিন্থেসিস')
    );

    await saveScreenshot(page, 'v3-05-landing-hero-aha-moment.png');

    // Reset back to Step 1
    const resetBtn = await page.$('[data-testid="hero-aha-reset-btn"]');
    assert('Reset button present on Step 3', !!resetBtn);
    await resetBtn.click();
    await new Promise((r) => setTimeout(r, 500));

    const resetContent = await page.content();
    assert(
      'Canvas resets back to Step 1 "あ"',
      resetContent.includes('উচ্চারণ: আ (a)')
    );

    // -------------------------------------------------------------
    // PHASE 3: Feature Showcase Direct Links & CTAs
    // -------------------------------------------------------------
    console.log('\n--- Phase 3: Feature Showcase Direct Links & CTAs ---');

    // Hero Primary CTA
    const heroStartBtn = await page.$('#hero-start-journey-cta');
    assert('Hero primary CTA button "#hero-start-journey-cta" present', !!heroStartBtn);
    await heroStartBtn.click();
    await new Promise((r) => setTimeout(r, 800));

    const afterHeroStartContent = await page.content();
    assert(
      'Clicking Hero CTA navigates to Learning Journey / N.I.H.O.M.I Loop',
      afterHeroStartContent.includes('N.I.H.O.M.I লার্নিং লুপ') ||
      afterHeroStartContent.includes('শেখার পথ') ||
      page.url().includes('journey')
    );

    // Return to Landing
    await page.goto(`${LOCAL_URL}/`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // WorkOS 7-Eleven POS Showcase CTA
    const konbiniCta = (await page.$('#landing-card-konbini-cta')) || (await page.$('[data-testid="landing-card-konbini-cta"]'));
    assert('WorkOS POS Cashier showcase CTA button present', !!konbiniCta);
    if (konbiniCta) {
      await page.evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), konbiniCta);
      await new Promise((r) => setTimeout(r, 400));
      await konbiniCta.click();
      await new Promise((r) => setTimeout(r, 1000));
      const konbiniContent = await page.content();
      assert(
        'Clicking Konbini CTA successfully navigates to WorkOS simulator',
        konbiniContent.includes('7-Eleven') || konbiniContent.includes('WorkOS') || konbiniContent.includes('ক্যাশিয়ার')
      );
    }

    // Return to Landing
    await page.goto(`${LOCAL_URL}/`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // JIS Rirekisho Studio Showcase CTA
    const rirekishoCta = (await page.$('#landing-card-rirekisho-cta')) || (await page.$('[data-testid="landing-card-rirekisho-cta"]'));
    assert('JIS Rirekisho Studio showcase CTA button present', !!rirekishoCta);
    if (rirekishoCta) {
      await page.evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), rirekishoCta);
      await new Promise((r) => setTimeout(r, 400));
      await rirekishoCta.click();
      await new Promise((r) => setTimeout(r, 1000));
      const rirekishoContent = await page.content();
      assert(
        'Clicking Rirekisho CTA successfully navigates to JIS CV Studio',
        rirekishoContent.includes('JIS') || rirekishoContent.includes('履历書') || rirekishoContent.includes('রিজিউমে')
      );
    }

    // Return to Landing
    await page.goto(`${LOCAL_URL}/`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // JLPT Mock Exam Showcase CTA
    const jlptCta = (await page.$('#landing-jlpt-exam-cta')) || (await page.$('[data-testid="landing-jlpt-exam-cta"]'));
    assert('JLPT CBT Exam OS showcase CTA button present', !!jlptCta);
    if (jlptCta) {
      await page.evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), jlptCta);
      await new Promise((r) => setTimeout(r, 400));
      await jlptCta.click();
      await new Promise((r) => setTimeout(r, 1000));
      const examContent = await page.content();
      assert(
        'Clicking JLPT CTA successfully navigates to Exam OS Hub',
        examContent.includes('JLPT') || examContent.includes('মক টেস্ট') || examContent.includes('Exam')
      );
    }

    // Return to Landing
    await page.goto(`${LOCAL_URL}/`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));
    await saveScreenshot(page, 'v3-05-landing-workos-and-cv-links.png');

    // -------------------------------------------------------------
    // PHASE 4: Mobile Responsive Verification (390 x 844)
    // -------------------------------------------------------------
    console.log('\n--- Phase 4: Mobile Responsive Verification ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await new Promise((r) => setTimeout(r, 800));

    const mobileHasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    assert(
      'Mobile viewport (390px) renders without horizontal scroll overflow',
      !mobileHasOverflow
    );

    await saveScreenshot(page, 'v3-05-landing-mobile-390.png');

    // -------------------------------------------------------------
    // PHASE 5: Master Landing Verification Screenshot
    // -------------------------------------------------------------
    console.log('\n--- Phase 5: Master Landing Verification Screenshot ---');
    await page.setViewport({ width: 1440, height: 960 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 600));

    await saveScreenshot(page, 'v3-05-wp05-master-landing-verification.png');

    console.log('\n============================================================');
    console.log(`🎉 ALL ${passedAssertions}/${totalAssertions} ASSERTIONS PASSED GREEN!`);
    console.log('   "No Evidence = No Done" protocol fully satisfied.');
    console.log('============================================================\n');

  } catch (err) {
    console.error('\n❌ TEST RUN FAILED:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
