// Module 5: Te-Form Revolution (Lessons 26 - 30)
module.exports = [
  // --- LESSON 26: 食べてください ---
  {
    lesson_metadata: {
      lesson_id: "L26",
      lesson_number: 26,
      module_number: 5,
      module_name: "Te-Form Revolution",
      module_name_bn: "তে-ফর্ম বিপ্লব",
      title_ja: "食[た]べてください",
      title_en: "Te-Form Conjugation & Polite Requests",
      title_bn: "দয়া করে খান (তে-ফর্ম রূপান্তর ও বিনীত অনুরোধ)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "জাপানি ব্যাকরণের সবচেয়ে গুরুত্বপূর্ণ মাইলফলক হলো 'তে-ফর্ম' (て形 - Te-form)। ক্রিয়াপদকে গ্রুপ ১, ২ এবং ৩ অনুযায়ী তে-ফর্মে রূপান্তর করতে হয়। তে-ফর্মের সাথে ください (kudasai) যোগ করলে বিনীত অনুরোধ তৈরি হয় ('দয়া করে করুন')। যেমন: 食[た]べます -> 食[た]べてください (দয়া করে খান)।",
      core_concept_bn: "গ্রুপ ১ (U-verbs), গ্রুপ ২ (Ru-verbs) ও গ্রুপ ৩ (Irregular) এর তে-ফর্ম গঠন এবং 〜てください।",
      real_world_context_bn: "দোকানে কোনো জিনিস দেখতে চাওয়া, ট্যাক্সি ড্রাইভারকে থামতে বলা এবং ক্লাসে শিক্ষকের নির্দেশনা শোনা।",
      key_takeaway_bn: "Group 1: い・ち・り->って, み・び・に->んで, き->いて, ぎ->いで, し->して。 Group 2: ます->て。 Group 3: して, きて。"
    },
    vocabulary_scope: [
      {
        word_ja: "食[た]べてください",
        romaji: "tabete kudasai",
        meaning_bn: "দয়া করে খান",
        meaning_en: "please eat",
        part_of_speech: "expression",
        example_ja: "どうぞ食[た]べてください。",
        example_bn: "অনুগ্রহ করে খান।",
        example_en: "Please eat, go ahead."
      },
      {
        word_ja: "待[ま]ちます",
        romaji: "machimasu",
        meaning_bn: "অপেক্ষা করা",
        meaning_en: "to wait",
        part_of_speech: "verb",
        example_ja: "少々[しょうしょう]お待[ま]ちください。",
        example_bn: "অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।",
        example_en: "Please wait a moment."
      },
      {
        word_ja: "見[み]せてください",
        romaji: "misete kudasai",
        meaning_bn: "দয়া করে দেখান",
        meaning_en: "please show me",
        part_of_speech: "expression",
        example_ja: "パスポートを見[み]せてください。",
        example_bn: "দয়া করে পাসপোর্ট দেখান।",
        example_en: "Please show me your passport."
      },
      {
        word_ja: "教[おし]えてください",
        romaji: "oshiete kudasai",
        meaning_bn: "দয়া করে বলে দিন / শিখিয়ে দিন",
        meaning_en: "please teach / tell me",
        part_of_speech: "expression",
        example_ja: "電話番号[でんわばんごう]を教[おし]えてください。",
        example_bn: "দয়া করে ফোন নম্বরটি বলুন।",
        example_en: "Please tell me your phone number."
      },
      {
        word_ja: "急[いそ]ぎます",
        romaji: "isogimasu",
        meaning_bn: "তাড়াতাড়ি করা",
        meaning_en: "to hurry",
        part_of_speech: "verb",
        example_ja: "時間[じかん]がありませんから、急[いそ]いでください。",
        example_bn: "সময় নেই বলে অনুগ্রহ করে তাড়াতাড়ি করুন।",
        example_en: "Please hurry, as there is no time."
      }
    ],
    kanji_scope: [
      {
        kanji: "待",
        onyomi: "タイ",
        kunyomi: "ま・つ",
        meaning_bn: "অপেক্ষা করা",
        meaning_en: "wait",
        stroke_count: 9,
        compounds: [
          { word_ja: "待[ま]ちます", meaning_bn: "অপেক্ষা করা", meaning_en: "to wait" },
          { word_ja: "招待[しょうたい]", meaning_bn: "আমন্ত্রণ", meaning_en: "invitation" }
        ]
      },
      {
        kanji: "教",
        onyomi: "キョウ",
        kunyomi: "おし・える, おそ・わる",
        meaning_bn: "শেখানো / উপদেশ",
        meaning_en: "teach / tell",
        stroke_count: 11,
        compounds: [
          { word_ja: "教[おし]えます", meaning_bn: "শেখানো", meaning_en: "to teach" },
          { word_ja: "教室[きょうしつ]", meaning_bn: "শ্রেণিকক্ষ", meaning_en: "classroom" },
          { word_ja: "教科書[きょうかしょ]", meaning_bn: "পাঠ্যবই", meaning_en: "textbook" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G26-1",
        pattern_ja: "V-て ください",
        pattern_bn: "দয়া করে [কাজ] করুন (Polite Request)",
        explanation_bn: "ক্রিয়াপদের তে-ফর্মের পর ください যোগ করলে বিনম্র নির্দেশ বা অনুরোধ প্রকাশ পায়। এটি জাপানের দৈনন্দিন জীবনে সর্বাধিক ব্যবহৃত এক্সপ্রেশন।",
        common_pitfalls: [
          "行きます এর তে-ফর্ম 行いて নয়, অনিয়মিত রূপ: 行って (itte)!"
        ],
        examples: [
          {
            ja: "ここにお名前[なまえ]を書[か]いてください。",
            bn: "এখানে দয়া করে আপনার নাম লিখুন।",
            en: "Please write your name here."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "জাপানের সিটি অফিসে (Kuyakusho) ঠিকানা নিবন্ধনের ফর্ম পূরণ।",
      situation_en: "Filling out an address registration form at a Tokyo city office.",
      lines: [
        {
          speaker_ja: "職員[しょくいん]",
          speaker_en: "Official",
          line_ja: "この用紙[ようし]に住所[じゅうしょ]と名前[なまえ]を書[か]いてください。",
          line_bn: "দয়া করে এই ফর্মে আপনার ঠিকানা ও নাম লিখুন।",
          line_en: "Please write your address and name on this form."
        },
        {
          speaker_ja: "自分[じぶん]",
          speaker_en: "Self",
          line_ja: "はい、分[わ]かりました。黒[くろ]いペンを使[つか]ってもいいですか。",
          line_bn: "জি, বুঝতে পেরেছি। কালো কলম কি ব্যবহার করতে পারি?",
          line_en: "Yes, understood. May I use a black pen?"
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "সিটি অফিসে বসবাস নিবন্ধন (Juminhyo - 住民票) ও মাই নাম্বার কার্ড",
      tip_bn: "জাপানে পৌঁছানোর ১৪ দিনের মধ্যে নিজের এলাকার ওয়ার্ড অফিস বা সিটি হলে গিয়ে ঠিকানার নিবন্ধন (Juusho Touroku) সম্পন্ন করতে হয়। এর ফলে রেসিডেন্স কার্ডের পেছনে ঠিকানা প্রিন্ট হয় এবং 'My Number' ব্যক্তিগত নম্বর বরাদ্দ হয়। এটি ছাড়া জাপানে কোনো ব্যাংক অ্যাকাউন্ট খোলা বা সিম কার্ড কেনা অসম্ভব!",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "食[た]べてください",
        romaji_input: "tabete kudasai",
        target_display: "たべてください",
        meaning_bn: "দয়া করে খান"
      },
      {
        prompt_ja: "待[ま]ってください",
        romaji_input: "matte kudasai",
        target_display: "まってください",
        meaning_bn: "দয়া করে অপেক্ষা করুন"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L26-1",
        question_ja: "「書[か]きます」の て形[がた]は どれですか。",
        question_bn: "‘かきます’ (লেখা) এর সঠিক তে-ফর্ম কোনটি?",
        options: [
          "かいて (Kaite)",
          "かって (Katte)",
          "かして (Kashite)",
          "かんで (Kande)"
        ],
        correct_index: 0,
        explanation_bn: "গ্রুপ ১ এর 'き' যুক্ত ক্রিয়া তে-ফর্মে 'いて' তে রূপান্তরিত হয়: 書きます -> 書いて。"
      }
    ]
  },

  // --- LESSON 27: 今何をしていますか ---
  {
    lesson_metadata: {
      lesson_id: "L27",
      lesson_number: 27,
      module_number: 5,
      module_name: "Te-Form Revolution",
      module_name_bn: "তে-ফর্ম বিপ্লব",
      title_ja: "今[いま]何[なに]をしていますか",
      title_en: "Present Continuous & Resultant States (-te imasu)",
      title_bn: "এখন কী করছেন? (ঘটমান বর্তমান ও অবস্থা)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "তে-ফর্মের সাথে います যোগ করলে দুটি অর্থ তৈরি হয়: ১. বর্তমানে কোনো কাজ চলমান থাকা (ঘটমান বর্তমান: 'পড়ছি' = 勉強[べんきょう]しています), এবং ২. অতীতের কোনো কাজের ফলাফল বর্তমানে স্থায়ী রূপ ধারণ করা (অবস্থা: 'বিয়ে করেছি' = 結婚[けっこん]しています, 'টোকিওতে বাস করছি' = 住[す]んでいます)।",
      core_concept_bn: "ঘটমান বর্তমান কাল এবং অপরিবর্তনীয় স্থায়ী অবস্থার রূপ 〜ています।",
      real_world_context_bn: "ফোনে কথা বলার সময় কী করছেন তা জানানো, নিজের চাকরি বা বাসস্থানের অবস্থা বর্ণনা করা।",
      key_takeaway_bn: "V-て います (ঘটমান বর্তমান বা ফলাফলসূচক অবস্থা)।"
    },
    vocabulary_scope: [
      {
        word_ja: "しています",
        romaji: "shite imasu",
        meaning_bn: "করছি / করছে",
        meaning_en: "is doing",
        part_of_speech: "verb phrase",
        example_ja: "今[いま]何[なに]をしていますか。",
        example_bn: "এখন কী করছেন?",
        example_en: "What are you doing now?"
      },
      {
        word_ja: "住[す]んでいます",
        romaji: "sunde imasu",
        meaning_bn: "বসবাস করছি",
        meaning_en: "living / residing",
        part_of_speech: "verb phrase",
        example_ja: "東京[とうきょう]に住[す]んでいます。",
        example_bn: "টোকিওতে বাস করি।",
        example_en: "I live in Tokyo."
      },
      {
        word_ja: "働[はたら]いています",
        romaji: "hataraite imasu",
        meaning_bn: "কাজ করছি / কর্মরত আছি",
        meaning_en: "working",
        part_of_speech: "verb phrase",
        example_ja: "IT会社[かいしゃ]で働[はたら]いています。",
        example_bn: "আইটি কোম্পানিতে কাজ করছি।",
        example_en: "I am working at an IT company."
      },
      {
        word_ja: "知[し]っています",
        romaji: "shitte imasu",
        meaning_bn: "জানি / পরিচিত",
        meaning_en: "know / acquainted with",
        part_of_speech: "verb phrase",
        example_ja: "田中[たなか]さんを知[し]っていますか。",
        example_bn: "তানাকা সাহেবকে চেনেন কি?",
        example_en: "Do you know Mr. Tanaka?"
      },
      {
        word_ja: "持[も]っています",
        romaji: "motte imasu",
        meaning_bn: "অধিকারী হওয়া / কাছে থাকা",
        meaning_en: "have / possess",
        part_of_speech: "verb phrase",
        example_ja: "スマートフォンを持[も]っています。",
        example_bn: "স্মার্টফোন আছে।",
        example_en: "I have a smartphone."
      }
    ],
    kanji_scope: [
      {
        kanji: "住",
        onyomi: "ジュウ",
        kunyomi: "す・む, す・まう",
        meaning_bn: "বসবাস / আবাসন",
        meaning_en: "dwell / live",
        stroke_count: 7,
        compounds: [
          { word_ja: "住[す]んでいます", meaning_bn: "বাস করি", meaning_en: "living" },
          { word_ja: "住所[じゅうしょ]", meaning_bn: "ঠিকানা", meaning_en: "address" }
        ]
      },
      {
        kanji: "知",
        onyomi: "チ",
        kunyomi: "し・る, し・らせる",
        meaning_bn: "জানা / জ্ঞান",
        meaning_en: "know / wisdom",
        stroke_count: 8,
        compounds: [
          { word_ja: "知[し]っています", meaning_bn: "জানি", meaning_en: "know" },
          { word_ja: "知人[ちじん]", meaning_bn: "পরিচিত ব্যক্তি", meaning_en: "acquaintance" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G27-1",
        pattern_ja: "V-て います (進行中[しんこうちゅう] & 状態[じょうたい])",
        pattern_bn: "ঘটমান বর্তমান কাল অথবা ফলাফলসূচক অবস্থা",
        explanation_bn: "১. চলমান কাজ: 今[いま]本[ほん]を読[よ]んでいます (এখন বই পড়ছি)। ২. অবস্থা: 知[し]っています (জানি)। তবে 'জানি না' এর ক্ষেত্রে 知りません বলতে হয় (知っていません নয়)।",
        common_pitfalls: [
          "知っていますか এর না-বোধক উত্তর 'いいえ、知りません' (いいえ、知っていません সম্পূর্ণ ভুল)!"
        ],
        examples: [
          {
            ja: "雨[あめ]が降[ふ]っています。",
            bn: "বৃষ্টি পড়ছে।",
            en: "It is raining."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "ফোনে সহপাঠীর সাথে বর্তমান কাজ নিয়ে কথা বলা।",
      situation_en: "Phone conversation with a classmate about current activities.",
      lines: [
        {
          speaker_ja: "ラヒム[らひむ]",
          speaker_en: "Rahim",
          line_ja: "もしもし、今[いま]何[なに]をしていますか。",
          line_bn: "হ্যালো, এখন কী করছেন?",
          line_en: "Hello, what are you doing right now?"
        },
        {
          speaker_ja: "タニム[たにむ]",
          speaker_en: "Tanim",
          line_ja: "日本語[にほんご]の宿題[しゅくだい]をしています。そちらは？",
          line_bn: "জাপানি ভাষার হোমওয়ার্ক করছি। আপনি?",
          line_en: "I am doing Japanese homework. How about you?"
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানে ফোনে কথা বলার অভিবাদন: মোশিমোশি (もしもし)",
      tip_bn: "জাপানে ফোনে কল রিসিভ করলে বা কথা শুরু করার সময় 'もしもし' (Moshimoshi) বলা সার্বজনীন নিয়ম। তবে কোনো কোম্পানির আনুষ্ঠানিক বা ব্যবসায়িক কলে 'もしもし' না বলে 'はい、〇〇でございます' (জি, আমি অমুক বলছি) বলা বিধেয়।",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "何[なに]をしていますか",
        romaji_input: "nani o shite imasu ka",
        target_display: "なにをしていますか",
        meaning_bn: "কী করছেন?"
      },
      {
        prompt_ja: "東京[とうきょう]に住[す]んでいます",
        romaji_input: "toukyou ni sunde imasu",
        target_display: "とうきょうにすんでいます",
        meaning_bn: "টোকিওতে বাস করি"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L27-1",
        question_ja: "「知[し]っていますか」の 否定[ひてい]の 返事[へんじ]は どれですか。",
        question_bn: "‘しっていますか’ (জানেন কি?) এর সঠিক না-বোধক উত্তর কোনটি?",
        options: [
          "いいえ、知[し]りません",
          "いいえ、知[し]っていません",
          "いいえ、知[し]らないでした",
          "いいえ、知[し]りませんでした"
        ],
        correct_index: 0,
        explanation_bn: "知っています এর না-বোধক উত্তর হয় 'いいえ、知りません'।"
      }
    ]
  },

  // --- LESSON 28: 入ってもいいですか ---
  {
    lesson_metadata: {
      lesson_id: "L28",
      lesson_number: 28,
      module_number: 5,
      module_name: "Te-Form Revolution",
      module_name_bn: "তে-ফর্ম বিপ্লব",
      title_ja: "入[はい]ってもいいですか",
      title_en: "Permission (-te mo ii desu ka) & Prohibition (-te wa ikemasen)",
      title_bn: "প্রবেশ করতে পারি কি? (অনুমতি ও নিষেধ)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "কারো কাছে কোনো কাজ করার অনুমতি চাইতে তে-ফর্মের পর 〜もいいですか যোগ করতে হয় ('করলে কি ভালো হয়/অনুমতি আছে?')। যেমন: 'ছবি তুলতে পারি কি?' -> 写真[しゃしん]を撮[と]ってもいいですか। পক্ষান্তরে কোনো কাজ কঠোরভাবে নিষিদ্ধ করতে তে-ফর্মের পর 〜はいけません (করা যাবে না / নিষেধ) ব্যবহৃত হয়।",
      core_concept_bn: "অনুমতি প্রার্থনা (〜てもいいですか) বনাম কঠোর নিষেধাজ্ঞা (〜てはいけません)।",
      real_world_context_bn: "জাদুঘর বা মন্দিরে ছবি তোলার অনুমতি নেওয়া, লাইব্রেরিতে কথা না বলার নিয়ম এবং শ্রেণীকক্ষে প্রবেশ।",
      key_takeaway_bn: "V-て もいいですか (অনুমতি)। V-て はいけません (নিষেধ)।"
    },
    vocabulary_scope: [
      {
        word_ja: "入[はい]ります",
        romaji: "hairimasu",
        meaning_bn: "প্রবেশ করা",
        meaning_en: "to enter",
        part_of_speech: "verb",
        example_ja: "部屋[へや]に入[はい]ってもいいですか。",
        example_bn: "ঘরে কি প্রবেশ করতে পারি?",
        example_en: "May I enter the room?"
      },
      {
        word_ja: "撮[と]ります",
        romaji: "torimasu",
        meaning_bn: "তোলা (ছবি তোলা)",
        meaning_en: "to take (photo)",
        part_of_speech: "verb",
        example_ja: "写真[しゃしん]を撮[と]ってもいいですか。",
        example_bn: "ছবি তুলতে পারি কি?",
        example_en: "May I take a photo?"
      },
      {
        word_ja: "吸[す]います",
        romaji: "suimasu",
        meaning_bn: "টানা / সেবন করা (ধূমপান)",
        meaning_en: "to smoke / inhale",
        part_of_speech: "verb",
        example_ja: "ここでたばこを吸[す]ってはいけません。",
        example_bn: "এখানে ধূমপান করা নিষেধ।",
        example_en: "You must not smoke here."
      },
      {
        word_ja: "使[つか]います",
        romaji: "tsukaimasu",
        meaning_bn: "ব্যবহার করা",
        meaning_en: "to use",
        part_of_speech: "verb",
        example_ja: "このペンを使[つか]ってもいいですよ。",
        example_bn: "এই কলমটি ব্যবহার করতে পারেন।",
        example_en: "You may use this pen."
      },
      {
        word_ja: "座[すわ]ります",
        romaji: "suwarimasu",
        meaning_bn: "বসা",
        meaning_en: "to sit down",
        part_of_speech: "verb",
        example_ja: "ここに座[すわ]ってもいいですか。",
        example_bn: "এখানে কি বসতে পারি?",
        example_en: "May I sit here?"
      }
    ],
    kanji_scope: [
      {
        kanji: "入",
        onyomi: "ニュウ",
        kunyomi: "はい・る, い・る, い・れる",
        meaning_bn: "প্রবেশ / ঢোকা",
        meaning_en: "enter / insert",
        stroke_count: 2,
        compounds: [
          { word_ja: "入[はい]ります", meaning_bn: "প্রবেশ করা", meaning_en: "to enter" },
          { word_ja: "入口[いりぐち]", meaning_bn: "প্রবেশদ্বার", meaning_en: "entrance" },
          { word_ja: "入学[にゅうがく]", meaning_bn: "স্কুল/ভার্সিটিতে ভর্তি", meaning_en: "school admission" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G28-1",
        pattern_ja: "V-て もいいですか",
        pattern_bn: "করলে কি অনুমতি আছে? (Asking Permission)",
        explanation_bn: "বিনম্রভাবে সম্মতি চাওয়ার সবচেয়ে নিরাপদ ভাষা। উত্তরে 'はい、いいですよ' (হ্যাঁ, পারেন) অথবা না হলে 'すみません、ちょっと...' (মাফ করবেন, আসলে...) বলে কারণ ব্যাখ্যা করা হয়।",
        common_pitfalls: [
          "সরাসরি 'いいえ、だめです' বলা জাপানি শিষ্টাচারে অত্যন্ত রূঢ় শোনায়।"
        ],
        examples: [
          {
            ja: "窓[まど]を開[あ]けてもいいですか。",
            bn: "জানালাটি কি খুলতে পারি?",
            en: "May I open the window?"
          }
        ]
      },
      {
        point_id: "G28-2",
        pattern_ja: "V-て はいけません",
        pattern_bn: "করা সম্পূর্ণ নিষেধ (Prohibition)",
        explanation_bn: "আইন, নিয়ম বা বিধিনিষেধ প্রকাশ করতে ব্যবহৃত হয়। সাইনবোর্ড বা নির্দেশনায় ব্যাপকভাবে দেখা যায়।",
        common_pitfalls: [
          "উর্ধ্বতন কাউকে বা সম্মানিত অতিথিকে সরাসরি てはいけません বলা উচিত নয়।"
        ],
        examples: [
          {
            ja: "美術館[びじゅつかん]で写真[しゃしん]を撮[と]ってはいけません。",
            bn: "আর্ট মিউজিয়ামে ছবি তোলা সম্পূর্ণ নিষেধ।",
            en: "You must not take photos in the art museum."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "টোকিওর আসাকুসা সেনসোজি মন্দিরের ভেতরের হলরুমে ছবি তোলার নিয়ম জানা।",
      situation_en: "Asking about photography rules inside Asakusa Sensoji Temple hall.",
      lines: [
        {
          speaker_ja: "観光客[かんこうきゃく]",
          speaker_en: "Tourist",
          line_ja: "すみません、ここで写真[しゃしん]を撮[と]ってもいいですか。",
          line_bn: "মাফ করবেন, এখানে কি ছবি তুলতে পারি?",
          line_en: "Excuse me, may I take pictures here?"
        },
        {
          speaker_ja: "警備員[けいびいん]",
          speaker_en: "Guard",
          line_ja: "申[もう]し訳[わけ]ありませんが、本堂[ほんどう]の中[なか]では撮[と]ってはいけません。",
          line_bn: "আন্তরিক দুঃখ প্রকাশ করছি, তবে মূল হলের ভেতরে ছবি তোলা নিষেধ।",
          line_en: "I am sorry, but taking photos is prohibited inside the main hall."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের রাস্তায় প্রকাশ্য ধূমপানের ওপর কঠোর নিষেধাজ্ঞা (Aruki-tabako)",
      tip_bn: "টোকিও এবং জাপানের প্রায় সব প্রধান শহরে রাস্তায় হাঁটতে হাঁটতে সিগারেট খাওয়া (Aruki-tabako) আইনত দণ্ডনীয় অপরাধ। এর জন্য নগদ ২,০০০ থেকে ২০,০০০ ইয়েন পর্যন্ত স্পট ফাইন হতে পারে। কেবল কাঁচঘেরা নির্দিষ্ট স্মোকিং জোনেই (Kitsuen-jo - 喫煙所) ধূমপানের অনুমতি রয়েছে।",
      category: "Manners"
    },
    typing_practice: [
      {
        prompt_ja: "入[はい]ってもいいですか",
        romaji_input: "haittemo ii desu ka",
        target_display: "はいってもいいですか",
        meaning_bn: "ঢুকতে পারি কি?"
      },
      {
        prompt_ja: "写真[しゃしん]を撮[と]ってはいけません",
        romaji_input: "shashin o totte wa ikemasen",
        target_display: "しゃしんをとってはいけません",
        meaning_bn: "ছবি তোলা নিষেধ"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L28-1",
        question_ja: "「写真[しゃしん]を 撮[と]ってもいいですか」の 意味[いみ]は どれですか。",
        question_bn: "‘しゃしんをとってもいいですか’ এর বাংলা অর্থ কোনটি?",
        options: [
          "ছবি তুলতে পারি কি? (May I take a photo?)",
          "ছবি তুলবেন না (Do not take a photo)",
          "ছবি তুলতে চাই (I want to take a photo)",
          "ছবি তুলেছি (I took a photo)"
        ],
        correct_index: 0,
        explanation_bn: "〜てもいいですか অনুমতি চাওয়ার গঠন, তাই বাক্যটির অর্থ 'ছবি তুলতে পারি কি?'।"
      }
    ]
  },

  // --- LESSON 29: 食べてから行きます ---
  {
    lesson_metadata: {
      lesson_id: "L29",
      lesson_number: 29,
      module_number: 5,
      module_name: "Te-Form Revolution",
      module_name_bn: "তে-ফর্ম বিপ্লব",
      title_ja: "食[た]べてから行[い]きます",
      title_en: "Sequential Actions (-te kara & clause chaining)",
      title_bn: "খেয়ে তারপর যাব (ধারাবাহিক কর্ম ও সংযোগ)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "একাধিক কাজ ক্রমানুসারে একের পর এক সম্পন্ন হলে বাক্যগুলোকে তে-ফর্ম (〜て、〜て) দিয়ে যুক্ত করা হয়। আর কোনো একটি কাজ সুনির্দিষ্টভাবে সম্পূর্ণ শেষ করার পর পরবর্তী কাজে হাত দেওয়া বোঝাতে V-て から (করার পর) ব্যবহৃত হয়। যেমন: 'হাত ধুয়ে তারপর খাবার খাই' -> 手[て]を洗[あら]ってから食[た]べます।",
      core_concept_bn: "বাক্য সংযোগকারী তে-ফর্ম এবং কালানুক্রমিক কাজ শেষ করে পরবর্তী কাজ (〜てから)।",
      real_world_context_bn: "দিনের একাধিক কাজের শিডিউল ধারাবাহিকভাবে বর্ণনা করা ও নির্দেশনা অনুসরণ।",
      key_takeaway_bn: "V1-てから V2 (১ম কাজ শেষ করে তবেই ২য় কাজ)।"
    },
    vocabulary_scope: [
      {
        word_ja: "洗[あら]います",
        romaji: "araimasu",
        meaning_bn: "ধোয়া / পরিষ্কার করা",
        meaning_en: "to wash",
        part_of_speech: "verb",
        example_ja: "手[て]を洗[あら]ってからごはんを食[た]べます。",
        example_bn: "হাত ধুয়ে তারপর খাবার খাই।",
        example_en: "I wash my hands and then eat a meal."
      },
      {
        word_ja: "浴[あ]びます",
        romaji: "abimasu",
        meaning_bn: "গোসল করা (ঝরনা নেওয়া)",
        meaning_en: "to take (shower)",
        part_of_speech: "verb",
        example_ja: "シャワーを浴[あ]びます。",
        example_bn: "শাওয়ার নিই।",
        example_en: "I take a shower."
      },
      {
        word_ja: "出[で]ます",
        romaji: "demasu",
        meaning_bn: "বের হওয়া / প্রস্থান",
        meaning_en: "to exit / leave",
        part_of_speech: "verb",
        example_ja: "七時[しちじ]に家[いえ]を出[で]ます。",
        example_bn: "সাতটায় বাড়ি থেকে বের হই।",
        example_en: "I leave the house at 7."
      },
      {
        word_ja: "乗[の]り換[か]えます",
        romaji: "norikaemasu",
        meaning_bn: "ট্রেন / বাস বদল করা (ট্রান্সফার)",
        meaning_en: "to transfer / change trains",
        part_of_speech: "verb",
        example_ja: "新宿[しんじゅく]で電車[でんしゃ]を乗[の]り換[か]えます。",
        example_bn: "শিনজুকুতে ট্রেন পরিবর্তন করি।",
        example_en: "I transfer trains at Shinjuku."
      }
    ],
    kanji_scope: [
      {
        kanji: "出",
        onyomi: "シュツ, スイ",
        kunyomi: "で・る, だ・す",
        meaning_bn: "বের হওয়া / পাঠানো",
        meaning_en: "exit / put out",
        stroke_count: 5,
        compounds: [
          { word_ja: "出[で]ます", meaning_bn: "বের হওয়া", meaning_en: "to exit" },
          { word_ja: "出口[でぐち]", meaning_bn: "বহির্গমন পথ", meaning_en: "exit" },
          { word_ja: "出発[しゅっぱつ]", meaning_bn: "যাত্রা শুরু / ডিপারচার", meaning_en: "departure" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G29-1",
        pattern_ja: "V1-て から、V2",
        pattern_bn: "V1 শেষ করার পর V2 করা",
        explanation_bn: "V1 ক্রিয়াটি নিশ্চিতভাবে সম্পন্ন হওয়ার পরই V2 শুরু হয়। পুরো বাক্যের কাল (Present/Past) শেষ ক্রিয়াপদ V2 দ্বারা নির্ধারিত হয়।",
        common_pitfalls: [
          "V1 কে কখনোই অতীতে নেওয়া যাবে না (× 食べたから行きます নয়, ○ 食べてから行きます)।"
        ],
        examples: [
          {
            ja: "国[くに]へ帰[かえ]ってから、会社[かいしゃ]を作[つく]りたいです。",
            bn: "দেশে ফেরার পর একটি কোম্পানি গড়তে চাই।",
            en: "After returning to my country, I want to build a company."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "ক্লাস শেষে একসাথে লাইব্রেরিতে যাওয়ার পরিকল্পনা।",
      situation_en: "Planning to go to the library together after class.",
      lines: [
        {
          speaker_ja: "タニム[たにむ]",
          speaker_en: "Tanim",
          line_ja: "授業[じゅぎょう]が終[お]わってから、図書館[としょかん]へ行[い]きませんか。",
          line_bn: "ক্লাস শেষ হওয়ার পর লাইব্রেরিতে যাবেন নাকি?",
          line_en: "Shall we go to the library after class finishes?"
        },
        {
          speaker_ja: "ケン[けん]",
          speaker_en: "Ken",
          line_ja: "いいですね。昼[ひる]ごはんを食[た]べてから行[い]きましょう。",
          line_bn: "চমৎকার। দুপুরের খাবার খেয়ে তারপর যাওয়া যাক।",
          line_en: "Sounds good! Let's eat lunch and then go."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "টোকিও মেট্রোর জটিল লাইন পরিবর্তন ও ট্রান্সফার টিকিট",
      tip_bn: "টোকিওর সাবওয়ে নেটওয়ার্কে টোকিও মেট্রো এবং তোয়েই (Toei) দুটি ভিন্ন ভিন্ন সাবওয়ে কোম্পানি। এক কোম্পানির লাইন থেকে অন্য কোম্পানির লাইনে ট্রান্সফার করার সময় কম্বাইন্ড ডিসকাউন্ট (70 ইয়েন ছাড়) থাকে। আইসি কার্ড ব্যবহার করলে এটি স্বয়ংক্রিয়ভাবে হিসাব হয়ে যায়।",
      category: "Transport"
    },
    typing_practice: [
      {
        prompt_ja: "食[た]べてから行[い]きます",
        romaji_input: "tabetekara ikimasu",
        target_display: "たべてからいきます",
        meaning_bn: "খেয়ে যাব"
      },
      {
        prompt_ja: "手[て]を洗[あら]ってください",
        romaji_input: "te o aratte kudasai",
        target_display: "てをあらってください",
        meaning_bn: "হাত ধুয়ে নিন"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L29-1",
        question_ja: "「勉強[べんきょう]して（　）寝[ね]ます」の 空欄[くうらん]に 入[はい]る 正[ただ]しい 言葉[ことば]は どれですか。",
        question_bn: "শূন্যস্থানে কোন শব্দটি বসবে: べんきょうして（　）ねます",
        options: [
          "から (kara)",
          "まで (made)",
          "ので (node)",
          "けど (kedo)"
        ],
        correct_index: 0,
        explanation_bn: "কাজ শেষ করার পর বোঝাতে '〜てから' (te kara) বসে: 勉強してから寝ます (পড়াশোনা শেষ করে ঘুমাব)।"
      }
    ]
  },

  // --- LESSON 30: 〜たり〜たりします ---
  {
    lesson_metadata: {
      lesson_id: "L30",
      lesson_number: 30,
      module_number: 5,
      module_name: "Te-Form Revolution",
      module_name_bn: "তে-ফর্ম বিপ্লব",
      title_ja: "〜たり〜たりします",
      title_en: "Representative Activities (-tari -tari shimasu)",
      title_bn: "কখনও এটা, কখনও ওটা করি (প্রতিনিধিত্বমূলক তালিকা)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "যখন কেউ অবসরে বা ছুটিতে অনেকগুলো কাজ করে কিন্তু সবগুলো না বলে কয়েকটি উদাহরণ হিসেবে তুলে ধরতে চায়, তখন 〜たり〜たりします ব্যবহৃত হয়। এর গঠন হলো ক্রিয়াপদের তা-ফর্মের সাথে 'り' যোগ করা (V-た + り)। যেমন: 'ছুটির দিনে বই পড়ি, গান শুনি ইত্যাদি' -> 本[ほん]を読[よ]んだり音楽[おんがく]を聞[き]いたりします。",
      core_concept_bn: "অনির্দিষ্ট কাজের উদাহরণ তালিকা (〜たり〜たりします) বনাম ক্রমান্বয়িক কাজ (〜て、〜て)।",
      real_world_context_bn: "ছুটির দিনে কী করেছেন বা অবসরে কী করতে ভালোবাসেন তা জাপানি বন্ধুদের বা ইন্টারভিউয়ারকে বোঝানো।",
      key_takeaway_bn: "V1-たり V2-たり します/しました (প্রতিনিধিত্বমূলক কয়েকটি কাজের দৃষ্টান্ত)।"
    },
    vocabulary_scope: [
      {
        word_ja: "掃除[そうじ]します",
        romaji: "sōjishimasu",
        meaning_bn: "ঘর পরিষ্কার করা",
        meaning_en: "to clean",
        part_of_speech: "verb",
        example_ja: "日曜日[にちようび]は部屋[へや]を掃除[そうじ]したりします。",
        example_bn: "রবিবারে রুম পরিষ্কার ইত্যাদি করি।",
        example_en: "On Sundays, I clean my room and such."
      },
      {
        word_ja: "洗濯[せんたく]します",
        romaji: "sentakushimasu",
        meaning_bn: "কাপড় ধোয়া / লন্ড্রি করা",
        meaning_en: "to do laundry",
        part_of_speech: "verb",
        example_ja: "服[ふく]を洗濯[せんたく]したり買[か]い物[もの]に行[い]ったりしました。",
        example_bn: "কাপড় ধুয়েছি, শপিংয়ে গিয়েছি ইত্যাদি।",
        example_en: "I did laundry, went shopping, and so on."
      },
      {
        word_ja: "散歩[さんぽ]します",
        romaji: "sanposhimasu",
        meaning_bn: "হাঁটাহাটি করা / পায়চারি করা",
        meaning_en: "to take a walk / stroll",
        part_of_speech: "verb",
        example_ja: "公園[こうえん]を散歩[さんぽ]したりします。",
        example_bn: "পার্কে হাঁটাহাটি ইত্যাদি করি।",
        example_en: "I take a walk in the park and things like that."
      },
      {
        word_ja: "週末[しゅうまつ]",
        romaji: "shūmatsu",
        meaning_bn: "সপ্তাহান্ত / উইকএন্ড",
        meaning_en: "weekend",
        part_of_speech: "noun",
        example_ja: "週末[しゅうまつ]は何[なに]をしましたか。",
        example_bn: "উইকএন্ডে কী করলেন?",
        example_en: "What did you do on the weekend?"
      }
    ],
    kanji_scope: [
      {
        kanji: "休",
        onyomi: "キュウ",
        kunyomi: "やす・む, やす・まる, やす・める",
        meaning_bn: "বিশ্রাম / ছুটি",
        meaning_en: "rest / holiday",
        stroke_count: 6,
        compounds: [
          { word_ja: "休[やす]み", meaning_bn: "ছুটি / বিশ্রাম", meaning_en: "holiday / rest" },
          { word_ja: "夏休[なつやす]み", meaning_bn: "গ্রীষ্মকালীন ছুটি", meaning_en: "summer vacation" },
          { word_ja: "休日[きゅうじつ]", meaning_bn: "ছুটির দিন", meaning_en: "day off" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G30-1",
        pattern_ja: "V1-たり、V2-たり します / しました",
        pattern_bn: "কখনও V1, কখনও V2 করি / করেছি (Listing Activities)",
        explanation_bn: "অনেকগুলো কাজের মধ্য থেকে কয়েকটি দৃষ্টান্ত তুলে ধরতে ক্রিয়ার た-ফর্মের সাথে り যোগ করা হয়। বাক্যের শেষে কাল অনুযায়ী します (বর্তমান/ভবিষ্যৎ) অথবা しました (অতীত) বসে।",
        common_pitfalls: [
          "বাক্যের শেষে します বা しました বাদ দেওয়া যাবে না (× 読んだり聞いたり নয়, ○ 読んだり聞いたりします)।"
        ],
        examples: [
          {
            ja: "休[やす]みの日はテレビを見[み]たり本[ほん]を読[よ]んだりします。",
            bn: "ছুটির দিনে টিভি দেখি, বই পড়ি ইত্যাদি করি।",
            en: "On days off, I watch TV, read books, and so forth."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "সোমবার সকালে ক্লাসে বন্ধুদের সাথে উইকএন্ড কেমন কাটল তা শেয়ার করা।",
      situation_en: "Sharing how the weekend went with friends on Monday morning in class.",
      lines: [
        {
          speaker_ja: "先生[せんせい]",
          speaker_en: "Teacher",
          line_ja: "みなさん、週末[しゅうまつ]は何[なに]をしましたか。",
          line_bn: "সবাই, সপ্তাহান্তে আপনারা কী করলেন?",
          line_en: "Everyone, what did you do over the weekend?"
        },
        {
          speaker_ja: "学生[がくせい]",
          speaker_en: "Student",
          line_ja: "部屋[へや]を掃除[そうじ]したり、友達[ともだち]と買[か]い物[もの]に行[い]ったりしました。",
          line_bn: "ঘর পরিষ্কার করেছি, বন্ধুর সাথে শপিংয়ে গিয়েছি ইত্যাদি।",
          line_en: "I cleaned my room, went shopping with friends, and things like that."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "কয়েন লন্ড্রি (Coin Laundry) ও জাপানের বর্ষা মৌসুম (Tsuyu - 梅雨)",
      tip_bn: "জাপানে জুন মাসে একটানা প্রায় এক মাস বর্ষাকাল (Tsuyu) থাকে। এ সময় রোদ না থাকায় ঘরে কাপড় শুকানো কঠিন হয়ে পড়ে। তাই অ্যাপার্টমেন্টের আশেপাশের কয়েন লন্ড্রিগুলোতে ওয়াশিং মেশিন ও শক্তিশালী ড্রায়ারে ৩০ মিনিটের মধ্যে কাপড় সম্পূর্ণ শুকিয়ে ফেলা যায়। ১০০ ইয়েনের কয়েন প্রস্তুত রাখুন।",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "本[ほん]を読[よ]んだりします",
        romaji_input: "hon o yondari shimasu",
        target_display: "ほんをよんだりします",
        meaning_bn: "বই পড়ি ইত্যাদি"
      },
      {
        prompt_ja: "週末[しゅうまつ]は何[なに]をしましたか",
        romaji_input: "shuumatsu wa nani o shimashita ka",
        target_display: "しゅうまつはなにをしましたか",
        meaning_bn: "উইকএন্ডে কী করেছেন?"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L30-1",
        question_ja: "「〜たり〜たりします」の 文法[ぶんぽう]の 役割[やくわり]は 何[なん]ですか。",
        question_bn: "‘〜たり〜たりします’ ব্যাকরণের মূল উদ্দেশ্য কী?",
        options: [
          "প্রতিনিধিত্বমূলক কাজের কয়েকটি উদাহরণ দেওয়া (Representative examples)",
          "কঠোর ক্রম মেনে কাজ করা (Strict sequential order)",
          "ভবিষ্যতের কোনো কাজের অনুমতি চাওয়া (Asking permission)",
          "কোনো কাজ নিষিদ্ধ করা (Prohibition)"
        ],
        correct_index: 0,
        explanation_bn: "〜たり〜たりします একাধিক সম্পন্ন কাজের মধ্য থেকে কয়েকটি দৃষ্টান্ত তুলে ধরতে ব্যবহৃত হয়।"
      }
    ]
  }
];
