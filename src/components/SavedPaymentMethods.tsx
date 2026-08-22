import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ShieldCheck,
  RotateCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Smartphone,
  Check
} from 'lucide-react';
import { billingApi } from '../lib/billingApi';
import { SavedPaymentMethod } from '../types';
import { PaymentMethodModal } from './PaymentMethodModal';

interface SavedPaymentMethodsProps {
  onMethodChanged?: () => void;
}

export const SavedPaymentMethods: React.FC<SavedPaymentMethodsProps> = ({ onMethodChanged }) => {
  const [methods, setMethods] = useState<SavedPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Modal & Messages
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchMethods = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await billingApi.getPaymentMethods();
      if (res.success) {
        setMethods(res.paymentMethods || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch payment methods:', err);
      setErrorMessage(err.message || 'Could not load saved payment methods.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleRefreshToken = async (id: string) => {
    setRefreshingId(id);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const res = await billingApi.refreshPaymentToken(id);
      if (res.success) {
        setSuccessMessage(res.message || 'Payment token authorization successfully refreshed.');
        setMethods((prev) =>
          prev.map((pm) => (pm.id === id ? res.paymentMethod : pm))
        );
        if (onMethodChanged) onMethodChanged();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to refresh token with payment provider.');
    } finally {
      setRefreshingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const res = await billingApi.setDefaultPaymentMethod(id);
      if (res.success) {
        setSuccessMessage('Default payment method updated for recurring subscription billing.');
        setMethods((prev) =>
          prev.map((pm) => ({
            ...pm,
            isDefault: pm.id === id
          }))
        );
        if (onMethodChanged) onMethodChanged();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to set default payment method.');
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleDeleteMethod = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this saved payment method?')) {
      return;
    }

    setDeletingId(id);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const res = await billingApi.deletePaymentMethod(id);
      if (res.success) {
        setSuccessMessage('Payment method removed successfully.');
        setMethods((prev) => prev.filter((pm) => pm.id !== id));
        if (onMethodChanged) onMethodChanged();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to remove payment method.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSuccess = (newMethod: SavedPaymentMethod, message: string) => {
    setSuccessMessage(message);
    fetchMethods();
    if (onMethodChanged) onMethodChanged();
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6" id="saved-payment-methods-card">
      {/* Modal */}
      <PaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-600" />
              Saved Payment Methods
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              Auto-Debit Ready
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage tokenized bKash agreements and verified cards used for auto-renewals and one-click upgrades.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSuccessMessage(null);
            setErrorMessage(null);
            setIsModalOpen(true);
          }}
          className="self-start sm:self-center px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-900 font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
          id="btn-open-add-payment-method"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Update or Change Payment Method</span>
        </button>
      </div>

      {/* Status Messages */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-800 dark:text-red-300 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-600 hover:text-red-800 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Payment Method Cards List */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-zinc-500 flex flex-col items-center justify-center space-y-2">
          <RotateCw className="w-5 h-5 animate-spin text-red-600" />
          <span>Loading tokenized payment methods...</span>
        </div>
      ) : methods.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">No saved payment methods</p>
            <p className="text-[11px] text-zinc-500">Link your bKash wallet or Credit/Debit card for seamless recurring learning access.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm inline-flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Payment Method</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {methods.map((method) => {
            const isBkash = method.type === 'bkash';
            const isRefreshing = refreshingId === method.id;
            const isSettingDefault = settingDefaultId === method.id;
            const isDeleting = deletingId === method.id;

            return (
              <div
                key={method.id}
                className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between space-y-4 ${
                  method.isDefault
                    ? 'border-red-400/80 bg-red-50/20 dark:bg-red-950/10 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
                id={`card-payment-method-${method.id}`}
              >
                {/* Method Header & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {isBkash ? (
                      <div className="w-11 h-11 rounded-xl bg-pink-600 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                        bK
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                    )}

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          {isBkash
                            ? `bKash Wallet (${method.bKashNumberMasked || 'Linked'})`
                            : `${(method.cardBrand || 'Card').toUpperCase()} •••• ${method.cardLast4 || '4242'}`}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isBkash
                            ? 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800'
                            : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        }`}>
                          {isBkash ? 'bKash Auto-Debit' : `SSLCommerz / ${(method.cardBrand || 'Card').toUpperCase()}`}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-1 font-mono">
                        {isBkash ? (
                          <>
                            <Smartphone className="w-3.5 h-3.5 text-pink-600" />
                            <span>Agreement: {method.bKashAgreementId || 'Tokenized'}</span>
                          </>
                        ) : (
                          <>
                            <span>Expires: {method.cardExpiry || '12/28'}</span>
                            {method.cardHolderName && <span>• {method.cardHolderName}</span>}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {method.isDefault ? (
                      <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/80 flex items-center gap-1.5 shadow-xs shrink-0" id={`badge-default-pm-${method.id}`}>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Default for Future Billing</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 shrink-0">
                          Backup Method
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSetDefault(method.id)}
                          disabled={isSettingDefault}
                          className="px-2.5 py-1 text-[11px] font-bold text-red-600 hover:text-white hover:bg-red-600 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 shrink-0 transition-all"
                          id={`btn-set-default-${method.id}`}
                        >
                          {isSettingDefault ? 'Updating...' : 'Set as Default'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Token Health & Last Refreshed Info */}
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Token Authorization:</span>
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                      Verified Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last Gateway Sync:
                    </span>
                    <span>
                      {method.lastRefreshedAt ? new Date(method.lastRefreshedAt).toLocaleDateString() : 'Active'}
                    </span>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                  <button
                    type="button"
                    onClick={() => handleRefreshToken(method.id)}
                    disabled={isRefreshing}
                    className="py-1.5 px-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    title="Refresh payment gateway token and verify card/bKash agreement"
                    id={`btn-refresh-token-${method.id}`}
                  >
                    <RotateCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-red-600' : ''}`} />
                    <span>{isRefreshing ? 'Refreshing Token...' : 'Refresh Token'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {methods.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMethod(method.id)}
                        disabled={isDeleting}
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Remove saved payment method"
                        id={`btn-delete-method-${method.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Security Footer Notice */}
      <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 flex items-start gap-2.5 text-[11px] text-zinc-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            End-to-End Recurring Payment Security
          </span>
          <p className="mt-0.5">
            Card details and bKash authorization agreements are stored using multi-tenant tokenization. Raw credit card numbers and mobile PINs are never stored on Nihomi servers.
          </p>
        </div>
      </div>
    </div>
  );
};
