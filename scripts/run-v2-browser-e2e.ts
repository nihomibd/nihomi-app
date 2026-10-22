// scripts/run-v2-browser-e2e.ts
// E2E Test Server Runner for NIHOMI V2 Browser Suite
import { spawn, ChildProcess } from 'child_process';
import http from 'http';
import path from 'path';
import fs from 'fs';

const PORT = 3000;
const HOST = '127.0.0.1';
const STARTUP_TIMEOUT_MS = 25000;

function httpGet(pathStr: string): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.get(
      {
        hostname: HOST,
        port: PORT,
        path: pathStr,
        timeout: 5000
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ statusCode: res.statusCode || 0, body }));
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timed out requesting ${pathStr}`));
    });
  });
}

async function waitForServer(timeoutMs: number): Promise<void> {
  const start = Date.now();
  console.log(`[V2 E2E Runner] Waiting for server on http://${HOST}:${PORT}/health...`);
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await httpGet('/health');
      if (res.statusCode === 200) {
        console.log(`[V2 E2E Runner] Server ready in ${Date.now() - start}ms!`);
        return;
      }
    } catch {
      // waiting
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server failed to start within ${timeoutMs}ms`);
}

async function terminateProcess(child: ChildProcess): Promise<void> {
  if (!child.pid) return;
  const pid = child.pid;
  console.log(`\n[V2 E2E Runner] Terminating server (PID ${pid})...`);
  try {
    child.kill('SIGTERM');
  } catch (_) {}

  const exited = await Promise.race([
    new Promise<boolean>((resolve) => child.on('exit', () => resolve(true))),
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 3000))
  ]);

  if (!exited) {
    console.warn(`[V2 E2E Runner] Force-killing server PID ${pid}...`);
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
  console.log(`[V2 E2E Runner] Server cleanly stopped.`);
}

async function run(): Promise<void> {
  const serverPath = path.resolve(process.cwd(), 'dist/server.cjs');
  if (!fs.existsSync(serverPath)) {
    console.error(`[V2 E2E Runner] Error: dist/server.cjs not found. Run npm run build first.`);
    process.exit(1);
  }

  let serverProcess: ChildProcess | null = null;
  let testExitCode = 1;

  try {
    console.log(`[V2 E2E Runner] Launching test server (dist/server.cjs on port ${PORT})...`);
    serverProcess = spawn(process.execPath, [serverPath, '--port', String(PORT), '--host', HOST], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PORT: String(PORT),
        HOST: HOST,
        NODE_ENV: 'production'
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    serverProcess.stdout?.on('data', (d) => {
      const msg = d.toString().trim();
      if (msg.includes('Server running') || msg.includes('Ready for browser')) {
        console.log(`  [Server] ${msg}`);
      }
    });

    await waitForServer(STARTUP_TIMEOUT_MS);

    console.log('\n[V2 E2E Runner] Launching V2 Browser Verification Suite...');
    const testScriptPath = path.resolve(process.cwd(), 'scripts/verify-v2-browser-suite.cjs');

    testExitCode = await new Promise<number>((resolve) => {
      const testProc = spawn(process.execPath, [testScriptPath], {
        cwd: process.cwd(),
        stdio: 'inherit'
      });
      testProc.on('exit', (code) => resolve(code ?? 1));
      testProc.on('error', (err) => {
        console.error('[V2 E2E Runner] Error launching test script:', err);
        resolve(1);
      });
    });

  } finally {
    if (serverProcess) {
      await terminateProcess(serverProcess);
    }
  }

  console.log(`\n[V2 E2E Runner] Completed with exit code: ${testExitCode}`);
  process.exit(testExitCode);
}

run().catch((err) => {
  console.error('[V2 E2E Runner Fatal Error]:', err);
  process.exit(1);
});
