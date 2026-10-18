import React from 'react';
import {
  BarChart2,
  Target,
  BookOpen,
  Headphones,
  MessageSquare,
  Plane,
  ArrowRight
} from 'lucide-react';
import { LandingPageContainer } from './LandingPageContainer';

interface LearningJourneySectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const LearningJourneySection: React.FC<LearningJourneySectionProps> = ({ onNavigate }) => {
  const steps = [
    {
      num: '০১',
      title: 'শুরুতে অবস্থান যাচাই',
      subtitle: 'Quick Level Test',
      meta: '৫ মিনিট • স্বয়ংক্রিয়',
      icon: BarChart2,
      accent: 'text-[#E45147]',
      border: 'hover:border-[#E45147]/50'
    },
    {
      num: '০২',
      title: 'ব্যক্তিগত স্তর নির্ধারণ',
      subtitle: 'N5 - N1 Diagnostic',
      meta: 'লেভেল ডায়াগনস্টিক',
      icon: Target,
      accent: 'text-indigo-600',
      border: 'hover:border-indigo-600/50'
    },
    {
      num: '০৩',
      title: 'দৈনিক মিশন ও রুটিন',
      subtitle: 'Personalized Daily Goal',
      meta: 'প্রতিদিন ১৫ মিনিট',
      icon: BookOpen,
      accent: 'text-[#6D7C55]',
      border: 'hover:border-[#6D7C55]/50'
    },
    {
      num: '০৪',
      title: 'ইন্টারঅ্যাক্টিভ জেন পাঠ',
      subtitle: 'Canvas + Stroke Engine',
      meta: 'ধাপে ধাপে হাতে-কলমে',
      icon: Headphones,
      accent: 'text-[#E45147]',
      border: 'hover:border-[#E45147]/50'
    },
    {
      num: '০৫',
      title: 'বাস্তব কর্মক্ষেত্র কথপোকথন',
      subtitle: 'WorkOS™ Konbini Simulator',
      meta: 'কণ্ঠ ও কেইগো চর্চা',
      icon: MessageSquare,
      accent: 'text-[#6D7C55]',
      border: 'hover:border-[#6D7C55]/50'
    },
    {
      num: '০৬',
      title: 'জাপান রেডিনেস ও মক টেস্ট',
      subtitle: 'JLPT Pass & Workplace Ready',
      meta: 'ভিসা ও কাজের প্রস্তুতি',
      icon: Plane,
      accent: 'text-[#EAB308]',
      border: 'hover:border-[#EAB308]/50'
    }
  ];

  return (
    <section
      id="learning-journey"
      className="w-full py-16 md:py-24 bg-[#F6F0E6] border-t border-b border-[#141726]/10 text-[#141726] relative overflow-hidden"
    >
      {/* Background Japanese minimal grid ambiance */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#141726_1px,transparent_1px)] [background-size:24px_24px]" />

      <LandingPageContainer className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: EDITORIAL INTRO & CTA (4 cols) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E45147]/10 border border-[#E45147]/25 text-[#E45147] text-xs font-black tracking-wider uppercase shadow-xs">
              <span>Your Japanese Journey</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-[#141726] tracking-tight leading-tight">
              আপনার ব্যক্তিগত <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#141726] via-[#E45147] to-[#141726]">
                শেখার সুনির্দিষ্ট পথ
              </span>
            </h2>
            
            <p className="text-[#141726]/80 text-sm leading-relaxed font-normal max-w-sm">
              বর্তমান জ্ঞান থেকে জাপানে কর্মক্ষেত্র ও পড়াশোনা পর্যন্ত — একটি বৈজ্ঞানিক, ধাপে ধাপে পরিকল্পিত অগ্রগতি।
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('journey')}
                className="btn-haptic inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#E45147] hover:bg-[#c93b32] text-white font-black text-xs shadow-xl shadow-red-600/30 transition-all cursor-pointer"
              >
                <span>আপনার শেখার পথ দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: 6 STEP CARDS (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.num}
                  onClick={() => onNavigate('journey')}
                  className="bg-white rounded-2xl p-5 border border-[#141726]/10 hover:border-[#E45147] hover:shadow-lg transition-all flex flex-col justify-between text-left cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-black text-[#E45147] group-hover:scale-105 transition-transform">
                      {step.num}
                    </span>
                    <Icon className={`w-5 h-5 ${step.accent === 'text-[#F6F0E6]' ? 'text-[#141726]' : step.accent}`} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#141726] mb-1 group-hover:text-[#E45147] transition-colors leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 font-mono leading-tight">
                      {step.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#141726]/8 text-[11px] font-bold text-stone-600">
                    {step.meta}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </LandingPageContainer>
    </section>
  );
};

export default LearningJourneySection;
