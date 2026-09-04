import {
  TokyoPitchDrill,
  DynamicDrillGenerationInput,
  DynamicDrillGenerationResult,
  PitchAccentPattern
} from '../types.js';
import { db } from '../db.js';

// Kana tables for Romaji conversion
const KANA_ROMAJI_MAP: Record<string, string> = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', を: 'wo', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo',
  しゃ: 'sha', しゅ: 'shu', しょ: 'sho',
  ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho',
  にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo',
  ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo',
  みゃ: 'mya', みゅ: 'myu', みょ: 'myo',
  りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo',
  ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
  じゃ: 'ja', じゅ: 'ju', じょ: 'jo',
  びゃ: 'bya', びゅ: 'byu', びょ: 'byo',
  ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',
  っ: 't', ー: '-'
};

// Katakana to Hiragana converter
export function katakanaToHiragana(text: string): string {
  return text.replace(/[\u30a1-\u30f6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

// Canonical Tokyo Accent Known Dictionary for Essential Vocabulary & Minimal Pairs
export const KNOWN_TOKYO_ACCENT_DICTIONARY: Record<
  string,
  {
    pattern: PitchAccentPattern;
    downstepMora: number;
    category: TokyoPitchDrill['category'];
    jlptLevel?: TokyoPitchDrill['jlptLevel'];
    meaningEn: string;
    meaningBn: string;
    contrastGroup?: string;
    contextNote?: string;
  }
> = {
  // Minimal Pairs
  はし_箸: {
    pattern: 'atamadaka',
    downstepMora: 1,
    category: 'minimal_pair',
    jlptLevel: 'N5',
    meaningEn: 'Chopsticks',
    meaningBn: 'চপস্টিক (খাওয়ার কাঠি)',
    contrastGroup: 'hashi',
    contextNote: 'Mora 1 (ha) starts HIGH, drops on mora 2 (shi). Particle is LOW (はしが = H-L-L).'
  },
  はし_橋: {
    pattern: 'odaka',
    downstepMora: 2,
    category: 'minimal_pair',
    jlptLevel: 'N5',
    meaningEn: 'Bridge',
    meaningBn: 'সেতু / ব্রিজ',
    contrastGroup: 'hashi',
    contextNote: 'Mora 1 is LOW, mora 2 is HIGH, followed by particle drop (はしが = L-H-L).'
  },
  はし_端: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'minimal_pair',
    jlptLevel: 'N4',
    meaningEn: 'Edge / Border',
    meaningBn: 'প্রান্ত / কিনারা',
    contrastGroup: 'hashi',
    contextNote: 'Mora 1 is LOW, mora 2 is HIGH and stays HIGH into particle (はしが = L-H-H).'
  },
  あめ_雨: {
    pattern: 'atamadaka',
    downstepMora: 1,
    category: 'minimal_pair',
    jlptLevel: 'N5',
    meaningEn: 'Rain',
    meaningBn: 'বৃষ্টি',
    contrastGroup: 'ame',
    contextNote: 'Head-high: Starts HIGH on "a", drops to LOW on "me".'
  },
  あめ_飴: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'minimal_pair',
    jlptLevel: 'N5',
    meaningEn: 'Candy / Sweets',
    meaningBn: 'মিছরি / ক্যান্ডি',
    contrastGroup: 'ame',
    contextNote: 'Flat: Starts LOW on "a", rises to HIGH on "me" and stays flat.'
  },
  かき_牡蠣: {
    pattern: 'atamadaka',
    downstepMora: 1,
    category: 'minimal_pair',
    jlptLevel: 'N4',
    meaningEn: 'Oyster (seafood)',
    meaningBn: 'ঝিনুক / অয়েস্টার',
    contrastGroup: 'kaki',
    contextNote: 'Head-high: Mora 1 (ka) is HIGH, mora 2 (ki) drops to LOW.'
  },
  かき_柿: {
    pattern: 'odaka',
    downstepMora: 2,
    category: 'minimal_pair',
    jlptLevel: 'N5',
    meaningEn: 'Persimmon (fruit)',
    meaningBn: 'ফার্সিমন (ফল)',
    contrastGroup: 'kaki',
    contextNote: 'Tail-high: Mora 1 is LOW, mora 2 is HIGH, particle drops to LOW.'
  },
  かえる_帰る: {
    pattern: 'atamadaka',
    downstepMora: 1,
    category: 'minimal_pair',
    jlptLevel: 'N5',
    meaningEn: 'To return / go home',
    meaningBn: 'বাড়ি ফেরা',
    contrastGroup: 'kaeru',
    contextNote: 'Head-high: ka (H) -> e-ru (L-L).'
  },
  かえる_蛙: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'minimal_pair',
    jlptLevel: 'N4',
    meaningEn: 'Frog',
    meaningBn: 'ব্যাঙ',
    contrastGroup: 'kaeru',
    contextNote: 'Flat: ka (L) -> e-ru (H-H).'
  },
  かえる_変える: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'minimal_pair',
    jlptLevel: 'N4',
    meaningEn: 'To change / alter',
    meaningBn: 'পরিবর্তন করা',
    contrastGroup: 'kaeru',
    contextNote: 'Flat transitive verb: ka (L) -> e-ru (H-H).'
  },
  にほん_日本: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'minimal_pair',
    jlptLevel: 'N5',
    meaningEn: 'Japan (Country)',
    meaningBn: 'জাপান দেশ',
    contrastGroup: 'nihon',
    contextNote: 'Flat: ni (L) -> ho-n (H-H).'
  },
  にほん_二本: {
    pattern: 'atamadaka',
    downstepMora: 1,
    category: 'minimal_pair',
    jlptLevel: 'N5',
    meaningEn: 'Two long cylindrical objects',
    meaningBn: 'দুটি লম্বা জিনিস (কাঠি/বোতল)',
    contrastGroup: 'nihon',
    contextNote: 'Head-high counter: ni (H) -> ho-n (L-L).'
  },
  しろ_白: {
    pattern: 'odaka',
    downstepMora: 2,
    category: 'minimal_pair',
    jlptLevel: 'N5',
    meaningEn: 'White (noun)',
    meaningBn: 'সাদা রঙ',
    contrastGroup: 'shiro',
    contextNote: 'Tail-high: shi (L) -> ro (H).'
  },
  しろ_城: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'minimal_pair',
    jlptLevel: 'N4',
    meaningEn: 'Castle',
    meaningBn: 'দুর্গ / কেল্লা',
    contrastGroup: 'shiro',
    contextNote: 'Flat: shi (L) -> ro (H).'
  },

  // JLPT N5 Essentials
  せんせい_先生: {
    pattern: 'nakadaka',
    downstepMora: 3,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Teacher / Instructor',
    meaningBn: 'শিক্ষক / গুরু',
    contextNote: 'Nakadaka: se (L) -> n-se (H-H) -> downstep drop on i (L).'
  },
  がくせい_学生: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Student',
    meaningBn: 'শিক্ষার্থী / ছাত্র',
    contextNote: 'Heiban: ga (L) -> ku-se-i (H-H-H).'
  },
  がっこう_学校: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'School',
    meaningBn: 'বিদ্যালয় / স্কুল',
    contextNote: 'Heiban: ga (L) -> k-ko-u (H-H-H).'
  },
  ともだち_友達: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Friend',
    meaningBn: 'বন্ধু',
    contextNote: 'Heiban: to (L) -> mo-da-chi (H-H-H).'
  },
  みず_水: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Water (cold)',
    meaningBn: 'পানি / জল',
    contextNote: 'Heiban: mi (L) -> zu (H).'
  },
  おちゃ_お茶: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Green tea',
    meaningBn: 'সবুজ চা / গ্রিন টি',
    contextNote: 'Heiban: o (L) -> cha (H).'
  },
  ごはん_ご飯: {
    pattern: 'atamadaka',
    downstepMora: 1,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Cooked rice / Meal',
    meaningBn: 'ভাত / খাবার',
    contextNote: 'Atamadaka: go (H) -> ha-n (L-L).'
  },
  たまご_卵: {
    pattern: 'nakadaka',
    downstepMora: 2,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Egg',
    meaningBn: 'ডিম',
    contextNote: 'Nakadaka: ta (L) -> ma (H) -> go (L).'
  },
  さかな_魚: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Fish',
    meaningBn: 'মাছ',
    contextNote: 'Heiban: sa (L) -> ka-na (H-H).'
  },
  にく_肉: {
    pattern: 'nakadaka',
    downstepMora: 2,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Meat',
    meaningBn: 'মাংস',
    contextNote: 'Odaka/Nakadaka: ni (L) -> ku (H).'
  },
  くるま_車: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Car / Vehicle',
    meaningBn: 'গাড়ি',
    contextNote: 'Heiban: ku (L) -> ru-ma (H-H).'
  },
  でんしゃ_電車: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Train / Electric train',
    meaningBn: 'রেলগাড়ি / ট্রেন',
    contextNote: 'Heiban: de (L) -> n-sha (H-H).'
  },
  ひこうき_飛行機: {
    pattern: 'nakadaka',
    downstepMora: 2,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Airplane',
    meaningBn: 'উড়োজাহাজ / বিমান',
    contextNote: 'Nakadaka: hi (L) -> ko (H) -> u-ki (L-L).'
  },
  えき_駅: {
    pattern: 'atamadaka',
    downstepMora: 1,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Train Station',
    meaningBn: 'রেলওয়ে স্টেশন',
    contextNote: 'Atamadaka: e (H) -> ki (L).'
  },
  ほん_本: {
    pattern: 'atamadaka',
    downstepMora: 1,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Book',
    meaningBn: 'বই',
    contextNote: 'Atamadaka: ho (H) -> n (L).'
  },
  いぬ_犬: {
    pattern: 'nakadaka',
    downstepMora: 2,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Dog',
    meaningBn: 'কুকুর',
    contextNote: 'Tail-high/Nakadaka: i (L) -> nu (H).'
  },
  ねこ_猫: {
    pattern: 'atamadaka',
    downstepMora: 1,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Cat',
    meaningBn: 'বিড়াল',
    contextNote: 'Atamadaka: ne (H) -> ko (L).'
  },
  やま_山: {
    pattern: 'nakadaka',
    downstepMora: 2,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Mountain',
    meaningBn: 'পাহাড় / পর্বত',
    contextNote: 'Odaka: ya (L) -> ma (H).'
  },
  かわ_川: {
    pattern: 'nakadaka',
    downstepMora: 2,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'River',
    meaningBn: 'নদী',
    contextNote: 'Odaka: ka (L) -> wa (H).'
  },
  はな_花: {
    pattern: 'nakadaka',
    downstepMora: 2,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Flower',
    meaningBn: 'ফুল',
    contextNote: 'Odaka: ha (L) -> na (H).'
  },
  はな_鼻: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'n5_essential',
    jlptLevel: 'N5',
    meaningEn: 'Nose',
    meaningBn: 'নাক',
    contextNote: 'Heiban: ha (L) -> na (H).'
  },

  // JLPT N4 Conversations
  ありがとう_有難う: {
    pattern: 'nakadaka',
    downstepMora: 2,
    category: 'n4_conversation',
    jlptLevel: 'N4',
    meaningEn: 'Thank you',
    meaningBn: 'আপনাকে ধন্যবাদ',
    contextNote: 'Tokyo standard: a (L) -> ri (H) -> ga-to-u (L-L-L).'
  },
  すみません_済みません: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'n4_conversation',
    jlptLevel: 'N4',
    meaningEn: 'Excuse me / Sorry',
    meaningBn: 'মাফ করবেন / দুঃখিত',
    contextNote: 'Heiban: su (L) -> mi-ma-se-n (H-H-H-H).'
  },
  よろしく_宜しく: {
    pattern: 'nakadaka',
    downstepMora: 2,
    category: 'n4_conversation',
    jlptLevel: 'N4',
    meaningEn: 'Pleased to meet you / Best regards',
    meaningBn: 'শুভকামনা রইল / অনুগ্রহ করে বিবেচনা করবেন',
    contextNote: 'Nakadaka: yo (L) -> ro (H) -> shi-ku (L-L).'
  },
  こんにちは_今日は: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'n4_conversation',
    jlptLevel: 'N5',
    meaningEn: 'Good afternoon / Hello',
    meaningBn: 'শুভ দুপুর / নমস্কার',
    contextNote: 'Heiban: ko (L) -> n-ni-chi-wa (H-H-H-H).'
  },
  こんばんは_今晩は: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'n4_conversation',
    jlptLevel: 'N5',
    meaningEn: 'Good evening',
    meaningBn: 'শুভ সন্ধ্যা',
    contextNote: 'Heiban: ko (L) -> n-ba-n-wa (H-H-H-H).'
  },
  おはよう_お早う: {
    pattern: 'nakadaka',
    downstepMora: 2,
    category: 'n4_conversation',
    jlptLevel: 'N5',
    meaningEn: 'Good morning',
    meaningBn: 'শুভ সকাল',
    contextNote: 'Nakadaka: o (L) -> ha (H) -> yo-u (L-L).'
  },
  さようなら_左様なら: {
    pattern: 'nakadaka',
    downstepMora: 4,
    category: 'n4_conversation',
    jlptLevel: 'N5',
    meaningEn: 'Goodbye / Farewell',
    meaningBn: 'বিদায়',
    contextNote: 'Nakadaka: sa (L) -> yo-u-na (H-H-H) -> ra (L).'
  },

  // Keigo & Business Formulas
  いらっしゃいませ_いらっしゃいませ: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'keigo_formula',
    jlptLevel: 'N4',
    meaningEn: 'Welcome! (Store/Shop greeting)',
    meaningBn: 'স্বাগতম! (দোকানের সম্ভাষণ)',
    contextNote: 'Heiban: i (L) -> ra-s-sha-i-ma-se (H-H-H-H-H-H-H).'
  },
  しょうしょうおまちください_少々お待ちください: {
    pattern: 'nakadaka',
    downstepMora: 8,
    category: 'keigo_formula',
    jlptLevel: 'N3',
    meaningEn: 'Please wait a moment',
    meaningBn: 'দয়া করে একটু অপেক্ষা করুন',
    contextNote: 'Polite hospitality phrase with polite melodic cadence.'
  },
  かしこまりました_かしこまりました: {
    pattern: 'heiban',
    downstepMora: 0,
    category: 'keigo_formula',
    jlptLevel: 'N3',
    meaningEn: 'Certainly / Understood with pleasure',
    meaningBn: 'নিশ্চয়ই, বুঝতে পেরেছি (সম্মানসূচক)',
    contextNote: 'Standard hospitality affirmative response in Tokyo service businesses.'
  },
  おつかれさまでした_お疲れ様でした: {
    pattern: 'nakadaka',
    downstepMora: 5,
    category: 'keigo_formula',
    jlptLevel: 'N4',
    meaningEn: 'Thank you for your hard work',
    meaningBn: 'কাজের জন্য ধন্যবাদ / শুভ সমাপ্তি',
    contextNote: 'Tokyo workplace greeting when finishing shift or meeting.'
  }
};

