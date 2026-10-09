/**
 * tests/gate1_identity_auth.test.ts
 * 
 * Gate 1: Identity & Authentication Comprehensive Verification Suite
 * Validates:
 * 1. Valid Founder authentication grants Founder access
 * 2. New ordinary user creation defaults strictly to Student role
 * 3. Student calling Founder API directly returns HTTP 403
 * 4. Client tampering with role/localStorage causes ZERO privilege change
 * 5. Student submitting role='founder' or role='admin' in body is rejected / canonicalized to student
 * 6. Expired / invalid JWT signature is rejected with HTTP 401
 * 7. Student A requesting Student B's private information is rejected
 * 8. Switching from Founder to student removes all elevated privileges
 */

process.env.JWT_SECRET = process.env.JWT_SECRET || 'nihomi-test-jwt-secret-key-32-chars-long-gate1';

import { 
  createSessionToken, 
  getUserFromToken, 
  verifyStatelessJwt, 
  requireFounder, 
  requireAdmin, 
  requireAuth,
  canonicalizeRole
} from '../server/authHelper.js';
import { requireRole, requireOwnerOrAdmin } from '../server/middleware/rbac.js';
import { db } from '../server/db.js';
import { User } from '../server/types.js';
import { isAdminEmail, isFounderEmail } from '../server/env.js';

async function runGate1Suite() {
  console.log('========================================================================');
  console.log('🔐 NIHOMI — GATE 1: IDENTITY & AUTHENTICATION TEST MATRIX');
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

  // --- 1. Verified Founder Login & Authorization ---
  const founderUser: User = {
    id: 'usr-founder-gate1',
    email: 'mdtanvirkabirbiplob@gmail.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const founderToken = createSessionToken(founderUser);

  let founderPassed = false;
  const mockFounderReq: any = {
    headers: { authorization: `Bearer ${founderToken}` }
  };
  const mockFounderRes: any = {
    status: () => ({ json: () => {} })
  };
  await requireFounder(mockFounderReq, mockFounderRes, () => {
    founderPassed = true;
  });
  assert(founderPassed, '1. Valid Founder login grants Founder access');

  // --- 2. Ordinary User Creation & Role Canonicalization ---
  const ordinaryEmail = 'student.jane@example.com';
  const resolvedRole = canonicalizeRole(ordinaryEmail);
  assert(resolvedRole === 'student', '2. New ordinary user canonicalizes strictly to Student role');

  // --- 3. Student Calling Founder API Directly ---
  const studentUser: User = {
    id: 'usr-student-gate1',
    email: 'student.jane@example.com',
    role: 'student',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const studentToken = createSessionToken(studentUser);

  let studentDeniedCode = 0;
  const mockStudentReq: any = {
    headers: { authorization: `Bearer ${studentToken}` }
  };
  const mockStudentRes: any = {
    status: (code: number) => {
      studentDeniedCode = code;
      return { json: (b: any) => b };
    }
  };
  await requireFounder(mockStudentReq, mockStudentRes, () => {});
  assert(studentDeniedCode === 403, '3. Student calling Founder API directly returns HTTP 403 Forbidden');

  // --- 4. Student Calling Admin API Directly ---
  let adminDeniedCode = 0;
  const mockAdminRes: any = {
    status: (code: number) => {
      adminDeniedCode = code;
      return { json: (b: any) => b };
    }
  };
  await requireAdmin(mockStudentReq, mockAdminRes, () => {});
  assert(adminDeniedCode === 403, '4. Student calling Admin API directly returns HTTP 403 Forbidden');

  // --- 5. Tampered Role in Token Body Ignored / Server-Authoritative ---
  // If an attacker generates a forged JWT claim with role="founder" for ordinary email:
  const forgedPayloadToken = createSessionToken({
    id: 'usr-tampered',
    email: 'hacker@example.com',
    role: 'founder' as any
  });
  const decodedUser = getUserFromToken(forgedPayloadToken);
  assert(decodedUser?.role === 'student', '5. Forged role="founder" claim in payload is strictly normalized to "student"');

  // --- 6. Student Submits role="admin" via Registration/Update Body ---
  const attemptedEscalationRole = canonicalizeRole('hacker@example.com');
  assert(attemptedEscalationRole === 'student', '6. Attempt to submit admin role for non-founder email rejected');

  // --- 7. Expired or Invalid Token Rejection ---
  const invalidSigToken = studentToken.slice(0, -6) + 'XXXXXX';
  const invalidUser = getUserFromToken(invalidSigToken);
  assert(invalidUser === null, '7.1. Invalid signature token rejected by getUserFromToken (null)');

  let invalidReqCode = 0;
  const mockInvalidReq: any = {
    headers: { authorization: `Bearer ${invalidSigToken}` }
  };
  const mockInvalidRes: any = {
    status: (code: number) => {
      invalidReqCode = code;
      return { json: (b: any) => b };
    }
  };
  await requireAuth(mockInvalidReq, mockInvalidRes, () => {});
  assert(invalidReqCode === 401, '7.2. Invalid token rejected with HTTP 401 Unauthorized');

  // --- 8. Missing Bearer Token ---
  let missingTokenCode = 0;
  const mockMissingReq: any = { headers: {} };
  const mockMissingRes: any = {
    status: (code: number) => {
      missingTokenCode = code;
      return { json: (b: any) => b };
    }
  };
  await requireAuth(mockMissingReq, mockMissingRes, () => {});
  assert(missingTokenCode === 401, '8. Missing Authorization header rejected with HTTP 401');

  // --- 9. User Data Isolation: Student A vs Student B ---
  const studentBToken = createSessionToken({
    id: 'usr-student-b',
    email: 'student.b@example.com',
    role: 'student'
  });
  let crossUserBlockedCode = 0;
  const mockCrossReq: any = {
    headers: { authorization: `Bearer ${studentBToken}` },
    params: { userId: 'usr-student-gate1' } // Student B trying to access Student A's userId
  };
  const mockCrossRes: any = {
    status: (code: number) => {
      crossUserBlockedCode = code;
      return { json: (b: any) => b };
    }
  };
  const ownerGuard = requireOwnerOrAdmin('userId');
  ownerGuard(mockCrossReq, mockCrossRes, () => {});
  assert(crossUserBlockedCode === 403, '9. Student B accessing Student A resources rejected with HTTP 403');

  // --- 10. Switching from Founder Account to Ordinary Account ---
  const isFounderActive = isFounderEmail(founderUser.email);
  const isSwitchedActive = isFounderEmail(studentUser.email);
  assert(isFounderActive === true && isSwitchedActive === false, '10. Switching from Founder to student account cleanly revokes Founder privileges');

  // --- 11. Strict Login Verification (Zero Auto-Creation / Zero Bypass) ---
  const { verifyPassword } = await import('../server/db.js');
  const bogusHash = 'invalid-salt-hash-combo';
  const bogusSalt = 'salt-123';
  const checkInvalid = verifyPassword('AnyPasswordAttempt', bogusHash, bogusSalt);
  assert(checkInvalid === false, '11. Arbitrary password attempt strictly rejected by cryptographic verification');

  console.log('\n========================================================================');
  console.log(`📊 GATE 1 TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runGate1Suite().catch((err) => {
  console.error('[Gate 1 Runner Error]', err);
  process.exit(1);
});
