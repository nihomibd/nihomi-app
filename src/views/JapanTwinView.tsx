import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ArrowRight,
  Plane,
  Building2,
  Store,
  Train,
  Hospital,
  ShieldCheck,
  Send,
  Loader2
} from 'lucide-react';
import { apiRequest } from '../lib/api.js';
import { speakJapanese } from '../lib/tts.js';
import { useAuth } from '../context/AuthContext.js';
import { JapanReadinessRadar } from '../components/JapanReadinessRadar.js';

interface JapanTwinViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

const DEFAULT_TWIN_DATA = {
  studentName: 'Nihomi Student',
  targetCity: 'Tokyo (Shinjuku / Takadanobaba)',
  targetPurpose: 'Language School & Career Relocation',
  daysToJapan: 206,
  arrivalDate: '2027-03-15',
  targetJLPT: 'N4',
  readinessScore: 68,
  metrics: {
    speaking: 62,
    listening: 70,
    grammar: 75,
    kanji: 58,
    keigo: 52,
    dailyLife: 78,
    workplace: 60,
    emergency: 48
  },
  predictedBottlenecks: [
    {
      id: 'risk-1',
      title: 'Workplace Fast-Speech Listening',
      severity: 'High',
      description: 'You are likely to freeze when Japanese conbini managers or customers speak rapidly.'
    },
    {
      id: 'risk-2',
      title: 'Keigo Humility (Kenjougo vs Sonkeigo)',
      severity: 'Medium',
      description: 'Confusion when humbling your actions in front of external clients or teachers.'
    }
  ],
  recommendedPlan: {
    title: '14-Day Japan Survival & Keigo Accelerator',
    dailyMinutes: 12,
    priorityDrill: '10-minute Conbini Register & Listening Drill'
  }
};

