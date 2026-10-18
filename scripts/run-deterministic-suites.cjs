// scripts/run-deterministic-suites.cjs
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RAW_LOGS_DIR = path.join(__dirname, '..', 'artifacts', 'qa', 'phase20-3-1', 'raw-logs');
if (!fs.existsSync(RAW_LOGS_DIR)) fs.mkdirSync(RAW_LOGS_DIR, { recursive: true });

const SUITES = [
  { id: '04-test-pricing', name: 'Canonical 12-Price Matrix Assertion', cmd: 'npm run test:pricing' },
  { id: '05-test-kana-strokes', name: 'Kana Vector Stroke Evaluator 30-Assertion Suite', cmd: 'npm run test:kana-strokes' },
  { id: '06-test-roles', name: 'Role & Route Security RBAC Barrier', cmd: 'npm run test:roles' },
  { id: '07-validate-curriculum', name: 'Japanese Cumulative Curriculum Lattice Validator', cmd: 'npm run validate:curriculum' },
  { id: '08-validate-scenarios', name: 'Japan Real-Life Dialogue Scenario Validator (233 Trees)', cmd: 'npm run validate:scenarios' },
  { id: '09-verify-rc', name: 'Release Candidate Readiness Audit (7 Gates)', cmd: 'npm run verify-rc' }
];

const suiteResults = [];

for (const suite of SUITES) {
  const start = Date.now();
  const startTime = new Date().toISOString();
  console.log(`\n========================================================================`);
  console.log(`RUNNING: ${suite.name} (${suite.cmd})`);
  console.log(`START: ${startTime}`);
  
  let exitCode = 0;
  let stdout = '';
  let stderr = '';
  
  try {
    stdout = execSync(suite.cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    exitCode = 0;
  } catch (err) {
    exitCode = err.status || 1;
    stdout = (err.stdout || '').toString();
    stderr = (err.stderr || '').toString();
  }
  
  const endTime = new Date().toISOString();
  const durationMs = Date.now() - start;
  const status = exitCode === 0 ? 'PASS' : 'FAIL';
  
  console.log(`END: ${endTime} | DURATION: ${durationMs}ms | EXIT CODE: ${exitCode} | STATUS: ${status}`);
  console.log(stdout.trim());
  if (stderr.trim()) console.error(stderr.trim());
  
  const logContent = [
    `COMMAND: ${suite.cmd}`,
    `SUITE_NAME: ${suite.name}`,
    `START_TIME: ${startTime}`,
    `END_TIME: ${endTime}`,
    `DURATION_MS: ${durationMs}`,
    `EXIT_CODE: ${exitCode}`,
    `STATUS: ${status}`,
    '',
    'STDOUT:',
    stdout,
    '',
    'STDERR:',
    stderr || '(empty)'
  ].join('\n');
  
  fs.writeFileSync(path.join(RAW_LOGS_DIR, `${suite.id}.log`), logContent, 'utf8');
  
  suiteResults.push({
    id: suite.id,
    name: suite.name,
    cmd: suite.cmd,
    exitCode,
    status,
    durationMs,
    startTime,
    endTime,
    logPath: `artifacts/qa/phase20-3-1/raw-logs/${suite.id}.log`
  });
}

fs.writeFileSync(
  path.join(RAW_LOGS_DIR, 'deterministic-suites-summary.json'),
  JSON.stringify(suiteResults, null, 2),
  'utf8'
);

console.log(`\n========================================================================`);
console.log(`ALL 6 DETERMINISTIC SUITES COMPLETE. SUMMARY SAVED.`);
console.log(`========================================================================`);
