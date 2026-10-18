/**
 * NIHOMI.COM — ENTITLEMENT CONSTITUTION & ACCESS MATRIX
 * Canonical Single Source of Truth for Free vs Paid Product Boundaries.
 * Antigravity 2.0 | Local-First Architecture | NO EVIDENCE = NO DONE
 *
 * Rules:
 * 1. FREE (Google Sign-In; no subscription required — Exactly 4 Canonical Benefits):
 *    - JLPT N5 Lessons 1–5 (Foundational lessons only; preserve prerequisite lattice)
 *    - Foundational Kana Canvas (Hiragana & Katakana with vector stroke evaluation, retry & feedback)
 *    - All 10 approved authentic Nihomi printable practice PDFs (45 pages total)
 *    - JIS Rirekisho Japanese Resume Builder (create, edit, preview, export A4 PDF)
 *    - Onboarding & 5-Track Placement Diagnostic (Zero Japanese -> Stage 1 あ)
 *    - Learner progress persistence (localStorage verified client-side)
 *
 * 2. PAID FEATURES:
 *    - Tokyo Konbini Cashier Simulator & Workplace Training (Pro / Japan Ready)
 *    - N5 Lessons 6–25 (requires Nihomi Starter, Pro, or Japan Ready)
 *    - Full N4, N3, N2, N1 advanced curriculum
 *    - Full JLPT mock exam simulator beyond free sample
 *    - Full Interview Voice Twin Lab beyond Konbini pilot
 *    - Japan Relocation and Living Tracks
 *
 * 3. APPROVED COMMERCIAL PRICING (Exact 12 Combinations):
 *    - Starter:     1M: ৳990   | 3M: ৳2,820  | 6M: ৳5,350  | 12M: ৳10,100
 *    - Pro:         1M: ৳1,990 | 3M: ৳5,670  | 6M: ৳10,750 | 12M: ৳20,300
 *    - Japan Ready: 1M: ৳3,990 | 3M: ৳11,370 | 6M: ৳21,550 | 12M: ৳40,700
 */

export type SubscriptionPlanId = 'free' | 'starter' | 'pro' | 'japan_ready' | 'guest';

export type UserRole = 'guest' | 'student' | 'instructor' | 'admin' | 'founder';

export type EntitlementFeatureKey =
  | 'onboarding_journey'
  | 'onboarding_placement'
  | 'kana_canvas'
  | 'n5_lessons_1_to_5'
  | 'practice_sheet_downloads'
  | 'jis_resume_builder'
  | 'local_progress'
  | 'konbini_pilot'
  | 'tokyo_konbini_first_mission'
  | 'n5_lessons_advanced'
  | 'n4_curriculum'
  | 'n3_curriculum'
  | 'jlpt_full_mocks'
  | 'voice_twin_interview_lab'
  | 'japan_readiness_track'
  | 'n2_n1_curriculum';

export type RequiredTier = 'FREE' | 'STARTER' | 'PRO' | 'JAPAN_READY';

export const MAX_FREE_LESSON_NUMBER = 5;

export interface EntitlementSubject {
  userId?: string;
  tier?: SubscriptionPlanId;
  role?: UserRole;
  isAuthenticated?: boolean;
}

export const CANONICAL_10_PRACTICE_SHEETS = [
  'hiragana_master_chart',
  'katakana_master_chart',
  'combined_dakuten_yoon_chart',
  'kana_stroke_order_practice',
  'kana_confusion_pairs',
  'visual_vocab_n5_sample',
  'home_practice_guide_bn',
  'kana_writing_workbook',
  'n5_kana_script_guide',
  'n5_kanji_master_sheet'
] as const;

export interface EntitlementTierDefinition {
  id: SubscriptionPlanId;
  nameBn: string;
  nameEn: string;
  prices: {
    monthly: number;
    quarterly: number;
    half_yearly: number;
    yearly: number;
  };
}

