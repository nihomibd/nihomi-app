import React from 'react';
import { Compass, Lightbulb, Zap, ArrowRight } from 'lucide-react';

interface LessonJourneyClarityBarProps {
  level?: string;
  lessonNumber: number;
  lessonTitle: string;
  activeTab: string;
  summary?: string;
}

export const LessonJourneyClarityBar: React.FC<LessonJourneyClarityBarProps> = ({
  level = 'JLPT N5',
  lessonNumber,
  lessonTitle,
  activeTab,
  summary
}) => {
  // Compute contextual dynamic answers to The Four Questions
  const getTabActionText = () => {
    switch (activeTab) {
      case 'grammar':
        return 'একটি ব্যাকরণ নিয়ম মনোযোগ দিয়ে পড়ুন, উদাহরণ বাক্যের অডিও শুনুন এবং তানাকা সেনসেই থেকে সহজ ব্যাখ্যা নিন।';
      case 'vocab':
        return 'প্রতিটি জাপানি শব্দের উচ্চারণ শুনুন এবং বাস্তব উদাহরণ বাক্যে এর প্রয়োগ দেখুন।';
      case 'kanji':
        return 'স্ট্রোক ডিরেকশন লক্ষ্য করে কাঞ্জির অর্থ ও ওনিওমি/কুনিওমি পাঠ মনে রাখুন।';
      case 'canvas-trace':
        return 'ক্যানভাসে মাউস বা আঙুল দিয়ে সঠিক স্ট্রোক অর্ডারে কাঞ্জি লেখার প্র্যাকটিস করুন।';
      case 'pronunciation':
        return 'নেটিভ স্পিকারের অডিও শুনে মাইক্রোফোনে উচ্চারণ রিপিট করুন (Shadowing)।';
      case 'dialogue':
        return 'বাস্তব টোকিও কথোপকথনের প্রতিটি লাইন শুনুন এবং কাল্পনিক চরিত্রের জায়গায় নিজেকে বসান।';
      case 'practice':
        return 'অনুশীলনীগুলোর সঠিক উত্তর নির্বাচন করে আপনার আত্মবিশ্বাস যাচাই করুন।';
      default:
        return 'ধাপে ধাপে পাঠ্যক্রমটি সম্পন্ন করুন।';
    }
  };

  const getNextStepText = () => {
    switch (activeTab) {
      case 'grammar':
        return 'পরবর্তী ধাপ: নতুন ভোকাবুলারি ও কাঞ্জি অনুশীলন';
      case 'vocab':
        return 'পরবর্তী ধাপ: রিয়েল-লাইফ ডায়ালগ ও অডিও ড্রিল';
      case 'kanji':
        return 'পরবর্তী ধাপ: ক্যানভাসে লেখার অনুশীলন ও কুইজ';
      case 'practice':
        return 'পরবর্তী ধাপ: ১৮০ মার্কসের প্র্যাকটিস টেস্ট ও লেসন সমাপ্তি';
      default:
        return 'পরবর্তী ধাপ: লেসন কুইজ সম্পন্ন করে নতুন পাঠ উন্মুক্ত করা';
    }
  };

  return (
    <div className="bg-[#12121e] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl text-stone-200 space-y-3">
      {/* 4 Questions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. WHERE AM I? */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>১. আমি কোথায় আছি?</span>
          </div>
          <div className="text-xs font-bold text-white truncate">
            {level} &bull; লেসন {lessonNumber}: {lessonTitle}
          </div>
          <div className="text-[10px] text-stone-400 capitalize">
            বর্তমান সেকশন: {activeTab}
          </div>
        </div>

        {/* 2. WHY DOES THIS MATTER? */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>২. কেন গুরুত্বপূর্ণ?</span>
          </div>
          <div className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
            {summary || 'টোকিওর সাবওয়ে, কনবিনি ও কর্মক্ষেত্রে দৈনন্দিন কথা বলার অন্যতম মৌলিক ব্যাকরণ।'}
          </div>
        </div>

        {/* 3. WHAT DO I DO NOW? */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>৩. এখন কী করব?</span>
          </div>
          <div className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
            {getTabActionText()}
          </div>
        </div>

        {/* 4. WHAT HAPPENS NEXT? */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <ArrowRight className="w-3.5 h-3.5" />
            <span>৪. এরপর কী ঘটবে?</span>
          </div>
          <div className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
            {getNextStepText()}
          </div>
        </div>
      </div>
    </div>
  );
};
