const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('storage/evidence');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
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

async function capture() {
  const serverProc = await ensureServer();

  console.log('Launching Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // Listen to console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser Error:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('Page Exception:', err.toString());
  });

  // 1. Reference Viewport: 1024 x 1536 (Exact poster reference resolution)
  console.log('Capturing Reference Viewport (1024 x 1536)...');
  await page.setViewport({ width: 1024, height: 1536, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'proof-landing-1024x1536-viewport.png'),
    fullPage: false
  });
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'proof-landing-1024x1536-fullpage.png'),
    fullPage: true
  });
  console.log('✔ Captured 1024x1536 reference evidence');

  // 2. Desktop Standard: 1440 x 900
  console.log('Capturing Desktop Viewport (1440 x 900)...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'proof-landing-1440x900-viewport.png'),
    fullPage: false
  });
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'proof-landing-1440x900-fullpage.png'),
    fullPage: true
  });
  console.log('✔ Captured 1440x900 desktop evidence');

  // 3. Tablet: 768 x 1024
  console.log('Capturing Tablet Viewport (768 x 1024)...');
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'proof-landing-768x1024-fullpage.png'),
    fullPage: true
  });
  console.log('✔ Captured 768x1024 tablet evidence');

  // 4. Mobile: 390 x 844 (iPhone 12/13/14)
  console.log('Capturing Mobile Viewport (390 x 844)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'proof-landing-390x844-viewport.png'),
    fullPage: false
  });
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'proof-landing-390x844-fullpage.png'),
    fullPage: true
  });
  console.log('✔ Captured 390x844 mobile evidence');

  // Check for any horizontal overflow
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log('Mobile horizontal overflow detected:', hasOverflow);

  await browser.close();
  if (serverProc) {
    serverProc.kill();
  }
  console.log('All visual verification captures complete!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
