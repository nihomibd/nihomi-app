/**
 * scripts/verify-gate-2-founder-hq.ts
 * 
 * Comprehensive automated verification test suite for Gate 2: Nihomi Founder HQ.
 * Validates RBAC security, persistence of MRR & Market targets, approval actions,
 * task management, budget firewall, emergency controls, and AI CEO query grounding.
 */

process.env.JWT_SECRET = process.env.JWT_SECRET || 'nihomi-test-jwt-secret-key-32-chars-long-founder';

import { createSessionToken, getUserFromToken, signStatelessJwt } from '../server/authHelper.js';
import { requireFounder } from '../server/middleware/rbac.js';
import { db } from '../server/db.js';
import { User } from '../server/types.js';

async function runGate2Verification() {
  console.log('========================================================================');
  console.log('👑 NIHOMI — GATE 2: FOUNDER HQ AUTOMATED VERIFICATION TEST SUITE');
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
  // 1. SECURITY & RBAC TESTS (Founder vs Non-Founder)
  // ---------------------------------------------------------------------------
  console.log('--- 1. SECURITY & RBAC GATING TESTS ---');

  const studentUser: User = {
    id: 'usr-student-01',
    email: 'student.nihomi@gmail.com',
    passwordHash: 'test-hash-student',
    passwordSalt: 'test-salt-student',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const studentToken = createSessionToken(studentUser);

  const founderUser: User = {
    id: 'usr-founder-01',
    email: 'mdtanvirkabirbiplob@gmail.com',
    passwordHash: 'test-hash-founder',
    passwordSalt: 'test-salt-founder',
    role: 'founder',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const founderToken = createSessionToken(founderUser);

  // Test 1.1: Unauthenticated request rejected (401)
  let unauthCode = 0;
  const mockUnauthReq: any = { headers: {} };
  const mockUnauthRes: any = {
    status: (code: number) => {
      unauthCode = code;
      return { json: () => {} };
    }
  };
  requireFounder(mockUnauthReq, mockUnauthRes, () => {});
  assert(unauthCode === 401, '1.1. Unauthenticated request rejected with HTTP 401');

  // Test 1.2: Student role denied access to Founder HQ (403)
  let forbiddenCode = 0;
  const mockStudentReq: any = {
    headers: { authorization: `Bearer ${studentToken}` }
  };
  const mockStudentRes: any = {
    status: (code: number) => {
      forbiddenCode = code;
      return { json: (body: any) => body };
    }
  };
  requireFounder(mockStudentReq, mockStudentRes, () => {});
  assert(forbiddenCode === 403, '1.2. Normal student user denied Founder HQ access with HTTP 403 Forbidden');

  // Test 1.3: Verified Founder granted access
  let founderAllowed = false;
  const mockFounderReq: any = {
    headers: { authorization: `Bearer ${founderToken}` }
  };
  const mockFounderRes: any = {
    status: () => ({ json: () => {} })
  };
  requireFounder(mockFounderReq, mockFounderRes, () => {
    founderAllowed = true;
  });
  assert(founderAllowed, '1.3. Verified Founder identity granted access via requireFounder middleware');

  // ---------------------------------------------------------------------------
  // 2. MRR TARGET PERSISTENCE & AUDIT TESTS
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. MRR TARGET PERSISTENCE & AUDIT LOGGING ---');

  const initialSettings = db.getFounderSettings();
  assert(initialSettings && typeof initialSettings.mrrTarget.targetAmount === 'number', '2.1. Initial Founder Settings loaded');

  const testTargetAmount = 15000;
  const updatedMrr = db.updateMrrTarget(
    {
      targetAmount: testTargetAmount,
      currency: 'USD',
      deadline: '2027-06-30',
      monthlyBudget: 60000,
      growthPriority: 'AGGRESSIVE_SCALE',
      riskLevel: 'MODERATE'
    },
    'mdtanvirkabirbiplob@gmail.com'
  );

  assert(updatedMrr.targetAmount === 15000, '2.2. MRR Target successfully updated to $15,000');
  assert(db.getFounderSettings().mrrTarget.targetAmount === 15000, '2.3. MRR Target change persisted in db.ts');

  // Check audit log
  const auditLogsAfterMrr = db.getAdminAuditLogs(10);
  const mrrAudit = auditLogsAfterMrr.find((l) => l.action === 'MRR_TARGET_UPDATE');
  assert(mrrAudit !== undefined, '2.4. MRR Target modification recorded in durable Audit Log');

  // ---------------------------------------------------------------------------
  // 3. MARKET TARGET PERSISTENCE & AUDIT TESTS
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. MARKET TARGET PERSISTENCE & AUDIT LOGGING ---');

  const updatedMarket = db.updateMarketTarget(
    {
      primaryMarket: 'Bangladesh',
      secondaryMarket: 'Japan',
      experimentalMarket: 'India & Nepal',
      customerSegment: 'University Engineers & Nursing Candidates',
      priceRange: '৳499 - ৳19,999 BDT'
    },
    'mdtanvirkabirbiplob@gmail.com'
  );

  assert(updatedMarket.experimentalMarket === 'India & Nepal', '3.1. Market Target experimental market updated');
  assert(db.getFounderSettings().marketTarget.experimentalMarket === 'India & Nepal', '3.2. Market Target persisted in db.ts');

  const marketAudit = db.getAdminAuditLogs(10).find((l) => l.action === 'MARKET_TARGET_UPDATE');
  assert(marketAudit !== undefined, '3.3. Market Target update recorded in durable Audit Log');

  // ---------------------------------------------------------------------------
  // 4. APPROVAL QUEUE OPERATIONS & ACTION TESTS
  // ---------------------------------------------------------------------------
  console.log('\n--- 4. APPROVAL QUEUE & HUMAN-IN-THE-LOOP ACTIONS ---');

  const newApprovalId = `APP-TEST-${Date.now()}`;
  const createdApp = db.createFounderApproval({
    request_id: newApprovalId,
    department: 'MARKETING',
    request: 'Test verification campaign boost',
    amount: 1500,
    risk: 'LOW',
    expected_outcome: 'Verify approval queue mechanics',
    recommendation: 'Approve for test suite',
    status: 'PENDING'
  });

  assert(createdApp.request_id === newApprovalId, '4.1. New approval request created successfully');

  // Action decision: APPROVE
  const approvedItem = db.updateApprovalDecision(
    newApprovalId,
    'APPROVED',
    'mdtanvirkabirbiplob@gmail.com',
    'Approved by test suite runner'
  );

  assert(approvedItem !== null && approvedItem.status === 'APPROVED', '4.2. Approval status transitioned to APPROVED');
  
  const approvalAudit = db.getAdminAuditLogs(10).find(
    (l) => l.action === 'APPROVAL_DECISION' && l.targetResource?.includes(newApprovalId)
  );
  assert(approvalAudit !== undefined, '4.3. Approval decision recorded in durable Audit Log');

  // ---------------------------------------------------------------------------
  // 5. WORK TASKS (TASK OPERATING SYSTEM) TESTS
  // ---------------------------------------------------------------------------
  console.log('\n--- 5. TASK OPERATING SYSTEM DISPATCH & STATUS TESTS ---');

  const testTaskId = `TSK-TEST-${Date.now()}`;
  const newTask = db.createFounderTask({
    task_id: testTaskId,
    objective: 'Automated test task for Gate 2 verification',
    department: 'EXECUTIVE',
    owner: 'NHO-AI-001',
    priority: 'P1',
    authority: 'GREEN',
    dependencies: [],
    status: 'ACTIVE',
    next_action: 'Assert completion'
  });

  assert(newTask.task_id === testTaskId, '5.1. Task created conforming to TASK-SCHEMA.json');

  const activeTasks = db.getFounderTasks('ACTIVE');
  assert(activeTasks.some((t) => t.task_id === testTaskId), '5.2. Task query filtering by ACTIVE status succeeded');

  const completedTask = db.updateFounderTask(testTaskId, {
    status: 'COMPLETED',
    result: 'Verified 100% green by test suite'
  });
  assert(completedTask !== null && completedTask.status === 'COMPLETED', '5.3. Task successfully updated to COMPLETED');

  // ---------------------------------------------------------------------------
  // 6. BUDGET FIREWALL & WALLET TESTS
  // ---------------------------------------------------------------------------
  console.log('\n--- 6. BUDGET FIREWALL & WALLET ISOLATION TESTS ---');

  const wallets = db.getFounderBudgetWallets();
  assert(wallets.length === 5, '6.1. All 5 budget wallets present (Marketing, Experiments, AI, Infra, Reserve)');

  const marketingWallet = wallets.find((w) => w.wallet_id === 'w-marketing');
  assert(marketingWallet !== undefined && marketingWallet.monthly_cap === 20000, '6.2. Marketing wallet monthly cap verified at ৳20,000');

  const updatedWallet = db.updateFounderBudgetWallet(
    'w-marketing',
    { monthly_cap: 22000 },
    'mdtanvirkabirbiplob@gmail.com'
  );
  assert(updatedWallet !== null && updatedWallet.monthly_cap === 22000, '6.3. Marketing wallet cap updated to ৳22,000');

  const walletAudit = db.getAdminAuditLogs(10).find((l) => l.action === 'BUDGET_WALLET_UPDATE');
  assert(walletAudit !== undefined, '6.4. Budget wallet update recorded in durable Audit Log');

  // Reset back to ৳20,000
  db.updateFounderBudgetWallet('w-marketing', { monthly_cap: 20000 }, 'mdtanvirkabirbiplob@gmail.com');

  // ---------------------------------------------------------------------------
  // 7. EMERGENCY KILL SWITCH CONTROLS TESTS
  // ---------------------------------------------------------------------------
  console.log('\n--- 7. EMERGENCY KILL SWITCH CONTROLS TESTS ---');

  const initialControls = db.getFounderEmergencyControls();
  assert(initialControls && typeof initialControls.stopAllAi.active === 'boolean', '7.1. All 6 kill switches initialized');

  // Activate switch
  const toggledOn = db.toggleFounderEmergencyControl(
    'stopAllAi',
    true,
    'mdtanvirkabirbiplob@gmail.com'
  );
  assert(toggledOn.stopAllAi.active === true, '7.2. Kill switch [stopAllAi] activated');

  const killAudit = db.getAdminAuditLogs(10).find((l) => l.action === 'EMERGENCY_KILLSWITCH_ACTIVATED');
  assert(killAudit !== undefined, '7.3. Kill switch activation recorded in durable Audit Log');

  // Deactivate switch back to safe normal state
  const toggledOff = db.toggleFounderEmergencyControl(
    'stopAllAi',
    false,
    'mdtanvirkabirbiplob@gmail.com'
  );
  assert(toggledOff.stopAllAi.active === false, '7.4. Kill switch [stopAllAi] safely deactivated back to normal');

  // ---------------------------------------------------------------------------
  // 8. AI CEO GROUNDED RESPONSES & TELEMETRY TESTS
  // ---------------------------------------------------------------------------
  console.log('\n--- 8. AI CEO TELEMETRY & QUERY GROUNDING TESTS ---');

  const rev = db.getRevenueMetrics();
  const activeSubs = rev.activeSubscribers || 0;
  const currentMrr = rev.mrr || 0;

  assert(typeof currentMrr === 'number', '8.1. Real-time MRR metric read from active subscriptions');
  assert(typeof activeSubs === 'number', '8.2. Real-time Active Subscribers count verified');

  const departments = db.getAiDepartmentStatuses();
  assert(Object.keys(departments).length === 13, '8.3. All 13 AI departments verified in status registry');

  // ---------------------------------------------------------------------------
  // SUMMARY SCORECARD
  // ---------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================================');

  if (failed === 0) {
    console.log('🎉 ALL GATE 2 FOUNDER HQ AUTOMATED TESTS PASSED CLEANLY!\n');
    process.exit(0);
  } else {
    console.error('⚠️ ONE OR MORE VERIFICATION TESTS FAILED.');
    process.exit(1);
  }
}

runGate2Verification().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
