// scripts/verify-server-lifecycle.ts
// NIHOMI.COM (にほみ) — SAFE SERVER LIFECYCLE & SMOKE VERIFICATION SUITE
// Starts dist/server.cjs in an isolated child process, verifies HTTP health, runs smoke checks,
// and GUARANTEES clean process termination and port release.

import { spawn, ChildProcess } from 'child_process';
import http from 'http';
import path from 'path';
import fs from 'fs';

const TEST_PORT = parseInt(process.env.TEST_PORT || '3055', 10);
const HOST = '127.0.0.1';
const STARTUP_TIMEOUT_MS = 20000;

interface TestStepResult {
  name: string;
  passed: boolean;
  durationMs: number;
  details: string;
}

const stepResults: TestStepResult[] = [];

function logStep(name: string, passed: boolean, durationMs: number, details: string) {
  stepResults.push({ name, passed, durationMs, details });
  if (passed) {
    console.log(`  ✓ [PASS] ${name} (${durationMs}ms)`);
    console.log(`    └─ ${details}`);
  } else {
    console.error(`  ✗ [FAIL] ${name} (${durationMs}ms)`);
    console.error(`    └─ ERROR: ${details}`);
  }
}

function httpGet(urlPath: string): Promise<{ statusCode: number; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.get(
      {
        hostname: HOST,
        port: TEST_PORT,
        path: urlPath,
        timeout: 5000,
        headers: { Accept: '*/*' }
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode || 0, headers: res.headers, body }));
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`HTTP GET ${urlPath} timed out after 5000ms`));
    });
  });
}

async function waitForHealthProbe(timeoutMs: number): Promise<{ latencyMs: number; healthPayload: any }> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const { statusCode, body } = await httpGet('/health');
      if (statusCode === 200) {
        const payload = JSON.parse(body);
        if (payload.status === 'ok') {
          return { latencyMs: Date.now() - start, healthPayload: payload };
        }
      }
    } catch {
      // Server not ready yet; retry after brief delay
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Server failed to respond on http://${HOST}:${TEST_PORT}/health within ${timeoutMs}ms`);
}

async function terminateProcessGracefully(child: ChildProcess): Promise<void> {
  if (!child.pid) return;

  const pid = child.pid;
  console.log(`\n[Lifecycle] Terminating test server process (PID ${pid})...`);

  // Attempt graceful SIGTERM
  try {
    child.kill('SIGTERM');
  } catch (_) {}

  // Wait up to 3 seconds for graceful exit
  const exited = await Promise.race([
    new Promise<boolean>((resolve) => child.on('exit', () => resolve(true))),
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 3000))
  ]);

  if (!exited) {
    console.warn(`[Lifecycle] Process did not exit within 3s. Force killing PID ${pid}...`);
    if (process.platform === 'win32') {
      try {
        const { execSync } = await import('child_process');
        execSync(`taskkill /pid ${pid} /T /F`, { stdio: 'ignore' });
      } catch (_) {}
    } else {
      try {
        child.kill('SIGKILL');
      } catch (_) {}
    }
  }

  console.log(`[Lifecycle] Test server PID ${pid} cleanly stopped. Port ${TEST_PORT} released.`);
}