const DEFAULT_DAY_SCENARIOS: Record<number, any> = {
  1: {
    day: 1,
    title: 'Tokyo Narita Airport: Immigration & Customs',
    titleJa: '成田空港・入国審査と税関',
    situation: 'The immigration officer inspects your COE and passport.',
    npcPrompt: 'こんにちは。パスポートと在留資格認定証明書（COE）を見せてください。滞在期間と目的は何ですか？',
    romaji: 'Konnichiwa. Pasupooto to Zairyuu Shikaku Nintei Shoumeisho (COE) wo misete kudasai. Taizai kikan to mokuteki wa nan desu ka?',
    bangla: 'নমস্কার। আপনার পাসপোর্ট ও সিওই (COE) দেখান। আপনার অবস্থানের মেয়াদ ও উদ্দেশ্য কী?',
    evaluation: 'Immigration completed successfully. Remember to state "Ryuugaku" (Study Abroad) clearly.',
    weakSkillDetected: 'Airport Formal Answering & COE Vocabulary'
  },
  2: {
    day: 2,
    title: 'Day 2: Yamanote Subway & Suica Card Purchase',
    titleJa: '山手線・Suicaカード購入と改札',
    situation: 'You are at Shinjuku station purchasing your first IC card from the ticket machine.',
    npcPrompt: '定期券、またはSuicaの新規購入ですか？デポジット500円が必要です。チャージ金額を選んでください。',
    romaji: 'Teikiken, matawa Suica no shinki kounyuu desu ka? Depojitto gohyaku-en ga hitsuyou desu. Chaaji kingaku wo erande kudasai.',
    bangla: 'কম্যুটার পাস নাকি নতুন সুইকা কার্ড কিনবেন? ৫০০ ইয়েন ডিপোজিট লাগবে। রিচার্জের পরিমাণ নির্বাচন করুন।',
    evaluation: 'IC card purchased! Next time listen carefully for the change return chime.',
    weakSkillDetected: 'Tokyo Subway Ticket Machine Japanese'
  },
  3: {
    day: 3,
    title: 'Day 3: Language School First Day Orientation',
    titleJa: '日本語学校・初日オリエンテーション',
    situation: 'Sensei is greeting new international students in class.',
    npcPrompt: '皆さん、おはようございます。これから自己紹介をしてください。国籍と日本に来た理由を教えてください。',
    romaji: 'Minasan, ohayou gozaimasu. Korekara jikoshoukai wo shite kudasai. Kokuseki to Nihon ni kita riyuu wo oshiete kudasai.',
    bangla: 'সবাইকে শুভ সকাল। এখন নিজ নিজ পরিচয় দিন। আপনার দেশ ও জাপানে আসার কারণ বলুন।',
    evaluation: 'Clear self-introduction! Use "Yoroshiku onegaishimasu" with a 30-degree bow.',
    weakSkillDetected: 'Classroom Self-Introduction (Jikoshoukai)'
  },
  4: {
    day: 4,
    title: 'Day 4: 7-Eleven Conbini Ordering & Payment',
    titleJa: 'セブンイレブン・注文とお会計',
    situation: 'Cashier asks about warm food, bag, and point card.',
    npcPrompt: 'お弁当温めますか？レジ袋はご利用になりますか？ポイントカードはお持ちですか？',
    romaji: 'Obentou atatamemasu ka? Rejibukuro wa go-riyou ni narimasu ka? Pointo kaado wa omochi desu ka?',
    bangla: 'লাঞ্চবক্স কি গরম করে দেব? প্লাস্টিক ব্যাগ লাগবে? পয়েন্ট কার্ড আছে কি?',
    evaluation: 'Handled conbini speed smoothly! Remember: "Daijoubu desu" means no bag.',
    weakSkillDetected: 'Conbini Fast Transaction Keigo'
  },
  5: {
    day: 5,
    title: 'Day 5: Shinjuku City Hall Residence Registration',
    titleJa: '新宿区役所・住民登録と保険手続き',
    situation: 'City Hall officer asks for your address and national health insurance enrollment.',
    npcPrompt: '転入届の記入をお願いします。日本の新しい住所と電話番号をこちらに書いてください。国民健康保険にも加入しますか？',
    romaji: 'Tennyuutodoke no kinyuu wo onegaishimasu. Nihon no atarashii juusho to denwabangou wo kochira ni kaite kudasai. Kokumin kenkou hoken ni mo kanyuu shimasu ka?',
    bangla: 'মুভ-ইন ফর্মটি পূরণ করুন। জাপানের নতুন ঠিকানা ও ফোন নম্বর এখানে লিখুন। স্বাস্থ্যবীমাও কি সাথে করবেন?',
    evaluation: 'City Hall registration passed. Kept address in kanji or romaji clearly written.',
    weakSkillDetected: 'Japanese Official Government Forms & Procedures'
  },
  6: {
    day: 6,
    title: 'Day 6: Baito First Shift Rush at Restaurant',
    titleJa: '居酒屋バイト・初シフトのピークタイム',
    situation: 'Senior staff asks you to serve water, wipe table 4, and take order.',
    npcPrompt: 'いらっしゃいませ！4番テーブルにお冷とメニューをお出しして、注文が入ったらハンディに入力してください！',
    romaji: 'Irasshaimase! Yon-ban teeburu ni ohie to menyuu wo odashi shite, chuumon ga haittara handi ni nyuuryoku shite kudasai!',
    bangla: 'স্বাগতম! ৪ নম্বর টেবিলে ঠান্ডা পানি ও মেনু দিন, এবং অর্ডার আসলে ডিভাইসে এন্ট্রি করুন!',
    evaluation: 'Baito shift survived! Remember: always say "Kashikomarimashita" when receiving instructions.',
    weakSkillDetected: 'Restaurant Fast-Paced Keigo & Rush Communication'
  },
  7: {
    day: 7,
    title: 'Day 7: Emergency Clinic & Pharmacy',
    titleJa: 'クリニック・問診票と処方箋薬局',
    situation: 'Nurse asks about fever symptoms and allergies before seeing the doctor.',
    npcPrompt: '熱はいつからありますか？アレルギーやお薬の副作用を経験したことはありますか？保険証をお預かりします。',
    romaji: 'Netsu wa itsu kara arimasu ka? Arerugii ya okusuri no fukusayou wo keiken shita koto wa arimasu ka? Hokenshou wo oazukari shimasu.',
    bangla: 'জ্বর কবে থেকে? অ্যালার্জি বা কোনো ওষুধের পার্শ্বপ্রতিক্রিয়ার অতীত অভিজ্ঞতা আছে? বীমা কার্ডটি দিন।',
    evaluation: 'Clinic consultation completed safely. Stated body temperature in Celsius accurately.',
    weakSkillDetected: 'Medical Symptoms & Allergy Vocabulary in Japanese'
  }
};

