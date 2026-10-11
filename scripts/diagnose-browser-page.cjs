const puppeteer = require('puppeteer-core');
const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

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
    console.log('✔ Preview server already running on port 4173');
    return null;
  }
  console.log('Starting preview server on port 4173...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    stdio: 'inherit'
  });
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await checkServer()) {
      console.log('✔ Preview server ready on port 4173');
      return server;
    }
  }
  throw new Error('Server start timeout');
}

async function diagnose() {
  const server = await ensureServer();
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', err => consoleMessages.push({ type: 'pageerror', text: err.toString() }));

  await page.setViewport({ width: 1024, height: 1536, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0', timeout: 30000 });

  // Evaluate DOM metrics
  const domReport = await page.evaluate(() => {
    const docEl = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');

    const sections = [
      { id: '01-header', name: 'Header', sel: 'header' },
      { id: '02-hero', name: 'Hero', sel: '#hero-section' },
      { id: '03-try-lesson', name: 'Try Lesson', sel: '#try-lesson' },
      { id: '04-journey', name: 'Learning Journey', sel: '#why-nihomi' },
      { id: '05-outcomes', name: 'Japan Outcomes', sel: '#japan-readiness' },
      { id: '06-testimonials', name: 'Student Stories', sel: '#testimonials' },
      { id: '07-pricing', name: 'Pricing', sel: '#pricing-section' },
      { id: '08-banner', name: 'Final Banner', sel: '#final-cta' }
    ];

    const results = sections.map(sec => {
      const el = document.querySelector(sec.sel);
      if (!el) {
        return { id: sec.id, name: sec.name, exists: false };
      }
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0;
      return {
        id: sec.id,
        name: sec.name,
        exists: true,
        selector: sec.sel,
        rect: {
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        },
        isVisible,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        overflow: style.overflow,
        backgroundColor: style.backgroundColor
      };
    });

    // Check containers
    const containers = [
      { name: 'html', el: docEl },
      { name: 'body', el: body },
      { name: 'root', el: root }
    ].map(c => {
      if (!c.el) return { name: c.name, exists: false };
      const s = window.getComputedStyle(c.el);
      return {
        name: c.name,
        scrollHeight: c.el.scrollHeight,
        clientHeight: c.el.clientHeight,
        offsetHeight: c.el.offsetHeight,
        overflow: s.overflow,
        overflowY: s.overflowY,
        maxHeight: s.maxHeight
      };
    });

    return {
      scrollDimensions: {
        docScrollWidth: docEl.scrollWidth,
        docScrollHeight: docEl.scrollHeight,
        docClientWidth: docEl.clientWidth,
        docClientHeight: docEl.clientHeight,
        bodyScrollHeight: body.scrollHeight
      },
      containers,
      sections: results
    };
  });

  console.log('\n================ BROWSER DOM REPORT ================');
  console.log(JSON.stringify(domReport, null, 2));

  console.log('\n================ CONSOLE MESSAGES ==================');
  console.log(JSON.stringify(consoleMessages, null, 2));

  // Capture full page screenshot
  const outDir = path.resolve('storage/evidence');
  const fullPagePath = path.join(outDir, 'proof-diagnose-fullpage.png');
  await page.screenshot({ path: fullPagePath, fullPage: true });
  console.log(`\n✔ Captured fullpage to ${fullPagePath}`);

  // Also capture segment screenshots for 100% verification
  const segments = [
    { name: 'segment-top-0-768.png', clip: { x: 0, y: 0, width: 1024, height: 768 } },
    { name: 'segment-bottom-768-1536.png', clip: { x: 0, y: 768, width: 1024, height: 768 } }
  ];
  for (const seg of segments) {
    const segPath = path.join(outDir, seg.name);
    await page.screenshot({ path: segPath, clip: seg.clip });
    console.log(`✔ Captured segment to ${segPath}`);
  }

  await browser.close();
  if (server) server.kill();
}

diagnose().catch(err => {
  console.error('Diagnosis failed:', err);
  process.exit(1);
});
