// src/views/BaitoOsView.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  FileText,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  Download,
  Sparkles,
  Volume2,
  Store,
  RotateCcw,
  ArrowRight,
  Mic,
  Award,
  AlertCircle,
  Activity,
  Compass,
  Building,
  GraduationCap,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  TrendingUp
} from 'lucide-react';
import { BaitoScenarioItem, BaitoScenarioType } from '../types';
import { ConbiniPosCashierSimulator } from '../components/simulation/ConbiniPosCashierSimulator';
import { InterviewVoiceTwinLab } from '../components/simulation/InterviewVoiceTwinLab';
import { JisRirekishoStudio } from '../components/simulation/JisRirekishoStudio';
import { VoiceTwinPitchLab } from '../components/simulation/VoiceTwinPitchLab';
import { soundEffects } from '../lib/soundEffects';

// Built-in Tokyo Relocation Simulation Scenarios (Zero-lag Hydration & Edge Compatible)
export const DEFAULT_BAITO_SCENARIOS: BaitoScenarioItem[] = [
  {
    id: 'sc-conbini-pos',
    type: 'conbini_pos',
    title: '7-Eleven & Lawson POS Cashier Roleplay',
    titleJa: 'コンビニPOSレジ接客・スキャンと袋詰め演習',
    titleBn: 'কনবিনি ক্যাশ রেজিস্টার ও কাস্টমার সার্ভিস সিমুলেশন',
    subtitle: 'Master fast-paced conbini Keigo, bento heating, point cards, and payment processing.',
    difficulty: 'N5',
    location: '7-Eleven Shinjuku Takadanobaba Ekimae Store',
    interlocutorName: 'Yamamoto-san (Store Manager / Customer)',
    interlocutorRole: 'Tokyo Store Manager & Regular Customers',
    interlocutorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    initialDialogue: {
      ja: 'いらっしゃいませ！温かいお弁当と緑茶をお願いします。あとレジ袋も1枚いただけますか？',
      romaji: 'Irasshaimase! Atatakai obentou to ryokucha o onegai shimasu. Ato rejibukuro mo ichimai itadakemasu ka?',
      bn: 'স্বাগতম! একটি ওবেন্তো (গরম করে দেবেন) ও গ্রিন টি দিন। সাথে একটা শপিং ব্যাগও দিন।',
      en: 'Welcome! Please heat up this bento and I will take this green tea. Also one plastic bag please.'
    },
    objectives: [
      'Scan barcodes & greet with Irasshaimase (いらっしゃいませ)',
      'Confirm bento heating (お弁当温めますか？)',
      'Ask for Point Card (ポイントカードはお持ちですか？)',
      'Confirm plastic bag & chopsticks (お袋とお箸はお付けしますか？)',
      'Process exact payment & receipt handover (お釣り500円とレシートでございます)'
    ],
    contextDescription: 'Conbini shifts are the #1 entry-level student job in Tokyo (28 hrs/week). Accuracy and swift polite Japanese are essential to keep customer lines moving.',
    keyVocabulary: [
      { ja: 'いらっしゃいませ', kana: 'いらっしゃいませ', meaningBn: 'স্বাগতম', meaningEn: 'Welcome' },
      { ja: '温める', kana: 'あたためる', meaningBn: 'গরম করা (মাইক্রোওয়েভ)', meaningEn: 'To heat up' },
      { ja: 'ポイントカード', kana: 'ぽいんとかーど', meaningBn: 'পয়েন্ট কার্ড', meaningEn: 'Point Card' },
      { ja: '袋', kana: 'ふくろ', meaningBn: 'প্লাস্টিক ব্যাগ', meaningEn: 'Plastic Bag' },
      { ja: 'お箸', kana: 'おはし', meaningBn: 'চপস্টিকস', meaningEn: 'Chopsticks' },
      { ja: '少々お待ちください', kana: 'しょうしょうおまちください', meaningBn: 'একটু অপেক্ষা করুন', meaningEn: 'Please wait a moment' },
      { ja: 'お預かりいたします', kana: 'おあずかりいたします', meaningBn: 'টাকা গ্রহণ করছি', meaningEn: 'I receive (money)' },
      { ja: 'ありがとうございました', kana: 'ありがとうございました', meaningBn: 'ধন্যবাদ (বিদায়)', meaningEn: 'Thank you very much' }
    ]
  },
  {
    id: 'sc-school-principal',
    type: 'school_principal',
    title: 'Japanese Language School Admission Defense',
    titleJa: '日本語学校・校長面接（入学・奨学金選抜）',
    titleBn: 'জাপানিজ ল্যাঙ্গুয়েজ স্কুল অধ্যক্ষের ইন্টারভিউ',
    subtitle: 'Simulate high-stakes admissions and scholarship interviews with Tokyo School Principals.',
    difficulty: 'N5',
    location: 'Tokyo International Academy (Shinjuku)',
    interlocutorName: 'Yamada Principal (山田校長)',
    interlocutorRole: 'Principal of Tokyo Japanese Language Institute',
    interlocutorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    initialDialogue: {
      ja: 'それでは面接を始めます。まず、あなたのお名前と、日本に留学したい理由を教えていただけますか？',
      romaji: 'Soredewa mensetsu o hajimemasu. Mazu, anata no onamae to, Nihon ni ryuugaku shitai riyuu o oshiete itadakemasu ka?',
      bn: 'তাহলে ইন্টারভিউ শুরু করা যাক। প্রথমে আপনার নাম এবং জাপানে পড়াশোনা করতে আসার কারণ বলুন।',
      en: 'Let us begin the interview. First, could you tell me your name and your reason for wanting to study in Japan?'
    },
    objectives: [
      'Self-introduction using Sonkeigo/Kenjougo basics (〜と申します)',
      'Articulate concrete career plans in Tokyo (IT, engineering, or higher education)',
      'Explain financial stability and sponsorship respectfully',
      'Demonstrate motivation to achieve JLPT N2 within 18 months'
    ],
    contextDescription: 'Language school admission panels look for sincere motivation, discipline, clear financial guarantees, and polite posture.',
    keyVocabulary: [
      { ja: '志望動機', kana: 'しぼうどうき', meaningBn: 'আবেদনের কারণ/উদ্দেশ্য', meaningEn: 'Motivation for applying' },
      { ja: '専門分野', kana: 'せんもんぶんや', meaningBn: 'বিশেষায়িত ক্ষেত্র', meaningEn: 'Specialized field' },
      { ja: '将来の夢', kana: 'しょうらいのゆめ', meaningBn: 'ভবিষ্যতের স্বপ্ন', meaningEn: 'Future dream' },
      { ja: '学費', kana: 'がくひ', meaningBn: 'পড়াশোনার খরচ', meaningEn: 'Tuition fees' }
    ]
  },
  {
    id: 'sc-embassy-visa',
    type: 'embassy_visa',
    title: 'Embassy of Japan & Immigration Visa Screening',
    titleJa: '日本大使館・出入国在留管理局ビザ審査面接',
    titleBn: 'জাপান দূতাবাস ও ইমিগ্রেশন ভিসা ইন্টারভিউ',
    subtitle: 'Practice answering tough questions about your Japanese study history, sponsor, and visa rules.',
    difficulty: 'N4',
    location: 'Embassy of Japan / Tokyo Regional Immigration Bureau',
    interlocutorName: 'Tanaka Immigration Officer (田中審査官)',
    interlocutorRole: 'Senior Visa Examination Officer',
    interlocutorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    initialDialogue: {
      ja: 'こんにちは。在留資格「留学」の申請に関する確認を行います。現在までの日本語学習歴と、日本で勉強したい理由を説明してください。',
      romaji: 'Konnichiwa. Zairyuu shikaku "Ryuugaku" no shinsei ni kansuru kakunin o okonaimasu. Genzai made no nihongo gakushuu-reki to, Nihon de benkyou shitai riyuu o setsumei shite kudasai.',
      bn: 'নমস্কার। "স্টাডি" ভিসার আবেদনের যাচাই-বাছাই করা হচ্ছে। এখন পর্যন্ত কত ঘণ্টা জাপানিজ ভাষা পড়েছেন এবং জাপানে পড়ার কারণ বলুন।',
      en: 'Hello. We are conducting verification for your Student Visa application. Please explain your Japanese study background and reasons for choosing Japan.'
    },
    objectives: [
      'Accurately state Japanese study hours (150+ hours certificate)',
      'Confirm JLPT N5/N4 score and kanji proficiency',
      'Explain financial sponsor income source and bank solvency',
      'Affirm strict compliance with 28 hrs/week baito work limits'
    ],
    contextDescription: 'Immigration officers test whether your Japanese proficiency is genuine and if you intend to return or follow study laws strictly.',
    keyVocabulary: [
      { ja: '在留資格', kana: 'ざいりゅうしかく', meaningBn: 'রেসিডেন্স স্ট্যাটাস / ভিসা', meaningEn: 'Residence status' },
      { ja: '資格外活動許可', kana: 'しかくがいかつどうきょか', meaningBn: 'খন্ডকালীন কাজের অনুমতি (২৮ ঘণ্টা)', meaningEn: 'Part-time work permit' },
      { ja: '学習時間', kana: 'がくしゅうじかん', meaningBn: 'অধ্যয়নের মোট ঘণ্টা', meaningEn: 'Study hours' },
      { ja: '送金', kana: 'そうきん', meaningBn: 'রেমিট্যান্স / টাকা পাঠানো', meaningEn: 'Remittance' }
    ]
  },
  {
    id: 'sc-restaurant-izakaya',
    type: 'restaurant_izakaya',
    title: 'Izakaya & Ramen Shop Hall Staff',
    titleJa: '居酒屋・ラーメン店ホール接客・オーダー取り',
    titleBn: 'ইজাকায়া ও রেস্তোরাঁ হল স্টাফ সার্ভিস',
    subtitle: 'Master loud, energetic Japanese greetings, beer serving, and special dietary requests.',
    difficulty: 'N4',
    location: 'Torikizoku Shibuya Hachiko-mae Store',
    interlocutorName: 'Sato Store Leader (佐藤店長)',
    interlocutorRole: 'Izakaya Shift Leader & Regular Patrons',
    interlocutorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    initialDialogue: {
      ja: 'すみません！生ビール2つと焼き鳥盛り合わせ、あと枝豆をお願いします！',
      romaji: 'Sumimasen! Namabiiru futatsu to yakitori moriawase, ato edamame o onegai shimasu!',
      bn: 'এক্সকিউজ মি! দুটি ড্রাফট বেভারেজ, ইয়াকিতোরি প্ল্যাটার এবং এদামামে দিন!',
      en: 'Excuse me! Two draft beers, an assortment of yakitori skewers, and edamame please!'
    },
    objectives: [
      'Respond instantly with Yorokonde! (喜んで！)',
      'Repeat table orders accurately (ご注文を繰り返します)',
      'Deliver dishes safely with Keigo (お待たせいたしました)',
      'Handle bill splitting (お会計は別々になさいますか？)'
    ],
    contextDescription: 'Izakaya dining is fast and lively. Staff must speak with brisk clarity, smile, and handle rapid drink orders.',
    keyVocabulary: [
      { ja: '喜んで', kana: 'よろこんで', meaningBn: 'আনন্দের সাথে (অবশ্যই)', meaningEn: 'With pleasure / Right away!' },
      { ja: 'ご注文', kana: 'ごちゅうもん', meaningBn: 'অর্ডার', meaningEn: 'Your order' },
      { ja: 'お待たせいたしました', kana: 'おまたせいたしました', meaningBn: 'অপেক্ষা করানোর জন্য দুঃখিত', meaningEn: 'Sorry to keep you waiting' },
      { ja: 'お会計', kana: 'おかいけい', meaningBn: 'বিল/হিসাব', meaningEn: 'Bill / Check' }
    ]
  },
  {
    id: 'sc-factory-genba',
    type: 'factory_genba',
    title: 'Tokyo Bento Processing Line & Genba Safety',
    titleJa: '食品工場・弁当ライン作業（指差し呼称・衛生プロトコル）',
    titleBn: 'বেন্তো ফ্যাক্টরি ফুড প্রসেসিং লাইন ও সেইফটি কলআউট',
    subtitle: 'Master fast-paced assembly commands, hairnet/roller hygiene checklist, and 85°C heat inspection.',
    difficulty: 'N5',
    location: 'Chiba Narita Bento Manufacturing Genba',
    interlocutorName: 'Matsuda Hancho (松田班長)',
    interlocutorRole: 'Factory Floor Shift Leader',
    interlocutorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    initialDialogue: {
      ja: 'おはようございます！ラインに入る前にエアシャワーと粘着ローラーはかけましたか？今日の目標は1分40食です。安全第一で指差し確認、ヨシ！',
      romaji: 'Ohayou gozaimasu! Rain ni hairu mae ni ea shawaa to nenchaku rooraa wa kakemashita ka? Kyou no mokuhyou wa ippun yonjuu-shoku desu. Anzen daiichi de yubisashi kakunin, yoshi!',
      bn: 'শুভ সকাল! প্রোডাকশন লাইনে ঢোকার আগে এয়ার শাওয়ার ও হেয়ার রোলার চালিয়েছেন তো? আজকের টার্গেট প্রতি মিনিটে ৪০টি খাবার প্যাক করা। সেইফটি ফার্স্ট!',
      en: 'Good morning! Did you complete the air shower and sticky roller check before entering the line? Today target is 40 packs/minute. Safety first, point and call, all good!'
    },
    objectives: [
      'Confirm sanitation & roller checklist (衛生チェック完了いたしました)',
      'Call out safety point and call (加熱温度85度以上、ヨシ！)',
      'Acknowledge urgent line speed commands (かしこまりました！)',
      'Report defective bento or packaging flaw (異物混入の恐れがあります)'
    ],
    contextDescription: 'Factory & Food lines are one of the most common early jobs for language students. Speed, hygiene rules, and sharp short confirmations are critical.',
    keyVocabulary: [
      { ja: '指差し確認', kana: 'ゆびさしかくにん', meaningBn: 'আঙ্গুল দিয়ে নিশ্চিতকরণ (Point & Call)', meaningEn: 'Point and call verification' },
      { ja: '安全第一', kana: 'あんぜんだいいち', meaningBn: 'নিরাপত্তা সবার আগে', meaningEn: 'Safety first' },
      { ja: '衛生管理', kana: 'えいせいかんり', meaningBn: 'স্বাস্থ্যবিধি ব্যবস্থাপনা', meaningEn: 'Hygiene control' },
      { ja: '賞味期限', kana: 'しょうみきげん', meaningBn: 'মেয়াদোত্তীর্ণের তারিখ', meaningEn: 'Best-before date' },
      { ja: 'かしこまりました', kana: 'かしこまりました', meaningBn: 'স্পষ্ট বুঝতে পেরেছি', meaningEn: 'Understood / Roger' }
    ]
  },
  {
    id: 'sc-hotel-shukuba',
    type: 'hotel_shukuba',
    title: 'Ryokan & Hotel Front Desk Omotenashi',
    titleJa: '老舗旅館・ホテルフロント接客（チェックイン・荷物預かり）',
    titleBn: 'জাপানিজ হোটেল ও রিয়োকান ফ্রন্ট ডেস্ক হসপিটালিটি',
    subtitle: 'Master highest-tier Kenjougo/Sonkeigo, check-in registration, onsen rules, and luggage storage.',
    difficulty: 'N4',
    location: 'Asakusa Traditional Ryokan (Tokyo)',
    interlocutorName: 'Okami-san (女将) & International Guests',
    interlocutorRole: 'Head Ryokan Mistress & Front Supervisor',
    interlocutorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    initialDialogue: {
      ja: 'いらっしゃいませ。当館へお越しいただき誠にありがとうございます。ご宿泊のご予約をお伺いしてもよろしいでしょうか？',
      romaji: 'Irasshaimase. Toukan e okoshi itadaki makoto ni arigatou gozaimasu. Goshukuhaku no goyoyaku o oukagai shitemo yoroshii deshou ka?',
      bn: 'স্বাগতম। আমাদের রিয়োকানে আসার জন্য আন্তরিক ধন্যবাদ। আপনার রুম রিজার্ভেশন চেক করার জন্য নামটি জানতে পারি কি?',
      en: 'Welcome. Thank you very much for visiting our Ryokan. May I inquire about your reservation name please?'
    },
    objectives: [
      'Welcome guests with formal Omotenashi Keigo (誠にありがとうございます)',
      'Verify passport and fill Japanese registration card',
      'Explain Onsen bath hours and Yukata etiquette',
      'Store luggage safely with receipt tags (お荷物をお預かりいたします)'
    ],
    contextDescription: 'Traditional hotel hospitality (Omotenashi) requires humble forms (Kenjougo) and refined customer posture.',
    keyVocabulary: [
      { ja: '誠にありがとうございます', kana: 'まことにありがとうございます', meaningBn: 'অশেষ ধন্যবাদ', meaningEn: 'Thank you very much' },
      { ja: 'ご宿泊', kana: 'ごしゅくはく', meaningBn: 'আপনার অবস্থান (Stay)', meaningEn: 'Your stay' },
      { ja: 'お預かりいたします', kana: 'おあずかりいたします', meaningBn: 'আমরা যত্নে রাখছি', meaningEn: 'We will hold / keep' },
      { ja: '温泉の入り方', kana: 'おんせんのはいりかた', meaningBn: 'অনসেন ব্যবহারের নিয়ম', meaningEn: 'Onsen bath rules' },
      { ja: '朝食券', kana: 'ちょうしょくけん', meaningBn: 'সকালের নাস্তার কুপন', meaningEn: 'Breakfast voucher' }
    ]
  },
  {
    id: 'sc-cafe-fastfood',
    type: 'cafe_fastfood',
    title: 'Tokyo Cafe & Fast-Food Counter Ordering',
    titleJa: '都内カフェ・ファストフード接客（イートイン・サイズ確認）',
    titleBn: 'টোকিও ক্যাফে ও ফাস্টফুড কাউন্টার অর্ডার ম্যানেজমেন্ট',
    subtitle: 'Handle rapid order taking, Dine-in vs Takeout tax differentiation, drink sizing, and contactless IC cards.',
    difficulty: 'N5',
    location: 'Shinjuku Station South Exit Coffee Counter',
    interlocutorName: 'Fast-Paced Morning Commuters',
    interlocutorRole: 'Tokyo Morning Office Workers & Regulars',
    interlocutorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    initialDialogue: {
      ja: '注文お願いします！アイスキャラメルラテのグランデを1つと、照り焼きバーガーセットで。あ、店内です！Suicaで払えますか？',
      romaji: 'Chuumon onegai shimasu! Aisu kyarameru rate no gurande o hitotsu to, teriyaki baagaa setto de. A, tennai desu! Suica de haraemasu ka?',
      bn: 'অর্ডার দিন! একটি আইস ক্যারামেল লাতে (গ্রান্দে সাইজ) এবং তেরিয়াকি বার্গার মিল সেট। আমি ভেতরে বসে খাব! সুইকা কার্ডে পে করা যাবে?',
      en: 'Can I order please! One Iced Caramel Latte (Grande) and a Teriyaki Burger set. Dine-in please! Can I pay with Suica?'
    },
    objectives: [
      'Confirm Dine-in vs Takeout (店内でお召し上がりですか / お持ち帰りですか)',
      'Clarify drink temperature & sizing (ホットかアイス、どちらになさいますか？)',
      'Process Suica / Pasmo transit contactless payment (端末にタッチをお願いします)',
      'Hand over order ticket with Keigo (番号札をお持ちになってお待ちください)'
    ],
    contextDescription: 'Busy station cafes require fast, accurate differentiation between 10% eat-in and 8% takeout tax, plus seamless contactless register operation.',
    keyVocabulary: [
      { ja: '店内でお召し上がり', kana: 'てんないでおめしあがり', meaningBn: 'দোকানের ভেতরে খাওয়া (Dine-in)', meaningEn: 'Dine-in' },
      { ja: 'お持ち帰り', kana: 'おもちかえり', meaningBn: 'পার্সেল / টেকআউট (Takeout)', meaningEn: 'Takeout' },
      { ja: 'タッチしてください', kana: 'たっちしてください', meaningBn: 'কার্ড টাচ করুন', meaningEn: 'Please tap your IC card' },
      { ja: '番号札', kana: 'ばんごうふだ', meaningBn: 'টোকেন / নম্বর স্লিপ', meaningEn: 'Order number token' },
      { ja: 'お会計', kana: 'おかいけい', meaningBn: 'মোট বিল / মূল্য পরিশোধ', meaningEn: 'Bill / Payment' }
    ]
  }
];

