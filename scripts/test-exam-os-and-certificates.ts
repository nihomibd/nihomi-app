// scripts/test-exam-os-and-certificates.ts
// Automated Verification Test Suite for NIHOMI WP15:
// Exam OS Session Durability & Cryptographic Certificate Tamper-Proofing
// Governed by Law 2 (Strict Lattice), Law 3 (Single Source of Truth), Law 6 (AI Independence), & Law 10 (Production Rigor)

import assert from 'assert';
import crypto from 'crypto';
import { db } from '../server/db.js';
import { MockExamPersistenceService } from '../server/services/mockExamPersistenceService.js';
import { SpeakingReadinessCertService } from '../server/services/speakingReadinessCertService.js';

console.log('========================================================================');
console.log('📜 NIHOMI WP15: EXAM OS SESSION DURABILITY & CERTIFICATE SECURITY SUITE');
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

  // Seed test user and exam
  const testUserId = 'usr_exam_durability_test';
  if (!db.findUserById(testUserId)) {
    db.createUser({ email: 'exam_os_test@nihomi.com', password: 'password123', displayName: 'Exam Scholar' });
    const user = (db.data.users || []).find((u) => u.email === 'exam_os_test@nihomi.com');
    if (user) {
      user.id = testUserId;
      db.createSubscription({ userId: testUserId, planId: 'n5_pro', billingInterval: 'monthly', status: 'active' });
    }
  }

  const testExamId = 'exam-jlpt-n5-01';

  // -------------------------------------------------------------
  // Test Group 1: In-Flight Exam OS Session Durability
  // -------------------------------------------------------------
  console.log('[1/3] Testing Exam OS In-Flight Session State Durability & Auto-Save...');

  await runTest('db.saveExamSession and db.getExamSession persist in-flight session across reloads', () => {
    const sessionData = {
      currentSectionIndex: 1,
      currentQuestionIndex: 4,
      userAnswers: { 'q-v-01': 2, 'q-v-02': 0, 'q-gr-01': 3 },
      bookmarkedQuestionIds: ['q-v-02'],
      sectionTimeRemaining: 1420,
      sectionTimesSpent: { vocabulary: 600, grammar_reading: 120, listening: 0 },
      totalTimeSpentSeconds: 720
    };

    db.saveExamSession(testUserId, testExamId, sessionData);
    const retrieved = db.getExamSession(testUserId, testExamId);

    assert(retrieved !== null, 'Session must be retrieved');
    assert.strictEqual(retrieved.currentSectionIndex, 1);
    assert.strictEqual(retrieved.currentQuestionIndex, 4);
    assert.strictEqual(retrieved.userAnswers['q-v-01'], 2);
    assert.strictEqual(retrieved.userAnswers['q-gr-01'], 3);
    assert.strictEqual(retrieved.sectionTimeRemaining, 1420);
    assert(Array.isArray(retrieved.bookmarkedQuestionIds));
    assert.strictEqual(retrieved.bookmarkedQuestionIds[0], 'q-v-02');
  });

  await runTest('Live POST & GET /api/mock-exams/:id/session roundtrips active in-flight session', async () => {
    const payload = {
      guestId: 'guest_runner_e2e_01',
      currentSectionIndex: 2,
      currentQuestionIndex: 1,
      userAnswers: { 'q-01': 1, 'q-02': 2 },
      bookmarkedQuestionIds: ['q-01'],
      sectionTimeRemaining: 900,
      sectionTimesSpent: { vocabulary: 1200, grammar_reading: 1800, listening: 300 },
      totalTimeSpentSeconds: 3300
    };

    // Save session via API
    const postRes = await fetch(`${BASE_URL}/api/mock-exams/${testExamId}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    assert.strictEqual(postRes.status, 200, 'POST /session must return 200');
    const postJson = await postRes.json();
    assert.strictEqual(postJson.success, true);

    // Retrieve session via API
    const getRes = await fetch(`${BASE_URL}/api/mock-exams/${testExamId}/session?guestId=guest_runner_e2e_01`);
    assert.strictEqual(getRes.status, 200, 'GET /session must return 200');
    const getJson = await getRes.json();
    assert.strictEqual(getJson.success, true);
    assert(getJson.session !== null, 'Saved session must be returned');
    assert.strictEqual(getJson.session.currentSectionIndex, 2);
    assert.strictEqual(getJson.session.sectionTimeRemaining, 900);
  });

  await runTest('DELETE /api/mock-exams/:id/session clears in-flight session on abandon', async () => {
    const delRes = await fetch(`${BASE_URL}/api/mock-exams/${testExamId}/session?guestId=guest_runner_e2e_01`, {
      method: 'DELETE'
    });
    assert.strictEqual(delRes.status, 200, 'DELETE /session must return 200');

    // Confirm session is now null
    const checkRes = await fetch(`${BASE_URL}/api/mock-exams/${testExamId}/session?guestId=guest_runner_e2e_01`);
    const checkJson = await checkRes.json();
    assert.strictEqual(checkJson.session, null, 'Cleared session must return null');
  });

  // -------------------------------------------------------------
  // Test Group 2: SHA-256 Cryptographic Hash & Tamper-Proofing
  // -------------------------------------------------------------
  console.log('\n[2/3] Testing SHA-256 Cryptographic Certificate Generation & Tamper-Proofing...');

  const certId = `NIH-TEST-CERT-${Date.now().toString(36).toUpperCase()}`;
  const submittedAt = new Date().toISOString();
  const testAttempt = {
    id: `attempt-test-${Date.now()}`,
    userId: testUserId,
    mockExamId: testExamId,
    examCode: 'JLPT-N5-2026-A',
    level: 'N5' as const,
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    submittedAt,
    timeSpentSeconds: 3600,
    sectionTimesSpentSeconds: { vocabulary: 1200, grammar_reading: 1500, listening: 900 },
    sectionScores: {
      vocabulary: { sectionType: 'vocabulary' as const, sectionTitle: 'Vocabulary', scaledScore: 48, maxScaledScore: 60, passingThreshold: 19, isSectionPassed: true, rawScore: 30, maxRawScore: 35, rawScorePercent: 85, correctQuestions: 25, totalQuestions: 30, timeSpentSeconds: 1200 },
      grammar_reading: { sectionType: 'grammar_reading' as const, sectionTitle: 'Grammar/Reading', scaledScore: 45, maxScaledScore: 60, passingThreshold: 19, isSectionPassed: true, rawScore: 28, maxRawScore: 35, rawScorePercent: 80, correctQuestions: 22, totalQuestions: 28, timeSpentSeconds: 1500 },
      listening: { sectionType: 'listening' as const, sectionTitle: 'Listening', scaledScore: 42, maxScaledScore: 60, passingThreshold: 19, isSectionPassed: true, rawScore: 20, maxRawScore: 24, rawScorePercent: 83, correctQuestions: 18, totalQuestions: 24, timeSpentSeconds: 900 }
    },
    totalScaledScore: 135,
    overallPassingScore: 90,
    isPassed: true,
    letterGrade: 'B' as const,
    percentileRank: 88,
    certificateId: certId,
    verificationHash: '',
    userAnswers: []
  };

  // Generate official hash
  testAttempt.verificationHash = MockExamPersistenceService.generateVerificationHash(testAttempt);

  await runTest('generateVerificationHash produces deterministic 32-character SHA-256 hash', () => {
    assert.strictEqual(typeof testAttempt.verificationHash, 'string');
    assert.strictEqual(testAttempt.verificationHash.length, 32);
    const recomputed = MockExamPersistenceService.generateVerificationHash(testAttempt);
    assert.strictEqual(recomputed, testAttempt.verificationHash, 'Hash must be strictly deterministic');
  });

  await runTest('validateCertificateTamperProof validates authentic, unmanipulated certificate', () => {
    const isValid = MockExamPersistenceService.validateCertificateTamperProof(testAttempt);
    assert.strictEqual(isValid, true, 'Authentic certificate must pass validation');
  });

  await runTest('validateCertificateTamperProof detects tampered totalScaledScore', () => {
    const tamperedAttempt = { ...testAttempt, totalScaledScore: 175 }; // Student forged score to 175
    const isValid = MockExamPersistenceService.validateCertificateTamperProof(tamperedAttempt);
    assert.strictEqual(isValid, false, 'Tampered score must fail validation');
  });

  await runTest('validateCertificateTamperProof detects tampered userId or student identity', () => {
    const tamperedAttempt = { ...testAttempt, userId: 'usr_imposter_99' };
    const isValid = MockExamPersistenceService.validateCertificateTamperProof(tamperedAttempt);
    assert.strictEqual(isValid, false, 'Tampered userId must fail validation');
  });

  await runTest('validateCertificateTamperProof detects tampered examCode or level', () => {
    const tamperedAttempt = { ...testAttempt, examCode: 'JLPT-N1-FORGED' };
    const isValid = MockExamPersistenceService.validateCertificateTamperProof(tamperedAttempt);
    assert.strictEqual(isValid, false, 'Tampered exam code must fail validation');
  });

  // -------------------------------------------------------------
  // Test Group 3: Public Unified Certificate Verification API
  // -------------------------------------------------------------
  console.log('\n[3/3] Testing Unified Public Certificate Verification Endpoints...');

  // Save the authentic attempt to DB
  (db.data as any).mockExamAttempts.unshift(testAttempt);
  db.save();

  await runTest('GET /api/certificates/verify/:certId verifies authentic JLPT certificate', async () => {
    const res = await fetch(`${BASE_URL}/api/certificates/verify/${certId}`);
    assert.strictEqual(res.status, 200, 'Authentic cert must return 200 OK');
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.valid, true);
    assert.strictEqual(json.tamperDetected, false);
    assert.strictEqual(json.certificate.totalScaledScore, 135);
    assert.strictEqual(json.certificate.letterGrade, 'B');
    assert.strictEqual(json.certificate.verificationHash, testAttempt.verificationHash);
  });

  await runTest('GET /api/public/verify-certificate/:certId serves identical verification data', async () => {
    const res = await fetch(`${BASE_URL}/api/public/verify-certificate/${certId}`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.valid, true);
    assert(typeof json.certificate.studentName === 'string' && json.certificate.studentName.length > 0);
  });

  await runTest('Verification endpoint detects and rejects tampered certificate with HTTP 400', async () => {
    // Create tampered certificate in DB
    const tamperedCertId = `NIH-TAMPER-${Date.now().toString(36).toUpperCase()}`;
    const forgedAttempt = {
      ...testAttempt,
      certificateId: tamperedCertId,
      totalScaledScore: 180, // Forged perfect score
      verificationHash: testAttempt.verificationHash // Old hash that doesn't match 180
    };
    (db.data as any).mockExamAttempts.unshift(forgedAttempt);
    db.save();

    const res = await fetch(`${BASE_URL}/api/certificates/verify/${tamperedCertId}`);
    assert.strictEqual(res.status, 400, 'Tampered certificate must return HTTP 400');
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.valid, false);
    assert.strictEqual(json.tamperDetected, true);
    assert(json.error?.includes('Tampered') || json.error?.includes('টেম্পারিং'));
  });

  await runTest('GET /api/certificates/verify/:certId verifies Tokyo Speaking Readiness Certificate', async () => {
    // Issue speaking cert
    const speakingCert = await SpeakingReadinessCertService.generateSpeakingCertificate(testUserId, 'Exam Scholar');
    assert(speakingCert.certificateId.startsWith('CERT-TOKYO-'));

    const res = await fetch(`${BASE_URL}/api/certificates/verify/${speakingCert.certificateId}`);
    assert.strictEqual(res.status, 200, 'Speaking certificate must verify with 200 OK');
    const json = await res.json();
    assert.strictEqual(json.valid, true);
    assert.strictEqual(json.type, 'speaking_readiness');
  });

  await runTest('Non-existent certificate returns HTTP 404', async () => {
    const res = await fetch(`${BASE_URL}/api/certificates/verify/NON_EXISTENT_CERT_99999`);
    assert.strictEqual(res.status, 404, 'Non-existent certificate must return 404 Not Found');
    const json = await res.json();
    assert.strictEqual(json.valid, false);
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
    console.log('🎉 ALL EXAM OS SESSION DURABILITY & TAMPER-PROOFING TESTS PASSED (100%)!\n');
    process.exitCode = 0;
  }
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exitCode = 1;
});
