import React, { useState } from 'react';
import { LandingPageContainer } from './LandingPageContainer';
import { HelpCircle, ChevronDown, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface FaqAndFinalCtaSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const FaqAndFinalCtaSection: React.FC<FaqAndFinalCtaSectionProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'আমি জাপানি ভাষার কিছুই জানি না, আমি কি শূন্য থেকে শুরু করতে পারব?',
      a: 'হ্যাঁ, নিহোমি বিশেষভাবে শূন্য থেকে শুরু করা শিক্ষার্থীদের জন্য ডিজাইন করা হয়েছে। আমাদের "Strict Cumulative Lattice" নীতি অনুযায়ী কোনো অপরিচিত শব্দ শিক্ষার্থীকে দেখানো হয় না যতক্ষণ না প্রতিটি স্বরবর্ণ ও ব্যঞ্জনবর্ণের পূর্বশর্ত শেখা হয়।'
    },
    {
      q: 'Nomi Sensei (নমি সেন্সেই) কি সত্যিই বাংলায় বুঝিয়ে দেয়?',
      a: 'অবশ্যই। Nomi Sensei (নমি সেন্সেই) হলো "বাংলায় তোমার জাপানি শেখার সঙ্গী"। কোনো প্রশ্নে বা উচ্চারণে ভুল হলে নমি সেন্সেই কোনো বিদ্রুপ বা লজ্জা না দিয়ে উষ্ণ, স্নেহময় বাংলায় বুঝিয়ে দেয় ভুলটি কেন হয়েছে এবং সাথে সাথে ১-ক্লিকে আবার চেষ্টা করার সুযোগ দেয়।'
    },
    {
      q: 'JLPT মক টেস্টগুলো কি আসল পরীক্ষার ফরম্যাট অনুযায়ী তৈরি?',
      a: 'হ্যাঁ। N5 থেকে N1 পর্যন্ত ৫টি কমপ্লিট প্যাকেজের শতভাগ অনুমোদিত প্রশ্নের ওপর ভিত্তি করে আমাদের মক টেস্ট ইঞ্জিন তৈরি। এতে রিয়েল-টাইম টাইমার, সেকশনভিত্তিক স্কোরিং ও উইক-স্পট রিভিশন ব্যবস্থা রয়েছে।'
    },
    {
      q: 'Nihomi WorkOS™ কনবিনি সিমুলেটর কীভাবে সাহায্য করে?',
      a: 'জাপানে পা রেখেই যেন শিক্ষার্থী পার্ট-টাইম কাজ (Baito) বা দোকানে স্বাচ্ছন্দ্যে কথা বলতে পারে, সেজন্য টোকিও কনভিনিয়েন্স স্টোরের পিওএস ক্যাশিয়ার, নারিতা এয়ারপোর্ট ইমিগ্রেশন ও ট্রেন রিচার্জের বাস্তব সিমুলেশন তৈরি করা হয়েছে।'
    },
    {
      q: 'পেমেন্ট পদ্ধতি কী এবং কোনো অতিরিক্ত বা লুকানো চার্জ আছে কি?',
      a: 'আমরা সরাসরি বিকাশ (bKash) ও লোকাল বাংলাদেশি পেমেন্ট সমর্থন করি। আমাদের ১২টি অনুমোদিত মূল্যের বাইরে কোনো লুকানো চার্জ, অটো-রিনিউ ফাঁদ বা অপ্রকাশিত ফি নেই।'
    },
    {
      q: 'নিহোমি কি ভিসা বা চাকরির নিশ্চয়তা (Guarantee) দেয়?',
      a: 'না। নিহোমি কোনো ভিসা কনসালটেন্সি বা ম্যানপাওয়ার এজেন্সি নয়। নিহোমি একটি প্রিমিয়াম লার্নিং প্ল্যাটফর্ম যা আপনাকে জাপানে পড়াশোনা, চাকরি ও বসবাসের জন্য ভাষাগত ও ব্যবহারিকভাবে শতভাগ প্রস্তুত করে তোলে।'
    }
  ];

  return (
    <section id="faq-section" className="py-20 md:py-28 bg-[#F6F0E6] text-[#141726] relative border-b border-[#141726]/10">
      <LandingPageContainer>
        {/* FAQ Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141726]/5 border border-[#141726]/10 text-[#57575E] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#E45147]" />
            সাধারণ প্রশ্নোত্তর • Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#141726] mb-4 tracking-tight">
            আপনার সকল প্রশ্নের স্বচ্ছ উত্তর
          </h2>
          <p className="text-[#57575E] text-base sm:text-lg font-medium">
            নিহোমির শিক্ষাপদ্ধতি, প্রযুক্তি ও মূল্যতালিকা সম্পর্কে সরাসরি জেনে নিন।
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-3.5 mb-20">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-[#141726]/10 shadow-sm overflow-hidden transition-all hover:border-[#E45147]/40"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base text-[#141726]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#57575E] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#E45147]' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#57575E] leading-relaxed font-normal border-t border-[#141726]/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FINAL CONVERSION CTA BANNER */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-[#141726] via-[#1a1c30] to-[#2F183A] border border-white/15 p-8 sm:p-12 md:p-16 text-center relative overflow-hidden shadow-2xl text-white">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#E45147]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-[#E45147]/20 text-[#E45147] border border-[#E45147]/30 mb-6">
              🌸 আজই আপনার জাপানযাত্রা শুরু হোক
            </span>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              শূন্য থেকে জাপান-রেডি — <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-400">
                একসাথে শুরু করি
              </span>
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
              কোনো ক্রেডিট কার্ডের প্রয়োজন নেই। এখনই ট্রাই করুন আমাদের প্রথম ফ্রি লেসন এবং লাইভ নমি সেন্সেই অভিজ্ঞতা।
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('lesson', { id: 'n5-l1' })}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#E45147] hover:bg-[#D43E34] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-[#E45147]/25 cursor-pointer"
              >
                <span>বিনামূল্যে ডেমো লেসন শুরু করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('pricing')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-sm border border-white/15 transition-all cursor-pointer"
              >
                সাবস্ক্রিপশন প্ল্যান দেখুন (৳৯৯০ থেকে)
              </button>
            </div>
          </div>
        </div>
      </LandingPageContainer>
    </section>
  );
};
