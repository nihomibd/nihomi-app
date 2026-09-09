import React from 'react';
import { ArrowLeft, RotateCcw, CheckCircle2, AlertCircle, Clock, ShieldCheck, HelpCircle, PhoneCall, Mail } from 'lucide-react';
import { NIHOMI_CONTACT } from '../config/contact';

interface RefundPolicyPageProps {
  onNavigate?: (view: string) => void;
}

export const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onNavigate }) => {
  const handleBack = () => {
    if (onNavigate) {
      onNavigate('landing');
    } else {
      window.history.back();
    }
  };

  return (
    <div id="refund-policy-page" className="min-h-screen bg-[#0a0a12] text-slate-100 font-sans selection:bg-red-500/30 selection:text-red-200">
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
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs text-slate-400 font-mono">Satisfaction Guarantee</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-10">
        {/* Header Hero */}
        <div className="space-y-4 border-b border-slate-800/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Customer Protection & Fair Billing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            রিফান্ড ও বাতিলকরণ নীতি (Refund & Cancellation Policy)
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            NIHOMI-তে আমরা বিশ্বাস করি সর্বোচ্চ শিক্ষণীয় মানে। আপনি যদি আমাদের ডিজিটাল সাবস্ক্রিপশনে সন্তুষ্ট না হন, তবে আমাদের ৭ দিনের ফেয়ার রিফান্ড নীতি প্রযোজ্য হবে।
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2">
            <span>বাংলাদেশ মার্চেন্ট পলিসি মানদণ্ড (bKash & SSLCommerz অনুবর্তী)</span>
            <span>প্রসেসিং সময়: ৩–৭ কার্যদিবস</span>
          </div>
        </div>

        {/* Section 1: 7-Day Guarantee */}
        <section className="bg-[#121222] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
              ১
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              ৭ দিনের মানি-ব্যাক গ্যারান্টি (7-Day Money-Back Guarantee)
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            প্রথমবার পেইড সাবস্ক্রিপশন গ্রহণের ৭ (সাত) দিনের মধ্যে যদি কোনো শিক্ষার্থী সেবা ব্যবহারে সন্তুষ্ট না হন, তবে তিনি কোনো ধরনের জটিলতা ছাড়াই রিফান্ডের আবেদন করতে পারেন।
          </p>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
            <h3 className="text-sm font-semibold text-amber-300">রিফান্ডের যোগ্যতার শর্তাবলী (Eligibility Conditions):</h3>
            <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 list-disc list-inside">
              <li>সাবস্ক্রিপশন ক্রয়ের তারিখ থেকে ৭ ক্যালেন্ডার দিনের মধ্যে আবেদন পাঠাতে হবে।</li>
              <li>ফেয়ার ইউসেজ পলিসি: আবেদনকারী সর্বোচ্চ ৩টি প্রিমিয়াম লেসনের বেশি সম্পন্ন করেননি এবং ১টির বেশি মক এক্সাম দেননি।</li>
              <li>কোনো ভাউচার কোড বা প্রোমোশনাল ডিসকাউন্টে কেনা ওয়ান-টাইম স্টোর কয়েন প্যাকের ক্ষেত্রে অব্যবহৃত কয়েন অনুপাতে রিফান্ড প্রদেয় হবে।</li>
            </ul>
          </div>
        </section>

        {/* Section 2: How to Request a Refund */}
        <section className="bg-[#121222] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
              ২
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              কীভাবে রিফান্ডের আবেদন করবেন (How to Claim Your Refund)
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            রিফান্ড পাওয়ার প্রক্রিয়া অত্যন্ত সহজ ও দ্রুত। নিচের যেকোনো একটি মাধ্যমে আমাদের সাথে যোগাযোগ করুন:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Mail className="w-4 h-4 text-amber-400" />
                অফিসিয়াল ইমেইল সাপোর্ট
              </div>
              <p className="text-xs text-slate-400">
                আপনার স্টুডেন্ট আইডি ও bKash/কার্ড ট্রানজেকশন আইডি লিখে ইমেইল করুন:
              </p>
              <a href={`mailto:${NIHOMI_CONTACT.email}`} className="text-xs font-mono text-amber-400 hover:underline block pt-1">
                {NIHOMI_CONTACT.email}
              </a>
            </div>
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                অফিসিয়াল হোয়াটসঅ্যাপ হেল্পলাইন
              </div>
              <p className="text-xs text-slate-400">
                দ্রুত সমাধানের জন্য আমাদের সাপোর্ট নম্বরে মেসেজ দিন (সকাল ১০টা - সন্ধ্যা ৭টা):
              </p>
              <a href={NIHOMI_CONTACT.getWhatsAppSupportUrl('Hello Nihomi, I have a query regarding refund policy.')} target="_blank" rel="noreferrer" className="text-xs font-mono text-emerald-400 hover:underline block pt-1">
                {NIHOMI_CONTACT.phoneFormatted} (WhatsApp Helpline)
              </a>
            </div>
          </div>
        </section>

        {/* Section 3: Processing Time */}
        <section className="bg-[#121222] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
              ৩
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              রিফান্ড প্রসেসিং ও পরিশোধের সময় (Refund Processing Time)
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            রিফান্ড রিকোয়েস্ট যাচাই-বাছাইয়ের পর ২৪-৪৮ ঘণ্টার মধ্যে আমাদের সিস্টেম থেকে রিফান্ড রিলিজ করা হয়। ব্যাংক বা মোবাইল ফাইন্যান্সিয়াল সার্ভিস প্রোভাইডার (bKash/Nagad/Cards) এর নিয়মানুযায়ী ৩ থেকে ৭ কার্যদিবসের মধ্যে টাকা সরাসরি যে অ্যাকাউন্ট বা কার্ড থেকে পেমেন্ট করা হয়েছিল সেখানেই ফেরত আসবে।
          </p>
        </section>

        {/* Section 4: Subscription Cancellation */}
        <section className="bg-[#121222] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
              ৪
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              সাবস্ক্রিপশন বাতিলকরণ (Subscription Cancellation)
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            আপনি আপনার স্টুডেন্ট ড্যাশবোর্ড থেকে যে কোনো মুহূর্তে সাবস্ক্রিপশনের অটো-রিনিউয়াল অফ করতে পারবেন। অটো-রিনিউয়াল অফ করলেও আপনার চলতি মেয়াদের শেষ দিন পর্যন্ত প্ল্যাটফর্মের সমস্ত সুবিধা সচল থাকবে।
          </p>
        </section>
      </main>
    </div>
  );
};

export default RefundPolicyPage;
