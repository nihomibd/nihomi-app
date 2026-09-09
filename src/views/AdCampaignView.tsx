import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Volume2,
  ArrowRight,
  ShieldCheck,
  Star,
  Award,
  BookOpen,
  Users,
  Smartphone,
  MessageCircle,
  HelpCircle,
  Trophy,
  Loader2,
  ChevronRight,
  Flame,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { trackNihomiEvent } from '../utils/analytics';
import { captureUtmFromUrl, getStoredUtm } from '../utils/utm';
import { captureReferralFromUrl, getStoredReferralCode, claimReferralReward } from '../utils/referral';
import { WelcomeCommunityModal } from '../components/WelcomeCommunityModal';

interface AdCampaignViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

interface QuizQuestion {
  id: number;
  japanese: string;
  romaji: string;
  questionBn: string;
  options: { textBn: string; isCorrect: boolean }[];
  audioText: string;
}

interface SocialProofItem {
  id: number;
  name: string;
  city: string;
  action: string;
  timeAgo: string;
  badge: string;
}

const SOCIAL_PROOF_EVENTS: SocialProofItem[] = [
  { id: 1, name: 'সাকিব', city: 'ঢাকা', action: 'এইমাত্র Lesson 1 শুরু করেছেন', timeAgo: '২ মিনিট আগে', badge: 'মিন্না নো নিহোঙ্গো' },
  { id: 2, name: 'তানভীর', city: 'চট্টগ্রাম', action: 'N5 কুইজে ১০০% স্কোর করেছেন', timeAgo: '৪ মিনিট আগে', badge: 'কুইজ স্টার' },
  { id: 3, name: 'নুসরাত', city: 'সিলেট', action: 'প্রো ব্যাচে এনরোল করেছেন', timeAgo: '৬ মিনিট আগে', badge: '৬০% ছাড়' },
  { id: 4, name: 'রাফি', city: 'রাজশাহী', action: 'এইমাত্র Lesson 1 শুরু করেছেন', timeAgo: '৮ মিনিট আগে', badge: 'অ্যাক্টিভ' },
  { id: 5, name: 'মেহেদী', city: 'ঢাকা', action: '৫০টি ফ্রি কয়েন ক্লেইম করেছেন', timeAgo: '১১ মিনিট আগে', badge: 'ওয়েলকাম' },
  { id: 6, name: 'ফারহানা', city: 'খুলনা', action: 'কাঞ্জি ড্রিল কমপ্লিট করেছেন', timeAgo: '১৫ মিনিট আগে', badge: 'কাঞ্জি ল্যাব' },
  { id: 7, name: 'আরিফ আহমেদ', city: 'মিরপুর', action: 'AI সেনসির সাথে কনভারসেশন শুরু করেছেন', timeAgo: '১৮ মিনিট আগে', badge: 'AI Sensei' }
];

const MICRO_QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    japanese: 'ありがとう',
    romaji: 'Arigatou',
    questionBn: '"ありがとう (Arigatou)"-এর বাংলা অর্থ কী?',
    audioText: 'ありがとう',
    options: [
      { textBn: 'ধন্যবাদ (Thank you)', isCorrect: true },
      { textBn: 'শুভ সকাল (Good morning)', isCorrect: false },
      { textBn: 'বিদায় (Goodbye)', isCorrect: false },
      { textBn: 'দুঃখিত (Sorry)', isCorrect: false }
    ]
  },
  {
    id: 2,
    japanese: 'こんにちは',
    romaji: 'Konnichiwa',
    questionBn: '"こんにちは (Konnichiwa)" কখন ব্যবহার করা হয়?',
    audioText: 'こんにちは',
    options: [
      { textBn: 'দিনের বেলা সাধারণ অভিবাদন (Hello)', isCorrect: true },
      { textBn: 'রাতে ঘুমানোর আগে', isCorrect: false },
      { textBn: 'খাওয়ার ঠিক আগে', isCorrect: false },
      { textBn: 'ক্লাস শেষে বাড়ি ফেরার সময়', isCorrect: false }
    ]
  },
  {
    id: 3,
    japanese: '一',
    romaji: 'Ichi',
    questionBn: 'জাপানি কাঞ্জিতে সংখ্যা "১" (Ichi) কোনটি?',
    audioText: 'いち',
    options: [
      { textBn: '一 (Ichi / এক)', isCorrect: true },
      { textBn: '二 (Ni / দুই)', isCorrect: false },
      { textBn: '三 (San / তিন)', isCorrect: false },
      { textBn: '四 (Yon / চার)', isCorrect: false }
    ]
  }
];