export const CANONICAL_ENTITLEMENT_TIERS: Record<string, EntitlementTierDefinition> = {
  free: {
    id: 'free',
    nameBn: 'নিহোমি ফ্রি',
    nameEn: 'Nihomi Free',
    prices: { monthly: 0, quarterly: 0, half_yearly: 0, yearly: 0 }
  },
  starter: {
    id: 'starter',
    nameBn: 'নিহোমি স্টারটার',
    nameEn: 'Nihomi Starter',
    prices: { monthly: 990, quarterly: 2820, half_yearly: 5350, yearly: 10100 }
  },
  pro: {
    id: 'pro',
    nameBn: 'নিহোমি প্রো',
    nameEn: 'Nihomi Pro',
    prices: { monthly: 1990, quarterly: 5670, half_yearly: 10750, yearly: 20300 }
  },
  japan_ready: {
    id: 'japan_ready',
    nameBn: 'নিহোমি জাপান রেডি',
    nameEn: 'Nihomi Japan Ready',
    prices: { monthly: 3990, quarterly: 11370, half_yearly: 21550, yearly: 40700 }
  }
};

export interface EntitlementFeatureDefinition {
  id: EntitlementFeatureKey;
  minimumTier: RequiredTier;
  nameBn: string;
  nameEn: string;
}

export const ENTITLEMENT_REGISTRY: Record<string, EntitlementFeatureDefinition> = {
  onboarding_journey: {
    id: 'onboarding_journey',
    minimumTier: 'FREE',
    nameBn: 'অনবোর্ডিং ও প্লেসমেন্ট জার্নি',
    nameEn: 'Onboarding & Placement Journey'
  },
  kana_canvas: {
    id: 'kana_canvas',
    minimumTier: 'FREE',
    nameBn: 'হিরাগানা ও কাতাকানা ক্যানভাস',
    nameEn: 'Kana Stroke Canvas'
  },
  n5_lessons_1_to_5: {
    id: 'n5_lessons_1_to_5',
    minimumTier: 'FREE',
    nameBn: 'JLPT N5 লেসন ০১–০৫',
    nameEn: 'JLPT N5 Lessons 1–5'
  },
  practice_sheet_downloads: {
    id: 'practice_sheet_downloads',
    minimumTier: 'FREE',
    nameBn: '১০টি অথেনটিক প্রিন্ট প্র্যাকটিস শিট',
    nameEn: '10 Authentic Printable Practice Sheets'
  },
  jis_resume_builder: {
    id: 'jis_resume_builder',
    minimumTier: 'FREE',
    nameBn: 'অফিসিয়াল JIS রিজিউমে বিল্ডার (A4 PDF)',
    nameEn: 'Official JIS Resume Builder'
  },
  local_progress: {
    id: 'local_progress',
    minimumTier: 'FREE',
    nameBn: 'লোকাল প্রগ্রেস পারসিস্টেন্স',
    nameEn: 'Local Progress Persistence'
  },
  konbini_pilot: {
    id: 'konbini_pilot',
    minimumTier: 'PRO',
    nameBn: 'টোকিও কনবিনি ক্যাশিয়ার সিমুলেটর (WorkOS)',
    nameEn: 'Tokyo Konbini Cashier Simulator (WorkOS)'
  },
  n5_lessons_advanced: {
    id: 'n5_lessons_advanced',
    minimumTier: 'STARTER',
    nameBn: 'N5 লেসন ০৬–২৫ অ্যাডভান্সড কারিকুলাম',
    nameEn: 'N5 Lessons 6–25 Advanced Curriculum'
  },
  n4_curriculum: {
    id: 'n4_curriculum',
    minimumTier: 'STARTER',
    nameBn: 'JLPT N4 কারিকুলাম',
    nameEn: 'JLPT N4 Curriculum'
  },
  n3_curriculum: {
    id: 'n3_curriculum',
    minimumTier: 'PRO',
    nameBn: 'JLPT N3 কারিকুলাম',
    nameEn: 'JLPT N3 Curriculum'
  },
  jlpt_full_mocks: {
    id: 'jlpt_full_mocks',
    minimumTier: 'PRO',
    nameBn: 'পূর্ণাঙ্গ JLPT মক এক্সাম সিমুলেটর',
    nameEn: 'Full JLPT Mock Exam Simulator'
  },
  voice_twin_interview_lab: {
    id: 'voice_twin_interview_lab',
    minimumTier: 'PRO',
    nameBn: 'ভয়েস টুইন ইন্টারভিউ সিমুলেটর ল্যাব',
    nameEn: 'Voice Twin Interview Simulator Lab'
  },
  japan_readiness_track: {
    id: 'japan_readiness_track',
    minimumTier: 'JAPAN_READY',
    nameBn: 'জাপান ক্যারিয়ার ও রিলোকেশন ট্র্যাক',
    nameEn: 'Japan Career & Relocation Track'
  },
  n2_n1_curriculum: {
    id: 'n2_n1_curriculum',
    minimumTier: 'JAPAN_READY',
    nameBn: 'N2/N1 এডভান্সড মাস্টার কারিকুলাম',
    nameEn: 'N2/N1 Advanced Master Curriculum'
  }
};

