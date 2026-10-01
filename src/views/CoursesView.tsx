import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Filter,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Compass,
  Award,
  Zap,
  Layers,
  Check,
  ChevronRight,
  Clock,
  Flame,
  Globe2,
  Briefcase,
  Search,
  X,
  GraduationCap,
  Crown
} from 'lucide-react';
import { Course, JLPTLevel } from '../types/nihomi';
import { LessonPlayerModal } from '../components/learning/LessonPlayerModal';
import { ZeroJapaneseGatewayModal } from '../components/onboarding/ZeroJapaneseGatewayModal';
import { N5LessonDetailModal } from '../components/learning/N5LessonDetailModal';
import { useAuth } from '../context/AuthContext';
import n5MasterData from '../data/n5_master.json';
import n4MasterData from '../data/n4_master.json';
import n3MasterData from '../data/n3_master.json';
import n2MasterData from '../data/n2_master.json';
import n1MasterData from '../data/n1_master.json';
import { N5MasterLesson } from '../types/n5Master';
import { FuriganaText } from '../utils/furigana';

interface CoursesViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

const ALL_COURSES_CATALOG: Course[] = [
  {
    id: 'c1',
    title: 'Minna no Nihongo I (Grammar & Sentence Patterns)',
    titleJa: 'みんなの日本語 初級I 文法・基本文型',
    level: 'N5',
    progressPercent: 76,
    totalLessons: 25,
    completedLessons: 19,
    currentLessonTitle: 'Lesson 1: Self-Introduction & ~は ~です (自己紹介)',
    category: 'GRAMMAR',
  },
  {
    id: 'c2',
    title: 'Essential 100 Foundational Kanji & Radicals Workshop',
    titleJa: 'JLPT N5 必須100漢字と部首・筆順演習',
    level: 'N5',
    progressPercent: 92,
    totalLessons: 12,
    completedLessons: 11,
    currentLessonTitle: 'Set 1: Sun, Origin, Person & Language Kanji',
    category: 'KANJI',
  },
  {
    id: 'c3',
    title: 'Tokyo Conversation & Daily Life Survival Lab',
    titleJa: '日本語学校・東京生活サバイバル会話',
    level: 'N5',
    progressPercent: 50,
    totalLessons: 6,
    completedLessons: 3,
    currentLessonTitle: 'Session 2: Ordering at Restaurant & Train Stations',
    category: 'INTERVIEW_PREP',
  },
  {
    id: 'c4',
    title: 'Minna no Nihongo II (Intermediate Grammar & Particles)',
    titleJa: 'みんなの日本語 初級II 文法・複合表現',
    level: 'N4',
    progressPercent: 20,
    totalLessons: 25,
    completedLessons: 5,
    currentLessonTitle: 'Lesson 26: ~んです Explanatory Form',
    category: 'GRAMMAR',
  },
  {
    id: 'c5',
    title: 'JLPT N4 300 Kanji & Reading Comprehension Accelerator',
    titleJa: 'JLPT N4 漢字300字と読解スピードマスター',
    level: 'N4',
    progressPercent: 15,
    totalLessons: 18,
    completedLessons: 2,
    currentLessonTitle: 'Module 3: Short Passage Logic & Inference',
    category: 'READING',
  },
  {
    id: 'c6',
    title: 'JLPT N3 Bridge to Fluency & Workplace Japanese',
    titleJa: 'JLPT N3 中級総合・ビジネス日本語基礎',
    level: 'N3',
    progressPercent: 0,
    totalLessons: 30,
    completedLessons: 0,
    currentLessonTitle: 'Lesson 1: Formal Speech & Nuance Distinction',
    category: 'GRAMMAR',
  },
  {
    id: 'c7',
    title: 'JLPT N2 Executive Business Japanese & Advanced Fluency',
    titleJa: 'JLPT N2 上級総合・ビジネス折衝マスター',
    level: 'N2',
    progressPercent: 0,
    totalLessons: 45,
    completedLessons: 0,
    currentLessonTitle: 'Lesson 1: Contrary to Expectations & Regulations (~に反して)',
    category: 'GRAMMAR',
  },
  {
    id: 'c8',
    title: 'JLPT N1 C-Suite Leadership & Executive Fluency Masterclass',
    titleJa: 'JLPT N1 最高峰総合・役員折衝＆格調日本語マスター',
    level: 'N1',
    progressPercent: 0,
    totalLessons: 45,
    completedLessons: 0,
    currentLessonTitle: 'Lesson 1: Through, Via, After Experiencing (~を経て)',
    category: 'GRAMMAR',
  },
];

export const N5_MODULES_LIST = [
  { id: 0, code: 'MOD-0', titleEn: 'Script & Numbers', titleBn: 'বর্ণমালা ও সংখ্যা', titleJa: '文字と数字', lessonsRange: 'L01–L05', desc: 'あいうえお, かさたな, はまやらわ, カタカナ, এবং সংখ্যা ১-১০০০০' },
  { id: 1, code: 'MOD-1', titleEn: 'Identity & Pointers', titleBn: 'পরিচয় ও নির্দেশক', titleJa: '自己紹介と指示詞', lessonsRange: 'L06–L10', desc: 'わたしは学生です, だれの本ですか, これもペンです, これそれあれ, ここは教室です' },
  { id: 2, code: 'MOD-2', titleEn: 'Existence & Time', titleBn: 'অস্তিত্ব ও সময়', titleJa: '存在と時間', lessonsRange: 'L11–L15', desc: 'あります/います, 七時に起きます, から・まで, 一時間勉強します, 日曜日に行きます' },
  { id: 3, code: 'MOD-3', titleEn: 'Movement & Transactions', titleBn: 'চলাচল ও লেনদেন', titleJa: '移動と行為', lessonsRange: 'L16–L20', desc: '日本へ行きます, バスで行きます, パンを食べます, デパートで買います, 友達に会います' },
  { id: 4, code: 'MOD-4', titleEn: 'Adjectives & Preference', titleBn: 'বিশেষণ ও পছন্দ', titleJa: '形容詞と嗜好', lessonsRange: 'L21–L25', desc: '富士山は高いです, この町は静かです, 日本語が好きです, どれがいちばん好き, 水がほしいです' },
  { id: 5, code: 'MOD-5', titleEn: 'Te-Form Revolution', titleBn: 'তে-ফর্ম বিপ্লব', titleJa: 'て形革命', lessonsRange: 'L26–L30', desc: '食べてください, 今何をしていますか, 入ってもいいですか, 食べてから行きます, 〜たり〜たりします' },
  { id: 6, code: 'MOD-6', titleEn: 'Ability, Past & Casual', titleBn: 'সক্ষমতা, অতীত ও কথ্যরূপ', titleJa: '能力と過去', lessonsRange: 'L31–L35', desc: '読むことができます, 寝る前に本を読みます, 食べたことがあります, 〜たほうがいい, 普通形/Casual' },
  { id: 7, code: 'MOD-7', titleEn: 'Decisions & Completion', titleBn: 'সিদ্ধান্ত ও সমাপন', titleJa: '判断と修了', lessonsRange: 'L36–L40', desc: '〜から〜です, 〜と思います, 〜でしょう, 〜と言いました, 〜ことになります / N5 Capstone' },
];

