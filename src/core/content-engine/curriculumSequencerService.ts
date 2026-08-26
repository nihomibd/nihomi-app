import { JLPTLevel } from '../../types/nihomi';
import { KnowledgeObject } from './types';
import { ContentIngestionService } from './contentIngestionService';

export interface CurriculumUnit {
  unitNumber: number;
  title: string;
  titleJa: string;
  level: JLPTLevel;
  learningObjectives: string[];
  concepts: {
    code: string;
    patternOrWord: string;
    type: string;
    prerequisitesRequired: string[];
  }[];
  estimatedHours: number;
}

export class CurriculumSequencerService {
  static getSequencedCurriculum(level: JLPTLevel = 'N5'): CurriculumUnit[] {
    const objects = ContentIngestionService.getKnowledgeObjects({ level });

    if (level === 'N5') {
      return [
        {
          unitNumber: 1,
          title: 'Unit 01: Foundations & Polite Introductions',
          titleJa: '第1課：初対面の挨拶と自己紹介',
          level: 'N5',
          learningObjectives: [
            'Master Hiragana & basic phonetic pronunciation',
            'Understand polite copula pattern (N1 wa N2 desu)',
            'Deliver formal self-introduction (Hajimemashite)',
          ],
          concepts: [
            { code: 'NHM-N5-GR-001', patternOrWord: 'N1 は N2 です', type: 'GRAMMAR', prerequisitesRequired: [] },
            { code: 'NHM-N5-VB-001', patternOrWord: 'わたし (I / Me)', type: 'VOCABULARY', prerequisitesRequired: [] },
            { code: 'NHM-N5-KJ-001', patternOrWord: '日 (Sun / Day)', type: 'KANJI', prerequisitesRequired: [] },
          ],
          estimatedHours: 12,
        },
        {
          unitNumber: 2,
          title: 'Unit 02: Demonstratives & Everyday Objects',
          titleJa: '第2課：指示代名詞と身の回りの物',
          level: 'N5',
          learningObjectives: [
            'Use Ko-So-A-Do spatial demonstratives (これ・それ・あれ)',
            'Ask and answer identifying questions (何ですか)',
          ],
          concepts: [
            { code: 'NHM-N5-GR-002', patternOrWord: 'これ・それ・あれ は N です', type: 'GRAMMAR', prerequisitesRequired: ['NHM-N5-GR-001'] },
            { code: 'NHM-N5-VB-002', patternOrWord: '本 (Book)', type: 'VOCABULARY', prerequisitesRequired: [] },
            { code: 'NHM-N5-KJ-002', patternOrWord: '本 (Book / Origin)', type: 'KANJI', prerequisitesRequired: [] },
          ],
          estimatedHours: 15,
        },
        {
          unitNumber: 3,
          title: 'Unit 03: Action Verbs & Daily Routine (Te-form)',
          titleJa: '第3課：動詞の活用と日常会話',
          level: 'N5',
          learningObjectives: [
            'Conjugate standard Masu-form and Te-form verbs',
            'Express sequential and simultaneous actions (~ながら)',
          ],
          concepts: [
            { code: 'NHM-N5-GR-003', patternOrWord: 'V[masu-stem] + ながら', type: 'GRAMMAR', prerequisitesRequired: ['NHM-N5-GR-001', 'NHM-N5-GR-002'] },
            { code: 'NHM-N5-VB-003', patternOrWord: '勉強します (To Study)', type: 'VOCABULARY', prerequisitesRequired: [] },
          ],
          estimatedHours: 20,
        },
      ];
    }

    return [
      {
        unitNumber: 1,
        title: `Unit 01: Core JLPT ${level} Progression`,
        titleJa: `第1課：JLPT ${level} 総合演習`,
        level,
        learningObjectives: ['Intermediate sentence connectivity', 'Nuance & register control'],
        concepts: objects.slice(0, 5).map((o) => ({
          code: o.code,
          patternOrWord: o.type === 'GRAMMAR' ? (o as any).pattern : (o as any).word || o.code,
          type: o.type,
          prerequisitesRequired: o.prerequisites || [],
        })),
        estimatedHours: 25,
      },
    ];
  }
}
