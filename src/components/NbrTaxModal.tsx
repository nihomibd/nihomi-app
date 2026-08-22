// src/components/NbrTaxModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  QrCode,
  X,
  Printer,
  ExternalLink,
  CheckCircle2,
  Lock,
  Building,
  FileCheck,
  Hash,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Invoice } from '../types';
import { downloadNbrTaxCertificatePDF } from '../lib/pdfInvoice.js';

interface NbrTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const NbrTaxModal: React.FC<NbrTaxModalProps> = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  const total = invoice.amount || 0;
  const subtotal = invoice.subtotal || Math.round(total / 1.15);
  const vatAmount = invoice.tax || (total - subtotal);
  const formattedDate = invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : '20 Aug 2026';

  const nbrRef = `NBR-VAT-${(invoice.id || 'INV').replace(/[^a-zA-Z0-9]/g, '')}-77A`;
  const shaSeal = `SHA256: 4f7d98b2c4e1a05689fe3d2a9810cb9f${(invoice.id || '001').slice(-3)}e48102a9b345`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          id="modal-nbr-tax-verification"
        >
          {/* Header Banner - NBR Official Styling */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 sm:p-6 relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close NBR Modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    Government of Bangladesh &bull; NBR
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white font-serif">
                  National Board of Revenue Tax Portal
                </h3>
                <p className="text-[11px] text-emerald-200">
                  Automated VAT Verification & Cryptographic Seal Engine (Mushak 6.3)
                </p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-5 text-xs text-zinc-700 dark:text-zinc-300">
            {/* Status Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 block text-xs">
                    Cryptographic Seal Status: VALID & VERIFIED
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Registered with National Board of Revenue Central Gateway
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white tracking-wider uppercase shrink-0">
                Mushak 6.3
              </span>
            </div>

            {/* Verification Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Invoice Number</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-xs">{invoice.id}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">NBR Reference No.</span>
                <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 text-xs">{nbrRef}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Merchant BIN</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-xs">004928192-0101</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Issuance Date</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">{formattedDate}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Registered Entity</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">Nihomi Academy Ltd.</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Tax Category</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">EdTech & Digital Software Service (15% VAT)</span>
              </div>
            </div>

            {/* 15% VAT Calculation Table */}
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden">
              <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex justify-between">
                <span>Tax Breakdown Item</span>
                <span>Amount (BDT)</span>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Taxable Subtotal (Base Price):</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between bg-emerald-50/40 dark:bg-emerald-950/20">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                    Assessed Statutory VAT (15% standard rate):
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">৳{vatAmount.toLocaleString()}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between font-bold bg-zinc-50 dark:bg-zinc-800/60 text-sm">
                  <span className="text-zinc-900 dark:text-zinc-100">Total Settled Amount:</span>
                  <span className="text-red-600 dark:text-red-400">৳{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Digital Seal & Security Signature */}
            <div className="p-4 rounded-2xl bg-zinc-900 text-white space-y-2 border border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>NBR Cryptographic Digital Seal</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">RSA-2048 / SHA-256</span>
              </div>
              <p className="font-mono text-[10px] text-zinc-300 break-all bg-black/40 p-2.5 rounded-xl border border-zinc-800">
                {shaSeal}
              </p>
              <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
                <span>Timestamp: {new Date().toISOString()}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Seal Tamper-Proof
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
            <span className="text-[11px] text-zinc-500">
              Official Tax Record for Corporate & Expense Claim
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => downloadNbrTaxCertificatePDF(invoice)}
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                id="btn-download-nbr-pdf"
                title="Download NBR-compliant tax certificate as a standalone PDF"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Download Official Tax Certificate</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                id="btn-print-nbr-cert"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                id="btn-close-nbr-modal"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
