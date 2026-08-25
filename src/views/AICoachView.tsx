import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { apiRequest } from '../lib/api.js';
import { speakJapanese, stopJapaneseSpeech } from '../lib/tts.js';
import { AISessionMessage } from '../types.js';
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  AlertCircle,
  RotateCcw,
  Camera,
  Layers,
  Lightbulb,
  Mic,
  MicOff,
  Globe,
  Radio,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { VisionSenseiModal } from '../components/VisionSenseiModal.js';
import { SentenceDnaModal } from '../components/SentenceDnaModal.js';

interface AICoachViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const AICoachView: React.FC<AICoachViewProps> = ({ onNavigate }) => {
  const { user, profile, activePlanId, subscriptionDetails } = useAuth();
  const [messages, setMessages] = useState<AISessionMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<'conversation' | 'grammar_explanation' | 'vocabulary_explanation' | 'correction' | 'translation'>('conversation');
  const [scenario, setScenario] = useState<string>('General Conversation');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  
  // Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [isHandsFreeMode, setIsHandsFreeMode] = useState(false);
  const [isAutoSpeakEnabled, setIsAutoSpeakEnabled] = useState(true);
  const [speechLanguage, setSpeechLanguage] = useState<'ja-JP' | 'bn-BD' | 'en-US'>('ja-JP');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  // Modals
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const [dnaSentence, setDnaSentence] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const isHandsFreeActiveRef = useRef(isHandsFreeMode);

  // Keep ref synced
  useEffect(() => {
    isHandsFreeActiveRef.current = isHandsFreeMode;
  }, [isHandsFreeMode]);

  const usage = subscriptionDetails?.usage;
  const plan = subscriptionDetails?.plan;
  const isFreeOrStarter = activePlanId === 'free' || activePlanId === 'starter';

  const scenarios = [
    { title: 'General Conversation', ja: '日常会話', desc: 'দৈনন্দিন রুটিন, আবহাওয়া ও শখ নিয়ে আড্ডা।' },
    { title: 'Job Interview (IT / Tech)', ja: 'IT面接', desc: 'আত্মপরিচয়, প্রজেক্ট অভিজ্ঞতা ও জাপানে কাজের লক্ষ্য।' },
    { title: 'Izakaya & Dining', ja: '居酒屋・注文', desc: 'খাবারের অর্ডার, বিল চাওয়া ও রিকমেন্ডেশন জানা।' },
    { title: 'Conbini & Cashier', ja: 'コンビニ接客', desc: '৭-ইলেভেনে কেনাকাটা ও কাস্টমার সার্ভিস ডায়ালগ।' },
    { title: 'Office Task & Deadlines', ja: '報連相・業務', desc: 'বসের সাথে কাজের অগ্রগতি (Hou-Ren-So) শেয়ার করা।' }
  ];

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          role: 'assistant',
          content: `こんにちは、${profile?.displayName || 'Learner'}さん！🇯🇵\nআমি নিহোমি এআই সেনসেই। আপনার সাথে জাপানি ভাষায় কথোপকথন, বাক্যের ব্যাকরণ সংশোধন (Sentence Correction) এবং বাস্তব জাপানি জীবনের প্রস্তুতিতে সাহায্য করতে প্রস্তুত। আপনি কিবোর্ডে লিখে কিংবা সরাসরি হ্যান্ডস-ফ্রি ভয়েস মোড (Hands-free Voice) অন করে কথা বলতে পারেন।`,
          mode: 'conversation',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [profile?.displayName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup Web Speech API Recognition
  useEffect(() => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = speechLanguage;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const activeText = (finalTranscript || interimTranscript).trim();
      if (activeText) {
        setLiveTranscript(activeText);
        setInputText(activeText);

        // If in hands-free mode, trigger auto-send after 1.5s of silence
        if (isHandsFreeActiveRef.current) {
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (activeText.length > 1) {
              handleSendDirectText(activeText);
            }
          }, 1600);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition warning:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setIsRecording(false);
        setIsHandsFreeMode(false);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      // If hands-free mode is still on and not currently waiting for AI reply, restart listening
      if (isHandsFreeActiveRef.current && !isLoading) {
        try {
          recognition.start();
        } catch {
          // ignore already started error
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [speechLanguage, isLoading]);

  // Toggle single manual voice recording
  const handleToggleManualRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome or Safari.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        setLiveTranscript('');
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Mic start error:', err);
      }
    }
  };

  // Toggle Continuous Hands-Free Voice Mode
  const handleToggleHandsFree = () => {
    const nextState = !isHandsFreeMode;
    setIsHandsFreeMode(nextState);

    if (nextState) {
      try {
        setLiveTranscript('');
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Hands-free mic start error:', err);
      }
    } else {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsRecording(false);
    }
  };

