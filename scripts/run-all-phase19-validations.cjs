// scripts/run-all-phase19-validations.cjs
// Runs all deterministic validation suites for Phase 19

const { execSync } = require('child_process');

const SUITES = [
  { name: 'TypeScript Typecheck (npm run lint)', cmd: 'npm run lint' },
  { name: 'Curriculum Lattice Prerequisite Matrix (17/17)', cmd: 'npm run validate:curriculum' },
  { name: 'Tokyo Real-Life Scenarios Validation (233/233)', cmd: 'npm run validate:scenarios' },
  { name: 'Canonical 12-Pricing Matrix Test', cmd: 'npx tsx scripts/test-canonical-pricing-matrix.ts' },
  { name: 'Role & Permission Security Guard Matrix (5/5)', cmd: 'npx tsx scripts/test-role-authorization-matrix.ts' },
  { name: 'Pre-Release Release Candidate Verification (7/7)', cmd: 'npm run verify-rc' }
];

console.log('=== RUNNING ALL PHASE 19 DETERMINISTIC VALIDATION SUITES ===\n');

let allPassed = true;
const summary = [];

for (const suite of SUITES) {
  process.stdout.write(`⏳ Running: ${suite.name}... `);
  try {
    const output = execSync(suite.cmd, { stdio: 'pipe', encoding: 'utf-8' });
    console.log('✅ PASS');
    summary.push({ name: suite.name, status: 'PASS', output: output.trim() });
  } catch (err) {
    console.log('❌ FAIL');
    console.error(err.stdout || err.message);
    summary.push({ name: suite.name, status: 'FAIL', output: (err.stdout || err.message).trim() });
    allPassed = false;
  }
}

console.log('\n======================================================');
console.log('                 VALIDATION SUMMARY                   ');
console.log('======================================================');
summary.forEach((s) => {
  const icon = s.status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} ${s.name}: ${s.status}`);
});
console.log('======================================================');

if (!allPassed) {
  process.exit(1);
} else {
  console.log('ALL DETERMINISTIC VALIDATION SUITES PASSED (100%)');
}
