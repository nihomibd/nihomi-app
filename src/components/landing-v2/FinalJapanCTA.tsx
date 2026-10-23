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
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Floating English Handwritten Accent Note */}
      <div className="absolute top-3.5 left-10 lg:left-14 z-10 hidden sm:block pointer-events-none text-left -rotate-3">
        <span className="font-serif italic text-white text-xs sm:text-[12.5px] tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight block">
          Your Future in Japan <br />
          Starts Here.
        </span>
      </div>

      {/* Main Centered Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 space-y-0.5">
        <h2 className="text-xs sm:text-sm md:text-[14.5px] font-black text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight">
          জাপানিজ শিখুন, নিজের সম্ভাবনাকে আরও বড় করুন
        </h2>

        <p className="text-[9.5px] sm:text-[10px] text-stone-200 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] leading-normal">
          Nihomi আপনার সাথে — আজ, আগামীকাল, জাপানের পথে।
        </p>

        <div className="pt-0.5">
          <button
            type="button"
            onClick={() => onNavigate('journey')}
            className="group inline-flex items-center gap-1.5 px-4.5 py-1 rounded-full bg-gradient-to-r from-[#E45147] to-[#F59E0B] hover:brightness-110 text-white font-black text-[11px] border border-white/40 shadow-lg shadow-red-600/30 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>বিনামূল্যে শেখা শুরু করুন</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
