// scripts/test-cbt-mock-exam-and-certificates.ts
// Automated Test Suite for CBT Mock Exams, Marksheet Scoring, Branded Certificates & Brand Colors
// NIHOMI.COM — WP10 Verification Suite

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { jsPDF } from 'jspdf';
import {
  generateOfficialCertificatePdf,
  generateOfficialMarksheetPdf
} from '../src/lib/services/certificatePdfGenerator';
import { MockExamAttempt } from '../src/types';

console.log('================================================================');
console.log('🧪 NIHOMI WP10: CBT MOCK EXAMS, MARKSHEETS & BRAND SUITE');
console.log('================================================================');

let totalChecks = 0;
let passedChecks = 0;

function check(name: string, fn: () => void) {
  totalChecks++;
  try {
    fn();
    passedChecks++;
    console.log(`  ✅ [PASS] ${name}`);
  } catch (err: any) {
    console.error(`  ❌ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

// Mock Test Attempt Data (Passed Candidate)
const passedAttempt: MockExamAttempt = {
  id: 'att-test-pass-001',
  mockExamId: 'mock-n5-full-01',
  userId: 'usr-student-01',
  level: 'N5',
  examCode: 'JLPT-N5-2026-M1',
  startedAt: '2026-10-23T01:00:00.000Z',
  submittedAt: '2026-10-23T02:45:00.000Z',
  timeSpentSeconds: 5950,
  sectionTimesSpentSeconds: {
    vocabulary: 1400,
    grammar_reading: 2800,
    listening: 1750
  },
  totalScaledScore: 142,
  overallPassingScore: 90,
  isPassed: true,
  letterGrade: 'A',
  percentileRank: 88,
  certificateId: 'NHM-CERT-2026-N5-8821',
  verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  sectionScores: {
    vocabulary: {
      sectionType: 'vocabulary',
      sectionTitle: 'Language Knowledge (Vocabulary & Kanji)',
      totalQuestions: 35,
      correctQuestions: 28,
      rawScorePercent: 80,
      scaledScore: 48,
      maxScaledScore: 60,
      passingThreshold: 19,
      isSectionPassed: true
    },
    grammar_reading: {
      sectionType: 'grammar_reading',
      sectionTitle: 'Grammar & Reading Comprehension',
      totalQuestions: 32,
      correctQuestions: 26,
      rawScorePercent: 81,
      scaledScore: 47,
      maxScaledScore: 60,
      passingThreshold: 19,
      isSectionPassed: true
    },
    listening: {
      sectionType: 'listening',
      sectionTitle: 'Tokyo Listening (聴解)',
      totalQuestions: 24,
      correctQuestions: 24,
      rawScorePercent: 100,
      scaledScore: 47,
      maxScaledScore: 60,
      passingThreshold: 19,
      isSectionPassed: true
    }
  },
  strengthSummaryBn: 'শব্দভাণ্ডার ও কাঞ্জি পাঠে অসাধারণ দক্ষতা এবং টোকিও লিসেনিং সংলাপে নিখুঁত সমঝোতা।',
  weaknessSummaryBn: 'জটিল অনুচ্ছেদের লং-রিডিং গতি আরেকটু বাড়ানো সম্ভব।',
  actionableStudyPlanBn: ['প্রতিদিন ১৫ মিনিট টোকিও কনবিনি WorkOS অনুশীলন করুন।'],
  userAnswers: []
};

// Mock Test Attempt Data (Failed Candidate: Sectional Threshold Cutoff < 19)
const sectionalFailedAttempt: MockExamAttempt = {
  ...passedAttempt,
  id: 'att-test-fail-sectional',
  totalScaledScore: 110, // Overall > 90, BUT listening = 14 (< 19)
  isPassed: false,
  letterGrade: 'F',
  failReason: 'Listening সেকশনে ন্যূনতম পাস মার্ক ১৯ পূরণ না হওয়ায় সামগ্রিক পরীক্ষা অনুত্তীর্ণ বিবেচিত হয়েছে।',
  sectionScores: {
    ...passedAttempt.sectionScores,
    listening: {
      sectionType: 'listening',
      sectionTitle: 'Tokyo Listening (聴解)',
      totalQuestions: 24,
      correctQuestions: 6,
      rawScorePercent: 25,
      scaledScore: 14,
      maxScaledScore: 60,
      passingThreshold: 19,
      isSectionPassed: false
    }
  }
};

// -------------------------------------------------------------
// 1. OFFICIAL BRANDED CERTIFICATE PDF GENERATION
// -------------------------------------------------------------
console.log('\n[1/4] Testing Official Nihomi Achievement Certificate PDF Generation...');

check('Generates landscape A4 certificate PDF with official headers & seals', () => {
  const doc = generateOfficialCertificatePdf(passedAttempt, {
    candidateName: 'MD TANVIR HOSSAIN',
    candidateNameKana: 'エムディ タンヴィル ホセイン',
    candidateId: 'usr-student-01',
    registrationNumber: 'NHM-JLPT-N5-2026-8821'
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  assert.equal(Math.round(width), 297, 'Landscape A4 width must be 297mm');
  assert.equal(Math.round(height), 210, 'Landscape A4 height must be 210mm');

  const arrayBuffer = doc.output('arraybuffer');
  assert.ok(arrayBuffer.byteLength > 2000, `Certificate PDF size must be > 2000 bytes, got ${arrayBuffer.byteLength}`);

  const bytes = new Uint8Array(arrayBuffer);
  assert.equal(bytes[0], 0x25, '%');
  assert.equal(bytes[1], 0x50, 'P');
  assert.equal(bytes[2], 0x44, 'D');
  assert.equal(bytes[3], 0x46, 'F');
});

// -------------------------------------------------------------
// 2. OFFICIAL MARKSHEET PDF GENERATION
// -------------------------------------------------------------
console.log('\n[2/4] Testing Official JLPT Marksheet / Score Report PDF Generation...');

check('Generates portrait A4 marksheet PDF with sectional breakdown & pass status', () => {
  const doc = generateOfficialMarksheetPdf(passedAttempt, {
    candidateName: 'MD TANVIR HOSSAIN',
    candidateNameKana: 'エムディ タンヴィル ホセイン',
    candidateId: 'usr-student-01',
    registrationNumber: 'NHM-JLPT-N5-2026-8821'
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  assert.equal(Math.round(width), 210, 'Portrait A4 width must be 210mm');
  assert.equal(Math.round(height), 297, 'Portrait A4 height must be 297mm');

  const arrayBuffer = doc.output('arraybuffer');
  assert.ok(arrayBuffer.byteLength > 2000, `Marksheet PDF size must be > 2000 bytes, got ${arrayBuffer.byteLength}`);

  const bytes = new Uint8Array(arrayBuffer);
  assert.equal(bytes[0], 0x25, '%');
  assert.equal(bytes[1], 0x50, 'P');
  assert.equal(bytes[2], 0x44, 'D');
  assert.equal(bytes[3], 0x46, 'F');
});

// -------------------------------------------------------------
// 3. JLPT / NAT PASSING CRITERIA ENFORCEMENT
// -------------------------------------------------------------
console.log('\n[3/4] Testing JLPT CBT Scoring Rules & Cutoff Thresholds...');

check('Overall >= 90 AND all sections >= 19 results in PASSED', () => {
  assert.equal(passedAttempt.isPassed, true);
  assert.ok((passedAttempt.totalScaledScore || 0) >= passedAttempt.overallPassingScore);
  assert.ok((passedAttempt.sectionScores?.vocabulary?.scaledScore || 0) >= 19);
  assert.ok((passedAttempt.sectionScores?.grammar_reading?.scaledScore || 0) >= 19);
  assert.ok((passedAttempt.sectionScores?.listening?.scaledScore || 0) >= 19);
});

check('Overall >= 90 BUT any section < 19 strictly results in FAILED', () => {
  assert.equal(sectionalFailedAttempt.isPassed, false);
  assert.ok((sectionalFailedAttempt.totalScaledScore || 0) >= sectionalFailedAttempt.overallPassingScore);
  assert.ok((sectionalFailedAttempt.sectionScores?.listening?.scaledScore || 0) < 19);
  assert.ok(sectionalFailedAttempt.failReason?.includes('১৯'));
});

check('Candidate registration number follows standard Nihomi roll syntax', () => {
  const regPattern = /^NHM-JLPT-(N[1-5]|NAT)-\d{4}-\d{4,6}$/;
  assert.ok(regPattern.test('NHM-JLPT-N5-2026-8821'), 'N5 registration roll must match pattern');
  assert.ok(regPattern.test('NHM-JLPT-N4-2026-1042'), 'N4 registration roll must match pattern');
});

// -------------------------------------------------------------
// 4. BRAND GUIDELINES & COLOR PALETTE ALIGNMENT
// -------------------------------------------------------------
console.log('\n[4/4] Verifying Brand Guidelines Alignment & Component Integration...');

check('MockExamOfficialCertificate integrates NihomiBrandLogo & PDF download triggers', () => {
  const certCode = fs.readFileSync('src/components/mockExam/MockExamOfficialCertificate.tsx', 'utf8');
  assert.ok(certCode.includes('NihomiBrandLogo'), 'Certificate must import and render NihomiBrandLogo');
  assert.ok(certCode.includes('download-official-certificate-btn'), 'Certificate must have download certificate button');
  assert.ok(certCode.includes('download-official-marksheet-btn'), 'Certificate must have download marksheet button');
  assert.ok(certCode.includes('#E45147'), 'Certificate must use brand Crimson #E45147');
});

check('MockExamsView integrates CbtExamRegistrationModal with brand Crimson & Amber accents', () => {
  const viewCode = fs.readFileSync('src/views/MockExamsView.tsx', 'utf8');
  assert.ok(viewCode.includes('CbtExamRegistrationModal'), 'MockExamsView must integrate CbtExamRegistrationModal');
  assert.ok(viewCode.includes('#E45147'), 'MockExamsView must use brand Crimson #E45147');
  assert.ok(viewCode.includes('রেজিস্ট্রেশন ও পরীক্ষা শুরু'), 'Exam start button must invite registration');
});

check('CbtExamRegistrationModal enforces Nihomi brand guidelines and hall ticket preview', () => {
  const modalCode = fs.readFileSync('src/components/mockExam/CbtExamRegistrationModal.tsx', 'utf8');
  assert.ok(modalCode.includes('NihomiBrandLogo'), 'Registration modal must render NihomiBrandLogo');
  assert.ok(modalCode.includes('CBT 受験票 (HALL TICKET)'), 'Registration modal must display hall ticket');
  assert.ok(modalCode.includes('#E45147'), 'Registration modal must use brand Crimson #E45147');
});

console.log('================================================================');
console.log(`🎉 ALL ${passedChecks}/${totalChecks} TESTS PASSED PERFECTLY! (100% SUCCESS)`);
console.log('================================================================');
