import React from 'react';
import { ArrowLeft, Shield, FileText, Scale, CheckCircle2, AlertTriangle, BookOpen, Clock, Building } from 'lucide-react';

interface TermsPageProps {
  onNavigate?: (view: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  const handleBack = () => {
    if (onNavigate) {
      onNavigate('landing');
    } else {
      window.history.back();
    }
  };

  return (
    <div id="terms-of-service-page" className="min-h-screen bg-[#0a0a12] text-slate-100 font-sans selection:bg-red-500/30 selection:text-red-200">
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
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-slate-400 font-mono">Official Legal Policy</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-10">
        {/* Header Hero */}
        <div className="space-y-4 border-b border-slate-800/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Compliance & Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ব্যবহারের শর্তাবলী (Terms of Service)
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            NIHOMI.COM (নিহোমি) ব্যবহার করার পূর্বে অনুগ্রহ করে এই শর্তাবলী সাবধানে পড়ুন। আমাদের সেবা গ্রহণ করার মাধ্যমে আপনি এই চুক্তি ও নীতিমালায় সম্মত হচ্ছেন।
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> কার্যকর তারিখ: ১ জানুয়ারি ২০২৬</span>
            <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-slate-400" /> পরিচালনায়: NIHOMI.COM ও bdTrip24 Ecosystem</span>
          </div>
        </div>

        {/* Section 1: Acceptance */}
        <section className="bg-[#121222] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">
              ১
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              চুক্তির স্বীকৃতি (Acceptance of Terms)
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            NIHOMI.COM একটি বাণিজ্যিক জাপানিজ ভাষা শিক্ষা এবং জাপান ক্যারিয়ার রেডিনেস প্ল্যাটফর্ম। আপনি শিক্ষার্থী, অভিভাবক বা দর্শনার্থী হিসেবে ওয়েবসাইট, মোবাইল ওয়েব বা সংশ্লিষ্ট কোনো ফিচার ব্যবহার করলে এই নিয়মনীতি দ্বারা আবদ্ধ হবেন। আপনি এই শর্তাবলীর সাথে একমত না হলে ওয়েবসাইটটির ব্যবহার বন্ধ করার অনুরোধ করা হচ্ছে।
          </p>
        </section>

        {/* Section 2: Student Identity */}
        <section className="bg-[#121222] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">
              ২
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              স্টুডেন্ট অ্যাকাউন্ট ও নীতি (One Student → One Account Policy)
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            আমাদের মূল দর্শন: <strong>One Student → One Nihomi Account → One Continuous Learning Journey</strong>।
          </p>
          <ul className="space-y-2.5 text-sm text-slate-300 list-disc list-inside pl-2">
            <li>প্রতিটি শিক্ষার্থীর জন্য একটি মাত্র স্বতন্ত্র অ্যাকাউন্ট নির্ধারিত থাকবে।</li>
            <li>একাধিক ব্যক্তির মাঝে অ্যাকাউন্ট বা সাবস্ক্রিপশন শেয়ারিং বা বিক্রয় সম্পূর্ণ নিষিদ্ধ।</li>
            <li>শিক্ষার্থী তার পাসওয়ার্ড, লগইন ওটিপি বা সেশনের গোপনীয়তা বজায় রাখার জন্য সম্পূর্ণ দায়ী থাকবেন।</li>
            <li>কোনো সন্দেহজনক বা অননুমোদিত ব্যবহারের প্রমাণ পাওয়া গেলে কর্তৃপক্ষ অ্যাকাউন্ট সাময়িক বা স্থায়ী স্থগিত করার অধিকার সংরক্ষণ করে।</li>
          </ul>
        </section>

        {/* Section 3: Intellectual Property */}
        <section className="bg-[#121222] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">
              ৩
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              মেধা সম্পদ অধিকার (Intellectual Property Rights)
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            NIHOMI.COM-এর সমস্ত শিক্ষণীয় কনটেন্ট, মিন্না নো নিহঙ্গো (Minna no Nihongo) পাঠ্যক্রমের বাংলা ব্যাখ্যা, ভোকাবুলারি অডিও ফাইল, কাঞ্জি স্ট্রোক অর্ডার অ্যানিমেশন, কৃত্রিম বুদ্ধিমত্তা চালিত সেনসি (AI Sensei) এবং টোকিও কনবিনি সিমুলেশন ইঞ্জিন NIHOMI এবং bdTrip24 Ecosystem-এর নিজস্ব বুদ্ধিবৃত্তিক সম্পদ।
          </p>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 text-amber-300 text-xs leading-relaxed">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
            <p>
              অনুমতি ব্যতীত কোনো অডিও, লেকচার নোট, সিমুলেটর বা পরীক্ষার প্রশ্নাবলি বাণিজ্যিক উদ্দেশ্যে কপি, ডিস্ট্রিবিউট, স্ক্র্যাপ বা সোশ্যাল মিডিয়ায় প্রকাশ করা বাংলাদেশ কপিরাইট আইন ২০০০ (সংশোধিত ২০২৩) এবং সাইবার সুরক্ষা আইনের অধীন দণ্ডনীয় অপরাধ।
            </p>
          </div>
        </section>

        {/* Section 4: Subscription & Billing */}
        <section className="bg-[#121222] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">
              ৪
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              পেমেন্ট, সাবস্ক্রিপশন ও নবায়ন (Billing & Payments)
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            NIHOMI প্ল্যাটফর্মে সমস্ত মূল্য বাংলাদেশি টাকা (BDT ৳)-তে প্রদর্শিত হয়। পেমেন্ট লেনদেন বাংলাদেশ ব্যাংক অনুমোদিত মার্চেন্ট চ্যানেল (যেমন: bKash Tokenized Checkout, SSLCommerz) এর মাধ্যমে সম্পূর্ণ এনক্রিপ্টেড পদ্ধতিতে সম্পন্ন হয়।
          </p>
          <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside pl-2">
            <li>সাবস্ক্রিপশন প্যাকের মেয়াদ শেষ হওয়ার পূর্বে শিক্ষার্থীকে পোর্টালে নবায়ন সংক্রান্ত নোটিফিকেশন দেয়া হয়।</li>
            <li>শিক্ষার্থী চাইলে যেকোনো সময় তার স্টুডেন্ট পোর্টাল থেকে পরবর্তী বিলিং চক্রের জন্য স্বয়ংক্রিয় রিনিউয়াল বন্ধ করতে পারবেন।</li>
          </ul>
        </section>

        {/* Section 5: Limitation of Liability */}
        <section className="bg-[#121222] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">
              ৫
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              দায়বদ্ধতার সীমাবদ্ধতা ও আইনি বিচারব্যবস্থা (Governing Law)
            </h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            এই শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশের প্রচলিত আইন (ICT Act 2006, Cyber Security Act) অনুসারে পরিচালিত ও ব্যাখ্যা করা হবে। প্ল্যাটফর্ম ব্যবহার সংক্রান্ত যেকোনো আইনি বিরোধ ঢাকা, বাংলাদেশের উপযুক্ত আদালতের একচ্ছত্র এখতিয়ারাধীন থাকবে।
          </p>
        </section>

        {/* Support Section */}
        <div className="p-6 bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-base">শর্তাবলী নিয়ে কোনো প্রশ্ন রয়েছে?</h3>
            <p className="text-xs text-slate-400 mt-0.5">আমাদের লিগ্যাল ও স্টুডেন্ট সাপোর্ট টিমের সাথে সরাসরি যোগাযোগ করুন।</p>
          </div>
          <button
            onClick={() => onNavigate ? onNavigate('contact') : window.location.href = '/contact'}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold tracking-wide transition-all shadow-lg active:scale-95 cursor-pointer whitespace-nowrap"
          >
            যোগাযোগ করুন (Contact Us)
          </button>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
