import { createSessionToken, getUserFromToken, signStatelessJwt, verifyStatelessJwt, requireAuth, requireAdmin } from '../authHelper.js';
import { db, hashPassword } from '../db.js';
import { User } from '../types.js';

async function runAuditTests() {
  console.log('===============================================================');
  console.log('🔬 NIHOMI — P0-DB-AUTH-01 AUTOMATED VERIFICATION TEST SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // TEST 1: Stateless JWT generation and structure
  const testStudent: User = {
    id: 'usr-test-student-99',
    email: 'test.student@nihomi.com',
    passwordHash: 'hash',
    passwordSalt: 'salt',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const token = createSessionToken(testStudent);
  assert(typeof token === 'string' && token.split('.').length === 3, '1. Token is a standard 3-part JWT');

  // TEST 2: Stateless Token Verification without memory dependency
  const verifiedPayload = verifyStatelessJwt(token);
  assert(
    verifiedPayload !== null &&
    verifiedPayload.userId === testStudent.id &&
    verifiedPayload.email === testStudent.email &&
    verifiedPayload.role === testStudent.role,
    '2. Stateless signature and claims verified accurately'
  );

  // TEST 3: Multi-Instance / Restart Resilience (New token verification)
  const resolvedUser = getUserFromToken(token);
  assert(
    resolvedUser !== null && resolvedUser.id === testStudent.id && resolvedUser.email === testStudent.email,
    '3. Token resolves User identity statelessly'
  );

  // TEST 4: Tampered Token Detection (Cryptographic Integrity)
  const parts = token.split('.');
  const tamperedSig = parts[2].slice(0, -2) + 'XX';
  const tamperedToken = `${parts[0]}.${parts[1]}.${tamperedSig}`;
  const tamperedResult = getUserFromToken(tamperedToken);
  assert(tamperedResult === null, '4. Tampered token signature is rejected immediately (HTTP 401 equivalent)');

  // TEST 5: Tampered Payload Detection
  const fakePayload = Buffer.from(JSON.stringify({ userId: 'usr-admin-01', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url');
  const forgedToken = `${parts[0]}.${fakePayload}.${parts[2]}`;
  const forgedResult = getUserFromToken(forgedToken);
  assert(forgedResult === null, '5. Forged role escalation payload is rejected');

  // TEST 6: Expired Token Rejection
  const expiredToken = signStatelessJwt({ userId: testStudent.id, email: testStudent.email, role: testStudent.role }, -10); // expired 10 seconds ago
  const expiredResult = getUserFromToken(expiredToken);
  assert(expiredResult === null, '6. Expired token is rejected');

  // TEST 7: Missing / Malformed Token Handling
  assert(getUserFromToken('') === null, '7a. Empty string token rejected');
  assert(getUserFromToken(undefined) === null, '7b. Undefined token rejected');
  assert(getUserFromToken('invalid.token') === null, '7c. Non-3-part token rejected');

  // TEST 8: Bearer prefix stripping
  const bearerToken = `Bearer ${token}`;
  const bearerResult = getUserFromToken(bearerToken);
  assert(bearerResult !== null && bearerResult.id === testStudent.id, '8. Bearer header prefix stripped and verified');

  // TEST 9: Admin Role Gate Protection
  const adminUser: User = {
    id: 'usr-test-admin-99',
    email: 'admin.verify@nihomi.com',
    passwordHash: 'hash',
    passwordSalt: 'salt',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const adminToken = createSessionToken(adminUser);

  let adminReqPassed = false;
  let adminReqFailed = false;

  const mockAdminReq: any = { headers: { authorization: `Bearer ${adminToken}` }, query: {} };
  const mockAdminRes: any = { status: () => ({ json: () => { adminReqFailed = true; } }) };
  requireAdmin(mockAdminReq, mockAdminRes, () => { adminReqPassed = true; });
  assert(adminReqPassed && !adminReqFailed, '9. Admin user passes requireAdmin gate');

  let studentAdminReqPassed = false;
  let studentAdminReqFailed = false;
  const mockStudentReq: any = { headers: { authorization: `Bearer ${token}` }, query: {} };
  const mockStudentRes: any = { status: (code: number) => ({ json: () => { if (code === 403) studentAdminReqFailed = true; } }) };
  requireAdmin(mockStudentReq, mockStudentRes, () => { studentAdminReqPassed = true; });
  assert(!studentAdminReqPassed && studentAdminReqFailed, '10. Student role is blocked with 403 from requireAdmin gate');

  // TEST 11: Database Persistence & User Isolation
  const created = db.createUser({
    email: `student.iso.${Date.now()}@nihomi.com`,
    password: 'password123',
    displayName: 'Isolated Student',
    targetLevel: 'N5'
  });
  assert(!!created.user.id && created.profile.userId === created.user.id, '11. User, Profile, Progress persisted atomically');

  const loadedUser = db.findUserById(created.user.id);
  assert(loadedUser?.email === created.user.email, '12. Persistent lookup by ID succeeds');

  console.log('\n===============================================================');
  console.log(`🎯 AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAuditTests().catch((e) => {
  console.error('Fatal error during test run:', e);
  process.exit(1);
});