export class DrillSeedGeneratorService {
  /**
   * Decompose Japanese Kana into individual Morae.
   * Accurately handles digraphs (きゃ, しゅ, ちょ, etc.),
   * small vowels (ぁ, ぃ, ぅ, ぇ, ぉ), geminate stops (っ / ッ),
   * long vowels (ー, おう, えい), and syllabic nasals (ん / ン).
   */
  public static decomposeMorae(text: string): string[] {
    if (!text) return [];

    // Clean punctuation
    const clean = text.replace(/[\s\u3000。、！？!?,.\-]/g, '');
    const morae: string[] = [];

    const smallKana = new Set([
      'ゃ', 'ゅ', 'ょ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ゎ',
      'ャ', 'ュ', 'ョ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ヮ'
    ]);

    let i = 0;
    while (i < clean.length) {
      const char = clean[i];
      const next = clean[i + 1];

      if (next && smallKana.has(next)) {
        morae.push(char + next);
        i += 2;
      } else {
        morae.push(char);
        i += 1;
      }
    }

    return morae;
  }

  /**
   * Transliterate Kana morae into standard Hepburn Romaji
   */
  public static moraeToRomaji(morae: string[]): string {
    let result = '';
    for (let i = 0; i < morae.length; i++) {
      const mora = morae[i];
      const hiraganaMora = katakanaToHiragana(mora);

      if (hiraganaMora === 'っ') {
        // Geminate stop: double the first letter of next mora
        const nextMora = morae[i + 1] ? katakanaToHiragana(morae[i + 1]) : '';
        const nextRomaji = KANA_ROMAJI_MAP[nextMora] || '';
        result += nextRomaji ? nextRomaji[0] : 't';
      } else if (hiraganaMora === 'ー') {
        // Prolong previous vowel
        const lastVowel = result.length > 0 ? result[result.length - 1] : 'a';
        result += lastVowel;
      } else {
        result += KANA_ROMAJI_MAP[hiraganaMora] || hiraganaMora;
      }
    }
    return result;
  }

