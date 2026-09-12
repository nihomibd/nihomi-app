import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Award,
  Timer,
  RefreshCw,
  Compass,
  Check
} from 'lucide-react';
import { trackNihomiEvent } from '../../utils/analytics';
import { speakJapanese } from '../../lib/tts';

interface JLPTDiagnosticExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTrack: (trackId: string) => void;
}

interface DiagnosticQuestion {
  id: number;
  category: 'KANA' | 'KATAKANA' | 'PARTICLE' | 'VERB' | 'KANJI';
  categoryLabelBn: string;
  promptJa: string;
  promptBn: string;
  options: { text: string; sub?: string; isCorrect: boolean }[];
  explanationBn: string;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    category: 'KANA',
    categoryLabelBn: 'হিরাগানা বেসিক',
    promptJa: '「さくら」এর সঠিক অর্থ কী?',
    promptBn: 'শব্দটি পড়ে সঠিক অর্থ বাছাই করুন:',
    options: [
      { text: 'চেরি ব্লসম (ফুল)', sub: 'Sakura', isCorrect: true },
      { text: 'রেলওয়ে স্টেশন', sub: 'Eki', isCorrect: false },
      { text: 'পানির বোতল', sub: 'Mizu', isCorrect: false },
      { text: 'সূর্যোদয়', sub: 'Asahi', isCorrect: false }
    ],
    explanationBn: '「さくら」হচ্ছে সাকুরা (Sakura), যা জাপানের জাতীয় ফুল চেরি ব্লসম।'
  },
  {
    id: 2,
    category: 'KATAKANA',
    categoryLabelBn: 'কাতাকানা বিভ্রান্তি',
    promptJa: 'কাতাকানা অক্ষর「ツ」(Tsu) এবং「シ」(Shi) এর মধ্যে পার্থক্য কী?',
    promptBn: 'সঠিক বৈশিষ্ট্যটি চিহ্নিত করুন:',
    options: [
      { text: '「ツ」(ৎসু) এর দাগগুলো উপর থেকে নিচে নামে', sub: 'Vertical strokes', isCorrect: true },
      { text: 'উভয় অক্ষর হুবহু একই রকম উচ্চারিত হয়', sub: 'Identical sounds', isCorrect: false },
      { text: '「シ」শুধুমাত্র সংখ্যার সাথে ব্যবহৃত হয়', sub: 'Numeric only', isCorrect: false },
      { text: 'কোনো পার্থক্য নেই', sub: 'No difference', isCorrect: false }
    ],
    explanationBn: 'কাতাকানা "ツ" (ৎসু) উপর থেকে নিচে ড্রপ করে, আর "シ" (শি) নিচ থেকে উপরে বাঁকে।'
  },
  {
    id: 3,
    category: 'PARTICLE',
    categoryLabelBn: 'N5 পার্টিকেল',
    promptJa: 'わたし ___ がくせい です。(আমি একজন ছাত্র)',
    promptBn: 'শূন্যস্থানে কোন পার্টিকেলটি বসবে?',
    options: [
      { text: 'は (wa)', sub: 'Topic marker', isCorrect: true },
      { text: 'を (o)', sub: 'Object marker', isCorrect: false },
      { text: 'で (de)', sub: 'Location marker', isCorrect: false },
      { text: 'へ (e)', sub: 'Direction marker', isCorrect: false }
    ],
    explanationBn: 'বাক্যের মূল বিষয় (Topic) বোঝাতে "は" (উচ্চারণ wa) পার্টিকেল বসে।'
  },
  {
    id: 4,
    category: 'VERB',
    categoryLabelBn: 'দৈনন্দিন ব্যাকরণ',
    promptJa: 'まいあさ、みず を ___。(প্রতি সকালে পানি পান করি)',
    promptBn: 'সঠিক ক্রিয়াপদ বাছাই করুন:',
    options: [
      { text: 'のみます (Nomimasu)', sub: 'পান করি', isCorrect: true },
      { text: 'たべます (Tabemasu)', sub: 'খাই', isCorrect: false },
      { text: 'いきます (Ikimasu)', sub: 'যাই', isCorrect: false },
      { text: 'ねます (Nemasu)', sub: 'ঘুমাই', isCorrect: false }
    ],
    explanationBn: 'পান করা বোঝাতে のみます (nomimasu) ব্যবহৃত হয়।'
  },
  {
    id: 5,
    category: 'KANJI',
    categoryLabelBn: 'N5 কাঞ্জি রিডিং',
    promptJa: 'কাঞ্জি「日本」এর সঠিক রিডিং কী?',
    promptBn: 'জাপানের কাঞ্জি রিডিং বাছাই করুন:',
    options: [
      { text: 'にほん (Nihon)', sub: 'জাপান', isCorrect: true },
      { text: 'とうきょう (Tokyo)', sub: 'টোকিও', isCorrect: false },
      { text: 'がくせい (Gakusei)', sub: 'ছাত্র', isCorrect: false },
      { text: 'せんせい (Sensei)', sub: 'শিক্ষক', isCorrect: false }
    ],
    explanationBn: '「日本」উচ্চারিত হয় にほん (Nihon) বা にっぽん (Nippon), যার অর্থ জাপান।'
  }
];

