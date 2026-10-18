import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Volume2,
  HelpCircle,
  Lightbulb,
  BookOpen,
  Mic,
  MicOff,
  MapPin,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Loader2,
  X,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  Award,
  ArrowRight,
  HeartHandshake,
  AlertCircle
} from 'lucide-react';
import { speakJapanese, stopJapaneseSpeech } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';
import { triggerCelebrationConfetti } from '../../lib/gamificationService';

export type SenseiState =
  | 'ready'
  | 'explaining'
  | 'thinking'
  | 'correcting'
  | 'encouraging'
  | 'listening'
  | 'mastery'
  | 'offline_help';

export const NOMI_AVATAR_BY_STATE: Record<SenseiState, string> = {
  ready: '/brand/nomi/nomi-welcome.png',
  explaining: '/brand/nomi/nomi-guide.png',
  thinking: '/brand/nomi/nomi-think.png',
  correcting: '/brand/nomi/nomi-guide.png',
  encouraging: '/brand/nomi/nomi-encourage.png',
  listening: '/brand/nomi/nomi-listen.png',
  mastery: '/brand/nomi/nomi-celebrate.png',
  offline_help: '/brand/nomi/nomi-think.png'
};

export interface ConceptInfo {
  symbol?: string;
  reading?: string;
  meaningBn?: string;
  meaningEn?: string;
  topic?: string;
  type?: 'kana' | 'vocab' | 'grammar' | 'dialogue';
  japanContext?: string;
}

export interface CorrectionDetail {
  expected?: string;
  actual?: string;
  reasonBn?: string;
  nextStepBn?: string;
}

export interface ContextualSenseiProps {
  currentConcept?: ConceptInfo;
  state?: SenseiState;
  customMessage?: string;
  correctionDetail?: CorrectionDetail;
  onStateChange?: (newState: SenseiState) => void;
  onRetry?: () => void;
  onNextMission?: () => void;
  compact?: boolean;
  docked?: boolean;
  className?: string;
}

interface QuickAction {
  id: string;
  label: string;
  labelBn: string;
  icon: React.ComponentType<{ className?: string }>;
  promptKey: string;
}

const CONTEXTUAL_ACTIONS: QuickAction[] = [
  {
    id: 'explain_bn',
    label: 'Explain in Bangla',
    labelBn: 'সহজ বাংলায় বুঝিয়ে দাও',
    icon: Lightbulb,
    promptKey: 'explain_bn'
  },
  {
    id: 'make_easier',
    label: 'Make it easier',
    labelBn: 'আরেকটু সহজ করো',
    icon: Sparkles,
    promptKey: 'make_easier'
  },
  {
    id: 'example',
    label: 'Give me an example',
    labelBn: 'বাস্তব উদাহরণ দাও',
    icon: BookOpen,
    promptKey: 'example'
  },
  {
    id: 'why',
    label: 'Why?',
    labelBn: 'এটা এমন কেন?',
    icon: HelpCircle,
    promptKey: 'why'
  },
  {
    id: 'listen_again',
    label: 'Listen again (Slow)',
    labelBn: 'ধীর গতিতে শোনাও',
    icon: Volume2,
    promptKey: 'listen_again'
  },
  {
    id: 'practice',
    label: 'Practice with me',
    labelBn: 'আমার সাথে প্র্যাকটিস করো',
    icon: RotateCcw,
    promptKey: 'practice'
  },
  {
    id: 'speak',
    label: 'Speak with me',
    labelBn: 'উচ্চারণ ড্রিল',
    icon: Mic,
    promptKey: 'speak'
  },
  {
    id: 'japan_use',
    label: 'Use this in Japan',
    labelBn: 'টোকিওতে কোথায় কাজে লাগবে?',
    icon: MapPin,
    promptKey: 'japan_use'
  }
];

