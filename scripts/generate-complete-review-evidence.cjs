const puppeteer = require('puppeteer-core');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EVIDENCE_DIR = path.resolve('storage/evidence');
const SECTIONS_DIR = path.join(EVIDENCE_DIR, 'section-comparisons');
const REF_DIR = path.join(EVIDENCE_DIR, 'reference-sections');
const REF_FULL = path.join(EVIDENCE_DIR, 'reference-1024x1536.png');

if (!fs.existsSync(EVIDENCE_DIR)) fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
if (!fs.existsSync(SECTIONS_DIR)) fs.mkdirSync(SECTIONS_DIR, { recursive: true });

function checkServer(port = 4173) {
  return new Promise((resolve) => {
    http.get(`http://localhost:${port}`, (res) => {
      resolve(res.statusCode < 500);
    }).on('error', () => resolve(false));
  });
}

async function ensureServer(port = 4173) {
  const isRunning = await checkServer(port);
  if (isRunning) {
    console.log(`✔ Preview server already running on port ${port}`);
    return null;
  }

  console.log(`Starting preview server on port ${port}...`);
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', String(port)], {
    shell: true,
    stdio: 'ignore'
  });

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await checkServer(port)) {
      console.log(`✔ Preview server ready on port ${port}`);
      return server;
    }
  }
  throw new Error(`Could not start preview server within 30 seconds`);
}

const SECTIONS = [
  { id: '01-header', name: 'Header', selector: 'header', targetHeight: 60 },
  { id: '02-hero', name: 'Hero', selector: '#hero-section', targetHeight: 380 },
  { id: '03-try-lesson', name: 'Try Lesson', selector: '#try-lesson', targetHeight: 235 },
  { id: '04-journey', name: 'Learning Journey', selector: '#why-nihomi', targetHeight: 215 },
  { id: '05-outcomes', name: 'Japan Outcomes', selector: '#japan-readiness', targetHeight: 210 },
  { id: '06-testimonials', name: 'Student Stories', selector: '#testimonials', targetHeight: 160 },
  { id: '07-pricing', name: 'Pricing', selector: '#pricing-section', targetHeight: 165 },
  { id: '08-banner', name: 'Final Banner', selector: '#final-cta', targetHeight: 111 }
];

