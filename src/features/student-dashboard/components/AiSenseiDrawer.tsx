import React, { useEffect, useState } from 'react';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { apiRequest } from '../../../lib/api';

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
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'こんにちは! আমি AI Sensei। বাংলা বা English-এ Japanese grammar ও vocabulary প্রশ্ন করুন।',
    },
  ]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.reply || 'দুঃখিত, এখন উত্তর তৈরি করা যাচ্ছে না। আবার চেষ্টা করুন।',
        },
      ]);
    } catch {
      setError('Sensei-র সঙ্গে সংযোগ করা যায়নি। আপনার credit ব্যবহার হয়েছে, পরে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/60 sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="ai-sensei-title"
        aria-modal="true"
        className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-indigo-100 bg-white shadow-2xl sm:rounded-3xl"
        role="dialog"
      >
        <header className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <Bot size={22} aria-hidden="true" />
            </div>
            <div>
              <h2 id="ai-sensei-title" className="text-base font-bold text-stone-950">AI Sensei</h2>
              <p className="text-xs font-medium text-stone-500">বাংলা / English প্রশ্ন করুন</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="AI Sensei বন্ধ করুন"
            onClick={onClose}
            className="rounded-full p-2 text-stone-500 hover:bg-stone-200 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
          <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-800">
            <span>{creditsRemaining} AI credits remaining</span>
            <Sparkles size={15} aria-hidden="true" />
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[88%] rounded-2xl px-3.5 py-3 text-sm leading-relaxed ${message.role === 'user'
                ? 'ml-auto rounded-br-sm bg-stone-900 text-white'
                : 'rounded-bl-sm border border-stone-200 bg-stone-50 text-stone-800'}`}
            >
              {message.content}
            </div>
          ))}
          {isLoading && <p className="text-xs font-semibold text-indigo-600">Sensei ভাবছে...</p>}
          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700" role="alert">{error}</p>}
        </div>

        <div className="border-t border-stone-200 bg-white px-4 pb-4 pt-3">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => { setInput(prompt); void askSensei(prompt); }}
                disabled={isLoading}
                className="shrink-0 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-[11px] font-bold text-indigo-800 hover:bg-indigo-100 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
          <form
            className="flex items-end gap-2"
            onSubmit={(event) => { event.preventDefault(); void askSensei(input); }}
          >
            <label className="sr-only" htmlFor="ai-sensei-question">আপনার প্রশ্ন</label>
            <textarea
              id="ai-sensei-question"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="আপনার Japanese প্রশ্ন লিখুন..."
              rows={2}
              disabled={isLoading}
              className="min-h-11 flex-1 resize-none rounded-xl border border-stone-300 px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-stone-100"
            />
            <button
              type="submit"
              aria-label="প্রশ্ন পাঠান"
              disabled={isLoading || !input.trim() || creditsRemaining <= 0}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AiSenseiDrawer;