/**
 * Feature to Minimum Required Tier Mapping
 */
export const FEATURE_ENTITLEMENT_MAP: Record<EntitlementFeatureKey, RequiredTier> = {
  // Free Entitlements (Exactly 4 Canonical Benefits + Onboarding & Local Progress)
  onboarding_journey: 'FREE',
  onboarding_placement: 'FREE',
  kana_canvas: 'FREE',
  n5_lessons_1_to_5: 'FREE',
  practice_sheet_downloads: 'FREE',
  jis_resume_builder: 'FREE',
  local_progress: 'FREE',

  // Paid Entitlements
  konbini_pilot: 'PRO',
  tokyo_konbini_first_mission: 'PRO',
  n5_lessons_advanced: 'STARTER', // Lessons 6–25
  n4_curriculum: 'STARTER',
  n3_curriculum: 'PRO',
  jlpt_full_mocks: 'PRO',
  voice_twin_interview_lab: 'PRO',
  japan_readiness_track: 'JAPAN_READY',
  n2_n1_curriculum: 'JAPAN_READY'
};

const TIER_HIERARCHY: Record<RequiredTier, number> = {
  FREE: 0,
  STARTER: 1,
  PRO: 2,
  JAPAN_READY: 3
};

const PLAN_TO_TIER: Record<SubscriptionPlanId, RequiredTier> = {
  guest: 'FREE',
  free: 'FREE',
  starter: 'STARTER',
  pro: 'PRO',
  japan_ready: 'JAPAN_READY'
};

export interface EntitlementEvaluation {
  allowed: boolean;
  granted: boolean; // Alias for test compatibility
  requiredTier: RequiredTier;
  currentTier: RequiredTier;
  reasonBn: string;
}

/**
 * Evaluates whether a user on a given plan can access a specific feature.
 * Supports both:
 * 1. evaluateEntitlement(subject, feature)
 * 2. evaluateEntitlement(planId, feature, role)
 */
export function evaluateEntitlement(
  subjectOrPlan: EntitlementSubject | SubscriptionPlanId = 'free',
  feature: EntitlementFeatureKey,
  roleArg?: UserRole
): EntitlementEvaluation {
  let planId: SubscriptionPlanId = 'free';
  let role: UserRole | undefined = roleArg;

  if (typeof subjectOrPlan === 'object' && subjectOrPlan !== null) {
    planId = subjectOrPlan.tier || (subjectOrPlan.isAuthenticated ? 'free' : 'guest');
    role = subjectOrPlan.role;
  } else {
    planId = subjectOrPlan as SubscriptionPlanId;
  }

  // Admins & Founders bypass all commercial paywalls
  if (role === 'admin' || role === 'founder') {
    const res: EntitlementEvaluation = {
      allowed: true,
      granted: true,
      requiredTier: FEATURE_ENTITLEMENT_MAP[feature] || 'FREE',
      currentTier: 'JAPAN_READY',
      reasonBn: 'অ্যাডমিন/ফাউন্ডার প্রিভিলেজে সম্পূর্ণ অ্যাক্সেস উন্মুক্ত।'
    };
    return res;
  }

  const requiredTier = FEATURE_ENTITLEMENT_MAP[feature] || 'PRO';
  const currentTier = PLAN_TO_TIER[planId] || 'FREE';

  const allowed = TIER_HIERARCHY[currentTier] >= TIER_HIERARCHY[requiredTier];

  let reasonBn = 'অনুমোদিত।';
  if (!allowed) {
    if (requiredTier === 'STARTER') {
      reasonBn = 'এই অ্যাডভান্সড পাঠটি আনলক করতে নিহোমি স্টারটার বা প্রো সাবস্ক্রিপশন প্রয়োজন (লেসন ০১–০৫ সম্পূর্ণ ফ্রি)।';
    } else if (requiredTier === 'PRO') {
      reasonBn = 'ফুল JLPT মক এক্সাম ও ইন্টারভিউ ল্যাব আনলক করতে নিহোমি প্রো মেম্বারশিপ প্রয়োজন।';
    } else if (requiredTier === 'JAPAN_READY') {
      reasonBn = 'সম্পূর্ণ জাপান ক্যারিয়ার ও রিলোকেশন ট্র্যাক আনলক করতে নিহোমি জাপান রেডি মেম্বারশিপ প্রয়োজন।';
    }
  }

  return {
    allowed,
    granted: allowed,
    requiredTier,
    currentTier,
    reasonBn
  };
}