async function runSafeServerVerification(): Promise<void> {
  console.log('='.repeat(80));
  console.log('  NIHOMI.COM (にほみ) — SAFE SERVER LIFECYCLE & SMOKE VERIFICATION');
  console.log(`  Target Port: ${TEST_PORT} | Mode: production`);
  console.log('='.repeat(80) + '\n');

  // Step 1: Verify build artifacts exist on disk
  const t0 = Date.now();
  const serverPath = path.resolve(process.cwd(), 'dist/server.cjs');
  const indexPath = path.resolve(process.cwd(), 'dist/index.html');

  if (!fs.existsSync(serverPath)) {
    logStep('Static Build Check', false, Date.now() - t0, `dist/server.cjs not found at ${serverPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(indexPath)) {
    logStep('Static Build Check', false, Date.now() - t0, `dist/index.html not found at ${indexPath}`);
    process.exit(1);
  }
  const serverStat = fs.statSync(serverPath);
  const indexStat = fs.statSync(indexPath);
  logStep(
    'Static Build Check',
    true,
    Date.now() - t0,
    `Artifacts verified: server.cjs (${(serverStat.size / 1024 / 1024).toFixed(2)}MB), index.html (${(indexStat.size / 1024).toFixed(2)}KB)`
  );

  // Step 2: Spawn test server child process
  let serverProcess: ChildProcess | null = null;
  let serverStdout = '';
  let serverStderr = '';

  try {
    const tStart = Date.now();
    serverProcess = spawn(
      process.execPath,
      [serverPath, '--port', String(TEST_PORT), '--host', HOST],
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          PORT: String(TEST_PORT),
          HOST: HOST,
          NODE_ENV: 'production'
        },
        stdio: ['ignore', 'pipe', 'pipe']
      }
    );

    serverProcess.stdout?.on('data', (d) => {
      serverStdout += d.toString();
    });
    serverProcess.stderr?.on('data', (d) => {
      serverStderr += d.toString();
    });

    console.log(`[Lifecycle] Spawned test server with PID: ${serverProcess.pid}`);

    // Step 3: Wait for /health probe with timeout
    const { latencyMs, healthPayload } = await waitForHealthProbe(STARTUP_TIMEOUT_MS);
    logStep(
      'Server Startup & Health Probe',
      true,
      latencyMs,
      `Server responding on http://${HOST}:${TEST_PORT}/health (nodeEnv: ${healthPayload.environment?.nodeEnv || 'unknown'}, service: ${healthPayload.service})`
    );

    // Step 4: Verify root route GET / (Static HTML delivery)
    const tHtml = Date.now();
    const indexRes = await httpGet('/');
    const htmlPassed = indexRes.statusCode === 200 && indexRes.body.includes('<!DOCTYPE html>');
    logStep(
      'Root Static Delivery (GET /)',
      htmlPassed,
      Date.now() - tHtml,
      `Status: ${indexRes.statusCode}, Content-Length: ${indexRes.body.length} bytes, has HTML doctype: ${htmlPassed}`
    );

    // Step 5: Verify GET /api/health
    const tApiHealth = Date.now();
    const apiHealthRes = await httpGet('/api/health');
    const apiHealthPassed = apiHealthRes.statusCode === 200 && JSON.parse(apiHealthRes.body).status === 'ok';
    logStep(
      'API Health Endpoint (GET /api/health)',
      apiHealthPassed,
      Date.now() - tApiHealth,
      `Status: ${apiHealthRes.statusCode}, API status: ${JSON.parse(apiHealthRes.body).status}`
    );

    // Step 6: Verify GET /robots.txt
    const tRobots = Date.now();
    const robotsRes = await httpGet('/robots.txt');
    const robotsPassed = robotsRes.statusCode === 200 && robotsRes.body.includes('User-agent');
    logStep(
      'Robots.txt Endpoint (GET /robots.txt)',
      robotsPassed,
      Date.now() - tRobots,
      `Status: ${robotsRes.statusCode}, Body snippet: ${robotsRes.body.trim().split('\n')[0]}`
    );

  } finally {
    // Step 7: Clean termination GUARANTEE
    if (serverProcess) {
      await terminateProcessGracefully(serverProcess);
    }
  }

  // Final summary
  const allPassed = stepResults.every((r) => r.passed);
  console.log('\n' + '='.repeat(80));
  console.log(`  VERIFICATION RESULT: ${allPassed ? '✓ ALL CHECKS PASSED' : '✗ FAILED'}`);
  console.log(`  Total Steps: ${stepResults.length} | Passed: ${stepResults.filter((r) => r.passed).length} | Failed: ${stepResults.filter((r) => !r.passed).length}`);
  console.log('='.repeat(80) + '\n');

  if (!allPassed) {
    if (serverStderr) {
      console.error('[Server Stderr Dump]:', serverStderr);
    }
    process.exit(1);
  }
}

runSafeServerVerification().catch((err) => {
  console.error('[Fatal Error in Verification Suite]:', err);
  process.exit(1);
});
