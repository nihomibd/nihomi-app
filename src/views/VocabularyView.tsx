import React, { useState, useEffect, useMemo } from 'react';
import { speakJapanese, stopJapaneseSpeech } from '../lib/tts.js';
import { JLPTLevel } from '../types.js';
import {
  Volume2,
  Search,
  BookOpen,
  Sparkles,
  Filter,
  ArrowLeft,
  Headphones,
  Play,
  Pause,
  Check,
  Star,
  Layers,
  RotateCcw,
  Languages
} from 'lucide-react';

interface VocabularyCardData {
  id: string;
  japanese: string;
  furigana: string;
  romaji: string;
  english: string;
  bengali: string;
  level: JLPTLevel | 'Workplace';
  category: 'Greetings' | 'Daily Life' | 'Food & Dining' | 'Workplace Keigo' | 'Transit & Travel' | 'Verbs' | 'Adjectives';
  exampleJa: string;
  exampleEn: string;
  exampleBn?: string;
  notes?: string;
}

const MASTER_VOCABULARY_BANK: VocabularyCardData[] = [
  // Greetings & Foundations (N5)
  {
    id: 'voc-1',
    japanese: 'おはようございます',
    furigana: 'おはようございます',
    romaji: 'ohayou gozaimasu',
    english: 'Good morning (Polite)',
    bengali: 'সুপ্রভাত (ভদ্র)',
    level: 'N5',
    category: 'Greetings',
    exampleJa: '先生、おはようございます。',
    exampleEn: 'Good morning, teacher.',
    exampleBn: 'শিক্ষক মহাশয়, সুপ্রভাত।'
  },
  {
    id: 'voc-2',
    japanese: 'こんにちは',
    furigana: 'こんにちは',
    romaji: 'konnichiwa',
    english: 'Hello / Good afternoon',
    bengali: 'নমস্কার / শুভ অপরাহ্ন',
    level: 'N5',
    category: 'Greetings',
    exampleJa: 'みなさん、こんにちは。',
    exampleEn: 'Hello, everyone.',
    exampleBn: 'সবাইকে নমস্কার।'
  },
  {
    id: 'voc-3',
    japanese: 'こんばんは',
    furigana: 'こんばんは',
    romaji: 'konbanwa',
    english: 'Good evening',
    bengali: 'শুভ সন্ধ্যা',
    level: 'N5',
    category: 'Greetings',
    exampleJa: '田中さん、こんばんは。',
    exampleEn: 'Good evening, Mr. Tanaka.',
    exampleBn: 'তানাকা সান, শুভ সন্ধ্যা।'
  },
  {
    id: 'voc-4',
    japanese: 'ありがとうございます',
    furigana: 'ありがとうございます',
    romaji: 'arigatou gozaimasu',
    english: 'Thank you very much (Polite)',
    bengali: 'আপনাকে অনেক ধন্যবাদ',
    level: 'N5',
    category: 'Greetings',
    exampleJa: '手伝ってくれて、ありがとうございます。',
    exampleEn: 'Thank you very much for helping me.',
    exampleBn: 'সাহায্য করার জন্য আপনাকে অনেক ধন্যবাদ।'
  },
  {
    id: 'voc-5',
    japanese: 'すみません',
    furigana: 'すみません',
    romaji: 'sumimasen',
    english: 'Excuse me / Sorry',
    bengali: 'মাফ করবেন / শুনছেন',
    level: 'N5',
    category: 'Greetings',
    exampleJa: 'すみません、駅はどこですか。',
    exampleEn: 'Excuse me, where is the station?',
    exampleBn: 'মাফ করবেন, স্টেশনটি কোথায়?'
  },
  {
    id: 'voc-6',
    japanese: 'お願いします',
    furigana: 'おねがいします',
    romaji: 'onegaishimasu',
    english: 'Please (requesting a favor)',
    bengali: 'দয়া করে (অনুরোধ)',
    level: 'N5',
    category: 'Greetings',
    exampleJa: 'これをコピーお願いします。',
    exampleEn: 'Please make a copy of this.',
    exampleBn: 'দয়া করে এটি একটি কপি করে দিন।'
  },

  // Daily Life & Objects (N5)
  {
    id: 'voc-7',
    japanese: '私',
    furigana: 'わたし',
    romaji: 'watashi',
    english: 'I / Me',
    bengali: 'আমি / আমাকে',
    level: 'N5',
    category: 'Daily Life',
    exampleJa: '私はダッカの学生です。',
    exampleEn: 'I am a student from Dhaka.',
    exampleBn: 'আমি ঢাকার একজন শিক্ষার্থী।'
  },
  {
    id: 'voc-8',
    japanese: '本',
    furigana: 'ほん',
    romaji: 'hon',
    english: 'Book',
    bengali: 'বই',
    level: 'N5',
    category: 'Daily Life',
    exampleJa: '日本語の本を読みます。',
    exampleEn: 'I read a Japanese book.',
    exampleBn: 'আমি জাপানি ভাষার বই পড়ি।'
  },
  {
    id: 'voc-9',
    japanese: '学校',
    furigana: 'がっこう',
    romaji: 'gakkou',
    english: 'School',
    bengali: 'বিদ্যালয় / স্কুল',
    level: 'N5',
    category: 'Daily Life',
    exampleJa: '毎朝、学校へ行きます。',
    exampleEn: 'I go to school every morning.',
    exampleBn: 'আমি প্রতিদিন সকালে স্কুলে যাই।'
  },
  {
    id: 'voc-10',
    japanese: '先生',
    furigana: 'せんせい',
    romaji: 'sensei',
    english: 'Teacher / Instructor',
    bengali: 'শিক্ষক / গুরু',
    level: 'N5',
    category: 'Daily Life',
    exampleJa: '先生は日本語を教えます。',
    exampleEn: 'The teacher teaches Japanese.',
    exampleBn: 'শিক্ষক জাপানি ভাষা শেখান।'
  },
  {
    id: 'voc-11',
    japanese: '水',
    furigana: 'みず',
    romaji: 'mizu',
    english: 'Water (Cold/Room temp)',
    bengali: 'পানি / জল',
    level: 'N5',
    category: 'Food & Dining',
    exampleJa: 'お水を一杯ください。',
    exampleEn: 'Please give me a glass of water.',
    exampleBn: 'দয়া করে আমাকে এক গ্লাস পানি দিন।'
  },
  {
    id: 'voc-12',
    japanese: 'ご飯',
    furigana: 'ごはん',
    romaji: 'gohan',
    english: 'Rice / Meal',
    bengali: 'ভাত / খাবার',
    level: 'N5',
    category: 'Food & Dining',
    exampleJa: '朝ご飯を食べました。',
    exampleEn: 'I ate breakfast.',
    exampleBn: 'আমি সকালের খাবার খেয়েছি।'
  },

  // Verbs & Movement (N5 & N4)
  {
    id: 'voc-13',
    japanese: '行きます',
    furigana: 'いきます',
    romaji: 'ikimasu',
    english: 'To go',
    bengali: 'যাওয়া',
    level: 'N5',
    category: 'Verbs',
    exampleJa: '来年、東京へ行きます。',
    exampleEn: 'I will go to Tokyo next year.',
    exampleBn: 'আমি আগামী বছর টোকিও যাব।'
  },
  {
    id: 'voc-14',
    japanese: '来ます',
    furigana: 'きます',
    romaji: 'kimasu',
    english: 'To come',
    bengali: 'আসা',
    level: 'N5',
    category: 'Verbs',
    exampleJa: '友達が家に来ました。',
    exampleEn: 'My friend came to my house.',
    exampleBn: 'আমার বন্ধু বাড়িতে এসেছে।'
  },
  {
    id: 'voc-15',
    japanese: '勉強します',
    furigana: 'べんきょうします',
    romaji: 'benkyoushimasu',
    english: 'To study',
    bengali: 'পড়াশোনা করা',
    level: 'N5',
    category: 'Verbs',
    exampleJa: '毎日２時間日本語を勉強します。',
    exampleEn: 'I study Japanese for 2 hours every day.',
    exampleBn: 'আমি প্রতিদিন ২ ঘণ্টা জাপানি ভাষা অধ্যয়ন করি।'
  },
  {
    id: 'voc-16',
    japanese: '話します',
    furigana: 'はなします',
    romaji: 'hanashimasu',
    english: 'To speak / To talk',
    bengali: 'কথা বলা',
    level: 'N5',
    category: 'Verbs',
    exampleJa: '先生と日本語で話します。',
    exampleEn: 'I speak with the teacher in Japanese.',
    exampleBn: 'আমি শিক্ষকের সাথে জাপানি ভাষায় কথা বলি।'
  },

  // Transit & Travel (N5 / N4)
  {
    id: 'voc-17',
    japanese: '電車',
    furigana: 'でんしゃ',
    romaji: 'densha',
    english: 'Train',
    bengali: 'ট্রেন / বৈদ্যুতিক ট্রেন',
    level: 'N5',
    category: 'Transit & Travel',
    exampleJa: '電車で新宿へ行きます。',
    exampleEn: 'I go to Shinjuku by train.',
    exampleBn: 'আমি ট্রেনে করে শিনজুকু যাই।'
  },
  {
    id: 'voc-18',
    japanese: '飛行機',
    furigana: 'ひこうき',
    romaji: 'hikouki',
    english: 'Airplane',
    bengali: 'উড়োজাহাজ / বিমান',
    level: 'N5',
    category: 'Transit & Travel',
    exampleJa: '成田空港から飛行機に乗ります。',
    exampleEn: 'I board the airplane from Narita Airport.',
    exampleBn: 'আমি নারিতা বিমানবন্দর থেকে প্লেনে উঠি।'
  },
  {
    id: 'voc-19',
    japanese: '切符',
    furigana: 'きっぷ',
    romaji: 'kippu',
    english: 'Ticket',
    bengali: 'টিকিট',
    level: 'N5',
    category: 'Transit & Travel',
    exampleJa: '切符売り場で切符を買います。',
    exampleEn: 'I buy a ticket at the ticket counter.',
    exampleBn: 'আমি টিকিট কাউন্টার থেকে টিকিট কিনি।'
  },

  // Workplace Keigo & Intermediate (N4 / N3 / Workplace)
  {
    id: 'voc-20',
    japanese: 'お疲れ様です',
    furigana: 'おつかれさまです',
    romaji: 'otsukaresama desu',
    english: 'Thank you for your hard work (Workplace Greeting)',
    bengali: 'কঠোর পরিশ্রমের জন্য ধন্যবাদ (অফিস সম্ভাষণ)',
    level: 'Workplace',
    category: 'Workplace Keigo',
    exampleJa: '課長、本日もお疲れ様でした。',
    exampleEn: 'Section Chief, thank you for your hard work today.',
    exampleBn: 'শাখা প্রধান, আজকের পরিশ্রমের জন্য আপনাকে ধন্যবাদ।'
  },
  {
    id: 'voc-21',
    japanese: '承知いたしました',
    furigana: 'しょうちいたしました',
    romaji: 'shouchi itashimashita',
    english: 'Understood / Certainly (Humble Keigo for 分かりました)',
    bengali: 'আমি বুঝতে পেরেছি ও মান্য করব (বিনয়ী কেইগো)',
    level: 'Workplace',
    category: 'Workplace Keigo',
    exampleJa: 'はい、件の資料をすぐに確認し、承知いたしました。',
    exampleEn: 'Yes, I have reviewed the document and understood.',
    exampleBn: 'হ্যাঁ, আমি নথিটি দেখেছি এবং বুঝতে পেরেছি।'
  },
  {
    id: 'voc-22',
    japanese: 'お世話になっております',
    furigana: 'おせわになっております',
    romaji: 'osewa ni natte orimasu',
    english: 'Thank you for your ongoing support / business (Business Email opener)',
    bengali: 'আমাদের সহযোগিতার জন্য ধন্যবাদ (বিজনেস ওপেনার)',
    level: 'Workplace',
    category: 'Workplace Keigo',
    exampleJa: 'いつも大変お世話になっております。',
    exampleEn: 'Thank you very much for your continuous patronage.',
    exampleBn: 'সবসময় আমাদের পাশে থাকার জন্য আন্তরিক ধন্যবাদ।'
  },
  {
    id: 'voc-23',
    japanese: '申し訳ございません',
    furigana: 'もうしわけございません',
    romaji: 'moushiwake gozaimasen',
    english: 'I deeply apologize (Formal Keigo for ごめんなさい)',
    bengali: 'আমি আন্তরিকভাবে ক্ষমাপ্রার্থী (অফিসিয়াল ক্ষমা)',
    level: 'Workplace',
    category: 'Workplace Keigo',
    exampleJa: 'ご連絡が遅くなり、大変申し訳ございません。',
    exampleEn: 'I am extremely sorry for the delayed reply.',
    exampleBn: 'দেরিতে উত্তর দেওয়ার জন্য আমি আন্তরিকভাবে ক্ষমাপ্রার্থী।'
  },
  {
    id: 'voc-24',
    japanese: '確認します',
    furigana: 'かくにんします',
    romaji: 'kakunin shimasu',
    english: 'To confirm / To verify',
    bengali: 'যাচাই করা / নিশ্চিত করা',
    level: 'N4',
    category: 'Workplace Keigo',
    exampleJa: 'スケジュールを確認してから連絡します。',
    exampleEn: 'I will contact you after confirming the schedule.',
    exampleBn: 'আমি সময়সূচি যাচাই করে আপনার সাথে যোগাযোগ করব।'
  },
  {
    id: 'voc-25',
    japanese: '連絡します',
    furigana: 'れんらくします',
    romaji: 'renraku shimasu',
    english: 'To contact / To get in touch (Hou-Ren-So)',
    bengali: 'যোগাযোগ করা (হো-রেন-সো নীতি)',
    level: 'N4',
    category: 'Workplace Keigo',
    exampleJa: '問題があれば、すぐに連絡してください。',
    exampleEn: 'If there is a problem, please contact immediately.',
    exampleBn: 'কোনো সমস্যা হলে অবিলম্বে যোগাযোগ করুন।'
  },

  // Adjectives (N5 & N4)
  {
    id: 'voc-26',
    japanese: '美味しい',
    furigana: 'おいしい',
    romaji: 'oishii',
    english: 'Delicious / Tasty',
    bengali: 'সুস্বাদু / মজাদার',
    level: 'N5',
    category: 'Adjectives',
    exampleJa: '日本のラーメンはとても美味しいです。',
    exampleEn: 'Japanese ramen is very delicious.',
    exampleBn: 'জাপানি রামেন খুবই সুস্বাদু।'
  },
  {
    id: 'voc-27',
    japanese: '難しい',
    furigana: 'むずかしい',
    romaji: 'muzukashii',
    english: 'Difficult / Hard',
    bengali: 'কঠিন / জটিল',
    level: 'N5',
    category: 'Adjectives',
    exampleJa: '漢字は難しいですが、面白いです。',
    exampleEn: 'Kanji is difficult, but interesting.',
    exampleBn: 'কাঞ্জি কঠিন হলেও খুব মজার।'
  },
  {
    id: 'voc-28',
    japanese: '便利',
    furigana: 'べんり',
    romaji: 'benri',
    english: 'Convenient / Handy',
    bengali: 'সুবিধাজনক / কার্যকর',
    level: 'N5',
    category: 'Adjectives',
    exampleJa: '東京の地下鉄はとても便利です。',
    exampleEn: 'Tokyo subway is very convenient.',
    exampleBn: 'টোকিওর সাবওয়ে অত্যন্ত সুবিধাজনক।'
  }
];

