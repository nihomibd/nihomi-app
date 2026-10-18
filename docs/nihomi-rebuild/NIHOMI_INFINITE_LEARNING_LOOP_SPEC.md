# NIHOMI.COM — INFINITE LEARNING LOOP SPECIFICATION (V1.0)
## Governed Pedagogical Pipeline, Dynamic Practice Generation & Quality Assurance Architecture

**Document ID:** `NIHOMI_INFINITE_LEARNING_LOOP_SPEC`  
**Phase:** Phase 4 (Experience Constitution & Master Product Blueprint)  
**Status:** 🟢 APPROVED SPECIFICATION (Implementation-Ready)  
**Effective Date:** October 15, 2026  
**Audience:** Curriculum Engineers, AI Pipeline Architects, Quality Engineers  
**Workspace:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1`  

---

## 1. THE PROBLEM & ARCHITECTURAL AXIOM

Uncontrolled AI generation in language education is inherently dangerous: LLMs hallucinate kanji above the student's level, generate grammatically invalid distractors, or teach untaught vocabulary prematurely.

### Non-Negotiable Pipeline Axiom:
> **"NO UNREVIEWED AUTO-PUBLICATION. NO BYPASSING THE CUMULATIVE LATTICE."**  
> Dynamic practice items must pass an authoritative 10-stage validation pipeline before reaching a student's screen.

---

## 2. THE 10-STAGE GOVERNED LEARNING LOOP PIPELINE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE GOVERNED INFINITE LEARNING LOOP                   │
└─────────────────────────────────────────────────────────────────────────────┘
  [1. SOURCE CURRICULUM MAPPING] (JLPT N5-N1 / Minna no Nihongo syllabus anchor)
                │
                ▼
  [2. DRAFT GENERATION] (AI pipeline generates draft exercises with seed data)
                │
                ▼
  [3. PREREQUISITE LATTICE GATE] (Cryptographic check against student knowledge state)
                │  └── Rejected if ANY untaught kana, kanji, or grammar is detected
                ▼
  [4. LINGUISTIC & BENGALI QA] (Natural phrasing, cultural nuance, no machine artifacts)
                │
                ▼
  [5. DISTRACTOR & ANSWER VALIDATOR] (Exact 1 correct answer, 3 plausible distractors)
                │
                ▼
  [6. APPROVAL & VERSIONING] (Founder / Pedagogical Lead review in Content Studio)
                │  └── Assigned immutable version ID (e.g. `n5-l02-ex04-v1.0.0`)
                ▼
  [7. SECURE PUBLICATION] (Persisted to durable storage: `nihomi_db.json` / Supabase)
                │
                ▼
  [8. LEARNER EVIDENCE CAPTURE] (Real student input, timestamp, error diagnosis)
                │
                ▼
  [9. MEMORYOS™ SPACES RETRIEVAL] (SuperMemo-2 adaptive intervals: 1d, 3d, 7d, 14d, 30d)
                │
                ▼
  [10. NEXT PRACTICE ITEM SYNTHESIS] (Targets diagnosed weaknesses with new drills)
```

---

## 3. STEP-BY-STEP STAGE SPECIFICATIONS

### Stage 1: Source Curriculum Mapping
- Every lesson or exercise must anchor directly to an established JLPT N5–N1 unit and the 10 Real Tokyo Scenarios.
- Unanchored or disconnected topics (e.g. random pop-culture slang) are prohibited from the foundational core.

### Stage 2: Structured Draft Generation
- AI models receive a deterministic JSON schema containing:
  - Allowed character set (whitelisted from student's unlocked glyphs).
  - Target grammar pattern (e.g. `〜です`, `〜ではありません`).
  - Target vocabulary tokens.

### Stage 3: Strict Prerequisite Lattice Validation Gate
- Automated filter executed by `assertContentLatticeCompliant(content, unlockedPrerequisites)`:
  - If a draft lesson contains `さ` when the student only knows `{ あ, い, う, え, お }`, the item is **REJECTED AT THE GATE**.
  - No generated item can bypass prerequisite graph traversal.

### Stage 4: Linguistic & Bengali Quality Assurance
- Bengali explanations must be reviewed for warmth, clarity, and grammatical correctness.
- Overly robotic literal translations (e.g. "আমি একটি আপেল খাইয়া থাকি") are replaced with natural Bengali idiom ("আমি আপেল খাই").

### Stage 5: Distractor & Answer Key Validation
- Every multiple-choice exercise must have:
  - Exactly **one** unambiguously correct answer.
  - Three distinct distractors representing known student confusion patterns (e.g. visual stroke similarity, phonemic contrast).
  - Explicit Bengali explanations for *why* each distractor is incorrect.

### Stage 6: Authoritative Versioning & Storage
- Approved content packages receive cryptographic checksums and semantic versioning (`v1.0.0`).
- No dynamic content is executed via unsafe `eval()` or unvetted client-side scripts.

### Stage 7: Durable Publication
- Seeded into durable database state (`server/data/content_studio_lessons.json` and PostgreSQL).

### Stage 8: Learner Evidence Logging
- Every answer submission records:
  - `learnerId`, `lessonId`, `exerciseId`, `selectedOption`, `isCorrect`, `responseTimeMs`, `timestamp`.
  - Submissions are strictly idempotent (preventing duplicate XP reward hacking).

### Stage 9: MemoryOS™ Spaced Retrieval Scheduling
- Implements the SuperMemo-2 (SM-2) spaced repetition algorithm:
  - Incorrect answers: interval resets to 1 day.
  - Correct answers: interval increases exponentially (1d ➔ 3d ➔ 7d ➔ 14d ➔ 30d ➔ 90d).

### Stage 10: Adaptive Weakness Synthesis
- If a learner repeatedly confuses `あ` and `お`, the loop automatically prioritizes diagnostic comparison drills rather than blindly advancing to consonant modules.

---

## 4. HONEST MARKETING BOUNDARIES (ZERO FALSE PROMISES)

> [!WARNING]
> **Strict Regulatory Prohibition:**
> The term "Unlimited AI" is explicitly banned from active customer marketing copy. The platform provides governed, high-value, quota-protected AI interactions that ensure both pedagogical safety and operational sustainability.
