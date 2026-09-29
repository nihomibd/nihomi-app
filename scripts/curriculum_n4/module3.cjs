// Module 3: Transitivity, Preparation & State (Lessons N4-L11 - N4-L15)
module.exports = [
  // --- LESSON 11: 自動詞 と 他動詞 ---
  {
    lesson_metadata: {
      lesson_id: "N4-L11",
      lesson_number: 11,
      module_number: 3,
      module_name: "Transitivity, Preparation & State",
      module_name_bn: "অকর্মক-সকর্মক, পূর্বপ্রস্তুতি ও অবস্থা",
      title_ja: "自動詞[じどうし]と他動詞[たどうし]",
      title_en: "Transitive vs Intransitive Verbs",
      title_bn: "সকর্মক ও অকর্মক ক্রিয়ার যুগলবন্দী (স্বয়ংক্রিয় বনাম কর্তার কাজ)",
      estimated_minutes: 35,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "জাপানি ভাষায় অধিকাংশ ক্রিয়াই জোড়ায় জোড়ায় আসে: একটি সকর্মক ক্রিয়া (他動詞 - Tadoushi), যা কর্তা নিজে কোনো বস্তুর ওপর সম্পাদন করে (পার্টিকেল を); এবং অন্যটি অকর্মক ক্রিয়া (自動詞 - Jidoushi), যা কোনো বাহ্যিক হস্তক্ষেপ ছাড়া নিজে নিজেই ঘটে বা শুধু অবস্থা প্রকাশ করে (পার্টিকেল が)। যেমন: ドアを開ける (দরজা খোলা) বনাম ドアが開く (দরজা নিজে নিজেই খুলছে)।",
      core_concept_bn: "অন্যের ইচ্ছাকৃত কাজ: N を 他動詞 (電気を消す); প্রাকৃতিক বা স্বয়ংক্রিয় ঘটনা: N が 自動詞 (電気が消える)।",
      real_world_context_bn: "ট্রেনের দরজা স্বয়ংক্রিয়ভাবে খোলার সময় বলা হয়: ドアが開きます (Door ga akimasu)।",
      key_takeaway_bn: "자동사 (Jidoushi) এর সাথে সবসময় が বসে, আর 타동사 (Tadoushi) এর সাথে を বসে।"
    },
    vocabulary_scope: [
      {
        word_ja: "開[あ]く",
        romaji: "aku",
        meaning_bn: "খোলা (নিজে নিজে)",
        meaning_en: "to open (intransitive)",
        part_of_speech: "verb",
        example_ja: "自動[じどう]ドアが開[あ]きました。",
        example_bn: "স্বয়ংক্রিয় দরজাটি খুলে গেল।",
        example_en: "The automatic door opened."
      },
      {
        word_ja: "開[あ]ける",
        romaji: "akeru",
        meaning_bn: "খোলা (কারও দ্বারা)",
        meaning_en: "to open (transitive)",
        part_of_speech: "verb",
        example_ja: "窓[まど]を開[あ]けてください。",
        example_bn: "দয়া করে জানালাটি খুলুন।",
        example_en: "Please open the window."
      },
      {
        word_ja: "閉[し]まる",
        romaji: "shimaru",
        meaning_bn: "বন্ধ হওয়া (নিজে নিজে)",
        meaning_en: "to close (intransitive)",
        part_of_speech: "verb",
        example_ja: "店[みせ]が閉[し]まっています。",
        example_bn: "দোকানটি বন্ধ হয়ে আছে।",
        example_en: "The shop is closed."
      },
      {
        word_ja: "消[き]える",
        romaji: "kieru",
        meaning_bn: "নিভে যাওয়া / বন্ধ হওয়া",
        meaning_en: "to go out / disappear (intransitive)",
        part_of_speech: "verb",
        example_ja: "電気[でんき]が消[き]えました。",
        example_bn: "বাতিটি নিভে গেল।",
        example_en: "The light went off."
      }
    ],
    kanji_scope: [
      {
        kanji: "閉",
        onyomi: "ヘイ",
        kunyomi: "し・まる, し・める, と・じる",
        meaning_bn: "বন্ধ করা",
        meaning_en: "close / shut",
        stroke_count: 11,
        compounds: [
          { word_ja: "閉館[へいかん]", meaning_bn: "ভবন বন্ধ হওয়া", meaning_en: "closing of a building" },
          { word_ja: "閉[し]める", meaning_bn: "বন্ধ করা", meaning_en: "to close" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "N4-G11-1",
        pattern_ja: "名詞[めいし] が 自動詞[じどうし] て形[けい] + います",
        pattern_bn: "বিশেষ্য が অকর্মক ক্রিয়া て-ফর্ম + います (চলমান অবস্থা)",
        explanation_bn: "কোনো কাজ শেষ হওয়ার পর বর্তমান দৃশ্যমান অবস্থা বর্ণনা করতে ব্যবহৃত হয়। যেমন: বাতিটি নিভে আছে (電気が消えています)।",
        common_pitfalls: [
          "এখানে を ব্যবহার করলে অর্থ বদলে যাবে; অবস্থা নির্দেশ করতে が আবশ্যক।"
        ],
        examples: [
          {
            ja: "窓[まど]が割[わ]れています。",
            bn: "জানালাটি ভেঙে রয়েছে।",
            en: "The window is broken."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "ক্লাসরুম বা অফিসে প্রবেশের সময় পরিস্থিতি পর্যবেক্ষণ।",
      situation_en: "Observing conditions when entering a classroom or office.",
      lines: [
        {
          speaker_ja: "同僚[どうりょう]",
          speaker_en: "Colleague",
          line_ja: "あれ？会議室[かいぎしつ]のエアコンがついていますね。",
          line_bn: "আরে? মিটিং রুমের এসি চালু হয়ে আছে তো!",
          line_en: "Huh? The meeting room air conditioner is turned on."
        },
        {
          speaker_ja: "私[わたし]",
          speaker_en: "Me",
          line_ja: "誰[だれ]もいませんから、消[け]しておきますね。",
          line_bn: "যেহেতু কেউ নেই, আমি বন্ধ করে রাখছি।",
          line_en: "Since no one is here, I will turn it off."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের ট্রেনের দরজা ও প্ল্যাটফর্মের সতর্কবার্তা",
      tip_bn: "জাপানের ট্রেনে 'ドアが閉まります。ご注意ください' (দরজা বন্ধ হচ্ছে, সতর্ক থাকুন) এবং '白線の内側までお下がりください' (হলুদ দাগের ভেতরে থাকুন) এই ঘোষণাগুলো প্রতিদিন শোনানো হয়। দরজার খাঁজে ব্যাগ বা ছাতা আটকে যাওয়া বড় অপরাধ গণ্য করা হয়।",
      category: "Transport"
    },
    typing_practice: [
      {
        prompt_ja: "開[あ]く",
        romaji_input: "aku",
        target_display: "あく",
        meaning_bn: "খোলা"
      },
      {
        prompt_ja: "閉[し]まる",
        romaji_input: "shimaru",
        target_display: "しまる",
        meaning_bn: "বন্ধ হওয়া"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-N4-L11-1",
        question_ja: "「寒[さむ]いので、窓[まど]（　　）閉[し]めてください」正しい助詞は？",
        question_bn: "সকর্মক ক্রিয়া 閉める এর সাথে সঠিক পার্টিকেল কোনটি?",
        options: [
          "を",
          "が",
          "に",
          "で"
        ],
        correct_index: 0,
        explanation_bn: "সকর্মক ক্রিয়া (他動詞) এর ক্ষেত্রে কর্মের সাথে 'を' পার্টিকেল বসে।"
      }
    ]
  },

  // --- LESSON 12: 〜てあります ---
  {
    lesson_metadata: {
      lesson_id: "N4-L12",
      lesson_number: 12,
      module_number: 3,
      module_name: "Transitivity, Preparation & State",
      module_name_bn: "অকর্মক-সকর্মক, পূর্বপ্রস্তুতি ও অবস্থা",
      title_ja: "結果[けっか]の状態[じょうたい]（〜てある）",
      title_en: "Resultant State (~te arimasu)",
      title_bn: "উদ্দেশ্যমূলক সম্পাদিত অবস্থা (~তে আরিমাসু)",
      estimated_minutes: 30,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "যখন কেউ কোনো নির্দিষ্ট উদ্দেশ্য বা সুবিধার কথা চিন্তা করে কোনো কাজ সম্পন্ন করে রেখেছে এবং সেই কাজের ফলাফল এখনো বিদ্যমান রয়েছে, তখন 'সকর্মক ক্রিয়ার (他動詞) て-ফর্ম + あります' ব্যবহৃত হয়। যেমন: 壁にカレンダーが掛けてあります (দেয়ালে ক্যালেন্ডার ঝুলিয়ে রাখা আছে—যাতে সবাই তারিখ দেখতে পায়)।",
      core_concept_bn: "উদ্দেশ্যমূলক কাজের বিদ্যমান অবস্থা: N が 他動詞 て-ফর্ম + あります।",
      real_world_context_bn: "হোটেল রুমে আগে থেকেই তোয়ালে গুছিয়ে রাখা (タオルが置いてあります) বা মিটিং টেবিলে ফাইল সাজিয়ে রাখা।",
      key_takeaway_bn: "〜ています স্বাভাবিক অবস্থা নির্দেশ করে, আর 〜てあります পেছনের কোনো ব্যক্তির উদ্দেশ্যমূলক প্রস্তুতি তুলে ধরে।"
    },
    vocabulary_scope: [
      {
        word_ja: "飾[かざ]る",
        romaji: "kazaru",
        meaning_bn: "সাজানো / প্রদর্শিত রাখা",
        meaning_en: "to decorate / display",
        part_of_speech: "verb",
        example_ja: "部屋[へや]にきれいな絵[え]が飾[かざ]ってあります。",
        example_bn: "ঘরে একটি সুন্দর ছবি সাজিয়ে রাখা আছে।",
        example_en: "A beautiful painting is displayed in the room."
      },
      {
        word_ja: "並[なら]べる",
        romaji: "naraberu",
        meaning_bn: "সারি করে সাজিয়ে রাখা",
        meaning_en: "to line up / arrange",
        part_of_speech: "verb",
        example_ja: "机[つくえ]の上[うえ]に資料[しりょう]が並[なら]べてあります。",
        example_bn: "টেবিলের উপর কাগজপত্র সারিবদ্ধ করে রাখা আছে।",
        example_en: "The documents are arranged neatly on the desk."
      }
    ],
    kanji_scope: [
      {
        kanji: "並",
        onyomi: "ヘイ",
        kunyomi: "なら・ぶ, なら・べる",
        meaning_bn: "সারি / পাশাপাশি",
        meaning_en: "row / line up",
        stroke_count: 8,
        compounds: [
          { word_ja: "並[なら]べる", meaning_bn: "সাজানো", meaning_en: "to line up" },
          { word_ja: "並木[なみき]", meaning_bn: "সারিবদ্ধ গাছ", meaning_en: "row of trees" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "N4-G12-1",
        pattern_ja: "名詞[めいし] が 他動詞[たどうし] て形[けい] + あります",
        pattern_bn: "বিশেষ্য が সকর্মক ক্রিয়া て-ফর্ম + あります",
        explanation_bn: "অতীতে কেউ কোনো উদ্দেশ্য নিয়ে কাজটি করে রেখেছে যা বর্তমানে বিদ্যমান।",
        common_pitfalls: [
          "অকর্মক ক্রিয়ার সাথে あります বসে না (ドアが開いてあります ভুল; ドアが開けてあります সঠিক)।"
        ],
        examples: [
          {
            ja: "壁[かべ]に予定表[よていひょう]が貼[は]ってあります。",
            bn: "দেয়ালে রুটিন সাঁটিয়ে রাখা আছে।",
            en: "The schedule is pasted on the wall."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "হোটেল রুমে অতিথির আগমনের প্রস্তুতি।",
      situation_en: "Checking hotel room readiness for arriving guests.",
      lines: [
        {
          speaker_ja: "スタッフA",
          speaker_en: "Staff A",
          line_ja: "３０２号室[ごうしつ]の準備[じゅんび]はどうですか。",
          line_bn: "৩০২ নম্বর রুমের প্রস্তুতি কেমন?",
          line_en: "How is the preparation for room 302?"
        },
        {
          speaker_ja: "スタッフB",
          speaker_en: "Staff B",
          line_ja: "水[みず]とお茶[ちゃ]が冷蔵庫[れいぞうこ]に入[い]れてあります。",
          line_bn: "পানি এবং চা ফ্রিজে রেখে দেওয়া হয়েছে।",
          line_en: "Water and tea have been placed in the refrigerator."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানি হোটেল ও বাসায় 'ওমোতেনাশি' (Hospitality) সংস্কৃতি",
      tip_bn: "জাপানের সেবা খাতে আগে থেকেই সবকিছু নিখুঁতভাবে তৈরি করে রাখাকে 'おもてなし' (Omotenashi) বলা হয়। অতিথির অনুরোধের আগেই সব গুছিয়ে রাখা এই সমাজব্যবস্থার অন্যতম ভিত্তি।",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "飾[かざ]る",
        romaji_input: "kazaru",
        target_display: "かざる",
        meaning_bn: "সাজানো"
      },
      {
        prompt_ja: "並[なら]べる",
        romaji_input: "naraberu",
        target_display: "ならべる",
        meaning_bn: "সাজিয়ে রাখা"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-N4-L12-1",
        question_ja: "「黒板[こくばん]に 漢字[かんじ]が（　　）あります」正しい動詞は？",
        question_bn: "বোর্ডে কাঞ্জি লিখে রাখা আছে—সঠিক রূপ কোনটি?",
        options: [
          "書いて",
          "書いてい",
          "書かれて",
          "書く"
        ],
        correct_index: 0,
        explanation_bn: "他動詞 (সকর্মক ক্রিয়া) 書く এর て-ফর্ম 書いて এর সাথে あります বসে (書いてあります)।"
      }
    ]
  },

  // --- LESSON 13: 〜ておきます ---
  {
    lesson_metadata: {
      lesson_id: "N4-L13",
      lesson_number: 13,
      module_number: 3,
      module_name: "Transitivity, Preparation & State",
      module_name_bn: "অকর্মক-সকর্মক, পূর্বপ্রস্তুতি ও অবস্থা",
      title_ja: "準備[じゅんび]の表現[ひょうげん]（〜ておく）",
      title_en: "Actions in Preparation (~te okimasu)",
      title_bn: "ভবিষ্যতের জন্য পূর্বপ্রস্তুতিমূলক কাজ (~তে ওকিমাসু)",
      estimated_minutes: 30,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "ভবিষ্যতের কোনো ঘটনা, ভ্রমণ, পরীক্ষা বা প্রয়োজনের কথা ভেবে আগেভাগেই কোনো কাজ সম্পন্ন করে রাখাকে 〜ておきます (te okimasu) বলে। বাংলায়: 'করে রাখা' (যেমন: টিকিট কেটে রাখা, হোটেল বুক করে রাখা)। কথ্য ভাষায় এটিকে সংক্ষেপে 〜とく (toku) বলা হয় (যেমন: 買っとく)।",
      core_concept_bn: "ভবিষ্যতের সুবিধার জন্য কাজ আগে সম্পন্ন করা: 旅行の前に、切符を買っておきます (ভ্রমণের আগে টিকিট কেটে রাখব)।",
      real_world_context_bn: "জরুরি দুর্যোগ বা ভূমিকম্পের আগে পানি ও ব্যাটারি মজুত করে রাখা (準備しておく)।",
      key_takeaway_bn: "পরবর্তী ব্যবহারের সুবিধার্থে জিনিস আগের মতো রেখে দেওয়াও 〜ておきます দিয়ে বোঝায় (そのままにしておいてください)।"
    },
    vocabulary_scope: [
      {
        word_ja: "準備[じゅんび]する",
        romaji: "junbi suru",
        meaning_bn: "প্রস্তুতি নেওয়া",
        meaning_en: "to prepare",
        part_of_speech: "verb",
        example_ja: "明日[あした]の試験[しけん]のために、鉛筆[えんぴつ]を準備[じゅんび]しておきます。",
        example_bn: "আগামীকালের পরীক্ষার জন্য পেনসিল প্রস্তুত করে রাখব।",
        example_en: "I will prepare pencils for tomorrow's exam."
      },
      {
        word_ja: "片付[かたづ]ける",
        romaji: "katadukeru",
        meaning_bn: "পরিষ্কার করা / গুছিয়ে রাখা",
        meaning_en: "to tidy up",
        part_of_speech: "verb",
        example_ja: "使[つか]った後[あと]で、道具[どうぐ]を片付[かたづ]けておいてください。",
        example_bn: "ব্যবহারের পর যন্ত্রপাতিগুলো দয়া করে গুছিয়ে রাখুন।",
        example_en: "Please tidy up the tools after using them."
      }
    ],
    kanji_scope: [
      {
        kanji: "置",
        onyomi: "チ",
        kunyomi: "お・く",
        meaning_bn: "রাখা / স্থাপন",
        meaning_en: "put / place",
        stroke_count: 13,
        compounds: [
          { word_ja: "置[お]く", meaning_bn: "রাখা", meaning_en: "to put" },
          { word_ja: "位置[いち]", meaning_bn: "অবস্থান", meaning_en: "position" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "N4-G13-1",
        pattern_ja: "動詞[どうし] て形[けい] + おきます",
        pattern_bn: "ক্রিয়া て-ফর্ম + おきます (আগে থেকে করে রাখা)",
        explanation_bn: "১. ভবিষ্যৎ সুবিধার প্রস্তুতি; ২. পরবর্তী ব্যবহারের জন্য গুছিয়ে রাখা; ৩. বর্তমান অবস্থায় রেখে দেওয়া।",
        common_pitfalls: [
          "কথ্য ভাষায় ておく সংকুচিত হয়ে とく হয় (買っておく -> 買っとく); পরীক্ষায় পূর্ণ রূপটি চেনা জরুরি।"
        ],
        examples: [
          {
            ja: "パーティーの 前[まえ]に 料理[りょうり]を 作[つく]っておきます。",
            bn: "পার্টির আগে রান্না করে রাখব।",
            en: "I will prepare food before the party."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "টোকিওতে বন্ধু আসার আগে প্রস্তুতি গ্রহণ।",
      situation_en: "Preparing before a friend's visit to Tokyo.",
      lines: [
        {
          speaker_ja: "アキラ",
          speaker_en: "Akira",
          line_ja: "来週[らいしゅう]バングラデシュから友達[ともだち]が来[く]るんだって？",
          line_bn: "শুনলাম আগামী সপ্তাহে তোমার বাংলাদেশ থেকে বন্ধু আসছে?",
          line_en: "I heard your friend from Bangladesh is coming next week?"
        },
        {
          speaker_ja: "シャヒン",
          speaker_en: "Shahin",
          line_ja: "ええ、ですから新幹線[しんかんせん]のチケットを予約[よやく]しておきました。",
          line_bn: "হ্যাঁ, তাই আগে থেকেই বুলেট ট্রেনের টিকিট বুক করে রেখেছি।",
          line_en: "Yes, so I already reserved bullet train tickets in advance."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানে জরুরি দুর্যোগ মোকাবিলার 'ইমার্জেন্সি ব্যাগ' (非常用持ち出し袋)",
      tip_bn: "জাপানের প্রতিটি পরিবারে ভূমিকম্প ও ঝড়ের আশঙ্কায় অন্তত ৩ দিনের শুকনো খাবার, মিনারেল ওয়াটার, টর্চ ও প্রাথমিক চিকিৎসার ওষুধ সম্বলিত একটি ব্যাগ দরজার কাছে প্রস্তুত রাখা হয় (準備しておく)।",
      category: "Emergency"
    },
    typing_practice: [
      {
        prompt_ja: "準備[じゅんび]",
        romaji_input: "junbi",
        target_display: "じゅんび",
        meaning_bn: "প্রস্তুতি"
      },
      {
        prompt_ja: "片付[かたづ]ける",
        romaji_input: "katadukeru",
        target_display: "かたづける",
        meaning_bn: "গুছিয়ে রাখা"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-N4-L13-1",
        question_ja: "「授業[じゅぎょう]の まえに、新しい 言葉[ことば]を 調[しら]べ（　　）」正しい形は？",
        question_bn: "ক্লাসের আগে নতুন শব্দ অভিধানে খুঁজে রাখব—সঠিক রূপ কোনটি?",
        options: [
          "ておきます",
          "てあります",
          "ています",
          "てしまいます"
        ],
        correct_index: 0,
        explanation_bn: "পূর্বপ্রস্তুতি বোঝাতে ক্রিয়ার て-ফর্মের সাথে おきます বসে (調べておきます)।"
      }
    ]
  },

  // --- LESSON 14: まだ〜ています / もう〜ました ---
  {
    lesson_metadata: {
      lesson_id: "N4-L14",
      lesson_number: 14,
      module_number: 3,
      module_name: "Transitivity, Preparation & State",
      module_name_bn: "অকর্মক-সকর্মক, পূর্বপ্রস্তুতি ও অবস্থা",
      title_ja: "アスペクト（まだ・もう）",
      title_en: "Aspect: Ongoing vs Completed (Mada & Mou)",
      title_bn: "কাজের পর্যায় ও সমাপ্তি (এখনো চলছে বনাম ইতিমধ্যে শেষ)",
      estimated_minutes: 30,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "কোনো কাজ এখনো চলছে নাকি এরই মধ্যে শেষ হয়ে গেছে তা প্রকাশ করাকে ক্রিয়ার Aspect বলে। ১. まだ + क्रिया ています: কাজ এখনো চলছে (যেমন: まだ雨が降っています - এখনো বৃষ্টি পড়ছে); ২. まだ + क्रिया ていません: কাজ এখনো সম্পন্ন হয়নি (যেমন: まだ昼ご飯を食べていません - এখনো দুপুরের খাবার খাইনি); ৩. もう + क्रिया ました: কাজ ইতিমধ্যে শেষ (যেমন: もう宿題を終わりました)।",
      core_concept_bn: "চলমান: まだ〜ています; অসম্পন্ন: まだ〜ていません; সমাপ্ত: もう〜ました।",
      real_world_context_bn: "অফিসে বা রেস্তোরাঁয় 'খাবার কি শেষ হয়েছে?' বা 'কাজ কি সম্পন্ন হয়েছে?' প্রশ্ন করার সময় এর ব্যবহার হয়।",
      key_takeaway_bn: "まだ এর উত্তরে সাধারণত 'はい、もう〜' অথবা 'いいえ、まだ〜ていません' হয়।"
    },
    vocabulary_scope: [
      {
        word_ja: "レポート",
        romaji: "repooto",
        meaning_bn: "প্রতিবেদন / রিপোর্ট",
        meaning_en: "report",
        part_of_speech: "noun",
        example_ja: "もうレポートを出[だ]しましたか。",
        example_bn: "ইতিমধ্যেই কি রিপোর্ট জমা দিয়ে দিয়েছেন?",
        example_en: "Have you already submitted the report?"
      },
      {
        word_ja: "残業[ざんぎょう]",
        romaji: "zangyou",
        meaning_bn: "অতিরিক্ত সময় কাজ (ওভারটাইম)",
        meaning_en: "overtime work",
        part_of_speech: "noun",
        example_ja: "まだ残業[ざんぎょう]をしています。",
        example_bn: "আমি এখনো ওভারটাইম করছি।",
        example_en: "I am still working overtime."
      }
    ],
    kanji_scope: [
      {
        kanji: "残",
        onyomi: "ザン",
        kunyomi: "のこ・る, のこ・す",
        meaning_bn: "অবশিষ্ট / টিকে থাকা",
        meaning_en: "remain / leftover",
        stroke_count: 10,
        compounds: [
          { word_ja: "残念[ざんねん]", meaning_bn: "আফসোস", meaning_en: "regrettable" },
          { word_ja: "残業[ざんぎょう]", meaning_bn: "ওভারটাইম", meaning_en: "overtime work" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "N4-G14-1",
        pattern_ja: "まだ + 動詞[どうし] て形[けい] + いません",
        pattern_bn: "এখনো কাজটি করিনি (অসম্পূর্ণ অবস্থা)",
        explanation_bn: "অতীত রূপ না দিয়ে 'ていません' ব্যবহার করতে হয় কারণ ভবিষ্যতে কাজটি সম্পন্ন করার ইচ্ছা থাকে।",
        common_pitfalls: [
          "'まだ食べませんでした' বলা ব্যাকরণগত ভুল; বলতে হবে 'まだ食べていません'।"
        ],
        examples: [
          {
            ja: "いいえ、まだ 決[き]めていません。",
            bn: "না, এখনো সিদ্ধান্ত নিইনি।",
            en: "No, I haven't decided yet."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "অফিসে বসের সাথে প্রজেক্টের অগ্রগতির পর্যালোচনা।",
      situation_en: "Reviewing project progress with a manager at work.",
      lines: [
        {
          speaker_ja: "課長[かちょう]",
          speaker_en: "Section Chief",
          line_ja: "田中[たなか]さん、会議[かいぎ]の資料[しりょう]はもうコピーしましたか。",
          line_bn: "তানাকা সাহেব, মিটিংয়ের কাগজপত্র কি ইতিমধ্যে ফটোকপি করেছেন?",
          line_en: "Mr. Tanaka, have you already copied the meeting materials?"
        },
        {
          speaker_ja: "田中[たなか]",
          speaker_en: "Tanaka",
          line_ja: "いいえ、まだしていません。今[いま]すぐやります。",
          line_bn: "না, এখনো করিনি। আমি এখনই করে দিচ্ছি।",
          line_en: "No, I haven't done it yet. I will do it right now."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের কাজের জগতে 'হোরেনসো' (Hou-Ren-So) নিয়ম",
      tip_bn: "জাপানি করপোরেট সংস্কৃতির সবচেয়ে বড় মূলমন্ত্র হলো 報連相 (Hou-Ren-So): 報告 (Houkoku - রিপোর্ট দেওয়া), 連絡 (Renraku - যোগাযোগ রাখা) এবং 相談 (Soudan - পরামর্শ করা)। কোনো কাজ শেষ হলে সাথে সাথে 'もう終わりました' বলে রিপোর্ট করা আবশ্যক।",
      category: "Workplace"
    },
    typing_practice: [
      {
        prompt_ja: "残業[ざんぎょう]",
        romaji_input: "zangyou",
        target_display: "ざんぎょう",
        meaning_bn: "ওভারটাইম"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-N4-L14-1",
        question_ja: "「もう 宿題[しゅくだい]を やりましたか」「いいえ、まだ（　　）」",
        question_bn: "খালি জায়গায় সঠিক উত্তর কোনটি?",
        options: [
          "やっていません",
          "やりませんでした",
          "やりません",
          "やったです"
        ],
        correct_index: 0,
        explanation_bn: "অসম্পন্ন কাজের ক্ষেত্রে 'まだ〜ていません' বলা বাধ্যতামূলক।"
      }
    ]
  },

  // --- LESSON 15: 〜てしまう ---
  {
    lesson_metadata: {
      lesson_id: "N4-L15",
      lesson_number: 15,
      module_number: 3,
      module_name: "Transitivity, Preparation & State",
      module_name_bn: "অকর্মক-সকর্মক, পূর্বপ্রস্তুতি ও অবস্থা",
      title_ja: "完了[かんりょう]と遺憾[いかん]（〜てしまう）",
      title_en: "Completion & Regret (~te shimau / ~chatta)",
      title_bn: "সম্পূর্ণ পরিসমাপ্তি ও আফসোসজনক ভুল (~তে শিমাউ)",
      estimated_minutes: 30,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "〜てしまう (te shimau) এর দুটি গুরুত্বপূর্ণ অর্থ রয়েছে: ১. সম্পূর্ণ সমাপ্তি (Completion): কোনো কাজ একবারে শেষ করে ফেলা (যেমন: 全部読んでしまいました - সম্পূর্ণ পড়ে ফেলেছি); ২. অনুতাপ বা অনিচ্ছাকৃত ভুল (Regret / Mistake): কোনো অনাকাঙ্ক্ষিত ঘটনা ঘটে যাওয়া বা ভুল করে ফেলা যাতে বক্তা মর্মাহত (যেমন: 財布を落としてしまいました - মানিব্যাগ হারিয়ে ফেলেছি)। কথ্য ভাষায় てしまう -> ちゃう (chau) এবং でしまう -> じゃう (jau) হয়।",
      core_concept_bn: "পরিপূর্ণ সমাপ্তি: 全部〜てしまいました; অনিচ্ছাকৃত ভুল বা দুঃখ: 〜てしまいました / 〜ちゃった।",
      real_world_context_bn: "জাপানে ট্রেনের ভেতর ছাতা ফেলে এলে বা পরীক্ষায় ভুল উত্তর দিলে জাপানিরা স্বাভাবিকভাবেই বলে '間違えちゃった!' (ভুল করে ফেললাম!)।",
      key_takeaway_bn: "অনুতাপের ক্ষেত্রে বক্তা স্বেচ্ছায় কাজটি করেননি, দুর্ঘটনাবশত ঘটেছে তা বোঝায়।"
    },
    vocabulary_scope: [
      {
        word_ja: "忘[わす]れる",
        romaji: "wasureru",
        meaning_bn: "ভুলে যাওয়া / ফেলে আসা",
        meaning_en: "to forget / leave behind",
        part_of_speech: "verb",
        example_ja: "電車[でんしゃ]の中[なか]に傘[かさ]を忘[わす]れてしまいました。",
        example_bn: "ট্রেনের ভেতর ছাতাটি ফেলে এসেছি (ভুল করে)।",
        example_en: "I accidentally left my umbrella on the train."
      },
      {
        word_ja: "なくす",
        romaji: "nakusu",
        meaning_bn: "হারিয়ে ফেলা",
        meaning_en: "to lose",
        part_of_speech: "verb",
        example_ja: "鍵[かぎ]をなくしてしまいました。",
        example_bn: "চাবিটি হারিয়ে ফেলেছি।",
        example_en: "I lost my key."
      }
    ],
    kanji_scope: [
      {
        kanji: "忘",
        onyomi: "ボウ",
        kunyomi: "わす・れる",
        meaning_bn: "ভোলা",
        meaning_en: "forget",
        stroke_count: 7,
        compounds: [
          { word_ja: "忘[わす]れる", meaning_bn: "ভুলে যাওয়া", meaning_en: "to forget" },
          { word_ja: "忘年会[ぼうねんかい]", meaning_bn: "বছরের বিদায়ী পার্টি", meaning_en: "year-end party" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "N4-G15-1",
        pattern_ja: "動詞[どうし] て形[けい] + しまいました",
        pattern_bn: "ক্রিয়া て-ফর্ম + しまいました (আফসোসজনক সমাপ্তি)",
        explanation_bn: "অনিচ্ছাকৃত ক্ষতি, ভুল বা সমস্যায় অনুশোচনা প্রকাশ করে।",
        common_pitfalls: [
          "ভালো বা খুশির সংবাদের সাথে てしまいました বসালে ভুল অর্থ প্রকাশ পেতে পারে।"
        ],
        examples: [
          {
            ja: "宿題[しゅくだい]を 家[いえ]に 忘[わす]れてしまいました。",
            bn: "হোমওয়ার্ক বাসায় ফেলে এসেছি।",
            en: "I accidentally left my homework at home."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "রাস্তায় মানিব্যাগ হারানোর পর হতাশা প্রকাশ।",
      situation_en: "Expressing distress after losing a wallet on the street.",
      lines: [
        {
          speaker_ja: "スマン",
          speaker_en: "Suman",
          line_ja: "大変[たいへん]です！財布[さいふ]をどこかで落[お]としてしまいました。",
          line_bn: "বিপদ ঘটে গেছে! মানিব্যাগটা কোথায় যেন ফেলে এসেছি।",
          line_en: "Oh no! I accidentally dropped my wallet somewhere."
        },
        {
          speaker_ja: "友人[ゆうじん]",
          speaker_en: "Friend",
          line_ja: "えっ、本当[ほんとう]に？中[なか]に在留[ざいりゅう]カードも入[はい]っていましたか。",
          line_bn: "অ্যাঁ, সত্যিই? ভেতরে কি রেসিডেন্স কার্ডও ছিল?",
          line_en: "What, really? Was your residence card in it too?"
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "বছরের শেষে জাপানিদের 'বনেঙ্কাই' (忘年会 - Year End Party) সংস্কৃতি",
      tip_bn: "ডিসেম্বর মাসে জাপানের সব কোম্পানি ও বন্ধুদের গ্রুপে 忘年会 (Bounenkai - বছরের সব দুঃখ-কষ্ট ভোলার পার্টি) অনুষ্ঠিত হয়। এর মূল দর্শন হলো বছরের ভুলত্রুটি ভুলে নতুন বছরে নতুন উদ্দীপনায় কাজ শুরু করা।",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "忘[わす]れる",
        romaji_input: "wasureru",
        target_display: "わすれる",
        meaning_bn: "ভুলে যাওয়া"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-N4-L15-1",
        question_ja: "「大切な パスポートを（　　）しまいました」正しい動詞は？",
        question_bn: "গুরুত্বপূর্ণ পাসপোর্ট হারিয়ে ফেলেছি—সঠিক রূপ কোনটি?",
        options: [
          "なくして",
          "なくす",
          "なくした",
          "なくさないで"
        ],
        correct_index: 0,
        explanation_bn: "て-ফর্মের সাথে しまいました যুক্ত হয় (なくしてしまいました)।"
      }
    ]
  }
];
