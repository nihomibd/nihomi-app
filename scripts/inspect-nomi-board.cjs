const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SOURCE_IMG = path.resolve('_founder_drop/extracted/20261016_nomi_handoff_v1/Nihomi_Nomi_Companion_Handoff_v1/references/Nihomi_Master_Implementation_Kit_v1.2/assets/Nomi_Master_Character_v1.1.png');

async function inspectBoard() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--allow-file-access-from-files', '--disable-web-security', '--window-size=1800,1200']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1700, height: 1000 });

  const imgBase64 = fs.readFileSync(SOURCE_IMG).toString('base64');
  const dataUri = `data:image/png;base64,${imgBase64}`;

  const outDir = path.resolve('scratch/nomi_inspection');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; background: #141726;">
        <img id="board" src="${dataUri}" />
      </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForFunction(() => {
    const img = document.getElementById('board');
    return img && img.complete && img.naturalWidth > 0;
  });

  const dims = await page.evaluate(() => {
    const img = document.getElementById('board');
    return { naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight };
  });

  console.log('Board dimensions:', dims);

  // Now let's save the full image screenshot to check it
  await page.screenshot({ path: path.join(outDir, 'board_full.png'), fullPage: true });
  console.log('Saved board_full.png');

  await browser.close();
}

inspectBoard().catch(err => {
  console.error(err);
  process.exit(1);
});
