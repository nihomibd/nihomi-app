import {
  AccentualPhrase,
  MoraTimingPoint,
  PitchAccentPattern,
  SentenceF0Point,
  SentenceProsodyAnalysisInput,
  SentenceProsodyModel,
  ShadowingApResetEvaluation,
  ShadowingEvaluationResult,
  ShadowingSubmission
} from '../types.js';
import { PhrasalAccentService } from './phrasalAccentService.js';

// Curated authentic Tokyo reference sentences
export const PRESET_SENTENCES: SentenceProsodyModel[] = [
  {
    id: 'sent-n5-01',
    sentenceText: '日本語を勉強しています。',
    readingKana: 'にほんごをべんきょうしています。',
    romaji: 'Nihongo o benkyou shite imasu.',
    meaningEn: 'I am studying Japanese.',
    meaningBn: 'আমি জাপানি ভাষা পড়াশোনা করছি।',
    jlptLevel: 'N5',
    category: 'daily',
    isQuestion: false,
    tempoMultiplier: 1.0,
    totalDurationMs: 2700,
    accentualPhrases: [
      {
        id: 'ap-1',
        phraseIndex: 1,
        text: '日本語を',
        readingKana: 'にほんごを',
        romaji: 'nihongo o',
        morae: ['に', 'ほ', 'ん', 'ご', 'を'],
        pattern: 'heiban',
        downstepMora: 0,
        targetPitches: ['L', 'H', 'H', 'H', 'H'],
        boundaryPitchMovement: 'flat',
        hasPauseAfter: true,
        pauseDurationMs: 120,
        baseF0Hz: 235,
        moraTimingsMs: [
          { mora: 'に', startMs: 0, endMs: 200, expectedHz: 180, targetPitch: 'L' },
          { mora: 'ほ', startMs: 200, endMs: 400, expectedHz: 235, targetPitch: 'H' },
          { mora: 'ん', startMs: 400, endMs: 600, expectedHz: 234, targetPitch: 'H' },
          { mora: 'ご', startMs: 600, endMs: 800, expectedHz: 232, targetPitch: 'H' },
          { mora: 'を', startMs: 800, endMs: 1000, expectedHz: 230, targetPitch: 'H' }
        ]
      },
      {
        id: 'ap-2',
        phraseIndex: 2,
        text: '勉強して',
        readingKana: 'べんきょうして',
        romaji: 'benkyou shite',
        morae: ['べ', 'ん', 'きょ', 'う', 'し', 'て'],
        pattern: 'heiban',
        downstepMora: 0,
        targetPitches: ['L', 'H', 'H', 'H', 'H', 'H'],
        boundaryPitchMovement: 'flat',
        hasPauseAfter: false,
        pauseDurationMs: 0,
        baseF0Hz: 220, // AP Reset: raises baseline back up after AP1
        moraTimingsMs: [
          { mora: 'べ', startMs: 1120, endMs: 1300, expectedHz: 175, targetPitch: 'L' },
          { mora: 'ん', startMs: 1300, endMs: 1480, expectedHz: 220, targetPitch: 'H' },
          { mora: 'きょ', startMs: 1480, endMs: 1660, expectedHz: 219, targetPitch: 'H' },
          { mora: 'う', startMs: 1660, endMs: 1840, expectedHz: 218, targetPitch: 'H' },
          { mora: 'し', startMs: 1840, endMs: 2000, expectedHz: 217, targetPitch: 'H' },
          { mora: 'て', startMs: 2000, endMs: 2160, expectedHz: 215, targetPitch: 'H' }
        ]
      },
      {
        id: 'ap-3',
        phraseIndex: 3,
        text: 'います',
        readingKana: 'います',
        romaji: 'imasu',
        morae: ['い', 'ま', 'す'],
        pattern: 'nakadaka',
        downstepMora: 2,
        targetPitches: ['L', 'H', 'L'],
        boundaryPitchMovement: 'fall',
        hasPauseAfter: false,
        pauseDurationMs: 0,
        baseF0Hz: 205,
        moraTimingsMs: [
          { mora: 'い', startMs: 2160, endMs: 2320, expectedHz: 170, targetPitch: 'L' },
          { mora: 'ま', startMs: 2320, endMs: 2500, expectedHz: 205, targetPitch: 'H' },
          { mora: 'す', startMs: 2500, endMs: 2700, expectedHz: 160, targetPitch: 'L' }
        ]
      }
    ],
    targetF0Contour: []
  },
  {
    id: 'sent-n5-02-q',
    sentenceText: 'これはペンですか？',
    readingKana: 'これはぺんですか？',
    romaji: 'Kore wa pen desu ka?',
    meaningEn: 'Is this a pen?',
    meaningBn: 'এটা কি কলম?',
    jlptLevel: 'N5',
    category: 'daily',
    isQuestion: true,
    tempoMultiplier: 1.0,
    totalDurationMs: 1900,
    accentualPhrases: [
      {
        id: 'ap-1',
        phraseIndex: 1,
        text: 'これは',
        readingKana: 'これは',
        romaji: 'kore wa',
        morae: ['こ', 'れ', 'は'],
        pattern: 'heiban',
        downstepMora: 0,
        targetPitches: ['L', 'H', 'H'],
        boundaryPitchMovement: 'flat',
        hasPauseAfter: true,
        pauseDurationMs: 80,
        baseF0Hz: 235,
        moraTimingsMs: [
          { mora: 'こ', startMs: 0, endMs: 200, expectedHz: 180, targetPitch: 'L' },
          { mora: 'れ', startMs: 200, endMs: 400, expectedHz: 235, targetPitch: 'H' },
          { mora: 'は', startMs: 400, endMs: 600, expectedHz: 232, targetPitch: 'H' }
        ]
      },
      {
        id: 'ap-2',
        phraseIndex: 2,
        text: 'ペンですか',
        readingKana: 'ぺんですか',
        romaji: 'pen desu ka',
        morae: ['ぺ', 'ん', 'で', 'す', 'か'],
        pattern: 'atamadaka',
        downstepMora: 1, // ペン is atamadaka (H-L)
        targetPitches: ['H', 'L', 'L', 'L', 'H'], // final 'ka' rises on question BPM
        boundaryPitchMovement: 'rise',
        hasPauseAfter: false,
        pauseDurationMs: 0,
        baseF0Hz: 240,
        moraTimingsMs: [
          { mora: 'ぺ', startMs: 680, endMs: 900, expectedHz: 240, targetPitch: 'H' },
          { mora: 'ん', startMs: 900, endMs: 1100, expectedHz: 175, targetPitch: 'L' },
          { mora: 'で', startMs: 1100, endMs: 1300, expectedHz: 172, targetPitch: 'L' },
          { mora: 'す', startMs: 1300, endMs: 1520, expectedHz: 168, targetPitch: 'L' },
          { mora: 'か', startMs: 1520, endMs: 1850, expectedHz: 275, targetPitch: 'H' } // Question Boundary Pitch Movement (BPM Rise)
        ]
      }
    ],
    targetF0Contour: []
  },
  {
    id: 'sent-n4-01',
    sentenceText: '駅まで歩いて、電車に乗りました。',
    readingKana: 'えきまであるいて、でんしゃにのりました。',
    romaji: 'Eki made aruite, densha ni norimashita.',
    meaningEn: 'I walked to the station and got on the train.',
    meaningBn: 'স্টেশন পর্যন্ত হেঁটে ট্রেনে চড়লাম।',
    jlptLevel: 'N4',
    category: 'daily',
    isQuestion: false,
    tempoMultiplier: 1.0,
    totalDurationMs: 3400,
    accentualPhrases: [
      {
        id: 'ap-1',
        phraseIndex: 1,
        text: '駅まで',
        readingKana: 'えきまで',
        romaji: 'eki made',
        morae: ['え', 'き', 'ま', 'で'],
        pattern: 'atamadaka',
        downstepMora: 1, // 駅 is atamadaka (H-L)
        targetPitches: ['H', 'L', 'L', 'L'],
        boundaryPitchMovement: 'flat',
        hasPauseAfter: false,
        baseF0Hz: 245,
        moraTimingsMs: [
          { mora: 'え', startMs: 0, endMs: 200, expectedHz: 245, targetPitch: 'H' },
          { mora: 'き', startMs: 200, endMs: 380, expectedHz: 180, targetPitch: 'L' },
          { mora: 'ま', startMs: 380, endMs: 560, expectedHz: 175, targetPitch: 'L' },
          { mora: 'で', startMs: 560, endMs: 740, expectedHz: 170, targetPitch: 'L' }
        ]
      },
      {
        id: 'ap-2',
        phraseIndex: 2,
        text: '歩いて',
        readingKana: 'あるいて',
        romaji: 'aruite',
        morae: ['あ', 'る', 'い', 'て'],
        pattern: 'nakadaka',
        downstepMora: 2,
        targetPitches: ['L', 'H', 'L', 'L'],
        boundaryPitchMovement: 'fall',
        hasPauseAfter: true,
        pauseDurationMs: 200,
        baseF0Hz: 225, // AP2 Reset
        moraTimingsMs: [
          { mora: 'あ', startMs: 740, endMs: 940, expectedHz: 175, targetPitch: 'L' },
          { mora: 'る', startMs: 940, endMs: 1140, expectedHz: 225, targetPitch: 'H' },
          { mora: 'い', startMs: 1140, endMs: 1320, expectedHz: 170, targetPitch: 'L' },
          { mora: 'て', startMs: 1320, endMs: 1520, expectedHz: 165, targetPitch: 'L' }
        ]
      },
      {
        id: 'ap-3',
        phraseIndex: 3,
        text: '電車に',
        readingKana: 'でんしゃに',
        romaji: 'densha ni',
        morae: ['で', 'ん', 'しゃ', 'に'],
        pattern: 'heiban',
        downstepMora: 0, // 電車 is heiban (L-H-H-H)
        targetPitches: ['L', 'H', 'H', 'H'],
        boundaryPitchMovement: 'flat',
        hasPauseAfter: false,
        baseF0Hz: 215, // AP3 Reset
        moraTimingsMs: [
          { mora: 'で', startMs: 1720, endMs: 1900, expectedHz: 170, targetPitch: 'L' },
          { mora: 'ん', startMs: 1900, endMs: 2080, expectedHz: 215, targetPitch: 'H' },
          { mora: 'しゃ', startMs: 2080, endMs: 2260, expectedHz: 213, targetPitch: 'H' },
          { mora: 'に', startMs: 2260, endMs: 2440, expectedHz: 210, targetPitch: 'H' }
        ]
      },
      {
        id: 'ap-4',
        phraseIndex: 4,
        text: '乗りました',
        readingKana: 'のりました',
        romaji: 'norimashita',
        morae: ['の', 'り', 'ま', 'し', 'た'],
        pattern: 'nakadaka',
        downstepMora: 3, // のりま'した
        targetPitches: ['L', 'H', 'H', 'L', 'L'],
        boundaryPitchMovement: 'fall',
        hasPauseAfter: false,
        baseF0Hz: 205, // AP4 Reset
        moraTimingsMs: [
          { mora: 'の', startMs: 2440, endMs: 2620, expectedHz: 165, targetPitch: 'L' },
          { mora: 'り', startMs: 2620, endMs: 2800, expectedHz: 205, targetPitch: 'H' },
          { mora: 'ま', startMs: 2800, endMs: 2980, expectedHz: 203, targetPitch: 'H' },
          { mora: 'し', startMs: 2980, endMs: 3160, expectedHz: 160, targetPitch: 'L' },
          { mora: 'た', startMs: 3160, endMs: 3380, expectedHz: 155, targetPitch: 'L' }
        ]
      }
    ],
    targetF0Contour: []
  },
  {
    id: 'sent-baito-01',
    sentenceText: 'アルバイトの面接に参りました、ラヒムと申します。',
    readingKana: 'あるばいとのめんせつにまいりました、らひむともうします。',
    romaji: 'Arubaito no mensetsu ni mairimashita, Rahimu to moushimasu.',
    meaningEn: 'I have arrived for the part-time job interview; my name is Rahim.',
    meaningBn: 'খণ্ডকালীন কাজের ইন্টারভিউয়ের জন্য এসেছি, আমার নাম রাহিম।',
    jlptLevel: 'N3',
    category: 'baito_interview',
    isQuestion: false,
    tempoMultiplier: 1.0,
    totalDurationMs: 4600,
    accentualPhrases: [
      {
        id: 'ap-1',
        phraseIndex: 1,
        text: 'アルバイトの',
        readingKana: 'あるばいとの',
        romaji: 'arubaito no',
        morae: ['あ', 'る', 'ば', 'い', 'と', 'の'],
        pattern: 'nakadaka',
        downstepMora: 3, // アルバ'イトの
        targetPitches: ['L', 'H', 'H', 'L', 'L', 'L'],
        boundaryPitchMovement: 'flat',
        hasPauseAfter: false,
        baseF0Hz: 240,
        moraTimingsMs: [
          { mora: 'あ', startMs: 0, endMs: 180, expectedHz: 175, targetPitch: 'L' },
          { mora: 'る', startMs: 180, endMs: 360, expectedHz: 240, targetPitch: 'H' },
          { mora: 'ば', startMs: 360, endMs: 540, expectedHz: 238, targetPitch: 'H' },
          { mora: 'い', startMs: 540, endMs: 720, expectedHz: 172, targetPitch: 'L' },
          { mora: 'と', startMs: 720, endMs: 900, expectedHz: 168, targetPitch: 'L' },
          { mora: 'の', startMs: 900, endMs: 1080, expectedHz: 165, targetPitch: 'L' }
        ]
      },
      {
        id: 'ap-2',
        phraseIndex: 2,
        text: '面接に',
        readingKana: 'めんせつに',
        romaji: 'mensetsu ni',
        morae: ['め', 'ん', 'せ', 'つ', 'に'],
        pattern: 'heiban',
        downstepMora: 0,
        targetPitches: ['L', 'H', 'H', 'H', 'H'],
        boundaryPitchMovement: 'flat',
        hasPauseAfter: false,
        baseF0Hz: 225, // AP2 Reset
        moraTimingsMs: [
          { mora: 'め', startMs: 1080, endMs: 1260, expectedHz: 170, targetPitch: 'L' },
          { mora: 'ん', startMs: 1260, endMs: 1440, expectedHz: 225, targetPitch: 'H' },
          { mora: 'せ', startMs: 1440, endMs: 1620, expectedHz: 223, targetPitch: 'H' },
          { mora: 'つ', startMs: 1620, endMs: 1800, expectedHz: 220, targetPitch: 'H' },
          { mora: 'に', startMs: 1800, endMs: 1980, expectedHz: 218, targetPitch: 'H' }
        ]
      },
      {
        id: 'ap-3',
        phraseIndex: 3,
        text: '参りました',
        readingKana: 'まいりました',
        romaji: 'mairimashita',
        morae: ['ま', 'い', 'り', 'ま', 'し', 'た'],
        pattern: 'nakadaka',
        downstepMora: 4, // まいりま'した
        targetPitches: ['L', 'H', 'H', 'H', 'L', 'L'],
        boundaryPitchMovement: 'fall',
        hasPauseAfter: true,
        pauseDurationMs: 250,
        baseF0Hz: 215, // AP3 Reset
        moraTimingsMs: [
          { mora: 'ま', startMs: 1980, endMs: 2160, expectedHz: 168, targetPitch: 'L' },
          { mora: 'い', startMs: 2160, endMs: 2340, expectedHz: 215, targetPitch: 'H' },
          { mora: 'り', startMs: 2340, endMs: 2520, expectedHz: 213, targetPitch: 'H' },
          { mora: 'ま', startMs: 2520, endMs: 2700, expectedHz: 210, targetPitch: 'H' },
          { mora: 'し', startMs: 2700, endMs: 2880, expectedHz: 160, targetPitch: 'L' },
          { mora: 'た', startMs: 2880, endMs: 3080, expectedHz: 155, targetPitch: 'L' }
        ]
      },
      {
        id: 'ap-4',
        phraseIndex: 4,
        text: 'ラヒムと',
        readingKana: 'らひむと',
        romaji: 'rahimu to',
        morae: ['ら', 'ひ', 'む', 'と'],
        pattern: 'atamadaka',
        downstepMora: 1,
        targetPitches: ['H', 'L', 'L', 'L'],
        boundaryPitchMovement: 'flat',
        hasPauseAfter: false,
        baseF0Hz: 230, // AP4 Reset after major breath pause
        moraTimingsMs: [
          { mora: 'ら', startMs: 3330, endMs: 3510, expectedHz: 230, targetPitch: 'H' },
          { mora: 'ひ', startMs: 3510, endMs: 3690, expectedHz: 170, targetPitch: 'L' },
          { mora: 'む', startMs: 3690, endMs: 3870, expectedHz: 165, targetPitch: 'L' },
          { mora: 'と', startMs: 3870, endMs: 4050, expectedHz: 162, targetPitch: 'L' }
        ]
      },
      {
        id: 'ap-5',
        phraseIndex: 5,
        text: '申します',
        readingKana: 'もうします',
        romaji: 'moushimasu',
        morae: ['も', 'う', 'し', 'ま', 'す'],
        pattern: 'nakadaka',
        downstepMora: 3, // もうし'ます
        targetPitches: ['L', 'H', 'H', 'L', 'L'],
        boundaryPitchMovement: 'fall',
        hasPauseAfter: false,
        baseF0Hz: 200,
        moraTimingsMs: [
          { mora: 'も', startMs: 4050, endMs: 4160, expectedHz: 165, targetPitch: 'L' },
          { mora: 'う', startMs: 4160, endMs: 4270, expectedHz: 200, targetPitch: 'H' },
          { mora: 'し', startMs: 4270, endMs: 4380, expectedHz: 198, targetPitch: 'H' },
          { mora: 'ま', startMs: 4380, endMs: 4490, expectedHz: 155, targetPitch: 'L' },
          { mora: 'す', startMs: 4490, endMs: 4600, expectedHz: 150, targetPitch: 'L' }
        ]
      }
    ],
    targetF0Contour: []
  },
  {
    id: 'sent-keigo-01-q',
    sentenceText: '少々お待ちいただけますでしょうか。',
    readingKana: 'しょうしょうおまちいただけますでしょうか。',
    romaji: 'Shoushou omachi itadakemasu deshou ka.',
    meaningEn: 'Could you please wait for a moment?',
    meaningBn: 'অনুগ্রহ করে কি একটু অপেক্ষা করবেন?',
    jlptLevel: 'N2',
    category: 'keigo_business',
    isQuestion: true,
    tempoMultiplier: 1.0,
    totalDurationMs: 3800,
    accentualPhrases: [
      {
        id: 'ap-1',
        phraseIndex: 1,
        text: '少々',
        readingKana: 'しょうしょう',
        romaji: 'shoushou',
        morae: ['しょ', 'う', 'しょ', 'う'],
        pattern: 'atamadaka',
        downstepMora: 1,
        targetPitches: ['H', 'L', 'L', 'L'],
        boundaryPitchMovement: 'flat',
        hasPauseAfter: true,
        pauseDurationMs: 100,
        baseF0Hz: 245,
        moraTimingsMs: [
          { mora: 'しょ', startMs: 0, endMs: 200, expectedHz: 245, targetPitch: 'H' },
          { mora: 'う', startMs: 200, endMs: 380, expectedHz: 180, targetPitch: 'L' },
          { mora: 'しょ', startMs: 380, endMs: 560, expectedHz: 175, targetPitch: 'L' },
          { mora: 'う', startMs: 560, endMs: 740, expectedHz: 170, targetPitch: 'L' }
        ]
      },
      {
        id: 'ap-2',
        phraseIndex: 2,
        text: 'お待ちいただけます',
        readingKana: 'おまちいただけます',
        romaji: 'omachi itadakemasu',
        morae: ['お', 'ま', 'ち', 'い', 'た', 'だ', 'け', 'ま', 'す'],
        pattern: 'nakadaka',
        downstepMora: 7, // おまちいただ'けます
        targetPitches: ['L', 'H', 'H', 'H', 'H', 'H', 'H', 'L', 'L'],
        boundaryPitchMovement: 'flat',
        hasPauseAfter: false,
        baseF0Hz: 230, // AP2 Reset
        moraTimingsMs: [
          { mora: 'お', startMs: 840, endMs: 1020, expectedHz: 175, targetPitch: 'L' },
          { mora: 'ま', startMs: 1020, endMs: 1200, expectedHz: 230, targetPitch: 'H' },
          { mora: 'ち', startMs: 1200, endMs: 1380, expectedHz: 228, targetPitch: 'H' },
          { mora: 'い', startMs: 1380, endMs: 1560, expectedHz: 226, targetPitch: 'H' },
          { mora: 'た', startMs: 1560, endMs: 1740, expectedHz: 224, targetPitch: 'H' },
          { mora: 'だ', startMs: 1740, endMs: 1920, expectedHz: 222, targetPitch: 'H' },
          { mora: 'け', startMs: 1920, endMs: 2100, expectedHz: 220, targetPitch: 'H' },
          { mora: 'ま', startMs: 2100, endMs: 2280, expectedHz: 170, targetPitch: 'L' },
          { mora: 'す', startMs: 2280, endMs: 2460, expectedHz: 165, targetPitch: 'L' }
        ]
      },
      {
        id: 'ap-3',
        phraseIndex: 3,
        text: 'でしょうか',
        readingKana: 'でしょうか',
        romaji: 'deshou ka',
        morae: ['で', 'しょ', 'う', 'か'],
        pattern: 'nakadaka',
        downstepMora: 2,
        targetPitches: ['L', 'H', 'L', 'H'], // final 'ka' rises on question BPM
        boundaryPitchMovement: 'rise',
        hasPauseAfter: false,
        baseF0Hz: 210, // AP3 Reset
        moraTimingsMs: [
          { mora: 'で', startMs: 2460, endMs: 2660, expectedHz: 165, targetPitch: 'L' },
          { mora: 'しょ', startMs: 2660, endMs: 2880, expectedHz: 210, targetPitch: 'H' },
          { mora: 'う', startMs: 2880, endMs: 3100, expectedHz: 170, targetPitch: 'L' },
          { mora: 'か', startMs: 3100, endMs: 3450, expectedHz: 280, targetPitch: 'H' } // Question rise BPM
        ]
      }
    ],
    targetF0Contour: []
  }
];

