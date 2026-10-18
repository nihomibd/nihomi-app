const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  page.on('console', msg => console.log(`[BROWSER CONSOLE ${msg.type()}]`, msg.text()));

  console.log('Navigating directly to /lesson?lessonId=n5-l1...');
  await page.goto(`${BASE_URL}/lesson?lessonId=n5-l1`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  const url = page.url();
  console.log('Current URL:', url);

  const headings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({ tag: h.tagName, text: h.innerText }));
  });
  console.log('Headings:', headings);

  const canvasExists = await page.evaluate(() => {
    return Boolean(document.querySelector('canvas'));
  });
  console.log('Canvas exists:', canvasExists);

  await browser.close();
}

main();
