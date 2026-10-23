import React from 'react';
import { BookOpen, Briefcase, Users, Atom, ArrowRight } from 'lucide-react';

interface JapanReadinessSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const JapanReadinessSection: React.FC<JapanReadinessSectionProps> = ({ onNavigate }) => {
  const cards = [
    {
      title: 'জাপানে পড়াশোনা',
      subtitle: 'বিশ্বমানের শিক্ষা, নতুন সুযোগ',
      icon: BookOpen,
      image: '/assets/landing-v2/japan-study.png',
      action: () => onNavigate('courses')
    },
    {
      title: 'জাপানে কাজ',
      subtitle: 'ক্যারিয়ারের নতুন দিগন্ত',
      icon: Briefcase,
      image: '/assets/landing-v2/japan-work.png',
      action: () => onNavigate('baito')
    },
    {
      title: 'জাপান ভ্রমণ',
      subtitle: 'ভাষা জানলে ভ্রমণ আরও মজার',
      icon: Users,
      image: '/assets/landing-v2/japan-travel.png',
      action: () => onNavigate('baito')
    },
    {
      title: 'জাপানকে কাছ থেকে জানুন',
      subtitle: 'সংস্কৃতি, মানুষ, অভিজ্ঞতা',
      icon: Atom,
      image: '/assets/landing-v2/japan-culture.png',
      action: () => onNavigate('community')
    }
  ];

  return (
    <section
      id="japan-readiness"
      className="w-full h-auto lg:h-[210px] lg:max-h-[210px] flex items-center bg-white border-t border-slate-100 py-4 lg:py-0"
    >
      <div className="w-full max-w-[1024px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          
          {/* ========================================================
              LEFT COLUMN: EDITORIAL INTRO & CTA (3 cols)
              ======================================================== */}
          <div className="lg:col-span-3 space-y-1.5 shrink-0">
            <div>
              <span className="text-[9px] font-extrabold tracking-widest uppercase text-slate-500 select-none">
                MORE THAN LANGUAGE
              </span>
            </div>

            <h2 className="text-xl lg:text-[22px] font-black text-[#101A59] tracking-tight leading-[1.14]">
              জাপানিজ শিখে <br />
              আরও বড় স্বপ্ন পূরণ করুন
            </h2>

            <p className="text-slate-600 text-[10px] leading-snug font-normal max-w-xs">
              শুধু ভাষা নয় — পড়াশোনা, কাজ, ভ্রমণ এবং জাপান জীবনের জন্য বাস্তব প্রস্তুতি নিন Nihomi-এর সাথে।
            </p>

            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => onNavigate('baito')}
                className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0b102b] hover:bg-[#1a2044] text-white font-extrabold text-[11px] shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <span>আপনার প্রস্তুতি সম্পর্কে জানুন</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: 4 PHOTOGRAPHIC CARDS IN A SINGLE ROW (9 cols)
              ======================================================== */}
          <div className="lg:col-span-9 grid grid-cols-2 lg:grid-cols-4 gap-2 items-stretch h-auto lg:h-[182px]">
            {cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  onClick={card.action}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer hover:border-amber-400/50"
                >
                  {/* Photo Thumbnail */}
                  <div className="w-full h-[108px] overflow-hidden bg-slate-100">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="eager"
                      decoding="async"
                    />
                  </div>

                  {/* Caption with Icon */}
                  <div className="p-2 flex items-start gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-[#101A59] shrink-0 mt-0.5" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-black text-[#101A59] leading-tight truncate">
                        {card.title}
                      </span>
                      <span className="text-[8.5px] text-slate-500 leading-tight mt-0.5 truncate">
                        {card.subtitle}
                      </span>
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