  const handleSendDirectText = async (rawText: string) => {
    if (!rawText.trim() || isLoading) return;

    const userText = rawText.trim();
    setInputText('');
    setLiveTranscript('');

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    // Stop recognition while waiting for AI reply to avoid self-echoing
    try {
      recognitionRef.current?.stop();
    } catch {}

    const newMsg: AISessionMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userText,
      mode,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await apiRequest<{
        reply: string;
        romaji?: string;
        bengaliTranslation?: string;
        correctionData?: any;
        sessionId: string;
        messages: AISessionMessage[];
      }>('/api/ai/coach', {
        method: 'POST',
        body: JSON.stringify({
          message: userText,
          mode,
          scenario,
          sessionId,
          history: historyPayload
        })
      });

      setSessionId(res.sessionId);
      const assistantReply = res.reply;

      if (res.messages && res.messages.length > 0) {
        setMessages(res.messages);
      } else {
        const assistantMsg: AISessionMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: assistantReply,
          mode,
          correctionData: res.correctionData,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }

      // Auto-Speak AI Response if enabled
      if (isAutoSpeakEnabled && assistantReply) {
        // Extract Japanese portions or full text
        speakJapanese(assistantReply, {
          onEnd: () => {
            // Resume listening in Hands-Free Mode after speech finishes
            if (isHandsFreeActiveRef.current) {
              try {
                recognitionRef.current?.start();
              } catch {}
            }
          }
        });
      } else {
        if (isHandsFreeActiveRef.current) {
          setTimeout(() => {
            try {
              recognitionRef.current?.start();
            } catch {}
          }, 600);
        }
      }
    } catch (err: any) {
      console.error('Failed to send AI message:', err);
      const errorMsg: AISessionMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'আমি দুঃখিত, সংযোগে সামান্য সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        mode,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleSendDirectText(inputText);
  };

