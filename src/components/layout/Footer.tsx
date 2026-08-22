import React from 'react';
import {
  Compass,
  Building2,
  Plane,
  Bot,
  Sparkles,
  ShieldCheck,
  Award,
  Globe,
  Lock,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer id="nihomi-footer" className="bg-stone-950 text-stone-300 border-t border-stone-800 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Positioning (2 cols on lg) */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white font-bold text-lg font-serif shadow-md">
                日
              </div>
              <div>
                <span className="font-bold text-xl text-white font-serif tracking-tight">Nihomi.com</span>
                <span className="text-[10px] block text-stone-400 font-sans">We Coordinate Japanese Learning</span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              “আপনি জাপানি শেখা শুরু করুন—বাকি পথ, প্রস্তুতি ও জাপানের ভিসা ও ফ্লাইট সমন্বয় করবে Nihomi।”
            </p>
            <p className="text-[11px] text-stone-500 leading-relaxed max-w-sm">
              An AI-powered Japanese Learning & Japan Readiness Operating System combining online AI self-study, live mentorship, physical classrooms at Dhaka International Language School, and air travel via bdTrip24.com.
            </p>
          </div>

          {/* Col 2: 3 Learning Pathways */}
          <div className="space-y-3 text-xs">
            <p className="text-xs font-bold text-white uppercase tracking-wider">3 Learning Pathways</p>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('ai-coach')} className="hover:text-red-400 transition-colors text-stone-400 hover:underline">
                  1. Nihomi AI (24/7 Gemini 3.7)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('coordination-hub')} className="hover:text-red-400 transition-colors text-stone-400 hover:underline">
                  2. Nihomi Live (Founder & Sensei)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('coordination-hub')} className="hover:text-red-400 transition-colors text-stone-400 hover:underline">
                  3. Nihomi In-Person (DILS Dhaka)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-red-400 transition-colors text-stone-400 hover:underline">
                  JLPT Curriculum (N5 &bull; N4 &bull; N3)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('work-japanese')} className="hover:text-red-400 transition-colors text-stone-400 hover:underline">
                  Workplace Keigo (ビジネス敬語)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Purple Cow Signature Tools */}
          <div className="space-y-3 text-xs">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Signature Innovations</p>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('japan-twin')} className="hover:text-red-400 transition-colors text-stone-400 hover:underline flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-red-500" />
                  <span>Nihomi JapanTwin™ (7-Day Sim)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('memory-os')} className="hover:text-red-400 transition-colors text-stone-400 hover:underline flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>MemoryOS™ (Personal PDF Book)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('interview-lab')} className="hover:text-red-400 transition-colors text-stone-400 hover:underline">
                  Tokyo Principal Interview Lab™
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('baito-os')} className="hover:text-red-400 transition-colors text-stone-400 hover:underline">
                  BaitoOS™ (Conbini Job Lab)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ghost-mode')} className="hover:text-red-400 transition-colors text-stone-400 hover:underline">
                  Ghost Mode™ (Never Repeat Mistakes)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('day1-blueprint')} className="hover:text-red-400 transition-colors text-stone-400 hover:underline">
                  Japan Day-1 Arrival Blueprint™
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Travel & Campus Coordination */}
          <div className="space-y-3 text-xs">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Campus & Travel Wing</p>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('coordination-hub')} className="hover:text-red-400 transition-colors text-stone-400 hover:underline flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dhaka Int'l Language School</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('coordination-hub')} className="hover:text-red-400 transition-colors text-stone-400 hover:underline flex items-center gap-1">
                  <Plane className="w-3.5 h-3.5 text-blue-400" />
                  <span>bdTrip24.com Student Flights</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('passport')} className="hover:text-red-400 transition-colors text-stone-400 hover:underline">
                  Verified Learning Passport™
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-red-400 transition-colors text-stone-400 hover:underline">
                  Plans & Subscriptions (৳ BDT)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('credits')} className="hover:text-red-400 transition-colors text-stone-400 hover:underline">
                  AI Credits Top-Up Store
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment & Statutory Compliance Badges */}
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-400">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <span className="px-3 py-1 rounded-lg bg-stone-900 border border-stone-700 text-stone-300 font-bold text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>EPS Easy Payment System</span>
            </span>
            <span className="px-3 py-1 rounded-lg bg-stone-900 border border-stone-700 text-stone-300 font-bold text-[11px]">
              bKash Tokenized MFS
            </span>
            <span className="px-3 py-1 rounded-lg bg-stone-900 border border-stone-700 text-stone-300 font-bold text-[11px]">
              SSLCommerz (VISA / MC)
            </span>
            <span className="px-3 py-1 rounded-lg bg-stone-900 border border-stone-700 text-stone-300 font-bold text-[11px]">
              Apple Pay & Google Pay
            </span>
            <span className="px-3 py-1 rounded-lg bg-stone-900 border border-stone-700 text-emerald-400 font-bold text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>NBR Mushak-6.3 Compliant</span>
            </span>
          </div>

          <div className="text-center md:text-right space-y-0.5">
            <p className="font-bold text-stone-200">Nihomi.com &bull; Nihomi Academy Ltd.</p>
            <p className="text-[11px] text-stone-500">Dhaka Campus: Banani & Dhanmondi &bull; Tokyo Coordination Desk</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500">
          <div>&copy; 2026 Nihomi.com. All rights reserved. Master Production Release v1.0.</div>
          <div className="mt-2 sm:mt-0 flex gap-4">
            <button onClick={() => onNavigate('about')} className="hover:text-stone-300">About Story</button>
            <span>&bull;</span>
            <button onClick={() => onNavigate('coordination-hub')} className="hover:text-stone-300">Dhaka School</button>
            <span>&bull;</span>
            <button onClick={() => onNavigate('day1-blueprint')} className="hover:text-stone-300">bdTrip24 Travel</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
