// src/app/pricing/page.tsx
// Nihomi (にほみ • Learn & Work) — Pricing Page

'use client';

import React, { useState } from 'react';
import { PLANS, NIHOMI_BRAND } from '@/lib/constants/plans';
import { BillingInterval, PlanId } from '@/types/subscription';

export default function PricingPage() {
  const [interval, setInterval] = useState<BillingInterval>('yearly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planId: PlanId) => {
    if (planId === 'free') {
      window.location.href = '/dashboard';
      return;
    }

    setLoadingPlan(planId);
    try {
      // Mock user context or fetch from session
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          billingInterval: interval,
          provider: 'bkash',
          userId: 'user_current_session', // Handled by auth session on server
          userEmail: 'student@nihomi.com',
          userName: 'Nihomi Student',
        }),
      });

      const data = await res.json();
      if (data.gatewayUrl) {
        window.location.href = data.gatewayUrl;
      } else {
        alert(data.error || 'Unable to initiate checkout');
      }
    } catch {
      alert('Checkout error. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-rose-500 selection:text-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold tracking-wide uppercase">
          <span>日</span> {NIHOMI_BRAND.japaneseName} • {NIHOMI_BRAND.tagline}
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Invest in Your Japanese Future
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          From JLPT N5 mastery to interview readiness in Tokyo. Choose the subscription plan tailored for your career goals.
        </p>

        {/* Interval Switcher */}
        <div className="pt-6 flex justify-center items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center shadow-inner">
            <button
              onClick={() => setInterval('monthly')}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                interval === 'monthly'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setInterval('yearly')}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
                interval === 'yearly'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Save ~30%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {Object.values(PLANS).map((plan) => {
          const pricing = plan.pricing[interval];
          const isPro = plan.id === 'pro';

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                isPro
                  ? 'bg-slate-900 border-2 border-rose-500 shadow-2xl shadow-rose-500/10 scale-105 z-10'
                  : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
              } p-6`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-rose-600 to-orange-500 text-white text-[11px] font-extrabold rounded-full uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div>
                {/* Plan Title & Tag */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                    <p className="text-xs text-rose-400/90 font-medium">{plan.japaneseTitle}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2 min-h-[32px]">{plan.tagline}</p>

                {/* Price Display */}
                <div className="mt-5 pb-5 border-b border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white">
                      {pricing.priceFormatted}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      /{interval === 'yearly' ? 'year' : 'mo'}
                    </span>
                  </div>

                  {interval === 'yearly' && plan.pricing.yearly.monthlyEquivalent > 0 && (
                    <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                      ৳{Math.round(plan.pricing.yearly.monthlyEquivalent)}/month equivalent
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="mt-6 space-y-2.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Included Features:
                  </div>
                  {plan.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 text-xs ${
                        feat.included
                          ? feat.highlight
                            ? 'text-white font-medium'
                            : 'text-slate-300'
                          : 'text-slate-600 line-through'
                      }`}
                    >
                      <span className={feat.included ? 'text-emerald-400 font-bold' : 'text-slate-700'}>
                        {feat.included ? '✓' : '×'}
                      </span>
                      <span>{feat.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                <button
                  disabled={loadingPlan === plan.id}
                  onClick={() => handleSelectPlan(plan.id as PlanId)}
                  className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition shadow-lg ${
                    isPro
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                      : plan.id === 'japan_ready'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-orange-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  } disabled:opacity-50`}
                >
                  {loadingPlan === plan.id ? 'Connecting...' : plan.id === 'free' ? 'Get Started' : 'Subscribe Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Section */}
      <div className="max-w-4xl mx-auto mt-20 border-t border-slate-800/80 pt-10 text-center space-y-4">
        <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">🔒 256-Bit SSL Encrypted</span>
          <span className="flex items-center gap-1.5">⚡ Instant bKash & Card Activation</span>
          <span className="flex items-center gap-1.5">🛡️ No Hidden Charges</span>
          <span className="flex items-center gap-1.5">❌ Cancel Anytime with 1 Click</span>
        </div>
      </div>
    </div>
  );
}