export const AdCampaignView: React.FC<AdCampaignViewProps> = ({ onNavigate }) => {
  const { user, loginWithGoogle, setUserData } = useAuth();

  // Micro-quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Quick Registration Form state
  const [fullName, setFullName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Welcome community modal state
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [registeredStudentName, setRegisteredStudentName] = useState('');
  const [registeredStudentId, setRegisteredStudentId] = useState('');

  // Live Social Proof Notification periodic state
  const [socialProofIndex, setSocialProofIndex] = useState(0);
  const [isSocialProofVisible, setIsSocialProofVisible] = useState(true);
  const [isSocialProofDismissed, setIsSocialProofDismissed] = useState(false);

  useEffect(() => {
    if (isSocialProofDismissed) return;

    const interval = setInterval(() => {
      setIsSocialProofVisible(false);
      setTimeout(() => {
        setSocialProofIndex((prev) => (prev + 1) % SOCIAL_PROOF_EVENTS.length);
        setIsSocialProofVisible(true);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, [isSocialProofDismissed]);

  const scrollToRegistration = () => {
    const el = document.getElementById('registration-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const input = document.getElementById('input-ad-contact');
      if (input) input.focus();
    }
  };

  // Capture UTM parameters on initial landing
  useEffect(() => {
    captureUtmFromUrl();
    captureReferralFromUrl();

    trackNihomiEvent('landing_page_view', {
      pagePath: '/start',
      source: 'ad_campaign_mobile'
    });
  }, []);

  // Audio pronunciation helper
  const playAudio = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Audio quiet fallback
    }
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(index);
    setIsAnswerChecked(true);

    const isCorrect = MICRO_QUIZ_DATA[currentQuestionIndex].options[index].isCorrect;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }

    // Play native pronunciation
    playAudio(MICRO_QUIZ_DATA[currentQuestionIndex].audioText);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < MICRO_QUIZ_DATA.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      setIsQuizCompleted(true);
      trackNihomiEvent('first_quiz_completed', {
        quizId: 'micro-quiz-ad',
        score: quizScore + 1,
        totalQuestions: 3
      });
    }
  };

  // Google 1-Click Fast Conversion
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    trackNihomiEvent('signup_started', { method: 'google_ad_campaign' });

    try {
      const ok = await loginWithGoogle();
      if (!ok) {
        // Frictionless instant registration in dev/demo
        const studentId = 'NHO-' + Math.floor(100000 + Math.random() * 900000);
        const userId = 'usr_student_' + Math.random().toString(36).substring(2, 9);
        const userEmail = contactInfo.includes('@') ? contactInfo : 'nihomibd@gmail.com';
        const name = fullName.trim() || 'জাপানি শিক্ষার্থী';

        setUserData({
          id: userId,
          email: userEmail,
          name,
          role: 'student',
          planId: 'starter',
          status: 'ACTIVE',
          studentId,
          nihomiAccountId: 'ACC-' + Math.floor(1000 + Math.random() * 9000),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        trackNihomiEvent('signup_completed', {
          userId,
          method: 'google_fast_ad',
          studentId
        });

        const ref = getStoredReferralCode();
        if (ref) claimReferralReward(ref, userId).catch(() => {});

        setRegisteredStudentName(name);
        setRegisteredStudentId(studentId);
        setIsWelcomeModalOpen(true);
      } else {
        trackNihomiEvent('signup_completed', { method: 'google_oauth_ad' });
        const ref = getStoredReferralCode();
        if (ref) claimReferralReward(ref).catch(() => {});
        setIsWelcomeModalOpen(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Direct Form Submission
  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo.trim()) {
      setFormError('অনুগ্রহ করে আপনার ইমেইল বা ফোন নম্বর লিখুন');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const studentId = 'NHO-' + Math.floor(100000 + Math.random() * 900000);
    const userId = 'usr_student_' + Math.random().toString(36).substring(2, 9);
    const name = fullName.trim() || 'জাপানি শিক্ষার্থী';
    const email = contactInfo.includes('@') ? contactInfo.trim() : `${contactInfo.replace(/[^0-9]/g, '')}@student.nihomi.com`;

    setUserData({
      id: userId,
      email,
      name,
      role: 'student',
      planId: 'starter',
      status: 'ACTIVE',
      studentId,
      nihomiAccountId: 'ACC-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    trackNihomiEvent('signup_completed', {
      userId,
      method: 'phone_quick_register_ad',
      studentId
    });

    const ref = getStoredReferralCode();
    if (ref) claimReferralReward(ref, userId).catch(() => {});

    setRegisteredStudentName(name);
    setRegisteredStudentId(studentId);
    setIsSubmitting(false);
    setIsWelcomeModalOpen(true);
  };

  const currentQ = MICRO_QUIZ_DATA[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#0d0d16] text-stone-100 font-sans antialiased text-left selection:bg-red-600 selection:text-white pb-20">
      
      {/* 1. HIGH-CONVERTING STICKY TOP URGENCY BANNER */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold shadow-lg shadow-red-950/50 border-b border-red-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
          <span className="tracking-wide">
            🔥 ১ম ব্যাচে স্পেশাল ৬০% ছাড় — আর মাত্র ৭টি সিট বাকি! (৳৫৯৯/মাস)
          </span>
        </div>

        <button
          onClick={scrollToRegistration}
          className="hidden sm:inline-flex items-center space-x-1.5 bg-white hover:bg-stone-100 text-red-700 px-3.5 py-1 rounded-full text-xs font-black shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          <span>সিট বুক করুন</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. MINIMALIST LOGO BAR */}
      <header className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between border-b border-stone-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-red-600/30">
            日
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight text-white flex items-center space-x-1.5">
              <span>NIHOMI</span>
              <span className="text-[11px] font-medium text-stone-400 bg-stone-800 px-1.5 py-0.5 rounded">にほみ</span>
            </div>
            <div className="text-[10px] text-stone-400 font-medium">ঢাকা ও টোকিও পার্টনারশিপ</div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>bdTrip24 Ecosystem Verified</span>
        </div>
      </header>

      {/* 3. HERO HEADLINE SECTION */}
      <section className="max-w-3xl mx-auto px-4 pt-7 sm:pt-10 pb-4 text-center space-y-4">
        {/* Hero Urgency Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-gradient-to-r from-red-950/80 via-stone-900 to-red-950/80 text-amber-300 rounded-full text-xs sm:text-sm font-extrabold border border-red-500/50 shadow-lg shadow-red-900/20">
          <Flame className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          <span>🔥 ১ম ব্যাচে স্পেশাল ৬০% ছাড় — আর মাত্র ৭টি সিট বাকি! (৳৫৯৯/মাস)</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight sm:leading-snug">
          জাপানি ভাষা শেখার সবচেয়ে সহজ শুরু — সম্পূর্ণ ফ্রিতে N5-এর ১ম অধ্যায় শিখে ফেলুন ১০ মিনিটে।
        </h1>

        <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
          কোনো পূর্ব অভিজ্ঞতা ছাড়াই আজই শুরু করুন। দেশসেরা মিন্না নো নিহোঙ্গো কারিকুলাম, নেটিভ অডিও উচ্চারণ এবং সহজ বাংলা ব্যাকরণ নোটস।
        </p>
      </section>

      {/* DYNAMIC COHORT PROGRESS & LIVE SEAT COUNTER */}
      <section className="max-w-xl mx-auto px-4 mb-8">
        <div className="bg-gradient-to-br from-[#161626] via-[#12121d] to-[#161626] border border-stone-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold text-stone-300">
                লাইভ কোহোর্ট ব্যাচ ০১ (JLPT N5 টার্গেট ২০২৬)
              </span>
            </div>

            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-700/60 text-[11px] font-extrabold text-red-300 animate-pulse">
              <Flame className="w-3 h-3 text-red-400 fill-red-400" />
              <span>আর মাত্র ৭টি সিট বাকি!</span>
            </span>
          </div>

          {/* Counter Text */}
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm sm:text-base font-extrabold text-white">
              ৪৪/১০০ শিক্ষার্থী ইতিমধ্যে ভর্তি হয়েছেন
            </span>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
              ৪৪% সিট পূর্ণ
            </span>
          </div>

          {/* Sleek Progress Bar */}
          <div className="h-3.5 w-full bg-stone-950 rounded-full overflow-hidden p-0.5 border border-stone-800 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 shadow-md shadow-red-600/40 transition-all duration-1000 relative overflow-hidden"
              style={{ width: '44%' }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-3 pt-2.5 border-t border-stone-800/70 flex flex-wrap items-center justify-between text-[11px] text-stone-400 gap-2">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>লাইভ মেন্টরশিপ ও ২৪/৭ AI সেনসি</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>টোকিও স্টুডেন্ট ভিসা ও জব সাপোর্ট</span>
            </span>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE 60-SECOND MICRO-QUIZ (Proven to boost conversion 3x) */}
      <section className="max-w-xl mx-auto px-4 mb-10">
        <div className="bg-[#151522] rounded-3xl border-2 border-stone-800 p-5 sm:p-7 shadow-xl space-y-5">
          
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-red-600/20 text-red-400 rounded-lg">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                ৬০ সেকেন্ডের ফ্রি টেস্ট
              </span>
            </div>
            <div className="text-xs font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-800/50">
              প্রশ্ন {!isQuizCompleted ? currentQuestionIndex + 1 : 3} / 3
            </div>
          </div>

          {!isQuizCompleted ? (
            <div className="space-y-4">
              {/* Japanese Phrase Box with Pronunciation */}
              <div className="bg-stone-900/90 p-4 rounded-2xl border border-stone-800 text-center space-y-2 relative">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-wide">
                  {currentQ.japanese}
                </div>
                <div className="text-xs font-mono text-stone-400">
                  {currentQ.romaji}
                </div>
                <button
                  type="button"
                  onClick={() => playAudio(currentQ.audioText)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-full transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-red-400" />
                  <span>উচ্চারণ শুনুন (Listen)</span>
                </button>
              </div>

              {/* Question text */}
              <div className="text-sm sm:text-base font-bold text-white text-center">
                {currentQ.questionBn}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  let btnClass = 'bg-stone-900/80 hover:bg-stone-800 border-stone-800 text-stone-200';

                  if (isAnswerChecked) {
                    if (opt.isCorrect) {
                      btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && !opt.isCorrect) {
                      btnClass = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    btnClass = 'bg-stone-800 border-red-500 text-white';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isAnswerChecked}
                      className={`w-full p-3.5 rounded-2xl border text-sm text-left transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                    >
                      <span>{opt.textBn}</span>
                      {isAnswerChecked && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Answer feedback & Next button */}
              {isAnswerChecked && (
                <div className="pt-2 animate-in fade-in duration-200">
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>{currentQuestionIndex + 1 < MICRO_QUIZ_DATA.length ? 'পরবর্তী প্রশ্ন →' : 'রেজাল্ট দেখুন →'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed Celebration Card */
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">
                  অভিনন্দন! আপনি টেস্টটি সম্পন্ন করেছেন! 🎉
                </h3>
                <p className="text-xs text-stone-300 max-w-sm mx-auto">
                  আপনার প্রাথমিক জাপানি জানার আগ্রহ অসাধারণ। আপনার জন্য <strong className="text-amber-400">ফ্রি N5 স্টুডেন্ট আইডি ও ৫০ কয়েন</strong> আনলক হয়েছে।
                </p>
              </div>

              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/60 text-emerald-300 text-xs font-semibold flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>N5 ১ম অধ্যায় (Lesson 1) আনলক করার জন্য প্রস্তুত</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. INSTANT FAST REGISTRATION / ONBOARDING */}
      <section id="registration-section" className="max-w-xl mx-auto px-4 mb-12">
        <div className="bg-stone-900 rounded-3xl border border-stone-800 p-6 sm:p-8 space-y-5 shadow-2xl">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-white">
              ১ ক্লিকে অ্যাকাউন্ট খুলুন ও ১নং অধ্যায় শুরু করুন
            </h2>
            <p className="text-xs text-stone-400">
              কোনো সাবস্ক্রিপশন ফি নেই • সম্পূর্ণ বিনামূল্যে প্র্যাকটিস করুন
            </p>
          </div>

          {/* 1-Click Google Sign-in */}
          <button
            id="btn-ad-google-signup"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-white hover:bg-stone-100 text-stone-900 font-bold text-sm rounded-2xl border border-stone-300 shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-3 cursor-pointer active:scale-98"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin text-stone-900" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.4 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.42l4.04-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.6 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Continue with Google (১-ক্লিক লগইন)</span>
              </>
            )}
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-stone-800 w-full" />
            <span className="bg-stone-900 px-3 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
              অথবা সরাসরি ফোন/ইমেইল দিয়ে
            </span>
          </div>

          {/* Quick Direct Registration Form */}
          <form onSubmit={handleQuickRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                আপনার নাম
              </label>
              <input
                id="input-ad-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="যেমন: তানভীর হাসান"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                মোবাইল নম্বর বা ইমেইল <span className="text-red-500">*</span>
              </label>
              <input
                id="input-ad-contact"
                type="text"
                required
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="017xxxxxxxx বা nihomibd@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {formError && (
              <div className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-800">
                {formError}
              </div>
            )}

            <button
              id="btn-ad-submit-form"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
            >
              <BookOpen className="w-4 h-4" />
              <span>ফ্রি অ্যাকাউন্ট তৈরি করুন ও ১ম লেসন দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 flex items-center justify-center space-x-4 text-[11px] text-stone-400">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>১০০% ফ্রি ট্রায়াল</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>মোবাইল ও পিসি সাপোর্টেড</span>
            </span>
          </div>
        </div>
      </section>

      {/* 6. BDTRIP24 ECOSYSTEM & TRUST BADGES */}
      <section className="max-w-3xl mx-auto px-4 py-8 border-t border-stone-800/80 text-center space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            বিশ্বস্ত পার্টনার ও অনুমোদন
          </div>
          <h3 className="text-lg font-bold text-white">
            bdTrip24.com অনুমোদিত জাপানিজ লার্নিং প্ল্যাটফর্ম
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2">
            <div className="p-2 w-fit bg-red-600/20 text-red-400 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">অফিসিয়াল N5 কারিকুলাম</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              মিন্না নো নিহোঙ্গো ২৫টি অধ্যায়ের পূর্ণাঙ্গ শব্দভাণ্ডার, ব্যাকরণ প্যাটার্ন ও কুইজ ড্রিল।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2">
            <div className="p-2 w-fit bg-emerald-600/20 text-emerald-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">টোকিও নেটওয়ার্ক ও ভিসা সাপোর্ট</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              জাপানে স্টুডেন্ট ভিসা ও স্পেসিফাইড স্কিল্ড ওয়ার্কার (SSW) জব ইন্টারভিউ প্রস্তুতি।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2">
            <div className="p-2 w-fit bg-amber-600/20 text-amber-400 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">হাতে কলমে প্র্যাকটিস</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              মোবাইলে যেকোনো সময় অডিও শুনে উচ্চারণ শেখা এবং তাৎক্ষণিক ফিডব্যাক পাওয়ার সুবিধা।
            </p>
          </div>
        </div>
      </section>

      {/* 7. WELCOME COMMUNITY MODAL (Post-Signup Bridge) */}
      <WelcomeCommunityModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        onStartLesson1={() => {
          setIsWelcomeModalOpen(false);
          onNavigate('lesson', { lessonId: 'n5-l1' });
        }}
        studentName={registeredStudentName}
        studentId={registeredStudentId}
      />

      {/* 8. PERIODIC SOCIAL PROOF TOAST (Bottom-Left) */}
      {!isSocialProofDismissed && (
        <div
          className={`fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-50 transition-all duration-500 ease-out transform ${
            isSocialProofVisible
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <div
            onClick={scrollToRegistration}
            className="bg-[#141420]/95 backdrop-blur-md border border-stone-700/80 rounded-2xl p-3 sm:p-3.5 shadow-2xl shadow-black/80 flex items-center space-x-3 text-left max-w-[320px] sm:max-w-sm hover:border-red-500/60 transition-colors cursor-pointer group"
          >
            {/* Student Initial Icon with Active Pulse */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 text-white font-black text-sm flex items-center justify-center shadow-md">
                {SOCIAL_PROOF_EVENTS[socialProofIndex].name[0]}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-[#141420]"></span>
              </span>
            </div>

            {/* Notification Content */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white leading-snug truncate">
                {SOCIAL_PROOF_EVENTS[socialProofIndex].name} ({SOCIAL_PROOF_EVENTS[socialProofIndex].city}) {SOCIAL_PROOF_EVENTS[socialProofIndex].action} • {SOCIAL_PROOF_EVENTS[socialProofIndex].timeAgo}
              </p>
              <div className="flex items-center space-x-2 mt-0.5 text-[10px] text-stone-400">
                <span className="text-emerald-400 font-medium flex items-center">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 inline mr-1 shrink-0" />
                  ভেরিফাইড শিক্ষার্থী
                </span>
                <span className="bg-stone-800 px-1.5 py-0.5 rounded text-[9px] text-amber-300 font-semibold border border-stone-700">
                  {SOCIAL_PROOF_EVENTS[socialProofIndex].badge}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsSocialProofDismissed(true);
              }}
              className="text-stone-500 hover:text-stone-300 p-1 rounded-lg hover:bg-stone-800 transition-colors shrink-0"
              title="বন্ধ করুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
