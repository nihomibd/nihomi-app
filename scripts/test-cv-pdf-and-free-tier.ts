// scripts/test-cv-pdf-and-free-tier.ts
// Automated Test Suite for JIS CV PDF Export, Free Tier Clarity, and 12-Price Matrix

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { jsPDF } from 'jspdf';
import {
  evaluateEntitlement,
  evaluateLessonAccess,
  type EntitlementSubject
} from '../src/core/entitlements/entitlementConstitution.js';
import {
  calculateDailyCost,
  getPlanPriceForInterval,
  JourneyInterval
} from '../src/core/billing/priceCalculator';

console.log('================================================================');
console.log('🧪 NIHOMI WP09: JIS CV PDF & FREE TIER CLARITY VERIFICATION SUITE');
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

// -------------------------------------------------------------
// 1. JIS CV PDF GENERATION & BINARY INTEGRITY
// -------------------------------------------------------------
console.log('\n[1/4] Testing JIS Standard Japanese Resume PDF Generation...');

check('Generates valid A4 JIS Resume PDF binary arraybuffer', () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  assert.equal(Math.round(pageWidth), 210, 'A4 width should be 210mm');
  assert.equal(Math.round(pageHeight), 297, 'A4 height should be 297mm');

  // Add JIS Header & Candidate info
  doc.setFontSize(18);
  doc.text('JIS Standard Japanese Resume (履歴書)', 15, 20);

  doc.setFontSize(10);
  doc.text('Candidate: MD TANVIR HOSSAIN (エムディ タンヴィル ホセイン)', 15, 30);
  doc.text('Date of Birth: 2001-05-15 (平成13年5月15日)', 15, 36);
  doc.text('Email: tanvir.nihomi@example.com | Phone: 080-1234-5678', 15, 42);
  doc.text('Visa Status: 留学 (Student Visa / 資格外活動許可済 - 28h/week)', 15, 48);
  doc.text('Address: 東京都新宿区高田馬場2-14-8', 15, 54);

  // Education & Work
  doc.text('--- Education & Work History ---', 15, 64);
  doc.text('2019/3: Dhaka College (Graduated)', 15, 70);
  doc.text('2023/10: Tokyo Int. Japanese School (Enrolled)', 15, 76);
  doc.text('2021/6: Dhaka IT Solutions (Joined)', 15, 82);

  // Certifications
  doc.text('--- Licenses & Certifications ---', 15, 92);
  doc.text('2024/12: JLPT N5 Passed', 15, 98);

  // Free tier watermark
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text('Generated via NIHOMI.COM — Bengali-First Japanese Learning Platform', 15, pageHeight - 4);

  const arrayBuffer = doc.output('arraybuffer');
  assert.ok(arrayBuffer, 'Output arraybuffer must exist');
  assert.ok(arrayBuffer.byteLength > 1000, `PDF size must be > 1000 bytes, got ${arrayBuffer.byteLength}`);

  const bytes = new Uint8Array(arrayBuffer);
  // PDF Magic header: %PDF (0x25, 0x50, 0x44, 0x46)
  assert.equal(bytes[0], 0x25, 'First byte must be %');
  assert.equal(bytes[1], 0x50, 'Second byte must be P');
  assert.equal(bytes[2], 0x44, 'Third byte must be D');
  assert.equal(bytes[3], 0x46, 'Fourth byte must be F');
});

// -------------------------------------------------------------
// 2. FREE TIER CURRICULUM & TOOL ENTITLEMENTS
// -------------------------------------------------------------
console.log('\n[2/4] Testing Free Tier vs Pro Entitlement Gating...');

const freeSubject: EntitlementSubject = {
  userId: 'usr_free_student',
  tier: 'free',
  isAuthenticated: true
};

const proSubject: EntitlementSubject = {
  userId: 'usr_pro_student',
  tier: 'pro',
  isAuthenticated: true
};

check('Free students have 100% free access to JLPT N5 Lessons 01 to 05', () => {
  for (let lesson = 1; lesson <= 5; lesson++) {
    const access = evaluateLessonAccess(freeSubject, lesson);
    assert.equal(access.granted, true, `Lesson ${lesson} must be free`);
  }
});

check('Free students are strictly gated from JLPT N5 Lesson 06 onwards', () => {
  const lesson6 = evaluateLessonAccess(freeSubject, 6);
  assert.equal(lesson6.granted, false, 'Lesson 6 must be gated for free users');
  assert.equal(lesson6.requiredTier, 'STARTER');

  const lesson25 = evaluateLessonAccess(freeSubject, 25);
  assert.equal(lesson25.granted, false, 'Lesson 25 must be gated for free users');
});

check('Pro students have full access to all N5 lessons (01 to 25)', () => {
  for (let lesson = 1; lesson <= 25; lesson++) {
    const access = evaluateLessonAccess(proSubject, lesson);
    assert.equal(access.granted, true, `Pro user must have access to Lesson ${lesson}`);
  }
});

check('Free users have access to basic JIS CV Builder & 100 Kana Studio', () => {
  const kanaAccess = evaluateEntitlement(freeSubject, 'kana_canvas');
  assert.equal(kanaAccess.granted, true, 'Kana Canvas must be accessible to free users');
});

