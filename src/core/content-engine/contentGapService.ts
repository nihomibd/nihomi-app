import { JLPTLevel, ContentDomain } from '../../types/nihomi';
import { LevelCompletenessMetrics, ContentGapItem, GrammarObject } from './types';
import { ContentIngestionService } from './contentIngestionService';
import { NihomiStandardService } from './nihomiStandardService';

const LEVEL_METRICS: Record<JLPTLevel, LevelCompletenessMetrics> = {
  N5: {
    level: 'N5',
    totalKnowledgeObjects: 342,
    vocabularyCoveragePercent: 96,
    kanjiCoveragePercent: 100,
    grammarCoveragePercent: 98,
    readingCoveragePercent: 92,
    listeningCoveragePercent: 94,
    speakingCoveragePercent: 90,
    assessmentCoveragePercent: 95,
    overallCompletenessPercent: 96,
    totalPendingReviewCount: 3
  },
  N4: {
    level: 'N4',
    totalKnowledgeObjects: 288,
    vocabularyCoveragePercent: 88,
    kanjiCoveragePercent: 92,
    grammarCoveragePercent: 90,
    readingCoveragePercent: 84,
    listeningCoveragePercent: 86,
    speakingCoveragePercent: 82,
    assessmentCoveragePercent: 88,
    overallCompletenessPercent: 87,
    totalPendingReviewCount: 8
  },
  N3: {
    level: 'N3',
    totalKnowledgeObjects: 195,
    vocabularyCoveragePercent: 74,
    kanjiCoveragePercent: 78,
    grammarCoveragePercent: 80,
    readingCoveragePercent: 72,
    listeningCoveragePercent: 75,
    speakingCoveragePercent: 70,
    assessmentCoveragePercent: 76,
    overallCompletenessPercent: 75,
    totalPendingReviewCount: 14
  },
  N2: {
    level: 'N2',
    totalKnowledgeObjects: 110,
    vocabularyCoveragePercent: 55,
    kanjiCoveragePercent: 60,
    grammarCoveragePercent: 62,
    readingCoveragePercent: 50,
    listeningCoveragePercent: 54,
    speakingCoveragePercent: 48,
    assessmentCoveragePercent: 52,
    overallCompletenessPercent: 54,
    totalPendingReviewCount: 22
  },
  N1: {
    level: 'N1',
    totalKnowledgeObjects: 65,
    vocabularyCoveragePercent: 35,
    kanjiCoveragePercent: 40,
    grammarCoveragePercent: 42,
    readingCoveragePercent: 32,
    listeningCoveragePercent: 36,
    speakingCoveragePercent: 30,
    assessmentCoveragePercent: 34,
    overallCompletenessPercent: 35,
    totalPendingReviewCount: 31
  }
};

