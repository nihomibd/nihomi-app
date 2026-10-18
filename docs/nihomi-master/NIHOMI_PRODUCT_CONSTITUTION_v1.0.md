# NIHOMI.COM — PRODUCT CONSTITUTION v1.0
**Document ID:** `NIHOMI-CONST-2026-V1.0`  
**Governance Authority:** Nihomi Engineering, Security Architecture, Pedagogy & Founder Office  
**Effective Date:** 18 October 2026  
**Status:** CANONICAL & BINDING SOURCE OF TRUTH  
**Guiding Principle:** `NO EVIDENCE = NO DONE` — Every product behavior must match approved rules across UI, APIs, database authorization, learning engines, and release gates.

---

## 1. Product Identity, Purpose & Legal Boundary

### 1.1 Product Definition
**Nihomi.com (にほみ)** is a commercial Japanese language-learning and real-life Japan-readiness language practice platform, accessible as a high-performance web application and installable Progressive Web App (PWA).

### 1.2 Approved Public Brand Promise
> **“From Zero Japanese to Japan-Ready.”**  
> *(শুরু থেকে জাপানের কর্মক্ষেত্র ও বাস্তব যোগাযোগের জন্য নিজেকে প্রস্তুত করুন।)*

### 1.3 Target Learner Personas
1. **Zero-Level Beginners (বাংলাভাষী নতুন শিক্ষার্থী):** Native Bengali speakers starting with zero knowledge of Japanese kana, pronunciation, or grammar.
2. **JLPT N5–N3 Candidates (জেএলপিটি পরীক্ষার্থী):** Students and professionals systematically preparing for official JLPT and NAT-TEST certifications.
3. **SSW & Technical Intern Relocation Candidates (জাপানে ক্যারিয়ার ও ইন্টার্নশিপ গমনেচ্ছু):** Skilled workers, engineers, nurses, and care-workers needing situational conversational mastery (*Baito*, convenience stores, transit, municipal procedures, and workplace *Keigo*).
4. **Intermediate Returning Learners (পুনরায় শুরু করা শিক্ষার্থী):** Learners with fragmented Japanese seeking structured diagnostic placement, active recall drills, and speaking confidence.

### 1.4 Strict Non-Negotiable Legal Disclaimer
> [!IMPORTANT]
> **LEGAL & REGULATORY BOUNDARY:**  
> 1. Nihomi.com is strictly an **educational language-learning and situational practice technology platform**.  
> 2. **Nihomi is NOT an immigration agency, recruitment firm, visa consultancy, or job placement agency.**  
> 3. Nihomi **DOES NOT GUARANTEE** visas, jobs, work permits, university admissions, or legal/immigration outcomes under any circumstances.  
> 4. All references to Tokyo workplace simulations (WorkOS, convenience store cashier dialogue, airport arrival, municipal ward registration) represent simulated communicative language drills and do not constitute official employment or legal guarantees.

---

## 2. Core Operational & Architectural Rules

### 2.1 A. Roles and Authentication
1. **Canonical Roles for this Release:**
   - **Founder** (Executive Oversight, Telemetry, and Mentorship)
   - **Student** (Learner and Subscriber)
   - *Note:* Ordinary visitors interact as Guest before signing in.
2. **Authentication Method:**
   - Both Founder and Student use Google sign-in (via Supabase Auth) once live Google Cloud Console OAuth redirect configuration is complete.
   - For resilient local execution and deterministic automated test suites, cryptographically signed HMAC-SHA256 JWT sessions are used.
3. **Server-Authoritative Role Determination (Default-Deny):**
   - Founder privileges are granted **strictly server-side** by verifying against the trusted, server-configured allowlist:
     * Authoritative Founder Identity: `mdtanvirkabirbiplob@gmail.com`
   - **NEVER trust client-provided role flags, query parameters (`?role=founder`), `localStorage` keys, or editable profile payload fields.**
   - Any authenticated email other than the authoritative founder email receives strictly the **Student** role by default.
4. **Student Data Isolation (Zero Multi-Tenant Leaks):**
   - Student A must **NEVER** be able to read, edit, export, or delete Student B's private profile, learning progress, quiz scores, or CV drafts.
   - Every API endpoint reading or writing student data must enforce tenant ownership server-side using the verified JWT subject (`req.user.id`).
   - Cross-tenant IDOR (Insecure Direct Object Reference) access attempts must be rejected with HTTP 403 Forbidden (`FORBIDDEN_STUDENT_ISOLATION`).

### 2.2 B. Free Access After Google Sign-In
Upon signing in with Google (or establishing an authenticated student session), the following core features are **100% FREE** and must never be blocked by a paywall:
1. **JLPT N5 Foundation Lessons 1–5:** Fully accessible while strictly respecting the cumulative prerequisite lattice.
2. **Kana Learning Canvas:** Complete Hiragana and Katakana stroke order, visual rice-grid writing canvas, audio pronunciation, and vector stroke evaluation.
3. **Approved Practice PDFs:** All 10 published and verified authentic Nihomi learning workbooks and worksheets (exact 45 pages, ~1.3 MB) are freely downloadable via HTTP GET 200 without subscription gating.
4. **Free JIS Standard CV / Resume Builder:** Free creation, editing, preview, and A4 PDF export of Japanese Industrial Standard (*JIS Rirekisho*) resumes for signed-in students.
5. **Approved Introductory Demos:** Tokyo Konbini Cashier first mission pilot (7-step cashier dialogue) is free for all learners to experience real-world Japanese practice.

