import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Copy, CheckCircle2, Building2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const EmailSignatureView: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const studentName = user?.name || 'Md. Tanvir Kabir Biplob';
  const studentEmail = user?.email || 'mdtanvirkabirbiplob@gmail.com';
  const studentPhone = user?.phone || '+880 17555-34997';
  const studentId = user?.id || 'DILS-2026-N5042';

  const signatureHtml = `
  <strong>${studentName}</strong> | Japanese Language Scholar<br/>
  Nihomi Student ID: ${studentId} (JLPT N5 Track)<br/>
  Dhaka International Language School & Nihomi Academic Council<br/>
  Email: ${studentEmail} | Mobile: ${studentPhone}<br/>
  Web: https://nihomi.com
  `;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(signatureHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-200 mb-2">
            <Mail className="w-4 h-4" />
            <span>Official Academic Email Signature</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Institutional Email Signature Generator</h1>
          <p className="text-xs text-slate-500">
            Generate and copy your official student email footer for university admissions and visa correspondences.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 font-sans">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-extrabold text-lg flex items-center justify-center">
                {studentName.charAt(0)}
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{studentName}</h3>
                <p className="text-xs text-red-600 font-semibold">Japanese Language Scholar • JLPT N5–N3 Track</p>
                <p className="text-[10px] text-slate-500 font-mono">Student ID: {studentId} • Dhaka International Language School</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{studentEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{studentPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>https://nihomi.com</span>
              </div>
            </div>
          </div>

          <button
            onClick={copyToClipboard}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'সিগনেচার ক্লিপবোর্ডে কপি হয়েছে!' : 'সিগনেচার কোড কপি করুন'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
