// scripts/test-seo-sitemap-and-ai-indexing.ts
// Comprehensive Test Suite for WP15: SEO, Sitemap, Robots, AI Crawlers (llms.txt), and Founder Role Isolation
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { AUTHORITATIVE_FOUNDER_EMAIL, isFounderEmail, isAdminEmail } from '../server/env.js';

console.log('================================================================');
console.log('🔍 NIHOMI.COM — SEO, SITEMAP, AI INDEXING & ROLE VERIFICATION');
console.log('================================================================\n');

let passCount = 0;
let totalCount = 0;

function check(title: string, fn: () => void) {
  totalCount++;
  try {
    fn();
    passCount++;
    console.log(`  ✔ [PASS] ${title}`);
  } catch (err: any) {
    console.error(`  ❌ [FAIL] ${title}`);
    console.error(`     Error: ${err.message}`);
    throw err;
  }
}

// -------------------------------------------------------------
// 1. FOUNDER EMAIL & ROLE SECURITY INVARIANTS
// -------------------------------------------------------------
console.log('[SECTION 1: FOUNDER ROLE ISOLATION INVARIANTS]');

check('Authoritative founder email is strictly mdtanvirkabirbiplob@gmail.com', () => {
  assert.equal(AUTHORITATIVE_FOUNDER_EMAIL, 'mdtanvirkabirbiplob@gmail.com');
});

check('isFounderEmail returns true for authoritative founder email (case-insensitive)', () => {
  assert.equal(isFounderEmail('mdtanvirkabirbiplob@gmail.com'), true);
  assert.equal(isFounderEmail('MDTANVIRKABIRBIPLOB@GMAIL.COM'), true);
  assert.equal(isFounderEmail('  mdtanvirkabirbiplob@gmail.com  '), true);
});

check('isFounderEmail returns false for any other email (strictly student role)', () => {
  assert.equal(isFounderEmail('student@example.com'), false);
  assert.equal(isFounderEmail('admin@nihomi.com'), false);
  assert.equal(isFounderEmail('founder@nihomi.com'), false);
  assert.equal(isFounderEmail('test@gmail.com'), false);
  assert.equal(isFounderEmail(''), false);
  assert.equal(isFounderEmail(undefined), false);
});

// -------------------------------------------------------------
// 2. SITEMAP.XML SCHEMA & ROUTE AUDIT
// -------------------------------------------------------------
console.log('\n[SECTION 2: CANONICAL V2 SITEMAP.XML AUDIT]');

const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');

check('public/sitemap.xml exists and is non-empty', () => {
  assert.ok(fs.existsSync(sitemapPath), 'sitemap.xml must exist in public/');
  const content = fs.readFileSync(sitemapPath, 'utf8');
  assert.ok(content.length > 500, 'sitemap.xml must have substantial content');
});

