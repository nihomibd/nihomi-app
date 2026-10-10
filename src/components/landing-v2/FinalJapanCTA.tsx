import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FinalJapanCTAProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const FinalJapanCTA: React.FC<FinalJapanCTAProps> = ({ onNavigate }) => {
  return (
    <section className="relative w-full overflow-hidden min-h-[300px] sm:min-h-[360px] flex items-center justify-center text-center">
      {/* Full-width Japanese Dusk/Sunset Panorama Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/landing-v2/sunset-panorama-cta.png"
          alt="Japan Sunset Panorama with Mt Fuji and Pagoda"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {/* Subtle Dark Vignette & Gradient for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-purple-950/50 to-slate-950/70" />
      </div>

      {/* Floating English Handwritten Accent Note */}
      <div className="absolute top-6 left-6 sm:left-12 z-10 hidden sm:block pointer-events-none">
        <span className="font-serif italic text-white/80 text-sm sm:text-base tracking-wide drop-shadow-md">
          Your Future in Japan Starts Here.
        </span>
      </div>

      {/* Main Centered Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-4">
        <span className="sm:hidden font-serif italic text-white/80 text-xs block mb-1">
          Your Future in Japan Starts Here.
        </span>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
          জাপানিজ শিখুন, নিজের সম্ভাবনাকে আরও বড় করুন
        </h2>

        <p className="text-xs sm:text-base text-purple-100 max-w-xl mx-auto font-medium drop-shadow-sm leading-relaxed">
          Nihomi আপনার সাথে — আজ, আগামীকাল, জাপানের পথে।
        </p>

        <div className="pt-3">
          <button
            type="button"
            onClick={() => onNavigate('journey')}
            className="group inline-flex items-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#6D25EA] hover:bg-[#5818D1] text-white font-black text-sm sm:text-base shadow-2xl shadow-purple-950/60 hover:shadow-purple-900/80 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>বিনামূল্যে শেখা শুরু করুন</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