// Initialize continuous targetF0Contours for presets
for (const sent of PRESET_SENTENCES) {
  sent.targetF0Contour = generateContinuousContour(sent.accentualPhrases);
}

/**
 * Generates continuous smooth timestamped F0 contour trajectory points (~30ms intervals)
 * from Accentual Phrases with natural micro-transitions and co-articulation smoothing.
 */
export function generateContinuousContour(phrases: AccentualPhrase[]): SentenceF0Point[] {
  const points: SentenceF0Point[] = [];

  for (const ap of phrases) {
    for (let mIdx = 0; mIdx < ap.moraTimingsMs.length; mIdx++) {
      const m = ap.moraTimingsMs[mIdx];
      const prevM = mIdx > 0 ? ap.moraTimingsMs[mIdx - 1] : null;
      const nextM = mIdx < ap.moraTimingsMs.length - 1 ? ap.moraTimingsMs[mIdx + 1] : null;

      const duration = m.endMs - m.startMs;
      const stepMs = 25;
      const numSteps = Math.max(2, Math.round(duration / stepMs));

      for (let s = 0; s < numSteps; s++) {
        const t = m.startMs + (s * (duration / numSteps));
        const progress = s / numSteps;

        // Smooth cosine transition between morae to simulate vocal tract physics
        let hz = m.expectedHz;
        if (progress < 0.25 && prevM) {
          const ratio = progress / 0.25;
          hz = prevM.expectedHz + (m.expectedHz - prevM.expectedHz) * ratio;
        } else if (progress > 0.75 && nextM) {
          const ratio = (progress - 0.75) / 0.25;
          hz = m.expectedHz + (nextM.expectedHz - m.expectedHz) * ratio;
        }

        // Apply slight intra-mora natural micro-vibrato/pitch curve
        const microGliss = Math.sin(progress * Math.PI) * 1.5;
        points.push({
          timeMs: Math.round(t),
          f0Hz: Math.round(hz + microGliss),
          mora: m.mora,
          apIndex: ap.phraseIndex
        });
      }
    }
  }

  return points;
}

