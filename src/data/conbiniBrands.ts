// src/data/conbiniBrands.ts
// Comprehensive 3-Brand Japan Convenience Store Engine (7-Eleven, Lawson, FamilyMart)
import { soundEffects } from '../lib/soundEffects';

export type ConbiniBrandId = 'seven_eleven' | 'lawson' | 'family_mart';

export interface HotSnackMenuItem {
  id: string;
  nameJa: string;
  nameRomaji: string;
  nameBn: string;
  priceYen: number;
  imageEmoji: string;
  bagColor: string;
  bagLabelJa: string;
  descriptionBn: string;
  tongsSound?: () => void;
}

export interface ConbiniBrandConfig {
  id: ConbiniBrandId;
  name: string;
  nameJa: string;
  nameBn: string;
  fasciaStripe: string[]; // Tri-color stripes
  primaryColor: string;
  accentColor: string;
  headerGradient: string;
  storeLocationJa: string;
  storeLocationBn: string;
  storeCode: string;
  receiptHeader: string;
  uniformBadgeTitleJa: string;
  uniformBadgeTitleBn: string;
  uniformColorClass: string;
  loyaltyProgramJa: string;
  loyaltyCardNameJa: string;
  loyaltyCardEmoji: string;
  loyaltyPromptJa: string;
  loyaltyPromptRomaji: string;
  loyaltyPromptBn: string;
  hotSnackCaseTitleJa: string;
  hotSnackCaseTitleBn: string;
  hotSnacks: HotSnackMenuItem[];
  customerHotSnackRequestJa: string;
  customerHotSnackRequestRomaji: string;
  customerHotSnackRequestBn: string;
  targetHotSnackId: string;
  playEntranceChime: () => void;
  playApprovalChime: () => void;
}

