import React, { useState } from 'react';
import {
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Send,
  Smartphone,
  Flame,
  ArrowRight
} from 'lucide-react';
import { speakJapanese } from '../lib/tts.js';
import { useAuth } from '../context/AuthContext';

interface WhatsAppSenseiViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const WhatsAppSenseiView: React.FC<WhatsAppSenseiViewProps> = ({ onNavigate }) => {
  const { profile, progress } = useAuth();
  const [messages, setMessages] = useState<Array<{ sender: 'sensei' | 'user'; text: string; audioText?: string; time: string; correction?: string }>>([
    {
      sender: 'sensei',
      text: 'タンビルさん、おはようございます！今日の2分間日本語チャレンジです 🇯🇵\n\n「今日、朝ごはんに何を食べましたか？」\n(What did you eat for breakfast today?)\n\nボイスメッセージで答えてみてください！',
      audioText: 'Tanvir-san, ohayou gozaimasu! Kyou no 2-funkan nihongo charenji desu. Kyou, asagohan ni nani o tabemashita ka?',
      time: '08:15 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: userText, time: nowTime }]);
    setIsEvaluating(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'sensei',
          text: '素晴らしい返信です！発音と語彙がとても自然でした。\n\n今日のデイリー学習ストリークが更新されました 🔥 (+30 XP)',
          audioText: 'Subarashii henshin desu! Hatsuon to goi ga totemo shizen deshita.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          correction: 'Grammar Note: 「パンを食べました」のように、目的語の後に「を」を使うのがバッチリです！'
        }
      ]);
      setIsEvaluating(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-10 px-4 sm:px-6 lg:px-8" id="whatsapp-sensei-view">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Nihomi WhatsApp AI Sensei™ &bull; Zero-Friction Daily Habit</span>
          </div>
          <h1 className="text-3xl font-extrabold font-serif text-stone-900">
            Daily 2-Minute Voice Practice on WhatsApp
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
            অ্যাপ ওপেন না করলেও প্রতিদিন সকালে নিহোমি সেনসেই আপনার হোয়াটসঅ্যাপে ২ মিনিটের একটি জাপানিজ অডিও প্রশ্ন পাঠাবে। আপনি ভয়েস রিপ্লাই দিলেই AI আপনার উচ্চারণ চেক করে স্ট্রিক আপডেট করে দেবে।
          </p>
        </div>

        {/* WhatsApp Phone Mockup Container */}
        <div className="max-w-md mx-auto bg-stone-900 rounded-[40px] p-3.5 shadow-2xl border-4 border-stone-800">
          <div className="bg-[#0b141a] rounded-[32px] overflow-hidden flex flex-col h-[520px]">
            {/* WhatsApp Top Bar */}
            <div className="bg-[#202c33] p-3.5 flex items-center justify-between text-white border-b border-stone-700/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                  日
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-100">Nihomi Sensei (AI)</h4>
                  <p className="text-[10px] text-emerald-400">Online &bull; Daily Tutor</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-stone-800/80 px-2 py-0.5 rounded-full">
                <Flame className="w-3 h-3 fill-current" />
                <span>{progress?.currentStreak || 1}d Streak</span>
              </div>
            </div>

            {/* WhatsApp Chat Area */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[radial-gradient(#202c33_1px,transparent_1px)] [background-size:16px_16px]">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 space-y-1.5 text-xs text-stone-100 shadow-sm ${
                      m.sender === 'user' ? 'bg-[#005c4b] rounded-tr-none' : 'bg-[#202c33] rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed font-sans">{m.text}</p>
                    {m.audioText && (
                      <button
                        onClick={() => speakJapanese(m.audioText!)}
                        className="text-[11px] text-emerald-300 hover:underline flex items-center gap-1 pt-0.5 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen to Voice Prompt</span>
                      </button>
                    )}
                    {m.correction && (
                      <div className="p-2 rounded-lg bg-stone-900/60 border border-emerald-500/30 text-[10px] text-emerald-300">
                        {m.correction}
                      </div>
                    )}
                    <span className="text-[9px] text-stone-400 block text-right">{m.time}</span>
                  </div>
                </div>
              ))}
              {isEvaluating && (
                <div className="flex justify-start">
                  <div className="p-2.5 rounded-2xl bg-[#202c33] text-xs text-stone-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                    <span>Sensei is analyzing your pronunciation...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendReply} className="p-2.5 bg-[#202c33] flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2 rounded-full ${
                  isRecording ? 'bg-red-600 text-white animate-pulse' : 'text-stone-400 hover:text-white'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Reply in Japanese (e.g. 卵とパンを食べました)..."
                className="flex-1 px-3 py-2 bg-[#2a3942] rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none"
              />
              <button type="submit" className="p-2 bg-[#00a884] text-white rounded-full hover:opacity-90">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
