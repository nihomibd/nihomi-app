# NIHOMI.COM — CONTENT INGESTION ENGINE SPECIFICATION

## 1. Overview
The Content Engine (`server/services/contentEngineService.ts`) transforms raw Japanese textbook PDFs, lecture notes, and curriculum scans into structured digital learning modules (Vocabulary, Grammar, Kanji, Audio Scripts, Dialogues, Quizzes).

## 2. Ingestion Pipeline Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PDF Upload via Multer (POST /api/content/upload-source)  │
│    - Saves file buffer & checks page count / text density   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Text Extraction Layer                                    │
│    - Primary: pdf-parse v2 class API                        │
│    - Secondary: pdf-parse v1 functional fallback            │
│    - Tertiary: Latin-1 text block stream extractor          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Structured Gemini Educational Generation                 │
│    - Prompt engine targeting JLPT level (N5, N4, N3)        │
│    - Strict JSON output schema (Vocabulary, Grammar, Kanji, │
│      Dialogues, Reading, Exercises, Quiz Questions)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Draft & Version Management                               │
│    - Status: DRAFT → IN_REVIEW → APPROVED → PUBLISHED       │
│    - Version history tracking with structured JSON diffing  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. One-Click Publishing to Live Curriculum                  │
│    - Merges new Lesson into Course & Module tree            │
│    - Generates associated Quiz Bank questions automatically │
└─────────────────────────────────────────────────────────────┘
```

## 3. Supported Content Entity Schemas
- `VocabularyItem`: `word`, `furigana`, `romaji`, `meaningEn`, `meaningBn`, `partOfSpeech`, `exampleJa`, `exampleEn`, `exampleBn`, `audioScript`.
- `GrammarItem`: `pattern`, `meaningEn`, `meaningBn`, `formationRules`, `cautionNotes`, `examples`.
- `KanjiItem`: `character`, `onyomi`, `kunyomi`, `meaningEn`, `meaningBn`, `strokeCount`, `radicals`, `commonWords`.
- `LessonDialogue`: `title`, `setting`, `lines` (`speaker`, `japanese`, `romaji`, `english`, `bengali`, `audioUrl`).
