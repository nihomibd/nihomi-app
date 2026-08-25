import { KnowledgeObject, GrammarObject, VocabularyObject, KanjiObject } from './types';

export interface InfiniteLearningExperience {
  objectId: string;
  title: string;
  titleJa: string;
  level: string;
  domain: string;
  formats: {
    // 1. Micro-Lesson Formula
    microLesson: {
      formula: string;
      explanationBn: string;
      tipJa: string;
      mnemonicBn: string;
    };
    // 2. MCQ Concept Quiz
    mcqQuiz: {
      question: string;
      options: { id: string; textJa: string; textBn: string; isCorrect: boolean }[];
      explanationBn: string;
    };
    // 3. Leitner Flashcard
    flashcard: {
      front: string;
      back: string;
      furigana: string;
      audioPhrase: string;
    };
    // 4. Tokyo Baito & Keigo Workplace Scenario
    baitoScenario: {
      situationBn: string;
      customerDialogueJa: string;
      correctStaffResponseJa: string;
      keigoNotesBn: string;
    };
    // 5. Pitch Accent Shadowing Drill
    shadowingDrill: {
      sentenceJa: string;
      romaji: string;
      targetPitch: string;
      speed: number;
    };
    // 6. Cloze / Fill-in-the-Blank
    fillInBlank: {
      sentenceTemplate: string;
      correctAnswer: string;
      hintBn: string;
    };
    // 7. Speed Recognition Drill
    speedRecognition: {
      timeLimitSec: number;
      targetWord: string;
      distractors: string[];
    };
    // 8. Particle Discrimination Lab
    particleDiscrimination: {
      sentenceWithBlank: string;
      correctParticle: string;
      wrongParticle: string;
      whyCorrectBn: string;
    };
    // 9. Keigo Transformation & Politeness Lab
    keigoTransformation: {
      plainForm: string;
      teineigo: string;
      sonkeigo: string;
      kenjougo: string;
    };
    // 10. Native Listening Audio Dialogue
    nativeListening: {
      audioTranscriptJa: string;
      speakerA: string;
      speakerB: string;
      questionBn: string;
      answerBn: string;
    };
    // 11. Cultural Context & Nuance Guide
    culturalContext: {
      tokyoLifeInsight: string;
      etiquetteRuleBn: string;
      banglaNuanceComparison: string;
    };
    // 12. Stroke Order & Radical Decomposition
    kanjiDecomposition: {
      radical: string;
      radicalMeaning: string;
      strokeCount: number;
      strokeHint: string;
    };
    // 13. Sentence Scramble / Reordering Puzzle
    sentenceScramble: {
      shuffledTiles: string[];
      correctOrder: string[];
      fullSentenceJa: string;
      translationBn: string;
    };
    // 14. Collocation & Natural Phrasing Match
    collocationMatch: {
      targetWord: string;
      naturalPair: string;
      meaningBn: string;
      unnaturalPairWarning: string;
    };
    // 15. Error Spotter & Ghost Mode Recovery Challenge
    errorSpotter: {
      flawedSentenceJa: string;
      correctedSentenceJa: string;
      errorReasonBn: string;
    };
  };
}