check('sitemap.xml contains valid XML declaration and schema namespace', () => {
  const content = fs.readFileSync(sitemapPath, 'utf8');
  assert.ok(content.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'Must start with XML declaration');
  assert.ok(content.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'), 'Must include sitemaps namespace');
  assert.ok(content.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'), 'Must include xhtml namespace');
});

check('sitemap.xml contains all 14 canonical V2 routes', () => {
  const content = fs.readFileSync(sitemapPath, 'utf8');
  const requiredRoutes = [
    'https://nihomi.com/',
    'https://nihomi.com/journey',
    'https://nihomi.com/curriculum',
    'https://nihomi.com/kana',
    'https://nihomi.com/mock-exams',
    'https://nihomi.com/rirekisho',
    'https://nihomi.com/workos',
    'https://nihomi.com/pricing',
    'https://nihomi.com/portal',
    'https://nihomi.com/documents',
    'https://nihomi.com/contact',
    'https://nihomi.com/terms',
    'https://nihomi.com/privacy',
    'https://nihomi.com/refund-policy'
  ];

  for (const route of requiredRoutes) {
    assert.ok(content.includes(`<loc>${route}</loc>`), `Route ${route} must be included in sitemap.xml`);
  }
});

check('sitemap.xml entries contain valid priority and lastmod timestamps', () => {
  const content = fs.readFileSync(sitemapPath, 'utf8');
  assert.ok(content.includes('<priority>1.0</priority>'), 'Root landing must have priority 1.0');
  assert.ok(content.includes('<priority>0.95</priority>'), 'Core journey & curriculum must have high priority');
  assert.ok(content.includes('<lastmod>2026-10-23</lastmod>'), 'Lastmod must be updated to current release date');
});

check('sitemap.xml contains multilingual hreflang alternatives (bn, ja, en)', () => {
  const content = fs.readFileSync(sitemapPath, 'utf8');
  assert.ok(content.includes('hreflang="bn"'), 'Must support Bengali hreflang');
  assert.ok(content.includes('hreflang="ja"'), 'Must support Japanese hreflang');
  assert.ok(content.includes('hreflang="en"'), 'Must support English hreflang');
  assert.ok(content.includes('hreflang="x-default"'), 'Must specify x-default fallback');
});

// -------------------------------------------------------------
// 3. ROBOTS.TXT DIRECTIVES & BOT PERMISSIONS
// -------------------------------------------------------------
console.log('\n[SECTION 3: ROBOTS.TXT DIRECTIVES & BOT CLEARANCE]');

const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');

check('public/robots.txt exists and links to canonical sitemap', () => {
  assert.ok(fs.existsSync(robotsPath), 'robots.txt must exist in public/');
  const content = fs.readFileSync(robotsPath, 'utf8');
  assert.ok(content.includes('Sitemap: https://nihomi.com/sitemap.xml'), 'Must declare sitemap location');
});

check('robots.txt explicitly allows search engines and major AI crawlers', () => {
  const content = fs.readFileSync(robotsPath, 'utf8');
  assert.ok(content.includes('User-agent: Googlebot'), 'Must configure Googlebot');
  assert.ok(content.includes('User-agent: Bingbot'), 'Must configure Bingbot');
  assert.ok(content.includes('User-agent: GPTBot'), 'Must configure GPTBot (OpenAI)');
  assert.ok(content.includes('User-agent: ClaudeBot'), 'Must configure ClaudeBot (Anthropic)');
  assert.ok(content.includes('User-agent: Google-Extended'), 'Must configure Google-Extended (Gemini)');
  assert.ok(content.includes('User-agent: PerplexityBot'), 'Must configure PerplexityBot');
});

check('robots.txt protects sensitive internal admin and founder endpoints', () => {
  const content = fs.readFileSync(robotsPath, 'utf8');
  assert.ok(content.includes('Disallow: /founder'), 'Must disallow /founder');
  assert.ok(content.includes('Disallow: /api/founder/*'), 'Must disallow /api/founder/*');
  assert.ok(content.includes('Disallow: /admin'), 'Must disallow /admin');
  assert.ok(content.includes('Disallow: /api/billing/webhook'), 'Must disallow /api/billing/webhook');
});

// -------------------------------------------------------------
// 4. AI CRAWLER STANDARDS (LLMS.TXT & LLMS-FULL.TXT)
// -------------------------------------------------------------
console.log('\n[SECTION 4: AI CRAWLER STANDARDS (LLMS.TXT)]');

const llmsPath = path.join(process.cwd(), 'public', 'llms.txt');
const llmsFullPath = path.join(process.cwd(), 'public', 'llms-full.txt');

check('public/llms.txt exists and follows llmstxt.org standard', () => {
  assert.ok(fs.existsSync(llmsPath), 'llms.txt must exist in public/');
  const content = fs.readFileSync(llmsPath, 'utf8');
  assert.ok(content.includes('# NIHOMI (にほみ)'), 'Must include title header');
  assert.ok(content.includes('> NIHOMI.COM'), 'Must include blockquote summary');
  assert.ok(content.includes('## Canonical Platform Modules & Endpoints'), 'Must include module section');
  assert.ok(content.includes('https://nihomi.com/curriculum'), 'Must link to curriculum');
  assert.ok(content.includes('https://nihomi.com/mock-exams'), 'Must link to mock exams');
  assert.ok(content.includes('https://nihomi.com/rirekisho'), 'Must link to JIS resume builder');
});

check('public/llms-full.txt exists and contains complete technical curriculum blueprint', () => {
  assert.ok(fs.existsSync(llmsFullPath), 'llms-full.txt must exist in public/');
  const content = fs.readFileSync(llmsFullPath, 'utf8');
  assert.ok(content.includes('Strict Cumulative Learning Lattice'), 'Must detail pedagogical law');
  assert.ok(content.includes('Minna no Nihongo & JLPT N5 Master Curriculum (25 Lessons)'), 'Must tabulate all 25 lessons');
  assert.ok(content.includes('Computer-Based Examination Engine'), 'Must detail CBT exam rules');
  assert.ok(content.includes('Japanese JIS Standard Resume (履歴書) Studio'), 'Must detail JIS resume specs');
  assert.ok(content.includes('Tokyo Konbini (7-Eleven POS) Job Simulator'), 'Must detail WorkOS simulation');
  assert.ok(content.includes('mdtanvirkabirbiplob@gmail.com'), 'Must declare authoritative Founder');
});

// -------------------------------------------------------------
// 5. INDEX.HTML WEBMASTER & OPEN GRAPH METADATA
// -------------------------------------------------------------
console.log('\n[SECTION 5: INDEX.HTML WEBMASTER & SOCIAL OPEN GRAPH]');

const indexPath = path.join(process.cwd(), 'index.html');

check('index.html contains Google Search Console and Bing Webmaster verification tags', () => {
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.ok(content.includes('name="google-site-verification"'), 'Must contain google-site-verification');
  assert.ok(content.includes('name="msvalidate.01"'), 'Must contain msvalidate.01 (Bing)');
  assert.ok(content.includes('rel="help" type="text/plain" href="https://nihomi.com/llms.txt"'), 'Must link to llms.txt');
});

check('index.html contains full Open Graph preview tags for WhatsApp & LinkedIn', () => {
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.ok(content.includes('property="og:title"'), 'Must include og:title');
  assert.ok(content.includes('property="og:description"'), 'Must include og:description');
  assert.ok(content.includes('property="og:image"'), 'Must include og:image');
  assert.ok(content.includes('property="og:image:width" content="1200"'), 'Must specify og:image:width=1200');
  assert.ok(content.includes('property="og:image:height" content="630"'), 'Must specify og:image:height=630');
  assert.ok(content.includes('property="og:site_name" content="NIHOMI.COM (にほみ)"'), 'Must specify og:site_name');
  assert.ok(content.includes('property="article:publisher" content="https://nihomi.com"'), 'Must specify article:publisher');
});

check('index.html contains complete Twitter Summary Card tags', () => {
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.ok(content.includes('name="twitter:card" content="summary_large_image"'), 'Must specify summary_large_image');
  assert.ok(content.includes('name="twitter:site" content="@nihomibd"'), 'Must specify twitter:site');
  assert.ok(content.includes('name="twitter:creator" content="@nihomibd"'), 'Must specify twitter:creator');
  assert.ok(content.includes('name="twitter:image"'), 'Must specify twitter:image');
});

// -------------------------------------------------------------
// 6. INDEXNOW INTEGRATION
// -------------------------------------------------------------
console.log('\n[SECTION 6: INDEXNOW INTEGRATION FOR BING & SEARCH ENGINES]');

const indexNowKeyPath = path.join(process.cwd(), 'public', 'indexnow-key.txt');

check('public/indexnow-key.txt exists with valid verification key', () => {
  assert.ok(fs.existsSync(indexNowKeyPath), 'indexnow-key.txt must exist in public/');
  const content = fs.readFileSync(indexNowKeyPath, 'utf8').trim();
  assert.ok(content.length >= 8, 'Key must be at least 8 characters');
});

console.log('\n================================================================');
console.log(`RESULTS: ${passCount}/${totalCount} TESTS PASSED (100% SUCCESS)`);
console.log('================================================================');
process.exit(0);