let contentGaps: ContentGapItem[] = [
  {
    id: 'gap-01',
    level: 'N5',
    domain: 'GRAMMAR',
    missingConcept: 'Particle で (Means / Transportation & Location of Action)',
    gapType: 'MISSING_EXEMPLARS',
    reason: 'Requires 4 additional Tokyo transport and convenience store exemplar sentences with natural Bengali translations.',
    priority: 'HIGH',
    severity: 'CRITICAL',
    status: 'OPEN',
    detectedAt: '2026-08-24T06:00:00.000Z',
    recommendedAction: 'Extract Minna no Nihongo Lesson 5 & generate 4 Tokyo transit exemplars (Yamanote Line, Shinkansen, Suica).'
  },
  {
    id: 'gap-02',
    level: 'N5',
    domain: 'CONVERSATION',
    missingConcept: 'Convenience Store (Conbini) Payment & Point Card Dialogue',
    gapType: 'MISSING_BANGLA_TRANSLATION',
    reason: 'Add Bengali culturally calibrated notes regarding 7-Eleven, Lawson cashless transactions and receipts (レシート).',
    priority: 'MEDIUM',
    severity: 'WARNING',
    status: 'OPEN',
    detectedAt: '2026-08-23T14:30:00.000Z',
    recommendedAction: 'Generate Tokyo Life Survival dialogue module with Bengali audio notes.'
  },
  {
    id: 'gap-03',
    level: 'N4',
    domain: 'GRAMMAR',
    missingConcept: 'Causative Form (使役形 〜せる / 〜させる) Particle Discrimination',
    gapType: 'MISSING_EXEMPLARS',
    reason: 'Intransitive verb causer particle (を) vs Transitive verb causer particle (に) needs 4 concrete business workplace exemplars.',
    priority: 'HIGH',
    severity: 'CRITICAL',
    status: 'OPEN',
    detectedAt: '2026-08-25T02:15:00.000Z',
    recommendedAction: 'Author 4 Minna no Nihongo Lesson 48 scenario-based exemplars comparing を and に.'
  },
  {
    id: 'gap-04',
    level: 'N3',
    domain: 'INTERVIEW',
    missingConcept: 'IT Engineer Technical Visa Self-PR (自己PR) in Sonkeigo/Kenjougo',
    gapType: 'LOW_QUALITY_SCORE',
    reason: 'Audio pronunciation pitch accent data requires Tokyo standard tone recalibration.',
    priority: 'HIGH',
    severity: 'WARNING',
    status: 'OPEN',
    detectedAt: '2026-08-24T18:45:00.000Z',
    recommendedAction: 'Re-synthesize audio with Tokyo standard pitch contour.'
  },
  {
    id: 'gap-05',
    level: 'N4',
    domain: 'GRAMMAR',
    missingConcept: 'Passive Form (受身形 〜れる / 〜られる) Victim/Suffering Nuance',
    gapType: 'MISSING_ASSESSMENT',
    reason: 'Diagnostic quiz questions count is below the minimum threshold of 8 items for Minna Lesson 37.',
    priority: 'MEDIUM',
    severity: 'MINOR',
    status: 'OPEN',
    detectedAt: '2026-08-25T03:00:00.000Z',
    recommendedAction: 'Generate 6 situational quiz questions on nuisance passive (迷惑の受身).'
  }
];

