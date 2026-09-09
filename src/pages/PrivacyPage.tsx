import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, Database, UserCheck, EyeOff, Server, Mail } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate?: (view: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  const handleBack = () => {
    if (onNavigate) {
      onNavigate('landing');
    } else {
      window.history.back();
    }
  };

  return (
    <div id="privacy-policy-page" className="min-h-screen bg-[#0a0a12] text-slate-100 font-sans selection:bg-red-500/30 selection:text-red-200">
      {/* Top sticky navigation bar */}
      <header className="sticky top-0 z-40 bg-[#0e0e1a]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>হোমে ফিরে যান (Back)</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-xs text-slate-400 font-mono">Data Protection Policy</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-10">
        {/* Header Hero */}
        <div className="space-y-4 border-b border-slate-800/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Student Privacy Commitment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            গোপনীয়তা নীতি (Privacy Policy)
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            NIHOMI.COM আপনার ব্যক্তিগত তথ্যের নিরাপত্তা ও গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দেয়। আপনার তথ্য কীভাবে সুরক্ষিত ও পরিচালিত হয় তা বিস্তারিত নিচে উপস্থাপন করা হলো।
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2">
            <span>সর্বশেষ আপডেট: জানুয়ারি ২০২৬</span>
            <span>মানদণ্ড: আন্তর্জাতিক ডেটা সুরক্ষা ও বাংলাদেশ সাইবার নিরাপত্তা মান</span>
          </div>
        </div>

        {/* Section 1: Data Collection */}
        <section className="bg-[#121222] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
              ১
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              আমরা কী ধরনের তথ্য সংগ্রহ করি (Information We Collect)
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            একটি নির্বিঘ্ন শিক্ষা অভিজ্ঞতা নিশ্চিত করতে আমরা শুধুমাত্র প্রয়োজনীয় তথ্য সংগ্রহ করি:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-400" />
                শিক্ষার্থী প্রোফাইল তথ্য
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                নাম, ইমেইল অ্যাড্রেস, টার্গেট JLPT লেভেল (N5–N1), স্টুডেন্ট আইডি ও প্রোফাইল ছবি (যদি গুগল অ্যাকাউন্টের মাধ্যমে সাইন-ইন করেন)।
              </p>
            </div>
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                লার্নিং ডিএনএ ও অগ্রগতি
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                লেসন সমাপ্তির রেকর্ড, স্পেসড রিপিটিশন (SRS) মেমোরি ফ্ল্যাশকার্ড হিস্ট্রি, কুইজের ফলাফল এবং স্পিকিং ও কনবিনি সিমুলেশন স্কোর।
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Zero Financial Credential Storage */}
        <section className="bg-[#121222] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
              ২
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              পেমেন্ট তথ্যের সর্বোচ্চ নিরাপত্তা (Payment & Financial Security)
            </h2>
          </div>
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 text-emerald-300 text-xs sm:text-sm leading-relaxed">
            <Lock className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
            <p>
              <strong>জিরো ফিন্যান্সিয়াল ক্রেডেনশিয়াল স্টোরেজ:</strong> NIHOMI আপনার bKash/Nagad PIN, OTP অথবা ব্যাংকিং ক্রেডিট/ডেবিট কার্ডের কোনো সংবেদনশীল তথ্য সংরক্ষণ করে না। সমস্ত লেনদেন সরাসরি PCI-DSS সার্টিফাইড ব্যাংক পেমেন্ট গেটওয়ে দ্বারা এনক্রিপ্ট হয়ে প্রসেস হয়।
            </p>
          </div>
        </section>

        {/* Section 3: Supabase Cloud & JWT Encryption */}
        <section className="bg-[#121222] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
              ৩
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              ডাটাবেজ ও ক্লাউড নিরাপত্তা (Supabase Cloud Architecture)
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            আমাদের ডেটা লেয়ার পরিচালিত হয় এন্টারপ্রাইজ-গ্রেড Supabase PostgreSQL ক্লাউডে। প্রতিটি স্টুডেন্ট অ্যাকাউন্টের অ্যাক্সেস ক্রিপ্টোগ্রাফিক HMAC-SHA256 অ্যালগরিদম দ্বারা সুরক্ষিত।
          </p>
          <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside pl-2">
            <li><strong>Row Level Security (RLS):</strong> কেবল অনুমোদিত শিক্ষার্থীই তার নিজস্ব লার্নিং ডাটা দেখতে পারেন।</li>
            <li><strong>ইন-মেমোরি ড্রপ প্রতিরোধ:</strong> সার্ভার রিস্টার্ট হলেও কোনো অগ্রগতি মুছে যায় না।</li>
          </ul>
        </section>

        {/* Section 4: Zero Resale Guarantee */}
        <section className="bg-[#121222] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
              ৪
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              তথ্য বিক্রয় না করার নিশ্চয়তা (Zero Resale Guarantee)
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            NIHOMI কোনো অবস্থাতেই কোনো তৃতীয় পক্ষের বিজ্ঞাপনদাতা বা ডেটা ব্রোকারের কাছে শিক্ষার্থীদের ব্যক্তিগত নাম, ইমেইল বা ফোন নম্বর বিক্রয়, ভাড়া বা হস্তান্তর করে না। আমরা কেবল পাঠ্যক্রমের গুণগত মান ও ব্যক্তিগত পারফরম্যান্স বৃদ্ধিতে এই তথ্য ব্যবহার করি।
          </p>
        </section>

        {/* Section 5: Student Rights */}
        <section className="bg-[#121222] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
              ৫
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              আপনার অধিকার ও তথ্য মুছে ফেলার অনুরোধ (Your Rights & Data Deletion)
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            যে কোনো শিক্ষার্থী তার অ্যাকাউন্ট তথ্য সংশোধন, হালনাগাদ অথবা সম্পূর্ণ ডেটা ডিলিট করার অনুরোধ জানাতে পারেন।
          </p>
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">ডেটা প্রটেকশন অফিসার (DPO) ইমেইল:</p>
                <p className="text-sm font-mono text-white font-semibold">mdtanvirkabirbiplob@gmail.com</p>
              </div>
            </div>
            <a
              href="mailto:mdtanvirkabirbiplob@gmail.com"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              ইমেইল পাঠান
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPage;
