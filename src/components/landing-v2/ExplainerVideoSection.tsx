import React, { useState } from 'react';
import { LandingPageContainer } from './LandingPageContainer';
import { Play, Sparkles, CheckCircle2, Clock, ExternalLink, ShieldCheck } from 'lucide-react';

interface ExplainerVideoSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const ExplainerVideoSection: React.FC<ExplainerVideoSectionProps> = ({ onNavigate }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const keyTimestamps = [
    {
      time: '00:06',
      seconds: 6,
      title: 'কিউমুলেটিভ ল্যাটিস',
      desc: 'পূর্বশর্ত ছাড়া কোনো অপরিচিত শব্দ শিক্ষার্থীকে দেখানো হয় না',
      tag: 'Strict Cumulative Lattice'
    },
    {
      time: '00:15',
      seconds: 15,
      title: 'বাংলায় নমি সেন্সেই',
      desc: 'ভুল হলে লজ্জা না দিয়ে স্নেহমাখা বাংলায় বুঝিয়ে আবার চেষ্টার সুযোগ',
      tag: 'Nomi Sensei'
    },
    {
      time: '00:35',
      seconds: 35,
      title: 'টোকিও কনবিনি সিমুলেটর',
      desc: 'নারিতা এয়ারপোর্ট থেকে ২৪/৭ কনবিনি ক্যাশিয়ার কাউন্টারে প্র্যাকটিস',
      tag: 'Nihomi WorkOS™'
    },
    {
      time: '00:46',
      seconds: 46,
      title: 'JLPT N5-N1 মক ইঞ্জিন',
      desc: 'টাইমড মক টেস্ট, সেকশন কাটঅফ ট্র্যাকিং ও প্রতি প্রশ্নের বাংলা ব্যাখ্যা',
      tag: 'JLPT Mock Engine'
    }
  ];

  const handleSeek = (seconds: number) => {
    const vid = document.getElementById('nihomi-explainer-video-player') as HTMLVideoElement;
    if (vid) {
      vid.currentTime = seconds;
      vid.play?.().catch(() => {});
    }
  };

  return (
    <section id="explainer-video" className="py-20 md:py-28 bg-[#141726] text-[#F6F0E6] relative overflow-hidden border-t border-b border-white/10">
      {/* Subtle radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#E45147]/10 blur-[120px] rounded-full pointer-events-none" />

      <LandingPageContainer>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E45147]/15 border border-[#E45147]/30 text-[#E45147] text-xs font-semibold tracking-wide uppercase mb-4">
            <Clock className="w-3.5 h-3.5" />
            ১ মিনিটের ভিডিও ট্যুর • 60-Second Explainer
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            নিহোমি কীভাবে কাজ করে — <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F6F0E6] via-[#E45147] to-[#f59e0b]">
              ১ মিনিটে সরাসরি দেখুন
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            কোনো মুখস্থবিদ্যা নয়। লার্নিং ক্যানভাস, নমি সেন্সেই ও টোকিও কনবিনি সিমুলেশনের বাস্তব অভিজ্ঞতা দেখে নিন এখনই।
          </p>
        </div>

        {/* 16:9 Video Player Card */}
        <div className="max-w-4xl mx-auto rounded-2xl md:rounded-3xl overflow-hidden border border-[#F6F0E6]/15 bg-[#141726] shadow-2xl relative group">
          <div className="relative w-full aspect-video bg-black/80 flex items-center justify-center overflow-hidden">
            <video
              id="nihomi-explainer-video-player"
              controls
              playsInline
              preload="metadata"
              poster="/media/nihomi-explainer-poster.png"
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src="/media/nihomi-explainer-60s.webm" type="video/webm" />
              <track kind="captions" src="/media/subtitles-bn.vtt" srcLang="bn" label="বাংলা" default />
              <p className="text-slate-400 text-sm p-4 text-center">
                আপনার ব্রাউজারে সরাসরি ভিডিও প্লে হচ্ছে না। নিচের বাটনে ক্লিক করে ফুল মোশন ক্যানভাস ওপেন করুন।
              </p>
            </video>
          </div>

          {/* Under-player interactive bar */}
          <div className="p-4 sm:p-6 bg-slate-900/90 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D7C55] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#6D7C55]"></span>
              </span>
              <span>HD 1280×720 • বাংলা সাবটাইটেল ও মোশন গ্রাফিক্স (ভিজ্যুয়াল ওয়াকথ্রু)</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('lesson', { id: 'n5-l1' })}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#E45147] hover:bg-[#d44339] text-white font-medium text-xs sm:text-sm transition-colors shadow-sm cursor-pointer"
              >
                লাইভ ডেমো শুরু করুন →
              </button>
              <button
                onClick={() => onNavigate('baito')}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-medium text-xs sm:text-sm border border-white/15 transition-colors cursor-pointer"
              >
                WorkOS™ সিমুলেটর
              </button>
            </div>
          </div>
        </div>

        {/* 4 Feature Timeline Cards with 1-Click Video Seek */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 md:mt-12 max-w-5xl mx-auto">
          {keyTimestamps.map((item, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => handleSeek(item.seconds)}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#E45147]/50 hover:bg-white/10 transition-all hover:-translate-y-0.5 text-left cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#E45147]/20 text-[#E45147] group-hover:bg-[#E45147] group-hover:text-white transition-colors">
                  ▶ {item.time}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.tag}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-[#f59e0b] transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </LandingPageContainer>
    </section>
  );
};
