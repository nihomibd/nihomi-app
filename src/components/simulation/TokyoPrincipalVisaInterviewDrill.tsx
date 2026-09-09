import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Zap,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  GraduationCap,
  Building2,
  FileCheck,
  HelpCircle,
  Clock,
  ArrowRight,
  Play
} from 'lucide-react';
import { speakJapanese, stopJapaneseSpeech } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';

export interface HighStakesQuestion {
  stepNum: number;
  id: string;
  category: 'principal' | 'visa' | 'career';
  questionJa: string;
  questionRomaji: string;
  questionBn: string;
  questionEn: string;
  interlocutor: string;
  role: string;
  avatar: string;
  modelResponseJa: string;
  modelResponseRomaji: string;
  modelResponseBn: string;
  essentialKeigoTips: string[];
  defenseCriteria: string;
}

export const TOKYO_5_HIGH_STAKES_QUESTIONS: HighStakesQuestion[] = [
  {
    stepNum: 1,
    id: 'q1_jiko_shoukai',
    category: 'principal',
    questionJa: '自己紹介をお願いします。',
    questionRomaji: 'Jiko shoukai o onegaishimasu.',
    questionBn: 'নিজের পরিচয় দিন (নাম, বয়স, শিক্ষাগত যোগ্যতা ও লক্ষ্য)',
    questionEn: 'Please introduce yourself.',
    interlocutor: 'Yamada Principal (山田校長)',
    role: 'Admissions Board Chair (Tokyo Language Academy)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    modelResponseJa: '初めまして。バングラデシュから参りましたタスニムと申します。年齢は22歳です。ダッカ大学でコンピュータサイエンスを専攻いたしました。日本の先進的なIT技術と文化に深く感銘を受け、日本での留学を決意いたしました。本日はどうぞよろしくお願いいたします。',
    modelResponseRomaji: 'Hajimemashite. Banguradeshu kara mairimashita Tasnim to moushimasu. Nenrei wa nijuunisai desu. Dakka daigaku de konpyuuta saiensu o senkou itashimashita. Nihon no senshinteki na IT gijutsu to bunka ni fukaku kanmei o uke, Nihon de no ryuugaku o ketsui itashimashita. Honjitsu wa douzo yoroshiku onegai itashimasu.',
    modelResponseBn: 'নমস্কার। বাংলাদেশ থেকে এসেছি, আমার নাম তাসনীম। বয়স ২২ বছর। ঢাকা বিশ্ববিদ্যালয়ে কম্পিউটার সায়েন্স নিয়ে পড়েছি। জাপানের উন্নত প্রযুক্তি ও সংস্কৃতিতে অনুপ্রাণিত হয়ে জাপানে উচ্চশিক্ষার সিদ্ধান্ত নিয়েছি। আজ সুযোগ দেওয়ার জন্য ধন্যবাদ।',
    essentialKeigoTips: [
      '〜と申します (Humble name introduction: My name is...)',
      '〜から参りました (Kenjougo: I came from...)',
      '本日はよろしくお願いいたします (Polite opening/closing)'
    ],
    defenseCriteria: 'State your full name, country of origin, educational background, and reason for applying in polite Keigo under 60 seconds.'
  },
  {
    stepNum: 2,
    id: 'q2_naze_nihon',
    category: 'principal',
    questionJa: 'なぜ日本に留学したいのですか？',
    questionRomaji: 'Naze Nihon ni ryuugaku shitai no desu ka?',
    questionBn: 'কেন জাপানে পড়তে যেতে চান? (জাপান বেছে নেওয়ার সুনির্দিষ্ট কারণ)',
    questionEn: 'Why do you want to study in Japan?',
    interlocutor: 'Yamada Principal (山田校長)',
    role: 'Admissions Board Chair (Tokyo Language Academy)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    modelResponseJa: '日本は世界屈指の高度なITインフラと、安全で規律ある学習環境を備えているからです。母国では体験できない実践的な先端技術を直接学び、将来両国の架け橋となる国際エンジニアとして活躍したいため、日本留学を強く志望いたしました。',
    modelResponseRomaji: 'Nihon wa sekai kusshi no koudo na IT infura to, anzen de kiritsu aru gakushuu kankyou o sonaete iru kara desu. Bokoku de wa taiken dekinai jissenteki na sentan gijutsu o chokusetsu manabi, shourai ryoukoku no kakehashi to naru kokusai enjinia to shite katsuyaku shitai tame, Nihon ryuugaku o tsuyoku shibou itashimashita.',
    modelResponseBn: 'জাপানের উচ্চ প্রযুক্তির অবকাঠামো এবং নিরাপদ ও সুশৃঙ্খল শিক্ষার পরিবেশ বিশ্ববিখ্যাত। আমার দেশে যা অর্জন সম্ভব নয় এমন প্রায়োগিক ও আধুনিক জ্ঞান সরাসরি শিখে ভবিষ্যতে দুই দেশের উন্নয়নে সহায়ক আন্তর্জাতিক ইঞ্জিনিয়ার হতে চাই।',
    essentialKeigoTips: [
      '〜からです (Clear grammatical conclusion of reason)',
      '〜に感銘を受けました (Impressed by advanced research/culture)',
      '〜志望いたしました (Humble expression for applying)'
    ],
    defenseCriteria: 'Explain why you chose Japan instead of other countries or staying local. Connect to your academic field and future ambition.'
  },
  {
    stepNum: 3,
    id: 'q3_nihongo_benkyou',
    category: 'visa',
    questionJa: '日本語の勉強はどれくらいしましたか？',
    questionRomaji: 'Nihongo no benkyou wa dore kurai shimashita ka?',
    questionBn: 'কতদিন জাপানি শিখেছেন? (JLPT/NAT লেভেল ও সময়কাল)',
    questionEn: 'How long have you been studying Japanese?',
    interlocutor: 'Tanaka Immigration Officer (田中審査官)',
    role: 'Senior Visa Examination Officer (Immigration Services Agency)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    modelResponseJa: '母国の日本語学校にて、約1年間にわたり毎日2時間、合計180時間以上勉強いたしました。すでにJLPT N5に合格しており、現在はN4合格と東京でのスムーズな学校生活に向けて、会話と漢字の特訓を継続しております。',
    modelResponseRomaji: 'Bokoku no nihongo gakkou ni te, yaku ichinenkan ni watari mainichi nijikan, goukei hyakuhachijuujikan ijou benkyou itashimashita. Sude ni JLPT N5 ni goukaku shite ori, genzai wa N4 goukaku to Tokyo de no sumuuzu na gakkou seikatsu ni mukete, kaiwa to kanji no tokkun o keizoku shite orimasu.',
    modelResponseBn: 'বাংলাদেশে একটি ল্যাঙ্গুয়েজ স্কুলে প্রায় ১ বছর যাবৎ প্রতিদিন ২ ঘণ্টা করে মোট ১৮০ ঘণ্টার বেশি ক্লাস করেছি। ইতোমধ্যে JLPT N5 পরীক্ষায় উত্তীর্ণ হয়েছি এবং বর্তমানে N4 ও টোকিওতে স্বাচ্ছন্দ্যে চলার জন্য স্পোকেন ও কাঞ্জি অনুশীলন চালিয়ে যাচ্ছি।',
    essentialKeigoTips: [
      '〜にわたり (Throughout / across the duration of...)',
      '〜勉強いたしました (Kenjougo: Studied diligently)',
      '〜継続しております (Kenjougo: Continuing forward)'
    ],
    defenseCriteria: 'State your total verified classroom study hours (must be 150+ hours for immigration validity). Name your JLPT or NAT level.'
  },
  {
    stepNum: 4,
    id: 'q4_sotsugyou_shinro',
    category: 'career',
    questionJa: '卒業後の進路はどう考えていますか？',
    questionRomaji: 'Sotsugyou go no shinro wa dou kangaete imasu ka?',
    questionBn: 'পড়ার পর ভবিষ্যৎ পরিকল্পনা কী? (উচ্চশিক্ষা বা ক্যারিয়ার)',
    questionEn: 'What are your post-graduation career plans?',
    interlocutor: 'Yamada Principal (山田校長)',
    role: 'Admissions Board Chair (Tokyo Language Academy)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    modelResponseJa: '日本語学校を卒業後、日本のIT系大学または専門学校へ進学し、システム開発を深く学びたいです。その後、日本の企業で数年間エンジニアとして実務経験を積み、将来はバングラデシュと日本の技術協力プロジェクトをリードしたいと考えております。',
    modelResponseRomaji: 'Nihongo gakkou o sotsugyou go, Nihon no IT-kei daigaku matawa senmon gakkou e shingaku shi, shisutemu kaihatsu o fukaku manabitai desu. Sono go, Nihon no kigyou de suunenkan enjinia to shite jitsumu keiken o tsumi, shourai wa Banguradeshu to Nihon no gijutsu kyouryoku purojekuto o riido shitai to kangaete orimasu.',
    modelResponseBn: 'ল্যাঙ্গুয়েজ স্কুল শেষে জাপানের কোনো তথ্যপ্রযুক্তি বিশ্ববিদ্যালয় বা কারিগরি কলেজে (সেনমন গাক্কো) ভর্তি হতে চাই। এরপর জাপানি কোম্পানিতে কয়েক বছর ইঞ্জিনিয়ার হিসেবে কাজ করে বাস্তব অভিজ্ঞতা অর্জন করবো এবং ভবিষ্যতে বাংলাদেশ-জাপান প্রযুক্তি প্রকল্পে নেতৃত্ব দেব।',
    essentialKeigoTips: [
      '〜へ進学したい (Advancing to University / Senmon Gakkou)',
      '〜実務経験を積む (Acquiring field industry experience)',
      '〜と考えております (Humble future intent)'
    ],
    defenseCriteria: 'Prove you have a concrete academic pathway: Language School -> University / Technical College -> Engineering / Business in Japan.'
  },
  {
    stepNum: 5,
    id: 'q5_gakuhi_shibensha',
    category: 'visa',
    questionJa: '学費や生活費の支弁者は誰ですか？',
    questionRomaji: 'Gakuhi ya seikatsuhi no shibensha wa dare desu ka?',
    questionBn: 'টিউশন ফি ও জীবনযাত্রার খরচের স্পন্সর কে? (খরচের সামর্থ্য ও আর্থিক স্বচ্ছলতা)',
    questionEn: 'Who is sponsoring your tuition and living expenses?',
    interlocutor: 'Tanaka Immigration Officer (田中審査官)',
    role: 'Senior Visa Examination Officer (Immigration Services Agency)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    modelResponseJa: '私の父が経費支弁者です。父はバングラデシュで会社を経営しており、日本での学費および生活費の全額を支弁する十分な預金残高と安定した年間所得がございます。資金証明書類もすべて提出済みですので、アルバイトに依存せず学業に専念できます。',
    modelResponseRomaji: 'Watashi no chichi ga keihi shibensha desu. Chichi wa Banguradeshu de kaisha o keiei shite ori, Nihon de no gakuhi oyobi seikatsuhi no zengaku o shiben suru juubun na yokin zandaka to antei shita nenkan shotoku ga gozaimasu. Shikin shoumei shorui mo subete teishutsu-zumi desu no de, arubaito ni izon sezu gakugyou ni sennen dekimasu.',
    modelResponseBn: 'আমার বাবা আমার আর্থিক স্পন্সর। তিনি বাংলাদেশে ব্যবসা পরিচালনা করেন। জাপানে আমার পড়াশোনা ও জীবনযাত্রার যাবতীয় খরচ বহনের পর্যাপ্ত ব্যাংক ব্যালেন্স ও নিয়মিত বার্ষিক আয় তাঁর রয়েছে। সকল ব্যাংক সলভেন্সি ডকুমেন্টস জমা দেওয়া হয়েছে, তাই খণ্ডকালীন কাজের ওপর নির্ভরশীল না হয়ে সম্পূর্ণ মনোযোগ পড়াশোনায় দিতে পারবো।',
    essentialKeigoTips: [
      '父 (Chichi - Humble term for father in formal interview; never お父さん)',
      '経費支弁者 (Keihi shibensha - Official financial sponsor)',
      '学業に専念できます (Can focus entirely on academics without illegal overwork)'
    ],
    defenseCriteria: 'CRITICAL VISA DEFENSE: Always refer to your father as "父 (chichi)", state their stable income, and confirm bank solvency is already documented.'
  }
];

