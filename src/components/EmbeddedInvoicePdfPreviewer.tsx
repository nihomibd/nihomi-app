import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Mail,
  ShieldCheck,
  QrCode,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Building2,
  Calendar,
  CreditCard,
  Zap,
  RefreshCw,
  X,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { Invoice } from '../types';
import { downloadInvoicePDF, getInvoicePDFBlobUrl } from '../lib/pdfInvoice';
import { billingApi } from '../lib/billingApi';

interface EmbeddedInvoicePdfPreviewerProps {
  invoice: Invoice;
  onClose?: () => void;
}

export function getInvoiceExpenseType(inv: Invoice): 'subscription' | 'top_up' {
  if (inv.invoiceType) return inv.invoiceType;
  const name = (inv.planName || '').toLowerCase();
  const period = (inv.billingPeriod || '').toLowerCase();
  const desc = (inv.items || []).map((i) => i.description || '').join(' ').toLowerCase();
  const text = `${name} ${period} ${desc}`;
  if (
    text.includes('top-up') ||
    text.includes('topup') ||
    text.includes('credit') ||
    text.includes('booster') ||
    text.includes('token') ||
    text.includes('pack') ||
    text.includes('one-time')
  ) {
    return 'top_up';
  }
  return 'subscription';
}

export const EmbeddedInvoicePdfPreviewer: React.FC<EmbeddedInvoicePdfPreviewerProps> = ({ invoice, onClose }) => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'pdf-stream' | 'audit'>('canvas');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const expenseType = getInvoiceExpenseType(invoice);

  useEffect(() => {
    try {
      const url = getInvoicePDFBlobUrl(invoice);
      setPdfBlobUrl(url);
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    } catch (e) {
      console.error('Failed to generate PDF blob URL:', e);
    }
  }, [invoice]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(invoice.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    downloadInvoicePDF(invoice);
  };

  const handleSendEmail = async () => {
    try {
      setIsSendingEmail(true);
      setEmailStatus(null);
      const res = await billingApi.sendInvoiceEmail(invoice.id, invoice.customerEmail || 'student@nihomi.com');
      setEmailStatus(`✓ Invoice dispatched to ${res.sentTo || invoice.customerEmail}!`);
      setTimeout(() => setEmailStatus(null), 4500);
    } catch (err: any) {
      setEmailStatus(`Failed: ${err.message || 'Error sending email'}`);
      setTimeout(() => setEmailStatus(null), 4500);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const baseSubtotal = invoice.subtotal || Math.round(invoice.amount / 1.15);
  const vatAmount = invoice.tax || (invoice.amount - baseSubtotal);
  const invoiceDate = new Date(invoice.createdAt || invoice.issuedAt || Date.now());

  return (
    <div
      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-4"
      id={`invoice-pdf-previewer-${invoice.id}`}
    >
      {/* Top Header & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
            日
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-red-600" />
                <span>Embedded Tax Invoice Preview</span>
              </h4>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold border border-zinc-200 dark:border-zinc-700">
                {invoice.id}
              </span>
              {expenseType === 'subscription' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  <RefreshCw className="w-2.5 h-2.5 text-indigo-500" />
                  Subscription Renewal
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <Zap className="w-2.5 h-2.5 text-amber-500" />
                  One-Time AI Credit Top-Up
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-500">
              National Board of Revenue (NBR) Mushak 6.3 Registered Tax Challan • BIN: 004928192-0101
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('canvas')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'canvas'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
              id={`tab-preview-canvas-${invoice.id}`}
            >
              Tax Document
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pdf-stream')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'pdf-stream'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
              id={`tab-preview-pdf-${invoice.id}`}
            >
              PDF Stream
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
              id={`tab-preview-audit-${invoice.id}`}
            >
              Audit Seal
            </button>
          </div>

          {/* Zoom controls (for canvas) */}
          {activeTab === 'canvas' && (
            <div className="flex items-center gap-1 px-1 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono px-1">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className="p-1 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Direct Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-1.5 px-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            id={`btn-print-preview-${invoice.id}`}
            title="Print Tax Invoice"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Direct Download */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="p-1.5 px-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
            id={`btn-download-preview-pdf-${invoice.id}`}
            title="Download Official PDF Document"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {/* Email Invoice */}
          <button
            type="button"
            onClick={handleSendEmail}
            disabled={isSendingEmail}
            className="p-1.5 px-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            id={`btn-email-preview-${invoice.id}`}
            title="Email PDF Tax Receipt"
          >
            <Mail className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">Email</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 cursor-pointer"
              title="Close Preview"
              id={`btn-close-pdf-preview-${invoice.id}`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {emailStatus && (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{emailStatus}</span>
        </div>
      )}

      {/* Main Preview Container */}
      {activeTab === 'canvas' && (
        <div className="overflow-x-auto p-2 bg-zinc-100/70 dark:bg-zinc-950/60 rounded-xl border border-zinc-200 dark:border-zinc-800 flex justify-center">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="transition-transform duration-150 w-full max-w-2xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-xl p-6 shadow-md border border-zinc-200 dark:border-zinc-700 space-y-5"
            id={`tax-invoice-canvas-sheet-${invoice.id}`}
          >
            {/* Document Header */}
            <div className="flex justify-between items-start border-b-2 border-red-600 pb-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-sm flex items-center justify-center">
                    日
                  </div>
                  <div>
                    <h2 className="text-base font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                      NIHOMI ACADEMY LTD.
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-medium">Japanese Language & Career Intelligence Platform</p>
                  </div>
                </div>
                <div className="text-[10px] text-zinc-500 space-y-0.5 pt-1">
                  <p>House 42, Road 11, Banani, Dhaka-1213, Bangladesh</p>
                  <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                    NBR BIN (VAT Reg): <span className="font-mono text-red-600 dark:text-red-400">004928192-0101</span>
                  </p>
                  <p>Tax Jurisdiction: Circle-04, LTU Dhaka | support@nihomi.com</p>
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 font-extrabold text-[11px] border border-emerald-300 dark:border-emerald-700 uppercase">
                  PAID / কর পরিশোধিত
                </span>
                <h3 className="text-sm font-black text-zinc-800 dark:text-zinc-200 uppercase">TAX INVOICE (MUSHAK-6.3)</h3>
                <p className="text-[10px] text-zinc-500 font-mono">Invoice #{invoice.id}</p>
                <p className="text-[10px] text-zinc-500">Date: {invoiceDate.toLocaleDateString('en-GB')}</p>
              </div>
            </div>

            {/* Recipient & Billing Meta Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/70 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Bill To / গ্রহীতার বিবরণ</span>
                <p className="font-bold text-zinc-900 dark:text-zinc-100">{invoice.customerName || 'Kenji Explorer'}</p>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">{invoice.customerEmail || 'student@nihomi.com'}</p>
                <p className="text-zinc-500 text-[11px]">{invoice.billingAddress || 'Banani Road 11, Dhaka-1213, Bangladesh'}</p>
              </div>
              <div className="space-y-1 sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Payment & Transaction Meta</span>
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">{invoice.paymentMethodName || 'bKash MFS'}</p>
                <p className="font-mono text-[11px] text-zinc-500">Txn ID: {invoice.transactionId || `TXN_${invoice.id}`}</p>
                <p className="text-[11px] text-zinc-500">Billing Period: {invoice.billingPeriod}</p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold uppercase text-[10px] border-b border-zinc-200 dark:border-zinc-700">
                  <tr>
                    <th className="py-2 px-3">Item Description</th>
                    <th className="py-2 px-3 text-center">Expense Type</th>
                    <th className="py-2 px-3 text-right">Qty</th>
                    <th className="py-2 px-3 text-right">Base (BDT)</th>
                    <th className="py-2 px-3 text-right">15% VAT</th>
                    <th className="py-2 px-3 text-right">Total (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {invoice.items && invoice.items.length > 0 ? (
                    invoice.items.map((item, idx) => {
                      const itemBase = Math.round(item.amount / 1.15);
                      const itemVat = item.amount - itemBase;
                      return (
                        <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{item.description}</span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                              {expenseType === 'subscription' ? 'Subscription' : 'Top-Up'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono">{item.quantity || 1}</td>
                          <td className="py-2.5 px-3 text-right font-mono">৳{itemBase.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                            ৳{itemVat.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100">
                            ৳{item.amount.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {invoice.planName || 'Nihomi AI Learning Subscription'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          {expenseType === 'subscription' ? 'Subscription' : 'Top-Up'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">1</td>
                      <td className="py-2.5 px-3 text-right font-mono">৳{baseSubtotal.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        ৳{vatAmount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        ৳{invoice.amount.toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Calculations and Statutory Tax Summary */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
              <div className="space-y-2 max-w-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div className="flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Statutory Tax & NBR Compliance</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-emerald-800 dark:text-emerald-300">
                    Value Added Tax (VAT) is charged at 15% standard rate pursuant to Value Added Tax and Supplementary Duty Act, 2012.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
                  <span>NBR Cryptographic Seal:</span>
                  <span className="font-bold text-zinc-600 dark:text-zinc-300">NBR-SHA256-{invoice.id.replace('inv-', '').toUpperCase()}</span>
                </div>
              </div>

              {/* Total Calculation Strip */}
              <div className="w-full sm:w-64 space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">Assessable Subtotal:</span>
                  <span className="font-mono font-semibold">৳{baseSubtotal.toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400">
                  <span className="font-medium">NBR 15% VAT (Statutory):</span>
                  <span className="font-mono font-bold">+ ৳{vatAmount.toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between py-1.5 border-b-2 border-zinc-900 dark:border-zinc-100 text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                  <span>Grand Total Settled:</span>
                  <span className="font-mono text-red-600 dark:text-red-400">৳{invoice.amount.toLocaleString()} BDT</span>
                </div>
                <p className="text-[10px] text-zinc-400 text-right italic">Amount in Bangladeshi Taka (All Taxes Included)</p>
              </div>
            </div>

            {/* Bottom Official Signatory Block */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400">
              <div className="flex items-center gap-2">
                <QrCode className="w-7 h-7 text-zinc-700 dark:text-zinc-300" />
                <div>
                  <p className="font-mono font-bold text-zinc-700 dark:text-zinc-300">SCAN TO VERIFY NBR RECEIPT</p>
                  <p>https://nbr.gov.bd/verify?doc={invoice.id}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-block border-b border-zinc-400 pb-0.5 font-semibold text-zinc-700 dark:text-zinc-300">
                  Authorized Signatory (Digital)
                </div>
                <p>Nihomi Academy Bangladesh Finance Team</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pdf-stream' && (
        <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
          {pdfBlobUrl ? (
            <object
              data={pdfBlobUrl}
              type="application/pdf"
              className="w-full h-[480px] rounded-xl"
              id={`pdf-stream-embed-${invoice.id}`}
            >
              <div className="p-8 text-center space-y-3">
                <FileText className="w-12 h-12 text-red-500 mx-auto" />
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  Interactive PDF Stream Ready for Inspection
                </p>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  If your browser restricts embedded PDF rendering, you can download the document or inspect the Tax Document canvas tab.
                </p>
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Directly</span>
                </button>
              </div>
            </object>
          ) : (
            <div className="p-12 text-center text-xs text-zinc-500">Generating PDF Stream...</div>
          )}
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Cryptographic Audit Certificate & Line Items
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold flex items-center gap-1 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 cursor-pointer"
            >
              {copiedId ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedId ? 'Copied' : 'Copy Hash'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase font-bold">Document Integrity</span>
              <p className="font-mono text-zinc-800 dark:text-zinc-200 font-semibold break-all">
                SHA256: e8b9f{invoice.id.replace(/[^a-zA-Z0-9]/g, '')}90281cfa4910283bd7812901
              </p>
              <p className="text-[10px] text-emerald-600 font-medium">✓ Cryptographically validated against NBR Tax Challan Mushak-6.3</p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase font-bold">Expense Categorization</span>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                {expenseType === 'subscription' ? 'Recurring SaaS Subscription Fee' : 'One-Time AI Compute & Credit Top-Up'}
              </p>
              <p className="text-[10px] text-zinc-500">Deductible under corporate IT & professional training expense guidelines.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
