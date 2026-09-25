import React, { useEffect, useState, useRef } from 'react';
import { Bot, Send, Sparkles, X, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { speakJapanese, stopJapaneseSpeech } from '../../../lib/tts';

interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AiSenseiDrawerProps {
  isOpen: boolean;
  creditsRemaining: number;
  onUseCredit: () => Promise<boolean>;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  'Explain は vs が',
  'N5 Daily Conversation practice',
  'に এবং で এর পার্থক্য কী?',
  'তে-ফর্ম (Te-form) নিয়ম',
];

export const AiSenseiDrawer: React.FC<AiSenseiDrawerProps> = ({
  isOpen,
  creditsRemaining,
  onUseCredit,
  onClose,
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'こんにちは! আমি Sensei Tanaka (田中先生) — আপনার AI সেনসেই। বাংলা বা ইংরেজিতে জাপানিজ ব্যাকরণ, কাঞ্জি ও ভোকাবুলারি নিয়ে যেকোনো প্রশ্ন করুন।',
    },
  ]);

  // Dispatch custom events to hide bottom nav and floating widgets
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
    if (!isOpen) {
      stopJapaneseSpeech();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return undefined;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('আপনার ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়। অনুগ্রহ করে লিখে প্রশ্ন করুন।');
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

  const askSensei = async (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) return;

    setError(null);
    const hasCredit = await onUseCredit();
    if (!hasCredit) {
      setError('AI credit শেষ হয়ে গেছে। পরের মাসে আবার চেষ্টা করুন।');
      return;
    }

    const userMessage: AiMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedQuestion,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiRequest<{ reply?: string }>('/api/ai/coach', {
        method: 'POST',
        body: JSON.stringify({
          message: trimmedQuestion,
          mode: 'conversation',
          scenario: 'N5 Japanese tutoring',
          history: nextMessages.slice(-6).map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });
      const reply = response.reply || 'দুঃখিত, এখন উত্তর তৈরি করা যাচ্ছে না। আবার চেষ্টা করুন।';
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply,
        },
      ]);
      if (!isAudioMuted) {
        speakJapanese(reply);
      }
    } catch {
      setError('Sensei-র সঙ্গে সংযোগ করা যায়নি। আপনার credit ব্যবহার হয়েছে, পরে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center bg-[#0a0a12] sm:bg-black/80 sm:backdrop-blur-md animate-fade-in"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="ai-sensei-title"
        aria-modal="true"
        className="flex h-full sm:h-auto sm:max-h-[90vh] w-full sm:max-w-lg flex-col overflow-hidden bg-[#0a0a12] text-slate-100 sm:rounded-3xl border-0 sm:border sm:border-slate-800 shadow-2xl pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
        role="dialog"
      >
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-slate-800/80 bg-gradient-to-r from-[#141424] via-[#0f0f1c] to-[#0a0a12] px-4 sm:px-5 py-3.5 sm:py-4 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 p-0.5 shadow-md shadow-rose-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <span className="font-japanese font-black text-rose-400 text-sm">田中</span>
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0a0a12]" />
            </div>
            <div>
              <h2 id="ai-sensei-title" className="text-sm sm:text-base font-bold text-white leading-tight">Nihomi Sensei AI™</h2>
              <p className="text-[11px] font-medium text-slate-400">২৪/৭ জাপানি শিক্ষক • বাংলা / English</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => {
                if (!isAudioMuted) stopJapaneseSpeech();
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

            {/* Close Button */}
            <button
              type="button"
              aria-label="AI Sensei বন্ধ করুন"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Message Feed */}
        <div className="flex-1 space-y-3 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4" aria-live="polite">
          <div className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300">
            <span>{creditsRemaining} AI credits remaining</span>
            <Sparkles size={14} className="text-amber-400" aria-hidden="true" />
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'ml-auto rounded-br-xs bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-600/20'
                  : 'rounded-bl-xs border border-slate-800 bg-[#121222] text-slate-200'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.role === 'assistant' && (
                <button
                  type="button"
                  onClick={() => speakJapanese(message.content)}
                  className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
                  aria-label="উচ্চারণ শুনুন"
                >
                  <Volume2 size={13} />
                  <span>টোকিও উচ্চারণ</span>
                </button>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#131322] border border-slate-800 text-slate-400 text-xs w-fit animate-pulse">
              <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <span>Sensei উত্তর লিখছেন...</span>
            </div>
          )}
          {error && <p className="rounded-xl bg-rose-500/10 border border-rose-500/30 px-3 py-2 text-xs font-semibold text-rose-300" role="alert">{error}</p>}
        </div>

        {/* Suggestion Pills */}
        <div className="border-t border-slate-800/80 bg-[#0c0c16] px-3 sm:px-4 py-2 shrink-0">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => { setInput(prompt); void askSensei(prompt); }}
                disabled={isLoading}
                className="shrink-0 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-50 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar with Mic & Send */}
        <div className="border-t border-slate-800 bg-[#0a0a14] p-3 sm:p-4 shrink-0">
          <form
            className="flex items-center gap-2"
            onSubmit={(event) => { event.preventDefault(); void askSensei(input); }}
          >
            {/* Mic button */}
            <button
              type="button"
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg ring-2 ring-rose-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
              title={isListening ? 'ভয়েস ইনপুট বন্ধ করুন' : 'মাইক্রোফোনে কথা বলুন'}
              aria-label="Microphone"
            >
              {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-rose-400" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={isListening ? 'কথা বলুন, শোনা হচ্ছে...' : 'আপনার Japanese প্রশ্ন লিখুন...'}
              disabled={isLoading}
              className="flex-1 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 transition-colors disabled:bg-slate-900/50"
            />
            <button
              type="submit"
              aria-label="প্রশ্ন পাঠান"
              disabled={isLoading || !input.trim() || creditsRemaining <= 0}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-rose-600/30 flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Send size={16} aria-hidden="true" />
              <span className="hidden sm:inline">পাঠান</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export const NihomiSenseiAiDrawer = AiSenseiDrawer;
export default AiSenseiDrawer;
