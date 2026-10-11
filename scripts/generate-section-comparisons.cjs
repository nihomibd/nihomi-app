const puppeteer = require('puppeteer-core');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const REF_DIR = path.resolve('storage/evidence/reference-sections');
const OUT_DIR = path.resolve('storage/evidence/section-comparisons');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function checkServer() {
  return new Promise((resolve) => {
    http.get('http://localhost:4173', (res) => {
      resolve(res.statusCode < 500);
    }).on('error', () => resolve(false));
  });
}

async function ensureServer() {
  const isRunning = await checkServer();
  if (isRunning) {
    console.log('✔ Preview server is already running on port 4173');
    return null;
  }

  console.log('Starting preview server on port 4173...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    stdio: 'ignore'
  });

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await checkServer()) {
      console.log('✔ Preview server started successfully');
      return server;
    }
  }
  throw new Error('Could not start preview server within 30 seconds');
}

const SECTION_DEFS = [
  { id: '01-header', selector: 'header', targetHeight: 60, name: 'Header' },
  { id: '02-hero', selector: 'header + section, #hero-section', targetHeight: 380, name: 'Hero' },
  { id: '03-try-lesson', selector: '#try-lesson', targetHeight: 235, name: 'Try Lesson' },
  { id: '04-journey', selector: '#why-nihomi', targetHeight: 215, name: 'Learning Journey' },
  { id: '05-outcomes', selector: '#japan-readiness', targetHeight: 210, name: 'Japan Outcomes' },
  { id: '06-testimonials', selector: '#testimonials', targetHeight: 160, name: 'Student Stories' },
  { id: '07-pricing', selector: '#pricing-section', targetHeight: 165, name: 'Pricing' },
  { id: '08-banner', selector: 'section:last-of-type, #final-cta', targetHeight: 111, name: 'Final Banner' }
];

async function runComparisons() {
  const serverProc = await ensureServer();

  console.log('Launching Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 1536, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0', timeout: 30000 });

  // Get total page height
  const fullPageMetrics = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight
    };
  });

  console.log(`\n===============================================================`);
  console.log(`FULL PAGE RENDERED HEIGHT: ${fullPageMetrics.scrollHeight} px (Target: 1536 px)`);
  console.log(`===============================================================\n`);

  // Capture full page at 1024w
  const fullPageBuffer = await page.screenshot({ fullPage: true });

  const summary = [];

  for (const sec of SECTION_DEFS) {
    const el = await page.$(sec.selector);
    if (!el) {
      console.warn(`WARNING: Element not found for selector: ${sec.selector}`);
      continue;
    }

    const box = await el.boundingBox();
    if (!box) {
      console.warn(`WARNING: No bounding box for selector: ${sec.selector}`);
      continue;
    }

    const renderedHeight = Math.round(box.height);
    const renderedWidth = Math.round(box.width);
    const delta = renderedHeight - sec.targetHeight;

    summary.push({
      id: sec.id,
      name: sec.name,
      targetHeight: sec.targetHeight,
      renderedHeight,
      delta
    });

    // Capture element screenshot at natural dimensions
    const renderedBuf = await el.screenshot();
    const renderedImgPath = path.join(OUT_DIR, `${sec.id}-rendered.png`);
    fs.writeFileSync(renderedImgPath, renderedBuf);

    // Reference slice path
    const refSlicePath = path.join(REF_DIR, `${sec.id}.png`);
    if (fs.existsSync(refSlicePath)) {
      const refMeta = await sharp(refSlicePath).metadata();

      // Create natural side-by-side (NO distortion, NO scaling of heights)
      const maxH = Math.max(refMeta.height, renderedHeight);
      const canvasW = refMeta.width + renderedWidth; // 1024 + 1024 = 2048

      // Create blank white canvas
      const sbsImg = await sharp({
        create: {
          width: canvasW,
          height: maxH,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      })
        .composite([
          { input: refSlicePath, top: 0, left: 0 },
          { input: renderedBuf, top: 0, left: refMeta.width }
        ])
        .png()
        .toBuffer();

      const sbsPath = path.join(OUT_DIR, `cmp-${sec.id}.png`);
      fs.writeFileSync(sbsPath, sbsImg);

      console.log(`✔ Generated natural comparison: ${sec.id} (Ref: ${refMeta.height}px vs Rendered: ${renderedHeight}px, delta: ${delta >= 0 ? '+' : ''}${delta}px)`);
    } else {
      console.warn(`Reference slice missing: ${refSlicePath}`);
    }
  }

  console.log(`\n=================== SECTION METRICS SUMMARY ===================`);
  console.log(`Section Name             | Target | Rendered | Delta   | Status`);
  console.log(`----------------------------------------------------------------`);
  let totalTarget = 0;
  let totalRendered = 0;
  for (const s of summary) {
    totalTarget += s.targetHeight;
    totalRendered += s.renderedHeight;
    const sign = s.delta > 0 ? `+${s.delta}` : `${s.delta}`;
    const status = Math.abs(s.delta) <= 10 ? 'EXACT' : s.delta > 10 ? 'TOO TALL' : 'TOO SHORT';
    console.log(
      `${s.name.padEnd(24)} | ${String(s.targetHeight).padStart(6)} | ${String(s.renderedHeight).padStart(8)} | ${sign.padStart(7)} | ${status}`
    );
  }
  console.log(`----------------------------------------------------------------`);
  console.log(
    `${'TOTAL'.padEnd(24)} | ${String(totalTarget).padStart(6)} | ${String(totalRendered).padStart(8)} | ${String(totalRendered - totalTarget).padStart(7)} |`
  );
  console.log(`================================================================\n`);

  await browser.close();

  if (serverProc) {
    serverProc.kill();
  }
}

runComparisons().catch((err) => {
  console.error('Comparison error:', err);
  process.exit(1);
});
