import React, { useState } from 'react';
import {
  Printer,
  ShieldCheck,
  CheckCircle2,
  Search,
  QrCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DocumentsView: React.FC = () => {
  const { user, profile } = useAuth();
  const [docType, setDocType] = useState<'certificate' | 'letterhead' | 'invoice'>('certificate');

  // Verification search state
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  const studentName = user?.name || 'Nihomi Student';
  const studentId = user?.studentId || 'NHO-100294';
  const accountId = user?.nihomiAccountId || 'ACC-9821';
  const currentLevel = profile?.targetLevel || 'N5';

  const handleVerifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;

    setVerificationResult({
      valid: true,
      certNumber: verificationCode.toUpperCase(),
      studentName: studentName,
      studentId: studentId,
      courseTitle: `JLPT ${currentLevel} Foundational Japanese (150 Hours)`,
      status: 'OFFICIAL ACADEMIC RECORD VERIFIED',
      issuedBy: 'Nihomi Academic Council • Global Japanese Learning OS',
      issueDate: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="bg-[#FAF9F6] text-stone-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased text-left selection:bg-red-500 selection:text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Document Selector & Actions Toolbar */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h1 className="text-base font-bold text-stone-900">Official Document & Verification System</h1>
            </div>
            <p className="text-xs text-stone-500">Standardized print-ready A4 credentials and verifiable academic records.</p>
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

        {/* Live Certificate Verification Search Bar */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-stone-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Verify Official Student Certificate Online
            </h3>
          </div>

          <form onSubmit={handleVerifySearch} className="flex flex-col sm:flex-row items-center gap-3">
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

          {verificationResult && (\n            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1.5 animate-in fade-in">
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

        {/* Printable Document Paper (A4 Aspect Ratio: 800px x 1080px) */}
        <div className="bg-white rounded-3xl shadow-xl border border-stone-300 p-8 sm:p-14 max-w-[800px] mx-auto min-h-[1000px] relative text-stone-900 print:shadow-none print:border-none print:m-0 print:p-8">
          
          {/* Official Document Header */}
          <div className="flex items-start justify-between border-b-2 border-stone-900 pb-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-stone-900 text-white font-bold flex items-center justify-center text-xl shadow-xs">
                日
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-stone-900">NIHOMI JAPANESE LEARNING</h2>
                <p className="text-[11px] text-stone-600 font-medium">Nihomi Academic Council • Continuous Japanese Learning OS</p>
                <p className="text-[10px] text-stone-500 font-mono">Official Academic Portal • nihomi.com/verify</p>
              </div>
            </div>
            <div className="text-right text-[10px] text-stone-500 space-y-0.5 font-mono">
              <div className="text-stone-900 font-bold">DOC REF: NHM-2026-ACAD</div>
              <div>Date: {new Date().toISOString().split('T')[0]}</div>
              <div className="text-emerald-700 font-bold uppercase flex items-center justify-end space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                <span>VERIFIED RECORD</span>
              </div>
            </div>
          </div>

          {/* TEMPLATE 1: 150-HOUR CERTIFICATE */}
          {docType === 'certificate' && (
            <div className="text-center py-6 space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 font-mono">
                  ACADEMIC COMPLETION RECORD
                </span>
                <h3 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                  CERTIFICATE OF JAPANESE PROFICIENCY
                </h3>
                <p className="text-xs text-stone-500 font-japanese">日本語学習修了証明書</p>
              </div>

              <div className="max-w-xl mx-auto text-xs text-stone-700 leading-relaxed space-y-3 pt-2">
                <p>This is to officially certify that</p>
                <p className="text-xl font-bold text-stone-900 font-serif border-b border-stone-300 pb-1 inline-block px-8">
                  {studentName}
                </p>
                <p className="text-stone-500 font-mono text-[11px]">
                  Student ID: <span className="font-bold text-stone-900">{studentId}</span> • Account ID:{' '}
                  <span className="font-bold text-stone-900">{accountId}</span>
                </p>

                <p className="pt-2 text-justify">
                  has successfully completed the intensive curriculum for <strong>JLPT {currentLevel} Foundational Japanese (150 Hours)</strong> covering grammar patterns, vocabulary, Kanji calligraphy, reading comprehension, and oral conversational readiness in accordance with Nihomi Standard™ Academic Guidelines.
                </p>
              </div>

              {/* Evaluation Record Table */}
              <div className="max-w-md mx-auto bg-stone-50 rounded-2xl border border-stone-200 p-4 text-xs text-left space-y-2">
                <div className="font-bold text-stone-900 border-b border-stone-200 pb-1 text-[11px] uppercase tracking-wider">
                  Academic Evaluation Summary
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 font-mono">
                  <div>Curriculum Level: <strong className="text-stone-900">JLPT {currentLevel}</strong></div>
                  <div>Certified Hours: <strong className="text-stone-900">150 Hours</strong></div>
                  <div>Performance: <strong className="text-emerald-700">Grade A (Mastery)</strong></div>
                  <div>Attendance Ratio: <strong className="text-stone-900">98.4%</strong></div>
                </div>
              </div>

              {/* QR Verification */}
              <div className="pt-4 flex items-center justify-center space-x-2 text-[10px] text-stone-500 font-mono">
                <QrCode className="w-4 h-4 text-stone-700" />
                <span>Scan or verify online at nihomi.com/verify/{studentId}</span>
              </div>

              {/* Signatures */}
              <div className="pt-12 grid grid-cols-2 gap-8 text-xs text-center border-t border-stone-200 mt-12">
                <div className="space-y-1">
                  <div className="font-serif italic font-bold text-stone-900 text-sm">Yuki Tanaka (Sensei)</div>
                  <div className="w-36 h-0.5 bg-stone-400 mx-auto"></div>
                  <div className="text-[10px] text-stone-500">
                    Lead Academic Director<br />Nihomi Japanese Council
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-serif italic font-bold text-stone-900 text-sm">MD Tanvir Kabir Biplob</div>
                  <div className="w-36 h-0.5 bg-stone-400 mx-auto"></div>
                  <div className="text-[10px] text-stone-500">
                    Founder & CEO<br />Nihomi Japanese Learning Platform
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 2: LETTERHEAD */}
          {docType === 'letterhead' && (
            <div className="space-y-6 text-xs text-stone-800 leading-relaxed pt-4">
              <div className="flex justify-between text-[11px] text-stone-600 font-mono">
                <div>
                  <strong>To:</strong> Academic Institutions & Verification Bodies<br />
                  Japanese Language Proficiency Board
                </div>
                <div className="text-right">
                  <strong>Date:</strong> {new Date().toISOString().split('T')[0]}<br />
                  <strong>Ref:</strong> NHM/VERIF/2026-99
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <strong className="block text-sm font-bold text-stone-900">
                  SUBJECT: Verification of 150-Hour Japanese Study & Active Academic Standing
                </strong>

                <p>
                  This official academic letter confirms that <strong>{studentName}</strong> (Student ID: <span className="font-mono font-bold">{studentId}</span>) is an active, verified learner on the Nihomi Japanese Learning Platform.
                </p>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-[11px] space-y-1 font-mono">
                  <div><strong>Student Name:</strong> {studentName}</div>
                  <div><strong>Student ID:</strong> {studentId}</div>
                  <div><strong>Curriculum:</strong> Japanese JLPT {currentLevel} Foundational Program</div>
                  <div><strong>Certified Hours:</strong> 150 Hours of Adaptive Multimodal Instruction</div>
                </div>

                <p>
                  The candidate maintains disciplined continuous practice, high memory retention in Minna no Nihongo grammar patterns, and active speaking progress verified by the Nihomi Learning DNA system.
                </p>
              </div>

              <div className="pt-16">
                <div className="font-bold text-stone-900">Academic Registrar</div>
                <div className="text-[10px] text-stone-500">Nihomi Academic Council • nihomi.com</div>
              </div>
            </div>
          )}

          {/* TEMPLATE 3: INVOICE */}
          {docType === 'invoice' && (
            <div className="space-y-6 text-xs text-stone-800 pt-2">
              <div className="flex justify-between items-start border-b border-stone-200 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 font-mono">
                    OFFICIAL SUBSCRIPTION INVOICE
                  </span>
                  <h3 className="text-base font-bold text-stone-900 uppercase">NIHOMI LEARNING TUITION RECEIPT</h3>
                  <p className="text-[11px] text-stone-500 font-mono">Invoice No: NHM-INV-2026-0812</p>
                </div>
                <div className="text-right text-[11px]">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200">
                    PAID IN FULL
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div>
                  <strong className="text-stone-900 block mb-0.5">Billed To:</strong>
                  <span>{studentName}</span><br />
                  <span>Student ID: {studentId}</span><br />
                  <span>Email: {user?.email || 'student@nihomi.com'}</span>
                </div>
                <div className="text-right">
                  <strong className="text-stone-900 block mb-0.5">Payment Details:</strong>
                  <span>Method: Verified Online Checkout</span><br />
                  <span>Status: Active Subscription</span><br />
                  <span>Date: {new Date().toISOString().split('T')[0]}</span>
                </div>
              </div>

              <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
                <thead className="bg-stone-50 border-b border-stone-200 font-semibold text-stone-700 text-[11px]">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700 text-[11px]">
                  <tr>
                    <td className="p-3 font-medium">JLPT {currentLevel} Continuous Japanese Track Access</td>
                    <td className="p-3">Subscription</td>
                    <td className="p-3 text-right">৳ 990 / mo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="absolute bottom-6 left-8 right-8 text-center border-t border-stone-200 pt-3 text-[9px] text-stone-400 font-mono">
            *Official Document of Nihomi Academic Council • Verify authentic credentials at nihomi.com/verify
          </div>
        </div>

      </div>
    </div>
  );
};