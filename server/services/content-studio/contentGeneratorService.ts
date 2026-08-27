import {
  StudioLesson,
  LessonCurriculumMap,
  LessonIntroduction,
  StudioVocabItem,
  StudioGrammarPoint,
  StudioKanjiItem,
  StudioExpressionItem,
  StudioSentencePattern,
  StudioDialogue,
  StudioReadingPassage,
  StudioListeningActivity,
  StudioSpeakingActivity,
  StudioWritingActivity,
  StudioExerciseItem,
  StudioQuizQuestion,
  StudioAssessment,
  StudioAITutorContext
} from '../../../src/core/content-studio/types.js';

export class ContentGeneratorService {
  static async generateCompleteLessonContent(
    lesson: StudioLesson,
    curriculumMap: LessonCurriculumMap
  ): Promise<{
    introduction: LessonIntroduction;
    vocabulary: StudioVocabItem[];
    grammar: StudioGrammarPoint[];
    kanji: StudioKanjiItem[];
    expressions: StudioExpressionItem[];
    sentencePatterns: StudioSentencePattern[];
    dialogue: StudioDialogue;
    reading: StudioReadingPassage;
    listening: StudioListeningActivity;
    speaking: StudioSpeakingActivity;
    writing: StudioWritingActivity;
    exercises: StudioExerciseItem[];
    quiz: StudioQuizQuestion[];
    assessment: StudioAssessment;
    aiTutorContext: StudioAITutorContext;
  }> {
    const num = lesson.lessonNumber;
    const formattedNum = num < 10 ? `0${num}` : `${num}`;
    const prefix = `${lesson.level}-L${formattedNum}`;

    const introduction: LessonIntroduction = {
      overviewEn: `Master core communicative goals for Lesson ${num}, focusing on natural Japanese sentence architecture and polite social speech.`,
      overviewBn: `লেসন ${num}-এ আপনি শিখবেন বাস্তবভিত্তিক জাপানি বাক্যের গঠন ও ব্যাকরণগত মার্কারের সঠিক প্রয়োগ, যা আপনাকে জাপানে সাবলীল যোগাযোগের উপযোগী করে তুলবে।`,
      overviewJa: `第${num}課では、自然な日本語の文型と丁寧な日常会話の習得を目指します。`,
      canDoObjectives: curriculumMap.objectives.map((o) => o.canDoStatementBn),
      prerequisites: [`JLPT ${lesson.level} পূর্ববর্তী পাঠ্যক্রম`],
      culturalNoteBn: `জাপানি সমাজ ও কর্মক্ষেত্রে নম্রতা (Reigi) এবং বিনম্র ভাষার ভূমিকা অপরিসীম।`
    };

    const vocabulary: StudioVocabItem[] = [
      {
        id: `${prefix}-V001`,
        japanese: 'これ',
        furigana: 'これ',
        romaji: 'kore',
        english: 'This (thing near speaker)',
        bengali: 'এইটি / এটা (বক্তার কাছের বস্তু)',
        partOfSpeech: 'Demonstrative Pronoun',
        exampleSentenceJa: 'これは ほんです。',
        exampleSentenceEn: 'This is a book.',
        exampleSentenceBn: 'এটা একটি বই।'
      },
      {
        id: `${prefix}-V002`,
        japanese: 'それ',
        furigana: 'それ',
        romaji: 'sore',
        english: 'That (thing near listener)',
        bengali: 'ওটা (শ্রোতার কাছের বস্তু)',
        partOfSpeech: 'Demonstrative Pronoun',
        exampleSentenceJa: 'それは じしょです。',
        exampleSentenceEn: 'That is a dictionary.',
        exampleSentenceBn: 'ওটা একটি অভিধান।'
      },
      {
        id: `${prefix}-V003`,
        japanese: 'あれ',
        furigana: 'あれ',
        romaji: 'are',
        english: 'That over there (far from both)',
        bengali: 'ঐ দূরবর্তী বস্তুটা (উভয়ের থেকেই দূরে)',
        partOfSpeech: 'Demonstrative Pronoun',
        exampleSentenceJa: 'あれは くるまです。',
        exampleSentenceEn: 'That over there is a car.',
        exampleSentenceBn: 'ঐ দূরের জিনিসটা একটি গাড়ি।'
      },
      {
        id: `${prefix}-V004`,
        japanese: 'ほん',
        furigana: 'ほん',
        romaji: 'hon',
        english: 'Book',
        bengali: 'বই / পুস্তক',
        partOfSpeech: 'Noun',
        exampleSentenceJa: 'にほんごの ほんです。',
        exampleSentenceEn: 'It is a Japanese book.',
        exampleSentenceBn: 'এটি জাপানি ভাষার বই।'
      }
    ];

    const grammar: StudioGrammarPoint[] = [
      {
        id: `${prefix}-G001`,
        pattern: 'これ / それ / あれ は N です',
        structureFormula: '[Demonstrative] + は + [Noun] + です',
        meaningEn: 'This / That is [Noun]',
        meaningBn: 'এটা / ওটা হলো [বিশেষ্য]',
        detailedExplanationBn: 'কাছের বস্তুর ক্ষেত্রে "これ" (kore), শ্রোতার কাছের বস্তুর জন্য "それ" (sore), এবং দুজনের থেকেই দূরে অবস্থিত বস্তুর ক্ষেত্রে "あれ" (are) ব্যবহৃত হয়।',
        formationRules: [
          'দূরত্ব অনুযায়ী kore, sore, are নির্বাচন করুন।',
          'টপিক মার্কার は যোগ করুন এবং শেষে です বসান।'
        ],
        commonMistakesBn: [
          'ভুল: これほん は... ➔ শুদ্ধ: このほん は... (これ-র পর সরাসরি বিশেষ্য বসে না, この বসে)।'
        ],
        nihomiSenseiTipsBn: 'মনে রাখার সহজ ট্রিক: কো (কাছে), সো (শ্রোতার কাছে), আ (উভয় থেকে দূরে)।',
        examples: [
          { japanese: 'これは なんですか。', english: 'What is this?', bengali: 'এটা কি?' },
          { japanese: 'それは わたしの かばんです。', english: 'That is my bag.', bengali: 'ওটা আমার ব্যাগ।' }
        ]
      }
    ];

    const kanji: StudioKanjiItem[] = [
      {
        id: `${prefix}-K001`,
        kanji: '本',
        onyomi: ['ホン'],
        kunyomi: ['もと'],
        strokeCount: 5,
        radical: '木 (tree)',
        meaningEn: 'Book / Origin / Real',
        meaningBn: 'বই / মূল / বাস্তব',
        mnemonicBn: 'গাছের (木) গোড়ায় দাগ দিয়ে মূল বা বই তৈরির উপাদান বোঝানো হয়েছে।',
        compounds: [
          { word: '日本語 (にほんご)', reading: 'nihongo', meaningBn: 'জাপানি ভাষা' },
          { word: '本日 (ほんじつ)', reading: 'honjitsu', meaningBn: 'আজকের দিন (ফর্মাল)' }
        ]
      }
    ];

    const expressions: StudioExpressionItem[] = [
      {
        id: `${prefix}-E001`,
        phrase: 'そうですか',
        reading: 'sou desu ka',
        meaningEn: 'Is that so? / I see.',
        meaningBn: 'তাই নাকি? / বুঝেছি।',
        contextSituation: 'Acknowledging new information in conversation',
        politenessLevel: 'POLITE',
        nuanceExplanationBn: 'কথা শোনার পর সম্মতি বা মনোযোগ প্রকাশের জন্য অত্যন্ত জরুরি একটি বাক্যাংশ।'
      }
    ];

    const sentencePatterns: StudioSentencePattern[] = [
      {
        id: `${prefix}-P001`,
        step: 'UNDERSTAND',
        titleBn: 'ধাপ ১: নির্দেশক সর্বনাম চেনা',
        promptJa: 'これ［　］わたしの ほんです。',
        correctAnswer: 'は',
        explanationBn: 'টপিক নির্দেশক は বসবে।'
      },
      {
        id: `${prefix}-P002`,
        step: 'RECOGNIZE',
        titleBn: 'ধাপ ২: দূরত্বের অবস্থান নির্ণয়',
        promptJa: 'বক্তার একদম কাছের বস্তুকে কী বলে?',
        correctAnswer: 'これ',
        explanationBn: 'বক্তার নিজস্ব সীমায় থাকা বস্তুর ক্ষেত্রে "これ" বসে।'
      },
      {
        id: `${prefix}-P003`,
        step: 'COMPLETE',
        titleBn: 'ধাপ ৩: প্রশ্ন গঠন',
        promptJa: 'それは なんです［　］。',
        correctAnswer: 'か',
        explanationBn: 'প্রশ্ন করতে বাক্যের শেষে "か" যোগ করুন।'
      },
      {
        id: `${prefix}-P004`,
        step: 'BUILD',
        titleBn: 'ধাপ ৪: পূর্ণ বাক্য নির্মাণ',
        promptJa: 'あれ ＋ くるま ＋ です',
        correctAnswer: 'あれは くるまです。',
        explanationBn: 'あれ + は + くるま + です।'
      },
      {
        id: `${prefix}-P005`,
        step: 'USE',
        titleBn: 'ধাপ ৫: সংলাপ প্রয়োগ',
        promptJa: 'A: これは なんですか。 B: ［　］は ペンです。',
        correctAnswer: 'それ',
        explanationBn: 'প্রশ্নকর্তা "これ" বললে উত্তরদাতা তাঁর দৃষ্টিকোণ থেকে "それ" বলবেন।'
      }
    ];

    const dialogue: StudioDialogue = {
      scenarioTitleBn: 'টোকিও স্টেশনারি শপে কথোপকথন',
      location: 'Tokyo Maruzen Stationery Store',
      participants: ['Student', 'Clerk'],
      lines: [
        {
          speaker: 'Student',
          speakerRole: 'Customer',
          japanese: 'すみません。これは なんですか。',
          romaji: 'Sumimasen. Kore wa nan desu ka.',
          english: 'Excuse me. What is this?',
          bengali: 'মাফ করবেন। এটা কি?'
        },
        {
          speaker: 'Clerk',
          speakerRole: 'Shop Staff',
          japanese: 'それは にほんの てちょうです。どうぞ。',
          romaji: 'Sore wa nihon no techou desu. Douzo.',
          english: 'That is a Japanese daily planner. Here you go.',
          bengali: 'ওটা জাপানের একটি পকেট ডায়েরি। নিন।'
        }
      ],
      comprehensionQuestions: [
        {
          questionBn: 'দোকানের কর্মচারী কোন বস্তুটি দেখিয়েছেন?',
          options: ['পকেট ডায়েরি', 'পেন্সিল', 'কম্পিউটার', 'গাড়ি'],
          correctIndex: 0,
          explanationBn: 'কর্মচারী বলেছেন "にほんの てちょう" (জাপানি ডায়েরি)।'
        }
      ]
    };

    const reading: StudioReadingPassage = {
      titleJa: 'きょうしつの もの',
      titleBn: 'ক্লাসরুমের জিনিসপত্র',
      passageTextJa: 'これは わたしの きょうしつです。これは つくえです。それは せんせいの つくえです。あれは ホワイトボードです。きょうしつは ひろいです。',
      passageTextBn: 'এটি আমার শ্রেণীকক্ষ। এটি একটি পড়ার টেবিল। ওটি শিক্ষকের টেবিল। ঐ দূরের জিনিসটি হোয়াইটবোর্ড। শ্রেণীকক্ষটি প্রশস্ত।',
      glossary: [
        { word: 'つくえ', reading: 'tsukue', meaningBn: 'টেবিল / ডেস্ক' },
        { word: 'ひろい', reading: 'hiroi', meaningBn: 'প্রশস্ত / বড়' }
      ],
      questions: [
        {
          questionJa: 'あれは なんですか。',
          questionBn: 'ঐ দূরের জিনিসটি কী?',
          options: ['ホワイトボード', 'つくえ', 'ほん', 'かばん'],
          correctIndex: 0,
          explanationBn: 'প্যাসেজে বলা হয়েছে "あれは ホワイトボードです"।'
        }
      ]
    };

    const listening: StudioListeningActivity = {
      audioScenarioBn: 'কাউন্টার ডেস্কে জিনিসপত্র যাচাই',
      transcriptJa: 'A: それは あなたの かぎですか。 B: はい、これは わたしの かぎです。ありがとうございます。',
      transcriptBn: 'এ: ওটা কি আপনার চাবি? বি: হ্যাঁ, এটা আমার চাবি। আপনাকে ধন্যবাদ।',
      ttsVoiceType: 'NATURAL_CONVERSATION',
      audioDurationSeconds: 30,
      questions: [
        {
          questionBn: 'বি-ব্যক্তির হারানো বস্তুটি কী ছিল?',
          options: ['চাবি (かぎ)', 'বই (ほん)', 'ব্যাগ (かばん)', 'ঘড়ি (とけい)'],
          correctIndex: 0
        }
      ]
    };

    const speaking: StudioSpeakingActivity = {
      targetPhraseJa: 'これは なんですか。',
      romaji: 'Kore wa nan desu ka.',
      meaningBn: 'এটা কি?',
      pitchAccentPattern: 'Flat Tokyo Standard Accent',
      clarityTargetScore: 85,
      drills: [
        {
          promptBn: 'জিজ্ঞেস করুন: "ওটা কি অভিধান?"',
          expectedResponseJa: 'それは じしょですか。',
          hintBn: 'Sore wa jisho desu ka?'
        }
      ]
    };

    const writing: StudioWritingActivity = {
      promptBn: 'আপনার টেবিলের ২টি জিনিস (যেমন বই ও পেন) নির্দেশ করে ২টি জাপানি বাক্য লিখুন।',
      taskType: 'SENTENCE_COMPLETION',
      rubricCriteriaBn: [
        'これ এবং それ এর সঠিক ব্যবহার',
        'টপিক মার্কার は এর নির্ভুলতা'
      ],
      modelAnswerJa: 'これは ほんです。それは ペンです。',
      modelAnswerBn: 'এটা বই। ওটা পেন।'
    };

    const exercises: StudioExerciseItem[] = [
      {
        id: `${prefix}-EX01`,
        exerciseType: 'MCQ',
        questionJa: 'বক্তার কাছের বস্তুর ক্ষেত্রে কোনটি বসে?',
        questionBn: 'সঠিক নির্দেশক নির্বাচন করুন:',
        options: ['これ', 'それ', 'あれ', 'どれ'],
        correctAnswer: 'これ',
        explanationBn: 'বক্তার নিজের কাছের বস্তুর জন্য "これ" বসে।'
      },
      {
        id: `${prefix}-EX02`,
        exerciseType: 'FILL_IN_BLANK',
        questionJa: 'あれ［　］くるまです。',
        questionBn: 'শূন্যস্থানে সঠিক পার্টিকেল দিন:',
        options: ['は', 'も', 'の', 'か'],
        correctAnswer: 'は',
        explanationBn: 'টপিক পার্টিকেল は।'
      }
    ];

    const quiz: StudioQuizQuestion[] = [
      {
        id: `${prefix}-Q01`,
        questionJa: '「これ」 এর বাংলা অর্থ কী?',
        questionBn: 'সঠিক অর্থ নির্বাচন করুন:',
        type: 'SINGLE_CHOICE',
        options: ['এটা (কাছের)', 'ওটা (দূরের)', 'কোনটা', 'সেটা'],
        correctIndex: 0,
        explanationBn: 'これ মানে বক্তার কাছের জিনিস।',
        points: 10
      },
      {
        id: `${prefix}-Q02`,
        questionJa: '「本」 কাঞ্জিটির অর্থ কী?',
        questionBn: 'কাঞ্জি অর্থ:',
        type: 'SINGLE_CHOICE',
        options: ['বই', 'গাছ', 'মানুষ', 'দিন'],
        correctIndex: 0,
        explanationBn: '本 মানে বই।',
        points: 10
      }
    ];

    const assessment: StudioAssessment = {
      passingScorePercent: 80,
      totalTimeMinutes: 15,
      retakeCooldownHours: 2,
      revisionRulesBn: [
        '৮০% এর কম পেলে kore/sore/are দূরত্ব চার্ট পুনরায় রিভিউ করুন।'
      ],
      masteryFeedbackBn: {
        passed: 'চমৎকার! আপনি সফলভাবে অধ্যায়টি শেষ করেছেন।',
        failed: 'পুনরায় চেষ্টা করুন: নির্দেশক সর্বনামের দূরত্ব টেবিলটি আরেকবার দেখে নিন।'
      }
    };

    const aiTutorContext: StudioAITutorContext = {
      allowedGrammarScope: ['kore/sore/are wa N desu', 'kono/sono/ano N', 'nan desu ka'],
      restrictedPatterns: ['advanced te-forms', 'passive/causative'],
      pedagogicalPersonaPrompt: 'You are Nihomi Sensei. Explain Lesson ' + num + ' in warm Bengali.',
      commonStudentStrugglesBn: ['kore vs kono বিভ্রান্তি'],
      suggestedPromptsBn: ['kore এবং kono-এর মধ্যে পার্থক্য কী?']
    };

    return {
      introduction,
      vocabulary,
      grammar,
      kanji,
      expressions,
      sentencePatterns,
      dialogue,
      reading,
      listening,
      speaking,
      writing,
      exercises,
      quiz,
      assessment,
      aiTutorContext
    };
  }
}