  /**
   * Determine Tokyo Pitch Type & Downstep Locus
   */
  public static determinePitchAccent(
    word: string,
    readingKana: string,
    morae: string[],
    overridePattern?: PitchAccentPattern,
    overrideDownstepMora?: number
  ): {
    pattern: PitchAccentPattern;
    patternNameJa: string;
    downstepMora: number;
  } {
    const moraCount = morae.length;

    // 1. Check explicit overrides
    if (overridePattern) {
      const downstep =
        typeof overrideDownstepMora === 'number'
          ? overrideDownstepMora
          : overridePattern === 'heiban'
          ? 0
          : overridePattern === 'atamadaka'
          ? 1
          : overridePattern === 'odaka'
          ? moraCount
          : Math.max(2, moraCount - 1);

      return {
        pattern: overridePattern,
        patternNameJa: this.formatPatternNameJa(overridePattern, downstep),
        downstepMora: downstep
      };
    }

    // 2. Check canonical dictionary
    const dictKey1 = `${readingKana}_${word}`;
    const dictKey2 = `${word}_${readingKana}`;
    const entry = KNOWN_TOKYO_ACCENT_DICTIONARY[dictKey1] || KNOWN_TOKYO_ACCENT_DICTIONARY[dictKey2];

    if (entry) {
      return {
        pattern: entry.pattern,
        patternNameJa: this.formatPatternNameJa(entry.pattern, entry.downstepMora),
        downstepMora: entry.downstepMora
      };
    }

    // Also check by reading Kana or word individually
    for (const [key, data] of Object.entries(KNOWN_TOKYO_ACCENT_DICTIONARY)) {
      const [kKana, kWord] = key.split('_');
      if (kKana === readingKana || kWord === word) {
        return {
          pattern: data.pattern,
          patternNameJa: this.formatPatternNameJa(data.pattern, data.downstepMora),
          downstepMora: data.downstepMora
        };
      }
    }

    // 3. Algorithmic prediction based on Japanese phonotactic rules:
    // Single mora words: usually Atamadaka or Heiban
    if (moraCount <= 1) {
      return {
        pattern: 'atamadaka',
        patternNameJa: '頭高型 (①)',
        downstepMora: 1
      };
    }

    // Katakana loanwords (majority follow antepenultimate or penultimate accent rule)
    const isKatakana = /^[\u30a0-\u30ff]+$/.test(word);
    if (isKatakana && moraCount >= 3) {
      const downstep = Math.max(2, moraCount - 1);
      return {
        pattern: 'nakadaka',
        patternNameJa: this.formatPatternNameJa('nakadaka', downstep),
        downstepMora: downstep
      };
    }

    // Japanese verbs ending in -eru or -iru (Ichidan) typically follow Nakadaka or Heiban
    const lastMora = morae[moraCount - 1];
    if (lastMora === 'る' && moraCount >= 3) {
      const downstep = Math.max(2, moraCount - 1);
      return {
        pattern: 'nakadaka',
        patternNameJa: this.formatPatternNameJa('nakadaka', downstep),
        downstepMora: downstep
      };
    }

    // i-Adjectives: regular Nakadaka on penultimate mora (e.g. おいしい -> drop on 3)
    if (lastMora === 'い' && moraCount >= 3) {
      const downstep = moraCount - 1;
      return {
        pattern: 'nakadaka',
        patternNameJa: this.formatPatternNameJa('nakadaka', downstep),
        downstepMora: downstep
      };
    }

    // Default 2-mora nouns: statistically ~55% Heiban in modern Tokyo speech
    if (moraCount === 2) {
      return {
        pattern: 'heiban',
        patternNameJa: '平板型 (⓪)',
        downstepMora: 0
      };
    }

    // Longer native nouns default to Heiban (flat) or Nakadaka
    return {
      pattern: 'heiban',
      patternNameJa: '平板型 (⓪)',
      downstepMora: 0
    };
  }

