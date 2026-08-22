import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Sparkles,
  ArrowRight,
  Receipt,
  Lock,
  Tag,
  Loader2,
  Check,
  Building2,
  Calendar,
  Gift
} from 'lucide-react';
import { Plan, PlanId, BillingInterval, PaymentProviderType } from '../types';
import { billingApi } from '../lib/billingApi';
import { useAuth } from '../context/AuthContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: Plan | null;
  plan?: Plan | null;
  initialInterval?: BillingInterval;
  onSuccess?: () => void;
}

type CheckoutStep = 'configure' | 'payment_method' | 'processing' | 'success';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  plan,
  initialInterval = 'yearly',
  onSuccess
}) => {
  const activePlan = selectedPlan || plan;
  const { user, profile, refreshSubscription } = useAuth();
  const [step, setStep] = useState<CheckoutStep>('configure');
  const [interval, setInterval] = useState<BillingInterval>(initialInterval);
  const [provider, setProvider] = useState<PaymentProviderType>('bkash');
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: 'percent' | 'fixed';
    discountValue: number;
    discountAmount: number;
    finalAmount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Checkout process state
  const [isInitiating, setIsInitiating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentInitiationData, setPaymentInitiationData] = useState<any>(null);

  // Gateway form fields
  const [accountNumber, setAccountNumber] = useState('01812345678');
  const [otp, setOtp] = useState('123456');
  const [pin, setPin] = useState('12345');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Success result
  const [completedInvoice, setCompletedInvoice] = useState<any>(null);

  if (!isOpen || !activePlan) return null;

  const basePrice = interval === 'yearly' ? activePlan.yearlyPrice : activePlan.monthlyPrice;
  const finalPrice = appliedCoupon ? appliedCoupon.finalAmount : basePrice;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const savingsAmount = interval === 'yearly' ? Math.max(0, activePlan.monthlyPrice * 12 - activePlan.yearlyPrice) : 0;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError(null);
    try {
      const res = await billingApi.validateCoupon({
        code: couponCode.trim(),
        planId: activePlan.id,
        billingInterval: interval
      });
      setAppliedCoupon({
        code: res.code,
        discountType: res.discountType,
        discountValue: res.discountValue,
        discountAmount: res.discountAmount,
        finalAmount: res.finalAmount
      });
    } catch (err: any) {
      setCouponError(err.message || 'Invalid or expired promo code.');
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  const handleProceedToPayment = async () => {
    setIsInitiating(true);
    setErrorMessage(null);
    try {
      const initRes = await billingApi.initiateCheckout({
        planId: activePlan.id,
        billingInterval: interval,
        provider,
        couponCode: appliedCoupon?.code
      });
      setPaymentInitiationData(initRes);
      setStep('payment_method');
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to initiate checkout. Please try again.');
    } finally {
      setIsInitiating(false);
    }
  };

  const handleVerifyAndPay = async () => {
    if (!paymentInitiationData) return;
    setIsVerifying(true);
    setErrorMessage(null);
    try {
      const verifyRes = await billingApi.verifyPayment({
        paymentId: paymentInitiationData.paymentId,
        accountNumber,
        otp,
        pin,
        providerData: {
          cardNumber,
          cardExpiry,
          cardCvv,
          gateway: provider
        }
      });

      if (verifyRes.success) {
        setCompletedInvoice(verifyRes.invoice);
        await refreshSubscription();
        setStep('success');
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment verification failed. Please re-check credentials.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto" id="checkout-modal-backdrop">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8"
        id="checkout-modal-container"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/10 text-red-600 flex items-center justify-center font-bold text-sm">
              日
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Complete Nihomi Subscription
              </h2>
              <p className="text-xs text-zinc-500">Secure 256-bit encrypted checkout (Bangladesh BDT ৳)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            id="btn-close-checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl flex items-start gap-3 text-red-700 dark:text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Transaction Notice</p>
                <p className="text-xs mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'configure' && (
              <motion.div
                key="step-configure"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                {/* Plan Overview Card */}
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                        {activePlan.displayNameJa || '日本語プラン'}
                      </span>
                      {activePlan.badge && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                          {activePlan.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{activePlan.name} Plan</h3>
                    <p className="text-xs text-zinc-500 max-w-sm">{activePlan.tagline}</p>
                  </div>

                  {/* Billing Frequency Toggle */}
                  <div className="flex items-center bg-zinc-200/80 dark:bg-zinc-700/60 p-1 rounded-xl self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        setInterval('monthly');
                        if (appliedCoupon) handleRemoveCoupon();
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        interval === 'monthly'
                          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                      }`}
                      id="toggle-interval-monthly"
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInterval('yearly');
                        if (appliedCoupon) handleRemoveCoupon();
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                        interval === 'yearly'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                      }`}
                      id="toggle-interval-yearly"
                    >
                      <span>Annual</span>
                      <span className="text-[10px] bg-red-700 text-white px-1.5 py-0.2 rounded-full font-bold">
                        Save 30%
                      </span>
                    </button>
                  </div>
                </div>

                {/* Gateway Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                    Select Payment Gateway (Bangladesh Authorized)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setProvider('bkash')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                        provider === 'bkash'
                          ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/20 ring-2 ring-pink-500/20'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                      }`}
                      id="provider-bkash"
                    >
                      <div className="w-7 h-7 rounded-lg bg-pink-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        bK
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          bKash MFS
                        </p>
                        <p className="text-[10px] text-zinc-500 truncate">Auto-Debit</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProvider('sslcommerz')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                        provider === 'sslcommerz'
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/20'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                      }`}
                      id="provider-sslcommerz"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        <CreditCard className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          Cards & Banking
                        </p>
                        <p className="text-[10px] text-zinc-500 truncate">VISA / MC</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProvider('apple_pay')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                        provider === 'apple_pay'
                          ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm ring-2 ring-zinc-500/20'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                      }`}
                      id="provider-apple-pay"
                    >
                      <div className="w-7 h-7 rounded-lg bg-black text-white font-bold text-xs flex items-center justify-center shrink-0">
                        
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${provider === 'apple_pay' ? 'text-white' : 'text-zinc-900 dark:text-zinc-100'}`}>
                          Apple Pay
                        </p>
                        <p className={`text-[10px] truncate ${provider === 'apple_pay' ? 'text-zinc-300' : 'text-zinc-500'}`}>Biometric 1-Click</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProvider('google_pay')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                        provider === 'google_pay'
                          ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                      }`}
                      id="provider-google-pay"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 text-zinc-800 font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                        GPay
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          Google Pay
                        </p>
                        <p className="text-[10px] text-zinc-500 truncate">Google Wallet</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-dashed border-zinc-300 dark:border-zinc-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Have a Promo or Referral Code? (e.g. NIHOMI20, LAUNCH50)
                    </span>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>
                          Code <strong>{appliedCoupon.code}</strong> applied! Saved ৳{appliedCoupon.discountAmount}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-zinc-500 hover:text-red-600 font-medium underline text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter Promo Code"
                        className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 uppercase"
                        id="input-coupon-code"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponCode.trim()}
                        className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 disabled:opacity-50 flex items-center gap-1.5"
                        id="btn-apply-coupon"
                      >
                        {isApplyingCoupon && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Apply
                      </button>
                    </div>
                  )}

                  {couponError && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{couponError}</p>}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-sm">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400 text-xs">
                    <span>
                      {selectedPlan.name} ({interval === 'yearly' ? 'Annual Plan' : 'Monthly Plan'})
                    </span>
                    <span>৳{basePrice.toLocaleString()}</span>
                  </div>

                  {savingsAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 text-xs">
                      <span>Annual Tier Pre-Pay Savings</span>
                      <span>-৳{savingsAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 text-xs">
                      <span>Promo Discount ({appliedCoupon?.code})</span>
                      <span>-৳{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400 text-xs">
                    <span>VAT & Gateway Processing Fee</span>
                    <span className="text-emerald-600 font-medium">৳0 (Included)</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-zinc-200 dark:border-zinc-700 text-base font-bold text-zinc-900 dark:text-zinc-100">
                    <div>
                      <span>Total Amount Payable</span>
                      <p className="text-[11px] font-normal text-zinc-500">
                        {interval === 'yearly' ? 'Covers 365 Days Full Access' : 'Covers 30 Days Full Access'}
                      </p>
                    </div>
                    <span className="text-2xl text-red-600 font-extrabold">৳{finalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  disabled={isInitiating}
                  className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  id="btn-proceed-to-payment"
                >
                  {isInitiating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Initiating Secure Session...
                    </>
                  ) : (
                    <>
                      <span>Proceed to {provider === 'bkash' ? 'bKash' : provider === 'sslcommerz' ? 'Card / Bank' : 'Gateway'} Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {step === 'payment_method' && (
              <motion.div
                key="step-payment"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {/* Gateway Specific Header */}
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center font-bold">
                      {provider === 'bkash' ? <Smartphone className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {provider === 'bkash' ? 'bKash Mobile Payment Gateway' : 'SSLCommerz Card Gateway'}
                      </h4>
                      <p className="text-xs text-zinc-500">Ref: {paymentInitiationData?.providerReference || 'TX-PENDING'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-500 block">Amount</span>
                    <span className="text-lg font-bold text-red-600">৳{finalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {provider === 'bkash' && (
                  <div className="space-y-4 p-4 rounded-xl border border-pink-200 dark:border-pink-900/40 bg-pink-50/30 dark:bg-pink-950/10">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        bKash Account Number (11-digit)
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono"
                        id="input-bkash-number"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                          Verification OTP Code
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="123456"
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono"
                          id="input-bkash-otp"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                          bKash PIN (Encrypted)
                        </label>
                        <input
                          type="password"
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          placeholder="•••••"
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono"
                          id="input-bkash-pin"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      Your PIN is securely processed directly with the gateway and never stored.
                    </p>
                  </div>
                )}

                {provider === 'sslcommerz' && (
                  <div className="space-y-4 p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/10">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Debit / Credit Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono"
                        id="input-card-number"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono"
                          id="input-card-expiry"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono"
                          id="input-card-cvv"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {provider === 'shurjopay' && (
                  <div className="space-y-3 p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/10">
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Mobile Wallet Account Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono"
                      id="input-sp-number"
                    />
                  </div>
                )}

                {provider === 'apple_pay' && (
                  <div className="space-y-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 text-center">
                    <div className="w-12 h-12 rounded-full bg-black text-white text-2xl flex items-center justify-center mx-auto shadow-sm">
                      
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Apple Pay Biometric Express</p>
                      <p className="text-[11px] text-zinc-500">
                        Click 'Confirm & Pay' to authenticate with FaceID or TouchID on your Apple device.
                      </p>
                    </div>
                  </div>
                )}

                {provider === 'google_pay' && (
                  <div className="space-y-3 p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20 text-center">
                    <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 text-blue-600 font-bold text-sm flex items-center justify-center mx-auto shadow-xs">
                      GPay
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Google Wallet 1-Click Pay</p>
                      <p className="text-[11px] text-zinc-500">
                        Pay securely using your saved cards in your Google Account.
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('configure')}
                    disabled={isVerifying}
                    className="py-3 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    id="btn-back-to-configure"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyAndPay}
                    disabled={isVerifying}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    id="btn-confirm-and-pay"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying Transaction with Gateway...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm & Pay ৳{finalPrice.toLocaleString()}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && completedInvoice && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Payment Verified & Activated
                  </span>
                  <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
                    Welcome to Nihomi {selectedPlan.name}!
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Your subscription is active and all {selectedPlan.name} learning modules are unlocked.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-left text-xs space-y-2">
                  <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-700 pb-2">
                    <span className="text-zinc-500">Invoice ID</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{completedInvoice.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Plan</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{completedInvoice.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Billing Period</span>
                    <span className="text-zinc-900 dark:text-zinc-100">{completedInvoice.billingPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Amount Paid</span>
                    <span className="font-bold text-emerald-600">৳{completedInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Payment Gateway</span>
                    <span className="text-zinc-900 dark:text-zinc-100">{completedInvoice.paymentMethodName}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-6 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-sm shadow-md hover:bg-zinc-800 transition-all"
                    id="btn-start-learning-now"
                  >
                    Start Learning Now
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer Trust Messaging */}
        {step !== 'success' && (
          <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Secure Transaction & Instant Activation</span>
            </div>
            <span>Questions? support@nihomi.com</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
