# 📜 NIHOMI CONTENT & STATE SCHEMA SPECIFICATION
## The Machine-Readable Data Contracts of the Nihomi Learning OS
**Version:** 1.0.0  
**Status:** Canonical & Locked  

---

## 1. SCHEMA VERSION IDENTIFIERS
Every piece of serialized curriculum metadata and client state carries explicit semantic versioning:

```typescript
export const JOURNEY_CONSTITUTION_VERSION = '1.0.0';
export const CURRICULUM_GRAPH_VERSION = '1.0.0';
export const CONTENT_SCHEMA_VERSION = '1.0.0';
export const LEARNER_STATE_VERSION = '1.0.0';
```

---

## 2. LEARNER KNOWLEDGE STATE SCHEMA (`LearnerKnowledgeState`)

Persisted in `localStorage` under `nihomi_learner_knowledge_state_v1` and synchronized with PostgreSQL/Supabase profile storage:

```typescript
export interface LearnerKnowledgeState {
  version?: string;                // e.g. '1.0.0'
  knownHiragana: string[];         // e.g. ['あ', 'い', 'う', 'え', 'お']
  knownKatakana: string[];         // e.g. ['ア', 'イ']
  knownDakuten: string[];          // e.g. ['が', 'ざ', 'だ', 'ば']
  knownHandakuten: string[];       // e.g. ['ぱ', 'ぴ']
  knownCombinationKana: string[];  // e.g. ['きゃ', 'しゅ', 'ちょ']
  knownReadingRules: string[];     // e.g. ['sokuon_small_tsu', 'long_vowel_ou']
  knownVocabulary: string[];       // e.g. ['あい', 'あお', 'いえ']
  knownKanji: string[];            // e.g. ['日', '本', '人', '私']
  knownGrammar: string[];          // e.g. ['wa_desu', 'kore_sore_are']
  masteredSkills: string[];        // e.g. ['vowels_5_mastered', 'kana_dual_mastered']
  currentMissionId: string;        // e.g. 'kana-a'
  currentLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  recentMistakes: MistakeRecord[];
  reviewQueue: ReviewQueueItem[];
  totalXp: number;
  streakDays: number;
  lastActiveDate: string;          // ISO Date string: 'YYYY-MM-DD'
}
```

---

## 3. CURRICULUM NODE SCHEMA (`CurriculumNode`)

```typescript
export type CurriculumPhase =
  | 'phase_0_zero_entry'
  | 'phase_1_hiragana_foundation'
  | 'phase_2_hiragana_core'
  | 'phase_3_hiragana_mechanics'
  | 'phase_4_hiragana_reading_mastery'
  | 'phase_5_katakana_foundation'
  | 'phase_6_katakana_mastery'
  | 'phase_7_reading_foundation'
  | 'phase_8_vocabulary_os'
  | 'phase_9_kanji_vocabulary'
  | 'phase_10_grammar'
  | 'phase_11_sentence_building'
  | 'phase_12_listening_speaking'
  | 'phase_13_real_life_missions'
  | 'phase_14_japan_readiness';

export type CurriculumNodeType =
  | 'kana'
  | 'word_unlock'
  | 'milestone_quiz'
  | 'reading_drill'
  | 'katakana'
  | 'vocabulary'
  | 'kanji'
  | 'grammar'
  | 'sentence'
  | 'listening_speaking'
  | 'real_life'
  | 'mistake_repair';

export interface CurriculumNode {
  id: string;
  phase: CurriculumPhase;
  type: CurriculumNodeType;
  titleBn: string;
  subTitleBn: string;
  actionLabelBn: string;
  whyItMattersBn: string;
  japanConnectionBn: string;
  targetChar?: string;
  targetWord?: string;
  targetLessonId?: string;
  prerequisites: string[]; // Node IDs that must be completed
  requiredKana?: string[];
  requiredVocabulary?: string[];
  requiredSkills?: string[];
  unlocks: string[];
  viewRoute: string;
  viewParams?: Record<string, any>;
  xpReward: number;
}
```

---

## 4. MISTAKE & SPACED REPETITION SCHEMA (`MistakeRecord` & `ReviewQueueItem`)

```typescript
export type MistakeType =
  | 'visual_confusion'      // Confusing 'あ' with 'お'
  | 'phonetic_confusion'    // Confusing 'i' with 'e'
  | 'meaning_confusion'     // Confusing 'kore' with 'sore'
  | 'recall_delay'          // Latency > 4.5s
  | 'recall_failure'        // Total miss
  | 'grammar_construction'; // Incorrect particle

export interface MistakeRecord {
  item: string;
  mistakeType: MistakeType;
  detailsBn: string;
  timestamp: string;
  resolved: boolean;
}

export interface ReviewQueueItem {
  itemId: string;
  itemType: 'kana' | 'vocab' | 'grammar' | 'kanji';
  prompt: string;
  nextReviewDue: string;     // ISO timestamp
  intervalDays: number;      // Spaced repetition interval
  repetitionCount: number;
}
```

---

## 5. PLACEMENT DIAGNOSTIC SCHEMA (`PlacementDiagnostic`)

```typescript
export type PlacementTier =
  | 'zero_beginner'
  | 'vowels_known'
  | 'hiragana_mastered'
  | 'dual_kana_mastered';

export interface PlacementQuestion {
  id: string;
  tier: PlacementTier;
  questionBn: string;
  promptJa: string;
  options: {
    labelBn: string;
    isCorrect: boolean;
  }[];
  explanationBn: string;
}

export interface PlacementAssessmentResult {
  tier: PlacementTier;
  recommendedStartingNodeId: string;
  recommendedStartingMission: CurriculumNode;
  score: number;
  totalQuestions: number;
  messageBn: string;
}
```

---

## 6. SENSEI AI INTERACTION SCHEMA (`SenseiContext` & `SenseiResponse`)

```typescript
export interface SenseiContext {
  learnerState?: LearnerKnowledgeState;
  targetLevel?: string;
  scenario?: string;
  mode?:
    | 'conversation'
    | 'grammar_explanation'
    | 'vocabulary_explanation'
    | 'correction'
    | 'translation'
    | 'pedagogy_coach';
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface SenseiResponse {
  reply: string;
  romaji?: string;
  bengaliTranslation?: string;
  correctionData?: any;
  provider: string;
  passedPedagogyAudit: boolean;
  sanitizedReply: string;
  violations?: string[];
}
```

---

## 7. MONETIZATION POLICY SCHEMA (`MonetizationGateStatus`)

```typescript
export interface MonetizationGateStatus {
  isRestricted: boolean;
  chapterNumber?: number;
  reasonBn: string;
  planRequired: 'pro' | 'lifetime';
  previewDetails?: {
    titleBn: string;
    descriptionBn: string;
    featuresBn: string[];
  };
}
```

---
*Authorized by Nihomi Architecture Board.*
