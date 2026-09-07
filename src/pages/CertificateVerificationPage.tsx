import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ArrowLeft,
  Search,
  ExternalLink,
  Lock,
  Building,
  Calendar,
  User,
  Sparkles,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Gift
} from 'lucide-react';
import { SpeakingReadinessCertificate } from '../types';
import { updatePageMetaTags, injectJsonLd, getCertificateJsonLd } from '../lib/seo';

export interface CertificateVerificationPageProps {
  initialCertId?: string;
  onNavigate?: (view: string) => void;
}

export const CertificateVerificationPage: React.FC<CertificateVerificationPageProps> = ({
  initialCertId,
  onNavigate
}) => {
  const [certIdInput, setCertIdInput] = useState<string>(initialCertId || '');
  const [certificate, setCertificate] = useState<SpeakingReadinessCertificate | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    tamperDetected?: boolean;
    errorBn?: string;
    verifiedAt?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-verify if initialCertId or URL query param provided
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryCert = urlParams.get('certId') || urlParams.get('id');
    const targetId = initialCertId || queryCert;

    if (targetId) {
      setCertIdInput(targetId);
      performVerification(targetId);
    }
  }, [initialCertId]);

  const performVerification = async (certId: string) => {
    const cleanId = certId.trim();
    if (!cleanId) return;

    setIsLoading(true);
    setVerificationResult(null);
    setCertificate(null);

    try {
      // Try direct public endpoint first, then fallback to /api/voice/public
      let res = await fetch(`/api/public/verify-certificate/${encodeURIComponent(cleanId)}`);
      if (!res.ok) {
        res = await fetch(`/api/voice/public/verify-certificate/${encodeURIComponent(cleanId)}`);
      }

      const data = await res.json();
      if (data.success && data.valid && data.certificate) {
        setCertificate(data.certificate);
        setVerificationResult({
          valid: true,
          verifiedAt: data.verifiedAt || new Date().toISOString()
        });

        // Dynamic OpenGraph SEO & JSON-LD injection
        const cert = data.certificate;
        updatePageMetaTags({
          title: `${cert.studentName}'s JLPT ${cert.certifiedLevel} Speaking Certificate — NIHOMI`,
          description: `Official Verified Speaking & Readiness Certificate for ${cert.studentName} (ID: ${cert.studentId}). Verified Score: ${cert.overallReadinessIndex}/100. Cryptographic Seal: ${cert.verificationHash.slice(0, 16)}...`,
          ogTitle: `🎓 ${cert.studentName} achieved JLPT ${cert.certifiedLevel} Speaking Certificate!`,
          ogDescription: `Verified Japanese language credential with readiness score ${cert.overallReadinessIndex}/100. Start learning Japanese with AI on NIHOMI.COM.`,
          ogImage: 'https://nihomi.com/assets/og-nihomi-banner.png',
          ogUrl: `https://nihomi.com/verify?certId=${encodeURIComponent(cert.certificateId)}`
        });

        injectJsonLd('cert-jsonld', getCertificateJsonLd({
          certificateId: cert.certificateId,
          studentName: cert.studentName,
          studentId: cert.studentId,
          level: cert.certifiedLevel,
          issuedAt: cert.issueDate,
          verificationUrl: `https://nihomi.com/verify?certId=${encodeURIComponent(cert.certificateId)}`
        }));
      } else {
        setVerificationResult({
          valid: false,
          tamperDetected: data.tamperDetected,
          errorBn: data.errorBn || 'সার্টিফিকেটটি খুঁজে পাওয়া যায়নি বা টেম্পার করা হয়েছে।'
        });
      }
    } catch (err: any) {
      setVerificationResult({
        valid: false,
        errorBn: 'সার্ভার সংযোগে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!certificate) return;
    const url = `${window.location.origin}/verify?certId=${encodeURIComponent(certificate.certificateId)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Brand Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('landing')}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold tracking-widest text-lg font-japanese">
                  NIHOMI (にほみ)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                  Official Public Registry
                </span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                টোকিও জাপানিজ স্পিকিং ও পিচ অ্যাকসেন্ট সনদ যাচাইকরণ পোর্টাল
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              SHA-256 Cryptographically Sealed
            </span>
          </div>
        </div>

        {/* Certificate Lookup Input */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              performVerification(certIdInput);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={certIdInput}
                onChange={(e) => setCertIdInput(e.target.value)}
                placeholder="সার্টিফিকেট আইডি লিখুন (যেমন: CERT-TOKYO-2026-N5-8832)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-slate-100 text-sm focus:outline-none focus:border-red-500 font-mono placeholder:text-slate-600"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !certIdInput.trim()}
              className="px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  যাচাই করা হচ্ছে...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  সনদ যাচাই করুন
                </>
              )}
            </button>
          </form>
        </div>

        {/* Verification Result Notification */}
        {verificationResult && !verificationResult.valid && (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 space-y-2">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white">সনদ যাচাই ব্যর্থ হয়েছে</h3>
                <p className="text-xs text-red-300 mt-0.5">{verificationResult.errorBn}</p>
              </div>
            </div>
          </div>
        )}

        {/* Verified Institutional Certificate Card */}
        {verificationResult?.valid && certificate && (
          <div className="space-y-6">
            {/* Verification Success Pill */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 block">
                    প্রাতিষ্ঠানিকভাবে বৈধ সনদ (Verified Authentic)
                  </span>
                  <span className="text-xs text-emerald-200/80">
                    যাচাইয়ের সময়: {new Date(verificationResult.verifiedAt || '').toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-200 text-xs font-semibold rounded-lg border border-emerald-500/30 transition flex items-center gap-2 self-start sm:self-auto"
              >
                <Printer className="w-4 h-4" /> প্রিন্ট / PDF সংরক্ষণ
              </button>
            </div>

            {/* Social Share & Verification Card Bridge */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    সোশ্যাল মিডিয়াতে ভেরিফাইড সনদ শেয়ার করুন (Share Credential)
                  </span>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? 'লিংক কপি হয়েছে!' : 'পাবলিক লিংক কপি করুন'}</span>
                </button>
              </div>

              {/* Share Destinations Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : 'https://nihomi.com'}/verify?certId=${certificate.certificateId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  <span>Facebook</span>
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : 'https://nihomi.com'}/verify?certId=${certificate.certificateId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#0077b5] hover:bg-[#006097] text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  <span>LinkedIn</span>
                </a>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🎓 ${certificate.studentName}'s JLPT ${certificate.certifiedLevel} Speaking Certificate verified on NIHOMI: ${typeof window !== 'undefined' ? window.location.origin : 'https://nihomi.com'}/verify?certId=${certificate.certificateId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🎓 Verified JLPT ${certificate.certifiedLevel} Speaking Certificate for ${certificate.studentName} on NIHOMI Japan Readiness OS!`)}&url=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : 'https://nihomi.com'}/verify?certId=${certificate.certificateId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer border border-slate-800"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  <span>X / Twitter</span>
                </a>
              </div>

              {/* Ads & Onboarding Hook Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-950/40 via-slate-950 to-amber-950/30 border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-bold flex-shrink-0">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">জাপানিজ ভাষা শেখা শুরু করুন সম্পূর্ণ ফ্রিতে</span>
                    <span className="text-slate-400 text-[11px]">গুগল দিয়ে ১ ক্লিকে শুরু করুন (ফ্রি ৫০ কয়েন ও ১০০ AI ক্রেডিট সহ)</span>
                  </div>
                </div>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('landing')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition shadow-sm text-xs cursor-pointer flex-shrink-0"
                  >
                    ১ ক্লিকে শুরু করুন →
                  </button>
                )}
              </div>
            </div>

            {/* Official Certificate Visual Frame */}
            <div
              id="nihomi-official-certificate"
              className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl space-y-8"
            >
              {/* Watermark Ornament */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 text-8xl font-japanese font-black text-amber-300 select-none">
                にほみ
              </div>

              {/* Certificate Header */}
              <div className="text-center space-y-3 relative z-10 border-b border-slate-800 pb-8">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg shadow-amber-500/10">
                  <Award className="w-8 h-8" />
                </div>
                <h2 className="text-xs uppercase tracking-widest text-amber-400 font-semibold font-mono">
                  NIHOMI TOKYO JAPANESE LANGUAGE CO-ORDINATION
                </h2>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Certificate of Tokyo Prosody & Speaking Readiness
                </h3>
                <p className="text-sm font-japanese text-slate-300">
                  東京共通語アクセント・自然発話プロソディ習熟度認定証
                </p>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 block">শিক্ষার্থীর নাম</span>
                  <span className="text-lg font-bold text-white mt-1 block">
                    {certificate.studentName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ID: {certificate.studentId}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 block">সনদায়িত স্তর (JLPT)</span>
                  <span className="text-lg font-bold text-cyan-400 mt-1 block">
                    {certificate.certifiedLevel} Speaking Standard
                  </span>
                  <span className="text-[10px] text-slate-500">
                    CEFR: {certificate.overallReadinessIndex >= 85 ? 'B2' : 'B1'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 block">রেডিনেস গ্রেড</span>
                  <span className="text-lg font-bold text-emerald-400 mt-1 block">
                    গ্রেড {certificate.readinessGrade} ({certificate.overallReadinessIndex}/100)
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {certificate.evaluationsSampledCount} টি অডিও স্যাম্পল
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 block">সনদ ইস্যুর তারিখ</span>
                  <span className="text-sm font-bold text-slate-200 mt-1 block font-mono">
                    {new Date(certificate.issueDate).toLocaleDateString('en-GB')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono truncate block">
                    {certificate.certificateId}
                  </span>
                </div>
              </div>

              {/* Sub-Scores Breakdown */}
              <div className="space-y-3 relative z-10">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  অ্যাকোস্টিক ও প্রসোডি সাব-স্কোর বিশ্লেষণ
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block">পিচ নির্ভুলতা</span>
                    <span className="text-xl font-bold text-white mt-1 block">
                      {certificate.subScores.pitchAccuracy}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block">মোরা আইসোক্রনি</span>
                    <span className="text-xl font-bold text-cyan-400 mt-1 block">
                      {certificate.subScores.moraIsochrony}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block">ইনটোনেশন রিসেট</span>
                    <span className="text-xl font-bold text-purple-400 mt-1 block">
                      {certificate.subScores.intonationResetAccuracy}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block">স্ট্রেস সাপ্রেশন</span>
                    <span className="text-xl font-bold text-emerald-400 mt-1 block">
                      {certificate.subScores.stressSuppressionScore}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block">প্যাসিং ও রিদম</span>
                    <span className="text-xl font-bold text-amber-400 mt-1 block">
                      {certificate.subScores.conversationalPacing}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary and Strengths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                    প্রধান দক্ষতা ও অর্জন (Key Strengths)
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {certificate.strengthsBn.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                    প্রাতিষ্ঠানিক মূল্যায়ন সারাংশ (Institutional Summary)
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {certificate.institutionalSummaryBn}
                  </p>
                  <p className="text-[11px] text-slate-500 italic mt-1 leading-relaxed">
                    "{certificate.institutionalSummaryEn}"
                  </p>
                </div>
              </div>

              {/* Cryptographic Seal Footer */}
              <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono relative z-10">
                <div>
                  <span>Cryptographic Hash: </span>
                  <span className="text-slate-300">{certificate.verificationHash}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>NIHOMI REGISTRY AUTHORITY</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
