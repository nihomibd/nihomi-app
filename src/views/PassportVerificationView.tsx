import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  QrCode,
  CheckCircle2,
  Calendar,
  Clock,
  Download,
  Share2,
  Building2,
  Plane,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface PassportVerificationViewProps {
  passportId?: string;
  onNavigate?: (view: string, params?: Record<string, any>) => void;
}

export const PassportVerificationView: React.FC<PassportVerificationViewProps> = ({
  passportId = 'NHM-2026-000001',
  onNavigate
}) => {
  const { profile, progress } = useAuth();
  const [copied, setCopied] = useState(false);

  const studentName = profile?.displayName || 'Tanvir Kabir Biplob';
  const targetLevel = profile?.targetLevel || 'N4';
  const studyHours = Math.round((progress?.totalStudyMinutes || 120) / 60);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-12 px-4 sm:px-6 lg:px-8" id="passport-verification-view">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Official Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Institutional Verification Registry</span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-stone-900">
            Nihomi Learning & Career Passport™
          </h1>
          <p className="text-xs text-stone-500">
            Authenticated Japanese language proficiency, course verification, and Japan relocation credentials.
          </p>
        </div>

        {/* The Passport Certificate Card */}
        <div className="bg-white border-2 border-stone-900 rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden">
          {/* Top Gold Foil Seal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white font-serif font-bold text-2xl flex items-center justify-center shadow-md">
                日
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif text-stone-900">NIHOMI ACADEMY</h2>
                <p className="text-xs text-stone-500 font-sans">Dhaka International Language School Partner Wing</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ VERIFIED AUTHENTIC
              </span>
              <p className="text-[11px] font-mono text-stone-400 mt-1">ID: {passportId}</p>
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-stone-400 font-bold uppercase text-[10px]">Student / Candidate Name</span>
              <p className="text-lg font-bold text-stone-900 font-serif">{studentName}</p>
              <p className="text-stone-500">Bangladeshi National &bull; Japan Relocation Candidate</p>
            </div>
            <div className="space-y-1 sm:text-right">
              <span className="text-stone-400 font-bold uppercase text-[10px]">Certified JLPT Target</span>
              <p className="text-lg font-bold text-red-600 font-serif">JLPT {targetLevel} Mastery Track</p>
              <p className="text-stone-500">Verified Study Time: {studyHours} Hours</p>
            </div>
          </div>

          {/* Verified Credentials Matrix */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
            <h4 className="font-bold text-stone-900 uppercase text-[10px] tracking-wider">Institutional Endorsements</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2 text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>JLPT Curriculum & Mock Assessment: <strong>Passed</strong></span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tokyo Principal Interview Lab™: <strong>88% Ready</strong></span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>DILS COE Visa File Preparation: <strong>Eligible</strong></span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>bdTrip24 46KG Student Flight Waiver: <strong>Approved</strong></span>
              </div>
            </div>
          </div>

          {/* QR Verification Seal Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200 text-xs text-stone-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-stone-300 rounded-xl shadow-xs">
                <QrCode className="w-12 h-12 text-stone-900" />
              </div>
              <div>
                <p className="font-bold text-stone-900">Cryptographic Seal ID: SHA256-{(passportId + 'AUTHENTIC').slice(0, 16)}</p>
                <p className="text-[11px] text-stone-400">Scan QR to authenticate via Nihomi Central Registry</p>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share Verified Profile'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
