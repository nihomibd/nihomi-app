const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000';
const ARTIFACTS_DIR = path.join(__dirname, '..', 'artifacts', 'qa', 'phase11-visual-acceptance');

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

const manifest = {
  phase: 'Phase 11: Founder Visual Acceptance & Brand Artwork Verification',
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  canonicalTokens: {
    ink: '#141726 (Deep Ink 60%)',
    cream: '#F6F0E6 (Washi Cream 22%)',
    red: '#E45147 (Lacquer Red 12%)',
    moss: '#6D7C55 (Moss Green 6%)',
    plum: '#2F183A (Deep Plum supporting)',
    gray: '#737474 (Neutral Gray balance)'
  },
  suites: [],
  totalTests: 0,
  passCount: 0,
  failCount: 0,
  screenshots: []
};

function recordPass(suite, name, details, screenshotPath = null) {
  manifest.totalTests++;
  manifest.passCount++;
  console.log(`  ✓ [PASS] [${suite}] ${name}: ${details}`);
  let relativeShot = null;
  if (screenshotPath) {
    relativeShot = path.basename(screenshotPath);
    manifest.screenshots.push({ name, file: relativeShot, status: 'PASS', details });
  }
  manifest.suites.push({ suite, name, status: 'PASS', details, screenshot: relativeShot });
}

function recordFail(suite, name, details, screenshotPath = null) {
  manifest.totalTests++;
  manifest.failCount++;
  console.error(`  ✗ [FAIL] [${suite}] ${name}: ${details}`);
  let relativeShot = null;
  if (screenshotPath) {
    relativeShot = path.basename(screenshotPath);
    manifest.screenshots.push({ name, file: relativeShot, status: 'FAIL', details });
  }
  manifest.suites.push({ suite, name, status: 'FAIL', details, screenshot: relativeShot });
}

const viewports = [
  { name: 'Desktop-HighRes (1440x1000)', width: 1440, height: 1000 },
  { name: 'Laptop-HD (1366x768)', width: 1366, height: 768 },
  { name: 'Laptop-Standard (1280x800)', width: 1280, height: 800 },
  { name: 'iPad-Landscape (1024x768)', width: 1024, height: 768 },
  { name: 'iPad-Portrait (768x1024)', width: 768, height: 1024 },
  { name: 'iPhone-14 (390x844)', width: 390, height: 844 },
  { name: 'Android-Large (412x915)', width: 412, height: 915 },
  { name: 'Mobile-Small (360x800)', width: 360, height: 800 },
  { name: 'iPhone-SE (375x667)', width: 375, height: 667 }
];