export class SentenceProsodyService {
  /**
   * Retrieves all preset sentence models.
   */
  public static getPresetSentences(): SentenceProsodyModel[] {
    return PRESET_SENTENCES;
  }

  /**
   * Retrieves a preset sentence by ID.
   */
  public static getSentenceById(id: string): SentenceProsodyModel | undefined {
    return PRESET_SENTENCES.find((s) => s.id === id);
  }

  /**
   * Parses and constructs a sentence-level Tokyo prosody model.
   * If sentenceText matches a preset, returns the golden model.
   * Otherwise, dynamically synthesizes AP boundaries, downstep propagation, and declination reset.
   */
  public static analyzeSentenceProsody(input: SentenceProsodyAnalysisInput): SentenceProsodyModel {
    const text = input.sentenceText.trim();

    // Check if preset exists
    const match = PRESET_SENTENCES.find(
      (s) => s.sentenceText === text || s.id === text || s.readingKana === text
    );
    if (match) {
      return match;
    }

    const isQuestion =
      text.includes('？') ||
      text.includes('?') ||
      text.endsWith('か') ||
      text.endsWith('の') ||
      text.endsWith('ですか') ||
      text.endsWith('ますか') ||
      text.endsWith('でしょうか');

    // Parse into rough accentual phrase chunks based on particles and punctuation
    const rawChunks = text
      .split(/([、,。！？!?\s]+)/)
      .filter((c) => c.trim().length > 0 && !/^[、,。！？!?\s]+$/.test(c));

    const accentualPhrases: AccentualPhrase[] = [];
    let currentGlobalTimeMs = 0;
    const basePhraseF0s = [240, 222, 210, 200, 192]; // Declination line recovery baselines

    let phraseIndex = 1;
    for (let i = 0; i < rawChunks.length; i++) {
      const chunk = rawChunks[i];
      const morae = PhrasalAccentService.decomposeMorae(chunk);
      if (morae.length === 0) continue;

      const apBaseF0 = basePhraseF0s[Math.min(phraseIndex - 1, basePhraseF0s.length - 1)];
      const isLastChunk = i === rawChunks.length - 1;
      const bpm: 'flat' | 'fall' | 'rise' = isLastChunk && isQuestion ? 'rise' : isLastChunk ? 'fall' : 'flat';

      // Default heuristic pattern: 2nd mora rise (Heiban / standard accent phrase)
      const pattern: PitchAccentPattern = morae.length > 3 ? 'heiban' : 'heiban';
      const downstepMora = 0;
      const targetPitches: ('H' | 'L')[] = morae.map((_, idx) => (idx === 0 ? 'L' : 'H'));
      if (bpm === 'rise') {
        targetPitches[targetPitches.length - 1] = 'H';
      }

      const moraTimingsMs: MoraTimingPoint[] = [];
      for (let mIdx = 0; mIdx < morae.length; mIdx++) {
        const mora = morae[mIdx];
        const moraDur = mora === 'っ' ? 170 : 200;
        const startMs = currentGlobalTimeMs;
        const endMs = startMs + moraDur;
        currentGlobalTimeMs = endMs;

        let expectedHz = targetPitches[mIdx] === 'H' ? apBaseF0 - mIdx * 1.5 : 175;
        if (isLastChunk && isQuestion && mIdx === morae.length - 1) {
          expectedHz = 275; // Boundary Pitch Movement Question Rise
        }

        moraTimingsMs.push({
          mora,
          startMs,
          endMs,
          expectedHz: Math.round(expectedHz),
          targetPitch: targetPitches[mIdx]
        });
      }

      // Add inter-phrase breath pause
      const hasPause = i < rawChunks.length - 1;
      const pauseDurationMs = hasPause ? 120 : 0;
      currentGlobalTimeMs += pauseDurationMs;

      accentualPhrases.push({
        id: `ap-dyn-${phraseIndex}`,
        phraseIndex,
        text: chunk,
        readingKana: chunk,
        romaji: chunk,
        morae,
        pattern,
        downstepMora,
        targetPitches,
        boundaryPitchMovement: bpm,
        hasPauseAfter: hasPause,
        pauseDurationMs,
        baseF0Hz: apBaseF0,
        moraTimingsMs
      });

      phraseIndex++;
    }

    const targetF0Contour = generateContinuousContour(accentualPhrases);

    return {
      id: `sent-dyn-${Date.now().toString(36)}`,
      sentenceText: text,
      readingKana: input.readingKana || text,
      romaji: input.sentenceText,
      meaningEn: input.meaningEn || 'Japanese Sentence Shadowing Exercise',
      meaningBn: input.meaningBn || 'জাপানি বাক্যাংশ শ্যাডোয়িং অনুশীলন',
      jlptLevel: input.jlptLevel || 'N5',
      category: input.category || 'daily',
      isQuestion,
      accentualPhrases,
      targetF0Contour,
      totalDurationMs: currentGlobalTimeMs,
      tempoMultiplier: 1.0
    };
  }

