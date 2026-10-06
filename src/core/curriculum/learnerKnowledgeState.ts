// src/core/curriculum/learnerKnowledgeState.ts
// Canonical Learner Knowledge State — NIHOMI Core Curriculum Engine

export type MistakeType =
  | 'visual_confusion'
  | 'phonetic_confusion'
  | 'meaning_confusion'
  | 'recall_delay'
  | 'recall_failure'
  | 'grammar_construction';

export const JOURNEY_CONSTITUTION_VERSION = '1.0.0';
export const CURRICULUM_GRAPH_VERSION = '1.0.0';
export const CONTENT_SCHEMA_VERSION = '1.0.0';
export const LEARNER_STATE_VERSION = '1.0.0';

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
  nextReviewDue: string;
  intervalDays: number;
  repetitionCount: number;
}

export interface LearnerKnowledgeState {
  version?: string;
  knownHiragana: string[];
  knownKatakana: string[];
  knownDakuten: string[];
  knownHandakuten: string[];
  knownCombinationKana: string[];
  knownReadingRules: string[];
  knownVocabulary: string[];
  knownKanji: string[];
  knownGrammar: string[];
  masteredSkills: string[];
  currentMissionId: string;
  currentLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  recentMistakes: MistakeRecord[];
  reviewQueue: ReviewQueueItem[];
  totalXp: number;
  streakDays: number;
  lastActiveDate: string;
}

function getStorageKey(userId?: string): string {
  if (userId && userId !== 'guest') {
    return `nihomi_knowledge_state_${userId}`;
  }
  try {
    const rawUser = localStorage.getItem('nihomi_user');
    if (rawUser) {
      const u = JSON.parse(rawUser);
      if (u?.id && u.id !== 'guest') {
        return `nihomi_knowledge_state_${u.id}`;
      }
    }
  } catch {}
  return 'nihomi_learner_knowledge_state_guest';
}

export function createInitialKnowledgeState(): LearnerKnowledgeState {
  return {
    version: LEARNER_STATE_VERSION,
    knownHiragana: [],
    knownKatakana: [],
    knownDakuten: [],
    knownHandakuten: [],
    knownCombinationKana: [],
    knownReadingRules: [],
    knownVocabulary: [],
    knownKanji: [],
    knownGrammar: [],
    masteredSkills: [],
    currentMissionId: 'mission-001-vowels',
    currentLevel: 'N5',
    recentMistakes: [],
    reviewQueue: [],
    totalXp: 0,
    streakDays: 0,
    lastActiveDate: new Date().toISOString().split('T')[0]
  };
}

export function loadLearnerKnowledgeState(userId?: string): LearnerKnowledgeState {
  if (typeof window === 'undefined') return createInitialKnowledgeState();
  try {
    const key = getStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
    return createInitialKnowledgeState();
  } catch (err) {
    console.warn('[KnowledgeState] Hydration fallback:', err);
    return createInitialKnowledgeState();
  }
}

export function saveLearnerKnowledgeState(state: LearnerKnowledgeState, userId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('nihomi:knowledge-state-updated', { detail: state }));
  } catch (err) {
    console.warn('[KnowledgeState] Storage failed:', err);
  }
}

export function addLearnedKana(state: LearnerKnowledgeState, kana: string, type: 'hiragana' | 'katakana' = 'hiragana'): LearnerKnowledgeState {
  const targetList = type === 'hiragana' ? state.knownHiragana : state.knownKatakana;
  if (!targetList.includes(kana)) {
    const nextList = [...targetList, kana];
    const updated = {
      ...state,
      [type === 'hiragana' ? 'knownHiragana' : 'knownKatakana']: nextList,
      totalXp: state.totalXp + 15
    };
    saveLearnerKnowledgeState(updated);
    return updated;
  }
  return state;
}

export function addLearnedVocabulary(state: LearnerKnowledgeState, word: string): LearnerKnowledgeState {
  if (!state.knownVocabulary.includes(word)) {
    const updated = {
      ...state,
      knownVocabulary: [...state.knownVocabulary, word],
      totalXp: state.totalXp + 25
    };
    saveLearnerKnowledgeState(updated);
    return updated;
  }
  return state;
}

export function recordLearnerMistake(
  state: LearnerKnowledgeState,
  item: string,
  mistakeType: MistakeRecord['mistakeType'],
  detailsBn: string
): LearnerKnowledgeState {
  const newMistake: MistakeRecord = {
    item,
    mistakeType,
    detailsBn,
    timestamp: new Date().toISOString(),
    resolved: false
  };
  const updated = {
    ...state,
    recentMistakes: [newMistake, ...state.recentMistakes.slice(0, 9)] // keep last 10
  };
  saveLearnerKnowledgeState(updated);
  return updated;
}

export function resolveLearnerMistake(state: LearnerKnowledgeState, item: string): LearnerKnowledgeState {
  const updatedMistakes = state.recentMistakes.map(m => 
    m.item === item ? { ...m, resolved: true } : m
  );
  const updated = {
    ...state,
    recentMistakes: updatedMistakes,
    totalXp: state.totalXp + 10 // Reward successful recovery!
  };
  saveLearnerKnowledgeState(updated);
  return updated;
}
