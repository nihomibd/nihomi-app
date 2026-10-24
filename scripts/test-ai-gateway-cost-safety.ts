// scripts/test-ai-gateway-cost-safety.ts
// Automated Test Suite for NIHOMI WP14: AI Gateway Resilient Fallback, Multi-Tier Token Quota & Cost-Safety Limiter
// Governed by Law 5 (Dignified Mistake Recovery), Law 6 (AI Independence), & Law 10 (Production Rigor & SRE Evidence)

import assert from 'assert';
import { db } from '../server/db.js';
import {
  processAICoachRequest,
  processSentenceDnaRequest,
  processVisionSenseiRequest,
  processExampleSentenceRequest,
  generateSenseiOfflineResponse
} from '../server/gemini.js';

console.log('========================================================================');
console.log('🤖 NIHOMI WP14: AI GATEWAY RESILIENCE, QUOTAS & COST-GUARD TEST SUITE');
console.log('========================================================================\n');

let totalTests = 0;
let passedTests = 0;
const failures: string[] = [];

async function runTest(name: string, fn: () => void | Promise<void>) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✅ [PASS] ${name}`);
  } catch (err: any) {
    failures.push(`${name}: ${err.message}`);
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function main() {
  const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

  // Seed test users with different subscription tiers
  const freeUserId = 'usr_ai_test_free';
  const starterUserId = 'usr_ai_test_starter';
  const proUserId = 'usr_ai_test_pro';

  if (!db.findUserById(freeUserId)) {
    db.createUser({ email: 'free_ai@nihomi.com', password: 'password123', displayName: 'Free Learner' });
    const user = (db.data.users || []).find((u) => u.email === 'free_ai@nihomi.com');
    if (user) user.id = freeUserId;
  }

  if (!db.findUserById(starterUserId)) {
    db.createUser({ email: 'starter_ai@nihomi.com', password: 'password123', displayName: 'Starter Learner' });
    const user = (db.data.users || []).find((u) => u.email === 'starter_ai@nihomi.com');
    if (user) {
      user.id = starterUserId;
      db.createSubscription({ userId: starterUserId, planId: 'starter', billingInterval: 'monthly', status: 'active' });
    }
  }

  if (!db.findUserById(proUserId)) {
    db.createUser({ email: 'pro_ai@nihomi.com', password: 'password123', displayName: 'Pro Learner' });
    const user = (db.data.users || []).find((u) => u.email === 'pro_ai@nihomi.com');
    if (user) {
      user.id = proUserId;
      db.createSubscription({ userId: proUserId, planId: 'pro', billingInterval: 'monthly', status: 'active' });
    }
  }

  // -------------------------------------------------------------
  // Test Group 1: Multi-Tier Quota & Token Cap Resolution
  // -------------------------------------------------------------
  console.log('[1/4] Testing Tier-Based AI Quotas & Monthly Token Caps...');

  await runTest('Free tier resolves 10 monthly queries & 12,000 token cap', () => {
    const decision = db.checkAndAcquireAiQuotaLock({ userId: freeUserId, featureKey: 'ai_coach_test' });
    assert.strictEqual(decision.planId, 'free');
    assert.strictEqual(decision.monthlyQuota, 10);
    assert.strictEqual(decision.tokenCap, 12000);
    if (decision.lockId) db.releaseAiConcurrencyLock(freeUserId, decision.lockId);
  });

  await runTest('Starter tier resolves 500 monthly queries & 600,000 token cap', () => {
    const decision = db.checkAndAcquireAiQuotaLock({ userId: starterUserId, featureKey: 'ai_coach_test' });
    assert.strictEqual(decision.planId, 'starter');
    assert.strictEqual(decision.monthlyQuota, 500);
    assert.strictEqual(decision.tokenCap, 600000);
    if (decision.lockId) db.releaseAiConcurrencyLock(starterUserId, decision.lockId);
  });

  await runTest('Pro tier resolves 1500 monthly queries & 1,800,000 token cap', () => {
    const decision = db.checkAndAcquireAiQuotaLock({ userId: proUserId, featureKey: 'ai_coach_test' });
    assert.strictEqual(decision.planId, 'pro');
    assert.strictEqual(decision.monthlyQuota, 1500);
    assert.strictEqual(decision.tokenCap, 1800000);
    if (decision.lockId) db.releaseAiConcurrencyLock(proUserId, decision.lockId);
  });

  // -------------------------------------------------------------
  // Test Group 2: Concurrency Locks & Sliding-Window Rate Limiting
  // -------------------------------------------------------------
  console.log('\n[2/4] Testing Distributed Concurrency Locks & Anti-Burst Protection...');

  const lockTestUserId = 'usr_concurrency_guard_test';
  if (!db.findUserById(lockTestUserId)) {
    db.createUser({ email: 'lock_test@nihomi.com', password: 'password123', displayName: 'Lock Learner' });
    const user = (db.data.users || []).find((u) => u.email === 'lock_test@nihomi.com');
    if (user) user.id = lockTestUserId;
  }

  let activeLockId = '';
  await runTest('First request successfully acquires single-inflight concurrency lock', () => {
    const res1 = db.checkAndAcquireAiQuotaLock({ userId: lockTestUserId, featureKey: 'ai_coach' });
    assert.strictEqual(res1.allowed, true, 'First call must be allowed');
    assert(res1.lockId !== undefined, 'lockId must be issued');
    activeLockId = res1.lockId!;
  });

  await runTest('Parallel concurrent call while lock is active is rejected with CONCURRENT_REQUEST_BLOCKED', () => {
    const res2 = db.checkAndAcquireAiQuotaLock({ userId: lockTestUserId, featureKey: 'ai_coach' });
    assert.strictEqual(res2.allowed, false, 'Parallel concurrent call must be blocked');
    assert.strictEqual(res2.reason, 'CONCURRENT_REQUEST_BLOCKED');
    assert(res2.retryAfterSeconds !== undefined && res2.retryAfterSeconds > 0);
  });

  await runTest('Releasing lock enables subsequent AI request immediately', () => {
    db.releaseAiConcurrencyLock(lockTestUserId, activeLockId);
    const res3 = db.checkAndAcquireAiQuotaLock({ userId: lockTestUserId, featureKey: 'ai_coach' });
    assert.strictEqual(res3.allowed, true, 'Call after lock release must be allowed');
    if (res3.lockId) db.releaseAiConcurrencyLock(lockTestUserId, res3.lockId);
  });

  await runTest('Exceeding per-minute sliding window rate limit triggers RATE_LIMIT_EXCEEDED', () => {
    const burstUserId = 'usr_burst_rate_test';
    if (!db.findUserById(burstUserId)) {
      db.createUser({ email: 'burst_test@nihomi.com', password: 'password123', displayName: 'Burst Learner' });
      const user = (db.data.users || []).find((u) => u.email === 'burst_test@nihomi.com');
      if (user) user.id = burstUserId;
    }

    // Set usage rate count to max (6 for free)
    const usage = db.getAIUsageForCurrentMonth(burstUserId, 'ai_burst');
    usage.rateMinuteWindow = Math.floor(Date.now() / 60000);
    usage.rateMinuteCount = 6;

    const burstDecision = db.checkAndAcquireAiQuotaLock({
      userId: burstUserId,
      featureKey: 'ai_burst',
      maxRatePerMinute: 6
    });

    assert.strictEqual(burstDecision.allowed, false, 'Exceeded rate limit must be blocked');
    assert.strictEqual(burstDecision.reason, 'RATE_LIMIT_EXCEEDED');
    assert(burstDecision.retryAfterSeconds !== undefined && burstDecision.retryAfterSeconds > 0);
  });

  // -------------------------------------------------------------
  // Test Group 3: Quota Exhaustion & Dignified Error Enforcement
  // -------------------------------------------------------------
  console.log('\n[3/4] Testing Quota & Token Budget Exhaustion Protection...');

  await runTest('Exhausted query quota is rejected with QUOTA_EXCEEDED and upgrade guidance', () => {
    const exhaustedUserId = 'usr_quota_exhausted_test';
    if (!db.findUserById(exhaustedUserId)) {
      db.createUser({ email: 'exhausted@nihomi.com', password: 'password123', displayName: 'Exhausted Learner' });
      const user = (db.data.users || []).find((u) => u.email === 'exhausted@nihomi.com');
      if (user) user.id = exhaustedUserId;
    }

    // Set usage to 10/10
    const usage = db.getAIUsageForCurrentMonth(exhaustedUserId, 'ai_coach');
    usage.aiCoachInteractions = 10;

    const res = db.checkAndAcquireAiQuotaLock({ userId: exhaustedUserId, featureKey: 'ai_coach' });
    assert.strictEqual(res.allowed, false, 'Exhausted quota must be blocked');
    assert.strictEqual(res.reason, 'QUOTA_EXCEEDED');
    assert(res.error?.includes('Monthly AI Sensei query quota reached'), 'Error must contain clear explanation');
  });

  await runTest('Exhausted token bandwidth cap is rejected with TOKEN_CAP_REACHED', () => {
    const tokenCapUserId = 'usr_tokencap_test';
    if (!db.findUserById(tokenCapUserId)) {
      db.createUser({ email: 'tokencap@nihomi.com', password: 'password123', displayName: 'TokenCap Learner' });
      const user = (db.data.users || []).find((u) => u.email === 'tokencap@nihomi.com');
      if (user) user.id = tokenCapUserId;
    }

    const usage = db.getAIUsageForCurrentMonth(tokenCapUserId, 'ai_coach');
    usage.tokensUsed = 15000; // Cap is 12,000 for free

    const res = db.checkAndAcquireAiQuotaLock({ userId: tokenCapUserId, featureKey: 'ai_coach' });
    assert.strictEqual(res.allowed, false, 'Exceeded token cap must be blocked');
    assert.strictEqual(res.reason, 'TOKEN_CAP_REACHED');
  });

  // -------------------------------------------------------------
  // Test Group 4: Fail-Safe Offline Curriculum Fallback Engine
  // -------------------------------------------------------------
  console.log('\n[4/4] Testing Fail-Safe Offline Curriculum Fallback Engine...');

  await runTest('generateSenseiOfflineResponse delivers authentic Bengali pedagogical reply during offline state', () => {
    const res = generateSenseiOfflineResponse({
      message: 'Konnichiwa! How do I use arigatou?',
      userLevel: 'N5',
      mode: 'conversation'
    });

    assert(res !== null, 'Response should not be null');
    assert(typeof res.reply === 'string' && res.reply.length > 0, 'Reply should be a non-empty string');
    assert(typeof res.bengaliTranslation === 'string' && res.bengaliTranslation.length > 0, 'Bengali translation must be provided');
    assert(typeof res.romaji === 'string' && res.romaji.length > 0, 'Romaji pronunciation must be provided');
  });

  await runTest('processAICoachRequest delivers authentic pedagogical reply without 500 crashes', async () => {
    const res = await processAICoachRequest({
      message: 'Konnichiwa! How do I use arigatou?',
      userLevel: 'N5',
      mode: 'conversation'
    });

    assert(res !== null, 'Response should not be null');
    assert(typeof res.reply === 'string' && res.reply.length > 0, 'Reply should be a non-empty string');
    if (res.fallbackUsed) {
      assert(typeof res.bengaliTranslation === 'string' && res.bengaliTranslation.length > 0);
    } else {
      assert(res.modelUsed !== undefined, 'Live model should be identified');
    }
  });

  await runTest('processSentenceDnaRequest delivers valid JSON breakdown without 500 crashes', async () => {
    const dna = await processSentenceDnaRequest('これは本です。', 'N5');
    assert(dna !== null, 'DNA response must not be null');
    assert.strictEqual(dna.japanese, 'これは本です。');
    assert(typeof dna.banglaMeaning === 'string' && dna.banglaMeaning.length > 0);
    assert(Array.isArray(dna.particlesUsed), 'particlesUsed must be an array');
  });

  await runTest('processVisionSenseiRequest delivers structured OCR breakdown without 500 crashes', async () => {
    const vision = await processVisionSenseiRequest({
      imageBase64: 'fake_base64_data_for_test',
      mimeType: 'image/png',
      userLevel: 'N5'
    });

    assert(vision !== null, 'Vision response must not be null');
    assert(typeof vision.extractedJapanese === 'string');
    assert(typeof vision.bengaliMeaning === 'string');
    assert(Array.isArray(vision.vocabularyList));
  });

  await runTest('processExampleSentenceRequest delivers valid example sentence without 500 crashes', async () => {
    const example = await processExampleSentenceRequest('本', 'ほん', 'N5');
    assert(example !== null, 'Example response must not be null');
    assert.strictEqual(example.word, '本');
    assert(typeof example.sentenceJa === 'string' && example.sentenceJa.length > 0);
    assert(typeof example.meaningBn === 'string' && example.meaningBn.length > 0);
  });

  await runTest('Live POST /api/ai/coach rejects empty message with HTTP 400', async () => {
    const res = await fetch(`${BASE_URL}/api/ai/coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.strictEqual(res.status, 400, 'Empty message must return 400 Bad Request');
  });

  // -------------------------------------------------------------
  // Final Scorecard
  // -------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`🏁 TEST EXECUTION COMPLETE: ${passedTests}/${totalTests} PASSED`);
  console.log('========================================================================');

  if (failures.length > 0) {
    console.error(`\n❌ ${failures.length} Test(s) Failed:`);
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exitCode = 1;
  } else {
    console.log('🎉 ALL AI GATEWAY RESILIENCE & COST-GUARD TESTS PASSED (100%)!\n');
    process.exitCode = 0;
  }
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exitCode = 1;
});
