import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FinalJapanCTAProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const FinalJapanCTA: React.FC<FinalJapanCTAProps> = ({ onNavigate }) => {
  return (
    <section
      id="final-cta"
      className="relative w-full overflow-hidden h-[111px] max-h-[111px] flex items-center justify-center text-center select-none"
    >
      {/* Full-width Japanese Dusk/Sunset Panorama Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/landing-v2/sunset-panorama-cta.png"
          alt="Japan Sunset Panorama with Mt Fuji and Pagoda"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {/* Subtle Dark Vignette & Gradient for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-purple-950/40 to-slate-950/60" />
      </div>

      {/* Floating English Handwritten Accent Note */}
      <div className="absolute top-3 left-6 sm:left-10 z-10 hidden sm:block pointer-events-none text-left">
        <span className="font-serif italic text-white/90 text-xs sm:text-[13px] tracking-wide drop-shadow-md leading-tight block">
          Your Future in Japan <br />
          Starts Here.
        </span>
      </div>

      {/* Main Centered Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 space-y-0.5">
        <h2 className="text-xs sm:text-sm md:text-[15px] font-black text-white tracking-tight drop-shadow-md leading-tight">
          জাপানিজ শিখুন, নিজের সম্ভাবনাকে আরও বড় করুন
        </h2>

        <p className="text-[9.5px] sm:text-[10px] text-purple-100 font-medium drop-shadow-xs leading-normal">
          Nihomi আপনার সাথে — আজ, আগামীকাল, জাপানের পথে।
        </p>

        <div className="pt-0.5">
          <button
            type="button"
            onClick={() => onNavigate('journey')}
            className="group inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-purple-200 via-pink-100 to-sky-200 hover:opacity-95 text-[#101A59] font-black text-[10px] shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <span>বিনামূল্যে শেখা শুরু করুন</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
