import React from 'react';
import {
  Target,
  Sparkles,
  BookOpen,
  Briefcase,
  Compass,
  Building2,
  Plane,
  ShieldCheck,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div id="nihomi-about-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Top Hero */}
        <div className="text-center space-y-4 bg-white border border-stone-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            <Compass className="w-4 h-4" />
            <span>Official Master Brand Story</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-stone-900 tracking-tight leading-tight">
            Learn Japanese. <br />
            <span className="text-red-600">Nihomi Coordinates the Journey.</span>
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            “The student starts learning Japanese. Nihomi coordinates the rest.” — নিহোমি কোনো সাধারণ লার্নিং অ্যাপ নয়। এটি জাপানি ভাষা শিক্ষা, বাস্তব জীবনের সিমুলেশন, এআই লার্নিং মেমোরি এবং জাপান যাত্রার সম্পূর্ণ অপারেটিং সিস্টেম।
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm hover:border-red-300 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center border border-red-200 font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 font-serif">Nihomi JapanTwin™ & MemoryOS™</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              জাপানে যাওয়ার আগেই আপনার জাপানি জীবনকে সিমুলেট করা এবং আপনার নিজস্ব ভুলের ওপর ভিত্তি করে ব্যক্তিগত প্রিন্ট-রেডি Mistake DNA বুকলেট (PDF) তৈরি করা।
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm hover:border-blue-300 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 font-serif">Bengali Cultural Anchor™</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              জাপানিজ ব্যাকরণ মুখস্থ না করিয়ে বাংলাদেশের পরিচিত সামাজিক রীতিনীতি ও পরিবারের বাস্তব উদাহরণ দিয়ে সিনেমার মতো অনুভূতির সাথে শেখানো।
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 font-serif">Dhaka Int'l Language School (DILS)</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              ধানমন্ডি ও বনানী ক্যাম্পাসে সরাসরি ফিজিক্যাল ক্লাস, টোকিও ইমিগ্রেশনে COE (Certificate of Eligibility) প্রসেসিং এবং VFS ভিসা ফাইল সাবমিশন।
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm hover:border-purple-300 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200 font-bold">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 font-serif">bdTrip24.com Travel Integration</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              ৪৬ কেজি লাগেজ সুবিধাসহ বিশেষ স্টুডেন্ট ফেয়ার বিমান টিকিট, অনলাইন টিকিট ভেরিফিকেশন এবং জাপানের নারিতা/হানেদা বিমানবন্দরে পিকআপ সার্ভিস।
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif">
            Ready to Experience Your Japanese Self?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto">
            Join thousands of learners on Nihomi. Start learning today with our AI Sensei, live classes, or Dhaka campus.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Launch My Nihomi Mission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
