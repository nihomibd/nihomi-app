# NIHOMI CONTENT SCHEMA & CURRICULUM ARCHITECTURE
# Canonical System of Record — Version 1.0.0

## 1. LEARNER KNOWLEDGE STATE SCHEMA
The centralized runtime model representing what a student has definitively mastered:

```typescript
export interface LearnerKnowledgeState {
  knownHiragana: Set<string>;        // e.g. ['あ', 'い', 'う', 'え', 'お']
  knownKatakana: Set<string>;        // e.g. ['ア', 'イ', 'ウ', 'エ', 'オ']
  knownDakuten: Set<string>;         // e.g. ['が', 'ぎ', 'ぐ', 'げ', 'ご']
  knownHandakuten: Set<string>;      // e.g. ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ']
  knownCombinationKana: Set<string>; // e.g. ['きゃ', 'きゅ', 'きょ']
  knownReadingRules: Set<string>;    // e.g. ['sokuon_tsu', 'chouon_long_vowel']
  knownVocabulary: Set<string>;      // e.g. ['あい', 'いい', 'いう', 'いえ', 'うえ', 'あお']
  knownKanji: Set<string>;           // e.g. ['日', '本', '人', '私']
  knownGrammar: Set<string>;         // e.g. ['desu_polite', 'particle_wa', 'particle_ka']
  currentMissionId: string;          // e.g. 'mission-001-vowels'
  currentLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  recentMistakes: {
    item: string;
    mistakeType: 'visual_confusion' | 'phonetic_confusion' | 'recall_failure' | 'grammar_construction';
    timestamp: string;
    resolved: boolean;
  }[];
  reviewQueue: {
    itemId: string;
    itemType: 'kana' | 'vocab' | 'grammar' | 'kanji';
    nextReviewDue: string;
    intervalDays: number;
    repetitionCount: number;
  }[];
}
```

---

## 2. VOCABULARY OS ITEM SCHEMA
Every vocabulary item admitted into Nihomi must provide full prerequisite tracking:

```typescript
export interface VocabularyItem {
  id: string;                        // Unique identifier, e.g. 'voc-n5-ai-love'
  japanese: string;                  // 'あい'
  reading: string;                   // 'ai'
  meaningBn: string;                 // 'ভালোবাসা'
  meaningEn: string;                 // 'Love'
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'particle' | 'expression' | 'counter';
  difficulty: 1 | 2 | 3 | 4 | 5;
  requiredKana: string[];            // ['あ', 'い']
  requiredKanji?: string[];          // []
  relatedGrammar?: string[];         // []
  contextCategory: 'daily' | 'family' | 'food' | 'directions' | 'konbini' | 'workplace';
  audioUrl?: string;
  exampleSentence?: {
    japanese: string;
    reading: string;
    meaningBn: string;
    meaningEn: string;
  };
  tags: string[];
}
```

---

## 3. CONTENT ELIGIBILITY ENGINE INTERFACE

```typescript
export interface ContentEligibilityEngine {
  isContentUnlocked(content: VocabularyItem | string, state: LearnerKnowledgeState): boolean;
  getEligibleVocabulary(state: LearnerKnowledgeState): VocabularyItem[];
  validateContentPrerequisites(text: string, state: LearnerKnowledgeState): {
    isEligible: boolean;
    unmetKanaPrerequisites: string[];
    unmetKanjiPrerequisites: string[];
  };
}
```

### The Inviolability Axiom:
```
IF (any character in content ∉ state.knownHiragana ∪ state.knownKatakana ∪ state.knownKanji)
THEN content is STRICTLY FORBIDDEN from learner-facing display.
```
UI components must NEVER guess eligibility independently. All eligibility queries must resolve through the canonical `ContentEligibilityEngine`.
