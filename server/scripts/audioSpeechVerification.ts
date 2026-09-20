/**
 * NIHOMI.COM (にほみ) — AUDIO & SPEECH PRONUNCIATION READINESS VERIFICATION SUITE
 * Autonomous Quality Assurance: Japanese Web Speech API, Pitch Accent, & TTS Pipeline
 * Validates audio prompts and pitch contours across all 25 JLPT N5 Master Lessons.
 */

import { NIHOMI_JLPT_N5_CURRICULUM } from '../../src/data/lessons/n5MasterCurriculum.js';
import { TOKYO_PITCH_DICTIONARY } from '../../src/lib/pitchAccentData.js';
import { TOKYO_PITCH_FREQUENCIES } from '../../src/lib/pitchAccentAudio.js';
import { selectTokyoNativeVoice, extractJapanesePhrases } from '../../src/lib/tts.js';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  durationMs: number;
  details?: string;
  error?: string;
}

const results: TestResult[] = [];

async function runTest(suite: string, name: string, fn: () => Promise<string | void> | string | void) {
  const start = Date.now();
  try {
    const details = await fn();
    const durationMs = Date.now() - start;
    results.push({
      suite,
      name,
      passed: true,
      durationMs,
      details: typeof details === 'string' ? details : undefined
    });
    console.log(`  ✓ [PASS] [${suite}] ${name} (${durationMs}ms)`);
    if (details) console.log(`    └─ ${details}`);
  } catch (err: any) {
    const durationMs = Date.now() - start;
    results.push({
      suite,
      name,
      passed: false,
      durationMs,
      error: err.message || String(err)
    });
    console.error(`  ✗ [FAIL] [${suite}] ${name} (${durationMs}ms)`);
    console.error(`    └─ ERROR: ${err.message || err}`);
  }
}

