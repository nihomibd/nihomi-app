import { db } from '../db.js';
import { aiCostGuard, recordAiCostUsage } from '../middleware/aiCostGuard.js';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../authHelper.js';

// Simple assertion helper
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function createMockReqRes(userId: string): {
  req: AuthenticatedRequest;
  res: any;
  status: number;
  jsonBody: any;
  events: Record<string, Function[]>;
} {
  const events: Record<string, Function[]> = {};
  const mockRes: any = {
    statusCode: 200,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      this.jsonBody = data;
      this.emit('finish');
      return this;
    },
    on(event: string, listener: Function) {
      if (!events[event]) events[event] = [];
      events[event].push(listener);
    },
    removeListener(event: string, listener: Function) {
      if (events[event]) {
        events[event] = events[event].filter((l) => l !== listener);
      }
    },
    emit(event: string) {
      if (events[event]) {
        events[event].forEach((l) => l());
      }
    }
  };

  const mockReq: any = {
    user: { id: userId, email: `${userId}@nihomi.com`, role: 'user' }
  };

  return { req: mockReq, res: mockRes, status: 200, jsonBody: null, events };
}

async function runTests() {
  console.log('--- STARTING P1-01 DISTRIBUTED AI COST GUARD TESTS ---');

  const testUserId = `test-user-costguard-${Date.now()}`;
  
  // 1. Initial State Check
  const initialUsage = db.getAIUsageForCurrentMonth(testUserId);
  assert(initialUsage.aiCoachInteractions === 0, 'Initial AI coach interactions should be 0');
  console.log('✅ Test 1 Passed: Initial Usage Record initialized in database store.');

  // 2. First Request - Allowed
  const guard = aiCostGuard({ operationType: 'coach', estimatedTokens: 800 });
  const { req: req1, res: res1 } = createMockReqRes(testUserId);
  const track1 = { nextCalled: false };
  await guard(req1, res1, () => { track1.nextCalled = true; });

  assert(track1.nextCalled === true, 'First AI request should be allowed through cost guard');
  assert((req1 as any).aiCostGuard !== undefined, 'aiCostGuard metadata attached to request');
  console.log('✅ Test 2 Passed: Single request allowed & concurrency lock acquired.');

  // 3. Concurrent Request While Lock Active - Rejected with 429
  const { req: req2, res: res2 } = createMockReqRes(testUserId);
  const track2 = { nextCalled: false };
  await guard(req2, res2, () => { track2.nextCalled = true; });

  assert(track2.nextCalled === false, 'Concurrent request during active lock must be blocked');
  assert(res2.statusCode === 429, `Status should be 429 Too Many Requests, got ${res2.statusCode}`);
  assert(res2.jsonBody?.code === 'CONCURRENT_REQUEST_BLOCKED', 'Code should be CONCURRENT_REQUEST_BLOCKED');
  console.log('✅ Test 3 Passed: Concurrent burst request blocked with HTTP 429.');

  // Finish request 1 (simulating completed response)
  res1.json({ success: true });
  recordAiCostUsage(testUserId, 800, 'coach');

  // Verify lock released and count incremented in DB
  const usageAfter1 = db.getAIUsageForCurrentMonth(testUserId);
  assert(usageAfter1.aiCoachInteractions === 1, `Interactions should be 1, got ${usageAfter1.aiCoachInteractions}`);
  assert(!usageAfter1.activeLockUntil, 'Concurrency lock must be released after completion');
  console.log('✅ Test 4 Passed: Atomic usage recording and distributed lock release.');

  // 4. Fill Quota to Max (Free Plan has 10 limit)
  for (let i = 2; i <= 10; i++) {
    db.incrementAIUsage(testUserId, 1, 500);
  }
  const usageAtCap = db.getAIUsageForCurrentMonth(testUserId);
  assert(usageAtCap.aiCoachInteractions === 10, `Usage count should be 10, got ${usageAtCap.aiCoachInteractions}`);

  // 5. 11th Request - Strictly Rejected with 429 AI_QUOTA_EXCEEDED
  const { req: reqBlocked, res: resBlocked } = createMockReqRes(testUserId);
  const trackBlocked = { nextCalled: false };
  await guard(reqBlocked, resBlocked, () => { trackBlocked.nextCalled = true; });

  assert(trackBlocked.nextCalled === false, 'Request over monthly plan limit must be blocked');
  assert(resBlocked.statusCode === 429, `Expected 429 status on quota exceeded, got ${resBlocked.statusCode}`);
  assert(resBlocked.jsonBody?.code === 'AI_QUOTA_EXCEEDED', 'Expected AI_QUOTA_EXCEEDED code');
  assert(resBlocked.jsonBody?.quotaExceeded === true, 'Expected quotaExceeded: true flag');
  console.log('✅ Test 5 Passed: Strict Plan Limit rejection at boundary (10/10) with HTTP 429.');

  // 6. Fail-Secure Check (Unauthenticated or missing user)
  const { res: resAuth } = createMockReqRes('anon');
  const unauthReq: any = { user: null };
  const trackAuth = { nextCalled: false };
  await guard(unauthReq, resAuth, () => { trackAuth.nextCalled = true; });
  assert(trackAuth.nextCalled === false, 'Unauthenticated request must be blocked');
  assert(resAuth.statusCode === 401, 'Unauthenticated request receives 401');
  console.log('✅ Test 6 Passed: Fail-secure authentication guard verified.');

  console.log('--- ALL P1-01 DISTRIBUTED AI COST GUARD TESTS PASSED SUCCESSFULLY ---');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
