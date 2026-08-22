// src/views/BaitoOsView.tsx
import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { speakJapanese } from '../lib/tts';
import { VoiceTwinLab } from '../components/VoiceTwinLab';

interface BaitoOsViewProps {
  onNavigate?: (view: string, params?: Record<string, any>) => void;
}

export const BaitoOsView: React.FC<BaitoOsViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'interview' | 'resume' | 'register' | 'voicetwin'>('interview');
  const [selectedJob, setSelectedJob] = useState('7-eleven');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [interviewScore, setInterviewScore] = useState<number | null>(null);
  const [currentRegisterStep, setCurrentRegisterStep] = useState(0);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  // Rirekisho state
  const [resumeData, setResumeData] = useState({
    name: 'MD Tanvir Kabir',
    nameKana: 'エムディ タンヴィル カビル',
    dob: '2000-10-01',
    address: 'Tokyo-to, Shinjuku-ku, Takadanobaba 2-14-8',
    jlptLevel: 'N5 Certified (N4 Studying)',
    motive: '貴社のコンビニエンスストアにおいて、日本の接客マナーを学びながら、持ち前の明るさと責任感を持って質の高いサービスを提供したいと考えております。',
    hoursPerWeek: '28時間 / 週 (資格外活動許可)',
  });

  const interviewQuestions = [
    {
      qJa: '面接官:「志望動機を教えてください。」',
      qBn: 'ইন্টারভিউয়ার: "আপনি কেন আমাদের কনবিনিতে কাজ করতে আগ্রহী?"',
      targetSentence: '日本の接客マナーを学びながら、元気に働きたいからです。',
      targetRomaji: 'Nihon no sekkyaku manaa o manabinagara, genki ni hatarakitai kara desu.',
      targetMeaningBn: 'জাপানিজ কাস্টমার সার্ভিস শিষ্টাচার শেখার পাশাপাশি আন্তরিকতার সাথে কাজ করতে চাই।',
      options: [
        {
          textJa: '日本の接客マナーを学びながら、元気に働きたいからです。',
          textBn: 'জাপানিজ কাস্টমার সার্ভিস শিষ্টাচার শেখার পাশাপাশি আন্তরিকতার সাথে কাজ করতে চাই।',
          score: 100
        },
        {
          textJa: '家から近くて、時給が高いからです。',
          textBn: 'বাসার কাছে এবং বেতন বেশি তাই। (খুব খোলামেলা ও অনানুষ্ঠানিক)',
          score: 50
        }
      ]
    },
    {
      qJa: '面接官:「週に何日くらい入れますか？」',
      qBn: 'ইন্টারভিউয়ার: "সপ্তাহে কতদিন এবং কত ঘণ্টা কাজ করতে পারবেন?"',
      targetSentence: '資格外活動許可の範囲内で、週28時間まで可能です。',
      targetRomaji: "Shikakugai katsudou kyoka no han'inai de, shuu nijuuhachijikan made kanou desu.",
      targetMeaningBn: 'স্টুডেন্ট ভিসার অনুমতি অনুযায়ী সপ্তাহে ২৮ ঘণ্টা পর্যন্ত শিডিউলে কাজ করতে প্রস্তুত।',
      options: [
        {
          textJa: '資格外活動許可の範囲内で、週28時間まで可能です。',
          textBn: 'স্টুডেন্ট ভিসার অনুমতি অনুযায়ী সপ্তাহে ২৮ ঘণ্টা পর্যন্ত শিডিউলে কাজ করতে প্রস্তুত।',
          score: 100
        },
        {
          textJa: 'いつでもいいです。何時間でも働きます。',
          textBn: 'যেকোনো সময়। যত খুশি কাজ করব। (আইনত ঝুঁকিপূর্ণ বক্তব্য)',
          score: 40
        }
      ]
    },
    {
      qJa: '面接官:「土曜日や日曜日の夜勤シフトは入れますか？」',
      qBn: 'ইন্টারভিউয়ার: "শনিবার বা রবিবারের রাতের শিফটে কাজ করতে পারবেন কি?"',
      targetSentence: 'はい、土日のシフトも喜んで入らせていただきます。',
      targetRomaji: 'Hai, donichi no shifuto mo yorokonde hairasete itadakimasu.',
      targetMeaningBn: 'জি, শনি-রবিবারের শিফটেও আমি আনন্দের সাথে কাজ করতে আগ্রহী।',
      options: [
        {
          textJa: 'はい、土日のシフトも喜んで入らせていただきます。',
          textBn: 'জি, শনি-রবিবারের শিফটেও আমি আনন্দের সাথে কাজ করতে আগ্রহী।',
          score: 100
        },
        {
          textJa: '土日は休みたいですが、どうしてもなら考えます。',
          textBn: 'শনি-রবিবার ছুটি চাই, তবে একান্ত দরকার হলে ভেবে দেখব।',
          score: 60
        }
      ]
    }
  ];

  const conbiniSteps = [
    {
      action: '1. Customer Arrives at Cash Register',
      staffMustSay: 'いらっしゃいませ！どうぞ！',
      furigana: 'いらっしゃいませ！どうぞ！',
      romaji: 'Irasshaimase! Douzo!',
      bangla: 'স্বাগতম! আসুন!',
      context: 'Say this energetically with a gentle bow as the customer approaches.'
    },
    {
      action: '2. Bento / Food Heating Inquiry',
      staffMustSay: 'お弁当、あたためますか？',
      furigana: 'おべんとう、あたためますか？',
      romaji: 'Obentou, atatamemasu ka?',
      bangla: 'লাঞ্চ বক্সটি কি ওভেনে গরম করে দেব?',
      context: 'Essential phrase for all convenience stores (7-Eleven, Lawson, FamilyMart).'
    },
    {
      action: '3. Shopping Bag Inquiry',
      staffMustSay: '袋はお付けしますか？',
      furigana: 'ふくろはおつけしますか？',
      romaji: 'Fukuro wa otsuke shimasu ka?',
      bangla: 'ব্যাগ কি প্রয়োজন হবে?',
      context: 'In Japan, plastic bags cost 3–5 yen. Always ask before bagging.'
    },
    {
      action: '4. Payment & Giving Receipt',
      staffMustSay: 'ちょうどいただきます。レシートのお返しです。ありがとうございました！',
      furigana: 'ちょうどいただきます。レシートのおかえしです。ありがとうございました！',
      romaji: 'Choudo itadakimasu. Reshiito no okaeshi desu. Arigatou gozaimashita!',
      bangla: 'সঠিক পরিমাণ পেয়েছি। এই নিন আপনার রসিদ। অনেক ধন্যবাদ!',
      context: 'Hand the receipt with two hands.'
    }
  ];

  const handleDownloadRirekisho = () => {
    setDownloadSuccessMsg('আপনার 履歴書 (Rirekisho) JIS ফরম্যাট প্রিন্ট প্রস্তুত হয়েছে!');
    setTimeout(() => {
      window.print();
      setDownloadSuccessMsg(null);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 md:p-10" id="baito-os-view">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-red-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl flex flex-wrap items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Career & Survival Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">BaitoOS™ — জাপান আলবাইতো সিমুলেটর</h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              জাপানে নেমে প্রথম সপ্তাহেই কনবিনি ও রেস্তোরাঁয় পার্ট-টাইম কাজ পাওয়ার জন্য ইন্টারভিউ সিমুলেশন, VoiceTwin অ্যাকসেন্ট প্র্যাকটিস এবং জাপানিজ স্ট্যান্ডার্ড রিজিউম তৈরি করুন।
            </p>
          </div>

          <div className="flex flex-wrap gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('interview')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'interview' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:text-white'
              }`}
              id="tab-baito-interview"
            >
              <MessageSquare className="w-4 h-4" />
              <span>ইন্টারভিউ সিমুলেশন</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('resume')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'resume' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:text-white'
              }`}
              id="tab-baito-resume"
            >
              <FileText className="w-4 h-4" />
              <span>履歴書 (Rirekisho)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'register' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:text-white'
              }`}
              id="tab-baito-register"
            >
              <Store className="w-4 h-4" />
              <span>কনবিনি ক্যাশিয়ার ল্যাব</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('voicetwin')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'voicetwin' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:text-white'
              }`}
              id="tab-baito-voicetwin"
            >
              <Mic className="w-4 h-4" />
              <span>VoiceTwin™ স্পিকিং</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Interview Simulation */}
        {activeTab === 'interview' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-wrap justify-between items-center pb-4 border-b border-slate-800 gap-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>7-Eleven টোকিও শাখা — আলবাইতো ইন্টারভিউ</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg font-mono">
                  প্রশ্ন {currentQuestionIdx + 1} / {interviewQuestions.length}
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakJapanese(interviewQuestions[currentQuestionIdx].qJa)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-amber-400 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  title="Listen to interviewer voice"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>ইন্টারভিউয়ারের কণ্ঠ শুনুন</span>
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
              <div className="text-xl font-bold text-red-400">{interviewQuestions[currentQuestionIdx].qJa}</div>
              <div className="text-xs text-slate-400">{interviewQuestions[currentQuestionIdx].qBn}</div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400">আপনার উত্তর নির্বাচন করুন:</div>
              {interviewQuestions[currentQuestionIdx].options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (currentQuestionIdx + 1 < interviewQuestions.length) {
                      setCurrentQuestionIdx(prev => prev + 1);
                    } else {
                      setInterviewScore(95);
                    }
                  }}
                  className="w-full text-left p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 hover:border-red-500/50 transition group cursor-pointer"
                >
                  <div className="font-semibold text-white group-hover:text-red-300 transition text-sm">{opt.textJa}</div>
                  <div className="text-xs text-slate-400 mt-1">{opt.textBn}</div>
                </button>
              ))}
            </div>

            {interviewScore !== null && (
              <div className="p-5 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white">ইন্টারভিউ সফল! হায়ারিং সম্ভাবনা: ৯৫%</div>
                    <div className="text-xs text-emerald-300/80">আপনার কেইগো বিনম্রতা ও ভিসার নিয়মজ্ঞান পারফেক্ট।</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('voicetwin')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    VoiceTwin™ দিয়ে কণ্ঠ ম্যাচ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentQuestionIdx(0);
                      setInterviewScore(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    পুনরায় দিন
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Rirekisho Builder */}
        {activeTab === 'resume' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-wrap justify-between items-center pb-4 border-b border-slate-800 gap-3">
              <div>
                <h2 className="text-lg font-bold text-white">জাপানিজ রিজিউম (履歴書 - Rirekisho) জেনারেটর</h2>
                <p className="text-xs text-slate-400">JIS ফরম্যাটে জাপানের যেকোনো পার্ট-টাইম জবে জমা দেওয়ার উপযোগী</p>
              </div>
              <button 
                type="button"
                onClick={handleDownloadRirekisho}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-red-600/20 cursor-pointer"
                id="btn-download-rirekisho-pdf"
              >
                <Download className="w-4 h-4" />
                <span>PDF ও প্রিন্ট ফরম্যাট</span>
              </button>
            </div>

            {downloadSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{downloadSuccessMsg}</span>
              </div>
            )}

            <div className="p-6 bg-white text-slate-900 rounded-2xl shadow-inner font-sans max-w-2xl mx-auto space-y-4 border border-slate-300" id="rirekisho-printable-sheet">
              <div className="flex justify-between items-center border-b pb-2 border-slate-400">
                <h3 className="text-xl font-bold tracking-widest text-slate-900">履 歴 書</h3>
                <span className="text-xs text-slate-600">2026年 8月 現在</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <strong>氏 名 (Name):</strong> {resumeData.name}
                  <span className="block text-[10px] text-slate-500">フリガナ: {resumeData.nameKana}</span>
                </div>
                <div>
                  <strong>生年月日 (DOB):</strong> {resumeData.dob}
                </div>
                <div>
                  <strong>現住所 (Address):</strong> {resumeData.address}
                </div>
                <div>
                  <strong>日本語能力 (JLPT):</strong> {resumeData.jlptLevel}
                </div>
                <div className="sm:col-span-2">
                  <strong>希望シフト (Working Limit):</strong> {resumeData.hoursPerWeek}
                </div>
              </div>
              <div className="border-t pt-2 border-slate-300 text-xs">
                <strong>志望動機 (Reason for Application):</strong>
                <p className="mt-1 text-slate-700 italic leading-relaxed">
                  {resumeData.motive}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Convenience Store Cashier Lab */}
        {activeTab === 'register' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Scenario Step {currentRegisterStep + 1} of {conbiniSteps.length}
              </span>
              <button
                type="button"
                onClick={() => setCurrentRegisterStep(0)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Flow</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <span className="text-xs font-bold text-red-400 block uppercase">
                {conbiniSteps[currentRegisterStep].action}
              </span>

              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                    {conbiniSteps[currentRegisterStep].staffMustSay}
                  </h2>
                  <p className="text-xs text-amber-400 font-mono mt-1">{conbiniSteps[currentRegisterStep].romaji}</p>
                  <p className="text-sm font-bold text-slate-300 mt-2">
                    বাংলা: {conbiniSteps[currentRegisterStep].bangla}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => speakJapanese(conbiniSteps[currentRegisterStep].staffMustSay)}
                  className="p-3 rounded-2xl bg-slate-800 text-amber-400 hover:bg-slate-700 border border-slate-700 shadow-sm cursor-pointer"
                  title="Hear audio"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400">
                <strong className="text-white">Tokyo Workplace Tip:</strong> {conbiniSteps[currentRegisterStep].context}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentRegisterStep(Math.max(0, currentRegisterStep - 1))}
                disabled={currentRegisterStep === 0}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 disabled:opacity-40 cursor-pointer"
              >
                Previous Step
              </button>
              <button
                type="button"
                onClick={() => setCurrentRegisterStep(Math.min(conbiniSteps.length - 1, currentRegisterStep + 1))}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>{currentRegisterStep === conbiniSteps.length - 1 ? 'Completed' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: VoiceTwin Speaking Lab */}
        {activeTab === 'voicetwin' && (
          <div className="space-y-4">
            <VoiceTwinLab
              targetSentenceJa={interviewQuestions[currentQuestionIdx]?.targetSentence || '日本の接客マナーを学びながら、元気に働きたいからです。'}
              targetRomaji={interviewQuestions[currentQuestionIdx]?.targetRomaji || 'Nihon no sekkyaku manaa o manabinagara, genki ni hatarakitai kara desu.'}
              targetMeaningBn={interviewQuestions[currentQuestionIdx]?.targetMeaningBn || 'জাপানিজ কাস্টমার সার্ভিস শিষ্টাচার শেখার পাশাপাশি আন্তরিকতার সাথে কাজ করতে চাই।'}
              onSuccess={(score) => {
                setInterviewScore(score);
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
};
export default BaitoOsView;