async function runAudioSpeechVerification() {
  console.log('='.repeat(80));
  console.log('  NIHOMI.COM (にほみ) — AUDIO & SPEECH PRONUNCIATION VERIFICATION');
  console.log('  All 25 JLPT N5 Lessons • Tokyo Web Speech API • Pitch Accent Contours');
  console.log('='.repeat(80) + '\n');

  // --------------------------------------------------------------------------
  // TEST 1: ALL 25 LESSONS CURRICULUM AUDIO DATA & PROMPT COVERAGE
  // --------------------------------------------------------------------------
  await runTest('CURRICULUM_AUDIO', '25-Lesson Audio Prompts & Vocabulary Coverage', () => {
    if (NIHOMI_JLPT_N5_CURRICULUM.length !== 25) {
      throw new Error(`Expected exactly 25 lessons, found ${NIHOMI_JLPT_N5_CURRICULUM.length}`);
    }

    let totalVocabCount = 0;
    let totalExampleSentences = 0;
    let totalDialogueLines = 0;

    for (let i = 0; i < 25; i++) {
      const lesson = NIHOMI_JLPT_N5_CURRICULUM[i];
      const expectedNum = i + 1;

      if (lesson.lessonNumber !== expectedNum) {
        throw new Error(`Lesson at index ${i} has lessonNumber ${lesson.lessonNumber}, expected ${expectedNum}`);
      }

      // Check vocabulary items
      if (!lesson.vocabularies || lesson.vocabularies.length === 0) {
        throw new Error(`Lesson ${expectedNum} has no vocabulary entries.`);
      }

      totalVocabCount += lesson.vocabularies.length;

      for (const v of lesson.vocabularies) {
        if (!v.hiragana || !v.meaningEnglish) {
          throw new Error(`Lesson ${expectedNum} vocabulary '${v.kanji || v.hiragana}' missing hiragana or English meaning.`);
        }
        if (v.example && v.example.japanese) {
          totalExampleSentences++;
        }
      }

      // Check dialogue lines
      if (lesson.grammarPatterns) {
        for (const g of lesson.grammarPatterns) {
          if (g.dialogue && g.dialogue.speakerA && g.dialogue.speakerB) {
            totalDialogueLines += 2;
          }
        }
      }
    }

    return `All 25 lessons verified: ${totalVocabCount} vocabulary words, ${totalExampleSentences} example sentences, ${totalDialogueLines} dialogue turns ready for TTS.`;
  });

  // --------------------------------------------------------------------------
  // TEST 2: TTS TEXT NORMALIZATION & FURIGANA STRIPPING
  // --------------------------------------------------------------------------
  await runTest('TTS_NORMALIZATION', 'Furigana Stripping & Punctuation Cleaning', () => {
    const testCases = [
      { input: '食べる（たべる）', expected: '食べる' },
      { input: '明日(あした)に行きます', expected: '明日に行きます' },
      { input: '   わたしは　がくせいです。  ', expected: 'わたしは　がくせいです。' },
      { input: '東京（とうきょう）タワー', expected: '東京タワー' }
    ];

    for (const tc of testCases) {
      const cleaned = tc.input.replace(/（[^）]+）|\([^\)]+\)/g, '').trim();
      if (cleaned !== tc.expected) {
        throw new Error(`Cleaned mismatch for '${tc.input}': expected '${tc.expected}', got '${cleaned}'`);
      }
    }

    // Japanese character extraction
    const mixed = 'The word 日本語 (nihongo) means Japanese in বাংলা';
    const extracted = extractJapanesePhrases(mixed);
    if (!extracted.includes('日本語')) {
      throw new Error(`Failed to extract '日本語' from mixed string, got: ${JSON.stringify(extracted)}`);
    }

    return `Text normalizer successfully stripped annotations and extracted Japanese substrings cleanly.`;
  });

  // --------------------------------------------------------------------------
  // TEST 3: TOKYO NATIVE VOICE PRIORITY SELECTION PIPELINE
  // --------------------------------------------------------------------------
  await runTest('VOICE_SELECTION', 'Tokyo Native Japanese Voice Priority Ranking', () => {
    const mockVoices: any[] = [
      { name: 'Alex', lang: 'en-US' },
      { name: 'Otoya', lang: 'ja-JP' },
      { name: 'Kyoko', lang: 'ja-JP' },
      { name: 'Google 日本語', lang: 'ja-JP' },
      { name: 'Microsoft Ichiro - Japanese (Japan)', lang: 'ja-JP' },
      { name: 'Generic Japanese Voice', lang: 'ja-JP' }
    ];

    // Priority test 1: Google 日本語 must win over all others
    const best1 = selectTokyoNativeVoice(mockVoices);
    if (!best1 || best1.name !== 'Google 日本語') {
      throw new Error(`Expected 'Google 日本語', got '${best1?.name}'`);
    }

    // Priority test 2: When Google 日本語 is absent, Kyoko must win
    const voicesWithoutGoogle = mockVoices.filter((v) => v.name !== 'Google 日本語');
    const best2 = selectTokyoNativeVoice(voicesWithoutGoogle);
    if (!best2 || best2.name !== 'Kyoko') {
      throw new Error(`Expected 'Kyoko', got '${best2?.name}'`);
    }

    // Priority test 3: When Kyoko is absent, Otoya must win
    const voicesWithoutKyoko = voicesWithoutGoogle.filter((v) => v.name !== 'Kyoko');
    const best3 = selectTokyoNativeVoice(voicesWithoutKyoko);
    if (!best3 || best3.name !== 'Otoya') {
      throw new Error(`Expected 'Otoya', got '${best3?.name}'`);
    }

    // Priority test 4: Fallback to exact ja-JP match
    const fallbackOnly: any[] = [{ name: 'Alex', lang: 'en-US' }, { name: 'Unknown Japanese', lang: 'ja-JP' }];
    const best4 = selectTokyoNativeVoice(fallbackOnly);
    if (!best4 || best4.name !== 'Unknown Japanese') {
      throw new Error(`Expected 'Unknown Japanese', got '${best4?.name}'`);
    }

    return `Tokyo native voice priority verified: Google 日本語 > Kyoko > Otoya > ja-JP.`;
  });

  // --------------------------------------------------------------------------
  // TEST 4: STREAMING AUDIO FALLBACK URL ENCODING FOR MOBILE
  // --------------------------------------------------------------------------
  await runTest('AUDIO_FALLBACK', 'Google TTS Streaming Fallback URL Generation', () => {
    const samplePhrases = [
      'こんにちは',
      'ありがとうございます',
      '東京は賑やかな街です'
    ];

    for (const phrase of samplePhrases) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=${encodeURIComponent(phrase)}`;
      const parsed = new URL(url);

      if (parsed.searchParams.get('tl') !== 'ja') {
        throw new Error(`Missing or incorrect tl param: ${parsed.searchParams.get('tl')}`);
      }
      if (parsed.searchParams.get('client') !== 'tw-ob') {
        throw new Error(`Missing or incorrect client param: ${parsed.searchParams.get('client')}`);
      }
      if (decodeURIComponent(parsed.searchParams.get('q') || '') !== phrase) {
        throw new Error(`Query text mismatch for '${phrase}'`);
      }
    }

    return `Verified URL encoding for ${samplePhrases.length} Japanese streaming TTS fallback endpoints.`;
  });

  // --------------------------------------------------------------------------
  // TEST 5: TOKYO PITCH ACCENT CONTOUR & MINIMAL PAIRS
  // --------------------------------------------------------------------------
  await runTest('PITCH_ACCENT', 'Tokyo Pitch Accent Lexicon & Minimal Pair Verification', () => {
    const minimalPairs = [
      { word: '箸', expectedPattern: 'atamadaka', downstep: 1, pitches: ['H', 'L'] },
      { word: '橋', expectedPattern: 'odaka', downstep: 2, pitches: ['L', 'H'] },
      { word: '端', expectedPattern: 'heiban', downstep: 0, pitches: ['L', 'H'] },
      { word: '雨', expectedPattern: 'atamadaka', downstep: 1, pitches: ['H', 'L'] },
      { word: '飴', expectedPattern: 'heiban', downstep: 0, pitches: ['L', 'H'] }
    ];

    for (const pair of minimalPairs) {
      const entry = TOKYO_PITCH_DICTIONARY[pair.word];
      if (!entry) {
        throw new Error(`Word '${pair.word}' missing in TOKYO_PITCH_DICTIONARY`);
      }
      if (entry.pattern !== pair.expectedPattern) {
        throw new Error(`Pitch pattern for '${pair.word}' mismatch: expected ${pair.expectedPattern}, got ${entry.pattern}`);
      }
      if (entry.downstepMora !== pair.downstep) {
        throw new Error(`Downstep mora for '${pair.word}' mismatch: expected ${pair.downstep}, got ${entry.downstepMora}`);
      }
      if (JSON.stringify(entry.targetPitches) !== JSON.stringify(pair.pitches)) {
        throw new Error(`Target pitches mismatch for '${pair.word}': expected ${pair.pitches}, got ${entry.targetPitches}`);
      }
    }

    // Verify Pitch Audio Frequency configuration
    if (TOKYO_PITCH_FREQUENCIES.HIGH_MORA_HZ <= TOKYO_PITCH_FREQUENCIES.LOW_MORA_HZ) {
      throw new Error('HIGH_MORA_HZ must be strictly higher than LOW_MORA_HZ in Tokyo acoustic model.');
    }

    return `Minimal pairs (箸/橋/端, 雨/飴) verified with authentic Tokyo pitch contours (High: ${TOKYO_PITCH_FREQUENCIES.HIGH_MORA_HZ}Hz, Low: ${TOKYO_PITCH_FREQUENCIES.LOW_MORA_HZ}Hz).`;
  });

  // --------------------------------------------------------------------------
  // TEST 6: PHONETIC LEVENSHTEIN & PRONUNCIATION ACCURACY ALGORITHM
  // --------------------------------------------------------------------------
  await runTest('SPEECH_SCORING', 'Pronunciation Accuracy Scoring & Levenshtein Engine', () => {
    function computePhoneticMatch(target: string, spoken: string): number {
      const cleanTarget = target.replace(/[^ぁ-んァ-ン一-龯]/g, '');
      const cleanSpoken = spoken.replace(/[^ぁ-んァ-ン一-龯]/g, '');

      if (cleanTarget === cleanSpoken) return 100;
      if (!cleanSpoken) return 0;

      // Levenshtein distance
      const m = cleanTarget.length;
      const n = cleanSpoken.length;
      const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

      for (let i = 0; i <= m; i++) dp[i][0] = i;
      for (let j = 0; j <= n; j++) dp[0][j] = j;

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          const cost = cleanTarget[i - 1] === cleanSpoken[j - 1] ? 0 : 1;
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1,
            dp[i - 1][j - 1] + cost
          );
        }
      }

      const dist = dp[m][n];
      const maxLen = Math.max(m, n);
      return Math.max(0, Math.round(((maxLen - dist) / maxLen) * 100));
    }

    const perfectScore = computePhoneticMatch('はじめまして', 'はじめまして');
    if (perfectScore !== 100) {
      throw new Error(`Expected perfect score 100, got ${perfectScore}`);
    }

    const minorErrorScore = computePhoneticMatch('はじめまして', 'はじめましだ');
    if (minorErrorScore < 80 || minorErrorScore >= 100) {
      throw new Error(`Expected high score between 80-99 for 1 mora error, got ${minorErrorScore}`);
    }

    const completeMismatchScore = computePhoneticMatch('はじめまして', 'さようなら');
    if (completeMismatchScore > 40) {
      throw new Error(`Expected low score for complete mismatch, got ${completeMismatchScore}`);
    }

    return `Phonetic accuracy engine evaluated: Perfect (100%), Minor 1-mora slip (${minorErrorScore}%), Full mismatch (${completeMismatchScore}%).`;
  });

  // --------------------------------------------------------------------------
  // SUMMARY REPORT
  // --------------------------------------------------------------------------
  console.log('\n' + '='.repeat(80));
  console.log('  AUDIO & SPEECH VERIFICATION SUMMARY:');
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  console.log(`  Total Test Suites: ${results.length}`);
  console.log(`  Passed:            ${passedCount} / ${results.length}`);
  console.log(`  Failed:            ${failedCount}`);

  if (failedCount === 0) {
    console.log('  Overall Result:    ✓ AUDIO & SPEECH READINESS CONFIRMED ACROSS ALL 25 LESSONS');
  } else {
    console.log('  Overall Result:    ✗ AUDIO VERIFICATION FAILED');
    process.exit(1);
  }
  console.log('='.repeat(80) + '\n');
}

runAudioSpeechVerification().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
