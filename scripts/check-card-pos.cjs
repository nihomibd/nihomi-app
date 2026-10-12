const puppeteer = require('puppeteer-core');
const http = require('http');
const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function checkServer(port = 4173) {
  return new Promise((resolve) => {
    http.get(`http://localhost:${port}`, (res) => {
      resolve(res.statusCode < 500);
    }).on('error', () => resolve(false));
  });
}

async function ensureServer(port = 4173) {
  const isRunning = await checkServer(port);
  if (isRunning) return null;

  const server = spawn('npx.cmd', ['vite', 'preview', '--port', String(port)], {
    shell: true,
    stdio: 'ignore'
  });

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await checkServer(port)) return server;
  }
  throw new Error(`Could not start preview server within 30 seconds`);
}

async function checkCardPosition() {
  const serverProc = await ensureServer(4173);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 1536, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

  // Get debug info on hero section
  const debug = await page.evaluate(() => {
    const hero = document.getElementById('hero-section');
    if (!hero) return { error: 'No #hero-section found' };
    const text = hero.innerText;
    const cards = Array.from(hero.querySelectorAll('*')).filter(el => {
      const cls = el.className || '';
      return typeof cls === 'string' && cls.includes('rounded-2xl');
    }).map(el => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, text: el.innerText.slice(0, 30), rect: { x: r.x, y: r.y, w: r.width, h: r.height } };
    });

    const h3s = Array.from(hero.querySelectorAll('h3')).map(h => ({
      text: h.innerText,
      rect: h.getBoundingClientRect()
    }));

    return { heroRect: hero.getBoundingClientRect(), cards, h3s, textSnippet: text.slice(0, 200) };
  });

  console.log('Hero Debug Data:', JSON.stringify(debug, null, 2));
  await browser.close();
  if (serverProc) {
    try { serverProc.kill(); } catch (e) {}
  }
}

checkCardPosition().catch((err) => {
  console.error('Error checking card position:', err);
  process.exit(1);
});
