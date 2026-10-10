import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface StudentStoriesSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const StudentStoriesSection: React.FC<StudentStoriesSectionProps> = ({ onNavigate }) => {
  const testimonials = [
    {
      name: 'সানজিদা',
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
      quote: 'হিতোমি আমাকে জাপানে পড়াশোনার জন্য প্রস্তুত হতে অনেক সাহায্য করেছে।',
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
    <section id="testimonials" className="py-14 sm:py-20 bg-[#F8FAFF] border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200/60 shadow-2xs">
                REAL STUDENTS, REAL PROGRESS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#101A59] tracking-tight">
              আমাদের শিক্ষার্থীদের অভিজ্ঞতা
            </h2>
          </div>

          {/* Navigation Chevron Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs transition-colors cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Horizontal Cards (Desktop) / Carousel (Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100 shrink-0"
                />
                <div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <p className="text-xs font-black text-[#101A59] mt-2">
                    — {item.name}, {item.location}{' '}
                    <span className="text-[11px] font-semibold text-[#6D25EA]">
                      ({item.target})
                    </span>
                  </p>
                </div>
              </div>

              {/* 5 Gold Stars Rating */}
              <div className="flex items-center gap-1 pt-2 border-t border-slate-100">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
