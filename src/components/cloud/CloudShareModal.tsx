// src/components/cloud/CloudShareModal.tsx
// Nihomi Cloud V1 — Time-Limited Cryptographic Share Link Generator

import React, { useState } from 'react';
import { X, Share2, Copy, CheckCircle2, Clock, ShieldCheck, Link2 } from 'lucide-react';
import { CloudFile, CloudShare } from '../../types/cloud';
import { cloudApi } from '../../lib/cloudApi';

interface CloudShareModalProps {
  file: CloudFile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CloudShareModal: React.FC<CloudShareModalProps> = ({
  file,
  isOpen,
  onClose,
}) => {
  const [expiresInHours, setExpiresInHours] = useState<number>(72);
  const [createdShare, setCreatedShare] = useState<CloudShare | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !file) return null;

  const handleCreateShare = async () => {
    setIsGenerating(true);
    try {
      const share = await cloudApi.createShare(file.id, expiresInHours);
      setCreatedShare(share);
    } catch (err: any) {
      alert(err.message || 'Failed to create share link.');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareUrl = createdShare
    ? `${window.location.origin}/share/cloud/${createdShare.token}`
    : '';

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="cloud-share-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="cloud-share-modal"
        className="w-full max-w-md bg-white dark:bg-[#0e0e18] border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-stone-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Share Document Securely
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-xs">
                {file.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {!createdShare ? (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Link Expiration Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { hours: 24, label: '24 Hours' },
                    { hours: 72, label: '3 Days' },
                    { hours: 168, label: '7 Days' },
                  ].map((option) => (
                    <button
                      key={option.hours}
                      type="button"
                      onClick={() => setExpiresInHours(option.hours)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        expiresInHours === option.hours
                          ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 border-transparent shadow-sm'
                          : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 flex items-start gap-2.5 text-xs text-stone-600 dark:text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  Zero-exposure architecture: Link is signed cryptographically and automatically expires. You can revoke it at any time.
                </p>
              </div>

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleCreateShare}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-md shadow-red-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isGenerating ? 'Generating Link...' : 'Create Secure Share Link'}
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Link generated successfully!</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Shareable Link
                </label>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 px-3 py-2 bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-mono text-stone-800 dark:text-stone-200 truncate">
                    {shareUrl}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="p-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 font-bold hover:bg-stone-800 dark:hover:bg-white transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-stone-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Expires on {new Date(createdShare.expiresAt).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
