import React from 'react';
import {
  BookOpen,
  Briefcase,
  Users,
  Compass,
  ArrowRight
} from 'lucide-react';

interface JapanReadinessSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const JapanReadinessSection: React.FC<JapanReadinessSectionProps> = ({ onNavigate }) => {
  const cards = [
    {
      title: 'জাপানে পড়াশোনা',
      desc: 'বিশ্বমানের শিক্ষা, নতুন সুযোগ',
      icon: BookOpen,
      image: '/assets/landing-v2/japan-study.png',
      action: () => onNavigate('courses')
    },
    {
      title: 'জাপানে কাজ',
      desc: 'ক্যারিয়ারের নতুন দিগন্ত',
      icon: Briefcase,
      image: '/assets/landing-v2/japan-work.png',
      action: () => onNavigate('baito')
    },
    {
      title: 'জাপান ভ্রমণ',
      desc: 'ভাষা জানলে ভ্রমণ আরও মজার',
      icon: Users,
      image: '/assets/landing-v2/japan-travel.png',
      action: () => onNavigate('baito')
    },
    {
      title: 'জাপানকে কাছ থেকে জানুন',
      desc: 'সংস্কৃতি, মানুষ, অভিজ্ঞতা',
      icon: Compass,
      image: '/assets/landing-v2/japan-culture.png',
      action: () => onNavigate('community')
    }
  ];

  return (
    <section id="japan-readiness" className="py-14 sm:py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Header & Intro */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                MORE THAN LANGUAGE
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#101A59] tracking-tight leading-[1.2]">
              জাপানিজ শিখে আরও বড় স্বপ্ন পূরণ করুন
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              শুধু ভাষা নয় — পড়াশোনা, কাজ, ভ্রমণ এবং জাপান জীবনের জন্য বাস্তব প্রস্তুতি নিন Nihomi-এর সাথে।
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('baito')}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#101A59] hover:bg-[#1E1B4B] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>আপনার প্রস্তুতি সম্পর্কে জানুন</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* 4 Outcome Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={card.action}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
              >
                {/* Image Aspect Box */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content Box */}
                <div className="p-4 sm:p-5 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6D25EA] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#6D25EA] group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#101A59] group-hover:text-[#6D25EA] transition-colors leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug font-medium">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