export const InfiniteContentEngine = {
  generateInfiniteExperience(obj?: KnowledgeObject): InfiniteLearningExperience {
    const isGrammar = !obj || obj.type === 'GRAMMAR';
    const isKanji = obj?.type === 'KANJI';
    const level = obj?.level || 'N5';

    if (isKanji) {
      const k = obj as KanjiObject;
      return {
        objectId: k.id,
        title: k.kanji,
        titleJa: k.trilingual.ja.text,
        level: k.level,
        domain: 'KANJI',
        formats: {
          microLesson: {
            formula: `漢字「${k.kanji}」 [音: ${k.onyomi.join(', ')} / 訓: ${k.kunyomi.join(', ')}]`,
            explanationBn: `${k.trilingual.bn.meaning} — মোট ${k.strokes}টি স্ট্রোক। মূল রুট বা বুশু (Radical): ${k.radical} (${k.radicalMeaning})।`,
            tipJa: `書き順を意識して、上から下、左から右へ書きましょう。`,
            mnemonicBn: `সূর্য বা দিনের গোলকের প্রতীক হিসেবে চৌকো চারপাশ ও মধ্যরেখা দিয়ে গঠিত।`
          },
          mcqQuiz: {
            question: `「${k.kanji}」কাঞ্জিটির সঠিক ওন-ইয়োমি (Onyomi) রিডিং কোনটি?`,
            options: [
              { id: '1', textJa: k.onyomi[0] || 'NICHI', textBn: 'ওন-ইয়োমি রিডিং', isCorrect: true },
              { id: '2', textJa: 'GETSU', textBn: 'অন্য কাঞ্জির রিডিং', isCorrect: false },
              { id: '3', textJa: 'KAA', textBn: 'ভুল রিডিং', isCorrect: false }
            ],
            explanationBn: `「${k.kanji}」কাঞ্জির ওন-ইয়োমি হলো ${k.onyomi.join(', ')} এবং কুন-ইয়োমি হলো ${k.kunyomi.join(', ')}।`
          },
          flashcard: {
            front: k.kanji,
            back: `${k.trilingual.bn.meaning} (${k.trilingual.en.meaning})`,
            furigana: k.kunyomi[0] || k.onyomi[0],
            audioPhrase: k.compounds[0]?.reading || k.trilingual.ja.text
          },
          baitoScenario: {
            situationBn: 'দোকানের কাজের শিডিউলে বার ও তারিখ দেখার সময়',
            customerDialogueJa: '日曜日もシフトに入れますか？',
            correctStaffResponseJa: 'はい、日曜日は午前中から入れます。よろしくお願いいたします。',
            keigoNotesBn: 'বার ও শিফট নিয়ে কথা বলার সময়「日曜日」(Nichiyoubi) শব্দটি ব্যবহৃত হয়।'
          },
          shadowingDrill: {
            sentenceJa: `きょうは ${k.compounds[1]?.reading || 'にちようび'} です。`,
            romaji: `Kyou wa nichiyoubi desu.`,
            targetPitch: 'Atamadaka (頭高型)',
            speed: 1.0
          },
          fillInBlank: {
            sentenceTemplate: `明日は [___]曜日です。`,
            correctAnswer: k.kanji,
            hintBn: `সঠিক কাঞ্জিটি বসান`
          },
          speedRecognition: {
            timeLimitSec: 4,
            targetWord: k.kanji,
            distractors: ['目', '月', '田', '白']
          },
          particleDiscrimination: {
            sentenceWithBlank: `今週の [___] 曜日に テストがあります。`,
            correctParticle: '日',
            wrongParticle: '月',
            whyCorrectBn: 'রবিবার বোঝাতে কাঞ্জি 日 ব্যবহৃত হয়।'
          },
          keigoTransformation: {
            plainForm: `${k.kanji}を見る`,
            teineigo: `${k.kanji}を見ます`,
            sonkeigo: `${k.kanji}をご覧になります`,
            kenjougo: `${k.kanji}を拝見します`
          },
          nativeListening: {
            audioTranscriptJa: `A: 日本語の漢字は何文字覚えましたか？ B: 今はN5の漢字を100字覚えました。`,
            speakerA: '田中マネージャー',
            speakerB: 'タンビルさん',
            questionBn: 'তানভির সাহেব কয়টি কাঞ্জি শিখেছেন?',
            answerBn: '১০০টি N5 মৌলিক কাঞ্জি।'
          },
          culturalContext: {
            tokyoLifeInsight: 'জাপানে ক্যালেন্ডার ও মেট্রো স্টেশনে তারিখ ও বার চিহ্নিত করতে কাঞ্জি অপরিহার্য।',
            etiquetteRuleBn: 'সরকারি ফর্ম ও ব্যাংকে কাঞ্জি লেখার সময় স্ট্রোকের ক্রম সঠিক রাখা আবশ্যক।',
            banglaNuanceComparison: 'বাংলায় যেমন যুক্তাক্ষর আছে, জাপানিতে তেমনি কাঞ্জির রেডিক্যাল জোড়া লেগে নতুন শব্দ হয়।'
          },
          kanjiDecomposition: {
            radical: k.radical,
            radicalMeaning: k.radicalMeaning,
            strokeCount: k.strokes,
            strokeHint: '1: 縦線 ➔ 2: 横折れ ➔ 3: 中の横 ➔ 4: 下の横で閉じる'
          },
          sentenceScramble: {
            shuffledTiles: ['にほんごの', 'べんきょうを', 'まいにち', 'します'],
            correctOrder: ['まいにち', 'にほんごの', 'べんきょうを', 'します'],
            fullSentenceJa: '毎日 日本語の 勉強を します。',
            translationBn: 'আমি প্রতিদিন জাপানি ভাষা চর্চা করি।'
          },
          collocationMatch: {
            targetWord: k.kanji,
            naturalPair: '日本 (にほん)',
            meaningBn: 'জাপান দেশ',
            unnaturalPairWarning: '日本 (ひぼん - incorrect)'
          },
          errorSpotter: {
            flawedSentenceJa: 'きょうは にちようび でした。',
            correctedSentenceJa: 'きょうは にちようび です。',
            errorReasonBn: 'বর্তমান দিনের বর্ণনায় でした (অতীত) না বসে です (বর্তমান) বসবে।'
          }
        }
      };
    }

    if (isGrammar) {
      const g = (obj as GrammarObject) || {
        id: 'ko-n5-gr-001',
        pattern: 'N1 は N2 です',
        formula: '[Noun 1] + は + [Noun 2] + です',
        level: 'N5',
        trilingual: {
          ja: { text: 'N1 は N2 です', furigana: 'N1 は N2 です', romaji: 'N1 wa N2 desu', explanationJa: '主題を表す助詞「は」と丁寧な断定「です」。' },
          en: { meaning: 'N1 is N2', explanationEn: 'Topic marker + polite copula.' },
          bn: { meaning: 'N1 হলো N2 (বিষয় নির্দেশক は ও সমাপ্তি です)', explanationBn: 'হলো বা হয় অর্থে বাক্যের বিষয় নির্দেশ করতে は ও です ব্যবহৃত হয়।' }
        },
        exampleSentences: [
          { ja: 'わたしは がくせいです。', furigana: 'わたしは [学生|がくせい]です。', romaji: 'Watashi wa gakusei desu.', en: 'I am a student.', bn: 'আমি একজন ছাত্র।' }
        ]
      };

      return {
        objectId: g.id,
        title: g.pattern,
        titleJa: g.trilingual.ja.text,
        level: g.level,
        domain: 'GRAMMAR',
        formats: {
          microLesson: {
            formula: g.formula,
            explanationBn: g.trilingual.bn.explanationBn,
            tipJa: `「は」は助詞のとき「わ(wa)」と発音します。標準東京アクセントを意識しましょう。`,
            mnemonicBn: `বিষয় পরিচয় করিয়ে দিতে কাঁধে は (ওয়া) কণা বসান, আর সম্মানের সাথে です দিয়ে সমাপ্ত করুন।`
          },
          mcqQuiz: {
            question: `わたし [___] がくせいです。(বাক্যের বিষয় নির্দেশক সঠিক কণা কোনটি?)`,
            options: [
              { id: '1', textJa: 'は (wa)', textBn: 'বিষয় নির্দেশক কণা (সঠিক)', isCorrect: true },
              { id: '2', textJa: 'を (wo)', textBn: 'কর্ম নির্দেশক কণা', isCorrect: false },
              { id: '3', textJa: 'で (de)', textBn: 'মাধ্যম নির্দেশক কণা', isCorrect: false }
            ],
            explanationBn: g.trilingual.bn.explanationBn
          },
          flashcard: {
            front: g.pattern,
            back: `${g.trilingual.bn.meaning}`,
            furigana: g.trilingual.ja.furigana,
            audioPhrase: g.exampleSentences[0]?.ja || g.pattern
          },
          baitoScenario: {
            situationBn: 'টোকিওর রেস্টুরেন্টে খদ্দেরকে স্বাগত জানানোর সময়',
            customerDialogueJa: 'すみません、2人です。',
            correctStaffResponseJa: 'いらっしゃいませ！2名様ですね。こちらのお席へどうぞ。',
            keigoNotesBn: 'মার্জিতভাবে সংখ্যা প্রকাশ করতে「名様」(めいさま) ব্যবহার করা হয়।'
          },
          shadowingDrill: {
            sentenceJa: g.exampleSentences[0]?.ja || 'わたしは がくせいです。',
            romaji: g.exampleSentences[0]?.romaji || 'Watashi wa gakusei desu.',
            targetPitch: 'Heiban (平板型) Tokyo Native',
            speed: 1.0
          },
          fillInBlank: {
            sentenceTemplate: '田中さん [___] 先生です。',
            correctAnswer: 'は',
            hintBn: 'বিষয় নির্দেশক কণা বসান'
          },
          speedRecognition: {
            timeLimitSec: 5,
            targetWord: g.pattern,
            distractors: ['〜じゃありません', '〜でした', '〜ませんか', '〜てください']
          },
          particleDiscrimination: {
            sentenceWithBlank: 'わたし [___] ダッカ大学の 学生です。',
            correctParticle: 'は',
            wrongParticle: 'が',
            whyCorrectBn: 'সাধারণ আত্মপরিচয়ে বা সাধারণ তথ্যে মূল বিষয় বোঝাতে は ব্যবহৃত হয়, が নয়।'
          },
          keigoTransformation: {
            plainForm: '学生だ (Gakusei da)',
            teineigo: '学生です (Gakusei desu)',
            sonkeigo: '学生でいらっしゃいます (Gakusei de irasshaimasu)',
            kenjougo: '学生でございます (Gakusei de gozaimasu)'
          },
          nativeListening: {
            audioTranscriptJa: 'A: お名前は何ですか？ B: わたしは タンビルです。バングラデシュから 来ました。',
            speakerA: '店長',
            speakerB: '留学生',
            questionBn: 'বক্তা B কোথা থেকে এসেছেন?',
            answerBn: 'বাংলাদেশ থেকে।'
          },
          culturalContext: {
            tokyoLifeInsight: 'জাপানে নতুন কারো সাথে পরিচয়ের সময় বিনম্রভাবে は এবং です ব্যবহার করে নিজের নাম বলা হয়।',
            etiquetteRuleBn: 'কথা বলার সময় দৃষ্টি ও বডি ল্যাঙ্গুয়েজ মার্জিত রাখা জাপানি আদব-কায়দার অঙ্গ।',
            banglaNuanceComparison: 'বাংলায় যেমন "আমি হই ছাত্র" না বলে সরাসরি "আমি ছাত্র" বলি, জাপানিতে তেমনই "わたしは学生です" বলা হয়।'
          },
          kanjiDecomposition: {
            radical: '亻 (にんべん - Person)',
            radicalMeaning: 'মানুষ বা ব্যক্তিত্ব',
            strokeCount: 5,
            strokeHint: 'বাম থেকে ডানে ব্যক্তি নির্দেশক চিহ্ন'
          },
          sentenceScramble: {
            shuffledTiles: ['がくせい', 'わたしは', 'です'],
            correctOrder: ['わたしは', 'がくせい', 'です'],
            fullSentenceJa: 'わたしは がくせいです。',
            translationBn: 'আমি একজন ছাত্র।'
          },
          collocationMatch: {
            targetWord: '〜は〜です',
            naturalPair: '〜じゃありません (না-বোধক)',
            meaningBn: 'মার্জিত না-বোধক রূপ',
            unnaturalPairWarning: '〜はない (Informal plain)'
          },
          errorSpotter: {
            flawedSentenceJa: 'わたし が がくせいです。(When introducing casually)',
            correctedSentenceJa: 'わたし は がくせいです。',
            errorReasonBn: 'স্বাভাবিক পরিচয়ে が না বসে বিষয় নির্দেশক は বসবে।'
          }
        }
      };
    }

    // Default Vocabulary
    const v = obj as VocabularyObject;
    return {
      objectId: v.id,
      title: v.word,
      titleJa: v.trilingual.ja.text,
      level: v.level,
      domain: 'VOCABULARY',
      formats: {
        microLesson: {
          formula: `${v.word} [${v.reading}]`,
          explanationBn: v.trilingual.bn.explanationBn,
          tipJa: `語彙のアクセントを意識しましょう。`,
          mnemonicBn: `শব্দটির কাঞ্জি ও অর্থ একসাথে মনে রাখুন।`
        },
        mcqQuiz: {
          question: `「${v.word}」শব্দটির অর্থ কী?`,
          options: [
            { id: '1', textJa: v.reading, textBn: v.trilingual.bn.meaning, isCorrect: true },
            { id: '2', textJa: 'ちがう', textBn: 'ভুল অর্থ', isCorrect: false },
            { id: '3', textJa: 'べつ', textBn: 'অন্য অর্থ', isCorrect: false }
          ],
          explanationBn: v.trilingual.bn.explanationBn
        },
        flashcard: {
          front: v.word,
          back: v.trilingual.bn.meaning,
          furigana: v.reading,
          audioPhrase: v.word
        },
        baitoScenario: {
          situationBn: 'কর্মক্ষেত্রে শব্দটি ব্যবহারের সঠিক নিয়ম',
          customerDialogueJa: 'これをください。',
          correctStaffResponseJa: 'ありがとうございます。',
          keigoNotesBn: 'দৈনন্দিন জাপানি ভদ্রতা'
        },
        shadowingDrill: {
          sentenceJa: `これは ${v.word} です。`,
          romaji: `Kore wa ${v.reading} desu.`,
          targetPitch: 'Tokyo Standard Tone',
          speed: 1.0
        },
        fillInBlank: {
          sentenceTemplate: `これは [___] です。`,
          correctAnswer: v.word,
          hintBn: v.trilingual.bn.meaning
        },
        speedRecognition: {
          timeLimitSec: 4,
          targetWord: v.word,
          distractors: ['本', '机', 'ペン', '椅子']
        },
        particleDiscrimination: {
          sentenceWithBlank: `${v.word} [___] あります。`,
          correctParticle: 'が',
          wrongParticle: 'を',
          whyCorrectBn: 'থাকা (あります) ক্রিয়ার আগে が বসে।'
        },
        keigoTransformation: {
          plainForm: v.word,
          teineigo: `お${v.word}`,
          sonkeigo: `ご${v.word}`,
          kenjougo: v.word
        },
        nativeListening: {
          audioTranscriptJa: `A: これは誰の${v.word}ですか？ B: わたしの${v.word}です。`,
          speakerA: '先生',
          speakerB: '学生',
          questionBn: 'জিনিসটি কার?',
          answerBn: 'ছাত্রের।'
        },
        culturalContext: {
          tokyoLifeInsight: 'টোকিওর দৈনন্দিন জীবনে শব্দটি ব্যবহৃত হয়।',
          etiquetteRuleBn: 'মার্জিত শব্দের সাথে お উপসর্গ যোগ হয়।',
          banglaNuanceComparison: 'প্রচলিত বাংলা রূপান্তর।'
        },
        kanjiDecomposition: {
          radical: '木',
          radicalMeaning: 'গাছ',
          strokeCount: 4,
          strokeHint: 'মৌলিক কাঞ্জি'
        },
        sentenceScramble: {
          shuffledTiles: ['です', v.word, 'これは'],
          correctOrder: ['これは', v.word, 'です'],
          fullSentenceJa: `これは ${v.word} です。`,
          translationBn: `এটি ${v.trilingual.bn.meaning}।`
        },
        collocationMatch: {
          targetWord: v.word,
          naturalPair: '〜を使う',
          meaningBn: 'ব্যবহার করা',
          unnaturalPairWarning: 'ভুল ব্যবহার'
        },
        errorSpotter: {
          flawedSentenceJa: `これは ${v.word} だ。 (To teacher)`,
          correctedSentenceJa: `これは ${v.word} です。`,
          errorReasonBn: 'শিক্ষকের সাথে মার্জিত です বলতে হবে।'
        }
      }
    };
  }
};
