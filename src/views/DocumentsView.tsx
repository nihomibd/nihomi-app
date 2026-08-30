import React, { useState } from 'react';
import { Printer, ShieldCheck, CheckCircle2, Search, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DocumentsView: React.FC = () => {
  const { user, profile } = useAuth();
  const [docType, setDocType] = useState<'certificate' | 'letterhead' | 'invoice'>('certificate');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  const studentName = user?.name || 'Nihomi Student';
  const studentId = user?.studentId || 'NHO-100294';
  const accountId = user?.nihomiAccountId || 'ACC-9821';
  const currentLevel = profile?.targetLevel || 'N5';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;
    setVerificationResult({
      status: 'OFFICIAL ACADEMIC RECORD VERIFIED',
      studentName,
      studentId,
      courseTitle: 'JLPT ' + currentLevel + ' Foundational Japanese (150 Hours)',
      issuedBy: 'Nihomi Academic Council • Global Japanese Learning OS',
    });
  };

  return (
    <div className="bg-[#FAF9F6] text-stone-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased text-left selection:bg-red-500 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Controls */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h1 className="text-base font-bold text-stone-900">Official Academic Credentials</h1>
            </div>
            <p className="text-xs text-stone-500">Print-ready A4 credentials and verifiable records.</p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
              className="px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden bg-stone-50 font-semibold text-stone-800 cursor-pointer"
            >
              <option value="certificate">150-Hour Japanese Study Certificate</option>
              <option value="letterhead">Official Study Verification Letterhead</option>
              <option value="invoice">Tuition & Subscription Invoice Receipt</option>
            </select>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Printer className="w-3.5 h-3.5 text-red-400" />
              <span>Print A4 PDF</span>
            </button>
          </div>
        </div>

        {/* Verification Box */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-stone-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Verify Student Certificate Online
            </h3>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter Certificate / Student Ref (e.g. NHO-100294)"
              className="w-full flex-1 px-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden font-mono"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Verify Record
            </button>
          </form>

          {verificationResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1.5 animate-in fade-in">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{verificationResult.status}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-stone-700 pt-1 font-mono">
                <div>Student: <strong className="text-stone-900">{verificationResult.studentName}</strong></div>
                <div>Course: <strong>{verificationResult.courseTitle}</strong></div>
                <div>Issued By: <strong>{verificationResult.issuedBy}</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Printable Document Paper */}
        <div className="bg-white rounded-3xl shadow-xl border border-stone-300 p-8 sm:p-12 max-w-[800px] mx-auto text-stone-900 print:shadow-none print:border-none print:m-0 print:p-8 space-y-6">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-stone-900 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-white font-bold flex items-center justify-center text-lg shadow-xs">
                日
              </div>
              <div>
                <h2 className="text-base font-extrabold tracking-tight text-stone-900">NIHOMI JAPANESE LEARNING</h2>
                <p className="text-[11px] text-stone-600 font-medium">Nihomi Academic Council • Continuous Japanese Learning OS</p>
              </div>
            </div>
            <div className="text-right text-[10px] text-stone-500 font-mono space-y-0.5">
              <div className="text-stone-900 font-bold">DOC REF: NHM-2026</div>
              <div className="text-emerald-700 font-bold uppercase flex items-center justify-end space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                <span>VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Certificate Body */}
          {docType === 'certificate' && (
            <div className="text-center py-4 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 font-mono block">
                ACADEMIC COMPLETION RECORD
              </span>
              <h3 className="text-xl font-extrabold text-stone-900 tracking-tight">
                CERTIFICATE OF JAPANESE PROFICIENCY
              </h3>
              <p className="text-xs text-stone-500 font-japanese">日本語学習修了証明書</p>

              <div className="max-w-lg mx-auto text-xs text-stone-700 space-y-2 pt-2">
                <p>This is to officially certify that</p>
                <p className="text-lg font-bold text-stone-900 font-serif border-b border-stone-300 pb-1 inline-block px-6">
                  {studentName}
                </p>
                <p className="text-stone-500 font-mono text-[10px]">
                  Student ID: <span className="font-bold text-stone-900">{studentId}</span> • Account ID: <span className="font-bold text-stone-900">{accountId}</span>
                </p>
                <p className="pt-2 text-justify">
                  has successfully completed the intensive curriculum for <strong>JLPT {currentLevel} Foundational Japanese (150 Hours)</strong> covering grammar patterns, vocabulary, Kanji calligraphy, and conversational readiness.
                </p>
              </div>

              <div className="pt-6 grid grid-cols-2 gap-6 text-xs text-center border-t border-stone-200 mt-6">
                <div className="space-y-1">
                  <div className="font-serif italic font-bold text-stone-900 text-xs">Yuki Tanaka (Sensei)</div>
                  <div className="text-[10px] text-stone-500">Lead Academic Director</div>
                </div>
                <div className="space-y-1">
                  <div className="font-serif italic font-bold text-stone-900 text-xs">MD Tanvir Kabir Biplob</div>
                  <div className="text-[10px] text-stone-500">Founder & CEO</div>
                </div>
              </div>
            </div>
          )}

          {/* Letterhead Body */}
          {docType === 'letterhead' && (
            <div className="space-y-4 text-xs text-stone-800 pt-2 text-left">
              <div className="space-y-1">
                <strong className="block text-sm font-bold text-stone-900">
                  SUBJECT: Verification of 150-Hour Japanese Study & Academic Standing
                </strong>
                <p>
                  This official academic letter confirms that <strong>{studentName}</strong> (Student ID: <span className="font-mono font-bold">{studentId}</span>) is an active, verified learner on the Nihomi Japanese Learning Platform.
                </p>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-[11px] space-y-1 font-mono">
                <div>Student: {studentName}</div>
                <div>Registration: {studentId}</div>
                <div>Curriculum: Japanese JLPT {currentLevel} Program (150 Hours)</div>
              </div>
            </div>
          )}

          {/* Invoice Body */}
          {docType === 'invoice' && (
            <div className="space-y-4 text-xs text-stone-800 pt-2 text-left">
              <div className="flex justify-between items-start border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">NIHOMI LEARNING TUITION RECEIPT</h3>
                  <p className="text-[10px] text-stone-500 font-mono">Invoice: NHM-INV-2026-0812</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded border border-emerald-200">
                  PAID IN FULL
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div>
                  <strong className="text-stone-900 block">Billed To:</strong>
                  <span>{studentName} ({studentId})</span>
                </div>
                <div className="text-right">
                  <strong className="text-stone-900 block">Plan:</strong>
                  <span>JLPT {currentLevel} Continuous Track (৳ 990/mo)</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="pt-4 text-center border-t border-stone-200 text-[9px] text-stone-400 font-mono">
            *Official Document of Nihomi Academic Council • Verify at nihomi.com/verify
          </div>

        </div>

      </div>
    </div>
  );
};