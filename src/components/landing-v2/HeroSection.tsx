import React, { useState } from 'react';
import {
  ArrowRight,
  Play,
  Volume2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  Compass
} from 'lucide-react';
import { LandingPageContainer } from './LandingPageContainer';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
  onOpenCalibration?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenCalibration }) => {
  const { user, openAuthModal } = useAuth();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const speakCharacter = (char: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(char);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <section
      id="hero-section"
      className="relative overflow-hidden w-full bg-[#141726] border-b border-[#F6F0E6]/10 py-16 md:py-24 text-[#F6F0E6]"
    >
      {/* Background Japanese minimal grid ambiance */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#272b40_1px,transparent_1px)] [background-size:24px_24px]" />

      <LandingPageContainer className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ========================================================
              LEFT COLUMN: CORE PROMISE & ACTION (7 cols)
              ======================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1B1E30] border border-[#F6F0E6]/15 w-fit shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#E45147] animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-[#F6F0E6]">
                From Zero Japanese to Japan-Ready • Nomi Sensei (বাংলায় তোমার জাপানি শেখার সঙ্গী)
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-white leading-[1.12]">
              জাপানিজ শেখা শুরু হোক <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E45147] via-[#f59e0b] to-[#F6F0E6]">
                একদম শূন্য থেকে।
              </span>
            </h1>

            {/* Clear, 5-Second Supporting Copy */}
            <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              শুধু ব্যাকরণ মুখস্থ নয়—Nomi Sensei-এর সাথে মাতৃভাষায় শিখুন, টোকিও কনবিনি ও কর্মক্ষেত্রের বাস্তব পরিস্থিতিতে অনুশীলন করুন এবং জাপানের জন্য নিজেকে প্রস্তুত করুন।
            </p>

            {/* Unambiguous Free Starter Value Strip */}
            <div className="flex flex-wrap items-center gap-2 py-1 max-w-xl text-xs sm:text-[13px] text-amber-300/90 font-medium bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl">
              <span className="font-bold text-white bg-amber-500/20 px-1.5 py-0.5 rounded text-[11px] uppercase tracking-wider">বিনামূল্যে (FREE)</span>
              <span>হিরাগানা/কাতাকানা ক্যানভাস • কতোবা ক্যানভাস (N-I-H-O-M-I) • N5 অধ্যায় ১–৫ • ১০টি প্রিন্টযোগ্য A4 শিট • অফিসিয়াল JIS রিজিউমে</span>
            </div>

            {/* High-Contrast Primary Actions & Fast-Track Calibration */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {!user && (
                <button
                  type="button"
                  id="hero-mobile-login-cta"
                  onClick={() => openAuthModal('login')}
                  className="btn-haptic inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/20 shadow-md transition cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-amber-400" />
                  <span>লগইন / সাইন-আপ</span>
                </button>
              )}
              <button
                type="button"
                id="hero-start-journey-cta"
                onClick={() => onNavigate('journey')}
                className="btn-haptic inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#E45147] hover:bg-[#c93b32] text-white font-black text-sm sm:text-base shadow-xl shadow-red-600/30 transition cursor-pointer"
              >
                <span>বিনামূল্যে পাঠ শুরু করুন</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {onOpenCalibration && (
                <button
                  type="button"
                  id="hero-open-calibration-cta"
                  onClick={onOpenCalibration}
                  className="btn-haptic inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#1B1E30] hover:bg-[#23273e] text-white font-bold text-xs sm:text-sm border border-[#F6F0E6]/20 shadow-sm transition cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>কুইক ক্যালিব্রেশন (৫ মিনিট)</span>
                </button>
              )}

              <button
                type="button"
                id="hero-explainer-cta"
                onClick={() => {
                  const el = document.getElementById('explainer-video');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  const vid = document.getElementById('nihomi-explainer-video-player') as HTMLVideoElement;
                  if (vid) vid.play?.().catch(() => {});
                }}
                className="btn-haptic inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-[#F6F0E6]/10 transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#E45147] text-white flex items-center justify-center shrink-0">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
                <span>৬০ সেকেন্ডে Nihomi দেখুন</span>
              </button>
            </div>

            {/* Social Trust & Compliance Strip */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <div className="flex -space-x-2 overflow-hidden shrink-0">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-[#141726] object-cover"
                  src="/assets/landing-v2/student-sanjida.png"
                  alt="Student Sanjida"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-[#141726] object-cover"
                  src="/assets/landing-v2/student-riad.png"
                  alt="Student Riad"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-[#141726] object-cover"
                  src="/assets/landing-v2/student-tania.png"
                  alt="Student Tania"
                />
                <div className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-[#141726] bg-[#6D7C55] text-xs font-black text-white">
                  ✓
                </div>
              </div>
              <div className="text-left text-xs text-stone-300">
                <div className="font-bold text-white">
                  বাঙালি শিক্ষার্থীদের জন্য বিশেষভাবে প্রকৌশলিত
                </div>
                <div className="text-[11px] text-stone-400">
                  সহজ বাংলা উচ্চারণ গাইড • DNCC ই-ট্রেড লাইসেন্স নং: TRAD/DNCC/021810/2026
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================
              RIGHT COLUMN: HIGH-CONTRAST ZEN LEARNING PREVIEW (5 cols)
              22% Washi Cream paper ground (#F6F0E6) providing visual balance
              ======================================================== */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="w-full max-w-md bg-[#F6F0E6] text-[#141726] rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-white/10 relative overflow-hidden text-left">
              
              {/* Paper Header / Metadata */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#141726]/12">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E45147]" />
                  <span className="text-xs font-mono font-black tracking-wider uppercase text-[#141726]">
                    ক্যানোনিকাল পাঠ • N5 ধাপ ০১
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#6D7C55]/15 text-[#6D7C55] text-[10px] font-bold">
                  পূর্বশর্ত: শূন্য (ভিত্তি)
                </span>
              </div>

              {/* Central Character & Pronunciation */}
              <div className="text-center py-4 bg-white/70 rounded-2xl border border-[#141726]/8 mb-5 relative group">
                <span className="text-7xl sm:text-8xl font-black text-[#141726] select-none block tracking-tight font-serif">
                  あ
                </span>
                <span className="text-xs font-mono font-bold tracking-widest text-stone-500 uppercase block mt-1">
                  Hiragana 'a' • উচ্চারণ: আ
                </span>

                <button
                  type="button"
                  onClick={() => speakCharacter('あ')}
                  className="mt-3.5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141726] hover:bg-[#23273e] text-white text-xs font-bold shadow-md transition cursor-pointer"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-[#E45147] animate-pulse' : 'text-stone-300'}`} />
                  <span>{isPlayingAudio ? 'শোনা হচ্ছে...' : 'উচ্চারণ শুনুন'}</span>
                </button>
              </div>

              {/* Nomi Companion Micro-Guidance */}
              <div className="p-3.5 rounded-2xl bg-white/80 border border-[#141726]/10 mb-5 flex items-start gap-3 shadow-xs">
                <img
                  src="/brand/nomi/nomi-welcome.png"
                  alt="Nomi Sensei"
                  className="w-10 h-10 rounded-full border-2 border-[#E45147] shrink-0 bg-[#F6F0E6] object-cover shadow-xs"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-black text-[#141726] flex items-center gap-1">
                      Nomi Sensei
                    </span>
                    <span className="text-[10px] text-[#E45147] font-semibold">・ বাংলায় তোমার জাপানি শেখার সঙ্গী</span>
                  </div>
                  <p className="text-xs text-[#141726]/80 leading-relaxed font-medium">
                    "প্রথম ধাপ: 'あ' হলো জাপানি ভাষার ভিত্তি স্বরবর্ণ। কোনো তাড়াহুড়ো নেই, ৩টি স্ট্রোকে শান্ত মনে অনুশীলন শুরু করুন।"
                  </p>
                </div>
              </div>

              {/* Direct Jump to Zen Lesson Canvas */}
              <button
                type="button"
                onClick={() => onNavigate('lesson', { id: 'n5-l1' })}
                className="w-full py-3.5 rounded-xl bg-[#E45147] hover:bg-[#c93b32] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>জেন ক্যানভাসে সরাসরি শিখুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>

        </div>
      </LandingPageContainer>
    </section>
  );
};

export default HeroSection;
