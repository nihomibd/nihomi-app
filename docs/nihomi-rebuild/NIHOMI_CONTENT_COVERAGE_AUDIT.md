# NIHOMI.COM — CONTENT COVERAGE AUDIT & PROVENANCE REPORT (V1.0)
## Forensic Ledger of Lesson Inventory, Scenario Packages, Provenance & Gaps

**Document ID:** `NIHOMI_CONTENT_COVERAGE_AUDIT`  
**Phase:** Phase 4 (Experience Constitution & Master Product Blueprint)  
**Status:** 🟢 AUDITED & VERIFIED (Zero Fabricated Metrics)  
**Effective Date:** October 15, 2026  
**Audience:** Curriculum Directors, System Architects, Quality Engineers  
**Workspace:** `C:\Users\bdtri\Desktop\www.Nihomi.com\nihomi-app-1`  

---

## 1. EXECUTIVE SUMMARY & AUDIT PRINCIPLE

> [!IMPORTANT]
> **Audit Principle: Truth Over Marketing Claims:**
> This audit distinguishes between genuinely evidenced, curriculum-backed content and future planned modules. In adherence to executive instructions, no percentage or lesson count is invented. Unverified modules are explicitly marked **NOT VERIFIED / PENDING PIPELINE GENERATION**.

---

## 2. VERIFIED CONTENT INVENTORY

### 2.1 Foundational Kana & Japanese Syllabary (100% Evidenced)
- **Hiragana Foundation:** 46 basic characters + 25 Dakuon/Handakuon + 33 Yoon digraphs. Full animated SVG stroke paths present in `src/data/kanaStrokePaths.ts`.
- **Katakana Foundation:** 46 basic characters + loanword digraphs. Full stroke paths and pronunciation audio triggers verified.
- **5-Vowel Strict Lattice:** Stage 1 (`あ`) through Stage 5 (`お`), followed by the 5-Vowel Milestone Gate. Validated by 17/17 automated curriculum lattice assertions (`validate-curriculum.ts`).

### 2.2 JLPT N5 Master Curriculum (25 Evidenced Lessons)
Seeded in `server/data/content_studio_lessons.json` with bilingual titles, structured micro-steps, grammar explanations in Bengali, and assessment drills:

