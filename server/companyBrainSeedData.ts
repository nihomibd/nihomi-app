import {
  MrrTarget,
  MarketTarget,
  AiOfficeDepartment,
  ApprovalRequest,
  BudgetWallet,
  CompanyBrainItem,
  FounderAuditLog
} from './types.js';

export const INITIAL_MRR_TARGET: MrrTarget = {
  id: 'mrr-target-primary',
  targetAmount: 10000, // $10,000
  currency: 'USD',
  deadline: '2026-12-31',
  operatingBudget: 50000, // ৳50,000
  operatingBudgetCurrency: 'BDT',
  growthPriority: 'Balanced',
  riskLevel: 'Medium',
  isActive: true,
  notes: 'Primary scale objective: Reach $10k MRR across 1,000+ active Bangladeshi learners transitioning to Japan.',
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: new Date().toISOString()
};

export const INITIAL_MARKET_TARGET: MarketTarget = {
  id: 'market-target-primary',
  primaryMarket: 'Bangladesh',
  secondaryMarket: 'Japan',
  experimentalMarket: 'Global',
  geography: 'Dhaka, Chittagong, Sylhet, Tokyo, Osaka',
  customerSegment: 'Japanese N5/N4 Learners & SSW / Student Visa Candidates',
  language: 'Bangla, Japanese, English',
  priceRange: '৳299 - ৳999/mo ($3 - $10 USD)',
  acquisitionChannels: [
    'Facebook Japanese Learning Groups (Organic)',
    'YouTube Bangla-Japanese Explainer Videos',
    'Dhaka University & Daffodil Campus Japanese Clubs',
    'SSW Language Center Partnerships'
  ],
  priority: 'P0',
  timeframe: 'Q4 2026 (30-90 Days)',
  isActive: true,
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: new Date().toISOString()
};

