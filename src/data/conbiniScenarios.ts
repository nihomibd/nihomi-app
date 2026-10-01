// src/data/conbiniScenarios.ts
import { ConbiniPosProduct, ConbiniCustomerOrder } from '../types';

export interface ConbiniScenarioItem extends ConbiniCustomerOrder {
  roleTitleJa: string;
  roleTitleBn: string;
  roleTitleEn: string;
  locationContextJa: string;
  patienceTimeSeconds: number;
  avatarEmoji: string;
  avatarBgColor: string;
  needsAgeVerification?: boolean;

  dialogueState: {
    greeting: {
      cashierPromptJa: string;
      cashierPromptRomaji: string;
      cashierPromptBn: string;
      customerResponseJa: string;
      customerResponseRomaji: string;
      customerResponseBn: string;
      nuanceBn: string;
      nuanceEn: string;
    };
    pointCard: {
      cashierPromptJa: string;
      cashierPromptRomaji: string;
      cashierPromptBn: string;
      hasCard: boolean;
      cardType?: string;
      customerResponseJa: string;
      customerResponseRomaji: string;
      customerResponseBn: string;
      nuanceBn: string;
      nuanceEn: string;
    };
    bentoWarming: {
      isApplicable: boolean;
      cashierPromptJa: string;
      cashierPromptRomaji: string;
      cashierPromptBn: string;
      wantsHeating: boolean;
      heatingSeconds: number;
      customerResponseJa: string;
      customerResponseRomaji: string;
      customerResponseBn: string;
      nuanceBn: string;
      nuanceEn: string;
    };
    bagSelection: {
      cashierPromptJa: string;
      cashierPromptRomaji: string;
      cashierPromptBn: string;
      needsBag: boolean;
      bagSize: 'small' | 'large' | 'none';
      bagFeeYen: number;
      customerResponseJa: string;
      customerResponseRomaji: string;
      customerResponseBn: string;
      nuanceBn: string;
      nuanceEn: string;
    };
    utensils: {
      cashierPromptJa: string;
      cashierPromptRomaji: string;
      cashierPromptBn: string;
      needsChopsticks: boolean;
      needsSpoon: boolean;
      customerResponseJa: string;
      customerResponseRomaji: string;
      customerResponseBn: string;
      nuanceBn: string;
      nuanceEn: string;
    };
    payment: {
      preferredMethod: 'cash' | 'suica' | 'paypay' | 'credit';
      customerAnnounceJa: string;
      customerAnnounceRomaji: string;
      customerAnnounceBn: string;
      tenderedCashAmount?: number;
      nuanceBn: string;
      nuanceEn: string;
    };
    closing: {
      cashierPartingJa: string;
      cashierPartingRomaji: string;
      cashierPartingBn: string;
      customerReplyJa: string;
      customerReplyRomaji: string;
      customerReplyBn: string;
      nuanceBn: string;
      nuanceEn: string;
    };
  };

  workplaceProTip: {
    titleJa: string;
    titleBn: string;
    explanationBn: string;
    keigoRuleJa: string;
  };
}

