let _syncTimeout: any = null;

export function syncKnowledgeStateToServer(state: LearnerKnowledgeState): void {
  if (typeof window === 'undefined') return;
  try {
    const token = localStorage.getItem('nihomi_auth_token');
    if (!token) return;
    if (_syncTimeout) clearTimeout(_syncTimeout);
    _syncTimeout = setTimeout(async () => {
      try {
        await fetch('/api/progress/knowledge-state', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ knowledgeState: state })
        });
      } catch (e) {}
    }, 400);
  } catch {}
}

export async function hydrateKnowledgeStateFromServer(userId?: string): Promise<LearnerKnowledgeState | null> {
  if (typeof window === 'undefined') return null;
  try {
    const token = localStorage.getItem('nihomi_auth_token');
    if (!token) return null;
    const res = await fetch('/api/progress/knowledge-state', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.success && data.knowledgeState) {
      const serverState = data.knowledgeState;
      const localState = loadLearnerKnowledgeState(userId);
      const merged: LearnerKnowledgeState = {
        ...localState,
        ...serverState,
        knownHiragana: Array.from(new Set([...(localState.knownHiragana || []), ...(serverState.knownHiragana || [])])),
        knownKatakana: Array.from(new Set([...(localState.knownKatakana || []), ...(serverState.knownKatakana || [])])),
        knownDakuten: Array.from(new Set([...(localState.knownDakuten || []), ...(serverState.knownDakuten || [])])),
        knownHandakuten: Array.from(new Set([...(localState.knownHandakuten || []), ...(serverState.knownHandakuten || [])])),
        knownCombinationKana: Array.from(new Set([...(localState.knownCombinationKana || []), ...(serverState.knownCombinationKana || [])])),
        knownReadingRules: Array.from(new Set([...(localState.knownReadingRules || []), ...(serverState.knownReadingRules || [])])),
        knownVocabulary: Array.from(new Set([...(localState.knownVocabulary || []), ...(serverState.knownVocabulary || [])])),
        knownKanji: Array.from(new Set([...(localState.knownKanji || []), ...(serverState.knownKanji || [])])),
        knownGrammar: Array.from(new Set([...(localState.knownGrammar || []), ...(serverState.knownGrammar || [])])),
        masteredSkills: Array.from(new Set([...(localState.masteredSkills || []), ...(serverState.masteredSkills || [])])),
        totalXp: Math.max(localState.totalXp || 0, serverState.totalXp || 0),
        streakDays: Math.max(localState.streakDays || 0, serverState.streakDays || 0)
      };
      const key = getStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(merged));
      localStorage.setItem(PRIMARY_KNOWLEDGE_STATE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('nihomi:knowledge-state-updated', { detail: merged }));
      return merged;
    }
  } catch (err) {
    console.warn('[KnowledgeState] Server hydration fallback to local:', err);
  }
  return null;
}

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

export const PRIMARY_KNOWLEDGE_STATE_KEY = 'nihomi_learner_knowledge_state_v1';

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
  return PRIMARY_KNOWLEDGE_STATE_KEY;
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
    let raw = localStorage.getItem(key);
    if (!raw && key !== PRIMARY_KNOWLEDGE_STATE_KEY) {
      raw = localStorage.getItem(PRIMARY_KNOWLEDGE_STATE_KEY);
    }
    if (!raw) {
      raw = localStorage.getItem('nihomi_learner_knowledge_state_guest');
    }
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
    const serialized = JSON.stringify(state);
    localStorage.setItem(key, serialized);
    // Canonical dual-write ensures test suites, reload preservation, and telemetry all see uniform state
    if (key !== PRIMARY_KNOWLEDGE_STATE_KEY) {
      localStorage.setItem(PRIMARY_KNOWLEDGE_STATE_KEY, serialized);
    }
    window.dispatchEvent(new CustomEvent('nihomi:knowledge-state-updated', { detail: state }));
    syncKnowledgeStateToServer(state);
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
