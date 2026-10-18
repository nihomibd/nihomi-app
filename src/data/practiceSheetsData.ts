// src/data/practiceSheetsData.ts
// Nihomi Practice Sheet Asset Inventory — 100% Rights-Cleared Authentic Nihomi Assets

export interface PracticeSheetAsset {
  key: string;
  titleBn: string;
  descBn: string;
  filename: string;
  publicUrl: string;
  fileSizeBytes: number;
  fileSizeKB: number;
  pages: number;
  sha256: string;
  sourceOriginal: string;
  rightsStatus: 'VERIFIED_ORIGINAL_NIHOMI' | 'THIRD_PARTY_STAGED';
  category?: 'master_chart' | 'writing_practice' | 'confusion_pairs' | 'visual_vocab' | 'study_guide';
  entitlement: 'FREE';
}

export const CANONICAL_PRACTICE_SHEETS: PracticeSheetAsset[] = [
  // Flagship Kana Home Practice Pack (v1.0)
  {
    key: 'hiragana_master_chart',
    titleBn: 'হিরাগানা পূর্ণাঙ্গ চার্ট ও উচ্চারণ (Hiragana 46-Sound Chart)',
    descBn: 'গোজিউওন ৫০-ধ্বনি গ্রিড, রোমাজি ও নির্ভুল বাংলা উচ্চারণ সহ পূর্ণাঙ্গ রেফারেন্স চার্ট।',
    filename: 'nihomi-hiragana-master-chart.pdf',
    publicUrl: '/downloads/print-packs/kana-home-practice-v1/nihomi-hiragana-master-chart.pdf',
    fileSizeBytes: 26796,
    fileSizeKB: 26.2,
    pages: 1,
    sha256: 'fc0719276e5ab8696d8f3d22dd31f4067a1f85b08db69231b504a0b19f9bdf9c',
    sourceOriginal: 'Nihomi Print Learning Engine v1.0',
    rightsStatus: 'VERIFIED_ORIGINAL_NIHOMI',
    category: 'master_chart',
    entitlement: 'FREE'
  },
  {
    key: 'katakana_master_chart',
    titleBn: 'কাতাকানা পূর্ণাঙ্গ চার্ট ও ব্যবহার (Katakana 46-Sound Chart)',
    descBn: 'বিদেশি ঋণশব্দ ও দৈনন্দিন আধুনিক জাপানি ব্যবহারের জন্য ৪৬টি কাতাকানা অক্ষরের স্পষ্ট চার্ট।',
    filename: 'nihomi-katakana-master-chart.pdf',
    publicUrl: '/downloads/print-packs/kana-home-practice-v1/nihomi-katakana-master-chart.pdf',
    fileSizeBytes: 24623,
    fileSizeKB: 24.0,
    pages: 1,
    sha256: '93fd73c8a983bc9ff6a846bb45f5eb874d6278e5e6a55ebfb688a7f15593a92e',
    sourceOriginal: 'Nihomi Print Learning Engine v1.0',
    rightsStatus: 'VERIFIED_ORIGINAL_NIHOMI',
    category: 'master_chart',
    entitlement: 'FREE'
  },
  {
    key: 'combined_dakuten_yoon_chart',
    titleBn: 'যুক্তাক্ষর, তেনতেন (゛), মারু (゜) ও বিশেষ ধ্বনি চার্ট',
    descBn: 'ডাকুতেন, হান্দাকুতেন ও ইওন (ছোট ゃ ゅ ょ) যুক্ত অক্ষরের সম্পূর্ণ গাইডলাইন।',
    filename: 'nihomi-combined-dakuten-yoon-chart.pdf',
    publicUrl: '/downloads/print-packs/kana-home-practice-v1/nihomi-combined-dakuten-yoon-chart.pdf',
    fileSizeBytes: 23789,
    fileSizeKB: 23.2,
    pages: 1,
    sha256: '44678d8ea39c958e171fe6c5e1c4c82c4c48cbfebf8ec70e8a259ea34245f44a',
    sourceOriginal: 'Nihomi Print Learning Engine v1.0',
    rightsStatus: 'VERIFIED_ORIGINAL_NIHOMI',
    category: 'master_chart',
    entitlement: 'FREE'
  },
  {
    key: 'kana_stroke_order_practice',
    titleBn: 'হাতে-কলমে লেখার প্র্যাকটিস শিট (Stroke-Order Writing Grid)',
    descBn: 'স্ট্রোকের দিক নির্দেশক তিরচিহ্ন, হালকা ট্রেস বক্স, মুক্তহস্তে লেখার ফাঁকা গ্রিড ও সেলফ-চেক বক্স।',
    filename: 'nihomi-kana-stroke-order-practice.pdf',
    publicUrl: '/downloads/print-packs/kana-home-practice-v1/nihomi-kana-stroke-order-practice.pdf',
    fileSizeBytes: 35996,
    fileSizeKB: 35.2,
    pages: 2,
    sha256: '45953a75fa9ca0b4f9726a04dd9d4080213534de20ab2ac60cc826ca442d124a',
    sourceOriginal: 'Nihomi Print Learning Engine v1.0',
    rightsStatus: 'VERIFIED_ORIGINAL_NIHOMI',
    category: 'writing_practice',
    entitlement: 'FREE'
  },
  {
    key: 'kana_confusion_pairs',
    titleBn: 'সাদৃশ্যপূর্ণ অক্ষরের বিভ্রান্তি দূরীকরণ (Confusion Pairs)',
    descBn: 'さ/ち, れ/わ/ね, シ/ツ, ソ/ン অক্ষরের সূক্ষ্ম পার্থক্য বিশ্লেষণ ও পাশাপাশি লেখার সেল গ্রিড।',
    filename: 'nihomi-kana-confusion-pairs-workbook.pdf',
    publicUrl: '/downloads/print-packs/kana-home-practice-v1/nihomi-kana-confusion-pairs-workbook.pdf',
    fileSizeBytes: 30035,
    fileSizeKB: 29.3,
    pages: 1,
    sha256: 'd8b52b013f7bb58c316d401d76b944b87b4809ac0bd5ddd8c2b9a467c145f4db',
    sourceOriginal: 'Nihomi Print Learning Engine v1.0',
    rightsStatus: 'VERIFIED_ORIGINAL_NIHOMI',
    category: 'confusion_pairs',
    entitlement: 'FREE'
  },
  {
    key: 'visual_vocab_n5_sample',
    titleBn: 'চিত্রসহ N5 শব্দভাণ্ডার ও বাক্য (Visual Vocabulary Flash-Workbook)',
    descBn: 'কাঞ্জি, ফুরিগানা ও বাংলা অর্থ সহ জরুরি N5 প্রাথমিক শব্দের দৃশ্যমান ফ্ল্যাশ-ওয়ার্কবুক।',
    filename: 'nihomi-visual-vocabulary-n5-sample.pdf',
    publicUrl: '/downloads/print-packs/kana-home-practice-v1/nihomi-visual-vocabulary-n5-sample.pdf',
    fileSizeBytes: 33996,
    fileSizeKB: 33.2,
    pages: 1,
    sha256: '36f338b40bb1c137b1b23ed5ccb392fc751fcef4d692e0f6a2f9ba5ae166b690',
    sourceOriginal: 'Nihomi Print Learning Engine v1.0',
    rightsStatus: 'VERIFIED_ORIGINAL_NIHOMI',
    category: 'visual_vocab',
    entitlement: 'FREE'
  },
  {
    key: 'home_practice_guide_bn',
    titleBn: 'বাসায় সঠিক অনুশীলনের ৫টি ধাপ (Home Practice Study Guide)',
    descBn: 'প্রিন্ট, উচ্চারণ, ট্রেসিং, মেমোরি রিকল ও স্বমূল্যায়নের জন্য শিক্ষামূলক বাংলা গাইডলাইন।',
    filename: 'nihomi-home-practice-guide-bn.pdf',
    publicUrl: '/downloads/print-packs/kana-home-practice-v1/nihomi-home-practice-guide-bn.pdf',
    fileSizeBytes: 47851,
    fileSizeKB: 46.7,
    pages: 1,
    sha256: 'c49dd8b38a5f53a31bfc51a1e948befa64d03c0b7837e29a3e6b7493b8c223bd',
    sourceOriginal: 'Nihomi Print Learning Engine v1.0',
    rightsStatus: 'VERIFIED_ORIGINAL_NIHOMI',
    category: 'study_guide',
    entitlement: 'FREE'
  },
  // Foundational Workbooks
  {
    key: 'kana_writing_workbook',
    titleBn: 'নিহোমি ১৮ পৃষ্ঠার কানা ও উচ্চারণ মাস্টার ওয়ার্কবুক (18-Page Master)',
    descBn: 'হিরাগানা, কাতাকানা, স্বরবর্ণ স্ট্রোক গ্রিড, উচ্চারণ নির্দেশিকা এবং সেলফ-চেক অ্যান্সার কি সহ ১৮ পৃষ্ঠার পূর্ণাঙ্গ ওয়ার্কবুক।',
    filename: 'nihomi-kana-pronunciation-writing-workbook.pdf',
    publicUrl: '/downloads/kana-practice/nihomi-kana-pronunciation-writing-workbook.pdf',
    fileSizeBytes: 287748,
    fileSizeKB: 281,
    pages: 18,
    sha256: 'ba39c27edf44f756a002dd8d785f390c22068aacd0a485949ed1e7645090fc4c',
    sourceOriginal: 'Book PDF/Japanese pdf package_/Extra pdf/06_Kana_Pronunciation_Writing_Workbook.pdf',
    rightsStatus: 'VERIFIED_ORIGINAL_NIHOMI',
    category: 'writing_practice',
    entitlement: 'FREE'
  },
  {
    key: 'n5_kana_script_guide',
    titleBn: 'নিহোমি N5 কানা ও লিপি হ্যান্ডবুক (N5 Kana Script Handbook)',
    descBn: 'হিরাগানা ও কাতাকানা লিপির নিয়ম, বর্ণ গঠন, তেনতেন/মারু ও দৈনন্দিন উচ্চারণ নির্দেশিকা (৯ পৃষ্ঠা)।',
    filename: 'nihomi-n5-kana-pronunciation-guide.pdf',
    publicUrl: '/downloads/kana-practice/nihomi-n5-kana-pronunciation-guide.pdf',
    fileSizeBytes: 362285,
    fileSizeKB: 353.8,
    pages: 9,
    sha256: '555bc2670894bd15d4ba219a1db4f61f7743d5f3d79ba4db5679c656d0d291dc',
    sourceOriginal: 'Book PDF/Japanese pdf package_/N5/01_N5_Kana_Pronunciation_Bangla.pdf',
    rightsStatus: 'VERIFIED_ORIGINAL_NIHOMI',
    category: 'master_chart',
    entitlement: 'FREE'
  },
  {
    key: 'n5_kanji_master_sheet',
    titleBn: 'নিহোমি N5 কাঞ্জি মাস্টার প্র্যাকটিস শিট (100+ Kanji Master Sheet)',
    descBn: '১০০+ জরুরি N5 কাঞ্জির অর্থ, ওন-ইওমি, কুন-ইওমি ও উদাহরণ শব্দ সহ ১০ পৃষ্ঠার হ্যান্ডবুক।',
    filename: 'nihomi-n5-kanji-master-workbook.pdf',
    publicUrl: '/downloads/kana-practice/nihomi-n5-kanji-master-workbook.pdf',
    fileSizeBytes: 454511,
    fileSizeKB: 443.9,
    pages: 10,
    sha256: '18ae336854403143c7b60580971a812df974246fa968e7ec271ff5535359424c',
    sourceOriginal: 'Book PDF/Japanese pdf package_/N5/04_N5_Kanji_Master_Bangla.pdf',
    rightsStatus: 'VERIFIED_ORIGINAL_NIHOMI',
    category: 'writing_practice',
    entitlement: 'FREE'
  }
];