export const INITIAL_AI_OFFICE_DEPARTMENTS: AiOfficeDepartment[] = [
  {
    id: 'ai-dept-coo',
    code: 'AI_COO',
    name: 'AI Chief Operating Officer',
    role: 'Executive Orchestrator & Autonomous Ops Supervisor',
    description: 'Monitors office rhythm, KPI gaps, cross-agent coordination, and HITL proposal flow.',
    status: 'NOT_CONFIGURED',
    statusDetails: 'Gate 2 Foundation ready. Autonomous loop gated pending Founder production greenlight.',
    monthlyBudgetLimit: 10000,
    monthlyBudgetCurrency: 'BDT',
    spentThisMonth: 0,
    concurrencyLimit: 2,
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'ai-dept-cto',
    code: 'AI_CTO',
    name: 'AI Chief Technology Officer',
    role: 'System Architect & Infrastructure Reliability Officer',
    description: 'Watches error logs, Supabase sync status, database backup integrity, and latency.',
    status: 'RUNNING',
    statusDetails: 'Monitoring /api/health probes and automated database backup service.',
    monthlyBudgetLimit: 12000,
    monthlyBudgetCurrency: 'BDT',
    spentThisMonth: 350,
    concurrencyLimit: 3,
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'ai-dept-product',
    code: 'AI_PRODUCT',
    name: 'AI Product Director',
    role: 'Learner Journey & Feature Optimization Specialist',
    description: 'Evaluates drop-offs, N5 quiz completion funnels, and mobile responsiveness metrics.',
    status: 'RUNNING',
    statusDetails: 'Analyzing N5 Lesson 1-5 funnel retention telemetry.',
    monthlyBudgetLimit: 8000,
    monthlyBudgetCurrency: 'BDT',
    spentThisMonth: 120,
    concurrencyLimit: 2,
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'ai-dept-content',
    code: 'AI_CONTENT',
    name: 'AI Curriculum Specialist & Content Engine',
    role: 'Minna no Nihongo & JLPT N5-N1 Knowledge Synthesizer',
    description: 'Ingests PDF/DOCX textbook sources, extracts vocabulary/grammar, and prepares drafts.',
    status: 'RUNNING',
    statusDetails: 'Curriculum Content Assistant active with Nihomi 14-Point Standard validation.',
    monthlyBudgetLimit: 15000,
    monthlyBudgetCurrency: 'BDT',
    spentThisMonth: 1850,
    concurrencyLimit: 4,
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'ai-dept-marketing',
    code: 'AI_MARKETING',
    name: 'AI Growth & Acquisition Strategist',
    role: 'Organic Content Ideation & Campaign Formulator',
    description: 'Designs Facebook and YouTube hook scripts for Bangladeshi learners in Bangla.',
    status: 'PAUSED',
    statusDetails: 'Ad spend firewall engaged. Awaiting Founder marketing budget allocation.',
    monthlyBudgetLimit: 10000,
    monthlyBudgetCurrency: 'BDT',
    spentThisMonth: 0,
    concurrencyLimit: 1,
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'ai-dept-sales',
    code: 'AI_SALES',
    name: 'AI Enrollment & Conversion Guide',
    role: 'Subscription Funnel & Cart Recovery Advisor',
    description: 'Answers pricing queries and advises learners on Starter vs Pro vs Japan-Ready.',
    status: 'NOT_CONFIGURED',
    statusDetails: 'Lead capture active via /start campaign landing flow.',
    monthlyBudgetLimit: 6000,
    monthlyBudgetCurrency: 'BDT',
    spentThisMonth: 0,
    concurrencyLimit: 2,
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'ai-dept-finance',
    code: 'AI_FINANCE',
    name: 'AI Comptroller & Unit Economics Guard',
    role: 'MRR Tracking & AI Cost Auditor',
    description: 'Tracks API token consumption vs subscription revenue and enforces Budget Firewall.',
    status: 'RUNNING',
    statusDetails: 'AI Cost Guard operational. Budget Firewall enforced statelessly.',
    monthlyBudgetLimit: 5000,
    monthlyBudgetCurrency: 'BDT',
    spentThisMonth: 45,
    concurrencyLimit: 2,
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'ai-dept-operations',
    code: 'AI_OPERATIONS',
    name: 'AI Operations & SOP Compliance Manager',
    role: 'Workflow Standardizer & Process Monitor',
    description: 'Maintains Company Brain SOP references and verifies task lifecycle execution.',
    status: 'RUNNING',
    statusDetails: 'All operations compliant with AGENTS.md and NIHOMI Master Instructions.',
    monthlyBudgetLimit: 5000,
    monthlyBudgetCurrency: 'BDT',
    spentThisMonth: 80,
    concurrencyLimit: 2,
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'ai-dept-support',
    code: 'AI_SUPPORT',
    name: 'AI Student Sensei Support',
    role: 'Triage & Learner Problem Resolver',
    description: 'Assists students facing audio playback, kana confusion, or login challenges.',
    status: 'RUNNING',
    statusDetails: 'Interactive Sensei Coach operational under daily quota controls.',
    monthlyBudgetLimit: 8000,
    monthlyBudgetCurrency: 'BDT',
    spentThisMonth: 620,
    concurrencyLimit: 5,
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'ai-dept-qa',
    code: 'AI_QA',
    name: 'AI Security Auditor & Test Engineer',
    role: 'Gate Verification & Regression Shield',
    description: 'Executes automated security matrices (A-O), validates tokens, and checks RLS.',
    status: 'RUNNING',
    statusDetails: 'Gate 1 Security Matrix 15/15 PASS verified. Zero regression detected.',
    monthlyBudgetLimit: 7000,
    monthlyBudgetCurrency: 'BDT',
    spentThisMonth: 150,
    concurrencyLimit: 2,
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'ai-dept-analytics',
    code: 'AI_ANALYTICS',
    name: 'AI Learner Memory & Retention Analyst',
    role: 'Cognitive Curve & SRS Error Modeler',
    description: 'Aggregates particle confusion, mora flattening rates, and ghost weakness lists.',
    status: 'RUNNING',
    statusDetails: 'Analyzing cohort phonetic interference and SRS Leitner transitions.',
    monthlyBudgetLimit: 6000,
    monthlyBudgetCurrency: 'BDT',
    spentThisMonth: 210,
    concurrencyLimit: 2,
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'ai-dept-japan-intel',
    code: 'AI_JAPAN_INTEL',
    name: 'AI Japan Intelligence & Relocation Desk',
    role: 'Visa, SSW, Baito & Cost-of-Living Researcher',
    description: 'Compiles real Japanese immigration policies, part-time wage standards, and keigo manuals.',
    status: 'RUNNING',
    statusDetails: 'BaitoOS 2.0 convenience store scenarios and JIS resume generator verified.',
    monthlyBudgetLimit: 8000,
    monthlyBudgetCurrency: 'BDT',
    spentThisMonth: 110,
    concurrencyLimit: 2,
    lastActiveAt: new Date().toISOString()
  }
];

