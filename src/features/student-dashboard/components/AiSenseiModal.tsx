import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  ShieldCheck,
  AlertCircle,
  Crown,
  RefreshCw,
  BookOpen,
  Check,
  Flame,
  HelpCircle
} from 'lucide-react';
import { speakJapanese, stopJapaneseSpeech, extractJapanesePhrases } from '../../../lib/tts';
import { useAuth } from '../../../context/AuthContext';
import { useSubscription } from '../../../hooks/useSubscription';

interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  japanesePhrases?: string[];
  timestamp: string;
}

interface AiSenseiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSubscription?: () => void;
}

const QUICK_PROMPTS = [
  { label: 'は vs が এর পার্থক্য', prompt: 'দয়া করে N5 লেভেলের শিক্ষার্থীদের জন্য は (wa) এবং が (ga) পার্টিকলের মূল পার্থক্য উদাহরণসহ বাংলায় বুঝিয়ে দিন।' },
  { label: 'に vs で এর ব্যবহার', prompt: 'জাপানি ভাষায় に (ni) এবং で (de) কখন ব্যবহার করতে হয়? রোমাজি ও বাংলা অর্থসহ ব্যাখ্যা করুন।' },
  { label: 'তে-ফর্ম (て形) নিয়ম', prompt: 'গ্রুপ ১, ২ এবং ৩ ভার্বগুলোকে কীভাবে তে-ফর্মে (Te-form) রূপান্তর করতে হয়, সহজ ছন্দে বুঝিয়ে দিন।' },
  { label: 'কনবিনিতে শপিং ডায়লগ', prompt: 'জাপানের কনভেনিয়েন্স স্টোরে (Konbini) শপিং করার সময় দরকারি ৩টি ছোট জাপানিজ সংলাপ তৈরি করে দিন।' },
  { label: 'স্বাভাবিক আত্মপরিচয় (Jikoshoukai)', prompt: 'জাপানে কাজের ইন্টারভিউ বা ক্লাসে স্বাভাবিকভাবে জাপানিজে নিজের পরিচয় দেওয়ার জন্য একটি ফরম্যাট দিন।' }
];