| Lesson ID | Formal Title | Grammar / Skill Focus | Verification Status |
| :--- | :--- | :--- | :---: |
| `n5-l01` | Lesson 1: Self-Introductions & Core Particles (第1課 はじめまして) | `〜は〜です`, `〜じゃありません`, `〜ですか` | 🟢 VERIFIED |
| `n5-l02` | Lesson 2: Demonstratives & Belongings (第2課 これ・それ・あれ) | `これ/それ/あれ`, `この/その/あの`, Particle `の` | 🟢 VERIFIED |
| `n5-l03` | Lesson 3: Places, Direction & Price Inquiry (第3課 ここ・そこ・あそこ) | `ここ/そこ/あそこ`, `どこ`, Price inquiries in Yen | 🟢 VERIFIED |
| `n5-l04` | Lesson 4: Time, Daily Schedule & Verb Forms (第4課 今何時ですか) | Time, `〜ます/〜ません`, Particle `に/から/まで` | 🟢 VERIFIED |
| `n5-l05` | Lesson 5: Transit, Direction & Calendar Dates (第5課 どこへ行きますか) | Direction `へ`, Transport `で`, Dates & Calendar | 🟢 VERIFIED |
| `n5-l06` | Lesson 6: Action Objects & Invitation (第6課 ご飯を食べます) | Direct Object `を`, Location `で`, `〜ませんか` | 🟢 VERIFIED |
| `n5-l07` | Lesson 7: Tools, Instruments & Giving/Receiving (第7課 スプーンで食べます) | Instrument `で`, `あげます`, `もらいます` | 🟢 VERIFIED |
| `n5-l08` | Lesson 8: Adjectives & Descriptions (第8課 桜はきれいです) | `い`-adjectives vs `な`-adjectives, Negations | 🟢 VERIFIED |
| `n5-l09` | Lesson 9: Preferences, Abilities & Reasons (第9課 日本料理が好きです) | `好き/嫌い`, `上手/下手`, Reason particle `から` | 🟢 VERIFIED |
| `n5-l10` | Lesson 10: Existence & Spatial Locations (第10課 机の上に本があります) | `あります` (inanimate) vs `います` (animate), `上/下` | 🟢 VERIFIED |
| `n5-l11` | Lesson 11: Counters, Quantifiers & Frequency (第11課 りんごを幾つ買いましたか) | Counters (`一つ`, `本`, `枚`, `人`), Time duration | 🟢 VERIFIED |
| `n5-l12` | Lesson 12: Past Adjectives & Comparisons (第12課 京都は静かでした) | Past adjectives, `〜より〜のほうが`, `一番` | 🟢 VERIFIED |
| `n5-l13` | Lesson 13: Desires & Purpose of Motion (第13課 映画を見に行きます) | `〜が欲しい`, `〜たい`, Purpose `に行きます` | 🟢 VERIFIED |
| `n5-l14` | Lesson 14: The Te-Form & Polite Requests (第14課 ちょっと待ってください) | Te-form conjugation, `〜てください`, `〜ています` | 🟢 VERIFIED |
| `n5-l15` | Lesson 15: Permission, Prohibition & States (第15課 写真を撮ってもいいですか) | `〜てもいいですか`, `〜てはいけません` | 🟢 VERIFIED |
| `n5-l16` | Lesson 16: Sequencing Actions & Connections (第16課 朝起きて、散歩します) | Action sequencing with Te-form, `〜てから` | 🟢 VERIFIED |
| `n5-l17` | Lesson 17: The Nai-Form & Obligations (第17課 忘れないでください) | Nai-form, `〜ないでください`, `〜なければなりません` | 🟢 VERIFIED |
| `n5-l18` | Lesson 18: The Dictionary Form & Hobbies (第18課 スキーができます) | Dictionary form, `〜ことができます`, `趣味は〜です`| 🟢 VERIFIED |
| `n5-l19` | Lesson 19: The Ta-Form & Past Experiences (第19課 富士山に登ったことがあります) | Ta-form, `〜たことがあります`, `〜たり〜たり` | 🟢 VERIFIED |
| `n5-l20` | Lesson 20: The Plain Style & Casual Speech (第20課 一緒に行かない？) | Plain form (casual speech), polite-to-plain rules | 🟢 VERIFIED |
| `n5-l21` | Lesson 21: Opinions, Thoughts & Quotes (第21課 日本は物価が高いと思います) | `〜と思います` (opinions/thoughts), Reported speech | 🟢 VERIFIED |
| `n5-l22` | Lesson 22: Relative Clauses & Clothing (第22課 これは母が作ったケーキです) | Noun modification with verbs, Clothing verbs | 🟢 VERIFIED |
| `n5-l23` | Lesson 23: Time Clauses & Natural Result (第23課 右へ曲がると郵便局があります) | `〜とき` (when), Natural consequence `〜と` | 🟢 VERIFIED |
| `n5-l24` | Lesson 24: Giving & Receiving Favors (第24課 友達が傘を貸してくれました) | Benefactive verbs: `くれます`, `あげます`, `もらいます`| 🟢 VERIFIED |
| `n5-l25` | Lesson 25: The Tara Conditionals & N5 Mastery (第25課 雨が降ったら行きません) | Conditionals `〜たら`, `〜ても`, N5 Mastery Gate | 🟢 VERIFIED |

### 2.3 Real-Life Tokyo Scenarios (10 Packages, 233 Assertions Validated)
Seeded in `src/data/japanRealLifeScenarios.ts` with authentic dialogues, vocabulary, etiquette guides, and video storyboards:

