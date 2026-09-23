// src/components/canvas3d/transport/AirportImmigrationSim.tsx
// NIHOMI WORLD™ — AIRPORT IMMIGRATION & CUSTOMS INSPECTION SIMULATION
// Interactive authentic border control roleplay with Officer Takahashi at Narita/Haneda Airport.

import React, { useState } from 'react';
import {
  FileText,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  X
} from 'lucide-react';
import { speakJapanese } from '../../../lib/tts';
import { triggerCelebrationConfetti } from '../../../lib/gamificationService';

interface AirportImmigrationSimProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (reward: { coins: number; xp: number }) => void;
}

interface QuestionStep {
  stepIndex: number;
  officerTextJa: string;
  officerTextRomaji: string;
  officerTextEn: string;
  officerTextBn: string;
  choices: Array<{
    id: string;
    textJa: string;
    textRomaji: string;
    textEn: string;
    textBn: string;
    isCorrect: boolean;
    feedbackJa: string;
    feedbackEn: string;
  }>;
}

const IMMIGRATION_STEPS: QuestionStep[] = [
  {
    stepIndex: 1,
    officerTextJa: 'パスポートと入国カードを見せてください。入国の目的は何ですか？',
    officerTextRomaji: 'Pasupooto to nyuukoku kaado o misete kudasai. Nyuukoku no mokuteki wa nan desu ka?',
    officerTextEn: 'Please show your passport and disembarkation card. What is the purpose of your entry?',
    officerTextBn: 'আপনার পাসপোর্ট এবং ডিসএম্বারকেশন কার্ড দেখান। আপনার প্রবেশের উদ্দেশ্য কী?',
    choices: [
      {
        id: 'c1_correct',
        textJa: '日本語の勉強と観光です。',
        textRomaji: 'Nihongo no benkyou to kankou desu.',
        textEn: 'To study Japanese and for sightseeing.',
        textBn: 'জাপানি ভাষা অধ্যয়ন এবং দর্শনীয় স্থান পরিদর্শনের জন্য।',
        isCorrect: true,
        feedbackJa: '大変明瞭で礼儀正しい回答です。',
        feedbackEn: 'Clear, polite, and standard answer for student & tourist entry.'
      },
      {
        id: 'c1_informal',
        textJa: '日本で遊びたいです。',
        textRomaji: 'Nihon de asobitai desu.',
        textEn: 'I want to play in Japan. (Too casual)',
        textBn: 'আমি জাপানে ঘুরতে খেলতে এসেছি। (খুব অনানুষ্ঠানিক)',
        isCorrect: false,
        feedbackJa: '入国審査では「観光（かんこう）」または「勉強」と明確に伝えましょう。',
        feedbackEn: 'At border control, clearly state "観光 (Sightseeing)" or "留学/勉強 (Study)".'
      },
      {
        id: 'c1_work',
        textJa: '就労ビザでの仕事のために入国します。',
        textRomaji: 'Shuurou biza de no shigoto no tame ni nyuukoku shimasu.',
        textEn: 'I am entering to work under a designated employment visa.',
        textBn: 'আমি কাজের ভিসায় চাকুরি করার জন্য প্রবেশ করছি।',
        isCorrect: true,
        feedbackJa: '就労ビザ所持者としての適切な回答です。',
        feedbackEn: 'Appropriate professional answer for work visa holders.'
      }
    ]
  },
  {
    stepIndex: 2,
    officerTextJa: '日本にはどのくらいの期間滞在する予定ですか？',
    officerTextRomaji: 'Nihon ni wa dono kurai no kikan taizai suru yotei desu ka?',
    officerTextEn: 'How long do you plan to stay in Japan?',
    officerTextBn: 'আপনি কতদিন জাপানে অবস্থান করার পরিকল্পনা করছেন?',
    choices: [
      {
        id: 'c2_correct',
        textJa: '90日間の予定です。帰りの航空券もあります。',
        textRomaji: 'Kyuujuu-nichi-kan no yotei desu. Kaeri no koukuuken mo arimasu.',
        textEn: 'For 90 days. I also have a return flight ticket.',
        textBn: '৯০ দিনের পরিকল্পনা। আমার কাছে রিটার্ন টিকিটও আছে।',
        isCorrect: true,
        feedbackJa: '完璧です！帰りの航空券の提示は信頼性を高めます。',
        feedbackEn: 'Perfect! Mentioning your return ticket verifies temporary stay.'
      },
      {
        id: 'c2_vague',
        textJa: 'まだ決めていません。',
        textRomaji: 'Mada kimete imasen.',
        textEn: 'I haven\'t decided yet.',
        textBn: 'এখনও ঠিক করিনি। (সন্দেহজনক)',
        isCorrect: false,
        feedbackJa: '滞在期間が未定と答えると追加検査になる可能性があります。明確な日数を答えましょう。',
        feedbackEn: 'Stating no planned departure can trigger secondary questioning.'
      }
    ]
  },
  {
    stepIndex: 3,
    officerTextJa: '滞在先のホテルまたは住所はどこですか？',
    officerTextRomaji: 'Taizai-saki no hoteru matawa juusho wa doko desu ka?',
    officerTextEn: 'Where is your hotel or intended accommodation address?',
    officerTextBn: 'আপনার হোটেল বা থাকার ঠিকানা কোথায়?',
    choices: [
      {
        id: 'c3_correct',
        textJa: '渋谷の学生寮に滞在します。こちらが入校許可証です。',
        textRomaji: 'Shibuya no gakusei-ryou ni taizai shimasu. Kochira ga nyuukou kyokashou desu.',
        textEn: 'I am staying at the student dorm in Shibuya. Here is my school admission document.',
        textBn: 'আমি শিবুয়ার ছাত্রাবাসে থাকব। এই যে আমার ভর্তি অনুমোদন পত্র।',
        isCorrect: true,
        feedbackJa: '書類の提示も的確です。入国許可証を交付します。',
        feedbackEn: 'Flawless document presentation. Issuing Landing Permission sticker.'
      },
      {
        id: 'c3_hotel',
        textJa: '新宿のホテルを予約しています。こちらが予約票です。',
        textRomaji: 'Shinjuku no hoteru o yoyaku shite imasu. Kochira ga yoyakuhyou desu.',
        textEn: 'I have booked a hotel in Shinjuku. Here is the confirmation voucher.',
        textBn: 'শিনজুকুর হোটেলে বুকিং করা আছে। এই যে বুকিং স্লিপ।',
        isCorrect: true,
        feedbackJa: 'ホテル予約票の提示で確認がスムーズに行われました。',
        feedbackEn: 'Presenting a hotel booking voucher enables immediate clearance.'
      }
    ]
  }
];

