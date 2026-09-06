/**
 * Tokyo Pitch-Accent Lexicon & Morphological Contour Engine for JLPT N5/N4
 * Provides accurate Tokyo standard pitch patterns, downstep morae, and phonological mora breakdowns.
 */

import { PitchAccentPattern } from '../types';

export interface TokyoPitchInfo {
  word: string;
  reading: string;
  romaji: string;
  pattern: PitchAccentPattern;
  patternNameJa: string;
  patternNameBn: string;
  downstepMora: number; // 0 = Heiban (平板), 1 = Atamadaka (頭高), 2..N-1 = Nakadaka (中高), N = Odaka (尾高)
  morae: string[];
  targetPitches: ('H' | 'L')[];
  meaningEn: string;
  meaningBn: string;
  particlePitchBehaviorBn: string;
  downstepTipBn: string;
}

// Canonical Tokyo pitch dictionary for high-frequency JLPT N5/N4 words
export const TOKYO_PITCH_DICTIONARY: Record<string, Omit<TokyoPitchInfo, 'word'>> = {
  // Minimal pairs & core nouns
  '箸': {
    reading: 'はし',
    romaji: 'hashi',
    pattern: 'atamadaka',
    patternNameJa: '頭高型 (①)',
    patternNameBn: 'আতামাদাকা (মাথা-উঁচু ①)',
    downstepMora: 1,
    morae: ['は', 'し'],
    targetPitches: ['H', 'L'],
    meaningEn: 'Chopsticks',
    meaningBn: 'চপস্টিক (খাওয়ার কাঠি)',
    particlePitchBehaviorBn: 'পার্টিকেল যুক্ত হলে পার্টিকেলটি নিচু (Low) থাকবে (H-L-L)।',
    downstepTipBn: 'প্রথম মোরা "হা" উঁচু হবে, দ্বিতীয় মোরা "শি" সাথে সাথেই নিচে নেমে যাবে।'
  },
  '橋': {
    reading: 'はし',
    romaji: 'hashi',
    pattern: 'odaka',
    patternNameJa: '尾高型 (②)',
    patternNameBn: 'ওদাকা (লেজ-উঁচু ②)',
    downstepMora: 2,
    morae: ['は', 'し'],
    targetPitches: ['L', 'H'],
    meaningEn: 'Bridge',
    meaningBn: 'সেতু / ব্রিজ',
    particlePitchBehaviorBn: 'পার্টিকেল (が/を) যুক্ত হওয়ামাত্র সুর নিচে নেমে যাবে (L-H-L)।',
    downstepTipBn: '"হা" নিচু, "শি" উঁচু—কিন্তু পার্টিকেলে সুর ঝপ করে নিচে ড্রপ করবে।'
  },
  '端': {
    reading: 'はし',
    romaji: 'hashi',
    pattern: 'heiban',
    patternNameJa: '平板型 (⓪)',
    patternNameBn: 'হেইবান (সমতল ⓪)',
    downstepMora: 0,
    morae: ['は', 'し'],
    targetPitches: ['L', 'H'],
    meaningEn: 'Edge / Border',
    meaningBn: 'প্রান্ত / কিনারা',
    particlePitchBehaviorBn: 'পার্টিকেল যুক্ত হলেও সুর নামবে না, উঁচু ও সমতল থাকবে (L-H-H)।',
    downstepTipBn: '"হা" নিচু, "শি" উঁচু এবং পার্টিকেল পর্যন্ত উঁচু সুর বজায় থাকে।'
  },
  '雨': {
    reading: 'あめ',
    romaji: 'ame',
    pattern: 'atamadaka',
    patternNameJa: '頭高型 (①)',
    patternNameBn: 'আতামাদাকা (মাথা-উঁচু ①)',
    downstepMora: 1,
    morae: ['あ', 'め'],
    targetPitches: ['H', 'L'],
    meaningEn: 'Rain',
    meaningBn: 'বৃষ্টি',
    particlePitchBehaviorBn: 'পার্টিকেল সহ সুর H-L-L থাকবে।',
    downstepTipBn: '"আ" উঁচু, "মে" নিচু।'
  },
  '飴': {
    reading: 'あめ',
    romaji: 'ame',
    pattern: 'heiban',
    patternNameJa: '平板型 (⓪)',
    patternNameBn: 'হেইবান (সমতল ⓪)',
    downstepMora: 0,
    morae: ['あ', 'め'],
    targetPitches: ['L', 'H'],
    meaningEn: 'Candy / Sweet',
    meaningBn: 'মিছরি / ক্যান্ডি',
    particlePitchBehaviorBn: 'পার্টিকেল সহ সুর L-H-H সমতল থাকবে।',
    downstepTipBn: '"আ" নিচু থেকে শুরু হয়ে "মে" উঁচু হবে এবং সমতল থাকবে।'
  },
  '日本': {
    reading: 'にほん',
    romaji: 'nihon',
    pattern: 'heiban',
    patternNameJa: '平板型 (⓪)',
    patternNameBn: 'হেইবান (সমতল ⓪)',
    downstepMora: 0,
    morae: ['に', 'ほ', 'ん'],
    targetPitches: ['L', 'H', 'H'],
    meaningEn: 'Japan',
    meaningBn: 'জাপান',
    particlePitchBehaviorBn: 'পার্টিকেল সহ L-H-H-H সমতল থাকবে।',
    downstepTipBn: 'প্রথম মোরা "নি" নিচু, বাকি সব মোরা উঁচু ও সমতল।'
  },
  '日本語': {
    reading: 'にほんご',
    romaji: 'nihongo',
    pattern: 'heiban',
    patternNameJa: '平板型 (⓪)',
    patternNameBn: 'হেইবান (সমতল ⓪)',
    downstepMora: 0,
    morae: ['に', 'ほ', 'ん', 'ご'],
    targetPitches: ['L', 'H', 'H', 'H'],
    meaningEn: 'Japanese Language',
    meaningBn: 'জাপানি ভাষা',
    particlePitchBehaviorBn: 'L-H-H-H-H সমতল টোকিও প্যাটার্ন।',
    downstepTipBn: 'কোনো ড্রপ নেই; সমতলভাবে উঁচু দিকে সুর প্রবাহিত হয়।'
  },
  '先生': {
    reading: 'せんせい',
    romaji: 'sensei',
    pattern: 'nakadaka',
    patternNameJa: '中高型 (③)',
    patternNameBn: 'নাকাদাকা (মাঝ-উঁচু ③)',
    downstepMora: 3,
    morae: ['せ', 'ん', 'せ', 'い'],
    targetPitches: ['L', 'H', 'H', 'L'],
    meaningEn: 'Teacher',
    meaningBn: 'শিক্ষক / সেন্সেই',
    particlePitchBehaviorBn: 'L-H-H-L-L প্যাটার্ন।',
    downstepTipBn: 'তৃতীয় মোরা "সে"-এর পর চতুর্থ মোরা "ই"-তে সুর নিচে নামে।'
  },
  '勉強': {
    reading: 'べんきょう',
    romaji: 'benkyou',
    pattern: 'heiban',
    patternNameJa: '平板型 (⓪)',
    patternNameBn: 'হেইবান (সমতল ⓪)',
    downstepMora: 0,
    morae: ['べ', 'ん', 'きょ', 'う'],
    targetPitches: ['L', 'H', 'H', 'H'],
    meaningEn: 'Study',
    meaningBn: 'পড়াশোনা / অধ্যয়ন',
    particlePitchBehaviorBn: 'পার্টিকেল সহ L-H-H-H-H সমতল সুর।',
    downstepTipBn: 'প্রথম মোরা "বেন" নিচু, "কিয়ো-উ" উঁচু এবং সমতল থাকে।'
  },
  '空港': {
    reading: 'くうこう',
    romaji: 'kuukou',
    pattern: 'heiban',
    patternNameJa: '平板型 (⓪)',
    patternNameBn: 'হেইবান (সমতল ⓪)',
    downstepMora: 0,
    morae: ['く', 'う', 'こ', 'う'],
    targetPitches: ['L', 'H', 'H', 'H'],
    meaningEn: 'Airport',
    meaningBn: 'বিমানবন্দর',
    particlePitchBehaviorBn: 'L-H-H-H-H সমতল টোকিও পিচ।',
    downstepTipBn: 'টোকিও ডায়ালেক্টে সমতল (Heiban) হিসেবে উচ্চারিত হয়।'
  },
  '時間': {
    reading: 'じかん',
    romaji: 'jikan',
    pattern: 'heiban',
    patternNameJa: '平板型 (⓪)',
    patternNameBn: 'হেইবান (সমতল ⓪)',
    downstepMora: 0,
    morae: ['じ', 'か', 'ん'],
    targetPitches: ['L', 'H', 'H'],
    meaningEn: 'Time',
    meaningBn: 'সময়',
    particlePitchBehaviorBn: 'L-H-H-H সমতল প্রবাহ।',
    downstepTipBn: '"জি" নিচু, "কান" উঁচু।'
  },
  '約束': {
    reading: 'やくそく',
    romaji: 'yakusoku',
    pattern: 'heiban',
    patternNameJa: '平板型 (⓪)',
    patternNameBn: 'হেইবান (সমতল ⓪)',
    downstepMora: 0,
    morae: ['や', 'く', 'そ', 'く'],
    targetPitches: ['L', 'H', 'H', 'H'],
    meaningEn: 'Promise / Appointment',
    meaningBn: 'প্রতিশ্রুতি / অ্যাপয়েন্টমেন্ট',
    particlePitchBehaviorBn: 'L-H-H-H-H সমতল পিচ।',
    downstepTipBn: 'কোনো ড্রপ নেই; সমতলভাবে উচ্চারিত হয়।'
  },
  '起きる': {
    reading: 'おきる',
    romaji: 'okiru',
    pattern: 'nakadaka',
    patternNameJa: '中高型 (②)',
    patternNameBn: 'নাকাদাকা (মাঝ-উঁচু ②)',
    downstepMora: 2,
    morae: ['お', 'き', 'る'],
    targetPitches: ['L', 'H', 'L'],
    meaningEn: 'To wake up',
    meaningBn: 'ঘুম থেকে ওঠা',
    particlePitchBehaviorBn: 'L-H-L প্যাটার্ন।',
    downstepTipBn: '"ও" নিচু, "কি" উঁচু, "রু" নিচে নেমে যায়।'
  },
  '食べる': {
    reading: 'たべる',
    romaji: 'taberu',
    pattern: 'nakadaka',
    patternNameJa: '中高型 (②)',
    patternNameBn: 'নাকাদাকা (মাঝ-উঁচু ②)',
    downstepMora: 2,
    morae: ['た', 'べ', 'る'],
    targetPitches: ['L', 'H', 'L'],
    meaningEn: 'To eat',
    meaningBn: 'খাওয়া',
    particlePitchBehaviorBn: 'L-H-L প্যাটার্ন।',
    downstepTipBn: '"তা" নিচু, "বে" উঁচু, "রু" নিচে নেমে যায়।'
  },
  '飲む': {
    reading: 'のむ',
    romaji: 'nomu',
    pattern: 'atamadaka',
    patternNameJa: '頭高型 (①)',
    patternNameBn: 'আতামাদাকা (মাথা-উঁচু ①)',
    downstepMora: 1,
    morae: ['の', 'む'],
    targetPitches: ['H', 'L'],
    meaningEn: 'To drink',
    meaningBn: 'পান করা',
    particlePitchBehaviorBn: 'H-L-L প্যাটার্ন।',
    downstepTipBn: 'প্রথম মোরা "নো" উঁচু, দ্বিতীয় মোরা "মু" নিচু।'
  },
  '行く': {
    reading: 'いく',
    romaji: 'iku',
    pattern: 'heiban',
    patternNameJa: '平板型 (⓪)',
    patternNameBn: 'হেইবান (সমতল ⓪)',
    downstepMora: 0,
    morae: ['い', 'く'],
    targetPitches: ['L', 'H'],
    meaningEn: 'To go',
    meaningBn: 'যাওয়া',
    particlePitchBehaviorBn: 'L-H-H সমতল প্যাটার্ন।',
    downstepTipBn: '"ই" নিচু, "কু" উঁচু।'
  },
  '帰る': {
    reading: 'かえる',
    romaji: 'kaeru',
    pattern: 'atamadaka',
    patternNameJa: '頭高型 (①)',
    patternNameBn: 'আতামাদাকা (মাথা-উঁচু ①)',
    downstepMora: 1,
    morae: ['か', 'え', 'る'],
    targetPitches: ['H', 'L', 'L'],
    meaningEn: 'To return home',
    meaningBn: 'ফিরে আসা',
    particlePitchBehaviorBn: 'H-L-L প্যাটার্ন।',
    downstepTipBn: '"কা" উঁচু, "এ-রু" নিচু।'
  },
  '見る': {
    reading: 'みる',
    romaji: 'miru',
    pattern: 'atamadaka',
    patternNameJa: '頭高型 (①)',
    patternNameBn: 'আতামাদাকা (মাথা-উঁচু ①)',
    downstepMora: 1,
    morae: ['み', 'る'],
    targetPitches: ['H', 'L'],
    meaningEn: 'To see / watch',
    meaningBn: 'দেখা',
    particlePitchBehaviorBn: 'H-L-L প্যাটার্ন।',
    downstepTipBn: '"মি" উঁচু, "রু" নিচু।'
  },
  '読む': {
    reading: 'よむ',
    romaji: 'yomu',
    pattern: 'atamadaka',
    patternNameJa: '頭高型 (①)',
    patternNameBn: 'আতামাদাকা (মাথা-উঁচু ①)',
    downstepMora: 1,
    morae: ['よ', 'む'],
    targetPitches: ['H', 'L'],
    meaningEn: 'To read',
    meaningBn: 'পড়া',
    particlePitchBehaviorBn: 'H-L-L প্যাটার্ন।',
    downstepTipBn: '"ইয়ো" উঁচু, "মু" নিচু।'
  },
  '書く': {
    reading: 'かく',
    romaji: 'kaku',
    pattern: 'atamadaka',
    patternNameJa: '頭高型 (①)',
    patternNameBn: 'আতামাদাকা (মাথা-উঁচু ①)',
    downstepMora: 1,
    morae: ['か', 'く'],
    targetPitches: ['H', 'L'],
    meaningEn: 'To write',
    meaningBn: 'লেখা',
    particlePitchBehaviorBn: 'H-L-L প্যাটার্ন।',
    downstepTipBn: '"কা" উঁচু, "কু" নিচু।'
  },
  '働く': {
    reading: 'はたらく',
    romaji: 'hataraku',
    pattern: 'heiban',
    patternNameJa: '平板型 (⓪)',
    patternNameBn: 'হেইবান (সমতল ⓪)',
    downstepMora: 0,
    morae: ['は', 'た', 'ら', 'く'],
    targetPitches: ['L', 'H', 'H', 'H'],
    meaningEn: 'To work',
    meaningBn: 'কাজ করা',
    particlePitchBehaviorBn: 'L-H-H-H-H সমতল প্যাটার্ন।',
    downstepTipBn: '"হা" নিচু, বাকি সব মোরা উঁচু ও সমতল।'
  },
  '本': {
    reading: 'ほん',
    romaji: 'hon',
    pattern: 'atamadaka',
    patternNameJa: '頭高型 (①)',
    patternNameBn: 'আতামাদাকা (মাথা-উঁচু ①)',
    downstepMora: 1,
    morae: ['ほ', 'ん'],
    targetPitches: ['H', 'L'],
    meaningEn: 'Book',
    meaningBn: 'বই',
    particlePitchBehaviorBn: 'H-L-L প্যাটার্ন।',
    downstepTipBn: '"হো" উঁচু, "ন" নিচু।'
  },
  '準備': {
    reading: 'じゅんび',
    romaji: 'junbi',
    pattern: 'atamadaka',
    patternNameJa: '頭高型 (①)',
    patternNameBn: 'আতামাদাকা (মাথা-উঁচু ①)',
    downstepMora: 1,
    morae: ['じゅ', 'ん', 'び'],
    targetPitches: ['H', 'L', 'L'],
    meaningEn: 'Preparation',
    meaningBn: 'প্রস্তুতি',
    particlePitchBehaviorBn: 'H-L-L প্যাটার্ন।',
    downstepTipBn: '"জুন" উঁচু, "বি" নিচু।'
  },
  '敬語': {
    reading: 'けいご',
    romaji: 'keigo',
    pattern: 'heiban',
    patternNameJa: '平板型 (⓪)',
    patternNameBn: 'হেইবান (সমতল ⓪)',
    downstepMora: 0,
    morae: ['け', 'い', 'ご'],
    targetPitches: ['L', 'H', 'H'],
    meaningEn: 'Honorific Japanese',
    meaningBn: 'সম্মানসূচক ভাষা',
    particlePitchBehaviorBn: 'L-H-H-H সমতল পিচ।',
    downstepTipBn: '"কে" নিচু, "ই-গো" উঁচু ও সমতল।'
  },
  '水': {
    reading: 'みず',
    romaji: 'mizu',
    pattern: 'heiban',
    patternNameJa: '平板型 (⓪)',
    patternNameBn: 'হেইবান (সমতল ⓪)',
    downstepMora: 0,
    morae: ['み', 'ず'],
    targetPitches: ['L', 'H'],
    meaningEn: 'Water',
    meaningBn: 'পানি',
    particlePitchBehaviorBn: 'L-H-H সমতল পিচ।',
    downstepTipBn: '"মি" নিচু, "জু" উঁচু এবং পার্টিকেল পর্যন্ত উঁচু থাকে।'
  },
  'ご飯': {
    reading: 'ごはん',
    romaji: 'gohan',
    pattern: 'atamadaka',
    patternNameJa: '頭高型 (①)',
    patternNameBn: 'আতামাদাকা (মাথা-উঁচু ①)',
    downstepMora: 1,
    morae: ['ご', 'は', 'ん'],
    targetPitches: ['H', 'L', 'L'],
    meaningEn: 'Cooked rice / Meal',
    meaningBn: 'ভাত / খাবার',
    particlePitchBehaviorBn: 'H-L-L প্যাটার্ন।',
    downstepTipBn: '"গো" উঁচু, "হান" নিচু।'
  }
};