interface BaitoOsViewProps {
  onNavigate?: (view: string, params?: Record<string, any>) => void;
  initialScenarioId?: string;
  initialTab?: 'pos_terminal' | 'interview_lab' | 'rirekisho' | 'pitch_lab';
}

export const BaitoOsView: React.FC<BaitoOsViewProps> = ({ onNavigate, initialScenarioId, initialTab }) => {
  const [activeTab, setActiveTab] = useState<'pos_terminal' | 'interview_lab' | 'rirekisho' | 'pitch_lab'>(initialTab || 'pos_terminal');
  const [scenarios, setScenarios] = useState<BaitoScenarioItem[]>(() => DEFAULT_BAITO_SCENARIOS);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(initialScenarioId || 'sc-conbini-pos');
  const [ambientMode, setAmbientMode] = useState<'off' | 'conbini' | 'cafe' | 'factory'>('off');
  const [rushHourActive, setRushHourActive] = useState<boolean>(false);
  const [rushHourSeconds, setRushHourSeconds] = useState<number>(45);

  useEffect(() => {
    if (initialScenarioId) setSelectedScenarioId(initialScenarioId);
    if (initialTab) setActiveTab(initialTab);
  }, [initialScenarioId, initialTab]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userReadinessStats, setUserReadinessStats] = useState({
    conbiniPassed: 12,
    interviewPassed: 4,
    rirekishoScore: 95,
    pitchAccentMastery: 88
  });

  // Ambient sound synthesis lifecycle
  useEffect(() => {
    if (ambientMode === 'off') {
      soundEffects.stopAmbient();
    } else {
      soundEffects.startAmbient(ambientMode);
    }
    return () => {
      soundEffects.stopAmbient();
    };
  }, [ambientMode]);

  // Rush Hour pressure countdown
  useEffect(() => {
    if (!rushHourActive) return;
    const interval = setInterval(() => {
      setRushHourSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRushHourActive(false);
          soundEffects.playIncorrectSoft();
          return 0;
        }
        if (prev <= 6) {
          soundEffects.playTick();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [rushHourActive]);

  const handleToggleRushHour = () => {
    soundEffects.playButtonTap();
    if (rushHourActive) {
      setRushHourActive(false);
    } else {
      setRushHourSeconds(45);
      setRushHourActive(true);
    }
  };

  const handleResetRushHour = () => {
    soundEffects.playButtonTap();
    setRushHourSeconds(45);
    setRushHourActive(true);
  };

  // Fetch scenarios from API with 250ms hard failsafe timer
  useEffect(() => {
    let isMounted = true;
    const failsafeTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 250);

    fetch('/api/baito/scenarios')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.scenarios && data.scenarios.length > 0) {
          setScenarios(data.scenarios);
        }
      })
      .catch((err) => console.warn('[BaitoOsView] Using built-in simulation scenarios:', err))
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
          clearTimeout(failsafeTimer);
        }
      });

    return () => {
      isMounted = false;
      clearTimeout(failsafeTimer);
    };
  }, []);

  const currentScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  const handleSelectScenario = (scenario: BaitoScenarioItem) => {
    soundEffects.playButtonTap();
    setSelectedScenarioId(scenario.id);

    if (scenario.type === 'conbini_pos') {
      setActiveTab('pos_terminal');
    } else {
      setActiveTab('interview_lab');
    }
  };

  return (
    <div id="baito-os-view" className="min-h-screen bg-slate-950 text-slate-100 pt-28 md:pt-36 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Banner with Neo-Tokyo Aesthetic */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-amber-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NIHOMI WORKOS™ • Experience Japan. Before You Arrive.</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
                日本の職場・実務シミュレーター <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-rose-400">
                  Nihomi WorkOS™ Workplace Simulation
                </span>
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Experience Japan. Before You Arrive. コンビニPOSレジ・レストラン接客・工場安全・面接をリアルタイムに体験。失敗から学び、Nihomi Sensei AI™の指導で確実にレベルアップしましょう。
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>シミュレーション演習 • 教育目的の学習環境です（特定企業や公的資格の保証ではありません）</span>
              </div>
            </div>

            {/* Quick Readiness Scorecard */}
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto shrink-0 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl shadow-inner">
              <div className="text-center p-3 rounded-xl bg-slate-900 border border-amber-500/20">
                <div className="text-xs text-slate-400 font-medium">バイト即戦力</div>
                <div className="text-xl font-black text-amber-400 mt-0.5">96%</div>
                <div className="text-[10px] text-emerald-400">Ready for Shift</div>
              </div>

              <div className="text-center p-3 rounded-xl bg-slate-900 border border-cyan-500/20">
                <div className="text-xs text-slate-400 font-medium">ビザ・面接突破</div>
                <div className="text-xl font-black text-cyan-400 mt-0.5">92%</div>
                <div className="text-[10px] text-emerald-400">High Approval</div>
              </div>
            </div>
          </div>

          {/* Hub Navigation Tabs & Immersion Control Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => {
                  soundEffects.playButtonTap();
                  setActiveTab('pos_terminal');
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
                  activeTab === 'pos_terminal'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>🏪 コンビニPOSレジ端末 (Conbini POS)</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playButtonTap();
                  setActiveTab('interview_lab');
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
                  activeTab === 'interview_lab'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>🎙️ 校長・大使館・バイト面接 (Interview Twin)</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playButtonTap();
                  setActiveTab('rirekisho');
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
                  activeTab === 'rirekisho'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>📝 JIS日本標準 履歴書 (Rirekisho Studio)</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.playButtonTap();
                  setActiveTab('pitch_lab');
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
                  activeTab === 'pitch_lab'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>🌊 東京ピッチアクセント波形ラボ (Pitch Lab)</span>
              </button>
            </div>

            {/* Immersion Bar: Tokyo Ambient Audio & Rush-Hour Pressure Mode */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 bg-slate-950/60 p-3.5 rounded-2xl">
              {/* Tokyo Ambient Audio Toggle */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-1">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>東京環境音 (Ambience):</span>
                </span>
                <div className="inline-flex items-center rounded-xl bg-slate-900 p-1 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playButtonTap();
                      setAmbientMode('off');
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                      ambientMode === 'off' ? 'bg-slate-800 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Off
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playButtonTap();
                      setAmbientMode('conbini');
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                      ambientMode === 'conbini' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🏪 7-Elevenチャイム
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playButtonTap();
                      setAmbientMode('cafe');
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                      ambientMode === 'cafe' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ☕ 都内カフェ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playButtonTap();
                      setAmbientMode('factory');
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                      ambientMode === 'factory' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🏭 弁当ライン
                  </button>
                </div>
              </div>

              {/* Rush Hour Pressure Countdown Mode */}
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleToggleRushHour}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    rushHourActive
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-1 ring-rose-500/30'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 ${rushHourActive ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
                  <span>{rushHourActive ? 'ラッシュアワー計測中' : '⚡ ラッシュアワー突入 (45s)'}</span>
                </button>

                {rushHourActive && (
                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-xl border border-rose-500/30">
                    <Clock className={`w-3.5 h-3.5 ${rushHourSeconds <= 10 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
                    <span className={`font-mono text-xs font-bold ${rushHourSeconds <= 10 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
                      {rushHourSeconds}s
                    </span>
                    <button
                      type="button"
                      onClick={handleResetRushHour}
                      className="p-1 text-slate-400 hover:text-slate-200 transition"
                      title="Reset 45s Rush Hour Timer"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tokyo Relocation Scenario Selector Carousel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              東京現地シミュレーション シナリオ選択 (Select Relocation Scenario)
            </h2>
            <span className="text-xs text-slate-500 font-mono">全{scenarios.length}シナリオ収録</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scenarios.map((sc) => {
              const isSelected = selectedScenarioId === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3.5 group relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border-amber-500 shadow-xl ring-1 ring-amber-500/30'
                      : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={sc.interlocutorAvatar}
                    alt={sc.interlocutorName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0 group-hover:scale-105 transition"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400">
                        {sc.difficulty}
                      </span>
                      <span className="text-[11px] text-slate-400">{sc.location}</span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-100 mt-1 truncate group-hover:text-amber-300 transition">
                      {sc.titleJa}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">{sc.titleBn}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Interactive Workspace based on Active Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'pos_terminal' && (
            <motion.div
              key="pos"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <ConbiniPosCashierSimulator />
            </motion.div>
          )}

          {activeTab === 'interview_lab' && currentScenario && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <InterviewVoiceTwinLab scenario={currentScenario} />
            </motion.div>
          )}

          {activeTab === 'rirekisho' && (
            <motion.div
              key="rirekisho"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <JisRirekishoStudio onNavigate={onNavigate} />
            </motion.div>
          )}

          {activeTab === 'pitch_lab' && (
            <motion.div
              key="pitch"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <VoiceTwinPitchLab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const NihomiWorkOsView = BaitoOsView;
export type { BaitoOsViewProps, BaitoOsViewProps as NihomiWorkOsViewProps };
