import { KnowledgeObject, GrammarObject, VocabularyObject, KanjiObject } from './types';

export interface InfiniteLearningExperience {
  objectId: string;
  title: string;
  titleJa: string;
  level: string;
  formats: {
    microLesson: {
      formula: string;
      explanationBn: string;
      tipJa: string;
    };
    mcqQuiz: {
      question: string;
      options: { id: string; textJa: string; textBn: string; isCorrect: boolean }[];
      explanationBn: string;
    };
    flashcard: {
      front: string;
      back: string;
      audioPhrase: string;
    };
    baitoScenario: {
      situationBn: string;
      customerDialogueJa: string;
      correctStaffResponseJa: string;
      keigoNotesBn: string;
    };
    shadowingDrill: {
      sentenceJa: string;
      romaji: string;
      targetPitch: string;
      speed: number;
    };
    fillInBlank: {
      sentenceTemplate: string;
      correctAnswer: string;
      hintBn: string;
    };
    speedRecognition: {
      timeLimitSec: number;
      targetWord: string;
      distractors: string[];
    };
  };
}

export const InfiniteContentEngine = {
  generateInfiniteExperience(obj?: KnowledgeObject): InfiniteLearningExperience {
    if (!obj) {
      return {
        objectId: 'default',
        title: 'N1 は N2 です (Basic Copula)',
        titleJa: 'N1 は N2 です',
        level: 'N5',
        formats: {
          microLesson: {
            formula: 'Noun1 + は + Noun2 + です',
            explanationBn: 'হলো বা হয় অর্থে বাক্যের বিষয় নির্দেশ করতে は ও মার্জিত সমাপ্তি です ব্যবহৃত হয়।',
            tipJa: '「は」の発音は「わ」です。'
          },
          mcqQuiz: {
            question: 'わたし ___ がくせいです。(Choose the correct topic particle)',
            options: [
              { id: '1', textJa: 'は (wa)', textBn: 'বিষয় নির্দেশক কণা', isCorrect: true },
              { id: '2', textJa: 'を (wo)', textBn: 'কর্ম নির্দেশক কণা', isCorrect: false },
              { id: '3', textJa: 'で (de)', textBn: 'মাধ্যম নির্দেশক কণা', isCorrect: false }
            ],
            explanationBn: 'বাক্যের বিষয় (Topic) প্রকাশ করতে は ব্যবহৃত হয়।'
          },
          flashcard: {
            front: '〜は〜です',
            back: 'N1 is N2 (Topic marker + polite copula)',
            audioPhrase: 'わたしは がくせいです。'
          },
          baitoScenario: {
            situationBn: 'রেস্টুরেন্টে খদ্দেরকে স্বাগত জানানোর সময়',
            customerDialogueJa: 'すみません、2人です。',
            correctStaffResponseJa: 'いらっしゃいませ！2名様ですね。こちらへどうぞ。',
            keigoNotesBn: 'মার্জিতভাবে সংখ্যা উল্লেখ করতে 名様 (めいさま) ব্যবহার করা হয়।'
          },
          shadowingDrill: {
            sentenceJa: 'わたしは ダッカだいがくの がくせいです。',
            romaji: 'Watashi wa Dakka daigaku no gakusei desu.',
            targetPitch: 'Flat / Atamadaka (Standard Tokyo)',
            speed: 1.0
          },
          fillInBlank: {
            sentenceTemplate: '田中さん [___] 先生です。',
            correctAnswer: 'は',
            hintBn: 'বিষয় নির্দেশক কণা বসান'
          },
          speedRecognition: {
            timeLimitSec: 5,
            targetWord: '学生 (がくせい)',
            distractors: ['先生', '医者', '会社員']
          }
        }
      };
    }

    if (obj.type === 'GRAMMAR') {
      const g = obj as GrammarObject;
      return {
        objectId: g.id,
        title: g.pattern,
        titleJa: g.trilingual.ja.text,
        level: g.level,
        formats: {
          microLesson: {
            formula: g.formula,
            explanationBn: g.trilingual.bn.explanationBn,
            tipJa: g.trilingual.ja.explanationJa || '標準東京アクセントを意識しましょう。'
          },
          mcqQuiz: {
            question: `Which particle or ending completes: わたし ___ ${g.pattern.slice(0, 4)}...?`,
            options: [
              { id: '1', textJa: 'は (wa)', textBn: g.trilingual.bn.meaning, isCorrect: true },
              { id: '2', textJa: 'に (ni)', textBn: 'সময়/দিক কণা', isCorrect: false },
              { id: '3', textJa: 'が (ga)', textBn: 'কর্তা কণা', isCorrect: false }
            ],
            explanationBn: g.trilingual.bn.explanationBn
          },
          flashcard: {
            front: g.pattern,
            back: g.trilingual.en.meaning,
            audioPhrase: g.exampleSentences[0]?.ja || g.pattern
          },
          baitoScenario: {
            situationBn: 'টোকিওর কনবিনি বা দোকানে কর্মক্ষেত্রে কথোপকথন',
            customerDialogueJa: 'これを温めてください。',
            correctStaffResponseJa: 'かしこまりました。少々お待ちください。',
            keigoNotesBn: 'সম্মানসূচক বিনম্র জাপানি (Kenjougo)'
          },
          shadowingDrill: {
            sentenceJa: g.exampleSentences[0]?.ja || g.pattern,
            romaji: g.exampleSentences[0]?.romaji || '',
            targetPitch: 'Tokyo Standard Tone',
            speed: 1.0
          },
          fillInBlank: {
            sentenceTemplate: g.exampleSentences[0]?.ja.replace('は', '[___]') || '___ です。',
            correctAnswer: 'は',
            hintBn: 'সঠিক ব্যাকরণ কণা'
          },
          speedRecognition: {
            timeLimitSec: 5,
            targetWord: g.pattern,
            distractors: ['〜じゃありません', '〜でした', '〜ませんか']
          }
        }
      };
    } else {
      const v = obj as VocabularyObject;
      return {
        objectId: v.id,
        title: v.word || (obj as KanjiObject).kanji,
        titleJa: v.trilingual.ja.text,
        level: v.level,
        formats: {
          microLesson: {
            formula: `${v.word || (obj as KanjiObject).kanji} [${v.trilingual.ja.furigana}]`,
            explanationBn: v.trilingual.bn.explanationBn,
            tipJa: v.trilingual.ja.explanationJa || '語彙と漢字の読みをセットで覚えましょう。'
          },
          mcqQuiz: {
            question: `What is the meaning of "${v.word || (obj as KanjiObject).kanji}"?`,
            options: [
              { id: '1', textJa: v.trilingual.ja.text, textBn: v.trilingual.bn.meaning, isCorrect: true },
              { id: '2', textJa: '別語', textBn: 'অন্যান্য অর্থ', isCorrect: false },
              { id: '3', textJa: '対義語', textBn: 'বিপরীত শব্দ', isCorrect: false }
            ],
            explanationBn: v.trilingual.bn.explanationBn
          },
          flashcard: {
            front: v.word || (obj as KanjiObject).kanji,
            back: v.trilingual.bn.meaning,
            audioPhrase: v.trilingual.ja.text
          },
          baitoScenario: {
            situationBn: 'কর্মক্ষেত্রে যোগাযোগের সময় শব্দের ব্যবহার',
            customerDialogueJa: '袋はいりません。',
            correctStaffResponseJa: '承知いたしました。テープをお貼りします。',
            keigoNotesBn: 'দৈনন্দিন জাপানি শিষ্টাচার'
          },
          shadowingDrill: {
            sentenceJa: v.trilingual.ja.text,
            romaji: v.trilingual.ja.romaji,
            targetPitch: 'Tokyo Pitch Accent',
            speed: 1.0
          },
          fillInBlank: {
            sentenceTemplate: `これは [___] です。`,
            correctAnswer: v.word || (obj as KanjiObject).kanji,
            hintBn: v.trilingual.bn.meaning
          },
          speedRecognition: {
            timeLimitSec: 4,
            targetWord: v.word || (obj as KanjiObject).kanji,
            distractors: ['本', 'ペン', '机']
          }
        }
      };
    }
  }
};