  /**
   * Dynamic Time Warping (DTW) algorithm for aligning non-linearly timed speech pitch contours.
   * Accommodates slight lags, pacing deviations, and vocal register differences.
   */
  public static computeDTW(
    userF0: number[],
    refF0: number[]
  ): { distance: number; normalizedScore: number; userNormalizedF0: number[] } {
    if (!userF0 || userF0.length === 0 || !refF0 || refF0.length === 0) {
      return { distance: 999, normalizedScore: 0, userNormalizedF0: [] };
    }

    // Filter non-voiced noise and clamp to valid human fundamental frequency
    const validUserF0 = userF0.filter((f) => f >= 75 && f <= 500);
    if (validUserF0.length < 5) {
      return { distance: 999, normalizedScore: 10, userNormalizedF0: [] };
    }

    // Compute medians to normalize male vs. female pitch baseline
    const sortedUser = [...validUserF0].sort((a, b) => a - b);
    const sortedRef = [...refF0].sort((a, b) => a - b);
    const userMedian = sortedUser[Math.floor(sortedUser.length / 2)] || 200;
    const refMedian = sortedRef[Math.floor(sortedRef.length / 2)] || 220;
    const f0Shift = refMedian - userMedian;

    // Shift user F0 so contour shape is judged rather than natural vocal pitch range
    const userNormalized = validUserF0.map((f) => f + f0Shift);

    // Subsample arrays if too long to maintain optimal O(N*M) compute speed
    const maxLen = 120;
    const sUser = subsample(userNormalized, maxLen);
    const sRef = subsample(refF0, maxLen);

    const N = sUser.length;
    const M = sRef.length;

    // Cost matrix initialization
    const D: number[][] = Array.from({ length: N + 1 }, () =>
      new Array(M + 1).fill(Infinity)
    );
    D[0][0] = 0;

    for (let i = 1; i <= N; i++) {
      for (let j = 1; j <= M; j++) {
        const cost = Math.abs(sUser[i - 1] - sRef[j - 1]);
        D[i][j] = cost + Math.min(D[i - 1][j], D[i][j - 1], D[i - 1][j - 1]);
      }
    }

    // Evaluate pitch dynamic variance (detect unnatural monotone flatline)
    const variance =
      validUserF0.reduce((acc, val) => acc + Math.pow(val - userMedian, 2), 0) /
      validUserF0.length;
    const stdDev = Math.sqrt(variance);
    let dynamicPenalty = 0;
    if (stdDev < 8) {
      dynamicPenalty = Math.round((8 - stdDev) * 6);
    }

    const rawDistance = D[N][M];
    const avgMoraDistance = rawDistance / (N + M);

    // Map average distance (Hz error per sample) to 0-100 score
    // 0 Hz diff = 100%, 15 Hz diff = 85%, 35 Hz diff = 60%, 65+ Hz diff = 20%
    const normalizedScore = Math.max(
      0,
      Math.min(100, Math.round(100 - avgMoraDistance * 1.6 - dynamicPenalty))
    );

    return {
      distance: Math.round(rawDistance),
      normalizedScore,
      userNormalizedF0: userNormalized
    };
  }

