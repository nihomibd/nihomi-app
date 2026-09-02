import { signStatelessJwt, verifyStatelessJwt, getUserFromToken } from '../authHelper.js';
import { getRequiredJwtSecret } from '../env.js';
import { verifyGoogleIdToken } from '../services/googleAuth.js';
import { db } from '../db.js';
import crypto from 'crypto';

async function runAuthSecurityVerification() {
  console.log('=== NIHOMI.COM P0-03 SECURE AUTHENTICATION & GOOGLE OAUTH VERIFICATION ===\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] Test ${totalTests}: ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] Test ${totalTests}: ${testName}`);
      throw new Error(`Assertion failed for: ${testName}`);
    }
  }

  // 1. JWT_SECRET Fail-Fast Enforcement
  console.log('--- 1. Testing JWT_SECRET Fail-Fast Enforcement ---');
  const currentSecret = getRequiredJwtSecret();
  assert(typeof currentSecret === 'string' && currentSecret.length > 16, 'JWT_SECRET is securely configured in environment without hardcoded fallback');

  // Test that missing JWT_SECRET throws error
  const originalEnvSecret = process.env.JWT_SECRET;
  try {
    delete process.env.JWT_SECRET;
    let threw = false;
    try {
      getRequiredJwtSecret();
    } catch (e: any) {
      threw = true;
      assert(e.message.includes('CRITICAL SECURITY FATAL ERROR'), 'getRequiredJwtSecret throws explicit FATAL security error when missing');
    }
    assert(threw, 'Fail-fast triggered when JWT_SECRET is removed');
  } finally {
    process.env.JWT_SECRET = originalEnvSecret;
  }

  // 2. Cryptographic HMAC-SHA256 Token Signing & Tamper Resistance
  console.log('\n--- 2. Testing Cryptographic Token Signing & Tamper Resistance ---');
  const testUser = {
    userId: 'usr-security-test-01',
    email: 'learner.test@nihomi.com',
    role: 'user' as const
  };

  const validToken = signStatelessJwt(testUser, 3600);
  assert(validToken.split('.').length === 3, 'Token format is valid 3-part JWT header.payload.signature');

  const verified = verifyStatelessJwt(validToken);
  assert(verified !== null && verified.userId === testUser.userId && verified.role === 'user', 'Valid signed JWT verifies with exact claims');

  // Tamper with Payload (Attempt Privilege Escalation to Admin)
  const [header, payload, signature] = validToken.split('.');
  const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
  decodedPayload.role = 'admin';
  const tamperedPayload = Buffer.from(JSON.stringify(decodedPayload)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const forgedToken = `${header}.${tamperedPayload}.${signature}`;

  const tamperedResult = verifyStatelessJwt(forgedToken);
  assert(tamperedResult === null, 'Tampered JWT payload with privilege escalation attempt is REJECTED by HMAC verification');

  // Tamper with Signature
  const invalidSigToken = `${header}.${payload}.${signature.slice(0, -4)}XXXX`;
  const invalidSigResult = verifyStatelessJwt(invalidSigToken);
  assert(invalidSigResult === null, 'Forged signature token is REJECTED');

  // Expired Token Test
  const expiredToken = signStatelessJwt(testUser, -60); // Expired 60s ago
  const expiredResult = verifyStatelessJwt(expiredToken);
  assert(expiredResult === null, 'Expired JWT token is strictly REJECTED (exp claim enforced)');

  // 3. Google OAuth Cryptographic Verification & Spoof Prevention
  console.log('\n--- 3. Testing Google OAuth Server-Side Verification ---');
  // Attempt verification with invalid / spoofed token
  const fakeGoogleToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkZvcmdlZCBBZG1pbiIsImVtYWlsIjoiYWRtaW5Abmlob21pLmNvbSJ9.invalidsig';
  const googleVerifyResult = await verifyGoogleIdToken(fakeGoogleToken);
  assert(googleVerifyResult === null, 'Forged Google ID token with arbitrary email claims is REJECTED by google-auth-library');

  const emptyTokenResult = await verifyGoogleIdToken('');
  assert(emptyTokenResult === null, 'Empty token is REJECTED');

  // 4. Role & Auth Middleware Integration
  console.log('\n--- 4. Testing Identity Resolution & Role Segregation ---');
  // Test Admin Token
  const adminToken = signStatelessJwt({
    userId: 'usr-admin-01',
    email: 'admin@nihomi.com',
    role: 'admin'
  });
  const adminUser = getUserFromToken(`Bearer ${adminToken}`);
  assert(adminUser !== null && adminUser.role === 'admin', 'Admin user identity correctly resolved from verified Bearer token');

  // Test Student Token
  const studentToken = signStatelessJwt({
    userId: 'usr-student-01',
    email: 'student@nihomi.com',
    role: 'user'
  });
  const studentUser = getUserFromToken(`Bearer ${studentToken}`);
  assert(studentUser !== null && studentUser.role === 'user', 'Student user identity correctly resolved and cannot act as admin');

  // Test Invalid Token in getUserFromToken
  const invalidUser = getUserFromToken('Bearer invalid.fake.token');
  assert(invalidUser === null, 'Invalid token returns null user identity');

  console.log(`\n======================================================`);
  console.log(`ALL ${passedTests}/${totalTests} SECURITY TESTS PASSED SUCCESSFULLY!`);
  console.log(`======================================================`);
}

runAuthSecurityVerification().catch((err) => {
  console.error('[Security Test Suite Failure]:', err);
  process.exit(1);
});
