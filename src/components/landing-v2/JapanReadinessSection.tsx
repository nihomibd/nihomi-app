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
    <section id="japan-readiness" className="py-2.5 lg:py-3 bg-white border-t border-slate-100">
      <div className="max-w-[1000px] xl:max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* 2-Column Macro Layout matching Reference Slice */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-center">
          
          {/* LEFT COLUMN: Editorial Intro & CTA (3 cols) */}
          <div className="lg:col-span-3 space-y-2 lg:space-y-2.5">
            <div className="inline-flex items-center gap-2">
              <span className="text-[9.5px] font-extrabold tracking-widest uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/50">
                MORE THAN LANGUAGE
              </span>
            </div>

            <h2 className="text-2xl lg:text-[25px] font-black text-[#101A59] tracking-tight leading-[1.15]">
              জাপানিজ শিখে <br />
              আরও বড় স্বপ্ন পূরণ করুন
            </h2>

            <p className="text-slate-600 text-[11px] leading-snug font-normal">
              শুধু ভাষা নয় — পড়াশোনা, কাজ, ভ্রমণ এবং জাপান জীবনের জন্য বাস্তব প্রস্তুতি নিন Nihomi-এর সাথে।
            </p>

            <button
              type="button"
              onClick={() => onNavigate('baito')}
              className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0b102b] hover:bg-[#1a2044] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <span>আপনার প্রস্তুতি সম্পর্কে জানুন</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* RIGHT COLUMN: 4 Photographic Cards in a single row (9 cols) */}
          <div className="lg:col-span-9 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
            {cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  onClick={card.action}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-0.5"
                >
                  {/* Image Aspect Box */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Content Box */}
                  <div className="p-2 flex items-start gap-1.5 bg-white">
                    <div className="w-6 h-6 rounded-lg bg-purple-50 text-[#6D25EA] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#6D25EA] group-hover:text-white transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-black text-[#101A59] group-hover:text-[#6D25EA] transition-colors leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-[9px] text-slate-500 mt-0.5 leading-tight font-medium">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
