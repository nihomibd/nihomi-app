import React from 'react';
import { LandingPageContainer } from './LandingPageContainer';
import { Sparkles, BookOpen, Award, Briefcase, ArrowRight, Check } from 'lucide-react';

interface LearningPathwaysSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const LearningPathwaysSection: React.FC<LearningPathwaysSectionProps> = ({ onNavigate }) => {
  const pathways = [
    {
      badge: 'নতুন শিক্ষার্থীদের জন্য',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      title: 'Start from Zero',
      titleBn: 'শূন্য থেকে শুরু',
      desc: 'হিরাগানা, কাতাকানা ও মৌলিক জাপানি ভাষা দিয়ে আত্মবিশ্বাসী সূচনা। প্রতিটি অক্ষর পূর্বশর্ত সাপেক্ষে আনলক হয়।',
      features: [
        'জিরো-আনটট নীতি: পূর্বশর্ত ছাড়া কোনো অপরিচিত বর্ণ নয়',
        'ইন্টারঅ্যাক্টিভ স্ট্রোক ক্যানভাস ও সঠিকতা পরীক্ষা',
        'বাংলায় নমি সেন্সেইর স্নেহময় দিকনির্দেশনা'
      ],
      ctaText: 'শূন্য থেকে শুরু করুন',
      route: 'lesson',
      params: { id: 'n5-l1' },
      accent: 'border-emerald-500/30 hover:border-emerald-500/60'
    },
    {
      badge: 'পরীক্ষার্থীদের জন্য',
      badgeColor: 'bg-[#E45147]/20 text-[#E45147] border-[#E45147]/30',
      title: 'Prepare for JLPT',
      titleBn: 'JLPT পরীক্ষা প্রস্তুতি',
      desc: 'JLPT N5 প্র্যাকটিস মক টেস্ট, স্বয়ংক্রিয় টাইমার ও সেকশন-ভিত্তিক পারফর্ম্যান্স স্কোরিং।',
      features: [
        'JLPT-স্টাইল প্র্যাকটিস মক টেস্ট ও প্রশ্নব্যাংক',
        'ভুল ট্র্যাকিং ও মেমরিওএস স্পেসড রিপিটেশন',
        'মিন্নানো নিহঙ্গো কারিকুলাম সামঞ্জস্য'
      ],
      ctaText: 'মক টেস্ট দেখুন',
      route: 'mock-exams',
      accent: 'border-[#E45147]/30 hover:border-[#E45147]/60'
    },
    {
      badge: 'চাকরি ও অভিবাসন প্রত্যাশীদের জন্য',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      title: 'Practice Real Japan',
      titleBn: 'জাপানে কাজ ও দৈনন্দিন জীবন',
      desc: 'Nihomi WorkOS™-এ টোকিও কনবিনি ক্যাশিয়ার সিমুলেটর ও জেআইএস স্ট্যান্ডার্ড রিজিউমে বিল্ডার দিয়ে বাস্তব অভিজ্ঞতা।',
      features: [
        'কনবিনি পিওএস ক্যাশিয়ার ও গ্রাহক কথপোকথন',
        'নারিতা এয়ারপোর্ট ইমিগ্রেশন ও ট্রেন রিচার্জ মিশন',
        'জাপানি শিষ্টাচার ও কর্মক্ষেত্র কেসিগো প্রস্তুতি'
      ],
      ctaText: 'WorkOS™ সিমুলেটর টেস্ট করুন',
      route: 'baito',
      accent: 'border-amber-500/30 hover:border-amber-500/60'
    }
  ];

  return (
    <section id="learning-pathways" className="py-20 md:py-24 bg-[#141726] text-[#F6F0E6] relative border-b border-[#F6F0E6]/10">
      <LandingPageContainer>
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#E45147]" />
            আপনার লক্ষ্য অনুযায়ী ৩টি সুস্পষ্ট লার্নিং পথ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            যেখান থেকেই শুরু করুন — <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-amber-200">
              লক্ষ্য হোক জাপানে স্বচ্ছন্দ পদচারণা
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            আপনার বর্তমান জাপানি ভাষা জ্ঞান যাই হোক না কেন, নিহোমি আপনাকে সঠিক ধাপে পৌঁছে দেবে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pathways.map((p, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-2xl bg-[#1B1E30] border ${p.accent} flex flex-col justify-between transition-all hover:-translate-y-1 shadow-lg`}
            >
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${p.badgeColor} mb-4`}>
                  {p.badge}
                </span>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {p.title}
                </h3>
                <h4 className="text-sm font-medium text-slate-400 mb-4">
                  {p.titleBn}
                </h4>
                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  {p.desc}
                </p>

                <ul className="space-y-3 mb-8">
                  {p.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <Check className="w-4 h-4 text-[#6D7C55] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onNavigate(p.route, p.params)}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-[#E45147] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all group"
              >
                <span>{p.ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>
      </LandingPageContainer>
    </section>
  );
};