### 2.3 C. Paid Features & Commercial Integrity
1. **Paid Feature Boundaries:**
   - Full N5 Lessons 6–25 (Advanced Minna no Nihongo units).
   - Higher-level curricula (N4, N3, N2, N1 tracks).
   - Workplace POS Hardware Simulator (`#pos-simulator-pro-lock`) and advanced WorkOS scenarios.
   - Full JLPT mock exam simulator beyond free diagnostic samples.
   - Voice Twin Interview Simulation Lab and Shokumu Keirekisho (Career History) builder.
2. **Authoritative Server-Side Payment Verification:**
   - Paid capabilities are activated **ONLY** after server-side cryptographic verification of provider payment confirmation (bKash IPN / SSLCommerz IPN / verified transaction webhook).
   - A button click, checkout redirect, URL query parameter (`?status=success`), or client-side toast message is **NEVER** accepted as proof of payment.
3. **Single Source of Truth for Pricing (Canonical 12-Price Matrix):**
   - **Nihomi Starter:** 1 Mo: **৳990** | 3 Mo: **৳2,820** | 6 Mo: **৳5,350** | 12 Mo: **৳10,100**
   - **Nihomi Pro:** 1 Mo: **৳1,990** | 3 Mo: **৳5,670** | 6 Mo: **৳10,750** | 12 Mo: **৳20,300**
   - **Nihomi Japan Ready:** 1 Mo: **৳3,990** | 3 Mo: **৳11,370** | 6 Mo: **৳21,550** | 12 Mo: **৳40,700**
   - Obsolete prices (such as ৳499) are strictly eradicated from all active client and server catalogs.
4. **Payment State Machine:**
   - Idempotent handling for `pending`, `success`, `failed`, `cancelled`, `expired`, and `refunded` states.
   - Replayed webhooks and forged signatures must be rejected with HTTP 400.
   - In the absence of live production credentials, live payments remain honestly marked as **BLOCKED** with sandboxes clearly labeled.

### 2.4 D. Nomi Sensei & Learning Content Governance
1. **Companion Identity:**
   - Public Name: **Nomi Sensei** | Bengali: **নমি সেন্সেই** | Tagline: **“বাংলায় তোমার জাপানি শেখার সঙ্গী।”**
   - Public "AI" terminology is eliminated from customer-facing companion titles.
2. **Japanese-Learning-Only Server-Side Scope Guard:**
   - Nomi Sensei is strictly an educational Japanese tutor, not a general-purpose conversational LLM.
   - Software coding, medical advice, financial trading, crypto, and general non-Japanese queries are rejected server-side with a warm, polite refusal in Bengali, redirecting the learner back to Japanese practice.
   - Strict defense against prompt injection (e.g., "ignore instructions", "reveal prompt", "DROP TABLE").
3. **Content Publishing Review:**
   - AI-generated lessons, mock exam items, vocabulary notes, and PDFs must pass prerequisite lattice validation and editorial review before publication.
   - Unreviewed or OCR-draft content (specifically N2/N1 material) must remain quarantined in editorial staging.

### 2.5 E. Learning Evidence, Privacy & Device Permissions
1. **Non-Negotiable Pedagogical Law:**
   - A learner must **NEVER** encounter an untaught Japanese character, sound-symbol combination, or structural unit inside learner-facing instructional content before the prerequisite is explicitly taught and unlocked.
   - **Immutable N.I.H.O.M.I. Learning Loop:**
     * **N** — Notice the scene — দৃশ্য দেখো।
     * **I** — Identify the task — কাজটি চেনো।
     * **H** — Hunt for signals — Clue খোঁজো।
     * **O** — Own your answer — নিজে উত্তর দাও।
     * **M** — Make meaning — কারণ বোঝো।
     * **I** — Improve and retry — আবার চেষ্টা করো।
2. **Evidence-Driven Mastery:**
   - Learning progress advances **ONLY** after validated student input (correct stroke sequence, assessed quiz answer, verified recall).
   - Incorrect attempts must **NEVER** increment mastery. Every mistake triggers warm, non-shaming Bengali coaching ("স্নেহশীল সংশোধন • কোনো লজ্জা নেই" / "ভুল থেকেই শেখা") and an instant retry.
3. **Persistence Transparency:**
   - Progress must transparently distinguish between local browser storage (`local_unverified`) and durable remote database storage (`cloud_persisted`).
4. **Device Permission Privacy:**
   - Microphone, camera, and geolocation access are **strictly optional** and requested **ONLY** when the learner initiates a specific feature requiring them (e.g., speech recognition).
   - Denying permissions must never break core lessons, quizzes, or text-based features.
5. **Consent & Privacy:**
   - Non-essential analytics tracking requires explicit learner consent via the Cookie Consent Banner.
   - Essential security audit logging remains strictly separate from marketing telemetry.
   - Support requests route exclusively through verified, founder-approved support channels.

### 2.6 F. Production Release & Capacity Truthfulness
1. **Release Gate Criteria:**
   - A Release Candidate is certified **ONLY** when all deterministic test suites exit with Code 0, multi-viewport browser tests pass with 0px horizontal overflow, and no unresolved security or functional defects exist.
2. **High-Concurrency Capacity Truth:**
   - Never claim unmeasured capacity for 50,000 to 1,000,000 concurrent users.
   - Local single-instance benchmarks (~135 req/s) serve as an empirical baseline; cloud scaling claims must be backed by staged load tests, CDN edge caching, and scalable connection pool architectures.

---

## 3. Governance & Amendment Protocol
Any modification to this Product Constitution requires:
1. Written formal proposal in an executive change request.
2. Independent verification of technical, pedagogical, and security impacts.
3. Explicit founder review and sign-off.
4. Full regression testing of all affected deterministic suites and browser journeys.