  /**
   * Helper to format Japanese pattern label
   */
  public static formatPatternNameJa(pattern: PitchAccentPattern, downstepMora: number): string {
    switch (pattern) {
      case 'heiban':
        return '平板型 (⓪)';
      case 'atamadaka':
        return '頭高型 (①)';
      case 'odaka':
        return `尾高型 (${downstepMora > 0 ? downstepMora : 'N'})`;
      case 'nakadaka':
      default:
        return `中高型 (${downstepMora > 0 ? downstepMora : '②'})`;
    }
  }

  /**
   * Generate exact Tokyo Pitch Sequence ('H' or 'L')
   */
  public static generateTargetPitches(
    moraCount: number,
    pattern: PitchAccentPattern,
    downstepMora: number
  ): ('H' | 'L')[] {
    if (moraCount <= 0) return [];
    if (moraCount === 1) {
      return pattern === 'atamadaka' ? ['H'] : ['L'];
    }

    const pitches: ('H' | 'L')[] = [];

    switch (pattern) {
      case 'atamadaka': // ① Head-High: 1st High, all subsequent Low
        pitches.push('H');
        for (let i = 1; i < moraCount; i++) {
          pitches.push('L');
        }
        break;

      case 'heiban': // ⓪ Flat: 1st Low, all subsequent High
      case 'odaka': // (N) Tail-High: 1st Low, all subsequent High through end
        pitches.push('L');
        for (let i = 1; i < moraCount; i++) {
          pitches.push('H');
        }
        break;

      case 'nakadaka': // (2..N-1) Mid-High: 1st Low, rise to High, drop after downstep
      default: {
        const drop = Math.max(2, Math.min(downstepMora || 2, moraCount - 1));
        pitches.push('L');
        for (let i = 1; i < drop; i++) {
          pitches.push('H');
        }
        for (let i = drop; i < moraCount; i++) {
          pitches.push('L');
        }
        break;
      }
    }

    return pitches;
  }

