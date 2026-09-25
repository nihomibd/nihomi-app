import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  ShieldCheck,
  Cpu,
  Database,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

interface Message {
  id: string;
  sender: 'founder' | 'ai-ceo';
  text: string;
  timestamp: string;
  sourcesUsed?: string[];
  mode?: string;
  suggestedFollowUps?: string[];
}

export const FounderAiCeoTab: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai-ceo',
      text: `🏛️ **নমস্কার ফাউন্ডার তানভীর ভাই! আমি আপনার এআই সিইও (Executive Advisory Engine)।**

আমি নিখমির রিয়েল ডাটাবেজ, কোম্পানি ব্রেইন এবং সিস্টেম টেলিমেট্রির সাথে সরাসরি সংযুক্ত। 
আমি সম্পূর্ণ **রিড-অনলি (Read-Only)** মোডে পরিচালিত হচ্ছি। নিচের যেকোনো প্রশ্নে ক্লিক করতে পারেন অথবা সরাসরি টাইপ করুন:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourcesUsed: ['Company Brain', 'Real Telemetry Database', 'Gate 1 Security Matrix'],
      mode: 'DETERMINISTIC_TELEMETRY_ENGINE',
      suggestedFollowUps: [
        'আজকে পুরো অফিসের আপডেট দাও।',
        'আমার MRR status কী?',
        'আমার market target কী?',
        'আমার approval কী কী আছে?',
        'কোন system blocked?',
        'আজকের risk কী?'
      ]
    }
  ]);

  const quickPrompts = [
    { label: '📊 পুরো অফিসের আপডেট', query: 'আজকে পুরো অফিসের আপডেট দাও।' },
    { label: '💰 MRR Status', query: 'আমার MRR status কী?' },
    { label: '🎯 Market Target', query: 'আমার market target কী?' },
    { label: '📋 Pending Approvals', query: 'আমার approval কী কী আছে?' },
    { label: '⚠️ Blocked Systems', query: 'কোন system blocked?' },
    { label: '🛡️ আজকের ঝুঁকি (Risks)', query: 'আজকের risk কী?' }
  ];

  const handleSend = async (queryToSend?: string) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'founder',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await apiRequest('/api/founder/ai-ceo/query', {
        method: 'POST',
        body: JSON.stringify({ query })
      });

      if (res.success && res.answer) {
        const botMsg: Message = {
          id: `ceo-${Date.now()}`,
          sender: 'ai-ceo',
          text: res.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sourcesUsed: res.sourcesUsed || [],
          mode: res.mode || 'DETERMINISTIC_TELEMETRY_ENGINE',
          suggestedFollowUps: res.suggestedFollowUps || []
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errorMsg: Message = {
          id: `err-${Date.now()}`,
          sender: 'ai-ceo',
          text: `⚠️ **ত্রুটি:** রেসপন্স পেতে সমস্যা হয়েছে: ${res.error || 'Server connection error'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'ai-ceo',
        text: `⚠️ **সিস্টেম ত্রুটি:** সার্ভারের সাথে যোগাযোগ করা যায়নি। (${err.message})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* 1. SECURITY & AUTHORITY HEADER */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 border border-stone-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-white">AI CEO Executive Desk</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                READ-ONLY ACTIVE
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Grounded in live database state • Zero autonomous write authority • Human approval enforced
            </p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-stone-400 bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800">
          Engine: Gemini 2.5 Flash + Real Telemetry
        </div>
      </div>

      {/* 2. QUICK PROMPTS STRIP */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSend(qp.query)}
            className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-bold rounded-full transition-all shrink-0 cursor-pointer shadow-2xs hover:border-amber-400 disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* 3. CONVERSATION CONTAINER */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs p-5 sm:p-6 space-y-4 min-h-[420px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[540px] pr-1">
          {messages.map((msg) => {
            const isFounder = msg.sender === 'founder';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isFounder ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div className="text-[10px] text-stone-400 font-mono px-2 flex items-center space-x-1">
                  <span>{isFounder ? 'Founder (You)' : 'AI CEO'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed max-w-[92%] sm:max-w-[85%] whitespace-pre-wrap ${
                    isFounder
                      ? 'bg-stone-950 text-white font-medium rounded-tr-sm shadow-md'
                      : 'bg-stone-50 text-stone-900 border border-stone-200 rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Sources Used Badge */}
                {!isFounder && msg.sourcesUsed && msg.sourcesUsed.length > 0 && (
                  <div className="text-[10px] text-stone-400 font-mono px-2 flex flex-wrap gap-1 items-center">
                    <span className="font-bold text-stone-500">Verified Sources:</span>
                    {msg.sourcesUsed.map((src, i) => (
                      <span key={i} className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200">
                        {src}
                      </span>
                    ))}
                    {msg.mode && (
                      <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                        {msg.mode}
                      </span>
                    )}
                  </div>
                )}

                {/* Suggested Followups */}
                {!isFounder && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 px-1">
                    {msg.suggestedFollowUps.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        disabled={isLoading}
                        onClick={() => handleSend(prompt)}
                        className="text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-800 font-medium px-2.5 py-1 rounded-full border border-amber-200 transition-colors cursor-pointer"
                      >
                        ↳ {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-stone-400 text-xs font-mono p-3 bg-stone-50 rounded-2xl border border-stone-200 w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
              <span>AI CEO querying authoritative telemetry & synthesising briefing...</span>
            </div>
          )}
        </div>

        {/* INPUT BOX */}
        <div className="pt-3 border-t border-stone-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask AI CEO (e.g. 'আজকে পুরো অফিসের আপডেট দাও', 'আমাদের N5 কনভার্সন কেমন?')..."
              className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-hidden focus:border-amber-400 transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-5 py-3 bg-stone-950 hover:bg-stone-800 disabled:opacity-40 text-white font-bold rounded-2xl text-xs transition-colors flex items-center space-x-1.5 shrink-0 cursor-pointer shadow-sm"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <p className="text-[10px] text-stone-400 mt-2 text-center">
            Security boundary active: AI CEO answers with authentic telemetry. Cannot execute financial transfers or infrastructure changes.
          </p>
        </div>
      </div>
    </div>
  );
};