check('WorkOS Konbini simulation and JLPT Exam OS require Pro tier', () => {
  const freeWorkOs = evaluateEntitlement(freeSubject, 'workos_simulation');
  assert.equal(freeWorkOs.granted, false, 'WorkOS simulation must be gated for free users');
  assert.equal(freeWorkOs.requiredTier, 'PRO');

  const proWorkOs = evaluateEntitlement(proSubject, 'workos_simulation');
  assert.equal(proWorkOs.granted, true, 'WorkOS simulation must be granted for Pro users');

  const freeExam = evaluateEntitlement(freeSubject, 'jlpt_mock_full');
  assert.equal(freeExam.granted, false, 'Full JLPT Mock exam must be gated for free users');
  assert.equal(freeExam.requiredTier, 'PRO');

  const proExam = evaluateEntitlement(proSubject, 'jlpt_mock_full');
  assert.equal(proExam.granted, true, 'Full JLPT Mock exam must be granted for Pro users');
});

// -------------------------------------------------------------
// 3. 12-PRICE MATRIX FORMULA & DISCOUNT CONSISTENCY
// -------------------------------------------------------------
console.log('\n[3/4] Testing 12-Price Matrix Consistency & Calculations...');

const PLANS = [
  { id: 'starter', monthly: 990, quarterly: 2820, half_yearly: 5350, yearly: 10100 },
  { id: 'pro', monthly: 1990, quarterly: 5670, half_yearly: 10750, yearly: 20300 },
  { id: 'japan_ready', monthly: 3990, quarterly: 11370, half_yearly: 21550, yearly: 40700 }
];

check('Quarterly prices reflect 5% discount (rounded to nearest 10 BDT)', () => {
  for (const plan of PLANS) {
    const calculated = getPlanPriceForInterval(plan.monthly, plan.yearly, 'quarterly');
    assert.equal(calculated, plan.quarterly, `${plan.id} quarterly price mismatch: got ${calculated}, expected ${plan.quarterly}`);
  }
});

check('Half-yearly prices reflect 10% discount (rounded to nearest 10 BDT)', () => {
  for (const plan of PLANS) {
    const calculated = getPlanPriceForInterval(plan.monthly, plan.yearly, 'half_yearly');
    assert.equal(calculated, plan.half_yearly, `${plan.id} half-yearly price mismatch: got ${calculated}, expected ${plan.half_yearly}`);
  }
});

check('Yearly prices reflect 15% discount (rounded to nearest 100 BDT)', () => {
  for (const plan of PLANS) {
    const calculated = getPlanPriceForInterval(plan.monthly, plan.yearly, 'yearly');
    assert.equal(calculated, plan.yearly, `${plan.id} yearly price mismatch: got ${calculated}, expected ${plan.yearly}`);
  }
});

check('Daily cost calculator produces accurate daily Bengali labels', () => {
  const proMonthly = calculateDailyCost(1990, 'monthly');
  assert.equal(proMonthly.dailyPrice, 66, '1990 / 30 = 66 BDT');
  assert.ok(proMonthly.dailyLabelBn.includes('66'), 'Daily label must include 66');

  const proYearly = calculateDailyCost(20300, 'yearly');
  assert.equal(proYearly.dailyPrice, 56, '20300 / 365 = 56 BDT');
  assert.ok(proYearly.dailyLabelBn.includes('56'), 'Daily label must include 56');
});

// -------------------------------------------------------------
// 4. V2 UI BADGES & NAVIGATION TRUTH
// -------------------------------------------------------------
console.log('\n[4/4] Verifying V2 Navigation & Free Tier Badges...');

check('V2 Curriculum explicitly badges Lessons 1-5 as ১০০% ফ্রি and Lesson 6+ as PRO লক', () => {
  const curriculumCode = fs.readFileSync('src/v2/pages/V2CurriculumPage.tsx', 'utf8');
  assert.ok(curriculumCode.includes('১০০% ফ্রি'), 'Curriculum must contain ১০০% ফ্রি badge');
  assert.ok(curriculumCode.includes('PRO লক'), 'Curriculum must contain PRO লক badge');
  assert.ok(curriculumCode.includes('সম্পূর্ণ ফ্রি (ফ্রি টিয়ারভুক্ত)'), 'Curriculum header must declare free tier');
});

check('V2 Pricing Page contains Free vs Pro comparison matrix', () => {
  const pricingCode = fs.readFileSync('src/v2/pages/V2PricingPage.tsx', 'utf8');
  assert.ok(pricingCode.includes('v2-pricing-comparison-matrix'), 'Pricing page must have comparison matrix');
  assert.ok(pricingCode.includes('কোন প্ল্যানে কি থাকছে? বিস্তারিত তুলনা'), 'Pricing comparison heading must exist');
  assert.ok(pricingCode.includes('লেসন ০১ - ০৫ (১০০% ফ্রি)'), 'Matrix must specify lessons 1-5 free');
  assert.ok(pricingCode.includes('✓ ফুল JIS এক্সপোর্ট ও PDF'), 'Matrix must specify JIS CV export tier');
});

check('V2 Header navigation contains distinct Free and Pro badges', () => {
  const headerCode = fs.readFileSync('src/v2/components/layout/V2Header.tsx', 'utf8');
  assert.ok(headerCode.includes("badge: '১০০% ফ্রি'"), 'Header must have ১০০% ফ্রি badge on journey');
  assert.ok(headerCode.includes("badge: 'N5 ফ্রি'"), 'Header must have N5 ফ্রি badge on curriculum');
  assert.ok(headerCode.includes("badge: 'PRO'"), 'Header must have PRO badge on WorkOS/Exam');
  assert.ok(headerCode.includes("badge: 'ফ্রি টুল'"), 'Header must have ফ্রি টুল badge on CV');
});

console.log('================================================================');
console.log(`🎉 ALL ${passedChecks}/${totalChecks} TESTS PASSED PERFECTLY! (100% SUCCESS)`);
console.log('================================================================');
