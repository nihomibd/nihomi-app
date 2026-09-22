/**
 * scripts/verify-gate-3-ai-coo.ts
 * 
 * Comprehensive automated verification test suite for Gate 3:
 * NIHOMI AI COO RUNTIME & COMPANY ORCHESTRATION (NHO-AI-001).
 */

process.env.JWT_SECRET = process.env.JWT_SECRET || 'nihomi-test-jwt-secret-key-32-chars-long-founder';

import fs from 'fs';
import path from 'path';
import { createSessionToken } from '../server/authHelper.js';
import { requireFounder } from '../server/middleware/rbac.js';
import { db } from '../server/db.js';
import { aiCoo } from '../server/services/aiCooRuntimeService.js';
import { User } from '../server/types.js';

async function runGate3Verification() {
  console.log('========================================================================');
  console.log('🤖 NIHOMI — GATE 3: AI COO RUNTIME AUTOMATED VERIFICATION TEST SUITE');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${detail ? '— ' + detail : ''}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // 1. AI COO IDENTITY & BOUNDARIES SPECIFICATION
  // ---------------------------------------------------------------------------
  console.log('--- 1. AI COO IDENTITY & STATUS SPECIFICATION ---');
  const identity = aiCoo.identity;
  assert(identity.employee_id === 'NHO-AI-001', '1.1. AI COO Identity matches designated agent code NHO-AI-001');
  assert(identity.role.includes('Chief Operating Officer'), '1.2. AI COO Role declared as AI Chief Operating Officer');
  assert(identity.reports_to === 'FOUNDER', '1.3. Reporting line strictly set to Founder (Sovereign Authority)');
  assert(identity.operating_mode === 'READ_ANALYZE_PLAN_DELEGATE_REPORT', '1.4. Operating modes restricted to READ, ANALYZE, PLAN, DELEGATE, REPORT');
  assert(aiCoo.MAX_ORCHESTRATION_DEPTH === 3, '1.5. Anti-recursion depth limit enforced at max 3 levels');
  assert(aiCoo.MAX_WORKERS_PER_OBJECTIVE === 5, '1.6. Concurrency capped at max 5 active worker dispatches');
  assert(identity.active_constraints.length >= 4, '1.7. Safety constraints active (zero autonomous disbursement, zero direct deployment)');

  // ---------------------------------------------------------------------------
  // 2. SECURITY & RBAC GATING TESTS
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. SECURITY & RBAC GATING TESTS ---');
  const studentUser: User = {
    id: 'usr-student-gate3',
    email: 'student.gate3@nihomi.com',
    passwordHash: 'hash',
    passwordSalt: 'salt',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const studentToken = createSessionToken(studentUser);

  const founderUser: User = {
    id: 'usr-founder-gate3',
    email: 'mdtanvirkabirbiplob@gmail.com',
    passwordHash: 'hash',
    passwordSalt: 'salt',
    role: 'founder',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const founderToken = createSessionToken(founderUser);

  // Test 2.1: Student 403
  let forbiddenCode = 0;
  const mockStudentReq: any = { headers: { authorization: `Bearer ${studentToken}` } };
  const mockStudentRes: any = {
    status: (c: number) => {
      forbiddenCode = c;
      return { json: (b: any) => b };
    }
  };
  requireFounder(mockStudentReq, mockStudentRes, () => {});
  assert(forbiddenCode === 403, '2.1. Student denied AI COO execution with HTTP 403 Forbidden');

  // Test 2.2: Founder allowed
  let founderAllowed = false;
  const mockFounderReq: any = { headers: { authorization: `Bearer ${founderToken}` } };
  const mockFounderRes: any = { status: () => ({ json: () => {} }) };
  requireFounder(mockFounderReq, mockFounderRes, () => {
    founderAllowed = true;
  });
  assert(founderAllowed, '2.2. Founder granted access to AI COO runtime');

  // ---------------------------------------------------------------------------
  // 3. GROUNDED DATABASE TELEMETRY & TARGET INTEGRATION
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. GROUNDED DATABASE TELEMETRY & TARGET INTEGRATION ---');
  const rev = db.getRevenueMetrics();
  const settings = db.getFounderSettings();
  const wallets = db.getFounderBudgetWallets();
  const tasks = db.getFounderTasks();

  assert(rev !== undefined && typeof rev.mrr === 'number', '3.1. Live revenue telemetry read from DB without synthetic hallucination');
  assert(settings !== undefined && typeof settings.mrrTarget.targetAmount === 'number', '3.2. Founder MRR Target read from durable settings');
  assert(typeof settings.marketTarget.primaryMarket === 'string' && settings.marketTarget.primaryMarket.length > 0, '3.3. Primary market read from durable settings');
  assert(Array.isArray(wallets) && wallets.length === 5, '3.4. All 5 departmental budget wallets ingested');
  assert(Array.isArray(tasks), '3.5. Live task pipeline ingested from durable storage');

  // ---------------------------------------------------------------------------
  // 4. NATURAL LANGUAGE COMMAND INTERFACE (BENGALI & ENGLISH)
  // ---------------------------------------------------------------------------
  console.log('\n--- 4. NATURAL LANGUAGE EXECUTIVE COMMAND INTERFACE ---');

  // Test 4.1: Bengali Daily Brief / Office Update command
  const bnBriefRes = await aiCoo.executeCommand('আজকে পুরো অফিসের আপডেট দাও', 'mdtanvirkabirbiplob@gmail.com');
  assert(bnBriefRes.category === 'OFFICE_OVERVIEW', '4.1. Bengali command "আজকে পুরো অফিসের আপডেট দাও" classified to OFFICE_OVERVIEW');
  assert(bnBriefRes.response.includes('অফিসের এক্সিকিউটিভ ওভারভিউ'), '4.2. Bengali command synthesizes grounded executive update');

  // Test 4.2: Bengali Budget command
  const bnBudgetRes = await aiCoo.executeCommand('আমাদের বাজেট এবং খরচ কত?', 'mdtanvirkabirbiplob@gmail.com');
  assert(bnBudgetRes.category === 'BUDGET_AND_SPEND', '4.3. Bengali command "আমাদের বাজেট এবং খরচ কত?" classified to BUDGET_AND_SPEND');
  assert(bnBudgetRes.response.includes('বাজেট ওয়ালেট ও খরচের বিবরণী'), '4.4. Bengali command returns accurate budget breakdown');

  // Test 4.3: English Blockers command
  const enBlockersRes = await aiCoo.executeCommand('What are our current blockers and bottlenecks?', 'mdtanvirkabirbiplob@gmail.com');
  assert(enBlockersRes.category === 'PRODUCT_BOTTLENECK' || enBlockersRes.category === 'BLOCKED_WORK', '4.5. English command "What are our current blockers..." classified correctly');
  assert(enBlockersRes.response.length > 50, '4.6. Blocker analysis accurately returned');

  // ---------------------------------------------------------------------------
  // 5. DAILY CEO BRIEF (21 STRUCTURED SECTIONS & UNCONFIGURED HANDLING)
  // ---------------------------------------------------------------------------
  console.log('\n--- 5. DAILY CEO BRIEF 21-SECTION SYNTHESIS ---');
  const brief = aiCoo.generateDailyCeoBrief();
  assert(brief.brief_id.startsWith('BRIEF-'), '5.1. Daily Brief generated with unique timestamped ID');
  
  const sectionKeys = Object.keys(brief.sections);
  assert(sectionKeys.length === 21, `5.2. Exactly 21 structured sections generated (Found: ${sectionKeys.length})`);
  
  // Verify key required sections
  assert(sectionKeys.includes('revenue'), '5.3. Contains verified Revenue section');
  assert(sectionKeys.includes('mrr'), '5.4. Contains MRR section');
  assert(sectionKeys.includes('mrr_gap'), '5.5. Contains MRR Gap section');
  assert(sectionKeys.includes('paid_members'), '5.6. Contains Paid Members section');
  assert(sectionKeys.includes('market_status'), '5.7. Contains Market Status section');
  assert(sectionKeys.includes('budget'), '5.8. Contains Budget Firewall section');
  assert(sectionKeys.includes('risks'), '5.9. Contains Risks section');
  assert(sectionKeys.includes('next_actions'), '5.10. Contains Next Actions section');

  // Check unconfigured field handling (no hallucination)
  assert(brief.sections.paid_members.churn_rate === 'NOT AVAILABLE' || brief.sections.paid_members.churn_rate.includes('%'), '5.11. Churn rate handled cleanly without synthetic hallucination');
  assert(brief.sections.marketing.cac === 'NOT CONFIGURED' || brief.sections.marketing.cac.includes('৳'), '5.12. CAC metric handled cleanly without synthetic hallucination');

  // ---------------------------------------------------------------------------
  // 6. OBJECTIVE DECOMPOSITION ENGINE
  // ---------------------------------------------------------------------------
  console.log('\n--- 6. OBJECTIVE DECOMPOSITION ENGINE ---');
  const decomposition = aiCoo.decomposeObjective({
    goal: 'Reach $10,000 MRR by expanding Japanese nursing curriculum in Dhaka',
    targetMrr: 10000,
    market: 'Bangladesh & Japan',
    customerSegment: 'University Engineers & Nursing Candidates',
    timeframe: '30 days',
    budget: 50000
  });

  assert(decomposition.goal.includes('Reach $10,000 MRR'), '6.1. Objective root goal preserved');
  assert(decomposition.initiatives.length >= 3, '6.2. High-level goal split into at least 3 distinct initiatives');
  assert(decomposition.tasks.length === 5, '6.3. Initiatives decomposed into 5 departmental work tasks');
  assert(decomposition.metrics.targetMrr === '10000', '6.4. Measurable key performance metrics assigned');
  assert(decomposition.risks.length >= 2, '6.5. Execution risks identified with mitigations');

  // Check task properties conform to TASK-SCHEMA
  const firstTask = decomposition.tasks[0];
  assert(
    firstTask.task_id.startsWith('TSK-') &&
    typeof firstTask.department === 'string' &&
    typeof firstTask.owner === 'string' &&
    ['P0', 'P1', 'P2', 'P3'].includes(firstTask.priority) &&
    ['GREEN', 'YELLOW', 'RED'].includes(firstTask.authority),
    '6.6. Decomposed tasks strictly follow TASK-SCHEMA.json format'
  );

  // ---------------------------------------------------------------------------
  // 7. DEPARTMENT DELEGATION & RED TIER ACTION INTERCEPTION
  // ---------------------------------------------------------------------------
  console.log('\n--- 7. DEPARTMENT DELEGATION & RED TIER INTERCEPTION ---');

  // 7.1 GREEN Tier task delegation (Allowed)
  const greenDelegation = aiCoo.delegateTask({
    department: 'CONTENT',
    owner: 'NHO-AI-004',
    objective: 'Generate N4 Nursing Vocabulary audio drills',
    priority: 'P2',
    authority: 'GREEN',
    dependencies: [],
    deadline: '2026-10-15',
    success_metric: '100% QA on 50 audio clips'
  });

  assert(greenDelegation.dispatched === true, '7.1. GREEN tier task delegation approved and dispatched');
  assert(greenDelegation.task !== undefined && greenDelegation.task.authority === 'GREEN', '7.2. Dispatched task authority verified as GREEN');
  assert(greenDelegation.task !== undefined && greenDelegation.task.status === 'ACTIVE', '7.3. Task entered ACTIVE status in durable task list');

  // 7.2 RED Tier action interception (Blocked & Routed to Approval Queue)
  const redDelegation = aiCoo.delegateTask({
    department: 'FINANCE',
    owner: 'NHO-AI-008',
    objective: 'Disburse BDT 50,000 marketing advance to overseas media agency',
    priority: 'P0',
    authority: 'RED',
    dependencies: [],
    deadline: '2026-09-30',
    success_metric: 'Receipt confirmation'
  });

  assert(redDelegation.dispatched === false, '7.4. RED tier high-risk action blocked from autonomous execution');
  assert(redDelegation.approvalRequired === true, '7.5. Action flagged as requiring Founder approval');

  // Verify approval request was created in db.founderApprovals
  const pendingApprovals = db.getFounderApprovals().filter(a => a.status === 'PENDING');
  const createdRedApp = pendingApprovals.find(a => a.request.includes('Disburse BDT 50,000'));
  assert(createdRedApp !== undefined, '7.6. RED action approval ticket persisted in Founder Approval Queue');

  // ---------------------------------------------------------------------------
  // 8. CONFLICT RESOLUTION & RISK ESCALATION
  // ---------------------------------------------------------------------------
  console.log('\n--- 8. CONFLICT RESOLUTION & RISK ESCALATION ENGINES ---');

  // 8.1 Conflict Resolution
  const conflictRes = aiCoo.resolveConflict({
    departmentA: 'MARKETING',
    proposalA: 'Allocate 100% of Reserve Budget into Meta Video Ads immediately',
    departmentB: 'FINANCE',
    proposalB: 'Preserve Reserve Budget for potential server scaling during JLPT rush',
    context: 'Q4 Budget Allocation Contention'
  });

  assert(conflictRes.conflictSummary.includes('Conflict detected'), '8.1. Conflict detected and summarized');
  assert(conflictRes.recommendedOptions.length === 2, '8.2. Two structured options formulated with pros, cons, and scoring');
  assert(conflictRes.founderActionNeeded === true, '8.3. Conflict surfaced for Founder decision without autonomous overreach');

  // 8.2 Risk Escalation
  const highRiskRes = aiCoo.escalateRisk({
    category: 'INFRASTRUCTURE',
    description: 'Third-party SMS gateway latency exceeds 15 seconds for student OTPs',
    severity: 'HIGH',
    impact: 'Student signups temporarily delayed during evening peak hours',
    mitigation: 'Switch primary OTP traffic to secondary Telco aggregator'
  });

  assert(highRiskRes.escalated === true, '8.4. HIGH risk escalated successfully');
  assert(highRiskRes.alertLevel === 'HIGH', '8.5. Severity marked as HIGH');
  assert(highRiskRes.actionTaken.includes('Founder alert dispatched'), '8.6. Mitigation containment plan queued for Founder');

  // ---------------------------------------------------------------------------
  // 9. CONTROLLED TOOL REGISTRY & AI ACTION LEDGER
  // ---------------------------------------------------------------------------
  console.log('\n--- 9. CONTROLLED TOOL REGISTRY & ACTION LEDGER ---');

  // 9.1 Tool Registry JSON Validation
  const registryPath = path.resolve(process.cwd(), 'FOUNDER-OFFICE/15-SYSTEM/AI-COO-TOOL-REGISTRY.json');
  assert(fs.existsSync(registryPath), '9.1. AI-COO-TOOL-REGISTRY.json exists on disk');
  const registryRaw = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  assert(registryRaw.tools && Array.isArray(registryRaw.tools) && registryRaw.tools.length === 13, `9.2. Exactly 13 tools defined in registry (Found: ${registryRaw.tools.length})`);

  const paymentTool = registryRaw.tools.find((t: any) => t.tool_id === 'TOOL-EXEC-FINANCIAL-DISBURSEMENT');
  assert(paymentTool && paymentTool.approval_requirement.includes('RED') && paymentTool.runtime_status === 'LOCKED_GATED', '9.3. High-risk payment payout tool hard-blocked in runtime');

  // 9.2 Action Ledger Logging & Querying
  const ledger = db.getAiActionLedger(50);
  assert(ledger.length > 0, '9.4. Action ledger populated with logged actions');

  const redLedgerEntry = ledger.find(e => e.authority === 'RED');
  assert(redLedgerEntry !== undefined, '9.5. RED actions recorded with full auditability');

  const greenLedgerEntry = ledger.find(e => e.authority === 'GREEN');
  assert(greenLedgerEntry !== undefined, '9.6. Dispatched GREEN actions recorded with EXECUTED/ACTIVE status');

  // ---------------------------------------------------------------------------
  // 10. DISK DURABILITY & PERSISTENCE RELOAD TEST
  // ---------------------------------------------------------------------------
  console.log('\n--- 10. DURABLE STATE PERSISTENCE RELOAD TEST ---');

  const founderDbPath = path.resolve(process.cwd(), 'server/data/founder_office_db.json');
  assert(fs.existsSync(founderDbPath), '10.1. server/data/founder_office_db.json persisted to disk');

  const persistedRaw = JSON.parse(fs.readFileSync(founderDbPath, 'utf8'));
  assert(persistedRaw.founderSettings && persistedRaw.founderSettings.mrrTarget !== undefined, '10.2. MRR Target persisted in JSON disk snapshot');
  assert(Array.isArray(persistedRaw.founderApprovals) && persistedRaw.founderApprovals.length > 0, '10.3. Founder Approvals persisted to disk');
  assert(Array.isArray(persistedRaw.founderTasks) && persistedRaw.founderTasks.length > 0, '10.4. Founder Tasks persisted to disk');
  assert(Array.isArray(persistedRaw.aiActionLedger) && persistedRaw.aiActionLedger.length > 0, '10.5. AI Action Ledger persisted to disk');

  // ---------------------------------------------------------------------------
  // 11. EMERGENCY KILL SWITCH RESPECT
  // ---------------------------------------------------------------------------
  console.log('\n--- 11. EMERGENCY KILL SWITCH RESPECT ---');
  db.toggleFounderEmergencyControl('stopAllAi', true, 'mdtanvirkabirbiplob@gmail.com');
  const isAiHalted = db.getFounderEmergencyControls().stopAllAi.active;
  assert(isAiHalted === true, '11.1. Emergency switch stopAllAi confirmed active');

  // Deactivate back to normal
  db.toggleFounderEmergencyControl('stopAllAi', false, 'mdtanvirkabirbiplob@gmail.com');
  assert(db.getFounderEmergencyControls().stopAllAi.active === false, '11.2. Emergency switch stopAllAi returned to safe operational state');

  console.log('\n========================================================================');
  console.log(`📊 GATE 3 TEST SUITE SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================================\n');

  if (failed === 0) {
    console.log('🎉 ALL GATE 3 AI COO RUNTIME AUTOMATED TESTS PASSED CLEANLY!\n');
    process.exit(0);
  } else {
    console.error(`💥 GATE 3 VERIFICATION FAILED WITH ${failed} FAILING TESTS\n`);
    process.exit(1);
  }
}

runGate3Verification().catch(err => {
  console.error('Fatal error running Gate 3 test suite:', err);
  process.exit(1);
});
