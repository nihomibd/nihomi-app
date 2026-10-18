# NIHOMI.COM — JLPT QUESTION BANK SCHEMA SPECIFICATION

**Document ID:** `NIHOMI_QUESTION_BANK_SCHEMA`  
**Phase:** Phase 6 Product Assembly  
**Status:** 🟢 AUTHORITATIVE SCHEMA  

---

## 1. TYPESCRIPT DATA MODEL SPECIFICATION

```typescript
export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export type JlptSection = 
  | 'vocab_kanji_reading'       // 問題1: 漢字の読み方
  | 'vocab_orthography'          // 問題2: 表記 (ひらがな -> 漢字)
  | 'vocab_contextual_use'       // 問題3: 文脈規定
  | 'vocab_paraphrase'           // 問題4: 言い換え類義
  | 'vocab_usage'                // 問題5: 用法
  | 'grammar_sentence_form'      // 問題1: 文法形式の判断
  | 'grammar_sentence_order'     // 問題2: 文の組み立て (★)
  | 'grammar_passage'            // 問題3: 文章の文法
  | 'reading_short'              // 短文読解
  | 'reading_medium'             // 中文読解
  | 'reading_long'               // 長文読解
  | 'reading_information'        // 情報検索 (チラシ・案内)
  | 'listening_task'             // 課題理解
  | 'listening_point'            // ポイント理解
  | 'listening_summary'          // 概要理解
  | 'listening_quick_response';  // 即時応答

export interface QuestionOption {
  id: string;                    // e.g. "opt_1", "opt_2", "opt_3", "opt_4"
  index: number;                 // 1, 2, 3, 4
  textJp: string;                // Japanese expression
  textRomaji?: string;
  textBn?: string;
  isCorrect: boolean;
  distractorAnalysisBn?: string; // Why this option is incorrect
}

export interface JlptQuestion {
  id: string;                    // Unique immutable identifier, e.g. "n5_mb01_q03"
  level: JlptLevel;
  section: JlptSection;
  mondaiNumber: number;          // Official exam Mondai index (1, 2, 3...)
  subQuestionNumber: number;     // Question number within section
  promptJp: string;              // Target Japanese sentence / question stem
  promptRomaji?: string;
  promptBn?: string;             // Bengali guidance or translation
  passageContextJp?: string;     // For reading comprehension passages
  audioAssetUrl?: string;        // For listening comprehension
  options: QuestionOption[];     // Exactly 4 options (or 3 for listening Q4)
  correctOptionIndex: number;    // 1-indexed (1, 2, 3, 4)
  explanationBn: string;         // Comprehensive pedagogical explanation in Bengali
  points: number;                // Score weighting (1 to 3 points)
  difficultyScore: number;       // 1.0 (easy) to 5.0 (hard)
  provenance: {
    sourceFile: string;          // e.g. "JLPT_N5_Bangla_Japanese_Complete_Mock_Test.pdf"
    sourcePage: number;          // Page in original document
    sourceExamId: string;
    extractionVersion: string;   // e.g. "1.0.0"
    reviewedBy?: string;         // Auditor / educator ID
    reviewedAt?: string;         // ISO timestamp
  };
  reviewStatus: 'draft' | 'audited' | 'approved' | 'quarantined';
  tags: string[];                // e.g. ["verb_te_form", "particles", "time_expressions"]
}

export interface JlptMockExamSession {
  sessionId: string;
  userId: string;
  level: JlptLevel;
  examId: string;
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
  timeRemainingSeconds: number;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
  status: 'in_progress' | 'submitted' | 'timed_out' | 'reviewed';
  scoreSummary?: {
    totalScore: number;          // Scaled to 180
    vocabScore: number;          // Scaled to 60
    grammarReadingScore: number; // Scaled to 60 (or split for N1-N2)
    listeningScore: number;      // Scaled to 60
    passed: boolean;
    sectionCutoffPassed: boolean;
    percentileRank?: number;
  };
}
```

---

## 2. DATABASE INTEGRATION PLAN

In production, these questions are persisted in PostgreSQL via Prisma:
- Model `JlptQuestion` stores verified questions.
- Model `JlptExamSession` records student attempts, timings, answers, and scores.
- Model `JlptWeaknessAnalysis` tracks mistake frequency by grammar particle and vocabulary category.