export const JapanTwinView: React.FC<JapanTwinViewProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const [twinData, setTwinData] = useState<any>(DEFAULT_TWIN_DATA);
  const [activeDay, setActiveDay] = useState(1);
  const [simulationResult, setSimulationResult] = useState<any>(DEFAULT_DAY_SCENARIOS[1]);
  const [userSpeechInput, setUserSpeechInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadTwin() {
      setIsLoading(true);
      try {
        const res = await apiRequest<{ success: boolean; japanTwin: any }>('/api/japan-twin/profile');
        if (res.success && res.japanTwin) {
          setTwinData(res.japanTwin);
        }
      } catch (err) {
        console.warn('Using default JapanTwin profile telemetry:', err);
        setTwinData({
          ...DEFAULT_TWIN_DATA,
          studentName: profile?.displayName || user?.name || 'Nihomi Student'
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadTwin();
  }, [profile?.displayName, user?.name]);

  const handleRunDaySimulation = async (dayNumber: number) => {
    setActiveDay(dayNumber);
    setIsSimulating(true);
    try {
      const res = await apiRequest<{ success: boolean; dayResult: any }>('/api/japan-twin/simulate-day', {
        method: 'POST',
        body: JSON.stringify({ dayNumber, userActionResponse: userSpeechInput })
      });
      if (res.success && res.dayResult) {
        setSimulationResult(res.dayResult);
      } else {
        setSimulationResult(DEFAULT_DAY_SCENARIOS[dayNumber] || DEFAULT_DAY_SCENARIOS[1]);
      }
    } catch (err) {
      console.warn('Simulation API offline, using interactive local scenario:', err);
      setSimulationResult(DEFAULT_DAY_SCENARIOS[dayNumber] || DEFAULT_DAY_SCENARIOS[1]);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    handleRunDaySimulation(1);
  }, []);

  const daysList = [
    { day: 1, title: 'Day 1: Narita Airport & Immigration', icon: Plane },
    { day: 2, title: 'Day 2: Yamanote Subway & Suica Card', icon: Train },
    { day: 3, title: 'Day 3: Language School First Day', icon: Building2 },
    { day: 4, title: 'Day 4: 7-Eleven Conbini Ordering', icon: Store },
    { day: 5, title: 'Day 5: Shinjuku City Hall Registration', icon: Compass },
    { day: 6, title: 'Day 6: Baito First Shift Rush', icon: Sparkles },
    { day: 7, title: 'Day 7: Emergency Clinic & Pharmacy', icon: Hospital }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-10 px-4 sm:px-6 lg:px-8" id="japan-twin-view">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Unauthenticated Preview Banner */}
        {!user && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-stone-300">
                <strong>Interactive Tokyo Simulator (Preview Mode):</strong> Test your day-to-day survival skills in Tokyo. Sign in to save telemetry to your permanent student record.
              </span>
            </div>
            <button
              onClick={() => onNavigate('login')}
              className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shrink-0 cursor-pointer"
            >
              Sign In to Save
            </button>
          </div>
        )}

        {/* Header Hero */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-800 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/30 border border-red-500/50 text-red-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nihomi JapanTwin™ &bull; Flagship Purple Cow Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight">
            “Your Japanese Self, Before You Meet Japan.”
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            নিহোমি শুধু আপনাকে গ্রামার শেখায় না—বরং বিমানে ওঠার আগেই জাপানের প্রথম ৭ দিনের বাস্তব জীবনকে সিমুলেট করে আপনার ভবিষ্যৎ সম্ভাব্য ভুলগুলোকে আগে থেকেই প্রতিরোধ করে।
          </p>
        </div>

        {/* Japan Readiness Radar Matrix */}
        {twinData && (
          <JapanReadinessRadar
            metrics={twinData.metrics}
            overallScore={twinData.readinessScore}
            daysToJapan={twinData.daysToJapan}
          />
        )}

        {/* 7-Day Future Tokyo Simulator Player */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                Interactive Scenario Player
              </span>
              <h3 className="text-xl font-bold font-serif text-stone-900 mt-0.5">
                Simulate Your First 7 Days in Tokyo
              </h3>
            </div>
            <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-xl">
              Tokyo Takadanobaba Environment
            </span>
          </div>

          {/* Day Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {daysList.map((d) => {
              const Icon = d.icon;
              const isActive = activeDay === d.day;
              return (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => handleRunDaySimulation(d.day)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[85px] ${
                    isActive
                      ? 'bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-500/20'
                      : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-red-600'}`} />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase block opacity-80">Day 0{d.day}</span>
                    <span className="text-xs font-bold truncate block">{d.title.split(':')[1] || d.title}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Simulation Stage */}
          {isSimulating ? (
            <div className="p-12 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col items-center justify-center space-y-3 animate-pulse">
              <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
              <p className="text-xs font-bold text-stone-600">Simulating Day {activeDay} in Tokyo...</p>
            </div>
          ) : simulationResult ? (
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-5 animate-in fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                    Day {simulationResult.day} &bull; {simulationResult.titleJa}
                  </span>
                  <h4 className="text-xl font-bold font-serif text-stone-900 mt-1">
                    {simulationResult.title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">{simulationResult.situation}</p>
                </div>
                <button
                  type="button"
                  onClick={() => speakJapanese(simulationResult.npcPrompt)}
                  className="p-3 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:text-red-600 shadow-sm transition-colors cursor-pointer"
                  title="Listen to Japanese prompt"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Japanese Dialogue Box */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2 text-xs">
                <p className="text-base font-serif font-bold text-stone-900 leading-relaxed">
                  {simulationResult.npcPrompt}
                </p>
                <p className="text-stone-500 font-mono text-[11px]">{simulationResult.romaji}</p>
                <p className="text-emerald-800 font-semibold text-xs pt-1 border-t border-stone-100">
                  বাংলা: {simulationResult.bangla}
                </p>
              </div>

              {/* Feedback Card */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You Survived Japan Day {simulationResult.day}!</span>
                </div>
                <p className="text-stone-700 text-[11px] leading-relaxed">
                  <strong>Sensei Analysis:</strong> {simulationResult.evaluation}
                </p>
                <p className="text-red-700 text-[11px] font-semibold pt-1">
                  Weakness Flagged: {simulationResult.weakSkillDetected} (Added to Learning Memory™)
                </p>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleRunDaySimulation(Math.max(1, activeDay - 1))}
                  disabled={activeDay === 1}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 disabled:opacity-40 cursor-pointer"
                >
                  Previous Day
                </button>
                <button
                  onClick={() => handleRunDaySimulation(Math.min(7, activeDay + 1))}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{activeDay === 7 ? 'Complete Simulation' : `Proceed to Day ${activeDay + 1}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
