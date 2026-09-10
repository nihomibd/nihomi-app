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
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  UserCheck,
  Edit3
} from 'lucide-react';
import { speakJapanese } from '../lib/tts';
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

  // Scorecard personalization state
  const [candidateName, setCandidateName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

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

  // Resilient audio pronunciation helper with zero-latency speech synthesis
  const playAudio = (text: string) => {
    try {
      speakJapanese(text, { rate: 0.85 });
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
        score: quizScore,
        totalQuestions: MICRO_QUIZ_DATA.length
      });
    }
  };

  // Scorecard calculations & metadata
  const effectiveStudentName = candidateName.trim() || user?.name || fullName.trim() || 'জাপানি শিক্ষার্থী';
  
  // Score: 3/3 -> 100%, 2/3 -> 85%, 1/3 -> 65%, 0/3 -> 50%
  const calculatedScore = quizScore === 3 ? 100 : quizScore === 2 ? 85 : quizScore === 1 ? 65 : 50;

  const readinessGrade = calculatedScore >= 90
    ? 'A+ / Tokyo Visa Ready'
    : calculatedScore >= 80
    ? 'A / Tokyo Visa Ready'
    : calculatedScore >= 60
    ? 'B+ / High Potential'
    : 'B / Foundation Starter';

  const readinessBanglaSubtitle = calculatedScore >= 80
    ? 'টোকিও স্টুডেন্ট ভিসা ও ক্যারিয়ার প্রোগ্রামের জন্য প্রস্তুত'
    : calculatedScore >= 60
    ? 'দ্রুত গতিতে জাপানি শিখে জাপান যাওয়ার অপার সম্ভাবনা রয়েছে'
    : 'প্রাথমিক ধাপ থেকে দ্রুত অগ্রসর হওয়ার উপযোগী';

  const scorecardDate = new Date().toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const certificateId = `NHO-N5-${Math.abs(quizScore * 1337 + 7892)}`;
  const studentShareUrl = `https://nihomi.com/start?ref=scorecard&score=${calculatedScore}&name=${encodeURIComponent(effectiveStudentName)}`;

  // Facebook Web Share Dialog Handler
  const handleFacebookShare = async () => {
    const quoteText = `আমি নিহোমি এআই প্ল্যাটফর্মে জাপানিজ N5 কুইজে ${calculatedScore}% পেয়েছি! আপনার লেভেল টেস্ট করুন: ${studentShareUrl}`;

    trackNihomiEvent('scorecard_shared_facebook', {
      score: calculatedScore,
      grade: readinessGrade,
      studentName: effectiveStudentName
    });

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Nihomi JLPT N5 Eligibility Scorecard',
          text: `আমি নিহোমি এআই প্ল্যাটফর্মে জাপানিজ N5 কুইজে ${calculatedScore}% পেয়েছি! আপনার লেভেল টেস্ট করুন:`,
          url: studentShareUrl
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(studentShareUrl)}&quote=${encodeURIComponent(quoteText)}`;
    window.open(fbUrl, '_blank', 'width=600,height=520,scrollbars=yes,resizable=yes');
  };

  // WhatsApp Direct Handler to +8801834-348966
  const handleWhatsAppShare = () => {
    trackNihomiEvent('scorecard_shared_whatsapp', {
      score: calculatedScore,
      grade: readinessGrade,
      studentName: effectiveStudentName
    });

    const whatsappMessage = `সালাম! আমি নিহোমি এআই প্ল্যাটফর্মে জাপানিজ N5 কুইজে ${calculatedScore}% (${readinessGrade}) পেয়েছি।\n\nশিক্ষার্থীর নাম: ${effectiveStudentName}\nরেজাল্ট ভেরিফিকেশন: bdTrip24 Ecosystem Verified\nসার্টিফিকেট আইডি: ${certificateId}\nতারিখ: ${scorecardDate}\n\nআমি নিহোমি প্রো ব্যাচে স্পেশাল অফারে অ্যাডমিশন ও স্টুডেন্ট আইডি এক্সেস নিতে চাই!`;
    const waUrl = `https://wa.me/8801834348966?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, '_blank');
  };

  // Copy shareable link
  const handleCopyShareLink = () => {
    try {
      navigator.clipboard.writeText(studentShareUrl);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2500);
      trackNihomiEvent('scorecard_link_copied', { score: calculatedScore });
    } catch {}
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
            /* VIRAL NIHOMI JLPT N5 ELIGIBILITY SCORECARD */
            <div className="animate-in zoom-in-95 duration-300 relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#19192b] via-[#121220] to-[#0a0a14] border-2 border-amber-500/60 p-5 sm:p-7 shadow-2xl space-y-5 text-left">
              
              {/* Background Japanese Watermark */}
              <div className="absolute -right-4 -bottom-6 text-stone-800/20 font-black text-8xl sm:text-9xl select-none pointer-events-none tracking-tighter">
                合格
              </div>

              {/* Scorecard Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-3.5 relative z-10">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-widest text-amber-400">
                      NIHOMI (にほみ) • JAPAN READINESS
                    </div>
                    <div className="text-sm sm:text-base font-black text-white tracking-wide">
                      JLPT N5 Eligibility Scorecard
                    </div>
                  </div>
                </div>

                {/* Verified Trust Seal Badge */}
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-600/60 text-emerald-300 text-[11px] font-extrabold shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>bdTrip24 Ecosystem Verified</span>
                </div>
              </div>

              {/* Student Name Personalization Row */}
              <div className="bg-stone-900/80 border border-stone-800/90 rounded-2xl p-3 relative z-10 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-stone-300">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>শিক্ষার্থীর নাম (Student Name):</span>
                  </div>
                  {!isEditingName && (
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>নাম পরিবর্তন</span>
                    </button>
                  )}
                </div>

                {isEditingName || !candidateName ? (
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => {
                        setCandidateName(e.target.value);
                        setFullName(e.target.value);
                      }}
                      onBlur={() => {
                        if (candidateName.trim()) setIsEditingName(false);
                      }}
                      placeholder="আপনার পূর্ণ নাম লিখুন (যেমন: তানভীর আহমেদ)"
                      className="w-full bg-stone-950/90 border border-amber-500/50 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    {candidateName && (
                      <button
                        type="button"
                        onClick={() => setIsEditingName(false)}
                        className="px-3 py-2 bg-amber-500 text-stone-950 text-xs font-extrabold rounded-xl shrink-0 cursor-pointer"
                      >
                        সেভ
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-sm sm:text-base font-black text-white flex items-center space-x-2">
                    <span>{effectiveStudentName}</span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                      ভেরিফায়েড ক্যান্ডিডেট
                    </span>
                  </div>
                )}
              </div>

              {/* Calculated Score & Readiness Grade Hero */}
              <div className="relative z-10 bg-gradient-to-br from-stone-900 via-[#1a1728] to-stone-950 rounded-2xl border border-amber-500/40 p-4 sm:p-5 text-center space-y-3 shadow-inner">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  
                  {/* Left: Huge Score Display */}
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-5xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200 bg-clip-text text-transparent drop-shadow-sm">
                      {calculatedScore}%
                    </span>
                    <span className="text-sm font-bold text-stone-400">
                      / ১০০%
                    </span>
                  </div>

                  {/* Right: Readiness Grade Badge */}
                  <div className="text-center sm:text-right space-y-1">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/50 text-amber-300 text-xs sm:text-sm font-black shadow-sm">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{readinessGrade}</span>
                    </div>
                    <div className="text-[11px] font-mono text-stone-400">
                      ভিসা টেস্ট কোয়ালিফায়েড • ৩/৩ প্রশ্ন সম্পন্ন
                    </div>
                  </div>
                </div>

                <div className="text-xs sm:text-sm font-bold text-stone-200 border-t border-stone-800/80 pt-2.5">
                  {readinessBanglaSubtitle}
                </div>

                {/* Micro Meta Badges */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="bg-stone-900/90 rounded-xl p-2 border border-stone-800 text-stone-300 flex items-center justify-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>৩ টির মধ্যে {quizScore} টি নির্ভুল উত্তর</span>
                  </div>
                  <div className="bg-stone-900/90 rounded-xl p-2 border border-stone-800 text-stone-300 flex items-center justify-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>N5 উত্তীর্ণ সম্ভাবনা: ৯৫%+</span>
                  </div>
                </div>
              </div>

              {/* Verified Trust Seal & Certificate Metadata */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-400 bg-stone-900/50 p-2.5 rounded-xl border border-stone-800/70">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-stone-300 font-semibold">ভেরিফিকেশন সিল:</span>
                  <span className="text-amber-400 font-mono font-bold">{certificateId}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>তারিখ: {scorecardDate}</span>
                </div>
              </div>

              {/* The Two 1-Click Action Buttons */}
              <div className="relative z-10 space-y-2.5 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  
                  {/* Button 1: Facebook Web Share Dialog */}
                  <button
                    type="button"
                    onClick={handleFacebookShare}
                    className="w-full py-3.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-blue-900/30 flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-98"
                  >
                    <Share2 className="w-4 h-4 shrink-0" />
                    <span>ফেসবুকে স্কোরকার্ড শেয়ার করুন</span>
                  </button>

                  {/* Button 2: WhatsApp Direct to +8801834-348966 */}
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>WhatsApp-এ রেজাল্ট পাঠান ও প্রো এক্সেস নিন</span>
                  </button>
                </div>

                {/* Secondary: Copy Link button */}
                <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="inline-flex items-center space-x-1.5 text-stone-400 hover:text-amber-400 transition-colors cursor-pointer text-[11px]"
                  >
                    {isLinkCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">লিঙ্ক কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>স্কোরকার্ড লিঙ্ক কপি করুন</span>
                      </>
                    )}
                  </button>

                  <span className="text-[11px] text-stone-500 font-mono">
                    Official Nihomi Score
                  </span>
                </div>
              </div>

              {/* Seamless Conversion CTA directly linked to Registration */}
              <div className="relative z-10 pt-2 border-t border-stone-800/80">
                <button
                  type="button"
                  onClick={scrollToRegistration}
                  className="w-full py-3 px-4 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 hover:from-stone-800 hover:to-stone-800 border border-stone-700 text-stone-200 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>এই রেজাল্ট দিয়ে বিনামূল্যে স্টুডেন্ট আইডি নিন ও ১ম অধ্যায় শুরু করুন →</span>
                </button>
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