export const N4_MODULES_LIST = [
  { id: 1, code: 'MOD-1', titleEn: 'Explanations & Requests', titleBn: 'ব্যাখ্যা ও বিনীত অনুরোধ', titleJa: '説明と依頼', lessonsRange: 'N4-L01–N4-L05', desc: '〜んです, 〜ていただけませんか, どうしたらいいですか, 名詞化の「の」, 理由と接続' },
  { id: 2, code: 'MOD-2', titleEn: 'Potential & Habits', titleBn: 'সক্ষমতা ও অভ্যাস', titleJa: '能力と習慣', lessonsRange: 'N4-L06–N4-L10', desc: '動詞の可能形, 知覚動詞と可能, 並行動作（ながら）, 並列理由（〜し、〜し）, 習慣と継続状態' },
  { id: 3, code: 'MOD-3', titleEn: 'Transitivity & State', titleBn: 'অকর্মক-সকর্মক ও প্রস্তুতি', titleJa: '自他動詞と状態', lessonsRange: 'N4-L11–N4-L15', desc: '自動詞と他動詞, 結果の状態（〜てある）, 準備の表現（〜ておく）, アスペクト, 完了と遺憾' },
  { id: 4, code: 'MOD-4', titleEn: 'Intentions & Advice', titleBn: 'উদ্দেশ্য ও সুপরামর্শ', titleJa: '意図と助言', lessonsRange: 'N4-L16–N4-L20', desc: '意向形の活用, 意図と決意（〜つもり）, 予定・計画, 助言・アドバイス, 推量と可能性' },
  { id: 5, code: 'MOD-5', titleEn: 'Conditionals & Favors', titleBn: 'আদেশ, শর্ত ও দেওয়া-নেওয়া', titleJa: '命令・条件・授受', lessonsRange: 'N4-L21–N4-L25', desc: '命令・禁止, 伝聞と意味の伝達, 指示通りと順序, 授受表現の発展, 四つの条件表現' },
  { id: 6, code: 'MOD-6', titleEn: 'Passive, Causative & Keigo', titleBn: 'কর্মবাচ্য, প্রযোজক ও কেইগো', titleJa: '受身・使役・敬語', lessonsRange: 'N4-L26–N4-L30', desc: '受身の構造, 使役の表現, 使役受身, 敬語：尊敬語, 敬語：謙譲語' },
  { id: 7, code: 'MOD-7', titleEn: 'Modals & N4 Capstone', titleBn: 'চূড়ান্ত প্রয়োগ ও N4 ক্যাপস্টোন', titleJa: '様態とN4総まとめ', lessonsRange: 'N4-L31–N4-L35', desc: '様態と伝聞, 過度と難易, 習慣化と変化, 目的の表現, N4 総まとめ・合格演習' },
];

export const N3_MODULES_LIST = [
  { id: 1, code: 'MOD-1', titleEn: 'Timing & Sequence', titleBn: 'সময় ও ধারাবাহিকতা', titleJa: '時 (Timing & Sequence)', lessonsRange: 'N3-L01–N3-L05', desc: '〜うちに, 〜間・間に, 〜最中に, 〜たとたん, 〜たびに' },
  { id: 2, code: 'MOD-2', titleEn: 'Reasoning & Expectations', titleBn: 'যৌক্তিক পরিণতি ও প্রত্যাশা', titleJa: '論理 (Reasoning & Expectations)', lessonsRange: 'N3-L06–N3-L10', desc: '〜わけだ・わけがない, 〜わけではない, 〜はずだ・はずがない, 〜べきだ, 〜に違いない' },
  { id: 3, code: 'MOD-3', titleEn: 'Inference & Subjectivity', titleBn: 'অনুমান ও ভাবানুভূতি', titleJa: '推量 (Inference & Subjectivity)', lessonsRange: 'N3-L11–N3-L15', desc: '〜らしい, 〜っぽい, 〜ようだ・ように, 〜そうだ (様態・伝聞), 〜気がする' },
  { id: 4, code: 'MOD-4', titleEn: 'Relationships & Perspectives', titleBn: 'সম্পর্ক ও দৃষ্টিভঙ্গি', titleJa: '関係 (Relationships & Perspectives)', lessonsRange: 'N3-L16–N3-L20', desc: '〜に対して, 〜に関して, 〜にとって, 〜を通じて・通して, 〜に基づいて' },
  { id: 5, code: 'MOD-5', titleEn: 'Change, Effort & Intention', titleBn: 'পরিবর্তন, প্রচেষ্টা ও সংকল্প', titleJa: '変化 (Change, Effort & Intention)', lessonsRange: 'N3-L21–N3-L25', desc: '〜ようにする, 〜ようになる, 〜ことにする, 〜ことになる, 〜一方だ' },
  { id: 6, code: 'MOD-6', titleEn: 'Cause, Effect & Outcomes', titleBn: 'কারণ ও ফলাফল', titleJa: '理由 (Cause, Effect & Outcomes)', lessonsRange: 'N3-L26–N3-L30', desc: '〜おかげで, 〜せいで, 〜ばかりに, 〜によって, 〜ため(に)' },
  { id: 7, code: 'MOD-7', titleEn: 'Comparison & Limitations', titleBn: 'তুলনা ও সীমাবদ্ধতা', titleJa: '限定 (Comparison & Limitations)', lessonsRange: 'N3-L31–N3-L35', desc: '〜ばかり, 〜だけでなく, 〜に限る・限らず, 〜に比べて, 〜割に(は)' },
  { id: 8, code: 'MOD-8', titleEn: 'Advanced Keigo & Interviews', titleBn: 'উন্নত কেইগো ও কর্মক্ষেত্র', titleJa: '敬語 (Advanced Keigo & Interviews)', lessonsRange: 'N3-L36–N3-L40', desc: '尊敬語 (お〜になる), 謙譲語 (お〜する/参る), ビジネス電話応対, メール・断り方, 就職面接・自己PR' },
  { id: 9, code: 'MOD-9', titleEn: 'Mastery & N3 Capstone', titleBn: 'সার্বিক সংহতি ও সমাপনী কৌশল', titleJa: '統合 (Mastery & N3 Capstone)', lessonsRange: 'N3-L41–N3-L45', desc: '長文読解・情報検索, 聴解・即時応答, 複合動詞・コロケーション, 文法総整理, N3総合模試・N2への架け橋' },
];

