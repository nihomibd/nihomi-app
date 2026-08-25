import {
  KnowledgeObject,
  GrammarObject,
  VocabularyObject,
  KanjiObject,
  KnowledgeObjectVersionSnapshot,
  ContentLifecycleStage,
  PublicationStatus
} from './types';
import { NihomiStandardService } from './nihomiStandardService';

const SEED_KNOWLEDGE_OBJECTS: KnowledgeObject[] = [
  {
    id: 'ko-n5-gr-001',
    code: 'N5-GR-001',
    type: 'GRAMMAR',
    level: 'N5',
    domain: 'GRAMMAR',
    lifecycleStage: 'PUBLISHED',
    status: 'PUBLISHED',
    version: 2,
    sourceTraceability: {
      sourceDocumentId: 'doc-mnh-shokyu1',
      sourceDocumentTitle: 'Minna no Nihongo Shokyu I (2nd Edition)',
      sourceAuthor: '3A Corporation',
      sourcePublisher: '3A Corporation Tokyo',
      sourceEdition: '2nd Edition',
      sourcePage: 12,
      sourceSection: 'Lesson 1 Grammar Note 1',
      sourceTextSnippet: '【文型 1】 N1 は N2 です。(N1 wa N2 desu.)',
      sourceHash: 'sha256-48c909e46a782b535d88f6a91176b6ef902e88a31e847c2',
      extractionTimestamp: '2026-08-20T10:00:00.000Z',
      processingVersion: 'v2.4.0',
      copyrightLicense: 'ACADEMIC_FAIR_USE'
    },
    qualityEvaluation: {
      evaluatedAt: '2026-08-20T10:05:00.000Z',
      overallScore: 98,
      passed: true,
      requiresHumanReview: false,
      dimensions: {
        accuracy: 99,
        sourceTraceability: 98,
        japaneseLinguisticCorrectness: 100,
        jlptRelevance: 100,
        vocabularyCorrectness: 98,
        kanjiCorrectness: 98,
        grammarCorrectness: 100,
        furiganaCorrectness: 98,
        pronunciationCorrectness: 98,
        banglaTranslationQuality: 98,
        englishTranslationQuality: 98,
        japaneseExplanationQuality: 97,
        contextualAccuracy: 98,
        difficultyLevelCalibration: 98,
        duplicateDetection: 100,
        contentCompleteness: 98,
        learningUsefulness: 100,
        pedagogicalQuality: 98,
        formattingQuality: 98,
        brandingConsistency: 100,
        safetyContentCheck: 100,
        versionIntegrity: 100,
        humanReviewState: 100
      },
      violations: [],
      reviewNotes: 'Pristine: Passed 23-Dimension NIHOMI STANDARD™ automated evaluation.'
    },
    versionHistory: [
      {
        version: 1,
        timestamp: '2026-08-20T10:00:00.000Z',
        author: 'system_ingestion_pipeline',
        summary: 'Initial raw extraction from Minna no Nihongo Lesson 1 PDF.',
        dataSnapshot: {
          code: 'N5-GR-001',
          type: 'GRAMMAR',
          level: 'N5',
          status: 'DRAFT',
          lifecycleStage: 'EXTRACTING',
          patternOrWord: 'N1 は N2 です',
          formulaOrReading: 'N1 + は + N2 + です',
          trilingual: {
            ja: { text: 'N1 は N2 です', furigana: 'N1 は N2 です', romaji: 'N1 wa N2 desu' },
            en: { meaning: 'N1 is N2', explanationEn: 'Basic copula sentence.' },
            bn: { meaning: 'N1 হলো N2', explanationBn: 'সাধারণ বাক্য।' }
          },
          qualityScore: 84
        }
      },
      {
        version: 2,
        timestamp: '2026-08-24T12:00:00.000Z',
        author: 'mdtanvirkabirbiplob@gmail.com',
        summary: 'Enhanced Bengali cultural context and Tokyo conversational exemplar sentences.',
        dataSnapshot: {
          code: 'N5-GR-001',
          type: 'GRAMMAR',
          level: 'N5',
          status: 'PUBLISHED',
          lifecycleStage: 'PUBLISHED',
          patternOrWord: 'N1 は N2 です',
          formulaOrReading: '[Noun 1] + は (Topic Marker) + [Noun 2] + です (Copula)',
          trilingual: {
            ja: { text: 'N1 は N2 です', furigana: 'N1 は N2 です', romaji: 'N1 wa N2 desu', explanationJa: '「は」は主題を表す助詞で、「です」は丁寧な断定を表します。' },
            en: { meaning: 'N1 is N2 (Topic marker "wa" with polite copula "desu")', explanationEn: 'The particle は indicates the topic of the sentence.' },
            bn: { meaning: 'N1 হলো N2 (বিষয় নির্দেশক は এবং মার্জিত সমাপ্তি です)', explanationBn: 'হলো বা হয় অর্থে বাক্যের মূল বিষয় নির্দেশ করতে は কণা ব্যবহৃত হয়।' }
          },
          qualityScore: 98
        }
      }
    ],
    prerequisites: [],
    tags: ['Topic Marker', 'Minna Lesson 1', 'Basic Sentence Structure', 'Desu'],
    createdBy: 'system_ingestion_pipeline',
    updatedBy: 'mdtanvirkabirbiplob@gmail.com',
    approvedBy: 'mdtanvirkabirbiplob@gmail.com',
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-08-25T08:00:00.000Z',
    approvedAt: '2026-08-20T10:05:00.000Z',
    pattern: 'N1 は N2 です',
    formula: '[Noun 1] + は (Topic Marker) + [Noun 2] + です (Copula)',
    trilingual: {
      ja: {
        text: 'N1 は N2 です',
        furigana: 'N1 は N2 です',
        romaji: 'N1 wa N2 desu',
        explanationJa: '「は」は主題を表す助詞で、「です」は丁寧な断定を表します。'
      },
      en: {
        meaning: 'N1 is N2 (Topic marker "wa" with polite copula "desu")',
        explanationEn: 'The particle は indicates the topic of the sentence. です indicates a polite affirmative judgment.'
      },
      bn: {
        meaning: 'N1 হলো N2 (বিষয় নির্দেশক は এবং মার্জিত সমাপ্তি です)',
        explanationBn: 'হলো বা হয় অর্থে বাক্যের মূল বিষয় নির্দেশ করতে は (উচ্চারণ "ওয়া") কণা ব্যবহৃত হয় এবং বাক্য মার্জিতভাবে সমাপ্ত করতে です ব্যবহৃত হয়।'
      }
    },
    exampleSentences: [
      {
        ja: 'わたしは がくせいです。',
        furigana: 'わたしは [学生|がくせい]です。',
        romaji: 'Watashi wa gakusei desu.',
        en: 'I am a student.',
        bn: 'আমি একজন ছাত্র।'
      },
      {
        ja: 'サントスさんは ブラジルじんです。',
        furigana: 'サントスさんは ブラジル[人|じん]です。',
        romaji: 'Santos-san wa Burajiru-jin desu.',
        en: 'Mr. Santos is Brazilian.',
        bn: 'জনাব সান্তোস ব্রাজিলিয়ান।'
      }
    ],
    commonMistakes: [
      {
        incorrect: 'わたし が がくせいです。(when introducing oneself normally)',
        correct: 'わたし は がくせいです。',
        reasonBn: 'সাধারণ আত্মপরিচয় দিতে topic নির্দেশক হিসেবে は ব্যবহার করতে হয়, が নয়।'
      }
    ]
  } as GrammarObject,
  {
    id: 'ko-n5-gr-review-003',
    code: 'N5-GR-003',
    type: 'GRAMMAR',
    level: 'N5',
    domain: 'GRAMMAR',
    lifecycleStage: 'HUMAN_REVIEW_REQUIRED',
    status: 'IN_REVIEW',
    version: 1,
    sourceTraceability: {
      sourceDocumentId: 'doc-mnh-shokyu1',
      sourceDocumentTitle: 'Minna no Nihongo Shokyu I (2nd Edition)',
      sourceAuthor: '3A Corporation',
      sourcePage: 48,
      sourceSection: 'Lesson 5 Grammar Note 2 (Particle で)',
      sourceTextSnippet: '【文型 5】 で (Means / Transportation / Tool): 電車で 行きます。',
      sourceHash: 'sha256-part-de-transp-00599a',
      extractionTimestamp: '2026-08-25T01:10:00.000Z',
      processingVersion: 'v2.4.0',
      copyrightLicense: 'ACADEMIC_FAIR_USE'
    },
    qualityEvaluation: {
      evaluatedAt: '2026-08-25T01:15:00.000Z',
      overallScore: 82,
      passed: false,
      requiresHumanReview: true,
      dimensions: {
        accuracy: 90,
        sourceTraceability: 95,
        japaneseLinguisticCorrectness: 94,
        jlptRelevance: 98,
        vocabularyCorrectness: 92,
        kanjiCorrectness: 90,
        grammarCorrectness: 88,
        furiganaCorrectness: 72,
        pronunciationCorrectness: 90,
        banglaTranslationQuality: 68,
        englishTranslationQuality: 92,
        japaneseExplanationQuality: 85,
        contextualAccuracy: 88,
        difficultyLevelCalibration: 92,
        duplicateDetection: 100,
        contentCompleteness: 72,
        learningUsefulness: 90,
        pedagogicalQuality: 84,
        formattingQuality: 88,
        brandingConsistency: 100,
        safetyContentCheck: 100,
        versionIntegrity: 92,
        humanReviewState: 60
      },
      violations: [
        {
          ruleId: 'NS-04-BN-MEANING-SHORT',
          dimension: 'banglaTranslationQuality',
          severity: 'WARNING',
          message: 'Bengali meaning is brief and lacks contextual contrast between particle で (by/with) vs に (at/in).',
          suggestedFix: 'Clarify that で denotes vehicle, tool, or action location in Bengali.'
        },
        {
          ruleId: 'NS-08-EXEMPLAR-COUNT-LOW',
          dimension: 'contentCompleteness',
          severity: 'WARNING',
          message: 'Only 1 exemplar sentence found from automated extraction; requires minimum 2.',
          suggestedFix: 'Add Tokyo Yamanote line / Shinkansen exemplar sentences with Bengali furigana.'
        }
      ],
      reviewNotes: 'SCORE BELOW 90 (82/100): Human review required prior to publication.'
    },
    versionHistory: [
      {
        version: 1,
        timestamp: '2026-08-25T01:10:00.000Z',
        author: 'ai_extractor_agent',
        summary: 'Automated OCR extraction flagged for manual human review due to concise Bangla text.',
        dataSnapshot: {
          code: 'N5-GR-003',
          type: 'GRAMMAR',
          level: 'N5',
          status: 'IN_REVIEW',
          lifecycleStage: 'HUMAN_REVIEW_REQUIRED',
          patternOrWord: '〜で (Means / Transport)',
          formulaOrReading: '[Vehicle / Tool] + で + [Action Verb]',
          trilingual: {
            ja: { text: '〜で', furigana: '〜で', romaji: '~ de', explanationJa: '手段や交通機関を表す助詞です。' },
            en: { meaning: 'by / with / using (means, vehicle, tool)', explanationEn: 'Particle で indicates the method, instrument, or means of transport.' },
            bn: { meaning: 'দিয়ে / মাধ্যমে / চড়ে (যানবাহন বা মাধ্যম)', explanationBn: 'যানবাহন বা কোনো মাধ্যম নির্দেশ করতে で ব্যবহৃত হয়।' }
          },
          qualityScore: 82
        }
      }
    ],
    prerequisites: ['N5-GR-001'],
    tags: ['Particle De', 'Transportation', 'Minna Lesson 5'],
    createdBy: 'ai_extractor_agent',
    updatedBy: 'ai_extractor_agent',
    createdAt: '2026-08-25T01:10:00.000Z',
    updatedAt: '2026-08-25T01:10:00.000Z',
    pattern: '〜で (Transportation & Means)',
    formula: '[Vehicle / Tool] + で + [Movement / Action Verb]',
    trilingual: {
      ja: {
        text: '〜で',
        furigana: '〜で',
        romaji: '~ de',
        explanationJa: '手段や交通機関を表す助詞です。'
      },
      en: {
        meaning: 'by / with / using (means, vehicle, tool)',
        explanationEn: 'Particle で indicates the method, instrument, or means of transport (e.g., by train, with chopsticks).'
      },
      bn: {
        meaning: 'দিয়ে / মাধ্যমে / চড়ে (যানবাহন বা হাতিয়ার)',
        explanationBn: 'কোনো যানবাহন চড়ে যাওয়া বা কোনো সরঞ্জাম দিয়ে কাজ করা বোঝাতে で কণা ব্যবহৃত হয় (যেমন: ট্রেনে করে যাওয়া, চপস্টিক দিয়ে খাওয়া)।'
      }
    },
    exampleSentences: [
      {
        ja: 'でんしゃで いきます。',
        furigana: '[電車|でんしゃ]で [行|い]きます。',
        romaji: 'Densha de ikimasu.',
        en: 'I go by train.',
        bn: 'আমি ট্রেনে করে যাব।'
      }
    ],
    commonMistakes: [
      {
        incorrect: 'あるいて で いきます。(walk by)',
        correct: 'あるいて いきます。(no で after aruite)',
        reasonBn: 'হেঁটে যাওয়ার ক্ষেত্রে 歩いて (Aruite) একটি ক্রিয়ার তে-রূপ হওয়ায় এর সাথে で কণা বসে না।'
      }
    ]
  } as GrammarObject,
  {
    id: 'ko-n4-gr-review-048',
    code: 'N4-GR-048',
    type: 'GRAMMAR',
    level: 'N4',
    domain: 'GRAMMAR',
    lifecycleStage: 'HUMAN_REVIEW_REQUIRED',
    status: 'IN_REVIEW',
    version: 1,
    sourceTraceability: {
      sourceDocumentId: 'doc-mnh-shokyu2',
      sourceDocumentTitle: 'Minna no Nihongo Shokyu II',
      sourceAuthor: '3A Corporation',
      sourcePage: 184,
      sourceSection: 'Lesson 48 Causative Verbs (使役形)',
      sourceTextSnippet: '【文型 48】 課長は 田中さんを アメリカへ 出張させます。',
      sourceHash: 'sha256-causative-v-4899b1',
      extractionTimestamp: '2026-08-25T02:00:00.000Z',
      processingVersion: 'v2.4.0',
      copyrightLicense: 'ACADEMIC_FAIR_USE'
    },
    qualityEvaluation: {
      evaluatedAt: '2026-08-25T02:05:00.000Z',
      overallScore: 84,
      passed: false,
      requiresHumanReview: true,
      dimensions: {
        accuracy: 92,
        sourceTraceability: 96,
        japaneseLinguisticCorrectness: 95,
        jlptRelevance: 99,
        vocabularyCorrectness: 92,
        kanjiCorrectness: 90,
        grammarCorrectness: 92,
        furiganaCorrectness: 76,
        pronunciationCorrectness: 90,
        banglaTranslationQuality: 70,
        englishTranslationQuality: 92,
        japaneseExplanationQuality: 88,
        contextualAccuracy: 88,
        difficultyLevelCalibration: 94,
        duplicateDetection: 100,
        contentCompleteness: 75,
        learningUsefulness: 92,
        pedagogicalQuality: 86,
        formattingQuality: 90,
        brandingConsistency: 100,
        safetyContentCheck: 100,
        versionIntegrity: 94,
        humanReviewState: 65
      },
      violations: [
        {
          ruleId: 'NS-05-BN-EXPLANATION-MISSING',
          dimension: 'banglaTranslationQuality',
          severity: 'WARNING',
          message: 'Bangla causative explanation lacks distinction between Intransitive (を) vs Transitive (に) causers.',
          suggestedFix: 'Document the causative particle shift rules explicitly in Bangla.'
        }
      ],
      reviewNotes: 'SCORE BELOW 90 (84/100): Causative form particle rules need human validation before production.'
    },
    versionHistory: [
      {
        version: 1,
        timestamp: '2026-08-25T02:00:00.000Z',
        author: 'ai_extractor_agent',
        summary: 'Extracted Causative form from Lesson 48 PDF for human verification.',
        dataSnapshot: {
          code: 'N4-GR-048',
          type: 'GRAMMAR',
          level: 'N4',
          status: 'IN_REVIEW',
          lifecycleStage: 'HUMAN_REVIEW_REQUIRED',
          patternOrWord: '使役形 (Causative Form 〜せる / 〜させる)',
          formulaOrReading: 'Group 1: a-dan + せる / Group 2: stem + させる',
          trilingual: {
            ja: { text: '使役形 (しえきけい)', furigana: '[使役形|しえきけい]', romaji: 'Shiekikei', explanationJa: '誰かに何かをさせる表現です。' },
            en: { meaning: 'Make someone do / Let someone do (Causative form)', explanationEn: 'Expresses causing, ordering, or allowing someone to perform an action.' },
            bn: { meaning: 'কাউকে দিয়ে কোনো কাজ করানো বা করতে দেওয়া (প্রযোজক ক্রিয়া)', explanationBn: 'অন্য কাউকে কোনো কাজ করার আদেশ বা অনুমতি দেওয়া বোঝাতে ব্যবহৃত হয়।' }
          },
          qualityScore: 84
        }
      }
    ],
    prerequisites: ['N5-GR-001'],
    tags: ['Causative', 'Minna Lesson 48', 'N4 Grammar'],
    createdBy: 'ai_extractor_agent',
    updatedBy: 'ai_extractor_agent',
    createdAt: '2026-08-25T02:00:00.000Z',
    updatedAt: '2026-08-25T02:00:00.000Z',
    pattern: '使役形 〜せる / 〜させる (Causative)',
    formula: 'Group 1: [Verb -a] + せる / Group 2: [Stem] + させる / Group 3: させる (する)・こさせる (来る)',
    trilingual: {
      ja: {
        text: '使役形 (〜せる / 〜させる)',
        furigana: '[使役形|しえきけい] (〜せる / 〜させる)',
        romaji: 'Shiekikei (~seru / ~saseru)',
        explanationJa: '他者に動作を行わせる、あるいは許可する文型です。'
      },
      en: {
        meaning: 'Make / Let someone do (Causative form)',
        explanationEn: 'Expresses forcing, directing, or allowing someone to perform an action.'
      },
      bn: {
        meaning: 'কাউকে দিয়ে কোনো কাজ করানো বা করতে দেওয়া (প্রযোজক ক্রিয়া)',
        explanationBn: 'কাউকে কোনো কাজ করানোর বা অনুমতি দেওয়ার জন্য প্রযোজক ক্রিয়া রূপ ব্যবহৃত হয়।'
      }
    },
    exampleSentences: [
      {
        ja: 'ぶちょうは たなかさんを しゅっちょうさせます。',
        furigana: '[部長|ぶちょう]は [田中|たなか]さんを [出張|しゅっちょう]させます。',
        romaji: 'Buchou wa Tanaka-san wo shucchousasemasu.',
        en: 'The department manager makes Mr. Tanaka go on a business trip.',
        bn: 'বিভাগীয় প্রধান তানাকা সাহেবকে ব্যবসায়িক সফরে পাঠাবেন।'
      }
    ],
    commonMistakes: []
  } as GrammarObject,
  {
    id: 'ko-n5-kanji-001',
    code: 'N5-KJ-001',
    type: 'KANJI',
    level: 'N5',
    domain: 'KANJI',
    lifecycleStage: 'PUBLISHED',
    status: 'PUBLISHED',
    version: 2,
    sourceTraceability: {
      sourceDocumentId: 'doc-n5-kanji-master',
      sourceDocumentTitle: 'JLPT N5 Essential 100 Kanji Radicals Workbook',
      sourceAuthor: 'Nihomi Academic Press',
      sourcePage: 4,
      sourceTextSnippet: '【漢字 1】 日 (Sun, Day, Japan)',
      sourceHash: 'sha256-kanji-sun-001',
      extractionTimestamp: '2026-08-21T09:00:00.000Z',
      processingVersion: 'v2.4.0',
      copyrightLicense: 'ORIGINAL_PROPRIETARY'
    },
    qualityEvaluation: {
      evaluatedAt: '2026-08-21T09:05:00.000Z',
      overallScore: 99,
      passed: true,
      requiresHumanReview: false,
      dimensions: {
        accuracy: 100,
        sourceTraceability: 99,
        japaneseLinguisticCorrectness: 100,
        jlptRelevance: 100,
        vocabularyCorrectness: 99,
        kanjiCorrectness: 100,
        grammarCorrectness: 100,
        furiganaCorrectness: 100,
        pronunciationCorrectness: 98,
        banglaTranslationQuality: 100,
        englishTranslationQuality: 99,
        japaneseExplanationQuality: 98,
        contextualAccuracy: 99,
        difficultyLevelCalibration: 100,
        duplicateDetection: 100,
        contentCompleteness: 99,
        learningUsefulness: 100,
        pedagogicalQuality: 99,
        formattingQuality: 100,
        brandingConsistency: 100,
        safetyContentCheck: 100,
        versionIntegrity: 100,
        humanReviewState: 100
      },
      violations: [],
      reviewNotes: 'Pristine: Passed 23-Dimension NIHOMI STANDARD™ automated evaluation.'
    },
    versionHistory: [
      {
        version: 1,
        timestamp: '2026-08-21T09:00:00.000Z',
        author: 'system_ingestion_pipeline',
        summary: 'Initial radical and reading extraction for Kanji 日.',
        dataSnapshot: {
          code: 'N5-KJ-001',
          type: 'KANJI',
          level: 'N5',
          status: 'DRAFT',
          lifecycleStage: 'EXTRACTING',
          patternOrWord: '日',
          formulaOrReading: 'NICHI / JITSU / hi',
          trilingual: {
            ja: { text: '日', furigana: 'ひ', romaji: 'hi' },
            en: { meaning: 'Sun, Day', explanationEn: 'Sun Kanji.' },
            bn: { meaning: 'সূর্য, দিন', explanationBn: 'সূর্য বা দিন বোঝায়।' }
          },
          qualityScore: 89
        }
      },
      {
        version: 2,
        timestamp: '2026-08-23T10:00:00.000Z',
        author: 'mdtanvirkabirbiplob@gmail.com',
        summary: 'Added compounds (日本, 日曜日) and stroke breakdown.',
        dataSnapshot: {
          code: 'N5-KJ-001',
          type: 'KANJI',
          level: 'N5',
          status: 'PUBLISHED',
          lifecycleStage: 'PUBLISHED',
          patternOrWord: '日',
          formulaOrReading: 'NICHI / JITSU / hi',
          trilingual: {
            ja: { text: '日', furigana: 'ひ', romaji: 'hi', explanationJa: '太陽、昼、あるいは1日を表す基本的な漢字です。' },
            en: { meaning: 'Sun, Day, Japan, Counter for days', explanationEn: 'Represents the sun and calendar days.' },
            bn: { meaning: 'সূর্য, দিন, জাপান, তারিখ', explanationBn: 'সূর্য ও দিন বোঝাতে এই মৌলিক কাঞ্জিটি ব্যবহৃত হয়।' }
          },
          qualityScore: 99
        }
      }
    ],
    prerequisites: [],
    tags: ['Grade 1', 'N5 Kanji', 'Sun', 'Day'],
    createdBy: 'system_ingestion_pipeline',
    updatedBy: 'mdtanvirkabirbiplob@gmail.com',
    createdAt: '2026-08-21T09:00:00.000Z',
    updatedAt: '2026-08-25T08:00:00.000Z',
    kanji: '日',
    strokes: 4,
    radical: '日',
    radicalMeaning: 'Sun / Day',
    onyomi: ['NICHI', 'JITSU'],
    kunyomi: ['hi', '-bi', '-ka'],
    trilingual: {
      ja: {
        text: '日',
        furigana: 'ひ',
        romaji: 'hi',
        explanationJa: '太陽、昼、あるいは1日を表す基本的な漢字です。'
      },
      en: {
        meaning: 'Sun, Day, Japan, Counter for days',
        explanationEn: 'Represents the sun and calendar days.'
      },
      bn: {
        meaning: 'সূর্য, দিন, জাপান, তারিখ',
        explanationBn: 'সূর্য ও দিন বোঝাতে এই মৌলিক কাঞ্জিটি ব্যবহৃত হয়। জাপানের পতাকার উদীয়মান সূর্য এবং নিহোনের (日本) প্রথম কাঞ্জি।'
      }
    },
    compounds: [
      {
        word: '日本',
        reading: 'にほん',
        meaningEn: 'Japan',
        meaningBn: 'জাপান দেশ'
      },
      {
        word: '日曜日',
        reading: 'にちようび',
        meaningEn: 'Sunday',
        meaningBn: 'রবিবার'
      }
    ]
  } as KanjiObject
];