interface QuestionEvaluationResult {
  overallScore: number;
  keigoAccuracy: number;
  grammarScore: number;
  fluencyScore: number;
  letterGrade: 'S' | 'A' | 'B' | 'C';
  feedbackBn: string;
  polishedAlternativeJa: string;
  isPassed: boolean;
}

interface TokyoPrincipalVisaInterviewDrillProps {
  onAllCompleted?: (finalAverage: number) => void;
}

export const TokyoPrincipalVisaInterviewDrill: React.FC<TokyoPrincipalVisaInterviewDrillProps> = ({
  onAllCompleted
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [evaluations, setEvaluations] = useState<Record<number, QuestionEvaluationResult>>({});
  const [userTranscripts, setUserTranscripts] = useState<Record<number, string>>({});
  const recognitionRef = useRef<any>(null);

  const currentQ = TOKYO_5_HIGH_STAKES_QUESTIONS.find((q) => q.stepNum === currentStep) || TOKYO_5_HIGH_STAKES_QUESTIONS[0];

  // Auto play question audio on step change
  useEffect(() => {
    setInputText(userTranscripts[currentStep] || '');
    setShowModelAnswer(false);
    speakJapanese(currentQ.questionJa);

    return () => {
      stopJapaneseSpeech();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [currentStep]);

  // Web Speech Recognition
  const toggleSpeechRecognition = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Your browser does not support Web Speech Recognition. You can type your Japanese response directly!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        soundEffects.playButtonTap();
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      setIsRecording(false);
    }
  };

  // Evaluate Student's Answer
  const handleEvaluateAnswer = async (submittedText?: string) => {
    const textToEvaluate = (submittedText || inputText).trim();
    if (!textToEvaluate) return;

    setIsEvaluating(true);
    soundEffects.playButtonTap();

    // Store student transcript
    setUserTranscripts((prev) => ({ ...prev, [currentStep]: textToEvaluate }));

    try {
      // Call backend evaluation route
      const res = await fetch('/api/baito/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: 'sc-school-principal',
          userText: textToEvaluate,
          history: [{ sender: 'interviewer', textJa: currentQ.questionJa }]
        })
      });

      const data = await res.json();

      let keigoAccuracy = 85;
      let grammarScore = 80;
      let fluencyScore = 82;
      let feedbackBn = 'অত্যন্ত মার্জিত এবং বিনীত কেইগো শিষ্টাচার প্রদর্শিত হয়েছে!';
      let polishedAlternativeJa = textToEvaluate;

      if (data && data.evaluation) {
        keigoAccuracy = data.evaluation.keigoAccuracy || 85;
        grammarScore = data.evaluation.grammarScore || 80;
        fluencyScore = data.evaluation.fluencyScore || 85;
        feedbackBn = data.evaluation.feedbackBn || 'প্রশংসনীয় উত্তর।';
        polishedAlternativeJa = data.evaluation.polishedAlternativeJa || textToEvaluate;
      } else {
        // Deterministic Client-side Rule Engine fallback
        const hasPolite = /です|ます|ございます|いたします|申します|参ります/.test(textToEvaluate);
        const hasInformal = /だよ|だね|じゃん|ぜ|ぞ/.test(textToEvaluate);

        if (hasInformal) {
          keigoAccuracy = 45;
          grammarScore = 60;
          feedbackBn = 'সতর্কতা: কথ্য ভাষার ইনফরমাল রূপ (যেমন: だよ/だね) পরিহার করুন। ইন্টারভিউতে অবশ্যই 〜です / 〜ます বা বিনম্র রূপ ব্যবহার করুন।';
        } else if (hasPolite) {
          keigoAccuracy = 92;
          grammarScore = 88;
          fluencyScore = textToEvaluate.length > 20 ? 90 : 78;
          feedbackBn = 'চমৎকার! আনুষ্ঠানিক বিনম্র রূপ (丁寧語/謙譲語) সঠিকভাবে রক্ষিত হয়েছে।';
        } else {
          keigoAccuracy = 65;
          grammarScore = 70;
          feedbackBn = 'বাক্যের শেষে です বা ます যুক্ত করে বক্তব্য সম্পূর্ণ করুন।';
        }

        if (currentStep === 5 && !textToEvaluate.includes('父')) {
          feedbackBn += ' (পরামর্শ: ইন্টারভিউতে নিজের বাবাকে お父さん না বলে বিনম্র শব্দ 父 (Chichi) বলুন)';
        }
      }

      const overallScore = Math.round((keigoAccuracy * 0.45) + (grammarScore * 0.35) + (fluencyScore * 0.20));
      const letterGrade = overallScore >= 90 ? 'S' : overallScore >= 80 ? 'A' : overallScore >= 70 ? 'B' : 'C';
      const isPassed = overallScore >= 70;

      const evalResult: QuestionEvaluationResult = {
        overallScore,
        keigoAccuracy,
        grammarScore,
        fluencyScore,
        letterGrade,
        feedbackBn,
        polishedAlternativeJa,
        isPassed
      };

      setEvaluations((prev) => {
        const next = { ...prev, [currentStep]: evalResult };
        // Check if all 5 completed
        const completedCount = Object.keys(next).length;
        if (completedCount === 5 && onAllCompleted) {
          const avg = Math.round(Object.values(next).reduce((a, b) => a + b.overallScore, 0) / 5);
          onAllCompleted(avg);
        }
        return next;
      });

      if (isPassed) {
        soundEffects.playCorrectPing();
      }
    } catch (err) {
      console.warn('Evaluation failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleUseModelAnswer = () => {
    setInputText(currentQ.modelResponseJa);
    handleEvaluateAnswer(currentQ.modelResponseJa);
  };

  const passedCount = Object.values(evaluations).filter((e) => e.isPassed).length;
  const currentEvaluation = evaluations[currentStep];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>TOKYO EMBASSY & PRINCIPAL INTERVIEW SIMULATOR</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>5大必須面接質問・音声ドリル (High-Stakes Visa & Admissions Defense)</span>
            </h2>
            <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
              টোকিও ল্যাঙ্গুয়েজ স্কুল অধ্যক্ষ ও জাপান দূতাবাসের ভিসা অফিসারের সবচেয়ে গুরুত্বপূর্ণ ৫টি প্রশ্ন। 
              টোকিও নেটিভ উচ্চারণ শুনুন, মাইক্রোফোনে উত্তর দিন এবং তাৎক্ষণিক কেইগো স্কোর ও সংশোধন পান।
            </p>
          </div>

          {/* Defense Readiness Meter */}
          <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 shrink-0 text-right min-w-[170px]">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              ভিসা ডিফেন্স অগ্রগতি
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
              {passedCount} / 5 <span className="text-xs text-stone-400 font-normal">প্রশ্নে উত্তীর্ণ</span>
            </div>
            <div className="w-full bg-stone-950 rounded-full h-2 mt-2 border border-stone-800 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(passedCount / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 5-Step Question Carousel Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-6 pt-5 border-t border-stone-800/80">
          {TOKYO_5_HIGH_STAKES_QUESTIONS.map((q) => {
            const isCurrent = q.stepNum === currentStep;
            const isPassed = evaluations[q.stepNum]?.isPassed;
            const hasAttempted = !!evaluations[q.stepNum];

            return (
              <button
                key={q.stepNum}
                onClick={() => {
                  soundEffects.playButtonTap();
                  setCurrentStep(q.stepNum);
                }}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg ring-1 ring-amber-500/40'
                    : isPassed
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-stone-300 hover:border-emerald-600'
                    : hasAttempted
                    ? 'bg-stone-900/60 border-stone-800 text-stone-400'
                    : 'bg-stone-950/40 border-stone-800/70 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black font-mono px-1.5 py-0.5 rounded bg-stone-900 text-amber-400">
                    Q{q.stepNum}
                  </span>
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  ) : null}
                </div>
                <div className="mt-2 text-xs font-bold truncate text-white">
                  {q.questionJa}
                </div>
                <div className="text-[10px] text-stone-400 truncate mt-0.5">
                  {q.questionBn.split('(')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Question Card & Interactive Workspace */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-6">
        {/* Interlocutor Prompt Header */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-stone-950 border border-stone-800">
          <div className="flex items-start gap-4">
            <img
              src={currentQ.avatar}
              alt={currentQ.interlocutor}
              className="w-14 h-14 rounded-2xl object-cover border border-stone-700 shrink-0 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400">
                  {currentQ.interlocutor}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                  {currentQ.role}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {currentQ.questionJa}
              </h3>
              <div className="text-xs font-mono text-amber-300/80">
                {currentQ.questionRomaji}
              </div>
              <div className="text-xs text-stone-300 font-medium pt-1">
                {currentQ.questionBn}
              </div>
            </div>
          </div>

          {/* Audio Listen Button for Native Tokyo Pronunciation */}
          <button
            onClick={() => {
              soundEffects.playButtonTap();
              speakJapanese(currentQ.questionJa);
            }}
            className="p-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-2xl shadow-lg transition flex items-center gap-1.5 shrink-0 active:scale-95"
            title="টোকিও নেটিভ অ্যাকসেন্টে শুনুন"
          >
            <Volume2 className="w-5 h-5" />
            <span className="text-xs hidden sm:inline">শুনুন (Audio)</span>
          </button>
        </div>

        {/* Essential Defense Guidance Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>গুরুত্বপূর্ণ কেইগো ও বিনম্র এক্সপ্রেশন:</span>
            </div>
            <ul className="text-xs text-stone-300 space-y-1">
              {currentQ.essentialKeigoTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-mono">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ভিসা ও ইন্টারভিউ ডিফেন্স মানদণ্ড:</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {currentQ.defenseCriteria}
            </p>
          </div>
        </div>

        {/* Student Voice / Text Response Input Area */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>আপনার জাপানি উত্তর প্রদান করুন (Tap-to-Speak or Type):</span>
            </label>
            <button
              onClick={() => setShowModelAnswer(!showModelAnswer)}
              className="text-xs text-amber-400 hover:text-amber-300 transition flex items-center gap-1 font-semibold"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{showModelAnswer ? 'নমুনা উত্তর লুকান' : 'মডেল উত্তর দেখুন (Standard Answer)'}</span>
            </button>
          </div>

          {/* Model Answer Dropdown (Optional Study Assist) */}
          <AnimatePresence>
            {showModelAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300">💡 আদর্শ টোকিও স্ট্যান্ডার্ড উত্তর (Model Response):</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speakJapanese(currentQ.modelResponseJa)}
                      className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg flex items-center gap-1 text-[11px]"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>শুনুন</span>
                    </button>
                    <button
                      onClick={handleUseModelAnswer}
                      className="px-2.5 py-1 bg-amber-500 text-stone-950 font-bold rounded-lg hover:bg-amber-400 transition text-[11px]"
                    >
                      এটি দিয়ে ড্রিল করুন
                    </button>
                  </div>
                </div>
                <div className="text-stone-100 font-medium leading-relaxed">
                  {currentQ.modelResponseJa}
                </div>
                <div className="text-amber-200/80 font-mono text-[11px]">
                  {currentQ.modelResponseRomaji}
                </div>
                <div className="text-stone-300 pt-1 border-t border-amber-500/20">
                  {currentQ.modelResponseBn}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Speech & Text Controls */}
          <div className="flex items-center gap-3">
            {/* Tap-to-Speak Button */}
            <button
              onClick={toggleSpeechRecognition}
              className={`p-4 rounded-2xl border transition flex items-center justify-center shrink-0 cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-500/30 ring-4 ring-rose-500/20'
                  : 'bg-stone-950 border-stone-800 hover:border-amber-500 text-amber-400 hover:bg-stone-900 shadow-md'
              }`}
              title={isRecording ? 'শুনছি... (Listening...)' : 'মাইক্রোফোনে জাপানি বলুন (Tap-to-Speak)'}
            >
              {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEvaluateAnswer();
              }}
              placeholder={
                isRecording
                  ? 'জাপানিতে কথা বলুন... (Listening to your Tokyo speech)'
                  : 'মাইক্রোফোনে বলুন অথবা টাইপ করুন (যেমন: 初めまして、バングラデシュから参りました...)'
              }
              className="flex-1 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-2xl px-4 py-3.5 text-sm text-stone-100 focus:outline-none transition shadow-inner font-medium"
            />

            {/* Submit & Evaluate Button */}
            <button
              disabled={!inputText.trim() || isEvaluating}
              onClick={() => handleEvaluateAnswer()}
              className="px-5 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-2xl shadow-lg transition flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>মূল্যায়ন হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>যাচাই করুন</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
            <span>💡 টিপস: স্পষ্ট উচ্চারণে বলুন। বাক্য শেষে です / ます অবশ্যই ব্যবহার করুন।</span>
            <span className="text-amber-400 font-mono">Question {currentStep} of 5</span>
          </div>
        </div>

        {/* Evaluation Feedback Card */}
        {currentEvaluation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl border ${
              currentEvaluation.isPassed
                ? 'bg-emerald-950/20 border-emerald-800/60'
                : 'bg-amber-950/20 border-amber-800/60'
            } space-y-4`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${
                  currentEvaluation.letterGrade === 'S'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : currentEvaluation.letterGrade === 'A'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-stone-800 text-stone-200'
                }`}>
                  {currentEvaluation.letterGrade}
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-400 uppercase">AI মূল্যায়ন ফলাফল</div>
                  <h4 className="text-base font-black text-white flex items-center gap-2">
                    <span>স্কোর: {currentEvaluation.overallScore} / ১০০</span>
                    {currentEvaluation.isPassed && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                        উত্তীর্ণ ✓
                      </span>
                    )}
                  </h4>
                </div>
              </div>

              {/* Sub Scores */}
              <div className="flex gap-2 text-xs">
                <div className="px-2.5 py-1 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-stone-400">敬語: </span>
                  <span className="font-bold text-emerald-400">{currentEvaluation.keigoAccuracy}%</span>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-stone-400">文法: </span>
                  <span className="font-bold text-cyan-400">{currentEvaluation.grammarScore}%</span>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-stone-400">流暢: </span>
                  <span className="font-bold text-purple-400">{currentEvaluation.fluencyScore}%</span>
                </div>
              </div>
            </div>

            {/* Bengali Feedback */}
            <div className="text-xs text-stone-200 leading-relaxed">
              <span className="font-bold text-amber-300">শিক্ষক মূল্যায়ন: </span>
              {currentEvaluation.feedbackBn}
            </div>

            {/* Polished Native Tokyo Alternative */}
            {currentEvaluation.polishedAlternativeJa && (
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>মার্জিত টোকিও নেটিভ রূপ (Polished Expression):</span>
                  </span>
                  <button
                    onClick={() => speakJapanese(currentEvaluation.polishedAlternativeJa)}
                    className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-amber-400 transition"
                    title="উচ্চারণ শুনুন"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs font-medium text-stone-100">
                  {currentEvaluation.polishedAlternativeJa}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Navigation Step Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-800">
          <button
            disabled={currentStep === 1}
            onClick={() => {
              soundEffects.playButtonTap();
              setCurrentStep((prev) => Math.max(1, prev - 1));
            }}
            className="px-4 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>পূর্ববর্তী প্রশ্ন</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep < 5 ? (
              <button
                onClick={() => {
                  soundEffects.playButtonTap();
                  setCurrentStep((prev) => Math.min(5, prev + 1));
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-lg transition"
              >
                <span>পরবর্তী প্রশ্ন (Q{currentStep + 1})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
                <span>সকল ৫টি প্রশ্ন সম্পন্ন হয়েছে!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
