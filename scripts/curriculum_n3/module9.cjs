// Module 9: 統合 (Mastery & N3 Capstone) — Lessons N3-L41 to N3-L45
module.exports = [
  // --- LESSON 41: 長文読解・情報検索 ---
  {
    copyright: "© 2026 Nihomi AI™ (nihomi.com). All rights reserved.",
    brand: "Nihomi Japanese Learning Platform",
    lesson_metadata: {
      lesson_id: "N3-L41",
      lesson_number: 41,
      module_number: 9,
      module_name: "統合 (Mastery & N3 Capstone)",
      module_name_bn: "সার্বিক সংহতি ও সমাপনী কৌশল",
      title_ja: "長文読解[ちょうぶんどっかい]と情報検索[じょうほうけんさく]の攻略法[こうりゃくほう]",
      title_en: "Long Reading Comprehension & Information Scanning",
      title_bn: "দীর্ঘ অনুচ্ছেদ অনুধাবন ও নোটিস থেকে দ্রুত তথ্য অনুসন্ধান",
      estimated_minutes: 30,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "JLPT N3 রিডিং সেকশনে সাফল্য পাওয়ার চাবিকাঠি হলো দীর্ঘ প্যারাগ্রাফের মূল সুর (筆者の主張) দ্রুত চিহ্নিত করা এবং তথ্য অনুসন্ধানের নোটিস/বিজ্ঞাপন থেকে অপ্রয়োজনীয় অংশ বাদ দিয়ে সরাসরি কাঙ্ক্ষিত শর্ত খুঁজে বের করা। পুরো প্যারাগ্রাফ শব্দ ধরে অনুবাদ না করে প্রশ্নটি পড়ে প্যারাগ্রাফে স্ক্যান করার টেকনিক এখানে আয়ত্ত করতে হবে।",
      core_concept_bn: "筆者の考え (লেখকের মূল বক্তব্য) ধরতে つまり, しかし, 要するに, べきだ ইত্যাদির পরের বাক্য লক্ষ্য করা এবং শর্তভিত্তিক নোটিশ স্ক্যান করা।",
      real_world_context_bn: "জাপানে এপার্টমেন্ট ভাড়ার চুক্তিপত্র, মিউনিসিপ্যাল নোটিশ, হাসপাতালের সময়সূচি বা ট্রেনের সময়সূচির শর্ত বুঝে সঠিক সিদ্ধান্ত নেওয়া।",
      key_takeaway_bn: "接続詞 (しかし, したがって, つまり); 条件 (ただし, 〜に限る); 筆者の主張 (〜ではないだろうか, 〜と考える)。"
    },
    vocabulary_scope: [
      {
        word_ja: "要点[ようてん]",
        romaji: "youten",
        meaning_bn: "মূল বিন্দু / প্রধান বিবেচ্য বিষয়",
        meaning_en: "main point / gist",
        part_of_speech: "noun",
        example_ja: "文章[ぶんしょう]の要点[ようてん]を的確[てきかく]につかむことが大切[たいせつ]だ。",
        example_bn: "অনুচ্ছেদের মূল বক্তব্য সঠিকভাবে ধরা অত্যন্ত গুরুত্বপূর্ণ।",
        example_en: "It is important to accurately grasp the main point of the passage."
      },
      {
        word_ja: "段落[だんらく]",
        romaji: "danraku",
        meaning_bn: "অনুচ্ছেদ / প্যারাগ্রাফ",
        meaning_en: "paragraph",
        part_of_speech: "noun",
        example_ja: "最終[さいしゅう]段落[だんらく]に筆者[ひっしゃ]の主張[しゅちょう]がまとめられている。",
        example_bn: "সর্বশেষ অনুচ্ছেদে লেখকের মূল অভিমত সংক্ষেপিত করা হয়েছে।",
        example_en: "The author's assertion is summarized in the final paragraph."
      },
      {
        word_ja: "該当[がいとう]する",
        romaji: "gaitou suru",
        meaning_bn: "প্রযোজ্য হওয়া / শর্ত পূরণ করা",
        meaning_en: "to correspond to / qualify",
        part_of_speech: "verb",
        example_ja: "条件[じょうけん]に該当[がいとう]する方[かた]のみご応募[おうぼ]いただけます。",
        example_bn: "কেবলমাত্র শর্তের আওতাভুক্ত ব্যক্তিগণই আবেদন করতে পারবেন।",
        example_en: "Only those who qualify under the conditions may apply."
      },
      {
        word_ja: "ただし",
        romaji: "tadashi",
        meaning_bn: "তবে শর্ত থাকে যে / কিন্তু",
        meaning_en: "provided that / however",
        part_of_speech: "conjunction",
        example_ja: "入場[にゅうじょう]は無料[むりょう]です。ただし、事前[じぜん]予約[よやく]が必要[ひつよう]となります。",
        example_bn: "প্রবেশ সম্পূর্ণ বিনামূল্যে। তবে শর্ত থাকে যে, পূর্বনির্ধারিত বুকিং আবশ্যক।",
        example_en: "Admission is free. Provided that, advance reservation is required."
      },
      {
        word_ja: "提示[ていじ]する",
        romaji: "teiji suru",
        meaning_bn: "উপস্থাপন বা প্রদর্শন করা",
        meaning_en: "to present / display / produce",
        part_of_speech: "verb",
        example_ja: "受付[うけつけ]で学生証[がくせいしょう]を提示[ていじ]してください。",
        example_bn: "রিসেপশনে অনুগ্রহ করে আপনার ছাত্র পরিচয়পত্র প্রদর্শন করুন।",
        example_en: "Please present your student ID at the reception."
      }
    ],
    kanji_scope: [
      {
        kanji: "摘",
        onyomi: "テキ",
        kunyomi: "つ・む",
        meaning_bn: "তুলে ধরা / উন্মোচন করা",
        stroke_count: 14,
        radical: "手",
        stroke_order_svg: "",
        mnemonics_bn: "হাতে (手) করে সুনির্দিষ্ট কোনো ত্রুটি বা ফুল চিহ্নিত করে তুলে ধরা = 摘。 ",
        practical_examples: [
          { word_ja: "指摘[してき]", reading_ja: "してき", meaning_bn: "ইঙ্গিত করা / আঙুল দিয়ে নির্দেশ করা" },
          { word_ja: "要約[ようやく]", reading_ja: "ようやく", meaning_bn: "সারসংক্ষেপ" }
        ]
      },
      {
        kanji: "覧",
        onyomi: "ラン",
        kunyomi: "み・る",
        meaning_bn: "দৃষ্টিপাত / পর্যবেক্ষণ",
        stroke_count: 17,
        radical: "見",
        stroke_order_svg: "",
        mnemonics_bn: "উচ্চস্থান থেকে সার্বিক দৃষ্টিতে (見) পর্যবেক্ষণ করা = 覧。 ",
        practical_examples: [
          { word_ja: "閲覧[えつらん]", reading_ja: "えつらん", meaning_bn: "পাঠ বা অবলোকন করা" },
          { word_ja: "展覧会[てんらんかい]", reading_ja: "てんらんかい", meaning_bn: "প্রদর্শনী" }
        ]
      }
    ],
    grammar_points: [
      {
        rule_id: "N3-G41",
        pattern_ja: "〜ではないだろうか / 〜のではないか",
        pattern_en: "Author's polite assertiveness / rhetorical suggestion",
        pattern_bn: "লেখকের নিজস্ব মতামতের বিনীত প্রকাশ (আমার কি এমন মনে হয় না?)",
        formation_formula: "普通形 + のではないだろうか / ではないか (な形容詞・名詞は 〜な/〜である)",
        nuance_explanation_bn: "জাপানি প্রবন্ধ ও কলামে লেখকরা কখনো কর্কশভাবে 'এমনই হবে!' লেখেন না। বরং 'এমনটা কি হতে পারে না? বা এমনটাই কি বাস্তব নয়?' (〜のではないだろうか) বলে পাঠকদের নিজ মতের সাথে একাত্ম করেন। N3 রিডিং টেস্টে এই বাক্যটি থাকা মানেই সেখানেই লেখকের কেন্দ্রীয় বার্তা লুকানো আছে।",
        examples: [
          {
            sentence_ja: "便利[べんり]な時代[じだい]だからこそ、人[ひと]と人[ひと]との直接[ちょくせつ]の対話[たいわ]が大切[たいせつ]なのではないだろうか。",
            sentence_bn: "এই অতি আধুনিক ও সুবিধাজনক যুগে বলেই কি মানুষের সাথে মানুষের সরাসরি আলাপচারিতা আরও বেশি গুরুত্বপূর্ণ নয় কি?",
            sentence_en: "Precisely because it is a convenient age, isn't direct dialogue between people all the more important?"
          },
          {
            sentence_ja: "環境問題[かんきょうもんだい]の解決[かいけつ]には、一人一人[ひとりひとり]の意識[いしき]の変革[へんかく]が必要[ひつよう]なのではないか。",
            sentence_bn: "পরিবেশ সংকট সমাধানের জন্য প্রতিটি ব্যক্তির মানসিকতার পরিবর্তন অপরিহার্য নয় কি?",
            sentence_en: "Isn't a transformation in each individual's awareness necessary to solve environmental issues?"
          },
          {
            sentence_ja: "失敗[しっぱい]を恐[おそ]れずに挑戦[ちょうせん]することにこそ、本当[ほんとう]の価値[かち]があるのではないだろうか。",
            sentence_bn: "ব্যর্থতার ভয় না করে নতুন উদ্যোগে নামার মাঝেই কি আসল সার্থকতা নিহিত নয়?",
            sentence_en: "Doesn't the true value lie in taking challenges without fearing failure?"
          }
        ],
        common_pitfalls: "এটি কোনো প্রশ্ন নয়, বরং লেখকের সুদৃঢ় মতামত। পরীক্ষায় '筆者の考えと合っているもの' চাইলে 〜のではないだろうか যুক্ত বাক্যটিই সঠিক উত্তরের চাবিকাঠি।"
      }
    ],
    dialogue_scenario: {
      title_ja: "図書館[としょかん]の利用案内[りようあんない]を読[よ]み解[と]く",
      title_en: "Analyzing Library Service Rules",
      context_bn: "মিউনিসিপ্যাল লাইব্রেরির নোটিস পড়ে স্টাডি রুম ব্যবহারের শর্ত অনুসন্ধান করা।",
      lines: [
        {
          speaker: "学習者",
          speaker_role: "N3 Candidate",
          line_ja: "この自習室[じしゅうしつ]は誰[だれ]でも無料[むりょう]で使[つか]えるのかな。",
          line_bn: "এই স্টাডি রুমটি কি যে কেউ বিনামূল্যে ব্যবহার করতে পারে?",
          line_en: "Can anyone use this self-study room for free?",
          audio_cue: "Scanning notice board thoughtfully"
        },
        {
          speaker: "案内係[あんないがかり]",
          speaker_role: "Library Desk Officer",
          line_ja: "掲示板[けいじばん]をご覧[らん]ください。『市内[しない]在住[ざいじゅう]の方[かた]に限[かぎ]り無料[むりょう]、ただし当日[とうじつ]の整理券[せいりけん]が必要[ひつよう]』と書[か]かれています。",
          line_bn: "নোটিস বোর্ডটি একটু দেখুন। সেখানে লেখা আছে: 'শহরের বাসিন্দাদের জন্য বিনামূল্যে প্রযোজ্য, তবে শর্ত থাকে যে ওই দিনের টোকেন সংগ্রহ করতে হবে'。",
          line_en: "Please look at the notice board. It says: 'Free strictly for city residents, provided that a numbered ticket for the day is required.'",
          audio_cue: "Explaining specific conditions"
        },
        {
          speaker: "学習者",
          speaker_role: "N3 Candidate",
          line_ja: "なるほど！『ただし』のあとの条件[じょうけん]を見落[みお]とすところでした。整理券[せいりけん]をもらってきます。",
          line_bn: "তাই তো! 'তবে' এর পরের শর্তটি প্রায় চোখ এড়িয়ে যাচ্ছিল। আমি এখনই গিয়ে টোকেন নিয়ে আসছি।",
          line_en: "I see! I almost overlooked the condition after 'provided that'. I'll go get a numbered ticket.",
          audio_cue: "Aha moment"
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "N3 রিডিং টেস্টের সময় ব্যবস্থাপনা (Time Management)",
      tip_bn: "N3 রিডিং সেকশনে ৭০ মিনিটের মধ্যে সব প্রশ্নের উত্তর দিতে হয়। তথ্য অনুসন্ধান (情報検索) প্রশ্নের জন্য সর্বোচ্চ ৪ মিনিট সময় বরাদ্দ রাখুন। পুরো টেক্সট না পড়ে সরাসরি প্রশ্ন ও ৪টি অপশন আগে পড়ুন, তারপর নির্দিষ্ট কীওয়ার্ড খুঁজে বের করুন।",
      practical_action_bn: "পরীক্ষায় প্যারাগ্রাফের তবে (しかし), অর্থাৎ (つまり), অবশ্যই (〜べきだ) শব্দের নিচে পেন্সিল দিয়ে দাগ দিয়ে দ্রুত লেখকের অভিমত চিহ্নিত করুন।"
    },
    typing_practice: [
      {
        prompt_ja: "文章の要点をつかむことが大切です。",
        target_romaji: "bunshounoyoutenwotsukamukotogataisetsudesu.",
        meaning_bn: "অনুচ্ছেদের মূল কথাটি ধরা গুরুত্বপূর্ণ।"
      },
      {
        prompt_ja: "対話が重要なのではないだろうか。",
        target_romaji: "taiwagajuuyounanodehanaidarouka.",
        meaning_bn: "সরাসরি সংলাপ কি গুরুত্বপূর্ণ নয়?"
      },
      {
        prompt_ja: "条件に該当する方のみ応募できます。",
        target_romaji: "joukennigaitousurukatanomioubodekimasu.",
        meaning_bn: "শর্ত পূরণকারীগণই আবেদন করতে পারবেন।"
      }
    ],
    quizzes: [
      {
        question_ja: "評論文で「〜のではないだろうか」という表現が使われている時、筆者は何を意図していますか。",
        question_bn: "কোনো প্রবন্ধে যখন '〜のではないだろうか' বাক্যগঠন থাকে, তখন লেখক আসলে কী বোঝাতে চান?",
        options: [
          "自分の意見や主張を控えめに、しかし強く訴えたい",
          "読者に対して本当の疑問を投げかけて答えを求めている",
          "自分が全く自信がないことを言い訳している",
          "他人の意見を単に紹介しているだけである"
        ],
        correct_index: 0,
        explanation_bn: "'〜のではないだろうか' হলো লেখকের নিজস্ব শক্তিশালী অভিমতকে শালীন ও বিনম্র ভাষায় পাঠকদের সম্মুখে তুলে ধরার প্রতিষ্ঠিত ভঙ্গি।"
      },
      {
        question_ja: "お知らせの「ただし、土日祝日は追加料金をいただきます」が意味することはどれですか。",
        question_bn: "নোটিসের 'তবে শর্ত থাকে যে, শনি-রবি ও ছুটির দিনে অতিরিক্ত ফি প্রযোজ্য' কথাটির অর্থ কী?",
        options: [
          "平日と違って、週末や休日は追加の費用がかかる",
          "土日祝日は休みなので利用できない",
          "平日は土日よりも常に料金が高い",
          "誰でも毎日追加料金なしで利用できる"
        ],
        correct_index: 0,
        explanation_bn: "'ただし' দ্বারা পূর্ববর্তী সাধারণ নিয়মের উপর বিশেষ সীমাবদ্ধতা আরোপ করা হয়; অর্থাৎ স্বাভাবিক সময়ে অতিরিক্ত ফি না লাগলেও ছুটির দিনে লাগবে।"
      }
    ]
  },

  // --- LESSON 42: 聴解・即時応答 ---
  {
    copyright: "© 2026 Nihomi AI™ (nihomi.com). All rights reserved.",
    brand: "Nihomi Japanese Learning Platform",
    lesson_metadata: {
      lesson_id: "N3-L42",
      lesson_number: 42,
      module_number: 9,
      module_name: "統合 (Mastery & N3 Capstone)",
      module_name_bn: "সার্বিক সংহতি ও সমাপনী কৌশল",
      title_ja: "聴解[ちょうかい]・即時応答[そくじおうとう]と状況把握[じょうきょうはあく]",
      title_en: "Listening Comprehension & Instant Responses",
      title_bn: "শ্রবণ অনুধাবন ও তাৎক্ষণিক যথাযথ প্রত্যুত্তর কৌশল",
      estimated_minutes: 30,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "N3 লিসেনিং পরীক্ষায় 'তাত্ক্ষণিক প্রত্যুত্তর' (即時応答 - Sokuji Outou) একটি অতি দ্রুতগতির অংশ যেখানে একটি ছোট উক্তি শুনে তাৎক্ষণিকভাবে ৩টি অপশনের মধ্যে সবচেয়ে স্বাভাবিক ও ভদ্র প্রতিউত্তর বেছে নিতে হয়। এখানে প্রশ্নের সূক্ষ্ম টোন ও সামাজিক সম্পর্ক বুঝে সেকেন্ডের ভগ্নাংশে সিদ্ধান্ত নেওয়া শিখতে হয়।",
      core_concept_bn: "প্রস্তাবনা (〜ませんか), অনুরোধ (〜てください), অভিযোগ বা অনুমোদনের বিপরীতে খাঁটি জাপানি প্রতিক্রিয়া প্রদান।",
      real_world_context_bn: "অফিসে বস বা সহকর্মী হঠাৎ কোনো মন্তব্য করলে থমকে না গিয়ে সাবলীলভাবে '承知いたしました' বা '助かります' বলা।",
      key_takeaway_bn: "褒められた時 (いえ、まだまだです); 誘われた時 (ぜひ喜んで / あいにく都合が...); 感謝された時 (お役に立ててよかったです)。"
    },
    vocabulary_scope: [
      {
        word_ja: "即時[そくじ]",
        romaji: "sokuji",
        meaning_bn: "তাৎক্ষণিক / অনতিবিলম্বে",
        meaning_en: "immediate / instant",
        part_of_speech: "noun",
        example_ja: "質問[しつもん]に対[たい]して即時[そくじ]に応答[おうとう]する練習[れんしゅう]をする。",
        example_bn: "প্রশ্নের বিপরীতে তাৎক্ষণিক সাড়া দেওয়ার অনুশীলন করা।",
        example_en: "Practice responding immediately to questions."
      },
      {
        word_ja: "気[き]に留[と]める",
        romaji: "kinitomeru",
        meaning_bn: "মনে রাখা / মনোযোগ দেওয়া",
        meaning_en: "to pay attention to / bear in mind",
        part_of_speech: "phrase",
        example_ja: "相手[あいて]の言葉[ことば]のトーンに気[き]に留[と]めて聞き取[ききと]ろう。",
        example_bn: "বক্তার কথার সুরের দিকে বিশেষ মনোযোগ দিয়ে শ্রবণ করুন।",
        example_en: "Listen closely, keeping the speaker's tone of voice in mind."
      },
      {
        word_ja: "相づち[あいづち]",
        romaji: "aizuchi",
        meaning_bn: "কথোপকথনে সম্মতিসূচক সংক্ষিপ্ত হুঙ্কার বা সায়",
        meaning_en: "conversational interjections / nodding cues",
        part_of_speech: "noun",
        example_ja: "適切[てきせつ]な相づち[あいづち]を打[う]つことで会話[かいわ]が弾[はず]む。",
        example_bn: "যথাযথ সায় বা সম্মতি প্রকাশের মাধ্যমে কথোপকথন প্রাণবন্ত হয়ে ওঠে।",
        example_en: "A conversation flows smoothly by giving appropriate conversational cues."
      },
      {
        word_ja: "助[たす]かります",
        romaji: "tasukarimasu",
        meaning_bn: "অনেক বড় উপকার বা স্বস্তি হলো",
        meaning_en: "that is a big help / I am saved",
        part_of_speech: "phrase",
        example_ja: "手伝[てつだ]っていただけると本当[ほんとう]に助[たす]かります。",
        example_bn: "আপনি একটু সাহায্য করলে সত্যি খুব বড় উপকার হয়।",
        example_en: "It would really be a great help if you could assist me."
      },
      {
        word_ja: "恐縮[きょうしゅく]です",
        romaji: "kyoushukudesu",
        meaning_bn: "কৃতজ্ঞতায় আমি কুন্ঠিত / লজ্জিত",
        meaning_en: "I am much obliged / feel humbled",
        part_of_speech: "phrase",
        example_ja: "ご丁寧[ていねい]なお言葉[ことば]、恐縮[きょうしゅく]です。",
        example_bn: "আপনার আন্তরিক প্রশংসায় আমি গভীরভাবে কৃতজ্ঞ ও অভিভূত।",
        example_en: "I am humbled by your kind words."
      }
    ],
    kanji_scope: [
      {
        kanji: "聴",
        onyomi: "チョウ",
        kunyomi: "き・く",
        meaning_bn: "মনোযোগ দিয়ে শ্রবণ করা",
        stroke_count: 17,
        radical: "耳",
        stroke_order_svg: "",
        mnemonics_bn: "কান (耳), চক্ষু (目) এবং সমগ্র অন্তঃকরণ (心) এক করে একাগ্রভাবে শোনা = 聴。 ",
        practical_examples: [
          { word_ja: "聴解[ちょうかい]", reading_ja: "ちょうかい", meaning_bn: "শ্রবণ অনুধাবন" },
          { word_ja: "聴力[ちょうりょく]", reading_ja: "ちょうりょく", meaning_bn: "শ্রবণশক্তি" }
        ]
      },
      {
        kanji: "即",
        onyomi: "ソク",
        kunyomi: "つ・く",
        meaning_bn: "তৎক্ষণাৎ / সাথে সাথে",
        stroke_count: 7,
        radical: "卩",
        stroke_order_svg: "",
        mnemonics_bn: "খাবারের থালা সমক্ষে পাওয়া মাত্রই আসন গ্রহণ করা = 即。 ",
        practical_examples: [
          { word_ja: "即座[そくざ]", reading_ja: "そくざ", meaning_bn: "মুহূর্তের মধ্যে" },
          { word_ja: "即答[そくとう]", reading_ja: "そくとう", meaning_bn: "তাৎক্ষণিক উত্তর" }
        ]
      }
    ],
    grammar_points: [
      {
        rule_id: "N3-G42",
        pattern_ja: "〜ていただけると助かります / 〜幸いです",
        pattern_en: "I would be grateful if you could... (Indirect request)",
        pattern_bn: "আপনি দয়া করে কাজটি করে দিলে আমার অনেক উপকার হয় (~助かります)",
        formation_formula: "動詞て形 + いただけると助かります / いただけますと幸いです",
        nuance_explanation_bn: "সরাসরি '〜してください' আদেশের মতো শোনায়। কিন্তু '〜ていただけると助かります' (আপনি করে দিলে আমি খুব স্বস্তি ও উপকার পেতাম) বললে অনুরোধটি অত্যন্ত নম্র ও চাপমুক্ত মনে হয়। এটি অফিসে সহকর্মী বা ক্লায়েন্টকে অনুরোধ করার আধুনিকতম ভদ্র রূপ।",
        examples: [
          {
            sentence_ja: "明日[あす]の午前中[ごぜんちゅう]に資料[しりょう]を共有[きょうゆう]していただけると助[たす]かります。",
            sentence_bn: "আগামীকাল দুপুরের আগেই নথিপত্রটি শেয়ার করে দিলে আমার জন্য খুবই উপকার হতো।",
            sentence_en: "It would be a great help if you could share the materials tomorrow morning."
          },
          {
            sentence_ja: "ご都合[つごう]のよろしい時間[じかん]をお知[し]らせいただけますと幸[さいわ]いです。",
            sentence_bn: "আপনার সুবিধাজনক সময়টি জানালে আমরা পরম বাধিত হবো।",
            sentence_en: "We would be fortunate if you could let us know your convenient time."
          },
          {
            sentence_ja: "早[はや]めにご返信[へんしん]いただけると助[たす]かります。",
            sentence_bn: "একটু দ্রুত উত্তর প্রদান করলে খুবই সহায়তা হতো।",
            sentence_en: "It would help a lot if you could reply at your earliest convenience."
          }
        ],
        common_pitfalls: "'助かります' সমমর্যাদার সহকর্মী বা জুনিয়রের ক্ষেত্রে প্রযোজ্য। তবে অনেক ঊর্ধ্বতন কর্মকর্তা বা সম্মানিত ক্লায়েন্টের ক্ষেত্রে '助かります' এর চেয়ে '幸甚に存じます' বা '幸いです' বলা শ্রেয়।"
      }
    ],
    dialogue_scenario: {
      title_ja: "オフィスの即時対応[そくじたいおう]",
      title_en: "Immediate Office Exchange",
      context_bn: "সহকর্মীর কাছ থেকে আকস্মিক কাজের প্রস্তাব পাওয়ার পর সঠিক প্রতিউত্তরের মহড়া।",
      lines: [
        {
          speaker: "同僚[どうりょう]",
          speaker_role: "Colleague",
          line_ja: "ラヒムさん、プレゼンの準備[じゅんび]、私[わたし]も手伝[てつだ]いましょうか。",
          line_bn: "রাহিম সাহেব, প্রেজেন্টেশনের প্রস্তুতিতে আমিও কি একটু হাত লাগাব?",
          line_en: "Mr. Rahim, shall I help with the presentation preparations too?",
          audio_cue: "Warm friendly offer"
        },
        {
          speaker: "ラヒム",
          speaker_role: "N3 Candidate",
          line_ja: "本当[ほんとう]ですか！そうしていただけると助[たす]かります。ありがとうございます。",
          line_bn: "সত্যি বলছেন! আপনি যদি সাহায্য করেন তবে আমার অনেক বড় উপকার হয়। অসংখ্য ধন্যবাদ।",
          line_en: "Really? It would be a huge help if you could do so. Thank you very much!",
          audio_cue: "Grateful and natural response"
        },
        {
          speaker: "同僚[どうりょう]",
          speaker_role: "Colleague",
          line_ja: "お互[たが]い様[さま]ですよ。スライドのグラフ作成[さくせい]を担当[たんとう]しますね。",
          line_bn: "আমরা তো একে অপরের পরিপূরক! স্লাইডের গ্রাফ তৈরির দায়িত্বটা আমি নিচ্ছি।",
          line_en: "We help each other out! I'll take charge of creating the slide graphs.",
          audio_cue: "Supportive team spirit"
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "N3 লিসেনিংয়ে 'তাৎক্ষণিক উত্তর' সেশনের সিক্রেট হ্যাক",
      tip_bn: "即時応答 প্রশ্নে কোনো প্রশ্নপত্রে কিছু ছাপা থাকে না, সব অডিওতে বাজে। উত্তর নির্বাচন করতে সময় পাবেন মাত্র ৩ সেকেন্ড! তাই বক্তার শেষের বিভক্তিটি (〜ませんか = আমন্ত্রণ, 〜てくれない？ = অনুরোধ, 〜ちゃった = আক্ষেপ) শোনার সাথে সাথে মনের ভেতর প্রস্তুত থাকুন।",
      practical_action_bn: "যদি কেউ বলে 'コーヒーでもいかがですか' (এক কাপ কফি হলে কেমন হয়?), তখন 'いいえ' না বলে 'あ、ありがとうございます。いただきます' বা বিনম্র নাকচ 'あいにく、先ほどいただいたばかりで' বলতে হবে।"
    },
    typing_practice: [
      {
        prompt_ja: "そうしていただけると助かります。",
        target_romaji: "soushiteitadakirutotasukarimasu.",
        meaning_bn: "তা করলে অনেক উপকার হয়।"
      },
      {
        prompt_ja: "ご都合をお知らせいただけますと幸いです。",
        target_romaji: "gotsugouwoshiraseitadakemasutosaiwaidesu.",
        meaning_bn: "সুবিধাজনক সময় জানালে বাধিত হব।"
      },
      {
        prompt_ja: "お役に立ててよかったです。",
        target_romaji: "oyakunitateteyokattadesu.",
        meaning_bn: "কাজে আসতে পেরে ভালো লাগছে।"
      }
    ],
    quizzes: [
      {
        question_ja: "「この仕事、手伝ってくれない？」と言われた時の自然な返答はどれですか。",
        question_bn: "'এই কাজটি একটু সাহায্য করে দেবে কি?' বললে সবচেয়ে স্বাভাবিক প্রত্যুত্তর কোনটি?",
        options: [
          "ええ、喜んで！今すぐやりますね。",
          "いいえ、手伝わせてください。",
          "どういたしまして、大丈夫です。",
          "誰がやるのですか。"
        ],
        correct_index: 0,
        explanation_bn: "বন্ধুসুলভ অনুরোধের ইতিবাচক সানন্দ প্রত্যুত্তর হলো 'ええ、喜んで！今すぐやりますね (হ্যাঁ, সানন্দে! আমি এখুনি করছি)'।"
      },
      {
        question_ja: "上司から「プレゼン、大成功だったね！」と褒められた時の適切な返答は？",
        question_bn: "বসের কাছ থেকে 'প্রেজেন্টেশন তো বিশাল সাফল্য পেল!' প্রশংসা শুনলে বিনম্র জাপানি প্রতিউত্তর কোনটি?",
        options: [
          "ありがとうございます。皆様のご指導のおかげです。",
          "はい、私が一番頑張ったからです。",
          "どういたしまして、当然の結果です。",
          "いえ、失敗ばかりでしたから嫌です。"
        ],
        correct_index: 0,
        explanation_bn: "জাপানি সংস্কৃতিতে প্রশংসার উত্তরে বিনয়ের সাথে দলের ও মেন্টরের প্রতি কৃতজ্ঞতা জানাতে হয়: 'ありがとうございます。皆様のご指導のおかげです (ধন্যবাদ, আপনাদের সকলের দিকনির্দেশনার বদৌলতেই সম্ভব হয়েছে)'।"
      }
    ]
  },

  // --- LESSON 43: 重要コロケーション・複合動詞 ---
  {
    copyright: "© 2026 Nihomi AI™ (nihomi.com). All rights reserved.",
    brand: "Nihomi Japanese Learning Platform",
    lesson_metadata: {
      lesson_id: "N3-L43",
      lesson_number: 43,
      module_number: 9,
      module_name: "統合 (Mastery & N3 Capstone)",
      module_name_bn: "সার্বিক সংহতি ও সমাপনী কৌশল",
      title_ja: "重要[じゅうよう]コロケーションと複合動詞[ふくごうどうし]の完全[かんぜん]攻略[こうりゃく]",
      title_en: "Essential Collocations & Compound Verbs",
      title_bn: "গুরুত্বপূর্ণ যৌগিক ক্রিয়া ও শব্দযুগল আয়ত্তকরণ",
      estimated_minutes: 30,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "জাপানি ভাষার স্বাভাবিকতার চাবিকাঠি হলো যৌগিক ক্রিয়া (Compound Verbs)। দুটি ক্রিয়ার সংযোগে নতুন বিশেষ মাত্রা তৈরি হয়: 〜出す (হঠাৎ শুরু হওয়া), 〜込む (গভীরে ঢোকা বা মনোনিবেশ করা), 〜直す (পুনরায় নতুন করে করা), 〜切る (সম্পূর্ণরূপে শেষ করা বা নিঃশেষ হওয়া)। এর পাশাপাশি স্বাভাবিক শব্দযুগল (যেমন: 興味を持つ, 努力を重ねる) জানা N3 তে সর্বোচ্চ নম্বর নিশ্চিত করে।",
      core_concept_bn: "ক্রিয়ামূল + সহায়ক ক্রিয়ার মেলবন্ধনে সুনির্দিষ্ট গতি ও মনোভাবের সৃষ্টি।",
      real_world_context_bn: "লেখা কোনো ভুল হলে নতুন করে পুনরায় লেখা (書き直す), হঠাৎ বৃষ্টি শুরু হওয়া (雨が降り出す), কিংবা ক্লান্তিতে নিঃশেষ হওয়া (疲れ切る) প্রকাশের নিখুঁত রীতি।",
      key_takeaway_bn: "〜出す (আকস্মিক শুরু); 〜込む (অভ্যন্তরে প্রবেশ/তন্ময়তা); 〜直す (পুনর্বার); 〜切る (পরিপূর্ণ সমাপ্তি); コロケーション (শব্দের প্রাকৃতিক জুটি)।"
    },
    vocabulary_scope: [
      {
        word_ja: "思[おも]い込[こ]む",
        romaji: "omoikomu",
        meaning_bn: "দৃঢ় বা অন্ধভাবে কোনো ভুল ধারণা পোষণ করা",
        meaning_en: "to assume falsely / be under the impression",
        part_of_speech: "verb",
        example_ja: "今日[きょう]が日曜日[にちようび]だとすっかり思[おも]い込[こ]んでいた。",
        example_bn: "আজকে রবিবার বলেই সম্পূর্ণ ভুল ধারণা করে বসেছিলাম।",
        example_en: "I was completely under the impression that today was Sunday."
      },
      {
        word_ja: "やり直[なお]す",
        romaji: "yarinaosu",
        meaning_bn: "প্রথম থেকে পুনরায় নতুন করে করা",
        meaning_en: "to redo / start over",
        part_of_speech: "verb",
        example_ja: "ミスがあったので、最初[さいしょ]からやり直[なお]した。",
        example_bn: "ভুল হওয়ার কারণে একদম শুরু থেকে পুনরায় করলাম।",
        example_en: "Because there was a mistake, I redid it from the beginning."
      },
      {
        word_ja: "降[ふ]り出[だ]す",
        romaji: "furidasu",
        meaning_bn: "হঠাৎ বৃষ্টি বা তুষার পড়তে শুরু করা",
        meaning_en: "to start raining / snowing",
        part_of_speech: "verb",
        example_ja: "急[きゅう]に大雨[おおあめ]が降[ふ]り出[だ]した。",
        example_bn: "হঠাৎ মুষলধারে বৃষ্টি নামতে শুরু করল।",
        example_en: "Suddenly, heavy rain started pouring down."
      },
      {
        word_ja: "疲[つか]れ切[き]る",
        romaji: "tsukarekiru",
        meaning_bn: "চরম ক্লান্তিতে পুরোপুরি নিঃশেষ হওয়া",
        meaning_en: "to be exhausted completely",
        part_of_speech: "verb",
        example_ja: "長旅[ながたび]で全身[ぜんしん]が疲[つか]れ切[き]ってしまった。",
        example_bn: "দীর্ঘ ভ্রমণের ফলে পুরো শরীর চরম ক্লান্তিতে নিঃশেষ হয়ে গেছে।",
        example_en: "My entire body was completely exhausted after the long trip."
      },
      {
        word_ja: "興味[きょうみ]を持[も]つ",
        romaji: "kyoumiwomotsu",
        meaning_bn: "আগ্রহ বোধ করা / কৌতূহলী হওয়া",
        meaning_en: "to take interest in",
        part_of_speech: "phrase",
        example_ja: "日本[にほん]の先端技術[せんたんぎじゅつ]に深[ふか]い興味[きょうみ]を持[も]っている。",
        example_bn: "জাপানের অত্যাধুনিক প্রযুক্তিতে আমার গভীর আগ্রহ রয়েছে।",
        example_en: "I have a deep interest in Japan's advanced technology."
      }
    ],
    kanji_scope: [
      {
        kanji: "複",
        onyomi: "フク",
        kunyomi: "かさ・なる",
        meaning_bn: "একাধিক / যৌগিক / জটিল",
        stroke_count: 14,
        radical: "衣",
        stroke_order_svg: "",
        mnemonics_bn: "পোশাকের (衣) ওপর পুনরায় আস্তর দিয়ে একাধিক স্তরে সজ্জিত করা = 複。 ",
        practical_examples: [
          { word_ja: "複合[ふくごう]", reading_ja: "ふくごう", meaning_bn: "যৌগিক রূপ" },
          { word_ja: "複雑[ふくざつ]", reading_ja: "ふくざつ", meaning_bn: "জটিল" }
        ]
      },
      {
        kanji: "直",
        onyomi: "チョク, ジキ",
        kunyomi: "ただ・ちに, なお・す, なお・る",
        meaning_bn: "সরাসরি / সংশোধন / পুনরায় মেরামত",
        stroke_count: 8,
        radical: "目",
        stroke_order_svg: "",
        mnemonics_bn: "সোজা দৃষ্টি মেলে (目) ত্রুটিহীনভাবে সংশোধন করা = 直。 ",
        practical_examples: [
          { word_ja: "直す[なおす]", reading_ja: "なおす", meaning_bn: "মেরামত বা পুনরায় করা" },
          { word_ja: "直接[ちょくせつ]", reading_ja: "ちょくせつ", meaning_bn: "সরাসরি" }
        ]
      }
    ],
    grammar_points: [
      {
        rule_id: "N3-G43",
        pattern_ja: "動詞ます形語幹 + 切る / 切り",
        pattern_en: "To do completely / to exhaustion / decisively",
        pattern_bn: "সম্পূর্ণরূপে শেষ করা বা নিঃশেষ হয়ে যাওয়া (~切る)",
        formation_formula: "動詞ます形語幹 + 切る",
        nuance_explanation_bn: "যেকোনো কাজ কেবল শেষ করা নয়, বরং অবশিষ্ট কিছু না রেখে একেবারে শেষ বিন্দু পর্যন্ত সম্পন্ন করা বা চরম সীমায় পৌঁছানোকে 〜切る প্রকাশ করে। যেমন: 疲れ切る (ক্লান্তির চূড়ান্ত), 売り切れる (একদম সব বিক্রি হয়ে যাওয়া), 言い切る (দৃঢ়তার সাথে সম্পূর্ণ কথা বলা)।",
        examples: [
          {
            sentence_ja: "長[なが]い小説[しょうせつ]を一晩[ひとばん]で読[よ]み切[き]った。",
            sentence_bn: "দীর্ঘ উপন্যাসটি এক রাতের মধ্যে পুরোপুরি পড়ে শেষ করলাম।",
            sentence_en: "I read through the long novel completely in a single night."
          },
          {
            sentence_ja: "自分[じぶん]の力[ちから]を全[すべ]て出[だ]し切[き]って試合[しあい]に臨[のぞ]んだ。",
            sentence_bn: "নিজের সমুদয় শক্তি পূর্ণরূপে উজাড় করে দিয়ে খেলায় নেমেছিলাম।",
            sentence_en: "I entered the match exerting my utmost strength to the fullest."
          },
          {
            sentence_ja: "限定商品[げんていしょうひん]は瞬[またた]く間[ま]に売[う]り切[き]れた。",
            sentence_bn: "সীমিত সংস্করণের পণ্যগুলো চোখের পলকে সব বিক্রি হয়ে নিঃশেষ হলো।",
            sentence_en: "The limited items sold out completely in the blink of an eye."
          }
        ],
        common_pitfalls: "〜切れない রূপটি 'এত বেশি যে শেষ করা সম্ভব নয়' বোঝায়। যেমন '数え切れないほどの星' (অগণিত নক্ষত্র যা গুণে শেষ করা যায় না)।"
      }
    ],
    dialogue_scenario: {
      title_ja: "プログラミングのバグ修正[しゅうせい]",
      title_en: "Fixing Programming Bugs",
      context_bn: "কোডিংয়ে ত্রুটি খুঁজে পাওয়ার পর পুরো কোড পুনরায় চেক করে নিখুঁতভাবে শেষ করার সহকর্মী আলোচনা।",
      lines: [
        {
          speaker: "エンジニアA",
          speaker_role: "Senior Developer",
          line_ja: "ラヒムさん、さっきのテストでエラーが出[だ]し切[き]ったようですね。",
          line_bn: "রাহিম সাহেব, পূর্বের টেস্টের যত ত্রুটি ছিল সব যেন সম্পূর্ণরূপে বের হয়ে এসেছে।",
          line_en: "Rahim, it seems all the errors were thoroughly surfaced in the previous test.",
          audio_cue: "Reviewing code diagnostics"
        },
        {
          speaker: "ラヒム",
          speaker_role: "N3 Candidate",
          line_ja: "はい、原因[げんいん]を見直[みなお]して、ロジックを一[いち]から書[か]き直[なお]しました。これで完璧[かんぺき]に動[うご]きます。",
          line_bn: "হ্যাঁ, কারণগুলো পুনরায় পর্যালোচনা করে লজিকটি শুরু থেকে নতুন করে লিখেছি। এবার পুরোপুরি নিখুঁত কাজ করবে।",
          line_en: "Yes, I re-examined the cause and rewrote the logic from scratch. It will run perfectly now.",
          audio_cue: "Confident problem-solving"
        },
        {
          speaker: "エンジニアA",
          speaker_role: "Senior Developer",
          line_ja: "素晴らしい粘[ねば]り強[づよ]さですね！やり切[き]りましたね。",
          line_bn: "চমৎকার সহনশীলতা ও অধ্যবসায়! আপনি সত্যিই চমৎকারভাবে কাজটি সমাপ্ত করলেন।",
          line_en: "Wonderful perseverance! You really saw it through to the end.",
          audio_cue: "Warm compliment"
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "জাপানি কলোকেশন: শব্দের প্রাকৃতিক জোড়া",
      tip_bn: "জাপানি ভাষায় অনেক শব্দের সাথে একটি নির্দিষ্ট ক্রিয়াই কেবল খাপ খায়। যেমন: 'মনোযোগ দেওয়া' বলতে '注意を払う' (লক্ষ্য পরিশোধ করা), 'অভিজ্ঞতা অর্জন' বলতে '経験を積む' (অভিজ্ঞতার স্তূপ গড়া)। বাংলা বা ইংরেজি থেকে শব্দ ধরে অনুবাদ করলে তা অপ্রাকৃতিক শোনাবে।",
      practical_action_bn: "ভোকাবুলারি মুখস্থ করার সময় একক শব্দের বদলে পুরো ফ্রেজ (যেমন: 夢を叶える - স্বপ্ন পূরণ করা, 責任を果たす - দায়িত্ব পালন করা) এক সাথে মুখস্থ করুন।"
    },
    typing_practice: [
      {
        prompt_ja: "最初からやり直しました。",
        target_romaji: "saishokarayarinaoshimashita.",
        meaning_bn: "শুরু থেকে পুনরায় করলাম।"
      },
      {
        prompt_ja: "全身が疲れ切ってしまった。",
        target_romaji: "zenshingatsukarekitteshimatta.",
        meaning_bn: "পুরো শরীর চরম ক্লান্তিতে নিঃশেষ হলো।"
      },
      {
        prompt_ja: "日本の技術に興味を持つ。",
        target_romaji: "nihonnogijutsunikyoumiwomotsu.",
        meaning_bn: "জাপানি প্রযুক্তিতে আগ্রহ পোষণ করা।"
      }
    ],
    quizzes: [
      {
        question_ja: "「一日中歩き回って、もう＿＿＿＿＿＿。」に入る最も適切な複合動詞は？",
        question_bn: "সারাদিন হেঁটে হেঁটে আমি আর পারছি না ______। সবচেয়ে মানানসই যৌগিক ক্রিয়া কোনটি?",
        options: [
          "疲れ切ってしまった",
          "疲れ直してしまった",
          "疲れ出してしまった",
          "疲れ込んでしまった"
        ],
        correct_index: 0,
        explanation_bn: "শারীরিক ক্লান্তির চরম প্রান্তে পৌঁছানোর জন্য সুনির্দিষ্ট যৌগিক ক্রিয়া হলো '疲れ切る' (疲れ切ってしまった)।"
      },
      {
        question_ja: "「文章に間違いが多かったので、もう一度＿＿＿＿＿。」に入る語彙は？",
        question_bn: "লেখায় অনেক ভুল থাকায় আরেকবার ______। শূন্যস্থানে কী বসবে?",
        options: [
          "書き直した",
          "書き切った",
          "書き出した",
          "書き込んだ"
        ],
        correct_index: 0,
        explanation_bn: "ত্রুটি সংশোধনের উদ্দেশ্যে পুনরায় কোনো কিছু নতুন করে লেখার জন্য '〜直す' যুক্ত হয়ে '書き直した' হয়।"
      }
    ]
  },

  // --- LESSON 44: 文法総整理・紛らわしい表現の識別 ---
  {
    copyright: "© 2026 Nihomi AI™ (nihomi.com). All rights reserved.",
    brand: "Nihomi Japanese Learning Platform",
    lesson_metadata: {
      lesson_id: "N3-L44",
      lesson_number: 44,
      module_number: 9,
      module_name: "統合 (Mastery & N3 Capstone)",
      module_name_bn: "সার্বিক সংহতি ও সমাপনী কৌশল",
      title_ja: "N3文法総整理[ぶんぽうそうせいり]と紛[まぎ]らわしい表現[ひょうげん]の識別[しきべつ]",
      title_en: "Comprehensive Grammar Disambiguation",
      title_bn: "বিভ্রান্তিকর ব্যাকরণ কাঠামোর চূড়ান্ত বিভাজন ও সমাধান",
      estimated_minutes: 30,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "JLPT N3-তে সবচেয়ে বেশি শিক্ষার্থী হোঁচট খায় একই ধরনের শব্দযুক্ত ব্যাকরণের সূক্ষ্ম পার্থক্য ধরতে না পেরে। যেমন: 〜わけだ (যৌক্তিক কারণ/স্বাভাবিক পরিণতি), 〜はずだ (বস্তুনিষ্ঠ প্রত্যাশা/হওয়ার কথা), 〜べきだ (নৈতিক কর্তব্য/উচিত), 〜ものだ (সাধারণ মানবিক স্বভাব বা তীব্র আবেগ), এবং 〜ことだ (হালকা পরামর্শ/করা ভালো)। আজকের পাঠে এই সবগুলো বিভাজন স্ফটিকের মতো স্পষ্ট করা হবে।",
      core_concept_bn: "তর্কশাস্ত্র (わけ), তথ্যভিত্তিক সম্ভাবনা (はず), সামাজিক নৈতিকতা (べき), এবং প্রকৃতির স্বভাব (もの) এর স্পষ্ট পার্থক্য।",
      real_world_context_bn: "পরীক্ষার প্রশ্নপত্রে চার অপশনে যখন 'わけがない', 'はずがない', 'べきではない', 'ものではない' একসাথে আসে, তখন বিভ্রান্ত না হয়ে নিখুঁত উত্তর দাগানো।",
      key_takeaway_bn: "わけだ (তর্কসঙ্গত পরিণতি); はずだ (তথ্যভিত্তিক জোরালো অনুমান); べきだ (নৈতিক দায়িত্ব); ものだ (প্রাকৃতিক প্রবণতা বা অতীতে অভ্যস্ত স্মৃতি); ことだ (হিতোপদেশ)।"
    },
    vocabulary_scope: [
      {
        word_ja: "識別[しきべつ]する",
        romaji: "shikibetsu suru",
        meaning_bn: "পৃথক করা / ব্যবধান নির্ণয় করা",
        meaning_en: "to distinguish / differentiate",
        part_of_speech: "verb",
        example_ja: "似[に]ている文法[ぶんぽう]の意味[いみ]を的確[てきかく]に識別[しきべつ]する。",
        example_bn: "অনুরূপ ব্যাকরণের অর্থের মধ্যকার পার্থক্য সঠিকভাবে নির্ণয় করা।",
        example_en: "Accurately distinguish the nuances of similar grammatical patterns."
      },
      {
        word_ja: "紛[まぎ]らわしい",
        romaji: "magirawashii",
        meaning_bn: "বিভ্রান্তিকর / সহজে গুলিয়ে যায় এমন",
        meaning_en: "confusing / easily mistaken",
        part_of_speech: "i-adjective",
        example_ja: "選択肢[せんたくし]が紛[まぎ]らわしくて迷[まよ]ってしまった。",
        example_bn: "অপশনগুলো বিভ্রান্তিকর হওয়ায় আমি সংশয়ে পড়ে গিয়েছিলাম।",
        example_en: "The choices were confusing, so I hesitated."
      },
      {
        word_ja: "当然[とうぜん]",
        romaji: "touzen",
        meaning_bn: "স্বাভাবিক / যুক্তিসঙ্গতভাবেই প্রত্যাশিত",
        meaning_en: "natural / matter of course",
        part_of_speech: "noun",
        example_ja: "日頃[ひごろ]から練習[れんしゅう]を重[かさ]ねていれば合格[ごうかく]は当然[とうぜん]だ。",
        example_bn: "নিয়মিত অনুশীলন চালিয়ে গেলে উত্তীর্ণ হওয়াটাই তো স্বাভাবিক পরিণতি।",
        example_en: "If you practice consistently, passing is a matter of course."
      },
      {
        word_ja: "道理[どうり]",
        romaji: "douri",
        meaning_bn: "যুক্তি / কার্যকারণ সূত্র",
        meaning_en: "reason / logic / common sense",
        part_of_speech: "noun",
        example_ja: "そんな無理[むり]な話[はなし]は道理[どうり]に合[あ]わない。",
        example_bn: "এমন অসম্ভব অবাস্তব কথা যুক্তির সাথে মেলে না।",
        example_en: "Such unreasonable talk does not align with logic."
      },
      {
        word_ja: "傾向[けいこう]",
        romaji: "keikou",
        meaning_bn: "প্রবণতা / ঝোঁক",
        meaning_en: "tendency / trend",
        part_of_speech: "noun",
        example_ja: "若者[わかもの]の活字離[かつじばな]れの傾向[けいこう]が見[み]られる。",
        example_bn: "তরুণ প্রজন্মের মধ্যে বই পড়ার অনীহার প্রবণতা লক্ষ্য করা যাচ্ছে।",
        example_en: "A trend of young people moving away from print reading is observed."
      }
    ],
    kanji_scope: [
      {
        kanji: "識",
        onyomi: "シキ",
        kunyomi: "し・る",
        meaning_bn: "জ্ঞান / বিচারবুদ্ধি / চেনা",
        stroke_count: 19,
        radical: "言",
        stroke_order_svg: "",
        mnemonics_bn: "বাক্য (言) এবং চিহ্নের যথার্থ অনুধাবনের মাধ্যমে বিচারবুদ্ধি তৈরি = 識。 ",
        practical_examples: [
          { word_ja: "意識[いしき]", reading_ja: "いしき", meaning_bn: "সচেতনতা" },
          { word_ja: "知識[ちしき]", reading_ja: "ちしき", meaning_bn: "জ্ঞান" }
        ]
      },
      {
        kanji: "紛",
        onyomi: "フン",
        kunyomi: "まぎ・れる, まぎ・らす",
        meaning_bn: "জটলা / গুলিয়ে যাওয়া",
        stroke_count: 10,
        radical: "糸",
        stroke_order_svg: "",
        mnemonics_bn: "সুতা (糸) যখন বহু অংশে বিভক্ত (分) হয়ে জট পাকিয়ে যায় = 紛。 ",
        practical_examples: [
          { word_ja: "紛糾[ふんきゅう]", reading_ja: "ふんきゅう", meaning_bn: "জটিলতা / বিশৃঙ্খলা" },
          { word_ja: "紛失[ふんしつ]", reading_ja: "ふんしつ", meaning_bn: "হারিয়ে যাওয়া" }
        ]
      }
    ],
    grammar_points: [
      {
        rule_id: "N3-G44",
        pattern_ja: "〜ものだ vs 〜ことだ",
        pattern_en: "Inherent general nature / emotion vs Direct personal advice",
        pattern_bn: "স্বাভাবিক সত্য বা আবেগ (~ものだ) বনাম প্রত্যক্ষ হিতোপদেশ (~ことだ)",
        formation_formula: "動詞辞書形 + ものだ (সাধারণ সত্য); 動詞辞書形/ない形 + ことだ (উপদেশ)",
        nuance_explanation_bn: "〜ものだ কোনো নৈতিক উপদেশ নয়, এটি সৃষ্টির সাধারণ নিয়ম বা মানুষের স্বাভাবিক প্রবৃত্তি প্রকাশ করে (যেমন: 人は誰でも年を取るものだ = মানুষ তো বয়োবৃদ্ধ হবেই, এটাই নিয়ম)। আর 〜ことだ হলো কোনো নির্দিষ্ট ব্যক্তিকে সরাসরি সুপরামর্শ দেওয়া (যেমন: 早く治したいなら、ゆっくり休むことだ = দ্রুত সুস্থ হতে চাইলে ভালো করে বিশ্রাম নেওয়াই বুদ্ধিমানের কাজ)।",
        examples: [
          {
            sentence_ja: "時間[じかん]が経[た]つのは本当[ほんとう]に早[はや]いものですね。",
            sentence_bn: "সময় কত দ্রুত বয়ে যায়, সত্যিই তাই না! (গভীর আবেগীয় অনুভূতি)",
            sentence_en: "Time really passes by so fast, doesn't it!"
          },
          {
            sentence_ja: "子[こ]どもは元気に外[そと]で遊[あそ]ぶものだ。",
            sentence_bn: "বাচ্চারা প্রফুল্ল চিত্তে বাইরে খেলাধুলা করবে, এটাই তো স্বাভাবিক সাধারণ প্রবৃত্তি।",
            sentence_en: "Children are naturally meant to play energetically outdoors."
          },
          {
            sentence_ja: "日本語[にほんご]が上手[じょうず]になりたいなら、毎日[まいにち]少[すこ]しずつでも話[はな]すことだ。",
            sentence_bn: "জাপানি ভাষায় পারদর্শী হতে চাইলে প্রতিদিন অল্প হলেও কথা বলাই সবচেয়ে শ্রেয় পন্থা।",
            sentence_en: "If you want to become good at Japanese, the best thing to do is speak it every day, even just a little."
          }
        ],
        common_pitfalls: "〜ものだ এর অতীত রূপ 〜たものだ অতীতে নিয়মিত করা কোনো স্মৃতির নস্টালজিয়া বোঝায় (যেমন: 子供の頃よく川で泳いだものだ = ছোটবেলায় নদীতে কত সাঁতার কাটতাম!)।"
      }
    ],
    dialogue_scenario: {
      title_ja: "文法模擬演習[ぶんぽうもぎえんしゅう]の検討[けんとう]",
      title_en: "Grammar Mock Test Review",
      context_bn: "মক টেস্টের একটি জটিল প্রশ্নের অপশন নিয়ে দুই শিক্ষার্থীর আলোচনা ও সমাধান।",
      lines: [
        {
          speaker: "学習者A",
          speaker_role: "N3 Student",
          line_ja: "この問題[もんだい]、『約束[やくそく]は守[まも]る（ ）』の空欄[くうらん]、なぜ『はずだ』じゃなくて『べきだ』なの？",
          line_bn: "এই প্রশ্নটায়, 'প্রতিশ্রুতি রক্ষা করা (...)' এর শূন্যস্থানে কেন 'হাজুদা' না হয়ে 'বেকীদা' হলো?",
          line_en: "In this question, 'Promises ( ) kept', why is it 'beki da' instead of 'hazu da'?",
          audio_cue: "Puzzled student question"
        },
        {
          speaker: "ラヒム",
          speaker_role: "N3 Candidate",
          line_ja: "『はずだ』は客観的[きゃっかんてき]な予定[よてい]や予想[よそう]に使[つか]うよ。でも約束[やくそく]を守[まも]るのは人[ひと]としての当然[とうぜん]の道徳的義務[どうとくてきぎむ]だから、『べきだ』が正解[せいかい]なんだ。",
          line_bn: "'হাজুদা' ব্যবহার করা হয় বস্তুনিষ্ঠ সম্ভাবনা বা হিসেবের ক্ষেত্রে। কিন্তু প্রতিশ্রুতি রক্ষা করা একজন মানুষের স্বাভাবিক নৈতিক কর্তব্য, তাই 'বেকীদা'ই এখানে খাঁটি সঠিক উত্তর।",
          line_en: "'Hazu da' is used for objective expectations or schedules. But keeping a promise is an obvious moral duty as a human, which is why 'beki da' is the correct answer.",
          audio_cue: "Crystal clear pedagogical explanation"
        },
        {
          speaker: "学習者A",
          speaker_role: "N3 Student",
          line_ja: "なるほど！道徳[どうとく]やルールは『べきだ』なんだね。すっきりした！",
          line_bn: "তাই তো! নৈতিকতা বা সামাজিক নিয়মে 'বেকীদা' বসে। পুরো খটকা দূর হয়ে গেল!",
          line_en: "I see! Morals and rules call for 'beki da'. That cleared up everything!",
          audio_cue: "Relieved smile"
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "N3 ব্যাকরণ সনাক্তকরণের ৪ জাদু-ফর্মুলা",
      tip_bn: "১) わけだ = কার্যকারণ (কারণ এটা, তাই ওটা স্বাভাবিক)। ২) はずだ = তথ্যভিত্তিক অনুমান (সে গতকাল টিকিট কেটেছে, তাই আজ আসবেই)। ৩) べきだ = নীতিশাস্ত্র (বড়দের সম্মান করা উচিত)। ৪) ものだ = সার্বজনীন নিয়ম বা নস্টালজিয়া (মানুষ মরণশীল / ছোটবেলায় এমন করতাম)।",
      practical_action_bn: "পরীক্ষার প্রশ্নপত্রে '道徳 (নৈতিকতা)', 'ルール (নিয়ম)', '義務 (দায়িত্ব)' শব্দ দেখলে চোখ বন্ধ করে '〜べきだ' বিবেচনা করুন।"
    },
    typing_practice: [
      {
        prompt_ja: "約束は守るべきだ。",
        target_romaji: "yakusokuhamamorubekida.",
        meaning_bn: "প্রতিশ্রুতি রক্ষা করা নৈতিক কর্তব্য।"
      },
      {
        prompt_ja: "時間が経つのは早いものだ。",
        target_romaji: "jikangatatsunohahayaimonoda.",
        meaning_bn: "সময় আসলেই কত দ্রুত বয়ে যায়!"
      },
      {
        prompt_ja: "毎日少しずつ練習することだ。",
        target_romaji: "mainichisukoshizutsurenshuusurukotoda.",
        meaning_bn: "প্রতিদিন অল্প অল্প করে অনুশীলন করাই শ্রেয়।"
      }
    ],
    quizzes: [
      {
        question_ja: "「健康で長生きしたいなら、タバコをやめる＿＿＿＿。」に入る最も適切な助動詞は？",
        question_bn: "সুস্থভাবে দীর্ঘায়ু হতে চাইলে ধূমপান ত্যাগ করাই সবচেয়ে ভালো উপায়। শূন্যস্থানে কী বসবে?",
        options: [
          "ことだ",
          "ものだ",
          "はずだ",
          "わけだ"
        ],
        correct_index: 0,
        explanation_bn: "কাউকে কোনো লক্ষ্য অর্জনের জন্য সরাসরি সুপরামর্শ বা হিতোপদেশ দেওয়ার কাঠামো হলো '〜ことだ' (ধূমপান ত্যাগ করাই বুদ্ধিমানের কাজ)।"
      },
      {
        question_ja: "「あの真面目な田中さんが、無断で会社を休む＿＿＿＿。」に入る語彙は？",
        question_bn: "সেই দায়িত্বশীল ও ভদ্র তানাকা সাহেব অনুমতি ছাড়া অফিসে অনুপস্থিত থাকবেন এটা হতেই পারে না! শূন্যস্থানে কী বসবে?",
        options: [
          "わけがない",
          "べきではない",
          "ことではない",
          "ものではない"
        ],
        correct_index: 0,
        explanation_bn: "ব্যক্তির চরিত্র ও যুক্তির আলোকে কোনো কিছু ঘটা 'একেবারেই অসম্ভব' প্রকাশ করতে '〜わけがない' (বা はずがない) ব্যবহৃত হয়।"
      }
    ]
  },

  // --- LESSON 45: N3総合模試・試験攻略・N2への架け橋 ---
  {
    copyright: "© 2026 Nihomi AI™ (nihomi.com). All rights reserved.",
    brand: "Nihomi Japanese Learning Platform",
    lesson_metadata: {
      lesson_id: "N3-L45",
      lesson_number: 45,
      module_number: 9,
      module_name: "統合 (Mastery & N3 Capstone)",
      module_name_bn: "সার্বিক সংহতি ও সমাপনী কৌশল",
      title_ja: "JLPT N3総合模試[そうごうもし]とN2への架[か]け橋[はし]・完全制覇[かんぜんせいは]",
      title_en: "N3 Grand Capstone & Blueprint to JLPT N2",
      title_bn: "এন৩ সমন্বিত মক টেস্ট ও এন২ উত্তরণের পূর্ণাঙ্গ রোডম্যাপ",
      estimated_minutes: 30,
      difficulty: "Intermediate"
    },
    bengali_bridge: {
      explanation_bn: "অভিনন্দন! আপনি JLPT N3-এর ৪৫টি পাঠের চূড়ান্ত মাইলফলকে উপনীত হয়েছেন। এই সমাপনী পাঠে আমরা N3 পরীক্ষার ৩টি সেকশনের (ভাষাজ্ঞান, রিডিং, লিসেনিং) সময় বণ্টন, বিভ্রান্তিকর ট্র্যাপ এড়ানোর কৌশল এবং এখান থেকে সফলভাবে উচ্চতর ব্যবসায়িক স্তর JLPT N2-তে পদার্পণের সুনির্দিষ্ট ব্লুপ্রিন্ট চূড়ান্ত করব।",
      core_concept_bn: "পরীক্ষার হলের মানসিক দৃঢ়তা, নেতিবাচক ফাঁদ (〜ないこともない) দ্রুত চেনা এবং মধ্যম স্তর থেকে অ্যাডভান্সড স্তরে উত্তরণ।",
      real_world_context_bn: "JLPT পরীক্ষায় পাস করা কেবল একটি সার্টিফিকেট নয়, এটি জাপানে চাকরি, বিশ্ববিদ্যালয়ে ভর্তি বা স্থায়ী বসবাসের জন্য সবচেয়ে নির্ভরযোগ্য ভিত্তিপ্রস্তর।",
      key_takeaway_bn: "時間配分 (সময় বণ্টন); 見直し (রিভিউ); 消去法 (এলিমিনেশন পদ্ধতি); N2への継続的学習 (চলমান সাধনা)।"
    },
    vocabulary_scope: [
      {
        word_ja: "架[か]け橋[はし]",
        romaji: "kakehashi",
        meaning_bn: "সংযোগকারী সেতু / মেলবন্ধন",
        meaning_en: "bridge / intermediary",
        part_of_speech: "noun",
        example_ja: "日本[にほん]と世界[せかい]をつなぐ架[か]け橋[はし]になりたい。",
        example_bn: "আমি জাপান ও বিশ্বের মাঝে সংযোগকারী সেতু হতে চাই।",
        example_en: "I want to become a bridge connecting Japan and the world."
      },
      {
        word_ja: "制覇[せいは]する",
        romaji: "seiha suru",
        meaning_bn: "পূর্ণ বিজয় অর্জন / আয়ত্ত করা",
        meaning_en: "to conquer / dominate / master completely",
        part_of_speech: "verb",
        example_ja: "45回[よんじゅうごかい]のレッスンを制覇[せいは]してN3に挑[いど]む。",
        example_bn: "৪৫টি পাঠ পুরোপুরি আয়ত্ত করে এন৩ পরীক্ষার মুখোমুখি হচ্ছি।",
        example_en: "Conquering all 45 lessons, I challenge the JLPT N3."
      },
      {
        word_ja: "配分[はいぶん]",
        romaji: "haibun",
        meaning_bn: "বণ্টন / আনুপাতিক বিভাজন",
        meaning_en: "allocation / distribution",
        part_of_speech: "noun",
        example_ja: "時間[じかん]の配分[はいぶん]を間違[まちが]えないように注意[ちゅうい]しよう。",
        example_bn: "সময়ের সুষ্ঠু বণ্টন যেন ভুল না হয় সেদিকে বিশেষ সতর্ক থাকুন।",
        example_en: "Be careful not to mismanage your time allocation."
      },
      {
        word_ja: "消去法[しょうきょほう]",
        romaji: "shoukyohou",
        meaning_bn: "এলিমিনেশন পদ্ধতি / ভুল অপশন বাদ দিয়ে সঠিকটি নির্বাচন",
        meaning_en: "process of elimination",
        part_of_speech: "noun",
        example_ja: "迷[まよ]った時[とき]は消去法[しょうきょほう]で確実[かくじつ]に絞[しぼ]り込[こ]む。",
        example_bn: "সংশয় তৈরি হলে এলিমিনেশন পদ্ধতিতে ভুলগুলো কেটে নিশ্চিত উত্তরে পৌঁছান।",
        example_en: "When in doubt, narrow down choices reliably through the process of elimination."
      },
      {
        word_ja: "達成感[たっせいかん]",
        romaji: "tasseikan",
        meaning_bn: "সাফল্যের তৃপ্তি / লক্ষ্য অর্জনের অনুভূতি",
        meaning_en: "sense of achievement / accomplishment",
        part_of_speech: "noun",
        example_ja: "全[すべ]ての課題[かだい]を終[お]えた時[とき]、大[おお]きな達成感[たっせいかん]を味[あじ]わった。",
        example_bn: "সবগুলো এসাইনমেন্ট শেষ করার পর এক অসাধারণ সাফল্যের তৃপ্তি অনুভব করলাম।",
        example_en: "When I finished all the assignments, I experienced a great sense of accomplishment."
      }
    ],
    kanji_scope: [
      {
        kanji: "覇",
        onyomi: "ハ",
        kunyomi: "は・する",
        meaning_bn: "শ্রেষ্ঠত্ব / বিজয়",
        stroke_count: 19,
        radical: "西",
        stroke_order_svg: "",
        mnemonics_bn: "মেঘের আড়ালে চাঁদ ও সূর্যের ঔজ্জ্বল্য অতিক্রম করে একক প্রাধান্য বা শ্রেষ্ঠত্ব অর্জন = 覇。 ",
        practical_examples: [
          { word_ja: "制覇[せいは]", reading_ja: "せいは", meaning_bn: "চূড়ান্ত বিজয় / জয়" },
          { word_ja: "連覇[れんぱ]", reading_ja: "れんぱ", meaning_bn: "টানা শিরোপা জয়" }
        ]
      },
      {
        kanji: "架",
        onyomi: "カ",
        kunyomi: "か・ける, か・かる",
        meaning_bn: "সেতু নির্মাণ / স্থাপন",
        stroke_count: 9,
        radical: "木",
        stroke_order_svg: "",
        mnemonics_bn: "কাঠের খুঁটি (木) দিয়ে নদী বা খাদের ওপর সংযোগ স্থাপন করা = 架。 ",
        practical_examples: [
          { word_ja: "架け橋[かけはし]", reading_ja: "かけはし", meaning_bn: "সংযোগকারী সাঁকো" },
          { word_ja: "高架[こうか]", reading_ja: "こうか", meaning_bn: "উড়াল সেতু / এলিভেটেড স্ট্রাকচার" }
        ]
      }
    ],
    grammar_points: [
      {
        rule_id: "N3-G45",
        pattern_ja: "〜にほかならない",
        pattern_en: "Nothing other than / none other than (Ultimate certainty)",
        pattern_bn: "অমুক ব্যতীত অন্য কিছু নয় / নিশ্চিতভাবেই এটাই একমাত্র কারণ (~にほかならない)",
        formation_formula: "名詞 + にほかならない (普通形 + からにほかならない)",
        nuance_explanation_bn: "কোনো বড় সাফল্য, পরিণতি বা সত্যের মূল কারণকে ১০০% জোরালোভাবে নির্দিষ্ট করতে '〜にほかならない' ব্যবহৃত হয়। যেমন: আপনার এই এন৩ কোর্স সফলভাবে সমাপ্ত করা আপনার অবিচল পরিশ্রমেরই ফল, অন্য কিছু নয়।",
        examples: [
          {
            sentence_ja: "N3全[ぜん]45レッスンを完走[かんそう]できたのは、あなたの日々[ひび]の努力[どりょく]の成果[せいか]にほかならない。",
            sentence_bn: "এন৩-এর পুরো ৪৫টি পাঠ যে আপনি সমাপ্ত করতে পেরেছেন, তা আপনার প্রতিদিনের অবিরাম পরিশ্রমের সুফল ব্যতীত আর কিছুই নয়।",
            sentence_en: "Being able to complete all 45 lessons of N3 is nothing other than the fruit of your daily diligent efforts."
          },
          {
            sentence_ja: "彼[かれ]が合格[ごうかく]したのは、最後[さいご]まであきらめなかったからにほかならない。",
            sentence_bn: "সে যে উত্তীর্ণ হয়েছে, তার একমাত্র কারণ সে শেষ মুহূর্ত পর্যন্ত হার মানেনি।",
            sentence_en: "His passing the exam is none other than because he never gave up until the very end."
          },
          {
            sentence_ja: "健康[けんこう]こそが人生[じんせい]の最良[さいりょう]の財産[ざいさん]にほかならない。",
            sentence_bn: "সুস্বাস্থ্যই মানুষের জীবনের সর্বোৎকৃষ্ট সম্পদ ছাড়া আর কিছুই নয়।",
            sentence_en: "Health is truly nothing other than the greatest asset in life."
          }
        ],
        common_pitfalls: "এটি খুব জোরালো ও আনুষ্ঠানিক লিখিত রূপ। সাধারণ দৈনন্দিন হালকা আলাপে এর বদলে '〜にすぎない' বা '〜のおかげだ' ব্যবহৃত হয়।"
      }
    ],
    dialogue_scenario: {
      title_ja: "N3完走[かんそう]と次[つぎ]なる挑戦[ちょうせん]",
      title_en: "N3 Completion & The Next Frontier",
      context_bn: "নিহোমি প্ল্যাটফর্মে এন৩ কারিকুলাম সফলভাবে শেষ করার পর মেন্টর ও শিক্ষার্থীর সমাপনী মতবিনিময়।",
      lines: [
        {
          speaker: "先生[せんせい]",
          speaker_role: "Nihomi Master Sensei",
          line_ja: "ラヒムさん、全[ぜん]45レッスン達成[たっせい]、本当[ほんとう]におめでとうございます！",
          line_bn: "রাহিম সাহেব, পুরো ৪৫টি পাঠের লক্ষ্য সফলভাবে অর্জনের জন্য আপনাকে আন্তরিক অভিনন্দন!",
          line_en: "Rahim, congratulations from the bottom of my heart on completing all 45 lessons!",
          audio_cue: "Inspiring celebratory tone"
        },
        {
          speaker: "ラヒム",
          speaker_role: "N3 Master Candidate",
          line_ja: "先生[せんせい]、ありがとうございました！文法[ぶんぽう]も読解[どっかい]も、以前[いぜん]よりはるかに自信[じしん]を持[も]って読[よ]めるようになりました。",
          line_bn: "শিক্ষক, আপনাকে অজস্র ধন্যবাদ! ব্যাকরণ ও দীর্ঘ পাঠ—উভয় ক্ষেত্রেই আগের চেয়ে অনেক বেশি আত্মবিশ্বাসের সাথে অর্থ অনুধাবন করতে পারছি।",
          line_en: "Sensei, thank you very much! In both grammar and reading comprehension, I can now read with far greater confidence than before.",
          audio_cue: "Bright enthusiastic voice"
        },
        {
          speaker: "先生[せんせい]",
          speaker_role: "Nihomi Master Sensei",
          line_ja: "素晴らしいですね。この勢[いきお]いのまま、次[つぎ]のステージであるN2の扉[とびら]を開[ひら]きましょう！",
          line_bn: "চমৎকার অগ্রগতি। এই দুর্নিবার উদ্দীপনা বুকে ধারণ করে চলুন পরবর্তী স্তর এন২-এর তোরণ উন্মোচন করি!",
          line_en: "Wonderful progress. Keeping this momentum, let us open the gates to the next stage: JLPT N2!",
          audio_cue: "Visionary forward-looking encouragement"
        }
      ]
    },
    japan_survival_tip: {
      title_bn: "JLPT পরীক্ষার আগের রাতের ৩টি অপরিহার্য প্রস্তুতি",
      tip_bn: "১) নতুন কোনো জটিল টপিক পড়বেন না; কেবল নিজের রিভিশন নোট ও ভুল করা কুইজগুলো এক নজর দেখে নিন। ২) অ্যাডমিট কার্ড (受験票), HB পেন্সিল (২-৩টি), ভালো শার্পনার ও নরম ইরেজার ব্যাগে গুছিয়ে রাখুন। ৩) অন্তত ৭-৮ ঘণ্টা নির্ভেজাল ঘুম নিশ্চিত করুন, কারণ মস্তিষ্ক সতেজ না থাকলে লিসেনিংয়ে রিফ্লেক্স কমে যায়।",
      practical_action_bn: "পরীক্ষার দিন সকালে হালকা নাস্তা করুন এবং মিষ্টি ডার্ক চকলেট বা গ্লুকোজ সাথে রাখুন যা মস্তিষ্কের কর্মক্ষমতা তুঙ্গে রাখবে।"
    },
    typing_practice: [
      {
        prompt_ja: "全45レッスンを完走した。",
        target_romaji: "zenyonjuugoressunwokansoushita.",
        meaning_bn: "পুরো ৪৫টি পাঠ সফলভাবে সমাপ্ত করলাম।"
      },
      {
        prompt_ja: "努力の成果にほかならない。",
        target_romaji: "doryokunoseikanihokanaranai.",
        meaning_bn: "পরিশ্রমের সুফল ছাড়া আর কিছুই নয়।"
      },
      {
        prompt_ja: "次のステージN2に挑戦しよう。",
        target_romaji: "tsuginosute-jienu-tsu-nichousenshiyou.",
        meaning_bn: "পরবর্তী পর্যায় এন২ তে পদার্পণ করি।"
      }
    ],
    quizzes: [
      {
        question_ja: "「今回のプロジェクトが成功したのは、チーム全員の協力のたまもの＿＿＿＿。」に入る最も適切な表現は？",
        question_bn: "এবারের প্রকল্প যে সফল হলো, তা পুরো দলের সকলের সহযোগিতার সুফল ______। সবচেয়ে বলিষ্ঠ অভিব্যক্তি কোনটি?",
        options: [
          "にほかならない",
          "にすぎない",
          "に限らない",
          "に関わらない",
          ],
        correct_index: 0,
        explanation_bn: "কোনো অনন্য সাফল্যের মূল কারণকে চূড়ান্ত সত্য হিসেবে সুনির্দিষ্ট করতে '〜にほかならない (ব্যতীত অন্য কিছু নয়)' ব্যবহৃত হয়।"
      },
      {
        question_ja: "JLPT N3試験本番で最も重要とされる戦略はどれですか。",
        question_bn: "JLPT N3 পরীক্ষার মূল হলে সবচেয়ে গুরুত্বপূর্ণ কৌশল হিসেবে কোনটি স্বীকৃত?",
        options: [
          "分からない難問に時間をかけすぎず、時間配分を守って全問マークする",
          "分からない問題が出たら解けるまで10分以上考え続ける",
          "読解問題から始めて言語知識は最後に適当に解く",
          "リスニングのメモを取らずに目を閉じて聴くだけにする"
        ],
        correct_index: 0,
        explanation_bn: "কঠিন প্রশ্নে অযথা আটকে না থেকে নির্দিষ্ট সময় বণ্টন (Time Management) বজায় রেখে প্রতিটি প্রশ্নের উত্তর প্রদান করাই পাস করার শ্রেষ্ঠ কৌশল।"
      }
    ]
  }
];
