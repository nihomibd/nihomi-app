const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn, execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('storage/evidence/release-2026-10-16');
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

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

async function waitForPageReady(page) {
  try {
    await page.evaluate(async () => {
      if (document.fonts) {
        try {
          await Promise.race([
            document.fonts.ready,
            new Promise((r) => setTimeout(r, 2000))
          ]);
        } catch (_) {}
      }
      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            const timer = setTimeout(resolve, 2000);
            img.addEventListener('load', () => { clearTimeout(timer); resolve(); }, { once: true });
            img.addEventListener('error', () => { clearTimeout(timer); resolve(); }, { once: true });
          });
        })
      );
    });
  } catch (err) {}
  await new Promise((r) => setTimeout(r, 1000));
}

async function captureEvidence() {
  console.log('='.repeat(80));
  console.log('  NIHOMI — OCTOBER 16 PRODUCTION RELEASE BROWSER QA & VIEWPORT AUDIT');
  console.log('='.repeat(80));

  const serverProc = await ensureServer(PORT);

  console.log('\n[Chrome] Launching Headless Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    protocolTimeout: 60000,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--hide-scrollbars']
  });

  const auditResults = [];

  const viewports = [
    { name: 'desktop', width: 1440, height: 900, isMobile: false },
    { name: 'tablet', width: 768, height: 1024, isMobile: false },
    { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true }
  ];

  const routes = [
    { path: '/', label: 'landing', fullPage: true },
    { path: '/pricing', label: 'pricing', fullPage: true },
    { path: '/dashboard', label: 'dashboard', fullPage: false },
    { path: '/journey', label: 'journey', fullPage: false }
  ];

  try {
    for (const vp of viewports) {
      console.log(`\n================================================================`);
      console.log(`  AUDITING VIEWPORT: ${vp.name.toUpperCase()} (${vp.width}x${vp.height})`);
      console.log(`================================================================`);

      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(30000);
      page.setDefaultTimeout(30000);

      await page.setViewport({
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        isMobile: vp.isMobile,
        hasTouch: vp.hasTouch
      });

      const consoleErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      page.on('pageerror', (err) => {
        consoleErrors.push(err.message);
      });

      // Hydrate mock student session in localStorage before visiting authenticated routes
      await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.evaluate(() => {
        const mockUser = {
          id: 'usr-release-qa',
          email: 'qa.student@nihomi.com',
          displayName: 'Nihomi Scholar',
          role: 'student',
          targetLevel: 'N5',
          studentId: 'NHO-QA-01',
          createdAt: new Date().toISOString()
        };
        const mockAuth = {
          token: 'qa_mock_token_2026',
          user: mockUser,
          authenticated: true
        };
        localStorage.setItem('nihomi_auth', JSON.stringify(mockAuth));
        localStorage.setItem('token', 'qa_mock_token_2026');
        localStorage.setItem('user', JSON.stringify(mockUser));
      });

      for (const route of routes) {
        consoleErrors.length = 0;
        console.log(`\n  Navigating to ${route.path}...`);

        try {
          await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
        } catch (e) {
          console.warn(`    Navigation retry for ${route.path}: ${e.message}`);
          await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'load', timeout: 15000 });
        }

        await waitForPageReady(page);

        // Measure DOM metrics
        const metrics = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body ? body.scrollWidth : 0);
          const clientWidth = docEl.clientWidth;
          const scrollHeight = Math.max(docEl.scrollHeight, body ? body.scrollHeight : 0);
          const hasOverflow = scrollWidth > clientWidth + 1;

          // Overflow detection
          const overflowing = [];
          if (hasOverflow) {
            const all = document.querySelectorAll('*');
            for (let el of all) {
              const r = el.getBoundingClientRect();
              if (r.right > clientWidth + 2) {
                overflowing.push({
                  tag: el.tagName,
                  className: String(el.className || '').slice(0, 40),
                  right: Math.round(r.right)
                });
                if (overflowing.length >= 3) break;
              }
            }
          }

          // Check visible prices on pricing route with term-awareness
          const bodyText = document.body ? document.body.innerText : '';
          const hasMonthly = bodyText.includes('990') && bodyText.includes('1,990') && bodyText.includes('3,990');
          const hasQuarterly = bodyText.includes('2,820') && bodyText.includes('5,670') && bodyText.includes('11,370');
          const hasHalfYearly = bodyText.includes('5,350') && bodyText.includes('10,750') && bodyText.includes('21,550');
          const hasYearly = bodyText.includes('10,100') && bodyText.includes('20,300') && bodyText.includes('40,700');

          const pricesFound = {
            hasCanonicalPlanTotals: hasMonthly || hasQuarterly || hasHalfYearly || hasYearly,
            activeTermDetected: hasQuarterly ? 'quarterly (3m: ৳2,820 / ৳5,670 / ৳11,370)' : (hasMonthly ? 'monthly (1m: ৳990 / ৳1,990 / ৳3,990)' : (hasHalfYearly ? 'half_yearly (6m: ৳5,350 / ৳10,750 / ৳21,550)' : (hasYearly ? 'yearly (12m: ৳10,100 / ৳20,300 / ৳40,700)' : 'none'))),
            termMatchesApprovedMatrix: hasMonthly || hasQuarterly || hasHalfYearly || hasYearly
          };

          return {
            scrollWidth,
            clientWidth,
            scrollHeight,
            hasOverflow,
            overflowing,
            title: document.title,
            pricesFound
          };
        });

        const filename = `${vp.name}-${route.label}.png`;
        const screenshotPath = path.join(OUTPUT_DIR, filename);

        await page.screenshot({
          path: screenshotPath,
          fullPage: route.fullPage
        });

        const pass = !metrics.hasOverflow;
        const status = pass ? '✓ PASS' : '⚠ WARN';

        console.log(`  ${status} [${vp.name.toUpperCase()}] ${route.path}`);
        console.log(`    - Viewport: ${metrics.clientWidth}px | Content Width: ${metrics.scrollWidth}px | Height: ${metrics.scrollHeight}px`);
        console.log(`    - Horizontal Overflow: ${metrics.hasOverflow ? 'DETECTED' : 'NONE (Clean)'}`);
        if (metrics.overflowing.length > 0) {
          console.log(`    - Offending Elements:`, JSON.stringify(metrics.overflowing));
        }
        if (route.label === 'pricing') {
          console.log(`    - Prices Found: Starter: ${metrics.pricesFound.hasStarter990}, Pro: ${metrics.pricesFound.hasPro1990}, Japan Ready: ${metrics.pricesFound.hasJapanReady3990}`);
        }
        console.log(`    - Screenshot Captured: ${filename}`);

        auditResults.push({
          viewport: vp.name,
          route: route.path,
          label: route.label,
          width: vp.width,
          height: vp.height,
          metrics,
          consoleErrors: [...consoleErrors],
          screenshot: filename,
          passed: pass
        });
      }

      await page.close();
    }
  } finally {
    await browser.close();
    if (serverProc) {
      console.log('\n[Server] Terminating preview server...');
      stopServer(serverProc);
    }
  }

  // Persist summary manifest
  const summaryFile = path.join(OUTPUT_DIR, 'release-qa-audit-manifest.json');
  fs.writeFileSync(summaryFile, JSON.stringify(auditResults, null, 2), 'utf-8');

  console.log('\n' + '='.repeat(80));
  console.log(`  RELEASE QA AUDIT COMPLETE: ${auditResults.filter(r => r.passed).length}/${auditResults.length} ROUTES PASSED CLEAN`);
  console.log(`  Manifest: ${summaryFile}`);
  console.log('='.repeat(80));
}

captureEvidence().catch((err) => {
  console.error('[Error] Evidence capture failed:', err);
  process.exit(1);
});