export const CONBINI_SCENARIOS: ConbiniScenarioItem[] = [
  // 1. Tanaka Salaryman (PayPay + Bento Warming + d-Point)
  {
    id: 'sc-salaryman-tanaka',
    customerName: '田中 健一 (Tanaka Kenichi)',
    customerType: 'salaryman',
    roleTitleJa: '都内IT企業 営業課長 (38歳)',
    roleTitleBn: 'টোকিও আইটি সেলস এক্সিকিউটিভ (৩৮ বছর)',
    roleTitleEn: 'Tokyo IT Sales Manager (Age 38)',
    locationContextJa: 'セブン-イレブン 新宿西口店 (12:05 昼休み直後)',
    patienceTimeSeconds: 50,
    avatarEmoji: '👔',
    avatarBgColor: 'from-blue-600 to-indigo-900',
    customerSpeechJa: 'これ温めてください。袋は大丈夫です。PayPayで払います。',
    customerSpeechRomaji: 'Kore atatamete kudasai. Fukuro wa daijoubu desu. PayPay de haraimasu.',
    customerSpeechBn: 'এটা একটু গরম করে দিন। ব্যাগ লাগবে না। পেপে (PayPay) দিয়ে পেমেন্ট করবো।',
    items: [
      {
        id: 'prod-bento-karage',
        barcode: '4901234567890',
        nameJa: '特製から揚げ弁当',
        nameRomaji: 'Tokusei Karaage Bento',
        nameBn: 'স্পেশাল জাপানিজ ফ্রাইড চিকেন বেন্টো',
        priceYen: 580,
        category: 'bento',
        needsHeating: true,
        imageIcon: '🍱'
      },
      {
        id: 'prod-drink-tea',
        barcode: '4901234567891',
        nameJa: 'お〜いお茶 緑茶 500ml',
        nameRomaji: 'Oi Ocha Ryokucha 500ml',
        nameBn: 'গ্রিন টি ৫০০ মি.লি.',
        priceYen: 160,
        category: 'drink',
        needsHeating: false,
        imageIcon: '🍵'
      }
    ],
    hasPointCard: true,
    pointCardName: 'd-Point',
    needsBag: false,
    needsChopsticks: true,
    wantsBentoHeated: true,
    paymentMethod: 'paypay',
    dialogueState: {
      greeting: {
        cashierPromptJa: 'いらっしゃいませ！',
        cashierPromptRomaji: 'Irasshaimase!',
        cashierPromptBn: 'স্বাগতম!',
        customerResponseJa: 'どうも、お願いします。',
        customerResponseRomaji: 'Doumo, onegai shimasu.',
        customerResponseBn: 'নমস্কার, জিনিসগুলো দেখুন।',
        nuanceBn: 'কাস্টমার কাউন্টারে পৌঁছানোর সাথে সাথে উজ্জ্বল কণ্ঠে "Irasshaimase!" বলুন।',
        nuanceEn: 'Brightly greet the customer immediately as they step up to the register.'
      },
      pointCard: {
        cashierPromptJa: 'ポイントカードはお持ちですか？',
        cashierPromptRomaji: 'Pointo kaado wa omochi desu ka?',
        cashierPromptBn: 'আপনার কি কোনো পয়েন্ট কার্ড আছে?',
        hasCard: true,
        cardType: 'd-Point',
        customerResponseJa: 'はい、dポイントカードあります。バーコード画面出しますね。',
        customerResponseRomaji: 'Hai, dii pointo kaado arimasu. Baakoodo gamen dashimasu ne.',
        customerResponseBn: 'হ্যাঁ, আমার d-পয়েন্ট কার্ড আছে। মোবাইলের বারকোড দেখাচ্ছি।',
        nuanceBn: 'জাপানে স্ক্যান করার আগে বা সময় পয়েন্ট কার্ড জিজ্ঞাসা করা বাধ্যতামূলক।',
        nuanceEn: 'Always ask for the loyalty card before scanning payment method.'
      },
      bentoWarming: {
        isApplicable: true,
        cashierPromptJa: 'お弁当温めますか？',
        cashierPromptRomaji: 'Obentou atatame masu ka?',
        cashierPromptBn: 'বেন্টো কি ওভেনে গরম করে দিতে হবে?',
        wantsHeating: true,
        heatingSeconds: 20,
        customerResponseJa: 'はい、温めてください。',
        customerResponseRomaji: 'Hai, atatamete kudasai.',
        customerResponseBn: 'হ্যাঁ, দয়া করে গরম করে দিন।',
        nuanceBn: 'বেন্টো গরম হতে ২০ সেকেন্ড লাগে। এই ফাঁকে বাকি পণ্য স্ক্যান বা পেমেন্ট এগিয়ে নেওয়া যায়।',
        nuanceEn: 'Commercial conbini microwaves run at 1500W and take 15-20s.'
      },
      bagSelection: {
        cashierPromptJa: 'レジ袋はご利用ですか？',
        cashierPromptRomaji: 'Rejibukuro wa goriyou desu ka?',
        cashierPromptBn: 'প্লাস্টিক ব্যাগ কি প্রয়োজন হবে?',
        needsBag: false,
        bagSize: 'none',
        bagFeeYen: 0,
        customerResponseJa: '袋は大丈夫です、このまま持って行きます。',
        customerResponseRomaji: 'Fukuro wa daijoubu desu, kono mama motte ikimasu.',
        customerResponseBn: 'ব্যাগ লাগবে না, এভাবেই নিয়ে যাব।',
        nuanceBn: 'জাপানে ২০২০ সাল থেকে ব্যাগ পেইড (৩-৫ ইয়েন)। "大丈夫です" মানে লাগবে না। টেপ (Tape) সেটে দিন।',
        nuanceEn: '"Daijoubu desu" means "No thanks, I don\'t need a bag." Place a conbini tape seal on the item.'
      },
      utensils: {
        cashierPromptJa: 'お箸はお付けしますか？',
        cashierPromptRomaji: 'Ohashi wa otsuke shimasu ka?',
        cashierPromptBn: 'চপস্টিক কি দিতে হবে?',
        needsChopsticks: true,
        needsSpoon: false,
        customerResponseJa: 'お箸一膳お願いします。',
        customerResponseRomaji: 'Ohashi ichizen onegai shimasu.',
        customerResponseBn: 'দয়া করে এক জোড়া চপস্টিক দিন।',
        nuanceBn: 'বেন্টোর সাথে "一膳 (Ichizen)" চপস্টিক সুন্দরভাবে বেন্টোর পাশে রাখুন।',
        nuanceEn: 'Utensils counter: "Ichizen" is the counter for one pair of chopsticks.'
      },
      payment: {
        preferredMethod: 'paypay',
        customerAnnounceJa: 'PayPayで払います。画面スキャンお願いします。',
        customerAnnounceRomaji: 'PayPay de haraimasu. Gamen sukyan onegai shimasu.',
        customerAnnounceBn: 'পেপে (PayPay) দিয়ে পেমেন্ট করব। ফোনের স্ক্রিন স্ক্যান করুন।',
        nuanceBn: 'রেজিস্টারে "コード決済 (Code Payment)" বাটন প্রেস করে গ্রাহকের ফোনের বারকোড স্ক্যান করুন।',
        nuanceEn: 'Press Code Payment on the POS screen, then trigger the hand scanner.'
      },
      closing: {
        cashierPartingJa: 'ありがとうございました！またお越しくださいませ！',
        cashierPartingRomaji: 'Arigatou gozaimashita! Mata okoshi kudasaimase!',
        cashierPartingBn: 'অনেক ধন্যবাদ! আবার আসবেন!',
        customerReplyJa: 'どうも、ごちそうさま！',
        customerReplyRomaji: 'Doumo, gochisousama!',
        customerReplyBn: 'ধন্যবাদ!',
        nuanceBn: 'বিদায়ী সম্ভাষণ অবশ্যই পাস্ট টেন্সে "ありがとうございました" হবে।',
        nuanceEn: 'Always use past tense "Arigatou gozaimashita" once transaction is completed.'
      }
    },
    workplaceProTip: {
      titleJa: '電子マネー・コード決済の接客所作',
      titleBn: 'পেপে ও কোড পেমেন্ট হ্যান্ডলিং কৌশল',
      explanationBn: 'কাস্টমার যখন "PayPayで" বলবে, তখন হ্যান্ড স্ক্যানার হাতে নিয়ে স্ক্রিনের দিকে সাবধানে তাক করুন যেন ফোনে ধাক্কা না লাগে। স্ক্যানারের শব্দ "ピピッ" হওয়ার পর "PayPay!" আওয়াজ শোনা যাবে।',
      keigoRuleJa: '「PayPayでございますね。バーコードを読み取ります。」'
    }
  },

  // 2. Kenji College Student (Suica + Hot Snack + Bag)
  {
    id: 'sc-student-kenji',
    customerName: '佐々木 健司 (Sasaki Kenji)',
    customerType: 'student',
    roleTitleJa: '早稲田大学 経済学部2年 (20歳)',
    roleTitleBn: 'ওয়াসেদা বিশ্ববিদ্যালয়ের ছাত্র (২০ বছর)',
    roleTitleEn: 'Waseda University Sophomore (Age 20)',
    locationContextJa: 'ローソン 高田馬場駅前店 (08:45 通学ラッシュ)',
    patienceTimeSeconds: 45,
    avatarEmoji: '🎒',
    avatarBgColor: 'from-amber-600 to-orange-800',
    customerSpeechJa: 'おにぎりとチキン、あとレジ袋小を1枚お願いします。Suicaでタッチします。',
    customerSpeechRomaji: 'Onigiri to chikin, ato rejibukuro shou o ichimai onegai shimasu. Suica de tacchi shimasu.',
    customerSpeechBn: 'ওনিগিরি এবং চিকেন দিন, সাথে ১টি ছোট প্লাস্টিক ব্যাগ দিন। সুইকা কার্ড দিয়ে পে করবো।',
    items: [
      {
        id: 'prod-onigiri-salmon',
        barcode: '4901234567892',
        nameJa: '手巻おにぎり 熟成紅鮭',
        nameRomaji: 'Temaki Onigiri Benisake',
        nameBn: 'স্যামন ফিশ ওনিগিরি',
        priceYen: 180,
        category: 'onigiri',
        needsHeating: false,
        imageIcon: '🍙'
      },
      {
        id: 'prod-hot-famichiki',
        barcode: '4901234567893',
        nameJa: 'からあげクン レッド (ホットスナック)',
        nameRomaji: 'Karaage-kun Red Hot Snack',
        nameBn: 'হট স্পাইসি ফ্রাইড চিকেন',
        priceYen: 240,
        category: 'hot_snack',
        needsHeating: false,
        imageIcon: '🍗'
      },
      {
        id: 'prod-drink-monster',
        barcode: '4901234567898',
        nameJa: 'モンスターエナジー 355ml',
        nameRomaji: 'Monster Energy 355ml',
        nameBn: 'মনস্টার এনার্জি ড্রিংক ৩৫৫ মি.লি.',
        priceYen: 230,
        category: 'drink',
        needsHeating: false,
        imageIcon: '⚡'
      }
    ],
    hasPointCard: false,
    needsBag: true,
    needsChopsticks: false,
    wantsBentoHeated: false,
    paymentMethod: 'suica',
    dialogueState: {
      greeting: {
        cashierPromptJa: 'いらっしゃいませ！',
        cashierPromptRomaji: 'Irasshaimase!',
        cashierPromptBn: 'স্বাগতম!',
        customerResponseJa: 'おはようございます、お願いします。',
        customerResponseRomaji: 'Ohayou gozaimasu, onegai shimasu.',
        customerResponseBn: 'শুভ সকাল, জিনিসগুলো নিন।',
        nuanceBn: 'সকালের শিফটে তরুণরা তাড়াহুড়োয় থাকে। দ্রুত বারকোড স্ক্যান প্রস্তুত রাখুন।',
        nuanceEn: 'Morning rush commuters prioritize fast barcode scanning.'
      },
      pointCard: {
        cashierPromptJa: 'ポイントカードはお持ちですか？',
        cashierPromptRomaji: 'Pointo kaado wa omochi desu ka?',
        cashierPromptBn: 'আপনার কি পয়েন্ট কার্ড আছে?',
        hasCard: false,
        customerResponseJa: 'あ、持ってないです。',
        customerResponseRomaji: 'A, mottenai desu.',
        customerResponseBn: 'আহ, নেই।',
        nuanceBn: 'কাস্টমার না বললে সময় নষ্ট না করে পরবর্তী ধাপে চলে যান।',
        nuanceEn: 'If customer says "Mottenai desu", proceed immediately to avoid delay.'
      },
      bentoWarming: {
        isApplicable: false,
        cashierPromptJa: 'おにぎり温めますか？',
        cashierPromptRomaji: 'Onigiri atatame masu ka?',
        cashierPromptBn: 'ওনিগিরি কি গরম করবেন?',
        wantsHeating: false,
        heatingSeconds: 0,
        customerResponseJa: 'そのままで大丈夫です！',
        customerResponseRomaji: 'Sono mama de daijoubu desu!',
        customerResponseBn: 'এভাবেই চলবে!',
        nuanceBn: 'ওনিগিরি সাধারণত গরম করতে হয় না, তবে কিছু গ্রাহক করতে চাইতে পারেন।',
        nuanceEn: 'Onigiri is usually eaten at room temperature unless requested.'
      },
      bagSelection: {
        cashierPromptJa: 'レジ袋はご利用ですか？5円になります。',
        cashierPromptRomaji: 'Rejibukuro wa goriyou desu ka? Go-en ni narimasu.',
        cashierPromptBn: 'প্লাস্টিক ব্যাগ কি লাগবে? ৫ ইয়েন যোগ হবে।',
        needsBag: true,
        bagSize: 'small',
        bagFeeYen: 5,
        customerResponseJa: 'はい、小さいの1枚お願いします。',
        customerResponseRomaji: 'Hai, chiisai no ichimai onegai shimasu.',
        customerResponseBn: 'হ্যাঁ, ছোট সাইজের ১টি ব্যাগ দিন।',
        nuanceBn: 'রেজিস্টারে "レジ袋小" (+¥5) বাটন প্রেস করুন এবং সুন্দরভাবে আইটেমগুলো ব্যাগে ভরুন।',
        nuanceEn: 'Press Small Bag (+5 Yen) on the POS screen and bag items efficiently.'
      },
      utensils: {
        cashierPromptJa: 'おしぼりはご利用ですか？',
        cashierPromptRomaji: 'Oshibori wa goriyou desu ka?',
        cashierPromptBn: 'ভেজা ওয়াইপ বা ন্যাপকিন লাগবে কি?',
        needsChopsticks: false,
        needsSpoon: false,
        customerResponseJa: 'あ、お手拭き1つもらえると助かります。',
        customerResponseRomaji: 'A, otefuki hitotsu moraeru to tasukarimasu.',
        customerResponseBn: 'হ্যাঁ, ১টি ওয়েট ওয়াইপ দিলে ভালো হয়।',
        nuanceBn: 'চিকেন বা ওনিগিরির সাথে ওতেফুকি (Otefuki) দেওয়া একটি দারুণ ভদ্রতা।',
        nuanceEn: 'Offering a wet wipe (oshibori) with fried chicken/onigiri is Japanese standard etiquette.'
      },
      payment: {
        preferredMethod: 'suica',
        customerAnnounceJa: 'Suicaでタッチします。',
        customerAnnounceRomaji: 'Suica de tacchi shimasu.',
        customerAnnounceBn: 'সুইকা কার্ডে টাচ করব।',
        nuanceBn: 'ক্যাশিয়ার রেজিস্ট্রারে "交通系IC" প্রেস করবেন, তখন রিডারের নীল বাতি জ্বলবে। গ্রাহক টাচ করলে "ピピッ" শব্দ হবে।',
        nuanceEn: 'Select Transit IC on POS. When the LED illuminates, customer taps their card/Apple Pay.'
      },
      closing: {
        cashierPartingJa: 'ありがとうございました！いってらっしゃいませ！',
        cashierPartingRomaji: 'Arigatou gozaimashita! Itterasshaimase!',
        cashierPartingBn: 'ধন্যবাদ! আপনার দিনটি শুভ হোক!',
        customerReplyJa: 'ありがとうございます！',
        customerReplyRomaji: 'Arigatou gozaimasu!',
        customerReplyBn: 'ধন্যবাদ!',
        nuanceBn: 'সকালের স্কুল বা অফিসযাত্রীদের বিদায় দেওয়ার সময় "いってらっしゃいませ！" বললে গ্রাহক খুব খুশি হন।',
        nuanceEn: 'Morning commuters love the warm farewell "Itterasshaimase!" (Have a great day!).'
      }
    },
    workplaceProTip: {
      titleJa: '交通系IC決済の案内と「いってらっしゃいませ」',
      titleBn: 'ট্রানজিট কার্ড পেমেন্ট ও প্রাতঃকালীন শুভেচ্ছা',
      explanationBn: 'সুইকা বা পাসমো গ্রাহকদের ক্ষেত্রে রিডারে আলো জ্বলা পর্যন্ত বলুন "リーダーへタッチをお願いします" (অনুগ্রহ করে কার্ড টাচ করুন)। টাচ সফল হলে দ্রুত রসিদ হাতে দিন।',
      keigoRuleJa: '「端末の青い光のところへタッチをお願いいたします。」'
    }
  },

  // 3. Yamamoto Grandma (Newspaper + Bread + 10,000 Yen Bill Cash & Change)
  {
    id: 'sc-grandma-yamamoto',
    customerName: '山本 トメ (Yamamoto Tome)',
    customerType: 'grandma',
    roleTitleJa: '谷中銀座の常連おばあちゃん (76歳)',
    roleTitleBn: 'স্থানীয় বৃদ্ধা নিয়মিত গ্রাহক (৭৬ বছর)',
    roleTitleEn: 'Yanaka Neighborhood Regular Grandma (Age 76)',
    locationContextJa: 'ファミリーマート 谷中銀座店 (10:15 朝の散歩)',
    patienceTimeSeconds: 60,
    avatarEmoji: '👵',
    avatarBgColor: 'from-emerald-700 to-teal-950',
    customerSpeechJa: '新聞とパンね。袋はいらないよ。一万円札で崩せるかい？',
    customerSpeechRomaji: "Shinbun to pan ne. Fukuro wa iranai yo. Ichiman'en-satsu de kuzuseru kai?",
    customerSpeechBn: 'সংবাদপত্র আর রুটি। ব্যাগ লাগবে না ভাই। ১০,০০০ ইয়েনের নোট ভাঙতি হবে কি?',
    items: [
      {
        id: 'prod-newspaper-asahi',
        barcode: '4901234567899',
        nameJa: '朝日新聞 朝刊',
        nameRomaji: 'Asahi Shimbun Choukan',
        nameBn: 'আসাহি শিমবুন সকালের দৈনিক পত্রিকা',
        priceYen: 180,
        category: 'dessert',
        needsHeating: false,
        imageIcon: '📰'
      },
      {
        id: 'prod-bread-anpan',
        barcode: '4901234567895',
        nameJa: 'つぶあんぱん (北海道産小豆)',
        nameRomaji: 'Tsubu Anpan Hokkaido',
        nameBn: 'হক্কাইডো রেড বিনস জাপানিজ মিষ্টি রুটি',
        priceYen: 140,
        category: 'dessert',
        needsHeating: false,
        imageIcon: '🥯'
      },
      {
        id: 'prod-hot-tea-can',
        barcode: '4901234567894',
        nameJa: 'あたたかい綾鷹 緑茶 280ml',
        nameRomaji: 'Atatakai Ayataka 280ml',
        nameBn: 'হট ওয়ার্ম গ্রিন টি ক্যান',
        priceYen: 140,
        category: 'drink',
        needsHeating: false,
        imageIcon: '🍵'
      }
    ],
    hasPointCard: true,
    pointCardName: 'Ponta',
    needsBag: false,
    needsChopsticks: false,
    wantsBentoHeated: false,
    paymentMethod: 'cash',
    tenderedCashAmount: 10000,
    dialogueState: {
      greeting: {
        cashierPromptJa: 'いらっしゃいませ！おはようございます！',
        cashierPromptRomaji: 'Irasshaimase! Ohayou gozaimasu!',
        cashierPromptBn: 'স্বাগতম! শুভ সকাল!',
        customerResponseJa: 'おはよう、今日もいい天気だねぇ。',
        customerResponseRomaji: 'Ohayou, kyou mo ii tenki da nee.',
        customerResponseBn: 'শুভ সকাল, আজকের আবহাওয়া বেশ সুন্দর তাই না।',
        nuanceBn: 'বয়োবৃদ্ধ গ্রাহকদের সাথে ধীরেসুস্থে শান্ত ও স্পষ্ট কণ্ঠে কথা বলুন।',
        nuanceEn: 'Speak gently, clearly, and with an unhurried, warm tone with elderly patrons.'
      },
      pointCard: {
        cashierPromptJa: 'ポイントカードはお持ちですか？',
        cashierPromptRomaji: 'Pointo kaado wa omochi desu ka?',
        cashierPromptBn: 'আপনার কি কোনো পয়েন্ট কার্ড আছে?',
        hasCard: true,
        cardType: 'Ponta',
        customerResponseJa: 'はいはい、ポンタカードね。お財布から出すから待ってね。',
        customerResponseRomaji: 'Hai hai, Ponta kaado ne. Osaifu kara dasu kara matte ne.',
        customerResponseBn: 'হ্যাঁ হ্যাঁ, পন্তা কার্ড। পার্স থেকে বের করছি একটু দাঁড়াও।',
        nuanceBn: 'গ্রাহক কার্ড বের করা পর্যন্ত ধৈর্যের সাথে অপেক্ষা করুন। কখনই তাড়া দেবেন না।',
        nuanceEn: 'Wait patiently as elderly customers retrieve their physical card from wallet.'
      },
      bentoWarming: {
        isApplicable: false,
        cashierPromptJa: '温めは大丈夫ですか？',
        cashierPromptRomaji: 'Atatame wa daijoubu desu ka?',
        cashierPromptBn: 'গরম করার প্রয়োজন আছে কি?',
        wantsHeating: false,
        heatingSeconds: 0,
        customerResponseJa: 'お茶はホットコーナーから取ったから温めなくて大丈夫よ。',
        customerResponseRomaji: 'Ocha wa hotto koonaa kara totta kara atatamenakute daijoubu yo.',
        customerResponseBn: 'চা তো হট কেস থেকেই নিয়েছি, গরম করার দরকার নেই।',
        nuanceBn: 'ক্যান বা বোতল হট কেস (あたたかい) থেকে নিলে আর গরম করার প্রয়োজন হয় না।',
        nuanceEn: 'Hot case beverages are already pre-heated to ~55°C.'
      },
      bagSelection: {
        cashierPromptJa: 'レジ袋はご利用になりますか？',
        cashierPromptRomaji: 'Rejibukuro wa goriyou ni narimasu ka?',
        cashierPromptBn: 'প্লাস্টিক ব্যাগ কি প্রয়োজন হবে?',
        needsBag: false,
        bagSize: 'none',
        bagFeeYen: 0,
        customerResponseJa: '手提げ袋持ってるから、シールだけ貼ってちょうだい。',
        customerResponseRomaji: 'Tesagebukuro motteru kara, shiiru dake hatte choudai.',
        customerResponseBn: 'আমার নিজের ব্যাগ আছে, শুধু পণ্যগুলোতে টেপ-সিল লাগিয়ে দিন।',
        nuanceBn: 'ব্যাগ না নিলে পণ্যের বারকোডের ওপর টেপ বা দোকানের রঙিন স্টিকার লাগানো নিয়ম।',
        nuanceEn: 'Affixing the store tape sticker proves the item has been legally paid for.'
      },
      utensils: {
        cashierPromptJa: 'おしぼりをお付けしましょうか？',
        cashierPromptRomaji: 'Oshibori o otsuke shimashou ka?',
        cashierPromptBn: 'ভেজা ন্যাপকিন কি দিয়ে দেব?',
        needsChopsticks: false,
        needsSpoon: false,
        customerResponseJa: 'パン食べるから、おしぼり1枚もらえるかい？',
        customerResponseRomaji: 'Pan taberu kara, oshibori ichimai moraeru kai?',
        customerResponseBn: 'রুটি খাব তো, একটা ভেজা টিস্যু দিলে ভালো হতো।',
        nuanceBn: 'ভদ্রভাবে ওতেফুকি হ্যান্ডওভার ট্রেতে রাখুন।',
        nuanceEn: 'Gently place the wipe on the coin tray or directly with items.'
      },
      payment: {
        preferredMethod: 'cash',
        customerAnnounceJa: '一万円札でお願いしますね。',
        customerAnnounceRomaji: "Ichiman'en-satsu de onegai shimasu ne.",
        customerAnnounceBn: '১০,০০০ ইয়েনের নোটে দিচ্ছি, ভাঙতি দিন।',
        tenderedCashAmount: 10000,
        nuanceBn: 'মোট বিল ৪৬০ ইয়েন। ১০০০ নম্বরের বাটন প্রেস করুন। ক্যাশ ড্রয়ার খুলবে। ভাঙতি ৯,৫৪০ ইয়েন। গণনা করে শোনান: "9千円と、540円のお返しでございます"。',
        nuanceEn: 'Total is ¥460. Received ¥10,000 bill. Change is ¥9,540. Count notes first, then coins on receipt.'
      },
      closing: {
        cashierPartingJa: 'ありがとうございました！お気をつけてお帰りくださいませ！',
        cashierPartingRomaji: 'Arigatou gozaimashita! Oki o tsukete okaeri kudasaimase!',
        cashierPartingBn: 'অসংখ্য ধন্যবাদ! সাবধানে বাড়ি ফিরবেন!',
        customerReplyJa: 'ありがとね、また来るよ。',
        customerReplyRomaji: 'Arigato ne, mata kuru yo.',
        customerReplyBn: 'ধন্যবাদ খোকা, আবার আসব।',
        nuanceBn: 'বৃদ্ধদের "お気をつけて" (Take care) বলা সর্বোচ্চ ওমোতেনাশি (Omotenashi)।',
        nuanceEn: '"Oki o tsukete" shows traditional Japanese community warmth and respect.'
      }
    },
    workplaceProTip: {
      titleJa: '一万円札のお預かりとお釣りの受け渡しマナー',
      titleBn: '১০,০০০ ইয়েনের নোট গ্রহণ ও ভাঙতি গুনে দেওয়ার নিয়ম',
      explanationBn: 'কখনোই বলবেন না "一万円からお預かりします" (এটি জাপানিজ বাইতো কেইগো ব্যাকরণগত ভুল)। সঠিক নিয়ম হলো: "一万円お預かりいたします" (Ichiman-en oazukari itashimasu)। প্রথমে কাগজের নোট চোখের সামনে গুনে দেখান, তারপর কয়েনগুলো রসিদের ওপর সুন্দর করে ট্রেতে রাখুন।',
      keigoRuleJa: '「一万円お預かりいたします。九千円と、五百四十円のお返しとレシートでございます。」'
    }
  },

  // 4. Foreign Tourist (Credit Card + Tax/Bag question)
  {
    id: 'sc-tourist-michael',
    customerName: 'Michael Evans (マイケルさん)',
    customerType: 'foreigner',
    roleTitleJa: '秋葉原観光中のアメリカ人旅行者 (28歳)',
    roleTitleBn: 'আকিকাহাবারা ভ্রমণরত বিদেশী পর্যটক (২৮ বছর)',
    roleTitleEn: 'Visiting Tourist in Akihabara (Age 28)',
    locationContextJa: 'セブン-イレブン 秋葉原中央通り店 (15:30 観光ピーク)',
    patienceTimeSeconds: 55,
    avatarEmoji: '🌍',
    avatarBgColor: 'from-purple-600 to-pink-900',
    customerSpeechJa: 'すみません！お土産と飲み物です。袋もお願いします。クレジットカードで払えますか？',
    customerSpeechRomaji: 'Sumimasen! Omiyage to nomimono desu. Fukuro mo onegai shimasu. Kurejitto kaado de haraemasu ka?',
    customerSpeechBn: 'এক্সকিউজ মি! স্যুভেনির ও পানীয়। ব্যাগও দিন। ক্রেডিট কার্ডে পেমেন্ট দেওয়া যাবে?',
    items: [
      {
        id: 'prod-tokyo-banana',
        barcode: '4901234567896',
        nameJa: '東京ばな奈「見ぃつけたっ」4個入',
        nameRomaji: 'Tokyo Banana 4-pack',
        nameBn: 'টোকিও ব্যানানা বিখ্যাত স্যুভেনির কেক',
        priceYen: 650,
        category: 'dessert',
        needsHeating: false,
        imageIcon: '🍌'
      },
      {
        id: 'prod-matcha-kitkat',
        barcode: '4901234567897',
        nameJa: 'キットカット 濃い抹茶 10枚',
        nameRomaji: 'KitKat Rich Matcha 10-pack',
        nameBn: 'কিটক্যাট জাপানিজ রিচ মাচ্চা ফ্লেভার',
        priceYen: 380,
        category: 'dessert',
        needsHeating: false,
        imageIcon: '🍵'
      },
      {
        id: 'prod-drink-pocari',
        barcode: '4901234567888',
        nameJa: 'ポカリスエット 500ml',
        nameRomaji: 'Pocari Sweat 500ml',
        nameBn: 'পোকারি সোয়েট ইলেক্ট্রোলাইট ড্রিংক',
        priceYen: 160,
        category: 'drink',
        needsHeating: false,
        imageIcon: '💧'
      }
    ],
    hasPointCard: false,
    needsBag: true,
    needsChopsticks: false,
    wantsBentoHeated: false,
    paymentMethod: 'credit',
    dialogueState: {
      greeting: {
        cashierPromptJa: 'いらっしゃいませ！Hello, welcome!',
        cashierPromptRomaji: 'Irasshaimase! Hello, welcome!',
        cashierPromptBn: 'স্বাগতম! হ্যালো, ওয়েলকাম!',
        customerResponseJa: 'Hi! Hello! Thank you!',
        customerResponseRomaji: 'Hi! Hello! Thank you!',
        customerResponseBn: 'হাই! হ্যালো! ধন্যবাদ!',
        nuanceBn: 'বিদেশী পর্যটকদের সাথে সহজ জাপানি বা অমায়িক ইংরেজি মিশ্রিত অভিবাদন জানান।',
        nuanceEn: 'Warm greetings put international travelers at ease.'
      },
      pointCard: {
        cashierPromptJa: 'ポイントカードはお持ちですか？(Point card?)',
        cashierPromptRomaji: 'Pointo kaado wa omochi desu ka?',
        cashierPromptBn: 'আপনার কি কোনো পয়েন্ট কার্ড আছে?',
        hasCard: false,
        customerResponseJa: 'No, I don\'t have one. What is point card?',
        customerResponseRomaji: 'No, I don\'t have one. What is point card?',
        customerResponseBn: 'না নেই, পয়েন্ট কার্ড কী?',
        nuanceBn: 'পর্যটকদের পয়েন্ট কার্ড থাকে না। হাসিমুখে "大丈夫ですよ (No problem)" বলুন।',
        nuanceEn: 'Tourists rarely have Japanese point cards. Smile and skip.'
      },
      bentoWarming: {
        isApplicable: false,
        cashierPromptJa: '温めはございません。',
        cashierPromptRomaji: 'Atatame wa gozaimasen.',
        cashierPromptBn: 'গরম করার কোনো আইটেম নেই।',
        wantsHeating: false,
        heatingSeconds: 0,
        customerResponseJa: 'No heating needed!',
        customerResponseRomaji: 'No heating needed!',
        customerResponseBn: 'গরম করতে হবে না!',
        nuanceBn: 'স্যুভেনির বা প্যাকেজড মিষ্টি গরম করার প্রশ্ন করার দরকার নেই।',
        nuanceEn: 'Souvenir boxes and ambient drinks skip heating.'
      },
      bagSelection: {
        cashierPromptJa: 'レジ袋はご利用ですか？(Plastic bag: 5 yen)',
        cashierPromptRomaji: 'Rejibukuro wa goriyou desu ka?',
        cashierPromptBn: 'প্লাস্টিক ব্যাগ কি লাগবে? (৫ ইয়েন)',
        needsBag: true,
        bagSize: 'large',
        bagFeeYen: 5,
        customerResponseJa: 'Yes please! 大サイズでお願いします。',
        customerResponseRomaji: 'Yes please! Dai saizu de onegai shimasu.',
        customerResponseBn: 'হ্যাঁ প্লিজ! বড় সাইজের ১টি ব্যাগ দিন।',
        nuanceBn: 'স্যুভেনির বক্স যাতে বাক্সে না বাঁকে, বড় সাইজের ফ্ল্যাট-বটম ব্যাগ দিন।',
        nuanceEn: 'Use a wide-bottom bag so souvenir gift boxes lie flat without crushing.'
      },
      utensils: {
        cashierPromptJa: 'スプーンやお手拭きはお使いになりますか？',
        cashierPromptRomaji: 'Supuun ya otefuki wa otsukai ni narimasu ka?',
        cashierPromptBn: 'চামচ বা ন্যাপকিন কি দিতে হবে?',
        needsChopsticks: false,
        needsSpoon: false,
        customerResponseJa: 'Paper napkins please! ナプキンもらえますか？',
        customerResponseRomaji: 'Paper napkins please! Napukin moraemasu ka?',
        customerResponseBn: 'কাগজের ন্যাপকিন দিলে ভালো হয়!',
        nuanceBn: 'ব্যাগের ভেতর কয়েকটা ক্লিন ন্যাপকিন দিয়ে দিন।',
        nuanceEn: 'Pack 2-3 clean paper napkins neatly into the top of the bag.'
      },
      payment: {
        preferredMethod: 'credit',
        customerAnnounceJa: 'クレジットカードで払います。タッチか差し込みですか？',
        customerAnnounceRomaji: 'Kurejitto kaado de haraimasu. Tacchi ka sashikomi desu ka?',
        customerAnnounceBn: 'ক্রেডিট কার্ডে পে করব। টাচ করব নাকি স্লটে কার্ড ঢোকাব?',
        nuanceBn: 'আধুনিক সেমি-সেলফ রেজিস্টারে স্ক্রিনের "クレジットカード" আইকন কাস্টমার টাচ করে কার্ড ইনসার্ট বা ট্যাপ করে।',
        nuanceEn: 'Customer touches Credit Card on the customer terminal and inserts/taps.'
      },
      closing: {
        cashierPartingJa: 'ありがとうございました！Have a wonderful trip in Tokyo!',
        cashierPartingRomaji: 'Arigatou gozaimashita! Have a wonderful trip in Tokyo!',
        cashierPartingBn: 'অনেক ধন্যবাদ! টোকিওতে আপনার সুন্দর ভ্রমণ হোক!',
        customerReplyJa: 'Thank you so much! Arigatou!',
        customerReplyRomaji: 'Thank you so much! Arigatou!',
        customerReplyBn: 'থ্যাঙ্ক ইউ সো মাচ! আরিগেতো!',
        nuanceBn: 'রসিদ ও কার্ড কাস্টমার ঠিকমতো তুলে নিয়েছে কিনা নিশ্চিত করুন।',
        nuanceEn: 'Confirm the customer has retrieved their credit card before they leave.'
      }
    },
    workplaceProTip: {
      titleJa: 'セミセルフレジでのクレジットカード誘導案内',
      titleBn: 'সেমি-সেলফ রেজিস্টারে ক্রেডিট কার্ড পেমেন্ট নির্দেশনা',
      explanationBn: 'জাপানের ৭-ইলেভেন ও অন্যান্য কনবিনিতে ক্যাশিয়ার টাকা বা কার্ড সরাসরি হাত দিয়ে স্পর্শ করে না। ক্যাশিয়ার স্ক্রিন থেকে কাস্টমার স্ক্রিন চালু করে বলে: "画面のクレジットカードボタンを押してください" (স্ক্রিনের ক্রেডিট কার্ড বাটনে চাপ দিন)।',
      keigoRuleJa: '「お客様側の画面で『クレジットカード』をお選びいただき、端末へカードの挿入またはタッチをお願いいたします。」'
    }
  },

  // 5. Sato Office Worker (12:15 PM Lunch Rush Multi-Item Speed Drill)
  {
    id: 'sc-rush-sato',
    customerName: '佐藤 課長 (Sato Kacho)',
    customerType: 'rush_hour',
    roleTitleJa: '丸の内総合商社 課長 (45歳)',
    roleTitleBn: 'মারুনৌচি হেডকোয়ার্টার সেকশন চিফ (৪৫ বছর)',
    roleTitleEn: 'Marunouchi Trading Firm Chief (Age 45)',
    locationContextJa: 'ファミリーマート 丸の内オフィスビル店 (12:15 昼休み大混雑)',
    patienceTimeSeconds: 30, // Strict rush-hour patience!
    avatarEmoji: '⚡',
    avatarBgColor: 'from-rose-700 to-red-950',
    customerSpeechJa: '急ぎでお願いします！弁当温めて、袋は大で。スプーンも。交通系ICで払います！',
    customerSpeechRomaji: 'Isogi de onegai shimasu! Bentou atatamete, fukuro wa dai de. Supuun mo. Koutsuukei IC de haraimasu!',
    customerSpeechBn: 'খুব তাড়াহুড়ো আছে ভাই! বেন্টো গরম করুন, বড় ব্যাগ দিন, চামচও। ট্রানজিট আইসি কার্ডে পে করব!',
    items: [
      {
        id: 'prod-bento-yakiniku',
        barcode: '4901234567881',
        nameJa: '炭火焼き牛カルビ焼肉弁当',
        nameRomaji: 'Sumibi Yaki Gyuu Karubi Bento',
        nameBn: 'চারকোল গ্রিলড বিফ কারুবি স্পেশাল বেন্টো',
        priceYen: 690,
        category: 'bento',
        needsHeating: true,
        imageIcon: '🍱'
      },
      {
        id: 'prod-soup-misoshiru',
        barcode: '4901234567882',
        nameJa: 'とん汁 カップ生みそタイプ',
        nameRomaji: 'Tonjiru Cup Namamiso',
        nameBn: 'টোনজিরু গরম কাপ সুপ',
        priceYen: 150,
        category: 'dessert',
        needsHeating: false,
        imageIcon: '🥣'
      },
      {
        id: 'prod-sandwich-mix',
        barcode: '4901234567883',
        nameJa: 'ジューシーミックスサンドイッチ',
        nameRomaji: 'Juicy Mix Sandwich',
        nameBn: 'জুসি মিক্সড স্যান্ডউইচ',
        priceYen: 320,
        category: 'bento',
        needsHeating: false,
        imageIcon: '🥪'
      },
      {
        id: 'prod-drink-famicoffee',
        barcode: '4901234567884',
        nameJa: 'ファミカフェ アイスコーヒーR',
        nameRomaji: 'FamiCafe Iced Coffee R',
        nameBn: 'আইসড ব্ল্যাক কফি রেগুলার',
        priceYen: 180,
        category: 'drink',
        needsHeating: false,
        imageIcon: '☕'
      }
    ],
    hasPointCard: false,
    needsBag: true,
    needsChopsticks: true,
    wantsBentoHeated: true,
    paymentMethod: 'suica',
    dialogueState: {
      greeting: {
        cashierPromptJa: 'いらっしゃいませ！次のお客様どうぞ！',
        cashierPromptRomaji: 'Irasshaimase! Tsugi no okyakusama douzo!',
        cashierPromptBn: 'স্বাগতম! পরবর্তী গ্রাহক আসুন!',
        customerResponseJa: '急ぎでお願いします！時間がないので！',
        customerResponseRomaji: 'Isogi de onegai shimasu! Jikan ga nai node!',
        customerResponseBn: 'খুব তাড়াহুড়ো আছে! হাতে একদম সময় নেই!',
        nuanceBn: 'পিক আওয়ারে দ্রুত কিন্তু নিখুঁত উচ্চারণে পরবর্তী গ্রাহককে ডাকুন।',
        nuanceEn: 'During lunch peak, call the next customer briskly without compromising polite form.'
      },
      pointCard: {
        cashierPromptJa: 'ポイントカードはお持ちですか？',
        cashierPromptRomaji: 'Pointo kaado wa omochi desu ka?',
        cashierPromptBn: 'পয়েন্ট কার্ড কি আছে?',
        hasCard: false,
        customerResponseJa: '時間ないからカードはいいです！そのまま進めて！',
        customerResponseRomaji: 'Jikan nai kara kaado wa ii desu! Sono mama susumete!',
        customerResponseBn: 'সময় নেই তাই কার্ড লাগবে না! সরাসরি প্রসেস করুন!',
        nuanceBn: 'তাড়াহুড়োর সময় গ্রাহক না বললে সঙ্গে সঙ্গে স্ক্যান চালিয়ে যান।',
        nuanceEn: 'If customer declines point card to save time, keep rhythm going.'
      },
      bentoWarming: {
        isApplicable: true,
        cashierPromptJa: '牛カルビ弁当、温めますか？',
        cashierPromptRomaji: 'Gyuu karubi bentou, atatame masu ka?',
        cashierPromptBn: 'বিফ বেন্টোটি কি ওভেনে গরম করে দিতে হবে?',
        wantsHeating: true,
        heatingSeconds: 20,
        customerResponseJa: 'はい！1500Wで手早く温めてください！',
        customerResponseRomaji: 'Hai! Sen-gohyaku watto de tebayaku atatamete kudasai!',
        customerResponseBn: 'হ্যাঁ! ১৫০০ ওয়াটে চটপট গরম করে দিন!',
        nuanceBn: 'বেন্টোটি আগে ওভেনে ঢুকিয়ে স্টার্ট বাটন টিপুন, তারপর বাকি আইটেম স্ক্যান করুন। এটি সময় বাঁচায়।',
        nuanceEn: 'Pro technique: Put bento in microwave first, then scan remaining items while heating.'
      },
      bagSelection: {
        cashierPromptJa: '大袋（5円）をお付けしますか？',
        cashierPromptRomaji: 'Oobukuro (go-en) o otsuke shimasu ka?',
        cashierPromptBn: 'বড় ব্যাগ (৫ ইয়েন) কি দিতে হবে?',
        needsBag: true,
        bagSize: 'large',
        bagFeeYen: 5,
        customerResponseJa: 'はい、全部入る大サイズで！',
        customerResponseRomaji: 'Hai, zenbu hairu dai saizu de!',
        customerResponseBn: 'হ্যাঁ, যাতে সবগুলো আঁটে এমন বড় সাইজের ১টি ব্যাগ দিন!',
        nuanceBn: 'ঠান্ডা আইস কফি ও গরম বেন্টো একই ব্যাগে দেওয়ার সময় মাঝখানে কার্ডবোর্ড সেপারেটর বা স্যান্ডউইচ রাখুন।',
        nuanceEn: 'Never place freezing iced coffee directly touching the steaming bento in the bag.'
      },
      utensils: {
        cashierPromptJa: 'お箸とスプーンをお付けしますか？',
        cashierPromptRomaji: 'Ohashi to supuun o otsuke shimasu ka?',
        cashierPromptBn: 'চপস্টিক এবং চামচ উভয়ই দিয়ে দেব?',
        needsChopsticks: true,
        needsSpoon: true,
        customerResponseJa: '両方お願いします！とん汁もあるので！',
        customerResponseRomaji: 'Ryouhou onegai shimasu! Tonjiru mo aru node!',
        customerResponseBn: 'দুটোই দিন! সুপও তো আছে!',
        nuanceBn: 'সুপ ও বেন্টো উভয়ের ক্ষেত্রে চপস্টিক ও প্লাস্টিক চামচ একসাথে দিন।',
        nuanceEn: 'Provide both chopsticks and spoon when customer orders soup and bento.'
      },
      payment: {
        preferredMethod: 'suica',
        customerAnnounceJa: '交通系ICで！タッチします！',
        customerAnnounceRomaji: 'Koutsuukei IC de! Tacchi shimasu!',
        customerAnnounceBn: 'ট্রানজিট আইসিতে দেব! টাচ করছি!',
        nuanceBn: 'তৎক্ষণাৎ 交通系 বাটন সিলেক্ট করুন। ৩ সেকেন্ডের মধ্যে পেমেন্ট সম্পন্ন হবে।',
        nuanceEn: 'Swiftly tap Transit IC key so customer can tap immediately.'
      },
      closing: {
        cashierPartingJa: 'ありがとうございました！お気をつけていってらっしゃいませ！',
        cashierPartingRomaji: 'Arigatou gozaimashita! Oki o tsukete itterasshaimase!',
        cashierPartingBn: 'অসংখ্য ধন্যবাদ! সাবধানে যাবেন!',
        customerReplyJa: '助かったよ、ありがとう！',
        customerReplyRomaji: 'Tasukatta yo, arigatou!',
        customerReplyBn: 'উপকার হলো, অনেক ধন্যবাদ!',
        nuanceBn: 'দ্রুত নিখুঁত সার্ভিস দিলে ব্যস্ত জাপানি কর্মীরা সবচেয়ে বেশি সন্তুষ্ট হন।',
        nuanceEn: 'Flawless speed during lunch rush earns the highest customer satisfaction.'
      }
    },
    workplaceProTip: {
      titleJa: '昼ピーク12時台の超高速並行オペレーション',
      titleBn: 'দুপুরের ব্যস্ত সময়ে প্যারালাল কাজের কর্মদক্ষতা',
      explanationBn: 'জাপানি কনবিনির গোল্ডেন রুল: বেন্টো দেখার সাথে সাথেই আগে মাইক্রোওয়েভে ঢুকিয়ে স্টার্ট চাপুন। বেন্টো গরম হতে হতে আইস কফি ও স্যান্ডউইচ স্ক্যান করুন, ব্যাগ প্রস্তুত করুন এবং কাস্টমারকে পেমেন্ট করতে বলুন। ওভেন শেষ হওয়া মাত্রই বেন্টো তুলে ব্যাগে ঢুকিয়ে দিন।',
      keigoRuleJa: '「温め中に他の商品をスキャンいたします。画面の支払い方法をお選びください。」'
    }
  }
];
