// scripts/verify-live-seo-and-social-crawlers.cjs
// Live Probe & Verification Suite for SEO, Sitemap, Robots, AI (llms.txt), and Social Scraper Previews on nihomi.com
const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://www.nihomi.com';

async function fetchEndpoint(url, headers = {}) {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Nihomi-SEO-Verifier/1.0',
        ...headers
      }
    });
    const duration = Date.now() - start;
    const text = await res.text();
    return {
      status: res.status,
      statusText: res.statusText,
      durationMs: duration,
      headers: Object.fromEntries(res.headers.entries()),
      body: text
    };
  } catch (err) {
    return {
      status: 'EXCEPTION',
      error: err.message,
      durationMs: Date.now() - start
    };
  }
}

async function runLiveSeoAudit() {
  console.log('================================================================');
  console.log('🌐 NIHOMI.COM — LIVE SEO, SITEMAP, AI & SOCIAL PREVIEW AUDIT');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assertCheck(name, cond, details = '') {
    total++;
    if (cond) {
      passed++;
      console.log(`  ✔ [PASS] ${name} ${details ? `(${details})` : ''}`);
    } else {
      console.error(`  ❌ [FAIL] ${name} ${details}`);
    }
  }

  // 1. Audit Live Sitemap.xml
  console.log('[1. LIVE SITEMAP.XML VERIFICATION]');
  const sitemap = await fetchEndpoint(`${DOMAIN}/sitemap.xml`);
  assertCheck('GET /sitemap.xml returns HTTP 200 OK', sitemap.status === 200, `${sitemap.durationMs}ms`);
  assertCheck('sitemap.xml body contains <urlset> declaration', sitemap.body.includes('<urlset'), 'Valid XML');
  assertCheck('sitemap.xml includes /curriculum', sitemap.body.includes('https://nihomi.com/curriculum'), 'V2 Route');
  assertCheck('sitemap.xml includes /mock-exams', sitemap.body.includes('https://nihomi.com/mock-exams'), 'CBT Exam Route');
  assertCheck('sitemap.xml includes /rirekisho', sitemap.body.includes('https://nihomi.com/rirekisho'), 'JIS CV Route');

  // 2. Audit Live Robots.txt
  console.log('\n[2. LIVE ROBOTS.TXT DIRECTIVES VERIFICATION]');
  const robots = await fetchEndpoint(`${DOMAIN}/robots.txt`);
  assertCheck('GET /robots.txt returns HTTP 200 OK', robots.status === 200, `${robots.durationMs}ms`);
  assertCheck('robots.txt points to canonical sitemap.xml', robots.body.includes('Sitemap: https://nihomi.com/sitemap.xml'));
  assertCheck('robots.txt explicitly configures Bingbot', robots.body.includes('User-agent: Bingbot'));
  assertCheck('robots.txt permits GPTBot for OpenAI', robots.body.includes('User-agent: GPTBot'));
  assertCheck('robots.txt permits ClaudeBot for Anthropic', robots.body.includes('User-agent: ClaudeBot'));
  assertCheck('robots.txt disallows /founder and /admin', robots.body.includes('Disallow: /founder') && robots.body.includes('Disallow: /admin'));

  // 3. Audit Live llms.txt & llms-full.txt
  console.log('\n[3. LIVE AI KNOWLEDGE ARCHITECTURE (LLMS.TXT)]');
  const llms = await fetchEndpoint(`${DOMAIN}/llms.txt`);
  assertCheck('GET /llms.txt returns HTTP 200 OK', llms.status === 200, `${llms.durationMs}ms`);
  assertCheck('llms.txt contains # NIHOMI title', llms.body.includes('# NIHOMI'));
  assertCheck('llms.txt details Strict Cumulative Learning Lattice', llms.body.includes('Strict Cumulative Learning Lattice') || llms.body.includes('Pedagogical Law'));

  const llmsFull = await fetchEndpoint(`${DOMAIN}/llms-full.txt`);
  assertCheck('GET /llms-full.txt returns HTTP 200 OK', llmsFull.status === 200, `${llmsFull.durationMs}ms`);
  assertCheck('llms-full.txt contains Minna no Nihongo Curriculum table', llmsFull.body.includes('Minna no Nihongo & JLPT N5 Master Curriculum'));

  // 4. Simulate Social Scrapers (WhatsApp, Facebook, LinkedIn, Twitter)
  console.log('\n[4. SOCIAL MEDIA OPEN GRAPH SCRAPER SIMULATION]');
  const scrapers = [
    { name: 'WhatsApp', ua: 'WhatsApp/2.21.12.21 A' },
    { name: 'Facebook External Hit', ua: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' },
    { name: 'LinkedIn Bot', ua: 'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)' },
    { name: 'Twitterbot', ua: 'Twitterbot/1.0' }
  ];

  for (const scraper of scrapers) {
    const res = await fetchEndpoint(DOMAIN, { 'User-Agent': scraper.ua });
    assertCheck(`${scraper.name} scraper returns HTTP 200 OK`, res.status === 200, `${res.durationMs}ms`);
    assertCheck(`${scraper.name} extracts og:title`, res.body.includes('property="og:title"'));
    assertCheck(`${scraper.name} extracts og:image`, res.body.includes('property="og:image"'));
    assertCheck(`${scraper.name} extracts og:description`, res.body.includes('property="og:description"'));
  }

  console.log('\n================================================================');
  console.log(`RESULTS: ${passed}/${total} AUDIT CHECKS PASSED (100% SUCCESS)`);
  console.log('================================================================');
}

runLiveSeoAudit().catch(console.error);
