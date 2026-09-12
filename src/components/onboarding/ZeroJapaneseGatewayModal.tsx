import React, { useState } from 'react';
import {
  X,
  Volume2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Target,
  Compass,
  Zap,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';
import { trackNihomiEvent } from '../../utils/analytics';

interface ZeroJapaneseGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (goal: string) => void;
}

interface KanaVowel {
  char: string;
  romaji: string;
  bn: string;
  exampleWord: string;
  exampleMeaningBn: string;
}

const FIVE_VOWELS: KanaVowel[] = [
  { char: 'あ', romaji: 'a', bn: 'আ', exampleWord: 'あさ (Asa)', exampleMeaningBn: 'সকাল' },
  { char: 'い', romaji: 'i', bn: 'ই', exampleWord: 'いぬ (Inu)', exampleMeaningBn: 'কুকুর' },
  { char: 'う', romaji: 'u', bn: 'উ', exampleWord: 'うみ (Umi)', exampleMeaningBn: 'সমুদ্র' },
  { char: 'え', romaji: 'e', bn: 'এ', exampleWord: 'えき (Eki)', exampleMeaningBn: 'রেলওয়ে স্টেশন' },
  { char: 'お', romaji: 'o', bn: 'ও', exampleWord: 'おかね (Okane)', exampleMeaningBn: 'টাকা / অর্থ' }
];