async function runCompleteEvidencePipeline() {
  const serverProc = await ensureServer(4173);

  console.log('Launching Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', err => consoleLogs.push({ type: 'pageerror', text: err.toString() }));

  // Helper to wait for fonts and all images
  async function waitForPageReady() {
    await page.evaluate(async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }
      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
    });
    // Extra grace period for CSS transitions/effects
    await new Promise(r => setTimeout(r, 600));
  }

  // ==========================================
  // 1. CAPTURE REFERENCE VIEWPORT (1024 x 1536)
  // ==========================================
  console.log('\n[1/5] Capturing Reference Viewport (1024 x 1536)...');
  await page.setViewport({ width: 1024, height: 1536, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0', timeout: 30000 });
  await waitForPageReady();

  // Inspect DOM
  const domReport = await page.evaluate((sections) => {
    const docEl = document.documentElement;
    const body = document.body;

    const metrics = {
      docScrollWidth: docEl.scrollWidth,
      docScrollHeight: docEl.scrollHeight,
      docClientWidth: docEl.clientWidth,
      docClientHeight: docEl.clientHeight,
      bodyScrollHeight: body.scrollHeight,
      hasHorizontalOverflow: docEl.scrollWidth > docEl.clientWidth
    };

    const sectionMetrics = sections.map(sec => {
      const el = document.querySelector(sec.selector);
      if (!el) return { id: sec.id, name: sec.name, exists: false };
      const r = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      return {
        id: sec.id,
        name: sec.name,
        exists: true,
        rect: {
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          height: Math.round(r.height)
        },
        isVisible: s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0,
        display: s.display,
        visibility: s.visibility,
        opacity: s.opacity,
        background: s.backgroundColor
      };
    });

    return { metrics, sectionMetrics };
  }, SECTIONS);

  console.log(`DOM Scroll Height: ${domReport.metrics.docScrollHeight} px (Target: 1536 px)`);
  console.log(`Horizontal Overflow: ${domReport.metrics.hasHorizontalOverflow ? 'DETECTED' : 'NONE'}`);

  const fullpagePath = path.join(EVIDENCE_DIR, 'proof-landing-1024x1536-fullpage.png');
  const viewportPath = path.join(EVIDENCE_DIR, 'proof-landing-1024x1536-viewport.png');
  await page.screenshot({ path: fullpagePath, fullPage: true });
  await page.screenshot({ path: viewportPath, fullPage: false });
  console.log(`✔ Captured 1024x1536 fullpage and viewport screenshots`);

  // Capture Upper and Lower Segments to explicitly verify no black regions
  const topSegPath = path.join(EVIDENCE_DIR, 'segment-top-0-768.png');
  const btmSegPath = path.join(EVIDENCE_DIR, 'segment-bottom-768-1536.png');
  await page.screenshot({ path: topSegPath, clip: { x: 0, y: 0, width: 1024, height: 768 } });
  await page.screenshot({ path: btmSegPath, clip: { x: 0, y: 768, width: 1024, height: 768 } });
  console.log(`✔ Captured segments: top (0-768px) and bottom (768-1536px)`);

  // ==========================================
  // 2. CAPTURE RESPONSIVE VIEWPORTS
  // ==========================================
  console.log('\n[2/5] Capturing Responsive Viewports...');
  // Desktop: 1440 x 900
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await waitForPageReady();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'proof-landing-1440x900-viewport.png'), fullPage: false });
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'proof-landing-1440x900-fullpage.png'), fullPage: true });
  console.log('✔ Captured 1440x900 desktop screenshots');

  // Tablet: 768 x 1024
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
  await waitForPageReady();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'proof-landing-768x1024-fullpage.png'), fullPage: true });
  console.log('✔ Captured 768x1024 tablet fullpage screenshot');

  // Mobile: 390 x 844
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await waitForPageReady();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'proof-landing-390x844-viewport.png'), fullPage: false });
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'proof-landing-390x844-fullpage.png'), fullPage: true });
  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log(`✔ Captured 390x844 mobile screenshots (Mobile overflow: ${mobileOverflow})`);

  // Reset to 1024x1536 for individual section captures
  await page.setViewport({ width: 1024, height: 1536, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0', timeout: 30000 });
  await waitForPageReady();

  // ==========================================
  // 3. CAPTURE INDIVIDUAL SECTIONS & SLICE COMPARISONS
  // ==========================================
  console.log('\n[3/5] Capturing Individual Sections and generating natural comparisons...');
  const sectionLedger = [];

  for (const sec of SECTIONS) {
    const el = await page.$(sec.selector);
    if (!el) {
      console.warn(`Element not found: ${sec.selector}`);
      continue;
    }
    const box = await el.boundingBox();
    const renderedH = Math.round(box.height);
    const renderedW = Math.round(box.width);
    const delta = renderedH - sec.targetHeight;

    const renderedBuf = await el.screenshot();
    const renderedFile = path.join(SECTIONS_DIR, `${sec.id}-rendered.png`);
    fs.writeFileSync(renderedFile, renderedBuf);

    const refFile = path.join(REF_DIR, `${sec.id}.png`);
    let cmpFile = null;
    let refMeta = null;

    if (fs.existsSync(refFile)) {
      refMeta = await sharp(refFile).metadata();
      const maxH = Math.max(refMeta.height, renderedH);
      const canvasW = refMeta.width + renderedW;

      const sbsBuffer = await sharp({
        create: {
          width: canvasW,
          height: maxH,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      })
        .composite([
          { input: refFile, top: 0, left: 0 },
          { input: renderedBuf, top: 0, left: refMeta.width }
        ])
        .png()
        .toBuffer();

      cmpFile = path.join(SECTIONS_DIR, `cmp-${sec.id}.png`);
      fs.writeFileSync(cmpFile, sbsBuffer);
    }

    sectionLedger.push({
      id: sec.id,
      name: sec.name,
      targetHeight: sec.targetHeight,
      renderedHeight: renderedH,
      renderedWidth: renderedW,
      delta,
      renderedFile,
      comparisonFile: cmpFile
    });

    console.log(`✔ Section ${sec.id} (${sec.name}): Target ${sec.targetHeight}px, Rendered ${renderedH}px, Delta ${delta >= 0 ? '+' : ''}${delta}px`);
  }

  // ==========================================
  // 4. GENERATE FULL PAGE SIDE-BY-SIDE (2048 x 1536)
  // ==========================================
  console.log('\n[4/5] Generating Full Page Side-by-Side (2048 x 1536)...');
  const sbsFullPath = path.join(EVIDENCE_DIR, 'proof-side-by-side-1024x1536.png');
  const sbsCanvas = await sharp({
    create: {
      width: 2048,
      height: 1536,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([
      { input: REF_FULL, top: 0, left: 0 },
      { input: fullpagePath, top: 0, left: 1024 }
    ])
    .png()
    .toBuffer();
  fs.writeFileSync(sbsFullPath, sbsCanvas);
  console.log(`✔ Saved full side-by-side to: ${sbsFullPath}`);

  // ==========================================
  // 5. GENERATE 50% OVERLAY BLEND (1024 x 1536)
  // ==========================================
  console.log('\n[5/5] Generating 50% Opacity Overlay Blend (1024 x 1536)...');
  const overlayFullPath = path.join(EVIDENCE_DIR, 'proof-overlay-50-blend.png');
  // Blend rendered page at 50% opacity over reference poster
  const semiRendered = await sharp(fullpagePath)
    .ensureAlpha()
    .linear(0.5, 0) // reduce opacity to 50%
    .toBuffer();

  const overlayCanvas = await sharp(REF_FULL)
    .composite([{ input: semiRendered, blend: 'over' }])
    .png()
    .toBuffer();
  fs.writeFileSync(overlayFullPath, overlayCanvas);
  console.log(`✔ Saved 50% overlay blend to: ${overlayFullPath}`);

  // Save JSON report
  const auditReport = {
    timestamp: new Date().toISOString(),
    viewport: { width: 1024, height: 1536 },
    domMetrics: domReport.metrics,
    sectionMetrics: domReport.sectionMetrics,
    sectionLedger,
    files: {
      fullpage: fullpagePath,
      viewport: viewportPath,
      topSegment: topSegPath,
      bottomSegment: btmSegPath,
      sideBySide: sbsFullPath,
      overlayBlend: overlayFullPath
    }
  };

  fs.writeFileSync(
    path.join(EVIDENCE_DIR, 'visual-audit-v5-metrics.json'),
    JSON.stringify(auditReport, null, 2)
  );

  await browser.close();
  if (serverProc) {
    serverProc.kill();
  }

  console.log('\n===============================================================');
  console.log('✅ ALL VISUAL EVIDENCE REGENERATION COMPLETED SUCCESSFULLY!');
  console.log('===============================================================\n');
}

runCompleteEvidencePipeline().catch((err) => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
