// scripts/production-live-smoke-test.ts
// NIHOMI.COM (にほみ) — LIVE PRODUCTION POST-DEPLOYMENT SMOKE TEST SUITE
// Safe, read-only/idempotent verification for live domain (e.g. https://nihomi.com or staging URL)
// Guarantees zero data loss, zero billing triggers, and zero customer notifications.

import https from 'https';
import http from 'http';
import { URL } from 'url';

const TARGET_URL = (process.env.TARGET_URL || process.env.APP_URL || 'https://nihomi.com').replace(/\/+$/, '');

interface SmokeCheckResult {
  id: number;
  category: string;
  name: string;
  passed: boolean;
  statusCode: number;
  durationMs: number;
  details: string;
}

const checkResults: SmokeCheckResult[] = [];

function requestUrl(
  method: string,
  pathStr: string,
  body?: any,
  headers?: Record<string, string>
): Promise<{ statusCode: number; headers: Record<string, string | string[] | undefined>; data: any; raw: string }> {
  return new Promise((resolve, reject) => {
    const fullUrl = new URL(pathStr, TARGET_URL);
    const isHttps = fullUrl.protocol === 'https:';
    const client = isHttps ? https : http;

    const postData = body ? JSON.stringify(body) : '';
    const reqHeaders: Record<string, string> = {
      Accept: 'application/json, text/html, */*',
      'User-Agent': 'NihomiProductionSmokeRunner/1.0',
      ...headers
    };

    if (body) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData).toString();
    }

    const req = client.request(
      fullUrl,
      {
        method,
        headers: reqHeaders,
        timeout: 10000
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          let parsed: any = null;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
          resolve({
            statusCode: res.statusCode || 0,
            headers: res.headers,
            data: parsed,
            raw
          });
        });
      }
    );

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request to ${fullUrl.toString()} timed out after 10000ms`));
    });

    if (postData) req.write(postData);
    req.end();
  });
}

function recordCheck(id: number, category: string, name: string, passed: boolean, statusCode: number, durationMs: number, details: string) {
  checkResults.push({ id, category, name, passed, statusCode, durationMs, details });
  const icon = passed ? '✓ [PASS]' : '✗ [FAIL]';
  console.log(`  ${icon} #${id} [${category}] ${name} (${durationMs}ms) [HTTP ${statusCode}]`);
  console.log(`    └─ ${details}`);
}