export const INITIAL_APPROVAL_REQUESTS: ApprovalRequest[] = [
  {
    request_id: 'appr-curriculum-n4-batch',
    request: 'Commission automated JLPT N4 25-Lesson Curriculum Draft Batch',
    department: 'AI Curriculum & Content',
    amount: 3500,
    currency: 'BDT',
    risk: 'Medium',
    expected_outcome: 'Generates structured drafts for Minna no Nihongo II Lessons 26-50 with audio text & Bangla explanations.',
    AI_recommendation: 'Recommend approval. Unlocks N4 progression for current 20+ students finishing N5.',
    status: 'PENDING',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    request_id: 'appr-marketing-fb-organic',
    request: 'Deploy Dhaka University Japanese Club Pilot Sponsorship Offer',
    department: 'AI Growth & Marketing',
    amount: 5000,
    currency: 'BDT',
    risk: 'Low',
    expected_outcome: 'Provides 50 sponsored Starter tier memberships to student club executives in exchange for campus referral links.',
    AI_recommendation: 'High organic viral leverage. Target CAC estimated at under ৳100 per paying convert.',
    status: 'PENDING',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    request_id: 'appr-infra-pg-backup',
    request: 'Automated 12-Hour Daily Cloud PostgreSQL Backup Replication',
    department: 'AI Technology & Infrastructure',
    amount: 1200,
    currency: 'BDT',
    risk: 'Low',
    expected_outcome: 'Zero data-loss redundancy for student progress and subscription ledgers.',
    AI_recommendation: 'Already passed Gate 1 testing. Highly recommended for production resilience.',
    status: 'APPROVED',
    founder_decision: 'Approved by Founder. Essential for student data durability.',
    created_at: '2026-09-20T10:00:00.000Z',
    decided_at: '2026-09-21T14:30:00.000Z',
    result: 'Active in databaseBackupService.'
  }
];

