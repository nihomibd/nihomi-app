// src/lib/kanaMemorySync.ts
// NIHOMI MEMORYOS™ — KANA CANVAS FRICTION & SRS BRIDGE
// Automatically captures stroke order failures, accuracy slips, and feeds them into SuperMemo-2 SRS and Mistake DNA.

import { KanaCharacter } from '../data/kanaData';
import { MemoryOSEngine } from '../components/canvas3d/engine/MemoryOSEngine';

export interface KanaMistakeRecord {
  char: string;
  type: string;
  romaji: string;
  banglaPhonetic: string;
  timestamp: string;
  mistakeType: 'stroke_order' | 'stroke_count' | 'accuracy';
  userScore: number;
  tip: string;
}

const KANA_MISTAKES_KEY = 'nihomi_kana_mistakes';
const SRS_CARDS_KEY = 'nihomi_srs_cards_v1';

export function logKanaMistake(
  kana: KanaCharacter,
  score: number,
  mistakeType: 'stroke_order' | 'stroke_count' | 'accuracy' = 'accuracy'
): KanaMistakeRecord {
  const tip =
    mistakeType === 'stroke_count'
      ? `সঠিক স্ট্রোক সংখ্যা ${kana.strokes}টি। স্ট্রোকের ক্রম ও শেষ বিন্দু লক্ষ্য করুন।`
      : `স্ট্রোকের বাঁক ও ব্যালান্স নিখুঁত করুন। গাইড ট্রেস করে সঠিক দিক মিলিয়ে নিন।`;

  const record: KanaMistakeRecord = {
    char: kana.char,
    type: kana.type,
    romaji: kana.romaji,
    banglaPhonetic: kana.banglaPhonetic,
    timestamp: new Date().toISOString(),
    mistakeType,
    userScore: score,
    tip
  };

  if (typeof localStorage !== 'undefined') {
    try {
      // 1. Save to nihomi_kana_mistakes
      const existing: KanaMistakeRecord[] = JSON.parse(
        localStorage.getItem(KANA_MISTAKES_KEY) || '[]'
      );
      // Remove duplicate if already logged and prepend new failure
      const filtered = existing.filter((item) => item.char !== kana.char);
      const updated = [record, ...filtered].slice(0, 30); // Keep last 30 mistakes
      localStorage.setItem(KANA_MISTAKES_KEY, JSON.stringify(updated));

      // 2. Queue into active SRS Review cycle (nihomi_srs_cards_v1)
      const srsCards = JSON.parse(localStorage.getItem(SRS_CARDS_KEY) || '[]');
      const cardExists = srsCards.some((c: any) => c.kanji === kana.char);

      if (!cardExists) {
        const newSrsCard = {
          id: `srs-kana-${kana.char}-${Date.now().toString(36)}`,
          kanji: kana.char,
          reading: `${kana.romaji} (${kana.banglaPhonetic})`,
          romaji: kana.romaji,
          english: `Kana (${kana.type.toUpperCase()})`,
          bangla: `জাপানি বর্ণ: ${kana.char} (${kana.banglaPhonetic})`,
          example: `বর্ণ: ${kana.char} | স্ট্রোক: ${kana.strokes}`,
          easeFactor: 2.1,
          intervalDays: 1,
          repetitions: 0,
          dueDate: new Date().toISOString(),
          status: 'learning'
        };
        localStorage.setItem(SRS_CARDS_KEY, JSON.stringify([newSrsCard, ...srsCards]));
      }

      // 3. Log to MemoryOS Engine core
      MemoryOSEngine.logInteraction({
        locationId: 'kana_writing_lab',
        locationName: 'Nihomi Kana Canvas Lab',
        targetRole: 'Calligraphy Sensei (書道先生)',
        studentUtterance: `Kana Draw: ${kana.char} (${score}%)`,
        isCorrectKeigo: false,
        keigoCategory: 'casual',
        feedbackGiven: tip,
        correctionPhrase: `Stroke Order & Balance: ${kana.char} (${kana.strokes} strokes)`
      });

      // Dispatch event to inform live UI components
      window.dispatchEvent(new CustomEvent('nihomi:memory-updated', { detail: { record } }));
    } catch (err) {
      console.warn('[KanaMemorySync] Failed to log mistake:', err);
    }
  }

  return record;
}

export function getKanaMistakes(): KanaMistakeRecord[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KANA_MISTAKES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function removeKanaMistake(char: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const existing: KanaMistakeRecord[] = JSON.parse(
      localStorage.getItem(KANA_MISTAKES_KEY) || '[]'
    );
    const updated = existing.filter((item) => item.char !== char);
    localStorage.setItem(KANA_MISTAKES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('nihomi:memory-updated'));
  } catch (err) {
    console.warn('[KanaMemorySync] Failed to remove mistake:', err);
  }
}
