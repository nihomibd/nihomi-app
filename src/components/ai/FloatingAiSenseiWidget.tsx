import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Loader2,
  Volume2,
  Minimize2,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';

export interface FloatingAiSenseiWidgetProps {
  currentContext?: {
    viewName?: string;
    lessonTitle?: string;
    jlptLevel?: string;
    targetSentence?: string;
    currentTopic?: string;
  };
}

interface Message {
  id: string;
  sender: 'user' | 'sensei';
  text: string;
  romaji?: string;
  bengaliTranslation?: string;
  grammarTip?: string;
  timestamp: string;
}

export const FloatingAiSenseiWidget: React.FC<FloatingAiSenseiWidgetProps> = ({
  currentContext
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'sensei',
      text: 'こんにちは！(Konnichiwa!) I am your AI Sensei. Ask me any grammar question, particle confusion (は vs が), or sentence breakdown in English or বাংলা!',
      romaji: 'Konnichiwa! Nan demo kiite kudasai.',
      bengaliTranslation: 'নমস্কার! যেকোনো জাপানি ব্যাকরণ ও বাক্যের প্রশ্ন জিজ্ঞাসা করুন।',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customPrompt?: string) => {
    const query = customPrompt || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          mode: 'grammar_explanation',
          scenario: currentContext?.lessonTitle || currentContext?.currentTopic || 'General Study',
          history: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        const senseiMsg: Message = {
          id: `sensei-${Date.now()}`,
          sender: 'sensei',
          text: data.reply || 'Great question! Keep practicing your Japanese patterns.',
          romaji: data.romaji,
          bengaliTranslation: data.bengaliTranslation,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, senseiMsg]);
      } else {
        // Fallback response
        const fallbackMsg: Message = {
          id: `sensei-${Date.now()}`,
          sender: 'sensei',
          text: `In Japanese, grammar particles like は (wa) mark topics while が (ga) emphasizes the specific subject. Always keep context in mind!`,
          bengaliTranslation: 'জাপানি বাক্যে は সামগ্রিক বিষয় এবং が নির্দিষ্ট কর্তাকে নির্দেশ করে।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `sensei-${Date.now()}`,
          sender: 'sensei',
          text: 'Ganbatte! Practice reading aloud to anchor grammatical muscle memory.',
          bengaliTranslation: 'জাপানি ব্যাকরণ ও উচ্চারণ নিয়মিত অনুশীলন করুন।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Minimized Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-2.5 px-4 py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all border border-stone-700/50 cursor-pointer"
          aria-label="Open AI Sensei Grammar Coach"
        >
          <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold block leading-none">AI Sensei</span>
            <span className="text-[10px] opacity-70 font-mono">Instant Grammar Help</span>
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
        </button>
      )}

      {/* Expanded Floating Chat Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] max-h-[580px] h-[520px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-900 dark:text-white animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-stone-50 dark:bg-stone-950/80 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-200" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center space-x-1.5">
                  <span>Nihomi AI Sensei</span>
                  <span className="px-1.5 py-0.2 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-[9px] font-mono font-bold rounded">
                    Gemini 2.5
                  </span>
                </h4>
                <p className="text-[10px] text-stone-400 font-mono truncate max-w-[220px]">
                  Context: {currentContext?.lessonTitle || currentContext?.viewName || 'Japanese Grammar Coach'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 transition cursor-pointer"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-stone-400 hover:text-red-500 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Context Prompt Chips */}
          <div className="p-2 bg-stone-100/60 dark:bg-stone-950/40 border-b border-stone-200 dark:border-stone-800/80 flex items-center space-x-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {[
              'は vs が difference?',
              'Explain 〜てください',
              'Check sentence grammar',
              'Translate to Bengali'
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 bg-white dark:bg-stone-900 hover:bg-stone-50 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-full shrink-0 transition cursor-pointer text-[10px]"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => {
              const isSensei = m.sender === 'sensei';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isSensei ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl space-y-1.5 ${
                      isSensei
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-tl-xs border border-stone-200 dark:border-stone-700'
                        : 'bg-red-600 text-white rounded-tr-xs shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-japanese leading-relaxed whitespace-pre-line">
                        {m.text}
                      </p>
                      {isSensei && (
                        <button
                          onClick={() => speakJapanese(m.text)}
                          className="text-stone-400 hover:text-red-500 transition shrink-0 cursor-pointer"
                          title="Listen to Japanese"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {m.bengaliTranslation && (
                      <div className="pt-1.5 border-t border-stone-200 dark:border-stone-700/60 text-[11px] text-stone-600 dark:text-stone-300 font-medium">
                        <span className="text-[9px] uppercase font-bold text-red-600 dark:text-red-400 block">
                          বাংলা অর্থ ও ব্যাকরণ:
                        </span>
                        {m.bengaliTranslation}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-stone-400 font-mono mt-0.5 px-1">
                    {m.timestamp}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center space-x-2 text-stone-400 p-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                <span>Sensei is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-stone-50 dark:bg-stone-950/80 border-t border-stone-200 dark:border-stone-800 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Sensei in English or Bengali..."
              className="flex-1 px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs outline-hidden focus:ring-1 focus:ring-red-500 text-stone-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-stone-900 disabled:opacity-30 rounded-xl transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