export const AirportImmigrationSim: React.FC<AirportImmigrationSimProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; textJa: string; textEn: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentStep = IMMIGRATION_STEPS[currentStepIdx];

  const handlePlayVoice = (text: string) => {
    speakJapanese(text);
  };

  const handleSelectChoice = (choice: QuestionStep['choices'][0]) => {
    setFeedback({
      isCorrect: choice.isCorrect,
      textJa: choice.feedbackJa,
      textEn: choice.feedbackEn
    });

    if (choice.isCorrect) {
      speakJapanese('わかりました。確認いたしました。');
    } else {
      speakJapanese('もう一度確認させてください。');
    }
  };

  const handleNextStep = () => {
    setFeedback(null);
    if (currentStepIdx < IMMIGRATION_STEPS.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      speakJapanese(IMMIGRATION_STEPS[nextIdx].officerTextJa);
    } else {
      setIsCompleted(true);
      triggerCelebrationConfetti();
      speakJapanese('日本への入国を許可します。ようこそ日本へ！');
      onComplete({ coins: 50, xp: 100 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-indigo-500/40 rounded-3xl shadow-[0_0_60px_rgba(99,102,241,0.3)] overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-900/80 px-6 py-4 flex items-center justify-between text-white border-b border-indigo-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/30 flex items-center justify-center text-lg">
              🛂
            </div>
            <div>
              <h2 className="text-base font-black tracking-wide">
                出入国在留管理庁 (Immigration Services Agency of Japan)
              </h2>
              <p className="text-[11px] text-indigo-200">
                Narita International Airport — Terminal 1 Passport Control
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {!isCompleted ? (
            <>
              {/* Officer Persona & Question */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs border border-indigo-400/40">
                      高橋
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">Officer Takahashi (入国審査官 高橋)</h3>
                      <p className="text-[10px] text-slate-400 font-mono">Booth #14 • Step {currentStepIdx + 1} of 3</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlayVoice(currentStep.officerTextJa)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Play Audio</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-700/50 space-y-1">
                  <p className="text-base font-bold text-white tracking-wide">
                    {currentStep.officerTextJa}
                  </p>
                  <p className="text-xs text-indigo-300 font-mono">
                    {currentStep.officerTextRomaji}
                  </p>
                  <p className="text-xs text-slate-300">
                    {currentStep.officerTextEn}
                  </p>
                  <p className="text-[11px] text-emerald-400 font-bengali">
                    {currentStep.officerTextBn}
                  </p>
                </div>
              </div>

              {/* Choices */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Select Your Japanese Response (回答を選択):
                </label>
                <div className="space-y-2.5">
                  {currentStep.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => handleSelectChoice(choice)}
                      className="w-full text-left p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-indigo-400/50 transition-all group"
                    >
                      <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {choice.textJa}
                      </p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {choice.textRomaji}
                      </p>
                      <p className="text-xs text-slate-300 mt-1">
                        {choice.textEn}
                      </p>
                      <p className="text-[11px] text-emerald-400/90 font-bengali">
                        {choice.textBn}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Alert */}
              {feedback && (
                <div
                  className={`p-4 rounded-2xl border flex items-start space-x-3 animate-in fade-in slide-in-from-top-2 duration-200 ${
                    feedback.isCorrect
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                      : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                  }`}
                >
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-40ようflex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-grow space-y-1">
                    <p className="text-xs font-bold">{feedback.textJa}</p>
                    <p className="text-xs text-slate-300">{feedback.textEn}</p>
                  </div>
                  {feedback.isCorrect && (
                    <button
                      onClick={handleNextStep}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 flex-shrink-0 shadow-lg"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Stamp Verification Success State */
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto text-4xl shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                <Award className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-2">
                  上陸許可 (LANDING PERMISSION STAMPED)
                </span>
                <h2 className="text-2xl font-black text-white">ようこそ日本へ！ Welcome to Japan!</h2>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-2">
                  You have successfully passed Japanese Immigration Control at Narita Airport. You are now authorized to explore Tokyo and start your career/life readiness journey.
                </p>
              </div>

              {/* Passport Stamp Card */}
              <div className="max-w-xs mx-auto p-4 rounded-2xl bg-amber-500/10 border-2 border-dashed border-amber-400/40 text-amber-200 text-xs font-mono space-y-1">
                <p className="font-bold uppercase tracking-wider text-amber-300">入国審査官検印</p>
                <p>STATUS: SHORT-TERM / STUDENT</p>
                <p>DURATION: 90 DAYS</p>
                <p>PORT: NARITA (NRT)</p>
                <p className="text-emerald-400 font-bold mt-2">+50 Nihomi Coins & +100 XP Awarded</p>
              </div>

              <button
                onClick={onClose}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all"
              >
                Proceed to Baggage Claim & Train Station
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
