import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { NihomiBrandLogo } from '../brand/NihomiBrandLogo';
import { NIHOMI_BUILD_INFO } from '../../config/buildInfo';

interface FooterProps {
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#0E101B] border-t border-[#F6F0E6]/10 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-400 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Brand & Navigation Row (Brand Guidelines v1.0) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 pb-6 border-b border-[#F6F0E6]/10">
          <div className="flex items-center flex-wrap gap-3">
            <NihomiBrandLogo variant="full" theme="dark" size={28} showTagline={false} />
            <span className="text-[#F6F0E6]/30">•</span>
            <span className="text-xs text-[#F6F0E6]/60 font-medium">Nihomi Learning OS™</span>
            <span className="text-[#F6F0E6]/30">•</span>
            <a
              id="link-bdtrip24-logo-app-footer"
              href="https://bdtrip24.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1 focus:ring-offset-[#0E101B]"
              aria-label="bdTrip24.com Official Website"
              title="bdTrip24.com — Travel & Logistics Partner"
            >
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Partner:</span>
              <img
                src="/brand/bdtrip24.com%20Official%20Logo.png"
                alt="bdTrip24.com"
                className="h-5 sm:h-6 w-auto object-contain"
                loading="lazy"
              />
            </a>
            <span className="text-[#F6F0E6]/30 hidden sm:inline">•</span>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{NIHOMI_BUILD_INFO.getDisplayBadge()}</span>
            </div>
          </div>

          {/* Clean Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs font-semibold text-slate-400">
            <button
              onClick={() => onNavigate?.('landing')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              হোম
            </button>
            <button
              onClick={() => onNavigate?.('journey')}
              className="hover:text-white transition-colors cursor-pointer text-slate-300 font-bold"
            >
              লার্নিং জার্নি
            </button>
            <button
              onClick={() => onNavigate?.('courses')}
              className="hover:text-white transition-colors cursor-pointer text-slate-300 font-bold"
            >
              লেসন
            </button>
            <button
              onClick={() => onNavigate?.('baito')}
              className="hover:text-amber-400 transition-colors cursor-pointer text-amber-400/90 font-bold"
            >
              জাপান সিনারিও
            </button>
            <button
              onClick={() => onNavigate?.('pricing')}
              className="hover:text-rose-400 transition-colors cursor-pointer text-rose-400/90 font-bold"
            >
              সাবস্ক্রিপশন প্ল্যান
            </button>
            <button
              onClick={() => onNavigate?.('terms')}
              className="hover:text-slate-200 transition-colors cursor-pointer text-slate-500"
            >
              শর্তাবলী
            </button>
            <button
              onClick={() => onNavigate?.('privacy')}
              className="hover:text-slate-200 transition-colors cursor-pointer text-slate-500"
            >
              প্রাইভেসি পলিসি
            </button>
            <button
              onClick={() => onNavigate?.('refund-policy')}
              className="hover:text-slate-200 transition-colors cursor-pointer text-slate-500"
            >
              রিফান্ড পলিসি
            </button>
            <button
              onClick={() => onNavigate?.('contact')}
              className="hover:text-slate-200 transition-colors cursor-pointer text-slate-500"
            >
              সাপোর্ট
            </button>
          </div>
        </div>

        {/* Compact Trust & Trade License Strip */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] leading-relaxed">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>নিহোমি (Nihomi) • সরকারি ই-ট্রেড লাইসেন্স নং: TRAD/DNCC/021810/2026</span>
            </div>
            <p className="text-slate-400">
              ইস্যুকারী কর্তৃপক্ষ: ঢাকা উত্তর সিটি কর্পোরেশন (DNCC) • ব্যবসা প্রকৃতি: আইটি ও সফটওয়্যার ডেভেলপমেন্ট • বৈধতা: ৩০ জুন ২০২৭ পর্যন্ত
            </p>
            <p className="text-slate-500 text-[10px]">
              ঠিকানা: BTI Central Plaza, 7th Floor (Lift 6), 95 Green Road, Farmgate, Dhaka 1215
            </p>
          </div>

          {/* Truthful bKash Only Payment Badge */}
          <div className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E2136E]/10 border border-[#E2136E]/30 text-slate-300 text-xs font-medium">
            <div className="w-5 h-5 rounded-md bg-[#E2136E] text-white flex items-center justify-center font-bold text-[10px]">
              bK
            </div>
            <div>
              <div className="font-bold text-[#F472B6] text-[11px]">পেমেন্ট মাধ্যম: bKash (বিকাশ)</div>
              <div className="text-[10px] text-slate-400">কার্ডের প্রয়োজন নেই • অনলাইন গেটওয়ে সংযোগ প্রক্রিয়াধীন</div>
            </div>
          </div>
        </div>

        {/* Bottom Philosophy & Copyright Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 pt-2">
          <div>
            © {new Date().getFullYear()} NIHOMI.COM. সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <span>Adaptive JLPT Intelligence</span>
            <span>•</span>
            <span className="text-slate-300 font-medium">Nihomi Learning Engine™</span>
          </div>
        </div>

      </div>
    </footer>
  );
};