/**
 * Split Japanese text into acoustic morae (handling small ya/yu/yo, choonpu, and sokuon)
 */
export function decomposeToMorae(kana: string): string[] {
  if (!kana) return [];
  const smallKana = new Set(['ゃ', 'ゅ', 'ょ', 'ャ', 'ュ', 'ョ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ']);
  const morae: string[] = [];

  for (let i = 0; i < kana.length; i++) {
    const char = kana[i];
    const nextChar = kana[i + 1];

    if (nextChar && smallKana.has(nextChar)) {
      morae.push(char + nextChar);
      i++;
    } else {
      morae.push(char);
    }
  }

  return morae;
}

/**
 * Get accurate Tokyo pitch-accent information for any word.
 * If in dictionary, returns exact linguistic entry; otherwise computes standard Tokyo heuristic.
 */
export function getTokyoPitchInfo(word: string, fallbackReading?: string): TokyoPitchInfo {
  // Check exact kanji or reading match
  if (TOKYO_PITCH_DICTIONARY[word]) {
    return {
      word,
      ...TOKYO_PITCH_DICTIONARY[word]
    };
  }

  // Check matching by reading
  const matchByReading = Object.entries(TOKYO_PITCH_DICTIONARY).find(
    ([k, v]) => v.reading === word || v.reading === fallbackReading || k === fallbackReading
  );
  if (matchByReading) {
    return {
      word,
      ...matchByReading[1]
    };
  }

  // Derive standard heuristic: Most unaccented nouns and Ichidan verbs are Heiban (0) or Nakadaka (2)
  const kana = fallbackReading || word;
  const morae = decomposeToMorae(kana);
  const moraCount = Math.max(1, morae.length);

  // Default to Heiban (0) for >2 morae or Atamadaka (1) for 2 morae
  const isAtamadaka = moraCount === 2 && !word.endsWith('る');
  const pattern: PitchAccentPattern = isAtamadaka ? 'atamadaka' : 'heiban';
  const downstepMora = isAtamadaka ? 1 : 0;

  const targetPitches: ('H' | 'L')[] = morae.map((_, i) => {
    if (pattern === 'atamadaka') return i === 0 ? 'H' : 'L';
    return i === 0 ? 'L' : 'H';
  });

  return {
    word,
    reading: kana,
    romaji: kana,
    pattern,
    patternNameJa: pattern === 'atamadaka' ? '頭高型 (①)' : '平板型 (⓪)',
    patternNameBn: pattern === 'atamadaka' ? 'আতামাদাকা (মাথা-উঁচু ①)' : 'হেইবান (সমতল ⓪)',
    downstepMora,
    morae,
    targetPitches,
    meaningEn: 'Vocabulary Word',
    meaningBn: 'শব্দার্থ',
    particlePitchBehaviorBn: pattern === 'heiban'
      ? 'পার্টিকেল সহ সুর সমতল ও উঁচু থাকবে।'
      : 'পার্টিকেলে সুর নিচে নেমে যাবে।',
    downstepTipBn: pattern === 'heiban'
      ? 'প্রথম মোরা নিচু, পরবর্তী সকল মোরা উঁচু ও সমতল।'
      : 'প্রথম মোরা উঁচু, পরবর্তী মোরাগুলো নিচু।'
  };
}

