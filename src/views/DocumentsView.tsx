import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, CheckCircle2, Award, Building2, Search, ExternalLink, Printer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DocumentsView: React.FC = () => {
  const { user, subscriptionDetails } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'academic' | 'visa' | 'receipts'>('all');

  const documents = [
    {
      id: 'doc-1',
      title: 'Institutional Enrollment & Study Certificate (JLPT N5 Track)',
      category: 'academic',
      issuedBy: 'Dhaka International Language School',
      date: '2026-08-15',
      refNo: 'DILS-DOC-2026-N5042',
      status: 'VERIFIED',
      type: 'PDF'
    },
    {
      id: 'doc-2',
      title: 'Japan Student Visa & COE 6-Stage Checklist (Immigration Services Agency)',
      category: 'visa',
      issuedBy: 'Nihomi Japan Desk & Coordination Hub',
      date: '2026-08-10',
      refNo: 'COE-GUIDE-ISA-2026',
      status: 'UPDATED',
      type: 'PDF'
    },
    {
      id: 'doc-3',
      title: 'Foundational 150 Hours Japanese Language Completion Certificate',
      category: 'academic',
      issuedBy: 'Dhaka International Language School & Nihomi',
      date: '2026-08-01',
      refNo: 'NHM-DILS-2026-0814',
      status: 'VERIFIED',
      type: 'CERTIFICATE'
    },
    {
      id: 'doc-4',
      title: 'Monthly Subscription & bKash NBR Tax Invoice (Mushak 6.3)',
      category: 'receipts',
      issuedBy: 'Nihomi Bangladesh Ltd.',
      date: '2026-08-01',
      refNo: 'INV-2026-8809972',
      status: 'PAID',
      type: 'INVOICE'
    },
    {
      id: 'doc-5',
      title: 'Japan Part-time Work (Arubaito 28-Hour) Eligibility Guidelines',
      category: 'visa',
      issuedBy: 'Ministry of Justice Japan & DILS',
      date: '2026-07-20',
      refNo: 'BAITO-28H-2026',
      status: 'OFFICIAL',
      type: 'GUIDE'
    }
  ];

  const filteredDocs = selectedCategory === 'all'
    ? documents
    : documents.filter((d) => d.category === selectedCategory);

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-200 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Institutional Documents</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Academic & Immigration Document Center</h1>
            <p className="text-xs text-slate-500 mt-1">
              Download and verify authenticated course certificates, COE preparation packets, and official transcripts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট / সেভ PDF</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'সকল ডকুমেন্টস' },
            { id: 'academic', label: 'একাডেমিক সার্টিফিকেট ও রিপোর্ট' },
            { id: 'visa', label: 'জাপান ভিসা ও COE চেকলিস্ট' },
            { id: 'receipts', label: 'পেমেন্ট ইনভয়েস ও রসিদ' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Document Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    REF: {doc.refNo}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {doc.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900">{doc.title}</h3>
                <div className="text-xs text-slate-500">
                  <span>ইস্যুকারী: {doc.issuedBy}</span> • <span>তারিখ: {doc.date}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">{doc.type} FORMAT</span>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ডাউনলোড</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
