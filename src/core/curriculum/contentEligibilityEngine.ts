// src/core/curriculum/contentEligibilityEngine.ts
// Canonical Content Eligibility Engine & Strict Cumulative Lattice Enforcer

import { LearnerKnowledgeState } from './learnerKnowledgeState';

// Standard allowed punctuation, symbols, spaces, numbers, and Latin characters
const ALLOWED_SYMBOLS_REGEX = /^[\s\d\p{P}\p{S}a-zA-Z\u00C0-\u024F\u0980-\u09FF~・〜ー「」『』【】、。！？!?,.:;\-—+]+$/u;

export interface ValidationPrerequisitesResult {
  isEligible: boolean;
  unmetKana: string[];
  unmetKanji: string[];
  detailsBn: string;
}

/**
 * Extracts distinct Japanese characters from any string
 */
export function extractJapaneseCharacters(text: string): {
  hiragana: string[];
  katakana: string[];
  kanji: string[];
} {
  const hiraganaSet = new Set<string>();
  const katakanaSet = new Set<string>();
  const kanjiSet = new Set<string>();

  for (const char of text) {
    const code = char.charCodeAt(0);
    // Hiragana range: U+3040 to U+309F (excluding punctuation like '・' U+30FB)
    if (code >= 0x3041 && code <= 0x3096) {
      hiraganaSet.add(char);
    }
    // Katakana range: U+30A0 to U+30FF
    else if (code >= 0x30A1 && code <= 0x30FA) {
      katakanaSet.add(char);
    }
    // CJK Unified Ideographs (Kanji): U+4E00 to U+9FFF
    else if (code >= 0x4E00 && code <= 0x9FFF) {
      kanjiSet.add(char);
    }
  }

  return {
    hiragana: Array.from(hiraganaSet),
    katakana: Array.from(katakanaSet),
    kanji: Array.from(kanjiSet)
  };
}

/**
 * Determines whether a Japanese word, phrase, or sentence is 100% unlocked
 * under the learner's current knowledge state.
 * 
 * Inviolable Law: If ANY character in content is not yet taught, it is STRICTLY FORBIDDEN.
 */
export function isContentUnlocked(text: string, state: LearnerKnowledgeState): boolean {
  if (!text || text.trim() === '') return true;

  const { hiragana, katakana, kanji } = extractJapaneseCharacters(text);

  const knownAllHiragana = new Set([
    ...state.knownHiragana,
    ...state.knownDakuten,
    ...state.knownHandakuten
  ]);

  const knownKatakana = new Set(state.knownKatakana);
  const knownKanji = new Set(state.knownKanji);

  // Check Hiragana
  for (const h of hiragana) {
    if (!knownAllHiragana.has(h)) {
      return false;
    }
  }

  // Check Katakana
  for (const k of katakana) {
    if (!knownKatakana.has(k)) {
      return false;
    }
  }

  // Check Kanji
  for (const kj of kanji) {
    if (!knownKanji.has(kj)) {
      return false;
    }
  }

  return true;
}

/**
 * Returns detailed diagnostic breakdown of missing prerequisites
 */
export function validateContentPrerequisites(
  text: string,
  state: LearnerKnowledgeState
): ValidationPrerequisitesResult {
  const { hiragana, katakana, kanji } = extractJapaneseCharacters(text);

  const knownAllHiragana = new Set([
    ...state.knownHiragana,
    ...state.knownDakuten,
    ...state.knownHandakuten
  ]);
  const knownKatakana = new Set(state.knownKatakana);
  const knownKanji = new Set(state.knownKanji);

  const unmetKana: string[] = [];
  const unmetKanji: string[] = [];

  for (const h of hiragana) {
    if (!knownAllHiragana.has(h)) unmetKana.push(h);
  }
  for (const k of katakana) {
    if (!knownKatakana.has(k)) unmetKana.push(k);
  }
  for (const kj of kanji) {
    if (!knownKanji.has(kj)) unmetKanji.push(kj);
  }

  const isEligible = unmetKana.length === 0 && unmetKanji.length === 0;
  let detailsBn = 'সকল বর্ণ ও শব্দ শিক্ষার্থীর জন্য উন্মুক্ত।';

  if (!isEligible) {
    const missingItems = [...unmetKana, ...unmetKanji].join(', ');
    detailsBn = `এই কন্টেন্টে অপরিচিত বর্ণ রয়েছে: [${missingItems}] যা শিক্ষার্থী এখনো শেখেনি।`;
  }

  return {
    isEligible,
    unmetKana,
    unmetKanji,
    detailsBn
  };
}

/**
 * Filters any list of items by Japanese content eligibility
 */
export function filterEligibleItems<T>(
  items: T[],
  extractJapaneseFn: (item: T) => string,
  state: LearnerKnowledgeState
): T[] {
  return items.filter(item => {
    const ja = extractJapaneseFn(item);
    return isContentUnlocked(ja, state);
  });
}

/**
 * Hard assertion check for the cumulative lattice.
 * Throws an explicit descriptive error if violation occurs.
 */
export function assertContentLatticeCompliant(text: string, state: LearnerKnowledgeState, contextLabel = ''): void {
  const result = validateContentPrerequisites(text, state);
  if (!result.isEligible) {
    throw new Error(
      `[StrictCumulativeLatticeViolation] ${contextLabel ? `In ${contextLabel}: ` : ''}` +
      `Text "${text}" contains untaught characters: [${[...result.unmetKana, ...result.unmetKanji].join(', ')}]. ` +
      `Known Hiragana: [${state.knownHiragana.join(', ')}].`
    );
  }
}