/**
 * Checks whether a specific N5 lesson number is free or paid.
 * Supports both:
 * 1. evaluateLessonAccess(lessonNumber, planId, role)
 * 2. evaluateLessonAccess(subject, lessonNumber)
 */
export function evaluateLessonAccess(
  subjectOrLesson: EntitlementSubject | number,
  planOrLesson: SubscriptionPlanId | number = 'free',
  role?: UserRole
): EntitlementEvaluation {
  let lessonNumber: number;
  let planId: SubscriptionPlanId = 'free';
  let activeRole: UserRole | undefined = role;

  if (typeof subjectOrLesson === 'object' && subjectOrLesson !== null) {
    lessonNumber = typeof planOrLesson === 'number' ? planOrLesson : 1;
    planId = subjectOrLesson.tier || 'free';
    activeRole = subjectOrLesson.role;
  } else {
    lessonNumber = Number(subjectOrLesson);
    planId = (typeof planOrLesson === 'string' ? planOrLesson : 'free') as SubscriptionPlanId;
  }

  if (activeRole === 'admin' || activeRole === 'founder') {
    return {
      allowed: true,
      granted: true,
      requiredTier: 'FREE',
      currentTier: 'JAPAN_READY',
      reasonBn: 'অ্যাডমিন/ফাউন্ডার প্রিভিলেজে সকল লেসন উন্মুক্ত।'
    };
  }

  if (lessonNumber <= MAX_FREE_LESSON_NUMBER) {
    return {
      allowed: true,
      granted: true,
      requiredTier: 'FREE',
      currentTier: PLAN_TO_TIER[planId] || 'FREE',
      reasonBn: `লেসন ০১ থেকে ০৫ পর্যন্ত সবার জন্য সম্পূর্ণ ফ্রি। আপনার বর্তমান লেসন: ${lessonNumber}।`
    };
  }

  // Lesson > 5 requires Starter or above
  return evaluateEntitlement(planId, 'n5_lessons_advanced', activeRole);
}

/**
 * Checks whether a worksheet download is free.
 * All 10 canonical Nihomi practice workbooks are 100% FREE.
 */
export function isWorksheetFree(_worksheetKey: string): boolean {
  return true;
}

/**
 * Checks whether a JIS Resume Builder action is free.
 * Creating, editing, previewing, and exporting A4 PDF are 100% FREE.
 */
export function isResumeBuilderActionFree(action: 'create' | 'edit' | 'preview' | 'export_pdf' | 'ai_keigo_polish'): boolean {
  if (action === 'ai_keigo_polish') {
    return true;
  }
  return true; // create, edit, preview, export_pdf are all 100% FREE
}

/**
 * Approved Legal & Pedagogical Disclaimer for CV Builder
 */
export const CV_BUILDER_LEGAL_DISCLAIMER_BN =
  'নিহোমি রিজিউমে বিল্ডার একটি তথ্য ও ফরম্যাটিং সহায়ক ফ্রি টুল। এটি কোনো নিশ্চিত চাকরি, ভিসা অনুমোদন বা ভর্তির নিশ্চয়তা প্রদান করে না। ব্যবহারকারী প্রদত্ত তথ্যের সত্যতার দায়ভার ব্যবহারকারীর নিজের।';
