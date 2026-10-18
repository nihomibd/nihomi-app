// scripts/render-pdf-screenshots.cjs
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BROWSER_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const pdfjsBundleCode = fs.readFileSync(path.join(__dirname, '..', 'artifacts', 'qa', 'phase20-3-1', 'pdfjs-bundle.js'), 'utf8');
const workerBundleCode = fs.readFileSync(path.join(__dirname, '..', 'artifacts', 'qa', 'phase20-3-1', 'pdfjs-worker-bundle.js'), 'utf8');

const TARGET_PDFS = [
  {
    name: '01-hiragana-master-chart',
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-hiragana-master-chart.pdf',
    title: 'Hiragana 50-Sound Master Chart (A4)',
    page: 1
  },
  {
    name: '02-visual-vocabulary-n5-sample',
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-visual-vocabulary-n5-sample.pdf',
    title: 'Visual Vocabulary N5 Flashcards (A4 - 10 Cards)',
    page: 1
  },
  {
    name: '03-kana-stroke-order-practice-p1',
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-kana-stroke-order-practice.pdf',
    title: 'Kana Stroke Order Practice Workbook (Page 1 of 2)',
    page: 1
  },
  {
    name: '04-kana-stroke-order-practice-p2',
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-kana-stroke-order-practice.pdf',
    title: 'Kana Stroke Order Practice Workbook (Page 2 of 2)',
    page: 2
  },
  {
    name: '05-confusion-pairs-workbook',
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-kana-confusion-pairs-workbook.pdf',
    title: 'Kana Confusion Pairs Practice Workbook (A4)',
    page: 1
  },
  {
    name: '06-home-practice-guide-bn',
    relPath: 'public/downloads/print-packs/kana-home-practice-v1/nihomi-home-practice-guide-bn.pdf',
    title: 'Home Practice Methodology Guide (5-Step Bengali Method)',
    page: 1
  }
];

async function main() {
  console.log('Launching browser to render high-resolution PDF page screenshots...');
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1200,1600']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600 });

  const outDir = path.join(__dirname, '..', 'artifacts', 'qa', 'phase20-3-1', 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const renderedCaptures = [];

  for (const item of TARGET_PDFS) {
    const fullPath = path.join(__dirname, '..', item.relPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      continue;
    }
    const pdfBase64 = fs.readFileSync(fullPath).toString('base64');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; background: #0c0d14; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; min-height: 100vh; padding: 24px; font-family: -apple-system, sans-serif; }
    .header { color: #f6f0e6; margin-bottom: 16px; text-align: center; }
    .header h2 { margin: 0 0 6px 0; font-size: 20px; font-weight: 600; color: #fff; }
    .header p { margin: 0; font-size: 13px; color: #a1a1aa; }
    canvas { background: #ffffff; box-shadow: 0 12px 40px rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>${item.title}</h2>
    <p>Authentic Nihomi Original Learning Asset • Rendered at 150 DPI</p>
  </div>
  <div id="canvas-container"></div>
  <script>
    ${workerBundleCode}
    ${pdfjsBundleCode}

    (async function() {
      try {
        const raw = atob("${pdfBase64}");
        const uint8 = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) uint8[i] = raw.charCodeAt(i);
        
        const loadingTask = pdfjsLib.getDocument({ data: uint8 });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(${item.page});
        const viewport = page.getViewport({ scale: 1.5 });
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        document.getElementById('canvas-container').appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
        window.__done = true;
      } catch (err) {
        window.__error = err.message;
      }
    })();
  </script>
</body>
</html>`;

    await page.setContent(html, { waitUntil: 'load' });
    await page.waitForFunction('window.__done === true || window.__error', { timeout: 15000 });
    
    const err = await page.evaluate(() => window.__error);
    if (err) {
      console.error(`Error rendering ${item.name}:`, err);
    } else {
      const outFileName = `pdf-page-${item.name}.png`;
      const outFilePath = path.join(outDir, outFileName);
      await page.screenshot({ path: outFilePath, fullPage: true });
      const stat = fs.statSync(outFilePath);
      console.log(`✓ Rendered: ${outFileName} (${(stat.size / 1024).toFixed(1)} KB)`);
      renderedCaptures.push({
        id: item.name,
        title: item.title,
        filename: outFileName,
        sizeBytes: stat.size,
        path: `screenshots/${outFileName}`
      });
    }
  }

  await browser.close();
  fs.writeFileSync(
    path.join(__dirname, '..', 'artifacts', 'qa', 'phase20-3-1', 'rendered-pdf-pages.json'),
    JSON.stringify(renderedCaptures, null, 2),
    'utf8'
  );
  console.log(`All ${renderedCaptures.length} PDF page previews generated successfully.`);
}

main().catch(console.error);
