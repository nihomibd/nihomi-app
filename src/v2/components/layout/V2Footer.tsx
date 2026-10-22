// src/v2/components/layout/V2Footer.tsx
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Globe,
  Clock,
  Heart,
  FileText,
  Mail,
  Phone
} from 'lucide-react';
import { V2Route } from '../../types';

interface V2FooterProps {
  onNavigate: (route: V2Route) => void;
}

export const V2Footer: React.FC<V2FooterProps> = ({ onNavigate }) => {
  const [tokyoTime, setTokyoTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Tokyo',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }).format(new Date());
        setTokyoTime(timeStr);
      } catch {
        setTokyoTime('JST');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-[#0E101A] border-t border-[#F6F0E6]/10 text-stone-400 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
        
        {/* Col 1: Brand & Compliance */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-black text-lg">
            <span className="w-7 h-7 rounded-lg bg-[#E45147] text-white flex items-center justify-center text-xs font-serif">
              に
            </span>
            <span>NIHOMI.COM</span>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-400">
            বাঙালি শিক্ষার্থীদের জন্য প্রামাণ্য জাপানিজ ভাষা শিক্ষা এবং জাপান ক্যারিয়ার প্রস্তুতি ওএস।
          </p>
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DNCC TRAD/DNCC/021810/2026</span>
          </div>
        </div>

        {/* Col 2: Learning Modules */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">শিক্ষা মডিউল</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <button onClick={() => onNavigate('journey')} className="hover:text-white transition cursor-pointer">
                টোকিও গোল্ডেন জার্নি
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('kana')} className="hover:text-white transition cursor-pointer">
                হিরাগানা ও কাতাকানা ল্যাব
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('curriculum')} className="hover:text-white transition cursor-pointer">
                JLPT N5–N1 পাঠ্যক্রম
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('workos')} className="hover:text-white transition cursor-pointer">
                টোকিও কনবিনি ক্যাশিয়ার সিমুলেশন
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Career & Legal */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">ক্যারিয়ার ও লিগ্যাল</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <button onClick={() => onNavigate('rirekisho')} className="hover:text-white transition cursor-pointer">
                JIS স্ট্যান্ডার্ড রিজিউমে (CV)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('pricing')} className="hover:text-white transition cursor-pointer">
                সাবস্ক্রিপশন প্ল্যান ও প্রাইসিং
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('terms')} className="hover:text-white transition cursor-pointer">
                সেবার শর্তাবলী (Terms of Service)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('privacy')} className="hover:text-white transition cursor-pointer">
                গোপনীয়তা নীতি (Privacy Policy)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('refund')} className="hover:text-white transition cursor-pointer">
                রিফান্ড পলিসি (Refund Policy)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('legacy')} className="hover:text-amber-300 text-stone-400 transition cursor-pointer flex items-center gap-1">
                <span>লেগ্যাসি ভিউ (Classic)</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Tokyo Time & Contacts */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">টোকিও হাব</h4>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-mono font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Tokyo (JST): {tokyoTime || '09:00 AM'}</span>
            </div>
            <p className="text-[10px] text-stone-400">Shinjuku, Tokyo & Dhaka, Bangladesh</p>
          </div>
          <p className="text-[11px] text-stone-400">
            সহায়তা: <span className="text-white font-semibold">support@nihomi.com</span>
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
        <p>© 2026 NIHOMI (にほみ) — All Rights Reserved. Built with care for Bangladesh scholars.</p>
        <div className="flex items-center gap-1 text-stone-500">
          <span>Crafted in Tokyo & Dhaka</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
        </div>
      </div>
    </footer>
  );
};
