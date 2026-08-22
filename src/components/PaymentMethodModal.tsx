import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  X,
  Loader2,
  AlertCircle,
  Smartphone,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { billingApi } from '../lib/billingApi';
import { SavedPaymentMethod } from '../types';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newMethod: SavedPaymentMethod, message: string) => void;
}

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [methodType, setMethodType] = useState<'bkash' | 'card'>('bkash');
  
  // bKash Form State
  const [bKashNumber, setBKashNumber] = useState('');
  const [bKashAgreed, setBKashAgreed] = useState(true);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [isDefault, setIsDefault] = useState(true);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  // Format bKash Number (digits only, max 11)
  const handleBkashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
    setBKashNumber(raw);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (methodType === 'bkash') {
      const clean = bKashNumber.replace(/\D/g, '');
      if (clean.length !== 11 || !clean.startsWith('01')) {
        setErrorMessage('Please enter a valid 11-digit Bangladesh bKash number starting with 01 (e.g. 01712345678).');
        return;
      }
      if (!bKashAgreed) {
        setErrorMessage('Please agree to authorize bKash tokenized recurring charges.');
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await billingApi.addPaymentMethod({
          type: 'bkash',
          bKashNumber: clean,
          isDefault
        });
        if (res.success) {
          onSuccess(res.paymentMethod, res.message);
          onClose();
        } else {
          setErrorMessage(res.message || 'Failed to link bKash wallet.');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to communicate with payment gateway.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const cleanCard = cardNumber.replace(/\D/g, '');
      if (cleanCard.length < 13 || cleanCard.length > 19) {
        setErrorMessage('Please enter a valid 16-digit debit/credit card number.');
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry.trim())) {
        setErrorMessage('Please enter a valid expiration date in MM/YY format.');
        return;
      }
      if (cardCvc.trim().length < 3) {
        setErrorMessage('Please enter a valid 3 or 4-digit CVV/CVC code.');
        return;
      }
      if (cardHolderName.trim().length < 2) {
        setErrorMessage('Please enter the full cardholder name.');
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await billingApi.addPaymentMethod({
          type: 'card',
          cardNumber: cleanCard,
          cardExpiry: cardExpiry.trim(),
          cardCvc: cardCvc.trim(),
          cardHolderName: cardHolderName.trim(),
          isDefault
        });
        if (res.success) {
          onSuccess(res.paymentMethod, res.message);
          onClose();
        } else {
          setErrorMessage(res.message || 'Failed to link card.');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to authenticate payment card.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" id="payment-method-modal-overlay">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 flex items-center justify-center text-red-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Update Payment Method
              </h3>
              <p className="text-xs text-zinc-500">
                Link a new bKash wallet or Card for recurring subscription charges
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            id="btn-close-payment-method-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Payment Method Selector Tabs */}
          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Select Payment Method Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMethodType('bkash');
                  setErrorMessage(null);
                }}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all text-left ${
                  methodType === 'bkash'
                    ? 'border-red-500 bg-red-50/60 dark:bg-red-950/40 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 text-zinc-600 dark:text-zinc-400'
                }`}
                id="btn-select-bkash-method"
              >
                <div className="w-8 h-8 rounded-lg bg-pink-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  bK
                </div>
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <span>bKash Wallet</span>
                    {methodType === 'bkash' && <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />}
                  </div>
                  <span className="text-[11px] text-zinc-500 block">Tokenized auto-debit</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethodType('card');
                  setErrorMessage(null);
                }}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all text-left ${
                  methodType === 'card'
                    ? 'border-red-500 bg-red-50/60 dark:bg-red-950/40 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 text-zinc-600 dark:text-zinc-400'
                }`}
                id="btn-select-card-method"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <span>Card / SSLCommerz</span>
                    {methodType === 'card' && <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />}
                  </div>
                  <span className="text-[11px] text-zinc-500 block">Visa, Mastercard, AMEX</span>
                </div>
              </button>
            </div>
          </div>

          {/* Error Message banner */}
          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Dynamic Fields */}
          {methodType === 'bkash' ? (
            <div className="space-y-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
              <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold text-xs">
                <Smartphone className="w-4 h-4" />
                <span>bKash Direct Agreement Authorization</span>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  bKash Account Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={bKashNumber}
                    onChange={handleBkashChange}
                    placeholder="01712345678"
                    maxLength={11}
                    required
                    className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                    id="input-bkash-number"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-pink-600">
                    BD 🇧🇩
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Enter your 11-digit personal bKash account number for tokenized recurring billing.
                </p>
              </div>

              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bKashAgreed}
                  onChange={(e) => setBKashAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-zinc-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  I authorize Nihomi to save this bKash account as a tokenized agreement for my recurring subscription renewals. You can cancel or change this anytime.
                </span>
              </label>
            </div>
          ) : (
            <div className="space-y-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Cardholder Full Name
                </label>
                <input
                  type="text"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  placeholder="MD TANVIR KABIR"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-red-500"
                  id="input-cardholder-name"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4111 2222 3333 4444"
                    maxLength={19}
                    required
                    className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-red-500"
                    id="input-card-number"
                  />
                  <CreditCard className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    placeholder="12/28"
                    maxLength={5}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-center focus:outline-none focus:ring-2 focus:ring-red-500"
                    id="input-card-expiry"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    CVC / CVV
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      required
                      className="w-full pl-3 pr-8 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-center focus:outline-none focus:ring-2 focus:ring-red-500"
                      id="input-card-cvc"
                    />
                    <Lock className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Set as Default Option */}
          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded border-zinc-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">
              Set as active default payment method for recurring renewals
            </span>
          </label>

          {/* Security Assurance */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>256-bit TLS encrypted tokenization compliant with Bangladesh Bank PSD guidelines.</span>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              id="btn-cancel-payment-modal"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold shadow-sm flex items-center gap-2 transition-colors"
              id="btn-save-payment-method"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing Token...</span>
                </>
              ) : (
                <span>Confirm & Link Method</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
