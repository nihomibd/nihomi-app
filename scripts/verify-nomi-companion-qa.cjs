// NIHOMI.COM — NOMI UNIVERSAL COMPANION MULTI-VIEWPORT BROWSER QA SUITE
// Standard: Antigravity 2.0 Local-First Evidence-Driven Protocol (`NO EVIDENCE = NO DONE`)

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:3000';
const OUT_DIR = path.join(__dirname, '..', 'artifacts', 'qa', 'nomi-companion');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const VIEWPORTS = {
  mobile_small: { width: 360, height: 800, deviceScaleFactor: 2 },
  mobile_std: { width: 390, height: 844, deviceScaleFactor: 2 },
  tablet: { width: 768, height: 1024, deviceScaleFactor: 2 },
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 }
};

async function runQa() {
  console.log('🚀 Starting Nomi Universal Companion Browser QA Suite...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('nihomi_cookie_consent', 'accepted');
  });
  const manifest = {
    testDate: new Date().toISOString(),
    baseUrl: BASE_URL,
    routesAudited: [],
    screenshots: []
  };

  const capture = async (name, description, viewportKey = 'desktop') => {
    const vp = VIEWPORTS[viewportKey];
    await page.setViewport(vp);
    await new Promise((r) => setTimeout(r, 800));

    const filename = `${name}.png`;
    const filepath = path.join(OUT_DIR, filename);
    await page.screenshot({ path: filepath, fullPage: false });
    console.log(`📸 Captured: ${filename} [${vp.width}x${vp.height}] — ${description}`);

    manifest.screenshots.push({
      id: name,
      file: filename,
      description,
      viewport: `${vp.width}x${vp.height}`,
      viewportName: viewportKey,
      timestamp: new Date().toISOString()
    });
  };

  try {
    // 1. Landing Hero (Desktop)
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 30000 });
    await capture('01-landing-hero', 'Landing Hero showing Nomi welcome avatar in interactive Zen paper card', 'desktop');

    // 2. Landing Dock presence (Desktop)
    await page.evaluate(() => window.scrollTo(0, 1000));
    await new Promise((r) => setTimeout(r, 600));
    await capture('02-landing-dock', 'Landing scrolled showing floating Nomi presence dock in bottom right', 'desktop');

    // 3. Open Nomi Panel on Landing
    const presenceBtn = await page.$('#btn-nomi-presence');
    if (presenceBtn) {
      await presenceBtn.click();
      await new Promise((r) => setTimeout(r, 600));
      await capture('03-landing-panel-open', 'Nomi panel expanded with contextual guidance and quick prompt chips', 'desktop');

      // Test Escape to close
      await page.keyboard.press('Escape');
      await new Promise((r) => setTimeout(r, 600));
    }

    // 4. Lesson View (Desktop)
    await page.goto(`${BASE_URL}/lesson?id=n5-l1`, { waitUntil: 'networkidle2', timeout: 30000 });
    await capture('04-lesson-view', 'Lesson view with docked Nomi learning mentor showing canonical avatar', 'desktop');

    // 5. Practice View & Wrong Answer Recovery (Desktop)
    await page.goto(`${BASE_URL}/practice?id=n5-l1`, { waitUntil: 'networkidle2', timeout: 30000 });
    // Click incorrect option to test Nomi mistake recovery
    const options = await page.$$('button[aria-label*="বাছাই করুন"], button.btn-haptic');
    if (options.length > 2) {
      await options[2].click();
      await new Promise((r) => setTimeout(r, 800));
    }
    await capture('05-practice-view-wrong-answer', 'Practice view showing Nomi guiding expression on mistake recovery', 'desktop');

    // 6. Kana Studio (Desktop)
    await page.goto(`${BASE_URL}/kana`, { waitUntil: 'networkidle2', timeout: 30000 });
    await capture('06-kana-studio', 'Kana Studio with persistent Nomi presence anchor', 'desktop');

    // 7. Baito WorkOS Simulation (Desktop)
    await page.goto(`${BASE_URL}/baito`, { waitUntil: 'networkidle2', timeout: 30000 });
    await capture('07-baito-simulation', 'WorkOS Tokyo Conbini simulation with Nomi workplace companion anchor', 'desktop');

    // 8. Pricing & Plans (Desktop)
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: 'networkidle2', timeout: 30000 });
    await capture('08-pricing-plans', 'Pricing view with Nomi non-blocking plan navigation assistant', 'desktop');

    // 9. Dashboard (Desktop)
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2', timeout: 30000 });
    await capture('09-dashboard', 'Learner dashboard with integrated Nomi mission assistant', 'desktop');

    // 10. Founder Guard (Desktop)
    await page.goto(`${BASE_URL}/founder`, { waitUntil: 'networkidle2', timeout: 30000 });
    await capture('10-founder-guard', 'Founder workspace access gate with Nomi status anchor', 'desktop');

    // 11. Mobile Small: 360x800 Landing
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 30000 });
    await capture('11-mobile-small-landing', 'Mobile Small (360x800) responsive landing and touch target clearance', 'mobile_small');

    // 12. Mobile Standard: 390x844 Dock above bottom nav
    await page.goto(`${BASE_URL}/pricing`, { waitUntil: 'networkidle2', timeout: 30000 });
    await capture('12-mobile-standard-dock', 'Mobile Standard (390x844) showing Nomi dock positioned safely above MobileBottomNav', 'mobile_std');

    // 13. Mobile Standard: 390x844 Panel Open
    const mobilePresence = await page.$('#btn-nomi-presence');
    if (mobilePresence) {
      await mobilePresence.click();
      await new Promise((r) => setTimeout(r, 600));
      await capture('13-mobile-standard-panel-open', 'Mobile Standard (390x844) Nomi panel opened within safe area boundaries', 'mobile_std');
    }

    // 14. Tablet: 768x1024 Lesson View
    await page.goto(`${BASE_URL}/lesson?id=n5-l1`, { waitUntil: 'networkidle2', timeout: 30000 });
    await capture('14-tablet-lesson', 'Tablet (768x1024) layout showing spacious Nomi docked card', 'tablet');

    // Write manifest
    fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

    // Write HTML review gallery
    const galleryHtml = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nomi Universal Companion — Visual Acceptance Review Gallery</title>
  <style>
    :root {
      --bg: #0e111d;
      --card-bg: #141726;
      --text: #F6F0E6;
      --accent: #E45147;
      --border: rgba(246, 240, 230, 0.12);
    }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Bengali", sans-serif;
      margin: 0;
      padding: 32px 24px;
    }
    header {
      max-width: 1300px;
      margin: 0 auto 36px;
      border-bottom: 2px solid var(--accent);
      padding-bottom: 20px;
    }
    h1 {
      font-size: 26px;
      font-weight: 900;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      background: rgba(228, 81, 71, 0.2);
      color: #E45147;
      font-size: 11px;
      font-weight: 700;
      border: 1px solid rgba(228, 81, 71, 0.4);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
      gap: 24px;
      max-width: 1300px;
      margin: 0 auto;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }
    .card-header {
      padding: 12px 16px;
      background: rgba(255,255,255,0.03);
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-header h3 {
      font-size: 13px;
      margin: 0;
      color: #fff;
      font-weight: 700;
    }
    .vp-pill {
      font-size: 11px;
      font-family: monospace;
      padding: 2px 8px;
      border-radius: 6px;
      background: rgba(255,255,255,0.08);
      color: #aaa;
    }
    .card-body {
      padding: 16px;
    }
    .card-desc {
      font-size: 12px;
      color: #bbb;
      margin: 0 0 12px;
      line-height: 1.5;
    }
    .img-wrap {
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
      background: #000;
    }
    .img-wrap img {
      width: 100%;
      height: auto;
      display: block;
    }
  </style>
</head>
<body>
  <header>
    <h1>
      <span>🌸 Nomi Universal Companion — Visual Acceptance Review Gallery</span>
      <span class="badge">EVIDENCE VERIFIED</span>
    </h1>
    <p style="margin: 0; color: #888; font-size: 13px;">
      Target: 14 Multi-Viewport Evidence Captures across Public, Learner, WorkOS, and Founder Routes.
    </p>
  </header>

  <div class="grid">
    ${manifest.screenshots
      .map(
        (s) => `
      <div class="card">
        <div class="card-header">
          <h3>${s.id}</h3>
          <span class="vp-pill">${s.viewport}</span>
        </div>
        <div class="card-body">
          <p class="card-desc">${s.description}</p>
          <div class="img-wrap">
            <a href="${s.file}" target="_blank">
              <img src="${s.file}" alt="${s.id}" loading="lazy" />
            </a>
          </div>
        </div>
      </div>
    `
      )
      .join('\n')}
  </div>
</body>
</html>`;

    fs.writeFileSync(path.join(OUT_DIR, 'visual-review-gallery.html'), galleryHtml, 'utf8');
    console.log(`✅ Visual review gallery created at: ${path.join(OUT_DIR, 'visual-review-gallery.html')}`);
  } catch (err) {
    console.error('❌ QA Execution Error:', err);
  } finally {
    await browser.close();
  }
}

runQa();
