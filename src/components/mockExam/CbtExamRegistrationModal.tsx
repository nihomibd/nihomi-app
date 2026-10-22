// src/components/mockExam/CbtExamRegistrationModal.tsx
// NIHOMI CBT EXAM REGISTRATION & OFFICIAL HALL TICKET GENERATOR
// Adhering strictly to Nihomi Brand Guidelines

import React, { useState } from 'react';
import {
  Award,
  Clock,
  ShieldCheck,
  User,
  ArrowRight,
  X,
  FileText,
  Calendar,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { NihomiBrandLogo } from '../brand/NihomiBrandLogo';
import { MockExamSummaryItem } from '../../services/mockExamApi';
import { useAuth } from '../../context/AuthContext';
import { soundEffects } from '../../lib/soundEffects';

interface CbtExamRegistrationModalProps {
  isOpen: boolean;
  exam: MockExamSummaryItem | null;
  onClose: () => void;
  onProceedToExam: (registrationData: {
    candidateName: string;
    candidateNameKana: string;
    registrationNumber: string;
  }) => void;
}

export const CbtExamRegistrationModal: React.FC<CbtExamRegistrationModalProps> = ({
  isOpen,
  exam,
  onClose,
  onProceedToExam
}) => {
  const { user } = useAuth();

  const [candidateName, setCandidateName] = useState(user?.name || 'MD TANVIR HOSSAIN');
  const [candidateNameKana, setCandidateNameKana] = useState('エムディ タンヴィル ホセイン');
  const [agreedToRules, setAgreedToRules] = useState(true);

  if (!isOpen || !exam) return null;

  // Generate deterministic/consistent registration number for this candidate session
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const registrationNumber = `NHM-JLPT-${exam.level}-2026-${randomSuffix}`;

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToRules) return;
    soundEffects.playButtonTap();
    onProceedToExam({
      candidateName,
      candidateNameKana,
      registrationNumber
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#141726] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <NihomiBrandLogo variant="emblem" theme="dark" size={38} />
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
              NIHOMI COMPUTER-BASED TESTING (CBT)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              JLPT {exam.level} / NAT-TEST অফিসিয়াল রেজিস্ট্রেশন ও প্রবেশপত্র
            </h2>
          </div>
        </div>

        {/* Hall Ticket Card (受験票) */}
        <div className="p-5 rounded-2xl bg-[#0A0A12] border border-amber-500/30 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold rounded-bl-xl border-l border-b border-amber-500/30">
            CBT 受験票 (HALL TICKET)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-stone-400 block text-[11px]">পরীক্ষার নাম (Exam):</span>
              <strong className="text-white text-sm">{exam.title}</strong>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">রেজিস্ট্রেশন নম্বর (Roll No):</span>
              <span className="font-mono font-bold text-amber-300 text-sm">{registrationNumber}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">সময়সীমা (Time Constraints):</span>
              <span className="text-stone-200">{exam.totalTimeMinutes} মিনিট (কঠোর টাইমার নিয়ন্ত্রিত)</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">পরীক্ষার কেন্দ্র (Test Venue):</span>
              <span className="text-stone-200">নিহোমি ভার্চুয়াল CBT হলরুম (অনলাইন)</span>
            </div>
          </div>
        </div>

        {/* Candidate Information Form */}
        <form onSubmit={handleSubmitRegistration} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-stone-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>শিক্ষার্থীর পুরো নাম (ইংরেজি / Romaji — সার্টিফিকেটে প্রদর্শিত হবে):</span>
            </label>
            <input
              type="text"
              required
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-white/10 text-white font-medium focus:border-red-500 outline-none transition"
              placeholder="e.g. MD TANVIR HOSSAIN"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-stone-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E45147]" />
              <span>কাতাকানা নাম (Japanese Katakana — ঐচ্ছিক / স্বয়ংক্রিয়):</span>
            </label>
            <input
              type="text"
              value={candidateNameKana}
              onChange={(e) => setCandidateNameKana(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-white/10 text-stone-200 font-japanese focus:border-red-500 outline-none transition"
              placeholder="e.g. エムディ タンヴィル ホセイン"
            />
          </div>

          {/* Exam Rules & Conduct Checklist */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-stone-300">
            <span className="font-bold text-white block">সিবিটি পরীক্ষার আচরণবিধি:</span>
            <ul className="space-y-1 list-disc list-inside text-[11px]">
              <li>প্রতিটি সেকশনে নির্দিষ্ট সময় বরাদ্দ থাকবে; সময় শেষ হওয়ামাত্র স্বয়ংক্রিয়ভাবে পরবর্তী সেকশনে চলে যাবে।</li>
              <li>লিসেনিং সেকশনে অডিও সংলাপ বাস্তব পরীক্ষার মতো একবারই প্লে হবে।</li>
              <li>পরীক্ষা সাবমিট করার সাথে সাথে অফিশিয়াল মার্কশিট এবং উত্তীর্ণ হলে ডাউনলোডযোগ্য A4 সার্টিফিকেট তৈরি হবে।</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="cbt-agree-check"
              checked={agreedToRules}
              onChange={(e) => setAgreedToRules(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="cbt-agree-check" className="text-stone-300 cursor-pointer text-[11px]">
              আমি পরীক্ষার নিয়মাবলী পড়েছি এবং রিয়েল টাইম-কনস্ট্রেইন্ট মেনে সিবিটি পরীক্ষায় অংশ নিতে সম্মত।
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-stone-400 hover:text-white font-bold transition cursor-pointer"
            >
              বাতিল করুন
            </button>
            <button
              type="submit"
              disabled={!agreedToRules || !candidateName.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E45147] to-[#F59E0B] hover:brightness-110 text-white font-black shadow-lg shadow-red-600/30 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <span>পরীক্ষা কক্ষে প্রবেশ করুন (Enter CBT Exam)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CbtExamRegistrationModal;