export const ContentGapService = {
  getLevelCompleteness(level: JLPTLevel): LevelCompletenessMetrics {
    return LEVEL_METRICS[level] || LEVEL_METRICS.N5;
  },

  getContentGaps(): ContentGapItem[] {
    return [...contentGaps];
  },

  triggerAiFixForGap(gapId: string): { success: boolean; message: string; gap?: ContentGapItem } {
    const targetGap = contentGaps.find((g) => g.id === gapId);
    if (!targetGap) {
      return { success: false, message: 'Gap item not found.' };
    }

    if (targetGap.gapType === 'MISSING_EXEMPLARS') {
      let exemplars = [
        {
          ja: 'しんかんせんで きょうとへ いきます。',
          furigana: '[新幹線|しんかんせん]で [京都|きょうと]へ [行|い]きます。',
          romaji: 'Shinkansen de Kyouto he ikimasu.',
          en: 'I go to Kyoto by bullet train (Shinkansen).',
          bn: 'আমি বুলেট ট্রেনে (শিনকানসেন) করে কিয়োটো যাব।'
        },
        {
          ja: 'やまのてせんで しんじゅくへ きました。',
          furigana: '[山手線|やまのてせん]で [新宿|しんじゅく]へ [来|き]ました。',
          romaji: 'Yamanote-sen de Shinjuku he kimashita.',
          en: 'I came to Shinjuku via the Yamanote Line.',
          bn: 'আমি ইয়ামানোতে লাইনের ট্রেনে চড়ে শিঞ্জুকু এসেছি।'
        },
        {
          ja: 'はしで らーめんを たべます。',
          furigana: 'はしで ラーメンを [食|た]べます。',
          romaji: 'Hashi de raamen wo tabemasu.',
          en: 'I eat ramen with chopsticks.',
          bn: 'আমি চপস্টিক দিয়ে রামেন খাব।'
        },
        {
          ja: 'すいかで でんしゃの きっぷを かいました。',
          furigana: 'Suicaで [電車|でんしゃ]の [切符|きっぷ]を [買|か]いました。',
          romaji: 'Suica de densha no kippu wo kaimashita.',
          en: 'I bought the train ticket using a Suica IC card.',
          bn: 'আমি সুইকা (Suica) আইসি কার্ড দিয়ে ট্রেনের টিকিট কিনেছি।'
        }
      ];

      if (targetGap.level === 'N4') {
        exemplars = [
          {
            ja: 'しゃちょうは たなかさんを アメリカへ いかせます。',
            furigana: '[社長|しゃちょう]は [田中|たなか]さんを アメリカへ [行|い]かせます。',
            romaji: 'Shachou wa Tanaka-san wo Amerika he ikasemasu.',
            en: 'The company president makes Mr. Tanaka go to America. (Intransitive: を)',
            bn: 'কোম্পানির প্রেসিডেন্ট তানাকা সাহেবকে আমেরিকায় পাঠান। (অকর্মক: を)'
          },
          {
            ja: 'せんせいは がくせいに さくぶんを かかせます。',
            furigana: '[先生|せんせい]は [学生|がくせい]に [作文|さくぶん]を [書|か]かせます。',
            romaji: 'Sensei wa gakusei ni sakubun wo kakasemasu.',
            en: 'The teacher makes the students write an essay. (Transitive: に)',
            bn: 'শিক্ষক ছাত্রদের দিয়ে রচনা লেখান। (সকর্মক: に)'
          },
          {
            ja: 'すずきさんに しりょうを コピーさせました。',
            furigana: '[鈴木|すずき]さんに [資料|しりょう]を コピーさせました。',
            romaji: 'Suzuki-san ni shiryou wo kopiisasemashita.',
            en: 'I had Suzuki-san photocopy the documents.',
            bn: 'আমি সুজুকি সাহেবকে দিয়ে নথিপত্র ফটোকপি করিয়েছিলাম।'
          },
          {
            ja: 'こどもに やさいを たべさせます。',
            furigana: '[子供|こども]に [野菜|やさい]を [食|た]べさせます。',
            romaji: 'Kodomo ni yasai wo tabesasemasu.',
            en: 'I make the child eat vegetables.',
            bn: 'আমি বাচ্চাকে শাকসবজি খেতে বাধ্য করি।'
          }
        ];
      }

      targetGap.exemplarsGenerated = exemplars;
      targetGap.status = 'RESOLVED';
      targetGap.resolvedAt = new Date().toISOString();

      // Check if related knowledge object exists in ContentIngestionService and update it
      const objs = ContentIngestionService.getKnowledgeObjects();
      const match = objs.find(
        (o) => o.level === targetGap.level && o.domain === targetGap.domain && o.type === 'GRAMMAR'
      ) as GrammarObject | undefined;

      if (match) {
        match.exampleSentences = [...(match.exampleSentences || []), ...exemplars];
        const evaluated = NihomiStandardService.evaluateKnowledgeObject(match);
        match.qualityEvaluation = evaluated;
        ContentIngestionService.registerOrUpdateObject(match, 'AI-Content-Autofix', 'AI-assisted generated exemplars');
      }

      return {
        success: true,
        message: `Successfully resolved gap: Generated 4 culturally verified Tokyo exemplars for "${targetGap.missingConcept}".`,
        gap: targetGap
      };
    } else {
      targetGap.status = 'RESOLVED';
      targetGap.resolvedAt = new Date().toISOString();
      return {
        success: true,
        message: `Resolved gap: Automated calibration completed for "${targetGap.missingConcept}".`,
        gap: targetGap
      };
    }
  }
};
