// src/components/canvas3d/learning/SpatialNPCRegistry.ts
// NIHOMI WORLD™ — MASTER REGISTRY OF SPATIAL JAPANESE NPCS
// NPCs living inside the 3D world with defined roles, Japanese levels (N5-N1), and learning objectives.

export interface DialogueChoice {
  id: string;
  textJa: string;
  textRomaji: string;
  textEn: string;
  textBn: string;
  isCorrectKeigo: boolean;
  nextNodeId?: string;
  explanationEn: string;
  explanationBn: string;
}

export interface DialogueNode {
  id: string;
  speakerName: string;
  textJa: string;
  textRomaji: string;
  textEn: string;
  textBn: string;
  choices: DialogueChoice[];
  isFinalStep?: boolean;
}

export interface SpatialNPC {
  id: string;
  nameJa: string;
  nameRomaji: string;
  nameEn: string;
  nameBn: string;
  roleJa: string;
  roleEn: string;
  roleBn: string;
  locationNodeId: string;
  locationNameEn: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  avatarEmoji: string;
  personality: string;
  learningFocus: string;
  dialogueRoot: DialogueNode;
}

export const SPATIAL_NPC_REGISTRY: Record<string, SpatialNPC> = {
  // 1. OFFICER TAKAHASHI (NARITA AIRPORT IMMIGRATION)
  npc_officer_takahashi: {
    id: 'npc_officer_takahashi',
    nameJa: '高橋 健一',
    nameRomaji: 'Takahashi Ken\'ichi',
    nameEn: 'Officer Takahashi (Immigration Inspector)',
    nameBn: 'অফিসার তাকাহাশি (অভিবাসন পরিদর্শক)',
    roleJa: '出入国審査官',
    roleEn: 'Border Control & Immigration Officer',
    roleBn: 'অভিবাসন কর্মকর্তা',
    locationNodeId: 'node_narita_airport_t1',
    locationNameEn: 'Narita International Airport Terminal 1',
    jlptLevel: 'N5',
    avatarEmoji: '🛂',
    personality: 'Professional, calm, observant, enforces Japanese legal requirements with clear standard Tokyo pronunciation.',
    learningFocus: 'Entry purpose, duration declaration, address explanation, and passport presentation etiquette.',
    dialogueRoot: {
      id: 'step_root',
      speakerName: 'Officer Takahashi (高橋審査官)',
      textJa: 'パスポートと在留資格証明書をご提示いただけますか？',
      textRomaji: 'Pasupooto to zairyuu shikaku shoumeisho o goteiji itadakemasu ka?',
      textEn: 'Could you please present your passport and Certificate of Eligibility?',
      textBn: 'আপনার পাসপোর্ট এবং যোগ্যতার সনদ দেখাতে পারবেন কি?',
      choices: [
        {
          id: 'c_present_proper',
          textJa: 'はい、こちらです。よろしくお願いいたします。',
          textRomaji: 'Hai, kochira desu. Yoroshiku onegai itashimasu.',
          textEn: 'Yes, here they are. Thank you for your assistance. (Polite & Standard)',
          textBn: 'হ্যাঁ, এই যে। ধন্যবাদ।',
          isCorrectKeigo: true,
          explanationEn: 'Polite presentation phrase using "kochira desu" (humble demonstrative) and "yoroshiku onegai itashimasu".',
          explanationBn: 'নম্রভাবে দলিল উপস্থাপনের চমৎকার জাপানি রূপ।'
        },
        {
          id: 'c_present_blunt',
          textJa: 'これです。どうぞ。',
          textRomaji: 'Kore desu. Douzo.',
          textEn: 'This is it. Here. (Too casual for official border control)',
          textBn: 'এইটা। নেন। (অফিসিয়াল স্থানে অতিরিক্ত ক্যাজুয়াল)',
          isCorrectKeigo: false,
          explanationEn: '"Kore" is too blunt when handing documents to government officials. Use "kochira".',
          explanationBn: 'অফিসারদের সামনে "কুরে" ব্যবহার না করে "কোচিরা" বলা সৌজন্যমূলক।'
        }
      ]
    }
  },

  // 2. STORE MANAGER TANAKA (SHIBUYA 7-ELEVEN)
  npc_tanaka_manager: {
    id: 'npc_tanaka_manager',
    nameJa: '田中 浩',
    nameRomaji: 'Tanaka Hiroshi',
    nameEn: 'Store Manager Tanaka (Tencho)',
    nameBn: 'স্টোর ম্যানেজার তানাকা',
    roleJa: 'コンビニ店長',
    roleEn: '7-Eleven Store Manager & Shift Supervisor',
    roleBn: 'কনভেনিয়েন্স স্টোর ম্যানেজার',
    locationNodeId: 'node_shibuya_scramble',
    locationNameEn: '7-Eleven Shibuya Dogenzaka',
    jlptLevel: 'N5',
    avatarEmoji: '🏪',
    personality: 'Energetic, warm, patient teacher of workplace Keigo and customer service norms.',
    learningFocus: 'Retail transactions, plastic bags, heated bentos, receipt inquiries, and part-time job interview phrasing.',
    dialogueRoot: {
      id: 'step_root',
      speakerName: 'Store Manager Tanaka (店長 田中)',
      textJa: 'いらっしゃいませ！温めますか？レジ袋はご利用になりますか？',
      textRomaji: 'Irasshaimase! Atatame masu ka? Reji-bukuro wa goriyou ni narimasu ka?',
      textEn: 'Welcome! Would you like your meal heated? Will you be using a plastic shopping bag?',
      textBn: 'স্বাগতম! খাবার কি গরম করে দেব? প্লাস্টিক ব্যাগ লাগবে কি?',
      choices: [
        {
          id: 'c_conbini_bag_decline',
          textJa: '袋は結構です。そのままでお願いします。',
          textRomaji: 'Fukuro wa kekkou desu. Sono mama de onegai shimasu.',
          textEn: 'No bag needed, thank you. Just as it is, please. (Perfect Japanese)',
          textBn: 'ব্যাগ লাগবে না। এভাবেই দিন।',
          isCorrectKeigo: true,
          explanationEn: '"Kekkou desu" is the polished, polite way to decline in customer service.',
          explanationBn: 'ব্যাগ বা অতিরিক্ত সেবা বিনম্রভাবে প্রত্যাখ্যান করতে "কেক্কো দেসু" ব্যবহার হয়।'
        },
        {
          id: 'c_baito_inquiry',
          textJa: 'アルバイトの募集はされていますでしょうか？',
          textRomaji: 'Arubaito no boshuu wa sarete imasu deshou ka?',
          textEn: 'Are you currently accepting applications for part-time employment? (Master Keigo)',
          textBn: 'আপনাদের এখানে কি খণ্ডকালীন চাকরির লোক নেওয়া হচ্ছে?',
          isCorrectKeigo: true,
          explanationEn: 'The gold standard phrase for inquiring about student part-time jobs (baito).',
          explanationBn: 'জাপানে খণ্ডকালীন চাকরির খোঁজ নেওয়ার জন্য সর্বোচ্চ মার্জিত কেইগো।'
        }
      ]
    }
  },

  // 3. STATION MASTER SATO (JR SHIBUYA STATION)
  npc_station_master_sato: {
    id: 'npc_station_master_sato',
    nameJa: '佐藤 健太郎',
    nameRomaji: 'Satou Kentarou',
    nameEn: 'Station Master Sato',
    nameBn: 'স্টেশন মাস্টার সাতো',
    roleJa: 'JR 渋谷駅 駅係員',
    roleEn: 'JR East Station Attendant',
    roleBn: 'জেআর স্টেশন মাস্টার',
    locationNodeId: 'node_shibuya_scramble',
    locationNameEn: 'JR Shibuya Station Hachiko Concourse',
    jlptLevel: 'N5',
    avatarEmoji: '🚉',
    personality: 'Crisp, attentive, knowledgeable about all Tokyo rail lines and IC card ticketing.',
    learningFocus: 'Platform directions, transfer phrasing, ticket adjustments, and lost item reporting.',
    dialogueRoot: {
      id: 'step_root',
      speakerName: 'Station Attendant Sato (駅係員 佐藤)',
      textJa: 'JR東日本です。どちらのホームをお探しですか？',
      textRomaji: 'JR Higashi-Nihon desu. Dochira no houmu o osagashi desu ka?',
      textEn: 'JR East information. Which platform are you looking for?',
      textBn: 'জেআর ইস্ট তথ্য কেন্দ্র। আপনি কোন প্ল্যাটফর্মটি খুঁজছেন?',
      choices: [
        {
          id: 'c_yamanote_inquiry',
          textJa: 'すみません、山手線の新宿方面は何番線でしょうか？',
          textRomaji: 'Sumimasen, Yamanote-sen no Shinjuku houmen wa nan-bansen deshou ka?',
          textEn: 'Excuse me, which track is the Yamanote Line heading toward Shinjuku? (Polite)',
          textBn: 'মাফ করবেন, শিনজুকুগামী ইয়ামানোট লাইনের ট্রেন কত নম্বর ট্র্যাকে আসবে?',
          isCorrectKeigo: true,
          explanationEn: 'Essential station inquiry phrase utilizing "houmen" (direction) and "nan-bansen" (track number).',
          explanationBn: 'জাপানি ট্রেনের দিক নির্দেশনার মূল বাক্য "হোউমেন" ও "নান-বানসেন"।'
        }
      ]
    }
  },

  // 4. WARD CLERK SUZUKI (SHIBUYA CITY HALL)
  npc_clerk_suzuki: {
    id: 'npc_clerk_suzuki',
    nameJa: '鈴木 美咲',
    nameRomaji: 'Suzuki Misaki',
    nameEn: 'Ward Clerk Suzuki',
    nameBn: 'সিটি হল কর্মকর্তা সুজুকি',
    roleJa: '区役所 住民票窓口担当',
    roleEn: 'City Hall Resident Registration Officer',
    roleBn: 'নাগরিক নিবন্ধন কর্মকর্তা',
    locationNodeId: 'node_shibuya_scramble',
    locationNameEn: 'Shibuya City Hall (区役所)',
    jlptLevel: 'N4',
    avatarEmoji: '🏛️',
    personality: 'Organized, thorough, assists newly arrived foreign residents with official registration.',
    learningFocus: 'Resident certificate (住民票 Juminhyo), moving-in notification (転入届 Tennyu-todoke), My Number card.',
    dialogueRoot: {
      id: 'step_root',
      speakerName: 'Clerk Suzuki (窓口担当 鈴木)',
      textJa: 'こんにちは。転入届の提出と住民票の発行でしょうか？',
      textRomaji: 'Konnichiwa. Tennyuu-todoke no teishutsu to juuminhyou no hakkou deshou ka?',
      textEn: 'Hello. Are you here to submit a moving-in notification and request a Certificate of Residence?',
      textBn: 'হ্যালো। আপনি কি নতুন ঠিকানায় প্রবেশের আবেদন ও বাসিন্দা সনদ নিতে এসেছেন?',
      choices: [
        {
          id: 'c_juminhyo_apply',
          textJa: 'はい！渋谷区に引っ越してきましたので、住民票の手続きをお願いします。',
          textRomaji: 'Hai! Shibuya-ku ni hikkoshite kimashita node, juuminhyou no tetsuzuki o onegai shimasu.',
          textEn: 'Yes! I moved into Shibuya Ward, so I would like to complete my resident registration.',
          textBn: 'হ্যাঁ! আমি শিবুয়াতে উঠেছি, বাসিন্দা নিবন্ধনের কাজটি করে দিন দয়া করে।',
          isCorrectKeigo: true,
          explanationEn: 'Flawless civic administrative Japanese for foreigners establishing official residency.',
          explanationBn: 'জাপানে বাসা বদলের ১৪ দিনের মধ্যে সিটি হলে এই নিবন্ধন করা বাধ্যতামূলক।'
        }
      ]
    }
  },

  // 5. BANK REPRESENTATIVE YAMADA (YUCHO BANK)
  npc_bank_yamada: {
    id: 'npc_bank_yamada',
    nameJa: '山田 裕二',
    nameRomaji: 'Yamada Yuuji',
    nameEn: 'Bank Representative Yamada',
    nameBn: 'ব্যাংক প্রতিনিধি ইয়ামাদা',
    roleJa: 'ゆうちょ銀行 口座開設係',
    roleEn: 'Japan Post Bank Account Specialist',
    roleBn: 'ব্যাংক অ্যাকাউন্ট বিশেষজ্ঞ',
    locationNodeId: 'node_shibuya_scramble',
    locationNameEn: 'Yucho Bank Shibuya Branch',
    jlptLevel: 'N4',
    avatarEmoji: '🏦',
    personality: 'Polite, meticulous, guides students through personal seal (印鑑 inkan) and bankbook setup.',
    learningFocus: 'Bank account opening (口座開設 Kouza kaisetsu), cash card PIN setup (暗証番号 Anshou bangou).',
    dialogueRoot: {
      id: 'step_root',
      speakerName: 'Bank Specialist Yamada (山田)',
      textJa: '口座開設ですね。在留カードとお届出印（またはサイン）をお持ちですか？',
      textRomaji: 'Kouza kaisetsu desu ne. Zairyuu kaado to otodokede-in (matawa sain) o omochi desu ka?',
      textEn: 'Opening a bank account. Do you have your Residence Card and registered seal (or signature)?',
      textBn: 'ব্যাংক অ্যাকাউন্ট খোলা। সাথে কি রেসিডেন্স কার্ড এবং সিল বা স্বাক্ষর এনেছেন?',
      choices: [
        {
          id: 'c_bank_docs_ready',
          textJa: 'はい、在留カードと印鑑を持参いたしました。新規口座の開設をお願いできますでしょうか？',
          textRomaji: 'Hai, zairyuu kaado to inkan o jisan itashimashita. Shinki kouza no kaisetsu o onegai dekimasu deshou ka?',
          textEn: 'Yes, I brought my Residence Card and personal seal. May I request to open a new account?',
          textBn: 'হ্যাঁ, রেসিডেন্স কার্ড এবং সিল সাথে এনেছি। নতুন অ্যাকাউন্ট খোলার আবেদন করতে চাই।',
          isCorrectKeigo: true,
          explanationEn: '"Jisan itashimashita" is humble Keigo (謙譲語) for bringing documents to official institutions.',
          explanationBn: 'ব্যাংক বা প্রতিষ্ঠানে কোনো প্রয়োজনীয় কাগজ সঙ্গে আনার জন্য মার্জিত বিনম্র ভাষা।'
        }
      ]
    }
  }
};
