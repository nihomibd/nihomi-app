const puppeteer = require('puppeteer-core');
const http = require('http');
const { spawn, execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4173;

function checkServer(port = PORT) {
  return new Promise((resolve) => {
    http.get(`http://localhost:${port}/`, (res) => {
      resolve(res.statusCode < 500);
    }).on('error', () => resolve(false));
  });
}

async function ensureServer(port = PORT) {
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

function stopServer(serverProc) {
  if (!serverProc || !serverProc.pid) return;
  try {
    execSync(`taskkill /pid ${serverProc.pid} /T /F`, { stdio: 'ignore' });
  } catch (_) {}
}

async function main() {
  const serverProc = await ensureServer(PORT);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const failed404s = [];

  page.on('response', res => {
    if (res.status() === 404) {
      failed404s.push({
        url: res.url(),
        status: res.status(),
        resourceType: res.request().resourceType()
      });
    }
  });

  const routes = ['/', '/pricing', '/dashboard', '/journey', '/practice'];

  try {
    for (const r of routes) {
      failed404s.length = 0;
      console.log(`\n--- Checking route: ${r} ---`);
      await page.goto(`http://localhost:${PORT}${r}`, { waitUntil: 'networkidle0', timeout: 25000 }).catch(e => console.log('Nav error:', e.message));
      console.log(`404 count on ${r}:`, failed404s.length);
      if (failed404s.length > 0) {
        console.log('Details:', JSON.stringify(failed404s, null, 2));
      }
    }
  } finally {
    await browser.close();
    stopServer(serverProc);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
