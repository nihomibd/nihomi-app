import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Receipt,
  RotateCcw,
  BookOpen,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PaymentCallbackViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const PaymentCallbackView: React.FC<PaymentCallbackViewProps> = ({ onNavigate }) => {
  const { refreshSubscription } = useAuth();
  const [params, setParams] = useState<{
    status: string;
    trxID?: string;
    tier?: string;
    amount?: string;
    invoiceNumber?: string;
    error?: string;
  }>({ status: 'loading' });

  useEffect(() => {
    try {
      const search = new URLSearchParams(window.location.search);
      const status = search.get('status') || 'unknown';
      const trxID = search.get('trxID') || undefined;
      const tier = search.get('tier') || undefined;
      const amount = search.get('amount') || undefined;
      const invoiceNumber = search.get('invoiceNumber') || undefined;
      const error = search.get('error') || undefined;

      setParams({
        status,
        trxID,
        tier,
        amount,
        invoiceNumber,
        error,
      });

      if (status === 'success') {
        refreshSubscription?.().catch((err) => {
          console.warn('[PaymentCallbackView] Subscription refresh notice:', err);
        });
      }
    } catch (e) {
      console.error('[PaymentCallbackView] Error parsing search params:', e);
    }
  }, [refreshSubscription]);

  const isSuccess = params.status === 'success';
  const tierNameBn =
    params.tier === 'n5_lifetime' ? 'N5 লাইফটাইম পাস' : 'N5 প্রো (মাসিক)';

  return (
    <div
      className="min-h-screen bg-[#0a0a12] text-slate-100 flex flex-col justify-center items-center px-4 py-16 sm:px-6 lg:px-8"
      id="payment-callback-view"
    >
      <div className="w-full max-w-lg">
        {/* Glow ambient accent */}
        <div className="relative mb-8 text-center">
          <div className="absolute inset-0 -top-12 bg-gradient-to-r from-red-600/20 via-pink-600/20 to-amber-600/20 blur-3xl opacity-50 pointer-events-none" />

          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mb-4"
            >
              <XCircle className="w-10 h-10" />
            </motion.div>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {isSuccess ? 'পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!' : 'পেমেন্ট সম্পন্ন হয়নি'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {isSuccess
              ? `অভিনন্দন! আপনার ${tierNameBn} অ্যাক্টিভ হয়েছে।`
              : params.error
              ? `সমস্যার কারণ: ${params.error}`
              : 'bKash লেনদেন বাতিল বা ব্যর্থ হয়েছে। আপনার কোনো টাকা কাটা হয়নি।'}
          </p>
        </div>

        {/* Receipt Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#121220] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {isSuccess ? (
            <>
              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold text-lg">
                    ৳
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      অফিসিয়াল পেমেন্ট রসিদ
                    </h2>
                    <p className="text-xs text-slate-400">bKash Tokenized Gateway (PGW)</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> ভেরিফায়েড
                </span>
              </div>

              {/* Data Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                  <span className="text-slate-400">সাবস্ক্রিপশন প্ল্যান:</span>
                  <span className="font-semibold text-white">{tierNameBn}</span>
                </div>

                {params.amount && (
                  <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                    <span className="text-slate-400">পরিশোধিত অর্থ:</span>
                    <span className="font-bold text-amber-400">৳{params.amount} BDT</span>
                  </div>
                )}

                {params.trxID && (
                  <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                    <span className="text-slate-400">bKash TrxID:</span>
                    <span className="font-mono font-bold text-pink-400">{params.trxID}</span>
                  </div>
                )}

                {params.invoiceNumber && (
                  <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                    <span className="text-slate-400">ইনভয়েস নম্বর:</span>
                    <span className="font-mono text-slate-300">{params.invoiceNumber}</span>
                  </div>
                )}
              </div>

              {/* Unlocked Capabilities */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> আনলককৃত ফিচারসমূহ:
                </p>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>মিন্না নো নিহোঙ্গো পূর্ণাঙ্গ ব্যাকরণ ব্যাংক (লেসন ১ - ২৫)</li>
                  <li>আনলিমিটেড AI সেনসেই স্পিকিং ও কনভারসেশনাল গাইড</li>
                  <li>JLPT N5 ফুল অফিসিয়াল মক এক্সাম ও বিস্তারিত অ্যানালাইসিস</li>
                  <li>স্মার্ট স্পেসড রিপিটিশন (SRS) ফ্ল্যাশ কার্ড ইঞ্জিন</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('portal')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20 transition-all"
                  id="btn-goto-portal"
                >
                  স্টাডি ড্যাশবোর্ডে প্রবেশ করুন <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('mock-exam-runner')}
                  className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-700"
                  id="btn-start-mock-exam"
                >
                  <Award className="w-4 h-4 text-amber-400" /> JLPT N5 মক টেস্ট শুরু করুন
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center py-4 space-y-3">
                <p className="text-sm text-slate-300">
                  লেনদেন সম্পন্ন হতে কোনো সমস্যা হয়েছে? bKash ব্যালেন্স বা ওটিপি চেক করে আবার চেষ্টা করতে পারেন।
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('pricing')}
                  className="w-full py-3 px-4 bg-[#e2136e] hover:bg-[#c90f61] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                  id="btn-retry-payment"
                >
                  <RotateCcw className="w-4 h-4" /> আবার চেষ্টা করুন (Pricing)
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('portal')}
                  className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
                  id="btn-back-dashboard"
                >
                  ড্যাশবোর্ডে ফিরে যান
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};
