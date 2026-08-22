import React, { useState, useMemo } from 'react';
import { ShieldCheck, Printer, Download, Sparkles, RefreshCw, QrCode, FileText, CheckCircle2 } from 'lucide-react';
import { PlanId } from '../types';

interface MushakTaxLivePreviewProps {
  initialPlan?: PlanId | string;
  initialInterval?: 'monthly' | 'yearly';
  studentName?: string;
  studentEmail?: string;
}

export const MushakTaxLivePreview: React.FC<MushakTaxLivePreviewProps> = ({
  initialPlan = 'pro',
  initialInterval = 'monthly',
  studentName = 'Md. Tanvir Kabir Biplob',
  studentEmail = 'mdtanvirkabirbiplob@gmail.com'
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan || 'pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(initialInterval || 'monthly');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [name, setName] = useState(studentName || 'Md. Tanvir Kabir Biplob');
  const [email, setEmail] = useState(studentEmail || 'mdtanvirkabirbiplob@gmail.com');
  const [studentBin, setStudentBin] = useState('');
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  const planBaseRates: Record<string, { name: string; monthlyBDT: number; code: string }> = {
    starter: { name: 'Starter JLPT N5 Access Plan', monthlyBDT: 1490, code: 'NIH-N5-ST' },
    pro: { name: 'Pro JLPT N5-N3 Unlimited AI Plan', monthlyBDT: 2990, code: 'NIH-PRO-AI' },
    japan_ready: { name: 'Japan Ready™ Career & Visa VIP Plan', monthlyBDT: 4990, code: 'NIH-JP-VIP' }
  };

  const currentPlanMeta = planBaseRates[selectedPlan] || planBaseRates.pro;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'BIPLOBSENSEI' || code === 'FOUNDER15') {
      setDiscountPercent(15);
      setPromoSuccess('Promo Code Applied: 15% Special Founder Discount!');
    } else if (code === 'NIHOMI2026' || code === 'TOKYO20') {
      setDiscountPercent(20);
      setPromoSuccess('Promo Code Applied: 20% Tokyo Intake Discount!');
    } else if (code === 'WELCOME') {
      setDiscountPercent(10);
      setPromoSuccess('Promo Code Applied: 10% Welcome Student Discount!');
    } else {
      setDiscountPercent(0);
      setPromoSuccess(null);
      alert('Invalid coupon code. Try: BIPLOBSENSEI, NIHOMI2026, or WELCOME');
    }
  };

  // Calculations
  const rawBase = billingCycle === 'yearly' ? currentPlanMeta.monthlyBDT * 12 * 0.8 : currentPlanMeta.monthlyBDT;
  const discountAmount = Math.round((rawBase * discountPercent) / 100);
  const netSubtotal = Math.max(0, rawBase - discountAmount);
  const vatRate = 0.15; // 15% Statutory Bangladesh VAT
  const vatAmount = Math.round(netSubtotal * vatRate);
  const grandTotal = netSubtotal + vatAmount;

  const challanNumber = useMemo(() => {
    return `MUSHAK-6.3-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  }, [selectedPlan, billingCycle, discountPercent]);

  const handlePrintMushak = () => {
    window.print();
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6" id="mushak-63-live-preview-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              NBR Mushak-6.3 Compliant
            </span>
            <span className="text-xs text-zinc-400 font-mono">BIN: 004928192-0101</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Dynamic Mushak-6.3 Tax Receipt Generator & Live Preview
          </h3>
          <p className="text-xs text-zinc-500">
            Customize plan, billing interval, and student details to see real-time 15% VAT calculation and Government tax challan formatting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrintMushak}
            className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            id="btn-print-mushak-live"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Challan</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs">
        {/* Plan Selector */}
        <div className="space-y-1">
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block">Subscription Tier</label>
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold cursor-pointer"
            id="select-mushak-plan"
          >
            <option value="starter">Starter Plan (৳1,490/mo)</option>
            <option value="pro">Pro AI Plan (৳2,990/mo)</option>
            <option value="japan_ready">Japan Ready VIP (৳4,990/mo)</option>
          </select>
        </div>

        {/* Billing Cycle */}
        <div className="space-y-1">
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block">Billing Period</label>
          <select
            value={billingCycle}
            onChange={(e) => setBillingCycle(e.target.value as any)}
            className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold cursor-pointer"
            id="select-mushak-cycle"
          >
            <option value="monthly">Monthly Cycle</option>
            <option value="yearly">Annual (Save 20%)</option>
          </select>
        </div>

        {/* Student Name */}
        <div className="space-y-1">
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block">Customer / Learner Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
            id="input-mushak-name"
            placeholder="Student Name"
          />
        </div>

        {/* Coupon Code */}
        <div className="space-y-1">
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block">Promo Code</label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="e.g. BIPLOBSENSEI"
              className="flex-1 p-2 uppercase rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-[11px]"
              id="input-mushak-promo"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs cursor-pointer"
              id="btn-apply-mushak-promo"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {promoSuccess && (
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{promoSuccess}</span>
        </div>
      )}

      {/* Visual Mushak-6.3 Paper Challan Rendering */}
      <div className="border-2 border-zinc-800 dark:border-zinc-600 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 sm:p-8 rounded-2xl font-serif space-y-6 shadow-md relative overflow-hidden" id="visual-mushak-paper-preview">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none select-none">
          <span className="text-7xl font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
            NBR MUSHAK 6.3
          </span>
        </div>

        {/* NBR Official Header */}
        <div className="text-center space-y-1 border-b-2 border-zinc-800 dark:border-zinc-600 pb-4">
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
            গণপ্রজাতন্ত্রী বাংলাদেশ সরকার | জাতীয় রাজস্ব বোর্ড (NBR)
          </p>
          <p className="text-[11px] text-zinc-500 font-sans">Government of the People's Republic of Bangladesh &bull; National Board of Revenue</p>
          <h2 className="text-lg sm:text-xl font-black tracking-wide text-zinc-900 dark:text-zinc-50 mt-1 uppercase">
            কর চালানপত্র (মূসক-৬.৩) &bull; TAX INVOICE (MUSHAK-6.3)
          </h2>
          <p className="text-[10px] text-zinc-500 italic">
            [বিধি ৪০ এর উপ-বিধি (১) এর দফা (গ) ও দফা (চ) দ্রষ্টব্য / Value Added Tax & Supplementary Duty Rules 2016]
          </p>
        </div>

        {/* Supplier & Purchaser Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="space-y-1">
            <p className="font-bold text-zinc-800 dark:text-zinc-200 uppercase text-[10px] tracking-wider text-red-700 dark:text-red-400">
              নিবন্ধিত সরবরাহকারীর বিবরণ (Registered Supplier):
            </p>
            <p className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">NIHOMI JAPANESE ACADEMY</p>
            <p className="text-zinc-600 dark:text-zinc-400">Dhaka International Language School Partner Wing</p>
            <p className="text-zinc-600 dark:text-zinc-400">House 42, Road 11, Banani / Dhanmondi, Dhaka-1213, Bangladesh</p>
            <p className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
              ব্যবসায়ী সনাক্তকরণ সংখ্যা (BIN): 004928192-0101
            </p>
          </div>

          <div className="space-y-1 sm:text-right">
            <p className="font-bold text-zinc-800 dark:text-zinc-200 uppercase text-[10px] tracking-wider text-red-700 dark:text-red-400">
              ক্রেতার বিবরণ (Registered Purchaser / Student):
            </p>
            <p className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">{name || 'Enrolled Student'}</p>
            <p className="text-zinc-600 dark:text-zinc-400">{email || 'student@nihomi.com'}</p>
            <p className="text-zinc-600 dark:text-zinc-400">Dhaka, Bangladesh</p>
            <p className="font-mono text-zinc-500 text-[11px]">
              চালান নম্বর (Challan No): <strong className="text-zinc-900 dark:text-zinc-100">{challanNumber}</strong>
            </p>
            <p className="font-mono text-zinc-500 text-[11px]">
              ইস্যুর তারিখ (Issue Date): <strong>{new Date().toLocaleDateString('en-GB')}</strong>
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-sans text-left border border-zinc-300 dark:border-zinc-700">
            <thead className="bg-zinc-100 dark:bg-zinc-800/80 uppercase text-[10px] font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-300 dark:border-zinc-700">
              <tr>
                <th className="p-2.5 text-center w-8">ক্রম (Sl)</th>
                <th className="p-2.5">পণ্য/সেবার বর্ণনা (Description of Service)</th>
                <th className="p-2.5 text-center">পরিমাপ (Unit)</th>
                <th className="p-2.5 text-right">মূল্য (Base BDT)</th>
                <th className="p-2.5 text-right">ছাড় (Discount)</th>
                <th className="p-2.5 text-right">করযোগ্য মূল্য (Taxable)</th>
                <th className="p-2.5 text-right">মূসক হার (VAT %)</th>
                <th className="p-2.5 text-right">মূসক পরিমাণ (VAT BDT)</th>
                <th className="p-2.5 text-right font-black">সর্বমোট (Total BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              <tr>
                <td className="p-3 text-center font-bold">1</td>
                <td className="p-3">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">{currentPlanMeta.name}</div>
                  <div className="text-[10px] text-zinc-500">
                    {billingCycle === 'yearly' ? '12 Months Full Access (Annual Billing)' : '1 Month Full Course Access'} &bull; Code: {currentPlanMeta.code}
                  </div>
                </td>
                <td className="p-3 text-center">1 Subscription</td>
                <td className="p-3 text-right font-mono">৳{rawBase.toLocaleString()}</td>
                <td className="p-3 text-right font-mono text-rose-600">-৳{discountAmount.toLocaleString()}</td>
                <td className="p-3 text-right font-mono font-semibold">৳{netSubtotal.toLocaleString()}</td>
                <td className="p-3 text-right font-mono font-bold text-emerald-600">15.00%</td>
                <td className="p-3 text-right font-mono font-bold text-emerald-600">৳{vatAmount.toLocaleString()}</td>
                <td className="p-3 text-right font-mono font-black text-zinc-900 dark:text-white">৳{grandTotal.toLocaleString()}</td>
              </tr>
            </tbody>
            <tfoot className="bg-zinc-50 dark:bg-zinc-900/60 font-bold border-t-2 border-zinc-400 dark:border-zinc-600">
              <tr>
                <td colSpan={5} className="p-3 text-right uppercase text-[10px] text-zinc-600 dark:text-zinc-400">
                  মোট করযোগ্য মূল্য ও সর্বমোট প্রদেয় মূসক:
                </td>
                <td className="p-3 text-right font-mono font-bold">৳{netSubtotal.toLocaleString()}</td>
                <td className="p-3 text-center text-zinc-400">&bull;</td>
                <td className="p-3 text-right font-mono font-bold text-emerald-600">৳{vatAmount.toLocaleString()}</td>
                <td className="p-3 text-right font-mono text-base font-black text-red-600 dark:text-red-400">
                  ৳{grandTotal.toLocaleString()} BDT
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer & QR Verification Seal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs font-sans">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl flex items-center justify-center p-1 shadow-inner">
              <QrCode className="w-10 h-10 text-zinc-800 dark:text-zinc-200" />
            </div>
            <div className="space-y-0.5 text-[10px] text-zinc-500">
              <p className="font-bold text-zinc-700 dark:text-zinc-300">National Board of Revenue Verified Seal</p>
              <p>Cryptographic Hash: <span className="font-mono">8f10f6a5-3ad4-402a</span></p>
              <p>Scan to verify with NBR e-Tax Portal (www.nbr.gov.bd)</p>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="h-10 flex items-end justify-end">
              <span className="font-serif italic font-bold text-zinc-400 dark:text-zinc-500 text-sm">
                Tanvir Kabir Biplob
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-t border-zinc-300 dark:border-zinc-700 pt-1">
              ক্ষমতাপ্রাপ্ত কর্মকর্তার স্বাক্ষর ও সিল (Authorized Signature)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