  return (
    <div id="nihomi-ai-coach-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8">
      {/* Modals */}
      <VisionSenseiModal isOpen={isVisionModalOpen} onClose={() => setIsVisionModalOpen(false)} />
      {dnaSentence && (
        <SentenceDnaModal
          isOpen={!!dnaSentence}
          onClose={() => setDnaSentence(null)}
          initialSentence={dnaSentence}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold font-serif text-stone-900">
                Nihomi AI Sensei™ (AI জাপানি কোচ)
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 uppercase">
                Gemini 3.7 Multimodal
              </span>
            </div>
            <p className="text-xs text-stone-500">
              বাস্তব কথোপকথন, তাৎক্ষণিক বাক্য সংশোধন, হ্যান্ডস-ফ্রি ভয়েস ইনপুট এবং ক্যামেরা ছবি স্ক্যান।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Hands-Free Mode Toggle Button */}
            <button
              id="btn-toggle-hands-free-coach"
              type="button"
              onClick={handleToggleHandsFree}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                isHandsFreeMode
                  ? 'bg-red-600 text-white ring-2 ring-red-400 ring-offset-1 animate-pulse'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
              }`}
              title="Toggle Hands-free Voice-to-Text Conversation"
            >
              <Radio className={`w-3.5 h-3.5 ${isHandsFreeMode ? 'text-white' : 'text-red-600'}`} />
              <span>{isHandsFreeMode ? 'হ্যান্ডস-ফ্রি ভয়েস (ON)' : 'হ্যান্ডস-ফ্রি মোড (OFF)'}</span>
            </button>

            {/* Auto-Speak AI Audio Toggle */}
            <button
              type="button"
              onClick={() => setIsAutoSpeakEnabled(!isAutoSpeakEnabled)}
              className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                isAutoSpeakEnabled
                  ? 'bg-stone-900 text-white border-stone-800'
                  : 'bg-stone-100 text-stone-400 border-stone-200 hover:text-stone-700'
              }`}
              title={isAutoSpeakEnabled ? 'অটো-ভয়েস রিপ্লাই চালু' : 'অটো-ভয়েস রিপ্লাই বন্ধ'}
            >
              {isAutoSpeakEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Vision Sensei Quick Trigger */}
            <button
              type="button"
              onClick={() => setIsVisionModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-red-400" />
              <span>Vision (📷 OCR)</span>
            </button>

            {/* Quota Badge */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>{activePlanId === 'japan_ready' ? 'Unlimited AI' : `${usage?.remainingQuota ?? 10} queries left`}</span>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center space-x-1.5 bg-stone-200/60 p-1.5 rounded-2xl border border-stone-200 text-xs font-bold overflow-x-auto">
          {[
            { id: 'conversation', label: 'কথোপকথন (Conversation)' },
            { id: 'correction', label: 'বাক্য সংশোধন (Correction)' },
            { id: 'grammar_explanation', label: 'ব্যাকরণ বিশ্লেষণ (Grammar Q&A)' },
            { id: 'translation', label: 'অনুবাদ (Translation)' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as any)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                mode === m.id
                  ? 'bg-white text-red-700 shadow-sm border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Hands-free Voice Live Status Banner */}
        {isHandsFreeMode && (
          <div className="p-3.5 bg-red-600 text-white rounded-2xl shadow-md flex items-center justify-between gap-3 animate-in fade-in duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center animate-bounce">
                <Mic className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold">
                  {isRecording ? '🎙️ হ্যান্ডস-ফ্রি ভয়েস সক্রিয় — জাপানি বা বাংলায় কথা বলুন...' : 'AI Sensei প্রস্তুত হচ্ছে...'}
                </p>
                <p className="text-[11px] text-red-100">
                  {liveTranscript ? `শুনছি: "${liveTranscript}"` : 'আপনার কথা শেষ হলে স্বয়ংক্রিয়ভাবে উত্তর দেয়া হবে ও অডিও বাজবে।'}
                </p>
              </div>
            </div>

            {/* Language Selector for Voice */}
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-[11px] text-red-200">ভাষা:</span>
              <select
                value={speechLanguage}
                onChange={(e) => setSpeechLanguage(e.target.value as any)}
                className="bg-black/30 text-white text-xs rounded-lg px-2 py-1 border border-white/20 focus:outline-none cursor-pointer"
              >
                <option value="ja-JP">日本語 (Japanese)</option>
                <option value="bn-BD">বাংলা (Bengali)</option>
                <option value="en-US">English (US)</option>
              </select>
            </div>
          </div>
        )}

        {/* Main Grid: Left Scenarios + Right Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Scenarios */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">অনুশীলনের পরিস্থিতি (Scenarios)</h2>
              <div className="space-y-2">
                {scenarios.map((sc) => (
                  <div
                    key={sc.title}
                    onClick={() => setScenario(sc.title)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                      scenario === sc.title
                        ? 'bg-red-50/70 border-red-500 shadow-xs'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">{sc.title}</span>
                      <span className="text-[11px] font-serif text-red-600">{sc.ja}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-tight">{sc.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Terminal */}
          <div className="lg:col-span-8 bg-white border border-stone-200 rounded-3xl shadow-sm flex flex-col h-[600px] overflow-hidden">
            <div className="p-4 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-stone-800">
                  Scenario: {scenario} &bull; Mode: {mode.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setMessages([])}
                className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Chat</span>
              </button>
            </div>

            {/* Chat Scroll */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-3xl p-4.5 space-y-2.5 shadow-xs ${
                      m.role === 'user'
                        ? 'bg-stone-900 text-white rounded-br-none'
                        : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-bl-none'
                    }`}
                  >
                    {m.role === 'assistant' && (
                      <div className="flex items-center justify-between border-b border-stone-200/60 pb-1.5">
                        <span className="text-[10px] font-bold text-red-600 uppercase flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5" />
                          <span>AI Sensei (JLPT {profile?.targetLevel || 'N5'})</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setDnaSentence(m.content)}
                            className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                            title="Open Sentence DNA Breakdown"
                          >
                            <Layers className="w-3 h-3" />
                            <span>Sentence DNA™</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => speakJapanese(m.content)}
                            className="p-1 rounded text-stone-400 hover:text-red-600 cursor-pointer"
                            title="Listen audio"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Correction Card if present */}
                    {m.correctionData && (
                      <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs space-y-1.5 text-stone-800 my-2">
                        <div className="font-bold text-red-700 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Sentence Correction:</span>
                        </div>
                        <p><span className="font-bold text-stone-600">Your sentence:</span> <span className="line-through text-rose-700">{m.correctionData.userSentence}</span></p>
                        <p><span className="font-bold text-emerald-700">Correct Japanese:</span> <span className="font-bold text-emerald-800">{m.correctionData.correctSentence}</span></p>
                        <p><span className="font-bold text-stone-600">Grammar rule:</span> {m.correctionData.whyIncorrect}</p>
                        <p><span className="font-bold text-blue-700">Natural Tokyo version:</span> {m.correctionData.naturalAlternative}</p>
                      </div>
                    )}

                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 flex items-center gap-2 text-xs text-stone-500">
                    <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                    <span>Sensei is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar with Voice Button */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-200 bg-stone-50 flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleManualRecording}
                className={`p-3 rounded-xl transition-colors cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-white border border-stone-300 text-stone-600 hover:text-red-600'
                }`}
                title="ভয়েস রেকর্ড করুন (Voice-to-Text)"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isRecording ? 'Listening... Speak in Japanese or Bengali...' : 'Type in Japanese (日本語) or Bengali / English...'}
                className="flex-1 p-3 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoachView;