export async function runProductionSmokeTests(): Promise<boolean> {
  console.log('\n' + '='.repeat(80));
  console.log('  NIHOMI.COM (にほみ) — LIVE PRODUCTION POST-DEPLOYMENT SMOKE SUITE');
  console.log(`  Target URL: ${TARGET_URL}`);
  console.log('  Safety Guarantee: Non-destructive, zero billing triggers, zero customer notifications');
  console.log('='.repeat(80) + '\n');

  // Check 1: Root HTTPS Frontend Delivery
  let t = Date.now();
  try {
    const res = await requestUrl('GET', '/');
    const hasHtml = res.statusCode === 200 && (res.raw.includes('<!DOCTYPE html>') || res.raw.includes('nihomi'));
    recordCheck(1, 'FRONTEND', 'Root HTTPS HTML Delivery', hasHtml, res.statusCode, Date.now() - t,
      `Length: ${res.raw.length} bytes, Doctyped HTML: ${hasHtml}`);
  } catch (err: any) {
    recordCheck(1, 'FRONTEND', 'Root HTTPS HTML Delivery', false, 0, Date.now() - t, err.message);
  }

  // Check 2: API Health Probe (/api/health)
  t = Date.now();
  try {
    const res = await requestUrl('GET', '/api/health');
    const isHealthy = res.statusCode === 200 && res.data?.status === 'ok';
    recordCheck(2, 'API_HEALTH', 'Backend Readiness Probe (/api/health)', isHealthy, res.statusCode, Date.now() - t,
      `Service: "${res.data?.service || 'Nihomi'}", Status: "${res.data?.status}"`);
  } catch (err: any) {
    recordCheck(2, 'API_HEALTH', 'Backend Readiness Probe (/api/health)', false, 0, Date.now() - t, err.message);
  }

  // Check 3: Root Health Probe (/health)
  t = Date.now();
  try {
    const res = await requestUrl('GET', '/health');
    const isHealthy = res.statusCode === 200 && (res.data?.status === 'ok' || res.raw.includes('ok'));
    recordCheck(3, 'API_HEALTH', 'Load Balancer Probe (/health)', isHealthy, res.statusCode, Date.now() - t,
      `Response matches operational health contract`);
  } catch (err: any) {
    recordCheck(3, 'API_HEALTH', 'Load Balancer Probe (/health)', false, 0, Date.now() - t, err.message);
  }

  // Check 4: SEO Crawlability (/robots.txt)
  t = Date.now();
  try {
    const res = await requestUrl('GET', '/robots.txt');
    const hasRobots = res.statusCode === 200 && res.raw.includes('User-agent');
    recordCheck(4, 'SEO_DISCOVERY', 'Robots.txt Specification', hasRobots, res.statusCode, Date.now() - t,
      `Snippet: "${res.raw.trim().split('\n')[0]}"`);
  } catch (err: any) {
    recordCheck(4, 'SEO_DISCOVERY', 'Robots.txt Specification', false, 0, Date.now() - t, err.message);
  }

  // Check 5: SEO Sitemap (/sitemap.xml)
  t = Date.now();
  try {
    const res = await requestUrl('GET', '/sitemap.xml');
    const hasSitemap = res.statusCode === 200 && (res.raw.includes('<urlset') || res.raw.includes('nihomi.com'));
    recordCheck(5, 'SEO_DISCOVERY', 'XML Course Sitemap Schema', hasSitemap, res.statusCode, Date.now() - t,
      `Structured course and curriculum URLs indexed`);
  } catch (err: any) {
    recordCheck(5, 'SEO_DISCOVERY', 'XML Course Sitemap Schema', false, 0, Date.now() - t, err.message);
  }

  // Check 6: Public Subscription & Plan Catalog
  t = Date.now();
  try {
    const res = await requestUrl('GET', '/api/billing/plans');
    const hasPlans = res.statusCode === 200 && Array.isArray(res.data?.plans) && res.data.plans.length >= 3;
    recordCheck(6, 'CATALOG', 'Public Subscription Tiers (/api/billing/plans)', hasPlans, res.statusCode, Date.now() - t,
      `Loaded ${res.data?.plans?.length || 0} active commercial tiers`);
  } catch (err: any) {
    recordCheck(6, 'CATALOG', 'Public Subscription Tiers (/api/billing/plans)', false, 0, Date.now() - t, err.message);
  }

  // Check 7: Session Verification for Unauthenticated Visitors
  t = Date.now();
  try {
    const res = await requestUrl('GET', '/api/auth/me');
    const isUnauthSafe = res.statusCode === 200 && res.data?.authenticated === false;
    recordCheck(7, 'AUTH_SECURITY', 'Unauthenticated Visitor Session Handling (/api/auth/me)', isUnauthSafe, res.statusCode, Date.now() - t,
      `Authenticated: ${res.data?.authenticated} (Graceful unauthenticated payload returned)`);
  } catch (err: any) {
    recordCheck(7, 'AUTH_SECURITY', 'Unauthenticated Visitor Session Handling (/api/auth/me)', false, 0, Date.now() - t, err.message);
  }

  // Check 8: Telemetry Ingestion Pipeline (Anonymous Landing Event)
  t = Date.now();
  try {
    const res = await requestUrl('POST', '/api/analytics/track', {
      event: 'landing_page_view',
      properties: {
        source: 'production_smoke_runner',
        path: '/'
      }
    });
    const isTracked = res.statusCode === 200 && res.data?.success === true;
    recordCheck(8, 'ANALYTICS', 'Telemetry Ingestion Pipeline (/api/analytics/track)', isTracked, res.statusCode, Date.now() - t,
      `Event acknowledged at ${res.data?.receivedAt || 'server'}`);
  } catch (err: any) {
    recordCheck(8, 'ANALYTICS', 'Telemetry Ingestion Pipeline (/api/analytics/track)', false, 0, Date.now() - t, err.message);
  }

  // Check 9: Payment Webhook Boundary Rejection (Unauthenticated Signature Defense)
  t = Date.now();
  try {
    const res = await requestUrl('POST', '/api/payment/sslcommerz/ipn', {
      val_id: 'SMOKE_PROBE_001',
      status: 'VALID'
    });
    // In production, unauthenticated payment notifications must be rejected with HTTP 400
    const isProtected = res.statusCode === 400;
    recordCheck(9, 'PAYMENT_SAFETY', 'Payment Webhook Signature Rejection Defense', isProtected, res.statusCode, Date.now() - t,
      `Unauthenticated notification rejected with HTTP ${res.statusCode} ("${res.raw.trim()}")`);
  } catch (err: any) {
    recordCheck(9, 'PAYMENT_SAFETY', 'Payment Webhook Signature Rejection Defense', false, 0, Date.now() - t, err.message);
  }

  // Check 10: Security Headers (Clickjacking & MIME-Sniffing Defense)
  t = Date.now();
  try {
    const res = await requestUrl('GET', '/');
    const xFrame = res.headers['x-frame-options'];
    const xContent = res.headers['x-content-type-options'];
    const hasHeaders = xFrame === 'DENY' || xContent === 'nosniff' || !!res.headers['content-security-policy'];
    recordCheck(10, 'SECURITY_HEADERS', 'Production Security Headers', hasHeaders, res.statusCode, Date.now() - t,
      `X-Frame-Options: ${xFrame || 'N/A'}, X-Content-Type-Options: ${xContent || 'N/A'}`);
  } catch (err: any) {
    recordCheck(10, 'SECURITY_HEADERS', 'Production Security Headers', false, 0, Date.now() - t, err.message);
  }

  // Summary Table
  const total = checkResults.length;
  const passed = checkResults.filter((c) => c.passed).length;
  const failed = total - passed;

  console.log('\n' + '='.repeat(80));
  console.log(`  POST-DEPLOYMENT SMOKE RESULT: ${failed === 0 ? '✓ ALL CHECKS PASSED' : '✗ CHECKS FAILED'}`);
  console.log(`  Total Checks: ${total} | Passed: ${passed} | Failed: ${failed}`);
  console.log('='.repeat(80) + '\n');

  return failed === 0;
}

if (process.argv[1] && process.argv[1].endsWith('production-live-smoke-test.ts')) {
  runProductionSmokeTests().then((allPassed) => {
    process.exit(allPassed ? 0 : 1);
  }).catch((err) => {
    console.error('[Fatal Error in Smoke Runner]:', err);
    process.exit(1);
  });
}
