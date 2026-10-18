// scripts/test-pdfjs-render.cjs
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BROWSER_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1000,1400']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1400 });

  // Read the PDF binary and base64 encode it
  const pdfPath = path.join(__dirname, '..', 'public', 'downloads', 'print-packs', 'kana-home-practice-v1', 'nihomi-visual-vocabulary-n5-sample.pdf');
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfBase64 = pdfBytes.toString('base64');

  // Read pdf.min.mjs and pdf.worker.min.mjs or load from cdn / local
  const pdfJsCode = fs.readFileSync(path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.min.mjs'), 'utf8');

  // Create an HTML page with canvas and inline pdfjs
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; background: #1a1a2e; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; font-family: sans-serif; }
    canvas { background: #fff; box-shadow: 0 8px 30px rgba(0,0,0,0.7); border-radius: 4px; }
  </style>
</head>
<body>
  <div id="render-target"></div>
  <script type="module">
    ${pdfJsCode}
    
    // Set worker
    const pdfData = atob("${pdfBase64}");
    const uint8Array = new Uint8Array(pdfData.length);
    for (let i = 0; i < pdfData.length; i++) {
      uint8Array[i] = pdfData.charCodeAt(i);
    }

    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    loadingTask.promise.then(async (pdf) => {
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      document.getElementById('render-target').appendChild(canvas);
      const context = canvas.getContext('2d');
      await page.render({ canvasContext: context, viewport }).promise;
      window.__pdfRenderDone = true;
    }).catch(e => {
      console.error(e);
      window.__pdfRenderError = e.message;
    });
  </script>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForFunction('window.__pdfRenderDone === true || window.__pdfRenderError', { timeout: 10000 });
  
  const err = await page.evaluate(() => window.__pdfRenderError);
  if (err) {
    console.error('PDF Render Error:', err);
  } else {
    const outPath = path.join(__dirname, '..', 'artifacts', 'qa', 'phase20-3-1', 'screenshots', 'pdf-preview-visual-vocab.png');
    await page.screenshot({ path: outPath });
    console.log('Successfully rendered PDF page screenshot to:', outPath);
  }

  await browser.close();
}

main().catch(console.error);