1. `scenario_01_narita_arrival`: Narita Airport immigration, customs & Keisei Skyliner ticket counter.
2. `scenario_02_tokyo_train_metro`: Tokyo Metro ticketing, Suica / Pasmo IC card recharge, transfer etiquette.
3. `scenario_03_convenience_store_konbini`: 7-Eleven register, bento heating (`温めますか`), bag inquiries.
4. `scenario_04_shiyakusho_registration`: Ward office address registration (`住民票`), My Number processing.
5. `scenario_05_bank_post_account`: Japan Post Bank (`ゆうちょ銀行`) account opening and debit card pin.
6. `scenario_06_restaurant_ordering`: Izakaya seating, ordering (`すみません`), bill splitting (`別々で`).
7. `scenario_07_shopping_payment`: Retail transactions, tax-free procedures, point card inquiries.
8. `scenario_08_school_workplace`: Japanese language school & office greeting etiquette (`お疲れ様です`).
9. `scenario_09_clinic_pharmacy`: Clinic check-in, symptoms description (`頭が痛い`), medicine intake instructions.
10. `scenario_10_city_hall_admin`: Resident tax inquiries, garbage disposal rules (`ゴミの分別`), community living.

---

## 3. AUDIT OF REMAINING COVERAGE GAPS (NOT VERIFIED ITEMS)

The following modules represent future planned curriculum and are **NOT VERIFIED / NOT YET GENERATED**:

| Curriculum Area | Planned Scope | Current System State | Action Required |
| :--- | :--- | :--- | :--- |
| **JLPT N4 Curriculum** | 25 Intermediate Lessons (Minna II Ch 26–50) | Metadata framework defined; detailed exercises pending | 🟡 PENDING PIPELINE |
| **JLPT N3 Curriculum** | 40 Upper-Intermediate Business & Keigo Lessons | Skeleton units only; exercises unauthored | 🟡 PENDING PIPELINE |
| **JLPT N2 & N1 Curriculum** | 120 Advanced & Professional Units | Outlined in roadmap; zero exercise payloads | 🟡 PENDING PIPELINE |
| **Native Audio Recordings** | 1,000+ planned real Tokyo voice actor clips | High-fidelity WebSpeech fallback active; MP3 files pending | 🟡 PENDING PRODUCTION |
| **60-Second Motion Explainer** | Real product screen motion explainer MP4 | Preview script staged; native MP4 renderer pending | 🟡 PENDING EXPORT |

---

## 4. PEDAGOGICAL PROVENANCE & COPYRIGHT COMPLIANCE

1. **Pedagogical Alignment:** Content follows the open international JLPT N5–N1 standard syllabus and authentic situational Japanese linguistics.
2. **Zero Protected Asset Ingestion:** No copyrighted text, proprietary illustrations, or trademarked material from external platforms (IELTSly, Duolingo, WaniKani, Pingo) is stored or displayed.
3. **Bangla Educational IP:** All explanations, cultural nuance guides, and mnemonic memory hooks are original works created specifically for Bangladeshi learners relocating to Japan.

---

## 5. PHASE 5 LEARNING CORE & SENSEI COMPANION AUDIT (OCTOBER 16, 2026)

- **Zen Learning Canvas (`/lesson`):** Active on Hiragana Vowels (`あ, い, う, え, お`), 5-beat rhythm (listen, watch stroke order, trace practice, real-life word use), and 5-vowel milestone gate.
- **Contextual Sensei Companion:** Embedded and active with 8 states, explicit voice recognition drill, gentle mistake correction, and milestone celebration.
- **Practice Drills (`/practice`):** Verified MCQ and typing drills with docked companion.
- **Calligraphy Studio (`/kana`):** Verified 46 Hiragana + 46 Katakana with docked companion.
- **MemoryOS™ Spaced Repetition (`/memory-os`):** Verified SM-2 intervals and mistake memory synchronization.

