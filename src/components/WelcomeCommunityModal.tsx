import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  MessageCircle,
  Coins,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { trackNihomiEvent } from '../utils/analytics';

interface WelcomeCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartLesson1: () => void;
  studentName?: string;
  studentId?: string;
}

export const WelcomeCommunityModal: React.FC<WelcomeCommunityModalProps> = ({
  isOpen,
  onClose,
  onStartLesson1,
  studentName,
  studentId
}) => {
  const { user, profile } = useAuth();
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const displayName = studentName || profile?.displayName || user?.displayName || user?.name || 'শিক্ষার্থী';
  const displayId = studentId || profile?.nihomiAccountId || user?.studentId || 'NHO-100294';
  const whatsappInviteLink = 'https://chat.whatsapp.com/nihomi-n5-cohort-dhaka';

  const handleCopyWhatsappLink = async () => {
    try {
      await navigator.clipboard.writeText(whatsappInviteLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleJoinWhatsApp = () => {
    trackNihomiEvent('landing_page_view', {
      source: 'whatsapp_cohort_join_click'
    });
    window.open(whatsappInviteLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="welcome-community-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="welcome-community-modal-card"
        className="relative w-full max-w-lg bg-white dark:bg-[#12121a] rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden text-left"
      >
        {/* Close Button */}
        <button
          id="btn-close-welcome-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors z-10 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Japanese Festive Header Banner */}
        <div className="bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-amber-400/20 rounded-full blur-lg pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>নিহোমি স্টুডেন্ট অনবোর্ডিং সফল</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              স্বাগতম, {displayName} সান!
            </h2>
            <p className="text-sm text-rose-100 mt-1 font-medium">
              ようこそ！ আপনার জাপানি ভাষা শেখার স্বপ্নযাত্রা আজ থেকেই শুরু।
            </p>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Digital Student Identity Card Preview */}
          <div
            id="student-digital-card-preview"
            className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                日
              </div>
              <div>
                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  ডিজিটাল শিক্ষার্থী আইডি
                </div>
                <div className="text-sm font-bold text-stone-900 dark:text-white font-mono">
                  {displayId}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>৭ দিনের প্রো ট্রায়াল অ্যাক্টিভ</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-lg text-xs font-bold border border-amber-300 dark:border-amber-800/60">
                <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>+৫০ কয়েন বোনাস</span>
              </div>
            </div>
          </div>

          {/* Official WhatsApp Study Group Bridge */}
          <div
            id="whatsapp-study-group-card"
            className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800 space-y-3"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  <span>অফিসিয়াল স্টুডেন্ট নেটওয়ার্ক</span>
                </div>
                <h4 className="text-base font-bold text-stone-900 dark:text-white">
                  Nihomi Official Student Cohort (Powered by bdTrip24)
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  অন্যান্য বাংলাদেশি শিক্ষার্থীদের সাথে দৈনিক প্র্যাকটিস, লেকচার নোটস, কুইজ সল্যুশন এবং জাপানের ভিসা সহায়তার লাইভ আপডেট পান।
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                id="btn-join-whatsapp-group"
                onClick={handleJoinWhatsApp}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>গ্রুপে যুক্ত হোন (Join Cohort)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>

              <button
                id="btn-copy-whatsapp-link"
                onClick={handleCopyWhatsappLink}
                className="py-2.5 px-3 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                title="Copy WhatsApp invite link"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>লিংক কপি</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Primary Action Button: Start Lesson 1 */}
          <div className="space-y-2 pt-2">
            <button
              id="btn-start-lesson-1-direct"
              onClick={() => {
                trackNihomiEvent('first_lesson_started', {
                  lessonId: 'n5-l1',
                  title: 'Lesson 1 (はじめまして)'
                });
                onClose();
                onStartLesson1();
              }}
              className="w-full py-3.5 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-red-600/20 hover:shadow-xl transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
            >
              <GraduationCap className="w-5 h-5" />
              <span>১ম অধ্যায় শুরু করুন (Start Lesson 1)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-stone-500 dark:text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>bdTrip24 Ecosystem Verified • অনুমোদিত জাপানিজ লার্নিং প্ল্যাটফর্ম</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
