import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  X,
  Layers,
  FileText,
  DollarSign
} from 'lucide-react';
import { Invoice } from '../types.js';

interface CsvPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  fileName?: string;
}

export const CsvPreviewModal: React.FC<CsvPreviewModalProps> = ({
  isOpen,
  onClose,
  invoices,
  fileName = 'nihomi_tax_invoices.csv'
}) => {
  const [activeTab, setActiveTab] = useState<'table' | 'raw'>('table');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || invoices.length === 0) return null;

  const headers = [
    'Invoice ID',
    'Date Issued',
    'Plan Name',
    'Billing Period',
    'Subtotal (BDT)',
    'Discount (BDT)',
    '15% Statutory VAT (BDT)',
    'Total Amount Paid (BDT)',
    'Payment Method',
    'Status',
    'BIN Number',
    'Mushak 6.3 Ref',
    'Customer Name',
    'Customer Email'
  ];

  const rows = invoices.map((inv) => {
    const subtotal = inv.subtotal || Math.round((inv.amount || 0) / 1.15);
    const vat = inv.tax || (inv.amount - subtotal);
    const mushakRef = `NBR-6.3-${inv.id.replace(/[^0-9a-zA-Z]/g, '').slice(-8).toUpperCase()}`;
    return [
      inv.id,
      inv.createdAt ? new Date(inv.createdAt).toISOString().split('T')[0] : 'N/A',
      inv.planName || '',
      inv.billingPeriod || '',
      subtotal,
      inv.discount || 0,
      vat,
      inv.amount || 0,
      inv.paymentMethodName || 'bKash',
      (inv.status || 'PAID').toUpperCase(),
      '004928192-0101',
      mushakRef,
      inv.customerName || 'Nihomi Student',
      inv.customerEmail || 'student@nihomi.com'
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((r) =>
      r
        .map((cell) => {
          const str = String(cell);
          return str.includes(',') || str.includes('"') || str.includes('\n')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(',')
    )
  ].join('\r\n');

  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const handleDownload = () => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(csvContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in"
      id="modal-csv-preview"
    >
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-stone-200 dark:border-zinc-800 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-200 dark:border-emerald-800">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
                  CSV Export Live Data Preview
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  {invoices.length} {invoices.length === 1 ? 'Row' : 'Rows'}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                File: {fileName} &bull; Total Value: ৳{totalAmount.toLocaleString()} BDT
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Tabs */}
        <div className="px-6 pt-3 border-b border-stone-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-stone-50/50 dark:bg-zinc-800/30">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 text-xs font-bold rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'table'
                  ? 'bg-white dark:bg-zinc-900 text-stone-900 dark:text-stone-100 border-t border-x border-stone-200 dark:border-zinc-700'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Grid Table Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1.5 text-xs font-bold rounded-t-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'raw'
                  ? 'bg-white dark:bg-zinc-900 text-stone-900 dark:text-stone-100 border-t border-x border-stone-200 dark:border-zinc-700'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Raw CSV Text</span>
            </button>
          </div>

          {activeTab === 'raw' && (
            <button
              type="button"
              onClick={handleCopyRaw}
              className="mb-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-200 dark:bg-zinc-700 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-zinc-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Raw CSV</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'table' ? (
            <div className="overflow-x-auto border border-stone-200 dark:border-zinc-800 rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 dark:bg-zinc-800/80 border-b border-stone-200 dark:border-zinc-700 text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 whitespace-nowrap">
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i} className="py-2.5 px-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-zinc-800 whitespace-nowrap">
                  {rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-stone-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`py-2 px-3 ${
                            cIdx === 0
                              ? 'font-mono font-bold text-stone-900 dark:text-stone-100'
                              : cIdx === 7
                              ? 'font-bold text-emerald-600 dark:text-emerald-400'
                              : 'text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {typeof cell === 'number' && cIdx >= 4 && cIdx <= 7
                            ? `৳${cell.toLocaleString()}`
                            : String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-stone-950 text-stone-200 font-mono text-xs overflow-x-auto leading-relaxed border border-stone-800 max-h-96">
              <pre className="whitespace-pre">{csvContent}</pre>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-6 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-stone-50/60 dark:bg-zinc-900/60">
          <div className="text-xs text-stone-500 hidden sm:block">
            UTF-8 Encoded &bull; Compatible with MS Excel, Google Sheets & NBR Audit
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
              id="btn-confirm-download-csv"
            >
              <Download className="w-4 h-4" />
              <span>Download .CSV File ({invoices.length} Records)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