export const AiSenseiModal: React.FC<AiSenseiModalProps> = ({
  isOpen,
  onClose,
  onNavigateSubscription
}) => {
  const { user } = useAuth();
  const { isPro, tier } = useSubscription();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [dailyTurnsRemaining, setDailyTurnsRemaining] = useState<number>(3);
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);

  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'こんにちは！ (Konnichiwa!) আমি Sensei Tanaka (田中先生) — আপনার ব্যক্তিগত জাপানি শিক্ষক।\n' +
        'যেকোনো জাপানি শব্দ, ব্যাকরণ (যেমন は vs が), কাঞ্জি কিংবা জাপানে বসবাসের নিয়মাবলী সম্পর্কে বাংলায় জিজ্ঞাসা করুন। প্রতিটি জাপানি শব্দের সঠিক টোকিও উচ্চারণ শুনতে 🔊 স্পিকার আইকনে ট্যাপ করুন।',
      japanesePhrases: ['こんにちは', '田中先生'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      stopJapaneseSpeech();
      setPlayingMessageId(null);
    }
  }, [isOpen, messages]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSpeak = (messageId: string, text: string) => {
    if (playingMessageId === messageId) {
      stopJapaneseSpeech();
      setPlayingMessageId(null);
      return;
    }

    stopJapaneseSpeech();
    setPlayingMessageId(messageId);

    // Extract Japanese phrases or speak full text with cleanup
    const phrases = extractJapanesePhrases(text);
    const textToSpeak = phrases.length > 0 ? phrases.join('。 ') : text;

    speakJapanese(textToSpeak, {
      rate: 0.9,
      onEnd: () => setPlayingMessageId(null),
      onError: () => setPlayingMessageId(null)
    });
  };

  const askSensei = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    if (!isPro && dailyTurnsRemaining <= 0) {
      setQuotaExceeded(true);
      setError('আপনার আজকের ৩টি ফ্রি প্রশ্ন শেষ হয়েছে। আনলিমিটেড ২৪/৭ AI সেনসেই পেতে N5 Pro-তে আপগ্রেড করুন।');
      return;
    }

    setError(null);
    const userMsg: AiMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('nihomi_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: trimmed,
          mode: 'conversation',
          scenario: 'N5 Japanese tutoring with Sensei Tanaka',
          history: nextMessages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 && data.error?.includes('Daily quota')) {
          setQuotaExceeded(true);
          throw new Error('দৈনিক ফ্রি প্রশ্নসীমা অতিক্রম করেছে। N5 Pro আপগ্রেড করুন।');
        }
        throw new Error(data.error || 'Sensei Tanaka এর সাথে যোগাযোগ করা যায়নি।');
      }

      const replyContent =
        data.reply ||
        'すみません (Sumimasen), বর্তমানে উত্তর প্রক্রিয়া করতে সমস্যা হয়েছে। দয়া করে আবার জিজ্ঞাসা করুন।';

      const jaPhrases = extractJapanesePhrases(replyContent);

      const aiMsg: AiMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        japanesePhrases: jaPhrases,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (!isPro) {
        setDailyTurnsRemaining((prev) => Math.max(0, prev - 1));
      }
    } catch (err: any) {
      console.error('AI Sensei Error:', err);
      setError(err.message || 'নেটওয়ার্ক সংযোগ ত্রুটি। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl h-[92vh] max-h-[760px] flex flex-col rounded-3xl border border-rose-500/30 bg-[#0c0c16] text-slate-100 shadow-2xl overflow-hidden">
        {/* Header with Sensei Tanaka Avatar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-gradient-to-r from-[#141424] via-[#0f0f1c] to-[#0c0c16]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 p-0.5 shadow-lg shadow-rose-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <span className="font-japanese font-black text-rose-400 text-sm">田中</span>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0c0c16]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Sensei Tanaka (田中先生)</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">24/7 ব্যাক্তিগত জাপানিজ শিক্ষক • বাংলা ও রোমাজিসহ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quota Indicator */}
            {isPro ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>N5 Pro Unlimited</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-mono">
                <span>আজ বাকি: </span>
                <strong className="text-rose-400">{dailyTurnsRemaining}/৩</strong>
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              aria-label="Close Sensei Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quota warning banner if free tier exhausted */}
        {quotaExceeded && !isPro && (
          <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>দৈনিক ফ্রি প্রশ্নসীমা পূর্ণ হয়েছে। আনলিমিটেড ব্যবহার করতে N5 Pro নিন।</span>
            </div>
            {onNavigateSubscription && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateSubscription();
                }}
                className="shrink-0 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] hover:bg-amber-400 transition-colors"
              >
                আপগ্রেড
              </button>
            )}
          </div>
        )}

        {/* Message Conversation Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`group relative max-w-[88%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'rounded-br-sm bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-600/20'
                    : 'rounded-bl-sm bg-[#131322] border border-slate-800 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* AI Message Footer: Pronounce Button + Timestamp */}
                {msg.role === 'assistant' && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-3 text-[11px] text-slate-400">
                    <button
                      type="button"
                      onClick={() => handleSpeak(msg.id, msg.content)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        playingMessageId === msg.id
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 animate-pulse'
                          : 'bg-slate-900/90 text-rose-300 hover:bg-slate-800 border border-slate-700/60'
                      }`}
                    >
                      {playingMessageId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>থামান</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>উচ্চারণ শুনুন (Tokyo Voice)</span>
                        </>
                      )}
                    </button>

                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#131322] border border-slate-800 text-slate-400 text-xs w-fit">
              <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <span>Sensei Tanaka ব্যাখ্যা প্রস্তুত করছেন...</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-800/60 bg-[#0f0f1c] flex gap-2 overflow-x-auto no-scrollbar">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => askSensei(qp.prompt)}
              disabled={isLoading || (quotaExceeded && !isPro)}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-colors disabled:opacity-40"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-[#0a0a14]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              askSensei(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="জাপানিজ ব্যাকরণ, কাঞ্জি বা যেকোনো প্রশ্ন লিখুন..."
              disabled={isLoading || (quotaExceeded && !isPro)}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 transition-colors disabled:bg-slate-900/50"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim() || (quotaExceeded && !isPro)}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">পাঠান</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiSenseiModal;
