import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface StudentStoriesSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const StudentStoriesSection: React.FC<StudentStoriesSectionProps> = ({ onNavigate }) => {
  const testimonials = [
    {
      name: 'সাদিয়া',
      location: 'ঢাকা',
      target: 'N5 প্রস্তুতি',
      avatar: '/assets/landing-v2/student-sanjida.png',
      quote: 'একদম শুরু থেকে শিখেছি। এখন নিজেই জাপানিজে ছোট ছোট কথা বলতে পারি!',
      rating: 5
    },
    {
      name: 'রিয়াদ',
      location: 'চট্টগ্রাম',
      target: 'N4 প্রস্তুতি',
      avatar: '/assets/landing-v2/student-riad.png',
      quote: 'AI Sensei-এর সাথে অনুশীলন করতে করতে জাপানিজ শেখা এখন সহজ ও মজার।',
      rating: 5
    },
    {
      name: 'তানিয়া',
      location: 'সিলেট',
      target: 'SSW প্রস্তুতি',
      avatar: '/assets/landing-v2/student-tania.png',
      quote: 'নিহোমি আমাকে জাপানে পড়াশোনার জন্য প্রস্তুত হতে অনেক সাহায্য করছে।',
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      id="testimonials"
      className="w-full h-auto lg:h-[160px] lg:max-h-[160px] flex items-center bg-[#F8FAFF] border-t border-slate-100 py-3 lg:py-0"
    >
      <div className="w-full max-w-[1024px] mx-auto px-4">
        
        {/* Centered Heading */}
        <div className="text-center mb-2">
          <span className="text-[8.5px] font-extrabold tracking-widest uppercase text-slate-400 block select-none">
            REAL STUDENTS, REAL PROGRESS
          </span>
          <h2 className="text-base lg:text-[17px] font-black text-[#101A59] tracking-tight leading-tight mt-0.5">
            আমাদের শিক্ষার্থীদের অভিজ্ঞতা
          </h2>
        </div>

        {/* 3 Horizontal Cards Flanked by Chevrons */}
        <div className="relative flex items-center gap-1.5 justify-center">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            className="w-6 h-6 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 shadow-2xs flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* 3 Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-grow max-w-[940px]">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-2xs hover:shadow-xs transition-all flex items-center gap-2.5 h-[88px]"
              >
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <p className="text-[10px] text-slate-700 italic leading-tight line-clamp-2">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <p className="text-[9px] font-bold text-slate-600 mt-1 truncate">
                    — {item.name}, {item.location} ({item.target})
                  </p>
                  {/* 5 Stars */}
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNext}
            className="w-6 h-6 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 shadow-2xs flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