const KNOWLEDGE_STORAGE_KEY = 'nihomi_master_knowledge_objects_v2';

function loadSavedKnowledgeObjects(): KnowledgeObject[] {
  if (typeof window === 'undefined') return [...SEED_KNOWLEDGE_OBJECTS];
  try {
    const raw = localStorage.getItem(KNOWLEDGE_STORAGE_KEY);
    if (!raw) return [...SEED_KNOWLEDGE_OBJECTS];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...SEED_KNOWLEDGE_OBJECTS];
  } catch {
    return [...SEED_KNOWLEDGE_OBJECTS];
  }
}

function persistKnowledgeObjects(objs: KnowledgeObject[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KNOWLEDGE_STORAGE_KEY, JSON.stringify(objs));
  } catch (err) {
    console.warn('[ContentIngestionService] Could not persist knowledge objects:', err);
  }
}

let knowledgeObjects: KnowledgeObject[] = loadSavedKnowledgeObjects();

export const ContentIngestionService = {
  getKnowledgeObjects(filterStage?: ContentLifecycleStage): KnowledgeObject[] {
    if (filterStage) {
      return knowledgeObjects.filter((k) => k.lifecycleStage === filterStage);
    }
    return [...knowledgeObjects];
  },

  getKnowledgeObjectById(id: string): KnowledgeObject | undefined {
    return knowledgeObjects.find((k) => k.id === id);
  },

  upsertKnowledgeObject(obj: KnowledgeObject, author = 'system_ingestion_pipeline', summary = 'Upserted knowledge object'): KnowledgeObject {
    const existingIndex = knowledgeObjects.findIndex((k) => k.id === obj.id);
    if (existingIndex >= 0) {
      knowledgeObjects[existingIndex] = {
        ...obj,
        updatedAt: new Date().toISOString(),
        updatedBy: author
      };
    } else {
      knowledgeObjects.unshift(obj);
    }
    persistKnowledgeObjects(knowledgeObjects);
    return obj;
  },

  registerOrUpdateObject(obj: KnowledgeObject, author = 'mdtanvirkabirbiplob@gmail.com', summary = 'Content edit'): KnowledgeObject {
    const existingIndex = knowledgeObjects.findIndex((k) => k.id === obj.id);
    
    // Create new snapshot for version history
    const newVersion = (obj.version || 1) + 1;
    const snapshot: KnowledgeObjectVersionSnapshot = {
      version: newVersion,
      timestamp: new Date().toISOString(),
      author,
      summary,
      dataSnapshot: {
        code: obj.code,
        type: obj.type,
        level: obj.level,
        status: obj.status,
        lifecycleStage: obj.lifecycleStage,
        patternOrWord: obj.type === 'GRAMMAR' ? (obj as GrammarObject).pattern : obj.type === 'VOCABULARY' ? (obj as VocabularyObject).word : (obj as KanjiObject).kanji,
        formulaOrReading: obj.type === 'GRAMMAR' ? (obj as GrammarObject).formula : obj.type === 'VOCABULARY' ? (obj as VocabularyObject).reading : (obj as KanjiObject).onyomi.join('/'),
        trilingual: obj.trilingual,
        qualityScore: obj.qualityEvaluation?.overallScore ?? 95
      }
    };

    const history = obj.versionHistory ? [...obj.versionHistory, snapshot] : [snapshot];

    const updatedObj: KnowledgeObject = {
      ...obj,
      version: newVersion,
      versionHistory: history,
      updatedAt: new Date().toISOString(),
      updatedBy: author
    };

    if (existingIndex >= 0) {
      knowledgeObjects[existingIndex] = updatedObj;
    } else {
      knowledgeObjects.push(updatedObj);
    }
    persistKnowledgeObjects(knowledgeObjects);
    return updatedObj;
  },

  revertToVersion(objectId: string, targetVersion: number, author = 'mdtanvirkabirbiplob@gmail.com'): KnowledgeObject | null {
    const obj = knowledgeObjects.find((k) => k.id === objectId);
    if (!obj || !obj.versionHistory) return null;

    const targetSnapshot = obj.versionHistory.find((v) => v.version === targetVersion);
    if (!targetSnapshot) return null;

    const restored: KnowledgeObject = {
      ...obj,
      version: targetVersion,
      status: targetSnapshot.dataSnapshot.status,
      lifecycleStage: targetSnapshot.dataSnapshot.lifecycleStage,
      trilingual: targetSnapshot.dataSnapshot.trilingual,
      updatedAt: new Date().toISOString(),
      updatedBy: author
    };

    if (restored.type === 'GRAMMAR') {
      (restored as GrammarObject).pattern = targetSnapshot.dataSnapshot.patternOrWord;
      (restored as GrammarObject).formula = targetSnapshot.dataSnapshot.formulaOrReading;
    }

    const reEvaluated = NihomiStandardService.evaluateKnowledgeObject(restored);
    restored.qualityEvaluation = reEvaluated;

    const existingIndex = knowledgeObjects.findIndex((k) => k.id === objectId);
    if (existingIndex >= 0) {
      knowledgeObjects[existingIndex] = restored;
    }
    persistKnowledgeObjects(knowledgeObjects);
    return restored;
  },

  authorizeAndPublish(objectId: string, approverEmail = 'mdtanvirkabirbiplob@gmail.com'): KnowledgeObject | null {
    const obj = knowledgeObjects.find((k) => k.id === objectId);
    if (!obj) return null;

    obj.lifecycleStage = 'APPROVED';
    obj.status = 'PUBLISHED';
    obj.approvedBy = approverEmail;
    obj.approvedAt = new Date().toISOString();
    obj.updatedAt = new Date().toISOString();
    obj.updatedBy = approverEmail;

    const evalResult = NihomiStandardService.evaluateKnowledgeObject(obj);
    obj.qualityEvaluation = evalResult;

    const existingIndex = knowledgeObjects.findIndex((k) => k.id === objectId);
    if (existingIndex >= 0) {
      knowledgeObjects[existingIndex] = obj;
    }
    persistKnowledgeObjects(knowledgeObjects);
    return obj;
  },

  resetToSeed(): KnowledgeObject[] {
    knowledgeObjects = [...SEED_KNOWLEDGE_OBJECTS];
    persistKnowledgeObjects(knowledgeObjects);
    return [...knowledgeObjects];
  }
};
