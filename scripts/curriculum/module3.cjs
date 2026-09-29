// Module 3: Movement & Transactions (Lessons 16 - 20)
module.exports = [
  // --- LESSON 16: 日本へ行きます ---
  {
    lesson_metadata: {
      lesson_id: "L16",
      lesson_number: 16,
      module_number: 3,
      module_name: "Movement & Transactions",
      module_name_bn: "চলাচল ও লেনদেন",
      title_ja: "日本[にほん]へ行[い]きます",
      title_en: "Directional Verbs & Particle HE (e)",
      title_bn: "জাপান যাব (দিক ও গন্তব্য নির্দেশক)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "চলাচলসূচক প্রধান তিনটি ক্রিয়া হলো: 行[い]きます (যাওয়া), 来[き]ます (আসা), এবং 帰[かえ]ります (বাড়ি/স্বদেশে ফেরা)। গন্তব্য বা দিক নির্দেশ করতে へ (উচ্চারণ: e) অথবা に (ni) পার্টিকেল ব্যবহৃত হয়। যেমন: 'জাপানে যাব' -> 日本[にほん]へ行[い]きます。",
      core_concept_bn: "গন্তব্য নির্দেশক へ (e) এবং তিনটি প্রধান গতিশীল ক্রিয়া (行きます・来ます・帰ります)।",
      real_world_context_bn: "এয়ারপোর্টে ইমিগ্রেশন পার হওয়া, স্টেশনে কোন গন্তব্যের ট্রেন তা চিহ্নিত করা এবং স্বদেশে ফেরার আলোচনা।",
      key_takeaway_bn: "পার্টিকেল হিসেবে へ এর বানান he হলেও এর উচ্চারণ সবসময় 'এ' (e)।"
    },
    vocabulary_scope: [
      {
        word_ja: "行[い]きます",
        romaji: "ikimasu",
        meaning_bn: "যাওয়া",
        meaning_en: "to go",
        part_of_speech: "verb",
        example_ja: "明日[あした]東京[とうきょう]へ行[い]きます。",
        example_bn: "কাল টোকিও যাব।",
        example_en: "I will go to Tokyo tomorrow."
      },
      {
        word_ja: "来[き]ます",
        romaji: "kimasu",
        meaning_bn: "আসা",
        meaning_en: "to come",
        part_of_speech: "verb",
        example_ja: "友達[ともだち]が家[いえ]へ来[き]ます。",
        example_bn: "বন্ধু বাসায় আসবে।",
        example_en: "A friend is coming to my house."
      },
      {
        word_ja: "帰[かえ]ります",
        romaji: "kaerimasu",
        meaning_bn: "ফেরা (বাসায় বা নিজ দেশে)",
        meaning_en: "to return / go home",
        part_of_speech: "verb",
        example_ja: "六時[ろくじ]にうちへ帰[かえ]ります。",
        example_bn: "৬টায় বাসায় ফিরি।",
        example_en: "I go home at 6."
      },
      {
        word_ja: "学校[がっこう]",
        romaji: "gakkō",
        meaning_bn: "বিদ্যালয় / স্কুল",
        meaning_en: "school",
        part_of_speech: "noun",
        example_ja: "朝[あさ]学校[がっこう]へ行[い]きます。",
        example_bn: "সকালে স্কুলে যাই।",
        example_en: "I go to school in the morning."
      },
      {
        word_ja: "空港[くうこう]",
        romaji: "kūkō",
        meaning_bn: "বিমানবন্দর / এয়ারপোর্ট",
        meaning_en: "airport",
        part_of_speech: "noun",
        example_ja: "成田空港[なりたくうこう]へ行[い]きます。",
        example_bn: "নারিতা বিমানবন্দরে যাই।",
        example_en: "I go to Narita Airport."
      }
    ],
    kanji_scope: [
      {
        kanji: "行",
        onyomi: "コウ, ギョウ",
        kunyomi: "い・く, ゆ・く, おこな・う",
        meaning_bn: "যাওয়া / সম্পাদন",
        meaning_en: "go / conduct",
        stroke_count: 6,
        compounds: [
          { word_ja: "行[い]きます", meaning_bn: "যাই / যাব", meaning_en: "go" },
          { word_ja: "銀行[ぎんこう]", meaning_bn: "ব্যাংক", meaning_en: "bank" },
          { word_ja: "旅行[りょこう]", meaning_bn: "ভ্রমণ", meaning_en: "travel" }
        ]
      },
      {
        kanji: "来",
        onyomi: "ライ",
        kunyomi: "く・る, きた・る",
        meaning_bn: "আসা / আগমন",
        meaning_en: "come / next",
        stroke_count: 7,
        compounds: [
          { word_ja: "来[き]ます", meaning_bn: "আসি / আসব", meaning_en: "come" },
          { word_ja: "来週[らいしゅう]", meaning_bn: "আগামী সপ্তাহ", meaning_en: "next week" },
          { word_ja: "来月[らいげつ]", meaning_bn: "আগামী মাস", meaning_en: "next month" }
        ]
      },
      {
        kanji: "帰",
        onyomi: "キ",
        kunyomi: "かえ・る",
        meaning_bn: "প্রত্যাবর্তন / ফেরা",
        meaning_en: "return / go home",
        stroke_count: 10,
        compounds: [
          { word_ja: "帰[かえ]ります", meaning_bn: "ফেরা", meaning_en: "return" },
          { word_ja: "帰国[きこく]", meaning_bn: "স্বদেশে প্রত্যাবর্তন", meaning_en: "returning to home country" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G16-1",
        pattern_ja: "Place へ / に 行きます / 来ます / 帰ります",
        pattern_bn: "[স্থান] এ যাওয়া / আসা / ফেরা",
        explanation_bn: "গন্তব্য নির্দেশ করতে へ অথবা に বসে। へ গতি ও দিক নির্দেশ করে এবং に নির্দিষ্ট চূড়ান্ত পৌঁছানোর স্থান নির্দেশ করে।",
        common_pitfalls: [
          "帰ります শুধু নিজের বাড়ি বা নিজের দেশের ক্ষেত্রে ব্যবহৃত হয়; বন্ধুর বাসায় যাওয়াকে 帰ります বলা ভুল, 行きます বলতে হবে।"
        ],
        examples: [
          {
            ja: "来年[らいねん]日本[にほん]へ行[い]きます。",
            bn: "আগামী বছর জাপান যাব।",
            en: "I will go to Japan next year."
          }
        ]
      },
      {
        point_id: "G16-2",
        pattern_ja: "どこ（へ）も 行きません",
        pattern_bn: "কোথাও যাব না (সম্পূর্ণ অস্বীকৃতি)",
        explanation_bn: "প্রশ্নবোধক শব্দের সাথে も এবং না-বোধক ক্রিয়া যোগ করলে সম্পূর্ণ না-বোধক অর্থ প্রকাশ পায়। যেমন: 誰もいません (কেউ নেই), 何も食べません (কিছুই খাই না)।",
        common_pitfalls: [
          "এখানে へ বাদ দিয়ে どこも行きません বলা সম্পূর্ণ স্বাভাবিক।"
        ],
        examples: [
          {
            ja: "日曜日[にちようび]はどこも行[い]きませんでした。",
            bn: "রবিবারে কোথাও যাইনি।",
            en: "I didn't go anywhere on Sunday."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "টোকিওতে নারিতা এয়ারপোর্টে বন্ধুকে স্বাগত জানানো।",
      situation_en: "Welcoming a friend at Narita Airport in Tokyo.",
      lines: [
        {
          speaker_ja: "タニム[たにむ]",
          speaker_en: "Tanim",
          line_ja: "ようこそ日本[にほん]へ！いつ来[き]ましたか。",
          line_bn: "জাপানে স্বাগতম! কখন এলে?",
          line_en: "Welcome to Japan! When did you arrive?"
        },
        {
          speaker_ja: "サキブ[さきぶ]",
          speaker_en: "Sakib",
          line_ja: "今日[きょう]の午後[ごご]二時[にじ]に来[き]ました。",
          line_bn: "আজ দুপুর ২টায় এসেছি।",
          line_en: "I arrived at 2 PM today."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "আইসি কার্ড (Suica / Pasmo) এবং টিকিটহীন গণপরিবহন",
      tip_bn: "জাপানে মেট্রো ও ট্রেনে চড়তে প্রতিবার কাগজের টিকিট কাটার দরকার নেই। রিচার্জেবল আইসি কার্ড যেমন 'Suica' বা 'Pasmo' টিকিট গেটে এক সেকেন্ড ছুঁইয়ে দিলেই ভাড়া কেটে গেট খুলে যায়। এমনকি এই কার্ড দিয়ে ভেন্ডিং মেশিন ও কনবিনিতেও পেমেন্ট করা যায়।",
      category: "Transport"
    },
    typing_practice: [
      {
        prompt_ja: "日本[にほん]へ行[い]きます",
        romaji_input: "nihon e ikimasu",
        target_display: "にほんへいきます",
        meaning_bn: "জাপান যাব"
      },
      {
        prompt_ja: "うちへ帰[かえ]ります",
        romaji_input: "uchi e kaerimasu",
        target_display: "うちへかえります",
        meaning_bn: "বাসায় ফিরি"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L16-1",
        question_ja: "「日本へ行きます」の「へ」の 正[ただ]しい 発音[はつおん]は どれですか。",
        question_bn: "‘にほんへいきます’ বাক্যে ‘へ’ এর সঠিক উচ্চারণ কোনটি?",
        options: [
          "え (e)",
          "へ (he)",
          "は (wa)",
          "に (ni)"
        ],
        correct_index: 0,
        explanation_bn: "দিক বা গন্তব্য নির্দেশক পার্টিকেল হিসেবে 'へ' এর উচ্চারণ 'এ' (e) হয়।"
      }
    ]
  },

  // --- LESSON 17: バスで行きます ---
  {
    lesson_metadata: {
      lesson_id: "L17",
      lesson_number: 17,
      module_number: 3,
      module_name: "Movement & Transactions",
      module_name_bn: "চলাচল ও লেনদেন",
      title_ja: "バスで行[い]きます",
      title_en: "Means of Transportation & Tool Particle DE",
      title_bn: "বাসে করে যাই (যানবাহন ও মাধ্যম)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "কোনো মাধ্যমে ভ্রমণ বা কোনো যন্ত্র/টুল দিয়ে কাজ সম্পন্ন করার ক্ষেত্রে で (de) পার্টিকেল ব্যবহৃত হয়, যা বাংলায় 'দ্বারা / দিয়ে / মাধ্যমে' (তৃতীয়া বিভক্তি)। যেমন: বাসে করে = バスで, ট্রেনে = 電車[でんしゃ]で। কিন্তু হেঁটে যাওয়ার ক্ষেত্রে কোনো で বসে না, সরাসরি 歩[ある]いて (aruite) বসে।",
      core_concept_bn: "মাধ্যম বা উপায়ের পার্টিকেল で (de) এবং পায়ে হেঁটে (歩いて) এর ব্যতিক্রম।",
      real_world_context_bn: "টোকিওতে পাতাল রেল (Chikatetsu), বুলেট ট্রেন (Shinkansen) বা বাসে যাতায়াতের রুট আলোচনা।",
      key_takeaway_bn: "যানবাহন + で (দ্বারা / মাধ্যমে), কিন্তু পায়ে হেঁটে গেলে শুধু 歩[ある]いて।"
    },
    vocabulary_scope: [
      {
        word_ja: "バス",
        romaji: "basu",
        meaning_bn: "বাস",
        meaning_en: "bus",
        part_of_speech: "noun",
        example_ja: "バスで学校[がっこう]へ行[い]きます。",
        example_bn: "বাসে করে স্কুলে যাই।",
        example_en: "I go to school by bus."
      },
      {
        word_ja: "電車[でんしゃ]",
        romaji: "densha",
        meaning_bn: "বৈদ্যুতিক ট্রেন",
        meaning_en: "train",
        part_of_speech: "noun",
        example_ja: "電車[でんしゃ]は便利[べんり]です。",
        example_bn: "ট্রেন সুবিধাজনক।",
        example_en: "Trains are convenient."
      },
      {
        word_ja: "新幹線[しんかんせん]",
        romaji: "shinkansen",
        meaning_bn: "বুলেট ট্রেন",
        meaning_en: "bullet train",
        part_of_speech: "noun",
        example_ja: "新幹線[しんかんせん]で京都[きょうと]へ行[い]きました。",
        example_bn: "বুলেট ট্রেনে করে কিয়োটো গিয়েছিলাম।",
        example_en: "I went to Kyoto by bullet train."
      },
      {
        word_ja: "自転車[じてんしゃ]",
        romaji: "jitensha",
        meaning_bn: "বাইসাইকেল",
        meaning_en: "bicycle",
        part_of_speech: "noun",
        example_ja: "自転車[じてんしゃ]で駅[えき]まで行[い]きます。",
        example_bn: "সাইকেল চালিয়ে স্টেশন পর্যন্ত যাই।",
        example_en: "I go to the station by bicycle."
      },
      {
        word_ja: "歩[ある]いて",
        romaji: "aruite",
        meaning_bn: "পায়ে হেঁটে",
        meaning_en: "on foot / walking",
        part_of_speech: "adverb",
        example_ja: "家[いえ]から駅[えき]まで歩[ある]いて五分[ごふん]です。",
        example_bn: "বাড়ি থেকে স্টেশনে হেঁটে ৫ মিনিট।",
        example_en: "It is a 5-minute walk from home to the station."
      }
    ],
    kanji_scope: [
      {
        kanji: "電",
        onyomi: "デン",
        kunyomi: "いなずま",
        meaning_bn: "বিদ্যুৎ / বিদ্যুৎচালিত",
        meaning_en: "electricity",
        stroke_count: 13,
        compounds: [
          { word_ja: "電車[でんしゃ]", meaning_bn: "ট্রেন", meaning_en: "train" },
          { word_ja: "電気[でんき]", meaning_bn: "বিদ্যুৎ / বাতি", meaning_en: "electricity / light" },
          { word_ja: "電話[でんわ]", meaning_bn: "টেলিফোন", meaning_en: "telephone" }
        ]
      },
      {
        kanji: "歩",
        onyomi: "ホ, ブ",
        kunyomi: "ある・く, あゆ・む",
        meaning_bn: "হাঁটা / পদযাত্রা",
        meaning_en: "walk / step",
        stroke_count: 8,
        compounds: [
          { word_ja: "歩[ある]きます", meaning_bn: "হাঁটা", meaning_en: "to walk" },
          { word_ja: "歩道[ほどう]", meaning_bn: "ফুটপাত", meaning_en: "sidewalk / pedestrian path" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G17-1",
        pattern_ja: "Vehicle で 行きます / 来ます / 帰ります",
        pattern_bn: "[যানবাহন] এ করে যাওয়া / আসা",
        explanation_bn: "যাতায়াতের যানবাহনের সাথে で পার্টিকেল বসে। এটি মাধ্যম বা উপায় প্রকাশ করে।",
        common_pitfalls: [
          "歩いて এর পর কখনো で বসাবেন না (× 歩いてで行きます, ○ 歩いて行きます)।"
        ],
        examples: [
          {
            ja: "何[なん]で行[い]きますか。地下鉄[ちかてつ]で行[い]きます。",
            bn: "কীসে করে যাবেন? পাতাল ট্রেনে যাব।",
            en: "How will you go? I will go by subway."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "বিশ্ববিদ্যালয়ে কীভাবে যায় তা সহপাঠীকে জানানো।",
      situation_en: "Explaining how one commutes to university to a classmate.",
      lines: [
        {
          speaker_ja: "学生[がくせい]A",
          speaker_en: "Student A",
          line_ja: "毎日[まいにち]何[なん]で大学[だいがく]へ来[き]ますか。",
          line_bn: "প্রতিদিন কীসে করে বিশ্ববিদ্যালয়ে আসেন?",
          line_en: "How do you come to university every day?"
        },
        {
          speaker_ja: "学生[がくせい]B",
          speaker_en: "Student B",
          line_ja: "自転車[じてんしゃ]で来[き]ます。近[ちか]いですから。",
          line_bn: "সাইকেল চালিয়ে আসি। কারণ কাছেই থাকি।",
          line_en: "I come by bicycle. Because it is close."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানে সাইকেল চালানোর কড়া ট্রাফিক আইন",
      tip_bn: "জাপানে সাইকেল চালানো অত্যন্ত জনপ্রিয় হলেও এর আইন খুব কঠোর। ছাতা ধরে বা কানে হেডফোন লাগিয়ে সাইকেল চালালে ৫০,০০০ ইয়েন পর্যন্ত জরিমানা হতে পারে। সাইকেল কেনার পর থানায় অ্যান্টি-থেফট রেজিস্ট্রেশন (Bouhan Touroku) করানো বাধ্যতামূলক এবং ফুটপাতে পথচারীদের অগ্রাধিকার দিতে হয়।",
      category: "Transport"
    },
    typing_practice: [
      {
        prompt_ja: "バスで行[い]きます",
        romaji_input: "basu de ikimasu",
        target_display: "バスでいきます",
        meaning_bn: "বাসে যাব"
      },
      {
        prompt_ja: "歩[ある]いて行[い]きます",
        romaji_input: "aruite ikimasu",
        target_display: "あるいていきます",
        meaning_bn: "হেঁটে যাব"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L17-1",
        question_ja: "電車（　）行[い]きます。空欄[くうらん]に 入[はい]る 助詞[じょし]は どれですか。",
        question_bn: "শূন্যস্থানে কোন পার্টিকেল বসবে: でんしゃ（　）いきます",
        options: [
          "で (de)",
          "に (ni)",
          "へ (e)",
          "を (o)"
        ],
        correct_index: 0,
        explanation_bn: "যানবাহনের মাধ্যমে যাতায়াত বোঝাতে 'で' পার্টিকেল বসে: 電車で行きます (ট্রেনে করে যাই)।"
      }
    ]
  },

  // --- LESSON 18: パンを食べます ---
  {
    lesson_metadata: {
      lesson_id: "L18",
      lesson_number: 18,
      module_number: 3,
      module_name: "Movement & Transactions",
      module_name_bn: "চলাচল ও লেনদেন",
      title_ja: "パンを食[た]べます",
      title_en: "Transitive Verbs & Direct Object Particle O (wo)",
      title_bn: "রুটি খাই (সকর্মক ক্রিয়া ও কর্মকারক)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "সকর্মক ক্রিয়ার কর্ম (Direct Object) নির্দেশ করতে を (উচ্চারণ: o) পার্টিকেল বসে। বাংলায় যেমন 'ভাত খাই' বা 'পানি পান করি', জাপানিতে কর্মের পরে を বসে: ごはんを食[た]べます। এছাড়া কাউকে কোনো কাজের প্রস্তাব দিতে 〜ませんか (masen ka - করবেন নাকি?) ব্যবহৃত হয়।",
      core_concept_bn: "কর্মকারকের পার্টিকেল を (o), সকর্মক ক্রিয়া এবং বিনম্র আমন্ত্রণ (〜ませんか)।",
      real_world_context_bn: "রেস্তোরাঁয় খাবার অর্ডার করা, পানীয় পান করা এবং বন্ধুদের সাথে দুপুরের খাবারের আমন্ত্রণ জানানো।",
      key_takeaway_bn: "বস্তু + を + ক্রিয়া (V-ます)। を এর বানান wo হলেও আধুনিক উচ্চারণ খাঁটি 'ও' (o)।"
    },
    vocabulary_scope: [
      {
        word_ja: "食[た]べます",
        romaji: "tabemasu",
        meaning_bn: "খাওয়া",
        meaning_en: "to eat",
        part_of_speech: "verb",
        example_ja: "朝[あさ]ごはんを食[た]べます。",
        example_bn: "সকালের নাশতা খাই।",
        example_en: "I eat breakfast."
      },
      {
        word_ja: "飲[の]みます",
        romaji: "nomimasu",
        meaning_bn: "পান করা",
        meaning_en: "to drink",
        part_of_speech: "verb",
        example_ja: "水[みず]を飲[の]みます。",
        example_bn: "পানি পান করি।",
        example_en: "I drink water."
      },
      {
        word_ja: "見[み]ます",
        romaji: "mimasu",
        meaning_bn: "দেখা / দর্শন করা",
        meaning_en: "to see / watch",
        part_of_speech: "verb",
        example_ja: "アニメを見[み]ます。",
        example_bn: "অ্যানিমে দেখি।",
        example_en: "I watch anime."
      },
      {
        word_ja: "聞[き]きます",
        romaji: "kikimasu",
        meaning_bn: "শোনা / জিজ্ঞাসা করা",
        meaning_en: "to listen / hear / ask",
        part_of_speech: "verb",
        example_ja: "音楽[おんがく]を聞[き]きます。",
        example_bn: "গান শুনি।",
        example_en: "I listen to music."
      },
      {
        word_ja: "読[よ]みます",
        romaji: "yomimasu",
        meaning_bn: "পড়া",
        meaning_en: "to read",
        part_of_speech: "verb",
        example_ja: "新聞[しんぶん]を読[よ]みます。",
        example_bn: "সংবাদপত্র পড়ি।",
        example_en: "I read the newspaper."
      }
    ],
    kanji_scope: [
      {
        kanji: "食",
        onyomi: "ショク",
        kunyomi: "た・べる, く・らう",
        meaning_bn: "খাওয়া / আহার",
        meaning_en: "eat / food",
        stroke_count: 9,
        compounds: [
          { word_ja: "食[た]べます", meaning_bn: "খাওয়া", meaning_en: "to eat" },
          { word_ja: "食堂[しょくどう]", meaning_bn: "ডাইনিং হল / ক্যান্টিন", meaning_en: "cafeteria" },
          { word_ja: "食事[しょくじ]", meaning_bn: "খাবার / আহার", meaning_en: "meal" }
        ]
      },
      {
        kanji: "飲",
        onyomi: "イン",
        kunyomi: "の・む",
        meaning_bn: "পান করা",
        meaning_en: "drink",
        stroke_count: 12,
        compounds: [
          { word_ja: "飲[の]みます", meaning_bn: "পান করা", meaning_en: "to drink" },
          { word_ja: "飲[の]み物[もの]", meaning_bn: "পানীয়", meaning_en: "beverage / drink" }
        ]
      },
      {
        kanji: "見",
        onyomi: "ケン",
        kunyomi: "み・る, み・える, み・せる",
        meaning_bn: "দেখা / দৃশ্যমান",
        meaning_en: "see / look",
        stroke_count: 7,
        compounds: [
          { word_ja: "見[み]ます", meaning_bn: "দেখা", meaning_en: "to watch / see" },
          { word_ja: "意見[いけん]", meaning_bn: "মতামত", meaning_en: "opinion" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G18-1",
        pattern_ja: "N を V-ます",
        pattern_bn: "N-কে কর্ম হিসেবে সম্পন্ন করা",
        explanation_bn: "ক্রিয়াটি যাঁর ওপর প্রযুক্ত হয় তার সাথে を বসে। を পার্টিকেল শুধুমাত্র বাক্যের কর্ম নির্দেশের জন্য সংরক্ষিত, শব্দের মাঝে কখনো を বসে না।",
        common_pitfalls: [
          "কীবোর্ডে টাইপ করার সময় 'wo' টাইপ করতে হয়, কিন্তু উচ্চারণে শুধু 'o' বলতে হবে।"
        ],
        examples: [
          {
            ja: "昼[ひる]ごはんを食[た]べましたか。",
            bn: "দুপুরের খাবার খেয়েছেন কি?",
            en: "Did you eat lunch?"
          }
        ]
      },
      {
        point_id: "G18-2",
        pattern_ja: "V-ませんか (勧誘[かんゆう])",
        pattern_bn: "করবেন নাকি? (বিনম্র প্রস্তাব বা আমন্ত্রণ)",
        explanation_bn: "কাউকে কোনো কাজে একসাথে যোগ দেওয়ার বিনম্র প্রস্তাব দিতে ক্রিয়ার না-বোধক প্রশ্নরূপ 〜ませんか ব্যবহৃত হয়। যেমন: 一緒[いっしょ]に食[た]べませんか (একসাথে খাবেন নাকি?)।",
        common_pitfalls: [
          "এটি প্রকৃত না-বোধক প্রশ্ন নয়, বরং অত্যন্ত ভদ্রস্থ আমন্ত্রণ।"
        ],
        examples: [
          {
            ja: "一緒[いっしょ]にお茶[ちゃ]を飲[の]みませんか。",
            bn: "একসাথে চা খাবেন নাকি?",
            en: "Would you like to drink tea together?"
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "ক্যাম্পাসে সহপাঠীকে দুপুরের খাবার একসাথে খাওয়ার আমন্ত্রণ জানানো।",
      situation_en: "Inviting a classmate to have lunch together on campus.",
      lines: [
        {
          speaker_ja: "田中[たなか]",
          speaker_en: "Tanaka",
          line_ja: "もう昼[ひる]ごはんを食[た]べましたか。",
          line_bn: "দুপুরের খাবার কি খেয়ে ফেলেছেন?",
          line_en: "Have you already eaten lunch?"
        },
        {
          speaker_ja: "自分[じぶん]",
          speaker_en: "Self",
          line_ja: "いいえ、まだです。これから食堂[しょくどう]へ行[い]きます。",
          line_bn: "না, এখনো খাইনি। এখন ক্যান্টিনে যাব।",
          line_en: "No, not yet. I am going to the cafeteria now."
        },
        {
          speaker_ja: "田中[たなか]",
          speaker_en: "Tanaka",
          line_ja: "じゃ、一緒[いっしょ]に食[た]べませんか。",
          line_bn: "তাহলে একসাথে খাবেন নাকি?",
          line_en: "Well then, shall we eat together?"
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "খাওয়ার আগের (いただき) ও পরের (ごちそう) পবিত্র অভিবাদন",
      tip_bn: "জাপানি সংস্কৃতিতে খাবারের আগে দুই হাত জোড় করে 'いただきます' (Itadakimasu - আমি বিনীতভাবে গ্রহণ করছি) এবং খাওয়া শেষ করে 'ごちそうさまでした' (Gochisousama deshita - ভোজের জন্য ধন্যবাদ) বলা অপরিহার্য কায়দা। এটি খাদ্য প্রস্তুতকারী এবং প্রকৃতির প্রতি গভীর কৃতজ্ঞতা প্রকাশের সংস্কৃতি।",
      category: "Manners"
    },
    typing_practice: [
      {
        prompt_ja: "パンを食[た]べます",
        romaji_input: "pan o tabemasu",
        target_display: "パンをたべます",
        meaning_bn: "রুটি খাই"
      },
      {
        prompt_ja: "お茶[ちゃ]を飲[の]みませんか",
        romaji_input: "ocha o nomimasen ka",
        target_display: "おちゃをのみませんか",
        meaning_bn: "চা খাবেন নাকি?"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L18-1",
        question_ja: "水（　）飲[の]みます。空欄[くうらん]に 入[はい]る 正[ただ]しい 助詞[じょし]は どれですか。",
        question_bn: "শূন্যস্থানে কোন পার্টিকেল বসবে: みず（　）のみます",
        options: [
          "を (o)",
          "で (de)",
          "に (ni)",
          "が (ga)"
        ],
        correct_index: 0,
        explanation_bn: "সকর্মক ক্রিয়ার সরাসরি কর্ম (Object) নির্দেশ করতে 'を' (o) পার্টিকেল বসে: 水を飲みます (পানি পান করি)।"
      }
    ]
  },

  // --- LESSON 19: デパートで買います ---
  {
    lesson_metadata: {
      lesson_id: "L19",
      lesson_number: 19,
      module_number: 3,
      module_name: "Movement & Transactions",
      module_name_bn: "চলাচল ও লেনদেন",
      title_ja: "デパートで買[か]います",
      title_en: "Action Location Particle DE & Shopping",
      title_bn: "ডিপার্টমেন্টাল স্টোরে কিনি (কাজের স্থান)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "জাপানিতে স্থান নির্দেশক দুটি প্রধান পার্টিকেল রয়েছে: に (ni) এবং で (de)। যখন কোনো স্থানে কোনো কর্ম বা অ্যাকশন সম্পন্ন হয় (যেমন: কেনাকাটা করা, খাওয়া, পড়াশোনা করা), তখন স্থানের পরে で বসে। আর কোনো স্থানে স্রেফ অবস্থান বা অস্তিত্ব থাকলে に বসে।",
      core_concept_bn: "কর্ম সম্পাদনের স্থান নির্দেশক で (de) বনাম অস্তিত্বের স্থান に (ni)।",
      real_world_context_bn: "সুপারমার্কেটে কেনাকাটা করা, লাইব্রেরিতে পড়াশোনা করা বা রেস্তোরাঁয় খাবার গ্রহণ করা।",
      key_takeaway_bn: "কর্ম সম্পাদন = স্থান + で (যেমন: デパートで買[か]います)। অস্তিত্ব = স্থান + に (部屋[へや]にいます)।"
    },
    vocabulary_scope: [
      {
        word_ja: "買[か]います",
        romaji: "kaimasu",
        meaning_bn: "কেনা / ক্রয় করা",
        meaning_en: "to buy",
        part_of_speech: "verb",
        example_ja: "シャツを買[か]いました。",
        example_bn: "শার্ট কিনেছি।",
        example_en: "I bought a shirt."
      },
      {
        word_ja: "デパート",
        romaji: "depāto",
        meaning_bn: "ডিপার্টমেন্টাল স্টোর",
        meaning_en: "department store",
        part_of_speech: "noun",
        example_ja: "デパートで買[か]い物[もの]をします。",
        example_bn: "ডিপার্টমেন্টাল স্টোরে কেনাকাটা করি।",
        example_en: "I shop at a department store."
      },
      {
        word_ja: "スーパー",
        romaji: "sūpā",
        meaning_bn: "সুপারমার্কেট",
        meaning_en: "supermarket",
        part_of_speech: "noun",
        example_ja: "スーパーで野菜[やさい]を買[か]います。",
        example_bn: "সুপারমার্কেটে শাকসবজি কিনি।",
        example_en: "I buy vegetables at the supermarket."
      },
      {
        word_ja: "どこで",
        romaji: "dokode",
        meaning_bn: "কোথায়? (কাজের স্থান)",
        meaning_en: "where (action location)?",
        part_of_speech: "pronoun phrase",
        example_ja: "どこでその靴[くつ]を買[か]いましたか。",
        example_bn: "কোথায় ঐ জুতো কিনেছেন?",
        example_en: "Where did you buy those shoes?"
      },
      {
        word_ja: "靴[くつ]",
        romaji: "kutsu",
        meaning_bn: "জুতো",
        meaning_en: "shoes",
        part_of_speech: "noun",
        example_ja: "新[あたら]しい靴[くつ]を買[か]いました。",
        example_bn: "নতুন জুতো কিনেছি।",
        example_en: "I bought new shoes."
      }
    ],
    kanji_scope: [
      {
        kanji: "買",
        onyomi: "バイ",
        kunyomi: "か・う",
        meaning_bn: "কেনা / ক্রয়",
        meaning_en: "buy",
        stroke_count: 12,
        compounds: [
          { word_ja: "買[か]います", meaning_bn: "কেনা", meaning_en: "to buy" },
          { word_ja: "買[か]い物[もの]", meaning_bn: "কেনাকাটা", meaning_en: "shopping" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G19-1",
        pattern_ja: "Place で V-ます",
        pattern_bn: "[স্থান] এ [কাজ] করা (Action Location)",
        explanation_bn: "কোনো স্থানে কর্ম সম্পাদিত হলে সেই স্থানের পর で বসে। যেমন: 図書館[としょかん]で勉強[べんきょう]します (লাইব্রেরিতে পড়াশোনা করি)।",
        common_pitfalls: [
          "অস্তিত্ব ক্রিয়া (あります / います) এর সাথে ভুলেও で ব্যবহার করবেন না, সেক্ষেত্রে に বসবে।"
        ],
        examples: [
          {
            ja: "レストランで晩[ばん]ごはんを食[た]べます。",
            bn: "রেস্তোরাঁয় রাতের খাবার খাব।",
            en: "I will eat dinner at a restaurant."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "বন্ধুর সুন্দর জ্যাকেট দেখে কোথা থেকে কেনা তা জিজ্ঞাসা করা।",
      situation_en: "Asking a friend where they bought their stylish jacket.",
      lines: [
        {
          speaker_ja: "友達[ともだち]",
          speaker_en: "Friend",
          line_ja: "そのジャケット、素敵[すてき]ですね。どこで買[か]いましたか。",
          line_bn: "ঐ জ্যাকেটটি খুব চমৎকার তো! কোথায় কিনেছেন?",
          line_en: "That jacket is wonderful! Where did you buy it?"
        },
        {
          speaker_ja: "自分[じぶん]",
          speaker_en: "Self",
          line_ja: "新宿[しんじゅく]のデパートで買[か]いました。",
          line_bn: "শিনজুকুর ডিপার্টমেন্টাল স্টোরে কিনেছি।",
          line_en: "I bought it at a department store in Shinjuku."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের ১০০ ইয়েন শপ (Daiso / Seria) ও সাশ্রয়ী কেনাকাটা",
      tip_bn: "জাপানে নতুন জীবন শুরু করার জন্য সবচেয়ে গুরুত্বপূর্ণ দোকান হলো ১০০ ইয়েন শপ (Daiso, Seria, Can Do)। হাঁড়িপাতিল, থালাবাসন, স্টেশনারি, চার্জার ও পরিষ্কারের সরঞ্জাম প্রায় সবই ১০০ ইয়েন (ট্যাক্সসহ ১১০ ইয়েন)-এ পাওয়া যায়। নতুন ছাত্রদের শুরুতেই দামি ডিপার্টমেন্টাল স্টোরে না গিয়ে ১০০ ইয়েন শপে যাওয়া অর্থ বাঁচায়।",
      category: "Shopping"
    },
    typing_practice: [
      {
        prompt_ja: "デパートで買[か]います",
        romaji_input: "depa-to de kaimasu",
        target_display: "デパートでかいます",
        meaning_bn: "ডিপার্টমেন্টাল স্টোরে কিনি"
      },
      {
        prompt_ja: "どこで買[か]いましたか",
        romaji_input: "doko de kaimashita ka",
        target_display: "どこでかいましたか",
        meaning_bn: "কোথায় কিনেছেন?"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L19-1",
        question_ja: "図書館[としょかん]（　）本[ほん]を 読[よ]みます。空欄[くうらん]に 入[はい]る 正[ただ]しい 助詞[じょし]は どれですか。",
        question_bn: "শূন্যস্থানে কোন পার্টিকেল বসবে: としょかん（　）ほんを よみます",
        options: [
          "で (de)",
          "に (ni)",
          "を (o)",
          "へ (e)"
        ],
        correct_index: 0,
        explanation_bn: "লাইব্রেরিতে বই পড়ার কর্ম (Action) সম্পাদিত হচ্ছে, তাই কাজের স্থান হিসেবে 'で' পার্টিকেল বসবে।"
      }
    ]
  },

  // --- LESSON 20: 友達に会います ---
  {
    lesson_metadata: {
      lesson_id: "L20",
      lesson_number: 20,
      module_number: 3,
      module_name: "Movement & Transactions",
      module_name_bn: "চলাচল ও লেনদেন",
      title_ja: "友達[ともだち]に会[あ]います",
      title_en: "Interaction Partner Particle NI & Meeting People",
      title_bn: "বন্ধুর সাথে দেখা করব (লক্ষ্য ও পারস্পরিক ক্রিয়া)",
      estimated_minutes: 25,
      difficulty: "Elementary"
    },
    bengali_bridge: {
      explanation_bn: "বাংলায় আমরা বলি 'বন্ধুর সাথে দেখা করব'। কিন্তু জাপানি ভাষায় দেখা করা (会[あ]います), প্রশ্ন করা (聞[き]きます), অথবা টেলিফোন করা (電話[でんわ]をかけます) ক্রিয়ার ক্ষেত্রে লক্ষ্য ব্যক্তিটির পর に (ni) পার্টিকেল বসে। গঠন: [ব্যক্তি] に 会[あ]います।",
      core_concept_bn: "মিথস্ক্রিয়ার লক্ষ্য নির্দেশক に (ni) এবং সামাজিক সম্পর্কের ক্রিয়াপদ।",
      real_world_context_bn: "বন্ধুর সাথে সাক্ষাতের সময় নির্ধারণ, শিক্ষককে প্রশ্ন জিজ্ঞাসা করা এবং সহকর্মীকে কল করা।",
      key_takeaway_bn: "[ব্যক্তি] に 会[あ]います (কারও সাথে দেখা করা)। এখানে と এর বদলে に প্রধান প্রাধান্য পায়।"
    },
    vocabulary_scope: [
      {
        word_ja: "会[あ]います",
        romaji: "aimasu",
        meaning_bn: "দেখা করা / সাক্ষাৎ করা",
        meaning_en: "to meet",
        part_of_speech: "verb",
        example_ja: "駅[えき]で友達[ともだち]に会[あ]います。",
        example_bn: "স্টেশনে বন্ধুর সাথে দেখা করব।",
        example_en: "I will meet a friend at the station."
      },
      {
        word_ja: "友達[ともだち]",
        romaji: "tomodachi",
        meaning_bn: "বন্ধু / বান্ধবী",
        meaning_en: "friend",
        part_of_speech: "noun",
        example_ja: "日本[にほん]で友達[ともだち]ができました。",
        example_bn: "জাপানে বন্ধু হয়েছে।",
        example_en: "I made friends in Japan."
      },
      {
        word_ja: "電話[でんわ]",
        romaji: "denwa",
        meaning_bn: "টেলিফোন / ফোন কল",
        meaning_en: "telephone / phone call",
        part_of_speech: "noun",
        example_ja: "先生[せんせい]に電話[でんわ]をかけます。",
        example_bn: "শিক্ষককে ফোন কল করি।",
        example_en: "I call the teacher on the phone."
      },
      {
        word_ja: "手紙[てがみ]",
        romaji: "tegami",
        meaning_bn: "চিঠি",
        meaning_en: "letter",
        part_of_speech: "noun",
        example_ja: "家族[かぞく]に手紙[てがみ]を書[か]きます。",
        example_bn: "পরিবারকে চিঠি লিখি।",
        example_en: "I write a letter to my family."
      },
      {
        word_ja: "プレゼント",
        romaji: "purezento",
        meaning_bn: "উপহার / গিফট",
        meaning_en: "present / gift",
        part_of_speech: "noun",
        example_ja: "母[はは]にプレゼントをあげます。",
        example_bn: "মাকে উপহার দিই।",
        example_en: "I give a present to my mother."
      }
    ],
    kanji_scope: [
      {
        kanji: "会",
        onyomi: "カイ, エ",
        kunyomi: "あ・う",
        meaning_bn: "দেখা করা / সভা",
        meaning_en: "meet / society",
        stroke_count: 6,
        compounds: [
          { word_ja: "会[あ]います", meaning_bn: "দেখা করা", meaning_en: "to meet" },
          { word_ja: "会社[かいしゃ]", meaning_bn: "কোম্পানি", meaning_en: "company" },
          { word_ja: "会話[かいわ]", meaning_bn: "কথোপকথন", meaning_en: "conversation" }
        ]
      },
      {
        kanji: "友",
        onyomi: "ユウ",
        kunyomi: "とも",
        meaning_bn: "বন্ধু / মিত্র",
        meaning_en: "friend",
        stroke_count: 4,
        compounds: [
          { word_ja: "友達[ともだち]", meaning_bn: "বন্ধু", meaning_en: "friend" },
          { word_ja: "友人[ゆうじん]", meaning_bn: "বন্ধু (আনুষ্ঠানিক)", meaning_en: "friend (formal)" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "G20-1",
        pattern_ja: "Person に 会います",
        pattern_bn: "[ব্যক্তি] এর সাথে দেখা করা",
        explanation_bn: "কার সাথে দেখা করা হচ্ছে সেই ব্যক্তিকে に দ্বারা চিহ্নিত করা হয়। বাংলায় 'সাথে' হলেও জাপানিতে を বা と এর বদলে に বসে।",
        common_pitfalls: [
          "友達を会います বলা ভুল; 必ず 友達に会います বলতে হবে।"
        ],
        examples: [
          {
            ja: "明日[あした]先生[せんせい]に会[あ]います。",
            bn: "কাল শিক্ষকের সাথে দেখা করব।",
            en: "I will meet the teacher tomorrow."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "শিবুয়ার হাচিকো মূর্তির সামনে বন্ধুর সাথে দেখা করার প্রতিশ্রুতি।",
      situation_en: "Arranging to meet a friend in front of the Hachiko statue in Shibuya.",
      lines: [
        {
          speaker_ja: "タニム[たにむ]",
          speaker_en: "Tanim",
          line_ja: "明日[あした]どこで会[あ]いましょうか。",
          line_bn: "আগামীকাল কোথায় দেখা করব?",
          line_en: "Where shall we meet tomorrow?"
        },
        {
          speaker_ja: "ケン[けん]",
          speaker_en: "Ken",
          line_ja: "渋谷[しぶや]のハチ公前[こうまえ]で会[あ]いましょう。",
          line_bn: "শিবুয়ার হাচিকো মূর্তির সামনে দেখা করা যাক।",
          line_en: "Let's meet in front of Hachiko in Shibuya."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "টোকিওর সবচেয়ে জনপ্রিয় সাক্ষাতের স্থান: শিবুয়া হাচিকো (ハチ公)",
      tip_bn: "শিবুয়া স্টেশনের হাচিকো এক্সিট ও বিশ্বখ্যাত বিশ্বস্ত কুকুর হাচিকোর ব্রোঞ্জ মূর্তি টোকিও শহরের সবচেয়ে বিখ্যাত মিলনস্থল (Machiawase spot)। ছুটির দিনে এখানে প্রতিদিন হাজার হাজার মানুষ সাক্ষাতের জন্য দাঁড়িয়ে থাকে, তাই সুনির্দিষ্ট ল্যান্ডমার্ক যেমন হাচিকোর ঠিক ডানে বা বামে দেখা করার স্থান স্পষ্ট করা বুদ্ধিমানের কাজ।",
      category: "Daily Life"
    },
    typing_practice: [
      {
        prompt_ja: "友達[ともだち]に会[あ]います",
        romaji_input: "tomodachi ni aimasu",
        target_display: "ともだちにあいます",
        meaning_bn: "বন্ধুর সাথে দেখা করব"
      },
      {
        prompt_ja: "先生[せんせい]に電話[でんわ]します",
        romaji_input: "sensei ni denwashimasu",
        target_display: "せんせいにでんわします",
        meaning_bn: "শিক্ষককে ফোন করব"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-L20-1",
        question_ja: "友達（　）会[あ]います。空欄[くうらん]に 入[はい]る 正[ただ]しい 助詞[じょし]は どれですか。",
        question_bn: "শূন্যস্থানে কোন পার্টিকেল বসবে: ともだち（　）あいます",
        options: [
          "に (ni)",
          "を (o)",
          "で (de)",
          "へ (e)"
        ],
        correct_index: 0,
        explanation_bn: "কারও সাথে দেখা করা (会います) ক্রিয়ার ক্ষেত্রে লক্ষ্য ব্যক্তিটির পর 'に' পার্টিকেল বসে।"
      }
    ]
  }
];
