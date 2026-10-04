// src/core/ai/senseiProvider.ts
// Canonical Sensei AI Provider Abstraction & Pedagogical Output Guard
// Law 6: AI Provider Independence & Strict Curriculum Boundary Enforcement

import {
  LearnerKnowledgeState,
  loadLearnerKnowledgeState
} from '../curriculum/learnerKnowledgeState';
import { isContentUnlocked } from '../curriculum/contentEligibilityEngine';
import { getStoredToken, getOrGenerateGuestToken } from '../../lib/api';

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

export interface ISenseiProvider {
  readonly providerId: string;
  generateResponse(message: string, context: SenseiContext): Promise<SenseiResponse>;
}

/**
 * Validates generated AI Japanese against learner's unlocked knowledge state.
 * If untaught characters or unauthorized Kanji are found, flags violations
 * and provides safe scaffolding.
 */
export function assertSenseiOutputEligible(
  text: string,
  state: LearnerKnowledgeState
): {
  eligible: boolean;
  violations: string[];
  sanitized: string;
} {
  const violations: string[] = [];

  // Match Japanese kana and kanji segments
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g;
  const matches = text.match(japaneseRegex) || [];

  const knownHiraganaSet = new Set(state.knownHiragana || []);
  const knownKatakanaSet = new Set(state.knownKatakana || []);
  const knownKanjiSet = new Set(state.knownKanji || []);

  // For early learners (who know <= 5 vowels), strictly enforce kana lattice
  const isEarlyLearner = (state.knownHiragana || []).length <= 5 && (state.knownKatakana || []).length === 0;

  for (const token of matches) {
    for (const char of token) {
      const code = char.charCodeAt(0);
      const isHiragana = code >= 0x3040 && code <= 0x309f;
      const isKatakana = code >= 0x30a0 && code <= 0x30ff;
      const isKanji = code >= 0x4e00 && code <= 0x9faf;

      if (isEarlyLearner && isHiragana && !knownHiraganaSet.has(char)) {
        violations.push(`Untaught Hiragana '${char}' encountered before unlock`);
      } else if (isEarlyLearner && isKatakana && !knownKatakanaSet.has(char)) {
        violations.push(`Untaught Katakana '${char}' encountered before Katakana phase`);
      } else if (isEarlyLearner && isKanji && !knownKanjiSet.has(char)) {
        violations.push(`Raw Kanji '${char}' encountered without prerequisite unlock`);
      }
    }
  }

  const eligible = violations.length === 0;
  // If violations exist for an early learner, sanitize by appending pedagogical note
  let sanitized = text;
  if (!eligible && isEarlyLearner) {
    sanitized = `${text}\n\n[💡 সেনসেই নোট: উপরের কিছু জাপানি অক্ষর আপনার পরবর্তী লেসনে আনলক হবে। আপাতত রোমাজি ও উচ্চারণ শুনে অনুশীলন করুন!]`;
  }

  return {
    eligible,
    violations: Array.from(new Set(violations)),
    sanitized
  };
}

/**
 * Primary HTTP Sensei Provider connecting to backend /api/ai/coach
 */
export class HttpSenseiProvider implements ISenseiProvider {
  readonly providerId = 'nihomi-http-sensei';

  async generateResponse(message: string, context: SenseiContext): Promise<SenseiResponse> {
    const state = context.learnerState || loadLearnerKnowledgeState();
    const token = getStoredToken();
    const guestId = getOrGenerateGuestToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-guest-session-id': guestId
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/ai/coach', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message,
        mode: context.mode || 'conversation',
        scenario: context.scenario || 'N5 Japanese tutoring with Nihomi Sensei AI™',
        history: context.history,
        knownHiragana: state.knownHiragana,
        knownVocabulary: state.knownVocabulary,
        currentMissionId: state.currentMissionId
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || 'Nihomi Sensei AI™ এর সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।');
    }

    const rawReply =
      data.reply ||
      'こんにちは！(Konnichiwa!) নিহোমি সেনসেই আপনার সাথে আছেন। আসুন অনুশীলন করি!';

    const audit = assertSenseiOutputEligible(rawReply, state);

    return {
      reply: rawReply,
      romaji: data.romaji,
      bengaliTranslation: data.bengaliTranslation,
      correctionData: data.correctionData,
      provider: 'google-gemini-via-nihomi-gateway',
      passedPedagogyAudit: audit.eligible,
      sanitizedReply: audit.sanitized,
      violations: audit.violations
    };
  }
}

/**
 * Global Sensei Provider Singleton Registry
 */
class SenseiProviderRegistry {
  private activeProvider: ISenseiProvider = new HttpSenseiProvider();

  getProvider(): ISenseiProvider {
    return this.activeProvider;
  }

  setProvider(provider: ISenseiProvider): void {
    this.activeProvider = provider;
  }
}

export const senseiRegistry = new SenseiProviderRegistry();
