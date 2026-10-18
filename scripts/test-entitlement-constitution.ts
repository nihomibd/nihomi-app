import assert from 'node:assert/strict';
import {
  CANONICAL_ENTITLEMENT_TIERS,
  ENTITLEMENT_REGISTRY,
  evaluateEntitlement,
  evaluateLessonAccess,
  isWorksheetFree,
  isResumeBuilderActionFree,
  CANONICAL_10_PRACTICE_SHEETS,
  CV_BUILDER_LEGAL_DISCLAIMER_BN,
  type EntitlementSubject,
} from '../src/core/entitlements/entitlementConstitution.js';
import { evaluateAccess as serverEvaluateAccess } from '../server/services/entitlements.js';

console.log('================================================================');
console.log('🧪 NIHOMI CANONICAL ENTITLEMENT CONSTITUTION VERIFICATION SUITE');
console.log('================================================================');

let passedChecks = 0;

// Test Subjects
const guestSubject: EntitlementSubject = {
  tier: 'guest',
  isAuthenticated: false,
};

const freeUserSubject: EntitlementSubject = {
  userId: 'usr_test_free',
  tier: 'free',
  isAuthenticated: true,
};

const starterUserSubject: EntitlementSubject = {
  userId: 'usr_test_starter',
  tier: 'starter',
  isAuthenticated: true,
};

const proUserSubject: EntitlementSubject = {
  userId: 'usr_test_pro',
  tier: 'pro',
  isAuthenticated: true,
};

const japanReadyUserSubject: EntitlementSubject = {
  userId: 'usr_test_jr',
  tier: 'japan_ready',
  isAuthenticated: true,
};

console.log('\n[1/5] Verifying Free Tier Canonical Entitlements...');

// 1. Onboarding & Placement is accessible to guest & free
assert.equal(evaluateEntitlement(guestSubject, 'onboarding_placement').granted, true);
assert.equal(evaluateEntitlement(freeUserSubject, 'onboarding_placement').granted, true);
passedChecks += 2;

// 2. Kana Canvas is accessible to free users
assert.equal(evaluateEntitlement(freeUserSubject, 'kana_canvas').granted, true);
passedChecks++;

// 3. JLPT N5 Lessons 1 to 5 are strictly FREE
for (let lesson = 1; lesson <= 5; lesson++) {
  const result = evaluateLessonAccess(freeUserSubject, lesson);
  assert.equal(
    result.granted,
    true,
    `Expected N5 Lesson ${lesson} to be FREE, got granted=${result.granted}`
  );
  passedChecks++;
}

// 4. JLPT N5 Lesson 6 is strictly GATED for free users
const lesson6FreeResult = evaluateLessonAccess(freeUserSubject, 6);
assert.equal(
  lesson6FreeResult.granted,
  false,
  `Expected N5 Lesson 6 to be GATED for free user`
);
assert.equal(lesson6FreeResult.requiredTier, 'STARTER');
passedChecks += 2;

// 5. All 10 Practice Sheets are strictly FREE
assert.equal(CANONICAL_10_PRACTICE_SHEETS.length, 10);
for (const sheetKey of CANONICAL_10_PRACTICE_SHEETS) {
  assert.equal(
    isWorksheetFree(sheetKey),
    true,
    `Worksheet ${sheetKey} must be marked FREE`
  );
  passedChecks++;
}

// 6. JIS Resume Builder actions are strictly FREE
const cvActions = ['create', 'edit', 'preview', 'export_pdf'] as const;
for (const act of cvActions) {
  assert.equal(
    isResumeBuilderActionFree(act),
    true,
    `CV action ${act} must be FREE`
  );
  passedChecks++;
}

// Verify CV Legal disclaimer exists and is in Bengali
assert.ok(
  CV_BUILDER_LEGAL_DISCLAIMER_BN.includes('নিহোমি রিজিউমে বিল্ডার একটি তথ্য ও ফরম্যাটিং সহায়ক ফ্রি টুল'),
  'CV builder legal disclaimer text must be exact'
);
passedChecks++;

console.log(`✓ Free tier guarantees verified (${passedChecks} checks passed).`);

console.log('\n[2/5] Verifying Paid Tier Progression & Boundaries...');

