import React from 'react';
import { speakJapanese } from '../lib/tts.js';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import {
  BookOpen,
  Briefcase,
  Bot,
  Award,
  CheckCircle2,
  Volume2,
  ArrowRight,
  Sparkles,
  Compass,
  Check,
  Building2,
  Plane,
  Camera,
  Layers,
  GraduationCap
} from 'lucide-react';
import { NhkMethodologyCard } from '../components/NhkMethodologyCard.js';
import { HanabiBackground } from '../components/HanabiBackground.js';
import { KanjiFlipGrid } from '../components/KanjiFlipGrid.js';
import { QuickQuizWidget } from '../components/QuickQuizWidget.js';
import { EbookShowcaseCarousel } from '../components/EbookShowcaseCarousel.js';

interface HomeViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div id="nihomi-home-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A]">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Hero Banner (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-stone-200 rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span>Nihomi Production Blueprint v1.0</span>
                <span className="text-stone-400">&bull;</span>
                <span className="font-serif">We Coordinate Japanese Learning</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 font-serif leading-tight">
                Learn Japanese. <br />
                <span className="text-red-600">Understand Japan.</span> <br />
                Be Ready for Japan.
              </h1>
              <p className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
                “আপনি জাপানি শেখা শুরু করুন—বাকি পথ, প্রস্তুতি ও জাপানের ভিসা ও ফ্লাইট সমন্বয় করবে Nihomi।” — Bengali Cultural Anchor™, Gemini 3.7 Vision Sensei (📷 OCR), Nihomi MemoryOS™, and complete Japan relocation coordination.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {user ? (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Open My Nihomi Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onNavigate('auth', { mode: 'register' })}
                      className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>Start Learning Free</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNavigate('auth', { mode: 'login' })}
                      className="px-5 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs border border-stone-300 shadow-sm transition-all cursor-pointer"
                    >
                      Log in
                    </button>
                  </>
                )}
                <button
                  onClick={() => onNavigate('coordination-hub')}
                  className="px-5 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs border border-stone-200 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-red-600" />
                  <span>Explore 3 Pathways</span>
                </button>
              </div>

              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-[11px]">Nihomi MemoryOS™</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-[11px]">DILS Japan Visa Wing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-[11px]">bdTrip24 46KG Flights</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Interactive Preview Card (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  Sentence DNA™ Preview
                </span>
                <span className="text-[11px] font-bold text-stone-400">JLPT N5 Core</span>
              </div>
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <ruby className="text-2xl font-bold font-serif text-stone-900 leading-relaxed">
                      初めまして
                      <rt className="text-xs text-red-600 font-sans">はじめまして</rt>
                    </ruby>
                    <p className="text-xs text-stone-500 font-mono mt-1">Hajimemashite &bull; Greeting</p>
                  </div>
                  <button
                    onClick={() => speakJapanese('初めまして')}
                    className="p-2.5 rounded-xl bg-white hover:bg-red-50 text-stone-700 hover:text-red-600 border border-stone-200 shadow-sm transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-white p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                  <p className="text-stone-900 font-semibold">বাংলা: "আপনার সাথে প্রথমবার দেখা হয়ে ভালো লাগলো।"</p>
                  <p className="text-stone-500 text-[11px]">English: Nice to meet you (for the first time).</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('courses')}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Explore All Curriculum (N5–N3)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* The 3 Core Learning Pathways Section */}
        <div className="space-y-6 pt-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              The 3 Connected Learning Pathways
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Self-paced AI, live online cohorts, and connected Dhaka physical classrooms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 hover:border-red-300 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-serif text-stone-900">1. NIHOMI AI</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  24/7 self-paced intelligent learning with Vision Sensei (📷 Camera OCR), voice evaluations, and full JLPT N5-N3 curriculum.
                </p>
              </div>
              <button
                onClick={() => onNavigate('ai-coach')}
                className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Learn with AI &rarr;
              </button>
            </div>

            <div className="bg-white border-2 border-red-500 rounded-3xl p-6 sm:p-8 shadow-md space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-serif text-stone-900">2. NIHOMI LIVE</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Live interactive online classes with Founder Tanvir Kabir Biplob & native Tokyo mentors with oral interview coaching.
                </p>
              </div>
              <button
                onClick={() => onNavigate('coordination-hub')}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Enroll in Live Cohort &rarr;
              </button>
            </div>

            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 hover:border-emerald-300 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-serif text-stone-900">3. NIHOMI IN-PERSON (DILS)</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Physical Banani/Dhanmondi campus + 6-stage COE (Certificate of Eligibility) and Japan student visa filing.
                </p>
              </div>
              <button
                onClick={() => onNavigate('coordination-hub')}
                className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Apply for Campus & Visa &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* NHK Methodology Card */}
        <NhkMethodologyCard />

        {/* 30-Second Rapid Live Quiz Widget */}
        <div className="pt-2">
          <QuickQuizWidget />
        </div>

        {/* 80-Kanji 3D Interactive Flip-Grid */}
        <div className="pt-4">
          <KanjiFlipGrid />
        </div>

        {/* 3D E-Book Library Showcase */}
        <div className="pt-4">
          <EbookShowcaseCarousel />
        </div>
      </section>

      {/* Hanabi Ambient Fireworks */}
      <HanabiBackground />
    </div>
  );
};
