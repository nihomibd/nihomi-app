import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  HelpCircle,
  Lightbulb,
  BookOpen,
  Mic,
  MapPin,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Loader2,
  Bot,
  X,
  MessageSquare
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';

export interface ContextualSenseiProps {
  currentConcept: {
    symbol?: string;
    reading?: string;
    meaningBn?: string;
    meaningEn?: string;
    topic?: string;
    type?: 'kana' | 'vocab' | 'grammar' | 'dialogue';
    japanContext?: string;
  };
  compact?: boolean;
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

function resolveContextualResponse(actionKey: string, concept: ContextualSenseiProps['currentConcept']): { text: string; audioPhrase?: string } {
  const sym = concept.symbol || 'এই অংশটি';
  const read = concept.reading || '';

  switch (actionKey) {
    case 'explain_bn':
      return {
        text: `চলো সহজ করে বুঝি! জাপানিজ "${sym}" (${read}) ধ্বনিটি খুব সংক্ষিপ্ত ও স্পষ্ট। মুখের বাতাস স্বাভাবিক রেখে স্বাভাবিকভাবে বলুন—"${sym}"।`,
        audioPhrase: sym
      };

    case 'make_easier':
      return {
        text: `একেবারে এক লাইনে মনে রাখুন: "${sym}" (${read})। বাংলা অক্ষরের মতো মাত্রা টানা লাগবে না, হালকা ছোঁয়ায় উচ্চারণ করুন।`,
        audioPhrase: sym
      };

    case 'example':
      if (sym === 'あ') {
        return {
          text: `বাস্তব উদাহরণ: ありがとう (Arigatou — ধন্যবাদ)। প্রতিদিন টোকিওতে ডজনখানেক বার শুনবেন!`,
          audioPhrase: 'ありがとう'
        };
      }
      if (sym === 'い') {
        return {
          text: `বাস্তব উদাহরণ: いいえ (Iie — না / No)। নম্রভাবে অসম্মতি জানাতে ব্যবহৃত হয়।`,
          audioPhrase: 'いいえ'
        };
      }
      if (sym === 'う') {
        return {
          text: `বাস্তব উদাহরণ: うどん (Udon — জাপানের সুস্বাদু নুডলস স্যুপ)। রেস্তোরাঁর মেন্যুতে দেখতে পাবেন!`,
          audioPhrase: 'うどん'
        };
      }
      if (sym === 'え') {
        return {
          text: `বাস্তব উদাহরণ: えき (Eki — রেলস্টেশন)। সাবওয়ে বা ট্রেনের সাইনবোর্ডে পাবেন।`,
          audioPhrase: 'えき'
        };
      }
      if (sym === 'お') {
        return {
          text: `বাস্তব উদাহরণ: おはよう (Ohayou — শুভ সকাল)। পরিচিতদের মিষ্টি অভিবাদন।`,
          audioPhrase: 'おはよう'
        };
      }
      return {
        text: `বাস্তব শব্দ: "${sym}" দিয়ে শুরু জাপানি শব্দ প্রতিদিনের কথোপকথনে ব্যবহৃত হয়।`,
        audioPhrase: sym
      };

    case 'why':
      return {
        text: `কেন এটা জরুরি? জাপানি ভাষার সমস্ত শব্দ মাত্র ৫টি মৌলিক স্বরবর্ণ (あ, い, う, え, お) এর সমন্বয়ে তৈরি। এগুলো ঠিক থাকলে পুরো উচ্চারণ নিখুঁত হবে!`,
        audioPhrase: sym
      };

    case 'listen_again':
      return {
        text: `ধীর গতিতে উচ্চারণ শুনুন: "${sym}" (${read})। মনোযোগ দিয়ে শুনুন।`,
        audioPhrase: sym
      };

    case 'practice':
      return {
        text: `আমার সাথে বলুন: প্রথমে আমি বলছি "${sym}"। এবার আপনার পালা—বলুন!`,
        audioPhrase: sym
      };

    case 'speak':
      return {
        text: `উচ্চারণ ড্রিল: মুখ হালকা গোল রাখুন, স্বরযন্ত্রে অতিরিক্ত চাপ দেবেন না। বলুন: "${sym}"।`,
        audioPhrase: sym
      };

    case 'japan_use':
      return {
        text: concept.japanContext || `টোকিওর কনবিনি, সাবওয়ে এবং ক্যাফেতে এই ধ্বনিটি হরহামেশা শোনা যায়। সঠিক উচ্চারণে জাপানিরা তাৎক্ষণিক আপন করে নেবে।`,
        audioPhrase: sym
      };

    default:
      return {
        text: `তানাকা সেনসেই আপনার সাথে আছেন। "${sym}" মনোযোগ দিয়ে অনুশীলন করুন!`,
        audioPhrase: sym
      };
  }
}

export const ContextualSenseiCompanion: React.FC<ContextualSenseiProps> = ({
  currentConcept
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [response, setResponse] = useState<{ text: string; audioPhrase?: string } | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const handleActionClick = (action: QuickAction) => {
    setActiveAction(action.id);
    setIsThinking(true);

    if (action.id === 'listen_again' && currentConcept.symbol) {
      setTimeout(() => {
        speakJapanese(currentConcept.symbol!, { rate: 0.75 });
      }, 100);
    }

    setTimeout(() => {
      const res = resolveContextualResponse(action.promptKey, currentConcept);
      setResponse(res);
      setIsThinking(false);

      if (action.id !== 'listen_again' && res.audioPhrase) {
        speakJapanese(res.audioPhrase);
      }
    }, 200);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Sleek, Unobtrusive Collapsible Pill Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn-haptic inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#161625]/90 hover:bg-[#1f1f33] border border-white/10 text-stone-300 hover:text-white text-xs font-semibold shadow-lg shadow-black/40 transition cursor-pointer backdrop-blur-md"
      >
        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shrink-0">
          <Bot className="w-2.5 h-2.5" />
        </div>
        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
        <span>তানাকা সেনসেই (Tanaka Sensei Tips)</span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
      </button>

      {/* Slide-out Compact Bottom Drawer / Card */}
      {isOpen && (
        <div className="w-full mt-3 p-4 rounded-2xl bg-[#12121e]/95 border border-red-500/25 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 text-left">
          {/* Header with Close */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                田
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Tanaka Sensei</span>
                  <span className="text-[10px] text-amber-400 font-normal">・ জাপানিজ লার্নিং মেন্টর</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Contextual Action Pills */}
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
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30 border border-red-500'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 hover:text-white border border-white/[0.08]'
                  }`}
                >
                  <Icon className={`w-3 h-3 ${isSelected ? 'text-amber-200' : 'text-red-400'}`} />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>

          {/* Response Box */}
          {isThinking && (
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2 text-xs text-stone-400 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
              <span>সেনসেই বিশ্লেষণ করছেন...</span>
            </div>
          )}

          {response && !isThinking && (
            <div className="p-3 rounded-xl bg-[#090912] border border-red-500/20 flex items-start justify-between gap-2 animate-in fade-in">
              <p className="text-xs text-stone-200 leading-relaxed font-medium">
                {response.text}
              </p>
              {response.audioPhrase && (
                <button
                  type="button"
                  onClick={() => speakJapanese(response.audioPhrase!)}
                  className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 transition cursor-pointer shrink-0"
                  title="উচ্চারণ শুনুন"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
