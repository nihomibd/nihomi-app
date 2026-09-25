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
  HelpCircle,
  Mic,
  MicOff
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
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

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

  // Dispatch custom event to hide bottom nav and floating widgets when open
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('nihomi:ai-sensei-toggle', { detail: { isOpen: true } }));
      window.dispatchEvent(new CustomEvent('nihomi:modal-toggle', { detail: { isOpen: true } }));
    }
    return () => {
      window.dispatchEvent(new CustomEvent('nihomi:ai-sensei-toggle', { detail: { isOpen: false } }));
      window.dispatchEvent(new CustomEvent('nihomi:modal-toggle', { detail: { isOpen: false } }));
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      stopJapaneseSpeech();
      setPlayingMessageId(null);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
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

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('আপনার ব্রাউজারে ভয়েস রিকগনিশন সমর্থিত নয়। অনুগ্রহ করে লিখে প্রশ্ন করুন।');
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript) {
          setInput(currentTranscript);
        }
      };
      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to initialize speech recognition:', e);
      setIsListening(false);
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const handleSpeak = (messageId: string, text: string) => {
    if (isAudioMuted) return;

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
      className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center bg-[#0a0a12] sm:bg-black/80 sm:backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full h-full sm:h-[92vh] sm:max-h-[760px] sm:max-w-2xl flex flex-col sm:rounded-3xl border-0 sm:border sm:border-rose-500/30 bg-[#0a0a12] text-slate-100 shadow-2xl overflow-hidden pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
        {/* Header with Sensei Tanaka Avatar, Title, Audio Toggle & Close */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-800/80 bg-gradient-to-r from-[#141424] via-[#0f0f1c] to-[#0a0a12] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 p-0.5 shadow-lg shadow-rose-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <span className="font-japanese font-black text-rose-400 text-sm sm:text-base">田中</span>
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0a0a12]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white leading-tight">Nihomi Sensei AI™</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
                  Tanaka
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[170px] sm:max-w-xs">
                ২৪/৭ জাপানিজ শিক্ষক • বাংলা ও রোমাজিসহ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Audio Toggle Button */}
            <button
              type="button"
              onClick={() => {
                if (!isAudioMuted) {
                  stopJapaneseSpeech();
                  setPlayingMessageId(null);
                }
                setIsAudioMuted(!isAudioMuted);
              }}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isAudioMuted
                  ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
              }`}
              title={isAudioMuted ? 'অডিও চালু করুন (Unmute)' : 'অডিও বন্ধ করুন (Mute)'}
              aria-label="Toggle Audio"
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Quota Indicator */}
            {isPro ? (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>N5 Pro</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-mono">
                <span>বাকি: </span>
                <strong className="text-rose-400">{dailyTurnsRemaining}/৩</strong>
              </span>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              aria-label="Close Sensei Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quota warning banner if free tier exhausted */}
        {quotaExceeded && !isPro && (
          <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="text-[11px] sm:text-xs">দৈনিক ফ্রি প্রশ্ন শেষ। আনলিমিটেড ব্যবহার করতে N5 Pro নিন।</span>
            </div>
            {onNavigateSubscription && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateSubscription();
                }}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] hover:bg-amber-400 transition-colors cursor-pointer"
              >
                আপগ্রেড
              </button>
            )}
          </div>
        )}

        {/* Message Conversation Area */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`group relative max-w-[90%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'rounded-br-xs bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-600/20'
                    : 'rounded-bl-xs bg-[#121222] border border-slate-800/90 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* AI Message Footer: Pronounce Button + Timestamp */}
                {msg.role === 'assistant' && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                    <button
                      type="button"
                      onClick={() => handleSpeak(msg.id, msg.content)}
                      className={`inline-flex items-center gap-1 px-2 py-0.8 rounded-lg text-[10px] sm:text-[11px] font-medium transition-all cursor-pointer ${
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
                          <span>টোকিও উচ্চারণ শুনুন</span>
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
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#131322] border border-slate-800 text-slate-400 text-xs w-fit animate-pulse">
              <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <span>Sensei Tanaka উত্তর লিখছেন...</span>
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
        <div className="px-3 sm:px-4 py-2 border-t border-slate-800/60 bg-[#0d0d18] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] text-rose-400 font-bold shrink-0">অনুশীলন:</span>
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => askSensei(qp.prompt)}
              disabled={isLoading || (quotaExceeded && !isPro)}
              className="shrink-0 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] sm:text-[11px] text-slate-300 hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar with Microphone and Send Button */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-[#0a0a14] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              askSensei(input);
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button */}
            <button
              type="button"
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg ring-2 ring-rose-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
              title={isListening ? 'ভয়েস ইনপুট বন্ধ করুন' : 'মাইক্রোফোনে কথা বলুন (Speech-to-Text)'}
              aria-label="Microphone"
            >
              {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-rose-400" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'কথা বলুন, শোনা হচ্ছে...' : 'জাপানিজ ব্যাকরণ, কাঞ্জি বা যেকোনো প্রশ্ন লিখুন...'}
              disabled={isLoading || (quotaExceeded && !isPro)}
              className="flex-1 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 transition-colors disabled:bg-slate-900/50"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim() || (quotaExceeded && !isPro)}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-rose-600/30 flex items-center gap-1.5 shrink-0 cursor-pointer"
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

export const NihomiSenseiAiModal = AiSenseiModal;
export default AiSenseiModal;