  /**
   * Generate relative target frequency contour (multipliers of base F0)
   * Tokyo Pitch standard ratio: Low mora ~1.0, High mora ~1.28 (+28% frequency shift)
   * With subtle microprosodic inflection.
   */
  public static generateRelativeTargetContour(pitches: ('H' | 'L')[]): number[] {
    return pitches.map((pitch, idx) => {
      if (pitch === 'H') {
        // High mora register
        return 1.28;
      } else {
        // Low mora register (initial Low is ~1.0; post-downstep Low is ~0.92 due to catathesis)
        return idx === 0 ? 1.0 : 0.92;
      }
    });
  }

  /**
   * Generate standard Hz contour given a standard speaker baseline (default 180Hz)
   */
  public static generateStandardHzContour(relativeContour: number[], baselineHz = 180): number[] {
    return relativeContour.map((mult) => Math.round(baselineHz * mult));
  }

  /**
   * Generate standard expected intensity envelope (isochronous mora intensity ~1.0)
   */
  public static generateIntensityEnvelope(moraCount: number): number[] {
    return Array.from({ length: moraCount }, () => 1.0);
  }

  /**
   * Generate a comprehensive TokyoPitchDrill from raw input
   */
  public static generateSingleDrill(input: DynamicDrillGenerationInput): TokyoPitchDrill {
    const rawWord = input.word.trim();
    const readingKana = input.readingKana ? input.readingKana.trim() : rawWord;
    const morae = this.decomposeMorae(readingKana);
    const moraCount = morae.length;
    const romaji = this.moraeToRomaji(morae);

    const { pattern, patternNameJa, downstepMora } = this.determinePitchAccent(
      rawWord,
      readingKana,
      morae,
      input.overridePattern,
      input.overrideDownstepMora
    );

    const targetPitches = this.generateTargetPitches(moraCount, pattern, downstepMora);
    const relativeTargetContour = this.generateRelativeTargetContour(targetPitches);
    const standardHzContour = this.generateStandardHzContour(relativeTargetContour, 185);
    const targetIntensityEnvelope = this.generateIntensityEnvelope(moraCount);

    const dictKey1 = `${readingKana}_${rawWord}`;
    const dictKey2 = `${rawWord}_${readingKana}`;
    const entry = KNOWN_TOKYO_ACCENT_DICTIONARY[dictKey1] || KNOWN_TOKYO_ACCENT_DICTIONARY[dictKey2];

    const id = `drill-${rawWord}-${readingKana}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;

    return {
      id,
      category: input.category || entry?.category || 'n5_essential',
      kanji: rawWord,
      readingKana,
      romaji,
      moraCount,
      morae,
      pattern,
      patternNameJa,
      downstepMora,
      targetPitches,
      relativeTargetContour,
      standardHzContour,
      targetIntensityEnvelope,
      meaningEn: input.meaningEn || entry?.meaningEn || rawWord,
      meaningBn: input.meaningBn || entry?.meaningBn || rawWord,
      contextNote: input.contextNote || entry?.contextNote,
      contrastGroup: input.contrastGroup || entry?.contrastGroup,
      jlptLevel: input.jlptLevel || entry?.jlptLevel || 'N5',
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Batch process raw vocabulary list into TokyoPitchDrill records
   */
  public static generateDrills(inputs: DynamicDrillGenerationInput[]): DynamicDrillGenerationResult {
    const drills = inputs.map((input) => this.generateSingleDrill(input));
    return {
      totalProcessed: drills.length,
      drills
    };
  }

  /**
   * Bulk-seed the platform database with default curated Tokyo Pitch Drills
   */
  public static seedDefaultDrills(): {
    totalSeeded: number;
    inserted: number;
    updated: number;
  } {
    const defaultInputs: DynamicDrillGenerationInput[] = Object.entries(
      KNOWN_TOKYO_ACCENT_DICTIONARY
    ).map(([key, data]) => {
      const [readingKana, kanji] = key.split('_');
      return {
        word: kanji,
        readingKana,
        meaningEn: data.meaningEn,
        meaningBn: data.meaningBn,
        category: data.category,
        jlptLevel: data.jlptLevel,
        contrastGroup: data.contrastGroup,
        contextNote: data.contextNote,
        overridePattern: data.pattern,
        overrideDownstepMora: data.downstepMora
      };
    });

    const { drills } = this.generateDrills(defaultInputs);
    const stats = db.bulkUpsertPitchDrills(drills);

    return {
      totalSeeded: stats.total,
      inserted: stats.inserted,
      updated: stats.updated
    };
  }
}
