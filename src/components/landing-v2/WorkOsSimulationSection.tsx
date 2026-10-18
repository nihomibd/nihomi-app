import React from 'react';
import { LandingPageContainer } from './LandingPageContainer';
import { Store, Train, FileText, ArrowRight, CheckCircle2, ShieldCheck, Play } from 'lucide-react';

interface WorkOsSimulationSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const WorkOsSimulationSection: React.FC<WorkOsSimulationSectionProps> = ({ onNavigate }) => {
  return (
    <section id="workos-simulation" className="py-20 md:py-28 bg-[#F6F0E6] text-[#141726] relative border-b border-[#141726]/10 overflow-hidden">
      {/* Background Japanese Watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[#141726]/[0.03] text-[180px] font-black pointer-events-none select-none font-serif">
        仕事
      </div>

      <LandingPageContainer>
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E45147]/10 border border-[#E45147]/25 text-[#E45147] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Store className="w-3.5 h-3.5" />
            বাস্তব জাপান কর্মক্ষেত্র সিমুলেটর • Nihomi WorkOS™
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#141726] mb-4 leading-tight tracking-tight">
            বইয়ের পাতার বাইরে — <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#141726] via-[#E45147] to-[#2F183A]">
              টোকিওর কর্মক্ষেত্রে সরাসরি ইন্টারঅ্যাকশন
            </span>
          </h2>
          <p className="text-[#57575E] text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            জাপানে পার্ট-টাইম কাজ (Baito) বা ফুল-টাইম ক্যারিয়ারের জন্য প্রয়োজনীয় আত্মবিশ্বাস গড়ে তুলুন দেশ থেকেই।
          </p>
        </div>

        {/* 3 Interactive Simulator Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* Card 1: Konbini POS Cashier Simulator */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-[#E45147] flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xl relative group">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E45147]/15 text-[#E45147] border border-[#E45147]/30">
              LIVE PILOT
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E45147]/10 border border-[#E45147]/30 flex items-center justify-center text-[#E45147] mb-6">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#141726] mb-2">
                টোকিও কনবিনি ক্যাশিয়ার
              </h3>
              <p className="text-sm text-[#57575E] mb-6 leading-relaxed">
                গ্রাহকের সাথে অভিবাদন, পয়েন্ট কার্ড জিজ্ঞাসা, গরম খাবার অফার ও টাকা লেনদেনের সম্পূর্ণ প্র্যাকটিক্যাল স্ক্রিপ্ট।
              </p>
              <div className="p-3.5 rounded-xl bg-[#F6F0E6]/80 border border-[#141726]/10 mb-6">
                <div className="text-xs text-[#E45147] font-mono font-bold mb-1">
                  「いらっしゃいませ！温めますか？」
                </div>
                <div className="text-[11px] text-[#57575E]">
                  স্বাগত! খাবার কি গরম করে দেব?
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('baito')}
              className="w-full py-3 px-4 rounded-xl bg-[#E45147] hover:bg-[#D43E34] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
            >
              <span>ক্যাশিয়ার সিমুলেটর খুলুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Narita Airport & Suica Transit */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#141726]/15 hover:border-sky-500/50 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-md relative">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/15 text-sky-700 border border-sky-500/30">
              ROADMAP MODULE
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-600 mb-6">
                <Train className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#141726] mb-2">
                নারিতা এয়ারপোর্ট ও ট্রেন ট্রানজিট
              </h3>
              <p className="text-sm text-[#57575E] mb-6 leading-relaxed">
                পাসপোর্ট কন্ট্রোল কাউন্টারে অফিসারদের প্রশ্নের উত্তর দেওয়া এবং সুইকা/পাসমো কার্ড রিচার্জ করার বাস্তব অভিজ্ঞতা।
              </p>
              <div className="p-3.5 rounded-xl bg-[#F6F0E6]/80 border border-[#141726]/10 mb-6">
                <div className="text-xs text-sky-700 font-mono font-bold mb-1">
                  「滞在期間はどのくらいですか？」
                </div>
                <div className="text-[11px] text-[#57575E]">
                  জাপানে কতদিন অবস্থানের পরিকল্পনা?
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('baito')}
              className="w-full py-3 px-4 rounded-xl bg-[#141726] hover:bg-[#1B1E30] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-[#141726]/10 cursor-pointer shadow-sm"
            >
              <span>ট্রানজিট মিশন এক্সপ্লোর করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: JIS Resume Studio */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#141726]/15 hover:border-emerald-500/50 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-md relative">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
              ROADMAP MODULE
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#141726] mb-2">
                জেআইএস রিজিউমে স্টুডিও
              </h3>
              <p className="text-sm text-[#57575E] mb-6 leading-relaxed">
                জাপানের অফিশিয়াল JIS Rirekisho ফরম্যাটে জীবনবৃত্তান্ত তৈরি ও কেসিগো (বিনয়ী জাপানি) ইন্টারভিউ প্রস্তুতি।
              </p>
              <div className="p-3.5 rounded-xl bg-[#F6F0E6]/80 border border-[#141726]/10 mb-6">
                <div className="text-xs text-emerald-700 font-mono font-bold mb-1">
                  「履歴書（JIS規格）と職務経歴書」
                </div>
                <div className="text-[11px] text-[#57575E]">
                  স্ট্যান্ডার্ড জাপানি জব ডকুমেন্ট বিল্ডার
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('baito')}
              className="w-full py-3 px-4 rounded-xl bg-[#141726] hover:bg-[#1B1E30] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-[#141726]/10 cursor-pointer shadow-sm"
            >
              <span>রিজিউমে স্টুডিও দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Trust Banner */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#141726]/15 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#6D7C55] shrink-0" />
            <p className="text-xs sm:text-sm text-[#57575E] font-medium">
              নিহোমি কোনো ভিসা গ্যারান্টি দেয় না; নিহোমি আপনাকে জাপানের বাস্তব কর্মক্ষেত্রের জন্য ভাষাগতভাবে যোগ্য করে তোলে।
            </p>
          </div>
          <button
            onClick={() => onNavigate('baito')}
            className="text-xs font-bold text-[#E45147] hover:underline shrink-0 cursor-pointer"
          >
            WorkOS™ বিস্তারিত পড়ুন →
          </button>
        </div>
      </LandingPageContainer>
    </section>
  );
};