  /**
   * Evaluates continuous sentence shadowing attempt:
   * 1. Dynamic Time Warping (DTW) F0 pitch contour scoring
   * 2. Intonation Phrase (AP) Boundary reset detection (checking if learner reset pitch or flatlined)
   * 3. Question intonation rise verification (BPM)
   * 4. Bengali phonetic stress interference analysis
   */
  public static evaluateShadowing(
    arg1: string | ShadowingSubmission,
    arg2?: ShadowingSubmission | SentenceProsodyModel,
    arg3?: SentenceProsodyModel
  ): ShadowingEvaluationResult {
    let studentId = 'guest';
    let submission: ShadowingSubmission;
    let prosodyModel: SentenceProsodyModel;

    if (typeof arg1 === 'string') {
      studentId = arg1;
      submission = arg2 as ShadowingSubmission;
      prosodyModel =
        (arg3 as SentenceProsodyModel) ||
        this.analyzeSentenceProsody({ sentenceText: submission.sentenceText });
    } else {
      submission = arg1;
      if (arg2 && 'accentualPhrases' in (arg2 as any)) {
        prosodyModel = arg2 as SentenceProsodyModel;
      } else {
        prosodyModel = this.analyzeSentenceProsody({ sentenceText: submission.sentenceText });
      }
    }

    const evaluationId = `shadow-eval-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    // 1. DTW Pitch Matching Score
    const targetHzContour = prosodyModel.targetF0Contour.map((p) => p.f0Hz);
    const dtwResult = this.computeDTW(submission.userF0Trajectory, targetHzContour);
    const pitchContourScore = dtwResult.normalizedScore;

    // 2. Rhythm & Isochrony Score
    const expectedDuration = prosodyModel.totalDurationMs;
    const actualDuration = submission.audioDurationMs;
    const durationRatio = actualDuration / Math.max(1, expectedDuration);
    let rhythmIsochronyScore = 100;
    if (durationRatio < 0.65 || durationRatio > 1.45) {
      rhythmIsochronyScore = Math.max(40, Math.round(100 - Math.abs(1.0 - durationRatio) * 110));
    } else {
      rhythmIsochronyScore = Math.max(70, Math.round(100 - Math.abs(1.0 - durationRatio) * 45));
    }

    // 3. Accentual Phrase (AP) Boundary Reset Detection
    const detectedApResets: ShadowingApResetEvaluation[] = [];
    const apList = prosodyModel.accentualPhrases;
    let boundaryResetPointsPassed = 0;
    let totalBoundariesToTest = 0;

    const userTraj = dtwResult.userNormalizedF0;

    for (let apIdx = 1; apIdx < apList.length; apIdx++) {
      totalBoundariesToTest++;
      const prevAp = apList[apIdx - 1];
      const currentAp = apList[apIdx];

      // Approximate index in user array corresponding to boundary
      const boundaryRatio = currentAp.moraTimingsMs[0].startMs / prosodyModel.totalDurationMs;
      const userSampleIndex = Math.min(
        userTraj.length - 1,
        Math.max(0, Math.round(boundaryRatio * userTraj.length))
      );

      const windowStart = Math.max(0, userSampleIndex - 5);
      const windowEnd = Math.min(userTraj.length, userSampleIndex + 10);
      const prevSlice = userTraj.slice(windowStart, userSampleIndex);
      const newApSlice = userTraj.slice(userSampleIndex, windowEnd);

      const prevValley = prevSlice.length > 0 ? prevSlice[prevSlice.length - 1] : 180;
      const newPeak = newApSlice.length > 0 ? Math.max(...newApSlice) : 180;
      const deltaF0 = newPeak - prevValley;

      // In Tokyo prosody, a new AP recovers pitch back to high tone with genuine upward step
      const detectedReset = deltaF0 >= 8 && newPeak >= 195;
      if (detectedReset) {
        boundaryResetPointsPassed++;
      }

      detectedApResets.push({
        apIndex: currentAp.phraseIndex,
        expectedReset: true,
        detectedReset,
        deltaF0: Math.round(deltaF0),
        feedbackBn: detectedReset
          ? `বাক্যাংশ ${currentAp.phraseIndex} ("${currentAp.text}") এ সুরের স্বাভাবিক পুনরুদ্ধার (AP Reset) সঠিকভাবে সম্পন্ন হয়েছে।`
          : `বাক্যাংশ ${currentAp.phraseIndex} ("${currentAp.text}") এ সুরের ড্রপ রিকভারি হয়নি; আগের ড্রপের কারণে সুর সমতল রয়ে গেছে (Catathesis Flatline)।`
      });
    }

    const boundaryResetAccuracyScore =
      totalBoundariesToTest > 0
        ? Math.round((boundaryResetPointsPassed / totalBoundariesToTest) * 100)
        : 90;

    // 4. Question Intonation Verification
    let questionIntonationScore: number | undefined;
    if (prosodyModel.isQuestion && userTraj.length > 5) {
      const endSlice = userTraj.slice(-5);
      const startEndSlice = endSlice[0];
      const finalEndSlice = endSlice[endSlice.length - 1];
      const endJump = finalEndSlice - startEndSlice;

      if (endJump >= 18) {
        questionIntonationScore = 95;
      } else if (endJump >= 5) {
        questionIntonationScore = 75;
      } else {
        questionIntonationScore = 40;
      }
    }

    // 5. Bengali Phonetic Diagnostic Detection
    const bengaliPhoneticIssues: string[] = [];
    const coachingTipsBn: string[] = [];

    if (boundaryResetAccuracyScore < 60) {
      bengaliPhoneticIssues.push('INSUFFICIENT_AP_DECLINATION_RESET');
      coachingTipsBn.push(
        'নতুন শব্দগুচ্ছ (Accentual Phrase) শুরু করার সময় সুর আবার উপরে তুলুন (টোকিও ডেক্লিনেশন রিসেট)। একটানা ফ্ল্যাট রাখবেন না।'
      );
    }

    if (prosodyModel.isQuestion && questionIntonationScore !== undefined && questionIntonationScore < 65) {
      bengaliPhoneticIssues.push('QUESTION_BPM_RISE_MISSING');
      coachingTipsBn.push(
        'প্রশ্নবোধক বাক্যের শেষের মোরাটিতে (যেমন: "か？") সুর দ্রুত ও স্পষ্ট উপরে তুলুন (+40Hz Boundary Pitch Movement)।'
      );
    }

    if (pitchContourScore < 70) {
      bengaliPhoneticIssues.push('DYNAMIC_STRESS_CORRUPTION');
      coachingTipsBn.push(
        'বাংলা ভাষার সহজাত জোর (Stress) প্রয়োগ করবেন না; জোরের বদলে সুরের স্কেলের ওঠানামা দিয়ে অ্যাকসেন্ট ফুটিয়ে তুলুন।'
      );
    }

    if (rhythmIsochronyScore < 65) {
      bengaliPhoneticIssues.push('MORA_TIMING_DISSONANCE');
      coachingTipsBn.push(
        'প্রতিটি মোরার দৈর্ঘ্য সমান রাখার চেষ্টা করুন (মোরার সমকালীন ছন্দ / Isochrony বজায় রাখুন)।'
      );
    }

    // Calculate Overall Weighted Score
    let overallScore = 0;
    if (prosodyModel.isQuestion && questionIntonationScore !== undefined) {
      overallScore = Math.round(
        pitchContourScore * 0.45 +
          boundaryResetAccuracyScore * 0.25 +
          rhythmIsochronyScore * 0.15 +
          questionIntonationScore * 0.15
      );
    } else {
      overallScore = Math.round(
        pitchContourScore * 0.5 +
          boundaryResetAccuracyScore * 0.3 +
          rhythmIsochronyScore * 0.2
      );
    }

    const isPassed = overallScore >= 70;

    const feedbackEn = isPassed
      ? 'Sentence prosody matched authentic Tokyo intonation declination and phrase boundary resets.'
      : 'Sentence intonation showed unnatural flatlining or stress placement across phrase boundaries.';

    const feedbackBn = isPassed
      ? 'টোকিও স্ট্যান্ডার্ড বাক্যাংশের সুর, মোরা ছন্দ ও বাউন্ডারি রিসেট সফলভাবে প্রতিফলিত হয়েছে!'
      : 'বাক্যাংশের সংযোগস্থলে সুরের স্বাভাবিক রূপান্তর ও অ্যাকসেন্টুয়াল ফ্রেজ রিসেট আরও অনুশীলন প্রয়োজন।';

    return {
      evaluationId,
      sentenceId: prosodyModel.id,
      studentId,
      overallScore,
      pitchContourScore,
      rhythmIsochronyScore,
      boundaryResetAccuracyScore,
      questionIntonationScore,
      dtwDistance: dtwResult.distance,
      isPassed,
      detectedApResets,
      bengaliPhoneticIssues,
      feedbackEn,
      feedbackBn,
      coachingTipsBn,
      evaluatedAt: new Date().toISOString()
    };
  }
}

function subsample(arr: number[], targetLen: number): number[] {
  if (arr.length <= targetLen) return arr;
  const result: number[] = [];
  const step = (arr.length - 1) / (targetLen - 1);
  for (let i = 0; i < targetLen; i++) {
    result.push(arr[Math.round(i * step)]);
  }
  return result;
}
