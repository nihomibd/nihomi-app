// Module 1: Identity & Pointers (Lessons 06 - 10)
module.exports = [
  // --- LESSON 06: わたしは学生です ---
  {
    lesson_metadata: {
      lesson_id: "L06",
      lesson_number: 6,
      module_number: 1,
      module_name: "Identity & Pointers",
      module_name_bn: "পরিচয় ও নির্দেশক",
      title_ja: "私[わたし]は学生[がくせい]です",
      title_en: "N1 wa N2 desu (Identity & Polite Copula)",
      title_bn: "আমি একজন শিক্ষার্থী (আত্মপরিচয় ও বিনম্র সমাপ্তি)",
      estimated_minutes: 25,
      difficulty: "Beginner"
    },
    bengali_bridge: {
      explanation_bn: "বাংলায় সাধারণত আমরা বলি 'আমি ছাত্র' (এখানে 'হই' ক্রিয়াটি উহ্য থাকে)। কিন্তু জাপানি ভাষায় বাক্যের শেষে সম্মানসূচক সমাপ্তিসূচক ক্রিয়া です (desu) যোগ করা বাধ্যতামূলক। বাক্যের মূল বিষয় নির্দেশ করতে は (wa) পার্টিকেল ব্যবহৃত হয়। গঠন: N1 は N2 です।",
      core_concept_bn: "জাপানি বাক্যরীতি (SOV), বিষয় নির্দেশক は (wa), বিনম্র সমাপ্তি です এবং না-বোধক じゃありません।",
      real_world_context_bn: "জাপানে পৌঁছানোর পর ইমিগ্রেশন, ভাষা স্কুল বা পার্টটাইম জবের প্রথম দিনে নিজের পরিচয় ও পেশা তুলে ধরা।",
      key_takeaway_bn: "পার্টিকেল হিসেবে は এর উচ্চারণ 'হা' না হয়ে 'ওয়া' হয়।"
    },
    vocabulary_scope: [
      {
        word_ja: "私[わたし]",
        romaji: "watashi",
        meaning_bn: "আমি",
        meaning_en: "I / me",
        part_of_speech: "pronoun",
        example_ja: "私[わたし]はタニムです。",
        example_bn: "আমি তানিম।",
        example_en: "I am Tanim."
      },
      {
        word_ja: "あなた",
        romaji: "anata",
        meaning_bn: "আপনি / তুমি",
        meaning_en: "you",
        part_of_speech: "pronoun",
        example_ja: "あなたは学生[がくせい]ですか。",
        example_bn: "আপনি কি শিক্ষার্থী?",
        example_en: "Are you a student?"
      },
      {
        word_ja: "学生[がくせい]",
        romaji: "gakusei",
        meaning_bn: "শিক্ষার্থী / ছাত্র",
        meaning_en: "student",
        part_of_speech: "noun",
        example_ja: "私[わたし]は日本語[にほんご]の学生[がくせい]です。",
        example_bn: "আমি জাপানি ভাষার শিক্ষার্থী।",
        example_en: "I am a Japanese language student."
      },
      {
        word_ja: "先生[せんせい]",
        romaji: "sensei",
        meaning_bn: "শিক্ষক / ওস্তাদ",
        meaning_en: "teacher / doctor",
        part_of_speech: "noun",
        example_ja: "田中[たなか]さんは先生[せんせい]です。",
        example_bn: "তানাকা সাহেব একজন শিক্ষক।",
        example_en: "Mr. Tanaka is a teacher."
      },
      {
        word_ja: "会社員[かいしゃいん]",
        romaji: "kaishain",
        meaning_bn: "কোম্পানির চাকরিজীবী",
        meaning_en: "company employee",
        part_of_speech: "noun",
        example_ja: "父[ちち]は会社員[かいしゃいん]です。",
        example_bn: "আমার বাবা কোম্পানির চাকরিজীবী।",
        example_en: "My father is a company employee."
      },
      {
        word_ja: "日本人[にほんじん]",
        romaji: "nihonjin",
        meaning_bn: "জাপানি ব্যক্তি",
        meaning_en: "Japanese person",
        part_of_speech: "noun",
        example_ja: "山田[やまだ]さんは日本人[にほんじん]です。",
        example_bn: "ইয়ামাদা সাহেব জাপানি ব্যক্তি।",
        example_en: "Mr. Yamada is Japanese."
      }
    ],
    kanji_scope: [
      {
        kanji: "人",
        onyomi: "ジン, ニン",
        kunyomi: "ひと",
        meaning_bn: "ব্যক্তি / মানুষ",
        meaning_en: "person",
        stroke_count: 2,
        compounds: [
          { word_ja: "日本人[にほんじん]", meaning_bn: "জাপানি ব্যক্তি", meaning_en: "Japanese person" },
          { word_ja: "三人[さんにん]", meaning_bn: "তিনজন মানুষ", meaning_en: "three people" },
          { word_ja: "大人[おとな]", meaning_bn: "প্রাপ্তবয়স্ক", meaning_en: "adult" }
        ]
      },
      {
        kanji: "学",
        onyomi: "ガク",
        kunyomi: "まな・ぶ",
        meaning_bn: "শিক্ষা / শেখা",
        meaning_en: "study / learn",
        stroke_count: 8,
        compounds: [
          { word_ja: "学生[がくせい]", meaning_bn: "শিক্ষার্থী", meaning_en: "student" },
          { word_ja: "大学[だいがく]", meaning_bn: "বিশ্ববিদ্যালয়", meaning_en: "university" },
          { word_ja: "学校[がっこう]", meaning_bn: "বিদ্যালয়", meaning_en: "school" }
        ]
      },
      {
        kanji: "生",
        onyomi: "セイ, ショウ",
        kunyomi: "い・きる, う・まれる",
        meaning_bn: "জীবন / জন্ম",
        meaning_en: "life / birth",
        stroke_count: 5,
        compounds: [
          { word_ja: "先生[せんせい]", meaning_bn: "শিক্ষক", meaning_en: "teacher" },
          { word_ja: "留学生[りゅうがくせい]", meaning_bn: "আন্তর্জাতিক শিক্ষার্থী", meaning_en: "foreign student" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G06-1",
        pattern_ja: "N1 は N2 です",
        pattern_bn: "N1 হলো N2 (বিষয় নির্দেশ ও পরিচয়)",
        explanation_bn: "N1 বাক্যের বিষয় (Topic), যা は পার্টিকেল দ্বারা চিহ্নিত হয়। N2 হলো তার পরিচয় বা বৈশিষ্ট্য এবং です হলো বিনম্র সমাপ্তিসূচক ক্রিয়া।",
        common_pitfalls: [
          "বাংলায় 'হয়' ক্রিয়া উহ্য রাখা গেলেও জাপানি বিনম্র কথনে です কখনো বাদ দেওয়া যায় না।",
          "は কে 'হা' উচ্চারণ করবেন না, সবসময় 'ওয়া' উচ্চারণ করুন।"
        ],
        examples: [
          {
            ja: "私[わたし]はバングラデシュ人[じん]です。",
            bn: "আমি বাংলাদেশি।",
            en: "I am Bangladeshi."
          },
          {
            ja: "マイクさんはエンジニアです。",
            bn: "মাইক সাহেব প্রকৌশলী।",
            en: "Mike is an engineer."
          }
        ]
      },
      {
        point_id: "G06-2",
        pattern_ja: "N1 は N2 じゃありません (ではありません)",
        pattern_bn: "N1, N2 নয় (না-বোধক পরিচয়)",
        explanation_bn: "です এর না-বোধক রূপ হলো じゃありません (কথ্য বিনম্র) অথবা ではありません (আনুষ্ঠানিক লিখিত রূপ)।",
        common_pitfalls: [
          "じゃありません এর স্থানে শুধু ありません বলা যাবে না; পুরো রূপটি ব্যবহার করতে হবে।"
        ],
        examples: [
          {
            ja: "私[わたし]は先生[せんせい]じゃありません。",
            bn: "আমি শিক্ষক নই।",
            en: "I am not a teacher."
          }
        ]
      },
      {
        point_id: "G06-3",
        pattern_ja: "S + か (疑問文[ぎもんぶん])",
        pattern_bn: "প্রশ্নবোধক বাক্য: বাক্যের শেষে か যোগ করা",
        explanation_bn: "যেকোনো জাপানি বাক্যের শেষে প্রশ্নবোধক অব্যয় か যোগ করলেই তা ভদ্রস্থ প্রশ্নে পরিণত হয়। প্রশ্নচিহ্ন (?) ব্যবহারের প্রয়োজন হয় না।",
        common_pitfalls: [
          "উত্তরে হ্যাঁ হলে はい (hai) এবং না হলে いいえ (iie) দিয়ে শুরু করতে হবে।"
        ],
        examples: [
          {
            ja: "あなたも学生[がくせい]ですか。",
            bn: "আপনিও কি শিক্ষার্থী?",
            en: "Are you also a student?"
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "টোকিওতে ভাষা স্কুলে প্রথম দিন নতুন সহপাঠীর সাথে প্রাথমিক পরিচয় বিনিময়।",
      situation_en: "First day self-introduction exchange with a classmate at a Tokyo language school.",
      lines: [
        {
          speaker_ja: "ラヒム[らひむ]",
          speaker_en: "Rahim",
          line_ja: "初[はじ]めまして。私[わたし]はラヒムです。バングラデシュから来[き]ました。",
          line_bn: "প্রথম দেখা হওয়ায় আনন্দিত। আমি রহিম। বাংলাদেশ থেকে এসেছি।",
          line_en: "Nice to meet you. I am Rahim. I came from Bangladesh."
        },
        {
          speaker_ja: "ケン[けん]",
          speaker_en: "Ken",
          line_ja: "初[はじ]めまして。ケンです。どうぞよろしくお願[ねが]いします。",
          line_bn: "আনন্দিত হলাম। আমি কেন। আপনার সদয় সহযোগিতা কামনা করছি।",
          line_en: "Nice to meet you. I am Ken. Pleased to meet you."
        },
        {
          speaker_ja: "ラヒム[らひむ]",
          speaker_en: "Rahim",
          line_ja: "ケンさんは学生[がくせい]ですか。",
          line_bn: "কেন সাহেব, আপনি কি শিক্ষার্থী?",
          line_en: "Ken-san, are you a student?"
        },
        {
          speaker_ja: "ケン[けん]",
          speaker_en: "Ken",
          line_ja: "いいえ、学生[がくせい]じゃありません。会社員[かいしゃいん]です。",
          line_bn: "না, আমি শিক্ষার্থী নই। কোম্পানির চাকরিজীবী।",
          line_en: "No, I am not a student. I am a company employee."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "প্রথম পরিচয়ে স্ব-পরিচয়ের সূচনা (初[はじ]めまして) ও সমাপ্তি (よろしく)",
      tip_bn: "জাপানি সংস্কৃতিতে স্ব-পরিচয়কে 自己紹介 (Jikoshoukai) বলে। এটি সবসময় 初めまして (Hajimemashite - প্রথমবারের মতো দেখছি) দিয়ে শুরু হয় এবং শেষে মাথা নিচু করে どうぞよろしくお願いします (Douzo yoroshiku onegaishimasu - আমার প্রতি অনুগ্রহ রাখবেন) বলে শেষ করতে হয়। এই দুটি বাক্য আয়ত্ত করলে জাপানিদের মনে গভীর শ্রদ্ধা তৈরি হয়।",
      category: "Manners"
    },
    typing_practice: [
      {
        prompt_ja: "私[わたし]は学生[がくせい]です",
        romaji_input: "watashi wa gakusei desu",
        target_display: "わたしはがくせいです",
        meaning_bn: "আমি একজন শিক্ষার্থী"
      },
      {
        prompt_ja: "先生[せんせい]じゃありません",
        romaji_input: "sensei jaarimasen",
        target_display: "せんせいじゃありません",
        meaning_bn: "শিক্ষক নই"
      },
      {
        prompt_ja: "日本人[にほんじん]ですか",
        romaji_input: "nihonjin desu ka",
        target_display: "にほんじんですか",
        meaning_bn: "জাপানি ব্যক্তি কি?"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L06-1",
        question_ja: "私[わたし]は 学生[がくせい]（　）。空欄[くうらん]に 入[はい]る 正[ただ]しい 言葉[ことば]は どれですか。",
        question_bn: "শূন্যস্থানে সঠিক শব্দ কোনটি বসবে: わたしは がくせい（　）",
        options: [
          "です",
          "ます",
          "でした",
          "ません"
        ],
        correct_index: 0,
        explanation_bn: "বিশেষ্যের (Noun) সাথে বর্তমানকালের বিনম্র সমাপ্তিসূচক ক্রিয়া হিসেবে 'です' বসে।"
      },
      {
        quiz_id: "Q-L06-2",
        question_ja: "「会社員[かいしゃいん]じゃありません」の 意味[いみ]は 何[なん]ですか。",
        question_bn: "‘かいしゃいんじゃありません’ এর সঠিক অর্থ কোনটি?",
        options: [
          "কোম্পানির কর্মচারী নই (Not a company employee)",
          "কোম্পানির কর্মচারী (A company employee)",
          "শিক্ষার্থী নই (Not a student)",
          "শিক্ষক নই (Not a teacher)"
        ],
        correct_index: 0,
        explanation_bn: "じゃありません হলো です এর না-বোধক রূপ। তাই 会社員じゃありません অর্থ কোম্পানির চাকরিজীবী নই।"
      }
    ]
  },

  // --- LESSON 07: だれの本ですか ---
  {
    lesson_metadata: {
      lesson_id: "L07",
      lesson_number: 7,
      module_number: 1,
      module_name: "Identity & Pointers",
      module_name_bn: "পরিচয় ও নির্দেশক",
      title_ja: "だれの本[ほん]ですか",
      title_en: "Particle NO (Possession & Attribution)",
      title_bn: "এটি কার বই? (মালিকানা ও সম্বন্ধ পদ)",
      estimated_minutes: 25,
      difficulty: "Beginner"
    },
    bengali_bridge: {
      explanation_bn: "জাপানি পার্টিকেল の (no) বাংলায় সম্বন্ধ পদ বা ষষ্ঠী বিভক্তি (র / এর) হিসেবে ব্যবহৃত হয়। যেমন: 'আমার' = 私[わたし]の, 'বাবার' = 父[ちち]の। এছাড়া কোনো বৃহৎ প্রতিষ্ঠানের অধীনস্থ শাখা বোঝাতেও の ব্যবহৃত হয় (যেমন: নিহোমি অ্যাপের শিক্ষক = ニホミの先生[せんせい])।",
      core_concept_bn: "মালিকানা, অন্তর্ভুক্তি এবং 'কার' (だれの) প্রশ্ন তৈরি করা।",
      real_world_context_bn: "হারিয়ে যাওয়া ব্যাগ বা চাবি কার তা জানা, বিজনেস কার্ড বিনিময় এবং প্রতিষ্ঠানের পরিচয় দেওয়া।",
      key_takeaway_bn: "বাংলায় যেমন অধিকারীর পর 'র' বসে, জাপানিতেও মালিক বা প্রতিষ্ঠানের পরে の বসে।"
    },
    vocabulary_scope: [
      {
        word_ja: "だれ",
        romaji: "dare",
        meaning_bn: "কে",
        meaning_en: "who",
        part_of_speech: "pronoun",
        example_ja: "あの方はだれですか。",
        example_bn: "ঐ ব্যক্তি কে?",
        example_en: "Who is that person over there?"
      },
      {
        word_ja: "本[ほん]",
        romaji: "hon",
        meaning_bn: "বই",
        meaning_en: "book",
        part_of_speech: "noun",
        example_ja: "これは日本語[にほんご]の本[ほん]です。",
        example_bn: "এটি জাপানি ভাষার বই।",
        example_en: "This is a Japanese book."
      },
      {
        word_ja: "辞書[じしょ]",
        romaji: "jisho",
        meaning_bn: "অভিধান / ডিকশনারি",
        meaning_en: "dictionary",
        part_of_speech: "noun",
        example_ja: "電子辞書[でんしじしょ]を使[つか]います。",
        example_bn: "ইলেকট্রনিক অভিধান ব্যবহার করি।",
        example_en: "I use an electronic dictionary."
      },
      {
        word_ja: "雑誌[ざっし]",
        romaji: "zasshi",
        meaning_bn: "ম্যাগাজিন / সাময়িকী",
        meaning_en: "magazine",
        part_of_speech: "noun",
        example_ja: "車[くるま]の雑誌[ざっし]を読[よ]みます。",
        example_bn: "গাড়ির ম্যাগাজিন পড়ি।",
        example_en: "I read a car magazine."
      },
      {
        word_ja: "鍵[かぎ]",
        romaji: "kagi",
        meaning_bn: "চাবি",
        meaning_en: "key",
        part_of_speech: "noun",
        example_ja: "部屋[へや]の鍵[かぎ]を失[な]くしました。",
        example_bn: "রুমের চাবি হারিয়ে ফেলেছি।",
        example_en: "I lost my room key."
      }
    ],
    kanji_scope: [
      {
        kanji: "本",
        onyomi: "ホン",
        kunyomi: "もと",
        meaning_bn: "বই / মূল",
        meaning_en: "book / origin",
        stroke_count: 5,
        compounds: [
          { word_ja: "日本[にほん]", meaning_bn: "জাপান", meaning_en: "Japan" },
          { word_ja: "日本語[にほんご]", meaning_bn: "জাপানি ভাষা", meaning_en: "Japanese language" },
          { word_ja: "本当[ほんとう]", meaning_bn: "সত্যি / বাস্তবিক", meaning_en: "truth / reality" }
        ]
      },
      {
        kanji: "日",
        onyomi: "ニチ, ジツ",
        kunyomi: "ひ, か",
        meaning_bn: "সূর্য / দিন",
        meaning_en: "sun / day",
        stroke_count: 4,
        compounds: [
          { word_ja: "日曜日[にちようび]", meaning_bn: "রবিবার", meaning_en: "Sunday" },
          { word_ja: "毎日[まいにち]", meaning_bn: "প্রতিদিন", meaning_en: "every day" },
          { word_ja: "今日[きょう]", meaning_bn: "আজ", meaning_en: "today" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G07-1",
        pattern_ja: "N1 の N2 (所有[しょゆう]・所属[しょぞく])",
        pattern_bn: "N1 এর N2 (মালিকানা ও সম্বন্ধ পদ)",
        explanation_bn: "N1 যদি ব্যক্তি হয়, তবে N2 হলো তার অধিকারভুক্ত বস্তু (যেমন: 私[わたし]の本[ほん] = আমার বই)। N1 যদি প্রতিষ্ঠান বা দেশ হয়, তবে N2 তার অংশ বা বৈশিষ্ট্য প্রকাশ করে।",
        common_pitfalls: [
          "ক্রম কখনো উল্টাবেন না। 'জাপানের গাড়ি' বলতে 日本[にほん]の車[くるま] বলতে হবে, 車の日本 বলা যাবে না।"
        ],
        examples: [
          {
            ja: "これは先生[せんせい]の辞書[じしょ]です。",
            bn: "এটি শিক্ষকের অভিধান।",
            en: "This is the teacher's dictionary."
          }
        ]
      },
      {
        point_id: "G07-2",
        pattern_ja: "だれの N ですか",
        pattern_bn: "এটি কার বস্তু? (মালিকানা জানার প্রশ্ন)",
        explanation_bn: "কার জিনিস তা জানতে だれの ব্যবহার করা হয়। উত্তরে সরাসরি [ব্যক্তি] の です বলা যায় (বারবার Noun পুনরাবৃত্তি না করে)।",
        common_pitfalls: [
          "উত্তরে '私[わたし]のです' (আমার) বললে চলে, '私[わたし]の本[ほん]です' বলাও সঠিক।"
        ],
        examples: [
          {
            ja: "この傘[かさ]はだれのですか。私[わたし]のです。",
            bn: "এই ছাতাটি কার? আমার।",
            en: "Whose umbrella is this? It is mine."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "ক্লাসরুমে বেঞ্চে পড়ে থাকা একটি বই কার তা খুঁজে বের করা।",
      situation_en: "Finding out who owns a book left on a desk in a classroom.",
      lines: [
        {
          speaker_ja: "学生[がくせい]A",
          speaker_en: "Student A",
          line_ja: "すみません、これはだれの本[ほん]ですか。",
          line_bn: "মাফ করবেন, এটি কার বই?",
          line_en: "Excuse me, whose book is this?"
        },
        {
          speaker_ja: "学生[がくせい]B",
          speaker_en: "Student B",
          line_ja: "あ、それは私[わたし]の日本語[にほんご]の本[ほん]です。ありがとうございます。",
          line_bn: "আরে, ওটি আমার জাপানি ভাষার বই। আপনাকে অনেক ধন্যবাদ।",
          line_en: "Ah, that is my Japanese book. Thank you very much."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের হারানো জিনিস ফিরে পাওয়ার ব্যবস্থা (Koban - 交番)",
      tip_bn: "জাপানে কোনো মূল্যবান জিনিস (মানিব্যাগ, পাসপোর্ট, চাবি বা ছাতা) হারিয়ে গেলে স্থানীয় পুলিশ বক্সে (Kōban - 交番) যোগাযোগ করুন। জাপানি নাগরিকরা রাস্তায় কুড়িয়ে পাওয়া যেকোনো জিনিস জমা করে দেন। ৯০% এরও বেশি ক্ষেত্রে হারানো জিনিস অক্ষত অবস্থায় ফেরত পাওয়া যায়।",
      category: "Emergency"
    },
    typing_practice: [
      {
        prompt_ja: "だれの本[ほん]ですか",
        romaji_input: "dare no hon desu ka",
        target_display: "だれのほんですか",
        meaning_bn: "কার বই?"
      },
      {
        prompt_ja: "私[わたし]の辞書[じしょ]です",
        romaji_input: "watashi no jisho desu",
        target_display: "わたしのじしょです",
        meaning_bn: "আমার অভিধান"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L07-1",
        question_ja: "これは（　）の 傘[かさ]ですか。空欄[くうらん]に 入[はい]る 正[ただ]しい 言葉[ことば]は どれですか。",
        question_bn: "শূন্যস্থানে সঠিক শব্দ বসান: これは（　）の かさですか",
        options: [
          "だれ",
          "どこ",
          "なん",
          "いくら"
        ],
        correct_index: 0,
        explanation_bn: "মালিকানা জানতে 'だれ' (কে/কার) বসে: だれのかさですか (কার ছাতা?)।"
      }
    ]
  },

  // --- LESSON 08: これもペンです ---
  {
    lesson_metadata: {
      lesson_id: "L08",
      lesson_number: 8,
      module_number: 1,
      module_name: "Identity & Pointers",
      module_name_bn: "পরিচয় ও নির্দেশক",
      title_ja: "これもペンです",
      title_en: "Particle MO (Inclusion 'Also / Too')",
      title_bn: "এটিও একটি কলম (অন্তর্ভুক্তি ও সাদৃশ্য)",
      estimated_minutes: 25,
      difficulty: "Beginner"
    },
    bengali_bridge: {
      explanation_bn: "পার্টিকেল も (mo) বাংলায় 'ও' (also / too) হিসেবে ব্যবহৃত হয়। যখন পূর্ববর্তী বক্তব্যের মতো পরবর্তী বিষয়েও একই তথ্য প্রযোজ্য হয়, তখন は এর বদলে も বসে। যেমন: 'রহিম সাহেব ছাত্র, তানিম সাহেবও ছাত্র' -> ラヒムさんは学生[がくせい]です。タニムさんも学生[がくせい]です。",
      core_concept_bn: "সাদৃশ্য প্রকাশক পার্টিকেল も (mo) এর প্রয়োগ এবং না-বোধক বাক্যে 'তিনিও নন'।",
      real_world_context_bn: "দোকানে কেনাকাটায় একই পণ্য একাধিক ক্রয় করা বা বন্ধুদের সাধারণ বৈশিষ্ট্য উল্লেখ করা।",
      key_takeaway_bn: "も ব্যবহার করলে は বা を পার্টিকেল সম্পূর্ণ বিলুপ্ত হয়।"
    },
    vocabulary_scope: [
      {
        word_ja: "ペン",
        romaji: "pen",
        meaning_bn: "কলম",
        meaning_en: "pen",
        part_of_speech: "noun",
        example_ja: "黒[くろ]いペンで書[か]きます。",
        example_bn: "কালো কলম দিয়ে লিখি।",
        example_en: "I write with a black pen."
      },
      {
        word_ja: "手帳[てちょう]",
        romaji: "techō",
        meaning_bn: "পকেট ডায়েরি / শিডিউল বুক",
        meaning_en: "pocket notebook / planner",
        part_of_speech: "noun",
        example_ja: "手帳[てちょう]に予定[よてい]を書[か]きます。",
        example_bn: "ডায়েরিতে পরিকল্পনা লিখি।",
        example_en: "I write my schedule in my planner."
      },
      {
        word_ja: "名刺[めいし]",
        romaji: "meishi",
        meaning_bn: "বিজনেস কার্ড",
        meaning_en: "business card",
        part_of_speech: "noun",
        example_ja: "名刺[めいし]を交換[こうかん]します。",
        example_bn: "বিজনেস কার্ড বিনিময় করি।",
        example_en: "I exchange business cards."
      },
      {
        word_ja: "時計[とけい]",
        romaji: "tokei",
        meaning_bn: "ঘড়ি",
        meaning_en: "clock / watch",
        part_of_speech: "noun",
        example_ja: "この時計[とけい]は正確[せいかく]です。",
        example_bn: "এই ঘড়িটি নির্ভুল।",
        example_en: "This watch is accurate."
      },
      {
        word_ja: "自動車[じどうしゃ]",
        romaji: "jidōsha",
        meaning_bn: "গাড়ি / অটোমোবাইল",
        meaning_en: "automobile / car",
        part_of_speech: "noun",
        example_ja: "日本[にほん]の自動車[じどうしゃ]は人気[にんき]があります。",
        example_bn: "জাপানের গাড়ির ব্যাপক জনপ্রিয়তা আছে।",
        example_en: "Japanese automobiles are popular."
      }
    ],
    kanji_scope: [
      {
        kanji: "車",
        onyomi: "シャ",
        kunyomi: "くるま",
        meaning_bn: "গাড়ি / চাকা",
        meaning_en: "car / vehicle",
        stroke_count: 7,
        compounds: [
          { word_ja: "電車[でんしゃ]", meaning_bn: "বৈদ্যুতিক ট্রেন", meaning_en: "electric train" },
          { word_ja: "自動車[じどうしゃ]", meaning_bn: "মোটরগাড়ি", meaning_en: "automobile" },
          { word_ja: "自転車[じてんしゃ]", meaning_bn: "বাইসাইকেল", meaning_en: "bicycle" }
        ]
      },
      {
        kanji: "名",
        onyomi: "メイ, ミョウ",
        kunyomi: "な",
        meaning_bn: "নাম / খ্যাতি",
        meaning_en: "name / fame",
        stroke_count: 6,
        compounds: [
          { word_ja: "名前[なまえ]", meaning_bn: "নাম", meaning_en: "name" },
          { word_ja: "有名[ゆうめい]", meaning_bn: "বিখ্যাত", meaning_en: "famous" },
          { word_ja: "名刺[めいし]", meaning_bn: "বিজনেস কার্ড", meaning_en: "business card" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G08-1",
        pattern_ja: "N も N です / じゃありません",
        pattern_bn: "N-ও N হয় / নয় (Inclusion Particle)",
        explanation_bn: "পূর্বে উল্লেখিত বক্তব্যের সাথে অভিন্নতা থাকলে は এর জায়গায় も বসে। যেমন: 私[わたし]もバングラデシュ人[じん]です (আমিও বাংলাদেশি)।",
        common_pitfalls: [
          "は এবং も একসাথে ব্যবহার করা যাবে না (はも বা もは ভুল)।"
        ],
        examples: [
          {
            ja: "あれも私[わたし]の鞄[かばん]です。",
            bn: "ঐ দূরবর্তী ব্যাগটিও আমার।",
            en: "That one over there is also my bag."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "জাপানি অফিসে সহকর্মীদের সাথে পরিচয় ও পদমর্যাদা নিশ্চিতকরণ।",
      situation_en: "Introducing and confirming positions with colleagues in a Japanese office.",
      lines: [
        {
          speaker_ja: "佐藤[さとう]",
          speaker_en: "Sato",
          line_ja: "田中[たなか]さんはエンジニアです。鈴木[すずき]さんもエンジニアですか。",
          line_bn: "তানাকা সাহেব প্রকৌশলী। সুজুকি সাহেবও কি প্রকৌশলী?",
          line_en: "Tanaka-san is an engineer. Is Suzuki-san also an engineer?"
        },
        {
          speaker_ja: "鈴木[すずき]",
          speaker_en: "Suzuki",
          line_ja: "はい、私[わたし]もエンジニアです。",
          line_bn: "হ্যাঁ, আমিও একজন প্রকৌশলী।",
          line_en: "Yes, I am also an engineer."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানি বিজনেস কার্ড বিনিময়ের পবিত্র কায়দা (Meishi Koukan - 名刺交換)",
      tip_bn: "জাপানে বিজনেস কার্ড দুই হাতে ধরে মাথা সামান্য নিচু করে গ্রহণ করতে হয়। কার্ড নেওয়ার পর সঙ্গে সঙ্গে পকেটে রাখা চরম অভদ্রতা। টেবিলের উপর কার্ডটি নিজের সামনে সুন্দর করে সাজিয়ে রাখতে হয় এবং মিটিং শেষে কার্ড হোল্ডারে ভরতে হয়।",
      category: "Workplace"
    },
    typing_practice: [
      {
        prompt_ja: "これもペンです",
        romaji_input: "kore mo pen desu",
        target_display: "これもペンです",
        meaning_bn: "এটিও কলম"
      },
      {
        prompt_ja: "私[わたし]も学生[がくせい]です",
        romaji_input: "watashi mo gakusei desu",
        target_display: "わたしもがくせいです",
        meaning_bn: "আমিও ছাত্র"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L08-1",
        question_ja: "「私も」の 意味[いみ]は 何[なん]ですか。",
        question_bn: "‘わたしも’ (watashi mo) এর বাংলা অর্থ কী?",
        options: [
          "আমিও (Me too / I also)",
          "আমার (Mine)",
          "আমাকে (To me)",
          "আমি শুধু (Only me)"
        ],
        correct_index: 0,
        explanation_bn: "も পার্টিকেল অন্তর্ভুক্তিসূচক 'ও' অর্থ দেয়, তাই わたしも অর্থ 'আমিও'।"
      }
    ]
  },

  // --- LESSON 09: これそれあれ ---
  {
    lesson_metadata: {
      lesson_id: "L09",
      lesson_number: 9,
      module_number: 1,
      module_name: "Identity & Pointers",
      module_name_bn: "পরিচয় ও নির্দেশক",
      title_ja: "これ・それ・あれ",
      title_en: "Demonstratives (Ko-So-A-Do System)",
      title_bn: "এই, ঐ, সেই এবং কোনটি (নির্দেশক সর্বনাম)",
      estimated_minutes: 25,
      difficulty: "Beginner"
    },
    bengali_bridge: {
      explanation_bn: "জাপানি ভাষায় বস্তু নির্দেশ করতে কো-সো-আ-দো (Ko-So-A-Do) সিস্টেম ব্যবহৃত হয়: বক্তার কাছে থাকলে これ (kore - এটি), শ্রোতার কাছে থাকলে それ (sore - ওটি), এবং উভয়ের থেকে দূরে থাকলে あれ (are - সেইটি)। কোনটি জানতে চাইলে どれ (dore)। আর বিশেষ্যের পূর্বে বসলে হয় この/その/あの + Noun।",
      core_concept_bn: "দূরত্বভিত্তিক নির্দেশক সর্বনাম (これ/それ/あれ) বনাম বিশেষণের নির্দেশক (この/その/あの)।",
      real_world_context_bn: "দোকানে আঙুল দিয়ে নির্দিষ্ট জিনিস দেখানো বা মেনু থেকে পছন্দের আইটেম বাছাই করা।",
      key_takeaway_bn: "これ/それ/あれ একা বসে (Noun ছাড়া), কিন্তু この/その/あの এর ঠিক পরে একটি Noun থাকতে হবে।"
    },
    vocabulary_scope: [
      {
        word_ja: "これ",
        romaji: "kore",
        meaning_bn: "এটি (বক্তার কাছাকাছি)",
        meaning_en: "this (near speaker)",
        part_of_speech: "pronoun",
        example_ja: "これは何[なん]ですか。",
        example_bn: "এটি কী?",
        example_en: "What is this?"
      },
      {
        word_ja: "それ",
        romaji: "sore",
        meaning_bn: "ওটি (শ্রোতার কাছাকাছি)",
        meaning_en: "that (near listener)",
        part_of_speech: "pronoun",
        example_ja: "それは私[わたし]の傘[かさ]です。",
        example_bn: "ওটি আমার ছাতা।",
        example_en: "That is my umbrella."
      },
      {
        word_ja: "あれ",
        romaji: "are",
        meaning_bn: "সেইটি (উভয়ের দূরে)",
        meaning_en: "that over there (far from both)",
        part_of_speech: "pronoun",
        example_ja: "あれは東京[とうきょう]タワーです。",
        example_bn: "সেইটি টোকিও টাওয়ার।",
        example_en: "That over there is Tokyo Tower."
      },
      {
        word_ja: "どれ",
        romaji: "dore",
        meaning_bn: "কোনটি?",
        meaning_en: "which one?",
        part_of_speech: "pronoun",
        example_ja: "あなたのかばんはどれですか。",
        example_bn: "আপনার ব্যাগ কোনটি?",
        example_en: "Which one is your bag?"
      },
      {
        word_ja: "この本[ほん]",
        romaji: "kono hon",
        meaning_bn: "এই বইটি",
        meaning_en: "this book",
        part_of_speech: "noun phrase",
        example_ja: "この本[ほん]はとても面白[おもしろ]いです。",
        example_bn: "এই বইটি খুব মজার।",
        example_en: "This book is very interesting."
      }
    ],
    kanji_scope: [
      {
        kanji: "大",
        onyomi: "ダイ, タイ",
        kunyomi: "おお・きい, おお・いに",
        meaning_bn: "বড় / বিশাল",
        meaning_en: "big / large",
        stroke_count: 3,
        compounds: [
          { word_ja: "大[おお]きい", meaning_bn: "বড়", meaning_en: "big" },
          { word_ja: "大学[だいがく]", meaning_bn: "বিশ্ববিদ্যালয়", meaning_en: "university" },
          { word_ja: "大人[おとな]", meaning_bn: "প্রাপ্তবয়স্ক", meaning_en: "adult" }
        ]
      },
      {
        kanji: "小",
        onyomi: "ショウ",
        kunyomi: "ちい・さい, こ, お",
        meaning_bn: "ছোট",
        meaning_en: "small",
        stroke_count: 3,
        compounds: [
          { word_ja: "小[ちい]さい", meaning_bn: "ছোট", meaning_en: "small" },
          { word_ja: "小学校[しょうがっこう]", meaning_bn: "প্রাথমিক বিদ্যালয়", meaning_en: "elementary school" },
          { word_ja: "小川[おがわ]", meaning_bn: "ছোট নদী / ঝিরি", meaning_en: "brook / stream" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G09-1",
        pattern_ja: "これ / それ / あれ は N です",
        pattern_bn: "এটি / ওটি / সেইটি হলো N",
        explanation_bn: "বক্তার নিজের অবস্থানের সাপেক্ষে বস্তুর দূরত্ব অনুযায়ী これ (কাছে), それ (সামনে থাকা শ্রোতার কাছে) এবং あれ (উভয় থেকে দূরবর্তী) ব্যবহৃত হয়।",
        common_pitfalls: [
          "これ本[ほん] বলা যাবে না; Noun এর পূর্বে বসাতে হলে 必ず この本[ほん] বলতে হবে।"
        ],
        examples: [
          {
            ja: "これは日本[にほん]のお土産[みやげ]です。",
            bn: "এটি জাপানের স্যুভেনির (উপহার)।",
            en: "This is a Japanese souvenir."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "টোকিওর সুভেনির দোকানে জাপানি ফ্যান (পাখা) কেনা।",
      situation_en: "Buying a traditional Japanese folding fan at a Tokyo souvenir shop.",
      lines: [
        {
          speaker_ja: "客[きゃく]",
          speaker_en: "Customer",
          line_ja: "すみません、あれを見[み]せてください。",
          line_bn: "মাফ করবেন, ঐ দূরেরটি আমাকে দেখান দয়া করে।",
          line_en: "Excuse me, please show me that one over there."
        },
        {
          speaker_ja: "店員[てんいん]",
          speaker_en: "Clerk",
          line_ja: "はい、どうぞ。この扇子[せんす]ですね。",
          line_bn: "জি, এই নিন। এই ফোল্ডিং ফ্যানটি তো?",
          line_en: "Yes, here you are. This folding fan, right?"
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "দোকানে আঙুল না তুলে হাতের তালু প্রদর্শন (Pointing Manners)",
      tip_bn: "জাপানে কোনো ব্যক্তি বা পণ্যের দিকে তর্জনী (শাহাদাত আঙুল) দিয়ে নির্দেশ করা অভদ্রতা হিসেবে বিবেচনা করা হয়। কোনো জিনিস নির্দেশ করতে হলে পুরো হাতের তালু ঊর্ধ্বমুখী করে বিনম্রভাবে ইঙ্গিত করা ভদ্র সমাজের রীতি।",
      category: "Manners"
    },
    typing_practice: [
      {
        prompt_ja: "これは何[なん]ですか",
        romaji_input: "kore wa nan desu ka",
        target_display: "これはなんですか",
        meaning_bn: "এটি কী?"
      },
      {
        prompt_ja: "その本[ほん]をください",
        romaji_input: "sono hon o kudasai",
        target_display: "そのほんをください",
        meaning_bn: "ঐ বইটি দিন"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L09-1",
        question_ja: "話[はな]し手[て]と 聞[き]き手[て]の 両方[りょうほう]から 遠[とお]い 物[もの]を 指[さ]す 言葉[ことば]は どれですか。",
        question_bn: "বক্তা ও শ্রোতা উভয়ের থেকেই দূরবর্তী বস্তু নির্দেশ করতে কোনটি বসে?",
        options: [
          "あれ (Are)",
          "これ (Kore)",
          "それ (Sore)",
          "どれ (Dore)"
        ],
        correct_index: 0,
        explanation_bn: "বক্তা এবং শ্রোতা দুজনের থেকেই দূরে অবস্থিত বস্তু নির্দেশ করতে 'あれ' (That over there) ব্যবহৃত হয়।"
      }
    ]
  },

  // --- LESSON 10: ここは教室です ---
  {
    lesson_metadata: {
      lesson_id: "L10",
      lesson_number: 10,
      module_number: 1,
      module_name: "Identity & Pointers",
      module_name_bn: "পরিচয় ও নির্দেশক",
      title_ja: "ここは教室[きょうしつ]です",
      title_en: "Locations & Facilities (Koko, Soko, Asoko, Doko)",
      title_bn: "এখানে ক্লাসরুম (স্থান ও দিকনির্দেশনা)",
      estimated_minutes: 25,
      difficulty: "Beginner"
    },
    bengali_bridge: {
      explanation_bn: "বস্তু নির্দেশের মতো স্থান নির্দেশের ক্ষেত্রেও Ko-So-A-Do রীতি প্রযোজ্য: ここ (এখানে), そこ (সেখানে), あそこ (ঐ দূরবর্তী স্থানে), এবং どこ (কোথায়)। আরও বিনম্র বা দিক নির্দেশ করতে こちら (kochira), そちら (sochira), あちら (achira), どちら (dochira) ব্যবহৃত হয়।",
      core_concept_bn: "স্থানের নির্দেশক এবং টয়লেট, অফিস, এটিএম বুথ ইত্যাদির অবস্থান জিজ্ঞাসা করা।",
      real_world_context_bn: "জাপানে এয়ারপোর্ট বা ট্রেনের স্টেশনে ওয়াশরুম, টিকিট কাউন্টার বা ইনফরমেশন ডেস্ক খুঁজে বের করা।",
      key_takeaway_bn: "টয়লেট বা শৌচাগারকে ভদ্র ভাষায় お手洗い[おてあらい] বলা হয়।"
    },
    vocabulary_scope: [
      {
        word_ja: "ここ",
        romaji: "koko",
        meaning_bn: "এখানে",
        meaning_en: "here",
        part_of_speech: "pronoun",
        example_ja: "ここは受付[うけつけ]です。",
        example_bn: "এখানে অভ্যর্থনা কক্ষ।",
        example_en: "Here is the reception desk."
      },
      {
        word_ja: "そこ",
        romaji: "soko",
        meaning_bn: "সেখানে",
        meaning_en: "there",
        part_of_speech: "pronoun",
        example_ja: "そこに座[すわ]ってください。",
        example_bn: "সেখানে বসুন দয়া করে।",
        example_en: "Please sit there."
      },
      {
        word_ja: "あそこ",
        romaji: "asoko",
        meaning_bn: "ঐ দূরবর্তী স্থানে",
        meaning_en: "over there",
        part_of_speech: "pronoun",
        example_ja: "あそこにコンビニがあります。",
        example_bn: "ঐখানে একটি কনবিনি দোকান আছে।",
        example_en: "There is a convenience store over there."
      },
      {
        word_ja: "どこ",
        romaji: "doko",
        meaning_bn: "কোথায়?",
        meaning_en: "where?",
        part_of_speech: "pronoun",
        example_ja: "お手洗い[おてあらい]はどこですか。",
        example_bn: "ওয়াশরুমটি কোথায়?",
        example_en: "Where is the restroom?"
      },
      {
        word_ja: "教室[きょうしつ]",
        romaji: "kyōshitsu",
        meaning_bn: "শ্রেণীকক্ষ / ক্লাসরুম",
        meaning_en: "classroom",
        part_of_speech: "noun",
        example_ja: "教室[きょうしつ]に学生[がくせい]がいます。",
        example_bn: "ক্লাসরুমে শিক্ষার্থী আছে।",
        example_en: "There are students in the classroom."
      },
      {
        word_ja: "事務所[じむしょ]",
        romaji: "jimusho",
        meaning_bn: "দপ্তর / অফিস",
        meaning_en: "office",
        part_of_speech: "noun",
        example_ja: "事務所[じむしょ]は二階[にかい]です。",
        example_bn: "অফিসটি দ্বিতীয় তলায়।",
        example_en: "The office is on the second floor."
      }
    ],
    kanji_scope: [
      {
        kanji: "室",
        onyomi: "シツ",
        kunyomi: "むろ",
        meaning_bn: "ঘর / কক্ষ",
        meaning_en: "room",
        stroke_count: 9,
        compounds: [
          { word_ja: "教室[きょうしつ]", meaning_bn: "শ্রেণিকক্ষ", meaning_en: "classroom" },
          { word_ja: "研究室[けんきゅうしつ]", meaning_bn: "গবেষণা ল্যাব", meaning_en: "research lab" },
          { word_ja: "室内[しつない]", meaning_bn: "ঘরের ভেতরে", meaning_en: "indoors" }
        ]
      },
      {
        kanji: "校",
        onyomi: "コウ",
        kunyomi: "かせ",
        meaning_bn: "স্কুল / বিদ্যাপীঠ",
        meaning_en: "school",
        stroke_count: 10,
        compounds: [
          { word_ja: "学校[がっこう]", meaning_bn: "বিদ্যালয়", meaning_en: "school" },
          { word_ja: "高校[こうこう]", meaning_bn: "উচ্চ বিদ্যালয়", meaning_en: "high school" },
          { word_ja: "校長[こうちょう]", meaning_bn: "অধ্যক্ষ / হেডমাস্টার", meaning_en: "principal" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G10-1",
        pattern_ja: "Place は ここ / そこ / あそこ / どこ です",
        pattern_bn: "[স্থান/সুবিধা] হলো এখানে/সেখানে/কোথায়",
        explanation_bn: "কোনো স্থাপনা বা রুমের অবস্থান জানাতে এই বাক্যরীতি ব্যবহৃত হয়। যেমন: トイレはどこですか (টয়লেট কোথায়?) -> あそこです (ঐখানে)।",
        common_pitfalls: [
          "অত্যন্ত বিনম্র পরিস্থিতিতে どこ এর পরিবর্তে どちら (dochira) ব্যবহার করা উচিত।"
        ],
        examples: [
          {
            ja: "エレベーターはあちらです。",
            bn: "লিফটটি ঐ দিকে।",
            en: "The elevator is in that direction."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "টোকিও বিশ্ববিদ্যালয়ের ক্যাম্পাসে আন্তর্জাতিক শিক্ষার্থীর ওয়াশরুম খুঁজে নেওয়া।",
      situation_en: "International student asking for the restroom on the University of Tokyo campus.",
      lines: [
        {
          speaker_ja: "留学生[りゅうがくせい]",
          speaker_en: "Foreign Student",
          line_ja: "すみません、お手洗い[おてあらい]はどこですか。",
          line_bn: "মাফ করবেন, ওয়াশরুম কোথায়?",
          line_en: "Excuse me, where is the restroom?"
        },
        {
          speaker_ja: "案内係[あんないがかり]",
          speaker_en: "Guide",
          line_ja: "お手洗い[おてあらい]はあちらです。階段[かいだん]の隣[となり]にあります。",
          line_bn: "ওয়াশরুম ঐ দিকে। সিঁড়ির পাশেই রয়েছে।",
          line_en: "The restroom is over there, next to the stairs."
        },
        {
          speaker_ja: "留学生[りゅうがくせい]",
          speaker_en: "Foreign Student",
          line_ja: "どうもありがとうございます。",
          line_bn: "আপনাকে অনেক ধন্যবাদ।",
          line_en: "Thank you very much."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের হাই-টেক ওয়াশলেট টয়লেট ও জরুরি বাটন",
      tip_bn: "জাপানের প্রায় সব পাবলিক ও হোম টয়লেটে 'Washlet' ইলেকট্রনিক কন্ট্রোল প্যানেল থাকে। এতে স্প্রে (Oshiri - おしり), ফ্লাশ (Nagusu - 流す) এবং ফ্লাশের শব্দ তৈরি করার বাটন (Otohime - 音姫) থাকে যাতে লাজুক বোধ না হয়। ভুলেও লাল রঙের 'Yobidashi' (呼び出し - জরুরি সাহায্য কল) বাটন চাপবেন না!",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "ここは教室[きょうしつ]です",
        romaji_input: "koko wa kyoushitsu desu",
        target_display: "ここはきょうしつです",
        meaning_bn: "এখানে ক্লাসরুম"
      },
      {
        prompt_ja: "お手洗い[おてあらい]はどこですか",
        romaji_input: "otearai wa doko desu ka",
        target_display: "おてあらいはどこですか",
        meaning_bn: "ওয়াশরুম কোথায়?"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L10-1",
        question_ja: "「お手洗い[おてあらい]」の 意味[いみ]は 何[なん]ですか。",
        question_bn: "‘おてあらい’ (otearai) শব্দের সঠিক বাংলা অর্থ কী?",
        options: [
          "ওয়াশরুম / শৌচাগার (Restroom)",
          "শ্রেণিকক্ষ (Classroom)",
          "দপ্তর / অফিস (Office)",
          "ক্যান্টিন (Canteen)"
        ],
        correct_index: 0,
        explanation_bn: "お手洗い (otearai) অর্থ পরিচ্ছন্নতার কক্ষ বা শৌচাগার (টয়লেট)।"
      }
    ]
  }
];
