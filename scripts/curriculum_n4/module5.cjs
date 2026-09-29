// Module 5: Imperatives, Giving/Receiving & Conditionals (Lessons N4-L21 - N4-L25)
module.exports = [
  // --- LESSON 21: 命令・禁止 ---
  {
    lesson_metadata: {
      lesson_id: "N4-L21",
      lesson_number: 21,
      module_number: 5,
      module_name: "Imperatives, Giving/Receiving & Conditionals",
      module_name_bn: "আদেশ, নিষেধ, দেওয়া-নেওয়া ও শর্ত",
      title_ja: "命令[めいれい]・禁止[きんし]",
      title_en: "Imperative & Prohibitive Forms",
      title_bn: "কঠোর আদেশ ও স্পষ্ট নিষেধাজ্ঞা (মেইরেইকেই ও কিনশিকেই)",
      estimated_minutes: 35,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "জাপানি ভাষায় জরুরি মুহূর্তে (যেমন: অগ্নিকাণ্ড, ট্রাফিকের বিপদ বা খেলাধুলার মাঠে উৎসাহ প্রদানে) আদেশ বা নিষেধের জন্য অত্যন্ত সংক্ষিপ্ত ও জোরালো রূপ ব্যবহৃত হয়: ১. আদেশ রূপ (命令形 - Meireikei): Group 1 ক্রিয়ায় u-শব্দ e-শব্দে পরিণত হয় (行く -> 行け, 止まる -> 止まれ); Group 2 তে ろ যুক্ত হয় (食べる -> 食べろ); Group 3 তে する -> しろ, 来る -> こい। ২. নিষেধাজ্ঞা রূপ (禁止形 - Kinshikei): ক্রিয়ার ডিকশনারি রূপের সাথে কেবল な যোগ হয় (飲むな - পান করবে না!, 入るな - ঢুকবে না!)।",
      core_concept_bn: "জরুরি আদেশ: 早く逃げろ (দ্রুত পালাও!); কঠোর নিষেধ: 触るな (হাত দিও না!); ট্রাফিক সাইন: 止まれ (থামুন)।",
      real_world_context_bn: "রাস্তার সাইনবোর্ড, কারখানার নিরাপত্তা সতর্কতা, অগ্নিনির্বাপণ বা ভূমিকম্পের জরুরি নির্দেশে ব্যবহৃত হয়।",
      key_takeaway_bn: "দৈনন্দিন ভদ্র আলাপে এই রূপগুলো ব্যবহার করা হয় না; কেবলমাত্র জরুরি অবস্থা, খেলাধুলার স্লোগান বা সাইনবোর্ডে দেখা যায়।"
    },
    vocabulary_scope: [
      {
        word_ja: "逃[に]げる",
        romaji: "nigeru",
        meaning_bn: "পালানো / নিরাপদ আশ্রয়ে যাওয়া",
        meaning_en: "to escape / flee",
        part_of_speech: "verb",
        example_ja: "火事[かじ]だ！早[はや]く逃[に]げろ！",
        example_bn: "আগুন লেগেছে! দ্রুত পালাও!",
        example_en: "Fire! Escape quickly!"
      },
      {
        word_ja: "触[さわ]る",
        romaji: "sawaru",
        meaning_bn: "স্পর্শ করা / হাত দেওয়া",
        meaning_en: "to touch",
        part_of_speech: "verb",
        example_ja: "危[あぶ]ないから、機械[きかい]に触[さわ]るな！",
        example_bn: "বিপজ্জনক, যন্ত্রে হাত দিও না!",
        example_en: "It's dangerous, do not touch the machine!"
      },
      {
        word_ja: "止[と]まる",
        romaji: "tomaru",
        meaning_bn: "থামা / বন্ধ হওয়া",
        meaning_en: "to stop",
        part_of_speech: "verb",
        example_ja: "道路[どうろ]に「止[と]まれ」と書[か]いてあります。",
        example_bn: "রাস্তায় 'থামুন' লেখা সাঁটানো রয়েছে।",
        example_en: "'Stop' is written on the road."
      }
    ],
    kanji_scope: [
      {
        kanji: "禁",
        onyomi: "キン",
        kunyomi: "-",
        meaning_bn: "নিষেধ / বাধা",
        meaning_en: "prohibit / ban",
        stroke_count: 13,
        compounds: [
          { word_ja: "禁止[きんし]", meaning_bn: "নিষেধাজ্ঞা", meaning_en: "prohibition" },
          { word_ja: "禁煙[きんえん]", meaning_bn: "ধূমপান নিষেধ", meaning_en: "no smoking" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "N4-G21-1",
        pattern_ja: "動詞[どうし] 辞書形[じしょけい] + な（禁止[きんし]）",
        pattern_bn: "ক্রিয়া ডিকশনারি রূপ + な (কঠোর নিষেধ)",
        explanation_bn: "কোনো কাজ করতে কঠোরভাবে নিষেধ করা।",
        common_pitfalls: [
          "অনুরোধের '〜ないでください' এর সাথে ভুলিয়ে ফেলা যাবে না; '〜な' অত্যন্ত রূঢ় এবং জরুরি সাইনবোর্ডের ভাষা।"
        ],
        examples: [
          {
            ja: "ここに入[はい]るな！",
            bn: "এখানে ঢুকবে না!",
            en: "Do not enter here!"
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "কারখানায় নিরাপত্তা ট্রেইনিং ও জরুরি নির্দেশ।",
      situation_en: "Safety training and emergency instructions at a factory.",
      lines: [
        {
          speaker_ja: "班長[はんちょう]",
          speaker_en: "Shift Leader",
          line_ja: "警報[けいほう]が鳴[な]ったら、すぐ作業[さぎょう]をやめろ！",
          line_bn: "সাইরেন বাজলে সাথে সাথে কাজ বন্ধ করো!",
          line_en: "If the alarm rings, stop work immediately!"
        },
        {
          speaker_ja: "作業員[さぎょういん]",
          speaker_en: "Worker",
          line_ja: "了解[りょうかい]しました！安全[あんぜん]を第一[だいいち]にします。",
          line_bn: "বুঝতে পেরেছি! সুরক্ষাকেই প্রথম অগ্রাধিকার দেব।",
          line_en: "Understood! We will put safety first."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের রাস্তার সাইন '止まれ' (Tomare) এর ট্রাফিক আইন",
      tip_bn: "জাপানের রাস্তায় সাদা ত্রিভুজাকৃতি '止まれ' সাইন থাকলে গাড়ি বা বাইসাইকেল চালককে একদম সম্পূর্ণ থেমে (Full stop) ডানে ও বামে দেখে তারপর চলতে হয়। না থামলে পুলিশ তৎক্ষণাৎ ট্রাফিক মামলা দেয়।",
      category: "Transport"
    },
    typing_practice: [
      {
        prompt_ja: "禁止[きんし]",
        romaji_input: "kinshi",
        target_display: "きんし",
        meaning_bn: "নিষেধাজ্ঞা"
      },
      {
        prompt_ja: "逃[に]げる",
        romaji_input: "nigeru",
        target_display: "にげる",
        meaning_bn: "পালানো"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-N4-L21-1",
        question_ja: "「ここで 写真[しゃしん]を 撮[と]るな」という文の 意味[いみ]は？",
        question_bn: "এই বাক্যটির সঠিক অর্থ কোনটি?",
        options: [
          "写真を撮ってはいけない",
          "写真を撮ってください",
          "写真を撮りましょう",
          "写真を撮ってもいい"
        ],
        correct_index: 0,
        explanation_bn: "辞書形 + な হলো কঠোর নিষেধ (撮ってはいけない - ছবি তোলা যাবে না)।"
      }
    ]
  },

  // --- LESSON 22: 〜と言っていました / 〜という意味です ---
  {
    lesson_metadata: {
      lesson_id: "N4-L22",
      lesson_number: 22,
      module_number: 5,
      module_name: "Imperatives, Giving/Receiving & Conditionals",
      module_name_bn: "আদেশ, নিষেধ, দেওয়া-নেওয়া ও শর্ত",
      title_ja: "伝聞[でんぶん]と意味[いみ]の伝達[でんたつ]",
      title_en: "Reported Speech & Meaning (~to itte imashita & ~to iu imi desu)",
      title_bn: "পরোক্ষ উক্তি ও শব্দের অর্থ ব্যাখ্যা (~তো ইত্তে ইমাশিতা এবং ~তো ইউ ইমি দেসু)",
      estimated_minutes: 30,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "অন্য কারো কথা তৃতীয় কোনো ব্যক্তিকে পৌঁছে দিতে 'সাধারণ রূপ + と言っていました' (বলেছিলেন / খবর দিয়েছেন) ব্যবহৃত হয়। যেমন: 田中さんは明日休むと言っていました (তানাকা সাহেব বলেছিলেন উনি কাল ছুটি নেবেন)। আর কোনো সাইনবোর্ড বা অপরিচিত শব্দের অর্থ জানতে ও ব্যাখ্যা করতে 'X は Y という意味です' (X-এর অর্থ হলো Y) ব্যবহৃত হয়।",
      core_concept_bn: "বার্তা জানানো: 普通形 + と言っていました; অর্থ ব্যাখ্যা: 〜という意味です।",
      real_world_context_bn: "জাপানি কাঞ্জি সাইন '立入禁止' বা '非常口' এর অর্থ বুঝতে জাপানিদের প্রশ্ন করতে বা সহকর্মীর বার্তা বসের কাছে পৌঁছাতে।",
      key_takeaway_bn: "উদ্ধৃতির ভেতরের বাক্যটি সর্বদা সাধারণ রূপে (Plain form) থাকে।"
    },
    vocabulary_scope: [
      {
        word_ja: "意味[いみ]",
        romaji: "imi",
        meaning_bn: "অর্থ / তাৎপর্য",
        meaning_en: "meaning",
        part_of_speech: "noun",
        example_ja: "「立入禁止[たちいりきんし]」はどういう意味[いみ]ですか。",
        example_bn: "'তাচিইরি কিনশি' এর অর্থ কী?",
        example_en: "What does 'Tachiiri Kinshi' mean?"
      },
      {
        word_ja: "伝言[でんごん]",
        romaji: "dengon",
        meaning_bn: "মৌখিক বার্তা / মেসেজ",
        meaning_en: "verbal message",
        part_of_speech: "noun",
        example_ja: "伝言[でんごん]をお願[ねが]いできますか。",
        example_bn: "একটি বার্তা কি পৌঁছে দিতে পারবেন?",
        example_en: "Can I leave a message?"
      }
    ],
    kanji_scope: [
      {
        kanji: "伝",
        onyomi: "デン",
        kunyomi: "つた・わる, つた・える",
        meaning_bn: "প্রেরণ / জানানো",
        meaning_en: "transmit / report",
        stroke_count: 6,
        compounds: [
          { word_ja: "伝言[でんごん]", meaning_bn: "বার্তা", meaning_en: "message" },
          { word_ja: "手伝[てつだ]う", meaning_bn: "সাহায্য করা", meaning_en: "to help" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "N4-G22-1",
        pattern_ja: "普通形[ふつうけい] + という意味[いみ]です",
        pattern_bn: "সাধারণ রূপ + という意味です (অর্থ হলো...)",
        explanation_bn: "শব্দ বা চিহ্নের অন্তর্নিহিত অর্থ ব্যাখ্যা করতে।",
        common_pitfalls: [
          "সরাসরি '〜の意味です' না বলে '〜という意味です' বলা মার্জিত ব্যাকরণ।"
        ],
        examples: [
          {
            ja: "「使用中[しようちゅう]」は 今[いま] 使[つか]っている という意味[いみ]です。",
            bn: "'ব্যবহারাধীন' এর অর্থ হলো এখন এটি ব্যবহৃত হচ্ছে।",
            en: "'In use' means that it is currently being used."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "অফিসে ফোনে সহকর্মীর রেখে যাওয়া বার্তা গ্রহণ।",
      situation_en: "Taking a telephone message for a coworker at the office.",
      lines: [
        {
          speaker_ja: "受付[うけつけ]",
          speaker_en: "Receptionist",
          line_ja: "先[さき]ほど山田[やまだ]様[さま]からお電話[でんわ]がありました。",
          line_bn: "একটু আগে ইয়ামাদা মহোদয়ের একটি ফোন এসেছিল।",
          line_en: "There was a phone call from Mr. Yamada a moment ago."
        },
        {
          speaker_ja: "私[わたし]",
          speaker_en: "Me",
          line_ja: "何[なに]か伝言[でんごん]はありましたか。",
          line_bn: "কোনো বার্তা রেখে গেছেন কি?",
          line_en: "Was there any message?"
        },
        {
          speaker_ja: "受付[うけつけ]",
          speaker_en: "Receptionist",
          line_ja: "午後[ごご]４時[よじ]にまた電話[でんわ]すると言[い]っていました。",
          line_bn: "উনি বলেছিলেন বিকেল ৪টায় আবার ফোন করবেন।",
          line_en: "He said that he would call again at 4:00 PM."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানি অফিসে ফোন ধরার শিষ্টাচার (Denwa Outou)",
      tip_bn: "জাপানে অফিসে ফোন বেজে ওঠার ৩ বারের মধ্যেই রিসিভার তুলে 'お電話ありがとうございます、〇〇会社でございます' (ধন্যবাদ, অমুক কোম্পানি থেকে বলছি) বলা বাধ্যতামূলক। অন্য কারও বার্তা লিখতে Desk Memo ব্যবহার করা হয়।",
      category: "Workplace"
    },
    typing_practice: [
      {
        prompt_ja: "意味[いみ]",
        romaji_input: "imi",
        target_display: "いみ",
        meaning_bn: "অর্থ"
      },
      {
        prompt_ja: "伝言[でんごん]",
        romaji_input: "dengon",
        target_display: "でんごん",
        meaning_bn: "বার্তা"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-N4-L22-1",
        question_ja: "「駐車禁止[ちゅうしゃきんし]」は 車[くるま]を 止[と]めては いけない（　　）意味[いみ]です。",
        question_bn: "খালি জায়গায় সঠিক সংযোগ রূপ কোনটি?",
        options: [
          "という",
          "の",
          "と",
          "な"
        ],
        correct_index: 0,
        explanation_bn: "অর্থ প্রকাশের ব্যাকরণ হলো '〜という意味です' (to iu imi desu)।"
      }
    ]
  },

  // --- LESSON 23: 指示通りと順序 ---
  {
    lesson_metadata: {
      lesson_id: "N4-L23",
      lesson_number: 23,
      module_number: 5,
      module_name: "Imperatives, Giving/Receiving & Conditionals",
      module_name_bn: "আদেশ, নিষেধ, দেওয়া-নেওয়া ও শর্ত",
      title_ja: "指示通[しじどお]りと順序[じゅんじょ]",
      title_en: "Following Instructions & Chronological Order (~toori ni & ~ato de)",
      title_bn: "নির্দেশনা হুবহু অনুসরণ ও কাজের ধারাবাহিক ক্রম (~তোরি নি এবং ~আতো দে)",
      estimated_minutes: 30,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "১. 〜とおりに (toori ni): কোনো নকশা, রেসিপি বা নির্দেশ হুবহু অনুসরণ করে কাজ করা (যেমন: 私が言ったとおりに書いてください - আমি যেভাবে বললাম ঠিক সেভাবে লিখুন)। ২. 〜あとで (ato de): কোনো একটি কাজ সম্পূর্ণ শেষ করার পর দ্বিতীয় কাজটি শুরু করা (যেমন: ご飯を食べたあとで、薬を飲みます - খাবার খাওয়ার পর ওষুধ খাব)। গঠন: V (た形 / 辞書形) + とおりに / Noun + のとおりに; V (た形) + あとで / Noun + のあとで।",
      core_concept_bn: "নির্দেশমতো: 言ったとおりに; সম্পন্ন কাজের পরে: 食べたあとで (Te-form + kara এর সমতুল্য)।",
      real_world_context_bn: "কনভেনিয়েন্স স্টোরে পার্সেল পাঠানোর প্রক্রিয়া বা ফার্নিচার অ্যাসেম্বল নির্দেশিকায়।",
      key_takeaway_bn: "Noun এর পর とおりに বসলে তা প্রায়ই どおり (doori) উচ্চারিত হয় (予定通り - শিডিউল অনুযায়ী)।"
    },
    vocabulary_scope: [
      {
        word_ja: "説明書[せつめいしょ]",
        romaji: "setsumeisho",
        meaning_bn: "ব্যবহার নির্দেশিকা / ম্যানুয়াল",
        meaning_en: "instruction manual",
        part_of_speech: "noun",
        example_ja: "説明書[せつめいしょ]のとおりに組[く]み立[た]ててください。",
        example_bn: "ম্যানুয়ালের নির্দেশনা অনুযায়ী যন্ত্রাংশটি জোড়া দিন।",
        example_en: "Please assemble it according to the instruction manual."
      },
      {
        word_ja: "順番[じゅんばん]",
        romaji: "junban",
        meaning_bn: "ধারাবাহিক ক্রম / সিরিয়াল",
        meaning_en: "turn / order",
        part_of_speech: "noun",
        example_ja: "順番[じゅんばん]を守[まも]ってください。",
        example_bn: "দয়া করে সিরিয়াল বা লাইনের ক্রম বজায় রাখুন।",
        example_en: "Please maintain the order of the queue."
      }
    ],
    kanji_scope: [
      {
        kanji: "順",
        onyomi: "ジュン",
        kunyomi: "-",
        meaning_bn: "ক্রম / আনুগত্য",
        meaning_en: "order / obey",
        stroke_count: 12,
        compounds: [
          { word_ja: "順番[じゅんばん]", meaning_bn: "ক্রম", meaning_en: "order" },
          { word_ja: "順調[じゅんちょう]", meaning_bn: "মসৃণভাবে চলা", meaning_en: "smoothly" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "N4-G23-1",
        pattern_ja: "動詞[どうし] た形[けい] + あとで",
        pattern_bn: "ক্রিয়া た-ফর্ম + あとで (কাজের পরে)",
        explanation_bn: "প্রথম কাজটি সুসম্পন্ন হওয়ার পর দ্বিতীয় কাজ ঘটা।",
        common_pitfalls: [
          "ক্রিয়া ডিকশনারি রূপের সাথে あとで বসে না; অবশ্যই অতীত রূপ (た形) দিতে হবে।"
        ],
        examples: [
          {
            ja: "仕事[しごと]が 終[お]わったあとで、飲[の]みに行[い]きましょう。",
            bn: "কাজ শেষ হওয়ার পর পান করতে যাব।",
            en: "Let's go for a drink after work is finished."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "ইকিয়া বা নিটোরি থেকে কেনা আসবাবপত্র অ্যাসেম্বল করা।",
      situation_en: "Assembling furniture bought from Nitori or IKEA.",
      lines: [
        {
          speaker_ja: "兄[あに]",
          speaker_en: "Older Brother",
          line_ja: "この棚[たな]、どうやって作[つく]るの？",
          line_bn: "এই বুকশেলফটা কীভাবে তৈরি করতে হবে?",
          line_en: "How do we make this shelf?"
        },
        {
          speaker_ja: "弟[おとうと]",
          speaker_en: "Younger Brother",
          line_ja: "図[ず]を見[み]て、番号[ばんごう]のとおりにネジをとめれば大丈夫[だいじょうぶ]だよ。",
          line_bn: "ছবি দেখে নম্বরের নির্দেশ অনুযায়ী স্ক্রু আঁটলেই হয়ে যাবে।",
          line_en: "Look at the diagram, if you tighten the screws according to the numbers, it will be fine."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের লাইন ধরার শিষ্টাচার (順番を守る)",
      tip_bn: "ট্রেনে ওঠা, বাসের জন্য অপেক্ষা বা টিকিট কাটার সময় লাইনে শৃঙ্খলাভঙ্গ করা জাপানে অত্যন্ত গর্হিত অপরাধ। লাইনে কাউকে ঢুকতে দেওয়া বা লাইন কাটা আইনিভাবেও দণ্ডনীয় হতে পারে।",
      category: "Manners"
    },
    typing_practice: [
      {
        prompt_ja: "説明書[せつめいしょ]",
        romaji_input: "setsumeisho",
        target_display: "せつめいしょ",
        meaning_bn: "ম্যানুয়াল"
      },
      {
        prompt_ja: "順番[じゅんばん]",
        romaji_input: "junban",
        target_display: "じゅんばん",
        meaning_bn: "সিরিয়াল"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-N4-L23-1",
        question_ja: "「先生[せんせい]が 言[い]った（　　）発音[はつおん]してください」",
        question_bn: "শিক্ষক যেভাবে বললেন ঠিক সেভাবে উচ্চারণ করুন—খালি জায়গায় সঠিক কোনটি?",
        options: [
          "とおりに",
          "あとで",
          "まえに",
          "ために"
        ],
        correct_index: 0,
        explanation_bn: "অনুরূপভাবে বা নির্দেশমতো অনুসরণ করতে '〜とおりに' ব্যবহৃত হয়।"
      }
    ]
  },

  // --- LESSON 24: 授受動詞の発展 ---
  {
    lesson_metadata: {
      lesson_id: "N4-L24",
      lesson_number: 24,
      module_number: 5,
      module_name: "Imperatives, Giving/Receiving & Conditionals",
      module_name_bn: "আদেশ, নিষেধ, দেওয়া-নেওয়া ও শর্ত",
      title_ja: "授受表現[じゅじゅひょうげん]の発展[はってん]",
      title_en: "Giving & Receiving Favors (~te ageru / ~te kureru / ~te morau)",
      title_bn: "উপকার দেওয়া ও গ্রহণের মার্জিত রূপ (আগেরু, কুরেরু ও মোরাউ)",
      estimated_minutes: 35,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "N5-এ আমরা কোনো বস্তু দেওয়া-নেওয়া শিখেছিলাম। N4-এ ক্রিয়ার মাধ্যমে উপকার বা অনুগ্রহ (Favors) আদান-প্রদান অত্যন্ত গুরুত্বপূর্ণ: ১. 〜てあげる: অন্য কাউকে কোনো উপকার করে দেওয়া (আমি তাকে শিখিয়ে দিলাম); ২. 〜てくれる: অন্য কেউ স্বয়ং আমাকে বা আমার দলের কাউকে কোনো অনুগ্রহ করে দেওয়া (উনি আমাকে দেখিয়ে দিলেন); ৩. 〜てもらう: অন্য কারো কাছ থেকে বিনম্রভাবে কোনো উপকার করিয়ে নেওয়া (আমি ওনার দ্বারা করিয়ে নিলাম)। মার্জিত রূপ: 〜てくださる (সম্মানীয় ব্যক্তি আমাকে করে দেওয়া), 〜ていただく (সম্মানীয় ব্যক্তি থেকে করিয়ে নেওয়া)।",
      core_concept_bn: "অন্যকে করা: 〜てあげる; আমাকে করা: 〜てくれる / 〜てくださる; করিয়ে নেওয়া: 〜てもらう / 〜ていただく।",
      real_world_context_bn: "টোকিওতে পথ হারিয়ে ফেললে কোনো জাপানি পথ দেখিয়ে দিলে বলা: 道を教えてくれました।",
      key_takeaway_bn: "〜てくれる এ যিনি সাহায্য করেছেন তিনি কর্তা (は/が); আর 〜てもらう এ যিনি সাহায্য গ্রহণ করেছেন তিনি কর্তা (は) এবং সাহায্যকারী (に)।"
    },
    vocabulary_scope: [
      {
        word_ja: "おごる",
        romaji: "ogoru",
        meaning_bn: "ট্রিট দেওয়া / বিল পরিশোধ করে দেওয়া",
        meaning_en: "to treat (someone to a meal)",
        part_of_speech: "verb",
        example_ja: "先輩[せんぱい]が昼[ひる]ご飯[はん]をおごってくれました。",
        example_bn: "সিনিয়র আমাকে দুপুরের খাবার ট্রিট দিয়েছেন।",
        example_en: "My senior treated me to lunch."
      },
      {
        word_ja: "手伝[てつだ]い",
        romaji: "tetsudai",
        meaning_bn: "সাহায্য / সহায়তা",
        meaning_en: "help / assistance",
        part_of_speech: "noun",
        example_ja: "引[ひ]っ越[こ]しを手伝[てつだ]ってもらいました。",
        example_bn: "বাসা পরিবর্তনের সময় বন্ধুদের কাছ থেকে সাহায্য করিয়ে নিয়েছি।",
        example_en: "I had my friends help me with moving."
      }
    ],
    kanji_scope: [
      {
        kanji: "貸",
        onyomi: "タイ",
        kunyomi: "か・す",
        meaning_bn: "ধার দেওয়া",
        meaning_en: "lend",
        stroke_count: 12,
        compounds: [
          { word_ja: "貸[か]す", meaning_bn: "ধার দেওয়া", meaning_en: "to lend" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "N4-G24-1",
        pattern_ja: "人[ひと] に / から 動詞[どうし] て形[けい] + もらいます",
        pattern_bn: "কারো দ্বারা কোনো কাজ করিয়ে নেওয়া",
        explanation_bn: "বক্তা উপকৃত হওয়ার জন্য কৃতজ্ঞতা প্রকাশ করে।",
        common_pitfalls: [
          "উর্ধ্বতন কাউকে সাহায্য করার সময় সরাসরি 〜てあげます বললে তা অনুগ্রহ ফলানো মনে হয়; বলতে হয় 'お〜いたします'।"
        ],
        examples: [
          {
            ja: "日本[にほん]人[じん]の 友達[ともだち]に 日本語[にほんご]を 教[おし]えてもらいました。",
            bn: "জাপানি বন্ধুর দ্বারা আমি জাপানি ভাষা শিখিয়ে নিয়েছি।",
            en: "I had a Japanese friend teach me Japanese."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "বৃষ্টির দিনে স্টেশনে সহকর্মীর কাছ থেকে ছাতা সাহায্য পাওয়া।",
      situation_en: "Receiving umbrella assistance from a colleague on a rainy day.",
      lines: [
        {
          speaker_ja: "アミン",
          speaker_en: "Amin",
          line_ja: "雨[あめ]が降[ふ]ってきたのに傘[かさ]がなくて困[こま]っていました。",
          line_bn: "বৃষ্টি শুরু হয়েছে অথচ ছাতা না থাকায় বিপদে পড়েছিলাম।",
          line_en: "It started raining and I was in trouble because I had no umbrella."
        },
        {
          speaker_ja: "同僚[どうりょう]",
          speaker_en: "Colleague",
          line_ja: "佐藤[さとう]さんが傘[かさ]を貸[か]してくれたんですね。よかったですね。",
          line_bn: "সাতো সাহেব আপনাকে ছাতা ধার দিয়েছেন দেখছি! খুব ভালো হয়েছে।",
          line_en: "Mr. Sato lent you an umbrella, didn't he? That was fortunate."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানে উপহারের প্রতিদানে 'ওকায়েশি' (お返し - Return Gift)",
      tip_bn: "জাপানে কারো কাছ থেকে উপহার বা বড় অনুগ্রহ পেলে তার প্রতিদানে কিছু উপহার ফেরত দেওয়াকে 'Okaeshi' বলে। সাধারণ সৌজন্যের ক্ষেত্রে মৌখিকভাবে '先日はありがとうございました' (সেদিনের জন্য ধন্যবাদ) বলে কৃতজ্ঞতা প্রকাশ করতে হয়।",
      category: "Manners"
    },
    typing_practice: [
      {
        prompt_ja: "手伝[てつだ]い",
        romaji_input: "tetsudai",
        target_display: "てつだい",
        meaning_bn: "সাহায্য"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-N4-L24-1",
        question_ja: "「田中[たなか]さんが 私[わたし]に 写真[しゃしん]を（　　）」正しい授受動詞は？",
        question_bn: "তানাকা সাহেব আমাকে ছবি তুলে দিয়েছেন—সঠিক রূপ কোনটি?",
        options: [
          "撮ってくれました",
          "撮ってあげました",
          "撮ってもらいました",
          "撮ってやりました"
        ],
        correct_index: 0,
        explanation_bn: "অন্য ব্যক্তি যখন বক্তাকে (私に) কোনো উপকার করে দেয় তখন '〜てくれました' বসে।"
      }
    ]
  },

  // --- LESSON 25: 四つの条件表現 ---
  {
    lesson_metadata: {
      lesson_id: "N4-L25",
      lesson_number: 25,
      module_number: 5,
      module_name: "Imperatives, Giving/Receiving & Conditionals",
      module_name_bn: "আদেশ, নিষেধ, দেওয়া-নেওয়া ও শর্ত",
      title_ja: "四[よ]つの条件表現[じょうけんひょうげん]",
      title_en: "The 4 Japanese Conditionals (~to, ~ba, ~tara, ~nara)",
      title_bn: "জাপানি ভাষার ৪টি শর্তবাচক প্রকাশ (তো, বা, তারা এবং নারা)",
      estimated_minutes: 40,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "জাপানি ব্যাকরণের অন্যতম সমৃদ্ধ অধ্যায় হলো শর্ত (Conditionals)। ১. 〜と: প্রাকৃতিক নিয়ম, যন্ত্রের বোতাম বা অপরিবর্তনীয় সত্য (বোতাম টিপলে টিকিট বের হয়); ২. 〜ば: তাত্ত্বিক যুক্তি বা অপরিহার্য শর্ত (বসন্ত এলে ফুল ফোটে / পড়লে পাস করবে); ৩. 〜たら: দৈনন্দিন জীবনের সাধারণ 'যদি/যখন', কালগত ক্রম এবং অতীতের অপ্রত্যাশিত ঘটনা (টাকা থাকলে কিনব); ৪. 〜なら: শ্রোতার কথার সূত্র ধরে পরামর্শ বা প্রেক্ষাপট (জাপানি খাবার হলে সুশি সেরা)।",
      core_concept_bn: "প্রাকৃতিক সত্য: 〜と; তাত্ত্বিক শর্ত: 〜ば; সাধারণ দৈনন্দিন শর্ত: 〜たら; প্রসঙ্গ গ্রহণ: 〜なら।",
      real_world_context_bn: "ভেন্ডিং মেশিন ব্যবহার (ボタンを押すとジュースが出ます) থেকে শুরু করে জাপানে ভ্রমণের পরামর্শে (京都へ行くなら新幹線が便利です)।",
      key_takeaway_bn: "পরামর্শ বা অনুরোধসূচক বাক্য শেষে থাকলে 〜と বা 〜ば বসে না, 〜たら বা 〜なら বসে।"
    },
    vocabulary_scope: [
      {
        word_ja: "ボタン",
        romaji: "botan",
        meaning_bn: "বোতাম / সুইচ",
        meaning_en: "button",
        part_of_speech: "noun",
        example_ja: "このボタンを押[お]すと、お釣[つ]りが出[で]ます。",
        example_bn: "এই বোতামটি চাপলে ফেরত পয়সা বের হবে।",
        example_en: "If you press this button, the change will come out."
      },
      {
        word_ja: "両替[りょうがえ]する",
        romaji: "ryougae suru",
        meaning_bn: "টাকা বা মুদ্রা ভাঙানো",
        meaning_en: "to exchange money",
        part_of_speech: "verb",
        example_ja: "お金[かね]が足[た]りなければ、両替[りょうがえ]してください。",
        example_bn: "টাকা অপর্যাপ্ত হলে ভাঙিয়ে নিন।",
        example_en: "If you don't have enough money, please exchange some."
      }
    ],
    kanji_scope: [
      {
        kanji: "押",
        onyomi: "オウ",
        kunyomi: "お・す, お・さえる",
        meaning_bn: "চাপা / ঠেলা",
        meaning_en: "push / press",
        stroke_count: 8,
        compounds: [
          { word_ja: "押[お]す", meaning_bn: "চাপা", meaning_en: "to press" }
        ]
      }
    ],
    grammar_points: [
      {
        point_id: "N4-G25-1",
        pattern_ja: "動詞[どうし] ば形[けい]（条件形[じょうけんけい]）",
        pattern_bn: "ক্রিয়া ば-ফর্ম (শর্তসূচক রূপ)",
        explanation_bn: "Group 1: u-শব্দ e-শব্দে পরিবর্তন + ば (行けば、読めば); Group 2: る তুলে れば (食べれば); Group 3: すれば、くれば।",
        common_pitfalls: [
          "পেছনে অনুরোধ বা ইচ্ছা থাকলে ば ব্যবহার সীমিত (安ければ買ってください ভুল; 安かったら買ってください সঠিক)।"
        ],
        examples: [
          {
            ja: "春[はる]になれば、桜[さくら]が咲[さ]きます。",
            bn: "বসন্ত এলে চেরি ফুল ফোটে।",
            en: "When spring comes, cherry blossoms bloom."
          }
        ]
      }
    ],
    dialogue_scenario: {
      situation_bn: "টোকিওতে সুস্বাদু খাবারের দোকান খোঁজার পরামর্শ।",
      situation_en: "Getting advice on finding good restaurants in Tokyo.",
      lines: [
        {
          speaker_ja: "ビラル",
          speaker_en: "Bilal",
          line_ja: "美味[おい]しいラーメンを食[た]べたいんですが、どこがいいですか。",
          line_bn: "সুস্বাদু রামেন খেতে চাই, কোন দোকান ভালো হবে?",
          line_en: "I want to eat delicious ramen, which place is good?"
        },
        {
          speaker_ja: "タケシ",
          speaker_en: "Takeshi",
          line_ja: "ラーメンなら、駅[えき]の近[ちか]くの一蘭[いちらん]が一番[いちばん]ですよ。",
          line_bn: "রামেন যদি হয়, তবে স্টেশনের কাছের ইচিরান সবচেয়ে সেরা!",
          line_en: "If it's ramen you're after, Ichiran near the station is the best."
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানের ভেন্ডিং মেশিন (自動販売機) ব্যবহারে শর্ত",
      tip_bn: "জাপানে রাস্তাঘাটে লাখ লাখ ভেন্ডিং মেশিন রয়েছে। কয়েন বা সুইকা কার্ড টাচ করলে স্বয়ংক্রিয়ভাবে লাইট জ্বলে (タッチすると電気がつきます) এবং বোতাম চাপলেই ক্যান নিচে নেমে আসে।",
      category: "Shopping"
    },
    typing_practice: [
      {
        prompt_ja: "ボタン",
        romaji_input: "botan",
        target_display: "ボタン",
        meaning_bn: "বোতাম"
      },
      {
        prompt_ja: "押[お]す",
        romaji_input: "osu",
        target_display: "おす",
        meaning_bn: "চাপা"
      }
    ],
    quizzes: [
      {
        quiz_id: "Q-N4-L25-1",
        question_ja: "「この つまみを 右[みぎ]へ 回[まわ]す（　　）、音[おと]が 大[おお]きくなります」",
        question_bn: "এই নবটি ডানে ঘোরালে শব্দ বাড়ে (যন্ত্রের নিশ্চিত ফল)—খালি জায়গায় কোনটি বসবে?",
        options: [
          "と",
          "なら",
          "たら",
          "ば"
        ],
        correct_index: 0,
        explanation_bn: "যন্ত্রপাতির অপারেশন ও প্রাকৃতিক নিশ্চিত ফলাফলের ক্ষেত্রে '〜と' বসে।"
      }
    ]
  }
];
