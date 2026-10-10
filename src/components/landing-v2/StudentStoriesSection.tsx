import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface StudentStoriesSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const StudentStoriesSection: React.FC<StudentStoriesSectionProps> = ({ onNavigate }) => {
  const testimonials = [
    {
      name: 'সানিয়া',
      location: 'ঢাকা',
      target: 'N5 প্রস্তুতি',
      quote: 'একদম শুরু থেকে শিখেছি। এখন নিজের জাপানিজে ছোট ছোট কথা বলতে পারি!',
      avatar: '/assets/landing-v2/student-sanjida.png',
      rating: 5
    },
    {
      name: 'রিয়াদ',
      location: 'চট্টগ্রাম',
      target: 'N4 প্রস্তুতি',
      quote: 'AI Sensei-এর সাথে অনুশীলন করতে করতে জাপানিজ শেখা এখন সহজ ও মজার!',
      avatar: '/assets/landing-v2/student-riad.png',
      rating: 5
    },
    {
      name: 'তানিয়া',
      location: 'সিলেট',
      target: 'SSW প্রস্তুতি',
      quote: 'নিহোমি আমাকে জাপানে পড়াশোনার জন্য প্রস্তুত হতে অনেক সাহায্য করেছে।',
      avatar: '/assets/landing-v2/student-tania.png',
      rating: 5
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="py-2 lg:py-2.5 bg-[#F8FAFF] border-t border-slate-100">
      <div className="max-w-[1000px] xl:max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2">
              <span className="text-[9px] font-extrabold tracking-widest uppercase text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200/60 shadow-2xs">
                REAL STUDENTS, REAL PROGRESS
              </span>
            </div>
            <h2 className="text-xl lg:text-[22px] font-black text-[#101A59] tracking-tight leading-tight">
              আমাদের শিক্ষার্থীদের অভিজ্ঞতা
            </h2>
          </div>
        </div>

        {/* 3 Horizontal Cards flanked by subtle chevrons */}
        <div className="relative flex items-center gap-2">
          {/* Left Navigation Chevron */}
          <button
            type="button"
            onClick={handlePrev}
            className="hidden sm:flex shrink-0 w-7 h-7 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 shadow-2xs items-center justify-center transition-colors cursor-pointer"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 flex-grow">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-300 flex items-center gap-3"
              >
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-100 shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <p className="text-[11px] text-slate-700 italic leading-snug line-clamp-2">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <p className="text-[10px] font-bold text-slate-700 mt-1 truncate">
                    — {item.name}, {item.location} ({item.target})
                  </p>
                  {/* 5 Gold Stars Rating */}
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Navigation Chevron */}
          <button
            type="button"
            onClick={handleNext}
            className="hidden sm:flex shrink-0 w-7 h-7 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 shadow-2xs items-center justify-center transition-colors cursor-pointer"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