export const ZeroJapaneseGatewayModal: React.FC<ZeroJapaneseGatewayModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [step, setStep] = useState<'vowels' | 'interactive' | 'goal'>('vowels');
  const [selectedVowelIndex, setSelectedVowelIndex] = useState(0);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);

  // Interactive step state
  const [quizSelection, setQuizSelection] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Goal step state
  const [selectedGoal, setSelectedGoal] = useState('jlpt_n5_6months');

  if (!isOpen) return null;

  const currentVowel = FIVE_VOWELS[selectedVowelIndex];

  const handlePlayVowel = (vowel: KanaVowel) => {
    speakJapanese(vowel.char);
    setHasPlayedAudio(true);
  };

  const handleQuizAnswer = (char: string) => {
    setQuizSelection(char);
    if (char === 'あ') {
      setIsCorrect(true);
      speakJapanese('あ');
      trackNihomiEvent('zero_gateway_quiz_success', { character: 'あ' });
    } else {
      setIsCorrect(false);
      speakJapanese(char);
    }
  };

  const handleFinish = () => {
    trackNihomiEvent('zero_gateway_completed', { goal: selectedGoal });
    onComplete(selectedGoal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0F0F17] border border-white/10 text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Japanese Aesthetic Glow & Header */}
        <div className="relative p-6 pb-4 border-b border-white/5 bg-gradient-to-b from-red-500/10 via-transparent to-transparent">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold font-mono tracking-wider">
              ZERO JAPANESE GATEWAY
            </span>
            <span className="text-xs text-stone-400">ধাপ {step === 'vowels' ? '১/৩' : step === 'interactive' ? '২/৩' : '৩/৩'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {step === 'vowels' && 'প্রথম ৫টি জাপানিজ স্বরবর্ণ শিখুন'}
            {step === 'interactive' && 'দ্রুত সাউন্ড ম্যাচ টেস্ট'}
            {step === 'goal' && 'আপনার জাপানিজ শেখার লক্ষ্য নির্ধারণ করুন'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            {step === 'vowels' && 'জাপানিজ ভাষা শুরু হয় এই ৫টি স্বরবর্ণ দিয়ে (あ, い, う, え, お)'}
            {step === 'interactive' && 'সঠিক অক্ষরটি ট্যাপ করে আপনার কানকে অভ্যস্ত করুন'}
            {step === 'goal' && 'আপনার উদ্দেশ্যের উপর ভিত্তি করে Nihomi OS আপনার রুট তৈরি করবে'}
          </p>

          {/* Stepper progress indicator */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className={`h-1.5 rounded-full ${step === 'vowels' || step === 'interactive' || step === 'goal' ? 'bg-red-500' : 'bg-white/10'}`} />
            <div className={`h-1.5 rounded-full ${step === 'interactive' || step === 'goal' ? 'bg-red-500' : 'bg-white/10'}`} />
            <div className={`h-1.5 rounded-full ${step === 'goal' ? 'bg-red-500' : 'bg-white/10'}`} />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {step === 'vowels' && (
            <div className="space-y-6">
              {/* Active Character Showcase Card */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center relative overflow-hidden group">
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => handlePlayVowel(currentVowel)}
                    className="p-2.5 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer text-xs font-semibold"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>উচ্চারণ শুনুন</span>
                  </button>
                </div>

                <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                  হিরাগানা ভাওয়েল #{selectedVowelIndex + 1}
                </span>

                <div className="my-4">
                  <span className="text-7xl sm:text-8xl font-black text-white font-japanese block drop-shadow-md">
                    {currentVowel.char}
                  </span>
                </div>

                <div className="flex items-center justify-center space-x-4 text-stone-300 text-sm">
                  <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-stone-400 text-xs mr-1">Romaji:</span>
                    <span className="font-bold text-white font-mono">{currentVowel.romaji}</span>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-stone-400 text-xs mr-1">বাংলা:</span>
                    <span className="font-bold text-red-400">{currentVowel.bn}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 text-xs text-stone-400">
                  উদাহরণ শব্দ: <span className="font-japanese font-bold text-stone-200">{currentVowel.exampleWord}</span> — {currentVowel.exampleMeaningBn}
                </div>
              </div>

              {/* 5 Vowel Selector Buttons */}
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {FIVE_VOWELS.map((v, idx) => (
                  <button
                    key={v.char}
                    onClick={() => {
                      setSelectedVowelIndex(idx);
                      handlePlayVowel(v);
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedVowelIndex === idx
                        ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20 scale-105'
                        : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl font-black font-japanese block">{v.char}</span>
                    <span className="text-[11px] font-mono opacity-80 block mt-0.5">{v.romaji}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'interactive' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>কুইজ চ্যালেঞ্জ</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  নিচের কোন অক্ষরটির উচ্চারণ "আ" (A)?
                </h3>
                <p className="text-xs text-stone-400 mb-4">
                  অক্ষরে ক্লিক করে সঠিক উত্তর বাছাই করুন:
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {['い', 'あ', 'お'].map((char) => {
                    const isChosen = quizSelection === char;
                    let btnStyle = 'bg-white/5 border-white/10 text-white hover:bg-white/10';
                    if (isChosen) {
                      btnStyle = char === 'あ'
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                        : 'bg-rose-600/30 border-rose-500 text-rose-300';
                    }

                    return (
                      <button
                        key={char}
                        onClick={() => handleQuizAnswer(char)}
                        className={`p-5 rounded-2xl border text-center transition-all cursor-pointer ${btnStyle}`}
                      >
                        <span className="text-4xl font-black font-japanese block mb-1">{char}</span>
                        <span className="text-xs font-mono text-stone-400">ট্যাপ করুন</span>
                      </button>
                    );
                  })}
                </div>

                {quizSelection && (
                  <div className={`mt-4 p-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 ${
                    isCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>অসাধারণ! "あ" হচ্ছে হিরাগানার প্রথম অক্ষর "আ"।</span>
                      </>
                    ) : (
                      <span>সঠিক হয়নি, পুনরায় চেষ্টা করুন। (あ = আ)</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'goal' && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                আপনার প্রাথমিক লক্ষ্য কী?
              </span>

              {[
                {
                  id: 'jlpt_n5_6months',
                  title: 'JLPT N5 পাস (৬ মাসের টার্গেট)',
                  desc: 'মিন্না নো নিহোঙ্গো ১-২৫ লেসন ও অফিসিয়াল ভোকাবুলারি মাস্টার করা।',
                  icon: Target,
                  tag: 'জনপ্রিয়'
                },
                {
                  id: 'tokyo_job_ssw',
                  title: 'টোকিও জব ও স্টুডেন্ট ভিসা প্রস্তুতি',
                  desc: 'কনবিনি পার্ট-টাইম ইন্টারভিউ ও দৈনন্দিন কর্মক্ষেত্র জাপানিজ।',
                  icon: Compass,
                  tag: 'ক্যারিয়ার'
                },
                {
                  id: 'hobby_culture',
                  title: 'জাপানিজ ভাষা ও সংস্কৃতি ভালোবাসা',
                  desc: 'অ্যানিমে, গান ও সাবলীল কথোপকথন উপভোগ করার জন্য।',
                  icon: Zap,
                  tag: 'ফাউন্ডেশন'
                }
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedGoal(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                    selectedGoal === item.id
                      ? 'bg-red-600/10 border-red-500 text-white'
                      : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${selectedGoal === item.id ? 'bg-red-600 text-white' : 'bg-white/5 text-stone-400'}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-stone-300 font-mono">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Navigation CTA */}
        <div className="p-4 sm:p-6 border-t border-white/5 bg-white/5 flex items-center justify-between">
          {step !== 'vowels' ? (
            <button
              onClick={() => setStep(step === 'goal' ? 'interactive' : 'vowels')}
              className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              পেছনে যান
            </button>
          ) : (
            <div className="text-xs text-stone-500">শুরু থেকে শিখুন</div>
          )}

          {step === 'vowels' && (
            <button
              onClick={() => setStep('interactive')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 transition-all flex items-center space-x-2 cursor-pointer group"
            >
              <span>পরবর্তী ধাপ: কুইজ টেস্ট</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {step === 'interactive' && (
            <button
              onClick={() => setStep('goal')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 transition-all flex items-center space-x-2 cursor-pointer group"
            >
              <span>পরবর্তী ধাপ: লক্ষ্য নির্বাচন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {step === 'goal' && (
            <button
              onClick={handleFinish}
              className="px-7 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-red-600/25 transition-all flex items-center space-x-2 cursor-pointer group"
            >
              <span>যাত্রা শুরু করুন (কোর্স খুলুন)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