export const INITIAL_BUDGET_WALLETS: BudgetWallet[] = [
  {
    id: 'wallet-approved-total',
    name: 'Monthly Approved Operating Budget',
    description: 'Master cap approved by Founder for all operations and software this calendar month.',
    monthly_limit: 50000,
    daily_limit: 2500,
    approval_threshold: 5000,
    alert_threshold: 40000,
    spent_amount: 3595,
    remaining_amount: 46405,
    currency: 'BDT',
    status: 'HEALTHY',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'wallet-marketing',
    name: 'Marketing & Student Acquisition Wallet',
    description: 'Campus events, ad test batches, promotional materials, and creator collaborations.',
    monthly_limit: 20000,
    daily_limit: 1000,
    approval_threshold: 3000,
    alert_threshold: 16000,
    spent_amount: 0,
    remaining_amount: 20000,
    currency: 'BDT',
    status: 'HEALTHY',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'wallet-experiment',
    name: 'Growth & Product Experiments Wallet',
    description: 'A/B testing, cohort incentive prizes, and new feature validation pilots.',
    monthly_limit: 10000,
    daily_limit: 600,
    approval_threshold: 2000,
    alert_threshold: 8000,
    spent_amount: 500,
    remaining_amount: 9500,
    currency: 'BDT',
    status: 'HEALTHY',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'wallet-ai',
    name: 'AI Model Inference & Token Wallet',
    description: 'Gemini 3.8 Flash, TTS pronunciation evaluation, and curriculum extraction compute.',
    monthly_limit: 8000,
    daily_limit: 400,
    approval_threshold: 1500,
    alert_threshold: 6500,
    spent_amount: 1845,
    remaining_amount: 6155,
    currency: 'BDT',
    status: 'HEALTHY',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'wallet-infrastructure',
    name: 'Cloud Hosting & Storage Wallet',
    description: 'Supabase PostgreSQL, Cloud Run compute, domain routing, and media storage.',
    monthly_limit: 7000,
    daily_limit: 350,
    approval_threshold: 2000,
    alert_threshold: 5500,
    spent_amount: 1250,
    remaining_amount: 5750,
    currency: 'BDT',
    status: 'HEALTHY',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'wallet-reserve',
    name: 'Contingency & Reserve Wallet',
    description: 'Emergency security patches, payment gateway chargeback reserves, and unforeseen costs.',
    monthly_limit: 5000,
    daily_limit: 250,
    approval_threshold: 1000,
    alert_threshold: 4000,
    spent_amount: 0,
    remaining_amount: 5000,
    currency: 'BDT',
    status: 'HEALTHY',
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_COMPANY_BRAIN_ITEMS: CompanyBrainItem[] = [
  {
    id: 'brain-constitution',
    category: 'CONSTITUTION',
    title: 'Nihomi Founder Constitution & Inviolable Principles',
    summary: 'The founding doctrine and strict operating philosophy of NIHOMI.COM.',
    content: `1. ONE STUDENT → ONE NIHOMI ACCOUNT → ONE CONTINUOUS LEARNING JOURNEY.
Every interaction strengthens the student's personal memory and progression.

2. BANGLA-FIRST USABILITY WITH JAPAN-GRADE ACCURACY.
A student from Dhaka or Chittagong must feel immediately understood in Bangla while learning authentic Tokyo standard Japanese.

3. TRUTHFUL COMMERCE & ETHICAL BILLING.
No hidden rebills, fake urgency timers, or simulated payments. Every BDT charged must represent clear educational value.

4. 10X DISCIPLINE OVER COMPLEXITY.
A solo founder succeeds through simple, bulletproof systems. Avoid microservices, speculative architecture, and vanity metrics.

5. AI AS A PRODUCTIVE ENGINE, NEVER AN UNCONTROLLED RUNAWAY.
All AI features must pass strict token cost guards. Autonomous financial movement, schema alterations, or unreviewed publishing are permanently forbidden.`,
    author: 'Founder (mdtanvirkabirbiplob@gmail.com)',
    tags: ['constitution', 'core', 'philosophy', 'rules'],
    status: 'ACTIVE',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'brain-vision-mission',
    category: 'VISION_MISSION',
    title: 'Nihomi Vision 2030 & Mission Statement',
    summary: 'Long-term destination: 50,000 skilled Bangladeshi professionals empowered for Japan.',
    content: `VISION:
To become the definitive digital bridge between Bangladesh and Japan—empowering 50,000+ Bangladeshi youths with JLPT fluency, cultural readiness, and direct career mobility by 2030.

MISSION:
Democratize elite Japanese language education across Bangladesh through personalized AI Sensei coaching, cognitive spaced repetition, authentic baito simulations, and transparent pricing in Bangladeshi Taka (BDT).`,
    author: 'Founder',
    tags: ['vision', 'mission', '2030', 'strategy'],
    status: 'ACTIVE',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'brain-pricing-decisions',
    category: 'DECISION_LOG',
    title: 'Decision 014: Pricing Model Architecture & Tiers (BDT)',
    summary: 'Approved four-tier pricing architecture tailored for Bangladeshi students.',
    content: `CONTEXT:
Previous exploratory plans lacked clear differentiation between self-study and relocation aspirants.

DECISION:
1. FREE TIER (৳0): Kana mastery, N5 Lessons 1-3 preview, 10 AI coach turns/month.
2. STARTER TIER (৳299/mo | ৳2,490/yr): Complete N5 & N4 curriculum, full quizzes, 100 AI coach turns/month.
3. PRO TIER (৳599/mo | ৳4,990/yr): N5-N3 full library, unlimited AI Sensei, Mock Exam simulator with scaled scoring.
4. JAPAN READY TIER (৳999/mo | ৳8,490/yr): Tokyo BaitoOS simulation, JIS resume builder, live visa interview lab, Keigo mastery.

RATIONALE:
Bangladeshi student purchasing power is sensitive. ৳299/mo is low friction (less than a fast-food meal), enabling high volume adoption, while ৳999/mo captures high intent for serious relocation candidates.`,
    author: 'Founder',
    tags: ['pricing', 'bdt', 'decision', 'tiers'],
    status: 'ACTIVE',
    createdAt: '2026-09-10T12:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'brain-risk-register',
    category: 'RISK_REGISTER',
    title: 'Active Risk Register (Q4 2026)',
    summary: 'Top operational, financial, and pedagogical risks with mitigations.',
    content: `RISK 1: Payment Gateway Operational Delay (bKash / EPS live merchant approval)
- Severity: HIGH
- Status: Awaiting merchant credentials.
- Mitigation: Truthful reporting in place. Sandbox testing complete. Zero mock success states.

RISK 2: LLM Token Cost Inflation on Free Users
- Severity: MEDIUM
- Mitigation: aiCostGuard strictly enforces 3-10 turns/day for free users and concurrency locks.

RISK 3: Student Drop-Off at Kanji N5 (The "Kanji Wall")
- Severity: MEDIUM
- Mitigation: Mnemonics, stroke animations, and Leitner SRS cards implemented with Bengali breakdowns.

RISK 4: Prompt Injection or Inappropriate Responses
- Severity: MEDIUM
- Mitigation: aiSafetyGuard pre-dispatch sanitizer blocks jailbreak signatures and strips delimiter tokens.`,
    author: 'AI QA & Security / Founder',
    tags: ['risks', 'security', 'mitigation', 'q4-2026'],
    status: 'ACTIVE',
    createdAt: '2026-09-15T09:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'brain-experiment-001',
    category: 'EXPERIMENT_REGISTRY',
    title: 'Experiment 001: Dhaka Campus Ambassador WhatsApp Referral Loop',
    summary: 'Hypothesis: Peer recommendation with free N5 mock exam unlocks 30%+ viral coefficient.',
    content: `HYPOTHESIS:
If campus ambassadors distribute a free JLPT N5 diagnostic mock exam link with custom referral parameters, students will complete the test and convert to Starter (৳299) at a rate > 8%.

SAMPLE SIZE:
250 university students across DU, NSU, and BRAC.

METRICS TRACKED:
- Link clicks
- Diagnostic exam completions
- Starter tier checkout rate within 7 days
- Referral commission payouts (20% Nihomi Coins)

STATUS:
PREPARED (Scheduled for deployment post-payment gateway production activation).`,
    author: 'AI Growth Strategist',
    tags: ['experiment', 'growth', 'campus', 'referral'],
    status: 'ACTIVE',
    createdAt: '2026-09-18T16:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'brain-lessons-learned',
    category: 'LESSONS_LEARNED',
    title: 'Lessons Learned: Pedagogical Insights from Bangladeshi Japanese Learners',
    summary: 'Phonetic and grammatical tendencies specific to Bengali speakers.',
    content: `KEY FINDINGS:
1. Bengali speakers struggle with Japanese mora timing (often shortening long vowels 'chōon' or skipping 'sokuon' glottal stops).
2. 'Wa' vs 'Ga' particle confusion is high because Bengali doesn't have an exact topic vs subject particle equivalent.
3. Polite language (Teineigo) is intuitive for Bengalis because of 'Apni' vs 'Tumi', but Sonkeigo (honorific) and Kenjougo (humble) require structured situational contrast drills.
4. Voice shadowing feedback in Bangla delivers 2.4x higher comprehension than English explanations.`,
    author: 'Curriculum Specialist',
    tags: ['pedagogy', 'bangla', 'phonetics', 'lessons-learned'],
    status: 'ACTIVE',
    createdAt: '2026-09-12T11:00:00.000Z',
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_FOUNDER_AUDIT_LOGS: FounderAuditLog[] = [
  {
    id: 'flog-gate1-verification',
    timestamp: '2026-09-22T04:03:15.000Z',
    actor: 'Primary Founder',
    actorEmail: 'mdtanvirkabirbiplob@gmail.com',
    action: 'GATE_1_SECURITY_VERIFICATION_EXECUTED',
    target: 'NIHOMI Core Architecture',
    reason: 'Executed 15-point automated security & cryptographic verification suite.',
    dataSource: 'server/tests/gate1_security_test_matrix.ts',
    risk: 'Low',
    approvalStatus: 'NOT_REQUIRED',
    result: 'SUCCESS',
    metadata: { passedTests: 15, totalTests: 15 }
  },
  {
    id: 'flog-mrr-target-set',
    timestamp: '2026-09-22T04:15:00.000Z',
    actor: 'Primary Founder',
    actorEmail: 'mdtanvirkabirbiplob@gmail.com',
    action: 'MRR_TARGET_INITIALIZED',
    target: 'Business Strategy Objective',
    reason: 'Established Q4 2026 scale target of $10,000 USD (৳1,200,000 BDT).',
    dataSource: 'Founder Cockpit',
    risk: 'Low',
    approvalStatus: 'NOT_REQUIRED',
    result: 'SUCCESS',
    metadata: { targetAmount: 10000, currency: 'USD', deadline: '2026-12-31' }
  }
];
