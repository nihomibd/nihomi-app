// Module 6: Ability, Past & Casual (Lessons 31 - 35)
module.exports = [
  // --- LESSON 31: 読むことができます ---
  {
    lesson_metadata: {
      lesson_id: "L31",
      lesson_number: 31,
      module_number: 6,
      module_name: "Ability, Past & Casual",
      module_name_bn: "সক্ষমতা, অতীত ও কথ্যরূপ",
      title_ja: "読[よ]むことができます",
      title_en: "Expressing Potential (Dictionary Form + koto ga dekimasu)",
      title_bn: "পড়তে পারি (সক্ষমতা ও দক্ষতা প্রকাশ)",
      estimated_minutes: 25,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "কোনো কাজ করার সামর্থ্য বা সম্ভাবনা প্রকাশ করতে ক্রিয়াপদের ডিকশনারি রূপের (辞書形 - Jishokei) সাথে ことができます যোগ করতে হয়। ডিকশনারি রূপের সাথে こと যুক্ত করে ক্রিয়াপদকে বিশেষ্যে (Nominalization - বিশেষ্যকরণ) রূপান্তর করা হয় এবং পরে ができます (পারি) বসে। যেমন: 'জাপানি পড়তে পারি' -> 日本語[にほんご]を読[よ]むことができます।",
      core_concept_bn: "ডিকশনারি রূপ (Jishokei), ক্রিয়ার বিশেষ্যকরণ (こと) এবং সক্ষমতা (〜ができます)।",
      real_world_context_bn: "জাপানে চাকরির ইন্টারভিউয়ে ড্রাইভিং লাইসেন্স, ভাষা দক্ষতা বা কম্পিউটার চালনার যোগ্যতা জানানো।",
      key_takeaway_bn: "V-dict ことができます (করতে পারি)। Noun が できます (সরাসরি বিশেষ্যে সক্ষমতা)।"
    },
    vocabulary_scope: [
      {
        word_ja: "できます",
        romaji: "dekimasu",
        meaning_bn: "পারা / সক্ষম হওয়া",
        meaning_en: "can do / be able to",
        part_of_speech: "verb",
        example_ja: "スキーができますか。",
        example_bn: "স্কি করতে পারেন কি?",
        example_en: "Can you ski?"
      },
      {
        word_ja: "泳[およ]ぎます",
        romaji: "oyogimasu",
        meaning_bn: "সাঁতার কাটা",
        meaning_en: "to swim",
        part_of_speech: "verb",
        example_ja: "五十[ごじゅう]メートル泳[およ]ぐことができます。",
        example_bn: "৫০ মিটার সাঁতার কাটতে পারি।",
        example_en: "I can swim 50 meters."
      },
      {
        word_ja: "運転[うんてん]します",
        romaji: "untenshimasu",
        meaning_bn: "গাড়ি চালানো / ড্রাইভ করা",
        meaning_en: "to drive",
        part_of_speech: "verb",
        example_ja: "車[くるま]の運転[うんてん]ができます。",
        example_bn: "গাড়ি চালাতে পারি।",
        example_en: "I can drive a car."
      },
      {
        word_ja: "趣味[しゅみ]",
        romaji: "shumi",
        meaning_bn: "শখ",
        meaning_en: "hobby",
        part_of_speech: "noun",
        example_ja: "私[わたし]の趣味[しゅみ]は写真[しゃしん]を撮[と]ることです。",
        example_bn: "আমার শখ হলো ছবি তোলা।",
        example_en: "My hobby is taking photographs."
      },
      {
        word_ja: "漢字[かんじ]",
        romaji: "kanji",
        meaning_bn: "কানজি লিপি",
        meaning_en: "Chinese characters / Kanji",
        part_of_speech: "noun",
        example_ja: "漢字[かんじ]を百[ひゃく]字[じ]書[か]くことができます。",
        example_bn: "১০০টি কানজি লিখতে পারি।",
        example_en: "I can write 100 kanji characters."
      }
    ],
    kanji_scope: [
      {
        kanji: "漢",
        onyomi: "カン",
        kunyomi: "おとこ",
        meaning_bn: "চীনা / কানজি",
        meaning_en: "Chinese / Han",
        stroke_count: 13,
        compounds: [
          { word_ja: "漢字[かんじ]", meaning_bn: "কানজি লিপি", meaning_en: "kanji characters" }
        ]
      },
      {
        kanji: "字",
        onyomi: "ジ",
        kunyomi: "あざ, あざな",
        meaning_bn: "অক্ষর / লিপি",
        meaning_en: "character / letter",
        stroke_count: 6,
        compounds: [
          { word_ja: "漢字[かんじ]", meaning_bn: "কানজি", meaning_en: "kanji" },
          { word_ja: "文字[もじ]", meaning_bn: "বর্ণমালা / টেক্সট", meaning_en: "letter / script" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G31-1",
        pattern_ja: "V-dictionary ことができます",
        pattern_bn: "[কাজ] করতে পারি (Expressing Potential)",
        explanation_bn: "ডিকশনারি রূপের শেষে こと যোগ করলে তা 'করা' বিশেষ্যে পরিণত হয় এবং が できます দিয়ে সক্ষমতা নির্দেশিত হয়। যেমন: ピアノを弾[ひ]くことができます (পিয়ানো বাজাতে পারি)।",
        common_pitfalls: [
          "ます-ফর্মের সাথে こと বসানো যাবে না (× 読みますことができます নয়, ○ 読むことができます)।"
        ],
        examples: [
          {
            ja: "日本[にほん]のお金[かね]で払[はら]うことができますか。",
            bn: "জাপানি মুদ্রায় কি পেমেন্ট করতে পারি?",
            en: "Can I pay in Japanese currency?"
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "পার্টটাইম জবের ইন্টারভিউতে ম্যানেজারকে নিজের ভাষা ও কাজের সক্ষমতা জানানো।",
      situation_en: "Explaining language and work abilities to the manager at a part-time job interview.",
      lines: [
        {
          speaker_ja: "店長[てんちょう]",
          speaker_en: "Store Manager",
          line_ja: "日本語[にほんご]で電話[でんわ]を受[う]けることができますか。",
          line_bn: "জাপানি ভাষায় কি ফোন কল রিসিভ করতে পারেন?",
          line_en: "Can you take phone calls in Japanese?"
        },
        {
          speaker_ja: "自分[じぶん]",
          speaker_en: "Self",
          line_ja: "はい、簡単[かんたん]な会話[かいわ]なら話[はな]すことができます。",
          line_bn: "জি, সহজ কথোপকথন হলে বলতে পারি।",
          line_en: "Yes, if it is simple conversation, I can speak."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের ক্যাশলেস পেমেন্ট: PayPay, Suica ও ক্রেডিট কার্ড",
      tip_bn: "জাপান ঐতিহ্যগতভাবে নগদ টাকার দেশ হলেও বর্তমানে 'PayPay' কিউআর কোড এবং আইসি কার্ডের মাধ্যমে প্রায় সব দোকানে ক্যাশলেস পেমেন্ট (Kyasshuresu) করা যায়। কনবিনিতে পেমেন্টের সময় স্ক্রিনে 'Barai' (পেমেন্ট পদ্ধতি) বেছে নিতে হয় এবং স্মার্টফোনের বারকোড স্ক্যান করাতে হয়।",
      category: "Shopping"
    },
    typing_practice: [
      {
        prompt_ja: "読[よ]むことができます",
        romaji_input: "yomu koto ga dekimasu",
        target_display: "よむことができます",
        meaning_bn: "পড়তে পারি"
      },
      {
        prompt_ja: "車[くるま]の運転[うんてん]ができます",
        romaji_input: "kuruma no unten ga dekimasu",
        target_display: "くるまのうんてんができます",
        meaning_bn: "ড্রাইভিং করতে পারি"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L31-1",
        question_ja: "「食[た]べます」の 辞書形[じしょけい]（Dictionary form）は どれですか。",
        question_bn: "‘たべます’ এর সঠিক ডিকশনারি রূপ (辞書形) কোনটি?",
        options: [
          "たべる (Taberu)",
          "たべた (Tabeta)",
          "たべて (Tabete)",
          "たべない (Tabenai)"
        ],
        correct_index: 0,
        explanation_bn: "গ্রুপ ২ এর ক্রিয়া 食べます এর ডিকশনারি রূপ হলো ます তুলে দিয়ে る যোগ করা: 食べる (Taberu)।"
      }
    ]
  },

  // --- LESSON 32: 寝る前に本を読みます ---
  {
    lesson_metadata: {
      lesson_id: "L32",
      lesson_number: 32,
      module_number: 6,
      module_name: "Ability, Past & Casual",
      module_name_bn: "সক্ষমতা, অতীত ও কথ্যরূপ",
      title_ja: "寝[ね]る前[まえ]に本[ほん]を読[よ]みます",
      title_en: "Before Doing an Action (V-dictionary + mae ni)",
      title_bn: "ঘুমানোর আগে বই পড়ি (পূর্ববর্তী সময় ও প্রস্তুতি)",
      estimated_minutes: 25,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "কোনো কাজ করার পূর্বে আরেকটি কাজ সম্পন্ন হয় তা বোঝাতে ক্রিয়াপদের ডিকশনারি রূপের সাথে 前[まえ]に (mae ni - পূর্বে/আগে) বসে। বিশেষ্যের ক্ষেত্রে Noun の 前[まえ]に হয় (যেমন: খাবারের পূর্বে = 食事[しょくじ]の前[まえ]に)। লক্ষণীয় বিষয় হলো, প্রধান কাজটি অতীতে সম্পন্ন হলেও 前に এর আগের ক্রিয়াটি সবসময় বর্তমান ডিকশনারি রূপেই থাকে!",
      core_concept_bn: "সময় অনুক্রম: V-dict 前に (করার আগে) এবং Noun の 前に (এর আগে)।",
      real_world_context_bn: "জাপানে কোনো চুক্তি করার আগে নিয়মাবলি পড়া, খাবার খাওয়ার আগে হাত ধোয়া এবং ঘুমানোর অভ্যাস।",
      key_takeaway_bn: "V-dict 前に V2 (V1 করার পূর্বে V2 করি)। কখনোই অতীতে রূপান্তর করবেন না।"
    },
    vocabulary_scope: [
      {
        word_ja: "前[まえ]に",
        romaji: "mae ni",
        meaning_bn: "পূর্বে / আগে",
        meaning_en: "before / prior to",
        part_of_speech: "expression",
        example_ja: "寝[ね]る前[まえ]に日記[にっき]を書[か]きます。",
        example_bn: "ঘুমানোর আগে ডায়েরি লিখি।",
        example_en: "I write in my diary before sleeping."
      },
      {
        word_ja: "食事[しょくじ]",
        romaji: "shokuji",
        meaning_bn: "খাবার / ভোজ",
        meaning_en: "meal",
        part_of_speech: "noun",
        example_ja: "食事[しょくじ]の前[まえ]に手[て]を洗[あら]います。",
        example_bn: "খাওয়ার আগে হাত ধুই।",
        example_en: "I wash my hands before meals."
      },
      {
        word_ja: "旅行[りょこう]します",
        romaji: "ryokōshimasu",
        meaning_bn: "ভ্রমণ করা / ট্যুর দেওয়া",
        meaning_en: "to travel",
        part_of_speech: "verb",
        example_ja: "旅行[りょこう]の前[まえ]にホテルを予約[よやく]します。",
        example_bn: "ভ্রমণের আগে হোটেল বুকিং করি।",
        example_en: "I book a hotel before traveling."
      },
      {
        word_ja: "予約[よやく]します",
        romaji: "yoyakushimasu",
        meaning_bn: "বুকিং করা / রিজার্ভেশন দেওয়া",
        meaning_en: "to reserve / book",
        part_of_speech: "verb",
        example_ja: "新幹線[しんかんせん]の席[せき]を予約[よやく]しました。",
        example_bn: "বুলেট ট্রেনের সিট রিজার্ভ করেছি।",
        example_en: "I reserved a seat on the bullet train."
      }
    ],
    kanji_scope: [
      {
        kanji: "旅",
        onyomi: "リョ",
        kunyomi: "たび",
        meaning_bn: "ভ্রমণ / ট্রিপ",
        meaning_en: "trip / travel",
        stroke_count: 10,
        compounds: [
          { word_ja: "旅行[りょこう]", meaning_bn: "ভ্রমণ", meaning_en: "travel" },
          { word_ja: "一人旅[ひとりたび]", meaning_bn: "একাকী ভ্রমণ", meaning_en: "solo travel" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G32-1",
        pattern_ja: "V-dict 前に / Noun の 前に",
        pattern_bn: "[কাজ বা বিষয়] এর পূর্বে",
        explanation_bn: "ক্রিয়া হলে ডিকশনারি রূপ + 前に, আর বিশেষ্য হলে Noun + の + 前に। পুরো বাক্যটি অতীতে হলেও 前に এর আগের ক্রিয়াপদ অপরিবর্তিত থাকে।",
        common_pitfalls: [
          "× 寝た前に নয়, 必ず ○ 寝る前に বলতে হবে।"
        ],
        examples: [
          {
            ja: "日本[にほん]へ来[く]る前[まえ]に、ひらがなを勉強[べんきょう]しました。",
            bn: "জাপান আসার পূর্বে হিরাগানা শিখেছিলাম।",
            en: "Before coming to Japan, I studied hiragana."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "ডাক্তারখানা থেকে ওষুধ সেবনের নির্দেশনা গ্রহণ।",
      situation_en: "Receiving medicine intake instructions at a Tokyo clinic.",
      lines: [
        {
          speaker_ja: "医師[いし]",
          speaker_en: "Doctor",
          line_ja: "この薬[くすり]は寝[ね]る前[まえ]に一錠[いちじょう]飲[の]んでください。",
          line_bn: "এই ওষুধটি ঘুমানোর আগে একটি ট্যাবলেট খাবেন।",
          line_en: "Please take one tablet of this medicine before going to bed."
        },
        {
          speaker_ja: "患者[かんじゃ]",
          speaker_en: "Patient",
          line_ja: "はい、分[わ]かりました。ごはんの前[まえ]には飲[の]まないですね。",
          line_bn: "জি, বুঝতে পেরেছি। খাবারের আগে খাওয়ার দরকার নেই তো?",
          line_en: "Yes, understood. Not before meals, right?"
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের প্রেসক্রিপশন ও ওষুধের দোকান (Chouzai Yakkyoku - 調剤薬局)",
      tip_bn: "জাপানে ক্লিনিকে ডাক্তার দেখানোর পর ডাক্তার সরাসরি ওষুধ দেন না। ক্লিনিক থেকে একটি অফিসিয়াল প্রেসক্রিপশন (Shohousen) দেওয়া হয়, যা নিয়ে পাশের 'Chouzai Yakkyoku' (প্রেসক্রিপশন ফার্মেসি) তে যেতে হয়। জাতীয় স্বাস্থ্য বীমা (Kokumin Kenko Hoken) থাকলে ওষুধের খরচের মাত্র ৩০% দিতে হয়।",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "寝[ね]る前[まえ]に本[ほん]を読[よ]みます",
        romaji_input: "neru mae ni hon o yomimasu",
        target_display: "ねるまえにほんをよみます",
        meaning_bn: "ঘুমানোর আগে বই পড়ি"
      },
      {
        prompt_ja: "食事[しょくじ]の前[まえ]に",
        romaji_input: "shokuji no mae ni",
        target_display: "しょくじのまえに",
        meaning_bn: "খাবারের পূর্বে"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L32-1",
        question_ja: "「日本へ（　）前に、日本語を勉強しました」の 空欄[くうらん]に 入[はい]る 正[ただ]しい 言葉[ことば]は どれですか。",
        question_bn: "শূন্যস্থানে সঠিক শব্দ বসান: にほんへ（　）まえに、にほんごを べんきょうしました",
        options: [
          "来[く]る (Kuru)",
          "来[き]た (Kita)",
          "来[き]ます (Kimasu)",
          "来[き]て (Kite)"
        ],
        correct_index: 0,
        explanation_bn: "前に এর পূর্বে সবসময় ক্রিয়ার ডিকশনারি রূপ (Dictionary Form) বসে: 日本へ来る前に (জাপানে আসার পূর্বে)।"
      }
    ]
  },

  // --- LESSON 33: 食べたことがあります ---
  {
    lesson_metadata: {
      lesson_id: "L33",
      lesson_number: 33,
      module_number: 6,
      module_name: "Ability, Past & Casual",
      module_name_bn: "সক্ষমতা, অতীত ও কথ্যরূপ",
      title_ja: "食[た]べたことがあります",
      title_en: "Past Personal Experience (Ta-Form + koto ga arimasu)",
      title_bn: "কখনও খেয়েছি (জীবনের অতীত অভিজ্ঞতা)",
      estimated_minutes: 25,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "জীবনে কোনো কাজ অন্তত একবার করার অতীত অভিজ্ঞতা প্রকাশ করতে ক্রিয়ার অতীত বা তা-ফর্মের (た形 - Ta-form) সাথে ことがあります যোগ করা হয় ('করার অভিজ্ঞতা আছে')। সাধারণ অতীত (食[た]べました - খেয়েছিলাম) এবং অভিজ্ঞতার (食[た]べたことがあります - জীবনে কখনও খেয়েছি) মধ্যে সুস্পষ্ট পার্থক্য রয়েছে।",
      core_concept_bn: "তা-ফর্ম রূপান্তর এবং জীবনের অতীত অভিজ্ঞতা (V-た ことがあります)।",
      real_world_context_bn: "জাপানি খাবার (সুশি, নাত্তো), বুলেট ট্রেনে চড়া বা মাউন্ট ফুজি আরোহণের অভিজ্ঞতা বিনিময়।",
      key_takeaway_bn: "V-た ことがあります (অভিজ্ঞতা আছে)। V-た ことがありません (কখনও করিনি)।"
    },
    vocabulary_scope: [
      {
        word_ja: "登[のぼ]ります",
        romaji: "noborimasu",
        meaning_bn: "আরোহণ করা / চড়া (পাহাড়ে)",
        meaning_en: "to climb (a mountain)",
        part_of_speech: "verb",
        example_ja: "富士山[ふじさん]に登[のぼ]ったことがあります。",
        example_bn: "মাউন্ট ফুজিতে চড়ার অভিজ্ঞতা আছে।",
        example_en: "I have climbed Mt. Fuji."
      },
      {
        word_ja: "泊[と]まります",
        romaji: "tomarimasu",
        meaning_bn: "রাত্রিযাপন করা / থাকা (হোটেল)",
        meaning_en: "to stay (at a hotel)",
        part_of_speech: "verb",
        example_ja: "日本[にほん]の旅館[りょかん]に泊[と]まったことがあります。",
        example_bn: "জাপানের ট্র্যাডিশনাল সরাইখানায় থাকার অভিজ্ঞতা আছে।",
        example_en: "I have stayed at a Japanese inn (Ryokan)."
      },
      {
        word_ja: "一度[いちど]",
        romaji: "ichido",
        meaning_bn: "একবার",
        meaning_en: "once / one time",
        part_of_speech: "adverb",
        example_ja: "一度[いちど]もスキーをしたことがありません。",
        example_bn: "একবারও স্কি করিনি।",
        example_en: "I have never skied even once."
      },
      {
        word_ja: "寿司[すし]",
        romaji: "sushi",
        meaning_bn: "সুশি (ঐতিহ্যবাহী জাপানি খাবার)",
        meaning_en: "sushi",
        part_of_speech: "noun",
        example_ja: "寿司[すし]を食[た]べたことがありますか。",
        example_bn: "কখনও কি সুশি খেয়েছেন?",
        example_en: "Have you ever eaten sushi?"
      }
    ],
    kanji_scope: [
      {
        kanji: "度",
        onyomi: "ド, ト",
        kunyomi: "たび",
        meaning_bn: "বার / ডিগ্রি",
        meaning_en: "degree / times",
        stroke_count: 9,
        compounds: [
          { word_ja: "一度[いちど]", meaning_bn: "একবার", meaning_en: "once" },
          { word_ja: "今度[こんど]", meaning_bn: "এবার / পরবর্তী সময়ে", meaning_en: "this time / next time" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G33-1",
        pattern_ja: "V-た ことがあります",
        pattern_bn: "[কাজ] করার অভিজ্ঞতা আছে (Past Experience)",
        explanation_bn: "ক্রিয়াপদের た-ফর্মের নিয়ম হুবহু て-ফর্মের মতো (শুধু 'て' এর জায়গায় 'た' এবং 'で' এর জায়গায় 'だ' বসে)। না-বোধকে ことがありません বসে।",
        common_pitfalls: [
          "গতকাল কোনো সাধারণ কাজ করার ক্ষেত্রে এটি ব্যবহার করা যাবে না (× 昨日寿司を食べたことがあります নয়, ○ 昨日寿司を食べました)। এটি কেবল জীবনের ঐতিহাসিক অভিজ্ঞতার জন্য।"
        ],
        examples: [
          {
            ja: "日本[にほん]の温泉[おんせん]に入[はい]ったことがあります。",
            bn: "জাপানের প্রাকৃতিক উষ্ণ প্রস্রবণে (অনসেন) গোসলের অভিজ্ঞতা আছে।",
            en: "I have experienced entering a Japanese hot spring."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "জাপানি সহপাঠীদের সাথে নাত্তো (ফার্মেন্টেড সয়াবিন) খাওয়ার অভিজ্ঞতা নিয়ে আলোচনা।",
      situation_en: "Discussing the experience of eating Natto with Japanese classmates.",
      lines: [
        {
          speaker_ja: "日本人[にほんじん]",
          speaker_en: "Japanese Friend",
          line_ja: "納豆[なっとう]を食[た]べたことがありますか。",
          line_bn: "কখনও নাত্তো খেয়েছেন কি?",
          line_en: "Have you ever eaten Natto?"
        },
        {
          speaker_ja: "自分[じぶん]",
          speaker_en: "Self",
          line_ja: "はい、一度[いちど]食[た]べたことがあります。においが強[つよ]いですね。",
          line_bn: "জি, একবার খেয়ে দেখেছি। গন্ধটা বেশ তীব্র, তাই না?",
          line_en: "Yes, I have eaten it once. The smell is quite strong, isn't it?"
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের প্রাকৃতিক উষ্ণ প্রস্রবণ (Onsen - 温泉) এর আদবকেতা",
      tip_bn: "জাপানের গরম পানির ঝরনা বা অনসেনে প্রবেশের প্রধান শর্ত: বাথটাবে নামার আগে বাইরের শাওয়ারে পুরো শরীর সাবান দিয়ে পুরোপুরি পরিষ্কার করে ধুয়ে নিতে হয়। পানিতে তোয়ালে নামানো বা সাঁতার কাটা নিষেধ। ঐতিহাসিকভাবে অনেক অনসেনে উল্কি বা ট্যাটু (Irezumi) থাকলে প্রবেশে নিষেধাজ্ঞা থাকে।",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "食[た]べたことがあります",
        romaji_input: "tabeta koto ga arimasu",
        target_display: "たべたことがあります",
        meaning_bn: "খেয়েছি (অভিজ্ঞতা আছে)"
      },
      {
        prompt_ja: "一度[いちど]もありません",
        romaji_input: "ichidomo arimasen",
        target_display: "いちどもありません",
        meaning_bn: "একবারও নেই"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L33-1",
        question_ja: "「富士山[ふじさん]に（　）ことがあります」の 空欄[くうらん]に 入[はい]る 正[ただ]しい 言葉[ことば]は どれですか。",
        question_bn: "শূন্যস্থানে সঠিক শব্দ বসান: ふじさんに（　）ことがあります",
        options: [
          "登[のぼ]った (Nobotta)",
          "登[のぼ]る (Noboru)",
          "登[のぼ]り (Nobori)",
          "登[のぼ]って (Nobotte)"
        ],
        correct_index: 0,
        explanation_bn: "অভিজ্ঞতা প্রকাশ করতে ক্রিয়ার た-ফর্ম (Ta-form) বসে: 登ったことがあります (আরোহণ করার অভিজ্ঞতা আছে)।"
      }
    ]
  },

  // --- LESSON 34: 〜たほうがいい ---
  {
    lesson_metadata: {
      lesson_id: "L34",
      lesson_number: 34,
      module_number: 6,
      module_name: "Ability, Past & Casual",
      module_name_bn: "সক্ষমতা, অতীত ও কথ্যরূপ",
      title_ja: "〜たほうがいい",
      title_en: "Giving Advice & Suggestions (-ta hou ga ii)",
      title_bn: "করাই ভালো হবে (পরামর্শ ও উপদেশ)",
      estimated_minutes: 25,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "কাউকে কোনো হিতকর পরামর্শ বা উপদেশ দিতে ক্রিয়াপদের তা-ফর্মের সাথে ほうがいいです যোগ করতে হয় ('করলে ভালো হয়')। আর কোনো কাজ না করার পরামর্শ দিতে নাই-ফর্মের সাথে V-ない ほうがいいです (না করাই ভালো) ব্যবহৃত হয়। যেমন: 'তাড়াতাড়ি ঘুমালে ভালো হয়' -> 早[はや]く寝[ね]たほうがいいです।",
      core_concept_bn: "ইতিবাচক উপদেশ (V-た ほうがいいです) বনাম সতর্কতামূলক উপদেশ (V-ない ほうがいいです)।",
      real_world_context_bn: "অসুস্থ সহকর্মীকে ডাক্তারের কাছে যাওয়ার পরামর্শ দেওয়া, খারাপ আবহাওয়ায় ছাতা নেওয়ার উপদেশ।",
      key_takeaway_bn: "ইতিবাচক উপদেশ: V-た ほうがいい。 নিষেধমূলক উপদেশ: V-ない ほうがいい。"
    },
    vocabulary_scope: [
      {
        word_ja: "薬[くすり]",
        romaji: "kusuri",
        meaning_bn: "ওষুধ",
        meaning_en: "medicine",
        part_of_speech: "noun",
        example_ja: "薬[くすり]を飲[の]んだほうがいいですよ。",
        example_bn: "ওষুধ খেয়ে নিলে ভালো হয়।",
        example_en: "You had better take some medicine."
      },
      {
        word_ja: "無理[むり]［な］",
        romaji: "muri [na]",
        meaning_bn: "অসম্ভব / বাড়াবাড়ি / অতিরিক্ত চাপ",
        meaning_en: "impossible / overwork",
        part_of_speech: "na-adjective",
        example_ja: "無理[むり]をしないほうがいいです。",
        example_bn: "বেশি বাড়াবাড়ি বা চাপ না নেওয়াই ভালো।",
        example_en: "You had better not push yourself too hard."
      },
      {
        word_ja: "熱[ねつ]",
        romaji: "netsu",
        meaning_bn: "জ্বর / তাপমাত্রা",
        meaning_en: "fever / heat",
        part_of_speech: "noun",
        example_ja: "熱[ねつ]がありますから、休[やす]みます。",
        example_bn: "জ্বর থাকায় বিশ্রাম নিব।",
        example_en: "Since I have a fever, I will rest."
      },
      {
        word_ja: "早[はや]く",
        romaji: "hayaku",
        meaning_bn: "তাড়াতাড়ি / দ্রুত",
        meaning_en: "early / quickly",
        part_of_speech: "adverb",
        example_ja: "早[はや]く帰[かえ]ったほうがいいです。",
        example_bn: "তাড়াতাড়ি বাসায় ফিরে যাওয়া ভালো।",
        example_en: "You had better go home early."
      }
    ],
    kanji_scope: [
      {
        kanji: "早",
        onyomi: "ソウ, サッ",
        kunyomi: "はや・い, はや・まる",
        meaning_bn: "তাড়াতাড়ি / প্রত্যুষ",
        meaning_en: "early / fast",
        stroke_count: 6,
        compounds: [
          { word_ja: "早[はや]く", meaning_bn: "তাড়াতাড়ি", meaning_en: "early / fast" },
          { word_ja: "早朝[そうちょう]", meaning_bn: "ভোরবেলা", meaning_en: "early morning" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G34-1",
        pattern_ja: "V-た ほうがいいです / V-ない ほうがいいです",
        pattern_bn: "করাই ভালো হবে / না করাই ভালো হবে",
        explanation_bn: "দুটি সম্ভাব্য কাজের মধ্যে যেটি তুলনামূলক কল্যাণকর তা বেছে নেওয়ার দৃঢ় পরামর্শ। সাধারণ পরামর্শের চেয়ে এটি কিছুটা জোরালো উপদেশ।",
        common_pitfalls: [
          "উর্ধ্বতন কাউকে বা সম্মানিত শিক্ষককে সরাসরি 〜たほうがいいです বললে তা উদ্ধত শোনাতে পারে।"
        ],
        examples: [
          {
            ja: "病院[びょういん]へ行[い]ったほうがいいですよ。",
            bn: "হাসপাতালে যাওয়াটাই বুদ্ধিমানের কাজ হবে।",
            en: "You had better go to the hospital."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "কাজের জায়গায় অসুস্থ বোধ করা সহকর্মীকে বিশ্রাম নেওয়ার পরামর্শ দেওয়া।",
      situation_en: "Advising a sick colleague at work to take rest and go home.",
      lines: [
        {
          speaker_ja: "同僚[どうりょう]",
          speaker_en: "Colleague",
          line_ja: "顔色[かおいろ]が悪[わる]いですね。大丈夫[だいじょうぶ]ですか。",
          line_bn: "চেহারা ফ্যাকাশে লাগছে তো। শরীর ঠিক আছে?",
          line_en: "You look pale. Are you alright?"
        },
        {
          speaker_ja: "自分[じぶん]",
          speaker_en: "Self",
          line_ja: "少[すこ]し熱[ねつ]があります。",
          line_bn: "সামান্য জ্বর এসেছে।",
          line_en: "I have a slight fever."
        },
        {
          speaker_ja: "同僚[どうりょう]",
          speaker_en: "Colleague",
          line_ja: "無理[むり]をしないで、今日[きょう]は早[はや]く帰[かえ]ったほうがいいですよ。",
          line_bn: "বেশি চাপ নেবেন না, আজ তাড়াতাড়ি বাসায় ফিরে বিশ্রাম নেওয়াই ভালো হবে।",
          line_en: "Don't push yourself, you had better go home early today."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের অসুস্থতার ছুটি (Kekkin - 欠勤) ও ডাক্তারদের ডায়াগনসিস সার্টিফিকেট",
      tip_bn: "জাপানে অসুস্থ হয়ে কাজে বা স্কুলে অনুপস্থিত থাকলে '欠勤' (Kekkin) বলে। তবে টানা দুই বা তিন দিন অনুপস্থিত থাকলে ক্লিনিক বা হাসপাতাল থেকে চিকিৎসকের প্রত্যয়নপত্র (Shindansho - 診断書) জমা দেওয়া বাধ্যতামূলক। এটি ছাড়া চাকরি বা স্কলারশিপে জটিলতা তৈরি হতে পারে।",
      category: "Workplace"
    },
    typing_practice: [
      {
        prompt_ja: "病院[びょういん]へ行[い]ったほうがいいです",
        romaji_input: "byouin e itta hou ga ii desu",
        target_display: "びょういんへいったほうがいいです",
        meaning_bn: "হাসপাতালে যাওয়াই ভালো"
      },
      {
        prompt_ja: "無理[むり]をしないでください",
        romaji_input: "muri o shinaide kudasai",
        target_display: "むりをしないでください",
        meaning_bn: "চাপ নেবেন না"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L34-1",
        question_ja: "「早[はや]く 寝[ね]（　）ほうがいいです」の 空欄[くうらん]に 入[はい]る 正[ただ]しい 言葉[ことば]は どれですか。",
        question_bn: "শূন্যস্থানে সঠিক শব্দ বসান: はやく ね（　）ほうがいいです",
        options: [
          "た",
          "る",
          "て",
          "ます"
        ],
        correct_index: 0,
        explanation_bn: "ইতিবাচক পরামর্শ বা উপদেশের গঠনে ক্রিয়ার た-ফর্ম বসে: 早く寝たほうがいいです (তাড়াতাড়ি ঘুমানোই ভালো)।"
      }
    ]
  },

  // --- LESSON 35: 普通形/Casual ---
  {
    lesson_metadata: {
      lesson_id: "L35",
      lesson_number: 35,
      module_number: 6,
      module_name: "Ability, Past & Casual",
      module_name_bn: "সক্ষমতা, অতীত ও কথ্যরূপ",
      title_ja: "普通形[ふつうけい] (Casual Plain Form)",
      title_en: "Plain Form & Casual Speech (Futsuukei)",
      title_bn: "কথ্যরূপ ও সাধারণ রূপ (তাত্ক্ষণিক জাপানি)",
      estimated_minutes: 25,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "জাপানি ভাষায় দুই ধরনের বাচনভঙ্গি রয়েছে: ১. বিনম্র রূপ (丁寧体 - Teineitai: です/ます), যা অপরিচিত, শিক্ষক বা জ্যেষ্ঠদের সাথে ব্যবহৃত হয়, এবং ২. সাধারণ বা কথ্য রূপ (普通体 - Futsūtai), যা সমবয়সী বন্ধু, পরিবার ও ঘনিষ্ঠদের সাথে ব্যবহৃত হয়। ডিকশনারি রূপ, নাই-ফর্ম, তা-ফর্ম এবং নাকাত্তা-ফর্ম মিলে এই কথ্য রূপ গঠিত হয়।",
      core_concept_bn: "বিনম্র です/ます বনাম কথ্য সাধারণ রূপ (Plain Form) এর চার রূপের ছক।",
      real_world_context_bn: "জাপানি বন্ধুদের সাথে অনানুষ্ঠানিক আড্ডা, জাপানি সোশ্যাল মিডিয়া ও অ্যানিমের সংলাপ বোঝা।",
      key_takeaway_bn: "Present: 食べる / 食べない。 Past: 食べた / 食べなかった。 Noun/Na-adj: だ / じゃない / だった / じゃなかった。"
    },
    vocabulary_scope: [
      {
        word_ja: "うん",
        romaji: "un",
        meaning_bn: "হ্যাঁ (কথ্য/অনানুষ্ঠানিক)",
        meaning_en: "yeah / yes (casual)",
        part_of_speech: "interjection",
        example_ja: "うん、行[い]く！",
        example_bn: "হ্যাঁ, যাব!",
        example_en: "Yeah, I'll go!"
      },
      {
        word_ja: "ううん",
        romaji: "uun",
        meaning_bn: "না (কথ্য/অনানুষ্ঠানিক)",
        meaning_en: "nah / no (casual)",
        part_of_speech: "interjection",
        example_ja: "ううん、行[い]かない。",
        example_bn: "না, যাব না।",
        example_en: "Nah, I won't go."
      },
      {
        word_ja: "暇[ひま]［な］",
        romaji: "hima [na]",
        meaning_bn: "অবসর / অফুরন্ত সময়",
        meaning_en: "free time / idle",
        part_of_speech: "na-adjective",
        example_ja: "明日[あした]暇[ひま]？",
        example_bn: "কাল কি ফ্রি আছিস?",
        example_en: "Are you free tomorrow?"
      },
      {
        word_ja: "本当[ほんとう]？",
        romaji: "hontō?",
        meaning_bn: "সত্যিই?",
        meaning_en: "Really?",
        part_of_speech: "expression",
        example_ja: "本当[ほんとう]？すごいね！",
        example_bn: "সত্যিই? দারুণ তো!",
        example_en: "Really? That's awesome!"
      }
    ],
    kanji_scope: [
      {
        kanji: "通",
        onyomi: "ツウ",
        kunyomi: "とお・る, かよ・う",
        meaning_bn: "যাতায়াত / সাধারণ / পথ",
        meaning_en: "pass through / commute",
        stroke_count: 10,
        compounds: [
          { word_ja: "普通[ふつう]", meaning_bn: "সাধারণ / স্বাভাবিক", meaning_en: "normal / ordinary" },
          { word_ja: "交通[こうつう]", meaning_bn: "যোগাযোগ / ট্রাফিক", meaning_en: "transportation" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G35-1",
        pattern_ja: "普通体[ふつうたい] (Casual Conversational Style)",
        pattern_bn: "কথ্য জাপানির নিয়মাবলী (Plain Form)",
        explanation_bn: "কথ্য ভাষায় প্রশ্নবোধক 'か' সাধারণত বাদ দিয়ে বাক্যের শেষ স্বর ঊর্ধ্বমুখী (Rising intonation) করে প্রশ্ন করা হয়। যেমন: ごはん食[た]べる？ (ভাত খাবি?)। Noun এর শেষে 'だ' অনেক সময় বাদ দেওয়া হয়।",
        common_pitfalls: [
          "শিক্ষক বা সুপারভাইজারের সাথে কখনো সাধারণ কথ্য রূপ (Tameguchi) ব্যবহার করবেন না, এটি চরম অভদ্রতা।"
        ],
        examples: [
          {
            ja: "今晩[こんばん]映画[えいが]見[み]る？ うん、見[み]る！",
            bn: "আজ রাতে সিনেমা দেখবি? হ্যাঁ, দেখব!",
            en: "Wanna watch a movie tonight? Yeah, I'll watch!"
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "ক্যাম্পাসে দুই অন্তরঙ্গ বন্ধুর ক্যাজুয়াল কথোপকথন।",
      situation_en: "Casual chatting between close friends on university campus.",
      lines: [
        {
          speaker_ja: "ケン[けん]",
          speaker_en: "Ken",
          line_ja: "今日[きょう]のテスト、どうだった？",
          line_bn: "আজকের পরীক্ষা কেমন হলো রে?",
          line_en: "How was today's exam?"
        },
        {
          speaker_ja: "タニム[たにむ]",
          speaker_en: "Tanim",
          line_ja: "ちょっと難[むずか]しかったけど、大丈夫[だいじょうぶ]だった。",
          line_bn: "একটু কঠিন ছিল, তবে সামলে নিয়েছি।",
          line_en: "It was a bit difficult, but it was alright."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "উর্ধ্বতন বনাম সমবয়সী: তামেগুচি (タメ口) এর সীমারেখা",
      tip_bn: "জাপানি সমাজে সম্মান ও সমবয়সীতার দেয়াল অত্যন্ত সুনির্দিষ্ট। বন্ধুদের সাথে ব্যবহৃত ভাষাকে 'Tameguchi' (タメ口 - সমকক্ষীয় ভাষা) বলে। এমনকি ১ বছরের সিনিয়র (Senpai - 先輩) হলেও কর্মক্ষেত্র বা ক্লাবে 'Desu/Masu' ফর্মের সম্মানসূচক ভাষা ব্যবহার বাধ্যতামূলক।",
      category: "Workplace"
    },
    typing_practice: [
      {
        prompt_ja: "明日[あした]暇[ひま]？",
        romaji_input: "ashita hima?",
        target_display: "あしたひま？",
        meaning_bn: "কাল কি ফ্রি আছিস?"
      },
      {
        prompt_ja: "うん、分[わ]かった",
        romaji_input: "un, wakatta",
        target_display: "うん、わかった",
        meaning_bn: "হ্যাঁ, বুঝেছি"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L35-1",
        question_ja: "「食[た]べません」の 普通形[ふつうけい]（Plain Form）は どれですか。",
        question_bn: "‘たべません’ এর কথ্য সাধারণ রূপ (Plain Form) কোনটি?",
        options: [
          "たべない (Tabenai)",
          "たべる (Taberu)",
          "たべた (Tabeta)",
          "たべなかった (Tabenakatta)"
        ],
        correct_index: 0,
        explanation_bn: "ます-ফর্মের বর্তমান না-বোধক রূপ 〜ません এর কথ্য রূপ হলো 〜ない (নাই-ফর্ম): 食べない。"
      }
    ]
  }
];
