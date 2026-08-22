import React, { useState } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
  DollarSign,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { Invoice } from '../types.js';
import { billingApi } from '../lib/billingApi.js';

interface BulkRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInvoices: Invoice[];
  onSuccess: (result: {
    refundedCount: number;
    totalRefundAmount: number;
    message: string;
  }) => void;
}

export const BulkRefundModal: React.FC<BulkRefundModalProps> = ({
  isOpen,
  onClose,
  selectedInvoices,
  onSuccess
}) => {
  const [reasonPreset, setReasonPreset] = useState('Customer refund request under 7-day satisfaction guarantee');
  const [customReason, setCustomReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || selectedInvoices.length === 0) return null;

  const totalRefundAmount = selectedInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const invoiceIds = selectedInvoices.map((inv) => inv.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    const finalReason = reasonPreset === 'custom' ? customReason.trim() : reasonPreset;

    try {
      const res = await billingApi.bulkRefundInvoices(invoiceIds, finalReason || 'Customer Refund Request');
      if (res.success) {
        onSuccess({
          refundedCount: res.refundedCount,
          totalRefundAmount: res.totalRefundAmount,
          message: res.message
        });
        onClose();
      } else {
        setErrorMessage('Failed to process bulk refund.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while processing bulk refund.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in"
      id="modal-bulk-refund"
    >
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-stone-200 dark:border-zinc-800 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center font-bold border border-rose-200 dark:border-rose-800">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
                Confirm Bulk Invoice Refund
              </h3>
              <p className="text-xs text-stone-500">
                Processing {selectedInvoices.length} selected {selectedInvoices.length === 1 ? 'invoice' : 'invoices'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Warning Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Irreversible Action:</span>
              <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-400">
                Marking these invoices as refunded will update the subscriber billing status, generate audit logs, and calculate NBR tax reversals.
              </p>
            </div>
          </div>

          {/* Selected Invoices Table List */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              Selected Invoices ({selectedInvoices.length}):
            </label>
            <div className="max-h-36 overflow-y-auto rounded-xl border border-stone-200 dark:border-zinc-800 divide-y divide-stone-100 dark:divide-zinc-800 bg-stone-50/60 dark:bg-zinc-800/30 text-xs">
              {selectedInvoices.map((inv) => (
                <div key={inv.id} className="p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-mono font-bold text-stone-900 dark:text-stone-100">{inv.id}</span>
                    <span className="text-stone-500 text-[11px]">({inv.planName})</span>
                  </div>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    ৳{inv.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Refund Summary */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-bold text-stone-600 dark:text-stone-400">Total Refund Payout:</span>
            <span className="text-lg font-extrabold text-stone-900 dark:text-stone-100 font-mono">
              ৳{totalRefundAmount.toLocaleString()} BDT
            </span>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              Select Reason for Refund:
            </label>
            <select
              value={reasonPreset}
              onChange={(e) => setReasonPreset(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-stone-300 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-rose-500"
            >
              <option value="Customer refund request under 7-day satisfaction guarantee">
                Customer refund request under 7-day satisfaction guarantee
              </option>
              <option value="Plan downgrade adjustment & credit reconciliation">
                Plan downgrade adjustment & credit reconciliation
              </option>
              <option value="Duplicate payment / Gateway transaction error">
                Duplicate payment / Gateway transaction error
              </option>
              <option value="Administrative student waiver & scholarship credit">
                Administrative student waiver & scholarship credit
              </option>
              <option value="custom">Custom Reason...</option>
            </select>

            {reasonPreset === 'custom' && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter detailed reason for the audit trail..."
                rows={2}
                required
                className="w-full p-2.5 text-xs rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-rose-500"
              />
            )}
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              id="btn-confirm-bulk-refund"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Processing Refund...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Approve & Refund ৳{totalRefundAmount.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