/**
 * Returns color tokens according to pitch accent pattern
 */
export function getPatternColorTheme(pattern: PitchAccentPattern): {
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  lineColor: string;
  accentDropColor: string;
} {
  switch (pattern) {
    case 'atamadaka':
      return {
        badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
        badgeBorder: 'border-rose-200 dark:border-rose-800',
        badgeText: 'text-rose-700 dark:text-rose-300',
        lineColor: '#f43f5e',
        accentDropColor: '#e11d48'
      };
    case 'nakadaka':
      return {
        badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
        badgeBorder: 'border-amber-200 dark:border-amber-800',
        badgeText: 'text-amber-700 dark:text-amber-300',
        lineColor: '#f59e0b',
        accentDropColor: '#d97706'
      };
    case 'odaka':
      return {
        badgeBg: 'bg-purple-50 dark:bg-purple-950/40',
        badgeBorder: 'border-purple-200 dark:border-purple-800',
        badgeText: 'text-purple-700 dark:text-purple-300',
        lineColor: '#a855f7',
        accentDropColor: '#9333ea'
      };
    case 'heiban':
    default:
      return {
        badgeBg: 'bg-sky-50 dark:bg-sky-950/40',
        badgeBorder: 'border-sky-200 dark:border-sky-800',
        badgeText: 'text-sky-700 dark:text-sky-300',
        lineColor: '#0ea5e9',
        accentDropColor: '#0284c7'
      };
  }
}