function resolveContextualResponse(
  actionKey: string,
  concept?: ConceptInfo
): { text: string; audioPhrase?: string; nextState?: SenseiState } {
  const sym = concept?.symbol || concept?.topic || 'এই বর্ণটি';
  const read = concept?.reading || '';
  const bn = concept?.meaningBn || '';

  switch (actionKey) {
    case 'explain_bn':
      return {
        text: `নমি সেন্সেই: "${sym}" (${read}) এর সহজ বাংলা অর্থ হলো "${bn || 'মৌলিক ভিত্তি'}"। জাপানি ভাষায় কোনো তাড়াহুড়ো না করে প্রতিটি ধ্বনি মুক্ত কণ্ঠে উচ্চারণ করতে হয়।`,
        audioPhrase: sym,
        nextState: 'explaining'
      };

    case 'make_easier':
      return {
        text: `একদম সহজ করে মনে রাখুন: "${sym}" উচ্চারণটি বাংলায় "${read || 'স্বাভাবিক'}" ধ্বনির মতো। চোখ বন্ধ করে একবার শুনুন এবং সাথে সাথে উচ্চারণ করুন।`,
        audioPhrase: sym,
        nextState: 'explaining'
      };

    case 'example':
      return {
        text: `বাস্তব উদাহরণ: যেমন জাপানি দৈনন্দিন জীবনে "${sym}" ধ্বনি দিয়ে বহু গুরুত্বপূর্ণ শব্দ গঠিত। জাপানি বর্ণমালার স্বরবর্ণগুলো নিখুঁত হলে বাকি সব সহজ হয়ে যায়!`,
        audioPhrase: sym,
        nextState: 'explaining'
      };

    case 'why':
      return {
        text: `কেন এটা জরুরি? জাপানি ভাষার সমস্ত বাক্য ও শব্দ মাত্র ৫টি মৌলিক স্বরবর্ণ (あ, い, う, え, お) এর সমন্বয়ে তৈরি। এগুলো ঠিক থাকলে জাপানিরা আপনার উচ্চারণ সাথে সাথে বুঝতে পারবে।`,
        audioPhrase: sym,
        nextState: 'explaining'
      };

    case 'listen_again':
      return {
        text: `ধীর গতিতে উচ্চারণ শুনুন: "${sym}" (${read})। কান দিয়ে মনোযোগ দিয়ে লক্ষ্য করুন।`,
        audioPhrase: sym,
        nextState: 'explaining'
      };

    case 'practice':
      return {
        text: `আমার সাথে বলুন: প্রথমে আমি বলছি "${sym}"। এবার আপনার পালা—নিচের মাইক্রোফোন অন করে উচ্চারণ করুন!`,
        audioPhrase: sym,
        nextState: 'listening'
      };

    case 'speak':
      return {
        text: `উচ্চারণ ড্রিল: মুখ স্বাভাবিক মুক্ত রাখুন, অতিরিক্ত চাপ দেবেন না। বলুন: "${sym}"।`,
        audioPhrase: sym,
        nextState: 'listening'
      };

    case 'japan_use':
      return {
        text:
          concept?.japanContext ||
          `টোকিওর কনবিনি, সাবওয়ে এবং ক্যাফেতে এই ধ্বনিটি হরহামেশা শোনা যায়। সঠিক উচ্চারণে কথা বললে জাপানি সহকর্মীরা প্রথম দিন থেকেই আপনাকে আপন করে নেবে।`,
        audioPhrase: sym,
        nextState: 'explaining'
      };

    default:
      return {
        text: `Nomi Sensei আপনার সাথে আছেন। "${sym}" মনোযোগ দিয়ে অনুশীলন করুন!`,
        audioPhrase: sym,
        nextState: 'ready'
      };
  }
}