export const N2_MODULES_LIST = [
  { id: 1, code: 'MOD-1', titleEn: 'Opposition & Contrast', titleBn: 'বৈপরীত্য ও অপ্রত্যাশিত ফল', titleJa: '逆説と結果 (Opposition & Contrast)', lessonsRange: 'N2-L01–N2-L05', desc: '〜に反して, 〜にもかかわらず, 〜つつも, 〜からといって, 〜くせに' },
  { id: 2, code: 'MOD-2', titleEn: 'Determination & Obligation', titleBn: 'অনিবার্য বাধ্যবাধকতা ও অনুভূতি', titleJa: '決意と義務 (Determination & Obligation)', lessonsRange: 'N2-L06–N2-L10', desc: '〜ざるを得ない, 〜てたまらない/てならない, 〜わけにはいかない, 〜かねない/かねる, 〜にほかならない' },
  { id: 3, code: 'MOD-3', titleEn: 'Inference & Conviction', titleBn: 'দৃঢ় অনুমান, প্রত্যয় ও ঝুঁকি', titleJa: '推量と確信 (Inference & Conviction)', lessonsRange: 'N2-L11–N2-L15', desc: '〜に違いない, 〜に相違ない, 〜にすぎない, 〜っこない, 〜恐れがある' },
  { id: 4, code: 'MOD-4', titleEn: 'Conditions & Hypotheses', titleBn: 'শর্ত, উপলক্ষ ও দীর্ঘ প্রক্রিয়া', titleJa: '条件と仮定 (Conditions & Hypotheses)', lessonsRange: 'N2-L16–N2-L20', desc: '〜さえ〜ば, 〜次第, 〜以上(は), 〜折(に), 〜末(に)' },
  { id: 5, code: 'MOD-5', titleEn: 'Cause, Catalyst & Grounds', titleBn: 'সুযোগ, পটভূমি ও কারণ', titleJa: '理由と契機 (Cause & Catalyst)', lessonsRange: 'N2-L21–N2-L25', desc: '〜を契機に, 〜をきっかけに, 〜ばかりに, 〜からこそ, 〜につけ' },
  { id: 6, code: 'MOD-6', titleEn: 'Standards & Relations', titleBn: 'মানদণ্ড, প্রাসঙ্গিকতা ও বিতর্ক', titleJa: '基準と関連 (Standards & Relations)', lessonsRange: 'N2-L26–N2-L30', desc: '〜に即して, 〜に基づいて, 〜を巡って, 〜を問わず, 〜に応じて' },
  { id: 7, code: 'MOD-7', titleEn: 'Emphasis & Boundaries', titleBn: 'বিশেষ গুরুত্ব, পরিধি ও চরমতা', titleJa: '強調と限定 (Emphasis & Boundaries)', lessonsRange: 'N2-L31–N2-L35', desc: '〜のみならず, 〜ばかりか, 〜に限って, 〜どころか, 〜にとどまらず' },
  { id: 8, code: 'MOD-8', titleEn: 'Advanced Keigo & Business', titleBn: 'উচ্চাঙ্গ কেইগো ও করপোরেট সংস্কৃতি', titleJa: '上級敬語とビジネス (Advanced Keigo & Business)', lessonsRange: 'N2-L36–N2-L40', desc: '高度敬意表現, 依頼・辞退のクッション言葉, 社外折衝, 稟議書・ビジネス文書, 危機管理・謝罪対応' },
  { id: 9, code: 'MOD-9', titleEn: 'Integration & Bridge to N1', titleBn: 'N2 সার্বিক সমাপনী ও N1 উত্তরণ', titleJa: 'N2統合演習・読解・N1への架け橋', lessonsRange: 'N2-L41–N2-L45', desc: '評論文長文読解, 総合聴解・即時応答, 複合語・高度コロケーション, 文法総整理, N2総合模試・N1への展望' },
];