// Third-Party files kept in private staging awaiting formal written redistribution rights
export const THIRD_PARTY_STAGED_SHEETS = [
  {
    key: 'hiragana_nihongo_library',
    filename: 'Hiragana-Nihongo-Library.pdf',
    origin: 'nihongolibrary.com',
    pages: 15,
    sha256: '044364b9314c16123106d348199e4eff4cd97a501870efe5f1fb95da6592757b',
    status: 'BLOCKED_PENDING_RIGHTS_REVIEW'
  },
  {
    key: 'katakana_nihongo_library',
    filename: 'Katakana-Nihongo-Library.pdf',
    origin: 'nihongolibrary.com',
    pages: 23,
    sha256: 'dbd56047cd99ee2ddd4bb2f66147fa8b9e97cced986ab04abefc290b2a3ae7f1',
    status: 'BLOCKED_PENDING_RIGHTS_REVIEW'
  },
  {
    key: 'meguro_combined_kana',
    filename: '16.-Hiragana-and-Katakana-Worksheets-author-Meguro-Language-Center.pdf',
    origin: 'Meguro Language Center (Tokyo)',
    pages: 23,
    sha256: 'ec50a2522effc21e98c2baf851653de44f2086c9e2c8343245122a390048dead',
    status: 'BLOCKED_PENDING_RIGHTS_REVIEW'
  }
];