interface VocabularyViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.9);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nihomi_vocab_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayIndex, setAutoPlayIndex] = useState(0);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('nihomi_vocab_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSpeak = (word: VocabularyCardData) => {
    setPlayingWordId(word.id);
    speakJapanese(word.japanese, {
      rate: playbackSpeed,
      onEnd: () => {
        setPlayingWordId(null);
      },
      onError: () => {
        setPlayingWordId(null);
      }
    });
  };

  // Filtered list
  const filteredVocabulary = useMemo(() => {
    return MASTER_VOCABULARY_BANK.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.japanese.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.furigana.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.romaji.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.bengali.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel = selectedLevel === 'All' || item.level === selectedLevel;
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesLevel && matchesCat;
    });
  }, [searchQuery, selectedLevel, selectedCategory]);

  // Continuous hands-free auto-play loop
  useEffect(() => {
    if (!isAutoPlaying || filteredVocabulary.length === 0) {
      setPlayingWordId(null);
      return;
    }

    const currentWord = filteredVocabulary[autoPlayIndex];
    if (currentWord) {
      setPlayingWordId(currentWord.id);
      speakJapanese(currentWord.japanese, {
        rate: playbackSpeed,
        onEnd: () => {
          const timer = setTimeout(() => {
            if (autoPlayIndex + 1 < filteredVocabulary.length) {
              setAutoPlayIndex((idx) => idx + 1);
            } else {
              setAutoPlayIndex(0);
            }
          }, 1600);
          return () => clearTimeout(timer);
        }
      });
    }

    return () => {
      stopJapaneseSpeech();
    };
  }, [isAutoPlaying, autoPlayIndex, filteredVocabulary, playbackSpeed]);

  const categories = ['All', 'Greetings', 'Daily Life', 'Food & Dining', 'Workplace Keigo', 'Transit & Travel', 'Verbs', 'Adjectives'];

  return (
    <div id="nihomi-vocabulary-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('courses')}
            className="self-start inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-red-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Courses</span>
          </button>

          {/* Hands-free Player Bar */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center bg-stone-100 rounded-xl p-0.5 text-[11px] font-bold">
              {[
                { label: '0.8x', val: 0.8 },
                { label: '1.0x', val: 0.95 },
                { label: '1.2x', val: 1.2 }
              ].map((spd) => (
                <button
                  key={spd.label}
                  onClick={() => setPlaybackSpeed(spd.val)}
                  className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                    playbackSpeed === spd.val
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {spd.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                if (isAutoPlaying) {
                  setIsAutoPlaying(false);
                  stopJapaneseSpeech();
                  setPlayingWordId(null);
                } else {
                  setIsAutoPlaying(true);
                  setAutoPlayIndex(0);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                isAutoPlaying
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Headphones className="w-3.5 h-3.5" />}
              <span>{isAutoPlaying ? 'Pause Audio Deck' : 'Auto-Play All'}</span>
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
              Interactive Audio Bank
            </span>
            <span className="text-xs text-stone-500 font-semibold">
              Native Tokyo Speech Synthesis & Bengali Mnemonics
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Japanese Vocabulary & Terminology Bank (語彙)
            </h1>
            <p className="text-sm font-serif text-red-600">
              JLPT N5, N4, N3 এবং প্র্যাকটিক্যাল অফিসিয়াল জাপানিজ শব্দভাণ্ডার
            </p>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
            Click the <strong className="text-red-600 font-semibold">Listen</strong> icon on any vocabulary card to hear the authentic native Tokyo pronunciation via Browser Speech Synthesis. Filter by category, JLPT tier, or search in English, Bengali, Romaji, and Kanji.
          </p>

          {/* Search Bar & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search vocabulary (e.g. 'sumimasen', 'স্কুল', 'Water', '私')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-900 focus:outline-none focus:border-red-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Level Selector */}
            <div className="md:col-span-3 flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-bold">
              {['All', 'N5', 'N4', 'Workplace'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`flex-1 py-1.5 rounded-xl transition text-center cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-semibold text-stone-800 focus:outline-none focus:border-red-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter & Active Filter info */}
        <div className="flex items-center justify-between text-xs text-stone-500 px-1">
          <span>
            Showing <strong>{filteredVocabulary.length}</strong> words
            {selectedLevel !== 'All' && ` for ${selectedLevel}`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </span>
          <span className="text-[11px] text-stone-400">
            Click 'Listen' to hear pronunciation
          </span>
        </div>

        {/* Vocabulary Cards Grid */}
        {filteredVocabulary.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
            <p className="text-sm font-bold text-stone-800">No vocabulary found</p>
            <p className="text-xs text-stone-500">Try adjusting your search query or level filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLevel('All');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVocabulary.map((word) => {
              const isPlaying = playingWordId === word.id;
              const isFav = favorites.includes(word.id);

              return (
                <div
                  key={word.id}
                  id={`vocab-card-${word.id}`}
                  className={`bg-white border rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 transition-all duration-300 ${
                    isPlaying
                      ? 'border-red-500 ring-2 ring-red-400/50 bg-red-50/20'
                      : 'border-stone-200 hover:border-stone-300 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Card Header Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                            word.level === 'Workplace'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {word.level}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-stone-100 text-stone-600">
                          {word.category}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleFavorite(word.id)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          isFav
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-stone-300 hover:text-amber-500'
                        }`}
                        title="Bookmark vocabulary"
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                      </button>
                    </div>

                    {/* Japanese Word with Ruby / Furigana */}
                    <div className="pt-1">
                      <ruby className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 leading-tight">
                        {word.japanese}
                        {word.furigana !== word.japanese && (
                          <rt className="text-xs font-sans text-red-600 font-normal">
                            {word.furigana}
                          </rt>
                        )}
                      </ruby>
                      <p className="text-xs text-stone-400 font-mono mt-0.5">{word.romaji}</p>
                    </div>

                    {/* Meanings */}
                    <div className="space-y-1 pt-1 border-t border-stone-100">
                      <p className="text-sm font-bold text-stone-900">{word.english}</p>
                      <p className="text-xs font-medium text-red-700 bg-red-50/60 px-2.5 py-1 rounded-xl border border-red-100/80 inline-block">
                        বাংলা: {word.bengali}
                      </p>
                    </div>

                    {/* Example Sentence */}
                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80 text-xs space-y-1">
                      <p className="font-serif font-bold text-stone-800">{word.exampleJa}</p>
                      <p className="text-[11px] text-stone-500">{word.exampleEn}</p>
                      {word.exampleBn && (
                        <p className="text-[11px] text-stone-600 font-medium">
                          {word.exampleBn}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom: Prominent Listen Button */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      id={`btn-listen-vocab-${word.id}`}
                      onClick={() => handleSpeak(word)}
                      className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                        isPlaying
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                          : 'bg-stone-900 hover:bg-red-600 text-white'
                      }`}
                    >
                      <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                      <span>{isPlaying ? 'Playing...' : 'Listen'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => speakJapanese(word.exampleJa, { rate: playbackSpeed })}
                      className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl text-xs font-semibold transition cursor-pointer"
                      title="Listen to full example sentence"
                    >
                      <Languages className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
