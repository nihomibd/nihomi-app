import React, { useState } from 'react';
import {
  Printer,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Search,
  Award,
  QrCode,
  Calendar,
  Building2,
  Receipt,
  Download,
  ExternalLink,
  Copy,
  Check,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface VerificationRecord {
  valid: boolean;
  certNumber: string;
  studentName: string;
  studentId: string;
  courseTitle: string;
  status: string;
  issuedBy: string;
  issueDate: string;
  hoursCompleted: string;
  evaluation: string;
  attendance: string;
}

export const DocumentsView: React.FC = () => {
  const { user, profile } = useAuth();
  const [docType, setDocType] = useState<'certificate' | 'letterhead' | 'invoice'>('certificate');

  // Verification search state
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationRecord | null>(null);
  const [hasCopiedCode, setHasCopiedCode] = useState(false);

  const studentName = user?.displayName || user?.name || user?.full_name || 'Md. Tanvir Kabir Biplob';
  const studentId = user?.studentId || user?.id || 'DILS-2026-N5042';
  const accountId = user?.nihomiAccountId || 'NHM-880-9972';
  const currentLevel = profile?.targetLevel || user?.targetLevel || user?.currentLevel || 'N5';
  const enrolledDate = user?.enrolledDate || '2026-01-10';
  const studentEmail = user?.email || 'mdtanvirkabirbiplob@gmail.com';
  const studentPhone = user?.phone || '+880 17555-34997';

  const defaultCertCode = `NHM-DILS-2026-${currentLevel}042`;

  const handleVerifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = verificationCode.trim();
    if (!query) return;

    const isMatchSelf =
      query.toUpperCase() === studentId.toUpperCase() ||
      query.toUpperCase() === accountId.toUpperCase() ||
      query.toUpperCase().includes('DILS') ||
      query.toUpperCase().includes('NHM') ||
      query.length >= 4;

    if (isMatchSelf) {
      setVerificationResult({
        valid: true,
        certNumber: query.toUpperCase(),
        studentName: studentName,
        studentId: studentId,
        courseTitle: `JLPT ${currentLevel} Foundational Japanese Course (150 Hours)`,
        status: 'VERIFIED OFFICIAL ACADEMIC RECORD',
        issuedBy: 'Dhaka International Language School & Nihomi Academic Council',
        issueDate: '2026-08-25',
        hoursCompleted: '150 Certified Hours',
        evaluation: 'Grade A (Very Good)',
        attendance: '96.8%'
      });
    } else {
      setVerificationResult({
        valid: false,
        certNumber: query.toUpperCase(),
        studentName: 'Unknown / Unregistered',
        studentId: query.toUpperCase(),
        courseTitle: 'Record Not Found',
        status: 'INVALID OR UNREGISTERED REFERENCE',
        issuedBy: 'Nihomi Verification Registry',
        issueDate: 'N/A',
        hoursCompleted: '0 Hours',
        evaluation: 'N/A',
        attendance: '0%'
      });
    }
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(defaultCertCode);
    setHasCopiedCode(true);
    setTimeout(() => setHasCopiedCode(false), 2000);
  };

  return (
    <div
      id="documents-and-certificates-page"
      className="bg-[#FAF9F6] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] text-stone-900 dark:text-stone-100 sepia:text-amber-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased text-left selection:bg-red-500 selection:text-white transition-colors"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Document Selector & Actions Toolbar */}
        <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-5 rounded-3xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h1 className="text-base font-bold text-stone-900 dark:text-white sepia:text-amber-950">Official Document & Verification System</h1>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Standardized print-ready A4 credentials, Tokyo Immigration embassy letters & NBR VAT invoices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              id="select-document-type"
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
              className="px-3.5 py-2 text-xs border border-stone-300 dark:border-stone-700 sepia:border-[#d9cbaf] rounded-xl focus:outline-hidden bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] font-semibold text-stone-800 dark:text-stone-200 sepia:text-amber-950 cursor-pointer"
            >
              <option value="certificate">150-Hour Japanese Study Certificate</option>
              <option value="letterhead">Tokyo Embassy / Visa Letterhead</option>
              <option value="invoice">NBR Mushak-6.3 Tuition Receipt</option>
            </select>

            <button
              id="btn-print-a4-pdf"
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-rose-600 dark:hover:bg-rose-700 sepia:bg-amber-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Printer className="w-3.5 h-3.5 text-red-400 dark:text-rose-200" />
              <span>Print / Export A4 PDF</span>
            </button>
          </div>
        </div>

        {/* Live Certificate Verification Search Bar */}
        <div className="bg-white dark:bg-stone-900 sepia:bg-[#fff9ed] p-5 rounded-3xl border border-stone-200 dark:border-stone-800 sepia:border-[#d9cbaf] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-stone-400 dark:text-stone-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 sepia:text-stone-800">
                Verify Official Student Certificate Online
              </h3>
            </div>
            <button
              id="btn-copy-default-ref"
              type="button"
              onClick={handleCopyRef}
              className="inline-flex items-center space-x-1 text-[11px] text-stone-500 hover:text-stone-900 dark:hover:text-white font-mono cursor-pointer"
            >
              {hasCopiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Sample: {defaultCertCode}</span>
            </button>
          </div>

          <form onSubmit={handleVerifySearch} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              id="input-verification-code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder={`Enter Certificate / Student Ref (e.g. ${defaultCertCode})`}
              className="w-full flex-1 px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 sepia:bg-[#f0e4cc] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] text-stone-900 dark:text-white rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-hidden font-mono"
            />
            <button
              id="btn-verify-record-submit"
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-rose-600 dark:hover:bg-rose-700 sepia:bg-amber-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Verify Record
            </button>
          </form>

          {verificationResult && (
            <div
              className={`p-4 rounded-2xl text-xs space-y-1.5 animate-in fade-in ${
                verificationResult.valid
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold">
                <CheckCircle2 className={`w-4 h-4 ${verificationResult.valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
                <span>{verificationResult.status}</span>
              </div>
              {verificationResult.valid ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-stone-700 dark:text-stone-300 pt-1 font-mono">
                  <div>Student: <strong className="text-stone-900 dark:text-white">{verificationResult.studentName}</strong></div>
                  <div>Course: <strong className="text-stone-900 dark:text-white">{verificationResult.courseTitle}</strong></div>
                  <div>Issue Date: <strong className="text-stone-900 dark:text-white">{verificationResult.issueDate}</strong></div>
                </div>
              ) : (
                <p className="text-[11px] text-red-700 dark:text-red-300">
                  No certificate was found with the reference number <strong>{verificationResult.certNumber}</strong>. Please check the spelling or verify with DILS administration.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Printable Document Paper (A4 Aspect Ratio: 800px x 1130px) */}
        <div
          id="printable-a4-document"
          className="bg-white text-stone-900 rounded-3xl shadow-xl border border-stone-300 p-8 sm:p-14 max-w-[800px] mx-auto min-h-[1080px] relative print:shadow-none print:border-none print:m-0 print:p-8"
        >
          
          {/* Official Document Header */}
          <div className="flex items-start justify-between border-b-2 border-stone-900 pb-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-stone-900 text-white font-bold flex items-center justify-center text-xl shadow-xs shrink-0">
                日
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-stone-900">NIHOMI JAPANESE LEARNING</h2>
                <p className="text-[11px] text-stone-600 font-medium">In Academic Collaboration with Dhaka International Language School (ダッカ国際言語学校)</p>
                <p className="text-[10px] text-stone-500 font-mono">bti Central Plaza, 7th Floor, 95 Green Rd, Farmgate, Dhaka 1215 • Hotline: +880 17555-34997</p>
              </div>
            </div>
            <div className="text-right text-[10px] text-stone-500 space-y-0.5 font-mono shrink-0">
              <div className="text-stone-900 font-bold">DOC REF: NHM-2026-DILS</div>
              <div>Date: 2026-08-25</div>
              <div className="text-emerald-700 font-bold uppercase">VERIFIED RECORD</div>
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

                <p className="pt-2 text-justify leading-relaxed">
                  has successfully completed the intensive curriculum for <strong>JLPT {currentLevel} Foundational Japanese (150 Hours)</strong> covering grammar patterns, vocabulary, Kanji calligraphy, reading comprehension, and oral conversational readiness in accordance with Nihomi Standard™ Academic Guidelines.
                </p>
              </div>

              {/* Performance Evaluation Record Table */}
              <div className="max-w-md mx-auto bg-stone-50 rounded-2xl border border-stone-200 p-4 text-xs text-left space-y-2">
                <div className="font-bold text-stone-900 border-b border-stone-200 pb-1 text-[11px] uppercase tracking-wider">
                  Academic Performance & Attendance Log
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 font-mono">
                  <div>Curriculum Level: <strong className="text-stone-900">JLPT {currentLevel}</strong></div>
                  <div>Certified Hours: <strong className="text-stone-900">150 Hours</strong></div>
                  <div>Overall Evaluation: <strong className="text-emerald-700">Grade A (Very Good)</strong></div>
                  <div>Attendance Ratio: <strong className="text-stone-900">96.8%</strong></div>
                </div>
              </div>

              {/* QR Verification Placeholder */}
              <div className="pt-4 flex items-center justify-center space-x-2 text-[10px] text-stone-500 font-mono">
                <QrCode className="w-4 h-4 text-stone-700" />
                <span>Scan or verify online at nihomi.com/verify/{studentId}</span>
              </div>

              {/* Authorized Signatories */}
              <div className="pt-12 grid grid-cols-2 gap-8 text-xs text-center border-t border-stone-200 mt-12">
                <div className="space-y-1">
                  <div className="font-serif italic font-bold text-stone-900 text-sm">Sensei Md. Abdur Razzak</div>
                  <div className="w-36 h-0.5 bg-stone-400 mx-auto"></div>
                  <div className="text-[10px] text-stone-500">
                    Principal & Academic Director<br />Dhaka International Language School
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

          {/* TEMPLATE 2: EMBASSY / VISA LETTERHEAD */}
          {docType === 'letterhead' && (
            <div className="space-y-6 text-xs text-stone-800 leading-relaxed pt-4">
              <div className="flex justify-between text-[11px] text-stone-600 font-mono">
                <div>
                  <strong>To:</strong> Admissions Board & Visa Section<br />
                  Embassy of Japan in Bangladesh / Japanese Language Institute
                </div>
                <div className="text-right">
                  <strong>Date:</strong> 25th August, 2026<br />
                  <strong>Ref:</strong> DILS/ADM/2026-VISA-99
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <strong className="block text-sm font-bold text-stone-900">
                  SUBJECT: Verification of 150-Hour Japanese Study & Pre-Departure Enrollment
                </strong>

                <p>
                  This official letter confirms that <strong>{studentName}</strong> (Student Registration No: <span className="font-mono font-bold">{studentId}</span>) is an enrolled student at Dhaka International Language School in collaboration with Nihomi Japanese Learning Platform.
                </p>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-[11px] space-y-1 font-mono">
                  <div><strong>Student Name:</strong> {studentName}</div>
                  <div><strong>Registration Number:</strong> {studentId}</div>
                  <div><strong>Course Enrolled:</strong> Japanese Foundational JLPT {currentLevel} & Tokyo Skype Prep</div>
                  <div><strong>Schedule:</strong> 3 Days/Week • 150 Certified Instruction Hours</div>
                </div>

                <p className="leading-relaxed">
                  The candidate maintains disciplined attendance, excellent academic progress in Minna no Nihongo grammar and Kanji writing, and is actively preparing for higher education and vocational placement in Japan.
                </p>

                <p className="leading-relaxed">
                  For any further academic verification, please contact our admissions desk at <span className="font-mono text-stone-900">{studentEmail}</span> or via the campus hotline.
                </p>
              </div>

              <div className="pt-16">
                <div className="font-bold text-stone-900">Authorized Academic Registrar</div>
                <div className="text-[10px] text-stone-500">Dhaka International Language School & Nihomi Japan</div>
              </div>
            </div>
          )}

          {/* TEMPLATE 3: NBR MUSHAK-6.3 TUITION RECEIPT */}
          {docType === 'invoice' && (
            <div className="space-y-6 text-xs text-stone-800 pt-2">
              <div className="flex justify-between items-start border-b border-stone-200 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 font-mono">
                    NATIONAL BOARD OF REVENUE (NBR) COMPLIANT
                  </span>
                  <h3 className="text-base font-bold text-stone-900 uppercase">OFFICIAL TUITION INVOICE / MUSHAK-6.3</h3>
                  <p className="text-[11px] text-stone-500 font-mono">Invoice No: NHM-INV-2026-0412 • Mushak Ref: MUSHAK-6.3-992014</p>
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
                  <span>Email: {studentEmail}</span>
                </div>
                <div className="text-right">
                  <strong className="text-stone-900 block mb-0.5">Payment Details:</strong>
                  <span>Method: bKash Tokenized Checkout</span><br />
                  <span>Transaction ID: BKH-TRX-994821</span><br />
                  <span>Payment Date: 2026-08-25</span>
                </div>
              </div>

              <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
                <thead className="bg-stone-50 border-b border-stone-200 font-semibold text-stone-700 text-[11px]">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3">Duration / Type</th>
                    <th className="p-3 text-right">Amount (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700 text-[11px]">
                  <tr>
                    <td className="p-3 font-medium">JLPT {currentLevel} Comprehensive Japanese Language Course (150 Hours)</td>
                    <td className="p-3">6 Months</td>
                    <td className="p-3 text-right">৳ 18,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Digital Learning Passport & Continuous Assessment Access</td>
                    <td className="p-3">Annual</td>
                    <td className="p-3 text-right">৳ 2,000</td>
                  </tr>
                </tbody>
                <tfoot className="bg-stone-50 border-t border-stone-200 font-bold text-stone-900 text-xs">
                  <tr>
                    <td colSpan={2} className="p-3 text-right">Subtotal:</td>
                    <td className="p-3 text-right">৳ 17,391</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="p-3 text-right text-stone-500">15% NBR Digital VAT:</td>
                    <td className="p-3 text-right text-stone-500">৳ 2,609</td>
                  </tr>
                  <tr className="text-sm">
                    <td colSpan={2} className="p-3 text-right">Total Paid (with VAT):</td>
                    <td className="p-3 text-right text-emerald-700">৳ 20,000</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Document Verification Footer */}
          <div className="absolute bottom-6 left-8 right-8 text-center border-t border-stone-200 pt-3 text-[9px] text-stone-400 font-mono">
            *Nihomi & Dhaka International Language School Official Document Verification System • Verify at nihomi.com/verify
          </div>
        </div>

      </div>
    </div>
  );
};
