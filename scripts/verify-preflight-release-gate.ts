// scripts/verify-preflight-release-gate.ts
// NIHOMI.COM (にほみ) — AUTOMATED PRE-FLIGHT COMMERCIAL RELEASE GATE
// Single Authoritative Gate Verifier for N.I.H.O.M.I Shared Loop Architecture
// Governed by docs/NIHOMI_WORK_PACKAGE_APPROVAL_PROTOCOL.md & .agents/rules/nihomi-constitution.md

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface GateCheck {
  id: string;
  name: string;
  command: string;
  args: string[];
  expectedPassPhrase?: string;
  timeoutMs: number;
}

const GATE_CHECKS: GateCheck[] = [
  {
    id: 'GATE-01-ADAPTERS',
    name: 'Shared Learning Loop Domain Adapters (4 Domains / 77 Tests)',
    command: 'npx',
    args: ['tsx', 'scripts/test-domain-adapters.ts'],
    expectedPassPhrase: '77 PASSED | 0 FAILED',
    timeoutMs: 30000
  },
  {
    id: 'GATE-02-ORCHESTRATOR',
    name: 'Loop Orchestrator & Sensei AI Bridge (38 Tests)',
    command: 'npx',
    args: ['tsx', 'scripts/test-loop-orchestrator.ts'],
    expectedPassPhrase: '38 PASSED | 0 FAILED',
    timeoutMs: 30000
  },
  {
    id: 'GATE-03-ROLES',
    name: 'Role Security & Founder Isolation Matrix (5 Tests)',
    command: 'npx',
    args: ['tsx', 'scripts/test-role-authorization-matrix.ts'],
    expectedPassPhrase: '5/5 PASSED',
    timeoutMs: 30000
  },
  {
    id: 'GATE-04-KNOWLEDGE-STATE',
    name: 'Learner Knowledge State Server Persistence (12 Tests)',
    command: 'npx',
    args: ['tsx', 'scripts/test-knowledge-state-persistence.ts'],
    expectedPassPhrase: 'Passed: 12 | Failed: 0',
    timeoutMs: 30000
  },
  {
    id: 'GATE-05-CURRICULUM',
    name: 'Strict Cumulative Learning Lattice & Pedagogy (17 Assertions)',
    command: 'npx',
    args: ['tsx', 'scripts/validate-curriculum.ts'],
    expectedPassPhrase: 'ALL 17 CURRICULUM LATTICE ASSERTIONS PASSED',
    timeoutMs: 30000
  },
  {
    id: 'GATE-06-BROWSER-E2E',
    name: 'Real Headless Chromium/Edge Browser Suite (14 Scenarios)',
    command: 'node',
    args: ['scripts/verify-v2-browser-suite.cjs'],
    expectedPassPhrase: 'TOTAL: 14/14 PASSED (100%)',
    timeoutMs: 90000
  },
  {
    id: 'GATE-07-CV-PDF-AND-FREE-TIER',
    name: 'JIS CV PDF Generation & Free Tier Gating (13 Tests)',
    command: 'npx',
    args: ['tsx', 'scripts/test-cv-pdf-and-free-tier.ts'],
    expectedPassPhrase: 'ALL 13/13 TESTS PASSED PERFECTLY',
    timeoutMs: 30000
  },
  {
    id: 'GATE-08-CBT-EXAM-AND-CERTIFICATES',
    name: 'CBT JLPT Mock Exams, Marksheets & Branded Certificates (8 Tests)',
    command: 'npx',
    args: ['tsx', 'scripts/test-cbt-mock-exam-and-certificates.ts'],
    expectedPassPhrase: 'ALL 8/8 TESTS PASSED PERFECTLY',
    timeoutMs: 30000
  }
];

function runCheck(check: GateCheck): { passed: boolean; durationMs: number; output: string } {
  const start = Date.now();
  console.log(`\n----------------------------------------------------------------`);
  console.log(`▶ Executing: [${check.id}] ${check.name}...`);
  console.log(`  Command: ${check.command} ${check.args.join(' ')}`);

  const proc = spawnSync(check.command, check.args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: check.timeoutMs,
    shell: true,
    env: { ...process.env, NODE_ENV: 'production' }
  });

  const durationMs = Date.now() - start;
  const stdout = proc.stdout || '';
  const stderr = proc.stderr || '';
  const combined = stdout + '\n' + stderr;

  const phraseMatch = check.expectedPassPhrase ? combined.includes(check.expectedPassPhrase) : true;
  const passed = proc.status === 0 && phraseMatch;

  if (passed) {
    console.log(`  ✔ [PASS] ${check.name} (${durationMs}ms)`);
  } else {
    console.error(`  ❌ [FAIL] ${check.name} (Exit code: ${proc.status}, ${durationMs}ms)`);
    if (proc.error) console.error(`  Error: ${proc.error.message}`);
    console.error(`  Output snippet:\n${combined.slice(-600)}`);
  }

  return { passed, durationMs, output: combined };
}

async function runPreflightGate() {
  console.log('================================================================');
  console.log('🚀 NIHOMI.COM — CANONICAL PRE-FLIGHT COMMERCIAL RELEASE GATE');
  console.log('================================================================');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Repository: ${process.cwd()}`);
  console.log(`Branch: feature/founder-approved-product-system`);

  // 1. Verify build artifacts existence
  const serverPath = path.resolve(process.cwd(), 'dist/server.cjs');
  const indexPath = path.resolve(process.cwd(), 'dist/index.html');
  if (!fs.existsSync(serverPath) || !fs.existsSync(indexPath)) {
    console.error('\n❌ FATAL: Production build artifacts missing in dist/. Run npm run build first.');
    process.exit(1);
  }
  console.log('✔ Build Artifacts Verified: dist/server.cjs & dist/index.html present.');

  const results: Array<{ id: string; name: string; passed: boolean; durationMs: number }> = [];

  for (const check of GATE_CHECKS) {
    const res = runCheck(check);
    results.push({ id: check.id, name: check.name, passed: res.passed, durationMs: res.durationMs });
    if (!res.passed) {
      console.error(`\n🚨 PRE-FLIGHT RELEASE GATE HALTED: ${check.id} failed.`);
      break;
    }
  }

  console.log('\n================================================================');
  console.log('📊 PRE-FLIGHT RELEASE GATE SUMMARY');
  console.log('================================================================');
  let passedCount = 0;
  for (const r of results) {
    if (r.passed) passedCount++;
    console.log(`  ${r.passed ? '✔ PASS' : '❌ FAIL'} [${r.id}] ${r.name} (${r.durationMs}ms)`);
  }
  console.log('================================================================');
  const allPassed = passedCount === GATE_CHECKS.length;
  console.log(`RESULT: ${passedCount}/${GATE_CHECKS.length} GATE CHECKS PASSED (${allPassed ? '100% - RELEASE CANDIDATE GREEN' : 'BLOCKED'})`);
  console.log('================================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

runPreflightGate().catch((err) => {
  console.error('[Preflight Gate Fatal Error]:', err);
  process.exit(1);
});
