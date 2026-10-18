import assert from 'node:assert/strict';
import { createSessionToken, requireFounder, requireAdmin } from '../server/authHelper.js';

console.log('--- RUNNING NIHOMI ROLE AUTHORIZATION MATRIX VERIFICATION ---');

// Mock Express req, res, next
function createMockContext(headers: Record<string, string> = {}) {
  let statusCode = 200;
  let jsonBody: any = null;
  let nextCalled = false;

  const req: any = {
    headers: { ...headers },
    method: 'GET',
    originalUrl: '/api/founder/summary',
  };

  const res: any = {
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(body: any) {
      jsonBody = body;
      return res;
    },
  };

  const next = () => {
    nextCalled = true;
  };

  return { req, res, next, getStatus: () => statusCode, getBody: () => jsonBody, isNextCalled: () => nextCalled };
}

async function runRoleSecurityMatrix() {
  // TEST 1: Anonymous request to requireFounder => 401 Unauthorized
  {
    const ctx = createMockContext();
    await requireFounder(ctx.req, ctx.res, ctx.next);
    assert.equal(ctx.getStatus(), 401, 'Anonymous request must return 401');
    assert.equal(ctx.getBody()?.code, 'AUTH_REQUIRED', 'Error code must be AUTH_REQUIRED');
    assert.equal(ctx.isNextCalled(), false, 'next() must NOT be called for anonymous');
    console.log('✓ TEST 1 PASSED: Anonymous request to requireFounder denied with 401 AUTH_REQUIRED');
  }

  // TEST 2: Student JWT Bearer token to requireFounder => 403 Forbidden
  {
    const studentUser = {
      id: 'usr_student_test_42',
      email: 'student@example.com',
      role: 'student' as const,
    };
    const studentToken = createSessionToken(studentUser);
    const ctx = createMockContext({
      authorization: `Bearer ${studentToken}`,
    });

    await requireFounder(ctx.req, ctx.res, ctx.next);
    assert.equal(ctx.getStatus(), 403, 'Student token must return 403');
    assert.equal(ctx.getBody()?.code, 'FORBIDDEN_FOUNDER_ONLY', 'Error code must be FORBIDDEN_FOUNDER_ONLY');
    assert.equal(ctx.isNextCalled(), false, 'next() must NOT be called for student');
    console.log('✓ TEST 2 PASSED: Student JWT token to requireFounder denied with 403 FORBIDDEN_FOUNDER_ONLY');
  }

  // TEST 3: Student token to requireAdmin => 403 Forbidden
  {
    const studentUser = {
      id: 'usr_student_test_42',
      email: 'student@example.com',
      role: 'student' as const,
    };
    const studentToken = createSessionToken(studentUser);
    const ctx = createMockContext({
      authorization: `Bearer ${studentToken}`,
    });

    await requireAdmin(ctx.req, ctx.res, ctx.next);
    assert.equal(ctx.getStatus(), 403, 'Student token must return 403 on requireAdmin');
    assert.equal(ctx.getBody()?.code, 'FORBIDDEN_ROLE', 'Error code must be FORBIDDEN_ROLE');
    assert.equal(ctx.isNextCalled(), false, 'next() must NOT be called for student on admin endpoint');
    console.log('✓ TEST 3 PASSED: Student JWT token to requireAdmin denied with 403 FORBIDDEN_ROLE');
  }

  // TEST 4: Fake / Tampered JWT to requireFounder => 401 Unauthorized
  {
    const ctx = createMockContext({
      authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature`,
    });

    await requireFounder(ctx.req, ctx.res, ctx.next);
    assert.equal(ctx.getStatus(), 401, 'Tampered token must return 401');
    assert.equal(ctx.getBody()?.code, 'INVALID_TOKEN', 'Error code must be INVALID_TOKEN');
    assert.equal(ctx.isNextCalled(), false, 'next() must NOT be called for invalid token');
    console.log('✓ TEST 4 PASSED: Tampered token to requireFounder denied with 401 INVALID_TOKEN');
  }

  // TEST 5: Legitimate Founder JWT token => 200 OK (calls next())
  {
    const founderUser = {
      id: 'usr_founder_root',
      email: 'mdtanvirkabirbiplob@gmail.com',
      role: 'admin' as const,
    };
    const founderToken = createSessionToken(founderUser);
    const ctx = createMockContext({
      authorization: `Bearer ${founderToken}`,
    });

    await requireFounder(ctx.req, ctx.res, ctx.next);
    assert.equal(ctx.isNextCalled(), true, 'next() must be called for valid founder token');
    assert.equal(ctx.getStatus(), 200, 'Status should remain 200 on authorized pass-through');
    console.log('✓ TEST 5 PASSED: Founder JWT token verified and authorized (next() called)');
  }

  console.log('\n======================================================');
  console.log('ROLE-BASED SERVER AUTHORIZATION MATRIX: 5/5 PASSED');
  console.log('======================================================\n');
}

runRoleSecurityMatrix().catch((err) => {
  console.error('Role security test failed:', err);
  process.exit(1);
});
