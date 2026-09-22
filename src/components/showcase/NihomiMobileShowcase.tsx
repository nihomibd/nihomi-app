// src/components/showcase/NihomiMobileShowcase.tsx
// Nihomi Japanese Path — Three Photorealistic Mobile Phone Studio Showcase
// Refined contemporary Japanese aesthetic (washi paper textures, deep indigo, cream, moss green & crimson accents)

import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Award,
  Briefcase,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronDown,
  Layers,
  Search,
  ArrowRight,
  ShieldCheck,
  Compass,
  Star,
  Check,
  Flame,
  Volume2
} from 'lucide-react';

export const NihomiMobileShowcase: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <div
      id="nihomi-studio-showcase"
      className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-[#07070d] text-stone-100 flex flex-col items-center select-none overflow-hidden"
    >
      {/* Studio Header & Meta */}
      <div className="max-w-4xl text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/80 border border-stone-800 text-stone-400 text-xs font-mono mb-3">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>NIHOMI: JAPANESE PATH — MOBILE DESIGN SYSTEM</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
          Minimalist Contemporary Mobile UI
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 max-w-2xl mx-auto leading-relaxed">
          Contemporary Japanese aesthetic pairing deep indigo (<span className="text-indigo-400 font-mono">#0A0A16</span>), 
          tactile washi cream, moss green, and crimson lacquer. Crafted specifically for Bengali students and professionals.
        </p>
      </div>

      {/* Studio Stage: Three Phones Side-by-Side with Studio Lighting & Drop Shadows */}
      <div className="w-full max-w-7xl relative flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 xl:gap-10 pb-10">
        {/* Soft Ambient Glow in Studio Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-red-600/10 via-indigo-600/15 to-amber-600/10 blur-[120px] pointer-events-none rounded-full" />

        {/* ========================================================================= */}
        {/* SCREEN 1: PERSONALIZED DASHBOARD (Left Device)                            */}
        {/* ========================================================================= */}
        <div className="w-full max-w-[360px] sm:max-w-[380px] shrink-0 relative group">
          <div className="text-center mb-3">
            <span className="text-[11px] font-mono tracking-widest text-stone-400 uppercase font-semibold">
              Screen 01 • Personalized Dashboard
            </span>
          </div>

          {/* Smartphone Frame Outer Bezel */}
          <div className="relative rounded-[48px] p-3.5 bg-gradient-to-b from-stone-700 via-stone-850 to-stone-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.12)] border border-stone-700/60 ring-1 ring-black">
            {/* Speaker & Mic Notch Pill */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800" />
            </div>

            {/* Inner Screen Surface */}
            <div className="relative rounded-[36px] bg-[#0c0d18] text-stone-100 overflow-hidden border border-stone-800/80 min-h-[680px] flex flex-col justify-between p-5 pt-9">
              {/* Glass Reflection Highlight */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-white/[0.04] to-transparent pointer-events-none rounded-tr-[36px]" />

              {/* Status Bar */}
              <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 mb-4 px-1">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <div className="w-4 h-2 border border-stone-400 rounded-[2px] p-0.5 flex items-center">
                    <div className="w-2.5 h-full bg-stone-400 rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* Top: Nihomi Brand & Dhaka Language School Badge */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center shadow-md shadow-red-500/20 text-white font-bold text-xs">
                      日
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black tracking-wider text-white">日本美</span>
                        <span className="text-xs font-bold tracking-tight text-stone-300">NIHOMI</span>
                      </div>
                      <span className="text-[9px] text-stone-400 font-medium">Japanese Path for Bangladesh</span>
                    </div>
                  </div>

                  <div className="px-2 py-1 rounded-full bg-stone-900/90 border border-stone-700/80 flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3 h-3 text-red-400" />
                    <span className="text-[9px] font-bold text-stone-300">ঢাকা ল্যাঙ্গুয়েজ স্কুল পার্টনার</span>
                  </div>
                </div>
              </div>

              {/* Progress Hub Card: Washi Paper Styling */}
              <div className="p-4 rounded-2xl bg-[#141523] border border-stone-700/60 shadow-md mb-4 relative overflow-hidden">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-amber-400">
                      STUDENT JOURNEY
                    </span>
                    <h3 className="text-xs font-bold text-stone-150 mt-0.5">
                      Welcome, Student.
                    </h3>
                    <p className="text-[11px] text-stone-400 font-medium">
                      Your Zero to JLPT N5 Pathway
                    </p>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 font-mono text-[10px] font-bold">
                    25% DONE
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden mt-1 mb-2">
                  <div className="bg-gradient-to-r from-red-600 to-amber-500 h-full w-[25%] rounded-full" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span>লেসন ৬ সমাপ্ত (Lesson 06 Completed)</span>
                  <span className="font-semibold text-stone-300">লেসন ১১ পরবর্তী</span>
                </div>
              </div>

              {/* Core Feature: Prominent Integrated "Ask Sensei" Input */}
              <div className="mb-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-indigo-600/20 to-amber-500/20 rounded-2xl blur-sm opacity-60" />
                  <div className="relative flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-[#121324] border border-stone-700/80 shadow-md">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                    <input
                      type="text"
                      readOnly
                      placeholder="Ask Sensei in Bengali, English, or Japanese (বাংলায় প্রশ্ন করুন)..."
                      className="bg-transparent text-xs text-stone-200 placeholder:text-stone-400 w-full focus:outline-none pointer-events-none truncate"
                    />
                    <div className="p-1 rounded-lg bg-red-600/20 text-red-400 shrink-0">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Feature Cards Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-2">
                {/* 1. Kana Lab */}
                <div className="p-3 rounded-2xl bg-[#121322] border border-stone-800 hover:border-stone-700 transition-colors">
                  <div className="w-7 h-7 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center font-bold text-xs mb-2">
                    あ
                  </div>
                  <h4 className="text-xs font-bold text-stone-100">Kana Lab</h4>
                  <p className="text-[10px] text-stone-400 mt-0.5">হিরাগানা ও কাতাকানা</p>
                  <div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Mastered (46/46)</span>
                  </div>
                </div>

                {/* 2. Minna no Nihongo */}
                <div className="p-3 rounded-2xl bg-[#121322] border border-red-500/30 bg-red-500/[0.03]">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-100">Minna Lessons</h4>
                  <p className="text-[10px] text-stone-400 mt-0.5">লেসন ০১ - ২৫ পাঠ্যসূচি</p>
                  <div className="mt-2 text-[9px] font-bold text-amber-400">
                    লেসন ১১ সক্রিয়
                  </div>
                </div>

                {/* 3. Baito Sim */}
                <div className="p-3 rounded-2xl bg-[#121322] border border-stone-800">
                  <div className="w-7 h-7 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-2">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-100">Baito Sim</h4>
                  <p className="text-[10px] text-stone-400 mt-0.5">টোকিও কনবিনি জব সিমুলেশন</p>
                  <div className="mt-2 text-[9px] font-bold text-stone-500">
                    লেভেল ১ আনলকড
                  </div>
                </div>

                {/* 4. JLPT Prep */}
                <div className="p-3 rounded-2xl bg-[#121322] border border-stone-800">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-2">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-100">JLPT Prep</h4>
                  <p className="text-[10px] text-stone-400 mt-0.5">মক টেস্ট ও রেজাল্ট সনদ</p>
                  <div className="mt-2 text-[9px] font-bold text-stone-500">
                    ১৮০ মার্কস ফরম্যাট
                  </div>
                </div>
              </div>

              {/* Bottom Navigation Dock */}
              <div className="mt-2 pt-2 border-t border-stone-800/80 flex items-center justify-around text-stone-400">
                <div className="flex flex-col items-center text-red-500 font-bold text-[9px]">
                  <Compass className="w-4 h-4" />
                  <span>Home</span>
                </div>
                <div className="flex flex-col items-center text-[9px]">
                  <BookOpen className="w-4 h-4" />
                  <span>Lessons</span>
                </div>
                <div className="flex flex-col items-center text-[9px]">
                  <Award className="w-4 h-4" />
                  <span>Tests</span>
                </div>
                <div className="flex flex-col items-center text-[9px]">
                  <Briefcase className="w-4 h-4" />
                  <span>Baito</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCREEN 2: LEARNING PATHWAY (Middle Device)                                 */}
        {/* ========================================================================= */}
        <div className="w-full max-w-[360px] sm:max-w-[380px] shrink-0 relative group">
          <div className="text-center mb-3">
            <span className="text-[11px] font-mono tracking-widest text-stone-400 uppercase font-semibold">
              Screen 02 • Learning Pathway
            </span>
          </div>

          <div className="relative rounded-[48px] p-3.5 bg-gradient-to-b from-stone-700 via-stone-850 to-stone-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.12)] border border-stone-700/60 ring-1 ring-black">
            {/* Notch */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800" />
            </div>

            {/* Inner Screen */}
            <div className="relative rounded-[36px] bg-[#0b0c16] text-stone-100 overflow-hidden border border-stone-800/80 min-h-[680px] flex flex-col justify-between p-5 pt-9">
              {/* Glass Reflection */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-white/[0.04] to-transparent pointer-events-none rounded-tr-[36px]" />

              {/* Status Bar */}
              <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 mb-3 px-1">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <div className="w-4 h-2 border border-stone-400 rounded-[2px] p-0.5 flex items-center">
                    <div className="w-2.5 h-full bg-stone-400 rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* Header: Continuous Learning Pathway */}
              <div className="mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold">
                  STEP-BY-STEP ROADMAP
                </span>
                <h3 className="text-sm font-black text-white">
                  Your Continuous Learning Pathway
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  ধারাবাহিক রোডম্যাপ ও জাপানিজ দক্ষতা মূল্যায়ন
                </p>
              </div>

              {/* Vertical Milestone Pathway Timeline */}
              <div className="relative pl-6 space-y-4 mb-3 flex-1 overflow-hidden">
                {/* Vertical Timeline Guide Track */}
                <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-gradient-to-b from-emerald-500 via-red-500 to-stone-800" />

                {/* Milestone 1: Completed */}
                <div className="relative p-3 rounded-2xl bg-[#121322] border border-emerald-500/30">
                  <div className="absolute -left-[23px] top-4 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0b0c16] flex items-center justify-center text-black">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                      MILESTONE 01 • COMPLETED
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">১০০%</span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-100 mt-1">
                    Kana Mastery: Hiragana & Katakana
                  </h4>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    অক্ষরমালা, ডাকুরন ও সঠিক উচ্চারণ আয়ত্ত
                  </p>
                </div>

                {/* Milestone 2: Active (Minna no Nihongo Lessons 01-25) */}
                <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-[#16172a] to-[#121324] border border-red-500/50 shadow-lg shadow-red-950/20">
                  <div className="absolute -left-[23px] top-4 w-4 h-4 rounded-full bg-red-500 border-2 border-[#0b0c16] animate-pulse" />
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">
                      MILESTONE 02 • ACTIVE IN PROGRESS
                    </span>
                    <span className="text-[10px] text-red-400 font-bold">Lesson 11</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">
                    Minna no Nihongo N5 Master: Lessons 01 to 25
                  </h4>
                  <p className="text-[10px] text-stone-300 mt-1 leading-relaxed">
                    মূল পাঠ্যসূচি, ব্যাকরণ প্যাটার্ন ও বাংলা বাস্তব উদাহরণ
                  </p>

                  {/* Primary Crimson Action Button with High-Quality Bengali Subtext */}
                  <div className="mt-3 pt-2.5 border-t border-stone-800">
                    <button
                      type="button"
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-600/30"
                    >
                      <span>Continue Lesson 11</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-[10px] text-center text-stone-400 mt-1.5 font-medium">
                      প্রগতিশীল শিখনের জন্য এই ধাপে প্রবেশ করুন
                    </p>
                  </div>
                </div>

                {/* Milestone 3: Locked */}
                <div className="relative p-3 rounded-2xl bg-[#0f101d] border border-stone-800/80 opacity-70">
                  <div className="absolute -left-[23px] top-4 w-4 h-4 rounded-full bg-stone-800 border-2 border-[#0b0c16] flex items-center justify-center">
                    <Lock className="w-2.5 h-2.5 text-stone-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 font-semibold">
                      MILESTONE 03 • LOCKED
                    </span>
                    <Lock className="w-3 h-3 text-stone-500" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-300 mt-1">
                    Tokyo Baito Dialogue & Work Readiness
                  </h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    জাপানে পার্ট-টাইম কাজ ও ইন্টারভিউ প্রস্তুতি
                  </p>
                </div>
              </div>

              {/* Bottom Pathway Progress Indicator */}
              <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span className="text-[11px] font-bold text-stone-200">৭ দিনের রিভিশন স্ট্রিক</span>
                </div>
                <span className="text-[11px] font-mono text-amber-400 font-bold">+২৫০ XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCREEN 3: PREMIUM TIER / ENROLLMENT (Right Device)                        */}
        {/* ========================================================================= */}
        <div className="w-full max-w-[360px] sm:max-w-[380px] shrink-0 relative group">
          <div className="text-center mb-3">
            <span className="text-[11px] font-mono tracking-widest text-stone-400 uppercase font-semibold">
              Screen 03 • Premium Tier & Enrollment
            </span>
          </div>

          <div className="relative rounded-[48px] p-3.5 bg-gradient-to-b from-stone-700 via-stone-850 to-stone-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.12)] border border-stone-700/60 ring-1 ring-black">
            {/* Notch */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800" />
            </div>

            {/* Inner Screen */}
            <div className="relative rounded-[36px] bg-[#0c0d18] text-stone-100 overflow-hidden border border-stone-800/80 min-h-[680px] flex flex-col justify-between p-5 pt-9">
              {/* Glass Reflection */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-white/[0.04] to-transparent pointer-events-none rounded-tr-[36px]" />

              {/* Status Bar */}
              <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 mb-3 px-1">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <div className="w-4 h-2 border border-stone-400 rounded-[2px] p-0.5 flex items-center">
                    <div className="w-2.5 h-full bg-stone-400 rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* Plan Switch Header */}
              <div className="mb-3 text-center">
                <span className="text-[9px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  AFFORDABLE JAPAN READINESS
                </span>
                <h3 className="text-sm font-black text-white">
                  Join N5 Pro Lifetime Batch
                </h3>
              </div>

              {/* Tier Comparison Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-900/80 border border-stone-800 rounded-xl mb-3 text-[10px] font-bold">
                <button
                  type="button"
                  className="flex-1 py-1 text-center text-stone-400 rounded-lg"
                >
                  Free Starter
                </button>
                <button
                  type="button"
                  className="flex-1 py-1 text-center bg-gradient-to-r from-red-600 to-amber-500 text-white rounded-lg shadow-xs"
                >
                  N5 Pro Lifetime ✨
                </button>
              </div>

              {/* Prominent N5 Pro Lifetime Card with Gold-Leaf & Washi Texture Accents */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#1c1926] via-[#141525] to-[#10111e] border-2 border-amber-500/40 shadow-xl shadow-amber-950/20 mb-3 relative overflow-hidden">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-[9px] font-bold">
                      PRO LIFETIME BATCH
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1">
                      Full JLPT N5 + Tokyo Baito
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-amber-300 font-mono">৳৪৯৯</span>
                    <span className="text-[9px] text-stone-400 line-through block">৳১২৫০</span>
                  </div>
                </div>

                {/* Key Features List with Elegant Checkmarks */}
                <div className="space-y-1.5 text-[10px] text-stone-200 mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>২৫টি মিন্না নো নিহোঙ্গো লেসন ও পূর্ণাঙ্গ ভিডিও</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>২৪/৭ আনলিমিটেড পার্সোনাল AI সেনসেই সাপোর্ট</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>টোকিও বাইতো কনবিনি জব সিমুলেটর ও সনদ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>অফিশিয়াল ভেরিফায়েড JLPT N5 সার্টিফিকেট</span>
                  </div>
                </div>

                {/* Large Polished Enrollment CTA */}
                <button
                  type="button"
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  <span>Enroll Now - ৳৪৯৯ (bKash/Nagad)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* bKash & Nagad Badges */}
                <div className="mt-2.5 flex items-center justify-center gap-2 text-[9px] text-stone-400">
                  <span>ইনস্ট্যান্ট পেমেন্ট:</span>
                  <span className="px-1.5 py-0.5 rounded bg-pink-500/15 text-pink-400 font-bold border border-pink-500/20">
                    bKash
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-400 font-bold border border-orange-500/20">
                    Nagad
                  </span>
                </div>
              </div>

              {/* Accordion FAQ in Clean Bengali */}
              <div className="space-y-1.5 text-left mb-1">
                {[
                  {
                    q: 'আমি একদম শূন্য থেকে শিখতে পারব কি?',
                    a: 'হ্যাঁ, হিরাগানা ও কাতাকানা থেকে শুরু করে JLPT N5 এর প্রতিটি ধাপ সহজ বাংলায় সাজানো।',
                  },
                  {
                    q: 'একবার পেমেন্ট করলে কি আজীবন অ্যাক্সেস?',
                    a: 'হ্যাঁ, একবার ৳৪৯৯ পেমেন্টে সম্পূর্ণ লাইফটাইম অ্যাক্সেস ও আপডেট পাবেন।',
                  },
                ].map((item, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="p-2 rounded-xl bg-[#121322] border border-stone-800 text-[10px] cursor-pointer"
                    >
                      <div className="flex items-center justify-between font-bold text-stone-300">
                        <span>{item.q}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                      {isOpen && (
                        <p className="mt-1 text-[9px] text-stone-400 leading-normal border-t border-stone-800/60 pt-1">
                          {item.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Support line */}
              <div className="text-center text-[9px] text-stone-400 pt-1">
                হেল্পলাইন: <span className="text-stone-300 font-medium">WhatsApp +880 1886-068128</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