export const CONBINI_BRANDS: Record<ConbiniBrandId, ConbiniBrandConfig> = {
  seven_eleven: {
    id: 'seven_eleven',
    name: '7-Eleven',
    nameJa: 'セブン-イレブン',
    nameBn: 'সেভেন-ইলেভেন',
    fasciaStripe: ['#F58220', '#008543', '#ED1B24'], // Orange, Green, Red
    primaryColor: '#008543',
    accentColor: '#F58220',
    headerGradient: 'from-orange-600 via-emerald-600 to-red-600',
    storeLocationJa: '新宿駅東口店 (Shinjuku Station East #1084)',
    storeLocationBn: 'শিঞ্জুকি স্টেশন ইস্ট এক্সিট শাখা',
    storeCode: '7E-SHINJUKU-1084',
    receiptHeader: 'セブン-イレブン 新宿駅東口店\n東京都新宿区新宿3-38-1\nTEL: 03-3350-7111  レジ: 01',
    uniformBadgeTitleJa: 'セブン 研修中 タニビル',
    uniformBadgeTitleBn: '৭-ইলেভেন ট্রেইনি ক্যাশিয়ার',
    uniformColorClass: 'bg-emerald-700 text-amber-200 border-amber-400',
    loyaltyProgramJa: '7iD / nanaco (ナナコ)',
    loyaltyCardNameJa: 'nanaco',
    loyaltyCardEmoji: '🦒',
    loyaltyPromptJa: '7iD、またはnanacoカードはお持ちですか？',
    loyaltyPromptRomaji: 'Sebun ai-dii, matawa nanako kaado wa omochi desu ka?',
    loyaltyPromptBn: 'সেভেন আইডি অথবা নানাকো কার্ড কি আপনার সাথে আছে?',
    hotSnackCaseTitleJa: '揚げたてフライヤー (Fresh Fryer Showcase)',
    hotSnackCaseTitleBn: 'গরম হট স্ন্যাক্স ওয়ার্মার শোকেস',
    hotSnacks: [
      {
        id: 'snack-nanachiki',
        nameJa: 'ななチキ (Nanachiki)',
        nameRomaji: 'Nanachiki',
        nameBn: 'নানাচিকি (৭-ইলেভেনের সিগনেচার স্পাইসি জুসি চিকেন)',
        priceYen: 220,
        imageEmoji: '🍗',
        bagColor: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
        bagLabelJa: 'ななチキ',
        descriptionBn: 'ক্রিস্পি স্কিন ও প্রিমিয়াম মসলাযুক্ত জুসি চিকেন'
      },
      {
        id: 'snack-agedori',
        nameJa: '揚げ鶏 (Fried Tender Chicken)',
        nameRomaji: 'Agedori',
        nameBn: 'আগেদোরি ক্রিস্পি ফ্রাইড চিকেন',
        priceYen: 240,
        imageEmoji: '🍖',
        bagColor: 'bg-gradient-to-br from-red-600 to-rose-700 text-white',
        bagLabelJa: '揚げ鶏',
        descriptionBn: 'পাতলা ক্রাঞ্চি স্কিন ও রসালো স্বাদ'
      },
      {
        id: 'snack-americandog',
        nameJa: 'アメリカンドッグ (Corn Dog)',
        nameRomaji: 'Amerikan Doggu',
        nameBn: 'জাপানিজ ক্রিস্পি কর্ন ডগ',
        priceYen: 140,
        imageEmoji: '🌭',
        bagColor: 'bg-gradient-to-br from-amber-600 to-yellow-600 text-white',
        bagLabelJa: 'アメリカンドッグ',
        descriptionBn: 'হালকা মিষ্টি ব্যাটার ও মাস্টার্ড-কেচাপ সস সহ'
      }
    ],
    customerHotSnackRequestJa: 'あと、ななチキも１つください！',
    customerHotSnackRequestRomaji: 'Ato, nanachiki mo hitotsu kudasai!',
    customerHotSnackRequestBn: 'আর সাথে একটা নানাচিকিও দিন প্লিজ!',
    targetHotSnackId: 'snack-nanachiki',
    playEntranceChime: () => soundEffects.playSevenEntrance(),
    playApprovalChime: () => soundEffects.playNanacoChirp()
  },

  lawson: {
    id: 'lawson',
    name: 'Lawson',
    nameJa: 'ローソン',
    nameBn: 'লসন',
    fasciaStripe: ['#0068B7', '#FFFFFF', '#0068B7'], // Royal Blue & White
    primaryColor: '#0068B7',
    accentColor: '#FFFFFF',
    headerGradient: 'from-blue-700 via-sky-600 to-indigo-800',
    storeLocationJa: '渋谷道玄坂二丁目店 (Shibuya Dogenzaka #2491)',
    storeLocationBn: 'শিবুইয়া দোগেনজাকা ২-চোমে শাখা',
    storeCode: 'LAWSON-SHIBUYA-2491',
    receiptHeader: 'ローソン 渋谷道玄坂二丁目店\n東京都渋谷区道玄坂2-29-1\nTEL: 03-3461-8200  レジ: 01',
    uniformBadgeTitleJa: 'ローソン クルー タニビル',
    uniformBadgeTitleBn: 'লসন ব্লু-স্ট্রাইপ ক্রু ক্যাশিয়ার',
    uniformColorClass: 'bg-blue-700 text-white border-blue-400',
    loyaltyProgramJa: 'Ponta (ポンタ) / dポイント',
    loyaltyCardNameJa: 'Ponta',
    loyaltyCardEmoji: '🦝',
    loyaltyPromptJa: 'Pontaカード、またはdポイントカードはお持ちですか？',
    loyaltyPromptRomaji: 'Ponta kaado, matawa dii pointo kaado wa omochi desu ka?',
    loyaltyPromptBn: 'পোন্টা কার্ড অথবা ডি-পয়েন্ট কার্ড কি আছে?',
    hotSnackCaseTitleJa: 'HOTステーション (Hot Station Warmer)',
    hotSnackCaseTitleBn: 'লসন হট স্টেশন ফ্রাইড আইটেম কেস',
    hotSnacks: [
      {
        id: 'snack-karaagekun-reg',
        nameJa: 'からあげクン レギュラー',
        nameRomaji: 'Karaage-kun Regular',
        nameBn: 'কারাআগে-কুন রেগুলার (লসন লেজেন্ডারি নাগেট)',
        priceYen: 248,
        imageEmoji: '🐔',
        bagColor: 'bg-gradient-to-br from-sky-500 to-blue-600 text-white',
        bagLabelJa: 'からあげクン',
        descriptionBn: '১৯৮৬ সাল থেকে জাপানের সবচেয়ে জনপ্রিয় চিকেন নাগেট'
      },
      {
        id: 'snack-karaagekun-red',
        nameJa: 'からあげクン レッド (Spicy)',
        nameRomaji: 'Karaage-kun Red',
        nameBn: 'কারাআগে-কুন রেড (স্পাইসি হট ফ্লেভার)',
        priceYen: 248,
        imageEmoji: '🌶️',
        bagColor: 'bg-gradient-to-br from-red-600 to-rose-700 text-white',
        bagLabelJa: 'からあげクン レッド',
        descriptionBn: 'হালকা মরিচের ঝাঁজালো স্বাদের চিকেন বাইট'
      },
      {
        id: 'snack-lchiki',
        nameJa: 'Lチキ レギュラー (L-Chiki)',
        nameRomaji: 'Eru-Chiki',
        nameBn: 'এল-চিকি ফ্রাইড চিকেন ফিলেট',
        priceYen: 230,
        imageEmoji: '🍗',
        bagColor: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white',
        bagLabelJa: 'Lチキ',
        descriptionBn: 'বড় আকারের জুসি বোনলেস ফ্রাইড চিকেন'
      }
    ],
    customerHotSnackRequestJa: 'からあげクンレッド１つお願いします！',
    customerHotSnackRequestRomaji: 'Karaage-kun reddo hitotsu onegai shimasu!',
    customerHotSnackRequestBn: 'একটি কারাআগে-কুন রেড প্লিজ দিন!',
    targetHotSnackId: 'snack-karaagekun-red',
    playEntranceChime: () => soundEffects.playLawsonDoorbell(),
    playApprovalChime: () => soundEffects.playPontaSound()
  },

  family_mart: {
    id: 'family_mart',
    name: 'FamilyMart',
    nameJa: 'ファミリーマート',
    nameBn: 'ফ্যামিলিমার্ট',
    fasciaStripe: ['#009944', '#FFFFFF', '#00A0E9'], // Green, White, Cyan
    primaryColor: '#009944',
    accentColor: '#00A0E9',
    headerGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    storeLocationJa: '池袋サンシャイン通り店 (Ikebukuro Sunshine #3820)',
    storeLocationBn: 'ইকেবুকুরো সানশাইন স্ট্রিট শাখা',
    storeCode: 'FAMIMA-IKEBUKURO-3820',
    receiptHeader: 'ファミリーマート 池袋サンシャイン通り店\n東京都豊島区東池袋1-14-1\nTEL: 03-3982-1200  レジ: 01',
    uniformBadgeTitleJa: 'ファミマ スタッフ タニビル',
    uniformBadgeTitleBn: 'ফ্যামিলিমার্ট গ্রিন-সায়ান স্টাফ ক্যাশিয়ার',
    uniformColorClass: 'bg-emerald-700 text-cyan-200 border-cyan-400',
    loyaltyProgramJa: 'ファミペイ / Tポイント / 楽天ポイント',
    loyaltyCardNameJa: 'FamiPay',
    loyaltyCardEmoji: '💳',
    loyaltyPromptJa: 'ファミペイ、またはTポイント・楽天ポイントはお持ちですか？',
    loyaltyPromptRomaji: 'Famipei, matawa tii-pointo, rakuten pointo wa omochi desu ka?',
    loyaltyPromptBn: 'ফ্যামিপে অথবা টি-পয়েন্ট, রাকুটেন পয়েন্ট আছে কি?',
    hotSnackCaseTitleJa: 'できたてファミフーズ (Fresh FamiFoods)',
    hotSnackCaseTitleBn: 'তাজা ফ্যামিফুডস ফ্রাইড চিকেন ডিসপ্লে',
    hotSnacks: [
      {
        id: 'snack-famichiki',
        nameJa: 'ファミチキ (Famichiki)',
        nameRomaji: 'Famichiki',
        nameBn: 'ফ্যামিচিকি (জাপানের আইকনিক #১ কনবিনি চিকেন)',
        priceYen: 230,
        imageEmoji: '🍗',
        bagColor: 'bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 font-black',
        bagLabelJa: 'ファミチキ',
        descriptionBn: 'কাট-লাইন সহ স্পেশাল হলুদ ডোরাকাটা পাউচ প্যাকেজিং'
      },
      {
        id: 'snack-spicychiki',
        nameJa: 'スパイシーチキン (Spicy Chicken)',
        nameRomaji: 'Supaisii Chikin',
        nameBn: 'স্পাইসি ফ্রাইড চিকেন',
        priceYen: 198,
        imageEmoji: '🍖',
        bagColor: 'bg-gradient-to-br from-rose-600 to-red-700 text-white',
        bagLabelJa: 'スパイシーチキン',
        descriptionBn: 'কালো গোলমরিচ ও ক্রিস্পি কোটিং'
      },
      {
        id: 'snack-jumbofrank',
        nameJa: 'ジャンボフランク (Jumbo Frank)',
        nameRomaji: 'Janbo Furanku',
        nameBn: 'জাম্বো ফ্রাঙ্ক সসেজ অন স্টিক',
        priceYen: 180,
        imageEmoji: '🌭',
        bagColor: 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white',
        bagLabelJa: 'ジャンボフランク',
        descriptionBn: 'ধোঁয়া ওঠা হট সসেজ'
      }
    ],
    customerHotSnackRequestJa: 'ファミチキ１つください！',
    customerHotSnackRequestRomaji: 'Famichiki hitotsu kudasai!',
    customerHotSnackRequestBn: 'একটি ফ্যামিচিকি দিন প্লিজ!',
    targetHotSnackId: 'snack-famichiki',
    playEntranceChime: () => soundEffects.playFamilyMartChime(),
    playApprovalChime: () => soundEffects.playPayPaySound()
  }
};
