import React from 'react';
import { Building, Lock } from 'lucide-react';
import { LandingPageContainer } from './LandingPageContainer';
import { NihomiBrandLogo } from '../brand/NihomiBrandLogo';
import { NIHOMI_BUILD_INFO } from '../../config/buildInfo';

interface LandingFooterProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="py-16 bg-[#0E101B] text-[#F6F0E6] border-t border-[#F6F0E6]/10 text-xs font-sans">
      <LandingPageContainer>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Identity (Brand Guidelines v1.0) */}
          <div className="md:col-span-1 space-y-4">
            <NihomiBrandLogo variant="full" theme="dark" size={28} showTagline={false} />
            <p className="text-slate-400 leading-relaxed">
              শূন্য থেকে জাপান-রেডি। বাংলাভাষী শিক্ষার্থীদের জন্য আধুনিক ও বাস্তবমুখী জাপানি ভাষা ও কর্মক্ষেত্র সিমুলেশন প্ল্যাটফর্ম।
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{NIHOMI_BUILD_INFO.getDisplayBadge()}</span>
            </div>
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">ট্রাভেল ও ফ্লাইট পার্টনার:</span>
              <a
                id="link-bdtrip24-logo-landing-footer"
                href="https://bdtrip24.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1 focus:ring-offset-[#0E101B]"
                aria-label="bdTrip24.com Official Website"
                title="bdTrip24.com — Travel & Logistics Partner"
              >
                <img
                  src="/brand/bdtrip24.com%20Official%20Logo.png"
                  alt="bdTrip24.com"
                  className="h-6 w-auto object-contain"
                  loading="lazy"
                />
              </a>
            </div>
          </div>

          {/* Col 2: Learning & WorkOS */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm tracking-wide">শিক্ষাপদ্ধতি ও সিমুলেশন</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <button onClick={() => onNavigate('lesson', { id: 'n5-l1' })} className="hover:text-white transition-colors">
                  জেন লার্নিং ক্যানভাস
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('kana')} className="hover:text-white transition-colors">
                  কানা স্টুডিও (হিরাগানা ও কাতাকানা)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('baito')} className="hover:text-white transition-colors">
                  WorkOS™ কনবিনি সিমুলেটর
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('memory-os')} className="hover:text-white transition-colors">
                  MemoryOS™ স্পেসড রিপিটেশন
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mock-exams')} className="hover:text-white transition-colors">
                  JLPT N5-N1 মক টেস্ট ইঞ্জিন
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Subscriptions & Pricing */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm tracking-wide">প্ল্যান ও মূল্যতালিকা</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">
                  Nihomi Starter (৳৯৯০/মাস)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">
                  Nihomi Pro (৳১,৯৯০/মাস)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">
                  Nihomi Japan Ready (৳৩,৯৯০/মাস)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">
                  বিকাশ (bKash) পেমেন্ট গেটওয়ে
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">
                  মুশক-৬.৩ ট্যাক্স চালান
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust, License & Governance */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm tracking-wide">আইনি স্বীকৃতি ও বিশ্বাস</h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2">
                <Building className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>ঢাকা উত্তর সিটি কর্পোরেশন ই-ট্রেড লাইসেন্স:<br /><strong className="text-slate-200 font-mono">TRAD/DNCC/021810/2026</strong></p>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-[#6D7C55] shrink-0 mt-0.5" />
                <p>NBR ভ্যাট ও ট্যাক্স বিধিমালা অনুযায়ী পরিচালিত।</p>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                নিহোমি কোনো ভিসা বা ইমিগ্রেশন কনসালটেন্সি নয়; এটি একটি এডটেক লার্নিং প্ল্যাটফর্ম।
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 NIHOMI.COM. সর্বস্বত্ব সংরক্ষিত। ব্র্যান্ড কালার গাইডলাইন v1.0 অনুযায়ী নির্মিত।
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => onNavigate('privacy')} className="hover:text-slate-300 transition-colors cursor-pointer">
              গোপনীয়তা নীতি
            </button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('terms')} className="hover:text-slate-300 transition-colors cursor-pointer">
              শর্তাবলী
            </button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('refund-policy')} className="hover:text-slate-300 transition-colors cursor-pointer">
              রিফান্ড পলিসি
            </button>
            <span>•</span>
            <span className="text-amber-400 font-mono">bKash MFS Pre-launch</span>
          </div>
        </div>
      </LandingPageContainer>
    </footer>
  );
};
