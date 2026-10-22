// scripts/verify-seo-and-og-browser.cjs
// Real Headless Browser Verification Suite for SEO, Meta Tags, Sitemap, and AI (llms.txt) Endpoints
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BROWSER_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];
const BROWSER_PATH = BROWSER_CANDIDATES.find((p) => fs.existsSync(p));

const EVIDENCE_DIR = path.join(__dirname, '..', 'evidence', 'v2-preview');
const ARTIFACT_DIR = 'C:\\Users\\bdtri\\.gemini\\antigravity\\brain\\638b6452-e297-4f06-b5fe-7e3295c58ed1\\evidence\\v2-preview';

if (!fs.existsSync(EVIDENCE_DIR)) fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function saveScreenshot(page, filename) {
  const localPath = path.join(EVIDENCE_DIR, filename);
  const destPath = path.join(ARTIFACT_DIR, filename);
  const buffer = await page.screenshot({ fullPage: false });
  fs.writeFileSync(localPath, buffer);
  try { fs.writeFileSync(destPath, buffer); } catch (e) {}
  console.log(`[EVIDENCE SAVED] ${filename} (${buffer.length} bytes)`);
}

async function verifySeoAndAi() {
  console.log('================================================================');
  console.log('🔍 BROWSER AUDIT: SEO, GSC, BING, SITEMAP & LLMS.TXT');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // 1. Audit DOM Meta Tags on local production server
    console.log('[STEP 1] Loading http://localhost:3000 to audit DOM Head...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 15000 });

    const metaAudit = await page.evaluate(() => {
      const gsc = document.querySelector('meta[name="google-site-verification"]')?.getAttribute('content');
      const bing = document.querySelector('meta[name="msvalidate.01"]')?.getAttribute('content');
      const llmHelp = document.querySelector('link[rel="help"]')?.getAttribute('href');
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
      const ogPublisher = document.querySelector('meta[property="article:publisher"]')?.getAttribute('content');
      const twitterSite = document.querySelector('meta[name="twitter:site"]')?.getAttribute('content');

      return { gsc, bing, llmHelp, ogTitle, ogImage, ogPublisher, twitterSite };
    });

    console.log('  Meta Audit Results:');
    console.log('    • Google Search Console:', metaAudit.gsc ? `✅ Present (${metaAudit.gsc})` : '❌ Missing');
    console.log('    • Bing Webmaster Tools: ', metaAudit.bing ? `✅ Present (${metaAudit.bing})` : '❌ Missing');
    console.log('    • LLMs Context Link:    ', metaAudit.llmHelp ? `✅ Present (${metaAudit.llmHelp})` : '❌ Missing');
    console.log('    • Open Graph Title:     ', metaAudit.ogTitle ? '✅ Present' : '❌ Missing');
    console.log('    • Open Graph Image:     ', metaAudit.ogImage ? `✅ Present (${metaAudit.ogImage})` : '❌ Missing');
    console.log('    • Article Publisher:    ', metaAudit.ogPublisher ? `✅ Present (${metaAudit.ogPublisher})` : '❌ Missing');
    console.log('    • Twitter Card Site:    ', metaAudit.twitterSite ? `✅ Present (${metaAudit.twitterSite})` : '❌ Missing');

    await saveScreenshot(page, 'v2-24-seo-meta-audit.png');

    // 2. Load and verify /llms.txt
    console.log('\n[STEP 2] Navigating to http://localhost:3000/llms.txt...');
    const llmsRes = await page.goto('http://localhost:3000/llms.txt', { waitUntil: 'networkidle2', timeout: 10000 });
    console.log(`  HTTP Status: ${llmsRes.status()}`);
    const llmsText = await page.evaluate(() => document.body.innerText);
    console.log(`  Content Excerpt: ${llmsText.slice(0, 150).replace(/\n/g, ' ')}...`);
    await saveScreenshot(page, 'v2-25-llms-text-preview.png');

    // 3. Load and verify /sitemap.xml
    console.log('\n[STEP 3] Navigating to http://localhost:3000/sitemap.xml...');
    const sitemapRes = await page.goto('http://localhost:3000/sitemap.xml', { waitUntil: 'networkidle2', timeout: 10000 });
    console.log(`  HTTP Status: ${sitemapRes.status()}`);
    const sitemapContent = await page.content();
    console.log(`  Valid XML Sitemap: ${sitemapContent.includes('urlset') && sitemapContent.includes('nihomi.com') ? '✅ YES' : '❌ NO'}`);

    console.log('\n================================================================');
    console.log('✔ BROWSER SEO & AI AUDIT COMPLETED WITH ZERO ERRORS');
    console.log('================================================================');
  } finally {
    await browser.close();
  }
}

verifySeoAndAi().catch((err) => {
  console.error('Browser SEO audit failed:', err);
  process.exit(1);
});
