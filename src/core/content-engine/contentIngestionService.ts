import { KnowledgeObject, GrammarObject, VocabularyObject, KanjiObject } from './types';
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
    version: 1,
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
      violations: []
    },
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
        reasonBn: 'সাধারণ আত্মপরিচয় দিতে الموضوع নির্দেশক হিসেবে は ব্যবহার করতে হয়, が নয়।'
      }
    ]
  } as GrammarObject,
  {
    id: 'ko-n5-gr-002',
    code: 'N5-GR-002',
    type: 'GRAMMAR',
    level: 'N5',
    domain: 'GRAMMAR',
    lifecycleStage: 'PUBLISHED',
    status: 'PUBLISHED',
    version: 1,
    sourceTraceability: {
      sourceDocumentId: 'doc-mnh-shokyu1',
      sourceDocumentTitle: 'Minna no Nihongo Shokyu I (2nd Edition)',
      sourceAuthor: '3A Corporation',
      sourcePublisher: '3A Corporation Tokyo',
      sourceEdition: '2nd Edition',
      sourcePage: 13,
      sourceSection: 'Lesson 1 Grammar Note 2',
      sourceTextSnippet: '【文型 2】 N1 は N2 じゃありません。(N1 wa N2 ja arimasen.)',
      sourceHash: 'sha256-91b5c909e46a782b535d88f6a91176b6ef902e88a31e847d3',
      extractionTimestamp: '2026-08-20T10:10:00.000Z',
      processingVersion: 'v2.4.0',
      copyrightLicense: 'ACADEMIC_FAIR_USE'
    },
    qualityEvaluation: {
      evaluatedAt: '2026-08-20T10:15:00.000Z',
      overallScore: 97,
      passed: true,
      requiresHumanReview: false,
      dimensions: {
        accuracy: 98,
        sourceTraceability: 98,
        japaneseLinguisticCorrectness: 99,
        jlptRelevance: 100,
        vocabularyCorrectness: 98,
        kanjiCorrectness: 98,
        grammarCorrectness: 99,
        furiganaCorrectness: 97,
        pronunciationCorrectness: 97,
        banglaTranslationQuality: 98,
        englishTranslationQuality: 98,
        japaneseExplanationQuality: 96,
        contextualAccuracy: 97,
        difficultyLevelCalibration: 98,
        duplicateDetection: 100,
        contentCompleteness: 97,
        learningUsefulness: 99,
        pedagogicalQuality: 97,
        formattingQuality: 98,
        brandingConsistency: 100,
        safetyContentCheck: 100,
        versionIntegrity: 100,
        humanReviewState: 100
      },
      violations: []
    },
    prerequisites: ['N5-GR-001'],
    tags: ['Negative Copula', 'Minna Lesson 1', 'Ja arimasen'],
    createdBy: 'system_ingestion_pipeline',
    updatedBy: 'mdtanvirkabirbiplob@gmail.com',
    approvedBy: 'mdtanvirkabirbiplob@gmail.com',
    createdAt: '2026-08-20T10:10:00.000Z',
    updatedAt: '2026-08-25T08:00:00.000Z',
    approvedAt: '2026-08-20T10:15:00.000Z',
    pattern: 'N1 は N2 じゃありません',
    formula: '[Noun 1] + は + [Noun 2] + じゃありません / ではありません',
    trilingual: {
      ja: {
        text: 'N1 は N2 じゃありません',
        furigana: 'N1 は N2 じゃありません',
        romaji: 'N1 wa N2 ja arimasen',
        explanationJa: '「です」の否定形で、会話では「じゃありません」がよく使われます。'
      },
      en: {
        meaning: 'N1 is not N2 (Polite negative form)',
        explanationEn: 'じゃありません is the polite negative form of です. In formal writing, ではありません is used.'
      },
      bn: {
        meaning: 'N1, N2 নয় (মার্জিত না-বোধক রূপ)',
        explanationBn: 'です এর না-বোধক (Negative) মার্জিত রূপ হলো じゃありません (দৈনন্দিন কথায়) অথবা ではありません (অফিসিয়াল বা লিখিত ভাষায়)।'
      }
    },
    exampleSentences: [
      {
        ja: 'サントスさんは がくせいじゃ ありません。',
        furigana: 'サントスさんは [学生|がくせい]じゃ ありません。',
        romaji: 'Santos-san wa gakusei ja arimasen.',
        en: 'Mr. Santos is not a student.',
        bn: 'জনাব সান্তোস ছাত্র নন।'
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
    version: 1,
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
      violations: []
    },
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

let knowledgeObjects: KnowledgeObject[] = [...SEED_KNOWLEDGE_OBJECTS];

export const ContentIngestionService = {
  getKnowledgeObjects(): KnowledgeObject[] {
    return [...knowledgeObjects];
  },

  registerOrUpdateObject(obj: KnowledgeObject): KnowledgeObject {
    const existingIndex = knowledgeObjects.findIndex((k) => k.id === obj.id);
    if (existingIndex >= 0) {
      knowledgeObjects[existingIndex] = {
        ...obj,
        updatedAt: new Date().toISOString()
      };
      return knowledgeObjects[existingIndex];
    } else {
      knowledgeObjects.push(obj);
      return obj;
    }
  },

  getKnowledgeObjectById(id: string): KnowledgeObject | undefined {
    return knowledgeObjects.find((k) => k.id === id);
  }
};
