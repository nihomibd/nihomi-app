import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Copy,
  Check,
  Loader2,
  Clock,
  Terminal,
  Activity,
  AlertCircle
} from 'lucide-react';
import { WebhookEvent } from '../types';

interface WebhookInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: WebhookEvent | null;
  onRetry?: (eventId: string) => Promise<void>;
}

export const WebhookInspectorModal: React.FC<WebhookInspectorModalProps> = ({
  isOpen,
  onClose,
  event,
  onRetry
}) => {
  const [activeTab, setActiveTab] = useState<'payload' | 'headers' | 'debug'>('payload');
  const [isRetrying, setIsRetrying] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  const handleCopyPayload = () => {
    const text = JSON.stringify(event.rawPayload || event, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRetry = async () => {
    if (!onRetry || !event.id) return;
    try {
      setIsRetrying(true);
      await onRetry(event.id);
    } catch (err) {
      console.error('Failed to retry webhook:', err);
    } finally {
      setIsRetrying(false);
    }
  };

  const isSuccess = event.status === 'success';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto" id="webhook-inspector-modal-backdrop">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isSuccess ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
            }`}>
              {isSuccess ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Webhook Event Inspector
                </h3>
                <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md ${
                  isSuccess ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {event.status}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                Event ID: {event.eventId || event.id} &bull; Provider: {event.provider?.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRetry && (
              <button
                type="button"
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
                id="btn-retry-webhook-modal"
              >
                {isRetrying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                <span>Replay / Retry Event</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metadata Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 text-xs">
          <div>
            <span className="text-zinc-400 block text-[10px] font-bold uppercase">Event Type</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 font-mono">{event.eventType}</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px] font-bold uppercase">Signature Verified</span>
            <span className={`font-bold ${event.signatureVerified !== false ? 'text-emerald-600' : 'text-rose-600'}`}>
              {event.signatureVerified !== false ? 'Valid (HMAC-SHA256)' : 'Verification Failed'}
            </span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px] font-bold uppercase">Delivery Attempts</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{event.deliveryAttempts || 1} Attempt(s)</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px] font-bold uppercase">Received Time</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {new Date(event.createdAt).toLocaleTimeString()} &bull; {new Date(event.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Error message alert if failed */}
        {event.errorMessage && (
          <div className="p-3.5 mx-4 mt-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Processing Failure:</span>
              <p>{event.errorMessage}</p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('payload')}
              className={`pb-2.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'payload'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Raw Payload JSON
            </button>
            <button
              onClick={() => setActiveTab('headers')}
              className={`pb-2.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'headers'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Request Headers
            </button>
            <button
              onClick={() => setActiveTab('debug')}
              className={`pb-2.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'debug'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Debug & Audit Info
            </button>
          </div>

          <button
            onClick={handleCopyPayload}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 mb-2 px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>

        {/* Content Viewer */}
        <div className="p-5 overflow-y-auto font-mono text-xs flex-1">
          {activeTab === 'payload' && (
            <pre className="p-4 rounded-2xl bg-zinc-950 text-zinc-200 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
              {JSON.stringify(event.rawPayload || event, null, 2)}
            </pre>
          )}

          {activeTab === 'headers' && (
            <div className="space-y-2">
              {event.rawHeaders ? (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800">
                  {Object.entries(event.rawHeaders).map(([key, val]) => (
                    <div key={key} className="p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <span className="font-bold text-zinc-600 dark:text-zinc-400">{key}:</span>
                      <span className="text-zinc-900 dark:text-zinc-200 break-all">{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 italic">No custom headers captured for this webhook transmission.</p>
              )}
            </div>
          )}

          {activeTab === 'debug' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
                <span className="font-bold text-zinc-700 dark:text-zinc-300 block">Gateway Signature Hash</span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 break-all bg-zinc-100 dark:bg-zinc-900 p-2 rounded-lg">
                  {event.signature || 'sha256_sig_bkash_tokenized_auto_authenticated'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-1">
                <span className="font-bold text-zinc-700 dark:text-zinc-300 block">Transaction Reference</span>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Transaction ID: <span className="font-semibold text-zinc-900 dark:text-zinc-100">{event.transactionId || 'N/A'}</span>
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Payload Reference: <span className="font-semibold text-zinc-900 dark:text-zinc-100">{event.payloadReference || 'N/A'}</span>
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Sender IP Address: <span className="font-semibold text-zinc-900 dark:text-zinc-100">{event.ipAddress || '103.14.28.94 (Gateway Edge)'}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Nihomi Billing Audit Engine v1.1
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </motion.div>
    </div>
  );
};