// Starter can access N5 Lesson 6–25 and N4
for (let lesson = 6; lesson <= 25; lesson += 5) {
  const res = evaluateLessonAccess(starterUserSubject, lesson);
  assert.equal(res.granted, true, `Starter must access Lesson ${lesson}`);
  passedChecks++;
}
assert.equal(evaluateEntitlement(starterUserSubject, 'n4_curriculum').granted, true);
assert.equal(evaluateEntitlement(starterUserSubject, 'n3_curriculum').granted, false);
passedChecks += 2;

// Pro can access N3, full mocks, and Voice Twin Lab
assert.equal(evaluateEntitlement(proUserSubject, 'n3_curriculum').granted, true);
assert.equal(evaluateEntitlement(proUserSubject, 'jlpt_full_mocks').granted, true);
assert.equal(evaluateEntitlement(proUserSubject, 'voice_twin_interview_lab').granted, true);
assert.equal(evaluateEntitlement(proUserSubject, 'japan_readiness_track').granted, false);
passedChecks += 4;

// Japan Ready accesses Japan Readiness Track
assert.equal(evaluateEntitlement(japanReadyUserSubject, 'japan_readiness_track').granted, true);
passedChecks++;

console.log(`✓ Paid tier progression verified (${passedChecks} total checks passed).`);

console.log('\n[3/5] Verifying Server-Side Entitlement Alignment...');

// Test server-side evaluateAccess for learning lessons
const serverLesson1 = serverEvaluateAccess(
  { id: 'usr_free', role: 'student' } as any,
  'n5_basic',
  { lessonNumber: 1 }
);
assert.equal(serverLesson1.allowed, true, 'Server must allow free user to access Lesson 1');

const serverLesson5 = serverEvaluateAccess(
  { id: 'usr_free', role: 'student' } as any,
  'n5_basic',
  { lessonNumber: 5 }
);
assert.equal(serverLesson5.allowed, true, 'Server must allow free user to access Lesson 5');

const serverLesson6 = serverEvaluateAccess(
  { id: 'usr_free', role: 'student' } as any,
  'n5_basic',
  { lessonNumber: 6 }
);
assert.equal(serverLesson6.allowed, false, 'Server must deny free user from Lesson 6');
assert.equal(serverLesson6.requiredTier, 'STARTER');
passedChecks += 4;

console.log(`✓ Server-side entitlement alignment verified (${passedChecks} total checks passed).`);

console.log('\n[4/5] Verifying 12-Price Matrix Consistency in Entitlement Constitution...');

const tiers = ['starter', 'pro', 'japan_ready'] as const;
const intervals = ['monthly', 'quarterly', 'half_yearly', 'yearly'] as const;

const EXPECTED_PRICES: Record<string, Record<string, number>> = {
  starter: { monthly: 990, quarterly: 2820, half_yearly: 5350, yearly: 10100 },
  pro: { monthly: 1990, quarterly: 5670, half_yearly: 10750, yearly: 20300 },
  japan_ready: { monthly: 3990, quarterly: 11370, half_yearly: 21550, yearly: 40700 },
};

for (const t of tiers) {
  const tierDef = CANONICAL_ENTITLEMENT_TIERS[t];
  assert.ok(tierDef, `Tier definition must exist for ${t}`);
  for (const iv of intervals) {
    const expected = EXPECTED_PRICES[t][iv];
    const actual = tierDef.prices[iv];
    assert.equal(
      actual,
      expected,
      `Price mismatch for ${t} [${iv}]: expected ${expected}, got ${actual}`
    );
    passedChecks++;
  }
}

console.log(`✓ Canonical 12-price matrix verified (${passedChecks} total checks passed).`);

console.log('\n[5/5] Verifying Entitlement Feature Registry Integrity...');

const registeredKeys = Object.keys(ENTITLEMENT_REGISTRY);
assert.ok(registeredKeys.length >= 10, 'Registry must have at least 10 core features');
for (const key of registeredKeys) {
  const feat = ENTITLEMENT_REGISTRY[key];
  assert.ok(feat.id, `Feature ${key} must have id`);
  assert.ok(feat.minimumTier, `Feature ${key} must specify minimumTier`);
  assert.ok(feat.nameBn, `Feature ${key} must specify Bangla name`);
  assert.ok(feat.nameEn, `Feature ${key} must specify English name`);
  passedChecks++;
}

console.log(`✓ Feature registry integrity verified (${passedChecks} total checks passed).`);

console.log('================================================================');
console.log(`🎉 ALL ${passedChecks} ENTITLEMENT CONSTITUTION CHECKS PASSED PERFECTLY!`);
console.log('================================================================');