export const N1_MODULES_LIST = [
  { id: 1, code: 'MOD-1', titleEn: 'Processes & Endings', titleBn: 'প্রক্রিয়া ও সমাপ্তি', titleJa: '過程と終着 (Processes & Endings)', lessonsRange: 'N1-L01–N1-L05', desc: '〜を経て, 〜に至る, 〜きらいがある, 〜始末だ, 〜極まる/極まりない' },
  { id: 2, code: 'MOD-2', titleEn: 'Reluctant Decisions', titleBn: 'অনিচ্ছাকৃত সিদ্ধান্ত ও বাধ্যবাধকতা', titleJa: '不本意な決定 (Reluctant Decisions)', lessonsRange: 'N1-L06–N1-L10', desc: '〜余儀なくされる, 〜を禁じ得ない, 〜に堪えない, 〜てやまない, 〜ずにはおかない' },
  { id: 3, code: 'MOD-3', titleEn: 'Extreme Limitation', titleBn: 'চরম পর্যায় ও কঠোর সীমাবদ্ধতা', titleJa: '強調・限定・極限 (Extreme Limitation)', lessonsRange: 'N1-L11–N1-L15', desc: '〜極み, 〜たりとも, 〜すら/ですら, 〜だに, 〜ならでは' },
  { id: 4, code: 'MOD-4', titleEn: 'Conditions & Triggers', titleBn: 'শর্ত, অনুঘটক ও অনিবার্য সূচনা', titleJa: '条件と契機 (Conditions & Triggers)', lessonsRange: 'N1-L16–N1-L20', desc: '〜あっての, 〜と相まって, 〜を踏まえて, 〜ばこそ, 〜とあれば' },
  { id: 5, code: 'MOD-5', titleEn: 'Perspectives & Contrast', titleBn: 'দৃষ্টিভঙ্গি ও সূক্ষ্ম বৈপরীত্য', titleJa: '視点と対比 (Perspectives & Contrast)', lessonsRange: 'N1-L21–N1-L25', desc: '〜にかかわる, 〜を皮切りに, 〜をおいて〜ない, 〜を限りに, 〜ともなく' },
  { id: 6, code: 'MOD-6', titleEn: 'Emotional Nuances', titleBn: 'গভীর আবেগ ও মানসিক দৃষ্টিভঙ্গি', titleJa: '感情と心理 (Emotional Nuances)', lessonsRange: 'N1-L26–N1-L30', desc: '〜に堪える/耐える, 〜に忍びない, 〜思いをする, 〜かたがた, 〜がてら' },
  { id: 7, code: 'MOD-7', titleEn: 'Evaluation & Discourse', titleBn: 'পেশাগত নৈতিকতা ও দাবি', titleJa: '評価と主張 (Evaluation & Discourse)', lessonsRange: 'N1-L31–N1-L35', desc: '〜まじき, 〜べからず, 〜べく, 〜べくもない, 〜といったらない' },
  { id: 8, code: 'MOD-8', titleEn: 'Ceremonial Keigo', titleBn: 'সর্বোচ্চ আভিজাত্য ও শাস্ত্রীয় কেইগো', titleJa: '格調と最高峰敬語 (Ceremonial Keigo)', lessonsRange: 'N1-L36–N1-L40', desc: '最高峰敬意表現, 書面・公的通達, 取締役会折衝, 儀礼的祝辞・弔辞, 危機管理声明' },
  { id: 9, code: 'MOD-9', titleEn: 'Capstone & Mastery', titleBn: 'সর্বোচ্চ সমন্বিত মহাফলাফল ও নেতৃত্ব', titleJa: '最高峰総合演習・N1合格・役員レベル実践', lessonsRange: 'N1-L41–N1-L45', desc: '評論文読解ロジック, 四字熟語・コロケーション, 深層聴解, N1文法総整理, N1総合模試・日系役員到達' },
];

