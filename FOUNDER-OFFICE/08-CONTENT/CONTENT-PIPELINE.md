# CONTENT-PIPELINE.md — CURRICULUM INGESTION & PUBLISHING PIPELINE

**Architecture**: 10-Stage Pedagogy Production Pipeline  
**Flow**: `PDF → OCR / Document Understanding → Structure → Verification → Knowledge → Curriculum → Lesson → QA → Founder Review → Published`  
**Mandate**: Under no circumstances may unverified educational content be auto-published to students.  

---

## 1. The 10-Stage Pedagogical Ingestion Flow

1. **PDF Ingestion**: Source textbooks, exam papers, and vocabulary guides uploaded to `nihomi-content-sources` cloud storage bucket.
2. **OCR / Document Understanding**: High-fidelity text extraction parsing Kanji, Kana, Furigana, and English/Bengali glosses.
3. **Structure Extraction**: Converting raw text into structured JSON schemas (Vocabulary items, grammar rules, cultural notes).
4. **Pedagogical Verification**: Cross-checking JLPT N5–N1 level tags, stroke orders, and contextual nuances.
5. **Knowledge Base Ingestion**: Storing verified vocabulary and grammar vectors into the centralized curriculum database.
6. **Curriculum Synthesis**: Structuring concepts into progressive lessons with clear prerequisites and learning objectives.
7. **Interactive Lesson Authoring**: Generating exercises (Multiple-choice, fill-in-the-blank, audio pronunciation, sentence unscramble).
8. **Automated Content QA**: Automated linguistic rules engine checking for missing pitch accents, broken audio links, or ambiguous answers.
9. **Founder Review Gate**: Presentation of lesson draft in [ContentStudioView.tsx](file:///c:/NIHOMI/nihomi-app/src/views/ContentStudioView.tsx) for Founder sign-off (`founderApproved: true`).
10. **Published**: 1-click publishing pushing live curriculum to student apps with immediate SRS card provisioning.