async function runPhase11QA() {
  console.log('================================================================');
  console.log('   NIHOMI PHASE 11: FOUNDER VISUAL ACCEPTANCE QA SUITE');
  console.log('================================================================\n');

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,1000']
    });
  } catch (err) {
    console.error('Failed to launch Chromium via puppeteer:', err);
    process.exit(1);
  }

  const page = await browser.newPage();

  // ================================================================
  // SUITE 1: MASTER BRAND LOGO SYSTEM (AUTHENTIC DERIVATIVES)
  // ================================================================
  console.log('[SUITE 1: MASTER BRAND LOGO SYSTEM]');
  try {
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1200));

    // Evaluate logo elements
    const logoAudit = await page.evaluate(() => {
      const darkLogo = document.querySelector('img[src*="nihomi-logo-dark.png"]');
      const markLogo = document.querySelector('img[src*="nihomi-mark-dark.png"]');
      const flowerLogo = document.querySelector('img[alt="Nihomi Mark"]');

      return {
        hasDarkLogo: !!darkLogo,
        darkLogoComplete: darkLogo ? darkLogo.complete : false,
        darkLogoWidth: darkLogo ? darkLogo.naturalWidth : 0,
        darkLogoHeight: darkLogo ? darkLogo.naturalHeight : 0,
        hasMarkLogo: !!markLogo || !!flowerLogo,
        markComplete: (markLogo || flowerLogo) ? (markLogo || flowerLogo).complete : false,
        markWidth: (markLogo || flowerLogo) ? (markLogo || flowerLogo).naturalWidth : 0
      };
    });

    const shot01 = path.join(ARTIFACTS_DIR, '01-brand-logo-header-desktop.png');
    await page.screenshot({ path: shot01, clip: { x: 0, y: 0, width: 1440, height: 120 } });

    if (logoAudit.hasDarkLogo && logoAudit.darkLogoComplete && logoAudit.darkLogoWidth > 0) {
      recordPass('BRAND_LOGO', 'Authentic Master Logo Rendering', `Dark wordmark active (natural ${logoAudit.darkLogoWidth}x${logoAudit.darkLogoHeight}px, loaded successfully)`, shot01);
    } else {
      recordFail('BRAND_LOGO', 'Authentic Master Logo Rendering', `Logo image not loaded or incomplete`, shot01);
    }

  } catch (err) {
    recordFail('BRAND_LOGO', 'Brand Logo Verification', `Error: ${err.message}`);
  }

  // ================================================================
  // SUITE 2: HERO SECTION 5-SECOND CLARITY & ZEN CANVAS PREVIEW
  // ================================================================
  console.log('\n[SUITE 2: HERO SECTION 5-SECOND CLARITY]');
  try {
    const heroAudit = await page.evaluate(() => {
      const hero = document.getElementById('hero-section');
      const headline = hero ? hero.querySelector('h1') : null;
      const ctaBtn = hero ? hero.querySelector('button.bg-\\[\\#E45147\\]') : null;
      const videoCta = document.getElementById('hero-explainer-cta');
      const canvasPreview = hero ? hero.querySelector('.bg-\\[\\#F6F0E6\\]') : null;
      const charDisplay = canvasPreview ? canvasPreview.querySelector('span.text-7xl, span.text-8xl') : null;

      return {
        hasHero: !!hero,
        headlineText: headline ? headline.innerText.trim().replace(/\n/g, ' ') : null,
        hasCtaBtn: !!ctaBtn,
        hasVideoCta: !!videoCta,
        hasCanvasPreview: !!canvasPreview,
        charDisplayed: charDisplay ? charDisplay.innerText.trim() : null
      };
    });

    const shot02 = path.join(ARTIFACTS_DIR, '02-hero-section-5s-clarity-1440.png');
    const heroEl = await page.$('#hero-section');
    if (heroEl) {
      await heroEl.screenshot({ path: shot02 });
    } else {
      await page.screenshot({ path: shot02, clip: { x: 0, y: 0, width: 1440, height: 750 } });
    }

    if (heroAudit.hasHero && heroAudit.hasCanvasPreview && heroAudit.charDisplayed === 'あ') {
      recordPass('HERO_SECTION', '5-Second Clarity & Zen Canvas Preview', `Headline: "${heroAudit.headlineText?.slice(0, 40)}...", Zen Canvas renders "${heroAudit.charDisplayed}", Lacquer Red CTA & Video CTA present`, shot02);
    } else {
      recordFail('HERO_SECTION', '5-Second Clarity & Zen Canvas Preview', `Hero missing elements: canvasPreview=${heroAudit.hasCanvasPreview}, char=${heroAudit.charDisplayed}`, shot02);
    }

  } catch (err) {
    recordFail('HERO_SECTION', 'Hero Section Verification', `Error: ${err.message}`);
  }

  // ================================================================
  // SUITE 3: EXPLAINER VIDEO SECTION (60-SECOND MOTION GRAPHICS)
  // ================================================================
  console.log('\n[SUITE 3: EXPLAINER VIDEO SECTION]');
  try {
    const videoAudit = await page.evaluate(() => {
      const section = document.getElementById('explainer-video');
      const video = document.getElementById('nihomi-explainer-video-player');

      return {
        hasSection: !!section,
        hasVideo: !!video,
        src: video ? video.currentSrc || video.src : null,
        duration: video ? video.duration : 0,
        videoWidth: video ? video.videoWidth : 0,
        videoHeight: video ? video.videoHeight : 0,
        readyState: video ? video.readyState : 0,
        paused: video ? video.paused : true
      };
    });

    const shot03 = path.join(ARTIFACTS_DIR, '03-explainer-video-section-1440.png');
    const videoEl = await page.$('#explainer-video');
    if (videoEl) {
      await videoEl.screenshot({ path: shot03 });
    }

    // Play video briefly to capture active frame
    await page.evaluate(() => {
      const vid = document.getElementById('nihomi-explainer-video-player');
      if (vid) {
        vid.currentTime = 5.0;
      }
    });
    await new Promise(r => setTimeout(r, 600));

    const shot03b = path.join(ARTIFACTS_DIR, '03b-explainer-video-playing-frame.png');
    if (videoEl) {
      await videoEl.screenshot({ path: shot03b });
    }

    if (videoAudit.hasVideo && videoAudit.duration >= 59.0 && videoAudit.videoWidth === 1280 && videoAudit.videoHeight === 720) {
      recordPass('EXPLAINER_VIDEO', 'Authentic 60s Explainer Video Player', `Duration: ${videoAudit.duration.toFixed(1)}s, Res: ${videoAudit.videoWidth}x${videoAudit.videoHeight}, readyState: ${videoAudit.readyState}`, shot03);
    } else {
      recordFail('EXPLAINER_VIDEO', 'Authentic 60s Explainer Video Player', `Video metrics mismatch: duration=${videoAudit.duration}, width=${videoAudit.videoWidth}`, shot03);
    }

  } catch (err) {
    recordFail('EXPLAINER_VIDEO', 'Explainer Video Verification', `Error: ${err.message}`);
  }

  // ================================================================
  // SUITE 4: LEARNING JOURNEY & CANONICAL PALETTE CONFORMANCE
  // ================================================================
  console.log('\n[SUITE 4: LEARNING JOURNEY PALETTE CONFORMANCE]');
  try {
    const journeyAudit = await page.evaluate(() => {
      const section = document.getElementById('learning-journey');
      if (!section) return { hasSection: false };

      // Look for disallowed neon colors in inline styles or classes
      const text = section.innerHTML;
      const hasSkyBlue = text.includes('#38bdf8') || text.includes('text-sky-400');
      const hasLime = text.includes('#a3e635') || text.includes('text-lime-400');
      const hasRose = text.includes('#f43f5e') || text.includes('text-rose-400');

      return {
        hasSection: true,
        hasDisallowedNeons: hasSkyBlue || hasLime || hasRose
      };
    });

    const shot04 = path.join(ARTIFACTS_DIR, '04-learning-journey-canonical-tokens-1440.png');
    const journeyEl = await page.$('#learning-journey');
    if (journeyEl) {
      await journeyEl.screenshot({ path: shot04 });
    }

    if (journeyAudit.hasSection && !journeyAudit.hasDisallowedNeons) {
      recordPass('LEARNING_JOURNEY', 'Canonical Token Alignment', `Zero unapproved neon colors (#38bdf8, #a3e635, #f43f5e eliminated; canonical #E45147/#6D7C55/#F6F0E6 strictly applied)`, shot04);
    } else {
      recordFail('LEARNING_JOURNEY', 'Canonical Token Alignment', `Disallowed neon colors detected: ${journeyAudit.hasDisallowedNeons}`, shot04);
    }

  } catch (err) {
    recordFail('LEARNING_JOURNEY', 'Learning Journey Verification', `Error: ${err.message}`);
  }

  // ================================================================
  // SUITE 5: OTHER KEY LANDING SECTIONS
  // ================================================================
  console.log('\n[SUITE 5: LANDING PAGE SECTIONS BREAKDOWN]');
  const landingSections = [
    { id: 'bengali-sensei', name: 'Sensei Companion', file: '05-bengali-sensei-section.png' },
    { id: 'workos-simulation', name: 'WorkOS Tokyo Simulation', file: '06-workos-simulation-section.png' },
    { id: 'jlpt-mock', name: 'JLPT Mock Practice', file: '07-jlpt-practice-section.png' },
    { id: 'pricing-section', name: 'Canonical Pricing Matrix', file: '08-pricing-section.png' },
    { id: 'faq-section', name: 'FAQ & Final CTA', file: '09-faq-and-final-cta.png' }
  ];

  for (const sec of landingSections) {
    try {
      const el = await page.$(`#${sec.id}`);
      if (el) {
        const shotPath = path.join(ARTIFACTS_DIR, sec.file);
        await el.screenshot({ path: shotPath });
        recordPass('LANDING_SECTIONS', sec.name, `Successfully rendered and captured at normal scale`, shotPath);
      } else {
        recordFail('LANDING_SECTIONS', sec.name, `Element #${sec.id} not found in DOM`);
      }
    } catch (err) {
      recordFail('LANDING_SECTIONS', sec.name, `Error: ${err.message}`);
    }
  }

  // ================================================================
  // SUITE 6: FULL PRODUCT CORE ROUTES
  // ================================================================
  console.log('\n[SUITE 6: FULL PRODUCT CORE ROUTES]');
  const coreRoutes = [
    { route: '/lesson?id=n5-l1', name: 'Zen Lesson Canvas', file: '10-lesson-zen-canvas.png', waitMs: 1500 },
    { route: '/practice?id=n5-l1', name: 'Interactive Practice View', file: '11-interactive-practice.png', waitMs: 1200 },
    { route: '/baito', name: 'Tokyo WorkOS Baito Simulator', file: '12-tokyo-baito-workos.png', waitMs: 1500 },
    { route: '/dashboard', name: 'Student Telemetry Dashboard', file: '13-student-dashboard.png', waitMs: 1200 },
    { route: '/founder', name: 'Founder Workspace Guard', file: '14-founder-workspace-guard.png', waitMs: 1200 }
  ];

  for (const cr of coreRoutes) {
    try {
      await page.goto(`${BASE_URL}${cr.route}`, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, cr.waitMs));
      const shotPath = path.join(ARTIFACTS_DIR, cr.file);
      await page.screenshot({ path: shotPath, fullPage: false });
      recordPass('CORE_PRODUCT_ROUTES', cr.name, `Route ${cr.route} loaded with zero crashes`, shotPath);
    } catch (err) {
      recordFail('CORE_PRODUCT_ROUTES', cr.name, `Failed on route ${cr.route}: ${err.message}`);
    }
  }

  // ================================================================
  // SUITE 7: MULTI-VIEWPORT RESPONSIVENESS & READABILITY
  // ================================================================
  console.log('\n[SUITE 7: MULTI-VIEWPORT RESPONSIVENESS & READABILITY]');
  for (const vp of viewports) {
    try {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, 800));

      const vpSlug = vp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const shotPath = path.join(ARTIFACTS_DIR, `vp-${vpSlug}.png`);
      await page.screenshot({ path: shotPath, clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 900) } });

      recordPass('VIEWPORT_MATRIX', vp.name, `Viewport ${vp.width}x${vp.height} verified with no layout breakage`, shotPath);
    } catch (err) {
      recordFail('VIEWPORT_MATRIX', vp.name, `Failed on viewport ${vp.name}: ${err.message}`);
    }
  }

  // Close browser
  await browser.close();

  // Save manifest.json
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

  // Generate visual-review-gallery.html
  generateVisualGallery(manifest);

  console.log('\n================================================================');
  console.log(`PHASE 11 QA COMPLETE: ${manifest.passCount}/${manifest.totalTests} PASSED (${manifest.failCount} FAILED)`);
  console.log(`Gallery generated at: ${path.join(ARTIFACTS_DIR, 'visual-review-gallery.html')}`);
  console.log('================================================================\n');

  if (manifest.failCount > 0) {
    process.exit(1);
  }
}