export const CoursesView: React.FC<CoursesViewProps> = ({ onNavigate }) => {
  const { user, subscription, progress } = useAuth();

  const isPro =
    user?.role === 'founder' ||
    user?.role === 'admin' ||
    user?.planId === 'pro' ||
    user?.planId === 'japan_ready' ||
    subscription?.planId === 'pro' ||
    subscription?.planId === 'japan_ready' ||
    (user as any)?.subscriptionTier === 'pro' ||
    (user as any)?.subscriptionTier === 'japan_ready';

  // Primary State: Curriculum Level, Active Module, Search, and Lesson Modal
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  const [activeModuleId, setActiveModuleId] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLessonModal, setSelectedLessonModal] = useState<N5MasterLesson | null>(null);

  // Tab: 'pathways' (Sequential 3-Milestone Progression) vs 'catalog' (Browsing All Electives)
  const [activeTab, setActiveTab] = useState<'pathways' | 'catalog'>('pathways');

  // Milestone 1: Kana Foundation state
  const [isFoundationDone, setIsFoundationDone] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nihomi_foundation_completed') === 'true';
    } catch {
      return false;
    }
  });

  // Modal triggers
  const [isKanaLabOpen, setIsKanaLabOpen] = useState(false);
  const [activeCourseToPlay, setActiveCourseToPlay] = useState<Course | null>(null);

  // Filters for catalog tab
  const [catalogLevelFilter, setCatalogLevelFilter] = useState<JLPTLevel | 'ALL'>('ALL');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string>('ALL');

  // Listen for foundation completion events
  useEffect(() => {
    const handleUnlock = () => {
      setIsFoundationDone(true);
    };
    window.addEventListener('nihomi-foundation-unlocked', handleUnlock);
    window.addEventListener('storage', handleUnlock);

    return () => {
      window.removeEventListener('nihomi-foundation-unlocked', handleUnlock);
      window.removeEventListener('storage', handleUnlock);
    };
  }, []);

  // Safe data loading with fallbacks
  const n5Lessons: N5MasterLesson[] = (Array.isArray(n5MasterData) ? n5MasterData : []) as unknown as N5MasterLesson[];
  const n4Lessons: N5MasterLesson[] = (Array.isArray(n4MasterData) ? n4MasterData : []) as unknown as N5MasterLesson[];
  const n3Lessons: N5MasterLesson[] = (Array.isArray(n3MasterData) ? n3MasterData : []) as unknown as N5MasterLesson[];
  const n2Lessons: N5MasterLesson[] = (Array.isArray(n2MasterData) ? n2MasterData : []) as unknown as N5MasterLesson[];
  const n1Lessons: N5MasterLesson[] = (Array.isArray(n1MasterData) ? n1MasterData : []) as unknown as N5MasterLesson[];

  const currentLessonsList =
    selectedLevel === 'N5'
      ? n5Lessons
      : selectedLevel === 'N4'
      ? n4Lessons
      : selectedLevel === 'N3'
      ? n3Lessons
      : selectedLevel === 'N2'
      ? n2Lessons
      : n1Lessons;
  const activeModulesList =
    selectedLevel === 'N5'
      ? N5_MODULES_LIST
      : selectedLevel === 'N4'
      ? N4_MODULES_LIST
      : selectedLevel === 'N3'
      ? N3_MODULES_LIST
      : selectedLevel === 'N2'
      ? N2_MODULES_LIST
      : N1_MODULES_LIST;
  const totalLessonsCount =
    selectedLevel === 'N5' ? 40 : selectedLevel === 'N4' ? 35 : 45;
  const masterCompletedCount =
    selectedLevel === 'N5'
      ? ((progress as any)?.completedLessonsCount || 0)
      : selectedLevel === 'N4'
      ? ((progress as any)?.n4CompletedCount || 0)
      : selectedLevel === 'N3'
      ? ((progress as any)?.n3CompletedCount || 0)
      : selectedLevel === 'N2'
      ? ((progress as any)?.n2CompletedCount || 0)
      : ((progress as any)?.n1CompletedCount || 0);
  const streakDays = user?.streakDays || (progress as any)?.streakDays || 1;
  const activeModule = activeModulesList.find((m) => m.id === activeModuleId) || activeModulesList[0];
  const masteryPercentage = totalLessonsCount > 0 ? Math.min(100, Math.round((masterCompletedCount / totalLessonsCount) * 100)) : 0;

  // Level selector switch handler
  const handleSelectLevel = (level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1') => {
    setSelectedLevel(level);
    setActiveModuleId(level === 'N5' ? 0 : 1);
    setSearchQuery('');
  };

  // Filtered master lessons based on active module & search
  const filteredLessons = currentLessonsList.filter((lesson) => {
    if (lesson.lesson_metadata.module_number !== activeModuleId) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const meta = lesson.lesson_metadata;
      const matchesId = meta.lesson_id.toLowerCase().includes(q) || `lesson ${meta.lesson_number}`.toLowerCase().includes(q);
      const matchesJa = meta.title_ja.toLowerCase().includes(q);
      const matchesBn = meta.title_bn.toLowerCase().includes(q);
      const matchesEn = meta.title_en.toLowerCase().includes(q);
      const matchesMod = meta.module_name?.toLowerCase().includes(q) || meta.module_name_bn?.toLowerCase().includes(q);
      const matchesConcept = lesson.bengali_bridge?.core_concept_bn?.toLowerCase().includes(q) || lesson.bengali_bridge?.explanation_bn?.toLowerCase().includes(q);
      const matchesGrammar = lesson.grammar_points?.some((gp) =>
        gp.pattern_ja?.toLowerCase().includes(q) || gp.pattern_bn?.toLowerCase().includes(q) || gp.explanation_bn?.toLowerCase().includes(q)
      );
      const matchesVocab = lesson.vocabulary_scope?.some((v) =>
        v.word_ja?.toLowerCase().includes(q) || v.meaning_bn?.toLowerCase().includes(q) || v.romaji?.toLowerCase().includes(q)
      );
      return matchesId || matchesJa || matchesBn || matchesEn || matchesMod || matchesConcept || matchesGrammar || matchesVocab;
    }
    return true;
  });

  // Filtered electives for catalog tab
  const filteredCourses = ALL_COURSES_CATALOG.filter((c) => {
    const matchesLevel = catalogLevelFilter === 'ALL' || c.level === catalogLevelFilter;
    const matchesCat = catalogCategoryFilter === 'ALL' || c.category === catalogCategoryFilter;
    return matchesLevel && matchesCat;
  });

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#0D0D11] text-stone-900 dark:text-stone-100 min-h-screen pb-24 font-sans antialiased text-left selection:bg-red-500 selection:text-white transition-colors">
      
      {/* Top Hero Banner */}
      <div className="bg-stone-900 dark:bg-[#09090D] text-white border-b border-stone-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/20 text-red-300 text-xs font-bold rounded-full border border-red-500/30">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>CONTINUOUS JAPANESE JOURNEY • জাপানি শিক্ষার রোডম্যাপ</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Learning Pathways & Curriculum
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1.5 leading-relaxed">
                আন্তর্জাতিক মানসম্মত জাপানি ভাষা শিক্ষা: বর্ণমালা থেকে শুরু করে মিন্না নো নিহোঙ্গো মাস্টারক্লাস এবং জাপানে ক্যারিয়ার গড়ার বাস্তবমুখী প্রস্তুতি।
              </p>
            </div>

            {/* Switcher: Sequential Pathways vs Course Catalog */}
            <div className="flex items-center bg-stone-800/80 p-1.5 rounded-2xl border border-stone-700/60 shrink-0">
              <button
                onClick={() => setActiveTab('pathways')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'pathways'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Sequential Pathways (ধারাবাহিক পাঠ্যক্রম)</span>
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Courses (সকল কোর্স)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* VIEW 1: SEQUENTIAL 3-MILESTONE PROGRESSION MAP */}
        {/* ========================================================================= */}
        {activeTab === 'pathways' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Student Current Target Status Bar */}
            <div className="bg-white dark:bg-[#15151E] p-5 rounded-3xl border border-stone-200 dark:border-stone-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-red-600/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-lg shrink-0">
                  {selectedLevel}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-stone-500 dark:text-stone-400">বর্তমান লক্ষ্য:</span>
                    <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 uppercase">JLPT {selectedLevel} Curriculum</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      অ্যাক্টিভ রোডম্যাপ
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white mt-0.5">
                    {isFoundationDone ? `ধাপ ২: মিন্না নো নিহোঙ্গো ${selectedLevel} মাস্টারক্লাস` : 'ধাপ ১: হিরাগানা ও কাতাকানা বর্ণমালা ড্রিল'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs font-medium text-stone-600 dark:text-stone-300">
                <div className="text-right">
                  <div className="text-[11px] text-stone-400">কারিকুলাম অগ্রগতি</div>
                  <div className="text-stone-900 dark:text-white font-bold">{masteryPercentage}% সম্পন্ন</div>
                </div>
                <div className="w-24 bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(4, masteryPercentage)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 3 Sequential Milestones Timeline */}
            <div className="space-y-6">

              {/* ------------------------------------------------------------- */}
              {/* MILESTONE 1: JAPANESE FOUNDATION (KANA LAB) */}
              {/* ------------------------------------------------------------- */}
              <div
                className={`relative bg-white dark:bg-[#15151E] rounded-3xl p-6 sm:p-7 border-2 transition-all ${
                  isFoundationDone
                    ? 'border-emerald-500/40 shadow-xs'
                    : 'border-red-500/60 shadow-lg shadow-red-500/5'
                }`}
              >
                {/* Status Pill Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono bg-stone-900 text-white dark:bg-stone-800">
                      MILESTONE 1
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                      জাপানি ফাউন্ডেশন: হিরাগানা ও কাতাকানা
                    </span>
                  </div>

                  {isFoundationDone ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center space-x-1.5 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ভিত্তি সম্পন্ন (COMPLETED)</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 text-xs font-bold flex items-center space-x-1.5 border border-red-500/30 animate-pulse">
                      <Zap className="w-3.5 h-3.5" />
                      <span>বর্তমান সক্রিয় পর্যায় (ACTIVE)</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  <div className="lg:col-span-2 space-y-3">
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                      Japanese Foundation: Hiragana & Katakana
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      হাতে-কলমে জাপানি ভাষার ৪৬টি হিরাগানা ও ৪৬টি কাতাকানা বর্ণমালার নির্ভুল স্ট্রোক অর্ডার, স্থানীয় জাপানি অডিও এবং শব্দ গঠন ড্রিল। কোনো বই মুখস্থ করার আগে স্ক্রিনে লিখে আয়ত্ত করুন।
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                        ✓ ৪৬টি হিরাগানা স্ট্রোক
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                        ✓ ৪৬টি কাতাকানা রূপ
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                        ✓ দাকুওন ও কম্বিনেশন সাউন্ডস
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center sm:items-end justify-center space-y-3">
                    <button
                      onClick={() => setIsKanaLabOpen(true)}
                      className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer ${
                        isFoundationDone
                          ? 'bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-800 dark:hover:bg-stone-700'
                          : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{isFoundationDone ? 'কানা ল্যাব রিভিউ করুন' : 'হাতে-কলমে কানা ল্যাব শুরু করুন'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] text-stone-400">
                      {isFoundationDone ? 'Kana Pioneer ব্যাজ অর্জিত' : 'সময় লাগবে: ~১০ মিনিট'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* MILESTONE 2: JLPT MASTER CURRICULUM (N5 & N4) */}
              {/* ------------------------------------------------------------- */}
              <div
                className={`relative bg-white dark:bg-[#15151E] rounded-3xl p-6 sm:p-7 border transition-all ${
                  isFoundationDone
                    ? 'border-stone-300 dark:border-stone-700 shadow-md'
                    : 'border-stone-200 dark:border-stone-800/80'
                }`}
              >
                {/* Header Badge & Level Switcher Pill */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-stone-200 dark:border-stone-800">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono bg-stone-900 text-white dark:bg-stone-800">
                      MILESTONE 2
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                      {selectedLevel === 'N5'
                        ? 'JLPT N5 মূল কারিকুলাম (৪০টি পাঠ — ৮টি মডিউল)'
                        : selectedLevel === 'N4'
                        ? 'JLPT N4 মূল কারিকুলাম (৩৫টি পাঠ — ৭টি মডিউল)'
                        : selectedLevel === 'N3'
                        ? 'JLPT N3 মূল কারিকুলাম (৪৫টি পাঠ — ৯টি মডিউল)'
                        : selectedLevel === 'N2'
                        ? 'JLPT N2 মূল কারিকুলাম (৪৫টি পাঠ — ৯টি মডিউল)'
                        : 'JLPT N1 সর্বোচ্চ কারিকুলাম (৪৫টি পাঠ — ৯টি মডিউল)'}
                    </span>
                  </div>

                  {/* Level Switcher Pill: [JLPT N5 (40)] | [JLPT N4 (35)] | [JLPT N3 (45)] | [JLPT N2 (45)] | [JLPT N1 (45)] */}
                  <div className="inline-flex items-center p-1 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shrink-0">
                    <button
                      onClick={() => handleSelectLevel('N5')}
                      className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedLevel === 'N5'
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>JLPT N5 (40)</span>
                    </button>
                    <button
                      onClick={() => handleSelectLevel('N4')}
                      className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedLevel === 'N4'
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>JLPT N4 (35)</span>
                    </button>
                    <button
                      onClick={() => handleSelectLevel('N3')}
                      className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedLevel === 'N3'
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5 text-amber-300" />
                      <span>JLPT N3 (45)</span>
                    </button>
                    <button
                      onClick={() => handleSelectLevel('N2')}
                      className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedLevel === 'N2'
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>JLPT N2 (45)</span>
                    </button>
                    <button
                      onClick={() => handleSelectLevel('N1')}
                      className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedLevel === 'N1'
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-300" />
                      <span>JLPT N1 (45)</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* TOP: Sleek Progress Overview */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-[#14141e] border border-stone-800 text-white shadow-xl relative overflow-hidden">
                    <div className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 bg-red-600/10 rounded-full blur-3xl" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-600/25 text-red-400 border border-red-500/30">
                            STAGE-BASED CURRICULUM
                          </span>
                          <span className="text-xs text-stone-400">
                            {selectedLevel === 'N5'
                              ? '৮টি মডিউল • ৪০টি সম্পূর্ণ পাঠ'
                              : selectedLevel === 'N4'
                              ? '৭টি মডিউল • ৩৫টি সম্পূর্ণ পাঠ'
                              : selectedLevel === 'N3'
                              ? '৯টি মডিউল • ৪৫টি সম্পূর্ণ পাঠ'
                              : selectedLevel === 'N2'
                              ? '৯টি মডিউল • ৪৫টি সম্পূর্ণ পাঠ'
                              : '৯টি মডিউল • ৪৫টি সর্বোচ্চ পাঠ'}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          Level {selectedLevel} Mastery: {masterCompletedCount}/{totalLessonsCount} Lessons
                        </h2>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="px-3.5 py-2 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-right">
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">Streak</span>
                          <span className="text-sm font-black text-amber-400 flex items-center justify-end gap-1">
                            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {streakDays} Days
                          </span>
                        </div>
                        <div className="px-3.5 py-2 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-right">
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">Current Focus</span>
                          <span className="text-sm font-black text-rose-400">
                            {activeModule.code}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Minimalist Glowing Progress Bar */}
                    <div className="relative z-10">
                      <div className="flex justify-between text-xs text-stone-400 font-mono mb-1.5">
                        <span>Overall {selectedLevel} Progress</span>
                        <span className="font-bold text-white">{masteryPercentage}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-stone-800/90 overflow-hidden border border-stone-700/60">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full transition-all duration-500 shadow-sm shadow-red-500/50"
                          style={{ width: `${Math.max(4, masteryPercentage)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE LEVEL TAB BAR: 8-Module tabs for N5 (0-7), 7-Module tabs for N4 (1-7), 9-Module tabs for N3 (1-9) */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                        মডিউল নির্বাচন ({selectedLevel} Modules)
                      </span>
                      <span className="text-xs text-stone-400 font-mono">
                        {activeModule.code} • {activeModule.lessonsRange}
                      </span>
                    </div>

                    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${
                      selectedLevel === 'N5'
                        ? 'lg:grid-cols-8'
                        : selectedLevel === 'N4'
                        ? 'lg:grid-cols-7'
                        : 'lg:grid-cols-9'
                    } gap-2`}>
                      {activeModulesList.map((mod) => {
                        const isActive = activeModuleId === mod.id;
                        return (
                          <button
                            key={mod.id}
                            onClick={() => {
                              setActiveModuleId(mod.id);
                              setSearchQuery('');
                            }}
                            className={`p-2.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                              isActive
                                ? 'bg-stone-900 dark:bg-[#1c1c28] border-red-500 shadow-md ring-1 ring-red-500/30'
                                : 'bg-white dark:bg-[#15151E] border-stone-200 dark:border-stone-800/80 hover:border-stone-300 dark:hover:border-stone-700'
                            }`}
                          >
                            {isActive && (
                              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />
                            )}
                            <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-0.5">
                              <span className={isActive ? 'text-red-400 font-black' : 'text-stone-400'}>
                                {mod.code}
                              </span>
                              <span className="text-stone-400 dark:text-stone-500 text-[9px]">
                                {mod.lessonsRange}
                              </span>
                            </div>
                            <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-stone-800 dark:text-stone-200'}`}>
                              {mod.titleEn}
                            </div>
                            <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5 font-medium">
                              {mod.titleBn}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACTIVE MODULE STAGE HEADER & SEARCH BAR */}
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#15151E] border border-stone-200 dark:border-stone-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-900 dark:bg-stone-800 text-white">
                          {activeModule.code}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white truncate">
                          {activeModule.titleEn} — {activeModule.titleBn}
                        </h3>
                        <span className="text-xs font-japanese text-stone-400 shrink-0">
                          ({activeModule.titleJa})
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
                        {activeModule.desc}
                      </p>
                    </div>

                    {/* Search Within Lessons */}
                    <div className="relative w-full sm:w-64 shrink-0">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        placeholder="পাঠ বা ব্যাকরণ খুঁজুন..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-red-500 transition-colors"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ACTIVE MODULE LESSONS GRID (COMPACT CARDS - ZERO ENDLESS SCROLL) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    {filteredLessons.map((lesson) => {
                      const isFreeLesson = selectedLevel === 'N5' ? lesson.lesson_metadata.lesson_number <= 5 : lesson.lesson_metadata.lesson_number <= 2;
                      const isUnlocked = isFreeLesson || isPro;
                      const lessonIdLower = lesson.lesson_metadata.lesson_id.toLowerCase();
                      const conceptSummary = lesson.bengali_bridge?.core_concept_bn || lesson.bengali_bridge?.explanation_bn || '';

                      return (
                        <div
                          key={lesson.lesson_metadata.lesson_id}
                          className="group relative p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between bg-white dark:bg-[#15151E] border-stone-200 dark:border-stone-800/80 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/5 hover:-translate-y-0.5"
                        >
                          <div>
                            {/* Top Row: Lesson ID & Access Badge */}
                            <div className="flex items-center justify-between text-[11px] font-mono mb-2.5">
                              <span className="px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-bold text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 shadow-2xs">
                                {lesson.lesson_metadata.lesson_id}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-stone-400 font-sans">
                                  ~{lesson.lesson_metadata.estimated_minutes} মি.
                                </span>
                                {isFreeLesson ? (
                                  <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded font-sans font-bold">
                                    FREE
                                  </span>
                                ) : isPro ? (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 bg-red-500/15 text-red-500 dark:text-red-400 border border-red-500/30 rounded font-mono font-bold">
                                    <Sparkles className="w-2.5 h-2.5" /> PRO
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 bg-amber-500/15 text-amber-500 border border-amber-500/30 rounded font-mono font-bold">
                                    <Lock className="w-2.5 h-2.5" /> PRO
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Japanese Title with Ruby Furigana Text */}
                            <div className="text-sm font-bold text-stone-900 dark:text-white font-japanese leading-snug line-clamp-2 min-h-[2.5rem]">
                              <FuriganaText text={lesson.lesson_metadata.title_ja} />
                            </div>

                            {/* Bengali Meaning */}
                            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1 line-clamp-1">
                              {lesson.lesson_metadata.title_bn}
                            </div>

                            {/* English Title */}
                            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                              {lesson.lesson_metadata.title_en}
                            </div>

                            {/* Bengali Concept Summary */}
                            {conceptSummary && (
                              <div className="mt-2.5 p-2 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800/60 text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-2">
                                {conceptSummary}
                              </div>
                            )}

                            {/* Scope Badges */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800/60 text-[10px] text-stone-500 dark:text-stone-400">
                              <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800/80">
                                {lesson.vocabulary_scope?.length || 0} শব্দ
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800/80">
                                {lesson.grammar_points?.length || 0} ব্যাকরণ
                              </span>
                              {(lesson.kanji_scope?.length || 0) > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800/80">
                                  {lesson.kanji_scope.length} কাঞ্জি
                                </span>
                              )}
                            </div>
                          </div>

                          {/* High-Contrast Action Buttons: Details & Practice */}
                          <div className="grid grid-cols-2 gap-2 mt-3.5 pt-2.5 border-t border-stone-100 dark:border-stone-800/60">
                            <button
                              onClick={() => setSelectedLessonModal(lesson)}
                              className="py-1.5 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer border border-stone-200/80 dark:border-stone-700"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                              <span>বিস্তারিত</span>
                            </button>

                            <button
                              onClick={() => onNavigate('practice', { lessonId: lessonIdLower })}
                              className="py-1.5 px-2 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white text-[11px] font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-white text-white" />
                              <span>অনুশীলন</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {filteredLessons.length === 0 && (
                    <div className="text-center py-12 text-stone-400 space-y-2 bg-stone-50 dark:bg-stone-900/30 rounded-2xl border border-stone-200/60 dark:border-stone-800/60">
                      <Search className="w-8 h-8 mx-auto opacity-30 text-stone-400" />
                      <div className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                        এই মডিউলে কোনো পাঠ খুঁজে পাওয়া যায়নি
                      </div>
                      <p className="text-xs text-stone-500">
                        অনুসন্ধান পরিবর্তন করুন বা অন্য মডিউল নির্বাচন করুন।
                      </p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="mt-2 px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700 cursor-pointer transition-colors"
                      >
                        অনুসন্ধান রিসেট করুন
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* MILESTONE 3: TOKYO LIFE, BAITOOS & VISA READINESS LAB */}
              {/* ------------------------------------------------------------- */}
              <div className="relative bg-white dark:bg-[#15151E] rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800/80 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono bg-stone-900 text-white dark:bg-stone-800">
                      MILESTONE 3
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                      বাস্তবমুখী প্রস্তুতি ও জাপানে বসবাস
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center space-x-1.5 border border-amber-500/30">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>জাপান কর্মজীবনের প্রস্তুতি (READY FOR EXPLORATION)</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  <div className="lg:col-span-2 space-y-2">
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                      Tokyo Life, BaitoOS & Visa Readiness Lab
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      শ্রেণিকক্ষের বাইরে জাপানের বাস্তব জীবনযাত্রার মুখোমুখি হোন। কনভিনিয়েন্স স্টোরের ক্যাশিয়ার সিমুলেশন (BaitoOS), জাপানি সমাজে শিষ্টাচার, ট্রেনের টিকিট কাটা, বাড়ি ভাড়া নেওয়া এবং ভিসার জন্য প্রয়োজনীয় কাগজপত্র প্রস্তুতির প্র্যাকটিক্যাল গাইড।
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                        🏪 কনভিনিয়েন্স স্টোর POS সিমুলেশন
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                        💼 বাইতো ইন্টারভিউ রোলপ্লে
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                        🛂 স্টুডেন্ট ও এসএসডব্লিউ ভিসা প্রস্তুতি
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center sm:items-end justify-center space-y-3">
                    <button
                      onClick={() => onNavigate('baito')}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-800 dark:hover:bg-stone-700 text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4 text-amber-400" />
                      <span>BaitoOS সিমুলেশন শুরু করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] text-stone-400">
                      টোকিওর বাস্তব কর্মপরিবেশ প্র্যাকটিস
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: COURSE CATALOG (ALL ELECTIVES & WORKSHOPS) */}
        {/* ========================================================================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#15151E] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
              
              {/* Level Filter */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setCatalogLevelFilter(lvl)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      catalogLevelFilter === lvl
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
                        : 'bg-stone-50 dark:bg-stone-800/80 hover:bg-stone-100 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {lvl === 'ALL' ? 'All Levels' : `JLPT ${lvl}`}
                  </button>
                ))}
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
                <Filter className="w-3.5 h-3.5" />
                <select
                  value={catalogCategoryFilter}
                  onChange={(e) => setCatalogCategoryFilter(e.target.value)}
                  className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded-xl text-stone-800 dark:text-stone-200 focus:outline-hidden font-medium cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  <option value="GRAMMAR">Grammar & Patterns</option>
                  <option value="KANJI">Kanji & Radicals</option>
                  <option value="READING">Reading Comprehension</option>
                  <option value="INTERVIEW_PREP">Conversation & Life Prep</option>
                </select>
              </div>

            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-[#15151E] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    {/* Level & Category Badge */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-stone-900 text-white text-[10px] font-bold rounded-md uppercase font-mono">
                        JLPT {course.level}
                      </span>
                      <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                        {course.category}
                      </span>
                    </div>

                    {/* Course Titles */}
                    <div>
                      <h3 className="text-base font-bold text-stone-900 dark:text-white leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-stone-400 font-japanese mt-0.5">
                        {course.titleJa}
                      </p>
                    </div>

                    {/* Progress / Lesson stats */}
                    <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
                        <span className="font-bold text-stone-900 dark:text-white">{course.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-stone-900 dark:bg-red-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${course.progressPercent}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 font-medium truncate pt-0.5">
                        Current: {course.currentLessonTitle}
                      </p>
                    </div>

                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setActiveCourseToPlay(course)}
                    className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer dark:bg-stone-800 dark:hover:bg-stone-700"
                  >
                    <Play className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                    <span>{course.progressPercent > 0 ? 'Resume Lesson' : 'Start Curriculum'}</span>
                  </button>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Tactile Stage 0 Kana Lab Modal */}
      {isKanaLabOpen && (
        <ZeroJapaneseGatewayModal
          isOpen={isKanaLabOpen}
          onClose={() => setIsKanaLabOpen(false)}
          onComplete={(action) => {
            setIsKanaLabOpen(false);
            setIsFoundationDone(true);
            if (action === 'lesson-01') {
              onNavigate('lesson', { lessonId: 'n5-l1' });
            }
          }}
        />
      )}

      {/* Interactive Lesson Modal */}
      {activeCourseToPlay && (
        <LessonPlayerModal
          isOpen={!!activeCourseToPlay}
          onClose={() => setActiveCourseToPlay(null)}
          course={activeCourseToPlay}
          onOpenFullLesson={(lessonId) => {
            setActiveCourseToPlay(null);
            onNavigate('lesson', { lessonId });
          }}
        />
      )}

      {/* N5 & N4 Master Lesson Detail Modal */}
      {selectedLessonModal && (
        <N5LessonDetailModal
          isOpen={!!selectedLessonModal}
          lesson={selectedLessonModal}
          onClose={() => setSelectedLessonModal(null)}
          onStartPractice={(lessonId) => {
            setSelectedLessonModal(null);
            onNavigate('practice', { lessonId });
          }}
          isPro={isPro}
        />
      )}

    </div>
  );
};

export default CoursesView;
