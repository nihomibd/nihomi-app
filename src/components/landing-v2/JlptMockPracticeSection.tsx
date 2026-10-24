import React from 'react';
import { LandingPageContainer } from './LandingPageContainer';
import { Award, Clock, BarChart3, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';

interface JlptMockPracticeSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const JlptMockPracticeSection: React.FC<JlptMockPracticeSectionProps> = ({ onNavigate }) => {
  const levels = [
    { level: 'N5', title: 'মৌলিক ভিত্তি', desc: 'মিন্নানো নিহঙ্গো ১-২৫ লেসন, হিরাগানা, কাতাকানা ও মৌলিক ১০০ কাঞ্জি', status: 'লাইভ পাইলট', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { level: 'N4', title: 'প্রাথমিক কথোপকথন', desc: 'দৈনন্দিন জাপানি, ব্যাকরণ প্যাটার্ন ও ৩০০ কাঞ্জি প্রস্তুতি', status: 'ফাউন্ডেশন', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { level: 'N3', title: 'মধ্যবর্তী সেতু', desc: 'জাপানে কাজের উপযোগী মধ্যবর্তী জাপানি ও বিজনেস কেইগো ভিত্তি', status: 'ফাউন্ডেশন', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { level: 'N2', title: 'পেশাদার দক্ষতা', desc: 'জাপানি কোম্পানিতে সরাসরি কাজের ভাষা ও জটিল রিডিং কমপ্রিহেনশন', status: 'রোডম্যাপ', badgeColor: 'bg-[#E45147]/20 text-[#E45147] border-[#E45147]/30' },
    { level: 'N1', title: 'উচ্চতর পাণ্ডিত্য', desc: 'নেটিভ সমমানের প্রাতিষ্ঠানিক ও বিশ্লেষণমূলক জাপানি ভাষা দক্ষতা', status: 'রোডম্যাপ', badgeColor: 'bg-stone-500/20 text-stone-300 border-stone-500/30' }
  ];

  return (
    <section id="jlpt-mock" className="py-20 md:py-28 bg-[#141726] text-[#F6F0E6] relative border-b border-white/10">
      <LandingPageContainer>
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" />
            JLPT N5–N1 প্রশ্নব্যাংক ও মক টেস্ট ইঞ্জিন
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            বাস্তব পরীক্ষার অভিজ্ঞতা — <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
              টাইমার ও তাৎক্ষণিক ফলাফলসহ
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            অফিশিয়াল ৫টি মক টেস্ট প্যাকেজ এবং ৬৫ পৃষ্ঠার মাস্টার কালেকশনের ভিত্তিতে প্রতিটি প্রশ্ন ডিজিটালাইজড।
          </p>
        </div>

        {/* 5 Levels Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {levels.map((lvl, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#1B1E30] border border-[#2A2E45] hover:border-amber-400/50 transition-all hover:-translate-y-1 flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {lvl.level}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${lvl.badgeColor}`}>
                    {lvl.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">
                  {lvl.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {lvl.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">মক পরীক্ষা</span>
                <button
                  type="button"
                  onClick={() => onNavigate('mock-exams', { level: lvl.level })}
                  className="text-xs text-amber-400 font-semibold hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  যাচাই করুন →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          <div className="p-4 rounded-xl bg-[#1B1E30] border border-[#2A2E45] flex items-start gap-3 shadow-sm">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-sm font-bold text-white">রিয়েল-টাইম টাইমার</h5>
              <p className="text-xs text-slate-300 mt-0.5">অফিশিয়াল পরীক্ষার সময়সীমা মেনে প্রস্তুতি নেওয়ার স্বয়ংক্রিয় ব্যবস্থা।</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#1B1E30] border border-[#2A2E45] flex items-start gap-3 shadow-sm">
            <BarChart3 className="w-5 h-5 text-[#6D7C55] shrink-0 mt-0.5" />
            <div>
              <h5 className="text-sm font-bold text-white">সেকশনভিত্তিক স্কোরিং</h5>
              <p className="text-xs text-slate-300 mt-0.5">শব্দভাণ্ডার, ব্যাকরণ, রিডিং ও লিসেনিংয়ের নিখুঁত পারসেন্টাইল।</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#1B1E30] border border-[#2A2E45] flex items-start gap-3 shadow-sm">
            <RotateCcw className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-sm font-bold text-white">উইক-স্পট রিটেনশন</h5>
              <p className="text-xs text-slate-300 mt-0.5">যে প্রশ্নে ভুল হয়েছে, নমি সেন্সেই স্বয়ংক্রিয়ভাবে পরে রিভিশনে নিয়ে আসে।</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            id="landing-jlpt-exam-cta"
            data-testid="landing-jlpt-exam-cta"
            onClick={() => onNavigate('mock-exams')}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-sm inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-amber-500/20 cursor-pointer"
          >
            <span>JLPT মক টেস্ট প্র্যাকটিস শুরু করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </LandingPageContainer>
    </section>
  );
};

export default JlptMockPracticeSection;