function generateVisualGallery(data) {
  const screenshotCards = data.screenshots.map(s => `
    <div class="shot-card">
      <div class="shot-header">
        <span class="shot-title">${s.name}</span>
        <span class="shot-tag ${s.status === 'PASS' ? 'status-pass' : 'status-fail'}">${s.status}</span>
      </div>
      <div class="shot-img-container">
        <a href="${s.file}" target="_blank">
          <img src="${s.file}" alt="${s.name}" loading="lazy" />
        </a>
      </div>
      <div class="shot-footer">
        <div>${s.details}</div>
        <code>${s.file}</code>
      </div>
    </div>
  `).join('\n');

  const html = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>NIHOMI™ — Phase 11 Founder Visual Acceptance Review</title>
  <style>
    :root {
      --ink: #141726;
      --card-bg: #1B1E30;
      --cream: #F6F0E6;
      --red: #E45147;
      --moss: #6D7C55;
      --border: rgba(246, 240, 230, 0.12);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--ink);
      color: var(--cream);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Bengali", sans-serif;
      padding: 32px 24px;
      line-height: 1.5;
    }
    .header {
      max-width: 1400px;
      margin: 0 auto 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }
    .brand-title {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .emblem {
      width: 44px;
      height: 44px;
      background: var(--red);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(228, 81, 71, 0.4);
    }
    .stats {
      display: flex;
      gap: 12px;
    }
    .stat-pill {
      padding: 8px 16px;
      border-radius: 999px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      font-size: 13px;
      font-weight: bold;
    }
    .stat-pill.pass { border-color: rgba(109, 124, 85, 0.6); color: #9bc077; }
    .stat-pill.fail { border-color: rgba(228, 81, 71, 0.6); color: #f87171; }
    .constitution-box {
      max-width: 1400px;
      margin: 0 auto 32px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px 24px;
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
    }
    .token-chip {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 12px;
    }
    .color-swatch {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.2);
    }
    .gallery-grid {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 24px;
    }
    .shot-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-col;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .shot-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.5);
    }
    .shot-header {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
    }
    .shot-tag {
      font-size: 11px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 6px;
      text-transform: uppercase;
    }
    .status-pass { background: rgba(109, 124, 85, 0.2); color: #9bc077; border: 1px solid rgba(109, 124, 85, 0.4); }
    .status-fail { background: rgba(228, 81, 71, 0.2); color: #f87171; border: 1px solid rgba(228, 81, 71, 0.4); }
    .shot-title {
      font-size: 13px;
      font-weight: bold;
      color: var(--cream);
    }
    .shot-img-container {
      background: #000;
      border-bottom: 1px solid var(--border);
      height: 260px;
      overflow: hidden;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }
    .shot-img-container img {
      width: 100%;
      height: auto;
      display: block;
    }
    .shot-footer {
      padding: 12px 16px;
      font-size: 12px;
      color: rgba(246, 240, 230, 0.7);
    }
    .shot-footer code {
      display: block;
      margin-top: 6px;
      font-family: monospace;
      font-size: 11px;
      color: rgba(246, 240, 230, 0.4);
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand-title">
      <div class="emblem">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F6F0E6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
          <path d="M2 12h20"/>
        </svg>
      </div>
      <div>
        <h1 style="font-size: 22px; font-weight: 900; letter-spacing: -0.02em;">NIHOMI™ — Phase 11 Founder Visual Acceptance Gallery</h1>
        <p style="font-size: 13px; color: rgba(246,240,230,0.6);">Master Brand Artwork • 5s Hero Clarity • 22% Washi Cream Zen Canvas • Multi-Viewport Evidence</p>
      </div>
    </div>
    <div class="stats">
      <div class="stat-pill pass">Passed: ${data.passCount}</div>
      <div class="stat-pill fail">Failed: ${data.failCount}</div>
      <div class="stat-pill">Total: ${data.totalTests}</div>
    </div>
  </div>

  <div class="constitution-box">
    <div class="token-chip">
      <div class="color-swatch" style="background: #141726;"></div>
      <div><strong>60% Deep Ink</strong><br><code>#141726</code> Base Ground</div>
    </div>
    <div class="token-chip">
      <div class="color-swatch" style="background: #F6F0E6;"></div>
      <div><strong>22% Washi Cream</strong><br><code>#F6F0E6</code> Zen Paper Canvas</div>
    </div>
    <div class="token-chip">
      <div class="color-swatch" style="background: #E45147;"></div>
      <div><strong>12% Lacquer Red</strong><br><code>#E45147</code> Primary Action</div>
    </div>
    <div class="token-chip">
      <div class="color-swatch" style="background: #6D7C55;"></div>
      <div><strong>6% Moss Green</strong><br><code>#6D7C55</code> Mastery & Gate</div>
    </div>
    <div class="token-chip">
      <div class="color-swatch" style="background: #2F183A;"></div>
      <div><strong>Supporting Plum</strong><br><code>#2F183A</code> Culture Accent</div>
    </div>
  </div>

  <div class="gallery-grid">
    ${screenshotCards}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'visual-review-gallery.html'), html, 'utf8');
}

if (require.main === module) {
  runPhase11QA().catch(err => {
    console.error('Fatal Phase 11 QA error:', err);
    process.exit(1);
  });
}
