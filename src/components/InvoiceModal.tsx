import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Mail,
  Calendar,
  Loader2,
  FileText,
  Eye,
  QrCode,
  RotateCw,
  Maximize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Invoice } from '../types';
import { downloadInvoicePDF, getInvoicePDFBlobUrl, downloadAnnualTaxSummaryPDF } from '../lib/pdfInvoice';
import { billingApi } from '../lib/billingApi';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, invoice }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'pdf-preview'>('pdf-preview');
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isFitToPage, setIsFitToPage] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  useEffect(() => {
    if (invoice && isOpen) {
      try {
        const url = getInvoicePDFBlobUrl(invoice);
        setPdfBlobUrl(url);
        return () => {
          if (url) URL.revokeObjectURL(url);
        };
      } catch (e) {
        console.error('Failed to generate preview PDF url:', e);
      }
    } else {
      setPdfBlobUrl(null);
      setRotationAngle(0);
      setIsFitToPage(true);
      setZoomLevel(100);
    }
  }, [invoice, isOpen]);

  const handleRotate = () => {
    setRotationAngle((prev) => (prev + 90) % 360);
  };

  const handleToggleFitToPage = () => {
    setIsFitToPage((prev) => {
      const next = !prev;
      if (next) {
        setZoomLevel(100);
      }
      return next;
    });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 250));
    setIsFitToPage(false);
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50));
    setIsFitToPage(false);
  };

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    try {
      setIsGeneratingPdf(true);
      downloadInvoicePDF(invoice);
    } catch (err) {
      console.error('Error generating PDF invoice:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadTaxCertificate = () => {
    try {
      setIsGeneratingPdf(true);
      downloadInvoicePDF(invoice);
      setEmailStatus('✓ Official NBR Tax Certificate PDF downloaded with government seal.');
      setTimeout(() => setEmailStatus(null), 4000);
    } catch (err: any) {
      console.error('Error generating Tax Certificate:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      setIsSendingEmail(true);
      setEmailStatus(null);
      const res = await billingApi.sendInvoiceEmail(invoice.id, invoice.customerEmail);
      setEmailStatus(`Invoice emailed to ${res.sentTo || invoice.customerEmail}!`);
      setTimeout(() => setEmailStatus(null), 5000);
    } catch (err: any) {
      setEmailStatus(`Failed: ${err.message || 'Error sending email'}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto" id="invoice-modal-backdrop">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden my-6 flex flex-col max-h-[90vh]"
        id="quick-view-tax-invoice-overlay"
      >
        {/* Modal Toolbar (hidden when printing) */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 print:hidden gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
              日
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Official Tax Invoice</span>
              <p className="text-[10px] text-zinc-500 font-mono">ID: {invoice.id} • Mushak 6.3</p>
            </div>
            {emailStatus && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1 ml-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {emailStatus}
              </span>
            )}
          </div>

          {/* View Mode Toggle: Live PDF vs Itemized Form */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-200/80 dark:bg-zinc-800 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('pdf-preview')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'pdf-preview'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
              id="btn-tab-live-pdf-preview"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Live PDF Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'details'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
              id="btn-tab-invoice-details"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Breakdown View</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
              id="btn-modal-email-invoice"
              title="Email a copy of this receipt"
            >
              {isSendingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" /> : <Mail className="w-3.5 h-3.5 text-red-600" />}
              <span className="hidden sm:inline">{isSendingEmail ? 'Sending...' : 'Email'}</span>
            </button>
            
            {/* Header Instant Download Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors cursor-pointer"
              id="btn-download-pdf-invoice"
              title="Instant One-Click Download of Tax Invoice as PDF"
            >
              {isGeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>Download PDF</span>
            </button>
            
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-2xs transition-colors cursor-pointer"
              id="btn-print-invoice"
              title="Print Full Invoice View"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer ml-1"
              id="btn-close-invoice"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {activeTab === 'pdf-preview' && (
            <div className="space-y-3" id="section-live-pdf-preview">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs px-1">
                <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Live NBR Cryptographic Tax Invoice Document Preview</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Zoom Controls */}
                  <div
                    className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-0.5 shadow-2xs"
                    id="btn-group-pdf-zoom"
                  >
                    <button
                      type="button"
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 50}
                      className="p-1 rounded text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 cursor-pointer"
                      id="btn-pdf-zoom-out"
                      title="Zoom Out PDF"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span
                      className="px-1.5 text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300 min-w-[38px] text-center select-none"
                      id="label-pdf-zoom-level"
                    >
                      {zoomLevel}%
                    </span>
                    <button
                      type="button"
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 250}
                      className="p-1 rounded text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 cursor-pointer"
                      id="btn-pdf-zoom-in"
                      title="Zoom In PDF"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Fit to Page Button */}
                  <button
                    type="button"
                    onClick={handleToggleFitToPage}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1 cursor-pointer ${
                      isFitToPage
                        ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                        : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                    }`}
                    id="btn-pdf-fit-to-page"
                    title="Fit PDF document to viewable page area"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Fit to Page</span>
                  </button>

                  {/* Rotate PDF Button */}
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                    id="btn-pdf-rotate"
                    title={`Rotate PDF Preview (Current: ${rotationAngle}°)`}
                  >
                    <RotateCw className="w-3.5 h-3.5 text-red-500" />
                    <span>Rotate PDF {rotationAngle > 0 ? `(${rotationAngle}°)` : ''}</span>
                  </button>

                  {/* Direct Print Document Button */}
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                    id="btn-pdf-direct-print"
                    title="Print Document directly from PDF Viewer"
                  >
                    <Printer className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                    <span>Print Document</span>
                  </button>

                  <span className="text-[11px] text-zinc-500 font-mono hidden md:inline">BIN: 004928192-0101 • Mushak 6.3</span>
                </div>
              </div>

              {pdfBlobUrl ? (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-inner bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center min-h-[480px]">
                  <div
                    className="w-full transition-all duration-300 flex items-center justify-center overflow-auto"
                    style={{
                      transform: rotationAngle ? `rotate(${rotationAngle}deg)` : undefined,
                      transformOrigin: 'center center',
                    }}
                  >
                    <iframe
                      src={`${pdfBlobUrl}#zoom=${zoomLevel}&view=${isFitToPage ? 'Fit' : 'FitH'}&toolbar=1&navpanes=0`}
                      className={`w-full rounded-xl transition-all duration-200 ${
                        isFitToPage ? 'h-[480px] sm:h-[540px]' : zoomLevel > 100 ? 'h-[680px]' : 'h-[580px]'
                      }`}
                      title="Live Invoice PDF Preview"
                      id="iframe-live-pdf-preview"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 text-zinc-500 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                  <p className="text-xs">Rendering live PDF document...</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6" id="invoice-printable-container">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-base">
                      日
                    </div>
                    <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">NIHOMI ACADEMY</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Japanese Language & Career Intelligence Platform</p>
                  <p className="text-xs text-zinc-500">Dhaka, Bangladesh • BIN: 004819201-0101</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-1.5">
                    PAID / SETTLED
                  </span>
                  <p className="text-xs text-zinc-500">Invoice Number</p>
                  <p className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">{invoice.id}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Date: {new Date(invoice.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
              </div>

              {/* Customer & Billing Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60">
                  <h4 className="font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider text-[11px] mb-1">Billed To:</h4>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{invoice.customerName || 'Nihomi Student'}</p>
                  <p className="text-zinc-600 dark:text-zinc-400">{invoice.customerEmail}</p>
                  <p className="text-zinc-500">Student ID: {invoice.userId}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 sm:text-right">
                  <h4 className="font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider text-[11px] mb-1">Payment Method:</h4>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{invoice.paymentMethodName}</p>
                  <p className="text-zinc-600 dark:text-zinc-400">Period: {invoice.billingPeriod}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">Status: Settled & Verified by NBR</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/70 border-b border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-2.5">Description</th>
                      <th className="px-4 py-2.5 text-center">Period</th>
                      <th className="px-4 py-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    <tr>
                      <td className="px-4 py-3">
                        <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{invoice.planName}</p>
                        <p className="text-zinc-500 text-[11px]">Unlimited curriculum access, AI Sensei, mock exams</p>
                      </td>
                      <td className="px-4 py-3 text-center text-zinc-600 dark:text-zinc-400">{invoice.billingPeriod}</td>
                      <td className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">
                        ৳{invoice.subtotal.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-full sm:w-72 space-y-1.5 text-xs p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Base Subtotal:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">৳{(invoice.subtotal || Math.round(invoice.amount / 1.15)).toLocaleString()}</span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Discount Applied:</span>
                      <span>-৳{invoice.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                    <span>15% NBR VAT (Mushak 6.3):</span>
                    <span>৳{(invoice.tax || (invoice.amount - Math.round(invoice.amount / 1.15))).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100 border-t border-zinc-200 dark:border-zinc-700 pt-2">
                    <span>Total Paid (BDT):</span>
                    <span className="text-red-600 dark:text-red-400 text-base font-extrabold">৳{invoice.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with NBR Tax Certificate Button */}
        <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-900/90 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2.5 print:hidden">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Computer-generated official invoice. Verified by NBR & Nihomi Systems.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadTaxCertificate}
              disabled={isGeneratingPdf}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              id="btn-download-tax-certificate"
              title="Download official NBR-compliant tax certificate as a standalone PDF with government seal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Download Official Tax Certificate</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

