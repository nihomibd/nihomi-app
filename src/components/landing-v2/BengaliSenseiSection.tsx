import React, { useState } from 'react';
import { LandingPageContainer } from './LandingPageContainer';
import { Sparkles, Mic, Volume2, Shield, HeartHandshake, RefreshCw, MessageSquare, ArrowRight } from 'lucide-react';

interface BengaliSenseiSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

interface NomiStateItem {
  id: string;
  name: string;
  en: string;
  desc: string;
  avatar: string;
  sampleBn: string;
  sampleEn: string;
}

export const BengaliSenseiSection: React.FC<BengaliSenseiSectionProps> = ({ onNavigate }) => {
  const nomiStates: NomiStateItem[] = [
    {
      id: 'welcome',
      name: 'স্বাগতম ও সূচনা',
      en: 'WELCOME',
      desc: 'শান্ত হাসিমুখে প্রতিদিনের শুরু',
      avatar: '/brand/nomi/nomi-welcome.png',
      sampleBn: '「おはよう！今日も一緒にがんばろう！」 (শুভ সকাল! আজকেও একসাথে এগিয়ে যাই!)',
      sampleEn: 'Ready for today’s journey'
    },
    {
      id: 'guide',
      name: 'সহানুভূতিশীল ভুল সংশোধন',
      en: 'GUIDING',
      desc: 'লজ্জাহীন সহজ বাংলা সমাধান',
      avatar: '/brand/nomi/nomi-guide.png',
      sampleBn: 'কোনো চিন্তা নেই! 「あ」 আর 「お」 দেখতে কাছাকাছি হলেও ৩য় স্ট্রোকে বাঁক আলাদা। আসুন আরেকবার শান্তভাবে দেখে নিই 🌸',
      sampleEn: 'Patient, shame-free mistake diagnostic'
    },
    {
      id: 'encourage',
      name: 'উৎসাহ ও প্রেরণা',
      en: 'ENCOURAGING',
      desc: 'ধারাবাহিক চেষ্টায় সমর্থন',
      avatar: '/brand/nomi/nomi-encourage.png',
      sampleBn: 'দুর্দান্ত অগ্রগতি! আপনি হিরাগানা স্বরবর্ণের প্রথম দুটি ধাপ নিখুঁতভাবে শেষ করেছেন। এভাবে চালিয়ে যান!',
      sampleEn: 'Positive reinforcement on genuine effort'
    },
    {
      id: 'listen',
      name: 'সচেতন শ্রবণ ড্রিল',
      en: 'LISTENING',
      desc: 'অনুমতি নিয়ে মাইকে উচ্চারণ ড্রিল',
      avatar: '/brand/nomi/nomi-listen.png',
      sampleBn: 'আপনার উচ্চারণ শুনছি... স্পষ্ট ও নিখুঁত স্বর। জাপানিজ টোনে কথা বলার আত্মবিশ্বাস তৈরি হচ্ছে।',
      sampleEn: 'Opt-in speech analysis, zero background tracking'
    },
    {
      id: 'celebrate',
      name: 'মাইলস্টোন উৎসব',
      en: 'CELEBRATING',
      desc: 'প্রমাণিত মাস্টারিতে উদযাপন',
      avatar: '/brand/nomi/nomi-celebrate.png',
      sampleBn: 'অভিনন্দন! ৫টি মৌলিক স্বরবর্ণ (あ, い, う, え, お) আপনি সফলভাবে জয় করেছেন। ১ম মাইলস্টোন সম্পন্ন!',
      sampleEn: 'Evidence-gated achievement milestone'
    }
  ];

  const [activeState, setActiveState] = useState<NomiStateItem>(nomiStates[1]); // Default to Guiding (Mistake recovery)

  return (
    <section id="bengali-sensei" className="py-20 md:py-28 bg-[#141726] text-[#F6F0E6] relative border-b border-[#F6F0E6]/10">
      <LandingPageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Nomi Philosophy & Value */}
          <div className="lg:col-span-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E45147]/15 border border-[#E45147]/30 text-[#E45147] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E45147]" />
              Nomi Sensei • বাংলায় তোমার জাপানি শেখার সঙ্গী
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              ভুল হলে কোনো লজ্জা নয় — <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-[#E45147]">
                স্নেহমাখা বাংলায় সহজ সমাধান
              </span>
            </h2>

            <p className="text-stone-300 text-base sm:text-lg mb-6 leading-relaxed font-normal">
              নতুন ভাষা শেখার সবচেয়ে বড় বাধা হলো ভুল করার দ্বিধা। Nomi Sensei কখনোই বিদ্রুপ করে না, মনগড়া অনুমান করে না। আপনার উত্তরের ওপর ভিত্তি করে শান্ত বাংলায় ভুলের কারণ বুঝিয়ে দেয় এবং সাথে সাথে ১-ক্লিকে আবার চেষ্টা করার সুযোগ করে দেয়।
            </p>

            {/* Privacy & Safe Tech Guarantee */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#1B1E30] border border-[#F6F0E6]/10 mb-8 flex items-start gap-3.5 shadow-sm">
              <Shield className="w-5 h-5 text-[#6D7C55] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">
                  কঠোর অডিও প্রাইভেসি ও নীতিগত প্রতিশ্রুতি
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed font-normal">
                  মাইক্রোফোন শুধুমাত্র আপনার ইচ্ছায় সক্রিয় হয়। কোনো গোপন ব্যাকগ্রাউন্ড রেকর্ডিং নেই। কথা শেষ হওয়ামাত্র মাইক স্বয়ংক্রিয়ভাবে নিষ্ক্রিয় হয়ে যায়।
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('lesson', { id: 'n5-l1' })}
                className="btn-haptic inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#E45147] hover:bg-[#c93b32] text-white font-black text-sm shadow-xl shadow-red-600/25 transition cursor-pointer"
              >
                <span>Nomi Sensei-এর সাথে প্রথম পাঠ শুরু করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('kana')}
                className="btn-haptic inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 transition cursor-pointer"
              >
                <span>কানা স্টুডিও দেখুন</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Interactive Nomi Companion Card */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1B1E30] border border-[#F6F0E6]/15 shadow-2xl relative overflow-hidden text-left">
              
              {/* Header with Canonical Nomi Avatar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={activeState.avatar}
                      alt="Nomi Sensei"
                      className="w-12 h-12 rounded-full border-2 border-[#E45147] object-cover bg-[#F6F0E6] shadow-sm transition-all"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#6D7C55] border-2 border-[#1B1E30]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-1.5">
                      <span>Nomi Sensei</span>
                      <span className="text-xs text-[#E45147] font-semibold">(নমি সেন্সেই)</span>
                    </h3>
                    <p className="text-xs text-amber-300 font-mono font-medium">
                      অবস্থা: {activeState.name} ({activeState.en})
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#6D7C55]/20 text-[#6D7C55] border border-[#6D7C55]/30">
                  CANONICAL MENTOR
                </span>
              </div>

              {/* Dynamic Dialogue Box */}
              <div className="p-5 rounded-2xl bg-[#141726] border border-white/10 mb-6 shadow-inner relative">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
                  <HeartHandshake className="w-4 h-4 text-[#E45147]" />
                  <span>Nomi Sensei-এর দিকনির্দেশনা:</span>
                </div>
                
                <p className="text-sm text-stone-100 leading-relaxed font-medium">
                  "{activeState.sampleBn}"
                </p>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-400 font-mono">
                    {activeState.sampleEn}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('lesson', { id: 'n5-l1' })}
                    className="inline-flex items-center gap-1.5 text-xs text-[#E45147] hover:underline font-bold cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>১-ক্লিকে রিট্রাই করুন</span>
                  </button>
                </div>
              </div>

              {/* Interactive State Selector Pills */}
              <div>
                <div className="text-xs font-bold text-stone-400 mb-2.5 flex items-center justify-between">
                  <span>Nomi Sensei-এর প্রতিক্রিয়া পরখ করে দেখুন:</span>
                  <span className="text-[10px] font-mono text-stone-500">CLICK TO TEST STATE</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {nomiStates.map((s) => {
                    const isSelected = activeState.id === s.id;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setActiveState(s)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#E45147]/20 border-[#E45147] text-white shadow-xs'
                            : 'bg-white/5 border-white/10 hover:border-white/20 text-stone-300'
                        }`}
                      >
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#E45147]' : 'bg-stone-500'}`} />
                          <span className="truncate">{s.name.split(' ')[0]}</span>
                        </div>
                        <div className="text-[10px] font-mono text-stone-400 mt-0.5 truncate">
                          {s.en}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </LandingPageContainer>
    </section>
  );
};

export default BengaliSenseiSection;