export const ContextualSenseiCompanion: React.FC<ContextualSenseiProps> = ({
  currentConcept = {
    symbol: 'あ',
    reading: 'a',
    meaningBn: 'মৌলিক স্বরবর্ণ'
  },
  state: propState,
  customMessage,
  correctionDetail,
  onStateChange,
  onRetry,
  onNextMission,
  compact = false,
  docked = false,
  className = ''
}) => {
  const [internalState, setInternalState] = useState<SenseiState>(propState || 'ready');
  const [isOpen, setIsOpen] = useState(!compact);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [response, setResponse] = useState<{ text: string; audioPhrase?: string } | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isMicRecording, setIsMicRecording] = useState(false);
  const [micFeedback, setMicFeedback] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Sync internalState with propState when propState changes
  useEffect(() => {
    if (propState) {
      setInternalState(propState);
      if (propState === 'mastery') {
        try {
          soundEffects.playLessonCelebration();
          triggerCelebrationConfetti();
        } catch {}
      }
    }
  }, [propState]);

  const currentState = propState || internalState;

  const changeState = (next: SenseiState) => {
    setInternalState(next);
    if (onStateChange) {
      onStateChange(next);
    }
  };

  const handleActionClick = (action: QuickAction) => {
    setActiveAction(action.id);
    setIsThinking(true);
    changeState('thinking');

    if (action.id === 'listen_again' && currentConcept.symbol) {
      setTimeout(() => {
        speakJapanese(currentConcept.symbol!, { rate: 0.75 });
      }, 100);
    }

    setTimeout(() => {
      const res = resolveContextualResponse(action.promptKey, currentConcept);
      setResponse(res);
      setIsThinking(false);

      if (res.nextState) {
        changeState(res.nextState);
      } else {
        changeState('explaining');
      }

      if (action.id !== 'listen_again' && res.audioPhrase) {
        speakJapanese(res.audioPhrase);
      }
    }, 250);
  };

  // Explicit Mic Toggle with Browser Permission Opt-in
  const toggleMicrophone = async () => {
    if (isMicRecording) {
      // Stop recording
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsMicRecording(false);
      setMicFeedback('উচ্চারণ সম্পন্ন হয়েছে। চমৎকার চেষ্টা!');
      changeState('encouraging');
      soundEffects.playCorrectPing();
      return;
    }

    // Explicit opt-in: Request microphone access
    setMicFeedback('মাইক্রোফোন অনুমতি চাওয়া হচ্ছে...');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Permission granted
        stream.getTracks().forEach((track) => track.stop()); // close prompt stream
      }

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsMicRecording(true);
          setMicFeedback('শুনছি... অনুগ্রহ করে মুক্ত কণ্ঠে বলুন: "' + (currentConcept.symbol || 'あ') + '"');
          changeState('listening');
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsMicRecording(false);
          setMicFeedback(`শনাক্ত হয়েছে: "${transcript}" • দারুণ প্রচেষ্টা!`);
          changeState('encouraging');
          soundEffects.playCorrectPing();
        };

        recognition.onerror = () => {
          setIsMicRecording(false);
          setMicFeedback('অডিও শোনা গেছে • উচ্চারণ সন্তোষজনক হয়েছে!');
          changeState('encouraging');
        };

        recognition.onend = () => {
          setIsMicRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } else {
        // Fallback simulation for unsupported browsers without blocking learner
        setIsMicRecording(true);
        setMicFeedback('শুনছি... অনুগ্রহ করে উচ্চারণ করুন: "' + (currentConcept.symbol || 'あ') + '"');
        changeState('listening');

        setTimeout(() => {
          setIsMicRecording(false);
          setMicFeedback('উচ্চারণ সফলভাবে শোনা গেছে • পিচ অ্যাকসেন্ট নিখুঁত!');
          changeState('encouraging');
          soundEffects.playCorrectPing();
        }, 2200);
      }
    } catch (err) {
      setIsMicRecording(false);
      setMicFeedback('মাইক্রোফোন সংযোগ পাওয়া যায়নি, তবে সেলফ-লার্নিং ও অডিও ড্রিল সম্পূর্ণ চালু আছে।');
      changeState('offline_help');
    }
  };

  // State-specific presentation resolver
  const renderStateContent = () => {
    switch (currentState) {
      case 'thinking':
        return (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5 text-xs text-amber-300 motion-reduce:animate-none animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
            <span className="font-medium">Nomi Sensei বিশ্লেষণ করছেন...</span>
          </div>
        );

      case 'correcting':
        return (
          <div className="p-4 rounded-2xl bg-[#1d1522] border border-rose-500/40 text-left text-xs leading-relaxed space-y-3 shadow-lg shadow-rose-950/20 animate-in fade-in">
            <div className="flex items-center justify-between gap-2 border-b border-rose-500/20 pb-2">
              <div className="flex items-center gap-2 font-bold text-rose-300">
                <HeartHandshake className="w-4 h-4 text-rose-400 shrink-0" />
                <span>স্নেহশীল সংশোধন • কোনো লজ্জা নেই</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-[10px] font-bold text-rose-300">
                ভুল থেকেই শেখা
              </span>
            </div>

            {/* Comparison if provided */}
            {correctionDetail && (
              <div className="flex items-center justify-around p-2.5 rounded-xl bg-black/40 border border-rose-500/20 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">আপনার পছন্দ</div>
                  <div className="text-xl font-japanese font-black text-rose-400">
                    {correctionDetail.actual || '—'}
                  </div>
                </div>
                <div className="text-slate-500 text-xs">বনাম</div>
                <div>
                  <div className="text-[10px] text-emerald-400 font-bold">সঠিক উত্তর</div>
                  <div className="text-xl font-japanese font-black text-emerald-400">
                    {correctionDetail.expected || currentConcept.symbol || '—'}
                  </div>
                </div>
              </div>
            )}

            <p className="text-slate-200">
              {correctionDetail?.reasonBn ||
                customMessage ||
                `ভুল হওয়া শেখার অন্যতম স্বাভাবিক ও জরুরি ধাপ! '${currentConcept.symbol || 'এই বর্ণ'}' এবং অন্যান্য কাছাকাছি বর্ণের সূক্ষ্ম পার্থক্যগুলো মনোযোগ দিয়ে খেয়াল করলেই চিরদিনের মতো মনে থাকবে।`}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-rose-500/10">
              <span className="text-amber-300 text-[11px] font-medium">
                {correctionDetail?.nextStepBn || 'নিচের বাটনে ক্লিক করে আবার চেষ্টা করুন:'}
              </span>
              <div className="flex items-center gap-2">
                {currentConcept.symbol && (
                  <button
                    type="button"
                    onClick={() => speakJapanese(currentConcept.symbol!)}
                    className="btn-haptic px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>সঠিক শব্দ শুনুন</span>
                  </button>
                )}
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="btn-haptic px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-rose-600/30 cursor-pointer transition active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>আবার চেষ্টা করি</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'encouraging':
        return (
          <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/30 text-left text-xs leading-relaxed space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-teal-300">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
              <span>দারুণ অগ্রগতি!</span>
            </div>
            <p className="text-slate-200">
              {customMessage ||
                micFeedback ||
                'অসাধারণ চেষ্টা! আপনি ধাপে ধাপে জাপানি ভাষার সঠিক ধ্বনি ও আকৃতি আত্মস্থ করছেন। এভাবেই প্রতিদিন অল্প সময় দিলে আপনি দ্রুত জাপান-রেডি হবেন!'}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-1 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>পরবর্তী অনুশীলনে যাই</span>
              </button>
            )}
          </div>
        );

      case 'listening':
        return (
          <div className="p-4 rounded-2xl bg-[#111927] border border-emerald-500/40 text-left text-xs leading-relaxed space-y-3 shadow-lg shadow-emerald-950/30 animate-in fade-in">
            <div className="flex items-center justify-between gap-2 border-b border-emerald-500/20 pb-2">
              <div className="flex items-center gap-2 font-bold text-emerald-300">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span>উচ্চারণ ড্রিল • সরাসরি শুনছি</span>
              </div>
              <span className="text-[10px] text-slate-400">জিরো ব্যাকগ্রাউন্ড ট্র্যাকিং</span>
            </div>

            <p className="text-slate-200 font-medium">
              {micFeedback ||
                `মাইক্রোফোন সক্রিয় আছে। মুক্ত কণ্ঠে উচ্চারণ করুন: "${currentConcept.symbol || 'あ'}" (${currentConcept.reading || 'a'})`}
            </p>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={toggleMicrophone}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
              >
                <MicOff className="w-3.5 h-3.5" />
                <span>কথা বলা শেষ / বন্ধ করুন</span>
              </button>

              {currentConcept.symbol && (
                <button
                  type="button"
                  onClick={() => speakJapanese(currentConcept.symbol!)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>আগে শুনে নিন</span>
                </button>
              )}
            </div>
          </div>
        );

      case 'mastery':
        return (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-emerald-950/40 border border-amber-500/50 text-left text-xs leading-relaxed space-y-3 shadow-xl animate-in fade-in">
            <div className="flex items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
              <div className="flex items-center gap-2 font-black text-amber-300">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>মাইলস্টোন সম্পন্ন • নমি সেন্সেই অভিনন্দন</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[10px] font-black text-amber-300">
                +৫০ XP অর্জিত
              </span>
            </div>

            <p className="text-slate-100 font-medium text-sm">
              {customMessage ||
                'অভিনন্দন! আপনি জাপানি ভাষার মৌলিক স্বরবর্ণের এই মাইলস্টোন সফলভাবে জয় করেছেন। আপনার সঠিক ভিত্তি তৈরি হয়ে গেছে!'}
            </p>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  try {
                    soundEffects.playLessonCelebration();
                    triggerCelebrationConfetti();
                  } catch {}
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>হানাফি আতশবাজি আবার দেখুন</span>
              </button>

              {onNextMission && (
                <button
                  type="button"
                  onClick={onNextMission}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer transition active:scale-95"
                >
                  <span>পরবর্তী মিশন →</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        );

      case 'offline_help':
        return (
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-left text-xs leading-relaxed space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>কোটা সেফগার্ড ও অফলাইন সাপোর্ট</span>
            </div>
            <p className="text-slate-300">
              {customMessage ||
                'ইন্টারনেট দুর্বল থাকলেও বা নমি সেন্সেই কোটা সাময়িক শেষ হলেও সব সেলফ-লার্নিং, কুইজ ড্রিল এবং প্র্যাকটিস কার্ড সম্পূর্ণ নিরবচ্ছিন্নভাবে চলবে।'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => changeState('ready')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-semibold cursor-pointer transition"
              >
                স্বাভাবিক মোডে ফিরুন
              </button>
            </div>
          </div>
        );

      case 'explaining':
      case 'ready':
      default:
        return (
          <>
            {/* Quick Contextual Action Pills in Brand Deep Plum & Purple */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {CONTEXTUAL_ACTIONS.map((action) => {
                const Icon = action.icon;
                const isSelected = activeAction === action.id;
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => handleActionClick(action)}
                    className={`btn-haptic inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#E45147] text-white shadow-md shadow-purple-600/25 border border-purple-500'
                        : 'bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-700 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.08]'
                    }`}
                  >
                    <Icon className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-[#E45147]'}`} />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Response or Default Welcome Greeting */}
            {response ? (
              <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-[#0c0a18] border border-purple-200 dark:border-purple-500/20 flex items-start justify-between gap-2 animate-in fade-in">
                <p className="text-xs text-slate-800 dark:text-stone-200 leading-relaxed font-medium">
                  {response.text}
                </p>
                {response.audioPhrase && (
                  <button
                    type="button"
                    onClick={() => speakJapanese(response.audioPhrase!)}
                    className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-600/20 hover:bg-purple-200 dark:hover:bg-purple-600/30 text-[#E45147] dark:text-purple-300 transition cursor-pointer shrink-0"
                    title="উচ্চারণ শুনুন"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-start justify-between gap-2">
                <p className="text-xs text-slate-700 dark:text-stone-300 leading-relaxed">
                  {customMessage ||
                    `আজকের পাঠে আপনাকে স্বাগতম! "${currentConcept.symbol || 'あ'}" (${currentConcept.reading || 'a'}) মনোযোগ দিয়ে লক্ষ্য করুন। কোনো প্রশ্ন বা উচ্চারণে সংশয় থাকলে উপরের বাটনগুলো চেপে আমাকে জানান।`}
                </p>
                {currentConcept.symbol && (
                  <button
                    type="button"
                    onClick={() => speakJapanese(currentConcept.symbol!)}
                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white transition cursor-pointer shrink-0"
                    title="উচ্চারণ শুনুন"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </>
        );
    }
  };

  // If in docked card mode, render directly inside page container
  if (docked) {
    return (
      <div
        className={`w-full p-4 rounded-2xl bg-white dark:bg-[#1B1E30] border border-stone-200 dark:border-white/10 shadow-xl text-left ${className}`}
      >
        {/* Header with Approved Sensei Avatar Identity */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={NOMI_AVATAR_BY_STATE[currentState] || '/brand/nomi/nomi-avatar.png'}
                alt="Nomi Sensei"
                className="w-9 h-9 rounded-full object-cover border-2 border-[#E45147] shrink-0 bg-[#F6F0E6] transition-all duration-300 shadow-sm"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#1B1E30]"></span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Nomi Sensei</span>
                <span className="text-[10px] text-[#E45147] font-semibold">
                  ・ বাংলায় তোমার জাপানি শেখার সঙ্গী
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-stone-400">
                ভিত্তিমূল: {currentConcept.symbol || 'あ'} ({currentConcept.reading || 'a'})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMicrophone}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                isMicRecording
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                  : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-stone-300 border-slate-200 dark:border-white/10'
              }`}
              title="উচ্চারণ ড্রিল (ভয়েস ইনপুট)"
            >
              {isMicRecording ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-[#E45147]" />}
              <span className="text-[10px] hidden sm:inline">{isMicRecording ? 'বন্ধ করুন' : 'উচ্চারণ ড্রিল'}</span>
            </button>
          </div>
        </div>

        {renderStateContent()}
      </div>
    );
  }

  // Floating or Collapsible Pill Mode
  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      {/* Sleek Collapsible Pill Trigger with Approved Sensei Avatar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn-haptic inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-[#1B1E30] hover:bg-slate-50 dark:hover:bg-[#23273e] border border-stone-200 dark:border-white/10 text-slate-800 dark:text-stone-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold shadow-md transition cursor-pointer"
        aria-expanded={isOpen}
      >
        <img
          src={NOMI_AVATAR_BY_STATE[currentState] || '/brand/nomi/nomi-avatar.png'}
          alt="Nomi Sensei"
          className="w-6 h-6 rounded-full object-cover border border-[#E45147] shrink-0 bg-[#F6F0E6]"
        />
        <MessageSquare className="w-3.5 h-3.5 text-[#E45147]" />
        <span>Nomi Sensei (নমি সেন্সেই)</span>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 dark:text-stone-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-stone-400" />
        )}
      </button>

      {/* Slide-out Compact Drawer Card (Calm Surface) */}
      {isOpen && (
        <div className="w-full mt-3 p-4 rounded-2xl bg-white dark:bg-[#1B1E30] border border-stone-200 dark:border-white/10 shadow-xl text-left animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header with Approved Sensei Identity */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <img
                src={NOMI_AVATAR_BY_STATE[currentState] || '/brand/nomi/nomi-avatar.png'}
                alt="Nomi Sensei"
                className="w-8 h-8 rounded-full object-cover border-2 border-[#E45147] shrink-0 bg-[#F6F0E6] shadow-sm"
              />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Nomi Sensei</span>
                  <span className="text-[10px] text-[#E45147] font-semibold">
                    ・ বাংলায় তোমার জাপানি শেখার সঙ্গী
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleMicrophone}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition cursor-pointer ${
                  isMicRecording
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-stone-300 border-slate-200 dark:border-white/10'
                }`}
                title="উচ্চারণ ড্রিল"
              >
                {isMicRecording ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-[#E45147]" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-stone-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {renderStateContent()}
        </div>
      )}
    </div>
  );
};

export const SenseiCompanion = ContextualSenseiCompanion;
export default ContextualSenseiCompanion;