export const JLPTDiagnosticExamModal: React.FC<JLPTDiagnosticExamModalProps> = ({
  isOpen,
  onClose,
  onStartTrack
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isExamCompleted, setIsExamCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIdx];
  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);

    const isOptionCorrect = currentQ.options[selectedOption].isCorrect;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: selectedOption }));

    if (isOptionCorrect) {
      speakJapanese(currentQ.promptJa);
    } else {
      // Record mistake silently into learning memoryOS in background
      fetch('/api/progress/record-mistake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: currentQ.category,
          conceptId: `diagnostic-${currentQ.category.toLowerCase()}-${currentQ.id}`,
          studentAnswer: currentQ.options[selectedOption].text,
          correctAnswer: currentQ.options.find((o) => o.isCorrect)?.text || ''
        })
      }).catch(() => {});
    }
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsExamCompleted(true);
      trackNihomiEvent('diagnostic_exam_completed', {
        score: calculateScore()
      });
    }
  };

  const calculateScore = () => {
    let score = 0;
    DIAGNOSTIC_QUESTIONS.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected !== undefined && q.options[selected]?.isCorrect) {
        score += 1;
      }
    });
    return score;
  };

  const getPlacement = (score: number) => {
    if (score <= 2) {
      return {
        level: 'Zero Japanese / Beginner',
        levelBn: 'শুরু থেকে প্রস্তুতি (Zero Japanese)',
        descBn: 'আপনার জন্য সেরা সূচনা হবে হিরাগানা ও কাতাকানা ফাস্ট-ট্র্যাক দিয়ে শুরু করা।',
        trackId: 'courses',
        trackTitle: 'Zero-Japanese & Kana Mastery Track'
      };
    }
    if (score <= 4) {
      return {
        level: 'JLPT N5 Foundation Active',
        levelBn: 'JLPT N5 ফান্ডামেন্টাল সক্রিয়',
        descBn: 'আপনার অক্ষর জ্ঞান ভালো আছে। এখন মিন্না নো নিহোঙ্গো ১-২৫ লেসন ও গ্রামার প্যাটার্ন নিয়মিত করুন।',
        trackId: 'courses',
        trackTitle: 'Minna no Nihongo N5 Core Track'
      };
    }
    return {
      level: 'JLPT N5 Advanced / Ready for N4',
      levelBn: 'JLPT N5 এক্সপার্ট (N4 প্রস্তুতির জন্য প্রস্তুত)',
      descBn: 'চমৎকার পারফরম্যান্স! আপনি সরাসরি N4 ট্র্যাকে অথবা টোকিও কনবিনি ওয়ার্কিং জাপানিজ শুরু করতে পারেন।',
      trackId: 'courses',
      trackTitle: 'N4 Bridge & Tokyo Baito Simulation'
    };
  };

  const score = calculateScore();
  const placement = getPlacement(score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0F0F17] border border-white/10 text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="relative p-6 pb-4 border-b border-white/5 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono tracking-wider">
              2-MIN LEVEL CHECK
            </span>
            {!isExamCompleted && (
              <span className="text-xs text-stone-400 font-mono">
                প্রশ্ন {currentIdx + 1} / {totalQuestions}
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {isExamCompleted ? 'আপনার লেভেল ডায়াগনস্টিক রিপোর্ট' : 'জাপানিজ ভাষা লেভেল যাচাই'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            {isExamCompleted
              ? 'আপনার ফলাফলের ভিত্তিতে পার্সোনালাইজড স্টাডি পাথ নির্ধারণ করা হয়েছে।'
              : '৫টি বাছাই করা প্রশ্নের উত্তর দিয়ে আপনার বর্তমান সঠিক লেভেল জানুন।'}
          </p>

          {!isExamCompleted && (
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Question Area or Final Result Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!isExamCompleted ? (
            <div className="space-y-5">
              {/* Question Category & Prompt */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                    {currentQ.categoryLabelBn}
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono">
                    Category: {currentQ.category}
                  </span>
                </div>

                <div className="my-2">
                  <h3 className="text-lg sm:text-xl font-black text-white font-japanese">
                    {currentQ.promptJa}
                  </h3>
                  <p className="text-xs text-stone-300 mt-1">{currentQ.promptBn}</p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  let cardStyle = 'bg-white/5 border-white/10 text-stone-200 hover:bg-white/10';

                  if (isAnswerSubmitted) {
                    if (opt.isCorrect) {
                      cardStyle = 'bg-emerald-600/20 border-emerald-500 text-emerald-300';
                    } else if (isSelected && !opt.isCorrect) {
                      cardStyle = 'bg-rose-600/20 border-rose-500 text-rose-300';
                    }
                  } else if (isSelected) {
                    cardStyle = 'bg-amber-500/20 border-amber-500 text-white shadow-md shadow-amber-500/10';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${cardStyle}`}
                    >
                      <div>
                        <span className="text-sm font-bold block">{opt.text}</span>
                        {opt.sub && (
                          <span className="text-xs text-stone-400 font-mono">{opt.sub}</span>
                        )}
                      </div>
                      <div className="ml-3 shrink-0">
                        {isAnswerSubmitted ? (
                          opt.isCorrect ? (
                            <Check className="w-5 h-5 text-emerald-400" />
                          ) : isSelected ? (
                            <AlertCircle className="w-5 h-5 text-rose-400" />
                          ) : null
                        ) : (
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-amber-400 bg-amber-400/20' : 'border-white/20'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Feedback */}
              {isAnswerSubmitted && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 animate-in fade-in">
                  <span className="text-xs font-bold text-stone-300 block mb-1">ব্যাখ্যা:</span>
                  <p className="text-xs text-stone-400 leading-relaxed">{currentQ.explanationBn}</p>
                </div>
              )}
            </div>
          ) : (
            /* Result Summary */
            <div className="space-y-6 text-center">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <Award className="w-8 h-8" />
                </div>

                <span className="text-xs font-mono font-bold tracking-widest text-stone-400 uppercase">
                  আপনার স্কোর
                </span>
                <div className="text-5xl font-black text-white my-1">
                  {score} <span className="text-xl text-stone-500">/ {totalQuestions}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2">
                    {placement.level}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {placement.levelBn}
                  </h3>
                  <p className="text-xs text-stone-400 max-w-md mx-auto mt-1 leading-relaxed">
                    {placement.descBn}
                  </p>
                </div>
              </div>

              {/* Recommended Track Card */}
              <div className="p-4 rounded-2xl bg-red-600/10 border border-red-500/30 text-left flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-red-600 text-white shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-red-400 font-bold uppercase">সুপারিশকৃত কারিকুলাম</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{placement.trackTitle}</h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    এই ট্র্যাকে শুরু করলে আপনার সময় বাঁচবে এবং নির্দিষ্ট লক্ষ্য অর্জন দ্রুত হবে।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-6 border-t border-white/5 bg-white/5 flex items-center justify-between">
          {!isExamCompleted ? (
            <>
              <div className="text-xs text-stone-400">
                {isAnswerSubmitted ? 'পরবর্তী প্রশ্নে যান' : 'সঠিক উত্তর নির্বাচন করুন'}
              </div>

              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-950 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  উত্তর জমা দিন
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 transition-all flex items-center space-x-2 cursor-pointer group"
                >
                  <span>{currentIdx < totalQuestions - 1 ? 'পরবর্তী প্রশ্ন' : 'রিপোর্ট দেখুন'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setCurrentIdx(0);
                  setUserAnswers({});
                  setSelectedOption(null);
                  setIsAnswerSubmitted(false);
                  setIsExamCompleted(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white flex items-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>পুনরায় পরীক্ষা দিন</span>
              </button>

              <button
                onClick={() => {
                  onStartTrack(placement.trackId);
                  onClose();
                }}
                className="px-7 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-red-600/25 transition-all flex items-center space-x-2 cursor-pointer group"
              >
                <span>ট্র্যাকে যোগ দিন</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
